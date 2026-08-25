#!/usr/bin/env node
'use strict';
/*
 * Append one row to <repo-root>/telemetry/agents/subagents-dispatch.yaml.
 *
 *   node append-dispatch.cjs <record.json>
 *   node append-dispatch.cjs --validate-sheet <sheet.json>
 *
 * <record.json> / <sheet.json> is a UTF-8 JSON file (a file arg, not stdin, so shell encoding
 * — e.g. PowerShell's UTF-16 pipes — can't corrupt the payload).
 *
 * `--validate-sheet` is a non-mutating confirmation-readiness gate. It validates
 * the dispatch-row core before tension checks or human confirmation, permits
 * `evidence_binding` to be absent because confirmation does not exist yet, and
 * exits before reading or writing the ledger. A stale schema version emits a
 * typed warning and still fails closed. The caller must rematerialize from the
 * live form owner, rerun validation, and only then request confirmation.
 *
 * SCHEMA — subagents-strategy constitution v0.8.0 (row schema; digest-owned
 * pairwise disagreement evidence and deterministic identity admission added at
 * v0.8.0). Two row kinds, both appended by this script
 * (Principle 3: two appends, one place):
 *
 *   DISPATCH ROW — keyed by `dispatch_id`. Required: dispatch_id,
 *     schema_version ("0.8.0" exactly), dispatch_type
 *     (research|code|review|plan|suggestion|experiment|other vocabulary; only LIVE
 *     research|review|experiment|other rows are admitted), goal, context, max_loops (1..5),
 *     final_approver, groups[] (each group: group_id, agents[] — NO group
 *     `role` field; each agent: role explorer|synthesizer|skeptic|writer|auditor, model,
 *     token_budget, initial_prompt; fan-out groups also carry complete
 *     predicted_disagreements[] pair records). Optional: meta (true), parent_dispatch_id,
 *     anti_bias_global, working_folder (REQUIRED for LIVE types research/review/experiment/other; never vault/),
 *     invoked_by (tooling extension, not in constitution §5),
 *     evidence_binding ({sheet_path, sheet_sha256, tension_verdicts[2],
 *     confirmation}) binding two PASS handles and explicit confirmation to the
 *     current live sheet bytes,
 *     connections[] ({from,to,type,loop_cap?}).
 *   CLOSE ROW — keyed by `close_of`. Required: exit_reason
 *     (resolved|loop_ceiling_reached|dissent_irreconcilable|user_abort|error)
 *     and agents_spawned ({total, tree, loops_used}). Optional:
 *     feedback_prompts[] (verbatim feedback-edge asks — Principle 3),
 *     invoked_by (tooling extension, not in constitution §5).
 *
 * NOT ENFORCED here (deliberate — sheet-design rules owned by the strategist
 * and the human confirm gate): dispatch_id YYYY-MM-DD-<slug> format; the
 * layers>1 not-on-a-zig-zag/feedback-endpoint corollary; the semantic
 * anti-bias decision rule (constitution P5: axis vocabulary / clone / spread /
 * semantic evidence quality — gate-checked on the sheet). Complete pairwise
 * evidence presence, pool eligibility, identity uniqueness, and final-approver
 * shape ARE deterministic admission rules. The anti_bias_global
 * required-when->=2-groups-fan-out conditional IS enforced here (2026-06-12
 * in-place amendment, constitution §9).
 *
 * `created`/`closed` are STAMPED by the appender (never supplied by the
 * caller). `invoked_by` is taken from the record when present, otherwise
 * resolved via `git config user.email` (fail-soft: warning + null).
 * `project_dir` is a control key (repo-root fallback), never emitted.
 *
 * VALIDATION SPLIT (grandfathering — constitution §2):
 *   - The INCOMING record is validated STRICTLY against the v0.8.0 schema
 *     before append: required fields, closed enums, evidence binding, conditional fields
 *     (working_folder on LIVE types; anti_bias/angle at n >= 2;
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
const crypto = require('crypto');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const validateSheetOnly = args[0] === '--validate-sheet';
const src = validateSheetOnly ? args[1] : args[0];
const expectedArgCount = validateSheetOnly ? 2 : 1;
if (!src || args.length !== expectedArgCount) {
  console.error('usage: node append-dispatch.cjs <record.json>');
  console.error('   or: node append-dispatch.cjs --validate-sheet <sheet.json>');
  process.exit(2);
}

let rec;
let srcBytes;
try {
  srcBytes = fs.readFileSync(src);
  rec = JSON.parse(srcBytes.toString('utf8').replace(/^\uFEFF/, ''));
} // strip UTF-8 BOM
catch (e) { console.error('cannot read/parse record:', e.message); process.exit(2); }
if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
  console.error('record must be a JSON object'); process.exit(2);
}

const J = (v) => JSON.stringify(v);   // valid YAML scalar / flow value
const isStr = (v) => typeof v === 'string';
const isNonEmptyStr = (v) => isStr(v) && v.trim() !== '';
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// ---------------------------------------------------------------- schema
const SCHEMA_VERSION = '0.8.0';   // pairwise evidence + deterministic identity admission
const DISPATCH_TYPES = ['research', 'code', 'review', 'plan', 'suggestion', 'experiment', 'other'];
// LIVE per constitution §5 (review 2026-06-12; experiment 2026-06-14; other 2026-08-17,
// owner decisions); remaining types
// RESERVED (code, plan, suggestion) — recorded but not yet dispatchable.
const LIVE_TYPES = new Set(['research', 'review', 'experiment', 'other']);
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
  'evidence_binding',                                            // required
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
const GROUP_KEYS = new Set([
  'group_id', 'agents', 'n', 'robot_talks', 'layers', 'anti_bias',
  'predicted_disagreements',
]);
const AGENT_KEYS = new Set(['role', 'model', 'token_budget', 'initial_prompt', 'agent_name', 'angle']);
const PREDICTED_DISAGREEMENT_KEYS = new Set(['pair', 'statement']);
const CONN_KEYS = new Set(['from', 'to', 'type', 'loop_cap']);
const EVIDENCE_BINDING_KEYS = new Set([
  'sheet_path', 'sheet_sha256', 'tension_verdicts', 'confirmation',
]);
const TENSION_VERDICT_KEYS = new Set(['handle', 'verdict', 'sheet_sha256']);
const CONFIRMATION_KEYS = new Set(['handle', 'confirmed', 'sheet_sha256']);
const SHA256_RE = /^[a-f0-9]{64}$/;

function normalizeIdentity(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function parsePoolNameScalar(raw) {
  const value = raw.trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value.replace(/\s+#.*$/, '').trim();
}

function loadAgentPool(rootInput) {
  let root;
  try {
    root = fs.realpathSync(rootInput);
  } catch (e) {
    return {
      names: new Set(),
      errors: [`agent pool repository root cannot be resolved: ${J(rootInput)} (${e.code || e.message})`],
    };
  }

  const relativePoolPath = 'telemetry/agents/agent-pool.yaml';
  const poolPath = path.join(root, ...relativePoolPath.split('/'));
  if (!fs.existsSync(poolPath)) {
    return {
      names: new Set(),
      errors: [`agent pool is required before confirmation and was not found at ${J(relativePoolPath)}`],
    };
  }

  let text;
  try {
    text = fs.readFileSync(poolPath, 'utf8');
  } catch (e) {
    return {
      names: new Set(),
      errors: [`agent pool cannot be read at ${J(relativePoolPath)}: ${e.message}`],
    };
  }

  const names = new Set();
  const duplicates = new Set();
  const errors = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*-\s+name:\s*(.+?)\s*$/);
    if (!match) continue;
    const parsed = parsePoolNameScalar(match[1]);
    if (!isNonEmptyStr(parsed)) {
      errors.push(`agent pool contains an unreadable name entry: ${J(match[1])}`);
      continue;
    }
    const normalized = normalizeIdentity(parsed);
    if (names.has(normalized)) duplicates.add(normalized);
    names.add(normalized);
  }
  if (names.size === 0) errors.push('agent pool contains no readable "- name:" entries');
  for (const duplicate of duplicates) {
    errors.push(`agent pool contains duplicate identity ${J(duplicate)}`);
  }
  return { names, errors };
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' ||
    (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

function validateWorkingFolder(raw, rootInput) {
  const errs = [];
  const portable = raw.replace(/\\/g, '/');

  if (path.isAbsolute(raw) || path.win32.isAbsolute(portable)) {
    return [`working_folder must be repository-relative — got ${J(raw)}`];
  }

  const segments = portable.split('/').filter((part) => part !== '' && part !== '.');
  if (segments.includes('..')) {
    return [`working_folder must not contain parent traversal ("..") — got ${J(raw)}`];
  }

  let root;
  try {
    root = fs.realpathSync(rootInput);
  } catch (e) {
    return [`working_folder repository root cannot be resolved: ${J(rootInput)} (${e.code || e.message})`];
  }

  const candidate = path.resolve(root, ...segments);
  if (!isContained(root, candidate)) {
    return [`working_folder escapes the repository root — got ${J(raw)}`];
  }

  let nearestExisting = candidate;
  while (!fs.existsSync(nearestExisting)) {
    const parent = path.dirname(nearestExisting);
    if (parent === nearestExisting) break;
    nearestExisting = parent;
  }

  let resolvedExisting;
  try {
    resolvedExisting = fs.realpathSync(nearestExisting);
  } catch (e) {
    return [`working_folder nearest existing path cannot be resolved: ${J(nearestExisting)} (${e.code || e.message})`];
  }
  if (!isContained(root, resolvedExisting)) {
    return [`working_folder resolves outside the repository root through ${J(nearestExisting)} — got ${J(raw)}`];
  }

  if (segments.length > 0 && /^vault$/i.test(segments[0])) {
    errs.push(`working_folder must never point into vault/ (§5: "Never vault/**") — got ${J(raw)}`);
  }
  return errs;
}

const projectDir = process.env.CLAUDE_PROJECT_DIR ||
  (isNonEmptyStr(rec.project_dir) ? rec.project_dir : process.cwd());

function validateEvidenceBinding(binding, rootInput) {
  const errs = [];
  if (!isObj(binding)) {
    return ['evidence_binding is required and must be an object'];
  }
  for (const k of Object.keys(binding)) {
    if (!EVIDENCE_BINDING_KEYS.has(k)) errs.push(`evidence_binding: unknown key "${k}"`);
  }
  if (!isNonEmptyStr(binding.sheet_path)) {
    errs.push('evidence_binding.sheet_path is required and must be a non-empty repository-relative string');
  }
  if (!isStr(binding.sheet_sha256) || !SHA256_RE.test(binding.sheet_sha256)) {
    errs.push('evidence_binding.sheet_sha256 must be a lowercase SHA-256 digest');
  }

  if (isNonEmptyStr(binding.sheet_path)) {
    const portable = binding.sheet_path.replace(/\\/g, '/');
    const segments = portable.split('/').filter((part) => part !== '' && part !== '.');
    if (path.isAbsolute(binding.sheet_path) || path.win32.isAbsolute(portable)) {
      errs.push(`evidence_binding.sheet_path must be repository-relative — got ${J(binding.sheet_path)}`);
    } else if (segments.includes('..')) {
      errs.push(`evidence_binding.sheet_path must not contain parent traversal ("..") — got ${J(binding.sheet_path)}`);
    } else {
      let root;
      try {
        root = fs.realpathSync(rootInput);
      } catch (e) {
        errs.push(`evidence_binding repository root cannot be resolved: ${J(rootInput)} (${e.code || e.message})`);
      }
      if (root) {
        const candidate = path.resolve(root, ...segments);
        if (!isContained(root, candidate)) {
          errs.push(`evidence_binding.sheet_path escapes the repository root — got ${J(binding.sheet_path)}`);
        } else if (!fs.existsSync(candidate)) {
          errs.push(`evidence_binding.sheet_path does not exist — got ${J(binding.sheet_path)}`);
        } else {
          let resolvedSheet;
          try {
            resolvedSheet = fs.realpathSync(candidate);
          } catch (e) {
            errs.push(`evidence_binding.sheet_path cannot be resolved: ${J(binding.sheet_path)} (${e.code || e.message})`);
          }
          if (resolvedSheet && !isContained(root, resolvedSheet)) {
            errs.push(`evidence_binding.sheet_path resolves outside the repository root — got ${J(binding.sheet_path)}`);
          } else if (resolvedSheet && !fs.statSync(resolvedSheet).isFile()) {
            errs.push(`evidence_binding.sheet_path must name a regular file — got ${J(binding.sheet_path)}`);
          } else if (resolvedSheet && SHA256_RE.test(binding.sheet_sha256 || '')) {
            const actualDigest = crypto.createHash('sha256').update(fs.readFileSync(resolvedSheet)).digest('hex');
            if (actualDigest !== binding.sheet_sha256) {
              errs.push(`evidence_binding.sheet_sha256 does not match current sheet bytes for ${J(binding.sheet_path)}`);
            }
          }
        }
      }
    }
  }

  const verdicts = binding.tension_verdicts;
  if (!Array.isArray(verdicts) || verdicts.length !== 2) {
    errs.push('evidence_binding.tension_verdicts must contain exactly two verdict handles');
  } else {
    const handles = new Set();
    verdicts.forEach((verdict, index) => {
      const where = `evidence_binding.tension_verdicts[${index}]`;
      if (!isObj(verdict)) {
        errs.push(`${where} must be an object`);
        return;
      }
      for (const k of Object.keys(verdict)) {
        if (!TENSION_VERDICT_KEYS.has(k)) errs.push(`${where}: unknown key "${k}"`);
      }
      if (!isNonEmptyStr(verdict.handle)) errs.push(`${where}.handle is required and must be non-empty`);
      else if (handles.has(verdict.handle)) errs.push(`${where}.handle duplicates another tension verdict handle`);
      else handles.add(verdict.handle);
      if (verdict.verdict !== 'pass') errs.push(`${where}.verdict must be exactly "pass"`);
      if (verdict.sheet_sha256 !== binding.sheet_sha256) {
        errs.push(`${where}.sheet_sha256 must match evidence_binding.sheet_sha256`);
      }
    });
  }

  const confirmation = binding.confirmation;
  if (!isObj(confirmation)) {
    errs.push('evidence_binding.confirmation is required and must be an object');
  } else {
    for (const k of Object.keys(confirmation)) {
      if (!CONFIRMATION_KEYS.has(k)) errs.push(`evidence_binding.confirmation: unknown key "${k}"`);
    }
    if (!isNonEmptyStr(confirmation.handle)) {
      errs.push('evidence_binding.confirmation.handle is required and must be non-empty');
    }
    if (confirmation.confirmed !== true) {
      errs.push('evidence_binding.confirmation.confirmed must be exactly true');
    }
    if (confirmation.sheet_sha256 !== binding.sheet_sha256) {
      errs.push('evidence_binding.confirmation.sheet_sha256 must match evidence_binding.sheet_sha256');
    }
  }
  return errs;
}

function validateDispatch(rec, options = {}) {
  const requireEvidenceBinding = options.requireEvidenceBinding !== false;
  const errs = [];
  for (const k of Object.keys(rec)) {
    if (DISPATCH_KEYS.has(k)) continue;
    if (REMOVED_KEYS.has(k)) errs.push(`"${k}" was removed by schema v0.5.2 — drop it from the record`);
    else if (LEGACY_LEDGER_KEYS.has(k)) errs.push(`"${k}" is a pre-v0.5.2 ledger-row key, not in the v0.8.0 schema — drop it from the record`);
    else errs.push(`unknown key "${k}" on a dispatch record`);
  }
  if (!isNonEmptyStr(rec.dispatch_id)) errs.push('dispatch_id is required and must be a non-empty string');
  if (rec.schema_version !== SCHEMA_VERSION) errs.push(`schema_version must be exactly "${SCHEMA_VERSION}" (got ${J(rec.schema_version)})`);
  if (!DISPATCH_TYPES.includes(rec.dispatch_type)) errs.push(`dispatch_type must be one of ${DISPATCH_TYPES.join(' | ')} (got ${J(rec.dispatch_type)})`);
  else if (!LIVE_TYPES.has(rec.dispatch_type)) errs.push(`dispatch_type ${J(rec.dispatch_type)} is RESERVED and cannot be registered; LIVE types are ${[...LIVE_TYPES].map(J).join(' | ')}`);
  if (!isNonEmptyStr(rec.goal)) errs.push('goal is required and must be a non-empty string');
  if (!isNonEmptyStr(rec.context)) errs.push('context is required and must be a non-empty string (subagents never see the parent conversation — §5)');
  if (!Number.isInteger(rec.max_loops) || rec.max_loops < 1 || rec.max_loops > 5) errs.push(`max_loops must be an integer in 1..5 (got ${J(rec.max_loops)})`);
  if (!isNonEmptyStr(rec.final_approver)) {
    errs.push('final_approver is required and must be "parent" or a pooled singleton auditor identity');
  }
  if (requireEvidenceBinding) {
    errs.push(...validateEvidenceBinding(rec.evidence_binding, projectDir));
  } else if (rec.evidence_binding !== undefined) {
    errs.push('evidence_binding must be absent from a confirmation-readiness sheet; assemble it separately after confirmation');
  }
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
    else errs.push(...validateWorkingFolder(rec.working_folder, projectDir));
  }

  const groupIds = new Set();
  const identityOccurrences = new Map();
  const pool = loadAgentPool(projectDir);
  errs.push(...pool.errors);
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
      if (fanout) {
        const expectedPairs = new Set();
        for (let left = 0; left < agents.length; left += 1) {
          for (let right = left + 1; right < agents.length; right += 1) {
            expectedPairs.add(`${left}:${right}`);
          }
        }
        if (!Array.isArray(g.predicted_disagreements)) {
          errs.push(`${gw}.predicted_disagreements is required when the group has >= 2 agents`);
        } else {
          const seenPairs = new Set();
          g.predicted_disagreements.forEach((entry, pi) => {
            const pw = `${gw}.predicted_disagreements[${pi}]`;
            if (!isObj(entry)) {
              errs.push(`${pw} must be an object`);
              return;
            }
            for (const k of Object.keys(entry)) {
              if (!PREDICTED_DISAGREEMENT_KEYS.has(k)) errs.push(`${pw}: unknown key "${k}"`);
            }
            if (!Array.isArray(entry.pair) || entry.pair.length !== 2 ||
                !entry.pair.every(Number.isInteger)) {
              errs.push(`${pw}.pair must be exactly two integer agent indexes`);
            } else {
              const [left, right] = entry.pair;
              if (left < 0 || right < 0 || left >= agents.length || right >= agents.length) {
                errs.push(`${pw}.pair indexes must be in range 0..${agents.length - 1}`);
              } else if (left >= right) {
                errs.push(`${pw}.pair must be canonical unordered form [lower_index, higher_index]`);
              } else {
                const key = `${left}:${right}`;
                if (seenPairs.has(key)) {
                  errs.push(`${pw}.pair duplicates another predicted-disagreement pair`);
                }
                seenPairs.add(key);
              }
            }
            if (!isNonEmptyStr(entry.statement)) {
              errs.push(`${pw}.statement is required and must be a non-empty string`);
            }
          });
          for (const pair of expectedPairs) {
            if (!seenPairs.has(pair)) {
              errs.push(`${gw}.predicted_disagreements is missing required pair [${pair.replace(':', ', ')}]`);
            }
          }
          for (const pair of seenPairs) {
            if (!expectedPairs.has(pair)) {
              errs.push(`${gw}.predicted_disagreements contains unexpected pair [${pair.replace(':', ', ')}]`);
            }
          }
        }
      } else if (g.predicted_disagreements !== undefined) {
        errs.push(`${gw}.predicted_disagreements must be absent when the group has fewer than 2 agents`);
      }
      if (agents) agents.forEach((a, ai) => {
        const aw = `${gw}.agents[${ai}]`;
        if (!isObj(a)) { errs.push(`${aw} must be an object`); return; }
        for (const k of Object.keys(a)) if (!AGENT_KEYS.has(k)) errs.push(`${aw}: unknown key "${k}"`);
        if (!AGENT_ROLES.includes(a.role)) errs.push(`${aw}.role must be one of ${AGENT_ROLES.join(' | ')} (got ${J(a.role)})`);
        if (!isNonEmptyStr(a.model)) errs.push(`${aw}.model is required and must be a non-empty string`);
        if (!Number.isInteger(a.token_budget) || a.token_budget <= 0) errs.push(`${aw}.token_budget is required and must be a positive integer — no unlimited default (§5)`);
        if (!isNonEmptyStr(a.initial_prompt)) errs.push(`${aw}.initial_prompt is required and must be a non-empty string`);
        if (a.agent_name !== undefined && a.agent_name !== null && !isNonEmptyStr(a.agent_name)) {
          errs.push(`${aw}.agent_name must be a string or null`);
        } else if (isNonEmptyStr(a.agent_name)) {
          const normalized = normalizeIdentity(a.agent_name);
          if (!pool.names.has(normalized)) {
            errs.push(`${aw}.agent_name ${J(a.agent_name)} is not present in telemetry/agents/agent-pool.yaml`);
          }
          const occurrences = identityOccurrences.get(normalized) || [];
          occurrences.push({ group: g, agent: a, where: aw });
          identityOccurrences.set(normalized, occurrences);
        }
        if (fanout && !isNonEmptyStr(a.angle)) errs.push(`${aw}.angle is required when the group has >= 2 agents (Principle 5)`);
        if (!fanout && a.angle !== undefined && !isNonEmptyStr(a.angle)) errs.push(`${aw}.angle, when present, must be a non-empty string`);
      });
    });
    const fanoutGroups = rec.groups.filter((g) => isObj(g) && Array.isArray(g.agents) && g.agents.length >= 2).length;
    if (fanoutGroups >= 2 && !isNonEmptyStr(rec.anti_bias_global)) {
      errs.push(`anti_bias_global is required when >= 2 groups have >= 2 agents (${fanoutGroups} fan-out groups declared — §5 conditional, Principle 5)`);
    }

    for (const [identity, occurrences] of identityOccurrences) {
      if (occurrences.length > 1) {
        errs.push(`agent_name ${J(identity)} appears ${occurrences.length} times; non-null identities must be unique within a dispatch`);
      }
    }

    if (isNonEmptyStr(rec.final_approver) && normalizeIdentity(rec.final_approver) !== 'parent') {
      const approver = normalizeIdentity(rec.final_approver);
      if (!pool.names.has(approver)) {
        errs.push(`final_approver ${J(rec.final_approver)} is not present in telemetry/agents/agent-pool.yaml`);
      }
      const occurrences = identityOccurrences.get(approver) || [];
      if (occurrences.length !== 1) {
        errs.push(`final_approver ${J(rec.final_approver)} must appear exactly once as the sole auditor in a dedicated approval group`);
      } else {
        const occurrence = occurrences[0];
        if (occurrence.agent.role !== 'auditor' ||
            !Array.isArray(occurrence.group.agents) ||
            occurrence.group.agents.length !== 1) {
          errs.push(`final_approver ${J(rec.final_approver)} must be the sole agent of a singleton group with role "auditor"`);
        }
      }
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
    else if (LEGACY_LEDGER_KEYS.has(k)) errs.push(`"${k}" is a pre-v0.5.2 ledger-row key, not in the v0.8.0 schema — drop it from the record`);
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
if (validateSheetOnly && isClose) {
  console.error(`invalid dispatch sheet (schema v${SCHEMA_VERSION}):`);
  console.error('  - --validate-sheet accepts a dispatch sheet, not a close record');
  process.exit(2);
}
const errs = isClose
  ? validateClose(rec)
  : validateDispatch(rec, { requireEvidenceBinding: !validateSheetOnly });
if (errs.length > 0) {
  if (validateSheetOnly && rec.schema_version !== SCHEMA_VERSION) {
    console.error(
      `WARNING FORM_VERSION_DRIFT: candidate declares ${J(rec.schema_version)}; live form owner requires ${J(SCHEMA_VERSION)}. Rematerialize before tension or confirmation.`,
    );
  }
  console.error(`invalid ${validateSheetOnly ? 'dispatch sheet' : isClose ? 'close' : 'dispatch'} record (schema v${SCHEMA_VERSION}):`);
  for (const e of errs) console.error('  - ' + e);
  process.exit(2);
}

if (validateSheetOnly) {
  const digest = crypto.createHash('sha256').update(srcBytes).digest('hex');
  console.log('SHEET_VALIDATION=pass');
  console.log(`SCHEMA_VERSION=${SCHEMA_VERSION}`);
  console.log(`SHEET_SHA256=${digest}`);
  console.log('LEDGER_MUTATION=none');
  process.exit(0);
}

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
const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : header;
// Defensive: if a prior writer left the ledger without a trailing newline,
// re-anchor so the appended row starts on its own line (YAML stays valid).
const NL = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';

function ensureLedgerFile() {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try { fs.writeFileSync(file, header, { flag: 'wx' }); } catch (_) { /* exists */ }
}

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
    console.error(`invalid close record (schema v${SCHEMA_VERSION}):`);
    console.error(`  - close_of ${J(rec.close_of)} does not reference an existing dispatch row`);
    process.exit(2);
  }
  const lines = [
    '  - close_of: ' + J(rec.close_of),
    '    closed: ' + J(new Date().toISOString()),
    '    invoked_by: ' + J(resolveInvokedBy()),
    '    exit_reason: ' + J(rec.exit_reason),
    '    agents_spawned: ' + J(rec.agents_spawned),
  ];
  if (rec.feedback_prompts !== undefined) lines.push('    feedback_prompts: ' + J(rec.feedback_prompts));
  ensureLedgerFile();
  fs.appendFileSync(file, NL + lines.join('\n') + '\n');
  console.log('closed dispatch', rec.close_of, '->', file);
  process.exit(0);
}

if (dispatchIds.has(rec.dispatch_id)) {
  console.log('already registered:', rec.dispatch_id, '— no row appended.');
  process.exit(0);
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
lines.push('    evidence_binding: ' + J(rec.evidence_binding));
lines.push('    groups: ' + J(rec.groups));
if (rec.connections !== undefined)    lines.push('    connections: ' + J(rec.connections));

const agentCount = rec.groups.reduce((t, g) => t + g.agents.length, 0);
ensureLedgerFile();
fs.appendFileSync(file, NL + lines.join('\n') + '\n');
console.log('registered dispatch', rec.dispatch_id, '->', file,
  '(' + agentCount + ' agents across ' + rec.groups.length + ' groups)');
process.exit(0);
