---
tags: [gitops, ci-substrate, phase-1, governance]
node_type: spec
layer: infrastructure, governance
status: draft
veracidade: high
conviccao: high
version: 0.1.0
last_updated: 2026-05-02
parent_discovery: ../DISCOVERY.md
---

# Phase 1 — CI Substrate

## Scope

Phase 1 lands the `.github/workflows/` substrate that the framework's docs already pretend exists. Every component wired in this phase already exists in the repo today (five deterministic agents under `copilot/agents/`, nine validators under `tools/`, the `.githooks/pre-commit` script, the `domainspec-emit-signals` skill); none of them are invoked anywhere. Phase 1 is therefore **100% wiring** — no new agent code, no new validator, no infra-as-code. The single new tool (`tools/install-hooks.sh`) is a one-line `git config` wrapper.

Phase 1 also lands two governance items that **must** travel with the wiring: (1) the drift-correction first commit that corrects the three lines in which `ADLC-ALIGNMENT.md` and `TUNING-LOOP.md` falsely claim `.github/workflows/domainspec-tuning.yml` is deployed, and (2) the `CONSTITUTION.md` edit that delegates merge-gate authority to `domainspec-verifier`'s BLOCK verdict. Without (2), Phase 1 is a CI wiring exercise that silently ratifies an authority escalation (DISCOVERY §2.4). Closes the structural part of **G4**, **G11**, **G13**, **G14**, **G15**, **G16**.

## Deliverables (concrete files to land)

| Deliverable | Path | Content sketch | Owner |
|---|---|---|---|
| PR-validation workflow | `.github/workflows/pr-validate.yml` | Required check on every PR to `main`. Fans out to 5 deterministic agents + 9 validators per §5 of discovery. | Phase 1 author |
| Overlay-sync workflow | `.github/workflows/overlay-sync.yml` | Runs on PR + push to `main`. Diffs `copilot/{agents,skills}/` against `.github/{agents,skills}/`, validates `.github/gsd-file-manifest.json`. | Phase 1 author |
| Tuning workflow | `.github/workflows/domainspec-tuning.yml` | Runs every 6h + on push to `main`. Reads `docs/signals/pipeline-signals.jsonl`, invokes analyzer, opens PR with regenerated `TUNING-REPORT.md`. **Filename matches the existing claim in `TUNING-LOOP.md:73` and `TUNING-LOOP.md:426` so the claim becomes true rather than being edited away.** | Phase 1 author |
| Deploy workflow (stub) | `.github/workflows/deploy.yml` | Runs on push to `main` after `pr-validate.yml` passes. Phase 1 ships the workflow file with a no-op job that asserts `pr-validate` passed; Pulumi invocation lands in Phase 3. Stubbed in Phase 1 only to reserve the trigger surface and make the four-workflow split visible from day 1. | Phase 1 author |
| Hook installer | `tools/install-hooks.sh` | One-time script that runs `git config core.hooksPath .githooks`. Idempotent. Documented in `make bootstrap` (or equivalent). | Phase 1 author |
| Overlay-sync validator | `tools/check-overlay-sync.sh` | New script invoked by `overlay-sync.yml`. Diffs source pack against generated overlay; non-zero exit on mismatch. | Phase 1 author |
| Pre-commit extension | `.githooks/pre-commit` (modified) | Add `gitleaks` step + `tools/validate-doc-links.ts` invocation to existing prettier-only hook. | `.githooks/` owner |
| Drift-correction commit | `ADLC-ALIGNMENT.md`, `TUNING-LOOP.md` | First commit of Phase 1, separate from workflow PR. See §Governance edits below. | Canonical doc owners per `AUTHORITY-MAP.md` |
| Governance edit | `CONSTITUTION.md` | New rule (`C12`) delegating merge-gate authority to `domainspec-verifier` BLOCK. See §Governance edits. | `CONSTITUTION.md` owner |
| Signals directory bootstrap | `docs/signals/.gitkeep` (or `README.md`) | The directory must exist before `tuning.yml` can read `pipeline-signals.jsonl`. Empty-stream case is handled by the workflow itself. | Phase 1 author |

