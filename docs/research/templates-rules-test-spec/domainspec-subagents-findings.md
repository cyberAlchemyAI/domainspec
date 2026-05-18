---
tags: [subagents, dispatch-artifact, subagents-findings]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-16
dispatch_slug: 2026-05-18-rules-test-spec-templates-01
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `2026-05-18-rules-test-spec-templates-01`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** → **Findings** → **Analysis**. Every load-bearing claim in Findings and Analysis cites a passage in [`domainspec-subagents-research.md`](./domainspec-subagents-research.md) per R17.

---

## Context

DomainSpec lacked canonical templates for `rules.md` and `TEST-SPEC.md`. The two-layer-retrieval spec-writer improvised both and flagged the gap. This dispatch produced 4 propose-wave drafts (L1, Sonnet) and 2 adversarial evaluations (L2, Opus) to determine the canonical shape. Synthesis (L3, parent) merged the verdicts and the user approved the final templates, which were then written to `domainspec/templates/{rules,TEST-SPEC}.md`.

## Goal

Produce canonical `rules.md` and `TEST-SPEC.md` templates that fit existing DomainSpec features without force-fitting.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading).

**Mode:** task-fan-out *(R19)*

**Dispatch spec:** `vault/snapshots/dispatches/2026-05-18-rules-test-spec-templates-01-spec.yaml`
**spec_hash:** `e19e007552ad1ce3264c948039d1ddc8a4712aa4ceeb89e968089e32b5ebb7f0`
**corpus_hash_at_emit:** `7e4b339b65ca7dfa6055b893c40189c2dcad7b92c46120842285f5798c471438`
**Telemetry emission:** appended to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` at 2026-05-18T03:39:26Z
**Validator:** opus, accepted on first pass
**Stop conditions fired:** none

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `L1-A1` | sonnet | Propose draft — schema-first / linter-enforcement angle on a contested template shape | unbounded | structured proposal: rules.md template + TEST-SPEC.md template + frontmatter decision + fit notes |
| `L1-A2` | sonnet | Propose draft — schema-first / downstream-tooling angle (Python harness ingestion) | unbounded | same shape as A1 |
| `L1-A3` | sonnet | Propose draft — prose-first / minimum-required angle (anti-scaffolding) | unbounded | same shape as A1 |
| `L1-A4` | sonnet | Propose draft — prose-first / worked-examples angle (real corpus excerpts) | unbounded | same shape as A1 |
| `L2-E1` | opus | Adversarial evaluation — defender of rigor; must reason over 4 drafts × 4 stress features and predict failure modes | unbounded | verdict per file + hybrid changes + failure-mode enumeration |
| `L2-E2` | opus | Adversarial evaluation — defender of authorial freedom; symmetric to E1 | unbounded | same shape as E1 |
| `L3-S1` | parent (opus) | Synthesis across two opposed L2 verdicts; arbitrate, produce final templates | unbounded | final template files + rationale |

**Sequencing:** DAG — 4 parallel L1 proposers → 2 parallel L2 evaluators (each consuming all 4 L1 outputs) → 1 L3 parent synthesis.

**Recursion budget actually used:** depth = 3, breadth = 4 (at L1), total agents = 7 *(defaults per R13: depth 2, breadth 5, total 10; depth override to 3 to permit evaluate→synthesize layering)*

**Actual spend:**

> Per-agent token counts not captured in the dispatch artifacts available at write time; only structural spend (agent count) is recorded. Cost discipline component below is scored against the structural budget (≤10 agents, ≤depth 3) rather than per-token totals.

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `L1-A1`..`L3-S1` | not recorded | not recorded | not recorded |
| **Sum**   | —         | —          | 7 agents (vs 10 budget) |

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.95` (judgment) | Goal was canonical templates that fit existing features without force-fitting; both files produced, fit-tested across two-layer-retrieval, AEO, payment-processing — all four L1 agents addressed both target files and all reported fit notes ([research §Agent 1](./domainspec-subagents-research.md#agent-1--l1-a1-schema-first--linter-enforcement), [research §Agent 4](./domainspec-subagents-research.md#agent-4--l1-a4-prose-first--worked-examples)). |
| Independence     | `0.9` (judgment) | Four L1 agents partition the 2×2 design space (schema-first vs prose-first × tooling vs authorial-ergonomics) cleanly; verdicts diverged sharply rather than converging through contamination ([research §Agent 5](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus), [research §Agent 6](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus)). |
| Fidelity         | `0.9` (judgment) | Every finding below traces to a named agent section in research.md; synthesis decisions are reconstructable from the L2 failure-mode arguments. |
| Cost discipline  | `1.0`            | declared budget vs actual: 7 / 10 agents; depth 3 within override; no stop conditions fired. |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

### F1 — Sharp adversarial disagreement, narrow convergence

- **Claim:** The two L2 evaluators voted opposite ends of the design space for both files (E1 → A2 schema-first/tooling; E2 → A4 worked-examples) but converged on two non-negotiables: vault-standard frontmatter and bidirectional rule↔test traceability.
- **Evidence:** [`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus), [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus).
- **Implication:** The convergence points become hard requirements in the synthesized template; the divergence points become "demonstrated, not required."

### F2 — YAML-in-HTML-comment metadata rejected

- **Claim:** A2's per-rule YAML-in-HTML metadata block (`<!-- rule_id: R1 ... -->`) was the most consequential rejection in synthesis because the heading slug already IS the stable ID; a second `rule_id` field creates a drift vector with no information gain.
- **Evidence:** [`research §Agent 2`](./domainspec-subagents-research.md#agent-2--l1-a2-schema-first--downstream-tooling) (proposes the block), [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus) ("heading IS the stable ID. Two IDs drift; linter to enforce equality is enforcement-for-enforcement's sake").
- **Implication:** Stable IDs in the synthesized template are the heading slugs; no separate metadata block; the rule↔test linkage is carried by `**Checked by:**` links rather than parallel ID registries.

### F3 — Cargo-cult pattern: structure calibrated to high-complexity features produces empty boilerplate on small ones

- **Claim:** Required structure calibrated to AEO (149 obligations) systematically produces empty sections when applied to small features (two-layer-retrieval 8 tests; payment-processing 4 inferred tests). Concrete instances: Capability Backlinks required → empty on simple rules; Unit/Integration/Scenario/Property partition → arbitrary coin-flip on sample-driven tests; Rule-Test Traceability Index → duplicate of `Validates` column below ~50 tests.
- **Evidence:** [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus) (all three instances enumerated: empty Capability Backlinks on payment-processing; arbitrary Unit/Integration partition on T1; Rule-Test Traceability "duplicate data at 8 tests").
- **Implication:** Template floor must be calibrated to the smallest legitimate feature, not the largest; large-feature structures appear in worked examples as escalation paths, not required scaffolding.

### F4 — Two hard requirements earned their place

- **Claim:** Across all four L1 drafts and both L2 verdicts, two structural requirements survived the rigor-vs-freedom tension at zero boilerplate cost: a `**Checked by:**` link per rule in `rules.md`, and a Test Matrix row per test with a `Validates` citation in `TEST-SPEC.md`.
- **Evidence:** [`research §Agent 3`](./domainspec-subagents-research.md#agent-3--l1-a3-prose-first--minimum-required) (proposes both as the only universals), [`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus) ("make `Checked by:` required per rule"), [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus) ("Single hard requirements worth keeping: `**Checked by:**` link per rule, Test Matrix row per test").
- **Implication:** These become the only hard linter checks; everything else is judgment.

### F5 — Demonstrated-not-required as the structural answer

- **Claim:** The synthesis resolved the rigid-vs-prose dichotomy by showing optional patterns inside HTML comments rather than scaffolded copy-paste blocks, so deletion does not leave dangling anchors.
- **Evidence:** [`research §Agent 7`](./domainspec-subagents-research.md#agent-7--l3-s1-parent-synthesis) ("L1-A1/A2 patterns demonstrated by HTML-comment-wrapped examples (vanish on delete, no orphan anchors)").
- **Implication:** Authors of complex features (AEO-scale) can lift the patterns out of comments; authors of small features delete the comments and ship a 2-line rule, neither path producing template-conformance debt.

### F6 — Frontmatter: vault standard, demonstrated; AEO retrofit is a separate concern

- **Claim:** All four L1 agents independently selected vault-standard frontmatter. AEO currently ships without frontmatter; that is a migration question, not a template question.
- **Evidence:** [`research §Agent 1`](./domainspec-subagents-research.md#agent-1--l1-a1-schema-first--linter-enforcement), [`research §Agent 2`](./domainspec-subagents-research.md#agent-2--l1-a2-schema-first--downstream-tooling), [`research §Agent 3`](./domainspec-subagents-research.md#agent-3--l1-a3-prose-first--minimum-required), [`research §Agent 4`](./domainspec-subagents-research.md#agent-4--l1-a4-prose-first--worked-examples) (all four record "Frontmatter decision: vault standard"); [`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus) ("AEO's missing frontmatter is a migration task to be flagged"); [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus) ("AEO has no frontmatter and ships — frontmatter is a vault-graph concern, not a template-completeness concern").
- **Implication:** Template ships with vault-standard frontmatter demonstrated; AEO retrofit deferred to a follow-up (see Analysis OQ).

---

## Analysis

### T1 — Rigor vs authorial freedom: same evidence, opposite verdicts

- **Held by L2-E1 (rigor):** Without enumerated section types, required `Checked by:`, and stable IDs, two-layer-retrieval F4's piecewise formal block collapses, AEO's RunStateMachine becomes unverifiable, AEO TRACE-IDs rot under renumbering, and payment-processing money invariants stated as prose are unenforceable.
- **Reality per L2-E2 (freedom):** The same A1/A2 floor pads two-layer F1 with `**Type:** Invariant` boilerplate that says nothing the heading does not, forces fake transition tables on non-state-machine rules via "at-least-one-of," and turns payment-processing into 10-line boilerplate for what should be a 2-line rule.
- **Evidence:** [`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus), [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus).
- **Impact:** Both evaluators are right at their respective scales. Synthesis resolves by enforcing only the floor that both agree on (F4) and demonstrating the rest (F5) — neither side gets to set the template's required content alone.

### T2 — ID stability: linter-enforced parallel registry vs heading-as-canonical-ID

- **Held by L2-E1:** Stable T-IDs and rule IDs must be carried by metadata fields that a Python harness can validate; renumbering `P-R-1 → P-R-2` otherwise silently breaks all traceability rows.
- **Reality per L2-E2:** The heading already is the stable ID. A second `rule_id` field is enforcement-for-enforcement's sake and introduces a drift vector — the linter must now police that the two IDs match, which is work generated by the schema, not work the schema reduces.
- **Evidence:** [`research §Agent 2`](./domainspec-subagents-research.md#agent-2--l1-a2-schema-first--downstream-tooling), [`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus), [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus).
- **Impact:** Synthesis resolved in E2's favor — heading slugs are the IDs, `**Checked by:**` links carry the cross-references, no parallel ID registry. AEO-scale renumbering risk is addressed by social discipline (don't renumber once published), not template structure.

### T3 — Where structural enforcement actually belongs

- **Held by L2-E1:** Future authors will skip the formal block on the third rule someone adds; only a required structure prevents this.
- **Counter-position from the dispatch outcome:** The cure for skipped formal blocks is review discipline on spec-authoring PRs, not template enforcement that calibrates every feature's template floor to the highest-complexity feature.
- **Evidence:** [`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus) ("don't prevent AEO-scale rigor (author with 149 tests naturally evolves toward those structures)"); [`research §Agent 3`](./domainspec-subagents-research.md#agent-3--l1-a3-prose-first--minimum-required) ("Forcing structure on features that lack the complexity produces scaffolding noise worse than no structure").
- **Impact:** Templates enforce only the minimum required for cross-document traceability (heading slug + Checked-by + Validates citation); calibrating the template floor at the highest-complexity feature is a category error.

### Cross-cutting observations

- **The 2×2 propose grid actually paid off.** L1-A1/A2 (schema-first × linter/tooling) and L1-A3/A4 (prose-first × minimum/worked-examples) gave the L2 evaluators a clean choice rather than four variants of one position; the sharp E1/E2 split in F1 only happens because the L1 partition was genuinely orthogonal ([`research §Agent 1`](./domainspec-subagents-research.md#agent-1--l1-a1-schema-first--linter-enforcement) through [`research §Agent 4`](./domainspec-subagents-research.md#agent-4--l1-a4-prose-first--worked-examples)).
- **L2 evaluators agreed on the small surgical relaxations they would graft onto their winner.** E1 (A2-winner) grafted A3's "Test Details optional for sample-driven matrix-only tests" ([`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus)); E2 (A4-winner) grafted A3's Test Matrix requirement ([`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus)). The grafts converge on A3's minimum-required spine — which became the synthesis's hard-requirements floor (F4).
- **Open question for follow-up:** should `agent-execution-orchestrator/rules.md` and `agent-execution-orchestrator/TEST-SPEC.md` be retrofitted with vault-standard frontmatter? Flagged by E1 ([`research §Agent 5`](./domainspec-subagents-research.md#agent-5--l2-e1-defender-of-rigor--opus)) and noted as a vault-graph concern by E2 ([`research §Agent 6`](./domainspec-subagents-research.md#agent-6--l2-e2-defender-of-authorial-freedom--opus)); not blocking template adoption.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-subagents-research.md](./domainspec-subagents-research.md) | `derived-from` | Verbatim per-agent research that grounds every Finding and Analysis claim above (R17). |
| `vault/snapshots/dispatches/2026-05-18-rules-test-spec-templates-01-spec.yaml` | `dispatch-spec` | Frozen spec for this dispatch (spec_hash recorded in Dispatch record). |
| `domainspec/templates/rules.md` | `produces` | Canonical template written as the outcome of this dispatch. |
| `domainspec/templates/TEST-SPEC.md` | `produces` | Canonical template written as the outcome of this dispatch. |
