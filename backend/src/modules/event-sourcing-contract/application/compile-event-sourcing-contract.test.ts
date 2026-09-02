import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { makeCompileEventSourcingContractUseCase } from "./compile-event-sourcing-contract.js";
import { makeSha256ContentDigest } from "../infrastructure/sha256-content-digest.js";
import type { EventSourcingContractSource } from "../domain/contract.js";

test("compile use case hashes the canonical compiled bytes", () => {
  const useCase = makeCompileEventSourcingContractUseCase({
    contentDigest: makeSha256ContentDigest(),
  });

  const result = useCase(sourceFixture());
  const expected = createHash("sha256")
    .update(result.canonicalJson, "utf8")
    .digest("hex");

  assert.equal(result.digestAlgorithm, "sha256");
  assert.equal(result.digest, expected);
  assert.match(result.digest, /^[a-f0-9]{64}$/);
});

test("equivalent permutations produce the same digest", () => {
  const contentDigest = makeSha256ContentDigest();
  const useCase = makeCompileEventSourcingContractUseCase({ contentDigest });
  const source = sourceFixture();
  const permuted: EventSourcingContractSource = {
    ...source,
    streams: [...source.streams].reverse(),
    events: [...source.events].reverse(),
    joins: [...source.joins].reverse(),
  };

  assert.equal(useCase(source).digest, useCase(permuted).digest);
});

function sourceFixture(): EventSourcingContractSource {
  return {
    schemaVersion: "domainspec.event-sourcing-source/v1",
    contractId: "state-model",
    streams: [
      {
        streamId: "relations",
        subjectKind: "relation",
        streamFamily: "semantic",
        identityRule: "subject-kind-and-id",
        concurrency: "expected-stream-version",
      },
      {
        streamId: "nodes",
        subjectKind: "entity",
        streamFamily: "semantic",
        identityRule: "subject-kind-and-id",
        concurrency: "expected-stream-version",
      },
    ],
    events: [
      {
        eventType: "RelationStateReplaced",
        streamId: "relations",
        payloadSchemaRef: "schemas/relation.json",
        stateSemantics: "complete-resulting-state",
      },
      {
        eventType: "NodeStateReplaced",
        streamId: "nodes",
        payloadSchemaRef: "schemas/node.json",
        stateSemantics: "complete-resulting-state",
      },
    ],
    projections: [],
    joins: [],
  };
}