## Workflows

### `pr-validate.yml`

- **Trigger:** `on: pull_request: { branches: [main] }`. Required check.
- **Jobs (high-level):**
  - `verifier` — invokes `domainspec-verifier` agent. PASS / FLAG / BLOCK verdict; FLAG annotates PR comment, BLOCK fails check.
  - `alignment-auditor` — invokes `domainspec-alignment-auditor`. Non-empty `ALIGNMENT-REPORT.md` violations fail check.
  - `layering-auditor` — invokes `domainspec-layering-auditor`. Layering rule violation fails check.
  - `otel-verifier` — invokes `domainspec-otel-verifier` *only when* `**/observability.md` or `src/**` paths changed in the PR. Coverage gap fails check.
  - `registry-sync-drift` — invokes `domainspec-registry-sync` in **drift-check-only** mode (no writes; the write mode is Phase 4). Drift between `docs/registry.md` and SPEC concept tables fails check.
  - `validators` — runs the seven PR-relevant scripts under `tools/` (`validate-signals.ts`, `validate-orphans.ts`, `validate-doc-links.ts`, `validate-governance-chain.ts`, `validate-tuning-report.ts` — the last only when `docs/signals/TUNING-REPORT.md` changes — plus `analyze-signals.ts` for threshold checks). Non-zero exit on any one fails the required check.
- **Outputs / side-effects:** PR check status, PR comments (FLAG annotations + verifier verdict summary). **Writes nothing back to the repo.** Reads from PR head SHA only.
- **Authority constraints:** Does it edit human-owned files? **NO.** This workflow is read-only against the repo; it produces only check verdicts and PR comments.

### `overlay-sync.yml`

- **Trigger:** `on: { pull_request: { branches: [main] }, push: { branches: [main] } }`. Required check on PR.
- **Jobs (high-level):**
  - `check-overlay` — runs `tools/check-overlay-sync.sh`. Diffs `copilot/agents/` against `.github/agents/`, `copilot/skills/` against `.github/skills/`, validates `.github/gsd-file-manifest.json` against on-disk reality. Non-zero exit fails check.
- **Outputs / side-effects:** Check status. On `push: main` failure, opens an Issue tagged `overlay-drift` (the `tools/` script can shell out to `gh issue create` for this; spec-only behavior here, exact mechanism is implementation detail).
- **Authority constraints:** Does it edit human-owned files? **NO.** Read-only diff. Phase 1 explicitly does *not* auto-regenerate the overlay — that would be a write to `copilot/install.sh`-managed territory and belongs to a separate decision (Q3 in discovery defers regen automation).

### `domainspec-tuning.yml`

- **Trigger:** `on: { schedule: [{ cron: '0 */6 * * *' }], push: { branches: [main], paths: ['docs/signals/pipeline-signals.jsonl'] } }`.
- **Jobs (high-level):**
  - `analyze` — runs `tools/analyze-signals.ts` against `docs/signals/pipeline-signals.jsonl`. Threshold breach opens proposal Issue per existing `TUNING-LOOP.md` semantics.
  - `detect` — runs `tools/detect-signals.ts` (non-blocking, emits to `pipeline-signals.jsonl` if new signals derivable from artifact diffs since last run).
  - `meta-health` — runs `tools/generate-meta-health.ts` to regenerate `META-HEALTH.md`. Closes **G15**.
  - `prune` — runs `tools/prune-governance.ts` weekly (gated to Sunday 00:00 UTC tick). Opens cleanup PR if pruning is non-trivial.
  - `reflect` — invokes the `domainspec-reflect` skill. Opens a PR with regenerated `docs/signals/TUNING-REPORT.md` if the diff is non-trivial.
- **Outputs / side-effects:** May open PRs (against `main`, never push directly), may open Issues. The PR-opening semantics rely on the `GH_PAT_AGENT` token (declared in DISCOVERY §8 as a Phase-2 SOPS secret; for Phase 1 this is a plain GitHub Actions secret until SOPS lands — see Open items §3).
- **Authority constraints:** Does it edit human-owned files? **NO direct push to `main`.** The workflow proposes changes via PR only. The PRs touch `META-HEALTH.md`, `docs/signals/TUNING-REPORT.md`, and signal-pruning files — all derived/governance-machinery surfaces, not domain content. Human review on the PR is the gate.

