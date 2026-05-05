# DomainSpec Pattern Library

Use this library as a selective context source during implementation.

- Load only the concept files required for the current task.
- Pair concept files with relationship cards from ../ARCHITECTURE-PATTERN-LIBRARY.md.
- Keep examples aligned with architecture foundations, layering, and dependency references.

## Architecture References

- [architecture-foundations](ARCHITECTURE-FOUNDATIONS.md)
- [layering-reference](LAYERING-REFERENCE.md)
- [dependency-rules](DEPENDENCY-RULES.md)
- [testing-alignment](TESTING-ALIGNMENT.md)
- [observability-alignment](OBSERVABILITY-ALIGNMENT.md)

## Backend Concepts

- [entity](concepts/backend/entity.md)
- [value-object](concepts/backend/value-object.md)
- [enum-type](concepts/backend/enum-type.md)
- [operation](concepts/backend/operation.md)
- [query](concepts/backend/query.md)
- [calculation](concepts/backend/calculation.md)
- [rule](concepts/backend/rule.md)
- [policy](concepts/backend/policy.md)
- [workflow](concepts/backend/workflow.md)
- [saga](concepts/backend/saga.md)
- [interface](concepts/backend/interface.md)
- [event](concepts/backend/event.md)
- [mapping](concepts/backend/mapping.md)
- [state-machine](concepts/backend/state-machine.md)

## UI Concepts

- [page](concepts/ui/page.md)
- [layout](concepts/ui/layout.md)
- [component](concepts/ui/component.md)
- [view-model](concepts/ui/view-model.md)
- [hook](concepts/ui/hook.md)
- [form](concepts/ui/form.md)
- [action](concepts/ui/action.md)
- [guard](concepts/ui/guard.md)
- [binding](concepts/ui/binding.md)
- [adapter](concepts/ui/adapter.md)
- [state-indicator](concepts/ui/state-indicator.md)

## Selection Recipe

1. Start from the work-pack task intent.
2. Open only the concept files needed by that intent.
3. Open only the relationship cards connecting those concepts.
4. Implement and test per selected cards.
