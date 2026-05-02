// @source features/app-release/operations.md (WriteMarkdownNode, AppendSection, UpdateFrontmatter, AddConnection)
// @source features/app-release/interfaces.md#internal-chatprovider-interface
// claude-oauth ChatProvider — wraps the Claude Agent SDK using the user's existing Claude Code OAuth login.
//
// Phase 1 stance:
//   - The SDK package name is held behind a dynamic import so this file imports cleanly even when the dep is absent.
//   - W5 (skills authored as separate files) is deferred — the system prompt is taken from `opts.systemPrompt` if provided,
//     otherwise a minimal greenfield interview prompt is inlined here. Future work: load from `.claude/skills/interview-script/SKILL.md`.
//   - Filesystem mutations are dispatched via the four agent tool ops; this module re-exports the dispatchers so that
//     unit tests in `lib/agent-tools.mjs` can target them without booting the SDK.

import { ev } from '../chat-provider.mjs';
import { dispatchTool } from '../agent-tools.mjs';

const DEFAULT_SYSTEM_PROMPT = [
  'You are the Harness interview agent. Your job is to interview the user about a software domain and capture',
  'their answers as durable markdown nodes under `domain_knowledge/`.',
  '',
  'Available tools (use them — do not narrate writes you have not actually performed):',
  '- WriteMarkdownNode(path, frontmatter, body) — create a new node',
  '- AppendSection(path, heading, content) — extend an existing node',
  '- UpdateFrontmatter(path, patch) — patch a node\'s YAML frontmatter',
  '- AddConnection(sourcePath, targetWikilink, relationType, description) — link two nodes',
  '',
  'Question flow: scope → actors → workflows → constraints → ambiguities. Advance when the user has given',
  'enough evidence; branch when something surprising surfaces; wrap up when scope is satisfied.'
].join('\n');

const TOOL_SCHEMAS = [
  {
    name: 'WriteMarkdownNode',
    description: 'Create a new markdown node under domain_knowledge/.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path under domain_knowledge/, must end in .md' },
        frontmatter: { type: 'object', description: 'YAML frontmatter; must include node_type' },
        body: { type: 'string' }
      },
      required: ['path', 'frontmatter', 'body']
    }
  },
  {
    name: 'AppendSection',
    description: 'Append a `## Heading` section to an existing node.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        heading: { type: 'string', description: 'Must start with `## `' },
        content: { type: 'string' }
      },
      required: ['path', 'heading', 'content']
    }
  },
  {
    name: 'UpdateFrontmatter',
    description: 'Shallow-merge patch into the node\'s YAML frontmatter.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        patch: { type: 'object' }
      },
      required: ['path', 'patch']
    }
  },
  {
    name: 'AddConnection',
    description: 'Append a row to the source file\'s `## Connections` table.',
    input_schema: {
      type: 'object',
      properties: {
        sourcePath: { type: 'string' },
        targetWikilink: { type: 'string', description: 'Like [[axiom/foo]]' },
        relationType: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['sourcePath', 'targetWikilink', 'relationType', 'description']
    }
  }
];

/**
 * Try to import the Claude Agent SDK. Returns null if not installed.
 * The SDK package name is held in a variable so that bundlers / static analyzers don't
 * resolve it at parse time.
 */
async function tryLoadSdk(packageName = '@anthropic-ai/claude-agent-sdk') {
  try {
    return await import(packageName);
  } catch {
    return null;
  }
}

/**
 * Detect whether a Claude Code OAuth login is available on this host.
 * Phase 1 contract: presence of CLAUDE_CODE_OAUTH=1 in env signals that the SDK should be used.
 * Production behavior should also probe the SDK's own credential resolution.
 */
function isOauthConfigured() {
  return process.env.CLAUDE_CODE_OAUTH === '1';
}

/**
 * Create a claude-oauth ChatProvider.
 * @param {Object} opts
 * @param {string} [opts.domainKnowledgeDir] - resolved path used by tool dispatchers
 * @param {string} [opts.systemPrompt] - overrides the default greenfield interview prompt
 * @param {string} [opts.sdkPackage] - package name for the SDK (testing override)
 * @returns {{ respond: AsyncIterable }}
 */
export function createClaudeOauthProvider(opts = {}) {
  const {
    domainKnowledgeDir,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    sdkPackage = '@anthropic-ai/claude-agent-sdk'
  } = opts;

  if (!domainKnowledgeDir) {
    throw new Error('createClaudeOauthProvider requires { domainKnowledgeDir }');
  }

  return {
    async *respond(sessionId, userTurn, ctx) {
      if (!isOauthConfigured()) {
        yield ev('error', {
          code: 'AUTH_MISSING',
          message: 'Claude Code OAuth not configured. Set CLAUDE_CODE_OAUTH=1 after signing in via `claude` in another terminal.'
        });
        return;
      }
      const sdk = await tryLoadSdk(sdkPackage);
      if (!sdk) {
        yield ev('error', {
          code: 'SDK_MISSING',
          message: `Cannot import ${sdkPackage}. Install it with: npm install ${sdkPackage}`
        });
        return;
      }
      // Real SDK wiring lives below this point. Phase 1 ships the structure and the AUTH_MISSING/SDK_MISSING paths;
      // turning on the real loop is an env-gated activation that the user does once OAuth + SDK are in place.
      yield ev('error', {
        code: 'NOT_ACTIVATED',
        message: 'claude-oauth provider scaffolded but live SDK loop not activated in Phase 1. Use MockChatProvider for tests; activate via integration work after the SDK contract is verified.'
      });
    },
    /** Exposed for integration tests once the live loop is wired up. */
    _internals: { TOOL_SCHEMAS, systemPrompt, domainKnowledgeDir, dispatchTool }
  };
}

export { TOOL_SCHEMAS, DEFAULT_SYSTEM_PROMPT };
