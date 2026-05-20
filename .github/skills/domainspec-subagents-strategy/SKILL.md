---
name: domainspec-subagents-strategy
description: Parametrize and govern any subagent dispatch — single, flat fan-out, or nested waves — under one schema. Use whenever an R1 trigger holds; the (goal, layers, agents, models) spec collapses to the right shape. Subsumes the deleted `nested-subagents-strategy` skill.
---

# Subagents-Strategy Skill

Operationalizes [vault/constitution/domainspec-subagents-strategy-constitution.md](../../../vault/constitution/domainspec-subagents-strategy-constitution.md). When this skill is active, **you (the parent Claude session) enact the strategist role** (R24).

Every dispatch — whether one agent or three waves — is described by a single **strategy spec** (goal, layers, per-agent angles, per-agent models, stop conditions, telemetry). The spec is composed in chat, validated, narrated, user-confirmed, THEN persisted as a dispatch artifact. The 7-step lifecycle from the constitution is preserved as **R3 Step 1 / R3 Step 2 / R3 Step 3** anchors; Steps 0, 0.5, and 2.5 are added around them.

## When to invoke

Invoke when an R1 trigger holds: synthesis (3+ sources), context protection (>~500 tokens), isolation (discardable exploration), or parallelism (independent tasks where wall-clock saving beats orchestration cost). If none holds, do not dispatch.

This skill subsumes four dispatch shapes:

- **Single dispatch** — `layers: 1`, `n: 1`. The spec is still composed (cheap), but R2's two-file artifact set is NOT produced (constitution carve-out for `single` mode). **Validator is also skipped** when `mode: single` AND `layers: 1` AND `n: 1` AND `bootstrap_override` is not set — the chat-emitted spec is enough discipline for trivial lookups.
- **Flat fan-out** — `layers: 1`, `n ≥ 2`, `parallel: true`. The classic task-fan-out / robot-talks shape.
- **Nested waves** — `layers: 3+` with roles `investigate → evaluate → synthesize` (optionally `meta-evaluate`). Generation and judgment are separated across waves; the parent owns synthesis.
- **Ping-pong duos** — `mode: ping-pong`, exactly 2 duo layers alternating sequentially over the full file set. Each duo is a fresh pair of eyes on what the other just did. Convergence terminates when both duos return "no changes" twice in a row (4 consecutive zero-edit passes total). A `final_validator` runs once after convergence. Use when artifact quality is iterative and the bottleneck is reviewer drift, not coverage.

All four collapse out of the same schema. There is no separate nested skill — `nested-subagents-strategy` was deleted in the same change that introduced this parametrization. Do not link to it.

---

## The strategy spec (load-bearing)

The spec is composed **in chat** during Step 0 and only persisted to disk in Step 2.5 (AFTER user confirm) as a content-addressed YAML artifact:

```
vault/snapshots/dispatches/YYYY-MM-DD-<slug>-spec.yaml
```

For `dispatch_kind: meta` the path is `vault/snapshots/meta-dispatches/<slug>/spec.yaml`.

Because nothing persists before the user gate, R4 (proposal never persists) and R6a (user confirmation fully reversible) are honored strictly: on Abandon, **NOTHING is written**. The post-confirm write is the strategist's only file persistence, narrowly scoped to a dispatch artifact tracked by content hash — an acceptable extension of R5's "dedicated writer" pattern (the parent acts as the spec-writer in the same sense the skill body acts as the strategist).

### Schema

