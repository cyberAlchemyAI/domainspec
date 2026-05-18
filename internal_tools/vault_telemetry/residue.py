"""Residue counter. Diffs two vault snapshots and reports per-residue activity.

The four predicted residues from `graph-as-residue-attractor`:
  R1 — convicção (commitment axis without instance carrier)
  R2 — schema-meta evolution (no instance discipline for schema documents)
  R3 — derives-from circularity (no instance-level non-circularity check)
  R4 — governs-edges enforcement (no runtime witness for governs)

Files are tagged as addressing a residue via the optional frontmatter field
`addresses-residue: [R1|R2|R3|R4]` OR by being linked from the parent
discovery via `derives-from`. MVP uses the explicit tag; edge-traversal
fallback is deferred.
"""

from __future__ import annotations

import json
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

from vault_common import walk_vault

RESIDUE_NAMES = {
    "R1": "convicção (commitment axis without instance carrier)",
    "R2": "schema-meta evolution (no instance discipline for schema)",
    "R3": "derives-from circularity (no instance-level non-circularity check)",
    "R4": "governs-edges enforcement (no runtime witness for governs)",
}


@dataclass
class ResidueReport:
    snapshot_from: str
    snapshot_to: str
    new_files: list[str]
    new_constitutions: list[str]
    new_lenses: list[str]
    by_residue: dict[str, list[str]]  # residue code -> new files addressing it
    new_lenses_by_verification: dict[str, int]

    def render(self) -> str:
        lines: list[str] = []
        lines.append(f"# Residue Report: {self.snapshot_from} → {self.snapshot_to}\n")
        lines.append(f"- new files: {len(self.new_files)}")
        lines.append(f"- new constitutions: {len(self.new_constitutions)}")
        lines.append(f"- new lenses: {len(self.new_lenses)}")
        lines.append("\n## Lenses by verification\n")
        for k, v in sorted(self.new_lenses_by_verification.items()):
            lines.append(f"- `{k}`: {v}")
        lines.append("\n## Predicted residues — empirical activity\n")
        for code, name in RESIDUE_NAMES.items():
            hits = self.by_residue.get(code, [])
            lines.append(f"### {code} — {name}")
            lines.append(f"- new files addressing: **{len(hits)}**")
            for h in hits:
                lines.append(f"  - {h}")
            lines.append("")
        return "\n".join(lines)


def _load_snapshot(path: Path) -> dict[str, dict]:
    return json.loads(path.read_text())["entries"]


def diff_snapshots(snap_from: Path, snap_to: Path) -> ResidueReport:
    """Compare two snapshot manifests and produce a residue report."""
    a = _load_snapshot(snap_from)
    b = _load_snapshot(snap_to)
    new_paths = sorted(set(b) - set(a))

    new_files = list(new_paths)
    new_constitutions: list[str] = []
    new_lenses: list[str] = []
    by_residue: dict[str, list[str]] = {}
    verif_counter: Counter[str] = Counter()

    for doc in walk_vault():
        rel = str(doc.path)
        if rel not in new_paths:
            continue
        fm = doc.frontmatter or {}
        if fm.get("node_type") == "constitution":
            new_constitutions.append(rel)
        if "/lenses/" in rel or fm.get("lens"):
            new_lenses.append(rel)
            verif = fm.get("verification", [])
            if isinstance(verif, list):
                for v in verif:
                    verif_counter[v] += 1
        for residue in fm.get("addresses-residue", []) or []:
            by_residue.setdefault(residue, []).append(rel)

    return ResidueReport(
        snapshot_from=snap_from.name,
        snapshot_to=snap_to.name,
        new_files=new_files,
        new_constitutions=new_constitutions,
        new_lenses=new_lenses,
        by_residue=by_residue,
        new_lenses_by_verification=dict(verif_counter),
    )
