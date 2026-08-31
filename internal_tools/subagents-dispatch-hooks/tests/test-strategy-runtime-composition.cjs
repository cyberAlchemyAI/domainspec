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
    "Run the form owner's non-mutating confirmation-readiness validator against the exact temporary sheet.",
    'Ask the user before validation.',
  );
  check(
    errorsFor(runtime, 'public', readinessRemoval).some((error) =>
      error.includes('missing protected rule confirmation_readiness'),
    ),
    `${runtime}: confirmation-readiness removal must fail`,
  );

  const compositeRemoval = replaceAcrossWhitespace(
    publicText,
    'Confirmation readiness is one composite checkpoint: form and version, live type-owner prerequisites, agent eligibility and identity uniqueness, final-approver admission, complete digest-owned tension evidence, configured publication boundaries, and any native runtime binding must all close before the human gate.',
    'Form syntax is enough.',
  );
  check(
    errorsFor(runtime, 'public', compositeRemoval).some((error) =>
      error.includes('missing protected rule composite_readiness'),
    ),
    `${runtime}: composite-readiness removal must fail`,
  );

  const boundaryRemoval = replaceAcrossWhitespace(
    publicText,
    'Run the configured tension gate against only the admitted sheet bytes and the gate rubric; companion files, parent summaries, and unstored chat context cannot satisfy the gate.',
    'Use all available context.',
  );
  check(
    errorsFor(runtime, 'public', boundaryRemoval).some((error) =>
      error.includes('missing protected rule tension_input_boundary'),
    ),
    `${runtime}: tension-input boundary removal must fail`,
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

  const humanGateRemoval = replaceAcrossWhitespace(
    publicText,
    'Human confirmation binds the exact admitted strategy sheet that was presented.',
    'Human confirmation binds the current bytes.',
  );
  check(
    errorsFor(runtime, 'public', humanGateRemoval).some((error) =>
      error.includes('missing protected rule human_gate'),
    ),
    `${runtime}: semantic human-gate removal must fail`,
  );

  const exactSheetRemoval = replaceAcrossWhitespace(
    publicText,
    'Any byte change, including mechanical reserialization, invalidates readiness, tension verdicts, and confirmation and returns the lifecycle to validation and explicit reconfirmation.',
    'Carry confirmation after byte changes.',
  );
  check(
    errorsFor(runtime, 'public', exactSheetRemoval).some((error) =>
      error.includes('missing protected rule exact_sheet_invalidation'),
    ),
    `${runtime}: exact-sheet invalidation removal must fail`,
  );

  const executionEntryRemoval = replaceAcrossWhitespace(
    publicText,
    'Do not insert post-confirmation registration evidence into the closure-bound canonical dispatch.',
    'Insert registration evidence into the dispatch.',
  );
  check(
    errorsFor(runtime, 'public', executionEntryRemoval).some((error) =>
      error.includes('missing protected rule execution_entry'),
    ),
    `${runtime}: execution-entry cycle protection removal must fail`,
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
    'Continue only when the command emits `SHEET_VALIDATION=pass`, `SCHEMA_VERSION=0.10.0`, the exact `SHEET_SHA256`, and `LEDGER_MUTATION=none`.',
    'Continue after drafting.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', readinessRemoval).some((error) =>
      error.includes('missing protected rule confirmation_readiness'),
    ),
    `${overlayRuntime}: local confirmation-readiness removal must fail`,
  );

  const closureRemoval = replaceAcrossWhitespace(
    overlayText,
    'For every schema 0.10.0 candidate, compile one `domainspec.preconfirmation-closure.v1` receipt after the tension branch is known and before asking for confirmation.',
    'Ask for confirmation after tension.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', closureRemoval).some((error) =>
      error.includes('missing protected rule preconfirmation_closure'),
    ),
    `${overlayRuntime}: preconfirmation-closure removal must fail`,
  );

  const experimentLineageRemoval = replaceAcrossWhitespace(
    overlayText,
    'For `experiment/run`, it also performs a bounded read-only ledger check and proves a resolved frozen proposal plus an identical current criterion ref; `LEDGER_READ=proposal_lineage_only` does not authorize mutation.',
    'Experiment runs use their declared criterion.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', experimentLineageRemoval).some((error) =>
      error.includes('missing protected rule experiment_lineage'),
    ),
    `${overlayRuntime}: experiment-lineage removal must fail`,
  );

  const compositeRemoval = replaceAcrossWhitespace(
    overlayText,
    'This is a composite readiness result, not merely syntax: the validator closes form/version, live type, agent-pool membership, non-null identity uniqueness, final-approver shape, complete pair coverage, and local path constraints.',
    'Syntax is enough.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', compositeRemoval).some((error) =>
      error.includes('missing protected rule composite_readiness'),
    ),
    `${overlayRuntime}: local composite-readiness removal must fail`,
  );

  const subjectPredicateRemoval = replaceAcrossWhitespace(
    overlayText,
    'A subject group has at least 2 agents and includes an `explorer`, `skeptic`, or `auditor`.',
    'A subject group contains agents.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', subjectPredicateRemoval).some((error) =>
      error.includes('missing protected rule subject_group_predicate'),
    ),
    `${overlayRuntime}: subject-group predicate removal must fail`,
  );

  const noSubjectRemoval = replaceAcrossWhitespace(
    overlayText,
    'A no-subject sheet spawns no tension agents and must carry exactly the canonical digest-bound checker/reviewer no-subject pair; a subject-group sheet retains two independent PASS verdicts, and explicit human confirmation remains mandatory in both branches.',
    'No-subject sheets skip tension.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', noSubjectRemoval).some((error) =>
      error.includes('missing protected rule no_subject_tension_disposition'),
    ),
    `${overlayRuntime}: no-subject disposition removal must fail`,
  );

  const byteRefreshRemoval = replaceAcrossWhitespace(
    overlayText,
    'Any strategist byte edit after admission invalidates the machine digest and returns to confirmation-readiness validation before the applicable tension disposition: fresh independent verdicts on the subject branch or a freshly derived canonical pair on the no-subject branch.',
    'Byte edits keep the prior tension result.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', byteRefreshRemoval).some((error) =>
      error.includes('missing protected rule byte_revision_tension_refresh'),
    ),
    `${overlayRuntime}: byte-revision tension refresh removal must fail`,
  );

  const approverRemoval = replaceAcrossWhitespace(
    overlayText,
    'Final approval: `final_approver` is `parent` unless it names the pooled sole `auditor` in a singleton dedicated approval group; arbitrary external names and working roles cannot approve.',
    'Any distinct name may approve.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', approverRemoval).some((error) =>
      error.includes('missing protected rule approver_admission'),
    ),
    `${overlayRuntime}: local approver-admission removal must fail`,
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

  const humanGateRemoval = replaceAcrossWhitespace(
    overlayText,
    'Human confirmation binds the reviewed material strategy, not raw sheet bytes.',
    'Human confirmation binds raw bytes.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', humanGateRemoval).some((error) =>
      error.includes('missing protected rule human_gate'),
    ),
    `${overlayRuntime}: local semantic human-gate removal must fail`,
  );

  const equivalenceRemoval = replaceAcrossWhitespace(
    overlayText,
    'Carry the prior confirmation only when they are equivalent, record a material-equivalence receipt, and attach that carried handle to the current digest at registration.',
    'Carry prior confirmation after byte changes.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', equivalenceRemoval).some((error) =>
      error.includes('missing protected rule material_equivalence'),
    ),
    `${overlayRuntime}: local material-equivalence removal must fail`,
  );

  const profileRegistrationRemoval = replaceAcrossWhitespace(
    overlayText,
    'Use the canonical private runtime profile: preserve the durable material-bound source sheet, generate one run-local registration envelope after confirmation, consume only that envelope, and verify the normalized ledger row before execution.',
    'Register after confirmation.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', profileRegistrationRemoval).some((error) =>
      error.includes('missing protected rule profile_driven_registration'),
    ),
    `${overlayRuntime}: profile-driven registration removal must fail`,
  );

  const otherOwnerRemoval = replaceAcrossWhitespace(
    overlayText,
    'The `other` LIVE type is owned by the bounded execution skill and requires explicit targets, mutations, validation, stop conditions, and independent downstream review for every mutating lane.',
    'The other type may execute work.',
  );
  check(
    errorsFor(overlayRuntime, 'overlay', otherOwnerRemoval).some((error) =>
      error.includes('missing protected rule other_type_owner'),
    ),
    `${overlayRuntime}: other type owner removal must fail`,
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
