---
node_type: refinement-stage
role: E2 Coverage Attacker
created: 2026-06-12
---

# E2 Coverage Attacker — Adversarial Teardown

**Target:** `docs/research/experiments/E2-derivation-vs-manual.md`
**Backed claim:** C2 — "derived tests ≥ manual tests, with higher traceability."
**Verdict:** As written, E2 is **NOT RUNNABLE and NOT CREDIBLE**. It rests on a false feature count, an undisclosed single-tester-is-also-the-author design, a circular traceability metric, count-gaming success criteria, and a derivation step that is an **LLM agent, not the deterministic engine the claim asserts**. Below: the real feature inventory, then severity-ranked threats with fixes, then a reframed runnable E2.

---

## 1. The real feature inventory (the "7 features" assumption)

E2 §Protocol step 1: _"For each of the 7 features..."_. There is no list. I enumerated both candidate locations and checked each for the four formal docs the derivation pipeline requires (`states.md`, `operations.md`, `interfaces.md`, `events.md` per `domainspec-generate-tests/SKILL.md` `<context>`).

### `validation/poker-team/docs/features/` — the real corpus

| Feature                 | states | operations | interfaces | events | Qualifies? |    TEST-SPEC.md present?     |
| ----------------------- | :----: | :--------: | :--------: | :----: | :--------: | :--------------------------: |
| auth-access-control     |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   | ⚠️ YES (D already committed) |
| financial-settlement    |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   |            ⚠️ YES            |
| player-makeup           |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   |            ⚠️ YES            |
| player-management       |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   |            ⚠️ YES            |
| player-onboarding       |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   |            ⚠️ YES            |
| player-progression      |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   |            ⚠️ YES            |
| player-stats            |   ✅   |     ✅     |     ✅     |   ✅   |  **YES**   |            ⚠️ YES            |
| domainspec-coverage     |   —    |     —      |     —      |   —    |     no     |              —               |
| ecosystem-api-expansion |   —    |     —      |     —      |   —    |     no     |              —               |

So **exactly 7 fully-specified features exist** in poker-team. The "7" is arithmetically correct — but only by coincidence with this one project, and the experiment never names them, so the claim is unfalsifiable as written and silently couples E2 to a single validation app authored entirely by one person.

### `implementation/domainspec/docs/features/` — NOT a valid corpus

Only **2 of 10** here have all four docs (`knowledge-graph-visualization`, `payment-processing`); the rest are missing 1–4 sections (e.g., `gitops-assessment`, `agent-skill-categorization`, `inventory-interface-indexing` have **none**; `tower-explorer`/`agent-execution-orchestrator` lack `states.md`+`events.md`; `goldenquill-promotion-governance` lacks `interfaces.md`). If anyone assumes "the 7 features" live in the implementation repo, **E2 is an immediate blocker** — only 2 qualify.

**Provenance check:** all 39 commits touching `poker-team/docs/features/` are authored by `vrondelli` — the DomainSpec author. There is no independent author for the specs OR the tests.

---

## 2. CONTAMINATION — the derived set D already exists and has been seen

**This is the single most disqualifying finding.** All 7 qualifying features **already contain a committed `TEST-SPEC.md`** (the derived set D), authored by the operator (commit `8dea8b4`, 2026-04-30, `status: implemented`). The protocol says the human writes a plan _"without seeing derived tests"_ — but the operator who would be the tester already authored, reviewed, and committed D weeks ago. Blinding is **impossible by retrospective construction**. Any "manual" plan M written now is anchored on D the author already memorized. There is no clean-room condition left in this corpus.

---

## 3. Threats, severity-ranked

### BLOCKERS

**B1 — "Deterministic derivation" is a lie; D is produced by an LLM agent.**
E2 §Claim and §C2 say _"Deterministic derivation produces..."_. But `domainspec-generate-tests/SKILL.md` declares `agent: domainspec-test-designer` (an LLM agent: `.claude/agents/domainspec-test-designer.agent.md`). `TEST-PIPELINE.md` provides deterministic _rules_, but execution is a model interpreting them — not the fully deterministic engine the operator's end goal envisions. So E2 as written measures **LLM-agent output vs human**, then mislabels it "deterministic." E1 (determinism) is what would license the word "deterministic"; E2 must not pre-assume E1's conclusion.
_Fix:_ State explicitly which derivation surface is under test (LLM agent `domainspec-test-designer` @ pinned model/version, or a future deterministic engine). Record `model`, `model_temperature`, `system_prompt_hash`, `domainspec_version` per run (EXPERIMENTS.md already mandates this metadata — E2 ignores it). If the operator's goal is the engine, add a row distinguishing "agent-derived D_llm" from "engine-derived D_engine"; the C2 claim should ultimately rest on D_engine.

