// @source features/app-release/interfaces.md#internal-chatprovider-interface
// @test-id T-IF-SSE-5 (event sequencing contract)

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { MockChatProvider, ev } from './chat-provider.mjs';

async function collect(asyncIter) {
  const out = [];
  for await (const e of asyncIter) out.push(e);
  return out;
}

test('MockChatProvider emits the default script in order', async () => {
  const p = new MockChatProvider();
  const events = await collect(p.respond('s1', 'oi', { sessionId: 's1', chatHistory: [] }));
  assert.equal(events.length, 3);
  assert.equal(events[0].type, 'text-delta');
  assert.equal(events[2].type, 'done');
});

test('MockChatProvider per-session script overrides default', async () => {
  const p = new MockChatProvider();
  p.setScript('s2', [
    ev('text-delta', { text: 'A' }),
    ev('tool-use-start', { toolUseId: 't1', toolName: 'WriteMarkdownNode', input: { path: 'axiom/x.md' } }),
    ev('tool-use-result', { toolUseId: 't1', toolName: 'WriteMarkdownNode', output: { ok: true } }),
    ev('text-delta', { text: 'B' }),
    ev('done')
  ]);
  const events = await collect(p.respond('s2', 'go', { sessionId: 's2', chatHistory: [] }));
  assert.deepEqual(events.map(e => e.type), ['text-delta', 'tool-use-start', 'tool-use-result', 'text-delta', 'done']);
  // toolUseId correlation
  const start = events.find(e => e.type === 'tool-use-start');
  const result = events.find(e => e.type === 'tool-use-result');
  assert.equal(start.toolUseId, result.toolUseId);
});

test('MockChatProvider records calls (for assertions on what context was passed)', async () => {
  const p = new MockChatProvider();
  await collect(p.respond('s3', 'first turn', { sessionId: 's3', chatHistory: [], seedContext: { summary: 'x' } }));
  assert.equal(p.calls.length, 1);
  assert.equal(p.calls[0].sessionId, 's3');
  assert.equal(p.calls[0].userTurn, 'first turn');
  assert.equal(p.calls[0].ctxSnapshot.hasSeed, true);
});

test('MockChatProvider supports script functions that read ctx', async () => {
  const p = new MockChatProvider();
  p.setScript('s4', [
    (ctx) => [ev('text-delta', { text: `Echo: ${ctx.chatHistory.length}` }), ev('done')]
  ]);
  const events = await collect(p.respond('s4', 'x', { sessionId: 's4', chatHistory: [{ role: 'user', text: 'y' }] }));
  assert.equal(events[0].text, 'Echo: 1');
});

test('MockChatProvider can emit error events', async () => {
  const p = new MockChatProvider();
  p.setScript('s5', [ev('error', { code: 'AUTH_MISSING', message: 'need oauth' })]);
  const events = await collect(p.respond('s5', 'x', { sessionId: 's5', chatHistory: [] }));
  assert.equal(events[0].type, 'error');
  assert.equal(events[0].code, 'AUTH_MISSING');
});
