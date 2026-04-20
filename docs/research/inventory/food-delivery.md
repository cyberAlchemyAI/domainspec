# Food Delivery — Domain Model Inventory

**Source:** SD-FoodDelivery
**Category:** C (Industry Reference Architecture)
**Reference:** Industry reference architecture (Uber Eats, DoorDash, Deliveroo patterns)
**Extracted:** 2026-04-20
**Confidence:** moderate
**Used in experiments:** E9 run-2 rerun (CD6)

> Three-party marketplace (customer→restaurant→driver) with complex payment settlement, cross-context event chains, and a delivery order saga. Highest original ontology gap rate (87.5%) due to event-heavy integration. Five bounded contexts with the most produces-for edges (5) and triggers-cross edges (7) of all domains.

---

## Bounded Contexts

| # | Context | Description | Aggregate Roots | Key Events | Persistence |
|---|---------|-------------|-----------------|------------|-------------|
| 1 | **Restaurants** | Restaurant profiles, menu management, preparation time estimation, and availability. | Restaurant, Menu | MenuUpdated, RestaurantOpened, RestaurantClosed | SQL + search index |
| 2 | **Order Placement** | Customer order creation, restaurant acceptance/rejection, and order lifecycle. | Order | OrderPlaced, OrderAccepted, OrderRejected | SQL + Event Bus |
| 3 | **Delivery Dispatch** | Driver assignment, route optimization, and delivery tracking with ETA updates. | DeliveryAssignment, DeliveryETA | DriverAssigned, DeliveryCompleted | Geospatial + real-time |
| 4 | **Payments** | Three-party settlement: customer charge, restaurant payout, driver earnings. | Payment, RestaurantPayout, DriverPayout | PaymentProcessed | Payment gateway |
| 5 | **Reviews** | Post-delivery rating and review system for restaurants and drivers. | Review, RestaurantRating, DriverRating | ReviewSubmitted | SQL |

## Concept Inventory

| Concept | Meta-Type | Primary BC | Source Reference |
|---------|-----------|-----------|-----------------|
| PreparationTime | Calculation | Order Placement | Industry reference; prep time estimation |
| Restaurant | Entity | Order Placement | Industry reference; restaurant data for ordering |
| DeliveryCompleted | Event | Delivery Dispatch | Industry reference; delivery→payment trigger |
| DriverAssigned | Event | Delivery Dispatch | Industry reference; dispatch→order status update |
| OrderAccepted | Event | Restaurants | Industry reference; restaurant acceptance flow |
| OrderConfirmed | Event | Order Placement | Industry reference; order→dispatch trigger |
| OrderPlaced | Event | Order Placement | Industry reference; order→restaurant notification |
| OrderRejected | Event | Restaurants | Industry reference; rejection compensation flow |
| PaymentProcessed | Event | Payments | Industry reference; payment→review prompt |
| MenuAvailabilityRule | Rule | Restaurants | Industry reference; menu→order validation |
| DeliveryOrderSaga | Saga | Order | Industry reference; food delivery saga with compensation |
| DeliveryETA | Value Object | Delivery Dispatch | Industry reference; ETA updates to order |
| DriverPayout | Value Object | Payments | Industry reference; payment→driver settlement |
| DriverRating | Value Object | Reviews | Industry reference; rating→driver profile update |
| RestaurantPayout | Value Object | Payments | Industry reference; payment→restaurant settlement |
| RestaurantRating | Value Object | Reviews | Industry reference; rating→restaurant profile update |

## Cross-Context Edges

| # | Edge ID | Source BC | Target BC | Concept | Type | Edge Type | Pattern | Orig Status |
|---|---------|----------|-----------|---------|------|-----------|---------|-------------|
| 1 | CD6-E01 | Order Placement | Restaurants | Restaurant | Entity | references | P2-entity-reference | works |
| 2 | CD6-E02 | Order Placement | Restaurants | OrderPlaced | Event | triggers-cross | P3-event-trigger | broken |
| 3 | CD6-E03 | Restaurants | Order Placement | OrderAccepted | Event | triggers-cross | P3-event-trigger | broken |
| 4 | CD6-E04 | Order Placement | Delivery Dispatch | OrderConfirmed | Event | triggers-cross | P3-event-trigger | broken |
| 5 | CD6-E05 | Delivery Dispatch | Order Placement | DriverAssigned | Event | triggers-cross | P3-event-trigger | broken |
| 6 | CD6-E06 | Delivery Dispatch | Payments | DeliveryCompleted | Event | triggers-cross | P3-event-trigger | broken |
| 7 | CD6-E07 | Payments | Reviews | PaymentProcessed | Event | triggers-cross | P3-event-trigger | broken |
| 8 | CD6-E08 | Reviews | Restaurants | RestaurantRating | Value Object | produces-for | P1-data-handoff | strained |
| 9 | CD6-E09 | Payments | Restaurants | RestaurantPayout | Value Object | produces-for | P1-data-handoff | strained |
| 10 | CD6-E10 | Payments | Delivery Dispatch | DriverPayout | Value Object | produces-for | P1-data-handoff | strained |
| 11 | CD6-E11 | Restaurants | Order Placement | MenuAvailabilityRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 12 | CD6-E12 | Order Placement | Restaurants | PreparationTime | Calculation | references | P2-entity-reference | works |
| 13 | CD6-E13 | Delivery Dispatch | Order Placement | DeliveryETA | Value Object | produces-for | P1-data-handoff | strained |
| 14 | CD6-E14 | Restaurants | Order Placement | OrderRejected | Event | triggers-cross | P3-event-trigger | broken |
| 15 | CD6-E15 | Order+Rest+Dispatch+Pay+Review | Order+Rest+Dispatch+Pay+Review | DeliveryOrderSaga | Saga | orchestrates | P4-saga | broken |
| 16 | CD6-E16 | Reviews | Delivery Dispatch | DriverRating | Value Object | produces-for | P1-data-handoff | strained |

## Composition Patterns Exercised

| Pattern | Present? | Edge Count |
|---------|:--------:|----------:|
| P1-data-handoff | ✅ | 5 |
| P2-entity-reference | ✅ | 2 |
| P3-event-trigger | ✅ | 7 |
| P4-saga | ✅ | 1 |
| P5-cross-enforcement | ✅ | 1 |
| P6-shared-context | — | 0 |

## Meta-Type Coverage

| Meta-Type | Count | BCs |
|-----------|------:|-----|
| Event | 7 | Delivery Dispatch, Order Placement, Payments, Restaurants |
| Value Object | 5 | Delivery Dispatch, Payments, Reviews |
| Entity | 1 | Order Placement |
| Rule | 1 | Restaurants |
| Calculation | 1 | Order Placement |
| Saga | 1 | Order |
