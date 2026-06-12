---
node_type: refinement-stage
role: E1 Determinism Attacker
created: 2026-06-12
---

# E1 Determinism Attacker — Adversarial Critique

**Target:** E1 (Derivation Determinism), backing paper claim C2 ("same spec → same tests", §5.1).
**Stance:** Radically candid. The job is to find every way E1 is wrong, underspecified, or unrunnable — and to reframe it given the operator's decision that the END STATE is a fully deterministic engine (no LLM in the derivation path).

**Sources read:**

- `docs/research/experiments/E1-derivation-determinism.md`
- `docs/research/EXPERIMENTS.md` (execution rules + metadata schema)
- `.agents/skills/domainspec-generate-tests/SKILL.md`
- `.claude/agents/domainspec-test-designer.agent.md`
- `domainspec/TEST-PIPELINE.md`, `domainspec/CHANGELOG.md`
- `docs/research/domainspec-paper.md` §5.1 (Definition 4/5), C2 statement (§ claims)
- `docs/features/agent-execution-orchestrator/TEST-SPEC.md` (a real derived artifact, to see what an obligation ID actually is)

---

## 0. The headline contradiction

The paper (§5.1, Def 4) asserts determinism **by mathematical definition**: $T = f(G,\Delta) = \bigcup \delta_i(G)$, "given the same concept graph $G$ and the same rule set $\Delta$, the function produces the identical set of test obligations $T$ on every invocation." It then adds the load-bearing sentence: _"LLM agents execute derivation rules, not stochastic generation."_

That sentence is an **assertion, not a result.** Today the function $f$ is realized entirely by an LLM agent (`domainspec-test-designer`) reading prose docs and the prose rules in `TEST-PIPELINE.md`, then free-typing a markdown table. There is no parser, no graph object $G$, no rule-engine executing $\delta_i$. `G` is a fiction at the implementation layer: the agent never constructs it; it reads `states.md`/`operations.md`/`interfaces.md`/`events.md` as natural language and _interprets_ them. So E1 is being asked to **empirically prove a property the paper already declares true by fiat** — which is exactly the right thing to attack, because if E1 measures the LLM realization, Jaccard < 1.0 is the honest expectation and the paper's "identical on every invocation" is falsified for the as-built system.

This produces a fork E1 never acknowledges:

