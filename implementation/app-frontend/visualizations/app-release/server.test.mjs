// @source features/app-release/interfaces.md (Phase 1 HTTP API + SSE Streams)
// @test-id T-IF-1 ... T-IF-16, T-IF-SSE-1 ... T-IF-SSE-7

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { startServer } from './server.mjs';
import { MockChatProvider, ev } from './lib/chat-provider.mjs';
import { dispatchTool } from './lib/agent-tools.mjs';

async function setupServer({ withChatProvider, startWatcher = false } = {}) {
  const baseDir = await mkdtemp(join(tmpdir(), 'app-release-server-'));
  await mkdir(join(baseDir, 'axiom'), { recursive: true });
  await writeFile(join(baseDir, 'axiom/seed.md'), '---\nnode_type: axiom\nstatus: draft\n---\n\n# Seed\n', 'utf8');
  const chatProvider = withChatProvider || new MockChatProvider();
  const handle = await startServer({ domainKnowledgeDir: baseDir, chatProvider, port: 0, host: '127.0.0.1', startWatcher });
  return { handle, baseDir, chatProvider, cleanup: async () => { await handle.stop(); await rm(baseDir, { recursive: true, force: true }); } };
}

async function fetchJson(url, init = {}) {
  const res = await fetch(url, init);
  let body = null;
  const text = await res.text();
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, headers: res.headers, body };
}

const jsonHeaders = { 'Content-Type': 'application/json' };

// ─── Sessions REST ─────────────────────────────────────────────────

test('POST /api/sessions returns 201 with active session', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const r = await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ title: 'My Session' }) });
    assert.equal(r.status, 201);
    assert.equal(r.body.status, 'active');
    assert.match(r.body.sessionId, /T\d{6}Z-/);
    assert.equal(r.body.title, 'My Session');
  } finally { await cleanup(); }
});

test('GET /api/sessions returns past sessions sorted desc', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const a = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'A' }), headers: jsonHeaders })).body;
    await fetchJson(`${handle.url}/api/sessions/${a.sessionId}/end`, { method: 'POST', body: JSON.stringify({ summary: 'first.' }), headers: jsonHeaders });
    await new Promise(r => setTimeout(r, 10));
    const b = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'B' }), headers: jsonHeaders })).body;
    await fetchJson(`${handle.url}/api/sessions/${b.sessionId}/end`, { method: 'POST', body: JSON.stringify({ summary: 'second.' }), headers: jsonHeaders });
    const list = await fetchJson(`${handle.url}/api/sessions`);
    assert.equal(list.status, 200);
    assert.equal(list.body.length, 2);
    assert.equal(list.body[0].title, 'B');
  } finally { await cleanup(); }
});

test('GET /api/sessions/:id returns 404 for unknown', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const r = await fetchJson(`${handle.url}/api/sessions/nope`);
    assert.equal(r.status, 404);
  } finally { await cleanup(); }
});

test('POST /api/sessions/:id/turns returns 202 for valid input, 400 for empty, 404 for missing', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const s = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 't' }), headers: jsonHeaders })).body;
    const ok = await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/turns`, { method: 'POST', body: JSON.stringify({ turnText: 'hi' }), headers: jsonHeaders });
    assert.equal(ok.status, 202);
    assert.equal(ok.body.ack, true);
    const empty = await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/turns`, { method: 'POST', body: JSON.stringify({ turnText: '   ' }), headers: jsonHeaders });
    assert.equal(empty.status, 400);
    const missing = await fetchJson(`${handle.url}/api/sessions/missing-id/turns`, { method: 'POST', body: JSON.stringify({ turnText: 'x' }), headers: jsonHeaders });
    assert.equal(missing.status, 404);
  } finally { await cleanup(); }
});

test('POST /api/sessions/:id/end returns 200 with filePath; second call returns 409 idempotent', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const s = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'End Me' }), headers: jsonHeaders })).body;
    const e1 = await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', body: JSON.stringify({ summary: 's.' }), headers: jsonHeaders });
    assert.equal(e1.status, 200);
    assert.match(e1.body.filePath, /end-me\.md$/);
    const e2 = await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', body: JSON.stringify({ summary: 's.' }), headers: jsonHeaders });
    assert.equal(e2.status, 409);
    assert.equal(e2.body.idempotent, true);
  } finally { await cleanup(); }
});

test('POST /api/sessions/:id/resume returns 422 when summary missing', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const s = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'No Summary' }), headers: jsonHeaders })).body;
    await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', body: '{}', headers: jsonHeaders });
    const r = await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/resume`, { method: 'POST' });
    assert.equal(r.status, 422);
  } finally { await cleanup(); }
});

test('POST /api/sessions/:id/resume returns 200 with resumedFromFilePath when summary present', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const s = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'Resumable' }), headers: jsonHeaders })).body;
    await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', body: JSON.stringify({ summary: 'Real summary.' }), headers: jsonHeaders });
    const r = await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/resume`, { method: 'POST' });
    assert.equal(r.status, 200);
    assert.equal(r.body.status, 'active');
    assert.match(r.body.resumedFromFilePath, /resumable\.md$/);
  } finally { await cleanup(); }
});

// ─── Graph REST ────────────────────────────────────────────────────

