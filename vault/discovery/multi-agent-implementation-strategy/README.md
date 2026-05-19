---
tags: [vault, discovery, subagents, implementation, strategy, multi-agent, anti-pattern]
node_type: discovery
is_session: false
layer: ontology, application
nature: explanatory
status: proposed
version: 0.1.0
last_updated: 2026-05-17
---

# Multi-Agent Implementation Strategy — Discovery

> Discovery file at folder root, alongside the `research/` subfolder that holds the dispatch artifacts. Mirrors the `should-close-session-design/` precedent: this README is the discovery; `research/domainspec-subagents-research.md` and `research/domainspec-subagents-findings.md` are the substrate it derives from.
>
> `veracidade` / `convicção` are intentionally omitted per `ontology-conventions.md` §Applicability — a discovery holds multiple options at varying confidence, and per-option confidence belongs inline. The findings file (`subagents-findings`) carries the load-bearing evidence; per-claim citations live there.

---

## Objective

Decide whether implementation execution (writing code from a plan) should be governed by a structured multi-agent strategy analogous to `domainspec-subagents-strategy`, and — if anything is built — name the minimal legitimate shape. **The decision: do not introduce a top-level "multi-agent implementation strategy" skill; build only two narrow concessions (review fan-out, scaffold fan-out) and file the deeper Contract → Fill → Weave design as deferred pending empirical trigger.**

---

## 1. Business Context

### Why now

The question surfaced while wrapping a 4-lens dispatch on this very topic into the `domainspec-subagents-strategy` skill. With provenance now formalized for investigation-shaped dispatches, the next natural fork is: *should the symmetric move exist for implementation?* If the answer is "yes" and we do not write it down now, a future user will reinvent it — likely as a sloppy copy of the investigation triad. The discovery exists to close that door explicitly, with the reasoning recorded, rather than leaving the gap as an attractor for bad designs.

### What's broken

Three concrete defects in the current implementation surface area, each with a location:

1. **Three coexisting implementer paradigms with no reconciling meta-skill.** `.claude/agents/domainspec-implementer.md`, `.claude/agents/domainspec-task-executor.md`, and `.claude/agents/gsd-executor.md` each define an "implementer" with different contracts (governance-gated single executor; task-runner; wave-parallel cross-plan executor). No higher-order document specifies when each applies, how they compose, or what they share. See [research/domainspec-subagents-research.md §Agent 1](./research/domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps).
2. **Direct contradiction between two skills on parallel implementers.** `.claude/skills/subagent-driven-development/SKILL.md:241` lists parallel implementers as a Red Flag; `.claude/skills/gsd-execute-phase/SKILL.md` requires parallel execution across plans. Both ship; neither cites the other; no governance document explains why both are correct in their respective domains. Cited in [research §Agent 1](./research/domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps).
3. **No convention or skill for N candidate implementations of one task.** The audit found no merge/selection step for code candidates, no isolation contract (e.g., `using-git-worktrees` is marked DISABLED in current settings — `research/domainspec-subagents-research.md` §Agent 1), and no gate that says when a "multi-implementer" approach would be appropriate. The absence is structural, not accidental.

### What stays the same

Out of scope — these continue to operate exactly as today:

- The single-executor governance-gated path: `.claude/agents/domainspec-implementer.md`, `.claude/agents/domainspec-task-executor.md`.
- GSD's wave-based across-plan parallelism: `.claude/skills/gsd-execute-phase/SKILL.md` continues to dispatch one executor per plan, with disjoint write-sets enforced at plan boundaries.
- The single-agent reviewer loop in `.claude/skills/subagent-driven-development/SKILL.md` (the "Red Flag: parallel implementers" rule explicitly remains, and is now backed by the empirical evidence collated in this discovery).
- The audit fan-out in `.claude/skills/domainspec-implement/SKILL.md:32` (investigation-shaped, already legitimate, unchanged).
- No rename, no removal, no migration of any existing implementer artifact. This discovery adds two narrowly-scoped skills (specified below) and an explicit non-build for the third (Contract → Fill → Weave).

---

## 2. Core Concepts

Three concepts. Two are to be built (narrow, uncontroversial); one is to be documented-and-deferred (load-bearing decision, recorded so it is not re-invented).

### C-1. Review fan-out skill

A skill that dispatches N reviewer agents (e.g., security, layering, performance, type-safety) over **one** implementation draft and returns a structured set of critiques. Investigation-shaped (many judges of one artifact), not implementation-shaped. Why this design: every lens — including the adversarial — agreed this is legitimate (findings F6); it is the natural extension of the existing single-draft reviewer loop in `subagent-driven-development`; it does not violate the "no parallel writers" red flag because no writing happens.

