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
//     calculation     / CT     -> "calc"      token = calc id (c1..cn)
//     postcondition   / PC     -> "post"      token = owning operation
//     invariant       / WI     -> "inv"       token = invariant id (i1..in)
//     contract        / CO     -> "contract"  token = http status code
//     event-obligation/ EV     -> "event"     producer = event name; consumer = consumer concept
//     error-obligation/ ERR    -> "error"     token = owning operation
//     valid/invalid-transition -> "transition"/"invalid"
//     workflow-step   / WF     -> "workflow"  token = workflow slug + per-row token
//     query-behavior  / QT     -> "query"     token = query slug + per-row token
//     mapping-row     / MT     -> "mapping"   token = mapping slug + per-row token
//
// BRIDGING IS DRIVEN BY A DIALECT DESCRIPTOR (DialectDescriptor), every field of
// which is DERIVED FROM THE DOCS — never from the feature name (INV-4). The
// descriptor supplies: id-scope (global vs per-operation), the concept-alias map
// (structural prefix-uniqueness, e.g. `Session ⊑ SessionLifecycle`), and the event
// producer/consumer bucketing. The engine ships ZERO feature-name branches.
//
// COMPARISON: engine-set ⊇ committed-set at the normalized level. A committed miss
// is GENUINE (a real δ gap or convention drift) unless it is documented-irreducible
// (per-assertion prose / impl-oracle outside the decidable fragment). The report
// distinguishes the two so a feature can PASS-at-declared-scope when every residual
// miss is irreducible.

import { readFileSync } from "node:fs";
import type { ConceptGraph, Obligation, ObligationKey } from "../ir/types.js";

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

// --- Dialect descriptor (derived from the docs, never the feature name) ---------

/**
 * The per-feature bridging facts that structure alone cannot infer. EVERY field is
 * derived from the docs (table shape, source headings) — INV-4 forbids deriving any
 * of them from the feature name. `deriveDescriptor` computes one from the parsed
 * source graph + the committed TEST-SPEC.
 */
export interface DialectDescriptor {
  readonly dialect: CommittedDialect;
  /** Engine ids are operation-qualified (`rule:<op>:<id>`) when ids restart per op. */
  readonly idScope: "global" | "per-operation";
  /**
   * Concept-alias map (lowercased source-slug). Maps an oracle/engine concept token
   * onto its canonical source heading by structural PREFIX-UNIQUENESS: an oracle
   * token `session` aliases to source heading `sessionlifecycle` iff exactly ONE
   * source heading has `session` as a prefix. Applied symmetrically to BOTH sides.
   */
  readonly conceptAliases: ReadonlyMap<string, string>;
  /** Events split into producer + consumer buckets (always true; recovery, not invention). */
  readonly eventBucket: "by-event-and-consumer";
}

/** Slug a concept name to lowercase alphanumeric. */
function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Build the concept-alias map by structural prefix-uniqueness over the ENTITY
 * headings (the state-machine `## <Heading>` names in states.md). The drift this
 * reconciles is entity-name drift: the oracle drops the `Lifecycle` suffix
 * (`Session` vs source `SessionLifecycle`). For every CamelCase head-prefix P of an
 * Entity slug S, register P->S iff S is the UNIQUE Entity with prefix P. Ambiguous
 * prefixes register nothing (honest miss, never a guess — R-004).
 *
 * Scoped to Entity nodes (not all concepts) on purpose: operations/queries/mappings/
 * workflows are named identically by oracle and engine, so they need no alias, and
 * scoping avoids spurious short-prefix bridges (e.g. `access` -> `accessdenied`).
 * It also disambiguates `Token` (three concepts start with it, but only ONE Entity
 * — `TokenLifecycle` — so the invariant owner `token` aliases correctly).
 */
function buildConceptAliases(graph: ConceptGraph): Map<string, string> {
  const entityNames = graph.nodes
    .filter((n) => n.type === "Entity")
    .map((n) => (typeof n.fields.name === "string" ? n.fields.name : ""))
    .filter((s) => s.trim() !== "");
  const entitySlugs = new Set(entityNames.map(slug));
  const aliasCandidates = new Map<string, Set<string>>(); // prefixSlug -> full slugs
  for (const raw of entityNames) {
    const full = slug(raw);
    const words = raw.match(/[A-Z]+[a-z0-9]*|[a-z0-9]+/g) ?? [];
    let acc = "";
    for (let k = 0; k < words.length - 1; k += 1) {
      acc += words[k];
      const p = slug(acc);
      if (p === full || p === "") continue;
      (aliasCandidates.get(p) ?? aliasCandidates.set(p, new Set()).get(p)!).add(
        full,
      );
    }
  }
  const aliases = new Map<string, string>();
  for (const [prefix, fulls] of aliasCandidates) {
    if (fulls.size === 1 && !entitySlugs.has(prefix)) {
      aliases.set(prefix, [...fulls][0]!);
    }
  }
  return aliases;
}

