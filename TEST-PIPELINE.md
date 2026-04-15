# Test Pipeline: Documentation → Tests

> How DFDS documentation maps to testable specifications.
> Each doc section produces specific test types with deterministic coverage.

## Pipeline Overview

```mermaid
graph LR
    SM[states.md] --> ST[State Transition Tests]
    SM --> NT[Negative Transition Tests]
    SM --> PT[Property-Based Tests]
    OP[operations.md] --> RV[Rule Validation Tests]
    OP --> CT[Calculation Tests]
    OP --> PC[Postcondition Tests]
    OP --> ET[Error State Tests]
    IF[interfaces.md] --> CO[Contract Tests]
    EV[events.md] --> EF[Event Flow Tests]
    QR[queries.md] --> QT[Query Tests]
    WF[workflows.md] --> WT[Workflow Tests]
    MP[mappings.md] --> MT[Mapping Tests]
```

## Test Generation Rules

### From `states.md`

#### 1. State Transition Tests (happy path)

**Rule:** Every row in the Transition Table = 1 test case.

| Transition Table Row                                   | Test                                                      |
| ------------------------------------------------------ | --------------------------------------------------------- |
| `From: Created, Event: ProcessPayment, To: Processing` | `test("ProcessPayment transitions Created → Processing")` |

**Template:**

```
GIVEN entity in state {From}
WHEN {Event} occurs
AND {Guard} is satisfied
THEN entity transitions to {To}
AND {Effect} is executed
```

**Coverage from Payment example:** 9 transition tests (one per row).

#### 2. Negative Transition Tests

**Rule:** Every entry in the Invalid Transitions table = 1 rejection test. Additionally, for every state × event combination NOT in the Transition Table, generate a rejection test.

| Invalid Transition                     | Test                                                |
| -------------------------------------- | --------------------------------------------------- |
| `From: Created, Event: GatewayConfirm` | `test("GatewayConfirm rejected in Created state")`  |
| `From: Failed, Event: any`             | `test("No transitions from terminal state Failed")` |

**Template:**

```
GIVEN entity in state {From}
WHEN {Event} occurs
THEN transition is rejected
AND state remains {From}
```

#### 3. Invariant Tests (property-based)

**Rule:** Every row in the Invariants table = 1 property-based test that must hold across ALL states.

| Invariant                                      | Test                                          |
| ---------------------------------------------- | --------------------------------------------- |
| `I1: status == Completed → gatewayRef != null` | `property("Completed always has gatewayRef")` |
| `I3: retryCount <= maxRetries`                 | `property("retryCount never exceeds max")`    |

**Template:**

```
FOR ALL reachable states of {Entity}
ASSERT {Formal expression} holds
```

**Coverage from Payment example:** 6 property tests (I1–I6).

---

### From `operations.md`

#### 4. Rule Validation Tests

**Rule:** Each rule = at least 2 tests (pass + fail).

| Rule                                        | Tests                                                                                               |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `R1: amount.value > 0`                      | `test("accepts positive amount")`, `test("rejects zero amount")`, `test("rejects negative amount")` |
| `R3: method ∈ enabledMethods(user.country)` | `test("accepts enabled method")`, `test("rejects disabled method")`                                 |

**Template:**

```
GIVEN valid input EXCEPT {rule field} is {invalid value}
WHEN {Operation} is executed
THEN {Error} is returned
AND no state change occurs
```

**Coverage from Payment example:** 10 rules × 2+ tests = 20+ rule tests.

#### 5. Calculation Tests

**Rule:** Each calculation row = 1+ correctness tests. Each property in the Properties table = 1 property test.

| Calculation                    | Tests                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `C1: amount × feeRate(method)` | `test("CREDIT_CARD fee = 2.9% + $0.30")`, `test("BANK_TRANSFER fee = 0.8%")`, `test("minimum fee applied")` |

**Template:**

```
GIVEN amount = {value} AND method = {method}
WHEN FeeCalculation is applied
THEN fee = {expected}
```

#### 6. Postcondition Tests

**Rule:** Each postcondition bullet = 1 assertion test.

| Postcondition                                      | Test                                                 |
| -------------------------------------------------- | ---------------------------------------------------- |
| "PaymentTransaction exists with status=Processing" | `test("transaction created with Processing status")` |
| "`PaymentInitiated` event emitted"                 | `test("PaymentInitiated event emitted on success")`  |

**Template:**

```
GIVEN valid input
WHEN {Operation} succeeds
THEN {postcondition} holds
```

#### 7. Error State Tests

**Rule:** Each error state row = 1 negative test.