### C-2. Scaffold fan-out skill

A skill that dispatches N parallel agents to generate independent boilerplate files (one Pydantic model per schema row, one test stub per endpoint, one migration file per table) where the parent has verified **zero shared types** between fan-out children. Embarrassingly-parallel-only. Why this design: A4 named this as the one writer-fan-out case it would not argue against (findings F6); A3's Contract → Fill → Weave reduces to a trivial Contract step when the write-sets are file-disjoint by construction. The "zero shared types" gate is the load-bearing precondition — without it, the skill collapses into the failure modes documented in F5.

### C-3. Contract → Fill → Weave (deferred design)

The first-principles triad — Contract (parent freezes seams: types, signatures, file boundaries, fixtures) → Fill (N agents implement against the frame, each with a disjoint write-set) → Weave (parent, not a delegate, integrates) — is the only shape that would earn the name "multi-agent implementation strategy" without copying the investigation triad's structural mistake (findings F1, F3). It is **not built now** because the empirical record actively counter-indicates parallel writers (F5: all 28 multi-agent configurations in the UIUC comparative study degraded by −4.4% to −35.3%; 4–220× token blow-up; Cognition's "Don't build multi-agents" guidance from the Flappy Bird case), the catalog is already dense (~113 skills, ~44 agents — adding skill #114 raises noise on every other skill), and the highest-evidence intervention for implementation quality is to tighten the single-agent inner loop (F4: MetaGPT's ablation credits the Engineer's self-execute/debug step, not the role decomposition), not to add writers. Documented here so the design is not re-invented from scratch when (if) an empirical trigger reopens the question.

---

## 3. Detailed Specifications

### S-1. Review fan-out skill

**What it does.** Takes one implementation draft (a diff, a file set, or a PR) plus a list of review concerns (e.g., `[security, layering, performance, type-safety]`). Dispatches one reviewer agent per concern in parallel. Each reviewer returns a structured critique tied to file:line locations. The parent compiles a single critique report.

**When to invoke.** After an implementation draft exists and before the user is asked to review. Recommended for any diff > ~200 LOC or any change touching > 2 layers.

**What it does NOT do.** Does not write code. Does not modify the draft. Does not pick "the winning critique." Does not gate merge — the human reviewer still owns the merge decision. The skill is purely a fan-out wrapper around the existing reviewer pattern; it adds parallelism, not authority.

**Why it is safe.** The output is N independent critiques over one artifact — exactly the propose/evaluate shape that works for investigation. There is no synthesis step that has to merge incompatible artifacts (the F1 failure mode). The reviewer's job is bounded by the file:line vocabulary of the draft.

### S-2. Scaffold fan-out skill

**What it does.** Takes a manifest of independent boilerplate units (e.g., `[ModelA from schema-row-3, ModelB from schema-row-4, TestStubX for endpoint-Y]`) plus a verification that the units share zero types. Dispatches one agent per unit, each with a disjoint write-set. Returns the generated files; the parent does no merge work because there is nothing to merge.

**When to invoke.** Only when all three preconditions hold: (a) ≥ 3 units to generate, (b) each unit maps to its own file, (c) the parent has verified zero shared imports/types between units. The third precondition is the load-bearing gate — if violated, fall back to single-agent generation.

**What it does NOT do.** Does not generate interdependent code. Does not handle "create model A and model B that share a base class" — that case requires the Contract step and is explicitly out of scope. Does not generate cross-cutting code (no controllers that touch multiple models, no orchestration). Does not run any "compare and pick the best" step — every unit is independent and every output is kept.

**Why it is safe.** With zero shared types, the disjoint-write-set property is structural, not heuristic. The Contract step degenerates to the manifest itself; the Weave step is a `git add` of disjoint files. No two agents can produce conflicting decisions because there are no shared decisions to make.

### S-3. Contract → Fill → Weave (deferred — not built)

**What would earn the name.** A skill that enforces all five of: (a) ≥ 3 tasks with disjoint write-sets verified before fan-out, (b) a contract artifact (types, signatures, file boundaries, fixtures) frozen by the parent and circulated to all fillers, (c) per-fill write-set declarations the parent verifies as non-overlapping, (d) a parent-owned weave step (no delegation to a "synthesizer" agent), (e) a stop rule that aborts the fan-out and falls back to single-agent execution if any precondition drifts mid-flight. Anything less is `dispatching-parallel-agents` with a costume (findings F3).

**Why it is not built now.**

- *Empirical counter-indication.* The aggregate evidence in F5 — all 28 multi-agent configs degraded; 4–220× token blow-up; Cognition's explicit "Don't build multi-agents" guidance — is strong enough that the burden of proof sits on the proposer, not the skeptic. Building C→F→W speculatively before any internal measurement contradicts that record.
- *Catalog density.* The strategist already navigates ~113 skills and ~44 agents (see CLAUDE.md route table for the dispatch surface). Adding a 114th skill that would be invoked in fewer than 5% of implementation sessions raises the noise floor on every other skill's discoverability.
- *Higher-evidence alternative exists.* F4 and the cross-cutting observation in Analysis (the "best" multi-agent gains turn out to be verification-loop gains in disguise) both point at the same intervention: invest in executable-feedback discipline on the existing single-agent path (`subagent-driven-development`, `executing-plans`) — checkpoint discipline, plan-pinning, mid-execution signal contracts. That is where the leverage lives.

**Empirical trigger that would reopen the question.** Build C→F→W if and only if all three hold: (1) an internal measurement on ≥ 10 multi-task plans shows wall-clock-to-merged-PR for serial execution exceeds a fan-out baseline by a margin that survives the F8 review-cost penalty; (2) the worktree isolation mechanism (currently DISABLED in settings — F7) is re-enabled or replaced; (3) at least one existing dispatch concretely failed in a way C→F→W would have prevented. Until all three land, this section stays a deferred design, not a backlog item.

### S-4. Open questions

Each carries a recommendation per `discovery-writing.md`.

- **OQ-1. Where do the two new skills sit in the CLAUDE.md router?** Both are implementation-time, but neither matches the existing Route 4 (refactoring) or Route 5 (testing). *Recommendation:* add a Route 4a "Review a draft implementation" pointing at the review-fan-out skill; mention scaffold-fan-out as a sub-skill of Route 4 invokable only when the zero-shared-types gate holds. Defer router edits until the skills themselves exist.
- **OQ-2. Does the worktree-DISABLED setting need revisiting before either skill ships?** Neither C-1 nor C-2 requires worktrees (C-1 reads one draft; C-2 writes disjoint files). *Recommendation:* leave worktrees DISABLED. Re-open only if/when the S-3 empirical trigger fires.
- **OQ-3. Should the review fan-out skill be allowed to dispatch from inside `domainspec-implementer`, or only from a higher-level orchestrator?** Dispatching from inside the implementer creates a sub-agent depth ≥ 2 within an implementation flow, which the current strategy budget (R13: depth 2, breadth 5, total 10) accommodates but did not anticipate. *Recommendation:* allow it, but cap depth at 2 within any implementation flow; the implementer may invoke review-fan-out once, but the resulting reviewers cannot themselves fan out.
- **OQ-4. Does the existence of this discovery oblige a corresponding edit to `domainspec-subagents-strategy-constitution.md` to acknowledge that the strategy intentionally does NOT extend to implementation?** The constitution currently governs investigation dispatches; silence on implementation could be read as "not yet covered" rather than "deliberately out of scope." *Recommendation:* yes — propose an `## Applicability` note to the constitution clarifying that implementation execution is governed by `subagent-driven-development` and `gsd-execute-phase`, and that any future "multi-implementer" strategy must satisfy the S-3 empirical trigger before being drafted. Handle via the constitution's amendment process, not by sweeping inline.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [research/domainspec-subagents-findings.md](./research/domainspec-subagents-findings.md) | `derives-from` | Synthesis of the 4-lens dispatch this discovery promotes. Every load-bearing claim in §1–§3 traces back to a finding (F1–F8) or analysis tension (T1–T4) in that file. |
| [research/domainspec-subagents-research.md](./research/domainspec-subagents-research.md) | `derives-from` | Per-child raw research (repo audit, external prior-art, first-principles, adversarial) that the findings file cites. Transitive provenance recorded explicitly so the discovery's chain is readable from this node alone. |
| [../../constitution/domainspec-subagents-strategy-constitution.md](../../constitution/domainspec-subagents-strategy-constitution.md) | `cites` | The investigation-time strategy this discovery deliberately does NOT mirror for implementation. The analogy was considered (findings T1) and rejected (F1, F5); the constitution is cited so a reader can verify the analog was understood before being declined. See OQ-4 for the proposed reciprocal `## Applicability` note. |

---

## Source dispatch

This discovery is the Step 7 promotion of `dispatch_id: 2026-05-17-multi-agent-implementation-strategy-01`. Spec at `vault/snapshots/dispatches/2026-05-17-multi-agent-implementation-strategy-01-spec.yaml`; telemetry event `subagent-strategy.dispatched` emitted to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` at `2026-05-18T02:45:11Z`. User explicitly confirmed promotion to knowledge-scope (vault target) and confirmed stance option C (build the two narrow concessions, defer C→F→W) before this file was written.
