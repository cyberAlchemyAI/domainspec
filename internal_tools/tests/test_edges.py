"""Tests for vault_common.edges.

Covers OQ-E (## Connections body parser) and OQ-G (forward_only_reason
carve-out marking on Edge).
"""

from __future__ import annotations

from pathlib import Path

from vault_common.edges import Edge, extract_edges
from vault_common.walker import VaultDoc, parse_doc


def _doc(path: str, body: str, frontmatter: dict | None = None) -> VaultDoc:
    text = body
    return VaultDoc(
        path=Path(path),
        text=text,
        content_hash="0" * 64,
        frontmatter=frontmatter,
        body=body,
    )


# --- T3 / OQ-E: ## Connections body parser ----------------------------------


def test_extracts_simple_connections_table() -> None:
    body = """\
# Heading

Some prose.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `other.md` | `derives-from` | because reasons |
| `third.md` | `cites` | another |
"""
    doc = _doc("/vault/foo/bar.md", body, frontmatter={"node_type": "discovery"})
    edges = extract_edges(doc)
    triples = {(e.src, e.dst, e.edge_type) for e in edges}
    assert ("/vault/foo/bar.md", "/vault/foo/other.md", "derives-from") in triples
    assert ("/vault/foo/bar.md", "/vault/foo/third.md", "cites") in triples


def test_extracts_numbered_connections_heading() -> None:
    # Real-world: vault/discovery/two-layer-platform-architecture/discovery.md
    # uses "## 8. Connections".
    body = """\
## 8. Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/ontology-conventions.md` | `cites` | the kernel |
"""
    doc = _doc("/vault/discovery/x/discovery.md", body, frontmatter={})
    edges = extract_edges(doc)
    assert any(
        e.edge_type == "cites" and e.dst == "vault/ontology-conventions.md"
        for e in edges
    )


def test_repo_relative_vault_paths_are_preserved() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/ontology-conventions.md` | `cites` | x |
"""
    doc = _doc("/repo/vault/discovery/x/y.md", body)
    edges = extract_edges(doc)
    assert any(e.dst == "vault/ontology-conventions.md" for e in edges)


def test_markdown_link_target_is_resolved() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| [scope-and-domain-axes.md](scope-and-domain-axes.md) | `derives-from` | x |
"""
    doc = _doc("/vault/discovery/x/y.md", body)
    edges = extract_edges(doc)
    assert any(
        e.dst == "/vault/discovery/x/scope-and-domain-axes.md"
        and e.edge_type == "derives-from"
        for e in edges
    )


def test_body_edges_are_additive_to_frontmatter_edges() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `body-target.md` | `cites` | body |
"""
    fm = {"node_type": "discovery", "cites": ["fm-target.md"]}
    doc = _doc("/vault/x/d.md", body, frontmatter=fm)
    edges = extract_edges(doc)
    targets = {e.dst for e in edges if e.edge_type == "cites"}
    assert "fm-target.md" in targets
    assert "/vault/x/body-target.md" in targets


def test_no_connections_heading_returns_only_frontmatter_edges() -> None:
    body = "no connections heading here"
    fm = {"node_type": "discovery", "cites": ["solo.md"]}
    doc = _doc("/vault/x/d.md", body, frontmatter=fm)
    edges = extract_edges(doc)
    assert len(edges) == 1
    assert edges[0].dst == "solo.md"


def test_extracts_real_two_layer_platform_discovery() -> None:
    # Verification per the user-task: the two-layer-platform discovery body
    # carries multiple ## Connections rows. The new extractor must surface
    # them; the old (frontmatter-only) extractor returned zero.
    path = Path(
        "/Users/victorboscaro/domainspec/vault/discovery/"
        "two-layer-platform-architecture/discovery.md"
    )
    doc = parse_doc(path)
    assert doc is not None
    edges = extract_edges(doc)
    edge_types = {e.edge_type for e in edges}
    # The file declares derives-from (multiple) and cites (multiple) in
    # the ## 8. Connections table.
    assert "derives-from" in edge_types
    assert "cites" in edge_types
    # Spot-check a known target.
    assert any(
        e.dst == "vault/ontology-conventions.md" and e.edge_type == "cites"
        for e in edges
    )


# --- T4 / OQ-G: forward_only_reason marking ---------------------------------


def test_skill_target_marks_skill_carveout() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/foo.md` | `cites` | x |
"""
    doc = _doc("/vault/x/d.md", body)
    edges = extract_edges(doc)
    [e] = [e for e in edges if e.edge_type == "cites"]
    assert e.forward_only_reason == "skill-target-carveout"


def test_agent_target_marks_agent_carveout() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/agents/bar.md` | `cites` | x |
"""
    doc = _doc("/vault/x/d.md", body)
    edges = extract_edges(doc)
    [e] = [e for e in edges if e.edge_type == "cites"]
    assert e.forward_only_reason == "agent-target-carveout"


def test_session_source_marks_session_carveout() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `other.md` | `creates` | x |
"""
    doc = _doc(
        "/vault/sessions/2026-05-18-foo.md",
        body,
        frontmatter={"node_type": "discovery", "is_session": True},
    )
    edges = extract_edges(doc)
    [e] = [e for e in edges if e.edge_type == "creates"]
    assert e.forward_only_reason == "session-source-carveout"


def test_vault_to_vault_edge_has_no_carveout() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `other.md` | `cites` | x |
"""
    doc = _doc("/vault/x/d.md", body, frontmatter={"node_type": "discovery"})
    edges = extract_edges(doc)
    [e] = [e for e in edges if e.edge_type == "cites"]
    assert e.forward_only_reason is None


def test_skill_target_takes_precedence_over_session_source() -> None:
    body = """\
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/foo.md` | `cites` | x |
"""
    doc = _doc(
        "/vault/sessions/x.md",
        body,
        frontmatter={"node_type": "discovery", "is_session": True},
    )
    edges = extract_edges(doc)
    [e] = [e for e in edges if e.edge_type == "cites"]
    assert e.forward_only_reason == "skill-target-carveout"


def test_frontmatter_edge_to_skill_target_is_marked() -> None:
    # The carve-out classifier must apply to frontmatter-declared edges too.
    fm = {"node_type": "discovery", "cites": [".claude/skills/foo.md"]}
    doc = _doc("/vault/x/d.md", "", frontmatter=fm)
    edges = extract_edges(doc)
    [e] = [e for e in edges if e.edge_type == "cites"]
    assert e.forward_only_reason == "skill-target-carveout"


def test_edge_dataclass_default_forward_only_reason_is_none() -> None:
    e = Edge(src="a.md", dst="b.md", edge_type="cites")
    assert e.forward_only_reason is None
