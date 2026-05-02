#!/usr/bin/env bash
# PreToolUse hook for Grep/Glob.
# Fires on every Grep/Glob call — always inject the standing rule reminder.
# Grep pattern alone is not a reliable signal for "code vs non-code",
# and GitNexus (global hook) already augments with graph context.
# This hook's job is the standing rule text reminder only.
set -euo pipefail

jq -n '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext: "STANDING RULE (CLAUDE.md): before Grep/Glob on code, consult the knowledge graph first. Use `gitnexus_query` to map execution flow, or `mcp__semantic-index__list_domains` / `mcp__semantic-index__semantic_query` to locate concepts by meaning. Grep/Glob on code is valid only AFTER MCP exploration has narrowed the target, or for non-code text (logs, configs, error strings, docs)."
  }
}'
