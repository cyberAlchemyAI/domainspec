---
tags: [subagents, dispatch-artifact, subagents-findings]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-08
dispatch_slug: domainspec-types-and-edges-validation
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `domainspec-types-and-edges-validation`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis cites a passage in `domainspec-research.md` per R17.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

Investigating DomainSpec's foundational catalog (`TAXONOMY.md`): 25 meta-concepts in 4+4 categories, with edges formalized in `RELATIONSHIPS.md` (29 canonical labels). User hinted at potential gaps — categories like `Pattern` with `SAGA`, missing types/edges. Wave 1 surfaced that `RELATIONSHIPS.md` exists (edges are NOT implicit) but only 8/29 edges are composability-enforced, and synthetic runtime types `Feature`/`Consumer` live outside `TAXONOMY.md`.

## Goal

Produce evidence-backed verdicts (adopt / defer / reject) per candidate category, meta-concept, and edge — and decide whether the edge catalog needs additions, renames, or composability-enforcement work.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Mode:** `task-fan-out` in two parallel waves *(R19)*

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `C1 catalog-inventory` | sonnet | Mechanical enumeration of TAXONOMY/templates/code; high volume, low judgment | ~25k | Three structured tables (meta-concepts × categories, implicit edges, code-level enforcement) + anomaly notes |
| `C2 external-frame-survey` | opus | Cross-frame synthesis from DDD/CQRS/EIP/hexagonal literature; demands theoretical depth | ~30k | Two candidate tables (backend, UI) with severity + canonical source + category/edge observations |
| `C3 internal-pressure-audit` | opus | File-walking + judgment about type-abuse; needs careful evidence quotation | ~30k | Type-abuse case table (file:line evidence) + cases-NOT-abuse + pattern observations + conclusion |
| `C4 categories-and-pattern-meta-inquiry` | opus | Pure synthesis over Wave 1 outputs; high-stakes verdict for Q1 (Pattern) and Q2 (categories) | ~25k | Q1 verdict + Q2 verdict table + cross-cutting note + open questions |
| `C5 edge-catalog-proposal` | opus | Long-form audit of `RELATIONSHIPS.md` + parser source; many sub-decisions (additions, renames, enforcement priorities) | ~35k | Section 0-9 structured proposal (baseline, audit, gaps from C1/C2/C3, forward-only decision, cross-stack, enforcement, aliases, open questions) |
| `C6 ui-symmetry-check` | sonnet | Verification task: re-read live UI spec + template + TAXONOMY to confirm/refute C3's "UI not under pressure" verdict | ~20k | Per-candidate verdict table + UI infrastructure verdicts + stance summary |

**Sequencing:** DAG. Wave 1 (C1, C2, C3) ran in parallel with no inter-child reads; Wave 2 (C4, C5, C6) ran in parallel after Wave 1 completed, consuming Wave 1 outputs verbatim.

