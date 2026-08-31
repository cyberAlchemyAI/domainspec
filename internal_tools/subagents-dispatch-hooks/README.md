---
tags:
  [
    hooks,
    skill,
    subagents,
    dispatch,
    governance,
    workflow,
    claude-code,
    internal-tools,
    cross-repo,
    portable,
  ]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: exploratory
version: 0.9.0
last_updated: 2026-08-27
---

# `internal_tools/subagents-dispatch-hooks/` — Dispatch Governance

## What is this?

A **self-contained, portable subagents-strategy system** — the complete `router → type-skill → form` chain, its constitution, the governance hooks, and an installer. Node-only, zero runtime dependencies. Together they make subagent dispatches get authored under one law and recorded — **one row per dispatch** — in an append-only per-repo ledger at `<repo-root>/telemetry/agents/subagents-dispatch.yaml`. The hooks + `register-dispatch` install globally per user (`~/.claude`); the router/type skills run project-level (`.claude/skills/`). This folder is the **canonical migration source**: copy it to gain the whole system in another repo (e.g. Arcanum).

## The chain (router → type-skill → form)

A dispatch flows through three authority layers, each owning a distinct concern:

| Layer                                                              | Skill                                                                                                                                                                                       | Owns                                                                                                                                                               |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Router**                                                         | [`skills/domainspec-subagents-strategy/`](skills/domainspec-subagents-strategy/SKILL.md)                                                                                                    | the Principle-1 trigger, the human gate, universal invariants; routes by `dispatch_type`                                                                           |
| **Type skill** (LIVE: `research`, `review`, `experiment`, `other`) | [`skills/research/`](skills/research/SKILL.md) · [`skills/review/`](skills/review/SKILL.md) · [`skills/experiment/`](skills/experiment/SKILL.md) · [`skills/other/`](skills/other/SKILL.md) | type-specific judgment — roles, tension axes, outputs, and closure meaning. Experiment owns its phase contract; `other` owns bounded execution fallback semantics. |
| **Form**                                                           | [`skills/register-dispatch/`](skills/register-dispatch/SKILL.md)                                                                                                                            | the ledger row schema, field tables, enums, the appender                                                                                                           |
| **Companion**                                                      | [`skills/robot-talks/`](skills/robot-talks/SKILL.md)                                                                                                                                        | intra-group discussion when a group sets `robot_talks: true`                                                                                                       |

The **law** these point to lives in [`constitution/`](constitution/): field semantics (§5), the `dispatch_type` vocabulary, and the principles. `constitution/subagents-strategy-constitution-proposal.md` is the single canonical constitution (the repo-root copy was deleted) and is the v0.9.0 law that governs the ledger (wire `schema_version` is now `0.9.0`); `constitution/robot-talks-constitution.md` is the companion bound by robot-talks groups.

## Business Context

This repo runs multi-agent dispatches under a subagents-strategy constitution (schema v0.9.0): every dispatch contributes **two appends** — the dispatch row (the spec: `goal`, `context`, `groups` with per-agent `angle`/`model`/`token_budget`/`initial_prompt`, `connections`, and the conditional experiment contract) at dispatch, and the close row (`close_of` + `exit_reason` + `agents_spawned`, optionally feedback and the conditional experiment closeout) at termination. Registration is a **skill the model invokes**, not an auto-logger, because a hook sees only the raw `Agent` call and cannot author the governed strategy. The reminder hook only nudges.

The ledger is the **governance record** (who was dispatched, with what angle, tensioned how). It is distinct from the research skill's per-folder `dispatch.yaml` **rosters** and from `internal_tools/agents-telemetry/` (SQLite **usage measurement**) — the three coexist; do not conflate them. Whether the ledger is committed to git is an open decision.

Operational facts: population depends on the model actually invoking the skill — the reminder is a nudge, not enforcement. Install is per-user, so a teammate gets the behavior only after running [install.cjs](install.cjs) once (new repos on an already-installed machine are covered). Claude Code shows the hooks and asks the user to trust them on first run. The installer is Claude Code-specific; the appender itself is harness-neutral.

## Why it matters

It mitigates three risks in multi-agent practice, while the human stays the gate (nothing here dispatches or approves on its own):

- **Unrecorded or over-eager fan-outs** — the reminder hook nudges registration on every `Agent` call, and the `Workflow` tool is denied so dispatch goes through the governed path.
- **In-place tampering of dispatch history** — the ledger is append-only, mechanically enforced by a hook; closing a dispatch is an appended `close_of` event, never an edit to the original row.
- **Silent ledger corruption** — the appender structurally self-checks the ledger before every append and refuses (exit 1) if it is corrupt. Incoming records are validated strictly against v0.9.0; experiment runs additionally prove one exact proposal/closeout lineage. Unrelated historical rows remain grandfathered and are never semantically re-validated.

## 📁 Navigation

