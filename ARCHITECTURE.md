# Architecture: DomainSpec Implementation Model (Functional TypeScript)

> Purpose: map DomainSpec concepts into a practical software architecture with strict domain isolation and a functional programming style (types + functions, no classes).

## Principles

1. Domain-first: domain model is the source of truth, implementation follows docs.
2. Dependency rule: outer layers depend inward, never the opposite.
3. Functional style: prefer `type`/`interface` + pure functions + factories; avoid classes.
4. Encapsulation by module exports: only export public API, keep helpers private (unexported).
5. Framework agnostic domain: no framework or external libraries in domain files.

## Layer Model

```text
┌─────────────────────────────────────────┐
│ Interface / Adapters                    │  HTTP, RPC, CLI, module contract
├─────────────────────────────────────────┤
│ Infrastructure                          │  DB, gateways, message bus, mappers
├─────────────────────────────────────────┤
│ Application                             │  use-cases (operations/queries), workflows
├─────────────────────────────────────────┤
│ Domain                                  │  entities, value objects, rules, policies
└─────────────────────────────────────────┘
```

### Domain Layer (pure)

Contains business model and invariants only.

- Entity / Value Object / Enum / State Machine
- Rule / Calculation / Policy
- Event definitions (types)
- Ports as function-based contracts (repository, gateway, event bus)

Must not import framework packages, ORMs, HTTP libraries, or infrastructure code.

### Application Layer

Contains business orchestration and use-cases.

- Operation -> command use-case function
- Query -> query use-case function
- Workflow -> saga/orchestrator function with compensation

Depends only on domain contracts and types.

### Infrastructure Layer

Contains concrete adapters that implement domain ports.

- Repository implementation
- Gateway implementation
- Event bus implementation
- Mapping functions between persistence/API shapes and domain types

May use frameworks/libraries, but only behind ports.

### Interface / Adapters Layer

Contains incoming/outgoing boundaries.

- HTTP controllers/routers
- Internal module contracts
- DTO validation at boundary

Calls application functions; does not contain core business logic.

## DomainSpec Mapping

| DomainSpec Concept | Layer | Implementation Pattern (Functional) |
| --- | --- | --- |
| Entity | Domain | `type` + factory + transition functions |
| Value Object | Domain | immutable `type` + constructor/factory validation |
| Enum / Type | Domain | enum/union type |
| State Machine | Domain | transition map + guard functions |
| Rule | Domain | pure predicate function |
| Calculation | Domain | pure deterministic function |
| Policy | Domain | strategy selection function |
| Event | Domain + Infrastructure | event type in domain, publisher adapter in infra |
| Operation | Application | use-case factory returning `execute` function |
| Query | Application | query factory returning `execute` function |
| Workflow | Application | saga function with compensation stack |
| Interface | Interface / Adapters | controllers + module contract |
| Mapping | Infrastructure | pure mapping functions |

## Functional Building Blocks

### Value Object Pattern

```typescript
export type Money = { readonly amount: number; readonly currency: string }

function assertValidMoney(m: Money): void {
  if (m.amount < 0) throw new Error("amount must be non-negative")
}

export function createMoney(amount: number, currency: string): Money {
  const money = { amount, currency }
  assertValidMoney(money)
  return money
}
```

### Entity + State Transition Pattern

```typescript
export type PaymentStatus = "Created" | "Processing" | "Completed" | "Failed"

export type PaymentTransaction = {
  readonly id: string
  readonly amount: Money
  readonly method: string
  readonly status: PaymentStatus
}

const ALLOWED: Record<PaymentStatus, readonly PaymentStatus[]> = {
  Created: ["Processing"],
  Processing: ["Completed", "Failed"],
  Completed: [],
  Failed: [],
}

function assertCanTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!ALLOWED[from].includes(to)) throw new Error(`invalid transition: ${from} -> ${to}`)
}

export function transitionStatus(tx: PaymentTransaction, to: PaymentStatus): PaymentTransaction {
  assertCanTransition(tx.status, to)
  return { ...tx, status: to }
}
```

### Rule + Calculation Pattern

```typescript
export function satisfiesMaxAmount(amount: Money): boolean {
  return amount.amount <= 10_000
}

export function calculateFee(amount: Money, feeRate: number): Money {
  return createMoney(Number((amount.amount * feeRate).toFixed(2)), amount.currency)
}
```

### Use-Case Factory Pattern

```typescript
type ProcessPaymentDeps = {
  repo: PaymentRepository
  gateway: PaymentGatewayPort
  bus: EventBusPort
}

export function makeProcessPayment(deps: ProcessPaymentDeps) {
  return async function processPayment(cmd: ProcessPaymentCommand): Promise<ProcessPaymentResult> {
    // validate rules
    // compute fee
    // transition entity
    // persist
    // emit event
    return { status: "accepted" }
  }
}
```

### Workflow (Saga) Pattern

```typescript
export function makeOrderFulfillmentWorkflow(deps: WorkflowDeps) {
  return async function orderFulfillment(input: WorkflowInput): Promise<void> {
    const compensation: Array<() => Promise<void>> = []
    try {
      await deps.processPayment(input)
      compensation.push(() => deps.refundPayment(input))

      await deps.reserveInventory(input)
      compensation.push(() => deps.releaseInventory(input))
    } catch (err) {
      for (const undo of compensation.reverse()) {
        await undo().catch(() => {})
      }
      throw err
    }
  }
}
```

## Port and Adapter Contracts

Use function-shaped contracts.

```typescript
export type PaymentRepository = {
  findById(id: string): Promise<PaymentTransaction | null>
  save(tx: PaymentTransaction): Promise<void>
}

export type EventBusPort = {
  publish(event: DomainEvent): Promise<void>
}
```

## Module Boundary Guidelines

1. Export only what other modules need.
2. Keep internal helpers unexported in file scope.
3. Re-export public API from module index files.
4. Do not import another module's internal files.
5. Communicate across modules through module contracts.

## Suggested Project Layout

```text
src/
  shared/
    money/
      money.value-object.ts
      index.ts
  modules/
    payment/
      domain/
        payment-transaction.entity.ts
        payment-status.type.ts
        rules/
        calculations/
        policies/
        events/
        ports/
      application/
        use-cases/
          process-payment.use-case.ts
          refund-payment.use-case.ts
          get-payment-status.use-case.ts
        workflows/
          order-fulfillment.workflow.ts
      infrastructure/
        persistence/
        gateways/
        events/
        mappers/
      interface/
        http/
          payment.controller.ts
          payment.router.ts
        payment.module.ts
      index.ts
```

## Dependency Rules (Enforcement)

- Domain imports: only local domain/shared domain files and TypeScript built-ins.
- Application imports: domain only.
- Infrastructure imports: domain + application types/contracts only.
- Interface imports: application API only.

Recommended static checks:

- ESLint import boundaries
- tsconfig path aliases per layer
- Architecture tests that fail on invalid import graph

## Testing Strategy Alignment

- Domain tests: rules, calculations, state transitions, invariants.
- Application tests: use-case behavior with mocked ports.
- Workflow tests: happy path + compensation ordering.
- Infrastructure tests: contract/integration tests against ports.
- Interface tests: request/response contract tests.

This aligns directly with `TEST-PIPELINE.md` and keeps specs executable.
