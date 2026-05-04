---
tags: [subagents, dispatch-artifact, subagents-research]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: curator-pipeline-wiring-2026-05-02
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `curator-pipeline-wiring-2026-05-02`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.

---

## Context

You have a domainspec-vault-metadata-curator agent (`.claude/agents/domainspec-vault-metadata-curator.agent.md`) and an edges skill (`.claude/skills/custom/edges.md`) that govern vault-document hygiene. The DomainSpec orchestrator (`.github/agents/domainspec-orchestrator.agent.md`) is a natural-language router with a guardrail forbidding non-DomainSpec routing. Three wiring options surfaced in chat — A) bootstrap-on-write (each vault-producing stage calls curator inline), B) promote curator to a `domainspec-vault-curate` skill + add a vault-hygiene intent class to the orchestrator, C) PR-gate audit via `.github/workflows/`. Before deciding, the parent dispatched three parallel research children to ground the decision in evidence rather than opinion.

## Goal

Produce three pieces of evidence so the parent can pick a wiring strategy: (1) the cheapest concrete insertion point per vault-producing DomainSpec stage, (2) the constitutional/naming cost of promoting the curator into the DomainSpec command surface, (3) CI feasibility plus the actual blast-radius of the OQ-1 skill-file endpoint problem.

---

## Agent 1 — Insertion-point scan for Option A (bootstrap-on-write)

