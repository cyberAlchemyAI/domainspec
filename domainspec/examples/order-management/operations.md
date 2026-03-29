# Operations: Order Management

## CreateOrder

Validates and submits a new order from an API payload. Computes all financial totals and initialises both the Order and its LineItems in PendingPayment state.

**Source:** `order.CreateOrder`
**Emits:** [`order.OrderCreated`](events.md#ordercreated)

### Inputs

| Field | Type | Required |
|-------|------|----------|
| customerId | UserId | yes |
| lineItems | { productId, quantity, unitPrice }[] | yes |
| shippingAddress | ShippingAddress | yes |
| couponCode | string | no |

### Business Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| R1 | Customer must have Active account status | Query `user.GetUser`; reject if not Active |
| R2 | At least one line item must be present | `lineItems.length >= 1` |
| R3 | All quantities must be positive integers | `∀ li : li.quantity > 0` |
| R4 | MinimumOrderValueRule: subtotal must be ≥ monetary minimum | See [MinimumOrderValueRule](#minimumordervaluerule) |
| R5 | BackorderEligibilityRule: if product has `allowBackorder=false`, quantity must be available now | See [BackorderEligibilityRule](#backordereligibilityrule) |

### Calculations Applied

1. `DiscountCalculation` — per line item
2. `TaxCalculation` — on subtotal after discount
3. `ShippingCostCalculation` — based on address and total weight
4. `subtotal = Σ(li.quantity × li.unitPrice - li.discountAmount)`
5. `total = subtotal − discount + tax + shippingCost`

### Effects

- Creates `Order` in `PendingPayment` state with computed totals
- Creates one `LineItem` per input with `status = Pending`
- Emits `order.OrderCreated`

---

## CancelOrder

Cancels an order before it has been shipped. Can be called by the customer (own order) or by ops/admin on any cancellable order.

**Source:** `order.CancelOrder`
**Emits:** [`order.OrderCancelled`](events.md#ordercancelled)

### Inputs

| Field | Type | Required |
|-------|------|----------|
| orderId | OrderId | yes |
| requestedBy | UserId | yes |
| reason | string | no |

### Business Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| R6 | Order must exist | 404 if not found |
| R7 | Requester must be the order's customer, or an admin | Check `user.role == ADMIN` or `order.customerId == requestedBy` |
| R8 | Order must be in a cancellable state | `status ∈ {PendingPayment}` — Paid/Fulfilling orders must use saga compensation path |
| R9 | Already-cancelled orders cannot be cancelled again | `status != Cancelled` |

### Effects

- Transitions `Order.status → Cancelled`
- Transitions all `LineItem.status → Cancelled`
- Emits `order.OrderCancelled`

---

## ConfirmShipment

Records that all items in an order have left the warehouse. Called by the fulfilment system once the final item is dispatched.

**Source:** `order.ConfirmShipment`
**Emits:** [`order.OrderShipped`](events.md#ordershipped)

### Inputs

| Field | Type | Required |
|-------|------|----------|
| orderId | OrderId | yes |
| trackingNumber | string | yes |
| carrier | string | yes |

### Business Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| R10 | Order must be in `Fulfilling` state | Reject with 409 if not |
| R11 | All line items must be in `Allocated` state | Validate `∀ li : li.status == Allocated` |
| R12 | Tracking number must be non-empty | `trackingNumber.trim().length > 0` |

### Effects

- Transitions all `LineItem.status → Shipped`
- Transitions `Order.status → Shipped`
- Stores `trackingNumber` and `carrier` on the order record
- Emits `order.OrderShipped`

---

## MarkDelivered

Closes the order lifecycle by confirming delivery. Called by the delivery courier integration or manually by ops.

**Source:** `order.MarkDelivered`
**Emits:** [`order.OrderDelivered`](events.md#orderdelivered)

### Inputs

| Field | Type | Required |
|-------|------|----------|
| orderId | OrderId | yes |
| deliveredAt | DateTime | yes |

### Business Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| R13 | Order must be in `Shipped` state | Reject with 409 if not |
| R14 | `deliveredAt` must not be before `order.createdAt` | `deliveredAt >= createdAt` |

### Effects

- Transitions all `LineItem.status → Delivered`
- Transitions `Order.status → Delivered`
- Emits `order.OrderDelivered`

---

## Calculations

### DiscountCalculation

Computes the discount amount for a single line item based on the customer's account tier and quantity ordered.

**Source:** `order.DiscountCalculation`

| Property | Value |
|----------|-------|
| Inputs | `unitPrice: Money, quantity: number, customerTier: AccountTier` |
| Output | `discountAmount: Money` |

| Tier | Quantity | Discount Rate |
|------|----------|---------------|
| STANDARD | any | 0% |
| PREMIUM | 1–4 | 5% |
| PREMIUM | 5–9 | 10% |
| PREMIUM | 10+ | 15% |

```
discountAmount = unitPrice × quantity × discountRate
```

---

### TaxCalculation

Computes tax on the discounted subtotal based on the order's delivery country.

**Source:** `order.TaxCalculation`

| Property | Value |
|----------|-------|
| Inputs | `discountedSubtotal: Money, country: string` |
| Output | `taxAmount: Money` |

| Country | Rate |
|---------|------|
| US | 8.875% |
| GB | 20% |
| DE | 19% |
| Other | 0% |

```
taxAmount = discountedSubtotal × taxRate(country)
```

---

### ShippingCostCalculation

Derives shipping cost from destination zone and total order weight.

**Source:** `order.ShippingCostCalculation`

| Property | Value |
|----------|-------|
| Inputs | `country: string, totalWeightKg: number` |
| Output | `shippingCost: Money` |

| Zone | Country | Base | Per-kg |
|------|---------|------|--------|
| Domestic | US | $3.00 | $0.50 |
| EU | GB, DE, FR | $8.00 | $1.00 |
| International | other | $18.00 | $2.50 |

```
shippingCost = base(zone) + totalWeightKg × perKgRate(zone)
```

**Minimum charge:** $3.00

---

## Business Rules (standalone)

### MinimumOrderValueRule

**Source:** `order.MinimumOrderValueRule`

Prevents micro-orders that cost more to process than they return.

| Property | Value |
|----------|-------|
| Applies To | CreateOrder |
| Formula | `subtotal >= minimumOrderValue` |
| minimumOrderValue | $5.00 USD (configurable) |
| Violation | Reject order with `BELOW_MINIMUM_VALUE` error code |

---

### BackorderEligibilityRule

**Source:** `order.BackorderEligibilityRule`

Prevents immediate orders on products that do not support back-ordering when stock is insufficient.

| Property | Value |
|----------|-------|
| Applies To | CreateOrder |
| Check | Query `inventory.GetProductInventory` for each line item |
| Rule | If `product.allowBackorder == false && availableQuantity < requestedQuantity` → reject |
| Violation | Reject line item with `INSUFFICIENT_STOCK` error code |
