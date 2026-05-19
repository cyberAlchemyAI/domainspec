"""Two-layer retriever — the 5-step pipeline from
`features/two-layer-retrieval/spec/workflows.md`.

Sole entrypoint: `retrieve(query, corpus, k, intent_override=None)`.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Protocol

from .compose import NodeView, SCORERS
from .intent import Intent, classify_intent


# ----- Protocol mirror (avoid runtime import on vault_common.embedder ----
# vault_common.embedder.Embedder is the canonical Protocol; we re-declare
# the corpus surface here for type checkers without importing it.
class VaultCorpus(Protocol):
    def get_node(self, path: str): ...
    def nodes_matching(self, query: str) -> list[str]: ...
    def inbound(self, path: str, edge_type: str | None = None) -> list[str]: ...
    def outbound(self, path: str, edge_type: str | None = None) -> list[str]: ...
    def inbound_edge_types(self, path: str) -> set[str]: ...
    def outbound_edge_types(self, path: str) -> set[str]: ...
    def search_body(self, query: str, k: int) -> list[tuple[str, float]]: ...
    def body_sim(self, query: str, path: str) -> float: ...


# ----- result types ------------------------------------------------------

@dataclass
class ScoredNode:
    view: NodeView
    score: float
    score_components: dict[str, float] = field(default_factory=dict)


@dataclass
class RetrievalResult:
    query: str
    intent: Intent
    intent_confidence: float
    nodes: list[ScoredNode]
    candidate_set_size: int
    backend: str
    duration_ms: int
    notes: list[str] = field(default_factory=list)


# ----- intent → candidate-set strategy ----------------------------------

BODY_LEANING = {Intent.CANON, Intent.SEMANTIC, Intent.DEFINITIONAL, Intent.FRONTIER}
EDGE_LEANING = {Intent.PROVENANCE, Intent.BLAST_RADIUS, Intent.TENSION}

# Per-intent relevant edges for step 2b closure
_RELEVANT_EDGES: dict[Intent, tuple[str, ...]] = {
    Intent.PROVENANCE: ("derives-from", "cites"),
    Intent.TENSION: ("contradicts", "supersedes"),
    Intent.BLAST_RADIUS: ("governs", "derives-from"),
}


def _hard_filter(intent: Intent, fm: dict) -> bool:
    node_type = fm.get("node_type")
    status = fm.get("status")
    if intent == Intent.CANON:
        return node_type in {"axiom", "constitution"} and status in {"consolidated", "evergreen"}
    if intent == Intent.DEFINITIONAL:
        return node_type == "conceptual" and status in {"active", "consolidated", "evergreen"}
    if intent == Intent.FRONTIER:
        return status in {"draft", "exploratory"}
    return True


def _project(corpus: VaultCorpus, path: str, body_sim_value: float) -> NodeView | None:
    record = corpus.get_node(path)
    if record is None:
        return None
    fm = record.frontmatter or {}
    inbound = {t: corpus.inbound(path, edge_type=t) for t in corpus.inbound_edge_types(path)}
    outbound = {t: corpus.outbound(path, edge_type=t) for t in corpus.outbound_edge_types(path)}
    last_updated_days_ago = _days_ago(fm.get("last_updated"))
    return NodeView(
        path=path,
        node_type=fm.get("node_type"),
        status=fm.get("status"),
        verification=list(fm.get("verification", []) or []),
        body_sim=float(body_sim_value),
        inbound_edges=inbound,
        outbound_edges=outbound,
        last_updated_days_ago=last_updated_days_ago,
    )


def _days_ago(value) -> int | None:
    if value is None:
        return None
    from datetime import date, datetime
    try:
        if isinstance(value, datetime):
            d = value.date()
        elif isinstance(value, date):
            d = value
        else:
            d = date.fromisoformat(str(value)[:10])
    except (ValueError, TypeError):
        return None
    return (date.today() - d).days


# ----- main pipeline ----------------------------------------------------

def retrieve(
    query: str,
    corpus: VaultCorpus,
    k: int = 10,
    intent_override: Intent | None = None,
) -> RetrievalResult:
    if not query:
        raise ValueError("query must be non-empty")
    if k <= 0:
        raise ValueError("k must be > 0")

    start = time.perf_counter()
    notes: list[str] = []

    # Step 1: classify
    if intent_override is not None:
        intent = intent_override
        confidence = 1.0
    else:
        intent = classify_intent(query)
        confidence = 1.0 if intent != Intent.SEMANTIC else 0.5

    # Defer the LENS_TRIANGULATION gap exactly as TEST-SPEC G1 demands
    if intent not in SCORERS:
        raise NotImplementedError(f"no scorer for intent {intent.value}")

    # Step 2: candidate set
    k_candidates = max(k * 4, 50)
    candidate_sims: dict[str, float] = {}

    if intent in BODY_LEANING:
        for path, sim in corpus.search_body(query, k=k_candidates):
            record = corpus.get_node(path)
            if record is None:
                continue
            if not _hard_filter(intent, record.frontmatter or {}):
                continue
            candidate_sims[path] = sim
    else:  # EDGE_LEANING
        seeds = corpus.nodes_matching(query)
        if not seeds:
            notes.append("path-free query on edge-leaning intent — fell back to body-leaning candidate construction")
            for path, sim in corpus.search_body(query, k=k_candidates):
                candidate_sims[path] = sim
        else:
            edges = _RELEVANT_EDGES.get(intent, ())
            candidate_paths: set[str] = set(seeds)
            for seed in seeds:
                for etype in edges:
                    candidate_paths.update(corpus.inbound(seed, edge_type=etype))
                    candidate_paths.update(corpus.outbound(seed, edge_type=etype))
            for path in candidate_paths:
                if corpus.get_node(path) is None:
                    continue  # dangling target — skip
                candidate_sims[path] = corpus.body_sim(query, path)

    # Step 3: project
    views: list[NodeView] = []
    for path, sim in candidate_sims.items():
        view = _project(corpus, path, sim)
        if view is not None:
            views.append(view)

    # Step 4: score
    scorer = SCORERS[intent]
    scored: list[ScoredNode] = []
    for v in views:
        s, components = scorer(query, v)
        scored.append(ScoredNode(view=v, score=float(s), score_components=components))

    # Step 5: drop zero-score (failed hard filter / F4 exclusion),
    # then top-k with deterministic tiebreak.
    scored = [s for s in scored if s.score > 0.0]
    scored.sort(
        key=lambda s: (
            -s.score,
            (s.view.last_updated_days_ago if s.view.last_updated_days_ago is not None else 10**9),
            s.view.path,
        ),
    )
    top = scored[:k]

    return RetrievalResult(
        query=query,
        intent=intent,
        intent_confidence=confidence,
        nodes=top,
        candidate_set_size=len(scored),
        backend=type(corpus).__name__,
        duration_ms=int((time.perf_counter() - start) * 1000),
        notes=notes,
    )
