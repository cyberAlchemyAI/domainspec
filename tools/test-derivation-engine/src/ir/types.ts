// Typed concept graph (G) — the stable interchange between engine stages.
// See ARCHITECTURE.md View 3 and GLOSSARY.md. No stage but the parser/round-trip
// reads the filesystem; all others operate on these types only.

export type NodeType =
  | "Entity"
  | "State"
  | "Transition"
  | "Invariant"
  | "Operation"
  | "Rule"
  | "Calculation"
  | "Postcondition"
  | "Endpoint"
  | "Response"
  | "Event"
  | "Consumer"
  | "Field"
  | "Workflow"
  | "WorkflowStep"
  | "Query"
  | "Mapping"
  | "ErrorState";

export type EdgeType =
  | "on" // Transition --on--> Event
  | "from" // Transition --from--> State
  | "to" // Transition --to--> State
  | "enforces" // Operation --enforces--> Invariant
  | "produces" // Operation --produces--> Event
  | "exposes" // Endpoint --exposes--> Operation
  | "consumes"; // Consumer --consumes--> Event

export type Value = string | number | boolean | null;

/** Provenance pointer: `{file}#{heading}:{rowIndex}` (GLOSSARY: source_anchor). */
export type SourceAnchor = string;

export interface Node {
  readonly id: SourceAnchor;
  readonly type: NodeType;
  readonly source_anchor: SourceAnchor;
  readonly fields: Readonly<Record<string, Value>>;
  /** True when a `Formal` cell was prose the grammar could not parse. */
  readonly needs_formal?: boolean;
}

export interface Edge {
  readonly from: SourceAnchor;
  readonly to: SourceAnchor;
  readonly type: EdgeType;
}

/** Concept graph G. Invariant: `nodes` sorted by `source_anchor` for deterministic serialization. */
export interface ConceptGraph {
  readonly nodes: readonly Node[];
  readonly edges: readonly Edge[];
}

/** Content-addressed, byte-stable obligation identifier (GLOSSARY: obligation_key). */
export type ObligationKey = string;

export type RuleType =
  | "valid-transition"
  | "invalid-transition"
  | "invariant"
  | "rule-validation"
  | "calculation"
  | "postcondition"
  | "contract"
  | "event-obligation"
  | "workflow-step"
  | "query-behavior"
  | "mapping-row"
  | "error-obligation"
  | "needs-formal";

export interface Obligation {
  readonly obligation_key: ObligationKey;
  readonly rule_type: RuleType;
  readonly source_anchor: SourceAnchor;
  /** Sorted, normalized rule parameters; the basis for the key hash. */
  readonly canonical_params: Readonly<Record<string, Value>>;
  /** Human-readable description rendered into TEST-SPEC rows. */
  readonly description: string;
}
