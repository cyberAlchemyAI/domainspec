#!/usr/bin/env node
'use strict';

const assert = require('assert');
const {
  materialProjection,
  project,
} = require('../skills/domainspec-subagents-strategy/material-strategy.cjs');

let assertions = 0;
function check(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

const base = {
  dispatch_id: '2026-08-02-example',
  schema_version: '0.9.0',
  dispatch_type: 'review',
  goal: 'Review one artifact.',
  context: 'Use only the named local evidence.',
  max_loops: 1,
  final_approver: 'parent',
  working_folder: 'ops/example/',
  groups: [{
    group_id: 'reviewers',
    n: 2,
    anti_bias: 'methodology',
    predicted_disagreements: [{ pair: [0, 1], statement: 'Formal versus adversarial.' }],
    agents: [
      { agent_name: null, role: 'explorer', model: 'm', token_budget: 100, angle: 'formal', initial_prompt: 'Map structure.' },
      { agent_name: null, role: 'explorer', model: 'm', token_budget: 100, angle: 'adversarial', initial_prompt: 'Attack structure.' },
    ],
  }],
  connections: [],
};

const baseline = project(base);
const mechanical = {
  connections: [],
  groups: [{ ...base.groups[0], n: 2 }],
  working_folder: base.working_folder,
  final_approver: base.final_approver,
  max_loops: base.max_loops,
  context: base.context,
  goal: base.goal,
  dispatch_type: base.dispatch_type,
  schema_version: base.schema_version,
  dispatch_id: '2026-08-02-renamed-machine-id',
  invoked_by: 'operator@example.invalid',
};

check(
  project(mechanical).material_sha256 === baseline.material_sha256,
  'key order, dispatch id, invoked_by, and derived n must be mechanical',
);

const registered = JSON.parse(JSON.stringify(base));
registered.evidence_binding = {
  sheet_path: 'ops/example/dispatch-sheet.json',
  sheet_sha256: 'a'.repeat(64),
  tension_verdicts: [],
  confirmation: {},
};
check(
  project(registered).material_sha256 === baseline.material_sha256,
  'machine evidence binding must be mechanical',
);

const changedGoal = JSON.parse(JSON.stringify(base));
changedGoal.goal = 'Review and rewrite one artifact.';
check(
  project(changedGoal).material_sha256 !== baseline.material_sha256,
  'goal change must be material',
);

const changedPrompt = JSON.parse(JSON.stringify(base));
changedPrompt.groups[0].agents[0].initial_prompt = 'Map and edit structure.';
check(
  project(changedPrompt).material_sha256 !== baseline.material_sha256,
  'agent prompt change must be material',
);

const experiment = {
  ...base,
  dispatch_type: 'experiment',
  experiment_contract: {
    phase: 'run',
    proposal_dispatch_id: '2026-08-27-example-propose',
    criterion_ref: { path: 'ops/example/CRITERION.md', sha256: 'a'.repeat(64), size: 100 },
    experiment_output_path: 'experiment.md',
    findings_output_path: 'findings.md',
    adjudication: {
      mode: 'parent_mechanical',
      rule_locator: 'ops/example/CRITERION.md#mechanical-verdict-rule',
    },
  },
};
const experimentProjection = project(experiment);
check(
  experimentProjection.projection_schema === 'domainspec.material-strategy.v3',
  'phased experiment material uses the explicit v3 projection schema',
);

const successor = JSON.parse(JSON.stringify(experiment));
successor.schema_version = '0.10.0';
successor.experiment_contract.criterion_package = {
  source_ref: { path: 'ops/example/CRITERION.json', sha256: '0'.repeat(64), size: 11 },
  schema_ref: { path: 'ops/example/criterion.schema.json', sha256: '1'.repeat(64), size: 10 },
  renderer_ref: { path: 'ops/example/render.py', sha256: '2'.repeat(64), size: 20 },
  generated_view_ref: { path: 'ops/example/CRITERION.md', sha256: '3'.repeat(64), size: 30 },
  protocol_ref: { path: 'ops/example/PROTOCOL.md', sha256: '4'.repeat(64), size: 40 },
  guide_manifest_ref: { path: 'ops/example/GUIDE-MANIFEST.json', sha256: '5'.repeat(64), size: 50 },
  criterion_validator_ref: { path: 'ops/example/validate.py', sha256: '6'.repeat(64), size: 60 },
  guide_equivalence_validator_ref: { path: 'ops/example/verify.py', sha256: '7'.repeat(64), size: 70 },
};
successor.experiment_contract.execution_dispatch_ref = {
  path: 'ops/example/execution.dispatch.json', sha256: '8'.repeat(64), size: 80,
};
successor.experiment_contract.execution_briefings_ref = {
  path: 'ops/example/execution-briefings.json', sha256: '9'.repeat(64), size: 90,
};
successor.experiment_contract.pre_freeze_obligations = [{
  obligation_id: 'guide-equivalence',
  execution_role_id: 'guide-auditor',
  receipt_ref: 'receipts/guide.json',
  gate_id: 'g-wave-1',
  required_read_scopes: ['ops/example/guides/'],
  independent_of_role_ids: ['criterion-designer'],
}];
const successorProjection = project(successor);
for (const [label, mutate] of [
  ['criterion schema digest', (value) => { value.experiment_contract.criterion_package.schema_ref.sha256 = 'a'.repeat(64); }],
  ['execution dispatch digest', (value) => { value.experiment_contract.execution_dispatch_ref.sha256 = 'b'.repeat(64); }],
  ['obligation owner', (value) => { value.experiment_contract.pre_freeze_obligations[0].execution_role_id = 'designer'; }],
  ['obligation read scope', (value) => { value.experiment_contract.pre_freeze_obligations[0].required_read_scopes.push('ops/example/oracle/'); }],
]) {
  const changed = JSON.parse(JSON.stringify(successor));
  mutate(changed);
  check(
    project(changed).material_sha256 !== successorProjection.material_sha256,
    `successor ${label} change must be material`,
  );
}
for (const [label, mutate] of [
  ['phase', (value) => { value.experiment_contract.phase = 'propose'; }],
  ['proposal id', (value) => { value.experiment_contract.proposal_dispatch_id += '-changed'; }],
  ['criterion digest', (value) => { value.experiment_contract.criterion_ref.sha256 = 'b'.repeat(64); }],
  ['criterion size', (value) => { value.experiment_contract.criterion_ref.size += 1; }],
  ['output path', (value) => { value.experiment_contract.findings_output_path = 'other.md'; }],
  ['adjudication mode', (value) => { value.experiment_contract.adjudication.mode = 'auditor'; }],
  ['rule locator', (value) => { value.experiment_contract.adjudication.rule_locator += '-changed'; }],
]) {
  const changed = JSON.parse(JSON.stringify(experiment));
  mutate(changed);
  check(
    project(changed).material_sha256 !== experimentProjection.material_sha256,
    `experiment ${label} change must be material`,
  );
}

let unknownFailed = false;
try {
  materialProjection({ ...base, undeclared: true });
} catch (error) {
  unknownFailed = /unknown field/.test(error.message);
}
check(unknownFailed, 'unknown fields must fail closed');

console.log(`PASS material strategy fixtures (${assertions}/${assertions})`);
