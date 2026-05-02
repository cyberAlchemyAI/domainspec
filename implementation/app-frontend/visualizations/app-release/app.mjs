// @source features/app-release/PHASE-1-DESIGN.md (UI Layout)
// @source features/app-release/STORIES.md (US-9 ... US-13)
// Bundles tab bar, chat panel, graph mount, metrics, end-session modal, sessions picker.
// Pure ES module against the Phase 1 server's REST + SSE API.

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ──────────────────────── State ────────────────────────
const state = {
  tabs: [],            // [{ sessionId, title, status }]
  activeSessionId: null,
  chats: new Map(),    // sessionId -> Array<turn>; turn = { role, text?, narrations? }
  graphSnapshot: { nodes: [], edges: [], metrics: { nodes: 0, edges: 0, axioms: 0, drafts: 0 } },
  sessionStreams: new Map(), // sessionId -> EventSource
  pendingNarrations: new Map() // toolUseId -> DOM element
};

// ──────────────────────── API ─────────────────────────
const api = {
  async createSession(title) {
    const res = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
    if (!res.ok) throw new Error(`createSession ${res.status}`);
    return res.json();
  },
  async listSessions() {
    const res = await fetch('/api/sessions');
    if (!res.ok) throw new Error(`listSessions ${res.status}`);
    return res.json();
  },
  async sendTurn(sessionId, turnText) {
    const res = await fetch(`/api/sessions/${sessionId}/turns`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ turnText }) });
    return { status: res.status, body: await res.json().catch(() => ({})) };
  },
  async endSession(sessionId, payload = {}) {
    const res = await fetch(`/api/sessions/${sessionId}/end`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return { status: res.status, body: await res.json().catch(() => ({})) };
  },
  async resumeSession(sessionId) {
    const res = await fetch(`/api/sessions/${sessionId}/resume`, { method: 'POST' });
    return { status: res.status, body: await res.json().catch(() => ({})) };
  },
  async getGraphIndex() {
    const res = await fetch('/api/graph/index');
    if (!res.ok) throw new Error(`graph index ${res.status}`);
    return res.json();
  }
};

// ──────────────────────── Toasts ───────────────────────
function toast(message, kind = 'info', durationMs = 5000) {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = message;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), durationMs);
}

// ──────────────────────── Tabs ─────────────────────────
function renderTabs() {
  const container = $('#tabs');
  container.innerHTML = '';
  for (const tab of state.tabs) {
    const el = document.createElement('button');
    el.className = `tab ${tab.sessionId === state.activeSessionId ? 'active' : ''} ${tab.status === 'active' ? 'is-active' : ''}`;
    el.dataset.sessionId = tab.sessionId;
    el.innerHTML = `<span class="dot"></span><span class="label">${escapeHtml(tab.title)}</span>`;
    el.addEventListener('click', () => switchToTab(tab.sessionId));
    container.appendChild(el);
  }
  renderActiveHeader();
}

function renderActiveHeader() {
  const tab = state.tabs.find(t => t.sessionId === state.activeSessionId);
  $('#active-eyebrow').textContent = tab ? 'Sessão ativa' : 'Sem sessão ativa';
  $('#active-title').textContent = tab ? tab.title : 'Harness Workspace';
  $('#btn-end-session').hidden = !tab;
  $('#chat-input').hidden = !tab;
  if (!tab) {
    $('#chat-history').innerHTML = '<div class="empty-state">Nenhuma sessão ativa. Clique em <strong>+ Nova sessão</strong> para começar.</div>';
  } else {
    renderChatHistory();
  }
}

function switchToTab(sessionId) {
  state.activeSessionId = sessionId;
  renderTabs();
}

// ──────────────────────── Chat ─────────────────────────
function renderChatHistory() {
  const sid = state.activeSessionId;
  if (!sid) return;
  const history = state.chats.get(sid) || [];
  const container = $('#chat-history');
  container.innerHTML = '';
  if (history.length === 0) {
    container.innerHTML = '<div class="empty-state">Aguardando primeira pergunta do agente…</div>';
    return;
  }
  for (const turn of history) {
    const el = document.createElement('div');
    el.className = `turn ${turn.role}`;
    const roleLabel = turn.role === 'user' ? 'Você' : 'Agente';
    const bodyHtml = renderTurnBody(turn);
    el.innerHTML = `<div class="role">${roleLabel}</div><div class="body">${bodyHtml}</div>`;
    container.appendChild(el);
  }
  container.scrollTop = container.scrollHeight;
}

