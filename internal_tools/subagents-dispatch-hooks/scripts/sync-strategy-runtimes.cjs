#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../../../../..');
const DEFAULT_MANIFEST = path.join(
  DEFAULT_REPO_ROOT,
  'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-composition.json',
);

function parseFrontmatter(text, label) {
  const normalized = text.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error(`${label}: missing YAML frontmatter`);
  }
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) throw new Error(`${label}: unterminated YAML frontmatter`);
  const raw = normalized.slice(4, end);
  const fields = {};
  for (const line of raw.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) throw new Error(`${label}: unsupported frontmatter line: ${line}`);
    fields[match[1]] = match[2].trim();
  }
  return { fields, body: normalized.slice(end + 5) };
}

function normalizeScalar(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizeBody(body) {
  return body
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapAllowedTools(value, toolNameMap) {
  if (!value) return value;
  const mapped = value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => toolNameMap[token] || token);
  return [...new Set(mapped)].join(', ');
}

function comparableSource(sourceText, toolNameMap = {}) {
  const parsed = parseFrontmatter(sourceText, 'source');
  const fields = {};
  for (const [key, value] of Object.entries(parsed.fields)) {
    fields[key] = normalizeScalar(
      key === 'allowed-tools' ? mapAllowedTools(value, toolNameMap) : value,
    );
  }
  return { fields, body: normalizeBody(parsed.body) };
}

function comparableRuntime(runtimeText, manifest, toolNameMap = {}) {
  const parsed = parseFrontmatter(runtimeText, 'runtime');
  const allowed = new Set(manifest.allowed_generated_metadata);
  const fields = {};
  const metadata = {};
  for (const [key, value] of Object.entries(parsed.fields)) {
    if (allowed.has(key)) metadata[key] = normalizeScalar(value);
    else {
      fields[key] = normalizeScalar(
        key === 'allowed-tools' ? mapAllowedTools(value, {}) : value,
      );
    }
  }
  return { fields, metadata, body: normalizeBody(parsed.body) };
}

function stableObject(value) {
  return JSON.stringify(
    Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))),
  );
}

function assertRules(text, rules, label, errors) {
  const normalizedText = normalizeBody(text);
  for (const [ruleId, requiredText] of Object.entries(rules || {})) {
    if (!normalizedText.includes(normalizeBody(requiredText))) {
      errors.push(`${label}: missing protected rule ${ruleId}`);
    }
  }
}

function expectedMetadata(manifest, runtime, kind) {
  const publicBase = manifest.public_base;
  const localOverlay = manifest.local_overlay;
  const result = {
    surface_kind: 'generated-native-runtime-package',
    runtime,
    canonical_source: publicBase.source.replace(/^arcanum\//, ''),
    alias_of: 'null',
    generated_by:
      kind === 'public'
        ? 'tools/bootstrap_arcanum.sh --profile'
        : localOverlay.generated_by,
    mutation_policy: 'regenerate-from-canonical-source',
  };
  if (kind === 'overlay') result.overlay_source = localOverlay.source;
  return result;
}

function validateOne({ repoRoot, manifest, runtime, kind, runtimeTextOverride }) {
  const config = manifest.runtimes[runtime];
  if (!config) return [`unknown runtime ${runtime}`];
  const contract = kind === 'public' ? manifest.public_base : manifest.local_overlay;
  const sourcePath = path.join(repoRoot, contract.source);
  const runtimePath = path.join(repoRoot, config.root, contract.runtime_package, 'SKILL.md');
  const errors = [];
  if (!fs.existsSync(sourcePath)) return [`${kind}/${runtime}: missing source ${contract.source}`];
  if (!fs.existsSync(runtimePath) && runtimeTextOverride === undefined) {
    return [`${kind}/${runtime}: missing runtime ${path.relative(repoRoot, runtimePath)}`];
  }

  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const runtimeText =
    runtimeTextOverride === undefined ? fs.readFileSync(runtimePath, 'utf8') : runtimeTextOverride;
  const source = comparableSource(sourceText, config.tool_name_map);
  let installed;
  try {
    installed = comparableRuntime(runtimeText, manifest, config.tool_name_map);
  } catch (error) {
    return [`${kind}/${runtime}: ${error.message}`];
  }

  assertRules(sourceText, contract.required_rules, `${kind} source`, errors);
  assertRules(runtimeText, contract.required_rules, `${kind}/${runtime}`, errors);

  if (stableObject(source.fields) !== stableObject(installed.fields)) {
    errors.push(`${kind}/${runtime}: canonical frontmatter semantics differ`);
  }
  if (source.body !== installed.body) {
    errors.push(`${kind}/${runtime}: undeclared semantic body drift`);
  }

  const expected = expectedMetadata(manifest, runtime, kind);
  if (stableObject(expected) !== stableObject(installed.metadata)) {
    errors.push(`${kind}/${runtime}: generated metadata differs from manifest`);
  }
  return errors;
}

function renderOverlayRuntime({ repoRoot, manifest, runtime }) {
  const config = manifest.runtimes[runtime];
  const sourcePath = path.join(repoRoot, manifest.local_overlay.source);
  const parsed = parseFrontmatter(fs.readFileSync(sourcePath, 'utf8'), 'local overlay source');
  const metadata = expectedMetadata(manifest, runtime, 'overlay');
  const sourceLines = [];
  for (const [key, rawValue] of Object.entries(parsed.fields)) {
    const value =
      key === 'allowed-tools' ? mapAllowedTools(rawValue, config.tool_name_map) : rawValue;
    sourceLines.push(`${key}: ${value}`);
  }
  const metadataLines = Object.entries(metadata).map(([key, value]) => `${key}: ${value}`);
  return `---\n${metadataLines.join('\n')}\n${sourceLines.join('\n')}\n---\n${parsed.body}`;
}

function syncOverlay({ repoRoot, manifest, runtime }) {
  if (!manifest.runtimes[runtime].local_overlay) {
    throw new Error(`${runtime}: private overlay is not a declared runtime target`);
  }
  const output = renderOverlayRuntime({ repoRoot, manifest, runtime });
  const target = path.join(
    repoRoot,
    manifest.runtimes[runtime].root,
    manifest.local_overlay.runtime_package,
    'SKILL.md',
  );
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
  return path.relative(repoRoot, target);
}

function loadManifest(manifestPath = DEFAULT_MANIFEST) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.schema_version !== 'domainspec.strategy-runtime-composition.v1') {
    throw new Error(`unsupported composition schema: ${manifest.schema_version}`);
  }
  return manifest;
}

