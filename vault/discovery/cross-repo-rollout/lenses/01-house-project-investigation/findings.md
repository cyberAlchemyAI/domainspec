---
tags: [vault, lens-findings, cross-repo-rollout, house-project]
node_type: findings
is_session: false
layer: architecture
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — House Project Investigation

## Objective

Investigate `house_project` for cross-repo rollout of /domainspec discipline: current vault state, compatibility with the 7 framework constitutions, and separation of low-risk additive moves from higher-risk deferred items. Original dispatch date 2026-05-16; verification `[local-files-read]`; sources included `house_project/` (top-level, docs/, docs/vault/{constitution,discovery,axiom,premise,conversations}, docs/features/, internal_tools/, scripts/) and `/domainspec/vault/constitution/discovery-structure-constitution.md` for comparison.

## Findings

### House Project — vault state for cross-repo rollout

#### A. Current state inventory

**Top-level shape** — house_project is a working Django/Celery codebase (`/domains`, `/infrastructure`, `/shared_services`, `/dashboard`, `/frontend`, `/internal_tools`, `/migrations`, `/scripts`), with documentation under `/docs`. There is no `vault/` at repo root; the vault lives at `docs/vault/`.

**Vault folder map** (`/Users/victorboscaro/house_project/docs/vault/`):

| Folder | .md count | Notes |
|---|---|---|
| `axiom/` | 4 | business, frontend, ontology, system |
| `premise/` | 5 | business, frontend, ontology, robot-talks, system |
| `constitution/` | 7 | see list below |
| `discovery/` | 2 | `informational-gravity-discovery.md`, `knowledge-graph-topology.md` (flat files, not folders) |
| `conceptual/` | 4 | — |
| `conversations/` | 474 | acts as both sessions and a working corpus; subfolders `constitution/`, `discovery/`, `spec/`, `implementation-plan/`, `test/` |
| `domain/` | 2 | — |
| `victor/` | 1 | personal |
| **vault total .md** | **519** | |

Also present at vault root (not folders): `agent-navigation.md`, `human-navigation.md`, `ontology-conventions.md` (61 KB — the canonical schema doc), `ontology-architecture-draft.md`, `ontology-constitution.md`, `confidence-levels.md`, `meta-layers-diagram.md`, three dictionaries, `graph-edges.md`, `graph-session-index.md`.

**Existing constitutions (7):** `commit-message`, `development-practices`, `domain-tagging`, `event-system`, `folder-structure`, `frontend`, `robot-talks`. All are code/process constitutions — none are vault-structural (no discovery-structure, no frontmatter-ownership, no edge-acyclicity equivalents).

**Existing discoveries (2):** flat-file pattern, not the README+lenses pattern. Both have full frontmatter incl. `node_type: discovery`, `veracidade`, `convicção`.

**Sessions:** `vault/conversations/` (474 .md files). Most-recent sampled: `2026-05-13-2237-deriver-probe-findings-rules-first-dashboard.md`. Frontmatter is **rich** — includes `is_session: true`, `timestamp`, `expires`, `conversation_id`, `decisions_made`, `contradictions_found`, `specs_updated`, `promoted_candidates`, `expected_importance`, `importance_rationale`. Session-note discipline already exists; node_type distribution in conversations: `discovery 60`, `spec 59`, `audit 43`, `implementation-plan 28`, `constitution 13`, `test 10`, `conceptual 8`.

**Features documentation:** `/Users/victorboscaro/house_project/docs/features/` — 13 feature folders + a README + an `all-features-mapping/` cross-context index. Each feature folder holds the **DomainSpec aspect-file layout**: `SPEC.md`, `STORIES.md`, `TEST-SPEC.md`, `ALIGNMENT-REPORT.md`, `DECISIONS.md`, `FEATURE-OVERVIEW.md`, `GAP-QUESTIONS.md`, `LAYERING-ALIGNMENT-PLAN.md`, `LAYERING-ALIGNMENT-REPORT.md`, plus aspect files `domain.md`, `events.md`, `interfaces.md`, `mappings.md`, `operations.md`, `queries.md`, `states.md`, `workflows.md`. Total: 213 .md files. Every file inspected has frontmatter with `node_type`, `layer`, `nature`, `status`, `version`, `last_updated`, and most have `veracidade`/`convicção`.

**Tooling:** `/scripts/` has `scaffold_domain.py` plus many domain-data scripts (no vault tooling visible). `/internal_tools/` includes `ccb-registration-demo/`, `commits_productivity/`, `personal_assistant/`, `semantic_index/`, `vault_routing/` — the last is the closest to vault tooling. No `vault_common/` Pydantic schema, no `vault_ctl`-style CLI, no `vault/onboarding/`, no `vault/snapshots/`, no `vault/migrations/` (these last three are absent at the vault root).

