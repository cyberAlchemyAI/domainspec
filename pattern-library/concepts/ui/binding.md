# Concept Card: Binding

## Purpose

Defines named integration points between UI hooks/actions and backend use-cases.

## When To Use

Use to centralize fetch/mutate contracts and keep components transport-agnostic.

## Functional Pattern

- Keep API call signatures typed.
- Separate read and write bindings.
- Reuse bindings across hooks/actions.

## Descriptive Example

```ts
export function useCreatePaymentBinding() {
  return useMutation({
    mutationFn: (input: CreatePaymentFormData) =>
      apiClient.post("/payments", input),
  });
}

export function usePaymentStatusBinding(paymentId: string) {
  return useQuery({
    queryKey: ["payment-status", paymentId],
    queryFn: () => apiClient.get(`/payments/${paymentId}`),
  });
}
```

## Typical Relationships

- fetches -> Query
- mutates -> Operation