### `deploy.yml` (stub)

- **Trigger:** `on: { workflow_run: { workflows: [pr-validate], types: [completed], branches: [main] } }`. Conditioned on `pr-validate` success.
- **Jobs (high-level):**
  - `assert-pr-validate-passed` — single no-op job in Phase 1. Asserts the upstream workflow concluded with `success`. Echoes "Phase 3 will land Pulumi invocation here."
- **Outputs / side-effects:** None in Phase 1.
- **Authority constraints:** Does it edit human-owned files? **NO.** Empty job.
- **Why ship a stub now:** the four-workflow split is the design (DISCOVERY Q6); shipping all four file paths in Phase 1 makes the split self-documenting and prevents a future-Phase-3 PR from having to additionally justify creating the file.

## Governance edits required in Phase 1

These edits are **out-of-band of the workflow PR**. They land as the **first commit of Phase 1**, separate from the workflow PR (DISCOVERY §1 "What stays the same", final paragraph; Q10).

### CONSTITUTION.md edit (merge-gate authority delegation)

**Location:** `/Users/victorboscaro/domainspec/CONSTITUTION.md`, end of the rule catalog table at line 22 (after row `C11`). Add a new row `C12`. Append a corresponding entry to the "Derivation Chain" list (line 24 onwards) and an enforcement note.

**Exact text to add (new row in the rule catalog, after `C11`):**

```
| C12 | The `domainspec-verifier` BLOCK verdict is a binding merge-gate on `main`. CI may enforce BLOCK as a required check whose failure prevents merge. FLAG remains advisory. | A5 | `pr-validate.yml` `verifier` job as required status check on PRs to `main` |
```

**Exact text to add to the "Derivation Chain" list (insert as item 7, after current item 6 at line 31):**

```
7. A5 -> C5, C12 -> verifier admission as required check (CI-enforced merge-gate on BLOCK).
```

**Rationale to record in commit message (not the file):** Per DISCOVERY §2.4, promoting BLOCK from advisory verdict to merge-gate is a governance change, not a CI wiring change. `AUTHORITY-MAP.md` does not currently grant CI configuration authority over `main` merges; this edit makes the delegation explicit and binds the CI enforcement to axiom A5 (the existing axiom under which `C5` already enforces blocking on critical/high violations).

### Drift-correction first commit (B2)

**Three exact line edits.** Each verified against current file contents on 2026-05-02.

#### Edit 1 — `ADLC-ALIGNMENT.md`, G4 row (currently line 78)

**Current text (line 78):**

```
| G4  | **Automated governance**           | Value 4 — Automated governance over manual management         | `domainspec-tuning.yml` auto-analyzes signals on push to main, creates issues when thresholds met (v1.8). Full audit CI still pending                         | Continuous automated governance: audits run on every commit, drift alerts auto-created, compliance dashboards                                             |
```

**Replacement text:**

```
| G4  | **Automated governance**           | Value 4 — Automated governance over manual management         | NOT YET DEPLOYED — `.github/workflows/domainspec-tuning.yml` does not exist on disk as of 2026-05-02 (zero commits in repo history). Wiring scheduled in Phase 1 of `docs/features/gitops-assessment/specs/phase-1-ci-substrate.md`. Full audit CI still pending                         | Continuous automated governance: audits run on every commit, drift alerts auto-created, compliance dashboards                                             |
```

The `✅` checkmark referenced in DISCOVERY §1 is **not on the G4 row itself** — it appears in the "Operational Playbook" at `TUNING-LOOP.md:426` (Edit 3 below). The G4 row instead carries a textual claim that the workflow exists; the correction replaces that claim with an explicit "NOT YET DEPLOYED" annotation.

#### Edit 2 — `TUNING-LOOP.md:73`

**Current text (line 73):**

