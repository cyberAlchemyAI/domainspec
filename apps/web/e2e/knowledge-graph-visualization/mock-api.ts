import type { Page, Route } from "@playwright/test";

type ViewLevel = "aspect" | "feature" | "concept";
type CardType = "aspect" | "feature" | "story" | "concept-group" | "concept";

interface MockNode {
  cardId: string;
  cardType: CardType;
  title: string;
  summary: string;
  groupKey: string | null;
  conceptId: string | null;
  aspectKind: "SPEC" | "DOMAIN" | "OPERATIONS" | null;
}

interface MockEdge {
  fromCardId: string;
  edge: string;
  toCardId: string;
  evidence: string;
}

const mockCards = [
  {
    cardId: "aspect:SPEC.md",
    filePath: "SPEC.md",
    title: "SPEC",
    aspectKind: "SPEC",
    conceptCount: 4,
    relationCount: 3,
    freshness: "up-to-date",
  },
  {
    cardId: "aspect:domain.md",
    filePath: "domain.md",
    title: "DOMAIN",
    aspectKind: "DOMAIN",
    conceptCount: 2,
    relationCount: 1,
    freshness: "up-to-date",
  },
  {
    cardId: "aspect:operations.md",
    filePath: "operations.md",
    title: "OPERATIONS",
    aspectKind: "OPERATIONS",
    conceptCount: 2,
    relationCount: 1,
    freshness: "up-to-date",
  },
] as const;

const featureNodes: MockNode[] = [
  {
    cardId: "feature:feature.knowledge-graph-visualization",
    cardType: "feature",
    title: "Knowledge Graph Visualization",
    summary: "Whiteboard-first documentation navigation.",
    groupKey: "feature",
    conceptId: "feature.knowledge-graph-visualization",
    aspectKind: "SPEC",
  },
  {
    cardId: "feature:feature.payment-processing",
    cardType: "feature",
    title: "Payment Processing",
    summary: "Dependency feature for canonical relationships.",
    groupKey: "feature",
    conceptId: "feature.payment-processing",
    aspectKind: "SPEC",
  },
];

const featureLevelNodes: MockNode[] = [
  {
    cardId: "concept-group:SPEC.md",
    cardType: "concept-group",
    title: "SPEC.md",
    summary: "4 concepts in SPEC.md",
    groupKey: "SPEC.md",
    conceptId: null,
    aspectKind: "SPEC",
  },
  {
    cardId: "concept:knowledge-graph-visualization.DocumentationWorkspace",
    cardType: "concept",
    title: "DocumentationWorkspace",
    summary: "Registered documentation source workspace.",
    groupKey: "SPEC.md",
    conceptId: "knowledge-graph-visualization.DocumentationWorkspace",
    aspectKind: "SPEC",
  },
  {
    cardId: "concept:knowledge-graph-visualization.ProjectionScope",
    cardType: "concept",
    title: "ProjectionScope",
    summary: "Scope key that binds project and feature IDs.",
    groupKey: "SPEC.md",
    conceptId: "knowledge-graph-visualization.ProjectionScope",
    aspectKind: "SPEC",
  },
  {
    cardId: "concept:knowledge-graph-visualization.UnresolvedPointer",
    cardType: "concept",
    title: "UnresolvedPointer",
    summary: "Concept intentionally returning pointer diagnostics.",
    groupKey: "SPEC.md",
    conceptId: "knowledge-graph-visualization.UnresolvedPointer",
    aspectKind: "SPEC",
  },
  {
    cardId: "story:story.us3-open-definition",
    cardType: "story",
    title: "US-3 Click concept to open definition",
    summary: "Journey validating concept deep-link behavior.",
    groupKey: "SPEC.md",
    conceptId: "story.us3-open-definition",
    aspectKind: "SPEC",
  },
];

const aspectEdges: MockEdge[] = [
  {
    fromCardId: "feature:feature.knowledge-graph-visualization",
    edge: "depends-on",
    toCardId: "feature:feature.payment-processing",
    evidence:
      "[SPEC graph](docs/features/knowledge-graph-visualization/SPEC.md#feature-concept-graph)",
  },
];