```yaml
spec_version: "0.2.0"
dispatch_id: <slug — UUIDv7 or YYYY-MM-DD-<topic>-<seq>>
dispatch_kind: standard | meta            # meta = a dispatch that itself dispatches dispatches
context: <2–4 sentences of inherited context>
goal: <one sentence — the single thing this dispatch must answer>
mode: single | task-fan-out | robot-talks | sequential | ping-pong     # R19. `mixed` is RESERVED.
heuristic_row: single-lookup | flat-fanout | triangulation | adversarial-audit | parent-synthesis | meta-dispatch | ping-pong-duos
loop_cap: <int, default 2, max 5>          # typed mechanical floor; harness MUST refuse loop N+1
bootstrap_override:                          # optional; required object shape when present
  reason: <non-empty string>
  scope: <one of: spec-only | telemetry-only | working-folder | full>
layers:
  - layer_id: <stable id, e.g. L1-investigate>
    role: investigate | evaluate | meta-evaluate | synthesize
    n: <int >= 1>
    parallel: <bool>
    model: <default model id for this layer — string | "parent">
    agents:
      - agent_id: <stable id, e.g. L1-A1>
        angle: "<one sentence>"
        model: <string | "parent">
        difficulty_justification: "<one-line R14 justification>"
        token_budget: <int>
        expected_output_shape: "<one sentence — what the agent returns>"
stop_conditions:
  - <each as one sentence — free-text human-readable conditions in addition to loop_cap>
validator:
  model: <model id>
  retry_policy: one-retry-then-escalate     # R26
  checklist: [<each item from the canonical checklist below>]
telemetry:
  event_name: subagent-strategy.dispatched
  corpus_hash_at_emit: <from latest vault/snapshots/*.json>
  spec_hash: <sha256 of this spec YAML, filled at Step 2.5>
recursion_budget:                            # R13 — defaults depth=2 breadth=5 total=10
  depth: 2
  breadth: 5
  total: 10
  parent_dispatch_id: <upstream dispatch_id or null>
working_folder: docs/features/<feature>/research/<topic>/   # R15
iteration:                                   # REQUIRED iff mode == ping-pong; absent otherwise
  kind: ping-pong
  duos:                                       # exactly two; each entry references a layer_id whose role is `evaluate`
    - <layer_id of duo A>
    - <layer_id of duo B>
  file_set: <path or glob — the full artifact set both duos read each pass>
  convergence:
    consecutive_no_change_passes: 4           # default 4 = 2 per duo. Must be even and >= 2.
  max_passes: 12                              # hard ceiling regardless of convergence. Refuse pass N+1.
  final_validator:                            # distinct from the Step 0.5 spec validator
    model: <model id>
    angle: "<one sentence — what the final validator certifies>"
    checklist: [<each item one sentence>]
```

`mode: mixed` is a **reserved** value pending a `depends_on` field on agents (for arbitrary DAG semantics). The validator MUST reject any dispatch with `mode: mixed` until the schema gains DAG support. Tracked as **OQ-mixed-dag-schema**.

### Role ordering invariant

`synthesize` may never precede `evaluate`; `meta-evaluate` may never precede `evaluate`. Investigate is always first. The validator enforces this. Synthesize layers MUST set `model: "parent"` — there is no override path.

---

## Agent-chosen defaults (heuristic table)

When the user does not specify layers/n/models, the agent picks a row from this table AND records `heuristic_row: <id>` in the spec. No row → no auto-pick; ask the user.

| `heuristic_row` id | If goal is… | Layers | n per layer | Default model |
|---|---|---|---|---|
| `single-lookup` | single targeted lookup | 1 (investigate) | 1 | haiku |
| `flat-fanout` | 2–4 independent subtasks, no triangulation | 1 (investigate, parallel) | n = tasks | sonnet |
| `triangulation` | load-bearing triangulation needed | 3 (investigate → evaluate → synthesize) | 3–5 / 2–3 / parent | sonnet investigate, sonnet evaluate, parent synth |
| `adversarial-audit` | high-stakes adversarial audit | 4 (add meta-evaluate) | 5–7 / 2–3 / 2 / parent | opus investigate-key + synth + validator; sonnet rest |
| `parent-synthesis` | nested wave where parent does final synth | 3+ | layer-dependent | last layer `model: "parent"` |
| `meta-dispatch` | dispatch that dispatches dispatches | varies | varies | `dispatch_kind: meta` |
| `ping-pong-duos` | iterative full-set review until edit-drift stops | 2 evaluate layers (duo A, duo B) + final-validator | 2 / 2 / 1 | sonnet duos, opus final-validator |

Model ids are free strings (the `model` field is a union: `string | "parent"`). There is no fixed tier vocabulary; the row names a starting point that the user revises in R3 Step 1 chat. R14 (per-child justification) still requires `difficulty_justification` on every agent.

---

## Validator checklist (canonical, 9 items)

The Step 0.5 validator agent receives the **in-chat spec YAML** in its briefing (no file path — the spec has not been written yet) and returns one of: `accept` / `reject-with-fixes` / `abstain` / `accept-with-bootstrap-override`. Per R26: **one retry only**, then escalate to the user.

