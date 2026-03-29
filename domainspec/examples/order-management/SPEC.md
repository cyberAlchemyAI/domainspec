# Order Management

## Overview

Order Management orchestrates the full customer purchase journey — from cart submission through payment, stock allocation, shipment, and delivery. It is the capstone feature that ties together User Account, Payment Processing, and Inventory Management into a single coherent saga.

This feature owns the Order and LineItem entities with their state machines, and coordinates their progression through an `OrderFulfillmentSaga` that calls operations across multiple modules. If any step after payment fails, the saga compensates in reverse: releasing inventory, refunding the payment, and returning the order to a clean failed state. This makes the failure path as well-documented as the happy path.

## Concepts

| Concept | ID | Type | Description |
|---------|----|------|-------------|
| [Order](domain.md#order) | order.Order | Entity | A customer purchase containing one or more line items |
| [LineItem](domain.md#lineitem) | order.LineItem | Entity | A single product + quantity entry within an order |
| [ShippingAddress](domain.md#shippingaddress) | order.ShippingAddress | Value Object | Delivery destination with structured address fields |
| [OrderNumber](domain.md#ordernumber) | order.OrderNumber | Value Object | Human-readable unique order reference |
| [OrderStatus](states.md#orderstatus) | order.OrderStatus | State Machine | Order lifecycle: PendingPayment → Paid → Fulfilling → Shipped → Delivered |
| [LineItemStatus](states.md#lineitemstatus) | order.LineItemStatus | State Machine | Line item lifecycle: Pending → Allocated → Shipped → Delivered |
| [CreateOrder](operations.md#createorder) | order.CreateOrder | Operation | Submits a new order from a cart |
| [CancelOrder](operations.md#cancelorder) | order.CancelOrder | Operation | Cancels an order before shipment |
| [ConfirmShipment](operations.md#confirmshipment) | order.ConfirmShipment | Operation | Marks all line items as shipped and order as Shipped |
| [MarkDelivered](operations.md#markdelivered) | order.MarkDelivered | Operation | Closes order lifecycle on confirmed delivery |
| [DiscountCalculation](operations.md#discountcalculation) | order.DiscountCalculation | Calculation | Derives per-item discount amount from tier and quantity |
| [TaxCalculation](operations.md#taxcalculation) | order.TaxCalculation | Calculation | Computes tax based on delivery address |
| [ShippingCostCalculation](operations.md#shippingcostcalculation) | order.ShippingCostCalculation | Calculation | Derives shipping cost from address and total weight |
| [MinimumOrderValueRule](operations.md#minimumordervaluerule) | order.MinimumOrderValueRule | Rule | Order subtotal must exceed minimum value |
| [BackorderEligibilityRule](operations.md#backordereligibilityrule) | order.BackorderEligibilityRule | Rule | Item may only be backordered if product allows it |
| [GetOrderStatus](queries.md#getorderstatus) | order.GetOrderStatus | Query | Current status and summary for an order |
| [GetOrderHistory](queries.md#getorderhistory) | order.GetOrderHistory | Query | List of past orders for a customer |
| [GetPendingFulfillment](queries.md#getpendingfulfillment) | order.GetPendingFulfillment | Query | Orders awaiting warehouse action (admin/ops) |
| [OrderCreated](events.md#ordercreated) | order.OrderCreated | Event | Fired when a new order is submitted |
| [OrderPaid](events.md#orderpaid) | order.OrderPaid | Event | Fired when payment is confirmed for the order |
| [OrderCancelled](events.md#ordercancelled) | order.OrderCancelled | Event | Fired when order is cancelled |
| [OrderShipped](events.md#ordershipped) | order.OrderShipped | Event | Fired when all items leave the warehouse |
| [OrderDelivered](events.md#orderdelivered) | order.OrderDelivered | Event | Fired when delivery is confirmed |
| [OrderFulfillmentFailed](events.md#orderfulfillmentfailed) | order.OrderFulfillmentFailed | Event | Fired when saga compensates after partial failure |
| [OrderAPI](interfaces.md#orderapi-rest) | order.OrderAPI | Interface | External REST API for order operations |
| [OrderModule](interfaces.md#ordermodule-internal) | order.OrderModule | Interface | Internal module contract for downstream consumers |
| [OrderFulfillmentSaga](workflows.md#orderfulfillmentsaga) | order.OrderFulfillmentSaga | Workflow | Orchestrates payment → allocation → shipment with compensation |
| [FulfillmentRoutingPolicy](workflows.md#fulfillmentroutingpolicy) | order.FulfillmentRoutingPolicy | Policy | Determines fulfillment warehouse based on address and stock |
| [OrderRequestToOrder](mappings.md#orderrequesttoorder) | order.OrderRequestToOrder | Mapping | API cart payload → Order + LineItem entities |
| [OrderToInvoice](mappings.md#ordertoinvoice) | order.OrderToInvoice | Mapping | Order → invoice summary DTO |
| [OrderToShippingLabel](mappings.md#ordertoshippinglabel) | order.OrderToShippingLabel | Mapping | Order + allocation data → shipping label DTO |
| [OrderToNotificationPayload](mappings.md#ordertonotificationpayload) | order.OrderToNotificationPayload | Mapping | Order → notification system payload |

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
| User Account | uses | Resolve customer identity; enforce active account |
| Payment Processing | uses | Charge and refund payments (via PaymentModule) |
| Inventory Management | uses | Allocate and release stock (via InventoryModule) |

## Produces For

| Consumer | Via | What |
|----------|-----|------|
| Notifications | Event: order.OrderCreated | Send order confirmation email |
| Notifications | Event: order.OrderShipped | Send shipping notification |
| Notifications | Event: order.OrderDelivered | Send delivery confirmation |
| Notifications | Event: order.OrderCancelled | Send cancellation notice |
| Notifications | Event: order.OrderFulfillmentFailed | Alert customer to fulfillment issue |
| Audit Log | Event: order.OrderPaid | Record payment linkage to order |
| Audit Log | Event: order.OrderShipped | Record dispatch |