const conceptEdges: MockEdge[] = [
  {
    fromCardId: "concept:knowledge-graph-visualization.DocumentationWorkspace",
    edge: "maps",
    toCardId: "concept:knowledge-graph-visualization.ProjectionScope",
    evidence:
      "[SPEC graph](docs/features/knowledge-graph-visualization/SPEC.md#feature-concept-graph)",
  },
  {
    fromCardId: "story:story.us3-open-definition",
    edge: "validates",
    toCardId: "concept:knowledge-graph-visualization.DocumentationWorkspace",
    evidence:
      "[US-3](docs/features/knowledge-graph-visualization/STORIES.md#us-3-click-concept-to-open-definition)",
  },
  {
    fromCardId: "concept:knowledge-graph-visualization.UnresolvedPointer",
    edge: "references",
    toCardId: "concept:knowledge-graph-visualization.ProjectionScope",
    evidence:
      "[SPEC graph](docs/features/knowledge-graph-visualization/SPEC.md#feature-concept-graph)",
  },
];

export async function installKnowledgeGraphApiMocks(page: Page): Promise<void> {
  const selectedConceptBySession = new Map<string, string>();

  await page.route("**/api/knowledge-graph/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname.endsWith("/api/knowledge-graph/rebuild")) {
      await respond(route, 200, {
        snapshotId: "mock-snapshot",
        projectKey: "domainspec-core",
        featureId: "knowledge-graph-visualization",
        generatedAt: "2026-05-06T12:00:00.000Z",
        nodeCount: 6,
        edgeCount: 3,
        cardCount: 3,
        coverageRatio: 1,
        edgeDensity: 0.5,
      });
      return;
    }

    if (url.pathname.endsWith("/api/knowledge-graph/mirror-cards")) {
      await respond(route, 200, {
        snapshotId: "mock-snapshot",
        projectKey: "domainspec-core",
        featureId: "knowledge-graph-visualization",
        generatedAt: "2026-05-06T12:00:00.000Z",
        cards: mockCards,
      });
      return;
    }

    if (url.pathname.endsWith("/api/knowledge-graph/graph")) {
      const graph = buildGraph(url.searchParams);
      await respond(route, 200, {
        snapshotId: "mock-snapshot",
        projectKey: "domainspec-core",
        featureId: "knowledge-graph-visualization",
        generatedAt: "2026-05-06T12:00:00.000Z",
        ...graph,
      });
      return;
    }

    if (
      request.method() === "GET" &&
      /\/api\/knowledge-graph\/concepts\/[^/]+$/.test(url.pathname)
    ) {
      const conceptId = decodeURIComponent(
        url.pathname.split("/").at(-1) ?? "",
      );
      const sessionId = normalizeOptional(url.searchParams.get("sessionId"));

      if (sessionId && conceptId.length > 0) {
        selectedConceptBySession.set(sessionId, conceptId);
      }

      await respond(route, 200, buildConceptDetail(conceptId));
      return;
    }

    if (url.pathname.endsWith("/definition") && request.method() === "GET") {
      const conceptId = decodeURIComponent(
        url.pathname.split("/").slice(-2, -1)[0] ?? "",
      );

      if (conceptId === "knowledge-graph-visualization.UnresolvedPointer") {
        await respond(route, 404, {
          code: "DEFINITION_POINTER_NOT_FOUND",
          message: "Definition pointer is not available.",
          details: { conceptId },
        });
        return;
      }

      await respond(route, 200, buildPointer(conceptId));
      return;
    }

    if (
      url.pathname.endsWith("/open-definition") &&
      request.method() === "POST"
    ) {
      const conceptId = decodeURIComponent(
        url.pathname.split("/").slice(-2, -1)[0] ?? "",
      );
      const body = parseBody(request.postData());
      const sessionId = normalizeOptional(body.sessionId);

      if (!sessionId || selectedConceptBySession.get(sessionId) !== conceptId) {
        await respond(route, 409, {
          code: "DEFINITION_SESSION_MISMATCH",
          message: "Selection changed. Please select the concept again.",
          details: { sessionId, conceptId },
        });
        return;
      }

      if (conceptId === "knowledge-graph-visualization.UnresolvedPointer") {
        await respond(route, 404, {
          code: "DEFINITION_POINTER_NOT_FOUND",
          message: "Definition link is not available for this concept.",
          details: { conceptId },
        });
        return;
      }

      const pointer = buildPointer(conceptId);
      await respond(route, 200, {
        ...pointer,
        target: `${pointer.filePath}#${pointer.anchor}`,
        openedAt: "2026-05-06T12:00:00.000Z",
      });
      return;
    }

    await route.continue();
  });
}

