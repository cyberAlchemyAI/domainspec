#!/usr/bin/env python3
"""Validate the canonical DomainSpec code ontology — and concept graphs against it.

Stdlib only. Two jobs:

  1. SELF-CHECK (no args): load `code-ontology.json` (sibling) and verify its
     internal invariants — unique tokens, every edge endpoint references a real
     meta-type, declared counts match, and the five formal properties P1-P5 hold
     at the schema level (family partition, partition disjointness, cross-layer
     unidirectionality, cross-feature backend-to-backend).

  2. GRAPH CHECK (one arg): validate a concept graph against the ontology's edge
     signatures (Property P1, type safety). The graph file is JSON:
         {"nodes": [{"id": "...", "meta_type": "Entity"}, ...],
          "edges": [{"type": "performs", "source": "<id>", "target": "<id>"}, ...]}
     `meta_type` accepts either the canonical token ("ValueObject") or the
     display name ("Value Object") — both normalize to the token.

Usage:
    python3 validate_ontology.py                 # self-check the schema
    python3 validate_ontology.py <graph.json>    # check a concept graph (e.g. an L1.json)

Exit 0 = valid. Exit 1 = errors (printed).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ONTOLOGY = HERE / "code-ontology.json"

CROSS_LAYER_FAMILY = "R_X"
CROSS_FEATURE_FAMILY = "R_CF"
BACKEND_FAMILIES = {"R_B", "R_CF"}


def load() -> dict:
    return json.loads(ONTOLOGY.read_text(encoding="utf-8"))


def _index(onto: dict):
    """Return (token->meta_type, display_or_token->token) lookups."""
    by_token = {m["token"]: m for m in onto["meta_types"]}
    alias = {}
    for m in onto["meta_types"]:
        alias[m["token"]] = m["token"]
        alias[m["display_name"]] = m["token"]
    return by_token, alias


# ── job 1: schema self-check ────────────────────────────────────────────
def check_schema(onto: dict) -> list[str]:
    errors: list[str] = []
    metas = onto["meta_types"]
    edges = onto["edges"]
    families = onto["edge_families"]

    tokens = [m["token"] for m in metas]
    if len(tokens) != len(set(tokens)):
        dupes = sorted({t for t in tokens if tokens.count(t) > 1})
        errors.append(f"duplicate meta-type tokens: {dupes}")
    token_set = set(tokens)
    by_token = {m["token"]: m for m in metas}

    # declared counts
    if onto.get("meta_type_count") != len(metas):
        errors.append(f"meta_type_count {onto.get('meta_type_count')} != actual {len(metas)}")
    if onto.get("edge_count") != len(edges):
        errors.append(f"edge_count {onto.get('edge_count')} != actual {len(edges)}")

    # partitions are exactly backend|ui (P2: disjoint is automatic — one field per type)
    for m in metas:
        if m["partition"] not in ("backend", "ui"):
            errors.append(f"meta-type {m['token']}: partition must be backend|ui, got {m['partition']!r}")

    edge_tokens = [e["token"] for e in edges]
    if len(edge_tokens) != len(set(edge_tokens)):
        dupes = sorted({t for t in edge_tokens if edge_tokens.count(t) > 1})
        errors.append(f"duplicate edge tokens: {dupes}")

    for e in edges:
        et = e["token"]
        # P5: family is one of the declared four
        if e["family"] not in families:
            errors.append(f"edge {et}: family {e['family']!r} not in {sorted(families)}")
        # every endpoint references a real meta-type
        for role in ("source", "target"):
            for tok in e[role]:
                if tok not in token_set:
                    errors.append(f"edge {et}: {role} type {tok!r} is not a declared meta-type")
        # P3: cross-layer is UI -> backend
        if e["family"] == CROSS_LAYER_FAMILY:
            if any(by_token[t]["partition"] != "ui" for t in e["source"] if t in by_token):
                errors.append(f"edge {et} (R_X): every source must be a UI meta-type (P3)")
            if any(by_token[t]["partition"] != "backend" for t in e["target"] if t in by_token):
                errors.append(f"edge {et} (R_X): every target must be a backend meta-type (P3)")
        # P4: cross-feature is backend -> backend
        if e["family"] == CROSS_FEATURE_FAMILY:
            if any(by_token[t]["partition"] != "backend" for t in e["source"] + e["target"] if t in by_token):
                errors.append(f"edge {et} (R_CF): both endpoints must be backend meta-types (P4)")
        # R_B is backend -> backend too
        if e["family"] == "R_B":
            if any(by_token[t]["partition"] != "backend" for t in e["source"] + e["target"] if t in by_token):
                errors.append(f"edge {et} (R_B): both endpoints must be backend meta-types")
        # R_U is UI -> UI
        if e["family"] == "R_U":
            if any(by_token[t]["partition"] != "ui" for t in e["source"] + e["target"] if t in by_token):
                errors.append(f"edge {et} (R_U): both endpoints must be UI meta-types")
    return errors


# ── job 2: concept-graph type safety (Property P1) ──────────────────────
def _normalize_graph(graph: dict):
    """Return (nodes, edges) as the generic shape, accepting both formats.

    Real DomainSpec extraction (L1.json) emits:
        {"objects":   [{"id": "...", "meta_type": "Entity"}, ...],
         "morphisms":  [{"rel_type": "produces", "source": "<id>", "target": "<id>"}, ...]}
    where morphism source/target are object IDs. The generic/test shape is:
        {"nodes": [{"id", "meta_type"}], "edges": [{"type", "source", "target"}]}.
    Both collapse to (nodes, edges) with keys id/meta_type and type/source/target.
    """
    if "objects" in graph or "morphisms" in graph:
        nodes = [
            {"id": o.get("id"), "meta_type": o.get("meta_type")}
            for o in graph.get("objects", [])
        ]
        edges = [
            {"type": m.get("rel_type"), "source": m.get("source"), "target": m.get("target")}
            for m in graph.get("morphisms", [])
        ]
        return nodes, edges
    return graph.get("nodes", []), graph.get("edges", [])


def validate_graph(onto: dict, graph: dict) -> list[str]:
    errors: list[str] = []
    by_token, alias = _index(onto)
    edge_sig = {e["token"]: e for e in onto["edges"]}
    nodes, edges = _normalize_graph(graph)

    node_type: dict[str, str] = {}
    for n in nodes:
        nid = n.get("id")
        raw = n.get("meta_type")
        tok = alias.get(raw)
        if tok is None:
            errors.append(f"node {nid!r}: unknown meta_type {raw!r} (not a canonical token or display name)")
        else:
            node_type[nid] = tok

    for i, e in enumerate(edges):
        et = e.get("type")
        sig = edge_sig.get(et)
        if sig is None:
            errors.append(f"edge[{i}] {et!r}: not a canonical edge type")
            continue
        s, t = e.get("source"), e.get("target")
        st, tt = node_type.get(s), node_type.get(t)
        if st is None:
            errors.append(f"edge[{i}] {et}: source node {s!r} not found / untyped")
        elif st not in sig["source"]:
            errors.append(f"edge[{i}] {et}: source {s!r} is {st}, signature requires one of {sig['source']} (P1)")
        if tt is None:
            errors.append(f"edge[{i}] {et}: target node {t!r} not found / untyped")
        elif tt not in sig["target"]:
            errors.append(f"edge[{i}] {et}: target {t!r} is {tt}, signature requires one of {sig['target']} (P1)")
    return errors


def main(argv: list[str]) -> int:
    onto = load()
    schema_errs = check_schema(onto)
    if schema_errs:
        print("✗ code-ontology.json failed self-check:")
        for e in schema_errs:
            print(f"    - {e}")
        return 1
    print(f"✓ code-ontology.json self-check passed "
          f"({onto['meta_type_count']} meta-types, {onto['edge_count']} edges, "
          f"{len(onto['edge_families'])} families)")

    if len(argv) > 1:
        path = Path(argv[1])
        try:
            graph = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as ex:
            print(f"✗ cannot read graph {path}: {ex}")
            return 1
        errs = validate_graph(onto, graph)
        if errs:
            print(f"✗ {path}: {len(errs)} type-safety violation(s):")
            for e in errs:
                print(f"    - {e}")
            return 1
        print(f"✓ {path}: concept graph is type-safe against the ontology")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
