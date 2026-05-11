# Hermes Session Persistence and Compaction Inventory

## Task Scope

- Feature: Agent Execution Orchestrator
- Task: AEO-WP-03
- Goal: extract reusable session persistence, compaction, and telemetry patterns from Hermes Agent and map them to DomainSpec observability contracts.

## Acquisition Evidence

- Repository cloned locally at: [research/projects/hermes-agent/repo](../../../../../../../research/projects/hermes-agent/repo)
- Source used: NousResearch Hermes Agent main branch (shallow clone).

## Pattern Inventory

| Pattern ID | Hermes Mechanism                                                                          | Evidence                                                                                                                                                                                                                 | Reuse Decision for AEO | Adaptation Notes                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| H-P01      | Dual session stores: SQLite for indexed lifecycle data + JSONL transcripts for raw replay | [website/docs/user-guide/sessions.md](../../../../../../../research/projects/hermes-agent/repo/website/docs/user-guide/sessions.md)                                                                                      | adopt-now              | Keep delegation and pipeline ledgers as authority for lifecycle state; keep transcript reference as required evidence envelope field.          |
| H-P02      | Compression creates continuation lineage via parent session id and terminal reason        | [run_agent.py](../../../../../../../research/projects/hermes-agent/repo/run_agent.py), [hermes_state.py](../../../../../../../research/projects/hermes-agent/repo/hermes_state.py)                                       | adopt-now              | Model stage continuity as lineage (old stageRunId -> continuation stageRunId) rather than overwrite semantics.                                 |
| H-P03      | Manual focused compaction command supports topic-biased summary retention                 | [cli.py](../../../../../../../research/projects/hermes-agent/repo/cli.py), [website/docs/reference/slash-commands.md](../../../../../../../research/projects/hermes-agent/repo/website/docs/reference/slash-commands.md) | adopt-later            | Add explicit focus-topic support only if we expose operator-triggered compaction in DomainSpec orchestration UX.                               |
| H-P04      | Resume shows compact recap panel (structured continuity window)                           | [website/docs/user-guide/sessions.md](../../../../../../../research/projects/hermes-agent/repo/website/docs/user-guide/sessions.md)                                                                                      | adopt-now              | Require session handoff summary artifacts for resumed stages, with explicit active-task continuity fields.                                     |
| H-P05      | Cross-session recall uses FTS search + per-session summarization                          | [tools/session_search_tool.py](../../../../../../../research/projects/hermes-agent/repo/tools/session_search_tool.py), [hermes_state.py](../../../../../../../research/projects/hermes-agent/repo/hermes_state.py)       | adopt-later            | Current docs-only slice should specify retrieval contract; implementation can use existing ledgers/artifacts before adding full-text index.    |
| H-P06      | Orphan-compression finalization job closes stranded child sessions safely                 | [hermes_state.py](../../../../../../../research/projects/hermes-agent/repo/hermes_state.py)                                                                                                                              | adopt-now              | Keep orphan metric scoped only to mutation-capable delegated commands and add reconciliation notes to completion criteria.                     |
| H-P07      | Auto-prune policy acts only on ended sessions with interval guard + optional vacuum       | [website/docs/user-guide/sessions.md](../../../../../../../research/projects/hermes-agent/repo/website/docs/user-guide/sessions.md)                                                                                      | adopt-later            | Candidate for long-running telemetry repositories, not required for Task 3 docs baseline.                                                      |
| H-P08      | Memory snapshot is frozen at session start to preserve prompt-cache stability             | [website/docs/user-guide/features/memory.md](../../../../../../../research/projects/hermes-agent/repo/website/docs/user-guide/features/memory.md)                                                                        | adopt-now              | Require decision snapshot capture at stage start and explicit note that mid-stage memory writes do not rewrite already-emitted start evidence. |
| H-P09      | External memory providers add retrieval/graph capabilities alongside core memory          | [website/docs/user-guide/features/memory-providers.md](../../../../../../../research/projects/hermes-agent/repo/website/docs/user-guide/features/memory-providers.md)                                                    | defer                  | Not needed for current feature scope; preserve as future extension input.                                                                      |

## AEO-WP-03 Adoption Checklist

- [x] Add session handoff artifact contract to feature observability mapping.
- [x] Define lineage continuity rule for resumed or compacted stage runs.
- [x] Keep orphan-stage metric scoped to mutation-capable delegated commands only (`domainspec-implement`, `domainspec-tag-code`).
- [x] Define retrieval evidence references for cross-session recall when prior runs are consulted.
- [x] Add verification evidence entries that prove telemetry pairing and lineage reconciliation.

## Boundaries and Non-Goals

- This inventory does not import Hermes runtime code into DomainSpec.
- This inventory is design evidence for docs/contracts only.
- Implementation adoption remains controlled by later mutation-capable tasks.
