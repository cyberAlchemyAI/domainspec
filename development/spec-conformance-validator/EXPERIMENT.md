---
node_type: experiment
title: Spec Conformance Validator — taxonomy + relationships
status: defined
created: 2026-06-21
owner: invoke (define)
feature: spec-conformance-validator
authored_by: invoke
mode: define
---

# Experiment — Spec Conformance Validator (taxonomy + relationships)

> **Invoke mode:** define. **Deliverable:** a pre-registered experiment that answers _"should we add a validator that verifies LLM-generated specs use the right meta-types and typed edges?"_ — by measuring whether LLM specs actually violate [TAXONOMY](../../../../arcanum/definitions/TAXONOMY.md) (25 meta-types) and [RELATIONSHIPS](../../../../arcanum/definitions/RELATIONSHIPS.md) (29 typed edges), and whether a deterministic validator catches those violations soundly. Normative authority: DS-D1 (meta-type system), DS-D2/D7/D8 (edge families + signatures).

## 1. Question & hypotheses

**Operator question:** should we add a validator for verifying the LLM generates specs with the right types and edges, respecting TAXONOMY + RELATIONSHIPS?

- **H1 (value):** LLM-generated DomainSpec specs contain conformance violations — across ≥1 of the 4 levels below — at a non-trivial rate, so a validator catches real defects.
- **H1b (soundness):** a deterministic validator built on the engine grammar flags a violation **iff** one exists by the normative rules — i.e. 100% recall on seeded violations and **0 false violations** on known-good specs.
- **H0 (null):** LLM specs are already conformant (real violation rate ≈ 0 across a diverse corpus) **or** the validator cannot distinguish valid from invalid → no value / not sound.

