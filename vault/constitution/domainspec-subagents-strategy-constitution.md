---
tags: [agents, dispatch, subagents, orchestration, domainspec-subagents-strategy, constitution]
node_type: constitution
is_session: false
layer: architecture
nature: procedural, technical
status: active
version: 0.3.0
last_updated: 2026-05-26
schema_version: 1
governs_pattern: .claude/skills/domainspec-subagents-strategy/**
governs_check: [strategy_spec_schema_valid]
derives_from: vault/premise/domainspec-subagents-strategy-premises.md@v0.4.0
---

# Subagents-Strategy Constitution

> **Charter:** Declarative rules governing when, how, and with which model we dispatch subagents. Codifies [domainspec-subagents-strategy-premises.md@v0.4.0](../premise/domainspec-subagents-strategy-premises.md). The skill `.claude/skills/domainspec-subagents-strategy/` implements these rules; this document does not execute.

---

## Index

1. [Premise Reference](#1-premise-reference)
2. [Trigger Rules](#2-trigger-rules)
3. [Lifecycle Rules](#3-lifecycle-rules)
4. [Coordination Rules](#4-coordination-rules)
5. [Briefing & Verification Rules](#5-briefing--verification-rules)
6. [Budget & Model Selection Rules](#6-budget--model-selection-rules)
7. [Artifact Rules](#7-artifact-rules)
8. [Mode Rules](#8-mode-rules)
9. [Grading Rules](#9-grading-rules)
10. [Spec, Validator, Registry, Telemetry (R25–R28)](#10-spec-validator-registry-telemetry)
11. [Cross-Cutting Discipline (R29–R31)](#11-cross-cutting-discipline-r29r31)
12. [Governance](#12-governance)
13. [Known Open Questions](#13-known-open-questions)
14. [Connections](#14-connections)

---

## 1. Premise Reference

Each rule cites one or more premises. Full statements live in [domainspec-subagents-strategy-premises.md](../premise/domainspec-subagents-strategy-premises.md).

- **P-SS-1** — Dispatch a subagent only when synthesis / context-protection / isolation / parallelism applies.
- **P-SS-2** — Strategist proposes a model per child by task difficulty; user validates in chat. Token budgets are per-strategy and model-orthogonal.
- **P-SS-3** — Parallel dispatch requires task independence.
- **P-SS-4** — N parallel agents must be launched in a single assistant message.
- **P-SS-5** — Lock the shared contract before fan-out.
- **P-SS-6** — Briefing prompt determines output quality; required fields specified.
- **P-SS-7** — A subagent's report describes intent; verify the actual artifact.
- **P-SS-8** — Recursion needs an explicit budget; defaults are depth 2 / breadth 5 / total 10.
- **P-SS-9** — Fan-out or recursion produces a two-file artifact set; chat-only proposal; six-step lifecycle (now seven post-research-writer split).
- **P-SS-10** — Every dispatch is graded at close on coverage / independence / fidelity / cost; only cost is mechanical.

---

## 2. Trigger Rules

### R1 — Dispatch only when a trigger holds

A subagent MUST be dispatched only when at least one of the following holds:

- **Synthesis** — 3+ sources must be combined to answer.
- **Context protection** — raw output exceeds ~500 tokens and only a summary is needed downstream.
- **Isolation** — exploratory work whose output may be discarded.
- **Parallelism** — independent tasks that can fan out and the wall-clock saving exceeds orchestration cost.

Otherwise the work runs inline.

*Source:* P-SS-1.

### R2 — Two-file artifact set is mandatory for fan-out and recursion

A dispatch involving **fan-out (2+ agents) OR recursion** MUST produce two files in `<working_folder>/research/`:

- `domainspec-subagents-research.md`
- `domainspec-subagents-findings.md`

Single-agent dispatches MUST NOT produce these files; the parent's briefing and the agent's return is the audit trail.

*Source:* P-SS-9.

---

## 3. Lifecycle Rules

### R3 — Seven-step lifecycle is fixed

For dispatches that trigger R2, the following steps execute in order:

1. **Strategist proposes** the strategy in chat (mode, agents, model per child with difficulty justification, budgets, sequencing, recursion budget, `loop_cap`, `dispatch_kind`, suggested working folder(s) per R15). The chat proposal IS the human-readable narration of the R25 YAML spec; both surfaces describe the same parameter set in the same turn. The R26 validator runs against the in-chat spec before user confirmation — no file involved (R26 may be skipped per its trivial-dispatch carve-out).
2. **User confirms** the proposal (or revises / abandons; nothing persists on rejection).
   - **2.5 (post-confirm) Spec persistence** — the strategist writes exactly one canonical artifact: the R25 spec file at the content-addressed path. Then emits the R28 telemetry record.
3. **Strategist dispatches** all children in a single message (R8) and collects returns.
4. **Strategist returns** the collected child outputs (verbatim per child) plus the original Context + Goal — **does not write any further file beyond the post-confirm spec from Step 2.5**.
5. **Research-writer** dispatches; receives the collected returns + Context + Goal in its briefing; writes `domainspec-subagents-research.md` using the template (R5, R15, R23).
6. **Findings-writer** dispatches; reads `domainspec-subagents-research.md`; writes `domainspec-subagents-findings.md` (R16, R17, R18, R23).
7. **User gates discovery promotion**; if confirmed, the strategist classifies the discovery's scope (`knowledge` → `vault/discovery/<topic>-definitions/<slug>.md` or `application` → `docs/features/<feature>/discovery/<slug>.md`) and proposes the target path; the user confirms; **discovery-writer** dispatches and writes the discovery node at the confirmed path. If declined, the dispatch ends with the two artifact files.

Skipping or reordering steps is a constitution violation.

*Source:* P-SS-9.

### R4 — Strategy proposal MUST NOT persist as a file before user confirmation

The strategist's proposal lives only in the chat conversation through Step 2. No file — including the R25 spec — is written to disk before the user has explicitly confirmed in Step 2. The proposal-confirmation gate is enforced by the conversation, not by a phantom file.

R25 (post-confirm spec persistence at Step 2.5) is a deliberate, narrow extension consistent with R4: persistence happens only AFTER the gate.

*Source:* P-SS-9, A-8 of domainspec-subagents-strategy.md discovery.

### R5 — File persistence is owned by named writer surfaces

Child agents return findings; the strategist returns collected returns + Context + Goal. File persistence is the responsibility of named, scoped writer surfaces:

- **Strategist (parent session)** — writes exactly one file per dispatch: the R25 spec at the canonical content-addressed path, only post-confirm, only at Step 2.5. No other files.
- `domainspec-subagents-research-writer` — writes `domainspec-subagents-research.md` from the strategist's collected returns.
- `domainspec-subagents-findings-writer` — writes `domainspec-subagents-findings.md` from research.md.
- `domainspec-subagents-discovery-writer` — writes the discovery node from findings.md (user-gated, optional).

Allowing children to write directly, or allowing the strategist to write outside the spec carve-out, causes silent parallel-write race conditions and conflates orchestration with persistence.

*Source:* P-SS-9.

### R6 — Two user-confirmation gates are mandatory

(a) Before child dispatch (lifecycle step 2): user explicitly confirms the strategist's proposal. On Abandon, no file exists anywhere — R6a's reversibility is fully preserved because R25 spec write does not occur until 2.5.

(b) Before discovery promotion (lifecycle step 7): user explicitly confirms whether findings get promoted to a vault discovery node.

Neither gate may be skipped or implied; both require explicit user response in chat.

*Source:* P-SS-9.

---

## 4. Coordination Rules

### R7 — Parallel dispatch requires independence

Agents MAY only run in parallel when their tasks share no state and have no sequential dependency. When in doubt, sequential — debugging entangled parallel agents costs more than the wall-clock saved.

*Source:* P-SS-3.

### R8 — Single-message fan-out

When dispatching N parallel agents, all dispatch tool calls MUST be made in a single assistant message. Sequential dispatch silently loses parallelism.

*Source:* P-SS-4.

### R9 — Lock contract before fan-out

Before launching parallel agents, the shared contract — data schema, scope boundaries, taxonomy, decomposition — MUST be defined and recorded in the strategist's chat proposal (lifecycle step 1) and in the R25 spec.

*Source:* P-SS-5.

---

## 5. Briefing & Verification Rules

### R10 — Required briefing fields

Every subagent dispatch MUST include in its briefing prompt:

- **Goal** — what the agent is asked to produce.
- **Why it matters** — context for judgment calls.
- **Already ruled out** — paths the agent should not re-explore.
- **Expected output shape** — structure / length / format the parent expects.
- **Length cap** — token or word limit.

Terse command-style prompts violate R10.

*Source:* P-SS-6.

### R11 — Trust-but-verify on writes and verification claims

For any subagent that wrote code, edited files, or claimed a verification passed, the parent MUST inspect the actual diff or run the actual check before treating the work as done.

*Source:* P-SS-7.

---

## 6. Budget & Model Selection Rules

### R12 — Token budgets are per-strategy and model-orthogonal

The strategist sets per-subagent token budgets at dispatch time, justified by the task's expected output shape. Budgets constrain output length, not model choice.

*Source:* P-SS-2.

### R13 — Recursion budget defaults

For recursive dispatch:

- **Depth: 2**
- **Breadth: 5** children per level
- **Total cap: 10** agents per dispatch tree

The strategist tracks live agent count and MUST refuse the next dispatch when the cap would be exceeded, escalating to the user.

The chat proposal MAY override defaults with explicit justification, recorded in the spec (R25) and the Dispatch record (R18).

*Source:* P-SS-8.

### R14 — Strategist proposes model per child with difficulty justification

The strategist's chat proposal MUST name a concrete model per child agent and include a one-line difficulty justification per child. The user validates each model selection in lifecycle step 2. There is no fixed difficulty taxonomy and no fixed tier→model rule.

**Exception for synthesize layers:** agents whose `model: "parent"` (per R25) are exempt from the difficulty-justification requirement — the role itself justifies the choice.

*Source:* P-SS-2.

---

## 7. Artifact Rules

### R15 — File locations: working folder for artifacts; scope-routed discovery promotion

**Working folder for dispatch artifacts.** Every dispatch's `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` MUST be persisted under `docs/features/<feature>/research/<topic>/`.

**Forbidden working folders:**
- `.planning/**` — historical convention, deprecated.
- `vault/**` — vault is reserved for codified discipline. (Exceptions: the R25 spec under `vault/snapshots/dispatches/` or `vault/snapshots/meta-dispatches/<slug>/` for `dispatch_kind: meta`; and the R28 telemetry sink under `internal_tools/vault_telemetry/events/`.)

**No active feature?** Halt at Step 1 and ask the user which feature this dispatch belongs to. For framework-design work that has no feature folder, use `dispatch_kind: meta` and the meta-dispatches path.

**Discovery promotion** routes to one of two patterns:
- **Knowledge scope** → `vault/discovery/<topic>-definitions/<slug>.md`.
- **Application scope** → `docs/features/<feature>/discovery/<slug>.md`.

*Source:* P-SS-9, D-1 / D-11.

### R16 — Findings file structure

`domainspec-subagents-findings.md` MUST contain three sections in this order:

1. **Dispatch record** — structured metadata defined in R18.
2. **Findings** — scannable summary plus implications.
3. **Analysis** — tensions, contradictions, cross-cutting reasoning.

*Source:* P-SS-9, D-11.

### R17 — Citation requirement

Every load-bearing claim in **Findings** and **Analysis** MUST cite a passage in `domainspec-subagents-research.md` (file path + per-child header anchor).

*Source:* P-SS-9, D-8 fidelity component.

### R18 — Dispatch record schema

The Dispatch record section of `domainspec-subagents-findings.md` MUST contain:

- **Mode** — one of the R19 enum.
- **Dispatch kind** — `standard | meta` (per R25).
- **Spec path** — the canonical path written at Step 2.5.
- **Spec hash** — sha256 of the persisted spec.
- **Per-agent table** with: agent id, model, one-line difficulty justification, token budget (or "unbounded"), declared output shape.
- **Sequencing** — linear chain, parallel set, or DAG description.
- **Recursion budget actually used** — depth, breadth, total agent count, loop iterations used.
- **Actual spend** — tokens in / tokens out / total per agent, plus sum.
- **Four-component grade** per R21 (with judgment markers per R22).
- **Bootstrap override** — if used, reproduce `{reason, scope}` verbatim.
- **Telemetry emission status** — emitted / failed-with-reason.
- **Exit reason** — one of the R31 taxonomy values (`success | loop_cap_reached | validator_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`) plus 1–2 sentences of context.

*Source:* P-SS-9, D-11.

### R23 — Context + Goal preamble required on both artifact files

Both `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` MUST begin with a **Context + Goal preamble** before any other section.

*Source:* P-SS-9 + P-SS-10 Coverage component.

### R24 — Strategist is enacted by the skill; writers are platform-registered subagents

- **Strategist role** — enacted by the parent Claude session through the skill `domainspec-subagents-strategy`. The strategist is not a separate subagent; the skill's body instructs the parent how to compose the spec (in chat), invoke the validator, propose, dispatch, persist (Step 2.5 spec only), collect, emit telemetry, and hand off.
- **Three writer subagents** — defined in the runtime platform's agent registry:
  - **Claude Code**: `.claude/agents/<name>.agent.md`
  - **GitHub Copilot / VSCode**: `.github/agents/<name>.agent.md`
  - **Other runtimes**: their respective registry path.

The three writer agents: `domainspec-subagents-research-writer`, `domainspec-subagents-findings-writer`, `domainspec-subagents-discovery-writer`. Each MUST honor its role contract.

| Surface | Receives | Returns / Persists |
|---|---|---|
| **Strategist** (skill body, parent session) | User intent | Composes spec in chat (Step 0) → invokes validator (Step 0.5) → chat proposal (Step 1) → after user confirm: writes spec at Step 2.5 (one canonical artifact) → emits R28 telemetry (Step 3 lead-in) → dispatches children (Step 3) → collects returns (Step 4) → dispatches writer agents (Steps 5–7). |
| `domainspec-subagents-research-writer` | Strategist's collected child returns + Context + Goal + working-folder path + spec path | Persists `<working_folder>/domainspec-subagents-research.md`. |
| `domainspec-subagents-findings-writer` | Path to research.md + Context + Goal + spec path | Persists `<working_folder>/domainspec-subagents-findings.md`. |
| `domainspec-subagents-discovery-writer` | Path to findings.md + user-confirmed discovery target path + scope label | Persists the discovery node at the confirmed path. |

*Source:* P-SS-2 / P-SS-9, LLM-agnostic principle, robot-talks precedent.

---

## 8. Mode Rules

### R19 — Each dispatch declares one mode; layers MAY declare their own mode (R30)

Every dispatch declares exactly one **top-level** mode at the spec root:

- `single` — one agent, one question.
- `task-fan-out` — N agents, partitioned concerns, parallel.
- `robot-talks` — N agents, same question, declared perspectives, tensions desired.
- `sequential` — linear chain; agent B depends on agent A. (Layer-to-layer sequencing across the spec also counts as `sequential`; intra-layer parallelism is expressed via `layers[].parallel`.)
- `ping-pong` — two duo layers alternating sequentially over the full file set until edit-drift stops; see SKILL.md for the `iteration` block.
- `pipeline` — heterogeneous per-layer modes (R30). The top-level mode is `pipeline` whenever any two layers carry distinct per-layer modes; composition is **linear** (layer N runs after layer N−1, no DAG).

When the top-level mode is `pipeline`, each entry of `layers[]` MUST declare its own `mode:` from the same enum (excluding `pipeline` itself; layers do not recurse). The R26 validator checks each layer's mode well-formedness independently — there is no top-level DAG semantics; sequencing across layers is linear. This per-layer composability supersedes the former `mode: mixed` reservation; `OQ-mixed-dag-schema` is **closed by R30**.

The mode is declared in the chat proposal and recorded in the R25 spec and the Dispatch record (R18).

*Source:* D-4 of domainspec-subagents-strategy.md discovery.

### R20 — Robot-talks mode binds robot-talks-constitution

A dispatch with `mode: robot-talks` additionally binds [robot-talks-constitution.md](robot-talks-constitution.md). Conflicts resolve in favor of robot-talks-constitution within robot-talks dispatches. See `OQ-robot-talks-stage-a` in §12 for an open ordering question.

*Source:* D-4.

---

## 9. Grading Rules

### R21 — Four-component grade recorded at dispatch close

At dispatch close, the four-component grade MUST be recorded in the Dispatch record on a 0–1 scale:

- **Coverage**, **Independence**, **Fidelity**, **Cost discipline**.

*Source:* P-SS-10.

### R22 — Judgments MUST be marked as judgments

Only **cost discipline** is mechanically computed. The other three are evaluator judgments and MUST carry a `(judgment)` marker. Treating the aggregate as a metric is a constitution violation.

*Source:* P-SS-10 discipline note.

---

## 10. Spec, Validator, Registry, Telemetry (R25–R28)

### R25 — Strategy spec is a content-addressed artifact written AFTER user confirmation

The strategist composes the spec **IN CHAT** as part of R3 Step 1; the chat proposal IS the human-readable narration of the YAML spec — both surfaces describe the same parameter set in the same turn. The R26 validator runs on the in-chat spec **before** user confirmation. No file is involved before Step 2.

**Only AFTER R3 Step 2 user confirm** does the strategist persist the spec to:

- `vault/snapshots/dispatches/YYYY-MM-DD-<slug>-spec.yaml` for `dispatch_kind: standard`, or
- `vault/snapshots/meta-dispatches/<slug>/spec.yaml` for `dispatch_kind: meta`.

This is a narrowly scoped extension of R5's writer pattern: the parent session is the dedicated writer for this one canonical artifact, post-confirm only, one file per dispatch.

**Reconciliation:**
- **R4 fully honored** — no file persists until the user has confirmed.
- **R5 narrowly extended** — the parent writes exactly one file per dispatch at one canonical path; the three writer agents continue to own research / findings / discovery.
- **R6a fully reversible** — Abandon at Step 2 leaves no file on disk.

**Schema (top-level, required unless marked optional):**

```yaml
spec_version: "0.3.0"
dispatch_id: <YYYY-MM-DD-<slug>>
dispatch_kind: standard | meta
mode: single | task-fan-out | robot-talks | sequential | ping-pong | pipeline   # R19; pipeline = heterogeneous per-layer modes (R30)
goal: <one sentence>
context: <2-4 sentences>
heuristic_row: <published id> | user-specified
loop_cap: <int, default 2, max 5>           # typed mechanical floor (harness MUST refuse loop N+1)
stop_conditions:                            # free-text supplements; loop_cap is the typed floor
  - <string>
bootstrap_override:                         # optional; required object shape when present
  reason: <non-empty string>
  scope: spec-only | telemetry-only | working-folder | full
working_folder: <path>                      # repo-relative
layers:
  - layer_id: <stable id>
    role: investigate | evaluate | meta-evaluate | synthesize
    mode: single | task-fan-out | robot-talks | sequential | ping-pong   # R30; REQUIRED when top-level mode == pipeline, OPTIONAL otherwise (defaults to top-level mode). MUST NOT be `pipeline` (layers do not recurse).
    n: <int >= 1>
    parallel: <bool>
    model: <model_id> | "parent"
    agents:
      - agent_id: <stable id>
        angle: <one sentence>
        model: <model_id> | "parent"        # "parent" valid only on synthesize-layer entries
        difficulty_justification: <one line>
        token_budget: <int> | "unbounded"
        expected_output_shape: <one line>
recursion_budget:
  depth: <int>                              # default 2
  breadth: <int>                            # default 5
  total: <int>                              # default 10
  parent_dispatch_id: <upstream dispatch_id or null>
validator:
  model: <model_id>
  retry_policy: one-retry-then-escalate
telemetry:
  event_name: subagent-strategy.dispatched
  corpus_hash_at_emit: <from latest vault/snapshots/*.json, or "BOOTSTRAP" under override>
  spec_hash: <sha256 of this spec YAML, filled at Step 2.5>
```

The `model: "parent"` value is the ONLY mechanism by which a synthesize-layer entry may execute in the parent session rather than as a dispatched subagent. Non-synthesize layers MUST name a concrete model id. There is no `delegate_synthesis` escape hatch.

*Source:* P-SS-2, P-SS-9.

### R26 — Validator runs on the in-chat spec; trivial single-mode dispatches skip it

A named validator (`strategy_spec_schema_valid`, registered per [`governs-runtime-witness-constitution.md`](governs-runtime-witness-constitution.md)) MUST run on the in-chat spec **before user confirmation**. Outcomes:

- **accept** → proceed to chat proposal / user confirm.
- **reject-with-fixes** → strategist revises in-chat spec and re-runs validator **ONCE**. Second rejection escalates to user.
- **abstain** → treated as reject; escalate immediately.
- **accept-with-bootstrap-override** → see Bootstrap override below.

The validator MUST NOT also propose. The checklist verifies R10 / R13 / R14 / R15 / R19 / R23 / R25 / R27.

**Trivial-dispatch carve-out.** When ALL of the following hold:
- `mode: single`, AND
- effective layers = 1, AND
- effective agent count n = 1, AND
- no `bootstrap_override` is present,

the validator dispatch is **SKIPPED**. The R25 spec is still emitted post-confirm. Rationale: validator overhead is disproportionate for trivial lookups; spec emission alone is sufficient discipline.

**Bootstrap override.** The first dispatch of a newly-amended constitution may legitimately fail the validator on items the amendment itself introduced (e.g., a R28 dispatch made before the telemetry sink exists). The strategist MAY include a top-level `bootstrap_override: {reason: <non-empty string>, scope: <named scope>}` in the spec; the validator then issues `accept-with-bootstrap-override`, with the override logged in telemetry and surfaced in the R18 Dispatch record. The `scope` field MUST name specific rule IDs and infrastructure gaps; a `bootstrap_override` with empty `reason` or empty `scope` MUST be rejected.

**Anti-abuse.** Bootstrap override is for first-dispatch infrastructure gaps only. R28 telemetry records every use; `override_count > 1` per amendment cycle is a constitution violation flagged by the next residue-counter run.

The harness MUST refuse a loop iteration beyond `loop_cap`. `stop_conditions` remains as non-binding human-readable supplements.

*Source:* P-SS-9, governs-runtime-witness-constitution.md.

### R27 — Agent-chosen defaults must cite their heuristic; additive-amendment path

When the user does not specify dispatch parameters and the strategist picks defaults — per the heuristic table the skill publishes — the spec MUST record `heuristic_row:` for each agent entry. Allowed values: `<heuristic-id>` (a stable id from the skill's heuristic table) or `user-specified`. "Defaults applied without justification" is an R27 violation; R26 MUST reject.

**Additive-amendment path.** Adding new operational mechanics (validator gates, telemetry sinks, parameter fields) that do NOT alter R1–R24 normative content follows the lighter amendment path: bump `version`, append Version History, append amendment-log entry per [schema-amendment-discipline-constitution.md](schema-amendment-discipline-constitution.md). No premise revision required when no rule semantics change. R25 / R26 / R28 themselves are additive-mechanics amendments under this path.

*Source:* P-SS-9, R24, schema-amendment-discipline-constitution.md.

### R28 — Telemetry event emission

After Step 2.5 spec write and BEFORE Step 3 fan-out, the strategist MUST emit a telemetry event to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`:

```json
{
  "event_name": "subagent-strategy.dispatched",
  "dispatch_id": "YYYY-MM-DD-<slug>",
  "spec_path": "vault/snapshots/.../spec.yaml",
  "spec_hash": "<sha256>",
  "corpus_hash": "<at emit time or 'BOOTSTRAP' under override>",
  "mode": "<R19 value>",
  "dispatch_kind": "standard|meta",
  "loop_cap": 2,
  "n_agents": 3,
  "bootstrap_override_used": false,
  "bootstrap_override_reason": null,
  "bootstrap_override_scope": null,
  "amendment_cycle": "<id or null>",
  "timestamp": "<ISO-8601 UTC>"
}
```

**Telemetry sink path.** `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`. If the directory does not exist, the strategist MUST create it before the first emission. This bootstrap step is permitted without a separate user gate.

**Bootstrap behavior.** When `bootstrap_override` is set on the spec, the telemetry event MUST still emit, with `corpus_hash` set to the most recent known snapshot OR the string `"BOOTSTRAP"` if no snapshot is reachable. The override reason populates `bootstrap_override_reason`; scope populates `bootstrap_override_scope`.

Emission failures (filesystem, permissions) are logged and the dispatch proceeds: telemetry is an observability concern, not a dispatch gate.

*Source:* P-SS-9, P-SS-10 (cost discipline mechanically computable).

---

## 11. Cross-Cutting Discipline (R29–R31)

These three axioms cut across mode, lifecycle, and grading. They were promoted from `research-constitution.md@v0.1.0` after running successfully as research-skill-local rules; they now apply to every dispatch under this base constitution. The research constitution retains R10 / R24–R26 / R21 as **inheritance markers** pointing here (see its Amendment log).

### R29 — Anti-bias tension: angles MUST be pairwise tensioned, not merely non-overlapping

For any layer with N ≥ 2 agents, the per-agent `angle`s MUST be **pairwise tensioned**, not merely non-overlapping. Pairwise tensioned means: for any two agents A and B in the same layer, there exists a question on which a competent observer could predict, in advance, that A and B would disagree.

Tension axes include:

- **Methodology** — empirical vs formal vs adversarial.
- **Source corpora** — different literatures, different schools, different repositories.
- **Attack vector** — different skeptic gates (precedent kill vs non-vacuity vs definitional soundness); different angles of refutation.
- **Temporal / era priors** — pre-1990 vs post-2010 literature; classical vs contemporary framing.

"Non-overlapping and jointly covering" — the R26 checklist item 3 framing — is necessary but insufficient: disjoint angles can both be biased toward the same conclusion. R29 strengthens the check to pairwise tension. The R26 validator MUST name the tension axis for each pair of sibling agents in a multi-agent layer; failure to name one yields `reject-with-fixes` with reason `false-consensus risk`.

Discovery source: `vault/discovery/anti-bias-vector-composition/` (principle.md, literature.md, validator-check.md, examples.md). Cite there, do not duplicate the literature in this constitution.

*Source:* P-SS-5 (locked contract before fan-out), P-SS-10 (independence component of the four-grade).

### R30 — Per-layer mode composability (closes OQ-mixed-dag-schema)

Each `layer` entry in the R25 spec MAY declare its own `mode:` field. The top-level `mode:` becomes `pipeline` when any two layers declare distinct modes. The R26 validator checks per-layer well-formedness independently (each layer's mode is validated in isolation against the same checklist that would apply to a single-mode dispatch of that shape).

Composition is **linear**: layer N runs after layer N−1. There is no DAG and no `depends_on:` field on agents. The role-ordering invariant (synthesize never precedes evaluate; meta-evaluate never precedes evaluate) is inherited from R25 unchanged and enforced across layers regardless of per-layer mode.

R30 supersedes the former `mode: mixed` reservation. `OQ-mixed-dag-schema` (§13) is **closed** — its v0.2.0 status as an unresolved open question is retired by this axiom.

*Source:* P-SS-3 (independence requirement applies per-layer naturally), P-SS-9 (lifecycle is linear).

### R31 — Typed `exit_reason` taxonomy at dispatch close

Every dispatch terminates with exactly one `exit_reason` from the closed taxonomy:

- **`success`** — `success_metric` was satisfied (when defined) OR the validator and all agents returned cleanly (when no metric was declared).
- **`loop_cap_reached`** — `loop_cap` (R25 spec field) was exhausted without satisfying termination conditions.
- **`validator_rejected_twice`** — R26 validator returned `reject-with-fixes` twice (the one-retry rule); escalated to user.
- **`dissent_irreconcilable`** — agents could not converge after `loop_cap` passes; surviving dissent recorded rather than smoothed away.
- **`user_abort`** — user said Abandon at any gate (R6a, R6b, or any post-confirm gate).
- **`unrecoverable_error`** — technical failure (agent crashed, tooling failure, upstream-corpus unavailability).

The `exit_reason` MUST be:

1. **Reported to the user in chat at dispatch close**, accompanied by 1–2 sentences of context (what was attempted, what stopped it, what the user can do next). Silent exit is an R31 violation.
2. **Recorded in the Dispatch record (R18)** as an additional field — see R18 amendment below.
3. **Emitted in the R28 telemetry event** at dispatch close, JOIN-able with the dispatch-start telemetry on `dispatch_id`.

The Dispatch record schema (R18) is amended to include `exit_reason` from this closed taxonomy as a required field. The R28 telemetry event gains an `exit_reason` field on the close-event; the dispatch-start event remains unchanged.

*Source:* P-SS-9 (lifecycle observability), P-SS-10 (grading is post-hoc but exit category must be typed for retro-analysis).

---

## 12. Governance

### Adoption

Binding for all subagent dispatch initiated after `last_updated`. Pre-existing artifacts are grandfathered.

**v0.2.0 grandfathering.** Pre-2026-05-16 dispatches are not retroactively required to satisfy R25–R28. Dispatches initiated on or after 2026-05-16 MUST satisfy R25–R28 (subject to R26 bootstrap-override on first invocation per amendment).

### Amendment process

Two paths:

1. **Normative amendment** (changes R1–R24 substance, or R25/R26/R28 schema semantics): revise the source premise → revise the rule → revise the skill → bump version → append amendment log entry per [schema-amendment-discipline-constitution.md](schema-amendment-discipline-constitution.md).
2. **Additive-operational-mechanics amendment** (R27 path): no premise revision; bump version, append Version History, append amendment log entry.

A normative rule MUST NOT change without a corresponding premise change.

### Non-negotiable principles

Load-bearing — cannot be relaxed without revisiting foundational premises:

- **R4** — proposal never persists before user confirm. (R25's post-confirm spec write is the deliberate, narrowly scoped extension.)
- **R5** — only named writer surfaces persist files; the strategist's spec-write at Step 2.5 is the one carve-out, bounded to one path and one moment.
- **R6** — both user gates mandatory.
- **R11** — trust-but-verify.
- **R17** — citation requirement.

**R4 / R5 / R6 reconciliation note for v0.2.0.** R25's post-confirm spec write means R4 is fully honored (no pre-confirm persistence), R5 is narrowly extended (the parent writes exactly one canonical artifact per dispatch, post-confirm, as a named writer surface — distinct from the three writer agents which handle research / findings / discovery), and R6a's reversibility is fully preserved (Abandon leaves no file). The Wave-3 Constitutional-Purist review surfaced and resolved the prior conflict that would have existed under a pre-confirm spec write.

### Known drift

[`ontology-conventions.md`](../ontology-conventions.md) listing of `domainspec-subagents-strategy` as a `node_type` remains stale per the v0.1.5 note; cleanup deferred.

### Known TODO — governs_check registry

Frontmatter declares `governs_check: [strategy_spec_schema_valid]`. The validator function backing this check will be registered in `vault_common.governance.REGISTRY` in a follow-up commit; until that lands, the governs-runtime-witness audit will see an unresolved check. Acknowledged as v0.2.0 known TODO under the R26 bootstrap-override discipline for the first cycle.

---

## 13. Known Open Questions

Items to resolve in v0.3.1 or as follow-up amendments:

- **OQ-robot-talks-stage-a** — `mode: robot-talks` ordering with respect to [robot-talks-constitution.md](robot-talks-constitution.md) R2 Stage A is currently undefined: user-first scoping vs. spec-narrated-in-Step-1 needs explicit resolution.
- **OQ-single-use-override-enforcement** — a machine-checkable counter for `bootstrap_override.scope` uses per amendment cycle (consuming R28 telemetry) is named but unimplemented.
- **OQ-telemetry-consumer** — a consumer script reading `subagent-strategy.jsonl` and JOINing with R21 grades to produce per-cycle dashboards is not yet specified.
- **OQ-non-claude-runtime-paths** — portable mapping for `vault/snapshots/dispatches/` and `internal_tools/vault_telemetry/` on non-Claude-Code runtimes is undefined; current paths assume Claude Code layout.

### Resolved

- **OQ-mixed-dag-schema** — **CLOSED by R30 (v0.3.0).** Per-layer mode composability supersedes the `mode: mixed` reservation. Multi-mode dispatches express their shape as `mode: pipeline` at the top level with each layer carrying its own mode; composition is linear (no DAG needed).

---

## 14. Connections

| Document | Type | Description |
|----------|------|-------------|
| [domainspec-subagents-strategy-premises.md](../premise/domainspec-subagents-strategy-premises.md) | `derives-from` | Source premises P-SS-1..10. |
| [domainspec-subagents-strategy.md](../discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md) | `discovery-of` | Discovery doc with D-1..12, A-1..8, OQ-1..7. |
| [robot-talks-constitution.md](robot-talks-constitution.md) | `binds-when` | Applies additionally when `mode: robot-talks` (R20). |
| [robot-talks-premises.md](../premise/robot-talks-premises.md) | `mode-of-source` | Source premises for robot-talks-specific rules. |
| [system-premises.md](../premise/system-premises.md) | `derives-from` | P-SYS-3, P-SYS-7 ground R10 and R21. |
| [ontology-conventions.md](../ontology-conventions.md) | `governed-by` | Frontmatter / node_type compliance. |
| [schema-amendment-discipline-constitution.md](schema-amendment-discipline-constitution.md) | `governed-by` | Amendment log discipline for both normative and additive paths. |
| [governs-runtime-witness-constitution.md](governs-runtime-witness-constitution.md) | `governed-by` | R26 validator is registered per this constitution's witness discipline. |
| [templates/domainspec-subagents-research.md](../templates/domainspec-subagents-research.md) | `shape-contract-for` | Research-writer template. |
| [templates/domainspec-subagents-findings.md](../templates/domainspec-subagents-findings.md) | `shape-contract-for` | Findings-writer template. |
| `.claude/skills/domainspec-subagents-strategy/` | `operationalized-by` | Executable behavior enforcing this constitution (v0.2.0 implements R25 spec, R26 validator, R27 heuristic_row, R28 telemetry). |
| `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` | `telemetry-sink-for` | R28 emission target. |
| `vault/snapshots/dispatches/` | `artifact-path-for` | R25 standard-dispatch spec persistence. |
| `vault/snapshots/meta-dispatches/` | `artifact-path-for` | R25 meta-dispatch spec persistence. |
| [../amendments/2026-05-16-subagent-strategy-parametrization.md](../amendments/2026-05-16-subagent-strategy-parametrization.md) | `modified-by` | v0.2.0 amendment log entry. |
| [../discovery/data-contract-as-formal-artifact/README.md](../discovery/data-contract-as-formal-artifact/README.md) | `governs` | Dispatch `2026-05-18-data-contract-formal-artifact-01` (triangulation) ran under R15/R16/R17/R18/R21/R22/R23 and produced this discovery. |
| `vault/foundational-knowledges.md` | `cited-by` | The foundational-knowledges L7 multi-agent-orchestration layer cites this constitution as the load-bearing rule set for subagent fan-out, synthesis, and lifecycle. |
| `vault/premise/multi-agent-composition-premise.md` | `cited-by` | The multi-agent-composition premise cites this constitution as the operational expression of its condition (a) — governed dispatch. |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.3.0 | 2026-05-26 | **Cross-cutting discipline — new §11 (R29–R31).** Backported from `research-constitution.md@v0.1.0` after the three patterns proved out in the research skill. R29 (anti-bias tension: pairwise tensioned angles, not merely non-overlapping; names tension axes methodology / corpus / attack vector / era priors; validator MUST name the axis per pair or reject with `false-consensus risk`). R30 (per-layer mode composability: each `layers[]` entry MAY declare its own `mode:`; top-level `mode: pipeline` when heterogeneous; validator checks per-layer well-formedness independently; composition linear, no DAG). R31 (typed `exit_reason` taxonomy: `success | loop_cap_reached | validator_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`; reported in chat at close with 1–2 sentences; recorded in R18 Dispatch record; emitted in R28 telemetry close event). R19 extended with `pipeline` and `ping-pong` modes; the prior `mixed` reservation is retired. R25 spec schema bumped to `0.3.0`: per-layer `mode:` field added under `layers[]`. R18 Dispatch record amended to require `exit_reason`. R28 telemetry amended to emit a close-event with `exit_reason`. **OQ-mixed-dag-schema CLOSED** — moved from open questions to a resolved-by-R30 note in §13. Index gains "Cross-Cutting Discipline (R29–R31)" as §11; Governance becomes §12, Known Open Questions §13, Connections §14. |
| 0.2.0 | 2026-05-16 | **Spec + validator + registry + telemetry — new §10.** Introduced R25 (content-addressed spec, written post-confirm at Step 2.5; `dispatch_kind: standard\|meta`; `model` union `<model_id>\|"parent"` restricted to synthesize layers), R26 (validator with trivial-dispatch carve-out; `bootstrap_override = {reason, scope}` + anti-abuse; one-retry then escalate), R27 (heuristic_row attribution + additive-amendment path), R28 (JSONL telemetry sink at `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`; bootstrap behavior for first-cycle dispatches). R3 lifecycle gains Step 2.5. R4 / R5 / R6 reconciled with explicit non-conflict note (Wave-3 Constitutional-Purist surfaced and resolved the prior conflict that would have existed under pre-confirm spec write). `loop_cap: int (default 2, max 5)` is a typed top-level schema field; harness MUST refuse beyond cap. `mode: mixed` RESERVED pending DAG schema (R19). `delegate_synthesis` escape hatch explicitly removed; synthesize layers MUST use `model: "parent"`. R14 gets a parent-model exception. Added §12 Known Open Questions. Frontmatter: `version` 0.1.4→0.2.0 (also acknowledging v0.1.5 was applied in history without a frontmatter bump), `last_updated: 2026-05-16`, `schema_version: 1`, `governs_pattern`, `governs_check`. §13 Connections: added schema-amendment-discipline, governs-runtime-witness, telemetry sink path, spec paths, and v0.2.0 amendment log entry. |
| 0.1.5 | 2026-05-03 | R15 + R3 step 7 + R24 revised — scope-routed discovery promotion. |
| 0.1.4 | 2026-05-02 | R24 revised — strategist enacted by skill, not a subagent. |
| 0.1.3 | 2026-05-02 | Working folder + agent registry rules. |
| 0.1.2 | 2026-05-02 | Research-writer split. R3 grew from 6 to 7 steps. |
| 0.1.1 | 2026-05-02 | Added R23 Context + Goal preamble. |
| 0.1.0 | 2026-05-02 | Initial constitution codifying premises@v0.4.0 into 22 rules. |
