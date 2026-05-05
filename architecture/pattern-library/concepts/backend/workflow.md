# Concept Card: Workflow

## Purpose

Coordinates multiple operations within one feature in a deterministic process.

## When To Use

Use when one business outcome requires sequenced or branched execution of several operations.

## Functional Pattern

- Orchestrate operation calls.
- Add compensation for partial failure.
- Keep workflow state explicit.

## Descriptive Example

```ts
export function makeOrderFulfillmentWorkflow(deps: {
  chargePayment: (id: string) => Promise<void>;
  reserveInventory: (id: string) => Promise<void>;
  releaseInventory: (id: string) => Promise<void>;
  refundPayment: (id: string) => Promise<void>;
}) {
  return async function orderFulfillment(orderId: string): Promise<void> {
    const undo: Array<() => Promise<void>> = [];
    await deps.chargePayment(orderId);
    undo.push(() => deps.refundPayment(orderId));
    try {
      await deps.reserveInventory(orderId);
      undo.push(() => deps.releaseInventory(orderId));
    } catch (error) {
      for (const step of undo.reverse()) await step().catch(() => {});
      throw error;
    }
  };
}
```

## Typical Relationships

- orchestrates -> Operation[]
- applies <- Policy
