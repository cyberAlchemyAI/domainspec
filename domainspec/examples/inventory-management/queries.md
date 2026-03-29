# Queries: Inventory Management

## GetProductInventory

**Type:** Query (read-only)
**Actor:** Internal services or Admin

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | ProductId | yes | Product to inspect |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| productId | ProductId | Product.id | Product identifier |
| sku | string | Product.sku.value | Stock-keeping unit |
| name | string | Product.name | Product name |
| totalAvailable | integer | ∑ batch.availableQuantity | Sum of all uncommitted stock |
| stockLevel | StockLevel | derived | Classification via ReorderPointCalculation |
| reorderThreshold | integer | Product.reorderThreshold.value | Below this = LowStock |
| batches | BatchSummary[] | InventoryBatch | Per-batch breakdown |

**BatchSummary shape:**

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| batchId | BatchId | InventoryBatch.id | Batch identifier |
| availableQuantity | integer | InventoryBatch.availableQuantity.value | Uncommitted quantity |
| warehouseCode | string | InventoryBatch.warehouseCode | Warehouse location |
| receivedAt | DateTime | InventoryBatch.receivedAt | Batch receipt date |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| Product | queries | id, sku, name, reorderThreshold |
| InventoryBatch | queries | productId, availableQuantity, warehouseCode, receivedAt |

---

## GetAllocationHistory

**Type:** Query (read-only)
**Actor:** Internal services or Admin

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | ProductId | no | Filter by product |
| orderId | OrderId | no | Filter by order |

_At least one of `productId` or `orderId` must be provided._

### Filters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| status | AllocationStatus | — | Filter by allocation status |
| page | integer | 1 | Page number |
| perPage | integer | 20 | Results per page (max: 100) |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| data | AllocationSummary[] | InventoryAllocation | List of matching allocations |
| total | integer | — | Total matching records |

**AllocationSummary shape:**

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | AllocationId | InventoryAllocation.id | Allocation identifier |
| orderId | OrderId | InventoryAllocation.orderId | Associated order |
| productId | ProductId | InventoryAllocation.productId | Product reserved |
| quantity | integer | InventoryAllocation.quantity.value | Reserved amount |
| status | AllocationStatus | InventoryAllocation.status | Current state |
| createdAt | DateTime | InventoryAllocation.createdAt | When reserved |
| fulfilledAt | DateTime | InventoryAllocation.fulfilledAt | When fulfilled (if applicable) |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| InventoryAllocation | queries | All fields |

---

## ListLowStockProducts

**Type:** Query (read-only)
**Actor:** Admin or Purchasing system

### Input

None required.

### Filters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| stockLevel | StockLevel | LowStock | Filter: `LowStock` or `OutOfStock` (default: both) |
| page | integer | 1 | Page number |
| perPage | integer | 50 | Results per page |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| data | LowStockSummary[] | — | Products at or below threshold |
| total | integer | — | Total count |

**LowStockSummary shape:**

| Field | Type | Description |
|-------|------|-------------|
| productId | ProductId | Product identifier |
| sku | string | SKU code |
| name | string | Product name |
| totalAvailable | integer | Current available quantity |
| reorderThreshold | integer | Minimum threshold |
| stockLevel | StockLevel | LowStock or OutOfStock |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| Product | queries | id, sku, name, reorderThreshold |
| InventoryBatch | queries | productId, availableQuantity |
