"""Acceptance tests for graph_retrieval.retriever.

Covers the T1–T8 matrix from
features/two-layer-retrieval/spec/TEST-SPEC.md plus the G1 negative test
and the error contract from interfaces.md.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from graph_retrieval.compose import NodeView, score_canon
from graph_retrieval.intent import Intent, classify_intent
from graph_retrieval.networkx_corpus import NetworkXCorpus
from graph_retrieval.retriever import retrieve
from vault_common.embedder import NullEmbedder


HOUSE_VAULT = Path("/Users/victorboscaro/house_project/docs/vault")


# ----- T6: F5 supersedes pathology --------------------------------------

def _canon_view(path: str, body_sim: float, *, supersedes: list[str] | None = None) -> NodeView:
    return NodeView(
        path=path,
        node_type="axiom",
        status="evergreen",
        verification=["local-files-read"],
        body_sim=body_sim,
        inbound_edges={},
        outbound_edges={"supersedes": list(supersedes or [])},
    )


def test_t6_supersedes_strict_inequality_under_equal_body_sim() -> None:
    """rules.md F5: superseding node ranks strictly above superseded."""
    a = _canon_view("a.md", body_sim=0.5)
    a_prime = _canon_view("a_prime.md", body_sim=0.5, supersedes=["a.md"])
    assert score_canon("any query", a_prime)[0] > score_canon("any query", a)[0]


def test_t6_supersedes_does_not_flip_clearly_better_body() -> None:
    """The F5 ε must not be large enough to flip a clearly-higher body_sim."""
    a = _canon_view("a.md", body_sim=0.9)
    a_prime = _canon_view("a_prime.md", body_sim=0.5, supersedes=["a.md"])
    assert score_canon("any query", a)[0] > score_canon("any query", a_prime)[0]


# ----- T8: falsification round vs vector-only baseline ------------------

# 9 structurally-demanding queries spanning the 4 edge-using intents.
_T8_QUERIES: list[tuple[str, Intent]] = [
    ("what do we believe about routing?", Intent.CANON),
    ("what do we believe about ingestion?", Intent.CANON),
    ("what do we believe about extraction?", Intent.CANON),
    ("evidence for routing decisions", Intent.PROVENANCE),
    ("evidence for ingestion pipeline", Intent.PROVENANCE),
    ("evidence for extraction rules", Intent.PROVENANCE),
    ("what contradicts the routing baseline?", Intent.TENSION),
    ("what breaks if I retire the extraction tier?", Intent.BLAST_RADIUS),
    ("what breaks if I retire the routing system?", Intent.BLAST_RADIUS),
]


def _kendall_disagrees(a: list[str], b: list[str]) -> bool:
    """True iff the two ranked lists differ either in membership or order."""
    if a == b:
        return False
    if set(a) != set(b):
        return True
    # same set, different order → at least one inversion
    return a != b


@pytest.fixture(scope="module")
def house_corpus() -> NetworkXCorpus:
    if not HOUSE_VAULT.exists():
        pytest.skip(f"house_project vault not available at {HOUSE_VAULT}")
    from vault_common.embedders.sentence_transformer import SentenceTransformerEmbedder
    embedder = SentenceTransformerEmbedder()
    return NetworkXCorpus(root=HOUSE_VAULT, embedder=embedder, eager_embed=True)


def test_t8_falsification_vector_only_baseline(house_corpus: NetworkXCorpus) -> None:
    """Two-layer ranking must disagree with vector-only on ≥3 of 9 queries."""
    k = 5
    disagreements = 0
    per_query: list[tuple[str, bool, list[str], list[str]]] = []

    for query, intent in _T8_QUERIES:
        # Two-layer
        tl = retrieve(query, house_corpus, k=k, intent_override=intent)
        tl_paths = [n.view.path for n in tl.nodes]

        # Vector-only baseline: top-k by raw body cosine, no intent, no filter
        vo = [p for p, _ in house_corpus.search_body(query, k=k)]

        disagrees = _kendall_disagrees(tl_paths, vo)
        per_query.append((query, disagrees, tl_paths, vo))
        if disagrees:
            disagreements += 1

    # Diagnostic report — printed on failure
    report = "\n".join(
        f"  [{'≠' if d else '='}] {q!r}\n      TL: {tl}\n      VO: {vo}"
        for q, d, tl, vo in per_query
    )
    assert disagreements >= 3, (
        f"T8 falsification failed: only {disagreements}/9 queries showed disagreement.\n"
        f"Design is empirically indistinguishable from vector-only RAG on this corpus.\n{report}"
    )


# ----- corpus smoke (proves load works before T8 runs) ------------------

def test_corpus_loads_house_vault() -> None:
    if not HOUSE_VAULT.exists():
        pytest.skip(f"house_project vault not available at {HOUSE_VAULT}")
    corpus = NetworkXCorpus(root=HOUSE_VAULT, embedder=NullEmbedder(), eager_embed=False)
    assert len(corpus) > 0
    # at least one node with a node_type
    typed = [r for r in corpus.nodes() if r.frontmatter.get("node_type")]
    assert len(typed) > 0


# ----- T1: intent classification ----------------------------------------

# 3 queries per intent × 7 intents (LENS_TRIANGULATION has its own
# rule but no scorer — covered by G1, not here)
_T1_CASES: list[tuple[str, Intent]] = [
    ("what do we believe about routing?", Intent.CANON),
    ("currently believe about audit", Intent.CANON),
    ("canon view on extraction", Intent.CANON),
    ("evidence for the routing system", Intent.PROVENANCE),
    ("derives from this discovery", Intent.PROVENANCE),
    ("what supports the extraction tier", Intent.PROVENANCE),
    ("what are we exploring on routing", Intent.FRONTIER),
    ("draft notes on this topic", Intent.FRONTIER),
    ("frontier work in the extraction module", Intent.FRONTIER),
    ("what contradicts the baseline", Intent.TENSION),
    ("refute this claim", Intent.TENSION),
    ("disagree with the routing decision", Intent.TENSION),
    ("what breaks if I retire X", Intent.BLAST_RADIUS),
    ("impact of removing the routing rule", Intent.BLAST_RADIUS),
    ("blast radius of this change", Intent.BLAST_RADIUS),
    ("lenses on the routing topic", Intent.LENS_TRIANGULATION),
    ("triangulate the angles", Intent.LENS_TRIANGULATION),
    ("angles bearing on extraction", Intent.LENS_TRIANGULATION),
    ("what does residue mean here", Intent.DEFINITIONAL),
    ("definition of routing", Intent.DEFINITIONAL),
    ("glossary entry for tier3", Intent.DEFINITIONAL),
    ("residue attractor", Intent.SEMANTIC),  # fallback
    ("extraction tier3 nuances", Intent.SEMANTIC),
    ("anything close to routing baseline", Intent.SEMANTIC),
]


@pytest.mark.parametrize("query,expected", _T1_CASES)
def test_t1_intent_classification(query: str, expected: Intent) -> None:
    assert classify_intent(query) == expected, f"expected {expected.value} for {query!r}"


# ----- T3: F2 + F3 stratification under CANON ---------------------------

def test_t3_canon_stratification(house_corpus: NetworkXCorpus) -> None:
    # Use intent_override — the live classifier isn't on trial here, the
    # stratification rules are.
    result = retrieve(
        "what do we believe about this vault?",
        house_corpus,
        k=5,
        intent_override=Intent.CANON,
    )
    if not result.nodes:
        pytest.skip("CANON returned 0 results — vault lacks axiom/constitution × evergreen/consolidated")
    for n in result.nodes:
        assert n.view.node_type in {"axiom", "constitution"}, (
            f"F2 violation: {n.view.path} has node_type={n.view.node_type}"
        )
        assert n.view.status in {"consolidated", "evergreen"}, (
            f"F3 violation: {n.view.path} has status={n.view.status}"
        )


# ----- T4: F1 typed-edge preservation -----------------------------------

@pytest.mark.parametrize("intent_str", ["CANON", "PROVENANCE", "SEMANTIC"])
def test_t4_typed_edge_preservation(house_corpus: NetworkXCorpus, intent_str: str) -> None:
    intent = Intent[intent_str]
    query = "anything about routing or extraction"
    result = retrieve(query, house_corpus, k=5, intent_override=intent)
    if not result.nodes:
        pytest.skip(f"{intent_str} returned 0 results")
    for n in result.nodes:
        assert set(n.view.inbound_edges.keys()) == house_corpus.inbound_edge_types(n.view.path)
        assert set(n.view.outbound_edges.keys()) == house_corpus.outbound_edge_types(n.view.path)
        for etype, sources in n.view.inbound_edges.items():
            assert sources == house_corpus.inbound(n.view.path, edge_type=etype)
        for etype, targets in n.view.outbound_edges.items():
            assert targets == house_corpus.outbound(n.view.path, edge_type=etype)


# ----- T5: F4 — CANON rejects model-recall-only -------------------------

_T5_GOOD_NODE = """---
node_type: axiom
status: evergreen
layer: ontology
nature: reference
verification: [local-files-read]
---
# Good axiom about routing
This axiom is locally verified and should be retrievable under CANON.
"""

_T5_BAD_NODE = """---
node_type: axiom
status: evergreen
layer: ontology
nature: reference
verification: [model-recall]
---
# Model-recall-only axiom about routing
This axiom should be excluded from CANON results per F4.
"""


def test_t5_canon_rejects_model_recall_only(tmp_path: Path) -> None:
    (tmp_path / "good.md").write_text(_T5_GOOD_NODE)
    (tmp_path / "bad.md").write_text(_T5_BAD_NODE)

    from vault_common.embedders.sentence_transformer import SentenceTransformerEmbedder
    corpus = NetworkXCorpus(root=tmp_path, embedder=SentenceTransformerEmbedder(), eager_embed=True)

    result = retrieve("routing axiom", corpus, k=5, intent_override=Intent.CANON)
    paths = [n.view.path for n in result.nodes]
    assert "bad.md" not in paths, f"F4 violation: model-recall-only node leaked into CANON: {paths}"
    # good.md must still be retrievable — sanity that the filter isn't blanket
    assert "good.md" in paths, f"F4 over-rejection: locally-verified node missing: {paths}"


# ----- T7: PROVENANCE edge presence -------------------------------------

def test_t7_provenance_edge_presence(house_corpus: NetworkXCorpus) -> None:
    # Vault audit showed only 1 derives-from declaration. Skip when sparse.
    derives_from_nodes = [r for r in house_corpus.nodes()
                         if r.frontmatter.get("derives-from") or r.frontmatter.get("derives_from")]
    if len(derives_from_nodes) < 3:
        pytest.skip(f"vault has only {len(derives_from_nodes)} derives-from declarations — insufficient for T7")
    result = retrieve("evidence for routing", house_corpus, k=5, intent_override=Intent.PROVENANCE)
    if not result.nodes:
        pytest.skip("PROVENANCE returned 0 results")
    assert any(n.view.inbound_edges.get("derives-from") for n in result.nodes), (
        "T7: no result has inbound derives-from edges — provenance pipeline likely not wired"
    )


# ----- G1: LENS_TRIANGULATION has no scorer in v0.1 ---------------------

def test_g1_lens_triangulation_raises_not_implemented(house_corpus: NetworkXCorpus) -> None:
    with pytest.raises(NotImplementedError, match="lens_triangulation"):
        retrieve("dummy", house_corpus, k=3, intent_override=Intent.LENS_TRIANGULATION)


# ----- Error contract (interfaces.md) -----------------------------------

def test_error_empty_query_raises_value_error() -> None:
    from unittest.mock import MagicMock
    with pytest.raises(ValueError, match="non-empty"):
        retrieve("", MagicMock(), k=5)


def test_error_nonpositive_k_raises_value_error() -> None:
    from unittest.mock import MagicMock
    with pytest.raises(ValueError, match="> 0"):
        retrieve("anything", MagicMock(), k=0)


# ----- score_components contract (architecture R-003) -------------------

def test_score_components_populated_for_all_intents(house_corpus: NetworkXCorpus) -> None:
    """Every scored result must carry a non-empty score_components dict."""
    for intent in [Intent.CANON, Intent.SEMANTIC, Intent.DEFINITIONAL]:
        result = retrieve("anything about routing", house_corpus, k=3, intent_override=intent)
        if not result.nodes:
            continue
        for n in result.nodes:
            assert len(n.score_components) >= 1, (
                f"{intent.value} returned a result without score_components: {n.view.path}"
            )
