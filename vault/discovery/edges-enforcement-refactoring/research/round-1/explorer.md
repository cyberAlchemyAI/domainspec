---
tags: [vault, ontology, edges, authoring, derivation, refactoring]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-30
---

# Explorer (Round 1) — Edges Enforcement Refactoring

> First-round exploration of a proposed inversion of the vault's edge-authoring surface: today edges live in two hand-authored places (hyperlinks in body prose AND the `## Connections` table). The proposal is to demote the table to a derived projection and promote the body link to single-source-of-truth, carrying the edge type inline via the markdown link's `title` attribute (`[text](path "derives-from")`).

> **Round-1 disclaimer.** This is rough but substantive. It does not propose migration mechanics, does not commit to a derivation tool, and does not assert the proposal *will* work. It maps the design space, names the constitutional change implied, and surfaces the open questions that the next rounds must close.

---

## Objective

This discovery proposes to **invert the authoring authority** for vault edges. Today, the `## Connections` table is treated as the authoritative authored surface for edges between vault nodes (Victor's "Authority Rule 1"), while inline hyperlinks in body prose are treated as either prose-only references or as duplicate, lossy shadows of the table. The proposal flips this: the body-prose hyperlink — annotated with the edge type via the markdown `title` attribute (`[text](path "edge-type")`) — becomes the single source-of-truth, and `## Connections` becomes a mechanically derived projection that is never hand-edited. Links whose `title` is missing or not a recognized edge name are treated as prose, not edges (consistent with the existing posture that not every markdown link is an edge declaration). This is a discovery, not an implementation plan; migration is out of scope by Victor's explicit instruction.

---

## 1. Business Context

### Why now

The current dual-surface authoring regime has accumulated visible drift. The `inverse-edge-fix` discovery (`vault/discovery/inverse-edge-fix/inverse-edge-fix.md`) catalogs ~90 vault-internal missing-inverse edges plus three high-traffic sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) that carry no `## Connections` block at all despite being heavily linked from body prose. The `documents-metadata-enforcement` discovery names the same problem from the enforcement angle. The `domainspec-vault-edges` discovery (D-5) records `derives-from` overload as tracked debt and conditions a future revisit on the existence of measurement infrastructure that does not yet exist.

The structural common cause across all three: **the table is far enough from the prose that authors edit one and forget the other**. Every cycle of audit-then-sweep recovers the symptom (rows added, inverses backfilled) without addressing the cause. A single-source-of-truth would make the dual-surface drift impossible by construction.

The timing is conditioned on three independent facts: (i) the body-link → edge mapping has a low-cost machine-readable carrier (the markdown `title` attribute) that no existing constitution forbids; (ii) the carve-outs in `ontology-conventions.md` §8 (skills/agents forward-only-by-target; sessions forward-only-by-source) are already path-prefix- and frontmatter-keyed mechanisms, so adding a third mechanism (title-attribute presence) does not break the existing rule shape; (iii) `documents-metadata-enforcement` and `inverse-edge-fix` together already commit the vault to mechanical edge enforcement — the proposal here is about *which surface is mechanical*, not *whether* enforcement happens.

### What's broken

- **Drift between body and table.** Author writes prose mentioning `[discovery X](path/to/x.md)`, intends a `cites` edge, but never opens the `## Connections` block. Edge is invisible to any consumer reading the table; visible to any reader of the prose. The two surfaces disagree silently.
- **Three high-traffic sinks with no `## Connections` block at all** (`vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md`). ~20 inbound edges declared from elsewhere have no inverse home; the inverse-fix discovery treats "bootstrap an empty table" as Tier 1 specifically to give those rows somewhere to land. The dual-surface design forces this bootstrap; under the proposal, the sinks would inherit their inverse positions from whoever writes the forward body link, with no requirement that the sink itself open a block.
- **Inverse maintenance cost** — every forward edit requires a paired inverse edit on the target, in a different file. This is the entire mechanic the `inverse-edge-fix` Tier 2 sweep exists to repair.
- **The "is this link an edge?" ambiguity in body prose.** Today there is no in-file marker distinguishing a typed edge (`cites`) from a passing mention. The current resolution is "the table is the truth, the prose is decoration". Inverting puts the burden on the prose link to declare its type — making the ambiguity locally resolvable.

### What stays the same

