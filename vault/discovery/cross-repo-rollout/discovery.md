---
tags: [cross-repo, rollout, vault, framework-adoption, domainspec]
node_type: discovery
is_session: false
layer: [ontology, architecture]
nature: [explanatory, reference]
status: draft
version: 0.2.0
last_updated: 2026-05-17
---

# Discovery: Cross-Repo Rollout of /domainspec Discipline

> /domainspec is a meta-framework imported as a submodule into consumer repos. The rollout question is not "how do we deploy it" but "for each target repo, which framework constitutions, skills, and folder slots can be adopted additively tonight, which require migration, and which are off-the-table without redesign."

> **Post-hoc alignment (v0.2.0, 2026-05-17).** This discovery was originally drafted directly from the three lens findings on 2026-05-17 without an intermediate research-layer document. On the same day, the lens → research → discovery convention was retrofitted: each lens was migrated into a `lenses/<slug>/findings.md` subfolder, and `research/research.md` + `research/research-synthesis.md` were written by independent post-hoc re-read of the three lens findings (the discovery was deliberately not consulted during research authorship). The research layer's cross-lens analysis broadly corroborates this discovery's commitments and surfaces four open questions worth tracking — most notably (Q-R1) that the lens slate is silent on whether house_project's `internal_tools/` overlaps maestro-trama's, and (Q-R2) that "catalog-of-record reconciliation" — framed here as maestro-specific in §2 — generalizes to wherever ≥2 catalogs coexist (house_project also exhibits the pattern internally across `graph-edges.md`, `ontology-conventions.md`, and per-doc Connections tables). See `research/research.md` for the full retrofit analysis and `research/research-synthesis.md` for the ≤500-word summary.

## Objective

Codify the per-target-repo strategy for adopting /domainspec discipline across the three investigated consumers (`house_project`, `football-stats-oracle`, `maestro-trama`), identifying the universal additive moves, the per-repo blockers, and the items that stay out of scope. End state: a future implementation plan can pick any one repo and execute the low-risk layer without re-running the diagnosis.

---

## 1. Business Context

### Why now

/domainspec has reached a point where its 7 framework constitutions (frontmatter ownership, edge acyclicity, discovery structure, vault folder structure, schema amendment discipline, governs/runtime witness, convicção bet-ledger) are stable enough to be exported. Three consumer repos sit at radically different points on the adoption curve: one is the *seed* (`football-stats-oracle`), one is the *parent of the vocabulary* (`house_project`), and one already *mounts the framework via symlink* (`maestro-trama`). Without a per-repo rollout strategy, attempts to "copy the discipline in" will collide with existing structures, duplicate vocabulary, or violate constitutions the target repo cannot yet enforce.

### What's broken

Each target repo presents a distinct adoption gap, located concretely:

