# E6: Vocabulary Sufficiency Across Domains

**Status:** ✅ completed (2026-04-20)
**Paper Claim:** C2 — 24 types cover business domains
**Paper Section:** §9.1 (Vocabulary Completeness)
**Priority:** P1 | **Effort:** High
**Results:** [E6-results.md](../results/E6-results.md)
**Raw data:** [E6-run-2026-04-20.jsonl](../data/E6-run-2026-04-20.jsonl)

---

**Claim:** The 24 meta-type vocabulary covers common business domain semantics.

## Rationale

A meta-model that only works for one project is not a meta-model — it's an abstraction of that project. To validate C2 (deterministic derivation from 24 meta-types + 26 relationships), we need evidence that DomainSpec's vocabulary generalizes across diverse business domains. This experiment tests coverage breadth by applying DomainSpec to well-documented domains drawn from DDD canonical literature, system design interview problems, and common enterprise/SaaS verticals.

## Domain Catalog

Domains were sourced from:
- **DDD canonical literature:** Evans "Blue Book" [1], Vernon "Red Book" [2], Wlaschin "Domain Modeling Made Functional" [3]
- **DDD reference implementations:** Eclipse CargoTracker, IDDD Samples, ddd-by-examples/library, eShopOnContainers
- **System design interview corpus:** system-design-primer (343k★), karanpratapsingh/system-design (43k★)
- **Event Modeling workshops:** eventmodeling.org canonical hotel booking domain
- **Enterprise SaaS patterns:** Common bounded contexts from real-world systems (CRM, ERP, LMS, insurance)

### Tier 1 — DDD Canonical Domains (well-documented bounded contexts in published books)

| # | Domain | Source | Key Bounded Contexts | Stress on Vocabulary |
|---|--------|--------|---------------------|---------------------|
| D1 | **Cargo Shipping & Logistics** | Evans Blue Book [1], Eclipse CargoTracker | Booking, Routing, Tracking, Handling, Billing | Workflow-heavy, itinerary as Value Object graph, carrier movement as Event sequence |
| D2 | **Collaboration & Agile PM** | Vernon IDDD [2], IDDD_Samples | Identity & Access, Collaboration (Forums, Discussions), Agile PM (Products, Sprints, Backlog Items) | Multi-tenant, permission hierarchy, aggregate cross-references |
| D3 | **Order-Taking Pipeline** | Wlaschin [3] | Order placement, Pricing, Fulfillment | Functional workflow decomposition, type-driven design, algebraic types |
| D4 | **Library Management** | ddd-by-examples/library | Catalogue, Lending, Patron Profiles, Holds, Fees | Policy-heavy (lending rules), state machines (book availability), time-based constraints |

### Tier 2 — System Design Interview Domains (well-documented architecture with rich domain models)

| # | Domain | Source | Key Features | Stress on Vocabulary |
|---|--------|--------|-------------|---------------------|
| D5 | **Ride-Hailing (Uber)** | system-design-primer, karanpratapsingh | Driver Management, Trip Lifecycle, Ride Matching, Pricing, Payments, Ratings | Geospatial calculations, real-time matching algorithms, dynamic pricing policies |
| D6 | **Messaging Platform (WhatsApp)** | system-design-primer, karanpratapsingh | Chat & Group Messaging, Presence Tracking, Media Processing, Notifications | Bi-directional streaming, delivery state machines, E2E encryption as cross-cutting |
| D7 | **Social Network (Twitter)** | system-design-primer, karanpratapsingh | Timeline & Feed, Follow Graph, Content Moderation, Trending Topics, Search | Fan-out patterns, recommendation calculations, content policy rules |
| D8 | **Video Streaming (Netflix)** | system-design-primer, karanpratapsingh | Content Catalog, Subscription & Billing, Recommendation Engine, Stream Delivery, Analytics | Content licensing policies, recommendation algorithms, geo-blocking rules |

### Tier 3 — Enterprise/SaaS Verticals (common in industry, well-understood domain models)

