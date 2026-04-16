---
name: domainspec-reflect
description: "Generate a TUNING-REPORT.md from accumulated pipeline signals. Detects cross-run patterns, computes aggregate metrics, and proposes skill/agent improvements. Runs async (GitHub Action) or manually."
argument-hint: "<feature-name | --all> [--from-signals] [--since <date>] [--min-signals <n>] [--dry-run]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, Task
---

<objective>
Analyze accumulated pipeline signals across multiple runs to:
1. **Detect patterns** — recurring governance gaps, repeated rework, persistent spec gaps, low-confidence decisions.
2. **Compute aggregate metrics** — overhead trends, rework hotspots, coverage evolution.
3. **Propose tuning** — concrete, evidence-backed changes to skills, agents, templates, or instructions.
4. **Track progress** — compare current signal patterns against previous tuning reports.

This skill is the **outer loop** of the DomainSpec learning system. It transforms raw observations into structural improvements.
</objective>

<flags>
- `--from-signals`: Read from `docs/signals/pipeline-signals.jsonl` (default).
- `--all`: Analyze signals across all features (default when run from CI).
- `--since <date>`: Only analyze signals after this ISO date.
- `--min-signals <n>`: Minimum signal count required before producing a report (default: 10).
- `--dry-run`: Show what analysis would be performed without writing output.
</flags>

<context>
**Input:** `docs/signals/pipeline-signals.jsonl` — append-only JSONL with structured observations from pipeline runs.
**Schema:** `domainspec/templates/SIGNAL-SCHEMA.md` — defines signal types, envelopes, and threshold definitions.
**Output:** `docs/signals/TUNING-REPORT.md` — analysis report with proposals.
**Template:** `domainspec/templates/PIPELINE-REPORT.md` — format reference for the report.

This skill runs **asynchronously** — either triggered by GitHub Action when signal thresholds are met, or manually invoked for retrospective analysis. It is NOT part of the pipeline's synchronous flow.
</context>

<process>

## Step 1 — Load and Parse Signals

1. Read `docs/signals/pipeline-signals.jsonl`.
2. Parse each line as JSON, validate against the signal envelope schema.
3. Apply `--since` filter if provided.
4. If signal count < `--min-signals`, return "Insufficient signals for analysis (have {n}, need {min})". Do not produce a report.
5. Group signals by: feature, type, session, severity.

## Step 2 — Cross-Run Pattern Detection

6. **Recurring governance gaps:** Group `governance-gap` signals by `data.description` similarity (fuzzy match on description, exact match on `shouldHaveBeenCaughtBy`). If same gap appears in 3+ signals → threshold TH1 met.
7. **Persistent spec gaps:** Group `spec-gap` signals by `data.missingDetail` pattern across features. If same pattern in 2+ features → threshold TH3 met.
8. **Rework hotspots:** Group `rework` signals by `data.stepName`. If same step has rework in 5+ signals → threshold TH4 met.
9. **Overhead trends:** Extract `overhead` signals, compute rolling average of `overheadRatio`. If > 0.5 for last 3 runs → threshold TH2 met.
10. **Proposal clustering:** Group `proposal` signals by `data.targetFile`. If 3+ proposals target same file → threshold TH5 met.
11. **Alignment drift:** Count `alignment-gap` signals across last 5 runs. If > 10 → threshold TH6 met.
12. **Critical gaps:** Any `governance-gap` with severity CRITICAL → threshold TH7 met (immediate).
13. **Decision uncertainty:** Group `decision` signals with `confidence: low`. If 3+ low-confidence decisions → threshold TH8 met.

## Step 3 — Compute Aggregate Metrics

14. **Economy of Action trends:**
    - Average overhead ratio across all runs.
    - Total agent delegations, human questions, retries.
    - Rework rate: rework signals ÷ total step-verdict signals.
    - Discovery efficiency: average context files read per run.
15. **Quality trends:**
    - Alignment gap rate: gaps ÷ runs.
    - Spec gap rate: gaps ÷ runs.
    - First-pass success rate: steps with 0 retries ÷ total steps.
16. **Governance effectiveness:**
    - Governance gaps detected vs. addressed (compare against previous tuning reports).
    - Time from governance-gap signal to skill update (if trackable from git history).

## Step 4 — Generate Tuning Proposals

17. For each threshold met, generate a concrete proposal:
    - **TH1 (recurring governance gap):** Propose specific skill update with the evidence chain (3+ occurrences, affected features, root cause pattern).
    - **TH2 (high overhead):** Analyze which governance artifacts contributed most. Propose simplification or consolidation.
    - **TH3 (persistent spec gap):** Propose template addition or enhancement to prevent the gap.
    - **TH4 (rework hotspot):** Propose skill hardening — add validation, better context gathering, or error handling to the affected step.
    - **TH5 (proposal cluster):** Bundle clustered proposals into a single coherent change.
    - **TH6 (alignment drift):** Recommend full cross-feature alignment audit.
    - **TH7 (critical gap):** Immediate action required — propose PR with fix.
    - **TH8 (decision uncertainty):** Flag ambiguous domain areas for human clarification.

18. Each proposal must include:
    - **Evidence:** Signal IDs, dates, features, counts.
    - **Target:** Exact file path(s) to modify.
    - **Change:** What to add/modify/remove.
    - **Rationale:** Why this change would prevent the observed signals.
    - **Priority:** P0 (immediate), P1 (next session), P2 (next sprint), P3 (backlog).

## Step 5 — Write Tuning Report

19. Generate `docs/signals/TUNING-REPORT.md` with sections:
    - **Signal Summary:** Count by type, severity, feature. Date range covered.
    - **Thresholds Triggered:** Which thresholds met, with evidence.
    - **Aggregate Metrics:** Economy, quality, governance trends.
    - **Tuning Proposals:** Ordered by priority, each with full evidence chain.
    - **Patterns Persisted:** Insights worth adding to repo memory.
    - **Comparison:** If previous TUNING-REPORT exists, compare metrics (improving/stable/degrading).
20. Archive previous TUNING-REPORT.md to `docs/signals/archive/TUNING-REPORT-{date}.md` (keep last 5).

## Step 6 — Actionable Output

21. If running in GitHub Action context:
    - For P0 proposals: create GitHub Issue with `domainspec-tuning` label and proposal details.
    - For P1 proposals: create a single bundled Issue.
    - For TH7 (critical): create Issue with `urgent` label.
22. If running manually:
    - Return summary to the user with proposal list and recommended next actions.
23. Optionally persist key patterns to `/memories/repo/` for agent context in future sessions.

</process>

<output-contract>
Return:
- Signal count analyzed (by type).
- Thresholds triggered (list with evidence summary).
- Proposals generated (count by priority).
- Aggregate metrics (overhead ratio trend, rework rate, first-pass success).
- Comparison vs. previous report (if available).
- Action items created (issues/PRs if in CI, recommendations if manual).
</output-contract>

<authority-rule>
- This skill NEVER modifies source code, spec files, or skill files directly.
- Proposals are recommendations — they require human approval or a follow-up agent invocation to implement.
- This skill only writes TUNING-REPORT.md and optionally creates GitHub Issues.
- When run from GitHub Action, it operates within the permissions of the workflow token.
</authority-rule>