**Why it matters (links to the engine's headline property):** the test-derivation engine derives obligations from _typed_ nodes/edges. If the LLM mislabels a type or invents an edge, derivation silently produces wrong obligations — garbage-in. A conformance validator is the **upstream gate** that makes the [spec-formalization metric](../../docs/features/test-derivation-engine/SPEC.md) trustworthy: it guarantees the graph δ runs on is well-typed before any test is derived.

## 2. The validator under test (engine `validate` capability)

Placement (operator-confirmed): a new **`validate`** capability + CLI command in [`tools/test-derivation-engine/`](../../tools/test-derivation-engine/), reusing the grammar's typed `G` (`NodeType`/`EdgeType` already assigned). Four checks (operator-confirmed scope — all four):

| #      | Check                                 | Rule                                                                                                                                                                                                                                               | Source of truth                          |
| ------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **V1** | **Node meta-type validity**           | every concept maps to exactly one of the 25 meta-types; flag invented/ambiguous types and mislabels (Rule-vs-Policy, Operation-vs-Query)                                                                                                           | TAXONOMY / DS-D1                         |
| **V2** | **Edge type validity**                | every edge label ∈ the 29 typed edges; flag invented labels (`uses`, `calls`)                                                                                                                                                                      | RELATIONSHIPS / DS-D2                    |
| **V3** | **Edge endpoint signature**           | each edge's `(fromType, toType)` matches its signature — e.g. `enforces`=Rule→Operation, `contains`=Entity→ValueObject, `transitions`=Event→StateMachine, `produces`=Operation→Event                                                               | RELATIONSHIPS From→To / DS-D7/D8         |
| **V4** | **Cross-layer / cross-feature rules** | UI↔backend edges (`fetches`→Query, `mutates`→Operation, `contracts`→Interface, `mirrors`→Rule) and cross-_ edges (`produces-for`, `triggers-cross`, `enforces-cross`) respect layer + ownership; same-feature edges must not use a cross-_ variant | RELATIONSHIPS cross-layer/feature tables |

Output contract: a deterministic, byte-stable violation list (id, level, location, expected-vs-found), **fail-closed** on the write path, in the engine's existing `lint`/`check` family. Sound + honest: never fabricates a violation; reports "untypeable concept" rather than guessing.

## 3. Build prerequisites (pre-registered — these gate the experiment)

The engine today **infers** `NodeType` from doc _structure_ (states.md→Entity/Transition, …) and does **not** parse `registry.md`, where edges are explicitly declared (`| From | Edge | To |`). Therefore the validator needs:

- **P1 — `registry.md` parser:** read the Concept Graph table → typed edges with endpoint IDs (like the L3 `domain.md`/`rules.md` additions). Without it, V2–V4 have no edges to check.
- **P2 — explicit-type resolution:** map each registry concept ID (`{feature}.{Concept}`, `ui.{feature}.{Concept}`) to its declared meta-type (from `domain.md`/section headers) so V1 + V3 can compare `fromType/toType` to the signature.
- **P3 — signature table:** encode the 29 edge signatures (From→To meta-types) + cross-\* / layer rules as data, derived from RELATIONSHIPS/DS-D7/D8.

These are the validator's L0; the experiment runs once P1–P3 exist.

## 4. Method (pre-registered — frozen before any run)

**Corpus (two arms):**

- **Arm A — real LLM specs (committed):** existing LLM-authored features with a `registry.md` — e.g. `agent-execution-orchestrator`, `knowledge-graph-visualization`, `goldenquill-promotion-governance` (+ any others with a concept graph). Measures the _in-the-wild_ violation rate. ⚠ caveat: these were human-reviewed → likely an **under**estimate.
- **Arm B — fresh raw LLM specs (held-out):** run the live `domainspec-generate-tests` / spec authoring on 1–2 held-out features with **no human edit**, validate the raw output. Measures the _unreviewed_ rate (the honest number).

**Negative controls (the soundness gate):** take a known-good spec and inject one seeded violation of **each** of V1–V4 (e.g. retype a Rule as `Manager`; relabel an edge `uses`; reverse `enforces` to Operation→Rule; point `fetches` at an Operation). The validator MUST catch every seeded violation and MUST NOT flag the un-injected baseline.

**Measures:**

- `seeded_recall` = caught seeded violations / total seeded (per level).
- `false_violation_rate` = violations reported on hand-verified-good specs.
- `real_violation_rate` = genuine violations per spec on Arms A & B, by level.

## 5. Decision criterion (frozen — pre-registration)

**Add the validator to the pipeline (gate specs before δ) iff:**

1. **Sound + complete on controls:** `seeded_recall = 100%` for all four levels **AND** `false_violation_rate = 0`. _(If this fails, the validator is broken — fix before any value claim.)_
2. **Problem is real:** Arm A **or** Arm B shows `real_violation_rate > 0` on ≥1 level across the corpus.

**Outcomes:**

- (1)✓ **and** (2)✓ → **build + gate** (validator becomes a pre-δ conformance gate; wire into the engine-first pipeline).
- (1)✓ **and** (2)✗ (controls pass, but real specs are already clean) → validator is sound but low-value → **ship as opt-in `lint` only**, do not gate. _(Honest: "no defects found" is a real, publishable result.)_
- (1)✗ → **do not ship**; the validator can't be trusted. Report and iterate.

## 6. Validity threats (and mitigations)

- **"What is valid?" oracle problem:** ground truth = the **normative DS-D7/D8 signatures**, not human taste → the check is deterministic, not subjective. (This is the same move that makes the engine sound.)
- **Corpus review bias (Arm A):** committed specs are human-reviewed → under-counts raw LLM errors. Mitigated by **Arm B** (raw, unreviewed).
- **Inference gap:** the engine infers types from structure; a spec that is _structurally_ fine but _semantically_ mislabeled (Rule that should be Policy) may pass V1 unless the registry's declared type disagrees with the inferred one. Pre-registered scope: V1 catches (a) untypeable concepts and (b) declared-vs-inferred type **disagreement**; pure semantic mislabel with no structural signal is **out of scope** (honest needs-formal-style gap).
- **Small corpus / underpowered:** report n; treat Arm A as a floor, not a rate estimate, until ≥5 features.

## 7. Glossary (define-mode candidate terms)

- **Conformance violation** — a node/edge that breaks a normative DS rule (V1–V4). Distinct from a `needs_formal` derivation gap: a violation is _wrong_, a gap is _unwritten_.
- **Endpoint signature** — the `(fromType → toType)` meta-type pair an edge label requires (RELATIONSHIPS From→To / DS-D7/D8).
- **Declared vs inferred type** — declared = the meta-type the author states (registry/domain); inferred = the type the engine grammar assigns from doc structure. V1 flags disagreement.
- **Conformance gate** — running `validate` as a fail-closed pre-condition of `derive`, so δ only ever sees a well-typed graph.

## 8. Cross-references & next route

- Engine: [`tools/test-derivation-engine/`](../../tools/test-derivation-engine/) (`grammar/`, `lint`, `check` — the family `validate` joins).
- Definitions: [TAXONOMY](../../../../arcanum/definitions/TAXONOMY.md), [RELATIONSHIPS](../../../../arcanum/definitions/RELATIONSHIPS.md), DS-D1/D2/D7/D8.
- **Recommended next route:** `invoke design` → the `validate` capability design (P1–P3 + the four checks + output contract) → `invoke plan` work-pack → `task-session`. The experiment runs after P1–P3 land; the decision criterion (§5) is frozen now.

## Dispatch technique trace (invoke define)

- `frame_handoff` — the experiment frames the design/plan handoff (P1–P3 + V1–V4) without authoring them (owner boundary: design owns the capability spec).
- `owner_boundary_check` — validator placement is the engine; normative authority stays in arcanum DS-D\* (read-only substrate, not redefined here).
- `concrete_path_evidence` — every check cites its normative source row; corpus features named.
- `residue_ledger` — the inference-gap (semantic mislabel out of scope) is recorded as a known boundary, not hidden.
- Skipped: full dispatch JSON (single-capability author, no subagent fan-out) — not needed at define.
