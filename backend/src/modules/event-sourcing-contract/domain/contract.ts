export const EVENT_SOURCING_SOURCE_SCHEMA_VERSION =
  "domainspec.event-sourcing-source/v1" as const;
export const EVENT_SOURCING_COMPILED_SCHEMA_VERSION =
  "domainspec.event-sourcing-compiled/v1" as const;

export type EventSourcingSubjectKind = "entity" | "relation" | "process";
export type EventSourcingStreamFamily = "semantic" | "governance";

export interface StreamDefinitionSource {
  readonly streamId: string;
  readonly subjectKind: EventSourcingSubjectKind;
  readonly streamFamily: EventSourcingStreamFamily;
  readonly identityRule: "subject-kind-and-id";
  readonly concurrency: "expected-stream-version";
}

export interface EventDefinitionSource {
  readonly eventType: string;
  readonly streamId: string;
  readonly payloadSchemaRef: string;
  readonly stateSemantics: "complete-resulting-state";
}

export interface ProjectionDefinitionSource {
  readonly projectionId: string;
  readonly consumes: readonly string[];
  readonly keySelector: "stream-subject";
  readonly consistency: "global-commit-position-cut";
  readonly checkpointPolicy: "latest-valid-checkpoint-plus-tail";
  readonly rebuildable: true;
}

export interface EventReferenceJoinDefinitionSource {
  readonly joinId: string;
  readonly governanceEventType: string;
  readonly semanticEventTypes: readonly string[];
  readonly referenceSemantics: "exact-event-identity-digest-commit-position";
  readonly failClosed: true;
}

export interface EventSourcingContractSource {
  readonly schemaVersion: typeof EVENT_SOURCING_SOURCE_SCHEMA_VERSION;
  readonly contractId: string;
  readonly streams: readonly StreamDefinitionSource[];
  readonly events: readonly EventDefinitionSource[];
  readonly projections: readonly ProjectionDefinitionSource[];
  readonly joins: readonly EventReferenceJoinDefinitionSource[];
}

export interface CompiledStreamDefinition extends StreamDefinitionSource {
  readonly eventTypes: readonly string[];
}

export interface CompiledProjectionDefinition extends ProjectionDefinitionSource {
  readonly consumes: readonly string[];
}

export interface CompiledEventReferenceJoinDefinition extends EventReferenceJoinDefinitionSource {
  readonly semanticEventTypes: readonly string[];
}

export type EventSourcingRuntimeObligation =
  | "atomic-batch-append"
  | "expected-stream-version-check"
  | "monotonic-stream-position"
  | "monotonic-commit-position"
  | "unique-event-identity"
  | "one-stream-per-subject"
  | "semantic-governance-stream-separation"
  | "exact-cross-stream-reference-join"
  | "graph-consistent-cut-projection"
  | "rebuildable-projections"
  | "validated-checkpoint-tail-replay"
  | "fail-closed-history-continuity";

export interface CompiledEventSourcingContract {
  readonly schemaVersion: typeof EVENT_SOURCING_COMPILED_SCHEMA_VERSION;
  readonly sourceSchemaVersion: typeof EVENT_SOURCING_SOURCE_SCHEMA_VERSION;
  readonly contractId: string;
  readonly ordering: {
    readonly stream: "stream-position";
    readonly global: "commit-position";
  };
  readonly streams: readonly CompiledStreamDefinition[];
  readonly events: readonly EventDefinitionSource[];
  readonly projections: readonly CompiledProjectionDefinition[];
  readonly joins: readonly CompiledEventReferenceJoinDefinition[];
  readonly runtimeObligations: readonly EventSourcingRuntimeObligation[];
}

