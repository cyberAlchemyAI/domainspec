import {
  canonicalizeCompiledEventSourcingContract,
  compileEventSourcingContract,
  type CompiledEventSourcingContract,
  type EventSourcingContractSource,
} from "../domain/contract.js";

export interface ContentDigestPort {
  sha256(content: string): string;
}

export interface CompileEventSourcingContractResult {
  readonly contract: CompiledEventSourcingContract;
  readonly canonicalJson: string;
  readonly digestAlgorithm: "sha256";
  readonly digest: string;
}

export function makeCompileEventSourcingContractUseCase(dependencies: {
  readonly contentDigest: ContentDigestPort;
}): (
  source: EventSourcingContractSource,
) => CompileEventSourcingContractResult {
  return (source) => {
    const contract = compileEventSourcingContract(source);
    const canonicalJson = canonicalizeCompiledEventSourcingContract(contract);
    return {
      contract,
      canonicalJson,
      digestAlgorithm: "sha256",
      digest: dependencies.contentDigest.sha256(canonicalJson),
    };
  };
}
