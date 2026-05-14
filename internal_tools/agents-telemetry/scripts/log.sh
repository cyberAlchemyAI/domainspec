#!/usr/bin/env bash
# Agent & skill telemetry — writes one YAML document per event to data/events.yaml.
# Called by Claude Code PreToolUse/PostToolUse hooks.
# Usage: log.sh <pre|post> <task|skill>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TELEM_DIR="$(dirname "$SCRIPT_DIR")"

# Fast-path: exit immediately if telemetry is disabled
[ ! -f "$TELEM_DIR/.enabled" ] && exit 0

EVENT_TYPE="${1:-pre}"   # pre | post
TOOL_TYPE="${2:-task}"   # task | skill

DATA_DIR="$TELEM_DIR/data"
EVENTS_FILE="$DATA_DIR/events.yaml"
CANON_FILE="$TELEM_DIR/canon.json"

# Read hook event JSON from stdin
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // ""')
TOOL_NAME=$(echo "$INPUT"  | jq -r '.tool_name  // ""')

if [ "$TOOL_TYPE" = "skill" ]; then
  AGENT_NAME=$(echo "$INPUT" | jq -r '.tool_input.skill // ""')
  PROMPT_TEXT=$(echo "$INPUT" | jq -r '.tool_input.args  // ""')
else
  AGENT_NAME=$(echo "$INPUT" | jq -r '.tool_input.subagent_type // ""')
  PROMPT_TEXT=$(echo "$INPUT" | jq -r '.tool_input.prompt        // ""')
fi

# Filter: only log domainspec catalog agents/skills
case "$AGENT_NAME" in
  domainspec-*|gsd-*|mars-*) ;;
  *) exit 0 ;;
esac

# Map event name
if [ "$TOOL_TYPE" = "skill" ]; then
  EVENT="skill.start"
elif [ "$EVENT_TYPE" = "post" ]; then
  EVENT="dispatch.end"
else
  EVENT="dispatch.start"
fi

# Pick a callsign: random thinker from canon + 4-hex suffix
CANON_COUNT=$(jq 'length' "$CANON_FILE")
CANON_IDX=$((RANDOM % CANON_COUNT))
CANON_NAME=$(jq -r ".[$CANON_IDX]" "$CANON_FILE")
HEX=$(printf '%04x' $((RANDOM % 65536)))
CALLSIGN="${CANON_NAME}-${HEX}"

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

PROMPT_CHARS=$(printf '%s' "$PROMPT_TEXT" | wc -c | tr -d ' ')

# SHA256 only when opt-in env var is set (privacy default: off)
PROMPT_SHA256=""
if [ "${TELEMETRY_CAPTURE_PROMPTS:-0}" = "1" ] && [ -n "$PROMPT_TEXT" ]; then
  PROMPT_SHA256=$(printf '%s' "$PROMPT_TEXT" | shasum -a 256 | awk '{print $1}')
fi

# Append one YAML document to events.yaml.
# mkdir-based lock handles parallel dispatches (POSIX atomic, macOS compatible).
LOCK_DIR="${EVENTS_FILE}.lock.d"
while ! mkdir "$LOCK_DIR" 2>/dev/null; do sleep 0.05; done
trap "rmdir '$LOCK_DIR'" EXIT

{
  echo "---"
  echo "ts: \"$TS\""
  echo "session_id: \"$SESSION_ID\""
  echo "project: domainspec"
  echo "event: $EVENT"
  echo "tool: $TOOL_NAME"
  echo "agent_name: $AGENT_NAME"
  echo "callsign: \"$CALLSIGN\""
  echo "prompt_chars: $PROMPT_CHARS"
  [ -n "$PROMPT_SHA256" ] && echo "prompt_sha256: \"$PROMPT_SHA256\""
} >> "$EVENTS_FILE"

exit 0
