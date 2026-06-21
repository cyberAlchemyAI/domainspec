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

// --- Closed-form sub-grammar (SWU-COB-002) ------------------------------------
//
// `ArithExpr` is a tiny pure arithmetic expression tree the evaluator can fold to
// an EXACT value (rational/integer — see eval.ts) given a binding fixture env.
// Leaves: numeric literals and variable references (resolved against the env).
// Folds: associative reducers over a collection field (sum/product/min/max/count).
// Piecewise: guarded arithmetic branches (e.g. `max(0, debt - profit - rakeback)`
// expressed as a guard ladder). The emitter evaluates the SPEC expression for the
// EXPECTED value — never by running the impl (same contract as the ternary).

export type ArithOp = "+" | "-" | "*" | "/" | "min" | "max";

/** An associative reducer over a collection field, e.g. `sum(records.profit)`. */
export type FoldReducer = "sum" | "product" | "min" | "max" | "count";

export interface FoldAst {
  readonly kind: "fold";
  readonly reducer: FoldReducer;
  /** The collection token (e.g. "relevantRecords" / "records"). */
  readonly collection: string;
  /** The reduced field (e.g. "profit"); empty for `count`. */
  readonly field: string;
}

/** A numeric literal leaf. */
export interface NumLeaf {
  readonly kind: "num";
  readonly value: number;
}

/** A variable reference leaf (resolved against the fixture env at eval time). */
export interface VarLeaf {
  readonly kind: "var";
  readonly name: string;
}

/** A binary/dyadic arithmetic application (`+ - * / min max`). */
export interface ArithBinAst {
  readonly kind: "arith";
  readonly op: ArithOp;
  readonly left: ArithExpr;
  readonly right: ArithExpr;
}

/** An arithmetic expression: leaf, fold, or dyadic application. */
export type ArithExpr = NumLeaf | VarLeaf | FoldAst | ArithBinAst;

/** One guarded branch of a piecewise form: `when <cond> then <expr>`. */
export interface PiecewiseGuard {
  /** Comparison guard over a variable: `<var> <op> <rhs literal>`. null = else. */
  readonly cond: {
    readonly variable: string;
    readonly op: ComparisonOp;
    readonly rhs: number;
  } | null;
  readonly expr: ArithExpr;
}

/** A piecewise (guarded-arithmetic) closed form: first matching guard wins. */
export interface PiecewiseAst {
  readonly kind: "piecewise";
  readonly guards: readonly PiecewiseGuard[];
}

export type FormalAst =
  | TernaryAst
  | RangeAst
  | CountCapAst
  | FoldAst
  | PiecewiseAst
  | ArithBinAst
  | NumLeaf
  | VarLeaf
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

// --- Closed-form arithmetic parser (SWU-COB-002) ------------------------------
//
// Recursive-descent over the ArithExpr grammar. Pure, total, deterministic; it
// returns null for anything outside the grammar (the caller falls back to
// `unparsed` -> coverage_gap). It NEVER guesses. Grammar (lowest-binding first):
//
//   expr   := term (('+' | '-') term)*
//   term   := factor (('*' | '/') factor)*
//   factor := number | fold | call | var | '(' expr ')'
//   call   := ('min' | 'max') '(' expr ',' expr ')'
//   fold   := ('sum' | 'product' | 'min' | 'max') '(' <coll> '.' <field> ')'
//           | 'count' '(' <coll> ')'

const FOLD_REDUCERS: readonly FoldReducer[] = [
  "sum",
  "product",
  "min",
  "max",
  "count",
];

interface Cursor {
  readonly s: string;
  pos: number;
}

function skipWs(c: Cursor): void {
  while (c.pos < c.s.length && /\s/.test(c.s[c.pos]!)) c.pos += 1;
}

function peekChar(c: Cursor): string {
  skipWs(c);
  return c.s[c.pos] ?? "";
}

/** Try to read one of the literal tokens at the cursor; consume it on match. */
function eat(c: Cursor, token: string): boolean {
  skipWs(c);
  if (c.s.startsWith(token, c.pos)) {
    c.pos += token.length;
    return true;
  }
  return false;
}

/** Read an identifier (a fold reducer name, function name, or variable token). */
function readIdent(c: Cursor): string | null {
  skipWs(c);
  const m = c.s.slice(c.pos).match(/^[A-Za-z_][\w.]*/);
  if (!m) return null;
  c.pos += m[0].length;
  return m[0];
}

function parseFold(name: string, c: Cursor): FoldAst | null {
  const reducer = name as FoldReducer;
  if (!FOLD_REDUCERS.includes(reducer)) return null;
  if (!eat(c, "(")) return null;
  const arg = readIdent(c);
  if (!eat(c, ")") || arg == null) return null;
  if (reducer === "count") {
    return { kind: "fold", reducer, collection: arg, field: "" };
  }
  const dot = arg.lastIndexOf(".");
  if (dot <= 0) return null; // need `collection.field`
  return {
    kind: "fold",
    reducer,
    collection: arg.slice(0, dot),
    field: arg.slice(dot + 1),
  };
}