```
Confirmed. None of the DomainSpec stage skills produce vault docs. Returning the verbatim output shape:

## Vault-producing DomainSpec skills

| Skill | Vault path(s) it writes | Recommended insertion site (file + section/heading) | Proposed insertion line(s) | Rationale (1 line) |
|-------|-------------------------|-----------------------------------------------------|----------------------------|---------------------|
| _(none)_ | — | — | — | No DomainSpec stage skill writes to `vault/**`. |

## Skills that produce no vault docs

- `domainspec-audit-alignment` — writes `docs/features/{feature}/ALIGNMENT-REPORT.md` only
- `domainspec-audit-layering` — writes `docs/features/{feature}/LAYERING-ALIGNMENT-{REPORT,PLAN}.md`
- `domainspec-brownfield-translation` — writes `docs/BROWNFIELD-*.md`, `docs/ONTOLOGY-GAPS.md`, etc.
- `domainspec-decision-gate` — writes `docs/features/{feature}/DECISIONS.md` and PILOT-* artifacts
- `domainspec-definitions-governance` — output-contract returns chat summary; no file writes outside `docs/`
- `domainspec-emit-signals` — appends `docs/signals/pipeline-signals.json`
- `domainspec-execute-phase-bridge` — writes `docs/features/{feature}/SPEC.md`, `TEST-SPEC.md`
- `domainspec-generate-tests` — writes `docs/features/{feature}/TEST-SPEC.md`
- `domainspec-help` — read-only (lists `docs/*` references but emits chat output)
- `domainspec-implement` — writes code + `docs/features/{feature}/*` reports
- `domainspec-infra-architecture` — writes `docs/INFRA-ARCHITECTURE.md`, `docs/slos.md`, `.github/workflows/*.yml`
- `domainspec-infra-deploy` — writes `docs/features/{feature}/observability.md`, `.github/workflows/ci.yml`
- `domainspec-init` — writes `docs/INITIAL-DEFINITIONS.md`, `docs/PROJECT-*.md`, `docs/glossary.md`, `docs/registry.md`
- `domainspec-instrument-otel` — writes `docs/features/{feature}/OBSERVABILITY-REPORT.md`, `observability.md`
- `domainspec-interview-scope` — writes `docs/EXPERIMENT-CANDIDATES.md`, `docs/HYPOTHESES.md`, etc.
- `domainspec-orchestrate` — writes `docs/features/{feature}/WORK-PACK.md`
- `domainspec-otel-verify` — writes `docs/features/{feature}/OBSERVABILITY-REPORT.md`
- `domainspec-pilot-readiness` — writes `docs/features/{feature}/PILOT-DECISIONS.md`, `SPEC.md`, `TEST-SPEC.md`
- `domainspec-pipeline` — orchestrates other skills; outputs land in `docs/features/{feature}/PIPELINE-REPORT.md`
- `domainspec-plan-phase-bridge` — writes `docs/features/{feature}/SPEC.md` and alignment reports
- `domainspec-readiness-gate` — writes `docs/features/{feature}/{ALIGNMENT-REPORT,DECISIONS,WORK-PACK}.md`
- `domainspec-reflect` — writes `docs/signals/TUNING-REPORT.md`
- `domainspec-signal-observer` — appends `docs/signals/pipeline-signals.json`
- `domainspec-spec-feature` — writes `docs/features/{feature}/SPEC.md` (path inferred via delegated definitions-governance)
- `domainspec-start` — writes `docs/INITIAL-DEFINITIONS.md`, `docs/HYPOTHESES.md`, etc.
- `domainspec-sync-registry` — writes `docs/glossary.md`, `docs/registry.md`
- `domainspec-sync-user-stories` — writes `docs/features/{feature}/STORIES.md`, `docs/index/features-index.json`
- `domainspec-task-session` — writes implementation code + `WORK-PACK.md`; no vault output
- `domainspec-ui-architecture` — writes `docs/UI-ARCHITECTURE.md`
- `domainspec-ui-audit-bridge` — writes `docs/features/{feature}/UI-REVIEW.md`
- `domainspec-ui-implement` — writes frontend code + `docs/features/{feature}/UI-SPEC.md` references
- `domainspec-ui-phase-bridge` — writes `docs/features/{feature}/UI-SPEC.md`
- `domainspec-ui-pipeline` — orchestrates UI skills; outputs in `docs/features/{feature}/`
- `domainspec-verify-feature` — writes `docs/features/{feature}/ALIGNMENT-REPORT.md`
- `domainspec-verify-phase-bridge` — writes `docs/features/{feature}/{ALIGNMENT-REPORT,LAYERING-ALIGNMENT-*,SPEC,TEST-SPEC}.md`

## Edge cases / uncertainty

- None. Verified by `grep -oE "(docs|vault|\.planning|\.github)/..." ` across all 35 SKILL.md files: every captured output path lives under `docs/`, `.github/workflows/`, or `.planning/`. The string `vault` does not appear in any `.github/skills/domainspec-*/` file.
- Architectural implication for the parent: Option A (bootstrap-on-write inline insertion into DomainSpec stage skills) has **zero applicable insertion sites** in the current codebase. The vault is populated by a separate skill family (`.claude/skills/domainspec-subagents-strategy`, `close-session`, etc.), not by `.github/skills/domainspec-*/`. If Option A is to apply at all, the DomainSpec skills would first need to be re-scoped to emit vault artifacts — that is a meaningful rewrite, not a one-line addition.
```

---

## Agent 2 — Promotion cost for Option B (curator as `domainspec-*` skill)

```
I have enough. Returning the requested findings verbatim.

## (i) Orchestrator edits required

### Diff 1 — `.github/agents/domainspec-orchestrator.agent.md:75-82` — extend `<routing-policy>` clause 3 with vault intent
**Current:**
```
3. Route DomainSpec intents only to DomainSpec skills:
   - project kickoff, baseline, or scope gating -> `domainspec-start`
   - docs bootstrap -> `domainspec-init`
   - full feature delivery -> `domainspec-pipeline <feature>`
   - command guidance -> `domainspec-help`
   - explicit stage intent -> the matching specialist command
```
**Proposed:**
```
3. Route DomainSpec intents only to DomainSpec skills. DomainSpec intents include both project/feature workflows and vault knowledge-graph maintenance:
   - project kickoff, baseline, or scope gating -> `domainspec-start`
   - docs bootstrap -> `domainspec-init`
   - full feature delivery -> `domainspec-pipeline <feature>`
   - command guidance -> `domainspec-help`
   - vault metadata bootstrap / audit / repair -> `domainspec-vault-curate <mode> <target>`
   - explicit stage intent -> the matching specialist command
