"""vault-ctl cycles — instance-level acyclicity check for the edge graph.

Closes residue R3 (§C S10) of the invariants-and-layer-alignment lens.
Governed by `vault/constitution/edge-acyclicity-constitution.md`.

Self-contained Typer subapp. Mount in cli.py via `app.add_typer(cycles_app, name="cycles")`.
"""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path

import typer

from vault_common import EventSink, extract_edges, walk_vault
from vault_common.cycles import ACYCLIC_EDGE_TYPES, find_cycles
from vault_common.edges import Edge

app = typer.Typer(help="Cycle detection on the typed edge graph (S10).")

_EVENT_LOG = Path.home() / ".domainspec-vault" / "events.jsonl"
_sink = EventSink(_EVENT_LOG)


def _collect_edges() -> list[Edge]:
    edges: list[Edge] = []
    for doc in walk_vault():
        edges.extend(extract_edges(doc))
    return edges


def _format_cycle(cycle: list[Edge]) -> str:
    if len(cycle) == 1 and cycle[0].src == cycle[0].dst:
        e = cycle[0]
        return f"  self-loop: {e.src} --{e.edge_type}--> {e.src}"
    parts = [cycle[0].src]
    for e in cycle:
        parts.append(e.dst)
    return "  " + " -> ".join(parts)


@app.command()
def check(strict: bool = typer.Option(False, "--strict", help="Exit non-zero if cycles found.")) -> None:
    """Detect cycles on every acyclic edge type. Report by type."""
    edges = _collect_edges()
    cycles = find_cycles(edges, ACYCLIC_EDGE_TYPES)
    by_type: dict[str, list[list[Edge]]] = defaultdict(list)
    for cyc in cycles:
        by_type[cyc[0].edge_type].append(cyc)

    if not cycles:
        typer.echo(f"no cycles found across {len(edges)} edges "
                   f"({len(ACYCLIC_EDGE_TYPES)} acyclic edge types checked)")
    else:
        for etype in sorted(by_type):
            typer.echo(f"\n[{etype}] {len(by_type[etype])} cycle(s):")
            for cyc in by_type[etype]:
                typer.echo(_format_cycle(cyc))
        typer.echo(f"\ntotal: {len(cycles)} cycle(s) across {len(by_type)} edge type(s)")

    _sink.emit("cycles.checked", edges_seen=len(edges), cycles_found=len(cycles))
    if cycles and strict:
        raise typer.Exit(1)


@app.command()
def report() -> None:
    """Human-readable cycle report: which files, which edge types, counts."""
    edges = _collect_edges()
    cycles = find_cycles(edges, ACYCLIC_EDGE_TYPES)
    typer.echo("# Edge Acyclicity Report")
    typer.echo(f"edges scanned: {len(edges)}")
    typer.echo(f"acyclic edge types: {', '.join(sorted(ACYCLIC_EDGE_TYPES))}")
    typer.echo(f"cycles found: {len(cycles)}\n")
    if not cycles:
        typer.echo("Status: CLEAN. S10 (well-founded derives-from) holds on the populated graph.")
        return
    files_involved: set[str] = set()
    by_type: dict[str, int] = defaultdict(int)
    for cyc in cycles:
        by_type[cyc[0].edge_type] += 1
        for e in cyc:
            files_involved.add(e.src)
            files_involved.add(e.dst)
    typer.echo("## Cycles by edge type")
    for etype, n in sorted(by_type.items()):
        typer.echo(f"  {etype}: {n}")
    typer.echo(f"\n## Files involved ({len(files_involved)})")
    for f in sorted(files_involved):
        typer.echo(f"  {f}")
    typer.echo("\n## Cycle paths")
    for cyc in cycles:
        typer.echo(f"[{cyc[0].edge_type}]")
        typer.echo(_format_cycle(cyc))


if __name__ == "__main__":
    app()
