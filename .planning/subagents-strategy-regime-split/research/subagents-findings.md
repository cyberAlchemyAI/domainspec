---
tags: [subagents, dispatch-artifact, subagents-findings, regime-split]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: subagents-strategy-regime-split
implements: [R16, R17, R18, R21, R22, R23 of subagents-strategy-constitution.md]
---

# Subagents-Findings — `subagents-strategy-regime-split`

> Synthesis of the per-child research in [`subagents-research.md`](./subagents-research.md). Every load-bearing claim in **Findings** and **Analysis** cites a section of that file (R17). Section order — Context → Goal → Dispatch record → Findings → Analysis — is mandatory per R16. Context + Goal preamble per R23.

---

## Context

The prior session (`vault/sessions/2026-05-03-0140-subagents-strategy-discovery-target-divergence.md`) surfaced that the subagents-strategy stack hardcodes `vault/discovery/` as the only legal discovery sink — directly conflicting with R15 ("vault is for codified discipline") when the dispatch is application-level. The two-regime resolution (`knowledge` → vault, `application` → near-spec) was designed but not wired. The user has now asked to land it via the lifecycle: research → findings → discovery → (plan) → implementation. The user has also queued a verification subagent for after implementation.

## Goal

Produce a research+findings pair rigorous enough to become the discovery node that defines the two-regime model: classification rule, frontmatter schema change, path conventions, edit surface across constitution/skill/writer-agent. Implementation file edits come AFTER step 7, not in this dispatch.

---

## Dispatch record (R18)

**Mode:** task-fan-out

**Sequencing:** parallel set; single-message dispatch per R8. No child recursed.

**Working folder:** `.planning/subagents-strategy-regime-split/` (R15 — outside `vault/`).

### Per-agent table

| id | model | difficulty justification | token budget (declared) | output shape (R18) |
|---|---|---|---|---|
| C1 — regime-classification | sonnet | Rule-design with concrete repo signals; needs careful judgment but low search depth — sonnet is sufficient. | ~3,000 out | Inline return: rule + signals + decider + path convention with worked examples (R5). |
| C2 — ontology-impact | sonnet | Multi-file ontology trace (edges, bidirectionality, frontmatter, curator); needs systematic enumeration but no novel reasoning — sonnet is sufficient. | ~3,500 out | Inline return: 4-section impact analysis with judgment markers on Options A/B/C and Postures A/B (R5). |
| C3 — edit-surface-map | sonnet | Mechanical line-level inventory across ~12 files; high volume, low depth — sonnet is sufficient. | ~3,500 out | Inline return: per-file/line table + surface summary + 5 items flagged for human review (R5). |

### Recursion budget

- **Declared envelope:** depth 2 / breadth 5 / total 10.
- **Used:** 3 of 10. No child recursed (depth 1 only).

### Actual spend

| id | output tokens (approx) | files written by child | recursion used |
|---|---|---|---|
| C1 | ~1,100 | 0 (inline per R5) | 0 |
| C2 | ~1,180 (self-reported) | 0 (inline per R5) | 0 |
| C3 | ~2,400 | 0 (inline per R5) | 0 |
| **total** | **~4,680 out** | **0** | **0** |

### Four-component grade (R21 + R22)

- **Coverage (judgment):** **A**. The three children together resolve every clause of the Goal — classification rule (C1 §1–3), application path convention (C1 §4), frontmatter schema delta (C2 §3), and the edit surface across constitution/skill/writer-agent (C3 full table). No Goal-clause is uncovered; C3 even surfaces 5 boundary cases the Goal did not explicitly request.
- **Independence (judgment):** **A−**. C1 owns the rule + decider, C2 owns ontology cost, C3 owns the surface map — non-overlapping concerns. Mild boundary touch: C1 §4 mentions constitution edits "for child C3, not me" and C3 marks dependencies on C1+C2 per row; this is coordination, not concern-overlap. C2 introducing a new bidirectionality rule (status-gated mirroring) was not strictly in its concern but is correctly flagged as judgment.
- **Fidelity (judgment):** **A**. Every per-child return contains explicit citations to repo line numbers (`vault/ontology-conventions.md` line 290, line 452, line 548; `subagents-discovery-writer.agent.md` lines 22 / 32; `SKILL.md` line 86; etc.). C2 explicitly separates "cited evidence" from "judgment" sections. C3's table is line-keyed throughout. No claim is unsourced beyond labeled judgments.
- **Cost discipline (mechanical):** declared total budget ~10,000 out; actual ~4,680 out → **47% of budget, well under**. No child triggered recursion against the depth-2 / breadth-5 / total-10 envelope (used 3/10). On budget.

