---
tags: [subagents, dispatch-artifact, subagents-findings, multi-agent-implementation-strategy]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-16
dispatch_id: 2026-05-17-multi-agent-implementation-strategy-01
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `multi-agent-implementation-strategy`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis cites a passage in `domainspec-subagents-research.md` per R17.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

User asked whether implementation execution (writing code from a plan) should benefit from a structured multi-agent strategy analogous to `domainspec-subagents-strategy`. The parent dispatched 4 parallel investigators (`task-fan-out`, `heuristic_row: flat-fanout`). The dispatch was wrapped retroactively into the strategy skill (children already ran before the skill was invoked); `bootstrap_override.scope: spec-only` was set and the validator returned `accept-with-bootstrap-override`.

## Goal

Determine whether implementation execution (writing code from a plan) should be governed by a structured multi-agent strategy, and if so, name its minimal legitimate shape.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**dispatch_id:** `2026-05-17-multi-agent-implementation-strategy-01`
**spec path:** `vault/snapshots/dispatches/2026-05-17-multi-agent-implementation-strategy-01-spec.yaml`
**spec_hash:** `41e77b07654df871a522aed57b552043654385970f5d1cbee9c97cde0d94b3c6`
**corpus_hash_at_emit:** `58af094d89ce121cade1dac1459e32f63481967e2bcda7ae8ff046e2d12eccbf`
**telemetry:** appended to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` at `2026-05-18T02:45:11Z`, event `subagent-strategy.dispatched`
**Mode:** `task-fan-out` *(R19)* — heuristic row `flat-fanout`
**Validator verdict:** `accept-with-bootstrap-override`
**Bootstrap override:** `scope: spec-only` — children executed prior to skill invocation; spec was reconstructed and validated retroactively.

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `L1-A1-repo-audit` | sonnet | Mechanical inventory of existing skills/agents in `.claude/` — sonnet sufficient for filesystem traversal and citation. | unbounded | Structured report: existing artifacts, gap enumeration, load-bearing evidence with file:line citations, open questions. |
| `L1-A2-external-prior-art` | sonnet | Survey synthesis across multiple frameworks and benchmarks — sonnet sufficient for retrieval-style synthesis with citations. | unbounded | Structured report: recurring patterns, empirical evidence with URLs, negative results, open questions. |
| `L1-A3-first-principles` | sonnet | Conceptual decomposition of "implementation" as an operation — sonnet adequate for first-principles reasoning under a tight rubric. | unbounded | Structured report: ontology, units of parallelism, coherence constraints, proposed triad, minimal-viable-strategy gates, steelman of null hypothesis, open questions. |
| `L1-A4-adversarial` | sonnet | Falsification / red-team argumentation — sonnet sufficient for adversarial critique against a defined target. | unbounded | Structured report: core failure, supporting failure modes, why-the-analogy-fails, what-to-build-instead, concessions. |

**Sequencing:** parallel set — all 4 agents dispatched simultaneously; no inter-child dependencies.

**Recursion budget actually used:** depth = 1, breadth = 4, total agents = 4 *(defaults per R13: depth 2, breadth 5, total 10 — within budget).*

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `L1-A1-repo-audit` | — | — | — |
| `L1-A2-external-prior-art` | — | — | — |
| `L1-A3-first-principles` | — | — | — |
| `L1-A4-adversarial` | — | — | — |
| **Sum** | — | — | — |

> Per-agent token counts were not captured at child-emit time (children ran prior to retroactive spec wrap); telemetry event recorded the dispatch envelope only. Cost-discipline grade below treats the missing per-agent figures as an instrumentation gap, not a budget overrun.

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.9` (judgment) | Four lenses (repo-internal, external, first-principles, adversarial) jointly answer both halves of the Goal (should-we, and minimal-shape-if-yes). |
| Independence     | `0.85` (judgment) | Concerns non-overlapping by construction: audit ≠ prior-art ≠ design ≠ critique. Mild overlap between A2 negative results and A4 failure modes; not load-bearing. |
| Fidelity         | `0.9` (judgment) | Each child cited concrete passages (file:line for A1, URLs for A2) or made first-principles claims explicit (A3, A4); findings below trace cleanly back to those sections. |
| Cost discipline  | `n/a (instrumentation gap)` | declared budget vs actual: `unbounded × 4 / not captured`. Dispatch envelope logged; per-child token totals not emitted. Treat as a process bug to fix in the next dispatch, not as overspend. |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical — and here even cost is degraded by missing instrumentation.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-subagents-research.md` (R17).

### F1 — The propose/evaluate/synthesize shape does not transfer to writing code

- **Claim:** The investigation-time triad (propose → evaluate → synthesize) is the wrong shape for implementation; the operation expands one intent into many co-constrained tokens that must compose, not many candidates to be judged.
- **Evidence:** [research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad) — *"Investigation reduces a many-to-one (evidence → claim); implementation expands a one-to-many (intent → many co-constrained tokens) under the hard constraint that the result must compose."* Corroborated by [research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative) — *"The synthesizer's job goes from 'pick the strongest argument' to 'rewrite three partially-overlapping codebases into one' — which is just doing the implementation, with extra steps."*
- **Implication:** Any "nested-implementers" skill that copies the investigation triad verbatim is structurally mistaken; if a skill is built, its triad must be different (see F3).

### F2 — The existing repo has no propose/evaluate/synthesize for code, and the gap is real but unspecified

- **Claim:** The repo offers a single-executor governance-gated path, a wave-parallel cross-plan executor, and a generic review loop — but nothing that produces N candidate implementations of the same task or merges them.
- **Evidence:** [research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps) — *"No convention for N independent implementations of the same task … No merge/selection step for code candidates … `subagent-driven-development` explicitly forbids parallel implementers; `gsd-execute-phase` explicitly requires them (across plans). The two regimes are not reconciled by any meta-skill."*
- **Implication:** The structural gap exists; whether to fill it is the policy question this dispatch must answer.

### F3 — The legitimate shape, if any, is Contract → Fill → Weave, not propose/evaluate/synthesize

- **Claim:** Implementation parallelism is safe iff the parent freezes the seams (types, signatures, file boundaries, fixtures) before fan-out, fills run against disjoint write-sets, and the parent (not a delegate) integrates.
- **Evidence:** [research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad) — *"Contract: a single agent (or the parent) freezes the seams … Fill: N agents implement against the frame, each with a disjoint write-set … Weave: a single agent (parent, not delegated) integrates."*
- **Implication:** A strategy skill earns its name only if it specifies a gate (≥3 tasks with disjoint write-sets), a contract artifact, per-fill write-set declarations, a parent-owned weave, and a stop rule. Anything less is "`dispatching-parallel-agents` with a costume" ([research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad)).

### F4 — The external empirical record favors role-splits and verification loops, not parallel writers

- **Claim:** Across Aider, AgentCoder, Reflexion, MetaGPT, SWE-bench, the durable gains come from (a) splitting reasoning from mechanical translation, (b) generation-then-test-then-refine loops, or (c) scaffold/context investment — not from multiplying writer agents.
- **Evidence:** [research §Agent 2](./domainspec-subagents-research.md#agent-2--external-prior-art-empirical-evidence-on-multi-agent-code-generation) — *"Aider Architect/Editor: o1-preview + Sonnet hits 82.7% vs 79.7% single-model … MetaGPT … ablation shows the Engineer's self-execute/debug step contributes +4.2 pp … i.e., the executable critic loop, not the PM/Architect roles, is doing the work … SWE-bench scaffolding spread … the architectural choice that matters is scaffold/context management, not number of agents."*
- **Implication:** Investment should target (a) review/critic fan-out and (b) verification loop tightening; pure writer fan-out is unsupported by the external evidence.

### F5 — Parallel writers are empirically negative when applied to interdependent code

- **Claim:** A comparative study reports all 28 multi-agent configurations degraded vs single-agent baselines (−4.4% to −35.3%), token use was 4–220× higher, and Cognition's own case study shows two parallel writers producing mutually incompatible artefacts because implicit design decisions diverged.
- **Evidence:** [research §Agent 2](./domainspec-subagents-research.md#agent-2--external-prior-art-empirical-evidence-on-multi-agent-code-generation) — *"All-degrade study: a recent comparative study found all 28 multi-agent configurations degraded … −4.4% to −35.3% … UIUC analysis: multi-agent systems use 4–220× more tokens … Cognition / Devin: explicit guidance 'Don't build multi-agents' — the Flappy Bird case study shows two parallel writers producing mutually incompatible artefacts."*
- **Implication:** The default presumption must be against writer fan-out; the burden of proof sits on the proposer, not the skeptic.

### F6 — There are two narrow concessions both sides agree on: review-fan-out and scaffold-fan-out

- **Claim:** Multiple reviewer agents over one implementation draft (security/performance/layering) is investigation-shaped; generating N independent boilerplate files with no shared types is embarrassingly parallel. Both are legitimate; neither requires a propose/evaluate/synthesize strategy.
- **Evidence:** [research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative) — *"Embarrassingly parallel scaffolding … is a legitimate fan-out, but it deserves a narrow `parallel-scaffold` skill … Cross-cut critique of a single implementation draft … is investigation-shaped, not implementation-shaped, and is worth building. That is a review fan-out, not a writing fan-out."*
- **Implication:** If anything is built short-term, it should be these two narrow skills, named explicitly so they cannot be confused with a writer fan-out.

### F7 — The worktree-DISABLED setting is a load-bearing obstacle to any writer fan-out

- **Claim:** Parallel implementation candidates require isolation; the upstream `using-git-worktrees` skill is marked DISABLED in current settings, so any writer-fan-out skill must either re-enable worktrees or invent another isolation mechanism.
- **Evidence:** [research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps) — *"No worktree/isolation contract for parallel coders. `using-git-worktrees` exists upstream and is marked DISABLED in the current settings … Parallel implementation candidates would need isolation; the disabling is a load-bearing obstacle."*
- **Implication:** The settings decision pre-empts the design space; revisiting it is a prerequisite, not a footnote.

### F8 — Review effort is the true bottleneck and parallelism makes it worse

- **Claim:** Reviewing a synthesizer's PR stitched from N drafts takes more human time than reviewing one agent's PR of the same final size, because the reviewer must verify both the code and that no draft leaked subtly different semantics.
- **Evidence:** [research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative) — *"Reviewing one agent's PR of 400 LOC takes X minutes. Reviewing a synthesizer's PR of 400 LOC produced by stitching three 250-LOC drafts takes >X minutes … The 'time saved by parallelism' is paid back with interest at review time, by a human, who is the actual scarce resource."*
- **Implication:** Wall-clock savings from writer fan-out are paid back at review; the optimization is local, not global.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-subagents-research.md` (R17).

