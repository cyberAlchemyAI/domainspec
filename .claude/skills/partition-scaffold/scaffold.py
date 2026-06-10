#!/usr/bin/env python3
"""Scaffold a new DomainSpec project's partition tree.

AUTHORITY for the tree shape: the sibling ``partition-manifest.json``, which is
the executable mirror of
``vault/discovery/system-modeling-partition-architecture/discovery.md``
(Revision 2026-06-09). If the two disagree, the discovery wins.

What it does, idempotently:
  * creates every partition folder from the manifest, with a ``README.md`` stub
    carrying valid frontmatter and the folder's role;
  * groups the knowledge partitions under ``knowledge/``;
  * builds the ``internal_tools/`` mirror (every ``mirrored: true`` node), which
    naturally excludes the shared layer (``arcanum``, ``domainspec``,
    ``system_design_knowledge``, ``internal_tools``) because those are
    ``mirrored: false``;
  * copies the experiments machinery (PROTOCOL.md / README.md / _TEMPLATE/ /
    tools/) into every folder whose ``machinery`` is ``"experiments"``.

It NEVER overwrites an existing README or experiments file (idempotent re-run),
and NEVER enforces anything — the partition rules are discipline, not a gate
(the project's node_type/layer validators are still unwired; see the discovery's
OQ-6). Run ``--dry-run`` to preview.

Usage:
    python3 scaffold.py [TARGET_DIR] [--name PROJECT] [--dry-run] [--force]
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / "partition-manifest.json"
ASSETS = HERE / "assets"
# The framework repo root (this skill lives at <framework>/.claude/skills/partition-scaffold).
# Symlink targets and seed sources are resolved against it.
FRAMEWORK_ROOT = HERE.parents[2]


def _stub_frontmatter(today: str, node_type: str, heading: str, note: str) -> str:
    """Minimal valid frontmatter stub for a scaffolded placeholder doc."""
    fm = f"---\ntags: [scaffold, stub]\nnode_type: {node_type}\nis_session: false\n"
    if node_type == "constitution":
        fm += "layer: architecture\nnature: procedural\nstatus: draft\n"
    elif node_type == "backlog":
        fm += "layer: ontology\nnature: reference\nstatus: active\n"
    else:
        fm += "layer: ontology\nnature: reference\nstatus: draft\n"
    fm += f"version: 0.1.0\nlast_updated: {today}\n---\n\n# {heading}\n\n{note}\n"
    return fm

README_TEMPLATE = """\
---
tags: [readme, partition, scaffold]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: active
version: 0.1.0
last_updated: {today}
---

# {heading}

