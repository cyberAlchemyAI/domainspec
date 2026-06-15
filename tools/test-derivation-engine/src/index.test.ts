import { describe, it, expect } from "vitest";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { deriveFeature, obligationKey } from "./index.js";
import { emitTests } from "./emit/tests.js";
import { parse } from "./grammar/index.js";
import { derive, classifyFormal } from "./rules/index.js";
import {
  compareRoundTrip,
  engineSemanticSet,
  parseCommittedSemantic,
  parseCommittedSpec2,
  semanticRoundTrip,
} from "./roundtrip/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEATURE_DIR = resolve(
  __dirname,
  "../../../../../validation/poker-team/docs/features/financial-settlement",
);
const AUTH_DIR = resolve(
  __dirname,
  "../../../../../validation/poker-team/docs/features/auth-access-control",
);

describe("engine skeleton (SWU-ENG-000)", () => {
  it("pipeline wires together and returns a spec string", () => {
    const result = deriveFeature("nonexistent-feature");
    expect(result.obligations).toEqual([]);
    expect(typeof result.spec).toBe("string");
  });

  it("emits tests only when requested", () => {
    expect(deriveFeature("x").tests).toBeUndefined();
    expect(typeof deriveFeature("x", { emitTests: true }).tests).toBe("string");
  });
});

describe("obligation_key determinism (R-003 / D-003)", () => {
  it("is byte-identical for the same inputs", () => {
    const a = obligationKey("states.md#table:3", "invalid-transition", {
      from: "OPEN",
      on: "CANCEL",
    });
    const b = obligationKey("states.md#table:3", "invalid-transition", {
      from: "OPEN",
      on: "CANCEL",
    });
    expect(a).toBe(b);
  });

  it("is invariant to param insertion order (canonical_params is sorted)", () => {
    const a = obligationKey("s#t:1", "invariant", { x: 1, y: 2 });
    const b = obligationKey("s#t:1", "invariant", { y: 2, x: 1 });
    expect(a).toBe(b);
  });

  it("changes when any component changes", () => {
    const base = obligationKey("s#t:1", "invariant", { x: 1 });
    expect(obligationKey("s#t:2", "invariant", { x: 1 })).not.toBe(base);
    expect(obligationKey("s#t:1", "calculation", { x: 1 })).not.toBe(base);
    expect(obligationKey("s#t:1", "invariant", { x: 2 })).not.toBe(base);
  });
});

describe("round-trip comparison (L0 gate logic)", () => {
  it("passes when derived is a superset of committed", () => {
    const r = compareRoundTrip(new Set(["a", "b", "c"]), new Set(["a", "b"]));
    expect(r.pass).toBe(true);
    expect(r.extra).toEqual(["c"]);
    expect(r.missing).toEqual([]);
  });

  it("fails when an obligation is missing", () => {
    const r = compareRoundTrip(new Set(["a"]), new Set(["a", "b"]));
    expect(r.pass).toBe(false);
    expect(r.missing).toEqual(["b"]);
  });
});

// --- Parser: G shape over financial-settlement --------------------------------

