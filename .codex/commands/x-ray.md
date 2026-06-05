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

# Arcanum Sigil: x ray

<!-- arcanum:capability-id x-ray -->
<!-- arcanum:capability-kind sigil -->
<!-- arcanum:capability-tier arcana -->
<!-- arcanum:command x-ray -->

<!-- arcanum:runtime codex -->

## Observer Envelope: Task Zero

Before doing domain work, establish the observer envelope for this Arcanum invocation.

- `run_id`: use an existing hook-provided run id when present; otherwise use `arcanum-x-ray-<UTC timestamp>`.
- `capability.id`: `x-ray`
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

Run the installed Arcanum sigil `x-ray` using the canonical definition snapshot embedded below.

## Process

1. Use the embedded canonical README and SKILL snapshots as the execution contract.
2. Execute only this installed sigil unless the definition explicitly delegates or the user asks to route elsewhere.
3. Preserve the selected sigil's process, quality bar, anti-patterns, output contract, validation gates, gaps, and next route.
4. Return artifact used, command used, validation result, observability result, and next action.

## Guardrails

- Keep this command focused on `x-ray`.
- Do not silently add, remove, or refresh capabilities.
- Do not treat generated observer telemetry as a substitute for the primary result.

## Canonical README Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/arcana/x-ray/README.md

````markdown
# x-ray

`x-ray` is an Arcana sigil seed for turning user-supplied context into a structured HTML explanation page.

It is meant for moments when a user has a component, plan, architecture, process, or system in front of them and wants to understand what it is, what parts matter, how the parts relate, and how information or work moves through it.

## Status

Status: seed.

This package defines the initial contract and validation direction for `x-ray`. It is not promoted and does not yet include a complete HTML renderer or live behavior evidence.

## Problem It Solves

Raw context can be hard to inspect because important structure is often implicit. A system description may hide actors, transformations, data flow, dependencies, decisions, and open questions inside prose, code, diagrams, or planning notes.

`x-ray` makes that structure visible. It guides the user through the context, asks for clarifying intent when needed, and produces a navigable explanation page that helps the user understand the object under inspection.

## Use When

- a user supplies context and wants to understand it step by step,
- the target is a component, process, architecture, plan, workflow, or system,
- an HTML explanation page is a useful output format,
- the explanation should include visual or diagram-like structure,
- data flow, transformations, actors, relationships, and open questions matter.

## Do Not Use When

- the user only wants a short text summary,
- the task is direct implementation rather than explanation,
- the source context is too sensitive to transform into a generated artifact,
- the output needs a production-grade visual renderer,
- live experiment evidence is required but has not been collected.

## Output Model

The target output is an HTML explanation page. The first implementation should define the structure and interaction model before optimizing visual polish.

Expected sections include:

- overview,
- user intent,
- context type,
- actors,
- entities,
- data flow,
- transformations,
- process steps,
- relationships,
- assumptions,
- open questions,
- constructed visuals or diagram-like explanations where useful.

## Ownership Model

| Capability | Owner |
| --- | --- |
| Seed execution | Task Session |
| Sigil lifecycle | Sigil Development |
| Experiment mechanics | Experiment Harness |
| Runtime handoff | Codex Goal adapter when strict coverage passes |
| Promotion readiness | Sigil Development after live examples |

## Development

The seed work-pack lives at [development/WORK-PACK.md](development/WORK-PACK.md).

The refined source seed lives at [development/REFINE-SEED.md](development/REFINE-SEED.md).

Promotion requires live examples for at least one component, one process, and one architecture or plan.

````

## Canonical SKILL Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/arcana/x-ray/SKILL.md

````markdown
---
name: x-ray
description: "Use when: turning user-supplied context about a component, process, architecture, plan, or system into a guided HTML explanation page with structure, flows, actors, transformations, and relationships."
argument-hint: "<context-or-path> [--focus component|process|architecture|plan|system] [--depth quick|standard|deep] [--output <html-path>]"
tier: arcana
domain: context-explanation
version: 0.1.0-seed
origin: created from refine live experiment seed for x-ray
allowed-tools: Read, Write, Glob, Grep, AskQuestions, Bash
---

