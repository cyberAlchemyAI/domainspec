# Mappings: Inventory Management

## OrderRequestToAllocation

**From:** Internal service request (via InventoryModule or REST)
**To:** InventoryAllocation Entity (initial creation by ReserveFromBatch)
**Direction:** Inbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
|-------------|-------------|-----------|-------|
| order_id / orderId | orderId | direct | Validated: must be non-empty |
| product_id / productId | productId | direct | Validated by R1 |
| quantity | quantity.value | direct | Validated by R6 |
| unit | quantity.unit | direct | |
| — | batchId | selected by AllocationPolicy | Not caller-specified |
| — | id | generated | UUID v4 |
| — | status | default | Always `Created` |
| — | createdAt | generated | Current timestamp |
| — | fulfilledAt | default | null |

### Validation

| Field | Validation | On Failure |
|-------|-----------|------------|
| quantity | Must be integer > 0 | 400 VALIDATION_ERROR |
| product_id | Must reference existing Product | 404 PRODUCT_NOT_FOUND |
| order_id | Must be non-empty string | 400 VALIDATION_ERROR |

---

## AllocationToResponse

**From:** InventoryAllocation Entity
**To:** REST API or internal module response
**Direction:** Outbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
|-------------|-------------|-----------|-------|
| id | allocation_id | direct | |
| orderId | order_id | direct | |
| productId | product_id | direct | |
| batchId | batch_id | direct | |
| quantity.value | quantity | direct | |
| quantity.unit | unit | direct | |
| status | status | lowercase | `Created` → `"created"` |
| createdAt | created_at | ISO 8601 | |
| fulfilledAt | fulfilled_at | ISO 8601 or null | null if not yet fulfilled |

---

## BatchToStockReport

**From:** InventoryBatch Entity (collection per product)
**To:** Stock report summary DTO (used by GetProductInventory)
**Direction:** Outbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
|-------------|-------------|-----------|-------|
| id | batch_id | direct | |
| availableQuantity.value | available_quantity | direct | |
| availableQuantity.unit | unit | direct | |
| costPerUnit.amount | cost_per_unit | direct | |
| costPerUnit.currency | currency | direct | |
| warehouseCode | warehouse_code | direct | |
| receivedAt | received_at | ISO 8601 | |

### Defaults

| Target Field | Default Value | Condition |
|-------------|--------------|-----------|
| cost_per_unit | null | Write-off adjustments may have no cost |
