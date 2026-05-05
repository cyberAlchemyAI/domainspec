# Concept Card: Rule

## Purpose

Defines a guard that must hold before mutation is allowed.

## When To Use

Use for business constraints that should block operation execution when violated.

## Functional Pattern

- Express as pure predicate.
- Keep one business intent per rule.
- Make rule checks explicit in operations.

## Descriptive Example

```ts
export function satisfiesMaxAmount(amount: Money): boolean {
  return amount.amount <= 10_000;
}

export function assertMaxAmount(amount: Money): void {
  if (!satisfiesMaxAmount(amount))
    throw new Error("amount exceeds policy limit");
}
```

## Typical Relationships

- enforces -> Operation
- enforces-cross -> Operation@B
- mirrored by Guard
