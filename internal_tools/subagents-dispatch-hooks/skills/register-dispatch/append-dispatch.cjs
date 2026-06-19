#!/usr/bin/env node
'use strict';
/*
 * Append one row to <repo-root>/telemetry/agents/subagents-dispatch.yaml.
 *
 *   node append-dispatch.cjs <record.json>
 *
 * <record.json> is a UTF-8 JSON file (a file arg, not stdin, so shell encoding
 * — e.g. PowerShell's UTF-16 pipes — can't corrupt the payload).
 *
 * SCHEMA — subagents-strategy constitution v0.6.0 (row schema; group `role`
 * removed at v0.6.0 — §11). Two row kinds, both appended by this script
 * (Principle 3: two appends, one place):
 *
 *   DISPATCH ROW — keyed by `dispatch_id`. Required: dispatch_id,
 *     schema_version ("0.6.0" exactly), dispatch_type
 *     (research|code|review|plan|suggestion|experiment), goal, context, max_loops (1..5),
 *     final_approver, groups[] (each group: group_id, agents[] — NO group
 *     `role` field; each agent: role explorer|synthesizer|skeptic|writer|auditor, model,
 *     token_budget, initial_prompt). Optional: meta (true), parent_dispatch_id,
 *     anti_bias_global, working_folder (REQUIRED for LIVE types research/review/experiment; never vault/),
 *     invoked_by (tooling extension, not in constitution §5),
 *     connections[] ({from,to,type,loop_cap?}).
 *   CLOSE ROW — keyed by `close_of`. Required: exit_reason
 *     (resolved|loop_ceiling_reached|dissent_irreconcilable|user_abort|error)
 *     and agents_spawned ({total, tree, loops_used}). Optional:
 *     feedback_prompts[] (verbatim feedback-edge asks — Principle 3),
 *     invoked_by (tooling extension, not in constitution §5).
 *
 * NOT ENFORCED here (deliberate — sheet-design rules owned by the strategist
 * and the human confirm gate): dispatch_id YYYY-MM-DD-<slug> format; P12
 * no-self-approval (final_approver never a working-group member); the
 * layers>1 not-on-a-zig-zag/feedback-endpoint corollary; the semantic
 * four-test anti-bias decision rule (constitution P5: axis vocabulary /
 * clone / spread / evidence — gate-checked on the sheet). The anti_bias_global
 * required-when->=2-groups-fan-out conditional IS enforced here (2026-06-12
 * in-place amendment, constitution §9).
 *
 * `created`/`closed` are STAMPED by the appender (never supplied by the
 * caller). `invoked_by` is taken from the record when present, otherwise
 * resolved via `git config user.email` (fail-soft: warning + null).
 * `project_dir` is a control key (repo-root fallback), never emitted.
 *
 * VALIDATION SPLIT (grandfathering — constitution §2):
 *   - The INCOMING record is validated STRICTLY against the v0.5.2 schema
 *     before append: required fields, closed enums, conditional fields
 *     (working_folder on research; anti_bias/angle at n >= 2;
 *     anti_bias_global when >= 2 groups have >= 2 agents; n ==
 *     agents.length; loop_cap only on zig-zag/feedback; connection endpoints
 *     declared), and unknown-key rejection — keys in constitution §7's removed
 *     table (success_metric, constraints, created) get a removed-by-v0.5.2
 *     error; old ledger-row-only keys (status, top-level anti_bias, top-level
 *     agents, corpus, topic_slug, session) get a pre-v0.5.2-ledger-row error.
 *     Exit 2.
 *   - The EXISTING ledger passes only the STRUCTURAL SELF-CHECK below
 *     (zero-dep, line-based — the file is machine-written in a known shape):
 *     every non-comment line is the `dispatches:` key, a `  - key: <json>`
 *     row start, or a `    key: <json>` continuation; every value parses as
 *     JSON; rows start with dispatch_id or close_of; ids are unique. Rows
 *     written under pre-v0.5.2 schemas are grandfathered historical artifacts
 *     and are NEVER re-validated semantically — old keys keep passing. On
 *     structural corruption the appender refuses to append (exit 1) so
 *     corruption surfaces at the next write instead of accumulating silently.
 *
 * Emission style: scalar fields as block keys; `groups`/`connections`
 * (dispatch row) and `agents_spawned`/`feedback_prompts` (close row) as JSON
 * flow values ("JSON columns") — valid YAML, appendable with no YAML parser;
 * JSON.stringify escapes the newlines inside initial_prompt, which is the
 * point. Idempotent: a dispatch_id/close_of already present is a no-op.
 *
 * The registry is APPEND-ONLY (enforced by the enforce-append-only-dispatch
 * hook): a dispatch row is never edited after the fact; closing a dispatch is
 * the appended close row, never an edit (constitution Principle 3).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = process.argv[2];
if (!src) { console.error('usage: node append-dispatch.cjs <record.json>'); process.exit(2); }

let rec;
try { rec = JSON.parse(fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '')); } // strip UTF-8 BOM
catch (e) { console.error('cannot read/parse record:', e.message); process.exit(2); }
if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
  console.error('record must be a JSON object'); process.exit(2);
}

const J = (v) => JSON.stringify(v);   // valid YAML scalar / flow value
const isStr = (v) => typeof v === 'string';
const isNonEmptyStr = (v) => isStr(v) && v.trim() !== '';
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// ---------------------------------------------------------------- schema
const SCHEMA_VERSION = '0.6.0';   // row schema: group `role` removed at v0.6.0 (constitution §11)
const DISPATCH_TYPES = ['research', 'code', 'review', 'plan', 'suggestion', 'experiment'];
// LIVE per constitution §5 (review 2026-06-12; experiment 2026-06-14, owner decisions); others
// RESERVED (code, plan, suggestion) — recorded but not yet dispatchable.
const LIVE_TYPES = new Set(['research', 'review', 'experiment']);
// Group `role` was removed from the row schema at v0.6.0 (constitution §11 / CR-2): a group's
// function is read off its agents' roles, its workflow position off its connections.
const AGENT_ROLES = ['explorer', 'synthesizer', 'skeptic', 'writer', 'auditor'];
const CONNECTION_TYPES = ['sequential', 'zig-zag', 'feedback'];
const EXIT_REASONS = ['resolved', 'loop_ceiling_reached', 'dissent_irreconcilable', 'user_abort', 'error'];

const DISPATCH_KEYS = new Set([
  'dispatch_id', 'schema_version', 'dispatch_type', 'goal', 'context',
  'max_loops', 'final_approver', 'groups',                       // required
  'meta', 'parent_dispatch_id', 'anti_bias_global', 'working_folder',
  'invoked_by', 'connections',                                   // optional
  'project_dir',                                                 // control key, not emitted
]);
const CLOSE_KEYS = new Set([
  'close_of', 'exit_reason', 'agents_spawned',                   // required
  'feedback_prompts', 'invoked_by',                              // optional
  'project_dir',                                                 // control key, not emitted
]);
// Keys in constitution §7's removed table — rejected with an explicit
// removed-by-v0.5.2 message. (`created`/`closed` are stamped by the appender,
// never caller-supplied.)
const REMOVED_KEYS = new Set(['success_metric', 'constraints', 'created']);
// Old ledger-row-only keys (pre-v0.5.2 ledger format; not in §7's removed
// table — e.g. `anti_bias`/`agents` live at group level in v0.5.2, never top
// level). Rejected with a pre-v0.5.2-ledger-row message.
const LEGACY_LEDGER_KEYS = new Set([
  'status', 'anti_bias', 'agents', 'corpus', 'topic_slug', 'session',
]);
const GROUP_KEYS = new Set(['group_id', 'agents', 'n', 'robot_talks', 'layers', 'anti_bias']);
const AGENT_KEYS = new Set(['role', 'model', 'token_budget', 'initial_prompt', 'agent_name', 'angle']);
const CONN_KEYS = new Set(['from', 'to', 'type', 'loop_cap']);

function validateDispatch(rec) {
  const errs = [];
  for (const k of Object.keys(rec)) {
    if (DISPATCH_KEYS.has(k)) continue;
    if (REMOVED_KEYS.has(k)) errs.push(`"${k}" was removed by schema v0.5.2 — drop it from the record`);
    else if (LEGACY_LEDGER_KEYS.has(k)) errs.push(`"${k}" is a pre-v0.5.2 ledger-row key, not in the v0.5.2 schema — drop it from the record`);
    else errs.push(`unknown key "${k}" on a dispatch record`);
  }
  if (!isNonEmptyStr(rec.dispatch_id)) errs.push('dispatch_id is required and must be a non-empty string');
  if (rec.schema_version !== SCHEMA_VERSION) errs.push(`schema_version must be exactly "${SCHEMA_VERSION}" (got ${J(rec.schema_version)})`);
  if (!DISPATCH_TYPES.includes(rec.dispatch_type)) errs.push(`dispatch_type must be one of ${DISPATCH_TYPES.join(' | ')} (got ${J(rec.dispatch_type)})`);
  if (!isNonEmptyStr(rec.goal)) errs.push('goal is required and must be a non-empty string');
  if (!isNonEmptyStr(rec.context)) errs.push('context is required and must be a non-empty string (subagents never see the parent conversation — §5)');
  if (!Number.isInteger(rec.max_loops) || rec.max_loops < 1 || rec.max_loops > 5) errs.push(`max_loops must be an integer in 1..5 (got ${J(rec.max_loops)})`);
  if (!isNonEmptyStr(rec.final_approver)) errs.push('final_approver is required and must be a non-empty string');
  if (rec.meta !== undefined && rec.meta !== true) errs.push('meta, when present, must be boolean true (omit it otherwise — §5)');
  if (rec.parent_dispatch_id !== undefined && rec.parent_dispatch_id !== null && !isNonEmptyStr(rec.parent_dispatch_id)) errs.push('parent_dispatch_id must be a non-empty string (or null / omitted)');
  if (rec.anti_bias_global !== undefined && !isNonEmptyStr(rec.anti_bias_global)) errs.push('anti_bias_global, when present, must be a non-empty string');
  if (rec.invoked_by !== undefined && !isNonEmptyStr(rec.invoked_by)) errs.push('invoked_by, when present, must be a non-empty string (email)');
  if (rec.project_dir !== undefined && !isNonEmptyStr(rec.project_dir)) errs.push('project_dir, when present, must be a non-empty string');

  if (LIVE_TYPES.has(rec.dispatch_type) && rec.working_folder === undefined) {
    errs.push(`working_folder is required when dispatch_type is "${rec.dispatch_type}" (§5)`);
  }
  if (rec.working_folder !== undefined) {
    if (!isNonEmptyStr(rec.working_folder)) errs.push('working_folder must be a non-empty string');
    else {
      // Normalize before the vault guard: strip leading "./" / ".\", match
      // case-insensitively, and reject bare "vault" as well as vault/ prefixes.
      const wf = rec.working_folder.replace(/^\.[\/\\]+/, '');
      if (/^vault([\/\\]|$)/i.test(wf)) errs.push(`working_folder must never point into vault/ (§5: "Never vault/**") — got ${J(rec.working_folder)}`);
    }
  }

  const groupIds = new Set();
  if (!Array.isArray(rec.groups) || rec.groups.length === 0) {
    errs.push('groups is required and must be a non-empty array');
  } else {
    rec.groups.forEach((g, gi) => {
      const gw = `groups[${gi}]`;
      if (!isObj(g)) { errs.push(`${gw} must be an object`); return; }
      for (const k of Object.keys(g)) if (!GROUP_KEYS.has(k)) errs.push(`${gw}: unknown key "${k}"`);
      if (!isNonEmptyStr(g.group_id)) errs.push(`${gw}.group_id is required and must be a non-empty string`);
      else if (groupIds.has(g.group_id)) errs.push(`${gw}.group_id ${J(g.group_id)} duplicates an earlier group — group ids must be unique`);
      else groupIds.add(g.group_id);
      const agents = Array.isArray(g.agents) && g.agents.length > 0 ? g.agents : null;
      if (!agents) errs.push(`${gw}.agents is required and must be a non-empty array`);
      if (g.n !== undefined) {
        if (!Number.isInteger(g.n) || g.n < 1) errs.push(`${gw}.n must be an integer >= 1 (got ${J(g.n)})`);
        else if (agents && g.n !== agents.length) errs.push(`${gw}.n (${g.n}) must equal agents.length (${agents.length})`);
      }
      if (g.robot_talks !== undefined && typeof g.robot_talks !== 'boolean') errs.push(`${gw}.robot_talks must be a boolean`);
      if (g.layers !== undefined && (!Number.isInteger(g.layers) || g.layers < 1)) errs.push(`${gw}.layers must be an integer >= 1 (got ${J(g.layers)})`);
      const fanout = agents !== null && agents.length >= 2;
      if (fanout && !isNonEmptyStr(g.anti_bias)) errs.push(`${gw}.anti_bias is required when the group has >= 2 agents (Principle 5)`);
      if (!fanout && g.anti_bias !== undefined && !isNonEmptyStr(g.anti_bias)) errs.push(`${gw}.anti_bias, when present, must be a non-empty string`);
      if (agents) agents.forEach((a, ai) => {
        const aw = `${gw}.agents[${ai}]`;
        if (!isObj(a)) { errs.push(`${aw} must be an object`); return; }
        for (const k of Object.keys(a)) if (!AGENT_KEYS.has(k)) errs.push(`${aw}: unknown key "${k}"`);
        if (!AGENT_ROLES.includes(a.role)) errs.push(`${aw}.role must be one of ${AGENT_ROLES.join(' | ')} (got ${J(a.role)})`);
        if (!isNonEmptyStr(a.model)) errs.push(`${aw}.model is required and must be a non-empty string`);
        if (!Number.isInteger(a.token_budget) || a.token_budget <= 0) errs.push(`${aw}.token_budget is required and must be a positive integer — no unlimited default (§5)`);
        if (!isNonEmptyStr(a.initial_prompt)) errs.push(`${aw}.initial_prompt is required and must be a non-empty string`);
        if (a.agent_name !== undefined && a.agent_name !== null && !isNonEmptyStr(a.agent_name)) errs.push(`${aw}.agent_name must be a string or null`);
        if (fanout && !isNonEmptyStr(a.angle)) errs.push(`${aw}.angle is required when the group has >= 2 agents (Principle 5)`);
        if (!fanout && a.angle !== undefined && !isNonEmptyStr(a.angle)) errs.push(`${aw}.angle, when present, must be a non-empty string`);
      });
    });
    const fanoutGroups = rec.groups.filter((g) => isObj(g) && Array.isArray(g.agents) && g.agents.length >= 2).length;
    if (fanoutGroups >= 2 && !isNonEmptyStr(rec.anti_bias_global)) {
      errs.push(`anti_bias_global is required when >= 2 groups have >= 2 agents (${fanoutGroups} fan-out groups declared — §5 conditional, Principle 5)`);
    }
  }

  if (rec.connections !== undefined) {
    if (!Array.isArray(rec.connections)) errs.push('connections must be an array of {from, to, type, loop_cap?}');
    else rec.connections.forEach((c, ci) => {
      const cw = `connections[${ci}]`;
      if (!isObj(c)) { errs.push(`${cw} must be an object`); return; }
      for (const k of Object.keys(c)) if (!CONN_KEYS.has(k)) errs.push(`${cw}: unknown key "${k}" — connections are exactly {from, to, type, loop_cap?} (§5)`);
      for (const end of ['from', 'to']) {
        if (!isNonEmptyStr(c[end])) errs.push(`${cw}.${end} is required and must be a group_id string`);
        else if (!groupIds.has(c[end])) errs.push(`${cw}.${end} ${J(c[end])} does not reference a declared group_id`);
      }
      if (!CONNECTION_TYPES.includes(c.type)) errs.push(`${cw}.type must be one of ${CONNECTION_TYPES.join(' | ')} (got ${J(c.type)})`);
      if (c.loop_cap !== undefined) {
        if (c.type === 'sequential') errs.push(`${cw}: loop_cap must be ABSENT on a sequential connection (§5)`);
        else if (!Number.isInteger(c.loop_cap) || c.loop_cap <= 0) errs.push(`${cw}.loop_cap must be a positive integer (got ${J(c.loop_cap)})`);
      }
    });
  }
  return errs;
}

function validateClose(rec) {
  const errs = [];
  if (rec.dispatch_id !== undefined) errs.push('a close record must use close_of, not dispatch_id');
  for (const k of Object.keys(rec)) {
    if (k === 'dispatch_id' || CLOSE_KEYS.has(k)) continue;
    if (REMOVED_KEYS.has(k)) errs.push(`"${k}" was removed by schema v0.5.2 — drop it from the record`);
    else if (LEGACY_LEDGER_KEYS.has(k)) errs.push(`"${k}" is a pre-v0.5.2 ledger-row key, not in the v0.5.2 schema — drop it from the record`);
    else errs.push(`unknown key "${k}" on a close record`);
  }
  if (!isNonEmptyStr(rec.close_of)) errs.push('close_of must be a non-empty string');
  if (!EXIT_REASONS.includes(rec.exit_reason)) errs.push(`exit_reason must be one of ${EXIT_REASONS.join(' | ')} (got ${J(rec.exit_reason)})`);
  const s = rec.agents_spawned;
  if (!isObj(s)) {
    errs.push('agents_spawned is required and must be an object: {total, tree, loops_used}');
  } else {
    if (typeof s.total !== 'number' || !Number.isFinite(s.total)) errs.push('agents_spawned.total must be a number');
    if (!isObj(s.tree)) errs.push('agents_spawned.tree must be an object (keyed by role-category, helpers in their own bucket — §5)');
    if (!Number.isInteger(s.loops_used) || s.loops_used < 0) errs.push('agents_spawned.loops_used is required and must be a non-negative integer (§5: loop iterations used are a component of agents_spawned)');
  }
  if (rec.feedback_prompts !== undefined &&
      (!Array.isArray(rec.feedback_prompts) || rec.feedback_prompts.some((p) => !isStr(p)))) {
    errs.push('feedback_prompts must be an array of strings (the verbatim feedback-edge asks — Principle 3)');
  }
  if (rec.invoked_by !== undefined && !isNonEmptyStr(rec.invoked_by)) errs.push('invoked_by, when present, must be a non-empty string (email)');
  if (rec.project_dir !== undefined && !isNonEmptyStr(rec.project_dir)) errs.push('project_dir, when present, must be a non-empty string');
  return errs;
}

// A record is either a dispatch row (`dispatch_id` + groups) or a close row
// (`close_of` + exit_reason + agents_spawned). Close rows exist because the
// registry is append-only: the original row is never updated on close.
const isClose = rec.close_of != null;
const errs = isClose ? validateClose(rec) : validateDispatch(rec);
if (errs.length > 0) {
  console.error(`invalid ${isClose ? 'close' : 'dispatch'} record (schema v${SCHEMA_VERSION}):`);
  for (const e of errs) console.error('  - ' + e);
  process.exit(2);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || rec.project_dir || process.cwd();
const file = path.join(projectDir, 'telemetry', 'agents', 'subagents-dispatch.yaml');

// invoked_by: record value wins; otherwise resolve from git; fail-soft to null.
function resolveInvokedBy() {
  if (rec.invoked_by !== undefined) return rec.invoked_by;
  try {
    const email = execSync('git config user.email', { cwd: projectDir, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString('utf8').trim();
    if (email) return email;
  } catch (_) { /* fall through */ }
  console.log('warning: invoked_by not in record and `git config user.email` unavailable — recording invoked_by: null.');
  return null;
}

