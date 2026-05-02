import { randomUUID } from 'node:crypto';

const VALID_SCOPE_MODE = 'greenfield-only';
const VALID_RUNTIME_MODE = 'local-only';
const VALID_GRAPH_PRIORITY_MODE = 'graph-first';
const ACTIVE_CAPTURE_STATUSES = new Set(['interviewing', 'projected', 'review-ready']);

const STOP_WORDS = new Set([
  'about', 'after', 'again', 'allow', 'also', 'and', 'back', 'because', 'been',
  'before', 'being', 'between', 'build', 'but', 'can', 'could', 'demo', 'does',
  'from', 'have', 'into', 'just', 'like', 'make', 'more', 'need', 'only', 'our',
  'project', 'really', 'should', 'show', 'since', 'some', 'system', 'that',
  'their', 'them', 'then', 'there', 'these', 'they', 'this', 'through', 'track',
  'want', 'with', 'would', 'your'
]);

const DEFAULT_PROTOTYPES = [
  {
    key: 'signal-atlas',
    label: 'Signal Atlas',
    summary: 'Dense graph-first workspace with governance overlays and evidence-first inspection.'
  },
  {
    key: 'operator-briefing',
    label: 'Operator Briefing',
    summary: 'Editorial dashboard framing priorities, tradeoffs, and readiness for stakeholders.'
  },
  {
    key: 'prototype-lab',
    label: 'Prototype Lab',
    summary: 'Presentation-led direction that keeps prototype selection and release narrative in view.'
  }
];

function makeError(status, message, details = {}) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function titleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function quotedPhrases(text) {
  return [...text.matchAll(/"([^"]{3,80})"/g)].map((match) => match[1].trim());
}

function capitalizedPhrases(text) {
  return [...text.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)]
    .map((match) => match[1].trim())
    .filter((phrase) => phrase.length > 2);
}

function keywordPhrases(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

  const seen = new Set();
  const phrases = [];
  for (const word of words) {
    if (seen.has(word)) continue;
    seen.add(word);
    phrases.push(titleCase(word));
    if (phrases.length >= 5) break;
  }
  return phrases;
}

