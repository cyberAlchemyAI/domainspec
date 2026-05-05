# Concept Card: View Model

## Purpose

Represents a render-optimized projection of domain data.

## When To Use

Use when domain entity shape is not ideal for direct rendering.

## Functional Pattern

- Keep only fields needed by UI.
- Include preformatted labels where appropriate.
- Keep derivation deterministic.

## Descriptive Example

```ts
export type PaymentOverviewVM = {
  id: string;
  status: PaymentStatus;
  statusLabel: string;
  totalLabel: string;
};
```

## Typical Relationships

- derives -> Entity
- displayed by Component
- shaped by Adapter