**B2 — D already committed → blinding is impossible in this corpus.** (See §2.)
_Fix:_ Either (a) run E2 on a **fresh, never-before-spec'd corpus** the tester has not authored, or (b) recruit an **independent tester** who has not seen the repo. Quarantine existing `TEST-SPEC.md` files out of the tester's checkout. Without one of these, E2 produces no admissible evidence.

**B3 — Single tester = author = DomainSpec creator → total experimenter bias, n=1, no inter-rater reliability.**
The likely tester is `vrondelli`, who authored the specs, the tests, the pipeline, AND DomainSpec itself. Motivated reasoning is maximal; the manual plan can be unconsciously down-written to lose. n=1 means no inter-rater reliability and no variance estimate. Time-box of 30 min is unjustified and, set by the same person, can be tuned to handicap M.
_Fix:_ ≥3 independent testers (not the author), each blind to D, drawn from people who know testing but not DomainSpec. Pre-register the 30-min box with a rationale, or replace with "until the tester declares done" and record actual `human_time_minutes`. Compute inter-rater agreement (Cohen/Fleiss κ) on the D\M / M\D categorization.

### MAJORS

**M1 — `derived_traceable_pct` is ~100% by construction → circular.**
Every TEST-SPEC block carries an explicit `Source: [Operation](operations.md#anchor)` line and per-feature header `> Derived from [SPEC.md]...`. Traceability is _emitted by the generator_, so `derived_traceable_pct > 95%` is true **by definition**, not by measurement. Comparing it to a human who wasn't asked to write links is rigged — the success criterion `manual_traceable_pct < 80%` is a hypothesis engineered to pass. This proves nothing about test _quality_, only that the template includes a citation field.
_Fix:_ Make it a fair comparison: instruct BOTH cohorts to add spec-line references (so the human has the same obligation), OR drop traceability as a "superiority" axis and reframe it as a **capability statement** ("derivation emits machine-checkable spec links; manual authoring does not unless prompted"). Add a _correctness_ check: an independent rater verifies each derived link actually resolves to a line that licenses the test (catch hallucinated/mismatched `Source:` anchors) — % _valid_ links, not % _present_ links.

**M2 — `|D| ≥ |M|` is a weak, gameable claim; more tests ≠ better tests.**
Count superiority is trivially achievable by emitting one test per table row (TEST-PIPELINE rule "every row = 1 test"), inflating |D| with near-duplicate rows (e.g. RV-2/RV-3/RV-4 are the same "required field" rule three times). A higher count can mean _more redundancy_, not more coverage. The claim is meaningless without an effectiveness tie-in.
_Fix:_ Demote |D|≥|M| to a secondary descriptive stat. Make the **load-bearing** metric fault detection via **E3 (mutation testing)**: report mutation score of D vs M vs combined on the same domain code. C2's real form is "D kills ≥ as many mutants as M, at equal or better traceability," not "D has more rows." Also report **distinct-behavior coverage** (dedup tests by the spec element they exercise) so count-gaming is visible.

**M3 — D\M / M\D categorization has no rubric → subjective and author-judged.**
`derived_unique` / `manual_unique` are typed as "categorized" string arrays and the success criterion demands "≥1 non-trivial test category per feature (negative state transitions, idempotency...)" — but there is no defined category taxonomy, no rule for when two differently-worded tests are "the same" (set-difference requires an equivalence relation), and no independent judge. The author both produces D and adjudicates whether D\M is "non-trivial."
_Fix:_ Publish a category taxonomy (e.g., {happy-path transition, negative transition, invariant, calculation, postcondition, contract, idempotency, event-flow, error-state}) keyed to TEST-PIPELINE test types. Define test-equivalence: two tests are equal iff they bind the same (spec-element, condition class). Have ≥2 independent raters classify; report κ. Pre-register what counts as "non-trivial."

