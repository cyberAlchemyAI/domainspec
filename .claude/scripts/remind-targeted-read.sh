#!/usr/bin/env bash
# PreToolUse hook for Read.
# When the file being read is a code file (by extension) and no offset is set,
# inject a reminder to use targeted-Read (offset + limit) instead of whole-file dumps.
# Already-targeted reads (offset provided) and non-code files pass through silently.
set -euo pipefail

input=$(cat)

file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')
offset=$(printf '%s' "$input" | jq -r '.tool_input.offset // ""')

# Already using targeted-read — no reminder needed
if [ -n "$offset" ]; then
  exit 0
fi

is_code=0
case "$file_path" in
  *.py|*.ts|*.tsx|*.js|*.jsx|*.go|*.rs|*.rb|*.java|*.kt|*.cpp|*.c|*.h|*.hpp)
    is_code=1 ;;
esac

if [ "$is_code" = "1" ]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: "STANDING RULE: Do not load a whole code file into context. Use targeted-Read: identify which lines you need first (via GitNexus, semantic-index, or Grep), then read only that range using offset + limit. Whole-file reads are only justified when the entire body is structurally necessary."
    }
  }'
fi
