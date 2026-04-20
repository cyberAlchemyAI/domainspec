# E9: Cross-Feature Composition Stress Test

**Status:** ✅ completed run-1 (2026-04-20) · ✅ completed run-2 (2026-04-20) · ✅ completed run-2-rerun (2026-04-20)
**Paper Claim:** §9.2 — composition gaps
**Paper Section:** §9.2 (Cross-Feature Composition)
**Priority:** P2 | **Effort:** Medium (run-1) → High (run-2)
**Results:** [E9-results.md](../results/E9-results.md) (run-1 + run-2 + rerun)
**Raw data:** [E9-run-2026-04-20.jsonl](../data/E9-run-2026-04-20.jsonl) (run-1), [E9-run2-2026-04-20.jsonl](../data/E9-run2-2026-04-20.jsonl) (run-2 original), [E9-run2-rerun-2026-04-20.jsonl](../data/E9-run2-rerun-2026-04-20.jsonl) (run-2 rerun)

---

**Claim:** Features operate as independent concept graphs; cross-feature edges are not yet formally handled.

## Run History

| Run | Date | Scope | Edges | Status |
|-----|------|-------|-------|--------|
| run-1 | 2026-04-20 | poker-team (7 features) | 23 | ✅ completed |
| run-2 | 2026-04-20 | 6 external multi-BC domains (CD1–CD6) | 86 | ⚠️ superseded by rerun |
| run-2-rerun | 2026-04-20 | 6 external multi-BC domains (CD1–CD6) | 94 | ✅ completed |

> **Rerun motivation:** 10-step analysis of run-2 found JSONL classification discrepancies (edge type ambiguity, inconsistent model_status_original assignments). Rerun reconstructed all 6 domains from scratch with stricter classification rubric: deterministic mapping from edge_type → model_status_original (references→works, produces-for→strained, triggers-cross→broken, enforces-cross→strained, orchestrates→broken). CD2 expanded from 10→15 edges (3 BCs still sufficient). Total 94 edges (↑ from 86).

---

## Protocol — Run-1 (Single Codebase)

> _Completed. See [E9-results.md](../results/E9-results.md) for full analysis._

1. **Concept inventory (spec layer):** Read every feature's SPEC.md, domain.md, operations.md, states.md, events.md, interfaces.md, and queries.md under `docs/features/`. For each feature, extract all concepts with their meta-types (Entity, Value Object, Enum, Operation, Rule, Calculation, Policy, Event, State Machine, Workflow, Query, Interface, Mapping).
2. **Concept inventory (code layer):** Map `backend/src/domain/` directory structure. For each domain module, trace all imports that reference concepts from OTHER domain modules. Record source file, imported symbol, and target module.
3. **Shared concept identification:** Cross-reference the two inventories to identify concepts appearing in 2+ features — both at the spec level (same concept name in multiple SPEC.md files) and at the code level (cross-module imports).
4. **Edge enumeration:** For each shared concept, create a cross-feature edge record with: source feature, target feature, shared concept, concept type, edge direction, and the relationship pattern (read reference, write-back, shared ownership, cross-feature trigger, cross-feature enforcement, infrastructure provision).
5. **Ontology stress test:** For each edge, attempt to model it using the existing 26 DomainSpec relationship types (12 backend, 8 intra-UI, 6 cross-layer). Classify the result:
   - **works** — an existing edge type captures the relationship accurately
   - **strained** — must force-fit into a poor-match edge type; semantics are lost or misleading
   - **broken** — no existing edge type can represent this relationship at all
6. **Failure analysis:** For each strained/broken edge, document why the current ontology fails and what new edge type or meta-type would resolve it.
7. **Composition algebra:** Propose a formal composition operator $G_{A \oplus B}$ that extends the existing derivation calculus with cross-feature edge types and derivation rules.
8. **Derivation gap analysis:** Count test obligations that the current per-feature derivation function cannot produce because the cross-feature edges are missing from the ontology.

## Protocol — Run-2 (Multi-Domain External Composition)

> _Extends run-1 to external domains — validates that composition patterns generalize._

### Rationale

Run-1 tested cross-feature edges within a single codebase (poker-team). This gives us composition data for one domain's feature topology. To strengthen the claim, run-2 applies the same stress test to domain models drawn from well-documented external sources (DDD literature, system design interview problems, industry reference implementations). This validates that the proposed composition algebra ($G_{A \oplus B}$, 3 new edge types, `Saga` meta-type) generalizes beyond the poker-team project.

### Domain Selection

Select **6 multi-bounded-context domains** that are known to have rich cross-feature interactions. Each domain must have ≥ 3 interacting bounded contexts.

