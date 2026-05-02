// @source features/app-release/operations.md, states.md, queries.md
// @test-id T-IS-1 ... T-IS-10, T-OP-SRW-*, T-OP-CIT-*, T-OP-END-*, T-OP-RES-*, T-Q-5..T-Q-10

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { SessionStore } from './session-store.mjs';

async function setup() {
  const dir = await mkdtemp(join(tmpdir(), 'session-store-'));
  const store = new SessionStore({ baseDir: dir });
  return { dir, store, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test('create yields an active session and emits session-created', async () => {
  const { store, cleanup } = await setup();
  try {
    let event = null;
    store.once('session-created', (e) => { event = e; });
    const s = store.create({ title: 'Discovery on payments' });
    assert.equal(s.status, 'active');
    assert.match(s.sessionId, /T\d{6}Z-[a-z0-9]{8}/);
    assert.equal(event.sessionId, s.sessionId);
    assert.equal(store.activeIds.length, 1);
  } finally { await cleanup(); }
});

test('captureTurn rejects empty/whitespace turn text', async () => {
  const { store, cleanup } = await setup();
  try {
    const s = store.create({ title: 't' });
    assert.deepEqual(store.captureTurn(s.sessionId, { role: 'user', text: '' }), { ok: false, error: 'EMPTY_TURN' });
    assert.deepEqual(store.captureTurn(s.sessionId, { role: 'user', text: '   ' }), { ok: false, error: 'EMPTY_TURN' });
  } finally { await cleanup(); }
});

test('captureTurn rejects against missing or non-active session', async () => {
  const { store, cleanup } = await setup();
  try {
    const r = store.captureTurn('no-such-id', { role: 'user', text: 'hi' });
    assert.equal(r.error, 'NOT_FOUND');
  } finally { await cleanup(); }
});

test('captureTurn appends to chatHistory and dedupes filesTouched', async () => {
  const { store, cleanup } = await setup();
  try {
    const s = store.create({ title: 't' });
    store.captureTurn(s.sessionId, { role: 'user', text: 'first', filesTouched: ['axiom/a.md'] });
    store.captureTurn(s.sessionId, { role: 'agent', text: 'second', filesTouched: ['axiom/a.md', 'premise/p.md'] });
    const ss = store.get(s.sessionId);
    assert.equal(ss.chatHistory.length, 2);
    assert.deepEqual(ss.filesTouched, ['axiom/a.md', 'premise/p.md']);
  } finally { await cleanup(); }
});

test('end writes session document with five required sections and clears in-memory', async () => {
  const { dir, store, cleanup } = await setup();
  try {
    const s = store.create({ title: 'Auth Service Discovery' });
    store.captureTurn(s.sessionId, { role: 'user', text: 'we need auth', filesTouched: ['axiom/auth.md'] });
    const r = await store.end(s.sessionId, { summary: 'Discussed auth.', decisions: ['Use OAuth'], nextSessionPrompt: 'Cover token refresh.' });
    assert.equal(r.ok, true);
    assert.equal(r.status, 'ended');
    assert.ok(r.filePath.startsWith(join(dir, 'sessions')));
    assert.match(r.filePath, /auth-service-discovery\.md$/);
    const content = await readFile(r.filePath, 'utf8');
    assert.match(content, /^---/);
    assert.match(content, /node_type: session/);
    assert.match(content, /^## Objective$/m);
    assert.match(content, /^## Summary$/m);
    assert.match(content, /^## Decisions$/m);
    assert.match(content, /^## Files touched$/m);
    assert.match(content, /^## Next-session prompt$/m);
    assert.match(content, /Use OAuth/);
    assert.equal(store.activeIds.length, 0);
  } finally { await cleanup(); }
});

test('end is idempotent on already-ended session', async () => {
  const { store, cleanup } = await setup();
  try {
    const s = store.create({ title: 'Idem Title' });
    const r1 = await store.end(s.sessionId, { summary: 'Done.' });
    const r2 = await store.end(s.sessionId, { summary: 'Done again.' });
    assert.equal(r2.ok, true);
    assert.equal(r2.idempotent, true);
    assert.equal(r2.filePath, r1.filePath);
  } finally { await cleanup(); }
});

test('list returns past sessions sorted by endedAt desc, respecting limit and since', async () => {
  const { store, cleanup } = await setup();
  try {
    const s1 = store.create({ title: 'First' });
    await store.end(s1.sessionId, { summary: 'one.' });
    await new Promise(r => setTimeout(r, 10));
    const s2 = store.create({ title: 'Second' });
    await store.end(s2.sessionId, { summary: 'two.' });
    const all = await store.list();
    assert.equal(all.length, 2);
    assert.equal(all[0].title, 'Second');
    const limited = await store.list({ limit: 1 });
    assert.equal(limited.length, 1);
    const sinceMid = await store.list({ since: all[0].endedAt });
    assert.equal(sinceMid.length, 1);
  } finally { await cleanup(); }
});

test('list returns [] when sessions dir does not exist', async () => {
  const { store, cleanup } = await setup();
  try {
    assert.deepEqual(await store.list(), []);
  } finally { await cleanup(); }
});

test('getSummary returns named sections only, never transcript', async () => {
  const { store, cleanup } = await setup();
  try {
    const s = store.create({ title: 'Transcript Test' });
    store.captureTurn(s.sessionId, { role: 'user', text: 'SECRET TRANSCRIPT TEXT' });
    await store.end(s.sessionId, { summary: 'Real summary content.', decisions: ['D1'], nextSessionPrompt: 'NSP' });
    const r = await store.getSummary(s.sessionId);
    assert.equal(r.ok, true);
    assert.match(r.summary, /Real summary content/);
    assert.equal(/SECRET TRANSCRIPT TEXT/.test(r.summary), false);
    assert.equal(/SECRET TRANSCRIPT TEXT/.test(r.nextSessionPrompt), false);
  } finally { await cleanup(); }
});

test('getSummary returns SUMMARY_MISSING when summary section is empty/placeholder', async () => {
  const { store, cleanup } = await setup();
  try {
    const s = store.create({ title: 'no-summary' });
    await store.end(s.sessionId, {});
    const r = await store.getSummary(s.sessionId);
    assert.equal(r.ok, false);
    assert.equal(r.error, 'SUMMARY_MISSING');
  } finally { await cleanup(); }
});

test('resume returns NOT_FOUND for unknown session', async () => {
  const { store, cleanup } = await setup();
  try {
    const r = await store.resume('does-not-exist');
    assert.equal(r.ok, false);
    assert.equal(r.error, 'NOT_FOUND');
  } finally { await cleanup(); }
});

test('resume returns SUMMARY_MISSING when summary placeholder', async () => {
  const { store, cleanup } = await setup();
  try {
    const s = store.create({ title: 'foo' });
    await store.end(s.sessionId, {}); // no summary
    const r = await store.resume(s.sessionId);
    assert.equal(r.error, 'SUMMARY_MISSING');
  } finally { await cleanup(); }
});

test('resume opens a new active session bound to the original document, with summary-only seed context', async () => {
  const { store, cleanup } = await setup();
  try {
    const original = store.create({ title: 'Resumable' });
    store.captureTurn(original.sessionId, { role: 'user', text: 'TRANSCRIPT_LEAK_CHECK' });
    await store.end(original.sessionId, { summary: 'My summary.', decisions: ['D'], nextSessionPrompt: 'Continue.' });
    const r = await store.resume(original.sessionId);
    assert.equal(r.ok, true);
    assert.equal(r.session.status, 'active');
    assert.equal(r.session.resumedFromSessionId, original.sessionId);
    assert.match(r.session.seedContext.summary, /My summary/);
    assert.equal(/TRANSCRIPT_LEAK_CHECK/.test(JSON.stringify(r.session.seedContext)), false);
  } finally { await cleanup(); }
});

test('end with fromResume=true appends `## Resumed at` to original file (preserves prior bytes)', async () => {
  const { store, cleanup } = await setup();
  try {
    const original = store.create({ title: 'Append-Test' });
    await store.end(original.sessionId, { summary: 'Initial summary.' });
    const sizeBefore = (await readFile((await store.list())[0].path, 'utf8')).length;
    const resumed = await store.resume(original.sessionId);
    store.captureTurn(resumed.session.sessionId, { role: 'user', text: 'continuation turn' });
    await store.end(resumed.session.sessionId, {
      summary: 'Continuation summary.',
      fromResume: true,
      originalPath: resumed.resumedFromFilePath
    });
    const after = await readFile(resumed.resumedFromFilePath, 'utf8');
    assert.ok(after.length >= sizeBefore);
    assert.match(after, /## Resumed at \d{4}-\d{2}-\d{2}T/);
    assert.match(after, /Continuation summary/);
  } finally { await cleanup(); }
});

test('multiple active sessions can coexist (no global lock)', async () => {
  const { store, cleanup } = await setup();
  try {
    const a = store.create({ title: 'A' });
    const b = store.create({ title: 'B' });
    const c = store.create({ title: 'C' });
    assert.equal(store.activeIds.length, 3);
    store.captureTurn(a.sessionId, { role: 'user', text: 'a' });
    store.captureTurn(b.sessionId, { role: 'user', text: 'b' });
    assert.equal(store.get(a.sessionId).chatHistory.length, 1);
    assert.equal(store.get(b.sessionId).chatHistory.length, 1);
    assert.equal(store.get(c.sessionId).chatHistory.length, 0);
  } finally { await cleanup(); }
});
