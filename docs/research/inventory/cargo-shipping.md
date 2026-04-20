# Cargo Shipping — Domain Model Inventory

**Source:** BOOK-Evans-BlueBook + GH-CargoTracker
**Category:** B+A (DDD Literature + Reference Implementation)
**Reference:** Evans, E. (2003) _Domain-Driven Design_ Ch.7; https://github.com/eclipse-ee4j/cargotracker
**Extracted:** 2026-04-20
**Confidence:** high
**Used in experiments:** E6 (D1), E9 run-1 (poker-team analog), E9 run-2 rerun (CD1)

> The canonical DDD example. Evans' Blue Book Ch.7 defines the strategic design; Eclipse CargoTracker provides a Jakarta EE reference implementation. Five bounded contexts with rich cross-context event chains and a long-running cargo lifecycle saga.

---

## Bounded Contexts

| # | Context | Description | Aggregate Roots | Key Events | Persistence |
|---|---------|-------------|-----------------|------------|-------------|
| 1 | **Booking** | Accepts cargo bookings, assigns route specifications, manages cargo lifecycle. | Cargo | BookingConfirmed, DestinationChanged | JPA/Hibernate |
| 2 | **Routing** | Computes itineraries from route specifications using graph algorithms. | N/A (stateless service) | N/A | External routing service |
| 3 | **Tracking** | Monitors cargo delivery status by correlating handling events against expected itinerary. | Delivery (VO on Cargo) | MisdirectionDetected | Read model |
| 4 | **Handling** | Registers physical handling events (LOAD, UNLOAD, RECEIVE, CLAIM, CUSTOMS). | HandlingEvent | HandlingEventRegistered, CargoClaimed | Event store |
| 5 | **Billing** | Calculates and issues invoices based on cargo routing and handling history. | Invoice | InvoiceIssued | Accounting system |

## Concept Inventory

| Concept | Meta-Type | Primary BC | Source Reference |
|---------|-----------|-----------|-----------------|
| Cargo | Entity | Handling | Evans Blue Book; CargoTracker HandlingEvent references Cargo |
| Voyage | Entity | Booking | Evans Blue Book; Voyage entity shared between Routing and Booking contexts |
| CargoClaimed | Event | Handling | Evans Blue Book; CLAIM handling event completes cargo lifecycle |
| HandlingEvent | Event | Handling | Evans Blue Book Ch.7; CargoTracker HandlingEventRegistrationAttempt→InspectCargo |
| HandlingEventRegistered | Event | Handling | Evans Blue Book; handling events drive cost attribution |
| InvoiceIssued | Event | Billing | Evans Blue Book; billing completion signals in cargo lifecycle |
| MisdirectionDetected | Event | Tracking | Evans Blue Book Ch.7; misdirected cargo triggers corrective action |
| RoutingRequested | Event | Booking | Evans Blue Book; booking→routing trigger flow |
| CargoLifecycleSaga | Saga | Booking | Evans Blue Book; cargo lifecycle spans 4+ bounded contexts with compensation |
| Delivery | Value Object | Tracking | Evans Blue Book Ch.7; CargoTracker Delivery VO recomputed from HandlingHistory |
| DeliveryHistory | Value Object | Billing | Evans Blue Book; billing needs delivery completion status |
| Itinerary | Value Object | Routing | Evans Blue Book Ch.7; CargoTracker assignCargoToRoute |
| RouteSpecification | Value Object | Routing | Evans Blue Book Ch.7; CargoTracker RoutingService reads RouteSpecification |

## Cross-Context Edges

| # | Edge ID | Source BC | Target BC | Concept | Type | Edge Type | Pattern | Orig Status |
|---|---------|----------|-----------|---------|------|-----------|---------|-------------|
| 1 | CD1-E01 | Routing | Booking | RouteSpecification | Value Object | references | P2-entity-reference | works |
| 2 | CD1-E02 | Routing | Booking | Itinerary | Value Object | produces-for | P1-data-handoff | strained |
| 3 | CD1-E03 | Handling | Tracking | HandlingEvent | Event | triggers-cross | P3-event-trigger | broken |
| 4 | CD1-E04 | Tracking | Booking | Delivery | Value Object | produces-for | P1-data-handoff | strained |
| 5 | CD1-E05 | Handling | Booking | Cargo | Entity | references | P2-entity-reference | works |
| 6 | CD1-E06 | Billing | Booking | Cargo | Entity | references | P2-entity-reference | works |
| 7 | CD1-E07 | Tracking | Booking | Itinerary | Value Object | references | P2-entity-reference | works |
| 8 | CD1-E08 | Billing | Tracking | DeliveryHistory | Value Object | references | P2-entity-reference | works |
| 9 | CD1-E09 | Booking+Routing+Handling+Tracking | Booking+Routing+Handling+Tracking | CargoLifecycleSaga | Saga | orchestrates | P4-saga | broken |
| 10 | CD1-E10 | Handling | Booking | CargoClaimed | Event | triggers-cross | P3-event-trigger | broken |
| 11 | CD1-E11 | Tracking | Booking | MisdirectionDetected | Event | triggers-cross | P3-event-trigger | broken |
| 12 | CD1-E12 | Booking | Routing | RoutingRequested | Event | triggers-cross | P3-event-trigger | broken |
| 13 | CD1-E13 | Booking | Routing | Voyage | Entity | references | P2-entity-reference | works |
| 14 | CD1-E14 | Handling | Billing | HandlingEventRegistered | Event | triggers-cross | P3-event-trigger | broken |
| 15 | CD1-E15 | Billing | Booking | InvoiceIssued | Event | triggers-cross | P3-event-trigger | broken |

## Composition Patterns Exercised

| Pattern | Present? | Edge Count |
|---------|:--------:|----------:|
| P1-data-handoff | ✅ | 2 |
| P2-entity-reference | ✅ | 6 |
| P3-event-trigger | ✅ | 6 |
| P4-saga | ✅ | 1 |
| P5-cross-enforcement | — | 0 |
| P6-shared-context | — | 0 |

## Meta-Type Coverage

| Meta-Type | Count | BCs |
|-----------|------:|-----|
| Event | 6 | Billing, Booking, Handling, Tracking |
| Value Object | 4 | Billing, Routing, Tracking |
| Entity | 2 | Booking, Handling |
| Saga | 1 | Booking |
