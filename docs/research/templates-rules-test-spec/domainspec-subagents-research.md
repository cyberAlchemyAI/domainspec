---
tags: [subagents, dispatch-artifact, subagents-research]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-16
dispatch_slug: 2026-05-18-rules-test-spec-templates-01
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `2026-05-18-rules-test-spec-templates-01`

> Raw per-agent findings, **verbatim**. One section per child agent, in dispatch order.

---

## Context

DomainSpec lacked canonical templates for `rules.md` and `TEST-SPEC.md`. The two-layer-retrieval spec-writer improvised both and flagged the gap. This dispatch produced 4 propose-wave drafts (L1) and 2 adversarial evaluations (L2) to determine the canonical shape before writing to `domainspec/templates/`.

## Goal

Produce canonical `rules.md` and `TEST-SPEC.md` templates that fit existing DomainSpec features without force-fitting.

## Dispatch spec

- Path: `vault/snapshots/dispatches/2026-05-18-rules-test-spec-templates-01-spec.yaml`
- spec_hash: `e19e007552ad1ce3264c948039d1ddc8a4712aa4ceeb89e968089e32b5ebb7f0`
- corpus_hash_at_emit: `7e4b339b65ca7dfa6055b893c40189c2dcad7b92c46120842285f5798c471438`
- mode: task-fan-out, dispatch_kind: standard, layers: 3 (investigate → evaluate → synthesize)

---

## Agent 1 — L1-A1 (Schema-first / linter-enforcement)

Proposed full `rules.md` template with required fields: `**Type:** State Machine | Policy | Rule | Invariant`, `**Applies To:**`, REQUIRED at-least-one-of `Formal | Decision Table | Transition Table`, optional `Configuration | Invariants | Constraints | Failure Boundaries | Remediation Hooks`, required `**Checked by:**` line per rule. Required Capability Backlinks section at top.

Proposed full `TEST-SPEC.md` template with required: Execution Record (5 fields), Source Completeness Gate, Fixtures section, Docs-First Suite Partition (Unit | Integration | Scenario | Property), Test Matrix, Test Details with Fixture/Cited-rule/Expected-outcome bold labels.

Frontmatter decision: vault standard. Rejected: owner, feature, docType, scope-column, priority, test-runner, `checked: true/false`.

Fit notes: Strong fit for two-layer-retrieval (would template-conformance the existing file with 2 added lines per rule). Strong fit for AEO TEST-SPEC, partial for AEO rules.md (existing file has constraint IDs but not bold-label format).

---

## Agent 2 — L1-A2 (Schema-first / downstream-tooling)

Proposed `rules.md` with top-level Rule Index table (ID | Name | Type | Applies To | Checked By | Status). YAML-in-HTML-comment metadata block per rule (`<!-- rule_id: R1\ntype: Invariant\nscope: feature.Entity\nchecked_by: [T1]\nstatus: active -->`). Stable R1..RN IDs, never renumber.

Proposed `TEST-SPEC.md` with required Source Completeness Gate, Fixture Corpus table (FX1/FX2/FX3 IDs), Test Matrix with Suite column, Rule–Test Traceability Index (reverse index), YAML metadata block per test detail.

Frontmatter decision: vault standard. Rejected: docType, owners, feature, version-in-rule-ids, severity, auto_generated, inline JSON.

Design rationale: Python harness that ingests both files, extracts IDs, verifies traceability, partitions by Suite, skips deferred.

---

## Agent 3 — L1-A3 (Prose-first / minimum-required)

Proposed `rules.md` where each rule = heading + 1-3 sentences (or formal expression) + "Checked by:" link. ALL of Type/Applies-To/Formal-block/Decision-Table/Invariants table are OPTIONAL. Add only when carrying info the prose lacks.

Proposed `TEST-SPEC.md` where each test = matrix row (ID | Description | Validates). Test Details optional. Known Gaps optional. Out of Scope optional.

Frontmatter decision: vault standard. Rejected as required: Applies-To, Type label, Suite column, Source Completeness Gate, Coverage Summary, Concept-Rule Traceability Index, Execution Record block.

Design rationale: Forcing structure on features that lack the complexity produces scaffolding noise worse than no structure. Rules and tests need bidirectional traceability; nothing else is universal.

---

## Agent 4 — L1-A4 (Prose-first / worked-examples)

Proposed `rules.md` with 3 worked example rule blocks drawn from real corpus: two-layer-retrieval F1 (universal invariant), F4 (intent-conditional), and AEO RetryPolicy (parameterized policy). Each marked "← delete this once you have your own."

Proposed `TEST-SPEC.md` with 3 worked example test blocks: T1 (sample-driven), T5 (inject-and-assert), T8 (falsification baseline).

Frontmatter decision: vault standard (two-layer-retrieval as live precedent). Rejected: owner, feature, implements, required_fields metadata, test_framework, coverage_count.

Design rationale: Worked examples teach the right level of abstraction; blank forms tempt mechanical fill-in. "Delete this once you have your own" transfers editorial judgment to the feature author.

---

## Agent 5 — L2-E1 (Defender of rigor) — Opus

**Verdict rules.md: WINNER L1-A2 (Schema-first / downstream-tooling)** with tightening from A1.

