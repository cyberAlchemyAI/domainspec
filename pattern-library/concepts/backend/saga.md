# Concept Card: Saga

## Purpose

Coordinates cross-feature operations with explicit compensation per participant boundary.

## When To Use

Use when consistency requires orchestration across multiple bounded contexts.

## Functional Pattern

- Declare participant boundaries.
- Define forward step and compensation step for each participant.
- Capture retry/dead-letter decisions explicitly.

## Descriptive Example

```ts
export function makeSettlementReconciliationSaga(deps: {
  generateStatement: (id: string) => Promise<void>;
  cancelStatement: (id: string) => Promise<void>;
  postLedger: (id: string) => Promise<void>;
  reverseLedger: (id: string) => Promise<void>;
}) {
  return async function run(settlementId: string): Promise<void> {
    await deps.generateStatement(settlementId);
    try {
      await deps.postLedger(settlementId);
    } catch (error) {
      await deps.reverseLedger(settlementId).catch(() => {});
      await deps.cancelStatement(settlementId).catch(() => {});
      throw error;
    }
  };
}
```

## Typical Relationships

- produces-for -> Entity@OtherFeature
- triggers-cross <- Event@OtherFeature
- enforces-cross <- Rule@OtherFeature
