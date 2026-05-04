---
tags: [subagents, dispatch-artifact, subagents-findings]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-02
dispatch_slug: curator-pipeline-wiring-2026-05-02
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `curator-pipeline-wiring-2026-05-02`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis cites a passage in `domainspec-subagents-research.md` per R17.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../../vault/constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

You have a domainspec-vault-metadata-curator agent (`.claude/agents/domainspec-vault-metadata-curator.agent.md`) and an edges skill (`.claude/skills/custom/edges.md`) that govern vault-document hygiene. The DomainSpec orchestrator (`.github/agents/domainspec-orchestrator.agent.md`) is a natural-language router with a guardrail forbidding non-DomainSpec routing. Three wiring options surfaced in chat — A) bootstrap-on-write (each vault-producing stage calls curator inline), B) promote curator to a `domainspec-vault-curate` skill + add a vault-hygiene intent class to the orchestrator, C) PR-gate audit via `.github/workflows/`. Before deciding, the parent dispatched three parallel research children to ground the decision in evidence rather than opinion.

## Goal

Produce three pieces of evidence so the parent can pick a wiring strategy: (1) the cheapest concrete insertion point per vault-producing DomainSpec stage, (2) the constitutional/naming cost of promoting the curator into the DomainSpec command surface, (3) CI feasibility plus the actual blast-radius of the OQ-1 skill-file endpoint problem.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Mode:** `task-fan-out` *(R19)*

**Strategist (parent):** main session — Opus 4.7, 1M context.

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `child-a-insertion-points` | sonnet-4.6 | Mechanical scan of 35 SKILL.md files for vault-write paths; pattern-matching, not synthesis | ~3500 | Vault-producing skills table (per stage: vault path, insertion site, line range, rationale) |
| `child-b-promotion-cost` | sonnet-4.6 | Read-and-diff against one orchestrator file + naming-tradeoff matrix; bounded surface | ~3000 | Three orchestrator diffs + one new SKILL.md draft + naming option matrix + cost verdict |
| `child-c-ci-and-oq1` | sonnet-4.6 | Two independent sweeps (CI infra inventory + cross-boundary edge enumeration); both mechanical | ~3500 | CI infra table + workflow sketch + cross-boundary edge table + sidestep verdict |

**Sequencing:** parallel set — all three children dispatched in a single message, no inter-child dependencies, no shared scratch space.

**Recursion budget actually used:** depth = 1 (no child recursed), breadth = 3 (this dispatch level), total agents = 3. Defaults per R13 (depth 2, breadth 5, total 10) — 3 of 10 used. No override.

**Working folder (R15, user-confirmed):** `.planning/research/curator-pipeline-wiring/` — outside `vault/`, compliant.

**User confirmation timestamp:** 2026-05-02 (this session).

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `child-a-insertion-points` | — | — | ~34,031 |
| `child-b-promotion-cost`   | — | — | ~33,808 |
| `child-c-ci-and-oq1`       | — | — | ~42,787 |
| **Sum**                     | — | — | ~110,626 |

> Per-direction token splits not surfaced by the dispatch runtime; only totals available. Recorded as such per R18 ("actual spend") rather than fabricated.

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1)        | Note |
|------------------|--------------------|------|
| Coverage         | `0.95` (judgment)  | All three Goal items addressed; the null result on Option A is itself coverage of the question, not a gap. |
| Independence     | `0.95` (judgment)  | Three children dispatched in parallel, no shared scratch, zero cross-references between returned reports. |
| Fidelity         | `0.95` (judgment)  | Each child grounded claims in concrete file paths and (for Child A) a verifying grep; Child C enumerated exact source/target paths per edge. |
| Cost discipline  | `0.10`             | Declared budget vs actual: ~10,000 budgeted / ~110,626 actual ≈ 11× overrun. Each child returned ~10× its declared envelope. Mechanical, not a judgment. |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

