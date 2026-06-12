---
node_type: refinement-stage
role: Measurement and Infra Cartographer
created: 2026-06-12
tags: [research, experiments, c2, infra, measurement, test-derivation]
layer: application
nature: analysis
status: active
version: 0.1.0
last_updated: 2026-06-12
---

# Measurement & Infra Cartographer — C2 Test-Derivation Cluster (E1/E2/E3)

Maps the REAL execution surface for running the C2 experiments and enumerates every tooling/infra unit that must be BUILT before any run. Missing infra is the #1 cause of experiment stall; this map is exhaustive on purpose.

C2 = "tests are deterministically derivable from concepts, relationships, and deltas" — `T = f(C, R, Δ)`. E6/E9 validated the _input space_ (vocabulary + edges). E1/E2/E3 are the first experiments that exercise the _derivation function itself_ and the _tests it produces_. None has been run; all infra below is greenfield except the JSONL convention (reusable from E6/E9).

---

## 1. Cross-Repo Execution Surface

This is a private umbrella of submodules. The C2 experiments straddle **two** private submodules plus the parent.

| Concern                                                                            | Repo / path                                                                                    | Visibility |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| Derivation SKILL + agent (`domainspec-generate-tests`, `domainspec-test-designer`) | `implementation/domainspec/`                                                                   | private    |
| Derivation rules (`TEST-PIPELINE.md`, `CHANGELOG.md`)                              | `implementation/domainspec/domainspec/`                                                        | private    |
| Feature aspect docs (states/operations/interfaces/events/...)                      | `validation/poker-team/docs/features/<feature>/`                                               | private    |
| Generated `TEST-SPEC.md` (derivation OUTPUT)                                       | `validation/poker-team/docs/features/<feature>/TEST-SPEC.md`                                   | private    |
| Backend domain code + existing tests (vitest)                                      | `validation/poker-team/backend/src/use-cases/<feature>/`                                       | private    |
| Experiment protocols, results, raw JSONL data                                      | `implementation/domainspec/docs/research/{experiments,results,data}/`                          | private    |
| Refinement-run artifacts (this stage)                                              | `implementation/domainspec/development/refinement-runs/2026-06-12-test-derivation-c2-cluster/` | private    |
| Pre-registration proposal (commit-hash before run)                                 | `implementation/domainspec/experiments/<date>-<slug>/proposal.md` (E9/dual-residue convention) | private    |

**Where each step runs:**

