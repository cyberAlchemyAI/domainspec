---
tags: [gitops, governance, infrastructure, feature-index, vault-pilot]
node_type: spec
layer: governance, infrastructure, automation
status: draft
veracidade: high
conviccao: high
version: 0.2.0
last_updated: 2026-05-02
discovery: ./DISCOVERY.md
---

# Feature: gitops-assessment

## What This Module Owns

This feature owns three concentric scopes, sequenced as v1 → v2 → v3. **v1** lands the GitOps loop on `/vault/` — the vault's own design (5 agents, trust gates, edge typing, maturity lifecycle per [vault/ontology-architecture-draft.md](../../../vault/ontology-architecture-draft.md) and [vault/confidence-levels.md](../../../vault/confidence-levels.md)) is the v1 implementation target, not a generic abstraction. **v2** extracts the framework-generic GitOps patterns from the vault implementation and generalizes them to other features (including `_categorical/` migration). **v3** adds the runtime reconciliation tier on a hosted deploy target. The boundary remains governance-and-infrastructure: this feature owns the machinery that keeps content honest, never the content itself.

## Module Map

```mermaid
graph TD
    subgraph V1[v1 — Vault Pilot]
        direction TB
        P1[Phase 1<br/>CI Substrate<br/>vault validators] --> P2[Phase 2<br/>vault/.compiled/ tree<br/>derived edges + contradicts<br/>+ status promotion log]
        P2 --> P4[Phase 4<br/>Vault Keeper + Updater<br/>bot-PR pipeline]
        P1 --> P4
        P3[Phase 3<br/>Runtime Reconciler<br/>DEFERRED]:::deferred
    end

    V1 --> V2[v2 — Generalize<br/>extract framework-generic<br/>patterns to other features<br/>+ payment categorical migration]
    V2 --> V3[v3 — Runtime tier<br/>activate Phase 3<br/>on hosted deploy target]

    %% Cross-cutting authority guarantees (annotations, not phases)
    Inv1[/Invariant: bot/CI never pushes to main without human + verifier approval/]:::inv -.-> P1
    Inv1 -.-> P4
    Inv2[/Invariant: every compiled file carries GENERATED-by header/]:::inv -.-> P2
    Inv3[/Invariant: verifier BLOCK is a merge-stop/]:::inv -.-> P1
    Inv3 -.-> P4
    Inv4[/Invariant: intent files are never automation-edited/]:::inv -.-> P2
    Inv4 -.-> P4
    Inv5[/Invariant: doc-vs-reality drift is a CI failure, not an audit finding/]:::inv -.-> P1
    Inv5 -.-> P2

    classDef inv fill:#fff8c4,stroke:#bba600,color:#403800,font-style:italic;
    classDef deferred fill:#e8e8e8,stroke:#888,color:#555,stroke-dasharray: 5 5;
```

## Capabilities

