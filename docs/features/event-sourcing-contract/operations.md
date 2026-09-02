---
tags: [event-sourcing, compilation, runtime-obligations]
node_type: spec
is_session: false
layer: application
nature: procedural, technical
status: draft
version: 0.1.0
last_updated: 2026-09-01
---

# Event Sourcing Contract Operations

## Compile Event Sourcing Contract

**Input:** `EventSourcingContractSource`

**Process:**

1. Validate schema version and root identity.
2. Validate identifier uniqueness and reference closure.
3. Validate that every stream has events and every projection has inputs.
4. Normalize all set-like collections.
5. Derive stream event inventories and fixed runtime obligations.
6. Canonically serialize the compiled value.
7. Ask the injected content-digest port to hash those bytes.

**Output:** compiled contract, canonical JSON, and SHA-256 digest.

**Failure:** one typed error; no partial result and no effect.

## Rebuild Projection (Runtime Obligation)

This is not implemented by DomainSpec. A conforming adapter validates the latest available checkpoint, restores it only when its contract and position match, and then replays all later events in declared order. Without a valid checkpoint it replays from the first retained event. If continuity cannot be proven, it fails closed.

## Append Event Batch (Runtime Obligation)

This is not implemented by DomainSpec. A conforming adapter compares the expected stream version, assigns unique event identities and monotonic positions, and atomically commits the entire batch or none of it.

## Conformance Boundary

Passing compiler tests proves local translation behavior only. Runtime adapters require separate fixtures and evidence for concurrency conflicts, atomicity, replay, recovery, checkpoint invalidation, and retained-history continuity.
