# Stage Receipt — Skeptic (Interrogation / antithesis, bounded research)

- agentId ad90bc3586c81173e · verdict: **pass** · external pass.

## Attack points

| #   | Claim                                                                                                                                                     | Source                               | Strength           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------ |
| 1   | Review is **relocated, not reduced** — spec-first moves the review point upstream; someone must still confirm the spec matches intent                     | valuetransform; arxiv 2603.17399     | Strong (inference) |
| 1b  | Effective spec/requirements review is **expensive** and needs reviewer diversity                                                                          | valuetransform; Jama; QRA            | Strong             |
| 2   | **Circularity of error:** an LLM that misreads intent treats faulty logic as intended and generates tests that confirm it → false green-test confidence   | arxiv 2410.21136                     | Very strong        |
| 2b  | **Quantified:** LLM oracle accuracy 53.64% best case; 47.78% with thin context (≈ coin flip at encoding intended-vs-implemented behavior)                 | arxiv 2601.05542                     | Very strong        |
| 3   | **Automation complacency:** AI code gets _reduced visual attention_ + raised confidence (eye-tracking); automation-bias = humans miss automation failures | arxiv 2208.14613; PMC3240751         | Strong             |
| 4   | **Adoption friction:** formal/spec-first methods have decades of low adoption (informal→formal translation is the key barrier)                            | cofer2013fmics; Garavel/terBeek 2020 | Strong             |
| 5   | **Measurement gap:** no controlled study shows spec-first AI dev reduces escaped intent bugs; claim unfalsified for Arcanum                               | search yielded only advocacy         | Strong (absence)   |

## Most damaging objection

**The tools are LLM-driven; an LLM that misreads intent in code misreads it identically when authoring the spec/definitions/derived tests** — so derived tests ratify the _implemented_ (wrong) behavior at ~coin-flip rate, manufacturing false green-test confidence that, by automation bias, makes the human review **less**. Net effect on escaped intent bugs is plausibly **positive (worse)**. The spec→test "engine" is a prompt, not a compiler — no independent semantic ground truth (matches prior-run R1).

## Conditions under which the claim survives (steel-man)

1. **Humans author/hard-correct the spec/definitions, not the LLM** — breaks the circularity (load-bearing).
2. Derived tests draw on intent context **independent of the implementation** (spec artifact, never round-trip through generated code).
3. Relocation is **net-favorable** — true when one spec fans out to large/repeated implementations (amortization); false for one-off small changes.
4. decision-gate/audit tuned to **increase friction** at intent-critical points (counter automation bias), not add reassurance.
5. Benefit restated honestly as **"review relocated + made legible/auditable, NOT reduced."**

## Bottom line

"Meaningfully _reduce_ human review" is the indefensible word. Evidence supports at most "**relocate and structure** intent review," and even that only when humans own the spec ground truth and tools add friction rather than reassurance.
