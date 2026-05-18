"""Cycle detection on the typed edge graph.

Closes R3 of the invariants-and-layer-alignment lens: a populated, instance-level
check that `derives-from` (and other direction-of-justification edge types) is
acyclic on the actual vault edge graph. See
`vault/constitution/edge-acyclicity-constitution.md`.

Pure functions; no I/O. Caller supplies the edges.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable

from .edges import Edge

# Edge types declared acyclic in edge-acyclicity-constitution.md §1.
ACYCLIC_EDGE_TYPES: frozenset[str] = frozenset({
    "derives-from", "supersedes", "governs", "part-of",
    "codified-as", "operationalized-by", "validates", "creates", "modifies",
})


def _is_vault_target(dst: str) -> bool:
    """Edges to URLs / non-markdown / external targets cannot form in-vault cycles."""
    return dst.endswith(".md") and not dst.startswith(("http://", "https://"))


def find_cycles(
    edges: Iterable[Edge],
    edge_types: Iterable[str] = ACYCLIC_EDGE_TYPES,
) -> list[list[Edge]]:
    """Return every simple cycle in the subgraph restricted to `edge_types`.

    Each cycle is returned as a list of Edges whose `src→dst` chain closes
    back to the starting node. Self-loops are reported as one-edge cycles.
    Detection is per-edge-type: a cycle that mixes edge types is *not*
    reported — semantic discipline lives per type.
    """
    wanted = frozenset(edge_types)
    cycles: list[list[Edge]] = []

    by_type: dict[str, list[Edge]] = defaultdict(list)
    for e in edges:
        if e.edge_type in wanted and _is_vault_target(e.dst):
            by_type[e.edge_type].append(e)

    for etype, type_edges in by_type.items():
        adj: dict[str, list[Edge]] = defaultdict(list)
        for e in type_edges:
            adj[e.src].append(e)
            if e.src == e.dst:  # self-loop
                cycles.append([e])

        WHITE, GRAY, BLACK = 0, 1, 2
        color: dict[str, int] = defaultdict(lambda: WHITE)
        stack_edges: list[Edge] = []
        stack_nodes: list[str] = []
        seen_cycles: set[tuple[str, ...]] = set()

        def visit(node: str) -> None:
            color[node] = GRAY
            stack_nodes.append(node)
            for e in adj.get(node, []):
                if e.src == e.dst:
                    continue  # already recorded
                stack_edges.append(e)
                nxt = e.dst
                if color[nxt] == GRAY:
                    i = stack_nodes.index(nxt)
                    cyc = stack_edges[i:]
                    key = tuple(sorted((ed.src, ed.dst, ed.edge_type) for ed in cyc))
                    if key not in seen_cycles:
                        seen_cycles.add(key)
                        cycles.append(list(cyc))
                elif color[nxt] == WHITE:
                    visit(nxt)
                stack_edges.pop()
            stack_nodes.pop()
            color[node] = BLACK

        for n in list(adj.keys()):
            if color[n] == WHITE:
                visit(n)

    return cycles
