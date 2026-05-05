# Concept Card: Event

## Purpose

Represents a domain fact in past tense for asynchronous reactions.

## When To Use

Use when downstream consumers must react without tight coupling to the producer.

## Functional Pattern

- Define typed payload.
- Emit after postconditions.
- Keep event naming in past tense.

## Descriptive Example

```ts
export type PaymentCompleted = {
  type: "PaymentCompleted";
  paymentId: string;
  completedAt: string;
  totalCharged: Money;
};

export async function publishPaymentCompleted(
  bus: EventBusPort,
  event: PaymentCompleted,
) {
  await bus.publish(event);
}
```

## Typical Relationships

- produced by Operation
- transitions -> State Machine
- triggers-cross -> Operation@OtherFeature
