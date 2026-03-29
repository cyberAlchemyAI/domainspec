# Inventory Management

## Overview

Inventory Management tracks the availability of products across warehouses and controls how stock is allocated to orders. When an order is placed, this feature ensures the right quantity of the right product is reserved before any shipment is arranged, preventing overselling and enabling accurate fulfillment.

The feature is the first in these examples to introduce Workflow and Policy concepts. The allocation workflow coordinates multiple operations in sequence with a compensation path if any step fails. The allocation policy decides which batch to reserve from when multiple eligible batches exist, making the selection strategy explicit and configurable.

## Concepts

| Concept | ID | Type | Description |
|---------|----|------|-------------|
| [Product](domain.md#product) | inventory.Product | Entity | A catalogued item that can be stocked and allocated |
| [InventoryBatch](domain.md#inventorybatch) | inventory.InventoryBatch | Entity | A specific quantity of a product received at a point in time |
| [InventoryAllocation](domain.md#inventoryallocation) | inventory.InventoryAllocation | Entity | A reservation of stock against a specific order |
| [Quantity](domain.md#quantity) | inventory.Quantity | Value Object | A non-negative integer count with a unit |
| [SKU](domain.md#sku) | inventory.SKU | Value Object | A unique stock-keeping unit identifier |
| [StockLevel](domain.md#stocklevel) | inventory.StockLevel | Enum | In-stock classification: InStock, LowStock, OutOfStock |
| [AllocationMethod](domain.md#allocationmethod) | inventory.AllocationMethod | Enum | Batch selection strategy: FIFO, LIFO, NEAREST |
| [AllocationStatus](states.md#allocationstatus) | inventory.AllocationStatus | State Machine | Allocation lifecycle: Created → Confirmed → Fulfilled / Cancelled |
| [AdjustInventory](operations.md#adjustinventory) | inventory.AdjustInventory | Operation | Manual stock correction (receipt or write-off) |
| [ReserveFromBatch](operations.md#reservefrombatch) | inventory.ReserveFromBatch | Operation | Reserve a quantity from a specific batch |
| [ReleaseAllocation](operations.md#releaseallocation) | inventory.ReleaseAllocation | Operation | Cancel a reservation and return stock |
| [ConfirmFulfillment](operations.md#confirmfulfillment) | inventory.ConfirmFulfillment | Operation | Mark allocation as shipped and decrement permanent stock |
| [ReorderPointCalculation](operations.md#reorderpointcalculation) | inventory.ReorderPointCalculation | Calculation | Compute minimum stock threshold |
| [MinimumStockRule](operations.md) | inventory.MinimumStockRule | Rule | Allocation cannot reduce stock below safety minimum |
| [AllocationQuantityRule](operations.md) | inventory.AllocationQuantityRule | Rule | Allocated quantity must not exceed available batch quantity |
| [GetProductInventory](queries.md#getproductinventory) | inventory.GetProductInventory | Query | Current stock levels for a product |
| [GetAllocationHistory](queries.md#getallocationhistory) | inventory.GetAllocationHistory | Query | Past and active allocations for a product or order |
| [ListLowStockProducts](queries.md#listlowstockproducts) | inventory.ListLowStockProducts | Query | Products at or below reorder threshold |
| [InventoryAllocated](events.md#inventoryallocated) | inventory.InventoryAllocated | Event | Fired when stock is reserved for an order |
| [AllocationReleased](events.md#allocationreleased) | inventory.AllocationReleased | Event | Fired when a reservation is cancelled |
| [StockLow](events.md#stocklow) | inventory.StockLow | Event | Fired when a product falls to LowStock level |
| [StockRestocked](events.md#stockrestocked) | inventory.StockRestocked | Event | Fired when a batch is added via AdjustInventory |
| [FulfillmentConfirmed](events.md#fulfillmentconfirmed) | inventory.FulfillmentConfirmed | Event | Fired when allocation is permanently fulfilled |
| [InventoryAPI](interfaces.md#inventoryapi-rest) | inventory.InventoryAPI | Interface | Internal REST API for stock operations |
| [InventoryModule](interfaces.md#inventorymodule-internal) | inventory.InventoryModule | Interface | Internal module contract for other features |
| [AllocateInventoryWorkflow](workflows.md#allocateinventoryworkflow) | inventory.AllocateInventoryWorkflow | Workflow | Orchestrates stock check, batch selection, and reservation |
| [AllocationPolicy](workflows.md#allocationpolicy) | inventory.AllocationPolicy | Policy | Selects which batch to allocate from based on method |
| [OrderRequestToAllocation](mappings.md#orderrequesttoallocation) | inventory.OrderRequestToAllocation | Mapping | Allocation request → InventoryAllocation entity |
| [AllocationToResponse](mappings.md#allocationtoresponse) | inventory.AllocationToResponse | Mapping | InventoryAllocation → API response |
| [BatchToStockReport](mappings.md#batchtostockreport) | inventory.BatchToStockReport | Mapping | InventoryBatch → stock summary DTO |

## Aspects

- [Domain](domain.md) — Entities, value objects, enums
- [Operations](operations.md) — Business operations, rules, calculations
- [States](states.md) — State machines and transitions
- [Interfaces](interfaces.md) — API contracts (external + internal)
- [Events](events.md) — Domain events
- [Queries](queries.md) — Read models
- [Workflows](workflows.md) — Workflows and policies
- [Mappings](mappings.md) — Data transformations

## Cross-Feature Dependencies

| Depends On | Relationship | Why |
|-----------|-------------|-----|
| User Account | uses | Actor identity and role for admin operations |

## Produces For

| Consumer | Via | What |
|----------|-----|------|
| Order Management | Module: inventory.InventoryModule | Stock allocation and release per order |
| Order Management | Event: inventory.InventoryAllocated | Signals allocation confirmed for order fulfillment |
| Order Management | Event: inventory.AllocationReleased | Signals stock returned (order cancelled) |
| Purchasing / Procurement | Event: inventory.StockLow | Triggers reorder review |
| Audit Log | Event: inventory.FulfillmentConfirmed | Records permanent stock decrements |
