"""Vault graph analysis for reflection-tower structural checks."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
WIKI_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
ORIGIN_RE = re.compile(r"\borigin[-_]rung\s*:", re.IGNORECASE)


@dataclass(frozen=True)
class VaultNode:
    path: Path
    relpath: str
    stem: str
    frontmatter: dict[str, str]

    @property
    def layers(self) -> set[str]:
        raw = self.frontmatter.get("layer", "")
        return _split_values(raw)


@dataclass(frozen=True)
class VaultEdge:
    source: str
    target: str
    edge_type: str
    description: str
    target_resolved: str | None
    source_layers: set[str]
    target_layers: set[str]

    @property
    def cross_layer(self) -> bool:
        return bool(self.target_layers) and self.source_layers != self.target_layers

    @property
    def has_origin_rung(self) -> bool:
        return bool(ORIGIN_RE.search(self.description))


def _split_values(raw: str) -> set[str]:
    raw = raw.strip().strip("[]")
    if not raw:
        return set()
    return {
        part.strip().strip("'\"`")
        for part in re.split(r"[, ]+", raw)
        if part.strip().strip("'\"`")
    }


def _parse_frontmatter(text: str) -> dict[str, str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}
    out: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        out[key.strip()] = value.strip()
    return out


def _iter_markdown(root: Path) -> list[Path]:
    return sorted(
        path for path in root.rglob("*.md")
        if ".compiled" not in path.parts and not any(part.startswith(".") for part in path.relative_to(root).parts)
    )


def _node_index(nodes: list[VaultNode]) -> dict[str, VaultNode]:
    index: dict[str, VaultNode] = {}
    for node in nodes:
        index[node.relpath] = node
        index[node.stem] = node
        index[node.path.name] = node
    return index


def _extract_target(raw: str) -> str:
    raw = raw.strip().strip("`")
    match = LINK_RE.search(raw)
    if match:
        return match.group(2).split("#", 1)[0].strip()
    match = WIKI_RE.search(raw)
    if match:
        return match.group(1).strip()
    return raw


def _resolve_target(root: Path, source: Path, raw_target: str, index: dict[str, VaultNode]) -> VaultNode | None:
    target = raw_target.strip()
    if not target:
        return None
    if target in index:
        return index[target]
    if target.endswith(".md"):
        candidate = (source.parent / target).resolve()
        try:
            rel = candidate.relative_to(root.resolve()).as_posix()
        except ValueError:
            rel = ""
        if rel in index:
            return index[rel]
        if Path(target).name in index:
            return index[Path(target).name]
    stem = Path(target).stem
    return index.get(stem)


def _parse_connections(root: Path, node: VaultNode, index: dict[str, VaultNode]) -> list[VaultEdge]:
    text = node.path.read_text()
    lines = text.splitlines()
    in_connections = False
    edges: list[VaultEdge] = []
    for line in lines:
        if re.match(r"^##+\s+Connections\b", line, re.IGNORECASE):
            in_connections = True
            continue
        if in_connections and re.match(r"^##+\s+", line):
            break
        if not in_connections:
            continue
        stripped = line.strip()
        if not stripped.startswith("|") or re.match(r"^\|[\s\-:|]+\|$", stripped):
            continue
        cells = [cell.strip() for cell in stripped.strip("|").split("|")]
        if len(cells) < 2 or cells[0].lower() in {"document", "target", "source"}:
            continue
        raw_target = _extract_target(cells[0])
        edge_type = cells[1].strip("` ")
        description = " | ".join(cells[2:]) if len(cells) > 2 else ""
        target_node = _resolve_target(root, node.path, raw_target, index)
        edges.append(
            VaultEdge(
                source=node.relpath,
                target=raw_target,
                edge_type=edge_type,
                description=description,
                target_resolved=target_node.relpath if target_node else None,
                source_layers=node.layers,
                target_layers=target_node.layers if target_node else set(),
            )
        )
    return edges


def analyse_vault(root: Path) -> dict[str, Any]:
    """Parse a vault root and return node/edge inventory."""

    root = root.resolve()
    nodes = [
        VaultNode(
            path=path,
            relpath=path.relative_to(root).as_posix(),
            stem=path.stem,
            frontmatter=_parse_frontmatter(path.read_text()),
        )
        for path in _iter_markdown(root)
    ]
    index = _node_index(nodes)
    edges: list[VaultEdge] = []
    for node in nodes:
        edges.extend(_parse_connections(root, node, index))

    unresolved = [edge for edge in edges if edge.target_resolved is None]
    cross_layer = [edge for edge in edges if edge.cross_layer]
    return {
        "root": str(root),
        "summary": {
            "nodes": len(nodes),
            "edges": len(edges),
            "unresolvedEdges": len(unresolved),
            "crossLayerEdges": len(cross_layer),
        },
        "nodes": [
            {
                "path": node.relpath,
                "nodeType": node.frontmatter.get("node_type"),
                "layers": sorted(node.layers),
                "status": node.frontmatter.get("status"),
            }
            for node in nodes
        ],
        "edges": [
            {
                "source": edge.source,
                "target": edge.target,
                "targetResolved": edge.target_resolved,
                "type": edge.edge_type,
                "sourceLayers": sorted(edge.source_layers),
                "targetLayers": sorted(edge.target_layers),
                "crossLayer": edge.cross_layer,
                "hasOriginRung": edge.has_origin_rung,
            }
            for edge in edges
        ],
    }


def certify_origin(root: Path) -> dict[str, Any]:
    """Run T-1 origin certificate over a vault root."""

    inventory = analyse_vault(root)
    diagnostics: list[dict[str, Any]] = []
    for edge in inventory["edges"]:
        if edge["targetResolved"] is None:
            diagnostics.append(
                {
                    "code": "UNRESOLVED_EDGE_TARGET",
                    "severity": "flag",
                    "source": edge["source"],
                    "target": edge["target"],
                    "message": "Connection target could not be resolved inside the vault root.",
                }
            )
        if edge["crossLayer"] and not edge["hasOriginRung"]:
            diagnostics.append(
                {
                    "code": "MISSING_ORIGIN_RUNG",
                    "severity": "flag",
                    "source": edge["source"],
                    "target": edge["targetResolved"] or edge["target"],
                    "edgeType": edge["type"],
                    "message": "Cross-layer edge is missing an origin_rung annotation.",
                }
            )
    verdict = "block" if any(d["severity"] == "block" for d in diagnostics) else ("flag" if diagnostics else "pass")
    return {
        "verdict": verdict,
        "summary": inventory["summary"],
        "diagnostics": diagnostics,
        "inventory": inventory,
    }


def dumps(payload: dict[str, Any]) -> str:
    return json.dumps(payload, indent=2, sort_keys=True, default=str)

