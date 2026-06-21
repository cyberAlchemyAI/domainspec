// SWU-COB-002/003 — closed-form parser + exact-rational evaluator tests.
import { describe, it, expect } from "vitest";
import { parseArith, parseFormal } from "./ast.js";
import {
  evalArith,
  evalRational,
  decimalToRational,
  rationalToDecimalString,
} from "./eval.js";
import type { EvalEnv } from "./eval.js";

describe("closed-form parser (SWU-COB-002)", () => {
  it("parses a sum fold over a collection field", () => {
    const ast = parseFormal("sum(relevantRecords.profit)");
    expect(ast.kind).toBe("fold");
    if (ast.kind !== "fold") return;
    expect(ast.reducer).toBe("sum");
    expect(ast.collection).toBe("relevantRecords");
    expect(ast.field).toBe("profit");
  });

  it("parses count over a collection (no field)", () => {
    const ast = parseArith("count(records)");
    expect(ast?.kind).toBe("fold");
    if (ast?.kind !== "fold") return;
    expect(ast.reducer).toBe("count");
    expect(ast.field).toBe("");
  });

  it("parses a piecewise-style max-floored arithmetic closed form", () => {
    const ast = parseFormal(
      "newMakeup = max(0, previousDebt - totalProfit - totalRakeback)",
    );
    expect(ast.kind).toBe("arith");
    if (ast.kind !== "arith") return;
    expect(ast.op).toBe("max");
  });

  it("respects * / precedence over + -", () => {
    const ast = parseArith("a + b * c");
    expect(ast?.kind).toBe("arith");
    if (ast?.kind !== "arith") return;
    expect(ast.op).toBe("+"); // + is the root (lower precedence)
    expect(ast.right.kind).toBe("arith"); // b * c is the right subtree
  });

  it("rejects a bare opaque call (NOT a recognized fold) -> unparsed", () => {
    // applyMakeupPolicy(...) is opaque: not a fold/min/max -> trailing junk.
    expect(parseArith("applyMakeupPolicy(previousDebt, C1, C2, share)")).toBe(
      null,
    );
    expect(
      parseFormal("applyMakeupPolicy(previousDebt, C1, C2, share)").kind,
    ).toBe("unparsed");
  });
});

describe("exact-rational evaluator (SWU-COB-003)", () => {
  const env = (
    vars: Record<string, number>,
    collections: Record<string, { [k: string]: number }[]> = {},
  ): EvalEnv => ({ vars, collections });

  it("sums a profit collection exactly", () => {
    const ast = parseArith("sum(records.profit)")!;
    const e = env(
      {},
      { records: [{ profit: 10 }, { profit: 5 }, { profit: 2 }] },
    );
    expect(evalArith(ast, e)).toBe("17");
  });

  it("derives the max-floored makeup closed form (positive branch)", () => {
    const ast = parseArith(
      "max(0, previousDebt - totalProfit - totalRakeback)",
    )!;
    expect(
      evalArith(
        ast,
        env({ previousDebt: 100, totalProfit: 30, totalRakeback: 20 }),
      ),
    ).toBe("50");
  });

  it("floors the makeup at 0 (debt cannot go negative — I1)", () => {
    const ast = parseArith(
      "max(0, previousDebt - totalProfit - totalRakeback)",
    )!;
    expect(
      evalArith(
        ast,
        env({ previousDebt: 10, totalProfit: 30, totalRakeback: 20 }),
      ),
    ).toBe("0");
  });

  it("FLOAT-DRIFT GUARD: 0.1 + 0.2 == 0.3 exactly (no IEEE-754 drift)", () => {
    // Native float: 0.1 + 0.2 === 0.30000000000000004. The rational evaluator
    // must yield exactly "0.3" — proving no float accumulation in the path.
    const ast = parseArith("a + b")!;
    expect(evalArith(ast, env({ a: 0.1, b: 0.2 }))).toBe("0.3");
    // And a fold of the same drifting terms also stays exact.
    const fold = parseArith("sum(r.x)")!;
    expect(evalArith(fold, env({}, { r: [{ x: 0.1 }, { x: 0.2 }] }))).toBe(
      "0.3",
    );
  });

  it("DETERMINISM: two evaluations of the same (expr, env) are identical", () => {
    const ast = parseArith("max(0, d - p * share)")!;
    const e = env({ d: 100, p: 60, share: 0.5 });
    const first = evalArith(ast, e);
    const second = evalArith(ast, e);
    expect(first).toBe(second);
    expect(first).toBe("70");
  });

  it("TOTALITY: div-by-zero -> null (not derivable -> coverage_gap)", () => {
    expect(evalArith(parseArith("a / b")!, env({ a: 1, b: 0 }))).toBe(null);
  });

  it("TOTALITY: empty min/max fold -> null; empty sum -> 0", () => {
    expect(evalArith(parseArith("min(r.x)")!, env({}, { r: [] }))).toBe(null);
    expect(evalArith(parseArith("sum(r.x)")!, env({}, { r: [] }))).toBe("0");
  });

  it("TOTALITY: unresolved variable / collection -> null", () => {
    expect(evalArith(parseArith("a + b")!, env({ a: 1 }))).toBe(null);
    expect(evalArith(parseArith("sum(missing.x)")!, env({}))).toBe(null);
  });

  it("TOTALITY: unbounded fold beyond cap -> null", () => {
    const ast = parseArith("sum(r.x)")!;
    const big = Array.from({ length: 11 }, () => ({ x: 1 }));
    expect(
      evalArith(ast, { vars: {}, collections: { r: big }, maxFoldLen: 10 }),
    ).toBe(null);
  });

  it("non-terminating decimal (1/3) -> null string (not closed-form-emittable)", () => {
    const r = evalRational(parseArith("a / b")!, env({ a: 1, b: 3 }));
    expect(r).not.toBe(null);
    expect(rationalToDecimalString(r!)).toBe(null);
  });

  it("decimalToRational parses exact fractions without float", () => {
    expect(decimalToRational("0.1")).toEqual({ num: 1n, den: 10n });
    expect(decimalToRational("-2.50")).toEqual({ num: -5n, den: 2n });
  });
});
