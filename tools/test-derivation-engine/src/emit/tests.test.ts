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
    expect(parseFormal("sum(relevantRecords.profit)").kind).toBe("unparsed");
    expect(parseFormal("apply policy when flag is true").kind).toBe("unparsed");
    // An implication is NOT a RANGE (has a connective).
    expect(parseFormal("a > 0 and not exists tx").kind).toBe("unparsed");
  });
});

describe("hybrid emit_tests over financial-settlement (P4)", () => {
  const { graph } = parse(FEATURE_DIR);
  const obligations = derive(graph);
  const bindings = loadBindings(BINDINGS);
  const { file, report } = emitHybridTests(obligations, bindings, graph);

  it("emits a real assertion per AST-evaluable obligation + 1 property, rest skipped", () => {
    // C3 ternary (2) + R3 RANGE (4) + R4/R5 COUNT_CAP (4) = 10 assertions.
    expect(report.assertions).toBe(10);
    expect(report.properties).toBe(1); // I1 non-negativity property
    expect(report.coverageGaps).toBe(report.total - 11);
    expect(report.assertions + report.properties + report.coverageGaps).toBe(
      report.total,
    );
  });

  it("maps 1:1 to obligation_keys (one case per obligation)", () => {
    const cases = (file.match(/\bit(\.skip)?\(/g) ?? []).length;
    expect(cases).toBe(report.total);
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
