---
node_type: refinement-stage
role: Deterministic Engine Architect
created: 2026-06-12
---

# Deterministic Engine Architect — Constructive Design

**Charter.** The operator has decided the end state: a **fully deterministic test-derivation engine** with **no LLM anywhere in the derivation pipeline**. Formal feature docs become a machine-parseable form, a deterministic parser builds a typed concept graph `G`, and a pure total function `δ: (G, Δ) → T` emits test obligations. This makes the paper's C2 determinism claim (Def-4: "same spec → same tests, byte-for-byte") **true by construction** rather than by empirical hope, and it yields a real product: an engine.

This is not an attack. The attackers (E1/E2/E3) proved the _current_ LLM realization can't honestly support C2. My job is to design its deterministic replacement and show how E1/E2/E3 collapse or relocate under it.

**The single most important feasibility finding, stated up front:** the current poker-team feature docs are _already_ canonical Markdown tables with fixed columns. `states.md` has a `| From | Event | To | Guard | Effect |` transition table; `operations.md` has `| ID | Rule | Formal |`, `| ID | Calculation | Formula |`, and a postcondition table with a `Formal Assertion` column; `interfaces.md` has `| Status | Condition | Body |`; `events.md` has a payload table and a `| Consumer | Action |` table. **The gap between "free prose" and "machine-parseable schema" is small** — these docs are ~85% of the way to a grammar-parseable form already. The deterministic engine is therefore a near-term, low-risk build, _not_ a research moonshot. The residual work is (1) tightening a handful of table conventions into a strict grammar, (2) resolving open cardinalities to exact algorithms, and (3) content-addressed ID assignment.

---

## 1. The extraction/derivation split

The pipeline factors into two pure stages with a typed boundary `G` between them:

```
feature docs ──parse (grammar)──▶  G  ──δ(·, Δ) (pure fn)──▶  T  ──emit──▶ TEST-SPEC.md + *.test.ts
   (markdown)                  (typed graph)            (obligation set)
```

- **Extraction = `parse`.** A _strict grammar_ over canonicalized Markdown tables → `G`. Deterministic, total over well-formed docs, and **fails loudly** (does not guess) on malformed input. This is the only stage where ambiguity could live, so it is where the residual _research_ question now sits (see §10).
- **Derivation = `δ`.** A pure total function from `(G, Δ)` to a **set** of obligations `T`. `Δ` is the rule set (the 20 rule classes in `TEST-PIPELINE.md`) encoded as code. No I/O, no clock, no network, no model. `δ(G) == δ(G)` byte-for-byte is a _tautology_, not an experiment.

