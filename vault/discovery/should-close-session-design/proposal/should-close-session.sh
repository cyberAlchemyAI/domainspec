#!/usr/bin/env bash
# should-close-session: Stop hook that observes (and eventually nudges) when
# close-session would write a non-trivial signpost.
#
# Design: vault/discovery/should-close-session-design/
# Sibling: vault/discovery/close-session-redesign/proposal/SKILL.md
#
# Failure model assumed:
#   - Nagging is worse than missing a close. Silence is the default.
#   - The agent reading our output will rationalize any verdict. We emit
#     observations, never recommendations.
#   - Solo-dev scale. No state machines, no trust scores, no telemetry beyond
#     append-only JSONL.
#
# Lifecycle: ship with OBSERVE_ONLY=1 for ~20 sessions; review the log; then
# flip to live or delete.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || exit 0)"
[ -z "$REPO_ROOT" ] && exit 0

cd "$REPO_ROOT"

# -------- config --------
OBSERVE_ONLY="${SHOULD_CLOSE_OBSERVE_ONLY:-1}"     # 1 = log only, 0 = emit
LOG_PATH="$REPO_ROOT/.claude/state/should-close-observations.jsonl"
SCRATCHPAD_DIR="$REPO_ROOT/.claude/current_conversations"
VAULT_PATHS=("domain_knowledge" "src" "experiments" "scripts" "data")

mkdir -p "$(dirname "$LOG_PATH")" "$SCRATCHPAD_DIR"

# -------- single-fire-per-session sentinel --------
# Sentinel lives next to the oldest scratchpad. Dies when the scratchpad dies
# (close-session deletes the scratchpad on successful write). No cleanup
# coupling — if no scratchpad exists, no sentinel is needed; we exit.
oldest_scratchpad="$(ls -t "$SCRATCHPAD_DIR"/*.md 2>/dev/null | tail -1 || true)"
[ -z "$oldest_scratchpad" ] && exit 0

sentinel="${oldest_scratchpad%.md}.should-close-fired"
[ -f "$sentinel" ] && exit 0

# -------- the single hard gate: would close-session write a note? --------
# Mirror the sibling skill's Step 0 triage: git status non-empty within
# vault-relevant paths. No transcript parsing, no vocabulary detection.
changed=()
while IFS= read -r line; do
  # `git status --porcelain` format: "XY path"
  path="${line:3}"
  for vp in "${VAULT_PATHS[@]}"; do
    case "$path" in
      "$vp"/*|"$vp") changed+=("$path"); break;;
    esac
  done
done < <(git status --porcelain 2>/dev/null | head -50)

# Hard veto: nothing semantic changed → silent, no log entry.
[ ${#changed[@]} -eq 0 ] && exit 0

# -------- build the observation --------
n_changed=${#changed[@]}
scratchpad_lines="$(wc -l < "$oldest_scratchpad" 2>/dev/null | tr -d ' ' || echo 0)"
timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
session_key="$(basename "$oldest_scratchpad" .md)"

# Mechanical observables only. No "close now," no "looks done."
obs="should-close-session: git shows $n_changed file(s) changed in vault paths"
obs="$obs; scratchpad $session_key has $scratchpad_lines lines"
obs="$obs; close-session would write a note."

# Append to log regardless of mode (observe-only AND live both log).
printf '{"ts":"%s","session":"%s","n_changed":%d,"scratchpad_lines":%s,"paths":%s,"mode":"%s"}\n' \
  "$timestamp" "$session_key" "$n_changed" "$scratchpad_lines" \
  "$(printf '%s\n' "${changed[@]}" | head -10 | jq -R . | jq -s -c .)" \
  "$([ "$OBSERVE_ONLY" = "1" ] && echo observe || echo live)" \
  >> "$LOG_PATH"

# Always set the sentinel so we don't double-log within a session.
touch "$sentinel"

# Observe-only: log and exit silently.
[ "$OBSERVE_ONLY" = "1" ] && exit 0

# Live: emit the observation as additionalContext for the agent's next turn.
# Schema: { "hookSpecificOutput": { "hookEventName": "Stop",
#           "additionalContext": "<string>" } }
# If your Claude Code build doesn't surface Stop additionalContext, the
# observation still lands in the JSONL log — review it manually.
printf '{"hookSpecificOutput":{"hookEventName":"Stop","additionalContext":%s}}\n' \
  "$(printf '%s' "$obs" | jq -R -s .)"

exit 0
