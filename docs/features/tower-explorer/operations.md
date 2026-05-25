---
tags: [feature, tower-explorer, operations]
node_type: spec
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-22
derives-from: docs/features/tower-explorer/spec.md
---

# Operations — Tower Explorer

<!-- Each operation: inputs, outputs, invariants, error conditions. -->

---

## `analyse_vault`

**Type:** Orchestrator — calls all four check operations in sequence and aggregates into a `StructuralVerdict`.

**Inputs:**
- `vault_root: Path` — root directory of the vault
- `policy: TowerPolicy` — optional config (thresholds, severity overrides, which checks to enable)

**Outputs:**
- `verdict: StructuralVerdict` — `structural-pass / structural-flag / structural-block`
- `diagnostics: List[Diagnostic]` — coded items from all four checks
- `rung_map: Dict[node_id, int | None]` — computed rung for every node
- `summary: AnalysisSummary` — counts: `nodes`, `promotionEdges`, `missingCerts`, `reflectsIsoViolations`, `missingDirections`, `mixedChains`, `obstructionWitnessesRendered`

**Behaviour:**
1. Walk vault: collect all nodes with valid frontmatter.
2. Compute `rung_map` via `infer_rung` for each node.
3. Collect all promotion edges (cross-layer, `rung(target) = rung(source) + 1`).
4. Run `certify_origin`, `check_reflects_iso`, `tag_direction`, `render_witness` in order.
5. Aggregate diagnostics; determine verdict from severity table in [domain.md](domain.md).

**Error conditions:**
- `PARSER_BLIND` — zero vault nodes with parseable frontmatter; abort with `structural-block`.
- Circular `derives-from` chain — detected during `infer_rung`; emit `CIRCULAR_DERIVATION` (block) for all nodes in the cycle.

---

## `infer_rung`

**Type:** Pure computation — no I/O.

**Inputs:**
- `node: VaultNode` — a parsed vault node with frontmatter
- `rung_map: Dict[node_id, int | None]` — partial map built so far (mutable, updated in-place)

**Outputs:**
- `int | None` — computed rung; `None` if unresolvable

**Behaviour:** follows the inference rules in [domain.md §TowerRung](domain.md). Memoises into `rung_map`. Detects cycles by marking nodes as `IN_PROGRESS` before recursing; if a node is encountered `IN_PROGRESS`, its rung is `None` and `CIRCULAR_DERIVATION` is emitted.

---

## `certify_origin` (T-1)

**Inputs:**
- `promotion_edges: List[PromotionEdge]`
- `rung_map: Dict[node_id, int | None]`

**Outputs:**
- `List[Diagnostic]` — one `MISSING_ORIGIN_CERT` per edge lacking `origin_rung`

**Behaviour:** for each promotion edge, check that `origin_rung` is present in frontmatter. If absent, emit `MISSING_ORIGIN_CERT` with severity `flag`. If present but `origin_rung > rung(source)`, emit `RETROACTIVE_ORIGIN` (flag) — the certificate claims the edge was introduced at a higher rung than the current source node occupies.

**Invariant:** does not write to disk. Certificate authoring is the spec author's responsibility; this operation only reads and validates.

---

## `check_reflects_iso` (T-2)

**Inputs:**
- `promotion_edges: List[PromotionEdge]`
- `nodes: Dict[node_id, VaultNode]`

**Outputs:**
- `List[Diagnostic]` — one `REFLECTS_ISO_VIOLATION` per uncollapsed collapse, one `ACKNOWLEDGED_COLLAPSE` log per declared collapse

**Behaviour:**
1. Group promotion edges by `target` node.
2. For each target with two or more source nodes: compute distinctness of each source pair (compare `node_type`, `tags`, body hash).
3. For each distinct source pair (A, B) mapping to the same target C: check for `collapses: [A, B]` on either A→C or B→C.
4. If absent: emit `REFLECTS_ISO_VIOLATION` (severity: block).
5. If present: log `ACKNOWLEDGED_COLLAPSE` (info).

**Note:** body hash is a SHA-256 of the node's markdown body (excluding frontmatter). Two nodes with identical body but different `node_type` are still distinct.

---

## `tag_direction` (T-3)

**Inputs:**
- `promotion_edges: List[PromotionEdge]`
- `rung_map: Dict[node_id, int | None]`

**Outputs:**
- `List[Diagnostic]` — `MISSING_DIRECTION_TAG` per untagged edge, `MIXED_KQ_CHAIN` per invalid chain

**Behaviour:**
1. For each promotion edge without `anchor_direction`: emit `MISSING_DIRECTION_TAG` (flag).
2. For each traceability chain (multi-hop path of promotion edges): validate direction sequence.
   - Valid: K* then Q* (zero or more K-edges followed by zero or more Q-edges, with rung boundaries).
   - Invalid: any Q-to-K reversal within the same rung boundary emits `MIXED_KQ_CHAIN` (block).
3. Heuristic default (when `anchor_direction` is absent and `--auto-tag` is passed): assign `K` to edges pointing source→target where `node_type(source) ∈ {discovery, session, audit}`, else `Q`. Written to frontmatter as a suggestion, not a commit.

---

## `render_witness` (T-4)

**Inputs:**
- `m6_clusters: List[M6Cluster]` — from guard.py's `rawAudit.m6Clusters`
- `nodes: Dict[node_id, VaultNode]`
- `rung_map: Dict[node_id, int | None]`
- `output_dir: Path` — where to write `witness.md` files

**Outputs:**
- `List[Path]` — paths of written `witness.md` files
- `List[Diagnostic]` — `WITNESS_RENDERED` (info) per file written

**Behaviour:**
1. For each M6 cluster (pair of concepts with identical meta-type and edge pattern):
   a. Identify the two colliding concept nodes (A, B).
   b. Collect their shared outgoing typed edges.
   c. Determine the "missing disambiguation edge" — the edge type present on one but not the other, or a new edge type that would make them distinct.
   d. Render a Mermaid subgraph: A and B as nodes, shared edges, missing edge annotated with `[missing]`.
   e. Write `witness.md` alongside the spec's directory.
2. If a `witness.md` already exists for the cluster, overwrite iff the cluster content has changed (compare hashes); otherwise skip.

**`witness.md` frontmatter:**

```yaml
---
node_type: audit
derives-from: <spec path>
m6_cluster: [ConceptA, ConceptB]
rung: <int>
last_updated: <date>
---
```

**Invariant:** `render_witness` requires guard.py's `rawAudit` as input — it does not re-parse the spec directory. The Tower Explorer calls guard.py as a library (`from categorical_tooling_guard import run_guard`) when `--render-witnesses` is passed.
