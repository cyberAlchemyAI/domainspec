# Concept Card: Guard

## Purpose

Enforces access control in the UI for navigation and render paths.

## When To Use

Use when a page or interaction should be hidden/redirected for unauthorized users.

## Functional Pattern

- Keep guard decision deterministic.
- Redirect or block render when check fails.
- Mirror backend rule without replacing server enforcement.

## Descriptive Example

```tsx
type GuardProps = { children: React.ReactNode };

export function AuthGuard({ children }: GuardProps) {
  const user = useCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

## Typical Relationships

- protects -> Page
- mirrors -> Rule
