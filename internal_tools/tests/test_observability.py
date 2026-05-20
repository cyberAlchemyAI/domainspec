"""Acceptance tests for graph_retrieval observability.

Covers the test surface from
features/observability/spec/operations.md §Test isolation and the
spec's §3 "Test surface" table.
"""

from __future__ import annotations

import logging

import pytest

from graph_retrieval.compose import NodeView
from graph_retrieval.instrumented import FaithfulnessGuardMode, retrieve
from graph_retrieval.intent import Intent
from graph_retrieval.retriever import RetrievalResult
from vault_common.otel import (
    ExporterChoice,
    configure_observability,
    current_state,
)


# ----- Provider-lifecycle tests -----------------------------------------

def test_default_noop_state() -> None:
    """current_state() without explicit configure → NOOP exporter."""
    configure_observability(ExporterChoice.NOOP, force=True)
    state = current_state()
    assert state.exporter == ExporterChoice.NOOP
    assert state.configured is True


def test_force_true_swaps_provider() -> None:
    s1 = configure_observability(ExporterChoice.NOOP, force=True)
    s2 = configure_observability(ExporterChoice.NOOP, force=True)
    assert s1.provider_id != s2.provider_id, "force=True must build a fresh provider"


def test_force_false_raises_when_already_configured() -> None:
    configure_observability(ExporterChoice.NOOP, force=True)
    with pytest.raises(RuntimeError, match="already configured"):
        configure_observability(ExporterChoice.NOOP, force=False)


def test_invalid_log_level_raises() -> None:
    with pytest.raises(ValueError, match="log_level"):
        configure_observability(ExporterChoice.NOOP, log_level="NOTALEVEL", force=True)


def test_env_driven_exporter(monkeypatch: pytest.MonkeyPatch) -> None:
    """OTEL_EXPORTER=console + fresh state → CONSOLE active."""
    import vault_common.otel as otel
    monkeypatch.setenv("OTEL_EXPORTER", "console")
    monkeypatch.setattr(otel, "_state", None)  # wipe singleton
    state = current_state()
    assert state.exporter == ExporterChoice.CONSOLE


# ----- F-guard tests ----------------------------------------------------

class _FakeRecord:
    def __init__(self, frontmatter: dict, body: str = "fake body"):
        self.frontmatter = frontmatter
        self.body = body


class _LyingCorpus:
    """Corpus that LIES about its edge types — forces F1 violation under DEBUG."""

    def __init__(self):
        self._records = {
            "a.md": _FakeRecord({"node_type": "axiom", "status": "evergreen",
                                  "verification": ["local-files-read"]}),
        }

    def get_node(self, path):
        return self._records.get(path)

    def nodes_matching(self, query):
        return []

    def inbound(self, path, edge_type=None):
        return []

    def outbound(self, path, edge_type=None):
        return []

    def inbound_edge_types(self, path):
        # Claim there are edge types, but projection will pick up none
        # (because inbound() returns []) → set mismatch → F1 violation
        return {"derives-from", "contradicts"}

    def outbound_edge_types(self, path):
        return set()

    def search_body(self, query, k):
        return [("a.md", 0.9)]

    def body_sim(self, query, path):
        return 0.9


def test_fguard_off_no_increment(monkeypatch: pytest.MonkeyPatch) -> None:
    configure_observability(ExporterChoice.NOOP, force=True)
    from graph_retrieval import instrumentation
    calls: list = []
    monkeypatch.setattr(
        instrumentation.f1_violation, "add",
        lambda v, attrs: calls.append((v, attrs)),
    )
    corpus = _LyingCorpus()
    retrieve("anything", corpus, k=1, intent_override=Intent.CANON,
             guard_mode=FaithfulnessGuardMode.OFF)
    assert calls == [], "guard OFF must never increment f1_violation"


def _ranked_canon_result(view: NodeView) -> RetrievalResult:
    """Build a 1-node CANON result around a hand-crafted view, for guard testing."""
    from graph_retrieval.retriever import ScoredNode
    return RetrievalResult(
        query="q", intent=Intent.CANON, intent_confidence=1.0,
        nodes=[ScoredNode(view=view, score=1.0, score_components={})],
        candidate_set_size=1, backend="_LyingCorpus", duration_ms=0, notes=[],
    )


