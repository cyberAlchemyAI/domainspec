// @source features/app-release/interfaces.md (Phase 1 HTTP API + SSE Streams)
// Phase 1 server: REST (sessions, graph) + SSE (graph deltas, chat events).
// Pure node:http; no Express. Tests boot via createServer({ port: 0 }) for ephemeral binding.

import { createServer as createHttpServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';

import { GraphIndex } from './lib/graph-index.mjs';
import { GraphWatcher } from './lib/graph-watcher.mjs';
import { SessionStore } from './lib/session-store.mjs';
import { dispatchTool } from './lib/agent-tools.mjs';
import { MockChatProvider } from './lib/chat-provider.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STATIC_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

function sendText(res, status, body) {
  const payload = typeof body === 'string' ? body : String(body);
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

async function readJsonBody(req, limit = 1_000_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  return text.trim() ? JSON.parse(text) : {};
}

function openSse(res, { lastEventId } = {}) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.write(': open\n\n');
  return {
    send: (event, data, id) => {
      let frame = '';
      if (id !== undefined) frame += `id: ${id}\n`;
      if (event) frame += `event: ${event}\n`;
      frame += `data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`;
      res.write(frame);
    },
    close: () => res.end()
  };
}

async function serveStatic(req, res, urlPath) {
  let relPath = urlPath === '/' ? '/index.html' : urlPath;
  if (relPath.includes('..')) return sendText(res, 400, 'invalid path');
  const filePath = join(__dirname, relPath);
  if (!filePath.startsWith(__dirname)) return sendText(res, 400, 'invalid path');
  try {
    const st = await stat(filePath);
    if (!st.isFile()) return sendText(res, 404, 'not found');
  } catch {
    return sendText(res, 404, 'not found');
  }
  const type = STATIC_TYPES[extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  createReadStream(filePath).pipe(res);
}

/**
 * Start a Phase 1 server.
 * @param {Object} opts
 * @param {string} opts.domainKnowledgeDir - absolute path to the domain_knowledge/ directory the watcher tracks
 * @param {ChatProvider} [opts.chatProvider] - defaults to MockChatProvider for tests
 * @param {string} [opts.host] - default 127.0.0.1
 * @param {number} [opts.port] - 0 binds an ephemeral port (used by tests); default 8770
 * @param {boolean} [opts.startWatcher] - default true; tests can disable to drive index manually
 */
export async function startServer(opts) {
  const {
    domainKnowledgeDir,
    chatProvider = new MockChatProvider(),
    host = process.env.HOST || '127.0.0.1',
    port = Number(process.env.PORT || 8770),
    startWatcher = true
  } = opts;
  if (!domainKnowledgeDir) throw new Error('startServer requires { domainKnowledgeDir }');

  const index = new GraphIndex({ baseDir: domainKnowledgeDir });
  await index.loadAll();

  const watcher = new GraphWatcher({ index, baseDir: domainKnowledgeDir });
  if (startWatcher) await watcher.start();

  const sessions = new SessionStore({ baseDir: domainKnowledgeDir });

  // SSE subscriber registries
  const graphStreamClients = new Set();
  let graphEventCounter = 0;
  watcher.on('delta', (delta) => {
    graphEventCounter++;
    for (const client of graphStreamClients) client.send('graph-delta', delta, graphEventCounter);
  });
  watcher.on('error', (err) => {
    for (const client of graphStreamClients) client.send('error', err);
  });

  // Map<sessionId, Set<{send, close}>>
  const sessionStreams = new Map();
  function addSessionClient(sessionId, client) {
    let set = sessionStreams.get(sessionId);
    if (!set) { set = new Set(); sessionStreams.set(sessionId, set); }
    set.add(client);
  }
  function removeSessionClient(sessionId, client) {
    const set = sessionStreams.get(sessionId);
    if (set) {
      set.delete(client);
      if (set.size === 0) sessionStreams.delete(sessionId);
    }
  }
  function broadcastSession(sessionId, event, data) {
    const set = sessionStreams.get(sessionId);
    if (!set) return;
    for (const c of set) c.send(event, data);
  }

  // Forward session-store events into per-session SSE streams.
  sessions.on('session-created', (e) => broadcastSession(e.sessionId, 'session-created', e));

  async function handleTurn(sessionId, userTurn) {
    const session = sessions.get(sessionId);
    if (!session) return { ok: false, status: 404, error: 'session not found' };
    const captured = sessions.captureTurn(sessionId, { role: 'user', text: userTurn });
    if (!captured.ok) {
      const status = captured.error === 'NOT_ACTIVE' ? 409 : (captured.error === 'EMPTY_TURN' ? 400 : 404);
      return { ok: false, status, error: captured.error };
    }
    // Run the chat provider asynchronously, streaming events into SSE.
    queueMicrotask(async () => {
      try {
        const ctx = { sessionId, chatHistory: session.chatHistory, seedContext: session.seedContext };
        const filesTouchedThisTurn = [];
        let agentText = '';
        for await (const evt of chatProvider.respond(sessionId, userTurn, ctx)) {
          if (evt.type === 'tool-use-start') {
            broadcastSession(sessionId, 'tool-use-start', evt);
          } else if (evt.type === 'tool-use-result') {
            broadcastSession(sessionId, 'tool-use-result', evt);
            if (evt.output && Array.isArray(evt.output.files)) {
              for (const f of evt.output.files) if (!filesTouchedThisTurn.includes(f)) filesTouchedThisTurn.push(f);
            } else if (evt.output && evt.output.path) {
              if (!filesTouchedThisTurn.includes(evt.output.path)) filesTouchedThisTurn.push(evt.output.path);
            }
          } else if (evt.type === 'text-delta') {
            agentText += evt.text;
            broadcastSession(sessionId, 'text-delta', evt);
          } else if (evt.type === 'error') {
            broadcastSession(sessionId, 'error', evt);
          } else if (evt.type === 'done') {
            broadcastSession(sessionId, 'done', evt);
          }
        }
        // Persist the agent's final composed turn into chat history.
        if (agentText) sessions.captureTurn(sessionId, { role: 'agent', text: agentText, filesTouched: filesTouchedThisTurn });
      } catch (err) {
        broadcastSession(sessionId, 'error', { code: 'PROVIDER_CRASH', message: err.message });
      }
    });
    return { ok: true, turnId: captured.turnId };
  }

  const server = createHttpServer(async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host || host}`);
    const path = urlObj.pathname;
    try {
      // ── Sessions API ────────────────────────────────────────────
      if (path === '/api/sessions' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const session = sessions.create({ title: body.title });
        return sendJson(res, 201, { sessionId: session.sessionId, status: session.status, createdAt: session.createdAt, title: session.title });
      }
      if (path === '/api/sessions' && req.method === 'GET') {
        const limit = Number(urlObj.searchParams.get('limit') || 50);
        const since = urlObj.searchParams.get('since') || null;
        const list = await sessions.list({ limit, since });
        return sendJson(res, 200, list.map(({ path: _p, ...rest }) => rest));
      }
      const sessionMatch = path.match(/^\/api\/sessions\/([^/]+)(\/(turns|end|resume|stream))?\/?$/);
      if (sessionMatch) {
        const sessionId = decodeURIComponent(sessionMatch[1]);
        const action = sessionMatch[3];
        if (!action && req.method === 'GET') {
          const summary = await sessions.getSummary(sessionId);
          if (!summary.ok) {
            const status = summary.error === 'NOT_FOUND' ? 404 : 422;
            return sendJson(res, status, { error: summary.error });
          }
          const { filePath, ...rest } = summary;
          return sendJson(res, 200, rest);
        }
        if (action === 'turns' && req.method === 'POST') {
          const body = await readJsonBody(req);
          const r = await handleTurn(sessionId, body.turnText || '');
          if (!r.ok) return sendJson(res, r.status, { error: r.error });
          return sendJson(res, 202, { turnId: r.turnId, ack: true });
        }
        if (action === 'end' && req.method === 'POST') {
          const body = await readJsonBody(req);
          const r = await sessions.end(sessionId, body || {});
          if (!r.ok) return sendJson(res, r.error === 'NOT_FOUND' ? 404 : 500, { error: r.error });
          if (r.idempotent) {
            return sendJson(res, 409, { sessionId, status: 'ended', filePath: r.filePath, idempotent: true });
          }
          return sendJson(res, 200, { sessionId, status: 'ended', filePath: r.filePath });
        }
        if (action === 'resume' && req.method === 'POST') {
          const r = await sessions.resume(sessionId);
          if (!r.ok) {
            if (r.error === 'NOT_FOUND') return sendJson(res, 404, { error: r.error });
            if (r.error === 'SUMMARY_MISSING') return sendJson(res, 422, { error: 'summary required to resume' });
            return sendJson(res, 500, { error: r.error });
          }
          return sendJson(res, 200, {
            sessionId: r.session.sessionId,
            status: 'active',
            resumedFromFilePath: r.resumedFromFilePath
          });
        }
        if (action === 'stream' && req.method === 'GET') {
          const session = sessions.get(sessionId);
          const client = openSse(res);
          addSessionClient(sessionId, client);
          if (session) client.send('session-created', { sessionId, createdAt: session.createdAt, title: session.title });
          req.on('close', () => removeSessionClient(sessionId, client));
          return;
        }
      }

      // ── Graph API ───────────────────────────────────────────────
      if (path === '/api/graph/index' && req.method === 'GET') {
        return sendJson(res, 200, index.snapshot());
      }
      if (path === '/api/graph/stream' && req.method === 'GET') {
        const client = openSse(res);
        graphStreamClients.add(client);
        // Send an initial snapshot for client bootstrap
        client.send('graph-delta', { added: index.snapshot().nodes, updated: [], removed: [], metrics: index.metrics(), bootstrap: true }, ++graphEventCounter);
        req.on('close', () => graphStreamClients.delete(client));
        return;
      }

      // ── Test-only state introspection ───────────────────────────
      if (path === '/api/_test/state' && req.method === 'GET' && process.env.NODE_ENV === 'test') {
        return sendJson(res, 200, {
          activeSessionIds: sessions.activeIds,
          watcherDebounceQueueLength: watcher.pending.size,
          indexSnapshotVersion: index.version
        });
      }

      // ── Static UI ───────────────────────────────────────────────
      if (req.method === 'GET') {
        return await serveStatic(req, res, path);
      }

      sendText(res, 404, 'not found');
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const address = server.address();
  return {
    server,
    address,
    url: `http://${host}:${address.port}`,
    sessions,
    index,
    watcher,
    chatProvider,
    async stop() {
      await watcher.stop();
      await new Promise((r) => server.close(() => r()));
    },
    /** Test helper: synchronously drive the watcher debounce queue. */
    async forceWatcherFlush() { await watcher.flush(); }
  };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const domainKnowledgeDir = resolve(__dirname, process.env.DOMAIN_KNOWLEDGE_DIR || '../../domain_knowledge');
  startServer({ domainKnowledgeDir }).then((s) => {
    console.log(`[harness/app-release] listening on ${s.url}`);
    console.log(`[harness/app-release] watching ${domainKnowledgeDir}`);
  }).catch((err) => {
    console.error('[harness/app-release] failed to start:', err.message);
    process.exit(1);
  });
}
