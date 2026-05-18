#!/usr/bin/env python3
"""Migration v1 -> v2: partial fractal-folder restructure.

Per Wave-2 evaluator recommendation (see
`vault/discovery/folder-structure-fractal/lenses/05-migration-cost-estimate.md`),
this migration adopts the *partial* fractal proposal:

    1. Top-level split: `vault/schema/` vs `vault/instance/`.
    2. New required frontmatter field: `layer: schema | instance`.
    3. Per-node-type slot rules (NO mandatory recursive Unit mirror).

The script is **dry-run by default**. `--apply` requires explicit
confirmation. It refuses to run on a dirty working tree, emits `git mv`
commands (preserving rename history), rewrites internal links across the
whole vault, backfills `layer:` frontmatter, and writes per-schema-doc
amendment placeholders. After `--apply` it emits a JSON manifest under
`vault/instance/migrations/v1-to-v2-manifest.json` for the audit trail.

Phases
------
    0. Safety: refuse on dirty git state. Resolve repo root.
    1. Build path map (every vault file -> destination). Detect collisions.
    2. Rewrite internal links: walk every file, substitute occurrences of
       any moved path with its destination. Two surfaces: frontmatter
       edge fields (YAML list values) and markdown prose (incl. `[t](p)`
       links). The rewriter is one regex per moved path, longest-first.
    3. Add/verify `layer:` field per destination path.
    4. Generate amendment placeholder for every moved schema document.
    5. Emit `git mv` plan; in `--apply`, execute it (script moves itself last).
    6. Write manifest.

Run from `/Users/victorboscaro/domainspec/`:
    python3 vault/migrations/v1-to-v2-folder-restructure.py            # dry-run
    python3 vault/migrations/v1-to-v2-folder-restructure.py --apply    # do it
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
VAULT = REPO_ROOT / "vault"
SCRIPT_PATH = Path(__file__).resolve()

# Top-level directories that move wholesale (recursive). Sessions/snapshots
# are explicitly flat per the migration map.
DIR_MAP_INSTANCE: dict[str, str] = {
    "discovery": "instance/discovery",
    "premise": "instance/premise",
    "axiom": "instance/axiom",
    "conceptual": "instance/conceptual",  # NOTE: map says schema; see resolve()
    "sessions": "instance/sessions",
    "bets": "instance/bets",
    "amendments": "instance/amendments",
    "snapshots": "instance/snapshots",
    "migrations": "instance/migrations",
}
DIR_MAP_SCHEMA: dict[str, str] = {
    "constitution": "schema/constitution",
    "conceptual": "schema/conceptual",  # per task migration map
}
# Individual root-level files -> schema/conventions/<name>.
ROOT_FILE_MAP: dict[str, str] = {
    "ontology-conventions.md": "schema/conventions/ontology.md",
    "confidence-levels.md": "schema/conventions/confidence-levels.md",
    "foundational-knowledges.md": "schema/conventions/foundational-knowledges.md",
    "ontology-architecture-draft.md": "schema/conventions/ontology-architecture.md",
    "agent-navigation.md": "schema/conventions/agent-navigation.md",
    "human-navigation.md": "schema/conventions/human-navigation.md",
}

# Frontmatter edge keys whose list-values are *paths* and need rewriting.
EDGE_FIELDS: tuple[str, ...] = (
    "derives-from", "derives_from", "cites", "contradicts", "supersedes",
    "governs", "lenses", "codified-as", "codified_as",
    "operationalized-by", "operationalized_by",
    "validates", "part-of", "part_of", "creates", "modifies",
    "for_claim", "sources", "schema_document", "addresses",
    "dependents", "trigger",
)

# Files/dirs ignored in the walk.
SKIP_PARTS = {".git", ".claude", ".DS_Store", "assets", "backlog", "__pycache__"}
SKIP_SUFFIXES = {".pyc", ".DS_Store"}


# --------------------------------------------------------------------------- #
# Data classes                                                                #
# --------------------------------------------------------------------------- #


@dataclass
class Move:
    """A single file move: relative-to-repo `src` -> `dst`."""

    src: str  # e.g. "vault/constitution/foo.md"
    dst: str  # e.g. "vault/schema/constitution/foo.md"


@dataclass
class Rewrite:
    """A single in-file substitution to perform."""

    path: str          # repo-relative path of the file to edit
    old: str           # old substring
    new: str           # new substring
    count: int = 0     # occurrences in this file


@dataclass
class Plan:
    moves: list[Move] = field(default_factory=list)
    rewrites: list[Rewrite] = field(default_factory=list)
    layer_adds: list[tuple[str, str]] = field(default_factory=list)
    amendments: list[tuple[str, str]] = field(default_factory=list)  # (path, body)
    collisions: list[tuple[str, list[str]]] = field(default_factory=list)


# --------------------------------------------------------------------------- #
# Phase 0 — safety                                                            #
# --------------------------------------------------------------------------- #


def assert_clean_git() -> None:
    """Refuse to run on a dirty tree. Per E2's recommended 3-commit workflow:
    rename-only commit must contain *only* renames so `git log --follow` works.
    """
    res = subprocess.run(
        ["git", "status", "--porcelain"], cwd=REPO_ROOT,
        capture_output=True, text=True, check=True,
    )
    if res.stdout.strip():
        sys.stderr.write(
            "ERROR: git working tree is not clean. Commit or stash first.\n"
            "Per the 3-commit workflow (rename / content / followup), the\n"
            "rename commit must contain ONLY renames.\n\n"
            f"{res.stdout}"
        )
        sys.exit(2)


# --------------------------------------------------------------------------- #
# Phase 1 — build path map                                                    #
# --------------------------------------------------------------------------- #


def resolve_destination(rel_path: str) -> str | None:
    """Compute destination repo-relative path for a vault file.

    Returns None if the file should not move (already migrated or out of scope).
    """
    if not rel_path.startswith("vault/"):
        return None
    tail = rel_path[len("vault/"):]
    parts = tail.split("/", 1)
    head = parts[0]

    # Already-migrated files: skip silently.
    if head in {"schema", "instance"}:
        return None

    # Root-level files with explicit destinations.
    if "/" not in tail and tail in ROOT_FILE_MAP:
        return f"vault/{ROOT_FILE_MAP[tail]}"

    # Recursive directory moves: instance side first (broader), schema overrides.
    if head in DIR_MAP_SCHEMA:
        rest = parts[1] if len(parts) > 1 else ""
        return f"vault/{DIR_MAP_SCHEMA[head]}/{rest}".rstrip("/")
    if head in DIR_MAP_INSTANCE:
        rest = parts[1] if len(parts) > 1 else ""
        return f"vault/{DIR_MAP_INSTANCE[head]}/{rest}".rstrip("/")

    return None


def walk_vault_files() -> list[str]:
    """Yield every tracked-ish file under vault/ (repo-relative)."""
    out: list[str] = []
    for p in sorted(VAULT.rglob("*")):
        if not p.is_file():
            continue
        if any(part in SKIP_PARTS for part in p.parts):
            continue
        if p.suffix in SKIP_SUFFIXES or p.name in SKIP_SUFFIXES:
            continue
        out.append(str(p.relative_to(REPO_ROOT)))
    return out


def build_path_map(files: list[str]) -> tuple[dict[str, str], list[tuple[str, list[str]]]]:
    """Return (src_to_dst, collisions). Collisions abort the run."""
    src_to_dst: dict[str, str] = {}
    dst_to_srcs: dict[str, list[str]] = {}
    for src in files:
        dst = resolve_destination(src)
        if dst is None:
            continue
        src_to_dst[src] = dst
        dst_to_srcs.setdefault(dst, []).append(src)
    collisions = [(d, ss) for d, ss in dst_to_srcs.items() if len(ss) > 1]
    return src_to_dst, collisions


# --------------------------------------------------------------------------- #
# Phase 2 — internal link rewriting                                           #
# --------------------------------------------------------------------------- #


def build_rewrite_substitutions(path_map: dict[str, str]) -> list[tuple[str, str]]:
    """Build (old, new) substring substitutions, longest-source-first.

    Longest-first prevents `vault/constitution/foo.md` from being clobbered
    by an earlier match on `vault/constitution/`.

    We also include directory-prefix substitutions for top-level renames so
    that paths constructed by string concatenation in prose still rewrite.
    """
    subs: list[tuple[str, str]] = []
    # Individual file paths first (most specific).
    for src, dst in sorted(path_map.items(), key=lambda kv: -len(kv[0])):
        subs.append((src, dst))
    # Then directory prefixes (so e.g. "vault/discovery/foo/bar.md" referenced
    # inline as a substring of a longer string still rewrites correctly).
    for old_dir, new_dir in {**DIR_MAP_SCHEMA, **DIR_MAP_INSTANCE}.items():
        subs.append((f"vault/{old_dir}/", f"vault/{new_dir}/"))
    return subs


def plan_rewrites_for_file(rel_path: str, subs: list[tuple[str, str]]) -> list[Rewrite]:
    """Scan one file and emit Rewrite entries for any path-mentions found."""
    full = REPO_ROOT / rel_path
    try:
        text = full.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return []
    out: list[Rewrite] = []
    seen: set[tuple[str, str]] = set()
    for old, new in subs:
        if old == new or old not in text:
            continue
        if (old, new) in seen:
            continue
        seen.add((old, new))
        count = text.count(old)
        out.append(Rewrite(path=rel_path, old=old, new=new, count=count))
    return out


def apply_rewrites_to_text(text: str, rewrites: list[Rewrite]) -> str:
    """Apply substitutions in order (longest-first preserved by caller)."""
    for r in rewrites:
        text = text.replace(r.old, r.new)
    return text


# --------------------------------------------------------------------------- #
# Phase 3 — layer: frontmatter                                                #
# --------------------------------------------------------------------------- #


_FM_DELIM = "---"


def split_frontmatter(text: str) -> tuple[str | None, str]:
    """Return (frontmatter_block, body_including_trailing_delim_and_body)."""
    if not text.startswith(_FM_DELIM):
        return None, text
    parts = text.split(_FM_DELIM, 2)
    if len(parts) < 3:
        return None, text
    return parts[1], parts[2]


def layer_for_dst(dst_rel: str) -> str | None:
    if dst_rel.startswith("vault/schema/"):
        return "schema"
    if dst_rel.startswith("vault/instance/"):
        return "instance"
    return None


def ensure_layer_field(fm_block: str, expected: str) -> tuple[str, str]:
    """Return (new_block, action) where action is 'add' | 'ok' | 'mismatch:<old>'.

    Manual parse — no YAML dependency — to avoid reformatting frontmatter.
    """
    for line in fm_block.splitlines():
        stripped = line.strip()
        if stripped.startswith("layer:"):
            existing = stripped.split(":", 1)[1].strip()
            if existing == expected:
                return fm_block, "ok"
            return fm_block, f"mismatch:{existing}"
    # Insert after first non-empty line.
    lines = fm_block.splitlines()
    out: list[str] = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.strip():
            out.append(f"layer: {expected}")
            inserted = True
    if not inserted:
        out.insert(0, f"layer: {expected}")
    return "\n".join(out), "add"


# --------------------------------------------------------------------------- #
# Phase 4 — amendment placeholders                                            #
# --------------------------------------------------------------------------- #


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def amendment_for_schema_move(src: str, dst: str) -> tuple[str, str]:
    """Build (path, body) of a placeholder amendment for a schema doc move."""
    base = Path(src).stem
    slug = slugify(base)
    today = date.today().isoformat()
    path = f"vault/instance/amendments/{today}-folder-restructure-{slug}.md"
    body = f"""---
