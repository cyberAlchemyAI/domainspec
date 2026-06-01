---
description: Frontmatter reference for any new .md file in the vault — every field, every value, every meaning
---

# Frontmatter Cheatsheet

Frontmatter is the `---`-delimited YAML block at the top of every `.md` file. **Line 1 of the file is the opening `---`** — no blank lines, comments, or content before it.

## Schema

```yaml
---
tags: []
node_type: <one of the values below>
is_session: true | false
layer: <one or more of the values below>
nature: <one or more of the values below>
status: draft | exploratory | active | consolidated | evergreen
veracidade: high | medium | low   # required for axiom/premise; optional for discovery/audit; omit otherwise
convicção: high | medium | low    # required for axiom/premise; optional for discovery/audit; omit otherwise
version: 0.x.x
last_updated: YYYY-MM-DD
created_by: <username or email>   # optional — provenance placeholder until event sourcing is in place
---
```

## Fields

### `tags`
Free-form list of cross-cutting topic labels. No fixed enum. Used for search and informal grouping.

### `node_type`
What kind of document this is. Single value. Drives the "if challenged, the right response is..." semantics.

| Value | Meaning |
|-------|---------|
| `axiom` | Foundational truth — revisiting it breaks everything built on it |
| `premise` | Belief held until evidence updates it |
| `constitution` | Governance rule — change through governance, not informally |
| `discovery` | Exploratory finding — enrich or supersede with a decision |
| `implementation-plan` | Actionable plan — follow, update if scope changed, or supersede |
| `spec` | Specification of what code/system does — update when code changes |
| `audit` | Point-in-time inspection — re-run to refresh findings |
| `conceptual` | Context/background — enrich or correct (under review for removal) |
| `test` | Executable check — run it to verify |
| `backlog` | Pending items — prioritize, schedule, or close |
| `readme` | Directory orientation — update to reflect what's in the directory |
| `research` | Exploration of options/evidence — supersede with a discovery decision |
| `domainspec-subagents-strategy` | Governed strategy for dispatching subagents — change through governance |
| `subagents-research` | Raw evidence from one domainspec-subagents-strategy dispatch — challenge by tracing back to the strategy's prompts and source data |
| `subagents-findings` | Synthesis of subagents-research from one dispatch — challenge a claim by tracing it to the research it cites |
| `discussion` | Multi-perspective debate — close with a discovery or escalate |
| `findings` | One lens's output inside a `lenses/<slug>/findings.md` slot. Frozen on write; supersede by re-running the lens (new slug + new findings.md). |
| `research-synthesis` | Executive summary of a `research/research.md`. Hard cap ≤500 words body. Adds no analysis; cites `research.md` for every claim. |
| `agent-dispatch` | Re-runnable snapshot of one dispatched agent (prompt verbatim, model, tools, context paths). Frozen on write. Lives at `lenses/<slug>/dispatch.md`. Optional — omit for backfills where the prompt is unrecoverable. |

### `is_session`
Whether this file is a conversation/session record.

| Value | Meaning |
|-------|---------|
| `true` | This document IS a session record (lives under `vault/sessions/`) |
| `false` | This document is not a session record |

### `layer`
Which conceptual layer the document belongs to. Multi-value allowed (`layer: architecture, domain`).

| Value | Meaning |
|-------|---------|
| `ontology` | Meta-system: how knowledge itself is organized |
| `architecture` | System structure, components, and their relationships |
| `market` | External context — users, business, environment |
| `domain` | Problem-domain concepts and rules |
| `application` | Concrete features, code, deployments |

### `nature`
The document's mode of expression. Multi-value allowed.

| Value | Meaning |
|-------|---------|
| `explanatory` | Explains why or what — meant to be read and understood |
| `procedural` | Describes how to do something — meant to be followed |
| `reference` | Looked up, not read sequentially |
| `technical` | Low-level, implementation-bound detail |

### `status`
Lifecycle stage. Start at `draft`.

| Value | Meaning |
|-------|---------|
| `draft` | Being written; not yet ready for use |
| `exploratory` | Usable but expected to change |
| `active` | Current and load-bearing |
| `consolidated` | Stable; changes are deliberate |
| `evergreen` | Long-lived reference; updated when underlying truth changes |