- **`house_project`** — discovery shape diverges: existing discoveries at `house_project/docs/vault/discovery/` are flat single-file (`informational-gravity-discovery.md`, `knowledge-graph-topology.md`), not README+lenses. Edges live as prose+tables in `graph-edges.md` and per-doc Connections tables (e.g. `folder-structure-constitution.md` lines 222–228), not as typed `edges:` frontmatter — so edge-acyclicity cannot be mechanically enforced. `conversations/` (474 files) conflates sessions, discoveries (60 files), specs (59), audits (43).
- **`football-stats-oracle`** — discovery raw bundles at `domain_knowledge/discovery/2026-05-15-foundations-bootstrap/raw/d*.md` have **no frontmatter at all** and no lens curation layer. `domain_knowledge/sessions/` is empty despite the May 15 bootstrap producing 20+ substantive files — the close-session skill (the seed of /domainspec's own) has not been used in its own repo. No edges, no snapshots, no constitution articulation as a coherent set.
- **`maestro-trama`** — `maestro-trama/domainspec → ../domainspec` and `maestro-trama/.claude → domainspec/.claude` are symlinks; the framework is already mounted in-tree. The "duplicate domainspec" premise is false. Two ontology catalogs coexist: `maestro-trama/vault/ontology-conventions.md` Appendix C (14 edges) vs. `.claude/skills/custom/edge-catalog.md`. One discovery exists at `vault/discovery/edges-and-types/2026-05-15-trama-and-maestro-ontology-extensions.md` without `lens:`, `dispatched_by:`, or `verification:` fields. `internal_tools/` holds four tools (`vault_routing/`, `semantic_index/`, `creative_harnessing/`, `creative_analysis_harnessing/`) with **no overlap** to /domainspec's `internal_tools/` — disjoint surfaces, unresolved canonicalization.

### What stays the same

Out of scope for this discovery, in every target repo:

- Existing code (`/domains`, `/infrastructure`, `/apps`, `/data`) — rollout is vault-discipline only.
- Bulk rewrites of legacy session corpora (`house_project/docs/vault/conversations/` 474 files; not migrating).
- Voice/content of artifacts in `maestro-trama/business-philosopher/` — structure can be added around them; the prose stays untouched.
- Renaming feature aspect files (`house_project/docs/features/<feature>/*.md`, 213 files) — would break external links.
- The `governs:`/runtime-witness pattern wherever runtime emission isn't already wired.
- Per-repo `internal_tools/` canonicalization — disjoint surfaces are tolerated; merger is a separate decision.

---

## 2. Core Concepts

### Adoption profile

A per-repo classification across four dimensions: **vocabulary fit** (frontmatter keys, evidence-stage ladder), **shape fit** (discovery layout, edge representation), **process fit** (sessions, snapshots, close-session usage), **mount mechanism** (vendored copy, submodule, symlink, none). Each target repo gets a profile; the rollout sequence falls out of it.

### Additive-only layer

The subset of framework adoption that creates new folders/files without editing existing ones. Universally safe across all three repos: snapshot-zero stub, `onboarding/` README, framework constitutions copied into a namespaced subfolder (e.g. `constitution/framework/`) with `status: proposed`, empty `bets/` and `amendments/` slots. Chosen over in-place edits because every target repo has load-bearing existing content the rollout must not break.

### Catalog-of-record reconciliation

Where two ontology catalogs coexist (maestro-trama's Appendix C vs `.claude/skills/custom/edge-catalog.md`), edge-acyclicity adoption is gated on declaring one source-of-truth. Picked over "merge silently" because edges are load-bearing for the graph; a hidden divergence becomes a chronic source of drift.

### Reciprocal flow (seed repo)

For `football-stats-oracle` specifically — the framework owes the seed the discipline it gave away, made explicit: the `verification:` field, the lens-curation layer over `raw/`, and the 7-constitution articulation as a coherent system rather than three coexisting skills. This is bidirectional rollout, not one-way export.

### Symlink mount as deployment

`maestro-trama` demonstrates a third mount option beyond vendored-copy and git-submodule: filesystem symlink to a sibling working tree. Inherits framework atomically; no sync mechanism needed; gated on the symlink being intentional and stable (currently a [DEFERRED] question to the user).

---

## 3. Per-Repo Adoption Profile

| Dimension | house_project | football-stats-oracle | maestro-trama |
|---|---|---|---|
| Mount | none (peer repo) | none (peer repo) | symlink `domainspec → ../domainspec` + `.claude → domainspec/.claude` |
| Frontmatter fit | **High** (parent of the vocabulary) | **Partial** (schema defined in skill, never applied) | **High** (custom skills are the same files) |
| Discovery shape | flat single-file × 2 | `raw/d*.md` dumps, no frontmatter, no lenses | one discovery file, lens-adjacent but missing `lens:`/`dispatched_by:`/`verification:` |
| Edge representation | prose + tables (`graph-edges.md` + per-doc Connections) | none | two coexisting catalogs (Appendix C vs `edge-catalog.md`) |
| Sessions | `conversations/` (474, conflated) — rich frontmatter | `sessions/` empty despite substantive bootstrap | `sessions/` has 2 notes, rich frontmatter |
| Constitutions present | 7 (code/process — none vault-structural) | 0 | 7 (mirror of house_project — code/process) |
| Features corpus | 13 features × ~16 aspect files (213 .md, near-DomainSpec shape) | empty `docs/features/` | n/a |
| Seed status | parent of vocabulary (`ontology-conventions.md` 61KB) | seed of evidence-stage ladder + close-session skill | consumer; mounts framework |

## 4. Cross-Repo Rollout Strategy

### Universal additive layer (any repo, any night)

Six moves work in every target repo and edit no existing file:

1. **Snapshot-zero stub.** Single file capturing the current vault inventory (paths + node_types + hashes). Pure read.
2. **`onboarding/README.md`** pointing at the repo's existing navigation files (`agent-navigation.md` / `ontology-conventions.md` / equivalents).
3. **Framework constitutions in a namespaced subfolder** (e.g. `constitution/framework/`) with `status: proposed` and `adopted_in_repo: false` — declares the framework without claiming adoption, sidesteps namespace collisions with existing constitutions (e.g. house_project's `folder-structure-constitution.md` already exists with a different meaning).
4. **Empty `bets/` and `amendments/` folders** with stub READMEs. Declares the slots.
5. **`MIGRATION-NOTES.md`** linking back to this discovery and per-repo lens.
6. **`verification:` field backfill** on any single existing discovery as a pattern demonstration (safe single-line YAML addition).

### Per-repo specifics on top of the universal layer

**house_project** — the features corpus (`docs/features/`, 13 folders × ~16 aspect files) is the **best pilot surface** for first /domainspec-style enforcement: self-contained, aspect-organized, frontmatter-clean. Add `README.md` + `verification:` to each feature without renaming files. Do not migrate the 60 `node_type: discovery` files inside `conversations/` — treat that folder as legacy basin.

**football-stats-oracle** — the overdue act is **writing the retroactive May 15 bootstrap session note using the close-session skill the repo authored**. That single act closes the reciprocal loop. Then add `README.md` in front of each existing `raw/` bundle as a proto-lens-index. Port `verification:` back into the football close-session schema (one-line addition to the skill).

**maestro-trama** — with the symlink intact, the rollout is purely *inside* `maestro-trama/vault/`. Add the 4 non-colliding framework constitutions (frontmatter-ownership, schema-amendment-discipline, discovery-structure, vault-folder-structure) as peers; add convicção-bet-ledger constitution; backfill `verification:` on the existing discovery. business-philosopher is already a peer-vault in shape — same additive moves apply.

### Higher-risk items (deferred everywhere)

- Edge migration from prose/tables to typed `edges:` frontmatter (house_project: every constitution + most discoveries; maestro-trama: gated on catalog reconciliation).
- Lens-shape backfill of existing discoveries (house_project: 2 files; maestro-trama: 1 file; football: full `raw/` → `lenses/` refactor with skill-semantic changes).
- `governs:`/runtime-witness adoption — gated on each repo's runtime emission surface.
- `conversations/` → `sessions/` reconciliation in house_project (474 files, 60 of which masquerade as discoveries).
- Promoting `ontology-conventions.md` (61KB, house_project) to a formally amendable schema — chicken-and-egg with the schema-amendment constitution.

### Sequencing across the three repos

No hard dependency forces a particular order, but a defensible sequence is:

1. **maestro-trama first** — symlink already in place, additive layer is cheapest, exercises the framework on a live consumer.
2. **football-stats-oracle second** — write the reciprocal bootstrap session note; smallest surface; closes the seed-loop.
3. **house_project third** — largest surface (732 .md files across vault + features), highest payoff (features corpus is the best pilot), but also where namespace collisions and legacy `conversations/` make additive-only most necessary.

## 5. Reciprocal Flow Back to the Seed (football-stats-oracle)

Football-stats was the source of the evidence-stage ladder (`premise → constitution → axiom`) and the close-session skill (25-line body cap, refuse-to-promote stance, "sessions are signposts not documents"). Both now operate at higher fidelity in /domainspec than in their repo of origin. Four things flow back:

1. **`verification:` frontmatter field.** Invented in /domainspec; should land in football's close-session schema.
2. **Lens layer over `raw/`.** The pattern that emerged elsewhere is the missing step.
3. **Snapshot-zero.** Not a backfill — new bundles only.
4. **The 7-constitution articulation as a coherent system.** Football has the practices; /domainspec produced the meta-document naming them.

The reciprocal flow is **not** framework → seed in the trivial sense. It is the framework giving the seed back **its own discipline made explicit and verifiable**.

## 6. What Stays Out of Scope (Hard Boundaries)

- **No edits to existing files in the universal additive layer.** Every move creates new files or new folders. If a backfill is needed (e.g. `verification:` on an existing discovery), it is called out explicitly as a single-line YAML addition.
- **No rename of existing constitutions or features.** house_project's `folder-structure-constitution.md` keeps its current meaning; the framework's version lands in a namespaced subfolder.
- **No `internal_tools/` canonicalization.** Three live options exist (keep disjoint; promote maestro's `vault_routing` into /domainspec; promote /domainspec's `vault_ctl` line into maestro). Each defensible; read-only investigation cannot decide. Deferred to user.
- **No retro-migration of legacy session corpora.** house_project's `conversations/` (474 files) is a legacy basin; new discipline applies only to new artifacts.
- **No edge-acyclicity adoption before the catalog-of-record is declared** in repos where two catalogs coexist (maestro-trama).
- **No runtime-witness enforcement** before the repo has a runtime emission surface.

## 7. Open Questions

- **OQ-1 — Symlink stability (maestro-trama).** Is `maestro-trama/domainspec → ../domainspec` permanent or transitional? Rollout shape changes materially if transitional (would need de-symlink + vendor framework + sync mechanism). Recommendation: declare permanent unless there is a specific reason to vendor.
- **OQ-2 — internal_tools canonicalization.** Three options live (disjoint / promote maestro-trama's `vault_routing` upstream / promote /domainspec's `vault_ctl` line downstream). Recommendation: keep disjoint until /domainspec's `vault_ctl` and `graph_retrieval` stabilize enough to permit clean comparison; revisit in 2–3 sessions.
- **OQ-3 — Edge catalog reconciliation.** maestro-trama's `vault/ontology-conventions.md` Appendix C (14 edges) vs. framework's `.claude/skills/custom/edge-catalog.md`. Same 14? Mostly same? Divergent? Recommendation: dedicate a single session to a side-by-side diff and pick the framework catalog as source-of-truth (it already serves the symlinked `.claude/` surface).
- **OQ-4 — `ontology-conventions.md` schema status (house_project).** The 61KB file is the de facto schema. Formalizing amendment requires declaring it the schema source-of-truth first, but the schema-amendment constitution itself isn't yet adopted. Recommendation: adopt the constitution first with `status: proposed`, then promote ontology-conventions.md in a second pass.
- **OQ-5 — Football reciprocal session note authorship.** The May 15 bootstrap produced 20 substantive files and zero session notes; trigger was clearly met. Recommendation: write the retroactive note as the *first act* of the football rollout — this is the smallest, highest-symbolism move available.
- **OQ-6 — Features-as-instances mapping in house_project.** Each `docs/features/<feature>/` could become `vault/instance/feature/<feature>/`, but the aspect files aren't named `lenses/NN-*.md` and the README requirement isn't formalized. Recommendation: add a `README.md` pointing at the existing `FEATURE-OVERVIEW.md` as canonical synthesis; do not rename folders.
- **OQ-7 — Treatment of conversations/discoveries (house_project).** 60 files inside `conversations/` carry `node_type: discovery`. Migrate to `vault/discovery/` (folder shape) or leave as session-discoveries permanently? Recommendation: leave as legacy basin; apply new discipline only to discoveries authored after rollout date.

## 8. Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/cross-repo-rollout/lenses/01-house-project-investigation/findings.md` | `derives-from` | house_project per-repo state, compatibility assessment, and risk separation are the basis for the house_project profile and OQ-4/OQ-6/OQ-7. |
| `vault/discovery/cross-repo-rollout/lenses/02-football-stats-investigation/findings.md` | `derives-from` | football-stats-oracle per-repo state and the reciprocal-flow analysis are the basis for §5 and OQ-5. |
| `vault/discovery/cross-repo-rollout/lenses/03-maestro-trama-investigation/findings.md` | `derives-from` | maestro-trama symlink finding, dual-vault diagnosis, and internal_tools surface comparison are the basis for the maestro profile and OQ-1/OQ-2/OQ-3. |
| `vault/discovery/cross-repo-rollout/research/research.md` | `derives-from` | Post-hoc cross-lens analysis that retrofits the lens → research → discovery chain; corroborates this discovery's commitments and surfaces Q-R1–Q-R4. |

---

## Source dispatch

This discovery synthesizes three lens-shaped investigations dispatched on 2026-05-16 under the `cross-repo-rollout` topic. Each lens was a read-only investigation of a single target repo (`house_project`, `football-stats-oracle`, `maestro-trama`) with `verification: [local-files-read]`. Promotion to discovery was confirmed by the user on 2026-05-17 (lifecycle step 7, knowledge-scope path).

Provenance:
- `vault/discovery/cross-repo-rollout/lenses/01-house-project-investigation/findings.md`
- `vault/discovery/cross-repo-rollout/lenses/02-football-stats-investigation/findings.md`
- `vault/discovery/cross-repo-rollout/lenses/03-maestro-trama-investigation/findings.md`
- `vault/discovery/cross-repo-rollout/research/research.md` (post-hoc retrofit, 2026-05-17)