amendment_id: {today}-folder-restructure-{slug}
date: {today}
schema_document: {dst}
change_type: path_move
old_path: {src}
new_path: {dst}
trigger:
  session: null
  discovery: vault/instance/discovery/folder-structure-fractal/
  falsified_premise: null
dependents: []
review:
  validator_passed: pending
  snapshot_tag: null
author: TODO-human-reviewer
---

# Amendment: relocate `{base}` under `vault/schema/`

## Why

Wave-2 evaluators recommended partial adoption of the fractal-folder
proposal: a top-level `schema/` vs `instance/` split plus a `layer:`
frontmatter invariant. This file participates in the schema layer and
moves accordingly. See
`vault/instance/discovery/folder-structure-fractal/lenses/05-migration-cost-estimate.md`.

## What changed

- Path: `{src}` -> `{dst}`
- Added `layer: schema` to frontmatter.
- All internal references rewritten by
  `vault/instance/migrations/v1-to-v2-folder-restructure.py`.

## Reviewer TODO

- [ ] Confirm no semantic change (path-only move).
- [ ] Re-run `vault-ctl validate --strict` and attach snapshot tag.
- [ ] Replace `author:` placeholder.
"""
    return path, body


# --------------------------------------------------------------------------- #
# Phase 5 — git mv + apply                                                    #
# --------------------------------------------------------------------------- #


def git_mv_commands(moves: list[Move]) -> list[list[str]]:
    """Build the list of `git mv -k <src> <dst>` argv vectors.

    The script's own move is placed last so the file remains importable
    until the very end of the rename pass.
    """
    self_rel = str(SCRIPT_PATH.relative_to(REPO_ROOT))
    head, tail = [], []
    for m in moves:
        (tail if m.src == self_rel else head).append(m)
    return [["git", "mv", "-k", m.src, m.dst] for m in head + tail]


def ensure_parent_dirs(moves: list[Move]) -> set[str]:
    return {str(Path(m.dst).parent) for m in moves}


# --------------------------------------------------------------------------- #
# Orchestration                                                               #
# --------------------------------------------------------------------------- #


def build_plan() -> Plan:
    plan = Plan()
    files = walk_vault_files()
    path_map, collisions = build_path_map(files)
    plan.collisions = collisions
    plan.moves = [Move(src=s, dst=d) for s, d in sorted(path_map.items())]

    subs = build_rewrite_substitutions(path_map)
    # Scan EVERY vault file (moving or not) for occurrences of any moved path.
    for rel in files:
        plan.rewrites.extend(plan_rewrites_for_file(rel, subs))

    # Schema-amendment placeholders (one per moved schema document).
    for m in plan.moves:
        if not m.dst.startswith("vault/schema/"):
            continue
        if not m.src.endswith(".md"):
            continue
        plan.amendments.append(amendment_for_schema_move(m.src, m.dst))

    # `layer:` additions (computed at destination, applied post-move).
    for m in plan.moves:
        if not m.src.endswith(".md"):
            continue
        lyr = layer_for_dst(m.dst)
        if lyr:
            plan.layer_adds.append((m.dst, lyr))

    return plan


def print_dry_run(plan: Plan) -> None:
    print("=" * 72)
    print("v1 -> v2 folder restructure — DRY RUN")
    print("=" * 72)

    if plan.collisions:
        print("\n!!! COLLISIONS — would abort apply:")
        for dst, srcs in plan.collisions:
            print(f"  {dst} <- {srcs}")

    print(f"\n--- PHASE 1: MOVES ({len(plan.moves)}) ---")
    for m in plan.moves:
        print(f"  mv  {m.src}\n      -> {m.dst}")

    print(f"\n--- PHASE 2: LINK REWRITES ({len(plan.rewrites)}) ---")
    by_file: dict[str, list[Rewrite]] = {}
    for r in plan.rewrites:
        by_file.setdefault(r.path, []).append(r)
    for path, rs in sorted(by_file.items()):
        total = sum(r.count for r in rs)
        print(f"  {path}  ({total} occurrences across {len(rs)} patterns)")
        for r in rs[:6]:
            print(f"      {r.old}  ->  {r.new}   x{r.count}")
        if len(rs) > 6:
            print(f"      ... +{len(rs) - 6} more")

    print(f"\n--- PHASE 3: layer: ADDITIONS ({len(plan.layer_adds)}) ---")
    for dst, lyr in plan.layer_adds[:20]:
        print(f"  {dst}  layer: {lyr}")
    if len(plan.layer_adds) > 20:
        print(f"  ... +{len(plan.layer_adds) - 20} more")

    print(f"\n--- PHASE 4: AMENDMENT PLACEHOLDERS ({len(plan.amendments)}) ---")
    for path, _body in plan.amendments:
        print(f"  WRITE {path}")

    print("\n--- PHASE 5: git mv commands ---")
    for argv in git_mv_commands(plan.moves):
        print("  $ " + " ".join(argv))

    print("\n(dry-run complete — re-run with --apply to execute)")


def apply_plan(plan: Plan) -> None:
    if plan.collisions:
        sys.stderr.write("ABORT: destination collisions detected.\n")
        sys.exit(3)

    # 1. git mv every file. mkdir -p destinations first.
    for parent in sorted(ensure_parent_dirs(plan.moves)):
        (REPO_ROOT / parent).mkdir(parents=True, exist_ok=True)
    for argv in git_mv_commands(plan.moves):
        print("$", *argv)
        subprocess.run(argv, cwd=REPO_ROOT, check=True)

    # 2. Apply link rewrites. Rewrites were planned against PRE-move paths;
    # remap their `path` to the post-move location before editing.
    src_to_dst = {m.src: m.dst for m in plan.moves}
    by_file: dict[str, list[Rewrite]] = {}
    for r in plan.rewrites:
        post = src_to_dst.get(r.path, r.path)
        by_file.setdefault(post, []).append(r)
    for post_path, rs in by_file.items():
        full = REPO_ROOT / post_path
        if not full.exists():
            print(f"WARN: rewrite target missing post-move: {post_path}")
            continue
        text = full.read_text(encoding="utf-8")
        new_text = apply_rewrites_to_text(text, rs)
        if new_text != text:
            full.write_text(new_text, encoding="utf-8")
            print(f"rewrote: {post_path}")

    # 3. Backfill layer: field.
    for dst, lyr in plan.layer_adds:
        full = REPO_ROOT / dst
        if not full.exists():
            continue
        text = full.read_text(encoding="utf-8")
        fm, body = split_frontmatter(text)
        if fm is None:
            continue
        new_fm, action = ensure_layer_field(fm, lyr)
        if action.startswith("mismatch:"):
            sys.stderr.write(f"WARN: {dst} has layer:{action[9:]} != {lyr}\n")
            continue
        if action == "add":
            full.write_text(f"{_FM_DELIM}{new_fm}\n{_FM_DELIM}{body}", encoding="utf-8")
            print(f"layer-added: {dst}")

    # 4. Write amendment placeholders.
    for path, body in plan.amendments:
        full = REPO_ROOT / path
        full.parent.mkdir(parents=True, exist_ok=True)
        if full.exists():
            print(f"skip (exists): {path}")
            continue
        full.write_text(body, encoding="utf-8")
        subprocess.run(["git", "add", path], cwd=REPO_ROOT, check=True)
        print(f"amendment: {path}")

    # 5. Manifest.
    manifest = {
        "migration": "v1-to-v2-folder-restructure",
        "executed_at": date.today().isoformat(),
        "moves": [{"src": m.src, "dst": m.dst} for m in plan.moves],
        "rewrites": [
            {"path": r.path, "old": r.old, "new": r.new, "count": r.count}
            for r in plan.rewrites
        ],
        "layer_adds": [{"path": p, "layer": l} for p, l in plan.layer_adds],
        "amendments": [p for p, _b in plan.amendments],
    }
    manifest_path = REPO_ROOT / "vault/instance/migrations/v1-to-v2-manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"manifest: {manifest_path.relative_to(REPO_ROOT)}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--apply", action="store_true",
                    help="Execute the migration (default is dry-run).")
    ap.add_argument("--yes", action="store_true",
                    help="Skip the interactive confirmation prompt under --apply.")
    args = ap.parse_args()

    assert_clean_git()
    plan = build_plan()
    print_dry_run(plan)

    if not args.apply:
        return 0

    if plan.collisions:
        sys.stderr.write("\nABORT: collisions present; refusing --apply.\n")
        return 3

    if not args.yes:
        print("\nAbout to APPLY the migration above. This rewrites the entire vault.")
        ans = input("Type 'yes' to proceed: ").strip().lower()
        if ans != "yes":
            print("aborted.")
            return 1

    apply_plan(plan)
    print("\nDONE. Inspect `git status`, then commit in three steps per E2:")
    print("  1. rename-only commit (the `git mv`s)")
    print("  2. content commit (link rewrites + layer: backfill)")
    print("  3. amendments commit (the new placeholders)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
