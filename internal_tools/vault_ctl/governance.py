"""vault-ctl governance — coverage, audit, check for the R4 witness.

Reports whether `governs` edges have a runtime witness, per
`vault/constitution/governs-runtime-witness-constitution.md`.
"""

from __future__ import annotations

import fnmatch
from dataclasses import dataclass
from pathlib import Path

import typer

from vault_common import DEFAULT_CONFIG, parse_doc, walk_vault
from vault_common.governance import run_named

app = typer.Typer(help="governance — runtime witness for `governs` edges (R4)")


@dataclass
class _ConSpec:
    path: Path
    pattern: str | None
    checks: list[str]


def _load_constitutions() -> list[_ConSpec]:
    out: list[_ConSpec] = []
    for doc in walk_vault():
        fm = doc.frontmatter or {}
        if fm.get("node_type") != "constitution":
            continue
        pattern = fm.get("governs_pattern")
        checks = fm.get("governs_check") or []
        if isinstance(checks, str):
            checks = [checks]
        out.append(_ConSpec(path=doc.path, pattern=pattern, checks=list(checks)))
    return out


def _matches(path: Path, pattern: str, repo_root: Path) -> bool:
    try:
        rel = path.relative_to(repo_root)
    except ValueError:
        rel = path
    return fnmatch.fnmatch(str(rel), pattern)


def _enforcement_status(spec: _ConSpec) -> str:
    has_check = bool(spec.checks)
    has_pattern = bool(spec.pattern)
    if has_check and has_pattern:
        return "enforced"
    if has_check:
        return "checked"
    if has_pattern:
        return "pattern-only"
    return "labeling-only"


@app.command()
def audit(
    strict: bool = typer.Option(False, "--strict", help="Exit non-zero on any labeling-only"),
) -> None:
    """List every constitution and its enforcement status."""
    specs = _load_constitutions()
    buckets: dict[str, list[_ConSpec]] = {}
    for s in specs:
        buckets.setdefault(_enforcement_status(s), []).append(s)
    for status in ("enforced", "checked", "pattern-only", "labeling-only"):
        items = buckets.get(status, [])
        typer.echo(f"\n[{status}] ({len(items)})")
        for s in items:
            extra = []
            if s.pattern:
                extra.append(f"pattern={s.pattern}")
            if s.checks:
                extra.append(f"checks={','.join(s.checks)}")
            typer.echo(f"  {s.path}  {' '.join(extra)}")
    typer.echo(
        f"\ntotal: {len(specs)} constitutions; "
        f"R4 residue (labeling-only): {len(buckets.get('labeling-only', []))}"
    )
    if strict and buckets.get("labeling-only"):
        raise typer.Exit(1)


@app.command()
def coverage(
    constitution: str | None = typer.Option(None, "--constitution"),
    strict: bool = typer.Option(False, "--strict"),
) -> None:
    """For every file matching a constitution's pattern, run its checks."""
    repo_root = DEFAULT_CONFIG.vault_roots[0].parent
    specs = [s for s in _load_constitutions() if s.pattern]
    if constitution:
        specs = [s for s in specs if constitution in str(s.path)]
    if not specs:
        typer.echo("no constitutions with governs_pattern matched")
        raise typer.Exit(0)
    all_docs = list(walk_vault())
    total_files = 0
    total_violations = 0
    for spec in specs:
        typer.echo(f"\n# {spec.path.name}  (pattern={spec.pattern})")
        for doc in all_docs:
            if not _matches(doc.path, spec.pattern, repo_root):
                continue
            total_files += 1
            if not spec.checks:
                typer.echo(f"  [pattern-only] {doc.path}")
                continue
            violations = [v for n in spec.checks for v in run_named(n, doc)]
            if violations:
                total_violations += len(violations)
                typer.echo(f"  FAIL {doc.path}")
                for v in violations:
                    typer.echo(f"    - {v}")
            else:
                typer.echo(f"  pass {doc.path}")
    typer.echo(f"\n{total_files} files checked; {total_violations} violations")
    if strict and total_violations:
        raise typer.Exit(1)


@app.command()
def check(
    constitution_path: Path = typer.Argument(...),
    target_path: Path = typer.Argument(...),
) -> None:
    """Run the named constitution's governs_check validators against one target."""
    con = parse_doc(constitution_path)
    tgt = parse_doc(target_path)
    if con is None or tgt is None:
        typer.echo("could not parse constitution or target")
        raise typer.Exit(2)
    checks = (con.frontmatter or {}).get("governs_check") or []
    if isinstance(checks, str):
        checks = [checks]
    if not checks:
        typer.echo(f"{constitution_path}: no governs_check declared")
        raise typer.Exit(0)
    violations: list[str] = []
    for name in checks:
        violations.extend(run_named(name, tgt))
    if not violations:
        typer.echo(f"pass: {target_path} conforms to {constitution_path.name}")
        return
    typer.echo(f"FAIL: {target_path} vs {constitution_path.name}")
    for v in violations:
        typer.echo(f"  - {v}")
    raise typer.Exit(1)


if __name__ == "__main__":
    app()
