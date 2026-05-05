# Concept Card: Page

## Purpose

Defines a routable UI entrypoint that composes layout, guards, and feature components.

## When To Use

Use for every URL-level screen that users navigate to directly.

## Functional Pattern

- Keep page as composition root.
- Delegate data and behavior to hooks/components.
- Apply guard and layout at page boundary.

## Descriptive Example

```tsx
export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <AuthGuard>
        <PaymentsPanel />
      </AuthGuard>
    </DashboardLayout>
  );
}
```

## Typical Relationships

- renders -> Component[]
- wrapped by Layout
- protected by Guard
