# Concept Registry

> Global index of all domain concepts across features.
> **Source of truth:** Each feature's `SPEC.md` (backend) and `UI-SPEC.md` (frontend) concept tables. This registry is validated against them.

## By Type

### Backend Concepts

#### Entities

| ID                         | Concept            | Feature                                                   | State Machine                                                        | Description                                                 |
| -------------------------- | ------------------ | --------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| payment.PaymentTransaction | PaymentTransaction | [Payment Processing](features/payment-processing/SPEC.md) | [PaymentStatus](features/payment-processing/states.md#paymentstatus) | A single payment attempt with amount, method, and lifecycle |

#### Value Objects

| ID           | Concept | Feature                   | Shared | Description            |
| ------------ | ------- | ------------------------- | ------ | ---------------------- |
| shared.Money | Money   | [Shared](shared/money.md) | yes    | Amount + currency pair |

#### Enums / Types

| ID                       | Concept          | Feature                                                   | Values                                      | Description                           |
| ------------------------ | ---------------- | --------------------------------------------------------- | ------------------------------------------- | ------------------------------------- |
| payment.PaymentMethod    | PaymentMethod    | [Payment Processing](features/payment-processing/SPEC.md) | CREDIT_CARD, BANK_TRANSFER, WALLET          | How the user pays                     |
| payment.PaymentErrorCode | PaymentErrorCode | [Payment Processing](features/payment-processing/SPEC.md) | VALIDATION_ERROR, METHOD_NOT_AVAILABLE, ... | Machine-readable error classification |

#### Operations

| ID                     | Concept        | Feature                                                   | Entity             | Events Produced       |
| ---------------------- | -------------- | --------------------------------------------------------- | ------------------ | --------------------- |
| payment.ProcessPayment | ProcessPayment | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction | PaymentInitiated      |
| payment.RefundPayment  | RefundPayment  | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction | — (waits for gateway) |
| payment.RetryPayment   | RetryPayment   | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction | —                     |

#### Queries

| ID                        | Concept           | Feature                                                   | Reads From         | Description                        |
| ------------------------- | ----------------- | --------------------------------------------------------- | ------------------ | ---------------------------------- |
| payment.GetPaymentStatus  | GetPaymentStatus  | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction | Current status of a transaction    |
| payment.GetPaymentHistory | GetPaymentHistory | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction | List transactions for a user/order |

#### Calculations

| ID                     | Concept        | Feature                                                   | Used By        | Formula                    |
| ---------------------- | -------------- | --------------------------------------------------------- | -------------- | -------------------------- |
| payment.FeeCalculation | FeeCalculation | [Payment Processing](features/payment-processing/SPEC.md) | ProcessPayment | `amount × feeRate(method)` |

#### Rules

| ID                             | Concept                | Feature                                                   | Enforces       | Formal                                  |
| ------------------------------ | ---------------------- | --------------------------------------------------------- | -------------- | --------------------------------------- |
| payment.MaxAmountRule          | MaxAmountRule          | [Payment Processing](features/payment-processing/SPEC.md) | ProcessPayment | `amount.value <= 10000`                 |
| payment.MethodAvailabilityRule | MethodAvailabilityRule | [Payment Processing](features/payment-processing/SPEC.md) | ProcessPayment | `method ∈ enabledMethods(user.country)` |

#### Policies

| ID                  | Concept     | Feature                                                   | Applies To   | Logic                                 |
| ------------------- | ----------- | --------------------------------------------------------- | ------------ | ------------------------------------- |
| payment.RetryPolicy | RetryPolicy | [Payment Processing](features/payment-processing/SPEC.md) | RetryPayment | Decides retry timing and max attempts |

#### Workflows

| ID  | Concept | Feature | Orchestrates | Description |
| --- | ------- | ------- | ------------ | ----------- |
|     |         |         |              |             |

#### Interfaces

| ID                    | Concept       | Feature                                                   | Type            | Exposes                                                            |
| --------------------- | ------------- | --------------------------------------------------------- | --------------- | ------------------------------------------------------------------ |
| payment.PaymentAPI    | PaymentAPI    | [Payment Processing](features/payment-processing/SPEC.md) | External (REST) | ProcessPayment, RefundPayment, GetPaymentStatus, GetPaymentHistory |
| payment.PaymentModule | PaymentModule | [Payment Processing](features/payment-processing/SPEC.md) | Internal        | ProcessPayment, RefundPayment, GetPaymentStatus, GetPaymentHistory |

#### Events

| ID                       | Event            | Feature                                                   | Source                     | Consumers                                 |
| ------------------------ | ---------------- | --------------------------------------------------------- | -------------------------- | ----------------------------------------- |
| payment.PaymentInitiated | PaymentInitiated | [Payment Processing](features/payment-processing/SPEC.md) | ProcessPayment             | AuditLog, FraudDetection                  |
| payment.PaymentCompleted | PaymentCompleted | [Payment Processing](features/payment-processing/SPEC.md) | GatewayConfirm             | Notifications, Order Management, AuditLog |
| payment.PaymentFailed    | PaymentFailed    | [Payment Processing](features/payment-processing/SPEC.md) | GatewayReject / MaxRetries | Order Management, Notifications, AuditLog |
| payment.RefundCompleted  | RefundCompleted  | [Payment Processing](features/payment-processing/SPEC.md) | RefundConfirmed            | Notifications, AuditLog                   |

#### Mappings

| ID                            | Concept               | Feature                                                   | From → To                         | Description                              |
| ----------------------------- | --------------------- | --------------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| payment.RequestToTransaction  | RequestToTransaction  | [Payment Processing](features/payment-processing/SPEC.md) | API Request → PaymentTransaction  | Inbound: REST payload to domain entity   |
| payment.TransactionToResponse | TransactionToResponse | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction → API Response | Outbound: domain entity to REST response |

#### State Machines

| ID                    | Machine       | Feature                                                   | Entity             | States                                                                                                |
| --------------------- | ------------- | --------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| payment.PaymentStatus | PaymentStatus | [Payment Processing](features/payment-processing/SPEC.md) | PaymentTransaction | 8 states (Created, Processing, Completed, Failed, FailedRetryable, Refunding, Refunded, RefundFailed) |

### UI Concepts

#### Pages

| ID  | Route | Feature | Layout | Auth | Permission |
| --- | ----- | ------- | ------ | ---- | ---------- |
|     |       |         |        |      |            |

#### Layouts

| ID  | Layout | Features | Description |
| --- | ------ | -------- | ----------- |
|     |        |          |             |

#### Components

| ID  | Component | Feature | Type | Consumes |
| --- | --------- | ------- | ---- | -------- |
|     |           |         |      |          |

#### View Models

| ID  | View Model | Feature | Derives From | Description |
| --- | ---------- | ------- | ------------ | ----------- |
|     |            |         |              |             |

#### Hooks

| ID  | Hook | Feature | Binding | Cache Key |
| --- | ---- | ------- | ------- | --------- |
|     |      |         |         |           |

#### Forms

| ID  | Form | Feature | Contracts | Fields |
| --- | ---- | ------- | --------- | ------ |
|     |      |         |           |        |

#### Actions

| ID  | Action | Feature | Trigger | Mutates |
| --- | ------ | ------- | ------- | ------- |
|     |        |         |         |         |

#### Guards

| ID  | Guard | Feature | Mirrors | Protects |
| --- | ----- | ------- | ------- | -------- |
|     |       |         |         |          |

#### Bindings

| ID  | Binding | Feature | Endpoint | Direction |
| --- | ------- | ------- | -------- | --------- |
|     |         |         |          |           |

#### Adapters

| ID  | Adapter | Feature | From → To | Description |
| --- | ------- | ------- | --------- | ----------- |
|     |         |         |           |             |

#### State Indicators

| ID  | Indicator | Feature | Reflects | Value Map |
| --- | --------- | ------- | -------- | --------- |
|     |           |         |          |           |

---

## Concept Graph

<!-- Typed edges connecting concepts across the system -->

| From                           | Edge        | To                                             |
| ------------------------------ | ----------- | ---------------------------------------------- |
| User                           | performs    | payment.ProcessPayment                         |
| payment.ProcessPayment         | produces    | payment.PaymentInitiated                       |
| payment.PaymentInitiated       | transitions | payment.PaymentStatus (Created → Processing)   |
| payment.PaymentCompleted       | transitions | payment.PaymentStatus (Processing → Completed) |
| payment.PaymentFailed          | transitions | payment.PaymentStatus (→ Failed)               |
| payment.RefundCompleted        | transitions | payment.PaymentStatus (Refunding → Refunded)   |
| payment.MaxAmountRule          | enforces    | payment.ProcessPayment                         |
| payment.MethodAvailabilityRule | enforces    | payment.ProcessPayment                         |
| payment.FeeCalculation         | calculates  | payment.ProcessPayment                         |
| payment.RetryPolicy            | applies     | payment.RetryPayment                           |
| payment.PaymentAPI             | exposes     | payment.ProcessPayment                         |
| payment.PaymentAPI             | exposes     | payment.RefundPayment                          |
| payment.PaymentAPI             | exposes     | payment.GetPaymentStatus                       |
| payment.PaymentAPI             | exposes     | payment.GetPaymentHistory                      |
| payment.PaymentModule          | exposes     | payment.ProcessPayment                         |
| payment.PaymentModule          | exposes     | payment.GetPaymentStatus                       |
| payment.PaymentTransaction     | contains    | shared.Money                                   |
| payment.GetPaymentStatus       | queries     | payment.PaymentTransaction                     |
| payment.GetPaymentHistory      | queries     | payment.PaymentTransaction                     |
| payment.PaymentTransaction     | emits       | payment.PaymentInitiated                       |
| payment.PaymentTransaction     | emits       | payment.PaymentCompleted                       |
| payment.PaymentTransaction     | emits       | payment.PaymentFailed                          |
| payment.PaymentTransaction     | emits       | payment.RefundCompleted                        |
| payment.RequestToTransaction   | maps        | payment.PaymentTransaction                     |
| payment.TransactionToResponse  | maps        | payment.PaymentTransaction                     |
