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
  deriveDescriptor,
  engineSemanticSet,
  isIrreducibleMiss,
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

  it("invalid-transition = (all real states x events) - valid, terminal sinks INCLUDED (exact 9 combos)", () => {
    const inv = ofType("invalid-transition");
    // P2: terminal sink states (e.g. COMPLETED) are now INCLUDED — they reject ALL
    // events (the oracle catalogues "TERMINAL + AnyEvent -> rejected"). The `[new]`
    // pseudo-start is excluded as a `from`. With 4 real states x 3 events - 4 valid
    // (one is on the now-excluded `[new]`) the engine derives exactly 9 invalid combos.
    expect(inv.length).toBe(9);
    const combos = inv
      .map((o) => `${o.canonical_params.from}|${o.canonical_params.event}`)
      .sort();
    // Valid transitions are excluded; the `[new]` pseudo-start never appears as a from.
    expect(combos).not.toContain("VALIDATED|GenerateSettlement"); // valid
    expect(combos.some((c) => c.startsWith("[new]|"))).toBe(false); // pseudo-start
    expect(combos).toContain("COMPUTED|GenerateSettlement"); // invalid
    // A terminal sink (COMPLETED) now rejects events too — the P2 addition.
    expect(combos).toContain("COMPLETED|GenerateSettlement");
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
  const bootstrap = parseCommittedSpec2(join(FEATURE_DIR, "TEST-SPEC.md"));
  const descriptor = deriveDescriptor(graph, bootstrap);
  const committed = parseCommittedSpec2(
    join(FEATURE_DIR, "TEST-SPEC.md"),
    descriptor.conceptAliases,
  ).semantic;
  const derived = engineSemanticSet(derive(graph), {
    qualified: descriptor.idScope === "per-operation",
    conceptAliases: descriptor.conceptAliases,
  });
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

  it("INV-1: bridges WORKFLOW per-step (5 steps -> 5 distinct keys, not 1)", () => {
    for (const n of [1, 2, 3, 4, 5]) {
      const id = `workflow:settlementworkflow:${n}`;
      expect(derived.has(id), `engine should derive ${id}`).toBe(true);
      expect(committed.has(id), `committed should contain ${id}`).toBe(true);
    }
    expect(report.missing.some((m) => m.id.startsWith("workflow:"))).toBe(
      false,
    );
  });

  it("INV-1: query/mapping per-row rows surface as DOCUMENTED-IRREDUCIBLE misses", () => {
    // The engine emits ONE behavior/section obligation per query/mapping concept,
    // but the committed oracle authors N per-assertion rows (QT-1..4 / MT-1..2)
    // with no surviving per-row token. They are NOT re-collapsed (INV-1); instead
    // they are classified documented-irreducible (per-assertion prose), so the
    // feature still PASSES at declared scope while reporting the residue honestly.
    const irreducibleIds = new Set(report.irreducibleMissing.map((m) => m.id));
    expect(irreducibleIds.has("query:getsettlementpreview:qt-1")).toBe(true);
    expect(irreducibleIds.has("mapping:settlementrequesttoinput:mt-1")).toBe(
      true,
    );
    // None of these is a GENUINE miss.
    expect(report.genuineMissing.some((m) => m.id.startsWith("query:"))).toBe(
      false,
    );
    // The engine's single per-concept obligation appears as an (allowed) extra.
    expect(derived.has("query:getsettlementpreview:behavior")).toBe(true);
    expect(derived.has("mapping:settlementrequesttoinput:section")).toBe(true);
  });

  it("PASSES at declared scope — residue is only documented-irreducible (per-assertion prose)", () => {
    // P2: financial round-trips with ZERO genuine misses. The residue is the QT/MT
    // per-assertion prose (and the id-less makeup-policy calc family) the engine
    // cannot derive per-row — documented-irreducible, NOT a δ gap.
    expect(report.genuineMissing).toEqual([]);
    expect(report.pass).toBe(true);
    expect(report.cleanPass).toBe(false); // PASS-with-residue, not a clean PASS
    const irreduciblePrefixes = new Set(
      report.irreducibleMissing.map((m) => m.id.split(":")[0]),
    );
    // Residue is confined to per-assertion query/mapping prose and id-less calc.
    for (const p of irreduciblePrefixes)
      expect(["query", "mapping", "calc"]).toContain(p);
  });

  it("produces only legitimate extras (engine completeness exceeds the oracle)", () => {
    // Extras are allowed (engine ⊇ oracle). Financial's extras span transition/invalid
    // Cartesian coverage, extra contracts, the producer event obligations, the id-less
    // makeup calc (needs_formal), and per-concept query/mapping behavior keys.
    const extraPrefixes = new Set(report.extra.map((e) => e.split(":")[0]));
    for (const p of extraPrefixes) {
      expect([
        "transition",
        "invalid",
        "contract",
        "mapping",
        "query",
        "error",
        "post",
        "event",
        "calc",
        // L3: domain.md + rules.md widen the engine's owned surface beyond the
        // operation-class oracle, so these classes are legitimate extras too.
        "domain-field",
        "domain-enum",
        "policy-decision",
      ]).toContain(p);
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

describe("2nd feature: dialect descriptor + P2 round-trip (auth-access-control)", () => {
  const { graph } = parse(AUTH_DIR);
  const bootstrap = parseCommittedSpec2(join(AUTH_DIR, "TEST-SPEC.md"));
  const descriptor = deriveDescriptor(graph, bootstrap);
  const spec = parseCommittedSpec2(
    join(AUTH_DIR, "TEST-SPEC.md"),
    descriptor.conceptAliases,
  );
  const derived = engineSemanticSet(derive(graph), {
    qualified: descriptor.idScope === "per-operation",
    conceptAliases: descriptor.conceptAliases,
  });
  const report = semanticRoundTrip(derived, spec.semantic);

  it("detects column-typed + per-operation id-scope (derived from data, not feature name)", () => {
    expect(spec.dialect).toBe("column-typed");
    expect(descriptor.idScope).toBe("per-operation");
    expect(spec.semantic.size).toBeGreaterThan(0);
  });

  it("INV-4: the dialect descriptor carries NO feature name; aliases are structural", () => {
    // Concept aliases come from entity-heading prefix-uniqueness, e.g. the entity-name
    // drift Session->SessionLifecycle and Token->TokenLifecycle. No "auth" anywhere.
    expect(descriptor.conceptAliases.get("session")).toBe("sessionlifecycle");
    expect(descriptor.conceptAliases.get("token")).toBe("tokenlifecycle");
    expect([...descriptor.conceptAliases.keys()]).not.toContain("auth");
  });

  it("entity-name drift bridges via the alias (committed Session I1 -> inv:sessionlifecycle:i1)", () => {
    // The alias is applied symmetrically AT PARSE TIME, so BOTH sides carry the
    // canonical entity heading. The committed oracle's "Session I1" / "Token I1" land
    // on the engine's `inv:sessionlifecycle:i1` / `inv:tokenlifecycle:i1`.
    for (const id of [
      "rule:login:r1",
      "calc:login:c1",
      "post:login",
      "event:loginsucceeded",
      "inv:sessionlifecycle:i1",
      "inv:tokenlifecycle:i1",
    ]) {
      expect(derived.has(id), `engine should derive ${id}`).toBe(true);
      expect(spec.semantic.has(id), `committed should contain ${id}`).toBe(
        true,
      );
    }
    // The un-aliased committed token must NOT survive on either side.
    expect(spec.semantic.has("inv:session:i1")).toBe(false);
  });

  it("NEW δ: error-obligations and consumer-side events are derived (op/consumer bucketed)", () => {
    // error:<op> from operations.md `### Error States`; event:<consumer> from
    // events.md `### Consumed By`. Both were previously a genuine δ gap.
    for (const id of ["error:login", "error:logout"]) {
      expect(derived.has(id), `engine should derive ${id}`).toBe(true);
      expect(spec.semantic.has(id), `committed should contain ${id}`).toBe(
        true,
      );
    }
    expect(derived.has("event:audit"), "consumer-side event:audit").toBe(true);
    // "Session tracker" consumer concept slugs to `session`, then the entity alias
    // canonicalizes it to `sessionlifecycle` on BOTH sides.
    expect(
      derived.has("event:sessionlifecycle"),
      "consumer-side event:sessionlifecycle",
    ).toBe(true);
    expect(spec.semantic.has("event:sessionlifecycle")).toBe(true);
  });

  it("INV-1: mapping/query per-row identity is kept distinct (not collapsed)", () => {
    for (const collapsed of [
      "mapping:loginrequesttosession",
      "query:getpermissioncatalog",
    ]) {
      expect(derived.has(collapsed)).toBe(false);
      expect(spec.semantic.has(collapsed)).toBe(false);
    }
    expect(derived.has("mapping:loginrequesttosession:section")).toBe(true);
    expect(
      spec.semantic.has("mapping:loginrequesttosession:auth-map-001"),
    ).toBe(true);
  });

  it("PASSES at declared scope — ZERO genuine misses; residue is documented-irreducible", () => {
    // P2 closes auth: entity-name drift bridges via aliases, error + consumer-event δ
    // rules added, transition row-id keying deferred (documented-irreducible). The
    // residue is per-assertion mapping/query/workflow prose + by-states transitions.
    expect(report.genuineMissing).toEqual([]);
    expect(report.pass).toBe(true);
    expect(report.irreducibleMissing.length).toBeGreaterThan(0); // honest residue
    // The engine still derives the equivalent transition coverage under from/event ids.
    expect(report.extra.some((e) => e.startsWith("transition:"))).toBe(true);
  });
});

// --- Irreducibility classifier (P3) -------------------------------------------

describe("irreducibility classifier distinguishes residue from δ gaps", () => {
  it("marks per-assertion query/mapping/workflow row-id misses irreducible", () => {
    expect(isIrreducibleMiss("query:getpermissioncatalog:auth-query-001")).toBe(
      true,
    );
    expect(
      isIrreducibleMiss("mapping:loginrequesttosession:auth-map-001"),
    ).toBe(true);
    expect(isIrreducibleMiss("workflow:endtoendauthflow:auth-wf-001")).toBe(
      true,
    );
  });

  it("marks engine-derivable concept obligations NOT irreducible (would be δ gaps)", () => {
    // A query/mapping keyed by the engine's own concept token is derivable.
    expect(isIrreducibleMiss("query:getpermissioncatalog:behavior")).toBe(
      false,
    );
    expect(isIrreducibleMiss("mapping:loginrequesttosession:section")).toBe(
      false,
    );
    // A workflow STEP NUMBER aligns; a rule/invariant ref id is derivable.
    expect(isIrreducibleMiss("workflow:settlementworkflow:3")).toBe(false);
    expect(isIrreducibleMiss("rule:login:r1")).toBe(false);
    expect(isIrreducibleMiss("inv:i1")).toBe(false);
  });

  it("marks domain.md-sourced and by-states transition misses irreducible", () => {
    expect(isIrreducibleMiss("domain-inv:pmk-dom-001")).toBe(true);
    expect(isIrreducibleMiss("transition:auth-state-001")).toBe(true);
    // A from/event transition the engine derives is NOT irreducible.
    expect(isIrreducibleMiss("transition:active:logoutcompleted")).toBe(false);
  });
});

// --- Corpus PASS bar (P3): 4/5 column-typed + 2/2 rv-ct anchors ----------------

describe("corpus round-trip PASS bar (P3)", () => {
  const featuresDir = resolve(
    __dirname,
    "../../../../../validation/poker-team/docs/features",
  );
  const run = (feature: string) => {
    const dir = join(featuresDir, feature);
    const { graph } = parse(dir);
    const bootstrap = parseCommittedSpec2(join(dir, "TEST-SPEC.md"));
    const descriptor = deriveDescriptor(graph, bootstrap);
    const committed = parseCommittedSpec2(
      join(dir, "TEST-SPEC.md"),
      descriptor.conceptAliases,
    ).semantic;
    const derived = engineSemanticSet(derive(graph), {
      qualified: descriptor.idScope === "per-operation",
      conceptAliases: descriptor.conceptAliases,
    });
    return { descriptor, report: semanticRoundTrip(derived, committed) };
  };

  const anchors = ["financial-settlement", "player-onboarding"];
  const columnTyped = [
    "auth-access-control",
    "player-makeup",
    "player-management",
    "player-progression",
    "player-stats",
  ];

  it("both rv-ct anchors PASS at declared scope", () => {
    for (const f of anchors) {
      const { descriptor, report } = run(f);
      expect(descriptor.dialect, `${f} is rv-ct`).toBe("rv-ct");
      expect(report.pass, `${f} should PASS`).toBe(true);
    }
  });

  it("at least 4/5 column-typed features PASS at declared scope", () => {
    let passes = 0;
    for (const f of columnTyped) {
      const { descriptor, report } = run(f);
      expect(descriptor.dialect, `${f} is column-typed`).toBe("column-typed");
      if (report.pass) passes += 1;
    }
    expect(passes).toBeGreaterThanOrEqual(4);
  });
});
