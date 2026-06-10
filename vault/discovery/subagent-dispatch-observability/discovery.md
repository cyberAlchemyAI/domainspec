---
tags: [vault, discovery, multi-agent, subagents, telemetry, observability, monitoring, dispatch]
node_type: discovery
is_session: false
layer: [ontology, architecture]
nature: [explanatory, reference]
status: draft
version: 0.1.0
last_updated: 2026-06-08
created_by: victorboscaro@gmail.com
---

# Subagent Dispatch Observability

## Objective

Define a three-level, append-only observability model — `dispatch` → `layer` → `agent` — so that every subagent dispatch in the framework emits a structured, queryable record of what was asked, how it was wired, and what each agent received and concluded. The end state: a single telemetry stream that answers the portfolio question ("what work ran and what did it cost"), the governance question ("did the review tier actually run, with how many reviewers and what dissent"), and the forensic question ("what did each agent receive and decide"), with one inescapable emit gate that no dispatch can bypass.

## 1. Business Context

### Why now

The framework is moving toward a set of subagent-usage skills covering distinct task intents (research, document edit, code edit, quick lookup, decision-by-debate, audit). Half of the stated goal for that toolkit is **a single place where dispatches are saved, so usage can be monitored**. That sink nominally exists — the base engine specifies R28 telemetry to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` — but it records only one level (the dispatch), it is already drifting, and it captures the agent's *output* while dropping what the agent was *given*. Before any new usage-skill is built, the recording contract it will emit against has to be frozen, or every new skill emits into a schema that is already inconsistent.

### What's broken

Each problem with its on-disk location (verified 2026-06-08):

- **Single-level log.** `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` carries only `subagent-strategy.dispatched` events — one row per dispatch. There is no record at the layer level or the agent level. The dispatch-level row cannot answer "how many reviewers ran in layer 2" or "what did agent L1-A3 conclude."
- **Schema drift in the existing 8 events.** Same file: the timestamp key is spelled both `ts` and `timestamp`; `n_agents` is present in 1 of 8 events and absent in 7; `mode` carries `sequential`, `task-fan-out`, and `meta` — vocabularies bleeding together. This is the same disease `subagents-topologies` Drift 3 audits at `vault/discovery/subagents-topologies/discovery.md:32`.
- **Initialization is never recorded.** The per-agent decision record is output-only — see the explorer schema at `/Users/victorboscaro/domainspec-theorem/.claude/agents/research-explorer.md:29-50`: it saves `decision`, `rationale`, `references_consulted`, but not the `angle` / briefing the agent received. The assigned angle lives cross-referenced in `dispatch.yaml`; the rendered prompt is persisted nowhere. "What was this agent told to do" cannot be reconstructed from its own record.
- **Same fact recorded twice.** Per-agent provenance (sources, decision, dissent) lives in a 200-word prose markdown file in the dispatch folder; the proposed telemetry would record the same facts as structured rows. Writing one fact in two shapes is precisely the drift generator audited as `subagents-topologies` Drift 3 (`vault/discovery/subagents-topologies/discovery.md:32`).
- **An ungoverned channel proves emission is not enforced.** `subagents-topologies` Drift 5 (`vault/discovery/subagents-topologies/discovery.md:34`) counts 32 multi-agent folders with zero `dispatch.yaml` and zero `LEDGER.md` — dispatches that ran while emitting nothing. Observability without a mandatory emit gate produces exactly this: the surface that would prove a dispatch ran is the surface most often skipped.

### What stays the same

Explicit scope boundary — this discovery designs the **recording contract only**. It does not touch:

- **The dispatch engine and lifecycle.** `domainspec-subagents-strategy` spec composition, the `dispatch.yaml` spec, validator/review gates, the user-confirm gates — unchanged. We add an observability layer over dispatch; we do not rewrite dispatch.
- **The role taxonomy and anti-bias rules.** The four work-roles + validator (`subagents-strategy-refinement/role-taxonomy.md`) and the pairwise-tension rules are referenced, not redefined.
- **The `intent` and `topology` vocabularies themselves.** This discovery records *which* intent and topology a dispatch had, but the closed enum of legal values is **not decided here** — it depends on the vocabulary-unification work that closes `subagents-topologies` OQ-1 and on the (future) intent-axis discovery. The field structure is frozen; the value enums are marked `provisional` (OQ-1 below).
- **The per-agent prose file.** It is not deleted — it becomes conditional (Core Concept C3). The R12 content schema survives as the prose option.
- **`research-*` corpora, closure marks, the scientist agent pool.** Research-local artifacts are out of scope.

## 2. Core Concepts

### C1 — Three-level append-only event model

The log has three nesting levels, each a question class:

| Level | Name (reuse, do not coin) | Monitoring question |
|---|---|---|
| 1 | `dispatch` | Portfolio — what work ran, what shape, what did it cost, how did it close |
| 2 | `layer` (the `layers[]` of the base spec — **not** a new "group" term) | Governance — did the review tier run? how many reviewers? was there dissent? |
| 3 | `agent` | Forensic — what was each agent given, what did it decide, which model, what did it touch |

Levels are **flat append-only JSONL rows**, joined by foreign keys (`dispatch_id`, `layer_id`, `agent_id`) — not nested objects. The tree is reconstructed by query. Each of `dispatch` and `agent` emits a `started` row before work and a `closed` row after, so a crash leaves a `started` with no `closed` (a visible failure) rather than silence. The layer level uses `started`/`closed` to bracket its agents.

The level-2 (`layer`) record is the highest-value addition: "did ≥2 reviewers run and did they dissent" is a layer fact, and today's log cannot express it.

### C2 — Inclusion criterion: *log what would otherwise vanish*

An agent earns a full forensic row when its output would disappear once the dispatch closes. A reviewer's verdict and an explorer's source list vanish from chat → they are logged. A frontmatter/edges normalizer makes a genuine semantic judgment (which `## Connections` edges to add), but that judgment **materializes in the versioned artifact itself** (the edges land in the file, diffable in git) → it is self-recording and earns only a lightweight mark (`normalizers_applied` on the caller's row), not a forensic row. The deciding test is durability of the output, not whether a judgment occurred.

