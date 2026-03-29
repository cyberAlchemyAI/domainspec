# Operations: Payment Processing

## ProcessPayment

**Type:** Operation (mutation)
**Actor:** Authenticated User
**Triggers:** User confirms checkout and selects payment method

### Input

| Field   | Type          | Required | Description             |
| ------- | ------------- | -------- | ----------------------- |
| amount  | Money         | yes      | Payment amount          |
| method  | PaymentMethod | yes      | Selected payment method |
| orderId | OrderId       | yes      | Associated order        |

### Rules

| ID  | Rule                        | Formal                                                              |
| --- | --------------------------- | ------------------------------------------------------------------- |
| R1  | Amount must be positive     | `amount.value > 0`                                                  |
| R2  | Amount below maximum        | `amount.value <= 10000`                                             |
| R3  | Method enabled for region   | `method ∈ enabledMethods(user.country)`                             |
| R4  | Order in awaiting payment   | `order.status == AWAITING_PAYMENT`                                  |
| R5  | No duplicate active payment | `¬∃ tx : tx.orderId == orderId ∧ tx.status ∈ {Created, Processing}` |

### Calculations

| ID  | Calculation    | Formula                    | Depends On                        |
| --- | -------------- | -------------------------- | --------------------------------- |
| C1  | Processing fee | `amount × feeRate(method)` | [FeeCalculation](#feecalculation) |
| C2  | Total charged  | `amount + C1`              | C1                                |

### State Transition

`PaymentTransaction: [new] → Created → Processing`

### Postconditions

- PaymentTransaction exists with status=Processing
- Fee and totalCharged stored on transaction record
- `payment.PaymentInitiated` event emitted
- Gateway call initiated asynchronously

### Error States

| Condition         | Result                                   | Error Code           |
| ----------------- | ---------------------------------------- | -------------------- |
| R1 or R2 violated | ValidationError, no state change         | VALIDATION_ERROR     |
| R3 violated       | MethodNotAvailableError, no state change | METHOD_NOT_AVAILABLE |
| R4 violated       | InvalidOrderStateError, no state change  | INVALID_ORDER_STATE  |
| R5 violated       | DuplicatePaymentError, no state change   | VALIDATION_ERROR     |
| Gateway timeout   | PaymentTransaction → FailedRetryable     | GATEWAY_TIMEOUT      |

---

## RefundPayment

**Type:** Operation (mutation)
**Actor:** Admin or System
**Triggers:** Refund requested on a completed payment

### Input

| Field         | Type          | Required | Description                              |
| ------------- | ------------- | -------- | ---------------------------------------- |
| transactionId | TransactionId | yes      | Transaction to refund                    |
| amount        | Money         | no       | Partial refund amount (defaults to full) |
| reason        | string        | yes      | Reason for refund                        |

### Rules

| ID  | Rule                          | Formal                                    |
| --- | ----------------------------- | ----------------------------------------- |
| R6  | Transaction must be completed | `tx.status == Completed`                  |
| R7  | Refund amount ≤ remaining     | `amount <= tx.amount - tx.refundedAmount` |
| R8  | Refund amount positive        | `amount.value > 0`                        |

### Calculations

| ID  | Calculation          | Formula                         | Depends On |
| --- | -------------------- | ------------------------------- | ---------- |
| C3  | Remaining refundable | `tx.amount - tx.refundedAmount` | —          |

### State Transition

`PaymentTransaction: Completed → Refunding`

### Postconditions

- PaymentTransaction status=Refunding
- Refund request sent to gateway
- Event not yet emitted (waits for gateway confirmation)

### Error States

| Condition              | Result                              | Error Code          |
| ---------------------- | ----------------------------------- | ------------------- |
| R6 violated            | Cannot refund non-completed payment | INVALID_ORDER_STATE |
| R7 violated            | Refund exceeds remaining amount     | VALIDATION_ERROR    |
| R8 violated            | Invalid refund amount               | VALIDATION_ERROR    |
| Gateway rejects refund | PaymentTransaction → RefundFailed   | REFUND_REJECTED     |

---

## RetryPayment

**Type:** Operation (mutation)
**Actor:** System (automated)
**Triggers:** Retry timer fires for a FailedRetryable transaction

### Input

| Field         | Type          | Required | Description          |
| ------------- | ------------- | -------- | -------------------- |
| transactionId | TransactionId | yes      | Transaction to retry |

### Rules

| ID  | Rule                                 | Formal                         |
| --- | ------------------------------------ | ------------------------------ |
| R9  | Transaction in FailedRetryable state | `tx.status == FailedRetryable` |
| R10 | Retry count below maximum            | `tx.retryCount < maxRetries`   |

### State Transition

`PaymentTransaction: FailedRetryable → Processing`

### Postconditions

- retryCount incremented
- PaymentTransaction status=Processing
- Gateway call re-initiated

### Error States

| Condition    | Result                      | Error Code           |
| ------------ | --------------------------- | -------------------- |
| R9 violated  | Invalid state for retry     | INVALID_ORDER_STATE  |
| R10 violated | PaymentTransaction → Failed | MAX_RETRIES_EXCEEDED |

---

## FeeCalculation

**Type:** Calculation
**Used by:** [ProcessPayment](#processpayment) (C1)

### Fee Rate Table

| Method        | Fee Rate     | Minimum Fee |
| ------------- | ------------ | ----------- |
| CREDIT_CARD   | 2.9% + $0.30 | $0.50       |
| BANK_TRANSFER | 0.8%         | $0.25       |
| WALLET        | 2.5%         | $0.50       |

### Formula

```
baseFee = amount × rate(method)
fee = max(baseFee, minimumFee(method))
```

### Properties

| Property      | Formal                   | Description                         |
| ------------- | ------------------------ | ----------------------------------- |
| Non-negative  | `fee >= 0`               | Fee is never negative               |
| Bounded       | `fee <= amount`          | Fee cannot exceed payment amount    |
| Deterministic | `fee(a, m) == fee(a, m)` | Same input always produces same fee |
