---
tags: [vault, lens-findings, folder-structure-fractal]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — External Prior Art

## Provenance (pre-migration lens header)

- **Lens slug.** `03-external-prior-art`
- **Original dispatch date.** 2026-05-16
- **Dispatched by.** subagent — web-fetched survey of knowledge-base folder-structure traditions
- **Original `addresses` line.** How do major knowledge-management systems organize folders, fractality, and layer-separation; what should /domainspec borrow vs invent
- **Verification.** [web-fetched]
- **Sources (pre-migration list).**
  - https://fortelabs.com/blog/para/
  - https://zettelkasten.de/introduction/
  - https://notes.andymatuschak.org/Evergreen_notes
  - https://en.wikipedia.org/wiki/Dewey_Decimal_Classification
  - https://en.wikipedia.org/wiki/Colon_classification
  - https://en.wikipedia.org/wiki/Wikipedia:Categorization
  - https://arxiv.org/category_taxonomy
  - https://www.semantic-mediawiki.org/wiki/Help:Properties_and_types
  - https://www.notion.com/help/intro-to-databases
  - https://tiddlywiki.com/static/Tagging.html
  - https://en.wikipedia.org/wiki/Zettelkasten
  - https://zettelkasten.de/posts/introduction-antinet-zettelkasten/
  - https://forum.obsidian.md/t/folders-vs-linking-vs-tags-the-definitive-guide-extremely-short-read-this/78468


## Per-system survey

### 1. Roam Research
**A. Structure.** Could not hard-fetch Roam's own docs (help.roamresearch.com 404'd and the in-app tutorial requires auth). From secondary sources: Roam is graph-based — outlined blocks live inside pages, pages live in a flat namespace, and hierarchy is expressed via bidirectional `[[wikilinks]]`, block-references `((uid))`, and the daily-notes journal. There are no folders.
**B. Fractality.** Yes at the block level: every bullet is itself a referenceable, embeddable, zoomable unit. Pages and blocks share the same primitive (an outline node with a UID). This is genuinely self-similar.
**C. Schema/instance.** Not separated. A "tag" page (`#project`) is the same kind of object as a content page; "schema" lives implicitly in queries.
**D. Avoids.** Folders, file paths, manual organization.
**E. Relevance.** Roam's block-as-node fractality is the cleanest precedent for "same shape at every level," but it abandons folders entirely so it does not speak to layer-separation in directory terms.

### 2. Obsidian (+ PARA)
**A. Structure.** Obsidian is folder-agnostic: folders, tags, links, and properties all exist, and the community treats them as four competing/cooperating organizers. Obsidian's own "Folders" help page returned 404 on fetch (file removed from docs); the forum-canon "definitive guide" thread documents the working consensus: folders for high-level separation, MOCs (Maps of Content) for navigation, tags for discovery, links for connection.
**B. Fractality.** Folders are arbitrarily nestable but not self-similar — the root level is just "more folders." MOCs are weakly fractal: an MOC can link to sub-MOCs.
**C. Schema/instance.** No structural separation. Templates live in a `Templates/` folder by convention, but they are markdown files indistinguishable in kind from content. Properties (YAML frontmatter) is the closest thing to a schema layer, and it is per-note, not per-folder.
**D. Avoids.** Forte's PARA (the dominant Obsidian organizing scheme) explicitly warns against organizing by broad academic subject ("Marketing," "Psychology") instead of by actionable outcome, and against treating everything as an "Area" (which hides progress). Community consensus warns against deep folder nesting because it forces premature single-parent decisions.
**E. Relevance.** PARA's four fixed top-level buckets (Projects/Areas/Resources/Archives) is a candidate pattern, but it is explicitly *not* recursive — the four buckets don't reappear inside each other. Not fractal.

