# Events: Payment Processing

## PaymentInitiated

**Produced by:** [ProcessPayment](operations.md#processpayment)
**Triggers transition:** [Created → Processing](states.md#paymentstatus)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| transactionId | TransactionId | The payment being processed |
| amount | Money | Amount being charged |
| fee | Money | Calculated processing fee |
| method | PaymentMethod | Payment method selected |
| orderId | OrderId | Associated order |
| userId | UserId | Customer identity |
| timestamp | DateTime | When initiated |

### Consumed by

| Consumer | Action |
|----------|--------|
| AuditLog | Record payment attempt with full details |
| FraudDetection | Score transaction risk in real-time |

---

## PaymentCompleted

**Produced by:** Gateway confirmation handler
**Triggers transition:** [Processing → Completed](states.md#paymentstatus)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| transactionId | TransactionId | The completed payment |
| amount | Money | Amount charged |
| fee | Money | Processing fee |
| totalCharged | Money | Total amount debited from customer |
| gatewayRef | string | External gateway reference |
| orderId | OrderId | Associated order |
| timestamp | DateTime | When confirmed |

### Consumed by

| Consumer | Action |
|----------|--------|
| Notifications | Send payment confirmation email to customer |
| Order Management | Advance order to fulfillment stage |
| AuditLog | Record successful payment |

---

## PaymentFailed

**Produced by:** Gateway rejection or max retries exceeded
**Triggers transition:** [Processing → Failed](states.md#paymentstatus) or [FailedRetryable → Failed](states.md#paymentstatus)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| transactionId | TransactionId | The failed payment |
| amount | Money | Amount that was attempted |
| reason | string | Human-readable failure reason |
| errorCode | PaymentErrorCode | Machine-readable error classification |
| orderId | OrderId | Associated order |
| retryCount | integer | How many retries were attempted |
| timestamp | DateTime | When final failure occurred |

### Consumed by

| Consumer | Action |
|----------|--------|
| Order Management | Mark order as payment failed |
| Notifications | Send payment failure notification to customer |
| AuditLog | Record failed payment with reason |

---

## RefundCompleted

**Produced by:** Gateway refund confirmation handler
**Triggers transition:** [Refunding → Refunded](states.md#paymentstatus)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| transactionId | TransactionId | The refunded payment |
| refundAmount | Money | Amount refunded |
| totalRefunded | Money | Cumulative refunded amount |
| reason | string | Reason for refund |
| orderId | OrderId | Associated order |
| timestamp | DateTime | When refund confirmed |

### Consumed by

| Consumer | Action |
|----------|--------|
| Notifications | Send refund confirmation to customer |
| AuditLog | Record refund with amount and reason |
