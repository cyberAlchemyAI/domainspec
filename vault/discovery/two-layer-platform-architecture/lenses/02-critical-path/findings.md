---
tags: [vault, lens-findings, two-layer-platform-architecture]
node_type: findings
is_session: false
layer: architecture
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Infrastructure Critical-Path Analysis

## Objective

Build the dependency DAG for the five subsystems; identify the critical path; identify the smallest viable infrastructure set that unblocks the parent discovery's two empirical questions; produce a 6-week schedule.

## Findings

## 1. Dependency DAG

```
                    ┌──────────────────────────────┐
                    │  vault_ctl (validator + CLI) │  ◄── foundational; touches files
                    └──────────────┬───────────────┘
                                   │ HARD (clean frontmatter, edge types,
                                   │       valid backlinks)
                ┌──────────────────┼─────────────────────┐
                │                  │                     │
                ▼                  ▼                     ▼
        ┌──────────────┐   ┌────────────────┐   ┌───────────────────┐
        │ graph_retrieval│  │ vault_telemetry│   │ convergence_runner│
        └────────┬───────┘  └────────┬───────┘   └─────────┬─────────┘
                 │                   ▲                     │
                 │ SOFT              │ SOFT (ingests       │ SOFT (emits
                 │                   │  events)            │  events)
                 └───────────────────┴─────────────────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ pipeline (Lean)    │  ◄── consumes mature
                         │                    │      axioms only
                         └────────────────────┘
```

Edge inventory:
- `vault_ctl → {graph_retrieval, vault_telemetry, convergence_runner}`: **HARD.** Kuzu ingest fails on malformed frontmatter; telemetry metrics are noise without typed edges; convergence boundary classifier reads the same fields.
- `graph_retrieval ↔ convergence_runner`: **SOFT both ways.** Convergence dispatch can read flat files; graph retrieval makes "what does the agent already see" reproducible.
- `vault_telemetry ← {graph_retrieval, convergence_runner}`: **SOFT.** Telemetry can run on raw vault, but form-invariance and convergence metrics improve with retrieval-shaped recall numbers and structured dispatch logs.
- `pipeline (Lean) ← everything`: **HARD on `vault_ctl`** (needs valid axioms with stable IDs); **SOFT on telemetry/convergence**.

## 2. Critical path

True critical path (collapsing soft edges):

```
vault_ctl  →  {graph_retrieval, convergence_runner, vault_telemetry}  →  pipeline
```

**Where build risk concentrates:**
1. **`convergence_runner`'s boundary classifier.** "Two agents have converged iff their hom-presheaves agree per node" is a theorem statement, not a spec. The operational proxy (bottleneck distance on persistence diagrams? edge-overlap on resulting graphs? Jaccard on cited node IDs?) is undefined. Hardest unknown.
2. **`vault_telemetry`'s form-invariance metric.** Defining "is the graph still attractor-shaped" empirically requires a proxy that does not yet exist.
3. **`graph_retrieval`'s per-intent compose-functions.** Intent taxonomy is not yet enumerated formally (lens 04 of parent discovery's sibling); risks scope creep into a general router.

Lean pipeline, while at end of chain, is the *least* risky technically — content risk (do we have anything Lean-worthy yet?), not engineering.

## 3. Smallest viable infrastructure set

To answer the parent discovery's two empirical questions — (i) do the four predicted residues generate new constitutions in 30 days, and (ii) can we re-dispatch the Gödel lens with hard-fetch and capture it structurally — the minimum is:

**(a) `vault_ctl` — minimum scope:**
- Frontmatter validator (`node_type`, `layer`, `nature`, `status`, `version`, `last_updated`, `verification` on lens files)
- Edge-type linter (`derives-from`, `governs`, `supersedes`, etc.) — refuses unknown predicates
- `vault-ctl snapshot <date>` — writes content-addressed manifest to `vault/snapshots/`
- **Not in MVP:** session-close runner, auto-backlinks, rich CLI surface

**(b) `vault_telemetry` — minimum scope:**
- One job: diff two snapshots, emit per-residue counters: `constitutions_added`, `constitutions_added_at_predicted_gap[i]` for i ∈ {convicção, schema-meta, derives-chain, governs-edges}, `lenses_added_with_verification=web-fetched`
- Output: single markdown report appended weekly
- **Not in MVP:** convergence metric, form-invariance scoring, dashboards

