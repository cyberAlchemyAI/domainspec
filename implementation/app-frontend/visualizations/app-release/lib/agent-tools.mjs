// @source features/app-release/operations.md (WriteMarkdownNode, AppendSection, UpdateFrontmatter, AddConnection)
// Pure tool dispatchers. Filesystem-effecting; no SDK dependency.

import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, normalize, posix, sep, resolve, join } from 'node:path';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function isPathInside(parent, child) {
  const rel = posix.relative(parent.split(sep).join(posix.sep), child.split(sep).join(posix.sep));
  return rel && !rel.startsWith('..') && !isAbsolute(rel);
}

function ensureSafePath({ baseDir, relPath }) {
  if (typeof relPath !== 'string' || relPath.trim() === '') {
    throw new ToolError('INVALID_PATH', 'path is required');
  }
  if (isAbsolute(relPath)) {
    throw new ToolError('INVALID_PATH', 'absolute paths are not allowed');
  }
  if (relPath.split(/[/\\]/).includes('..')) {
    throw new ToolError('INVALID_PATH', 'path traversal (..) is not allowed');
  }
  if (!relPath.endsWith('.md')) {
    throw new ToolError('INVALID_PATH', 'path must end in .md');
  }
  const abs = resolve(baseDir, relPath);
  if (!isPathInside(baseDir, abs)) {
    throw new ToolError('INVALID_PATH', 'resolved path escapes domain_knowledge/');
  }
  return abs;
}

export class ToolError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

function serializeFrontmatter(fm) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.join(', ')}]`);
    } else if (typeof v === 'boolean') {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function parseFrontmatterText(text) {
  const fm = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if (value === 'true') { fm[key] = true; continue; }
    if (value === 'false') { fm[key] = false; continue; }
    if (/^\[.*\]$/.test(value)) {
      const inner = value.slice(1, -1).trim();
      fm[key] = inner === '' ? [] : inner.split(',').map(s => s.trim());
      continue;
    }
    fm[key] = value;
  }
  return fm;
}

/** WriteMarkdownNode — creates a new node. */
export async function writeMarkdownNode({ baseDir, path: relPath, frontmatter, body }) {
  const abs = ensureSafePath({ baseDir, relPath });
  if (await exists(abs)) {
    throw new ToolError('PATH_EXISTS', `${relPath} already exists; use AppendSection or UpdateFrontmatter`);
  }
  if (!frontmatter || typeof frontmatter !== 'object') {
    throw new ToolError('INVALID_FRONTMATTER', 'frontmatter object is required');
  }
  if (!frontmatter.node_type) {
    throw new ToolError('MISSING_NODE_TYPE', 'frontmatter must include node_type');
  }
  await mkdir(dirname(abs), { recursive: true });
  const content = `${serializeFrontmatter(frontmatter)}\n\n${body || ''}\n`;
  await writeFile(abs, content, 'utf8');
  return { ok: true, path: relPath };
}

/** AppendSection — appends a `## Heading` block to an existing node. */
export async function appendSection({ baseDir, path: relPath, heading, content }) {
  const abs = ensureSafePath({ baseDir, relPath });
  if (!(await exists(abs))) {
    throw new ToolError('NOT_FOUND', `${relPath} does not exist`);
  }
  if (typeof heading !== 'string' || !heading.startsWith('## ')) {
    throw new ToolError('INVALID_HEADING', 'heading must start with `## `');
  }
  const current = await readFile(abs, 'utf8');
  const trimmed = current.endsWith('\n') ? current : current + '\n';
  const block = `\n${heading}\n\n${content || ''}\n`;
  await writeFile(abs, trimmed + block, 'utf8');
  return { ok: true, path: relPath, heading };
}

