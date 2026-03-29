# Queries: Payment Processing

## GetPaymentStatus

**Type:** Query (read-only)
**Actor:** Authenticated User (owner) or Admin

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transactionId | TransactionId | yes | Transaction to look up |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | TransactionId | PaymentTransaction.id | Transaction identifier |
| status | PaymentStatus | PaymentTransaction.status | Current lifecycle state |
| amount | Money | PaymentTransaction.amount | Payment amount |
| fee | Money | PaymentTransaction.fee | Processing fee |
| totalCharged | Money | PaymentTransaction.totalCharged | Total charged to customer |
| method | PaymentMethod | PaymentTransaction.method | Payment method used |
| gatewayRef | string | PaymentTransaction.gatewayRef | External reference (if completed) |
| refundedAmount | Money | PaymentTransaction.refundedAmount | Total refunded (if any) |
| createdAt | DateTime | PaymentTransaction.createdAt | When initiated |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| PaymentTransaction | queries | All fields |

### Authorization

- Owner: can view own transactions only (`tx.userId == currentUser.id`)
- Admin: can view any transaction

---

## GetPaymentHistory

**Type:** Query (read-only)
**Actor:** Authenticated User (sees own) or Admin (sees all)

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | UserId | yes | Implicit from auth token |

### Filters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| orderId | OrderId | — | Filter by specific order |
| statusFilter | PaymentStatus | — | Filter by transaction status |
| page | integer | 1 | Page number |
| perPage | integer | 20 | Results per page (max: 100) |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| data | PaymentTransaction[] | — | List of transactions |
| total | integer | — | Total matching transactions |
| page | integer | — | Current page |
| perPage | integer | — | Results per page |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| PaymentTransaction | queries | All fields (filtered by userId) |

### Authorization

- User: `WHERE userId == currentUser.id` (always scoped to own transactions)
- Admin: no userId filter (can see all)
