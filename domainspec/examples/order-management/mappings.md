# Mappings: Order Management

## OrderRequestToOrder

Transforms the raw API cart payload into an `Order` entity and its associated `LineItem` entities. Applies all pricing calculations inline.

**Source:** `order.OrderRequestToOrder`
**Input:** `CreateOrderRequest` (from [OrderAPI](interfaces.md#orderapi-rest))
**Output:** `{ order: Order, lineItems: LineItem[] }`

### Field Mapping

| Source | Target | Transform |
|--------|--------|-----------|
| `customerId` (resolved from JWT) | `order.customerId` | identity |
| `shippingAddress` | `order.shippingAddress` | identity |
| `lineItems[*].productId` | `lineItem.productId` | identity |
| `lineItems[*].quantity` | `lineItem.quantity` | wrap in `Quantity` value object |
| `lineItems[*].unitPrice` | `lineItem.unitPrice` | wrap in `Money` value object |
| *(calculated)* | `lineItem.discountAmount` | `DiscountCalculation(unitPrice, quantity, customerTier)` |
| *(calculated)* | `lineItem.lineTotal` | `(unitPrice × quantity) − discountAmount` |
| *(derived)* | `order.subtotal` | `Σ lineItem.lineTotal` |
| *(calculated)* | `order.discount` | `Σ lineItem.discountAmount` |
| *(calculated)* | `order.tax` | `TaxCalculation(subtotal − discount, country)` |
| *(calculated)* | `order.shippingCost` | `ShippingCostCalculation(country, totalWeightKg)` |
| *(derived)* | `order.total` | `subtotal − discount + tax + shippingCost` |
| *(generated)* | `order.id` | `UUID.v4()` |
| *(generated)* | `order.orderNumber` | `OrderNumberGenerator.next()` — format `ORD-{YYYY}-{5-digit seq}` |
| *(fixed)* | `order.status` | `OrderStatus.PendingPayment` |
| `lineItem.orderId` | `lineItem.orderId` | from `order.id` |
| *(generated)* | `lineItem.id` | `UUID.v4()` per item |
| *(fixed)* | `lineItem.status` | `LineItemStatus.Pending` |

### Fields Never Set At Creation

| Field | Reason |
|-------|--------|
| `order.paymentTransactionId` | Set by saga Step 1 on PaymentConfirmed |
| `order.trackingNumber` | Set by `ConfirmShipment` |
| `order.carrier` | Set by `ConfirmShipment` |
| `lineItem.allocationId` | Set by saga Step 2 on InventoryAllocated |

---

## OrderToInvoice

Transforms an `Order` into a customer-facing invoice summary suitable for email rendering or PDF generation.

**Source:** `order.OrderToInvoice`
**Input:** `Order` + `LineItem[]`
**Output:** `InvoiceDTO`

### InvoiceDTO

| Target Field | Source | Transform |
|-------------|--------|-----------|
| `invoiceNumber` | `order.orderNumber` | prefix with `INV-` |
| `customerRef` | `order.customerId` | identity (resolved by caller) |
| `issuedAt` | `order.updatedAt` (when Paid) | identity |
| `lineItems` | `order.lineItems` | map to `{ description, qty, unitPrice, lineTotal }` |
| `subtotal` | `order.subtotal` | format as currency string |
| `discount` | `order.discount` | format as currency string |
| `tax` | `order.tax` | format as currency string; include rate label |
| `shippingCost` | `order.shippingCost` | format as currency string |
| `total` | `order.total` | format as currency string |
| `shippingAddress` | `order.shippingAddress` | format as multi-line string |
| `paymentReference` | `order.paymentTransactionId` | identity |

---

## OrderToShippingLabel

Produces a shipping label data structure consumed by the courier integration adapter.

**Source:** `order.OrderToShippingLabel`
**Input:** `Order` + `allocationWarehouseId: WarehouseId`
**Output:** `ShippingLabelDTO`

### ShippingLabelDTO

| Target Field | Source | Transform |
|-------------|--------|-----------|
| `labelRef` | `order.orderNumber` | identity |
| `fromWarehouseId` | `allocationWarehouseId` | identity (resolved by caller) |
| `toAddress` | `order.shippingAddress` | map to courier address format |
| `lineItems` | `order.lineItems` | map to `{ productId, sku, quantity }` |
| `weightKg` | *(derived)* | `Σ(item.weightKg × item.quantity)` — resolved from product catalogue |

---

## OrderToNotificationPayload

Converts an order and an event type into a structured notification payload for the Notifications module.

**Source:** `order.OrderToNotificationPayload`
**Input:** `Order` + `eventType: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'failed'`
**Output:** `NotificationPayload`

### NotificationPayload

| Target Field | Source |
|-------------|--------|
| `recipientId` | `order.customerId` |
| `channel` | `'email'` |
| `templateKey` | `'order_' + eventType` |
| `variables.orderNumber` | `order.orderNumber` |
| `variables.total` | `order.total` formatted as currency string |
| `variables.trackingNumber` | `order.trackingNumber` (if present) |
| `variables.failureReason` | from `OrderFulfillmentFailed` event payload (if `eventType == 'failed'`) |