function renderTurnBody(turn) {
  const parts = [];
  if (turn.text) parts.push(`<p>${escapeHtml(turn.text).replace(/\n/g, '<br>')}</p>`);
  if (Array.isArray(turn.narrations)) {
    for (const n of turn.narrations) {
      parts.push(narrationHtml(n));
    }
  }
  return parts.join('');
}

function narrationHtml(narration) {
  const cls = narration.error ? 'narration error' : (narration.pending ? 'narration pending' : 'narration');
  const icon = narration.error ? '✗' : (narration.pending ? '…' : '✓');
  const verb = verbForTool(narration.toolName);
  const path = narration.input?.path || narration.input?.sourcePath || narration.output?.path || '';
  return `<span class="${cls}" data-tool-use-id="${escapeHtml(narration.toolUseId || '')}">${icon} ${verb} <code>${escapeHtml(path)}</code>${narration.error ? ` — ${escapeHtml(narration.error)}` : ''}</span>`;
}

function verbForTool(name) {
  switch (name) {
    case 'WriteMarkdownNode': return 'escreveu';
    case 'AppendSection': return 'anexou seção em';
    case 'UpdateFrontmatter': return 'atualizou frontmatter de';
    case 'AddConnection': return 'conectou';
    default: return 'tool';
  }
}

function appendTurn(sessionId, role, text) {
  if (!state.chats.has(sessionId)) state.chats.set(sessionId, []);
  state.chats.get(sessionId).push({ role, text, narrations: [] });
  if (sessionId === state.activeSessionId) renderChatHistory();
}

function appendToLastTurn(sessionId, mutator) {
  const history = state.chats.get(sessionId);
  if (!history || history.length === 0) {
    state.chats.set(sessionId, [{ role: 'agent', text: '', narrations: [] }]);
  }
  const last = state.chats.get(sessionId).at(-1);
  if (last.role !== 'agent') {
    state.chats.get(sessionId).push({ role: 'agent', text: '', narrations: [] });
  }
  mutator(state.chats.get(sessionId).at(-1));
  if (sessionId === state.activeSessionId) renderChatHistory();
}

// ──────────────────────── Session SSE ──────────────────
function subscribeSession(sessionId) {
  if (state.sessionStreams.has(sessionId)) return;
  const es = new EventSource(`/api/sessions/${sessionId}/stream`);
  state.sessionStreams.set(sessionId, es);
  es.addEventListener('session-created', (e) => {
    const data = JSON.parse(e.data);
    if (data.firstQuestion) appendTurn(sessionId, 'agent', data.firstQuestion);
  });
  es.addEventListener('text-delta', (e) => {
    const { text } = JSON.parse(e.data);
    appendToLastTurn(sessionId, (t) => { t.text = (t.text || '') + text; });
  });
  es.addEventListener('tool-use-start', (e) => {
    const data = JSON.parse(e.data);
    appendToLastTurn(sessionId, (t) => {
      t.narrations.push({ ...data, pending: true });
    });
  });
  es.addEventListener('tool-use-result', (e) => {
    const data = JSON.parse(e.data);
    appendToLastTurn(sessionId, (t) => {
      const existing = t.narrations.find(n => n.toolUseId === data.toolUseId);
      const isError = data.output && data.output.error;
      if (existing) {
        existing.pending = false;
        existing.output = data.output;
        if (isError) existing.error = data.output.error;
      } else {
        t.narrations.push({ ...data, pending: false, error: isError ? data.output.error : null });
      }
    });
  });
  es.addEventListener('done', () => { /* re-enable input handled by chat-input */ });
  es.addEventListener('error', (e) => {
    try {
      const data = JSON.parse(e.data || 'null');
      if (data && data.code === 'AUTH_MISSING') {
        toast('Login do Claude Code não encontrado. Abra o Claude Code e faça login.', 'error', 8000);
      } else if (data) {
        toast(`Erro: ${data.code || 'desconhecido'} — ${data.message || ''}`, 'error');
      }
    } catch { /* native EventSource error event has no data */ }
  });
}

