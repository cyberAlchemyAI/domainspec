"""vault-telemetry CLI: scan, report, residues."""

from __future__ import annotations

import json
from pathlib import Path

import typer

from vault_common import DEFAULT_CONFIG, walk_vault

from .residue import diff_snapshots

app = typer.Typer(help="vault-telemetry — read-only metrics for the /domainspec vault")


@app.command()
def status() -> None:
    """Quick health snapshot of the vault (no diff)."""
    by_type: dict[str, int] = {}
    by_status: dict[str, int] = {}
    by_verification: dict[str, int] = {}
    total = 0
    for doc in walk_vault():
        total += 1
        fm = doc.frontmatter or {}
        by_type[fm.get("node_type", "<none>")] = by_type.get(fm.get("node_type", "<none>"), 0) + 1
        by_status[fm.get("status", "<none>")] = by_status.get(fm.get("status", "<none>"), 0) + 1
        for v in (fm.get("verification") or []):
            if isinstance(v, str):
                by_verification[v] = by_verification.get(v, 0) + 1
    typer.echo(f"total: {total}")
    typer.echo("by node_type:")
    for k, v in sorted(by_type.items()):
        typer.echo(f"  {k}: {v}")
    typer.echo("by status:")
    for k, v in sorted(by_status.items()):
        typer.echo(f"  {k}: {v}")
    typer.echo("lens verification (where present):")
    for k, v in sorted(by_verification.items()):
        typer.echo(f"  {k}: {v}")


@app.command()
def residues(
    snap_from: str = typer.Argument(..., help="Snapshot tag or path (e.g. 2026-05-16-v0)"),
    snap_to: str = typer.Argument(..., help="Snapshot tag or path"),
    out: str | None = typer.Option(None, "--out", help="Write report to this path"),
) -> None:
    """Diff two snapshots and produce the per-residue activity report."""
    snap_dir = DEFAULT_CONFIG.vault_roots[0] / "snapshots"
    p_from = Path(snap_from) if snap_from.endswith(".json") else snap_dir / f"{snap_from}.json"
    p_to = Path(snap_to) if snap_to.endswith(".json") else snap_dir / f"{snap_to}.json"
    if not p_from.exists():
        typer.echo(f"snapshot not found: {p_from}")
        raise typer.Exit(1)
    if not p_to.exists():
        typer.echo(f"snapshot not found: {p_to}")
        raise typer.Exit(1)
    report = diff_snapshots(p_from, p_to)
    rendered = report.render()
    typer.echo(rendered)
    if out:
        Path(out).write_text(rendered)
        typer.echo(f"\nwrote {out}")


if __name__ == "__main__":
    app()
