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

# Arcanum Sigil: refine

<!-- arcanum:capability-id refine -->
<!-- arcanum:capability-kind sigil -->
<!-- arcanum:capability-tier arcana -->
<!-- arcanum:command refine -->

<!-- arcanum:runtime codex -->

## Observer Envelope: Task Zero

Before doing domain work, establish the observer envelope for this Arcanum invocation.

- `run_id`: use an existing hook-provided run id when present; otherwise use `arcanum-refine-<UTC timestamp>`.
- `capability.id`: `refine`
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

Run the installed Arcanum sigil `refine` using the canonical definition snapshot embedded below.

## Process

1. Use the embedded canonical README and SKILL snapshots as the execution contract.
2. Execute only this installed sigil unless the definition explicitly delegates or the user asks to route elsewhere.
3. Preserve the selected sigil's process, quality bar, anti-patterns, output contract, validation gates, gaps, and next route.
4. Return artifact used, command used, validation result, observability result, and next action.

## Guardrails

- Keep this command focused on `refine`.
- Do not silently add, remove, or refresh capabilities.
- Do not treat generated observer telemetry as a substitute for the primary result.

## Canonical README Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/arcana/refine/README.md

````markdown
# Refine

Refine is an Arcana sigil for discovery and design refinement.

It is the front door for requests such as "refine this design," "use refinement on this folder," or "turn this vague target into a refined seed." It designs an initial seed, records research mode, runs the canonical refinement loop through deterministic Arcanum command dispatch, indexes stage evidence, and returns a final refined synthesis.

## Problem It Solves

Users often have a target, concern, folder, repository area, or rough idea, but not a refined model of what should be built, designed, planned, or deferred. Refine provides a governed discovery/design loop before any implementation or lifecycle promotion route is chosen.

## Use When

- a refinement target is vague or only points to a folder, idea, design, plan, or repository area,
- the user wants a budget and loop count before deeper design work,
- research should be offered and recorded before refinement,
- the result should include auditable stage evidence,
- possible next routes should be recommended after a final synthesis.

## Do Not Use When

- the user wants immediate execution of one approved task/SWU,
- the work only needs a direct edit,
- the user wants only Invoke design/plan without the refine loop,
- the user wants lifecycle promotion rather than discovery/design refinement.

## Ownership Model

| Capability | Owns |
| --- | --- |
| Refine | Seed design, research decision, runtime handoff, stage dispatch plan, manifest/index, final synthesis, recommended next routes. |
| Context Builder | Evidence baseline and runtime handoff context. |
| Invoke | Define, Design, and Plan artifacts. |
| Interrogation | Critique and readiness verdict artifacts. |
| Distill | Coherent-unit selection, optimization, and repair artifacts. |
| Runtime adapters | Adapter-specific execution status when a durable runtime run is dispatched. |

Task Session and Sigil Development may be recommended after refinement, but they are not stages in the refine loop.

## Refinement Loop

The canonical loop is defined in [Refinement Loop](REFINEMENT-LOOP.md):

```text
Context Builder evidence baseline
  -> Invoke Define
  -> Interrogation
  -> Research decision / bounded research when selected or triggered
  -> Distill
  -> Invoke Redefine / Design
  -> Interrogation
  -> Distill Repair
  -> Invoke Plan
  -> Final Interrogation and Synthesis
```

Every command-backed stage must use the local Arcanum command surface:

```bash
tools/arcanum --exec --output <stage-output> <command> <stage-request>
```

The manifest records the command, resolved command file, requested mode/config, stage output path, observer status, verdict, and blocked reason.

## Research Decision

Refine always records a research decision:

- `no-research`: local repository and supplied context only.
- `bounded-research`: one external comparison pass within the loop's research bounds.
- `research-if-gap-appears`: default; start local-first and ask again only if a named gap appears.

External research never overrides local repository evidence.

## Output

When a refinement run is materialized, Refine writes a target-local run folder:

```text
<target>/development/refinement-runs/<run-id>/
```

That folder contains:

