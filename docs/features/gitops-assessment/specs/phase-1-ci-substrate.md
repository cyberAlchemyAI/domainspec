---
tags: [gitops, ci-substrate, phase-1, governance, vault-pilot]
node_type: spec
layer: infrastructure, governance
status: draft
veracidade: high
conviccao: high
version: 0.2.0
last_updated: 2026-05-02
parent_discovery: ../DISCOVERY.md
---

# Phase 1 — CI Substrate (Vault-First Pilot)

## Scope

Phase 1 lands the CI substrate that v1 needs to enforce **vault GitOps**. The four `.github/workflows/` files all gain vault-scoped jobs as their first deliverable; framework-generic patterns are extracted to a reusable composite action in v2.

The pivot rationale: the vault under `/Users/victorboscaro/domainspec/vault/` is the densest, most rule-bound corpus in the repo (see `vault/ontology-conventions.md` v1.4.0 for the seven-label schema, Appendix B value catalog, and Appendix C edge type catalog; see `vault/agent-navigation.md` for the nine traversal heuristics; see `vault/confidence-levels.md` for the five-level maturity state machine with explicit entry/exit criteria). It is therefore the natural first target for automated GitOps enforcement: the schema is already written, the rules are already explicit, and the corpus is already large enough that manual enforcement is brittle. Generalizing the same workflow scaffolds to non-vault markdown is a v2 concern.

Phase 1 also lands two governance items that **must** travel with the wiring: (1) the `CONSTITUTION.md` edit that delegates merge-gate authority to `domainspec-verifier`'s BLOCK verdict and **extends** that delegation to vault frontmatter violations, and (2) a drift-correction first commit that corrects the three lines in which `ADLC-ALIGNMENT.md` and `TUNING-LOOP.md` falsely claim `.github/workflows/domainspec-tuning.yml` is deployed, plus an additive `## Implementation Status` section on `vault/ontology-architecture-draft.md` that links to this feature. Without (1), Phase 1 silently ratifies an authority escalation (DISCOVERY §2.4). Closes the structural part of **G4**, **G11**, **G13**, **G14**, **G15**, **G16**.

## Deliverables (concrete files to land)

Each row's v1 surface is **vault-scoped**. Generalization to non-vault paths is v2.

| Deliverable | Path | v1 Content (vault-scoped) | Owner |
|---|---|---|---|
| Validate workflow | `.github/workflows/validate.yml` | Required check on every PR touching `vault/**`. Runs three jobs against changed vault files: vault frontmatter validator, vault edge resolver, vault contradicts surfacer. v2 generalizes the same scaffold to non-vault markdown. | Phase 1 author |
| Regen workflow | `.github/workflows/regen.yml` | Required check on every PR touching `vault/**`. Runs the deterministic Bayesian status-promotion checker: validates that any `status` field change in the PR satisfies the entry criteria from `vault/confidence-levels.md`. Phase 2 expands this with compiled-tree regenerators. | Phase 1 author |
| Verifier workflow | `.github/workflows/verifier.yml` | Calls the deterministic `domainspec-verifier` agent on vault bot-PRs (the `domainspec-bot` author check). Phase 4 wires the actual bot-PRs; Phase 1 ships the workflow with the trigger and a no-op for non-bot PRs so the gate exists from day 1. | Phase 1 author |
| Deploy workflow (stub) | `.github/workflows/deploy.yml` | Stub for v3 runtime-reconciler. Currently no-op. Documented as a placeholder so the four-workflow split is self-documenting. | Phase 1 author |
| Vault frontmatter validator | `tools/validate-vault-frontmatter.ts` | TS script that loads the schema declared in `vault/ontology-conventions.md` (Required Frontmatter section + Appendix B Label Value Catalog) and validates every changed `vault/**/*.md` file. Single source of truth, invoked by `validate.yml`. | Phase 1 author |
| Vault edge resolver | `tools/validate-domainspec-vault-edges.ts` | TS script that parses the `## Connections` table in every changed `vault/**/*.md` (strict markdown table parser per Appendix C format), fails if any link target does not exist on disk. | Phase 1 author |
| Vault contradicts surfacer | `tools/surface-vault-contradictions.ts` | TS script that scans all vault files for open `contradicts` edges and fails the PR if it would promote a `contradicts`-targeted node to `consolidated` or higher (Heuristic 6 enforcement). | Phase 1 author |
| Vault status-promotion checker | `tools/check-vault-status-promotion.ts` | TS script that diffs `status:` frontmatter changes in the PR against the entry criteria table in `vault/confidence-levels.md` and Appendix B's `status` Entry/Exit Criteria. | Phase 1 author |
| Hook installer | `tools/install-hooks.sh` | One-time `git config core.hooksPath .githooks` wrapper. Idempotent. | Phase 1 author |
| Pre-commit extension | `.githooks/pre-commit` (modified) | Adds local invocation of `tools/validate-vault-frontmatter.ts` and `tools/validate-domainspec-vault-edges.ts` for staged `vault/**` files (fast feedback before push). | `.githooks/` owner |
| Drift-correction commit | `ADLC-ALIGNMENT.md`, `TUNING-LOOP.md`, `vault/ontology-architecture-draft.md` | First commit of Phase 1, separate from workflow PR. See §Governance edits. | Canonical doc owners per `AUTHORITY-MAP.md` |
| Governance edit | `CONSTITUTION.md` | Extends rule `C12` to cover vault frontmatter violations as a binding merge-gate, including PRs touching `vault/constitution/`. See §Governance edits. | `CONSTITUTION.md` owner |

