// Round-trip oracle for the L0 falsification gate (SWU-ENG-005).
//
// THE IDENTITY PROBLEM. The committed TEST-SPEC.md and the engine use DIFFERENT
// authoring schemes (hand-numbered RV-1.. / CT-1.. vs. content-addressed sha1
// obligation_keys), so raw obligation_key WON'T match across the two. We therefore
// define a NORMALIZED SEMANTIC IDENTITY that BOTH sides map into, and compare at
// that level. The sha1 obligation_key is kept ONLY for the engine's own
// cross-run determinism (a separate concern, tested elsewhere).
//
// NORMALIZED SEMANTIC IDENTITY (a string):
//
//   `${normRuleType}:${sortedCanonicalTokens}`
//
//   normRuleType folds engine rule types and committed categories onto a shared
//   vocabulary:
//     rule-validation / RV     -> "rule"      token = rule id (r1..rn)
//     calculation     / CT     -> "calc"      token = calc id (c1..cn) or "makeup"
//     postcondition   / PC     -> "post"      token = postcondition id (p1..pn)
//     invariant       / WI     -> "inv"       token = invariant id (i1..in)
//     contract        / CO     -> "contract"  token = http status code
//     event-obligation/ EV     -> "event"     token = event name (lowercased)
//     valid/invalid-transition -> "transition"/"invalid" (engine-only; no committed peer)
//     workflow-step   / WF     -> "workflow"  token = owning workflow slug
//     query-behavior  / QT     -> "query"     token = owning query slug
//     mapping-row     / MT     -> "mapping"   token = owning mapping slug
//
//   workflow/query/mapping bridge by the OWNING CONCEPT (not per-row id), exactly like
//   postconditions: the committed WF/QT/MT rows are per-step / per-assertion expansions
//   whose row-level prose is not source-encoded, so the gate asks "did the engine cover
//   this workflow/query/mapping?" rather than reproducing prose micro-cases.
//
//   Identity is at the SOURCE-ROW level, not the per-case level: the engine's
//   multiple exact cases for one rule (e.g. R3 RANGE -> 4) collapse to the SAME
//   semantic id as the committed spec's multiple RV rows for that rule. The gate
//   asks the structural question "did the engine cover every source obligation the
//   human catalogued?", not "did it produce the same number of micro-cases?".
//
// COMPARISON: engine-set ⊇ committed-set at the normalized level. missing
// (committed not derived) => FAIL. extra (derived not committed) is allowed
// (engine's exactified expansions + transition coverage).

import { readFileSync } from "node:fs";
import type { Obligation, ObligationKey } from "../ir/types.js";

export interface RoundTripReport {
  readonly missing: readonly ObligationKey[]; // committed but not derived -> FAIL
  readonly extra: readonly ObligationKey[]; // derived but not committed -> allowed
  readonly pass: boolean;
}

/** Compare derived vs committed obligation-key sets (generic set superset check). */
export function compareRoundTrip(
  derived: ReadonlySet<ObligationKey>,
  committed: ReadonlySet<ObligationKey>,
): RoundTripReport {
  const missing = [...committed].filter((k) => !derived.has(k));
  const extra = [...derived].filter((k) => !committed.has(k));
  return { missing, extra, pass: missing.length === 0 };
}

// --- Normalized semantic identity ---------------------------------------------

export interface SemanticObligation {
  readonly semanticId: string;
  readonly description: string;
}

// Which calculation ids denote the makeup-policy calc (a bare function call /
// prose policy the committed spec catalogues as the "Makeup:*" CT family).
const MAKEUP_CALC_IDS = new Set(["c4"]);

/**
 * Map an engine obligation to its normalized semantic id. Pure.
 *
 * Bridging policy across the two authoring schemes:
 *  - rules / invariants / simple calcs: bridge by SOURCE ID (committed text embeds R1/I1/C1...).
 *  - postconditions: committed PC-n rows are CASE EXPANSIONS that do NOT carry the
 *    P-id, so we cannot id-bridge without guessing (forbidden, R-004). We instead
 *    normalize to the OWNING-OPERATION bucket `post:<op>` on BOTH sides — the gate
 *    then asks "did the engine cover this operation's postconditions?".
 *  - makeup calc (C4 = applyMakeupPolicy(...)): the committed CT-5..CT-10 "Makeup:*"
 *    family has no C-id, so both sides fold to `calc:makeup`.
 */