{body}
"""


class Planner:
    """Collects the filesystem operations, then either prints or applies them."""

    def __init__(self, root: Path, today: str, *, dry_run: bool, force: bool):
        self.root = root
        self.today = today
        self.dry_run = dry_run
        self.force = force
        self.created_dirs: list[Path] = []
        self.created_files: list[Path] = []
        self.created_links: list[Path] = []
        self.skipped: list[Path] = []
        self.warnings: list[str] = []
        self.planned: set[Path] = set()  # paths already handled this run (dry-run safe)

    def mkdir(self, path: Path) -> None:
        if path.is_dir():
            return
        self.created_dirs.append(path)
        if not self.dry_run:
            path.mkdir(parents=True, exist_ok=True)

    def write(self, path: Path, content) -> None:
        if path in self.planned:
            return  # already created/listed this run (e.g. asset README before stub)
        if path.exists() and not self.force:
            self.skipped.append(path)
            return
        self.planned.add(path)
        self.created_files.append(path)
        if not self.dry_run:
            path.parent.mkdir(parents=True, exist_ok=True)
            if isinstance(content, bytes):
                path.write_bytes(content)
            else:
                path.write_text(content)

    # Asset directories that must never be copied into a scaffolded project.
    _SKIP_PARTS = {"__pycache__", ".pytest_cache", ".mypy_cache"}
    _SKIP_SUFFIX = {".pyc", ".pyo"}

    def copytree(self, src: Path, dst: Path) -> None:
        for item in sorted(src.rglob("*")):
            rel = item.relative_to(src)
            if set(rel.parts) & self._SKIP_PARTS or item.suffix in self._SKIP_SUFFIX:
                continue
            target = dst / rel
            if item.is_dir():
                self.mkdir(target)
            else:
                try:
                    self.write(target, item.read_text(encoding="utf-8"))
                except UnicodeDecodeError:
                    self.write(target, item.read_bytes())

    def readme(self, path: Path, heading: str, body: str) -> None:
        self.write(
            path / "README.md",
            README_TEMPLATE.format(today=self.today, heading=heading, body=body),
        )

    def symlink(self, link_path: Path, rel_target: str, check_path: Path) -> None:
        """Create link_path -> rel_target (a relative link string). `check_path` is
        the real file the link should resolve to; if it is missing the link is
        skipped with a warning (never points at nothing). Idempotent: an existing
        link is left alone unless --force."""
        if link_path in self.planned:
            return
        if link_path.is_symlink() or link_path.exists():
            if not self.force:
                self.skipped.append(link_path)
                return
            if not self.dry_run:
                link_path.unlink()
        if not check_path.exists():
            self.warnings.append(f"symlink source missing → skipped {link_path} (→ {rel_target})")
            return
        self.planned.add(link_path)
        self.created_links.append(link_path)
        if not self.dry_run:
            link_path.parent.mkdir(parents=True, exist_ok=True)
            link_path.symlink_to(rel_target)

    def seed_copy(self, dest: Path, framework_src: Path) -> None:
        """Copy a framework doc in as an editable project-local starter."""
        if not framework_src.exists():
            self.warnings.append(f"seed source missing → skipped {dest} (← {framework_src})")
            return
        try:
            content = framework_src.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            content = framework_src.read_bytes()
        self.write(dest, content)

    def stub_file(self, path: Path, node_type: str, note: str) -> None:
        heading = path.stem
        self.write(path, _stub_frontmatter(self.today, node_type, heading, note))


def build_node(node: dict, base: Path, planner: Planner, *, in_mirror: bool) -> None:
    """Create one node (and its children / machinery / mirror)."""
    if in_mirror and not node.get("mirrored", False):
        return  # inherited from the parent project — not cloned into the mirror

    # The domainspec/ slot is a symlink to the framework repo (not a stub dir), so the
    # project's vault/ ontology symlinks resolve through it. Skip dir/readme/children.
    if node.get("link_to_framework"):
        if not in_mirror:
            link = base / node["name"]
            rel = os.path.relpath(FRAMEWORK_ROOT, link.parent)
            planner.symlink(link, rel, FRAMEWORK_ROOT)
        return

    folder = base / node["name"]
    planner.mkdir(folder)
    rel_label = folder.relative_to(planner.root).as_posix()

    # The experiments machinery ships its own canonical README (the index); for every
    # other folder emit the generic partition stub.
    machinery = node.get("machinery")
    if machinery == "experiments":
        src = ASSETS / "experiments"
        if src.is_dir():
            planner.copytree(src, folder)
    else:
        planner.readme(folder, f"{rel_label}/", node.get("readme", ""))

    # The code ontology is the framework's BASE schema (canonical L1 types + edges). It is
    # dropped into the TOP-LEVEL schema/ only — a sub-project (internal_tools) inherits it
    # from the parent rather than cloning a second copy (R-6).
    if machinery == "code-ontology" and not in_mirror:
        src = ASSETS / "code-ontology"
        if src.is_dir():
            planner.copytree(src, folder / "code-ontology")

    # Project-local node-type subfolders (each a dir + README stub) — vault & domain_knowledge.
    for sub in node.get("subfolders", []):
        subdir = folder / sub
        planner.mkdir(subdir)
        planner.readme(subdir, f"{rel_label}/{sub}/",
                       f"Project-local `{sub}` nodes for `{rel_label}`. Authored by the project; starts empty.")

    # Named placeholder files (e.g. discovery/_backlog.md, stub constitutions).
    for sf in node.get("stub_files", []):
        planner.stub_file(folder / sf["dest"], sf.get("node_type", "conceptual"), sf.get("note", ""))

    # Symlinks into the framework (vault ontology canon) and seed copies (system_design dev
    # docs) — TOP-LEVEL only; a sub-project (internal_tools) inherits these from its parent.
    if not in_mirror:
        for lk in node.get("symlinks", []):
            link_path = folder / lk["dest"]
            rel = os.path.relpath(planner.root / "domainspec" / lk["src"], link_path.parent)
            planner.symlink(link_path, rel, FRAMEWORK_ROOT / lk["src"])
        for sd in node.get("seeds", []):
            planner.seed_copy(folder / sd["dest"], FRAMEWORK_ROOT / sd["src"])

    for child in node.get("children", []):
        build_node(child, folder, planner, in_mirror=in_mirror)

    # internal_tools: its body is a mirror of the (mirrored:true) tree.
    # mirror_root itself is mirrored:false, so this only fires at the top level
    # and cannot recurse into a nested internal_tools (no infinite loop).
    if node.get("mirror_root") and not in_mirror:
        for sibling in TREE:
            build_node(sibling, folder, planner, in_mirror=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("target", nargs="?", default=".", help="project root (default: cwd)")
    parser.add_argument("--name", help="project name, used as the root README heading")
    parser.add_argument("--objective", help="one-sentence project objective written into the "
                        "root README (REQUIRED unless --dry-run; see discovery R-7)")
    parser.add_argument("--dry-run", action="store_true", help="preview only, write nothing")
    parser.add_argument("--force", action="store_true", help="overwrite existing READMEs/assets")
    args = parser.parse_args()

    # R-7: a project must state its objective. Enforced for real runs; a dry-run may preview
    # without one (the SKILL flow asks the user for the sentence before the real run).
    if not args.objective and not args.dry_run:
        parser.error("--objective is required: every new project must state its objective "
                     "in the root README (discovery R-7). Pass --objective \"<one sentence>\", "
                     "or use --dry-run to preview without it.")

    manifest = json.loads(MANIFEST.read_text())
    global TREE
    TREE = manifest["tree"]

    root = Path(args.target).resolve()
    today = date.today().isoformat()
    planner = Planner(root, today, dry_run=args.dry_run, force=args.force)

    planner.mkdir(root)
    objective = args.objective or "<one-sentence objective — fill me in (R-7)>"
    planner.readme(
        root,
        args.name or root.name,
        f"**Objective.** {objective}\n\n"
        "DomainSpec project. Folder layout scaffolded by `partition-scaffold` from "
        "`system-modeling-partition-architecture` (Revision 2026-06-09). Top axis is "
        "subject (`knowledge/`); ownership lives in frontmatter, not the path. "
        "`implementation/` interior is governed by `folder-structure-constitution.md`. "
        "Nothing here is enforced yet (gate-first).",
    )

    for node in TREE:
        build_node(node, root, planner, in_mirror=False)

    verb = "would create" if args.dry_run else "created"
    print(f"partition-scaffold @ {root}")
    print(f"  {verb}: {len(planner.created_dirs)} dirs, {len(planner.created_files)} files, "
          f"{len(planner.created_links)} symlinks")
    if planner.skipped:
        print(f"  skipped (already exist, use --force): {len(planner.skipped)}")
    for d in planner.created_dirs:
        print(f"    dir  {d.relative_to(root).as_posix()}/")
    for f in planner.created_files:
        print(f"    file {f.relative_to(root).as_posix()}")
    for ln in planner.created_links:
        print(f"    link {ln.relative_to(root).as_posix()}")
    if planner.warnings:
        print(f"  ⚠ {len(planner.warnings)} warning(s):")
        for w in planner.warnings:
            print(f"    - {w}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