- **The 21-edge catalog** (`ontology-conventions.md` Appendix C). No edges are added, renamed, removed, or recategorized.
- **The bidirectionality rule** (`ontology-conventions.md` §8 Directionality Principle). Bidirectionality is preserved; what changes is *who authors the inverse*. Under the proposal, the inverse is derived mechanically from the forward body link, not hand-written on the target.
- **The two carve-outs in §8.** Skills/agents forward-only-by-target and sessions forward-only-by-source continue to hold. The derivation pipeline must respect both — see §3.
- **`contradicts` symmetry, acyclicity rules** (`edge-acyclicity-constitution.md`), `governs` runtime witness (`governs-runtime-witness-constitution.md`), and frontmatter ownership (`frontmatter-ownership-constitution.md`). None are touched.
- **Connection Coverage Policy.** Links without a recognized edge-type `title` remain prose, not edges. This proposal does NOT convert every markdown link into a typed edge; it only proposes that *when* a link is meant as an edge, the `title` attribute carries the type.
- **The `## Connections` section itself remains rendered.** It is not deleted; it is regenerated. Readers continue to see a Connections table on every vault node — they just stop authoring it.

---

## 2. Core Concepts

### Hyperlink-as-source-of-truth

A vault edge is declared by writing a markdown link in the body prose with the edge type as the link's `title` attribute:

```markdown
This claim derives from [the foundations discovery](../foundations/discovery.md "derives-from").
The position is corroborated in [section 3 of the prior discovery](other.md#section-3 "cites").
```

Three pieces are load-bearing:

1. **The link target** (`../foundations/discovery.md`) is the edge's `target` field.
2. **The title attribute** (`"derives-from"`) — the string between the quotes — is the edge type. The catalog of legal values is `ontology-conventions.md` Appendix C.
3. **The link's surrounding prose** is the edge's description — the same role the table's `Description` column plays today. Derivation may pick the enclosing sentence or paragraph; the exact picker is an open question (OQ-3).

A markdown link whose `title` is absent, empty, or not a member of the edge catalog is **not an edge** under this proposal. It is prose. This preserves Victor's existing posture that not every link is a typed graph claim.

### The title-attribute mechanism

The `title` attribute is part of the CommonMark/GFM spec for inline links: `[text](url "title")`. It renders as a tooltip on hover in browsers and most preview tools, does not pollute the visible text, and is preserved by Pandoc, mdast, remark, and every Markdown AST parser that complies with CommonMark. It is therefore machine-readable without ad-hoc parsing.

Why this carrier and not an alternative:

- **Not a fenced metadata block adjacent to the link** — would require a custom parser, breaks compositionality with existing tooling.
- **Not a wikilink with type** (`[[target|derives-from]]`) — Obsidian-specific, and the vault already uses standard markdown links predominantly.
- **Not a custom link prefix** (`[derives-from:text](path)`) — leaks the type into the visible text.
- **Not a separate YAML block** — that is what the current `## Connections` table effectively is; the whole point of the proposal is to avoid a second surface.

The title attribute is the only mechanism that is (a) standards-compliant, (b) invisible in rendered prose, (c) machine-readable without custom tooling, (d) already supported by every markdown editor and previewer in the toolchain.

### The derivation pipeline (conceptual)

A derivation pass — conceptually, not as an implementation commitment — would:

1. Parse each vault `.md` file via a CommonMark AST.
2. For each inline link in the body (not in `## Connections`), inspect the `title` attribute.
3. If the title is a member of Appendix C's forward edge set, emit a forward edge `(source=this file, type=title, target=resolved link path, description=enclosing context)`.
4. If the title is a member of the inverse edge set, emit the corresponding forward edge from the other direction (or reject as malformed — OQ-1).
5. For each forward edge so emitted, apply the §8 carve-outs:
   - If target path matches `.claude/skills/**` or `.claude/agents/**`: forward-only, do not require an inverse position.
   - If source has `is_session: true`: forward-only, do not require an inverse position.
   - Otherwise: project the inverse onto the target.
6. Regenerate every vault file's `## Connections` section from the projected edge set. The section is **derived output**, never hand-edited.

The pipeline is conceptually similar to what an auditor would do today to flag missing inverses (e.g., the `inverse-edge-fix` Tier 2 sweep, or an envisioned `vault-ctl edges derive`); the difference is that it *writes* the projection rather than *complaining* about its absence.

### Why this is not "just SQL-layer inference"

The `domainspec-vault-edges` discovery's A-3 explicitly rejected "inverse-via-SQL-computation rather than bidirectional Markdown authoring" on the grounds that bidirectional Markdown makes both endpoints discoverable by reading either file. This proposal **preserves that property**. The `## Connections` table on the target is still present and human-readable — it is just regenerated rather than hand-typed. A reader opening either endpoint still sees the relationship in plain Markdown. The A-3 rejection was against runtime-only computation with no Markdown materialization; the proposal here materializes on write, not on read.

