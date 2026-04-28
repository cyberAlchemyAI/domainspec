# TUNING-LOOP.md — Async Signal-Based Framework Tuning

> How DomainSpec learns from its own pipeline runs, detects cross-session patterns, and proposes structural improvements — automatically.

---

## Overview

The tuning loop is DomainSpec's self-improvement mechanism. It separates **observation** (fast, in-pipeline) from **analysis** (async, cross-run) to avoid blocking feature work while still accumulating the evidence needed for structural learning.

Canonical drift/convergence reference:

- [DRIFT-CONVERGENCE.md](DRIFT-CONVERGENCE.md)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE RUN (sync)                            │
│                                                                       │
│  plan → spec → stories → tests → implement → verify → emit-signals   │
│                                                                  │    │
│                                              ┌───────────────────┘    │
│                                              ▼                        │
│                              docs/signals/pipeline-signals.jsonl      │
│                              (append-only, committed per session)     │
└──────────────────────────────────────────────────────────────────────┘
                                               │
                                               │  git push (signals committed)
                                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTION (async)                             │
│                     domainspec-tuning.yml                              │
│                                                                       │
│  1. Read pipeline-signals.jsonl                                       │
│  2. Run analyze-signals.ts (threshold check)                          │
│  3. If thresholds met → create/update GitHub Issue                    │
│  4. (Future) Invoke cloud agent → TUNING-REPORT.md → PR              │
└────────────────────────────────────────────────────────────────────────┘
                                               │
                                               │  threshold triggered
                                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     REFLECTION (manual or agent)                      │
│                     domainspec-reflect --from-signals                  │
│                                                                       │
│  1. Load all signals                                                  │
│  2. Detect cross-run patterns (TH1–TH8)                              │
│  3. Compute aggregate metrics                                         │
│  4. Generate evidence-backed tuning proposals                         │
│  5. Write docs/signals/TUNING-REPORT.md                              │
│  6. Human reviews → approves → applies changes                       │
└────────────────────────────────────────────────────────────────────────┘
                                               │
                                               │  proposals applied
                                               ▼
                                     Skills/agents improved
                                     Next pipeline run benefits
                                               │
                                               └──────────► (loop restarts)
```

---

## Architecture

### Components

| Component            | Location                                  | Role                                                            | Execution         |
| -------------------- | ----------------------------------------- | --------------------------------------------------------------- | ----------------- |
| **Signal Schema**    | `domainspec/templates/SIGNAL-SCHEMA.md`   | Defines signal types, envelope format, and threshold conditions | Reference doc     |
| **Pipeline Step 10** | `domainspec-pipeline` SKILL.md, Step 10   | Emits structured signals to JSONL after each pipeline run       | Sync, in-pipeline |
| **Signal File**      | `docs/signals/pipeline-signals.jsonl`     | Append-only accumulation of all pipeline observations           | File, git-tracked |
| **Analyzer Tool**    | `domainspec/tools/analyze-signals.ts`     | Reads JSONL, computes aggregates, checks thresholds             | CLI, CI or manual |
| **Tuning Workflow**  | `.github/workflows/domainspec-tuning.yml` | Runs analyzer on signal commits, creates Issues                 | GitHub Action     |
| **Reflect Skill**    | `domainspec-reflect` SKILL.md             | Deep analysis of accumulated signals, produces TUNING-REPORT    | Agent skill       |
| **Tuning Report**    | `docs/signals/TUNING-REPORT.md`           | Output of reflection — proposals, metrics, comparisons          | Generated doc     |
| **Report Archive**   | `docs/signals/archive/`                   | Previous tuning reports for trend comparison                    | Historical        |

### Data Flow

```
Pipeline run #1  ──emit──►  signals.jsonl (lines 1-12)
Pipeline run #2  ──emit──►  signals.jsonl (lines 13-28)
Pipeline run #3  ──emit──►  signals.jsonl (lines 29-40)
                                    │
                          git push (session end)
                                    │
                    ┌───────────────┘
                    ▼
            analyze-signals.ts
                    │
            ┌───────┴───────┐
            │               │
        no thresholds   thresholds met
            │               │
         exit(0)         exit(1)
         (silent)           │
                    ┌───────┘
                    ▼
            GitHub Issue created
            "domainspec-tuning" label
                    │
                    ▼
            Human or agent runs:
            domainspec-reflect --from-signals --all
                    │
                    ▼
            TUNING-REPORT.md
            (proposals + evidence)
                    │
                    ▼
            Human reviews & approves
                    │
                    ▼
            Skill/agent/template updated
