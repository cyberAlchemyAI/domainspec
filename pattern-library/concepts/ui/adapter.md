# Concept Card: Adapter

## Purpose

Transforms API/persistence shapes into UI-friendly view model shapes.

## When To Use

Use when response payload is not ideal for direct component rendering.

## Functional Pattern

- Keep adapter pure.
- Centralize formatting and fallback rules.
- Return typed view model.

## Descriptive Example

```ts
export function toPaymentOverviewVM(dto: {
  id: string;
  status: PaymentStatus;
  amount: { amount: number; currency: string };
}): PaymentOverviewVM {
  return {
    id: dto.id,
    status: dto.status,
    statusLabel: dto.status.toUpperCase(),
    totalLabel: `${dto.amount.amount.toFixed(2)} ${dto.amount.currency}`,
  };
}
```

## Typical Relationships

- shapes -> View Model
- derives from Entity fields
