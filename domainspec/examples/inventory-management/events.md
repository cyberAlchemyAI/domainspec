# Events: Inventory Management

## InventoryAllocated

**Produced by:** [ReserveFromBatch](operations.md#reservefrombatch)
**Triggers transition:** [new] → Created (see [AllocationStatus](states.md#allocationstatus))

### Payload

| Field | Type | Description |
|-------|------|-------------|
| allocationId | AllocationId | Newly created reservation |
| orderId | OrderId | Order this stock is reserved for |
| productId | ProductId | Product reserved |
| batchId | BatchId | Batch the stock was taken from |
| quantity | integer | Amount reserved |
| timestamp | DateTime | When reservation was created |

### Consumed by

| Consumer | Action |
|----------|--------|
| Order Management | Advance order fulfillment — stock confirmed available |
| Audit Log | Record stock reservation for traceability |

---

## AllocationReleased

**Produced by:** [ReleaseAllocation](operations.md#releaseallocation)
**Triggers transition:** [Created/Confirmed → Cancelled](states.md#allocationstatus)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| allocationId | AllocationId | Allocation that was cancelled |
| orderId | OrderId | Order that released the stock |
| productId | ProductId | Product returned |
| quantity | integer | Amount returned to batch |
| timestamp | DateTime | When release occurred |

### Consumed by

| Consumer | Action |
|----------|--------|
| Order Management | Confirm stock is no longer reserved for this order |
| Audit Log | Record stock release |

---

## StockLow

**Produced by:** [AdjustInventory](operations.md#adjustinventory), [ReserveFromBatch](operations.md#reservefrombatch)
**Triggers transition:** none — advisory event, no state machine transition

### Payload

| Field | Type | Description |
|-------|------|-------------|
| productId | ProductId | Product that reached low/zero stock |
| sku | string | SKU for quick identification |
| currentStock | integer | Available quantity after the change |
| reorderThreshold | integer | Product's configured minimum threshold |
| stockLevel | StockLevel | `LowStock` or `OutOfStock` |
| timestamp | DateTime | When the threshold was crossed |

### Consumed by

| Consumer | Action |
|----------|--------|
| Purchasing / Procurement | Trigger reorder review for this product |
| Audit Log | Record stock level alert |

---

## StockRestocked

**Produced by:** [AdjustInventory](operations.md#adjustinventory) (positive adjustment)
**Triggers transition:** none — advisory event

### Payload

| Field | Type | Description |
|-------|------|-------------|
| productId | ProductId | Product that received new stock |
| batchId | BatchId | Newly created batch |
| quantity | integer | Amount added |
| warehouseCode | string | Receiving warehouse |
| timestamp | DateTime | When stock was added |

### Consumed by

| Consumer | Action |
|----------|--------|
| Audit Log | Record stock receipt |

---

## FulfillmentConfirmed

**Produced by:** [ConfirmFulfillment](operations.md#confirmfulfillment)
**Triggers transition:** [Confirmed → Fulfilled](states.md#allocationstatus)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| allocationId | AllocationId | Allocation permanently closed |
| orderId | OrderId | Order that was fulfilled |
| productId | ProductId | Product shipped |
| quantity | integer | Amount shipped |
| fulfilledAt | DateTime | When shipment was confirmed |

### Consumed by

| Consumer | Action |
|----------|--------|
| Order Management | Mark order line item as shipped |
| Audit Log | Record permanent stock decrement |
