'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const EXPERIMENT_REL =
  'ops/development/2026-08-04-wavedb-craft-runtime-research/experiment/craft-wavedb-readonly-experiment';

const KERNEL_SOURCE_PINS = Object.freeze({
  'src/adapter.cjs': '668120050e833f2cda465b930a9c04c6f64e7dc6922711637090ebd6181e48e3',
  'src/constants.cjs': '9ab3410cb97ab1550f19c388d5f6a65e7481025c88eb16e313bf50cb36310990',
  'src/identity.cjs': '0182dcecd30253a58685cb74bf25e77b1ee35d200611b085aaf4f181cb201880',
  'src/manifest.cjs': '507f3824b2286d6dd8415b03521d99213b71056bd8328663af9e8c2ad9f4d5e0',
  'src/read-session.cjs': '6769b7460bb3357a4e1793d9791ef4f585d72660285d4ac285e0a1508dbed383'
});
const TERMINAL_RECEIPT_PIN = Object.freeze({
  relativePath: 'execution/terminal-receipt.json',
  sha256: 'fda167263e92429330e77c5d62ba1ce2152ac06770c50ac45334a1e4cb32b395'
});

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function findRepositoryRoot(startPath) {
  let current = path.resolve(startPath);
  while (true) {
    if (
      fs.existsSync(path.join(current, 'AGENTS.md')) &&
      fs.existsSync(path.join(current, EXPERIMENT_REL))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      const error = new Error('DomainSpec repository root not found');
      error.code = 'REPOSITORY_ROOT_UNAVAILABLE';
      throw error;
    }
    current = parent;
  }
}

function verifyFile(filePath, expectedDigest, label) {
  let bytes;
  try {
    bytes = fs.readFileSync(filePath);
  } catch {
    const error = new Error(`${label} unavailable`);
    error.code = 'READER_PROVENANCE_INVALID';
    throw error;
  }
  if (sha256(bytes) !== expectedDigest) {
    const error = new Error(`${label} SHA-256 mismatch`);
    error.code = 'READER_PROVENANCE_INVALID';
    throw error;
  }
  return bytes;
}

function loadKernel() {
  const repositoryRoot = findRepositoryRoot(__dirname);
  const experimentRoot = path.join(repositoryRoot, EXPERIMENT_REL);

  for (const [relativePath, digest] of Object.entries(KERNEL_SOURCE_PINS)) {
    verifyFile(path.join(experimentRoot, relativePath), digest, relativePath);
  }

  const terminalBytes = verifyFile(
    path.join(experimentRoot, TERMINAL_RECEIPT_PIN.relativePath),
    TERMINAL_RECEIPT_PIN.sha256,
    'completed reader receipt'
  );
  const terminal = JSON.parse(terminalBytes.toString('utf8'));
  assert.equal(terminal.result, 'pass', 'completed reader did not pass');
  assert.deepEqual(terminal.completedUnits, ['CWE-001', 'CWE-002', 'CWE-003']);
  assert.equal(terminal.authorityEffect, 'none');

  const adapter = require(path.join(experimentRoot, 'src/adapter.cjs'));
  const constants = require(path.join(experimentRoot, 'src/constants.cjs'));
  const identity = require(path.join(experimentRoot, 'src/identity.cjs'));
  assert.deepEqual(
    Object.keys(adapter).sort(),
    ['getRaw', 'listLedgers', 'status', 'verify'],
    'reader adapter surface mismatch'
  );

  return Object.freeze({
    adapter,
    constants,
    experimentRoot,
    identity,
    repositoryRoot,
    provenance: Object.freeze({
      readerTerminalSha256: TERMINAL_RECEIPT_PIN.sha256,
      sourcePins: KERNEL_SOURCE_PINS
    })
  });
}

function assertContainedRuntimeBase(experimentRoot, runtimeBase) {
  const experimentReal = fs.realpathSync(experimentRoot);
  if (fs.existsSync(runtimeBase)) {
    if (fs.lstatSync(runtimeBase).isSymbolicLink()) {
      const error = new Error('runtime base may not be a symbolic link');
      error.code = 'RUNTIME_SCOPE_INVALID';
      throw error;
    }
  } else {
    fs.mkdirSync(runtimeBase, { recursive: true, mode: 0o700 });
  }
  const baseReal = fs.realpathSync(runtimeBase);
  if (!baseReal.startsWith(`${experimentReal}${path.sep}`)) {
    const error = new Error('runtime base escapes completed experiment root');
    error.code = 'RUNTIME_SCOPE_INVALID';
    throw error;
  }
  return baseReal;
}

function prepareRuntimeStore(kernel = loadKernel()) {
  const pinnedBefore = kernel.identity.verifyPinnedInputs();
  const runtimeBase = assertContainedRuntimeBase(
    kernel.experimentRoot,
    path.join(kernel.experimentRoot, '.work/craft-consultation-api')
  );
  const runRoot = fs.mkdtempSync(path.join(runtimeBase, 'run-'));
  fs.chmodSync(runRoot, 0o700);
  const storePath = path.join(runRoot, 'store');
  let disposed = false;

  function dispose() {
    if (disposed) return;
    disposed = true;
    const parentReal = fs.realpathSync(path.dirname(runRoot));
    if (
      parentReal !== runtimeBase ||
      !path.basename(runRoot).startsWith('run-') ||
      (fs.existsSync(runRoot) && fs.lstatSync(runRoot).isSymbolicLink())
    ) {
      const error = new Error('refusing unsafe runtime cleanup');
      error.code = 'RUNTIME_SCOPE_INVALID';
      throw error;
    }
    fs.rmSync(runRoot, { recursive: true, force: true });
  }

  try {
    fs.cpSync(kernel.constants.ORIGINAL_STORE, storePath, {
      recursive: true,
      errorOnExist: true,
      force: false
    });
    assert.deepEqual(
      kernel.identity.treeSnapshot(storePath),
      pinnedBefore.store,
      'runtime copy identity mismatch before open'
    );
  } catch (error) {
    dispose();
    throw error;
  }

  return Object.freeze({
    pinnedBefore,
    runRoot,
    storePath,
    dispose
  });
}

module.exports = Object.freeze({
  KERNEL_SOURCE_PINS,
  TERMINAL_RECEIPT_PIN,
  loadKernel,
  prepareRuntimeStore,
  sha256
});
