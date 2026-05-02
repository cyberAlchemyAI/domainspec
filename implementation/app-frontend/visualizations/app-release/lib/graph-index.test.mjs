// @source features/app-release/queries.md#getworkspaceoverview
// @test-id T-Q-1, T-Q-2, T-Q-3, T-OP-GWP-3

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { GraphIndex } from './graph-index.mjs';

async function setupFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'graph-index-'));
  await mkdir(join(dir, 'axiom'), { recursive: true });
  await mkdir(join(dir, 'premise'), { recursive: true });
  await mkdir(join(dir, 'sessions'), { recursive: true });
  await writeFile(join(dir, 'axiom', 'a.md'),
    '---\nnode_type: axiom\nstatus: draft\n---\n\n# A\n\n## Connections\n\n| Document | Type | Description |\n|---|---|---|\n| [[premise/p1]] | derives-from | seed |\n', 'utf8');
  await writeFile(join(dir, 'premise', 'p1.md'),
    '---\nnode_type: premise\nstatus: active\n---\n\n# P1\n', 'utf8');
  await writeFile(join(dir, 'sessions', '2026-01-01-a.md'),
    '---\nnode_type: session\nstatus: draft\n---\n\n# Session\n\n## Connections\n\n| Document | Type | Description |\n|---|---|---|\n| [[axiom/a]] | references | x |\n', 'utf8');
  return dir;
}

test('loadAll indexes nodes and edges, excluding sessions from metrics', async () => {
  const dir = await setupFixture();
  try {
    const idx = new GraphIndex({ baseDir: dir });
    const snap = await idx.loadAll();
    assert.equal(snap.metrics.nodes, 2);
    assert.equal(snap.metrics.axioms, 1);
    assert.equal(snap.metrics.drafts, 1);
    assert.equal(snap.metrics.edges, 1);
    assert.equal(snap.nodes.length, 2);
    assert.equal(snap.edges.length, 1);
    assert.equal(snap.edges[0].source, 'axiom/a');
    assert.equal(snap.edges[0].target, 'premise/p1');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('upsert returns added/updated kind and bumps version', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'graph-index-'));
  try {
    await mkdir(join(dir, 'conceptual'), { recursive: true });
    const path = join(dir, 'conceptual', 'c.md');
    await writeFile(path, '---\nnode_type: conceptual\n---\n\n# C\n', 'utf8');
    const idx = new GraphIndex({ baseDir: dir });
    await idx.loadAll();
    const v0 = idx.version;
    const r1 = await idx.upsert(path);
    assert.equal(r1.kind, 'updated'); // already loaded
    assert.ok(idx.version > v0);
    const newPath = join(dir, 'conceptual', 'd.md');
    await writeFile(newPath, '---\nnode_type: conceptual\n---\n\n# D\n', 'utf8');
    const r2 = await idx.upsert(newPath);
    assert.equal(r2.kind, 'added');
    assert.equal(idx.metrics().nodes, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('remove drops node and edges', async () => {
  const dir = await setupFixture();
  try {
    const idx = new GraphIndex({ baseDir: dir });
    await idx.loadAll();
    assert.equal(idx.metrics().nodes, 2);
    const r = idx.remove(join(dir, 'axiom', 'a.md'));
    assert.equal(r.kind, 'removed');
    const snap = idx.snapshot();
    assert.equal(snap.metrics.nodes, 1);
    assert.equal(snap.edges.length, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('empty domain_knowledge yields zero metrics', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'graph-index-empty-'));
  try {
    const idx = new GraphIndex({ baseDir: dir });
    const snap = await idx.loadAll();
    assert.deepEqual(snap.metrics, { nodes: 0, edges: 0, axioms: 0, drafts: 0 });
    assert.equal(snap.nodes.length, 0);
    assert.equal(snap.edges.length, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('non-existent baseDir does not crash; loadAll yields empty', async () => {
  const idx = new GraphIndex({ baseDir: '/nonexistent/path/xyz123' });
  const snap = await idx.loadAll();
  assert.deepEqual(snap.metrics, { nodes: 0, edges: 0, axioms: 0, drafts: 0 });
});

test('getEdgesFrom returns edges originating from a node', async () => {
  const dir = await setupFixture();
  try {
    const idx = new GraphIndex({ baseDir: dir });
    await idx.loadAll();
    const edges = idx.getEdgesFrom('axiom/a');
    assert.equal(edges.length, 1);
    assert.equal(edges[0].target, 'premise/p1');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