| Error State                          | Test                                                        |
| ------------------------------------ | ----------------------------------------------------------- |
| `R3 violated → METHOD_NOT_AVAILABLE` | `test("returns METHOD_NOT_AVAILABLE for disabled method")`  |
| `Gateway timeout → FailedRetryable`  | `test("transitions to FailedRetryable on gateway timeout")` |

---

### From `interfaces.md`

#### 8. Contract Tests

**Rule:** Each endpoint × response status = 1 contract test.

| Endpoint × Status      | Test                                                        |
| ---------------------- | ----------------------------------------------------------- |
| `POST /payments → 201` | `test("POST /payments returns 201 with valid input")`       |
| `POST /payments → 400` | `test("POST /payments returns 400 for invalid amount")`     |
| `POST /payments → 422` | `test("POST /payments returns 422 for unavailable method")` |

**Template:**

```
GIVEN {auth context}
WHEN {METHOD} {path} with {request body}
THEN response status = {status}
AND response body matches {shape}
```

**Coverage from Payment example:** 4 endpoints × 2-4 statuses = ~12 contract tests.

#### 9. Field Mapping Tests (interface)

**Rule:** Each "Maps To" entry = 1 mapping verification.

```
GIVEN API request field {source}
WHEN mapped to operation input
THEN operation receives {target} with correct value
```

---

### From `events.md`

#### 10. Event Producer Tests

**Rule:** Each event = 1 test that the producing operation emits it with correct payload.

| Event              | Test                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `PaymentInitiated` | `test("ProcessPayment emits PaymentInitiated with correct payload")` |

**Template:**

```
GIVEN {operation} succeeds
THEN {event} is emitted
AND payload contains {fields with expected values}
```

#### 11. Event Consumer Tests

**Rule:** Each consumer row = 1 test that the consumer handles the event correctly.

| Consumer                             | Test                                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| `AuditLog consumes PaymentInitiated` | `test("AuditLog records payment attempt on PaymentInitiated")` |

---

### From `queries.md`

#### 12. Query Tests

**Rule:** Each query = tests for: correct output shape, filtering, authorization, empty results.

| Query               | Tests                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GetPaymentStatus`  | `test("returns correct fields")`, `test("404 for unknown ID")`, `test("owner can view own")`, `test("non-owner rejected")` |
| `GetPaymentHistory` | `test("filters by orderId")`, `test("filters by status")`, `test("paginates correctly")`, `test("scoped to own user")`     |

---

### From `workflows.md`

#### 13. Workflow Tests

**Rule:** Each step = 1 happy path test. Each failure path = 1 compensation test. Each policy = 1 decision test.

---

### From `mappings.md`

#### 14. Mapping Tests

**Rule:** Each field mapping row = 1 transformation test. Each validation row = 1 rejection test.

| Mapping                          | Tests                                           |
| -------------------------------- | ----------------------------------------------- |
| `amount → amount.value (direct)` | `test("maps amount field directly")`            |
| `status → lowercase`             | `test("transforms CREDIT_CARD to credit_card")` |

---

## Coverage Summary (Payment Processing Example)

| Source        | Test Type             | Estimated Count |
| ------------- | --------------------- | --------------- |
| states.md     | Transition (happy)    | 9               |
| states.md     | Transition (negative) | 5+              |
| states.md     | Invariant (property)  | 6               |
| operations.md | Rule validation       | 20+             |
| operations.md | Calculation           | 6+              |
| operations.md | Postcondition         | 8               |
| operations.md | Error state           | 8               |
| interfaces.md | Contract              | 12+             |
| events.md     | Producer              | 4               |
| events.md     | Consumer              | 8               |
| queries.md    | Query                 | 8+              |
| mappings.md   | Field mapping         | 15+             |
| mappings.md   | Validation            | 4               |
| **Total**     |                       | **~113 tests**  |

Every test traces back to a specific doc line. If the doc changes, the corresponding tests must be updated.

## Traceability Format

Tests should reference their documentation source:

```
/**
 * @source features/payment-processing/states.md#paymentstatus
 * @transition Created → Processing (ProcessPayment)
 * @invariant I1
 */