| # | Domain | Source | Bounded Contexts (≥ 3) | Expected Composition Patterns |
|---|--------|--------|------------------------|------------------------------|
| CD1 | **Cargo Shipping** | Evans Blue Book [1], Eclipse CargoTracker | Booking, Routing, Tracking, Handling, Billing | Long-running sagas (booking→routing→tracking), event chains across contexts, shared value objects (Itinerary, Route) |
| CD2 | **Collaboration & Agile PM** | Vernon IDDD [2], IDDD_Samples | Identity & Access, Collaboration (Forums), Agile PM (Sprints, Backlog) | Cross-context authorization enforcement, shared Tenant/User concepts, event-driven synchronization |
| CD3 | **Ride-Hailing** | system-design-primer, karanpratapsingh | Driver Mgmt, Trip Lifecycle, Matching, Pricing, Payments, Ratings | Real-time cross-feature triggers (match→trip→payment→rating), geospatial shared value objects, saga orchestration |
| CD4 | **E-commerce Platform** | eShopOnContainers [5], DDD literature | Catalog, Ordering, Basket, Payment, Shipping, Identity | Classic cross-feature saga (order→payment→shipping), shared Product reference, inventory reservation |
| CD5 | **Banking & Finance** | DDD event sourcing examples | Accounts, Transactions, Transfers, Statements, Compliance/KYC | Double-entry cross-account mutations, regulatory compliance enforcement across features, audit event composition |
| CD6 | **Food Delivery Marketplace** | Industry reference | Restaurants, Menu Mgmt, Order Placement, Delivery Dispatch, Payments, Reviews | Three-party marketplace (customer→restaurant→driver), cross-feature state dependencies, rating aggregation |

### Execution Steps

1. **Domain model reconstruction (per domain):**
   - Use published reference models, code samples, and documentation to reconstruct each bounded context's concept inventory.
   - For each bounded context, extract concepts and classify by DomainSpec meta-type.
   - Output: concept inventory per bounded context in JSONL format.

2. **Cross-context edge enumeration:**
   - Identify all concepts that appear in or are referenced by 2+ bounded contexts.
   - For each shared concept, document: source context, target context, shared concept, meta-type, edge direction, relationship pattern.
   - Apply the 6 relationship patterns identified in run-1 (read reference, write-back, shared ownership, cross-feature trigger, cross-feature enforcement, infrastructure provision) plus the 3 new edge types proposed (produces-for, triggers-cross, enforces-cross).
   - Output: cross-context edge table per domain.

3. **Ontology stress test (same as run-1):**
   - For each edge, classify model_status as works / strained / broken against the **extended** ontology (26 original + 3 proposed edge types + Saga meta-type).
   - This tests whether the run-1 proposals actually resolve the gaps or if more extensions are needed.

4. **Composition pattern analysis:**
   - Identify recurring composition patterns across the 6 domains.
   - Classify each pattern: does it match a known pattern from run-1, or is it novel?
   - Output: pattern frequency table with domain coverage.

5. **Composition algebra validation:**
   - Apply the composition operator $G_{A \oplus B}$ proposed in run-1 to each domain.
   - For each domain, attempt to derive the full cross-context edge set using the formal rules.
   - Track: derivable edges, non-derivable edges, new rules needed.

6. **Comparative analysis:**
   - Compare edge distribution, pattern frequency, and coverage rates between run-1 (poker-team) and run-2 (external domains).
   - Test hypothesis: the same 3 new edge types + Saga meta-type cover ≥ 80% of cross-feature edges across all domains.

### Run-2 Data Schema

| Column                  | Type                      | Description                                                  |
| ----------------------- | ------------------------- | ------------------------------------------------------------ |
| `domain_id`             | string                    | CD1–CD6                                                      |
| `domain_name`           | string                    | Human-readable domain name                                   |
| `source_context`        | string                    | Bounded context that owns the concept                        |
| `target_context`        | string                    | Bounded context that references the concept                  |
| `edge_id`               | string                    | Unique edge identifier (CD1-E01, etc.)                       |
| `shared_concept`        | string                    | Concept that crosses context boundaries                      |
| `concept_type`          | string                    | DomainSpec meta-type                                         |
| `edge_type`             | string                    | Relationship pattern                                         |
| `direction`             | string                    | Data flow description                                        |
| `model_status`          | works / strained / broken | Against extended ontology (26 + 3 proposed)                  |
| `model_status_original` | works / strained / broken | Against original ontology (26 only) — for comparison         |
| `failure_reason`        | string                    | Why the ontology fails (empty if works)                      |
| `proposed_fix`          | string                    | Additional extensions needed                                 |
| `pattern_id`            | string                    | Recurring composition pattern ID                             |
| `source_reference`      | string                    | Literature/code reference for this edge                      |
| `run1_analog`           | string                    | Analogous edge from run-1 (if any)                           |

