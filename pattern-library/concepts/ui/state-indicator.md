# Concept Card: State Indicator

## Purpose

Renders domain lifecycle state as stable visual semantics.

## When To Use

Use for badges/icons/labels that represent enum or state machine values.

## Functional Pattern

- Map each state to deterministic visual config.
- Keep mapping table centralized.
- Fail closed on unknown state.

## Descriptive Example

```tsx
const STATUS_VISUAL: Record<PaymentStatus, { label: string; tone: string }> = {
  Created: { label: "Created", tone: "neutral" },
  Processing: { label: "Processing", tone: "info" },
  Completed: { label: "Completed", tone: "success" },
  Failed: { label: "Failed", tone: "danger" },
  Refunded: { label: "Refunded", tone: "warning" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const visual = STATUS_VISUAL[status];
  return <span data-tone={visual.tone}>{visual.label}</span>;
}
```

## Typical Relationships

- reflects -> State Machine
- uses Enum / Type as display key
