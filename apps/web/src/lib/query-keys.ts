export const queryKeys = {
  kg: {
    cards: (projectKey: string, featureId: string) =>
      ["knowledge-graph", "cards", projectKey, featureId] as const,
    graph: (
      projectKey: string,
      featureId: string,
      activeAspect: string,
      viewLevel: string,
      selectedFeatureId: string | null,
      selectedGroupKey: string | null,
    ) =>
      [
        "knowledge-graph",
        "graph",
        projectKey,
        featureId,
        activeAspect,
        viewLevel,
        selectedFeatureId,
        selectedGroupKey,
      ] as const,
    detail: (
      projectKey: string,
      featureId: string,
      conceptId: string,
      activeAspect: string,
      viewLevel: string,
      selectedFeatureId: string | null,
      selectedGroupKey: string | null,
    ) =>
      [
        "knowledge-graph",
        "detail",
        projectKey,
        featureId,
        conceptId,
        activeAspect,
        viewLevel,
        selectedFeatureId,
        selectedGroupKey,
      ] as const,
    definition: (projectKey: string, featureId: string, conceptId: string) =>
      [
        "knowledge-graph",
        "definition",
        projectKey,
        featureId,
        conceptId,
      ] as const,
  },
};
