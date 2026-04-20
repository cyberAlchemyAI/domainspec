# DomainSpec Research — Source Catalog

Master catalog of validated external data sources used across experiments.

**Maintained by:** `domainspec-research-sources` skill
**Last updated:** 2026-04-20

---

## Source Categories

| Category | Description | Priority |
| -------- | ----------- | -------- |
| A | Open-source reference implementations (GitHub repos with domain models) | Highest |
| B | DDD canonical literature (published books with worked examples) | High |
| C | System design interview corpus (architecture repos with domain decomposition) | Medium |
| D | Academic case studies (peer-reviewed papers) | Medium |
| E | Event Modeling / Event Storming artifacts | Medium |
| F | Industry whitepapers & documentation | Lower |

---

## Validated Sources

### Category A — Reference Implementations

#### GH-CargoTracker
- **Domain:** Cargo Shipping & Logistics
- **URL:** https://github.com/eclipse-ee4j/cargotracker
- **Bounded Contexts:** Booking, Routing, Tracking, Handling
- **Depth:** deep
- **Accessibility:** public
- **Stress Score:** 0.82
- **Version Pin:** —
- **Used In:** E6 (D1), E9 run-2 (CD1)
- **Evidence Quality:** strong — rich domain model with explicit DDD patterns, all 4 BCs well-documented

#### GH-IDDD-Samples
- **Domain:** Collaboration & Agile PM
- **URL:** https://github.com/VaughnVernon/IDDD_Samples
- **Bounded Contexts:** Identity & Access, Collaboration, Agile PM
- **Depth:** deep
- **Accessibility:** public
- **Stress Score:** 0.75
- **Version Pin:** —
- **Used In:** E6 (D2), E9 run-2 (CD2)
- **Evidence Quality:** strong — multi-tenant, permission hierarchy, 3 explicit bounded contexts

#### GH-eShopOnContainers
- **Domain:** E-commerce Platform
- **URL:** https://github.com/dotnet-architecture/eShopOnContainers
- **Bounded Contexts:** Catalog, Ordering, Basket, Payment, Shipping, Identity
- **Depth:** deep
- **Accessibility:** public (archived)
- **Stress Score:** 0.88
- **Version Pin:** —
- **Used In:** E6 (D9-A), E9 run-2 (CD4)
- **Evidence Quality:** strong — Microsoft reference architecture, 6 BCs, saga patterns documented

#### GH-ddd-library
- **Domain:** Library Management
- **URL:** https://github.com/ddd-by-examples/library
- **Bounded Contexts:** Catalogue, Lending, Patron Profiles, Holds, Fees
- **Depth:** deep
- **Accessibility:** public
- **Stress Score:** 0.78
- **Version Pin:** —
- **Used In:** E6 (D4)
- **Evidence Quality:** moderate — strong policy/rule coverage, limited cross-BC interaction documentation

### Category B — DDD Literature

#### BOOK-Evans-BlueBook
- **Domain:** Cargo Shipping (primary), various
- **Reference:** Evans, E. (2003). _Domain-Driven Design_. Addison-Wesley.
- **Bounded Contexts:** Booking, Routing, Tracking, Handling, Billing (Ch. 7)
- **Depth:** deep
- **Accessibility:** requires book access
- **Stress Score:** 0.85
- **Used In:** E6 (D1), E9 run-2 (CD1)
- **Evidence Quality:** strong — the canonical DDD example, extremely well-documented

#### BOOK-Vernon-IDDD
- **Domain:** Collaboration & Agile PM
- **Reference:** Vernon, V. (2013). _Implementing Domain-Driven Design_. Addison-Wesley.
- **Bounded Contexts:** Identity & Access, Collaboration, Agile PM (Part 2)
- **Depth:** deep
- **Accessibility:** requires book access
- **Stress Score:** 0.78
- **Used In:** E6 (D2), E9 run-2 (CD2)
- **Evidence Quality:** strong — multi-context example with explicit context mapping

#### BOOK-Wlaschin-DMMF
- **Domain:** Order-Taking Pipeline
- **Reference:** Wlaschin, S. (2018). _Domain Modeling Made Functional_. Pragmatic Bookshelf.
- **Bounded Contexts:** Order placement, Pricing, Fulfillment
- **Depth:** moderate
- **Accessibility:** requires book access
- **Stress Score:** 0.65
- **Used In:** E6 (D3)
- **Evidence Quality:** moderate — functional decomposition approach, fewer BCs but strong type-driven design

### Category C — System Design Interview Corpus

#### GH-system-design-primer
- **Domain:** Multiple (Uber, Twitter, Netflix, WhatsApp, etc.)
- **URL:** https://github.com/donnemartin/system-design-primer
- **Stars:** 343k+
- **Depth:** moderate (architecture-focused, domain models must be reconstructed)
- **Accessibility:** public
- **Stress Score:** 0.60
- **Used In:** E6 (D5–D8), E9 run-2 (CD3)
- **Evidence Quality:** moderate — good architecture decomposition but domain models are implicit, require reconstruction

#### GH-karanpratapsingh-system-design
- **Domain:** Multiple (Uber, WhatsApp, Twitter, Netflix, etc.)
- **URL:** https://github.com/karanpratapsingh/system-design
- **Stars:** 43k+
- **Depth:** moderate
- **Accessibility:** public
- **Stress Score:** 0.58
- **Used In:** E6 (D5–D8), E9 run-2 (CD3)
- **Evidence Quality:** moderate — similar to system-design-primer, complementary detail

### Category E — Event Modeling

#### EM-Hotel-Booking
- **Domain:** Hotel Booking
- **URL:** https://eventmodeling.org
- **Bounded Contexts:** Reservation, Room Inventory, Guest Profiles, Check-in/Check-out
- **Depth:** moderate
- **Accessibility:** public
- **Stress Score:** 0.68
- **Used In:** E6 (D15)
- **Evidence Quality:** moderate — explicit event flows but limited rule/policy documentation

---

## Diversity Analysis (Current Catalog)

| Dimension | Coverage | Status |
| --------- | -------- | ------ |
| Industry verticals | 12 (logistics, PM, retail, finance, healthcare, insurance, education, hospitality, food delivery, CRM, events, SaaS) | ✅ Excellent |
| Complexity tiers | simple (1), moderate (4), complex (7) | ✅ Good |
| Source categories | A (4), B (3), C (2), E (1), D (0), F (0) | ⚠️ No academic or industry whitepaper sources yet |
| Composition patterns | 6/6 exercised in E9 | ✅ Complete |
| Geographic spread | Primarily US/EU business models | ⚠️ Limited |

### Known Gaps (for future experiments)
1. **No Category D sources** — need academic case studies for credibility in paper §7 (Evaluation)
2. **No Category F sources** — industry standards (HL7 FHIR, ISO 20022) would add regulatory complexity dimension
3. **System design sources require reconstruction** — domain models are implicit, creating reproducibility risk
4. **No version pins** — repos could change; need to record commit SHAs for reproducibility
