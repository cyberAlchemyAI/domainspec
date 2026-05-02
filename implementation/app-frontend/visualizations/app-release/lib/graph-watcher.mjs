// @source features/app-release/workflows.md#projectionrefreshpolicy
// @source features/app-release/operations.md#generateworkspaceprojection
// chokidar-driven watcher that emits debounced IndexDelta events.

import { EventEmitter } from 'node:events';
import chokidar from 'chokidar';

const DEFAULT_DEBOUNCE_MS = 150;
const DEFAULT_OVERFLOW = 500;
const DEFAULT_IGNORE = [
  /(^|[/\\])\../,                  // dotfiles (.git, .obsidian, .DS_Store)
  /(^|[/\\])node_modules([/\\]|$)/
];

export class GraphWatcher extends EventEmitter {
  constructor({
    index,
    baseDir,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    batchOverflow = DEFAULT_OVERFLOW,
    ignored = DEFAULT_IGNORE
  } = {}) {
    super();
    if (!index) throw new Error('GraphWatcher requires an index instance');
    this.index = index;
    this.baseDir = baseDir;
    this.debounceMs = debounceMs;
    this.batchOverflow = batchOverflow;
    this.ignored = ignored;
    this.pending = new Map(); // path -> 'add' | 'change' | 'unlink'
    this.flushTimer = null;
    this.watcher = null;
  }

  start() {
    if (this.watcher) return Promise.resolve();
    this.watcher = chokidar.watch(this.baseDir, {
      ignored: this.ignored,
      ignoreInitial: true,
      persistent: true,
      awaitWriteFinish: { stabilityThreshold: 50, pollInterval: 25 }
    });
    this.watcher
      .on('add', (p) => this._enqueue(p, 'add'))
      .on('change', (p) => this._enqueue(p, 'change'))
      .on('unlink', (p) => this._enqueue(p, 'unlink'));
    // Await chokidar ready so callers can rely on the watcher being live before issuing fs writes.
    return new Promise((resolve, reject) => {
      const onReady = () => { cleanup(); resolve(); };
      const onError = (err) => { cleanup(); reject(err); };
      const cleanup = () => {
        this.watcher.off('ready', onReady);
        this.watcher.off('error', onError);
      };
      this.watcher.once('ready', onReady);
      this.watcher.once('error', onError);
    });
  }

  async stop() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }

  _enqueue(path, kind) {
    if (!path.endsWith('.md')) return;
    this.pending.set(path, kind);
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => this.flush(), this.debounceMs);
  }

  async flush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    const batch = Array.from(this.pending.entries());
    this.pending.clear();
    if (batch.length === 0) return;

    if (batch.length > this.batchOverflow) {
      await this.index.loadAll();
      this.emit('error', { code: 'WATCHER_OVERFLOW', message: `batch of ${batch.length} exceeded overflow ${this.batchOverflow}; full re-snapshot done`, batchSize: batch.length });
      this.emit('delta', { added: [], updated: [], removed: [], metrics: this.index.metrics(), fullResnapshot: true });
      return;
    }

    const added = [];
    const updated = [];
    const removed = [];
    for (const [path, kind] of batch) {
      if (kind === 'unlink') {
        const r = this.index.remove(path);
        if (r) removed.push(r.node);
      } else {
        const r = await this.index.upsert(path);
        if (r) {
          if (r.kind === 'added') added.push(r.node);
          else updated.push(r.node);
        }
      }
    }
    this.emit('delta', { added, updated, removed, metrics: this.index.metrics() });
  }
}