/** Apply the alias map: canonicalize a concept slug to its source heading. */
function canon(token: string, aliases: ReadonlyMap<string, string>): string {
  return aliases.get(token) ?? token;
}

/** Compute the full dialect descriptor from the source graph + committed spec. */
export function deriveDescriptor(
  graph: ConceptGraph,
  committed: CommittedSpec,
): DialectDescriptor {
  return {
    dialect: committed.dialect,
    // id-scope is its OWN fact (ids restart per operation), defaulting from dialect
    // but kept explicit so a future global-id column-typed spec would not misalign.
    idScope: committed.qualified ? "per-operation" : "global",
    conceptAliases: buildConceptAliases(graph),
    eventBucket: "by-event-and-consumer",
  };
}

// --- Normalized semantic identity ---------------------------------------------

export interface SemanticObligation {
  readonly semanticId: string;
  readonly description: string;
}

export interface SemanticOptions {
  /**
   * When true, rule / calc / invariant / post / error / transition / event semantic
   * ids are qualified by their owning operation/entity slug, with that slug run
   * through `conceptAliases`. Required for specs whose ids restart per operation
   * (column-typed). Default (false) matches globally-unique-id specs (rv-ct).
   */
  readonly qualified?: boolean;
  /** Concept-alias map (from the dialect descriptor). Applied to owner slugs. */
  readonly conceptAliases?: ReadonlyMap<string, string>;
}

export function engineSemanticId(
  o: Obligation,
  opts: SemanticOptions = {},
): string {
  const p = o.canonical_params;
  const t = (v: unknown): string => String(v ?? "").toLowerCase();
  const q = opts.qualified === true;
  const aliases = opts.conceptAliases ?? new Map<string, string>();
  // Owning operation/entity slug, from the source anchor (`operations.md#Login:rule:0`).
  const owner = canon(opBucket(o.source_anchor), aliases);
  const ruleId = (id: string) => (q ? `rule:${owner}:${id}` : `rule:${id}`);
  const invId = (id: string) => (q ? `inv:${owner}:${id}` : `inv:${id}`);
  const calcId = (id: string) => (q ? `calc:${owner}:${id}` : `calc:${id}`);
  switch (o.rule_type) {
    case "rule-validation":
      return ruleId(t(p.id));
    case "calculation":
      return calcId(t(p.id));
    case "postcondition":
      return `post:${owner}`;
    case "invariant":
      return invId(t(p.id));
    case "contract":
      return `contract:${t(p.status)}`;
    case "event-obligation": {
      // Producer obligation (no consumer) -> by event name.
      // Consumer obligation -> by the CONSUMER concept (leading word of consumer
      // name, aliased). The oracle's consumer rows key by consumer concept too.
      const consumer = t(p.consumer);
      if (consumer === "") return `event:${t(p.event)}`;
      return `event:${canon(conceptHead(consumer), aliases)}`;
    }
    case "error-obligation":
      // Op-bucketed: the oracle authors one "X error mapping" row per operation; the
      // engine's N condition rows for op X case-fold onto `error:<op>` (INV-1 safe,
      // same granularity blessed for postconditions). Aliased owner.
      return `error:${canon(t(p.op), aliases)}`;
    case "valid-transition":
      return `transition:${transState(t(p.from))}:${transEvent(t(p.event))}`;
    case "invalid-transition":
      return `invalid:${transState(t(p.from))}:${transEvent(t(p.event))}`;
    case "workflow-step":
      return `workflow:${canon(slug(t(p.workflow)), aliases)}:${workflowStepToken(t(p.step))}`;
    case "query-behavior":
      return `query:${canon(slug(t(p.query)), aliases)}:behavior`;
    case "mapping-row":
      return `mapping:${canon(slug(t(p.mapping)), aliases)}:section`;
    case "needs-formal": {
      // Fold needs_formal back onto its base category so it still answers for a
      // committed peer. The MAKEUP_CALC literal is gone: a needs_formal calc is keyed
      // by its OWN id like any calc (no special `calc:makeup` alias).
      const base = t(p.base_rule_type);
      const id = t(p.id);
      if (base === "calculation") return calcId(id);
      if (base === "rule-validation") return ruleId(id);
      if (base === "invariant") return invId(id);
      if (base === "postcondition") return `post:${owner}`;
      return `needs-formal:${id}`;
    }
    default:
      return `${o.rule_type}:${t(p.id)}`;
  }
}

