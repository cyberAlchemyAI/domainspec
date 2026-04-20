# Ecommerce Platform — Domain Model Inventory

**Source:** GH-eShopOnContainers
**Category:** A (Reference Implementation)
**Reference:** https://github.com/dotnet/eShop (successor); https://github.com/dotnet-architecture/eShopOnContainers (archived)
**Extracted:** 2026-04-20
**Confidence:** high
**Used in experiments:** E6 (D9-A), E9 run-2 rerun (CD4)

> Microsoft's reference .NET architecture for e-commerce. Six bounded contexts with a classic order fulfillment saga (basket→order→payment→shipping), integration events via RabbitMQ/Azure Service Bus, and CQRS in the ordering context. The archived eShopOnContainers and current dotnet/eShop are architecturally equivalent.

---

## Bounded Contexts

| # | Context | Description | Aggregate Roots | Key Events | Persistence |
|---|---------|-------------|-----------------|------------|-------------|
| 1 | **Catalog** | Product catalog with inventory management, pricing, and stock tracking. | Product, CatalogItem | ProductPriceChanged, StockDepleted | SQL + Redis cache |
| 2 | **Basket** | Shopping cart management with product references and quantity tracking. | BasketItem | BasketCheckout | Redis |
| 3 | **Ordering** | Order lifecycle management: placed→confirmed→shipped→delivered. | Order, OrderItem | OrderPlaced, OrderConfirmed, OrderCancelled | SQL + Event Bus |
| 4 | **Payment** | Payment processing, confirmation, and failure handling. | Payment | PaymentConfirmed, PaymentFailed | Payment gateway |
| 5 | **Shipping** | Shipment creation, tracking, and delivery confirmation. | Shipment | ShipmentCreated, ShipmentDelivered | SQL |
| 6 | **Identity** | Customer identity, authentication, and profile management. | Customer, UserProfile | CustomerRegistered | ASP.NET Identity |

## Concept Inventory

| Concept | Meta-Type | Primary BC | Source Reference |
|---------|-----------|-----------|-----------------|
| Customer | Entity | Identity | eShopOnContainers; identity provision across contexts |
| Product | Entity | Ordering | eShopOnContainers; catalog→ordering product reference |
| BasketCheckout | Event | Basket | eShopOnContainers; basket→ordering checkout trigger |
| OrderCancelled | Event | Ordering | eShopOnContainers; cancellation compensation flow |
| OrderConfirmed | Event | Ordering | eShopOnContainers; ordering→shipping trigger |
| OrderPlaced | Event | Ordering | eShopOnContainers; ordering→payment trigger |
| PaymentConfirmed | Event | Payment | eShopOnContainers; payment→ordering confirmation |
| PaymentFailed | Event | Payment | eShopOnContainers; payment failure compensation flow |
| ShipmentDelivered | Event | Shipping | eShopOnContainers; shipping→ordering delivery confirmation |
| StockReservation | Operation | Ordering | eShopOnContainers; inventory reservation across contexts |
| PriceValidationRule | Rule | Catalog | eShopOnContainers; price consistency enforcement |
| StockAvailabilityRule | Rule | Catalog | eShopOnContainers; stock constraint enforcement |
| OrderFulfillmentSaga | Saga | Basket | eShopOnContainers; order fulfillment saga with compensation steps |
| BasketItems | Value Object | Basket | eShopOnContainers; basket→order data transfer |
| ShippingAddress | Value Object | Ordering | eShopOnContainers; order→shipping data handoff |

## Cross-Context Edges

| # | Edge ID | Source BC | Target BC | Concept | Type | Edge Type | Pattern | Orig Status |
|---|---------|----------|-----------|---------|------|-----------|---------|-------------|
| 1 | CD4-E01 | Ordering | Catalog | Product | Entity | references | P2-entity-reference | works |
| 2 | CD4-E02 | Basket | Catalog | Product | Entity | references | P2-entity-reference | works |
| 3 | CD4-E03 | Basket | Ordering | BasketCheckout | Event | triggers-cross | P3-event-trigger | broken |
| 4 | CD4-E04 | Ordering | Payment | OrderPlaced | Event | triggers-cross | P3-event-trigger | broken |
| 5 | CD4-E05 | Payment | Ordering | PaymentConfirmed | Event | triggers-cross | P3-event-trigger | broken |
| 6 | CD4-E06 | Ordering | Shipping | OrderConfirmed | Event | triggers-cross | P3-event-trigger | broken |
| 7 | CD4-E07 | Ordering | Catalog | StockReservation | Operation | produces-for | P1-data-handoff | strained |
| 8 | CD4-E08 | Shipping | Ordering | ShipmentDelivered | Event | triggers-cross | P3-event-trigger | broken |
| 9 | CD4-E09 | Identity | Ordering+Basket+Payment | Customer | Entity | references | P6-shared-context | works |
| 10 | CD4-E10 | Payment | Ordering | PaymentFailed | Event | triggers-cross | P3-event-trigger | broken |
| 11 | CD4-E11 | Ordering | Catalog | OrderCancelled | Event | triggers-cross | P3-event-trigger | broken |
| 12 | CD4-E12 | Basket+Ordering+Payment+Shipping | Basket+Ordering+Payment+Shipping | OrderFulfillmentSaga | Saga | orchestrates | P4-saga | broken |
| 13 | CD4-E13 | Catalog | Ordering | PriceValidationRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 14 | CD4-E14 | Ordering | Shipping | ShippingAddress | Value Object | produces-for | P1-data-handoff | strained |
| 15 | CD4-E15 | Basket | Ordering | BasketItems | Value Object | produces-for | P1-data-handoff | strained |
| 16 | CD4-E16 | Catalog | Basket | StockAvailabilityRule | Rule | enforces-cross | P5-cross-enforcement | strained |

## Composition Patterns Exercised

| Pattern | Present? | Edge Count |
|---------|:--------:|----------:|
| P1-data-handoff | ✅ | 3 |
| P2-entity-reference | ✅ | 2 |
| P3-event-trigger | ✅ | 7 |
| P4-saga | ✅ | 1 |
| P5-cross-enforcement | ✅ | 2 |
| P6-shared-context | ✅ | 1 |

## Meta-Type Coverage

| Meta-Type | Count | BCs |
|-----------|------:|-----|
| Event | 7 | Basket, Ordering, Payment, Shipping |
| Entity | 2 | Identity, Ordering |
| Rule | 2 | Catalog |
| Value Object | 2 | Basket, Ordering |
| Operation | 1 | Ordering |
| Saga | 1 | Basket |