1. `goal` is a single sentence and is load-bearing — cite the criterion that makes it so.
2. Layers are well-typed; the role order invariant holds (no synthesize-before-evaluate, no meta-evaluate-before-evaluate); synthesize layers use `model: "parent"`.
3. Per-agent angles are mutually non-overlapping AND jointly close to covering the goal (independence + coverage in one check).
4. Each agent has a non-empty `difficulty_justification` (R14); flag any opus pick without a model-specific reason.
5. `loop_cap` is present and ≤ 5; `stop_conditions` declares at minimum: validator rejection, evaluator-irreconcilable contradiction, agent-count cap.
6. Telemetry block names `subagent-strategy.dispatched` and includes `corpus_hash_at_emit` from the latest `vault/snapshots/*.json`.
7. `mode: mixed` is rejected unconditionally until OQ-mixed-dag-schema is resolved.
8. `dispatch_kind: meta` dispatches set `parent_dispatch_id` and target the meta-dispatch path.
9. If `bootstrap_override` is set, the object MUST include a non-empty `reason` and a valid `scope`; reject otherwise.
10. If `mode: ping-pong`, the `iteration` block is present with `kind: ping-pong`, exactly two `duos` referencing `evaluate` layers in the spec, `consecutive_no_change_passes` is even and ≥ 2, `max_passes` is set and ≥ `consecutive_no_change_passes`, and `final_validator` declares `model`, `angle`, and a non-empty `checklist`. Reject if `mode: ping-pong` without the block, or if the block exists with `mode != ping-pong`.

**Validator skip rule:** when `mode: single` AND `layers: 1` AND `n: 1` AND `bootstrap_override` is NOT set, the validator is skipped entirely. For every other shape, the validator runs.

A `reject-with-fixes` return lists the failing checklist item(s); the parent revises the in-chat spec and re-validates **once**. A second reject escalates to the user (R26). The validator is itself a subagent dispatch — the one exception to "validator gates dispatch": it gates the *child* dispatches, not itself.

---

## The 9-step lifecycle (R3 Step 1 / 2 / 3 preserved)

Steps 1–7 are the constitution's R3 lifecycle; Step 1/2/3 are anchored as **R3 Step 1 / R3 Step 2 / R3 Step 3**. Steps 0, 0.5, and 2.5 are the new param/validate/persist machinery.

### Step 0 — Compose strategy spec IN CHAT
You (strategist) read the user's request, pick a `heuristic_row` if no explicit layout was given, and **render the spec YAML inline in the chat turn**. No file is written. The spec IS the machine-readable form of the proposal that R3 Step 1 narrates in human form.

### Step 0.5 — Run the validator (against the in-chat spec)
Skip if the trivial single-mode rule applies. Otherwise dispatch a single-agent validator (model from `validator.model`) with the spec YAML and the canonical checklist passed inline in the briefing. Return is `accept | reject-with-fixes | abstain | accept-with-bootstrap-override`. On `reject-with-fixes`: parent revises the in-chat spec and re-validates **ONCE**. A second reject escalates per R26.

### R3 Step 1 — Chat proposal
The same turn as Step 0 (or its revision): the in-chat spec, narrated in human-readable form — mode, per-agent table (`agent_id`, model, `difficulty_justification`, `token_budget`, `expected_output_shape`), sequencing, `recursion_budget`, `working_folder`, Context + Goal (R23). **No file is written.**

### R3 Step 2 — User confirms / revises / abandons (R6a)
Wait for explicit user response.
- **Confirm** → proceed to Step 2.5.
- **Revise** → re-draft the in-chat spec (re-run the validator if structural fields change).
- **Abandon** → stop. **NOTHING persists.** R6a fully reversible.

### Step 2.5 — Persist the spec (post-confirm)
Now, AFTER user confirm, the parent writes the validated spec YAML to `vault/snapshots/dispatches/YYYY-MM-DD-<slug>-spec.yaml` (or `vault/snapshots/meta-dispatches/<slug>/spec.yaml` if `dispatch_kind: meta`), computes `spec_hash`, and stamps it into the spec's telemetry block. This satisfies R5: the write happens after the user gate, as part of dispatch initialization, not as a phantom-state hazard. The spec is now a legitimate dispatch artifact tracked by content hash.