function unsubscribeSession(sessionId) {
  const es = state.sessionStreams.get(sessionId);
  if (es) { es.close(); state.sessionStreams.delete(sessionId); }
}

// ──────────────────────── Graph + metrics ──────────────
let graphInstance = null;
function initGraph() {
  if (typeof ForceGraph === 'undefined') {
    $('#graph-mount').innerHTML = '<div class="empty-state">force-graph não carregou.</div>';
    return;
  }
  const container = $('#graph-mount');
  graphInstance = ForceGraph()(container)
    .width(container.clientWidth)
    .height(420)
    .backgroundColor('#11111a')
    .nodeId('id')
    .nodeLabel((n) => n.title || n.id)
    .nodeAutoColorBy('node_type')
    .linkSource('source')
    .linkTarget('target')
    .linkColor(() => 'rgba(255,255,255,0.18)')
    .linkDirectionalArrowLength(3)
    .nodeCanvasObject((node, ctx, globalScale) => {
      const label = node.title || node.id;
      const fontSize = 11 / Math.max(globalScale, 1);
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = node.color || '#7c6af7';
      ctx.fill();
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = '#e2e2e8';
      ctx.fillText(label, node.x + 6, node.y + 3);
    })
    .onNodeClick((node) => {
      window.open(`/visualizations/ontology-visualization/index.html?source=domain_knowledge#node=${encodeURIComponent(node.id)}`, '_blank');
    });
  applyGraphSnapshot(state.graphSnapshot);
}

function applyGraphSnapshot(snap) {
  state.graphSnapshot = snap;
  if (graphInstance) {
    graphInstance.graphData({
      nodes: snap.nodes.map(n => ({ id: n.id, title: n.title, node_type: n.frontmatter?.node_type })),
      links: (snap.edges || []).map(e => ({ source: e.source, target: e.target }))
    });
  }
  for (const key of ['nodes', 'edges', 'axioms', 'drafts']) {
    const el = document.querySelector(`[data-metric="${key}"]`);
    if (el) el.textContent = snap.metrics?.[key] ?? 0;
  }
}

function applyGraphDelta(delta) {
  if (delta.bootstrap) {
    applyGraphSnapshot({
      nodes: delta.added || [],
      edges: state.graphSnapshot.edges,
      metrics: delta.metrics || state.graphSnapshot.metrics
    });
    return;
  }
  // Refetch full snapshot — simpler than incremental patching for Phase 1.
  api.getGraphIndex().then(applyGraphSnapshot).catch(err => toast(`Falha ao atualizar grafo: ${err.message}`, 'error'));
}

function subscribeGraphStream() {
  const es = new EventSource('/api/graph/stream');
  es.addEventListener('graph-delta', (e) => {
    try {
      applyGraphDelta(JSON.parse(e.data));
    } catch (err) {
      toast(`graph-delta parse: ${err.message}`, 'error');
    }
  });
  es.addEventListener('error', () => {
    // EventSource auto-reconnects; nothing to do here.
  });
}

// ──────────────────────── End-session modal ────────────
function openEndModal() {
  const active = state.tabs.filter(t => t.status === 'active');
  if (active.length === 0) return;
  $('#end-modal-list').innerHTML = active.map(t => `<li>• ${escapeHtml(t.title)}</li>`).join('');
  $('#end-modal-title').textContent = active.length === 1 ? `Encerrar "${active[0].title}"?` : `Encerrar ${active.length} sessões?`;
  $('#end-modal').classList.add('show');
}

function closeEndModal() { $('#end-modal').classList.remove('show'); }

async function confirmEndModal() {
  const active = state.tabs.filter(t => t.status === 'active');
  for (const tab of active) {
    const r = await api.endSession(tab.sessionId, { summary: collectSummaryFor(tab.sessionId) });
    if (r.status >= 400 && !r.body.idempotent) {
      toast(`Falha ao encerrar "${tab.title}": ${r.body.error || r.status}`, 'error');
      return;
    }
    unsubscribeSession(tab.sessionId);
    state.tabs = state.tabs.filter(t => t.sessionId !== tab.sessionId);
    if (state.activeSessionId === tab.sessionId) state.activeSessionId = state.tabs[0]?.sessionId || null;
  }
  closeEndModal();
  renderTabs();
}

