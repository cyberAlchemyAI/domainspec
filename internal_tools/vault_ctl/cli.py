"""vault-ctl CLI: validate, edges-check, snapshot."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import typer
from pydantic import ValidationError

from vault_common import (
    DEFAULT_CONFIG, EDGE_TYPES, EventSink, UnknownNodeTypeError,
    extract_edges, parse_doc, validate_node, walk_vault,
)

from .cycles import app as cycles_app

app = typer.Typer(help="vault-ctl — invariant enforcement for the /domainspec vault")
# `cycles` remains mounted here pending absorption into `vault_ctl validate`
# Tier 3 (per audit T6 + vault_ctl SPEC §ValidateGraphTier3). All other
# previously-mounted subapps (`bets`, `amendments`, `governance`) were
# relocated to `vault_telemetry` and `vault_governance` per D-5 rescope.
app.add_typer(cycles_app, name="cycles", help="Acyclicity checks on the typed edge graph (S10, closes R3).")

_EVENT_LOG = Path.home() / ".domainspec-vault" / "events.jsonl"
_sink = EventSink(_EVENT_LOG)


@app.command()
def validate(
    strict: bool = typer.Option(False, "--strict", help="Exit non-zero on any error"),
    path: str | None = typer.Option(None, help="Validate one path instead of the whole vault"),
) -> None:
    """Validate frontmatter on every vault node against the canonical schema."""
    errors: list[str] = []
    docs_iter = [parse_doc(Path(path))] if path else walk_vault()
    n = 0
    for doc in docs_iter:
        if doc is None:
            continue
        n += 1
        if doc.frontmatter is None:
            errors.append(f"{doc.path}: no frontmatter")
            continue
        if doc.is_session or doc.node_type:
            try:
                validate_node(doc.frontmatter, source_path=str(doc.path))
            except UnknownNodeTypeError as e:
                errors.append(f"{doc.path}: {e}")
            except ValidationError as e:
                errors.append(f"{doc.path}: {e.errors()[0]['msg']} ({e.errors()[0]['loc']})")

    for err in errors:
        typer.echo(err)
    _sink.emit("validation.completed", files_checked=n, errors=len(errors))
    typer.echo(f"\nchecked {n} files, {len(errors)} errors")
    if errors and strict:
        raise typer.Exit(1)


@app.command(name="edges-check")
def edges_check(strict: bool = typer.Option(False, "--strict")) -> None:
    """Check that declared edges resolve and use known edge types."""
    docs = list(walk_vault())
    paths = {str(d.path) for d in docs}
    issues: list[str] = []
    edge_count = 0
    for doc in docs:
        for edge in extract_edges(doc):
            edge_count += 1
            if edge.edge_type not in EDGE_TYPES:
                issues.append(f"{edge.src}: unknown edge type {edge.edge_type}")
            # target existence check — best-effort, paths may be relative
            tgt = edge.dst
            if tgt.endswith(".md") and not tgt.startswith("http"):
                # try absolute and vault-relative resolution
                candidates = [Path(tgt), DEFAULT_CONFIG.vault_roots[0] / tgt]
                if not any(c.exists() for c in candidates):
                    issues.append(f"{edge.src}: dangling edge {edge.edge_type} -> {tgt}")
    for i in issues:
        typer.echo(i)
    _sink.emit("edges.checked", edges_seen=edge_count, issues=len(issues))
    typer.echo(f"\n{edge_count} edges across {len(docs)} docs; {len(issues)} issues")
    if issues and strict:
        raise typer.Exit(1)


@app.command()
def snapshot(
    tag: str = typer.Argument(..., help="Snapshot tag (e.g. vault-corpus-v1)"),
    description: str = typer.Option("", "--desc"),
) -> None:
    """Take a content-addressed snapshot of the vault."""
    entries: dict[str, dict] = {}
    for doc in walk_vault():
        rel = str(doc.path)
        entries[rel] = {
            "sha256": doc.content_hash,
            "bytes": len(doc.text),
        }
    corpus_lines = "".join(f"{p}\t{e['sha256']}\n" for p, e in entries.items())
    corpus_hash = hashlib.sha256(corpus_lines.encode()).hexdigest()
    manifest = {
        "tag": tag,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "description": description,
        "file_count": len(entries),
        "corpus_hash": corpus_hash,
        "entries": entries,
    }
    out = DEFAULT_CONFIG.vault_roots[0] / "snapshots" / f"{tag}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(manifest, indent=2))
    _sink.emit("snapshot.taken", tag=tag, file_count=len(entries), corpus_hash=corpus_hash)
    typer.echo(f"wrote {out}: {len(entries)} files, corpus_hash={corpus_hash[:16]}...")


@app.command()
def status() -> None:
    """Quick counts: files by node_type, by status."""
    by_type: dict[str, int] = {}
    by_status: dict[str, int] = {}
    total = 0
    for doc in walk_vault():
        total += 1
        fm = doc.frontmatter or {}
        t = fm.get("node_type", "<none>")
        s = fm.get("status", "<none>")
        by_type[t] = by_type.get(t, 0) + 1
        by_status[s] = by_status.get(s, 0) + 1
    typer.echo(f"total: {total}")
    typer.echo("by node_type:")
    for k, v in sorted(by_type.items()):
        typer.echo(f"  {k}: {v}")
    typer.echo("by status:")
    for k, v in sorted(by_status.items()):
        typer.echo(f"  {k}: {v}")


if __name__ == "__main__":
    app()
