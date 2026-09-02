---
tags: [event-sourcing, terminology]
node_type: conceptual
is_session: false
layer: domain
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-09-01
---

# Event Sourcing Contract Glossary

| Term                           | Definition                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Canonical event                | Immutable fact accepted into a runtime stream; it is the authoritative state-transition record.         |
| Complete-resulting-state event | Event whose payload describes the complete subject state after that event, rather than a partial patch. |
| Subject stream                 | Ordered event history for one entity, relation, or process instance.                                    |
| Stream position                | Monotonic position within one subject stream.                                                           |
| Commit position                | Monotonic position that orders committed batches across streams.                                        |
| Expected stream version        | Compare-and-set precondition used to reject concurrent append conflicts.                                |
| Projection                     | Pure state calculation over declared event types.                                                       |
| Checkpoint                     | Replaceable projection cache that must be validated before tail replay; it is not canonical history.    |
| Tail replay                    | Applying events after the position represented by a valid checkpoint.                                   |
| Compiled contract              | Deterministically normalized graph of declarations and runtime obligations.                             |
| Runtime obligation             | Behavior a downstream adapter must implement and prove separately.                                      |
| Content digest                 | SHA-256 identity of canonical compiled bytes.                                                           |
