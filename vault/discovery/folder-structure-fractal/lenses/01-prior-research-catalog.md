---
lens: prior-research-catalog
date: 2026-05-16
dispatched_by: subagent — exhaustive read of prior /domainspec vault folder research
addresses: Catalog what's already been decided, debated, and assumed about the vault's folder structure
sources:
  - /Users/victorboscaro/domainspec/vault/constitution/folder-structure-constitution.md
  - /Users/victorboscaro/domainspec/vault/constitution/discovery-structure-constitution.md
  - /Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-foundations/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md
  - /Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-foundations/epistemic-chain.md
  - /Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-edges/research/findings.md
  - /Users/victorboscaro/domainspec/vault/discovery/curator-pipeline-integration/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/documents-metadata-enforcement/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/graph-as-residue-attractor/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/two-layer-platform-architecture/README.md
  - /Users/victorboscaro/domainspec/vault/ontology-architecture-draft.md
  - /Users/victorboscaro/domainspec/vault/ontology-conventions.md (sections 4, 5, Appendix B, Appendix C)
  - /Users/victorboscaro/domainspec/vault/ (ls top-level)
  - /Users/victorboscaro/house_project/docs/vault/ (ls)
  - /Users/victorboscaro/maestro-trama/vault/ (ls)
verification: [local-files-read]
---

# Lens 01 — Prior Research Catalog: Vault Folder Structure

## A. What's already decided

### A.1 The current top-level layout of `/domainspec/vault/`

```
vault/
  agent-navigation.md        confidence-levels.md
  human-navigation.md        foundational-knowledges.md
  ontology-architecture-draft.md
  ontology-conventions.md
  amendments/   assets/   axiom/   backlog/   bets/
  conceptual/   constitution/   discovery/   migrations/
  premise/   sessions/   snapshots/
```

15 sibling folders + 6 root-level Markdown files. Folders are organized by **node_type** (axiom, premise, constitution, discovery, conceptual, sessions, backlog) plus housekeeping (amendments, migrations, snapshots, assets, bets).

### A.2 The constitution called "folder-structure-constitution.md" is NOT about the vault

`vault/constitution/folder-structure-constitution.md` (v2.0.0, status: consolidated) governs the **code repository** — domains/, infrastructure/, shared_services/, the "screaming architecture" DDD layout for the FIDC product. It says nothing about how the vault itself is organized. This is the single most important finding for the framing of the fractal: *there is no constitution that governs the vault's own folder shape*. The closest thing is the recent `discovery-structure-constitution.md` (v0.1.1, exploratory, 2026-05-16), which governs only one folder family.

### A.3 The rules that ARE in force for vault folder shape

1. **Discovery folder shape (only formal rule).** From `discovery-structure-constitution.md` §1:
   > "Every discovery lives at: `vault/discovery/<slug>/README.md` + `lenses/NN-<lens-slug>.md`. `<slug>` is kebab-case, 3–5 words, no date prefix. `lenses/` is required even if only one lens exists. No other subfolders."
   - Hard caps: README body ≤ 60 lines; ≤ 7 lenses per discovery.
   - The folder itself is the unit of provenance ("read-only after first save; refinements happen in new discoveries that supersede").

2. **node_type drives top-level folder choice (informal).** `ontology-conventions.md` Appendix B says discoveries "may live in `vault/discovery/` (vault-internal — schema, ontology, agents) OR in application/feature folders (work-context — feature design, refactor scoping)." Other node_type folders (axiom/, premise/, constitution/, conceptual/, sessions/, backlog/) are *de facto* destinations but never declared as rules. There is no document that says "constitutions go under vault/constitution/." It is observed convention.

3. **Frontmatter is the source of truth, NOT folder location.** `epistemic-chain.md` A-4 (rejection): *"Use the folder to signal node_type instead of frontmatter — REJECTED. Folder location is not classification; it is storage. `node_type` carries the epistemic role; folder carries the storage location. These are orthogonal, and the role must be explicit."* This is the load-bearing principle behind every folder-vs-frontmatter tension below.

4. **Sessions folder is the narrative log.** From `ontology-architecture-draft.md` §3: "The Narrative Log (`/close-session`): Human-readable context explaining what was discussed during a coding session and why." Sessions are dated, single-file, time-ordered. Discoveries supersede sessions when promotion happens (`epistemic-chain.md` D-9).

