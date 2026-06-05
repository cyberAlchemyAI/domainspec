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

# Arcanum Sigil: dispatch spec

<!-- arcanum:capability-id dispatch-spec -->
<!-- arcanum:capability-kind sigil -->
<!-- arcanum:capability-tier formulae -->
<!-- arcanum:command arcanum-sigil-dispatch-spec -->

<!-- arcanum:runtime codex -->

## Observer Envelope: Task Zero

Before doing domain work, establish the observer envelope for this Arcanum invocation.

- `run_id`: use an existing hook-provided run id when present; otherwise use `arcanum-arcanum-sigil-dispatch-spec-<UTC timestamp>`.
- `capability.id`: `dispatch-spec`
- `capability.kind`: `sigil`
- `capability.tier`: `formulae`
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

Run the installed Arcanum sigil `dispatch-spec` using the canonical definition snapshot embedded below.

## Process

1. Use the embedded canonical README and SKILL snapshots as the execution contract.
2. Execute only this installed sigil unless the definition explicitly delegates or the user asks to route elsewhere.
3. Preserve the selected sigil's process, quality bar, anti-patterns, output contract, validation gates, gaps, and next route.
4. Return artifact used, command used, validation result, observability result, and next action.

## Guardrails

- Keep this command focused on `dispatch-spec`.
- Do not silently add, remove, or refresh capabilities.
- Do not treat generated observer telemetry as a substitute for the primary result.

## Canonical README Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/formulae/dispatch-spec/README.md

````markdown
# Dispatch Spec

Status: draft Formulae package.

`dispatch-spec` is a deterministic contract for describing how Arcanum sigils and spells are chained, fanned out, debated, validated, and handed off inside a larger spell.

It is inspired by Weaver's separation between routing, execution, safe result frames, orchestration, and audit traces. In Arcanum terms, it gives Necronomicon, Spellcraft, Invoke, and runtime adapters a shared object for answering:

- which sigils are being offered or selected,
- what order they run in,
- whether a step is sequential, fan-out, tournament, dialectic, validation, or synthesis,
- which output frame from one step becomes the input substrate for the next,
- what gates, stop conditions, and residue ledgers must exist,
- whether the proposed order should be evaluated before execution.

## Purpose

The package turns user language such as:

```text
use dialectics to explore/exploit, then distill, x-ray the architecture, run toy games, and use a Pareto-aware decision process to find the best abstraction
```

into an inspectable dispatch document:

```text
intent -> capability menu -> selected sequence -> gated execution -> frame handoffs -> synthesis -> evaluation
```

The Formulae role is validation, not interpretation. A synthesizing capability such as Necronomicon, Invoke, Spellcraft, Distill, or Structured Interview Kits may propose a dispatch document. `dispatch-spec` checks whether the document is well formed.

## Weaver Mapping

| Weaver Concept | Arcanum Dispatch Concept |
| --- | --- |
| `SelectableItem` | Candidate sigil/spell/mode offered to the operator |
| `ChoiceCard` | Bounded route menu, usually 3-7 viable next sigils or patterns |
| `RoutingDecision` | Selected sigil, spell, mode, or dispatch pattern |
| `Capability` | Named Arcanum sigil, spell, runtime adapter, or deterministic transform |
| `CapabilityToken` | Permission/approval scope for an execution step |
| `PolicyDecision` | Gate result: allow, deny, ask, defer, or block |
| `Frame` | Safe output summary from a sigil/spell run |
| `Handle` | Reference to a raw artifact, report, HTML page, work-pack, or ledger |
| `TraceEvent` | Observability signal tied to `dispatch_id` and step id |
| ChainWeaver DAG | Spellcraft/Necronomicon dispatch graph |

## Relationship To Arcanum

`dispatch-spec` does not replace the owner capabilities:

- Necronomicon owns repository memory, route selection, and no-promotion guardrails.
- Invoke owns define/design/plan/handoff authoring.
- Spellcraft owns reusable spell composition and lifecycle judgment.
- Distill owns optimization-point selection, tournament reasoning, and recomposition proof.
- Task Session owns bounded execution.
- Experiment Harness owns repeatable validation runs.
- Signal Observer and Workflow Reflect own observed invocation learning.

