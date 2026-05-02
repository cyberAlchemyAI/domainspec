// @source features/app-release/workflows.md#projectionrefreshpolicy
// @test-id T-WF-3, T-WF-4, T-WF-5, T-MP-9, T-MP-10

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, unlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { GraphIndex } from './graph-index.mjs';
import { GraphWatcher } from './graph-watcher.mjs';

function deltaPromise(watcher) {
  return new Promise((resolve, reject) => {
    const onDelta = (d) => { cleanup(); resolve(d); };
    const onError = (e) => { cleanup(); reject(new Error(JSON.stringify(e))); };
    const cleanup = () => {
      watcher.off('delta', onDelta);
      watcher.off('error', onError);
    };
    watcher.once('delta', onDelta);
    watcher.once('error', onError);
  });
}

async function setupTmp() {
  const dir = await mkdtemp(join(tmpdir(), 'graph-watcher-'));
  await mkdir(join(dir, 'axiom'), { recursive: true });
  return dir;
}

test('add fires a debounced delta with the new node', async () => {
  const dir = await setupTmp();
  const idx = new GraphIndex({ baseDir: dir });
  await idx.loadAll();
  const w = new GraphWatcher({ index: idx, baseDir: dir, debounceMs: 80 });
  w.start();
  try {
    // Wait for chokidar to be ready before issuing fs writes
    await new Promise((r) => setTimeout(r, 200));
    const wait = deltaPromise(w);
    await writeFile(join(dir, 'axiom', 'x.md'), '---\nnode_type: axiom\n---\n\n# X\n', 'utf8');
    const delta = await wait;
    assert.equal(delta.added.length + delta.updated.length, 1);
    assert.equal(delta.metrics.nodes, 1);
  } finally {
    await w.stop();
    await rm(dir, { recursive: true, force: true });
  }
});

test('multi-file batch within debounce window coalesces into one delta', async () => {
  const dir = await setupTmp();
  const idx = new GraphIndex({ baseDir: dir });
  await idx.loadAll();
  const w = new GraphWatcher({ index: idx, baseDir: dir, debounceMs: 150 });
  w.start();
  try {
    await new Promise((r) => setTimeout(r, 200));
    const wait = deltaPromise(w);
    await Promise.all([
      writeFile(join(dir, 'axiom', 'a.md'), '---\nnode_type: axiom\n---\n\n# A\n', 'utf8'),
      writeFile(join(dir, 'axiom', 'b.md'), '---\nnode_type: axiom\n---\n\n# B\n', 'utf8'),
      writeFile(join(dir, 'axiom', 'c.md'), '---\nnode_type: axiom\n---\n\n# C\n', 'utf8')
    ]);
    const delta = await wait;
    assert.equal(delta.added.length + delta.updated.length, 3);
    assert.equal(delta.metrics.nodes, 3);
  } finally {
    await w.stop();
    await rm(dir, { recursive: true, force: true });
  }
});

test('unlink fires delta with removed node', async () => {
  const dir = await setupTmp();
  const filePath = join(dir, 'axiom', 'gone.md');
  await writeFile(filePath, '---\nnode_type: axiom\n---\n\n# Gone\n', 'utf8');
  const idx = new GraphIndex({ baseDir: dir });
  await idx.loadAll();
  const w = new GraphWatcher({ index: idx, baseDir: dir, debounceMs: 80 });
  w.start();
  try {
    await new Promise((r) => setTimeout(r, 200));
    const wait = deltaPromise(w);
    await unlink(filePath);
    const delta = await wait;
    assert.equal(delta.removed.length, 1);
    assert.equal(delta.metrics.nodes, 0);
  } finally {
    await w.stop();
    await rm(dir, { recursive: true, force: true });
  }
});

test('non-md file changes are ignored', async () => {
  const dir = await setupTmp();
  const idx = new GraphIndex({ baseDir: dir });
  await idx.loadAll();
  const w = new GraphWatcher({ index: idx, baseDir: dir, debounceMs: 100 });
  w.start();
  try {
    await new Promise((r) => setTimeout(r, 200));
    let fired = false;
    w.once('delta', () => { fired = true; });
    await writeFile(join(dir, 'README.txt'), 'not markdown', 'utf8');
    await new Promise((r) => setTimeout(r, 250));
    assert.equal(fired, false);
  } finally {
    await w.stop();
    await rm(dir, { recursive: true, force: true });
  }
});

test('overflow triggers full re-snapshot and WATCHER_OVERFLOW error event', async () => {
  const dir = await setupTmp();
  const idx = new GraphIndex({ baseDir: dir });
  await idx.loadAll();
  // Manually push entries past the overflow without waiting for chokidar
  const w = new GraphWatcher({ index: idx, baseDir: dir, debounceMs: 50, batchOverflow: 2 });
  w.start();
  try {
    const errPromise = new Promise((resolve) => w.once('error', resolve));
    // bypass watcher and inject directly
    w._enqueue(join(dir, 'a.md'), 'add');
    w._enqueue(join(dir, 'b.md'), 'add');
    w._enqueue(join(dir, 'c.md'), 'add');
    const err = await errPromise;
    assert.equal(err.code, 'WATCHER_OVERFLOW');
    assert.equal(err.batchSize, 3);
  } finally {
    await w.stop();
    await rm(dir, { recursive: true, force: true });
  }
});