```
| **Tuning Workflow**  | `.github/workflows/domainspec-tuning.yml` | Runs analyzer on signal commits, creates Issues                 | GitHub Action     |
```

**Replacement text:**

```
| **Tuning Workflow**  | `.github/workflows/domainspec-tuning.yml` *(NOT YET DEPLOYED — Phase 1 of gitops-assessment will land this file)* | Runs analyzer on signal commits, creates Issues                 | GitHub Action     |
```

#### Edit 3 — `TUNING-LOOP.md:426`

**Current text (line 426):**

```
2. Workflow deployed: `.github/workflows/domainspec-tuning.yml` ✅
```

**Replacement text:**

```
2. Workflow deployed: `.github/workflows/domainspec-tuning.yml` ❌ (NOT YET DEPLOYED — Phase 1 of `docs/features/gitops-assessment/` will land this file)
```

#### Note on `INFRA-SETUP.md:484`

DISCOVERY §1 also flags `INFRA-SETUP.md:484` (`git push main  # CI/CD deploys automatically`) as a false claim. **This line is intentionally NOT in the Phase 1 drift-correction commit** — DISCOVERY §1 final paragraph enumerates exactly three drift-correction edits (G4 row, TUNING-LOOP.md:73, TUNING-LOOP.md:426). The `INFRA-SETUP.md:484` claim becomes true in Phase 3 when the VPS reconciler ships. Until then it stays false; that is a Phase 3 concern, not Phase 1.

## Acceptance criteria

Each criterion is independently checkable from the repo root after Phase 1 ships.

1. **Workflow files exist.** `ls .github/workflows/` returns exactly: `pr-validate.yml`, `overlay-sync.yml`, `domainspec-tuning.yml`, `deploy.yml`. No other files.
2. **Workflows parse.** `for f in .github/workflows/*.yml; do gh workflow view "$f" --yaml >/dev/null; done` exits 0 (or equivalent local YAML lint passes).
3. **Required checks registered.** `gh api repos/{owner}/{repo}/branches/main/protection/required_status_checks/contexts` returns a list containing the job names from `pr-validate.yml` and `overlay-sync.yml`.
4. **`pr-validate.yml` blocks on BLOCK.** Open a PR that introduces a synthetic verifier-BLOCK condition (e.g., a SPEC.md with a known schema violation). The PR cannot be merged; `gh pr checks` shows `verifier` as `failure`.
5. **`pr-validate.yml` passes on a clean PR.** Open a no-op PR (whitespace change to a non-tracked file). All `pr-validate` jobs report `success` within 10 minutes.
6. **`overlay-sync.yml` detects drift.** Modify `copilot/agents/domainspec-orchestrator.agent.md` without re-running `copilot/install.sh`. Open PR. `overlay-sync` job reports `failure`.
7. **`domainspec-tuning.yml` runs on schedule.** `gh run list --workflow=domainspec-tuning.yml` shows at least one `schedule`-triggered run within 6 hours of the workflow being merged.
8. **Pre-commit hook is active.** After running `tools/install-hooks.sh`, `git config core.hooksPath` returns `.githooks`. A `git commit` that introduces a `gitleaks`-detectable secret in a staged file is rejected by the hook before the commit completes.
9. **Drift-correction commit landed first.** `git log --oneline -- ADLC-ALIGNMENT.md TUNING-LOOP.md` shows a commit (subject containing `drift-correction` or equivalent) **earlier** than any commit touching `.github/workflows/`. `git show` of that commit modifies exactly the three lines named in §Governance edits, no others.
10. **Constitution edit landed.** `grep -n '^| C12 |' CONSTITUTION.md` returns one match. `grep -n '^7\. A5 -> C5, C12' CONSTITUTION.md` returns one match.
11. **No human-owned file is auto-edited.** `git log --author='github-actions' --oneline -- 'docs/features/**' 'docs/glossary.md' 'docs/registry.md' AUTHORITY-MAP.md AXIOMS.md CONSTITUTION.md TAXONOMY.md` returns zero commits. (Bot PRs are allowed; bot direct commits to authority docs are not.)
12. **Signals directory exists.** `test -d docs/signals` exits 0.
13. **Workflow files claim no authority they do not have.** Every workflow's top-level comment block must include a line `# AUTHORITY: read-only` OR `# AUTHORITY: opens-PRs-only`. `grep -L 'AUTHORITY:' .github/workflows/*.yml` returns no files.
14. **The `tuning.yml` claim is now true.** `test -f .github/workflows/domainspec-tuning.yml` exits 0. The drift-correction edits in `TUNING-LOOP.md:73` and `TUNING-LOOP.md:426` may be reverted (in a separate follow-up PR) once this file lands; until then the explicit "NOT YET DEPLOYED" annotation reflects on-disk reality. (See Open items §1.)

