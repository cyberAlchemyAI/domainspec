"""Tests for vault_common.frontmatter.

Covers OQ-A (17 NodeType values) and OQ-B (hard reject on unknown node_type).
"""

from __future__ import annotations

import pytest

from vault_common.frontmatter import (
    KNOWN_NODE_TYPES,
    SpecFrontmatter,
    UnknownNodeTypeError,
    _FRONTMATTER_BY_TYPE,
    validate_node,
)


# --- OQ-A: enum covers all conventions values -------------------------------

EXPECTED_NODE_TYPES = {
    "axiom", "premise", "constitution", "discovery", "implementation-plan",
    "spec", "audit", "conceptual", "test", "backlog", "readme", "research",
    "domainspec-subagents-strategy", "subagents-research",
    "subagents-findings", "discussion", "experiment",
}


def test_known_node_types_covers_all_conventions_values() -> None:
    assert KNOWN_NODE_TYPES == EXPECTED_NODE_TYPES
    assert len(KNOWN_NODE_TYPES) == 17


def test_dispatch_table_covers_all_node_types() -> None:
    assert set(_FRONTMATTER_BY_TYPE.keys()) == EXPECTED_NODE_TYPES


# --- OQ-A: spec dispatches to SpecFrontmatter, not base ---------------------


def _minimal_fm(node_type: str) -> dict:
    return {
        "node_type": node_type,
        "layer": "architecture",
        "nature": "reference",
        "status": "draft",
    }


def test_node_type_spec_dispatches_to_spec_subclass() -> None:
    model = validate_node(_minimal_fm("spec"))
    assert isinstance(model, SpecFrontmatter)
    assert model.node_type == "spec"


@pytest.mark.parametrize("nt", sorted(EXPECTED_NODE_TYPES))
def test_every_canonical_node_type_dispatches_to_its_subclass(nt: str) -> None:
    model = validate_node(_minimal_fm(nt))
    expected_cls = _FRONTMATTER_BY_TYPE[nt]
    assert isinstance(model, expected_cls), (
        f"node_type={nt!r} dispatched to {type(model).__name__}, "
        f"expected {expected_cls.__name__}"
    )


# --- OQ-B: hard reject on unknown / missing node_type -----------------------


def test_unknown_node_type_hard_rejects() -> None:
    fm = _minimal_fm("not-a-real-type")
    with pytest.raises(UnknownNodeTypeError) as ei:
        validate_node(fm)
    assert "not-a-real-type" in str(ei.value)


def test_unknown_node_type_includes_source_path_in_message() -> None:
    fm = _minimal_fm("not-a-real-type")
    with pytest.raises(UnknownNodeTypeError) as ei:
        validate_node(fm, source_path="/x/y/z.md")
    assert "/x/y/z.md" in str(ei.value)


def test_missing_node_type_hard_rejects() -> None:
    fm = {
        "layer": "architecture",
        "nature": "reference",
        "status": "draft",
    }
    with pytest.raises(UnknownNodeTypeError):
        validate_node(fm)


# --- Session route still works, and still requires a known node_type --------


def test_session_with_known_node_type_validates() -> None:
    fm = {
        "node_type": "conceptual",
        "is_session": True,
        "layer": "architecture",
        "nature": "explanatory",
        "status": "draft",
    }
    model = validate_node(fm)
    assert model.is_session is True


def test_session_with_unknown_node_type_hard_rejects() -> None:
    fm = {
        "node_type": "not-a-real-type",
        "is_session": True,
        "layer": "architecture",
        "nature": "explanatory",
        "status": "draft",
    }
    with pytest.raises(UnknownNodeTypeError):
        validate_node(fm)
