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

  const readinessRemoval = replaceAcrossWhitespace(
    publicText,
    "Run the form owner's non-mutating confirmation-readiness validator against the exact persisted sheet.",
    'Ask the user before validation.',
  );
  check(
    errorsFor(runtime, 'public', readinessRemoval).some((error) =>
      error.includes('missing protected rule confirmation_readiness'),
    ),
    `${runtime}: confirmation-readiness removal must fail`,
  );

  const handoffRemoval = replaceAcrossWhitespace(
    publicText,
    'A gate may return `needs_feedback` only with a typed defect, repair-owner stage, eligible already-confirmed edge, and remaining loop capacity; otherwise it returns `blocked`.',
    'Existing output is ready.',
  );
  check(
    errorsFor(runtime, 'public', handoffRemoval).some((error) =>
      error.includes('missing protected rule stage_handoff_readiness'),
    ),
    `${runtime}: stage-handoff readiness removal must fail`,
  );
}

for (const overlayRuntime of ['codex', 'claude']) {
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
    `${overlayRuntime}: local owner removal must fail`,
  );

  const readinessRemoval = replaceAcrossWhitespace(
    overlayText,
    'Continue only when the command emits `SHEET_VALIDATION=pass`, `SCHEMA_VERSION=0.7.0`, the exact `SHEET_SHA256`, and `LEDGER_MUTATION=none`.',
    'Continue after drafting.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', readinessRemoval).some((error) =>
      error.includes('missing protected rule confirmation_readiness'),
    ),
    `${overlayRuntime}: local confirmation-readiness removal must fail`,
  );

  const handoffRemoval = replaceAcrossWhitespace(
    overlayText,
    'The gate may instead return `needs_feedback` with a typed repair owner and one eligible already-confirmed edge, or `blocked`.',
    'Continue when a file exists.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', handoffRemoval).some((error) =>
      error.includes('missing protected rule stage_handoff_readiness'),
    ),
    `${overlayRuntime}: local stage-handoff readiness removal must fail`,
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
    `${overlayRuntime}: research-output removal must fail`,
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
    `${overlayRuntime}: public/private removal must fail`,
  );

  const undeclaredOverlay = overlayText.replace(
    '## Pointers',
    '## Undeclared Authority\n\nThe runtime may promote dispatch types.\n\n## Pointers',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', undeclaredOverlay).some((error) =>
      error.includes('undeclared semantic body drift'),
    ),
    `${overlayRuntime}: undeclared overlay addition must fail`,
  );

  const formattingOnly = overlayText
    .replace(/\n\n## Overview/, '\n\n\n## Overview')
    .replace('Use this skill when', 'Use this skill\nwhen');
  check(
    errorsFor(overlayRuntime, 'overlay', formattingOnly).length === 0,
    `${overlayRuntime}: formatting-only differences must pass`,
  );

  const rendered = renderOverlayRuntime({ repoRoot, manifest, runtime: overlayRuntime });
  check(
    errorsFor(overlayRuntime, 'overlay', rendered).length === 0,
    `${overlayRuntime}: declared generated overlay must pass`,
  );
}

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
