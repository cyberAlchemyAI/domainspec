---
run_id: 20260605T000000Z-grant-work-dag-cycle
target: docs/features/goldenquill-promotion-governance
status: strategy-proposal
preset: standard
research: research-if-gap-appears
---

# Refine Seed Proposal: Grant Work DAG Cycle

## Operator Intent

Clarify what is missing in the current GoldenQuill Promotion Governance
architecture and spec: how grant work feeds the execution DAG, whether adapters
should connect through events, what alternatives exist, how accumulated
knowledge flows back into future grant work, how outcomes are measured, and how
the whole development effort should split into self-contained projects with
component charts and adapter boundaries.

## Target Context

Primary target:

- `docs/features/goldenquill-promotion-governance/`

Local evidence used for this seed:

- `SPEC.md`
- `architecture.md`
- `domain.md`
- `operations.md`
- `workflows.md`
- `mappings.md`
- `docs/paul_norton_memory_alignment_brief_2026-05-15.md`
- `docs/ARCHITECTURE_OVERVIEW.md`
- `pipeline/blueprint/v0.1/section_03_scout.md`
- `pipeline/blueprint/v0.1/section_16_reflection_packet.md`
- `pipeline/blueprint/v0.1/section_17_watts_per_funding_action.md`

## Missing Architecture Questions

1. How grant work enters the DAG.
2. Whether adapters write DAG nodes directly or emit events.
3. Which adapter families exist and what each owns.
4. How accumulated knowledge returns to Scout, Scribe, Editor, Judge,
   Logician, Report Generator, Funding Goal, and future grant cycles.
5. Which outcomes prove grant-work quality, operational throughput, financial
   ROI, relationship growth, stewardship quality, and learning quality.
6. How to split the project into independently testable development projects.
7. Which component charts are needed so the cycle is inspectable by engineering,
   grant operators, and governance owners.

## Initial Architectural Position

Grant work should feed the DAG through typed GoldenQuill events. Adapters should
not become authority holders and should not write promotion knowledge directly.
They should translate external or internal surfaces into typed events with
source references, idempotency keys, org scope, interpretation limits, and gate
metadata. Event consumers then materialize DAG nodes and edges, lifecycle state,
KPI observations, promotion candidates, cycle receipts, and memory/knowledge
projections.

This preserves one spine:

```text
grant work or external source
  -> adapter
  -> typed event
  -> execution DAG node/edge
  -> lifecycle/KPI/provenance projections
  -> promotion candidate
  -> privacy/governance/owner decision
  -> approved reuse into future grant work
```

## Alternatives To Evaluate

| Alternative | Summary | Strength | Risk |
| --- | --- | --- | --- |
| Event-first adapters | Adapters emit typed events; projectors build DAG/read models. | Auditable, replayable, idempotent, testable, good fit for external portal/source movement. | Requires event schema discipline and event-to-DAG projection tests. |
| Direct DAG writers | Each workflow component or adapter writes nodes and edges directly. | Simple for first fixture slice. | Coupling grows quickly; adapter bugs can corrupt graph authority. |
| Command/API orchestration | Components call a central service API such as `record_grant_run_event`. | Clear boundary and validation point. | Less replayable unless the API also persists an event journal. |
| Artifact import batches | Periodic importer reads artifacts and reconstructs DAG. | Good for legacy backfill. | Poor live observability; reconstruction can hide source-time failures. |
| Memory-first learning | Write lessons/knowledge first, then infer DAG. | Fast perceived learning. | Violates promotion governance; source truth and owner approval become unclear. |

Seed recommendation: use an event-first boundary for live and post-run movement,
plus artifact import batches only as backfill producers of the same typed events.

## Candidate Development Project Split

| Project | Boundary | First Deliverable |
| --- | --- | --- |
| GQ-DAG-001 Event Spine and DAG Projection | Event schema, idempotency, node/edge projection, traversal validation. | Fixture-only event journal plus DAG projector tests. |
| GQ-ADAPTER-001 Grant Work Adapter Contracts | Adapter protocol for seats, portals, outcome sources, uploader, reports, and backfill. | Adapter contract doc and fake adapters emitting valid/invalid events. |
| GQ-METRICS-001 Outcome Measurement and Cycle Cost | KPI semantics, denominator rules, cycle cost, WPFA/CycleReceipt joins. | Outcome/cost metric fixtures and `cycle-cost` planning surface. |
| GQ-KNOWLEDGE-001 Reflection and Knowledge Feedback | Reflection Packet, memory query, candidate generation, owner decision, approved reuse. | End-to-end learning-loop fixture from declined grant to future Scout/Scribe input. |
| GQ-GOV-001 Promotion Governance and Privacy | Ontology Vault projection, redaction/generalization, allowed-use split, contradiction path. | Fail-closed governance fixtures. |
| GQ-UX-001 Operator Review and Decision Surface | Operator review, approval, privacy decisions, outcome entry, dashboard read models. | No-production-mutation review flow spec and fixture UI contract. |

## Done Criteria For This Refine Run

- Produce a validated `REFINE-DISPATCH.json` route proposal.
- Record missing architecture answers and alternatives.
- Produce a proposal-only Invoke refresh report.
- Produce a patch proposal that updates architecture/spec/workflows/domain/events
  without applying it yet.
- Stop before runtime-backed stages or delegated subagents until confirmed.

## Validation Surface

- Dispatch route validates with:
  `python3 /home/vrondelli/projects/domainspec-core/arcanum/formulae/dispatch-spec/scripts/validate-dispatch.py REFINE-DISPATCH.json`
- Refresh remains proposal-only and maps every proposed change to a
  `RefreshSignal`.
- No canonical SPEC or architecture file is mutated in this proposal pass.
