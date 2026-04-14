# domainspec

> Think first, code second. Understand the domain before writing a single line of code.

Most software problems are not caused by bad code. They are caused by building the wrong thing — misunderstood business rules, missing edge cases, contradictory behavior between systems. Code written before the domain is understood has to be rewritten once understanding arrives.

**domainspec** is a framework for documenting what your system does before you build it. It gives you a structured vocabulary, consistent templates, and a clear pipeline that turns domain documentation into formal specifications, tests, and implementation — in that order.

---

## The Core Idea: Domain First

Every system has a domain: the real-world area it operates in (payments, logistics, user accounts). The domain contains concepts (orders, invoices, customers), behaviors (place order, charge payment, cancel subscription), and rules (amount must be positive, refund cannot exceed original charge).

In DomainSpec, documentation of these concepts comes **before** any code. The documentation is not prose — it is structured, typed, and formal enough to derive tests from.

The pipeline is always:

```
Domain Docs → Formal States → Tests → Implementation
```

Each stage depends on the previous. You cannot write meaningful tests without formal specifications, and you cannot implement correctly without tests. DomainSpec makes skipping steps visible and deliberate.

---

## Stage 1 — Classify Concepts with the Taxonomy

The first thing to understand is how DomainSpec classifies domain knowledge. Every concept in your system belongs to exactly one of 13 meta-types, organized into four categories.

These categories reflect the fundamental questions every system must answer:

| Question | Category | What it contains |
|----------|----------|-----------------|
| What things exist? | **Structural** | Entity, Value Object, Enum |
| What happens? | **Behavioral** | Operation, Query, Calculation, Rule, Policy, Workflow |
| How do parts communicate? | **Connective** | Interface, Event, Mapping |
| How do things change over time? | **Lifecycle** | State Machine |

### Structural — What things exist

These are the **nouns** of your domain.

**Entity** — An object with a unique identity that persists over time. Two entities can have identical values and still be different things. Entities have lifecycles, can be acted on by operations, and are tracked in state machines.
> *Examples:* Order, PaymentTransaction, User, Invoice

**Value Object** — An immutable concept defined entirely by its content, with no identity. Two instances with the same fields are interchangeable. Value objects are often shared across features.
> *Examples:* Money (amount + currency), Address, DateRange, Email

**Enum / Type** — A fixed, finite set of named values. They constrain field values and drive branching logic.
> *Examples:* OrderStatus, PaymentMethod, UserRole, Currency

### Behavioral — What happens

These are the **verbs** of your domain.

**Operation** — A business action that changes state. Operations have input, validate rules, run calculations, transition entities, emit events, and define error modes. Every meaningful mutation in the system is an operation.
> *Examples:* ProcessPayment, CreateOrder, CancelSubscription

**Query** — A read that returns data without side effects. Calling it twice produces the same result and nothing changes.
> *Examples:* GetPaymentStatus, GetOrderHistory, SearchProducts

**Calculation** — A pure function that derives a value from inputs. Same input always produces same output. Calculations are extracted from operations because they carry their own formulas and test obligations.
> *Examples:* FeeCalculation (amount × rate), TaxCalculation, DiscountAmount

**Rule** — A business constraint that must hold for an operation to proceed. Rules are the guards of the system — they have formal boolean expressions and block operations when violated.
> *Examples:* `amount.value > 0`, `user.age >= 18`, `product.stock >= quantity`

**Policy** — Decision logic that selects between behaviors at runtime. Unlike rules (which block or allow), policies *choose* how something happens.
> *Examples:* RetryPolicy (when to retry), PricingPolicy (which tier applies), RoutingPolicy (which gateway to use)

**Workflow** — A multi-step process coordinating multiple operations in sequence, with decision points and compensation logic (undoing completed steps when later steps fail).
> *Examples:* OrderFulfillment (charge → reserve → ship → notify), UserOnboarding

### Connective — How things communicate

These are the **boundaries** and **bridges** of your domain.

**Interface** — An API boundary exposing operations and queries to consumers. Can be external (REST, GraphQL) or internal (module contract between services).
> *Examples:* PaymentAPI (REST), OrderModule (internal), NotificationService

**Event** — A notification that something happened. Events decouple producers from consumers — the thing that happened does not need to know who reacts.
> *Examples:* PaymentCompleted, OrderShipped, UserRegistered

**Mapping** — A field-by-field data transformation between two shapes. Mappings make boundary translations explicit, including defaults, computed fields, and validation.
> *Examples:* RequestToTransaction (API input → entity), TransactionToResponse (entity → API output)

### Lifecycle — How things evolve

**State Machine** — A formal specification of how an entity moves through states. Defines all possible states, valid transitions, guards (conditions for transitions), effects (side effects), and invariants (properties that must always hold).
> *Examples:* PaymentStatus (Created → Processing → Completed/Failed), OrderLifecycle

