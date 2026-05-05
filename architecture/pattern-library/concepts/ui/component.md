# Concept Card: Component

## Purpose

Represents reusable typed UI units that render behavior and data.

## When To Use

Use for visual and interactive blocks that can be composed into pages.

## Functional Pattern

- Keep props explicit and typed.
- Keep rendering concerns local.
- Consume hooks instead of calling APIs directly.

## Descriptive Example

```tsx
type PaymentCardProps = { item: PaymentOverviewVM };

export function PaymentCard({ item }: PaymentCardProps) {
  return (
    <article>
      <h3>{item.id}</h3>
      <PaymentStatusBadge status={item.status} />
      <strong>{item.totalLabel}</strong>
    </article>
  );
}
```

## Typical Relationships

- composes -> Component[]
- consumes -> Hook
- displays -> View Model
