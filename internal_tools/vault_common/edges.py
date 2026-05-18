"""Edge extractor. Single canonical edge-verb taxonomy."""

from __future__ import annotations

from dataclasses import dataclass

from .frontmatter import EDGE_FIELDS
from .walker import VaultDoc

EDGE_TYPES: frozenset[str] = frozenset(EDGE_FIELDS)


@dataclass(frozen=True)
class Edge:
    src: str
    dst: str
    edge_type: str


def extract_edges(doc: VaultDoc) -> list[Edge]:
    """Extract typed edges declared in the document's frontmatter."""
    edges: list[Edge] = []
    fm = doc.frontmatter or {}
    src = str(doc.path)
    for etype in EDGE_TYPES:
        for key in (etype, etype.replace("-", "_")):
            targets = fm.get(key)
            if not targets:
                continue
            if isinstance(targets, str):
                targets = [targets]
            for tgt in targets:
                edges.append(Edge(src=src, dst=str(tgt), edge_type=etype))
    return edges