def test_run_fguard_detects_f1_when_projection_disagrees_with_corpus(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """If view.inbound_edges keys ≠ corpus.inbound_edge_types, F1 increments."""
    from graph_retrieval import instrumentation
    from graph_retrieval.instrumented import _run_fguard
    calls: list = []
    monkeypatch.setattr(
        instrumentation.f1_violation, "add",
        lambda v, attrs: calls.append((v, attrs)),
    )

    # view claims NO edges; corpus claims derives-from exists → F1 violation
    view = NodeView(
        path="a.md", node_type="axiom", status="evergreen",
        verification=["local-files-read"], body_sim=0.9,
        inbound_edges={}, outbound_edges={},
    )
    corpus = _LyingCorpus()  # returns {"derives-from", "contradicts"} for inbound_edge_types
    _run_fguard(_ranked_canon_result(view), corpus)

    assert len(calls) == 1, f"F1 should fire when keys disagree; got {calls}"
    assert calls[0][1]["intent"] == "canon"


def test_run_fguard_detects_f4_canon_model_recall(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """If a CANON result carries verification=['model-recall'], F4 increments."""
    from graph_retrieval import instrumentation
    from graph_retrieval.instrumented import _run_fguard
    calls: list = []
    monkeypatch.setattr(
        instrumentation.f4_violation, "add",
        lambda v, attrs: calls.append((v, attrs)),
    )

    class _HonestCorpus(_LyingCorpus):
        def inbound_edge_types(self, path):
            return set()  # honest — keys agree, so F1 wouldn't fire

    view = NodeView(
        path="m.md", node_type="axiom", status="evergreen",
        verification=["model-recall"], body_sim=0.9,
        inbound_edges={}, outbound_edges={},
    )
    _run_fguard(_ranked_canon_result(view), _HonestCorpus())
    assert len(calls) == 1


def test_fguard_env_var_resolves_to_debug(monkeypatch: pytest.MonkeyPatch) -> None:
    """GRAPH_RETRIEVAL_GUARD_MODE=debug → _resolve_guard_mode returns DEBUG."""
    from graph_retrieval.instrumented import _resolve_guard_mode
    monkeypatch.setenv("GRAPH_RETRIEVAL_GUARD_MODE", "debug")
    assert _resolve_guard_mode(None) == FaithfulnessGuardMode.DEBUG


def test_fguard_explicit_kwarg_wins_over_env(monkeypatch: pytest.MonkeyPatch) -> None:
    from graph_retrieval.instrumented import _resolve_guard_mode
    monkeypatch.setenv("GRAPH_RETRIEVAL_GUARD_MODE", "debug")
    assert _resolve_guard_mode(FaithfulnessGuardMode.OFF) == FaithfulnessGuardMode.OFF


# ----- Metric-emission tests --------------------------------------------

def test_unimplemented_intent_increments_counter(monkeypatch: pytest.MonkeyPatch) -> None:
    configure_observability(ExporterChoice.NOOP, force=True)
    from graph_retrieval import instrumentation
    calls: list = []
    monkeypatch.setattr(
        instrumentation.retrieve_unimplemented_intent, "add",
        lambda v, attrs: calls.append((v, attrs)),
    )

    class _MinimalCorpus(_LyingCorpus):
        def inbound_edge_types(self, path):
            return set()

    corpus = _MinimalCorpus()
    with pytest.raises(NotImplementedError):
        retrieve("anything", corpus, k=1, intent_override=Intent.LENS_TRIANGULATION)
    assert len(calls) == 1


def test_success_emits_invocation_and_candidate_set_size(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_observability(ExporterChoice.NOOP, force=True)
    from graph_retrieval import instrumentation
    inv: list = []
    css: list = []
    monkeypatch.setattr(
        instrumentation.retrieve_invocation, "add",
        lambda v, attrs: inv.append((v, attrs)),
    )
    monkeypatch.setattr(
        instrumentation.retrieve_candidate_set_size, "record",
        lambda v, attrs: css.append((v, attrs)),
    )

    class _GoodCorpus(_LyingCorpus):
        def inbound_edge_types(self, path):
            return set()

    corpus = _GoodCorpus()
    retrieve("anything", corpus, k=1, intent_override=Intent.CANON)
    assert any(c[1].get("result") == "success" for c in inv), f"no success counter, got {inv}"
    assert len(css) == 1


# ----- Log envelope test ------------------------------------------------

def test_json_log_envelope_on_success(
    caplog: pytest.LogCaptureFixture,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_observability(ExporterChoice.NOOP, force=True)

    class _GoodCorpus(_LyingCorpus):
        def inbound_edge_types(self, path):
            return set()

    corpus = _GoodCorpus()
    with caplog.at_level(logging.INFO, logger="graph_retrieval"):
        retrieve("hello world", corpus, k=1, intent_override=Intent.CANON)

    # The decorator's structured log should fire as `retrieve.completed`.
    completed = [r for r in caplog.records if "completed" in r.getMessage()]
    assert completed, f"no completed log; got {[r.getMessage() for r in caplog.records]}"
    obs = getattr(completed[0], "obs", None)
    assert isinstance(obs, dict)
    assert obs["event"] == "retrieve.completed"
    assert obs["feature"] == "two-layer-retrieval"
    assert obs["intent"] == "canon"
    assert "query_hash" in obs and len(obs["query_hash"]) == 12
    # Raw query MUST NOT appear in the log payload
    assert "hello world" not in str(obs)
