---
tags: [arcanum, codex-command]
node_type: spec
is_session: false
layer: application
nature: procedural, reference, technical
status: active
version: 0.1.0
last_updated: 2026-05-27
---

# Arcanum Sigil: distill

<!-- arcanum:capability-id distill -->
<!-- arcanum:capability-kind sigil -->
<!-- arcanum:capability-tier arcana -->
<!-- arcanum:command distill -->

<!-- arcanum:runtime codex -->

## Observer Envelope: Task Zero

Before doing domain work, establish the observer envelope for this Arcanum invocation.

- `run_id`: use an existing hook-provided run id when present; otherwise use `arcanum-distill-<UTC timestamp>`.
- `capability.id`: `distill`
- `capability.kind`: `sigil`
- `capability.tier`: `arcana`
- `capability.mode`: `command`
- `target_artifact`: this command file
- request summary: summarize the user request before execution.
- expected outputs: list intended artifacts before execution when known.

Closeout is mandatory but must not hide the primary result. At the end, report:

- `OBSERVATION`
- `LEDGER`
- `REFLECTION_TRIGGER`
- `RECOMMENDATION`
- `DEDUPE_KEY`

If deterministic hook or wrapper telemetry is unavailable, preserve the result and report the observability gap.


## Objective

Run the installed Arcanum sigil `distill` using the canonical definition snapshot embedded below.

## Process

1. Use the embedded canonical README and SKILL snapshots as the execution contract.
2. Execute only this installed sigil unless the definition explicitly delegates or the user asks to route elsewhere.
3. Preserve the selected sigil's process, quality bar, anti-patterns, output contract, validation gates, gaps, and next route.
4. Return artifact used, command used, validation result, observability result, and next action.

## Guardrails

- Keep this command focused on `distill`.
- Do not silently add, remove, or refresh capabilities.
- Do not treat generated observer telemetry as a substitute for the primary result.

## Canonical README Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/arcana/distill/README.md

````markdown
# Distill

Status: promoted Arcana sigil.

Distill is an interactive planning sigil for finding the best optimization point between a tiny working unit and the larger context a user is trying to reason about.

It helps design a model, architecture, plan, workflow, or implementation shape by recursively reducing an initial seed into coherent concept layers, testing whether smaller units still make sense, and recomposing the selected unit back into the upper design.

The goal is not to make the smallest possible fragment. The goal is to find the smallest coherent unit that still has meaning, responsibility, inputs, outputs, and a recomposition path in the user's target context.

## Start Here

For users and future agents:

1. Read this README to understand when the sigil is useful.
2. Read [development/SIGIL-HANDOFF.md](development/SIGIL-HANDOFF.md) for the full design contract.
3. Read [development/IMPLEMENTATION-LAYERING.md](development/IMPLEMENTATION-LAYERING.md) for the development layer plan.
4. Read [development/IMPLEMENTATION-PLAN.md](development/IMPLEMENTATION-PLAN.md) for task and SWU handoff.
5. Use [development/examples/](development/examples/) and [development/VALIDATION.md](development/VALIDATION.md) after validation is created.

The executable contract lives in [SKILL.md](SKILL.md). Runtime adapters should point to that canonical contract instead of duplicating the sigil internals.

## Use When

Use Distill when:

- an idea, model, architecture, design, or plan feels too broad to implement responsibly,
- a system needs to be decomposed without losing the meaning of the whole,
- the user needs a planning process before committing to one solution,
- a proposed solution may be overbuilt, underbuilt, or prematurely optimized,
- multiple possible designs need to be compared before convergence,
- the work needs a clear relationship between concept layers, smallest coherent unit, and next implementation route.

## Do Not Use When

Do not use this sigil when:

- the user already has a small, well-scoped implementation task,
- a deterministic check or direct code change would solve the problem,
- the work only needs a summary, not a concept optimization,
- the user does not need role-based critique or recursive reduction,
- the expected output artifact is unclear and the user is not ready to clarify it.

## First Turn Shape

The sigil should begin by confirming intent and budget before decomposition:

```text
I understand the design intent as: <seed point>.
Target context: <context size and purpose>.
Expected Output Artifact: <data model, architecture design, implemented code structure,
plan, decision record, research map, technique spec, or other concrete result>.
Optimization goal: <clarity, scope, architecture, planning depth, model quality,
implementation readiness, or other explicit goal>.
Recommended budget: Standard - one proposal track, two role conversations
(Proposer and Balancer), two recursive rounds, then reconciliation.
Do you want Compact, Standard, Tournament, or Deep?
```

If the user does not choose a budget, the default is Standard.

## Modes

| Mode | Use When | Shape |
| --- | --- | --- |
| Compact | The user wants a quick bounded pass. | One proposal track, one recursive round, always-on gates only. |
| Standard | Default planning depth is enough. | One Proposer, one Balancer, two recursive rounds, one reconciliation pass. |
| Tournament | Multiple possible designs should compete. | Several proposal tracks, each balanced, followed by evidence-based pitch-off. |
| Deep | The context is high-risk, broad, or strategically important. | More rounds, stronger cycle checks, triggered techniques, premortem, and possible human gates. |
| Validate | An existing design needs review. | Balancer-led critique with optional Proposer repair and readiness verdict. |

All modes must keep finite proposal tracks, finite recursive rounds, cycle guards, and a recorded reason for skipped techniques.

## Output Artifact

Every run should name the concrete result it is optimizing toward. Examples:

- data model structure,
- architecture design,
- implementation plan,
- implemented code structure,
- decision record,
- research map,
- technique spec.

The output artifact is a guide, not a prison. If discovery shows that another artifact shape would solve the objective better, the sigil should rename the output artifact and record why.

## How It Works

Distill uses a role loop:

- Proposer builds a candidate concept decomposition or design path.
- Balancer challenges premature complexity, brittle minimalism, wrong abstraction level, missing recomposition, and unsupported assumptions.
- Orchestrator reconciles the proposal and objections into a selected optimization point or a routed blocker.

The core process:

1. Confirm seed point, target context, output artifact, optimization goal, and budget.
2. Build a discovery baseline from available evidence, constraints, unknowns, and assumptions.
3. Identify the broad concept layer that contains the user's frame.
4. Ask what smaller concepts must combine to make that layer work.
5. Test each candidate unit for responsibility, inputs, outputs, abstraction level, evolution profile, and recomposition.
6. Stop reduction when splitting further removes meaning, repeats a prior state, exceeds budget, or creates hidden glue.
7. Select the optimization point where the unit is small enough to work with and large enough to remain meaningful.
8. Produce a navigable result with tensions, deferred complexity, proof of recomposition, and next route.

## Technique Pack

The sigil uses techniques as internal instruments, not as separate modes.

Core techniques include:

- abstraction-level guard,
- recomposition proof,
- evolution profile,
- frame-expiry note,
- cognitive load check,
- requisite variety check,
- boundary-object check,
- concept-vs-knowledge status,
- premortem pass,
- set-based tournament,
- navigable result check.

See [development/techniques/README.md](development/techniques/README.md) for the current TechniqueSpec index.

## Runtime Role Policy

Distill is subagent-first.

When the active runtime supports subagents, run separate Proposer and Balancer conversations for each proposal track. When the active runtime does not support subagents, run labeled Proposer and Balancer passes in one agent while preserving the same role trace contract.

Both paths must record:

- Proposer claim,
- evidence or assumption,
- Balancer objection category,
- reconciliation decision,
- stable disagreement when one remains.

## Complexity Balance

The sigil should not introduce complexity because it is elegant, reusable, or theoretically complete.

Complexity is justified only when the current context has a named tension that the simpler unit cannot responsibly handle. Future scale is in scope only when the evolution profile is concrete, such as expected variants, repeated integrations, growing policy rules, multiple actors, scaling volume, migration needs, or governance review.

When the evolution profile is unknown, preserve a clear boundary and defer the heavier mechanism.

## Expected Result Shape

A complete run should produce a result shaped like:

```markdown
## Distill Result

- Target context: <context summary>
- Objective and output artifact: <objective; artifact shape>
- Mode and budget: <compact | standard | tournament | deep | validate>
- Proposal tracks: <count and role summary>
- Recursive rounds: <count completed / budget>
- Verdict: pass | flag | block
- Current smallest coherent unit: <unit name and responsibility>
- Optimization point: <why this unit is the best size for the target context>
- Concept layer map: <broad layer to selected unit>
- Technique pack trace: <techniques run, skipped, triggered, and outcomes>
- Closure and recomposition proof: <how the unit closes and recomposes upward>
- Evolution profile: <expected evolution and smallest extension boundary>
- Deferred complexity: <what was deferred and why>
- Tension ledger: <resolved and unresolved tensions>
- Navigation guide: <where to start, what changed, what remains unresolved, and how to use the result>
- Next route: implementation-layering | robot-talks | decision-gate | invoke design | invoke plan | task-session | deferred
```