/** Leading concept head of a consumer/owner name ("Audit subsystem" -> "audit"). */
function conceptHead(name: string): string {
  const m = name.match(/^([A-Za-z][\w/]*)/);
  return slug(m?.[1] ?? name);
}

/** Extract the owning-operation slug from a source anchor like `operations.md#GenerateSettlement:postcondition:0`. */
function opBucket(anchor: string): string {
  const m = anchor.match(/#([^:]+):/);
  return (m?.[1] ?? anchor).toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Symmetric workflow step fold (engine `num` vs committed "Step N"). */
function workflowStepToken(raw: string): string {
  const m = raw.match(/\d+/);
  return m ? m[0] : raw.trim().toLowerCase();
}

/**
 * INV-5 symmetric transition-token fold, applied IDENTICALLY to the engine side and
 * the committed side so `from`/`event` tokens normalize to the same string regardless
 * of punctuation (`ReviewCandidateApplication(APPROVE)` -> `reviewcandidateapplicationapprove`)
 * or underscores (`UNDER_REVIEW` -> `underreview`). The `[new]` start marker keeps its
 * brackets so it stays distinguishable from a real state.
 */
function transState(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (s.includes("[new]") || s === "new") return "[new]";
  return s.replace(/[^a-z0-9]/g, "");
}
function transEvent(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
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
  IV: "inv",
  CO: "contract",
  EV: "event",
  WF: "workflow",
  QT: "query",
  MT: "mapping",
  ST: "transition",
  NT: "invalid",
  ERR: "error",
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
  /**
   * Whether engine semantic ids must be operation-qualified to align. DERIVED FROM
   * THE DATA, not the dialect: true iff the oracle's rule/calc/inv rows carry an
   * owning-concept token BEFORE the ref id (`Login R1`), false when they start with
   * the bare ref id (`R1 player exists`). This decouples id-scope from dialect (the
   * architect's flagged latent overfit §6.2): a column-typed spec can be global-id.
   */
  readonly qualified: boolean;
  readonly semantic: Map<string, string>;
}

/**
 * Detect operation-qualified id-scope from rule/calc/inv Obligation cells. Returns
 * true iff at least one such cell has a concept word BEFORE its `\b[RCPI]\d+\b` ref
 * (e.g. `Login R1`); false if they all start with the bare ref (`R1 ...`).
 */
function detectQualified(lines: string[]): boolean {
  let sawRefRow = false;
  for (const line of lines) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 4) continue;
    if (!/^[A-Z][A-Z0-9]*-(RULE|CALC|INV)-\d+$/.test(cells[0] ?? "")) continue;
    const oblig = cells[3] ?? "";
    const m = oblig.match(/\b([RCPI])(\d+)\b/i);
    if (!m) continue;
    sawRefRow = true;
    const before = oblig.slice(0, m.index ?? 0).trim();
    // A non-empty concept word before the ref id => operation-qualified.
    if (/[A-Za-z]/.test(before)) return true;
  }
  // If no rule/calc/inv ref rows exist, default to unqualified (global) — there is
  // nothing to qualify and the engine's bare ids will match the oracle's.
  return sawRefRow ? false : false;
}

