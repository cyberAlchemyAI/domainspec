"""Concrete validators registered into the kernel `governance.REGISTRY`.

These were originally shipped inside `vault_common/governance.py` but per
kernel SPEC OQ-C option 2 (and the D-5 vault_ctl rescope) the *mechanism*
stays in the kernel while the *rules* live with the subsystem that owns them.

Importing this module registers all three validators with the process-global
`vault_common.governance.REGISTRY`. The `vault_governance` package imports it
at package init so consumers get the validators by importing the subsystem.
"""

from __future__ import annotations

import re

from vault_common.governance import REGISTRY
from vault_common.walker import VaultDoc

_DISCOVERY_SECTIONS = (
    "Claim", "Status", "Summary", "Lenses", "Open Questions", "Next Moves",
)


@REGISTRY.register("has_required_discovery_sections")
def _has_required_discovery_sections(doc: VaultDoc) -> list[str]:
    """Per discovery-structure-constitution §3: README has these H2 sections."""
    if not doc.path.name == "README.md":
        return []
    missing: list[str] = []
    for section in _DISCOVERY_SECTIONS:
        pattern = re.compile(rf"^#{{1,3}}\s+{re.escape(section)}\b", re.MULTILINE)
        if not pattern.search(doc.body):
            missing.append(section)
    if missing:
        return [f"missing required discovery section(s): {', '.join(missing)}"]
    return []


@REGISTRY.register("frontmatter_has_schema_version")
def _frontmatter_has_schema_version(doc: VaultDoc) -> list[str]:
    """Per frontmatter-ownership-constitution §4: schema_version is required."""
    fm = doc.frontmatter or {}
    if "schema_version" not in fm:
        return ["frontmatter missing required key: schema_version"]
    return []


@REGISTRY.register("constitution_declares_witness")
def _constitution_declares_witness(doc: VaultDoc) -> list[str]:
    """Per governs-runtime-witness-constitution §1: a constitution must declare
    governs_check or governs_pattern; otherwise it is the R4 labeling residue."""
    fm = doc.frontmatter or {}
    if fm.get("node_type") != "constitution":
        return []
    if not (fm.get("governs_check") or fm.get("governs_pattern")):
        return ["constitution declares neither governs_check nor governs_pattern (R4 residue)"]
    return []


_STRATEGY_SPEC_REQUIRED_SECTIONS = (
    "R25",  # spec schema
    "R26",  # validator gate
    "R27",  # heuristic_row attribution
    "R28",  # telemetry event
)

_STRATEGY_SPEC_REQUIRED_SCHEMA_KEYS = (
    "spec_version",
    "dispatch_id",
    "dispatch_kind",
    "mode",
    "goal",
    "loop_cap",
    "layers",
    "validator",
    "telemetry",
)


@REGISTRY.register("strategy_spec_schema_valid")
def _strategy_spec_schema_valid(doc: VaultDoc) -> list[str]:
    """Per domainspec-subagents-strategy-constitution §10 (R25–R28): the
    constitution declaring this check must (a) actually define R25–R28 and
    (b) document the canonical R25 schema keys in its body. Closes the
    v0.2.0 bootstrap_override anchor for governance registry wiring."""
    fm = doc.frontmatter or {}
    if fm.get("node_type") != "constitution":
        return []
    if "strategy_spec_schema_valid" not in (fm.get("governs_check") or []):
        return []
    issues: list[str] = []
    for section in _STRATEGY_SPEC_REQUIRED_SECTIONS:
        pattern = re.compile(rf"###\s+{re.escape(section)}\b", re.MULTILINE)
        if not pattern.search(doc.body):
            issues.append(f"missing rule section header: {section}")
    for key in _STRATEGY_SPEC_REQUIRED_SCHEMA_KEYS:
        pattern = re.compile(rf"^{re.escape(key)}\s*:", re.MULTILINE)
        if not pattern.search(doc.body):
            issues.append(f"R25 schema documentation missing key: {key}")
    return issues
