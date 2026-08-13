'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const { loadKernel } = require('../src/bridge.cjs');
const {
  createApiServer,
  decodeLedgerId,
  encodeLedgerId,
  startApi
} = require('../src/server.cjs');
const { parseArguments } = require('../src/main.cjs');

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen({ host: '127.0.0.1', port: 0, exclusive: true }, () => {
      server.off('error', reject);
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

test('package is dependency-free and startup accepts only a port', () => {
  const packageJson = require('../package.json');
  assert.equal(packageJson.engines.node, '26.6.0');
  assert.equal(Object.prototype.hasOwnProperty.call(packageJson, 'dependencies'), false);
  assert.deepEqual(parseArguments([]), { port: 8787 });
  assert.deepEqual(parseArguments(['--port', '0']), { port: 0 });
  assert.throws(() => parseArguments(['--host', '0.0.0.0']), { code: 'ARGUMENT_INVALID' });
  assert.throws(() => parseArguments(['--port', '65536']), { code: 'PORT_INVALID' });
});

test('ledger IDs require canonical base64url and fatal UTF-8', () => {
  const ledgerPath = 'arcanum/arcana/craft/.craft/ledger.yml';
  const id = encodeLedgerId(ledgerPath);
  assert.equal(decodeLedgerId(id), ledgerPath);
  assert.equal(decodeLedgerId(`${id}=`), null);
  assert.equal(decodeLedgerId('%%%'), null);
  assert.equal(decodeLedgerId(Buffer.from([0xff]).toString('base64url')), null);
});

test('non-loopback startup is refused before a runtime copy is created', async () => {
  await assert.rejects(startApi({ host: '0.0.0.0', port: 0 }), {
    code: 'NON_LOOPBACK_FORBIDDEN'
  });
});

test('concurrent requests serialize adapter operations', async () => {
  let active = 0;
  let maximumActive = 0;
  const adapter = {
    async status() {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await new Promise((resolve) => setTimeout(resolve, 20));
      active -= 1;
      return { status: 'ok' };
    },
    async verify() { return { status: 'ok' }; },
    async listLedgers() { return { status: 'ok', ledgers: [] }; },
    async getRaw() { return { status: 'not-found', code: 'NOT_FOUND' }; }
  };
  const server = createApiServer({ adapter, storePath: '/not-used-by-fake' });
  const base = await listen(server);
  try {
    const responses = await Promise.all([
      fetch(`${base}/v1/status`),
      fetch(`${base}/v1/status`),
      fetch(`${base}/v1/status`)
    ]);
    assert.deepEqual(responses.map((response) => response.status), [200, 200, 200]);
    assert.equal(maximumActive, 1);
  } finally {
    await close(server);
  }
});

test('reader failure classes map to sanitized typed 503 JSON', async () => {
  for (const code of ['SNAPSHOT_UNAVAILABLE', 'MANIFEST_INVALID', 'RECORD_INVALID', 'READ_FAILED']) {
    const adapter = {
      async status() {
        return { status: 'unavailable', code, message: '/private/path must not leak' };
      },
      async verify() { return { status: 'unavailable', code }; },
      async listLedgers() { return { status: 'unavailable', code }; },
      async getRaw() { return { status: 'unavailable', code }; }
    };
    const server = createApiServer({ adapter, storePath: '/not-used-by-fake' });
    const base = await listen(server);
    try {
      const response = await fetch(`${base}/v1/status`);
      const text = await response.text();
      assert.equal(response.status, 503);
      assert.deepEqual(JSON.parse(text), { status: 'unavailable', code });
      assert.equal(text.includes('/private/path'), false);
    } finally {
      await close(server);
    }
  }
});

test('live API exposes four manifest-bound reads and preserves accepted inputs', { timeout: 120_000 }, async () => {
  const kernel = loadKernel();
  const before = kernel.identity.verifyPinnedInputs();
  const api = await startApi({ port: 0 });
  const runRoot = api.runRoot;
  try {
    assert.equal(api.url.startsWith('http://127.0.0.1:'), true);
    assert.notEqual(api.storePath, kernel.constants.ORIGINAL_STORE);
    assert.equal(api.storePath.startsWith(`${kernel.experimentRoot}/.work/craft-consultation-api/`), true);

    const statusResponse = await fetch(`${api.url}/v1/status`);
    const status = await statusResponse.json();
    assert.equal(statusResponse.status, 200);
    assert.equal(status.runtime.node, 'v26.6.0');
    assert.deepEqual(status.dependency, { name: '@vijayee/wavedb', version: '0.15.9' });
    assert.equal(status.snapshot.ledgerCount, 28);
    assert.equal(status.snapshot.recordCount, 57);
    assert.deepEqual(status.store, { originalOpened: false, isolated: true });

    const verifyResponse = await fetch(`${api.url}/v1/verify`);
    const verification = await verifyResponse.json();
    assert.equal(verifyResponse.status, 200);
    assert.equal(verification.verification.ledgerCount, 28);
    assert.equal(verification.verification.recordCount, 57);
    assert.equal(verification.verification.recordsVerified, 57);

    const listResponse = await fetch(`${api.url}/v1/ledgers`);
    const list = await listResponse.json();
    assert.equal(listResponse.status, 200);
    assert.equal(list.count, 28);
    assert.equal(new Set(list.ledgers.map((ledger) => ledger.id)).size, 28);
    assert.deepEqual(
      list.ledgers.map((ledger) => ledger.path),
      [...list.ledgers.map((ledger) => ledger.path)].sort()
    );
    for (const ledger of list.ledgers) {
      assert.equal(decodeLedgerId(ledger.id), ledger.path);
    }

    const first = list.ledgers[0];
    const prefix = first.path.slice(0, first.path.indexOf('/') + 1);
    const expectedSubset = list.ledgers.filter((ledger) => ledger.path.startsWith(prefix));
    const filteredResponse = await fetch(`${api.url}/v1/ledgers?prefix=${encodeURIComponent(prefix)}`);
    const filtered = await filteredResponse.json();
    assert.equal(filteredResponse.status, 200);
    assert.deepEqual(filtered.ledgers, expectedSubset);

    const rawResponse = await fetch(`${api.url}/v1/ledgers/${first.id}/raw`);
    const rawBytes = Buffer.from(await rawResponse.arrayBuffer());
    assert.equal(rawResponse.status, 200);
    assert.equal(rawResponse.headers.get('content-length'), String(first.sizeBytes));
    assert.equal(rawResponse.headers.get('content-type'), 'application/yaml; charset=utf-8');
    assert.equal(rawBytes.length, first.sizeBytes);
    assert.equal(sha256(rawBytes), first.sha256);

    for (const missingId of [encodeLedgerId('../../etc/passwd'), '%%%']) {
      const missingResponse = await fetch(`${api.url}/v1/ledgers/${missingId}/raw`);
      const missingBytes = Buffer.from(await missingResponse.arrayBuffer());
      assert.equal(missingResponse.status, 404);
      assert.deepEqual(JSON.parse(missingBytes.toString('utf8')), {
        status: 'not-found',
        code: 'NOT_FOUND'
      });
    }

    const duplicatePrefix = await fetch(`${api.url}/v1/ledgers?prefix=a&prefix=b`);
    assert.equal(duplicatePrefix.status, 400);
    const unknownQuery = await fetch(`${api.url}/v1/ledgers?path=anything`);
    assert.equal(unknownQuery.status, 400);
    const methodResponse = await fetch(`${api.url}/v1/status`, { method: 'POST' });
    assert.equal(methodResponse.status, 405);
    assert.equal(methodResponse.headers.get('allow'), 'GET');
    const unknownRoute = await fetch(`${api.url}/v1/unknown`);
    assert.equal(unknownRoute.status, 404);
  } finally {
    await api.close();
  }

  assert.equal(fs.existsSync(runRoot), false);
  const after = kernel.identity.verifyPinnedInputs();
  kernel.identity.assertInputsUnchanged(before, after);
});