**(c) `convergence_runner` — minimum scope, dispatch + log only:**
- Wrapper dispatching one lens-task to N agents in parallel with frozen prompt + `verification: web-fetched` hard requirement
- Persists agent outputs + tool-call traces to `vault/discovery/<slug>/lenses/NN-<lens>.dispatch/`
- **Not in MVP:** boundary classifier (defer until the form-invariance question is resolved on paper)

That trio measures the 30-day residue prediction and captures the Gödel re-dispatch structurally. `graph_retrieval` and `pipeline (Lean)` are **deferred** from the empirical floor.

## 4. Six-week schedule

**Weeks 1–2: `vault_ctl` MVP + snapshot zero.**
- Day 1: snapshot zero (hand-written if necessary). Cannot wait — the 30-day window does not pause for tooling.
- Build validator, edge linter, snapshot command.

**Weeks 3–4: `vault_telemetry` MVP + `convergence_runner` dispatch-only.**
- Telemetry: weekly snapshot diff + residue counter report. First report end of week 3.
- Convergence dispatch wrapper: re-dispatch Gödel lens with `verification: web-fetched` enforced; persist trace. End of week 4.

**Weeks 5–6: `graph_retrieval` MVP (single intent).**
- Kuzu ingest from snapshot manifest
- One intent ("trace `derives-from` chain backward from a node")
- By week 5, empirical loop is live; graph retrieval becomes useful *for the analyst reading week-4 telemetry*, not as precondition.

**Deferred beyond week 6:**
- `convergence_runner`'s boundary classifier — needs form-invariance settled first (discovery-level work, not engineering)
- `pipeline (Lean)` — content-side prerequisite: at least one axiom needs to clear the convergence bar
- `vault_ctl` session-close runner, multi-intent `graph_retrieval`, telemetry dashboard

## 5. Risk register

| # | Risk | Trigger | Early warning | Mitigation |
|---|------|---------|---------------|------------|
| 1 | **Form-invariance metric ill-defined; blocks telemetry.** | Engineer asked to "measure form-invariance" cannot specify what is counted. | Spec doc stalls week 1; PR comments full of "what does this mean operationally?" | Descope telemetry MVP to residue-counter only; treat form-invariance as *discovery-level* open question. |
| 2 | **Convergence boundary classifier built before theory ready.** | Pressure to ship → similarity metric chosen for convenience (cosine on outputs). | Code review reveals classifier threshold hand-tuned, no falsification criterion. | Ship dispatch + structured log only; refuse to merge classifier until operational proxy is named in a discovery file. |
| 3 | **30-day measurement window starts late or missed.** | `vault_ctl` slips by a week; snapshot zero not taken on `last_updated: 2026-05-16`. | End of week 1, no snapshot in `vault/snapshots/`. | Hand-write snapshot zero on day 1 from `find ... -newer` + manual hash list. The tool retrofits later. |
| 4 | **Re-dispatched Gödel lens returns same content (model recall masquerading as web-fetched).** | Hard-fetch requirement checked only by trusting agent's claim, not the trace. | Re-dispatch produces a lens citing no URLs that weren't in the original. | `convergence_runner` MUST persist tool-call traces; telemetry counts `verification=web-fetched` lenses *only when trace contains ≥1 WebFetch call*. |
| 5 | **`graph_retrieval` consumes the budget that belonged to telemetry.** | Kuzu + intent taxonomy is more interesting than counter-reports; engineer drifts. | End of week 3, half-built graph layer and no telemetry report. | Schedule places `graph_retrieval` at weeks 5–6 explicitly *after* the first telemetry report. |

## 6. If you can only build one thing in two weeks

**`vault_ctl` MVP + snapshot zero on day 1.**

Reasons:
1. The only subsystem on the *hard* side of every dependency edge. Skipping it makes every other build fragile or premature.
2. The empirical question — "do the four residues generate new constitutions in the next 30 days?" — is a before/after diff over the vault. A diff requires a fixed *before*. Snapshot zero is the single highest-leverage artifact in the platform plan; everything else can be back-filled; a snapshot taken in week 3 cannot become a snapshot taken in week 1.
3. Cheapest of the five (no novel ML, no theory dependencies). Two weeks is realistic with margin.

## Caveats

- Original lens dispatched 2026-05-16 by general-purpose Sonnet subagent (3 tool calls); dispatch prompt unrecoverable.
- Sources read parent discovery README + discovery-structure-constitution + the five proposals in conversation context.
- Verification level `[local-files-read]`.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
