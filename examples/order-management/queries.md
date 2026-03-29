# Queries: Order Management

## GetOrderStatus

Retrieves the current status and financial summary for a single order.

**Source:** `order.GetOrderStatus`
**Output Model:** `OrderSummary`

### Inputs

| Field | Type | Required |
|-------|------|----------|
| orderId | OrderId | yes |
| requestedBy | UserId | yes |

### Access Control

| Role | Permission |
|------|-----------|
| Customer | Own orders only — `order.customerId == requestedBy` |
| ADMIN | Any order |

### Output: OrderSummary

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| orderNumber | string | Human-readable reference |
| status | OrderStatus | Current lifecycle state |
| lineItems | LineItemSummary[] | Compact per-item view |
| subtotal | Money | — |
| discount | Money | — |
| tax | Money | — |
| shippingCost | Money | — |
| total | Money | — |
| paymentTransactionId | TransactionId \| null | Present when Paid or beyond |
| trackingNumber | string \| null | Present when Shipped |
| createdAt | DateTime | — |

### LineItemSummary

| Field | Type |
|-------|------|
| productId | ProductId |
| quantity | number |
| lineTotal | Money |
| status | LineItemStatus |

---

## GetOrderHistory

Returns a paginated list of past orders for a customer, ordered by `createdAt` descending.

**Source:** `order.GetOrderHistory`
**Output Model:** `OrderHistoryPage`

### Inputs

| Field | Type | Required | Default |
|-------|------|----------|---------|
| customerId | UserId | yes | — |
| status | OrderStatus \| null | no | null (all) |
| from | DateTime \| null | no | null |
| to | DateTime \| null | no | null |
| limit | number | no | 20 |
| cursor | string \| null | no | null |

### Access Control

Customers may query only their own history. Admin may query any `customerId`.

### Output: OrderHistoryPage

| Field | Type |
|-------|------|
| items | OrderHistoryItem[] |
| nextCursor | string \| null |
| totalCount | number |

### OrderHistoryItem

| Field | Type |
|-------|------|
| orderId | OrderId |
| orderNumber | string |
| status | OrderStatus |
| total | Money |
| itemCount | number |
| createdAt | DateTime |

---

## GetPendingFulfillment

Returns orders that are in `Paid` or `Fulfilling` state and require warehouse action. Used by internal ops dashboards.

**Source:** `order.GetPendingFulfillment`
**Output Model:** `FulfillmentQueue`
**Access:** Admin / ops role only

### Inputs

| Field | Type | Required | Default |
|-------|------|----------|---------|
| warehouseZone | string \| null | no | null (all zones) |
| limit | number | no | 50 |
| cursor | string \| null | no | null |

### Output: FulfillmentQueue

| Field | Type |
|-------|------|
| items | FulfillmentItem[] |
| nextCursor | string \| null |

### FulfillmentItem

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| orderNumber | string | — |
| status | OrderStatus | Either `Paid` or `Fulfilling` |
| lineItems | { productId, quantity, status }[] | Items needing attention |
| shippingAddress | ShippingAddress | — |
| createdAt | DateTime | Useful for age-based prioritisation |