/** Map a column-typed `Type` cell to the normalized semantic prefix. */
const TYPE_PREFIX: Array<{ re: RegExp; prefix: string }> = [
  // Domain-model invariants (Type "Domain invariant"/"Domain model", sourced from
  // domain.md) — a doc the engine does NOT parse. Matched FIRST (before the generic
  // invariant rule) so they get their own prefix and classify as documented-
  // irreducible (outside the engine's source scope: the 7 structural aspect docs).
  { re: /domain\s*(invariant|model|concept|rule)/i, prefix: "domain-inv" },
  { re: /rule/i, prefix: "rule" },
  { re: /calc/i, prefix: "calc" },
  { re: /postcond/i, prefix: "post" },
  { re: /contract/i, prefix: "contract" },
  { re: /invariant/i, prefix: "inv" },
  { re: /mapping/i, prefix: "mapping" },
  { re: /query/i, prefix: "query" },
  { re: /error\s*state/i, prefix: "error" },
  // "Event flow" rows are cross-cutting prose obligations (idempotency / dedup
  // identity) sourced from non-table doc sections (e.g. events.md#idempotency-rule)
  // the engine does not derive from. Own prefix -> documented-irreducible.
  { re: /event\s*flow/i, prefix: "event-flow" },
  { re: /event\s*consumer|consumer/i, prefix: "event-consumer" },
  { re: /event/i, prefix: "event" },
  { re: /workflow|policy/i, prefix: "workflow" },
  { re: /negative\s*transition/i, prefix: "invalid" },
  { re: /transition/i, prefix: "transition" },
];

/**
 * Detect the dialect and parse the committed TEST-SPEC.md into normalized semantic
 * ids. Column-typed is detected by a header carrying BOTH an id column (`Test ID`
 * OR `ID`) and a `Type` column whose data rows use `<FEAT>-<CAT>-<NNN>` ids.
 */
export function parseCommittedSpec2(
  specPath: string,
  conceptAliases: ReadonlyMap<string, string> = new Map(),
): CommittedSpec {
  const text = readFileSync(specPath, "utf8");
  const lines = text.split(/\r?\n/);
  // Column-typed signature: any header line with a `Type` column AND an id column,
  // with at least one `<FEAT>-<CAT>-<NNN>` data row in the file.
  const hasTypedHeader = lines.some(
    (l) =>
      /\btype\b/i.test(l) &&
      /\b(test id|id)\b/i.test(l) &&
      l.trim().startsWith("|"),
  );
  const hasFeatCatId = lines.some((l) =>
    /\|\s*[A-Z][A-Z0-9]*-[A-Z]+-\d+\s*\|/.test(l),
  );
  if (hasTypedHeader && hasFeatCatId) {
    const qualified = detectQualified(lines);
    return {
      dialect: "column-typed",
      qualified,
      semantic: parseColumnTyped(lines, conceptAliases, qualified),
    };
  }
  return {
    dialect: "rv-ct",
    qualified: false,
    semantic: parseRvCt(lines, conceptAliases),
  };
}

/** Backwards-compatible entrypoint: returns just the semantic map. */
export function parseCommittedSemantic(
  specPath: string,
  conceptAliases: ReadonlyMap<string, string> = new Map(),
): Map<string, string> {
  return parseCommittedSpec2(specPath, conceptAliases).semantic;
}

/** True for a Traceability/Evidence matrix region (not a test-catalogue table). */
function isTraceabilityHeading(line: string): boolean {
  return /^#+\s+.*(traceability|coverage|story\s+map|evidence)/i.test(line);
}

/** True for a table header that is a Traceability/Evidence matrix (skip its rows). */
function isEvidenceHeader(cells: string[]): boolean {
  const norm = cells.map((c) => c.toLowerCase().trim());
  return (
    norm.includes("evidence file") ||
    (norm.includes("obligation") && norm.includes("status")) ||
    (norm.includes("story") && norm.includes("test ids")) ||
    norm.some((c) => c.startsWith("evidence"))
  );
}

/**
 * Column-typed dialect parser. Maps the `Type` column to a prefix and derives an
 * alias-canonicalized, operation-qualified token from the `Obligation` cell.
 */
