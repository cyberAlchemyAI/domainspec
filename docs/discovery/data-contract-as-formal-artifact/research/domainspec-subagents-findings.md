---
tags: [subagents, dispatch-artifact, subagents-findings]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-18
dispatch_slug: 2026-05-18-data-contract-formal-artifact-01
spec_file: vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml
spec_hash: 1ac5bc0c3ae56829c773d730bf2ad450d90eb435bbdbc69d93bc63eb54e632ea
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `2026-05-18-data-contract-formal-artifact-01`

> Preamble (Context + Goal, R23) followed by Dispatch record → Findings → Analysis (R16). Every load-bearing claim in Findings and Analysis cites a passage in [`domainspec-subagents-research.md`](./domainspec-subagents-research.md) per R17.

---

## Context

User asked whether data-contract should become a formal DomainSpec artifact. DomainSpec already encodes data-contract-like info in SPEC concept tables, aspects, observability/OTel specs, and infra. Open question: is a dedicated artifact justified, and should it be derived, governed, or tag-based.

## Goal

Produce a discovery-ready proposal for how (and whether) data-contract becomes a formal DomainSpec artifact, with implementation sketch.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Spec file:** `vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml` (spec_hash `1ac5bc0c3ae56829c773d730bf2ad450d90eb435bbdbc69d93bc63eb54e632ea`).

**Telemetry:** emitted to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` at 2026-05-18T00:00:00Z; event `subagent-strategy.dispatched`; corpus_hash `7e4b339b65ca7dfa6055b893c40189c2dcad7b92c46120842285f5798c471438`; status: emitted.

**Mode:** task-fan-out (heuristic_row: triangulation) *(R19)*

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `L1-A1` | strategist-selected | Repo audit of explicit data-contract surfaces; enumeration + fidelity assessment | unbounded | Inventory + fidelity-assessment table |
| `L1-A2` | strategist-selected | Repo audit of implicit contract seams; drift-risk classification | unbounded | 8-seam structured report with risk levels |
| `L1-A3` | strategist-selected | Literature survey of data-contract movement; multi-source synthesis | unbounded | 5 per-source summaries + comparison table + convergent/divergent ideas |
| `L1-A4` | strategist-selected | Literature on schema vs contract distinction; format-by-format breakdown | unbounded | Per-format summaries + line-definition + coverage table + composition rules |
| `L2-E1` | strategist-selected | Constructive evaluator across three alternatives (a/b/c) | unbounded | Comparison table + per-alternative analysis + recommendation |
| `L2-E2` | strategist-selected | Adversarial steelman against formalization | unbounded | 7-angle verdict + failure-mode table |

**Sequencing:** DAG — L1 set (A1, A2, A3, A4) ran in parallel; L2 set (E1, E2) ran in parallel after L1 returns; L3-synthesize (parent) consumed both layers.

**Recursion budget actually used:** depth = 3, breadth = 4 (L1) / 2 (L2), total agents = 6 *(defaults per R13: depth 2, breadth 5, total 10; depth override to 3 recorded here)*

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `L1-A1` | n/a | n/a | n/a (collected; not itemized in briefing) |
| `L1-A2` | n/a | n/a | n/a |
| `L1-A3` | n/a | n/a | n/a |
| `L1-A4` | n/a | n/a | n/a |
| `L2-E1` | n/a | n/a | n/a |
| `L2-E2` | n/a | n/a | n/a |
| **Sum**  | n/a | n/a | n/a (telemetry emitted; per-agent token counts not surfaced to writer) |

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.9` (judgment) | Both repo-side (A1/A2) and literature-side (A3/A4) of the goal hit; constructive + adversarial evaluators (E1/E2) produce a discovery-ready proposal with implementation sketch. |
| Independence     | `0.85` (judgment) | A1 vs A2 split explicit vs implicit surfaces cleanly; A3 vs A4 split movement vs schema-line cleanly; E1 vs E2 are constructive/adversarial mirror — minor overlap on seam-cost reasoning. |
| Fidelity         | `0.95` (judgment) | Every Findings/Analysis claim below maps to a single named agent section in research.md; no synthesized claims smuggled in. |
| Cost discipline  | `n/a`            | declared budget vs actual: `unbounded / not-itemized` — telemetry emitted but per-agent token counts not propagated to writer; mechanical score deferred. |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in [`domainspec-subagents-research.md`](./domainspec-subagents-research.md) per R17.

