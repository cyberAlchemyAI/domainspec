"""Policy wrapper around scripts/audit_richness.py.

The guard intentionally keeps the existing L1 audit as the source of truth.
This module only normalizes audit findings into a small PASS/FLAG/BLOCK
contract suitable for CI, pre-commit, and future editor integrations.
"""

from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


Verdict = str


@dataclass(frozen=True)
class GuardPolicy:
    """Thresholds for turning audit findings into a guard verdict."""

    m6_threshold: int = 0
    minimum_faithfulness_ratio: float = 0.8
    unwitnessed_edges_block_threshold: int | None = None
    lean_enabled: bool = False
    lean_required: bool = False
    validator_root: Path | None = None


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _load_audit_module() -> Any:
    audit_path = _repo_root() / "scripts" / "audit_richness.py"
    spec = importlib.util.spec_from_file_location("audit_richness", audit_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load audit module at {audit_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _strip_internal(report: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in report.items() if not k.startswith("_")}


def _diagnostic(
    code: str,
    severity: Verdict,
    message: str,
    *,
    concept: str | None = None,
    edge_type: str | None = None,
    target: str | None = None,
    source: str | None = None,
    remediation: str | None = None,
) -> dict[str, Any]:
    out: dict[str, Any] = {
        "code": code,
        "severity": severity,
        "message": message,
    }
    if concept is not None:
        out["concept"] = concept
    if edge_type is not None:
        out["edgeType"] = edge_type
    if target is not None:
        out["target"] = target
    if source is not None:
        out["source"] = source
    if remediation is not None:
        out["remediation"] = remediation
    return out


def _max_verdict(diagnostics: list[dict[str, Any]]) -> Verdict:
    if any(d["severity"] == "block" for d in diagnostics):
        return "block"
    if any(d["severity"] == "flag" for d in diagnostics):
        return "flag"
    return "pass"


def _lean_sources_available(validator_root: Path) -> bool:
    has_lean = any(validator_root.rglob("*.lean")) if validator_root.exists() else False
    has_project_file = any(
        (validator_root / name).exists()
        for name in ("lakefile.lean", "lakefile.toml", "lean-toolchain")
    )
    return has_lean and has_project_file


def evaluate_report(
    report: dict[str, Any],
    policy: GuardPolicy | None = None,
) -> dict[str, Any]:
    """Convert an audit report into a stable diagnostic bundle."""

    policy = policy or GuardPolicy()
    summary = report.get("summary", {})
    checks = report.get("checks", {})
    diagnostics: list[dict[str, Any]] = []

    if summary.get("parser_blind"):
        diagnostics.append(
            _diagnostic(
                "PARSER_BLIND",
                "block",
                "Audit extracted no trustworthy relational structure.",
                remediation="Use supported anchors and bold prefixes so typed edges are visible.",
            )
        )

    if summary.get("concepts", 0) > 0 and summary.get("typed_edges", 0) == 0:
        diagnostics.append(
            _diagnostic(
                "ZERO_TYPED_EDGES",
                "block",
                "Spec has a non-empty registry but zero typed edges.",
                remediation="Declare relationships in aspect files before treating the spec as compilable.",
            )
        )

    m6_clusters = checks.get("m6_clusters", [])
    if len(m6_clusters) > policy.m6_threshold:
        for cluster in m6_clusters:
            target = cluster.get("target")
            edge_type = cluster.get("edge_type")
            sources = ", ".join(cluster.get("sources", []))
            diagnostics.append(
                _diagnostic(
                    "M6_CLUSTER",
                    "block",
                    f"M6 residue cluster: {target} receives {edge_type} from unrelated sources {sources}.",
                    edge_type=edge_type,
                    target=target,
                    remediation=cluster.get("fix") or "Differentiate targets or declare the missing relationship.",
                )
            )

    ratio = float(summary.get("faithfulness_ratio") or 0)
    if ratio < policy.minimum_faithfulness_ratio:
        diagnostics.append(
            _diagnostic(
                "LOW_FAITHFULNESS_RATIO",
                "flag",
                f"Test faithfulness ratio {ratio:.2f} is below {policy.minimum_faithfulness_ratio:.2f}.",
                remediation="Generate or update TEST-SPEC.md before treating runtime fidelity as covered.",
            )
        )

    unwitnessed = checks.get("unwitnessed_edges", [])
    if unwitnessed:
        severity = (
            "block"
            if policy.unwitnessed_edges_block_threshold is not None
            and len(unwitnessed) >= policy.unwitnessed_edges_block_threshold
            else "flag"
        )
        for item in unwitnessed:
            diagnostics.append(
                _diagnostic(
                    "UNWITNESSED_EDGE",
                    severity,
                    f"{item.get('concept')} is missing {item.get('kind')} {item.get('edge_type')}.",
                    concept=item.get("concept"),
                    edge_type=item.get("edge_type"),
                    remediation=item.get("fix"),
                )
            )

    for item in checks.get("collisions", []):
        concepts = item.get("concepts", [])
        diagnostics.append(
            _diagnostic(
                "STRUCTURAL_COLLISION",
                "flag",
                "Concepts have indistinguishable derivation signatures: "
                + ", ".join(concepts),
                concept=", ".join(concepts),
                remediation=item.get("fix"),
            )
        )

    if policy.lean_enabled or policy.lean_required:
        root = policy.validator_root or (_repo_root() / "internal_tools" / "lean-code-validator")
        if not _lean_sources_available(root):
            diagnostics.append(
                _diagnostic(
                    "LEAN_VALIDATOR_UNAVAILABLE",
                    "block" if policy.lean_required else "flag",
                    f"Lean validator source project is unavailable at {root}.",
                    source=str(root),
                    remediation="Restore lakefile, lean-toolchain, and Lean source files before requiring Lean validation.",
                )
            )

    verdict = _max_verdict(diagnostics)
    return {
        "verdict": verdict,
        "summary": {
            "concepts": summary.get("concepts", 0),
            "typedEdges": summary.get("typed_edges", 0),
            "m6Clusters": len(m6_clusters),
            "faithfulnessRatio": ratio,
            "parserBlind": bool(summary.get("parser_blind")),
            "auditVerdict": summary.get("verdict"),
        },
        "diagnostics": diagnostics,
        "rawAudit": _strip_internal(report),
    }


def run_guard(
    spec_dir: Path,
    *,
    policy: GuardPolicy | None = None,
    strict: bool = True,
    test_spec_name: str = "TEST-SPEC.md",
) -> dict[str, Any]:
    """Run the L1 audit and evaluate the guard policy."""

    policy = policy or GuardPolicy()
    audit = _load_audit_module()
    stderr = io.StringIO()
    with contextlib.redirect_stderr(stderr):
        report = audit.run_audit(
            spec_dir.resolve(),
            strict=strict,
            test_spec_name=test_spec_name,
        )
    if report is None:
        message = stderr.getvalue().strip() or "audit failed"
        return {
            "verdict": "block",
            "summary": {
                "concepts": 0,
                "typedEdges": 0,
                "m6Clusters": 0,
                "faithfulnessRatio": 0,
                "parserBlind": False,
                "auditVerdict": "AUDIT_ERROR",
            },
            "diagnostics": [
                _diagnostic(
                    "AUDIT_ERROR",
                    "block",
                    message,
                    source=str(spec_dir),
                    remediation="Fix SPEC.md and aspect-file structure, then rerun the guard.",
                )
            ],
            "rawAudit": None,
        }
    return evaluate_report(report, policy=policy)


def dumps(bundle: dict[str, Any]) -> str:
    return json.dumps(bundle, indent=2, sort_keys=True, default=str)
