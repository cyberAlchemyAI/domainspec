---
tags: [vault, ontology]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: consolidated
version: 1.4.0
last_updated: 2026-04-10
---

# Vault Conventions

> Rules every node in the vault must follow. This is the vault's internal constitution — what determines quality, not just format.

---

## Objective

This document defines the **classification system** of the vault — an **adaptive** system designed to **reduce the entropy of the knowledge base** by enforcing orthogonal labeling.

The core mathematical objective is: every classification label should be **statistically independent** from every other label. When labels are orthogonal, each one contributes maximum unique information and zero redundancy. Adding a label that correlates with existing labels increases noise without increasing knowledge. Removing a label that was truly independent destroys information that no other label can recover. (See [Appendix A](#appendix-a-mathematical-foundation) for the formal framework.)

The system is **not static**. As the vault grows, labels may be added, merged, split, or retired. The only invariant is the orthogonality constraint: every label must earn its place by contributing information that no other label provides. This makes the ontology self-correcting — redundant labels are detected and eliminated, and missing dimensions are surfaced when existing labels fail to disambiguate nodes.

This document specifies the exact frontmatter fields, the classification system (node types, layers, natures, tags), the confidence dimensions, and the full catalog of edge types with their directionality rules.

For the philosophical foundations behind these choices, see `ontology-constitution.md`. For the maturity lifecycle (`draft` → `evergreen`), see `confidence-levels.md`.

---

## Index

1. [Required Frontmatter](#required-frontmatter)
2. [`node_type` — Epistemic Role](#node_type--epistemic-role)
3. [`layer` — System Scope](#layer--system-scope)
4. [`nature` — Document Format](#nature--document-format)
5. [`status` — Maturity Level](#status--maturity-level)
6. [`veracidade` and `convicção` — The Two Dimensions of Confidence](#veracidade-and-convicção--the-two-dimensions-of-confidence)
7. [`tags` — Domain Keywords](#tags--domain-keywords)
8. [Edge Types (Connections Section)](#edge-types-connections-section)
9. [The Orthogonality Principle](#the-orthogonality-principle)
10. [Open Questions](#open-questions)
11. [Appendix A: Mathematical Foundation](#appendix-a-mathematical-foundation)
12. [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog)
13. [Appendix C: Edge Type Catalog](#appendix-c-edge-type-catalog)
14. [Appendix D: Quick Reference — The 7 Labels](#appendix-d-quick-reference--the-7-labels)

---

## Required Frontmatter

```yaml
---
tags: [list of topical tags]           # Domain/topic labels only — see Tag System
node_type: axiom | premise | constitution | discovery | implementation-plan | spec | audit | conceptual | essay | test | backlog | readme
is_session: true | false               # Is this a conversation/session record?
session_ref: <session-id> | null       # Optional — the session that produced this document
layer: ontology | architecture | market | domain | application  # Multi-value allowed
nature: explanatory | procedural | reference | technical        # Multi-value allowed
status: draft | exploratory | active | consolidated | evergreen
veracidade: high | medium | low        # Optional for non-belief docs
convicção: high | medium | low         # Optional for non-belief docs
version: 0.x.x
last_updated: YYYY-MM-DD
---
```

---

## `node_type` — Document Role

### What it is

`node_type` classifies **what role this document plays** in the knowledge graph — what kind of claim it makes and how it participates. The role is intrinsic and does not change with maturity: an axiom stays an axiom whether it's `draft` or `evergreen`. Trust levels are captured by `status`, `veracidade`, and `convicção`.

The clearest way to assign `node_type` is to ask: *"If someone challenges this document, what is the right response?"*

| node_type             | Challenge response                                                       |
| --------------------- | ------------------------------------------------------------------------ |
| `axiom`               | "That's foundational — revisiting it breaks everything built on it"      |
| `premise`             | "Show me evidence and we'll update it"                                   |
| `constitution`        | "Change it through governance, not informally"                           |
| `discovery`           | "It's exploration — enrich it or supersede it with a decision"           |
| `implementation-plan` | "Follow it, update it if scope changed, or supersede it with a new plan" |
| `spec`                | "Update it if the code changed"                                          |
| `audit`               | "Run the audit again and see if the findings still hold"                 |
| `conceptual`          | "It's context — you can enrich or correct it"                            |
| `test`                | "Run the tests and see if they pass"                                     |
| `backlog`             | "Prioritize it, schedule it, or close it — it tracks pending work"       |
| `readme`              | "Update it to reflect what's actually in the directory"                  |

### Why it matters

This is the most important label. It determines **how the document participates in the knowledge graph**. An axiom anchors the graph — everything derives from it. A premise is a branch that might be pruned. A constitution is a law that governs behavior. Without `node_type`, every document looks equally authoritative.

### How it differs from `status` and `convicção`

These three labels often get confused because they all relate to "trust." But they measure different things:

- **`node_type`** measures the **role** of the document — what kind of claim it makes. It almost never changes. An axiom stays an axiom. A spec stays a spec.
- **`status`** measures the **maturity** — how much has this been reviewed and tested? It changes frequently, starting at `draft` and growing toward `evergreen`.
- **`convicção`** measures the **bet** — how committed is the team to this? It shifts as strategy shifts. A premise can go from `high` to `low` convicção.

Example: `system-axioms.md` is `node_type: axiom` (permanent role — it's a foundational claim), `status: consolidated` (maturity — it's been reviewed), `convicção: high` (bet — we are committed to it). If it were brand new, it would still be `node_type: axiom` but `status: draft`. The role doesn't change; the maturity does.

The twelve `node_type` values — `axiom`, `premise`, `constitution`, `discovery`, `implementation-plan`, `spec`, `audit`, `conceptual`, `essay`, `test`, `backlog`, `readme` — each represent a distinct role with precise boundaries. For the full value definitions and differentiation criteria, see [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog).

> **The knowledge lifecycle flow:** Documents naturally progress through epistemic roles: `discovery` (exploring possibilities) → `implementation-plan` (prescribing execution) → `spec` (describing current behavior). An `audit` document evaluates a `spec` against reality and feeds back into the cycle by spawning new discoveries or plans.

> **Why `discovery` and `implementation-plan` are not just `spec`:** Previously, `spec` encompassed documents with very different challenge responses. A discovery document says "explore or supersede me"; an implementation plan says "follow me or propose a revision"; a living spec says "update me if the code changed." These are distinct roles that require different agent behavior.

> **Can an axiom be a draft?** Yes — and it's one of the most important things in the vault. A `node_type: axiom` with `status: draft` means: *"Someone is proposing a new foundational truth. If accepted, everything built on top of it changes."* That is almost a paradigm shift, which is exactly why it must go through the full review process before reaching `consolidated`.

> **Why `session` is not a node_type:** Making `session` a `node_type` loses information. A session that defines the classification system plays a different role (`conceptual`) than a session that fixes a bug (`spec`). Being a conversation is captured by `is_session: true` — a boolean flag independent of the role. The `node_type` should reflect **what role the session's output plays**, not that it was a conversation.

> **When to read sessions:** Sessions are **provenance**, not reference material. They preserve the reasoning context behind decisions — the "why", not the "what". Agents should read specs, constitutions, and code to understand how the system works. Only read sessions when tracing *why* a specific decision was made — e.g., when a rule seems arbitrary or an architectural choice needs its original tradeoff analysis. (See [P-ONT-8](premise/ontology-premises.md) for the foundational premise.)

> **`session_ref` vs. `is_session`:** These are orthogonal provenance fields. `is_session: true` marks a document as *being* the session record itself (the scratchpad, the conversation log). `session_ref: <id>` marks any document as *having been produced by* a specific session — a spec, a constitution amendment, a discovery written during that session. A session log has `is_session: true` and typically `session_ref: null`. A spec written in session `m9k4w` has `is_session: false` and `session_ref: m9k4w`. The `session_ref` field enables forward tracing: given a session ID, find everything it produced.

> **Why `business` is not a node_type:** A document about the market plays the same role as any other `conceptual` document — background context with no enforcement power. The market/external scope is captured by `layer: market`. Using `node_type: business` would correlate almost perfectly with `layer: market`, violating orthogonality.

---

## `layer` — System Scope

### What it is

`layer` classifies **what part of the system or company** the document concerns. It is a topical scope — not an epistemic level, not a format.

### Why it matters

Without `layer`, an agent searching for "all architecture rules" would have to read every document's content to determine if it's about architecture. With `layer: architecture`, it's a single `WHERE` clause. This is the primary filter for narrowing scope.

### How it differs from `node_type`

`node_type` and `layer` are independent axes. An axiom can be about architecture or the market. A constitution can be about architecture or the ontology. A conceptual document can live in any layer. Knowing the `node_type` tells you nothing about the `layer`, and vice versa.

### Multi-value layer

A document **may belong to more than one layer**. For example, a session that discussed both architecture refactoring and market reality can be `layer: architecture, market`. Use multi-value when a document genuinely spans multiple scopes. **Do not use a special value to indicate multi-layer documents — just list the layers.**

The five `layer` values — `ontology`, `architecture`, `market`, `domain`, `application` — each scope a different part of the system. For the full value definitions and examples, see [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog).

> **Why `session` is not a layer:** A session about architecture should be `layer: architecture`, not `layer: session`. The `is_session` flag already tells you it's a conversation log — making `layer: session` redundant and losing the information about *what the session was about*. The `layer` should always reflect the document's topic, not its format.

> **Why `cross` was removed:** `cross` was a special value meaning "this spans multiple layers" — but that's exactly what multi-value syntax expresses directly and more informatively. `layer: architecture, domain` is strictly better than `layer: cross` because it tells you *which* layers are involved.

---

## `nature` — Document Format

### What it is

`nature` classifies the **structural format** of the document — if you printed it, what would it look like? A numbered checklist of steps? A prose essay explaining ideas? A lookup table of terms? A schema diagram? This is about the *shape* of the text, not what it says or how trustworthy it is.

### Why it matters

`nature` is primarily a **reading instruction for agents**. An agent looking for "how to emit an event" needs a `procedural` document — it should follow steps. An agent looking for "what terms mean" needs a `reference` document — it should look up a specific row. Without `nature`, the agent must read the content to determine how to consume it.

Note that `nature` has **lower independent entropy** than the other labels — knowing that a document is `node_type: constitution` makes `procedural` or `technical` more likely. This correlation is acceptable because `nature` still captures format variation that no other label expresses: a constitution can be written as prose (`explanatory`) or as a rule table (`reference`), and that distinction genuinely changes how an agent should read it.

### Does `nature` correlate with the other labels?

Partially — but not fully. A `constitution` is usually `procedural` or `technical`, but could be `explanatory`. A `conceptual` document is usually `explanatory`, but a vocabulary document is `reference`. `nature` is not entirely predictable from `node_type`, and its residual entropy justifies its existence as a label.

The four `nature` values — `explanatory`, `procedural`, `reference`, `technical` — each describe a different structural format. Multi-value `nature` is allowed (e.g., `procedural, technical`) when a document genuinely spans two formats. For the full value definitions, see [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog).

### How sessions should be classified

Sessions are not all the same `nature`. A brainstorming session is `explanatory`. A debugging/refactoring session is `technical`. A session that defined a schema or catalog is `reference`. The `/close-session` workflow should classify the session's nature based on what was actually discussed.

---

## `status` — Maturity Level

### What it is

`status` classifies **how mature and trusted** a document is. It represents the document's position in the maturity lifecycle: `draft` → `exploratory` → `active` → `consolidated` → `evergreen`. For full rules, see `confidence-levels.md`.

### How it differs from `node_type`

`node_type` is the **category** (what kind of knowledge). `status` is the **maturity** (how much it's been tested). They are independent:

- A `premise` can be `draft` (just created, untested) or `consolidated` (reviewed and survived).
- An `axiom` can be `draft` (newly stated, not yet reviewed) or `evergreen` (foundational for years).
- A `constitution` can be `active` (in use) or `consolidated` (formally reviewed).

The category stays the same; the maturity changes as the document is tested against reality.

Each status level has precise **entry and exit criteria** that define how a document is promoted (or demoted). For the full criteria table, see [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog).

> **The hard boundary:** A higher-level document can NOT reference a lower-level document as a source of truth. A `consolidated` constitution may cite a `draft` session as "context", but it cannot derive its authority from it.

---

## `veracidade` and `convicção` — The Two Dimensions of Confidence

Every document in the vault can be labeled with two confidence metrics: **veracidade** (evidence) and **convicção** (commitment).

### Why two dimensions?

If we only had a single "confidence" metric, the system would be ambiguous: does "low confidence" mean *we don't have data* or *we aren't betting on it*? These are completely different situations that require different responses. Orthogonality eliminates this ambiguity.

### The difference between them

**Veracidade** measures how much the world confirms this — external evidence. It is determined by reality: data, tests, production results, post-mortems. It changes through evidence. Low means "we haven't tested this yet." High means "this has been tested and confirmed."

**Convicção** measures how hard the team is betting on this — internal posture. It is determined by the team: strategy, priorities, resource allocation. It changes through decisions. Low means "we aren't committing resources." High means "we are building around this."

### How they differ from `status`

`status` is the **lifecycle** (draft → evergreen). `veracidade` and `convicção` are **snapshot assessments** within that lifecycle:
- A `consolidated` document typically has `veracidade: high` — but not always. A team can consolidate a strategic decision (`convicção: high`) before it's fully proven (`veracidade: medium`).
- A `draft` document can have `veracidade: high` — someone just wrote down a well-known fact that hadn't been documented yet.

### The 2×2 Matrix

The interplay between the two dimensions creates four archetypes:

- `veracidade:low` + `convicção:high` → **A Strategic Bet.** We are building our architecture around this, even though we haven't fully proven it yet.
- `veracidade:high` + `convicção:low` → **An Ignored Fact.** A well-established market reality that we currently choose not to focus on or exploit.
- `veracidade:high` + `convicção:high` → **A Consolidated Law.** A proven fact that actively and safely drives the system design.
- `veracidade:low` + `convicção:low` → **A Loose Thread.** An untested idea that nobody is acting on yet. Worth recording but not worth building on.

### Applicability

These dimensions are **meaningful for `axiom`, `premise`, `discovery`, and `audit`** — node types that make a claim, bet, or evaluative judgment.

- **`axiom`** — "We take this as foundational." `veracidade` measures how well-established this is externally. `convicção` measures how deeply committed we are to building on it.
- **`premise`** — "We believe this, but may be wrong." The 2×2 matrix is most useful here: are we betting on something unproven? Have we proven something we're ignoring?
- **`discovery`** — "We explored these possibilities." `veracidade` measures how well-researched the options are. `convicção` measures how seriously the team is considering acting on the findings.
- **`audit`** — "We assessed the current state." `veracidade` measures how current and thorough the findings are. `convicção` measures how committed the team is to addressing the identified issues.

For `constitution`, `implementation-plan`, `spec`, `conceptual`, and `test`, these fields should be **omitted**:
- A `constitution` is either ratified or not — that's `status`. If it's tested in practice, that's `status: consolidated` or `evergreen`.
- An `implementation-plan` is procedural — it prescribes steps, not beliefs. Its maturity is captured by `status`.
- A `spec` is either accurate or drifted — that's also `status`.
- A `conceptual` document is context, not a bet.
- A `test` document either passes or fails — evidence is observable, not estimated.

For the precise operational criteria for each value (high/medium/low) and the veracidade criteria by node_type, see [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog).

---

## `tags` — Domain Keywords

Tags are **topical/domain labels only**. Epistemic role is declared in `node_type`. Maturity is declared in `status`. Do not duplicate either concept as a tag.

### When to use tags

Tags answer the question *"What business or technical domain does this document touch?"* They drive graph filtering ("show me all nodes about the event system") and do not carry any epistemic weight.

### Business domain
`#fidc` `#credit-rights` `#acquisition` `#liquidation` `#inventory` `#ccb` `#mission`

### Technical domain
`#architecture` `#application` `#infrastructure` `#pipeline` `#event-system` `#ontology`

### Vault
`#vault` `#agents`

---

## Edge Types (Connections Section)

Declare relationships in the `## Connections` section of each document:

```markdown
| Document | Type | Description |
|----------|------|-------------|
| `other.md` | `resolves` | description of the relationship |
```

### Directionality Principle

Edges in the Markdown layer can be **bidirectional** to maximize explicit information (e.g., a child declaring `derives-from` parent, and the parent declaring `grounds` child).

> **Bidirectionality and Deduplication:** While Markdown allows and encourages bidirectional edges to increase local node information density, this creates duplicate records of the same structural fact. To prevent visual noise and graph traversal loops, the **visualization and query layers must deduplicate these edges**. For example, `derives-from → B` and `B grounds → A` represent the same edge and should be visualized as a single directed line.

> **Bidirectionality at the SQL layer:** The `ontology_edges` table stores *both directions* as computed rows derived from the Markdown declarations. This makes agent queries efficient ("what documents depend on this axiom?" is a simple `WHERE target = X` query).

For the full catalog of 13 edge types with their directionality and usage criteria, see [Appendix C: Edge Type Catalog](#appendix-c-edge-type-catalog).

> `contradicts` is the most valuable edge type: it flags inconsistencies that must be resolved before a document moves up a level. Its **absence does not mean the vault is contradiction-free** — only that no contradictions have been formally identified yet.

> `validates` is the mechanism for a document to increase its `veracidade` over time.

> **Using `grounds`:** `grounds` is the theoretical inverse of `derives-from`. You may use it to explicitly declare foundations, but remember the deduplication rule applies when viewing the graph as a whole.

---

## The Orthogonality Principle

> **A new label or node should only be created if it adds orthogonal information to what already exists.**

This is the single governing constraint of the entire ontology. In information-theoretic terms: two signals are orthogonal when their **mutual information is zero** — knowing one tells you nothing about the other. Each orthogonal signal contributes maximum unique entropy to the system. A redundant signal increases the description length without increasing knowledge.

This principle applies at **two levels**:

### Level 1: Labels (Classification Dimensions)

The 7 classification labels (`node_type`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `tags`) are designed so that **knowing the value of one label gives you no information about the value of any other**. This is what makes each label worth maintaining — it captures a dimension of meaning that would be lost without it.

**The admission question for a new label:**
> *"Can I predict this label's value from the existing labels? If yes, it is redundant. If no, it carries unique information and should exist."*

When the vault grows and patterns emerge (e.g., if every `axiom` turns out to be `conceptual` in nature), that correlation signals either a label is redundant or the definitions need sharpening. The system should adapt.

### Level 2: Nodes (Documents)

The same principle applies to documents themselves:

**The admission question for a new node:**
> *"If I remove this document, is any information lost that cannot be recovered from the others?"*

If the answer is no, the node is redundant.

**Practical corollaries:**
- Two documents with high semantic overlap should be **merged** or one should become a **reference** of the other
- An index (like the README) does not violate this principle because its function — navigation — is orthogonal to the content it indexes
- A *how-to* document is orthogonal to a *why* document, even if they cover the same topic

> **Future:** when the vault grows, automatic semantic similarity measurement (embedding cosine similarity) can be implemented as an admission gate for documents at `consolidated` level and above. Similarly, mutual information between labels can be computed empirically to validate orthogonality as the corpus scales.

---

## Open Questions

The following are unresolved design questions about the classification system. They are tracked here so they are visible and not forgotten. Each should be resolved and either adopted (update this document) or rejected (document the reasoning and remove the question).

### OQ-1: Should we add a `domain` label for spec nodes?

**Context:** `layer` captures broad scope (architecture, business, domain), but NOT the specific business domain. A spec about aquisição and a spec about liquidação both have `layer: domain` — you need tags (`#acquisition`, `#liquidation`) to tell them apart. Should there be a dedicated `domain` field that captures the specific domain?

**Arguments for:** Tags are free-text and unenforced. A formal `domain` field would be required and validated. For specs, the domain is critical metadata — arguably more important than the layer.

**Arguments against:** Tags already cover this. Adding another field increases frontmatter complexity. The domain catalog would need to be maintained in two places (here and in the tag catalog).

**Status:** Open. To be decided when specs are migrated into the vault.

### OQ-2: Should `audience` be a formal field, or does `objective` replace it?

**Context:** `audience` was proposed as a way to declare who should read a document (`agent`, `engineer`, etc.). But "product" isn't really an audience, and the user proposed `objective` — a one-line, high-density statement of why the document exists — as a more useful alternative.

**Option A:** Add `objective` as a frontmatter field (one-liner), drop `audience`.
**Option B:** Keep both — `objective` for agents, `audience` for filtering by role.
**Option C:** Neither — the `## Objective` section in the body already serves this purpose.

**Status:** Open. The `## Objective` section exists on all documents. The frontmatter field decision is pending.

### OQ-3: How does the system know if a node "has been discussed" (exploratory entry criteria)?

**Context:** The entry criteria for `exploratory` status require the document to have "been discussed in a session." But there is no mechanism to track this automatically.

**Options:** Manual promotion, edge detection from session logs, or event-based tracking via `log_ontology_event`. See [backlog.md](file:///Users/victorboscaro/house_project/specs/ontology/backlog.md) for details.

**Status:** Open. Start with manual promotion; automate later.

### OQ-4: Operational definition of `veracidade` for constitutions

**Context:** `veracidade: high` for a premise means "backed by evidence." But what does it mean for a constitution (which is a rule, not a belief)? Proposed: "how tested is the rule in practice." See [backlog.md](file:///Users/victorboscaro/house_project/specs/ontology/backlog.md) for the full criteria proposal.

**Status:** Open. Interim criteria documented in the veracidade section above.

---

## Appendix A: Mathematical Foundation

The ontology's classification system can be formalized using **information theory**. This appendix provides the mathematical framework that underpins the Orthogonality Principle.

### The Setup

Let the classification system consist of *n* labels: **L₁, L₂, ..., Lₙ** (currently *n = 7*). Each label is a discrete random variable whose value is drawn from a finite set (e.g., `node_type ∈ {axiom, premise, constitution, discovery, implementation-plan, spec, audit, conceptual, essay, test, backlog}`).

The **Shannon entropy** of a single label measures how much information it carries:

```
H(Lᵢ) = − Σ p(x) · log₂ p(x)
```

where the sum runs over all possible values *x* of label *Lᵢ*, and *p(x)* is the fraction of documents with that value.

### The Orthogonality Condition

Two labels **Lᵢ** and **Lⱼ** are orthogonal if and only if their **mutual information** is zero:

```
I(Lᵢ ; Lⱼ) = H(Lᵢ) + H(Lⱼ) − H(Lᵢ, Lⱼ) = 0
```

This means: knowing the value of *Lᵢ* gives you **zero bits** of information about *Lⱼ*, and vice versa. The joint entropy equals the sum of the individual entropies — there is no redundancy.

When orthogonality holds for **all pairs**, the total information capacity of the classification system is maximized:

```
H(L₁, L₂, ..., Lₙ) = H(L₁) + H(L₂) + ... + H(Lₙ)    (maximum, no waste)
```

If any two labels correlate, the joint entropy is strictly less than the sum — the system wastes descriptive capacity on redundant information:

```
H(L₁, L₂, ..., Lₙ) < H(L₁) + H(L₂) + ... + H(Lₙ)    (redundancy present)
```

### The Admission Test for a New Label

When considering adding a new label **Lₙ₊₁**, its net information contribution is:

```
ΔH = H(Lₙ₊₁) − I(Lₙ₊₁ ; L₁, L₂, ..., Lₙ)
```

where `I(Lₙ₊₁ ; L₁, ..., Lₙ)` is the mutual information between the new label and the *entire existing system*.

- If **ΔH ≈ H(Lₙ₊₁)** → the new label is fully orthogonal. **Add it.**
- If **ΔH ≈ 0** → the new label is almost entirely predictable from existing labels. **It is redundant.**
- If **0 < ΔH < H(Lₙ₊₁)** → partial overlap. Consider whether the unique portion justifies the added complexity.

### Why This Matters

A classification system with correlated labels creates **ambiguity**: agents and humans must resolve contradictions between labels that should agree but don't. Orthogonal labels create **clarity**: each label is a clean, independent axis of meaning. The result is lower entropy in the *retrieval* process — when an agent queries the vault, orthogonal labels partition the search space into non-overlapping regions, minimizing the number of documents that must be inspected to find the right one.

---

## Appendix B: Label Value Catalog

### `node_type` Values

The mental test for assigning `node_type`: *"If someone challenges this document, what is the right response?"*

| node_type             | Definition                                                                                                                                                                                                                                                   | Challenge response                                                       | Example                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `axiom`               | Foundational commitment taken as given. Hardest to change. Revising one requires rethinking everything built on it.                                                                                                                                          | "That's foundational — revisiting it breaks everything built on it"      | `system-axioms.md`: "History is Immutable"                                  |
| `premise`             | Working bet — an informed hypothesis that guides decisions but may be disproven. Carries explicit confidence labels.                                                                                                                                         | "Show me evidence and we'll update it"                                   | `system-premises.md`: "Polars is the right choice"                          |
| `constitution`        | An enforceable rule the team has formally ratified. Versioned and amended through governance.                                                                                                                                                                | "Change it through governance, not informally"                           | `event-system-constitution.md`                                              |
| `discovery`           | Exploratory document that maps the possibility space for a decision or feature. Investigates options, trade-offs, and feasibility without prescribing action. May carry confidence labels as a strategic bet.                                                | "It's exploration — enrich it or supersede it with a decision"           | `discovery-gravity-strategies.md`, `cloud-vision-migration-discovery.md`    |
| `implementation-plan` | Actionable execution roadmap with phases, checkboxes, dependencies, and success criteria. Prescribes the steps to achieve a goal.                                                                                                                            | "Follow it, update it if scope changed, or supersede it with a new plan" | `ccb-refactor-phases.md`, `gcp-infrastructure-migration.md`                 |
| `spec`                | Behavioral description of how a part of the system works. A living technical document that stays in sync with code.                                                                                                                                          | "Update it if the code changed"                                          | `ccb-spec-v1.md`, `business-rules.md`                                       |
| `audit`               | Evaluative document that assesses the current state of the system against constitutions, axioms, or quality standards. Identifies violations, risks, and gaps.                                                                                               | "Run the audit again and see if the findings still hold"                 | `shared-services-refactor.md`                                               |
| `conceptual`          | Explanatory context that grounds understanding without prescribing behavior. Covers background knowledge, vocabulary, domain context, market reality.                                                                                                        | "It's context — you can enrich or correct it"                            | `fidc-and-credit-rights.md`, `dictionary-business.md`, `mission.md`         |
| `essay`               | A committed argument from lived experience. First-person reflection that compresses observation into a structural claim. Neither exploratory (too committed) nor operational (no enforcement); its role is to expose reasoning so readers can engage with it. Authorial voice is part of the meaning. | "It's a committed argument from experience — engage with the reasoning or counter it with a better one" | `manifesto.md`, `abstraction-as-art.md`, `knowledge-topology.md`            |
| `test`                | A record of executable validation. Documents test coverage analysis, test implementation decisions, gap identification, and pass/fail results. Its primary epistemic role is generating evidence that increases the `veracidade` of specs and constitutions. | "Run the tests and see if they pass"                                     | Session covering test coverage gaps, test writing, or test failure analysis |
| `backlog`             | A prioritized list of pending work items, feature requests, technical debt, or open questions awaiting scheduling. Tracks *what needs to be done* without prescribing *how*.                                                                                 | "Prioritize it, schedule it, or close it — it tracks pending work"       | `backlog.md`                                                                |

### `layer` Values

| layer | What it scopes | Example documents |
|-------|---------------|-------------------|
| `ontology` | Documents about the vault itself — its own schema, rules, navigation, and classification system. Not about the market or the codebase. | `ontology-conventions.md`, `confidence-levels.md`, `agent-navigation.md` |
| `architecture` | System-level architectural decisions, structural rules, and constitutions about how the codebase is organized. | `event-system-constitution.md`, `folder-structure-constitution.md` |
| `market` | External market reality — FIDC regulations, company mission, competitive context, business domain knowledge external to the system. | `mission.md`, `fidc-and-credit-rights.md`, `business-premises.md` |
| `domain` | Internal business domain logic — rules, calculations, and behaviors within a specific domain (aquisição, liquidação, estoque). | *(Specs will be migrated here from `/specs/`)* |
| `application` | Application-level concerns — use cases, interfaces, workflows, integrations. | *(Not yet used — forward-looking for when application specs enter the vault)* |

For documents that genuinely span multiple layers, use multi-value: `layer: architecture, domain`. Do not use a special value — list the layers explicitly so the information is preserved.

### `nature` Values

`nature` is a **reading instruction**: it tells agents and humans *how to consume* the document, not what it says.

| nature | Shape | Reader behavior | Example |
|--------|-------|----------------|---------|
| `explanatory` | Prose — paragraphs of reasoning and context. | Reads linearly, absorbs the *why*. | `event-system-foundations.md`, `fidc-and-credit-rights.md`, `mission.md` |
| `procedural` | Numbered steps, checklists. | Follows instructions *in order*. | A deployment checklist, a "how to register a template" guide |
| `reference` | Tables, catalogs, dictionaries. | Searches for a *specific item*, does not read linearly. | `dictionary-business.md`, this document's Edge Type Catalog |
| `technical` | Schemas, code patterns, system diagrams. | Inspects *structure*, not prose. | `system-axioms.md`, `system-premises.md` |

### `status` Entry and Exit Criteria

| Status | Entry criteria (to reach this level) | Exit criteria (to promote further) |
|--------|--------------------------------------|-------------------------------------|
| **🌱 draft** | Document exists. No further requirements. Anyone can create. | Has minimal structure, a defined topic, and links to at least one existing concept. |
| **🔍 exploratory** | Complete frontmatter (all required fields). Linked to at least one other document. Defined status and confidence labels. | Has been discussed in a session, not contradicted by code or hard evidence. |
| **⚡ active** | Does not contradict any `evergreen` or `consolidated` document. Aligned with current code, or deviation is explicitly documented. | Has been reviewed against real system state. Survived without contradiction. |
| **🏛️ consolidated** | Version ≥ 1.0. No open `contradicts` edges. Referenced by at least 2 lower-level documents. | Formal review confirms it. No open controversy. |
| **🌲 evergreen** | Approved by formal review. No known contradictions. Tested against multiple real scenarios. | Only leaves by documented refutation + formal review — **never by abandonment.** |

### `veracidade` (evidence) — Operational Criteria

| Value | Criteria | Example |
|-------|---------|--------|
| **high** | Tested against reality: production data confirms it, experiments validate it, or it matches external authoritative sources. You can point to concrete evidence. | "Our event system has been in production for 2 months with no data loss" |
| **medium** | Derived from established principles or industry patterns, but not yet tested in *this* specific system. Reasonable extrapolation, not wild guess. | "Domain isolation will reduce bugs" (based on DDD literature, not our own metrics) |
| **low** | Untested hypothesis, projection, or author's interpretation. No concrete evidence — just a plausible argument. | "AI agents will write most of our boilerplate code" |

### `convicção` (commitment) — Operational Criteria

| Value | Criteria | Example |
|-------|---------|--------|
| **high** | Actively drives real decisions: architecture choices, hiring, sprint priorities, resource allocation. If this were wrong, we'd need to undo significant work. | "We use event sourcing" → we built the entire event system around this |
| **medium** | Influences decisions but doesn't block them. We'd adjust course if disproven, but wouldn't need to rewrite the system. | "Polars is the right choice for data pipelines" → affects tooling, but could switch |
| **low** | Exploration, no firm position. We acknowledge it as possible but haven't committed resources or architecture to it. | "We might need a graph database eventually" → noted, not acted on |

### `veracidade` Criteria by `node_type`

| node_type | `veracidade: high` means | `veracidade: low` means |
|-----------|-------------------------|------------------------|
| **axiom** | Well-established principle in the industry / academia | Novel assumption with no external validation |
| **premise** | Hypothesis tested in production or backed by concrete data | Untested working bet |
| **constitution** | Rule followed for weeks/months; violations caught and corrected | Brand new, not yet tested in practice |
| **discovery** | Options thoroughly researched with concrete data, benchmarks, or PoCs | Quick brainstorm without evidence or validation |
| **implementation-plan** | Plan tested against reality; phases completed successfully | Untested roadmap based on assumptions |
| **spec** | Description matches current code behavior exactly | Code has drifted from the spec |
| **audit** | Findings verified against current codebase; issues reproduced | Audit based on stale code or incomplete review |
| **conceptual** | Content verified against authoritative sources | Author's interpretation, not cross-checked |
| **essay** | Argument grounded in concrete built-and-observed experience — specific artifacts, numbers, moments the author can point to | Speculation dressed as experience; generalization with no concrete referent |
| **test** | All tests pass and cover the claimed business rules | Tests are stale, skipped, or cover the wrong behavior |
| **backlog** | Items are current, prioritized, and reflect real pending work | Stale items that were completed or abandoned without updating |

---

## Appendix C: Edge Type Catalog

| Type | Direction (read as: A → B means...) | When to use |
|------|--------------------------------------|-------------|
| `resolves` | A offers a solution to the problem stated in B | A is a resolution or answer |
| `derives-from` | A was motivated by, built upon, or physically generated by B | The canonical parent→child chain. Covers both intellectual motivation AND physical causation (e.g., bug report → fix session). |
| `implements` | A is the concrete implementation of B | B is a spec or constitution; A is the code or concrete doc |
| `validates` | A provides evidence or tests that prove B | Increases B's `veracidade` over time |
| `exemplifies` | A is a concrete example of B | B is abstract; A is an instance |
| `refines` | A is a more detailed version of B | Incremental depth, same topic |
| `contextualizes` | A provides purely informational background for B | No functional dependency — if there is one, use `derives-from` |
| `depends-on` | A does not function without B | Stronger than `derives-from`: runtime dependency |
| `alternative-to` | A is a competing, discarded, or parallel alternative to B | Design decision not taken |
| `contradicts` | A is in tension with or refutes B ⚠️ | Flags inconsistency — must be resolved before promotion |
| `questions` | A raises open questions about B | Used in exploratory/draft nodes |
| `updates` | A is a more recent, incremental version of B | Minor version changes |
| `supersedes` | A is the direct structural successor of B, making B obsolete | Major version succession |
| `deprecates` | A replaces B informally or partially, marking B as no longer authoritative | Soft retirement |

---

## Appendix D: Quick Reference — The 7 Labels

Every vault document carries up to 7 classification labels. Each answers a different question. If two labels answered the same question, one would be redundant.

| Label | Question | What it captures | Independent of |
|-------|----------|-----------------|----------------|
| **`node_type`** | *What role does this document play?* | Kind of claim: axiom, premise, constitution, discovery, implementation-plan, spec, audit, conceptual, essay, test, backlog | All others — an axiom can be about any layer, any nature, any status |
| **`layer`** | *What part of the system does it concern?* | Topical scope: ontology, architecture, market, domain, application | `node_type` (a constitution can be about architecture or market), `nature` (scope ≠ format) |
| **`nature`** | *What structural format does it use?* | Reading instruction: explanatory prose, step-by-step, lookup table, or schema | `node_type` (a constitution can be a checklist or a schema), `layer` (format ≠ scope) |
| **`status`** | *How mature/trusted is it?* | Lifecycle position: draft → exploratory → active → consolidated → evergreen | `node_type` (an axiom starts as draft too), `nature` (format doesn't affect maturity) |
| **`veracidade`** | *How much evidence backs it?* | External evidence: how tested against reality | `convicção` (you can have evidence for something you ignore) |
| **`convicção`** | *How hard are we betting on it?* | Internal commitment: how much it drives decisions | `veracidade` (you can bet on something unproven) |
| **`tags`** | *What specific topics does it touch?* | Domain keywords: `#fidc`, `#event-system`, `#ccb` | All others — tags are purely topical, no epistemic weight |

> **Why not fewer labels?** If we merged `node_type` and `status` into one dimension, we couldn't distinguish "this is an axiom in draft" from "this is a premise that's consolidated." If we merged `layer` and `nature`, we couldn't distinguish "a market document written as a reference table" from "a market document written as a how-to." Each label captures information that NO other label can express.

---