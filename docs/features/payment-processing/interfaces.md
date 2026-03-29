# Interfaces: Payment Processing

## External: Payment API (REST)

### POST /payments

**Exposes:** [ProcessPayment](operations.md#processpayment)
**Auth:** Bearer token (authenticated user)

**Request:**

| Field    | Type   | Required | Maps To                        |
| -------- | ------ | -------- | ------------------------------ |
| amount   | number | yes      | ProcessPayment.amount.value    |
| currency | string | yes      | ProcessPayment.amount.currency |
| method   | string | yes      | ProcessPayment.method          |
| order_id | string | yes      | ProcessPayment.orderId         |

**Responses:**

| Status | Condition            | Body                                                        |
| ------ | -------------------- | ----------------------------------------------------------- |
| 201    | Success              | `{ id, status: "processing", total_charged, fee }`          |
| 400    | R1, R2, R5 violation | `{ error: "validation_error", details: [...] }`             |
| 422    | R3, R4 violation     | `{ error: "business_error", code: "METHOD_NOT_AVAILABLE" }` |
| 401    | No/invalid token     | `{ error: "unauthorized" }`                                 |

### POST /payments/{id}/refund

**Exposes:** [RefundPayment](operations.md#refundpayment)
**Auth:** Bearer token (admin)

**Request:**

| Field    | Type   | Required | Maps To                                       |
| -------- | ------ | -------- | --------------------------------------------- |
| amount   | number | no       | RefundPayment.amount.value (defaults to full) |
| currency | string | no       | RefundPayment.amount.currency                 |
| reason   | string | yes      | RefundPayment.reason                          |

**Responses:**

| Status | Condition             | Body                                                       |
| ------ | --------------------- | ---------------------------------------------------------- |
| 200    | Success               | `{ id, status: "refunding", refund_amount }`               |
| 400    | R7, R8 violation      | `{ error: "validation_error", details: [...] }`            |
| 422    | R6 violation          | `{ error: "business_error", code: "INVALID_ORDER_STATE" }` |
| 404    | Transaction not found | `{ error: "not_found" }`                                   |

### GET /payments/{id}

**Exposes:** [GetPaymentStatus](queries.md#getpaymentstatus)
**Auth:** Bearer token (owner or admin)

**Responses:**

| Status | Condition | Body                                                           |
| ------ | --------- | -------------------------------------------------------------- |
| 200    | Found     | `{ id, status, amount, fee, method, created_at, gateway_ref }` |
| 404    | Not found | `{ error: "not_found" }`                                       |

### GET /payments

**Exposes:** [GetPaymentHistory](queries.md#getpaymenthistory)
**Auth:** Bearer token (authenticated user — sees own payments only)

**Query Parameters:**

| Field    | Type    | Default | Maps To                        |
| -------- | ------- | ------- | ------------------------------ |
| order_id | string  | —       | GetPaymentHistory.orderId      |
| status   | string  | —       | GetPaymentHistory.statusFilter |
| page     | integer | 1       | GetPaymentHistory.page         |
| per_page | integer | 20      | GetPaymentHistory.perPage      |

**Responses:**

| Status | Condition | Body                                     |
| ------ | --------- | ---------------------------------------- |
| 200    | Success   | `{ data: [...], total, page, per_page }` |

---

## Internal: PaymentModule Interface

**Consumers:** OrderModule, NotificationModule, AuditModule

| Method                     | Maps To                                           | Description                      |
| -------------------------- | ------------------------------------------------- | -------------------------------- |
| processPayment(input)      | [ProcessPayment](operations.md#processpayment)    | Initiate a payment transaction   |
| refundPayment(input)       | [RefundPayment](operations.md#refundpayment)      | Initiate a refund                |
| getPaymentStatus(txId)     | [GetPaymentStatus](queries.md#getpaymentstatus)   | Check current transaction status |
| getPaymentHistory(filters) | [GetPaymentHistory](queries.md#getpaymenthistory) | List transactions                |
