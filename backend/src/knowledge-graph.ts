export const CONCEPT_TYPES = [
  "Entity",
  "ValueObject",
  "EnumType",
  "Operation",
  "Query",
  "Calculation",
  "Rule",
  "Policy",
  "Workflow",
  "Saga",
  "Interface",
  "Event",
  "Mapping",
  "StateMachine",
  "Page",
  "Layout",
  "Component",
  "ViewModel",
  "Hook",
  "Form",
  "Action",
  "Guard",
  "Binding",
  "Adapter",
  "StateIndicator",
] as const;

export const EDGE_TYPES = [
  "performs",
  "produces",
  "produces-for",
  "triggers-cross",
  "enforces-cross",
  "enforces",
  "calculates",
  "transitions",
  "exposes",
  "orchestrates",
  "applies",
  "maps",
  "contains",
  "queries",
  "emits",
  "renders",
  "wraps",
  "composes",
  "consumes",
  "submits",
  "shapes",
  "protects",
  "displays",
  "fetches",
  "mutates",
  "reflects",
  "derives",
  "contracts",
  "mirrors",
] as const;

const FEATURE_DOC_STATUSES = [
  "draft",
  "planned",
  "in-progress",
  "implemented",
  "PASS",
  "FLAG",
  "BLOCK",
] as const;

const CONCEPT_TYPE_SET = new Set<string>(CONCEPT_TYPES);
const EDGE_TYPE_SET = new Set<string>(EDGE_TYPES);
const FEATURE_DOC_STATUS_SET = new Set<string>(FEATURE_DOC_STATUSES);

export type ConceptType = (typeof CONCEPT_TYPES)[number];
export type EdgeType = (typeof EDGE_TYPES)[number];
export type FeatureDocStatus = (typeof FEATURE_DOC_STATUSES)[number];

type CapabilityAnchor = {
  featureId: string;
  capabilityKey: string;
  capabilityTitle: string;
  specPath: string;
  specAnchor: string;
  summary?: string;
};

type CapabilitySeed = CapabilityAnchor & {
  conceptIds: string[];
};

type FeatureSeed = {
  featureId: string;
  title: string;
  pillar: string;
  status: FeatureDocStatus;
  priority: string;
  tags: string[];
  capabilities: CapabilitySeed[];
};

type GraphNode = {
  conceptId: string;
  featureId: string;
  conceptType: ConceptType;
  title: string;
  sourcePath: string;
  sourceAnchor?: string;
  status: FeatureDocStatus;
  tags: string[];
};

type GraphEdge = {
  edgeId: string;
  edgeType: EdgeType;
  fromConceptId: string;
  toConceptId: string;
  crossFeature: boolean;
  evidencePath: string;
};

type AtlasFilter = {
  pillar?: string;
  status?: FeatureDocStatus;
  priority?: string;
  tag?: string;
  searchText?: string;
};

type NeighborhoodFilter = {
  conceptTypes?: ConceptType[];
  edgeTypes?: EdgeType[];
  crossFeatureOnly?: boolean;
};

type InspectorFilter = {
  includeIncoming?: boolean;
  includeOutgoing?: boolean;
  edgeTypes?: EdgeType[];
};

const SNAPSHOT = {
  snapshotId: "kgv1-snapshot-2026-05-02",
  generatedAt: "2026-05-02T20:00:00.000Z",
  staleAfterMinutes: 60,
} as const;