function buildGraph(searchParams: URLSearchParams) {
  const activeAspect =
    (searchParams.get("activeAspect")?.toUpperCase() as
      | "SPEC"
      | "DOMAIN"
      | "OPERATIONS"
      | null) ?? "SPEC";
  const viewLevel =
    (searchParams.get("viewLevel") as ViewLevel | null) ?? "aspect";
  const selectedFeatureId = normalizeOptional(
    searchParams.get("selectedFeatureId"),
  );
  const selectedGroupKey = normalizeOptional(
    searchParams.get("selectedGroupKey"),
  );

  if (viewLevel === "aspect") {
    return {
      board: {
        viewLevel,
        activeAspect,
        selectedFeatureId,
        selectedGroupKey,
      },
      nodes: featureNodes,
      edges: aspectEdges,
    };
  }

  const scopedNodes = featureLevelNodes.filter((node) => {
    if (node.aspectKind === null) {
      return true;
    }
    return node.aspectKind === activeAspect;
  });

  if (viewLevel === "feature") {
    const filteredNodes =
      selectedGroupKey && selectedGroupKey.length > 0
        ? scopedNodes.filter(
            (node) =>
              node.cardType === "concept-group" ||
              node.groupKey === selectedGroupKey,
          )
        : scopedNodes;

    return {
      board: {
        viewLevel,
        activeAspect,
        selectedFeatureId,
        selectedGroupKey,
      },
      nodes: filteredNodes,
      edges: filterEdges(filteredNodes, conceptEdges),
    };
  }

  const conceptNodes = scopedNodes.filter(
    (node) => node.cardType !== "concept-group",
  );
  const filteredConceptNodes =
    selectedGroupKey && selectedGroupKey.length > 0
      ? conceptNodes.filter((node) => node.groupKey === selectedGroupKey)
      : conceptNodes;

  return {
    board: {
      viewLevel,
      activeAspect,
      selectedFeatureId,
      selectedGroupKey,
    },
    nodes: filteredConceptNodes,
    edges: filterEdges(filteredConceptNodes, conceptEdges),
  };
}

function filterEdges(nodes: MockNode[], edges: MockEdge[]): MockEdge[] {
  const cardIds = new Set(nodes.map((node) => node.cardId));
  return edges.filter(
    (edge) => cardIds.has(edge.fromCardId) && cardIds.has(edge.toCardId),
  );
}

function buildConceptDetail(conceptId: string) {
  const pointer = buildPointer(conceptId);

  return {
    conceptId,
    title: conceptId.split(".").at(-1) ?? conceptId,
    summary: `Detail projection for ${conceptId}.`,
    aspectKind: "SPEC",
    definition: pointer,
    inboundRelations: conceptEdges.filter((edge) =>
      edge.toCardId.endsWith(conceptId),
    ),
    outboundRelations: conceptEdges.filter((edge) =>
      edge.fromCardId.endsWith(conceptId),
    ),
    relatedStories: ["story.us3-open-definition"],
  };
}

function buildPointer(conceptId: string) {
  return {
    filePath: "docs/features/knowledge-graph-visualization/SPEC.md",
    anchor: slug(conceptId.split(".").at(-1) ?? conceptId),
    lineHint: 24,
    label: conceptId,
    aspectKind: "SPEC",
  };
}

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function respond(route: Route, status: number, payload: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

function parseBody(
  postData: string | null,
): Record<string, string | undefined> {
  if (!postData) {
    return {};
  }

  try {
    return JSON.parse(postData) as Record<string, string | undefined>;
  } catch {
    return {};
  }
}

function normalizeOptional(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}