function validateAll({ repoRoot = DEFAULT_REPO_ROOT, manifest, runtimes }) {
  const errors = [];
  for (const runtime of runtimes) {
    errors.push(...validateOne({ repoRoot, manifest, runtime, kind: 'public' }));
    if (manifest.runtimes[runtime].local_overlay) {
      errors.push(...validateOne({ repoRoot, manifest, runtime, kind: 'overlay' }));
    }
  }
  return errors;
}

function parseArgs(argv) {
  const options = {
    repoRoot: DEFAULT_REPO_ROOT,
    manifestPath: DEFAULT_MANIFEST,
    runtimes: ['codex', 'claude'],
    sync: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--sync') options.sync = true;
    else if (arg === '--check') options.sync = false;
    else if (arg === '--target') options.repoRoot = path.resolve(argv[++i]);
    else if (arg === '--manifest') options.manifestPath = path.resolve(argv[++i]);
    else if (arg === '--runtime') {
      const value = argv[++i];
      options.runtimes = value === 'all' ? ['codex', 'claude'] : [value];
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = loadManifest(options.manifestPath);
  for (const runtime of options.runtimes) {
    if (!manifest.runtimes[runtime]) throw new Error(`unknown runtime: ${runtime}`);
  }

  if (options.sync) {
    const publicErrors = [];
    for (const runtime of options.runtimes) {
      publicErrors.push(
        ...validateOne({
          repoRoot: options.repoRoot,
          manifest,
          runtime,
          kind: 'public',
        }),
      );
    }
    if (publicErrors.length) {
      for (const error of publicErrors) console.error(`BLOCK: ${error}`);
      process.exit(1);
    }
    for (const runtime of options.runtimes.filter(
      (candidate) => manifest.runtimes[candidate].local_overlay,
    )) {
      console.log(`synced ${syncOverlay({ repoRoot: options.repoRoot, manifest, runtime })}`);
    }
  }

  const errors = validateAll({
    repoRoot: options.repoRoot,
    manifest,
    runtimes: options.runtimes,
  });
  if (errors.length) {
    for (const error of errors) console.error(`FAIL: ${error}`);
    process.exit(1);
  }
  console.log(
    `PASS strategy runtime composition (${options.runtimes.join(', ')}; public base + declared private overlay)`,
  );
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  comparableRuntime,
  comparableSource,
  loadManifest,
  normalizeBody,
  parseFrontmatter,
  renderOverlayRuntime,
  syncOverlay,
  validateAll,
  validateOne,
};
