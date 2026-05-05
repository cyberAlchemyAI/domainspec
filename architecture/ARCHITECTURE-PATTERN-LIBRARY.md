# Architecture Pattern Library

> Purpose: provide composable implementation patterns so teams can load only the minimum context needed for a task, while preserving DomainSpec semantic fidelity.

This library is derived from:

- `../TAXONOMY.md` (meta-concept types)
- `../RELATIONSHIPS.md` (typed edges)
- `ARCHITECTURE.md` (layer and dependency model)

Detailed concept cards live in:

- `pattern-library/README.md`
- `pattern-library/concepts/backend/`
- `pattern-library/concepts/ui/`

## How To Use Minimal Context

1. Pick only the concept cards you are implementing from the taxonomy section.
2. Pick only the relationship cards that connect those concepts.
3. Use the selected cards as implementation context (types, functions, tests, and tags).
4. Ignore cards not used by the current slice.

## Context Packs (Composable)

Use one or more packs instead of loading the full architecture document.

| Pack                           | Use When                                            | Include Concept Cards                                                                                           | Include Relationship Cards                                                                     |
| ------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `CP-01 mutation-operation`     | Implementing a state-changing use-case              | Entity, Value Object, Enum/Type, Rule, Calculation, Policy, Operation, Event, State Machine, Interface, Mapping | performs, enforces, calculates, applies, produces, transitions, exposes, maps, contains, emits |
| `CP-02 read-query`             | Implementing read endpoints and view data retrieval | Entity, Query, Interface, Mapping, Value Object                                                                 | queries, exposes, maps, contains                                                               |
| `CP-03 workflow-orchestration` | Coordinating multi-step business flows              | Workflow, Operation, Policy, Event, State Machine                                                               | orchestrates, applies, produces, transitions                                                   |
| `CP-04 saga-cross-feature`     | Cross-feature orchestration and consistency         | Saga, Operation, Event, Rule, Entity                                                                            | produces-for, triggers-cross, enforces-cross, produces                                         |
| `CP-05 ui-read-binding`        | Building read screens                               | Page, Layout, Component, View Model, Hook, Binding, Adapter, State Indicator, Query, State Machine              | wraps, renders, composes, consumes, displays, shapes, fetches, derives, reflects               |
| `CP-06 ui-write-binding`       | Building forms and mutation flows                   | Form, Action, Binding, Guard, Interface, Operation, Rule                                                        | submits, contracts, mutates, mirrors, protects                                                 |

## Concept Pattern Cards (One Example Per Taxonomy Type)

### Backend Concepts (14)

| Concept       | Layer                   | Pattern Contract                                      | Minimal Example                                                                   |
| ------------- | ----------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- | ------------ | ----------- | ---------- |
| Entity        | Domain                  | Identity-bearing aggregate with lifecycle transitions | `type PaymentTransaction = { id: string; status: PaymentStatus; amount: Money };` |
| Value Object  | Domain                  | Immutable value with constructor validation           | `type Money = { amount: number; currency: string };`                              |
| Enum / Type   | Domain                  | Finite union used by entities and state machines      | `type PaymentStatus = "Created"                                                   | "Processing" | "Completed" | "Failed";` |
| Operation     | Application             | Use-case function that mutates state                  | `const processPayment = makeProcessPayment(deps);`                                |
| Query         | Application             | Read-only use-case function with no side effects      | `const getPaymentStatus = makeGetPaymentStatus(deps);`                            |
| Calculation   | Domain                  | Pure deterministic formula                            | `const fee = calculateFee(amount, 0.03);`                                         |
| Rule          | Domain                  | Pure predicate guarding operation execution           | `if (!satisfiesMaxAmount(amount)) throw new Error("max");`                        |
| Policy        | Domain/Application      | Strategy selector for runtime behavior                | `const gateway = selectGatewayPolicy(ctx);`                                       |
| Workflow      | Application             | Ordered orchestration with compensation               | `await orderFulfillmentWorkflow(input);`                                          |
| Saga          | Application             | Cross-feature orchestration with explicit rollback    | `await settlementReconciliationSaga(input);`                                      |
| Interface     | Interface/Adapters      | Boundary exposing operations and queries              | `router.post("/payments", postPaymentController);`                                |
| Event         | Domain + Infrastructure | Typed domain signal emitted after operation outcome   | `await bus.publish({ type: "PaymentCompleted", paymentId });`                     |
| Mapping       | Infrastructure          | Explicit shape transformation at boundaries           | `const dto = transactionToResponse(tx);`                                          |
| State Machine | Domain                  | Transition map with guards and effects                | `const next = transitionPaymentStatus(tx, "Completed");`                          |

