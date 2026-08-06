#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TOP_LEVEL_KEYS = new Set([
  'dispatch_id', 'schema_version', 'dispatch_type', 'goal', 'context',
  'max_loops', 'final_approver', 'groups', 'meta', 'parent_dispatch_id',
  'anti_bias_global', 'working_folder', 'invoked_by', 'connections',
  'evidence_binding', 'project_dir',
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
    projection_schema: 'domainspec.material-strategy.v1',
    material_sha256: sha256(stableJson(material)),
    material,
  };
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
}

function projectionFromFile(file) {
  const value = loadJson(file);
  if (value && value.projection_schema === 'domainspec.material-strategy.v1') {
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