- `RUN-MANIFEST.md`
- `evidence-index.json`
- `REFINE-SEED-PROPOSAL.md`
- `RUNTIME-HANDOFF.md`
- `RESULT.md`
- `stages/`

The manifest references artifacts produced by Context Builder, Invoke, Interrogation, and Distill. It does not duplicate those artifacts.

## Lifecycle Evidence

`refine` is a pilot sigil. Its Experiment Harness lives under [development/](development/):

```text
development/run-example-with-codex.sh next
development/run-validation-fixtures.sh
development/write-experiment-report.sh
```

Promotion requires realistic live outputs for seed proposal, research decision, runtime handoff, valid manifest/index evidence, deterministic `tools/arcanum` stage dispatch evidence, and final synthesis. Proposal-only output is preflight evidence, not completed refinement evidence.

````

## Canonical SKILL Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/arcana/refine/SKILL.md

````markdown
---
name: refine
description: "Use when: turning a vague refinement target, design concern, folder, idea, repository area, or existing work-pack into a refined seed, design, or non-executed plan through the Arcanum refinement loop."
argument-hint: "<target> [--preset compact|standard|full|deep] [--research no|bounded|if-gap]"
tier: arcana
domain: refinement-governance
version: 0.2.0
origin: redesigned as discovery/design loop orchestrator using deterministic Arcanum command dispatch
allowed-tools: Read, Write, Glob, Grep, AskQuestions, Bash, Task
---

# Sigil: Refine

<objective>
Design an initial refinement seed, run the canonical Arcanum refinement loop through the generic Arcanum runtime and deterministic Arcanum command dispatch, index each stage artifact, and return a final refined synthesis.
</objective>

<logic-type>
Arcana: discovery and design orchestration with research decision, critique, repair, non-executed planning, and auditable stage evidence.
</logic-type>

<required-capabilities>

Refine owns the seed, runtime handoff, stage dispatch plan, run manifest, evidence index, research decision, and final synthesis. Stage capabilities own their native artifacts.

| Capability | Required For | Evidence Required |
| --- | --- | --- |
| `context-builder` | Build the evidence baseline and runtime handoff context. | Context pack path or blocked coverage reason. |
| `invoke` | Produce Define, Redefine/Design, and Plan artifacts. | Invoke artifact path, mode, command file, and verdict. |
| `interrogation` | Critique Define, Design, and final synthesis. | Interrogation artifact path, mode, command file, and pass/flag/block verdict. |
| `distill` | Select the coherent unit and run repair/validation before planning. | Distill artifact path, mode, selected unit or repair verdict, and rejected alternatives. |
| `runtime-handoff` | Prepare or validate the durable runtime handoff when available. | Runtime handoff path, adapter, run folder, or blocked reason. |

</required-capabilities>

<canonical-loop>

Every refine run uses this stage list. Presets tune budget, depth, and configuration; they do not remove stages.

1. Context Builder evidence baseline.
2. Invoke Define.
3. Interrogation using `refine-review`.
4. Research decision, with bounded research only when selected or triggered by a named gap.
5. Distill.
6. Invoke Redefine / Design.
7. Interrogation using `refine-design-review`.
8. Distill Repair.
9. Invoke Plan.
10. Final Interrogation and Refine-owned synthesis using `refine-final`.

</canonical-loop>

<stage-dispatch-contract>

Every executable stage must dispatch through the repository-local Arcanum command surface:

```bash
tools/arcanum --exec --output <stage-output> <command> <stage-request>
```

Before a stage runs, Refine must verify:

```bash
tools/arcanum --resolve <command>
```

If resolution fails, the stage is `block` and the blocked reason is recorded. Do not replace a required stage with freeform prose when its command is available.

For each stage, preserve:

- stage name,
- owning command,
- resolved command file,
- requested mode/configuration,
- output path,
- status and verdict,
- observer status when available,
- blocked reason when no artifact exists.

</stage-dispatch-contract>

<stage-configuration>

Default configuration:

