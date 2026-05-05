# Concept Card: Query

## Purpose

Retrieves domain state without mutation.

## When To Use

Use for read-model access where repeated calls do not alter system state.

## Functional Pattern

- Build as dependency-injected function.
- Keep side-effect free.
- Return render/API friendly shapes.

## Descriptive Example

```ts
type GetPaymentStatusDeps = {
  repo: PaymentRepository;
};

export function makeGetPaymentStatus(deps: GetPaymentStatusDeps) {
  return async function getPaymentStatus(paymentId: string) {
    const tx = await deps.repo.findById(paymentId);
    if (!tx) return null;
    return { id: tx.id, status: tx.status, amount: tx.amount };
  };
}
```

## Typical Relationships

- queries -> Entity
- exposed by Interface
- fetched by Binding