### R3 Step 3 — Telemetry emit + single-message fan-out (R8)
Append a JSONL line to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` containing `event_name`, `spec_hash`, `corpus_hash_at_emit`, `mode`, `dispatch_kind`, `dispatch_id`, `parent_dispatch_id`, and timestamp — **before** the first child dispatch (cleaner audit trail).

Then dispatch all children in **one** assistant message. Each child's briefing carries the R10 fields. For nested layouts: children of layer N are dispatched only after layer N−1 returns. For recursion: track running agent count; refuse at R13 `total` cap (and `loop_cap` after N loops) and escalate to the user.

Children DO NOT write files (R5). They return findings.

### Step 4 — Collect and return
Gather verbatim child outputs, bundle with original Context + Goal and working-folder path. **Strategist writes no files beyond the Step 2.5 spec.**

### Step 5 — Dispatch `domainspec-subagents-research-writer`
Briefing contains collected child returns (verbatim), Context + Goal, working folder. Agent persists `<working_folder>/domainspec-subagents-research.md`.

**Single-mode carve-out:** when `mode: single`, R2 exempts the dispatch from the two-file artifact set. Skip Steps 5 and 6; the briefing + child return is the audit trail. Step 7 still applies if the single agent produced a discoverable claim.

### Step 6 — Dispatch `domainspec-subagents-findings-writer`
Briefing contains path to `domainspec-subagents-research.md` and original Context + Goal. Agent persists `<working_folder>/domainspec-subagents-findings.md` per R16/R17/R18/R21/R22. The Dispatch record MUST include the spec file path and the telemetry emission status.

### Step 7 — User-gate discovery promotion (R6b)
Present the findings file and ask whether to promote to a discovery. On confirm, classify scope (`knowledge` → `vault/discovery/<topic>-definitions/<slug>.md`; `application` → `docs/features/<feature>/discovery/<slug>.md`) per R15, propose 1–3 candidate paths, user confirms, dispatch `domainspec-discovery-writer`.

---

## Subsumption story

**Single dispatch.** `mode: single`, `layers: [{role: investigate, n: 1}]`. Spec composed in chat; validator SKIPPED (trivial rule). R3 Step 1 is a one-line "I will ask agent X for Y." On confirm, Step 2.5 persists the spec, telemetry emits, dispatch inline. R2's artifact pair is skipped per the `single` carve-out.

**Flat fan-out.** `mode: task-fan-out` or `robot-talks`, `layers: [{role: investigate, n: 3, parallel: true, agents: [...]}]`. Validator confirms angles are non-overlapping and jointly covering. All N agents dispatch in one message (R8). Two-file artifact set is produced.

**Nested waves.** `layers: [{role: investigate, n: 5, parallel: true}, {role: evaluate, n: 3, parallel: true}, {role: synthesize, n: 1, parallel: false, model: "parent"}]`. Layer 1 generates, layer 2 judges, layer 3 synthesizes (synthesize layer's `model` MUST be `"parent"`).

**Ping-pong duos.** `mode: ping-pong`, `layers: [{layer_id: L1-duoA, role: evaluate, n: 2, parallel: true}, {layer_id: L1-duoB, role: evaluate, n: 2, parallel: true}]`, plus the `iteration` block referencing both layer ids. Execution is NOT a one-shot fan-out: the parent loops, dispatching duo A → reading edits → dispatching duo B over the (possibly modified) full file set → reading edits → repeating. Each pass receives in its briefing (a) the full file set, (b) the *other duo's* most recent diff/output, and (c) the running pass counter. Termination is the FIRST of: `convergence.consecutive_no_change_passes` consecutive zero-edit passes, OR `max_passes` reached (refuse pass N+1 per the loop-cap discipline; escalate to user). After termination, the parent dispatches `iteration.final_validator` once over the converged file set; its checklist must pass before Step 4. The convergence counter and final-validator outcome MUST be captured in the Dispatch record (R18).

---

## Verification before close (R11)
- Read each child's actual return.
- Confirm spec file exists at the Step 2.5 path and matches the telemetry payload's `spec_hash`.
- Confirm telemetry line was appended (or that failure is logged).
- Confirm both artifact files exist at `<working_folder>/` (skip for `mode: single`).
- Confirm findings citations (R17) and Dispatch record completeness (R18, R21, R22).
- Confirm the discovery-promotion gate was asked.

## Known open questions (carried into v0.2.1)
- **OQ-mixed-dag-schema** — `mode: mixed` blocked until a `depends_on` per-agent field is introduced.
- **OQ-robot-talks-stage-a** — `mode: robot-talks` may conflict with robot-talks-constitution R2 Stage A (user-first scope).
- **OQ-single-use-override-enforcement** — `bootstrap_override` single-use-per-cycle is prose-disciplined; needs machine-checkable counter.
- **OQ-telemetry-consumer** — sink emits JSONL but no consumer reads it; orphan-event risk.
- **OQ-non-claude-runtime-paths** — `vault/snapshots/dispatches/` and `internal_tools/vault_telemetry/` are domainspec-local.

## References
- **Rules:** vault/constitution/domainspec-subagents-strategy-constitution.md — R4/R5/R6/R11/R17 are non-negotiable. R25 (spec schema), R26 (validator one-retry), R27 (additive-amendment path), R28 (telemetry) are the v0.2.0 additions.
- **Templates:** templates/domainspec-subagents-research.md, templates/domainspec-subagents-findings.md.
- **Writer agents:** `domainspec-subagents-research-writer`, `domainspec-subagents-findings-writer`, `domainspec-discovery-writer`.
- **Telemetry sink:** `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`.
- **Vault snapshots (corpus_hash source):** `vault/snapshots/*.json`.