const header =
  '# subagents-dispatch.yaml — registry of subagent dispatches (one row per dispatch,\n' +
  '# plus one close row per dispatch — append-only, never edited in place).\n' +
  '# Written by the register-dispatch skill. `groups`/`connections` (dispatch rows) and\n' +
  '# `agents_spawned`/`feedback_prompts` (close rows) are JSON columns.\n' +
  'dispatches:\n';
fs.mkdirSync(path.dirname(file), { recursive: true });
try { fs.writeFileSync(file, header, { flag: 'wx' }); } catch (_) { /* exists */ }

const existing = fs.readFileSync(file, 'utf8');
// Defensive: if a prior writer left the ledger without a trailing newline,
// re-anchor so the appended row starts on its own line (YAML stays valid).
const NL = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';

// Structural self-check of the existing ledger — STRUCTURE ONLY, never field
// semantics: old rows are grandfathered (see header comment). Returns the
// parsed id sets (also used for dedup below); exits 1 on corruption so we
// never append to a broken ledger.
function checkLedger(text) {
  const dispatchIds = new Set(), closeOfs = new Set();
  const fail = (n, why) => {
    console.error(`ledger structural check failed at ${file}:${n}: ${why}`);
    console.error('refusing to append to a corrupt ledger — repair it first (the append-only hook will require explicit user authorization for that edit).');
    process.exit(1);
  };
  const lines = text.split('\n');
  let sawTop = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, ''); // tolerate CRLF conversion
    if (line === '' || line.startsWith('#')) continue;
    if (line === 'dispatches:') {
      if (sawTop) fail(i + 1, 'duplicate "dispatches:" key');
      sawTop = true; continue;
    }
    const m = /^(  - |    )([A-Za-z_][A-Za-z0-9_]*): (.*)$/.exec(line);
    if (!m) fail(i + 1, 'unrecognized line shape');
    if (!sawTop) fail(i + 1, 'row content before the "dispatches:" key');
    let v;
    try { v = JSON.parse(m[3]); } catch (_) { fail(i + 1, `value of "${m[2]}" is not valid JSON`); }
    if (m[1] === '  - ') {
      if (m[2] === 'dispatch_id') {
        if (dispatchIds.has(v)) fail(i + 1, `duplicate dispatch_id ${J(v)}`);
        dispatchIds.add(v);
      } else if (m[2] === 'close_of') {
        if (closeOfs.has(v)) fail(i + 1, `duplicate close_of ${J(v)}`);
        closeOfs.add(v);
      } else {
        fail(i + 1, `row must start with dispatch_id or close_of, got "${m[2]}"`);
      }
    }
  }
  return { dispatchIds, closeOfs };
}
const { dispatchIds, closeOfs } = checkLedger(existing);

