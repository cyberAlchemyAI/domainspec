---
tags: [hooks, skill, subagents, dispatch, governance, workflow, claude-code, internal-tools, cross-repo, portable]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: exploratory
version: 0.5.2
last_updated: 2026-06-12
---

# `internal_tools/subagents-dispatch-hooks/` — Dispatch Governance

## What is this?

A portable dispatch-governance toolchain: one skill (`register-dispatch`), three Claude Code `PreToolUse` hooks, and an installer — Node-only, zero runtime dependencies. Together they make subagent dispatches get recorded — **one row per dispatch** — in an append-only per-repo ledger at `<repo-root>/telemetry/agents/subagents-dispatch.yaml`. Installed globally per user (`~/.claude`), so it applies to every repo with no per-repo wiring.

## Business Context

This repo runs multi-agent dispatches under a subagents-strategy constitution (schema v0.5.2): every dispatch contributes **two appends** — the dispatch row (the spec: `goal`, `context`, `groups` with per-agent `angle`/`model`/`token_budget`/`initial_prompt`, `connections`) at dispatch, and the close row (`close_of` + `exit_reason` + `agents_spawned`, optionally the verbatim `feedback_prompts`) at termination. Registration is a **skill the model invokes**, not an auto-logger, because a hook sees only the raw `Agent` call and cannot author `angle`/`anti_bias`/`goal`, and not every dispatch is a research dispatch with a roster to derive from. The reminder hook only nudges.

The ledger is the **governance record** (who was dispatched, with what angle, tensioned how). It is distinct from the research skill's per-folder `dispatch.yaml` **rosters** and from `internal_tools/agents-telemetry/` (SQLite **usage measurement**) — the three coexist; do not conflate them. The ledger is currently untracked by git; whether it gets committed is an open decision.

Operational facts: population depends on the model actually invoking the skill — the reminder is a nudge, not enforcement. Install is per-user, so a teammate gets the behavior only after running [install.cjs](install.cjs) once (new repos on an already-installed machine are covered). Claude Code shows the hooks and asks the user to trust them on first run. The installer is Claude Code-specific; the appender itself is harness-neutral.

## Why it matters

It mitigates three risks in multi-agent practice, while the human stays the gate (nothing here dispatches or approves on its own):

- **Unrecorded or over-eager fan-outs** — the reminder hook nudges registration on every `Agent` call, and the `Workflow` tool is denied so dispatch goes through the governed path.
- **In-place tampering of dispatch history** — the ledger is append-only, mechanically enforced by a hook; closing a dispatch is an appended `close_of` event, never an edit to the original row.
- **Silent ledger corruption** — the appender structurally self-checks the ledger before every append and refuses (exit 1) if it is corrupt, so damage surfaces at the next write instead of accumulating. Incoming records are additionally validated strictly against the v0.5.2 schema (exit 2 on violation) — but **only the incoming record**: rows written under older schemas are grandfathered historical artifacts, never re-validated.

## 📁 Navigation

- **`hooks/`**: Canonical sources of the three `PreToolUse` hooks (copies are installed to `~/.claude/hooks`).
  - **[remind-register-dispatch.cjs](hooks/remind-register-dispatch.cjs)**: On `Agent` — reminder-only nudge to run `register-dispatch`; writes no ledger itself. Fail-open.
  - **[block-workflow.cjs](hooks/block-workflow.cjs)**: On `Workflow` — deterministic deny; the project mandates the `Agent` tool / research skill for subagent dispatch.
  - **[enforce-append-only-dispatch.cjs](hooks/enforce-append-only-dispatch.cjs)**: On `Edit|MultiEdit|Write|NotebookEdit|Bash|PowerShell` — owns the append-only enforcement contract: path canonicalization, the read-only command allowlist, the deliberate absence of an appender-mention escape hatch, and the guardrail-not-security-boundary / fail-open stance (rules documented in its header).
- **`skills/register-dispatch/`**: The skill that writes the ledger (installed to `~/.claude/skills`).
  - **[SKILL.md](skills/register-dispatch/SKILL.md)**: Owns the v0.5.2 row schema (dispatch row: `groups`/`connections` field reference with the conditional `anti_bias`/`angle` rules; close row: `exit_reason` vocabulary, `agents_spawned` shape, verbatim `feedback_prompts`; `invoked_by` on both), the grandfathering rule, and the authoring procedure (temp JSON file → appender).
  - **[append-dispatch.cjs](skills/register-dispatch/append-dispatch.cjs)**: The only sanctioned write path. Owns the appender contract: UTF-8 file argument (not stdin), strict v0.5.2 validation of the incoming record (exit 2; removed v0.3.0 keys get an explicit removed-by-v0.5.2 error), `invoked_by` resolution (record → `git config user.email` → null), idempotency on `dispatch_id`/`close_of`, JSON-column emission, repo-root resolution, and the structure-only pre-append self-check that grandfathers old rows (rules documented in its header).
- **`tests/`**: Zero-dependency test battery — `node tests/test-append-dispatch.cjs` runs the appender against temp ledgers (never the real one): valid/invalid records, enums, conditionals, idempotency, grandfathering, `invoked_by` resolution.
- **[install.cjs](install.cjs)**: Per-user installer/uninstaller (`node install.cjs [--uninstall]`). Owns the install semantics: replace-semantics registrations from a source-of-truth table, event-generalized registration entries, retired-hook migration, and the Claude Code-specific vs harness-neutral boundary (documented in its header).