5. **research/ subfolders inside discoveries.** Two existing discoveries (`domainspec-vault-foundations/research/`, `domainspec-vault-edges/research/`) use a `research/` sister of the README to hold T1–T4-style parallel-agent outputs. The new discovery-structure-constitution explicitly *forbids* this (`No other subfolders`). This is a live conflict — see §C.

6. **Schema-evolution gate is by node_type, not by location.** `scope-and-domain-axes.md` D-14: *"Discoveries are the only authorized path for schema evolution."* The discovery may live anywhere; the channel is the document type.

7. **Vault is canonical schema registry for both graphs.** D-13: vault is source-of-truth for both knowledge-graph and application-graph schemas. Code is downstream.

8. **`vault/snapshots/` newly minted (2026-05-16).** `two-layer-platform-architecture/README.md` Next Move 1 mandates `snapshots/YYYY-MM-DD-vN.json` for content-addressed corpus manifests. Brand-new folder type.

9. **`vault/migrations/` and `vault/amendments/`** exist as folders; their internal rules are not written in any constitution found.

10. **`vault/bets/`** exists (created 2026-05-16, presumably via convicção-bet-ledger-constitution.md); rules not yet read but folder is fresh.

### A.4 Why each folder exists (per existing docs)

| Folder | Existence rationale (source) |
|---|---|
| `axiom/`, `premise/`, `constitution/`, `conceptual/` | One folder per node_type (informal); each holds documents whose role matches the folder name. Implied by `ontology-conventions.md` examples. |
| `discovery/` | Schema-evolution gate (D-14) + new discovery-structure-constitution §1. |
| `sessions/` | Narrative log per `ontology-architecture-draft.md`; provenance-only per `epistemic-chain.md` D-9. |
| `backlog/` | `node_type: backlog` documents; informal. |
| `migrations/` | Not documented; holds schema migration records. |
| `snapshots/` | Empirical-floor artifact for the residue-attractor measurement window (two-layer-platform-architecture, lens 03). |
| `amendments/` | Not documented in any read source. |
| `bets/` | New (2026-05-16); presumed governed by convicção-bet-ledger-constitution.md. |
| `assets/` | Static media; not documented. |
| Root `.md` files (agent-navigation, human-navigation, ontology-conventions, ontology-architecture-draft, confidence-levels, foundational-knowledges) | Navigation/schema spine documents kept flat at root so they are unambiguously the first read. No rule says they must be at root; convention only. |

## B. What's been debated but not closed

- **OQ-5 / scope:ontology split.** `scope-and-domain-axes.md` flags that `scope: ontology` may need to split into rules vs governance vs measurement when content accumulates. If folders mirror scope, this is a folder question.
- **OQ-1 (curator-pipeline-integration).** Where do bootstrap-on-write hooks attach? Resolved for `.claude/skills/**` and `.claude/agents/**` (forward-only edges legal-by-design). Still open for `.planning/**` (OQ-C). Folder-shape consequence: vault edges into sibling-repo paths.
- **OQ-3 (epistemic-chain).** Multi-source research relationship: should SYNTHESIS files be a distinct node_type? Folder-shape consequence: the existing `research/` + `SYNTHESIS.md` pattern.
- **Norm-only vs derived constitutions (epistemic-chain D-7).** Folder consequence: a `nature: norm` constitution like commit-message-constitution lives in the same folder as belief-derived constitutions. No folder distinction surfaces the difference.
- **Frontmatter-ownership decision (two-layer-platform-architecture).** Pending. Its consequence touches schema-version migration discipline — likely lives in `vault/migrations/`, which has no documented rules.
- **What happens to `research/` subfolders in existing discoveries** now that `discovery-structure-constitution.md` forbids them? Not addressed.
- **Schema vs instance split is named but not located.** `scope-and-domain-axes.md` D-13 says vault is schema-source for both graphs but never says *where* schema lives vs where instances live in the folder layout.

## C. Conflicts / tensions in the current structure

