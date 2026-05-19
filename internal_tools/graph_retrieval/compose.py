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
#
# Each scorer returns (score, components). `components` is the per-term
# breakdown surfaced on ScoredNode.score_components for explainability
# (architecture R-003).

_SUPERSEDES_EPSILON = 1e-3  # F5: superseding node ranks strictly above superseded

ScoreResult = tuple[float, dict[str, float]]


def score_canon(query: str, n: NodeView) -> ScoreResult:
    if n.node_type not in {"axiom", "constitution"}:
        return 0.0, {"hard_filter": 0.0}
    if n.status not in {"consolidated", "evergreen"}:
        return 0.0, {"hard_filter": 0.0}
    sp = stage_prior(n.status)
    vp = verification_prior(n.verification, intent=Intent.CANON)
    sup = _SUPERSEDES_EPSILON * len(n.outbound_edges.get("supersedes", []))
    value = sp * vp * n.body_sim + sup
    return value, {
        "stage_prior": sp,
        "verification_prior": vp,
        "body_sim": n.body_sim,
        "supersedes_bump": sup,
    }


def score_provenance(query: str, n: NodeView, *, decay: float = 0.6) -> ScoreResult:
    inbound = len(n.inbound_edges.get("derives-from", [])) + len(n.inbound_edges.get("cites", []))
    if inbound == 0:
        return 0.0, {"inbound_provenance": 0.0}
    saturation = 1 - decay ** inbound
    vp = verification_prior(n.verification, intent=Intent.PROVENANCE)
    return saturation * vp, {
        "inbound_provenance": float(inbound),
        "saturation": saturation,
        "verification_prior": vp,
    }


def score_frontier(query: str, n: NodeView, *, lambda_decay: float = 0.05) -> ScoreResult:
    if n.status not in {"draft", "exploratory"}:
        return 0.0, {"hard_filter": 0.0}
    import math
    recency = math.exp(-lambda_decay * (n.last_updated_days_ago or 365))
    return recency * n.body_sim, {
        "recency": recency,
        "body_sim": n.body_sim,
    }


def score_tension(query: str, n: NodeView) -> ScoreResult:
    inbound = len(n.inbound_edges.get("contradicts", [])) + len(n.inbound_edges.get("supersedes", []))
    tension_term = min(1.0, inbound * 0.5)
    body_term = 0.05 * n.body_sim
    return tension_term + body_term, {
        "tension_term": tension_term,
        "body_sim_weighted": body_term,
    }


def score_semantic(query: str, n: NodeView) -> ScoreResult:
    return n.body_sim, {"body_sim": n.body_sim}


def score_blast_radius(query: str, n: NodeView) -> ScoreResult:
    governs_in = len(n.inbound_edges.get("governs", []))
    derives_in = len(n.inbound_edges.get("derives-from", []))
    dependency_term = min(1.0, (0.7 * governs_in + 0.3 * derives_in) * 0.5)
    sp = stage_prior(n.status)
    return dependency_term * sp, {
        "governs_in": float(governs_in),
        "derives_in": float(derives_in),
        "dependency_term": dependency_term,
        "stage_prior": sp,
    }


def score_definitional(query: str, n: NodeView) -> ScoreResult:
    if n.node_type != "conceptual":
        return 0.0, {"hard_filter": 0.0}
    if n.status not in {"active", "consolidated", "evergreen"}:
        return 0.0, {"hard_filter": 0.0}
    vp = verification_prior(n.verification, intent=Intent.DEFINITIONAL)
    return vp * n.body_sim, {
        "verification_prior": vp,
        "body_sim": n.body_sim,
    }


SCORERS = {
    Intent.CANON: score_canon,
    Intent.PROVENANCE: score_provenance,
    Intent.FRONTIER: score_frontier,
    Intent.TENSION: score_tension,
    Intent.SEMANTIC: score_semantic,
    Intent.BLAST_RADIUS: score_blast_radius,
    Intent.DEFINITIONAL: score_definitional,
}


def score(intent: Intent, query: str, n: NodeView) -> ScoreResult:
    return SCORERS[intent](query, n)
