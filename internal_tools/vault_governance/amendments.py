"""vault-ctl amendments subapp — governance for schema-document evolution.

Implements the L3->L3 self-reference discipline defined by
`vault/constitution/schema-amendment-discipline-constitution.md`. Closes
residue R2 from `discovery/graph-as-residue-attractor/lenses/01-...md` §C.
"""

from __future__ import annotations

from collections import Counter
from datetime import date, datetime
from pathlib import Path

import typer
import yaml

from vault_common import DEFAULT_CONFIG, parse_doc

app = typer.Typer(help="Schema-amendment discipline (closes R2).")

_VAULT = DEFAULT_CONFIG.vault_roots[0]
_AMEND_DIR = _VAULT / "amendments"
_SCHEMA_DIRS = [_VAULT / "constitution"]
_SCHEMA_FILES = [
    _VAULT / "ontology-conventions.md",
    _VAULT / "confidence-levels.md",
    _VAULT / "foundational-knowledges.md",
]
_SELF_EXEMPT = "schema-amendment-discipline-constitution.md"


def _load_amendments() -> list[dict]:
    """Return list of parsed amendment frontmatters, sorted by date."""
    if not _AMEND_DIR.exists():
        return []
    out: list[dict] = []
    for p in sorted(_AMEND_DIR.glob("*.md")):
        doc = parse_doc(p)
        if doc is None or doc.frontmatter is None:
            continue
        fm = dict(doc.frontmatter)
        fm["_path"] = str(p)
        out.append(fm)
    out.sort(key=lambda fm: str(fm.get("date", "")))
    return out


def _schema_docs() -> list[Path]:
    """Enumerate every schema document the discipline governs."""
    found: list[Path] = []
    for d in _SCHEMA_DIRS:
        if d.exists():
            found.extend(sorted(d.glob("*.md")))
    for f in _SCHEMA_FILES:
        if f.exists():
            found.append(f)
    return [p for p in found if p.name != _SELF_EXEMPT]


def _last_updated(p: Path) -> str | None:
    doc = parse_doc(p)
    if doc is None or doc.frontmatter is None:
        return None
    val = doc.frontmatter.get("last_updated")
    return str(val) if val is not None else None


@app.command("list")
def list_cmd() -> None:
    """List all amendments chronologically."""
    rows = _load_amendments()
    if not rows:
        typer.echo("no amendments recorded under vault/amendments/")
        return
    for fm in rows:
        typer.echo(
            f"{fm.get('date')}  {fm.get('amendment_id')}  "
            f"{fm.get('change_type')}  -> {fm.get('schema_document')}"
        )
    typer.echo(f"\n{len(rows)} amendments")


@app.command()
def check(strict: bool = typer.Option(False, "--strict")) -> None:
    """Flag schema documents whose last_updated has no covering amendment."""
    amendments = _load_amendments()
    by_doc: dict[str, list[str]] = {}
    for fm in amendments:
        by_doc.setdefault(str(fm.get("schema_document", "")), []).append(
            str(fm.get("date", ""))
        )
    violations: list[str] = []
    for schema in _schema_docs():
        rel = str(schema.relative_to(_VAULT.parent))
        rel_alt = str(schema.relative_to(_VAULT))
        lu = _last_updated(schema)
        if lu is None:
            continue
        dates = by_doc.get(rel, []) + by_doc.get(rel_alt, []) + by_doc.get(str(schema), [])
        if not dates or max(dates) < lu:
            violations.append(f"{rel}: last_updated={lu} but no amendment covers it")
    for v in violations:
        typer.echo(v)
    typer.echo(
        f"\nchecked {len(_schema_docs())} schema docs; {len(violations)} R2 violations"
    )
    if violations and strict:
        raise typer.Exit(1)


@app.command()
def new(schema_path: str = typer.Argument(...)) -> None:
    """Print an amendment template for the given schema file (does not write)."""
    p = Path(schema_path)
    slug = p.stem.replace("_", "-")
    today = date.today().isoformat()
    rel = str(p.resolve().relative_to(_VAULT.parent)) if p.exists() else schema_path
    typer.echo(f"# write this to: vault/amendments/{today}-{slug}-amendment.md\n")
    typer.echo(
        "---\n"
        f"amendment_id: {today}-{slug}-amendment\n"
        f"date: {today}\n"
        f"schema_document: {rel}\n"
        "change_type: document_version_bump   # or schema_version_bump\n"
        "old_version: <fill>\n"
        "new_version: <fill>\n"
        "trigger:\n"
        "  session: null\n"
        "  discovery: null\n"
        "  falsified_premise: null\n"
        "dependents: []\n"
        "review:\n"
        "  validator_passed: pending\n"
        "  snapshot_tag: null\n"
        "author: <handle>\n"
        "---\n\n"
        "# Amendment: <title>\n\n"
        "## Why\n\n## What changed\n\n## Dependents — required action\n"
    )


@app.command()
def status() -> None:
    """Count amendments by change_type and by month."""
    rows = _load_amendments()
    by_type: Counter[str] = Counter(str(fm.get("change_type", "?")) for fm in rows)
    by_month: Counter[str] = Counter(str(fm.get("date", ""))[:7] for fm in rows)
    typer.echo(f"total amendments: {len(rows)}")
    typer.echo("by change_type:")
    for k, v in sorted(by_type.items()):
        typer.echo(f"  {k}: {v}")
    typer.echo("by month:")
    for k, v in sorted(by_month.items()):
        typer.echo(f"  {k}: {v}")


if __name__ == "__main__":
    app()
