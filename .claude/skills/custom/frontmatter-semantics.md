---
description: Concise definition of every frontmatter tag and its allowed values — what each one means, when to use it
---

# Frontmatter Semantics

## Objective

Define what every frontmatter tag and value *means*, with just enough context to pick correctly. This is the layer between the cheatsheet (`frontmatter.md` — syntax + pickers) and the full treatise (`docs/vault/ontology-conventions.md` — rationale, math, edge catalog). Answers: "what does this tag/value actually claim about the document?"

---

## `tags` — Domain keywords

Topical labels only. Business or technical domains the document touches. Never epistemic (no `#draft`, `#trusted`), never maturity, never role — those live in other fields.

- **Business:** `#fidc`, `#credit-rights`, `#acquisition`, `#liquidation`, `#inventory`, `#ccb`, `#mission`
- **Technical:** `#architecture`, `#application`, `#infrastructure`, `#pipeline`, `#event-system`, `#ontology`
- **Vault:** `#vault`, `#agents`

---

## `node_type` — Document role

What kind of claim the document makes and how it participates in the knowledge graph. Almost never changes after creation.

| Value | Meaning |
|-------|---------|
| `axiom` | Foundational truth. Everything else derives from it. Revisiting breaks dependents. |
| `premise` | A belief we hold, open to revision. Show evidence to update it. |
| `constitution` | A rule that governs behavior. Only changed through governance. |
| `discovery` | Exploration of possibilities before a decision. Enrich or supersede. |
| `implementation-plan` | Prescribed steps to execute. Follow, revise, or supersede. |
| `spec` | Description of current system behavior. Must match the code. |
| `audit` | Evaluation of current state against a standard. Run again to verify. |
| `conceptual` | Background context. Not authoritative — informs but doesn't enforce. |
| `essay` | Committed argument from experience. Engage the reasoning or counter it. |
| `test` | Executable verification. Either passes or fails. |
| `backlog` | Pending work. Prioritize, schedule, or close. |
| `readme` | Navigation document for a directory. Reflects what's inside. |

> **Lifecycle flow:** `discovery` → `implementation-plan` → `spec`; `audit` evaluates specs and spawns new discoveries.

---

## `is_session` — Is this a conversation record?

- `true` — the document IS a session log (scratchpad, conversation transcript).
- `false` — everything else, including docs produced *by* a session (use `session_ref` for provenance).

---

## `session_ref` — Provenance pointer (optional)

The session ID that produced this document. Enables forward tracing ("what did session X produce?"). Orthogonal to `is_session`:

- A session log: `is_session: true`, `session_ref: null`
- A spec written during session `m9k4w`: `is_session: false`, `session_ref: m9k4w`

---

## `layer` — System scope

What part of the system or company the document concerns. Multi-value allowed (e.g., `layer: architecture, domain`).

| Value | Meaning |
|-------|---------|
| `ontology` | The vault's own classification system, conventions, meta-rules. |
| `architecture` | Cross-cutting technical structure: boundaries, protocols, event system, infrastructure. |
| `market` | External reality: industry, regulation, competitors, customer behavior. |
| `domain` | Business logic inside a bounded context (acquisition, liquidation, inventory, etc.). |
| `application` | End-user-facing concerns: UI, workflows, product behavior. |

---

## `nature` — Document format

The *shape* of the text if printed. A reading instruction for agents. Multi-value allowed.

| Value | Meaning |
|-------|---------|
| `explanatory` | Prose explaining ideas. Read linearly for understanding. |
| `procedural` | Numbered steps or checklist. Follow in order to execute. |
| `reference` | Lookup structure (table, catalog, dictionary). Jump to the specific entry. |
| `technical` | Code, schema, config, diagram. Interpret as a technical artifact. |

---

## `status` — Maturity level

How much the document has been tested against reality. Progresses forward (and occasionally backward) through the lifecycle.

| Value | Meaning |
|-------|---------|
| `draft` | Just written. Not reviewed. Treat with skepticism. |
| `exploratory` | Actively being investigated. Conclusions unstable. |
| `active` | In use and being iterated on. Trusted but still changing. |
| `consolidated` | Reviewed, stable, low churn. Safe to build on. |
| `evergreen` | Foundational and durable. Changing requires strong justification. |

> **Hard boundary:** a higher-level doc cannot derive authority from a lower-level doc. A `consolidated` constitution may cite a `draft` session as context, not as source of truth.

---

## `veracidade` — External evidence

How much the world confirms this. Changes through data, tests, production results.

| Value | Meaning |
|-------|---------|
| `high` | Tested and confirmed by reality. |
| `medium` | Partial evidence. Some confirmation, some gaps. |
| `low` | Untested or weakly evidenced. Speculative. |

**Applicable for:** `axiom`, `premise`, `discovery`, `audit`, `essay`. Omit for `constitution`, `implementation-plan`, `spec`, `conceptual`, `test`, `backlog`, `readme`.

---

## `convicção` — Internal commitment

How hard the team is betting on this. Changes through strategic decisions.

| Value | Meaning |
|-------|---------|
| `high` | Building around it. Resources committed. |
| `medium` | Taking it seriously but hedging. |
| `low` | Not committing resources. Recorded but parked. |

**Applicable for:** same as `veracidade` — `axiom`, `premise`, `discovery`, `audit`, `essay`.

### The 2×2 matrix

| | `convicção: high` | `convicção: low` |
|---|---|---|
| `veracidade: high` | **Consolidated law** — proven and driving design | **Ignored fact** — true but not acted on |
| `veracidade: low` | **Strategic bet** — betting before proof | **Loose thread** — untested, parked |

---

## `version` — Document version

Semantic-ish: `0.x.x` for pre-stable documents, bump minor for substantive edits, patch for small corrections.

---

## `last_updated` — Date of last substantive edit

`YYYY-MM-DD`. Update whenever you change content, not whenever you touch the file.

---

## See also

- `.claude/skills/custom/frontmatter.md` — the cheatsheet (schema + pickers + `## Objective` rule)
- `docs/vault/ontology-conventions.md` — full rationale, mathematical foundation, edge type catalog
- `docs/vault/confidence-levels.md` — lifecycle promotion criteria