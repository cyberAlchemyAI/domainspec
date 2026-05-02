---
tags: [gitops, intent-compiled-split, phase-2, governance, regeneration, vault-pilot]
node_type: spec
layer: governance, infrastructure
status: draft
veracidade: high
conviccao: high
version: 0.2.0
last_updated: 2026-05-02
parent_discovery: ../DISCOVERY.md
depends_on: [phase-1-ci-substrate.md]
---

# Phase 2 — Intent vs. Compiled-Artifact Discipline (Vault Pilot)

## Scope

Phase 2 ships the first compiled tree at `vault/.compiled/`. Five deterministic regenerators feed it: the **edge-graph compiler**, the **contradicts surfacer**, the **status-promotion log writer**, the **`ontology_events` ledger writer** (file-based jsonl form of the SQL ledger from [`ontology-architecture-draft.md` §3 Event Sourcing](../../../../vault/ontology-architecture-draft.md)), and the **frontmatter index builder**. The CI staleness gate from Phase 1's `validate.yml` (per [`phase-1-ci-substrate.md`](./phase-1-ci-substrate.md)) is extended with a `regen` check that re-runs all five and asserts byte equality.

**The vault is the *only* compiled-tree target in v1.** This is a deliberate scope contraction from the discovery's broader `generated/features/<feature>/` proposal. Justification: the vault has 21 markdown files today (verified by `find /Users/victorboscaro/domainspec/vault -name '*.md' | wc -l`), a stable conventions document ([`ontology-conventions.md` v1.4.0](../../../../vault/ontology-conventions.md)), a fully-specified edge-type catalog ([Appendix C](../../../../vault/ontology-conventions.md#appendix-c-edge-type-catalog)), a 5-level confidence lifecycle with explicit entry/exit criteria ([`confidence-levels.md`](../../../../vault/confidence-levels.md)), and a documented ledger model that does not yet have a writer ([`ontology-architecture-draft.md` §3](../../../../vault/ontology-architecture-draft.md#3-event-sourcing)). Every derived artifact the vault's design *promises* but does not yet *materialize on disk* is the natural first target. The `payment-processing/_categorical/` migration (the previous v0.1 candidate) is **deferred to v2** — see Out of Scope below.

The sibling Phase 2 deliverables — SOPS+age secrets (`phase-2-sops-secrets.md`), signal-stream emission (`phase-2-signal-emission.md`), and the `copilot/` ↔ `.github/` overlay validator (handled by `phase-1-ci-substrate.md`) — remain out of scope here.

## The compiled tree (`vault/.compiled/`)

### Path decision

