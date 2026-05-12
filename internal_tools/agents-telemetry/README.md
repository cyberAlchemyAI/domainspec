---
tags: [telemetry, agents, hooks, observability, claude-code, copilot, internal-tools]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-12
---

# `internal_tools/agents-telemetry/` — Subagent Dispatch Telemetry

## Objective

Capture a structured event every time an **agent we explicitly authored** is dispatched, regardless of which IDE/host invoked it. Answers: "which of our subagents actually get used, by whom, with what prompts, how often, and how long do they run?"

In scope:
- Claude Code subagents under [.claude/agents/](../../.claude/agents/) (43 agents: `domainspec-*`, `gsd-*`, `mars-researcher`)
- GitHub Copilot custom agents under [.github/agents/](../../.github/agents/) (36 agents — same set, mirrored with VS Code tool grants)

Out of scope (and intentionally so):
- Built-in agent types Claude Code ships with (`general-purpose`, `Explore`, `Plan`, `statusline-setup`, `claude-code-guide`)
- Opaque "agent mode" behavior inside Copilot Chat that does not route through our `.github/agents/*.agent.md` definitions
- OpenAI / other vendor SDKs

## Why this exists

We have ~40 hand-authored agents. We currently have **no idea** which ones are actually invoked, which sit unused, which are dispatched with prompts that drift from their stated role, and which fail silently. Telemetry turns the agent catalog from a set of intentions into a measurable surface.

## Two mechanisms — and they are not equivalent

The two hosts expose different dispatch surfaces. We deliberately use a different mechanism per host rather than pretending to one unified pipeline.

### Mechanism A — Claude Code: harness hook (deterministic)

**Surface:** Claude Code's `PreToolUse` / `PostToolUse` hooks fire on every tool call. Subagent dispatches go through the `Task` tool with `subagent_type` in the input payload.

**How it will work:**
- A `PreToolUse` hook on the `Task` tool reads the JSON payload, checks whether `subagent_type` is in our explicit catalog, and appends a JSONL event.
- A matching `PostToolUse` hook records completion (success/error, duration, optional output size).
- Hook scripts live in [scripts/](scripts/) (to be added); the wiring lives in `.claude/settings.json`.

**Properties:** lossless, no agent cooperation required, zero token cost, fires even if the agent prompt is malformed. This is the load-bearing mechanism.

### Mechanism B — Copilot custom agents: prompt-side self-report (lossy)

**Surface:** The Copilot extension does not expose a `PreToolUse`-equivalent hook for dispatching custom agents — even custom agents we authored in `.github/agents/`. The agent definition is configuration the extension reads; the *act of dispatch* is internal to the closed extension.

**Workaround:**
- Stand up a tiny MCP server exposing one tool: `telemetry/agent_started(agent_name, prompt_summary)`.
- Add it to every `.github/agents/*.agent.md` `tools:` list.
- Prepend a one-liner to each agent's `<role>`: "Before any other action, call `telemetry/agent_started`."

**Properties:** lossy (depends on the LLM obeying the instruction), costs one tool call per dispatch, bloats every agent file by one line. Records "the agent agreed it was dispatched," not "the agent was dispatched." Treat the resulting numbers as a lower bound, never a true count.

### What this implies for analysis

Do **not** sum events across `source: claude-code` and `source: copilot` and present the total as "agent dispatches." They have different reliability. Always break out by `source` in any dashboard or report.

## Event schema (proposed)

One JSONL line per event. Same envelope across both sources, with `mechanism` and `source` distinguishing reliability.

```json
{
  "ts": "2026-05-12T14:03:11Z",
  "source": "claude-code",
  "mechanism": "hook",
  "event": "dispatch.start",
  "agent_name": "domainspec-spec-writer",
  "parent_session_id": "abc123",
  "prompt_chars": 1842,
  "prompt_sha256": "…",
  "extra": {}
}
```

Companion `dispatch.end` events carry `duration_ms`, `status`, optional `output_chars`. `prompt_sha256` lets us correlate without storing prompt text by default.

## Where data lands

To be decided when implementation starts. Default plan: `internal_tools/agents-telemetry/data/events.jsonl` (gitignored). Alternative: pipe to a local SQLite for queryability.

## Build order (recommendation)

1. Mechanism A only — Claude hook + JSONL appender + a script to print "top N agents this week."
2. Stop. Look at real data for two weeks before building more.
3. Decide whether Mechanism B is worth its cost based on whether Claude data left questions unanswered.
4. If yes, build the MCP server and instrument `.github/agents/*` in one sweep.

The temptation to build both at once should be resisted — most of the value comes from Mechanism A, and Mechanism B's design will be sharper once we know what questions matter.

## 📁 Navigation

- **`README.md`** — this file (design doc).
- **`scripts/`** *(to be added)* — hook scripts for Mechanism A.
- **`mcp/`** *(to be added, deferred)* — telemetry MCP server for Mechanism B.
- **`data/`** *(to be added, gitignored)* — JSONL event log.

## Related

- [.claude/README.md](../../.claude/README.md) — harness configuration overview; explains the existing `PreToolUse` hook pattern this builds on.
- [.claude/agents/](../../.claude/agents/) — Claude Code subagent catalog (Mechanism A target set).
- [.github/agents/](../../.github/agents/) — Copilot custom agent catalog (Mechanism B target set).
- [.claude/skills/custom/frontmatter.md](../../.claude/skills/custom/frontmatter.md) — frontmatter schema this README follows.
