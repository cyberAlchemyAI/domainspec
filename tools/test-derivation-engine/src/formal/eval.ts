// SWU-COB-003 — pure, total evaluator for the closed-form ArithExpr grammar.
//
// DETERMINISM CONTRACT (findings work-item 2): arithmetic is exact RATIONAL
// (BigInt numerator/denominator), never native float accumulation. `0.1 + 0.2`
// in IEEE-754 is `0.30000000000000004`; accumulating such drift across a fold
// would make the EXPECTED value depend on summation order / platform — breaking
// byte-stable emission. We therefore parse decimal literals into exact rationals
// and do all `+ - * / min max` in BigInt rational space, only formatting back to
// a decimal string at the very end (and only when the result is finite-decimal).
//
// TOTALITY: every partial operation (division by zero, empty/unbounded fold,
// unresolved variable, non-finite result) returns `null` instead of throwing.
// The caller (emit) treats a `null` evaluation as "not closed-form-derivable"
// and falls back to the L0 co-emit coverage_gap. We never guess a value.

import type { ArithExpr, FoldReducer } from "./ast.js";

/** An exact rational `num/den` with `den > 0`. The evaluator's only numeric type. */
export interface Rational {
  readonly num: bigint;
  readonly den: bigint;
}

/** The fixture environment: scalar vars and collections of records. */
export interface EvalEnv {
  readonly vars: Readonly<Record<string, number | string>>;
  readonly collections: Readonly<
    Record<string, readonly Readonly<Record<string, number>>[]>
  >;
  /** Max fold length accepted (totality guard against unbounded folds). */
  readonly maxFoldLen?: number;
}

const DEFAULT_MAX_FOLD = 100_000;

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** Normalize to lowest terms with a positive denominator. */
function rat(num: bigint, den: bigint): Rational | null {
  if (den === 0n) return null; // div-by-zero -> not derivable
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den) || 1n;
  return { num: num / g, den: den / g };
}

/** Parse a finite decimal string into an exact rational (no float). */
export function decimalToRational(s: string): Rational | null {
  const t = s.trim();
  const m = t.match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1n : 1n;
  const intPart = m[2] ?? "0";
  const fracPart = m[3] ?? "";
  const den = 10n ** BigInt(fracPart.length);
  const num = sign * (BigInt(intPart) * den + BigInt(fracPart || "0"));
  return rat(num, den);
}

/** Convert a JS number to an exact rational via its decimal string (no drift). */
function numberToRational(n: number): Rational | null {
  if (!Number.isFinite(n)) return null;
  // `String(n)` is the shortest round-trip decimal; exact for the values we emit
  // (integers and short decimals like 0.5). We refuse anything in e-notation.
  const s = String(n);
  if (/e/i.test(s)) return null;
  return decimalToRational(s);
}

const ZERO: Rational = { num: 0n, den: 1n };

function add(a: Rational, b: Rational): Rational | null {
  return rat(a.num * b.den + b.num * a.den, a.den * b.den);
}
function sub(a: Rational, b: Rational): Rational | null {
  return rat(a.num * b.den - b.num * a.den, a.den * b.den);
}
function mul(a: Rational, b: Rational): Rational | null {
  return rat(a.num * b.num, a.den * b.den);
}
function div(a: Rational, b: Rational): Rational | null {
  if (b.num === 0n) return null; // div-by-zero -> not derivable
  return rat(a.num * b.den, a.den * b.num);
}
/** Compare a<=>b as a-b sign. */
function cmp(a: Rational, b: Rational): number {
  const l = a.num * b.den;
  const r = b.num * a.den;
  return l < r ? -1 : l > r ? 1 : 0;
}

const REDUCER_OP: Record<
  Exclude<FoldReducer, "count">,
  (a: Rational, b: Rational) => Rational | null
> = {
  sum: add,
  product: mul,
  min: (a, b) => (cmp(a, b) <= 0 ? a : b),
  max: (a, b) => (cmp(a, b) >= 0 ? a : b),
};

