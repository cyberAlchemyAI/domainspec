# Payment Processing

## Overview

Payment Processing handles the lifecycle of financial transactions within the system. When a customer completes a purchase, this feature initiates the payment, coordinates with external payment gateways, tracks the transaction through its lifecycle (processing, completion, failure, refund), and emits events that downstream features consume.

The feature enforces business rules around payment limits, method availability per region, and fee calculations. It owns the complete state machine for payment transactions — from creation through final resolution (completed, failed, or refunded).

## Concepts

| Concept                                                    | ID                             | Type          | Description                                                    |
| ---------------------------------------------------------- | ------------------------------ | ------------- | -------------------------------------------------------------- |
| [PaymentTransaction](domain.md#paymenttransaction)         | payment.PaymentTransaction     | Entity        | A single payment attempt with amount, method, and lifecycle    |
| [Money](../shared/money.md#money)                          | shared.Money                   | Value Object  | Amount + currency pair                                         |
| [PaymentMethod](domain.md#paymentmethod)                   | payment.PaymentMethod          | Enum          | How the user pays (credit card, bank transfer, wallet)         |
| [PaymentStatus](states.md#paymentstatus)                   | payment.PaymentStatus          | State Machine | Transaction lifecycle: Created → Processing → Completed/Failed |
| [ProcessPayment](operations.md#processpayment)             | payment.ProcessPayment         | Operation     | Initiates a payment transaction                                |
| [RefundPayment](operations.md#refundpayment)               | payment.RefundPayment          | Operation     | Initiates a refund on a completed payment                      |
| [RetryPayment](operations.md#retrypayment)                 | payment.RetryPayment           | Operation     | Retries a failed-retryable payment                             |
| [FeeCalculation](operations.md#feecalculation)             | payment.FeeCalculation         | Calculation   | Computes processing fee based on method and amount             |
| [MaxAmountRule](operations.md)                             | payment.MaxAmountRule          | Rule          | Payment amount must not exceed limit                           |
| [MethodAvailabilityRule](operations.md)                    | payment.MethodAvailabilityRule | Rule          | Payment method must be enabled for user's region               |
| [RetryPolicy](workflows.md#retrypolicy)                    | payment.RetryPolicy            | Policy        | Decides retry timing and max attempts                          |
| [PaymentInitiated](events.md#paymentinitiated)             | payment.PaymentInitiated       | Event         | Fired when payment processing begins                           |
| [PaymentCompleted](events.md#paymentcompleted)             | payment.PaymentCompleted       | Event         | Fired when gateway confirms payment                            |
| [PaymentFailed](events.md#paymentfailed)                   | payment.PaymentFailed          | Event         | Fired when payment permanently fails                           |
| [RefundCompleted](events.md#refundcompleted)               | payment.RefundCompleted        | Event         | Fired when refund is confirmed                                 |
| [GetPaymentStatus](queries.md#getpaymentstatus)            | payment.GetPaymentStatus       | Query         | Retrieve current status of a transaction                       |
| [GetPaymentHistory](queries.md#getpaymenthistory)          | payment.GetPaymentHistory      | Query         | List transactions for a user/order                             |
| [PaymentAPI](interfaces.md#paymentapi-rest)                | payment.PaymentAPI             | Interface     | External REST API for payment operations                       |
| [PaymentModule](interfaces.md#paymentmodule-internal)      | payment.PaymentModule          | Interface     | Internal module interface for other services                   |
| [RequestToTransaction](mappings.md#requesttotransaction)   | payment.RequestToTransaction   | Mapping       | API request → PaymentTransaction entity                        |
| [TransactionToResponse](mappings.md#transactiontoresponse) | payment.TransactionToResponse  | Mapping       | PaymentTransaction → API response                              |

## Feature Concept Graph

| From                           | Edge        | To                         | Evidence                     | Notes                  |
| ------------------------------ | ----------- | -------------------------- | ---------------------------- | ---------------------- |
| payment.MaxAmountRule          | enforces    | payment.ProcessPayment     | operations.md#processpayment | Rule R2 gate           |
| payment.MethodAvailabilityRule | enforces    | payment.ProcessPayment     | operations.md#processpayment | Rule R3 gate           |
| payment.FeeCalculation         | calculates  | payment.ProcessPayment     | operations.md#processpayment | Calculation C1         |
| payment.RetryPolicy            | applies     | payment.RetryPayment       | operations.md#retrypayment   | Retry behavior policy  |
| payment.ProcessPayment         | produces    | payment.PaymentInitiated   | operations.md#processpayment | Postcondition emission |
| payment.GetPaymentStatus       | queries     | payment.PaymentTransaction | queries.md#getpaymentstatus  | Read dependency        |
| payment.GetPaymentHistory      | queries     | payment.PaymentTransaction | queries.md#getpaymenthistory | Read dependency        |
| payment.PaymentAPI             | exposes     | payment.ProcessPayment     | interfaces.md                | External boundary      |
| payment.PaymentModule          | exposes     | payment.GetPaymentStatus   | interfaces.md                | Internal boundary      |
| payment.PaymentTransaction     | contains    | shared.Money               | domain.md#paymenttransaction | Embedded value object  |
| payment.PaymentTransaction     | emits       | payment.PaymentCompleted   | events.md#paymentcompleted   | Entity signal source   |
| payment.PaymentInitiated       | transitions | payment.PaymentStatus      | states.md#paymentstatus      | Created -> Processing  |

## Aspects

- [Domain](domain.md) — Entities, value objects, enums
- [Operations](operations.md) — Business operations, rules, calculations
- [States](states.md) — State machines and transitions
- [Interfaces](interfaces.md) — API contracts (external + internal)
- [Events](events.md) — Domain events
- [Queries](queries.md) — Read models
- [Mappings](mappings.md) — Data transformations
- [Workflows](workflows.md) — Workflows and policies

## Cross-Feature Dependencies

| Depends On       | Relationship | Why                                            |
| ---------------- | ------------ | ---------------------------------------------- |
| User Management  | uses         | Customer identity and region for payment rules |
| Order Management | uses         | Order reference and status validation          |

## Produces For

| Consumer         | Via                             | What                                |
| ---------------- | ------------------------------- | ----------------------------------- |
| Notifications    | Event: payment.PaymentCompleted | Triggers payment confirmation email |
| Notifications    | Event: payment.RefundCompleted  | Triggers refund notification        |
| Order Management | Event: payment.PaymentCompleted | Advances order to fulfillment       |
| Order Management | Event: payment.PaymentFailed    | Marks order as payment failed       |
| Audit Log        | Event: payment.PaymentInitiated | Records all payment attempts        |
| Fraud Detection  | Event: payment.PaymentInitiated | Scores transaction risk             |
