// Round-trip test for the SWU-A2 concise seed: terse syntax -> desugar -> the OWNED
// parser -> ConceptGraph. Proves the sugar produces canonical Markdown the engine
// accepts with zero violations and the same Entity/Transition/Invariant nodes a
// hand-written states.md would yield.

import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { desugarConcise } from "./desugar.js";
import { parse } from "../grammar/index.js";

const TERSE = `# the lifecycle of an Account, in terse form
entity Account
Active -Withdraw-> Active | balanceOK | debit
Active -Freeze-> Frozen
inv INV-1: balance never negative | balance >= 0`;

describe("concise desugar -> canonical states.md (round-trip through the owned parser)", () => {
  it("desugars to canonical Markdown the owned parser accepts with no violations", () => {
    const md = desugarConcise(TERSE);
    const dir = mkdtempSync(join(tmpdir(), "concise-"));
    writeFileSync(join(dir, "states.md"), md);

    const { graph, violations } = parse(dir);
    expect(violations).toEqual([]);

    const ofType = (t: string) => graph.nodes.filter((n) => n.type === t);

    expect(ofType("Entity").map((n) => n.fields.name)).toEqual(["Account"]);

    const trans = ofType("Transition");
    expect(trans).toHaveLength(2);
    expect(trans[0]!.fields).toMatchObject({
      entity: "Account",
      from: "Active",
      event: "Withdraw",
      to: "Active",
      guard: "balanceOK",
      effect: "debit",
    });
    expect(trans[1]!.fields).toMatchObject({
      from: "Active",
      event: "Freeze",
      to: "Frozen",
    });

    const inv = ofType("Invariant");
    expect(inv).toHaveLength(1);
    expect(inv[0]!.fields).toMatchObject({
      id: "INV-1",
      text: "balance never negative",
      formal: "balance >= 0",
    });
  });

  it("rejects a statement before any `entity`", () => {
    expect(() => desugarConcise("Active -Go-> Done")).toThrow(/before any/);
  });
});