### UI Concepts (11)

| Concept         | Layer                | Pattern Contract                           | Minimal Example                                                                              |
| --------------- | -------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Page            | UI Routes            | Routable screen composition root           | `export default function PaymentsPage() { return <PaymentsView />; }`                        |
| Layout          | UI Layouts           | Shared shell wrapping pages                | `export function DashboardLayout({ children }: Props) { return <Shell>{children}</Shell>; }` |
| Component       | UI Components        | Typed reusable render unit                 | `export function PaymentCard({ item }: { item: PaymentOverviewVM }) { ... }`                 |
| View Model      | UI Hooks/Components  | Render-optimized typed shape               | `type PaymentOverviewVM = { id: string; statusLabel: string; totalLabel: string };`          |
| Hook            | UI Hooks             | Encapsulated reactive data/mutation logic  | `function usePaymentOverview() { return useQuery(...); }`                                    |
| Form            | UI Components        | Schema-validated input contract            | `const schema = z.object({ amount: z.number().positive() });`                                |
| Action          | UI Components        | Event handler invoking mutation/navigation | `const onSubmit = (data: FormData) => mutate(data);`                                         |
| Guard           | UI Routes/Components | Access gate for navigation/rendering       | `if (!auth.user) return <Navigate to="/login" />;`                                           |
| Binding         | UI Hooks             | Named API bridge to operation/query        | `const createPaymentBinding = useMutation({ mutationFn: api.createPayment });`               |
| Adapter         | UI Hooks/Lib         | Pure API-to-view-model transformation      | `const toPaymentOverview = (api: PaymentDto): PaymentOverviewVM => ({ ... });`               |
| State Indicator | UI Components        | Visual representation of domain state      | `const color = STATUS_COLOR[item.status];`                                                   |

## Relationship Pattern Cards (One Example Per Relationship Type)

### Backend Edges (15)

| Edge             | From -> To                   | Contract                                                  | Minimal Example                                          |
| ---------------- | ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| `performs`       | Entity -> Operation          | Actor/entity triggers an operation                        | `customer.performCreatePayment(command);`                |
| `produces`       | Operation -> Event           | Operation emits event after postconditions                | `ProcessPayment -> PaymentCompleted`                     |
| `produces-for`   | Operation@A -> Entity@B      | Cross-feature operation updates foreign entity projection | `Billing.GenerateStatement -> Accounting.InvoiceLedger`  |
| `triggers-cross` | Event@A -> Operation@B       | Event in A activates operation in B                       | `PaymentCompleted -> Shipping.ScheduleDispatch`          |
| `enforces-cross` | Rule@A -> Operation@B        | External rule gates operation execution                   | `Compliance.KycRule -> Accounts.OpenAccount`             |
| `enforces`       | Rule -> Operation            | Rule must pass before mutation                            | `MaxAmountRule -> ProcessPayment`                        |
| `calculates`     | Calculation -> Operation     | Operation consumes derived values                         | `FeeCalculation -> ProcessPayment`                       |
| `transitions`    | Event -> State Machine       | Event drives lifecycle change                             | `PaymentCompleted -> PaymentLifecycle`                   |
| `exposes`        | Interface -> Operation/Query | Boundary makes use-case callable                          | `PaymentAPI -> ProcessPayment`                           |
| `orchestrates`   | Workflow -> Operation[]      | Workflow coordinates operation sequence                   | `OrderFulfillment -> [ProcessPayment, ReserveInventory]` |
| `applies`        | Policy -> Operation          | Policy chooses execution strategy                         | `RetryPolicy -> RetryPayment`                            |
| `maps`           | Mapping -> Entity/Interface  | Mapper transforms between shapes                          | `TransactionToResponse -> PaymentAPI`                    |
| `contains`       | Entity -> Value Object       | Entity embeds immutable value                             | `PaymentTransaction -> Money`                            |
| `queries`        | Query -> Entity              | Query reads entity state                                  | `GetPaymentStatus -> PaymentTransaction`                 |
| `emits`          | Entity -> Event              | Entity is event source                                    | `PaymentTransaction -> PaymentCompleted`                 |