## Workflows

### `validate.yml`

- **Trigger:** `on: pull_request: { paths: ['vault/**'] }`. Required check.
- **Permissions:** `contents: read` (MUST never push to a branch).
- **Jobs:**
  - `frontmatter-validate` — invokes `tools/validate-vault-frontmatter.ts`. Loads the schema from `vault/ontology-conventions.md` (Required Frontmatter section), parses the YAML frontmatter of every changed `vault/**/*.md` file, fails the PR if any required field is missing or any value falls outside the catalog declared in Appendix B (`node_type`, `layer`, `nature`, `status`, `veracidade`, `convicção`). Emits violation list as PR review comment + commit status.
  - `edge-resolve` — invokes `tools/validate-domainspec-vault-edges.ts`. Parses the `## Connections` table in every changed vault file using a strict markdown table parser (the format is fixed in Appendix C). Resolves each edge target as a relative path from the source file; fails the PR if any target does not exist on disk. Emits broken-edge list as PR review comment + commit status.
  - `contradicts-surface` — invokes `tools/surface-vault-contradictions.ts`. Scans all vault files for open `contradicts` edges. If the PR contains a `status:` change that would promote a node to `consolidated` or `evergreen` while a `contradicts` edge still points to it, fails the PR. This is the CI enforcement of `vault/agent-navigation.md` Heuristic 6.
- **Outputs / side-effects:** PR review comments (violation tables) + commit statuses (one per job, for branch protection). Writes nothing back to the repo.
- **Authority constraints:** Does it edit human-owned files? **NO.** Read-only against the repo; produces only check verdicts and PR comments. Verified by `permissions: contents: read`.

### `regen.yml`

- **Trigger:** `on: pull_request: { paths: ['vault/**'] }`. Required check.
- **Permissions:** `contents: read`.
- **Jobs:**
  - `status-promote-check` — invokes `tools/check-vault-status-promotion.ts`. For every `status:` field change detected in the PR diff, validates that the documented entry criteria for the target level are satisfied. Entry criteria are sourced from `vault/confidence-levels.md` (the five-level state machine) and reinforced by Appendix B's `status` Entry/Exit Criteria table in `vault/ontology-conventions.md`. Examples of the rules enforced:
    - `draft → exploratory`: requires complete frontmatter + at least one outgoing edge in `## Connections`.
    - `exploratory → active`: requires no `contradicts` edge from any `evergreen` or `consolidated` node.
    - `active → consolidated`: requires `version >= 1.0`, no open `contradicts` edges on this node, and at least two incoming edges from lower-level documents.
    - `consolidated → evergreen`: requires explicit approval marker in PR body (out of Phase 1 scope to define exactly; reject by default).
- **Outputs / side-effects:** Violation list as PR review comment + commit status. Writes nothing.
- **Authority constraints:** Does it edit human-owned files? **NO.** Read-only.
- **Phase 2 expansion:** the compiled-tree regenerators (the actual "regen" surface that the filename suggests) land here in Phase 2. Phase 1 only ships the deterministic status-promotion checker — the predictive Bayesian agent itself is Phase 2 / Phase 4.

