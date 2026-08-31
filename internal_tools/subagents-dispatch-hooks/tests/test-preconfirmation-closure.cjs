#!/usr/bin/env node
'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = path.resolve(__dirname, '../../../../..');
const compiler = path.join(__dirname, '../skills/domainspec-subagents-strategy/preconfirmation-closure.cjs');
const appender = path.join(__dirname, '../skills/register-dispatch/append-dispatch.cjs');
const closureSchema = path.join(__dirname, '../skills/domainspec-subagents-strategy/preconfirmation-closure.schema.json');
const { project } = require('../skills/domainspec-subagents-strategy/material-strategy.cjs');
const ops = path.join(repo, 'ops/development/2026-08-27-invoke-define-v2-documentation-tournament');
const baseSheetPath = path.join(ops, 'criterion-successor-propose.dispatch-sheet.json');
const canonicalConsumers = {
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
};

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function exactRef(file) {
  const bytes = fs.readFileSync(file);
  return {
    path: path.relative(repo, file).split(path.sep).join('/'),
    sha256: sha256(bytes),
    size: bytes.length,
  };
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function hasSubjectGroup(sheet) {
  const roles = new Set(['explorer', 'skeptic', 'auditor']);
  return Array.isArray(sheet.groups) && sheet.groups.some((group) =>
    group && Array.isArray(group.agents) && group.agents.length >= 2 &&
    group.agents.some((agent) => agent && roles.has(agent.role)));
}

function validatesClosureSchema(receipt) {
  const validator = [
    'import json, sys',
    'from jsonschema import Draft202012Validator',
    'with open(sys.argv[1], encoding="utf-8") as stream: schema = json.load(stream)',
    'instance = json.load(sys.stdin)',
    'errors = sorted(Draft202012Validator(schema).iter_errors(instance), key=lambda item: list(item.path))',
    'print(json.dumps([item.message for item in errors]))',
    'raise SystemExit(0 if not errors else 1)',
  ].join('\n');
  return spawnSync('python3', ['-c', validator, closureSchema], {
    encoding: 'utf8',
    input: JSON.stringify(receipt),
  });
}

function runClosure(sheet, mutateFiles, options = {}) {
  const temp = fs.mkdtempSync(path.join(ops, '.closure-fixture-'));
  try {
    const sheetPath = path.join(temp, 'sheet.json');
    const projectionPath = path.join(temp, 'material.json');
    const receiptPath = path.join(temp, 'receipt.json');
    const working = JSON.parse(JSON.stringify(sheet));
    if (mutateFiles) mutateFiles({ temp, sheet: working });
    writeJson(sheetPath, working);
    writeJson(projectionPath, project(working));
    const args = [
      compiler,
      '--sheet', sheetPath,
      '--material-projection', projectionPath,
      '--receipt', receiptPath,
      '--repo-root', repo,
    ];
    if (hasSubjectGroup(working) && !options.omitTension) {
      const sheetRef = exactRef(sheetPath);
      const tensionPath = path.join(temp, 'tension.json');
      const tension = {
        schema_version: 'domainspec.check-tension-evidence.v1',
        sheet_ref: sheetRef,
        independently_frozen: true,
        verdicts: [
          { slot: 'checker', handle: `fixture:checker:${sheetRef.sha256}`, verdict: 'pass', sheet_sha256: sheetRef.sha256 },
          { slot: 'reviewer', handle: `fixture:reviewer:${sheetRef.sha256}`, verdict: 'pass', sheet_sha256: sheetRef.sha256 },
        ],
      };
      if (options.mutateTension) options.mutateTension(tension);
      writeJson(tensionPath, tension);
      args.push('--tension-evidence', tensionPath);
    }
    const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    return { result, receipt };
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const base = JSON.parse(fs.readFileSync(baseSheetPath, 'utf8'));
let assertions = 0;
function check(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

{
  const { result, receipt } = runClosure(base, null, { omitTension: true });
  check(result.status !== 0, 'subject closure refuses missing independent tension evidence');
  check(receipt.tension_disposition.status === 'block', 'missing subject tension evidence is a closure blocker');
}

{
  const { result, receipt } = runClosure(base, null, {
    mutateTension: (evidence) => { evidence.verdicts[1].verdict = 'reprove'; },
  });
  check(result.status !== 0, 'subject closure refuses a non-pass verdict');
  check(receipt.blockers.some((item) => item.code === 'subject_tension_evidence_invalid'), 'non-pass tension verdict is reported');
  check(receipt.inputs.tension_evidence_ref !== null, 'invalid present subject evidence remains exact-bound');
  const schemaResult = validatesClosureSchema(receipt);
  check(schemaResult.status === 0, `invalid present subject evidence emits a schema-valid collect-all BLOCK receipt: ${schemaResult.stdout}`);
}

{
  const { result, receipt } = runClosure(base, null, {
    mutateTension: (evidence) => { evidence.verdicts[0].unexpected = 'must-block'; },
  });
  check(result.status !== 0, 'subject closure runs the canonical tension evidence schema before confirmation');
  check(
    receipt.blockers.some((item) => item.code === 'subject_tension_evidence_invalid' && item.message.includes('Additional properties')),
    'subject closure reports schema-forbidden tension evidence fields',
  );
  const schemaResult = validatesClosureSchema(receipt);
  check(schemaResult.status === 0, `schema-invalid subject evidence still emits a schema-valid collect-all BLOCK receipt: ${schemaResult.stdout}`);
}

{
  const { result, receipt } = runClosure(base);
  check(result.status === 0, `passing closure exit: ${result.stderr}`);
  check(receipt.status === 'pass' && receipt.blockers.length === 0, 'passing closure has no blockers');
  check(receipt.execution_rehearsal.spawn_attempt_count === 0, 'passing closure has zero spawn attempts');
  check(Object.keys(receipt.inputs.consumer_versions).length >= 5, 'consumer versions are exact-bound');
}

{
  const noSubject = JSON.parse(JSON.stringify(base));
  const first = noSubject.groups[0];
  const [designer, auditor] = first.agents;
  noSubject.groups = [
    { group_id: 'criterion-designer', agents: [designer] },
    { group_id: 'guide-equivalence-auditor', agents: [auditor] },
    noSubject.groups[1],
  ];
  noSubject.connections = [
    { from: 'criterion-designer', to: 'validity-skeptic', type: 'sequential' },
    { from: 'guide-equivalence-auditor', to: 'validity-skeptic', type: 'sequential' },
  ];
  delete noSubject.anti_bias_global;
  const { result, receipt } = runClosure(noSubject);
  check(result.status === 0, `no-subject closure exit: ${result.stderr}`);
  check(receipt.tension_disposition.branch === 'no_subject', 'no-subject branch is derived');
  check(receipt.tension_disposition.canonical_handles.length === 2, 'no-subject branch binds two canonical handles');
}

{
  const broken = JSON.parse(JSON.stringify(base));
  broken.experiment_contract.criterion_package.source_ref.sha256 = '0'.repeat(64);
  broken.experiment_contract.execution_briefings_ref.sha256 = '1'.repeat(64);
  broken.experiment_contract.pre_freeze_obligations[0].independent_of_role_ids = ['guide-equivalence-auditor'];
  broken.experiment_contract.pre_freeze_obligations[1].execution_role_id = 'missing-role';
  const { result, receipt } = runClosure(broken);
  const codes = new Set(receipt.blockers.map((item) => item.code));
  check(result.status !== 0 && receipt.status === 'block', 'multi-defect closure blocks');
  check(codes.has('criterion_package_drift'), 'multi-defect closure reports criterion digest drift');
  check(codes.has('execution_briefings_drift'), 'multi-defect closure reports briefing digest drift');
  check(codes.has('obligation_owner_gap'), 'multi-defect closure reports independent-owner defects');
  check(receipt.blockers.length >= 4, 'multi-defect closure preserves the complete reachable blocker set');
  check(receipt.execution_rehearsal.spawn_attempt_count === 0, 'blocked closure still has zero spawn attempts');
}

{
  const sheetBytes = fs.readFileSync(baseSheetPath);
  const sheetDigest = sha256(sheetBytes);
  const material = project(base);
  const record = JSON.parse(JSON.stringify(base));
  record.evidence_binding = {
    sheet_path: path.relative(repo, baseSheetPath).split(path.sep).join('/'),
    sheet_sha256: sheetDigest,
    tension_verdicts: [
      { handle: 'fixture:tension:checker', verdict: 'pass', sheet_sha256: sheetDigest },
      { handle: 'fixture:tension:reviewer', verdict: 'pass', sheet_sha256: sheetDigest },
    ],
    confirmation: {
      handle: 'fixture:confirmation', confirmed: true, sheet_sha256: sheetDigest,
      material_sha256: material.material_sha256,
    },
  };
  const tempRecord = path.join(ops, '.closure-registration-refusal.json');
  const ledger = path.join(repo, 'telemetry/agents/subagents-dispatch.yaml');
  const before = fs.existsSync(ledger) ? fs.readFileSync(ledger) : Buffer.alloc(0);
  try {
    writeJson(tempRecord, record);
    const result = spawnSync(process.execPath, [appender, tempRecord], {
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: repo },
    });
    const after = fs.existsSync(ledger) ? fs.readFileSync(ledger) : Buffer.alloc(0);
    check(result.status === 2 && /preconfirmation_closure is required/.test(result.stderr), 'registration refuses missing closure');
    check(before.equals(after), 'registration refusal leaves the real ledger byte-for-byte unchanged');
  } finally {
    fs.rmSync(tempRecord, { force: true });
  }
}

{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'v010-registration-'));
  try {
    const compositionSurface = [
      'arcanum/arcana/subagent-strategy/SKILL.md',
      '.agents/skills/subagent-strategy/SKILL.md',
      '.claude/skills/subagent-strategy/SKILL.md',
      'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md',
      '.agents/skills/domainspec-subagents-strategy/SKILL.md',
      '.claude/skills/domainspec-subagents-strategy/SKILL.md',
    ];
    for (const relative of [...Object.values(canonicalConsumers), ...compositionSurface]) {
      const source = path.join(repo, relative);
      const target = path.join(root, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
    const pool = path.join(root, 'telemetry/agents/agent-pool.yaml');
    fs.mkdirSync(path.dirname(pool), { recursive: true });
    fs.writeFileSync(pool, 'scientists:\n  - name: "Popper, Karl"\n');
    const artifactDir = path.join(root, 'research');
    fs.mkdirSync(artifactDir, { recursive: true });
    const refInRoot = (file) => {
      const bytes = fs.readFileSync(file);
      return { path: path.relative(root, file).split(path.sep).join('/'), sha256: sha256(bytes), size: bytes.length };
    };
    const sheet = {
      dispatch_id: '2026-08-27-v010-registration-fixture',
      schema_version: '0.10.0',
      dispatch_type: 'research',
      goal: 'Prove exact preconfirmation closure admission.',
      context: 'Synthetic no-effect fixture in a temporary repository.',
      max_loops: 1,
      final_approver: 'parent',
      working_folder: 'research/',
      groups: [{
        group_id: 'writer', agents: [{
          agent_name: 'Popper, Karl', role: 'writer', model: 'm', token_budget: 100,
          initial_prompt: 'Write only the bounded research artifact.',
        }],
      }],
      connections: [],
    };
    const sheetPath = path.join(artifactDir, 'sheet.json');
    writeJson(sheetPath, sheet);
    const material = project(sheet);
    const materialPath = path.join(artifactDir, 'material.json');
    writeJson(materialPath, material);
    const sheetRef = refInRoot(sheetPath);
    const closurePath = path.join(artifactDir, 'closure.json');
    const compileResult = spawnSync(process.execPath, [
      path.join(root, canonicalConsumers.preconfirmation_closure_compiler),
      '--sheet', sheetPath,
      '--material-projection', materialPath,
      '--receipt', closurePath,
      '--repo-root', root,
    ], { encoding: 'utf8' });
    check(compileResult.status === 0, `temporary canonical compiler produces the passing closure: ${compileResult.stderr}`);
    const closure = JSON.parse(fs.readFileSync(closurePath, 'utf8'));
    const record = JSON.parse(JSON.stringify(sheet));
    record.evidence_binding = {
      sheet_path: sheetRef.path, sheet_sha256: sheetRef.sha256,
      tension_verdicts: [
        { handle: `check-tension:no-subject:checker:${sheetRef.sha256}`, verdict: 'pass', sheet_sha256: sheetRef.sha256 },
        { handle: `check-tension:no-subject:reviewer:${sheetRef.sha256}`, verdict: 'pass', sheet_sha256: sheetRef.sha256 },
      ],
      confirmation: { handle: 'fixture-confirmation', confirmed: true, sheet_sha256: sheetRef.sha256, material_sha256: material.material_sha256 },
      preconfirmation_closure: refInRoot(closurePath),
    };
    const recordPath = path.join(artifactDir, 'record.json');
    writeJson(recordPath, record);
    const substituted = JSON.parse(JSON.stringify(record));
    substituted.evidence_binding.preconfirmation_closure.sha256 = 'f'.repeat(64);
    const substitutedPath = path.join(artifactDir, 'substituted.json');
    writeJson(substitutedPath, substituted);
    const rejected = spawnSync(process.execPath, [appender, substitutedPath], {
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
    check(rejected.status === 2 && /sha256 does not match current (?:file )?bytes/.test(rejected.stderr), `substituted closure digest is refused: ${rejected.stderr}`);

    const consumerPath = path.join(root, canonicalConsumers.runtime_composition_manifest);
    const consumerBefore = fs.readFileSync(consumerPath);
    fs.appendFileSync(consumerPath, 'drift\n');
    const staleConsumer = spawnSync(process.execPath, [appender, recordPath], {
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
    check(
      staleConsumer.status === 2 && /runtime_composition_manifest.*sha256 does not match/.test(staleConsumer.stderr),
      `consumer-version drift invalidates closure: ${staleConsumer.stderr}`,
    );
    fs.writeFileSync(consumerPath, consumerBefore);

    const incompleteClosure = JSON.parse(JSON.stringify(closure));
    delete incompleteClosure.inputs.consumer_versions.runtime_composition;
    const incompleteClosurePath = path.join(artifactDir, 'closure-incomplete-consumers.json');
    writeJson(incompleteClosurePath, incompleteClosure);
    const incompleteRecord = JSON.parse(JSON.stringify(record));
    incompleteRecord.evidence_binding.preconfirmation_closure = refInRoot(incompleteClosurePath);
    const incompleteRecordPath = path.join(artifactDir, 'record-incomplete-consumers.json');
    writeJson(incompleteRecordPath, incompleteRecord);
    const incompleteResult = spawnSync(process.execPath, [appender, incompleteRecordPath], {
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
    check(
      incompleteResult.status === 2 && /complete current canonical consumer set/.test(incompleteResult.stderr),
      `hand-authored incomplete consumer provenance is refused: ${incompleteResult.stderr}`,
    );

    const forgedClosure = JSON.parse(JSON.stringify(closure));
    forgedClosure.consumer_closure = { status: 'pass', consumers: [{ consumer_id: 'forged', status: 'pass' }] };
    const forgedClosurePath = path.join(artifactDir, 'closure-forged-status.json');
    writeJson(forgedClosurePath, forgedClosure);
    const forgedRecord = JSON.parse(JSON.stringify(record));
    forgedRecord.evidence_binding.preconfirmation_closure = refInRoot(forgedClosurePath);
    const forgedRecordPath = path.join(artifactDir, 'record-forged-status.json');
    writeJson(forgedRecordPath, forgedRecord);
    const forgedResult = spawnSync(process.execPath, [appender, forgedRecordPath], {
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
    check(
      forgedResult.status === 2 && /fresh no-effect compiler recomputation/.test(forgedResult.stderr),
      `hand-authored PASS status is refused by exact recomputation: ${forgedResult.stderr}`,
    );

    const envelopeRoot = path.join(root, 'telemetry/agents/runtime/subagents-strategy');
    fs.mkdirSync(envelopeRoot, { recursive: true });
    const envelopePath = path.join(envelopeRoot, `${record.dispatch_id}.tmp.json`);
    writeJson(envelopePath, {
      schema_version: 'domainspec.subagent-strategy-registration-envelope.v1',
      profile_id: 'domainspec.subagent-strategy.private.v1',
      profile_ref: refInRoot(path.join(root, canonicalConsumers.private_runtime_profile)),
      ledger: 'telemetry/agents/subagents-dispatch.yaml',
      source_sheet_ref: sheetRef,
      source_lifecycle: 'durable',
      confirmation: {
        mode: 'material_projection',
        handle: record.evidence_binding.confirmation.handle,
        binding_sha256: record.evidence_binding.confirmation.material_sha256,
        material_equivalence_ref: null,
      },
      admission_receipt_ref: record.evidence_binding.preconfirmation_closure,
      execution_projection_sha256: 'a'.repeat(64),
      temporary_close: `telemetry/agents/runtime/subagents-strategy/${record.dispatch_id}.close.tmp.json`,
      registration_record: record,
    });
    const result = spawnSync(process.execPath, [appender, '--consume', envelopePath], {
      encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
    check(
      result.status === 0 && !fs.existsSync(envelopePath),
      `v0.10 registration admits and consumes an exact envelope with a passing closure: ${result.stderr}`,
    );
    check(fs.readFileSync(path.join(root, 'telemetry/agents/subagents-dispatch.yaml'), 'utf8').includes('schema_version: "0.10.0"'), 'v0.10 row is appended only in the temp ledger');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

console.log(`PASS preconfirmation closure fixtures (${assertions}/${assertions})`);