test('GET /api/graph/index returns nodes, edges, metrics', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const r = await fetchJson(`${handle.url}/api/graph/index`);
    assert.equal(r.status, 200);
    assert.ok(Array.isArray(r.body.nodes));
    assert.ok(Array.isArray(r.body.edges));
    assert.ok(typeof r.body.metrics === 'object');
    assert.equal(typeof r.body.metrics.nodes, 'number');
    assert.equal(typeof r.body.metrics.edges, 'number');
    assert.equal(typeof r.body.metrics.axioms, 'number');
    assert.equal(typeof r.body.metrics.drafts, 'number');
    assert.ok(r.body.metrics.nodes >= 1, 'should include the seed axiom');
  } finally { await cleanup(); }
});

test('GET /api/graph/index excludes sessions/** from metrics.nodes', async () => {
  const { handle, baseDir, cleanup } = await setupServer();
  try {
    await mkdir(join(baseDir, 'sessions'), { recursive: true });
    await writeFile(join(baseDir, 'sessions/2026-01-01-x.md'), '---\nnode_type: session\n---\n\n# x\n', 'utf8');
    await handle.index.loadAll();
    const r = await fetchJson(`${handle.url}/api/graph/index`);
    assert.equal(r.body.metrics.nodes, 1, 'session file must not bump metrics.nodes');
  } finally { await cleanup(); }
});

// ─── SSE: graph stream ─────────────────────────────────────────────

test('GET /api/graph/stream emits text/event-stream with bootstrap delta', async () => {
  const { handle, cleanup } = await setupServer();
  try {
    const res = await fetch(`${handle.url}/api/graph/stream`);
    assert.equal(res.headers.get('content-type'), 'text/event-stream');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let saw = false;
    const start = Date.now();
    while (Date.now() - start < 1000) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      if (buf.includes('event: graph-delta') && buf.includes('"bootstrap":true')) { saw = true; break; }
    }
    assert.equal(saw, true);
    await reader.cancel();
  } finally { await cleanup(); }
});

// ─── SSE: session stream + chat dispatch ───────────────────────────

test('GET /api/sessions/:id/stream emits session-created, then chat events from MockChatProvider', async () => {
  const provider = new MockChatProvider();
  const { handle, cleanup } = await setupServer({ withChatProvider: provider });
  try {
    const s = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'streamy' }), headers: jsonHeaders })).body;
    provider.setScript(s.sessionId, [
      ev('text-delta', { text: 'Olá! ' }),
      ev('tool-use-start', { toolUseId: 't1', toolName: 'WriteMarkdownNode', input: { path: 'axiom/x.md' } }),
      ev('tool-use-result', { toolUseId: 't1', toolName: 'WriteMarkdownNode', output: { ok: true, path: 'axiom/x.md' } }),
      ev('text-delta', { text: 'Pronto.' }),
      ev('done')
    ]);
    const sseRes = await fetch(`${handle.url}/api/sessions/${s.sessionId}/stream`);
    const reader = sseRes.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (!buf.includes('event: session-created')) {
      const { value } = await reader.read();
      buf += decoder.decode(value, { stream: true });
    }
    await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/turns`, { method: 'POST', body: JSON.stringify({ turnText: 'pode escrever' }), headers: jsonHeaders });
    const start = Date.now();
    while (!buf.includes('event: done') && Date.now() - start < 2000) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
    }
    assert.match(buf, /event: text-delta/);
    assert.match(buf, /event: tool-use-start/);
    assert.match(buf, /event: tool-use-result/);
    assert.match(buf, /event: done/);
    // Match data line up to end-of-line; SSE serializes payload on a single line.
    const startEv = buf.match(/event: tool-use-start\s*\ndata: (.+)\n/);
    const resultEv = buf.match(/event: tool-use-result\s*\ndata: (.+)\n/);
    assert.ok(startEv && resultEv, 'expected tool-use-start and tool-use-result events');
    const sObj = JSON.parse(startEv[1]);
    const rObj = JSON.parse(resultEv[1]);
    assert.equal(sObj.toolUseId, rObj.toolUseId);
    await reader.cancel();
  } finally { await cleanup(); }
});

test('integration: tool-write triggers graph-delta on graph stream', async () => {
  const provider = new MockChatProvider();
  const { handle, baseDir, cleanup } = await setupServer({ withChatProvider: provider, startWatcher: true });
  try {
    const s = (await fetchJson(`${handle.url}/api/sessions`, { method: 'POST', body: JSON.stringify({ title: 'integ' }), headers: jsonHeaders })).body;
    provider.setScript(s.sessionId, [
      async () => {
        const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: 'axiom/agent-wrote.md', frontmatter: { node_type: 'axiom', status: 'draft' }, body: '# Agent Wrote' } });
        return [
          ev('tool-use-start', { toolUseId: 't1', toolName: 'WriteMarkdownNode', input: { path: 'axiom/agent-wrote.md' } }),
          ev('tool-use-result', { toolUseId: 't1', toolName: 'WriteMarkdownNode', output: r.output, files: r.files || ['axiom/agent-wrote.md'] }),
          ev('done')
        ];
      }
    ]);
    const graphRes = await fetch(`${handle.url}/api/graph/stream`);
    const graphReader = graphRes.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (!buf.includes('"bootstrap":true')) {
      const { value } = await graphReader.read();
      buf += decoder.decode(value, { stream: true });
    }
    buf = '';
    await fetchJson(`${handle.url}/api/sessions/${s.sessionId}/turns`, { method: 'POST', body: JSON.stringify({ turnText: 'go' }), headers: jsonHeaders });
    const start = Date.now();
    while (!buf.match(/agent-wrote/) && Date.now() - start < 3000) {
      const { value, done } = await graphReader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
    }
    assert.match(buf, /event: graph-delta/);
    assert.match(buf, /agent-wrote/);
    await graphReader.cancel();
  } finally { await cleanup(); }
});