### `verifier.yml`

- **Trigger:** `on: pull_request: { paths: ['vault/**'] }` AND PR author equals `domainspec-bot` (gate condition). Required check on bot-PRs only.
- **Permissions:** `contents: read`, `pull-requests: write` (for review comments).
- **Jobs:**
  - `verify-bot-pr` — invokes the `domainspec-verifier` agent in deterministic mode against the bot-PR diff. PASS / FLAG / BLOCK verdict; FLAG annotates PR review, BLOCK fails the check. For non-bot-PR triggers, the job exits 0 immediately with a logged "skipped: not a bot-PR" message.
- **Outputs / side-effects:** PR review with verdict; commit status. No writes.
- **Authority constraints:** Does it edit human-owned files? **NO.** The verifier reads the PR diff and emits a verdict only.
- **Phase 4 dependency:** the bot-PRs themselves (`domainspec-bot` paired/regen-prefix pattern) land in Phase 4. Phase 1 ships the gate so Phase 4 has nothing to add to the workflow file when the bot ships.

### `deploy.yml` (stub)

- **Trigger:** `on: { workflow_run: { workflows: [validate, regen], types: [completed], branches: [main] } }`. Conditioned on both upstream workflows succeeding.
- **Permissions:** `contents: read`.
- **Jobs:**
  - `assert-upstream-passed` — single no-op job in Phase 1. Asserts the upstream workflows concluded with `success`. Echoes "v3 will land the runtime reconciler here."
- **Outputs / side-effects:** None in Phase 1.
- **Authority constraints:** Does it edit human-owned files? **NO.** Empty job.
- **Why ship a stub now:** the four-workflow split is the design (DISCOVERY Q6); shipping all four file paths in Phase 1 makes the split self-documenting and prevents a future PR from having to additionally justify creating the file.

## Governance edits required in Phase 1

These edits are **out-of-band of the workflow PR**. They land as the **first commit of Phase 1**, separate from the workflow PR.

### CONSTITUTION.md edit (vault-extension of merge-gate authority)

**Location:** `/Users/victorboscaro/domainspec/CONSTITUTION.md`, end of the rule catalog table at line 22 (after row `C11`). Add a new row `C12`. Append a corresponding entry to the "Derivation Chain" list (line 24 onwards).

**Preserve the existing C12 design** — the rule already-being-added in this Phase grants merge-gate authority on BLOCK verdicts. This Phase 1 spec **extends** the rule scope to vault frontmatter violations rather than rewriting it.

**Exact text to add (new row in the rule catalog, after `C11`):**

```
| C12 | The `domainspec-verifier` BLOCK verdict is a binding merge-gate on `main`. CI may enforce BLOCK as a required check whose failure prevents merge. FLAG remains advisory. This delegation extends to the vault's own constitutions and axioms — the CI may BLOCK on vault frontmatter violations even on PRs touching `vault/constitution/` or `vault/axiom/`. | A5 | `validate.yml`, `regen.yml`, and `verifier.yml` jobs as required status checks on PRs to `main` |
```

**Exact text to add to the "Derivation Chain" list (insert as item 7, after current item 6 at line 31):**

```
7. A5 -> C5, C12 -> verifier admission as required check + vault frontmatter as merge-gate (CI-enforced merge-gate on BLOCK, including PRs touching vault/constitution/ and vault/axiom/).
```

**Rationale to record in commit message (not the file):** Per DISCOVERY §2.4, promoting BLOCK from advisory verdict to merge-gate is a governance change. The vault-extension is an additional governance change: it grants CI authority to BLOCK PRs whose target is itself a constitution-class document. Without the extension, a PR that breaks `vault/constitution/event-system-constitution.md`'s frontmatter would slip past the merge gate because the target file is "constitutional." A5 already authorizes blocking on critical/high violations; the extension binds vault frontmatter violations to that same axiom.

### Drift-correction first commit

**Four exact edits.** Each verified against current file contents on 2026-05-02. The first three reproduce the original drift-correction (G4 row + TUNING-LOOP.md:73 + TUNING-LOOP.md:426); the fourth is the additive vault edit.

#### Edit 1 — `ADLC-ALIGNMENT.md`, G4 row (currently line 78)

**Current text (line 78):**

