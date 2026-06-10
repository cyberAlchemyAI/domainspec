"""Tests for the canonical code ontology + validate_ontology.py.

Stdlib + pytest. The module under test sits one level up; add it to sys.path.
"""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
BUNDLE = HERE.parent
sys.path.insert(0, str(BUNDLE))

import validate_ontology as vo  # noqa: E402


@pytest.fixture(scope="module")
def onto():
    return vo.load()


# --- schema self-check ------------------------------------------------------

def test_schema_self_check_passes(onto):
    assert vo.check_schema(onto) == []


def test_declared_counts_match(onto):
    assert onto["meta_type_count"] == len(onto["meta_types"]) == 25
    assert onto["edge_count"] == len(onto["edges"]) == 29
    assert set(onto["edge_families"]) == {"R_B", "R_CF", "R_U", "R_X"}


def test_family_partition_counts(onto):
    from collections import Counter
    fam = Counter(e["family"] for e in onto["edges"])
    assert fam == {"R_B": 12, "R_CF": 3, "R_U": 8, "R_X": 6}


def test_tokens_unique(onto):
    mt = [m["token"] for m in onto["meta_types"]]
    et = [e["token"] for e in onto["edges"]]
    assert len(mt) == len(set(mt))
    assert len(et) == len(set(et))


def test_every_edge_endpoint_is_a_real_meta_type(onto):
    toks = {m["token"] for m in onto["meta_types"]}
    for e in onto["edges"]:
        for role in ("source", "target"):
            for t in e[role]:
                assert t in toks, f"{e['token']}.{role} -> {t} missing"


def test_cross_layer_is_ui_to_backend(onto):
    part = {m["token"]: m["partition"] for m in onto["meta_types"]}
    rx = [e for e in onto["edges"] if e["family"] == "R_X"]
    assert len(rx) == 6
    for e in rx:
        assert all(part[t] == "ui" for t in e["source"])
        assert all(part[t] == "backend" for t in e["target"])


# --- concept-graph type safety (P1) -----------------------------------------

def _graph(nodes, edges):
    return {"nodes": nodes, "edges": edges}


def test_valid_graph_passes(onto):
    g = _graph(
        [{"id": "o1", "meta_type": "Operation"}, {"id": "ev1", "meta_type": "Event"}],
        [{"type": "produces", "source": "o1", "target": "ev1"}],
    )
    assert vo.validate_graph(onto, g) == []


def test_display_name_alias_normalizes(onto):
    # "Value Object" (display) must resolve to token ValueObject
    g = _graph(
        [{"id": "e1", "meta_type": "Entity"}, {"id": "v1", "meta_type": "Value Object"}],
        [{"type": "contains", "source": "e1", "target": "v1"}],
    )
    assert vo.validate_graph(onto, g) == []


def test_type_safety_violation_rejected(onto):
    # performs requires Entity -> Operation; give it Entity -> Event
    g = _graph(
        [{"id": "e1", "meta_type": "Entity"}, {"id": "x", "meta_type": "Event"}],
        [{"type": "performs", "source": "e1", "target": "x"}],
    )
    errs = vo.validate_graph(onto, g)
    assert any("target" in e and "performs" in e for e in errs)


def test_unknown_edge_rejected(onto):
    g = _graph(
        [{"id": "a", "meta_type": "Entity"}, {"id": "b", "meta_type": "Operation"}],
        [{"type": "frobnicates", "source": "a", "target": "b"}],
    )
    errs = vo.validate_graph(onto, g)
    assert any("frobnicates" in e for e in errs)


def test_unknown_meta_type_rejected(onto):
    g = _graph([{"id": "a", "meta_type": "Wizard"}], [])
    errs = vo.validate_graph(onto, g)
    assert any("Wizard" in e for e in errs)


def test_cross_feature_edge_typechecks(onto):
    # triggers-cross: Event -> Operation (backend -> backend, across features)
    g = _graph(
        [{"id": "ev", "meta_type": "Event"}, {"id": "op", "meta_type": "Operation"}],
        [{"type": "triggers-cross", "source": "ev", "target": "op"}],
    )
    assert vo.validate_graph(onto, g) == []


# --- real extraction format ({objects, morphisms, rel_type}) ----------------

def _cat_graph(objects, morphisms):
    """Build a minimal real-extractor-shaped L1 graph."""
    return {"objects": objects, "morphisms": morphisms}


def test_categorical_valid_graph_passes(onto):
    # produces requires Operation -> Event (per ontology signature)
    g = _cat_graph(
        [{"id": "op", "meta_type": "Operation"}, {"id": "ev", "meta_type": "Event"}],
        [{"id": "op::produces::ev", "source": "op", "target": "ev", "rel_type": "produces"}],
    )
    assert vo.validate_graph(onto, g) == []


def test_categorical_type_safety_violation_rejected(onto):
    # produces requires Operation -> Event; give it Event -> Operation
    g = _cat_graph(
        [{"id": "ev", "meta_type": "Event"}, {"id": "op", "meta_type": "Operation"}],
        [{"id": "ev::produces::op", "source": "ev", "target": "op", "rel_type": "produces"}],
    )
    errs = vo.validate_graph(onto, g)
    assert any("produces" in e and "P1" in e for e in errs)


def test_categorical_unknown_rel_type_rejected(onto):
    g = _cat_graph(
        [{"id": "a", "meta_type": "Entity"}, {"id": "b", "meta_type": "Operation"}],
        [{"id": "a::frobnicates::b", "source": "a", "target": "b", "rel_type": "frobnicates"}],
    )
    errs = vo.validate_graph(onto, g)
    assert any("frobnicates" in e for e in errs)
