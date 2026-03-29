# Meta-Concept Taxonomy

> The 13 building blocks for describing any domain. Every concept in your system maps to exactly one of these types.

## Overview

| Category       | Meta-Concept  | Purpose                                          |
| -------------- | ------------- | ------------------------------------------------ |
| **Structural** | Entity        | Identity-bearing domain objects with lifecycle   |
|                | Value Object  | Identity-less reusable concepts (Money, Address) |
|                | Enum / Type   | Finite sets of states or categories              |
| **Behavioral** | Operation     | Business action that changes state (≈ mutation)  |
|                | Query         | Reads data without side effects                  |
|                | Calculation   | Derives a value from inputs                      |
|                | Rule          | Business constraint or validation                |
|                | Policy        | Decision logic that selects behavior             |
|                | Workflow      | Multi-step orchestration of operations           |
| **Connective** | Interface     | API boundary — REST, GraphQL, module contract    |
|                | Event         | Notification of something that happened          |
|                | Mapping       | Data transformation between shapes               |
| **Lifecycle**  | State Machine | States + transitions + guards + effects          |

---

## Structural — What things exist

These define the **nouns** of the domain: the objects, values, and categories that make up the data model.

### Entity

An object with a unique identity that persists over time and moves through a lifecycle. Two entities with the same field values are still different if they have different IDs. Entities are the primary "actors" in the domain — operations act on them, state machines track their lifecycle, events announce changes to them.

> _Examples:_ User, Order, PaymentTransaction, Invoice, Subscription

_When to use:_ If you'd give it an ID in a database and track its history, it's an entity.