## Next Routes

Distill does not execute the implementation itself. It routes the result to the next lifecycle owner:

- [implementation-layering](../../transmutations/implementation-layering/) when the selected unit needs phased implementation planning,
- [robot-talks](../robot-talks/) when cross-layer tensions need independent investigation,
- [decision-gate](../decision-gate/) when a blocker choice prevents selecting an optimization point,
- [invoke design](../../spells/invoke/) or [invoke plan](../../spells/invoke/) when the result needs governed lifecycle authoring,
- [task-session](../task-session/) when the work is scoped enough to execute.

## Development Status

Current development artifacts:

- [SKILL.md](SKILL.md)
- [development/SIGIL-HANDOFF.md](development/SIGIL-HANDOFF.md)
- [development/MODE-TECHNIQUE-SURFACE-DESIGN.md](development/MODE-TECHNIQUE-SURFACE-DESIGN.md)
- [development/techniques/README.md](development/techniques/README.md)
- [development/IMPLEMENTATION-LAYERING.md](development/IMPLEMENTATION-LAYERING.md)
- [development/IMPLEMENTATION-PLAN.md](development/IMPLEMENTATION-PLAN.md)
- [development/WORK-PACK.md](development/WORK-PACK.md)
- [development/PLAN-TRANSPORT.md](development/PLAN-TRANSPORT.md)
- [development/examples/](development/examples/)
- [development/VALIDATION.md](development/VALIDATION.md)
- [development/REGISTRY-PROMOTION.md](development/REGISTRY-PROMOTION.md)
- [development/READINESS-REVIEW.md](development/READINESS-REVIEW.md)

Runtime and observability artifacts:

- [templates/usage-telemetry.md](templates/usage-telemetry.md)
- `.codex/commands/distill.md`

## Maintenance

Lifecycle maintenance is owned by sigil-development.

Use the reflection route when repeated runs show:

- objective-output drift,
- blocked runs caused by unclear contract language,
- repeated navigation failures,
- technique overuse or underuse,
- missing evolution profiles,
- runtime traces that diverge between true subagents and role simulation.

## Next

The final `B-CLO-002` approval was granted on 2026-05-24, and Distill is listed in [registry/SIGILS.md](../../registry/SIGILS.md). Future changes should follow the maintenance classes in [development/READINESS-REVIEW.md](development/READINESS-REVIEW.md).

````

## Canonical SKILL Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/arcana/distill/SKILL.md

````markdown
---
name: distill
description: "Use when: reducing a broad model, architecture, design, implementation plan, or workflow into the smallest coherent concept unit that still fits the user's target context and can recompose into the larger system."
argument-hint: "<seed-point> [--mode compact|standard|tournament|deep|validate] [--rounds <n>] [--tracks <n>]"
tier: arcana
domain: planning-optimization
version: 0.1.0
origin: created through Arcanum invoke and sigil-development planning from Distill design packet
allowed-tools: Read, Write, Glob, Grep, Task, AskQuestions
---

# Sigil: Distill

<objective>
Distill a model, architecture, design, or plan by recursively extracting concept layers, selecting the smallest coherent unit that still fits the user's target context, and proving how that unit recomposes into the larger system before downstream implementation begins.
</objective>

<logic-type>
Arcana: recursive planning optimization with role-based critique, finite reduction rounds, technique gates, and lifecycle routing.
</logic-type>

<applicability>
Use this sigil when:

- an idea, architecture, model, plan, or workflow is too broad to implement responsibly,
- the user wants planning before committing to one solution,
- a solution may be overbuilt, underbuilt, or prematurely optimized,
- the work needs a clear relationship between broad concept layers and the first coherent unit,
- multiple possible designs should compete before convergence,
- the output needs a navigable next route such as implementation-layering, robot-talks, decision-gate, invoke design, invoke plan, or task-session.
</applicability>

