# Decisions: DomainSpec-GSD Integration

## Confirmed Decisions

- DomainSpec is semantic source of truth.
- GSD is orchestration source for delegated planning/execution sequencing.
- Delegation mode defaults to `native`; `gsd-phase` is explicit or complexity-triggered.
- DomainSpec verdict semantics (PASS/FLAG/BLOCK) are never delegated away.

## Open Decisions

- Exact complexity heuristic thresholds for automatic delegation.
- Whether delegated mode should be default after pilot success.
- Whether delegated verification should become hard-blocking in CI.

## Deferred Scope

- Full CI automation of delegated bridge commands.
- Bidirectional sync of all planning metadata between systems.
