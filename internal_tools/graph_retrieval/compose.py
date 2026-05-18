"""Per-intent compose-functions.

These are the ranking functions from `two-layer-retrieval/lenses/04-query-intent-ranking.md`.
Each returns a score in [0, 1] for a (query, node) pair given the local graph.
MVP implementations are skeletal — real backend wiring (graph traversal,
vector similarity) goes into `retriever.py`.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from .intent import Intent


@dataclass
class NodeView:
    """The shape compose-functions need from each candidate node."""
    path: str
    node_type: str | None
    status: str | None
    verification: list[str]
    body_sim: float       # cosine to query (precomputed)
    inbound_edges: dict[str, list[str]]   # edge_type -> list of sources
    outbound_edges: dict[str, list[str]]  # edge_type -> list of targets
    last_updated_days_ago: int | None = None


# Stage and verification priors --------------------------------------------------

_STAGE_PRIOR = {
    "draft": 0.10, "exploratory": 0.30, "active": 0.55,
    "consolidated": 0.80, "evergreen": 1.0, "retracted": 0.0,
}

def stage_prior(status: str | None) -> float:
    return _STAGE_PRIOR.get(status or "", 0.50)


def verification_prior(verification: list[str], *, intent: Intent) -> float:
    """Intent-conditioned verification ν_i. Canon excludes model-recall; others demote."""
    if not verification:
        return 0.7  # unmarked — neutral
    if intent == Intent.CANON and verification == ["model-recall"]:
        return 0.0  # hard exclude
    if "model-recall" in verification and "web-fetched" not in verification and "local-files-read" not in verification:
        return 0.5  # soft demote
    return 1.0


# Compose-functions per intent ---------------------------------------------------

def score_canon(query: str, n: NodeView) -> float:
    if n.node_type not in {"axiom", "constitution"}:
        return 0.0
    if n.status not in {"consolidated", "evergreen"}:
        return 0.0
    return stage_prior(n.status) * verification_prior(n.verification, intent=Intent.CANON) * n.body_sim


def score_provenance(query: str, n: NodeView, *, decay: float = 0.6) -> float:
    # depth-1 inbound through derives-from / cites — MVP uses count, not depth
    inbound = len(n.inbound_edges.get("derives-from", [])) + len(n.inbound_edges.get("cites", []))
    if inbound == 0:
        return 0.0
    return (1 - decay ** inbound) * verification_prior(n.verification, intent=Intent.PROVENANCE)


def score_frontier(query: str, n: NodeView, *, lambda_decay: float = 0.05) -> float:
    if n.status not in {"draft", "exploratory"}:
        return 0.0
    import math
    recency = math.exp(-lambda_decay * (n.last_updated_days_ago or 365))
    return recency * n.body_sim


def score_tension(query: str, n: NodeView) -> float:
    inbound = len(n.inbound_edges.get("contradicts", [])) + len(n.inbound_edges.get("supersedes", []))
    return min(1.0, inbound * 0.5) + 0.05 * n.body_sim


def score_semantic(query: str, n: NodeView) -> float:
    return n.body_sim


def score_blast_radius(query: str, n: NodeView) -> float:
    governs_in = len(n.inbound_edges.get("governs", []))
    derives_in = len(n.inbound_edges.get("derives-from", []))
    return min(1.0, (0.7 * governs_in + 0.3 * derives_in) * 0.5) * stage_prior(n.status)


def score_definitional(query: str, n: NodeView) -> float:
    if n.node_type != "conceptual":
        return 0.0
    if n.status not in {"active", "consolidated", "evergreen"}:
        return 0.0
    return verification_prior(n.verification, intent=Intent.DEFINITIONAL) * n.body_sim


SCORERS = {
    Intent.CANON: score_canon,
    Intent.PROVENANCE: score_provenance,
    Intent.FRONTIER: score_frontier,
    Intent.TENSION: score_tension,
    Intent.SEMANTIC: score_semantic,
    Intent.BLAST_RADIUS: score_blast_radius,
    Intent.DEFINITIONAL: score_definitional,
}


def score(intent: Intent, query: str, n: NodeView) -> float:
    return SCORERS[intent](query, n)
