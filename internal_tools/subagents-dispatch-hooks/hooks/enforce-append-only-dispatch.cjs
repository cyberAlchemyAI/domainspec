#!/usr/bin/env node
'use strict';
/*
 * PreToolUse(Edit|MultiEdit|Write|NotebookEdit|Bash|PowerShell) hook — enforce
 * that the dispatch registry <repo-root>/telemetry/agents/subagents-dispatch.yaml
 * is APPEND-ONLY.
 *
 * The only sanctioned write path is the skill's appender
 * (skills/register-dispatch/append-dispatch.cjs): new rows, or appended
 * `close_of` events. Rows are never edited in place. The sanctioned appender
 * call derives the ledger path internally and never names the file on the
 * command line, so it does not trip the command check at all — there is
 * deliberately NO "command mentions append-dispatch.cjs" escape hatch (that
 * hatch let a trailing comment disable enforcement).
 *
 * Denies:
 *   - Edit / MultiEdit / Write / NotebookEdit targeting the registry directly
 *     (path canonicalized first, so ./  ../  //  and trailing spaces can't slip).
 *   - Bash / PowerShell commands that name the registry file unless the first
 *     token is a known read-only reader (cat, ls, wc, rg, jq, git diff/show/
 *     log/status/add, …) with no redirection or write verb anywhere. When in
 *     doubt, deny.
 *
 * This is a guardrail against the realistic failure mode (an agent "helpfully"
 * editing a row in place), NOT a security boundary: command-string inspection
 * is best-effort and a determined caller can still evade it.
 *
 * Fail-open: any internal error exits 0 with no output, so a hook problem
 * never blocks unrelated work. Canonical source; installed by install.cjs.
 */
const fs = require('fs');
const path = require('path');

const LEDGER_SUFFIX = 'telemetry/agents/subagents-dispatch.yaml';
const REASON =
  'telemetry/agents/subagents-dispatch.yaml is append-only; use the official appender ' +
  'append-dispatch.cjs (new rows, or appended close_of events) — never edit existing lines. ' +
  'See the register-dispatch skill.';

// Canonicalize a path: trim, forward slashes, lowercase, then collapse
// `.` / `..` / duplicate slashes so equivalent spellings compare equal.
const canon = (p) => path.posix.normalize(String(p).trim().split('\\').join('/').toLowerCase());

function targetsLedgerPath(toolInput) {
  const p = toolInput.file_path || toolInput.notebook_path;
  return p != null && canon(p).endsWith(LEDGER_SUFFIX);
}

// A command that merely READS the ledger may pass. It must (a) start with a
// known read-only command, and (b) contain no redirection or write verb
// anywhere in the string. Anything else over the ledger is denied.
function isReadOnlyCommand(cmd) {
  if (/[<>]/.test(cmd)) return false; // any redirection -> not read-only
  if (/\|\s*(tee|set-content|add-content|out-file)\b/i.test(cmd)) return false; // piped writer
  if (/\b(tee|sed|awk|perl|rm|mv|cp|del|truncate)\b/i.test(cmd)) return false;
  if (/\b(set-content|sc|add-content|ac|out-file|clear-content|remove-item|ri|move-item|copy-item|new-item|ni|tee-object)\b/i.test(cmd)) return false;
  const first = (cmd.trim().split(/\s+/)[0] || '').toLowerCase().replace(/\.exe$/, '');
  const READ_ONLY = [
    'cat', 'get-content', 'gc', 'rg', 'grep', 'head', 'tail',
    'ls', 'dir', 'get-childitem', 'gci', 'stat', 'wc', 'less', 'more',
    'select-string', 'sls', 'jq', 'yq', 'file', 'type',
  ];
  if (READ_ONLY.includes(first)) return true;
  if (first === 'node' && /\s--check\b/.test(cmd)) return true;
  // git: allow read/stage subcommands; deny destructive ones (checkout/restore
  // could revert appended rows).
  if (first === 'git') {
    const sub = (cmd.trim().split(/\s+/)[1] || '').toLowerCase();
    return ['diff', 'show', 'log', 'status', 'add', 'blame', 'cat-file', 'stash'].includes(sub);
  }
  return false; // in doubt, deny
}

try {
  const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
  const toolName = payload.tool_name || '';
  const toolInput = payload.tool_input || {};

  let deny = false;
  if (['Edit', 'MultiEdit', 'Write', 'NotebookEdit'].includes(toolName)) {
    deny = targetsLedgerPath(toolInput);
  } else if (['Bash', 'PowerShell'].includes(toolName)) {
    const cmd = String(toolInput.command || '');
    if (cmd.toLowerCase().includes('subagents-dispatch.yaml')) {
      deny = !isReadOnlyCommand(cmd);
    }
  }

  if (deny) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: REASON,
      },
    }));
  }
} catch (_) { /* fail-open: no output */ }

process.exit(0);
