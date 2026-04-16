---
name: domainspec-reflect
description: "Generate a PIPELINE-REPORT.md with economy of action metrics (G7) and structured reflection (G8) after a pipeline run. Can be invoked standalone for retrospective analysis of any completed feature work."
argument-hint: "<feature-name> [--from-session] [--standalone]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, Task
---

<objective>
Produce a structured PIPELINE-REPORT.md that captures:
1. **Economy of Action (G7):** Quantified metrics of pipeline cost — steps, delegations, questions, retries, overhead ratio.
2. **Reflection (G8):** What worked, what didn't, governance gaps found, skill improvement proposals, and patterns to persist.

This skill is the framework's learning mechanism. It turns every pipeline run into a tuning opportunity.
</objective>

<flags>
- `--from-session`: Analyze the current conversation context to extract metrics (default when called from pipeline).
- `--standalone`: Prompt user for metrics when no pipeline context is available (manual retrospective).
</flags>

<context>
Template: `domainspec/templates/PIPELINE-REPORT.md`
Output: `docs/features/{feature}/PIPELINE-REPORT.md`

The reflection step sits after verification (Step 9) and before the final pipeline summary.
It does NOT change the verification verdict — it augments it with learning.
</context>

<process>

## Step 1 — Gather Metrics

1. If invoked from pipeline (default):
   a. Count steps executed vs skipped from the pipeline run context.
   b. Count agent/skill delegations made (each `Delegate to X` invocation).
   c. Count human questions asked (each `AskQuestions` call or interactive prompt).
   d. Count files created and files modified (from pipeline artifacts tracking).
   e. Count tests added and total test results (from test run output).
   f. Count retries (fix iterations after failures).
   g. Record context discovery strategy used and files read for context.
   h. Count Explore and Researcher subagent calls.

2. If `--standalone`:
   a. Read existing `docs/features/{feature}/` artifacts to infer scope.
   b. Ask user for missing metrics that cannot be inferred.

## Step 2 — Compute Overhead Assessment

3. Calculate overhead ratio:
   - **Governance artifacts** = count of docs files that are NOT domain behavior (PIPELINE-REPORT, ALIGNMENT-REPORT, OBSERVABILITY-REPORT, TEST-SPEC, UI-REVIEW).
   - **Domain artifacts** = count of domain files (SPEC, aspect files, STORIES, source code, test files).
   - **Overhead ratio** = governance artifacts ÷ domain artifacts.
4. Assess:
   - ≤ 0.3 → "acceptable" — governance is proportionate.
   - 0.3–0.6 → "moderate" — review if all governance artifacts added value.
   - > 0.6 → "high" — governance may be creating more friction than value. Flag for review.

## Step 3 — Reflect on Run

5. Analyze **what went well**:
   - Steps that produced correct output on first attempt.
   - Context discovery that found the right files efficiently.
   - Specifications that were complete enough for direct implementation.

6. Analyze **what required rework**:
   - Steps that needed retries — count iterations and what caused failure.
   - Human corrections — what did the user have to fix manually.
   - Backtracking — steps where output from an earlier step was wrong and needed revision.
   - For each: document root cause, iteration count, and what resolved it.

7. Identify **governance gaps discovered**:
   - Blind spots: things this run exposed that no existing skill, audit, or template catches.
   - Missing templates or aspect file coverage.
   - Cross-feature interactions that weren't accounted for.
   - For each: what was missed, which skill should have caught it, severity (LOW/MEDIUM/HIGH/CRITICAL).

8. Formulate **skill improvement proposals**:
   - Concrete, actionable changes to specific DomainSpec skills, agents, or instructions.
   - Each proposal: target file path, what to change, why (grounded in this run's evidence), priority (P0–P3).
   - Proposals must be specific enough to implement without further analysis.

9. Extract **patterns for memory**:
   - Reusable insights worth persisting to repo or user memory.
   - Only include non-obvious patterns — things that would save time if known in advance.
   - Each pattern: one-liner summary, context in which it applies.

## Step 4 — Write Report

10. Load template from `domainspec/templates/PIPELINE-REPORT.md`.
11. Populate all sections with gathered data.
12. Write to `docs/features/{feature}/PIPELINE-REPORT.md`.
13. If a previous PIPELINE-REPORT.md exists, archive it by prepending a `## Previous Run — {date}` section at the bottom (keep only last 3 runs).

## Step 5 — Surface Actionable Items

14. If governance gaps with severity ≥ HIGH exist:
    - List them prominently in the return summary.
    - Recommend specific follow-up actions (skill update, template addition, audit rule).
15. If skill improvement proposals exist with priority P0 or P1:
    - Flag them as "recommended immediate action" in the summary.
16. If overhead ratio > 0.6:
    - Flag as "governance overhead review needed" in the summary.

</process>

<output-contract>
Return to the pipeline (or user if standalone):
- Economy of Action summary (one-line per metric category).
- Governance gaps count by severity.
- Skill improvement proposals count by priority.
- Overhead ratio and assessment.
- List of patterns persisted to memory (if any).
- Actionable follow-up items (if any).
</output-contract>

<authority-rule>
- This skill NEVER changes the verification verdict.
- This skill NEVER modifies source code or spec files.
- This skill only writes PIPELINE-REPORT.md and optionally persists patterns to memory.
- Skill improvement proposals are recommendations — they require human approval before implementation.
</authority-rule>