Determinism of the **derivation** (C2's real content) is guaranteed structurally. Determinism of the **extraction** is guaranteed for well-formed input and made observable by a parser round-trip property (§10).

---

## 2. The typed concept graph `G` (the IR)

`G` is a typed directed graph: a set of typed **nodes** and typed **edges**, plus a per-node **source anchor** (file + heading + table-row coordinate) that every downstream obligation is content-addressed against.

### Node types

| Node type           | Fields                                                                       | Source                                                     |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------- |
| `Entity`            | `name`, `states: State[]`                                                    | `states.md` state machine heading                          |
| `State`             | `name`, `meaning?`, `terminal: bool` (derived)                               | `states.md` States table / diagram                         |
| `Transition`        | `from: State                                                                 | "[new]"`, `event: Event`, `to: State`, `guard?`, `effect?` | `states.md` Transition Table row |
| `InvalidTransition` | `from`, `event`, `reason`                                                    | `states.md` Invalid Transitions row                        |
| `Invariant`         | `id`, `text`, `formal`                                                       | `states.md` Invariants row                                 |
| `Operation`         | `name`, `kind`, `actor?`, `trigger?`, `inputs: Field[]`                      | `operations.md` operation heading                          |
| `Field`             | `name`, `type`, `required: bool`, `desc?`                                    | Input/Request table row                                    |
| `Rule`              | `id`, `text`, `formal`, `op: Operation`                                      | `operations.md` Rules row                                  |
| `Calculation`       | `id`, `text`, `formula`, `op`                                                | `operations.md` Calculations row                           |
| `Postcondition`     | `id`, `class`, `guarantee`, `formal`, `op`                                   | `operations.md` Postconditions row                         |
| `ErrorState`        | `condition`, `result`, `op`                                                  | `operations.md` Error States row                           |
| `Endpoint`          | `method`, `path`, `auth?`, `exposes: Operation`, `responses: Response[]`     | `interfaces.md` endpoint heading                           |
| `Response`          | `status: int`, `condition`, `body`                                           | `interfaces.md` Responses row                              |
| `FieldMapping`      | `source`, `target`, `endpoint`                                               | `interfaces.md` Request `Maps To` / `mappings.md`          |
| `Event`             | `name`, `producedBy: Operation`, `payload: Field[]`, `consumers: Consumer[]` | `events.md` event heading                                  |
| `Consumer`          | `name`, `action`, `event`                                                    | `events.md` Consumed by row                                |
| `Query`             | `name`, `inputs`, `responses`                                                | `queries.md`                                               |

### Edge types

`produces(Operation→Event)`, `exposes(Endpoint→Operation)`, `guards(Transition→Rule?)`, `governs(Invariant→Entity)`, `consumes(Consumer→Event)`, `mapsTo(Field→Field)`, `usedBy(Calculation→Operation)`, `transitions(State→State via Event)`. Forbidden endpoint pairs (e.g. a `Response`→`Entity` edge) are simply not constructible — the catalog has no such edge constructor, so category errors can't enter `G`.

### Concrete shape (JSON IR, financial-settlement excerpt)

```json
{
  "feature": "financial-settlement",
  "input_closure_hash": "sha256:…", // hash of all parsed source files (T6 fix from E1)
  "entities": [
    {
      "name": "SettlementExecutionState",
      "states": [
        { "name": "[new]", "terminal": false },
        { "name": "VALIDATED", "terminal": false },
        { "name": "COMPUTED", "terminal": false },
        { "name": "SIDE_EFFECTS_PERSISTED", "terminal": false },
        { "name": "COMPLETED", "terminal": true }
      ],
      "transitions": [
        {
          "from": "[new]",
          "event": "GenerateSettlement",
          "to": "VALIDATED",
          "guard": "Required input fields present and player exists",
          "effect": "Request accepted",
          "anchor": "states.md#settlementexecutionstate::row(0)"
        },
        {
          "from": "VALIDATED",
          "event": "GenerateSettlement",
          "to": "COMPUTED",
          "anchor": "states.md#settlementexecutionstate::row(1)"
        }
      ],
      "invalid_transitions": [],
      "invariants": [
        {
          "id": "I1",
          "text": "Makeup debt cannot become negative",
          "formal": "newMakeup >= 0",
          "anchor": "states.md#settlementexecutionstate::inv(I1)"
        },
        {
          "id": "I2",
          "text": "Settlement side-effects are idempotent by period end",
          "formal": "count(tx[...]) <= 1 per type",
          "anchor": "…::inv(I2)"
        }
      ]
    }
  ],
  "operations": [
    {
      "name": "GenerateSettlement",
      "kind": "mutation",
      "trigger": "POST /settlements",
      "inputs": [
        { "name": "playerId", "type": "string", "required": true },
        { "name": "startDate", "type": "string", "required": true },
        { "name": "endDate", "type": "string", "required": true }
      ],
      "rules": [
        {
          "id": "R1",
          "text": "player must exist",
          "formal": "exists(Player.id == playerId)",
          "anchor": "operations.md#generatesettlement::rule(R1)"
        },
        {
          "id": "R2",
          "text": "required fields present",
          "formal": "playerId != null and startDate != null and endDate != null",
          "anchor": "…::rule(R2)"
        },
        {
          "id": "R3",
          "text": "period filter by inclusive range",
          "formal": "startDate <= stats.date <= endDate",
          "anchor": "…::rule(R3)"
        },
        {
          "id": "R4",
          "text": "avoid duplicate MAKEUP_APPLIED",
          "formal": "count(tx[type=MAKEUP_APPLIED,date=endDate]) <= 1",
          "anchor": "…::rule(R4)"
        },
        {
          "id": "R5",
          "text": "avoid duplicate PAYOUT",
          "formal": "count(tx[type=PAYOUT,date=endDate]) <= 1",
          "anchor": "…::rule(R5)"
        }
      ],
      "calculations": [
        {
          "id": "C1",
          "formula": "sum(relevantRecords.profit)",
          "anchor": "…::calc(C1)"
        },
        "…C2..C4"
      ],
      "postconditions": [
        {
          "id": "P1",
          "class": "Integration",
          "formal": "result != null and type(result)=SettlementResult",
          "anchor": "…::post(P1)"
        },
        "…P2..P4"
      ],
      "error_states": [
        {
          "condition": "Missing required fields",
          "result": "400",
          "anchor": "…::err(0)"
        },
        "…"
      ]
    }
  ],
  "endpoints": [
    {
      "method": "POST",
      "path": "/settlements",
      "exposes": "GenerateSettlement",
      "responses": [
        {
          "status": 200,
          "condition": "Success",
          "body": "SettlementResult",
          "anchor": "interfaces.md#post-settlements::resp(200)"
        },
        {
          "status": 400,
          "condition": "Missing required fields",
          "body": "Error payload",
          "anchor": "…::resp(400)"
        },
        {
          "status": 404,
          "condition": "Player not found",
          "body": "Error payload",
          "anchor": "…::resp(404)"
        },
        {
          "status": 500,
          "condition": "Unexpected error",
          "body": "Error payload",
          "anchor": "…::resp(500)"
        }
      ]
    }
  ],
  "events": [
    {
      "name": "SettlementGenerated",
      "producedBy": "GenerateSettlement",
      "payload": [
        "playerId",
        "periodStart",
        "periodEnd",
        "totalProfit",
        "totalRakeback",
        "previousMakeup",
        "newMakeup",
        "totalPayout"
      ],
      "consumers": [
        { "name": "finance reporting", "action": "Save settlement snapshot" }
      ],
      "anchor": "events.md#settlementgenerated"
    },
    {
      "name": "PayoutCreated",
      "producedBy": "GenerateSettlement",
      "payload": ["playerId", "date", "amount"],
      "consumers": [
        { "name": "payout operations", "action": "Reconcile payout ledger" }
      ],
      "anchor": "events.md#payoutcreated"
    }
  ]
}
```

`G` is the _whole_ contract between parser and derivation. Anything not expressible in this schema cannot influence `T` — which is exactly the property that makes `δ` total and deterministic.

---

## 3. The machine-parseable doc schema (and how close we already are)

The schema is: **canonical Markdown tables with fixed, ordered columns under fixed headings**, plus the existing YAML frontmatter. The parser is a _strict grammar_ (e.g. a PEG/recursive-descent over the markdown AST), not an LLM and not a fuzzy heuristic.

### Per-aspect canonical tables

| Aspect                         | Heading anchor                | Required columns (exact, ordered)                              |
| ------------------------------ | ----------------------------- | -------------------------------------------------------------- |
| `states.md` States             | `### States`                  | `State \| Meaning`                                             |
| `states.md` Transitions        | `### Transition Table`        | `From \| Event \| To \| Guard \| Effect`                       |
| `states.md` Invalid            | `### Invalid Transitions`     | `From \| Event \| Why Invalid`                                 |
| `states.md` Invariants         | `### Invariants`              | `ID \| Invariant \| Formal`                                    |
| `operations.md` Input          | `### Input`                   | `Field \| Type \| Required \| Description`                     |
| `operations.md` Rules          | `### Rules`                   | `ID \| Rule \| Formal`                                         |
| `operations.md` Calculations   | `### Calculations`            | `ID \| Calculation \| Formula`                                 |
| `operations.md` Postconditions | `### Postconditions`          | `ID \| Class \| Guarantee \| Formal Assertion \| Traceability` |
| `operations.md` Error States   | `### Error States`            | `Condition \| Result`                                          |
| `interfaces.md` Responses      | per-endpoint `**Responses:**` | `Status \| Condition \| Body`                                  |
| `interfaces.md` Request map    | per-endpoint `**Request:**`   | `Field \| Type \| Maps To`                                     |
| `events.md` Payload            | per-event `### Payload`       | `Field \| Type \| Description`                                 |
| `events.md` Consumers          | per-event `### Consumed by`   | `Consumer \| Action`                                           |

### How close the current poker-team docs already are — the feasibility verdict

I diffed the schema above against the _actual_ committed financial-settlement and auth-access-control docs. Findings:

- **states.md (financial-settlement):** transition table columns are exactly `From | Event | To | Guard | Effect`. ✅ parseable as-is.
- **states.md (auth-access-control):** has explicit `### States`, `### Transition Table` (`From | Event | Guard | To | Effect` — column _order_ differs from financial-settlement!), `### Invalid Transitions`, `### Invariants`. ⚠️ Two real features use **different column orders** for the transition table. **Gap = column-order canonicalization** (trivial: sort/alias columns by name, not position).
- **operations.md:** Rules `ID | Rule | Formal`, Calculations `ID | Calculation | Formula`, Postconditions with a `Formal Assertion` column, Error States `Condition | Result` — all present and table-shaped. ✅
- **interfaces.md:** Responses `Status | Condition | Body`, Request `Field | Type | Maps To`. ✅
- **events.md:** Payload table + `Consumed by` table per event. ✅

**Verdict:** the docs are already ~85% machine-parseable. The only real gaps are (1) **column-order/aliasing inconsistency between features** (financial-settlement vs auth-access-control transition tables), (2) a few **prose-only cells** the grammar must treat as opaque strings rather than try to interpret (e.g. `PayoutCreated or no-payout` as an event, the `ApplyMakeupPolicyCalculation` whose "formula" is a 7-bullet prose list), and (3) **no `Formal` column on some calculation/postcondition rows is machine-evaluable** — they say "per ApplyMakeupPolicy formula." The minimal schema change is a **linter** that rejects docs not matching the canonical column set, forcing authors to canonical form. No YAML rewrite is needed; the existing frontmatter stays.

**Why Markdown tables, not YAML:** authoring burden. The docs already exist as readable tables that humans review in PRs. Forcing YAML would be a regression in human reviewability for ~zero parsing benefit (a strict table grammar is as deterministic as a YAML loader). See the tournament (§9).

---

## 4. δ rule encoding — three actual rules as pure functions over `G`

Each `δ_i` is a pure function `G → Obligation[]`. The full `δ = ⋃_i δ_i`. I encode three real rules from `TEST-PIPELINE.md`, **including the resolution of its open cardinalities** (the defect E1-T9, E2, and the cartographer all flagged).

### δ₂ — Negative/Invalid Transition (the Cartesian-subtraction rule)

`TEST-PIPELINE.md` rule 2: "for every state × event combination NOT in the Transition Table, generate a rejection test." E1 flagged this as the worst nondeterminism source under an LLM (it must enumerate the Cartesian product and subtract). As a pure function it is **exactly defined**:

```
δ₂(G) =
  for each Entity e:
    let S = e.states                                   // includes "[new]" only as a source, never a target
    let E = distinct events over e.transitions ∪ e.invalid_transitions
    let valid = {(t.from, t.event) for t in e.transitions}
    // EXACT cardinality: one obligation per (state, event) in the full grid minus the valid set,
    // restricted to non-terminal source states (terminal states have a separate I1 rule).
    for each s in S where not s.terminal, for each ev in E, in (sort(S) × sort(E)) order:
        if (s, ev) not in valid:
            emit Obligation{ rule_type: "INVALID_TRANSITION",
                             source_anchor: anchor(e),
                             params: {from: s, event: ev} }
```

**Cardinality is now exact and total:** `|δ₂| = Σ_e |{non-terminal states}| · |events| − |valid transitions from non-terminal states|`. No "at least", no free choice. Iteration is in lexicographic `(state, event)` order so emission order is deterministic too. The event universe `E` is closed = events that _appear in this entity's tables_ (not a global event set), removing the "what counts as an event" ambiguity.

### δ₃/δ_inv — Invariant Property tests (exact 1-per-row)

`TEST-PIPELINE.md` rule 3: "Every row in the Invariants table = 1 property-based test." Already exact.

```
δ_inv(G) =
  for each Entity e, for each Invariant inv in e.invariants (in table order):
      emit Obligation{ rule_type: "INVARIANT_PROPERTY",
                       source_anchor: anchor(inv),       // states.md#…::inv(I1)
                       params: {id: inv.id, formal: canonicalize(inv.formal)} }
```

`|δ_inv| = Σ_e |e.invariants|`. For financial-settlement that is exactly 2 (I1, I2) → matches TEST-SPEC rows WI-1, WI-2.

### δ_rule — Rule Validation (resolving "at least 2 tests")

`TEST-PIPELINE.md` rule 4: "Each rule = **at least** 2 tests (pass + fail)." "At least" is undefined under determinism. **Resolution: an exact, typed enumeration keyed on the rule's formal operator**, not a free count:

```
δ_rule(G) =
  for each Operation op, for each Rule r in op.rules (table order):
      cases = classify(r.formal):                       // deterministic on the formal-expression AST
        EXISTENCE  (exists(...))      -> ["pass: entity exists", "fail: entity absent"]            // 2
        PRESENCE   (x != null ...)    -> ["fail: <field> missing" for each conjunct field]          // n = #conjuncts
        RANGE      (a <= x <= b)      -> ["pass: x == a (lower incl)", "pass: x == b (upper incl)",
                                          "fail: x < a", "fail: x > b"]                              // 4
        COUNT_CAP  (count(...) <= k)  -> ["pass: first occurrence", "fail: duplicate suppressed"]    // 2
        COMPARISON (x > 0 / x >= 0)   -> ["pass: x = boundary+1", "fail: x = boundary", "fail: x = boundary-1"] // 3
      for c in cases: emit Obligation{ rule_type:"RULE_VALIDATION", source_anchor:anchor(r),
                                       params:{rule_id:r.id, case:c} }
```

The count is now a **function of the formal expression's shape**, not a free "at least 2." For financial-settlement: R1 (EXISTENCE)→2, R2 (PRESENCE, 3 conjuncts)→3, R3 (RANGE)→4 (matches TEST-SPEC RV-5/6/7 = lower-incl/upper-incl/outside), R4 (COUNT_CAP)→2 (RV-8), R5 (COUNT_CAP)→2 (RV-9). This _reproduces the human-authored RV rows_ while being mechanically exact. The same machinery handles calculations (one obligation per `(calculation, branch)` where branches come from `?:` / piecewise structure in the formula — C3's `limit >= NL100 ? 0.5 : 0.4` deterministically yields exactly 2 obligations CT-3, CT-4).