### T1 — "Build it" (first-principles) vs "Don't build it" (adversarial)

- **Held by first-principles (A3):** there is a real multi-agent shape for implementation, and a Contract → Fill → Weave strategy enforced with hard gates earns its name.
  Evidence: [research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad) — *"Implementation has a multi-agent shape, but it is not propose/evaluate/synthesize — it is contract / fill / weave."*
- **Held by adversarial (A4):** building any such skill harms domainspec; the leverage is in tightening the single-agent checkpoint/signal contract.
  Evidence: [research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative) — *"Spend the design effort on a single-agent implementation skill with explicit plan-pinning and mid-execution checkpoints … the leverage is in tightening the checkpoint and signal contract, not in fanning out writers."*
- **Resolution path:** the two positions converge on F6 (review-fan-out + scaffold-fan-out are legitimate) and diverge only on the writer-fan-out core. The disagreement collapses to an empirical question — the disjoint-write-set threshold — that first-principles explicitly admits it cannot answer ([research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad): *"What is the actual disjoint-write-set threshold … below which serial wins? First principles cannot fix the number."*).
- **Impact:** decision-blocking; the user must pick a fork (build C→F→W now, defer, or build only the concessions).

### T2 — Repo audit identifies the gap but assigns no value to closing it

- **Repo audit (A1):** *"What the gap looks like … no convention for N independent implementations … no merge/selection step … no gate for when to use the strategy"* ([research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps)). The audit enumerates absences but does not advocate filling them.
- **Cross-cut against A4:** the adversarial reading treats the same absences as *evidence the design space was rejected for good reason* — *"Aider, Cursor, Claude Code, Codex CLI — none of the production single-agent coding tools ship a multi-writer orchestration mode as default, despite obvious commercial incentive to differentiate."* ([research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative)).
- **Impact:** a gap in the repo is not, by itself, a mandate to fill it; the audit is a precondition for the policy debate, not an answer to it.

