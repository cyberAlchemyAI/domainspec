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
  schema_version: '0.8.0',
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

let unknownFailed = false;
try {
  materialProjection({ ...base, undeclared: true });
} catch (error) {
  unknownFailed = /unknown field/.test(error.message);
}
check(unknownFailed, 'unknown fields must fail closed');

console.log(`PASS material strategy fixtures (${assertions}/${assertions})`);
