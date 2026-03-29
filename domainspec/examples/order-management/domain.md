# Domain: Order Management

## Entities

### Order

A customer purchase request containing one or more products. An order tracks the total financial summary, delivery destination, and its lifecycle from payment through delivery.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | OrderId | yes | Unique identifier (UUID) |
| orderNumber | OrderNumber | yes | Human-readable reference (e.g., ORD-2026-00042) |
| customerId | UserId | yes | The customer who placed the order |
| status | OrderStatus | yes | Current lifecycle state |
| lineItems | LineItem[] | yes | Products ordered (at least one) |
| shippingAddress | ShippingAddress | yes | Delivery destination |
| subtotal | Money | yes | Sum of line item totals before tax and shipping |
| discount | Money | yes | Total discount applied |
| tax | Money | yes | Calculated tax amount |
| shippingCost | Money | yes | Calculated shipping cost |
| total | Money | yes | subtotal − discount + tax + shippingCost |
| paymentTransactionId | TransactionId | no | Set when payment is confirmed |
| createdAt | DateTime | yes | When order was placed |
| updatedAt | DateTime | yes | Last state change timestamp |

**Lifecycle:** See [OrderStatus](states.md#orderstatus)
**Operations:** [CreateOrder](operations.md#createorder), [CancelOrder](operations.md#cancelorder), [ConfirmShipment](operations.md#confirmshipment), [MarkDelivered](operations.md#markdelivered)

---

### LineItem

A single product-quantity entry within an order. Each line item tracks its own allocation and shipment state independently, which allows partial fulfillment scenarios to be modeled.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | LineItemId | yes | Unique identifier (UUID) |
| orderId | OrderId | yes | Parent order |
| productId | ProductId | yes | Product being ordered |
| quantity | Quantity | yes | Number of units |
| unitPrice | Money | yes | Price per unit at time of order |
| discountAmount | Money | yes | Discount on this line (from DiscountCalculation) |
| lineTotal | Money | yes | (unitPrice × quantity) − discountAmount |
| status | LineItemStatus | yes | Current fulfillment state |
| allocationId | AllocationId | no | Set when stock is reserved |

**Lifecycle:** See [LineItemStatus](states.md#lineitemstatus)

---

## Value Objects

### ShippingAddress

The delivery destination for an order. Used by ShippingCostCalculation and FulfillmentRoutingPolicy.

| Field | Type | Constraint |
|-------|------|-----------|
| street | string | Non-empty; max 200 chars |
| city | string | Non-empty; max 100 chars |
| state | string | Non-empty; max 100 chars |
| postalCode | string | Non-empty; format varies by country |
| country | string | ISO 3166-1 alpha-2 code |

**Equality:** Two ShippingAddress instances are equal if all fields match (case-insensitive for `country`).

---

### OrderNumber

A human-readable, system-generated unique order reference.

| Field | Type | Constraint |
|-------|------|-----------|
| value | string | Format: `ORD-{YYYY}-{5-digit-sequence}`, e.g., `ORD-2026-00042` |

**Equality:** Two OrderNumber instances are equal if their `value` strings match.

---

## Enums

### OrderStatus

| Value | Description |
|-------|-------------|
| PendingPayment | Order placed; awaiting payment confirmation |
| Paid | Payment confirmed; ready for fulfillment |
| Fulfilling | Stock allocated; warehouse picking in progress |
| Shipped | All line items dispatched from warehouse |
| Delivered | Customer confirmed delivery |
| Cancelled | Order cancelled before shipment |
| FulfillmentFailed | Saga compensation triggered; order cannot proceed |

### LineItemStatus

| Value | Description |
|-------|-------------|
| Pending | Awaiting stock allocation |
| Allocated | Stock reserved; awaiting shipment |
| Shipped | Item dispatched from warehouse |
| Delivered | Item delivery confirmed |
| Cancelled | Item removed from fulfillment (order cancelled) |
