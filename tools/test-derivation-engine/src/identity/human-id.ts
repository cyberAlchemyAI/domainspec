// Option C (decision D1) — stable human-ID projection over the sha1 obligation core.
//
// The engine's obligation_key (sha1, content-addressed) stays the internal source of
// truth and is a pure function of the docs. Human IDs (`FS-OP-001`) are a PROJECTION
// layered outside δ, persisted in a committed id-map sidecar (parallels bindings/).
// Allocation is deterministic given (docs + committed map): walk obligations in
// sorted-sha1 order, reuse a mapped id, else allocate the next free per-class id.
// Removed obligations become tombstones — an id is NEVER reused (the "never renumber"
// guarantee). Determinism of δ is preserved; identity is reproducible-given-inputs.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Obligation, RuleType } from "../ir/types.js";

/** rule_type -> short CLASS code used in the human id `<PREFIX>-<CLASS>-<NNN>`. */
const CLASS_OF: Record<RuleType, string> = {
  "valid-transition": "TR",
  "invalid-transition": "TR",
  invariant: "INV",
  "rule-validation": "RULE",
  calculation: "CALC",
  postcondition: "POST",
  contract: "IF",
  "event-obligation": "EVT",
  "workflow-step": "WF",
  "query-behavior": "QRY",
  "mapping-row": "MAP",
  "error-obligation": "ERR",
  "needs-formal": "NF",
};

export function classOf(rt: RuleType): string {
  return CLASS_OF[rt];
}

/** `financial-settlement` -> `FS`; single word -> first two letters. */
export function featurePrefix(feature: string): string {
  const parts = feature.split(/[-_\s]+/).filter(Boolean);
  if (parts.length === 0) return "X";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return parts.map((p) => p[0]!.toUpperCase()).join("");
}

export interface IdMapEntry {
  readonly key: string; // full sha1 obligation_key
  readonly id: string; // human id, e.g. FS-POST-001
  readonly rule_type: RuleType;
  readonly anchor: string; // source_anchor (for human navigation)
}

export interface Tombstone {
  readonly id: string;
  readonly retired_key: string;
}

export interface IdMap {
  readonly feature: string;
  readonly prefix: string;
  readonly format_version: number;
  readonly entries: readonly IdMapEntry[];
  readonly next: Readonly<Record<string, number>>; // per-class monotone counter
  readonly tombstones: readonly Tombstone[];
}

export function emptyIdMap(feature: string): IdMap {
  return {
    feature,
    prefix: featurePrefix(feature),
    format_version: 1,
    entries: [],
    next: {},
    tombstones: [],
  };
}

export function loadIdMap(path: string, feature: string): IdMap {
  if (!existsSync(path)) return emptyIdMap(feature);
  const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<IdMap>;
  return {
    feature: raw.feature ?? feature,
    prefix: raw.prefix ?? featurePrefix(feature),
    format_version: raw.format_version ?? 1,
    entries: raw.entries ?? [],
    next: raw.next ?? {},
    tombstones: raw.tombstones ?? [],
  };
}

function pad(n: number): string {
  return String(n).padStart(3, "0");
}

export interface AllocationResult {
  readonly map: IdMap; // updated map (entries + next + tombstones)
  readonly idByKey: ReadonlyMap<string, string>;
  readonly allocated: readonly string[]; // ids freshly allocated this run
  readonly tombstoned: readonly string[]; // ids freshly retired this run
}

/**
 * Deterministically allocate human ids for the derived obligations against the
 * previous committed map. Pure given (obligations, prev). Reuses existing ids;
 * allocates next-per-class in sorted-sha1 order; tombstones vanished keys.
 */
export function allocateIds(
  obligations: readonly Obligation[],
  prev: IdMap,
): AllocationResult {
  const prefix = prev.prefix;
  const next: Record<string, number> = { ...prev.next };
  const byKey = new Map<string, IdMapEntry>();
  for (const e of prev.entries) byKey.set(e.key, e);

  const sorted = [...obligations].sort((a, b) =>
    a.obligation_key < b.obligation_key
      ? -1
      : a.obligation_key > b.obligation_key
        ? 1
        : 0,
  );

  const idByKey = new Map<string, string>();
  const entries: IdMapEntry[] = [];
  const allocated: string[] = [];
  const liveKeys = new Set<string>();

  for (const o of sorted) {
    liveKeys.add(o.obligation_key);
    const existing = byKey.get(o.obligation_key);
    if (existing) {
      idByKey.set(o.obligation_key, existing.id);
      entries.push(existing);
      continue;
    }
    const cls = classOf(o.rule_type);
    const n = next[cls] ?? 1;
    const id = `${prefix}-${cls}-${pad(n)}`;
    next[cls] = n + 1;
    entries.push({
      key: o.obligation_key,
      id,
      rule_type: o.rule_type,
      anchor: o.source_anchor,
    });
    idByKey.set(o.obligation_key, id);
    allocated.push(id);
  }

  // Dangling: previous entries whose key no longer derives -> tombstone (id retired,
  // never reused). Existing tombstones are preserved.
  const tombstones: Tombstone[] = [...prev.tombstones];
  const tombstoned: string[] = [];
  const retiredIds = new Set(tombstones.map((t) => t.id));
  for (const e of prev.entries) {
    if (!liveKeys.has(e.key) && !retiredIds.has(e.id)) {
      tombstones.push({ id: e.id, retired_key: e.key });
      tombstoned.push(e.id);
    }
  }

  entries.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  tombstones.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  return {
    map: {
      feature: prev.feature,
      prefix,
      format_version: prev.format_version,
      entries,
      next,
      tombstones,
    },
    idByKey,
    allocated,
    tombstoned,
  };
}

export function serializeIdMap(map: IdMap): string {
  return `${JSON.stringify(map, null, 2)}\n`;
}

export function writeIdMap(path: string, map: IdMap): void {
  writeFileSync(path, serializeIdMap(map), "utf8");
}

/** Drift verdict for read-only `check` mode (no allocation). */
export interface IdDriftReport {
  readonly unmapped: readonly string[]; // obligation keys with no committed id
  readonly dangling: readonly string[]; // committed ids whose key no longer derives
  readonly ok: boolean;
}

export function detectIdDrift(
  obligations: readonly Obligation[],
  committed: IdMap,
): IdDriftReport {
  const mappedKeys = new Set(committed.entries.map((e) => e.key));
  const liveKeys = new Set(obligations.map((o) => o.obligation_key));
  const unmapped = obligations
    .filter((o) => !mappedKeys.has(o.obligation_key))
    .map((o) => o.obligation_key);
  const dangling = committed.entries
    .filter((e) => !liveKeys.has(e.key))
    .map((e) => e.id);
  return {
    unmapped,
    dangling,
    ok: unmapped.length === 0 && dangling.length === 0,
  };
}
