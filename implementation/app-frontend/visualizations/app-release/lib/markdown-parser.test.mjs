// @source features/app-release/mappings.md#interviewturntodomainmapupdate
// @test-id T-MP-9 (parser stage of W2.1)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { parseMarkdown, parseMarkdownFile } from './markdown-parser.mjs';

test('parses frontmatter, title, and connections table', () => {
  const content = [
    '---',
    'tags: [foo, bar]',
    'node_type: axiom',
    'status: draft',
    'is_session: false',
    'layer: ontology, architecture',
    '---',
    '',
    '# Some Axiom',
    '',
    'Body content here.',
    '',
    '## Connections',
    '',
    '| Document | Type | Description |',
    '|---|---|---|',
    '| [[other-node]] | `derives-from` | Because reasons |',
    '| [[third-node]] | references | Other reasons |',
    ''
  ].join('\n');
  const { node, edges } = parseMarkdown(content, '/base/axiom/some.md', '/base');
  assert.equal(node.id, 'axiom/some');
  assert.equal(node.path, 'axiom/some.md');
  assert.equal(node.title, 'Some Axiom');
  assert.deepEqual(node.frontmatter.tags, ['foo', 'bar']);
  assert.equal(node.frontmatter.node_type, 'axiom');
  assert.equal(node.frontmatter.status, 'draft');
  assert.equal(node.frontmatter.is_session, false);
  assert.deepEqual(node.frontmatter.layer, ['ontology', 'architecture']);
  assert.equal(edges.length, 2);
  assert.deepEqual(edges[0], { source: 'axiom/some', target: 'other-node', type: 'derives-from', description: 'Because reasons' });
  assert.deepEqual(edges[1], { source: 'axiom/some', target: 'third-node', type: 'references', description: 'Other reasons' });
});

test('handles a file with no frontmatter', () => {
  const content = '# Just a title\n\nBody.';
  const { node, edges } = parseMarkdown(content, '/x/simple.md', '/x');
  assert.deepEqual(node.frontmatter, {});
  assert.equal(node.title, 'Just a title');
  assert.equal(edges.length, 0);
});

test('handles a file with no Connections section', () => {
  const content = '---\nnode_type: premise\n---\n\n# Title\n\nNo edges here.\n';
  const { edges } = parseMarkdown(content, '/x/p.md', '/x');
  assert.equal(edges.length, 0);
});

test('falls back to basename when no title heading exists', () => {
  const content = '---\nnode_type: conceptual\n---\n\nNo heading.';
  const { node } = parseMarkdown(content, '/x/no-title.md', '/x');
  assert.equal(node.title, 'no-title');
});

test('Connections section ending with another heading bounds the table', () => {
  const content = [
    '---', 'node_type: axiom', '---', '',
    '## Connections', '',
    '| Document | Type | Description |',
    '|---|---|---|',
    '| [[a]] | references | x |',
    '',
    '## Other Section',
    '',
    '| [[b]] | not | an edge |'
  ].join('\n');
  const { edges } = parseMarkdown(content, '/x/y.md', '/x');
  assert.equal(edges.length, 1);
  assert.equal(edges[0].target, 'a');
});

test('parseMarkdownFile reads from disk', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'markdown-parser-'));
  try {
    const file = join(dir, 'sample.md');
    await writeFile(file, '---\nnode_type: discovery\n---\n\n# Disk Title\n', 'utf8');
    const { node } = await parseMarkdownFile(file, dir);
    assert.equal(node.title, 'Disk Title');
    assert.equal(node.path, 'sample.md');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
