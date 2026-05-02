---
tags: [gitops, intent-compiled-split, phase-2, governance, regeneration]
node_type: spec
layer: governance, infrastructure
status: draft
veracidade: high
conviccao: high
version: 0.1.0
last_updated: 2026-05-02
parent_discovery: ../DISCOVERY.md
depends_on: [phase-1-ci-substrate.md]
---

# Phase 2 — Intent vs. Compiled-Artifact Discipline

## Scope

Per [DISCOVERY §9 Phase 2](../DISCOVERY.md#9-phased-delivery): "Introduce `generated/` tree and `docs/.compiled/manifest.json` with `(source_hash, prompt_hash, model_version)` per artifact. Mark every existing derived file with `@source-hash`. Add `tools/check-overlay-sync.sh` for the `copilot/` ↔ `.github/` boundary. Adopt SOPS+age. Ship `docs/signals/pipeline-signals.jsonl` emission via the `domainspec-emit-signals` skill. Closes **G7**, **G10**." This spec covers the *intent-vs-compiled enforcement surface only* — the topology change (§3), the deterministic regen wiring it depends on (§5, already specified by phase-1), the §10 Q5 sunset of grandfathered `_categorical/`, and the staleness CI gate. SOPS adoption and signal-stream emission are tracked by sibling specs (`phase-2-sops-secrets.md`, `phase-2-signal-emission.md`) and are explicitly out of scope here. The `copilot/` ↔ `.github/` overlay validator is handled by `phase-1-ci-substrate.md` per Q3 routing it to Phase 1 CI; it is referenced here only because `.github/gsd-file-manifest.json` is enrolled in the same compiled-tree manifest format.

## The compiled tree

### Path decision

Per [DISCOVERY §3](../DISCOVERY.md#3-repo-topology-change), there are **two derived locations** introduced by Phase 2 and they live at *different roots* by deliberate design:

> "**New on disk:** `generated/` — sole location for derived artifacts. Subdivided by source feature: `generated/features/<feature>/{tests,observability,infra-deltas,registry}/`. Every file under `generated/` carries a `# @source-hash: <sha256-of-source-spec>` header (or equivalent for non-text artifacts). `docs/.compiled/manifest.json` — the dbt-style manifest mapping every file in `generated/` (and the existing `_categorical/` buckets) to `(source_path, source_hash, prompt_hash, model_version, generated_at)`."

And the rationale for splitting them:

> "Two derived subtrees live under `docs/` alongside hand-authored content: `docs/.compiled/` (the manifest) and `docs/signals/` (the append-only signal stream + tuning report). They are kept under `docs/` rather than `generated/` because (a) `docs/.compiled/manifest.json` is the *index of* `generated/` and belongs adjacent to the intent it indexes."

So:

- `/generated/` — top-level directory, holds the actual derived artifacts (TypeScript, JSON, test specs, infra-deltas).
- `/docs/.compiled/manifest.json` — single index file, lives next to the intent it indexes. The dotfile prefix marks it visually as derived.

### What moves there (exhaustive)

Mapped against the actual repo state (verified via `find /Users/victorboscaro/domainspec/docs/features -type f` and `ls docs/features/payment-processing/_categorical/`):

| Existing location | Moves to | Reason |
|---|---|---|
| `docs/features/payment-processing/_categorical/L1.json` | `generated/features/payment-processing/categorical/L1.json` | grandfathered `_categorical/` retired per Q5 sunset (see below) |
| `docs/features/payment-processing/_categorical/L2.json` | `generated/features/payment-processing/categorical/L2.json` | same |
| `docs/features/payment-processing/_categorical/delta.json` | `generated/features/payment-processing/categorical/delta.json` | same |
| `docs/features/payment-processing/_categorical/extraction.log.md` | `generated/features/payment-processing/categorical/extraction.log.md` | same — extraction log is itself derived output of the extractor |
| (future) `<feature>/observability.md`-derived OTel scaffolds | `generated/features/<feature>/observability/` | new bucket per §3 |
| (future) `<feature>/test-spec` outputs from `domainspec-test-designer` | `generated/features/<feature>/tests/` | new bucket per §3 |
| (future) `<feature>/infra-deltas` from `domainspec-infra-architect` | `generated/features/<feature>/infra-deltas/` | new bucket per §3 |
| (future) per-feature `registry/` extracts from `domainspec-registry-sync` | `generated/features/<feature>/registry/` | new bucket per §3 |
| `.github/agents/`, `.github/skills/`, `.github/get-shit-done/`, `.github/gsd-file-manifest.json` | **stays in place** but enrolled in `docs/.compiled/manifest.json` | per §3 final paragraph: "stays where it is for tooling-compatibility reasons but gains a `tools/check-overlay-sync.sh` validator" |

There is exactly one feature with derived artifacts on disk today (`payment-processing`). The other feature folder, `docs/features/domainspec-gsd-integration/`, has no `_categorical/` subdir and no derived files — so nothing to migrate from it.

### What does NOT move

Per [DISCOVERY §3](../DISCOVERY.md#3-repo-topology-change) "Stays in `docs/`":

- All hand-authored intent files: `docs/features/<feature>/{SPEC,domain,operations,states,interfaces,events,queries,workflows,mappings,decisions,tasks}.md`
- `docs/registry.md` (hand-authored index)
- `docs/glossary.md`
- `docs/shared/**`
- `docs/research/**`
- `docs/templates/**`
- `docs/CHANGELOG.md` and root-level governance docs (`AUTHORITY-MAP.md`, `AXIOMS.md`, `CONSTITUTION.md`, `TAXONOMY.md`, `RELATIONSHIPS.md`, `ARCHITECTURE.md`, `OBSERVABILITY.md`, `TEST-PIPELINE.md`, `DRIFT-CONVERGENCE.md`, `GOVERNANCE-ATTENUATION.md`, `TUNING-LOOP.md`, `ADLC-ALIGNMENT.md`, `PHASED-PLAN.md`, `README.md`, `INFRA-SETUP.md`)

These are intent. They are the inputs the regenerators consume.

## Migration table

The only artifacts that exist on disk today and are subject to physical relocation in Phase 2:

| Artifact today | Path today | New path under compiled tree | Regenerator | Owner agent/script |
|---|---|---|---|---|
| Categorical L₁ extraction | `docs/features/payment-processing/_categorical/L1.json` | `generated/features/payment-processing/categorical/L1.json` | `tools/extract-categorical.ts` *(to be created in Phase 2 — closes the missing-regenerator gap from [DISCOVERY §1, "_categorical has no regenerator"](../DISCOVERY.md#whats-broken))* | `domainspec-l2-extractor` (named in `extraction.log.md`) |
| Categorical L₂ extraction | `docs/features/payment-processing/_categorical/L2.json` | `generated/features/payment-processing/categorical/L2.json` | `tools/extract-categorical.ts` (same script, `--layer=L2`) | `domainspec-l2-extractor` |
| Categorical delta map | `docs/features/payment-processing/_categorical/delta.json` | `generated/features/payment-processing/categorical/delta.json` | `tools/extract-categorical.ts` (same script, `--mode=delta`) | `domainspec-l2-extractor` |
| Extraction log | `docs/features/payment-processing/_categorical/extraction.log.md` | `generated/features/payment-processing/categorical/extraction.log.md` | `tools/extract-categorical.ts` (emitted as side-output) | `domainspec-l2-extractor` |
| Overlay manifest | `.github/gsd-file-manifest.json` | **stays in place**, enrolled in `docs/.compiled/manifest.json` as a derived entry pointing to source `copilot/` | `copilot/install.sh` (already exists) + `tools/check-overlay-sync.sh` (Phase 1) | `copilot/install.sh` |

No other derived artifacts exist on disk in this repo today. The `generated/features/<feature>/{tests,observability,infra-deltas,registry}/` subtrees are *created empty* in Phase 2 with `.gitkeep` markers; they fill up as the regen-eligible LLM-judgment agents (see [DISCOVERY §6](../DISCOVERY.md#6-bot-pr-pipeline-domainspec-bot)) run in Phase 4.

## Deterministic regen pipeline

The five deterministic agents and nine validators were wired into CI by Phase 1 ([DISCOVERY §5](../DISCOVERY.md#5-deterministic-regen-pipeline)). Phase 2's contribution is to bind each one's *output path* into the compiled-tree convention so the staleness gate can find it.

**Note on count.** The discovery names "five deterministic agents" and "nine `tools/` validators". The actual `tools/` directory contains nine validator/generator scripts that map to those nine roles, but the on-disk filenames differ slightly (e.g., `tools/generate-registry.ts` performs the role attributed to the `domainspec-registry-sync` agent's drift-check; `tools/check_docs_sync.sh` is invoked by the overlay-sync workflow). The matrix below uses the on-disk filenames verified by `ls /Users/victorboscaro/domainspec/tools/`.

| Agent / validator | Trigger | Inputs (intent files) | Outputs (compiled-tree files) | Staleness check command | Failure mode |
|---|---|---|---|---|---|
| `domainspec-alignment-auditor` | PR opened/updated (per [DISCOVERY §5 row 2](../DISCOVERY.md#5-deterministic-regen-pipeline)) | `docs/features/<feature>/{SPEC,operations,states}.md` + `implementation/**` | `generated/features/<feature>/alignment/ALIGNMENT-REPORT.md` | `tools/run-alignment-auditor.sh && git diff --exit-code generated/features/*/alignment/` | block PR |
| `domainspec-layering-auditor` | PR opened/updated | `docs/features/<feature>/{domain,interfaces}.md` + `docs/glossary.md` | `generated/features/<feature>/layering/LAYERING-REPORT.md` | `tools/run-layering-auditor.sh && git diff --exit-code generated/features/*/layering/` | block PR |
| `domainspec-otel-verifier` | PR opened/updated when `**/observability.md` or `src/**` changes | `docs/features/<feature>/observability.md` + `src/**` | `generated/features/<feature>/observability/OBSERVABILITY-REPORT.md` | `tools/run-otel-verifier.sh && git diff --exit-code generated/features/*/observability/` | block PR |
| `domainspec-registry-sync` (drift mode) | PR opened/updated, drift check only | `docs/features/<feature>/SPEC.md` concept tables | `generated/features/<feature>/registry/registry-snapshot.json` | `tools/generate-registry.ts --check && git diff --exit-code generated/features/*/registry/` | block PR (write-mode is Phase 4 bot-PR) |
| `domainspec-verifier` | PR opened/updated | union of all `generated/features/<feature>/*` + `docs/features/<feature>/SPEC.md` | `generated/features/<feature>/verification/VERIFIER-REPORT.md` | `tools/run-verifier.sh && git diff --exit-code generated/features/*/verification/` | BLOCK fails required check; FLAG annotates |
| `tools/analyze-signals.ts` | scheduled (every 6h) + on push to `main` | `docs/signals/pipeline-signals.jsonl` | `docs/signals/TUNING-REPORT.md` (regenerated by `domainspec-reflect`) | `tools/analyze-signals.ts --check` | non-blocking; threshold breach opens proposal Issue |
| `tools/validate-signals.ts` | PR | `docs/signals/pipeline-signals.jsonl` | exit code only (no compiled artifact) | `tools/validate-signals.ts` | malformed signal blocks merge |
| `tools/validate-orphans.ts` | PR | `docs/glossary.md` + all `docs/features/<feature>/*.md` | exit code only | `tools/validate-orphans.ts` | orphan concept blocks merge |
| `tools/validate-doc-links.ts` | PR + pre-commit | all `docs/**/*.md` | exit code only | `tools/validate-doc-links.ts` | broken link blocks merge |
| `tools/validate-governance-chain.ts` | PR | `AUTHORITY-MAP.md`, `GOVERNANCE-ATTENUATION.md`, `docs/features/<feature>/SPEC.md` | exit code only | `tools/validate-governance-chain.ts` | broken L4→L3→L6 chain blocks merge (closes G16) |
| `tools/validate-tuning-report.ts` | PR when `docs/signals/TUNING-REPORT.md` changes | `docs/signals/TUNING-REPORT.md` | exit code only | `tools/validate-tuning-report.ts` | malformed report blocks merge |
| `tools/detect-signals.ts` | scheduled | `docs/**/*.md` + `tools/**` | appends to `docs/signals/pipeline-signals.jsonl` | `tools/detect-signals.ts --dry-run` | non-blocking |
| `tools/generate-meta-health.ts` | scheduled | full repo | `docs/META-HEALTH.md` (regenerated; closes G15) | `tools/generate-meta-health.ts --check && git diff --exit-code docs/META-HEALTH.md` | non-blocking on schedule; blocks PR if changed in PR diff |
| `tools/prune-governance.ts` | scheduled (weekly) | `docs/signals/pipeline-signals.jsonl` (rotation) + `docs/governance/**` (pruning) | rotated `pipeline-signals.<YYYY-MM>.jsonl` archives + governance edits | `tools/prune-governance.ts --check` | opens cleanup PR if pruning is non-trivial |
| `tools/extract-categorical.ts` *(new in Phase 2)* | PR when `docs/features/<feature>/{domain,interfaces,states,events}.md` changes | feature aspect docs | `generated/features/<feature>/categorical/{L1,L2,delta}.json` + `extraction.log.md` | `tools/extract-categorical.ts --check && git diff --exit-code generated/features/*/categorical/` | block PR |

The `tools/build-telemetry-bundle.ts`, `tools/run-async-observer.ts`, `tools/run-fast-observer.ts`, `tools/check_docs_sync.sh`, `tools/check_initiative_stale.sh`, and `tools/context-search-heuristic.test.mjs` scripts that also exist in the repo are not part of the deterministic regen pipeline — they are operational tooling and test fixtures.

## Sunset of grandfathered `_categorical/`

Per [DISCOVERY §10 Q5](../DISCOVERY.md#q5-where-should-generated-live--top-level-or-per-feature-_categorical-style):

> "**Sunset trigger:** migrate `docs/features/payment-processing/_categorical/` to `generated/features/payment-processing/categorical/` once the missing regenerator script lands in `tools/` (Phase 2 scope per §9). After migration the `_categorical/` convention is retired."

**Trigger event (in this spec):** the merge to `main` of the PR that adds `tools/extract-categorical.ts` and registers it in `pr-validate.yml`. That PR's diff MUST also:

1. `git mv docs/features/payment-processing/_categorical/ generated/features/payment-processing/categorical/`
2. Add `(source_path, source_hash, prompt_hash, model_version, generated_at)` entries for the four moved files to `docs/.compiled/manifest.json`
3. Inject the GENERATED-by header (see Authority guarantees) into `L1.json`, `L2.json`, `delta.json` (as a JSON `"$generated"` top-level key, since JSON has no comments) and into `extraction.log.md` (as a markdown HTML comment).
4. Update any cross-references in `docs/features/payment-processing/SPEC.md`, `docs/registry.md`, and the `extraction.log.md` itself.
5. Add a `tools/migrate-categorical-paths.sh` one-shot script (committed and then the script entry removed in a follow-up commit) that performs the rename idempotently and is invoked by the same PR's CI to verify the move.

**Post-sunset invariant:** the `_categorical/` substring MUST NOT appear under any `docs/features/<feature>/` path. A new validator entry in `tools/validate-doc-links.ts` (or a sibling `tools/validate-no-grandfathered-paths.ts`) enforces this with exit-1 if any `docs/features/**/_categorical/` path is found. After sunset, only `generated/features/<feature>/categorical/` is allowed.

## Staleness CI gate

A new workflow `.github/workflows/compiled-tree-staleness.yml` (or an additional job in the existing `pr-validate.yml` from `phase-1-ci-substrate.md`) re-runs all deterministic regenerators on every PR that touches `docs/`, then asserts the compiled tree has not drifted.

```yaml
# .github/workflows/compiled-tree-staleness.yml
name: compiled-tree-staleness
on:
  pull_request:
    paths:
      - 'docs/**'
      - 'copilot/**'
      - 'prompts/**'
      - 'tools/**'

jobs:
  staleness:
    runs-on: ubuntu-latest
    permissions:
      contents: read         # MUST be read-only — see Authority guarantees
      pull-requests: write   # for the obligation-diff comment only
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          # MUST NOT set token to a write-scoped PAT for the PR branch
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci

      # Re-run every deterministic regenerator into a clean working tree.
      - name: regen categorical
        run: tools/extract-categorical.ts --all-features
      - name: regen alignment reports
        run: tools/run-alignment-auditor.sh --all-features
      - name: regen layering reports
        run: tools/run-layering-auditor.sh --all-features
      - name: regen otel reports
        run: tools/run-otel-verifier.sh --all-features
      - name: regen registry snapshots
        run: tools/generate-registry.ts --all-features
      - name: regen verifier reports
        run: tools/run-verifier.sh --all-features
      - name: regen meta-health
        run: tools/generate-meta-health.ts
      - name: rebuild manifest
        run: tools/build-compiled-manifest.ts   # writes docs/.compiled/manifest.json

      # The gate. Any drift is a staleness error.
      - name: assert compiled tree is up-to-date
        run: |
          set -e
          if ! git diff --exit-code -- generated/ docs/.compiled/manifest.json docs/META-HEALTH.md; then
            echo "::error::COMPILED_TREE_STALE: intent files in this PR changed but generated/ was not regenerated. Run 'make regen' locally and commit the result."
            exit 1
          fi

      # NEVER push. The job's only side effect is the diff check above.
```

The named error string `COMPILED_TREE_STALE` is the contractually stable failure tag — agents, dashboards, and the `domainspec-reflect` skill match on it.

## Authority guarantees

### Never push to the human's branch

The staleness regen job above runs with `permissions: contents: read`. It MUST NOT have a write-scoped token for the PR branch. The acceptable write surface is `pull-requests: write` for posting the obligation-diff comment (Atlantis-style; see [DISCOVERY §6](../DISCOVERY.md#6-bot-pr-pipeline-domainspec-bot)). Direct write-back to the PR branch is the *Phase 4 bot-PR pattern* (paired branch with `[regen]` prefix per [DISCOVERY §10 Q9](../DISCOVERY.md#q9-should-the-regen-bot-in-phase-4-push-to-the-same-branch-atlantis-style-or-open-a-paired-pr-renovate-style)) and is explicitly out of scope for Phase 2. Phase 2's contract: detect drift, fail the check, leave the branch untouched, let the human regen locally.

### GENERATED-by header

Every file under `generated/` MUST carry a header identifying the regenerator and the source intent file. Format depends on the file's syntax:

- **Markdown / shell / TypeScript:** first line `# GENERATED by <regenerator-script-or-agent> from <intent-path>. DO NOT EDIT. @source-hash: <sha256>`
- **JSON:** top-level key `"$generated": { "by": "<regenerator>", "from": "<intent-path>", "source_hash": "<sha256>", "prompt_hash": "<sha256>", "model_version": "<id>", "generated_at": "<iso8601>" }` (since JSON does not support comments)
- **YAML:** first comment line `# GENERATED by <regenerator> from <intent-path>. DO NOT EDIT.` followed by structured `_generated:` mapping for machine consumption
- **Binary / non-text:** sidecar `<file>.gen.json` with the same fields

### Header injector

`tools/inject-generated-header.ts` is a Phase 2 deliverable. Contract:

- Input: a path under `generated/`, the source intent path, the regenerator name.
- Output: writes the header in the syntactically correct form for the target file's extension. Idempotent — running twice does not stack two headers.
- Used as a post-processing step inside every regenerator script listed in the table above. The regenerators MUST NOT inline the header logic — they MUST shell out to `inject-generated-header.ts` so the format is consistent across all 14 generators.
- A companion `tools/validate-generated-headers.ts` runs in `pr-validate.yml` and asserts every file under `generated/` has a valid header. Missing or malformed header blocks merge.

## Acceptance criteria

Each criterion is objectively checkable by a single command or commit observation.

1. **CT-1 (compiled tree exists).** After Phase 2 ships, `test -d /Users/victorboscaro/domainspec/generated/features/payment-processing/categorical` returns exit 0 AND `test -f /Users/victorboscaro/domainspec/docs/.compiled/manifest.json` returns exit 0.

2. **CT-2 (sunset complete).** After Phase 2 ships, `test -d /Users/victorboscaro/domainspec/docs/features/payment-processing/_categorical` returns exit 1 (the directory is gone). `find docs/features -type d -name '_categorical'` returns no rows.

3. **CT-3 (staleness gate fails on intent edit without regen).** Editing `docs/features/payment-processing/SPEC.md` without re-running `tools/extract-categorical.ts` MUST cause the `compiled-tree-staleness` workflow to fail with a log line containing the literal string `COMPILED_TREE_STALE`.

4. **CT-4 (staleness gate passes on intent + regen pair).** Editing `docs/features/payment-processing/SPEC.md` AND running `make regen` locally AND committing the result MUST cause the `compiled-tree-staleness` workflow to pass.

5. **CT-5 (header on every generated file).** `tools/validate-generated-headers.ts` returns exit 0 against the post-migration tree. Removing the `# GENERATED by ...` line from any file under `generated/` causes it to return exit 1.

6. **CT-6 (manifest enrolls every generated file).** Every file under `generated/` AND `.github/gsd-file-manifest.json` AND `docs/META-HEALTH.md` AND `docs/signals/TUNING-REPORT.md` has a corresponding entry in `docs/.compiled/manifest.json` keyed by relative path. A `tools/validate-manifest-completeness.ts` script enforces this with exit 0 / exit 1.

7. **CT-7 (no write to PR branch from staleness job).** The `compiled-tree-staleness` workflow definition contains `permissions: contents: read` and does NOT contain `permissions: contents: write` or any `git push` step targeting the PR branch. Verifiable by `grep -E '(contents: write|git push)' .github/workflows/compiled-tree-staleness.yml` returning empty.

8. **CT-8 (sunset trigger is the regenerator-landing PR).** The git history shows a single PR whose merge commit (a) adds `tools/extract-categorical.ts`, (b) deletes `docs/features/payment-processing/_categorical/`, (c) creates `generated/features/payment-processing/categorical/` with the four migrated files, (d) adds their entries to `docs/.compiled/manifest.json`. `git log --diff-filter=D -- 'docs/features/payment-processing/_categorical/L1.json'` returns exactly one commit, and that commit also has `git show --diff-filter=A` entries for `tools/extract-categorical.ts` and `generated/features/payment-processing/categorical/L1.json`.

9. **CT-9 (grandfathered-path validator active).** A subsequent PR that re-introduces a file under any `docs/features/**/_categorical/` path is rejected by CI. Verifiable by adding `docs/features/test-feature/_categorical/probe.json` in a probe PR and observing required-check failure.

10. **CT-10 (all 14 deterministic regenerators are wired).** The `compiled-tree-staleness` workflow contains a step invoking each of the 14 entries in the deterministic regen table above (or an equivalent `make regen` target whose Makefile recipe enumerates all 14). Verifiable by `grep -c '^      - name: regen' .github/workflows/compiled-tree-staleness.yml` returning a number consistent with the count after collapsing batch-mode flags.

## Out of scope

Per [DISCOVERY §9](../DISCOVERY.md#9-phased-delivery), the following are explicitly **not** Phase 2:

- **Phase 3 — VPS reconciler & deploy.** The systemd timer + `git pull --ff-only` + `docker compose up -d` loop on the VPS, the Pulumi project for cloud resources, the `infra/{docker-compose.yml,prometheus.yml,Caddyfile,alerts/}` artifacts. Phase 2 produces compiled artifacts on disk but does not deploy them anywhere.
- **Phase 4 — `domainspec-bot` & spec-driven regen for LLM-judgment agents.** The bot-PR pattern, the obligation-diff PR comment, the semantic-hash idempotency layer, and the regen-eligible LLM-judgment agents (`domainspec-spec-writer`, `domainspec-implementer`, `domainspec-task-executor`, `domainspec-ui-architect`, `domainspec-infra-architect`) automatically regenerating on spec change. Phase 2 fails the build when intent and compiled drift; Phase 4 *fixes the drift on a paired bot branch*.
- **Sibling Phase 2 deliverables tracked elsewhere.** SOPS+age secret encryption (`phase-2-sops-secrets.md`), `docs/signals/pipeline-signals.jsonl` emission via the `domainspec-emit-signals` skill (`phase-2-signal-emission.md`), and the `copilot/` ↔ `.github/` overlay validator wiring (`phase-1-ci-substrate.md`). They are listed in [DISCOVERY §9 Phase 2](../DISCOVERY.md#9-phased-delivery) but split into focused specs to keep each spec ≤ 700 lines and reviewable on its own terms.
- **Behavioral equality testing for regenerated artifacts.** Per [DISCOVERY §10 Q4](../DISCOVERY.md#q4-what-is-the-same-invariant-for-llm-regenerated-artifacts), structural equality at the `generated/` tree is the Phase 2 invariant; behavioral equality (regen → run tests → compare pass-set) is a Phase 4 add-on and requires the test suite for regen-eligible agents to exist first.
- **Semantic-hash idempotency.** Phase 2 uses **byte equality** for the staleness gate (`git diff --exit-code`). The deterministic regenerators *are* byte-idempotent so this is sufficient. The semantic-hash layer is Phase 4 because it is only needed when LLM-judgment agents enter the regen path, and they do not until Phase 4 ([DISCOVERY §6](../DISCOVERY.md#6-bot-pr-pipeline-domainspec-bot)).

## Open items

1. **Where does `tools/extract-categorical.ts` get its prompt/extraction logic from?** The current `extraction.log.md` mentions `domainspec-l2-extractor` as the agent that produced the L₂ pass, but no agent file by that name exists in `copilot/agents/`. **Recommendation:** during the Phase 2 PR that lands the script, either (a) recover the extractor agent definition from git history if it was deleted, or (b) reverse-engineer the extraction rules from `extraction.log.md` and codify them as a deterministic walker over the feature aspect docs. Default to (b) since the log is sufficiently detailed and recovering an unknown-deleted agent risks resurrecting stale prompts.

2. **Should `docs/.compiled/manifest.json` be one file or one-per-feature?** The discovery says "single manifest" ([DISCOVERY §2.1](../DISCOVERY.md#21-intent-vs-compiled-artifact-split-enforced) and §3). For a 2-feature repo this is trivially fine. **Recommendation:** keep it single until the repo has ≥ 10 features OR the manifest exceeds 500 KB, at which point split per feature with a top-level index. Track the threshold via a signal emitted from `tools/build-compiled-manifest.ts`.

3. **JSON header format collision risk.** Using `"$generated"` as the top-level key on `L1.json` etc. assumes no consumer treats `$`-prefixed keys as data. **Recommendation:** verify against any current readers of `_categorical/L1.json` (none on disk today per `grep -r "_categorical/L1.json" /Users/victorboscaro/domainspec`) before locking the format. If a future consumer rejects `$`-keys, fall back to a sidecar `L1.gen.json` per the binary-file convention.

4. **`META-HEALTH.md` and `TUNING-REPORT.md` placement.** They are derived but live under `docs/` rather than `generated/`. The discovery permits this for `manifest.json` and `signals/` because they are co-located with the intent they index, but `META-HEALTH.md` is arguably general repo health and `TUNING-REPORT.md` is signal-derived. **Recommendation:** keep both under `docs/` for consistency with current `README.md` and `TUNING-LOOP.md` references; enroll them in the manifest with the GENERATED header. Cost of moving is a cross-doc edit; benefit of moving is unclear.

5. **Should the `compiled-tree-staleness` job be a separate workflow or a job in `pr-validate.yml`?** Phase 1 spec defines `pr-validate.yml`; adding a heavyweight regen job there couples its runtime to the staleness gate's runtime. **Recommendation:** keep them separate — `compiled-tree-staleness.yml` as a distinct required check. This matches [DISCOVERY §10 Q6](../DISCOVERY.md#q6-should-the-four-workflow-split-pr-validate-overlay-sync-tuning-deploy-collapse-into-one-composite-workflow) ("keep them split") and lets the staleness gate be selectively re-run after a `make regen` push without re-running the full PR validation suite.
