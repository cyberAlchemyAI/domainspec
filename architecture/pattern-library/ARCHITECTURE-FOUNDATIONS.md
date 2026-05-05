# Architecture Foundations

Use this document for the immutable architecture baseline: principles and layer model.

## Principles

1. Domain-first: domain model is the source of truth, implementation follows docs.
2. Dependency rule: outer layers depend inward, never the opposite.
3. Functional style: prefer `type`/`interface` + pure functions + factories; avoid classes.
4. Encapsulation by module exports: only export public API, keep helpers private (unexported).
5. Framework agnostic domain: no framework or external libraries in domain files.

## Layer Model

```text
+-----------------------------------------+
| Interface / Adapters                    |  HTTP, RPC, CLI, module contract
+-----------------------------------------+
| Infrastructure                          |  DB, gateways, message bus, mappers
+-----------------------------------------+
| Application                             |  operations, queries, workflows, sagas
+-----------------------------------------+
| Domain                                  |  entities, value objects, rules, policies
+-----------------------------------------+
```

## Layer Snapshot

| Layer                | Owns                                                     | Must Not Depend On                              |
| -------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Domain               | Entities, value objects, rules, policies, state machines | Frameworks, infra adapters, interface contracts |
| Application          | Operations, queries, workflows/sagas                     | Infrastructure and interface implementations    |
| Infrastructure       | Port adapters, persistence, gateways, mappers            | Interface layer internals                       |
| Interface / Adapters | Controllers, DTO validation, module/public contracts     | Domain internals and infrastructure details     |

## Next References

- Detailed layer responsibilities and project blueprint: `LAYERING-REFERENCE.md`
- Dependency constraints and enforcement checks: `DEPENDENCY-RULES.md`
