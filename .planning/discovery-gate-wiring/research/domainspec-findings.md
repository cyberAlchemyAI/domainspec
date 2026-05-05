---
tags: [domainspec, discovery-gate-wiring, findings, subagents-findings]
node_type: subagents-findings
is_session: false
dispatch: discovery-gate-wiring-2026-05-03
mode: task-fan-out
children: 5
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-03
---

# Subagents Findings — `discovery-gate-wiring-2026-05-03`

> Synthesis of the 5-way task-fan-out implementation dispatch wiring the discovery-before-spec soft gate across the DomainSpec agent/skill stack. Implementation-quality findings (not factual claims). Every load-bearing claim cites a passage in [`domainspec-research.md`](./domainspec-research.md) per R17.

---

## Context

User is wiring the discovery-before-spec gate across the DomainSpec agent/skill stack. Four design decisions are settled: soft gate everywhere with `--skip-discovery <reason>` flag override, scope-classification bounces to `domainspec-interviewer`, brownfield translation auto-creates a placeholder discovery, and downstream consumers (planner, verifier, interviewer) cite discovery as first-class without blocking. The four tiers plus the brownfield case touch independent files and have no inter-tier dependency, which made it a clean parallel fan-out.

## Goal

Apply all five tier changes so that any DomainSpec entrypoint that authors a spec/plan/implements code recommends discovery-first when none exists, surfaces the flag for override, and offers interviewer bounce for scope classification — and so that brownfield translation auto-creates placeholder discoveries.

---

## Dispatch Record (R18)

### Mode and shape

- **Mode**: task-fan-out (R19)
- **Dispatch ID**: `discovery-gate-wiring-2026-05-03`
- **Children**: 5, all parallel, single-message dispatch (R8)
- **Working folder**: `.planning/discovery-gate-wiring/`
- **Recursion budget**: defaults (depth 2 / breadth 5 / total 10) — none used; flat fan-out only.

### Per-child table

| ID | Concern | Model | Difficulty justification | Token budget | Output shape (R18) |
|----|---------|-------|--------------------------|--------------|--------------------|
| C1 | spec-gate (precondition in spec-writer agent + spec-feature skill) | sonnet-4.6 | Two parallel files, identical 5-substep gate, mechanical insertion. | ~8k declared | Structured report: files touched / per-file diff / flag plumbing / frontmatter writeback / concerns |
| C2 | pipeline-gate (Step 0 in domainspec-pipeline skill) | sonnet-4.6 | Single file, but flag must propagate to ~10 subordinate skills — fan-out plumbing. | ~8k declared | Structured report: files touched / diff summary / flag plumbing / invocation example / concerns |
| C3 | orchestrator-route (new rule in routing-policy) | sonnet-4.6 | Single rule insertion with renumber; semantic placement decision. | ~6k declared | Structured report: file touched / diff summary / compatibility check / concerns |
| C4 | downstream-consumers (planner + verify-feature + interviewer) | sonnet-4.6 | Three files, three distinct integration patterns (planner readiness, verifier coverage, interviewer per-feature row). | ~8k declared | Structured report: files touched / per-file diff / cross-file consistency / concerns |
| C5 | brownfield-placeholder (auto-create in brownfield-translation skill) | sonnet-4.6 | Single file but novel artifact (placeholder schema + body sections + promotion path). | ~6k declared | Structured report: file touched / diff summary / placeholder schema / body section list / concerns |

### Sequencing

Single-message dispatch, all 5 children launched in parallel (R8). No inter-child dependency by design — the strategist established in Step 1 that the four tiers + brownfield case touch independent files. Longest child returned at ~108s; all 5 returned within ~110s.

### Recursion budget actually used

0 of 10. No child re-dispatched.

### Actual spend

| Child | Declared budget | Actual tokens | Ratio |
|-------|-----------------|---------------|-------|
| C1 | ~8k | ~33k | 4.1× |
| C2 | ~8k | ~52k | 6.5× |
| C3 | ~6k | ~38k | 6.3× |
| C4 | ~8k | ~58k | 7.3× |
| C5 | ~6k | ~41k | 6.8× |
| **Total** | **~36k** | **~222k** | **6.2×** |

