---
tags: [event-sourcing, deterministic-compilation, runtime-contract]
node_type: discovery
is_session: false
layer: domain, architecture
nature: explanatory, technical
status: consolidated
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-09-01
---

# Discovery: Event Sourcing Contract

## Objective

Define the smallest DomainSpec-owned language and compiler contract needed to describe event-sourced state deterministically. Keep durable storage, transport, checkpoint persistence, and runtime recovery in downstream adapters.

## 1. Business Context

### Why now

DomainSpec can describe domain concepts and compiled graphs, but it has no explicit contract for declaring how canonical events calculate state. Consumers therefore risk inventing incompatible stream identity, concurrency, ordering, replay, and projection rules.

### What is broken

- `backend/src/modules/` has no module that validates or compiles event-sourcing declarations.
- `docs/features/` has no source-of-truth feature contract for streams, event definitions, projections, or runtime obligations.
- Event-oriented features can describe events in prose, but cannot produce a byte-stable compiled contract for downstream adapters.

### What stays the same

- Existing feature documents and compilers remain unchanged.
- DomainSpec stays storage-agnostic and does not become an event database or CQRS framework.
- Runtime adapters own event envelopes, persistence, retries, checkpoints, retention, and recovery.
- A compiled contract is evidence of deterministic translation, not proof that a runtime conforms.

## 2. Core Concepts

| Concept                          | Meaning                                                                    |
| -------------------------------- | -------------------------------------------------------------------------- |
| Event Sourcing Contract Source   | Authored declaration of streams, event definitions, and projections.       |
| Subject Stream                   | Ordered history for one entity, relation, or process subject.              |
| Canonical Event Definition       | Typed event whose payload represents the complete resulting subject state. |
| Projection Definition            | Rebuildable state calculation over declared event types.                   |
| Compiled Event Sourcing Contract | Normalized, validated, deterministically ordered runtime obligation graph. |
| Content Digest Port              | Application boundary used to identify the canonical compiled bytes.        |

## 3. Required Behavior

The compiler must reject empty contracts, duplicate identifiers, unknown references, streams with no events, projections with no inputs, and duplicate projection inputs. It must sort all declaration sets, preserve the input value, serialize object keys canonically, and produce identical bytes for semantically identical input permutations.

Each stream declares exactly one subject kind: `entity`, `relation`, or `process`. Each event declares one stream, one payload schema reference, and `complete-resulting-state` semantics. Each projection declares its consumed event types, uses stream-subject keys, is rebuildable, and calculates from the latest valid checkpoint followed by later events.

The compiled contract must make these downstream obligations explicit:

- atomic append of one or more events;
- expected-stream-version comparison before append;
- monotonically increasing stream positions;
- monotonically increasing commit positions;
- unique event identity;
- rebuildable projections;
- checkpoint validation followed by ordered tail replay;
- fail-closed handling of invalid or missing retained history.

## 4. Architecture Boundary

The domain layer owns validation, normalization, and canonical serialization. The application layer owns orchestration and a digest port. The infrastructure layer may implement SHA-256 with platform crypto. No layer in this feature opens a database, stores events, serves HTTP, or advances runtime state.

## 5. Validation Strategy

Tests must prove permutation invariance, two-run byte identity, stable digesting, input immutability, and collect the primary topology failures. Type checking must prove that the new module respects existing package boundaries.

## Open Questions

| Question                                         | Recommendation                                                                                            |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Should partial patch events be allowed?          | No for the first version. Complete-resulting-state events make replay and replacement semantics explicit. |
| Should checkpoints be canonical history?         | No. Treat them as validated, replaceable caches; events remain canonical.                                 |
| Should DomainSpec ship a production event store? | No. Provide contracts and ports only.                                                                     |
| Should retention be configurable here?           | Defer. The compiled obligation requires fail-closed history handling without choosing storage policy.     |

## Connections

- The source contract `contains` subject streams, canonical event definitions, and projection definitions.
- Canonical event definitions `belong to` one subject stream.
- Projection definitions `consume` canonical event definitions.
- The compiler `maps` authored source to a compiled event-sourcing contract.
- Runtime adapters `implement` compiled obligations and produce separate conformance evidence.
