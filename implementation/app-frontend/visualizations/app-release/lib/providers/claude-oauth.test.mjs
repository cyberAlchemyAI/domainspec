// @source features/app-release/operations.md (claude-oauth provider scaffolding)
// Provider stub returns AUTH_MISSING/SDK_MISSING/NOT_ACTIVATED rather than crashing.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createClaudeOauthProvider, TOOL_SCHEMAS, DEFAULT_SYSTEM_PROMPT } from './claude-oauth.mjs';

async function collect(asyncIter) {
  const out = [];
  for await (const e of asyncIter) out.push(e);
  return out;
}

test('throws if domainKnowledgeDir is omitted', () => {
  assert.throws(() => createClaudeOauthProvider({}), /domainKnowledgeDir/);
});

test('emits AUTH_MISSING when CLAUDE_CODE_OAUTH not set', async () => {
  delete process.env.CLAUDE_CODE_OAUTH;
  const p = createClaudeOauthProvider({ domainKnowledgeDir: '/tmp/x' });
  const events = await collect(p.respond('s', 'hi', { sessionId: 's', chatHistory: [] }));
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'error');
  assert.equal(events[0].code, 'AUTH_MISSING');
});

test('emits SDK_MISSING when SDK package cannot be resolved (with fake package name)', async () => {
  process.env.CLAUDE_CODE_OAUTH = '1';
  try {
    const p = createClaudeOauthProvider({ domainKnowledgeDir: '/tmp/x', sdkPackage: '@nonexistent/sdk-package-xyz123' });
    const events = await collect(p.respond('s', 'hi', { sessionId: 's', chatHistory: [] }));
    assert.equal(events[0].type, 'error');
    assert.equal(events[0].code, 'SDK_MISSING');
  } finally {
    delete process.env.CLAUDE_CODE_OAUTH;
  }
});

test('exports the four agent tool schemas with correct names', () => {
  assert.equal(TOOL_SCHEMAS.length, 4);
  const names = TOOL_SCHEMAS.map(t => t.name).sort();
  assert.deepEqual(names, ['AddConnection', 'AppendSection', 'UpdateFrontmatter', 'WriteMarkdownNode']);
  for (const t of TOOL_SCHEMAS) {
    assert.ok(t.input_schema);
    assert.ok(Array.isArray(t.input_schema.required));
  }
});

test('default system prompt mentions all four tool names', () => {
  for (const tool of ['WriteMarkdownNode', 'AppendSection', 'UpdateFrontmatter', 'AddConnection']) {
    assert.ok(DEFAULT_SYSTEM_PROMPT.includes(tool), `missing ${tool} in system prompt`);
  }
});