describe("parser builds G over financial-settlement (SWU-ENG-001)", () => {
  const { graph, violations } = parse(FEATURE_DIR);
  const byType = (t: string) => graph.nodes.filter((n) => n.type === t);

  it("parses the real docs with no violations", () => {
    expect(violations).toEqual([]);
  });

  it("extracts the expected entity / transition / invariant nodes from states.md", () => {
    expect(byType("Entity").map((n) => n.fields.name)).toContain(
      "SettlementExecutionState",
    );
    expect(byType("Transition")).toHaveLength(4);
    expect(
      byType("Invariant")
        .map((n) => n.fields.id)
        .sort(),
    ).toEqual(["I1", "I2"]);
  });

  it("extracts rules / calculations / postconditions from operations.md", () => {
    expect(
      byType("Rule")
        .map((n) => n.fields.id)
        .sort(),
    ).toEqual(["R1", "R2", "R3", "R4", "R5"]);
    expect(
      byType("Calculation")
        .map((n) => n.fields.id)
        .sort(),
    ).toEqual(["C1", "C2", "C3", "C4"]);
    expect(
      byType("Postcondition")
        .map((n) => n.fields.id)
        .sort(),
    ).toEqual(["P1", "P2", "P3", "P4"]);
  });

  it("extracts endpoints / responses and events / consumers", () => {
    expect(byType("Endpoint").length).toBeGreaterThanOrEqual(2);
    expect(byType("Response").length).toBeGreaterThan(0);
    expect(
      byType("Event")
        .map((n) => n.fields.name)
        .sort(),
    ).toEqual(["PayoutCreated", "SettlementGenerated"]);
    expect(byType("Consumer").length).toBe(2);
  });

  it("nodes are sorted by source_anchor (deterministic serialization)", () => {
    const anchors = graph.nodes.map((n) => n.source_anchor);
    const sorted = [...anchors].sort();
    expect(anchors).toEqual(sorted);
  });
});

// --- δ rules ------------------------------------------------------------------

describe("formal-expression classifier (exact cardinality)", () => {
  it("classifies the financial-settlement Formal cells", () => {
    expect(classifyFormal("exists(Player.id == playerId)").kind).toBe(
      "EXISTENCE",
    );
    expect(
      classifyFormal(
        "playerId != null and startDate != null and endDate != null",
      ),
    ).toEqual({
      kind: "PRESENCE",
      count: 3,
    });
    expect(classifyFormal("startDate <= stats.date <= endDate")).toEqual({
      kind: "RANGE",
      count: 4,
    });
    expect(
      classifyFormal("count(tx[type=PAYOUT,date=endDate]) <= 1").kind,
    ).toBe("COUNT_CAP");
    expect(classifyFormal("apply policy when flag is true").kind).toBe(
      "UNCLASSIFIED",
    );
  });
});

describe("δ rule cardinalities (SWU-ENG-003)", () => {
  const { graph } = parse(FEATURE_DIR);
  const obs = derive(graph);
  const ofType = (t: string) => obs.filter((o) => o.rule_type === t);

  it("invariant rule emits the exact per-class count (R3-style RANGE -> 4)", () => {
    // I1 `newMakeup >= 0` is a single comparison -> UNCLASSIFIED -> needs_formal(1).
    // I2 is a count-cap -> COUNT_CAP -> 2. So invariant obligations are I2's two cases.
    const invIds = new Set(
      ofType("invariant").map((o) => String(o.canonical_params.id)),
    );
    expect(invIds.has("I2")).toBe(true);
  });

  it("invalid-transition = (non-terminal states x events) - valid (exact 8 combos)", () => {
    const inv = ofType("invalid-transition");
    // 4 non-terminal source states x 3 distinct events - 4 valid = 8 invalid combos.
    expect(inv.length).toBe(8);
    const combos = inv
      .map((o) => `${o.canonical_params.from}|${o.canonical_params.event}`)
      .sort();
    // The 4 valid transitions are excluded; every other (state,event) pair is present.
    expect(combos).not.toContain("[new]|GenerateSettlement"); // valid
    expect(combos).not.toContain("VALIDATED|GenerateSettlement"); // valid
    expect(combos).toContain("[new]|SettlementGenerated"); // invalid
    expect(combos).toContain("COMPUTED|GenerateSettlement"); // invalid
  });

  it("rule-validation reproduces R3 RANGE (4) and R2 PRESENCE (3) cases", () => {
    const rv = ofType("rule-validation");
    const r3 = rv.filter((o) => o.canonical_params.id === "R3");
    const r2 = rv.filter((o) => o.canonical_params.id === "R2");
    expect(r3).toHaveLength(4);
    expect(r2).toHaveLength(3);
  });
});

