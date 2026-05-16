#!/usr/bin/env bash
# Agent & skill telemetry — appends one row per event to data/events.db.
# Called by Claude Code PreToolUse/PostToolUse hooks.
# Usage: log.sh <pre|post> <task|skill>
#
# Design: ../docs/architecture.md
# Schema: ./schema.sql

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TELEM_DIR="$(dirname "$SCRIPT_DIR")"

# Fast-path: exit immediately if telemetry is disabled (sub-ms when off).
[ ! -f "$TELEM_DIR/.enabled" ] && exit 0

EVENT_TYPE="${1:-pre}"   # pre | post
TOOL_TYPE="${2:-task}"   # task | skill

DATA_DIR="$TELEM_DIR/data"
EVENTS_DB="$DATA_DIR/events.db"
SCHEMA_FILE="$SCRIPT_DIR/schema.sql"
CANON_FILE="$TELEM_DIR/canon.json"

# Lazy DB init.
if [ ! -f "$EVENTS_DB" ]; then
  mkdir -p "$DATA_DIR"
  sqlite3 -cmd ".timeout 5000" "$EVENTS_DB" < "$SCHEMA_FILE" >/dev/null 2>&1 || exit 0
fi

INPUT=$(cat)

SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // ""')
AGENT_ID=$(printf '%s'   "$INPUT" | jq -r '.agent_id   // ""')
TOOL_NAME=$(printf '%s'  "$INPUT" | jq -r '.tool_name  // ""')

if [ "$TOOL_TYPE" = "skill" ]; then
  AGENT_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_input.skill // ""')
  PROMPT_TEXT=$(printf '%s' "$INPUT" | jq -r '.tool_input.args  // ""')
else
  # PreToolUse has tool_input.subagent_type; PostToolUse only carries
  # tool_response.agentType (and tool_response.agentId for correlation).
  AGENT_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_input.subagent_type // .tool_response.agentType // ""')
  PROMPT_TEXT=$(printf '%s' "$INPUT" | jq -r '.tool_input.prompt        // ""')
  [ -z "$AGENT_ID" ] && AGENT_ID=$(printf '%s' "$INPUT" | jq -r '.tool_response.agentId // ""')
fi

# Filter: only log domainspec catalog agents/skills.
case "$AGENT_NAME" in
  domainspec-*|gsd-*|mars-*) ;;
  *) exit 0 ;;
esac

# Event name.
if [ "$TOOL_TYPE" = "skill" ]; then
  EVENT="skill.start"
elif [ "$EVENT_TYPE" = "post" ]; then
  EVENT="dispatch.end"
else
  EVENT="dispatch.start"
fi

# Callsign: random thinker from canon + 4-hex suffix.
CANON_COUNT=$(jq 'length' "$CANON_FILE")
CANON_IDX=$((RANDOM % CANON_COUNT))
CANON_NAME=$(jq -r ".[$CANON_IDX]" "$CANON_FILE")
HEX=$(printf '%04x' $((RANDOM % 65536)))
CALLSIGN="${CANON_NAME}-${HEX}"

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

PROMPT_CHARS=$(printf '%s' "$PROMPT_TEXT" | wc -c | tr -d ' ')

PROMPT_SHA256=""
if [ "${TELEMETRY_CAPTURE_PROMPTS:-0}" = "1" ] && [ -n "$PROMPT_TEXT" ]; then
  PROMPT_SHA256=$(printf '%s' "$PROMPT_TEXT" | shasum -a 256 | awk '{print $1}')
fi

# Harvest rich PostToolUse fields (NULL on Pre).
DURATION_MS=""
TOTAL_TOKENS=""
INPUT_TOKENS=""
CACHE_CREATION=""
CACHE_READ=""
OUTPUT_TOKENS=""
if [ "$EVENT_TYPE" = "post" ]; then
  DURATION_MS=$(printf '%s'   "$INPUT" | jq -r '.tool_response.totalDurationMs // .duration_ms // ""')
  TOTAL_TOKENS=$(printf '%s'  "$INPUT" | jq -r '.tool_response.totalTokens // ""')
  INPUT_TOKENS=$(printf '%s'  "$INPUT" | jq -r '.tool_response.usage.input_tokens                // ""')
  CACHE_CREATION=$(printf '%s' "$INPUT" | jq -r '.tool_response.usage.cache_creation_input_tokens // ""')
  CACHE_READ=$(printf '%s'    "$INPUT" | jq -r '.tool_response.usage.cache_read_input_tokens     // ""')
  OUTPUT_TOKENS=$(printf '%s' "$INPUT" | jq -r '.tool_response.usage.output_tokens               // ""')
fi

# SQL single-quote escape (double any embedded apostrophes, wrap in '').
sq() { printf "'%s'" "$(printf '%s' "$1" | sed "s/'/''/g")"; }

# Build the INSERT via sqlite3 parameter substitution. Every value is
# SQL-quoted by sq() so we never interpolate untrusted strings raw.
sqlite3 "$EVENTS_DB" \
  -cmd ".timeout 5000" \
  -cmd ".parameter set :ts             $(sq "$TS")" \
  -cmd ".parameter set :session_id     $(sq "$SESSION_ID")" \
  -cmd ".parameter set :agent_id       $(sq "$AGENT_ID")" \
  -cmd ".parameter set :event          $(sq "$EVENT")" \
  -cmd ".parameter set :tool           $(sq "$TOOL_NAME")" \
  -cmd ".parameter set :agent_name     $(sq "$AGENT_NAME")" \
  -cmd ".parameter set :callsign       $(sq "$CALLSIGN")" \
  -cmd ".parameter set :prompt_chars   $(sq "$PROMPT_CHARS")" \
  -cmd ".parameter set :prompt_sha256  $(sq "$PROMPT_SHA256")" \
  -cmd ".parameter set :duration_ms    $(sq "$DURATION_MS")" \
  -cmd ".parameter set :total_tokens   $(sq "$TOTAL_TOKENS")" \
  -cmd ".parameter set :input_tokens   $(sq "$INPUT_TOKENS")" \
  -cmd ".parameter set :cache_creation $(sq "$CACHE_CREATION")" \
  -cmd ".parameter set :cache_read     $(sq "$CACHE_READ")" \
  -cmd ".parameter set :output_tokens  $(sq "$OUTPUT_TOKENS")" \
  "INSERT INTO events (
     ts, session_id, agent_id, event, tool, agent_name, callsign,
     prompt_chars, prompt_sha256,
     duration_ms, total_tokens, input_tokens,
     cache_creation_input_tokens, cache_read_input_tokens, output_tokens
   ) VALUES (
     :ts,
     NULLIF(:session_id, ''),
     NULLIF(:agent_id, ''),
     :event,
     NULLIF(:tool, ''),
     NULLIF(:agent_name, ''),
     :callsign,
     :prompt_chars,
     NULLIF(:prompt_sha256, ''),
     NULLIF(:duration_ms, ''),
     NULLIF(:total_tokens, ''),
     NULLIF(:input_tokens, ''),
     NULLIF(:cache_creation, ''),
     NULLIF(:cache_read, ''),
     NULLIF(:output_tokens, '')
   );" 2>/dev/null || exit 0

exit 0