---

## Findings

### F1 — A clean classification rule exists and turns on edge topology, not topic

A discovery is **knowledge-regime** iff its load-bearing claims are about the vault's own discipline — ontology, schema, edges, agent/skill protocols, premises, constitutions — i.e. iff future vault nodes will carry a `derives-from` / `governed-by` / `codified-as` edge into it. Otherwise it is **application-regime**, living next to the feature whose `SPEC.md` / `STORIES.md` / `DECISIONS.md` it concerns ([research §Agent 1 §1](./subagents-research.md#agent-1--regime-classification-rule-signals-decider-application-path-convention)). The rule is operationalizable from prompt-visible signals — vault-path mentions, ontology vocabulary, agent/skill protocol names → knowledge; feature-folder mentions, `SPEC.md` references, story/UAT framing → application ([research §Agent 1 §2](./subagents-research.md#agent-1--regime-classification-rule-signals-decider-application-path-convention)).

**Implication:** classification is *visible at lifecycle step 1*, so it can be a strategist-proposes / user-confirms call inside the existing R6a gate at step 2 — no third gate is needed.

### F2 — Application-regime path: `docs/features/<feature>/discovery/<slug>.md`

C1 evaluated three candidates and recommends `docs/features/<feature>/discovery/<slug>.md` over `<working_folder>/discovery/...` and `.planning/<workspace>/discovery/...`, on three grounds: `docs/features/` is the established home for per-feature work; a `discovery/` sibling slots in cleanly alongside `_categorical/` and `capabilities/`; and the path encodes lifetime — the discovery moves with the feature and dies with it ([research §Agent 1 §4](./subagents-research.md#agent-1--regime-classification-rule-signals-decider-application-path-convention)). Working-folder and `.planning/` paths are explicitly rejected because they are scratch-space, blurring work-in-progress with promoted artifact.

**Implication:** the implementation step must teach `subagents-discovery-writer.agent.md` (currently lines 22 + 32 refuse non-`vault/discovery/` paths) to accept the new path pattern under the same R6b confirmation gate.

### F3 — Ontology already partially anticipates the split, but no field carries it

`vault/ontology-conventions.md` line 452 already states in prose that *"discoveries may live in `vault/discovery/` … OR in application/feature folders"* — but this clause does **not** propagate into a frontmatter field, the edge catalog, or the curator's targets ([research §Agent 2 §1](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)). The ontology authorizes the regime split at the `node_type` row but leaves it un-enforced.

**Implication:** the discovery must promote that prose into a real frontmatter field (`regime: knowledge | application`, required for `node_type: discovery`, no default), updating five canonical files in lockstep (`frontmatter.md`, `frontmatter-semantics.md`, `ontology-conventions.md`, `discovery-writing.md`, plus the curator's audit checklist) ([research §Agent 2 §3](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)).

### F4 — The edge catalog allows cross-regime edges; bidirectionality is the real cost site

C2 enumerates seven edges that legitimately cross knowledge↔application (`governed-by`, `cites`, `derives-from`, `refines`, `contradicts`, plus their inverses), and notes the catalog rows carry **no** `path-must-be-under-vault/` constraint — so cross-regime edges are structurally legal today ([research §Agent 2 §1](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)). The actual tension is in `vault/ontology-conventions.md` Section 8 line 290's *"Edges must be declared on both endpoints"* — strict enforcement means vault files acquire reverse rows pointing at transient near-spec files they don't own ([research §Agent 2 §2](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)).

**Implication:** the regime split requires a coordinated amendment to Section 8 — see Analysis A1.

### F5 — The curator currently cannot see application-regime discoveries

`vault-metadata-curator.agent.md` line 38–39 hardcodes targets to *"any markdown file under `vault/`"* — application-regime discoveries (in feature folders) are invisible ([research §Agent 2 §4](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications), [research §Agent 3 surface map row curator:38](./subagents-research.md#agent-3--edit-surface-map-per-file-line-level-inventory-of-changes-required-to-land-the-split)). C2 recommends Posture A (one regime-aware curator with a configurable scan-root list) over Posture B (two curators) on grounds that skills can encode regime-conditional rules and the audit folder stays a single source of truth ([research §Agent 2 §4](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)).

**Implication:** the curator change is a Phase-1 dependency of the regime split, not a follow-up — a discovery the curator can't see is a discovery the audit pipeline silently ignores.

### F6 — Edit surface is bounded: 12 canonical files, ~38 distinct edit sites

C3's per-file inventory locates every change site with line numbers ([research §Agent 3 surface map](./subagents-research.md#agent-3--edit-surface-map-per-file-line-level-inventory-of-changes-required-to-land-the-split)). The 12 files are: subagents-strategy constitution, subagents SKILL, subagents-discovery-writer agent, frontmatter skill, frontmatter-semantics skill, discovery-writing skill, edges skill, subagents-findings-writing skill, ontology-conventions, subagents-findings template (conditional), curator agent, and subagents-research template (verify-only). Two files were inspected and confirmed **not** to need edits: `subagents-research-writer.agent.md` and `subagents-findings-writer.agent.md` — both already R15-clean ([research §Agent 3 surface summary](./subagents-research.md#agent-3--edit-surface-map-per-file-line-level-inventory-of-changes-required-to-land-the-split)).

**Implication:** the implementation plan can be sized off this inventory directly. No discovery work is hidden behind unenumerated files.

### F7 — Five boundary cases need human ruling before implementation

C3 explicitly flags five hardcoded `vault/discovery/` references that **do not** fit the standard edit categories and require a coordination call between C1 and C2 (= the discovery node) before edits begin ([research §Agent 3 surface summary, "flagged for human review"](./subagents-research.md#agent-3--edit-surface-map-per-file-line-level-inventory-of-changes-required-to-land-the-split)):

1. `ontology-conventions.md:452` — does the new `regime` field **subsume** the existing prose convention or **co-exist** with it?
2. `vault-metadata-curator.agent.md:38` — does the curator's walk extend to application-regime, or is the curator explicitly knowledge-regime-only?
3. `subagents-strategy-constitution.md:218` — *"Discovery promotion is the only mechanism by which dispatch outputs reach the vault"* must be reworded; at what authority level?
4. `edges.md:15` — does the rule *"propose a new edge through a discovery in `vault/discovery/`"* extend to application-regime discoveries, or stay knowledge-only?
5. `ontology-conventions.md:530-571` — are any of the 21 catalog edges (esp. `codified-as`, `operationalized-by`) regime-scoped?

**Implication:** these five questions are open questions (OQs) the discovery node must answer; they cannot be deferred to implementation.

---

## Analysis

### A1 — Section-8 bidirectionality is a coordinated amendment, not a side-effect

C2 surfaces a real conflict: strict bidirectionality (Section 8, line 290) forces vault files to mirror inverse rows for every cross-regime edge, even when the application source is `status: draft` or `status: exploratory` — diluting the *"vault is for codified discipline"* stance precisely as it tracks ephemeral consumers ([research §Agent 2 §2 Option A](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)). C2 recommends *"Option A with status-gated mirroring"* — vault mirrors only when the app-side source is `status: consolidated` or higher ([research §Agent 2 §2 cleanest rule](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)).

This is **a new rule that does not exist in Section 8 today**. The regime split therefore requires a coordinated amendment landing in the *same* discovery node:

> **Bidirectionality (revised):** Edges must be declared on both endpoints, with one exception: cross-regime edges sourced from `regime: application` documents only require the vault-side mirror once the source reaches `status: consolidated`. Drafts and exploratory app-discoveries do not pollute vault files.

If the discovery ships the regime field without this amendment, the curator's bidirectionality check (Mode 2) will start producing reverse-row noise the moment the first application-regime discovery declares `governed-by`. Calling it out explicitly: **shipping `regime` without amending Section 8 creates a curator regression on day one.**

### A2 — Step-2 gate vs step-7 gate is a real choice with a clear winner

C1 argues the regime call belongs at lifecycle step 2 (inside the existing R6a working-folder confirmation), not at step 7 (the promotion gate) ([research §Agent 1 §3](./subagents-research.md#agent-1--regime-classification-rule-signals-decider-application-path-convention)). The argument: deferring to step 7 means the strategist has already proposed working folders and run the children before the regime is settled — a regime mismatch then forces a post-hoc rewrite. The signals listed in C1 §2 are visible in the user's *opening* prompt, so there is no information advantage to waiting.

The counter-argument C1 does not raise: regime might shift mid-dispatch as evidence accumulates. But shifts of that kind would also force re-dispatching `subagents-discovery-writer` regardless of where the gate sits, so step-2 placement does not lose anything. **Step-2 placement wins.** The discovery should codify this and resist the temptation to add a third gate.

### A3 — The `regime` field is independent of `layer` — orthogonality must be defended

C2 specifically addresses why `regime` cannot be subsumed by `layer` ([research §Agent 2 §3 Other field interactions](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)). The counter-example is load-bearing: a discovery *about how application spec format should evolve* is `layer: ontology` (it is rule-shaped) but lives near application code (application-regime). Correlation between `layer` and `regime` is high but not 1:1, so the orthogonality discipline (Section 9) requires both fields.

The same reasoning kills `tags` as a substitute (free-text, unenforced) and `node_type: discovery + node_type: application-discovery` as a substitute (would conflate placement with role, violating orthogonality). **`regime` must be its own field.** The discovery should make this argument explicit so future "schema simplification" passes don't re-litigate it.

### A4 — OQ-1 (skill-file endpoints) is structurally similar but independent

C2 §1 explicitly notes that the `operationalized-by` edge (catalog line 548) already permits one cross-tree endpoint (vault → `.claude/skills/`), and that this is currently unresolved as **OQ-1** in `vault/discovery/documents-metadata-enforcement/` ([research §Agent 2 §1](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications), [§4 OQ-1 still blocks cleanly](./subagents-research.md#agent-2--ontology-impact-edge-catalog-bidirectionality-frontmatter-cascade-curator-implications)). The structural shape — *should an edge endpoint outside vault/ carry vault metadata?* — is the same shape as the regime question. C2 is right to keep them separate: solving regime does not solve OQ-1. **The discovery should record the kinship as a `cites` edge to OQ-1 and explicitly declare non-resolution**, so a future reader doesn't conflate them.

### A5 — Tension: C3 row for constitution line 218 collides with R15's authority

C3 flags that `subagents-strategy-constitution.md:218` says *"Discovery promotion is the only mechanism by which dispatch outputs reach the vault"* — this is currently load-bearing because it is R15's enforcement edge ([research §Agent 3 surface summary item 3](./subagents-research.md#agent-3--edit-surface-map-per-file-line-level-inventory-of-changes-required-to-land-the-split)). After the split, "the vault" is no longer the only sink. The sentence cannot simply be deleted (that strips R15 of its mechanism); it must be reworded to retain R15's authority while admitting application-regime promotion as a *separate* sink with its own discipline.

Proposed phrasing the discovery should evaluate:

> *"Discovery promotion is the only mechanism by which dispatch outputs become canonical artifacts. Knowledge-regime promotion writes under `vault/discovery/`; application-regime promotion writes under `docs/features/<feature>/discovery/`. Working-folder research and findings remain non-canonical and never appear under either sink."*

This preserves R15's "vault is for codified discipline" stance (working folders still cannot promote into vault directly) while admitting the second sink. **The discovery node must rule on this exact wording** because every downstream skill/agent text key off it.

### A6 — Children were complementary; their dependency graph is one-way

The children were dispatched as a parallel set, but their outputs have a natural dependency order *for the discovery's narrative*: C1 (rule + path) → C2 (ontology cost of that rule) → C3 (edit surface to land both). C3's per-row "depends on" column makes this explicit ([research §Agent 3 surface map "depends on" column](./subagents-research.md#agent-3--edit-surface-map-per-file-line-level-inventory-of-changes-required-to-land-the-split)) — most rows depend on C1+C2 jointly, never on C3 alone. This validates the parallel dispatch (no child was waiting on another at *runtime*) while showing the discovery node should present them in C1→C2→C3 order, not in dispatch order. **The discovery's section ordering should follow the dependency graph, not the dispatch graph.**

---
