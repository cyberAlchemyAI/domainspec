# Interfaces: Order Management

## OrderAPI (REST)

External HTTP interface for customer-facing and ops-facing order actions.

**Base Path:** `/orders`

### Endpoints

#### POST /orders

Submit a new order.

| Property | Value |
|----------|-------|
| Operation | [CreateOrder](operations.md#createorder) |
| Auth | Required (customer JWT) |
| Request Body | `CreateOrderRequest` |
| Response 201 | `OrderSummary` |
| Response 400 | Validation errors (R1–R5) |
| Response 409 | MinimumOrderValueRule violation |
| Response 422 | BackorderEligibilityRule violation |

**CreateOrderRequest**
```
{
  lineItems: [{ productId, quantity, unitPrice }],
  shippingAddress: { street, city, state, postalCode, country },
  couponCode?: string
}
```

---

#### DELETE /orders/:orderId

Cancel an order.

| Property | Value |
|----------|-------|
| Operation | [CancelOrder](operations.md#cancelorder) |
| Auth | Required — customer (own order) or ADMIN |
| Request Body | `{ reason?: string }` |
| Response 200 | `{ orderId, status: "Cancelled" }` |
| Response 403 | Not owner or admin |
| Response 409 | Order not in cancellable state (R8) |

---

#### POST /orders/:orderId/ship

Mark all line items shipped and record tracking info.

| Property | Value |
|----------|-------|
| Operation | [ConfirmShipment](operations.md#confirmshipment) |
| Auth | Required — ADMIN or internal service token |
| Request Body | `{ trackingNumber, carrier }` |
| Response 200 | `{ orderId, status: "Shipped", trackingNumber }` |
| Response 409 | Order not in `Fulfilling` state or line items not all Allocated |

---

#### POST /orders/:orderId/deliver

Confirm delivery of an order.

| Property | Value |
|----------|-------|
| Operation | [MarkDelivered](operations.md#markdelivered) |
| Auth | Required — internal service token (courier webhook) or ADMIN |
| Request Body | `{ deliveredAt: DateTime }` |
| Response 200 | `{ orderId, status: "Delivered" }` |
| Response 409 | Order not in `Shipped` state |

---

#### GET /orders/:orderId

Retrieve status and summary for an order.

| Property | Value |
|----------|-------|
| Query | [GetOrderStatus](queries.md#getorderstatus) |
| Auth | Required — customer (own order) or ADMIN |
| Response 200 | `OrderSummary` |
| Response 403 | Not owner or admin |
| Response 404 | Order not found |

---

#### GET /orders

List a customer's order history.

| Property | Value |
|----------|-------|
| Query | [GetOrderHistory](queries.md#getorderhistory) |
| Auth | Required — customer (own history) or ADMIN (any customerId) |
| Query Params | `status?, from?, to?, limit?, cursor?` |
| Response 200 | `OrderHistoryPage` |

---

#### GET /orders/pending-fulfillment

Retrieve orders awaiting warehouse action. Ops/admin use only.

| Property | Value |
|----------|-------|
| Query | [GetPendingFulfillment](queries.md#getpendingfulfillment) |
| Auth | Required — ADMIN or ops service token |
| Query Params | `warehouseZone?, limit?, cursor?` |
| Response 200 | `FulfillmentQueue` |

---

## OrderModule (Internal)

Internal contract for other modules to read order data without going through the REST layer.

```typescript
interface OrderModule {
  /**
   * Returns the current status of an order.
   * Used by Notifications, Audit Log.
   */
  getOrderStatus(orderId: OrderId): Promise<OrderSummary>;

  /**
   * Returns all orders in a given state.
   * Used by warehouse / fulfilment services.
   */
  listOrdersByStatus(status: OrderStatus): Promise<OrderSummary[]>;

  /**
   * Marks an order as FulfillmentFailed from a compensation callback.
   * Called by the saga when all compenstations are complete.
   */
  markFulfillmentFailed(
    orderId: OrderId,
    failedStep: string,
    reason: string,
    compensationsApplied: string[]
  ): Promise<void>;
}
```

**Visibility:** Internal to the monolith — not exposed via the public API gateway.
