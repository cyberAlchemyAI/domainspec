"""NetworkX-backed VaultCorpus implementation.

Loads a vault tree (directory of `.md` files) into an `nx.MultiDiGraph`
and an in-memory body-embedding matrix. Satisfies the `VaultCorpus`
Protocol declared in `features/two-layer-retrieval/spec/domain.md`.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import networkx as nx
import numpy as np

from vault_common.edges import extract_edges
from vault_common.embedder import Embedder
from vault_common.walker import VaultDoc, parse_doc


@dataclass
class NodeRecord:
    path: str
    frontmatter: dict
    body: str


class NetworkXCorpus:
    """In-memory vault graph + body-embedding matrix."""

    def __init__(
        self,
        root: Path,
        embedder: Embedder,
        glob: str = "**/*.md",
        eager_embed: bool = True,
    ):
        if not root.exists():
            raise FileNotFoundError(f"vault root does not exist: {root}")
        self._root = root.resolve()
        self._embedder = embedder
        self._glob = glob
        self._graph: nx.MultiDiGraph = nx.MultiDiGraph()
        self._records: dict[str, NodeRecord] = {}
        self._paths: list[str] = []
        self._matrix: np.ndarray | None = None
        self._query_cache: dict[str, np.ndarray] = {}

        self._load()
        if eager_embed:
            self._build_matrix()

    # ----- loading ------------------------------------------------------

    def _rel(self, p: Path) -> str:
        return str(p.resolve().relative_to(self._root))

    def _load(self) -> None:
        for p in sorted(self._root.glob(self._glob)):
            if not p.is_file():
                continue
            doc = parse_doc(p)
            if doc is None:
                continue
            rel = self._rel(p)
            self._records[rel] = NodeRecord(
                path=rel, frontmatter=doc.frontmatter or {}, body=doc.body,
            )
            self._graph.add_node(rel)
            self._paths.append(rel)
        # second pass: edges (need full node set first so dangling targets are visible as nodes)
        for rel, record in list(self._records.items()):
            doc = VaultDoc(
                path=Path(rel), text="", content_hash="",
                frontmatter=record.frontmatter, body=record.body,
            )
            for edge in extract_edges(doc):
                # edge.dst is whatever was declared in frontmatter — keep as-is
                self._graph.add_edge(rel, edge.dst, etype=edge.edge_type)

    def _build_matrix(self) -> None:
        bodies = [self._records[p].body for p in self._paths]
        if not bodies:
            self._matrix = np.zeros((0, self._embedder.dim), dtype=np.float32)
            return
        vecs = self._embedder.embed_batch(bodies)
        self._matrix = np.asarray(vecs, dtype=np.float32)

    def _ensure_matrix(self) -> np.ndarray:
        if self._matrix is None:
            self._build_matrix()
        assert self._matrix is not None
        return self._matrix

    def _query_vec(self, query: str) -> np.ndarray:
        if query not in self._query_cache:
            self._query_cache[query] = np.asarray(
                self._embedder.embed(query), dtype=np.float32,
            )
        return self._query_cache[query]

    # ----- Protocol surface --------------------------------------------

    def nodes(self) -> Iterable[NodeRecord]:
        return list(self._records.values())

    def get_node(self, path: str) -> NodeRecord | None:
        return self._records.get(path)

    def nodes_matching(self, query: str) -> list[str]:
        # Path-substring seed extraction per workflows.md Step 2b.
        return [p for p in self._paths if p in query]

    def inbound(self, path: str, edge_type: str | None = None) -> list[str]:
        sources: list[str] = []
        for src, _dst, data in self._graph.in_edges(path, data=True):
            if edge_type is None or data.get("etype") == edge_type:
                sources.append(src)
        return sources

    def outbound(self, path: str, edge_type: str | None = None) -> list[str]:
        targets: list[str] = []
        for _src, dst, data in self._graph.out_edges(path, data=True):
            if edge_type is None or data.get("etype") == edge_type:
                targets.append(dst)
        return targets

    def inbound_edge_types(self, path: str) -> set[str]:
        return {data.get("etype") for _s, _d, data in self._graph.in_edges(path, data=True)
                if data.get("etype")}

    def outbound_edge_types(self, path: str) -> set[str]:
        return {data.get("etype") for _s, _d, data in self._graph.out_edges(path, data=True)
                if data.get("etype")}

    def search_body(self, query: str, k: int) -> list[tuple[str, float]]:
        matrix = self._ensure_matrix()
        if matrix.shape[0] == 0:
            return []
        q = self._query_vec(query)
        sims = matrix @ q / (
            (np.linalg.norm(matrix, axis=1) * np.linalg.norm(q)) + 1e-12
        )
        # clip to [0, 1] — embeddings may be normalized already, but be defensive
        sims = np.clip(sims, 0.0, 1.0)
        idx = np.argsort(-sims)[:k]
        return [(self._paths[i], float(sims[i])) for i in idx]

    def body_sim(self, query: str, path: str) -> float:
        record = self._records.get(path)
        if record is None:
            return 0.0
        if path not in self._paths:
            return 0.0
        matrix = self._ensure_matrix()
        i = self._paths.index(path)
        q = self._query_vec(query)
        v = matrix[i]
        denom = (np.linalg.norm(v) * np.linalg.norm(q)) + 1e-12
        return float(np.clip(float(v @ q / denom), 0.0, 1.0))

    # ----- introspection (used by tests, not in Protocol) --------------

    @property
    def root(self) -> Path:
        return self._root

    def __len__(self) -> int:
        return len(self._records)
