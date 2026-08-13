'use strict';

const http = require('node:http');
const { TextDecoder } = require('node:util');
const { loadKernel, prepareRuntimeStore } = require('./bridge.cjs');

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1']);
const MAX_PREFIX_LENGTH = 512;

function encodeLedgerId(ledgerPath) {
  return Buffer.from(ledgerPath, 'utf8').toString('base64url');
}

function decodeLedgerId(identifier) {
  if (typeof identifier !== 'string' || !/^[A-Za-z0-9_-]+$/.test(identifier)) {
    return null;
  }
  let ledgerPath;
  try {
    ledgerPath = new TextDecoder('utf-8', { fatal: true }).decode(
      Buffer.from(identifier, 'base64url')
    );
  } catch {
    return null;
  }
  if (!ledgerPath || encodeLedgerId(ledgerPath) !== identifier) return null;
  return ledgerPath;
}

function safeCode(value, fallback = 'SNAPSHOT_UNAVAILABLE') {
  return typeof value === 'string' && /^[A-Z][A-Z0-9_]{0,63}$/.test(value)
    ? value
    : fallback;
}

function jsonResponse(response, statusCode, body, extraHeaders = {}) {
  const bytes = Buffer.from(JSON.stringify(body), 'utf8');
  response.writeHead(statusCode, {
    'cache-control': 'no-store',
    'content-length': String(bytes.length),
    'content-type': 'application/json; charset=utf-8',
    'x-content-type-options': 'nosniff',
    ...extraHeaders
  });
  response.end(bytes);
}

function unavailable(response, result) {
  jsonResponse(response, 503, {
    status: 'unavailable',
    code: safeCode(result?.code)
  });
}

function notFound(response) {
  jsonResponse(response, 404, { status: 'not-found', code: 'NOT_FOUND' });
}

function createSerializedOperations(adapter, storePath) {
  let tail = Promise.resolve();
  function serialize(operation) {
    const current = tail.then(operation, operation);
    tail = current.catch(() => undefined);
    return current;
  }
  return Object.freeze({
    status: () => serialize(() => adapter.status(storePath)),
    verify: () => serialize(() => adapter.verify(storePath)),
    listLedgers: () => serialize(() => adapter.listLedgers(storePath)),
    getRaw: (ledgerPath) => serialize(() => adapter.getRaw(storePath, ledgerPath))
  });
}

function parsePrefix(url) {
  for (const key of url.searchParams.keys()) {
    if (key !== 'prefix') return { ok: false };
  }
  const values = url.searchParams.getAll('prefix');
  if (values.length > 1) return { ok: false };
  const prefix = values[0] ?? '';
  if (prefix.length > MAX_PREFIX_LENGTH || prefix.includes('\u0000')) {
    return { ok: false };
  }
  return { ok: true, prefix };
}

function createRequestHandler(operations) {
  return async function handle(request, response) {
    try {
      if (request.method !== 'GET') {
        jsonResponse(
          response,
          405,
          { status: 'method-not-allowed', code: 'METHOD_NOT_ALLOWED' },
          { allow: 'GET' }
        );
        return;
      }

      let url;
      try {
        url = new URL(request.url, 'http://127.0.0.1');
      } catch {
        jsonResponse(response, 400, { status: 'invalid-request', code: 'INVALID_URL' });
        return;
      }

      if (url.pathname === '/v1/status' && url.search === '') {
        const result = await operations.status();
        if (result?.status !== 'ok') return unavailable(response, result);
        jsonResponse(response, 200, result);
        return;
      }

      if (url.pathname === '/v1/verify' && url.search === '') {
        const result = await operations.verify();
        if (result?.status !== 'ok') return unavailable(response, result);
        jsonResponse(response, 200, result);
        return;
      }

      if (url.pathname === '/v1/ledgers') {
        const parsed = parsePrefix(url);
        if (!parsed.ok) {
          jsonResponse(response, 400, { status: 'invalid-request', code: 'INVALID_PREFIX' });
          return;
        }
        const result = await operations.listLedgers();
        if (result?.status !== 'ok' || !Array.isArray(result.ledgers)) {
          return unavailable(response, result);
        }
        const ledgers = result.ledgers
          .filter((ledger) => ledger.path.startsWith(parsed.prefix))
          .map((ledger) => ({
            id: encodeLedgerId(ledger.path),
            path: ledger.path,
            sizeBytes: ledger.sizeBytes,
            sha256: ledger.sha256
          }));
        jsonResponse(response, 200, { status: 'ok', count: ledgers.length, ledgers });
        return;
      }

      const rawMatch = /^\/v1\/ledgers\/([A-Za-z0-9_-]+)\/raw$/.exec(url.pathname);
      if (rawMatch && url.search === '') {
        const ledgerPath = decodeLedgerId(rawMatch[1]);
        if (ledgerPath === null) return notFound(response);
        const result = await operations.getRaw(ledgerPath);
        if (result?.status === 'not-found') return notFound(response);
        if (result?.status !== 'ok' || !Buffer.isBuffer(result.bytes)) {
          return unavailable(response, result);
        }
        response.writeHead(200, {
          'cache-control': 'no-store',
          'content-length': String(result.bytes.length),
          'content-type': 'application/yaml; charset=utf-8',
          etag: `"sha256:${result.sha256}"`,
          'x-content-type-options': 'nosniff'
        });
        response.end(result.bytes);
        return;
      }

      notFound(response);
    } catch (error) {
      unavailable(response, { code: error?.code || 'READ_FAILED' });
    }
  };
}

function createApiServer({ adapter, storePath }) {
  const operations = createSerializedOperations(adapter, storePath);
  return http.createServer(createRequestHandler(operations));
}

function listen(server, { host, port }) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve();
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen({ host, port, exclusive: true });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    if (!server.listening) return resolve();
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function startApi({ host = '127.0.0.1', port = 8787 } = {}) {
  if (!LOOPBACK_HOSTS.has(host)) {
    const error = new Error('Craft Consultation API is loopback-only');
    error.code = 'NON_LOOPBACK_FORBIDDEN';
    throw error;
  }
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    const error = new Error('port must be an integer from 0 through 65535');
    error.code = 'PORT_INVALID';
    throw error;
  }

  const kernel = loadKernel();
  const runtime = prepareRuntimeStore(kernel);
  const server = createApiServer({ adapter: kernel.adapter, storePath: runtime.storePath });
  let closed = false;
  try {
    await listen(server, { host, port });
  } catch (error) {
    runtime.dispose();
    throw error;
  }

  const address = server.address();
  const addressHost = address.family === 'IPv6' ? `[${address.address}]` : address.address;

  return Object.freeze({
    server,
    runRoot: runtime.runRoot,
    storePath: runtime.storePath,
    url: `http://${addressHost}:${address.port}`,
    async close() {
      if (closed) return;
      closed = true;
      let closeError;
      try {
        await closeServer(server);
        const pinnedAfter = kernel.identity.verifyPinnedInputs();
        kernel.identity.assertInputsUnchanged(runtime.pinnedBefore, pinnedAfter);
      } catch (error) {
        closeError = error;
      } finally {
        runtime.dispose();
      }
      if (closeError) throw closeError;
    }
  });
}

module.exports = Object.freeze({
  createApiServer,
  createRequestHandler,
  createSerializedOperations,
  decodeLedgerId,
  encodeLedgerId,
  startApi
});
