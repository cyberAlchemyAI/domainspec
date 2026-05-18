"""Tests for vault_common.cycles. Covers: no-cycle, 2-cycle, 3-cycle,
self-loop, mixed edge types where only some are acyclic, external-target exclusion.
"""

from __future__ import annotations

from vault_common.cycles import ACYCLIC_EDGE_TYPES, find_cycles
from vault_common.edges import Edge


def _e(s: str, d: str, t: str = "derives-from") -> Edge:
    return Edge(src=f"{s}.md", dst=f"{d}.md", edge_type=t)


def test_no_cycle() -> None:
    edges = [_e("a", "b"), _e("b", "c"), _e("c", "d")]
    assert find_cycles(edges, ACYCLIC_EDGE_TYPES) == []


def test_two_cycle() -> None:
    cycles = find_cycles([_e("a", "b"), _e("b", "a")], ACYCLIC_EDGE_TYPES)
    assert len(cycles) == 1 and len(cycles[0]) == 2


def test_three_cycle() -> None:
    cycles = find_cycles([_e("a", "b"), _e("b", "c"), _e("c", "a")], ACYCLIC_EDGE_TYPES)
    assert len(cycles) == 1 and len(cycles[0]) == 3


def test_self_loop() -> None:
    cycles = find_cycles([Edge(src="x.md", dst="x.md", edge_type="derives-from")], ACYCLIC_EDGE_TYPES)
    assert len(cycles) == 1 and len(cycles[0]) == 1


def test_mixed_edge_types_only_acyclic_checked() -> None:
    # cites is NOT acyclic; the cites cycle must be ignored.
    edges = [_e("a", "b", "cites"), _e("b", "a", "cites"),
             _e("p", "q", "derives-from"), _e("q", "p", "derives-from")]
    cycles = find_cycles(edges, ACYCLIC_EDGE_TYPES)
    assert len(cycles) == 1
    assert all(e.edge_type == "derives-from" for e in cycles[0])


def test_external_targets_excluded() -> None:
    # URL targets cannot participate in an in-vault cycle.
    edges = [Edge(src="a.md", dst="https://example.com", edge_type="derives-from")]
    assert find_cycles(edges, ACYCLIC_EDGE_TYPES) == []