```

---

## Signal System

### Design Principles

1. **Append-only** — Signals are never edited or deleted during normal operation. The JSONL file grows monotonically.
2. **Self-contained** — Each signal line includes all context needed for analysis (no external references required).
3. **Typed + extensible** — New signal types can be added by documenting them in SIGNAL-SCHEMA.md and emitting them from the pipeline. The analyzer gracefully ignores unknown types.
4. **Low-cost emission** — Pipeline Step 10 emits signals as fast JSON serialization. No analysis, no reports, no blocking.

### Signal Envelope

Every signal shares a common envelope. See `domainspec/templates/SIGNAL-SCHEMA.md` for the full specification.

```jsonc
{
  "id": "uuid-v4",
  "timestamp": "ISO-8601",
  "session": "opaque-session-id",
  "feature": "feature-id",
  "domainspecVersion": "1.8.0",
  "pipelineMode": "new | evolution | audit",
  "type": "signal-type",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "category": "economy | governance | pattern | quality",
  "data": {
    /* type-specific payload */
  },
}
```

### Current Signal Types

| Type              | Category   | Emitted When                           | Key Data Fields                                                                        |
| ----------------- | ---------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `step-verdict`    | economy    | Each pipeline step completes           | step, stepName, verdict, retriesNeeded, filesCreated/Modified, testsAdded              |
| `alignment-gap`   | quality    | Alignment audit finds drift            | gapType, conceptId, specFile, codeFile, description                                    |
| `spec-gap`        | quality    | Spec insufficient for implementation   | aspectFile, missingDetail, resolution, impactedStep                                    |
| `governance-gap`  | governance | Framework blind spot discovered        | description, shouldHaveBeenCaughtBy, skillFile, suggestedFix                           |
| `rework`          | economy    | Step needs retries or human correction | step, stepName, iterations, rootCause, resolution                                      |
| `overhead`        | economy    | Pipeline run completes (once per run)  | stepsExecuted/Skipped, agentDelegations, humanQuestions, overheadRatio                 |
| `decision`        | pattern    | Significant design choice made         | description, alternatives, rationale, confidence                                       |
| `proposal`        | governance | Skill improvement idea identified      | targetFile, changeDescription, rationale, priority                                     |
| `pattern`         | pattern    | Reusable insight discovered            | summary, context, applicability                                                        |
| `spec-compliance` | governance | Agent deviated from its own spec       | agentName, specFile, violationType, skippedStep, description, detectedBy, impact       |
| `agent-cost`      | operations | Agent run resource consumption         | agentName, model, premiumRequests, durationSeconds, taskType, success, triggerWorkflow |

### Adding a New Signal Type

To add a new signal type:

1. **Document** — Add the type definition to `domainspec/templates/SIGNAL-SCHEMA.md` with:
   - Type name and category
   - When it should be emitted
   - `data` schema with field descriptions
   - Example JSON
2. **Emit** — Update the pipeline step (or relevant skill) to emit the signal at the right point. Follow the envelope format.
3. **Analyze** (optional) — If the signal should trigger thresholds:
   - Add a threshold definition to SIGNAL-SCHEMA.md's Threshold Definitions table
   - Add the threshold check to `domainspec/tools/analyze-signals.ts`
   - Add the corresponding tuning proposal logic to `domainspec-reflect` SKILL.md Step 4
4. **Commit** — Update `domainspec/CHANGELOG.md` with the new signal type.

---

## Threshold System

Thresholds define when accumulated signals warrant action. They convert raw observations into trigger conditions.

### Current Thresholds

| ID   | Condition                                                  | Min Signals        | Action                                        |
| ---- | ---------------------------------------------------------- | ------------------ | --------------------------------------------- |
| TH1  | Same `governance-gap.shouldHaveBeenCaughtBy` in 3+ signals | 3                  | Auto-propose skill update                     |
| TH2  | `overhead.overheadRatio` > 0.5 for 3 consecutive runs      | 3 overhead signals | Flag governance overhead review               |
| TH3  | Same `spec-gap.missingDetail` pattern in 2+ features       | 2                  | Propose template improvement                  |
| TH4  | `rework` on same `stepName` in 5+ signals                  | 5                  | Flag skill for hardening                      |
| TH5  | 3+ `proposal` signals targeting same file                  | 3                  | Bundle proposals into single PR               |
| TH6  | `alignment-gap` count > 10 across last 5 sessions          | 10                 | Trigger full alignment audit                  |
| TH7  | `governance-gap` with severity CRITICAL                    | 1                  | Immediate issue (no threshold wait)           |
| TH8  | `decision` with `confidence: low` in 3+ signals            | 3                  | Flag domain ambiguity                         |
| TH9  | `spec-compliance` violation by same agent in 2+ signals    | 2                  | Flag agent spec for hardening + emit proposal |
| TH10 | `agent-cost` total premiumRequests > 50 in rolling 7 days  | 50                 | Alert cost threshold, review agent efficiency |

### Threshold Design Guidelines

When adding a new threshold:

- **Define the evidence chain** — What signals, how many, over what window?
- **Define the action** — What specific output should the threshold produce? (Issue, PR, report section)
- **Set the minimum** — How many signals constitute a pattern vs. noise? Start conservative (higher count), reduce based on false-positive experience.
- **Consider the window** — Should the threshold look at all-time signals, last N sessions, or last N days?
- **Map to a proposal type** — Each threshold should have a corresponding entry in `domainspec-reflect` Step 4 describing what tuning proposal it generates.

### Adding a New Threshold

1. Add to `domainspec/templates/SIGNAL-SCHEMA.md` Threshold Definitions table
2. Add check logic to `domainspec/tools/analyze-signals.ts` (follow existing pattern)
3. Add proposal generation logic to `domainspec-reflect` SKILL.md Step 4
4. Test with synthetic signals if possible

---

## Aggregate Metrics

The analyzer computes three categories of aggregate metrics from accumulated signals:

### Economy of Action

| Metric                      | Formula                                     | Purpose                                          |
| --------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **Average overhead ratio**  | mean of all `overhead.overheadRatio` values | Is governance cost proportionate to domain work? |
| **Rework rate**             | `rework` signals ÷ `step-verdict` signals   | How often do steps need retries?                 |
| **First-pass success rate** | steps with `retriesNeeded=0` ÷ total steps  | How reliable is first-attempt output?            |
| **Agent delegation count**  | sum of `overhead.agentDelegations`          | How much orchestration is needed?                |
| **Human question count**    | sum of `overhead.humanQuestions`            | How much human input is the pipeline consuming?  |

### Quality

| Metric                  | Formula                               | Purpose                                       |
| ----------------------- | ------------------------------------- | --------------------------------------------- |
| **Alignment gap rate**  | `alignment-gap` signals ÷ total runs  | How fast does code drift from spec?           |
| **Spec gap rate**       | `spec-gap` signals ÷ total runs       | How complete are specs before implementation? |
| **Governance gap rate** | `governance-gap` signals ÷ total runs | How many blind spots does the framework have? |

### Governance Effectiveness

| Metric                       | Formula                                                 | Purpose                                        |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| **Gaps addressed**           | governance gaps in previous report that no longer recur | Are tuning proposals actually fixing problems? |
| **Time to fix**              | days from governance-gap signal to skill update commit  | How fast does the framework self-correct?      |
| **Proposal acceptance rate** | proposals applied ÷ proposals generated                 | Are proposals useful and actionable?           |

### Adding a New Metric

1. Identify which signal types feed the metric
2. Add computation to `domainspec/tools/analyze-signals.ts` in the aggregates section
3. Add the metric to `domainspec-reflect` SKILL.md Step 3
4. Document in this file under the appropriate category

---

## Signal File Management

### Location

```
docs/signals/
├── pipeline-signals.jsonl          # active signal accumulation
├── TUNING-REPORT.md                # latest reflection output
├── README.md                       # directory documentation
└── archive/
    ├── TUNING-REPORT-2026-04-16.md # archived reports
    └── signals-2026-Q1.jsonl       # compacted old signals
