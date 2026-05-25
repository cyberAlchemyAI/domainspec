"""Command line interface for the categorical tooling guard."""

from __future__ import annotations

import argparse
from pathlib import Path

from .guard import GuardPolicy, dumps, run_guard


def _render_text(bundle: dict) -> str:
    lines = []
    summary = bundle["summary"]
    lines.append(f"Categorical tooling guard: {bundle['verdict'].upper()}")
    lines.append(
        "concepts={concepts} typed_edges={typedEdges} m6={m6Clusters} "
        "faithfulness={faithfulnessRatio:.2f} parser_blind={parserBlind}".format(
            **summary
        )
    )
    if bundle["diagnostics"]:
        lines.append("")
        for diag in bundle["diagnostics"]:
            lines.append(f"[{diag['severity'].upper()}] {diag['code']}: {diag['message']}")
            remediation = diag.get("remediation")
            if remediation:
                lines.append(f"  fix: {remediation}")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="categorical-tooling-guard",
        description="Run DomainSpec L1 categorical guard diagnostics.",
    )
    parser.add_argument("spec_dir", type=Path, help="Directory containing SPEC.md.")
    parser.add_argument("--json", action="store_true", help="Emit JSON bundle.")
    parser.add_argument("--permissive", action="store_true",
                        help="Use audit_richness permissive parser mode.")
    parser.add_argument("--test-spec", default="TEST-SPEC.md",
                        help="Test spec filename inside spec_dir.")
    parser.add_argument("--m6-threshold", type=int, default=0,
                        help="Allowed M6 cluster count before BLOCK.")
    parser.add_argument("--min-faithfulness", type=float, default=0.8,
                        help="Faithfulness ratio below this emits FLAG.")
    parser.add_argument("--block-unwitnessed-at", type=int, default=None,
                        help="If set, block when unwitnessed edge count reaches this threshold.")
    parser.add_argument("--lean", action="store_true",
                        help="Check Lean validator source availability and FLAG if missing.")
    parser.add_argument("--require-lean", action="store_true",
                        help="Require Lean validator source availability; missing source BLOCKs.")
    parser.add_argument("--validator-root", type=Path, default=None,
                        help="Lean validator root to check.")
    parser.add_argument("--fail-on-flag", action="store_true",
                        help="Exit non-zero on FLAG as well as BLOCK.")
    args = parser.parse_args(argv)

    policy = GuardPolicy(
        m6_threshold=args.m6_threshold,
        minimum_faithfulness_ratio=args.min_faithfulness,
        unwitnessed_edges_block_threshold=args.block_unwitnessed_at,
        lean_enabled=args.lean,
        lean_required=args.require_lean,
        validator_root=args.validator_root,
    )
    bundle = run_guard(
        args.spec_dir,
        policy=policy,
        strict=not args.permissive,
        test_spec_name=args.test_spec,
    )
    print(dumps(bundle) if args.json else _render_text(bundle))

    if bundle["verdict"] == "block":
        return 2
    if bundle["verdict"] == "flag" and args.fail_on_flag:
        return 1
    return 0

