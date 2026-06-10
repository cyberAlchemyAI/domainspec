#!/usr/bin/env python3
"""CI/enforcement gate — run the code-ontology signature validator over every
real L1 extraction in the repo.

Globs  docs/features/*/_categorical/L1.json,  runs the canonical signature
validator (Property P1, type safety) on each, and exits non-zero if ANY file
has a signature violation — or, under --strict, if any non-empty extraction
parses to zero typed nodes (which means the validator did not actually
understand the file's format and would otherwise false-pass).

Stdlib only. No third-party deps. Mirrors the repo's existing governance-gate
convention: a small validate task a `pnpm run` umbrella — or, if the user later
adopts it, CI — can call. NOT wired into any check by default; this is an
unwired capability (like scripts/audit_richness.py) until the user chooses an
enforcement posture.

Usage:
    python3 scripts/validate_ontology_extractions.py            # gate all extractions
    python3 scripts/validate_ontology_extractions.py --strict   # also fail on no-op passes
    python3 scripts/validate_ontology_extractions.py a.json b.json   # explicit files

Exit 0 = every extraction is type-safe. Exit 1 = at least one violation
(or, under --strict, at least one no-op pass). Exit 2 = no extractions found.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
GLOB = "docs/features/*/_categorical/L1.json"

VALIDATOR_DIR = (
    REPO_ROOT / ".claude" / "skills" / "partition-scaffold"
    / "assets" / "code-ontology"
)


def _load_validator():
    """Import validate_ontology.py from the skill bundle without installing it."""
    import importlib.util

    mod_path = VALIDATOR_DIR / "validate_ontology.py"
    if not mod_path.is_file():
        print(f"✗ validator not found at {mod_path}", file=sys.stderr)
        sys.exit(1)
    spec = importlib.util.spec_from_file_location("validate_ontology", mod_path)
    mod = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(mod)
    return mod


def _node_count(mod, onto: dict, graph: dict) -> int:
    """How many graph nodes the validator was actually able to type.

    Routes through the validator's own `_normalize_graph` so it counts nodes
    in BOTH the generic {nodes} and the real {objects} shapes — otherwise
    --strict would false-fail every real {objects/morphisms} extraction.
    """
    _, alias = mod._index(onto)
    nodes, _edges = mod._normalize_graph(graph)
    return sum(1 for n in nodes if alias.get(n.get("meta_type")) is not None)


def main(argv: list[str]) -> int:
    strict = "--strict" in argv
    explicit = [a for a in argv[1:] if not a.startswith("--")]

    if explicit:
        files = [Path(p) for p in explicit]
    else:
        files = sorted(REPO_ROOT.glob(GLOB))

    if not files:
        print(f"✗ no extractions matched {GLOB} under {REPO_ROOT}", file=sys.stderr)
        return 2

    mod = _load_validator()
    onto = mod.load()

    schema_errs = mod.check_schema(onto)
    if schema_errs:
        print("✗ code-ontology.json failed self-check:", file=sys.stderr)
        for e in schema_errs:
            print(f"    - {e}", file=sys.stderr)
        return 1

    failures = 0
    for f in files:
        rel = f.relative_to(REPO_ROOT) if f.is_absolute() and REPO_ROOT in f.parents else f
        if not f.is_file():
            print(f"✗ {rel}: file not found")
            failures += 1
            continue
        try:
            graph = json.loads(f.read_text(encoding="utf-8"))
        except (OSError, ValueError) as ex:
            print(f"✗ {rel}: cannot read/parse — {ex}")
            failures += 1
            continue

        errs = mod.validate_graph(onto, graph)
        if errs:
            print(f"✗ {rel}: {len(errs)} signature violation(s):")
            for e in errs:
                print(f"    - {e}")
            failures += 1
            continue

        typed = _node_count(mod, onto, graph)
        non_empty = bool(graph.get("nodes")) or bool(graph.get("objects")) \
            or bool(graph.get("edges")) or bool(graph.get("morphisms"))
        if strict and non_empty and typed == 0:
            print(
                f"✗ {rel}: NO-OP PASS — validator typed 0 nodes from a non-empty "
                f"extraction. The signature validator does not understand this "
                f"file's format; this is a false pass, not a clean one."
            )
            failures += 1
            continue

        print(f"✓ {rel}: type-safe ({typed} node(s) checked)")

    if failures:
        print(f"\n✗ ontology gate FAILED — {failures} of {len(files)} extraction(s) bad.")
        return 1
    print(f"\n✓ ontology gate passed — {len(files)} extraction(s) type-safe.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
