#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { project } = require('./material-strategy.cjs');

const SUBJECT_ROLES = new Set(['explorer', 'skeptic', 'auditor']);

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith('--')) throw new Error(`unexpected argument: ${key}`);
    const value = argv[++index];
    if (!value) throw new Error(`${key} requires a value`);
    options[key.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
  }
  for (const key of ['sheet', 'materialProjection', 'receipt', 'repoRoot']) {
    if (!options[key]) throw new Error(`--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} is required`);
  }
  return options;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function resolveRepoFile(root, input, label) {
  const candidate = path.isAbsolute(input) ? path.resolve(input) : path.resolve(root, input);
  if (!inside(root, candidate)) throw new Error(`${label} escapes repository root`);
  const resolved = fs.realpathSync(candidate);
  if (!inside(root, resolved)) throw new Error(`${label} resolves outside repository root`);
  if (!fs.statSync(resolved).isFile()) throw new Error(`${label} must name a file`);
  return resolved;
}

function exactRef(root, file) {
  const bytes = fs.readFileSync(file);
  return {
    path: path.relative(root, file).split(path.sep).join('/'),
    sha256: sha256(bytes),
    size: bytes.length,
  };
}

function exactRefMatches(root, declared, label) {
  if (!declared || typeof declared !== 'object' || Array.isArray(declared)) {
    throw new Error(`${label} must be an exact reference object`);
  }
  const file = resolveRepoFile(root, declared.path, `${label}.path`);
  const actual = exactRef(root, file);
  if (actual.sha256 !== declared.sha256 || actual.size !== declared.size || actual.path !== declared.path) {
    throw new Error(`${label} does not match current bytes`);
  }
  return { file, ref: actual };
}

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  return {
    status: Number.isInteger(result.status) ? result.status : 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function parseJsonOutput(result, label) {
  try {
    const value = JSON.parse(result.stdout);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('root is not an object');
    return value;
  } catch (error) {
    throw new Error(`${label} did not emit one JSON object: ${error.message}`);
  }
}

function jsonSchemaErrors(instance, schemaPath, label) {
  const source = [
    'import json, sys',
    'from jsonschema import Draft202012Validator',
    'with open(sys.argv[1], encoding="utf-8") as stream: schema = json.load(stream)',
    'instance = json.load(sys.stdin)',
    'errors = sorted(Draft202012Validator(schema).iter_errors(instance), key=lambda item: list(item.absolute_path))',
    'print(json.dumps([item.message for item in errors]))',
    'raise SystemExit(0 if not errors else 1)',
  ].join('\n');
  const result = spawnSync('python3', ['-c', source, schemaPath], {
    encoding: 'utf8',
    input: JSON.stringify(instance),
  });
  try {
    const errors = JSON.parse(result.stdout || '[]');
    if (!Array.isArray(errors)) throw new Error('validator output is not an array');
    if (result.status === 0 && errors.length === 0) return [];
    if (errors.length > 0) return errors.map((message) => `${label}: ${message}`);
    return [`${label}: schema validation failed without diagnostics (${result.stderr || `exit ${result.status}`})`];
  } catch (error) {
    return [`${label}: schema validator output was unreadable: ${error.message}`];
  }
}

function hasSubjectGroup(sheet) {
  return Array.isArray(sheet.groups) && sheet.groups.some((group) =>
    group && Array.isArray(group.agents) && group.agents.length >= 2 &&
    group.agents.some((agent) => agent && SUBJECT_ROLES.has(agent.role)));
}

function subjectTensionEvidence(root, sheetPath, input) {
  const evidencePath = resolveRepoFile(root, input, 'tension evidence');
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8').replace(/^\uFEFF/, ''));
  const expectedSheetRef = exactRef(root, sheetPath);
  const blockers = [];
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) {
    return { ref: exactRef(root, evidencePath), handles: [], blockers: ['tension evidence root must be an object'] };
  }
  const schemaPath = resolveRepoFile(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/check-tension-evidence.schema.json',
    'check-tension evidence schema',
  );
  blockers.push(...jsonSchemaErrors(evidence, schemaPath, 'tension evidence schema'));
  if (evidence.schema_version !== 'domainspec.check-tension-evidence.v1') {
    blockers.push('tension evidence has an unsupported schema_version');
  }
  if (evidence.independently_frozen !== true) {
    blockers.push('subject tension verdicts must be independently frozen');
  }
  if (JSON.stringify(canonical(evidence.sheet_ref)) !== JSON.stringify(canonical(expectedSheetRef))) {
    blockers.push('tension evidence sheet_ref does not match the current sheet bytes');
  }
  const verdicts = Array.isArray(evidence.verdicts) ? evidence.verdicts : [];
  if (verdicts.length !== 2) blockers.push('subject tension evidence must contain exactly two verdicts');
  const slots = new Set();
  const handles = new Set();
  for (const verdict of verdicts) {
    if (!verdict || typeof verdict !== 'object' || Array.isArray(verdict)) {
      blockers.push('subject tension verdict must be an object');
      continue;
    }
    if (!['checker', 'reviewer'].includes(verdict.slot)) blockers.push('subject tension verdict slot must be checker or reviewer');
    else if (slots.has(verdict.slot)) blockers.push(`subject tension verdict slot is duplicated: ${verdict.slot}`);
    else slots.add(verdict.slot);
    if (typeof verdict.handle !== 'string' || !verdict.handle.trim()) blockers.push('subject tension verdict handle must be non-empty');
    else if (verdict.handle.startsWith('check-tension:no-subject:')) blockers.push('subject tension verdict cannot use a reserved no-subject handle');
    else if (handles.has(verdict.handle)) blockers.push('subject tension verdict handles must be distinct');
    else handles.add(verdict.handle);
    if (verdict.verdict !== 'pass') blockers.push(`${verdict.slot || 'unknown'} tension verdict is not pass`);
    if (verdict.sheet_sha256 !== expectedSheetRef.sha256) blockers.push(`${verdict.slot || 'unknown'} tension verdict is not bound to the current sheet digest`);
  }
  if (slots.size !== 2 || !slots.has('checker') || !slots.has('reviewer')) {
    blockers.push('subject tension evidence must contain one checker and one reviewer verdict');
  }
  return { ref: exactRef(root, evidencePath), handles: [...handles].sort(), blockers };
}

