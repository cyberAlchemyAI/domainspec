import { describe, expect, it } from "vitest";
import type { Obligation, RuleType } from "../ir/types.js";
import {
  allocateIds,
  classOf,
  detectIdDrift,
  emptyIdMap,
  featurePrefix,
} from "./human-id.js";

function ob(
  key: string,
  rule_type: RuleType,
  anchor = "operations.md#X",
): Obligation {
  return {
    obligation_key: key,
    rule_type,
    source_anchor: anchor,
    canonical_params: {},
    description: `ob ${key}`,
  };
}

describe("featurePrefix", () => {
  it("initials for hyphenated names", () => {
    expect(featurePrefix("financial-settlement")).toBe("FS");
    expect(featurePrefix("test-derivation-engine")).toBe("TDE");
  });
  it("first two letters for single word", () => {
    expect(featurePrefix("settlement")).toBe("SE");
  });
});

describe("classOf", () => {
  it("maps rule types to short class codes", () => {
    expect(classOf("postcondition")).toBe("POST");
    expect(classOf("calculation")).toBe("CALC");
    expect(classOf("needs-formal")).toBe("NF");
  });
});

describe("allocateIds", () => {
  const prev = emptyIdMap("financial-settlement");

  it("allocates deterministic per-class ids in sorted-sha1 order", () => {
    const obs = [
      ob("cccc", "calculation"),
      ob("aaaa", "postcondition"),
      ob("bbbb", "calculation"),
    ];
    const r = allocateIds(obs, prev);
    // sorted-sha1: aaaa(POST), bbbb(CALC), cccc(CALC)
    expect(r.idByKey.get("aaaa")).toBe("FS-POST-001");
    expect(r.idByKey.get("bbbb")).toBe("FS-CALC-001");
    expect(r.idByKey.get("cccc")).toBe("FS-CALC-002");
    expect(r.allocated.length).toBe(3);
  });

  it("is idempotent: re-allocating reuses ids, allocates none", () => {
    const obs = [ob("aaaa", "postcondition"), ob("bbbb", "calculation")];
    const first = allocateIds(obs, prev);
    const second = allocateIds(obs, first.map);
    expect(second.allocated.length).toBe(0);
    expect(second.idByKey.get("aaaa")).toBe(first.idByKey.get("aaaa"));
    expect(second.idByKey.get("bbbb")).toBe(first.idByKey.get("bbbb"));
  });

  it("never reuses an id: removed obligation -> tombstone, new gets next counter", () => {
    const first = allocateIds(
      [ob("aaaa", "calculation"), ob("bbbb", "calculation")],
      prev,
    );
    expect(first.idByKey.get("aaaa")).toBe("FS-CALC-001");
    expect(first.idByKey.get("bbbb")).toBe("FS-CALC-002");
    // drop aaaa, add cccc
    const second = allocateIds(
      [ob("bbbb", "calculation"), ob("cccc", "calculation")],
      first.map,
    );
    expect(second.tombstoned).toContain("FS-CALC-001"); // aaaa retired
    expect(second.idByKey.get("bbbb")).toBe("FS-CALC-002"); // stable
    expect(second.idByKey.get("cccc")).toBe("FS-CALC-003"); // NOT 001 (never reused)
    expect(second.map.tombstones.some((t) => t.id === "FS-CALC-001")).toBe(
      true,
    );
  });
});

describe("detectIdDrift", () => {
  const prev = emptyIdMap("financial-settlement");
  const base = allocateIds(
    [ob("aaaa", "calculation"), ob("bbbb", "postcondition")],
    prev,
  ).map;

  it("ok when obligations match the committed map", () => {
    const d = detectIdDrift(
      [ob("aaaa", "calculation"), ob("bbbb", "postcondition")],
      base,
    );
    expect(d.ok).toBe(true);
  });
  it("flags an unmapped new obligation", () => {
    const d = detectIdDrift(
      [
        ob("aaaa", "calculation"),
        ob("bbbb", "postcondition"),
        ob("zzzz", "calculation"),
      ],
      base,
    );
    expect(d.unmapped).toContain("zzzz");
    expect(d.ok).toBe(false);
  });
  it("flags a dangling id when an obligation disappears", () => {
    const d = detectIdDrift([ob("aaaa", "calculation")], base);
    expect(d.dangling).toContain("FS-POST-001");
    expect(d.ok).toBe(false);
  });
});