# Sigil: x-ray

<objective>
Turn supplied context into a user-driven HTML explanation page that reveals structure, actors, data flow, transformations, process steps, relationships, assumptions, and open questions.
</objective>

<logic-type>
Arcana: guided explanation and visual-structure orchestration for ambiguous context.
</logic-type>

<status>
Seed. This contract defines the intended behavior and validation surface. It is not promoted and does not yet prove live runtime quality.
</status>

<applicability>
Use this sigil when:

- the user provides context and wants to understand what it is about,
- the target is a component, process, architecture, plan, workflow, or system,
- the explanation should be stepwise and user-driven,
- HTML is the desired output surface,
- diagram-like visual structure would help explain flows, transformations, or relationships.
</applicability>

<non-applicability>
Do not use this sigil when:

- a short plain-language summary is enough,
- the user wants implementation instead of explanation,
- the context should not be transformed into a generated artifact,
- a production renderer or polished design system is required immediately,
- there is not enough context to identify the object under inspection.
</non-applicability>

<inputs>
Expected inputs:

- supplied context text or a path to local context,
- optional focus: component, process, architecture, plan, or system,
- optional user question or intent,
- optional output path for the HTML page,
- optional constraints on depth, audience, or visual style.
</inputs>

<process>
1. Resolve the input context and identify what kind of object the user wants to inspect.
2. Ask one clarification question when the intent, audience, or inspection focus is ambiguous.
3. Build a compact explanation model:
   - overview,
   - actors,
   - entities,
   - data flow,
   - transformations,
   - process steps,
   - relationships,
   - assumptions,
   - open questions.
4. Select a page structure that matches the context type.
5. Create constructed visuals or diagram-like sections only when they clarify the model.
6. Produce an HTML explanation page or, in seed mode, an output-shape plan for that page.
7. Validate that the explanation stays tied to the supplied context and separates evidence from inference.
8. Report any missing context that prevents a trustworthy explanation.
</process>

<output-contract>
Return:

```markdown
## x-ray Result

- Status: pass | flag | block
- Context type: component | process | architecture | plan | system | mixed | unknown
- User intent: <resolved intent or open question>
- Output: <html path or planned output>
- Explanation model:
  - overview: <summary>
  - actors: <items>
  - entities: <items>
  - data flow: <items>
  - transformations: <items>
  - process steps: <items>
  - relationships: <items>
  - assumptions: <items>
  - open questions: <items>
- Visual plan: <constructed visuals or none>
- Evidence boundary: <what came from source vs inference>
- Validation: <checks performed or blocked reason>
```
</output-contract>

<quality-bar>
A successful `x-ray` run must:

- identify the type of context being analyzed,
- preserve the user's inspection intent,
- produce a structured explanation rather than a loose summary,
- include actors, entities, flows, transformations, relationships, assumptions, and open questions when relevant,
- use visuals only when they make the explanation clearer,
- keep generated visual structure tied to the source context,
- distinguish evidence from inference,
- emit or prepare an HTML explanation page shape,
- report blockers when context is insufficient.
</quality-bar>

<anti-patterns>
Avoid:

- inventing system structure not grounded in the supplied context,
- producing a decorative page that does not explain the object,
- skipping the user's intent and defaulting to generic documentation,
- treating every context as software architecture,
- making visuals that obscure the explanation,
- claiming production renderer readiness from seed artifacts,
- promoting the sigil before live examples exist.
</anti-patterns>

<observability>
For meaningful executions, record:

- context type,
- input size and source shape,
- clarification needed or not,
- output path or blocked reason,
- visual sections produced,
- evidence/inference boundary quality,
- missing-context gaps,
- user correction signals.
</observability>

<promotion-gate>
Promotion requires Sigil Development review plus Experiment Harness evidence for:

- one component example,
- one process example,
- one architecture or plan example,
- at least one generated HTML output body,
- one blocked or flagged example showing insufficient context handling.
</promotion-gate>

````
