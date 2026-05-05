# Concept Card: Value Object

## Purpose

Represents immutable domain meaning without identity. Equality is based on value, not id.

## When To Use

Use when a concept is reusable and defined entirely by its fields, such as money or date range.

## Functional Pattern

- Define read-only type.
- Validate in constructor/factory.
- Keep operations pure.

## Descriptive Example

```ts
export type Money = { readonly amount: number; readonly currency: string };

export function createMoney(amount: number, currency: string): Money {
  if (amount < 0) throw new Error("amount must be non-negative");
  if (currency.length !== 3) throw new Error("currency must be ISO-4217");
  return { amount, currency };
}
```

## Typical Relationships

- contains <- Entity
- maps <- Mapping