```
| G4  | **Automated governance**           | Value 4 — Automated governance over manual management         | `domainspec-tuning.yml` auto-analyzes signals on push to main, creates issues when thresholds met (v1.8). Full audit CI still pending                         | Continuous automated governance: audits run on every commit, drift alerts auto-created, compliance dashboards                                             |
```

**Replacement text:**

```
| G4  | **Automated governance**           | Value 4 — Automated governance over manual management         | NOT YET DEPLOYED — `.github/workflows/` is empty as of 2026-05-02. Wiring scheduled in Phase 1 of `docs/features/gitops-assessment/specs/phase-1-ci-substrate.md` (vault-first pilot). Full audit CI still pending                         | Continuous automated governance: audits run on every commit, drift alerts auto-created, compliance dashboards                                             |
```

#### Edit 2 — `TUNING-LOOP.md:73`

**Current text (line 73):**

```
| **Tuning Workflow**  | `.github/workflows/domainspec-tuning.yml` | Runs analyzer on signal commits, creates Issues                 | GitHub Action     |
```

**Replacement text:**

```
| **Tuning Workflow**  | `.github/workflows/domainspec-tuning.yml` *(NOT YET DEPLOYED — Phase 1 of gitops-assessment lands `validate.yml`/`regen.yml`/`verifier.yml`/`deploy.yml` first; tuning workflow returns later)* | Runs analyzer on signal commits, creates Issues                 | GitHub Action     |
```

#### Edit 3 — `TUNING-LOOP.md:426`

**Current text (line 426):**

```
2. Workflow deployed: `.github/workflows/domainspec-tuning.yml` ✅
```

**Replacement text:**

```
2. Workflow deployed: `.github/workflows/domainspec-tuning.yml` ❌ (NOT YET DEPLOYED — Phase 1 of `docs/features/gitops-assessment/` lands the four vault-first workflows first)
```

#### Edit 4 — `vault/ontology-architecture-draft.md` (additive)

The file is currently `status: active` (frontmatter line 5, verified 2026-05-02). It claims the "Agents" section describes deployed behavior, but the agent system this Phase 1 wires up is the *implementation* of that claim. **Do not change the `status` field** — the architectural document is genuinely active as a design. Instead, add a `## Implementation Status` section near the top (after the `## Objective` section) with the following exact text:

```
## Implementation Status

> The agent framework described below is being implemented now. Phase 1 of the gitops-assessment feature (`docs/features/gitops-assessment/specs/phase-1-ci-substrate.md`) wires the first CI substrate that enforces this architecture against the vault itself. Until Phase 1 lands, the `## The Agents & Their Roles` section describes the *intended* behavior of the agents under `copilot/agents/`, not their *enforced* behavior.
```

This is additive and does not modify any existing prose, frontmatter, or claims. The `status: active` label is preserved because the architectural claim itself is active even though enforcement is pending.

#### Note on `INFRA-SETUP.md:484`

DISCOVERY §1 also flags `INFRA-SETUP.md:484` (`git push main  # CI/CD deploys automatically`). **Not in the Phase 1 drift-correction commit** — that line becomes true in v3 when the runtime reconciler ships.

## Acceptance criteria

Each criterion is independently checkable from the repo root after Phase 1 ships. All criteria are **vault-scoped**.

