#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TOP_LEVEL_KEYS = new Set([
  'dispatch_id', 'schema_version', 'dispatch_type', 'goal', 'context',
  'max_loops', 'final_approver', 'groups', 'meta', 'parent_dispatch_id',
  'anti_bias_global', 'working_folder', 'invoked_by', 'connections',
  'experiment_contract', 'other_contract', 'evidence_binding', 'project_dir',
]);
const GROUP_KEYS = new Set([
  'group_id', 'agents', 'n', 'robot_talks', 'layers', 'anti_bias',
  'predicted_disagreements',
]);
const AGENT_KEYS = new Set([
  'role', 'model', 'token_budget', 'initial_prompt', 'agent_name', 'angle',
]);
const DISAGREEMENT_KEYS = new Set(['pair', 'statement']);
const CONNECTION_KEYS = new Set(['from', 'to', 'type', 'loop_cap']);
const EXPERIMENT_CONTRACT_KEYS = new Set([
  'phase', 'criterion_output_path', 'proposal_dispatch_id', 'criterion_ref',
  'experiment_output_path', 'findings_output_path', 'adjudication',
  'criterion_package', 'pre_freeze_obligations', 'execution_dispatch_ref',
  'execution_briefings_ref',
]);
const EXACT_REF_KEYS = new Set(['path', 'sha256', 'size']);
const ADJUDICATION_KEYS = new Set(['mode', 'rule_locator']);
const CRITERION_PACKAGE_KEYS = new Set([
  'source_ref', 'schema_ref', 'renderer_ref', 'generated_view_ref', 'protocol_ref',
  'guide_manifest_ref', 'criterion_validator_ref',
  'guide_equivalence_validator_ref',
]);
const OBLIGATION_KEYS = new Set([
  'obligation_id', 'execution_role_id', 'receipt_ref', 'gate_id',
  'required_read_scopes', 'independent_of_role_ids',
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

function failUnknown(object, allowed, label) {
  if (!object || typeof object !== 'object' || Array.isArray(object)) {
    throw new Error(`${label} must be an object`);
  }
  for (const key of Object.keys(object)) {
    if (!allowed.has(key)) throw new Error(`${label}: unknown field ${JSON.stringify(key)}`);
  }
}

function pickDefined(object, keys) {
  const out = {};
  for (const key of keys) {
    if (object[key] !== undefined) out[key] = object[key];
  }
  return out;
}

function projectExperimentContract(contract) {
  failUnknown(contract, EXPERIMENT_CONTRACT_KEYS, 'experiment_contract');
  const projected = pickDefined(contract, [
    'phase', 'criterion_output_path', 'proposal_dispatch_id',
    'experiment_output_path', 'findings_output_path',
  ]);
  if (contract.criterion_ref !== undefined) {
    failUnknown(contract.criterion_ref, EXACT_REF_KEYS, 'experiment_contract.criterion_ref');
    projected.criterion_ref = pickDefined(contract.criterion_ref, ['path', 'sha256', 'size']);
  }
  if (contract.adjudication !== undefined) {
    failUnknown(contract.adjudication, ADJUDICATION_KEYS, 'experiment_contract.adjudication');
    projected.adjudication = pickDefined(contract.adjudication, ['mode', 'rule_locator']);
  }
  if (contract.criterion_package !== undefined) {
    failUnknown(contract.criterion_package, CRITERION_PACKAGE_KEYS, 'experiment_contract.criterion_package');
    projected.criterion_package = {};
    for (const key of CRITERION_PACKAGE_KEYS) {
      if (contract.criterion_package[key] === undefined) continue;
      failUnknown(
        contract.criterion_package[key],
        EXACT_REF_KEYS,
        `experiment_contract.criterion_package.${key}`,
      );
      projected.criterion_package[key] = pickDefined(
        contract.criterion_package[key],
        ['path', 'sha256', 'size'],
      );
    }
  }
  for (const key of ['execution_dispatch_ref', 'execution_briefings_ref']) {
    if (contract[key] === undefined) continue;
    failUnknown(contract[key], EXACT_REF_KEYS, `experiment_contract.${key}`);
    projected[key] = pickDefined(contract[key], ['path', 'sha256', 'size']);
  }
  if (contract.pre_freeze_obligations !== undefined) {
    if (!Array.isArray(contract.pre_freeze_obligations)) {
      throw new Error('experiment_contract.pre_freeze_obligations must be an array');
    }
    projected.pre_freeze_obligations = contract.pre_freeze_obligations.map((item, index) => {
      failUnknown(item, OBLIGATION_KEYS, `experiment_contract.pre_freeze_obligations[${index}]`);
      return pickDefined(item, [
        'obligation_id', 'execution_role_id', 'receipt_ref', 'gate_id',
        'required_read_scopes', 'independent_of_role_ids',
      ]);
    });
  }
  return projected;
}

function projectOtherContract(contract) {
  failUnknown(contract, OTHER_CONTRACT_KEYS, 'other_contract');
  const projected = pickDefined(contract, [
    'owner_capability', 'targets', 'allowed_mutations', 'forbidden_mutations',
    'validation_commands', 'expected_result', 'stop_conditions',
  ]);
  if (contract.source_refs !== undefined) {
    if (!Array.isArray(contract.source_refs)) throw new Error('other_contract.source_refs must be an array');
    projected.source_refs = contract.source_refs.map((ref, index) => {
      failUnknown(ref, EXACT_REF_KEYS, `other_contract.source_refs[${index}]`);
      return pickDefined(ref, ['path', 'sha256', 'size']);
    });
  }
  if (contract.lanes !== undefined) {
    if (!Array.isArray(contract.lanes)) throw new Error('other_contract.lanes must be an array');
    projected.lanes = contract.lanes.map((lane, index) => {
      failUnknown(lane, OTHER_LANE_KEYS, `other_contract.lanes[${index}]`);
      return pickDefined(lane, [
        'lane_id', 'writer_group_id', 'reviewer_group_id', 'target_paths',
        'connection_type',
      ]);
    });
  }
  return projected;
}

function materialProjection(sheet) {
  failUnknown(sheet, TOP_LEVEL_KEYS, 'sheet');
  if (!Array.isArray(sheet.groups)) throw new Error('sheet.groups must be an array');

  const groups = sheet.groups.map((group, groupIndex) => {
    failUnknown(group, GROUP_KEYS, `groups[${groupIndex}]`);
    if (!Array.isArray(group.agents)) {
      throw new Error(`groups[${groupIndex}].agents must be an array`);
    }
    const agents = group.agents.map((agent, agentIndex) => {
      failUnknown(agent, AGENT_KEYS, `groups[${groupIndex}].agents[${agentIndex}]`);
      return pickDefined(agent, [
        'agent_name', 'role', 'model', 'token_budget', 'angle', 'initial_prompt',
      ]);
    });

    let disagreements;
    if (group.predicted_disagreements !== undefined) {
      if (!Array.isArray(group.predicted_disagreements)) {
        throw new Error(`groups[${groupIndex}].predicted_disagreements must be an array`);
      }
      disagreements = group.predicted_disagreements.map((item, itemIndex) => {
        failUnknown(
          item,
          DISAGREEMENT_KEYS,
          `groups[${groupIndex}].predicted_disagreements[${itemIndex}]`,
        );
        return pickDefined(item, ['pair', 'statement']);
      });
    }

    return {
      ...pickDefined(group, ['group_id', 'robot_talks', 'layers', 'anti_bias']),
      ...(disagreements === undefined ? {} : { predicted_disagreements: disagreements }),
      agents,
    };
  });

  let connections;
  if (sheet.connections !== undefined) {
    if (!Array.isArray(sheet.connections)) throw new Error('sheet.connections must be an array');
    connections = sheet.connections.map((connection, index) => {
      failUnknown(connection, CONNECTION_KEYS, `connections[${index}]`);
      return pickDefined(connection, ['from', 'to', 'type', 'loop_cap']);
    });
  }

  return {
    ...pickDefined(sheet, [
      'dispatch_type', 'goal', 'context', 'max_loops', 'final_approver',
      'meta', 'parent_dispatch_id', 'anti_bias_global', 'working_folder',
    ]),
    ...(sheet.experiment_contract === undefined
      ? {}
      : { experiment_contract: projectExperimentContract(sheet.experiment_contract) }),
    ...(sheet.other_contract === undefined
      ? {}
      : { other_contract: projectOtherContract(sheet.other_contract) }),
    groups,
    ...(connections === undefined ? {} : { connections }),
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(canonicalize(value));
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function project(sheet) {
  const material = materialProjection(sheet);
  return {
    projection_schema: 'domainspec.material-strategy.v3',
    material_sha256: sha256(stableJson(material)),
    material,
  };
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
}

function projectionFromFile(file) {
  const value = loadJson(file);
  if (value && [
    'domainspec.material-strategy.v1',
    'domainspec.material-strategy.v2',
    'domainspec.material-strategy.v3',
  ].includes(value.projection_schema)) {
    if (!value.material || typeof value.material !== 'object') {
      throw new Error(`${file}: projection is missing material`);
    }
    const recalculated = project(value.material);
    if (value.material_sha256 !== recalculated.material_sha256) {
      throw new Error(`${file}: material_sha256 does not match projection content`);
    }
    return recalculated;
  }
  return project(value);
}

function usage() {
  return [
    'Usage:',
    '  material-strategy.cjs --project <dispatch-sheet.json>',
    '  material-strategy.cjs --compare <prior-projection-or-sheet.json> <current-sheet.json>',
  ].join('\n');
}

function main(argv) {
  if (argv[0] === '--project' && argv.length === 2) {
    process.stdout.write(`${JSON.stringify(projectionFromFile(argv[1]), null, 2)}\n`);
    return 0;
  }
  if (argv[0] === '--compare' && argv.length === 3) {
    const prior = projectionFromFile(argv[1]);
    const current = projectionFromFile(argv[2]);
    const equivalent = prior.material_sha256 === current.material_sha256;
    process.stdout.write(`${JSON.stringify({
      equivalence: equivalent ? 'same' : 'changed',
      prior_material_sha256: prior.material_sha256,
      current_material_sha256: current.material_sha256,
    }, null, 2)}\n`);
    return equivalent ? 0 : 2;
  }
  process.stderr.write(`${usage()}\n`);
  return 1;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`MATERIAL_EQUIVALENCE=unknown\n${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { canonicalize, materialProjection, project, stableJson };