export interface SemanticOptions {
  /**
   * When true, rule / calc / invariant semantic ids are qualified by their owning
   * operation/entity slug (`rule:<op>:<id>`). Required for specs whose rule/calc/
   * invariant ids restart per operation/entity (e.g. auth: `Login R1`, `Token I1`),
   * where a bare `rule:r1` would collide across operations. The default (false)
   * matches specs with globally-unique ids (financial-settlement: R1..R5, I1..I2).
   */
  readonly qualified?: boolean;
}

export function engineSemanticId(
  o: Obligation,
  opts: SemanticOptions = {},
): string {
  const p = o.canonical_params;
  const t = (v: unknown): string => String(v ?? "").toLowerCase();
  const q = opts.qualified === true;
  // Owning operation/entity slug, from the source anchor (`operations.md#Login:rule:0`).
  const owner = opBucket(o.source_anchor);
  const ruleId = (id: string) => (q ? `rule:${owner}:${id}` : `rule:${id}`);
  const invId = (id: string) => (q ? `inv:${owner}:${id}` : `inv:${id}`);
  const calcId = (id: string) =>
    MAKEUP_CALC_IDS.has(id)
      ? "calc:makeup"
      : q
        ? `calc:${owner}:${id}`
        : `calc:${id}`;
  switch (o.rule_type) {
    case "rule-validation":
      return ruleId(t(p.id));
    case "calculation":
      return calcId(t(p.id));
    case "postcondition":
      return `post:${opBucket(o.source_anchor)}`;
    case "invariant":
      return invId(t(p.id));
    case "contract":
      return `contract:${t(p.status)}`;
    case "event-obligation":
      return `event:${t(p.event)}`;
    case "valid-transition":
      return `transition:${t(p.from)}:${t(p.event)}`;
    case "invalid-transition":
      return `invalid:${t(p.from)}:${t(p.event)}`;
    case "workflow-step":
      // Bucket to the owning workflow (committed WF-n rows are per-step expansions
      // with no surviving source token — mirror the postcondition op-bucket bridge).
      return `workflow:${slug(t(p.workflow))}`;
    case "query-behavior":
      return `query:${slug(t(p.query))}`;
    case "mapping-row":
      return `mapping:${slug(t(p.mapping))}`;
    case "needs-formal": {
      // Fold needs_formal back onto its base category so it still answers for a
      // committed peer (e.g. C4 makeup -> calc:makeup). It IS coverage, unformalized.
      const base = t(p.base_rule_type);
      const id = t(p.id);
      if (base === "calculation") return calcId(id);
      if (base === "rule-validation") return ruleId(id);
      if (base === "invariant") return invId(id);
      if (base === "postcondition") return `post:${opBucket(o.source_anchor)}`;
      return `needs-formal:${id}`;
    }
    default:
      return `${o.rule_type}:${t(p.id)}`;
  }
}

