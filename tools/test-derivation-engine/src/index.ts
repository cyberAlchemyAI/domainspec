// Deterministic Test-Derivation Engine — public entrypoint.
// Pipeline: parse -> G -> derive (δ) -> obligation_key -> emit.
// See SPEC.md / ARCHITECTURE.md. No LLM, no network: determinism by construction.

import { parse } from "./grammar/index.js";
import { derive, DEFAULT_RULE_SET, type RuleSet } from "./rules/index.js";
import { emitSpec } from "./emit/spec.js";
import { emitTests } from "./emit/tests.js";
import type { Obligation } from "./ir/types.js";

export interface DeriveOptions {
  readonly rules?: RuleSet;
  readonly emitTests?: boolean;
}

export interface DeriveResult {
  readonly obligations: readonly Obligation[];
  readonly spec: string;
  readonly tests?: string;
}

/** Compile a feature's canonical docs into deterministic test obligations. */
export function deriveFeature(
  featureDir: string,
  opts: DeriveOptions = {},
): DeriveResult {
  const { graph } = parse(featureDir);
  const obligations = derive(graph, opts.rules ?? DEFAULT_RULE_SET);
  return {
    obligations,
    spec: emitSpec(obligations),
    ...(opts.emitTests ? { tests: emitTests(obligations) } : {}),
  };
}

export { parse } from "./grammar/index.js";
export { derive, classifyFormal } from "./rules/index.js";
export type { Obligation } from "./ir/types.js";
export { obligationKey } from "./keys/index.js";
export {
  compareRoundTrip,
  engineSemanticId,
  engineSemanticSet,
  parseCommittedSemantic,
  parseCommittedSpec2,
  semanticRoundTrip,
} from "./roundtrip/index.js";
export type {
  CommittedDialect,
  CommittedSpec,
  SemanticOptions,
} from "./roundtrip/index.js";