| Capability | What | Phase | Detail |
|---|---|---|---|
| CI Substrate (vault validators) | Wire `.github/workflows/` plumbing, `core.hooksPath`, the workflow split, and the `CONSTITUTION.md` C12 governance edit. v1 ships the **vault-scoped** validator surface: 7-label frontmatter check ([vault/ontology-conventions.md](../../../vault/ontology-conventions.md)) and `## Connections` link resolution | Phase 1 | [phase-1-ci-substrate.md](specs/phase-1-ci-substrate.md) |
| Intent vs Compiled (vault tree) | `vault/.compiled/` is the **first compiled tree**: derived edges, status-promotion log, and contradicts surface materialized from intent vault files. Sunset `_categorical/` is **deferred to v2**. Gate via `COMPILED_TREE_STALE` on intent edits without paired regen | Phase 2 | [phase-2-intent-compiled-split.md](specs/phase-2-intent-compiled-split.md) |
| Runtime Reconciler (DEFERRED to v3) | Continuous VPS reconciliation via systemd timer + `git pull --ff-only` + `docker compose up -d`. **The vault has no runtime** — there is no service to reconcile in v1. Phase 3 reactivates when a hosted DomainSpec service exists | Phase 3 (deferred) | [phase-3-runtime-reconciler.md](specs/phase-3-runtime-reconciler.md) |
| Vault bot-PR pipeline | Vault Keeper + Updater (the first 2 of 5 LLM agents from [vault/ontology-architecture-draft.md §1](../../../vault/ontology-architecture-draft.md#1-the-agents--their-roles)) ship in v1: Keeper drafts ADR/Premise nodes from intake, Updater regenerates affected vault files when source code or sibling vault files change. Bayesian, Reviewer, Information Keeper sketched but only the deterministic status-promotion checker ships in v1 | Phase 4 | [phase-4-domainspec-bot.md](specs/phase-4-domainspec-bot.md) |

## Concept Registry

Every named concept introduced across the four phase specs. Source of truth for downstream registry sync.

| Concept | ID | Type | Defined In |
|---|---|---|---|
| Constitution rule C12 (verifier BLOCK as merge-gate) | gitops.C12 | Governance Rule | [phase-1](specs/phase-1-ci-substrate.md) |
| Drift-correction first commit | gitops.DriftCorrectionCommit | Governance Action | [phase-1](specs/phase-1-ci-substrate.md) |
| `.github/workflows/pr-validate.yml` | gitops.PrValidateWorkflow | CI Workflow | [phase-1](specs/phase-1-ci-substrate.md) |
| `.github/workflows/overlay-sync.yml` | gitops.OverlaySyncWorkflow | CI Workflow | [phase-1](specs/phase-1-ci-substrate.md) |
| `.github/workflows/domainspec-tuning.yml` | gitops.TuningWorkflow | CI Workflow | [phase-1](specs/phase-1-ci-substrate.md) |
| `.github/workflows/deploy.yml` | gitops.DeployWorkflow | CI Workflow | [phase-1](specs/phase-1-ci-substrate.md) (stub) → [phase-3](specs/phase-3-runtime-reconciler.md) (real) |
| `.github/workflows/compiled-tree-staleness.yml` | gitops.CompiledTreeStalenessWorkflow | CI Workflow | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/install-hooks.sh` | gitops.InstallHooks | Bootstrap Script | [phase-1](specs/phase-1-ci-substrate.md) |
| `tools/check-overlay-sync.sh` | gitops.CheckOverlaySync | Validator | [phase-1](specs/phase-1-ci-substrate.md) |
| `tools/extract-categorical.ts` | gitops.ExtractCategorical | Regenerator | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/inject-generated-header.ts` | gitops.InjectGeneratedHeader | Post-processor | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/validate-generated-headers.ts` | gitops.ValidateGeneratedHeaders | Validator | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/validate-manifest-completeness.ts` | gitops.ValidateManifestCompleteness | Validator | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/build-compiled-manifest.ts` | gitops.BuildCompiledManifest | Manifest Builder | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/migrate-categorical-paths.sh` | gitops.MigrateCategoricalPaths | One-shot Migration | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `tools/validate-no-grandfathered-paths.ts` | gitops.ValidateNoGrandfatheredPaths | Validator | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `generated/` tree | gitops.GeneratedTree | Compiled Artifact Root | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `docs/.compiled/manifest.json` | gitops.CompiledManifest | Compiled Artifact Index | [phase-2](specs/phase-2-intent-compiled-split.md) |
| GENERATED-by header convention | gitops.GeneratedHeader | Artifact Convention | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `@source-hash` annotation | gitops.SourceHash | Traceability Annotation | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `COMPILED_TREE_STALE` failure tag | gitops.CompiledTreeStaleTag | CI Failure Contract | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `_categorical/` sunset trigger | gitops.CategoricalSunset | Migration Event | [phase-2](specs/phase-2-intent-compiled-split.md) |
| `docs/signals/pipeline-signals.jsonl` | gitops.SignalStream | Append-only Signal Stream | [phase-1](specs/phase-1-ci-substrate.md), [phase-2](specs/phase-2-intent-compiled-split.md) |
| `docs/signals/TUNING-REPORT.md` | gitops.TuningReport | Derived Report | [phase-1](specs/phase-1-ci-substrate.md) |
| `docs/META-HEALTH.md` | gitops.MetaHealth | Derived Report | [phase-1](specs/phase-1-ci-substrate.md), [phase-2](specs/phase-2-intent-compiled-split.md) |
| `infra/Pulumi.yaml` | gitops.PulumiProject | IaC Project Descriptor | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/Pulumi.prod.yaml` | gitops.PulumiProdStack | IaC Stack Config | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/index.ts` | gitops.PulumiProgram | IaC Program | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/cloud-init.yaml` | gitops.CloudInit | Droplet Bootstrap | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/docker-compose.yml` | gitops.RuntimeCompose | Compose Manifest | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/Caddyfile` | gitops.Caddyfile | Reverse Proxy + TLS | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/prometheus.yml` | gitops.PrometheusConfig | Scrape Config | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/alerts/` | gitops.AlertRules | Alert Rules Directory | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/secrets.enc.yaml` | gitops.EncryptedSecrets | SOPS Encrypted Blob | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/.sops.yaml` | gitops.SopsRules | SOPS Recipient Rules | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `secrets/keys/*.pub` | gitops.MaintainerAgeKeys | Public Age Key Set | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/reconciler/reconciler.timer` | gitops.ReconcilerTimer | systemd Timer | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/reconciler/reconciler.service` | gitops.ReconcilerService | systemd Oneshot Service | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/reconciler/reconciler-path.path` | gitops.ReconcilerPathWatcher | systemd Path Watcher | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `infra/reconciler/reconcile.sh` | gitops.ReconcileScript | Reconciliation Loop Body | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `/opt/domainspec` clone path | gitops.DropletRepoClone | Filesystem Convention | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `deploy` user on droplet | gitops.DeployUser | Service Account | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `SOPS_AGE_KEY` GitHub Actions secret | gitops.SopsAgeCiKey | CI Decrypt Key | [phase-3](specs/phase-3-runtime-reconciler.md) |
| Droplet age keypair | gitops.DropletAgeKey | Decryption Identity | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `docs/runbooks/vps-bootstrap.md` | gitops.VpsBootstrapRunbook | Runbook | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `docs/runbooks/secret-rotation.md` | gitops.SecretRotationRunbook | Runbook (placeholder) | [phase-3](specs/phase-3-runtime-reconciler.md) |
| `domainspec-bot` GitHub identity | gitops.RegenBot | Automation Identity | [phase-4](specs/phase-4-domainspec-bot.md) |
| `bot/<agent>/<feature>/<input-hash>` branch convention | gitops.BotBranchConvention | Branch Naming Rule | [phase-4](specs/phase-4-domainspec-bot.md) |
| `[bot-regen]` PR title prefix | gitops.BotPrTitlePrefix | PR Convention | [phase-4](specs/phase-4-domainspec-bot.md) |
| `bot-regen` label | gitops.BotRegenLabel | PR Label | [phase-4](specs/phase-4-domainspec-bot.md) |
| `agent:<agent>` label | gitops.BotAgentLabel | PR Label | [phase-4](specs/phase-4-domainspec-bot.md) |
| `feature:<feature>` label | gitops.BotFeatureLabel | PR Label | [phase-4](specs/phase-4-domainspec-bot.md) |
| `blocked` / `needs-clarification` / `superseded` / `non-substantive-regen` / `orphan-story` / `needs-infra-decision` labels | gitops.BotConditionalLabels | PR Labels | [phase-4](specs/phase-4-domainspec-bot.md) |
| Obligation diff PR comment | gitops.ObligationDiff | PR Comment Convention | [phase-4](specs/phase-4-domainspec-bot.md) |
| Input hash | gitops.InputHash | Idempotency Key | [phase-4](specs/phase-4-domainspec-bot.md) |
| Semantic hash | gitops.SemanticHash | Structural-Equality Hash | [phase-4](specs/phase-4-domainspec-bot.md) |
| `sha256-v1` hash algorithm version | gitops.HashAlgorithmVersion | Versioned Algorithm Tag | [phase-4](specs/phase-4-domainspec-bot.md) |
| `bot-write-scope` PR check | gitops.BotWriteScopeCheck | CI Check | [phase-4](specs/phase-4-domainspec-bot.md) |
| Stale PR supersession protocol | gitops.SupersessionProtocol | PR Lifecycle Rule | [phase-4](specs/phase-4-domainspec-bot.md) |
| Five regen-eligible LLM-judgment agents (`spec-writer`, `implementer`, `task-executor`, `ui-architect`, `infra-architect`) | gitops.RegenEligibleAgents | Agent Set | [phase-4](specs/phase-4-domainspec-bot.md) |
| Four interactive-only LLM-judgment agents (`orchestrator`, `interviewer`, `planner`, `mars-researcher`) | gitops.InteractiveOnlyAgents | Agent Set | [phase-4](specs/phase-4-domainspec-bot.md) |

### Vault-pilot concepts (v1 scope)

The following concepts are introduced specifically for the v1 vault-pilot scope. They implement the design in [vault/ontology-architecture-draft.md](../../../vault/ontology-architecture-draft.md), [vault/ontology-conventions.md](../../../vault/ontology-conventions.md), [vault/agent-navigation.md](../../../vault/agent-navigation.md), and [vault/confidence-levels.md](../../../vault/confidence-levels.md). The framework-generic entries above remain valid; v2 will lift the patterns out of the vault into the generic layer.

| Concept | ID | Type | Defined In |
|---|---|---|---|
| Vault frontmatter validator (deterministic regenerator for the 7-label schema) | gitops.VaultFrontmatterValidator | Validator | [phase-1](specs/phase-1-ci-substrate.md) |
| Vault edge resolver (resolves `## Connections` rows to real targets) | gitops.VaultEdgeResolver | Validator + Regenerator | [phase-1](specs/phase-1-ci-substrate.md), [phase-2](specs/phase-2-intent-compiled-split.md) |
| Vault contradicts surfacer (Heuristic 6 enforcement from [vault/agent-navigation.md](../../../vault/agent-navigation.md)) | gitops.VaultContradictsSurfacer | Surfacing Job | [phase-2](specs/phase-2-intent-compiled-split.md) |
| Vault status promotion checker (deterministic core of the Bayesian agent — entry/exit criteria from [vault/confidence-levels.md](../../../vault/confidence-levels.md)) | gitops.VaultStatusPromotionChecker | Validator | [phase-2](specs/phase-2-intent-compiled-split.md) |
| Vault Keeper (LLM-judgment bot, intake — drafts ADRs and Premises from natural language) | gitops.VaultKeeper | Bot Agent | [phase-4](specs/phase-4-domainspec-bot.md) |
| Vault Updater (LLM-judgment bot, regen — rewrites affected vault files when sources change) | gitops.VaultUpdater | Bot Agent | [phase-4](specs/phase-4-domainspec-bot.md) |
| Vault Reviewer (admission webhook for vault PRs — the deterministic counter-weight to Updater) | gitops.VaultReviewer | Admission Webhook | [phase-4](specs/phase-4-domainspec-bot.md) |
| Ontology events ledger (SQL append-only log per [vault/ontology-architecture-draft.md §3](../../../vault/ontology-architecture-draft.md#3-event-sourcing)) | gitops.OntologyEventsLedger | Append-only Audit Log | [phase-2](specs/phase-2-intent-compiled-split.md), [phase-4](specs/phase-4-domainspec-bot.md) |
| `vault/.compiled/` tree (derived edges, contradicts surface, status promotion log) | gitops.VaultCompiledTree | Compiled Artifact Root | [phase-2](specs/phase-2-intent-compiled-split.md) |

## Cross-Cutting Invariants

These guarantees hold across **every** phase that ships. The discovery hard-coded each one; each phase spec enforces a specific subset.

| # | Invariant | Enforced By |
|---|---|---|
| I1 | Bot or CI **never** pushes directly to `main` without human review and `domainspec-verifier` PASS or FLAG | [phase-1](specs/phase-1-ci-substrate.md) (workflow `AUTHORITY:` comments + branch protection); [phase-2](specs/phase-2-intent-compiled-split.md) (CT-7 `permissions: contents: read` on staleness job); [phase-4](specs/phase-4-domainspec-bot.md) (acceptance §3, authority §1 + §3) |
| I2 | Every file under the compiled tree carries the GENERATED-by header in the syntactically-correct form for its file type | [phase-2](specs/phase-2-intent-compiled-split.md) (`tools/validate-generated-headers.ts`, CT-5) |
| I3 | `domainspec-verifier` BLOCK is a binding merge-stop, not advisory | [phase-1](specs/phase-1-ci-substrate.md) (C12 in `CONSTITUTION.md` + `pr-validate.yml` required check); [phase-4](specs/phase-4-domainspec-bot.md) (auto-draft on BLOCK + acceptance §5) |
| I4 | Intent files (`docs/features/<feature>/{SPEC,domain,operations,states,interfaces,events,queries,workflows,mappings,STORIES}.md`, root governance docs) are **never** edited by an automation | [phase-2](specs/phase-2-intent-compiled-split.md) (compiled tree lives only under `generated/` + `docs/.compiled/`); [phase-4](specs/phase-4-domainspec-bot.md) (`bot-write-scope` CI check, acceptance §4, authority §2) |
| I5 | Drift between docs and reality is a failed CI check at PR or push time, not a discovery at audit time | [phase-1](specs/phase-1-ci-substrate.md) (drift-correction commit + `overlay-sync.yml`); [phase-2](specs/phase-2-intent-compiled-split.md) (`COMPILED_TREE_STALE` gate); [phase-3](specs/phase-3-runtime-reconciler.md) (60s reconciler tick reverts click-ops within one cycle) |
| I6 | Every derived artifact is traceable to its `(source_path, source_hash, prompt_hash, model_version, generated_at)` via `docs/.compiled/manifest.json` | [phase-2](specs/phase-2-intent-compiled-split.md) (CT-6); [phase-4](specs/phase-4-domainspec-bot.md) (acceptance §7 — manifest updated atomically with each derived artifact) |
| I7 | Plaintext secrets never reach git | [phase-1](specs/phase-1-ci-substrate.md) (`gitleaks` in pre-commit + `pr-validate.yml`); [phase-3](specs/phase-3-runtime-reconciler.md) (SOPS+age + acceptance §5) |
| I8 | Every vault file MUST pass the 7-label frontmatter schema ([vault/ontology-conventions.md](../../../vault/ontology-conventions.md)) before merge | [phase-1](specs/phase-1-ci-substrate.md) (`gitops.VaultFrontmatterValidator` as required check) |
| I9 | Every `## Connections` row in a vault file MUST resolve to a real file at merge time | [phase-1](specs/phase-1-ci-substrate.md) (`gitops.VaultEdgeResolver` validator); broken-link PR fails CI |
| I10 | Any open `contradicts` edge involving a vault file MUST block promotion of that file to `consolidated` or higher | [phase-2](specs/phase-2-intent-compiled-split.md) (`gitops.VaultContradictsSurfacer` + `gitops.VaultStatusPromotionChecker`) |
| I11 | Status promotions MUST satisfy the entry criteria for the target level in [vault/confidence-levels.md](../../../vault/confidence-levels.md) | [phase-2](specs/phase-2-intent-compiled-split.md) (`gitops.VaultStatusPromotionChecker` enforces entry/exit criteria deterministically) |
| I12 | A vault file with `status: evergreen` or `status: consolidated` is human-only-mutable per the trust gates in [vault/ontology-architecture-draft.md §2](../../../vault/ontology-architecture-draft.md#2-the-gates-of-trust) | [phase-4](specs/phase-4-domainspec-bot.md) (`gitops.VaultReviewer` admission webhook denies bot writes; bot-write-scope check) |

## Authority Map (gitops-feature local)

This map covers only artifacts introduced by this feature. Repository-wide authority remains with the canonical owners declared in `/Users/victorboscaro/domainspec/AUTHORITY-MAP.md`.

| Artifact | Owner | Mutable by |
|---|---|---|
| `.github/workflows/*.yml` | repo maintainer | human PR (Phase 1 author + canonical owner review) |
| `tools/check-overlay-sync.sh`, `tools/extract-categorical.ts`, `tools/inject-generated-header.ts`, other Phase 1/2 validators | tooling maintainer | human PR |
| `generated/**` | the named regenerator for that subtree (see [Phase 2 §Deterministic regen pipeline table](specs/phase-2-intent-compiled-split.md#deterministic-regen-pipeline)) | CI staleness gate (read-only diff) + local re-run by `make regen` (Phase 2); never written by `compiled-tree-staleness.yml` to the PR branch |
| `docs/.compiled/manifest.json` | `tools/build-compiled-manifest.ts` | regenerator output, committed in the same PR as the artifacts it indexes |
| `docs/signals/pipeline-signals.jsonl` | `domainspec-emit-signals` skill (append-only); rotated by `tools/prune-governance.ts` weekly | append-only by any pipeline run; rotation by scheduled `tuning.yml` |
| `docs/signals/TUNING-REPORT.md` | `domainspec-reflect` skill | bot-opened PR via `tuning.yml`, never direct push |
| `docs/META-HEALTH.md` | `tools/generate-meta-health.ts` | scheduled `tuning.yml`; if changed in a PR's diff, the PR author must include the regen |
| `infra/**` (IaC, compose, Caddyfile, prometheus, alerts, reconciler unit files, runbooks) | infra maintainer | human PR |
| `infra/secrets.enc.yaml` | maintainer set declared in `infra/.sops.yaml` | human edit + re-encrypt + commit; rotation **detected** by `domainspec-reflect`, **executed** by human |
| `secrets/keys/*.pub` | each maintainer owns their own pubkey file | human PR (added when a new maintainer joins) |
| `.github/agents/`, `.github/skills/`, `.github/get-shit-done/`, `.github/gsd-file-manifest.json` | `copilot/install.sh` (deterministic regenerator) | regenerator output; CI `overlay-sync.yml` enforces source-overlay parity |
| `CONSTITUTION.md` C12 row + Derivation Chain item 7 | `CONSTITUTION.md` canonical owner per `AUTHORITY-MAP.md` | human PR; lands as part of Phase 1 governance commit |
| Drift-correction edits to `ADLC-ALIGNMENT.md` G4 row, `TUNING-LOOP.md:73`, `TUNING-LOOP.md:426` | canonical doc owners per `AUTHORITY-MAP.md` | human PR; lands as the **first commit of Phase 1**, separate from the workflow PR |
| Bot-opened PRs against `generated/**` and `docs/.compiled/manifest.json` | `domainspec-bot` (writes) | feature owner per `AUTHORITY-MAP.md` reviews + verifier PASS/FLAG; merge by human |
| `bot/*` branches | `domainspec-bot` | bot may force-push (rebase loop, capped 3 attempts/PR/hour); `main` denies bot push |
| `vault/**/*.md` (intent vault files) | per-domain author + vault stewards | human PR; **never** mutated by bot (bots may only open PRs with proposed edits subject to `gitops.VaultReviewer`) |
| `vault/.compiled/**` (derived edges, contradicts surface, status promotion log) | the named regenerator for that subtree (`gitops.VaultEdgeResolver`, `gitops.VaultContradictsSurfacer`, `gitops.VaultStatusPromotionChecker`) | CI on PR; never hand-edited |
| Vault constitutions and axioms (any vault file with `status: consolidated` or `status: evergreen`) | human founders per [vault/ontology-architecture-draft.md §2](../../../vault/ontology-architecture-draft.md#2-the-gates-of-trust) | human PR with explicit governance approval; bots blocked at admission by `gitops.VaultReviewer` |
| `gitops.OntologyEventsLedger` (SQL append-only) | `gitops.VaultStatusPromotionChecker` + merge hook | append-only by merge events; never edited or deleted |

## Phase Dependency Graph

```mermaid
graph LR
    P1[Phase 1<br/>CI Substrate<br/>vault validators<br/>+ C12 governance edit<br/>+ drift-correction commit]
    P2[Phase 2<br/>vault/.compiled/ tree<br/>+ derived edges<br/>+ contradicts surface<br/>+ status promotion log<br/>+ COMPILED_TREE_STALE gate]
    P3[Phase 3<br/>DEFERRED to v3<br/>VPS reconciler<br/>no vault runtime in v1]:::deferred
    P4[Phase 4<br/>Vault Keeper + Updater<br/>+ semantic-hash idempotency<br/>+ obligation-diff PR comments<br/>+ VaultReviewer admission gate]

    P1 --> P2
    P1 --> P4
    P2 --> P4
    P2 -.->|deferred| P3

    classDef deferred fill:#e8e8e8,stroke:#888,color:#555,stroke-dasharray: 5 5;
```

Phase 3 is a **DEFERRED node**, not a sequential step in v1. The vault has no runtime to reconcile, so the two-tier reconciliation model from [DISCOVERY §2.2](DISCOVERY.md#22-two-tier-reconciliation) collapses to the spec tier only for v1. Phase 3 reactivates in v3 when a hosted DomainSpec service exists.

## Acceptance Criteria (feature-level)

Highest-leverage criteria from each phase. Each rolled up to a single bullet; full criterion lists live in the linked spec.

- **After Phase 1 (vault validators ship):** the workflow split exists on disk with every workflow declaring its `AUTHORITY:` posture, the C12 rule is in `CONSTITUTION.md`, the drift-correction commit landed **before** any `.github/workflows/` commit, and a PR introducing a vault file with broken `## Connections` rows or a malformed 7-label frontmatter **fails CI** via `gitops.VaultFrontmatterValidator` and `gitops.VaultEdgeResolver`. ([Phase 1 §Acceptance criteria, items 1–14](specs/phase-1-ci-substrate.md#acceptance-criteria))
- **After Phase 2 (vault compiled tree):** `vault/.compiled/` exists on disk with derived edges materialized, `gitops.VaultContradictsSurfacer` surfaces every open `contradicts` edge, and `gitops.OntologyEventsLedger` records every status transition. The staleness gate fails on any intent vault edit without a paired regen. ([Phase 2 §Acceptance criteria CT-1 through CT-10](specs/phase-2-intent-compiled-split.md#acceptance-criteria))
- **After Phase 3:** **DEFERRED.** Reactivate this criterion when a hosted DomainSpec service exists (v3). The vault has no runtime in v1; there is nothing to reconcile.
- **After Phase 4 (Vault Keeper + Updater):** the Vault Keeper bot opens **at most one PR per intake event**; the Vault Updater bot opens **at most one PR per affected vault file**; **neither can self-merge** (gated by `gitops.VaultReviewer` admission webhook + verifier PASS/FLAG); zero bot writes to vault files with `status: consolidated|evergreen` (I12). ([Phase 4 §Acceptance criteria, items 1–10](specs/phase-4-domainspec-bot.md#acceptance-criteria))

## Out of Scope (feature-level)

Aggregated and de-duplicated from [DISCOVERY §1 "What stays the same"](DISCOVERY.md#what-stays-the-same) and the four phase specs' Out-of-scope sections. The first block enumerates v1 deferrals; the rest are permanent (or ≥ v2) framework-level deferrals.

### v1 deferrals (rolled up)

- **Generalization to non-vault markdown.** Deferred to **v2**. v1 ships only the vault scope; `_categorical/`, feature SPECs, and root governance docs remain on the legacy intent-only model.
- **`payment-processing` `_categorical/` migration.** Deferred to **v2** alongside the generic `generated/` tree extraction.
- **VPS / runtime reconciler (Phase 3 in full).** Deferred to **v3**, gated on a hosted DomainSpec service existing.
- **Information Keeper / RAG layer.** Deferred indefinitely — it is a read layer, not a GitOps concern. Tracked in [vault/ontology-architecture-draft.md §4](../../../vault/ontology-architecture-draft.md#4-graph-dropping-rag-contextual-retrieval).
- **Bayesian agent's prediction and embedding logic.** Only the **deterministic status-promotion checker** (`gitops.VaultStatusPromotionChecker`) ships in v1 — the prediction/embedding portion is **v2**.

### Permanent / ≥ v2 deferrals

- **No Kubernetes adoption.** Single-VPS Docker Compose remains the deploy target. ArgoCD, Flux, Argo Rollouts, Flagger, Crossplane, Kratix referenced as patterns only.
- **No runtime canary or progressive delivery.** Blue/green is "by absence" — `docker compose up -d` recreates services in place. Weighted DNS, traffic splitting, Argo Rollouts are deferred.
- **No external secrets vault.** SOPS+age suffices until rotation requirements appear. ESO, HashiCorp Vault, AWS Secrets Manager deferred.
- **No multi-agent merge-conflict resolution.** No public prior art; deferred (Researcher B open problem 7).
- **No reconciliation rollback semantics for spec changes.** Open problem in the literature; recovery is `git revert` on `main`.
- **No obligation-diff blast-radius computation.** The dbt `state:modified+` analog for LLM-derived artifacts; deferred to v2.
- **No application containers in v1.** The v1 compose file ships only OTel collector + Prometheus + Caddy. The `implementation/app-frontend/` subtree is explicitly out of scope.
- **No cross-feature spec coupling detection.** Phase 4 bot treats each feature independently.
- **No LLM bot self-tuning, model-version bumps, or per-PR token budget enforcement.** Human governance decisions surfaced through `domainspec-reflect`.
- **No automated secret rotation tooling.** `domainspec-reflect` *detects* rotation need; humans *execute* it. The runbook ships empty until first triggered.
- **Existing root governance docs stay authoritative as written.** `AUTHORITY-MAP.md`, `AXIOMS.md`, `CONSTITUTION.md`, `TAXONOMY.md`, `RELATIONSHIPS.md`, `ARCHITECTURE.md`, `OBSERVABILITY.md`, `TEST-PIPELINE.md`, `DRIFT-CONVERGENCE.md`, `GOVERNANCE-ATTENUATION.md`, `TUNING-LOOP.md`, `ADLC-ALIGNMENT.md`, `PHASED-PLAN.md`, `CHANGELOG.md`, `README.md`. Only the enumerated drift-correction edits and the C12 governance edit are in scope.
- **The `implementation/app-frontend/` 845-file Node.js subtree.** Authority chain unclear; reconciler will not deploy it.
- **The `vault/` knowledge corpus.** Mixed human/agent emissions; out of scope for GitOps wiring.
- **The Phase 2 sibling specs** (`phase-2-sops-secrets.md`, `phase-2-signal-emission.md`) are tracked separately to keep each spec ≤ 700 lines; not duplicated here.

## Open Items (feature-level)

Highest-priority open items from each phase, de-duplicated and given a recommendation. Phase-local items remain in the linked specs.

- **Drift-correction revert (Phase 1 OI-1).** After `domainspec-tuning.yml` lands, the "NOT YET DEPLOYED" annotations in `TUNING-LOOP.md:73` and `:426` themselves become false. *Recommendation:* a follow-up commit (gated on Phase 1 acceptance §14) restores the original wording. Track explicitly so the second-order drift does not become permanent.
- **`pr-validate.yml` parallelism (Phase 1 OI-4).** *Recommendation:* parallel by default with `verifier` as a fail-fast gate. Decision recorded in the workflow's `AUTHORITY:` comment block.
- **`docs/.compiled/manifest.json` split threshold (Phase 2 OI-2).** *Recommendation:* one file until the repo has ≥ 10 features OR the manifest exceeds 500 KB; track the threshold via a signal emitted from `tools/build-compiled-manifest.ts`.
- **JSON `$generated` key collision risk (Phase 2 OI-3).** *Recommendation:* verify against current readers (none on disk today) before locking the format; fall back to a `<file>.gen.json` sidecar per the binary-file convention if a future consumer rejects `$`-keys.
- **Path-watcher `reconciler-path.path` (Phase 3 OI-1).** *Recommendation:* keep, but make it the easiest unit to remove if it causes flapping. Re-evaluate after one month with metrics.
- **Hotfix faster than the timer cadence (Phase 3 OI-5).** *Recommendation:* `sudo systemctl start reconciler.service` is the only supported "force a tick now" path. Do not build a webhook in v1 (would breach the 80/443/22 firewall posture).
- **Bot identity surface (Phase 4 OI-1).** *Recommendation:* GitHub App (per-installation tokens, fine-scoped). Fall back to a bot account only if App installation is unavailable in the deploy environment.
- **Semantic-hash algorithm coverage (Phase 4 OI-3).** *Recommendation:* ship Phase 4 with hash algorithms defined for YAML, TypeScript, and Markdown-with-frontmatter; other types fall back to byte-equality with a `semantic-hash:fallback` label, surfacing the gap as a `spec-gap` signal.
- **Self-review loop when spec author is feature owner (Phase 4 OI-4).** *Recommendation:* bot escalates one level up the authority chain. Encode the chain explicitly in `AUTHORITY-MAP.md` during Phase 1.
- **Manifest-write race between concurrent bot PRs (Phase 4 OI-6).** *Recommendation:* bot rebases other open bot PRs for the same feature when one merges; capped at 3 attempts per PR per hour to prevent thrashing.
- **Where does `vault/.compiled/` live? (v1 OI).** *Recommendation:* place it inside `vault/` (i.e. `vault/.compiled/`) for locality, not under `docs/.compiled/`. The vault is the only producer and only consumer in v1; co-locating the compiled tree with intent makes the staleness gate trivial to scope.
- **Reconciling `vault/ontology-architecture-draft.md` with the v1 implementation (v1 OI).** *Recommendation:* treat the existing draft as **the spec being implemented**. When v1 ships and no `contradicts` edge is open against it, auto-promote it from `status: active` to `status: consolidated` via `gitops.VaultStatusPromotionChecker`. Record the transition in `gitops.OntologyEventsLedger` with reason `V1_IMPLEMENTATION_LANDED`.
- **Bayesian agent scope in v1 (v1 OI).** *Recommendation:* ship the **deterministic status promotion** logic in v1 — the entry/exit criteria in [vault/confidence-levels.md](../../../vault/confidence-levels.md) are formal enough to encode without LLM judgment. The validator/resolver/surfacer trio plus `gitops.VaultStatusPromotionChecker` is the v1 "deterministic Bayesian core". The probabilistic prediction/embedding logic stays in v2.

## See Also

- [DISCOVERY.md](DISCOVERY.md)
- [Round-1 review](review/REVIEW-ROUND-1.md)
- [Round-2 review](review/REVIEW-ROUND-2.md)
- Research: [foundations](research/research-a-foundations.md), [agentic edge](research/research-b-agentic-spec-driven.md), [repo assessment](research/repo-assessment.md), [synthesis](research/SYNTHESIS.md)
- **v1 implementation target (the vault):** [vault/](../../../vault/), [vault/ontology-architecture-draft.md](../../../vault/ontology-architecture-draft.md) (5-agent design + trust gates), [vault/ontology-conventions.md](../../../vault/ontology-conventions.md) (7-label schema), [vault/agent-navigation.md](../../../vault/agent-navigation.md), [vault/confidence-levels.md](../../../vault/confidence-levels.md) (status lifecycle).