- **Fork A (as-built, LLM derivation):** E1 measures LLM stability. Expected Jaccard < 1.0. Outcome embarrasses C2.
- **Fork B (deterministic engine, operator's end state):** $f$ is code. Determinism is true by construction; a 10-run Jaccard experiment is theater — you'd assert it with a unit test, not an "experiment." E1 collapses.

E1 as written sits in neither fork cleanly. It uses Fork-B language ("rule set $\Delta$", "concept graph $G$") to describe a Fork-A artifact (an LLM agent), and proposes a Fork-A measurement (10 stochastic runs + Jaccard) whose only honest interpretation contradicts the Fork-B claim it's meant to support. **This is the central defect.** Everything below is detail.

---

## 1. What "same tests" actually means — the success criterion is not well-defined

The protocol says capture "the full list of derived test obligation **IDs, names, and cardinalities**" and compute Jaccard. But Jaccard over _what set_? The criterion is ambiguous across at least four candidate equality notions, and they are wildly different in difficulty:

1. **String-identical test IDs** (e.g., `AEO-BE-OP-046`). Looking at the real artifact `agent-execution-orchestrator/TEST-SPEC.md`, IDs are **hand-numbered sequential counters** (`AEO-BE-OP-010..023`, `..046..051`, `AEO-BE-OBS-00[1-8,10-14,16-19]`). There is **no deterministic ID-assignment algorithm anywhere** in TEST-PIPELINE.md or the agent. Two runs that derive the _same semantic obligations_ will almost certainly assign different numeric suffixes, in different order, with different prefixes. Under this notion Jaccard ≈ low even if the obligations are semantically identical. **This notion is the most literal reading of "IDs" and it guarantees failure for reasons that have nothing to do with the research claim.**

2. **String-identical test names** (e.g., `test("ProcessPayment transitions Created → Processing")`). TEST-PIPELINE gives _templates_, not canonical strings. The agent paraphrases ("rejects zero amount" vs "rejects amount of zero" vs "amount must be > 0"). NL paraphrase variance alone sinks exact-name Jaccard.

3. **Cardinality equality** (|T| and per-rule `derivation_rules_fired` counts match). Weaker; two runs can hit |T|=113 while disagreeing on _which_ 113. Necessary, not sufficient.

4. **Obligation-SEMANTIC-set equality** (two obligations are "the same" iff they bind the same `(source-clause, rule-type, parameterization)` regardless of ID string or name phrasing). This is the **only notion that actually tests the research claim** — that the _derivation_ is determined by the spec, independent of cosmetic LLM choices.

E1 picks none of these explicitly. "IDs, names, and cardinalities" reads like notion (1)+(2), which is the **wrong target** and is unachievable under an LLM for cosmetic reasons. **Verdict: the success criterion is not well-defined and, on its most literal reading, is unsatisfiable for reasons orthogonal to C2.**

### Proposed precise definition

Define a **canonical obligation key** independent of cosmetics:

```
obligation_key = sha1(
  normalize(source_anchor)      # e.g. "states.md#paymentstatus::row(Created,ProcessPayment,Processing)"
  + "|" + rule_type             # one of TEST-PIPELINE's 20 rule classes, e.g. "STATE_TRANSITION_HAPPY"
  + "|" + canonical_params      # sorted, lowercased bound parameters (From,Event,To / Rule field+invalid value / endpoint×status)
)
```

- A run's output = the **set** of obligation_keys (order-free, ID-free, name-free).
- **Primary metric:** mean pairwise Jaccard over obligation_key sets across the 10 runs.
- **Report separately** (do NOT fold into the headline): exact-ID Jaccard, exact-name Jaccard, |T| variance. These measure _cosmetic_ stability and are interesting but must not gate the C2 claim.
- Determinism of the **derivation** = obligation_key-set Jaccard. Determinism of the **artifact** = ID/name Jaccard. C2 is about the former.

This requires the team to first specify the `source_anchor` and `canonical_params` extraction for each of the 20 rules — which is itself most of the work of building the deterministic engine (see §4).

---

## 2. Required controls for ANY determinism claim under an LLM generator — almost all missing

`EXPERIMENTS.md` requires per-run metadata (`model`, `model_temperature: 0`, `system_prompt_hash`, `domainspec_version`). Good in principle; insufficient and partly unenforced in practice. For a determinism claim under an LLM you need ALL of:

| Control                                      | Required because                                                                                                                                                                                                                                                                           | E1 status                                                                                                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **temperature = 0**                          | non-zero temp guarantees variance                                                                                                                                                                                                                                                          | EXPERIMENTS.md sets `0` in the schema, but E1's protocol never states it, and temp=0 ≠ determinism (see §3)                                                                                                                                  |
| **top_p / top_k / seed pinned**              | temp=0 still leaves tie-breaking + provider nondeterminism                                                                                                                                                                                                                                 | **absent** — schema has no decoding params or seed field                                                                                                                                                                                     |
| **exact model+provider version pin**         | `claude-sonnet-4-20250514` style alias can be silently re-pointed; provider-side kernels are non-deterministic                                                                                                                                                                             | partially (model id in schema), but no provider/region/endpoint pin                                                                                                                                                                          |
| **system_prompt_hash over the FULL closure** | the "system prompt" is not one file. It is SKILL.md + agent.md + **TEST-PIPELINE.md + CHANGELOG.md + the 4 feature docs**. CHANGELOG is a _mandatory initial read_ per the agent, and the agent says "use latest test-pipeline clarifications" — so any CHANGELOG edit changes derivation. | **major gap** — schema has a single `system_prompt_hash`; it must be a hash of the **transitive input closure** (skill+agent+TEST-PIPELINE+CHANGELOG+states+operations+interfaces+events), pinned by content hash, or runs aren't comparable |
| **tool nondeterminism control**              | the agent has `Bash, Glob, Grep` (and even `WebFetch, WebSearch, Task` in the agent file!). Glob ordering, file mtimes, `Grep` result order, and especially **WebSearch/WebFetch** inject uncontrolled external state into derivation                                                      | **blocker** — an agent that can `WebSearch` mid-derivation cannot be claimed deterministic; these tools must be stripped for E1                                                                                                              |
| **obligation ordering**                      | "ordered list of derived test IDs" in the schema implies order matters; Jaccard is order-free but ID-numbering depends on emission order                                                                                                                                                   | **contradiction** — schema stores ordered list but determinism should be order-invariant; pick set semantics and say so                                                                                                                      |
| **fresh-session enforcement mechanism**      | claimed ("each in a fresh agent session") but no mechanism, no proof of no-carryover, no prompt-cache disable                                                                                                                                                                              | **unspecified** — prompt caching alone can make run N depend on run N-1                                                                                                                                                                      |
| **doc immutability during the run window**   | 10 runs over hours; if any feature doc or CHANGELOG is touched, $G$/$\Delta$ changed mid-experiment                                                                                                                                                                                        | **unspecified** — needs a frozen git SHA for the whole input closure, recorded per run                                                                                                                                                       |

**Verdict:** the control set is roughly half-specified and contains an active blocker (search/fetch tools enabled on the derivation agent).

---

## 3. Is Jaccard = 1.0 achievable under an LLM at all? — No; the criterion is aspirational

Even with temperature=0, top_p=1, and a pinned model, **production LLM inference is not bitwise deterministic**: floating-point non-associativity across GPU kernels, dynamic batching, MoE expert routing, and provider-side load balancing produce token-level divergence run-to-run. Empirically, temp=0 chat completions on the same prompt drift on a non-trivial fraction of moderately long generations — and a 113-row TEST-SPEC is a _long, highly structured_ generation where a single early divergence cascades (one extra/missing row shifts all downstream hand-numbered IDs).

So under the **as-built LLM** realization:

- **Exact-ID / exact-name Jaccard = 1.0 over 10 runs is effectively unachievable.** Honest expected distribution: high but < 1.0, with a long tail of cosmetic deviations (renamed tests, renumbered IDs, ±1–3 obligations from the "every state×event NOT in table" rule, see §6).
- **obligation_key-set Jaccard (§1)** could plausibly reach ~0.9–0.98 with a disciplined prompt, but **1.0 is still aspirational**, because the LLM's interpretation of underspecified rules (negative-transition enumeration, "1+ tests", "at least 2 tests") is a genuine free choice.

**The criterion "Jaccard = 1.0 (perfect determinism)" is therefore aspirational, not a realistic pass bar for an LLM generator.** Stating it as the success criterion sets E1 up to either (a) fail honestly and undercut C2, or (b) be quietly relaxed/p-hacked. Both are bad. The honest move is to **report the distribution** and reserve "= 1.0" for the deterministic engine (Fork B), where it is true by construction and therefore not worth an experiment.

---

## 4. Once the engine is FULLY deterministic — E1 collapses; reframe it

The operator's end state is a deterministic engine: `parse(feature_docs) → G`, then `Δ(G) → T`, in code. In that world:

- **δ is deterministic by construction.** Same bytes in → same `T` out, every time, byte-for-byte. Proving this is a **unit test / property test**, not a research experiment: `assert derive(docs) == derive(docs)` and a property test `∀ docs: derive(docs) == derive(docs)`. Jaccard=1.0 is a tautology. There is no "stochastic baseline" to beat because there is no stochasticity. **E1-as-determinism-experiment evaporates.**

- **The real residual research question moves upstream, to the only non-deterministic stage that remains: EXTRACTION / PARSER STABILITY.** The deterministic engine is only as deterministic as its input graph $G$. Building $G$ from human-written markdown (`states.md` transition tables, `operations.md` rule prose, etc.) is where ambiguity, malformed tables, and underspecified clauses live. The honest C2 experiment becomes:

  1. **Parser determinism (trivial, by construction):** `parse(docs)` is pure → `G` identical. Property test, not experiment.
  2. **Extraction completeness & robustness (the real question):** Across N real, messy feature doc sets, does the parser extract the _intended_ obligations? Measure: (a) **recall** of obligations vs a human-annotated gold set (did it miss a transition / invariant / rule?), (b) **graph stability under benign edits** — reorder table rows, reformat whitespace, rename a markdown header → does $G$ (and thus $T$) stay invariant where it should, and change _only_ where the semantics changed? (c) **failure transparency** — when a doc section is malformed/underspecified, does the engine _deterministically reject/flag_ (per SKILL step 5 "Report missing formal sections") rather than silently guess?
  3. **Rule-coverage determinism:** every TEST-PIPELINE rule (1–20) fires deterministically given the presence/absence of its source section.

So C2's empirical content, post-engine, is **not** "is δ deterministic" (yes, trivially) but **"is the spec→G extraction stable, complete, and transparently-failing across real docs."** That is a parser/robustness study, and it's where the interesting threats actually are.

---

## 5. The "bare LLM control" — under-designed; establishes little as written

The control: run the 3 features with `"write tests for this feature spec"` 10×, measure Jaccard, "establishes the stochastic baseline."

Problems:

- **Confounds prompt scaffolding with the framework.** The treatment agent gets TEST-PIPELINE's 20 explicit rules, traceability format, templates, and CHANGELOG constraints. The control gets a one-line prompt. A Jaccard gap then conflates _"DomainSpec rules add determinism"_ with _"any detailed prompt adds determinism."_ The real control should be **same model, same temp, same feature docs, but a generic detailed test-writing prompt without the DomainSpec rule set** — isolating the _rules_, not "prose vs no prose."
- **Output format mismatch makes Jaccard incomparable.** Bare LLM emits arbitrary test names/structure; treatment emits structured TEST-SPEC rows. You cannot compute a meaningful Jaccard across two different output ontologies. The control needs the **same obligation_key normalization (§1)** applied, or the numbers aren't on the same axis.
- **"Establishes the stochastic baseline" of what population?** With temp=0 the control is _also_ partly stable (cosmetically less, but not random). With temp>0 it's measuring temperature, not "freeform LLM." The baseline's temperature must match the treatment's, or it's measuring the wrong variable.
- **No ground-truth coverage axis.** A control that is _stable but wrong_ (deterministically writes the wrong tests) would "win" on Jaccard. Determinism without a correctness/coverage axis is vacuous — a function returning `[]` always scores Jaccard=1.0. **E1 has no coverage/correctness gate at all**, so a degenerate-but-stable run passes. This is a real hole (E2/E3 cover coverage, but E1's pass criterion in isolation is gameable).

**Verdict:** the control as written demonstrates "DomainSpec output is more repeatable than an unstructured one-liner," which is a weak, partly-tautological claim, and isn't even cleanly measurable due to format mismatch.

---

## 6. Missing steps / unrunnable-as-written

- **The three named features do not exist.** E1 names `auth-access-control` (12 concepts), `player-management` (14), `financial-settlement` (18). Reality in this repo:
  - `player-management` and `financial-settlement`: **do not exist anywhere** (only a stray `player-management-full-index.json` data file).
  - `auth-access-control`: exists **only as a demo fixture** under `.data/poker-team-demo-features/auth-access-control/`, and it has **only `SPEC.md`, `domain.md`, `operations.md`** — it is **missing `states.md`, `interfaces.md`, `events.md`**, which are the _exact_ inputs the SKILL and agent require. The pipeline would hit step 5 "report missing formal sections" and derive a partial catalogue.
  - The concept counts (12/14/18) are **unverifiable** against any artifact. **E1 is literally unrunnable on its stated inputs.** This is a blocker. The real, fully-specified features available are `payment-processing` (the reference example, has all 8+ docs) and `agent-execution-orchestrator` (has a full TEST-SPEC already). E1 must be re-pointed at features that exist with the required formal docs.
- **No obligation-ID capture/normalization procedure.** Schema says `test_obligations: string[]` "ordered list of derived test IDs" but never says how to extract them from the markdown TEST-SPEC, how to normalize, or how to handle the hand-numbered IDs (§1). Without a parser for the _output_ TEST-SPEC.md, there is no data pipeline.
- **No Jaccard computation spec.** "Pairwise Jaccard between all 10 runs" — pairwise mean? min? matrix? Over which set (IDs? keys?)? No tool, no formula, no aggregation rule. Undefined metric.
- **Fresh-session enforcement is named but not mechanized.** No statement on prompt-cache disabling, no session-id provenance check, no proof of no-carryover.
- **`derivation_rules_fired` requires the agent to self-report rule firings** — but the agent doesn't currently emit a per-rule firing count; TEST-SPEC has a traceability index, not a `δ_i → count` ledger. This column has no source.
- **CHANGELOG drift is uncontrolled and high-impact.** The agent MUST read CHANGELOG.md and "use latest test-pipeline clarifications." CHANGELOG is edited frequently (it's at 2.1.0, dozens of entries). Any edit between runs silently changes $\Delta$. E1 must pin the CHANGELOG content hash into the input closure and freeze it.
- **Underspecified TEST-PIPELINE rules guarantee LLM free-choice variance**, independent of model nondeterminism:
  - Rule 2: "for every state × event combination NOT in the Transition Table, generate a rejection test" — requires the LLM to **enumerate the full state×event Cartesian product and subtract** the valid set. This is precisely the kind of combinatorial enumeration LLMs do inconsistently; expect ±k obligations across runs.
  - "Each rule = **at least** 2 tests", "Each calculation row = **1+** tests", "tests for: correct output shape, filtering, authorization, empty results" — open-ended cardinalities mean the _count itself is a free choice_. Determinism is undefined when the rule says "at least."
    These are **rule ambiguities** (E1's own deviation category (a)) baked into the spec; under an LLM they will fire as deviations. Under the deterministic engine they must be resolved to **exact** cardinalities or the engine can't be written.

---

## 7. Severity-ranked threats + concrete fixes

| #   | Threat                                                                                                                                                                               | Severity    | Concrete fix                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | E1 measures an **LLM** but the claim asserts determinism by construction; the only honest LLM result (<1.0) contradicts C2. Category confusion between Fork A and Fork B.            | **BLOCKER** | Split E1 into E1a (LLM-stability characterization, descriptive, no 1.0 bar) and E1b (deterministic-engine property test). Stop claiming Def-4 determinism for the LLM realization in the paper until E1b's engine exists.                    |
| T2  | Named features (`player-management`, `financial-settlement`) **don't exist**; `auth-access-control` exists only as a demo and lacks `states/interfaces/events.md`. E1 is unrunnable. | **BLOCKER** | Re-point E1 to features that exist with full formal docs: `payment-processing` and `agent-execution-orchestrator`; add a third only after authoring its full doc set. Verify concept counts against `domain.md`/`SPEC.md` before publishing. |
| T3  | Success criterion ("Jaccard=1.0 over IDs+names") is **ill-defined and unsatisfiable** for cosmetic reasons (hand-numbered IDs, NL paraphrase).                                       | **BLOCKER** | Adopt the **obligation_key** definition (§1). Make obligation_key-set Jaccard the only gating metric; demote ID/name Jaccard to descriptive.                                                                                                 |
| T4  | Derivation agent has **WebSearch/WebFetch/Task/Glob/Grep/Bash** — external + ordering nondeterminism in the derivation path.                                                         | **BLOCKER** | For E1, run with a minimal tool set (Read/Write only) and explicitly forbid network tools. Pin Glob ordering. Record the exact tool allow-list per run.                                                                                      |
| T5  | Jaccard=1.0 is **aspirational** under any LLM (provider-level nondeterminism even at temp=0).                                                                                        | **MAJOR**   | Replace "=1.0" with "report mean/min pairwise obligation_key Jaccard + deviation taxonomy." Reserve =1.0 for the engine.                                                                                                                     |
| T6  | `system_prompt_hash` covers one file, not the **input closure** (skill+agent+TEST-PIPELINE+CHANGELOG+4 feature docs). CHANGELOG drift uncontrolled.                                  | **MAJOR**   | Define `input_closure_hash = sha256(concat(sorted(all input files)))`, pin a frozen git SHA for the whole closure, record per run, abort if any file changes mid-experiment.                                                                 |
| T7  | No Jaccard computation spec, no obligation-extraction/normalization pipeline, no `derivation_rules_fired` source.                                                                    | **MAJOR**   | Write a deterministic post-processor that parses TEST-SPEC.md → obligation_key set + per-rule counts; specify pairwise-mean Jaccard; emit JSONL per `EXPERIMENTS.md`.                                                                        |
| T8  | Bare-LLM control confounds "rules" with "any detailed prompt"; format mismatch makes Jaccard incomparable; no coverage axis.                                                         | **MAJOR**   | Control = same model/temp/docs + generic _detailed_ test prompt minus DomainSpec rules; apply same obligation_key normalization; add a ground-truth coverage gate so stable-but-empty/wrong outputs can't pass.                              |
| T9  | TEST-PIPELINE rules use **"at least"/"1+"/Cartesian-subtraction** — open cardinalities = undefined determinism even with a perfect generator.                                        | **MAJOR**   | Resolve every rule to an **exact** count and an explicit enumeration algorithm before the engine is built; this is a prerequisite for both E1b and the engine.                                                                               |
| T10 | Fresh-session/no-carryover and prompt-cache are named but not mechanized.                                                                                                            | **MINOR**   | Disable prompt caching; record session ids; add a carryover canary (a unique marker that must NOT appear in run N+1).                                                                                                                        |
| T11 | Schema stores an **ordered** obligation list while determinism should be order-invariant.                                                                                            | **MINOR**   | Store as a set for the metric; keep order only as descriptive metadata.                                                                                                                                                                      |
| T12 | E1 lists 3 deviation root-cause categories but no rubric/operationalization for assigning them.                                                                                      | **MINOR**   | Provide a decision tree: rule-ambiguity (traces to an "at least"/enumeration rule) vs hallucination (no source anchor) vs graph-interpretation (wrong source anchor).                                                                        |

---

## REFRAMED E1 (runnable)

Given the operator's deterministic-engine target, **split E1 and move its center of gravity upstream to parser/extraction stability**, because that is the only stage that remains non-trivial.

**E1b — Deterministic Derivation Property (the engine claim, Fork B).** Once `derive(docs) = Δ(parse(docs))` is code: assert it with a property test, not an experiment — `∀ feature_docs ∈ corpus: derive(docs) == derive(docs)` byte-for-byte, plus a rule-coverage table proving every TEST-PIPELINE rule (1–20) fires exactly per its source section, with all "at least/1+/Cartesian" cardinalities resolved to exact algorithms. Jaccard=1.0 is true by construction; no stochastic baseline needed.

**E1a — Extraction Stability & Completeness (the real residual research question).** On a corpus of _real_ features that have the full formal doc set (`payment-processing`, `agent-execution-orchestrator`, +1 to be authored), measure three things the engine cannot guarantee for free: (1) **obligation_key-set Jaccard ≥ τ across N runs of the current LLM derivation** (descriptive characterization of the as-built system, with a deviation taxonomy — _not_ a 1.0 bar); (2) **graph invariance under benign doc edits** (row reorder / whitespace / header rename must leave $G$ and $T$ unchanged; semantic edits must change them predictably); and (3) **completeness vs a human-annotated gold obligation set** (recall of intended obligations) plus **transparent failure** on malformed/underspecified sections. The input closure (skill + agent + TEST-PIPELINE + CHANGELOG + the four feature docs) is content-hash-pinned to a frozen git SHA, network tools are forbidden, and equality is computed over cosmetic-free `obligation_key` sets — with exact-ID/name Jaccard reported only as secondary cosmetic-stability signals.
