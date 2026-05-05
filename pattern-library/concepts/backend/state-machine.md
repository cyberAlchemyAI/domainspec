# Concept Card: State Machine

## Purpose

Formalizes allowed lifecycle transitions, guard conditions, and side effects.

## When To Use

Use whenever an entity has status progression and invalid transition risk.

## Functional Pattern

- Enumerate allowed transitions.
- Reject invalid moves.
- Keep transition function pure.

## Descriptive Example

```ts
type PaymentStatus = "Created" | "Processing" | "Completed" | "Failed";

const ALLOWED: Record<PaymentStatus, readonly PaymentStatus[]> = {
  Created: ["Processing"],
  Processing: ["Completed", "Failed"],
  Completed: [],
  Failed: [],
};

export function transitionPaymentStatus(
  current: PaymentStatus,
  next: PaymentStatus,
): PaymentStatus {
  if (!ALLOWED[current].includes(next))
    throw new Error(`invalid transition: ${current} -> ${next}`);
  return next;
}
```

## Typical Relationships

- transitions <- Event
- reflects -> State Indicator