**Documented in:** `domain.md` → Entities section
**Template:** [templates/domain.md](templates/domain.md)
**Example:** [examples/payment-processing/domain.md](examples/payment-processing/domain.md#paymenttransaction) — PaymentTransaction

**Typical structure:**

- Field table (name, type, required, description)
- Link to state machine (if lifecycle exists)
- Links to operations that act on it

### Value Object

An immutable concept defined entirely by its fields, with no identity of its own. Two value objects with the same fields are equal. Value objects are often shared across features and embedded within entities.

> _Examples:_ Money (amount + currency), Address (street + city + zip), DateRange (start + end), Email

_When to use:_ If you compare two instances by their content (not ID), and they're interchangeable when equal, it's a value object.

**Documented in:** `domain.md` → Value Objects section, or `shared/{name}.md` if cross-feature
**Template:** [templates/domain.md](templates/domain.md), [templates/shared-value-object.md](templates/shared-value-object.md)
**Example:** [examples/shared/money.md](examples/shared/money.md) — Money

**Typical structure:**

- Field table with constraints
- Equality definition
- Validation rules
- Operations on the value object (add, compare, etc.)

### Enum / Type

A fixed, finite set of named values that categorize or classify. Enums constrain which values a field can hold and often drive branching logic (different behavior per enum value).

> _Examples:_ PaymentMethod (CREDIT_CARD, BANK_TRANSFER, WALLET), OrderStatus, UserRole, Currency

_When to use:_ If you can list all possible values and that list rarely changes, it's an enum.

**Documented in:** `domain.md` → Enums section
**Template:** [templates/domain.md](templates/domain.md)
**Example:** [examples/payment-processing/domain.md](examples/payment-processing/domain.md#paymentmethod) — PaymentMethod, PaymentErrorCode

**Typical structure:**

- Value table (value, description)

---

## Behavioral — What happens

These define the **verbs** of the domain: actions, reads, logic, and processes.

### Operation

A business action that changes the state of one or more entities. Operations are the write side of the system — they validate input, check rules, perform calculations, transition state, and emit events. Every mutation in the system should map to a named operation.

> _Examples:_ ProcessPayment, CreateOrder, CancelSubscription, ApproveRefund

_When to use:_ If it changes state and has business meaning (not just a CRUD "update"), it's an operation. Document its rules, calculations, state transitions, postconditions, and error states.

**Documented in:** `operations.md`
**Template:** [templates/operations.md](templates/operations.md)
**Example:** [examples/payment-processing/operations.md](examples/payment-processing/operations.md#processpayment) — ProcessPayment, RefundPayment, RetryPayment

**Typical structure:**

- Type, actor, trigger
- Input table
- Rules (with formal expressions)
- Calculations (with formulas)
- State transition
- Postconditions
- Error states

### Query

A read operation that retrieves data without side effects. Queries define what data consumers can ask for, with what filters, and in what shape. They separate the read model from the write model.

> _Examples:_ GetPaymentStatus, GetOrderHistory, SearchProducts, ListUserSubscriptions

_When to use:_ If calling it twice produces the same result and nothing changes, it's a query.

**Documented in:** `queries.md`
**Template:** [templates/queries.md](templates/queries.md)
**Example:** [examples/payment-processing/queries.md](examples/payment-processing/queries.md#getpaymentstatus) — GetPaymentStatus, GetPaymentHistory

**Typical structure:**

- Input table
- Filters / pagination
- Output shape (with source entity fields)
- Authorization rules

### Calculation

A pure function that derives a value from inputs. Calculations are deterministic — same input always produces same output. They are used inside operations but documented separately because they carry their own formulas, edge cases, and testable properties.

> _Examples:_ FeeCalculation (amount × rate), TaxCalculation, DiscountAmount, ShippingCost

_When to use:_ If it has a formula and you'd want to test it independently of the operation that uses it, extract it as a calculation.

**Documented in:** `operations.md` → as a standalone section or inline within an operation
**Template:** [templates/operations.md](templates/operations.md)
**Example:** [examples/payment-processing/operations.md](examples/payment-processing/operations.md#feecalculation) — FeeCalculation

**Typical structure:**

- Rate/lookup table
- Formula
- Properties (non-negative, bounded, deterministic)

### Rule

A business constraint that must be satisfied for an operation to proceed. Rules are the **guards** of the system — they prevent invalid state transitions. Each rule has a formal expression that makes it unambiguous and directly testable.

> _Examples:_ MaxAmountRule (`amount <= 10000`), MinimumAgeRule (`user.age >= 18`), StockAvailabilityRule (`product.stock >= quantity`)

_When to use:_ If violating it should prevent an operation from executing, it's a rule. Rules answer: "Under what conditions is this operation allowed?"

**Documented in:** `operations.md` → Rules table within each operation
**Template:** [templates/operations.md](templates/operations.md)
**Example:** [examples/payment-processing/operations.md](examples/payment-processing/operations.md#processpayment) — R1 through R10

**Typical structure:**

- ID, human-readable description, formal expression
- Documented inline within the operation they guard

### Policy

Decision logic that selects between different behaviors at runtime. Unlike rules (which block or allow), policies _choose_ how something happens. Policies encode business strategy and are often configurable.

> _Examples:_ RetryPolicy (when to retry, how many times), PricingPolicy (which discount tier applies), RoutingPolicy (which payment gateway to use), EscalationPolicy (when to notify a manager)

_When to use:_ If the system needs to choose between strategies based on context, it's a policy. Policies answer: "How should this be handled?"

**Documented in:** `workflows.md` → Policies section, or `operations.md` if embedded in an operation
**Template:** [templates/workflows.md](templates/workflows.md)
**Example:** [examples/payment-processing/SPEC.md](examples/payment-processing/SPEC.md) — RetryPolicy (referenced in operations)

**Typical structure:**

- What it applies to
- Decision logic (conditions → selected behavior)
- Configuration parameters

### Workflow

A multi-step process that orchestrates multiple operations in sequence, with decision points, parallel paths, and compensation logic (undoing completed steps if a later step fails). Workflows are the "sagas" of the domain.

> _Examples:_ OrderFulfillment (charge → reserve → ship → notify), UserOnboarding (register → verify email → setup profile), RefundProcess (validate → reverse charge → update inventory → notify)

_When to use:_ If it involves more than one operation coordinated across time or services, it's a workflow. Document the step graph, policies at decision points, and compensation actions.

**Documented in:** `workflows.md`
**Template:** [templates/workflows.md](templates/workflows.md)

**Typical structure:**

- Mermaid flow diagram
- Step table (step → operation → on success → on failure)
- Policies at decision points
- Compensation table (how to undo completed steps)
- Invariants

---

## Connective — How things communicate

These define the **bridges** between parts of the system: boundaries, signals, and data transformations.

### Interface

An API boundary that exposes operations and queries to consumers. Interfaces can be external (REST endpoints, GraphQL schema) or internal (module contracts between services). They document the shape of data that crosses the boundary and how it maps to domain concepts.

> _Examples:_ PaymentAPI (REST), OrderGraphQL (GraphQL), PaymentModule (internal contract), NotificationService (internal)

_When to use:_ If there's a boundary where data changes shape or access is controlled, it's an interface. Document request/response shapes and the domain concepts they expose.

**Documented in:** `interfaces.md`
**Template:** [templates/interfaces.md](templates/interfaces.md)
**Example:** [examples/payment-processing/interfaces.md](examples/payment-processing/interfaces.md) — PaymentAPI (REST), PaymentModule (internal)

**Typical structure:**

- External: METHOD + path, auth, request fields with "Maps To" column, response table
- Internal: method signature table with "Maps To" column

### Event

A notification that something happened in the domain. Events are the past-tense announcements of state changes — they decouple the thing that happened from the things that react to it. Each event has a typed payload and a list of consumers.

> _Examples:_ PaymentCompleted, OrderShipped, UserRegistered, SubscriptionCancelled

_When to use:_ If other parts of the system need to react to a state change without the source knowing about them, it's an event. Events answer: "What just happened?"

**Documented in:** `events.md`
**Template:** [templates/events.md](templates/events.md)
**Example:** [examples/payment-processing/events.md](examples/payment-processing/events.md) — PaymentInitiated, PaymentCompleted, PaymentFailed, RefundCompleted

**Typical structure:**

- Produced by (link to operation)
- Triggers transition (link to state machine)
- Payload table
- Consumed-by table (consumer → action)

### Mapping

A data transformation between two shapes. Mappings document field-by-field how data moves between domain entities, DTOs, API payloads, and external systems. They make the transformation explicit, including defaults, computed fields, and validation at the boundary.

> _Examples:_ RequestToTransaction (API → Entity), TransactionToResponse (Entity → API), ExternalGatewayToEvent (third-party webhook → domain event)

_When to use:_ If data crosses a boundary and its shape changes, document the mapping. This catches mismatches early and makes integration testable.

**Documented in:** `mappings.md`
**Template:** [templates/mappings.md](templates/mappings.md)
**Example:** [examples/payment-processing/mappings.md](examples/payment-processing/mappings.md) — RequestToTransaction, TransactionToResponse

**Typical structure:**

- From → To (with direction: inbound/outbound/bidirectional)
- Field mapping table (source → target → transform → notes)
- Defaults table
- Validation table

---

## Lifecycle — How things evolve

### State Machine

A formal specification of how an entity moves through states over time. State machines define: all possible states, valid transitions between them, guards (conditions for transitions), effects (side effects of transitions), and invariants (properties that must always hold). They are the most formal and testable meta-concept — producing transition tests, negative tests, and property-based tests.

> _Examples:_ PaymentStatus (Created → Processing → Completed/Failed), OrderLifecycle (Draft → Confirmed → Shipped → Delivered), SubscriptionState (Trial → Active → Cancelled)

_When to use:_ If an entity has a `status` field or moves through stages, it has a state machine. Document it with a mermaid diagram, transition table, invalid transitions, and invariants.

**Documented in:** `states.md`
**Template:** [templates/states.md](templates/states.md)
**Example:** [examples/payment-processing/states.md](examples/payment-processing/states.md#paymentstatus) — PaymentStatus (8 states, 9 transitions, 6 invariants)

**Typical structure:**

- Mermaid `stateDiagram-v2` diagram
- States table (state, terminal?, description)
- Transition table (from, event, to, guard, effect)
- Invalid transitions table
- Invariants table (with formal expressions)

---

## Quick Reference: Choosing the Right Meta-Type

| If you're describing...               | It's a...     | Document in...         |
| ------------------------------------- | ------------- | ---------------------- |
| A thing with an ID and history        | Entity        | domain.md              |
| A thing defined by its values, no ID  | Value Object  | domain.md or shared/   |
| A fixed set of options                | Enum / Type   | domain.md              |
| An action that changes something      | Operation     | operations.md          |
| A read that returns data              | Query         | queries.md             |
| A formula that computes a value       | Calculation   | operations.md          |
| A condition that blocks an action     | Rule          | operations.md (inline) |
| A strategy that chooses behavior      | Policy        | workflows.md           |
| Multiple steps coordinated together   | Workflow      | workflows.md           |
| A boundary where data crosses         | Interface     | interfaces.md          |
| A signal that something happened      | Event         | events.md              |
| A shape conversion between boundaries | Mapping       | mappings.md            |
| How something moves through states    | State Machine | states.md              |

## Common Confusion

| Concept A   | vs. | Concept B    | How to tell apart                                                                     |
| ----------- | --- | ------------ | ------------------------------------------------------------------------------------- |
| Rule        | vs. | Policy       | Rules **block** (yes/no). Policies **choose** (which strategy).                       |
| Entity      | vs. | Value Object | Entities have **IDs**. Value objects are equal by **fields**.                         |
| Operation   | vs. | Workflow     | Operations are **single actions**. Workflows **orchestrate multiple** operations.     |
| Event       | vs. | Operation    | Operations **cause** change. Events **announce** that change happened.                |
| Calculation | vs. | Rule         | Calculations **produce values**. Rules **check conditions**.                          |
| Interface   | vs. | Mapping      | Interfaces define the **boundary**. Mappings define the **transformation** across it. |
| Query       | vs. | Operation    | Queries are **read-only**. Operations **change state**.                               |

---

## Architecture Mapping Appendix (Functional Style)

This appendix maps each meta-concept to an implementation pattern in a clean, layered architecture using only functions and types.

| Meta-Concept  | Primary Layer           | Functional Implementation Pattern                              |
| ------------- | ----------------------- | -------------------------------------------------------------- |
| Entity        | Domain                  | `type` + factory function + exported transition functions      |
| Value Object  | Domain                  | immutable `type` + exported constructor/factory + pure helpers |
| Enum / Type   | Domain                  | enum or union type                                             |
| Operation     | Application             | use-case factory `makeX(deps) -> (input) => Promise<output>`   |
| Query         | Application             | query factory `makeX(deps) -> (input) => Promise<view>`        |
| Calculation   | Domain                  | pure deterministic function                                    |
| Rule          | Domain                  | pure predicate function (`boolean`)                            |
| Policy        | Domain                  | strategy selection function                                    |
| Workflow      | Application             | saga/orchestrator function with compensation stack             |
| Interface     | Interface / Adapters    | boundary handlers (HTTP/RPC/module) that call use-cases        |
| Event         | Domain + Infrastructure | event payload type in domain + publisher adapter in infra      |
| Mapping       | Infrastructure          | pure shape transformation functions                            |
| State Machine | Domain                  | transition table/map + guard checks + pure transition function |

### Layer Dependency Rule

- Domain depends on nothing external.
- Application depends on domain only.
- Infrastructure depends on domain/application contracts.
- Interface depends on application only.

### Encapsulation Rule

- Public API = exported functions and types only.
- Private implementation = unexported file-local helpers.
