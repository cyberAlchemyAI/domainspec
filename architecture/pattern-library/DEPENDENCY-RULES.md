# Dependency Rules

Use this document when validating import boundaries or setting up architecture checks.

## Layer Dependency Constraints

- Domain imports: only local domain/shared domain files and TypeScript built-ins.
- Application imports: domain only.
- Infrastructure imports: domain + application types/contracts only.
- Interface imports: application API only.

## Static Enforcement

Recommended checks:

- ESLint import boundaries
- tsconfig path aliases per layer
- Architecture tests that fail on invalid import graph

## Violation Heuristic

If any file in an inner layer imports from an outer layer, treat it as architecture drift and block merge until fixed.

## Related References

- Layer responsibilities and blueprint: `LAYERING-REFERENCE.md`
- Concept-level recipes used by each layer: `README.md`