<non-applicability>
Do not use this sigil when:

- the user already has one small deterministic edit,
- direct implementation is safer than conceptual decomposition,
- the request only needs a summary or explanation,
- there is no meaningful output artifact to optimize toward,
- the user needs factual discovery as the primary work rather than planning optimization.
</non-applicability>

<inputs>
Expected inputs, if available:

- seed point: starting concept, model, architecture, design, plan, problem, or workflow,
- target context: the size and purpose the result must serve,
- output artifact: data model, architecture design, implementation plan, code structure, decision record, research map, technique spec, or other concrete artifact,
- optimization goal: clarity, scope, architecture, planning depth, model quality, implementation readiness, or another stated goal,
- constraints: time, cost, quality, governance, risk, implementation, audience, or domain limits,
- existing artifacts: specs, notes, code, diagrams, plans, or decisions that should count as evidence,
- budget preference: Compact, Standard, Tournament, Deep, or Validate.
</inputs>

<first-action>
Before decomposing, confirm intent and budget:

```text
I understand the design intent as: <seed point>.
Target context: <context size and purpose>.
Expected output artifact: <artifact shape>.
Optimization goal: <goal>.
Recommended budget: Standard - one proposal track, Proposer and Balancer roles,
two recursive rounds, then reconciliation.
Do you want Compact, Standard, Tournament, Deep, or Validate?
```

If the user does not choose, proceed with Standard and record that assumption.
</first-action>

<modes>
| Mode | Use When | Budget |
| --- | --- | --- |
| Compact | The user wants a quick bounded pass. | One proposal track, one recursive round, always-on gates only. |
| Standard | Default planning depth is enough. | One proposal track, Proposer and Balancer roles, two recursive rounds, one reconciliation pass. |
| Tournament | Multiple designs should compete. | Three proposal tracks by default, each balanced independently, then set-based pitch-off. |
| Deep | The context is broad, high-risk, or strategically important. | Two or more tracks, three rounds by default, stronger cycle checks, premortem, and possible human gates. |
| Validate | An existing design needs review. | Balancer-led critique with optional Proposer repair and pass, flag, or block verdict. |

All modes must keep finite proposal tracks, finite recursive rounds, cycle guards, and skipped-technique reasons.
</modes>

<runtime-role-policy>
Use true subagents whenever the active runtime supports them for Proposer and Balancer roles. If subagents are unavailable, run labeled Proposer and Balancer passes in one agent.

Both paths must preserve the same role trace:

- Proposer claim,
- evidence or assumption,
- Balancer objection category,
- reconciliation decision,
- stable disagreement, if one remains.
</runtime-role-policy>

<process>
1. Confirm design intent, target context, output artifact, optimization goal, and budget.
2. Build a discovery baseline from provided artifacts, constraints, blocker unknowns, non-blocker unknowns, and assumptions.
3. Resolve the mode profile: proposal tracks, role conversations, recursive rounds, pitch-off behavior, human gates, and closeout policy.
4. Identify the broadest concept layer that contains the user's frame and label its abstraction level.
5. For each proposal track, run a Proposer pass that suggests a concept layer split and candidate smallest coherent unit.
6. Run always-on techniques:
   - abstraction-level guard,
   - recomposition proof,
   - evolution profile when future scale or extensibility appears,
   - frame-expiry note,
   - navigable result check.
7. Run triggered techniques when conditions appear:
   - cognitive load check,
   - requisite variety check,
   - boundary-object check,
   - concept-vs-knowledge status,
   - premortem pass,
   - set-based tournament.
8. Run a Balancer pass using named objection categories.
9. Reconcile each objection as accept, revise, reject, defer, or route.
10. Test candidate units for closure:
    - responsibility,
    - named inputs and outputs,
    - explicit abstraction level,
    - recomposition into the upper layer,
    - no hidden glue,
    - no smuggled future scale,
    - no meaning loss when split further.
11. Continue recursive rounds until the selected budget ends, closure is reached, a cycle guard fires, or a blocker appears.
12. In Tournament mode, compare viable tracks by fit, option value, risk, cost, assumptions, and elimination conditions.
13. Select the optimization point where the unit is small enough to work with and large enough to remain meaningful in context.
14. Run closeout techniques: recomposition proof, frame-expiry note, premortem when required, navigable result check.
15. Return pass, flag, or block and route the result to the next lifecycle owner.
</process>

