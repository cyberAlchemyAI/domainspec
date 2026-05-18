---
lens: football-stats-investigation
date: 2026-05-16
dispatched_by: subagent — read-only investigation of /football-stats-oracle for cross-repo rollout
addresses: Current state + compatibility + the reciprocal flow back to the seed repo
sources:
  - /Users/victorboscaro/football-stats-oracle/
  - /Users/victorboscaro/football-stats-oracle/.claude/skills/close-session/SKILL.md
  - /Users/victorboscaro/football-stats-oracle/.claude/skills/folder-structure/SKILL.md
  - /Users/victorboscaro/football-stats-oracle/domain_knowledge/ (all subfolders)
  - /Users/victorboscaro/football-stats-oracle/docs/references/2026-05-15-build-surface-bootstrap/raw/
  - /Users/victorboscaro/football-stats-oracle/domain_knowledge/discovery/2026-05-15-foundations-bootstrap/raw/
verification: [local-files-read]
---

# Football-Stats-Oracle: state and rollout fit

## A. Current state inventory

Top-level:

| Path | State |
|---|---|
| `domain_knowledge/` | 5 subfolders: `premise/`, `constitution/`, `conceptual/`, `discovery/`, `sessions/` |
| `docs/` | `features/` (empty), `modules/` (empty), `references/` (1 bundle) |
| `data/`, `infra/`, `tooling/`, `experiments/` | all empty placeholders |
| `.claude/skills/` | 2 skills: `close-session`, `folder-structure` |
| `.claude/settings.json` | present (2.6KB) |

Counts under `domain_knowledge/`:

| Folder | Files |
|---|---|
| `premise/` | 0 |
| `constitution/` | 0 |
| `conceptual/` | 0 |
| `sessions/` | 0 |
| `discovery/2026-05-15-foundations-bootstrap/raw/` | 9 files (d1–d8 + d-lindy) |

Companion bundle in `docs/references/2026-05-15-build-surface-bootstrap/raw/` — 11 files (c1–c10 + c-lindy). Same `<date>-<slug>/raw/<id>-<topic>.md` shape, just under `docs/` because it's infra/data-track rather than domain-track.

Net: this is a freshly bootstrapped repo. Only the discovery bundles have content; the evidence-tree folders (premise/constitution/conceptual) and sessions are all empty.

## B. Compatibility assessment

**Frontmatter.** The football discovery raw files (`d1-rules.md` etc.) have **no YAML frontmatter** — they open with `# Title` directly. The session-note schema in `close-session/SKILL.md` defines rich frontmatter (`evidence_stage`, `decisions_made`, `files_touched`, `experiments_run`, `premise_tests_run`, `candidate_premises`, `promotion_candidate`, `retires`, `artifacts`), but no session note has yet been written, so it's spec-only.

**Constitution shape.** Empty. No worked examples on disk.

**Discovery shape — material divergence from /domainspec.**
- Football: `discovery/<date-slug>/raw/d*.md` — flat numbered raw files, no README, no `lenses/` subfolder, no per-file frontmatter. Bundle is a "research dump."
- /domainspec: `discovery/<slug>/README.md + lenses/<NN-name>.md` — README is the orchestrator, lenses are the structured findings with `verification:` field.

These are **two different artifact types**: football's `raw/` is closer to /domainspec's `raw/` (subagent output dumps) than to `lenses/` (curated findings). What football is missing is the **lens layer on top of raw** — there is no README orchestrating d1–d8 into curated lenses, and there is no constitution-stage rollup yet.

**Edge declarations.** None. No `edges:` frontmatter, no graph metadata, no typed links.

**Evidence-stage vocabulary.** Football's `premise → constitution → axiom` ladder is **the same vocabulary** /domainspec's framework uses. Identical lineage — because this repo seeded it.

## C. The 7 framework constitutions: applicability

(Inferring the 7 from /domainspec context: vault-as-residue, evidence-stage discipline, lens-shaped discoveries, snapshot-zero, edge-typed graph, close-session, folder-structure-fractal.)

| # | Constitution | Football applicability |
|---|---|---|
| 1 | Evidence-stage discipline (premise/constitution/axiom) | **Already native.** Codified in `folder-structure/SKILL.md`. This is where it was born. |
| 2 | Vault-as-residue (knowledge tree, not chat log) | **Already native.** Close-session explicitly forbids auto-creating premise files; "knowledge tree is not a chat-log dump." Verbatim. |
| 3 | Lens-shaped discoveries (README + lenses/, with `verification:` field) | **Not adopted.** Discoveries are `raw/` dumps. Needs new lens layer. |
| 4 | Snapshot-zero pattern (initial state captured before changes) | **Not present.** No snapshot mechanism. Bootstrap predates the pattern. |
| 5 | Typed edges / graph metadata | **Not present.** No edge frontmatter anywhere. |
| 6 | Close-session | **Native + canonical.** This *is* the source. See §D. |
| 7 | Folder-structure-fractal (folder is the schema) | **Mostly native.** `folder-structure/SKILL.md` defines kind × evidence-stage as the placement axes. Doesn't yet do the fractal recursion /domainspec added. |

