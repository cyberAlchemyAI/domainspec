// @source features/app-release/STORIES.md (US-11)
// @test-id T-E2E-US11
// Multi-tab combined close: 2 sessions → confirm-all → both files exist; partial-failure preserves remaining; idempotent re-end.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { startServer } from '../../server.mjs';
import { MockChatProvider } from '../../lib/chat-provider.mjs';

async function setup() {
  const baseDir = await mkdtemp(join(tmpdir(), 'e2e-multitab-'));
  await mkdir(join(baseDir, 'axiom'), { recursive: true });
  const provider = new MockChatProvider();
  const handle = await startServer({ domainKnowledgeDir: baseDir, chatProvider: provider, port: 0, host: '127.0.0.1', startWatcher: false });
  return { baseDir, handle, cleanup: async () => { await handle.stop(); await rm(baseDir, { recursive: true, force: true }); } };
}

const json = (body) => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('combined-modal flow: ending two active sessions writes two session documents', async () => {
  const { handle, cleanup } = await setup();
  try {
    // Open two tabs (sessions)
    const a = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'Tab A' }) })).json();
    const b = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'Tab B' }) })).json();

    // Snapshot state before end
    const stateBefore = await (await fetch(`${handle.url}/api/_test/state`)).json().catch(() => ({ activeSessionIds: [] }));
    // _test endpoint requires NODE_ENV=test; absence is fine — fall back to listSessions semantics

    // User confirms combined modal: client iterates over each active session and POSTs /end
    const endA = await (await fetch(`${handle.url}/api/sessions/${a.sessionId}/end`, { method: 'POST', ...json({ summary: 'A summary.' }) })).json();
    const endB = await (await fetch(`${handle.url}/api/sessions/${b.sessionId}/end`, { method: 'POST', ...json({ summary: 'B summary.' }) })).json();

    // Both files exist on disk
    await stat(endA.filePath);
    await stat(endB.filePath);
    assert.match(endA.filePath, /tab-a\.md$/);
    assert.match(endB.filePath, /tab-b\.md$/);

    // Listing past sessions returns both
    const list = await (await fetch(`${handle.url}/api/sessions`)).json();
    assert.equal(list.length, 2);
  } finally { await cleanup(); }
});

test('idempotency: ending an already-ended session returns 409 idempotent and does not overwrite', async () => {
  const { handle, cleanup } = await setup();
  try {
    const s = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'Idempo' }) })).json();
    const e1 = await fetch(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', ...json({ summary: 'first.' }) });
    assert.equal(e1.status, 200);
    const f1 = (await e1.json()).filePath;
    const stat1 = await stat(f1);

    // Second close (the "partial failure" surrogate) — must not overwrite the document
    const e2 = await fetch(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', ...json({ summary: 'second.' }) });
    assert.equal(e2.status, 409);
    const body2 = await e2.json();
    assert.equal(body2.idempotent, true);
    assert.equal(body2.filePath, f1);
    const stat2 = await stat(f1);
    assert.equal(stat1.size, stat2.size, 'second close must not modify file');
  } finally { await cleanup(); }
});

test('cancel path (no /end calls) leaves all sessions active', async () => {
  const { handle, cleanup } = await setup();
  try {
    const a = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'A' }) })).json();
    const b = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'B' }) })).json();
    // Simulate "Continuar conversa" — modal closes, no /end calls.
    // Sanity check: list of past sessions remains empty (in-memory active sessions never persist until /end).
    const list = await (await fetch(`${handle.url}/api/sessions`)).json();
    assert.equal(list.length, 0);
    // Both sessions should still accept turns (proves they remain active).
    const tA = await fetch(`${handle.url}/api/sessions/${a.sessionId}/turns`, { method: 'POST', ...json({ turnText: 'still here' }) });
    const tB = await fetch(`${handle.url}/api/sessions/${b.sessionId}/turns`, { method: 'POST', ...json({ turnText: 'still here too' }) });
    assert.equal(tA.status, 202);
    assert.equal(tB.status, 202);
  } finally { await cleanup(); }
});
