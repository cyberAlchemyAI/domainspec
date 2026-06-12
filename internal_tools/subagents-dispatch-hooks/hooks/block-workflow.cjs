#!/usr/bin/env node
'use strict';
/*
 * PreToolUse(Workflow) hook — hard-block the Workflow tool so the agent uses
 * the Agent tool (or the `research` skill) for subagent dispatch instead of
 * multi-agent Workflow orchestration.
 *
 * Portable: Node-only, no external deps. Deterministic deny — the Workflow
 * call never executes. Canonical source; installed by install.cjs.
 */
const fs = require('fs');

try { fs.readFileSync(0, 'utf8'); } catch (_) { /* drain stdin; payload unused */ }

const reason =
  'Workflow is disabled in this project by policy. Use the Agent tool for subagent ' +
  'dispatch, or invoke the `research` skill for explorer→skeptic→writer→auditor ' +
  'fan-out. If you believe a Workflow is genuinely required, stop and ask the user to ' +
  'lift this policy rather than working around it.';

try {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
} catch (_) { /* ignore */ }

process.exit(0);