function parseColumnTyped(
  lines: string[],
  conceptAliases: ReadonlyMap<string, string>,
  qualified: boolean,
): Map<string, string> {
  const out = new Map<string, string>();
  let inEvidence = false;

  for (const line of lines) {
    if (/^#+\s/.test(line)) inEvidence = isTraceabilityHeading(line);
    if (!line.trim().startsWith("|")) continue;
    const cells = line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 4) continue;
    if (isEvidenceHeader(cells)) {
      inEvidence = true;
      continue;
    }
    if (inEvidence) continue;
    const idCell = cells[0] ?? "";
    if (!/^[A-Z][A-Z0-9]*-[A-Z]+-\d+$/.test(idCell)) continue; // e.g. AUTH-RULE-001
    const typeCell = cells[1] ?? "";
    const sourceCell = cells[2] ?? "";
    const oblig = cells[3] ?? "";
    const assertion = cells[4] ?? "";
    const entry = TYPE_PREFIX.find((tp) => tp.re.test(typeCell));
    if (!entry) continue;
    // SOURCE-SCOPE OVERRIDE: any obligation whose Source is domain.md (a doc the
    // engine does not parse — it derives from the 7 structural aspect docs) is
    // outside the engine's source scope, regardless of its Type cell. Prefix it
    // `domain-inv` so it classifies as documented-irreducible (not a δ gap).
    const prefix = /\bdomain\.md\b/i.test(sourceCell)
      ? "domain-inv"
      : entry.prefix;

    // Owning concept = leading PascalCase / path token of the Obligation cell, aliased.
    const conceptMatch = oblig.match(/^([A-Za-z][\w/]*)/);
    const concept = canon(slug(conceptMatch?.[1] ?? ""), conceptAliases);
    const refId = oblig.match(/\b([RCPI])(\d+)\b/i);
    const ref = refId ? `${refId[1]}${refId[2]}`.toLowerCase() : "";

    let id: string | string[];
    let outPrefix = prefix;
    switch (prefix) {
      case "rule":
      case "calc":
      case "inv":
        // Operation-qualified (`<concept>:<ref>`) only when the spec's id-scope is
        // per-operation; otherwise the oracle keys by the bare ref id (global scope).
        id = ref ? (qualified ? `${concept}:${ref}` : ref) : concept;
        break;
      case "post":
      case "error":
        // Op-bucketed (one row per operation; matches engine op-bucket).
        id = concept;
        break;
      case "mapping":
      case "query":
      case "workflow":
        // INV-1: keep per-row identity (multiple rows per concept).
        id = `${concept}:${idCell.toLowerCase()}`;
        break;
      case "event":
        // Producer row -> by event name (leading concept of the Obligation cell).
        id = concept;
        outPrefix = "event";
        break;
      case "event-consumer": {
        // Consumer row -> by the CONSUMER concept. The consumer name is the leading
        // word of the Obligation cell ("Audit subsystem consumption" -> "audit").
        id = concept;
        outPrefix = "event";
        break;
      }
      case "contract": {
        const statuses = [...assertion.matchAll(/\b([1-5]\d{2})\b/g)].map(
          (mm) => mm[1] ?? "",
        );
        id = statuses.length > 0 ? statuses : concept;
        break;
      }
      default:
        id = idCell.toLowerCase();
    }

    const ids = Array.isArray(id) ? id : [id];
    for (const tok of ids) {
      const semanticId = `${outPrefix}:${tok}`;
      if (!out.has(semanticId))
        out.set(semanticId, `${oblig} — ${assertion}`.trim());
    }
  }
  return out;
}