- Context Builder: command `context-builder`; mode `standard`; request includes `--strict --emit both --handoff runtime --persist <run-folder>/context-builder`.
- Invoke Define: command `invoke`; mode `define`; input is `REFINE-SEED-PROPOSAL.md` plus Context Builder outputs.
- Interrogation 1: command `interrogation`; mode `refine-review`.
- Research Decision: owner `refine`; mode `no-research`, `bounded-research`, or `research-if-gap-appears`.
- Distill: command `distill`; mode `standard`.
- Invoke Redefine / Design: command `invoke`; mode `design`; request explicitly frames the run as redefining/designing from prior artifacts.
- Interrogation 2: command `interrogation`; mode `refine-design-review`.
- Distill Repair: command `distill`; mode `validate` or an explicitly repair-focused request.
- Invoke Plan: command `invoke`; mode `plan`; output is a non-executed plan artifact.
- Final Interrogation and Synthesis: command `interrogation`; mode `refine-final`, followed by Refine-owned synthesis.

</stage-configuration>

<run-manifest-contract>

Every materialized refinement run must write a target-local evidence folder:

```text
<target>/development/refinement-runs/<run-id>/
```

Required contents:

- `RUN-MANIFEST.md`
- `evidence-index.json`
- `REFINE-SEED-PROPOSAL.md`
- `RUNTIME-HANDOFF.md`
- `RESULT.md`
- `stages/`

Refine owns this folder, the seed proposal, the runtime handoff, the research decision reference, the final result, and the evidence index. Stage commands own their own artifacts. The manifest and index reference those artifacts; they do not copy or redefine them.

A selected stage is invalid when it has neither an artifact path nor a blocked reason. A stage marked `pass` is invalid when its artifact path is missing or does not exist.

</run-manifest-contract>

<applicability>
Use this sigil when:

- the user asks to refine a target, idea, folder, design, plan, repository area, or work-pack,
- the target needs discovery, critique, repair, or design before execution,
- the user needs a budget, research mode, loop evidence, or final refined synthesis,
- a future Task Session, Sigil Development, or other route should be recommended only after refinement.
</applicability>

<non-applicability>
Do not use this sigil when:

- the user wants immediate execution of one already-approved task/SWU,
- the request is a trivial direct edit,
- the user wants only Invoke artifacts without the refine loop,
- the user wants lifecycle promotion rather than discovery/design refinement.
</non-applicability>

<inputs>
Expected inputs, if available:

- target folder, artifact, idea, design concern, plan, work-pack, or repository area,
- desired preset: compact, standard, full, or deep,
- desired research mode: no, bounded, or if-gap,
- existing source context or constraints,
- preferred output location for seed artifacts.
</inputs>

<ownership-boundary>

- Refine owns seed design, loop orchestration, research decision, runtime handoff, manifest/index, final synthesis, and recommended next routes.
- Context Builder owns the evidence baseline and handoff pack outputs.
- Invoke owns Define, Design, and Plan artifacts.
- Interrogation owns critique and readiness verdict artifacts.
- Distill owns coherent-unit selection, optimization, and repair artifacts.
- Runtime adapters own adapter-specific execution status when a runtime run is actually dispatched.
- Task Session and Sigil Development are optional recommended next routes, not refine loop stages.

</ownership-boundary>

<research-policy>
Refine must always record a research decision.

Options:

- `no-research`: use only local repository and supplied context.
- `bounded-research`: one external comparison pass within Refine Loop bounds.
- `research-if-gap-appears`: default; start local-first and ask again only if Interrogation or Distill identifies a named external-context gap.

External research requires explicit confirmation unless the user already selected bounded research for the run. External research cannot override local repository evidence.
</research-policy>

<preset-policy>
Presets tune budget and configuration; they do not remove stages.

- `compact`: shortest stage outputs, lean Context Builder if appropriate, local-first research decision, repair pass may block quickly.
- `standard`: default stage depth with standard Context Builder and Distill.
- `full`: deeper interrogation and distill requests, stronger design/plan output expectations.
- `deep`: full behavior plus checkpointing before expensive or mutation-heavy next-route recommendations.