export type EventSourcingContractErrorCode =
  | "SOURCE_SCHEMA_VERSION_INVALID"
  | "CONTRACT_ID_EMPTY"
  | "STREAMS_EMPTY"
  | "EVENTS_EMPTY"
  | "STREAM_ID_EMPTY"
  | "EVENT_TYPE_EMPTY"
  | "PROJECTION_ID_EMPTY"
  | "DUPLICATE_STREAM_ID"
  | "DUPLICATE_EVENT_TYPE"
  | "DUPLICATE_PROJECTION_ID"
  | "DUPLICATE_JOIN_ID"
  | "STREAM_FAMILY_INVALID"
  | "STREAM_IDENTITY_RULE_INVALID"
  | "STREAM_CONCURRENCY_INVALID"
  | "EVENT_STREAM_UNKNOWN"
  | "STREAM_WITHOUT_EVENTS"
  | "PAYLOAD_SCHEMA_REF_EMPTY"
  | "STATE_SEMANTICS_INVALID"
  | "PROJECTION_EVENTS_EMPTY"
  | "PROJECTION_EVENT_DUPLICATE"
  | "PROJECTION_EVENT_UNKNOWN"
  | "PROJECTION_KEY_INVALID"
  | "PROJECTION_CONSISTENCY_INVALID"
  | "PROJECTION_CHECKPOINT_POLICY_INVALID"
  | "PROJECTION_REBUILD_REQUIRED"
  | "JOIN_ID_EMPTY"
  | "JOIN_GOVERNANCE_EVENT_UNKNOWN"
  | "JOIN_GOVERNANCE_STREAM_REQUIRED"
  | "JOIN_SEMANTIC_EVENTS_EMPTY"
  | "JOIN_SEMANTIC_EVENT_DUPLICATE"
  | "JOIN_SEMANTIC_EVENT_UNKNOWN"
  | "JOIN_SEMANTIC_STREAM_REQUIRED"
  | "JOIN_REFERENCE_SEMANTICS_INVALID"
  | "JOIN_FAIL_CLOSED_REQUIRED";

export class EventSourcingContractError extends Error {
  readonly code: EventSourcingContractErrorCode;
  readonly details: Readonly<Record<string, unknown>>;

  constructor(
    code: EventSourcingContractErrorCode,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = "EventSourcingContractError";
    this.code = code;
    this.details = details;
  }
}

const RUNTIME_OBLIGATIONS: readonly EventSourcingRuntimeObligation[] = [
  "atomic-batch-append",
  "expected-stream-version-check",
  "monotonic-stream-position",
  "monotonic-commit-position",
  "unique-event-identity",
  "one-stream-per-subject",
  "semantic-governance-stream-separation",
  "exact-cross-stream-reference-join",
  "graph-consistent-cut-projection",
  "rebuildable-projections",
  "validated-checkpoint-tail-replay",
  "fail-closed-history-continuity",
];

export function compileEventSourcingContract(
  source: EventSourcingContractSource,
): CompiledEventSourcingContract {
  validateSource(source);

  const events = [...source.events]
    .map((event) => ({ ...event }))
    .sort((left, right) => compare(left.eventType, right.eventType));
  const eventTypesByStream = new Map<string, string[]>();
  for (const event of events) {
    const eventTypes = eventTypesByStream.get(event.streamId) ?? [];
    eventTypes.push(event.eventType);
    eventTypesByStream.set(event.streamId, eventTypes);
  }

  const streams = [...source.streams]
    .map((stream) => ({
      ...stream,
      eventTypes: [...(eventTypesByStream.get(stream.streamId) ?? [])].sort(
        compare,
      ),
    }))
    .sort((left, right) => compare(left.streamId, right.streamId));
  const projections = [...source.projections]
    .map((projection) => ({
      ...projection,
      consumes: [...projection.consumes].sort(compare),
    }))
    .sort((left, right) => compare(left.projectionId, right.projectionId));
  const joins = [...source.joins]
    .map((join) => ({
      ...join,
      semanticEventTypes: [...join.semanticEventTypes].sort(compare),
    }))
    .sort((left, right) => compare(left.joinId, right.joinId));

  return {
    schemaVersion: EVENT_SOURCING_COMPILED_SCHEMA_VERSION,
    sourceSchemaVersion: EVENT_SOURCING_SOURCE_SCHEMA_VERSION,
    contractId: source.contractId,
    ordering: {
      stream: "stream-position",
      global: "commit-position",
    },
    streams,
    events,
    projections,
    joins,
    runtimeObligations: [...RUNTIME_OBLIGATIONS],
  };
}

export function canonicalizeCompiledEventSourcingContract(
  contract: CompiledEventSourcingContract,
): string {
  const serialized = JSON.stringify(sortObjectKeys(contract));
  if (serialized === undefined) {
    throw new TypeError("Compiled event-sourcing contract is not serializable");
  }
  return serialized;
}