test("ProcessPayment transitions Created → Processing", () => { ... })
```

This enables:

- **Doc change → find affected tests** (grep for `@source`)
- **Test failure → find the spec** (follow `@source` + `@transition`)
- **Coverage audit** — verify every doc row has a `@source` reference

---

## UI E2E Test Generation Rules

> When a feature has a `UI-SPEC.md` and/or `UI-ARCHITECTURE.md`, the test pipeline also generates Playwright E2E test specifications. These tests verify that the implemented frontend satisfies the design contract and domain behavior visible to the user.

### Prerequisites

- `docs/UI-ARCHITECTURE.md` exists (provides base URL, routes, component lib context)
- `docs/features/{feature}/UI-SPEC.md` exists (provides per-feature design contract)
- Playwright is installed (`npx playwright install`)

### From `UI-SPEC.md`

#### 15. Page Navigation Tests

**Rule:** Each declared route = 1 navigation + render test.

| Route      | Test                                                |
| ---------- | --------------------------------------------------- |
| `/players` | `test("players list page loads and renders table")` |

**Template:**

```
GIVEN authenticated user
WHEN navigating to {route}
THEN page loads within {timeout}ms
AND {primary element} is visible
```

#### 16. User Journey Tests (from STORIES.md + UI-SPEC)

**Rule:** Each user story with UI touchpoints = 1 end-to-end journey test.

| Story                         | Test                                                          |
| ----------------------------- | ------------------------------------------------------------- |
| `US-01: Admin creates player` | `test("admin can create player via form and see it in list")` |

**Template:**

```
GIVEN user with role {role}
WHEN user performs {story steps via UI interactions}
THEN {expected outcome} is visible on screen
AND {data state} is consistent with backend
```

#### 17. Form Validation Tests

**Rule:** Each form declared in UI-SPEC.md × each validation rule from operations.md = 1 client-side validation test.

| Form × Rule                             | Test                                                    |
| --------------------------------------- | ------------------------------------------------------- |
| `CreatePlayer form × R1: name required` | `test("create player form shows error for empty name")` |

**Template:**

```
GIVEN user on {page} with {form} visible
WHEN user submits form with {invalid field}
THEN validation error {message} is shown
AND form is NOT submitted to backend
```

#### 18. State Reflection Tests

**Rule:** Each UI state declared in UI-SPEC.md (empty, loading, error, populated) = 1 visual state test.

| State                       | Test                                                      |
| --------------------------- | --------------------------------------------------------- |
| `Players list: empty state` | `test("shows empty state message when no players exist")` |
| `Players list: loading`     | `test("shows skeleton while loading players")`            |
| `Players list: error`       | `test("shows error message on API failure")`              |

**Template:**

```
GIVEN {API condition: empty response | delay | error}
WHEN user navigates to {page}
THEN {state indicator: empty message | skeleton | error banner} is visible
```

#### 19. Responsive Layout Tests

**Rule:** Each page × each breakpoint declared in UI-ARCHITECTURE.md = 1 responsive test.

| Page × Breakpoint              | Test                                           |
| ------------------------------ | ---------------------------------------------- |
| `Dashboard × mobile (375px)`   | `test("dashboard renders properly at 375px")`  |
| `Dashboard × desktop (1440px)` | `test("dashboard renders properly at 1440px")` |

**Template:**

```
GIVEN viewport width = {width}px
WHEN navigating to {page}
THEN layout matches {expected layout behavior}
AND no horizontal overflow exists
```

#### 20. Accessibility Tests

**Rule:** Each interactive component = 1 keyboard navigation test. Each page = 1 accessibility audit.

**Template:**

```
GIVEN user on {page}
WHEN navigating via keyboard only
THEN all interactive elements are reachable via Tab
AND focus indicators are visible
AND ARIA roles are correct
```

### Playwright Test Traceability

E2E tests should reference their documentation source:

```typescript
/**
 * @source features/player-management/UI-SPEC.md#players-list
 * @story US-01
 * @journey admin-creates-player
 */
test("admin can create player via form and see it in list", async ({
  page,
}) => {
  // ...
});
```

### Playwright Test Scaffold Convention

Generated test files follow this structure:

```
{web-app}/e2e/
├── {feature}/
│   ├── {feature}.navigation.spec.ts    → Route navigation tests
│   ├── {feature}.journey.spec.ts       → User story journey tests
│   ├── {feature}.forms.spec.ts         → Form validation tests
│   ├── {feature}.states.spec.ts        → Empty/loading/error state tests
│   └── {feature}.responsive.spec.ts    → Breakpoint layout tests
├── accessibility.spec.ts               → Cross-feature a11y audit
└── playwright.config.ts                → Base config (from UI-ARCHITECTURE.md)
```

### UI E2E Coverage Summary

| Source                                 | Test Type        | Derivation                |
| -------------------------------------- | ---------------- | ------------------------- |
| UI-SPEC.md routes                      | Navigation       | 1 per route               |
| STORIES.md + UI-SPEC                   | Journey (E2E)    | 1 per story with UI steps |
| UI-SPEC.md forms + operations.md rules | Form validation  | rules × forms             |
| UI-SPEC.md states                      | State reflection | 1 per declared state      |
| UI-ARCHITECTURE.md breakpoints         | Responsive       | pages × breakpoints       |
| All pages                              | Accessibility    | 1 per page + keyboard nav |
