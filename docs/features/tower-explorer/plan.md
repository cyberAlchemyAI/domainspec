---
tags: [feature, tower-explorer, plan, tooling, governance]
node_type: implementation-plan
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-22
derives-from: docs/features/tower-explorer/spec.md
---

# Implementation Plan — Tower Explorer

## Milestone ordering

Ordered by: T-1 (cheapest, no migration) → T-4 (highest leverage, Lean infra ready) → T-2 → T-3. Each milestone ships independently into the pipeline.

---

## M1 — T-1: Origin Certificate (Gate 0 bootstrap)

**Goal:** Every new cross-layer edge written to the vault carries a frontmatter field `origin_rung: N`. The Tower Explorer CLI exists and emits `MISSING_ORIGIN_CERT` diagnostics for edges without it.

**Why first:** Forward-only enforcement — no migration required on existing vault nodes. Closes the retroactive-edge-introduction hole immediately. Establishes the CLI scaffold all later milestones extend.

**Tasks:**

1. **Frontmatter extension** — add `origin_rung: int | null` to `vault_common.frontmatter.PromotionEdgeFrontmatter` (new subclass). Schema version stays at 1; new field is optional with a `null` default so existing nodes are not rejected.
2. **`tower_explorer/` Python package** — scaffold under `internal_tools/tower_explorer/`. Module: `cli.py`, `analyser.py`, `diagnostics.py`. Reuse `audit_richness.py`'s frontmatter parser; do not duplicate.
3. **`analyse_vault(vault_root)` operation** — walks vault nodes, collects all cross-layer edges (edges where `source.layer ≠ target.layer`), checks each for `origin_rung`. Emits `MISSING_ORIGIN_CERT` (severity: flag) per missing edge.
4. **CLI** — `tower-explorer <vault-root> [--json] [--fail-on-flag]`. Exit codes mirror guard.py: 0 = structural-pass, 1 = structural-flag with `--fail-on-flag`, 2 = structural-block.
5. **Tests** — unit tests in `tower_explorer/tests/test_analyser.py`. Fixtures: one vault node with `origin_rung` set, one without.

**Done when:** `tower-explorer vault/` runs on the full vault, emits diagnostics for missing certificates, exits 0 on full compliance.

---

## M2 — T-4: Obstruction Witness (highest-leverage output)

**Goal:** For every node flagged with an M6 residue by guard.py, the Tower Explorer renders a minimal refuting subgraph as a concrete artifact — a `witness.md` file in the node's directory.

**Why second:** The Lean infrastructure (`TowerAnchored.embedL1(n)`, `TowerAnchored.refutes_m6_strong(n)`) is entirely sorry-free. The gap is rendering. This converts guard.py's prose diagnosis ("this spec has an M6 cluster") into a concrete artifact ("here are the two concepts and the missing edge that create the ambiguity").

**Tasks:**

1. **`render_witness(m6_cluster)` operation** — takes an M6 cluster (two concepts with identical meta-type and edge pattern) from guard.py's `rawAudit`, formats a minimal subgraph as a Mermaid diagram + concept table. The subgraph is: the two colliding concepts + their shared typed edges + one annotated "missing disambiguation edge."
2. **`witness.md` writer** — emits `witness.md` alongside the spec's `spec.md`. Frontmatter: `node_type: audit`, `derives-from: <spec path>`, `m6_cluster: [ConceptA, ConceptB]`, `rung: N`.
3. **Pipeline integration** — Tower Explorer reads guard.py's `rawAudit.m6Clusters` as input; no re-parsing of the spec directory.
4. **Tests** — fixture: a spec with one M6 cluster (two concepts, same meta-type, same outgoing edges). Assert `witness.md` is created with correct Mermaid content.

**Done when:** `tower-explorer vault/ --render-witnesses` creates `witness.md` for every M6 cluster in the current vault, reviewed and accurate for at least one real spec.

---

## M3 — T-2: Reflects-Iso Report

**Goal:** For each promotion edge, report whether any two previously-distinct lower-layer nodes are collapsed (mapped to the same upper-layer node).

**Why third:** Requires richer frontmatter (the promotion edge must carry the source and target node IDs with their layer contexts) and a graph-traversal step that M1 and M2 do not require. Depends on M1's `origin_rung` certificate being in place.

**Tasks:**

1. **`PromotionEdge` frontmatter extension** — add `collapses: [source_id_1, source_id_2] | null`. Written by spec authors when they know a promotion is collapsing; checked by the tool when it isn't.
2. **`check_reflects_iso(promotion_edges)` operation** — for each promotion edge, checks whether any two lower-layer nodes sharing the same upper-layer target are genuinely distinct (different frontmatter `node_type`, `tags`, or body hash). Emits `REFLECTS_ISO_VIOLATION` (severity: flag) when distinct nodes collapse without an explicit `collapses:` declaration.
3. **Tests** — fixture: two lower-layer premise nodes both linking to the same upper-layer constitution node. Assert diagnostic fired; assert suppressed when `collapses:` is declared.

**Done when:** `tower-explorer vault/` emits `REFLECTS_ISO_VIOLATION` diagnostics for at least one real promotion-collapse in the current vault.

---

## M4 — T-3: K/Q Direction Tagging

**Goal:** Every traceability edge is tagged `direction: K` (anchor-in, residue → knowledge) or `direction: Q` (anchor-out, spec → artifact). Mixed K/Q chains are flagged.

**Why last:** Least urgent — the K/Q distinction is conceptually clear but requires auditing existing edges to assign directions, which is the highest-migration-cost step. The value is highest after T-1/T-4/T-2 are deployed and producing real signal.

**Tasks:**

1. **`AnchorDirection` field** — add `anchor_direction: K | Q | null` to traceability edge frontmatter. Optional; null = untagged (flag but not block).
2. **`tag_direction(edges)` operation** — heuristic assignment: edges pointing from a discovery/session toward a premise/constitution are `K`; edges from a premise/constitution toward an implementation/artifact are `Q`. Emits `MISSING_DIRECTION_TAG` (severity: flag) for untagged edges.
3. **Mixed-chain detection** — traverses multi-hop traceability chains; flags `MIXED_KQ_CHAIN` (severity: flag) when a chain alternates K and Q directions without a rung boundary between them.
4. **Tests** — fixture: three-node chain discovery → premise → artifact (K then Q, valid). Four-node chain with mid-chain direction reversal (flag).

**Done when:** `tower-explorer vault/` tags all existing traceability edges with directions and emits no false positives on the known-valid chains.

---

## Integration checkpoint (post-M4)

After all four milestones:

- **Gate 0 + Gate 1 are sequential:** `tower-explorer vault/ && categorical-tooling-guard <spec>` is the full CI pipeline entry.
- **`lean-code-validator` v2 handoff:** the `OriginCertificate` and `ReflectsIsoReport` annotations in frontmatter are the inputs v2 will verify against Lean's `P_faithful` and `P_reflectsIso` fields once the functor-level lifting (toward-categorical-spec-semantics.md step 1) is complete.
- **`TowerCrystallization.lean` dependency:** T-4's obstruction witness is currently a Mermaid diagram computed heuristically. Once `TowerCrystallization.lean` closes the crystallization lemma (the `embedL1(n)` → canonical-identification path), the witness can be replaced by a typed Lean proof artifact.
