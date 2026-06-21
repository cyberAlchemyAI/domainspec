// P4 — Formal-AST: parse a `Formal`/`Formula` cell into a small expression AST for
// the deterministically-evaluable obligation classes. This is the structure the
// regex `classifyFormal` (rules/index.ts) throws away: it keeps the comparison
// operators, the bound/threshold tokens, and the ternary branch literals so the
// emitter can place boundary cases and read EXPECTED values FROM THE SPEC — never
// by running the impl. Pure, total, deterministic: same string -> same AST.
//
// Scope (intentionally tiny — only what emit_tests can turn into a real assertion):
//   - TERNARY    `playerShare = limit >= NL100 ? 0.5 : 0.4`  (deal split)
//   - RANGE      `startDate <= stats.date <= endDate`        (chained comparison)
//   - COUNT_CAP  `count(tx[...]) <= 1`                        (cap value)
// Anything outside this grammar returns `{ kind: "unparsed" }` — the caller then
// falls back to coverage_gap. We never guess.

/** A numeric or limit-style literal extracted verbatim from the Formal cell. */
export type FormalLiteral =
  | { readonly type: "number"; readonly value: number; readonly raw: string }
  | { readonly type: "limit"; readonly value: number; readonly raw: string };

/** `cond ? thenLit : elseLit` — the deal-split shape. */
export interface TernaryAst {
  readonly kind: "ternary";
  /** Comparison operator in the condition (e.g. ">="). */
  readonly op: ComparisonOp;
  /** RHS threshold of the condition (e.g. NL100 -> 100). */
  readonly threshold: FormalLiteral;
  readonly thenLit: FormalLiteral;
  readonly elseLit: FormalLiteral;
}

/** `lo <op1> var <op2> hi` — an inclusive/exclusive chained comparison. */
export interface RangeAst {
  readonly kind: "range";
  readonly lowerOp: ComparisonOp; // lo <op1> var  (e.g. "<=")
  readonly upperOp: ComparisonOp; // var <op2> hi  (e.g. "<=")
  readonly lowerVar: string; // textual lower bound token (e.g. "startDate")
  readonly upperVar: string; // textual upper bound token (e.g. "endDate")
  readonly variable: string; // the middle term (e.g. "stats.date")
}

/** `count(...) <= k` — the dedup cap. */
export interface CountCapAst {
  readonly kind: "count-cap";
  readonly op: ComparisonOp;
  readonly cap: number;
}

export type FormalAst =
  | TernaryAst
  | RangeAst
  | CountCapAst
  | { readonly kind: "unparsed"; readonly raw: string };

export type ComparisonOp = "<" | "<=" | ">" | ">=" | "==" | "!=";

const COMPARISON_OPS: readonly ComparisonOp[] = [
  "<=",
  ">=",
  "==",
  "!=",
  "<",
  ">",
];

/** Parse a bare literal: a JS number, or an `NL<n>` limit token. Pure. */
export function parseLiteral(token: string): FormalLiteral | null {
  const t = token.trim();
  const nlMatch = t.match(/^NL(\d+)$/i);
  if (nlMatch) {
    return { type: "limit", value: Number(nlMatch[1]), raw: t };
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    return { type: "number", value: Number(t), raw: t };
  }
  return null;
}

function findOp(s: string): ComparisonOp | null {
  for (const op of COMPARISON_OPS) {
    if (s.trim() === op) return op;
  }
  return null;
}

/**
 * Parse a Formal/Formula cell into the small evaluable AST. Returns `unparsed`
 * for anything outside the tiny grammar (the caller falls back to coverage_gap).
 */
export function parseFormal(formal: string): FormalAst {
  const f = formal.trim();
  if (f === "") return { kind: "unparsed", raw: formal };

  // --- TERNARY: `<lhs> = <cond> ? <then> : <else>` --------------------------
  // The condition is a single comparison `<x> <op> <threshold>`.
  const ternary = f.match(/\?([^?:]+):([^?:]+)$/);
  if (ternary && f.includes("?")) {
    const condExpr = f.slice(0, f.indexOf("?"));
    const thenLit = parseLiteral(ternary[1] ?? "");
    const elseLit = parseLiteral(ternary[2] ?? "");
    // The condition is a single comparison `<lhs> <op> <threshold>` (any `lhs =`
    // assignment prefix like "playerShare = " is harmless — we read the LAST
    // comparison operator and its RHS threshold).
    const cm = condExpr.match(/([<>]=|==|!=|[<>])(?!.*([<>]=|==|!=|[<>]))/);
    if (thenLit && elseLit && cm) {
      const op = cm[1] as ComparisonOp;
      // RHS of the comparison is the threshold.
      const rhs = condExpr.slice((cm.index ?? 0) + op.length).trim();
      const threshold = parseLiteral(rhs);
      if (threshold) {
        return { kind: "ternary", op, threshold, thenLit, elseLit };
      }
    }
  }

  // --- COUNT_CAP: `count(...) <op> <k>` -------------------------------------
  const cap = f.match(/count\s*\(.*\)\s*(<=|<|>=|>|==)\s*(\d+)/i);
  if (cap) {
    const op = cap[1] as ComparisonOp;
    return { kind: "count-cap", op, cap: Number(cap[2]) };
  }

  // --- RANGE: `lo <op1> var <op2> hi` (two comparison ops, no connectives) ---
  const hasConnective = /->|=>|\band\b|\bor\b/i.test(f);
  if (!hasConnective) {
    // Split on the two comparison operators while keeping the operator tokens.
    const m = f.match(/^(.+?)\s*(<=|<|>=|>)\s*(.+?)\s*(<=|<|>=|>)\s*(.+)$/);
    if (m) {
      const lowerOp = findOp(m[2] ?? "");
      const upperOp = findOp(m[4] ?? "");
      if (lowerOp && upperOp) {
        return {
          kind: "range",
          lowerOp,
          upperOp,
          lowerVar: (m[1] ?? "").trim(),
          variable: (m[3] ?? "").trim(),
          upperVar: (m[5] ?? "").trim(),
        };
      }
    }
  }

  return { kind: "unparsed", raw: formal };
}
