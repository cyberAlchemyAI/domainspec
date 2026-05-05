# Concept Card: Policy

## Purpose

Selects strategy at runtime based on context.

## When To Use

Use when behavior is valid in multiple variants and selection depends on business context.

## Functional Pattern

- Keep policy as pure selector.
- Separate strategy choice from strategy execution.
- Keep policy inputs explicit.

## Descriptive Example

```ts
export type Gateway = "primary" | "secondary";

export function selectGatewayPolicy(input: {
  country: string;
  highValue: boolean;
}): Gateway {
  if (input.highValue) return "primary";
  if (input.country === "US") return "primary";
  return "secondary";
}
```

## Typical Relationships

- applies -> Operation
- used by Workflow decision points
