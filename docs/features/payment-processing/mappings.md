# Mappings: Payment Processing

## RequestToTransaction

**From:** REST API Request (POST /payments)
**To:** PaymentTransaction Entity (initial creation)
**Direction:** Inbound

### Field Mapping

| Source Field | Target Field    | Transform  | Notes                                              |
| ------------ | --------------- | ---------- | -------------------------------------------------- |
| amount       | amount.value    | direct     | Validated by R1, R2                                |
| currency     | amount.currency | direct     | Validated as ISO 4217                              |
| method       | method          | direct     | Validated by R3                                    |
| order_id     | orderId         | direct     | Validated by R4, R5                                |
| —            | id              | generated  | UUID generated at creation                         |
| —            | userId          | from auth  | Extracted from Bearer token                        |
| —            | status          | default    | Set to `Created`                                   |
| —            | fee             | calculated | Via [FeeCalculation](operations.md#feecalculation) |
| —            | totalCharged    | calculated | amount + fee                                       |
| —            | retryCount      | default    | 0                                                  |
| —            | refundedAmount  | default    | null                                               |
| —            | createdAt       | generated  | Current timestamp                                  |
| —            | updatedAt       | generated  | Current timestamp                                  |

### Validation

| Field    | Validation                       | On Failure           |
| -------- | -------------------------------- | -------------------- |
| amount   | Must be number > 0               | 400 VALIDATION_ERROR |
| currency | Must be valid ISO 4217           | 400 VALIDATION_ERROR |
| method   | Must be valid PaymentMethod enum | 400 VALIDATION_ERROR |
| order_id | Must be non-empty string         | 400 VALIDATION_ERROR |

---

## TransactionToResponse

**From:** PaymentTransaction Entity
**To:** REST API Response
**Direction:** Outbound

### Field Mapping

| Source Field         | Target Field    | Transform | Notes                           |
| -------------------- | --------------- | --------- | ------------------------------- |
| id                   | id              | direct    |                                 |
| status               | status          | lowercase | `Processing` → `"processing"`   |
| amount.value         | amount          | direct    |                                 |
| amount.currency      | currency        | direct    |                                 |
| fee.value            | fee             | direct    |                                 |
| totalCharged.value   | total_charged   | direct    |                                 |
| method               | method          | lowercase | `CREDIT_CARD` → `"credit_card"` |
| gatewayRef           | gateway_ref     | direct    | null if not yet completed       |
| refundedAmount.value | refunded_amount | direct    | null if no refund               |
| createdAt            | created_at      | ISO 8601  | `2026-03-29T14:30:00Z`          |

### Defaults

| Target Field    | Default Value | Condition                                  |
| --------------- | ------------- | ------------------------------------------ |
| gateway_ref     | null          | status != Completed                        |
| refunded_amount | null          | refundedAmount == null                     |
| fee             | null          | status == Created (fee not yet calculated) |