1. **The `discovery-structure-constitution.md` (2026-05-16) directly contradicts the existing layout of two older discoveries.** It says: "No other subfolders. Provenance beyond lenses … lives outside the vault and is linked from the README." But:
   - `vault/discovery/domainspec-vault-foundations/research/` (T1–T4 + SYNTHESIS + evidence-survey files) — violates.
   - `vault/discovery/domainspec-vault-edges/research/` (findings.md, research.md, derives-from-overload-investigation.md, subagents-strategy.md) — violates.
   - Also no `lenses/` folder in older discoveries. The discoveries created **before** 2026-05-16 used `<slug>/<topic>.md` directly (curator-pipeline-integration/discovery.md, documents-metadata-enforcement/documents-metadata-enforcement.md).
   - The new constitution's Appendix names `graph-as-residue-attractor/` as the *first* artifact under the new rules. Everything earlier is unmigrated.

2. **Caller's S5 question — "schema lives outside the graph, but constitutions are inside the graph at `vault/constitution/`."** This *is* a real tension and *was not* noted before in the read sources. The vault's frontmatter-as-source-of-truth principle (A-4) plus D-13 (vault is schema-source for both graphs) means the *schema* lives as documents *inside* the vault. The vault's folder is therefore both schema and instance carrier. The two-layer-platform-architecture discovery is the first place this is named as a *form-invariance* concern — but at the infrastructure level (vault_common kernel vs subsystem content), not at the folder level. **The folder layer has not absorbed the two-layer framing yet.**

3. **`folder-structure-constitution.md` is misnamed for the vault.** Its title creates an expectation it does not fulfill — agents searching for vault folder rules land on a repo-code document. No `vault-folder-structure-constitution.md` exists.

4. **Folder-as-classifier rejected (A-4) vs folder-by-node_type observed.** The vault simultaneously declares "folder is not classification" and uses folder names that look exactly like classifications (axiom/, premise/, constitution/). The tension is acknowledged in principle but never resolved structurally.

5. **`discovery/` folder vs "discoveries may live in feature folders."** Appendix B of conventions explicitly permits discoveries outside `vault/discovery/`. But the new discovery-structure-constitution writes its path rule as if all discoveries live under `vault/discovery/`. The constitution narrows what conventions broadens.

6. **README node_type.** `vault/discovery/<slug>/README.md` files carry `node_type: readme`. But `readme` is not in the Appendix B node_type table (twelve values listed, readme not among them). It is used in the wild without being declared.

## D. Cross-vault comparison

