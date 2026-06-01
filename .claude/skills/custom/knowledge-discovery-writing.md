---
description: How to write a knowledge discovery — corpus survey, failure-mode taxonomy, and proposed changes to a constitution/premise/axiom.
---

# Knowledge Discovery Writing

## Purpose

A knowledge discovery distills an external corpus into a document that grounds future revisions of a constitution, premise, or axiom. It is **not a feature spec**. If the output ends in code or a migration, use `discovery-writing.md` instead.

## Choosing this skill

> Target artifact is `constitution`, `premise`, `axiom`, or `essay` → knowledge discovery (this skill).
> Target artifact is `spec`, `implementation-plan`, or code module → feature discovery (`discovery-writing.md`).

## Where it lives

Mandatory path: `knowledge/<domain>/discovery/<topic-slug>/discovery.md`. Raw research bundle goes in `./research/` next to it (`agents/`, `findings.md`, `research.md`, `spec.yaml` — produced upstream by `domainspec-subagents-strategy`).

## Frontmatter

Use the schema in `frontmatter.md` with these constraints:

- `node_type: discovery`
- `tags`: target domain + at least one source-tradition tag
- `status`: `exploratory` while drafting, `consolidated` once the reviewer cycle closes
- `veracidade` and `convicção`: **required** — corpus quality and author confidence are the whole point of a knowledge discovery
- Use `representation_layer:` (not the deprecated `layer:`)

## Mandatory structure

Sections in this order. All required unless marked.

1. `## Objective` (≤4 sentences) — what corpus is being distilled, against which target artifact, and what decision the discovery feeds. Name the target document explicitly.
2. `## Canonical Foundation` — corpus grouped by tradition/source. Each tradition states its load-bearing claim and cites primary sources (author, year, work, chapter or arXiv ID). No speculation.
3. `## Failure-Mode Taxonomy` (or `## Concept Map` if the target has no rule structure) — table: claim ID (F1…Fn or C1…Cn) → source(s) → target rule/premise ID → status (`Covered` / `Covered (partial)` / `Missed`).
4. `## Gaps in the Current <target>` — one subsection per gap, ordered by closure cost. Each gap names the concrete change (new rule, revised check, retired clause). Gaps without a proposal are rejected.
5. `## Claims Without External Support` — each existing target-artifact claim the corpus does not back. Entry: quote → what corpus says instead → suggested rewrite. Empty section is allowed only if explicitly stated.
6. `## Open Questions` — each item: question + recommendation. A question without a recommendation is rejected.
7. `## Connections` — table of related documents (`refines`, `derives-from`, `synthesizes`, `supersedes`). Must include the target artifact and the upstream research bundle (`./research/`).
8. `## Annex` (optional) — flagged candidates, deferred items that don't fit the main taxonomy.

## Quality checks before finishing

- [ ] Objective names (a) corpus, (b) target artifact, (c) downstream decision
- [ ] Every Canonical Foundation claim cites a primary source (author + year + work)
- [ ] Every taxonomy row cites ≥1 source and ≥1 target rule ID (or `(none)` if proposing a new one)
- [ ] Every Gap ends with a concrete proposal (new rule with `Check:`, or revised clause with diff-level specificity)
- [ ] Every Claims-Without-Support entry includes a suggested rewrite
- [ ] Every Open Question includes a recommendation
- [ ] `## Connections` includes target artifact + upstream research bundle path
- [ ] Frontmatter includes `veracidade` and `convicção`
- [ ] No implementation steps ("do X then Y") — this is a knowledge artifact, not a plan
- [ ] Path follows `knowledge/<domain>/discovery/<topic-slug>/discovery.md`

## Rounds

This skill governs all rounds of a discovery. Rounds differ in `version` and `status`, not in shape. A round-2 revision updates the same `discovery.md` in place.

## Upstream link

When invoked downstream of a `domainspec-subagents-strategy` R6b promotion, the research bundle is the promoted artifact set; link it from `## Connections` as `synthesizes`.