const FEATURES: FeatureSeed[] = [
  {
    featureId: "knowledge-graph-visualization",
    title: "Knowledge Graph Visualization",
    pillar: "platform",
    status: "implemented",
    priority: "p1",
    tags: ["knowledge-graph", "domainspec"],
    capabilities: [
      {
        featureId: "knowledge-graph-visualization",
        capabilityKey: "v1-capability-atlas-board",
        capabilityTitle: "V1 Capability Atlas Board",
        specPath:
          "docs/features/knowledge-graph-visualization/capabilities/v1-capability-atlas-board.md",
        specAnchor: "#capability-v1-capability-atlas-board",
        summary:
          "Learnability-first atlas with one-hop neighborhood preview and concept inspector context.",
        conceptIds: [
          "knowledge-graph-visualization.GetFeatureAtlas",
          "knowledge-graph-visualization.GetCapabilityNeighborhood",
          "knowledge-graph-visualization.GetConceptInspectorContext",
          "knowledge-graph-visualization.GraphNode",
          "knowledge-graph-visualization.GraphEdge",
        ],
      },
    ],
  },
  {
    featureId: "payment-processing",
    title: "Payment Processing",
    pillar: "platform",
    status: "implemented",
    priority: "p1",
    tags: ["payments", "finance"],
    capabilities: [
      {
        featureId: "payment-processing",
        capabilityKey: "payment-core-flow",
        capabilityTitle: "Payment Core Flow",
        specPath: "docs/features/payment-processing/SPEC.md",
        specAnchor: "#capabilities",
        summary: "Core payment authorization and settlement lifecycle.",
        conceptIds: [
          "payment-processing.ProcessPayment",
          "payment-processing.PaymentAuthorized",
        ],
      },
    ],
  },
];

const NODES: GraphNode[] = [
  {
    conceptId: "knowledge-graph-visualization.GetFeatureAtlas",
    featureId: "knowledge-graph-visualization",
    conceptType: "Query",
    title: "GetFeatureAtlas",
    sourcePath: "docs/features/knowledge-graph-visualization/queries.md",
    sourceAnchor: "#getfeatureatlas",
    status: "implemented",
    tags: ["v1", "atlas"],
  },
  {
    conceptId: "knowledge-graph-visualization.GetCapabilityNeighborhood",
    featureId: "knowledge-graph-visualization",
    conceptType: "Query",
    title: "GetCapabilityNeighborhood",
    sourcePath: "docs/features/knowledge-graph-visualization/queries.md",
    sourceAnchor: "#getcapabilityneighborhood",
    status: "implemented",
    tags: ["v1", "neighborhood"],
  },
  {
    conceptId: "knowledge-graph-visualization.GetConceptInspectorContext",
    featureId: "knowledge-graph-visualization",
    conceptType: "Query",
    title: "GetConceptInspectorContext",
    sourcePath: "docs/features/knowledge-graph-visualization/queries.md",
    sourceAnchor: "#getconceptinspectorcontext",
    status: "implemented",
    tags: ["v1", "inspector"],
  },
  {
    conceptId: "knowledge-graph-visualization.GraphNode",
    featureId: "knowledge-graph-visualization",
    conceptType: "ValueObject",
    title: "GraphNode",
    sourcePath: "docs/features/knowledge-graph-visualization/domain.md",
    sourceAnchor: "#graphnode",
    status: "implemented",
    tags: ["v1", "domain"],
  },
  {
    conceptId: "knowledge-graph-visualization.GraphEdge",
    featureId: "knowledge-graph-visualization",
    conceptType: "ValueObject",
    title: "GraphEdge",
    sourcePath: "docs/features/knowledge-graph-visualization/domain.md",
    sourceAnchor: "#graphedge",
    status: "implemented",
    tags: ["v1", "domain"],
  },
  {
    conceptId: "payment-processing.ProcessPayment",
    featureId: "payment-processing",
    conceptType: "Operation",
    title: "ProcessPayment",
    sourcePath: "docs/features/payment-processing/operations.md",
    sourceAnchor: "#processpayment",
    status: "implemented",
    tags: ["payments"],
  },
  {
    conceptId: "payment-processing.PaymentAuthorized",
    featureId: "payment-processing",
    conceptType: "Event",
    title: "PaymentAuthorized",
    sourcePath: "docs/features/payment-processing/events.md",
    sourceAnchor: "#paymentauthorized",
    status: "implemented",
    tags: ["payments"],
  },
];

