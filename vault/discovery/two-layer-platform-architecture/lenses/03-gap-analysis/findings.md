---
tags: [vault, lens-findings, two-layer-platform-architecture]
node_type: findings
is_session: false
layer: architecture
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Gap Analysis: What the Five Proposals Missed

## Objective

Identify what the five infrastructure proposals do NOT cover but will be needed; prioritize gaps; flag honest non-concerns.

## Findings

## 1. Gap catalog

### Gap 1: Vladimir-onboarding infrastructure
- **What:** No path for the second human (Vladimir, 15-year collaborator) to read, contest, or contribute to the formalized vault. All five tools assume a solo operator who already speaks the framework's vocabulary.
- **Why real:** The convergence claim in `graph-as-residue-attractor` rests on "two agents have converged iff their hom-presheaves agree per node." With one agent, that criterion is untestable. Without Vladimir formally in the loop, the empirical falsifier for the headline theorem cannot be run.
- **When it bites:** Month 2–4.
- **MVR:** A `vault/onboarding/vladimir.md` flat reading order (3 docs max), plus a "reader view" CLI flag that hides frontmatter scaffolding. ~1 day.

### Gap 2: Cross-repo ontology drift
- **What:** Multiple repos (`domainspec`, `domainspec-theorem`, `house_project`, `maestro-trama`, `football-stats-oracle`, `financas_pessoais`) each have their own `vault/` or `domainspec/`. The constitution at `/domainspec/vault/constitution/` governs only that repo.
- **Why real:** The discovery README cites the four-repo convergence as primary evidence. If vocabularies drift, retroactively the convergence becomes unfalsifiable. S5 (schema lives outside the graph) is violated across the repo boundary.
- **When it bites:** Month 3–6. Probably already biting subtly.
- **MVR:** Single source-of-truth constitutions in /domainspec, referenced (not copied) from siblings. Or a `validate-vault` script that runs cross-repo and fails on schema mismatch.

### Gap 3: Backup / index recovery
- **What:** Git covers source files. Generated structured indices (SQLite, kuzu graph, EVōC embeddings, persistence diagrams) are regenerable but expensive — may not be deterministic across model/library versions.
- **Why real:** Once telemetry runs are cited as evidence in a discovery lens, the indices become load-bearing for reproducibility.
- **When it bites:** Month 6–12.
- **MVR:** Weekly `tar.zst` of indices to one offsite location. Pin embedding model versions in lockfile. ~2 hours.

### Gap 4: Public-facing artifact pipeline
- **What:** No path from vault → paper/book. No bibliography manager, no LaTeX export, no citation graph from `derives-from` edges.
- **Why real:** The framework's own self-description is paper-shaped. References are maintained by hand in `domainspec-two-layer-framework.md`. The vault has `derives-from:` frontmatter that *is* a citation graph but isn't extracted.
- **When it bites:** Month 6–18.
- **MVR:** Defer. Add a `bibkey:` frontmatter field now to non-session nodes so a future extractor has something to grip.

### Gap 5 — STABLE TEST CORPUS (the most important)
- **What:** Proposals for RAG, convergence runners, Lean pipelines need a frozen reference vault to test against. None defined.
- **Why real:** Otherwise every tool tests against HEAD and regressions are invisible. The EVōC claim ("bottleneck distance on persistence diagrams as convergence metric") requires a stable input to be a metric at all.
- **When it bites:** Week 3–6.
- **MVR:** Tag `vault-corpus-v0` at current state. Pin all tools to read from that tag by default; only switch the tag forward deliberately. **~1 hour. Highest leverage of any gap.**

### Gap 6: Frontmatter migration
- **What:** The `verification:` field was added mid-conversation; all pre-existing lenses are now non-conformant. No migration tool, no deprecation policy, no schema-version field.
- **Why real:** Already happened once. The constitution itself says `version: 0.1.1`. Without migration discipline, either old files silently fail validators or the constitution can't evolve.
- **When it bites:** Already biting. Acute by month 2.
- **MVR:** Add `schema_version:` field to frontmatter. One-shot script per migration that backfills defaults. Versioned migrations in `vault/migrations/`. ~2 hours per migration.

### Gap 7: CI / end-to-end health check
- **What:** No runnable smoke test exercising vault read → index → query → lens-validation. Each tool will have its own tests; none verifies the seam between them.
- **Why real:** Standard integration-test gap.
- **When it bites:** Month 4–8.
- **MVR:** Single `make health` target reading three known files, building indices, running one query, validating one lens. Run in pre-push hook. ~half a day.

