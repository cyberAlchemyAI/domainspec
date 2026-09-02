---
tags: [domainspec, event-sourcing, grain]
node_type: discussion
is_session: true
layer: architecture, application
nature: technical, explanatory
status: draft
version: 0.1.0
last_updated: 2026-09-01
---

- [DECISION] Use the clean standalone `implementation/domainspec` repository as the public DomainSpec target; preserve the dirty `projects/domainspec-v2` candidate tree.
- [INSIGHT] Grain was fast-forwarded from `17dc2c7` to upstream `ff616e9`; its reusable boundary is contracts, not its Clojure macros.
- [INSIGHT] Reuse ordered append, isolated streams, atomic batches, registered event schemas, pure replay projections, optimistic concurrency, checkpoints, and fail-closed retention.
- [BLOCKER] Existing DomainSpec research rejects importing a production event store into the typed-intent layer.
- [BLOCKER] The active CyberAlchemy Lab ontology Goal blocks DomainSpec and Rust implementation until D65 semantic and compiler predecessors are current.
- [QUESTION] Owner selection required for `ESB-2`, defer, or stop in `CA2-DG-DOMAINSPEC-EVENT-SOURCING-BOUNDARY-001`.