| # | Domain | Industry | Key Features | Stress on Vocabulary |
|---|--------|----------|-------------|---------------------|
| D9 | **E-commerce** | Retail | Catalog & Inventory, Shopping Cart & Checkout, Order Fulfillment, Payment Processing | Classic DDD example; exercises all meta-types, multi-step workflows |
| D10 | **Healthcare Scheduling** | Healthcare | Appointment Booking, Provider Management, Patient Records, Insurance Verification | Compliance rules, scheduling constraints, cross-entity workflows |
| D11 | **SaaS Subscription Management** | SaaS | Plan & Pricing, Billing & Invoicing, Usage Metering, Feature Flags & Entitlements | Metering calculations, entitlement policies, upgrade/downgrade state machines |
| D12 | **Banking & Finance** | Finance | Account Management, Transaction Processing, Transfers, Statement Generation, Compliance/KYC | Double-entry accounting rules, regulatory compliance policies, audit event trails |
| D13 | **Insurance Claims** | Insurance | Policy Underwriting, Premium Calculation, Claims Processing, Fraud Detection | Risk calculation models, multi-step adjudication workflows, actuarial policies |
| D14 | **Education / LMS** | Education | Course Management, Student Enrollment, Assessment & Grading, Certificates & Credentials | Progress tracking state machines, grading calculations, prerequisite rules |
| D15 | **Hotel Booking** | Hospitality | Reservation Management, Room Inventory, Guest Profiles, Check-in/Check-out, Billing | Event Modeling canonical domain [4]; availability calculations, overbooking policies |
| D16 | **Food Delivery** | Marketplace | Restaurant & Menu Management, Order Placement, Delivery Dispatch, Driver Tracking, Reviews | Multi-party marketplace, real-time dispatch workflows, rating policies |
| D17 | **CRM (Customer Relationship)** | Enterprise | Contact & Lead Management, Sales Pipeline, Activity Tracking, Deal Forecasting | Pipeline state machines, scoring calculations, assignment policies |
| D18 | **Event / Conference Management** | Events | Event Creation, Speaker Management, Ticket Sales, Attendee Registration, Scheduling | Capacity constraints, waitlist state machines, multi-track scheduling rules |

## Protocol

### Phase 1 — Feature Selection (per domain)

For each domain (D1–D18), select **2 representative features** that together exercise the widest range of meta-types. One feature should be workflow-heavy (behavioral emphasis), the other data-model-heavy (structural emphasis). Total: **36 feature specifications**.

### Phase 2 — DomainSpec Specification

For each feature, write a DomainSpec specification using the standard templates:
- `domain.md` — entities, value objects, enums
- `operations.md` — operations, calculations
- `states.md` — state machines
- `events.md` — events
- `rules.md` — rules, policies
- `interfaces.md` — interfaces, mappings
- `queries.md` — queries

Track every concept encountered during specification.

### Phase 3 — Coverage Classification

For each concept, classify its fit to the 24 meta-types:
- **covered** — the concept maps cleanly to exactly one meta-type
- **strained** — the concept can be forced into a meta-type but the fit is semantically misleading
- **uncovered** — no existing meta-type adequately represents this concept

### Phase 4 — Relationship Coverage

For each pair of related concepts, classify whether the relationship maps to one of the 26 relationship types:
- **covered** — clean fit to an existing relationship type
- **strained** — forced fit, semantics lost
- **uncovered** — no existing relationship type works

### Phase 5 — Gap Analysis

Cluster all strained/uncovered concepts to identify potential new meta-types. Cluster all strained/uncovered relationships to identify potential new relationship types.

## Feature Selection Guide

| Domain | Feature A (Workflow-heavy) | Feature B (Data-model-heavy) |
|--------|--------------------------|------------------------------|
| D1 Cargo Shipping | Cargo Booking & Routing Workflow | Cargo Tracking & Handling Events |
| D2 Collaboration | Discussion Forum Moderation | Backlog Item Lifecycle & Sprint Planning |
| D3 Order-Taking | Order Placement Pipeline | Pricing & Discount Engine |
| D4 Library | Book Lending & Returns | Patron Account & Hold Management |
| D5 Ride-Hailing | Trip Request → Match → Complete | Dynamic Pricing & Surge Calculation |
| D6 Messaging | Message Send → Deliver → Read | Group Management & Member Permissions |
| D7 Social Network | Post → Fan-out → Feed Assembly | Content Moderation & Reporting |
| D8 Video Streaming | Content Upload → Encode → Publish | Subscription Plans & Entitlements |
| D9 E-commerce | Checkout → Payment → Fulfillment | Product Catalog & Inventory |
| D10 Healthcare | Appointment Booking & Rescheduling | Provider Availability & Credentialing |
| D11 SaaS Subscription | Plan Upgrade/Downgrade Workflow | Usage Metering & Invoice Generation |
| D12 Banking | Wire Transfer Processing | Account Statement & Balance Calculation |
| D13 Insurance Claims | Claims Adjudication Workflow | Policy Underwriting & Risk Assessment |
| D14 Education/LMS | Course Enrollment & Progress Tracking | Assessment Submission & Grading |
| D15 Hotel Booking | Reservation → Check-in → Check-out | Room Inventory & Rate Management |
| D16 Food Delivery | Order → Dispatch → Delivery Tracking | Restaurant Menu & Availability |
| D17 CRM | Lead → Opportunity → Deal Close | Contact Management & Activity History |
| D18 Event Management | Ticket Purchase → Attendance → Feedback | Event Setup & Speaker Scheduling |

