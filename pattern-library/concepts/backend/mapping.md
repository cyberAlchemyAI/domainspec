# Concept Card: Mapping

## Purpose

Documents and implements explicit field-level transformation between shapes.

## When To Use

Use when data crosses layer or service boundaries and shape conversion is required.

## Functional Pattern

- Keep mapper pure.
- Avoid hidden defaults.
- Make field intent obvious through naming.

## Descriptive Example

```ts
export type PaymentRow = {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
};

export function rowToPaymentTransaction(row: PaymentRow): PaymentTransaction {
  return {
    id: row.id,
    amount: createMoney(row.amount_cents / 100, row.currency),
    status: row.status as PaymentStatus,
    customerId: "unknown",
  };
}
```

## Typical Relationships

- maps -> Entity
- maps -> Interface
- shapes -> View Model (UI adapter analogue)