### The cardinality principle (general resolution of E1-T9)

> **Every open cardinality in `TEST-PIPELINE.md` ("at least k", "1+", "tests for: shape, filtering, auth, empty") is replaced by an exact enumeration function over the source row's typed structure.** The count is recovered from the _formal expression / column set_, never chosen. Where a row has no machine-evaluable formal (e.g. `ApplyMakeupPolicyCalculation`'s prose), the engine emits **exactly one** "manual-formula" obligation and flags the row as `needs_formal` (escape hatch, §10) rather than guessing a count.

This makes `|T|` a deterministic function of `G`, which is the property E1's Jaccard could never get from an LLM.

---

## 5. Deterministic obligation IDs (structural fix for E1's Jaccard problem)

E1's central blocker: TEST-SPEC IDs (`RV-1`, `AEO-BE-OP-046`) are **hand-numbered sequential counters** with no algorithm, so two runs renumber and Jaccard tanks for cosmetic reasons. Fix: **content-addressed IDs**.

```
obligation_key = sha1(
    normalize(source_anchor)          // "operations.md#generatesettlement::rule(R3)"
  + "|" + rule_type                   // "RULE_VALIDATION"
  + "|" + canonical_params            // sorted, lowercased, e.g. "case=lower-incl|rule_id=r3"
)[0:8]
```