### `veracidade`
Confidence the claim matches reality. Per `ontology-conventions.md` line 61, this field is **optional for non-belief docs**.

- **Required** for `axiom`, `premise` — these are belief docs whose whole point is a tracked confidence level.
- **Optional** for `discovery`, `audit` — include only when the doc commits to a single load-bearing stance. Omit when a `discovery` holds multiple options at varying confidence (per-option confidence belongs inline in the doc body).
- **Omit** for all other types (`constitution`, `spec`, `implementation-plan`, `readme`, `conceptual`, `test`, `backlog`, `research`, `subagents-*`, `discussion`). For `research`, `subagents-*`, `discussion` see ontology-conventions.md §6.

| Value | Meaning |
|-------|---------|
| `high` | Strong evidence supports the claim |
| `medium` | Partial evidence or contested |
| `low` | Speculative or weakly supported |

### `convicção`
Author's commitment to the claim, independent of evidence. Same applicability as `veracidade`:

- **Required** for `axiom`, `premise`.
- **Optional** for `discovery`, `audit` — include only when the doc commits to a single load-bearing stance.
- **Omit** for all other types.

| Value | Meaning |
|-------|---------|
| `high` | Willing to defend strongly |
| `medium` | Open to revision |
| `low` | Tentative — held lightly |

### `version`
Semver `0.x.x`. Bump on substantive change to the document's content.

### `last_updated`
`YYYY-MM-DD` of the last meaningful change.

### `created_by`
Username or email of the original author. **Optional** — include when known, omit when authorship is unclear. This is a provenance placeholder; it will be superseded by event-sourced authorship once the platform tracks document creation events. A single string value — do not use a list.

## Lens-Research-Discovery convention fields

These fields apply only to `findings`, `research`, and `research-synthesis` node types inside a `vault/discovery/<topic>/` folder following the lens-research-discovery layout. See `.claude/skills/custom/lens-research-discovery-layout.md` for the full convention.

### `dispatch_status` — on `findings` only

| Value | Meaning |
|-------|---------|
| `live` | Dispatch artifact (`dispatch.md`) exists alongside this `findings.md` — re-runnable |
| `historical` | Pre-convention lens; dispatch metadata is embedded in the frontmatter rather than a separate file |
| `backfilled-no-prompt-recoverable` | Pre-convention lens; literal prompt is unrecoverable. No `dispatch.md` exists or will be created |

### `lens_order` — on `findings` only (optional)

| Value | Meaning |
|-------|---------|
| `first` | First-order lens — investigates the discovery's object directly |
| `second` | Meta-lens — investigates the first-order lens set itself (cross-cutting, gap-analysis, adversarial-review) |

Omit for plain first-order lenses; the convention default is `first`.

### `backfilled` — on `research` only

| Value | Meaning |
|-------|---------|
| `true` | Research synthesis was written AFTER `discovery.md` already existed. Carry a prominent backfill note at the top of the body. |
| `false` | Research synthesis was written BEFORE the discovery (causal order). |

### `analysis-method` — on `research` only (required when `backfilled: true`)

| Value | Meaning |
|-------|---------|
| `live-during-dispatch` | Greenfield — research synthesis written as lenses landed; causal order preserved |
| `post-hoc-independent-read` | Backfill — analyst read the lens findings AFTER the discovery existed, deliberately without consulting the discovery, to test whether commitments survive an independent cross-lens read |
| `meta-lens-consolidation` | Backfill — three meta-lens files already existed as the cross-cutting analysis; research synthesis is a structural reformat, not a new analysis |

## References

- Edge catalog cheatsheet: `.claude/skills/custom/edges.md`
- Full 22-edge catalog (3 categories: epistemic / provenance / reference) and bidirectional declaration rule: `vault/ontology-conventions.md` Appendix C, §8 (forward-only edges into skill/agent files are legal-by-design; see edges.md exception clause)
- Definition of every tag and value (thin reference): `.claude/skills/custom/frontmatter-semantics.md`
- Full rationale, status lifecycle, and edge type catalog: `vault/ontology-conventions.md`