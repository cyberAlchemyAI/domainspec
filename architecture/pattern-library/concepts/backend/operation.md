# Concept Card: Operation

## Purpose

Executes a business mutation with rule checks, calculations, persistence, and events.

## When To Use

Use for any state-changing business action with observable side effects.

## Functional Pattern

- Build as dependency-injected factory.
- Validate with rules first.
- Publish events after postconditions.

## Descriptive Example

```ts
type ProcessPaymentDeps = {
  repo: PaymentRepository;
  bus: EventBusPort;
};

export function makeProcessPayment(deps: ProcessPaymentDeps) {
  return async function processPayment(cmd: {
    paymentId: string;
    amount: Money;
  }) {
    if (!satisfiesMaxAmount(cmd.amount)) throw new Error("blocked by rule");
    const tx = await deps.repo.findById(cmd.paymentId);
    if (!tx) throw new Error("not found");
    const completed = { ...tx, status: "Completed" as const };
    await deps.repo.save(completed);
    await deps.bus.publish({
      type: "PaymentCompleted",
      paymentId: cmd.paymentId,
    });
    return completed;
  };
}
```

## Typical Relationships

- enforced by Rule
- uses Calculation
- produces Event
- exposed by Interface
