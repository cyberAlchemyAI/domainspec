---
tags: [agents, architecture, ontology, vault]
node_type: domainspec-subagents-strategy
is_session: true
layer: architecture
nature: procedural, technical, reference
status: active
created: 2026-06-12
timestamp: 2026-06-12T00:34:43-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-subagents-strategy-v0.4.0
decisions_made: true
contradictions_found: true
specs_updated: [vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Restructured the core subagent dispatch governance model (mode factoring, DAG composition, strategy-as-object, per-level parameters) and produced the toolchain enforcing it — load-bearing for all future dispatch."
---

# Session — subagents-strategy v0.4.0: 4-level dispatch model + governance toolchain

## Summary

Designed a v0.4.0 amendment (DRAFT) to the subagents-strategy constitution: a 4-level dispatch model — **dispatch / connection / group-wave / agent** — that factors the conflated `mode` enum into cardinality × interaction × topology, reverses R30 into a typed `connections[]` **DAG** (reopening `OQ-mixed-dag-schema` under an owner-waived P-SS-9), adds **strategy-as-object** (`research` live; `code|review|plan` forecast), renames `layers→waves`, and consolidates the full per-level parameter set (`final_approver`, `aggregation`, `input_priority`/`gate`, dispatch `loop` vs edge `loop_cap`, etc.). The model and draft were produced by a **dogfooded multi-agent dispatch** — tensioned explorers → synthesizer → robot-talks review layers → parent-enacted macro approval. A companion governance toolchain (`internal_tools/subagents-dispatch-hooks/`: register-dispatch skill + Workflow-block + dispatch-reminder hooks) and an Arcanum `TO-VLAD8` handoff were created; all constitution work stayed in a DRAFT (live untouched), premise revision owner-waived.

## Contradictions

- revisits `vault/constitution/domainspec-subagents-strategy-constitution.md` — the v0.4.0 draft supersedes its conflated `mode` enum and reopens `OQ-mixed-dag-schema` (live untouched; draft only).
- questions `vault/constitution/research-constitution.md` — its mode-list found stale / drifted from base R19; recorded, not updated.

## Files touched

- vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md
- internal_tools/subagents-dispatch-hooks/README.md
- internal_tools/subagents-dispatch-hooks/install.cjs
- internal_tools/subagents-dispatch-hooks/hooks/block-workflow.cjs
- internal_tools/subagents-dispatch-hooks/hooks/remind-register-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- vault/constitution/domainspec-subagents-strategy-constitution.md
- vault/constitution/research-constitution.md

## Connections

Source is a session (`is_session: true`) → **forward-only by source** per `vault/ontology-conventions.md` §8: edges live on this block only; no inverse row is written on any target.

| Document | Type | Description |
|----------|------|-------------|
| [domainspec-subagents-strategy-constitution.v0.4.0-draft.md](../constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md) | creates | The v0.4.0 amendment draft produced this session (legal: session→constitution `creates`, accurate — this file was created). |

### Deferred / NEEDS_HUMAN

- **Supersede/question relationships belong on the draft, not the session.** The live `domainspec-subagents-strategy-constitution.md` (would-be `revisits`) and `research-constitution.md` (would-be `questions`) are illegal as session→`constitution` edges (`revisits`/`opens-question` admit only `discovery`/`premise` targets), and the live files were not modified. The relationship is recorded in the prose `## Contradictions` above and should be wired **from the draft** when it is promoted over the live constitution. **Human decision:** promote-time wiring vs. catalog extension.
- **`internal_tools/subagents-dispatch-hooks/*` (7 files) are non-vault paths** → outside the vault edge-graph (OQ-C of `vault/discovery/curator-pipeline-integration/discovery.md`). Tracked in git and in **Files touched**; not graph-wired by design.
