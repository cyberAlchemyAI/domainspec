# Domain: Payment Processing

## Entities

### PaymentTransaction

A single payment attempt representing the movement of money from a customer to the business. Each transaction tracks its amount, fee, payment method, and moves through a well-defined lifecycle from creation to final resolution.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | TransactionId | yes | Unique identifier (UUID) |
| amount | Money | yes | Requested payment amount |
| fee | Money | yes | Calculated processing fee |
| totalCharged | Money | yes | amount + fee (what the customer pays) |
| method | PaymentMethod | yes | Selected payment method |
| status | PaymentStatus | yes | Current lifecycle state |
| orderId | OrderId | yes | Associated order reference |
| userId | UserId | yes | Customer who initiated payment |
| gatewayRef | string | no | External gateway transaction reference |
| retryCount | integer | yes | Number of retry attempts (default: 0) |
| refundedAmount | Money | no | Total amount refunded (if any) |
| createdAt | DateTime | yes | When transaction was initiated |
| updatedAt | DateTime | yes | Last state change timestamp |

**Lifecycle:** See [PaymentStatus state machine](states.md#paymentstatus)
**Operations:** [ProcessPayment](operations.md#processpayment), [RefundPayment](operations.md#refundpayment), [RetryPayment](operations.md#retrypayment)

---

## Value Objects

### Money

**Shared:** [docs/shared/money.md](../../shared/money.md)

| Field | Type | Constraint |
|-------|------|-----------|
| amount | Decimal | > 0, max 2 decimal places |
| currency | CurrencyCode | ISO 4217 |

**Equality:** Two Money instances are equal if amount AND currency match.

---

## Enums

### PaymentMethod

| Value | Description |
|-------|-------------|
| CREDIT_CARD | Visa, Mastercard, Amex — processed via card gateway |
| BANK_TRANSFER | Direct bank debit — ACH, SEPA, Pix |
| WALLET | Digital wallet — Apple Pay, Google Pay |

### PaymentErrorCode

| Value | Description |
|-------|-------------|
| VALIDATION_ERROR | Input failed rule validation (R1, R2) |
| METHOD_NOT_AVAILABLE | Payment method not enabled for region (R3) |
| INVALID_ORDER_STATE | Order not in awaiting payment state (R4) |
| GATEWAY_TIMEOUT | External gateway did not respond in time |
| GATEWAY_REJECTED | Gateway explicitly declined the transaction |
| REFUND_REJECTED | Gateway declined the refund request |
| MAX_RETRIES_EXCEEDED | Retry limit reached for failed-retryable payment |
