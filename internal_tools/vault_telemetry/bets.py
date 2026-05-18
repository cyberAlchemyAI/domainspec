"""vault-telemetry bets — Typer subapp for the convicção bet ledger.

Relocated from `vault_ctl/bets.py` per D-5 rescope (decision D-B in the
2026-05-18 relocation session): bets are telemetry-shaped — the falsifiability
mechanism for the same high-convicção claims telemetry will score for
promotion/demotion. Mounted in `vault_telemetry/cli.py` as the `bets`
subcommand.

The `new` command honors no-auto-promotion: it prints, never writes.

Per D-4: this subsystem MUST NOT read another subsystem's SQLite store. The
current implementation reads only via the kernel walker (`walk_vault`,
`parse_doc`) — no cross-subsystem DB access.
"""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path

import typer
from pydantic import ValidationError

from vault_common import DEFAULT_CONFIG, parse_doc, walk_vault

from ._bets_kernel import (
    BetFrontmatter, is_active_status, is_bet_path, is_live_bet,
)

app = typer.Typer(help="vault-telemetry bets — convicção bet ledger (R1 closure)")
_STATUSES = ("open", "called-true", "called-false", "withdrawn")


def _bet_docs():
    for doc in walk_vault():
        if is_bet_path(doc.path) and doc.frontmatter is not None:
            yield doc


def _claim_to_bets() -> dict[str, list[dict]]:
    out: dict[str, list[dict]] = defaultdict(list)
    for doc in _bet_docs():
        fm = doc.frontmatter or {}
        if claim := str(fm.get("for_claim", "")):
            out[claim].append(fm)
    return out


@app.command("list")
def list_cmd() -> None:
    """List all bets, grouped by status."""
    buckets: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for doc in _bet_docs():
        fm = doc.frontmatter or {}
        buckets[str(fm.get("status", "?"))].append((str(fm.get("bet_id", "?")), str(doc.path)))
    if not buckets:
        typer.echo("no bets recorded"); return
    for status in _STATUSES:
        rows = buckets.get(status, [])
        if not rows: continue
        typer.echo(f"\n[{status}] ({len(rows)})")
        for bet_id, path in sorted(rows):
            typer.echo(f"  {bet_id}  {path}")


@app.command()
def orphans() -> None:
    """List high-convicção active+ nodes lacking a live bet (R1 violations)."""
    claim_bets = _claim_to_bets()
    vault_root = DEFAULT_CONFIG.vault_roots[0]
    violations: list[str] = []
    for doc in walk_vault():
        if is_bet_path(doc.path): continue
        fm = doc.frontmatter or {}
        if fm.get("convicção") != "high" or not is_active_status(fm.get("status")):
            continue
        try:
            rel = str(doc.path.relative_to(vault_root))
        except ValueError:
            rel = str(doc.path)
        live = [b for b in claim_bets.get(rel, []) + claim_bets.get(str(doc.path), [])
                if is_live_bet(b.get("status"))]
        if not live:
            violations.append(rel)
    if not violations:
        typer.echo("no orphans — R1 closed on the current vault"); return
    typer.echo(f"{len(violations)} high-convicção node(s) without a live bet:")
    for v in sorted(violations):
        typer.echo(f"  {v}")


@app.command()
def validate(strict: bool = typer.Option(False, "--strict")) -> None:
    """Validate every bet's frontmatter against BetFrontmatter."""
    errors, n = [], 0
    for doc in _bet_docs():
        n += 1
        try:
            BetFrontmatter.model_validate(doc.frontmatter)
        except ValidationError as e:
            errors.append(f"{doc.path}: {e.errors()[0]['msg']} ({e.errors()[0]['loc']})")
    for err in errors: typer.echo(err)
    typer.echo(f"\nchecked {n} bets, {len(errors)} errors")
    if errors and strict: raise typer.Exit(1)


_TEMPLATE = (
    "---\nbet_id: B-NNN\nfor_claim: {for_claim}\nstaked_on: YYYY-MM-DD\n"
    "falsification_test: <one-line concrete observable>\n"
    "dependents:\n  - <path to artifact that would need revision>\n"
    "status: open\nconvicção_at_stake: high\n---\n\n"
    "# Bet B-NNN — <short title>\n\n"
    "Why bet-worthy. What success looks like. What failure looks like.\n"
)


@app.command()
def new(for_claim: str = typer.Argument(..., help="Path to the high-convicção claim node")) -> None:
    """Print a bet template for the given claim (does NOT write — no auto-promotion)."""
    target = Path(for_claim)
    if target.exists():
        doc = parse_doc(target)
        conv = (doc.frontmatter or {}).get("convicção") if doc else None
        if conv != "high":
            typer.echo(f"# warning: {for_claim} convicção is {conv!r}, not 'high'")
    typer.echo(_TEMPLATE.format(for_claim=for_claim))
