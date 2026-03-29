# Domain: Inventory Management

## Entities

### Product

A catalogued item that can be stocked, searched, and allocated. Products are the top-level reference for all inventory activity. Stock levels are derived from the sum of active batches.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ProductId | yes | Unique identifier (UUID) |
| sku | SKU | yes | Stock-keeping unit code |
| name | string | yes | Human-readable product name |
| reorderThreshold | Quantity | yes | Minimum stock before StockLow is emitted |
| defaultAllocationMethod | AllocationMethod | yes | Default batch selection strategy |
| createdAt | DateTime | yes | When product was catalogued |

**Operations:** [AdjustInventory](operations.md#adjustinventory)

---

### InventoryBatch

A physical lot of a product received at a point in time. Each batch tracks its own available quantity separately. Batches are created via `AdjustInventory` and consumed by `ReserveFromBatch`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | BatchId | yes | Unique identifier (UUID) |
| productId | ProductId | yes | Product this batch belongs to |
| quantity | Quantity | yes | Total quantity in this batch |
| availableQuantity | Quantity | yes | Remaining uncommitted quantity |
| costPerUnit | Money | yes | Unit cost at time of receipt |
| receivedAt | DateTime | yes | When this batch was logged |
| warehouseCode | string | yes | Physical warehouse identifier |

**Operations:** [ReserveFromBatch](operations.md#reservefrombatch)

---

### InventoryAllocation

A reservation of stock against a specific order. Allocations are created during the `AllocateInventoryWorkflow` and progress through confirmation and fulfillment.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | AllocationId | yes | Unique identifier (UUID) |
| orderId | OrderId | yes | Order this allocation serves |
| productId | ProductId | yes | Product being reserved |
| batchId | BatchId | yes | Specific batch reserved from |
| quantity | Quantity | yes | Amount reserved |
| status | AllocationStatus | yes | Current lifecycle state |
| createdAt | DateTime | yes | When reservation was created |
| fulfilledAt | DateTime | no | When shipment was confirmed |

**Lifecycle:** See [AllocationStatus](states.md#allocationstatus)
**Operations:** [ReserveFromBatch](operations.md#reservefrombatch), [ReleaseAllocation](operations.md#releaseallocation), [ConfirmFulfillment](operations.md#confirmfulfillment)

---

## Value Objects

### Quantity

A non-negative integer representing a countable amount of a product.

| Field | Type | Constraint |
|-------|------|-----------|
| value | integer | ≥ 0 |
| unit | string | e.g., `"units"`, `"kg"`, `"litres"` |

**Equality:** Two Quantity instances are equal if both `value` and `unit` match.

---

### SKU

A unique, human-meaningful product identifier used across systems.

| Field | Type | Constraint |
|-------|------|-----------|
| value | string | Uppercase alphanumeric + hyphens; 4–20 characters; globally unique per product |

**Equality:** Two SKU instances are equal if their `value` strings match (case-insensitive).

---

## Enums

### StockLevel

| Value | Description |
|-------|-------------|
| InStock | Available quantity exceeds reorder threshold |
| LowStock | Available quantity is at or below reorder threshold but above zero |
| OutOfStock | Zero available quantity across all batches |

### AllocationMethod

| Value | Description |
|-------|-------------|
| FIFO | First-in, first-out — allocate from oldest batch first |
| LIFO | Last-in, first-out — allocate from newest batch first |
| NEAREST | Allocate from the warehouse geographically closest to the delivery address |

### AllocationStatus

| Value | Description |
|-------|-------------|
| Created | Reservation initiated; stock decremented but not yet shipped |
| Confirmed | Reservation acknowledged by warehouse; picking in progress |
| Fulfilled | Stock physically shipped; allocation permanently closed |
| Cancelled | Reservation released; stock returned to batch |