#### B. Compatibility assessment with /domainspec discipline

- **Frontmatter format.** Same family — `node_type`, `layer`, `nature`, `status`, `version`, `last_updated`, `tags`, `audience`, `veracidade`, `convicção`, `is_session` are all in use across house_project. House_project is in fact the *source* of the convention; `ontology-conventions.md` (61 KB) here is plausibly the parent of /domainspec's. So: **compatible at field level**.
- **Constitution shape.** Identical pattern — YAML frontmatter + `# Constitution: …` + Objective + numbered rules + Connections table. Matches /domainspec's constitution shape closely.
- **Discovery shape.** **Divergent.** House_project uses **flat single-file discoveries**, /domainspec uses **README + `lenses/NN-*.md`** with an explicit `verification:` field. No house_project discovery has a `lenses/` folder; none use the `verification` field.
- **Edge declarations.** **Prose + table-based**, not typed frontmatter edges. Connections are declared in a markdown "Connections" table at the bottom of each doc (see `folder-structure-constitution.md` lines 222–228) and in a top-level `graph-edges.md`. No `edges:` frontmatter key. /domainspec's edge-acyclicity model assumes typed frontmatter edges — adopting it requires a migration.

#### C. The 7 framework constitutions — does each apply cleanly?

| Constitution | Verdict | Why |
|---|---|---|
| **discovery-structure** | PARTIAL | Concept lands; shape diverges. House_project has only 2 discoveries (low migration cost) but also keeps 60 `node_type: discovery` files inside `conversations/`. Adopting requires either (a) restructuring 2 discoveries into folders, or (b) declaring conversations-discoveries out of scope. |
| **frontmatter-ownership** | YES | Frontmatter discipline already strong; this constitution would formalize what is already practice. The 519-file corpus would need a one-time sweep to ensure required fields, but no semantic disagreement. |
| **convicção-bet-ledger** | PARTIAL | `convicção` is used (37+ files) and `veracidade` too — so the vocabulary is native. But there is no `bets/` folder, no B-NNN ledger, no `promoted_candidates` lifecycle beyond the field already in session frontmatter. Adoption is additive (new folder + new file shape). |
| **schema-amendment-discipline** | YES (additive) | No existing amendment ledger or `amendments/` folder. Nothing conflicts; pure addition. The big risk is that `ontology-conventions.md` is enormous (61 KB) and is the de facto schema — formalizing amendment to *it* would require declaring it the schema source-of-truth first. |
| **edge-acyclicity** | NO (today) | Edges are prose/tables, not typed frontmatter. Cannot mechanically check acyclicity without a parser for the Connections-table format or a frontmatter migration. Defer until edge representation is unified. |
| **governs-runtime-witness** | PARTIAL | House_project does have code/doc binding (constitutions reference skills, e.g. `folder-structure-constitution` → `.claude/skills/custom/folder-structure.md`), but no `governs:` frontmatter contract and no runtime witness pattern. Adoption requires both the field and an enforcement loop (pre-commit or CI). |
| **vault-folder-structure (draft)** | PARTIAL | House_project's vault has extras (`conversations/`, `domain/`, `conceptual/`, `dictionary-*.md`, `graph-*.md`, dual navigation files) and is missing canonical pieces (`bets/`, `amendments/`, `snapshots/`, `migrations/`, `onboarding/`, lens-shaped `discovery/`). Adoption needs a "house_project profile" of the constitution, or a layered v0 → v1 path. |

#### D. Features documentation

The features corpus (13 features × ~16 aspect files = 213 .md) is **already a near-perfect mapping to instance/feature shape**. Each feature folder is self-contained, has consistent aspect files, and every file has frontmatter with `node_type`, `layer`, `nature`, `status`. Most have `veracidade`/`convicção`.

Verdict: each feature folder could become `vault/instance/feature/<feature>/` with `SPEC.md` (or `FEATURE-OVERVIEW.md`) acting as the README, and the aspect files (`domain.md`, `events.md`, `interfaces.md`, `operations.md`, `queries.md`, `states.md`, `workflows.md`, `mappings.md`) acting as lens-equivalents — though they are not currently named `lenses/NN-*.md` and the README requirement isn't formalized. They behave like discoveries: triangulated, cross-referenced, with explicit gap-questions and decisions logs. **Lowest-cost path:** add `verification:` to each aspect file and a `README.md` that points to the existing FEATURE-OVERVIEW.md as the canonical synthesis; do not rename folders.