> **Cost-discipline note:** the 11× overrun is uniform across all three children, suggesting the budget was set unrealistically rather than that any single child misbehaved. Future dispatches at this complexity (file-walking + structured table return) should baseline at ~30–40k tokens per child, not 3–3.5k.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-subagents-research.md` (R17).

### F1 — Option A has zero applicable insertion sites as originally framed

- **Claim:** None of the 35 `domainspec-*` stage skills writes to `vault/**`; every captured output path lives under `docs/`, `.github/workflows/`, or `.planning/`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--insertion-point-scan-for-option-a-bootstrap-on-write) — verified by `grep -oE "(docs|vault|\.planning|\.github)/..."` across all SKILL.md files; the string `vault` does not appear in any `.github/skills/domainspec-*/` file.
- **Implication:** The parent's framing of Option A — "each vault-producing DomainSpec stage calls curator inline" — has no referent in the current codebase. To preserve the spirit of Option A, it must be redirected to the actual vault-producing skill family (`.claude/skills/domainspec-subagents-strategy/*`, `.claude/skills/close-session/*`), or the proposal must be rewritten as "re-scope DomainSpec stages to also emit vault artifacts" — a meaningful rewrite, not a one-line addition.

### F2 — Option B is mechanically cheap and respects the orchestrator's existing guardrails

- **Claim:** The orchestrator promotion is three small diffs (lines 75–82, 64–70, 85–89 of `domainspec-orchestrator.agent.md`) plus one new thin SKILL.md (`.github/skills/domainspec-vault-curate/SKILL.md`) following the established `agent:`-delegation pattern (identical shape to `domainspec-audit-alignment` → `domainspec-alignment-auditor`).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--promotion-cost-for-option-b-curator-as-domainspec--skill) — diffs 1–4 plus impact verdict ("Cost: low").
- **Implication:** Option B does not require renaming, removing, or reinterpreting any existing `domainspec-*` command, so the `<compatibility-guardrails>` clause holds verbatim; the only guardrail edit is a one-line clarification permitting *additions*. The recommended skill name is `domainspec-vault-curate` because it preserves a `domainspec-vault-*` namespace, matches the agent's own framing, and lets the three curator modes map naturally to a `<mode>` argument.

### F3 — Option C is blocked on infrastructure that does not exist in this repo

- **Claim:** There are no GitHub Actions workflows (`.github/workflows/` does not exist), no pre-commit framework, no husky/lefthook, and no headless invocation path for Claude Code subagents; the only existing hook is a single bash `prettier --write` script at `.githooks/pre-commit`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3, Part 1 — "Existing CI / hook infrastructure" table and "Headless invocation feasibility" paragraph](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping).
- **Implication:** The Actions YAML itself is trivial (~15 lines, zero conflicts). The load-bearing cost is standing up a headless Claude Code invocation: CLI flags, API key plumbing, tool-permission stubs, deterministic exit codes for BLOCK/WARN/NEEDS_HUMAN, and a Mode 2 path that does not call `AskUserQuestion`. Cost is **medium**, dominated entirely by the headless harness; if a non-Claude reimplementation of audit logic in plain Python/Node is acceptable, cost drops to low.

### F4 — OQ-1 is real, narrow, and silently regressed by `vault/**`-only scoping

- **Claim:** Three vault docs already declare edges into `.claude/skills/*` files (`operationalized-by`, `cites`, `proposes-edit`); restricting the curator to `vault/**` would silently drop these three user-authored edges rather than resolve OQ-1.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3, Part 2 — cross-boundary edges table and "Verdict" paragraph](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping). The three OQ-1 cases are: `vault/discovery/robot-talks-definitions/robot-talks.md → .claude/skills/robot-talks/SKILL.md`, `vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md → .claude/skills/custom/edges.md`, `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md → .claude/skills/custom/frontmatter.md`.
- **Implication:** OQ-1 must be resolved before the curator is *complete*, but it is not a hard blocker for a first wiring — provided the audit report explicitly lists "skipped: 3 cross-boundary targets in `.claude/skills/` pending OQ-1" rather than silently dropping them.

### F5 — A separate cross-repo / out-of-tree edge gap exists, distinct from OQ-1

- **Claim:** Eight additional edges point either to sibling projects via `file:///Users/victorboscaro/house_project/...`, to repo-escaping relative paths (`../../../CLAUDE.md`, `../../business-philosopher/...`), or to spec/thesis docs that do not appear to exist in the repo (`specs/ontology/.../robot-talks-discovery.md`, `docs/business-philosopher/.../tese-orquestracao-por-pulso.md`).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3, Part 2 — full cross-boundary edges table (rows 4–11) and the per-destination grouping](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping).
- **Implication:** This is a genuine ontology gap (cross-repo / dangling-target edges), not OQ-1. It should be filed as a separate open question — collapsing it into OQ-1 will produce a confused fix.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-subagents-research.md` (R17).

### T1 — The parent's premise for Option A was wrong

- **Held by parent (in the original three-options framing):** each `domainspec-*` stage produces vault docs, so Option A is "add an inline curator call to each vault-producing stage."
- **Reality in the codebase:** zero `domainspec-*` stages write to `vault/**`; the vault is populated by a separate skill family (`.claude/skills/domainspec-subagents-strategy/*`, `close-session`, etc.).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1 — empty vault-producing-skills table and "Architectural implication for the parent" paragraph](./domainspec-subagents-research.md#agent-1--insertion-point-scan-for-option-a-bootstrap-on-write).
- **Impact:** **High.** Option A as originally stated is null. It can only be salvaged by retargeting it from `.github/skills/domainspec-*/` to `.claude/skills/domainspec-subagents-strategy/*` and `close-session/*` — a different proposal in everything but name. The parent should either rewrite Option A against the correct skill family or drop it from the comparison.

### T2 — Option B is mechanically cheap but conceptually stretched

- **Mechanical surface (cheap):** three small diffs plus one thin SKILL.md, identical pattern to existing `agent:`-delegating skills, no renames, no broken commitments.
- **Conceptual surface (stretched):** the orchestrator's `<routing-policy>` clause currently treats "DomainSpec intent" as implicitly "project/feature workflow"; folding "vault knowledge-graph maintenance" under the same label is a taxonomy stretch named explicitly in the diff justification ("broadens the 'DomainSpec intent' definition so the vault skill stops being conceptually out of scope").
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2 — Diff 1 justification and "(iii) Impact verdict" paragraph](./domainspec-subagents-research.md#agent-2--promotion-cost-for-option-b-curator-as-domainspec--skill).
- **Impact:** **Medium.** The decision is not whether the diff fits — it does — but whether the orchestrator's intent taxonomy *should* include vault-graph maintenance at all. The agent argues it arguably should ("the vault is already a DomainSpec artifact since `vault/ontology-conventions.md` lives in this repo"), but this is the load-bearing judgment call, not the line-count.

### T3 — Option C's "PR-gate audit" sounds infrastructural but is actually a research project

- **Apparent cost:** ~15 lines of YAML in `.github/workflows/vault-audit.yml`; trivial.
- **Actual cost:** the curator is defined as a Claude Code subagent with `tools: [..., AskUserQuestion]`, Mode 1 explicitly calls `AskUserQuestion` (interactive-only), and the repo contains zero `claude` CLI invocations in any script or workflow — there is no demonstrated headless invocation path. The `run:` step in any sketched workflow is a placeholder that exits 1 today.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3, Part 1 — "Headless invocation feasibility" paragraph and the placeholder workflow YAML showing `echo "blocked: no headless invocation path"; exit 1`](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping).
- **Impact:** **High.** The headline cost (YAML lines) misrepresents the real cost (building a headless Claude Code harness or porting audit logic to plain Python/Node). Option C should not be selected on the assumption that "it's just a workflow file."

### T4 — `vault/**`-only scoping does not sidestep OQ-1; it hides it

- **Apparent fix:** scope curator to `vault/**`, and OQ-1 (vault docs pointing to `.claude/skills/*`) goes away.
- **Reality:** the operating set (which files the curator walks and edits) is already `vault/**`; what would actually need to change is the *edge-target validator* to ignore non-vault targets — and doing so silently drops three real user-authored edges using `operationalized-by`, `cites`, and `proposes-edit`, all of which the user clearly believes are valid graph relations.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3, Part 2 — "Verdict" paragraph and the three OQ-1-tagged rows in the cross-boundary table](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping).
- **Impact:** **Medium.** Acceptable as a *deferred*-OQ-1 path provided the audit report explicitly lists the skipped edges; unacceptable if "scoped to vault/**" is interpreted as silently filtering them out. The wording of the curator's audit report matters more than the scoping rule itself.

### Cross-cutting observations

- **Two of the three options are not what they appear to be.** Option A is a null set against the codebase ([§Agent 1](./domainspec-subagents-research.md#agent-1--insertion-point-scan-for-option-a-bootstrap-on-write)); Option C's headline cost is wrong by an order of magnitude ([§Agent 3, Part 1](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping)). Only Option B's framing survived contact with evidence intact ([§Agent 2](./domainspec-subagents-research.md#agent-2--promotion-cost-for-option-b-curator-as-domainspec--skill)). This is a strong reframing signal: the parent's three-options enumeration was not a balanced trilemma — it was one viable option, one rewrite-disguised-as-an-edit, and one infrastructure-research-project disguised as a YAML file.

- **OQ-1 is narrower than it sounded.** Three concrete vault → skill-file edges exist today ([§Agent 3, Part 2](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping)). That is a tractable surface — name three edge types as legitimately cross-boundary, or define a `cross-boundary` edge category — not an architectural rewrite. The conflation of OQ-1 with the eight cross-repo / out-of-tree edges (F5) was making it look bigger than it is.

- **The wiring decision and the OQ-1 decision are separable.** Option B can ship with `vault/**` scoping and a "skipped: N cross-boundary edges pending OQ-1" line in the audit report, deferring the OQ-1 resolution to a separate dispatch without blocking the wiring. ([§Agent 3, Part 2 — "partial sidestep" verdict.](./domainspec-subagents-research.md#agent-3--ci-feasibility-for-option-c-and-oq-1-surface-mapping))

- **Decisive read for the parent:** Option B is the only proposal that survives intact, costs little mechanically, and does not depend on infrastructure that has to be built first. The conceptual stretch in T2 is the single judgment call to surface to the user; everything else is decided by the evidence.
