# Ride Hailing — Domain Model Inventory

**Source:** SD-RideHailing
**Category:** C (System Design Interview Corpus)
**Reference:** https://github.com/donnemartin/system-design-primer (Uber design); https://github.com/karanpratapsingh/system-design
**Extracted:** 2026-04-20
**Confidence:** moderate
**Used in experiments:** E6 (D5), E9 run-2 rerun (CD3)

> Reconstructed from system design interview references. Domain models are implicit in architecture diagrams — concepts and edges were extracted from described data flows. Six bounded contexts with real-time matching, geospatial queries, surge pricing, and a full trip lifecycle saga.

---

## Bounded Contexts

| # | Context | Description | Aggregate Roots | Key Events | Persistence |
|---|---------|-------------|-----------------|------------|-------------|
| 1 | **Driver Management** | Manages driver profiles, availability status, ratings, earnings, and compliance. | Driver | DriverActivated, DriverDeactivated, DriverRated | SQL + geospatial index |
| 2 | **Matching** | Proximity-based driver-rider matching with rating and surge awareness. | Match | DriverMatched, DriverAssigned | In-memory + geospatial |
| 3 | **Trip Lifecycle** | Manages trip state from request through completion: requested→matched→in-progress→completed. | Trip | TripStarted, TripCompleted | Event-sourced |
| 4 | **Pricing** | Computes fare estimates and final fares using distance, time, surge, and demand. | FareEstimate, FinalFare | SurgeActivated | Calculation service |
| 5 | **Payments** | Processes rider charges, driver payouts, and platform fees. | Payment, DriverPayout | PaymentProcessed, PaymentFailed | Payment gateway |
| 6 | **Ratings** | Collects and aggregates rider/driver ratings post-trip. | Rating, DriverRatingAggregate | DriverRated, RiderRated | SQL |

## Concept Inventory

| Concept | Meta-Type | Primary BC | Source Reference |
|---------|-----------|-----------|-----------------|
| FareEstimate | Calculation | Trip Lifecycle | karanpratapsingh; pricing→trip data flow |
| FinalFare | Calculation | Pricing | karanpratapsingh; pricing→payment fare handoff |
| DriverAssigned | Event | Matching | system-design-primer; matching→driver status update |
| DriverMatched | Event | Matching | system-design-primer; Uber matching→trip flow |
| DriverRated | Event | Ratings | karanpratapsingh; rating threshold triggers driver compliance review |
| PaymentProcessed | Event | Payments | karanpratapsingh; payment→rating flow |
| TripCompleted | Event | Trip Lifecycle | karanpratapsingh; trip→payment flow |
| MinDriverRatingRule | Rule | Driver Management | karanpratapsingh; driver quality enforcement |
| TripSaga | Saga | Request | system-design-primer; full ride lifecycle orchestration with compensation |
| DriverAvailability | Value Object | Matching | system-design-primer; driver pool for proximity-based matching |
| DriverPayout | Value Object | Payments | karanpratapsingh; payment→driver earnings |
| DriverRating | Value Object | Matching | system-design-primer; rating-based matching |
| DriverRatingAggregate | Value Object | Ratings | karanpratapsingh; rating→driver profile update |
| SurgeMultiplier | Value Object | Pricing | karanpratapsingh; supply/demand-based surge pricing |
| TripRoute | Value Object | Trip Lifecycle | karanpratapsingh; actual route→final fare calculation |

## Cross-Context Edges

| # | Edge ID | Source BC | Target BC | Concept | Type | Edge Type | Pattern | Orig Status |
|---|---------|----------|-----------|---------|------|-----------|---------|-------------|
| 1 | CD3-E01 | Matching | Driver Management | DriverAvailability | Value Object | references | P2-entity-reference | works |
| 2 | CD3-E02 | Matching | Trip Lifecycle | DriverMatched | Event | triggers-cross | P3-event-trigger | broken |
| 3 | CD3-E03 | Trip Lifecycle | Payments | TripCompleted | Event | triggers-cross | P3-event-trigger | broken |
| 4 | CD3-E04 | Payments | Ratings | PaymentProcessed | Event | triggers-cross | P3-event-trigger | broken |
| 5 | CD3-E05 | Trip Lifecycle | Pricing | FareEstimate | Calculation | references | P2-entity-reference | works |
| 6 | CD3-E06 | Pricing | Payments | FinalFare | Calculation | produces-for | P1-data-handoff | strained |
| 7 | CD3-E07 | Ratings | Driver Management | DriverRatingAggregate | Value Object | produces-for | P1-data-handoff | strained |
| 8 | CD3-E08 | Matching | Driver Management | DriverRating | Value Object | references | P2-entity-reference | works |
| 9 | CD3-E09 | Driver Management | Matching | MinDriverRatingRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 10 | CD3-E10 | Trip Lifecycle | Driver Management | TripCompleted | Event | triggers-cross | P3-event-trigger | broken |
| 11 | CD3-E11 | Matching | Driver Management | DriverAssigned | Event | triggers-cross | P3-event-trigger | broken |
| 12 | CD3-E12 | Pricing | Driver Management | SurgeMultiplier | Value Object | references | P2-entity-reference | works |
| 13 | CD3-E13 | Request+Match+Trip+Pay+Rate | Request+Match+Trip+Pay+Rate | TripSaga | Saga | orchestrates | P4-saga | broken |
| 14 | CD3-E14 | Trip Lifecycle | Pricing | TripRoute | Value Object | produces-for | P1-data-handoff | strained |
| 15 | CD3-E15 | Payments | Driver Management | DriverPayout | Value Object | produces-for | P1-data-handoff | strained |
| 16 | CD3-E16 | Ratings | Driver Management | DriverRated | Event | triggers-cross | P3-event-trigger | broken |

## Composition Patterns Exercised

| Pattern | Present? | Edge Count |
|---------|:--------:|----------:|
| P1-data-handoff | ✅ | 4 |
| P2-entity-reference | ✅ | 4 |
| P3-event-trigger | ✅ | 6 |
| P4-saga | ✅ | 1 |
| P5-cross-enforcement | ✅ | 1 |
| P6-shared-context | — | 0 |

## Meta-Type Coverage

| Meta-Type | Count | BCs |
|-----------|------:|-----|
| Value Object | 6 | Matching, Payments, Pricing, Ratings, Trip Lifecycle |
| Event | 5 | Matching, Payments, Ratings, Trip Lifecycle |
| Calculation | 2 | Pricing, Trip Lifecycle |
| Rule | 1 | Driver Management |
| Saga | 1 | Request |
