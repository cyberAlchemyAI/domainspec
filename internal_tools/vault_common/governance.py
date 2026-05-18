"""Governance — runtime witness for `governs` edges.

Closes residue R4 from
`vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md` §C.

A constitution declares its mechanical enforcement via two frontmatter fields:
  - governs_check: list[str]  — names of validators in REGISTRY
  - governs_pattern: str      — glob of files this constitution governs

A `Validator` is any callable that takes a VaultDoc and returns list[str]
of human-readable violations (empty == pass). See the named validators below.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Callable, Protocol

from .walker import VaultDoc


class Validator(Protocol):
    name: str

    def __call__(self, doc: VaultDoc) -> list[str]: ...


@dataclass
class _NamedValidator:
    name: str
    fn: Callable[[VaultDoc], list[str]]

    def __call__(self, doc: VaultDoc) -> list[str]:
        return self.fn(doc)


@dataclass
class Registry:
    """Process-global registry mapping validator name → Validator."""

    _items: dict[str, Validator] = field(default_factory=dict)

    def register(self, name: str) -> Callable[[Callable[[VaultDoc], list[str]]], Validator]:
        def deco(fn: Callable[[VaultDoc], list[str]]) -> Validator:
            v = _NamedValidator(name=name, fn=fn)
            self._items[name] = v
            return v

        return deco

    def get(self, name: str) -> Validator | None:
        return self._items.get(name)

    def names(self) -> list[str]:
        return sorted(self._items)


REGISTRY = Registry()

# --- Concrete validators -----------------------------------------------------

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
        # tolerate ## Claim, ## Claim., ## Claim — anything, case-sensitive heading
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


# --- Dispatch ----------------------------------------------------------------


def check_governance(doc: VaultDoc, registry: Registry = REGISTRY) -> list[str]:
    """Run every validator named in doc.frontmatter['governs_check']."""
    names = (doc.frontmatter or {}).get("governs_check") or []
    if isinstance(names, str):
        names = [names]
    out: list[str] = []
    for n in names:
        out.extend(run_named(n, doc, registry))
    return out


def run_named(name: str, doc: VaultDoc, registry: Registry = REGISTRY) -> list[str]:
    v = registry.get(name)
    if v is None:
        return [f"unknown validator: {name}"]
    return list(v(doc))
