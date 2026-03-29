# Relationship Types

> The 12 typed edges that connect domain concepts into a navigable knowledge graph.

## Overview

Every concept in the system connects to other concepts through typed relationships. These edges make the knowledge graph navigable — from any concept, you can follow edges to understand what it touches.

| Edge           | From → To                   | Description                                         |
| -------------- | --------------------------- | --------------------------------------------------- |
| `performs`     | Entity → Operation          | An entity initiates or is the actor of an operation |
| `produces`     | Operation → Event           | An operation emits an event upon completion         |
| `enforces`     | Rule → Operation            | A rule constrains when an operation can execute     |
| `calculates`   | Calculation → Operation     | A calculation derives values used by an operation   |
| `transitions`  | Event → State Machine       | An event triggers a state transition                |
| `exposes`      | Interface → Operation/Query | An interface makes an operation or query accessible |
| `orchestrates` | Workflow → Operation[]      | A workflow coordinates multiple operations          |
| `applies`      | Policy → Operation          | A policy governs how an operation behaves           |
| `maps`         | Mapping → Entity/Interface  | A mapping transforms data between shapes            |
| `contains`     | Entity → Value Object       | An entity embeds a value object as a field          |
| `queries`      | Query → Entity              | A query reads data from an entity                   |
| `emits`        | Entity → Event              | An entity is the source of a domain event           |

---

## Edge Details

### `performs` — Entity → Operation

An entity (or its associated actor) initiates a business action.

> User **performs** CreateOrder
> Admin **performs** ApproveRefund

_In the registry:_ Shows which actors trigger which operations. Follow this edge to answer "What can a {User/Admin/System} do?"

### `produces` — Operation → Event

When an operation completes successfully, it emits one or more domain events.

> ProcessPayment **produces** PaymentInitiated
> CreateOrder **produces** OrderCreated

_In the registry:_ Traces cause → effect. Follow this edge to answer "What happens after {Operation} runs?"

### `enforces` — Rule → Operation

A rule constrains an operation — the operation cannot proceed unless the rule is satisfied.

> MaxAmountRule **enforces** ProcessPayment
> StockAvailabilityRule **enforces** CreateOrder

_In the registry:_ Shows all constraints on an operation. Follow this edge to answer "What conditions must hold for {Operation} to execute?"

### `calculates` — Calculation → Operation

A calculation produces derived values that an operation consumes.

> FeeCalculation **calculates** for ProcessPayment
> TaxCalculation **calculates** for CreateOrder

_In the registry:_ Links pure computation to the operations that use it. Follow this edge to answer "What values does {Operation} compute?"

### `transitions` — Event → State Machine

An event causes a state machine to move from one state to another.

> PaymentCompleted **transitions** PaymentStatus (Processing → Completed)
> OrderShipped **transitions** OrderLifecycle (Confirmed → Shipped)

_In the registry:_ Connects events to lifecycle changes. Follow this edge to answer "What state change does {Event} cause?"

### `exposes` — Interface → Operation/Query

An interface makes a domain operation or query available to external or internal consumers.

> PaymentAPI **exposes** ProcessPayment
> PaymentModule **exposes** GetPaymentStatus

_In the registry:_ Maps API surface to domain logic. Follow this edge to answer "How do I call {Operation} from outside?"

### `orchestrates` — Workflow → Operation[]

A workflow coordinates multiple operations into a multi-step process.

> OrderFulfillment **orchestrates** [ChargePayment, ReserveInventory, ShipOrder, NotifyCustomer]

_In the registry:_ Shows process composition. Follow this edge to answer "What steps are in {Workflow}?"

### `applies` — Policy → Operation

A policy governs how an operation selects its behavior — choosing between strategies at runtime.

> RetryPolicy **applies** to RetryPayment
> PricingPolicy **applies** to CalculateDiscount

_In the registry:_ Shows which strategies control which behaviors. Follow this edge to answer "What decides how {Operation} behaves?"

### `maps` — Mapping → Entity/Interface

A mapping transforms data between an entity and an interface (or between two entities).

> RequestToTransaction **maps** APIRequest → PaymentTransaction
> TransactionToResponse **maps** PaymentTransaction → APIResponse

_In the registry:_ Shows data transformations at boundaries. Follow this edge to answer "How does {Entity} data change shape at {Interface}?"

### `contains` — Entity → Value Object

An entity embeds a value object as one of its fields.

> Order **contains** Money (as totalAmount)
> PaymentTransaction **contains** Money (as amount, fee, totalCharged)

_In the registry:_ Shows composition. Follow this edge to answer "What value objects are inside {Entity}?"

### `queries` — Query → Entity

A query reads data from one or more entities without modifying them.

> GetPaymentHistory **queries** PaymentTransaction
> GetOrderDetails **queries** Order

_In the registry:_ Shows read dependencies. Follow this edge to answer "Where does {Query} get its data from?"

### `emits` — Entity → Event

An entity is the source of a domain event — the event announces a change to that entity.

> PaymentTransaction **emits** PaymentCompleted
> Order **emits** OrderShipped

_In the registry:_ Shows which entities produce which signals. Follow this edge to answer "What events does {Entity} announce?"

---

## Navigating the Graph

The edges form navigation paths that mirror how humans think about a system:

**"What does this feature do?"**
→ Start at Entity → follow `performs` → find Operations → follow `produces` → see Events

**"What happens when a payment is processed?"**
→ ProcessPayment → `enforces` (see Rules) → `calculates` (see Calculations) → `produces` PaymentInitiated → `transitions` PaymentStatus

**"What consumes this event?"**
→ PaymentCompleted → look at event consumers → follow to downstream features

**"How do I call this operation?"**
→ ProcessPayment → follow `exposes` backward → find PaymentAPI → see endpoint details

**"What data does this API return?"**
→ GET /payments → `exposes` GetPaymentStatus → `queries` PaymentTransaction → `maps` TransactionToResponse

---

## Registry Format

In `registry.md`, the concept graph lists all edges as a flat table:

```markdown
## Concept Graph

| From                       | Edge     | To                       |
| -------------------------- | -------- | ------------------------ |
| payment.PaymentTransaction | contains | shared.Money             |
| payment.ProcessPayment     | produces | payment.PaymentInitiated |
| payment.MaxAmountRule      | enforces | payment.ProcessPayment   |
| payment.PaymentAPI         | exposes  | payment.ProcessPayment   |
```

This is the navigable index — any concept can be looked up to find all its connections.
