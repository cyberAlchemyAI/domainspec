export type KnowledgeGraphErrorCode =
  | "MIRROR_REBUILD_INPUT_INVALID"
  | "MIRROR_REQUIRED_FILE_MISSING"
  | "MIRROR_SPEC_PARSE_FAILED"
  | "MIRROR_CANONICAL_VOCABULARY_UNAVAILABLE"
  | "MIRROR_EDGE_LABEL_INVALID"
  | "MIRROR_EDGE_ENDPOINT_UNKNOWN"
  | "MIRROR_PROJECTION_PERSISTENCE_FAILED"
  | "MIRROR_PROJECTION_NOT_FOUND"
  | "KG_AUTH_REQUIRED"
  | "CONCEPT_NOT_FOUND"
  | "CONCEPT_DEFINITION_UNRESOLVED"
  | "CONCEPT_SELECTION_SOURCE_INVALID"
  | "DEFINITION_SESSION_MISMATCH"
  | "DEFINITION_POINTER_NOT_FOUND"
  | "DEFINITION_ANCHOR_NOT_FOUND";

export type KnowledgeGraphError = Error & {
  code: KnowledgeGraphErrorCode;
  details: Record<string, unknown>;
};

export function createKnowledgeGraphError(
  code: KnowledgeGraphErrorCode,
  message: string,
  details: Record<string, unknown> = {},
): KnowledgeGraphError {
  const error = new Error(message) as KnowledgeGraphError;
  error.name = "KnowledgeGraphError";
  error.code = code;
  error.details = details;
  return error;
}

export function isKnowledgeGraphError(
  error: unknown,
): error is KnowledgeGraphError {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as Partial<KnowledgeGraphError>;
  return (
    typeof candidate.message === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.code === "string" &&
    typeof candidate.details === "object"
  );
}