### T3 — External prior art is neutral on the central question

- **Pattern:** A2 finds positive evidence for *role-splits* (Architect/Editor: +3 to +9.6 pp), *verification loops* (Reflexion: +8 pp), and *scaffold investment* (SWE-bench scaffolds spanning 5 pp on the same model) — but explicitly notes that *"no external benchmark cleanly isolates propose-wave / evaluate-wave / synthesize (the nested-subagents-strategy shape) applied to implementation — only to research."* ([research §Agent 2](./domainspec-subagents-research.md#agent-2--external-prior-art-empirical-evidence-on-multi-agent-code-generation)).
- **Impact:** the external record does not adjudicate the C→F→W proposal; it adjudicates a different, simpler question (writer fan-out: bad) and supports adjacent moves (role-splits and verification loops: good). The user cannot lean on external evidence to validate C→F→W specifically.

### T4 — The "best" multi-agent gains turn out to be verification gains in disguise

- **Pattern:** A2 reports that MetaGPT's ablation credits the Engineer's self-execute/debug step (+4.2 pp HumanEval, +5.4 pp MBPP) — *not* the PM/Architect role decomposition — and that Self-Refine's gains collapse without specific feedback ([research §Agent 2](./domainspec-subagents-research.md#agent-2--external-prior-art-empirical-evidence-on-multi-agent-code-generation)). A4 reaches the same place from the other direction: *"the leverage is in tightening the checkpoint and signal contract, not in fanning out writers"* ([research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative)).
- **Impact:** if domainspec wants higher-quality implementation, the highest-evidence intervention is to invest in executable-feedback loops on the existing single-executor path, not to add writers.

### Cross-cutting observations

- **All four agents agree that naive N-parallel-writers is bad.** A1 notes that `subagent-driven-development` lists parallel implementers as a Red Flag ([research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps)); A2 cites the all-degrade study and Cognition's Flappy Bird failure ([research §Agent 2](./domainspec-subagents-research.md#agent-2--external-prior-art-empirical-evidence-on-multi-agent-code-generation)); A3 grants the steelman of the null hypothesis ([research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad)); A4 makes it the core thesis ([research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative)). Convergence on this point is unusually strong.
- **All four agents agree that seams must be frozen before any fan-out.** A1 frames it as a missing artifact contract ([research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps)); A2 calls out absence of *"file-scoped parallel writers with explicit interface contracts upfront"* as the obvious-but-unverified response to Cognition ([research §Agent 2](./domainspec-subagents-research.md#agent-2--external-prior-art-empirical-evidence-on-multi-agent-code-generation)); A3 makes seam-freezing the load-bearing first step of the triad ([research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad)); A4 treats unfrozen seams as the root cause of shared-import collision and plan-drift amplification ([research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative)).
- **The disagreement reduces to a single empirical parameter.** The disjoint-write-set threshold ([research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad) open question) and the wall-clock-to-merged-PR benchmark ([research §Agent 4](./domainspec-subagents-research.md#agent-4--adversarial-why-a-multi-agent-implementation-strategy-would-be-a-net-negative) concession #3) are the same question phrased twice. Neither side can adjudicate it without measurement; both sides explicitly acknowledge this.
- **Residue (unresolved across all four):** (a) whether the Contract step itself benefits from propose/evaluate at the seam-design layer ([research §Agent 3](./domainspec-subagents-research.md#agent-3--first-principles-design-does-implementation-have-a-multi-agent-shape-and-what-triad)); (b) whether the Weave can be delegated or must stay with the contract-cutter; (c) the worktree-DISABLED interaction ([research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps)); (d) where any new skill belongs in the CLAUDE.md router ([research §Agent 1](./domainspec-subagents-research.md#agent-1--repo-internal-audit-existing-implementation-orchestration-artifacts-and-gaps)).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-subagents-research.md](./domainspec-subagents-research.md) | `derives-from` | Verbatim per-child research file that every Findings and Analysis claim in this document cites. |
