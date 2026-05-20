"""Instrumented wrapper around `graph_retrieval.retriever.retrieve`.

Two responsibilities, both kept OUT of `retriever.py` to honor
architecture R-001 (algorithm file imports Protocols only):

1. **Telemetry** — span, duration histogram, structured log via
   `@instrumented`, plus the counter / histogram emissions declared
   in `features/two-layer-retrieval/spec/observability.md`.
2. **Edge validator (F-guard)** — under `FaithfulnessGuardMode.DEBUG`,
   re-checks every result against the F1 (typed-edge preservation) and
   F4 (CANON × model-recall) contracts and increments the corresponding
   violation counter when the check fails.

Callers choose their surface by import path:
    `from graph_retrieval.retriever import retrieve`     # pure
    `from graph_retrieval.instrumented import retrieve`  # wrapped
"""

from __future__ import annotations

import os
from enum import Enum
from typing import Any

from .instrumentation import (
    f1_violation,
    f4_violation,
    instrumented,
    retrieve_candidate_set_size,
    retrieve_intent_fallback,
    retrieve_invocation,
    retrieve_unimplemented_intent,
)
from .intent import Intent
from .retriever import RetrievalResult, retrieve as _retrieve_raw


_FEATURE = "two-layer-retrieval"


class FaithfulnessGuardMode(str, Enum):
    """Feature-local enum. Lives here, not in vault_common kernel."""

    OFF = "off"
    DEBUG = "debug"


def _resolve_guard_mode(explicit: FaithfulnessGuardMode | None) -> FaithfulnessGuardMode:
    """Precedence: explicit kwarg > GRAPH_RETRIEVAL_GUARD_MODE env > OFF."""
    if explicit is not None:
        return explicit
    raw = (os.environ.get("GRAPH_RETRIEVAL_GUARD_MODE") or "").strip().lower()
    try:
        return FaithfulnessGuardMode(raw) if raw else FaithfulnessGuardMode.OFF
    except ValueError:
        return FaithfulnessGuardMode.OFF


def _emit_success_metrics(result: RetrievalResult, backend_name: str) -> None:
    base = {"feature": _FEATURE, "intent": result.intent.value, "backend": backend_name}
    retrieve_invocation.add(1, {**base, "result": "success"})
    retrieve_candidate_set_size.record(
        result.candidate_set_size, {"feature": _FEATURE, "intent": result.intent.value},
    )
    if result.intent == Intent.SEMANTIC and result.intent_confidence < 1.0:
        retrieve_intent_fallback.add(1, {"feature": _FEATURE})


def _run_fguard(result: RetrievalResult, corpus: Any) -> None:
    """Re-check F1 + F4 against the corpus. Increment counters on violation."""
    for n in result.nodes:
        corpus_in = corpus.inbound_edge_types(n.view.path)
        corpus_out = corpus.outbound_edge_types(n.view.path)
        if (set(n.view.inbound_edges.keys()) != corpus_in
                or set(n.view.outbound_edges.keys()) != corpus_out):
            f1_violation.add(
                1, {"feature": _FEATURE, "intent": result.intent.value},
            )
        if result.intent == Intent.CANON and n.view.verification == ["model-recall"]:
            f4_violation.add(1, {"feature": _FEATURE})


@instrumented(
    name="retrieve",
    attributes_from_args=("k",),
    attributes_from_result=("intent", "candidate_set_size", "backend"),
)
def retrieve(
    query: str,
    corpus: Any,
    k: int = 10,
    intent_override: Intent | None = None,
    guard_mode: FaithfulnessGuardMode | None = None,
) -> RetrievalResult:
    backend_name = type(corpus).__name__
    try:
        result = _retrieve_raw(query, corpus, k=k, intent_override=intent_override)
    except NotImplementedError:
        retrieve_unimplemented_intent.add(1, {"feature": _FEATURE})
        retrieve_invocation.add(
            1, {"feature": _FEATURE, "backend": backend_name, "result": "error"},
        )
        raise

    effective_guard = _resolve_guard_mode(guard_mode)
    if effective_guard == FaithfulnessGuardMode.DEBUG:
        _run_fguard(result, corpus)

    _emit_success_metrics(result, backend_name)
    return result