## Out of scope (Phase 1 boundary)

Phase 1 explicitly defers the following. Each item names the phase that owns it.

- **`generated/` tree, `docs/.compiled/manifest.json`, `@source-hash` annotations on derived files.** → **Phase 2** (DISCOVERY §3, §9 Phase 2). The intent-vs-compiled discipline is not enforced in Phase 1; staleness checks against the manifest do not yet run.
- **SOPS+age secret encryption, `gitleaks` as a *security* boundary.** `gitleaks` runs in Phase 1 as a developer-convenience pre-commit + CI check (DISCOVERY §4 final paragraph), but `infra/secrets.enc.yaml` and `SOPS_AGE_KEY` are **Phase 2** (DISCOVERY §8, §9 Phase 2).
- **`tools/check-overlay-sync.sh` evolving into a regenerator.** Phase 1 only ships the diff-and-fail behavior. Auto-regen of `.github/agents/`, `.github/skills/`, `.github/gsd-file-manifest.json` from `copilot/` source pack is **explicitly not in Phase 1** (DISCOVERY Q3 scopes only the validator into Phase 1).
- **VPS reconciler, systemd timer, `git pull` loop, `docker compose up -d`, `infra/docker-compose.yml`, Pulumi project, `prometheus.yml`, `Caddyfile`.** → **Phase 3** (DISCOVERY §7, §9 Phase 3). `deploy.yml` ships in Phase 1 as a stub only.
- **`INFRA-SETUP.md:484` correction.** Stays false until Phase 3 (see §Governance edits, "Note on `INFRA-SETUP.md:484`").
- **`domainspec-bot`, paired/regen-prefix bot-PR pattern, obligation diff PR comments, semantic-hash idempotency, regen-eligible LLM-judgment agents triggering on spec changes.** → **Phase 4** (DISCOVERY §6, §9 Phase 4).
- **`domainspec-registry-sync` in *write* mode.** Phase 1 wires it as drift-check only; the write path runs in Phase 4 bot-PR mode (DISCOVERY §5 table, footnote on `registry-sync` row).
- **The three "mixed/derivable" agents (`domainspec-story-sync`, `domainspec-test-designer`, `domainspec-otel-instrumenter`)** stay interactive in Phase 1; promotion to deterministic is a Phase 4 candidate (DISCOVERY §6 final paragraph).
- **OTel `O15`/`O16` runtime financial-integrity rules as drift detection.** The Coding_Karma three-layer defense (DISCOVERY §2.4) only has its PR-time and admission layers landing in Phase 1; runtime-drift-detection is a downstream concern that requires Phase 3's deploy substrate to exist first.

## Open items

Each carries a recommendation. None block Phase 1; all are flagged for the Phase 1 author to decide before opening the workflow PR.

### 1. Should the drift-correction edits to `TUNING-LOOP.md:73` and `TUNING-LOOP.md:426` be reverted once `domainspec-tuning.yml` lands on disk?

**Recommendation: yes, in a separate follow-up commit gated on Acceptance criterion §14.** The "NOT YET DEPLOYED" annotation is correct *only* during the window between drift-correction commit and workflow merge. Once the file exists on disk, the annotation itself becomes false. The cleanest path is: (a) drift-correction commit lands first, (b) workflow PR lands second, (c) follow-up commit removes the "NOT YET DEPLOYED" annotations and restores the original wording. The G4 row in `ADLC-ALIGNMENT.md` should additionally drop the "Full audit CI still pending" qualifier only after the *full* `pr-validate.yml` is green for one week (a separate, later, evidence-backed edit — not Phase 1).

