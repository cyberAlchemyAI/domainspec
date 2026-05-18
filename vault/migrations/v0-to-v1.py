"""Migration: add `schema_version: 1` to every vault node that lacks it.

Per `vault/constitution/frontmatter-ownership-constitution.md`. Safe and idempotent:
- Only modifies files that have YAML frontmatter
- Only adds the field if it is missing
- Does not change any other field

Run from /Users/victorboscaro/domainspec/:
    python3 vault/migrations/v0-to-v1.py --dry-run   # preview
    python3 vault/migrations/v0-to-v1.py             # apply
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

VAULT_ROOT = Path(__file__).resolve().parent.parent


def split_frontmatter(text: str) -> tuple[str | None, str, str]:
    """Return (frontmatter_block, body_with_separators, full_text)."""
    if not text.startswith("---"):
        return None, text, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, text, text
    fm_block = parts[1]
    body = "---" + parts[2]  # we'll rebuild
    return fm_block, body, text


def add_schema_version(fm_block: str) -> tuple[str, bool]:
    """Return (new_fm_block, changed)."""
    lines = fm_block.splitlines()
    if any(line.strip().startswith("schema_version:") for line in lines):
        return fm_block, False
    # insert as second line (after initial blank or first key)
    insertion = "schema_version: 1"
    # find first non-empty line
    out: list[str] = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.strip() and not line.strip().startswith("#"):
            out.append(insertion)
            inserted = True
    if not inserted:
        out.insert(0, insertion)
    return "\n".join(out), True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    n_total = n_changed = 0
    for p in sorted(VAULT_ROOT.rglob("*.md")):
        if any(part in {".git", ".claude", "snapshots", "migrations"} for part in p.parts):
            continue
        n_total += 1
        text = p.read_text(encoding="utf-8")
        fm_block, _body, _full = split_frontmatter(text)
        if fm_block is None:
            continue
        new_fm, changed = add_schema_version(fm_block)
        if not changed:
            continue
        new_text = text.replace("---" + fm_block + "---", "---" + new_fm + "\n---", 1)
        # Edge case: if the literal replacement failed (newline differences), do it manually
        if new_text == text:
            parts = text.split("---", 2)
            new_text = "---" + new_fm + "\n---" + parts[2]
        if args.dry_run:
            print(f"WOULD MIGRATE: {p.relative_to(VAULT_ROOT)}")
        else:
            p.write_text(new_text, encoding="utf-8")
            print(f"migrated: {p.relative_to(VAULT_ROOT)}")
        n_changed += 1

    print(f"\n{n_changed} of {n_total} files {'would be ' if args.dry_run else ''}migrated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