---

## 3. The Constitutional Change

This section names the specific edits implied for `vault/ontology-conventions.md`. The proposal does not commit to these edits — it states what would be required if the proposal were adopted. The next rounds (and the reviewers) are invited to attack this section for coherence with the rest of the constitution.

### 3.1 Directionality Principle (§8) — additive amendment, not replacement

The current §8 text reads (paraphrased): "Edges between vault nodes must be declared on both endpoints. ... Both sides are written explicitly in Markdown — there is no SQL-layer inference."

The proposal replaces the second sentence with:

> Edges are declared by typed body links (markdown links carrying the edge type in the `title` attribute). The `## Connections` section on each endpoint is a mechanically derived projection of the typed body links incoming to and outgoing from that node. Both directions remain visible in Markdown on both endpoints — what changes is that the inverse-side `## Connections` row is generated, not hand-authored. Hand-editing `## Connections` is forbidden.

The "no SQL-layer inference" clause becomes "no runtime-only inference" — the materialization happens at write-time, in Markdown, preserving the local-readability property that motivated the original rule.

### 3.2 New subsection: "Typed body links — authoring rules"

A new subsection (proposed location: `ontology-conventions.md` §8, immediately after the carve-outs) would define:

- **Syntax.** `[anchor text](target-path "edge-type")`. The `edge-type` must be a member of Appendix C's forward-edge set (or, contingent on OQ-1, the inverse set).
- **Scope.** Body prose only. Typed links inside the `## Connections` block itself are ignored by the derivation (the block is overwritten on regeneration).
- **Prose links.** A link with no `title`, with an empty `title`, or with a `title` that is not in the catalog is prose — not an edge. Authors retain the existing freedom to link without declaring an edge.
- **Description derivation.** The edge's description is the enclosing sentence (or, by OQ-3, the enclosing paragraph or a per-link `description="..."` attribute proposed in OQ-3).
- **Inverse handling.** The inverse-side `## Connections` row is generated mechanically; authors do not hand-write it. Carve-outs (skill/agent targets, session sources) continue to suppress inverse generation.

### 3.3 Deprecations