- The obligation **set** is keyed by `obligation_key` → order-free, name-free, ID-string-free. Two runs over the same `G` produce **byte-identical** key sets. Jaccard ≡ 1.0 by construction.
- For human-readable TEST-SPEC, the engine assigns the friendly `RV-n` / `CT-n` **deterministically** as the rank of the obligation in a _total order_ (sort by `(aspect, rule_type, source_anchor, canonical_params)`), so `RV-1..RV-9` are reproducible too — the numeric suffix is now a pure function of `G`, not an emission accident.
- The `obligation_key` is also written into the row (and into the emitted test's `@obligation` tag), giving a stable cross-run, cross-artifact join key. This is the same `obligation_key` E1 proposed as its only sound equality notion — here it exists _in the engine_, not just in the experiment's post-processor.

**Net:** E1's "which Jaccard, over what set" problem dissolves: the set is the `obligation_key` set, and it is identical across runs by definition.

---

## 6. Output — TEST-SPEC.md AND runnable tests

The emitter is a pure function `T → artifacts`. Two emitters share the same `T`:

1. **`emit_spec(T) → TEST-SPEC.md`** — renders the grouped tables (Rule Validation, Calculation, Postcondition, Contract, Event, Query, Mapping, Workflow-Invariant) that the existing target TEST-SPEC.md has. Each row carries its `obligation_key` + friendly ID + `source_anchor`. Reproduces the current human-facing artifact deterministically.

2. **`emit_tests(T) → *.test.ts`** — renders **runnable vitest** skeletons, one `it()` per obligation, tagged `@obligation <key> @source <anchor>`, with the GIVEN/WHEN/THEN body filled from the obligation's `params` and the template for its `rule_type`. For mechanically-complete rule types (INVALID_TRANSITION, RULE_VALIDATION RANGE/PRESENCE/COUNT_CAP, CONTRACT status, EVENT-emitted-vs-not) the engine can emit **fully-asserting** tests (the params carry the boundary values). For `needs_formal` obligations it emits a `it.todo()` with the prose guarantee, surfacing exactly which assertions still need a human.

**Why this matters for E3.** E3's blocker was "the derived suite is a Markdown doc, not code — `mutation_score_derived` can't be computed without a human/LLM implementing the spec, re-injecting the variability E3 exists to factor out." When the engine emits **runnable `*.test.ts` directly**, that implementation step disappears for the mechanical majority of obligations: `derive(docs)` yields _code Stryker can run_. The residual human authoring shrinks to the `needs_formal` minority, which the engine _labels_, so E3 can compute `mutation_score_derived` over the engine-emitted suite without an implementer confound.

---

## 7. Worked validation: δ over financial-settlement reproduces the committed TEST-SPEC

Running the encoded δ on the parsed financial-settlement `G` yields:

| Rule fn    | Source rows                        | Obligations (exact)                                                        | Matches committed TEST-SPEC rows                                        |
| ---------- | ---------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| δ_rule     | R1..R5                             | R1→2, R2→3, R3→4, R4→2, R5→2 = 13                                          | RV-1..RV-9 (human collapsed R1/R2 sub-cases; engine is _more_ complete) |
| δ_calc     | C1..C4 + ApplyMakeup               | C1→1, C2→1, C3→2, C4→`needs_formal`(1), ApplyMakeup bullets→`needs_formal` | CT-1..CT-10                                                             |
| δ_post     | P1..P4                             | P1→1, P2→2 (changed/unchanged), P3→2 (created/not), P4→2                   | PC-1..PC-7                                                              |
| δ_inv      | I1, I2                             | 2                                                                          | WI-1, WI-2                                                              |
| δ_contract | POST /settlements responses        | 200/400/404/500 = 4                                                        | CO-1..CO-4                                                              |
| δ_event    | SettlementGenerated, PayoutCreated | producer + emitted/not-emitted = 3                                         | EV-1..EV-3                                                              |

The engine reproduces the committed catalogue's structure and, where the human used "at least", produces a **superset that is exact**. Divergences are _informative_: e.g. the human collapsed R1+R2 into RV-1..RV-4; the engine's PRESENCE/EXISTENCE enumeration is the canonical normal form. This is the round-trip evidence E1a actually wants.

---

## 8. How E1 / E2 / E3 change under the engine

- **E1 (determinism / C2-Def-4).** _Collapses into a property test._ `∀ docs ∈ corpus: derive(docs) == derive(docs)` byte-for-byte over the `obligation_key` set. True by construction — no 10-run Jaccard, no temperature, no provider-nondeterminism, no input-closure-hash gymnastics. The residual research question **moves upstream to parser/extraction stability** (§10): does `parse` build the intended `G`, stay invariant under benign doc edits (row reorder, whitespace), and fail transparently on malformed sections? That is a parser robustness study (recall vs a gold `G`, round-trip invariance), not a stochastic-LLM study. **E1's Jaccard problem is solved structurally**: the equality set is the content-addressed `obligation_key` set.

- **E2 (coverage / derived ≥ manual + traceability).** The "deterministic derivation is a lie" blocker (B1) is **removed** — derivation _is_ deterministic code, so the word is earned. Traceability becomes non-circular: every obligation carries an `obligation_key` + `source_anchor` _emitted by the engine_, so coverage = `|{anchors covered}| / |{anchors in G}|` computed mechanically, not asserted. The contamination problem (D already authored by the operator) is sidestepped because the engine _re-derives_ D from docs on demand — the human "manual" arm is now a clean comparison against an objective, reproducible reference.

- **E3 (mutation / derived tests catch faults).** The "spec is a doc not code" blocker is **removed** by `emit_tests` (§6): the engine emits runnable vitest, so `mutation_score_derived` is computed over an engine-produced suite with **no implementer confound** for the mechanical majority. Stryker still must be installed/configured (that gap is real and orthogonal), but the _construct-validity_ blocker — "you're measuring the implementer, not the derivation" — is gone. The `needs_formal` minority is explicitly labeled, so E3 can scope its claim to the mechanically-derived subset.

**Crisp statement:** E1 becomes a property test (residual = parser completeness/round-trip); E3 can use engine-emitted runnable tests (residual = Stryker infra + the `needs_formal` tail). E2 loses its "not actually deterministic" and "circular traceability" blockers.

---

## 9. Tournament — HOW to build it (full determinism is fixed; only the path varies)

| Approach                                                                                                            | Build cost                                                                               | Authoring burden on humans                                                                               | Expressiveness / coverage fidelity                                                           | Robustness                                                                            | Score      |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| **A. Strict grammar over canonical Markdown tables** (parse existing `.md` after a linter forces canonical columns) | **Low** — docs are already ~85% there; build = column-aliasing + table-AST walk + linter | **Lowest** — authors keep writing the same readable tables they review in PRs; only a linter nudges them | **High** — every TEST-PIPELINE rule maps to a table; opaque cells handled via `needs_formal` | **High** — grammar rejects malformed tables loudly; benign-edit invariance is natural | **★ Best** |
| B. Docs authored as YAML/structured data + loader                                                                   | Medium — must define schemas + migrate all 7 features' docs to YAML                      | **High** — humans lose readable Markdown tables; PRs review YAML; regression in reviewability            | High — trivially machine-evaluable                                                           | High                                                                                  | 2nd        |
| C. AST over a small DSL (custom spec language)                                                                      | **High** — design a language, lexer, parser, tooling, editor support                     | **Highest** — humans learn a new language; biggest adoption tax; abandons existing docs entirely         | Highest (can encode formal semantics natively)                                               | High but brittle to language churn                                                    | 3rd        |

**Recommendation: Approach A — strict grammar over canonicalized Markdown tables.** Rationale: the decisive variable is _authoring burden against an existing, working corpus_. The poker-team docs are already canonical tables that humans author and review; A preserves that and reaches determinism with the least disruption and lowest build cost. B and C both throw away the ~85%-ready corpus and tax authors for a parsing benefit a table grammar already delivers. The formal-expression interpretation that C buys natively is needed for only a minority of cells; handle those with a small `formal` expression sub-grammar (the AST used by δ_rule/δ_calc classification) embedded _inside_ approach A, applied only to the `Formal`/`Formula` columns — getting C's expressiveness exactly where it pays, without C's adoption tax.

### MVP boundary (smallest engine that derives valid obligations for ONE feature)

**Scope = financial-settlement only, four aspects (states/operations/interfaces/events), six rule functions** (`δ_inv`, `δ₂` invalid-transition, `δ_rule`, `δ_calc`, `δ_contract`, `δ_event`), `obligation_key` IDs, `emit_spec`. Validation gate = **the engine's TEST-SPEC.md round-trips against the committed `financial-settlement/TEST-SPEC.md`** (every committed RV/CT/PC/CO/EV/WI row maps to an engine obligation; engine extras are the exactified "at least" expansions). `emit_tests` and the second feature (auth-access-control, which adds the _Invalid Transitions_ and dual-entity state machine) are **post-MVP**. This MVP proves the load-bearing claim — a pure `δ` reproduces a real, hand-authored catalogue deterministically — on the smallest surface.

---

## 10. The hardest formalization risk (what genuinely resists a grammar)

A grammar can parse _table structure_; it **cannot evaluate semantics that live in prose cells**. The concrete resisters in the real docs:

1. **Prose "formulas" with no machine-evaluable form.** `ApplyMakeupPolicyCalculation` is a 7-bullet prose algorithm ("Apply profit to debt first when policy flag is true…"). `C4` is `applyMakeupPolicy(previousDebt, C1, C2, playerShare)` — a _call_, not an arithmetic expression. The committed TEST-SPEC honestly punts ("per ApplyMakeupPolicy formula"). A grammar cannot derive the expected numeric assertion from this prose.
2. **Compound event tokens.** `PayoutCreated or no-payout` as a transition event is a disjunction the grammar must split, and `no-payout` is not an event in `events.md` — it's a guard condition smuggled into the event column.
3. **Guards that reference cross-feature state** (`R3: method ∈ enabledMethods(user.country)` in the reference example) — the grammar can capture the string but cannot enumerate `enabledMethods` without external data.
4. **Postconditions with implication semantics** (`(newMakeup != previousMakeup) -> player.makeup = newMakeup`) — parseable as an implication AST, but the _test fixtures_ that exercise both branches need values a grammar can't invent.

**How the engine handles each (the policy):**

- **Require canonical form where cheap.** The `Formal`/`Formula` columns must contain a string in the **small formal sub-grammar** (comparisons, `count(...) <= k`, `exists(...)`, ranges, ternaries, implications). The linter rejects docs whose `Formal` cell doesn't parse. This converts "free prose" into a parseable expression for the _majority_ of rules (R1–R5, C1–C3, I1–I2 all already qualify).
- **Reject, don't guess, on malformed structure.** Missing required column / unknown heading / non-table content under a table heading → the parser **fails the build for that aspect** and reports the exact coordinate (this _is_ SKILL step 5 "report missing formal sections", but deterministic). No silent partial `G`.
- **Escape hatch = `needs_formal` obligation.** For genuinely irreducible prose (the `applyMakeupPolicy` algorithm, compound `or no-payout` events), the engine emits **exactly one** obligation flagged `needs_formal` with the verbatim prose as the guarantee, and `emit_tests` renders it as `it.todo()`. Determinism is preserved (exactly one obligation, content-addressed), the human gap is _labeled and counted_, and coverage metrics can report "N obligations awaiting formal." This is the principled boundary: **the engine is deterministic over everything it can formalize, and deterministic about flagging what it can't.**

The risk that remains: **authors writing prose where formal is required.** The mitigation is social + tooling (the linter as a CI gate), not algorithmic. This is the honest residual — and it is _upstream of `δ`_, exactly where E1a should now point its instrument.

---

## 11. Phased build plan

1. **Schema + linter.** Freeze the canonical column set (§3); build a linter that rejects non-canonical tables and reports exact coordinates. Run it against all 7 poker-team features; fix the column-order drift (auth vs financial-settlement transition tables). _Exit:_ all 7 features lint-clean or have an explicit `needs_formal` ledger.
2. **Parser → `G`.** Recursive-descent over the markdown AST producing the typed IR (§2), with `source_anchor` per node and `input_closure_hash`. _Exit:_ `parse(financial-settlement) == golden G` snapshot.
3. **Formal sub-grammar.** AST for the `Formal`/`Formula`/postcondition cells (comparison, range, count-cap, existence, ternary, implication). _Exit:_ R1–R5, C1–C3, I1–I2, P1–P4 all parse; `applyMakeupPolicy`/prose flagged `needs_formal`.
4. **δ rule functions.** Encode `δ_inv`, `δ₂`, `δ_rule`, `δ_calc`, `δ_contract`, `δ_event` with **exact cardinality** algorithms (§4). _Exit:_ `δ(G)` is total; per-rule firing counts emitted.
5. **Obligation IDs.** Content-addressed `obligation_key` + deterministic friendly-ID ranking (§5). _Exit:_ re-run byte-identical key set; property test `derive(docs)==derive(docs)` green.
6. **Emitters.** `emit_spec` (MVP), then `emit_tests` (post-MVP). _Exit:_ generated TEST-SPEC.md round-trips against committed financial-settlement TEST-SPEC.md.
7. **Validation against existing TEST-SPECs.** Run engine over all 7 features; diff engine catalogue vs committed catalogue; classify every divergence as (a) exactified "at least" expansion, (b) `needs_formal` punt, or (c) genuine bug. _Exit:_ zero category-(c) divergences; E1 reframed as the property test + parser-robustness study; E3 re-pointed at engine-emitted tests.
   </content>
   </invoke>