`dispatch-spec` only validates the shape of a proposed composition.

## Files

| File | Purpose |
| --- | --- |
| [dispatch.schema.json](dispatch.schema.json) | Draft JSON Schema for dispatch documents. |
| [SKILL.md](SKILL.md) | Formulae execution contract for validating a dispatch document. |
| [WEAVER-EXTRACTION.md](WEAVER-EXTRACTION.md) | Extracted useful concepts from `dgenio/weaver-spec`. |
| [ARCANUM-DISPATCH-SYNTHESIS.md](ARCANUM-DISPATCH-SYNTHESIS.md) | Synthesis, taxonomy, sentence grammar, and example sigil sequences. |

## First Integration Target

The first useful integration is Necronomicon route planning:

```text
user intent
  -> Necronomicon extracts Arcanum vocabulary and candidate capabilities
  -> dispatch-spec validates the proposed route graph
  -> Spellcraft uses the route graph when the sequence should become a reusable spell
  -> Invoke emits authoring artifacts when define/design/plan material is needed
  -> Observed Invocation Loop records dispatch_id across all steps
```


````

## Canonical SKILL Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/formulae/dispatch-spec/SKILL.md

````markdown
# Dispatch Spec Skill

## Identity

- Canonical ID: `dispatch-spec`
- Tier: Formulae
- Status: draft
- Scope: repository-local validation package

## Purpose

Validate a dispatch document that describes a sequence, fan-out, tournament, dialectic, validation loop, or synthesis graph over Arcanum sigils and spells.

This skill does not decide which sigils should be used. It checks whether a proposed composition is explicit enough for Spellcraft, Necronomicon, Invoke, Task Session, Experiment Harness, and observability tooling to consume safely.

## Use When

- A user wants to chain sigils by name into a repeatable route.
- Necronomicon proposes an execution route and needs a schema-valid handoff.
- Spellcraft is designing a spell and needs a phase/step contract before lifecycle work.
- Robot-Talks, Distill tournament, or another multi-agent pattern needs sibling steps tied by one `dispatch_id`.
- A run should record how outputs from one sigil become inputs to another.

## Do Not Use When

- The task needs interpretation but no reusable dispatch artifact.
- The user asks for immediate execution of a single, obvious sigil.
- A blocker decision exists about the route itself; use `decision-gate` first.
- The workflow would copy sigil internals instead of referencing sigils by id.

## Required Input

A JSON document conforming to [dispatch.schema.json](dispatch.schema.json).

## Validation Rules

1. The document must include `dispatch_id`, `intent`, `mode`, `steps`, and `gates`.
2. Each step must reference a known or candidate `capability_ref`.
3. Each step must declare a `pattern`: `route`, `sequential`, `fanout`, `dialectic`, `tournament`, `distill`, `xray`, `decision`, `validation`, `toy_game`, `synthesis`, or `handoff`.
4. Non-first steps must name at least one input source: prior `frame`, `handle`, `decision`, `ledger`, `human_answer`, or `external_context`.
5. Any step with `parallel: true` must declare `join_policy`.
6. Tournament and dialectic steps must declare proposal roles and convergence criteria.
7. Validation and toy-game steps must declare an expected evidence artifact.
8. The dispatch must name stop conditions and at least one observability event.
9. The dispatch must not claim promotion authority for inventory, ontology, glossary, sigil, or spell artifacts.

## Output Contract

```markdown
## Dispatch Spec Result

- Dispatch ID: <dispatch_id>
- Status: pass | flag | block
- Mode: <mode>
- Step count: <n>
- Patterns: <patterns found>
- Gates: <pass | flag | block with reasons>
- Handoffs: <frame/handle/decision/ledger summary>
- Observability: <dispatch_id coverage and trace events>
- Promotion guardrail: pass | flag | block
- Required repairs: <none or list>
- Next route: necronomicon | spellcraft | invoke | task-session | experiment-harness | decision-gate | deferred
```

## Failure Policy

- Return `block` when required fields are missing, step dependencies are impossible, or promotion authority is falsely claimed.
- Return `flag` when the document is usable but has weak evidence names, candidate capabilities, or incomplete observability metadata.
- Return `pass` only when the route is explicit, gated, observable, and handoff-ready.


````