/**
 * Evaluate a closed ArithExpr against an env to an exact rational, or `null` if
 * any partial operation fails (totality). Pure: no I/O, no clock, no float
 * accumulation. Same (expr, env) -> same Rational, always.
 */
export function evalRational(expr: ArithExpr, env: EvalEnv): Rational | null {
  switch (expr.kind) {
    case "num":
      return numberToRational(expr.value);
    case "var": {
      const v = env.vars[expr.name];
      if (typeof v !== "number") return null; // unresolved / non-numeric var
      return numberToRational(v);
    }
    case "arith": {
      const l = evalRational(expr.left, env);
      const r = evalRational(expr.right, env);
      if (l == null || r == null) return null;
      switch (expr.op) {
        case "+":
          return add(l, r);
        case "-":
          return sub(l, r);
        case "*":
          return mul(l, r);
        case "/":
          return div(l, r);
        case "min":
          return cmp(l, r) <= 0 ? l : r;
        case "max":
          return cmp(l, r) >= 0 ? l : r;
      }
      return null;
    }
    case "fold": {
      const coll = env.collections[expr.collection];
      if (!Array.isArray(coll)) return null; // unresolved collection
      const cap = env.maxFoldLen ?? DEFAULT_MAX_FOLD;
      if (coll.length > cap) return null; // unbounded-fold guard
      if (expr.reducer === "count") {
        return numberToRational(coll.length);
      }
      const op = REDUCER_OP[expr.reducer];
      // Empty fold: sum/product have identities (0/1); min/max do NOT -> null.
      if (coll.length === 0) {
        if (expr.reducer === "sum") return ZERO;
        if (expr.reducer === "product") return { num: 1n, den: 1n };
        return null; // empty min/max -> not derivable (totality)
      }
      let acc: Rational | null = null;
      for (const rec of coll) {
        const cell = rec[expr.field];
        if (typeof cell !== "number") return null;
        const r = numberToRational(cell);
        if (r == null) return null;
        acc = acc == null ? r : op(acc, r);
        if (acc == null) return null;
      }
      return acc;
    }
  }
}

/**
 * Format an exact rational as a finite decimal string, or `null` when it is not
 * a terminating decimal (den has prime factors other than 2 and 5 -> e.g. 1/3).
 * A non-terminating result is NOT closed-form-derivable -> coverage_gap. The
 * output is a JS-numeric-literal-safe string (the emitter inlines it verbatim).
 */
export function rationalToDecimalString(r: Rational): string | null {
  if (r.den === 1n) return r.num.toString();
  // Reduce den to 2^a·5^b; if any other factor remains, it does not terminate.
  let den = r.den;
  let twos = 0;
  let fives = 0;
  while (den % 2n === 0n) {
    den /= 2n;
    twos += 1;
  }
  while (den % 5n === 0n) {
    den /= 5n;
    fives += 1;
  }
  if (den !== 1n) return null; // repeating decimal -> not derivable
  const scale = Math.max(twos, fives);
  const scaled = (r.num * 10n ** BigInt(scale)) / r.den; // exact (den | 10^scale)
  const neg = scaled < 0n;
  const digits = (neg ? -scaled : scaled).toString().padStart(scale + 1, "0");
  const cut = digits.length - scale;
  let intPart = digits.slice(0, cut);
  let fracPart = digits.slice(cut).replace(/0+$/, "");
  let out = fracPart === "" ? intPart : `${intPart}.${fracPart}`;
  return neg ? `-${out}` : out;
}

/**
 * Top-level: evaluate a closed expression to a finite-decimal STRING for direct
 * `expect(...).toBe(<value>)` emission, or `null` if not closed-form-derivable.
 * Pure/total/deterministic. NO native float accumulation anywhere in the path.
 */
export function evalArith(expr: ArithExpr, env: EvalEnv): string | null {
  const r = evalRational(expr, env);
  if (r == null) return null;
  return rationalToDecimalString(r);
}