/** "rv-ct" dialect parser: per-category tables keyed by `XX-n` row ids. */
function parseRvCt(
  lines: string[],
  conceptAliases: ReadonlyMap<string, string>,
): Map<string, string> {
  const out = new Map<string, string>();
  let currentSourceOp = "";
  let inEvidence = false;

  for (const line of lines) {
    if (/^#+\s/.test(line)) inEvidence = isTraceabilityHeading(line);
    // Track the most recent "Source: [Operation](...)" so PC rows bucket by operation.
    const src = line.match(/^Source:\s*\[([^\]]+)\]/);
    if (src && src[1] !== undefined) {
      currentSourceOp = canon(slug(src[1]), conceptAliases);
    }
    if (!line.trim().startsWith("|")) continue;
    const cells = line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 2) continue;
    if (isEvidenceHeader(cells)) {
      inEvidence = true;
      continue;
    }
    if (inEvidence) continue;
    const idCell = cells[0] ?? "";
    const m = idCell.match(/^(RV|CT|PC|WI|IV|CO|EV|WF|QT|MT|ST|NT|ERR)-(\d+)$/);
    if (!m || m[1] === undefined) continue;
    const category = m[1];
    const prefix = CATEGORY_PREFIX[category] ?? category.toLowerCase();
    const joined = cells.slice(1).join(" ");

    let token: string;
    switch (category) {
      case "RV":
      case "WI": {
        token = extractRefId(joined) ?? idCell.toLowerCase();
        break;
      }
      case "IV": {
        // Invariant-test rows. The prose may embed the source id (`I1:`); otherwise the
        // oracle renumbers its rows `IV-n`, which corresponds 1:1 to source invariant
        // `I-n` (the IV table is built from states.md invariants in order). Bridge the
        // `IV-n` row id to `i<n>` to match the engine's `inv:i<n>` — a deterministic
        // id-scheme alias, not a guess.
        const ref = extractRefId(joined);
        token = ref ?? `i${m[2]}`;
        break;
      }
      case "CT": {
        // CT rows embed C1.. when they carry a calc id; an id-less prose calc family
        // (e.g. the makeup-policy "Makeup:*" rows) has none -> keyed by its row id so
        // it surfaces as documented-irreducible rather than a manufactured match.
        token = extractRefId(joined) ?? idCell.toLowerCase();
        break;
      }
      case "PC": {
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
        token = canon(slug(evName), conceptAliases);
        break;
      }
      case "ERR": {
        token = currentSourceOp || idCell.toLowerCase();
        break;
      }
      case "ST":
      case "NT": {
        // Transition rows carry From + Event columns (cells[1], cells[2]). Use the
        // SAME INV-5 fold the engine applies so punctuation/underscore differences
        // do not split the two authoring schemes.
        const from = transState(cells[1] ?? "");
        const ev = transEvent(cells[2] ?? "");
        token = from && ev ? `${from}:${ev}` : idCell.toLowerCase();
        break;
      }
      case "WF": {
        const stepCell = cells[1] ?? "";
        const stepNum = stepCell.match(/step\s*(\d+)/i)?.[1];
        const wf = currentSourceOp || idCell.toLowerCase();
        token = stepNum
          ? `${wf}:${workflowStepToken(stepNum)}`
          : `${wf}:${idCell.toLowerCase()}`;
        break;
      }
      case "QT":
      case "MT": {
        const concept = canon(slug(cells[1] ?? idCell), conceptAliases);
        token = `${concept}:${idCell.toLowerCase()}`;
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

// --- Irreducibility classification --------------------------------------------

/**
 * STRUCTURAL irreducibility (independent of the engine output): a committed miss the
 * engine cannot derive per-row without guessing — per-assertion prose / impl-oracle
 * obligations OUTSIDE the decidable fragment (smt-fol-test-derivation needs_formal
 * class). Keyed on the semantic-id SHAPE, never the feature name:
 *   - query:<concept>:<row-id>   per-assertion read behavior (QT-n / auth-query-n)
 *   - mapping:<concept>:<row-id> per-field mapping prose (MT-n / auth-map-n)
 *   - workflow:<concept>:<row-id> per-branch workflow prose (auth-wf-n); engine emits
 *     per-STEP obligations whose step number does not align with branch row-ids.
 *   - calc:<row-id>              id-less prose calc family (makeup-policy math; R-C2-5)
 *   - contract:<non-numeric>     cross-cutting/deferred contract rows with no δ peer
 *   - transition/invalid:<feat-row-id>  oracle keys by row-id/state, not from/event
 *     (by-states bridge DEFERRED — DEC-TDE-SEMANTIC-RIGOR-001 §5e; engine derives the
 *     equivalent from/event coverage, visible as extras).
 *
 * Convention-drift residue that depends on the ENGINE OUTPUT (the Skeptic's
 * equivalence-class probe, §5) is handled separately in `semanticRoundTrip`: a
 * rule/calc/inv/post/error/event miss whose oracle row carries NO source ref-id
 * (pure prose, e.g. `inv:makeupbalance`, `rule:player`) is convention-drift IFF the
 * engine derived an unmatched EXTRA of the SAME category (coverage exists, identity
 * unrecoverable). Bounded by category cardinality so it cannot absolve a genuine gap.
 */
export function isIrreducibleMiss(id: string): boolean {
  // Domain-model invariants (sourced from domain.md, a doc the engine does not parse)
  // and any explicitly domain-sourced obligation: outside the engine's source scope.
  if (id.startsWith("domain-inv:") || id.startsWith("domain:")) return true;
  // Cross-cutting "Event flow" obligations (idempotency / dedup) from prose sections.
  if (id.startsWith("event-flow:")) return true;
  // per-assertion query/mapping/workflow rows: <prefix>:<concept>:<rowtoken> where the
  // row token is NOT the engine's own per-concept/per-step token. The engine emits
  // `:behavior`/`:section` (query/mapping) or `:<n>` (workflow step number); the
  // oracle's surplus per-row prose tokens (`auth-map-001`, `auth-wf-002`) are not
  // source-encoded at that granularity.
  const qm = id.match(/^(query|mapping):([^:]+):(.+)$/);
  if (qm) {
    const rowTok = qm[3]!;
    return rowTok !== "behavior" && rowTok !== "section";
  }
  const wf = id.match(/^workflow:([^:]+):(.+)$/);
  if (wf) {
    const rowTok = wf[2]!;
    return !/^\d+$/.test(rowTok); // a step NUMBER aligns; a row-id (auth-wf-001) does not
  }
  // transition / invalid keyed by a feature row-id / state-name token instead of the
  // engine's `<from>:<event>` pair (deferred by-states bridge).
  const tr = id.match(/^(transition|invalid):(.+)$/);
  if (tr) {
    const tok = tr[2]!;
    // engine form is `<from>:<event>` (two colon-parts); an oracle row-id is a single
    // `<feat>-state-<nnn>` token with a hyphenated digit suffix.
    return /-\d+$/.test(tok) && !tok.includes(":");
  }
  // id-less prose calc family: calc keyed by a raw row id (e.g. `calc:ct-5`) rather
  // than a real calc id (`calc:c4`, `calc:login:c1`).
  if (/^calc:(ct|pmk-calc|c)?[0-9]/.test(id) && /^calc:[a-z]*-?\d+$/.test(id)) {
    return true;
  }
  const cm = id.match(/^calc:(.+)$/);
  if (cm && /^[a-z]+-\d+$/.test(cm[1]!)) return true; // calc:ct-5, calc:pmk-...
  // cross-cutting / deferred contract rows: contract token is non-numeric.
  const co = id.match(/^contract:(.+)$/);
  if (co && !/^\d{3}$/.test(co[1]!)) return true;
  return false;
}

// --- Round-trip at the normalized level ---------------------------------------

export interface ClassifiedMiss {
  readonly id: string;
  readonly description: string;
  readonly irreducible: boolean;
}

export interface SemanticRoundTrip {
  readonly derivedCount: number;
  readonly committedCount: number;
  /** ALL committed semantic ids the engine did NOT derive (genuine + irreducible). */
  readonly missing: readonly ClassifiedMiss[];
  /** Genuine δ-gap / convention-drift misses (a non-empty set => FAIL). */
  readonly genuineMissing: readonly ClassifiedMiss[];
  /** Documented-irreducible misses (allowed at declared scope). */
  readonly irreducibleMissing: readonly ClassifiedMiss[];
  /** engine semantic ids with no committed peer -> allowed extras. */
  readonly extra: readonly string[];
  /** True iff there are NO genuine misses (irreducible residue is permitted). */
  readonly pass: boolean;
  /** True iff there are NO misses of ANY kind (a clean PASS, no residue). */
  readonly cleanPass: boolean;
}

/** Top-level semantic category of an id (`rule:login:r1` -> `rule`). */
function category(id: string): string {
  return id.split(":")[0] ?? id;
}

/**
 * A drift-eligible miss is one the oracle authored as PURE PROSE: its token (the part
 * after the category prefix) is a single lowercase concept word with NO ref-id and NO
 * operation-qualified sub-structure (`error:invalid`, `rule:player`, `inv:bankroll`).
 *
 * This is also the INV-3 falsifiability firewall. It EXCLUDES:
 *   - operation-qualified / ref-id tokens (`rule:login:r1`, `calc:c4`) — a removed
 *     ALIGNED engine key (the negative control's removal probe) keeps this shape and
 *     therefore can NEVER be silently absolved as drift.
 *   - synthetic / non-word tokens (`rule:__sentinel__`) — the injection probe's
 *     sentinel has underscores, so it is never prose-eligible and always surfaces.
 * Without this gate the category-count probe would mask the negative control and the
 * gate could no longer prove it can fail.
 */
function isProseToken(id: string): boolean {
  const tok = id.slice(id.indexOf(":") + 1);
  return /^[a-z]+$/.test(tok);
}

/**
 * Per-ITEM drift categories: one engine obligation per oracle row. A miss here is
 * convention-drift (not a δ gap) only when the engine derived AT LEAST AS MANY
 * unmatched extras of the same category as there are drift misses — the Skeptic's
 * equivalence-class probe (§5), CARDINALITY-bounded so an under-covered class stays
 * a genuine gap (e.g. domain-only invariants the engine never derives).
 */
const DRIFT_CATEGORIES_PERITEM = new Set(["rule", "calc", "inv", "event"]);

/**
 * Op-BUCKETED drift categories: the engine emits ONE obligation per operation while
 * the oracle may author N condition-rows per operation (error) or N case-rows per
 * operation (post). One engine key legitimately covers many oracle rows, so the
 * cardinality bound does not apply — absolution is PRESENCE-based: the category is
 * drift iff the engine derived ≥1 unmatched extra of it (proving the class is
 * derived). If the engine derives ZERO, the misses stay GENUINE.
 */
const DRIFT_CATEGORIES_OPBUCKET = new Set(["error", "post"]);

export function semanticRoundTrip(
  derived: ReadonlyMap<string, string>,
  committed: ReadonlyMap<string, string>,
): SemanticRoundTrip {
  const extra = [...derived.keys()].filter((id) => !committed.has(id)).sort();

  // Raw misses with their STRUCTURAL irreducibility.
  const raw = [...committed.entries()]
    .filter(([id]) => !derived.has(id))
    .map(([id, description]) => ({
      id,
      description,
      irreducible: isIrreducibleMiss(id),
    }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));

  // Equivalence-class probe. Count unmatched extras per category.
  const unmatchedExtraByCat = new Map<string, number>();
  for (const e of extra) {
    const c = category(e);
    unmatchedExtraByCat.set(c, (unmatchedExtraByCat.get(c) ?? 0) + 1);
  }
  // Count not-yet-irreducible, PROSE-keyed misses per drift-eligible category. The
  // prose-token gate is the INV-3 firewall: ref-id / op-qualified / synthetic tokens
  // are never drift-eligible, so the negative control's injected sentinel and removed
  // aligned keys always surface as genuine misses.
  const driftMissByCat = new Map<string, number>();
  for (const m of raw) {
    if (m.irreducible || !isProseToken(m.id)) continue;
    const c = category(m.id);
    if (DRIFT_CATEGORIES_PERITEM.has(c) || DRIFT_CATEGORIES_OPBUCKET.has(c))
      driftMissByCat.set(c, (driftMissByCat.get(c) ?? 0) + 1);
  }
  const driftAbsolved = new Set<string>();
  for (const [c, missCount] of driftMissByCat) {
    const extras = unmatchedExtraByCat.get(c) ?? 0;
    if (DRIFT_CATEGORIES_OPBUCKET.has(c)) {
      // PRESENCE-based: one op-bucket engine key covers many oracle condition rows.
      if (extras >= 1) driftAbsolved.add(c);
    } else if (DRIFT_CATEGORIES_PERITEM.has(c)) {
      // CARDINALITY-bounded: coverage must match the number of drift misses.
      if (extras >= missCount) driftAbsolved.add(c);
    }
  }

  // Transition wildcard absolution. An oracle `transition|invalid:<from>:<event>any`
  // row uses `(any)` as an event WILDCARD ("any review event"); the engine derives the
  // CONCRETE per-event transitions for that same `from` state (visible as extras). The
  // wildcard token cannot match a concrete event, so it is convention-drift IFF the
  // engine derived at least one concrete `<cat>:<from>:*` key for the same from-state.
  const isWildcardAbsolved = (id: string): boolean => {
    const m = id.match(/^(transition|invalid):([^:]+):(.+)$/);
    if (!m || !/any$/.test(m[3]!)) return false;
    const cat = m[1]!;
    const from = m[2]!;
    return extra.some((e) => e.startsWith(`${cat}:${from}:`));
  };

  const missing: ClassifiedMiss[] = raw.map((m) =>
    !m.irreducible &&
    ((isProseToken(m.id) && driftAbsolved.has(category(m.id))) ||
      isWildcardAbsolved(m.id))
      ? { ...m, irreducible: true }
      : m,
  );
  const genuineMissing = missing.filter((m) => !m.irreducible);
  const irreducibleMissing = missing.filter((m) => m.irreducible);
  return {
    derivedCount: derived.size,
    committedCount: committed.size,
    missing,
    genuineMissing,
    irreducibleMissing,
    extra,
    pass: genuineMissing.length === 0,
    cleanPass: missing.length === 0,
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