- **Derivation (E1, E2's D-set):** runs the `domainspec-generate-tests` skill against a poker-team feature. The skill READS from `implementation/domainspec/domainspec/{CHANGELOG.md,TEST-PIPELINE.md}` AND from `validation/poker-team/docs/features/<feature>/*.md`, and WRITES `TEST-SPEC.md` into `validation/poker-team`. **This is a cross-submodule operation** — the agent's CWD and path assumptions (`docs/features/{feature}/...`, `domainspec/CHANGELOG.md`) are written as if both trees are rooted at a single repo. They are NOT. (Blocker B1 below.)
- **Mutation testing (E3):** runs entirely inside `validation/poker-team/backend/` (vitest + a not-yet-installed Stryker).
- **Analysis (10-step Wohlin) + JSONL capture:** lands in `implementation/domainspec/docs/research/`.

**Submodule-discipline implications for committing experiment data:**

1. **Raw data (`docs/research/data/EX-*.jsonl`) commits into `implementation/domainspec`.** Generated `TEST-SPEC.md` artifacts commit into `validation/poker-team`. These are two separate commits in two separate submodules.
2. **Golden Rule (submodule-first, parent-last):** if a run produces artifacts in BOTH submodules, you must commit+push each submodule independently, THEN bump the parent gitlink for both, run `make bump-check`, then commit/push the parent. Never bump the parent to an unpushed submodule commit (`push.recurseSubmodules=check` enforces this).
3. **Pre-registration ordering hazard:** the proposal commit hash (frozen before run) must land in `implementation/domainspec` _and be pushed_ before the first run. A run whose data references a proposal commit that isn't pushed breaks reproducibility/audit.
4. **Detached-HEAD risk during runs:** a long multi-feature run that triggers `git submodule update` (or any checkout) can snap a submodule back to the recorded gitlink, silently reverting in-progress generated TEST-SPECs. Pin `main` (`git -C <path> checkout main`) and avoid `make sync` mid-run.
5. **Nested submodule cleanup item:** `validation/poker-team/domainspec` is an uninitialized nested submodule (SUBMODULE-DISCIPLINE §8). If the runner resolves `domainspec/CHANGELOG.md` _relative to poker-team_, it may hit this empty nest instead of `implementation/domainspec`. Must be resolved before E1.

---

## 2. Input-Closure for a Reproducible Run (`system_prompt_hash`)

`system_prompt_hash` (mandated by EXPERIMENTS.md) must hash the **entire content that determines the derivation behavior** — not just a system prompt string. For `domainspec-generate-tests`, the closure is every file the skill+agent read plus the feature inputs:

**Framework-side (constant across features in a run):**

1. `implementation/domainspec/.agents/skills/domainspec-generate-tests/SKILL.md` (the skill body)
2. `implementation/domainspec/.claude/agents/domainspec-test-designer.agent.md` (the agent persona/process — note: per-runtime copies exist under `.github/agents/`, `.codex/agents/`, `copilot/agents/`; hash the runtime actually used)
3. `implementation/domainspec/domainspec/TEST-PIPELINE.md` (the deterministic doc→test mapping rules)
4. `implementation/domainspec/domainspec/CHANGELOG.md` (mandatory first read; "current-framework constraints")

**Feature-side (varies per feature — hash separately or include feature_id in the row):**
5–8. The 4 aspect docs the skill declares as inputs: `docs/features/<feature>/{states.md, operations.md, interfaces.md, events.md}`

> Drift note: the agent's `<execution>` and TEST-PIPELINE also reference `queries.md`, `workflows.md`, `mappings.md`. The SKILL.md `<context>` lists only the 4 above. **The input set is ambiguous** (4 declared vs 7 referenced). The hasher must pin the EXACT file list per the version actually run, and the refinement should reconcile SKILL vs agent vs TEST-PIPELINE input lists (Major M1).

**Recommended closure definition:** `system_prompt_hash = sha256( concat( sorted(framework files 1–4) ) )` recorded once per run; a separate `feature_input_hash = sha256( concat( feature aspect docs ) )` recorded per row. This separates "did the framework change" from "did the feature spec change" — both are needed to defend determinism claims.

---

## 3. Tooling That Must Be Built — BUILD LEDGER

Each unit is independently buildable. Effort is rough (S = <0.5d, M = ~1d, L = ~2-3d). Nothing in this ledger exists today except the JSONL convention shape.

| #   | Unit                                             | What it does                                                                                                                                                                                                                                                                                                              | Used by                      | Depends on                                                                          | Effort |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- | --- |
| T1  | **Obligation-ID / key extractor**                | Parse `TEST-SPEC.md` → normalized obligation set. Each obligation = section-prefix ID (`RV-1`, `CT-3`, `ST-2`, `EF-4`...) + rule/description + source ref. Output canonical sorted set + cardinality per δ-rule category.                                                                                                 | E1, E2                       | TEST-SPEC table format (stable: `\| ID \| Rule \| Test Description \| Expected \|`) | M      |
| T2  | **Input-closure hasher**                         | Hash framework files (1–4) → `system_prompt_hash`; hash feature aspect docs → `feature_input_hash`. Resolves cross-submodule paths. Emits the hash + the exact file list + each file's individual sha256 (for audit).                                                                                                     | E1, E2, E3 (metadata)        | Resolved input list (M1), cross-repo path map (B1)                                  | S      |
| T3  | **Pairwise Jaccard calculator**                  | Given N runs' obligation sets (from T1), compute all `C(N,2)` pairwise Jaccard on obligation IDs; report min/mean/=1.0 check. Also classify deviations (rule-ambiguity / hallucination / graph-interp).                                                                                                                   | E1                           | T1                                                                                  | S      |
| T4  | **JSONL run-capture harness + schemas**          | One append-only writer enforcing the EXPERIMENTS.md metadata block + per-experiment columns (E1/E2/E3 schemas from protocols). Reuse E6/E9 row shape. Validates schema on write; refuses edits to existing rows.                                                                                                          | E1, E2, E3                   | metadata fillability (§5)                                                           | M      |
| T5  | **Fresh-session runner / orchestration**         | Spawn a clean agent session per run (E1 needs 10×3 = 30 derivation sessions + 30 bare-LLM control sessions; no session carryover), invoke `domainspec-generate-tests <feature>`, capture output TEST-SPEC + session_id + rules-fired, hand to T1/T4. Must guarantee session isolation and stable model/temperature.       | E1 (control too), E2 (D-set) | T1, T2, T4; cross-repo invocation (B1)                                              | L      |
| T6  | **Bare-LLM control harness**                     | E1's stochastic baseline: same 3 features through a bare prompt ("write tests for this feature spec") ×10, captured identically for Jaccard comparison.                                                                                                                                                                   | E1                           | T5, T3, T1                                                                          | S      |
| T7  | **Manual-test capture rig + rubric**             | E2: human tester writes a test plan per feature (30-min time-box, blind to derived tests). Structured intake of M-set so T1-style normalization + overlap (D∩M, D\M, M\D) + traceability-% can be computed. Needs a tester and a rubric doc.                                                                              | E2                           | T1, human operator                                                                  | M      |
| T8  | **D-vs-M comparator**                            | Compute count, overlap (Jaccard on normalized obligations), set differences with category tags, traceability-% for D and M.                                                                                                                                                                                               | E2                           | T1, T7                                                                              | S      |
| T9  | **Mutation harness wiring (Stryker)**            | Install + configure `@stryker-mutator/core` + vitest runner in `validation/poker-team/backend/` (currently ABSENT — only vitest). Per-feature mutation runs for: (a) derived suite only, (b) existing manual suite only, (c) combined. Requires "derived tests" to be EXECUTABLE code, not just a TEST-SPEC.md catalogue. | E3                           | scaffold step (B2), Stryker install                                                 | L      |
| T10 | **Derived-test scaffolder→executable bridge**    | E3 needs runnable derived tests. The skill's `--scaffold` produces stubs mapped to TEST-SPEC rows; those stubs must be filled into passing vitest tests wired to backend domain code so Stryker can measure kill rate of the _derived_ suite in isolation.                                                                | E3                           | `domainspec-generate-tests --scaffold`, backend code                                | L      |
| T11 | **Surviving-mutant classifier**                  | Classify survivors trivial / moderate / critical (business-rule). Critical=0 is an E3 success gate; needs a rubric tying mutants to domain rules.                                                                                                                                                                         | E3                           | T9                                                                                  | M      |
| T12 | **Result-aggregation / 10-step Wohlin pipeline** | Reproduce the E6/E9 analysis spine: data-integrity audit → descriptive stats → hypothesis testing (Jaccard=1.0 for E1;                                                                                                                                                                                                    | D                            | ≥                                                                                   | M      | for E2; mutation-score gates for E3) → subgroup → gap taxonomy → sensitivity → triangulation → validity threats → claim adjudication (C2) → synthesis. Emits `results/EX-results.md`. | E1, E2, E3 | T3/T8/T9 outputs, JSONL | L   |
| T13 | **Pre-registration freezer**                     | Write `experiments/<date>-c2-cluster/proposal.md` (falsification criteria, frozen feature list, model/temp, success thresholds), commit+push BEFORE first run, record the commit hash into every JSONL row (`prereg_commit`). Mirrors dual-residue §7.                                                                    | E1, E2, E3                   | none (do first)                                                                     | S      |

**Reuse vs build:** Only the JSONL row _shape_ and the 10-step _narrative structure_ are reusable from E6/E9. Every measurement computation (T1, T3, T8, T9, T11) and every orchestration unit (T5, T6, T7, T10) is new — E6/E9 were human-classification experiments with no automated derivation/execution surface. This cluster is the first to require a real runner and real mutation infra.

---

## 4. Data Layout

- **Raw JSONL:** `implementation/domainspec/docs/research/data/E1-run-YYYY-MM-DD.jsonl`, `E2-run-...`, `E3-run-...` (naming per data/README.md: `EX-run-YYYY-MM-DD.jsonl`).
- **Append-only discipline:** never edit a row after collection (EXPERIMENTS.md rule 1 + data/README rule 1). T4 must enforce this at the writer level.
- **One row per observation:** E1 = one row per (feature × run_number) = 30 derived + 30 control. E2 = one row per feature (7). E3 = one row per feature (7).
- **Metadata block per row:** the EXPERIMENTS.md block (experiment_id, run_id, timestamp, domainspec_version, model, model_temperature, system_prompt_hash, feature_id, operator) PLUS the per-experiment columns from each protocol's "Data Collected" table.
- **Derived/aggregated output → `results/`, never `data/`** (data/README rule 3). `results/E1-results.md`, etc., follow `results/TEMPLATE.md` and the E6/E9 10-step format.
- **Update `data/README.md` Navigation + `EXPERIMENTS.md` status table** when runs complete (these are tracked edits, not raw-data edits).

---

## 5. Metadata Completeness — Can the Mandated Block Be Filled TODAY?

| Field                                                            | Fillable now?        | Source / gap                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `experiment_id`, `run_id`, `timestamp`, `feature_id`, `operator` | ✅                   | trivial                                                                                                                                                                                                                                                                                                                                                                               |
| `model`                                                          | ✅                   | runner-set; E6/E9 used `claude-opus-4-20250514` (note: protocol _examples_ say `claude-sonnet-4`). Pin one in proposal.                                                                                                                                                                                                                                                               |
| `model_temperature`                                              | ✅ (but verifiable?) | "= 0" is mandated for determinism, but there's **no harness that actually pins/asserts temperature=0** on the agent session today. T5 must enforce + record it, else the field is aspirational. (Major M2.)                                                                                                                                                                           |
| `system_prompt_hash`                                             | ❌ today             | requires T2 + a resolved input list (M1). Cannot be filled until the hasher exists and the input closure is pinned.                                                                                                                                                                                                                                                                   |
| `domainspec_version`                                             | ⚠️ ambiguous         | **No `VERSION` file; `package.json` has no `version`.** The only version signal is the CHANGELOG top heading = **`2.1.0`** (2026-05-16). E6/E9 recorded **`1.8.2`** — a stale/hardcoded value. There is no single source of truth wired to the data writer. T4 must derive `domainspec_version` from the CHANGELOG top heading (or a new VERSION file) deterministically. (Major M3.) |

**Bottom line:** today you can fill 6 of 9 fields by hand. `system_prompt_hash` is **not fillable** without T2 (blocker). `model_temperature=0` is recordable but **not enforceable** without T5. `domainspec_version` has **no canonical source** and is currently a copy-paste literal.

---

## 6. Pre-Registration Mechanics (commit-hash-before-run)

The dual-residue `proposal.md` (`experiments/2026-05-22-dual-residue-loss/`) is the working model (§6 falsification-criteria-precommitted, §7 pre-registration discipline, §10 reporting with frozen commit hash). Adapt for C2:

1. Author `experiments/2026-06-12-c2-test-derivation/proposal.md` freezing: the feature list (E1: auth-access-control, player-management, financial-settlement; E2/E3: the 7 features), model+temperature, the input-closure file list, and success thresholds (E1 Jaccard=1.0; E2 |D|≥|M| for 6/7 + traceable>95%; E3 mutation-score≥70%, critical-survivors=0).
2. Commit+push that proposal into `implementation/domainspec` **before** the first run; record the commit hash.
3. Stamp `prereg_commit` (the frozen hash) into every JSONL row so analysis can prove the protocol predated the data.
4. Report all outcomes regardless (null result is valid), with the frozen hash in `results/EX-results.md` (dual-residue §10).

Submodule hazard: the proposal lives in a submodule, so "commit hash that predates the run" is a _submodule_ hash. Push it first (Golden Rule) — an unpushed prereg hash is unverifiable by anyone else.

---

## 7. Severity-Ranked Gaps

### Blockers (no run can start)

- **B1 — Cross-submodule path resolution.** SKILL/agent assume `docs/features/{feature}/...` and `domainspec/CHANGELOG.md` are co-rooted; they live in two different submodules. No runner today bridges `implementation/domainspec` (rules) and `validation/poker-team` (features/output). Until T5 + a path map exist, derivation cannot run reproducibly. Compounded by the uninitialized nested `validation/poker-team/domainspec` submodule (could shadow the real CHANGELOG).
- **B2 — No executable derived tests for E3.** E3 needs the _derived_ suite run in isolation under Stryker, but Stryker is **not installed** and the skill emits a `TEST-SPEC.md` catalogue (+ optional stubs), not passing tests wired to backend code. Without T9 + T10, E3 is unrunnable.
- **B3 — `system_prompt_hash` unfillable.** Mandated metadata field has no producer (needs T2) and no pinned input list (M1). Every E1/E2/E3 row is non-compliant until built.

### Majors (run possible but results not defensible)

- **M1 — Input-closure ambiguity.** SKILL lists 4 aspect docs; agent/TEST-PIPELINE reference 7 (adds queries/workflows/mappings). The hash + determinism claim depend on pinning the EXACT set actually read. Reconcile before freezing the proposal.
- **M2 — temperature=0 not enforced.** Determinism (E1's entire claim) rests on temp=0, but no harness pins/asserts it. A run that silently used a non-zero temperature would invalidate E1.
- **M3 — No canonical `domainspec_version`.** CHANGELOG says 2.1.0; prior data hardcoded 1.8.2; no VERSION file, no `version` in package.json. The writer must derive it deterministically or the field is meaningless across runs.
- **M4 — No fresh-session isolation harness.** EXPERIMENTS.md rule 2 demands no session carryover; T5 must guarantee it for 60 E1 sessions. Manual session management is error-prone and unauditable.

### Minors (polish / audit hardening)

- **m1 — Obligation-ID stability.** T1 relies on stable section prefixes (`RV-`, `CT-`, `ST-`...). If derivation renumbers or renames IDs run-to-run, Jaccard is artificially depressed; normalize on (rule + source-ref) as a fallback key, not just the printed ID.
- **m2 — Control-prompt specification.** E1's bare-LLM control ("write tests for this feature spec") is underspecified (which docs does it see? same 4? all?). Pin it in the proposal so the stochastic baseline is reproducible.
- **m3 — Manual-tester availability + rubric (E2).** Needs a human and a documented blind-authoring rubric; schedule dependency, not a code dependency.
- **m4 — Mutant→business-rule mapping (E3 critical=0 gate).** T11's "critical" class needs a rubric tying mutation operators to domain rules in operations.md; otherwise "critical-survivors=0" is unauditable.

---

## 8. Critical-Path Build Order

```
T13 (prereg freeze)  ──┐
M1 reconcile inputs ───┼─→ T2 (hasher) ─→ T4 (JSONL harness) ─┐
B1 cross-repo path map ┘                                      │
                                                              ↓
                            T5 (fresh-session runner) ─→ T1 (extractor) ─→ T3 (Jaccard) ─→ E1 + T6 control
                                                                        └─→ T7/T8 ─→ E2
                            T9 (Stryker) + T10 (executable derived) ─→ T11 ─→ E3
                                                              ↓
                                                    T12 (Wohlin pipeline) → results/EX-results.md
```

E1 is the lightest path (T13, T2, T4, T5, T1, T3, T6). E3 is the heaviest (Stryker + executable-test bridge are both greenfield, both L-effort). E2 sits in the middle but adds a human-in-the-loop scheduling dependency.