function collectSummaryFor(sessionId) {
  const history = state.chats.get(sessionId) || [];
  const userTurns = history.filter(t => t.role === 'user').map(t => t.text).filter(Boolean);
  if (userTurns.length === 0) return '_Sessão encerrada sem turnos do usuário._';
  return userTurns.join('\n\n').slice(0, 1000);
}

// ──────────────────────── Sessions picker ──────────────
function openPicker() {
  $('#picker').classList.add('show');
  api.listSessions().then(renderPickerList).catch(err => toast(`Falha ao listar sessões: ${err.message}`, 'error'));
}

function closePicker() { $('#picker').classList.remove('show'); }

function renderPickerList(sessions) {
  const list = $('#picker-list');
  if (!sessions.length) {
    list.innerHTML = '<div class="empty-state">Nenhuma sessão anterior encontrada.</div>';
    return;
  }
  list.innerHTML = '';
  for (const s of sessions) {
    const el = document.createElement('div');
    el.className = 'picker-item';
    el.innerHTML = `
      <div class="title">${escapeHtml(s.title)}</div>
      <div class="meta">${escapeHtml(s.endedAt)}</div>
      <div class="excerpt">${escapeHtml(s.summaryExcerpt || '')}</div>
    `;
    el.addEventListener('click', async () => {
      const r = await api.resumeSession(s.sessionId);
      if (r.status === 200) {
        state.tabs.push({ sessionId: r.body.sessionId, title: s.title, status: 'active' });
        state.activeSessionId = r.body.sessionId;
        subscribeSession(r.body.sessionId);
        renderTabs();
        closePicker();
      } else {
        toast(`Falha ao retomar: ${r.body.error || r.status}`, 'error');
      }
    });
    list.appendChild(el);
  }
}

// ──────────────────────── Boot ─────────────────────────
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

async function newSession() {
  const r = await api.createSession();
  state.tabs.push({ sessionId: r.sessionId, title: r.title || 'Nova sessão', status: 'active' });
  state.activeSessionId = r.sessionId;
  subscribeSession(r.sessionId);
  renderTabs();
}

function attachUiHandlers() {
  $('#btn-new-session').addEventListener('click', () => newSession().catch(e => toast(`Falha ao criar sessão: ${e.message}`, 'error')));
  $('#btn-past-sessions').addEventListener('click', openPicker);
  $('#btn-end-session').addEventListener('click', openEndModal);
  $('#picker-close').addEventListener('click', closePicker);
  $('#end-modal-cancel').addEventListener('click', closeEndModal);
  $('#end-modal-confirm').addEventListener('click', () => confirmEndModal());
  $('#btn-expand-graph').addEventListener('click', () => {
    window.open('/visualizations/ontology-visualization/index.html?source=domain_knowledge', '_blank');
  });

  $('#chat-input').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sid = state.activeSessionId;
    const ta = $('#chat-textarea');
    const text = ta.value.trim();
    if (!sid || !text) return;
    appendTurn(sid, 'user', text);
    ta.value = '';
    const r = await api.sendTurn(sid, text);
    if (r.status >= 400) toast(`Erro ${r.status}: ${r.body.error || ''}`, 'error');
  });

  // Multi-tab close: combined modal before window unload.
  window.addEventListener('beforeunload', (e) => {
    const active = state.tabs.filter(t => t.status === 'active');
    if (active.length > 0) {
      // Modern browsers ignore custom strings, but the prompt fires.
      e.preventDefault();
      e.returnValue = 'Há sessões ativas. Encerrar agora?';
      // Note: combined modal still relies on user clicking Encerrar; the native dialog above is the OS-level guard.
      openEndModal();
      return e.returnValue;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachUiHandlers();
  initGraph();
  subscribeGraphStream();
  api.getGraphIndex().then(applyGraphSnapshot).catch(err => toast(`Falha ao carregar grafo: ${err.message}`, 'error'));
  renderTabs();
});

// Re-export for tests (where window/document don't exist, this module won't be imported anyway).
export { state, api };