- The current §8 instruction "Edges between vault nodes must be declared on both endpoints" is **kept in spirit, demoted in mechanics**: bidirectional visibility is preserved, but only one endpoint is authored. The other is generated.
- The `inverse-edge-fix` Tier 2 sweep (manual inverse backfill) becomes a one-time migration rather than a recurring discipline. (Migration is out of scope here per Victor's instruction; flagged as downstream tracked debt — see §5.)
- The "three high-traffic sinks need bootstrapping" problem (`inverse-edge-fix` §3.1) is dissolved: under the proposal, those sinks' inverse `## Connections` blocks are generated from whoever's body links target them, with no requirement that the sink files themselves declare anything.

### 3.4 What does NOT change in the constitution

- The 21-edge catalog (Appendix C) — same names, same directionality, same inverses.
- The two carve-outs (§8) — skills/agents forward-only-by-target, sessions forward-only-by-source.
- The `contradicts`-as-symmetric rule.
- The acyclicity constitution (`edge-acyclicity-constitution.md`).
- The `governs`-runtime-witness constitution.
- The frontmatter-ownership constitution (`frontmatter-ownership-constitution.md`) — the `## Connections` derivation does NOT extend frontmatter; it rewrites a body section.
- The discovery-structure constitution (§3 required body sections).

---

## 4. Decision Summary

The discovery commits to the following decisions (subject to reviewer attack and Round-2/3 revision):

- **D-1 — Adopt typed body links as the single authored surface for edges.** The hyperlink in body prose, annotated with the edge type via the markdown `title` attribute, is the source-of-truth.
- **D-2 — Demote `## Connections` to derived output.** The section remains rendered on every vault node; it is regenerated mechanically and never hand-edited.
- **D-3 — Preserve the 21-edge catalog and the two §8 carve-outs unchanged.** No edge names are added, removed, or renamed by this proposal. Skills/agents forward-only-by-target and sessions forward-only-by-source continue to suppress inverse generation.
- **D-4 — Untyped links remain prose.** A markdown link with no recognized `title` is not an edge. The proposal does not require authors to type every link — only those they mean as edges.
- **D-5 — Inverse visibility is preserved through regeneration, not through hand-authoring.** Bidirectional Markdown remains a property of the corpus; only the labor model changes. A reader opening either endpoint still sees the relationship in plain Markdown.
- **D-6 — Migration is out of scope.** The downstream questions ("how do we convert ~200 existing `## Connections` rows into typed body links without losing descriptions?") are tracked debt for a separate implementation-plan node.

---

## 5. Tracked Debt

Known limitations and known-deferred work. Each is recorded so the next rounds can decide whether to elevate it to an Open Question, accept it as durable debt, or push it back into the discovery body.

- **TD-1 — Migration path is undesigned.** Converting the existing `## Connections` corpus (estimated 100+ rows across ~50 vault files) into typed body links requires either (a) deriving body-link positions from the existing table rows (likely produces ugly link placement, since rows don't necessarily map to existing prose), or (b) one-time bulk regeneration of the table from existing typed body links once those exist (chicken-and-egg). Out of scope here per user instruction; will need an `implementation-plan` discovery downstream.
- **TD-2 — Tooling does not exist.** The derivation pipeline is conceptual. No `vault-ctl edges derive` command exists. The proposal assumes such tooling can be built; it does not specify it.
- **TD-3 — Description-field semantics.** The `## Connections` table today carries a free-prose `Description` column that often contains 1-3 sentences explaining *why* the edge exists. Mapping that to "the enclosing sentence of the body link" loses descriptions whose content does not naturally live next to the link. OQ-3 addresses possible mitigations.
- **TD-4 — `derives-from` overload is not addressed by this proposal.** The `domainspec-vault-edges` D-5 tracked-debt entry survives unchanged. Moving the edge authoring from table to body link does not disambiguate the four conflated semantics. This proposal is orthogonal to D-5.
- **TD-5 — Cross-repo and dangling targets** (parked in `_backlog.md` by the `inverse-edge-fix` siblings) interact with this proposal: a typed body link to a moved or renamed file generates a dangling edge the same way a hand-authored row would. The proposal does not improve nor worsen this; tracked here so reviewers see it was considered.
- **TD-6 — Editor-preview ergonomics.** Some markdown editors render `title` attributes as tooltips; some do not. Authors editing in a previewer that doesn't show titles will have no visual signal that a link is typed. This is a workflow concern, not a correctness concern; flagged for later evaluation.
- **TD-7 — The Round-1 author has not measured how many existing prose links would retroactively qualify as edges if titled.** A round-2 measurement pass (count links in body prose with valid-target paths and inspect whether they semantically correspond to a catalog edge) would let us estimate the conversion ratio. Round 1 does not commit to a number.

---

## 6. Open Questions

Things the discovery does NOT decide. Each is a candidate for Round-2/3 resolution or for promotion to a sibling discovery.

- **OQ-1 — Forward-only or both-direction-allowed authoring on the body link?** When a child document derives from a parent, should the child write `[parent](parent.md "derives-from")` (forward edge from child's perspective)? May the parent also write `[child](child.md "derives")` and have the derivation accept it as the same edge? `domainspec-vault-edges` D-6 says "the author on the side with the stronger semantic claim writes the forward" — that rule would need to be preserved or relaxed. Two sub-options: (a) forward-only authoring (only the catalog's forward name may appear in `title`); (b) either direction (the derivation normalizes inverse-names to their forwards). Round-1 does not pick.
- **OQ-2 — `contradicts` symmetry under typed body links.** `contradicts` is the only symmetric edge in the catalog. If both endpoints declare `[other](other.md "contradicts")` in their body prose, the derivation sees two forward edges. If only one declares it, the derivation must materialize the symmetric position on the other side. Both behaviors are consistent with the current bidirectionality rule; the choice affects whether `contradicts` is "declared once and projected" or "declared on both ends and deduplicated".
- **OQ-3 — Description field — where does the prose live?** Three options: (a) take the enclosing sentence of the body link as the description; (b) take the enclosing paragraph (richer, may bleed unrelated content); (c) introduce a second attribute beyond `title` (e.g., a custom inline syntax `[text](path "edge-type"){description="..."}` — non-standard, breaks CommonMark portability). Round-1 leans toward (a) but does not commit.
- **OQ-4 — Multiple edges from the same source to the same target.** A document may both `cite` and `validate` the same target. Two typed body links in different sentences is the natural expression. The derivation must accept multi-edge pairs without collision. Confirm against the current `## Connections` semantics (which has the same multi-row property today, uncontroversially).
- **OQ-5 — Links inside the `## Connections` block — what happens to them?** The block is overwritten on regeneration, so any typed body link *inside* the block is destroyed on the next pipeline run. The simplest rule is "derivation ignores links in the `## Connections` block entirely". A stricter rule is "the `## Connections` block must not contain typed links at all". Round-1 does not pick.
- **OQ-6 — How does the proposal interact with `inverse-edge-fix`?** That discovery is mid-flight (Tiers 1–2 actionable now, Tier 3 deferred to catalog amendment). Does the proposal here supersede it (Tier 2 manual sweep becomes unnecessary, replaced by a one-time pipeline run), or is `inverse-edge-fix` a prerequisite (Tier 2 must complete so the migration pass has a clean starting state)? The two discoveries answer different questions but their operational footprints overlap; the relationship needs to be named.
- **OQ-7 — Interaction with `documents-metadata-enforcement`.** That discovery enforces frontmatter; this discovery proposes to change a body-section authoring rule. The two are in adjacent territory; the metadata-enforcement curator pipeline may be the natural host for the derivation pipeline here. Round-2 should verify that this proposal does not duplicate or contradict that discovery's pipeline design.
- **OQ-8 — Rejected alternative `Scope` column** (`domainspec-vault-edges` A-4) — the user has rejected adding a `Scope` column to `## Connections` to discriminate edges by target class. The current proposal sidesteps this entirely by making `## Connections` derived (no columns to add); the carve-outs are encoded in the derivation logic, not in the table. Round-2 should confirm this is not silently re-adding the rejected mechanism in a different shape.
- **OQ-9 — Does the proposal force the existence of derivation tooling before adoption?** If the constitution is amended but no `vault-ctl edges derive` exists, every vault file's `## Connections` block becomes stale on the first body-link edit. The migration discipline must specify whether the constitution amends before, during, or after the tool exists. (This is a sequencing question — it is also acknowledged as out-of-scope migration, but the order in which the two land affects whether the constitution amendment is a no-op or a footgun.)

---

## Connections

> **Authoring note for Round-1.** Per the proposal's own logic, the ideal expression of this section is for it to be derived from typed body links in §1–§6. Since the derivation pipeline does not exist (TD-2) and migration is out of scope (D-6), Round-1 hand-authors the table in the legacy form. This is consistent with what the proposal would label "transitional debt" — the discovery itself eats the dual-surface cost it proposes to eliminate.

| Document | Type | Description |
|----------|------|-------------|
| [../../../ontology-conventions.md](../../../ontology-conventions.md) | `proposes-edit` | §8 Directionality Principle and a new "Typed body links — authoring rules" subsection are the constitutional surface this discovery proposes to amend. Inverse to be added at promotion. |
| [../../../discovery/domainspec-vault-edges/discovery.md](../../../discovery/domainspec-vault-edges/discovery.md) | `cites` | The 21-edge catalog adopted by D-1 of that discovery is preserved unchanged here. The `derives-from` overload (D-5 tracked debt) is acknowledged as orthogonal to this proposal (TD-4). The A-3 rejection of SQL-layer inference and the A-4 rejection of the `Scope` column are explicitly addressed in §2 and OQ-8. Inverse to be added at promotion. |
| [../../../discovery/inverse-edge-fix/inverse-edge-fix.md](../../../discovery/inverse-edge-fix/inverse-edge-fix.md) | `cites` | The ~90 vault-internal missing-inverse edges and the three-sinks problem cataloged there are the most direct empirical evidence motivating this proposal. The interaction question is OQ-6. Inverse to be added at promotion. |
| [../../../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md](../../../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md) | `cites` | Adjacent enforcement discovery; OQ-7 names the question of whether the derivation pipeline proposed here can share a host with the metadata pipeline proposed there. Inverse to be added at promotion. |
| [../../../constitution/edge-acyclicity-constitution.md](../../../constitution/edge-acyclicity-constitution.md) | `cites` | Acyclicity is preserved unchanged by this proposal; the derivation pipeline must continue to feed `vault-ctl cycles check` the same edge graph it sees today. |
| [../../../constitution/frontmatter-ownership-constitution.md](../../../constitution/frontmatter-ownership-constitution.md) | `cites` | The derivation does NOT extend frontmatter; it rewrites a body section. The single-owner schema for frontmatter is untouched. |
| [../../../constitution/discovery-structure-constitution.md](../../../constitution/discovery-structure-constitution.md) | `governed-by` | This discovery's shape (frontmatter, required sections, lens-eligible content) follows the discovery-structure constitution. |