function extractAmbiguities(text) {
  const lines = text
    .split(/[.!?\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.filter((line) =>
    /\?|maybe|unclear|unknown|tradeoff|risk|decide|decision|constraint|ambigu/i.test(line)
  );
}

function uniqueLabels(labels) {
  const seen = new Set();
  const values = [];
  for (const label of labels) {
    const normalized = titleCase(label.trim());
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    values.push(normalized);
  }
  return values;
}

function extractTurnSignals(turnText, actorRole) {
  const labels = uniqueLabels([
    ...quotedPhrases(turnText),
    ...capitalizedPhrases(turnText),
    ...keywordPhrases(turnText)
  ]);

  if (labels.length === 0) {
    const fallback = turnText
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join(' ');
    labels.push(titleCase(fallback || 'Discovery Note'));
  }

  const roleLabel = titleCase(actorRole.trim());
  const ambiguities = extractAmbiguities(turnText);

  return {
    roleLabel,
    conceptLabels: labels,
    ambiguities
  };
}

function ensureDomainMap(workspace) {
  if (!workspace.domainMap) {
    workspace.domainMap = {
      domainMapId: `domain-map-${workspace.workspaceId}`,
      workspaceId: workspace.workspaceId,
      nodeCount: 0,
      edgeCount: 0,
      evidenceTurnCount: 0,
      unresolvedAmbiguityCount: 0,
      nodes: [],
      links: [],
      ambiguities: []
    };
  }
  return workspace.domainMap;
}

function ensureNode(domainMap, { id, label, type, metadata = {} }, turnId) {
  let node = domainMap.nodes.find((candidate) => candidate.id === id);
  if (!node) {
    node = {
      id,
      label,
      type,
      evidenceTurnIds: [],
      metadata
    };
    domainMap.nodes.push(node);
  }
  if (!node.evidenceTurnIds.includes(turnId)) {
    node.evidenceTurnIds.push(turnId);
  }
  return node;
}

function ensureLink(domainMap, source, target, type, turnId) {
  const id = `${source}:${type}:${target}`;
  let link = domainMap.links.find((candidate) => candidate.id === id);
  if (!link) {
    link = {
      id,
      source,
      target,
      type,
      evidenceTurnIds: []
    };
    domainMap.links.push(link);
  }
  if (!link.evidenceTurnIds.includes(turnId)) {
    link.evidenceTurnIds.push(turnId);
  }
  return link;
}

function syncCounts(workspace) {
  const domainMap = ensureDomainMap(workspace);
  domainMap.nodeCount = domainMap.nodes.length;
  domainMap.edgeCount = domainMap.links.length;
  domainMap.evidenceTurnCount = workspace.interviewTurns.length;
  domainMap.unresolvedAmbiguityCount = domainMap.ambiguities.filter((item) => item.status === 'open').length;
  workspace.activeDomainMapId = domainMap.domainMapId;
}

function getOverview(workspace) {
  const domainMap = ensureDomainMap(workspace);
  return {
    workspaceId: workspace.workspaceId,
    title: workspace.title,
    status: workspace.status,
    nodeCount: domainMap.nodeCount,
    edgeCount: domainMap.edgeCount,
    unresolvedAmbiguityCount: domainMap.unresolvedAmbiguityCount,
    selectedPrototypeVariantId: workspace.selectedPrototypeVariantId || null,
    activePlaybackSessionId: workspace.activePlaybackSessionId || null
  };
}

function buildGovernanceQueue(workspace, contextGoal, confidenceGapCount) {
  const domainMap = ensureDomainMap(workspace);
  const openAmbiguities = domainMap.ambiguities.filter((item) => item.status === 'open');
  const items = [];

  for (const ambiguity of openAmbiguities) {
    const goalImpact = Math.min(1, 0.55 + confidenceGapCount * 0.05);
    const roleUrgency = ambiguity.actorRole.toLowerCase().includes('stakeholder') ? 0.9 : 0.7;
    const score = Number(((goalImpact * 0.5) + (1 * 0.3) + (roleUrgency * 0.2)).toFixed(2));
    items.push({
      queueItemId: `gov-${ambiguity.id}`,
      workspaceId: workspace.workspaceId,
      title: `Resolve ambiguity: ${ambiguity.summary.slice(0, 72)}`,
      rationale: `This ambiguity blocks ${contextGoal} because the evidence remains unresolved from ${ambiguity.actorRole}.`,
      priorityScore: score,
      ownerRole: ambiguity.actorRole,
      status: 'open'
    });
  }

  if (!workspace.selectedPrototypeVariantId) {
    items.push({
      queueItemId: `gov-${workspace.workspaceId}-prototype`,
      workspaceId: workspace.workspaceId,
      title: 'Select a prototype direction',
      rationale: `Prototype selection is still open, so the release narrative for ${contextGoal} is not locked.`,
      priorityScore: Number((0.45 + confidenceGapCount * 0.03).toFixed(2)),
      ownerRole: 'Design operator',
      status: 'open'
    });
  }

  if (domainMap.nodeCount < 4) {
    items.push({
      queueItemId: `gov-${workspace.workspaceId}-coverage`,
      workspaceId: workspace.workspaceId,
      title: 'Deepen domain coverage',
      rationale: `The graph is still sparse for a graph-first release, so more discovery evidence is needed before the demo feels legible.`,
      priorityScore: Number((0.4 + Math.max(0, 4 - domainMap.nodeCount) * 0.08).toFixed(2)),
      ownerRole: 'Harness release operator',
      status: 'open'
    });
  }

  if (items.length === 0) {
    items.push({
      queueItemId: `gov-${workspace.workspaceId}-clear`,
      workspaceId: workspace.workspaceId,
      title: 'No open blockers',
      rationale: `The current evidence set is coherent enough for review and presentation.`,
      priorityScore: 0,
      ownerRole: 'System',
      status: 'open'
    });
  }

  items.sort((left, right) => right.priorityScore - left.priorityScore);
  return items;
}

function enrichPrototypeVariants(workspace) {
  const domainMap = ensureDomainMap(workspace);
  for (const variant of workspace.prototypeVariants) {
    variant.summary = `${variant.baseSummary} Current graph: ${domainMap.nodeCount} nodes, ${domainMap.unresolvedAmbiguityCount} open ambiguities.`;
  }
}

export function createReleaseStore(initialState = {}) {
  const state = {
    workspaces: initialState.workspaces || {},
    events: initialState.events || []
  };

  function appendEvent(workspace, type, payload) {
    const event = {
      eventId: randomUUID(),
      type,
      workspaceId: workspace.workspaceId,
      occurredAt: new Date().toISOString(),
      payload
    };
    state.events.push(event);
    workspace.events.push(event);
    return event;
  }

  function requireWorkspace(workspaceId) {
    const workspace = state.workspaces[workspaceId];
    if (!workspace) {
      throw makeError(404, `Workspace ${workspaceId} not found`);
    }
    return workspace;
  }

  return {
    createWorkspace(input) {
      const title = String(input?.title || '').trim();
      if (!title) {
        throw makeError(400, 'Title is required');
      }
      if (input.scopeMode !== VALID_SCOPE_MODE || input.runtimeMode !== VALID_RUNTIME_MODE || input.graphPriorityMode !== VALID_GRAPH_PRIORITY_MODE) {
        throw makeError(400, 'Workspace decisions must match the approved v1 release modes', {
          expected: {
            scopeMode: VALID_SCOPE_MODE,
            runtimeMode: VALID_RUNTIME_MODE,
            graphPriorityMode: VALID_GRAPH_PRIORITY_MODE
          }
        });
      }

      const workspaceId = `workspace-${slugify(title)}-${randomUUID().slice(0, 8)}`;
      const workspace = {
        workspaceId,
        title,
        scopeMode: input.scopeMode,
        runtimeMode: input.runtimeMode,
        graphPriorityMode: input.graphPriorityMode,
        status: 'interviewing',
        activeDomainMapId: `domain-map-${workspaceId}`,
        selectedPrototypeVariantId: null,
        activePlaybackSessionId: null,
        interviewTurns: [],
        governanceQueue: [],
        playbackSessions: [],
        events: [],
        prototypeVariants: DEFAULT_PROTOTYPES.map((variant) => ({
          prototypeVariantId: `variant-${variant.key}-${workspaceId}`,
          workspaceId,
          label: variant.label,
          selectionStatus: 'candidate',
          critiqueSummary: '',
          baseSummary: variant.summary,
          summary: variant.summary
        }))
      };

      ensureDomainMap(workspace);
      enrichPrototypeVariants(workspace);
      state.workspaces[workspaceId] = workspace;
      appendEvent(workspace, 'WorkspaceInitialized', {
        workspaceId,
        scopeMode: workspace.scopeMode,
        runtimeMode: workspace.runtimeMode,
        graphPriorityMode: workspace.graphPriorityMode
      });

      return {
        workspaceId,
        status: workspace.status
      };
    },

    captureInterviewTurn(workspaceId, input) {
      const workspace = requireWorkspace(workspaceId);
      const turnText = String(input?.turnText || '').trim();
      const actorRole = String(input?.actorRole || '').trim();

      if (!turnText) throw makeError(400, 'Interview turn cannot be empty');
      if (!actorRole) throw makeError(400, 'actorRole is required');
      if (!ACTIVE_CAPTURE_STATUSES.has(workspace.status)) {
        throw makeError(409, `Cannot capture a turn while workspace is ${workspace.status}`);
      }

      const turnId = `turn-${randomUUID().slice(0, 8)}`;
      const extracted = extractTurnSignals(turnText, actorRole);
      const domainMap = ensureDomainMap(workspace);

      const roleNodeId = `role-${slugify(extracted.roleLabel)}`;
      ensureNode(domainMap, {
        id: roleNodeId,
        label: extracted.roleLabel,
        type: 'role',
        metadata: { actorRole }
      }, turnId);

      const conceptIds = [];
      for (const label of extracted.conceptLabels) {
        const conceptId = `concept-${slugify(label)}`;
        conceptIds.push(conceptId);
        ensureNode(domainMap, {
          id: conceptId,
          label,
          type: 'concept'
        }, turnId);
        ensureLink(domainMap, roleNodeId, conceptId, 'mentions', turnId);
      }

      for (let index = 0; index < conceptIds.length - 1; index += 1) {
        ensureLink(domainMap, conceptIds[index], conceptIds[index + 1], 'relates-to', turnId);
      }

      const ambiguityIds = [];
      for (const summary of extracted.ambiguities) {
        const ambiguity = {
          id: `amb-${randomUUID().slice(0, 8)}`,
          summary,
          actorRole: extracted.roleLabel,
          sourceTurnId: turnId,
          status: 'open'
        };
        domainMap.ambiguities.push(ambiguity);
        ambiguityIds.push(ambiguity.id);
      }

      workspace.interviewTurns.push({
        turnId,
        turnText,
        actorRole,
        createdAt: new Date().toISOString(),
        evidenceLinks: extracted.conceptLabels.map((label) => ({
          sourceType: 'interview-turn',
          sourceRef: turnId,
          confidence: 0.81,
          conceptLabel: label
        })),
        ambiguityIds
      });

      workspace.status = 'interviewing';
      syncCounts(workspace);
      enrichPrototypeVariants(workspace);

      if (workspace.interviewTurns.at(-1).evidenceLinks.length === 0) {
        throw makeError(409, 'Generated concepts must retain evidence links');
      }

      return {
        accepted: true,
        turnId,
        extractedConceptCount: extracted.conceptLabels.length,
        ambiguityCount: extracted.ambiguities.length,
        evidenceCoverageRatio: 1
      };
    },

    generateProjection(workspaceId, input) {
      const workspace = requireWorkspace(workspaceId);
      const projectionReason = String(input?.projectionReason || '').trim();
      const domainMap = ensureDomainMap(workspace);

      if (!projectionReason) throw makeError(400, 'projectionReason is required');
      if (!workspace.activeDomainMapId) throw makeError(409, 'Active domain map is missing');
      syncCounts(workspace);
      if (workspace.graphPriorityMode === VALID_GRAPH_PRIORITY_MODE && domainMap.nodeCount < 1) {
        throw makeError(409, 'Graph-first projection cannot be empty');
      }

      workspace.status = 'projected';
      enrichPrototypeVariants(workspace);
      const overview = getOverview(workspace);
      appendEvent(workspace, 'ProjectionRefreshed', {
        workspaceId,
        nodeCount: overview.nodeCount,
        edgeCount: overview.edgeCount,
        unresolvedAmbiguityCount: overview.unresolvedAmbiguityCount,
        projectionReason
      });
      return overview;
    },

    prioritizeGovernanceQueue(workspaceId, input) {
      const workspace = requireWorkspace(workspaceId);
      const contextGoal = String(input?.contextGoal || '').trim();
      const confidenceGapCount = Number(input?.confidenceGapCount ?? ensureDomainMap(workspace).unresolvedAmbiguityCount);

      if (!contextGoal) throw makeError(400, 'contextGoal is required');

      const queue = buildGovernanceQueue(workspace, contextGoal, confidenceGapCount);
      if (queue.some((item) => !item.rationale)) {
        throw makeError(409, 'Queue items must include rationale');
      }

      workspace.governanceQueue = queue;
      workspace.status = 'review-ready';
      const topItem = queue[0];
      appendEvent(workspace, 'GovernanceQueueReprioritized', {
        workspaceId,
        topQueueItemId: topItem.queueItemId,
        topPriorityScore: topItem.priorityScore
      });
      return clone(queue);
    },

    selectPrototypeVariant(workspaceId, input) {
      const workspace = requireWorkspace(workspaceId);
      const prototypeVariantId = String(input?.prototypeVariantId || '').trim();
      const critiqueSummary = String(input?.critiqueSummary || '').trim();
      const variant = workspace.prototypeVariants.find((item) => item.prototypeVariantId === prototypeVariantId);

      if (!variant) throw makeError(409, 'Variant belongs to another workspace or does not exist');

      for (const item of workspace.prototypeVariants) {
        item.selectionStatus = item.prototypeVariantId === prototypeVariantId ? 'selected' : 'candidate';
      }

      variant.critiqueSummary = critiqueSummary;
      workspace.selectedPrototypeVariantId = prototypeVariantId;

      if (workspace.prototypeVariants.filter((item) => item.selectionStatus === 'selected').length !== 1) {
        throw makeError(409, 'Only one prototype variant may remain selected');
      }

      return clone(variant);
    },

    startTrackPlayback(workspaceId, input) {
      const workspace = requireWorkspace(workspaceId);
      const trackSource = String(input?.trackSource || '').trim();

      if (!['generated', 'uploaded'].includes(trackSource)) {
        throw makeError(400, 'trackSource must be generated or uploaded');
      }
      if (workspace.runtimeMode !== VALID_RUNTIME_MODE) {
        throw makeError(409, 'Playback is local-only in v1');
      }
      if (!['review-ready', 'demo-ready'].includes(workspace.status)) {
        throw makeError(409, 'Playback requires a review-ready workspace');
      }
      if (ensureDomainMap(workspace).nodeCount < 1) {
        throw makeError(409, 'Playback cannot start before projection exists');
      }

      const playbackSessionId = `playback-${randomUUID().slice(0, 8)}`;
      const session = {
        playbackSessionId,
        workspaceId,
        trackSource,
        playbackStatus: 'playing',
        startedAt: new Date().toISOString()
      };

      workspace.playbackSessions.push(session);
      workspace.activePlaybackSessionId = playbackSessionId;
      workspace.status = 'demo-ready';
      appendEvent(workspace, 'TrackPlaybackStarted', {
        workspaceId,
        playbackSessionId,
        trackSource
      });

      return clone(session);
    },

    getOverview(workspaceId) {
      return getOverview(requireWorkspace(workspaceId));
    },

    inspectNode(workspaceId, nodeId) {
      const workspace = requireWorkspace(workspaceId);
      const domainMap = ensureDomainMap(workspace);
      const node = domainMap.nodes.find((item) => item.id === nodeId);
      if (!node) throw makeError(404, `Node ${nodeId} not found`);

      const relatedLinks = domainMap.links.filter((link) => link.source === nodeId || link.target === nodeId);
      const evidenceTurns = workspace.interviewTurns.filter((turn) => node.evidenceTurnIds.includes(turn.turnId));
      const governanceLinks = workspace.governanceQueue.filter((item) =>
        item.title.toLowerCase().includes(node.label.toLowerCase()) ||
        evidenceTurns.some((turn) => item.rationale.includes(turn.actorRole))
      );

      return {
        nodeId,
        label: node.label,
        type: node.type,
        relatedEdgeCount: relatedLinks.length,
        evidenceTurnCount: evidenceTurns.length,
        relatedLinks: clone(relatedLinks),
        evidenceTurns: clone(evidenceTurns),
        governanceLinks: clone(governanceLinks)
      };
    },

    listGovernanceQueue(workspaceId, filters = {}) {
      const workspace = requireWorkspace(workspaceId);
      let queue = workspace.governanceQueue;
      if (filters.ownerRole && filters.ownerRole !== 'all') {
        queue = queue.filter((item) => item.ownerRole === filters.ownerRole);
      }
      if (filters.status && filters.status !== 'all') {
        queue = queue.filter((item) => item.status === filters.status);
      }
      return clone(queue);
    },

    getWorkspaceState(workspaceId) {
      const workspace = requireWorkspace(workspaceId);
      return {
        workspace: {
          workspaceId: workspace.workspaceId,
          title: workspace.title,
          scopeMode: workspace.scopeMode,
          runtimeMode: workspace.runtimeMode,
          graphPriorityMode: workspace.graphPriorityMode,
          status: workspace.status,
          selectedPrototypeVariantId: workspace.selectedPrototypeVariantId,
          activePlaybackSessionId: workspace.activePlaybackSessionId
        },
        overview: getOverview(workspace),
        domainMap: clone(ensureDomainMap(workspace)),
        governanceQueue: clone(workspace.governanceQueue),
        prototypeVariants: clone(workspace.prototypeVariants),
        playbackSessions: clone(workspace.playbackSessions),
        interviewTurns: clone(workspace.interviewTurns),
        recentEvents: clone(workspace.events.slice(-10))
      };
    },

    serialize() {
      return clone(state);
    }
  };
}