#### E. Recommendation — low-risk vs higher-risk

**Tonight, low-risk (additive only, no rename/no edit of existing files):**

1. Create `docs/vault/onboarding/` with a single `README.md` pointing agents at `agent-navigation.md`, `ontology-conventions.md`, `confidence-levels.md`, and `human-navigation.md`. Mirrors /domainspec's `onboarding/` slot.
2. Create `docs/vault/snapshots/` and drop a snapshot-zero file: content-addressed inventory of the current 519 vault .md + 213 feature .md (hash + path + node_type). Pure read; no edits.
3. Copy /domainspec's 7 constitutions into a **new subfolder** `docs/vault/constitution/framework/` (not the root constitution folder, to avoid namespace collisions with `folder-structure-constitution.md` which already exists with house_project-specific meaning). Mark each with `status: proposed` and an `adopted_in_repo: false` field. This makes the framework visible without claiming adoption.
4. Create `docs/vault/amendments/` and `docs/vault/bets/` as empty folders with stub READMEs. Zero risk; declares slots.
5. Write a `docs/vault/MIGRATION-NOTES.md` summarizing this very investigation and the deferred items.

**Must be deferred (higher-risk, requires planning + user sign-off):**

- Any restructure of the 2 existing discoveries into README+lenses shape (modifies existing files).
- Edge migration from Connections-tables to `edges:` frontmatter (touches every constitution + most discoveries; cross-cutting).
- Adoption of `governs:` frontmatter and witness enforcement (needs CI hook decision).
- Folding `conversations/` into a `sessions/` discipline (474 files; affects 60 `node_type: discovery` items that masquerade as sessions).
- Promotion of the existing `ontology-conventions.md` to a formal schema with amendment ledger (it is load-bearing; editing it needs the schema-amendment constitution to already be in force — chicken-and-egg).
- Renaming features/ aspect files or wrapping them as `vault/instance/feature/<name>/` (213 files, breaks external links).

#### F. Migration cost estimate for full /domainspec-style adoption

| Phase | Scope | Effort |
|---|---|---|
| P0 Snapshot + slot creation (tonight) | Add 4 folders, 1 inventory, copy 7 framework constitutions | ~1 session |
| P1 Frontmatter sweep + schema declaration | Validate 519+213 files have required fields; promote ontology-conventions.md to versioned schema; open amendment-0 | 1–2 sessions |
| P2 Discovery restructure | 2 vault discoveries → README+lenses; decide policy for the 60 conversations-discoveries (likely: leave as session-discoveries, do not migrate) | 1 session |
| P3 Edge migration | Parse Connections-tables + `graph-edges.md` into `edges:` frontmatter; add edge-acyclicity check | 2–3 sessions (touches every constitution and most discoveries) |
| P4 Features-as-instances | Add `README.md` + `verification:` to each of 13 feature folders without renaming files | 1 session |
| P5 governs/witness wiring | Choose binding format; add CI/pre-commit witness; backfill `governs:` on the 7 existing constitutions | 1–2 sessions |
| P6 Bet ledger + session discipline merge | Stand up `bets/B-NNN`; reconcile `conversations/` ↔ `sessions/` ↔ close-session | 1–2 sessions |

**Total realistic: 7–11 sessions** to reach full /domainspec parity, of which **only P0 is safe tonight**.

#### Key observations

- House_project is **schema-compatible** with /domainspec because /domainspec inherited the vocabulary from house_project (same field names, same `convicção`/`veracidade` axis, same `node_type` enum extended). The discipline gap is **shape and process**, not vocabulary.
- The biggest divergence is **edges-as-prose vs edges-as-frontmatter**. Until that is resolved, edge-acyclicity cannot be mechanically enforced.
- `conversations/` is house_project's de facto session+spec+discovery dumping ground (474 files) — the cleanest /domainspec mapping is to treat it as a *legacy basin* and not retro-migrate, while applying new discipline only to new artifacts.
- The features/ corpus is the **best candidate** for first /domainspec-style enforcement: 13 self-contained folders, already aspect-organized, frontmatter-clean. A pilot here would prove the rollout pattern before touching `vault/`.

## Caveats

- Investigation was read-only; counts and node-type distributions reflect filesystem state at 2026-05-16 and may have drifted.
- The 7-constitution framing pre-dates the canonical framework constitution catalog; one-to-one mapping is approximate.
- Effort estimates in §F are session-count guesses, not measured.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
