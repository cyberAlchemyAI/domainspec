#!/usr/bin/env python3
"""
Ontology Visualization Explorer — Parser
Reads docs/vault/ and specs/ markdown files, extracts frontmatter + connections,
and injects the graph data JSON into explorer.html.

Usage (from repo root):
    python specs/ontology/ontology-visualization/explorer.py
    # then open specs/ontology/ontology-visualization/explorer.html in your browser

Usage (from this folder):
    python explorer.py --root ../../..
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
DEFAULT_REPO_ROOT = SCRIPT_DIR / "../../../../"

SEARCH_DIRS = ["docs/vault", "specs"]
EXCLUDE_DIRS = {
    "ontology-visualization",  # exclude self
    "__pycache__",
    ".git",
    "venv",
    "node_modules",
}
EXCLUDE_FILES = {
    "vault-explorer-discovery.md",
    "implementation-plan.md",
}

LABEL_FIELDS = [
    "node_type",
    "layer",
    "status",
    "nature",
    "veracidade",
    "convicção",
    "audience",
    "tags",
]


# ──────────────────────────────────────────────
# Frontmatter parser (stdlib only)
# ──────────────────────────────────────────────

def parse_frontmatter(text: str) -> dict:
    """Extract YAML frontmatter from markdown text. Handles basic YAML only."""
    fm = {}
    if not text.startswith("---"):
        return fm
    end = text.find("\n---", 3)
    if end == -1:
        return fm
    yaml_block = text[3:end].strip()

    # Parse line by line — handles scalars and simple lists (block style)
    current_key = None
    for line in yaml_block.splitlines():
        # List item
        if line.startswith("  - ") or line.startswith("- "):
            item = line.lstrip("- ").strip()
            if current_key:
                if not isinstance(fm.get(current_key), list):
                    fm[current_key] = []
                fm[current_key].append(item)
            continue
        # Key: value pair
        if ":" in line:
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            current_key = key
            if val:
                fm[key] = val
            else:
                fm[key] = []  # will be filled by list items below
        else:
            current_key = None

    # Normalise list fields: if stored as string with commas, split
    for field in ["audience", "tags", "layer", "nature"]:
        if field in fm and isinstance(fm[field], str) and fm[field]:
            fm[field] = [v.strip() for v in fm[field].split(",") if v.strip()]

    return fm


# ──────────────────────────────────────────────
# Connections table parser
# ──────────────────────────────────────────────

WIKILINK_RE = re.compile(r"\[\[([^\]]+)\]\]")
TABLE_ROW_RE = re.compile(r"^\|(.+)\|(.+)\|(.+)\|")


def parse_connections(text: str) -> list[dict]:
    """
    Extract edges from a ## Connections markdown table.
    Returns list of {target_raw, type, description}.
    """
    edges = []
    in_connections = False
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.lower().startswith("## connections"):
            in_connections = True
            continue
        if in_connections:
            if stripped.startswith("## "):
                break  # next section
            m = TABLE_ROW_RE.match(stripped)
            if not m:
                continue
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            if len(cells) < 2:
                continue
            target_cell = cells[0]
            link_type = cells[1].strip("`").strip() if len(cells) > 1 else "related"
            description = cells[2].strip() if len(cells) > 2 else ""
            # Skip header/separator rows
            if target_cell.lower() in ("document", "---", "source") or "---" in target_cell:
                continue
            # Extract wikilink or plain text
            wm = WIKILINK_RE.search(target_cell)
            target_raw = wm.group(1) if wm else target_cell.strip("`").strip()
            if target_raw:
                edges.append({
                    "target_raw": target_raw,
                    "type": link_type,
                    "description": description,
                })
    return edges


# ──────────────────────────────────────────────
# Wikilink resolver
# ──────────────────────────────────────────────

def build_path_index(all_files: list[Path], repo_root: Path) -> dict[str, str]:
    """
    Build a map from various partial keys to relative file paths.
    Keys: full rel path, stem, stem with parent, etc.
    """
    index = {}
    for f in all_files:
        rel = str(f.relative_to(repo_root)).replace("\\", "/")
        stem = f.stem  # filename without extension
        parent_stem = f"{f.parent.name}/{stem}"
        # Store multiple lookup keys
        for key in [rel, stem, parent_stem, rel.replace(".md", "")]:
            index.setdefault(key, rel)
    return index


def resolve_wikilink(target_raw: str, path_index: dict) -> str | None:
    """Try to resolve a wikilink or partial path to a known node ID."""
    variants = [
        target_raw,
        target_raw.replace("\\", "/"),
        target_raw.lstrip("/"),
        f"docs/vault/{target_raw}",
        f"docs/vault/{target_raw}.md",
        f"specs/{target_raw}",
        f"specs/{target_raw}.md",
        Path(target_raw).stem,
        f"{Path(target_raw).parent.name}/{Path(target_raw).stem}",
    ]
    for v in variants:
        if v in path_index:
            return path_index[v]
    return None


# ──────────────────────────────────────────────
# Main build
# ──────────────────────────────────────────────

def collect_files(repo_root: Path) -> list[Path]:
    files = []
    for d in SEARCH_DIRS:
        base = repo_root / d
        if not base.exists():
            continue
        for f in base.rglob("*.md"):
            # Skip excluded dirs
            if any(excl in f.parts for excl in EXCLUDE_DIRS):
                continue
            if f.name in EXCLUDE_FILES:
                continue
            files.append(f)
    return files


def build_graph(repo_root: Path) -> dict:
    files = collect_files(repo_root)
    path_index = build_path_index(files, repo_root)

    nodes = []
    raw_edges = []
    meta_values: dict[str, set] = {field: set() for field in LABEL_FIELDS}

    for f in files:
        text = f.read_text(encoding="utf-8", errors="replace")
        fm = parse_frontmatter(text)
        connections = parse_connections(text)

        rel = str(f.relative_to(repo_root)).replace("\\", "/")
        label = f.stem.replace("-", " ").replace("_", " ")

        node = {
            "id": rel,
            "label": label,
            "path": rel,
        }

        # Attach label fields
        for field in LABEL_FIELDS:
            val = fm.get(field)
            if val:
                node[field] = val
                # Collect meta values
                if isinstance(val, list):
                    for v in val:
                        meta_values[field].add(str(v))
                else:
                    meta_values[field].add(str(val))

        # Emit is_session so the UI can filter conversation/session docs.
        # Fallback: any file inside a conversations/ folder is a session even without the frontmatter label.
        is_session = fm.get("is_session")
        in_conversations_dir = "conversations" in f.parts
        if in_conversations_dir or (is_session and str(is_session).lower() not in ("false", "0", "no", "")):
            node["is_session"] = True

        nodes.append(node)

        for edge in connections:
            raw_edges.append({
                "source": rel,
                "target_raw": edge["target_raw"],
                "type": edge["type"],
                "description": edge["description"],
            })

    # Resolve edges
    links = []
    unresolved = []
    existing_node_ids = {n["id"] for n in nodes}
    for edge in raw_edges:
        target_raw = edge["target_raw"]
        if "|" in target_raw:
            target_raw = target_raw.split("|")[0].strip()

        target_id = resolve_wikilink(target_raw, path_index)
        if target_id:
            links.append({
                "source": edge["source"],
                "target": target_id,
                "type": edge["type"],
                "description": edge["description"],
            })
        else:
            virtual_id = target_raw
            if virtual_id not in existing_node_ids:
                is_code = virtual_id.endswith((".py", ".js", ".ts", ".html", ".css", ".json"))
                nodes.append({
                    "id": virtual_id,
                    "label": Path(virtual_id).name if "/" in virtual_id else virtual_id,
                    "path": virtual_id,
                    "node_type": "Code" if is_code else "External",
                    "status": "virtual"
                })
                existing_node_ids.add(virtual_id)
            links.append({
                "source": edge["source"],
                "target": virtual_id,
                "type": edge["type"],
                "description": edge["description"],
            })
            unresolved.append(target_raw)

    # Build _meta (sorted lists)
    meta = {field: sorted(list(values)) for field, values in meta_values.items() if values}

    print(f"✓ {len(nodes)} nodes, {len(links)} links ({len(unresolved)} unresolved wikilinks)")
    if unresolved:
        print(f"  Unresolved: {', '.join(set(unresolved[:10]))}")

    return {"_meta": meta, "nodes": nodes, "links": links}


# ──────────────────────────────────────────────
# Embed into HTML
# ──────────────────────────────────────────────

TEMPLATE_PATH = SCRIPT_DIR / "explorer.template.html"
OUTPUT_PATH = SCRIPT_DIR / "explorer.html"
PLACEHOLDER = "/*GRAPH_DATA_PLACEHOLDER*/null"


def embed_data(graph_data: dict):
    """Read template, inject graph_data JSON, write to output HTML."""
    if not TEMPLATE_PATH.exists():
        print(f"✗ explorer.template.html not found at {TEMPLATE_PATH}", file=sys.stderr)
        return
    html = TEMPLATE_PATH.read_text(encoding="utf-8")
    if PLACEHOLDER not in html:
        print(f"✗ Placeholder not found in template!", file=sys.stderr)
        return
    json_str = json.dumps(graph_data, ensure_ascii=False, indent=2)
    new_html = html.replace(PLACEHOLDER, json_str)
    OUTPUT_PATH.write_text(new_html, encoding="utf-8")
    print(f"✓ Graph data embedded into {OUTPUT_PATH}")


def main():
    # Determine repo root
    if "--root" in sys.argv:
        idx = sys.argv.index("--root")
        repo_root = Path(sys.argv[idx + 1]).resolve()
    else:
        repo_root = (SCRIPT_DIR / "../../../../").resolve()

    print(f"Scanning from: {repo_root}")
    graph_data = build_graph(repo_root)

    # Write standalone JSON (for debugging)
    json_out = SCRIPT_DIR / "graph_data.json"
    json_out.write_text(json.dumps(graph_data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ graph_data.json written ({len(graph_data['nodes'])} nodes)")

    embed_data(graph_data)
    print(f"\n→ Open in browser: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
