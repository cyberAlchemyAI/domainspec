#!/usr/bin/env node
'use strict';
/*
 * Append one row to <repo-root>/telemetry/agents/subagents-dispatch.yaml.
 *
 *   node append-dispatch.cjs <record.json>
 *   node append-dispatch.cjs --consume <registration-envelope.tmp.json>
 *   node append-dispatch.cjs --validate-sheet <sheet.json>
 *
 * <record.json> / <sheet.json> is a UTF-8 JSON file (a file arg, not stdin, so shell encoding
 * — e.g. PowerShell's UTF-16 pipes — can't corrupt the payload).
 *
 * `--validate-sheet` is a non-mutating confirmation-readiness gate. It validates
 * the dispatch-row core before tension checks or human confirmation, permits
 * `evidence_binding` to be absent because confirmation does not exist yet, and
 * never writes the ledger. A run-phase experiment performs the minimum
 * read-only ledger lookup needed to verify its closed proposal and criterion
 * lineage before confirmation. A stale schema version emits a typed warning
 * and still fails closed. The caller must rematerialize from the live form
 * owner, rerun validation, and only then request confirmation.
 *
 * SCHEMA — subagents-strategy constitution v0.10.0 for every new row; v0.9.0
 * and older dispatch rows are validate-only historical inputs. V0.10.0 adds
 * exact preconfirmation closure admission. Two row kinds are handled here
 * (Principle 3: two appends, one place):
 *
 *   DISPATCH ROW — keyed by `dispatch_id`. Required: dispatch_id,
 *     schema_version ("0.10.0" exactly for new rows), dispatch_type
 *     (research|code|review|plan|suggestion|experiment|other vocabulary; only LIVE
 *     research|review|experiment|other rows are admitted), goal, context, max_loops (1..5),
 *     final_approver, groups[] (each group: group_id, agents[] — NO group
 *     `role` field; each agent: role explorer|synthesizer|skeptic|writer|auditor, model,
 *     token_budget, initial_prompt; fan-out groups also carry complete
 *     predicted_disagreements[] pair records). Optional: meta (true), parent_dispatch_id,
 *     anti_bias_global, working_folder (REQUIRED for LIVE types research/review/experiment/other; never vault/),
 *     invoked_by (tooling extension, not in constitution §5),
 *     evidence_binding ({sheet_path, sheet_sha256, tension_verdicts[2],
 *     confirmation}) binding either two independent subject-group PASS handles
 *     or the canonical no-subject disposition pair, plus explicit confirmation,
 *     to the current live sheet bytes,
 *     connections[] ({from,to,type,loop_cap?}); `experiment_contract` is
 *     required exactly when dispatch_type is experiment.
 *   CLOSE ROW — keyed by `close_of`. Required: exit_reason
 *     (resolved|loop_ceiling_reached|dissent_irreconcilable|user_abort|error)
 *     and agents_spawned ({total, tree, loops_used}). Optional:
 *     feedback_prompts[] (verbatim feedback-edge asks — Principle 3),
 *     `experiment_closeout` is conditionally required for v0.9.0 experiment
 *     rows and records phase-appropriate completion without inventing a
 *     verdict on abnormal exits,
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
 *   - The INCOMING new record is validated STRICTLY against v0.10.0
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
const { execSync, spawnSync } = require('child_process');
const { project: projectMaterialStrategy } = require('../domainspec-subagents-strategy/material-strategy.cjs');

const args = process.argv.slice(2);
const validateSheetOnly = args[0] === '--validate-sheet';
const consumeEnvelope = args[0] === '--consume';
const src = (validateSheetOnly || consumeEnvelope) ? args[1] : args[0];
const expectedArgCount = (validateSheetOnly || consumeEnvelope) ? 2 : 1;
if (!src || args.length !== expectedArgCount) {
  console.error('usage: node append-dispatch.cjs <record.json>');
  console.error('   or: node append-dispatch.cjs --validate-sheet <sheet.json>');
  console.error('   or: node append-dispatch.cjs --consume <registration-envelope.tmp.json>');
  process.exit(2);
}

let rec;
let srcBytes;
let registrationEnvelope = null;
try {
  srcBytes = fs.readFileSync(src);
  rec = JSON.parse(srcBytes.toString('utf8').replace(/^\uFEFF/, ''));
  if (consumeEnvelope) {
    const parsed = rec;
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      parsed.registration_record !== null &&
      typeof parsed.registration_record === 'object' &&
      !Array.isArray(parsed.registration_record)
    ) {
      registrationEnvelope = parsed;
      rec = registrationEnvelope.registration_record;
    }
  }
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
const CURRENT_SCHEMA_VERSION = '0.10.0';
const SUPPORTED_SCHEMA_VERSIONS = new Set(['0.9.0', CURRENT_SCHEMA_VERSION]);
const SCHEMA_VERSION = SUPPORTED_SCHEMA_VERSIONS.has(rec.schema_version)
  ? rec.schema_version
  : CURRENT_SCHEMA_VERSION;
const DISPATCH_TYPES = ['research', 'code', 'review', 'plan', 'suggestion', 'experiment', 'other'];
// LIVE per constitution §5 (review 2026-06-12; experiment 2026-06-14; other 2026-08-17,
// owner decisions); remaining vocabulary is reserved.
// RESERVED (code, plan, suggestion) — recorded but not yet dispatchable.
const LIVE_TYPES = new Set(['research', 'review', 'experiment', 'other']);
// Group `role` was removed from the row schema at v0.6.0 (constitution §11 / CR-2): a group's
// function is read off its agents' roles, its workflow position off its connections.
const AGENT_ROLES = ['explorer', 'synthesizer', 'skeptic', 'writer', 'auditor'];
const CONNECTION_TYPES = ['sequential', 'zig-zag', 'feedback'];
const EXIT_REASONS = ['resolved', 'loop_ceiling_reached', 'dissent_irreconcilable', 'user_abort', 'error'];
const EXPERIMENT_PHASES = ['propose', 'run'];
const PROPOSAL_STATUSES = ['frozen', 'invalid', 'not_frozen'];
const RUN_STATUSES = ['adjudicated', 'not_adjudicated'];
const EXPERIMENT_VERDICTS = ['SURVIVED', 'FALSIFIED', 'INVALID'];
const SUBJECT_AGENT_ROLES = new Set(['explorer', 'skeptic', 'auditor']);
const NO_SUBJECT_TENSION_HANDLE_PREFIX = 'check-tension:no-subject:';

const DISPATCH_KEYS = new Set([
  'dispatch_id', 'schema_version', 'dispatch_type', 'goal', 'context',
  'max_loops', 'final_approver', 'groups',                       // required
  'meta', 'parent_dispatch_id', 'anti_bias_global', 'working_folder', 'other_contract',
  'invoked_by', 'connections',                                   // optional
  'experiment_contract',                                        // required for experiment
  'evidence_binding',                                            // required
  'project_dir',                                                 // control key, not emitted
]);
const CLOSE_KEYS = new Set([
  'close_of', 'exit_reason', 'agents_spawned',                   // required
  'feedback_prompts', 'invoked_by',                              // optional
  'experiment_closeout',                                        // conditional
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
  'preconfirmation_closure',
]);
const TENSION_VERDICT_KEYS = new Set(['handle', 'verdict', 'sheet_sha256']);
const CONFIRMATION_KEYS = new Set(['handle', 'confirmed', 'sheet_sha256', 'material_sha256']);
const EXACT_REF_KEYS = new Set(['path', 'sha256', 'size']);
const EXPERIMENT_PROPOSE_KEYS = new Set([
  'phase', 'criterion_output_path', 'criterion_package',
  'pre_freeze_obligations', 'execution_dispatch_ref',
  'execution_briefings_ref',
]);
const EXPERIMENT_RUN_KEYS = new Set([
  'phase', 'proposal_dispatch_id', 'criterion_ref', 'experiment_output_path',
  'findings_output_path', 'adjudication',
]);
const ADJUDICATION_KEYS = new Set(['mode', 'rule_locator']);
const CRITERION_PACKAGE_KEYS = new Set([
  'source_ref', 'schema_ref', 'renderer_ref', 'generated_view_ref', 'protocol_ref',
  'guide_manifest_ref', 'criterion_validator_ref',
  'guide_equivalence_validator_ref',
]);
const PRE_FREEZE_OBLIGATION_KEYS = new Set([
  'obligation_id', 'execution_role_id', 'receipt_ref', 'gate_id',
  'required_read_scopes', 'independent_of_role_ids',
]);
const PROPOSE_CLOSEOUT_KEYS = new Set(['phase', 'status', 'criterion_ref']);
const RUN_CLOSEOUT_KEYS = new Set([
  'phase', 'status', 'verdict', 'criterion_ref', 'experiment_ref', 'findings_ref',
]);
const OTHER_CONTRACT_KEYS = new Set([
  'owner_capability', 'targets', 'allowed_mutations', 'forbidden_mutations',
  'source_refs', 'validation_commands', 'expected_result', 'stop_conditions',
  'lanes',
]);
const OTHER_LANE_KEYS = new Set([
  'lane_id', 'writer_group_id', 'reviewer_group_id', 'target_paths',
  'connection_type',
]);
const OTHER_OWNER_CAPABILITY =
  'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/other/SKILL.md';
const SHA256_RE = /^[a-f0-9]{64}$/;
const PRECONFIRMATION_CONSUMER_PATHS = Object.freeze({
  registrar: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs',
  preconfirmation_closure_compiler: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/preconfirmation-closure.cjs',
  preconfirmation_closure_schema: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/preconfirmation-closure.schema.json',
  check_tension_evidence_schema: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/check-tension-evidence.schema.json',
  material_projection_compiler: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/material-strategy.cjs',
  public_ledger_engine: 'arcanum/arcana/subagent-strategy/scripts/ledger-engine.cjs',
  strategy_runtime_engine: 'arcanum/arcana/subagent-strategy/scripts/strategy-runtime.cjs',
  runtime_profile_schema: 'arcanum/arcana/subagent-strategy/profiles/runtime-profile.schema.json',
  private_runtime_profile: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-profile.json',
  registration_envelope_schema: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/registration-envelope.schema.json',
  other_type_owner: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/other/SKILL.md',
  runtime_composition: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/scripts/sync-strategy-runtimes.cjs',
  runtime_composition_manifest: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-composition.json',
  dispatch_spec_validator: 'arcanum/formulae/dispatch-spec/scripts/validate-dispatch.py',
  dispatch_spec_schema: 'arcanum/formulae/dispatch-spec/dispatch.schema.json',
  orchestrate_coordinator: 'arcanum/runtime/orchestrate/scripts/native_dispatch_coordinator.py',
  orchestrate_driver: 'arcanum/runtime/orchestrate/scripts/native_dispatch_driver.py',
  orchestrate_evidence_validator: 'arcanum/runtime/orchestrate/scripts/validate_run_evidence.py',
  orchestrate_receipt_schema: 'arcanum/runtime/orchestrate/schemas/receipt.schema.json',
  orchestrate_state_schema: 'arcanum/runtime/orchestrate/schemas/state.schema.json',
  orchestrate_gate_decision_schema: 'arcanum/runtime/orchestrate/schemas/gate-decision.schema.json',
  orchestrate_action_set_schema: 'arcanum/runtime/orchestrate/schemas/action-set.schema.json',
  orchestrate_run_plan_schema: 'arcanum/runtime/orchestrate/schemas/run-plan.schema.json',
  orchestrate_run_event_schema: 'arcanum/runtime/orchestrate/schemas/run-event.schema.json',
  orchestrate_strategy_registration_v03_schema: 'arcanum/runtime/orchestrate/schemas/strategy-registration-v03.schema.json',
  orchestrate_execution_entry_schema: 'arcanum/runtime/orchestrate/schemas/execution-entry.schema.json',
});
const PRECONFIRMATION_BASE_CONSUMER_IDS = new Set([
  'registrar', 'preconfirmation_closure_compiler',
  'preconfirmation_closure_schema', 'check_tension_evidence_schema',
  'material_projection_compiler', 'runtime_composition',
  'runtime_composition_manifest', 'public_ledger_engine',
  'strategy_runtime_engine', 'runtime_profile_schema', 'private_runtime_profile',
  'registration_envelope_schema', 'other_type_owner',
]);

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

function portableSegments(raw) {
  return raw.replace(/\\/g, '/').split('/').filter((part) => part !== '' && part !== '.');
}

function normalizeRepoPath(raw) {
  return portableSegments(raw).join('/');
}

function validateOutputPath(raw, label) {
  const errs = [];
  if (!isNonEmptyStr(raw)) return [`${label} is required and must be a non-empty path relative to working_folder`];
  const portable = raw.replace(/\\/g, '/');
  const segments = portableSegments(raw);
  if (path.isAbsolute(raw) || path.win32.isAbsolute(portable)) {
    errs.push(`${label} must be relative to working_folder — got ${J(raw)}`);
  }
  if (segments.includes('..')) errs.push(`${label} must not contain parent traversal ("..") — got ${J(raw)}`);
  if (segments.length === 0 || portable.endsWith('/')) errs.push(`${label} must name a file, not a directory`);
  return errs;
}

function outputRepoPath(workingFolder, outputPath) {
  return [normalizeRepoPath(workingFolder), normalizeRepoPath(outputPath)].filter(Boolean).join('/');
}

function validateExactRef(ref, label, rootInput) {
  const errs = [];
  if (!isObj(ref)) return [`${label} is required and must be an exact reference object`];
  for (const key of Object.keys(ref)) {
    if (!EXACT_REF_KEYS.has(key)) errs.push(`${label}: unknown key "${key}"`);
  }
  if (!isNonEmptyStr(ref.path)) errs.push(`${label}.path is required and must be repository-relative`);
  if (!isStr(ref.sha256) || !SHA256_RE.test(ref.sha256)) {
    errs.push(`${label}.sha256 must be a lowercase SHA-256 digest`);
  }
  if (!Number.isInteger(ref.size) || ref.size <= 0) {
    errs.push(`${label}.size must be a positive integer byte count`);
  }
  if (!isNonEmptyStr(ref.path)) return errs;

  const portable = ref.path.replace(/\\/g, '/');
  const segments = portableSegments(ref.path);
  if (path.isAbsolute(ref.path) || path.win32.isAbsolute(portable)) {
    errs.push(`${label}.path must be repository-relative — got ${J(ref.path)}`);
    return errs;
  }
  if (segments.includes('..')) {
    errs.push(`${label}.path must not contain parent traversal ("..") — got ${J(ref.path)}`);
    return errs;
  }

  let root;
  try {
    root = fs.realpathSync(rootInput);
  } catch (error) {
    errs.push(`${label} repository root cannot be resolved: ${J(rootInput)} (${error.code || error.message})`);
    return errs;
  }
  const candidate = path.resolve(root, ...segments);
  if (!isContained(root, candidate)) {
    errs.push(`${label}.path escapes the repository root — got ${J(ref.path)}`);
    return errs;
  }
  if (!fs.existsSync(candidate)) {
    errs.push(`${label}.path does not exist — got ${J(ref.path)}`);
    return errs;
  }
  let resolved;
  try {
    resolved = fs.realpathSync(candidate);
  } catch (error) {
    errs.push(`${label}.path cannot be resolved: ${J(ref.path)} (${error.code || error.message})`);
    return errs;
  }
  if (!isContained(root, resolved)) {
    errs.push(`${label}.path resolves outside the repository root — got ${J(ref.path)}`);
    return errs;
  }
  const stat = fs.statSync(resolved);
  if (!stat.isFile()) {
    errs.push(`${label}.path must name a regular file — got ${J(ref.path)}`);
    return errs;
  }
  if (Number.isInteger(ref.size) && ref.size !== stat.size) {
    errs.push(`${label}.size does not match current file bytes for ${J(ref.path)}`);
  }
  if (isStr(ref.sha256) && SHA256_RE.test(ref.sha256)) {
    const digest = crypto.createHash('sha256').update(fs.readFileSync(resolved)).digest('hex');
    if (digest !== ref.sha256) errs.push(`${label}.sha256 does not match current file bytes for ${J(ref.path)}`);
  }
  return errs;
}

function validateOtherTargetPath(raw, label) {
  if (!isNonEmptyStr(raw)) return [`${label} must be a non-empty repository-relative path`];
  const portable = raw.replace(/\\/g, '/');
  const segments = portableSegments(raw);
  const errs = [];
  if (path.isAbsolute(raw) || path.win32.isAbsolute(portable)) {
    errs.push(`${label} must be repository-relative — got ${J(raw)}`);
  }
  if (segments.includes('..')) errs.push(`${label} must not contain parent traversal ("..") — got ${J(raw)}`);
  if (segments.length === 0) errs.push(`${label} must name a repository target`);
  return errs;
}

function validateOtherContract(rec, rootInput) {
  const contract = rec.other_contract;
  if (rec.dispatch_type !== 'other') {
    return contract === undefined ? [] : ['other_contract is allowed only when dispatch_type is "other"'];
  }
  if (!isObj(contract)) return ['other_contract is required when dispatch_type is "other"'];
  const errs = [];
  for (const key of Object.keys(contract)) {
    if (!OTHER_CONTRACT_KEYS.has(key)) errs.push(`other_contract: unknown key "${key}"`);
  }
  if (contract.owner_capability !== OTHER_OWNER_CAPABILITY) {
    errs.push(`other_contract.owner_capability must equal ${J(OTHER_OWNER_CAPABILITY)}`);
  }
  const nonEmptyStrings = (value, label) => {
    if (!Array.isArray(value) || value.length === 0 || value.some((item) => !isNonEmptyStr(item))) {
      errs.push(`${label} must be a non-empty array of non-empty strings`);
      return [];
    }
    if (new Set(value).size !== value.length) errs.push(`${label} must not contain duplicates`);
    return value;
  };
  const targets = nonEmptyStrings(contract.targets, 'other_contract.targets');
  targets.forEach((target, index) => errs.push(...validateOtherTargetPath(target, `other_contract.targets[${index}]`)));
  nonEmptyStrings(contract.allowed_mutations, 'other_contract.allowed_mutations');
  nonEmptyStrings(contract.forbidden_mutations, 'other_contract.forbidden_mutations');
  nonEmptyStrings(contract.validation_commands, 'other_contract.validation_commands');
  nonEmptyStrings(contract.stop_conditions, 'other_contract.stop_conditions');
  if (!isNonEmptyStr(contract.expected_result)) {
    errs.push('other_contract.expected_result must be a non-empty string');
  }
  if (!Array.isArray(contract.source_refs) || contract.source_refs.length === 0) {
    errs.push('other_contract.source_refs must be a non-empty array of exact references');
  } else {
    contract.source_refs.forEach((ref, index) => {
      errs.push(...validateExactRef(ref, `other_contract.source_refs[${index}]`, rootInput));
    });
  }

  const groupById = new Map(
    Array.isArray(rec.groups)
      ? rec.groups.filter(isObj).map((group) => [group.group_id, group])
      : [],
  );
  const connectionList = Array.isArray(rec.connections) ? rec.connections.filter(isObj) : [];
  const coveredWriters = new Set();
  const coveredReviewers = new Set();
  const targetOwners = new Map();
  if (!Array.isArray(contract.lanes) || contract.lanes.length === 0) {
    errs.push('other_contract.lanes must be a non-empty array');
  } else {
    const laneIds = new Set();
    contract.lanes.forEach((lane, index) => {
      const label = `other_contract.lanes[${index}]`;
      if (!isObj(lane)) {
        errs.push(`${label} must be an object`);
        return;
      }
      for (const key of Object.keys(lane)) {
        if (!OTHER_LANE_KEYS.has(key)) errs.push(`${label}: unknown key "${key}"`);
      }
      if (!isNonEmptyStr(lane.lane_id)) errs.push(`${label}.lane_id must be non-empty`);
      else if (laneIds.has(lane.lane_id)) errs.push(`${label}.lane_id must be unique`);
      else laneIds.add(lane.lane_id);
      if (!isNonEmptyStr(lane.writer_group_id)) errs.push(`${label}.writer_group_id must be non-empty`);
      if (!isNonEmptyStr(lane.reviewer_group_id)) errs.push(`${label}.reviewer_group_id must be non-empty`);
      if (!['sequential', 'zig-zag'].includes(lane.connection_type)) {
        errs.push(`${label}.connection_type must be sequential or zig-zag`);
      }
      if (coveredWriters.has(lane.writer_group_id)) errs.push(`${label}.writer_group_id must be unique across lanes`);
      if (coveredReviewers.has(lane.reviewer_group_id)) errs.push(`${label}.reviewer_group_id must be unique across lanes`);
      coveredWriters.add(lane.writer_group_id);
      coveredReviewers.add(lane.reviewer_group_id);

      const writer = groupById.get(lane.writer_group_id);
      const reviewer = groupById.get(lane.reviewer_group_id);
      const writerAgent = writer && Array.isArray(writer.agents) && writer.agents.length === 1
        ? writer.agents[0]
        : null;
      const reviewerAgent = reviewer && Array.isArray(reviewer.agents) && reviewer.agents.length === 1
        ? reviewer.agents[0]
        : null;
      if (!writerAgent || writerAgent.role !== 'writer' || !isNonEmptyStr(writerAgent.agent_name)) {
        errs.push(`${label}.writer_group_id must name a singleton pooled writer identity`);
      }
      if (!reviewerAgent || reviewerAgent.role !== 'skeptic' || !isNonEmptyStr(reviewerAgent.agent_name)) {
        errs.push(`${label}.reviewer_group_id must name a singleton pooled skeptic identity`);
      }
      if (
        writerAgent && reviewerAgent &&
        isNonEmptyStr(writerAgent.agent_name) && isNonEmptyStr(reviewerAgent.agent_name) &&
        normalizeIdentity(writerAgent.agent_name) === normalizeIdentity(reviewerAgent.agent_name)
      ) {
        errs.push(`${label} writer and reviewer identities must be distinct`);
      }
      const edge = connectionList.find((connection) =>
        connection.from === lane.writer_group_id &&
        connection.to === lane.reviewer_group_id &&
        connection.type === lane.connection_type
      );
      if (!edge) errs.push(`${label} must have its declared writer-to-reviewer connection`);

      const laneTargets = nonEmptyStrings(lane.target_paths, `${label}.target_paths`);
      for (const target of laneTargets) {
        if (!targets.includes(target)) errs.push(`${label}.target_paths contains undeclared target ${J(target)}`);
        const normalized = normalizeRepoPath(target);
        for (const [owned, owner] of targetOwners) {
          if (
            owned === normalized || owned.startsWith(`${normalized}/`) || normalized.startsWith(`${owned}/`)
          ) {
            errs.push(`${label}.target_paths overlaps lane ${J(owner)} at ${J(target)}`);
          }
        }
        targetOwners.set(normalized, lane.lane_id || label);
      }
    });
  }
  for (const target of targets) {
    const normalized = normalizeRepoPath(target);
    if (!targetOwners.has(normalized)) errs.push(`other_contract target ${J(target)} is not owned by any lane`);
  }
  const writerGroups = Array.isArray(rec.groups)
    ? rec.groups.filter((group) => isObj(group) && Array.isArray(group.agents) && group.agents.some((agent) => agent && agent.role === 'writer'))
    : [];
  for (const group of writerGroups) {
    if (!coveredWriters.has(group.group_id)) errs.push(`writer group ${J(group.group_id)} is not owned by an other_contract lane`);
  }
  return errs;
}

function exactRefsEqual(left, right) {
  return isObj(left) && isObj(right) &&
    normalizeRepoPath(left.path || '') === normalizeRepoPath(right.path || '') &&
    left.sha256 === right.sha256 && left.size === right.size;
}

function validateRegistrationEnvelope(envelope, rootInput, record) {
  const errs = [];
  if (!isObj(envelope)) return ['registration envelope must be an object'];
  const schemaPath = path.join(__dirname, 'registration-envelope.schema.json');
  validateJsonSchema(envelope, schemaPath, 'registration envelope', errs);
  if (envelope.profile_id !== 'domainspec.subagent-strategy.private.v1') {
    errs.push('registration envelope profile_id mismatch');
  }
  if (envelope.ledger !== 'telemetry/agents/subagents-dispatch.yaml') {
    errs.push('registration envelope ledger path mismatch');
  }
  errs.push(...validateExactRef(envelope.profile_ref, 'registration envelope profile_ref', rootInput));
  errs.push(...validateExactRef(envelope.source_sheet_ref, 'registration envelope source_sheet_ref', rootInput));
  errs.push(...validateExactRef(envelope.admission_receipt_ref, 'registration envelope admission_receipt_ref', rootInput));
  if (isObj(envelope.confirmation) && envelope.confirmation.material_equivalence_ref !== null) {
    errs.push(...validateExactRef(
      envelope.confirmation.material_equivalence_ref,
      'registration envelope confirmation.material_equivalence_ref',
      rootInput,
    ));
  }
  const binding = isObj(record) ? record.evidence_binding : null;
  const confirmation = isObj(binding) ? binding.confirmation : null;
  if (!isObj(binding) || !isObj(confirmation)) {
    errs.push('registration envelope record must contain material-bound evidence_binding confirmation');
  } else {
    if (
      !isObj(envelope.source_sheet_ref) ||
      normalizeRepoPath(envelope.source_sheet_ref.path || '') !== normalizeRepoPath(binding.sheet_path || '') ||
      envelope.source_sheet_ref.sha256 !== binding.sheet_sha256
    ) {
      errs.push('registration envelope source_sheet_ref must bind the durable evidence_binding sheet');
    }
    if (envelope.confirmation.handle !== confirmation.handle) {
      errs.push('registration envelope confirmation handle mismatch');
    }
    if (envelope.confirmation.binding_sha256 !== confirmation.material_sha256) {
      errs.push('registration envelope confirmation binding digest must equal confirmed material digest');
    }
    if (!exactRefsEqual(envelope.admission_receipt_ref, binding.preconfirmation_closure)) {
      errs.push('registration envelope admission receipt must equal evidence_binding.preconfirmation_closure');
    }
  }
  if (!SHA256_RE.test(String(envelope.execution_projection_sha256 || ''))) {
    errs.push('registration envelope execution_projection_sha256 must be a lowercase SHA-256');
  }
  return errs;
}

function loadExactJsonRef(ref, label, rootInput, errs) {
  const refErrors = validateExactRef(ref, label, rootInput);
  errs.push(...refErrors);
  if (refErrors.length > 0 || !isObj(ref) || !isNonEmptyStr(ref.path)) return null;
  try {
    const root = fs.realpathSync(rootInput);
    const resolved = path.resolve(root, ...portableSegments(ref.path));
    return JSON.parse(fs.readFileSync(resolved, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    errs.push(`${label}.path is not parseable JSON: ${error.message}`);
    return null;
  }
}

function currentExactRef(rootInput, repoPath, label, errs) {
  try {
    const root = fs.realpathSync(rootInput);
    const candidate = path.resolve(root, ...portableSegments(repoPath));
    if (!isContained(root, candidate)) throw new Error('path escapes the repository root');
    const resolved = fs.realpathSync(candidate);
    if (!isContained(root, resolved) || !fs.statSync(resolved).isFile()) {
      throw new Error('path must resolve to a repository file');
    }
    const bytes = fs.readFileSync(resolved);
    return {
      path: path.relative(root, resolved).split(path.sep).join('/'),
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      size: bytes.length,
    };
  } catch (error) {
    errs.push(`${label} cannot be resolved: ${error.message}`);
    return null;
  }
}

function exactRefAbsolutePath(rootInput, ref) {
  const root = fs.realpathSync(rootInput);
  return fs.realpathSync(path.resolve(root, ...portableSegments(ref.path)));
}

function validateJsonSchema(instance, schemaPath, label, errs) {
  const source = [
    'import json, sys',
    'from jsonschema import Draft202012Validator',
    'schema = json.load(open(sys.argv[1], encoding="utf-8"))',
    'instance = json.load(sys.stdin)',
    'errors = sorted(Draft202012Validator(schema).iter_errors(instance), key=lambda item: list(item.absolute_path))',
    'print("\\n".join(("/" + "/".join(map(str, error.absolute_path)) + ": " + error.message) for error in errors))',
    'raise SystemExit(2 if errors else 0)',
  ].join('\n');
  const result = spawnSync('python3', ['-c', source, schemaPath], {
    encoding: 'utf8',
    input: JSON.stringify(instance),
  });
  if (result.error || result.status !== 0) {
    errs.push(`${label} does not satisfy its current JSON Schema: ${(result.stderr || result.stdout || (result.error && result.error.message) || 'validator failed').trim()}`);
  }
}

function exactRefObjectMapEqual(left, right) {
  if (!isObj(left) || !isObj(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return canonicalJson(leftKeys) === canonicalJson(rightKeys) &&
    leftKeys.every((key) => exactRefsEqual(left[key], right[key]));
}

function validatePreconfirmationClosure(ref, rootInput, sheetRecord, binding) {
  const errs = [];
  const closure = loadExactJsonRef(ref, 'evidence_binding.preconfirmation_closure', rootInput, errs);
  if (!isObj(closure)) return errs;
  const closureSchemaPath = path.resolve(
    fs.realpathSync(rootInput),
    ...portableSegments(PRECONFIRMATION_CONSUMER_PATHS.preconfirmation_closure_schema),
  );
  validateJsonSchema(closure, closureSchemaPath, 'preconfirmation closure', errs);
  if (closure.schema_version !== 'domainspec.preconfirmation-closure.v1') {
    errs.push('preconfirmation closure has an unsupported schema_version');
  }
  const expectedScope = sheetRecord.dispatch_type === 'experiment' ? 'experiment' : 'dispatch';
  if (closure.scope !== expectedScope) {
    errs.push(`preconfirmation closure scope must be ${J(expectedScope)} for the current sheet`);
  }
  if (closure.status !== 'pass' || !Array.isArray(closure.blockers) || closure.blockers.length !== 0) {
    errs.push('preconfirmation closure must have status "pass" and no blockers');
  }
  const inputs = closure.inputs;
  const currentSheetRef = currentExactRef(rootInput, binding.sheet_path, 'current sheet', errs);
  if (!isObj(inputs) || !currentSheetRef || !exactRefsEqual(inputs.sheet_ref, currentSheetRef)) {
    errs.push('preconfirmation closure sheet_ref must match evidence_binding sheet path and digest');
  }
  if (isObj(inputs)) {
    for (const [key, value] of Object.entries(inputs)) {
      if (key === 'sheet_ref') continue;
      if (key === 'criterion_package_refs' && isObj(value)) {
        for (const [criterionKey, criterionRef] of Object.entries(value)) {
          errs.push(...validateExactRef(
            criterionRef,
            `preconfirmation closure inputs.criterion_package_refs.${criterionKey}`,
            rootInput,
          ));
        }
      } else if (key === 'consumer_versions' && isObj(value)) {
        for (const [consumerId, consumerRef] of Object.entries(value)) {
          errs.push(...validateExactRef(
            consumerRef,
            `preconfirmation closure inputs.consumer_versions.${consumerId}`,
            rootInput,
          ));
        }
      } else if (key === 'tension_evidence_ref' && value === null) {
        continue;
      } else if (closure.scope === 'dispatch' &&
          ['execution_dispatch_ref', 'execution_briefings_ref'].includes(key) && value === null) {
        continue;
      } else if (key.endsWith('_ref')) {
        errs.push(...validateExactRef(value, `preconfirmation closure inputs.${key}`, rootInput));
      }
    }
  }
  let material;
  try {
    material = projectMaterialStrategy(sheetRecord);
  } catch (error) {
    errs.push(`preconfirmation closure cannot project current material strategy: ${error.message}`);
  }
  if (!isObj(closure.material_strategy) || !material ||
      closure.material_strategy.material_sha256 !== material.material_sha256) {
    errs.push('preconfirmation closure material digest does not match the current sheet');
  }
  const materialProjection = isObj(inputs)
    ? loadExactJsonRef(inputs.material_projection_ref, 'preconfirmation closure inputs.material_projection_ref', rootInput, errs)
    : null;
  if (!material || !isObj(materialProjection) || canonicalJson(materialProjection) !== canonicalJson(material)) {
    errs.push('preconfirmation closure material projection bytes do not equal the current canonical projection');
  }
  const contract = isObj(sheetRecord.experiment_contract) ? sheetRecord.experiment_contract : {};
  if (expectedScope === 'experiment') {
    if (!isObj(inputs) || !exactRefsEqual(inputs.execution_dispatch_ref, contract.execution_dispatch_ref)) {
      errs.push('preconfirmation closure execution_dispatch_ref must exactly match the current sheet contract');
    }
    if (!isObj(inputs) || !exactRefsEqual(inputs.execution_briefings_ref, contract.execution_briefings_ref)) {
      errs.push('preconfirmation closure execution_briefings_ref must exactly match the current sheet contract');
    }
    if (!isObj(inputs) || !exactRefObjectMapEqual(inputs.criterion_package_refs, contract.criterion_package)) {
      errs.push('preconfirmation closure criterion_package_refs must exactly match the current sheet contract');
    }
  } else if (!isObj(inputs) || inputs.execution_dispatch_ref !== null ||
      inputs.execution_briefings_ref !== null || !isObj(inputs.criterion_package_refs) ||
      Object.keys(inputs.criterion_package_refs).length !== 0) {
    errs.push('non-experiment preconfirmation closure must have null execution refs and an empty criterion package');
  }
  const expectedConsumers = {};
  for (const [consumerId, consumerPath] of Object.entries(PRECONFIRMATION_CONSUMER_PATHS)) {
    if (expectedScope !== 'experiment' && !PRECONFIRMATION_BASE_CONSUMER_IDS.has(consumerId)) continue;
    const expected = currentExactRef(rootInput, consumerPath, `current consumer ${consumerId}`, errs);
    if (expected) expectedConsumers[consumerId] = expected;
  }
  if (!isObj(inputs) || !exactRefObjectMapEqual(inputs.consumer_versions, expectedConsumers)) {
    errs.push('preconfirmation closure consumer_versions must equal the complete current canonical consumer set');
  }
  const disposition = closure.tension_disposition;
  const expectedBranch = hasSubjectGroup(sheetRecord) ? 'subject' : 'no_subject';
  if (!isObj(disposition) || disposition.branch !== expectedBranch) {
    errs.push('preconfirmation closure tension branch does not match the current sheet');
  }
  const closureHandles = new Set(isObj(disposition) && Array.isArray(disposition.canonical_handles)
    ? disposition.canonical_handles
    : []);
  const boundHandles = new Set(Array.isArray(binding.tension_verdicts)
    ? binding.tension_verdicts.map((item) => item && item.handle).filter(isNonEmptyStr)
    : []);
  if (closureHandles.size !== boundHandles.size || [...closureHandles].some((handle) => !boundHandles.has(handle))) {
    errs.push('preconfirmation closure tension handles do not match evidence_binding.tension_verdicts');
  }
  if (expectedBranch === 'no_subject') {
    if (isObj(inputs) && inputs.tension_evidence_ref !== null) {
      errs.push('no-subject preconfirmation closure must not bind subject tension evidence');
    }
  } else if (!isObj(disposition) || disposition.expected_handle_class !== 'independent_pass_pair') {
    errs.push('subject preconfirmation closure must require an independent PASS pair');
  } else if (isObj(inputs)) {
    const evidence = loadExactJsonRef(inputs.tension_evidence_ref, 'preconfirmation closure inputs.tension_evidence_ref', rootInput, errs);
    if (isObj(evidence)) {
      const tensionSchemaPath = path.resolve(
        fs.realpathSync(rootInput),
        ...portableSegments(PRECONFIRMATION_CONSUMER_PATHS.check_tension_evidence_schema),
      );
      validateJsonSchema(evidence, tensionSchemaPath, 'subject tension evidence', errs);
      if (!currentSheetRef || !exactRefsEqual(evidence.sheet_ref, currentSheetRef)) {
        errs.push('subject tension evidence sheet_ref must match the current sheet bytes');
      }
      const evidenceHandles = new Set();
      const slots = new Set();
      for (const verdict of Array.isArray(evidence.verdicts) ? evidence.verdicts : []) {
        if (!isObj(verdict)) continue;
        slots.add(verdict.slot);
        if (isNonEmptyStr(verdict.handle)) evidenceHandles.add(verdict.handle);
        if (verdict.verdict !== 'pass' || verdict.sheet_sha256 !== binding.sheet_sha256) {
          errs.push('subject tension evidence must contain two current-digest PASS verdicts');
        }
      }
      if (evidence.independently_frozen !== true || slots.size !== 2 || !slots.has('checker') || !slots.has('reviewer')) {
        errs.push('subject tension evidence must contain independently frozen checker and reviewer verdicts');
      }
      if (evidenceHandles.size !== closureHandles.size || [...evidenceHandles].some((handle) => !closureHandles.has(handle))) {
        errs.push('subject tension evidence handles must exactly match the closure disposition');
      }
    }
  }
  if (!isObj(closure.consumer_closure) || closure.consumer_closure.status !== 'pass') {
    errs.push('preconfirmation closure consumer closure must pass');
  }
  if (!isObj(closure.experiment_checks) || closure.experiment_checks.status !== 'pass') {
    errs.push('preconfirmation closure experiment checks must pass');
  }
  if (!isObj(closure.execution_rehearsal) || closure.execution_rehearsal.status !== 'pass' ||
      closure.execution_rehearsal.spawn_attempt_count !== 0) {
    errs.push('preconfirmation closure execution rehearsal must pass with zero spawn attempts');
  }
  if (errs.length === 0 && isObj(inputs)) {
    const compilerPath = exactRefAbsolutePath(
      rootInput,
      inputs.consumer_versions.preconfirmation_closure_compiler,
    );
    const compilerArgs = [
      compilerPath,
      '--sheet', exactRefAbsolutePath(rootInput, inputs.sheet_ref),
      '--material-projection', exactRefAbsolutePath(rootInput, inputs.material_projection_ref),
      '--receipt', exactRefAbsolutePath(rootInput, ref),
      '--repo-root', fs.realpathSync(rootInput),
      '--verify-only', 'true',
    ];
    if (isObj(inputs.tension_evidence_ref)) {
      compilerArgs.push('--tension-evidence', exactRefAbsolutePath(rootInput, inputs.tension_evidence_ref));
    }
    const recompute = spawnSync(process.execPath, compilerArgs, { encoding: 'utf8' });
    let recomputeReceipt = null;
    try {
      recomputeReceipt = JSON.parse(recompute.stdout || '{}');
    } catch (_) {
      // The diagnostic below preserves the compiler output.
    }
    if (recompute.error || recompute.status !== 0 ||
        !isObj(recomputeReceipt) || recomputeReceipt.verification !== 'exact_recompute' ||
        recomputeReceipt.status !== 'pass' || recomputeReceipt.spawn_attempt_count !== 0) {
      errs.push(`preconfirmation closure does not equal a fresh no-effect compiler recomputation: ${(recompute.stderr || recompute.stdout || (recompute.error && recompute.error.message) || 'verification failed').trim()}`);
    }
  }
  if (!material || !isObj(binding.confirmation) ||
      binding.confirmation.material_sha256 !== material.material_sha256) {
    errs.push('confirmation.material_sha256 must match the current material strategy');
  }
  return errs;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (isObj(value)) {
    return `{${Object.keys(value).sort().map((key) => `${J(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return J(value);
}

function hasSubjectGroup(record) {
  return isObj(record) && Array.isArray(record.groups) && record.groups.some((group) =>
    isObj(group) && Array.isArray(group.agents) && group.agents.length >= 2 &&
    group.agents.some((agent) => isObj(agent) && SUBJECT_AGENT_ROLES.has(agent.role)));
}

function canonicalNoSubjectTensionHandles(sheetSha256) {
  return new Set([
    `${NO_SUBJECT_TENSION_HANDLE_PREFIX}checker:${sheetSha256}`,
    `${NO_SUBJECT_TENSION_HANDLE_PREFIX}reviewer:${sheetSha256}`,
  ]);
}

const projectDir = process.env.ARCANUM_PROJECT_DIR ||
  process.env.CODEX_PROJECT_DIR ||
  process.env.CLAUDE_PROJECT_DIR ||
  (isNonEmptyStr(rec.project_dir) ? rec.project_dir : process.cwd());

function validateEvidenceBinding(binding, rootInput, record) {
  const errs = [];
  let sheetRecord = null;
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
            const sheetBytes = fs.readFileSync(resolvedSheet);
            const actualDigest = crypto.createHash('sha256').update(sheetBytes).digest('hex');
            if (actualDigest !== binding.sheet_sha256) {
              errs.push(`evidence_binding.sheet_sha256 does not match current sheet bytes for ${J(binding.sheet_path)}`);
            }
            try {
              sheetRecord = JSON.parse(sheetBytes.toString('utf8').replace(/^\uFEFF/, ''));
            } catch (error) {
              errs.push(`evidence_binding.sheet_path is not parseable JSON: ${error.message}`);
            }
            if (sheetRecord && record && hasSubjectGroup(sheetRecord) !== hasSubjectGroup(record)) {
              errs.push('registered groups must preserve the confirmed sheet subject-group disposition');
            }
            if (sheetRecord && record && record.dispatch_type === 'experiment' &&
                canonicalJson(sheetRecord.experiment_contract) !== canonicalJson(record.experiment_contract)) {
              errs.push('registered experiment_contract must exactly match the confirmed sheet experiment_contract');
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
    if (sheetRecord && isStr(binding.sheet_sha256) && SHA256_RE.test(binding.sheet_sha256)) {
      if (hasSubjectGroup(sheetRecord)) {
        if ([...handles].some((handle) => handle.startsWith(NO_SUBJECT_TENSION_HANDLE_PREFIX))) {
          errs.push('subject-group sheets require two independent tension verdict handles; reserved no-subject handles are forbidden');
        }
      } else {
        const expected = canonicalNoSubjectTensionHandles(binding.sheet_sha256);
        if (handles.size !== expected.size || [...expected].some((handle) => !handles.has(handle))) {
          errs.push('no-subject sheets require exactly the canonical checker and reviewer no-subject handles bound to evidence_binding.sheet_sha256');
        }
      }
    }
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
  if (record.schema_version === CURRENT_SCHEMA_VERSION) {
    if (!isObj(binding.preconfirmation_closure)) {
      errs.push('evidence_binding.preconfirmation_closure is required for schema v0.10.0');
    } else if (sheetRecord) {
      errs.push(...validatePreconfirmationClosure(
        binding.preconfirmation_closure,
        rootInput,
        sheetRecord,
        binding,
      ));
    }
  } else {
    if (binding.preconfirmation_closure !== undefined) {
      errs.push('evidence_binding.preconfirmation_closure is allowed only for schema v0.10.0');
    }
    if (isObj(confirmation) && confirmation.material_sha256 !== undefined) {
      errs.push('evidence_binding.confirmation.material_sha256 is allowed only for schema v0.10.0');
    }
  }
  return errs;
}

function validateExperimentContract(rec, rootInput) {
  const errs = [];
  const contract = rec.experiment_contract;
  if (rec.dispatch_type !== 'experiment') {
    if (contract !== undefined) errs.push('experiment_contract is allowed only when dispatch_type is "experiment"');
    return errs;
  }
  if (!isObj(contract)) return ['experiment_contract is required when dispatch_type is "experiment"'];
  if (!EXPERIMENT_PHASES.includes(contract.phase)) {
    errs.push(`experiment_contract.phase must be one of ${EXPERIMENT_PHASES.join(' | ')} (got ${J(contract.phase)})`);
    return errs;
  }

  const allowed = contract.phase === 'propose' ? EXPERIMENT_PROPOSE_KEYS : EXPERIMENT_RUN_KEYS;
  for (const key of Object.keys(contract)) {
    if (!allowed.has(key)) errs.push(`experiment_contract(${contract.phase}): unknown key "${key}"`);
  }

  if (contract.phase === 'propose') {
    errs.push(...validateOutputPath(contract.criterion_output_path, 'experiment_contract.criterion_output_path'));
    if (rec.schema_version === CURRENT_SCHEMA_VERSION) {
      if (!isObj(contract.criterion_package)) {
        errs.push('experiment_contract.criterion_package is required for schema v0.10.0 propose');
      } else {
        for (const key of Object.keys(contract.criterion_package)) {
          if (!CRITERION_PACKAGE_KEYS.has(key)) {
            errs.push(`experiment_contract.criterion_package: unknown key "${key}"`);
          }
        }
        for (const key of CRITERION_PACKAGE_KEYS) {
          errs.push(...validateExactRef(
            contract.criterion_package[key],
            `experiment_contract.criterion_package.${key}`,
            rootInput,
          ));
        }
      }
      errs.push(...validateExactRef(
        contract.execution_dispatch_ref,
        'experiment_contract.execution_dispatch_ref',
        rootInput,
      ));
      errs.push(...validateExactRef(
        contract.execution_briefings_ref,
        'experiment_contract.execution_briefings_ref',
        rootInput,
      ));
      if (!Array.isArray(contract.pre_freeze_obligations) || contract.pre_freeze_obligations.length === 0) {
        errs.push('experiment_contract.pre_freeze_obligations must be a non-empty array for schema v0.10.0 propose');
      } else {
        const obligationIds = new Set();
        contract.pre_freeze_obligations.forEach((obligation, index) => {
          const where = `experiment_contract.pre_freeze_obligations[${index}]`;
          if (!isObj(obligation)) {
            errs.push(`${where} must be an object`);
            return;
          }
          for (const key of Object.keys(obligation)) {
            if (!PRE_FREEZE_OBLIGATION_KEYS.has(key)) errs.push(`${where}: unknown key "${key}"`);
          }
          for (const key of ['obligation_id', 'execution_role_id', 'receipt_ref', 'gate_id']) {
            if (!isNonEmptyStr(obligation[key])) errs.push(`${where}.${key} is required and must be non-empty`);
          }
          if (isNonEmptyStr(obligation.obligation_id)) {
            if (obligationIds.has(obligation.obligation_id)) errs.push(`${where}.obligation_id must be unique`);
            obligationIds.add(obligation.obligation_id);
          }
          if (!Array.isArray(obligation.required_read_scopes) || obligation.required_read_scopes.length === 0 ||
              obligation.required_read_scopes.some((scope) => !isNonEmptyStr(scope))) {
            errs.push(`${where}.required_read_scopes must be a non-empty string array`);
          }
          if (!Array.isArray(obligation.independent_of_role_ids) || obligation.independent_of_role_ids.length === 0 ||
              obligation.independent_of_role_ids.some((roleId) => !isNonEmptyStr(roleId))) {
            errs.push(`${where}.independent_of_role_ids must be a non-empty string array`);
          }
          if (Array.isArray(obligation.independent_of_role_ids) &&
              obligation.independent_of_role_ids.includes(obligation.execution_role_id)) {
            errs.push(`${where}.execution_role_id cannot review itself`);
          }
        });
      }
    } else {
      for (const key of [
        'criterion_package', 'pre_freeze_obligations',
        'execution_dispatch_ref', 'execution_briefings_ref',
      ]) {
        if (contract[key] !== undefined) {
          errs.push(`experiment_contract.${key} is allowed only for schema v0.10.0 propose`);
        }
      }
    }
    return errs;
  }

  if (!isNonEmptyStr(contract.proposal_dispatch_id)) {
    errs.push('experiment_contract.proposal_dispatch_id is required for a run');
  } else if (contract.proposal_dispatch_id === rec.dispatch_id) {
    errs.push('experiment_contract.proposal_dispatch_id must not reference the run dispatch itself');
  }
  errs.push(...validateExactRef(contract.criterion_ref, 'experiment_contract.criterion_ref', rootInput));
  errs.push(...validateOutputPath(contract.experiment_output_path, 'experiment_contract.experiment_output_path'));
  errs.push(...validateOutputPath(contract.findings_output_path, 'experiment_contract.findings_output_path'));
  if (normalizeRepoPath(contract.experiment_output_path || '') === normalizeRepoPath(contract.findings_output_path || '')) {
    errs.push('experiment_contract experiment_output_path and findings_output_path must be distinct');
  }
  if (isObj(contract.criterion_ref) && isNonEmptyStr(contract.criterion_ref.path) && isNonEmptyStr(rec.working_folder)) {
    const workingPrefix = normalizeRepoPath(rec.working_folder) + '/';
    if (!normalizeRepoPath(contract.criterion_ref.path).startsWith(workingPrefix)) {
      errs.push('experiment_contract.criterion_ref.path must be contained beneath working_folder');
    }
    const experimentPath = outputRepoPath(rec.working_folder, contract.experiment_output_path || '');
    const findingsPath = outputRepoPath(rec.working_folder, contract.findings_output_path || '');
    const criterionPath = normalizeRepoPath(contract.criterion_ref.path);
    if (criterionPath === experimentPath || criterionPath === findingsPath) {
      errs.push('experiment_contract criterion, experiment, and findings paths must be distinct');
    }
  }
  if (!isObj(contract.adjudication)) {
    errs.push('experiment_contract.adjudication is required for a run');
  } else {
    for (const key of Object.keys(contract.adjudication)) {
      if (!ADJUDICATION_KEYS.has(key)) errs.push(`experiment_contract.adjudication: unknown key "${key}"`);
    }
    if (contract.adjudication.mode !== 'parent_mechanical') {
      errs.push('experiment_contract.adjudication.mode must be exactly "parent_mechanical" under the accepted D2-A contract');
    }
    if (!isNonEmptyStr(contract.adjudication.rule_locator)) {
      errs.push('experiment_contract.adjudication.rule_locator is required and must locate the frozen mechanical rule');
    } else if (isObj(contract.criterion_ref) && isNonEmptyStr(contract.criterion_ref.path) &&
        !contract.adjudication.rule_locator.startsWith(`${normalizeRepoPath(contract.criterion_ref.path)}#`)) {
      errs.push('experiment_contract.adjudication.rule_locator must be the exact criterion_ref.path plus a fragment');
    }
  }
  if (rec.final_approver !== 'parent') {
    errs.push('experiment run with parent_mechanical adjudication requires final_approver "parent"');
  }
  return errs;
}

function validateExperimentCloseoutShape(closeout, rootInput) {
  const errs = [];
  if (!isObj(closeout)) return ['experiment_closeout must be an object when present'];
  if (!EXPERIMENT_PHASES.includes(closeout.phase)) {
    errs.push(`experiment_closeout.phase must be one of ${EXPERIMENT_PHASES.join(' | ')} (got ${J(closeout.phase)})`);
    return errs;
  }
  const allowed = closeout.phase === 'propose' ? PROPOSE_CLOSEOUT_KEYS : RUN_CLOSEOUT_KEYS;
  for (const key of Object.keys(closeout)) {
    if (!allowed.has(key)) errs.push(`experiment_closeout(${closeout.phase}): unknown key "${key}"`);
  }

  if (closeout.phase === 'propose') {
    if (!PROPOSAL_STATUSES.includes(closeout.status)) {
      errs.push(`experiment_closeout.status must be one of ${PROPOSAL_STATUSES.join(' | ')} for propose`);
    }
    if (closeout.status === 'frozen') {
      errs.push(...validateExactRef(closeout.criterion_ref, 'experiment_closeout.criterion_ref', rootInput));
    } else if (closeout.criterion_ref !== undefined) {
      errs.push(`experiment_closeout.criterion_ref must be absent when propose status is ${J(closeout.status)}`);
    }
    return errs;
  }

  if (!RUN_STATUSES.includes(closeout.status)) {
    errs.push(`experiment_closeout.status must be one of ${RUN_STATUSES.join(' | ')} for run`);
  }
  if (closeout.status === 'adjudicated') {
    if (!EXPERIMENT_VERDICTS.includes(closeout.verdict)) {
      errs.push(`experiment_closeout.verdict must be one of ${EXPERIMENT_VERDICTS.join(' | ')} when adjudicated`);
    }
    errs.push(...validateExactRef(closeout.criterion_ref, 'experiment_closeout.criterion_ref', rootInput));
    errs.push(...validateExactRef(closeout.experiment_ref, 'experiment_closeout.experiment_ref', rootInput));
    errs.push(...validateExactRef(closeout.findings_ref, 'experiment_closeout.findings_ref', rootInput));
  } else {
    for (const key of ['verdict', 'criterion_ref', 'experiment_ref', 'findings_ref']) {
      if (closeout[key] !== undefined) {
        errs.push(`experiment_closeout.${key} must be absent when run status is ${J(closeout.status)}`);
      }
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
    else if (LEGACY_LEDGER_KEYS.has(k)) errs.push(`"${k}" is a pre-v0.5.2 ledger-row key, not in the v0.9.0 schema — drop it from the record`);
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
    errs.push(...validateEvidenceBinding(rec.evidence_binding, projectDir, rec));
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
  errs.push(...validateExperimentContract(rec, projectDir));

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
  errs.push(...validateOtherContract(rec, projectDir));
  return errs;
}

function validateClose(rec) {
  const errs = [];
  if (rec.dispatch_id !== undefined) errs.push('a close record must use close_of, not dispatch_id');
  for (const k of Object.keys(rec)) {
    if (k === 'dispatch_id' || CLOSE_KEYS.has(k)) continue;
    if (REMOVED_KEYS.has(k)) errs.push(`"${k}" was removed by schema v0.5.2 — drop it from the record`);
    else if (LEGACY_LEDGER_KEYS.has(k)) errs.push(`"${k}" is a pre-v0.5.2 ledger-row key, not in the v0.9.0 schema — drop it from the record`);
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
  if (rec.experiment_closeout !== undefined) {
    errs.push(...validateExperimentCloseoutShape(rec.experiment_closeout, projectDir));
  }
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
if (consumeEnvelope) {
  if (isClose) {
    if (registrationEnvelope !== null) {
      errs.push('--consume close records must be raw close rows, not registration envelopes');
    }
  } else {
    errs.push(...validateRegistrationEnvelope(registrationEnvelope, projectDir, rec));
  }
}
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
if (
  !validateSheetOnly &&
  !isClose &&
  rec.schema_version === CURRENT_SCHEMA_VERSION &&
  !consumeEnvelope
) {
  console.error(`invalid dispatch record (schema v${rec.schema_version}):`);
  console.error('  - every current v0.10.0 registration must consume a run-local registration envelope through --consume');
  process.exit(2);
}
if (!validateSheetOnly && !isClose && rec.schema_version !== CURRENT_SCHEMA_VERSION) {
  console.error(`invalid dispatch record (schema v${rec.schema_version}):`);
  console.error(`  - historical schema v${rec.schema_version} is validate-only; every new dispatch registration requires v${CURRENT_SCHEMA_VERSION}`);
  process.exit(2);
}

function emitSheetValidationPass(ledgerRead) {
  const digest = crypto.createHash('sha256').update(srcBytes).digest('hex');
  console.log('SHEET_VALIDATION=pass');
  console.log(`SCHEMA_VERSION=${SCHEMA_VERSION}`);
  console.log(`SHEET_SHA256=${digest}`);
  console.log(`LEDGER_READ=${ledgerRead}`);
  console.log('LEDGER_MUTATION=none');
  process.exit(0);
}

const needsProposalLineageRead = !isClose && rec.dispatch_type === 'experiment' &&
  isObj(rec.experiment_contract) && rec.experiment_contract.phase === 'run';
if (validateSheetOnly && !needsProposalLineageRead) {
  emitSheetValidationPass('none');
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
const sharedEnginePath = path.join(
  fs.realpathSync(projectDir),
  'arcanum',
  'arcana',
  'subagent-strategy',
  'scripts',
  'ledger-engine.cjs',
);
let sharedEngine;
try {
  sharedEngine = require(sharedEnginePath);
} catch (error) {
  console.error('cannot load the shared Arcanum registrar engine:', error.message);
  process.exit(2);
}
let history;
try {
  history = sharedEngine.inspectHistory({
    projectDir,
    ledgerRelative: 'telemetry/agents/subagents-dispatch.yaml',
    header,
  });
} catch (error) {
  console.error(error.message || String(error));
  process.exit(Number.isInteger(error.code) ? error.code : 1);
}
const { dispatchRows, closeRows } = history;

function validateExperimentRunLineage(row, currentDispatchRows = dispatchRows, currentCloseRows = closeRows) {
  const errs = [];
  const contract = row.experiment_contract;
  if (row.dispatch_type !== 'experiment' || !isObj(contract) || contract.phase !== 'run') return errs;
  const proposal = currentDispatchRows.get(contract.proposal_dispatch_id);
  if (!proposal) {
    errs.push(`experiment_contract.proposal_dispatch_id ${J(contract.proposal_dispatch_id)} does not reference an existing dispatch row`);
    return errs;
  }
  if (proposal.schema_version !== SCHEMA_VERSION || proposal.dispatch_type !== 'experiment' ||
      !isObj(proposal.experiment_contract) || proposal.experiment_contract.phase !== 'propose') {
    errs.push(`experiment_contract.proposal_dispatch_id ${J(contract.proposal_dispatch_id)} must reference a v${SCHEMA_VERSION} experiment propose row`);
    return errs;
  }
  const proposalClose = currentCloseRows.get(contract.proposal_dispatch_id);
  if (!proposalClose) {
    errs.push(`experiment proposal ${J(contract.proposal_dispatch_id)} is not closed`);
    return errs;
  }
  if (proposalClose.exit_reason !== 'resolved' || !isObj(proposalClose.experiment_closeout) ||
      proposalClose.experiment_closeout.phase !== 'propose' ||
      proposalClose.experiment_closeout.status !== 'frozen') {
    errs.push(`experiment proposal ${J(contract.proposal_dispatch_id)} must close resolved with experiment_closeout status "frozen"`);
    return errs;
  }
  if (!exactRefsEqual(contract.criterion_ref, proposalClose.experiment_closeout.criterion_ref)) {
    errs.push('experiment_contract.criterion_ref must exactly match the frozen proposal closeout criterion_ref');
  }
  return errs;
}

function validateCloseAgainstDispatch(close, currentDispatchRows = dispatchRows) {
  const errs = [];
  const target = currentDispatchRows.get(close.close_of);
  if (!target) {
    errs.push(`close_of ${J(close.close_of)} does not reference an existing dispatch row`);
    return errs;
  }
  const governedExperiment = SUPPORTED_SCHEMA_VERSIONS.has(target.schema_version) &&
    target.dispatch_type === 'experiment' && isObj(target.experiment_contract);
  if (!governedExperiment) {
    if (close.experiment_closeout !== undefined) {
      errs.push('experiment_closeout is allowed only when closing a governed experiment dispatch');
    }
    return errs;
  }

  const contract = target.experiment_contract;
  const closeout = close.experiment_closeout;
  if (!isObj(closeout)) {
    errs.push('experiment_closeout is required when closing a governed experiment dispatch');
    return errs;
  }
  if (closeout.phase !== contract.phase) {
    errs.push('experiment_closeout.phase must match the registered experiment_contract.phase');
    return errs;
  }

  if (contract.phase === 'propose') {
    if (close.exit_reason === 'resolved') {
      if (!['frozen', 'invalid'].includes(closeout.status)) {
        errs.push('resolved experiment propose close requires status "frozen" or "invalid"');
      }
    } else if (closeout.status !== 'not_frozen') {
      errs.push('non-resolved experiment propose close requires status "not_frozen"');
    }
    if (closeout.status === 'frozen' && isObj(closeout.criterion_ref)) {
      const expected = outputRepoPath(target.working_folder, contract.criterion_output_path);
      if (normalizeRepoPath(closeout.criterion_ref.path || '') !== expected) {
        errs.push(`experiment_closeout.criterion_ref.path must equal the declared proposal output ${J(expected)}`);
      }
    }
    return errs;
  }

  if (close.exit_reason === 'resolved') {
    if (closeout.status !== 'adjudicated') {
      errs.push('resolved experiment run close requires status "adjudicated"');
    }
  } else if (closeout.status !== 'not_adjudicated') {
    errs.push('non-resolved experiment run close requires status "not_adjudicated"');
  }
  if (closeout.status === 'adjudicated') {
    if (!exactRefsEqual(closeout.criterion_ref, contract.criterion_ref)) {
      errs.push('experiment_closeout.criterion_ref must exactly match the registered run criterion_ref');
    }
    const expectedExperiment = outputRepoPath(target.working_folder, contract.experiment_output_path);
    const expectedFindings = outputRepoPath(target.working_folder, contract.findings_output_path);
    if (normalizeRepoPath((closeout.experiment_ref || {}).path || '') !== expectedExperiment) {
      errs.push(`experiment_closeout.experiment_ref.path must equal the declared run output ${J(expectedExperiment)}`);
    }
    if (normalizeRepoPath((closeout.findings_ref || {}).path || '') !== expectedFindings) {
      errs.push(`experiment_closeout.findings_ref.path must equal the declared run output ${J(expectedFindings)}`);
    }
  }
  return errs;
}

const ledgerErrors = isClose
  ? validateCloseAgainstDispatch(rec)
  : validateExperimentRunLineage(rec);
if (ledgerErrors.length > 0) {
  console.error(`invalid ${validateSheetOnly ? 'dispatch sheet' : isClose ? 'close' : 'dispatch'} record (schema v${SCHEMA_VERSION}):`);
  for (const error of ledgerErrors) console.error('  - ' + error);
  process.exit(2);
}

if (validateSheetOnly) {
  emitSheetValidationPass('proposal_lineage_only');
}

const registrationDigest = crypto.createHash('sha256').update(srcBytes).digest('hex');

function validateLockedPrivateHistory(state) {
  const errors = isClose
    ? validateCloseAgainstDispatch(rec, state.dispatchRows)
    : validateExperimentRunLineage(rec, state.dispatchRows, state.closeRows);
  if (isClose) {
    const target = state.dispatchRows.get(rec.close_of);
    if (target && target.schema_version === CURRENT_SCHEMA_VERSION && Array.isArray(target.groups)) {
      if (!consumeEnvelope) {
        errors.push('current v0.10.0 close must consume the exact registered temporary close record');
      } else {
        const sourceRelative = path.relative(projectDir, path.resolve(src)).split(path.sep).join('/');
        if (sourceRelative !== target.temporary_close) {
          errors.push(`close source path ${J(sourceRelative)} does not match registered temporary_close ${J(target.temporary_close)}`);
        }
      }
      const expectedAgents = target.groups.reduce(
        (sum, group) => sum + (Array.isArray(group.agents) ? group.agents.length : 0),
        0,
      );
      if (rec.agents_spawned.total !== expectedAgents) {
        errors.push(`agents_spawned.total (${rec.agents_spawned.total}) must equal the registered strategy agent count (${expectedAgents})`);
      }
      if (
        Number.isInteger(target.max_loops) &&
        rec.agents_spawned.loops_used > target.max_loops
      ) {
        errors.push(`agents_spawned.loops_used exceeds registered max_loops ${target.max_loops}`);
      }
    }
  }
  if (errors.length > 0) {
    throw new sharedEngine.RegistrationError(errors.join('; '));
  }
}

function renderPrivateRow(stamp) {
  if (isClose) {
    const output = [
      '  - close_of: ' + J(rec.close_of),
      '    closed: ' + J(stamp),
      '    close_sha256: ' + J(registrationDigest),
      '    invoked_by: ' + J(resolveInvokedBy()),
      '    exit_reason: ' + J(rec.exit_reason),
      '    agents_spawned: ' + J(rec.agents_spawned),
    ];
    if (consumeEnvelope) {
      output.push('    temporary_close: ' + J(path.relative(projectDir, path.resolve(src)).split(path.sep).join('/')));
    }
    if (rec.feedback_prompts !== undefined) {
      output.push('    feedback_prompts: ' + J(rec.feedback_prompts));
    }
    if (rec.experiment_closeout !== undefined) {
      output.push('    experiment_closeout: ' + J(rec.experiment_closeout));
    }
    return output;
  }

  const output = [
    '  - dispatch_id: ' + J(rec.dispatch_id),
    '    schema_version: ' + J(rec.schema_version),
    '    created: ' + J(stamp),
    '    registration_sha256: ' + J(registrationDigest),
    '    invoked_by: ' + J(resolveInvokedBy()),
    '    dispatch_type: ' + J(rec.dispatch_type),
    '    goal: ' + J(rec.goal),
    '    context: ' + J(rec.context),
    '    max_loops: ' + J(rec.max_loops),
    '    final_approver: ' + J(rec.final_approver),
  ];
  if (registrationEnvelope) {
    output.push('    profile_id: ' + J(registrationEnvelope.profile_id));
    output.push('    source_sheet_ref: ' + J(registrationEnvelope.source_sheet_ref));
    output.push('    source_lifecycle: ' + J(registrationEnvelope.source_lifecycle));
    output.push('    registration_envelope_sha256: ' + J(registrationDigest));
    output.push('    confirmation_binding_sha256: ' + J(registrationEnvelope.confirmation.binding_sha256));
    output.push('    admission_receipt_ref: ' + J(registrationEnvelope.admission_receipt_ref));
    output.push('    execution_projection_sha256: ' + J(registrationEnvelope.execution_projection_sha256));
    output.push('    temporary_close: ' + J(registrationEnvelope.temporary_close));
  }
  if (rec.meta === true) output.push('    meta: ' + J(true));
  if (rec.parent_dispatch_id != null) output.push('    parent_dispatch_id: ' + J(rec.parent_dispatch_id));
  if (rec.anti_bias_global != null) output.push('    anti_bias_global: ' + J(rec.anti_bias_global));
  if (rec.working_folder != null) output.push('    working_folder: ' + J(rec.working_folder));
  if (rec.experiment_contract != null) output.push('    experiment_contract: ' + J(rec.experiment_contract));
  if (rec.other_contract != null) output.push('    other_contract: ' + J(rec.other_contract));
  output.push('    evidence_binding: ' + J(rec.evidence_binding));
  output.push('    groups: ' + J(rec.groups));
  if (rec.connections !== undefined) output.push('    connections: ' + J(rec.connections));
  return output;
}

try {
  const receipt = sharedEngine.mutateRegistration({
    projectDir,
    ledgerRelative: 'telemetry/agents/subagents-dispatch.yaml',
    tempRootRelative: 'telemetry/agents/runtime/subagents-strategy',
    sourcePath: src,
    consume: consumeEnvelope,
    header,
    rowKind: isClose ? 'close' : 'dispatch',
    identity: isClose ? rec.close_of : rec.dispatch_id,
    contentDigest: registrationDigest,
    digestField: isClose ? 'close_sha256' : 'registration_sha256',
    conflictDescription: isClose ? 'content' : 'registration envelope bytes',
    renderRow: renderPrivateRow,
    beforeAppend: validateLockedPrivateHistory,
    receipt: {
      profile_id: 'domainspec.subagent-strategy.private.v1',
      row_schema_version: isClose ? null : SCHEMA_VERSION,
      confirmation_mode: 'material_projection',
      source_lifecycle: isClose && consumeEnvelope
        ? 'temporary_consumed'
        : registrationEnvelope
          ? 'durable'
          : 'historical_direct',
      durable_source_preserved: registrationEnvelope !== null,
      registration_envelope_consumed: consumeEnvelope,
      admission_receipt_kind: registrationEnvelope
        ? 'domainspec.preconfirmation-closure.v1'
        : null,
      execution_projection_sha256: registrationEnvelope
        ? registrationEnvelope.execution_projection_sha256
        : null,
    },
  });
  if (receipt.append_status === 'already_present_identical') {
    console.log(isClose ? 'already closed:' : 'already registered:', receipt.identity, '— no row appended.');
  } else {
    const agentCount = isClose
      ? rec.agents_spawned.total
      : rec.groups.reduce((total, group) => total + group.agents.length, 0);
    console.log(
      isClose ? 'closed dispatch' : 'registered dispatch',
      receipt.identity,
      '->',
      file,
      `(${agentCount} agents)`,
    );
  }
  if (receipt.temporary_envelope_consumed) {
    console.log(isClose ? 'consumed temporary close record' : 'consumed temporary registration envelope', src);
  }
  console.log('RUNTIME_RECEIPT=' + JSON.stringify(receipt));
} catch (error) {
  console.error(error.message || String(error));
  process.exitCode = Number.isInteger(error.code) ? error.code : 1;
}
