# Concept Card: Action

## Purpose

Represents user-triggered command execution path in UI.

## When To Use

Use for submit/click handlers that invoke mutation bindings or navigation.

## Functional Pattern

- Keep action thin.
- Delegate server mutation to binding.
- Handle success/failure UX explicitly.

## Descriptive Example

```ts
export function useCreatePaymentAction() {
  const mutation = useCreatePaymentBinding();
  return async function submitCreatePayment(data: CreatePaymentFormData) {
    await mutation.mutateAsync(data);
  };
}
```

## Typical Relationships

- triggered by Form
- mutates via Binding
