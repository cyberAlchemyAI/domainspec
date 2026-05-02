// @source features/app-release/queries.md#getworkspaceoverview
// @source features/app-release/domain.md#domainmap
// In-memory derived index of domain_knowledge/. Single source of truth is the filesystem.

import { EventEmitter } from 'node:events';
import { readdir, stat } from 'node:fs/promises';
import { join, posix, sep } from 'node:path';

import { parseMarkdownFile } from './markdown-parser.mjs';

const SESSIONS_PREFIX = 'sessions/';

function toPosixRelative(path) {
  return path.split(sep).join(posix.sep);
}

async function* walkMarkdownFiles(dir, baseDir = dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMarkdownFiles(full, baseDir);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield full;
    }
  }
}

export class GraphIndex extends EventEmitter {
  constructor({ baseDir }) {
    super();
    this.baseDir = baseDir;
    this.nodes = new Map();   // id -> node
    this.edgesByPath = new Map(); // path -> edges[]
    this.version = 0;
  }

  async loadAll() {
    this.nodes.clear();
    this.edgesByPath.clear();
    for await (const filePath of walkMarkdownFiles(this.baseDir)) {
      try {
        const { node, edges } = await parseMarkdownFile(filePath, this.baseDir);
        this.nodes.set(node.id, node);
        this.edgesByPath.set(node.path, edges);
      } catch (err) {
        // Bad file shouldn't crash the index; emit warning event.
        this.emit('parse-error', { path: filePath, error: err.message });
      }
    }
    this.version++;
    return this.snapshot();
  }

  async upsert(filePath) {
    try {
      const { node, edges } = await parseMarkdownFile(filePath, this.baseDir);
      const existing = this.nodes.get(node.id);
      this.nodes.set(node.id, node);
      this.edgesByPath.set(node.path, edges);
      this.version++;
      return { kind: existing ? 'updated' : 'added', node, edges };
    } catch (err) {
      this.emit('parse-error', { path: filePath, error: err.message });
      return null;
    }
  }

  remove(filePath) {
    const relPath = toPosixRelative(filePath.startsWith(this.baseDir) ? filePath.slice(this.baseDir.length + 1) : filePath);
    const id = relPath.replace(/\.md$/, '');
    if (!this.nodes.has(id)) return null;
    const node = this.nodes.get(id);
    this.nodes.delete(id);
    this.edgesByPath.delete(relPath);
    this.version++;
    return { kind: 'removed', node };
  }

  metrics() {
    let nodes = 0;
    let edges = 0;
    let axioms = 0;
    let drafts = 0;
    for (const node of this.nodes.values()) {
      const isSession = node.path.startsWith(SESSIONS_PREFIX);
      if (!isSession) nodes++;
      if (node.frontmatter.node_type === 'axiom' && !isSession) axioms++;
      if (node.frontmatter.status === 'draft' && !isSession) drafts++;
    }
    for (const edgeList of this.edgesByPath.values()) {
      // Skip edges originating from sessions/** so metrics align with nodes count.
      // Edges are counted from non-session source nodes only.
      const firstEdge = edgeList[0];
      if (firstEdge && firstEdge.source && !firstEdge.source.startsWith('sessions/')) {
        edges += edgeList.length;
      } else if (!firstEdge) {
        // empty edge list — count nothing
      } else {
        // session-originated edges — skip
      }
    }
    return { nodes, edges, axioms, drafts };
  }

  snapshot() {
    const nodes = [];
    const edges = [];
    for (const node of this.nodes.values()) {
      if (node.path.startsWith(SESSIONS_PREFIX)) continue;
      nodes.push(node);
    }
    for (const edgeList of this.edgesByPath.values()) {
      for (const e of edgeList) {
        if (e.source && e.source.startsWith('sessions/')) continue;
        edges.push(e);
      }
    }
    return { nodes, edges, metrics: this.metrics(), version: this.version };
  }

  getNode(id) {
    return this.nodes.get(id) || null;
  }

  getEdgesFrom(id) {
    const node = this.nodes.get(id);
    if (!node) return [];
    return this.edgesByPath.get(node.path) || [];
  }
}