1. **Workflow files exist.** `ls .github/workflows/` returns exactly: `validate.yml`, `regen.yml`, `verifier.yml`, `deploy.yml`. No other files.
2. **Workflows parse.** `for f in .github/workflows/*.yml; do gh workflow view "$f" --yaml >/dev/null; done` exits 0.
3. **`validate.yml` blocks on missing required frontmatter.** A PR adding a new `vault/**/*.md` file with one of the required fields (e.g., `node_type`) missing fails CI. The failing job emits the named error `VAULT_FRONTMATTER_INVALID` (visible in job log and PR review comment).
4. **`validate.yml` blocks on broken edges.** A PR with a `## Connections` table row whose target file does not exist fails CI with named error `VAULT_EDGE_BROKEN`.
5. **`validate.yml` blocks on illegal promotion past contradicts.** A PR promoting a vault file's `status` from `active` to `consolidated` while at least one `contradicts` edge points to it fails CI with named error `VAULT_CONTRADICTION_OPEN`.
6. **`regen.yml` blocks on unmet promotion criteria.** A PR promoting a vault file's `status` to a higher level without satisfying the entry criteria from `vault/confidence-levels.md` fails CI with named error `VAULT_PROMOTION_CRITERIA_UNMET`.
7. **`validate.yml` is read-only.** `grep -A2 '^permissions:' .github/workflows/validate.yml` shows `contents: read` and no `write` scopes. Verified additionally by `gh api repos/{owner}/{repo}/actions/runs/<run-id>` showing zero pushed commits authored by `github-actions[bot]` against any branch from this workflow.
8. **End-to-end vault gate exercise.** After Phase 1, manually editing a vault file with invalid frontmatter (e.g., `status: bogus`) and pushing a PR triggers exactly one of the named errors `VAULT_FRONTMATTER_INVALID`, `VAULT_EDGE_BROKEN`, `VAULT_CONTRADICTION_OPEN`, `VAULT_PROMOTION_CRITERIA_UNMET` as a failing required check. The PR cannot be merged until corrected.
9. **Required checks registered.** `gh api repos/{owner}/{repo}/branches/main/protection/required_status_checks/contexts` returns a list containing the four job names (`frontmatter-validate`, `edge-resolve`, `contradicts-surface`, `status-promote-check`).
10. **Drift-correction commit landed first.** `git log --oneline -- ADLC-ALIGNMENT.md TUNING-LOOP.md vault/ontology-architecture-draft.md` shows a commit (subject containing `drift-correction` or equivalent) **earlier** than any commit touching `.github/workflows/`. `git show` of that commit modifies exactly the four edits named in §Governance edits, no others.
11. **Constitution edit landed and extends to vault.** `grep -n '^| C12 |' CONSTITUTION.md` returns one match, and that line contains the substring `vault/constitution/`. `grep -n '^7\. A5 -> C5, C12' CONSTITUTION.md` returns one match.
12. **Vault architecture doc carries Implementation Status note.** `grep -n '^## Implementation Status' vault/ontology-architecture-draft.md` returns exactly one match. The frontmatter `status:` field still reads `active` (unchanged).
13. **No human-owned vault file is auto-edited.** `git log --author='github-actions' --oneline -- 'vault/**'` returns zero commits. Bot PRs are allowed (Phase 4); bot direct commits to `vault/**` are not.

## Out of scope (Phase 1 boundary)

Phase 1 explicitly defers the following.

- **The compiled tree itself** (`generated/`, `docs/.compiled/manifest.json`, `@source-hash` annotations on derived vault docs). → **Phase 2.**
- **The Bayesian agent's predictive logic.** Only the deterministic status-promotion checker ships in Phase 1. The predictive component lands in Phase 2 / Phase 4.
- **LLM bot-PRs (`domainspec-bot`, paired/regen-prefix bot-PR pattern, obligation diff PR comments, semantic-hash idempotency).** → **Phase 4.** Phase 1 only ships the `verifier.yml` gate that is conditioned on `domainspec-bot` authorship.
- **Generalization to non-vault markdown.** The same workflow scaffolds get extracted into a reusable composite action that runs against `docs/**` and other paths in **v2 of this feature**.
- **Runtime reconciliation** (VPS reconciler, systemd timer, `git pull` loop, `docker compose up -d`, Pulumi project). → **v3.** `deploy.yml` ships in Phase 1 as a stub only.
- **`INFRA-SETUP.md:484` correction.** Stays false until v3.
- **Tuning workflow** (`domainspec-tuning.yml`, signal aggregation, `META-HEALTH.md` regeneration). The original Phase 1 included this; the vault-pilot pivot reschedules it. The drift-correction edits in `TUNING-LOOP.md` reflect this — the file remains `NOT YET DEPLOYED` until a later phase brings it back.
- **Overlay-sync** (`copilot/` ↔ `.github/` drift detection). Reframed as a non-vault concern; lands in v2 alongside non-vault generalization.
- **SOPS+age secret encryption.** No bot-PR-opening workflow runs in Phase 1 (the `verifier.yml` gate is read-only), so no `GH_PAT_AGENT` is needed yet. SOPS lands when Phase 4 needs it.

## Open items

Each carries a recommendation. None block Phase 1; all are flagged for the Phase 1 author to decide before opening the workflow PR.

### 1. Should the frontmatter validator be a TS script in `tools/` or a GitHub Action JS bundle?

