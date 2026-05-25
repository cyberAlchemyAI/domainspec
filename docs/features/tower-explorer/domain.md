---
tags: [feature, tower-explorer, domain, concepts]
node_type: spec
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-22
derives-from: docs/features/tower-explorer/spec.md
---

# Domain — Tower Explorer

<!-- Concept definitions, invariants, tower-rung inference rules, K/Q direction semantics. -->

---

## Concepts

### TowerRung

An integer `n ≥ 0` assigned to each vault node, representing its depth in the promotion hierarchy.

**Inference rules (in priority order):**

| Condition | Assigned rung |
|---|---|
| `node_type: axiom` or `node_type: constitution` | 0 |
| `node_type: discovery` with no `derives-from` | 1 |
| `node_type: premise` | 2 |
| `node_type: spec` or `node_type: implementation-plan` | 3 |
| Any node with `derives-from: <path>` | `rung(referenced node) + 1` |
| Unresolvable | `null` — emits `MISSING_RUNG` diagnostic |

Rung is a derived property, not a stored field. The Tower Explorer computes it at analysis time from frontmatter `derives-from` chains.

**Invariant:** A cross-layer edge from node A to node B is a promotion edge iff `rung(B) = rung(A) + 1`. Edges skipping rungs (`rung(B) > rung(A) + 1`) are flagged as `RUNG_SKIP`.

---

### PromotionEdge

A directed edge between two vault nodes where `rung(target) = rung(source) + 1`. Carries two optional annotations:

- `origin_rung: int` — the rung at which this edge was first introduced (T-1 certificate). Required on new edges; null on pre-existing edges (flag, not block).
- `collapses: [node_id_1, node_id_2]` — explicit declaration that this promotion merges two previously-distinct source nodes. Required when the tool detects a reflects-iso violation (T-2); suppresses the diagnostic when present.

**Invariant:** `origin_rung` must equal `rung(source)` of the edge at the time it was introduced. If the source node was later re-ranked, the certificate's value is preserved as provenance.

---

### OriginCertificate (T-1)

The `origin_rung` field on a promotion edge. Its presence certifies that the edge was consciously introduced at a specific rung, not retroactively inserted at a lower layer.

**Retroactive introduction:** an edge is retroactively introduced when `origin_rung < rung(source)` at analysis time. This is the vault analogue of `no_new_morphisms_between_L` being violated — a new L-to-L path snuck through the carrier.

**Enforcement:** forward-only. Existing edges without `origin_rung` receive `MISSING_ORIGIN_CERT` (severity: flag). Future writes without it receive `MISSING_ORIGIN_CERT` (severity: block via pre-write hook).

---

### ReflectsIsoReport (T-2)

Per-promotion-edge report indicating whether the promotion collapses two previously-distinct lower-layer nodes.

**Collapse detection:** two lower-layer nodes A and B are "previously distinct" if they differ in any of: `node_type`, `tags` (set equality), or body content hash. If both A and B promote to the same upper-layer node C, and no `collapses:` declaration is present on the edge, the tool emits `REFLECTS_ISO_VIOLATION`.

**Suppression:** when `collapses: [A, B]` is declared on the promotion edge, the violation is suppressed and logged as an acknowledged collapse. Acknowledged collapses are listed in the structural verdict for human review.

**Invariant:** `collapses` declarations must be symmetric — if `collapses: [A, B]` appears on A→C, an equivalent `collapses: [A, B]` must appear on B→C or a single merged edge (A+B)→C must exist.

---

### AnchorDirection (T-3)

A tag (`K` or `Q`) on traceability edges classifying their categorical role:

- **K-direction** (incoming anchor, `K_v → v`): edge points from a residue/observation node toward a knowledge/structure node. Examples: discovery → premise, audit-finding → constitution, M6 witness → concept disambiguation.
- **Q-direction** (outgoing anchor, `v → Q_v`): edge points from a knowledge/structure node toward an artifact/implementation node. Examples: premise → spec, constitution → implementation, axiom → proof.

**Mixed-chain invariant:** a valid traceability chain alternates K then Q at each rung boundary. A chain that reverses direction (Q then K, or K-K without a rung boundary) indicates a conceptual loop and is flagged as `MIXED_KQ_CHAIN`.

**Default for unlabelled edges:** edges between nodes at the same rung are not traceability edges and are not tagged. Only cross-layer edges require a direction.

---

### ObstructionWitness (T-4)

A concrete artifact (a `witness.md` file) placed alongside a spec that has an M6 cluster. It contains:

1. A Mermaid subgraph of the two colliding concepts and their shared edge pattern.
2. A "missing disambiguation edge" annotation — the specific edge that would make the two concepts distinguishable.
3. The tower rung at which the obstruction was detected.

**Relationship to Lean:** `ObstructionWitness` is the tooling counterpart of `TowerAnchored.embedL1(n)` — a minimal refuting subgraph at a specific tower level. Once `TowerCrystallization.lean` closes the crystallization lemma, the witness can be replaced by a typed Lean proof artifact; until then it is a Mermaid diagram computed heuristically from the M6 cluster.

**Invariant:** every spec that receives a `STRUCTURAL_BLOCK` from guard.py's `M6_CLUSTER` diagnostic must have a corresponding `witness.md`. The Tower Explorer creates it; the spec author is responsible for resolving it.

---

### StructuralVerdict

The Gate 0 output of the Tower Explorer. One of:

| Verdict | Meaning | CI behaviour |
|---|---|---|
| `structural-pass` | All four checks pass; no unacknowledged violations | Proceed to Gate 1 (guard.py) |
| `structural-flag` | One or more non-blocking diagnostics | Proceed to Gate 1 with warning |
| `structural-block` | One or more blocking diagnostics | Block CI; do not run guard.py |

**Blocking diagnostics:** `RUNG_SKIP`, `REFLECTS_ISO_VIOLATION` (without `collapses` declaration), `MIXED_KQ_CHAIN`.

**Flagging diagnostics:** `MISSING_ORIGIN_CERT`, `MISSING_DIRECTION_TAG`, `MISSING_RUNG`.
