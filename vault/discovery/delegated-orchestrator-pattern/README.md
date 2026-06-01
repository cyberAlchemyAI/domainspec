---
tags: [vault, discovery, subagents, orchestrator, delegation, protocol, context-isolation]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, technical
status: draft
version: 0.1.0
last_updated: 2026-05-28
---

# Delegated Orchestrator Pattern

## Objective

Name the **delegated orchestrator** pattern: an intermediate subagent that owns an entire multi-wave protocol and returns ONE clean artifact to its caller. The defining move is **relocating the strategist role from the parent Claude session into a delegated subagent**. The property won is **parent context isolation** — the conversation thread never sees the protocol's intermediate dumps.

## Context

This discovery was triggered by two convergent signals. First, the user memory `synthesis-only-multi-agent.md` flagged raw subagent dumps as noise in the parent conversation. Second, the user explicitly proposed an intermediate synthesizer and asserted the design space was already covered by existing skills ("Acho que temos todas as respostas no repo"). The researcher confirmed the substrate exists but the *role-relocation move* has never been named.

## The pattern (precise)

The **orchestrator** is a delegated subagent whose job is to enact the strategist role (R24) on behalf of the parent: it composes the spec, dispatches each wave of workers, runs the validator gate, iterates promotion between waves, and produces a single synthesized artifact. The **parent session** does one Task dispatch into the orchestrator, performs a final-detail check on the returned artifact, and responds to the user. The **worker agents** (researcher, writer, reviewers) are dispatched *by the orchestrator*, not by the parent, so their verbatim outputs are absorbed inside the orchestrator's context and never bubble up. The contract back to the parent is **one path + one summary**, not the raw two-file pair that `domainspec-subagents-strategy` currently emits to the parent.

## What this is NOT (3 distinctions)

- **vs. router** (`gsd-do`, `domainspec-orchestrate`): a router chooses *which* skill to invoke and hands off — single-shot, stateless across protocol stages. The orchestrator is multi-round and owns inter-wave state.
- **vs. fan-out / robot-talks**: a fan-out parallelizes a single wave; `robot-talks` produces a tensions *audit list*, not a finished deliverable, and the parent still owns synthesis (`/Users/victorboscaro/domainspec/.claude/skills/robot-talks/SKILL.md:54-62`). Neither runs multiple waves with promotion nor returns a single finished artifact.
- **vs. base `domainspec-subagents-strategy`**: the strategy skill describes the *shape* of multi-wave protocols and supplies the validator/lifecycle machinery, but at `/Users/victorboscaro/domainspec/.claude/skills/domainspec-subagents-strategy/SKILL.md:8` it pins the strategist role to "you (the parent Claude session)". The orchestrator pattern relocates that role into a delegated subagent.

## Why this is a gap

No existing vault document names the design move "delegate the strategist itself". The closest sibling, `vault/discovery/subagents-strategy-refinement/`, enumerates 10 refinements to the base strategy (role taxonomy, per-layer composability, max_loops, typed exit_reason, lean topology, etc.), and **none of them name role relocation**. `vault/discovery/multi-agent-implementation-strategy/README.md:96-101` defers the deep multi-agent design pending an empirical trigger and is implementation-side, not investigation-side. `vault/discovery/harness-as-enforcement-layer/README.md:41-45` asks a related question but at the wrong layer — runtime/host, not in-protocol agent. The gap is precisely the *role-assignment* layer between these.

## Working model

### The role relocation

```
TODAY (R24 — strategist = parent):                 PROPOSED (strategist = delegated):

Parent session                                     Parent session
  ├─ dispatches researcher                           └─ dispatches ORCHESTRATOR
  ├─ dispatches writer                                    ├─ dispatches researcher
  ├─ dispatches reviewers                                 ├─ dispatches writer
  ├─ reads each raw output         <-- noise              ├─ dispatches reviewers
  ├─ iterates waves                                       ├─ iterates waves
  ├─ synthesizes                                          ├─ synthesizes
  └─ responds to user                                     └─ returns ONE artifact
                                                     └─ parent: final-detail check + reply
```

### When this pattern pays rent (trigger conditions)

1. Protocol-context cost in the parent exceeds ~10k tokens.
2. The protocol requires ≥ 2 waves with promotion between waves.
3. The protocol requires iteration (`loop_cap > 1`).
4. The user has signaled explicit context-noise aversion (cf. `synthesis-only-multi-agent.md`).

Below these triggers, inline parent orchestration remains the right answer.

### What it inherits from base

All machinery is reused from `/Users/victorboscaro/domainspec/.claude/skills/domainspec-subagents-strategy/SKILL.md`:

- Spec composition (single / flat fan-out / nested waves / ping-pong duos), `SKILL.md:16-21`.
- Validator gate and retry counter (R26).
- Lifecycle: dispatch → collect → write → promote, `SKILL.md:175-187`.
- Writer agents (research-writer + findings-writer), `SKILL.md:178-184`.
- Telemetry and typed `exit_reason` taxonomy (R31), `SKILL.md:208-222`.
- Synthesis-layer parent-pin (the orchestrator becomes the "parent" for the layer it owns), `SKILL.md:102`.