The compiled tree lives **inside the vault**, not at a top-level `generated/`. This resolves [DISCOVERY §10 Q5](../DISCOVERY.md#q5-where-should-generated-live--top-level-or-per-feature-_categorical-style) for the vault-pilot scope by choosing locality over global uniformity:

- The compiled artifacts are *only* meaningful as derivatives of the surrounding vault intent files. Putting them under `generated/vault/` would break the locality invariant the vault's own conventions imply (every `## Connections` row references a sibling path).
- Tooling that reads the vault (the planned Information Keeper, the Bayesian agent) already walks `vault/**`. Putting compiled artifacts inside that walk avoids a second root.
- The `.compiled/` dotfile prefix marks the subtree as derived/non-authored at a glance and keeps it out of common `find vault -name '*.md'` queries.

The v2 work that generalizes this framework to non-vault paths (e.g., `docs/features/<feature>/.compiled/` or a top-level `generated/`) is explicitly out of scope — see Out of Scope.

### Layout

```
vault/.compiled/
├── manifest.json              # what was generated, from what input, by what regenerator, with what hash
├── edges.json                 # deduplicated bidirectional edge graph
├── contradicts.json           # all open `contradicts` edges with both endpoints' status
├── status-log.jsonl           # append-only log of every status change with entry-criteria evaluation
├── ontology-events.jsonl      # the SQL ledger from ontology-architecture-draft.md §3, file-based for v1
├── frontmatter-index.json     # all 7 labels for every vault file, queryable
└── README.md                  # GENERATED. DO NOT EDIT.
```

### Per-file justification

| File | Why it exists | Source authority |
|---|---|---|
| `manifest.json` | dbt-style index mapping every artifact under `vault/.compiled/` to `(input_glob, input_hash, regenerator, regenerator_version, output_hash, generated_at, git_sha)`. Phase 4's idempotency cache will read `input_hash` to skip regen when inputs haven't changed; v1 just records it. | [DISCOVERY §3](../DISCOVERY.md#3-repo-topology-change) "dbt-style manifest" pattern, narrowed to vault scope. |
| `edges.json` | Materializes the deduplicated bidirectional edge graph that [`ontology-conventions.md` Appendix C](../../../../vault/ontology-conventions.md#appendix-c-edge-type-catalog) describes but never writes. The Markdown layer encourages bidirectional declarations (a child `derives-from` parent + parent `grounds` child); the visualization/query layer must dedupe per the Bidirectionality and Deduplication rule. `edges.json` *is* that deduplicated form. | [`ontology-conventions.md` §Edge Types — Directionality Principle](../../../../vault/ontology-conventions.md#directionality-principle). |
| `contradicts.json` | Surfaces every open `contradicts` edge — the most operationally important edge type per the conventions ("the most valuable edge type … flags inconsistencies that must be resolved before a document moves up a level"). Pairs each edge with both endpoints' `status` so the Bayesian's promotion check has the data without re-walking the vault. | [`ontology-conventions.md` Appendix C](../../../../vault/ontology-conventions.md#appendix-c-edge-type-catalog) — `contradicts` row. |
| `status-log.jsonl` | Append-only record of every status transition. Each line captures `{timestamp, file, old_status, new_status, entry_criteria_check}` where `entry_criteria_check` is the regenerator's evaluation of the target level's entry criteria from [`confidence-levels.md`](../../../../vault/confidence-levels.md). This is the **deterministic** half of what the Bayesian agent will eventually do; the *predictive* half (suggesting promotions) lives in v2. | [`confidence-levels.md` §Rules of the System](../../../../vault/confidence-levels.md#rules-of-the-system) — promotion rules with explicit entry/exit criteria. |
| `ontology-events.jsonl` | The v1 file-based form of the `ontology_events` SQL ledger described in [`ontology-architecture-draft.md` §3 Event Sourcing](../../../../vault/ontology-architecture-draft.md#3-event-sourcing). One line per vault mutation that lands on `main`: `{timestamp, actor, action, target_path, prev_hash, new_hash, session_ref}`. v2 promotes to Postgres by replaying the jsonl. | [`ontology-architecture-draft.md` §3](../../../../vault/ontology-architecture-draft.md#3-event-sourcing) "The Data Ledger (`ontology_events` SQL Table)". |
| `frontmatter-index.json` | Materializes the 7 classification labels ([Appendix D](../../../../vault/ontology-conventions.md#appendix-d-quick-reference--the-7-labels): `node_type`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `tags`) for every vault file in a single queryable JSON. Eliminates the need for agents to grep frontmatter across 21+ files. | [`ontology-conventions.md` Appendix D](../../../../vault/ontology-conventions.md#appendix-d-quick-reference--the-7-labels). |
| `README.md` | Explains the directory's contents, regenerator wiring, and the `DO NOT EDIT` contract. Generated by the manifest builder so it stays in sync with the actual file list. | This spec. |

## Migration table

For v1 there is **nothing on disk to physically relocate** — the vault has no derived artifacts today. Phase 2 only *creates* new files under `vault/.compiled/` and injects the `GENERATED-by` header (see Authority guarantees) into each.

| Artifact | Action | Notes |
|---|---|---|
| `vault/.compiled/manifest.json` | **Create** with `$generated` header | Empty entries on first run; populated as other regenerators register outputs. |
| `vault/.compiled/edges.json` | **Create** with `$generated` header | First run produces full deduplicated graph from current `## Connections` sections. |
| `vault/.compiled/contradicts.json` | **Create** with `$generated` header | Empty list initially is a valid output (no `contradicts` edges yet). |
| `vault/.compiled/status-log.jsonl` | **Create** as zero-byte file | Append-only; first entries land when status fields next change. |
| `vault/.compiled/ontology-events.jsonl` | **Create** as zero-byte file | Append-only; first entries land on the next merge to `main` that touches `vault/`. |
| `vault/.compiled/frontmatter-index.json` | **Create** with `$generated` header | First run indexes all 21 current vault files. |
| `vault/.compiled/README.md` | **Create** with header comment | Generated by manifest builder. |

The previously-planned `docs/features/payment-processing/_categorical/` migration is **deferred to v2**. The grandfathered directory stays at its current path; the `_categorical/` convention is **not** retired in v1.

## Deterministic regen pipeline

| Regenerator | Trigger | Inputs (intent) | Output | Staleness check command | Failure mode |
|---|---|---|---|---|---|
| `tools/vault-edge-compile.ts` | PR touching `vault/**/*.md` (excluding `vault/.compiled/`) | `## Connections` tables in every `vault/**/*.md` | `vault/.compiled/edges.json` | `tools/vault-edge-compile.ts && git diff --exit-code -- vault/.compiled/edges.json` | block PR with `COMPILED_TREE_STALE` |
| `tools/vault-contradicts-surface.ts` | PR touching `vault/**/*.md` (excluding `vault/.compiled/`) | `vault/.compiled/edges.json` (filter on `type=contradicts`) + frontmatter `status` of both endpoints | `vault/.compiled/contradicts.json` | `tools/vault-contradicts-surface.ts && git diff --exit-code -- vault/.compiled/contradicts.json` | block PR with `COMPILED_TREE_STALE` |
| `tools/vault-status-promotion-log.ts` | PR touching `vault/**/*.md` (excluding `vault/.compiled/`) | `git log -p --all` for `vault/**/*.md` frontmatter `status:` lines + entry criteria from `confidence-levels.md` | append to `vault/.compiled/status-log.jsonl` | `tools/vault-status-promotion-log.ts --check && git diff --exit-code -- vault/.compiled/status-log.jsonl` | block PR with `COMPILED_TREE_STALE` |
| `tools/vault-ontology-events.ts` | post-merge to `main` touching `vault/**/*.md` (also runs in PR `--check` mode) | git diff between merge-base and HEAD for `vault/**/*.md` (path, prev_hash, new_hash, author, timestamp, session_ref from commit trailer) | append to `vault/.compiled/ontology-events.jsonl` | `tools/vault-ontology-events.ts --check && git diff --exit-code -- vault/.compiled/ontology-events.jsonl` | block PR with `COMPILED_TREE_STALE` |
| `tools/vault-frontmatter-index.ts` | PR touching `vault/**/*.md` (excluding `vault/.compiled/`) | YAML frontmatter of every `vault/**/*.md` | `vault/.compiled/frontmatter-index.json` | `tools/vault-frontmatter-index.ts && git diff --exit-code -- vault/.compiled/frontmatter-index.json` | block PR with `COMPILED_TREE_STALE` |
| `tools/vault-build-manifest.ts` | runs *after* the above five | the five outputs above + their input globs | `vault/.compiled/manifest.json` + `vault/.compiled/README.md` | `tools/vault-build-manifest.ts && git diff --exit-code -- vault/.compiled/manifest.json vault/.compiled/README.md` | block PR with `COMPILED_TREE_STALE` |

The five regenerators MUST be byte-idempotent: re-running on unchanged inputs produces byte-identical outputs (sorted keys, stable formatting, deterministic timestamps drawn only from git commit metadata, never `Date.now()`). The manifest builder enforces this by recording `output_hash` and refusing to write a manifest if any regenerator produced a different hash on a no-op re-run within the same workflow.

The `tools/vault-ontology-events.ts` script is the only regenerator that *appends* on a post-merge trigger as well as `--check`-validates on PR. The PR-mode `--check` asserts that the event line *that will be written when this PR merges* would not produce a malformed entry (schema check), but does not actually write the line — that happens on the merge-to-`main` workflow run, where the commit hash is known.

## Sunset of grandfathered `_categorical/` — deferred

`docs/features/payment-processing/_categorical/` stays in place as-is in v1. The grandfathered convention is **not** retired in this phase. Justification:

- The vault pilot is the v1 scope; generalizing the compiled-tree framework to `docs/features/<feature>/` paths is v2 work.
- The missing `tools/extract-categorical.ts` regenerator that v0.1 of this spec planned to introduce is no longer in Phase 2 scope. Without that regenerator, `_categorical/` cannot be migrated safely (its inputs are LLM-judgment outputs with no deterministic re-derivation path today).
- v2 will (a) generalize the regen contract documented here to non-vault paths, (b) land the deterministic `extract-categorical` walker, and (c) execute the physical migration.

Until v2, the `_categorical/` substring is **permitted** under `docs/features/**/`. No grandfathered-path validator is wired in v1.

## Staleness CI gate

The Phase 1 `validate.yml` workflow gains a new job `vault-compiled-staleness`. It re-runs the six regenerators on every PR that touches `vault/**` (excluding `vault/.compiled/**` itself, to avoid loops) and asserts byte equality.

```yaml
# Added to .github/workflows/validate.yml (the Phase 1 workflow)
  vault-compiled-staleness:
    if: |
      contains(github.event.pull_request.changed_files, 'vault/') &&
      !contains(github.event.pull_request.changed_files, 'vault/.compiled/')
    runs-on: ubuntu-latest
    permissions:
      contents: read           # MUST be read-only — never push to PR branch
      pull-requests: write     # for diagnostic comment only
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci

      - name: detect human edits to vault/.compiled/
        run: |
          set -e
          if git diff --name-only origin/${{ github.base_ref }}...HEAD -- vault/.compiled/ | grep -q .; then
            echo "::error::VAULT_COMPILED_HUMAN_EDIT: vault/.compiled/ is generated. Edit the source intent files instead and let CI regenerate."
            exit 1
          fi

      - name: regen edge graph
        run: tools/vault-edge-compile.ts
      - name: regen contradicts
        run: tools/vault-contradicts-surface.ts
      - name: regen status promotion log
        run: tools/vault-status-promotion-log.ts
      - name: validate ontology-events schema (no append in PR mode)
        run: tools/vault-ontology-events.ts --check
      - name: regen frontmatter index
        run: tools/vault-frontmatter-index.ts
      - name: rebuild vault manifest
        run: tools/vault-build-manifest.ts

      - name: assert vault/.compiled/ is up-to-date
        run: |
          set -e
          if ! git diff --exit-code -- vault/.compiled/; then
            echo "::error::COMPILED_TREE_STALE: vault intent files changed in this PR but vault/.compiled/ was not regenerated. Run 'make vault-regen' locally and commit."
            exit 1
          fi

  vault-compiled-events-append:
    # Separate job — runs only on push to main, not in PRs
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: write          # writes the appended jsonl line back to main
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: tools/vault-ontology-events.ts --append
      - name: commit appended event
        run: |
          git config user.name 'vault-bot'
          git config user.email 'vault-bot@domainspec'
          git add vault/.compiled/ontology-events.jsonl
          git diff --cached --quiet || git commit -m "chore(vault): append ontology event [skip ci]"
          git push
```

The named error strings `COMPILED_TREE_STALE` and `VAULT_COMPILED_HUMAN_EDIT` are the contractually stable failure tags. Agents, dashboards, and `domainspec-reflect` match on them.

## Authority guarantees

### Never push to the human's PR branch

The `vault-compiled-staleness` job runs with `permissions: contents: read`. It MUST NOT have a write-scoped token for the PR branch. The Phase 4 bot-PR pattern (paired branch with `[regen]` prefix per [DISCOVERY §10 Q9](../DISCOVERY.md#q9-should-the-regen-bot-in-phase-4-push-to-the-same-branch-atlantis-style-or-open-a-paired-pr-renovate-style)) is explicitly out of scope. Phase 2's contract: detect drift, fail the check, leave the PR branch untouched.

The separate `vault-compiled-events-append` job *does* have `contents: write`, but it runs only on `push` to `main` and only ever appends a single line to `vault/.compiled/ontology-events.jsonl`. It cannot run on PR branches because of the `if:` guard above.

### GENERATED-by header

Every file under `vault/.compiled/` MUST carry an identifying header:

- **Markdown / TypeScript / shell:** first line `# GENERATED by <regenerator-script> from <input-glob>. DO NOT EDIT. @input-hash: <sha256>`
- **JSON (e.g., `manifest.json`, `edges.json`, `contradicts.json`, `frontmatter-index.json`):** top-level key `"$generated": { "by": "<regenerator>", "from": "<input-glob>", "input_hash": "<sha256>", "regenerator_version": "<semver>", "generated_at": "<iso8601>", "git_sha": "<sha>" }`
- **JSONL (e.g., `status-log.jsonl`, `ontology-events.jsonl`):** the **first line** is a metadata header object `{"$generated": {...}}` followed by data lines. Append-only: the metadata line is rewritten only on schema migrations.

### Edits to `vault/.compiled/` in human PRs fail CI

The `detect human edits to vault/.compiled/` step above fails the PR with `VAULT_COMPILED_HUMAN_EDIT` if any path under `vault/.compiled/` appears in the PR diff. The only legitimate writers are the regenerators themselves (running locally before commit) and the `vault-compiled-events-append` job on `main`.

## Acceptance criteria

Each criterion is objectively checkable by a single shell command or commit observation.

1. **VC-1 (compiled tree exists).** After Phase 2 ships, `test -d /Users/victorboscaro/domainspec/vault/.compiled` returns exit 0 AND each of `manifest.json edges.json contradicts.json status-log.jsonl ontology-events.jsonl frontmatter-index.json README.md` exists under that directory. Verifiable by `for f in manifest.json edges.json contradicts.json status-log.jsonl ontology-events.jsonl frontmatter-index.json README.md; do test -f "vault/.compiled/$f" || exit 1; done`.

2. **VC-2 (`edges.json` matches the deduplicated edge graph).** `tools/vault-edge-compile.ts --print | diff - vault/.compiled/edges.json` returns exit 0 against the current vault state. The output respects the deduplication rule from [`ontology-conventions.md` §Directionality Principle](../../../../vault/ontology-conventions.md#directionality-principle): for any pair of declarations `A derives-from B` and `B grounds A`, exactly one canonical directed edge appears in `edges.json`.

3. **VC-3 (adding a `contradicts` edge updates `contradicts.json`).** Adding a `## Connections` row with `type: contradicts` to any vault file and opening a PR causes the next CI run on that PR to surface a non-empty diff in `vault/.compiled/contradicts.json` containing the new edge with both endpoints' `status` populated. Verifiable by probe PR.

4. **VC-4 (status promotion writes a log line).** Promoting a vault file's `status` (e.g., `draft → exploratory`) and re-running `tools/vault-status-promotion-log.ts` MUST cause `vault/.compiled/status-log.jsonl` to gain exactly one new line containing `{timestamp, file, old_status: "draft", new_status: "exploratory", entry_criteria_check}`. Verifiable by `wc -l vault/.compiled/status-log.jsonl` before and after, and by `tail -1 vault/.compiled/status-log.jsonl | jq '.new_status'` returning `"exploratory"`.

5. **VC-5 (`VAULT_COMPILED_HUMAN_EDIT` blocks human edits).** A PR that modifies any file under `vault/.compiled/` (without the modification coming from a regenerator run in the same job) fails the `vault-compiled-staleness` check with a log line containing the literal string `VAULT_COMPILED_HUMAN_EDIT`. Verifiable by `grep -q VAULT_COMPILED_HUMAN_EDIT` against the failed job log.

6. **VC-6 (`COMPILED_TREE_STALE` blocks intent edits without regen).** A PR that edits a `## Connections` row in any `vault/**/*.md` without re-running `tools/vault-edge-compile.ts` fails the `vault-compiled-staleness` check with a log line containing the literal string `COMPILED_TREE_STALE`. Verifiable by `grep -q COMPILED_TREE_STALE` against the failed job log.

7. **VC-7 (`ontology-events.jsonl` gains an entry per merged vault mutation).** For every commit on `main` whose diff touches `vault/**/*.md`, `vault/.compiled/ontology-events.jsonl` MUST gain exactly one new line whose `git_sha` matches that commit. Verifiable by `git log --pretty=%H main -- vault/**/*.md | wc -l` equalling `grep -c '"git_sha"' vault/.compiled/ontology-events.jsonl` (modulo the header line).

8. **VC-8 (no write to PR branch from staleness job).** The `vault-compiled-staleness` job in `.github/workflows/validate.yml` contains `permissions: contents: read` and contains no `git push` step. Verifiable by `yq '.jobs."vault-compiled-staleness".permissions.contents' .github/workflows/validate.yml` returning `read` and by `grep -A 50 'vault-compiled-staleness:' .github/workflows/validate.yml | grep -q 'git push' && exit 1 || exit 0`.

9. **VC-9 (every generated file has the `$generated` header).** `tools/vault-validate-generated-headers.ts` returns exit 0 against `vault/.compiled/`. Removing the `$generated` key from any JSON file or the first-line metadata from any JSONL file causes it to return exit 1. Verifiable by probe.

10. **VC-10 (manifest enrolls every generated file).** Every file under `vault/.compiled/` (except `manifest.json` itself) appears as a key in `vault/.compiled/manifest.json`. Verifiable by comparing `ls vault/.compiled/` with `jq -r 'keys[]' vault/.compiled/manifest.json`.

## Out of scope

Per [DISCOVERY §9](../DISCOVERY.md#9-phased-delivery) and the v1/v2 split established by this spec:

- **`docs/features/payment-processing/_categorical/` migration** — deferred to v2. The grandfathered convention stays in place; no `extract-categorical.ts` regenerator is built in v1; no grandfathered-path validator is wired.
- **Generalizing the compiled-tree framework to non-vault paths** — deferred to v2. v1 hardcodes `vault/.compiled/` as the only compiled root. The path-agnostic version of the regen contract (parameterized on `<feature>` or `<root>`) is v2 work.
- **The SQL version of `ontology_events`** — deferred to v2. v1 uses the file-based `vault/.compiled/ontology-events.jsonl`. v2 reads the jsonl to populate the Postgres `ontology_events` table described in [`ontology-architecture-draft.md` §3](../../../../vault/ontology-architecture-draft.md#3-event-sourcing); the jsonl remains the canonical replay source.
- **The Bayesian agent's predictive promotion suggestions** — deferred to v2 / Phase 4. v1 ships only the deterministic checker (`tools/vault-status-promotion-log.ts`) which records and evaluates entry criteria for transitions that have *already happened*. The Bayesian's actual ML — predicting *future* promotions, downgrades, and contradiction risk — is out of scope here.
- **The Information Keeper / RAG embeddings** — out of scope entirely. That is the *read* layer (Graph-Dropping RAG per [`ontology-architecture-draft.md` §4](../../../../vault/ontology-architecture-draft.md#4-graph-dropping-rag-contextual-retrieval)), not GitOps. The compiled artifacts produced by Phase 2 *will* be inputs to it, but the Keeper itself is not part of this phase.
- **Phase 3 — VPS reconciler & deploy.** The systemd timer + `git pull --ff-only` loop + Pulumi project. Phase 2 produces compiled artifacts on disk but does not deploy them.
- **Phase 4 — `domainspec-bot` & spec-driven regen for LLM-judgment agents.** The bot-PR pattern, the obligation-diff PR comment, the semantic-hash idempotency layer.
- **Sibling Phase 2 deliverables tracked elsewhere.** SOPS+age secrets (`phase-2-sops-secrets.md`), `docs/signals/pipeline-signals.jsonl` emission (`phase-2-signal-emission.md`), `copilot/` ↔ `.github/` overlay validator (handled by `phase-1-ci-substrate.md`).
- **Behavioral equality testing for regenerated artifacts.** v1 uses **byte equality** for the staleness gate (`git diff --exit-code`). The five vault regenerators are byte-idempotent by construction (sorted keys, deterministic timestamps from git metadata only), so byte equality is sufficient.

## Open items

Each is recorded here so it is visible and not forgotten. Each has a recommended resolution.

1. **Where exactly under `vault/.compiled/` does the SQL ledger live, and how does it migrate from jsonl when v2 ships?**
   **Recommendation:** the jsonl is the canonical, append-only, replayable source. v2 introduces a Postgres `ontology_events` table (per [`ontology-architecture-draft.md` §3](../../../../vault/ontology-architecture-draft.md#3-event-sourcing)) that is *populated by replaying* `vault/.compiled/ontology-events.jsonl` from line 2 onward (line 1 is the metadata header). The jsonl stays in the repo as the source-of-truth replay log even after the SQL table is online; the SQL table is a query-optimized projection. No physical migration of the jsonl file occurs — only the addition of a new replay consumer.

2. **Does the Bayesian's deterministic checker emit suggestions for promotions it can't auto-approve, or just block?**
   **Recommendation:** **emit, don't block.** When the deterministic checker (`tools/vault-status-promotion-log.ts`) detects that a vault file *meets* the entry criteria for a higher status but the human author has not bumped `status:`, it MUST emit a PR comment labeled `bayesian-suggestion` with the file path, the proposed new status, and the satisfied criteria. The check itself does not fail — humans decide whether to apply the bump. This keeps Phase 2 strictly deterministic (the *check* is mechanical) while giving the Bayesian's v2 predictive layer a clean input signal (track which `bayesian-suggestion` comments humans accept vs. reject).

3. **Does `vault/.compiled/manifest.json` track input hashes for Phase 4's idempotency cache?**
   **Recommendation:** **yes — record per-regenerator `input_hash` (sha256 of sorted `cat` of input glob), `output_hash` (sha256 of the produced file), `regenerator_version` (semver of the script), and `git_sha` (commit at regen time).** v1 only *records* these; nothing reads `input_hash` to skip regen yet. Phase 4 reads `input_hash` to short-circuit idempotent regens — this is the on-disk substrate for the semantic-hash idempotency layer. Recording in v1 costs nothing and avoids a manifest-schema migration in v2.

4. **Should the `vault-compiled-staleness` job live in `validate.yml` or get its own workflow file?**
   **Recommendation:** **add as a job in the Phase 1 `validate.yml`.** The job is tightly coupled to the same PR event and the same `vault/**` path filter; splitting it would duplicate the checkout/setup steps without isolating any concern. The separate `vault-compiled-events-append` job, in contrast, MUST stay split from `validate.yml` because it triggers on `push: main` not `pull_request` — different events.

5. **What happens if `tools/vault-ontology-events.ts --append` fails on `main` (e.g., network glitch on the auto-commit push)?**
   **Recommendation:** the workflow must be **idempotent on retry** — running it twice on the same merge commit must not write two event lines. The script computes the line by hashing `(git_sha, target_path)` and checks `grep -F` against the existing jsonl before appending. The workflow gets `retries: 3` on the push step. If all three fail, an Issue is opened (label `vault-events-append-failed`) with the merge SHA so a human can manually re-run.