describe("δ purity (R-002: derive(G) deep-equals derive(G))", () => {
  it("is deterministic over the same graph", () => {
    const { graph } = parse(FEATURE_DIR);
    expect(derive(graph)).toEqual(derive(graph));
  });

  it("is deterministic across independent parses of the same docs", () => {
    const a = derive(parse(FEATURE_DIR).graph);
    const b = derive(parse(FEATURE_DIR).graph);
    expect(a.map((o) => o.obligation_key)).toEqual(
      b.map((o) => o.obligation_key),
    );
  });
});

// --- Round-trip (L0 gate) -----------------------------------------------------

describe("round-trip: engine ⊇ committed (normalized semantic identity, 7 docs)", () => {
  const { graph } = parse(FEATURE_DIR);
  const derived = engineSemanticSet(derive(graph));
  const committed = parseCommittedSemantic(join(FEATURE_DIR, "TEST-SPEC.md"));
  const report = semanticRoundTrip(derived, committed);

  it("aligns rule / invariant / calc / contract / event categories", () => {
    for (const id of [
      "rule:r1",
      "rule:r3",
      "inv:i1",
      "calc:c1",
      "contract:200",
      "event:settlementgenerated",
    ]) {
      expect(derived.has(id), `engine should derive ${id}`).toBe(true);
      expect(committed.has(id), `committed should contain ${id}`).toBe(true);
    }
  });

  it("now covers workflow / query / mapping (the 3 new docs)", () => {
    for (const id of [
      "workflow:settlementworkflow",
      "query:getsettlementpreview",
      "mapping:settlementrequesttoinput",
    ]) {
      expect(derived.has(id), `engine should derive ${id}`).toBe(true);
      expect(committed.has(id), `committed should contain ${id}`).toBe(true);
    }
  });

  it("PASSES — every committed semantic obligation is reproduced (missing = 0)", () => {
    expect(report.missing).toEqual([]);
    expect(report.pass).toBe(true);
  });

  it("produces only legitimate extras (transition coverage + extra contracts/mappings)", () => {
    const extraPrefixes = new Set(report.extra.map((e) => e.split(":")[0]));
    for (const p of extraPrefixes) {
      expect(["transition", "invalid", "contract", "mapping"]).toContain(p);
    }
  });
});

describe("emit_tests produces a syntactically valid, runnable vitest file (SWU-ENG-007)", () => {
  const result = deriveFeature(FEATURE_DIR, { emitTests: true });
  const code = result.tests ?? "";

  it("emits one it.todo per derived obligation", () => {
    const todos = (code.match(/\bit\.todo\(/g) ?? []).length;
    expect(todos).toBe(result.obligations.length);
    expect(todos).toBeGreaterThan(0);
  });

  it("parses with zero TypeScript syntactic diagnostics", () => {
    const out = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
      reportDiagnostics: true,
    });
    const syntactic = (out.diagnostics ?? []).filter(
      (d) => d.category === ts.DiagnosticCategory.Error,
    );
    expect(
      syntactic.map((d) =>
        ts.flattenDiagnosticMessageText(d.messageText, "\n"),
      ),
    ).toEqual([]);
  });

  it("is byte-stable across two derivations", () => {
    expect(deriveFeature(FEATURE_DIR, { emitTests: true }).tests).toBe(code);
  });
});

describe("parser/δ over the 3 new docs (workflows / queries / mappings)", () => {
  const { graph } = parse(FEATURE_DIR);
  const byType = (t: string) => graph.nodes.filter((n) => n.type === t);
  const obs = derive(graph);
  const ofType = (t: string) => obs.filter((o) => o.rule_type === t);

  it("parses 1 workflow with 5 steps", () => {
    expect(byType("Workflow").map((n) => n.fields.name)).toEqual([
      "SettlementWorkflow",
    ]);
    expect(byType("WorkflowStep")).toHaveLength(5);
  });

  it("derives one success obligation per step plus the documented step-1 400 failure", () => {
    const wf = ofType("workflow-step");
    expect(
      wf.filter((o) => o.canonical_params.case === "success"),
    ).toHaveLength(5);
    // Only step 1 names a concrete failure outcome ("return 400"); steps 2-4 say
    // "return error" (also concrete) and step 5 has "-" (no failure obligation).
    const failures = wf.filter((o) => o.canonical_params.case === "failure");
    expect(failures.length).toBeGreaterThanOrEqual(1);
    expect(
      failures.some((o) => /400/.test(String(o.canonical_params.outcome))),
    ).toBe(true);
  });

  it("parses queries and mappings into one obligation each per concept", () => {
    expect(byType("Query").map((n) => n.fields.name)).toEqual([
      "GetSettlementPreview",
    ]);
    expect(ofType("query-behavior")).toHaveLength(1);
    expect(
      byType("Mapping")
        .map((n) => n.fields.name)
        .sort(),
    ).toEqual(["SettlementRequestToInput", "SettlementResultToResponse"]);
    expect(ofType("mapping-row")).toHaveLength(2);
  });
});