**M4 — Missing protocol scaffolding (rubric docs, blinding protocol, JSONL, metadata).**
EXPERIMENTS.md §Data Integrity requires: ground-truth rubric documented alongside data (E2 named explicitly), append-only JSONL in `data/`, fresh isolated session, and per-point metadata (model, temperature, prompt hash, version, operator). E2's file specifies **none** of these — no rubric file path, no JSONL schema instance, no blinding SOP, no session-isolation note. It is under-specified relative to the repo's own governance.
_Fix:_ Add to E2: (a) `rubric.md` for categorization + traceability-validity; (b) `data/E2-runN.jsonl` schema with one row per (feature, tester); (c) a written blinding SOP (quarantine D, separate checkout, tester onboarding script); (d) the mandated metadata block per row.

### MINORS

**M5 — Corpus is one domain (online-poker back-office), one author, one language (TS).** External validity is nil; "≥6/7 features" is 7 features of _one app_. _Fix:_ note as a scoped result; cross-reference E6 (vocabulary) and plan a second-domain replication before the paper generalizes.

**M6 — Overlap metric `|D∩M|/|D∪M|` (Jaccard) depends entirely on the undefined equivalence relation from M3.** _Fix:_ fold into M3's equivalence definition; report the matching procedure.

**M7 — Success thresholds (>95%, <80%, ≥6/7) are unjustified round numbers chosen by the proponent.** _Fix:_ pre-register thresholds with rationale, or report effect sizes and let the reader judge.

---

## 4. Engine vs LLM — explicit clarification for the operator

The operator's stated end goal is a **fully deterministic derivation engine**. E2 today silently tests an **LLM agent**. These are different objects with different epistemic status:

- If C2 is meant to support _the engine_, E2-on-LLM-agent is the **wrong instrument** and at best a lower bound.
- If C2 is meant to support _the current agent pipeline_, the word "deterministic" must be struck until E1 establishes it.
  Pick one. The reframed E2 below makes the surface-under-test an explicit parameter.

---

## REFRAMED E2 (runnable)

**Title:** Derivation vs Manual Coverage — Effectiveness-Anchored, Blinded.

**Surface under test (declare explicitly):** `D_agent` = output of `domainspec-test-designer` LLM agent at pinned model + temperature 0 + system-prompt hash + `domainspec_version`. (Add `D_engine` lane when the deterministic engine exists; C2's strong form rests on `D_engine`.)

**Corpus:** the 7 fully-specified poker-team features (auth-access-control, financial-settlement, player-makeup, player-management, player-onboarding, player-progression, player-stats) — _named explicitly_. Existing `TEST-SPEC.md` (D) are **quarantined** from every tester's checkout.

**Testers:** ≥3 independent testers, none being the DomainSpec author; each blind to D and to each other. Onboard from the same spec docs only.

**Protocol:**

1. Each tester writes a test plan M from the 4 formal docs; both cohorts are instructed to add spec-line references (fair traceability). Record actual `human_time_minutes` (no handicapping box, or a pre-registered box with rationale).
2. Regenerate D in a fresh isolated session; capture all mandated metadata to `data/E2-runN.jsonl`.
3. Two independent raters apply a published `rubric.md`: a fixed category taxonomy + a test-equivalence relation (same spec-element × condition-class) to compute D∩M, D\M, M\D; report Cohen/Fleiss κ.
4. Validate traceability _correctness_ (does each `Source:` anchor actually license the test?), not mere presence.

**Primary (load-bearing) metric — via E3:** mutation score of D vs M vs combined on the same backend domain code. **C2 passes iff D kills ≥ as many mutants as M.**
**Secondary (descriptive):** distinct-behavior coverage (dedup'd), |D| vs |M|, Jaccard overlap, % _valid_ traceability links per cohort, D\M non-trivial categories (per published taxonomy).

**Success criteria (pre-registered, effect-size-reported):**

- D mutation score ≥ M mutation score on ≥6/7 features (primary).
- D distinct-behavior coverage ≥ M (dedup'd), so count-gaming cannot carry the claim.
- D valid-traceability ≥ M; report the gap as a capability difference, not a rigged inequality.
- Inter-rater κ ≥ 0.6 on categorization (else the comparison is too subjective to report).

**Artifacts required before run:** `rubric.md`, `data/E2-runN.jsonl` schema, blinding SOP, per-row metadata block — all currently missing.
