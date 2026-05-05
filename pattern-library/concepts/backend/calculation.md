# Concept Card: Calculation

## Purpose

Produces deterministic derived values used by operations.

## When To Use

Use when formula logic should be independently testable and reusable.

## Functional Pattern

- Keep pure and deterministic.
- Isolate formula constants.
- Return value objects when possible.

## Descriptive Example

```ts
export function calculateFee(amount: Money, rate: number): Money {
  const fee = Number((amount.amount * rate).toFixed(2));
  return createMoney(fee, amount.currency);
}
```

## Typical Relationships

- calculates -> Operation