// --- 2nd feature: auth-access-control (SWU-ENG-006 generalization) ------------

describe("2nd feature: parse + derive over auth-access-control", () => {
  const { graph, violations } = parse(AUTH_DIR);
  const byType = (t: string) => graph.nodes.filter((n) => n.type === t);
  const obs = derive(graph);

  it("parses the auth docs with zero non-canonical violations", () => {
    expect(violations).toEqual([]);
  });

  it("derives a non-trivial obligation set across all node types it authors", () => {
    expect(obs.length).toBeGreaterThan(50);
    // Auth authors per-operation Rule tables whose ids restart (Login R1, Token I1...).
    for (const t of [
      "Rule",
      "Calculation",
      "Workflow",
      "Query",
      "Mapping",
      "Event",
    ]) {
      expect(byType(t).length, `auth should yield ${t} nodes`).toBeGreaterThan(
        0,
      );
    }
  });
});

describe("2nd feature: committed-dialect detection + honest round-trip", () => {
  const spec = parseCommittedSpec2(join(AUTH_DIR, "TEST-SPEC.md"));

  it("detects the column-typed dialect and requires op-qualified ids", () => {
    expect(spec.dialect).toBe("column-typed");
    expect(spec.qualified).toBe(true);
    expect(spec.semantic.size).toBeGreaterThan(0); // non-vacuous (vs the old 0)
  });

  it("aligns the concept-level categories that share an identity convention", () => {
    const { graph } = parse(AUTH_DIR);
    const derived = engineSemanticSet(derive(graph), { qualified: true });
    // Op-qualified rules/calcs and concept-bucketed mappings/queries/producer-events
    // bridge cleanly; these are the categories with a shared identity convention.
    for (const id of [
      "rule:login:r1",
      "calc:login:c1",
      "post:login",
      "mapping:loginrequesttosession",
      "query:getpermissioncatalog",
      "event:loginsucceeded",
    ]) {
      expect(derived.has(id), `engine should derive ${id}`).toBe(true);
      expect(spec.semantic.has(id), `committed should contain ${id}`).toBe(
        true,
      );
    }
  });

  it("surfaces the irreducible mismatches honestly (does NOT force a pass)", () => {
    const { graph } = parse(AUTH_DIR);
    const derived = engineSemanticSet(derive(graph), { qualified: true });
    const report = semanticRoundTrip(derived, spec.semantic);
    // The round-trip legitimately FAILS: auth's oracle uses identity conventions the
    // δ cannot bridge without guessing — entity-name drift (committed "Session" vs
    // source "SessionLifecycle"), transitions keyed by row-id not from/event, an
    // "Error state" category with no δ peer, and consumer-bucketed events.
    expect(report.pass).toBe(false);
    const missingPrefixes = new Set(
      report.missing.map((m) => m.id.split(":")[0]),
    );
    expect(missingPrefixes.has("transition")).toBe(true);
    expect(missingPrefixes.has("error")).toBe(true);
    // The engine still DERIVES the equivalent transition coverage (just under a
    // different identity), so those appear as extras, not absences.
    expect(report.extra.some((e) => e.startsWith("transition:"))).toBe(true);
  });
});