const EDGES: GraphEdge[] = [
  {
    edgeId: "kgv1-e1",
    edgeType: "queries",
    fromConceptId: "knowledge-graph-visualization.GetFeatureAtlas",
    toConceptId: "knowledge-graph-visualization.GraphNode",
    crossFeature: false,
    evidencePath:
      "docs/features/knowledge-graph-visualization/queries.md#getfeatureatlas",
  },
  {
    edgeId: "kgv1-e2",
    edgeType: "queries",
    fromConceptId: "knowledge-graph-visualization.GetCapabilityNeighborhood",
    toConceptId: "knowledge-graph-visualization.GraphEdge",
    crossFeature: false,
    evidencePath:
      "docs/features/knowledge-graph-visualization/queries.md#getcapabilityneighborhood",
  },
  {
    edgeId: "kgv1-e3",
    edgeType: "derives",
    fromConceptId: "knowledge-graph-visualization.GraphNode",
    toConceptId: "knowledge-graph-visualization.GetConceptInspectorContext",
    crossFeature: false,
    evidencePath:
      "docs/features/knowledge-graph-visualization/mappings.md#concepttoinspectorview",
  },
  {
    edgeId: "kgv1-e4",
    edgeType: "produces-for",
    fromConceptId: "knowledge-graph-visualization.GetFeatureAtlas",
    toConceptId: "payment-processing.ProcessPayment",
    crossFeature: true,
    evidencePath:
      "docs/features/knowledge-graph-visualization/STORIES.md#us-v1-04-preview-cross-feature-connections",
  },
  {
    edgeId: "kgv1-e5",
    edgeType: "triggers-cross",
    fromConceptId: "payment-processing.ProcessPayment",
    toConceptId: "knowledge-graph-visualization.GetConceptInspectorContext",
    crossFeature: true,
    evidencePath:
      "docs/features/knowledge-graph-visualization/STORIES.md#us-v1-04-preview-cross-feature-connections",
  },
];

const NODE_BY_ID = new Map(NODES.map((node) => [node.conceptId, node]));

function toCapabilityAnchor(capability: CapabilitySeed): CapabilityAnchor {
  return {
    featureId: capability.featureId,
    capabilityKey: capability.capabilityKey,
    capabilityTitle: capability.capabilityTitle,
    specPath: capability.specPath,
    specAnchor: capability.specAnchor,
    summary: capability.summary,
  };
}

export function isFeatureDocStatus(value: string): value is FeatureDocStatus {
  return FEATURE_DOC_STATUS_SET.has(value);
}

export function isConceptType(value: string): value is ConceptType {
  return CONCEPT_TYPE_SET.has(value);
}

export function isEdgeType(value: string): value is EdgeType {
  return EDGE_TYPE_SET.has(value);
}

