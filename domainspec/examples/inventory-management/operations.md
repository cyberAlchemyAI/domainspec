# Operations: Inventory Management

## AdjustInventory

**Type:** Operation (mutation)
**Actor:** Admin or System (receiving integration)
**Triggers:** Stock receipt logged, or manual stock correction

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | ProductId | yes | Product to adjust |
| quantity | Quantity | yes | Quantity being added (positive) or written off (negative) |
| costPerUnit | Money | no | Unit cost — required for positive adjustments (receipts) |
| warehouseCode | string | yes | Warehouse where stock is located |
| reason | string | yes | Reason for adjustment (RECEIPT, WRITE_OFF, CORRECTION) |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R1 | Product must exist | `∃ p : p.id == productId` |
| R2 | Quantity must be non-zero | `quantity.value != 0` |
| R3 | Positive adjustment requires cost | `quantity.value > 0 → costPerUnit != null` |
| R4 | Write-off cannot exceed current available stock | `quantity.value < 0 → |quantity.value| <= totalAvailable(productId)` |

### State Transition

- Positive: creates a new `InventoryBatch` with `availableQuantity = quantity`
- Negative: reduces `availableQuantity` of the oldest active batch(es) until `|quantity|` is consumed

### Postconditions

- Stock levels updated for product
- `inventory.StockRestocked` event emitted if positive
- `inventory.StockLow` event emitted if resulting stock level transitions to LowStock or OutOfStock

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R1 violated | NotFoundError | PRODUCT_NOT_FOUND |
| R2 violated | ValidationError | INVALID_QUANTITY |
| R3 violated | ValidationError | COST_REQUIRED_FOR_RECEIPT |
| R4 violated | ValidationError | INSUFFICIENT_STOCK |

---

## ReserveFromBatch

**Type:** Operation (mutation)
**Actor:** System (called internally by AllocateInventoryWorkflow)
**Triggers:** AllocateInventoryWorkflow step 3 — batch selected by AllocationPolicy

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | OrderId | yes | Order requiring the stock |
| batchId | BatchId | yes | Specific batch to reserve from |
| quantity | Quantity | yes | Amount to reserve |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R5 | Batch must exist and belong to correct product | `∃ b : b.id == batchId` |
| R6 | Requested quantity must not exceed available | `quantity.value <= batch.availableQuantity.value` |
| R7 | No duplicate active allocation for same order+product | `¬∃ a : a.orderId == orderId ∧ a.productId == batch.productId ∧ a.status ∈ {Created, Confirmed}` |

### State Transition

`InventoryAllocation: [new] → Created`

### Postconditions

- `InventoryAllocation` created with `status=Created`
- `batch.availableQuantity` decremented by `quantity`
- `inventory.InventoryAllocated` event emitted
- `inventory.StockLow` event emitted if product crosses reorder threshold

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R5 violated | NotFoundError | BATCH_NOT_FOUND |
| R6 violated | ConflictError | INSUFFICIENT_BATCH_QUANTITY |
| R7 violated | ConflictError | DUPLICATE_ALLOCATION |

---

## ReleaseAllocation

**Type:** Operation (mutation)
**Actor:** System (called by Order Management on cancellation)
**Triggers:** Order cancelled or fulfillment workflow compensation path

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| allocationId | AllocationId | yes | Allocation to cancel |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R8 | Allocation must be in Created or Confirmed state | `allocation.status ∈ {Created, Confirmed}` |

### State Transition

`InventoryAllocation: Created/Confirmed → Cancelled`

### Postconditions

- `allocation.status = Cancelled`
- `batch.availableQuantity` restored by `allocation.quantity`
- `inventory.AllocationReleased` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R8 violated | ConflictError | ALLOCATION_NOT_RELEASABLE |

---

## ConfirmFulfillment

**Type:** Operation (mutation)
**Actor:** System (warehouse integration or Order Management)
**Triggers:** Shipment dispatched

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| allocationId | AllocationId | yes | Allocation being fulfilled |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R9 | Allocation must be in Confirmed state | `allocation.status == Confirmed` |

### State Transition

`InventoryAllocation: Confirmed → Fulfilled`

### Postconditions

- `allocation.status = Fulfilled`
- `allocation.fulfilledAt` set to current timestamp
- `inventory.FulfillmentConfirmed` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R9 violated | ConflictError | ALLOCATION_NOT_CONFIRMED |

---

## ReorderPointCalculation

**Type:** Calculation
**Used by:** [AdjustInventory](#adjustinventory), [ReserveFromBatch](#reservefrombatch) — to determine whether to emit `inventory.StockLow`

### Formula

```
reorderPoint = product.reorderThreshold.value

stockLevel(productId) =
  ∑ batch.availableQuantity.value  for all batches where batch.productId == productId

classifyStockLevel(productId) =
  OutOfStock  if stockLevel == 0
  LowStock    if 0 < stockLevel <= reorderPoint
  InStock     if stockLevel > reorderPoint
```

### Properties

| Property | Formal | Description |
|---------|--------|-------------|
| Non-negative | `stockLevel >= 0` | Available stock is never negative |
| Deterministic | `classifyStockLevel(id) == classifyStockLevel(id)` | Same state produces same classification |
| Monotone threshold | `reorderPoint >= 0` | Threshold is always non-negative |