### Four-component grade (R21 / R22)

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Coverage** `(judgment)` | high | All four user-confirmed decisions land in the diff: soft gate everywhere ([research §Agent 1](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill), [§Agent 2](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill), [§Agent 3](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)); `--skip-discovery <reason>` override surfaced in C1/C2/C3 ([research §Agent 1 step 0.5](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill), [§Agent 2 flag plumbing](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill), [§Agent 3 rule 4 text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)); interviewer bounce wired into orchestrator routing ([research §Agent 3](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)) and into C4 interviewer Step 9 readiness ([research §Agent 4 interviewer block](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)); brownfield auto-create lands in Stage 3 step 8 with placeholder schema ([research §Agent 5 placeholder schema](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). |
| **Independence** `(judgment)` | high | Each child stayed in its assigned file set — no overlap across the 5 returns. C1 touched only spec-writer agent + spec-feature skill ([research §Agent 1](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill)); C2 only the pipeline skill ([research §Agent 2](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)); C3 only the orchestrator agent ([research §Agent 3](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)); C4 the three downstream consumers and explicitly noted "C4 owns the actual interviewer change" against C5 ([research §Agent 5 forward-reference note](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)); C5 only the brownfield skill ([research §Agent 5](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). No vault writes from any child. |
| **Fidelity** `(judgment)` | medium-high | Diffs match the brief's canonical schema (`--skip-discovery <reason>`, `discovery_waived: true`, `discovery_waiver_reason`) — verified across C1/C2/C3 verbatim ([research §Agent 1 step 0.5](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill), [§Agent 2 diff summary](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill), [§Agent 3 rule text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)). Demoted from "high" because C4 drifted on the per-feature discovery path, using `docs/features/{feature}/DISCOVERY.md` instead of the constitution-R15-compatible `docs/features/<feature>/discovery/<slug>.md` used by C1/C2/C3/C5 ([research §Strategist post-dispatch verification](./domainspec-research.md#strategist-post-dispatch-verification-r11)). Fix applied inline by the strategist before research-writer ran. |
| **Cost-discipline** `(mechanical)` | 6.2× over budget | Declared total ~36k; actual ~222k. Per-child overruns range 4.1× (C1) to 7.3× (C4); see actual-spend table above. |

---

## Findings

### F1 — Coverage: all four decisions are wired

The five children, taken together, deliver each of the four user-confirmed decisions from Step 2:

- **Soft gate everywhere**. Spec-writer agent inserts a 5-substep step 0 that HALTs with a recommendation block when no discovery is found, never blocks ([research §Agent 1](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill)). The pipeline skill mirrors this with a Step 0 between Pre-flight and Step 1 ([research §Agent 2 diff summary](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)). The orchestrator routes "spec / plan / implement" intents through a new rule 4 that surfaces a recommendation rather than auto-routing ([research §Agent 3 rule 4 text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)). Planner explicitly declares it "only flags discovery state; it never blocks on it" ([research §Agent 4 planner block](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)). Verifier explicitly preserves verdict independence: "discovery is reported as an audit signal, never as the sole blocker" ([research §Agent 4 verifier block](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)).
- **`--skip-discovery <reason>` override**. Surfaced in spec-feature skill argv ([research §Agent 1 flag plumbing](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill)), pipeline argument-hint frontmatter and forward-propagated to ten subordinate skills ([research §Agent 2 flag plumbing](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)), and named in the orchestrator's recommendation block ([research §Agent 3 rule 4 text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)).
- **Interviewer bounce for scope classification**. Named in the orchestrator's recommendation block alongside the override ([research §Agent 3 rule 4 text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)), and reflected in the interviewer's Step 9 readiness category that distinguishes `✅ has discovery` / `⚠️ discovery_waived` / `❌ no discovery / no waiver` ([research §Agent 4 interviewer block](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)).
- **Brownfield auto-create**. Stage 3 step 8 of brownfield-translation looks up both vault and per-feature paths and auto-creates a placeholder at `docs/features/<feature>/discovery/<slug>.md` with a five-key frontmatter (`node_type / status: placeholder / created_by / created / feature`) and five body sections (Observed Behavior / Decisions / Constraints / Open Questions for Human Review / Promotion Path) ([research §Agent 5 placeholder schema and body section list](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)).

### F2 — Consistency: canonical schema held across 4 of 5 children, drift in 1

Four of five children used the canonical schema verbatim:

- C1 stamps `discovery_waived: true` and `discovery_waiver_reason: "<one-line>"` into SPEC.md frontmatter via spec-writer step 0.4 ([research §Agent 1 frontmatter writeback](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill)).
- C2 propagates `--skip-discovery "<reason>"` to subordinate skills and names spec-feature as the actual frontmatter writer ([research §Agent 2 flag plumbing](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)).
- C3 mirrors the canonical override phrase verbatim in the routing rule ([research §Agent 3 rule 4 text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)).
- C5 enforces canonical placeholder schema and forbids vault writes for brownfield ([research §Agent 5 step 8 description](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)).

C4 drifted on the per-feature discovery path: it cited `docs/features/{feature}/DISCOVERY.md` (single file at feature root) across all three of its files, while C1/C2/C3/C5 used the subfolder pattern `docs/features/<feature>/discovery/<slug>.md` ([research §Strategist post-dispatch verification](./domainspec-research.md#strategist-post-dispatch-verification-r11)). C4's own self-assessed "Cross-file consistency" claim ("All three files use the identical schema… discovery file at canonical path `docs/features/{feature}/DISCOVERY.md`. No drift") was internally consistent but cross-child inconsistent ([research §Agent 4 cross-file consistency](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)).

### F3 — Drift caught and fixed inline (R11 working)

The strategist's post-dispatch verification (R11) caught C4's path divergence by grep + spot-read against the actual files ([research §Strategist post-dispatch verification](./domainspec-research.md#strategist-post-dispatch-verification-r11)). User decided to canonicalize on the `discovery/<slug>.md` subfolder pattern (matches constitution R15), and the strategist applied the inline fix to all six C4 references across three files before invoking research-writer. This is the load-bearing finding for the dispatch process: fan-out without a verification pass would have shipped the divergence into downstream artifacts. The verbatim C4 returns in research.md still reference the old `DISCOVERY.md` path ([research §Strategist post-dispatch verification, final note](./domainspec-research.md#strategist-post-dispatch-verification-r11)) — that's deliberate, since the verbatim file preserves what the agent returned, not what now lives on disk.

### F4 — Open follow-ups (real, from children's Concerns sections)

Real follow-ups (decisions still owed, not just self-flagging):

- **`--skip-discovery` reason-missing edge case** — C2 documents the flag as requiring a one-line reason but treats a missing reason as malformed implicitly, not by an explicit re-prompt rule ([research §Agent 2 concerns](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)). User-facing UX gap: do we re-prompt, fail loudly, or silently waive with a default? Decision pending.
- **Pipeline Step 0 substep numbering quirk (`3c–3f` under a "Step 0" header)** — C2 chose this rather than renumber Pre-flight to avoid breaking cross-references ([research §Agent 2 concerns](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)). Cosmetic but reader-confusing. Worth a follow-up renumber pass when the next pipeline edit is already in flight.
- **Vault discovery topic-prefix wildcard glob in pipeline** — C2 instructs the implementer to wildcard-glob the topic segment of `vault/discovery/<topic>-definitions/<slug>.md` since topic is unknown at pipeline entry ([research §Agent 2 concerns](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)). Substantive: the wildcard could match multiple discoveries with the same slug across topics. Pending: define disambiguation or constrain the search space.
- **Orchestrator rule numbering (4 → 4-new + renumber 4/5 to 5/6)** — C3 flagged that the strategist may prefer a sub-letter scheme (`3a`) to preserve original numbers in any external doc that cites them by number ([research §Agent 3 concerns](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)). Cosmetic but auditable.
- **Brownfield slug derivation rule unspecified** — C5 used `<slug>` as a placeholder and did not encode a derivation rule, deferring to spec-writer's convention ([research §Agent 5 concerns](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). Substantive: brownfield can't actually create the placeholder without a deterministic slug. Decision owed: slug == feature name, or something else?
- **Brownfield step renumber risk (old step 10 → 11)** — C5 did not search for external docs that reference "step 10" by number ([research §Agent 5 concerns](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). Cosmetic; grep is cheap.

Cosmetic-only (not real follow-ups):

- C1's "step 0 vs renumber" choice ([research §Agent 1 concerns](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill)) — same trade-off as C2/C3/C5; consistent across the dispatch.
- C1's "wording variation (briefing vs argv)" between agent and skill ([research §Agent 1 concerns](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill)) — semantically identical, surface variation only.
- C4's `<context>` slot choice for planner contract ([research §Agent 4 concerns](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)) — preserves file conventions; no follow-up needed.

---

## Analysis

### A1 — Independent fan-out worked because the file partition was clean

The strategist's Step 1 partitioning (four tiers + brownfield case, each touching disjoint files) was load-bearing for parallel-safety. C1's two files (spec-writer agent + spec-feature skill), C2's one file (pipeline), C3's one file (orchestrator), C4's three files (planner + verify-feature + interviewer), and C5's one file (brownfield-translation) form a partition with no overlap ([research §Agent 1 files touched](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill), [§Agent 2 files touched](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill), [§Agent 3 file touched](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy), [§Agent 4 files touched](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer), [§Agent 5 file touched](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). Single-message dispatch returned in ~110s wall-clock.

### A2 — But schema-level drift is invisible to file partitioning

C4's drift on `DISCOVERY.md` vs `discovery/<slug>.md` ([research §Strategist post-dispatch verification](./domainspec-research.md#strategist-post-dispatch-verification-r11)) is the canonical example of a class of risk that file-level independence does not protect against: the *path conventions* that cross children must agree even though no two children write the same file. The shared contract in the dispatch shape (R9, locked before fan-out) declared the canonical names for the flag and the frontmatter keys ([research §Dispatch shape, shared contract](./domainspec-research.md#dispatch-shape)) — but did *not* lock the discovery file path convention. C4 inferred its own path; C1/C2/C3/C5 inferred a different one (the constitution-R15-compatible subfolder). Both inferences were locally reasonable. The R11 verification pass caught it, which is the system working as designed — but the cheaper fix is to lengthen the shared-contract checklist so the next fan-out locks all path conventions in Step 1.

### A3 — The token overrun is ~6× and is not explained by the work delivered

Declared total ~36k; actual ~222k (6.2×). Per-child overruns are remarkably uniform — 4.1× to 7.3× — which suggests the overrun is structural to how children consume context (reading multiple existing files, the constitution, the strategy proposal) rather than to any one child's complexity ([Dispatch Record, actual spend table above]). The implementation work itself was bounded: C3 inserted one rule ([research §Agent 3 diff summary](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)), C5 inserted one step plus renumbered three downstream steps ([research §Agent 5 diff summary](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). The signal: budget proposals at the strategy stage should account for child-side context loading, not just child-side authoring volume. This is a cost-discipline finding; it is `(mechanical)`, not `(judgment)`.

### A4 — Forward references between children worked without coordination

C5 wrote a forward-reference line that "the interviewer's readiness summary distinguishes `status: placeholder` from `status: active`… (C4 owns the actual interviewer change)" ([research §Agent 5 diff summary, forward-reference line](./domainspec-research.md#agent-5--brownfield-placeholder-auto-create-in-brownfield-translation-skill)). C4 independently delivered a Step 9 with three states `✅ has discovery` / `⚠️ discovery_waived` / `❌ no discovery / no waiver` ([research §Agent 4 interviewer block](./domainspec-research.md#agent-4--downstream-consumers-planner--verify-feature--interviewer)) — but C4's three states do *not* include `status: placeholder` as a fourth distinct row. This is a real semantic gap: brownfield-created placeholders satisfy "discovery exists" (no waiver row fires) but their content is the auto-stub, not human-reviewed content. The interviewer's `✅ has discovery` row will currently report green for a stub. This is a follow-up that wasn't visible to either child because each was working in isolation; it surfaces only at synthesis time. Decision owed: does the interviewer Step 9 add a fourth state `🟡 has placeholder discovery (auto-created, awaiting promotion)`?

### A5 — The orchestrator's gate is the only one that surfaces the interviewer bounce

C3's rule 4 is the only place where the user-facing recommendation explicitly mentions "or invoke `domainspec-interviewer` for help classifying scope" ([research §Agent 3 rule 4 text](./domainspec-research.md#agent-3--orchestrator-route-new-rule-in-routing-policy)). The recommendation blocks in C1 (spec-writer step 0.5) and C2 (pipeline Step 0) cite the interviewer-bounce per the dispatch shared contract ([research §Agent 1 concerns, "four-line recommendation block"](./domainspec-research.md#agent-1--spec-gate-precondition-in-spec-writer-agent--spec-feature-skill), [§Agent 2 diff summary, "verbatim soft-recommendation block"](./domainspec-research.md#agent-2--pipeline-gate-step-0-in-domainspec-pipeline-skill)) — but the verbatim text of these blocks is not reproduced in research.md, so we cannot re-verify from the research file alone whether all three sites use identical recommendation wording. A spot-check pass on the actual files is owed if the user wants verbatim consistency across all three entrypoints. Cosmetic if the wording is "close enough"; semantic if the entrypoints surface different override paths.
