# Money

> Shared Value Object — used across multiple features to represent monetary amounts.

## Definition

An immutable pair of a decimal amount and an ISO 4217 currency code. Money is the canonical way to express any monetary value in the system — prices, fees, refunds, balances.

## Fields

| Field    | Type         | Constraint                     | Description         |
| -------- | ------------ | ------------------------------ | ------------------- |
| amount   | Decimal      | > 0, max 2 decimal places      | The monetary value  |
| currency | CurrencyCode | ISO 4217 (e.g., USD, EUR, BRL) | Currency identifier |

## Equality

Two Money instances are equal if and only if `amount` AND `currency` match. Comparing Money with different currencies is a domain error — convert first.

## Validation

| Constraint        | Formal                       | Description                           |
| ----------------- | ---------------------------- | ------------------------------------- |
| Positive amount   | `amount > 0`                 | Zero and negative amounts are invalid |
| Decimal precision | `decimalPlaces(amount) <= 2` | No sub-cent values                    |
| Valid currency    | `currency ∈ ISO_4217`        | Must be a recognized currency code    |

## Operations

| Operation | Formal                                      | Description                             |
| --------- | ------------------------------------------- | --------------------------------------- |
| Add       | `Money(a, c) + Money(b, c) = Money(a+b, c)` | Same currency only                      |
| Subtract  | `Money(a, c) - Money(b, c) = Money(a-b, c)` | Result must be > 0                      |
| Multiply  | `Money(a, c) × n = Money(a×n, c)`           | Scalar multiplication (for fees, taxes) |

## Used By

| Feature                                                      | Entity/Field                      | Usage           |
| ------------------------------------------------------------ | --------------------------------- | --------------- |
| [Payment Processing](../features/payment-processing/SPEC.md) | PaymentTransaction.amount         | Payment amount  |
| [Payment Processing](../features/payment-processing/SPEC.md) | PaymentTransaction.fee            | Processing fee  |
| [Payment Processing](../features/payment-processing/SPEC.md) | PaymentTransaction.refundedAmount | Amount refunded |
