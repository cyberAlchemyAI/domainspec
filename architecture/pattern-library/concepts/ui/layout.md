# Concept Card: Layout

## Purpose

Provides reusable page shell and navigation structure.

## When To Use

Use when multiple pages share header/sidebar/footer and visual framing.

## Functional Pattern

- Keep layout free of page-specific business logic.
- Accept content slot/children.
- Centralize global chrome only.

## Descriptive Example

```tsx
type LayoutProps = { children: React.ReactNode };

export function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="shell">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Typical Relationships

- wraps -> Page[]
