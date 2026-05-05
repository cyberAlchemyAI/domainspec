# Concept Card: Interface

## Purpose

Defines inbound or outbound contracts that expose operations and queries.

## When To Use

Use for HTTP, RPC, or module boundaries where data shape and access control are explicit.

## Functional Pattern

- Keep interface thin.
- Validate DTOs at boundary.
- Delegate business logic to application layer.

## Descriptive Example

```ts
export function makePaymentController(api: {
  processPayment: (input: CreatePaymentRequest) => Promise<PaymentResponse>;
}) {
  return async function postPaymentController(req: {
    body: CreatePaymentRequest;
  }) {
    const response = await api.processPayment(req.body);
    return { statusCode: 202, body: response };
  };
}
```

## Typical Relationships

- exposes -> Operation
- exposes -> Query
- contracts <- Form