```

### Lifecycle

1. **Accumulation** — Signals are appended to `pipeline-signals.jsonl` during pipeline runs (Step 10). One line per signal.
2. **Commit** — The signals file is committed to git at the end of each working session. This triggers the CI workflow.
3. **Analysis** — `analyze-signals.ts` reads the file, computes metrics, checks thresholds.
4. **Reflection** — When thresholds are met, `domainspec-reflect` produces a TUNING-REPORT.md.
5. **Compaction** — Periodically (suggested: quarterly), old signals can be archived:
   - Move signals older than 90 days to `archive/signals-{YYYY}-{Q}.jsonl`
   - Archive the current TUNING-REPORT.md to `archive/TUNING-REPORT-{date}.md`
   - Keep the last 5 archived reports for trend comparison

### Compaction Policy

The signals file will grow over time. Compaction rules:

- **Never delete signals** — archive them. Historical signals may reveal long-term trends.
- **Archive trigger** — When `pipeline-signals.jsonl` exceeds 500 signals or 90 days.
- **Compaction command** — `npx tsx domainspec/tools/compact-signals.ts` (to be built when needed).
- **Archive format** — Same JSONL format, named by quarter: `signals-2026-Q2.jsonl`.
- **Report retention** — Keep last 5 TUNING-REPORT archives for comparison.

---

## CI/CD Integration

### GitHub Action: `domainspec-tuning.yml`

**Trigger:** Push to `main` that modifies `docs/signals/pipeline-signals.jsonl`.

**Flow:**

1. Checkout + install dependencies
2. Run `analyze-signals.ts --json`
3. If exit code 1 (thresholds triggered):
   - Parse analysis JSON
   - Create or update a GitHub Issue with `domainspec-tuning` label
   - Upload signal file as artifact
4. If exit code 0 (no thresholds): silent, no action

**Issue Management:**

- One open issue at a time — new analysis updates the existing issue via comment
- `urgent` label added when TH7 (critical gap) is triggered
- Issue body includes: signal summary, thresholds triggered, aggregate metrics, next steps

### Manual Trigger

The workflow supports `workflow_dispatch` with inputs:

- `since` — Only analyze signals after this date
- `min_signals` — Override minimum signal count

### Cloud Agent Reflection

The workflow includes a live `agent-reflect` job that runs on a self-hosted VPS runner with Copilot CLI. When thresholds are triggered:

1. **Context preparation** — Analysis JSON and threshold summaries are written to temp files
2. **Copilot CLI invocation** — Agent reads signals, schema, and reflect skill instructions
3. **Report generation** — Produces `docs/signals/TUNING-REPORT.md` with evidence-backed proposals
4. **Validation gate** — Required sections checked, forbidden path modifications reverted
5. **PR creation** — Branch `domainspec/auto-tuning-{sha}`, requires human review before merge
6. **Failure fallback** — Creates GitHub Issue with manual steps if agent fails

#### Security Model

| Layer       | Constraint                                                            |
| ----------- | --------------------------------------------------------------------- |
| Container   | Agent runs in sandboxed `agent-runner:latest` (no production secrets) |
| Tools       | Copilot CLI with deny-list (no Bash, Terminal, Network, Browser)      |
| Paths       | Only `docs/signals/` and `domainspec/templates/` writable             |
| Review      | PRs require manual approval — no auto-merge                           |
| Concurrency | `cancel-in-progress: true` — one reflection at a time                 |

#### Cost Tracking

Agent runs emit `agent-cost` signals tracking premium requests, duration, and success rate. Threshold TH10 alerts when usage exceeds 50 premium requests in a rolling 7-day window.

#### Infrastructure

- Self-hosted runner: `/opt/actions-runner` with `[self-hosted, agent]` labels
- Systemd service: `actions-runner.service` (always-on, auto-restart)
- Setup: `infra/agent-runner-setup.sh` (idempotent)
- Container: `infra/agent-runner/Dockerfile`
- Auth: `GH_PAT_AGENT` secret (repo + workflow scope)

---

## Extending the Tuning Loop

### Adding a New Signal Source

Not all signals need to come from the pipeline. Future sources:

| Source                           | Trigger        | Signal Types                                                     |
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| **Alignment audit** (standalone) | Manual or CI   | `alignment-gap`, `governance-gap`                                |
| **Layering audit** (standalone)  | Manual or CI   | `alignment-gap`, `governance-gap`                                |
| **Test runs** (CI)               | Every PR       | `step-verdict` (test step only), `rework`                        |
| **Production incidents**         | Alert fires    | New: `incident` signal with SLO violation data                   |
| **PR review comments**           | PR merged      | New: `review-feedback` signal with reviewer notes                |
| **SPEC changes**                 | Docs committed | New: `spec-evolution` signal tracking concept additions/removals |

To add a new source:

1. Define what signals it emits (use existing types or propose new ones)
2. Determine the emission point (which skill, CI step, or hook)
3. Ensure the signals follow the envelope format
4. All signals go to the same `pipeline-signals.jsonl` file

### Adding Aggregate Metrics

The `analyze-signals.ts` tool and `domainspec-reflect` skill can compute new metrics from existing signals without adding new signal types:

1. Add computation logic to `analyze-signals.ts` → `aggregates` section
2. Add metric to `domainspec-reflect` SKILL.md Step 3
3. Add metric to this doc under the Aggregate Metrics section
4. Optionally add a threshold that triggers on the metric

### Adding Threshold-Triggered Actions

Beyond GitHub Issues, thresholds can trigger:

| Action Type                    | Implementation                        | When to Use                             |
| ------------------------------ | ------------------------------------- | --------------------------------------- |
| **GitHub Issue**               | Current (via `actions/github-script`) | Default action for all thresholds       |
| **PR with fix**                | Agent produces fix + creates PR       | When proposal is fully automatable      |
| **Slack/Discord notification** | Webhook in workflow                   | For team visibility                     |
| **Block merge**                | Required status check                 | When threshold indicates critical drift |
| **Auto-invoke audit**          | Dispatch alignment audit workflow     | When TH6 alignment drift is severe      |

---

## Meta-System Health Integration

The tuning loop contributes to Meta-Track health metrics (from ADLC-ALIGNMENT.md):

| Meta-Track Metric       | Signal Source                                                   | Computation                  |
| ----------------------- | --------------------------------------------------------------- | ---------------------------- |
| M-001 Orphan Rate       | `alignment-gap` (gapType: code-without-spec, spec-without-code) | orphan gaps ÷ total concepts |
| M-003 Time-to-Alignment | `overhead.timestamp` - SPEC.md last-modified                    | Average across features      |
| M-005 Governance Ratio  | `overhead.overheadRatio`                                        | Direct mapping               |
| M-006 Overhead Ratio    | `overhead.overheadRatio`                                        | Direct mapping               |

Metrics M-002 (L6 Friction Rate) and M-004 (L4 Volatility) require enforcement hooks and an axiom layer that don't exist yet (see ADLC-ALIGNMENT.md G13, G14).

---

## Operational Playbook

### First-time setup

1. Signals directory created: `docs/signals/README.md` ✅
2. Workflow deployed: `.github/workflows/domainspec-tuning.yml` ✅
3. Analyzer tool available: `domainspec/tools/analyze-signals.ts` ✅
4. First signals emitted: run a `domainspec-pipeline` on any feature

### Day-to-day operation

1. Work on features using the pipeline — signals accumulate automatically
2. Commit signals at session end (they're in `docs/signals/`)
3. CI analyzes on push — creates Issues if thresholds met
4. When an Issue appears, run `domainspec-reflect --from-signals --all` for deep analysis
5. Review TUNING-REPORT.md proposals
6. Apply approved proposals, commit, and the cycle restarts

### Investigating signal trends

```bash
# Quick overview
npx tsx domainspec/tools/analyze-signals.ts