## Data Collected

| Column                   | Type     | Description                              |
| ------------------------ | -------- | ---------------------------------------- |
| `domain_id`              | string   | D1–D18                                   |
| `domain_name`            | string   | Human-readable domain name               |
| `domain_tier`            | string   | tier-1 / tier-2 / tier-3                 |
| `domain_source`          | string   | Literature source reference              |
| `feature_id`             | string   | e.g., D1-A, D1-B                         |
| `feature_name`           | string   | Human-readable feature name              |
| `feature_emphasis`       | string   | workflow / data-model                    |
| `total_concepts`         | int      | Total concepts in this feature spec      |
| `covered`                | int      | Clean meta-type fit                      |
| `strained`               | int      | Poor fit, forced                         |
| `uncovered`              | int      | No adequate meta-type                    |
| `uncovered_descriptions` | string[] | What the missing concepts are            |
| `strained_descriptions`  | string[] | What concepts were forced and into which type |
| `suggested_new_types`    | string[] | Meta-types that would fix gaps           |
| `relationship_total`     | int      | Total relationships in this feature spec |
| `relationship_covered`   | int      | Clean fit to existing relationship types |
| `relationship_strained`  | int      | Forced fit                               |
| `relationship_uncovered` | int      | No existing relationship type works      |
| `concept_coverage`       | float    | covered / total_concepts                 |
| `relationship_coverage`  | float    | relationship_covered / relationship_total |

## Execution Strategy

The 18 domains and 36 features represent significant effort. Execute in waves:

1. **Wave 1 (3 domains, 6 features):** D1 (Cargo Shipping), D9 (E-commerce), D12 (Banking) — covers Tier 1, Tier 3, and exercises the most common domain patterns. Use results to calibrate effort per feature.
2. **Wave 2 (5 domains, 10 features):** D5 (Ride-Hailing), D7 (Social Network), D11 (SaaS), D13 (Insurance), D15 (Hotel) — adds Tier 2 and domains with uncommon patterns (geospatial, streaming, actuarial).
3. **Wave 3 (5 domains, 10 features):** D2 (Collaboration), D4 (Library), D6 (Messaging), D10 (Healthcare), D14 (Education) — fills remaining gaps.
4. **Wave 4 (5 domains, 10 features):** D3 (Order-Taking), D8 (Video Streaming), D16 (Food Delivery), D17 (CRM), D18 (Event Mgmt) — completes full catalog.

Each wave produces interim results. Stop early if coverage stabilizes (confidence interval ≤ 2% for 3 consecutive waves).

## Success Criteria

- **SC-1:** Meta-type coverage ≥ 85% across all 36 features.
- **SC-2:** No single domain has meta-type coverage < 75%.
- **SC-3:** Relationship coverage ≥ 80% across all 36 features.
- **SC-4:** Any uncovered concepts cluster into ≤ 5 new meta-types (vocabulary is close, not fundamentally insufficient).
- **SC-5:** Any uncovered relationships cluster into ≤ 5 new relationship types.
- **SC-6:** Coverage is stable across tiers (Tier 1 vs Tier 2 vs Tier 3 difference ≤ 10pp).

## Results Analysis

> Full 10-step analysis report: [E6-results.md](../results/E6-results.md)

### Aggregate Coverage (JSONL ground truth)

