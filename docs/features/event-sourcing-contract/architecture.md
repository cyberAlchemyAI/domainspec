---
tags: [event-sourcing, deterministic-compilation, layering]
node_type: spec
is_session: false
layer: architecture, application
nature: explanatory, technical
status: draft
version: 0.1.0
last_updated: 2026-09-01
---

# Event Sourcing Contract Architecture

## Layering

```text
interface (future, not in first slice)
  -> application/compile-event-sourcing-contract.ts
       -> domain/contract.ts
       -> application ContentDigestPort
            <- infrastructure/sha256-content-digest.ts
```

The domain layer contains the source and compiled models, error type, topology validation, normalization, and canonical JSON serializer. It is deterministic and effect-free.

The application layer composes the pure compiler with an injected digest capability. The infrastructure adapter implements that capability with Node SHA-256. No direct infrastructure dependency crosses into the domain or application contract.

## Downstream Runtime Boundary

```text
DomainSpec authored source
  -> deterministic compiler
  -> canonical compiled bytes plus digest
  -> downstream adapter interpretation
  -> separate semantic and governance append/replay
  -> exact-reference join at one global commit-position cut
  -> checkpoint cache plus tail replay
  -> runtime conformance evidence
```

The compiled output is a portable obligation contract. It neither performs appends nor asserts that a runtime satisfies those obligations.

## Determinism Rules

- Validate before producing any compiled result.
- Treat declared collections as mathematical sets after rejecting duplicates.
- Sort set-like arrays using locale-independent code-point comparison.
- Recursively sort object keys during serialization.
- Preserve explicit array order only after compiler normalization.
- Hash the canonical serialized bytes, not the authored input bytes.

## Dependency Rules

- `domain` imports no application or infrastructure code.
- `application` imports the domain contract and declares its own port.
- `infrastructure` implements the application port.
- public imports use `index.ts`.
- no database, transport, clock, random identifier, or filesystem capability enters compilation.

## Security and Failure Posture

Invalid references, missing event coverage, ambiguous duplicates, cross-family join errors, inconsistent projection cuts, and invalid checkpoint assumptions fail closed. Runtime retention and compaction are outside this module, but the compiled obligation requires a runtime to reject reconstruction when retained history cannot prove continuity.
