# Events: Order Management

## OrderCreated

Fired when a new order is successfully persisted in `PendingPayment` state. This event triggers the `OrderFulfillmentSaga`.

**Source:** `order.OrderCreated`
**Produced By:** [CreateOrder](operations.md#createorder)
**Triggers:** `OrderFulfillmentSaga` (Step 1 — ChargePayment)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| orderNumber | string | Human-readable reference |
| customerId | UserId | Customer who placed the order |
| lineItems | { productId, quantity }[] | Items in the order |
| total | Money | Total amount to be charged |
| shippingAddress | ShippingAddress | Delivery destination |
| createdAt | DateTime | — |

### Consumers

| Consumer | Reaction |
|----------|----------|
| `OrderFulfillmentSaga` | Begin Step 1 — ChargePayment |
| Notifications | Send order confirmation email to customer |
| Audit Log | Record order placement |

---

## OrderPaid

Fired when payment is confirmed and the order transitions to `Paid`.

**Source:** `order.OrderPaid`
**Produced By:** `OrderFulfillmentSaga` Step 1 success
**Transitions:** `OrderStatus: PendingPayment → Paid`

### Payload

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| customerId | UserId | — |
| paymentTransactionId | TransactionId | External payment reference |
| total | Money | Confirmed charge amount |
| paidAt | DateTime | — |

### Consumers

| Consumer | Reaction |
|----------|----------|
| Audit Log | Record successful payment linked to order |

---

## OrderCancelled

Fired when an order is cancelled before reaching the `Shipped` state.

**Source:** `order.OrderCancelled`
**Produced By:** [CancelOrder](operations.md#cancelorder)
**Transitions:** `OrderStatus → Cancelled`

### Payload

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| customerId | UserId | — |
| reason | string \| null | Optional cancellation reason |
| cancelledAt | DateTime | — |

### Consumers

| Consumer | Reaction |
|----------|----------|
| Notifications | Send cancellation confirmation to customer |
| Audit Log | Record cancellation actor and reason |

---

## OrderShipped

Fired when all line items are dispatched and the order transitions to `Shipped`.

**Source:** `order.OrderShipped`
**Produced By:** [ConfirmShipment](operations.md#confirmshipment)
**Transitions:** `OrderStatus: Fulfilling → Shipped`

### Payload

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| customerId | UserId | — |
| trackingNumber | string | Courier tracking reference |
| carrier | string | Courier name |
| shippedAt | DateTime | — |

### Consumers

| Consumer | Reaction |
|----------|----------|
| Notifications | Send shipping notification with tracking link |
| Audit Log | Record dispatch |

---

## OrderDelivered

Fired when delivery is confirmed, closing the order lifecycle.

**Source:** `order.OrderDelivered`
**Produced By:** [MarkDelivered](operations.md#markdelivered)
**Transitions:** `OrderStatus: Shipped → Delivered`

### Payload

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| customerId | UserId | — |
| deliveredAt | DateTime | Confirmed delivery timestamp |

### Consumers

| Consumer | Reaction |
|----------|----------|
| Notifications | Send delivery confirmation to customer |
| Audit Log | Record delivery |

---

## OrderFulfillmentFailed

Fired after the `OrderFulfillmentSaga` exhausts its compensation stack and cannot complete the order.

**Source:** `order.OrderFulfillmentFailed`
**Produced By:** `OrderFulfillmentSaga` (any step failure + compensation complete)
**Transitions:** `OrderStatus → FulfillmentFailed`

### Payload

| Field | Type | Description |
|-------|------|-------------|
| orderId | OrderId | — |
| customerId | UserId | — |
| failedStep | string | Name of the saga step that failed (`ChargePayment`, `AllocateInventory`, `ScheduleShipment`) |
| failureReason | string | Human-readable failure description |
| compensationsApplied | string[] | List of compensations executed (e.g., `RefundPayment`, `ReleaseAllocation`) |
| failedAt | DateTime | — |

### Consumers

| Consumer | Reaction |
|----------|----------|
| Notifications | Alert customer that order could not be completed |
| Audit Log | Record failure and compensation trail |
