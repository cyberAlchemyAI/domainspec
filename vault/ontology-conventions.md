---
tags: [vault, ontology]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: consolidated
version: 2.4.0
last_updated: 2026-06-09
---

# Vault Conventions

> Rules every node in the vault must follow. This is the vault's internal constitution — what determines quality, not just format.

---

## Objective

This document is the canonical reference for vault classification — the required frontmatter fields, the controlled vocabularies for each label, the confidence dimensions (`veracidade` and `convicção`), and the catalog of edge types. Every node in the vault is governed by it.

The classification system operates under the **orthogonality discipline**: each label is aimed at contributing information no other label provides, so the corpus stays low-redundancy as it grows. Orthogonality is currently a strategic bet, not a verified property — it is recorded as a premise in [`scope-and-domain-axes.md`](discovery/domainspec-vault-foundations/scope-and-domain-axes.md) D-1 (`veracidade: low`, `convicção: high`), pending the corpus-measurement layer that would let it graduate. Until then the discipline is enforced by review, not by computation. (See [Appendix A](#appendix-a-mathematical-foundation) for the framework we are aiming toward.)

The system is growable: labels may be added, merged, split, or retired as the vault evolves. When this constitution disagrees with an upstream discovery about a value's status, the discovery wins ([`epistemic-chain.md`](discovery/domainspec-vault-foundations/epistemic-chain.md) D-9).

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
node_type: axiom | premise | constitution | discovery | implementation-plan | spec | audit | conceptual | test | backlog | readme | research | domainspec-subagents-strategy | subagents-research | subagents-findings | discussion | experiment
is_session: true | false               # Is this a conversation/session record?
layer: ontology | architecture | market | domain | application  # Multi-value allowed
nature: explanatory | procedural | reference | technical        # Multi-value allowed
status: draft | exploratory | active | consolidated | evergreen
veracidade: high | medium | low        # Optional for non-belief docs
convicção: high | medium | low         # Optional for non-belief docs
version: 0.x.x
last_updated: YYYY-MM-DD
created_by: <username or email>   # Optional — provenance placeholder until event sourcing is in place
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
| `research`            | "It's exploration of options or evidence — supersede it with a discovery decision" |
| `domainspec-subagents-strategy`  | "Change it through governance, not informally"                           |
| `subagents-research`  | "It's the raw evidence produced by a domainspec-subagents-strategy dispatch — challenge by tracing back to the strategy's prompts and source data" |
| `subagents-findings`  | "It's the synthesis of subagents-research nodes from a single dispatch — challenge a claim by tracing it back to the research it cites" |
| `discussion`          | "It's multi-perspective debate — close it with a discovery or escalate"  |

### Linking rule for the `domainspec-subagents-strategy` / `subagents-research` / `subagents-findings` triad

These three node types are mutually dependent and **must always be linked** when they coexist:

- A `domainspec-subagents-strategy` document records the dispatch (who, what mode, what budget).
- One or more `subagents-research` documents are produced by that dispatch — each `subagents-research` declares `derives-from` → the `domainspec-subagents-strategy` that produced it.
- A `subagents-findings` document synthesizes one or more `subagents-research` nodes — the `subagents-findings` declares `derives-from` → every `subagents-research` it cites, AND `derives-from` → the originating `domainspec-subagents-strategy`.
- A `subagents-research` node may declare `contradicts` → another `subagents-research` node when their evidence disagrees. Contradiction between researches is a first-class signal — it is what the `subagents-findings` synthesis is supposed to surface, not hide.

A `subagents-research` or `subagents-findings` node without its corresponding `domainspec-subagents-strategy` link (or vice versa) is malformed. The grader (domainspec-subagents-strategy D-8 fidelity component) checks this triad at dispatch close.

### Why it matters

This is the most important label. It determines **how the document participates in the knowledge graph**. An axiom anchors the graph — everything derives from it. A premise is a branch that might be pruned. A constitution is a law that governs behavior. Without `node_type`, every document looks equally authoritative.

### How it differs from `status` and `convicção`

These three labels often get confused because they all relate to "trust." But they measure different things:

- **`node_type`** measures the **role** of the document — what kind of claim it makes. It almost never changes. An axiom stays an axiom. A spec stays a spec.
- **`status`** measures the **maturity** — how much has this been reviewed and tested? It changes frequently, starting at `draft` and growing toward `evergreen`.
- **`convicção`** measures the **bet** — how committed is the team to this? It shifts as strategy shifts. A premise can go from `high` to `low` convicção.

Example: `system-axioms.md` is `node_type: axiom` (permanent role — it's a foundational claim), `status: consolidated` (maturity — it's been reviewed), `convicção: high` (bet — we are committed to it). If it were brand new, it would still be `node_type: axiom` but `status: draft`. The role doesn't change; the maturity does.

The seventeen `node_type` values — `axiom`, `premise`, `constitution`, `discovery`, `implementation-plan`, `spec`, `audit`, `conceptual`, `test`, `backlog`, `readme`, `research`, `domainspec-subagents-strategy`, `subagents-research`, `subagents-findings`, `discussion`, `experiment` — each represent a distinct role with precise boundaries. For the full value definitions and differentiation criteria, see [Appendix B: Label Value Catalog](#appendix-b-label-value-catalog).

> **The knowledge lifecycle flow:** Documents naturally progress through epistemic roles: `discovery` (exploring possibilities) → `implementation-plan` (prescribing execution) → `spec` (describing current behavior). An `audit` document evaluates a `spec` against reality and feeds back into the cycle by spawning new discoveries or plans.

> **Why `discovery` and `implementation-plan` are not just `spec`:** Previously, `spec` encompassed documents with very different challenge responses. A discovery document says "explore or supersede me"; an implementation plan says "follow me or propose a revision"; a living spec says "update me if the code changed." These are distinct roles that require different agent behavior.

> **Can an axiom be a draft?** Yes — and it's one of the most important things in the vault. A `node_type: axiom` with `status: draft` means: *"Someone is proposing a new foundational truth. If accepted, everything built on top of it changes."* That is almost a paradigm shift, which is exactly why it must go through the full review process before reaching `consolidated`.

> **Why `session` is not a node_type:** Making `session` a `node_type` loses information. A session that defines the classification system plays a different role (`conceptual`) than a session that fixes a bug (`spec`). Being a conversation is captured by `is_session: true` — a boolean flag independent of the role. The `node_type` should reflect **what role the session's output plays**, not that it was a conversation.

> **When to read sessions:** Sessions are **provenance**, not reference material. They preserve the reasoning context behind decisions — the "why", not the "what". Agents should read specs, constitutions, and code to understand how the system works. Only read sessions when tracing *why* a specific decision was made — e.g., when a rule seems arbitrary or an architectural choice needs its original tradeoff analysis. (See [P-ONT-8](premise/ontology-premises.md) for the foundational premise.)

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

These dimensions are **meaningful for `axiom`, `premise`, and `audit`** — node types that make a single claim, bet, or evaluative judgment.

- **`axiom`** — "We take this as foundational." `veracidade` measures how well-established this is externally. `convicção` measures how deeply committed we are to building on it.
- **`premise`** — "We believe this, but may be wrong." The 2×2 matrix is most useful here: are we betting on something unproven? Have we proven something we're ignoring?
- **`audit`** — "We assessed the current state." `veracidade` measures how current and thorough the findings are. `convicção` measures how committed the team is to addressing the identified issues.

For `discovery`, `constitution`, `implementation-plan`, `spec`, `conceptual`, and `test`, these fields should be **omitted**:
- A `discovery` maps a design space — multiple options, multiple confidence levels per option. A single `veracidade`/`convicção` score per document doesn't fit; per-option confidence belongs inline in the body. If the discovery's exploration converges on a claim, that claim graduates into a `premise` or `axiom`, which carries the labels.
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
| `other.md` | `derives-from` | description of the relationship |
```

### Directionality Principle

**Edges between vault nodes must be declared on both endpoints.** Every relationship in the vault between two vault nodes appears in two `## Connections` blocks: the source document declares the forward edge (e.g., `derives-from`), and the target document declares the inverse (e.g., `derives`). Both sides are written explicitly in Markdown — there is no SQL-layer inference.

**Why both sides:** local readability. Opening either document shows the relationship without external tooling. The cost is duplication; the mitigation is a periodic audit script that flags asymmetric edges (one side declares the relationship, the other doesn't) — those are bugs, not freedom.

**The forward/inverse name pair** is fixed by the catalog (Appendix C). Authors do not invent inverses ad-hoc. `contradicts` is the only symmetric edge — both sides use the same name.

**Carve-out (skills/agents): forward-only edges into `.claude/skills/*` and `.claude/agents/*` are legal-by-design.** Vault documents MAY declare forward edges (`cites`, `operationalized-by`, `proposes-edit`, etc.) targeting `.claude/skills/**` and `.claude/agents/**` files. Those targets are NOT vault graph nodes — they have no `node_type` and no `## Connections` block. No inverse is required or expected on the target. The audit script must NOT flag these forward-only edges as asymmetric. See "Carve-out: edges into skill and agent files" immediately below for the formal statement and rationale.

**Migration note**: documents authored before this rule shipped may declare only one side. They are non-conformant and will be swept by the audit-driven migration; do not rely on the SQL/visualization layer to materialize the missing direction.

### Carve-out: edges into skill and agent files

Vault documents MAY declare forward edges (e.g., `cites`, `operationalized-by`, `proposes-edit`) into `.claude/skills/*.md` and `.claude/agents/*.md` files. These edges are **legal-by-design and forward-only**:

- The source vault document writes the forward edge in its `## Connections` block as usual.
- The target skill/agent file does NOT carry a `## Connections` block.
- No inverse row is written or expected on the target.
- The audit script must NOT flag these forward-only edges as asymmetric or missing-inverse.

**Rationale.** Skill files (`.claude/skills/**`) and agent files (`.claude/agents/**`) are operational artifacts that govern runtime behavior. They are not vault graph nodes — they have no `node_type`, no `veracidade`, no `convicção`, and they do not participate in the epistemic chain. Treating them as graph nodes would force them to carry vault frontmatter and to participate in bidirectionality, conflating governance artifacts with knowledge artifacts.

**Scope.** This carve-out is limited to `.claude/skills/**` and `.claude/agents/**`. Other non-vault paths (`.planning/**`, `.github/**`, sibling repos) remain a separate question — see OQ-C in `vault/discovery/curator-pipeline-integration/discovery.md`. Operationally, this carve-out is also restated in `.claude/skills/custom/edges.md` (Exception section) and `.claude/skills/custom/edge-catalog.md` (authoring rules).

### Carve-out: edges originating from session nodes

*Edges originating from a session node (`is_session: true`) are forward-only by source: they live on the session's `## Connections` block, but no inverse row is written on the target document. The auditor skips bidirectionality checks for edges whose source has `is_session: true`.*

**Rationale.** Sessions are transient activity records — provenance for what happened in a single sitting, not stable graph nodes that anchor reference structure. Propagating an inverse row from every session into every document the session touched would accumulate noise on stable docs over time without adding signal: a constitution does not gain epistemic weight from being listed as `modified-by` a hundred sessions, and the session-side `## Connections` block already preserves the same provenance. Sessions are one-sided by design.

**Auditor implication.** The asymmetry check skips edges whose source has `is_session: true`, alongside the existing skips for forward-only-by-target carve-outs into `.claude/skills/**` and `.claude/agents/**`.

For the full catalog of 21 forward edges (40 names total counting inverses) with their directionality and usage criteria, see [Appendix C: Edge Type Catalog](#appendix-c-edge-type-catalog).

> `contradicts` is the most valuable edge type: it flags inconsistencies that must be resolved before a document moves up a level. Its **absence does not mean the vault is contradiction-free** — only that no contradictions have been formally identified yet.

> `validates` is the mechanism for a document to increase its `veracidade` over time.

---

## The Orthogonality Principle

> **A new label or node should only be created if it adds orthogonal information to what already exists.**

Orthogonality is **a guiding rule** for how labels and nodes are added to the ontology: each new label or node should contribute information that no existing label or node already carries. In information-theoretic terms, two labels are orthogonal when knowing one tells you nothing about the other — their **mutual information is zero**. This is a discipline applied at review time — not a property the system currently measures. See [Appendix A](#appendix-a-mathematical-foundation) for the framework, and [`scope-and-domain-axes.md`](discovery/domainspec-vault-foundations/scope-and-domain-axes.md) D-1 for why it is recorded as a premise rather than an axiom.

This guiding rule applies at **two levels**:

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

> **This appendix is a guiding principle, not a measurement.** The formulas below describe the framework the classification system is aimed toward — once the corpus-measurement layer lands (see [`scope-and-domain-axes.md`](discovery/domainspec-vault-foundations/scope-and-domain-axes.md) OQ-6), they become tests. Until then, orthogonality is enforced by review under the discipline described in [Section 9: The Orthogonality Principle](#the-orthogonality-principle).

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
| `discovery`           | Exploratory document that maps the possibility space for a decision or feature. Investigates options, trade-offs, and feasibility without prescribing action. Confidence labels (`veracidade` / `convicção`) are **omitted** — a discovery holds multiple options at varying confidence; per-option confidence belongs inline in the body. **Location**: discoveries may live in `vault/discovery/` (vault-internal — schema, ontology, agents) OR in application/feature folders (work-context — feature design, refactor scoping). A discovery in either location may amend a canonical vault file (e.g., add a `node_type` value to `ontology-conventions.md`) by following the schema-evolution gate; the discovery is the authorized channel regardless of where it lives. | "It's exploration — enrich it or supersede it with a decision"           | `discovery-gravity-strategies.md`, `cloud-vision-migration-discovery.md`    |
| `implementation-plan` | Actionable execution roadmap with phases, checkboxes, dependencies, and success criteria. Prescribes the steps to achieve a goal.                                                                                                                            | "Follow it, update it if scope changed, or supersede it with a new plan" | `ccb-refactor-phases.md`, `gcp-infrastructure-migration.md`                 |
| `spec`                | Behavioral description of how a part of the system works. A living technical document that stays in sync with code.                                                                                                                                          | "Update it if the code changed"                                          | `ccb-spec-v1.md`, `business-rules.md`                                       |
| `audit`               | Evaluative document that assesses the current state of the system against constitutions, axioms, or quality standards. Identifies violations, risks, and gaps.                                                                                               | "Run the audit again and see if the findings still hold"                 | `shared-services-refactor.md`                                               |
| `conceptual`          | Explanatory context that grounds understanding without prescribing behavior. Covers background knowledge, vocabulary, domain context, market reality.                                                                                                        | "It's context — you can enrich or correct it"                            | `fidc-and-credit-rights.md`, `dictionary-business.md`, `mission.md`         |
| `test`                | A record of executable validation. Documents test coverage analysis, test implementation decisions, gap identification, and pass/fail results. Its primary epistemic role is generating evidence that increases the `veracidade` of specs and constitutions. | "Run the tests and see if they pass"                                     | Session covering test coverage gaps, test writing, or test failure analysis |
| `backlog`             | A prioritized list of pending work items, feature requests, technical debt, or open questions awaiting scheduling. Tracks *what needs to be done* without prescribing *how*.                                                                                 | "Prioritize it, schedule it, or close it — it tracks pending work"       | `backlog.md`                                                                |
| `research`            | Exploration and evidence-gathering produced by a single investigation (one agent, one pass, or one source). Feeds into a discovery; never authoritative on its own. May declare `contradicts` → another `research` when evidence disagrees. See `vault/discovery/domainspec-vault-foundations/epistemic-chain.md` D-2. | "It's exploration of options or evidence — supersede it with a discovery decision" | Standalone research notes feeding a discovery |
| `domainspec-subagents-strategy`  | Dispatch-strategy document carrying mode, capability tiers, and lifecycle for a multi-agent task. The originating node for a dispatch's `subagents-research` and `subagents-findings` outputs — both must `derives-from` the strategy. See `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md` D-10, D-11.                                                                                       | "Change it through governance, not informally"                           | Strategy doc governing how subagents are dispatched                         |
| `subagents-research`  | Raw evidence produced by a domainspec-subagents-strategy dispatch. One file per child subagent, or a consolidated file. Always linked to its parent strategy via `derives-from`. | "It's the raw evidence produced by a domainspec-subagents-strategy dispatch — challenge by tracing back to the strategy's prompts and source data" | `domainspec-subagents-research.md` from a dispatch |
| `subagents-findings`  | Synthesis of subagents-research nodes from a single dispatch. One file per dispatch. Cites every research file via `derives-from` and the parent strategy via `derives-from`. | "It's the synthesis of subagents-research nodes from a single dispatch — challenge a claim by tracing it back to the research it cites" | `domainspec-subagents-findings.md` from a dispatch |
| `discussion`          | Multi-perspective debate log. Captures tensions; resolves to a discovery or remains open. See `vault/discovery/robot-talks-definitions/examples/robots-discussing.md` (this conversation).                                                                    | "It's multi-perspective debate — close it with a discovery or escalate"  | Robot-talks debate log capturing cross-layer tensions                       |
| `experiment`          | Pre-registered, falsifiable experiment. A single hypothesis with numeric gates and falsifiers frozen *before* the run; results and adjudication live in sibling RUN/VERDICT files, never the proposal. Epistemically behaves like a `premise` (a claim evidence updates), but carries an immutable-once-frozen pre-registration contract enforced by `experiments/tools/validate_proposal.py`. Lives under `experiments/E<N>-<slug>/`. See the `experiments/PROTOCOL.md` scaffolded by `partition-scaffold`.                                                                    | "Run it against the frozen gates and read the verdict — don't edit the gate after the fact" | `experiments/E1-…/PROPOSAL.md`                                              |

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
| **implementation-plan** | Plan tested against reality; phases completed successfully | Untested roadmap based on assumptions |
| **spec** | Description matches current code behavior exactly | Code has drifted from the spec |
| **audit** | Findings verified against current codebase; issues reproduced | Audit based on stale code or incomplete review |
| **conceptual** | Content verified against authoritative sources | Author's interpretation, not cross-checked |
| **test** | All tests pass and cover the claimed business rules | Tests are stale, skipped, or cover the wrong behavior |
| **backlog** | Items are current, prioritized, and reflect real pending work | Stale items that were completed or abandoned without updating |

---

## Appendix C: Edge Type Catalog

The vault has **22 forward edges** organized into three semantically distinct categories. Each category encodes a different kind of relationship: **epistemic edges** describe the logical structure of formalized knowledge; **provenance edges** describe what sessions causally did; **reference edges** are bibliographic pointers that any node type may originate.

This three-way split is the load-bearing design decision of the catalog. A session cannot originate an epistemic edge — doing so would make the session an epistemic actor, which it is not. Sessions are causal/temporal processes. Their intellectual contributions are expressed through the artifacts they create, which then carry epistemic edges. Formalized nodes cannot originate provenance edges — they do not "do" things; sessions do.

Per the Directionality Principle (Section 8), every forward edge has an inverse name and both must be declared in Markdown on the respective endpoints — except when the target is a `.claude/skills/*` or `.claude/agents/*` file (see Section 8 carve-out).

---

### Epistemic edges

Describe logical or intellectual relationships between **formalized knowledge nodes** (discoveries, axioms, premises, constitutions, specs, implementation-plans, audits, tests, conceptuals, research, findings). Sessions cannot originate these edges. The epistemic claim belongs on the artifact that makes it.

| Forward | Inverse | Source `node_type` | Target `node_type` | Cardinality | Definition |
|---------|---------|--------------------|--------------------|-------------|------------|
| `derives-from` | `derives` | formalized nodes | formalized nodes | N:M | A draws intellectual or evidential basis from B. The chain backbone — research derives from strategy, discovery derives from research, premise derives from discovery, etc. If a session synthesizes two discoveries into a new third, the session uses `creates`; the new artifact then declares `derives-from` toward its sources. |
| `supersedes` | `superseded-by` | discovery, implementation-plan, constitution, spec | (same node_type) | 1:1 | A wholesale replaces B. B becomes historical. |
| `contradicts` | `contradicts` (symmetric) | formalized nodes | formalized nodes | N:M | A logically conflicts with B — a symmetric, artifact-level declaration. Must be resolved before either document promotes. **Usage constraint:** only declared inside an artifact, never by a session directly. When a session observes a conflict, it uses `surfaces-conflict` (see Provenance edges). |
| `codified-as` | `codifies` | premise, axiom, discovery | constitution | 1:N | A is rendered as an enforceable rule by B. Chain-mandated (epistemic-chain.md D-4). |
| `operationalized-by` | `operationalizes` | constitution, discovery | skill | 1:N | A is executed as runnable behavior by skill B. Chain-mandated (epistemic-chain.md D-4). |
| `implements` | `implemented-by` | implementation-plan | discovery | N:1 | A executes the decisions recorded in B. |
| `validates` | `validated-by` | audit, test, research, subagents-research | premise, axiom, spec | N:M | A provides evidence about B. Increases B's `veracidade` over time. Chain-mandated (epistemic-chain.md D-5). |
| `refines` | `refined-by` | discovery, spec | discovery, spec, constitution | N:1 | A makes B more specific without replacing it. Distinct from `supersedes` (replacement) and `derives-from` (origin). |
| `governed-by` | `governs` | discovery, implementation-plan, spec | discovery, constitution | N:1 | A's behavior is bound by the rules of B. |
| `subclass-of` | `superclass-of` | conceptual, premise (also domain-axis values) | conceptual, premise | N:1 (tree-constrained) | A is a more specific kind of B. Tree, not DAG — multiple inheritance forbidden. |
| `part-of` | `has-part` | conceptual, spec | conceptual, spec | N:1 | A is a structural component of B. |
| `alternative-to` | `has-alternative` | discovery (Alternatives section) | discovery | 1:N | A was considered as a competing path before B's decision was made. |
| `synthesized-by` | `synthesizes` | findings | research | N:1 | The findings of one lens are consolidated into a research synthesis. Forward-in-time edge: findings exist first, research synthesizes them. Declared bidirectionally between every `lenses/<slug>/findings.md` and the folder's `research/research.md`. |
| `corroborates` | `corroborated-by` | findings | findings | N:M | **Scoped to lens findings only** (lens-research-discovery pattern). A lens re-runs / verifies / hardens the claims of another lens (typically a `[model-recall]` lens corroborated by a `[web-fetched]` re-dispatch). Both endpoints must be `findings` nodes within the same discovery folder. Do not use as a general evidence edge — `validates` covers that. |
| `retrofits` | *(no inverse — see note)* | research | findings | N:M | A backfill marker declared on a `research.md` when the research synthesis was written AFTER its lens findings and after the parent discovery already existed. Forward-only by design — the canonical `synthesized-by`/`synthesizes` pair carries the bidirectionality; `retrofits` adds honest provenance direction. Used only when `backfilled: true` on the research file. **Note:** `retrofits` intentionally lacks an inverse. If query patterns require "what did this node retrofit onto," trace via the parent `research.md`. |

---

### Provenance edges

Describe what **sessions** causally did — temporal and causal relationships. All have source `node_type` matching `is_session: true` documents. Sessions are processes; these edges encode what the session *did*, not what it *knows*.

`refutes` can target formalized nodes (discoveries, axioms, premises, specs). Sessions can argue against formalized claims. This asymmetry is intentional: sessions are causal actors with argumentative standing; formalized nodes resolve disputes between themselves via `contradicts` + `supersedes`.

**`surfaces-conflict` vs `opens-question`:** Use `surfaces-conflict` when the session identifies a specific logical tension between two named nodes. Use `opens-question` when the session notices something unresolved but cannot yet name the conflicting pair — or when the question is not primarily about a logical conflict. If you find yourself writing `opens-question` and then naming two nodes that logically exclude each other, switch to `surfaces-conflict`.

| Forward | Inverse | Source `node_type` | Target `node_type` | Cardinality | Definition |
|---------|---------|--------------------|--------------------|-------------|------------|
| `continues-from` | `continued-by` | session | session | 1:1 | A is a temporal continuation of B; same investigation across two sittings. |
| `creates` | `created-by` | session | any | N:M | A produced B as output. Replaces the deprecated `provenance-for`. |
| `modifies` | `modified-by` | session | any | N:M | A changed B's content (without wholesale replacement). |
| `revisits` | `revisited-by` | session | discovery, premise | N:M | A reconsidered the questions or decisions recorded in B without necessarily refuting them. |
| `refutes` | `refuted-by` | session | session, discovery, premise, axiom, spec | N:M | A actively argues against B. Takes a position. Stronger than `surfaces-conflict` (which is neutral). Intentional and argumentative. |
| `surfaces-conflict` | `conflict-surfaced-by` | session | any two formalized nodes (declare once per conflicting pair) | N:M | A observed a logical tension between two formalized nodes without taking a position. Weaker than `refutes`; stronger than `opens-question`. Use when the conflict is specific and nameable. The conflict becomes a formal `contradicts` edge only when a subsequent artifact declares it. |
| `opens-question` | `question-opened-by` | session | discovery | N:M | A surfaces a new open question recorded in B's `## Open Questions` section. Use when the question is not primarily about a named logical conflict between two nodes. |
| `closes-question` | `question-closed-by` | session | discovery | N:M | A resolves an open question previously recorded in B. |
| `consumes` | `consumed-by` | session | any | N:M | A read or used B as input without deriving new claims from it. Distinct from `derives-from` (which carries intellectual lineage). |

---

### Reference edges

Bibliographic pointers. Any node type — session or formalized — may originate these. They record *use* without implying derivation or causality.

| Forward | Inverse | Source `node_type` | Target `node_type` | Cardinality | Definition |
|---------|---------|--------------------|--------------------|-------------|------------|
| `cites` | `cited-by` | any | any | N:M | A cites B as supporting a load-bearing claim. Removing the cite weakens the argument. Replaces the deprecated `references` and `contextualizes`. |

### Edges deprecated by this catalog

The following edges from previous versions of this constitution are no longer canonical. Existing vault documents using them should migrate (audit script enumerates non-conformant edges):

| Old edge | Folds into | Notes |
|----------|------------|-------|
| `resolves` | `closes-question` (for sessions) or `supersedes` (for documents) | Was ambiguous about whether the relationship was structural or session-driven. |
| `references` | `cites` | Generic-mention edges collapse into `cites` with prose for nuance. |
| `contextualizes` | `cites` | Same reasoning. |
| `exemplifies` | (defer) | Was the inverse of `instance-of`, which is also deferred until first vault use. |
| `depends-on` | `derives-from` | Distinction between intellectual derivation and runtime dependency was rarely needed in practice. |
| `questions` | `opens-question` | Session-specific framing now explicit. |
| `updates` | (none — use `version:` frontmatter) | Minor version bumps are tracked in frontmatter, not as edges. |
| `deprecates` | (none — use `status: deprecated`) | Deprecation is a state of the document, not a relationship to another. |
| `produces` / `produced-by` | `derives-from` / `derives` | Per the bidirectionality rule, the canonical direction is `derives-from`. |
| `provenance-for` | `creates` | Sessions create the documents whose provenance they are. |
| `grounds`, `grounded-by` | (none) | Old SQL-layer inverses; with bidirectional Markdown, inverses are explicit and named in this catalog. |

### Authoring rules

1. **Both sides must declare (between vault nodes).** A `## Connections` block on the source declares the forward edge; the target document declares the inverse. Both forms are in this catalog. Asymmetric declarations between vault nodes are bugs. **Exception:** edges into `.claude/skills/*.md` and `.claude/agents/*.md` are forward-only by design — those targets are not vault graph nodes, carry no `## Connections` block, and require no inverse. See Section 8 "Carve-out: edges into skill and agent files" for the formal statement.
2. **Do not invent edges.** If a relationship does not fit, propose a new edge through a discovery document — do not coin one inline.
3. **`contradicts` is special.** Both sides use the same name (it is symmetric). Both must still declare. Sessions never originate `contradicts` — use `surfaces-conflict` instead.
4. **Sessions ship `## Connections` too.** Older sessions used `## Contradictions`, `## Files touched`, etc. — those are non-conformant and will be migrated.
5. **Respect the category boundary.** Sessions originate only provenance or reference edges. Formalized nodes originate only epistemic or reference edges. A session that has intellectual content expresses it through the artifacts it creates, not by originating epistemic edges directly.

---

## Appendix D: Quick Reference — The 7 Labels

Every vault document carries up to 7 classification labels. Each answers a different question. If two labels answered the same question, one would be redundant.

| Label | Question | What it captures | Independent of |
|-------|----------|-----------------|----------------|
| **`node_type`** | *What role does this document play?* | Kind of claim: axiom, premise, constitution, discovery, implementation-plan, spec, audit, conceptual, test, backlog, readme, research, domainspec-subagents-strategy, subagents-research, subagents-findings, discussion, experiment (17 values) | All others — an axiom can be about any layer, any nature, any status |
| **`layer`** | *What part of the system does it concern?* | Topical scope: ontology, architecture, market, domain, application | `node_type` (a constitution can be about architecture or market), `nature` (scope ≠ format) |
| **`nature`** | *What structural format does it use?* | Reading instruction: explanatory prose, step-by-step, lookup table, or schema | `node_type` (a constitution can be a checklist or a schema), `layer` (format ≠ scope) |
| **`status`** | *How mature/trusted is it?* | Lifecycle position: draft → exploratory → active → consolidated → evergreen | `node_type` (an axiom starts as draft too), `nature` (format doesn't affect maturity) |
| **`veracidade`** | *How much evidence backs it?* | External evidence: how tested against reality | `convicção` (you can have evidence for something you ignore) |
| **`convicção`** | *How hard are we betting on it?* | Internal commitment: how much it drives decisions | `veracidade` (you can bet on something unproven) |
| **`tags`** | *What specific topics does it touch?* | Domain keywords: `#fidc`, `#event-system`, `#ccb` | All others — tags are purely topical, no epistemic weight |
| **`created_by`** | *Who created this document?* | Provenance: username or email of the original author. Optional — omit when unknown. Placeholder until event-sourced authorship is implemented. | All others — authorship is independent of role, scope, format, or maturity |

> **Why not fewer labels?** If we merged `node_type` and `status` into one dimension, we couldn't distinguish "this is an axiom in draft" from "this is a premise that's consolidated." If we merged `layer` and `nature`, we couldn't distinguish "a market document written as a reference table" from "a market document written as a how-to." Each label captures information that NO other label can express.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md` | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session landed Section 8's formal carve-out for forward-only edges into `.claude/skills/**` and `.claude/agents/**`, and bootstrapped this `## Connections` block. |
| `discovery/domainspec-vault-foundations/research/scope-and-domain-axes-evidence.md` | `cited-by` | The scope-and-domain-axes evidence survey cites this conventions document as the direct input for §3 growth rules, §4 structural commitment, and §8 scope definitions. |
| `premise/ontology-premises.md` | `derives` | This conventions document codifies (and therefore derives from) the ontology premises. |
| `discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md` | `cited-by` | The vault-edges domainspec-subagents-strategy research cites this conventions document as the constitution whose Appendix C edge catalog the research is positioned to refine. |
| `vault/foundational-knowledges.md` | `cited-by` | The foundational-knowledges L3/L4 layers cite Section 8 bidirectionality and Appendix C edge catalog as the operational expression of typed-graph knowledge representation. |
| [conceptual/epistemic-principles.md](conceptual/epistemic-principles.md) | `cited-by` | The epistemic-principles catalog cites this conventions document as the operational expression of the Orthogonality Principle (inverse added 2026-05-19 alongside epistemic-principles' retarget of its stale `house_project` link). |