<technique-pack>
Use the detailed TechniqueSpec contracts in `development/techniques/README.md`.

Technique activation trace must include:

- technique id,
- hook,
- activation reason,
- inspected state,
- emitted output,
- decision,
- readiness effect.
</technique-pack>

<cycle-guards>
Stop or gate when:

- the recursive round budget is reached,
- the same split reappears with new names but no new structure,
- a round adds terminology without improving closure, recomposition, or risk handling,
- Proposer and Balancer keep trading the same tension without new evidence,
- a smaller concept fails closure but is repeatedly reintroduced,
- further reduction would damage the user-selected context.

When a guard triggers, record the reason and either choose the current best optimization point or ask for one blocker decision.
</cycle-guards>

<complexity-balance>
Do not introduce complexity because it is elegant, reusable, or theoretically complete.

Complexity is allowed only when the current context has:

- a named tension,
- a concrete failure mode, or
- a confirmed evolution pressure that the simpler unit cannot responsibly handle.

Before deferring future scale, ask what kind of evolution the system, solution, or plan is likely to have. Natural evolution pressure can justify a small extension boundary when it is concrete: expected variants, repeated integrations, growing policy rules, multiple actors, scaling volume, migration needs, or governance review.

When the evolution profile is unknown, preserve a clear boundary and defer the heavier mechanism.
</complexity-balance>

<quality-bar>
A successful execution must:

- confirm objective and output artifact before recursive decomposition,
- select or infer a finite mode budget,
- build a discovery baseline before proposing layers,
- preserve Proposer/Balancer trace,
- classify Balancer objections by named category,
- run always-on techniques or record why readiness is downgraded,
- activate conditional techniques only when their trigger is present,
- stop infinite reduction through cycle guards,
- select a smallest coherent unit with closure and recomposition proof,
- defer complexity that lacks a named tension or confirmed evolution profile,
- return a navigable result with start-here guidance, unresolved tensions, and next route.
</quality-bar>

<anti-patterns>
Avoid:

- reducing concepts into tiny fragments that no longer carry behavior,
- adding abstractions for elegance, reuse, or hypothetical scale,
- letting the Balancer object vaguely without a concrete category,
- treating a concept claim as knowledge-backed when evidence is weak,
- skipping the output artifact because the concept map feels complete,
- running Tournament mode without assumptions and elimination conditions,
- letting true-subagent and role-simulation paths produce different trace contracts,
- claiming pass readiness when the result has no navigation guide,
- routing to implementation when a blocker decision or cross-layer tension remains.
</anti-patterns>

<observability>
For meaningful executions, emit or prepare usage telemetry when the local observability package is available.

Recommended signal fields:

- objective-output confirmation,
- target context,
- selected mode,
- proposal tracks,
- recursive rounds,
- role execution path: true subagents or role simulation,
- techniques triggered and skipped,
- verdict,
- objective-output drift,
- navigation closeout status,
- next route.
</observability>

<output-contract>
Return:

```markdown
## Distill Result

- Target context: <context summary>
- Objective and output artifact: <objective; artifact shape>
- Mode and budget: <compact | standard | tournament | deep | validate>
- Proposal tracks: <count and role summary>
- Recursive rounds: <count completed / budget>
- Verdict: pass | flag | block
- Role conversation trace: <Proposer claims, Balancer objections, reconciliation decisions>
- Current smallest coherent unit: <unit name and responsibility>
- Optimization point: <why this unit is the best size for the target context>
- Concept layer map: <broad layer to selected unit>
- Technique pack trace: <techniques run, skipped, triggered, and outcomes>
- Closure and recomposition proof: <how the unit closes and recomposes upward>
- Evolution profile: <expected evolution and smallest extension boundary>
- Deferred complexity: <what was deferred and why>
- Tension ledger: <resolved and unresolved tensions>
- Premortem: <likely failure reason and guardrail | skipped with reason>
- Frame-expiry note: <context change that invalidates this optimization point>
- Navigation guide: <where to start, what changed, what remains unresolved, and how to use the result>
- Next route: implementation-layering | robot-talks | decision-gate | invoke design | invoke plan | task-session | deferred
```
</output-contract>

````