### C3 — Provenance in the log; prose conditional on intent

Structured per-agent provenance (`role`, `model`, `decision`, `dissent`, `sources`, `files_touched`) lives in the `agent.closed` row — always, cheaply. The ≤200-word prose decision record is written **only when the agent's reasoning is itself the product** (research findings, a decision rationale). For a code or document edit the deliverable is the diff/file and the prose file is `null`; `agent.closed.prose_file` points to the file when it exists. This removes the same-fact-twice duplication (What's broken, item 4) by making the structured row canonical and the prose optional.

### C4 — Mandatory emit gate

Every dispatch MUST emit `dispatch.started` before fan-out and `dispatch.closed` at termination. A dispatch that emits neither did not happen as far as monitoring is concerned, and an audit flags any dispatch folder lacking its paired events. This is the construct that closes the ungoverned-channel failure (What's broken, item 5); the enforcement mechanism is an open question (OQ-3).

## 3. Event Schemas (frozen structure; provisional value-enums)

Three contracts. Field *names and presence* are frozen; the two fields whose *values* depend on upstream vocabulary work are marked `provisional`.

### 3.1 — `dispatch` level

```jsonc
// dispatch.started — emitted BEFORE fan-out
{
  "event": "dispatch.started",
  "dispatch_id": "2026-06-08-<slug>",      // PK
  "parent_dispatch_id": null,              // FK for nesting (meta-dispatch)
  "goal": "<free text — what this dispatch is for>",   // REQUIRED; monitoring field #1
  "intent": "<provisional enum>",          // research|doc|code|lookup|decide|audit — see OQ-1
  "topology": "<provisional enum>",        // depends on vocabulary unification — see OQ-1
  "output_root": "<path where artifacts land>",
  "n_layers_planned": 2,
  "n_agents_planned": 5,
  "spec_hash": "<hash of dispatch.yaml>",
  "corpus_hash": "<hash or BOOTSTRAP>",
  "project": "domainspec",
  "timestamp": "2026-06-08T13:11:00Z"      // canonical key is `timestamp`, never `ts`
}

// dispatch.closed — emitted at termination
{
  "event": "dispatch.closed",
  "dispatch_id": "2026-06-08-<slug>",
  "exit_reason": "success|loop_cap_reached|validator_rejected_twice|reviewer_rejected_twice|dissent_irreconcilable|user_abort|unrecoverable_error",
  // ^ base R31 enum verbatim; `reviewer_rejected_twice` is the research-local addition (no auditor role in base). Do NOT coin `max_loops_reached`.
  "n_agents_actual": 5,
  "loops_used": 1,
  "timestamp": "2026-06-08T13:14:00Z"
}
```

### 3.2 — `layer` level

```jsonc
{
  "event": "layer.started",
  "dispatch_id": "2026-06-08-<slug>",      // FK
  "layer_id": 2,                           // ordinal within the dispatch
  "layer_role": "explore|review|synthesize|implement",
  "topology": "<provisional enum>",        // per-layer wiring — see OQ-1
  "n_agents": 2,
  "timestamp": "..."
}

{
  "event": "layer.closed",
  "dispatch_id": "2026-06-08-<slug>",
  "layer_id": 2,
  "n_reviewers": 2,                         // answers "did ≥2 reviewers run?"
  "dissent_count": 1,                       // answers "was there real dissent?"
  "verdict": "pass|fail|mixed|n/a",         // n/a for non-review layers
  "timestamp": "..."
}
```

### 3.3 — `agent` level

```jsonc
{
  "event": "agent.started",
  "dispatch_id": "...", "layer_id": 2, "agent_id": "L2-A1",   // composite PK
  "role": "explorer|skeptic|writer|auditor|reviewer|implementer|validator",
  "check": "content|format|both|n/a",       // populated only for role: reviewer
  "model": "<model assigned by strategist>",
  "angle": "<the assigned angle / sub-goal>",
  "briefing": "<full text the agent received>",   // DECISION: store verbatim — see OQ-2
  "inputs": ["<artifacts/paths handed to the agent>"],
  "timestamp": "..."
}

{
  "event": "agent.closed",
  "dispatch_id": "...", "layer_id": 2, "agent_id": "L2-A1",
  "decision": "<1 line — what it concluded>",
  "dissent": { "is": true, "against": "L1-A3" },
  "files_touched": ["docs/x.md"],
  "normalizers_applied": ["frontmatter"],   // lightweight mark for mechanical helpers (C2)
  "sources": [                              // REQUIRED for external-research agents; [] otherwise
    { "cite": "<author, year, title OR url>", "kind": "paper|url|doc|repo-file", "status": "verified|em-leitura|nao-lido|refuta" }
  ],
  "closure_mark": null,                     // optional; only where the domain uses closure marks
  "prose_file": null,                       // path when the prose record exists; null otherwise (C3)
  "timestamp": "..."
}
```

## 4. Logging rules (the two transversal contracts)

- **Provenance-in-log / prose-conditional (C3).** Every epistemic agent emits `agent.started` + `agent.closed`. The prose ≤200-word file exists only when the reasoning is the deliverable; `sources` and `decision` live in the structured row regardless, so they are never written twice.
- **Epistemic logs / mechanical is self-recording (C2).** Deciding agents get all three levels. Deterministic-output transformers (frontmatter/edges adders) get no row of their own — only `normalizers_applied` on the caller's `agent.closed`. The mark records that normalization ran; the *what* is recoverable from the file's git history.

## 5. Minimum emission per intent (so quick lookups are not over-instrumented)

| Intent | dispatch | layer | agent | prose |
|---|---|---|---|---|
| quick lookup | ✅ started/closed | ❌ (single trivial layer) | 1 row | null |
| research | ✅ | ✅ (≥2 layers) | ✅ each | ✅ |
| doc / code edit | ✅ | ✅ | ✅ each | null |
| decision (debate) | ✅ | ✅ (tensioned review layer) | ✅ each | ✅ (decision record) |
| audit (review-only) | ✅ | ✅ (one review layer) | ✅ each | intent-dependent |

The dispatch level is never skipped — it is the governance gate (C4). Layer and prose scale down for ephemeral work.

## 6. Migration from today's log

The existing 8 events in `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` map forward, not sideways:

| Today | Becomes | Note |
|---|---|---|
| `subagent-strategy.dispatched` | `dispatch.started` | add `goal`, `output_root`, `n_layers_planned` |
| `ts` \| `timestamp` (mixed) | `timestamp` | canonicalize; reject `ts` |
| `dispatch_kind` | `intent` | value remap pending OQ-1 |
| `mode` | `topology` | value remap pending OQ-1 vocabulary unification |
| (none) | `layer.*`, `agent.*` | new levels |

Old events are not rewritten in place; the new schema applies from the first dispatch after it freezes. A reader of the historical 8 events treats them as pre-schema (the same stance `subagents-topologies` takes toward pre-governance audits).

## 7. Open Questions

### OQ-1 — `intent` and `topology` value-enums are provisional

The structure of every schema above is frozen, but the legal *values* of `intent` and `topology` are not. **Recommendation:** keep both fields `provisional` in the contract and close them only after (a) `subagents-topologies` OQ-1 unifies the three competing topology naming systems, and (b) the intent-axis discovery fixes the intent enum. Freezing values now would coin a fourth parallel vocabulary — the exact failure this whole line of work is trying to end. Ship the structure; defer the enums.

### OQ-2 — `briefing` stored verbatim: cost vs. reproducibility

The decision is to store the full briefing text the agent received (not just `role` + `role_def_version` + `angle`). This buys perfect reproducibility without cross-referencing git, at the cost of log size. **Recommendation:** store the briefing verbatim as decided; if row size becomes a problem in practice, move the briefing to a sidecar file (`agents/<id>.briefing.txt`) referenced by path from `agent.started`, rather than reverting to params-only. Revisit after the first dispatches show real row sizes.

### OQ-3 — How is the emit gate (C4) actually enforced?

C4 says every dispatch must emit; it does not say what makes that true. **Recommendation:** route all dispatches through a thin wrapper (a dispatch skill or a hook) that emits `dispatch.started`/`closed` around the fan-out, so emission is structural rather than author-discipline — and back it with an audit that flags any dispatch folder lacking paired events. This is the operational answer to `subagents-topologies` OQ-2/OQ-3 (make dissent-capture and channel governance blocking, not advisory).

### OQ-4 — One stream or partitioned?

All levels currently target one JSONL. **Recommendation:** keep a single append-only stream keyed by the `event` field (cheap to write, joinable by `dispatch_id`); partition by project or by level only if write volume or query latency forces it. Premature partitioning adds path vocabulary (another drift surface) for no current benefit.

### OQ-5 — Is the telemetry committed or gitignored?

The per-dispatch run folder is gitignored as provenance; the telemetry stream is a different artifact. **Recommendation:** commit the telemetry stream — it is the monitoring record, the durable half of the stated goal, not scratch — but gate on a size/PII review of the `briefing` and `inputs` fields before treating it as freely committable. If briefings contain sensitive paths or content, OQ-2's sidecar option plus selective gitignore applies.

## Connections

| Document | Type | Description |
|---|---|---|
| `vault/discovery/subagents-topologies/discovery.md` | `derives-from` | The five verified drifts (Drift 2 dissent-capture, Drift 3 schema drift, Drift 5 ungoverned channel) are the evidential basis for this discovery's "What's broken"; this observability model is their operational answer. |
| `vault/discovery/subagents-strategy-refinement/principle.md` | `cites` | Reuses the role taxonomy, the `layers[]` concept (level 2), and the typed `exit_reason` rather than redefining them. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `cites` | R28 telemetry is the single-level emission this discovery extends to three levels; the engine and lifecycle are cited as out-of-scope-unchanged. |
| `vault/discovery/subagent-pipeline-composition/discovery.md` | `cited-by` | The composition discovery records into this 3-level emit contract and refines its OQ-2 briefing decision (params+sha vs verbatim). |