```
**Why:** Adds the new route inline and, in one phrase, broadens the "DomainSpec intent" definition so the vault skill stops being conceptually out of scope. No existing line is renamed or removed.

### Diff 2 — `.github/agents/domainspec-orchestrator.agent.md:64-70` — add curator + vault skills to required reading
**Current:**
```
<context>
Read first:
- `domainspec/CHANGELOG.md`
- `domainspec/README.md`
- `domainspec/copilot/README.md`
- command skills under `.github/skills/domainspec-*/SKILL.md`
</context>
```
**Proposed:**
```
<context>
Read first:
- `domainspec/CHANGELOG.md`
- `domainspec/README.md`
- `domainspec/copilot/README.md`
- command skills under `.github/skills/domainspec-*/SKILL.md`
- `vault/ontology-conventions.md` (only when classifying a vault-curation intent)
</context>
```
**Why:** Without this, the orchestrator has no signal that a "vault" surface even exists when matching natural-language phrases like "audit my vault metadata" — the lazy load keeps cost off the project-workflow hot path.

### Diff 3 — `.github/agents/domainspec-orchestrator.agent.md:85-89` — clarify guardrail without changing its commitments
**Current:**
```
<compatibility-guardrails>
- Keep all existing `domainspec-*` commands callable.
- Do not rename, remove, or reinterpret existing commands.
- Keep GSD behavior unchanged: do not route to `gsd-*` unless the user explicitly asks for GSD.
</compatibility-guardrails>
```
**Proposed:**
```
<compatibility-guardrails>
- Keep all existing `domainspec-*` commands callable.
- Do not rename, remove, or reinterpret existing commands. Adding a new `domainspec-*` command (e.g. `domainspec-vault-curate`) is permitted as long as no existing command is altered.
- Keep GSD behavior unchanged: do not route to `gsd-*` unless the user explicitly asks for GSD.
</compatibility-guardrails>
```
**Why:** The current text is silent on additions, which is technically fine but invites future-author confusion about whether new `domainspec-*` skills violate the guardrail. One-line clarification, zero behavior change.

### Diff 4 — new file `.github/skills/domainspec-vault-curate/SKILL.md` — thin wrapper that delegates to the existing agent
**Current:** (file does not exist)
**Proposed:**
```
---
name: domainspec-vault-curate
description: Curate vault metadata — bootstrap a new file, audit a file/folder read-only, or repair mechanical violations. Delegates to domainspec-vault-metadata-curator agent.
argument-hint: "<bootstrap|audit|repair> <file|folder>"
agent: domainspec-vault-metadata-curator
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Skill, TodoWrite, AskUserQuestion
---

<objective>
Keep vault frontmatter and `## Connections` blocks legal, complete, and bidirectional by routing to the curator agent in the requested mode.
</objective>

<context>
Inputs:
- `<mode>`: one of `bootstrap`, `audit`, `repair`
- `<target>`: path to a vault file or folder under `vault/`
Required reading lives in `.claude/skills/custom/edges.md`, `.claude/skills/custom/frontmatter.md`, `.claude/skills/custom/frontmatter-semantics.md`, and `vault/ontology-conventions.md`. The agent loads these itself.
</context>