## D. Close-session — has the seed been honored?

The football close-session skill (`.claude/skills/close-session/SKILL.md`, 25 lines body cap, evidence-stage frontmatter, refuse-to-promote stance, "sessions are signposts not documents") is the **original**. /domainspec's session-note pattern derives from it.

**Has it been used here?** No. `domain_knowledge/sessions/` is empty. The bootstrap day (May 15) produced two discovery bundles but no closing note. That violates the skill's Step 0 trigger — substantive changes to `domain_knowledge/` and `docs/` were made.

**Has /domainspec used this skill?** Yes — /domainspec session notes were spawned from this shape. The discipline now exists in /domainspec at higher fidelity than in its own repo of origin.

## E. The football vault structure and schema/instance mapping

Football already encodes **two orthogonal axes**:
- **Kind:** `domain_knowledge/` vs `docs/` vs `data/` vs `infra/` vs `tooling/` vs `experiments/`
- **Evidence stage** (only within `domain_knowledge/`): `premise/`, `constitution/`, `conceptual/`, `discovery/`, `sessions/`

This is roughly /domainspec's schema/instance split but **non-fractal**: evidence-stage subdivision exists only at one level (under `domain_knowledge/`), not recursively. /domainspec's fractal version would apply the same stage logic inside `conceptual/`, inside features, etc.

The `conceptual/` folder is interesting — it's the "derived concepts / vocabulary / domain models" bucket, which maps closely to /domainspec's **schema layer** (types, definitions). `premise/constitution/axiom` then sit as the **instance/claim layer** about the schema. Football already separates them; what's missing is wiring them with typed edges (`refines:`, `instantiates:`, `tests:`).

`evidence_stage` as a frontmatter field is **the same vocabulary** /domainspec uses on session notes — direct lift.

## F. Recommendation — low-risk vs higher-risk

**Tonight (low-risk, additive only):**
1. Write the first session note covering the May 15 bootstrap, using the skill that already exists. This is overdue and tests the skill against real load.
2. Add a `README.md` in front of each existing `raw/` bundle naming what was investigated and listing the d/c files (proto-lens-index). No restructure.
3. Port /domainspec's `verification:` frontmatter field into the football close-session schema (one line addition). Cheap, fully compatible.
4. Add empty `vault/` symlink or alias note documenting that `domain_knowledge/` *is* the vault — terminology bridge so cross-repo references work.

**Deferred (higher-risk, needs design):**
1. Lens-shaped discovery migration. Converting `raw/d*.md` into curated `lenses/NN-*.md` is a real refactor and changes the skill's `artifacts:` semantics. Needs the football repo to decide whether `raw/` and `lenses/` coexist (mirroring /domainspec) or `raw/` becomes the lens layer.
2. Snapshot-zero. Bootstrap moment is already past; retrofitting is partial. Adopt going forward, don't backfill.
3. Typed edges. Requires choosing an edge vocabulary that fits a prediction/stats domain (likely different verbs than /domainspec's epistemic ones). Design work.
4. Fractal folder-structure. Wait for /domainspec to harden the pattern; football is a good second adopter, not co-designer.
5. The other 5 framework constitutions beyond close-session + folder-structure — port one at a time, each via its own session note.

## G. The reciprocal question — what flows back to the seed?

Football-stats was the seed. Two things shipped from here to /domainspec: the evidence-stage ladder, and the close-session skill (including the 25-line body cap and refuse-to-promote stance). Both are now used in /domainspec at higher fidelity than they're used in their own repo.

**What needs to flow back:**

1. **The `verification:` frontmatter field on lenses.** Invented in /domainspec, never existed in football's close-session schema. Should be added to the football session-note template — it is exactly the discipline football's evidence-stage ladder was trying to enforce, just made explicit.

2. **Lens-shaped discovery.** /domainspec evolved `raw/` (subagent dumps) into `raw/ + lenses/` (curated, with verification). Football's `raw/d*.md` files are sitting as undifferentiated dumps with no lens curation. The pattern that emerged elsewhere is the missing step here.

3. **Snapshot-zero.** Not a backfill, but new bundles in football should adopt it.

4. **The 7-constitution articulation itself.** Football has the *practices* (evidence stages, close-session, folder-structure) but no meta-document naming them as constitutions. /domainspec produced that articulation. Importing it tells football's future contributors *why* these practices exist as a coherent system rather than three skills that happen to coexist.

5. **Harmonization debt.** The skill says write a session note for substantive changes — yet the bootstrap day generated 20 substantive files and zero session notes. Either the trigger is wrong or the discipline lapsed. /domainspec's experience honoring the skill is evidence the skill works; the gap is repo-local, not skill-local. First action in football should be: write the retroactive bootstrap session note. That single act closes the loop — the seed repo finally uses the skill it gave away.

The reciprocal flow is therefore not framework → seed in the trivial sense. It is: framework gives the seed back its **own discipline made explicit and verifiable**, plus the curated-lens layer the seed never built on top of its raw bundles. Net: low-risk, high-symbolism, do it tonight.
