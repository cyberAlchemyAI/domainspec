#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  loadManifest,
  renderOverlayRuntime,
  validateAll,
  validateOne,
} = require('../scripts/sync-strategy-runtimes.cjs');

const repoRoot = path.resolve(__dirname, '../../../../..');
const manifestPath = path.join(
  repoRoot,
  'implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-composition.json',
);
const manifest = loadManifest(manifestPath);
let assertions = 0;

function check(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

function runtimeText(runtime, kind) {
  const contract = kind === 'public' ? manifest.public_base : manifest.local_overlay;
  return fs.readFileSync(
    path.join(repoRoot, manifest.runtimes[runtime].root, contract.runtime_package, 'SKILL.md'),
    'utf8',
  );
}

function errorsFor(runtime, kind, text) {
  return validateOne({
    repoRoot,
    manifest,
    runtime,
    kind,
    runtimeTextOverride: text,
  });
}

function replaceAcrossWhitespace(text, phrase, replacement) {
  const pattern = phrase
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s+');
  return text.replace(new RegExp(pattern), replacement);
}

const baseline = validateAll({ repoRoot, manifest, runtimes: ['codex', 'claude'] });
check(baseline.length === 0, `checked-in composition must pass: ${baseline.join('; ')}`);

for (const runtime of ['codex', 'claude']) {
  const publicText = runtimeText(runtime, 'public');

  const lifecycleRemoval = replaceAcrossWhitespace(
    publicText,
    'govern every real dispatch through a tensioned proposal, explicit human confirmation, deterministic registration, dependency-aware execution, complete closeout',
    'govern dispatches',
  );
  check(
    errorsFor(runtime, 'public', lifecycleRemoval).some((error) =>
      error.includes('missing protected rule lifecycle'),
    ),
    `${runtime}: lifecycle removal must fail`,
  );

  const lifecycleAddition = publicText.replace(
    '<process>',
    '<process>\n0. Working agents may launch before registration.',
  );
  check(
    errorsFor(runtime, 'public', lifecycleAddition).some((error) =>
      error.includes('undeclared semantic body drift'),
    ),
    `${runtime}: undeclared lifecycle addition must fail`,
  );
}

const overlayRuntime = 'claude';
const overlayText = runtimeText(overlayRuntime, 'overlay');

const ownerRemoval = replaceAcrossWhitespace(
  overlayText,
  'This adapter owns the DomainSpec constitution, type owners, form/schema, agent pool, registrar, ledger, Inventory policy, and local artifact paths.',
  'This adapter has local bindings.',
);
check(
  errorsFor(overlayRuntime, 'overlay', ownerRemoval).some((error) =>
    error.includes('missing protected rule owner'),
  ),
  'claude: local owner removal must fail',
);

const outputRemoval = replaceAcrossWhitespace(
  overlayText,
  'The writer writes `findings.md` only.',
  'The writer may choose an output.',
);
check(
  errorsFor(overlayRuntime, 'overlay', outputRemoval).some((error) =>
    error.includes('missing protected rule research_output'),
  ),
  'claude: research-output removal must fail',
);

const privacyRemoval = replaceAcrossWhitespace(
  overlayText,
  'Public/private boundary: when outputs land in public `arcanum`, do not write private parent paths, private submodule paths, emails, or workspace-only evidence into the public artifact.',
  'Use normal publication policy.',
);
check(
  errorsFor(overlayRuntime, 'overlay', privacyRemoval).some((error) =>
    error.includes('missing protected rule public_private'),
  ),
  'claude: public/private removal must fail',
);

const undeclaredOverlay = overlayText.replace(
  '## Pointers',
  '## Undeclared Authority\n\nThe runtime may promote dispatch types.\n\n## Pointers',
);
check(
  errorsFor(overlayRuntime, 'overlay', undeclaredOverlay).some((error) =>
    error.includes('undeclared semantic body drift'),
  ),
  'claude: undeclared overlay addition must fail',
);

const formattingOnly = overlayText
  .replace(/\n\n## Overview/, '\n\n\n## Overview')
  .replace('Use this skill when', 'Use this skill\nwhen');
check(
  errorsFor(overlayRuntime, 'overlay', formattingOnly).length === 0,
  'claude: formatting-only differences must pass',
);

const rendered = renderOverlayRuntime({ repoRoot, manifest, runtime: overlayRuntime });
check(
  errorsFor(overlayRuntime, 'overlay', rendered).length === 0,
  'claude: declared generated overlay must pass',
);

assert.throws(
  () =>
    require('../scripts/sync-strategy-runtimes.cjs').syncOverlay({
      repoRoot,
      manifest,
      runtime: 'codex',
    }),
  /not a declared runtime target/,
);
assertions += 1;

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'strategy-composition-'));
try {
  const missing = validateOne({
    repoRoot: tempRoot,
    manifest,
    runtime: 'claude',
    kind: 'overlay',
  });
  check(missing.some((error) => error.includes('missing source')), 'missing source must fail closed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log(`PASS strategy runtime composition fixtures (${assertions}/${assertions})`);
