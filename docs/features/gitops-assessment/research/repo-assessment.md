# GitOps Adoption — Repository Assessment

**Repo:** `/Users/victorboscaro/domainspec`
**Branch:** `feat/vault-frontend-implementation-and-payment-categorical`
**Assessment date:** 2026-05-02
**Assessor role:** Repo Assessor (factual, no tooling recommendations)

---

## Summary

DomainSpec is **doc-heavy and runtime-light**. The repository today is overwhelmingly a *framework definition* — taxonomies, agent/skill packs, governance/tuning prose, infrastructure setup guides — with very little executable plumbing actually wired up. There are 17 root-level governance/architecture markdown files (`README.md` 838 lines, `INFRA-SETUP.md` 520 lines, `TUNING-LOOP.md` 488 lines, `ARCHITECTURE.md` 311 lines, etc.), 17 packaged agents in `copilot/agents/` totaling 1,449 lines, 30 packaged skills in `copilot/skills/` totaling 2,522 lines, and 17 TypeScript/shell tools in `tools/` totaling 2,476 lines. The pipeline that the docs describe — plan → spec → tests → implement → observability → infra → verify → tuning — is documented in detail but the corresponding *machine surface* (CI workflows, deploy controllers, generated artifacts) is largely absent from the repo.

The intent/compiled split is **specified but not enforced**. Hand-authored intent (SPEC.md, aspect docs, AUTHORITY-MAP.md, AXIOMS.md, CONSTITUTION.md, plan/*) coexists in the same trees as machine-derived overlays (`.github/agents/`, `.github/skills/`, `.github/get-shit-done/`, `.github/gsd-file-manifest.json` — 23,392 bytes of generated install state) with no manifest, no checksum, no “derived — do not edit” headers, and no CI to detect drift. The single concrete pipeline output present in `docs/features/payment-processing/_categorical/` (L1.json, L2.json, delta.json, extraction.log.md) is committed alongside the human-authored aspect markdown for the same feature.

There is **no CI/CD at all in this repo today**. `.github/workflows/` does not exist. `TUNING-LOOP.md` line 73 lists `.github/workflows/domainspec-tuning.yml` as a deployed component, and `ADLC-ALIGNMENT.md` G4 marks it ✅; the file is not present. `INFRA-SETUP.md` line 484 promises `git push main # CI/CD deploys automatically`, but no workflow, no `infra/` directory, no Pulumi project, no `docker-compose.yml`, no `Dockerfile`, no `prometheus.yml`, no `Caddyfile`, and no alert files exist anywhere outside templates. A pre-commit hook script lives at `.githooks/pre-commit` (13 lines, prettier-only) but `core.hooksPath` is not configured and `.git/hooks/` contains zero active hooks — the hook is dead code today.

The brownfield risk surface is concentrated in (a) the duplicated agent/skill pack between `copilot/` and `.github/` with no sync verifier, (b) the `implementation/app-frontend/` subtree which is a self-contained Node.js app (`visualizations/app-release/` with its own `package.json`, `node_modules/`, 845 files) committed without lockfile discipline visible at root, and (c) the `plan/` directory which is hand-edited prose claiming to track work that no automated process closes. ADLC-ALIGNMENT.md’s G1–G16 explicitly flag the gaps GitOps would close: G2 (continuous tuning outer loop), G4 (automated governance / CI gates), G6 (dynamic goals with safe re-derivation), G10 (versioned agent artifacts), G11 (code-to-spec binding), G15 (meta-system health), G16 (L4→L3→L6 derivation chain enforcement). In short: the repo describes a GitOps-shaped system; almost none of the GitOps plumbing physically exists.

---

## Artifact Inventory

| Artifact | Path glob | Author | Regen mechanism today | Committed? |
|---|---|---|---|---|
| Root governance/architecture docs | `/{README,AUTHORITY-MAP,DRIFT-CONVERGENCE,GOVERNANCE-ATTENUATION,INFRA-SETUP,ARCHITECTURE,AXIOMS,CONSTITUTION,TAXONOMY,RELATIONSHIPS,OBSERVABILITY,TEST-PIPELINE,TUNING-LOOP,ADLC-ALIGNMENT,PHASED-PLAN,CHANGELOG}.md` | Human | Manual edit | Yes |
| Feature SPEC packs | `docs/features/<feature>/{SPEC,domain,operations,states,interfaces,events,queries,workflows,mappings}.md` | Human via `domainspec-spec-writer` agent | Agent regen on demand (no automation) | Yes |
| Feature stories | `docs/features/<feature>/STORIES.md` (template only — not present in payment-processing) | Agent (`domainspec-story-sync`) | Manual `domainspec-sync-user-stories` invocation | Yes (when generated) |
| Categorical / extraction artifacts | `docs/features/<feature>/_categorical/{L1,L2,delta}.json`, `extraction.log.md` | Machine (only existing example: payment-processing) | Unknown extraction tool — not in `tools/` | Yes |
| Backend TEST-SPEC | `docs/features/<feature>/TEST-SPEC.md` (only present in `implementation/app-frontend/docs/features/app-release/` and `visualizations/fractals/docs/`) | Agent (`domainspec-test-designer`) | Manual `domainspec-generate-tests` | Yes |
| Aspect observability spec | `docs/features/<feature>/observability.md` | Agent (`domainspec-otel-instrumenter` consumes; planner derives) | Manual `domainspec-instrument-otel` | **Zero exist in repo** |
| Alignment report | `docs/features/<feature>/ALIGNMENT-REPORT.md` | Agent (`domainspec-alignment-auditor`) | Manual invocation | None present |
| OBSERVABILITY-REPORT | `docs/features/<feature>/OBSERVABILITY-REPORT.md` | Agent (`domainspec-otel-verifier`) | Template at `templates/OBSERVABILITY-REPORT.md`; no instances | None present |
| PIPELINE-REPORT | `docs/features/<feature>/PIPELINE-REPORT.md` | Agent (`domainspec-reflect`) | Template at `templates/PIPELINE-REPORT.md`; no instances | None present |
| Pipeline signals stream | `docs/signals/pipeline-signals.jsonl` | Pipeline Step 10 (`domainspec-pipeline`) | Append-only emission | **`docs/signals/` directory does not exist** |
| TUNING-REPORT | `docs/signals/TUNING-REPORT.md` | `domainspec-reflect` skill | None | None present |
| Telemetry bundle / observer outputs | per `tools/build-telemetry-bundle.ts`, `tools/run-async-observer.ts`, `tools/run-fast-observer.ts` | Tools | Manual `tsc/node` invocation | Only one trace file: `internal_tools/visualizations/fractals/data/fractal-telemetry.jsonl` |
| Global registry & glossary | `docs/registry.md`, `docs/glossary.md` | Agent (`domainspec-registry-sync`) | Manual `domainspec-sync-registry` | Yes (also duplicated at `implementation/app-frontend/docs/{registry,glossary}.md`) |
| Infra IaC | `infra/Pulumi*`, `infra/docker-compose*` | Agent (`domainspec-infra-architect`) | Manual `domainspec-infra-architecture` | **`infra/` directory does not exist** |
| Prometheus / alerts / Caddy | `infra/monitoring/prometheus.yml`, `infra/monitoring/alerts/*.yml`, `infra/Caddyfile` | Agent (`domainspec-infra-architect` / `-infra-deploy`) | Manual `domainspec-infra-deploy` | None present |
| GitHub workflows | `.github/workflows/*.yml` | Agent (`domainspec-infra-architect`) | Manual or scaffolded | **None present** |
| Agent / skill packs (source) | `copilot/agents/*.agent.md`, `copilot/skills/*/SKILL.md` | Human | Manual edit | Yes |
| Agent / skill packs (workspace overlay) | `.github/agents/*.agent.md`, `.github/skills/*/SKILL.md`, `.github/get-shit-done/`, `.github/gsd-file-manifest.json` | Machine (`copilot/install.sh`) | `bash copilot/install.sh` | Yes (committed alongside source) |
| Plan / execution program | `plan/index.md`, `plan/{context,infra,harness,agentic,governance}/*.md`, `plan/TRACEABILITY.md`, `plan/SATURN-L-SYSTEM.md`, `plan/COMPLETENESS-DASHBOARD.md` | Human | Manual edit | Yes |
| Vault | `vault/{ontology,axiom,backlog,constitution,conceptual,...}/` | Human + agents (`close-session` skill) | Mixed manual + skill emission | Yes |
| Frontend implementation | `implementation/app-frontend/visualizations/app-release/{app,server,workspace-store}.mjs`, `lib/*.mjs`, `tests/*` | Human + agents | Manual; node_modules present | Yes (incl. `node_modules/` per find output) |

---

## Intent vs. Compiled Split Today

The repo *names* a split (AUTHORITY-MAP.md table, ARCHITECTURE.md “generated from docs”) but does not enforce it.

| Bucket | Examples (paths) | Marked as derived? | In CI? | Risk |
|---|---|---|---|---|
| **Hand-authored intent (root)** | `AUTHORITY-MAP.md`, `AXIOMS.md`, `CONSTITUTION.md`, `TAXONOMY.md`, `RELATIONSHIPS.md`, `ARCHITECTURE.md`, `OBSERVABILITY.md`, `TEST-PIPELINE.md`, `DRIFT-CONVERGENCE.md`, `GOVERNANCE-ATTENUATION.md`, `TUNING-LOOP.md`, `ADLC-ALIGNMENT.md`, `INFRA-SETUP.md`, `PHASED-PLAN.md`, `CHANGELOG.md`, `README.md` | N/A | No | Authoritative; safe |
| **Hand-authored intent (feature pack)** | `docs/features/payment-processing/{SPEC,domain,operations,states,interfaces,events,queries,mappings}.md` | No | No | Pack-canonical (per AUTHORITY-MAP.md §47) |
| **Hand-authored intent (plan)** | `plan/index.md`, `plan/VISION.md`, `plan/SATURN-L-SYSTEM.md`, `plan/TRACEABILITY.md`, `plan/COMPLETENESS-DASHBOARD.md`, `plan/{context,infra,harness,governance,agentic}/*.md` | No | No | Authoritative for current execution program |
| **Machine-derived (committed)** | `docs/features/payment-processing/_categorical/{L1,L2,delta}.json`, `extraction.log.md` | Only by directory name `_categorical` | No | No regen tool in `tools/`; orphan-prone |
| **Machine-derived (committed, agent pack overlay)** | `.github/agents/*.agent.md` (33 files), `.github/skills/*/` (90+ skill dirs), `.github/get-shit-done/`, `.github/gsd-file-manifest.json` (23,392 bytes), `.github/copilot-instructions.md`, `.github/instructions/` | Only by `<!-- managed by ... -->` comment in `copilot-instructions.md` | No drift detector | High — duplicates `copilot/agents/` and `copilot/skills/`; no sync check |
| **Machine-derived (uncommitted, ephemeral)** | `internal_tools/visualizations/fractals/data/fractal-telemetry.jsonl` | No | No | Single telemetry file accumulating in repo, no rotation |
| **Generated, declared but absent** | `infra/`, `.github/workflows/`, `docs/signals/pipeline-signals.jsonl`, `docs/signals/TUNING-REPORT.md`, all `*/observability.md`, all `*/ALIGNMENT-REPORT.md`, all `*/OBSERVABILITY-REPORT.md`, all `*/PIPELINE-REPORT.md` | N/A | N/A | Documented as part of pipeline; never produced or never committed |

The cleanest derived/intent boundary in the repo is the `_categorical/` subdirectory pattern — every other derivation either lives in the same directory as authored content with no marker, or doesn’t physically exist yet.

---

## CI/CD State Today

**There is no CI/CD pipeline configured in this repository.**

- `.github/workflows/` — directory **does not exist** (`find /Users/victorboscaro/domainspec/.github -name "*.yml"` returns zero results).
- `git log --oneline --all -- '.github/workflows/*'` returns zero commits — no workflow has ever existed in the repo history.
- `internal_tools/` contains only `visualizations/fractals/` (a runtime data artifact directory, not CI tooling).
- `tools/` contains 17 TypeScript and shell scripts (2,476 lines total) intended to be invoked by CI but currently invoked manually if at all:
  - `tools/analyze-signals.ts` — threshold check that `TUNING-LOOP.md` describes as the trigger for the (non-existent) tuning workflow.
  - `tools/validate-signals.ts`, `tools/validate-orphans.ts`, `tools/validate-doc-links.ts`, `tools/validate-governance-chain.ts`, `tools/validate-tuning-report.ts` — all five validators have zero CI consumers.
  - `tools/run-fast-observer.ts`, `tools/run-async-observer.ts`, `tools/build-telemetry-bundle.ts` — observer pattern from GOVERNANCE-ATTENUATION.md §1; no automation invokes them.
  - `tools/check_docs_sync.sh`, `tools/check_initiative_stale.sh` — bash scripts; no caller.
  - `tools/generate-registry.ts`, `tools/generate-meta-health.ts`, `tools/detect-signals.ts`, `tools/prune-governance.ts` — generators with no scheduled execution.
- `.git/hooks/` — contains only `*.sample` files; **zero active hooks**.
- `.githooks/pre-commit` — exists (13 lines, prettier-only); `git config core.hooksPath` returns empty, so it does not run. The commit `d232133` (“style: apply prettier formatting and add pre-commit hook”) added the file but `core.hooksPath` was apparently never set.
- `.github/PULL_REQUEST_TEMPLATE.md` exists (378 bytes) — the only PR-time governance artifact.

**Net:** zero things run on push, zero things run on PR, zero things run on schedule. Every governance check, derivation, and signal emission is manually triggered by a human invoking an agent in their IDE.

---

## Infra / Deploy State Today

**No infrastructure code exists in this repository.**

- `find . -maxdepth 3 -name "infra" -type d` returns only `plan/infra/` (which is **planning prose** — `INF-01-runtime-dispatch-gateway.md`, `INF-02-agent-telemetry-saturn.md`, `INF-02-aggregation-definitions.md`, `INF-02-dashboard-field-contract.md`, `INF-02-instrumentation-integration-plan.md`, `INF-02-telemetry-schema.md`, `INF-03-ci-governance-loop.md`, `INF-04-infra-security-baseline.md`, `INFRA-PRODUCT-OVERVIEW.md`).
- No `Dockerfile`, no `docker-compose.yml` outside `node_modules/`, no `Pulumi.yaml`, no `prometheus.yml`, no `Caddyfile`, no `alerts/` directory.
- `INFRA-SETUP.md` line 484 instructs the user: `git push main  # CI/CD deploys automatically`. There is nothing in the repo that would make that work.
- `INFRA-SETUP.md` references three secrets (`VPS_PROVIDER_TOKEN`, `CLOUDFLARE_API_TOKEN`, `PULUMI_ACCESS_TOKEN`) and one optional (`GH_PAT_AGENT`) for self-hosted runner. There is no consumer of these secrets in the repo.
- `INFRA-SETUP.md` references `infra/agent-runner-setup.sh` and `templates/agent-runner.md`. Only the template exists (`templates/agent-runner.md`); the script is not present.
- The `domainspec-infra-architecture` skill (`copilot/skills/domainspec-infra-architecture/SKILL.md`) explicitly *generates* `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, and `.github/workflows/domainspec-tuning.yml` (lines 76–88, 184–187) — but the skill has never been run against this repo.

**Current “deploy mechanism” for this repo:** none. There is no controller, no agent, no runner, no `git push main` trigger. The doc artifacts that govern future deploys exist; the artifacts that perform deploys do not.

The only **runnable** piece in `implementation/` is `implementation/app-frontend/visualizations/app-release/` — a Node.js app (`app.mjs`, `server.mjs`, `lib/*.mjs`, `package.json`, `node_modules/` present, 845 files in the subtree) launched manually from a developer machine. It has no Dockerfile, no deploy workflow, no published artifact.

---

## Agents → Controller Classification

Source: 17 agents in `copilot/agents/` (also mirrored in `.github/agents/`, plus 16 GSD agents in the overlay).

| Agent | Lines | Type of work | Classification | Notes |
|---|---|---|---|---|
| `domainspec-orchestrator` | 114 | Routes natural-language requests to other agents/skills | LLM-judgment | Pure routing; bot-PR pattern not natural fit — likely stays interactive |
| `domainspec-interviewer` | 138 | Greenfield/brownfield discovery interviews | LLM-judgment | Inherently interactive |
| `domainspec-planner` | 121 | Pipeline orchestration + clarifying questions | LLM-judgment | Wraps deterministic + LLM steps |
| `domainspec-spec-writer` | 67 | Drafts SPEC.md and aspect docs from interview output | LLM-judgment | Generative; bot-PR pattern viable |
| `domainspec-story-sync` | 52 | Generates STORIES.md from aspect docs | Mixed — derivable but ambiguity-prone | Could run as a CI bot-PR after SPEC change |
| `domainspec-test-designer` | 74 | Derives TEST-SPEC.md from aspect docs | Mixed | Derivation rules in TEST-PIPELINE.md are explicit; could be deterministic if rules are codified |
| `domainspec-implementer` | 41 | Writes backend TypeScript from TEST-SPEC | LLM-judgment | Code synthesis |
| `domainspec-task-executor` | 94 | Generic task runner | LLM-judgment | |
| `domainspec-ui-architect` | 138 | Defines UI-ARCHITECTURE constitution | LLM-judgment | One-time per project |
| `domainspec-otel-instrumenter` | 107 | Adds OTel calls to backend code at `@source` anchors | Mixed → mostly deterministic | YAML-driven; spec parsing + code edit |
| `domainspec-otel-verifier` | 155 | Verifies instrumentation coverage against observability spec | **Deterministic** | Pure spec-vs-code diff; can be a CI step |
| `domainspec-alignment-auditor` | 51 | Diffs SPEC concept tables vs implementation | **Deterministic** (per GOVERNANCE-ATTENUATION.md §2 hybrid detector) | Already a candidate for CI computation |
| `domainspec-layering-auditor` | 41 | Validates layer dependency rules from ARCHITECTURE.md | **Deterministic** | Static import-graph analysis |
| `domainspec-registry-sync` | 47 | Updates `docs/registry.md` and `docs/glossary.md` from SPEC tables | **Deterministic** | Pure derivation; bot-PR pattern fits |
| `domainspec-verifier` | 50 | Returns PASS/FLAG/BLOCK from artifact presence + test outcomes | **Deterministic** | Decision rules are explicit |
| `domainspec-infra-architect` | 95 | Scaffolds Pulumi/compose/CI/CD per preset | LLM-judgment (one-time) → emits deterministic artifacts | Bot-PR for changes after first run |
| `mars-researcher` | 69 | External research synthesis | LLM-judgment | Not part of GitOps reconciliation |

**Summary counts:** 5 deterministic (auditors, verifier, registry-sync, otel-verifier), 3 mixed/derivable (story-sync, test-designer, otel-instrumenter), 9 LLM-judgment.

The 5 deterministic agents are the natural “controllers” for a GitOps reconciliation loop. The 3 derivable agents would need their derivation rules extracted from prose (TEST-PIPELINE.md, OBSERVABILITY.md) into code before they could run as CI steps; today they remain LLM-driven.

---

## Governance Machinery

**Designed (in prose):**
- `domainspec-alignment-auditor` agent → produces `ALIGNMENT-REPORT.md` per feature.
- `domainspec-layering-auditor` agent → enforces ARCHITECTURE.md layer rules.
- `domainspec-verifier` agent → PASS/FLAG/BLOCK readiness verdict.
- `domainspec-reflect` skill → reads `docs/signals/pipeline-signals.jsonl` and produces `TUNING-REPORT.md`.
- `domainspec-signal-observer` skill (`copilot/skills/domainspec-signal-observer/SKILL.md`) — post-session read-only observer per GOVERNANCE-ATTENUATION.md §1 (dual-agent protocol).
- 11 signal types defined in `TUNING-LOOP.md` lines 152–164 (`step-verdict`, `alignment-gap`, `spec-gap`, `governance-gap`, `rework`, `overhead`, `decision`, `proposal`, `pattern`, `spec-compliance`, `agent-cost`).
- 10 thresholds (TH1–TH10) in `TUNING-LOOP.md` lines 188–199.
- Signal schema in `implementation/GOVERNANCE-SIGNALS.md` (245 lines) — IS-001 through IS-012 plus more.

**Invoked today:** all governance machinery is **manual-trigger only**. A human types `@domainspec-verifier domainspec-verify-feature <feature>` (or equivalent) into their IDE; nothing runs on push, PR, or schedule. The async tuning loop described in TUNING-LOOP.md as “Pipeline run → emit signals → git push → GitHub Action → analyze → Issue → reflect → TUNING-REPORT.md → human review” is broken at step 3: no GitHub Action exists, and `docs/signals/pipeline-signals.jsonl` does not exist either, so there are no signals to analyze.

**Signal emission today:** zero `docs/signals/` directory, zero `pipeline-signals.jsonl`, zero `TUNING-REPORT.md`. The only telemetry artifact in the repo is one file (`internal_tools/visualizations/fractals/data/fractal-telemetry.jsonl`) tied to a single visualization, not the pipeline.

**Detectors that exist as code (in `tools/`):** `analyze-signals.ts`, `detect-signals.ts`, `validate-signals.ts`, `validate-orphans.ts`, `validate-governance-chain.ts`, `validate-tuning-report.ts`, `validate-doc-links.ts`, `prune-governance.ts`, `generate-meta-health.ts`. None have a CI invoker; their existence in `tools/` is the closest the repo gets to “governance as code,” but they are inert without a runner.

---

## Brownfield Risk Surface

Specific paths where hand-edits could have drifted from generating intent:

1. **`.github/agents/` vs `copilot/agents/`** — duplicated pack. `copilot/install.sh` copies from `copilot/` to `.github/`. There is no checksum, no `--check` mode, no CI verification that `.github/agents/*.agent.md` matches `copilot/agents/*.agent.md`. Local hand-edits to `.github/agents/` would silently diverge. The current uncommitted change set on this branch (`copilot/agents/domainspec-orchestrator.agent.md` modified, `copilot/agents/domainspec-task-executor.agent.md` added) confirms editors do touch the `copilot/` source — but no automation refreshes `.github/`.

2. **`.github/skills/` (90+ entries)** vs `copilot/skills/` (30 entries) — the overlay contains roughly 3× more skill directories than the source pack. The extras come from GSD (`get-shit-done`) — installed by the same script, but with no manifest-vs-disk reconciliation tool committed.

3. **`.github/gsd-file-manifest.json`** (23,392 bytes) — a static manifest of installed GSD files, committed but with no validator that diffs it against on-disk reality.

4. **`docs/features/payment-processing/_categorical/`** — committed JSON outputs with no regenerator script in `tools/`. If the generating tool lives outside the repo or in a different branch, these files cannot be re-derived to detect drift.

5. **`docs/features/payment-processing/SPEC.md`** (62 lines) is far smaller than the example at `examples/payment-processing/SPEC.md` and the templates in `templates/SPEC.md`. The pack has 9 aspect files but no `TEST-SPEC.md`, no `STORIES.md`, no `observability.md`, no `ALIGNMENT-REPORT.md`, no `workflows.md` — meaning the pipeline either was not run end-to-end for this feature, or the generated artifacts were deleted and the spec was hand-trimmed afterwards. Either way, the SPEC is no longer evidence-backed by the rest of the pack.

6. **`implementation/app-frontend/`** — a 845-file Node.js subtree with its own `docs/`, `vault/`, `domain_knowledge/`, `visualizations/{app-release,ontology-visualization,fractals,newspaper}/`, and committed `node_modules/` (per the `find` output showing `playwright-core`, `chokidar` etc. inside `visualizations/*/node_modules/`). This is a brownfield app dropped under the framework repo with no clear authority chain — unclear if it consumes DomainSpec tooling, mirrors it, or is independent.

7. **`internal_tools/`** — single subdirectory `visualizations/fractals/data/` with a telemetry JSONL. Unclear ownership, unclear lifecycle.

8. **`vault/`** — mixed human + agent-emitted notes (`ontology-architecture-draft.md`, `confidence-levels.md`, `agent-navigation.md`, `human-navigation.md`, plus `axiom/`, `backlog/`, `conceptual/`, `constitution/`, `assets/`). Per `close-session` skill and `domainspec-signal-observer`, this is partially agent-written; no marker distinguishes which sections.

9. **Recent churn (per `git log --oneline -50`):** the active churn is in `plan/` (CTX-01, INF-02 task sessions, CTX-03 tracking, vision/pitch overviews), `vault/` (research notes), `copilot/agents/` (orchestrator + new task-executor), `docs/features/payment-processing/` (added on the current branch). The framework root docs are quieter (last `feat:` to a root governance file was `913ec3a feat: async signal-based tuning loop — v1.8.0`). The repo is in a phase of **planning expansion**, not **implementation closure** — which is itself a drift signal under DRIFT-CONVERGENCE.md’s “coordination drift” category.

10. **Stale documentation claim:** `TUNING-LOOP.md` line 426 says “Workflow deployed: `.github/workflows/domainspec-tuning.yml` ✅” and `ADLC-ALIGNMENT.md` G4 row marks the v1.8 tuning workflow as shipped. The workflow file is not in the repo. This is documentation drift from physical reality — exactly the failure mode GitOps would detect on PR.

---

## ADLC Gap Mapping (G1–G16 → GitOps Capabilities)

| Gap | Description | What GitOps would close | Status today |
|---|---|---|---|
| **G2** | Continuous tuning outer loop | Reconciliation controller polls signal stream, opens proposal PRs from `TUNING-REPORT.md` | Signal infra ✅ in code (`tools/analyze-signals.ts`); cloud agent ❌; signal stream file ❌ |
| **G4** | Automated governance / CI gates | PR-time + push-time workflows running auditors, verifier, validators, orphan checks | **Hard blocker today** — no `.github/workflows/`. ADLC-ALIGNMENT marks partial (v1.8 workflow stubbed); reality is zero workflows |
| **G5** | Human-on-the-Loop async review | Bot-PRs for low-risk derivations; human review queue for high-risk; both via PR mechanics | No bot-PR mechanism; all changes are interactive human commits |
| **G6** | Dynamic goals / re-derivation | Spec-amendment commits trigger downstream derivation jobs that open follow-up PRs | No trigger mechanism exists |
| **G7** | Economy of Action metrics | Metrics emitted by CI runs (tokens, agent calls, wall time per workflow) | Counters defined in `PIPELINE-REPORT.md`; emission not wired to CI |
| **G8** | Reflection / auto-tuning | `domainspec-reflect` runs on schedule from CI, opens PR with proposed skill/agent changes | Skill exists; no scheduler; no PR-opening permission flow |
| **G10** | Versioned agent artifacts | Tag releases of `.github/agents/` + `.github/skills/` bundles, pin per-feature artifacts to a tag | No versioning of the pack; `gsd-file-manifest.json` tracks files but not versions |
| **G11** | Code-to-spec `@biz`/`@sys` binding | Pre-commit / CI check that blocks orphan annotations | No annotations in code today; no checker wired |
| **G12** | Semantic knowledge graph | CI-generated `registry.json` artifact published per commit | `tools/generate-registry.ts` exists; not invoked |
| **G13** | Formal CONSTITUTION.md | CONSTITUTION present at root → CI validates every governance rule traces to an axiom | `CONSTITUTION.md` and `AXIOMS.md` exist; `tools/validate-governance-chain.ts` exists; not invoked |
| **G14** | AXIOMS.md epistemic layer | CI requires every L3 rule to reference an L4 axiom | Same status as G13 |
| **G15** | Meta-system health dashboard | CI generates `META-HEALTH.md` per pipeline run, publishes M-001..M-006 | `tools/generate-meta-health.ts` exists; not invoked; no `META-HEALTH.md` instances in repo |
| **G16** | L4→L3→L6 derivation chain traceability | Validator runs on every PR, blocks merge if chain is broken | `tools/validate-governance-chain.ts` exists; not invoked |

GitOps adoption would, in one stroke, take the 9 already-written validators in `tools/` and turn them from inert files into enforcement gates — closing the *structural* portion of G4, G11, G13, G14, G15, G16 and the CI-execution portion of G2, G7, G8.

---

## Bottom-Line Readiness Score

**Overall: LOW.**

| Dimension | Score | Justification |
|---|---|---|
| Intent layer (specs, governance, ontology) | **HIGH** | Authoritative root docs are present, AUTHORITY-MAP exists, AXIOMS/CONSTITUTION exist, signal schema exists, ADLC gap inventory exists. The semantic source of truth GitOps would reconcile against is largely in place. |
| Compiled artifact discipline | **LOW** | No `derived/` separation, no manifests, machine outputs (`_categorical/`, `.github/` overlay) live in same trees as authored content with no headers and no regeneration tool committed for some of them. |
| CI/CD plumbing | **VERY LOW** | Zero workflows. Zero active hooks. The pre-commit hook that exists is dead (`core.hooksPath` unset). The deploy story is a sentence in INFRA-SETUP.md with no implementation behind it. |
| Reconciliation controllers | **LOW** | 5 deterministic agents could become controllers, but none run automatically today. The 9 validator scripts in `tools/` are the closest thing to controllers and they are uninvoked. |
| Signal/feedback loop | **LOW** | Signal schema is rich; `docs/signals/` directory does not exist; pipeline Step 10 has nowhere to emit; tuning workflow referenced as ✅ does not exist on disk. |
| Versioning of agents/skills | **LOW** | Source pack and overlay coexist with no checksum/manifest validator; no semver tagging. |
| Documentation-vs-reality fidelity | **LOW** | At least one prominent claim (`.github/workflows/domainspec-tuning.yml` deployed) is false; `infra/` directory referenced throughout INFRA-SETUP.md is absent; observability artifacts referenced in OBSERVABILITY.md and feature templates have zero on-disk instances. |
| Brownfield risk | **MEDIUM-HIGH** | Duplicated agent/skill pack with no sync verifier, committed `node_modules/` in a frontend subtree, an unfinished payment-processing pack, and active churn concentrated in `plan/` rather than implementation. |

**One-paragraph justification.** DomainSpec has spent enormous effort on the *grammar* of a GitOps-shaped system — authority maps, drift definitions, signal schemas, threshold catalogs, gap inventories, controller classifications. It has invested almost no effort yet on the *runtime*: there are no CI workflows, no active hooks, no infra directory, no committed signal stream, no controllers wired to triggers, no checksum verification of the duplicated agent pack, no manifest separating derived from authored content, and no production deploy mechanism despite documentation that promises `git push main` deploys. The framework is GitOps-*ready in vocabulary* and GitOps-*absent in implementation*. Adopting GitOps here is less about choosing a tool and more about wiring the already-existing validators, agents, and signal definitions into the workflow/controller layer that the docs assume exists but the disk does not contain. Until that wiring is done, every governance claim in the repo is unverified by definition.