<process>
1. Validate `<mode>` is one of bootstrap | audit | repair; otherwise BLOCK and ask.
2. Validate `<target>` exists under `vault/`; otherwise BLOCK.
3. Invoke the `domainspec-vault-metadata-curator` agent with `<mode> <target>`.
4. Return the agent's report verbatim (audit file path + counts, or list of touched files for bootstrap).
</process>
```
**Why:** Matches the established pattern (`agent:` field pointing at the existing agent — same pattern as `domainspec-audit-alignment` -> `domainspec-alignment-auditor`). The three modes from the curator become the `<mode>` argument, so user phrasing maps cleanly.

## (ii) Naming options for the new skill

| Candidate name | Reads as user NL | Pros | Cons |
|----------------|------------------|------|------|
| `domainspec-vault-curate` | "domainspec, vault-curate audit vault/discovery/" | Verb-led; "curate" matches the agent's own self-description; leaves room for `domainspec-vault-*` siblings (lint, query, etc.) | "Curate" is slightly abstract for first-time users; adds a two-segment subnamespace |
| `domainspec-vault-audit` | "audit my vault metadata" | Highest NL recall — "audit" is the verb users actually type | Misleading: skill also bootstraps and repairs, not just audits; would force a rename later |
| `domainspec-metadata` | "fix the metadata" | Short; matches the agent name (`domainspec-vault-metadata-curator`) | Loses the "vault" scoping — a project may later have feature-doc metadata too, collision risk |
| `domainspec-curator` | "run the curator" | Mirrors agent name 1:1 | Generic; "curator" gives no hint it touches vault frontmatter; weak NL match |
| `domainspec-vault` | "domainspec vault audit ..." | Cleanest namespace anchor; mode is just an arg | Too broad — implies it owns all vault operations, blocks future `domainspec-vault-query` etc. unless this becomes a router |

**Recommendation:** `domainspec-vault-curate` — preserves a `domainspec-vault-*` namespace for future siblings, the verb matches the agent's own framing, and the three modes fit naturally as the `<mode>` argument.

## (iii) Impact verdict

**Cost:** low

**Reasoning (3-5 sentences):** The mechanical surface is tiny — three small edits in one orchestrator file plus one new SKILL.md that follows the existing `agent:`-delegation pattern (identical shape to `domainspec-audit-alignment`). No existing `domainspec-*` command is renamed, removed, or reinterpreted, so the `<compatibility-guardrails>` commitment holds verbatim; the only guardrail edit is a clarifying sentence about additions being allowed. The real (non-mechanical) cost is conceptual: "DomainSpec intent" was implicitly "project/feature workflow," and folding vault-graph maintenance under that label stretches the taxonomy — but it's a one-clause stretch, not a rewrite, and arguably the vault is already a DomainSpec artifact since `vault/ontology-conventions.md` lives in this repo. Naming is mildly bikesheddy but converges quickly once you commit to a `domainspec-vault-*` subnamespace. No downstream skills, agents, or CHANGELOG entries break; the curator agent itself needs zero changes since the SKILL.md is a thin invoker.
```

---

## Agent 3 — CI feasibility for Option C and OQ-1 surface mapping

```
Now I have clean cross-boundary data. Returning final report.

## Part 1 — CI feasibility for Option C

### Existing CI / hook infrastructure

| Type | Present? | Path | Notes |
|------|----------|------|-------|
| GitHub Actions workflows | no | `/Users/victorboscaro/domainspec/.github/workflows/` does not exist | `.github/` exists with `agents/`, `instructions/`, `skills/`, `copilot-instructions.md`, `PULL_REQUEST_TEMPLATE.md` — used for Copilot, not Actions |
| pre-commit (Python framework) | no | — | no `.pre-commit-config.yaml` |
| husky | no | — | no `.husky/` |
| lefthook | no | — | no `lefthook.yml` |
| Makefile / package.json scripts | partial | `/Users/victorboscaro/domainspec/package.json` | only `build`, `check`, `dev`, `dev:backend`, `dev:web` — no `lint`, `ci`, `audit` targets; no Makefile |
| Other (CircleCI, GitLab, etc.) | no | — | no `.circleci/`, no `.gitlab-ci.yml` |
| Custom git hook | yes | `/Users/victorboscaro/domainspec/.githooks/pre-commit` | single bash script that runs `prettier --write` on staged `.md/.json/.yml/.ts/...` files; not wired to any audit logic |

### Headless invocation feasibility

The curator at `/Users/victorboscaro/domainspec/.claude/agents/domainspec-vault-metadata-curator.agent.md` is a Claude Code subagent definition (frontmatter `name`, `description`, `tools: [Bash, Read, Edit, Write, Glob, Grep, Skill, TodoWrite, AskUserQuestion]`). It is invoked by Claude Code dispatching the agent inside an interactive session — there is no CLI entrypoint, no script wrapper, no `runtime: ...` field. Mode 1 (`bootstrap`) explicitly uses `AskUserQuestion`, which is interactive-only; Mode 2 (`audit`) is read-only and *could* in principle be driven headlessly via `claude` CLI if a non-interactive harness existed, but no such harness is configured in this repo (no `claude` invocations in any script, no `package.json` task, no GitHub Action wiring). So today: **the curator cannot run in CI without first standing up a headless Claude Code invocation path**.

### Minimum viable workflow sketch

Honest answer: **blocked by headless-invocation**. A `.github/workflows/vault-audit.yml` can be sketched as:

```yaml
name: vault-audit
on:
  pull_request:
    paths: ['vault/**']
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run vault metadata curator (audit mode)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # PLACEHOLDER — no headless Claude Code entrypoint exists today.
          # Would need: `claude --agent domainspec-vault-metadata-curator --mode audit vault/` or equivalent.
          echo "blocked: no headless invocation path"
          exit 1
      - name: Upload audit report
        if: always()
        uses: actions/upload-artifact@v4
        with: { name: vault-audit, path: vault/_audits/ }