if (isClose) {
  if (closeOfs.has(rec.close_of)) {
    console.log('already closed:', rec.close_of, '— no row appended.');
    process.exit(0);
  }
  if (!dispatchIds.has(rec.close_of)) {
    console.log('warning: no dispatch row found for', rec.close_of, '— appending close row anyway.');
  }
  const lines = [
    '  - close_of: ' + J(rec.close_of),
    '    closed: ' + J(new Date().toISOString()),
    '    invoked_by: ' + J(resolveInvokedBy()),
    '    exit_reason: ' + J(rec.exit_reason),
    '    agents_spawned: ' + J(rec.agents_spawned),
  ];
  if (rec.feedback_prompts !== undefined) lines.push('    feedback_prompts: ' + J(rec.feedback_prompts));
  fs.appendFileSync(file, NL + lines.join('\n') + '\n');
  console.log('closed dispatch', rec.close_of, '->', file);
  process.exit(0);
}

if (dispatchIds.has(rec.dispatch_id)) {
  console.log('already registered:', rec.dispatch_id, '— no row appended.');
  process.exit(0);
}

if (!LIVE_TYPES.has(rec.dispatch_type)) {
  console.log(`note: dispatch_type "${rec.dispatch_type}" is a RESERVED type — only ${[...LIVE_TYPES].map(J).join(' and ')} are LIVE under v0.6.0; recording anyway.`);
}