/** UpdateFrontmatter — shallow-merges patch into existing frontmatter; preserves body. */
export async function updateFrontmatter({ baseDir, path: relPath, patch }) {
  const abs = ensureSafePath({ baseDir, relPath });
  if (!(await exists(abs))) {
    throw new ToolError('NOT_FOUND', `${relPath} does not exist`);
  }
  if (!patch || typeof patch !== 'object') {
    throw new ToolError('INVALID_PATCH', 'patch object is required');
  }
  if ('node_type' in patch && (patch.node_type === null || patch.node_type === undefined || patch.node_type === '')) {
    throw new ToolError('CANNOT_NULL_NODE_TYPE', 'patch may not remove node_type');
  }
  if ('last_updated' in patch) {
    const today = new Date().toISOString().slice(0, 10);
    if (patch.last_updated !== today) {
      throw new ToolError('INVALID_LAST_UPDATED', `last_updated must equal today (${today})`);
    }
  }
  const current = await readFile(abs, 'utf8');
  const fmMatch = current.match(FRONTMATTER_RE);
  let body = current;
  let fm = {};
  if (fmMatch) {
    fm = parseFrontmatterText(fmMatch[1]);
    body = current.slice(fmMatch[0].length);
  }
  const merged = { ...fm, ...patch };
  const out = `${serializeFrontmatter(merged)}\n${body.startsWith('\n') ? body : '\n' + body}`;
  await writeFile(abs, out, 'utf8');
  return { ok: true, path: relPath };
}

/** AddConnection — appends a row to the `## Connections` table; idempotent on (target, relationType). */
export async function addConnection({ baseDir, sourcePath, targetWikilink, relationType, description }) {
  const abs = ensureSafePath({ baseDir, relPath: sourcePath });
  if (!(await exists(abs))) {
    throw new ToolError('NOT_FOUND', `${sourcePath} does not exist`);
  }
  if (!/^\[\[[^\]]+\]\]$/.test(String(targetWikilink || ''))) {
    throw new ToolError('INVALID_WIKILINK', 'targetWikilink must look like [[target]]');
  }
  if (typeof relationType !== 'string' || relationType.trim() === '') {
    throw new ToolError('INVALID_RELATION', 'relationType is required');
  }
  const current = await readFile(abs, 'utf8');
  const headerRe = /^##\s+Connections\s*$/m;
  const newRow = `| ${targetWikilink} | ${relationType} | ${description || ''} |`;
  // Idempotency: skip if (target, relationType) already present. Escape both for regex literal use.
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const dupRe = new RegExp(`\\|\\s*${escapeRe(targetWikilink)}\\s*\\|\\s*${escapeRe(relationType)}\\s*\\|`);
  if (dupRe.test(current)) {
    return { ok: true, path: sourcePath, idempotent: true };
  }
  let updated;
  if (headerRe.test(current)) {
    // Append row at end of existing table (or at end of section).
    updated = current.replace(headerRe, (match) => match);
    if (updated.endsWith('\n')) {
      updated = updated + newRow + '\n';
    } else {
      updated = updated + '\n' + newRow + '\n';
    }
  } else {
    const block = `\n## Connections\n\n| Document | Type | Description |\n|---|---|---|\n${newRow}\n`;
    updated = (current.endsWith('\n') ? current : current + '\n') + block;
  }
  await writeFile(abs, updated, 'utf8');
  return { ok: true, path: sourcePath };
}

const TOOL_HANDLERS = {
  WriteMarkdownNode: writeMarkdownNode,
  AppendSection: appendSection,
  UpdateFrontmatter: updateFrontmatter,
  AddConnection: addConnection
};

/** Top-level dispatch used by chat providers. Returns `{ ok, output, files? }`. */
export async function dispatchTool({ baseDir, toolName, input }) {
  const handler = TOOL_HANDLERS[toolName];
  if (!handler) {
    return { ok: false, output: { error: `Unknown tool: ${toolName}` } };
  }
  try {
    const result = await handler({ baseDir, ...input });
    const filePath = result.path || input.sourcePath || input.path || null;
    return { ok: true, output: result, files: filePath ? [filePath] : [] };
  } catch (err) {
    if (err instanceof ToolError) {
      return { ok: false, output: { error: err.message, code: err.code } };
    }
    throw err;
  }
}

export const TOOL_NAMES = Object.keys(TOOL_HANDLERS);
