#!/usr/bin/env node
'use strict';
/*
 * PreToolUse(Agent) hook — REMINDER ONLY. Writes no ledger.
 *
 * Nudges the agent to record the dispatch via the `register-dispatch` skill
 * (one row per dispatch, with each agent's angle and the anti_bias axis). The
 * skill does the writing; this hook only reminds. Fail-open.
 */
const fs = require('fs');

try { fs.readFileSync(0, 'utf8'); } catch (_) { /* drain stdin; payload unused */ }

const msg =
  'Reminder: record this dispatch in <repo-root>/telemetry/agents/subagents-dispatch.yaml via the ' +
  "`register-dispatch` skill — one row per dispatch, with each agent's angle and the " +
  'anti_bias axis. Register once per dispatch (not per agent); it is a no-op if the ' +
  'dispatch_id is already registered.';

try {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: msg },
  }));
} catch (_) { /* ignore */ }

process.exit(0);