### Intra-UI Edges (8)

| Edge       | From -> To               | Contract                           | Minimal Example                                   |
| ---------- | ------------------------ | ---------------------------------- | ------------------------------------------------- |
| `renders`  | Page -> Component[]      | Page renders component tree        | `PaymentsPage -> [PaymentsHeader, PaymentsTable]` |
| `wraps`    | Layout -> Page[]         | Layout wraps routable pages        | `DashboardLayout -> [PaymentsPage, RefundsPage]`  |
| `composes` | Component -> Component[] | Parent component includes children | `PaymentsPanel -> [FiltersBar, PaymentsTable]`    |
| `consumes` | Component -> Hook        | Component uses reactive hook       | `PaymentsTable -> usePaymentOverview`             |
| `submits`  | Form -> Action           | Form delegates submit behavior     | `CreatePaymentForm -> submitCreatePayment`        |
| `shapes`   | Adapter -> View Model    | Adapter produces render model      | `PaymentAdapter -> PaymentOverviewVM`             |
| `protects` | Guard -> Page            | Guard controls page access         | `AuthGuard -> PaymentsPage`                       |
| `displays` | Component -> View Model  | Component renders VM fields        | `PaymentCard -> PaymentOverviewVM`                |

### Cross-Layer Edges (UI <-> Backend) (6)

| Edge        | From -> To                       | Contract                                    | Minimal Example                                 |
| ----------- | -------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| `fetches`   | Binding -> Query                 | UI read binding calls query                 | `usePaymentOverviewBinding -> GetPaymentStatus` |
| `mutates`   | Binding -> Operation             | UI write binding calls operation            | `useCreatePaymentBinding -> ProcessPayment`     |
| `reflects`  | State Indicator -> State Machine | UI visual state mirrors lifecycle           | `PaymentStatusBadge -> PaymentLifecycle`        |
| `derives`   | View Model -> Entity             | VM fields derived from entity data          | `PaymentOverviewVM -> PaymentTransaction`       |
| `contracts` | Form -> Interface                | Form schema aligns with endpoint contract   | `CreatePaymentForm -> PaymentAPI.createPayment` |
| `mirrors`   | Guard -> Rule                    | UI guard mirrors backend authorization rule | `AuthGuard -> AuthenticatedUserRule`            |

## Implementation Slice Recipe

For any work-pack task, build context in this order:

1. Select concept cards from taxonomy.
2. Select relationship cards for required graph edges.
3. Derive function signatures from selected cards.
4. Encode checks:
   - concept-level unit tests (rules/calculations/transitions)
   - relationship-level integration tests (edge obligations)
5. Tag symbols with DomainSpec code tags and validate extract/validate/drift/composability.

## Coverage Checklist

This library includes:

- one pattern and one minimal example for all 14 backend taxonomy types
- one pattern and one minimal example for all 11 UI taxonomy types
- one relationship card and one minimal example for all 29 relationship types

When taxonomy or relationship definitions evolve, update this file in the same change.
