// @source features/app-release/operations.md (W1.3)
// @test-id T-OP-WMN-*, T-OP-APS-*, T-OP-UFM-*, T-OP-ADC-*

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { dispatchTool, ToolError } from './agent-tools.mjs';

async function setup() {
  const baseDir = await mkdtemp(join(tmpdir(), 'agent-tools-'));
  return { baseDir, cleanup: () => rm(baseDir, { recursive: true, force: true }) };
}

// ─── WriteMarkdownNode ─────────────────────────────────────────────

test('WriteMarkdownNode creates a file with frontmatter and body', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: 'axiom/foo.md', frontmatter: { node_type: 'axiom', status: 'draft' }, body: '# Foo\n\nBody.' } });
    assert.equal(r.ok, true);
    const content = await readFile(join(baseDir, 'axiom/foo.md'), 'utf8');
    assert.match(content, /^---\nnode_type: axiom\nstatus: draft\n---/);
    assert.match(content, /# Foo/);
  } finally { await cleanup(); }
});

test('WriteMarkdownNode rejects path traversal', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: '../escape.md', frontmatter: { node_type: 'x' }, body: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'INVALID_PATH');
  } finally { await cleanup(); }
});

test('WriteMarkdownNode rejects absolute paths', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: '/etc/passwd.md', frontmatter: { node_type: 'x' }, body: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'INVALID_PATH');
  } finally { await cleanup(); }
});

test('WriteMarkdownNode rejects existing path', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    await mkdir(join(baseDir, 'axiom'), { recursive: true });
    await writeFile(join(baseDir, 'axiom/exists.md'), 'existing', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: 'axiom/exists.md', frontmatter: { node_type: 'x' }, body: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'PATH_EXISTS');
  } finally { await cleanup(); }
});

test('WriteMarkdownNode rejects missing node_type', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'WriteMarkdownNode', input: { path: 'a.md', frontmatter: { tags: [] }, body: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'MISSING_NODE_TYPE');
  } finally { await cleanup(); }
});

// ─── AppendSection ─────────────────────────────────────────────────

test('AppendSection appends a `## Heading` block', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'a.md');
    await writeFile(file, '---\nnode_type: x\n---\n\n# Title\n', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'AppendSection', input: { path: 'a.md', heading: '## Notes', content: 'Some notes.' } });
    assert.equal(r.ok, true);
    const out = await readFile(file, 'utf8');
    assert.match(out, /## Notes\n\nSome notes\./);
  } finally { await cleanup(); }
});

test('AppendSection rejects missing file', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'AppendSection', input: { path: 'nope.md', heading: '## H', content: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'NOT_FOUND');
  } finally { await cleanup(); }
});

test('AppendSection rejects heading without `## ` prefix', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'b.md');
    await writeFile(file, '---\nnode_type: x\n---\n\n', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'AppendSection', input: { path: 'b.md', heading: 'No prefix', content: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'INVALID_HEADING');
  } finally { await cleanup(); }
});

// ─── UpdateFrontmatter ─────────────────────────────────────────────

test('UpdateFrontmatter shallow-merges patch and preserves body', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'c.md');
    await writeFile(file, '---\nnode_type: axiom\nstatus: draft\n---\n\n# Body title\n\nBody text.', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'UpdateFrontmatter', input: { path: 'c.md', patch: { status: 'active' } } });
    assert.equal(r.ok, true);
    const out = await readFile(file, 'utf8');
    assert.match(out, /node_type: axiom/);
    assert.match(out, /status: active/);
    assert.match(out, /# Body title\n\nBody text\./);
  } finally { await cleanup(); }
});

test('UpdateFrontmatter rejects null-out of node_type', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'd.md');
    await writeFile(file, '---\nnode_type: axiom\n---\n', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'UpdateFrontmatter', input: { path: 'd.md', patch: { node_type: null } } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'CANNOT_NULL_NODE_TYPE');
  } finally { await cleanup(); }
});

test('UpdateFrontmatter rejects last_updated set to non-current ISO date', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'e.md');
    await writeFile(file, '---\nnode_type: x\n---\n', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'UpdateFrontmatter', input: { path: 'e.md', patch: { last_updated: '1999-01-01' } } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'INVALID_LAST_UPDATED');
  } finally { await cleanup(); }
});

test('UpdateFrontmatter accepts last_updated equal to today', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'f.md');
    await writeFile(file, '---\nnode_type: x\n---\n', 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    const r = await dispatchTool({ baseDir, toolName: 'UpdateFrontmatter', input: { path: 'f.md', patch: { last_updated: today } } });
    assert.equal(r.ok, true);
  } finally { await cleanup(); }
});

// ─── AddConnection ─────────────────────────────────────────────────

test('AddConnection appends a row when source missing Connections section (creates it)', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'g.md');
    await writeFile(file, '---\nnode_type: x\n---\n\n# G\n', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'AddConnection', input: { sourcePath: 'g.md', targetWikilink: '[[premise/p1]]', relationType: 'derives-from', description: 'because' } });
    assert.equal(r.ok, true);
    const out = await readFile(file, 'utf8');
    assert.match(out, /## Connections/);
    assert.match(out, /\| \[\[premise\/p1\]\] \| derives-from \| because \|/);
  } finally { await cleanup(); }
});

test('AddConnection is idempotent on duplicate (target, relationType)', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'h.md');
    await writeFile(file, '---\nnode_type: x\n---\n\n# H\n', 'utf8');
    await dispatchTool({ baseDir, toolName: 'AddConnection', input: { sourcePath: 'h.md', targetWikilink: '[[a]]', relationType: 'references', description: 'one' } });
    const r2 = await dispatchTool({ baseDir, toolName: 'AddConnection', input: { sourcePath: 'h.md', targetWikilink: '[[a]]', relationType: 'references', description: 'two' } });
    assert.equal(r2.ok, true);
    assert.equal(r2.output.idempotent, true);
    const out = await readFile(file, 'utf8');
    assert.equal(out.match(/\[\[a\]\]/g).length, 1);
  } finally { await cleanup(); }
});

test('AddConnection rejects missing source', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'AddConnection', input: { sourcePath: 'missing.md', targetWikilink: '[[a]]', relationType: 'r', description: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'NOT_FOUND');
  } finally { await cleanup(); }
});

test('AddConnection rejects malformed wikilink', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const file = join(baseDir, 'i.md');
    await writeFile(file, '---\nnode_type: x\n---\n', 'utf8');
    const r = await dispatchTool({ baseDir, toolName: 'AddConnection', input: { sourcePath: 'i.md', targetWikilink: 'not-a-wikilink', relationType: 'r', description: '' } });
    assert.equal(r.ok, false);
    assert.equal(r.output.code, 'INVALID_WIKILINK');
  } finally { await cleanup(); }
});

// ─── Dispatch ──────────────────────────────────────────────────────

test('dispatchTool returns error for unknown tool name', async () => {
  const { baseDir, cleanup } = await setup();
  try {
    const r = await dispatchTool({ baseDir, toolName: 'NonExistent', input: {} });
    assert.equal(r.ok, false);
    assert.match(r.output.error, /Unknown tool/);
  } finally { await cleanup(); }
});
