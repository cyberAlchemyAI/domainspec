"""Governance — runtime mechanism for `governs` edges.

Kernel-appropriate primitives only: the `Validator` Protocol, the `Registry`,
and the named-dispatch helpers (`run_named`, `check_governance`).

Concrete validators (rule content) live in the consuming subsystem — see
`vault_governance/_kernel_validators.py` for the three originally-shipped
validators (`has_required_discovery_sections`, `frontmatter_has_schema_version`,
`constitution_declares_witness`).

This split honors discovery D-5 (vault_ctl rescope) and kernel SPEC OQ-C
option 2 — the kernel owns the mechanism, the subsystem owns the rules.
"""

from __future__ import annotations

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


# Process-global default registry. Subsystems register their concrete
# validators against this on import.
REGISTRY = Registry()


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
