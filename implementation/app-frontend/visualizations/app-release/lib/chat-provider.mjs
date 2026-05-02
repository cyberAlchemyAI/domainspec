// @source features/app-release/interfaces.md#internal-chatprovider-interface
// ChatProvider interface (JSDoc-typed) and a deterministic MockChatProvider for tests.
// Implementations:
//   - mock-chat-provider.mjs (this file): scripted, deterministic, used in unit/integration tests
//   - providers/claude-oauth.mjs: wraps @anthropic-ai/claude-agent-sdk

/**
 * @typedef {Object} ChatEventTextDelta
 * @property {'text-delta'} type
 * @property {string} text
 */
/**
 * @typedef {Object} ChatEventToolUseStart
 * @property {'tool-use-start'} type
 * @property {string} toolUseId
 * @property {string} toolName
 * @property {object} input
 */
/**
 * @typedef {Object} ChatEventToolUseResult
 * @property {'tool-use-result'} type
 * @property {string} toolUseId
 * @property {string} toolName
 * @property {object} output
 */
/**
 * @typedef {Object} ChatEventDone
 * @property {'done'} type
 */
/**
 * @typedef {Object} ChatEventError
 * @property {'error'} type
 * @property {string} code
 * @property {string} message
 */
/** @typedef {ChatEventTextDelta|ChatEventToolUseStart|ChatEventToolUseResult|ChatEventDone|ChatEventError} ChatEvent */

/**
 * @typedef {Object} SessionContext
 * @property {string} sessionId
 * @property {{ summary?: string, nextSessionPrompt?: string }} [seedContext]
 * @property {Array<{role:string,text:string,at:string,turnId:string}>} chatHistory
 */

/**
 * @typedef {Object} ChatProvider
 * @property {(sessionId: string, userTurn: string, ctx: SessionContext) => AsyncIterable<ChatEvent>} respond
 */

/**
 * Build a typed ChatEvent — small helper used by mock + real providers.
 */
export function ev(type, payload = {}) {
  return { type, ...payload };
}

/**
 * MockChatProvider — emits a scripted async iterable.
 * Tests inject `script` either at construction (default for all sessions) or per-session via `setScript(sessionId, script)`.
 *
 * A `script` is `Array<ChatEvent | ((ctx) => ChatEvent[])>`. Each element is yielded in order; functions are invoked
 * with the SessionContext at call time and may return multiple events.
 */
export class MockChatProvider {
  constructor({ defaultScript = [ev('text-delta', { text: 'Olá! ' }), ev('text-delta', { text: 'Como posso ajudar?' }), ev('done') ] } = {}) {
    this.defaultScript = defaultScript;
    this.scripts = new Map();
    this.calls = []; // {sessionId, userTurn} for assertions
  }

  setScript(sessionId, script) {
    this.scripts.set(sessionId, script);
  }

  async *respond(sessionId, userTurn, ctx) {
    this.calls.push({ sessionId, userTurn, ctxSnapshot: { hasSeed: !!ctx.seedContext, historyLength: ctx.chatHistory?.length || 0 } });
    const script = this.scripts.get(sessionId) || this.defaultScript;
    for (const item of script) {
      const result = typeof item === 'function' ? item(ctx) : [item];
      const events = result && typeof result.then === 'function' ? await result : result;
      for (const e of events) {
        await Promise.resolve();
        yield e;
      }
    }
  }
}
