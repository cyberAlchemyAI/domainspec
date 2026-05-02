# App Release Decision Record

## Resolved During Pipeline Planning

| Decision | Selected Option | Rationale |
| -------- | --------------- | --------- |
| Scope mode | `greenfield-only` | The first release should optimize for a single clean journey instead of supporting both zero-to-one and brownfield translation at once. |
| Runtime mode | `local-only` | The current discovery explicitly favors a local app window and avoids premature VPS/cloud runtime complexity. |
| Graph priority | `graph-first` | The release promise depends on a visible, inspectable knowledge graph rather than a chat-only experience. |

## Resolved During Phase 1 Planning (2026-04-30)

Architectural decisions deferred in [PHASE-1-DESIGN.md § Resolved Architecture Decisions](./PHASE-1-DESIGN.md#resolved-architecture-decisions) (originally listed there as "Deferred"), resolved by `domainspec-planner` Decision Gate.

| Decision | Selected Option | Rationale |
| -------- | --------------- | --------- |
| Tool-use mechanism (agent → filesystem) | Native Agent SDK tool API | Less custom plumbing, automatic tool-use streaming, prompt caching preserved. |
| Live graph push transport | Server-Sent Events (SSE) | One-way server→client stream is the correct shape for graph deltas; simpler than websockets. |
| End-session-on-window-close UX | Combined modal listing all open sessions | Single confirmation enumerating every active session; clearer mental model with 3+ tabs. |
| Resume file model | Append `## Resumed at <timestamp>` section to original session file | One file per logical session thread keeps history linear and human-readable. |

## Notes

- These decisions are treated as fixed v1 constraints throughout the feature spec.
- Future revisions can supersede them by updating this record and the linked feature artifacts together.