/** Extract the owning-operation slug from a source anchor like `operations.md#GenerateSettlement:postcondition:0`. */
function opBucket(anchor: string): string {
  const m = anchor.match(/#([^:]+):/);
  return (m?.[1] ?? anchor).toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Canonical slug for a concept name (lowercase, alphanumeric only). */
function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Distinct normalized semantic ids the engine produced (a set). */
export function engineSemanticSet(
  obligations: readonly Obligation[],
  opts: SemanticOptions = {},
): Map<string, string> {
  const m = new Map<string, string>();
  for (const o of obligations) {
    const id = engineSemanticId(o, opts);
    if (!m.has(id)) m.set(id, o.description);
  }
  return m;
}

// --- Committed-spec parser -----------------------------------------------------

const CATEGORY_PREFIX: Record<string, string> = {
  RV: "rule",
  CT: "calc",
  PC: "post",
  WI: "inv",
  CO: "contract",
  EV: "event",
  WF: "workflow",
  QT: "query",
  MT: "mapping",
};

/** Extract an embedded rule/calc/post/invariant id token (R1, C3, P2, I1) from text. */
function extractRefId(text: string): string | null {
  const m = text.match(/\b([RCPI])(\d+)\b/i);
  return m ? `${m[1]}${m[2]}`.toLowerCase() : null;
}

/** The committed-spec authoring dialect detected for a TEST-SPEC.md. */
export type CommittedDialect = "rv-ct" | "column-typed";

export interface CommittedSpec {
  readonly dialect: CommittedDialect;
  /** Whether engine semantic ids must be operation-qualified to align (auth dialect). */
  readonly qualified: boolean;
  readonly semantic: Map<string, string>;
}

/** Map a column-typed `Type` cell to the normalized semantic prefix. */
const TYPE_PREFIX: Array<{ re: RegExp; prefix: string }> = [
  { re: /rule/i, prefix: "rule" },
  { re: /calc/i, prefix: "calc" },
  { re: /postcond/i, prefix: "post" },
  { re: /contract/i, prefix: "contract" },
  { re: /invariant/i, prefix: "inv" },
  { re: /mapping/i, prefix: "mapping" },
  { re: /query/i, prefix: "query" },
  { re: /event/i, prefix: "event" },
  { re: /workflow|policy/i, prefix: "workflow" },
  { re: /negative\s*transition/i, prefix: "invalid" },
  { re: /transition/i, prefix: "transition" },
  { re: /error\s*state/i, prefix: "error" },
];

/**
 * Detect the dialect and parse the committed TEST-SPEC.md into normalized semantic ids.
 * Two authoring dialects are supported (aliased, not hardcoded per feature):
 *   - "rv-ct": per-category tables keyed `RV-1`, `CT-1`, … (financial-settlement).
 *   - "column-typed": a single table with a `Type` column and `<FEATURE>-<CAT>-<NNN>`
 *     row ids (auth-access-control). Tokens are operation-qualified from the
 *     `Obligation` cell so rule/calc/invariant ids that restart per operation align.
 */
export function parseCommittedSpec2(specPath: string): CommittedSpec {
  const text = readFileSync(specPath, "utf8");
  const lines = text.split(/\r?\n/);
  // Column-typed dialect signature: a header row with both `Test ID` and `Type`.
  const isColumnTyped = lines.some(
    (l) =>
      /\btest id\b/i.test(l) && /\btype\b/i.test(l) && l.trim().startsWith("|"),
  );
  if (isColumnTyped) {
    return {
      dialect: "column-typed",
      qualified: true,
      semantic: parseColumnTyped(lines),
    };
  }
  return { dialect: "rv-ct", qualified: false, semantic: parseRvCt(lines) };
}

/** Backwards-compatible entrypoint: returns just the semantic map (rv-ct or column). */
export function parseCommittedSemantic(specPath: string): Map<string, string> {
  return parseCommittedSpec2(specPath).semantic;
}

/**
 * Column-typed dialect parser. Maps the `Type` column to a prefix and derives an
 * operation-qualified token from the `Obligation` cell (`Login R1` -> `rule:login:r1`,
 * `Session I1` -> `inv:session:i1`, `Login postconditions` -> `post:login`,
 * `GetPermissionCatalog filtering` -> `query:getpermissioncatalog`). Concept-only
 * categories (mapping/query/workflow/event) bucket by the leading concept name.
 */
function parseColumnTyped(lines: string[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of lines) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 4) continue;
    const idCell = cells[0] ?? "";
    if (!/^[A-Z][A-Z0-9]*-[A-Z]+-\d+$/.test(idCell)) continue; // e.g. AUTH-RULE-001
    const typeCell = cells[1] ?? "";
    const oblig = cells[3] ?? "";
    const assertion = cells[4] ?? "";
    const entry = TYPE_PREFIX.find((tp) => tp.re.test(typeCell));
    if (!entry) continue;
    const prefix = entry.prefix;

    // Owning concept = leading PascalCase / path token of the Obligation cell.
    const conceptMatch = oblig.match(/^([A-Za-z][\w/]*)/);
    const concept = (conceptMatch?.[1] ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const refId = oblig.match(/\b([RCPI])(\d+)\b/i);
    const ref = refId ? `${refId[1]}${refId[2]}`.toLowerCase() : "";

    let id: string | string[];
    switch (prefix) {
      case "rule":
      case "calc":
      case "inv":
        // Operation/entity-qualified: `<concept>:<refid>` (Login R1 -> login:r1).
        id = ref ? `${concept}:${ref}` : concept;
        break;
      case "post":
      case "mapping":
      case "query":
      case "workflow":
        id = concept;
        break;
      case "event":
        id = concept;
        break;
      case "contract": {
        // Contract rows enumerate statuses in the assertion (`200/401/403`).
        const statuses = [...assertion.matchAll(/\b([1-5]\d{2})\b/g)].map(
          (mm) => mm[1] ?? "",
        );
        id = statuses.length > 0 ? statuses : concept;
        break;
      }
      default:
        // transition / invalid / error: the Obligation cell names states, not the
        // event/from pair the engine keys on -> keep by own id so it surfaces honestly.
        id = idCell.toLowerCase();
    }

    const ids = Array.isArray(id) ? id : [id];
    for (const tok of ids) {
      const semanticId = `${prefix}:${tok}`;
      if (!out.has(semanticId))
        out.set(semanticId, `${oblig} — ${assertion}`.trim());
    }
  }
  return out;
}

/**
 * "rv-ct" dialect parser: per-category tables keyed by `XX-n` row ids.
 */
function parseRvCt(lines: string[]): Map<string, string> {
  const out = new Map<string, string>();
  let currentSourceOp = "";

  for (const line of lines) {
    // Track the most recent "Source: [Operation](...)" so PC rows bucket by operation.
    const src = line.match(/^Source:\s*\[([^\]]+)\]/);
    if (src && src[1] !== undefined) {
      currentSourceOp = src[1].toLowerCase().replace(/[^a-z0-9]/g, "");
    }
    if (!line.trim().startsWith("|")) continue;
    const cells = line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 2) continue;
    const idCell = cells[0] ?? "";
    const m = idCell.match(/^(RV|CT|PC|WI|CO|EV|WF|QT|MT)-(\d+)$/);
    if (!m || m[1] === undefined) continue;
    const category = m[1];
    const prefix = CATEGORY_PREFIX[category] ?? category.toLowerCase();
    const joined = cells.slice(1).join(" ");

    let token: string;
    switch (category) {
      case "RV":
      case "WI": {
        // Committed text embeds the source id (e.g. "R3: inclusive date range", "I1:").
        token = extractRefId(joined) ?? idCell.toLowerCase();
        break;
      }
      case "CT": {
        // CT-1..CT-4 embed C1..C4; CT-5..CT-10 are the ApplyMakeupPolicy "Makeup:*"
        // family with no C-id -> fold to `calc:makeup` (bridges engine C4).
        token = extractRefId(joined) ?? "makeup";
        break;
      }
      case "PC": {
        // PC-n rows are case expansions with NO surviving P-id; bucket by source op.
        token = currentSourceOp || idCell.toLowerCase();
        break;
      }
      case "CO": {
        const st = joined.match(/\b([1-5]\d{2})\b/);
        token = st?.[1] ?? idCell.toLowerCase();
        break;
      }
      case "EV": {
        const evName = cells[1]?.toLowerCase() ?? idCell.toLowerCase();
        token = evName.replace(/[^a-z0-9]/g, "");
        break;
      }
      case "WF": {
        // WF-n rows are per-step expansions whose 2nd cell is "Step N: ..." (no
        // workflow name). Bucket by the owning workflow from the `Source:` line —
        // the same owning-concept bridge used for postconditions.
        token = currentSourceOp || idCell.toLowerCase();
        break;
      }
      case "QT":
      case "MT": {
        // The 2nd cell carries the owning query/mapping concept name. Bucket by it
        // (the per-row prose assertions are not source-encoded, so the gate asks
        // "did the engine cover this query/mapping?", row-concept level).
        const concept = cells[1] ?? idCell;
        token = concept.toLowerCase().replace(/[^a-z0-9]/g, "");
        break;
      }
      default:
        token = idCell.toLowerCase();
    }

    const semanticId = `${prefix}:${token}`;
    if (!out.has(semanticId)) out.set(semanticId, joined);
  }

  return out;
}

// --- Round-trip at the normalized level ---------------------------------------

export interface SemanticRoundTrip {
  readonly derivedCount: number;
  readonly committedCount: number;
  /** committed semantic ids the engine did NOT derive -> FAIL drivers. */
  readonly missing: ReadonlyArray<{ id: string; description: string }>;
  /** engine semantic ids with no committed peer -> allowed extras. */
  readonly extra: readonly string[];
  readonly pass: boolean;
}

export function semanticRoundTrip(
  derived: Map<string, string>,
  committed: Map<string, string>,
): SemanticRoundTrip {
  const missing = [...committed.entries()]
    .filter(([id]) => !derived.has(id))
    .map(([id, description]) => ({ id, description }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  const extra = [...derived.keys()].filter((id) => !committed.has(id)).sort();
  return {
    derivedCount: derived.size,
    committedCount: committed.size,
    missing,
    extra,
    pass: missing.length === 0,
  };
}

/**
 * Legacy obligation_key extractor (kept for API compatibility). The committed spec
 * carries no engine keys, so this returns an empty set — the normalized comparison
 * above is the real gate.
 */
export function parseCommittedSpec(_specPath: string): Set<ObligationKey> {
  return new Set<ObligationKey>();
}
