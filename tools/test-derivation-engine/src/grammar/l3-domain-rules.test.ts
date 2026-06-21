// L3 — domain.md + rules.md grammar/δ coverage. Validates against two real corpora:
// financial-settlement (poker-team: domain.md only) and agent-execution-orchestrator
// (implementation/domainspec: domain.md + rules.md).

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "./index.js";
import { derive } from "../rules/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FS_DIR = resolve(
  __dirname,
  "../../../../../../validation/poker-team/docs/features/financial-settlement",
);
const AEO_DIR = resolve(
  __dirname,
  "../../../../docs/features/agent-execution-orchestrator",
);

describe("L3 domain.md parsing (financial-settlement)", () => {
  const { graph, violations } = parse(FS_DIR);
  const byType = (t: string) => graph.nodes.filter((n) => n.type === t);
  const obs = derive(graph);
  const ofType = (t: string) => obs.filter((o) => o.rule_type === t);

  it("parses value-object fields into DomainField nodes (no violations)", () => {
    expect(violations).toEqual([]);
    // SettlementResult has 11 fields.
    expect(byType("DomainField").length).toBe(11);
  });

  it("parses the enum vocabulary into an Enum node", () => {
    const enums = byType("Enum");
    expect(enums.length).toBe(1);
    expect(String(enums[0]!.fields.values)).toContain("MAKEUP_APPLIED");
    expect(String(enums[0]!.fields.values)).toContain("PAYOUT");
  });

  it("derives one domain-field obligation per field and one domain-enum obligation", () => {
    expect(ofType("domain-field").length).toBe(11);
    expect(ofType("domain-enum").length).toBe(1);
    // a concrete field obligation reads correctly
    expect(
      ofType("domain-field").some((o) =>
        /SettlementResult\.newMakeup: integer \(non-negative\)/.test(
          o.description,
        ),
      ),
    ).toBe(true);
  });
});

describe("L3 rules.md parsing (agent-execution-orchestrator)", () => {
  const { graph } = parse(AEO_DIR);
  const obs = derive(graph);
  const ofType = (t: string) => obs.filter((o) => o.rule_type === t);

  it("derives policy-decision obligations from decision tables", () => {
    expect(ofType("policy-decision").length).toBeGreaterThanOrEqual(3); // BranchStrategyPolicy has 3 rows
    expect(
      ofType("policy-decision").some((o) =>
        /merge-to-head/.test(o.description),
      ),
    ).toBe(true);
  });

  it("reuses transition δ for rules.md state-machine transition tables", () => {
    // RunStateMachine has 10 transition rows -> valid-transitions include them.
    const valids = obs.filter((o) => o.rule_type === "valid-transition");
    expect(valids.some((o) => /run-started/.test(o.description))).toBe(true);
  });

  it("classifies rules.md invariants/constraints via the existing Formal classifier", () => {
    // I-SM-* + P-* carry Formal cells -> invariant obligations (or needs-formal).
    const fromRules = obs.filter(
      (o) =>
        o.source_anchor.startsWith("rules.md#") &&
        (o.rule_type === "invariant" || o.rule_type === "needs-formal"),
    );
    expect(fromRules.length).toBeGreaterThan(0);
  });
});
