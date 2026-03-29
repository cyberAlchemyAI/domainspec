# Interfaces: Inventory Management

## Internal: Inventory API (REST)

### POST /inventory/allocate

**Exposes:** [AllocateInventoryWorkflow](workflows.md#allocateinventoryworkflow)
**Auth:** Internal service (API key or service token)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| order_id | string | yes | AllocateInventoryWorkflow input: orderId |
| product_id | string | yes | AllocateInventoryWorkflow input: productId |
| quantity | integer | yes | AllocateInventoryWorkflow input: quantity.value |
| unit | string | yes | AllocateInventoryWorkflow input: quantity.unit |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 201 | Allocation created | `{ allocation_id, batch_id, status: "created" }` |
| 409 | R6, R7 violated | `{ error: "conflict", code: "INSUFFICIENT_STOCK" }` |
| 404 | Product not found | `{ error: "not_found" }` |

---

### DELETE /inventory/allocations/{id}

**Exposes:** [ReleaseAllocation](operations.md#releaseallocation)
**Auth:** Internal service

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Released | `{ allocation_id, status: "cancelled" }` |
| 409 | R8 violated | `{ error: "conflict", code: "ALLOCATION_NOT_RELEASABLE" }` |
| 404 | Allocation not found | `{ error: "not_found" }` |

---

### POST /inventory/allocations/{id}/fulfill

**Exposes:** [ConfirmFulfillment](operations.md#confirmfulfillment)
**Auth:** Internal service

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Fulfilled | `{ allocation_id, status: "fulfilled", fulfilled_at }` |
| 409 | R9 violated | `{ error: "conflict", code: "ALLOCATION_NOT_CONFIRMED" }` |

---

### POST /inventory/adjust

**Exposes:** [AdjustInventory](operations.md#adjustinventory)
**Auth:** Bearer token (admin only)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| product_id | string | yes | AdjustInventory.productId |
| quantity | integer | yes | AdjustInventory.quantity.value — negative for write-offs |
| unit | string | yes | AdjustInventory.quantity.unit |
| cost_per_unit | number | no | AdjustInventory.costPerUnit.amount |
| warehouse_code | string | yes | AdjustInventory.warehouseCode |
| reason | string | yes | AdjustInventory.reason |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Adjusted | `{ product_id, total_available, stock_level }` |
| 400 | R2, R3 violated | `{ error: "validation_error", details: [...] }` |
| 409 | R4 violated | `{ error: "conflict", code: "INSUFFICIENT_STOCK" }` |

---

### GET /inventory/products/{id}

**Exposes:** [GetProductInventory](queries.md#getproductinventory)
**Auth:** Internal service or Admin

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Found | `{ product_id, sku, name, total_available, stock_level, reorder_threshold, batches: [...] }` |
| 404 | Not found | `{ error: "not_found" }` |

---

### GET /inventory/low-stock

**Exposes:** [ListLowStockProducts](queries.md#listlowstockproducts)
**Auth:** Admin or Purchasing service

**Query Parameters:**

| Field | Type | Default | Maps To |
|-------|------|---------|---------|
| stock_level | string | — | ListLowStockProducts.stockLevel |
| page | integer | 1 | ListLowStockProducts.page |
| per_page | integer | 50 | ListLowStockProducts.perPage |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Success | `{ data: [...], total, page, per_page }` |

---

## Internal: InventoryModule Interface

**Consumers:** Order Management (primary consumer)

| Method | Maps To | Description |
|--------|---------|-------------|
| `allocate(orderId, productId, quantity)` | [AllocateInventoryWorkflow](workflows.md#allocateinventoryworkflow) | Reserve stock for an order |
| `release(allocationId)` | [ReleaseAllocation](operations.md#releaseallocation) | Cancel a reservation |
| `confirmFulfillment(allocationId)` | [ConfirmFulfillment](operations.md#confirmfulfillment) | Mark allocation as shipped |
| `getProductInventory(productId)` | [GetProductInventory](queries.md#getproductinventory) | Check current stock levels |