```

The path-filter, runner, secret wiring, and artifact upload are all trivial. The `run:` step is the load-bearing gap: the curator is defined as a Claude Code subagent, and there is no demonstrated way in this repo to invoke a Claude Code subagent from a non-interactive shell.

### Estimated build cost

**Cost:** medium. The Actions YAML itself is ~15 lines and the repo has zero existing Actions to conflict with — that's low. But standing up a headless Claude Code invocation (CLI flags, API key plumbing, tool-permission stubs, deterministic exit codes for BLOCK/WARN/NEEDS_HUMAN, and a Mode 2 path that doesn't call `AskUserQuestion`) is real engineering and is the actual cost driver. If a non-Claude reimplementation of the audit logic in plain Python/Node is acceptable, cost drops back to low.

## Part 2 — OQ-1 surface mapping

### Cross-boundary edges (vault → outside vault)

Total cross-boundary targets found: **11** (out of 161 total edge rows across 35 vault files with `## Connections` blocks).

| Source vault file | Target path (non-vault) | Edge name | Likely intent (1 line) |
|-------------------|--------------------------|-----------|-------------------------|
| `vault/discovery/robot-talks-definitions/robot-talks.md` | `.claude/skills/robot-talks/SKILL.md` | `operationalized-by` | concept points to the skill that runs it — **directly OQ-1** |
| `vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md` | `.claude/skills/custom/edges.md` | `cites` | research cites the edge-catalog skill — **directly OQ-1** |
| `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md` | `.claude/skills/custom/frontmatter.md` | `proposes-edit` | research proposes an edit to a skill — **directly OQ-1** |
| `vault/premise/robot-talks-premises.md` | `specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md` | `grounded-by` | grounding to an out-of-tree spec doc (path doesn't appear to exist in repo) |
| `vault/premise/robot-talks-premises.md` | `docs/business-philosopher/assuntos/orquestracao-multi-agente/tese-orquestracao-por-pulso.md` | `instantiates` | instantiation of an out-of-tree thesis doc (path doesn't appear to exist) |
| `vault/conceptual/epistemic-principles.md` | `file:///Users/victorboscaro/house_project/docs/vault/ontology-conventions.md` | `contextualizes` | absolute `file://` URL pointing to a sibling project |
| `vault/conceptual/epistemic-principles.md` | `file:///Users/victorboscaro/house_project/docs/vault/conceptual/event-system-foundations.md` | `contextualizes` | absolute `file://` URL to sibling project |
| `vault/conceptual/epistemic-principles.md` | `file:///Users/victorboscaro/house_project/docs/vault/ontology-architecture-draft.md` | `contextualizes` | absolute `file://` URL to sibling project |
| `vault/constitution/robot-talks-constitution.md` | `../../../specs/...robot-talks-discovery.md` (resolves outside repo: `/Users/victorboscaro/specs/...`) | `grounded-by` | likely a stale path — escapes the repo root |
| `vault/constitution/robot-talks-constitution.md` | `../../../CLAUDE.md` (resolves to `/Users/victorboscaro/CLAUDE.md`, outside repo) | `integrated-into` | likely stale — escapes repo root |
| `vault/constitution/robot-talks-constitution.md` | `../../business-philosopher/.../tese-orquestracao-por-pulso.md` (resolves to `business-philosopher/...`, no such dir in repo) | `instantiates` | stale or out-of-repo |

Note: many additional rows in `vault/constitution/domain-tagging-constitution.md` use bare paths like `docs/vault/dictionary-business.md` that resolve under cwd to non-existent files — these are likely **broken paths**, not legitimate cross-boundary intent. The parser counts them as "outside vault" only when resolution lands outside `vault/`; for `domain-tagging-constitution.md` they resolve to `vault/constitution/specs/...` and `vault/constitution/docs/...` (stay nominally under vault, but point to nothing). They register as path-validity bugs, not true cross-boundary edges, so I excluded them from the count above.

### Grouping by destination directory

| Destination prefix | Count | Examples |
|--------------------|-------|----------|
| `.claude/skills/...` | 3 | `.claude/skills/robot-talks/SKILL.md`, `.claude/skills/custom/edges.md`, `.claude/skills/custom/frontmatter.md` |
| `specs/ontology/...` | 2 | `specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md` (relative & deep-relative both point here) |
| `docs/business-philosopher/...` | 1 | thesis doc |
| `business-philosopher/...` (escapes repo) | 1 | same thesis doc, deeper relative path |
| `file:///.../house_project/...` (sibling project) | 3 | three `epistemic-principles.md` rows |
| `/Users/victorboscaro/CLAUDE.md` (outside repo) | 1 | `robot-talks-constitution.md` → home-dir CLAUDE.md |

### Verdict — does `vault/**`-only scoping sidestep OQ-1?

**Verdict:** partial sidestep.

**Reasoning:** Restricting the curator to `vault/**` as the *operating set* (which files it walks and edits) is already what the agent does — that doesn't change the problem. The real question is whether the curator can be told to **ignore edges whose targets fall outside `vault/`**, and the data says: doing so would silently drop 11 real edge rows authored by the user, including 3 that are *exactly* the OQ-1 case (vault docs declaring `operationalized-by` / `cites` / `proposes-edit` into `.claude/skills/`). Two of those three use edges (`operationalized-by`, `cites`, `proposes-edit`) that the user clearly believes are valid graph relations — refusing to validate them is a regression in coverage, not a sidestep. Additionally, `vault/conceptual/epistemic-principles.md` and `vault/constitution/robot-talks-constitution.md` carry cross-repo and outside-repo targets (`file://...house_project/...`, `/Users/victorboscaro/CLAUDE.md`) that are a separate genuine ontology gap (cross-repo edges), not OQ-1. So `vault/**`-only scoping defers OQ-1 at the cost of leaving 3 user-authored skill-pointing edges silently un-audited; OQ-1 still has to be resolved before the curator is *complete*, but it is not a hard blocker for a first wiring if the report explicitly lists "skipped: 3 cross-boundary targets in `.claude/skills/` pending OQ-1."

Relevant files:
- `/Users/victorboscaro/domainspec/.github/workflows/` — does not exist
- `/Users/victorboscaro/domainspec/.githooks/pre-commit` — only existing hook (prettier)
- `/Users/victorboscaro/domainspec/package.json` — no CI scripts
- `/Users/victorboscaro/domainspec/.claude/agents/domainspec-vault-metadata-curator.agent.md` — interactive subagent, no headless entrypoint
- 3 OQ-1-relevant vault files: `vault/discovery/robot-talks-definitions/robot-talks.md`, `vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md`, `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md`
```
