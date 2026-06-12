---
tags: [agents, dispatch, subagents, orchestration, domainspec-subagents-strategy, constitution]
node_type: constitution
is_session: false
layer: architecture
nature: procedural, technical
status: draft
version: 0.4.0
last_updated: 2026-06-12
schema_version: 1
governs_pattern: .claude/skills/domainspec-subagents-strategy/**
governs_check: [strategy_spec_schema_valid]
derives_from: vault/premise/domainspec-subagents-strategy-premises.md@v0.4.0
---

> **v0.4.0 DRAFT — reconciled from explorers A+B; premise revision owner-waived; pending reviewer hardening.**
> This file is the CHANGED-PARTS draft only (rewritten rules/sections under their R-number headings, the R25 schema block, §11A, §12/§13 additions, version-history row). The unchanged rules (R1, R3–R12, R15–R17, R21–R24, R27, R31) are inherited verbatim from the live v0.3.0 and are NOT reproduced here. (R2 is amended — see §2; R14 inherits except for one global prose substitution — see R25; R28 is amended — see §10; R29 is re-anchored — see §11; R13 is SUSPENDED under the §12 P-SS-8 waiver — see §12.) Claim ≤ proof: of the strategy objects, only `research` is LIVE; `code | review | plan | suggestion` are FORECAST/candidate.
> **Owner waiver recorded:** premises P-SS-* are NOT edited in this cycle. The `layers[]→waves[]` model and the linearity→DAG revision touch premise-level concepts (P-SS-3 independence, P-SS-9 linear lifecycle) but the owner has waived premise revision for v0.4.0 (see §12 "P-SS-9 linearity waiver"). Reviewers: this waiver is the load-bearing assumption of the whole draft.

---

## Charter (forward-reference addition)

> **Charter:** Declarative rules governing when, how, and with which model we dispatch subagents. Codifies [domainspec-subagents-strategy-premises.md@v0.4.0](../premise/domainspec-subagents-strategy-premises.md). The skill `.claude/skills/domainspec-subagents-strategy/` implements these rules; this document does not execute. **Every dispatch enacts a typed strategy** — selected by its `dispatch_type` field (§11A, R32) — a (role-set + grading criterion) pair; `research` is the live strategy, `code | review | plan | suggestion` are forecast.

*(Only the final sentence is new — added so the reader meets the typed strategy early.)*

---

## 2. Scope Rules (R2 amendment)

### R2 — Two-file artifact set (amended: helper-invocation exemption)

The v0.3.0 R2 obligation stands: a dispatch with **fan-out (2+ agents) OR recursion** MUST produce the two-file artifact set (`domainspec-subagents-research.md` + `domainspec-subagents-findings.md`) in `<working_folder>/research/`.

**NEW exemption (v0.4.0).** A **helper invocation** — a SINGLE agent spawned BY an already-dispatched agent in the course of its task, whose scope is within its parent dispatch's scope — is **NOT a dispatch**: it does NOT trigger R2's two-file artifact set, the R3 lifecycle, an R25 spec, or a registry row. It MUST, however, be reported post-hoc in the parent dispatch's R18 Dispatch record (see the amended R18 "Agents actually spawned" bullet, EDIT 4). If the helper itself **fans out (2+ agents)**, or the work **outgrows the parent dispatch's scope**, it escalates to a governed dispatch in its own right (full R2/R3/R25 obligations).

Spawn **COUNT is deliberately unregulated** (see §12 "P-SS-8 spawn-budget waiver"); only reporting is retained. This exemption touches P-SS-9's "fan-out or recursion produces a two-file artifact set" wording — covered by the §12 waivers, flagged for reviewers; the exact mechanical boundary (single-agent + scope ⊆ parent) is a **PROPOSED cut**, tracked at `OQ-helper-dispatch-boundary` (§13), NOT established law.

*Source:* P-SS-9 (owner-waived).

---

## 8. Mode Rules

### R19 — Mode is factored into three orthogonal axes (per-wave)

> **REWRITE (content from Explorer B's 3-axis model, kept as a SINGLE rule so back-references in R18 / R20 / R25 / R26 survive — Explorer A's constraint).**

A dispatch no longer declares one fused `mode` enum value. Instead, each **wave** (R19a) declares its mode as a point in a three-axis space. The legacy single-token names (`single`, `task-fan-out`, `robot-talks`, `sequential`, `zig-zag`) are now **derived labels** over these axes, retained only for human narration and back-reference.

**Axis 1 — Cardinality:** `single | fan-out`.
- `single` — one agent answers one question.
- `fan-out` — N agents in the wave.

**Axis 2 — Interaction:** `none | robot-talks`.
- `none` — agents do not exchange intermediate output. **Permitted with `single` or `fan-out`**; the former `task-fan-out` shape = `none` + `fan-out` (the `single` + `none` case is the lone-agent dispatch and is equally legal).
- `robot-talks` — agents exchange intermediate output / hold declared tensions. Carries a **submode**:
  - `dialectic` — perspectives held in tension toward synthesis (the former `robot-talks`).
  - `tournament` — agents compete and a selection step picks survivor(s). **(flagged — see `OQ-tournament-selection-orthogonality`, §13: selection is arguably a fourth axis, not a submode.)**

**Axis 3 — Topology:** **REMOVED from the mode triple.** Inter-wave / inter-layer ordering is no longer a mode property; it is expressed exclusively by the typed `connections[]` DAG (R30). The former `pipeline` mode is **DELETED** (no degenerate-path-graph hedge). The former `ping-pong` is renamed **`zig-zag`** and is now expressed as a `zig-zag` edge in `connections[]` (a named edge type, R30) bounded by its `loop_cap`, not as a mode token.

**Derived-label crosswalk (for narration / back-ref only):**

| Legacy mode | Axes |
|---|---|
| `single` | cardinality=single, interaction=none |
| `task-fan-out` | cardinality=fan-out, interaction=none |
| `robot-talks` | cardinality=fan-out, interaction=robot-talks, submode=dialectic |
| `tournament` | cardinality=fan-out, interaction=robot-talks, submode=tournament |
| `sequential` | (not a mode) → a chain of `sequential` edges in `connections[]` |
| `zig-zag` (was `ping-pong`) | (not a mode) → a `zig-zag` edge in `connections[]`, loop-bounded |
| `pipeline` | DELETED |

The mode-axes are declared per wave in the chat proposal and recorded in the R25 spec and the Dispatch record (R18).

*Source:* D-4 of domainspec-subagents-strategy.md discovery. *(Premise revision owner-waived for v0.4.0.)*

### R19a — A wave is a functional band; it MAY contain N sequential, independent layers

> **NEW rule (the wave-contains-layers concept; carries the `layers[]→waves[]` rename's structural half).**

The top-level orchestration unit is now the **wave** (`waves[]`), replacing `layers[]`. A wave is a **functional band** carrying:
- a `role` ∈ `investigate | evaluate | meta-evaluate | synthesize`,
- the per-wave mode-axes (R19),
- optionally, N nested **layers** (`layers[]` *inside* a wave) that run **sequential and independent** of one another.

A wave with no nested `layers[]` is a single-band wave (the common case). A wave WITH nested `layers[]` runs those layers in declared order, each layer independent (no shared state across sibling layers within the wave — P-SS-3 independence applies at the layer grain). *(P-SS-3's independence is RE-GRAINED here from the layer to the nested-layer-within-wave; this re-graining is asserted under the §12 waiver, not established by P-SS-3's text.)* The role-ordering invariant (synthesize never precedes evaluate; meta-evaluate never precedes evaluate) is enforced across waves and is inherited unchanged.

Naming note: the former `layer_id` becomes `wave_id` at the top level; nested layers carry `layer_id` within their wave.

*Source:* D-4; P-SS-3 (independence at the layer grain). *(Premise revision owner-waived.)*

### R20 — Robot-talks interaction binds robot-talks-constitution

*(Unchanged in substance; re-anchored to the axis vocabulary.)* A wave whose **interaction axis = `robot-talks`** (either submode) additionally binds [robot-talks-constitution.md](robot-talks-constitution.md). Conflicts resolve in favor of robot-talks-constitution within such waves. See `OQ-robot-talks-stage-a` in §13.

*Source:* D-4.

---

## 7. Artifact Rules (R18 amendment)

### R18 — Dispatch record schema (amended)

The Dispatch record section of `domainspec-subagents-findings.md` MUST contain:

- **Mode** — REPLACED: per-wave **mode-axes** `{cardinality, interaction, submode?}` for each wave (R19), plus the derived legacy label where useful for the reader.
- **Dispatch type** — NEW: the dispatch's `dispatch_type` value (R32): `research` (live) or one of `code | review | plan | suggestion` (forecast).
- **Dispatch kind** — `standard | meta` (per R25).
- **Spec path** — the canonical path written at Step 2.5.
- **Spec hash** — sha256 of the persisted spec.
- **Per-agent table** with: agent id, model, one-line difficulty justification, token budget (or "unbounded"), declared output shape.
- **Sequencing** — REPLACED: the `connections[]` **DAG** description (typed edges {from, to, type, carries}), not "linear chain / parallel set". (R30)
- **Agents actually spawned** — total count, spawn tree (who spawned whom, including helper invocations per amended R2), loop iterations used. Reporting only — no budget is enforced (§12 P-SS-8 waiver).
- **Actual spend** — tokens in / out / total per agent, plus sum.
- **Four-component grade** per R21 (with judgment markers per R22).
- **Bootstrap override** — if used, reproduce `{reason, scope}` verbatim.
- **Telemetry emission status** — emitted / failed-with-reason.
- **Exit reason** — one of the R31 taxonomy values plus 1–2 sentences of context.

*Source:* P-SS-9, D-11.

---

## 10. Spec, Validator, Registry, Telemetry (R25–R28)

### R25 — Strategy spec is a content-addressed artifact written AFTER user confirmation (schema bumped to 0.4.0)

> **Minimal patch so the schema is not self-contradictory under the new model. Schema extraction to a dispatch-spec is deferred to a later phase (out of scope here).**

The strategist composes the spec **IN CHAT** as part of R3 Step 1; the chat proposal IS the human-readable narration of the YAML spec. The R26 validator runs on the in-chat spec **before** user confirmation. No file is involved before Step 2. Only AFTER R3 Step 2 user confirm does the strategist persist the spec to:

- `vault/snapshots/dispatches/YYYY-MM-DD-<slug>-spec.yaml` for `dispatch_kind: standard`, or
- `vault/snapshots/meta-dispatches/<slug>/spec.yaml` for `dispatch_kind: meta`.

**Reconciliation with R4 / R5 / R6a:** unchanged from v0.3.0 (no file pre-confirm; parent writes exactly one canonical artifact post-confirm; Abandon leaves no file).

**Schema (top-level, required unless marked optional) — v0.4.0:**

```yaml
# ============================================================
# LEVEL 1 — DISPATCH (top-level; the whole-graph parameters)
# ============================================================
spec_version: "0.4.0"
dispatch_id: <YYYY-MM-DD-<slug>>
dispatch_kind: standard | meta                   # OPTIONAL (registry class; default `standard`). R25.
dispatch_type: research | code | review | plan | suggestion   # R / R32. research = LIVE; code|review|plan|suggestion = FORECAST (candidate, not yet operational). Bundles the grader.
goal: <one sentence>                              # R
success_metric: <typed halt predicate>           # R / R19 / R21. The HALT PREDICATE the macro `loop` checks — DISTINCT from `goal`. This is the EXISTING R19/R21 success-metric concept; not redefined here.
loop: <int, default 2, max 5>                     # R / R20. RENAMED from `loop_cap` (the name `loop_cap` is now FREED for the connection level). MACRO loop = whole-graph re-runs; typed mechanical floor (harness MUST refuse loop N+1).
final_approver: parent | agent                   # R (default `parent`). The last approve/reject gate; ALWAYS holds a macro/"does-it-fit-the-whole" mandate.
final_approver_criteria: <one line>              # OPTIONAL inline qualifier on final_approver (NOT a separate top-level field).
parent_dispatch_id: <upstream dispatch_id or null>   # OPTIONAL. Lineage/audit only — NOT a budget; spawn count is unregulated (§12 P-SS-8 waiver).
context: <2-4 sentences>                          # OPTIONAL
working_folder: <path>                            # OPTIONAL (DERIVED; repo-relative)
anti_bias_global: <dispatch-wide tension theme>  # OPTIONAL. The dispatch-wide tension theme that per-group `anti_bias` axes SPECIALIZE — typed as the PARENT of group anti_bias.
heuristic_row: <published id> | user-specified   # R (R27)
stop_conditions:                                 # free-text supplements; `loop` is the typed floor
  - <string>
bootstrap_override:                              # optional; required object shape when present
  reason: <non-empty string>
  scope: spec-only | telemetry-only | working-folder | full

# --- top-level `recursion_budget:` REMOVED (spawn count deliberately unregulated, §12 P-SS-8 waiver; lineage kept via top-level `parent_dispatch_id`) ---
# --- top-level `mode:` REMOVED (factored into per-wave axes, R19) ---
# --- top-level `parallel:` REMOVED (cardinality + nested layers replace it, R19a) ---

# ============================================================
# LEVEL 3 — GROUP / wave (waves[]); LEVEL 4 — AGENT (waves[].agents[])
# ============================================================
waves:                                            # was `layers:` (R19a)
  - wave_id: <stable id>                          # was layer_id
    role: investigate | evaluate | meta-evaluate | synthesize   # R
    n: <int >= 1>                                 # R (default 1). Agent count.
    # cardinality is DERIVED, NOT stored: (n == 1 ? single : fan-out). A view over `n`, not a field. (R19 axis 1.)
    interaction: none | robot-talks               # OPTIONAL (default none). R19 axis 2.
    submode: dialectic | tournament               # CONDITIONAL: required iff interaction == robot-talks, else OMITTED. R19.
    anti_bias: <tension axis>                      # CONDITIONAL: required iff n >= 2. Specializes anti_bias_global. R10-11 / R29.
    aggregation: vote | concat | reduce | synthesize  # CONDITIONAL: required iff n >= 2. How the N agent-outputs combine. The GROUP owns inbound-combination (there is NO edge `transform`).
    model: <model_id> | "parent"
    layers:                                       # OPTIONAL nested layers (R19a, R24-26); default 1; run sequential + independent
      - layer_id: <stable id>                      # MUST be unique across the WHOLE spec (not just within its wave) so connections[] refs resolve; OR reference it qualified as wave_id.layer_id
        n: <int >= 1>
        # a nested layer inherits its wave's role; it MAY narrow cardinality/interaction for its own band
    agents:
      - agent_id: <stable id>
        role: explorer | skeptic | writer | auditor   # R. Vocabulary fixed by `dispatch_type` (research role-set shown).
        angle: <one sentence>                      # CONDITIONAL: required iff group n >= 2 (position on anti_bias).
        model: <model_id> | "parent"              # OPTIONAL (inherit). "parent" valid only on a synthesize-role wave entry.
        token_budget: <int> | "unbounded"         # OPTIONAL
        difficulty_justification: <one line>
        expected_output_shape: <one line>          # CONDITIONAL: required where `role` doesn't fix it / where it feeds `aggregation`.
        tools: [<tool>, ...]                       # OPTIONAL (role-default). Per-agent tool restriction.
        read_scope: <path glob | scope>           # OPTIONAL (role-default). Per-agent read restriction.
        gate_authority: <one line>                # CONDITIONAL: set iff this agent is the `final_approver = agent`. Agent-side binding of the owner-fixed dispatch `final_approver`; MUST NOT contradict it.

# ============================================================
# LEVEL 2 — CONNECTION (connections[]; the typed DAG edges)
# ============================================================
connections:                                      # R30 — typed DAG over wave_ids (and layer_ids). REPLACES linear sequencing.
  - from: <wave_id | layer_id>                    # R
    to: <wave_id | layer_id>                      # R
    type: sequential | zig-zag | feedback         # R. zig-zag is owner-fixed (don't collapse). WELL-FORMEDNESS: zig-zag requires loop_cap >= 2. feedback edges bounded by loop_cap (acyclic after unrolling).
    carries: <one line>                            # OPTIONAL (default: all upstream output). What payload/contract crosses this edge.
    loop_cap: <int>                               # CONDITIONAL: required iff type in {zig-zag, feedback}. The LOCAL edge loop (now the ONLY loop_cap, since dispatch's was renamed `loop`).
    input_priority: <int | order list>           # CONDITIONAL: required when the `to` node has >= 2 inbound edges (merge order).
    gate: <fire-condition>                        # OPTIONAL. Fire-condition on the edge.

validator:
  model: <model_id>
  retry_policy: one-retry-then-escalate
telemetry:
  event_name: subagent-strategy.dispatched
  corpus_hash_at_emit: <from latest vault/snapshots/*.json, or "BOOTSTRAP" under override>
  spec_hash: <sha256 of this spec YAML, filled at Step 2.5>
```

Prose fixes applied in this rule: every former reference to a **"synthesize-layer"** now reads **"synthesize-role wave"** (e.g., `model: "parent"` is valid only on a synthesize-**role wave** entry). **Global prose fix (binding on inherited rules too):** every former "synthesize layer(s)" / "Non-synthesize layer(s)" across **R14 and R25** now reads "synthesize-role wave" / "non-synthesize-role wave" — R14 (inherited verbatim otherwise) is pulled into the changed set for this one substitution. The dead `pipeline` comment on the former `mode:` line is deleted along with the field. The `model: "parent"` value remains the ONLY mechanism by which a synthesize-role wave entry may execute in the parent session; non-synthesize waves MUST name a concrete model id; there is no `delegate_synthesis` escape hatch.

**Parameter-set consolidation (v0.4.0).** The schema above folds in the macro-APPROVED 4-level parameter set (see the **Parameter levels (R-PARAMS)** subsection below for the level table and EXISTING-vs-NEW provenance). Three structural decisions are load-bearing:

- **`loop_cap` → `loop` rename (DISPATCH level).** The dispatch-level macro loop is now the field `loop` (was `loop_cap` / `max_loops` in v0.3.0 prose). This FREES the name `loop_cap` for the **connection level**, where it is now the only `loop_cap` — the LOCAL edge loop on `zig-zag`/`feedback` edges. Any v0.3.0 reference to a top-level `loop_cap` reads as `loop`; any `loop_cap` in `connections[]` is the edge-local loop.
- **`cardinality` is DERIVED, not stored.** A wave stores `n`; `cardinality` is the view `(n == 1 ? single : fan-out)`. No `cardinality` field is persisted, and there is no separate `submode`-less duplication of the cardinality axis. R19's Axis-1 vocabulary is retained for narration; the stored datum is `n`.
- **The GROUP owns inbound-combination.** How N agent-outputs combine is the wave's `aggregation` (`vote | concat | reduce | synthesize`, required iff `n ≥ 2`). There is consequently **NO edge `transform`** — edges `carry`, they do not combine.

**Fields CUT in v0.4.0** (removed if present in any draft; do not reintroduce): stored `cardinality` (now derived); edge `transform` (combination moved to group `aggregation`); agent `stop_condition` (the macro `success_metric` + edge `gate`/`loop_cap` cover halting); `seed_context`; `layer_mode_override`; and `max_total_agents` / `recursion_depth` (and now `recursion_budget` itself) — these are cut because **agent-spawn count is deliberately unregulated in v0.4.0** (§12 P-SS-8 waiver): do NOT reintroduce any spawn-cap field. Lineage is retained via the top-level `parent_dispatch_id` (audit pointer, not a budget).

*Source:* P-SS-2, P-SS-9. *(Premise revision owner-waived for v0.4.0.)*

### Parameter levels (R-PARAMS)

> **The spec schema is organized into FOUR parameter levels.** This subsection makes the level-structure legible and records, per param, its status — **R** required / **O** optional / **C** conditional / **D** derived-not-stored — and what it controls. Claim ≤ proof: most params are EXISTING law re-surfaced under the new names; the genuinely new ones are flagged in the provenance note below.

**Level 1 — DISPATCH** (top-level; whole-graph parameters)

| param | status | controls |
|---|---|---|
| `dispatch_type` | R | which (role-set + grader) the dispatch enacts; bundles the grader (R32) |
| `goal` | R | the target statement |
| `success_metric` | R | the typed HALT PREDICATE the macro `loop` checks (distinct from `goal`) |
| `loop` | R | macro loop = whole-graph re-runs (default 2, max 5); renamed from `loop_cap` |
| `final_approver` | R | last approve/reject gate (`parent\|agent`, default `parent`); always macro mandate |
| `final_approver_criteria` | O | inline qualifier on `final_approver` (not a top-level field) |
| `parent_dispatch_id` | O | lineage pointer to the upstream dispatch (audit, not regulation) |
| `context` | O | dispatch framing |
| `working_folder` | D | derived artifact path |
| `dispatch_kind` | O | registry class (`standard\|meta`) |
| `anti_bias_global` | O | dispatch-wide tension theme; PARENT of per-group `anti_bias` |
| `heuristic_row` | R | heuristic attribution: published row id or user-specified (R27) |

**Level 2 — CONNECTION** (`connections[]` edges)

| param | status | controls |
|---|---|---|
| `from` | R | edge source (`wave_id\|layer_id`) |
| `to` | R | edge target |
| `type` | R | `sequential\|zig-zag\|feedback`; zig-zag requires `loop_cap≥2` |
| `carries` | O | payload crossing the edge (default: all upstream output) |
| `loop_cap` | C | LOCAL edge loop; required iff `type ∈ {zig-zag, feedback}` |
| `input_priority` | C | merge order; required when `to` has ≥2 inbound edges |
| `gate` | O | fire-condition on the edge |

**Level 3 — GROUP / wave** (`waves[]`)

| param | status | controls |
|---|---|---|
| `role` | R | `investigate\|evaluate\|meta-evaluate\|synthesize` |
| `n` | R | agent count (default 1) |
| `cardinality` | D | derived `(n==1?single:fan-out)` — NOT stored |
| `interaction` | O | `none\|robot-talks` (default none) |
| `submode` | C | `dialectic\|tournament`; required iff `interaction=robot-talks` |
| `anti_bias` | C | tension axis; required iff `n≥2`; specializes `anti_bias_global` |
| `aggregation` | C | `vote\|concat\|reduce\|synthesize`; required iff `n≥2`; group owns inbound-combination |
| `layers` | O | N sequential independent passes (default 1) |

**Level 4 — AGENT** (`waves[].agents[]`)

| param | status | controls |
|---|---|---|
| `role` | R | `explorer\|skeptic\|writer\|auditor` (vocabulary fixed by `dispatch_type`) |
| `angle` | C | position on `anti_bias`; required iff group `n≥2` |
| `model` | O | inherit if omitted |
| `token_budget` | O | per-agent spend cap |
| `expected_output_shape` | C | required where `role` doesn't fix it / where it feeds `aggregation` |
| `tools` / `read_scope` | O | per-agent tool / read restriction (role-default) |
| `gate_authority` | C | set iff this agent is `final_approver=agent`; agent-side binding of dispatch `final_approver`, MUST NOT contradict it |

**Provenance (EXISTING law re-surfaced vs genuinely NEW).** Claim ≤ proof requires distinguishing what already had a rule from what this consolidation introduces:

- **EXISTING law, re-surfaced under these names:** `success_metric` = the R19/R21 success-metric concept; `loop` = R20 (renamed from `loop_cap`); `zig-zag` edge type = R24; `layers` = R24–R26; `anti_bias` = R10–R11 (and R29).
- **Genuinely NEW in v0.4.0:** `final_approver` (+`final_approver_criteria`, `gate_authority`); `aggregation`; `input_priority` and edge `gate`; `anti_bias_global` (as the typed PARENT of group `anti_bias`); `dispatch_type` (R32). These NEW params are subject to the §12 P-SS-9 owner-waiver re-confrontation rule like any other v0.4.0 addition.
- **REMOVED in v0.4.0:** the P-SS-8 `recursion_budget` budget regulation is removed under owner waiver (§12 "P-SS-8 spawn-budget waiver") — spawn count is unregulated; only the top-level `parent_dispatch_id` lineage pointer is retained (audit, not a cap).

*Source:* R10–R11, R19–R26, R29, R32; P-SS-8. *(Premise revision owner-waived for v0.4.0.)*

### R26 — Validator runs on the in-chat spec; checklist extended

The validator (`strategy_spec_schema_valid`) MUST run on the in-chat spec **before user confirmation**; outcomes (`accept | reject-with-fixes | abstain | accept-with-bootstrap-override`) are unchanged from v0.3.0, as is the one-retry-then-escalate rule and the trivial-dispatch carve-out (now read as: effective waves = 1, effective n = 1, no `bootstrap_override`).

**Checklist (amended).** The validator verifies R10 / R14 / R15 / R19 / R23 / R25 / R27 (R13 is suspended under the §12 P-SS-8 waiver — budget enforcement is not validated; see §12), **plus**:
- **R30 well-formedness** — `connections[]` is a typed DAG: every `from`/`to` resolves to a declared `wave_id`/`layer_id`; **every `layer_id` is unique across the whole spec (or is referenced in qualified `wave_id.layer_id` form) so `connections[]` references resolve unambiguously**; `type ∈ {sequential, zig-zag, feedback}`; the graph is **acyclic after unrolling `feedback` edges** ≤ `loop_cap` times; the role-ordering invariant holds along every path (synthesize never precedes evaluate; meta-evaluate never precedes evaluate). **Validator coverage is PARTIAL:** this check validates edge resolution, type membership, acyclicity, and role-ordering; it does NOT validate `carries`-payload compatibility (free-text — see `OQ-connections-carries-typing`) nor any cardinality↔interaction coupling (see `OQ-interaction-cardinality-coupling`).
- **R32 strategy** — `dispatch_type` is present and ∈ {research, code, review, plan, suggestion}; if `dispatch_type != research`, the validator emits a `forecast-strategy` warning (candidate strategies are not yet operational) — non-blocking, surfaced to user.
- **Axis-based R19 check** — each wave's `{cardinality, interaction, submode?}` is well-formed under exactly these predicates: (a) `submode` present iff `interaction == robot-talks`; (b) `submode ∉` legacy-mode tokens (`single | task-fan-out | robot-talks | sequential | zig-zag | pipeline`); (c) **no constraint linking `cardinality` and `interaction` beyond R19** (in particular `interaction: none` is NOT required to pair with `fan-out`). Any tighter cardinality↔interaction coupling is unspecified and tracked at `OQ-interaction-cardinality-coupling` (§13), NOT enforced here. The R29 anti-bias pairwise-tension check runs per wave (and per nested layer) for any band with N ≥ 2 agents, naming the tension axis per sibling pair or yielding `reject-with-fixes` (`false-consensus risk`).

*Source:* P-SS-9, governs-runtime-witness-constitution.md.

### R28 — Telemetry emission (NOT inherited verbatim — `mode` field amended)

> **NOTE: R28 is NOT inherited verbatim under v0.4.0.** The v0.3.0 R28 emits a telemetry field `"mode": "<R19 value>"`, but the top-level scalar `mode` is DELETED (factored into per-wave axes, R19). **Resolution for v0.4.0:** the R28 `mode` field now carries the **derived legacy label** (from the R19 crosswalk) for the **first / representative wave** of the dispatch — a single string for backward-compatible telemetry consumers. (The richer per-wave `{cardinality, interaction, submode?}` lives in the spec/Dispatch record, not the telemetry scalar.) If a future consumer needs the full factoring, R28 may instead emit a `mode_axes` object; until such a consumer exists, the single derived-label string is the chosen form. Everything else in v0.3.0 R28 is inherited unchanged.

---

## 11. Cross-Cutting Discipline (R29–R31)

### R29 — Anti-bias tension (re-anchored to wave / layer)

*(Substance unchanged from v0.3.0.)* For any **wave — or any nested layer (R19a) — with N ≥ 2 agents**, the per-agent `angle`s MUST be **pairwise tensioned**, not merely non-overlapping (definition, tension axes methodology / corpus / attack-vector / era-prior, and the validator "name the axis per pair or reject with `false-consensus risk`" rule all carry over verbatim). Every occurrence of "layer" in the v0.3.0 R29 text is read as "wave or nested layer" under the R19a band grain.

Discovery source: `vault/discovery/anti-bias-vector-composition/`. Cite there; do not duplicate.

*Source:* P-SS-5, P-SS-10 (independence component).

### R30 — Composition is a typed `connections[]` DAG (wholesale replacement)

> **WHOLESALE REPLACE (Explorer B). The v0.3.0 R30 — "per-layer mode composability; composition is linear; no DAG; no depends_on" — is DELETED in full.**

Inter-wave and inter-layer composition is expressed by a top-level **`connections[]`** array: a set of **typed DAG edges** `{from, to, type, carries}` over `wave_id`s (and nested `layer_id`s). There is no implicit "layer N after layer N−1" linear rule any longer; **all ordering is explicit in `connections[]`**.

- `type: sequential` — a hard dependency: `to` may not start until `from` completes; `carries` names the payload/contract crossing the edge.
- `type: zig-zag` — a NAMED bounded alternation edge (formerly `ping-pong`): the two endpoints alternate A→B→A→… at most `loop_cap` times (`loop_cap ≥ 2` required). Owner-fixed as a distinct type (R25); do not collapse into `feedback`.
- `type: feedback` — a general bounded back-edge. A `feedback` edge is permitted to point "backward" but the graph MUST be **acyclic after unrolling** each `feedback` (or `zig-zag`) edge at most `loop_cap` times (R25 typed floor). The harness MUST refuse the iteration beyond `loop_cap`.
- The graph MUST be a DAG once `feedback` (or `zig-zag`) edges are unrolled; the R26 validator enforces this (R30 well-formedness check).
- The role-ordering invariant is enforced **along every path** of the DAG, not just over a linear sequence.

**P-SS-9 owner-waiver note (inline):** the v0.3.0 R30 grounded "composition is linear" in P-SS-9's linear seven-step *lifecycle*. The DAG generalization arguably touches that premise. For v0.4.0 the owner has **waived premise revision** (§12): the lifecycle (R3) remains the linear seven steps for the *dispatch mechanics*; `connections[]` describes the *data-flow topology among waves*, which **we ASSERT is a distinct concern — this is the waiver's load-bearing assumption, NOT independently established; if false, R30 contradicts P-SS-9 and a premise revision is mandatory.** Reviewers: confirm this lifecycle-vs-topology separation holds, or escalate to a premise revision.

**`OQ-mixed-dag-schema` is REOPENED** (§13) — the v0.3.0 closure ("linear composition supersedes the mixed reservation") no longer holds once the topology is an explicit DAG; the schema for mixed-mode DAGs is again an open question.

*Source:* `P-SS-3 (independence per edge)`. NOTE: v0.3.0 R30's P-SS-9 "composition is linear" grounding is DELETED; R30 now outruns P-SS-9 under the §12 owner waiver — P-SS-9 is NOT cited as support. *(Premise revision owner-waived; see inline note.)*

---

## 11A. Strategy as a Typed Object (R32)

> **NEW sub-numbered section, placed as §11A so §12 Governance / §13 Open Questions / §14 Connections KEEP their numbers and all `(§12)/(§13)` cross-refs stay valid.**

### R32 — Every dispatch enacts a typed strategy; only `research` is live

A **strategy** is a typed object: a pair **(role-set, grading criterion)**. The `dispatch_type` field (R25 schema) selects which strategy a dispatch enacts. Five strategies are named; their status under the subset rule (claim ≤ proof):

| `dispatch_type` | Role-set | Grading criterion | Status |
|---|---|---|---|
| `research` | TWO orthogonal axes: workflow roles `investigate \| evaluate \| meta-evaluate \| synthesize` (`waves[].role`) × the four agent roles `explorer \| skeptic \| writer \| auditor` (`agents[].role`) — the two are orthogonal per research-constitution | the R21 four-component grade (coverage / independence / fidelity / cost) PLUS the per-role criteria in research-constitution (R5–R8) | **LIVE** — operationalized in [research-constitution.md](../../theorem/agents-strategy/research-constitution.md) (research skill) |
| `code` | (reserved slot — not populated) | (reserved slot — not populated) | **FORECAST / candidate** — reserved NAME, not operational |
| `review` | (reserved slot — not populated) | (reserved slot — not populated) | **FORECAST / candidate** — reserved NAME, not operational |
| `plan` | (reserved slot — not populated) | (reserved slot — not populated) | **FORECAST / candidate** — reserved NAME, not operational |
| `suggestion` | (reserved slot — not populated) | (reserved slot — not populated) | **FORECAST / candidate** — reserved NAME, not operational |

**Claim ≤ proof.** Only `research` has a defined, live role-set and grading criterion (in the research constitution). `code | review | plan | suggestion` are **reserved strategy NAMES / slots**, NOT populated `(role-set, criterion)` pairs; they record the intended shape of the typed-strategy space. **A reserved slot MUST NOT be dispatched until populated.** The R26 validator emits a non-blocking `forecast-strategy` warning when `dispatch_type != research`. When a candidate strategy is promoted to live, it acquires its own role-set + grading criterion (and MUST re-confront the §12 P-SS-9 waiver — see §12) and this table's Status column is updated under the normal amendment path.

Recorded intent of the reserved `suggestion` slot (NOT an operational definition): `suggestion` = decision-support — the dispatch's output is options + tradeoffs + a recommendation for a USER decision; the dispatch produces neither the final artifact nor the final verdict — the user decides. Its border with `plan` (commitment to an execution sequence) is tracked at `OQ-plan-suggestion-boundary` (§13).

The role-ordering invariant (R19a / R30) and the four-component grade (R21) currently reflect the `research` strategy's role-set; generalizing them across strategies is forecast work (see `OQ-connections-carries-typing` for the related edge-typing question).

*Source:* P-SS-9, P-SS-10; research-constitution.md (live `research` strategy). *(Premise revision owner-waived.)*

---

## 12. Governance (additions only)

*(Existing Adoption / Amendment-process / Non-negotiable-principles / Known-drift / Known-TODO text from v0.3.0 carries over unchanged; the notes below are APPENDED.)*

**P-SS-9 linearity waiver (v0.4.0).** The v0.4.0 amendment replaces linear layer composition with a typed `connections[]` DAG (R30) and renames `layers[]→waves[]` (R19a). These touch premise-level concepts (P-SS-3 independence; P-SS-9's linear lifecycle grounding for the old R30). **The owner has WAIVED premise revision for this cycle.** Rationale recorded: the linear *lifecycle* (R3 seven steps) is preserved as dispatch mechanics; `connections[]` governs only data-flow *topology among waves*, **which we ASSERT is a distinct concern — this is the waiver's load-bearing assumption, NOT independently established; if false, R30 contradicts P-SS-9 and a premise revision is mandatory.** This waiver is logged here rather than enacted as a premise edit. If a reviewer judges the topology change to be genuinely premise-altering, the correct response is to escalate to a P-SS premise revision, not to silently proceed. This waiver ALSO covers the R2 helper-invocation exemption: P-SS-9's "fan-out or recursion produces a two-file artifact set" clause is waived for single-agent helper invocations (amended R2); R18 post-hoc reporting substitutes for the artifact set in that case.

**Standing un-waive clause.** Un-waiving requires a genuine P-SS-9 **text revision** (or a new premise separating lifecycle-order from data-flow-topology). Any future amendment touching R30, or any promotion of a `code | review | plan | suggestion` strategy, **MUST re-confront this waiver and may not inherit it silently.**

**P-SS-8 spawn-budget waiver (v0.4.0).** P-SS-8 grounds the global agent/cost ceiling (`recursion_budget` depth/breadth/total). v0.4.0 **removes the in-spec regulation** (owner decision: an agent executing a task may spawn as many helper agents as the task needs; the brake is parent/user supervision and harness limits, accepted consciously). This is the waiver's load-bearing assumption, NOT independently established. P-SS-8's own falsification test binds it: if unbudgeted recursive dispatch fails to terminate predictably or produces untraceable cost in practice, the assumption is falsified — the spawn cap returns and a P-SS-8 premise revision is mandatory. **Reporting is retained** in R18 ("Agents actually spawned"). R13 (Recursion budget defaults — depth/breadth/total caps and the strategist's refusal duty) is SUSPENDED in full under this waiver; it is not inherited into v0.4.0 and returns only if the cap returns (un-waive clause). Premise revision is **owner-WAIVED this cycle** (P-SS-8 text unedited). If a reviewer judges the removal premise-altering, escalate to a P-SS-8 revision, not silent proceed. **Standing un-waive clause:** reintroducing any spawn cap, or revising P-SS-8, **MUST re-confront this waiver** and may not inherit it silently.

**Waiver-composition meta-clause (v0.4.0).** The standing un-waive clauses are scoped to their own trigger surfaces and do NOT compose into general coverage. Therefore: every future amendment, regardless of surface, MUST re-list all open premise-outrunning debts (Known-drift) and explicitly affirm-or-discharge each; silent inheritance of ANY waiver is prohibited.

**Known-drift (appended).** **P-SS-9 premise-outrunning debt (v0.4.0).** R30/R19a outrun P-SS-9 under owner waiver; OPEN until P-SS-9 is revised; carry forward verbatim into every subsequent version until discharged. **P-SS-8 premise-outrunning debt (v0.4.0).** Budget regulation removed under owner waiver; OPEN until P-SS-8 is revised; carry forward verbatim until discharged.

**v0.4.0 grandfathering.** Dispatches initiated before `last_updated` (2026-06-12) are NOT retroactively invalidated by the new schema. Specifically: specs written under `spec_version: "0.3.0"` with a top-level `mode:` value (including the now-deleted `pipeline`) and `layers[]` (rather than `waves[]`) remain valid as historical artifacts and are not re-validated against the v0.4.0 axis/DAG schema. New dispatches on or after 2026-06-12 MUST use `spec_version: "0.4.0"` (waves / mode-axes / connections / `dispatch_type`).

---

## 13. Known Open Questions (additions + status change)

*(Existing OQ-robot-talks-stage-a / OQ-single-use-override-enforcement / OQ-telemetry-consumer / OQ-non-claude-runtime-paths carry over unchanged.)*

- **OQ-tournament-selection-orthogonality** *(NEW)* — `tournament` is currently a `robot-talks` submode (R19 axis 2). But a tournament adds a **selection step** (pick survivor(s)) that the `dialectic` submode lacks. Selection is arguably a separate, fourth axis (Selection: `none | pick-k`) rather than a submode value. Resolve whether to promote selection to its own axis in v0.4.x.
- **OQ-connections-carries-typing** *(NEW)* — the `connections[].carries` field is currently free-text (a one-line payload description). Whether `carries` should be a **typed contract** (e.g., a named schema / artifact-shape ref, enabling the validator to check edge compatibility — that `from` produces what `to` consumes) is open. Relates to generalizing the strategy role-sets (R32).
- **OQ-interaction-cardinality-coupling** *(NEW)* — whether the `interaction` axis and the `cardinality` axis should be coupled by any constraint beyond R19 (e.g. should `robot-talks` imply `fan-out`? is a `single` + `robot-talks` band ever meaningful?). The v0.4.0 R26 validator enforces NO such coupling (the formerly-asserted "`none` requires `fan-out`" coupling was removed as it forbade the legal `single` + `none` case). The correct coupling — if any — is unspecified and open.
- **OQ-plan-suggestion-boundary** *(NEW)* — `plan` and `suggestion` are both reserved `dispatch_type` slots and their border is blurred: `plan` = commitment to an execution sequence; `suggestion` = pre-commitment deliberation / decision support. The border MUST be cut sharply when either is promoted to live.
- **OQ-helper-dispatch-boundary** *(NEW)* — the exact mechanical criterion separating a **helper invocation** (amended R2, §2) from a governed dispatch. Proposed cut: single agent + scope ⊆ parent dispatch's scope; escalation on fan-out (2+). Proposed, NOT established.

### Reopened

> **MERGE INSTRUCTION (binding on whoever merges this draft into the live constitution):** the live v0.3.0 §13 carries a *Resolved* entry reading "Resolved: OQ-mixed-dag-schema — CLOSED by R30 (v0.3.0)". On merge, that Resolved entry MUST be **DELETED / relocated** (it moves here, to *Reopened*) — it is NOT carried over unchanged. The merged §13 body must list `OQ-mixed-dag-schema` in exactly ONE place (here, as Reopened), never simultaneously as Resolved and Reopened. (The general "existing §13 entries carry over unchanged" instruction at the top of §13 is OVERRIDDEN for this one entry.)

- **OQ-mixed-dag-schema** — **REOPENED (v0.4.0).** Previously CLOSED-by-R30 (v0.3.0) under linear composition. The v0.4.0 R30 makes topology an explicit typed DAG (`connections[]`), which removes the linear-composition basis for the closure. The schema for **mixed-mode DAGs** — waves of heterogeneous mode-axes wired by typed edges, with cross-strategy edges once `code|review|plan` go live — is again open. Moved from §13 Resolved (now deleted there per the merge instruction above) back to active open questions.

---

## Version History (append)

| Version | Date | Change |
|---------|------|--------|
| 0.4.0 | 2026-06-12 | **(DRAFT, pending review — all verbs below are draft-scoped: "replaces / deletes / bumps" describe what the merge WILL do to the live v0.3.0, not an enacted change.)** **Waves, 3-axis mode, typed connections DAG, strategy-as-object.** `layers[]→waves[]` (R19a): a wave is a functional band carrying role + per-wave mode-axes, MAY contain N sequential+independent nested `layers[]`; `layer_id→wave_id` at top level. **R19 rewritten** (content from 3-axis model, kept as one rule to preserve R18/R20/R25/R26 back-refs): mode factored into Cardinality (`single\|fan-out`) × Interaction (`none\|robot-talks`, submode `dialectic\|tournament`) × Topology REMOVED to `connections[]`. `ping-pong→zig-zag`; **`pipeline` DELETED** (no degenerate-path hedge). **R30 wholesale replaced**: deletes "composition is linear / no DAG / no depends_on"; introduces typed `connections[]` DAG `{from,to,type,carries}` with `sequential`/`zig-zag`/`feedback` edges, back-edges (`zig-zag`/`feedback`) bounded by `loop_cap` (acyclic after unrolling); P-SS-9 owner-waiver noted inline; **`OQ-mixed-dag-schema` REOPENED** (§13, moved Resolved→active). **NEW §11A / R32 strategy-as-object**: the strategy is selected by the `dispatch_type` field ∈ {research\|code\|review\|plan\|suggestion} = (role-set + grading criterion); `research` LIVE, `code\|review\|plan\|suggestion` FORECAST/candidate (subset rule); `suggestion` added as a fifth reserved `dispatch_type` with a recorded decision-support discriminator (options + tradeoffs + recommendation for a USER decision; produces neither final artifact nor final verdict); placed as §11A to preserve §12/§13/§14 numbering; Charter gains a one-line forward-reference. **FIELD rename `strategy`→`dispatch_type`** (parameter name only; the CONCEPT "strategy" keeps the word — strategy-as-object, §11A, research-constitution refs unchanged). **R25 schema bumped to 0.4.0**: `layers→waves`, `layer_id→wave_id`, per-wave `cardinality\|interaction\|submode`, nested optional `layers[]`, top-level `connections[]`, top-level `dispatch_type:`; top-level `mode:`, `parallel:`, and `recursion_budget:` DELETED; "synthesize-layer"→"synthesize-role wave" prose fix; dead `pipeline` comment removed. **R18** Dispatch record: Mode→per-wave mode-axes, Sequencing→`connections[]` DAG, +Dispatch-type field, "Recursion budget actually used"→"Agents actually spawned" (total count + spawn tree incl. helper invocations + loop iterations; reporting only, no enforced budget). **R29** re-anchored to wave/nested-layer grain. **Parameter-set consolidation (R-PARAMS)**: folded the macro-approved 4-level param set into R25 + added the Parameter levels table. **Dispatch level** gains `success_metric` (=R19/R21 halt predicate), `final_approver`(+inline `_criteria`), `anti_bias_global`, `dispatch_kind`; **`loop_cap`→`loop` rename** at dispatch level (macro loop), FREEING `loop_cap` for the **connection level** as the LOCAL **edge `loop_cap`** (required iff `type∈{zig-zag,feedback}`); **`recursion_budget` regulation REMOVED** under P-SS-8 owner waiver (spawn count deliberately unregulated; reporting retained in R18 as "Agents actually spawned"; `parent_dispatch_id` kept top-level as a lineage/audit pointer, NOT a budget). **Connection level** gains `input_priority` (merge order, req. iff ≥2 inbound) + `gate`; **`zig-zag` kept as a named edge type** (req. `loop_cap≥2`). **Group level** gains `aggregation` (`vote\|concat\|reduce\|synthesize`, req. iff n≥2 — group owns inbound-combination, so edge `transform` is CUT) + `anti_bias`; **`cardinality` marked DERIVED** (`n==1?single:fan-out`), no longer stored. **Agent level** gains `role` (explorer\|skeptic\|writer\|auditor), `tools`/`read_scope`, `gate_authority`, conditional `expected_output_shape`/`angle`. **CUT**: stored `cardinality`, edge `transform`, agent `stop_condition`, `seed_context`, `layer_mode_override`, and `max_total_agents`/`recursion_depth`/`recursion_budget` (spawn count deliberately unregulated — do NOT reintroduce any spawn-cap field). **R2 amended (new §2, helper-invocation exemption)**: a single agent spawned BY an already-dispatched agent, with scope ⊆ parent dispatch's scope, is NOT a dispatch — exempt from the two-file artifact set / R3 lifecycle / R25 spec / registry row; reported post-hoc in the parent's R18 record; escalates to a governed dispatch on fan-out (2+) or scope-outgrowth; pulls R2 into the changed set (header blockquote updated). **R26** checklist adds R30 (DAG well-formedness) + R32 (`dispatch_type`, with `forecast-strategy` warning, enum incl. `suggestion`) + axis-based R19 check. **R13 SUSPENDED under the P-SS-8 waiver** (removed from inherited list; R26 checklist no longer validates it). **§12 Governance**: +P-SS-9 linearity waiver note, +**P-SS-8 spawn-budget waiver** (+ un-waive clause + known-drift entry), +v0.4.0 grandfathering note (0.3.0 mode/layer specs not retro-invalidated). **§13**: +OQ-tournament-selection-orthogonality, +OQ-connections-carries-typing, +OQ-interaction-cardinality-coupling, +**OQ-plan-suggestion-boundary**, +**OQ-helper-dispatch-boundary**. **R20** re-anchored to the axis vocabulary; its cross-ref to `OQ-robot-talks-stage-a` now points to **§13** (open questions) — this §12→§13 ref change is a **deliberate bugfix** (the OQ lives in §13, not §12), not an accidental renumber. Premise revision OWNER-WAIVED (P-SS-* unedited, incl. P-SS-8). Frontmatter `status` active→draft, `version` 0.3.0→0.4.0, `last_updated` 2026-06-12. |