### Run-2 Success Criteria

- **SC-R2-1:** Enumerate ≥ 15 cross-context edges per domain (≥ 90 total across 6 domains).
- **SC-R2-2:** The 3 new edge types proposed in run-1 resolve ≥ 80% of previously-broken edges across all 6 domains.
- **SC-R2-3:** ≤ 2 additional edge types needed beyond run-1's proposals (composition algebra is nearly complete).
- **SC-R2-4:** ≥ 3 composition patterns recur across ≥ 4 of the 6 domains (patterns are generalizable, not project-specific).
- **SC-R2-5:** The Saga meta-type (proposed in run-1) is needed in ≥ 4 of the 6 domains (justifying its addition to TAXONOMY.md).

---

## Input Artifacts

| Artifact                                           | Purpose                                           |
| -------------------------------------------------- | ------------------------------------------------- |
| `docs/features/*/SPEC.md`                          | Spec-level concept inventory (run-1)              |
| `docs/features/*/domain.md`, `operations.md`, etc. | Aspect-level concept details (run-1)              |
| `docs/shared/`                                     | Shared value objects and governance docs          |
| `docs/registry.md`                                 | Global concept registry (current state)           |
| `backend/src/domain/`                              | Code-level cross-module imports (run-1)           |
| `backend/src/use-cases/`                           | Use-case layer cross-domain dependencies (run-1)  |
| `domainspec/TAXONOMY.md`                           | 24 meta-types (reference for classification)      |
| `domainspec/RELATIONSHIPS.md`                      | 26 relationship types (reference for stress test) |
| E6 domain specs (when available)                   | Cross-input: domain specs from E6 feed run-2 concept inventories |

## Data Collected (Run-1 Schema)

| Column           | Type                      | Description                                                    |
| ---------------- | ------------------------- | -------------------------------------------------------------- |
| `edge_id`        | string                    | Unique edge identifier (CFE-NN)                                |
| `source_feature` | string                    | Feature that owns the shared concept                           |
| `target_feature` | string                    | Feature that references/consumes the concept                   |
| `shared_concept` | string                    | Concept that crosses feature boundaries                        |
| `concept_type`   | string                    | DomainSpec meta-type of the shared concept                     |
| `edge_type`      | string                    | Relationship pattern (references, derives-from, mutates, etc.) |
| `direction`      | string                    | Human-readable data flow description                           |
| `model_status`   | works / strained / broken | Can the current ontology represent this edge?                  |
| `failure_reason` | string                    | Why the ontology fails (empty if works)                        |
| `proposed_fix`   | string                    | New edge type, meta-type, or pattern needed                    |
| `spec_evidence`  | string                    | Evidence from SPEC.md / aspect docs                            |
| `code_evidence`  | string                    | Evidence from backend code imports                             |

## Success Criteria (Run-1 — Completed)

- ✅ Document all cross-feature edges (expected: 15–25). **Result: 23 edges.**
- ✅ Identify which composition patterns work and which require new formal operators. **Result: 6 patterns — 3 work, 3 require new operators.**
- ✅ Produce a concrete proposal for the composition algebra referenced in paper §9.2. **Result: $G_{A \oplus B}$ with 3 new edge types, 1 new meta-type (Saga), extended $\Delta_{cross}$.**

## Results Summary (Run-1)

All 3 success criteria passed. 23 edges documented (within expected range). 6 patterns identified — 3 work, 3 require new operators. Composition algebra $G_{A \oplus B}$ proposed with 3 new edge types (`produces-for`, `triggers-cross`, `enforces-cross`), 1 new meta-type (`Saga`), and extended derivation rules $\Delta_{cross}$. See [E9-results.md](../results/E9-results.md) for full analysis.

## Cross-Experiment Dependencies

| Dependency | Direction | Description |
|------------|-----------|-------------|
| E6 → E9 | input | Domain specs produced by E6 provide concept inventories for run-2 |
| E9 → C2 | validates | Cross-feature composition is part of deterministic derivation |
| E9 run-1 → E9 run-2 | validates | Run-2 tests whether run-1's proposed extensions generalize |

## References

[1] Evans, E. (2003). _Domain-Driven Design: Tackling Complexity in the Heart of Software_. Addison-Wesley.
[2] Vernon, V. (2013). _Implementing Domain-Driven Design_. Addison-Wesley.
[5] de la Torre, C. et al. _eShopOnContainers: Microservices Architecture and Containers based Reference Application_. Microsoft.