> See [TAXONOMY.md](TAXONOMY.md) for the full reference with decision guides and disambiguation tables.

---

## Stage 2 — Connect Concepts with Relationships

Once you have classified concepts, you connect them using 12 typed relationship edges. This forms a **knowledge graph** — from any concept, you can follow edges to understand everything it touches.

| Edge | Connects | Answers |
|------|----------|---------|
| `performs` | Entity → Operation | What can a User/Admin/System do? |
| `produces` | Operation → Event | What happens after this operation runs? |
| `enforces` | Rule → Operation | What conditions must hold for this operation? |
| `calculates` | Calculation → Operation | What values does this operation derive? |
| `transitions` | Event → State Machine | What state changes does this event trigger? |
| `exposes` | Interface → Operation/Query | What does this API surface? |
| `orchestrates` | Workflow → Operation[] | What steps does this process coordinate? |
| `applies` | Policy → Operation | What strategies govern this operation? |
| `maps` | Mapping → Entity/Interface | What data transformations exist at this boundary? |
| `contains` | Entity → Value Object | What value types does this entity embed? |
| `queries` | Query → Entity | What data does this query read? |
| `emits` | Entity → Event | What events does this entity announce? |

**Why this matters:** Relationships make your documentation navigable. To understand any feature, follow the chain: Entity → Operation → Rules/Calculations → Events → State Machine. Every connection is explicit and traceable.

> See [RELATIONSHIPS.md](RELATIONSHIPS.md) for navigation patterns and full edge details.

---

## Stage 3 — Structure Documentation as Vertical Slices

With a taxonomy and relationships in hand, you document each feature as a **vertical slice** — a directory containing only the aspect files relevant to that feature. You do not document everything at once; you document what the feature actually needs.

### The feature directory

```
docs/features/{feature-name}/
├── SPEC.md          # Feature index — overview, concept table, aspect links
├── domain.md        # Entities, value objects, enums
├── operations.md    # Operations with rules, calculations, state transitions
├── states.md        # State machines (mermaid diagram + transition tables)
├── interfaces.md    # API contracts (endpoints, module boundaries)
├── events.md        # Domain events (payload, producer, consumers)
├── queries.md       # Read models (input, output shape, auth rules)
├── workflows.md     # Multi-step orchestrations
└── mappings.md      # Data transformations at boundaries
```

**Not every feature needs all aspect files.** A simple read-only feature may only need `SPEC.md`, `domain.md`, and `queries.md`. Only create what the feature genuinely needs.

### SPEC.md is the entry point

Every feature starts with `SPEC.md`. It contains:

1. **Overview** — what the feature does and why it exists (business context, not technical)
2. **Concept table** — every domain concept in the feature with its ID and meta-type; this is the **source of truth** for the global registry
3. **Aspect links** — which files exist for this feature
4. **Cross-feature dependencies** — what this feature depends on and what it produces for others

Starting with SPEC.md forces you to name and classify every concept before detailing them. Once you have a concept table, the structure of the remaining aspect files follows naturally.

### Operations drive most documentation

The `operations.md` file is typically the most detailed. For each operation:

- **Input** — field table with types and requirements
- **Rules** — business constraints with formal boolean expressions (`R1`, `R2`, ...)
- **Calculations** — formulas that derive values used in the operation (`C1`, `C2`, ...)
- **State transition** — which entity moves from which state to which state
- **Postconditions** — what must be true after a successful run
- **Error states** — each failure mode and its result

This level of detail is what enables the next stage: generating tests.

### States are formal

When an entity has a lifecycle (an `OrderStatus`, a `PaymentStatus`, an `AccountStatus`), document it in `states.md` using three complementary formats:

1. **Mermaid diagram** — visual, renderable in any markdown viewer
2. **Transition table** — From / Event / To / Guard / Effect columns, one row per transition
3. **Invalid transitions** — explicit list of which transitions must be rejected
4. **Invariants** — formal expressions that must hold in every reachable state

The combination of diagram and table makes state machines both human-readable and machine-parseable.

**Example — PaymentStatus state machine (excerpt from [examples/payment-processing/states.md](examples/payment-processing/states.md)):**

Transition table:

| From | Event | To | Guard | Effect |
|------|-------|----|-------|--------|
| Created | ProcessPayment | Processing | R1–R5 pass | Emit `PaymentInitiated`, call gateway |
| Processing | GatewayConfirm | Completed | — | Store gatewayRef, emit `PaymentCompleted` |
| Processing | GatewayReject | Failed | — | Store rejection reason |
| FailedRetryable | RetryPayment | Processing | R9, R10 pass | Increment retryCount, call gateway |

Invalid transitions:

