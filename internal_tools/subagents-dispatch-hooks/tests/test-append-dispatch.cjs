#!/usr/bin/env node
'use strict';
/*
 * Test battery for append-dispatch.cjs (wire schema v0.9.0; v0.9.1
 * no-subject tension-evidence repair).
 *
 *   node internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs
 *
 * Zero-dependency, self-contained. Every case runs the appender as a child
 * process against a FRESH TEMP DIRECTORY used as the project root (via the
 * CLAUDE_PROJECT_DIR env var, overriding any value inherited from the
 * session) — the real repo ledger is NEVER touched.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const APPENDER = path.join(__dirname, '..', 'skills', 'register-dispatch', 'append-dispatch.cjs');
if (!fs.existsSync(APPENDER)) { console.error('appender not found:', APPENDER); process.exit(1); }
const REPO = path.resolve(__dirname, '../../../../..');
const { project: projectMaterialStrategy } = require('../skills/domainspec-subagents-strategy/material-strategy.cjs');
const BASE_CONSUMERS = {
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
};
const COMPOSITION_SURFACE = [
  'arcanum/arcana/subagent-strategy/SKILL.md',
  '.agents/skills/subagent-strategy/SKILL.md',
  '.claude/skills/subagent-strategy/SKILL.md',
  'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md',
  '.agents/skills/domainspec-subagents-strategy/SKILL.md',
  '.claude/skills/domainspec-subagents-strategy/SKILL.md',
];

const roots = [];
function freshRoot() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'append-dispatch-test-'));
  const pool = path.join(d, 'telemetry', 'agents', 'agent-pool.yaml');
  fs.mkdirSync(path.dirname(pool), { recursive: true });
  fs.writeFileSync(pool, [
    'scientists:',
    '  - name: "Abramsky, Samson"',
    '  - name: "Brandenburg, Martin"',
    '  - name: "Bourbaki, Nicolas"',
    '',
  ].join('\n'));
  for (const relative of [...Object.values(BASE_CONSUMERS), ...COMPOSITION_SURFACE]) {
    const source = path.join(REPO, relative);
    const target = path.join(d, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
  roots.push(d);
  return d;
}
function ledgerPath(root) { return path.join(root, 'telemetry', 'agents', 'subagents-dispatch.yaml'); }
function readLedger(root) {
  const p = ledgerPath(root);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}
function seedHistoricalDispatch(root, record) {
  const file = ledgerPath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const lines = fs.existsSync(file) ? [] : ['dispatches:'];
  lines.push(`  - dispatch_id: ${JSON.stringify(record.dispatch_id)}`);
  lines.push(`    schema_version: ${JSON.stringify(record.schema_version)}`);
  lines.push(`    dispatch_type: ${JSON.stringify(record.dispatch_type)}`);
  if (record.working_folder !== undefined) lines.push(`    working_folder: ${JSON.stringify(record.working_folder)}`);
  if (record.experiment_contract !== undefined) lines.push(`    experiment_contract: ${JSON.stringify(record.experiment_contract)}`);
  lines.push(`    created: "2026-08-27T00:00:00.000Z"`);
  fs.appendFileSync(file, `${lines.join('\n')}\n`);
}

let seq = 0;
const SUBJECT_AGENT_ROLES = new Set(['explorer', 'skeptic', 'auditor']);
const NO_SUBJECT_TENSION_HANDLE_PREFIX = 'check-tension:no-subject:';
function hasSubjectGroup(record) {
  return record && Array.isArray(record.groups) && record.groups.some((group) =>
    group && Array.isArray(group.agents) && group.agents.length >= 2 &&
    group.agents.some((agent) => agent && SUBJECT_AGENT_ROLES.has(agent.role)));
}
function noSubjectTensionVerdicts(sheetSha256) {
  return [
    { handle: `${NO_SUBJECT_TENSION_HANDLE_PREFIX}checker:${sheetSha256}`, verdict: 'pass', sheet_sha256: sheetSha256 },
    { handle: `${NO_SUBJECT_TENSION_HANDLE_PREFIX}reviewer:${sheetSha256}`, verdict: 'pass', sheet_sha256: sheetSha256 },
  ];
}
function exactRef(root, file) {
  const bytes = fs.readFileSync(file);
  return {
    path: path.relative(root, file).split(path.sep).join('/'),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    size: bytes.length,
  };
}
function bindEvidence(root, record) {
  const relative = path.join('dispatch-sheets', `${record.dispatch_id}.json`).replace(/\\/g, '/');
  const sheet = path.join(root, relative);
  fs.mkdirSync(path.dirname(sheet), { recursive: true });
  const sheetRecord = JSON.parse(JSON.stringify(record));
  delete sheetRecord.evidence_binding;
  delete sheetRecord.project_dir;
  const content = JSON.stringify(sheetRecord, null, 2) + '\n';
  fs.writeFileSync(sheet, content);
  const sheetSha256 = crypto.createHash('sha256').update(Buffer.from(content)).digest('hex');
  const sheetRef = exactRef(root, sheet);
  const material = projectMaterialStrategy(sheetRecord);
  const materialPath = path.join(root, 'material-projections', `${record.dispatch_id}.json`);
  fs.mkdirSync(path.dirname(materialPath), { recursive: true });
  fs.writeFileSync(materialPath, `${JSON.stringify(material, null, 2)}\n`);
  const subject = hasSubjectGroup(sheetRecord);
  const tensionVerdicts = subject
    ? [
      { handle: `${record.dispatch_id}:tension:1`, verdict: 'pass', sheet_sha256: sheetSha256 },
      { handle: `${record.dispatch_id}:tension:2`, verdict: 'pass', sheet_sha256: sheetSha256 },
    ]
    : noSubjectTensionVerdicts(sheetSha256);
  if (sheetRecord.schema_version === '0.9.0') {
    record.evidence_binding = {
      sheet_path: relative,
      sheet_sha256: sheetSha256,
      tension_verdicts: tensionVerdicts,
      confirmation: {
        handle: `${record.dispatch_id}:confirmation`,
        confirmed: true,
        sheet_sha256: sheetSha256,
      },
    };
    return { record, sheet };
  }
  let tensionEvidenceRef = null;
  if (subject) {
    const tensionPath = path.join(root, 'tension-evidence', `${record.dispatch_id}.json`);
    fs.mkdirSync(path.dirname(tensionPath), { recursive: true });
    fs.writeFileSync(tensionPath, `${JSON.stringify({
      schema_version: 'domainspec.check-tension-evidence.v1',
      sheet_ref: sheetRef,
      independently_frozen: true,
      verdicts: [
        { slot: 'checker', ...tensionVerdicts[0] },
        { slot: 'reviewer', ...tensionVerdicts[1] },
      ],
    }, null, 2)}\n`);
    tensionEvidenceRef = exactRef(root, tensionPath);
  }
  const closurePath = path.join(root, 'preconfirmation-closure', `${record.dispatch_id}.json`);
  fs.mkdirSync(path.dirname(closurePath), { recursive: true });
  const compilerArgs = [
    path.join(root, BASE_CONSUMERS.preconfirmation_closure_compiler),
    '--sheet', sheet,
    '--material-projection', materialPath,
    '--receipt', closurePath,
    '--repo-root', root,
  ];
  if (tensionEvidenceRef) {
    compilerArgs.push('--tension-evidence', path.join(root, ...tensionEvidenceRef.path.split('/')));
  }
  spawnSync(process.execPath, compilerArgs, { encoding: 'utf8' });
  record.evidence_binding = {
    sheet_path: relative,
    sheet_sha256: sheetSha256,
    tension_verdicts: tensionVerdicts,
    confirmation: {
      handle: `${record.dispatch_id}:confirmation`,
      confirmed: true,
      sheet_sha256: sheetSha256,
      material_sha256: material.material_sha256,
    },
    preconfirmation_closure: exactRef(root, closurePath),
  };
  return { record, sheet };
}
// Run the appender against `root` with `record`, with optional extra env.
function run(root, record, extraEnv) {
  if (record && record.close_of) return runProfileClose(root, record);
  if (record && record.dispatch_id && !Object.prototype.hasOwnProperty.call(record, 'evidence_binding')) {
    try {
      bindEvidence(root, record);
    } catch (_) {
      record.evidence_binding = null;
    }
  }
  if (
    record && record.dispatch_id && record.schema_version === '0.10.0' &&
    record.evidence_binding && typeof record.evidence_binding === 'object' &&
    record.evidence_binding.confirmation &&
    typeof record.evidence_binding.confirmation.handle === 'string' &&
    typeof record.evidence_binding.confirmation.material_sha256 === 'string' &&
    record.evidence_binding.preconfirmation_closure &&
    typeof record.evidence_binding.preconfirmation_closure.path === 'string'
  ) {
    return runRegistrationEnvelope(root, record, null, extraEnv);
  }
  const tmp = path.join(root, `rec-${++seq}.json`);
  fs.writeFileSync(tmp, JSON.stringify(record));
  const env = Object.assign({}, process.env, { CLAUDE_PROJECT_DIR: root }, extraEnv || {});
  const r = spawnSync(process.execPath, [APPENDER, tmp], { env, encoding: 'utf8' });
  fs.unlinkSync(tmp);
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

function runRegistrationEnvelope(root, record, mutateEnvelope, extraEnv) {
  const existingSheet = record && record.evidence_binding && record.evidence_binding.sheet_path
    ? path.join(root, ...record.evidence_binding.sheet_path.split('/'))
    : null;
  const bound = existingSheet && fs.existsSync(existingSheet)
    ? { record, sheet: existingSheet }
    : bindEvidence(root, record);
  const profilePath = path.join(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-profile.json',
  );
  const runtimeRoot = path.join(root, 'telemetry', 'agents', 'runtime', 'subagents-strategy');
  fs.mkdirSync(runtimeRoot, { recursive: true });
  const envelopePath = path.join(runtimeRoot, `${record.dispatch_id}.tmp.json`);
  const envelope = {
    schema_version: 'domainspec.subagent-strategy-registration-envelope.v1',
    profile_id: 'domainspec.subagent-strategy.private.v1',
    profile_ref: exactRef(root, profilePath),
    ledger: 'telemetry/agents/subagents-dispatch.yaml',
    source_sheet_ref: exactRef(root, bound.sheet),
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
  };
  if (mutateEnvelope) mutateEnvelope(envelope);
  fs.writeFileSync(envelopePath, `${JSON.stringify(envelope, null, 2)}\n`);
  const env = Object.assign({}, process.env, { CLAUDE_PROJECT_DIR: root }, extraEnv || {});
  const result = spawnSync(process.execPath, [APPENDER, '--consume', envelopePath], {
    env,
    encoding: 'utf8',
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    envelopeExists: fs.existsSync(envelopePath),
    sourceExists: fs.existsSync(bound.sheet),
  };
}
function runDirectCurrent(root, record) {
  if (!record.evidence_binding) bindEvidence(root, record);
  const tmp = path.join(root, `direct-${++seq}.json`);
  fs.writeFileSync(tmp, `${JSON.stringify(record, null, 2)}\n`);
  const result = spawnSync(process.execPath, [APPENDER, tmp], {
    env: Object.assign({}, process.env, { CLAUDE_PROJECT_DIR: root }),
    encoding: 'utf8',
  });
  fs.unlinkSync(tmp);
  return { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}
function runProfileClose(root, closeRecord) {
  const profilePath = path.join(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-profile.json',
  );
  const runtimePath = path.join(root, BASE_CONSUMERS.strategy_runtime_engine);
  const runtimeRoot = path.join(root, 'telemetry', 'agents', 'runtime', 'subagents-strategy');
  fs.mkdirSync(runtimeRoot, { recursive: true });
  const closePath = path.join(runtimeRoot, `${closeRecord.close_of}.close.tmp.json`);
  fs.writeFileSync(closePath, `${JSON.stringify(closeRecord, null, 2)}\n`);
  const result = spawnSync(
    process.execPath,
    [runtimePath, 'close', closePath, '--profile', profilePath],
    {
      cwd: root,
      env: Object.assign({}, process.env, {
        ARCANUM_PROJECT_DIR: root,
        CODEX_PROJECT_DIR: '',
        CLAUDE_PROJECT_DIR: '',
      }),
      encoding: 'utf8',
    },
  );
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    closeExists: fs.existsSync(closePath),
  };
}
// Run only the non-mutating confirmation-readiness validator. The candidate
// sheet intentionally has no evidence_binding because tension and confirmation
// occur after this gate.
function validateSheet(root, record, options = {}) {
  const candidate = JSON.parse(JSON.stringify(record));
  if (!options.preserveEvidenceBinding) delete candidate.evidence_binding;
  const tmp = path.join(root, `sheet-${++seq}.json`);
  const content = JSON.stringify(candidate, null, 2) + '\n';
  fs.writeFileSync(tmp, content);
  const env = Object.assign({}, process.env, { CLAUDE_PROJECT_DIR: root });
  const r = spawnSync(process.execPath, [APPENDER, '--validate-sheet', tmp], {
    env,
    encoding: 'utf8',
  });
  fs.unlinkSync(tmp);
  return {
    status: r.status,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    content,
  };
}

let pass = 0, fail = 0, skip = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else {
    fail++; failures.push(name);
    console.log('  FAIL  ' + name + (detail ? '\n        ' + String(detail).split('\n').join('\n        ') : ''));
  }
}
function note(name, why) { skip++; console.log('  SKIP  ' + name + ' — ' + why); }

// expects exit 2 and (optionally) a stderr pattern
function expectReject(name, root, record, pattern) {
  const before = readLedger(root);
  const r = run(root, record);
  const after = readLedger(root);
  const ok = r.status === 2 && (!pattern || pattern.test(r.stderr)) && after === before;
  check(name, ok, `exit=${r.status}\nstderr=${r.stderr.trim()}\nledger_changed=${after !== before}`);
}

// ---------------------------------------------------------------- fixtures
function validDispatch(over) {
  return Object.assign({
    dispatch_id: '2026-06-12-battery-main',
    schema_version: '0.10.0',
    dispatch_type: 'research',
    goal: 'Prove the v0.9.0 appender end to end.',
    context: 'Synthetic record produced by the test battery. Runs against a temp ledger, never the real one.',
    max_loops: 2,
    final_approver: 'parent',
    anti_bias_global: 'optimism vs skepticism',
    working_folder: 'research/battery-topic/',
    invoked_by: 'tester@example.com',
    groups: [
      {
        group_id: 'explorers', n: 2,
        anti_bias: 'methodology (static reading vs dynamic probing)',
        predicted_disagreements: [
          {
            pair: [0, 1],
            statement: 'Agent 0 reads the static form while agent 1 probes runtime behavior on the methodology axis; each exposes the other approach’s blind spot.',
          },
        ],
        agents: [
          { agent_name: 'Abramsky, Samson', role: 'explorer', model: 'claude-sonnet-4-6', token_budget: 800,
            angle: 'static-reading side', initial_prompt: 'Explore statically.\nSecond line proves stringify newline escaping.' },
          { agent_name: null, role: 'explorer', model: 'claude-opus-4-8', token_budget: 800,
            angle: 'dynamic-probing side', initial_prompt: 'Explore dynamically.' },
        ],
      },
      {
        group_id: 'synthesizer',
        agents: [
          { role: 'writer', model: 'claude-opus-4-8', token_budget: 4000, initial_prompt: 'Synthesize the explorers\' returns.' },
        ],
      },
    ],
    connections: [
      { from: 'explorers', to: 'synthesizer', type: 'sequential' },
      { from: 'synthesizer', to: 'explorers', type: 'feedback', loop_cap: 1 },
    ],
  }, over);
}
function validExperimentPropose(over) {
  return validDispatch(Object.assign({
    schema_version: '0.9.0',
    dispatch_id: '2026-08-27-experiment-propose',
    dispatch_type: 'experiment',
    goal: 'Freeze one falsifiable experiment criterion.',
    working_folder: 'experiments/example/',
    experiment_contract: {
      phase: 'propose',
      criterion_output_path: 'CRITERION.md',
    },
    groups: [
      {
        group_id: 'designer',
        agents: [{ role: 'writer', model: 'm', token_budget: 200, initial_prompt: 'Author the criterion.' }],
      },
      {
        group_id: 'validity-skeptic',
        agents: [{ role: 'skeptic', model: 'm', token_budget: 200, initial_prompt: 'Attack criterion validity.' }],
      },
    ],
    connections: [{ from: 'designer', to: 'validity-skeptic', type: 'zig-zag', loop_cap: 1 }],
  }, over));
}
function validNoSubjectDispatch(over) {
  return validDispatch(Object.assign({
    groups: [{
      group_id: 'writer',
      agents: [{ role: 'writer', model: 'm', token_budget: 200, initial_prompt: 'Write one bounded artifact.' }],
    }],
    connections: [],
  }, over));
}
function writeArtifact(root, relative, content) {
  const file = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  const bytes = fs.readFileSync(file);
  return {
    path: relative,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    size: bytes.length,
  };
}
function validOtherDispatch(root, over) {
  const source = writeArtifact(
    root,
    'governance/other-source.md',
    '# Bounded source\n\nOnly the declared file may be changed.\n',
  );
  return validDispatch(Object.assign({
    dispatch_id: '2026-08-27-battery-other',
    dispatch_type: 'other',
    goal: 'Apply and independently review one bounded repository change.',
    context: 'Change only src/bounded.txt from the exact source, run the declared check, and stop on scope or evidence drift.',
    max_loops: 1,
    anti_bias_global: undefined,
    working_folder: 'ops/development/other-battery/',
    groups: [
      {
        group_id: 'bounded-writer',
        agents: [{
          agent_name: 'Abramsky, Samson', role: 'writer', model: 'm', token_budget: 200,
          initial_prompt: 'Apply only the declared mutation and return changed paths plus validation.',
        }],
      },
      {
        group_id: 'independent-skeptic',
        agents: [{
          agent_name: 'Brandenburg, Martin', role: 'skeptic', model: 'm', token_budget: 200,
          initial_prompt: 'Review the bounded diff and validation without editing.',
        }],
      },
    ],
    connections: [{ from: 'bounded-writer', to: 'independent-skeptic', type: 'sequential' }],
    other_contract: {
      owner_capability: 'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/other/SKILL.md',
      targets: ['src/bounded.txt'],
      allowed_mutations: ['replace the declared bounded content'],
      forbidden_mutations: ['all files outside src/bounded.txt'],
      source_refs: [source],
      validation_commands: ['test -s src/bounded.txt'],
      expected_result: 'The bounded target matches the source and the independent skeptic accepts.',
      stop_conditions: ['target drift', 'missing source evidence', 'validation failure', 'reviewer block'],
      lanes: [{
        lane_id: 'bounded-change',
        writer_group_id: 'bounded-writer',
        reviewer_group_id: 'independent-skeptic',
        target_paths: ['src/bounded.txt'],
        connection_type: 'sequential',
      }],
    },
  }, over));
}
function validExperimentRun(criterionRef, over) {
  return validDispatch(Object.assign({
    schema_version: '0.9.0',
    dispatch_id: '2026-08-27-experiment-run',
    dispatch_type: 'experiment',
    goal: 'Run the frozen experiment with deterministic parent adjudication.',
    working_folder: 'experiments/example/',
    experiment_contract: {
      phase: 'run',
      proposal_dispatch_id: '2026-08-27-experiment-propose',
      criterion_ref: criterionRef,
      experiment_output_path: 'experiment.md',
      findings_output_path: 'findings.md',
      adjudication: {
        mode: 'parent_mechanical',
        rule_locator: `${criterionRef.path}#mechanical-verdict-rule`,
      },
    },
    groups: [
      {
        group_id: 'runner-a',
        agents: [{ role: 'explorer', model: 'm', token_budget: 200, initial_prompt: 'Run controlled replicate A.' }],
      },
      {
        group_id: 'runner-b',
        agents: [{ role: 'explorer', model: 'm', token_budget: 200, initial_prompt: 'Run controlled replicate B.' }],
      },
    ],
    connections: [],
  }, over));
}
function validClose(over) {
  return Object.assign({
    close_of: '2026-06-12-battery-main',
    exit_reason: 'resolved',
    agents_spawned: { total: 3, tree: { explorer: 2, writer: 1, helpers: 0 }, loops_used: 1 },
    feedback_prompts: ['Verbatim feedback ask sent back to the explorers.'],
    invoked_by: 'tester@example.com',
  }, over);
}
// Drop a key from a fresh valid record.
function without(base, key) { const r = Object.assign({}, base); delete r[key]; return r; }
// A record with TWO fan-out groups (explorers n=2 + reviewers n=2) — the
// anti_bias_global conditional's trigger shape (constitution §9, D2).
function twoFanout(over) {
  const r = validDispatch(Object.assign({ dispatch_id: '2026-06-12-battery-two-fanout' }, over));
  r.groups.push({
    group_id: 'reviewers', n: 2,
    anti_bias: 'attack-vector (precedent-kill vs non-vacuity)',
    predicted_disagreements: [
      {
        pair: [0, 1],
        statement: 'Agent 0 attacks precedent while agent 1 attacks vacuity on the attack-vector axis; each exposes a distinct false-positive mode.',
      },
    ],
    agents: [
      { role: 'skeptic', model: 'claude-opus-4-8', token_budget: 1000, angle: 'precedent-kill gate', initial_prompt: 'Attack precedent.' },
      { role: 'skeptic', model: 'claude-opus-4-8', token_budget: 1000, angle: 'non-vacuity gate', initial_prompt: 'Attack vacuity.' },
    ],
  });
  return r;
}

// =====================================================================
console.log('\n[0] confirmation-readiness validates the exact sheet core before human confirmation');
{
  const root = freshRoot();
  const valid = validateSheet(root, validDispatch());
  const expectedDigest = crypto.createHash('sha256').update(Buffer.from(valid.content)).digest('hex');
  check('0a valid sheet without evidence_binding passes',
    valid.status === 0 && /SHEET_VALIDATION=pass/.test(valid.stdout),
    valid.stderr || valid.stdout);
  check('0b validator reports the exact live schema and sheet digest',
    /SCHEMA_VERSION=0\.10\.0/.test(valid.stdout) &&
      valid.stdout.includes(`SHEET_SHA256=${expectedDigest}`),
    valid.stdout);
  check('0c validation is non-mutating',
    /LEDGER_MUTATION=none/.test(valid.stdout) && readLedger(root) === '',
    readLedger(root));

  const stale = validateSheet(root, validDispatch({ schema_version: '0.6.0' }));
  check('0d stale form version warns and blocks before confirmation',
    stale.status === 2 &&
      /WARNING FORM_VERSION_DRIFT/.test(stale.stderr) &&
      /live form owner requires "0\.10\.0"/.test(stale.stderr) &&
      readLedger(root) === '',
    `exit=${stale.status}\nstderr=${stale.stderr}`);

  const selfApprover = validateSheet(root, validDispatch({
    final_approver: 'Abramsky, Samson',
  }));
  check('0e non-auditor final approver blocks before confirmation',
    selfApprover.status === 2 && /sole agent of a singleton group with role "auditor"/.test(selfApprover.stderr),
    selfApprover.stderr);

  const reserved = validateSheet(root, validDispatch({ dispatch_type: 'plan' }));
  check('0f reserved dispatch type blocks before confirmation',
    reserved.status === 2 && /is RESERVED and cannot be registered/.test(reserved.stderr),
    reserved.stderr);

  const wrongShape = validateSheet(root, validDispatch({ groups: { explorers: [] } }));
  check('0g stale non-row group shape blocks before confirmation',
    wrongShape.status === 2 && /groups is required and must be a non-empty array/.test(wrongShape.stderr),
    wrongShape.stderr);

  const bound = validDispatch();
  bindEvidence(root, bound);
  const recursive = validateSheet(root, bound, { preserveEvidenceBinding: true });
  check('0h evidence_binding is rejected from the frozen candidate sheet',
    recursive.status === 2 && /evidence_binding must be absent/.test(recursive.stderr),
    recursive.stderr);
  check('0i every readiness case leaves the ledger untouched', readLedger(root) === '');
}

console.log('\n[1] valid full v0.10.0 row appends; emitted lines pass the self-check on a second append');
{
  const root = freshRoot();
  const r1 = run(root, validDispatch());
  check('1a valid dispatch row appends (exit 0)', r1.status === 0, r1.stderr || r1.stdout);
  const text = readLedger(root);
  check('1b row start emitted', /^  - dispatch_id: "2026-06-12-battery-main"$/m.test(text), text);
  check('1c schema_version block key', /^    schema_version: "0\.10\.0"$/m.test(text), text);
  check('1d invoked_by taken from record', /^    invoked_by: "tester@example\.com"$/m.test(text), text);
  check('1e created stamped by appender', /^    created: "\d{4}-\d{2}-\d{2}T/m.test(text), text);
  check('1f groups emitted as JSON column', /^    groups: \[\{"group_id":"explorers"/m.test(text), text);
  check('1g connections emitted as JSON column', /^    connections: \[\{"from":"explorers"/m.test(text), text);
  check('1g2 evidence binding emitted as JSON column',
    /^    evidence_binding: \{"sheet_path":"dispatch-sheets\//m.test(text), text);
  {
    const marker = 'Second line proves stringify newline escaping';
    const hits = text.split('\n').filter((l) => l.includes(marker));
    check('1h newline inside initial_prompt is escaped (groups JSON column is ONE physical line)',
      hits.length === 1 && hits[0].startsWith('    groups: '), text);
  }
  // second append over the same ledger — the self-check must accept the emitted row
  const r2 = run(root, validDispatch({ dispatch_id: '2026-06-12-battery-second' }));
  check('1i second append passes self-check over the first emitted row (exit 0)', r2.status === 0, r2.stderr || r2.stdout);
  check('1j both rows present', /battery-main/.test(readLedger(root)) && /battery-second/.test(readLedger(root)));
}

console.log('\n[1E] sheet evidence binding is complete, digest-bound, and fail-closed');
{
  const root = freshRoot();
  expectReject('1E-a missing evidence binding rejected', root,
    validDispatch({ dispatch_id: '2026-06-12-evidence-missing', evidence_binding: null }),
    /evidence_binding is required/);

  const oneVerdict = validDispatch({ dispatch_id: '2026-06-12-evidence-one-verdict' });
  bindEvidence(root, oneVerdict);
  oneVerdict.evidence_binding.tension_verdicts.pop();
  expectReject('1E-b one tension verdict rejected', root, oneVerdict, /exactly two verdict handles/);

  const failedVerdict = validDispatch({ dispatch_id: '2026-06-12-evidence-failed-verdict' });
  bindEvidence(root, failedVerdict);
  failedVerdict.evidence_binding.tension_verdicts[1].verdict = 'fail';
  expectReject('1E-c failing tension verdict rejected', root, failedVerdict, /verdict must be exactly "pass"/);

  const noConfirmation = validDispatch({ dispatch_id: '2026-06-12-evidence-no-confirmation' });
  bindEvidence(root, noConfirmation);
  delete noConfirmation.evidence_binding.confirmation;
  expectReject('1E-d absent confirmation rejected', root, noConfirmation, /confirmation is required/);

  const changedSheet = validDispatch({ dispatch_id: '2026-06-12-evidence-changed-sheet' });
  const changed = bindEvidence(root, changedSheet);
  fs.appendFileSync(changed.sheet, 'post-confirmation mutation\n');
  expectReject('1E-e post-confirmation sheet mutation rejected', root, changedSheet, /does not match current sheet bytes/);

  const mismatchedConfirmation = validDispatch({ dispatch_id: '2026-06-12-evidence-confirmation-digest' });
  bindEvidence(root, mismatchedConfirmation);
  mismatchedConfirmation.evidence_binding.confirmation.sheet_sha256 = '0'.repeat(64);
  expectReject('1E-f confirmation bound to another digest rejected', root, mismatchedConfirmation,
    /confirmation\.sheet_sha256 must match/);

  const duplicateHandle = validDispatch({ dispatch_id: '2026-06-12-evidence-duplicate-handle' });
  bindEvidence(root, duplicateHandle);
  duplicateHandle.evidence_binding.tension_verdicts[1].handle =
    duplicateHandle.evidence_binding.tension_verdicts[0].handle;
  expectReject('1E-g duplicate tension handle rejected', root, duplicateHandle, /duplicates another tension verdict handle/);

  const fullChat = validDispatch({ dispatch_id: '2026-06-12-evidence-full-chat' });
  bindEvidence(root, fullChat);
  fullChat.evidence_binding.tension_verdicts[0].return_text = 'full chat must not be persisted';
  expectReject('1E-h full return text is not an admitted evidence field', root, fullChat, /unknown key "return_text"/);

  const noSubjectRoot = freshRoot();
  const noSubject = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-canonical' });
  bindEvidence(noSubjectRoot, noSubject);
  const expectedNoSubjectHandles = noSubjectTensionVerdicts(noSubject.evidence_binding.sheet_sha256)
    .map((verdict) => verdict.handle).sort();
  const actualNoSubjectHandles = noSubject.evidence_binding.tension_verdicts
    .map((verdict) => verdict.handle).sort();
  const noSubjectAppend = run(noSubjectRoot, noSubject);
  check('1E-i no-subject sheet registers with the exact deterministic gate-slot handles',
    noSubjectAppend.status === 0 && JSON.stringify(actualNoSubjectHandles) === JSON.stringify(expectedNoSubjectHandles),
    noSubjectAppend.stderr || noSubjectAppend.stdout);

  const reversed = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-reversed' });
  bindEvidence(noSubjectRoot, reversed);
  reversed.evidence_binding.tension_verdicts.reverse();
  const reversedAppend = run(noSubjectRoot, reversed);
  check('1E-j canonical no-subject handle order is not semantic',
    reversedAppend.status === 0, reversedAppend.stderr || reversedAppend.stdout);

  const invented = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-invented' });
  bindEvidence(noSubjectRoot, invented);
  invented.evidence_binding.tension_verdicts = [
    { handle: 'invented:checker', verdict: 'pass', sheet_sha256: invented.evidence_binding.sheet_sha256 },
    { handle: 'invented:reviewer', verdict: 'pass', sheet_sha256: invented.evidence_binding.sheet_sha256 },
  ];
  expectReject('1E-k no-subject sheet rejects ordinary or invented PASS handles', noSubjectRoot, invented,
    /require exactly the canonical checker and reviewer no-subject handles/);

  const partial = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-partial' });
  bindEvidence(noSubjectRoot, partial);
  partial.evidence_binding.tension_verdicts[1].handle = 'wrong-prefix:reviewer';
  expectReject('1E-l no-subject sheet rejects a partial or wrong-prefix canonical pair', noSubjectRoot, partial,
    /require exactly the canonical checker and reviewer no-subject handles/);

  const wrongSuffix = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-wrong-suffix' });
  bindEvidence(noSubjectRoot, wrongSuffix);
  wrongSuffix.evidence_binding.tension_verdicts[1].handle =
    `${NO_SUBJECT_TENSION_HANDLE_PREFIX}reviewer:${'0'.repeat(64)}`;
  expectReject('1E-m no-subject handle digest suffix must equal the bound sheet digest', noSubjectRoot, wrongSuffix,
    /require exactly the canonical checker and reviewer no-subject handles/);

  const duplicateNoSubject = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-duplicate' });
  bindEvidence(noSubjectRoot, duplicateNoSubject);
  duplicateNoSubject.evidence_binding.tension_verdicts[1].handle =
    duplicateNoSubject.evidence_binding.tension_verdicts[0].handle;
  expectReject('1E-n no-subject sheet rejects duplicate gate-slot handles', noSubjectRoot, duplicateNoSubject,
    /duplicates another tension verdict handle/);

  const wrongDigestNoSubject = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-wrong-digest' });
  bindEvidence(noSubjectRoot, wrongDigestNoSubject);
  wrongDigestNoSubject.evidence_binding.tension_verdicts[0].sheet_sha256 = '0'.repeat(64);
  expectReject('1E-o no-subject sheet rejects a gate slot bound to another digest', noSubjectRoot, wrongDigestNoSubject,
    /sheet_sha256 must match evidence_binding.sheet_sha256/);

  const failedNoSubject = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-failed' });
  bindEvidence(noSubjectRoot, failedNoSubject);
  failedNoSubject.evidence_binding.tension_verdicts[0].verdict = 'fail';
  expectReject('1E-p no-subject mechanical disposition still requires PASS', noSubjectRoot, failedNoSubject,
    /verdict must be exactly "pass"/);

  const noSubjectNoConfirmation = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-no-confirmation' });
  bindEvidence(noSubjectRoot, noSubjectNoConfirmation);
  delete noSubjectNoConfirmation.evidence_binding.confirmation;
  expectReject('1E-q no-subject disposition never bypasses explicit human confirmation', noSubjectRoot, noSubjectNoConfirmation,
    /confirmation is required/);

  const mutatedNoSubject = validNoSubjectDispatch({ dispatch_id: '2026-08-27-no-subject-mutated' });
  const mutatedBinding = bindEvidence(noSubjectRoot, mutatedNoSubject);
  fs.appendFileSync(mutatedBinding.sheet, '\n');
  expectReject('1E-r later sheet-byte mutation invalidates canonical no-subject handles', noSubjectRoot, mutatedNoSubject,
    /does not match current sheet bytes/);

  const subjectWithReserved = validDispatch({ dispatch_id: '2026-08-27-subject-reserved' });
  bindEvidence(noSubjectRoot, subjectWithReserved);
  subjectWithReserved.evidence_binding.tension_verdicts =
    noSubjectTensionVerdicts(subjectWithReserved.evidence_binding.sheet_sha256);
  expectReject('1E-s subject-group sheet rejects reserved no-subject handles', noSubjectRoot, subjectWithReserved,
    /subject-group sheets require two independent tension verdict handles/);

  const predicateDrift = validNoSubjectDispatch({ dispatch_id: '2026-08-27-subject-predicate-drift' });
  bindEvidence(noSubjectRoot, predicateDrift);
  predicateDrift.groups[0].agents.push({
    role: 'explorer', model: 'm', token_budget: 200,
    initial_prompt: 'Unconfirmed second subject agent.',
  });
  predicateDrift.groups[0].n = 2;
  predicateDrift.groups[0].anti_bias = 'methodology (static vs dynamic)';
  predicateDrift.groups[0].predicted_disagreements = [{
    pair: [0, 1],
    statement: 'Agent 0 authors statically while agent 1 probes dynamically on the methodology axis; each exposes the other approach blind spot.',
  }];
  expectReject('1E-t registered row cannot change the confirmed sheet subject-group disposition', noSubjectRoot, predicateDrift,
    /must preserve the confirmed sheet subject-group disposition/);
}

console.log('\n[2] each missing required dispatch field is rejected (exit 2)');
{
  const root = freshRoot();
  const fieldPattern = {
    dispatch_id: /dispatch_id is required/,
    schema_version: /schema_version must be exactly "0\.10\.0"/,
    dispatch_type: /dispatch_type must be one of/,
    goal: /goal is required/,
    context: /context is required/,
    max_loops: /max_loops must be an integer in 1\.\.5/,
    final_approver: /final_approver is required/,
    groups: /groups is required/,
  };
  for (const f of Object.keys(fieldPattern)) {
    expectReject(`2 missing ${f}`, root, without(validDispatch(), f), fieldPattern[f]);
  }
  // required fields inside group / agent
  expectReject('2 group missing group_id', root, validDispatch({ groups: [{ agents: [{ role: 'writer', model: 'm', token_budget: 1, initial_prompt: 'p' }] }] }), /group_id is required/);
  expectReject('2 agent missing token_budget', root, validDispatch({ groups: [{ group_id: 'g', agents: [{ role: 'writer', model: 'm', initial_prompt: 'p' }] }], connections: [] }), /token_budget is required/);
  expectReject('2 agent missing initial_prompt', root, validDispatch({ groups: [{ group_id: 'g', agents: [{ role: 'writer', model: 'm', token_budget: 1 }] }], connections: [] }), /initial_prompt is required/);
  check('2z ledger untouched by rejected records', readLedger(root) === '');
}

console.log('\n[3] wrong schema_version rejected');
{
  const root = freshRoot();
  expectReject('3a prior schema_version "0.8.0"', root, validDispatch({ schema_version: '0.8.0' }), /schema_version must be exactly "0\.10\.0"/);
  expectReject('3b schema_version 0.9.0 as number', root, validDispatch({ schema_version: 0.9 }), /schema_version/);
  expectReject('3c old schema_version "0.5.2" now rejected', root, validDispatch({ schema_version: '0.5.2' }), /schema_version must be exactly "0\.10\.0"/);
}

console.log('\n[4] bad enum values rejected');
{
  const root = freshRoot();
  expectReject('4a dispatch_type "audit"', root, validDispatch({ dispatch_type: 'audit' }), /dispatch_type must be one of/);
  const g = validDispatch();
  g.groups[1].role = 'synthesize';
  expectReject('4b group `role` remains an unknown key (removed v0.6.0)', root, g, /unknown key "role"/);
  const a = validDispatch();
  a.groups[1].agents[0].role = 'reviewer';
  expectReject('4c agent role "reviewer"', root, a, /role must be one of explorer/);
  // the rejection message must enumerate the full v0.6.0 role vocab, incl. synthesizer
  expectReject('4c2 role error lists synthesizer in the enum', root, a, /explorer \| synthesizer \| skeptic \| writer \| auditor/);
  // synthesizer is a LIVE role (model change: writer split into synthesizer+writer) — must be accepted
  const syn = validDispatch({ dispatch_id: '2026-06-12-battery-synthesizer-role' });
  syn.groups[1].agents[0].role = 'synthesizer';
  const rSyn = run(root, syn);
  check('4c3 agent role "synthesizer" accepted (exit 0)', rSyn.status === 0, rSyn.stderr || rSyn.stdout);
  expectReject('4d exit_reason "success"', root, validClose({ exit_reason: 'success' }), /exit_reason must be one of resolved/);
  expectReject('4e agents_spawned missing tree', root, validClose({ agents_spawned: { total: 3 } }), /agents_spawned\.tree/);
  expectReject('4f agents_spawned non-numeric total', root, validClose({ agents_spawned: { total: 'three', tree: {} } }), /agents_spawned\.total/);
  expectReject('4g close row missing loops_used', root, validClose({ agents_spawned: { total: 3, tree: { investigate: 2, synthesize: 1, helpers: 0 } } }), /agents_spawned\.loops_used is required/);
  expectReject('4h negative loops_used', root, validClose({ agents_spawned: { total: 3, tree: { investigate: 2, synthesize: 1, helpers: 0 }, loops_used: -1 } }), /agents_spawned\.loops_used is required and must be a non-negative integer/);
}

console.log('\n[5] pre-v0.5.2 keys rejected with the right per-provenance message');
{
  const root = freshRoot();
  // keys in constitution §7's removed table — removed-by-v0.5.2 message
  const removed = { success_metric: { type: 'closure' }, constraints: ['x'], created: '2026-06-12T00:00:00Z' };
  for (const [k, v] of Object.entries(removed)) {
    expectReject(`5 removed key ${k}`, root, validDispatch({ [k]: v }), new RegExp(`"${k}" was removed by schema v0\\.5\\.2`));
  }
  // old ledger-row-only keys (not in §7's table) — pre-v0.5.2-ledger-row message
  const legacy = { status: 'dispatched', anti_bias: { axis: 'x' }, agents: [{ role: 'explorer' }],
    corpus: 'research/audits', topic_slug: 'slug', session: 's1' };
  for (const [k, v] of Object.entries(legacy)) {
    expectReject(`5 legacy ledger key ${k}`, root, validDispatch({ [k]: v }), new RegExp(`"${k}" is a pre-v0\\.5\\.2 ledger-row key, not in the v0\\.9\\.0 schema`));
  }
}

console.log('\n[6] missing angle / anti_bias in a 2-agent group rejected');
{
  const root = freshRoot();
  const noAngle = validDispatch();
  delete noAngle.groups[0].agents[0].angle;
  expectReject('6a missing angle on one agent of a 2-agent group', root, noAngle, /angle is required when the group has >= 2 agents/);
  const noAxis = validDispatch();
  delete noAxis.groups[0].anti_bias;
  expectReject('6b missing anti_bias on a 2-agent group', root, noAxis, /anti_bias is required when the group has >= 2 agents/);
  // control: a 1-agent group needs neither (the base fixture's synthesizer already proves it in [1])
}

console.log('\n[7] n mismatch with agents.length rejected');
{
  const root = freshRoot();
  const r = validDispatch();
  r.groups[0].n = 3;
  expectReject('7a n=3 with 2 agents', root, r, /must equal agents\.length/);
  expectReject('7b n=0', root, (() => { const x = validDispatch(); x.groups[0].n = 0; return x; })(), /n must be an integer >= 1/);
}

console.log('\n[8] connection referencing an undeclared group_id rejected');
{
  const root = freshRoot();
  const r = validDispatch();
  r.connections.push({ from: 'ghosts', to: 'synthesizer', type: 'sequential' });
  expectReject('8 from "ghosts" undeclared', root, r, /does not reference a declared group_id/);
}

console.log('\n[9] loop_cap on a sequential connection rejected');
{
  const root = freshRoot();
  const r = validDispatch();
  r.connections[0].loop_cap = 2; // explorers -> synthesizer is sequential
  expectReject('9 loop_cap on sequential', root, r, /loop_cap must be ABSENT on a sequential connection/);
}

console.log('\n[10] working_folder rules');
{
  const root = freshRoot();
  expectReject('10a research without working_folder', root, without(validDispatch(), 'working_folder'), /working_folder is required when dispatch_type is "research"/);
  expectReject('10b working_folder under vault/', root, validDispatch({ working_folder: 'vault/discovery/x/' }), /must never point into vault\//);
  // hardened vault guard (normalized): leading ./ or .\, case-insensitive, bare "vault"
  expectReject('10d "./vault/x" rejected (leading ./ stripped)', root, validDispatch({ working_folder: './vault/x' }), /must never point into vault\//);
  expectReject('10e "Vault/x" rejected (case-insensitive)', root, validDispatch({ working_folder: 'Vault/x' }), /must never point into vault\//);
  expectReject('10f "vault\\x" rejected (backslash separator)', root, validDispatch({ working_folder: 'vault\\x' }), /must never point into vault\//);
  expectReject('10g bare "vault" rejected', root, validDispatch({ working_folder: 'vault' }), /must never point into vault\//);
  const rv = run(root, validDispatch({ dispatch_id: '2026-06-12-battery-vaulted', working_folder: 'vaulted/x/' }));
  check('10h "vaulted/x/" accepted — no vault-guard false positive', rv.status === 0, rv.stderr || rv.stdout);
  for (const type of ['code', 'plan', 'suggestion']) {
    expectReject(`10c RESERVED ${type} rejected before append`, root,
      validDispatch({ dispatch_id: `2026-06-12-battery-${type}`, dispatch_type: type, working_folder: undefined }),
      /is RESERVED and cannot be registered/);
  }
  // experiment is LIVE (2026-06-14) — requires working_folder like research/review, no FORECAST note
  expectReject('10i experiment without working_folder rejected (LIVE type)', root, validDispatch({ dispatch_id: '2026-06-12-battery-exp-nf', dispatch_type: 'experiment', working_folder: undefined }), /working_folder is required when dispatch_type is "experiment"/);
  const re = run(root, validExperimentPropose({ dispatch_id: '2026-06-12-battery-experiment' }));
  check('10j historical v0.9 experiment with working_folder is validate-only',
    re.status === 2 && /historical schema v0\.9\.0 is validate-only/.test(re.stderr), re.stderr || re.stdout);
  expectReject('10j2 other without working_folder rejected (LIVE type)', root,
    validDispatch({ dispatch_id: '2026-08-27-battery-other-nf', dispatch_type: 'other', working_folder: undefined }),
    /working_folder is required when dispatch_type is "other"/);
  const ro = run(root, validOtherDispatch(root));
  check('10j3 other with an exact owner contract passes admission', ro.status === 0, ro.stderr || ro.stdout);
  const missingOtherContract = validOtherDispatch(root, { dispatch_id: '2026-08-27-battery-other-no-contract' });
  delete missingOtherContract.other_contract;
  expectReject('10j4 other without other_contract is rejected', root, missingOtherContract,
    /other_contract is required when dispatch_type is "other"/);
  const missingReviewerIdentity = validOtherDispatch(root, { dispatch_id: '2026-08-27-battery-other-no-reviewer-id' });
  missingReviewerIdentity.groups[1].agents[0].agent_name = null;
  expectReject('10j5 other reviewer must be an independent pooled identity', root, missingReviewerIdentity,
    /reviewer_group_id must name a singleton pooled skeptic identity/);
  const wrongOtherEdge = validOtherDispatch(root, { dispatch_id: '2026-08-27-battery-other-wrong-edge' });
  wrongOtherEdge.connections[0].to = 'bounded-writer';
  expectReject('10j6 other lane requires the declared writer-to-reviewer edge', root, wrongOtherEdge,
    /must have its declared writer-to-reviewer connection/);
  const missingOtherCheck = validOtherDispatch(root, { dispatch_id: '2026-08-27-battery-other-no-check' });
  missingOtherCheck.other_contract.validation_commands = [];
  expectReject('10j7 other requires deterministic validation commands', root, missingOtherCheck,
    /validation_commands must be a non-empty array/);
  const unownedOtherTarget = validOtherDispatch(root, { dispatch_id: '2026-08-27-battery-other-unowned-target' });
  unownedOtherTarget.other_contract.targets.push('src/unowned.txt');
  expectReject('10j8 every other target must belong to one lane', root, unownedOtherTarget,
    /target "src\/unowned\.txt" is not owned by any lane/);
  expectReject('10k absolute POSIX working_folder rejected', root,
    validDispatch({ working_folder: '/tmp/outside' }), /must be repository-relative/);
  expectReject('10l absolute Windows working_folder rejected', root,
    validDispatch({ working_folder: 'C:\\outside' }), /must be repository-relative/);
  expectReject('10m slash parent traversal rejected', root,
    validDispatch({ working_folder: 'research/../../outside' }), /must not contain parent traversal/);
  expectReject('10n backslash parent traversal rejected', root,
    validDispatch({ working_folder: 'research\\..\\..\\outside' }), /must not contain parent traversal/);

  const safe = run(root, validDispatch({
    dispatch_id: '2026-06-12-battery-new-in-root',
    working_folder: 'research/not-created-yet/deeper/',
  }));
  check('10o non-existing in-root folder accepted', safe.status === 0, safe.stderr || safe.stdout);

  const outside = freshRoot();
  const link = path.join(root, 'escape-link');
  try {
    fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    expectReject('10p existing symlink-parent escape rejected', root,
      validDispatch({ working_folder: 'escape-link/not-created-yet/' }),
      /resolves outside the repository root/);
  } catch (e) {
    check('10p existing symlink-parent escape rejected', false, `cannot create test symlink: ${e.message}`);
  }
}

console.log('\n[10E] phased experiment contract, lineage, adjudication, and closeout');
{
  const root = freshRoot();
  const proposal = validExperimentPropose();
  const proposalReady = validateSheet(root, proposal);
  check('10E-a propose sheet with explicit phase contract passes readiness',
    proposalReady.status === 0, proposalReady.stderr || proposalReady.stdout);
  const proposalAppend = run(root, proposal);
  check('10E-b historical v0.9 propose registration is refused without mutation',
    proposalAppend.status === 2 && /historical schema v0\.9\.0 is validate-only/.test(proposalAppend.stderr) && readLedger(root) === '',
    proposalAppend.stderr || readLedger(root));
  seedHistoricalDispatch(root, proposal);

  const criterionRef = writeArtifact(root, 'experiments/example/CRITERION.md', [
    '# Criterion',
    '',
    '## Mechanical verdict rule',
    '',
    'Render SURVIVED when the declared count is positive; otherwise FALSIFIED.',
    '',
  ].join('\n'));
  const proposalClose = run(root, validClose({
    close_of: proposal.dispatch_id,
    agents_spawned: { total: 1, tree: { writer: 1, helpers: 0 }, loops_used: 0 },
    feedback_prompts: undefined,
    experiment_closeout: { phase: 'propose', status: 'frozen', criterion_ref: criterionRef },
  }));
  check('10E-c resolved proposal freezes an exact criterion reference',
    proposalClose.status === 0 && /^    experiment_closeout: \{"phase":"propose","status":"frozen"/m.test(readLedger(root)),
    proposalClose.stderr || readLedger(root));

  const experimentRun = validExperimentRun(criterionRef);
  const runReady = validateSheet(root, experimentRun);
  check('10E-d run readiness proves the closed proposal lineage without ledger mutation',
    runReady.status === 0 && /LEDGER_READ=proposal_lineage_only/.test(runReady.stdout),
    runReady.stderr || runReady.stdout);
  const missingRule = JSON.parse(JSON.stringify(experimentRun));
  delete missingRule.experiment_contract.adjudication.rule_locator;
  const missingRuleReady = validateSheet(root, missingRule);
  check('10E-d2 parent-mechanical adjudication requires a frozen rule locator',
    missingRuleReady.status === 2 && /rule_locator is required/.test(missingRuleReady.stderr),
    missingRuleReady.stderr);
  const missingProposal = validExperimentRun(criterionRef, {
    dispatch_id: '2026-08-27-experiment-run-missing-proposal',
  });
  missingProposal.experiment_contract.proposal_dispatch_id = '2026-08-27-does-not-exist';
  const missingProposalReady = validateSheet(root, missingProposal);
  check('10E-d3 run readiness rejects an unknown proposal id',
    missingProposalReady.status === 2 && /does not reference an existing dispatch row/.test(missingProposalReady.stderr),
    missingProposalReady.stderr);
  const runAppend = run(root, experimentRun);
  check('10E-e historical v0.9 run registration is refused without a new row',
    runAppend.status === 2 && /historical schema v0\.9\.0 is validate-only/.test(runAppend.stderr),
    runAppend.stderr || readLedger(root));
  seedHistoricalDispatch(root, experimentRun);

  const experimentRef = writeArtifact(root, 'experiments/example/experiment.md', '# Raw result\n\nObserved count: 18.\n');
  const findingsRef = writeArtifact(root, 'experiments/example/findings.md', '# Findings\n\nVerdict: SURVIVED.\n');
  const runClose = run(root, validClose({
    close_of: experimentRun.dispatch_id,
    agents_spawned: { total: 6, tree: { explorer: 6, helpers: 1 }, loops_used: 0 },
    feedback_prompts: undefined,
    experiment_closeout: {
      phase: 'run',
      status: 'adjudicated',
      verdict: 'SURVIVED',
      criterion_ref: criterionRef,
      experiment_ref: experimentRef,
      findings_ref: findingsRef,
    },
  }));
  check('10E-f resolved run appends exact result refs and verdict',
    runClose.status === 0 && /\"verdict\":\"SURVIVED\"/.test(readLedger(root)),
    runClose.stderr || readLedger(root));

  expectReject('10E-g experiment without experiment_contract rejected', freshRoot(),
    validDispatch({ dispatch_id: '2026-08-27-experiment-missing-contract', dispatch_type: 'experiment' }),
    /experiment_contract is required/);
  expectReject('10E-h non-experiment with experiment_contract rejected', freshRoot(),
    validDispatch({ experiment_contract: { phase: 'propose', criterion_output_path: 'CRITERION.md' } }),
    /allowed only when dispatch_type is "experiment"/);

  const unclosedRoot = freshRoot();
  const unclosedProposal = validExperimentPropose();
  seedHistoricalDispatch(unclosedRoot, unclosedProposal);
  const unclosedCriterion = writeArtifact(unclosedRoot, 'experiments/example/CRITERION.md', '# Criterion\n');
  const unclosedReady = validateSheet(unclosedRoot, validExperimentRun(unclosedCriterion));
  check('10E-i run readiness rejects an unclosed proposal before confirmation',
    unclosedReady.status === 2 && /is not closed/.test(unclosedReady.stderr),
    unclosedReady.stderr);

  const changedContract = validExperimentPropose({ dispatch_id: '2026-08-27-experiment-sheet-drift' });
  bindEvidence(root, changedContract);
  changedContract.experiment_contract.criterion_output_path = 'CHANGED.md';
  expectReject('10E-j registered contract must match the confirmed sheet', root, changedContract,
    /must exactly match the confirmed sheet/);

  const abnormalRoot = freshRoot();
  const abnormalProposal = validExperimentPropose({ dispatch_id: '2026-08-27-experiment-abnormal' });
  seedHistoricalDispatch(abnormalRoot, abnormalProposal);
  const abnormalCriterion = writeArtifact(abnormalRoot, 'experiments/example/CRITERION.md', '# Criterion\n');
  const missingCloseout = run(abnormalRoot, validClose({
    close_of: abnormalProposal.dispatch_id,
    exit_reason: 'error',
    agents_spawned: { total: 1, tree: { writer: 1, helpers: 0 }, loops_used: 0 },
    feedback_prompts: undefined,
  }));
  check('10E-k v0.9 experiment close requires experiment_closeout',
    missingCloseout.status === 2 && /experiment_closeout is required/.test(missingCloseout.stderr),
    missingCloseout.stderr);
  const fabricated = run(abnormalRoot, validClose({
    close_of: abnormalProposal.dispatch_id,
    exit_reason: 'error',
    agents_spawned: { total: 1, tree: { writer: 1, helpers: 0 }, loops_used: 0 },
    feedback_prompts: undefined,
    experiment_closeout: { phase: 'propose', status: 'frozen', criterion_ref: abnormalCriterion },
  }));
  check('10E-l abnormal proposal close cannot fabricate a frozen status',
    fabricated.status === 2 && /requires status "not_frozen"/.test(fabricated.stderr),
    fabricated.stderr);
  const honestAbnormal = run(abnormalRoot, validClose({
    close_of: abnormalProposal.dispatch_id,
    exit_reason: 'error',
    agents_spawned: { total: 1, tree: { writer: 1, helpers: 0 }, loops_used: 0 },
    feedback_prompts: undefined,
    experiment_closeout: { phase: 'propose', status: 'not_frozen' },
  }));
  check('10E-m abnormal proposal closes without fabricating an outcome',
    honestAbnormal.status === 0, honestAbnormal.stderr || honestAbnormal.stdout);
}

console.log('\n[11] close rows');
{
  const root = freshRoot();
  run(root, validDispatch()); // seed the dispatch row
  const r1 = run(root, validClose());
  check('11a valid close row appends (exit 0)', r1.status === 0, r1.stderr || r1.stdout);
  const text = readLedger(root);
  check('11b close row block keys emitted', /^  - close_of: "2026-06-12-battery-main"$/m.test(text) && /^    exit_reason: "resolved"$/m.test(text) && /^    closed: "\d{4}/m.test(text), text);
  check('11c agents_spawned emitted as JSON column', /^    agents_spawned: \{"total":3,"tree":\{"explorer":2,"writer":1,"helpers":0\},"loops_used":1\}$/m.test(text), text);
  check('11d feedback_prompts emitted as JSON column', /^    feedback_prompts: \["Verbatim feedback ask sent back to the explorers\."\]$/m.test(text), text);
  expectReject('11e close row with unknown key rejected', root, validClose({ close_of: '2026-06-12-battery-second', bogus: 1 }), /unknown key "bogus" on a close record/);
  expectReject('11f close row with dispatch_id rejected', root, Object.assign(validClose(), { dispatch_id: 'x' }), /must use close_of, not dispatch_id/);
  expectReject('11g close row with caller-supplied closed rejected', root, validClose({ closed: '2026-01-01T00:00:00Z' }), /unknown key "closed"/);
  expectReject('11h close without matching dispatch row rejected', root,
    validClose({ close_of: 'never-dispatched', feedback_prompts: undefined }),
    /does not reference an existing dispatch row/);
  // self-check still passes over the emitted close rows
  const r3 = run(root, validDispatch({ dispatch_id: '2026-06-12-battery-after-close' }));
  check('11i ledger with close rows still passes self-check', r3.status === 0, r3.stderr || r3.stdout);
}

console.log('\n[12] idempotency');
{
  const root = freshRoot();
  run(root, validDispatch());
  const before = readLedger(root);
  const r1 = run(root, validDispatch());
  check('12a same dispatch_id is a no-op', r1.status === 0 && /already registered/.test(r1.stdout) && readLedger(root) === before, r1.stdout);
  run(root, validClose());
  const mid = readLedger(root);
  const r2 = run(root, validClose());
  check('12b same close_of is a no-op', r2.status === 0 && /already closed/.test(r2.stdout) && readLedger(root) === mid, r2.stdout);
}

console.log('\n[13] grandfathering: old-shape rows pass the structural self-check');
{
  const root = freshRoot();
  const file = ledgerPath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // a real OLD-shape row, exactly as the pre-v0.5.2 appender emitted it
  fs.writeFileSync(file,
    '# subagents-dispatch.yaml — registry of subagent dispatches (one row per dispatch).\n' +
    '# Written by the register-dispatch skill. `agents` and `anti_bias` are JSON columns.\n' +
    'dispatches:\n' +
    '  - dispatch_id: "repo-genesis-backbone"\n' +
    '    corpus: "research/audits"\n' +
    '    created: "2026-06-12T18:00:00.000Z"\n' +
    '    status: "dispatched"\n' +
    '    goal: "Identify the invariant skeleton every component must instantiate."\n' +
    '    success_metric: {"type":"exploratory"}\n' +
    '    max_loops: 1\n' +
    '    anti_bias: {"axis":"corpus","pairs":["Adamek (domainspec) vs Baez (arcanum)"]}\n' +
    '    agents: [{"seq":"00","layer":"L0","role":"explorer","model":"sonnet","mode":"single","name":"Abramsky, Samson","angle":"model-extraction"}]\n');
  const r = run(root, validDispatch());
  check('13a append over an old-shape row succeeds (exit 0)', r.status === 0, r.stderr || r.stdout);
  const text = readLedger(root);
  check('13b old row untouched and new row appended', /repo-genesis-backbone/.test(text) && /battery-main/.test(text));
  const r2 = run(root, validClose({ close_of: 'repo-genesis-backbone', feedback_prompts: undefined }));
  check('13c old-shape row is closable with a v0.5.2 close row', r2.status === 0, r2.stderr || r2.stdout);
  fs.appendFileSync(file,
    '  - dispatch_id: "2026-06-14-historical-experiment"\n' +
    '    schema_version: "0.8.0"\n' +
    '    dispatch_type: "experiment"\n' +
    '    goal: "Historical propose-only experiment."\n' +
    '    groups: []\n');
  const r3 = run(root, validClose({
    close_of: '2026-06-14-historical-experiment',
    feedback_prompts: undefined,
  }));
  check('13d historical v0.8 experiment remains closable without a v0.9 experiment_closeout',
    r3.status === 0, r3.stderr || r3.stdout);
}

console.log('\n[14] invoked_by resolution');
{
  // (a) taken from record when present — already asserted in 1d; re-assert isolated:
  const rootA = freshRoot();
  run(rootA, validDispatch({ invoked_by: 'explicit@example.com' }));
  check('14a invoked_by from record wins', /^    invoked_by: "explicit@example\.com"$/m.test(readLedger(rootA)));

  const gitOk = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;
  // env that blinds git to global/system config, so only repo-local config counts
  function isolatedGitEnv(root) {
    const empty = path.join(root, 'empty-gitconfig');
    fs.writeFileSync(empty, '');
    return { GIT_CONFIG_GLOBAL: empty, GIT_CONFIG_SYSTEM: empty, GIT_CONFIG_NOSYSTEM: '1' };
  }
  if (!gitOk) {
    note('14b resolved from git config when absent', 'git unavailable on PATH');
    note('14c fail-soft null when neither', 'git unavailable on PATH');
  } else {
    // (b) absent from record -> resolved from the temp repo's git config user.email
    const rootB = freshRoot();
    const envB = isolatedGitEnv(rootB);
    spawnSync('git', ['init', '-q', rootB], { encoding: 'utf8', env: Object.assign({}, process.env, envB) });
    spawnSync('git', ['-C', rootB, 'config', 'user.email', 'battery@example.com'], { encoding: 'utf8', env: Object.assign({}, process.env, envB) });
    const rB = run(rootB, without(validDispatch(), 'invoked_by'), envB);
    check('14b resolved from git config user.email when absent',
      rB.status === 0 && /^    invoked_by: "battery@example\.com"$/m.test(readLedger(rootB)), rB.stderr || readLedger(rootB));
    // (c) absent from record, no repo, no global config -> warning + null
    const rootC = freshRoot();
    const envC = isolatedGitEnv(rootC);
    const rC = run(rootC, without(validDispatch(), 'invoked_by'), envC);
    check('14c fail-soft: warning emitted and invoked_by null',
      rC.status === 0 && /warning: invoked_by not in record/.test(rC.stdout) && /^    invoked_by: null$/m.test(readLedger(rootC)),
      rC.stderr || rC.stdout + '\n' + readLedger(rootC));
  }
}

console.log('\n[15] corrupt ledger refused (exit 1)');
{
  const root = freshRoot();
  const file = ledgerPath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, 'dispatches:\n  - dispatch_id: "ok-row"\n    goal: not-valid-json\n');
  const r = run(root, validDispatch());
  check('15 structurally corrupt ledger refused with exit 1', r.status === 1 && /ledger structural check failed/.test(r.stderr), `exit=${r.status} stderr=${r.stderr.trim()}`);
}

console.log('\n[16] anti_bias_global conditional (>= 2 fan-out groups) enforced');
{
  const root = freshRoot();
  expectReject('16a two fan-out groups without anti_bias_global', root,
    without(twoFanout(), 'anti_bias_global'), /anti_bias_global is required when >= 2 groups have >= 2 agents/);
  const r1 = run(root, twoFanout());
  check('16b two fan-out groups with anti_bias_global appends (exit 0)', r1.status === 0, r1.stderr || r1.stdout);
  const r2 = run(root, without(validDispatch({ dispatch_id: '2026-06-12-battery-one-fanout' }), 'anti_bias_global'));
  check('16c one fan-out group without anti_bias_global appends (exit 0)', r2.status === 0, r2.stderr || r2.stdout);
  // 16d: the conditional counts GROUPS WITH >= 2 AGENTS, not groups.length —
  // one fan-out group + three singletons must not trigger it.
  const manySingletons = without(validDispatch({ dispatch_id: '2026-06-12-battery-many-singletons' }), 'anti_bias_global');
  for (const id of ['solo-a', 'solo-b', 'solo-c']) {
    manySingletons.groups.push({ group_id: id,
      agents: [{ role: 'writer', model: 'm', token_budget: 1, initial_prompt: 'p' }] });
  }
  const r3 = run(root, manySingletons);
  check('16d one fan-out + three singleton groups without anti_bias_global appends (exit 0)', r3.status === 0, r3.stderr || r3.stdout);
  // 16e: a malformed sibling group must not crash or spuriously fire the conditional —
  // expect a clean exit 2 on the agents-array error, with NO anti_bias_global error.
  const malformedSibling = without(validDispatch({ dispatch_id: '2026-06-12-battery-malformed-sibling' }), 'anti_bias_global');
  malformedSibling.groups.push({ group_id: 'broken', agents: 'broken' });
  const r4 = run(root, malformedSibling);
  check('16e malformed sibling group: clean exit 2 on agents error, no spurious anti_bias_global error',
    r4.status === 2 && /agents is required and must be a non-empty array/.test(r4.stderr) && !/anti_bias_global/.test(r4.stderr),
    `exit=${r4.status}\nstderr=${r4.stderr.trim()}`);
}

console.log('\n[17] agent-pool and final-approver admission');
{
  const root = freshRoot();
  expectReject('17a explorer cannot be final approver after whitespace normalization', root,
    validDispatch({ final_approver: '  Abramsky,   Samson  ' }),
    /sole agent of a singleton group with role "auditor"/);
  expectReject('17b arbitrary unpooled final approver rejected', root, validDispatch({
    final_approver: 'Independent Maintainer',
  }), /final_approver .* is not present in telemetry\/agents\/agent-pool\.yaml/);

  const dedicated = validDispatch({
    dispatch_id: '2026-06-12-battery-dedicated-approver',
    final_approver: 'Brandenburg, Martin',
  });
  dedicated.groups.push({
    group_id: 'approval',
    agents: [{
      agent_name: 'Brandenburg, Martin',
      role: 'auditor',
      model: 'claude-opus-4-8',
      token_budget: 600,
      initial_prompt: 'Evaluate the complete result and recommend accept or reject.',
    }],
  });
  const approved = run(root, dedicated);
  check('17c pooled singleton auditor final approver accepted',
    approved.status === 0, approved.stderr || approved.stdout);

  const wrongRole = validDispatch({
    dispatch_id: '2026-06-12-battery-writer-approver',
    final_approver: 'Brandenburg, Martin',
  });
  wrongRole.groups.push({
    group_id: 'approval',
    agents: [{
      agent_name: 'Brandenburg, Martin',
      role: 'writer',
      model: 'claude-opus-4-8',
      token_budget: 600,
      initial_prompt: 'Write the result.',
    }],
  });
  expectReject('17d pooled singleton non-auditor cannot approve', root, wrongRole,
    /singleton group with role "auditor"/);

  const multiAuditor = validDispatch({
    dispatch_id: '2026-06-12-battery-multi-auditor',
    final_approver: 'Brandenburg, Martin',
  });
  multiAuditor.groups.push({
    group_id: 'approval',
    anti_bias: 'attack-vector (scope vs precedent)',
    predicted_disagreements: [{
      pair: [0, 1],
      statement: 'Agent 0 attacks scope while agent 1 attacks precedent on the attack-vector axis; each exposes a different approval error.',
    }],
    agents: [
      {
        agent_name: 'Brandenburg, Martin', role: 'auditor', model: 'm',
        token_budget: 1, angle: 'scope gate', initial_prompt: 'Audit scope.',
      },
      {
        agent_name: 'Bourbaki, Nicolas', role: 'auditor', model: 'm',
        token_budget: 1, angle: 'precedent gate', initial_prompt: 'Audit precedent.',
      },
    ],
  });
  expectReject('17e final approver cannot come from a multi-agent auditor group', root, multiAuditor,
    /sole agent of a singleton group with role "auditor"/);

  const unpooledAgent = validDispatch({ dispatch_id: '2026-06-12-battery-unpooled-agent' });
  unpooledAgent.groups[1].agents[0].agent_name = 'Unknown, Agent';
  expectReject('17f unpooled working agent rejected', root, unpooledAgent,
    /agent_name .* is not present in telemetry\/agents\/agent-pool\.yaml/);

  const duplicateAgent = validDispatch({ dispatch_id: '2026-06-12-battery-duplicate-agent' });
  duplicateAgent.groups[1].agents[0].agent_name = 'Abramsky, Samson';
  expectReject('17g duplicate non-null identity rejected', root, duplicateAgent,
    /non-null identities must be unique within a dispatch/);

  const missingPoolRoot = freshRoot();
  fs.unlinkSync(path.join(missingPoolRoot, 'telemetry', 'agents', 'agent-pool.yaml'));
  const noPool = validateSheet(missingPoolRoot, validDispatch());
  check('17h missing agent pool blocks before confirmation',
    noPool.status === 2 && /agent pool is required before confirmation/.test(noPool.stderr),
    noPool.stderr);
}

console.log('\n[18] predicted-disagreement evidence is complete and digest-owned');
{
  const root = freshRoot();
  const base = validateSheet(root, validDispatch());
  check('18a n=2 with exactly one canonical pair passes readiness',
    base.status === 0, base.stderr || base.stdout);

  const three = validDispatch({ dispatch_id: '2026-06-12-battery-three-pairs' });
  three.groups[0].n = 3;
  three.groups[0].agents.push({
    agent_name: 'Bourbaki, Nicolas',
    role: 'explorer',
    model: 'm',
    token_budget: 1,
    angle: 'historical reconstruction side',
    initial_prompt: 'Explore historical evidence.',
  });
  three.groups[0].predicted_disagreements = [
    { pair: [0, 1], statement: 'Static reading and dynamic probing disagree on the methodology axis.' },
    { pair: [0, 2], statement: 'Static reading and historical reconstruction disagree on the methodology axis.' },
    { pair: [1, 2], statement: 'Dynamic probing and historical reconstruction disagree on the methodology axis.' },
  ];
  const threeResult = validateSheet(root, three);
  check('18b n=3 requires and accepts exactly three canonical pairs',
    threeResult.status === 0, threeResult.stderr || threeResult.stdout);

  const missing = validDispatch({ dispatch_id: '2026-06-12-battery-missing-pair-evidence' });
  delete missing.groups[0].predicted_disagreements;
  const strategyCompanion = path.join(root, 'STRATEGY.md');
  fs.writeFileSync(strategyCompanion, 'The missing predicted disagreement sentence exists only here.\n');
  const missingResult = validateSheet(root, missing);
  check('18c companion prose cannot rescue missing digest-owned pair evidence',
    missingResult.status === 2 && /predicted_disagreements is required/.test(missingResult.stderr),
    missingResult.stderr);

  const duplicate = validDispatch({ dispatch_id: '2026-06-12-battery-duplicate-pair' });
  duplicate.groups[0].predicted_disagreements.push({
    pair: [0, 1],
    statement: 'Duplicate pair statement.',
  });
  const duplicateResult = validateSheet(root, duplicate);
  check('18d duplicate pair rejected before confirmation',
    duplicateResult.status === 2 && /duplicates another predicted-disagreement pair/.test(duplicateResult.stderr),
    duplicateResult.stderr);

  for (const [name, pair, pattern] of [
    ['reversed', [1, 0], /canonical unordered form/],
    ['self', [0, 0], /canonical unordered form/],
    ['out-of-range', [0, 2], /indexes must be in range/],
  ]) {
    const record = validDispatch({ dispatch_id: `2026-06-12-battery-${name}-pair` });
    record.groups[0].predicted_disagreements[0].pair = pair;
    const result = validateSheet(root, record);
    check(`18 ${name} pair rejected before confirmation`,
      result.status === 2 && pattern.test(result.stderr), result.stderr);
  }

  const empty = validDispatch({ dispatch_id: '2026-06-12-battery-empty-pair-statement' });
  empty.groups[0].predicted_disagreements[0].statement = ' ';
  const emptyResult = validateSheet(root, empty);
  check('18h empty pair statement rejected before confirmation',
    emptyResult.status === 2 && /statement is required/.test(emptyResult.stderr),
    emptyResult.stderr);
}

console.log('\n[19] profile-driven private registration consumes only its run-local envelope');
{
  const root = freshRoot();
  const record = validDispatch({ dispatch_id: '2026-08-27-profile-registration' });
  const result = runRegistrationEnvelope(root, record);
  const ledger = readLedger(root);
  check('19a valid material-bound registration envelope appends',
    result.status === 0 && /RUNTIME_RECEIPT=/.test(result.stdout), result.stderr || result.stdout);
  check('19b registration envelope is consumed after durable append',
    !result.envelopeExists, result.stderr || result.stdout);
  check('19c durable source sheet is preserved', result.sourceExists, result.stderr || result.stdout);
  check('19d normalized ledger row binds profile, source, admission, and projection',
    /profile_id: "domainspec\.subagent-strategy\.private\.v1"/.test(ledger) &&
      /source_lifecycle: "durable"/.test(ledger) &&
      /registration_envelope_sha256: "[0-9a-f]{64}"/.test(ledger) &&
      /execution_projection_sha256: "a{64}"/.test(ledger),
    ledger);

  const invalidRoot = freshRoot();
  const invalid = validDispatch({ dispatch_id: '2026-08-27-profile-registration-invalid' });
  const rejected = runRegistrationEnvelope(invalidRoot, invalid, (envelope) => {
    envelope.profile_id = 'wrong.profile';
  });
  check('19e invalid envelope fails closed and remains available for diagnosis',
    rejected.status === 2 && rejected.envelopeExists && rejected.sourceExists &&
      /profile_id/.test(rejected.stderr), rejected.stderr || rejected.stdout);
  const closed = runProfileClose(root, validClose({ close_of: record.dispatch_id }));
  check('19f profile close consumes its run-local close record through the shared runtime',
    closed.status === 0 && !closed.closeExists && /temporary_close_consumed/.test(closed.stdout),
    closed.stderr || closed.stdout);
  check('19g profile close appends exactly after the registered dispatch row',
    /^  - close_of: "2026-08-27-profile-registration"$/m.test(readLedger(root)) &&
      /temporary_close: "telemetry\/agents\/runtime\/subagents-strategy\/2026-08-27-profile-registration\.close\.tmp\.json"/.test(readLedger(root)),
    readLedger(root));

  const directRoot = freshRoot();
  const direct = runDirectCurrent(
    directRoot,
    validDispatch({ dispatch_id: '2026-08-27-profile-direct-current' }),
  );
  check('19h direct current registration is rejected without ledger mutation',
    direct.status === 2 && /must consume a run-local registration envelope/.test(direct.stderr) &&
      readLedger(directRoot) === '',
    direct.stderr || readLedger(directRoot));

  const profilePath = path.join(
    root,
    'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-profile.json',
  );
  const runtimePath = path.join(root, BASE_CONSUMERS.strategy_runtime_engine);
  const history = spawnSync(
    process.execPath,
    [runtimePath, 'check-history', '--profile', profilePath],
    {
      cwd: root,
      env: Object.assign({}, process.env, { ARCANUM_PROJECT_DIR: root }),
      encoding: 'utf8',
    },
  );
  check('19i shared runtime check-history validates the private profile ledger',
    history.status === 0 && /"mode":"check-history"/.test(history.stdout) &&
      /"dispatch_row_count":1/.test(history.stdout) && /"close_row_count":1/.test(history.stdout),
    history.stderr || history.stdout);

  const readinessRecord = validNoSubjectDispatch({ dispatch_id: '2026-08-27-profile-readiness' });
  const readinessPath = path.join(root, 'profile-readiness.json');
  fs.writeFileSync(readinessPath, `${JSON.stringify(readinessRecord, null, 2)}\n`);
  const readiness = spawnSync(
    process.execPath,
    [runtimePath, 'readiness', readinessPath, '--profile', profilePath],
    {
      cwd: root,
      env: Object.assign({}, process.env, { ARCANUM_PROJECT_DIR: root }),
      encoding: 'utf8',
    },
  );
  check('19j shared runtime readiness invokes the private adapter operation',
    readiness.status === 0 && /SHEET_VALIDATION=pass/.test(readiness.stdout) &&
      /"mode":"readiness"/.test(readiness.stdout),
    readiness.stderr || readiness.stdout);

  const wrongCloseRecord = validClose({ close_of: '2026-08-27-profile-wrong-close' });
  const wrongRegistration = validDispatch({ dispatch_id: wrongCloseRecord.close_of });
  const wrongRegistered = runRegistrationEnvelope(root, wrongRegistration);
  const wrongClosePath = path.join(root, 'telemetry/agents/runtime/subagents-strategy/not-the-registered.close.tmp.json');
  fs.writeFileSync(wrongClosePath, `${JSON.stringify(wrongCloseRecord, null, 2)}\n`);
  const wrongClose = spawnSync(
    process.execPath,
    [runtimePath, 'close', wrongClosePath, '--profile', profilePath],
    {
      cwd: root,
      env: Object.assign({}, process.env, { ARCANUM_PROJECT_DIR: root }),
      encoding: 'utf8',
    },
  );
  check('19k close consumption is bound to the exact registered temporary path',
    wrongRegistered.status === 0 && wrongClose.status !== 0 && fs.existsSync(wrongClosePath) &&
      /does not match registered temporary_close/.test(wrongClose.stderr),
    wrongClose.stderr || wrongClose.stdout);
}

// ---------------------------------------------------------------- summary
for (const d of roots) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) { /* best effort */ } }
console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped`);
if (failures.length) { console.log('failing cases:\n  - ' + failures.join('\n  - ')); process.exit(1); }
process.exit(0);