**house_project/docs/vault/** (older sibling, 232 conversations, ~30 entries at root):

- Has `axiom/`, `premise/`, `conceptual/`, `constitution/`, `discovery/`, `domain/`, `backlog/`, `audits/`, `conversations/`, `diagrams/`, `conventions/`, `victor/` — overlaps but adds: `audits/` (top-level), `diagrams/`, `conventions/`, `domain/`, `conversations/` (vs `sessions/`).
- Root-level dictionary files: `dictionary-business.md`, `dictionary-events.md`, `dictionary-sys.md`, `graph-edges.md`, `graph-session-index.md`, `meta-layers-diagram.md` — domainspec has none of these.
- `folder-structure-constitution.md` is byte-identical except for two edge-name differences in the Connections section (`cites` vs `contextualizes`; two extra `cited-by` rows in domainspec).

**maestro-trama/vault/** (newer sibling, sparse):

- Has `axiom/`, `premise/`, `conceptual/`, `constitution/`, `discovery/`, `backlog/`, `sessions/`, `conversations/` — *both* `sessions/` and `conversations/`, which is novel.
- Only one discovery (`edges-and-types`). No `audits/`, `domain/`, no root dictionaries.
- `folder-structure-constitution.md` is byte-identical to the domainspec one.

**Divergences:**

- `sessions/` (domainspec, maestro-trama) vs `conversations/` (house_project, also maestro-trama). Naming drift.
- `audits/` exists only in house_project.
- Root-level dictionaries exist only in house_project; domainspec has root navigation/schema docs instead.
- `migrations/`, `snapshots/`, `bets/`, `amendments/`, `ontology-architecture-draft.md`, `foundational-knowledges.md` are domainspec-only.
- `domain/` is house_project-only (a product-business folder).

**Drift vs intent:** The three vaults share the constitution files almost verbatim (the same `folder-structure-constitution.md` that doesn't govern any of them) but diverge significantly in actual top-level folders. There is **no constitution that would catch this drift** — there is nothing to check the actual folder shape against.

## E. Hidden assumptions

1. **Discoveries are created by a single dispatched investigation.** `discovery-structure-constitution.md` §4 says "Has a single dispatched origin. Multi-origin lenses are split." Older discoveries that grew organically over multiple sessions violate this implicit assumption.

2. **Sessions get written by `/close-session` and live forever flat under `sessions/`.** No subdivision rule, no archive rule, no rotation rule. As sessions accumulate (already 34 files), flat layout will degrade.

3. **Constitutions evolve by edit-in-place + version bump.** No rule says "supersede with a new file." Compare: discoveries are explicitly read-only after first save and refinements live in new discoveries. Constitutions and discoveries have opposite revision discipline — never named.

4. **One folder per node_type is the default, even though folder ≠ classification.** This assumption survives despite A-4. The reason it survives is unnamed: probably *because* humans navigate by folder, not by frontmatter query. The vault has two consumers (humans + agents) and the folder layout is the human-affordance layer while frontmatter is the agent-affordance layer. This is never written down.

5. **Graph-as-residue-attractor (2026-05-16) potentially invalidates the per-node_type folder split.** If the graded knowledge graph is the *within-level attractor* of double-residue accounting, then "premise / constitution / axiom" are *stages along a single chain*, not separate kinds. Folder-per-stage may be a coarse-grained discretization of what the graph already encodes via `derives-from` edges + `veracidade`. The framework's recent work suggests folders should reflect *flow* (research → discovery → premise → axiom) rather than *partition*. Not yet acted on.

6. **Discoveries don't need a "lenses are aspects of one finding" enforcement at the folder level.** The constitution names the discipline but no folder rule enforces it (no count check, no overlap check).

7. **The vault platform code lives outside the vault.** `two-layer-platform-architecture/README.md` puts `/domainspec/internal_tools/vault_common/` at sibling level, not under vault/. This decision is implicit: the vault folder is for *content*, the platform folder is for *tools that read content*. Not codified.

## F. The two-layer question

**The current structure does not express the schema/instance distinction at all.**

Where it *would* be visible if expressed:

- A schema file (e.g., `ontology-conventions.md`) declaring the `node_type` enum would live in a `vault/schema/` or similar folder, and the instance documents that carry `node_type: premise` would live elsewhere. They do not.
- A `vault/schema/edges.yaml` machine-readable edge catalog would be cited by every instance document that declares an edge. Instead, `ontology-conventions.md` Appendix C carries the catalog as a Markdown table inside an instance document.

Where it is hidden today:

- **Root-level `.md` files** (ontology-conventions, confidence-levels, ontology-architecture-draft, foundational-knowledges, agent-navigation, human-navigation) are *de facto* the schema layer. They are kept flat at root by convention, but no frontmatter or folder marker says "I am schema; the instance documents below comply with me."
- **`vault/constitution/`** carries both: belief-derived constitutions (which *are* schema-shaping rules: ontology-constitution, schema-amendment-discipline-constitution, frontmatter-ownership-constitution, edge-acyclicity-constitution, governs-runtime-witness-constitution, discovery-structure-constitution) and norm-only constitutions (commit-message, frontend, development-practices). The folder hides the schema/instance distinction by mixing both.
- **`vault/migrations/`** likely carries schema-version migrations — also a schema-layer artifact — but its rules are unwritten.

The two-layer-platform-architecture discovery names this as the *frontmatter-ownership decision* (one Pydantic model in `vault_common` vs folklore per subsystem). That is the schema-side question. The folder-structure question is its mirror: *does the vault's folder shape carry a schema-vs-instance discrimination, or is it flat and frontmatter does all the work?*

Today: flat. Frontmatter does all the work. The two-layer framing has not reached the folder layer yet.

---

**Bottom line for the fractal.** The vault has exactly *one* formal folder rule (discovery shape, 2026-05-16, exploratory) and a constitution that misleadingly names itself folder-structure but governs code. Everything else is convention, observed but not declared. The graph-as-residue-attractor and two-layer-platform-architecture work has surfaced the framework that the folder layer would need to internalize, but the folder layer is still pre-framework.