function validateSource(source: EventSourcingContractSource): void {
  if (source.schemaVersion !== EVENT_SOURCING_SOURCE_SCHEMA_VERSION) {
    fail("SOURCE_SCHEMA_VERSION_INVALID", "Unsupported source schema version", {
      schemaVersion: source.schemaVersion,
    });
  }
  requireText(source.contractId, "CONTRACT_ID_EMPTY", "contractId");
  if (source.streams.length === 0) {
    fail("STREAMS_EMPTY", "At least one stream is required");
  }
  if (source.events.length === 0) {
    fail("EVENTS_EMPTY", "At least one event definition is required");
  }

  const streamIds = uniqueIds(
    source.streams.map((stream) => stream.streamId),
    "STREAM_ID_EMPTY",
    "DUPLICATE_STREAM_ID",
    "streamId",
  );
  const streamsById = new Map(
    source.streams.map((stream) => [stream.streamId, stream]),
  );
  for (const stream of source.streams) {
    if (
      stream.streamFamily !== "semantic" &&
      stream.streamFamily !== "governance"
    ) {
      fail(
        "STREAM_FAMILY_INVALID",
        "Stream family must be semantic or governance",
        {
          streamId: stream.streamId,
          streamFamily: stream.streamFamily,
        },
      );
    }
    if (stream.identityRule !== "subject-kind-and-id") {
      fail(
        "STREAM_IDENTITY_RULE_INVALID",
        "Version one requires one derived stream per subject kind and identity",
        { streamId: stream.streamId, identityRule: stream.identityRule },
      );
    }
    if (stream.concurrency !== "expected-stream-version") {
      fail(
        "STREAM_CONCURRENCY_INVALID",
        "Version one requires expected-stream-version concurrency",
        { streamId: stream.streamId, concurrency: stream.concurrency },
      );
    }
  }

  const eventTypes = uniqueIds(
    source.events.map((event) => event.eventType),
    "EVENT_TYPE_EMPTY",
    "DUPLICATE_EVENT_TYPE",
    "eventType",
  );
  const streamsWithEvents = new Set<string>();
  const eventsByType = new Map(
    source.events.map((event) => [event.eventType, event]),
  );
  for (const event of source.events) {
    if (!streamIds.has(event.streamId)) {
      fail("EVENT_STREAM_UNKNOWN", "Event references an unknown stream", {
        eventType: event.eventType,
        streamId: event.streamId,
      });
    }
    requireText(
      event.payloadSchemaRef,
      "PAYLOAD_SCHEMA_REF_EMPTY",
      "payloadSchemaRef",
      { eventType: event.eventType },
    );
    if (event.stateSemantics !== "complete-resulting-state") {
      fail(
        "STATE_SEMANTICS_INVALID",
        "Version one requires complete-resulting-state events",
        { eventType: event.eventType, stateSemantics: event.stateSemantics },
      );
    }
    streamsWithEvents.add(event.streamId);
  }
  for (const streamId of streamIds) {
    if (!streamsWithEvents.has(streamId)) {
      fail("STREAM_WITHOUT_EVENTS", "Every stream must declare an event", {
        streamId,
      });
    }
  }

  uniqueIds(
    source.projections.map((projection) => projection.projectionId),
    "PROJECTION_ID_EMPTY",
    "DUPLICATE_PROJECTION_ID",
    "projectionId",
  );
  for (const projection of source.projections) {
    if (projection.consumes.length === 0) {
      fail(
        "PROJECTION_EVENTS_EMPTY",
        "Projection must consume at least one event",
        { projectionId: projection.projectionId },
      );
    }
    const observed = new Set<string>();
    for (const eventType of projection.consumes) {
      if (observed.has(eventType)) {
        fail(
          "PROJECTION_EVENT_DUPLICATE",
          "Projection event inputs must be unique",
          { projectionId: projection.projectionId, eventType },
        );
      }
      if (!eventTypes.has(eventType)) {
        fail(
          "PROJECTION_EVENT_UNKNOWN",
          "Projection references an unknown event",
          { projectionId: projection.projectionId, eventType },
        );
      }
      observed.add(eventType);
    }
    if (projection.keySelector !== "stream-subject") {
      fail(
        "PROJECTION_KEY_INVALID",
        "Version one projections must use stream-subject keys",
        { projectionId: projection.projectionId },
      );
    }
    if (projection.consistency !== "global-commit-position-cut") {
      fail(
        "PROJECTION_CONSISTENCY_INVALID",
        "Version one projections require one global commit-position cut",
        {
          projectionId: projection.projectionId,
          consistency: projection.consistency,
        },
      );
    }
    if (projection.checkpointPolicy !== "latest-valid-checkpoint-plus-tail") {
      fail(
        "PROJECTION_CHECKPOINT_POLICY_INVALID",
        "Version one projections require validated checkpoint plus tail replay",
        { projectionId: projection.projectionId },
      );
    }
    if (projection.rebuildable !== true) {
      fail(
        "PROJECTION_REBUILD_REQUIRED",
        "Version one projections must be rebuildable",
        { projectionId: projection.projectionId },
      );
    }
  }

  uniqueIds(
    source.joins.map((join) => join.joinId),
    "JOIN_ID_EMPTY",
    "DUPLICATE_JOIN_ID",
    "joinId",
  );
  for (const join of source.joins) {
    const governanceEvent = eventsByType.get(join.governanceEventType);
    if (governanceEvent === undefined) {
      fail(
        "JOIN_GOVERNANCE_EVENT_UNKNOWN",
        "Join references an unknown governance event",
        { joinId: join.joinId, eventType: join.governanceEventType },
      );
    }
    const governanceStream = streamsById.get(governanceEvent.streamId);
    if (governanceStream?.streamFamily !== "governance") {
      fail(
        "JOIN_GOVERNANCE_STREAM_REQUIRED",
        "Join governance event must belong to a governance stream",
        { joinId: join.joinId, eventType: join.governanceEventType },
      );
    }
    if (join.semanticEventTypes.length === 0) {
      fail(
        "JOIN_SEMANTIC_EVENTS_EMPTY",
        "Join must reference at least one semantic event type",
        { joinId: join.joinId },
      );
    }
    const observedSemanticEvents = new Set<string>();
    for (const eventType of join.semanticEventTypes) {
      if (observedSemanticEvents.has(eventType)) {
        fail(
          "JOIN_SEMANTIC_EVENT_DUPLICATE",
          "Join semantic event types must be unique",
          { joinId: join.joinId, eventType },
        );
      }
      const semanticEvent = eventsByType.get(eventType);
      if (semanticEvent === undefined) {
        fail(
          "JOIN_SEMANTIC_EVENT_UNKNOWN",
          "Join references an unknown semantic event",
          { joinId: join.joinId, eventType },
        );
      }
      const semanticStream = streamsById.get(semanticEvent.streamId);
      if (semanticStream?.streamFamily !== "semantic") {
        fail(
          "JOIN_SEMANTIC_STREAM_REQUIRED",
          "Join semantic event must belong to a semantic stream",
          { joinId: join.joinId, eventType },
        );
      }
      observedSemanticEvents.add(eventType);
    }
    if (
      join.referenceSemantics !== "exact-event-identity-digest-commit-position"
    ) {
      fail(
        "JOIN_REFERENCE_SEMANTICS_INVALID",
        "Version one joins require exact identity, digest, and commit position",
        { joinId: join.joinId, referenceSemantics: join.referenceSemantics },
      );
    }
    if (join.failClosed !== true) {
      fail("JOIN_FAIL_CLOSED_REQUIRED", "Version one joins must fail closed", {
        joinId: join.joinId,
      });
    }
  }
}

function uniqueIds(
  values: readonly string[],
  emptyCode: EventSourcingContractErrorCode,
  duplicateCode: EventSourcingContractErrorCode,
  field: string,
): ReadonlySet<string> {
  const observed = new Set<string>();
  for (const value of values) {
    requireText(value, emptyCode, field);
    if (observed.has(value)) {
      fail(duplicateCode, `${field} values must be unique`, { [field]: value });
    }
    observed.add(value);
  }
  return observed;
}

function requireText(
  value: string,
  code: EventSourcingContractErrorCode,
  field: string,
  details: Readonly<Record<string, unknown>> = {},
): void {
  if (value.trim().length === 0) {
    fail(code, `${field} must not be empty`, { ...details, [field]: value });
  }
}

function fail(
  code: EventSourcingContractErrorCode,
  message: string,
  details: Readonly<Record<string, unknown>> = {},
): never {
  throw new EventSourcingContractError(code, message, details);
}

function compare(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => compare(left, right))
        .map(([key, item]) => [key, sortObjectKeys(item)]),
    );
  }
  return value;
}