| Metric | Total | Covered | Strained | Uncovered | Coverage |
|--------|-------|---------|----------|-----------|----------|
| Concepts | 747 | 746 | 1 | 0 | **99.87%** |
| Relationships | 670 | 663 | 7 | 0 | **98.96%** |

### Coverage by Tier

| Tier | Domains | Features | Concept Coverage | Relationship Coverage |
|------|---------|----------|------------------|-----------------------|
| Tier 1 (DDD Canonical) | 4 | 8 | 100% | 100% |
| Tier 2 (System Design) | 4 | 8 | 99.42% | 97.56% |
| Tier 3 (Enterprise/SaaS) | 10 | 20 | 100% | 99.29% |

Cross-tier variance: 0.58pp (concepts), 2.44pp (relationships) — well within SC-6 threshold of ≤10pp.

### Identified Gaps

**1 strained concept — ReadModel / Materialized Projection (D7-A Social Network)**
The pre-computed Timeline/Feed is a derived, materialized read view with its own refresh lifecycle. Forcing it into Entity loses the distinction between primary and projected data. Suggested meta-type: `ReadModel`. Impact: minor (<0.2% of concepts), relevant only in CQRS/event-sourced architectures.

**7 strained relationships — Workflow awaits async Event**
Seven workflow-heavy features (D5-A, D6-A, D8-A, D9-A, D12-A, D13-A, D16-A) have a Workflow step gating on an external async event (e.g., CheckoutWorkflow awaits PaymentConfirmed). No edge type captures event consumption by a workflow. Suggested edge type: `subscribes: Workflow → Event`. Impact: moderate (~39% of workflow-heavy features).

### Meta-Type Utilization

All 13 backend meta-types exercised. Most utilized: Value Object (19.9%), Operation (19.5%), Entity (17.1%). Least utilized: Mapping (1.2%, 8/36 features), Workflow (2.3%, 17/36 features). No redundant types — every type appears in ≥8 features.

### Success Criteria Evaluation

| Criterion | Target | Result | Status |
|-----------|--------|--------|--------|
| SC-1: Meta-type coverage ≥ 85% | ≥ 85% | 99.87% | ✅ PASS |
| SC-2: No domain < 75% | ≥ 75% | min 97.7% (D7) | ✅ PASS |
| SC-3: Relationship coverage ≥ 80% | ≥ 80% | 98.96% | ✅ PASS |
| SC-4: Uncovered concepts ≤ 5 new types | ≤ 5 | 1 (ReadModel) | ✅ PASS |
| SC-5: Uncovered rels ≤ 5 new edges | ≤ 5 | 1 (subscribes) | ✅ PASS |
| SC-6: Tier difference ≤ 10pp | ≤ 10pp | 0.58pp / 2.44pp | ✅ PASS |

**All 6 criteria passed.** Claim C2 strongly supported.

### Claim Impact

- **C2 (Deterministic Derivation):** Strongly supported — 24 meta-types cover 99.87% of concepts across 18 domains. One gap (ReadModel) is an optimization pattern, not a domain semantics gap.
- **C1 (Meta-Architecture):** Unchanged — L1 domain ontology vocabulary validated.

### Recommended Actions

1. Write §9.1 using E6 data (domain catalog, coverage-by-tier, meta-type utilization, gap analysis).
2. Add footnote to Table 1 about proposed `ReadModel` meta-type and `subscribes` edge.
3. Note in §7 (Threats to Validity): backend-only scope, single operator, no inter-rater reliability test.

## Traceability

| Success Criterion | Paper Section | Claim |
|-------------------|---------------|-------|
| SC-1, SC-2 | §9.1 Vocabulary Completeness | C2 |
| SC-3 | §9.1 Relationship Completeness | C2 |
| SC-4, SC-5 | §9.1 Gap Analysis | C2 |
| SC-6 | §9.1 Generalizability | C2 |

## References

[1] Evans, E. (2003). _Domain-Driven Design: Tackling Complexity in the Heart of Software_. Addison-Wesley.
[2] Vernon, V. (2013). _Implementing Domain-Driven Design_. Addison-Wesley.
[3] Wlaschin, S. (2018). _Domain Modeling Made Functional_. Pragmatic Bookshelf.
[4] Mladenovic, A. "What is Event Modeling?" eventmodeling.org, 2019.