**Recommendation: TS script in `tools/`, invoked by the workflow.** Single source of truth. The same script can be invoked locally from `.githooks/pre-commit` for fast feedback before push. A bundled Action would force two implementations and create drift between local and CI behavior. Keep the script in `tools/validate-vault-frontmatter.ts`; the workflow calls `npx tsx tools/validate-vault-frontmatter.ts <changed-files>`.

### 2. Should `## Connections` use a strict markdown table parser or a tolerant regex?

**Recommendation: strict.** The format is fixed in `vault/ontology-conventions.md` Appendix C: a three-column markdown table with header row `| Document | Type | Description |`. A tolerant regex would silently accept malformed tables and let edge violations slip through. Strict parsing fails fast on format drift, which is exactly what GitOps wants. Implementation: use a markdown AST parser (e.g., `remark`) and assert the table shape.

### 3. Where do violation comments get posted — PR review or commit status?

**Recommendation: both.** PR review for visibility (humans see the violation table inline on the PR), commit status for branch protection (the merge gate is a status check). The asymmetry: review comments are noisy but informative; statuses are quiet but enforceable. Posting to both gives developers context and gives `main` its protection in one pass.

### 4. Does the deterministic status-promotion checker need to reject `consolidated → evergreen` PRs by default?

**Recommendation: yes.** The entry criterion for `evergreen` in `vault/confidence-levels.md` is "approved by formal review, no known contradictions, tested against multiple real scenarios" — none of which the CI can verify deterministically. Reject by default; require an explicit `evergreen-promotion-approved` PR label (added by a maintainer) to bypass. Phase 4 may add an LLM-judged path; Phase 1 stays deterministic.

### 5. Should `verifier.yml` exit-0 on non-bot-PRs, or skip via job-level `if:`?

**Recommendation: job-level `if: github.event.pull_request.user.login == 'domainspec-bot'`.** Cleaner than an in-job exit, and the GitHub UI shows "skipped" rather than "succeeded" for clarity. This means non-bot-PRs do not see `verifier` as a required check at all — only bot-PRs do. Branch protection for `main` lists `verifier` as a check that **must succeed if it runs**, not as one that must always run.

### 6. Is the extended `C12` rule statement worded strongly enough for vault-constitution PRs?

**Recommendation: yes, but the Phase 1 author should run the exact wording past the `CONSTITUTION.md` canonical owner before commit.** The proposed text uses `MAY enforce` (matching DISCOVERY §2.4 verbatim) and adds "extends to the vault's own constitutions and axioms." A weaker form would let PRs touching `vault/constitution/` skip the gate; a stronger `MUST` form would make removing the check a constitutional violation. The `MAY` form is recommended; the canonical owner has final say.

---

## Cross-references

- Parent discovery: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/DISCOVERY.md` (rewriting in parallel)
- Vault schema source of truth: `/Users/victorboscaro/domainspec/vault/ontology-conventions.md` (v1.4.0, `consolidated`) — Required Frontmatter section, Appendix B Label Value Catalog, Appendix C Edge Type Catalog
- Vault traversal heuristics: `/Users/victorboscaro/domainspec/vault/agent-navigation.md` (Heuristics 1–9, especially Heuristic 6 for contradicts enforcement)
- Vault maturity state machine: `/Users/victorboscaro/domainspec/vault/confidence-levels.md` (five-level entry/exit criteria)
- Drift-correction targets verified at: `/Users/victorboscaro/domainspec/ADLC-ALIGNMENT.md` line 78, `/Users/victorboscaro/domainspec/TUNING-LOOP.md` lines 73 and 426, `/Users/victorboscaro/domainspec/vault/ontology-architecture-draft.md` (frontmatter line 5, all verified 2026-05-02)
- Constitution edit target: `/Users/victorboscaro/domainspec/CONSTITUTION.md` (37 lines as of 2026-05-02; insertion after line 22 and line 31)
- Sample vault frontmatter inspected: `/Users/victorboscaro/domainspec/vault/axiom/system-axioms.md`, `/Users/victorboscaro/domainspec/vault/constitution/event-system-constitution.md`, `/Users/victorboscaro/domainspec/vault/premise/system-premises.md`
- ADLC gaps closed (structural part): G4, G11, G13, G14, G15, G16