# JSON for programmatic use
npx tsx domainspec/tools/analyze-signals.ts --json

# Only recent signals
npx tsx domainspec/tools/analyze-signals.ts --since 2026-04-01

# Lower threshold for early-stage projects
npx tsx domainspec/tools/analyze-signals.ts --min 3

# Count total signals
wc -l docs/signals/pipeline-signals.jsonl

# Find all governance gaps
grep '"governance-gap"' docs/signals/pipeline-signals.jsonl | jq .

# Signals by feature
grep '"player-management"' docs/signals/pipeline-signals.jsonl | jq .type | sort | uniq -c
```

### Responding to a tuning issue

1. Read the Issue body — note which thresholds triggered and the evidence
2. Run `domainspec-reflect --from-signals --all` for the full analysis
3. Review `docs/signals/TUNING-REPORT.md` proposals
4. For each proposal:
   - **Agree** → implement the change, commit, close the related part of the Issue
   - **Disagree** → document why in the Issue, adjust threshold if it's a false positive
   - **Defer** → move to backlog with rationale
5. Close the Issue when all proposals are addressed or deferred

---

## Versioning and Evolution

This tuning loop system evolves with DomainSpec:

| Version              | Capability                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| **v1.8.0** (current) | Signal emission (Step 10), analyzer tool, threshold-based CI, Issue creation, reflect skill reads from signals |
| **v1.8.x** (planned) | Signal compaction tool, additional signal types from standalone audits                                         |
| **v1.9.x** (planned) | Integration with code-to-spec binding (G11) — new signal types for orphan detection                            |
| **v2.0** (planned)   | Cloud agent reflection in CI, closed-loop auto-tuning, production incident signals                             |

Changes to the tuning loop itself follow DomainSpec's own Via Negativa principle: add complexity only when its absence has caused measurable harm. If a threshold produces false positives, adjust it. If a signal type is never emitted, remove it. The loop should be as lean as the codebase it governs.