Hybrid changes: adopt A1's enumerated section types (closed list, at-least-one-of Formal/Decision Table/Transition Table required); make `Checked by:` required per rule; linter rule for `checked_by` validity.

Failure modes if A3/A4 wins:
- **two-layer-retrieval F4** collapses into ambiguity — piecewise formal block (CANON hard-exclude + non-CANON soft-demote ordering) becomes 1-sentence prose, drops strict ordering quantifier, drops existential pairing; supersedes-pathology Lean queue at `/domainspec-theorem/pipeline/queue/0003` has no machine-readable rule to lift.
- **AEO RunStateMachine** becomes unverifiable — prose summary loses transition table, guards, effects; AEO-BE-RULE-001..010 lose per-transition addressability.
- **AEO TRACE-ID rot** — A3/A4 don't require ID stability; renumbering `P-R-1 → P-R-2` silently breaks all traceability rows.
- **payment-processing money invariants** stated as prose are unenforceable — "settled payments must balance the ledger" loses existential, equality, field links.

**Verdict TEST-SPEC.md: WINNER L1-A2** with concession.

Hybrid changes: adopt A3's permission for Test Details optional for sample-driven matrix-only tests; keep A2's Source Completeness Gate, Fixture Corpus, Test Matrix, Rule-Test Traceability Index, stable T-IDs; drop A1's Execution Record as required.

Failure modes if A3/A4 wins:
- **T8's falsification semantics get erased** — without required "Failure Meaning" field, engineer fixes test instead of re-examining design.
- **F1's "exactly equal" assertion degrades to "matches"** — without required Expected Outcome citing rule formula, author writes `assert n.view.inbound_edges` (truthy check).
- **AEO 149 obligations become 14 disconnected rows** without Concept and Rule Traceability Index.
- **payment-processing fixture corpus drift** — two tests independently mutate "pending payment with $100" and diverge silently.

Frontmatter: vault standard. AEO's missing frontmatter is a migration task to be flagged.

Overall: Adopt L1-A2 for both with two surgical relaxations from A3/A4.

---

## Agent 6 — L2-E2 (Defender of authorial freedom) — Opus

**Verdict rules.md: WINNER L1-A4 (Prose-first / worked-examples)** with one graft from A3.

Hybrid changes: keep A4's three worked examples as spine; adopt A3's single hard rule (`**Checked by:**` link per rule); explicitly mark all other patterns as optional.

Failure modes if A1/A2 wins:
- **two-layer-retrieval F1** padded with `**Type:** Invariant` and `**Applies To:** [retrieve()]` boilerplate that says nothing the heading and prose don't already convey; F1's reader currently learns the contract in 8 seconds, A1 version pads with skippable metadata.
- **F4 piecewise formal block** forced into Decision Table loses universal quantifier; "at least one of Formal/Decision Table/Transition Table" forces fake transition tables on rules that aren't state machines.
- **AEO** — domain genuinely demands the structures, but applying that template floor to two-layer or payment-processing produces empty boilerplate.
- **A2's YAML-in-HTML metadata duplicates heading slugs** — heading IS the stable ID. Two IDs drift; linter to enforce equality is enforcement-for-enforcement's sake.
- **payment-processing** — first author opens template, sees REQUIRED Capability Backlinks, writes empty backlinks for a feature that doesn't need them. 2-line rule becomes 10-line boilerplate.

**Verdict TEST-SPEC.md: WINNER L1-A4** with two grafts from A3.

Hybrid changes: keep A4's three worked examples; require A3's Test Matrix table (ID | Test | Validates) — only consistent structure across stress corpus. Reject A1's required Execution Record, Source Completeness Gate, Suite Partition. Reject A2's required Fixture Corpus, Rule-Test Traceability Index, YAML-per-test metadata.

Failure modes if A1/A2 wins:
- **two-layer-retrieval T1** sample-driven test — A1's required Unit | Integration | Scenario | Property partition forces arbitrary picks; downstream tooling runs T1 in wrong bucket.
- **T8 has no rules.md entry to cite** — it validates a discovery-level falsification round. Author either fakes citation or fails linter.
- **A2's Rule-Test Traceability Index** is duplicate data at 8 tests; only earns its keep at AEO's 149 tests.
- **payment-processing 4-test spec** — Unit vs Integration is coin flip, Scenario and Property are empty. Template gets abandoned.

Frontmatter: vault standard required for vault-resident files (the existing CLAUDE.md hook enforces it). AEO has no frontmatter and ships — frontmatter is a vault-graph concern, not a template-completeness concern.

Overall: Worked-example templates win for first-time authors and small features; don't prevent AEO-scale rigor (author with 149 tests naturally evolves toward those structures). Single hard requirements worth keeping: `**Checked by:**` link per rule, Test Matrix row per test.

---

## Agent 7 — L3-S1 (Parent synthesis)

Synthesized L1-A4 spine + L1-A3 hard requirements (`Checked by:` per rule; Test Matrix per test) + L1-A1/A2 patterns demonstrated by HTML-comment-wrapped examples (vanish on delete, no orphan anchors). Frontmatter: vault standard, demonstrated.

Final templates written to:
- `/Users/victorboscaro/domainspec/domainspec/templates/rules.md`
- `/Users/victorboscaro/domainspec/domainspec/templates/TEST-SPEC.md`

User approved before write.