| From | Attempted Event | Why Invalid |
|------|----------------|-------------|
| Completed | RetryPayment | Already succeeded — nothing to retry |
| Failed | any | Terminal state — no transitions allowed |

Invariants:

| ID | Invariant | Formal |
|----|-----------|--------|
| I1 | Completed payments have gateway reference | `status == Completed → gatewayRef != null` |
| I4 | Terminal states are immutable | `status ∈ {Failed, Refunded, RefundFailed} → no transitions` |

Notice that every row above is already a complete test specification. The From + Event + Guard columns define the preconditions and trigger. The To column defines the expected outcome. The Why Invalid column defines what must be rejected. Nothing is left to interpret.

> See [examples/payment-processing/states.md](examples/payment-processing/states.md) for the full state machine with 9 transitions, 5 invalid transitions, and 6 invariants.

---

## Stage 4 — Derive Tests from Documentation

The formal structure in the previous stage is not accidental — it exists specifically so tests can be derived from documentation deterministically. The rules are defined in [TEST-PIPELINE.md](TEST-PIPELINE.md).

| Doc section | What it produces |
|-------------|-----------------|
| Each state machine transition row | 1 happy-path state transition test |
| Each listed invalid transition | 1 rejection test (must be blocked) |
| Each state machine invariant | 1 property-based test (holds in every state) |
| Each operation rule | 2+ tests — one pass, one per failure mode |
| Each calculation formula | 1+ correctness tests + property tests |
| Each operation postcondition | 1 assertion test |
| Each operation error state | 1 negative test |
| Each API endpoint × response status | 1 contract test |
| Each event producer | 1 producer test |
| Each event consumer | 1 consumer test |

**The key insight:** tests are not written from scratch. They are read from the documentation. If a test cannot be derived from the docs, the docs are incomplete — fill the gap in the spec, then derive the test.

### Worked example — from doc rows to test cases

Using the PaymentStatus excerpt above, here is the mechanical derivation. Each row becomes a named test obligation — no interpretation required.

**From transition rows** — one happy-path test per row:

| Doc row | Test obligation |
|---------|----------------|
| Created + ProcessPayment (R1–R5 pass) → Processing | `given Created payment, when ProcessPayment with valid input, then status is Processing and PaymentInitiated emitted` |
| Processing + GatewayConfirm → Completed | `given Processing payment, when GatewayConfirm received, then status is Completed and gatewayRef is stored` |
| Processing + GatewayReject → Failed | `given Processing payment, when GatewayReject received, then status is Failed and rejection reason stored` |
| FailedRetryable + RetryPayment (R9, R10 pass) → Processing | `given FailedRetryable payment, when RetryPayment with valid guards, then status is Processing and retryCount incremented` |

**From invalid transitions** — one rejection test per row:

| Doc row | Test obligation |
|---------|----------------|
| Completed + RetryPayment | `given Completed payment, when RetryPayment attempted, then InvalidTransitionError raised and status unchanged` |
| Failed + any event | `given Failed payment, when any event triggered, then InvalidTransitionError raised` |

**From invariants** — one property test per invariant:

| Doc row | Test obligation |
|---------|----------------|
| I1: `status == Completed → gatewayRef != null` | `for all paths reaching Completed, assert gatewayRef is non-null` |
| I4: terminal states are immutable | `for all {Failed, Refunded, RefundFailed}, assert no operation produces a new state` |

**From operation rules** — two tests minimum per rule:

| Doc row | Test obligation |
|---------|----------------|
| R1: `amount.value > 0` — valid | `given amount=10, ProcessPayment proceeds without rule violation` |
| R1: `amount.value > 0` — boundary | `given amount=0, ProcessPayment returns ValidationError(VALIDATION_ERROR)` |
| R1: `amount.value > 0` — negative | `given amount=-5, ProcessPayment returns ValidationError(VALIDATION_ERROR)` |

Every test obligation above was **read** from the documentation tables. No logic was invented, no edge cases guessed. If a scenario is not in the docs, the docs are incomplete — add the row first, then derive the test.

The payment-processing example has 9 transitions, 6 invalid transitions, 6 invariants, 20+ rules, and 14 events — producing over 100 concrete test obligations from documentation alone.

---

## Stage 5 — Implement from Formal Specifications

With typed documentation and derived tests, implementation has clear contracts. There is nothing to guess or interpret:

- Entities implement the field tables in `domain.md`
- Operations implement the rules, calculations, and postconditions in `operations.md`
- State transitions implement exactly the transition table in `states.md` — no extra transitions, no missing ones
- Events implement exactly the payloads in `events.md`
- APIs implement exactly the request/response shapes in `interfaces.md`

Deviations from the documentation are not implementation details — they are specification gaps. Either the code is wrong, or the documentation must be updated first.

---

## Stage 6 — Maintain the Global Registry

