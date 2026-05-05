# Concept Card: Hook

## Purpose

Encapsulates reactive UI state, API calls, and mutation flows.

## When To Use

Use when data fetching/mutation logic should be reusable across components.

## Functional Pattern

- Return typed data and handlers.
- Delegate transport to bindings.
- Keep side effects inside React lifecycle boundaries.

## Descriptive Example

```ts
export function usePaymentOverview(paymentId: string) {
  return useQuery({
    queryKey: ["payment-overview", paymentId],
    queryFn: () => paymentBindings.getPaymentStatus(paymentId),
  });
}
```

## Typical Relationships

- consumed by Component
- fetches via Binding
