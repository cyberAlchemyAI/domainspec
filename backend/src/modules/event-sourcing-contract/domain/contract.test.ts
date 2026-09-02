import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalizeCompiledEventSourcingContract,
  compileEventSourcingContract,
  EventSourcingContractError,
  type EventSourcingContractErrorCode,
  type EventSourcingContractSource,
} from "./contract.js";

test("equivalent declaration permutations compile to identical bytes", () => {
  const left = sourceFixture();
  const right: EventSourcingContractSource = {
    ...left,
    streams: [...left.streams].reverse(),
    events: [...left.events].reverse(),
    projections: left.projections.map((projection) => ({
      ...projection,
      consumes: [...projection.consumes].reverse(),
    })),
    joins: [...left.joins].reverse().map((join) => ({
      ...join,
      semanticEventTypes: [...join.semanticEventTypes].reverse(),
    })),
  };

  const leftBytes = canonicalizeCompiledEventSourcingContract(
    compileEventSourcingContract(left),
  );
  const rightBytes = canonicalizeCompiledEventSourcingContract(
    compileEventSourcingContract(right),
  );

  assert.equal(leftBytes, rightBytes);
});

test("repeated compilation is byte-identical and does not mutate the source", () => {
  const source = sourceFixture();
  const before = structuredClone(source);

  const first = canonicalizeCompiledEventSourcingContract(
    compileEventSourcingContract(source),
  );
  const second = canonicalizeCompiledEventSourcingContract(
    compileEventSourcingContract(source),
  );

  assert.equal(first, second);
  assert.deepEqual(source, before);
});

test("compiled streams carry a sorted event inventory and fixed obligations", () => {
  const compiled = compileEventSourcingContract(sourceFixture());

  assert.deepEqual(compiled.streams[0]?.eventTypes, [
    "ChallengeContractStateReplaced",
  ]);
  assert.deepEqual(compiled.streams[1]?.eventTypes, ["NodeStateReplaced"]);
  assert.deepEqual(compiled.streams[2]?.eventTypes, ["RelationStateReplaced"]);
  assert.deepEqual(compiled.ordering, {
    global: "commit-position",
    stream: "stream-position",
  });
  assert.ok(compiled.runtimeObligations.includes("atomic-batch-append"));
  assert.ok(
    compiled.runtimeObligations.includes("validated-checkpoint-tail-replay"),
  );
  assert.ok(compiled.runtimeObligations.includes("one-stream-per-subject"));
  assert.ok(
    compiled.runtimeObligations.includes("exact-cross-stream-reference-join"),
  );
  assert.deepEqual(compiled.joins[0]?.semanticEventTypes, [
    "NodeStateReplaced",
    "RelationStateReplaced",
  ]);
});