export function getFeatureAtlas(input: {
  profileId?: string;
  filter?: AtlasFilter;
  includeCapabilities?: boolean;
}) {
  const includeCapabilities = input.includeCapabilities ?? true;
  const filter = input.filter ?? {};
  const normalizedSearch = filter.searchText?.trim().toLowerCase();

  const filtered = FEATURES.filter((feature) => {
    if (filter.pillar && feature.pillar !== filter.pillar) {
      return false;
    }

    if (filter.status && feature.status !== filter.status) {
      return false;
    }

    if (filter.priority && feature.priority !== filter.priority) {
      return false;
    }

    if (filter.tag && !feature.tags.includes(filter.tag)) {
      return false;
    }

    if (normalizedSearch) {
      const searchSpace = [
        feature.title,
        ...feature.capabilities.map((capability) => capability.capabilityTitle),
      ]
        .join(" ")
        .toLowerCase();

      if (!searchSpace.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });

  const features = filtered.map((feature) => {
    const capabilityAnchors = feature.capabilities.map(toCapabilityAnchor);

    return {
      featureId: feature.featureId,
      title: feature.title,
      pillar: feature.pillar,
      status: feature.status,
      priority: feature.priority,
      tags: feature.tags,
      capabilityCount: capabilityAnchors.length,
      ...(includeCapabilities ? { capabilities: capabilityAnchors } : {}),
    };
  });

  return {
    snapshotId: SNAPSHOT.snapshotId,
    generatedAt: SNAPSHOT.generatedAt,
    staleAfterMinutes: SNAPSHOT.staleAfterMinutes,
    profileId: input.profileId ?? null,
    featureCount: features.length,
    features,
  };
}

export function getCapabilityNeighborhood(input: {
  featureId: string;
  capabilityKey: string;
  depth?: number;
  filter?: NeighborhoodFilter;
}) {
  const feature = FEATURES.find((entry) => entry.featureId === input.featureId);
  if (!feature) {
    return null;
  }

  const capability = feature.capabilities.find(
    (entry) => entry.capabilityKey === input.capabilityKey,
  );
  if (!capability) {
    return null;
  }

  const rootConceptId = capability.conceptIds[0];
  if (!rootConceptId || !NODE_BY_ID.has(rootConceptId)) {
    return null;
  }

  let edges = EDGES.filter(
    (edge) =>
      edge.fromConceptId === rootConceptId ||
      edge.toConceptId === rootConceptId,
  );

  if (input.filter?.crossFeatureOnly) {
    edges = edges.filter((edge) => edge.crossFeature);
  }

  if (input.filter?.edgeTypes?.length) {
    const allowedEdgeTypes = new Set<string>(input.filter.edgeTypes);
    edges = edges.filter((edge) => allowedEdgeTypes.has(edge.edgeType));
  }

  let nodeIds = new Set<string>([rootConceptId]);
  for (const edge of edges) {
    nodeIds.add(edge.fromConceptId);
    nodeIds.add(edge.toConceptId);
  }

  let nodes = NODES.filter((node) => nodeIds.has(node.conceptId));
  if (input.filter?.conceptTypes?.length) {
    const allowedConceptTypes = new Set<string>(input.filter.conceptTypes);
    nodes = nodes.filter((node) => allowedConceptTypes.has(node.conceptType));
  }

  nodeIds = new Set(nodes.map((node) => node.conceptId));
  edges = edges.filter(
    (edge) => nodeIds.has(edge.fromConceptId) && nodeIds.has(edge.toConceptId),
  );

  return {
    snapshotId: SNAPSHOT.snapshotId,
    capability: toCapabilityAnchor(capability),
    depth: 1,
    nodes,
    edges,
  };
}

export function getConceptInspectorContext(input: {
  conceptId: string;
  filter?: InspectorFilter;
}) {
  const concept = NODE_BY_ID.get(input.conceptId);
  if (!concept) {
    return null;
  }

  const includeIncoming = input.filter?.includeIncoming ?? true;
  const includeOutgoing = input.filter?.includeOutgoing ?? true;
  const allowedEdgeTypes = input.filter?.edgeTypes
    ? new Set<string>(input.filter.edgeTypes)
    : null;

  const neighborEdges = EDGES.filter((edge) => {
    const matchesDirection =
      (includeIncoming && edge.toConceptId === input.conceptId) ||
      (includeOutgoing && edge.fromConceptId === input.conceptId);

    if (!matchesDirection) {
      return false;
    }

    if (!allowedEdgeTypes) {
      return true;
    }

    return allowedEdgeTypes.has(edge.edgeType);
  });

  const linkedCapabilities = FEATURES.flatMap((feature) =>
    feature.capabilities
      .filter((capability) => capability.conceptIds.includes(input.conceptId))
      .map(toCapabilityAnchor),
  );

  return {
    concept,
    linkedCapabilities,
    neighborEdges,
  };
}

export function getDependencyMatrix() {
  const cells = [
    {
      sourceFeatureId: "knowledge-graph-visualization",
      targetFeatureId: "payment-processing",
      riskScore: 58,
      riskBand: "Warning",
      effectiveState: "Warning",
      evidenceAvailable: true,
    },
  ];

  return {
    snapshotId: SNAPSHOT.snapshotId,
    cells,
    maxRiskScore: 58,
  };
}
