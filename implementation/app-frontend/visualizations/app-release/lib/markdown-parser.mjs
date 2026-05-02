// @source features/app-release/mappings.md#interviewturntodomainmapupdate
// Parses a single .md file under domain_knowledge/ into { node, edges }.

import { readFile } from 'node:fs/promises';
import { basename, relative } from 'node:path';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const TITLE_RE = /^#\s+(.+?)\s*$/m;
const CONNECTIONS_HEADER_RE = /^##\s+Connections\s*$/m;
const TABLE_ROW_RE = /^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|.*$/gm;
const WIKILINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/;

function parseFrontmatter(text) {
  const fm = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if (value === '') {
      fm[key] = '';
      continue;
    }
    if (value === 'true') { fm[key] = true; continue; }
    if (value === 'false') { fm[key] = false; continue; }
    if (/^\[.*\]$/.test(value)) {
      const inner = value.slice(1, -1).trim();
      fm[key] = inner === '' ? [] : inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    if (value.includes(',')) {
      fm[key] = value.split(',').map(s => s.trim()).filter(Boolean);
      continue;
    }
    fm[key] = value.replace(/^["']|["']$/g, '');
  }
  return fm;
}

function parseConnectionsTable(body) {
  const headerMatch = body.match(CONNECTIONS_HEADER_RE);
  if (!headerMatch) return [];
  const tableSection = body.slice(headerMatch.index + headerMatch[0].length);
  const sectionEnd = tableSection.search(/\r?\n##\s/);
  const tableBody = sectionEnd === -1 ? tableSection : tableSection.slice(0, sectionEnd);
  const edges = [];
  let rowIdx = 0;
  for (const rowMatch of tableBody.matchAll(TABLE_ROW_RE)) {
    rowIdx++;
    const [, col1, col2, col3] = rowMatch;
    if (rowIdx <= 2 && (/^-+$/.test(col1.trim()) || /^Document$/i.test(col1.trim()))) continue;
    const linkMatch = col1.match(WIKILINK_RE);
    if (!linkMatch) continue;
    edges.push({
      target: linkMatch[1].trim(),
      type: col2.trim().replace(/^`|`$/g, ''),
      description: col3.trim()
    });
  }
  return edges;
}

export function parseMarkdown(content, filePath, baseDir) {
  const fmMatch = content.match(FRONTMATTER_RE);
  const frontmatter = fmMatch ? parseFrontmatter(fmMatch[1]) : {};
  const body = fmMatch ? content.slice(fmMatch[0].length) : content;
  const titleMatch = body.match(TITLE_RE);
  const title = titleMatch ? titleMatch[1].trim() : basename(filePath, '.md');
  const relPath = baseDir ? relative(baseDir, filePath) : filePath;
  const id = relPath.replace(/\.md$/, '');
  const edges = parseConnectionsTable(body).map(e => ({ ...e, source: id }));
  return {
    node: { id, path: relPath, title, frontmatter },
    edges
  };
}

export async function parseMarkdownFile(filePath, baseDir) {
  const content = await readFile(filePath, 'utf8');
  return parseMarkdown(content, filePath, baseDir);
}
