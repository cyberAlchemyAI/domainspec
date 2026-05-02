---
tags: [harness, hooks, configuration, claude-code]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: active
version: 0.1.0
last_updated: 2026-04-14
---

# `.claude/` — Harness Configuration

## Objective

Document how the Claude Code harness is configured for this repository — which hooks, skills, and settings are active, why they exist, and where to inspect them. Answers: "what automated behaviors does the harness enforce on top of agent routing, and how do I change them?"

## Contents

- `settings.json` — project-wide harness config (committed; applies to everyone using Claude Code on this repo)
- `settings.local.json` — personal overrides (gitignored; permissions, personal env vars)
- `skills/custom/` — project-specific skills routed from `CLAUDE.md`
- `scripts/` — helper scripts invoked by settings or skills

## Active Hooks

Hooks are shell commands the harness runs automatically at specific lifecycle events. They are enforced by the harness, not by the agent — so the agent cannot forget or skip them.

### `PreToolUse` on `Write | Edit` — frontmatter cheatsheet injection

**Where:** `settings.json` → `hooks.PreToolUse[0]`

**What it does:** Before every `Write` or `Edit` tool call whose `file_path` ends in `.md`, the harness pipes the tool input through a shell command that reads `.claude/skills/custom/frontmatter.md` and injects its contents as `additionalContext` into the agent's context window. The agent sees the frontmatter schema (fields, allowed values, `node_type` picker) at the exact moment it is about to write or edit a markdown file.

**Why it exists:** `CLAUDE.md` Route 7 tells the agent to read `frontmatter.md` whenever creating a new `.md` file. Routing is best-effort — the agent can forget or skip it. The hook makes the behavior deterministic: the cheatsheet arrives regardless of what the agent intended. This is the "harness enforces, agent doesn't have to remember" pattern.

**Scope:** Applies to all `.md` files in the repo, not just new ones. Triggers on both creation (`Write`) and modification (`Edit`). Non-markdown files pass through silently.

**Limits:**
- Only disciplines the agent. Humans editing `.md` files directly bypass the hook — that gap should be closed with a pre-commit hook if stricter enforcement is needed.
- Hard-codes an absolute path to `frontmatter.md`. If the skill moves, update the hook command in `settings.json`.

## Where to inspect hooks

- `/hooks` inside Claude Code — interactive menu listing all loaded hooks
- `claude --debug` — verbose logs showing each hook invocation and its output
- `settings.json` on disk — source of truth

## Reloading after changes

The harness watches settings files that existed when the session started. Adding a *new* settings file (e.g., creating `.claude/settings.json` for the first time) requires either opening `/hooks` once or restarting Claude Code to pick up the new file. Edits to an already-watched file apply immediately.

## Related

- `CLAUDE.md` — agent routing table; references this README under Route 7
- `.claude/skills/custom/frontmatter.md` — the cheatsheet this hook injects
- `docs/vault/ontology-conventions.md` — full rationale behind the frontmatter schema
