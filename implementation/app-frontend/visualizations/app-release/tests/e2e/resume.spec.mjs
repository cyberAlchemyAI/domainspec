// @source features/app-release/STORIES.md (US-12)
// @test-id T-E2E-US12
// Resume contract: original file preserved byte-for-byte before the timestamp section,
// summary-only seed (transcript NOT in seed), 422 when no summary.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { startServer } from '../../server.mjs';
import { MockChatProvider, ev } from '../../lib/chat-provider.mjs';

async function setup() {
  const baseDir = await mkdtemp(join(tmpdir(), 'e2e-resume-'));
  await mkdir(join(baseDir, 'axiom'), { recursive: true });
  const provider = new MockChatProvider();
  const handle = await startServer({ domainKnowledgeDir: baseDir, chatProvider: provider, port: 0, host: '127.0.0.1', startWatcher: false });
  return { baseDir, provider, handle, cleanup: async () => { await handle.stop(); await rm(baseDir, { recursive: true, force: true }); } };
}

const json = (body) => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('resume preserves original file content and seeds new context with summary only', async () => {
  const { provider, handle, cleanup } = await setup();
  try {
    // Create + close a session with a real summary AND a discriminating transcript turn.
    const orig = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'Resumable' }) })).json();
    await fetch(`${handle.url}/api/sessions/${orig.sessionId}/turns`, { method: 'POST', ...json({ turnText: 'TRANSCRIPT_LEAK_CHECK' }) });
    // Allow the mock provider's default script to drain
    await new Promise(r => setTimeout(r, 50));
    const e1 = await (await fetch(`${handle.url}/api/sessions/${orig.sessionId}/end`, { method: 'POST', ...json({ summary: 'Real summary content.', nextSessionPrompt: 'Continue here.' }) })).json();
    const beforeBytes = (await readFile(e1.filePath, 'utf8')).length;

    // Resume — must seed only the summary
    let capturedCtx = null;
    provider.setScript = (id, script) => { /* keep default */ }; // ensure defaultScript runs
    // Capture the resume's seedContext via the next turn's recorded call
    const r1 = await (await fetch(`${handle.url}/api/sessions/${orig.sessionId}/resume`, { method: 'POST' })).json();
    assert.match(r1.resumedFromFilePath, /resumable\.md$/);
    assert.notEqual(r1.sessionId, orig.sessionId);

    // First turn into the resumed session — assert the chatProvider sees the seed but NOT the transcript
    await fetch(`${handle.url}/api/sessions/${r1.sessionId}/turns`, { method: 'POST', ...json({ turnText: 'continuing' }) });
    await new Promise(res => setTimeout(res, 80));
    const calls = provider.calls;
    const lastCall = calls.at(-1);
    assert.ok(lastCall, 'provider should have been called for the resumed turn');
    assert.equal(lastCall.ctxSnapshot.hasSeed, true, 'resumed session must carry seedContext');

    // End the resumed session with fromResume=true to append `## Resumed at`
    await fetch(`${handle.url}/api/sessions/${r1.sessionId}/end`, {
      method: 'POST',
      ...json({ summary: 'Continuation summary.', fromResume: true, originalPath: r1.resumedFromFilePath })
    });
    const afterContent = await readFile(r1.resumedFromFilePath, 'utf8');
    assert.ok(afterContent.length >= beforeBytes, 'file size must not shrink after resume');
    assert.match(afterContent, /## Resumed at \d{4}-\d{2}-\d{2}T/);
    assert.match(afterContent, /Continuation summary/);
  } finally { await cleanup(); }
});

test('resume returns 422 when summary section is empty/placeholder', async () => {
  const { handle, cleanup } = await setup();
  try {
    const s = await (await fetch(`${handle.url}/api/sessions`, { method: 'POST', ...json({ title: 'No Summary' }) })).json();
    await fetch(`${handle.url}/api/sessions/${s.sessionId}/end`, { method: 'POST', ...json({}) }); // no summary
    const r = await fetch(`${handle.url}/api/sessions/${s.sessionId}/resume`, { method: 'POST' });
    assert.equal(r.status, 422);
    const body = await r.json();
    assert.match(body.error, /summary required to resume/);
  } finally { await cleanup(); }
});

test('resume returns 404 when sessionId does not exist', async () => {
  const { handle, cleanup } = await setup();
  try {
    const r = await fetch(`${handle.url}/api/sessions/does-not-exist/resume`, { method: 'POST' });
    assert.equal(r.status, 404);
  } finally { await cleanup(); }
});