function parseFactor(c: Cursor): ArithExpr | null {
  skipWs(c);
  if (peekChar(c) === "(") {
    eat(c, "(");
    const inner = parseArithExpr(c);
    if (inner == null || !eat(c, ")")) return null;
    return inner;
  }
  // Numeric literal (incl. leading minus).
  const num = c.s.slice(c.pos).match(/^-?\d+(\.\d+)?/);
  if (num && /^[-\d]/.test(peekChar(c))) {
    c.pos += num[0].length;
    return { kind: "num", value: Number(num[0]) };
  }
  const ident = readIdent(c);
  if (ident == null) return null;
  // `min`/`max` are overloaded: a single `coll.field` arg is a FOLD; two args is
  // the dyadic arithmetic op. Probe for a fold first (no comma), else dyadic.
  if ((ident === "min" || ident === "max") && peekChar(c) === "(") {
    const save = c.pos;
    const fold = parseFold(ident, c);
    if (fold) return fold;
    c.pos = save; // rewind and try the dyadic `min(a,b)` form
    eat(c, "(");
    const left = parseArithExpr(c);
    if (left == null || !eat(c, ",")) return null;
    const right = parseArithExpr(c);
    if (right == null || !eat(c, ")")) return null;
    return { kind: "arith", op: ident, left, right };
  }
  // A fold call `sum(coll.field)` / `count(coll)`.
  if (FOLD_REDUCERS.includes(ident as FoldReducer) && peekChar(c) === "(") {
    return parseFold(ident, c);
  }
  // A plain variable reference.
  return { kind: "var", name: ident };
}

function parseTerm(c: Cursor): ArithExpr | null {
  let left = parseFactor(c);
  if (left == null) return null;
  for (;;) {
    const op = peekChar(c);
    if (op !== "*" && op !== "/") break;
    c.pos += 1;
    const right = parseFactor(c);
    if (right == null) return null;
    left = { kind: "arith", op, left, right };
  }
  return left;
}

function parseArithExpr(c: Cursor): ArithExpr | null {
  let left = parseTerm(c);
  if (left == null) return null;
  for (;;) {
    const op = peekChar(c);
    if (op !== "+" && op !== "-") break;
    c.pos += 1;
    const right = parseTerm(c);
    if (right == null) return null;
    left = { kind: "arith", op, left, right };
  }
  return left;
}

/** Parse a whole string as a closed arithmetic expression (or null). Pure. */
export function parseArith(formal: string): ArithExpr | null {
  const c: Cursor = { s: formal, pos: 0 };
  const expr = parseArithExpr(c);
  if (expr == null) return null;
  skipWs(c);
  if (c.pos !== c.s.length) return null; // trailing junk -> not a clean closed form
  return expr;
}

/**
 * Parse a Formal/Formula cell into the small evaluable AST. Returns `unparsed`
 * for anything outside the tiny grammar (the caller falls back to coverage_gap).
 */
export function parseFormal(formal: string): FormalAst {
  const f = formal.trim();
  if (f === "") return { kind: "unparsed", raw: formal };

  // --- Strip an optional `<lhs> =` assignment prefix for closed forms ---------
  // A makeup/aggregate cell may be authored as `newMakeup = max(0, ...)`; the LHS
  // names the derived field, the RHS is the closed expression. The TERNARY path
  // below tolerates the prefix already; here we expose the RHS to the arith path.
  const eqIdx = f.indexOf("=");
  const looksAssign =
    eqIdx > 0 &&
    f[eqIdx + 1] !== "=" &&
    f[eqIdx - 1] !== "<" &&
    f[eqIdx - 1] !== ">" &&
    f[eqIdx - 1] !== "!" &&
    /^[A-Za-z_][\w.]*\s*$/.test(f.slice(0, eqIdx));
  const rhs = looksAssign ? f.slice(eqIdx + 1).trim() : f;

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

  // --- CLOSED-FORM: a pure arithmetic expression (Fold / Piecewise / ArithExpr).
  // Only when the RHS has NO comparison/ternary/connective — those are handled by
  // the typed paths above and must not be eaten here. A clean closed form parses
  // fully (no trailing junk) to a Fold or an arithmetic tree; anything else stays
  // `unparsed` (we never guess). The emitter evaluates this against a fixture env.
  const hasComparison = /[<>]=?|==|!=|\?|->|=>|\band\b|\bor\b/i.test(rhs);
  if (!hasComparison) {
    const arith = parseArith(rhs);
    if (arith) return arith; // FoldAst | ArithBinAst | NumLeaf | VarLeaf
  }

  return { kind: "unparsed", raw: formal };
}