### 3. Logseq
**A. Structure.** Could not fully fetch (docs.logseq.com exceeded fetch size; namespace anchor 404'd). From the navigable parts: journals + pages + assets, with hierarchical pages expressed via `namespace/sub-namespace/page` naming (slash-separated page titles act as a virtual hierarchy without real folders). Block-level outlining like Roam.
**B. Fractality.** Block-level yes; namespace nesting is arbitrary depth but not pattern-recurring.
**C. Schema/instance.** None at folder level. Block properties carry schema.
**D. Avoids.** No documented anti-pattern fetched.
**E. Relevance.** Namespaces-as-virtual-folders is interesting (path encoded in title), but doesn't help with schema/instance separation.

### 4. TiddlyWiki
**A. Structure.** No folders. Tags-only — and crucially, "a tag is in fact just a tiddler (or a potential tiddler), and it can have tags of its own" (tiddlywiki.com/static/Tagging.html). Recursive tagging gives hierarchy.
**B. Fractality.** Strongly fractal: a tag is a tiddler is a tag. Same primitive at every level.
**C. Schema/instance.** Not separated structurally; tag-tiddlers and content-tiddlers are the same type.
**D. Avoids.** Folders, file-system metaphors entirely.
**E. Relevance.** The "tag is a tiddler" move is the cleanest example of treating schema nodes and content nodes as the same kind — directly analogous to /domainspec's "constitutions and discoveries are both markdown." But TiddlyWiki has no folder layer to separate, so it sidesteps the question.

### 5. Notion
**A. Structure.** Databases-as-primary. "Every item you enter into your database is a Notion page" (notion.com/help/intro-to-databases). Pages-in-pages give arbitrary hierarchy; databases give typed collections with properties.
**B. Fractality.** Pages-in-pages is recursive (a page can contain pages and databases without limit), so structurally self-similar.
**C. Schema/instance.** Yes, explicitly. Database schema (properties, types, views) is a first-class object distinct from rows. But the schema lives in a UI panel, not as a sibling page — users don't see it as "another markdown file."
**D. Avoids.** No deep-folder anti-pattern; instead the implicit warning is against unstructured page-trees without database backing.
**E. Relevance.** Notion proves schema/instance separation works at scale, but does it by hiding schema in chrome rather than as a peer artifact. /domainspec's choice to put both as peer markdown is the opposite move.

### 6. Luhmann Zettelkasten
**A. Structure.** Flat physical drawer, hierarchy imposed by alphanumeric IDs: `1` → `1a` → `1a1`. "Whenever you continue a train of thought, you increment the last position in the address" (zettelkasten.de/introduction/).
**B. Fractality.** Yes — the branching rule applies identically at every depth (`1a1b2c…`). True self-similarity of the addressing scheme, though Luhmann's actual tree was unbalanced.
**C. Schema/instance.** None. Index notes (Schlagwortregister) exist but are themselves zettel.
**D. Avoids.** zettelkasten.de warns: IDs must be immutable, must not encode current hierarchical meaning, must not be treated as physical addresses to reorganize. The key insight: "it is not important where you place a new note as long as you can link to it."
**E. Relevance.** Most directly fractal scheme in the survey. But it explicitly rejects the idea that the address means anything semantic — which is the opposite of what /domainspec wants from a folder layer.

### 7. Antinet (Scheper)
**A. Structure.** Physical analog cards, "Alpha-Numeric Tree Index" — addresses like `3306/27A` combining numeric and alphabetic positions (zettelkasten.de/posts/introduction-antinet-zettelkasten/). Hard-fetch of scottscheper.com/antinet returned only marketing copy; substantive content came from zettelkasten.de's writeup and search-surfaced summaries.
**B. Fractality.** Same Luhmann-style branching, with an additional separate "main number" prefix per major branch — so two-layer at the root, fractal within.
**C. Schema/instance.** No separation; index cards are cards.
**D. Avoids.** Pure-digital storage (the whole brand is "anti-net," against networked digital tools), and topic-folders.
**E. Relevance.** The two-layer-at-root + fractal-within pattern is closest in spirit to /domainspec's "constitutions at root, fractal discoveries within."

### 8. Andy Matuschak evergreen notes
**A. Structure.** Flat namespace, no folders, dense linking. "Associative ontologies" over "hierarchical taxonomies."
**B. Fractality.** Concept-level: every note is atomic and concept-oriented, so notes are uniform in shape.
**C. Schema/instance.** None.
**D. Avoids.** Source-based organization (organizing by where you read it), and scattering notes across many locations.
**E. Relevance.** Confirms the "atomic, uniform, flat" pole but is silent on folder design.

### 9. Library classification (Dewey / LCC / UDC / Colon)
**A. Structure.** Dewey: 10 classes × 10 divisions × 10 sections, then unlimited decimal expansion (e.g., `516.375 Finsler geometry`). LCC: 21 alphabetic top-level classes, alphanumeric. UDC: faceted extension of Dewey. Colon: Ranganathan's PMEST facets — Personality, Matter, Energy, Space, Time — combined with punctuation (`L,45;421:6;253:f.44'N5`).
**B. Fractality.** Dewey is *nominally* fractal at the top three levels (10×10×10) but breaks pattern below — decimals are enumerated, not pattern-generated. Colon is anti-fractal: it is flat-faceted, dimensional rather than hierarchical.
**C. Schema/instance.** Yes — the classification schedule (the schema) is published as a separate volume from the catalogued books (instances). The schema is owned centrally, not co-located with content.
**D. Avoids.** Dewey/LCC avoid letting libraries invent local categories. Colon avoids hierarchy itself, treating "subject" as a vector of facets.
**E. Relevance.** Dewey shows that "10×10×10" self-similarity at the top decays into ad-hoc enumeration in practice — a warning that pure top-down fractality is unstable. Colon's facet-vector is a useful alternative model: if /domainspec ever wants the same node to be classified along multiple axes, PMEST is the prior art.

### 10. Wikipedia categories
**A. Structure.** "All categories form part of a tree-like hierarchy. Do not add categories to pages as if they are tags" (Wikipedia:Categorization). A page sits in multiple parent categories — DAG, not pure tree.
**B. Fractality.** Categories are pages, subcategories are pages — same primitive, so weakly fractal.
**C. Schema/instance.** Explicitly: "Keep administrative and content categories separate" — one of the few systems in this survey to state schema/instance separation as a rule, though the mechanism is naming convention, not a separate folder.
**D. Avoids.** Categories-as-tags, subjective adjectives ("famous"), trivial-characteristic categorization, overcategorization.
**E. Relevance.** "Administrative vs content categories" is the closest analog to /domainspec's "constitutions vs discoveries," and it is enforced by convention rather than structure — a viable middle path.

### 11. Semantic MediaWiki
**A. Structure.** Pages + categories + properties (`[[Property::value]]`). "Properties can be viewed as 'categories for values in wiki pages'."
**B. Fractality.** Properties have property-pages; categories have category-pages — uniform primitive.
**C. Schema/instance.** Yes — property declarations are distinct from property assertions. Schema-level (datatype, constraints) lives in the Property: namespace; instance-level lives inline on content pages.
**D. Avoids.** No documented anti-pattern fetched.
**E. Relevance.** Demonstrates schema-as-peer-page (Property:Foo lives in the same wiki, browsable as a page), which *is* /domainspec's move. Best structural precedent in the survey.

### 12. arXiv
**A. Structure.** Strictly two-tier: archive (e.g., `cs`) then category (`cs.AI`). ~150 categories total, no deeper.
**B. Fractality.** No — flat-by-design at the second level.
**C. Schema/instance.** Schema (taxonomy) maintained centrally by arXiv; papers are instances tagged with one or more categories.
**D. Avoids.** Deeper hierarchy. arXiv explicitly caps at two levels.
**E. Relevance.** A working datapoint that "two layers is enough" at scale (millions of papers). Validates the /domainspec "two-layer-guaranteed" intuition empirically.

## Synthesis

### F. Patterns that recur
1. **Anti-deep-folders.** Obsidian community, Matuschak, PARA, Wikipedia, arXiv — all converge on shallow structure. Deeper hierarchies force premature single-parent decisions that don't survive contact with reality.
2. **Flat-with-IDs.** Luhmann, Antinet, Roam (UIDs), Logseq, TiddlyWiki — addressing replaces location.
3. **Same primitive at every level.** TiddlyWiki (tag-is-tiddler), Roam (block-is-page-is-block), Wikipedia (category-is-page), Semantic MediaWiki (property-is-page). When systems get "fractal" right, it is by collapsing distinctions, not by replicating shape.
4. **Schema as a peer page, not a chrome panel.** Semantic MediaWiki, Wikipedia categories, TiddlyWiki — schema artifacts live in the same browsable namespace as content, distinguished by convention/namespace prefix.
5. **Two-tier with optional within-tier fractality.** arXiv (2 levels), Antinet (root branch + fractal sub-tree), PARA (4 buckets + free-form within).

### G. Patterns nobody uses
- **Explicit schema/instance separation enforced at the folder level.** Notion separates them but hides schema in chrome. SMW separates by namespace prefix, not folder. Wikipedia separates by naming convention. *No surveyed system has a top-level folder split where one folder holds rules-about-content and the other holds content, with both as first-class markdown.* /domainspec's `constitutions/` + `discoveries/` (or analogous) split is genuinely novel.
- **Recursively applying the same N-bucket scheme at every depth.** PARA is 4-at-root but free-form below. Dewey is 10×10×10 then ad-hoc. Nobody runs (e.g.) PARA inside each Project inside each sub-Project. True top-down fractality of a *named* schema is unused.
- **Constitution-as-first-class-node.** Most graph wikis have no "rules" layer at all; Notion/Confluence push rules to settings; libraries publish schedules out-of-band. Treating constitutions as peer markdown nodes inside the vault is unprecedented in the surveyed prior art.

### H. What /domainspec should borrow vs invent
**Borrow:**
- *Shallow top.* Cap root at small N (arXiv: 2; PARA: 4). Don't recurse the root scheme.
- *Same primitive at every level.* Whatever a "node" is at depth 0 should be the same kind of thing at depth 5 (Roam/TiddlyWiki lesson). Markdown-file-with-frontmatter is the right primitive.
- *Schema-as-peer-page, distinguished by namespace prefix.* Semantic MediaWiki's Property: convention is the working precedent. /domainspec's `constitutions/…` and `discoveries/…` as sibling roots is the directory-level version of the same idea.
- *Immutable addresses.* Luhmann's lesson: once a node has an ID, never re-address it for hierarchy reasons. Links must survive relocation.
- *Convention-enforced layer split.* Wikipedia's "keep administrative and content categories separate" works by naming. /domainspec can enforce constitutions-vs-discoveries the same way — by root-folder convention, not by file-type magic.

**Invent (because no prior art):**
- *Two-layer guarantee at root, with the same fractal shape inside both layers.* PARA does fixed-root-flexible-inside; /domainspec wants fixed-root-AND-fractal-inside, mirrored across two layers. Nobody surveyed does this.
- *Constitutions as peer-node first-class markdown.* This is the move that has no precedent; expect to design it from scratch.
- *Layer-separation semantics* (what is a constitutional concern vs. a discovery concern, and how nodes cross-reference across the split). No prior art — this is the unanswered question.

### I. Verification ledger

| URL | Status |
|---|---|
| https://help.obsidian.md/Files+and+folders/Folders | redirect → 404 (file removed) |
| https://obsidian.md/help/Files+and+folders/Folders | fetched (404 body) |
| https://obsidian.md/help/Getting+started/Organize+your+notes | fetched (404 body) |
| https://forum.obsidian.md/t/folders-vs-linking-vs-tags-the-definitive-guide-extremely-short-read-this/78468 | via WebSearch summary (fetched indirectly) |
| https://fortelabs.com/blog/para/ | fetched |
| https://docs.logseq.com/ | blocked (response exceeded 10 MB cap) |
| https://docs.logseq.com/#/page/namespace | blocked (size cap) |
| https://tiddlywiki.com/static/Classifying%2520Tiddlers.html | 404 (URL encoding wrong) |
| https://tiddlywiki.com/static/Tags.html | fetched (thin) |
| https://tiddlywiki.com/static/Tagging.html | fetched |
| https://www.notion.so/help/intro-to-databases | redirect |
| https://www.notion.com/help/intro-to-databases | fetched |
| https://zettelkasten.de/introduction/ | fetched |
| https://en.wikipedia.org/wiki/Zettelkasten | fetched |
| https://notes.andymatuschak.org/Evergreen_notes | fetched |
| https://en.wikipedia.org/wiki/Dewey_Decimal_Classification | fetched |
| https://en.wikipedia.org/wiki/Colon_classification | fetched |
| https://en.wikipedia.org/wiki/Wikipedia:Categorization | fetched |
| https://arxiv.org/category_taxonomy | fetched |
| https://www.semantic-mediawiki.org/wiki/Help:Properties_and_types | fetched |
| https://help.roamresearch.com/en/articles/4082185-getting-started-with-roam | 404 |
| https://roamresearch.com/#/app/help/page/Tutorial | not usable (SPA, auth required) |
| https://en.wikipedia.org/wiki/Roam_Research | 404 (article redirected/removed) |
| https://scottscheper.com/antinet/ | redirect → marketing only |
| http://www.scottscheper.com/antinet/ | fetched (marketing only, no methodology) |
| https://zettelkasten.de/posts/introduction-antinet-zettelkasten/ | via WebSearch summary |

**Not fetched cleanly:** Roam's own docs (could not access primary source — relied on Antinet/Luhmann analogies and general knowledge); Logseq full docs (size cap — only partial); Confluence (not attempted, auth-walled); the Scheper book itself (not attempted, paywalled).

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
