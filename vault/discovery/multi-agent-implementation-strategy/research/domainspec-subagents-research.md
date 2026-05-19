---
tags: [subagents, dispatch-artifact, subagents-research, multi-agent-implementation-strategy]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-16
dispatch_id: 2026-05-17-multi-agent-implementation-strategy-01
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `multi-agent-implementation-strategy`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.

---

## Dispatch metadata

- dispatch_id: 2026-05-17-multi-agent-implementation-strategy-01
- spec path: `vault/snapshots/dispatches/2026-05-17-multi-agent-implementation-strategy-01-spec.yaml`
- spec_hash: 41e77b07654df871a522aed57b552043654385970f5d1cbee9c97cde0d94b3c6
- corpus_hash_at_emit: 58af094d89ce121cade1dac1459e32f63481967e2bcda7ae8ff046e2d12eccbf
- telemetry: appended to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` at 2026-05-18T02:45:11Z
- mode: task-fan-out
- 4 agents, all sonnet, parallel
- validator verdict: accept-with-bootstrap-override (scope: spec-only — retroactive wrap)

---

## Context

User asked whether implementation execution (writing code from a plan) should benefit from a structured multi-agent strategy analogous to `domainspec-subagents-strategy`. The parent dispatched 4 parallel investigators (`task-fan-out`, `heuristic_row: flat-fanout`) covering: repo-internal audit, external prior art, first-principles design, and adversarial critique. This research file is the verbatim assembly; the findings file (next step) will cite back to it.

## Goal

Determine whether implementation execution (writing code from a plan) should be governed by a structured multi-agent strategy, and if so, name its minimal legitimate shape.

---

## Agent 1 — Repo-internal audit: existing implementation-orchestration artifacts and gaps

# Repo-Internal Audit: Existing Implementation Orchestration

## Claim (one sentence)

The repo already has *two* implementation paradigms (a "single executor under interactive gates" path via `domainspec-implementer` / `domainspec-task-executor`, and a "flat wave-parallel plan executor" path via `gsd-execute-phase` → `gsd-executor`), plus a generic two-stage review loop from `subagent-driven-development`; what is absent is any **nested propose/evaluate/synthesize** structure for the *act of writing code itself* — i.e. an analog of `nested-subagents-strategy` whose units are implementation candidates rather than investigation lenses.

## What exists today

**A. Single-executor, governance-gated path (DomainSpec native).**
- `.claude/skills/domainspec-implement/SKILL.md` dispatches a single `domainspec-implementer` agent. Its only parallel fan-out is auditors — step 3 runs `domainspec-audit-alignment` and `domainspec-audit-layering` "as **parallel subagents**" *before* coding starts (`domainspec-implement/SKILL.md:32`, `domainspec-implementer.agent.md:58`). Coding itself is serial.
- `.claude/skills/domainspec-task-session/SKILL.md` + `domainspec-task-executor.agent.md` execute *one* plan task interactively: decision packs → gate check → execute → sync. No subagent fan-out for the implementation step; `Task` is in the toolset but the process is single-threaded.
- `.claude/skills/domainspec-execute-phase-bridge/SKILL.md` is a thin adapter from DomainSpec implementation to the GSD path (5 lines of process, line 29 returns "implementation summary with concept traceability").

**B. Flat wave-parallel path (GSD).**
- `.claude/skills/gsd-execute-phase/SKILL.md:3` advertises **"wave-based parallelization"**: an orchestrator discovers plans, groups them into waves by `depends_on`, and spawns one `gsd-executor` subagent per plan in a wave. This is the *only* place in the repo where multiple implementer subagents actually run in parallel against the same feature.
- `gsd-executor.agent.md` is heavyweight (~500 lines) — it owns deviation rules (auto-fix bugs / add missing critical functionality / auto-fix blocking issues / ask about architectural changes), TDD execution, atomic per-task commits, checkpoint protocol, self-check, and STATE.md updates. Each executor is a *full plan* executor, not a candidate-generator.
- Parallelism here is **across plans within a wave**, not across alternative implementations of the same plan.

**C. Generic two-stage review (superpowers).**
- `subagent-driven-development/SKILL.md` defines: dispatch one implementer → spec-compliance reviewer → code-quality reviewer → loop until both ✅. Reviews are explicit but the implementer is singular per task (Red Flag at line 240: "Dispatch multiple implementation subagents in parallel (conflicts)").
- `dispatching-parallel-agents/SKILL.md` is the flat-dispatch primitive: "one agent per independent problem domain" — explicitly *not* same-problem-from-N-angles.

**D. Overlap and conflict.**
- Three coexisting implementer roles: `domainspec-implementer` (DomainSpec-native), `domainspec-task-executor` (one-task interactive), `gsd-executor` (plan executor under GSD). `domainspec-implementer` step 5 can delegate to `gsd-execute-phase` via the bridge, so the call graph already crosses paradigms.
- `subagent-driven-development` explicitly **forbids** parallel implementers; `gsd-execute-phase` explicitly **requires** them (across plans). The two regimes are not reconciled by any meta-skill.
- `nested-subagents-strategy/SKILL.md` is *investigation-only*: line 30 says "structured to drop into a `lenses/NN-*.md` file"; line 52 names the output "the surviving claim (one sentence)" — there is no notion of producing executable code, no merge step, no test-equivalence gate.

## What the gap looks like

A future "implementation strategy" skill would have to provide things **no existing artifact specifies**:

1. **No convention for *N independent implementations of the same task*.** Both DomainSpec paths assume one executor; GSD parallelizes only across pre-partitioned plans. There is no "propose 3 candidate implementations of TASK-X" mode anywhere.
2. **No merge/selection step for code candidates.** `nested-subagents-strategy` Step 3 says the parent writes a *one-sentence claim*; nothing in the repo describes how a parent would pick or fuse competing diffs/branches into a single committed change. `finishing-a-development-branch` handles *post-completion* integration, not *across-candidate* selection.
3. **No worktree/isolation contract for parallel coders.** `using-git-worktrees` exists upstream and is marked DISABLED in the current settings ("Do NOT use this skill unless the user explicitly asks for worktree isolation"). Parallel implementation candidates would need isolation; the disabling is a load-bearing obstacle.
4. **No shared "evaluate wave" for code.** Reviews exist (`spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md`) but operate on one implementation. There is no rubric for *comparative* evaluation across candidates (e.g., "which of these 3 diffs best satisfies TEST-SPEC + layer law + minimal blast radius").
5. **No gate for when to use the strategy.** `nested-subagents-strategy` Step 0 has a sharp triage ("load-bearing", "single context insufficient", "cost of wrong synthesis > cost of two waves"). The analogous predicate for code — "is this task worth 3x token cost for variant exploration?" — is undefined. Without it, the skill collapses into either flat dispatch or wasteful theatre.
6. **No place in the existing CLAUDE.md router.** Route #4 ("Refactoring or Writing Code") points at `.claude/skills/custom/code.md`, which is purely a dispatch table of fundamentals — it has no entry for orchestration strategy at all.
7. **No artifact contract.** Investigations land in `vault/discovery/<slug>/lenses/`. Implementations land in commits. The implementation-strategy analog would need to define what a "candidate" is materially (branch? worktree? patch file? in-memory diff?) — the repo has no template.

## Load-bearing evidence

- `nested-subagents-strategy/SKILL.md:10` — *"The flat skill says 'dispatch N agents on N independent problems.' This skill says 'dispatch N agents on the *same* problem from N angles, then dispatch M agents to read their outputs against each other.'"* — this is exactly the move missing for implementation.
- `gsd-execute-phase/SKILL.md:3,11` — *"Execute all plans in a phase with wave-based parallelization … Orchestrator stays lean: discover plans, analyze dependencies, group into waves, spawn subagents, collect results."* — parallelism is across independent plans, not across candidate implementations of one plan.
- `subagent-driven-development/SKILL.md:241` — *"Dispatch multiple implementation subagents in parallel (conflicts)"* listed under **Red Flags**. The canonical guidance actively forbids the move a new strategy would need to make safe.
- `domainspec-implement/SKILL.md:32` — *"If feature code already exists, run `domainspec-audit-alignment` and `domainspec-audit-layering` as **parallel subagents**"* — the *only* parallelism the DomainSpec path uses today is for audit, not for code generation.
- `domainspec-task-executor.agent.md:30-38` (entire `<execution>` block) — fully serial: decisions → gate → execute → sync. No N-way structure available even when warranted.

## Open questions

(Handed to first-principles, prior-art, and adversarial angles.)

1. **Is parallel code generation actually beneficial enough to pay for the merge cost?** The repo cannot answer; this is the falsifiable core. (→ first-principles + adversarial)
2. **Does external prior art exist?** AlphaCode-style sampling, SWE-bench multi-agent results, "best-of-N" coding — does anyone outside this repo do "nested implementation waves" with measurable wins? (→ prior-art)
3. **What is the right unit of candidate divergence?** Approach (TDD vs spike-then-test), abstraction choice (functional vs OO adapter), file partitioning, library choice? The repo has no taxonomy. (→ first-principles)
4. **How does the worktree-DISABLED setting interact?** Was that decision made knowing parallel implementers would be needed later, or does it foreclose the design? (→ user / repo history — visible in `.claude/settings.json` `M` mark in git status)
5. **What happens to GSD's atomic-commit-per-task contract under N candidates?** `gsd-executor.agent.md:306-348` is built around one commit per task; N parallel candidates would require either N branches or a candidate-selection-then-commit flow. (→ first-principles)
6. **Does `domainspec-subagents-strategy` (the 7-step research lifecycle) already absorb this case** if the "research" being conducted is "which implementation works"? Or is conflating research with implementation a category error? (→ adversarial — likely the latter, since R5 forbids children writing files.)

---

## Agent 2 — External prior art: empirical evidence on multi-agent code generation

# External Prior Art: Multi-Agent Implementation Patterns

## Claim (one sentence)
The external evidence converges on a narrow positive verdict: structured multi-agent *implementation* helps when it splits **reasoning from mechanical translation** (Aider's Architect/Editor), **generation from verification** (AgentCoder, Reflexion, CodeAct), or **parallelizes truly independent read/exploration tasks** — but it consistently *hurts* when used for parallel **writing** of interdependent code, where coordination cost and conflicting implicit decisions dominate.

## Patterns that recur across frameworks

1. **Architect / Editor split** (Aider) — one model reasons about the change in prose, a cheaper/faster model translates to diffs. Decouples "what to change" from "how to format the edit." +3 to +9.6 pp on Aider's polyglot benchmark.
2. **Generate → Test → Refine loop** (AgentCoder, Reflexion, Self-Refine, OpenHands CodeAct) — a writer agent emits code, a test/critic agent runs it, a refiner ingests failure traces. Ablations show the *executable feedback signal* is what carries the gain, not the agent count.
3. **Single-threaded linear agent with compression** (Cognition/Devin's stated default) — explicit rejection of parallel writers; long horizons handled by context compression instead of sub-delegation.
4. **Orchestrator + read-only parallel subagents** (Anthropic's research system, Claude Code subagents) — parallelism is allowed for *exploration/research* but the orchestrator owns all writes. Anthropic explicitly frames this as a read/write asymmetry.
5. **SOP-mimicking role pipeline** (MetaGPT, ChatDev — PM → Architect → Engineer → QA) — high marketing salience, mixed empirical value: gains attributable largely to the in-loop self-correction step, not to the role decomposition itself.
6. **Scaffold-over-roles** (Augment, SWE-agent, IBM iSWE-Agent) — top SWE-bench scaffolds invest in tool design and context management for a *single* execution agent rather than role multiplication; same model spans ~5 pp purely on scaffold differences.

## Empirical evidence (with citations)

- **Aider Architect/Editor**: o1-preview + Sonnet hits 82.7% vs 79.7% single-model; o1-mini + GPT-4o jumps from 61.1% → 70.7%. Pairing a model with *itself* still helps (Sonnet 77.4 → 80.5). [aider.chat/2024/09/26/architect](https://aider.chat/2024/09/26/architect.html)
- **Anthropic research system**: Opus-4 lead + Sonnet-4 subagents beat single-Opus-4 by 90.2% on *internal research eval*. Crucially Anthropic notes "read actions are inherently more parallelizable than write actions" — they do **not** claim this transfers to code-writing. [anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)
- **MetaGPT**: 85.9% Pass@1 HumanEval; ablation shows the Engineer's self-execute/debug step contributes +4.2 pp on HumanEval and +5.4 pp on MBPP — i.e., the executable critic loop, not the PM/Architect roles, is doing the work. [arxiv:2308.00352](https://arxiv.org/pdf/2308.00352)
- **Reflexion / Self-Refine**: Reflexion gives ~+8 pp absolute over episodic baselines on code tasks; Self-Refine ablation shows generic critique (no agent) collapses gains (27.5 → 24.8 on code optimization), implying the *specificity* of feedback matters more than the agent boundary. [arxiv:2303.11366](https://arxiv.org/pdf/2303.11366), [openreview S37hOerQLB](https://openreview.net/pdf?id=S37hOerQLB)
- **SWE-bench scaffolding spread**: three different agent systems running the same Opus 4.5 model land between 50.2% and 55.4% — the architectural choice that matters is *scaffold/context management*, not number of agents. Top single-agent scaffold (Augment) hits 72% pass@1 without best-of-N. [swebench.com](https://www.swebench.com/), [awesomeagents.ai/leaderboards/swe-bench](https://awesomeagents.ai/leaderboards/swe-bench-coding-agent-leaderboard/)

## Negative results

- **All-degrade study**: a recent comparative study found **all 28 multi-agent configurations degraded relative to single-agent baselines, −4.4% to −35.3%**, attributing it to coordination overhead. [augmentcode.com/guides/single-agent-vs-multi-agent-ai](https://www.augmentcode.com/guides/single-agent-vs-multi-agent-ai)
- **Token blow-up**: UIUC analysis: multi-agent systems use **4–220× more tokens** than single-agent equivalents for the same task class. [same source]
- **Cognition / Devin**: explicit guidance "Don't build multi-agents" — the Flappy Bird case study shows two parallel writers producing mutually incompatible artefacts (Mario background + non-game-asset bird) because implicit design decisions diverged. Recommends single-threaded agent + history compression. [cognition.ai/blog/dont-build-multi-agents](https://cognition.ai/blog/dont-build-multi-agents)
- **Task-shape sensitivity**: Google Research found multi-agent gives +81% on parallelizable tasks but **−70% on sequential ones**; code-writing is mostly sequential/stateful. [referenced in augmentcode guide]
- **MAS failure taxonomy**: 13.2% of multi-agent failures = reasoning/action mismatch; 7.4% = task derailment; 6.8% = proceeding on wrong assumption rather than asking — failure modes intrinsic to context isolation, not fixable by better prompts. [same source]

## Load-bearing references

- [aider.chat/2024/09/26/architect.html](https://aider.chat/2024/09/26/architect.html) — the strongest case for a *minimal* 2-role split with quantified gains.
- [cognition.ai/blog/dont-build-multi-agents](https://cognition.ai/blog/dont-build-multi-agents) — the canonical anti-multi-agent argument for code-writing; load-bearing for negative case.
- [anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system) — establishes the read/write asymmetry; explicitly *does not* generalize to writers.
- [arxiv.org/pdf/2308.00352](https://arxiv.org/pdf/2308.00352) (MetaGPT) — best peer-reviewed claim of role-decomposition benefit, but ablation points credit to the execute-debug loop.
- [arxiv.org/pdf/2303.11366](https://arxiv.org/pdf/2303.11366) (Reflexion) — verbal RL / critic-loop, repeatedly the load-bearing ingredient in any "multi-agent" win.
- [arxiv.org/html/2312.13010v3](https://arxiv.org/html/2312.13010v3) (AgentCoder) — counter-example where a *small* 3-agent setup (programmer/test designer/test executor) does beat single-agent at lower cost.
- [arxiv.org/abs/2407.16741](https://arxiv.org/abs/2407.16741) (OpenHands) — CodeAct shows the value is in execution-grounded feedback, not role splitting.
- [swebench.com](https://www.swebench.com/) — leaderboard reality check: top single-agent scaffolds beat most multi-agent submissions.
- [augmentcode.com/guides/single-agent-vs-multi-agent-ai](https://www.augmentcode.com/guides/single-agent-vs-multi-agent-ai) — aggregates the strongest negative-result citations.
- [blog.langchain.com/how-and-when-to-build-multi-agent-systems/](https://blog.langchain.com/how-and-when-to-build-multi-agent-systems/) — orchestration-pattern catalog with the "supervisor vs. swarm" framing.

## Open questions

- No external benchmark cleanly isolates **propose-wave / evaluate-wave / synthesize** (the nested-subagents-strategy shape) applied to *implementation* — only to research. Whether the wave structure transfers is empirically open.
- The cost-adjusted picture is murky: most papers report only Pass@1, not pass-per-dollar; AgentCoder's "less cost" claim is rare and not standardized.
- No framework reports rigorous evidence on **file-scoped parallel writers with explicit interface contracts upfront** (the obvious response to Cognition's critique). It's intuitive but unverified.
- It is unclear whether the Architect/Editor gain is a transient artefact of weak instruction-following in formatting (closing with stronger base models) or a durable decomposition.
- No public study compares **single-agent + critic** vs **two-agent (writer + reviewer)** with the critic role's prompt held constant — so we cannot tell whether the *agent boundary* adds anything beyond a prompted self-critique pass.

---

## Agent 3 — First-principles design: does implementation have a multi-agent shape, and what triad

# First-Principles Design: Does Implementation Have a Multi-Agent Shape?

## Claim (one sentence)
Implementation has a multi-agent shape, but it is not propose/evaluate/synthesize — it is **contract / fill / weave**, and the strategy only earns its name if it enforces the contract *before* fan-out and the weave *after*, otherwise it degenerates into parallel typing that produces merge garbage.

## What implementation is (ontologically)
Implementation is **the construction of an artifact that simultaneously satisfies a behavioral contract and preserves the invariants of an existing system**. Investigation reduces a many-to-one (evidence → claim); implementation expands a one-to-many (intent → many co-constrained tokens) under the hard constraint that the result must compose. It is closer to assembling a jigsaw than to writing an essay: every piece is shaped by its neighbors, and "good locally" does not imply "fits globally."

## Natural unit(s) of parallelism
Candidates ranked by how cleanly they factor:
- **Plan task** — factors well *only when the plan has already separated tasks by interface boundary*; otherwise tasks share hidden state.
- **Layer slice** (data / domain / transport) — factors poorly during construction (each layer is downstream of the one above's shape) but well during *modification* once interfaces are stable.
- **File / module** — proxy for "shared mutable surface"; clean iff the file's imports are stable.
- **Function** — too fine; coordination cost exceeds the work.
- **Candidate solution** (N agents each implement the whole thing, pick best) — factors perfectly but wastes N-1 of the work and requires a judge that is itself an investigation.

The honest unit is **the interface-bounded task**: a unit defined not by file count or layer but by *the set of symbols it is allowed to read and the set it is allowed to write*. Parallelism is safe exactly to the degree those read/write sets are disjoint across agents.

## Coherence constraints
What must be **shared before fan-out**: the type/interface contracts the parallel work will compose against, the naming conventions, the error model, and the test fixtures. These are the seams.
What must be **sequenced**: anything that mutates the shared seam (schema, public API, shared utility signatures). One agent owns the seam at a time; everyone else reads it as frozen.
What can run **truly independent**: implementations behind a stable interface (different adapters, different handlers, different pure functions consuming a fixed input type), plus tests for already-written code.
The asymmetry to investigation: a wrong angle in investigation is harmless residue; a wrong interface assumption in implementation **silently corrupts every parallel branch downstream of it**. So coherence is paid up-front, not at synthesis.

## The proposed triad (or argument against one)
**Contract → Fill → Weave.**
- **Contract**: a single agent (or the parent) freezes the seams — types, signatures, file boundaries, test fixtures, naming. Output is not code, it is a *frame* that makes the next step embarrassingly parallel.
- **Fill**: N agents implement against the frame, each with a disjoint write-set. They may not modify the contract; if they need to, they raise it back to the parent rather than negotiating across siblings (siblings cannot see each other — same independence axiom as the investigation skill).
- **Weave**: a single agent (parent, not delegated) integrates: runs the full test suite, resolves the small coherence drifts that always appear at boundaries, and decides whether the contract held. If it didn't, the wave failed and the contract is re-cut — *not* the fills re-run unchanged.
Propose/evaluate/synthesize is wrong here because there is no "judging between alternatives" step — there is a *composition* step, which is a different operation.

## Minimal viable strategy
A skill earns the name "strategy" iff it specifies, at minimum:
1. A **gate** ("only when the plan has ≥3 tasks with provably disjoint write-sets and a stable contract surface").
2. A **contract artifact** the parent must produce before fan-out (a list of frozen symbols, file boundaries, and shared fixtures) — without this, fan-out is theatre.
3. A **write-set declaration** required from each fill agent's brief (so the parent can detect overlap at brief time, not at merge time).
4. A **weave step owned by the parent** (not delegated), with an explicit failure mode: if integration fails, re-cut the contract, do not re-dispatch the same fills.
5. A **stop rule**: if two waves of fills both fail to weave, the work is not parallel-shaped — fall back to serial.

Anything less is `dispatching-parallel-agents` with a costume.

## Steelman of the null hypothesis
A good plan already encodes the contract: file boundaries, function signatures, and test cases are exactly the "frozen seams" the triad demands. A single agent executing a good plan holds the whole contract in one context window — it never drifts from it, never needs a weave step, and never pays the brief-writing tax that fan-out imposes (which is non-trivial: each fill brief must restate the contract, the write-set, and the forbidden surface). Token cost of N briefs + a weave often exceeds the token cost of one agent doing the work serially, because implementation tokens are cheap relative to coordination tokens. Worse, the *failure mode* of parallel implementation is silent incoherence — code that compiles, passes local tests, and is subtly wrong at the seams — which is more expensive to debug than the serial work would have been to write. The ceiling on implementation throughput is set by **how well the plan factored the problem**, not by how many agents you throw at it; if the plan factored well, one agent is fast enough, and if it didn't, more agents make it worse. So: invest in planning, not in parallel execution.

(This steelman survives a one-line rebuttal. The honest counter is empirical — at some task-count threshold, wall-clock dominates token cost — but that threshold is not a first-principles object.)

## Open questions
- What is the actual disjoint-write-set threshold (task count, file count) below which serial wins? First principles cannot fix the number.
- Can the contract step itself be parallelized (multiple agents proposing contracts, parent picks one)? That would re-introduce propose/evaluate at the *seam-design* layer — possibly the real locus of value.
- Does the weave step generalize to "any agent integrating any N fills," or does it require the *same* agent that cut the contract? Continuity of intent vs. fresh eyes is unresolved.
- Is there a fourth phase — **ratchet** (lock the contract into the codebase as types/tests so future fills cannot violate it)? Plausibly yes, but it blurs into general engineering hygiene rather than a strategy-level step.

---

## Agent 4 — Adversarial: why a multi-agent implementation strategy would be a net negative

# Adversarial: Why a Multi-Agent Implementation Strategy is a Bad Idea

## Claim (one sentence)
Building a `nested-implementers-strategy` skill would actively harm domainspec, because implementation — unlike investigation — has a single coherent artifact as its output, and parallelizing its production replaces a tractable writing problem with an intractable merging-and-reconciling problem that no synthesizer agent can reliably solve.

## The core failure
Investigation produces *findings* (text the human reads and judges); implementation produces *running code* (a machine executes it and breaks at the first inconsistency). A propose/evaluate/synthesis wave can tolerate three subagents disagreeing about a definition because the synthesizer picks one. Three implementer subagents disagreeing about a type signature, an import path, or an error-handling convention produces code that does not compile, or worse, compiles and silently does the wrong thing. The synthesizer's job goes from "pick the strongest argument" to "rewrite three partially-overlapping codebases into one" — which is just doing the implementation, with extra steps and three sunk-cost contexts to ignore.

## Supporting failure modes

1. **Shared-import collision.** Implementer A adds `from internal_tools.vault_common.frontmatter import Schema` at line 4 of `loader.py`. Implementer B, working on the sibling task, adds `from internal_tools.vault_common.frontmatter import Schema as FMSchema` at line 5 of the same file because their task description used a different name. Either the synthesizer notices and rewrites (cost: re-reading both diffs end-to-end) or it doesn't and we ship two aliases for the same symbol. There are no "independent files" in a typed codebase with shared schemas — and domainspec is exactly that.

2. **Plan-drift amplification.** A single agent reads the plan once and drifts once. N agents each reinterpret ambiguities ("should this raise or return Result?", "is `path` a `Path` or `str`?") independently. Drift compounds, it does not cancel. The synthesizer cannot recover the original intent because the plan was the ground truth and the plan was ambiguous in the first place — that's *why* the agents drifted.

3. **Verification becomes the bottleneck and is now harder.** Reviewing one agent's PR of 400 LOC takes X minutes. Reviewing a synthesizer's PR of 400 LOC produced by stitching three 250-LOC drafts takes >X minutes, because the reviewer now has to verify both the code *and* that nothing from drafts A/B/C leaked through with subtly different semantics. The "time saved by parallelism" is paid back with interest at review time, by a human, who is the actual scarce resource.

4. **Token economics invert.** Three implementer contexts (each loading the same constitution files, the same type definitions, the same neighboring modules) plus a synthesizer context (loading all three outputs plus the originals) costs roughly 4-6x a single implementer — for output that needs additional cleanup. The break-even requires the parallel path to be >4x faster wall-clock *and* produce equivalent quality. Neither has been demonstrated for code generation; both have been demonstrated for investigation, which is why the analogy is seductive and wrong.

5. **Skill-bloat in a system already drowning in skills.** The telemetry README documents ~113 skills and ~44 agents. Each new skill is a routing decision the user (and the router agents) must make, a maintenance liability, and a surface for the strategy to be invoked when it shouldn't be. The marginal cost of skill #114 is not zero — it raises the noise floor for every other skill.

6. **Empirical silence.** Aider, Cursor, Claude Code, Codex CLI — none of the production single-agent coding tools ship a multi-writer orchestration mode as default, despite obvious commercial incentive to differentiate. MetaGPT and ChatDev exist as research curiosities, not as the path practitioners chose. That asymmetry is data.

## Why investigation-parallelism doesn't transfer

Investigation parallelism works because (a) the outputs are *text artifacts a human judges*, so disagreement is informative rather than broken; (b) the angles are genuinely independent — repo audit, prior art, first principles, adversarial don't share state; (c) the synthesizer's job (pick + weave arguments) is the *same kind of work* as the subagents'. None of these hold for code. Code outputs are executed not judged, file edits share state through the type system and import graph, and the synthesizer's job (merge three implementations into one coherent one) is a *categorically different* and harder task than what the implementers did. The analogy is structural mimicry, not functional equivalence.

## What should be built instead

Spend the design effort on a **single-agent implementation skill with explicit plan-pinning and mid-execution checkpoints** — the loop is "implementer reads plan, executes one task, runs tests, emits signal, human or gate validates, next task." That is exactly what `subagent-driven-development` and `executing-plans` already gesture at, and the leverage is in *tightening the checkpoint and signal contract*, not in fanning out writers. Concretely: a stricter "plan task → behavior contract → test → implementation → tag → verify" inner loop with the gates surfaced as failure modes, not as bureaucracy. That improves every implementation session; a fan-out skill improves at most the rare large-fanout one.

## Concessions

1. **Embarrassingly parallel scaffolding** — generating N independent boilerplate files (one Pydantic model per schema, one test stub per endpoint) with no shared types is a legitimate fan-out, but it deserves a narrow `parallel-scaffold` skill, not a propose/evaluate/synthesis strategy modeled on investigation.
2. **Cross-cut critique of a single implementation draft** — running multiple reviewer agents over one implementer's output (security, performance, layering) is investigation-shaped, not implementation-shaped, and is worth building. That is a *review* fan-out, not a *writing* fan-out, and should be named accordingly so it isn't conflated with the bad idea above.
3. **If domainspec ever has a benchmark** where wall-clock-to-merged-PR is measured on identical tasks, single-writer vs orchestrated-writers, and the orchestrated path wins on both quality and cost across a meaningful sample, reopen the question. Until then, don't build it.