As features accumulate, the concept table in each `SPEC.md` feeds a global index:

- **`docs/registry.md`** — all concepts indexed by meta-type, with links back to source feature files and cross-reference edges
- **`docs/glossary.md`** — domain terms defined precisely in shared language

The registry is the **map of your system**: any new contributor can open it and immediately see everything that exists, where it lives, and how concepts relate across features.

The source of truth for each concept lives in the feature's `SPEC.md`. The registry reflects it and is validated by tooling — it flags drift but does not overwrite source files.

---

## Using DomainSpec in a Project

### Project layout

```
your-project/
├── domainspec/        # Framework reference — read only, never edit
├── docs/              # Your domain documentation — grows feature by feature
│   ├── registry.md
│   ├── glossary.md
│   ├── shared/        # Cross-feature value objects
│   └── features/
│       ├── payments/
│       └── orders/
├── src/               # Code that grows from docs
└── tests/             # Tests that grow from docs
```

### Setup

```bash
# Copy the framework into your project (one time)
cp -r domainspec/ your-project/

# Bootstrap docs/
cp -r domainspec/starter/ your-project/docs/

# Create your first feature
mkdir your-project/docs/features/your-feature
cp domainspec/templates/SPEC.md your-project/docs/features/your-feature/
```

### Workflow per feature

1. **Write SPEC.md** — name the feature, list all concepts with types, define dependencies
2. **Add aspect files** — only the ones this feature needs (domain, operations, states, interfaces, events, queries, workflows, mappings)
3. **Sync registry** — add concepts to `docs/registry.md`, add terms to `docs/glossary.md`
4. **Generate test obligations** — apply rules from TEST-PIPELINE.md to produce a TEST-SPEC
5. **Implement** — write code against the documented contracts and derived tests
6. **Audit** — verify implementation matches documentation; record any drift

### Concept naming

Concepts use namespaced IDs: **`{feature}.{ConceptName}`**

- `payment.ProcessPayment` — ProcessPayment operation in the payment feature
- `order.CreateOrder` — CreateOrder operation in the order feature
- `shared.Money` — a value object shared across features

Short names within a feature's own files. Full namespace in registry entries and cross-feature references.

---

## Copilot Agent Pack

DomainSpec ships with a reusable Copilot integration pack that automates the entire workflow. Each command maps to one stage of the pipeline.

Install in any repository:

```bash
bash domainspec/copilot/install.sh
```

| Command | Stage | Does |
|---------|-------|------|
| `/domainspec-init` | Setup | Create docs/ structure and first feature skeleton |
| `/domainspec-spec-feature` | Stage 3 | Author or update a feature specification |
| `/domainspec-sync-registry` | Stage 6 | Sync registry and glossary from all SPEC.md files |
| `/domainspec-generate-tests` | Stage 4 | Derive TEST-SPEC.md from formal aspect docs |
| `/domainspec-implement` | Stage 5 | Implement code from documented contracts |
| `/domainspec-audit-alignment` | Stage 5/6 | Produce alignment report comparing docs vs code |
| `/domainspec-audit-layering` | Stage 5/6 | Detect domain-logic drift into application layers |
| `/domainspec-verify-feature` | Stage 6 | PASS / FLAG / BLOCK verdict on feature readiness |
| `/domainspec-help` | Any | Show commands and recommend next step |

### Intelligent Context Discovery

Agents that gather context (spec-writer, planner) use a **weighted heuristic** to choose the most efficient discovery path before acting. Four strategies are evaluated (`links-tags-first`, `broad-search-first`, `focused-researcher-first`, `capability-graph-first`) and scored against signal quality, search cost, and ambiguity risk. When SPEC frontmatter already resolves the full file graph, a pre-filter shortcut skips scoring entirely.

The researcher agent returns results in a **structured output contract** (`featureArtifacts`, `relevantContracts`, `namingConstraints`, `linkGraph`, `matchedTags`, `openQuestions`, `recommendation`) so callers can act without re-navigating.

See [copilot/README.md](copilot/README.md) and [copilot/INSTALL.md](copilot/INSTALL.md).

---

## Reference

| File | Contents |
|------|----------|
| [TAXONOMY.md](TAXONOMY.md) | Full 13-type reference with examples, decision guides, and confusion disambiguation |
| [RELATIONSHIPS.md](RELATIONSHIPS.md) | All 12 typed edge types with navigation patterns |
| [TEST-PIPELINE.md](TEST-PIPELINE.md) | Complete doc → test derivation rule set |
| [CHANGELOG.md](CHANGELOG.md) | Versioned record of framework updates |
| [examples/payment-processing/](examples/payment-processing/SPEC.md) | Complete feature example across all aspect files |
| [templates/](templates/SPEC.md) | All aspect templates, ready to copy |
