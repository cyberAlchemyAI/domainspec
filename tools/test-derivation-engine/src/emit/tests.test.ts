// P4 — tests for the hybrid emit_tests + Formal-AST.
import { describe, it, expect } from "vitest";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { parse } from "../grammar/index.js";
import { derive } from "../rules/index.js";
import { emitHybridTests } from "./tests.js";
import { loadBindings } from "../bindings/index.js";
import { parseFormal } from "../formal/ast.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEATURE_DIR = resolve(
  __dirname,
  "../../../../../../validation/poker-team/docs/features/financial-settlement",
);
const BINDINGS = resolve(__dirname, "../../bindings/financial-settlement.json");

describe("Formal-AST parser (P4)", () => {
  it("parses the deal-split ternary into branch literals + threshold", () => {
    const ast = parseFormal("playerShare = limit >= NL100 ? 0.5 : 0.4");
    expect(ast.kind).toBe("ternary");
    if (ast.kind !== "ternary") return;
    expect(ast.op).toBe(">=");
    expect(ast.threshold.value).toBe(100);
    expect(ast.thenLit.value).toBe(0.5);
    expect(ast.elseLit.value).toBe(0.4);
  });

  it("parses a chained comparison into a RANGE with both operators", () => {
    const ast = parseFormal("startDate <= stats.date <= endDate");
    expect(ast.kind).toBe("range");
    if (ast.kind !== "range") return;
    expect(ast.lowerOp).toBe("<=");
    expect(ast.upperOp).toBe("<=");
    expect(ast.variable).toBe("stats.date");
  });

  it("parses a count cap into the cap value", () => {
    const ast = parseFormal("count(tx[type=PAYOUT,date=endDate]) <= 1");
    expect(ast.kind).toBe("count-cap");
    if (ast.kind !== "count-cap") return;
    expect(ast.cap).toBe(1);
    expect(ast.op).toBe("<=");
  });

  it("returns unparsed for prose / bare-call formulae (no guessing)", () => {
    expect(parseFormal("apply policy when flag is true").kind).toBe("unparsed");
    // An opaque bare call is NOT closed-form-derivable (stays needs_formal).
    expect(parseFormal("applyMakeupPolicy(a, b, c, d)").kind).toBe("unparsed");
    // An implication is NOT a RANGE (has a connective).
    expect(parseFormal("a > 0 and not exists tx").kind).toBe("unparsed");
  });

  it("L1: a closed-form aggregate IS now parsed (sum fold), not unparsed", () => {
    const ast = parseFormal("sum(relevantRecords.profit)");
    expect(ast.kind).toBe("fold");
  });
});

