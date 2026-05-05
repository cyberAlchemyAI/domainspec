# Concept Card: Entity

## Purpose

Represents an identity-bearing domain object that evolves through business lifecycle transitions.

## When To Use

Use an entity when the object needs stable identity, lifecycle tracking, and mutation history.

## Functional Pattern

- Define entity shape as immutable TypeScript type.
- Keep transitions in explicit functions.
- Guard transitions with rules and state machine constraints.

## Descriptive Example

```ts
export type PaymentTransaction = {
  readonly id: string;
  readonly customerId: string;
  readonly amount: Money;
  readonly status: PaymentStatus;
};

export function markPaymentCompleted(
  tx: PaymentTransaction,
): PaymentTransaction {
  if (tx.status !== "Processing") throw new Error("invalid state");
  return { ...tx, status: "Completed" };
}
```

## Typical Relationships

- performs -> Operation
- contains -> Value Object
- emits -> Event