**Recursion budget actually used:** depth = 2, breadth = 5 (max parallel = 3 per wave), total agents = 6 children + 2 writer agents (research-writer + findings-writer) = 8. Within R13 default cap of 10.

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `C1 catalog-inventory` | ~25k | ~6.5k | ~31.5k |
| `C2 external-frame-survey` | ~30k | ~3k | ~33k |
| `C3 internal-pressure-audit` | ~30k | ~3k | ~33k |
| `C4 categories-and-pattern-meta-inquiry` | ~25k | ~3.5k | ~28.5k |
| `C5 edge-catalog-proposal` | ~35k | ~9k | ~44k |
| `C6 ui-symmetry-check` | ~20k | ~4k | ~24k |
| **Sum** | ~165k | ~29k | ~194k |

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | 0.85 (judgment) | All three Goal axes (categories, meta-concepts, edges) addressed with verdicts. Caveat: C2 did zero codebase reads (pure theory) — broad coverage of literature but no per-repo grounding for "essential" claims beyond what C3 confirmed. Quality/Trust and Temporal categories were deferred for lack of evidence, not for lack of investigation. |
| Independence     | 0.9 (judgment) | Wave 1 children explicitly avoided cross-contamination: C2 declares "I do NOT need to read DomainSpec internals (that's C1/C3)" ([research §Agent 2](./domainspec-research.md#agent-2--external-frame-survey-enumerate-candidate-meta-concepts-from-ddd-cqrs-eip-hexagonal-and-ui-canon-that-domainspec-lacks)); C4 declares "no file reads required — synthesis over Wave 1" ([research §Agent 4](./domainspec-research.md#agent-4--categories-and-pattern-meta-inquiry-should-pattern-become-a-meta-concept-and-what-new-categories-does-evidence-demand)); C5 confirmed C1's baseline by reading source directly ([research §Agent 5 Section 0](./domainspec-research.md#section-0--baseline-counts-confirmation)). Mild dock: C6 by design reads same source files as C1, but it is a verification mandate, not contamination. |
| Fidelity         | 0.95 (judgment) | Every Findings/Analysis claim below cites a research.md section anchor. The dispatch's load-bearing verdicts (reject Pattern, adopt three categories, 6+2+1 new edges, top-5 enforcement) all trace to specific tables in research.md. |
| Cost discipline  | 0.92            | Declared budget ~165k in / ~30k out = ~195k total. Actual: ~194k. Variance < 1%. Within recursion cap (8/10 agents). |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-research.md` (R17).

### F1 — Pattern is rejected as a meta-concept

- **Claim:** `Pattern` should not become a first-class meta-concept; the user's intuition is better served by a free-form `pattern:` frontmatter tag layered onto specific meta-concepts (Outbox, Saga, Repository, etc.).
- **Evidence:** [research §Agent 4 Q1](./domainspec-research.md#q1--pattern-as-a-first-class-meta-concept) — "Pattern has no shape of its own; SAGA, CQRS-Outbox, Repository, Specification, and Process Manager share nothing structurally except 'people gave them names in books.'" Also confirmed by [research §Agent 3 Conclusion](./domainspec-research.md#conclusion) — zero of the eight type-abuse cases name "Pattern" as the missing concept.
- **Implication:** Stop the "Pattern with SAGA" thread; instead, evaluate Saga's edge gaps directly (F5) and treat thematic grouping as a tag, not a node.

### F2 — Three new categories adopted; two deferred

- **Claim:** Adopt **Cross-cutting/Operational**, **Integration**, and **Persistence** as new categories. Defer **Temporal** and **Quality/Trust** until pressure surfaces.
- **Evidence:** [research §Agent 4 Q2 table](./domainspec-research.md#q2--new-categories) — Persistence has three C3 evidence cases (#1, #4, #7), Cross-cutting has C3 #2, Integration has C3 #5 + #6; Temporal and Quality/Trust have no C3 evidence. Backed by [research §Agent 2 Category-level observations](./domainspec-research.md#category-level-observations) calling out boundary/scope and cross-cutting/operational as the load-bearing categorical gaps.
- **Implication:** TAXONOMY.md grows from 4+4 to 7+4 categories. New category membership will require RELATIONSHIPS.md additions (F4, F5) before authoring guidance can be issued.

### F3 — Essential and strong meta-concept additions

- **Claim:** Adopt as essential (strong C2 + C3 convergence): **Aggregate**, **Aggregate Root**, **Repository**, **Read Model/Projection**, **Outbox**, **Domain Event vs Integration Event split**. Adopt as strong (essential in C2, lower C3 pressure): **Bounded Context**, **Domain Service**, **Command**, **Port**, **Adapter (driving/driven)**, **Use Case**. Reject as out-of-scope or anti-pattern: **Identity Map**, **Lazy Load**, **Active Record**, **Service Layer**, **Strategy**, **Observer**, **Background Worker**.
- **Evidence:** [research §Agent 2 Backend candidates table](./domainspec-research.md#backend-candidates) provides severity grades; [research §Agent 3 Type-abuse cases](./domainspec-research.md#type-abuse-cases-fileline-evidence) provides repo-grounded pressure for cases #1, #4, #5, #6, #7. C3 case #1 (`ExecutionRun` forced into Entity when it is structurally an Aggregate Root) and case #4 (`MirrorProjection` queries are event-maintained Read Models) are the load-bearing examples.
- **Implication:** Aggregate-Root and Read-Model/Projection are non-deferrable per C3's "non-deferrable" verdict. Domain Service, Port, Adapter, Use Case can sequence behind Aggregate work since C3 found no acute abuse for them.

### F4 — Edge catalog gains 9 new edges plus 2 union extensions

- **Claim:** Add 6 backend edges (`has-lifecycle`, `transitions-on`, `consumed-by`, `coordinates-cross`, `listens-to`, `issues`), 2 cross-cutting edges (`derived-from`, `promotes-to`), 1 UI edge (`navigates-to`). Extend `applies` (+ Workflow) and `reflects` (+ Enum) via type union.
- **Evidence:** [research §Agent 5 Summary of net deltas](./domainspec-research.md#c5-output--edge-catalog-proposal) at the bottom of C5, with per-edge rationale in [Section 2 (gaps from C1)](./domainspec-research.md#section-2--gaps-from-implicit-edges-c1-table-2), [Section 3 (gaps from C2)](./domainspec-research.md#section-3--gaps-from-external-frames-c2), and [Section 4 (gaps from C3)](./domainspec-research.md#section-4--gaps-from-evidence-c3).
- **Implication:** `RELATIONSHIPS.md` grows from 29 to 38 canonical edges. Two parser-side concerns surface: the `applies` and `reflects` unions are free (parser already handles `/` separator), but `coordinates-cross` brings Saga into the graph for the first time (F5).

### F5 — Saga is an edge-orphan in `RELATIONSHIPS.md`

- **Claim:** Saga is a TAXONOMY meta-concept but participates in **zero** edges in `RELATIONSHIPS.md`. Adding `coordinates-cross` is the minimum to make it graph-navigable; `listens-to` and `issues` complete the surface.
- **Evidence:** [research §Agent 5 Section 1 Observations item 5](./domainspec-research.md#section-1--audit-of-relationshipsmd-baseline) — "no edge in `RELATIONSHIPS.md` references Saga as a participant. Saga is orphan in the edge graph."
- **Implication:** This is the single most surprising graph defect found. Any KG mirror walk that starts from a Saga node returns nothing today. Fix sequence: adopt the three Saga edges in F4 first, then evaluate composability enforcement (F8).

### F6 — Silent parser aliases must be removed

- **Claim:** The parser silently rewrites `query` → `queries` and `interface` → `exposes` (`markdown-feature-docs-parser.ts:619-629`). These aliases are undocumented and create a divergence between the parser and `validate-relationships.ts`. Remove them.
- **Evidence:** [research §Agent 1 Notes item 11](./domainspec-research.md#notes) and [research §Agent 5 Section 8 Decision A](./domainspec-research.md#section-8--aliases-and-synthetic-types-decision) — "silent rewriting is the worst kind of 'helpful.' It diverges parser output from the documented catalog."
- **Implication:** C5 calls this "the most load-bearing single fix" because it is an active source of drift today. Three-step migration: warn → rewrite docs → delete the alias code.

### F7 — Synthetic types `Feature` and `Consumer` violate the meta-concept contract

- **Claim:** `Feature` and `Consumer` are created at runtime by `markdown-feature-docs-parser.ts` but are not listed in `TAXONOMY.md`. Treat `Feature` as a scope qualifier (not a meta-concept) and decide `Consumer`'s fate (promote to TAXONOMY or drop in favor of concrete types).
- **Evidence:** [research §Agent 1 Notes items 6 and 7](./domainspec-research.md#notes) (synthetic types documented) and [research §Agent 5 Section 8 Decision B](./domainspec-research.md#section-8--aliases-and-synthetic-types-decision) (split-treatment recommendation).
- **Implication:** The `produces-for` edge is the sole production user of these synthetic types. Any decision on `Consumer` cascades to the `produces-for` parser path.

### F8 — Top 5 composability-enforcement priorities

- **Claim:** Enforcement priority (next batch beyond the 8/29 already enforced): **`produces`**, **`transitions`**, **`queries`**, **`produces-for`**, **`triggers-cross`**.
- **Evidence:** [research §Agent 5 Section 7](./domainspec-research.md#section-7--composability-enforcement-recommendations) explicit "Top 5 to enforce next" line + per-edge rule sketches in the same section's table.
- **Implication:** The 8/29 enforcement ratio C1 surfaced ([research §Agent 1 Table 3](./domainspec-research.md#table-3--code-level-enforcement) and Notes item 8) becomes 13/38 if these five are added — still under half, but covers the load-bearing edges (event production, state transitions, query↔entity, cross-feature writes, cross-feature events).

### F9 — Forward-only edge design retained

- **Claim:** Do not adopt vault-style forward+inverse edge pairs. Keep `RELATIONSHIPS.md` forward-label-only. Add an optional "read-back phrase" doc column for human readers.
- **Evidence:** [research §Agent 5 Section 5](./domainspec-research.md#section-5--forward--inverse-design-choice) — four-point rationale: different ontology level than vault, parser is forward-only by design, enforcer already encodes direction via `(fromType, toType, direction)` tuples, and documentation cost.
- **Implication:** Closes a potentially expensive design path. Vault's edge convention does NOT transfer to DomainSpec.

### F10 — UI catalog is not under pressure; two small fixes only

- **Claim:** Defer all 11 new UI meta-concept candidates (Modal, Wizard, Toast, Realtime Subscription, Optimistic Update, Empty/Loading/Error, Analytics, Permission UI, Navigation/Breadcrumb). Reject **Theme/Design Token**, **Form Field**, **Route**. Adopt two non-concept fixes: extend `State Indicator` definition to cover loading/empty/error; lift HTML comments in `templates/ui-spec.md` to visible annotations.
- **Evidence:** [research §Agent 6 Per-candidate verdict table](./domainspec-research.md#per-candidate-verdict-table) (defer/reject grid with adoption-unblockers) and [research §Agent 6 Stance summary](./domainspec-research.md#stance-summary). Confirmed against [research §Agent 3 Conclusion](./domainspec-research.md#conclusion) — "UI-side meta-concepts (Modal, Wizard, Realtime hook) show no current pressure."
- **Implication:** UI work is shelved until the second non-canvas feature spec appears. Two-line edits (State Indicator definition + template annotations) are safe to apply now.

### F11 — Catalog asymmetry between backend and UI is structural

- **Claim:** All 11 UI meta-concepts share one template (`templates/ui-spec.md`); there is no `examples/*/ui-spec.md` — only one live UI spec exists (`knowledge-graph-visualization/UI-SPEC.md`). The runtime `AspectKind` enum has no UI equivalent — the KG mirror does not parse UI concepts.
- **Evidence:** [research §Agent 1 Notes items 2 and 5](./domainspec-research.md#notes) and [research §Agent 6 UI infrastructure verdict 1](./domainspec-research.md#ui-infrastructure-verdicts-orthogonal-to-candidates).
- **Implication:** Any cross-stack edge validation (F4's `derived-from`, `reflects` extension) currently has no runtime enforcement on the UI side. Adding a `ui-spec` aspect kind that indexes only the UI Concept Registry table is the proposed minimum if F4's cross-stack edges need enforcement.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-research.md` (R17).

### T1 — `Operation` and `Query` are both overloaded; the catalog blames the authors but the type system is the cause

- **Held by `TAXONOMY.md` posture`:** Operation is "a business action that changes state"; Query is "a read operation that retrieves data without side effects" ([research §Agent 1 Table 1](./domainspec-research.md#table-1--meta-concepts--categories)).
- **Reality in `docs/features/`:** `ExecutePipelineRoute` bundles five distinct cross-cutting concerns (retry / idempotency / watchdog / cancellation / telemetry) inside one Operation's rules table; `GetMirrorCards` / `GetRelationshipGraph` serve denormalized event-maintained projection output ([research §Agent 3 cases #2 and #4](./domainspec-research.md#type-abuse-cases-fileline-evidence)).
- **Evidence:** [research §Agent 3 Patterns observed](./domainspec-research.md#patterns-observed) explicitly names these as "the two clustering abuse sites" and [research §Agent 4 Q2 row "Persistence"](./domainspec-research.md#q2--new-categories) cites these three cases as "strongest evidence pressure of any proposed category."
- **Impact:** Cosmetic verdicts (rename, defer, adopt one category) miss the structural cause: Operation is doing three jobs (domain action, application orchestration, cross-cutting concern host) and Query is doing two (transient read, materialized projection). Until Aggregate Root + Use Case + Read Model land, Operation will continue absorbing whatever doesn't fit. Severity: **high** — the catalog reads as if it's the authors' fault when it is a type system gap.

### T2 — Edge catalog is half a graph

- **Held by `RELATIONSHIPS.md`:** 29 canonical edges form the typed interaction surface for the KG mirror and composability checker.
- **Reality in `governance/tags/tools/check-code-tag-composability.ts`:** Only 8 of 29 edges have composability rules ([research §Agent 1 Table 3 row for composability checker](./domainspec-research.md#table-3--code-level-enforcement) and [research §Agent 5 Section 0](./domainspec-research.md#section-0--baseline-counts-confirmation)). Saga has zero edges anywhere ([research §Agent 5 Section 1 obs. 5](./domainspec-research.md#section-1--audit-of-relationshipsmd-baseline)).
- **Evidence:** [research §Agent 1 Notes item 8](./domainspec-research.md#notes) ("21 edges have no composability enforcement") + [research §Agent 5 Section 7](./domainspec-research.md#section-7--composability-enforcement-recommendations) (top-5 list).
- **Impact:** Adding 9 new edges in F4 without simultaneously addressing enforcement worsens the ratio from 8/29 to 8/38. C4's open question #4 flagged this risk: "adding more without enforcement plan worsens the gap" ([research §Agent 4 Open questions item 4](./domainspec-research.md#open-questions-for-wave-2-strategist)). Severity: **medium** — the graph stays usable but the catalog claim "edges are canonical" weakens further.

### T3 — Pattern-as-meta-concept vs. pattern-as-navigation is the user's real ask

- **Held by user framing:** "categories like Pattern with SAGA" (Context section).
- **Reality from C4 synthesis:** The candidates that would live under "Pattern" (Outbox, Repository, Read Model, Saga, etc.) all have distinct shapes — they are not instances of a shared abstract type. What the framing actually wants is thematic navigation (group "messaging patterns" together for readers).
- **Evidence:** [research §Agent 4 Q1](./domainspec-research.md#q1--pattern-as-a-first-class-meta-concept) — "the user's 'Pattern' intuition is real but mislabeled. What the framing actually wants is a navigational grouping."
- **Impact:** Categories (F2) + an optional `pattern:` tag deliver the navigational outcome without the meta-meta-concept cost. Severity: **low** — the rejection is clean once the framing is rephrased.

### T4 — Independence as a feature, not a bug: C2 did no codebase reads

- **Held by `(default expectation)`:** Each child should ground claims in repo evidence.
- **Reality in C2 output:** C2 declares "No tool calls needed. Producing the survey directly." and "I do NOT need to read DomainSpec internals (that's C1/C3)" ([research §Agent 2 preamble](./domainspec-research.md#agent-2--external-frame-survey-enumerate-candidate-meta-concepts-from-ddd-cqrs-eip-hexagonal-and-ui-canon-that-domainspec-lacks)).
- **Evidence:** C2's verdict surface is pure literature ([research §Agent 2 Backend candidates table](./domainspec-research.md#backend-candidates) — each row cites Evans/Vernon/Fowler/Cockburn/Hohpe&Woolf/etc., not file paths). C3 and C5 supply the codebase grounding independently.
- **Impact:** Strengthens **Independence** (C2 cannot contaminate Wave 1 evidence) but means C2's "essential" tier is *frame-relative*, not *repo-relative*. C4's adoption verdicts correctly weight C3 evidence over C2 severity (Persistence wins on three C3 cases; Quality/Trust loses despite plausible C2-tier candidates). Severity: **none** — this is the dispatch working as designed.

### T5 — UI symmetry confirmed under-pressure, but the catalog asymmetry remains

- **Held by `(symmetry argument)`:** 11 UI meta-concepts mirror 14 backend ones; if backend is under pressure, UI should be too.
- **Reality in `docs/features/`:** Only one live UI spec exists, it is canvas-shaped, and C3 + C6 independently find no UI meta-concept abuse ([research §Agent 3 "No Modal/Dialog/Wizard abuse found"](./domainspec-research.md#cases-inspected-but-not-abuse) + [research §Agent 6 stance summary](./domainspec-research.md#stance-summary)).
- **Evidence:** [research §Agent 1 Notes item 5](./domainspec-research.md#notes) (single template, single live spec for all 11 UI concepts).
- **Impact:** UI is correctly deferred (F10), but the asymmetry — 11 UI concepts vs. only 1 spec exercising them — means **the next non-canvas feature is a forcing event**. The defer verdict has a half-life. Severity: **medium-long-term** — manageable today, will return.

### Cross-cutting observations

- **Convergence between C2 and C3 on three specific gaps.** Both children, working independently, surface (a) Aggregate / Aggregate Root, (b) Read Model / Projection, (c) Domain vs Integration Event distinction. C2 frames each as "essential" from canonical literature; C3 produces file:line evidence for each in the same dispatch ([research §Agent 2 Backend candidates rows for Aggregate, Read Model, Domain vs Integration Event](./domainspec-research.md#backend-candidates) + [research §Agent 3 cases #1, #4, #5, #6, #7](./domainspec-research.md#type-abuse-cases-fileline-evidence)). This is the strongest signal in the dispatch — two unrelated lenses agree.

- **C5 confirms C1 numerically.** C5's Section 0 re-reads `RELATIONSHIPS.md` and the composability checker, confirms "29 edges total, 8 enforced" matches C1's count ([research §Agent 5 Section 0](./domainspec-research.md#section-0--baseline-counts-confirmation)). This is the cross-check that gives F4 and F8 their grounding.

- **Three failure modes share one fix.** F6 (silent aliases), F7 (synthetic types), and F5 (Saga edge-orphan) are different symptoms of the same root cause: `TAXONOMY.md` and `RELATIONSHIPS.md` are treated as documentation, while the runtime parser invents its own ground truth. The fix is to make the catalogs authoritative — remove aliases, document synthetic types, add Saga edges — so that the parser becomes a consumer of the catalogs rather than a parallel source. [research §Agent 5 Section 8](./domainspec-research.md#section-8--aliases-and-synthetic-types-decision) frames this as "RELATIONSHIPS.md is the contract" violations.

- **Three "easy wins" are doc-only and have zero parser cost.** Extending `applies` (+ Workflow), extending `reflects` (+ Enum), and adding a read-back phrase column ([research §Agent 5 Section 9 items 2, 3, 8](./domainspec-research.md#section-9--open-questions)) all have "Migration cost: 0" annotations. These should ship first as low-risk demonstrations that the broader catalog rework is operationally feasible.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-research.md](./domainspec-research.md) | `derived-from` | Verbatim per-child research file this findings document synthesizes (R17 citations resolve here). |
| [../../../constitution/domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md) | `implements` | Implements R15, R16, R17, R18, R21, R22, R23 of the subagents-strategy constitution. |
| [../discovery.md](../discovery.md) | `derives` | The `domainspec-types-and-edges-validation` discovery synthesizes its decisions, alternatives, and open questions directly from this findings document. |
