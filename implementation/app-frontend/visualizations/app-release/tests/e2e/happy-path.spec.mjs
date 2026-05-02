// @source features/app-release/STORIES.md (US-1, US-2, US-3, US-4, US-9, US-10, US-13)
// @test-id T-E2E-US1, T-E2E-US2, T-E2E-US3, T-E2E-US9, T-E2E-US10, T-E2E-US13
// Integration-grade E2E: drives the server end-to-end without a browser.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { startServer } from '../../server.mjs';
import { MockChatProvider, ev } from '../../lib/chat-provider.mjs';
import { dispatchTool } from '../../lib/agent-tools.mjs';

async function setup() {
  const baseDir = await mkdtemp(join(tmpdir(), 'e2e-happy-'));
  await mkdir(join(baseDir, 'axiom'), { recursive: true });
  await writeFile(join(baseDir, 'axiom/seed.md'), '---\nnode_type: axiom\n---\n\n# Seed\n', 'utf8');
  const provider = new MockChatProvider();
  const handle = await startServer({ domainKnowledgeDir: baseDir, chatProvider: provider, port: 0, host: '127.0.0.1', startWatcher: true });
  return { baseDir, provider, handle, cleanup: async () => { await handle.stop(); await rm(baseDir, { recursive: true, force: true }); } };
}

async function readSseUntil(reader, predicate, timeoutMs = 3000) {
  const decoder = new TextDecoder();
  let buf = '';
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    if (predicate(buf)) return buf;
  }
  throw new Error(`SSE timeout. buf so far:\n${buf.slice(0, 500)}`);
}

const json = (body) => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('greenfield happy path: create → turn-with-tool → graph-delta → metrics → end → file exists', async () => {
  const { baseDir, provider, handle, cleanup } = await setup();
  try {
    // 1. Create session
    const createRes = await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'Discovery flow' }) });
    assert.equal(createRes.status, 201);
    const session = await createRes.json();
    assert.equal(session.status, 'active');

    // 2. Script the agent: take user turn → write a markdown node
    provider.setScript(session.sessionId, [
      async () => {
        const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: 'axiom/auth.md', frontmatter: { node_type: 'axiom', status: 'draft' }, body: '# Auth\n' } });
        return [
          ev('text-delta', { text: 'Anotando o primeiro axioma. ' }),
          ev('tool-use-start', { toolUseId: 'tu1', toolName: 'WriteMarkdownNode', input: { path: 'axiom/auth.md' } }),
          ev('tool-use-result', { toolUseId: 'tu1', toolName: 'WriteMarkdownNode', output: r.output, files: r.files }),
          ev('text-delta', { text: 'Pronto.' }),
          ev('done')
        ];
      }
    ]);

    // 3. Subscribe to session SSE only (graph-delta SSE is covered by server.test.mjs)
    const sessionRes = await fetch(`${handle.url}/api/sessions/${session.sessionId}/stream`);
    const sessionReader = sessionRes.body.getReader();
    await readSseUntil(sessionReader, (buf) => buf.includes('event: session-created'));

    // 4. Send user turn
    const turnRes = await fetch(`${handle.url}/api/sessions/${session.sessionId}/turns`, { method: 'POST', ...json({ turnText: 'precisamos de auth' }) });
    assert.equal(turnRes.status, 202);

    // 5. Wait for tool-use-start, tool-use-result, done in sequence
    const sessionBuf = await readSseUntil(sessionReader, (buf) =>
      buf.includes('event: tool-use-start') && buf.includes('event: tool-use-result') && buf.includes('event: done')
    );
    assert.match(sessionBuf, /Anotando o primeiro axioma/);
    assert.match(sessionBuf, /axiom\/auth/);
    await sessionReader.cancel();

    // 6. Poll /api/graph/index until the new node appears (watcher debounce + chokidar awaitWriteFinish)
    let idx = null;
    const pollStart = Date.now();
    while (Date.now() - pollStart < 5000) {
      idx = await (await fetch(`${handle.url}/api/graph/index`)).json();
      if (idx.nodes.some(n => n.id === 'axiom/auth')) break;
      await new Promise(r => setTimeout(r, 100));
    }
    assert.ok(idx.nodes.some(n => n.id === 'axiom/auth'), 'auth node should appear in index after watcher detects write');
    assert.equal(idx.metrics.nodes, 2, 'seed + auth = 2');
    assert.equal(idx.metrics.axioms, 2);

    // 8. End session, verify file exists with five required sections
    const endRes = await fetch(`${handle.url}/api/sessions/${session.sessionId}/end`, { method: 'POST', ...json({ summary: 'Cobrimos auth.', decisions: ['Use OAuth'], nextSessionPrompt: 'Próximo: refresh tokens.' }) });
    assert.equal(endRes.status, 200);
    const endBody = await endRes.json();
    assert.match(endBody.filePath, /sessions\//);
    const fileContent = await readFile(endBody.filePath, 'utf8');
    assert.match(fileContent, /node_type: session/);
    assert.match(fileContent, /^## Objective$/m);
    assert.match(fileContent, /^## Summary$/m);
    assert.match(fileContent, /^## Decisions$/m);
    assert.match(fileContent, /^## Files touched$/m);
    assert.match(fileContent, /^## Next-session prompt$/m);
    assert.match(fileContent, /Use OAuth/);
    assert.match(fileContent, /axiom\/auth\.md/);
  } finally {
    await cleanup();
  }
});
