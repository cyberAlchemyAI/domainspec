#!/usr/bin/env bash
# PostToolUse hook: run the OWNED spec-semantic validator when a feature spec doc is written.
#
# Assimilation A1 (build-from-owned): wires the existing engine `lint` (canonical-form linter)
# into a fail-closed post-write hook so spec-semantic validation is automatic, not remembered.
# It builds NOTHING new — it invokes `tools/test-derivation-engine/src/cli.ts lint <feature>`.
#
# Stdin:  JSON {"tool_name":"Write|Edit","tool_input":{"file_path":"..."}} from Claude Code.
# Behavior on a docs/features/**/*.md write:
#   - lint violations  -> print the diagnostic to stderr and exit 2 (surfaces to the model; fail-closed)
#   - clean            -> exit 0 (silent)
#   - toolchain absent -> one-time notice, exit 0 (never hard-fail the session)
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
MARKER="${TMPDIR:-/tmp}/.domainspec-spec-validate-notice"

input_json="$(cat)"

# Parsing the hook payload needs jq; if absent, show once and pass (infra absence != violation).
if ! command -v jq >/dev/null 2>&1; then
  [ -f "$MARKER" ] || { echo "domainspec spec-validate: jq not found; spec validation skipped (shown once)." >&2; : > "$MARKER"; }
  exit 0
fi

fpath="$(printf '%s' "$input_json" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null)"
[ -z "$fpath" ] && exit 0

# Only act on feature spec docs.
case "$fpath" in
  *docs/features/*.md) ;;
  *) exit 0 ;;
esac

# feature = first path segment after docs/features/
feature="$(printf '%s' "$fpath" | sed -E 's#.*docs/features/([^/]+)(/.*|$)#\1#')"
[ -z "$feature" ] && exit 0

ENGINE="$ROOT/tools/test-derivation-engine"
if [ ! -d "$ENGINE" ] || ! command -v npx >/dev/null 2>&1; then
  [ -f "$MARKER" ] || { echo "domainspec spec-validate: engine/npx unavailable; spec validation skipped (shown once)." >&2; : > "$MARKER"; }
  exit 0
fi

# Run the owned canonical-form linter on the feature (fail-closed).
out="$(cd "$ENGINE" && npx --no-install tsx src/cli.ts lint "$feature" 2>&1)"; rc=$?

if [ "$rc" -ne 0 ]; then
  {
    echo "spec-validate: feature '$feature' failed the owned spec-semantic lint (fail-closed):"
    printf '%s\n' "$out"
  } >&2
  exit 2
fi
exit 0