const lines = [
  '  - dispatch_id: ' + J(rec.dispatch_id),
  '    schema_version: ' + J(rec.schema_version),
  '    created: ' + J(new Date().toISOString()),
  '    invoked_by: ' + J(resolveInvokedBy()),
  '    dispatch_type: ' + J(rec.dispatch_type),
  '    goal: ' + J(rec.goal),
  '    context: ' + J(rec.context),
  '    max_loops: ' + J(rec.max_loops),
  '    final_approver: ' + J(rec.final_approver),
];
if (rec.meta === true)                lines.push('    meta: ' + J(true));
if (rec.parent_dispatch_id != null)   lines.push('    parent_dispatch_id: ' + J(rec.parent_dispatch_id));
if (rec.anti_bias_global != null)     lines.push('    anti_bias_global: ' + J(rec.anti_bias_global));
if (rec.working_folder != null)       lines.push('    working_folder: ' + J(rec.working_folder));
lines.push('    groups: ' + J(rec.groups));
if (rec.connections !== undefined)    lines.push('    connections: ' + J(rec.connections));

const agentCount = rec.groups.reduce((t, g) => t + g.agents.length, 0);
fs.appendFileSync(file, NL + lines.join('\n') + '\n');
console.log('registered dispatch', rec.dispatch_id, '->', file,
  '(' + agentCount + ' agents across ' + rec.groups.length + ' groups)');
process.exit(0);
