# Concept Card: Enum / Type

## Purpose

Constrains a domain field to a finite set of valid values.

## When To Use

Use when status/category values are closed and drive branching logic.

## Functional Pattern

- Prefer union types for concise domain enums.
- Centralize allowed values.
- Use in entities, rules, and state machines.

## Descriptive Example

```ts
export type PaymentStatus =
  | "Created"
  | "Processing"
  | "Completed"
  | "Failed"
  | "Refunded";
```

## Typical Relationships

- transitions <- State Machine
- reflects <- State Indicator
