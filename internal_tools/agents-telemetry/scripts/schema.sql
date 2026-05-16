-- agents-telemetry event store (Phase 1, local-only)
-- See ../docs/architecture.md for the design context.

PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS events (
  id                          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts                          TEXT    NOT NULL,            -- ISO8601 UTC
  session_id                  TEXT,
  agent_id                    TEXT,                        -- NULL = parent-context event, non-NULL = child tool call inside a subagent
  project                     TEXT    NOT NULL DEFAULT 'domainspec',
  event                       TEXT    NOT NULL,            -- dispatch.start | dispatch.end | skill.start
  tool                        TEXT,                        -- Agent | Skill | ...
  agent_name                  TEXT,                        -- subagent_type or skill name
  callsign                    TEXT,
  prompt_chars                INTEGER,
  prompt_sha256               TEXT,                        -- NULL unless TELEMETRY_CAPTURE_PROMPTS=1
  -- Fields harvested from PostToolUse payloads (NULL on Pre events):
  duration_ms                 INTEGER,
  total_tokens                INTEGER,
  input_tokens                INTEGER,
  cache_creation_input_tokens INTEGER,
  cache_read_input_tokens     INTEGER,
  output_tokens               INTEGER,
  -- Forward-compat for Phase 2 cloud-ship:
  shipped_at                  TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_ts          ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_session     ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_agent_name  ON events(agent_name);
CREATE INDEX IF NOT EXISTS idx_events_unshipped   ON events(shipped_at) WHERE shipped_at IS NULL;
