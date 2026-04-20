# Research Inventory Index

**Last updated:** 2026-04-20
**Entries:** 6
**Total concepts:** 86
**Total cross-context edges:** 94

---

## Quick Lookup

| Source ID | File | Domain | BCs | Concepts | Edges | Patterns | Confidence | Experiments |
|-----------|------|--------|----:|--------:|------:|----------|:----------:|-------------|
| BOOK-Evans-BlueBook + GH-CargoTracker | [cargo-shipping.md](cargo-shipping.md) | Cargo Shipping | 5 | 13 | 15 | P1,P2,P3,P4 | high | E6, E9 |
| BOOK-Vernon-IDDD + GH-IDDD-Samples | [collaboration-agilepm.md](collaboration-agilepm.md) | Collaboration & Agile PM | 3 | 13 | 15 | P1–P6 | high | E6, E9 |
| SD-RideHailing | [ride-hailing.md](ride-hailing.md) | Ride-Hailing | 6 | 15 | 16 | P1–P5 | moderate | E6, E9 |
| GH-eShopOnContainers | [ecommerce-platform.md](ecommerce-platform.md) | E-commerce Platform | 6 | 15 | 16 | P1–P6 | high | E6, E9 |
| SD-Banking | [banking-finance.md](banking-finance.md) | Banking & Finance | 5 | 14 | 16 | P1–P5 | moderate | E9 |
| SD-FoodDelivery | [food-delivery.md](food-delivery.md) | Food Delivery Marketplace | 5 | 16 | 16 | P1–P5 | moderate | E9 |

---

## By Industry

| Industry | Sources |
|----------|---------|
| Logistics & Shipping | cargo-shipping |
| Project Management & Collaboration | collaboration-agilepm |
| Transportation & Mobility | ride-hailing |
| Retail & E-commerce | ecommerce-platform |
| Financial Services & Banking | banking-finance |
| Food & Delivery | food-delivery |

---

## By Composition Pattern

| Pattern | Description | Sources (of 6) |
|---------|-------------|----------------|
| P1 — Data Handoff | Producer writes data consumed by another context | 6/6 (all) |
| P2 — Entity Reference | Read-only reference to another context's entity | 6/6 (all) |
| P3 — Event Trigger | Cross-context event-driven trigger | 6/6 (all) |
| P4 — Saga | Long-running cross-context coordination | 6/6 (all) |
| P5 — Cross-Enforcement | Rule from one context constrains another | 5/6 (not cargo-shipping) |
| P6 — Shared Context | Identity/tenant scoping across contexts | 2/6 (collaboration-agilepm, ecommerce-platform) |

---

## By Meta-Type Stress

| Meta-Type | Sources exercising it | Total count |
|-----------|----------------------|------------:|
| Event | all 6 | 35 |
| Value Object | all 6 | 22 |
| Entity | 5 (not food-delivery has 1) | 16 |
| Rule | 4 (CD2, CD3, CD4, CD5, CD6) | 11 |
| Saga | all 6 | 6 |
| Calculation | 2 (ride-hailing, food-delivery) | 3 |
| Operation | 1 (ecommerce-platform) | 1 |

---

## By Bounded Context Count

| BCs | Sources |
|----:|---------|
| 3 | collaboration-agilepm |
| 5 | cargo-shipping, banking-finance, food-delivery |
| 6 | ride-hailing, ecommerce-platform |

---

## Inventory Gaps

| Gap | Impact | Action |
|-----|--------|--------|
| No E6-only domains inventoried | E6 used 18 domains; only 6 shared with E9 are inventoried | Backfill from E6 JSONL (12 domains) |
| No poker-team inventory | E9 run-1 used the live codebase; no persistent domain model extraction | Ingest from `docs/features/` and `backend/src/domain/` |
| System design sources lack version pins | ride-hailing, banking, food-delivery have no commit SHA | Pin on next access |
| No Category D/E/F sources | Academic papers, event models, industry whitepapers not yet inventoried | Needed for future experiments |
