// @source features/app-release/operations.md (StartReleaseWorkspace, CaptureInterviewTurn, EndSession, ResumeSession)
// @source features/app-release/states.md#interviewsessionlifecycle
// @source features/app-release/queries.md (ListPastSessions, GetSessionSummary)
// In-memory session store. Active sessions live here; ended sessions persist to domain_knowledge/sessions/<ts>-<slug>.md.
// W5 deferred: the session-close document contract is inlined here. Future work should externalize this into a skill.

import { EventEmitter } from 'node:events';
import { mkdir, readdir, readFile, stat, writeFile, appendFile } from 'node:fs/promises';
import { join, basename, posix } from 'node:path';

const SESSIONS_SUBDIR = 'sessions';

function isoNow() {
  return new Date().toISOString();
}

function isoTimestampForFilename(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function slugify(input) {
  if (!input) return 'untitled';
  const s = String(input)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || 'untitled';
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function buildSessionDocument({ sessionId, title, summary, decisions, filesTouched, nextSessionPrompt, chatHistory }) {
  const lines = [
    '---',
    'node_type: session',
    'status: ended',
    `session_id: ${sessionId}`,
    `last_updated: ${isoNow().slice(0, 10)}`,
    '---',
    '',
    `# ${title || 'Untitled Session'}`,
    '',
    '## Objective',
    '',
    title || 'Discovery interview session.',
    '',
    '## Summary',
    '',
    summary || '_Pending agent-generated summary._',
    '',
    '## Decisions',
    '',
    decisions && decisions.length
      ? decisions.map(d => `- ${d}`).join('\n')
      : '_No decisions recorded._',
    '',
    '## Files touched',
    '',
    filesTouched && filesTouched.length
      ? filesTouched.map(f => `- \`${f}\``).join('\n')
      : '_No files touched._',
    '',
    '## Next-session prompt',
    '',
    nextSessionPrompt || '_None provided._',
    '',
    '## Transcript',
    '',
    chatHistory && chatHistory.length
      ? chatHistory.map(t => `**${t.role}:** ${t.text}`).join('\n\n')
      : '_Empty transcript._',
    ''
  ];
  return lines.join('\n');
}

function extractSection(content, heading) {
  // Find a `## <heading>` line and return everything until the next `## ` (or EOF).
  const re = new RegExp(`^##\\s+${heading}\\s*$`, 'mi');
  const match = content.match(re);
  if (!match) return null;
  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const nextHeading = rest.search(/^##\s/m);
  return (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
}

function extractFrontmatterSessionId(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const idLine = m[1].split(/\r?\n/).find(l => /^session_id\s*:/.test(l));
  if (!idLine) return null;
  return idLine.split(':')[1].trim();
}

export class SessionStore extends EventEmitter {
  constructor({ baseDir }) {
    super();
    this.baseDir = baseDir;
    this.sessionsDir = join(baseDir, SESSIONS_SUBDIR);
    this.active = new Map();
  }

  async _ensureSessionsDir() {
    await mkdir(this.sessionsDir, { recursive: true });
  }

  /** StartReleaseWorkspace — creates an active in-memory session. */
  create({ title } = {}) {
    const sessionId = `${isoTimestampForFilename()}-${randomId()}`;
    const session = {
      sessionId,
      title: title || 'Nova sessão',
      status: 'active',
      createdAt: isoNow(),
      endedAt: null,
      documentPath: null,
      filesTouched: [],
      chatHistory: []
    };
    this.active.set(sessionId, session);
    this.emit('session-created', { sessionId, createdAt: session.createdAt, title: session.title });
    return session;
  }

  get(sessionId) {
    return this.active.get(sessionId) || null;
  }

  /** CaptureInterviewTurn — append a turn to the in-memory chat history (R1: empty turns rejected). */
  captureTurn(sessionId, { role, text, filesTouched: turnFiles = [] }) {
    const session = this.active.get(sessionId);
    if (!session) return { ok: false, error: 'NOT_FOUND' };
    if (session.status !== 'active') return { ok: false, error: 'NOT_ACTIVE' };
    if (typeof text !== 'string' || text.trim() === '') return { ok: false, error: 'EMPTY_TURN' };
    const turnId = `${session.chatHistory.length + 1}-${randomId()}`;
    session.chatHistory.push({ turnId, role, text, at: isoNow() });
    for (const f of turnFiles) {
      if (!session.filesTouched.includes(f)) session.filesTouched.push(f);
    }
    return { ok: true, turnId };
  }

  /** EndSession — write document and clear in-memory session. Idempotent. */
  async end(sessionId, { summary, decisions, nextSessionPrompt, fromResume = false, originalPath = null } = {}) {
    const session = this.active.get(sessionId);
    if (!session) {
      // If already ended (file exists), return idempotent ack.
      const existing = await this._findSessionFile(sessionId);
      if (existing) return { ok: true, sessionId, status: 'ended', filePath: existing, idempotent: true };
      return { ok: false, error: 'NOT_FOUND' };
    }

    await this._ensureSessionsDir();

    // Resume path: append `## Resumed at` to the original file rather than creating a new one.
    if (fromResume && originalPath) {
      const resumedAt = isoNow();
      const appendBlock = `\n## Resumed at ${resumedAt}\n\n${summary || '_Continuation summary._'}\n${
        session.chatHistory.length
          ? '\n### Continuation transcript\n\n' + session.chatHistory.map(t => `**${t.role}:** ${t.text}`).join('\n\n') + '\n'
          : ''
      }`;
      await appendFile(originalPath, appendBlock, 'utf8');
      session.status = 'ended';
      session.endedAt = resumedAt;
      session.documentPath = originalPath;
      this.active.delete(sessionId);
      this.emit('session-ended', { sessionId, filePath: originalPath, resumedAt });
      return { ok: true, sessionId, status: 'ended', filePath: originalPath };
    }

    // Standard end: create a new session document.
    const slug = slugify(session.title);
    const filename = `${session.sessionId}-${slug}.md`;
    const filePath = join(this.sessionsDir, filename);
    const document = buildSessionDocument({
      sessionId: session.sessionId,
      title: session.title,
      summary,
      decisions,
      filesTouched: session.filesTouched,
      nextSessionPrompt,
      chatHistory: session.chatHistory
    });
    await writeFile(filePath, document, 'utf8');
    session.status = 'ended';
    session.endedAt = isoNow();
    session.documentPath = filePath;
    this.active.delete(sessionId);
    this.emit('session-ended', { sessionId, filePath });
    return { ok: true, sessionId, status: 'ended', filePath };
  }

  async _findSessionFile(sessionId) {
    try {
      const entries = await readdir(this.sessionsDir);
      for (const name of entries) {
        if (!name.endsWith('.md')) continue;
        const content = await readFile(join(this.sessionsDir, name), 'utf8');
        if (extractFrontmatterSessionId(content) === sessionId) return join(this.sessionsDir, name);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    return null;
  }

  /** ListPastSessions — reads from disk, sorted by endedAt desc. */
  async list({ limit = 50, since = null } = {}) {
    let entries;
    try {
      entries = await readdir(this.sessionsDir);
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
    const items = [];
    for (const name of entries) {
      if (!name.endsWith('.md')) continue;
      const filePath = join(this.sessionsDir, name);
      const st = await stat(filePath);
      const content = await readFile(filePath, 'utf8');
      const sessionId = extractFrontmatterSessionId(content) || basename(name, '.md');
      const titleMatch = content.match(/^#\s+(.+?)\s*$/m);
      const summary = extractSection(content, 'Summary') || '';
      const summaryExcerpt = summary.replace(/\s+/g, ' ').slice(0, 200);
      const endedAt = st.mtime.toISOString();
      if (since && new Date(endedAt) < new Date(since)) continue;
      items.push({
        sessionId,
        title: titleMatch ? titleMatch[1].trim() : sessionId,
        status: 'ended',
        endedAt,
        summaryExcerpt,
        path: filePath
      });
    }
    items.sort((a, b) => b.endedAt.localeCompare(a.endedAt));
    return items.slice(0, limit);
  }

  /** GetSessionSummary — returns named sections only; never the transcript. */
  async getSummary(sessionId) {
    const filePath = await this._findSessionFile(sessionId);
    if (!filePath) return { ok: false, error: 'NOT_FOUND' };
    const content = await readFile(filePath, 'utf8');
    const summary = extractSection(content, 'Summary');
    if (!summary || /^_pending|^_none|^_no /i.test(summary.trim())) {
      return { ok: false, error: 'SUMMARY_MISSING' };
    }
    const titleMatch = content.match(/^#\s+(.+?)\s*$/m);
    return {
      ok: true,
      sessionId,
      title: titleMatch ? titleMatch[1].trim() : sessionId,
      summary,
      decisions: extractSection(content, 'Decisions') || '',
      filesTouched: extractSection(content, 'Files touched') || '',
      nextSessionPrompt: extractSection(content, 'Next-session prompt') || '',
      filePath
    };
  }

  /** ResumeSession — loads summary, opens a new active session bound to the original file. */
  async resume(sessionId) {
    const summaryResult = await this.getSummary(sessionId);
    if (!summaryResult.ok) {
      if (summaryResult.error === 'NOT_FOUND') return { ok: false, error: 'NOT_FOUND' };
      if (summaryResult.error === 'SUMMARY_MISSING') return { ok: false, error: 'SUMMARY_MISSING' };
    }
    const newSession = this.create({ title: summaryResult.title });
    newSession.documentPath = summaryResult.filePath;
    newSession.resumedFromSessionId = sessionId;
    newSession.seedContext = {
      summary: summaryResult.summary,
      nextSessionPrompt: summaryResult.nextSessionPrompt
    };
    return { ok: true, session: newSession, resumedFromFilePath: summaryResult.filePath };
  }

  /** Active session count, used by the test hook. */
  get activeIds() {
    return Array.from(this.active.keys());
  }
}
