# Concept Card: Form

## Purpose

Defines user input contract and validation before action execution.

## When To Use

Use for structured input that must remain aligned with backend interface contract.

## Functional Pattern

- Define schema first.
- Enforce validation before submit.
- Keep mapping to API payload explicit.

## Descriptive Example

```ts
export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  customerId: z.string().min(1),
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
```

## Typical Relationships

- submits -> Action
- contracts -> Interface
