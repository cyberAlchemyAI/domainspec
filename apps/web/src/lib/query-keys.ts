export const queryKeys = {
  kg: {
    cards: (featureId: string) =>
      ["knowledge-graph", "cards", featureId] as const,
    graph: (featureId: string) =>
      ["knowledge-graph", "graph", featureId] as const,
    detail: (featureId: string, conceptId: string) =>
      ["knowledge-graph", "detail", featureId, conceptId] as const,
    definition: (featureId: string, conceptId: string) =>
      ["knowledge-graph", "definition", featureId, conceptId] as const,
  },
};