function addBlocker(receipt, code, check, message, status = 1) {
  receipt.blockers.push({ code, check, message });
  if (receipt.first_nonzero === 0) receipt.first_nonzero = status || 1;
}

function defaultTool(root, relative) {
  return resolveRepoFile(root, relative, relative);
}

function main(argv) {
  const options = parseArgs(argv);
  const root = fs.realpathSync(options.repoRoot);
  const sheetPath = resolveRepoFile(root, options.sheet, 'sheet');
  const projectionPath = resolveRepoFile(root, options.materialProjection, 'material projection');
  const receiptPath = path.isAbsolute(options.receipt)
    ? path.resolve(options.receipt)
    : path.resolve(root, options.receipt);
  if (!inside(root, receiptPath)) throw new Error('receipt path escapes repository root');

  const sheet = JSON.parse(fs.readFileSync(sheetPath, 'utf8').replace(/^\uFEFF/, ''));
  const projection = JSON.parse(fs.readFileSync(projectionPath, 'utf8').replace(/^\uFEFF/, ''));
  const contract = sheet.experiment_contract || {};
  const receipt = {
    schema_version: 'domainspec.preconfirmation-closure.v1',
    scope: sheet.dispatch_type === 'experiment' ? 'experiment' : 'dispatch',
    status: 'block',
    inputs: {
      sheet_ref: exactRef(root, sheetPath),
      material_projection_ref: exactRef(root, projectionPath),
      tension_evidence_ref: null,
      execution_dispatch_ref: contract.execution_dispatch_ref || null,
      execution_briefings_ref: contract.execution_briefings_ref || null,
      criterion_package_refs: contract.criterion_package || {},
      consumer_versions: {},
    },
    form: { status: 'block', schema_version: null, sheet_sha256: null, ledger_read: null, ledger_mutation: null },
    material_strategy: { status: 'block', projection_schema: null, material_sha256: null },
    tension_disposition: { status: 'block', branch: null, expected_handle_class: null, canonical_handles: [] },
    consumer_closure: { status: 'block', consumers: [] },
    experiment_checks: { status: 'block', obligations: [], criterion: null, guide_equivalence: null },
    execution_rehearsal: { status: 'block', spawn_attempt_count: 0, waves: [], blockers: [] },
    blockers: [],
    first_nonzero: 0,
  };

  const registrar = options.registrar
    ? resolveRepoFile(root, options.registrar, 'registrar')
    : defaultTool(root, 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs');
  receipt.inputs.consumer_versions.registrar = exactRef(root, registrar);
  receipt.inputs.consumer_versions.preconfirmation_closure_compiler = exactRef(root, __filename);
  receipt.inputs.consumer_versions.preconfirmation_closure_schema = exactRef(root, resolveRepoFile(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/preconfirmation-closure.schema.json',
    'preconfirmation closure schema',
  ));
  receipt.inputs.consumer_versions.check_tension_evidence_schema = exactRef(root, resolveRepoFile(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/check-tension-evidence.schema.json',
    'check tension evidence schema',
  ));
  receipt.inputs.consumer_versions.material_projection_compiler = exactRef(root, resolveRepoFile(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/material-strategy.cjs',
    'material projection compiler',
  ));
  const profileConsumers = {
    public_ledger_engine: 'arcanum/arcana/subagent-strategy/scripts/ledger-engine.cjs',
    strategy_runtime_engine: 'arcanum/arcana/subagent-strategy/scripts/strategy-runtime.cjs',
    runtime_profile_schema: 'arcanum/arcana/subagent-strategy/profiles/runtime-profile.schema.json',
    private_runtime_profile: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-profile.json',
    registration_envelope_schema: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/registration-envelope.schema.json',
    other_type_owner: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/other/SKILL.md',
  };
  for (const [consumerId, relative] of Object.entries(profileConsumers)) {
    receipt.inputs.consumer_versions[consumerId] = exactRef(
      root,
      resolveRepoFile(root, relative, consumerId),
    );
  }
  const strategyRuntime = resolveRepoFile(root, profileConsumers.strategy_runtime_engine, 'strategy runtime engine');
  const privateProfile = resolveRepoFile(root, profileConsumers.private_runtime_profile, 'private runtime profile');
  const form = run(
    process.execPath,
    [strategyRuntime, 'readiness', sheetPath, '--profile', privateProfile],
    {
      ARCANUM_PROJECT_DIR: root,
      CODEX_PROJECT_DIR: '',
      CLAUDE_PROJECT_DIR: '',
    },
  );
  const formFields = Object.fromEntries(form.stdout.split(/\r?\n/).map((line) => line.split('=', 2)).filter((parts) => parts.length === 2));
  Object.assign(receipt.form, {
    status: form.status === 0 && formFields.SHEET_VALIDATION === 'pass' ? 'pass' : 'block',
    schema_version: formFields.SCHEMA_VERSION || null,
    sheet_sha256: formFields.SHEET_SHA256 || null,
    ledger_read: formFields.LEDGER_READ || null,
    ledger_mutation: formFields.LEDGER_MUTATION || null,
  });
  if (receipt.form.status !== 'pass') {
    addBlocker(receipt, 'form_invalid', 'form', (form.stderr || form.stdout).trim() || 'sheet validation failed', form.status);
  }

  try {
    const liveProjection = project(sheet);
    receipt.material_strategy = {
      status: projection.projection_schema === 'domainspec.material-strategy.v3' &&
        projection.material_sha256 === liveProjection.material_sha256 ? 'pass' : 'block',
      projection_schema: projection.projection_schema || null,
      material_sha256: liveProjection.material_sha256,
    };
    if (receipt.material_strategy.status !== 'pass') {
      addBlocker(receipt, 'material_projection_drift', 'material_strategy', 'material projection does not match current sheet bytes');
    }
  } catch (error) {
    addBlocker(receipt, 'material_projection_invalid', 'material_strategy', error.message);
  }

  const branch = hasSubjectGroup(sheet) ? 'subject' : 'no_subject';
  const sheetDigest = exactRef(root, sheetPath).sha256;
  if (branch === 'subject') {
    if (!options.tensionEvidence) {
      receipt.tension_disposition = {
        status: 'block', branch, expected_handle_class: 'independent_pass_pair', canonical_handles: [],
      };
      addBlocker(receipt, 'subject_tension_evidence_missing', 'tension_disposition', 'subject sheets require exact independently frozen checker and reviewer PASS evidence');
    } else {
      try {
        const tension = subjectTensionEvidence(root, sheetPath, options.tensionEvidence);
        receipt.inputs.tension_evidence_ref = tension.ref;
        receipt.tension_disposition = {
          status: tension.blockers.length === 0 ? 'pass' : 'block',
          branch,
          expected_handle_class: 'independent_pass_pair',
          canonical_handles: tension.handles,
        };
        for (const message of tension.blockers) {
          addBlocker(receipt, 'subject_tension_evidence_invalid', 'tension_disposition', message);
        }
      } catch (error) {
        receipt.tension_disposition = {
          status: 'block', branch, expected_handle_class: 'independent_pass_pair', canonical_handles: [],
        };
        addBlocker(receipt, 'subject_tension_evidence_invalid', 'tension_disposition', error.message);
      }
    }
  } else {
    receipt.tension_disposition = {
      status: options.tensionEvidence ? 'block' : 'pass',
      branch,
      expected_handle_class: 'canonical_no_subject_pair',
      canonical_handles: [
        `check-tension:no-subject:checker:${sheetDigest}`,
        `check-tension:no-subject:reviewer:${sheetDigest}`,
      ],
    };
    if (options.tensionEvidence) {
      addBlocker(receipt, 'unexpected_tension_evidence', 'tension_disposition', 'no-subject sheets derive the canonical disposition and must not bind model evidence');
    }
  }

  const composition = options.compositionCheck
    ? resolveRepoFile(root, options.compositionCheck, 'composition check')
    : defaultTool(root, 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/scripts/sync-strategy-runtimes.cjs');
  receipt.inputs.consumer_versions.runtime_composition = exactRef(root, composition);
  receipt.inputs.consumer_versions.runtime_composition_manifest = exactRef(root, resolveRepoFile(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-composition.json',
    'runtime composition manifest',
  ));
  const compositionResult = run(process.execPath, [composition, '--check', '--target', root, '--runtime', 'all']);
  receipt.consumer_closure.consumers.push({
    consumer_id: 'strategy-runtime-composition',
    status: compositionResult.status === 0 ? 'pass' : 'block',
    detail: (compositionResult.stdout || compositionResult.stderr).trim(),
  });
  receipt.consumer_closure.status = compositionResult.status === 0 ? 'pass' : 'block';
  if (compositionResult.status !== 0) {
    addBlocker(receipt, 'runtime_consumer_drift', 'consumer_closure', (compositionResult.stderr || compositionResult.stdout).trim(), compositionResult.status);
  }

  if (sheet.dispatch_type === 'experiment') {
  let executionDispatch = null;
  let executionDispatchPath = null;
  try {
    const bound = exactRefMatches(root, contract.execution_dispatch_ref, 'experiment_contract.execution_dispatch_ref');
    executionDispatchPath = bound.file;
    executionDispatch = JSON.parse(fs.readFileSync(bound.file, 'utf8'));
  } catch (error) {
    addBlocker(receipt, 'execution_dispatch_drift', 'experiment_checks', error.message);
  }
  try {
    exactRefMatches(root, contract.execution_briefings_ref, 'experiment_contract.execution_briefings_ref');
  } catch (error) {
    addBlocker(receipt, 'execution_briefings_drift', 'experiment_checks', error.message);
  }
  for (const key of [
    'source_ref', 'schema_ref', 'renderer_ref', 'generated_view_ref', 'protocol_ref',
    'guide_manifest_ref', 'criterion_validator_ref', 'guide_equivalence_validator_ref',
  ]) {
    try {
      exactRefMatches(root, (contract.criterion_package || {})[key], `experiment_contract.criterion_package.${key}`);
    } catch (error) {
      addBlocker(receipt, 'criterion_package_drift', 'experiment_checks', error.message);
    }
  }

  const roles = new Map((((executionDispatch || {}).subagent_strategy || {}).roles || [])
    .filter((role) => role && role.role_id)
    .map((role) => [role.role_id, role]));
  const gates = new Map(((executionDispatch || {}).gates || [])
    .filter((gate) => gate && gate.gate_id)
    .map((gate) => [gate.gate_id, gate]));
  const obligations = Array.isArray(contract.pre_freeze_obligations) ? contract.pre_freeze_obligations : [];
  for (const obligation of obligations) {
    const row = { obligation_id: obligation && obligation.obligation_id, status: 'pass', blockers: [] };
    const role = obligation && roles.get(obligation.execution_role_id);
    const gate = obligation && gates.get(obligation.gate_id);
    if (!role) row.blockers.push('execution role is missing');
    if (role && role.agent_count !== 1) row.blockers.push('independent obligation owner must be singleton');
    if (!Array.isArray(obligation.independent_of_role_ids) || obligation.independent_of_role_ids.length === 0) {
      row.blockers.push('independent obligation must name at least one distinct role');
    }
    if (role && (obligation.independent_of_role_ids || []).includes(role.role_id)) row.blockers.push('obligation owner is not independent');
    for (const independentRoleId of obligation.independent_of_role_ids || []) {
      if (!roles.has(independentRoleId)) row.blockers.push(`independent reference role is missing: ${independentRoleId}`);
    }
    if (role && !(role.output_refs || []).includes(obligation.receipt_ref)) row.blockers.push('role does not produce required receipt');
    if (!gate || !(gate.requires_role_receipts || []).includes(obligation.receipt_ref)) row.blockers.push('gate does not require obligation receipt');
    const allowed = new Set((((role || {}).briefing_binding || {}).briefing || {}).read_policy?.allowed_read_scopes || []);
    for (const scope of obligation.required_read_scopes || []) {
      if (!allowed.has(scope)) row.blockers.push(`required read scope is absent: ${scope}`);
    }
    row.status = row.blockers.length === 0 ? 'pass' : 'block';
    receipt.experiment_checks.obligations.push(row);
    for (const message of row.blockers) addBlocker(receipt, 'obligation_owner_gap', 'experiment_checks', `${row.obligation_id || '<unknown>'}: ${message}`);
  }
  if (obligations.length === 0) addBlocker(receipt, 'missing_pre_freeze_obligations', 'experiment_checks', 'no pre-freeze obligations were declared');

  for (const [field, outputKey] of [
    ['criterion_validator_ref', 'criterion'],
    ['guide_equivalence_validator_ref', 'guide_equivalence'],
  ]) {
    try {
      const validator = exactRefMatches(root, (contract.criterion_package || {})[field], field).file;
      const result = run('python3', [validator, '--root', path.dirname(resolveRepoFile(root, contract.criterion_output_path.startsWith('/')
        ? contract.criterion_output_path
        : path.posix.join(sheet.working_folder || '', contract.criterion_output_path), 'criterion output')), '--json']);
      const parsed = parseJsonOutput(result, field);
      receipt.experiment_checks[outputKey] = parsed;
      if (result.status !== 0 || parsed.status !== 'pass') {
        addBlocker(receipt, `${outputKey}_invalid`, 'experiment_checks', JSON.stringify(parsed.blockers || parsed), result.status);
      }
    } catch (error) {
      addBlocker(receipt, `${outputKey}_invalid`, 'experiment_checks', error.message);
    }
  }
  receipt.experiment_checks.status = receipt.blockers.some((item) => item.check === 'experiment_checks') ? 'block' : 'pass';

  if (executionDispatchPath) {
    const coordinator = options.orchestrateCoordinator
      ? resolveRepoFile(root, options.orchestrateCoordinator, 'orchestrate coordinator')
      : defaultTool(root, 'arcanum/runtime/orchestrate/scripts/native_dispatch_coordinator.py');
    receipt.inputs.consumer_versions.orchestrate_coordinator = exactRef(root, coordinator);
    receipt.inputs.consumer_versions.dispatch_spec_validator = exactRef(root, resolveRepoFile(
      root,
      'arcanum/formulae/dispatch-spec/scripts/validate-dispatch.py',
      'Dispatch Spec validator',
    ));
    for (const [consumerId, relative] of Object.entries({
      dispatch_spec_schema: 'arcanum/formulae/dispatch-spec/dispatch.schema.json',
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
    })) {
      receipt.inputs.consumer_versions[consumerId] = exactRef(root, resolveRepoFile(root, relative, consumerId));
    }
    const rehearsal = run('python3', [coordinator, 'rehearse', executionDispatchPath, '--run-id', 'preconfirmation-closure']);
    try {
      const parsed = parseJsonOutput(rehearsal, 'orchestrate rehearsal');
      receipt.execution_rehearsal = {
        status: rehearsal.status === 0 && parsed.status === 'pass' ? 'pass' : 'block',
        spawn_attempt_count: parsed.spawn_attempt_count,
        waves: parsed.waves || [],
        blockers: parsed.blockers || [],
      };
      if (receipt.execution_rehearsal.status !== 'pass' || parsed.spawn_attempt_count !== 0) {
        addBlocker(receipt, 'execution_rehearsal_blocked', 'execution_rehearsal', JSON.stringify(parsed.blockers || parsed), rehearsal.status);
      }
    } catch (error) {
      addBlocker(receipt, 'execution_rehearsal_blocked', 'execution_rehearsal', error.message, rehearsal.status);
    }
  } else {
    addBlocker(receipt, 'execution_rehearsal_blocked', 'execution_rehearsal', 'execution dispatch could not be admitted');
  }
  } else {
    receipt.experiment_checks = {
      status: 'pass',
      obligations: [],
      criterion: { status: 'not_applicable' },
      guide_equivalence: { status: 'not_applicable' },
    };
    receipt.execution_rehearsal = {
      status: 'pass',
      spawn_attempt_count: 0,
      waves: [],
      blockers: [],
    };
  }

  receipt.status = receipt.blockers.length === 0 ? 'pass' : 'block';
  receipt.first_nonzero = receipt.status === 'pass' ? 0 : (receipt.first_nonzero || 1);
  if (options.verifyOnly !== undefined) {
    if (options.verifyOnly !== 'true') throw new Error('--verify-only must be exactly true');
    const expected = JSON.parse(fs.readFileSync(receiptPath, 'utf8').replace(/^\uFEFF/, ''));
    if (JSON.stringify(canonical(expected)) !== JSON.stringify(canonical(receipt))) {
      process.stdout.write(`${JSON.stringify({
        status: 'block',
        verification: 'mismatch',
        receipt: path.relative(root, receiptPath).split(path.sep).join('/'),
        spawn_attempt_count: receipt.execution_rehearsal.spawn_attempt_count,
      }, null, 2)}\n`);
      return 2;
    }
    process.stdout.write(`${JSON.stringify({
      status: receipt.status,
      verification: 'exact_recompute',
      receipt: path.relative(root, receiptPath).split(path.sep).join('/'),
      spawn_attempt_count: receipt.execution_rehearsal.spawn_attempt_count,
    }, null, 2)}\n`);
    return receipt.first_nonzero;
  }
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  fs.writeFileSync(receiptPath, `${JSON.stringify(canonical(receipt), null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    status: receipt.status,
    receipt: path.relative(root, receiptPath).split(path.sep).join('/'),
    blocker_count: receipt.blockers.length,
    first_nonzero: receipt.first_nonzero,
    spawn_attempt_count: receipt.execution_rehearsal.spawn_attempt_count,
  }, null, 2)}\n`);
  return receipt.first_nonzero;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`PRECONFIRMATION_CLOSURE=block\n${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = { canonical, exactRef, hasSubjectGroup, main };
