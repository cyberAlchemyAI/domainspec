# Layering Reference

Use this document when you need implementation-level layering detail while keeping `../ARCHITECTURE.md` concise.

## Layer Responsibilities

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

## Dependency Checks To Pair With This Reference

Dependency constraints and enforcement tooling are defined in:

- `DEPENDENCY-RULES.md`