If no preset is supplied, use `standard`.
</preset-policy>

<process>
1. Resolve the target and decide whether a new seed proposal is needed.
2. Create or update the target-local refinement run folder.
3. Write `REFINE-SEED-PROPOSAL.md` with target, source context, write scope, done criteria, validation surface, preset, research mode, and planned stage configuration.
4. Write `RUNTIME-HANDOFF.md` with the runtime objective, stage dispatch contract, adapter/run fields, blocked fields, and runtime status.
5. For each command-backed stage, resolve the command with `tools/arcanum --resolve <command>`.
6. Dispatch available stages with `tools/arcanum --exec --output <stage-output> <command> <stage-request>`.
7. Record every stage artifact or blocked reason in `RUN-MANIFEST.md` and `evidence-index.json`.
8. Run bounded research only when selected or when `research-if-gap-appears` is triggered by a named gap and the user confirms.
9. After final interrogation, synthesize `RESULT.md` from the seed, stage artifacts, research decision, distill repair, invoke plan, and final verdict.
10. Recommend next routes only after the final synthesis; do not execute them as part of refine.
</process>

<quality-bar>
A successful Refine run must:

- produce a clear seed proposal before stage execution,
- preserve the canonical ten-stage loop,
- use `tools/arcanum` command resolution and execution evidence for command-backed stages,
- materialize a target-local run manifest and evidence index,
- record research mode and confirmation status,
- preserve each stage command's native artifact ownership,
- block unavailable commands or unsafe runtime handoff with exact missing fields,
- produce a final refined synthesis,
- keep Task Session and Sigil Development out of the loop except as optional next-route recommendations.
</quality-bar>

<observability>
For meaningful executions, emit or prepare a post-run signal through the local observability package when available.

Recommended signal fields:

- target,
- selected preset,
- selected research mode,
- research confirmation status,
- runtime handoff status,
- stage command resolution status,
- run manifest path,
- evidence index path,
- runtime handoff path,
- final result path,
- blocked fields,
- recommended next routes.
</observability>

<promotion-gate>
Refine is promotion-ready only after experiment evidence shows:

- vague targets produce useful seed proposals,
- the ten-stage loop is represented in manifest/index evidence,
- command-backed stages resolve through `tools/arcanum`,
- blocked command or runtime execution records exact missing fields,
- bounded research choices are offered and recorded,
- final synthesis is produced from stage artifacts rather than a route proposal,
- Task Session and Sigil Development are only next-route recommendations.
</promotion-gate>

<anti-patterns>
Avoid:

- treating Task Session or Sigil Development as refine loop stages,
- using a Task Session route artifact as refine's route artifact,
- replacing command-backed stages with hand-written prose,
- running external research without the selected mode and confirmation,
- marking refinement complete before final interrogation and synthesis,
- silently falling back from failed runtime handoff or failed command dispatch.
</anti-patterns>

<output-contract>
Return:

```markdown
## Refine Result

- Target: <target>
- Status: pass | flag | block
- Preset: compact | standard | full | deep
- Research: no-research | bounded-research | research-if-gap-appears
- Run manifest: <path>
- Evidence index: <path>
- Seed proposal: <path>
- Runtime handoff: <path>
- Stage evidence:
  - Context Builder evidence baseline: <pass | flag | block>
  - Invoke Define: <pass | flag | block>
  - Interrogation refine-review: <pass | flag | block>
  - Research decision: <pass | flag | block>
  - Distill: <pass | flag | block>
  - Invoke Redefine / Design: <pass | flag | block>
  - Interrogation refine-design-review: <pass | flag | block>
  - Distill Repair: <pass | flag | block>
  - Invoke Plan: <pass | flag | block>
  - Final Interrogation and Synthesis: <pass | flag | block>
- Final synthesis: <summary or blocked reason>
- Recommended next routes: <items or none>
```
</output-contract>

````