### 2. Where exactly should `tools/install-hooks.sh` be invoked from?

**Recommendation: a new `Makefile` target `bootstrap` (or `scripts/bootstrap.sh` if no Makefile exists).** DISCOVERY §4 names "a documented `make bootstrap`" but no `Makefile` is present in the repo today. A new `Makefile` is a Phase 1 deliverable only if no equivalent already exists; otherwise a `scripts/bootstrap.sh` invoked from the `INSTALL.md` quick-start is sufficient. Defer the choice to the Phase 1 author after a `find . -maxdepth 2 -name Makefile -not -path './node_modules/*'` check.

### 3. How does `domainspec-tuning.yml` authenticate to open PRs in Phase 1, before SOPS lands in Phase 2?

**Recommendation: use a plain GitHub Actions secret named `GH_PAT_AGENT` for Phase 1, with a TODO comment in the workflow file pointing to Phase 2 SOPS migration.** DISCOVERY §8 declares `GH_PAT_AGENT` as a Phase-2 SOPS-encrypted secret, but the chicken-and-egg problem is that the tuning workflow needs to open PRs from day 1 of Phase 1. The simplest path: ship the secret as a plain repo secret in Phase 1, migrate it (and only it) into `infra/secrets.enc.yaml` as the first SOPS-managed secret in Phase 2. Document the migration as Phase 2's first deliverable.

### 4. Should `pr-validate.yml` jobs be matrix-parallelized or sequential?

**Recommendation: parallel by default, with `verifier` as a gate that other jobs depend on.** Five agents + nine validators serially could push PR check time past 10 minutes. The `verifier` BLOCK is the cheapest fail-fast signal (it reads the SPEC structure, not the full diff), so making it the gate keeps cost down on PRs that BLOCK early. This is implementation guidance, not a domain decision; flagged here so the Phase 1 author records the choice in the workflow file's authority comment block.

### 5. Does the `overlay-sync.yml` failure mode include opening an Issue, or only failing the check?

**Recommendation: PR-time failure is a check failure only (no Issue spam on every editor mistake); `push: main` failure additionally opens an Issue tagged `overlay-drift`.** This matches DISCOVERY §3 framing of the overlay as "derived from `copilot/`" — drift on `main` is a governance-grade event, drift on a PR is a developer-grade event. The asymmetric handling is the cheapest way to signal that distinction.

### 6. Is the `C12` rule statement in `CONSTITUTION.md` worded strongly enough?

**Recommendation: yes, but the Phase 1 author should run the exact wording past the `CONSTITUTION.md` canonical owner before commit.** The proposed text ("The `domainspec-verifier` BLOCK verdict is a binding merge-gate on `main`...") is a strict reading of DISCOVERY §2.4. A weaker form ("CI MAY enforce...") would leave the door open to disabling the check; a stronger form ("CI MUST enforce...") would make removing the check itself a constitutional violation. The "MAY enforce" weak form matches the discovery text verbatim and is recommended here, but the canonical owner has final say.

---

## Cross-references

- Parent discovery: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/DISCOVERY.md` (v0.2.0, approved)
- Drift-correction targets verified at: `/Users/victorboscaro/domainspec/ADLC-ALIGNMENT.md` line 78, `/Users/victorboscaro/domainspec/TUNING-LOOP.md` lines 73 and 426 (verified 2026-05-02)
- Constitution edit target: `/Users/victorboscaro/domainspec/CONSTITUTION.md` (37 lines as of 2026-05-02; insertion after line 22 and line 31)
- ADLC gaps closed (structural part): G4, G11, G13, G14, G15, G16 (per `/Users/victorboscaro/domainspec/ADLC-ALIGNMENT.md`)
- Phase 2/3/4 owners of deferred items: DISCOVERY §9, §3, §6, §7, §8