No new machinery. The orchestrator is a *re-host* of the existing lifecycle, not a re-implementation.

### What is genuinely new

- **Role assignment**: the strategist is a delegated subagent, not the parent session — a direct override of R24 (`SKILL.md:8`) scoped to delegated invocations.
- **The "one clean artifact" contract shape**: a single returned path + summary, not the verbatim child outputs the parent currently absorbs (`SKILL.md:175-176`).
- **User-gate handling under delegation**: how R3 Step 2's explicit confirmation gate (`SKILL.md:159-163`) routes back through the parent when the strategist is delegated — see OQ-B.

## Open questions

1. **OQ-A — Skill vs. invocation pattern.** Is the orchestrator a new skill, or is it `domainspec-subagents-strategy` invoked from a delegated agent (no new code)? Researcher leans **invocation-pattern first, skill second** — name the pattern, defer the artifact, matching the `multi-agent-implementation-strategy` precedent.
2. **OQ-B — User-gate routing.** R3 Step 2 requires explicit user confirmation before persistence (`SKILL.md:159-163`). Under delegation, does (a) the orchestrator return the gate to the parent for the user to confirm in the parent thread, or (b) the parent pre-authorize the orchestrator? Load-bearing — determines whether the orchestrator is **autonomous** or **gated**.
3. **OQ-C — The "one clean artifact" contract.** What is its shape? Markdown body, path-to-file, structured handoff? Likely **one path + one summary**, not the verbatim two-file pair.
4. **OQ-D — Trigger conditions.** When does the pattern pay rent vs. inline orchestration? Researcher's draft triggers above; needs empirical confirmation.
5. **OQ-E — Aggregate exit_reason.** R31 defines a closed taxonomy per dispatch (`SKILL.md:208-222`). The orchestrator absorbs N dispatches. How does the *aggregate* exit_reason compose? Does `dissent_irreconcilable` in a child wave collapse the whole orchestrator, or just that wave?
6. **OQ-F — Constitution placement.** Should the orchestrator's lifecycle be backported into `domainspec-subagents-strategy-constitution.md` as an additive amendment (R27 pathway, precedent at `subagents-strategy-refinement/principle.md:34-36`), or land in a new constitution? No commitment; surface the choice.
7. **OQ-G — Validator composition.** Does the orchestrator need its own validator, or does it inherit per-wave validators? Composing N validators may double-charge for spec discipline — or be exactly right for multi-wave protocols.

## Alternatives considered

- **A-1: Keep the strategist in the parent and rely on synthesis-time discipline (writers + telemetry).** Rejected: the user empirically rejected this in `synthesis-only-multi-agent.md`; the noise reappears at protocol time, not synthesis time, so synthesis-time discipline cannot solve it.
- **A-2: Build a wholly new machinery (novel state, novel artifact shape, novel validator) instead of relocating the role.** Rejected: violates schema-before-instance and duplicates components that already exist in `domainspec-subagents-strategy`. The researcher's strongest claim is that this is a role assignment, not new machinery.
- **A-3: Extend `subagents-strategy-refinement` in-place as refinement #11.** Rejected: that discovery's 10 refinements all assume the parent enacts the strategist; role relocation is structurally different and deserves its own discovery node so the relation `extends` is explicit rather than buried.

## Connections

| Document | Type | Description |
|---|---|---|
| `../subagents-strategy-refinement/` | `extends` | Closest sibling; the base+refinement assume the parent session enacts the strategist. This discovery names the move "relocate the strategist into a delegated agent." Cross-link mandatory. |
| `../../constitution/domainspec-subagents-strategy-constitution.md` | `cites` | Source of R24 (parent = strategist) and the validator/lifecycle machinery the orchestrator reuses. |
| `../../../.claude/skills/domainspec-subagents-strategy/SKILL.md` | `cites` | Skill body anchoring the lifecycle the orchestrator absorbs (`SKILL.md:8`, `:102`, `:175-187`, `:208-222`). |
| `../multi-agent-implementation-strategy/README.md` | `contrasts-with` | Implementation-side counterpart that considered "wrap multi-agent under one entrypoint" and deferred. Useful contrast: this discovery answers the same shape question for *investigation*. |
| `../harness-as-enforcement-layer/README.md` | `relates-to` | The harness layer determines what is mechanically enforceable in a delegated agent (e.g., the orchestrator's loop_cap). Intersects OQ-A (skill vs. harness primitive). |

## Next moves

1. **Validate empirically.** Run one real multi-wave protocol (e.g., this very discovery) with the orchestrator-as-subagent shape; confirm parent context stays clean and the returned artifact is usable without re-reading raw worker outputs.
2. **Decide OQ-A** (skill vs. invocation pattern) after the first empirical run — let the artifact's surface area declare itself.
3. **Decide OQ-B** (user-gate routing) before any persistence-touching orchestrator runs; this is the load-bearing safety question.
4. **Backport into `domainspec-subagents-strategy-constitution.md`** as an additive R27 amendment, *only if* the pattern survives validation across ≥ 2 protocol shapes (single fan-out + nested waves at minimum).
5. **Cross-link from `synthesis-only-multi-agent.md`** memory — name this discovery as the structural answer to the noise the memory recorded.