- **`hooks/`**: Canonical sources of the three `PreToolUse` hooks (copies are installed to `~/.claude/hooks`).
  - **[remind-register-dispatch.cjs](hooks/remind-register-dispatch.cjs)**: On `Agent` — reminder-only nudge to run `register-dispatch`; writes no ledger itself. Fail-open.
  - **[block-workflow.cjs](hooks/block-workflow.cjs)**: On `Workflow` — deterministic deny; the project mandates the `Agent` tool / research skill for subagent dispatch.
  - **[enforce-append-only-dispatch.cjs](hooks/enforce-append-only-dispatch.cjs)**: On `Edit|MultiEdit|Write|NotebookEdit|Bash|PowerShell` — owns the append-only enforcement contract: path canonicalization, the read-only command allowlist, the deliberate absence of an appender-mention escape hatch, and the guardrail-not-security-boundary / fail-open stance (rules documented in its header).
- **`skills/register-dispatch/`**: The skill that writes the ledger (installed to `~/.claude/skills`).
  - **[SKILL.md](skills/register-dispatch/SKILL.md)**: Owns the v0.9.0 row schema, including confirmation evidence, experiment phase/lineage, typed experiment closeout, grandfathering, and the authoring procedure.
  - **[append-dispatch.cjs](skills/register-dispatch/append-dispatch.cjs)**: The only sanctioned write path. It strictly validates incoming v0.9.0 records, verifies exact experiment artifacts and proposal lineage, emits JSON columns, preserves idempotency, and structurally grandfathers existing rows.
- **`skills/domainspec-subagents-strategy/`**: The **router** — checks the trigger, holds the human gate, enforces universal invariants, routes by `dispatch_type`. Defines no field and no type-specific judgment.
- **`skills/research/`, `skills/review/`, `skills/experiment/`, `skills/other/`**: The four LIVE **type skills**. Experiment owns one explicit propose/run lifecycle; `other` owns bounded mutation with an independent downstream reviewer per lane. The form still owns JSON grammar.
- **`skills/robot-talks/`**: The companion skill for intra-group discussion (`robot_talks: true`).
- **`constitution/`**: The **law** the skills point to — the single canonical location. `subagents-strategy-constitution-proposal.md` is v0.9.0; `robot-talks-constitution.md` remains the discussion companion.
- **`tests/`**: Zero-dependency test battery — `node tests/test-append-dispatch.cjs` runs the appender against temp ledgers (never the real one): valid/invalid records, enums, conditionals, idempotency, grandfathering, `invoked_by` resolution.
- **[install.cjs](install.cjs)**: Per-user installer/uninstaller (`node install.cjs [--uninstall]`). Owns the install semantics: replace-semantics registrations from a source-of-truth table, event-generalized registration entries, retired-hook migration, and the Claude Code-specific vs harness-neutral boundary (documented in its header).
- **`docs/`**: Model & background docs (the _why/what_, distinct from the field schema in SKILL.md).
  - **[LEDGER-MODEL.md](docs/LEDGER-MODEL.md)**: The ledger's data model — what it is/isn't, the two-append discipline, the `dispatch → groups → agents` tree as JSON columns, and the L1/L2/L3 normalization. Read this for the _mental model_; SKILL.md owns the field-by-field schema.
  - **[docs/discovery/agents-input-output/](docs/discovery/agents-input-output/discovery.md)**: The per-role I/O contracts discovery (the research-stage instance).
  - **[docs/discovery/experiment-promotion/](docs/discovery/experiment-promotion/discovery.md)**: The discovery promoting `experiment` to a LIVE `dispatch_type` (narrow recipe), which the `experiment` type skill operationalizes.

## Live vs canonical, and migrating

This folder is the **canonical migration source** for the whole subagents-strategy system. Two caveats for anyone syncing or migrating it:

- **Single source of truth.** This bundle is canonical for the private adapter system. [install.cjs](install.cjs) installs the hooks + `register-dispatch` to `~/.claude`, composes the DomainSpec router from the public Arcanum `subagent-strategy` base plus the private owner, and copies the remaining chain skills to `<repo>/.claude/skills`. The explicit composition contract is [`skills/domainspec-subagents-strategy/runtime-composition.json`](skills/domainspec-subagents-strategy/runtime-composition.json). Use `node scripts/sync-strategy-runtimes.cjs --sync --runtime all --target <repo>` to synchronize both `.agents` and `.claude`, then run the same command with `--check`. Generated runtime files are witnesses, never independent authorities.
- **Cross-references on migration.** The copied skills carry **repo-relative paths** to their live locations (`.claude/skills/<name>/SKILL.md`, the canonical constitution at `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` — the repo-root copy was deleted). On migration to another repo (Arcanum) these must be rebased to that repo's layout — e.g. point the type skills at `constitution/subagents-strategy-constitution-proposal.md` and at each other under `skills/`. The copies are faithful snapshots, not yet self-referential within the bundle.