describe("hybrid emit_tests over financial-settlement (P4)", () => {
  const { graph } = parse(FEATURE_DIR);
  const obligations = derive(graph);
  const bindings = loadBindings(BINDINGS);
  const { file, report } = emitHybridTests(obligations, bindings, graph);

  it("emits a real assertion per AST-evaluable obligation + 1 property, rest skipped", () => {
    // C3 ternary (2) + R3 RANGE (4) + R4/R5 COUNT_CAP (4) = 10 ast-eval assertions,
    // PLUS L1 closed-form: C1 sum (1) + C4 piecewise makeup (1) = 12 assertions.
    expect(report.assertions).toBe(12);
    expect(report.properties).toBe(1); // I1 non-negativity property (a FLOOR)
    // L0 honesty: the I1 property is bound to a `needs-formal` obligation, so it
    // CO-EMITS a counted value-gap — the property does NOT zero the gap. The 10
    // assertions each fully satisfy their obligation; the property does not, so
    // assertions + coverageGaps == total (the property is an extra floor body).
    expect(report.coverageGaps).toBe(report.total - report.assertions);
    expect(report.assertions + report.coverageGaps).toBe(report.total);
  });

  it("maps 1:1 to obligation_keys, plus one co-emitted floor for the property", () => {
    // One case per obligation, PLUS one extra it.skip co-emitted alongside the
    // I1 property (the honest value-gap that the property may not silently close).
    const cases = (file.match(/\bit(\.skip)?\(/g) ?? []).length;
    expect(cases).toBe(report.total + report.properties);
    for (const o of obligations) {
      expect(file).toContain(o.obligation_key);
    }
  });

  it("derives expected values from the Formal AST, not from the impl", () => {
    // The ternary literals (0.5 / 0.4) and the boundary lengths come from the spec.
    expect(file).toContain('getDealSplit("NL100").player).toBe(0.5)');
    expect(file).toContain('getDealSplit("NL10").player).toBe(0.4)');
    expect(file).toContain(".toHaveLength(1)");
    expect(file).toContain(".toHaveLength(0)");
    expect(file).toContain("shouldCreateMakeupAppliedEvent).toBe(true)");
    expect(file).toContain("shouldCreatePayoutEvent).toBe(false)");
    // No characterization snapshot / toEqual against a recorded run.
    expect(file).not.toContain("toMatchSnapshot");
  });

  it("annotates every skip with a coverage_gap reason (honest holes)", () => {
    const skips = (file.match(/it\.skip\(/g) ?? []).length;
    const reasons = (file.match(/\/\/ coverage_gap:/g) ?? []).length;
    expect(skips).toBe(report.coverageGaps);
    expect(reasons).toBe(report.coverageGaps);
  });

  it("L1: closed-form C1 sum + C4 makeup derive REAL value assertions from the spec", () => {
    // C1 `sum(relevantRecords.profit)` over the fixture (120+80) -> 200.
    expect(file).toContain("totalProfit).toBe(200)");
    // C4 `max(0, previousDebt - totalProfit - totalRakeback)` (300-200-40) -> 60.
    expect(file).toContain("newMakeup).toBe(60)");
    // Expected comes from the Formal AST over the fixture, not a recorded run.
    expect(file).not.toContain("toMatchSnapshot");
  });

  it("L1 provenance guard (SWU-COB-005): closed form derives, bare call stays needs_formal", () => {
    // A CLOSED-FORM Calculation (C1 sum / C4 piecewise) becomes a derivable
    // `calculation` obligation; an OPAQUE bare call stays `needs-formal` and is
    // NOT promotable until a formula is authored. Verified at the derive level.
    const calcIds = obligations
      .filter((o) => o.rule_type === "calculation")
      .map((o) => String(o.canonical_params.id));
    expect(calcIds).toContain("C1"); // closed-form fold -> calculation
    expect(calcIds).toContain("C4"); // authored piecewise -> calculation
    // A synthetic bare-call Calculation must stay needs_formal (parser is arbiter).
    const bareGraph = {
      nodes: [
        {
          id: "ops#calc:CX",
          type: "Calculation" as const,
          source_anchor: "ops#calc:CX",
          fields: { id: "CX", formula: "applyMakeupPolicy(a, b, c, d)" },
        },
      ],
      edges: [],
    };
    const bareObs = derive(bareGraph);
    expect(bareObs.map((o) => o.rule_type)).toContain("needs-formal");
    expect(bareObs.map((o) => o.rule_type)).not.toContain("calculation");
  });

  it("L0 honesty: the I1 property CO-EMITS a counted value-gap (never zeroes it)", () => {
    // The I1 obligation is `needs-formal` (its Formal `newMakeup >= 0` is a
    // stand-in for an unauthored exact value). Find that obligation's key.
    const i1 = obligations.find(
      (o) =>
        o.rule_type === "needs-formal" &&
        String(o.canonical_params.id) === "I1",
    );
    expect(i1, "I1 needs-formal obligation must exist").toBeDefined();
    const key = i1!.obligation_key;
    // BOTH a property body (real `it(`) AND a co-emitted `it.skip` value-gap exist
    // for the SAME obligation_key — the property does not silently replace the gap.
    expect(file).toContain("[property] — seeded generator");
    expect(file).toContain("coverage_gap: needs-formal-value");
    // The obligation key appears for both the property and the co-emitted skip.
    const occurrences = file.split(key).length - 1;
    expect(occurrences).toBe(2);
    // And the gap is COUNTED: coverageGaps includes the I1 value-gap (no zeroing).
    expect(report.coverageGaps).toBe(report.total - report.assertions);
  });

  it("transpiles with zero TypeScript diagnostics (TS compiler API)", () => {
    const out = ts.transpileModule(file, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
      reportDiagnostics: true,
    });
    const errors = (out.diagnostics ?? []).filter(
      (d) => d.category === ts.DiagnosticCategory.Error,
    );
    expect(
      errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")),
    ).toEqual([]);
  });

  it("is byte-stable across two emissions (pure/deterministic)", () => {
    const again = emitHybridTests(
      derive(parse(FEATURE_DIR).graph),
      bindings,
      graph,
    );
    expect(again.file).toBe(file);
  });

  it("imports the real domain modules from the binding sidecar", () => {
    expect(file).toContain('from "../deal/deal.service"');
    expect(file).toContain('from "../settlement/settlement.service"');
    expect(file).toContain('from "../makeup/makeup-policy.service"');
  });
});

// The emitted suite must also be a real test file that vitest can pick up. We
// transpile-check it above (no impl resolution needed). A separate end-to-end run
// against the poker-team backend is out of this package's scope.
void join;