test("invalid topology fails closed with typed errors", () => {
  const cases: ReadonlyArray<{
    expected: EventSourcingContractErrorCode;
    source: EventSourcingContractSource;
  }> = [
    {
      expected: "DUPLICATE_STREAM_ID",
      source: {
        ...sourceFixture(),
        streams: [sourceFixture().streams[0]!, sourceFixture().streams[0]!],
      },
    },
    {
      expected: "EVENT_STREAM_UNKNOWN",
      source: {
        ...sourceFixture(),
        events: [
          {
            ...sourceFixture().events[0]!,
            streamId: "missing-stream",
          },
        ],
      },
    },
    {
      expected: "STREAM_FAMILY_INVALID",
      source: {
        ...sourceFixture(),
        streams: sourceFixture().streams.map((stream, index) =>
          index === 0
            ? { ...stream, streamFamily: "ambient" as never }
            : stream,
        ),
      },
    },
    {
      expected: "STREAM_IDENTITY_RULE_INVALID",
      source: {
        ...sourceFixture(),
        streams: sourceFixture().streams.map((stream, index) =>
          index === 0
            ? { ...stream, identityRule: "shared-stream" as never }
            : stream,
        ),
      },
    },
    {
      expected: "STREAM_WITHOUT_EVENTS",
      source: {
        ...sourceFixture(),
        events: sourceFixture().events.filter(
          (event) => event.streamId !== "relation-state",
        ),
        projections: [],
      },
    },
    {
      expected: "PROJECTION_EVENT_DUPLICATE",
      source: {
        ...sourceFixture(),
        projections: [
          {
            ...sourceFixture().projections[0]!,
            consumes: ["NodeStateReplaced", "NodeStateReplaced"],
          },
        ],
      },
    },
    {
      expected: "PROJECTION_EVENT_UNKNOWN",
      source: {
        ...sourceFixture(),
        projections: [
          {
            ...sourceFixture().projections[0]!,
            consumes: ["UnknownEvent"],
          },
        ],
      },
    },
    {
      expected: "PROJECTION_CONSISTENCY_INVALID",
      source: {
        ...sourceFixture(),
        projections: [
          {
            ...sourceFixture().projections[0]!,
            consistency: "latest-per-stream" as never,
          },
        ],
      },
    },
    {
      expected: "JOIN_GOVERNANCE_STREAM_REQUIRED",
      source: {
        ...sourceFixture(),
        joins: [
          {
            ...sourceFixture().joins[0]!,
            governanceEventType: "NodeStateReplaced",
          },
        ],
      },
    },
    {
      expected: "JOIN_SEMANTIC_EVENT_UNKNOWN",
      source: {
        ...sourceFixture(),
        joins: [
          {
            ...sourceFixture().joins[0]!,
            semanticEventTypes: ["MissingSemanticEvent"],
          },
        ],
      },
    },
    {
      expected: "JOIN_SEMANTIC_STREAM_REQUIRED",
      source: {
        ...sourceFixture(),
        joins: [
          {
            ...sourceFixture().joins[0]!,
            semanticEventTypes: ["ChallengeContractStateReplaced"],
          },
        ],
      },
    },
    {
      expected: "JOIN_REFERENCE_SEMANTICS_INVALID",
      source: {
        ...sourceFixture(),
        joins: [
          {
            ...sourceFixture().joins[0]!,
            referenceSemantics: "event-id-only" as never,
          },
        ],
      },
    },
    {
      expected: "JOIN_FAIL_CLOSED_REQUIRED",
      source: {
        ...sourceFixture(),
        joins: [
          {
            ...sourceFixture().joins[0]!,
            failClosed: false as never,
          },
        ],
      },
    },
  ];

  for (const item of cases) {
    assert.throws(
      () => compileEventSourcingContract(item.source),
      (error) =>
        error instanceof EventSourcingContractError &&
        error.code === item.expected,
      item.expected,
    );
  }
});

function sourceFixture(): EventSourcingContractSource {
  return {
    schemaVersion: "domainspec.event-sourcing-source/v1",
    contractId: "ontology-state",
    streams: [
      {
        streamId: "challenge-contract-state",
        subjectKind: "process",
        streamFamily: "governance",
        identityRule: "subject-kind-and-id",
        concurrency: "expected-stream-version",
      },
      {
        streamId: "relation-state",
        subjectKind: "relation",
        streamFamily: "semantic",
        identityRule: "subject-kind-and-id",
        concurrency: "expected-stream-version",
      },
      {
        streamId: "node-state",
        subjectKind: "entity",
        streamFamily: "semantic",
        identityRule: "subject-kind-and-id",
        concurrency: "expected-stream-version",
      },
    ],
    events: [
      {
        eventType: "RelationStateReplaced",
        streamId: "relation-state",
        payloadSchemaRef: "schemas/relation-state.v1.json",
        stateSemantics: "complete-resulting-state",
      },
      {
        eventType: "NodeStateReplaced",
        streamId: "node-state",
        payloadSchemaRef: "schemas/node-state.v1.json",
        stateSemantics: "complete-resulting-state",
      },
      {
        eventType: "ChallengeContractStateReplaced",
        streamId: "challenge-contract-state",
        payloadSchemaRef: "schemas/relation-challenge.v1.json",
        stateSemantics: "complete-resulting-state",
      },
    ],
    projections: [
      {
        projectionId: "current-ontology-state",
        consumes: [
          "RelationStateReplaced",
          "NodeStateReplaced",
          "ChallengeContractStateReplaced",
        ],
        keySelector: "stream-subject",
        consistency: "global-commit-position-cut",
        checkpointPolicy: "latest-valid-checkpoint-plus-tail",
        rebuildable: true,
      },
    ],
    joins: [
      {
        joinId: "challenge-to-semantic-state",
        governanceEventType: "ChallengeContractStateReplaced",
        semanticEventTypes: ["RelationStateReplaced", "NodeStateReplaced"],
        referenceSemantics: "exact-event-identity-digest-commit-position",
        failClosed: true,
      },
    ],
  };
}
