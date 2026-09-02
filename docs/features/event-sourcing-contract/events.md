---
tags: [event-sourcing, canonical-events, checkpoints]
node_type: spec
is_session: false
layer: domain, application
nature: explanatory, reference, technical
status: draft
version: 0.1.0
last_updated: 2026-09-01
---

# Event Sourcing Contract Events

## Authored Event Definition

An authored event definition declares semantics, not an emitted runtime event:

```json
{
  "eventType": "RelationStateReplaced",
  "streamId": "relation-state",
  "payloadSchemaRef": "schemas/relation-state.v1.json",
  "stateSemantics": "complete-resulting-state"
}
```

## Required Runtime Envelope

A downstream runtime should bind a compiled definition to an immutable envelope containing at least:

- `eventId`
- `eventType`
- `streamId`
- `streamSubjectId`
- `streamPosition`
- `commitPosition`
- `payloadSchemaRef`
- `payload`
- `occurredAt`

The concrete envelope format is adapter-owned. DomainSpec fixes the semantic obligations but does not serialize or persist runtime events.

## Semantic and Governance Families

Each stream is explicitly semantic or governance. Semantic streams calculate subject meaning. Governance streams calculate challenge, evidence, status, or authority posture without rewriting semantic history. The compiler rejects an exact-reference join when its governance side is not a governance event or any semantic side is not a semantic event.

Version one exact-reference joins bind governance events to semantic events by event identity, event digest, and commit position. A runtime must reject a missing, stale, ambiguous, or mismatched join rather than returning a partially governed projection.

## Complete State Rule

Version one accepts only complete-resulting-state definitions. The payload replaces the calculated state for its subject at that event position. Partial patches and hidden reducer behavior are outside this version because they weaken independent replay and make schema evolution harder to verify.

## Checkpoints Are Not Events

A checkpoint is a replaceable projection cache. It cannot supersede, delete, reorder, or silently repair canonical events. A runtime may use the latest checkpoint only after validating its projection contract, source position, and continuity, then applying the ordered tail.