### F1 — DomainSpec already encodes most data-contract semantic content; what's missing is governance metadata

- **Claim:** DomainSpec covers schema shape, semantics, ownership-at-feature-grain, SLOs, and consumer registries; the genuine gaps are versioning, breaking-change policy, per-field ownership, per-consumer SLA, and retention.
- **Evidence:** [research §Agent 1 — L1-A1](./domainspec-subagents-research.md#agent-1--l1-a1-repo-audit-explicit-data-contract-surfaces)
- **Implication:** The problem statement is mis-shaped as "missing artifact"; it is actually "six existing surfaces under-populated on governance columns."

### F2 — HIGH-risk drift seams are event payloads and L₁→L₂ mapping; MEDIUM-HIGH is OTel attributes

- **Claim:** Seam 1 (event payload schema), Seam 5 (cross-feature event triggering), and Seam 8 (concept-table → code mapping) are HIGH risk; Seam 2 (OTel attributes) is MEDIUM-HIGH; all are closable by CI lints, not necessarily by a new artifact.
- **Evidence:** [research §Agent 2 — L1-A2](./domainspec-subagents-research.md#agent-2--l1-a2-repo-audit-implicit-contract-seams)
- **Implication:** Investment should target validators on existing surfaces before any new artifact type is introduced.

### F3 — Literature converges on seven load-bearing ideas about what a data contract is

- **Claim:** Producer owns; schema is necessary but insufficient; ownership is structural not optional; SLAs/quality are part of the contract; design-time artifact with runtime consequences; explicit versioning; machine-readable single source of truth.
- **Evidence:** [research §Agent 3 — L1-A3](./domainspec-subagents-research.md#agent-3--l1-a3-literature-data-contracts-movement)
- **Implication:** Any DomainSpec move must respect these seven; the divergences (enforcement locus, scope width, embed-vs-reference) become DomainSpec's open choices.

### F4 — Schema vs contract: schema is parser-validatable syntactic structure; contract is the governance wrapper

- **Claim:** A schema answers "is this byte-string valid?"; a contract answers "can I build a business on this?" — the wrapper adds ownership, SLA, semantics, compat policy, consumer registry, PII, transport binding. DomainSpec today sits at "JSON-Schema-plus-semantics" — strong on meaning, weak on operational governance.
- **Evidence:** [research §Agent 4 — L1-A4](./domainspec-subagents-research.md#agent-4--l1-a4-literature-schema-vs-contract-distinction)
- **Implication:** DomainSpec's distinctive contribution is the semantic axis; if it adds contracts, it should compose with — not duplicate — external schema formats.

### F5 — "Reference, don't embed" is the composition rule that prevents duplication

- **Claim:** Schemas live next to the producer; the governance wrapper lives in DomainSpec; one contract binds to one wire location (subject/endpoint/table); compatibility mode is a first-class enum borrowed from Schema Registry vocabulary.
- **Evidence:** [research §Agent 4 — L1-A4](./domainspec-subagents-research.md#agent-4--l1-a4-literature-schema-vs-contract-distinction)
- **Implication:** Any DomainSpec contract surface must carry `schema_ref` rather than re-typed fields.

### F6 — Constructive evaluator recommends a hybrid: tag-first on existing surfaces, plus a derived-view generator

- **Claim:** Option (c) tags + Option (a) generator beats both pure (a) (nothing new to surface) and (b) hand-authored artifact (reintroduces drift); single source of truth preserved because the generator produces a read-only projection.
- **Evidence:** [research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives)
- **Implication:** If DomainSpec moves at all, it moves by schema patches + a compiler, not by spawning a new node type.

### F7 — Adversarial evaluator rejects formalization at DomainSpec-core level

- **Claim:** DomainSpec is a meta-framework with no deployed producer or consumer; a contract at meta-framework level has no counterparties. Every gap from F1 maps to an existing surface (rules.md, frontmatter status, slos.md, infra.md). HIGH-risk seams are cheaper to fix with CI lints than with a new artifact.
- **Evidence:** [research §Agent 6 — L2-E2](./domainspec-subagents-research.md#agent-6--l2-e2-evaluator-adversarial-steelman-do-not-formalize)
- **Implication:** Any contract-as-artifact decision belongs in consumer repos (house_project, football-stats-oracle, etc.), not in DomainSpec-core.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in [`domainspec-subagents-research.md`](./domainspec-subagents-research.md) per R17.

### T1 — Evaluators converge sharper than they diverge

- **Held by L2-E1 (constructive):** A hybrid (c)+(a) — tag-first + derived view — is worth the schema-patch tax at DomainSpec-core because the generator doubles as a checker and single-source-of-truth is preserved by construction.
- **Held by L2-E2 (adversarial):** Same hybrid is unnecessary at DomainSpec-core; CI lints on existing files achieve the same seam closure without any new authoring surface or node type.
- **Evidence:** [research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives), [research §Agent 6 — L2-E2](./domainspec-subagents-research.md#agent-6--l2-e2-evaluator-adversarial-steelman-do-not-formalize)
- **Impact:** Both reject option (b) (hand-authored first-class `DATA-CONTRACT.md`) outright; disagreement is narrowly about whether the generator earns its keep, not about whether a hand-authored governance artifact is justified. The path forward bisects the disagreement at the layer boundary.

### T2 — Promisor/promisee asymmetry between meta-framework and consumer repos

- **Held by DomainSpec-core scope:** "Data contract" presupposes counterparties, but the meta-framework has none.
- **Held by consumer-repo scope:** Producers and consumers exist there with real breaking-change blast radius.
- **Evidence:** [research §Agent 6 — L2-E2](./domainspec-subagents-research.md#agent-6--l2-e2-evaluator-adversarial-steelman-do-not-formalize), [research §Agent 4 — L1-A4](./domainspec-subagents-research.md#agent-4--l1-a4-literature-schema-vs-contract-distinction)
- **Impact:** The contract artifact, if it materializes anywhere, materializes at the wire location in the consumer repo. DomainSpec-core's contribution is schema patches + an optional generator; the *contract itself* is the generated view bound to a wire location, consistent with F5.

### Cross-cutting observations

**Resolution synthesis.** Layered split:
- **DomainSpec-core** ships schema patches (tag columns), CI validator lints on existing surfaces, and an OPTIONAL `contract_view` generator in `internal_tools/`. No new artifact node type, no graph edges for "contract." Consistent with F7's adversarial constraint and F6's tag-first preference ([research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives), [research §Agent 6 — L2-E2](./domainspec-subagents-research.md#agent-6--l2-e2-evaluator-adversarial-steelman-do-not-formalize)).
- **Consumer repos:** the generated view IS the contract, binding to one wire location per F5 ([research §Agent 4 — L1-A4](./domainspec-subagents-research.md#agent-4--l1-a4-literature-schema-vs-contract-distinction)). The promise lives where producer and consumer exist.

**Implementation sketch.**
- Schema patches: concept table gains `owner`, `version`, `compat_mode`, `deprecated_at`, `schema_ref`; event payload tables gain `pii`, `cardinality_limit`, `schema_ref`; OTel attribute spec gains `cardinality_limit`, `enum_ref`; slos.md gains `consumer` dimension. Maps to F1's gap list and F2's HIGH seams ([research §Agent 1 — L1-A1](./domainspec-subagents-research.md#agent-1--l1-a1-repo-audit-explicit-data-contract-surfaces), [research §Agent 2 — L1-A2](./domainspec-subagents-research.md#agent-2--l1-a2-repo-audit-implicit-contract-seams)).
- CI lints: every `Produces For` consumer resolves to an existing operation; every event payload field has `schema_ref` or is flagged untyped; a concept row with 0 L₂ implementations fails extraction ([research §Agent 2 — L1-A2](./domainspec-subagents-research.md#agent-2--l1-a2-repo-audit-implicit-contract-seams)).
- `internal_tools/contract_view/`: generator emits `docs/contracts/<feature>/<wire-location>.md` as a read-only derived view; consumer repos opt in ([research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives)).
- Migration in 4 stages per L2-E1: extend templates (optional), warnings 1 cycle, ship generator, promote warnings to errors per-tag ([research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives)).

**Trade-offs accepted.** (1) Governance metadata is producer-tagged, not narrative-authored — consumer richness is bounded by tag fill rate ([research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives)). (2) The contract document is generated, never hand-authored — narrative artifacts sit downstream, not as replacements ([research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives)). (3) DomainSpec-core ships no `DATA-CONTRACT` node type — keeps the small-surface invariant L2-E2 flagged ([research §Agent 6 — L2-E2](./domainspec-subagents-research.md#agent-6--l2-e2-evaluator-adversarial-steelman-do-not-formalize)).

**Open questions.**
- OQ1: Tag granularity — `compat_mode` at concept-row vs feature level? (rooted in F1's per-field-ownership gap, [research §Agent 1 — L1-A1](./domainspec-subagents-research.md#agent-1--l1-a1-repo-audit-explicit-data-contract-surfaces)).
- OQ2: `schema_ref` resolution — co-located file vs registry subject? (rooted in F5's bind-to-wire-location rule, [research §Agent 4 — L1-A4](./domainspec-subagents-research.md#agent-4--l1-a4-literature-schema-vs-contract-distinction)).
- OQ3: Consumer SLA — on `Produces For` edge rows or on `slos.md` keyed by `(producer, consumer)`? (rooted in F1's per-consumer-SLA gap, [research §Agent 1 — L1-A1](./domainspec-subagents-research.md#agent-1--l1-a1-repo-audit-explicit-data-contract-surfaces)).
- OQ4: Does the `contract_view` generator live in DomainSpec-core or only in consumer repos? L2-E2 leans consumer-only; L2-E1 leans core ([research §Agent 5 — L2-E1](./domainspec-subagents-research.md#agent-5--l2-e1-evaluator-constructive-comparison-of-three-alternatives), [research §Agent 6 — L2-E2](./domainspec-subagents-research.md#agent-6--l2-e2-evaluator-adversarial-steelman-do-not-formalize)).
- OQ5: Interaction with the existing extraction pipeline (`_categorical/extraction.log.md`) — contract view as another L₂ projection or as a separate layer? (rooted in F2's Seam 8, [research §Agent 2 — L1-A2](./domainspec-subagents-research.md#agent-2--l1-a2-repo-audit-implicit-contract-seams)).

**Discovery-promotion candidate paths (R15) — knowledge scope (vault-level governance pattern):**
- `vault/discovery/data-contract-as-formal-artifact/<slug>.md` (primary)
- Alt: `vault/discovery/data-contract-tag-and-generate/<slug>.md`

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-subagents-research.md](./domainspec-subagents-research.md) | `derives-from` | Verbatim per-agent research that this findings file synthesizes per R17. |
| `vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml` | `dispatched-by` | Frozen dispatch spec (hash `1ac5bc0c…632ea`) under which all six agents ran. |