### Gap 8: Schema-contract versioning for consumers
- **What:** RAG, telemetry, and Lean pipeline all consume vault structure. When the vault schema evolves (Gap 6), these break silently. No declared API contract between vault and consumers.
- **Why real:** This is exactly the framework's own thesis applied to itself — the vault is $\mathcal{L}_1$, the consumers' read-schemas are $\mathcal{L}_2$, and the unmodeled gap is the residue. The framework predicts its own infrastructure will leak here.
- **When it bites:** Month 3+, every time Gap 6 fires.
- **MVR:** A `vault/schema/v1.json` JSON-schema file consumers validate against. Bump version on breaking change; consumers pin a version.

### Gap 9: Session and discovery immutability enforcement
- **What:** Constitution says sessions are immutable append-only (S9, I3) and discoveries are read-only after first save. No proposal enforces either. Currently both are just markdown files anyone can edit.
- **Why real:** I3 is invoked in §3 of the two-layer framework as the instance-side correlate of $A_{inj}$. If sessions are silently mutable, the entire instance-level audit story is wishful.
- **When it bites:** First time anyone edits an old session "just to fix a typo."
- **MVR:** Pre-commit hook rejecting modifications to files under `sessions/` and `discovery/*/README.md` whose mtime is older than the commit. ~1 hour.

### Gap 10: Provenance of model-generated content
- **What:** Lens frontmatter records `dispatched_by` and `verification:` but not model/version/prompt-hash. A lens with `verification: [model-recall]` is second-class, but we can't tell which model recalled what.
- **Why real:** Models change. Today's Opus 4.7 `model-recall` is tomorrow's outdated training cutoff. Without a model identifier, "corroborate before treating as load-bearing" can't be operationalized.
- **When it bites:** Month 6+.
- **MVR:** Extend frontmatter: `produced_by: {agent, model_id, date}`. Lint requires it for non-`local-files-read` lenses.

## 2. Prioritization

**Must close before others (weeks 1–4):**
- Gap 5 (test corpus) — every other tool needs it
- Gap 6 (migration) — already biting; blocks Gap 8
- Gap 9 (immutability enforcement) — load-bearing for the framework's own claims

**Next tier (months 1–3):**
- Gap 2 (cross-repo coherence)
- Gap 8 (consumer contracts) — depends on Gap 6
- Gap 10 (model provenance)

**Defer with eyes open (months 3+):**
- Gap 1 (Vladimir) — depends on human decision, not infra readiness
- Gap 3 (backups) — accept risk 6 months
- Gap 7 (CI smoke) — useful but not on critical path until tools compose
- Gap 4 (publication pipeline) — premature; reserve only the `bibkey:` slot

## 3. The single most important gap

**Gap 5 — stable test corpus.** The framework's central empirical promise is the EVōC convergence metric: "two agents have converged iff their hom-presheaves agree per node" with bottleneck distance on persistence diagrams as the falsifier. A metric requires a stable substrate. Without a frozen reference corpus, every EVōC run, every RAG comparison, every Lean-pipeline regression test will be measured against a moving vault — and the natural reaction will be to attribute drift to "vault evolution" rather than to real regressions. This silently dissolves the framework's falsifiability. Cost to close: under an hour. Cost of not closing: the headline empirical claim becomes decorative.

## 4. Honest negatives

- **Gap 4 (publication pipeline) is not a real concern yet.** Framework at version 0.1.0, status `exploratory`, all `Next Moves` internal. Building LaTeX export now would gold-plate. Only cheap insurance worth taking: reserve a `bibkey:` frontmatter slot.
- **Gap 3 (backups) less urgent than it sounds for *source* files.** Git + remote already gives 3-copy redundancy for markdown. Real risk is regenerable indices, recoverable in days, not lost. Accepting the risk for 6 months is defensible.
- **Gap 7 (CI smoke) not load-bearing until at least two tools exist and compose.** Building it now tests nothing.
- **A "master ontology" file (one variant of Gap 2) is probably the wrong shape.** Reference-from-siblings (or `git subtree`) is lighter and avoids a new artifact whose own evolution would need governing (S5 recursion).

## Caveats

- Original lens dispatched 2026-05-16 by general-purpose Sonnet subagent (4 tool calls); dispatch prompt unrecoverable.
- Sources read parent README, sibling lens 01 (residue predictions), discovery-structure-constitution, and a skim of /domainspec-theorem two-layer framework.
- Verification level `[local-files-read]`.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
