---
node_type: refinement-stage
role: Falsification Skeptic
created: 2026-06-21
---

# Falsification Skeptic — C2 round-trip honesty audit

Adversary: an Engine Generalization Architect who wants to widen the bridging so auth (and more
features) PASS. My job is to protect claim **C2 (determinism by construction)** from being proven
by a self-fulfilling gate. The gate's whole epistemic value is that a PASS is _hard to get_. Every
normalization choice that maps two distinct human obligations onto one key trades falsifiability for
a greener report. Below is where that line is, what I verified empirically, and how to keep PASS honest.

I ran both round-trips myself rather than trusting the report's narration:

- `financial-settlement`: MISSING 0, EXTRA 16 → PASS (matches L0 report).
- `auth-access-control`: derived 72, committed 77, MISSING 30, EXTRA 25 → FAIL.

---

## 1. The gate's threat model

C2 says the δ pipeline is deterministic _by construction_. The round-trip is NOT what proves
determinism — byte-stable `obligation_key` across runs proves that. What the round-trip proves is the
**adequacy precondition**: that a deterministic engine actually reproduces a real human-authored
catalogue, so "deterministic" is not deterministically-wrong. A PASS therefore only earns C2 evidence
if the comparison **could have failed** on a real defect. The danger is not the engine; it is the
_comparator_ in `roundtrip/index.ts`. Bridging lives entirely on the comparator side, and the
comparator is the one component with no oracle of its own. That is the soft underbelly.

## 2. Is concept-bucket bridging (PC/WF/QT/MT → owning concept) too weak?

**Postconditions: acceptable.** I checked both oracles. In financial, `PC-1..PC-7` are seven cases of
_one_ operation (`GenerateSettlement`); collapsing to `post:generatesettlement` loses per-case prose
the engine never claimed to derive. In auth, the five `AUTH-POST-001..005` rows each name a _different_
operation, so they bucket to five _distinct_ keys (`post:login`, `post:issueaccesstoken`, …). So the
op-bucket does NOT collapse distinct operations — it collapses cases within one operation. That is a
defensible granularity choice, not a manufactured match.

**Workflow / query / mapping: this is the dangerous one.** Here the bucket key is the _concept slug
only_, with no surviving sub-token, and multiple genuinely-distinct human obligations collapse onto a
single trivially-covered key:

- Financial `WF-1..WF-5` are five different workflow steps (validate / load / compute / persist /
  return). They ALL fold to a single `workflow:settlementworkflow`. The engine emits one
  `workflow-step` per step, but at semantic-identity level the gate only asks _"did the engine touch
  this workflow at all?"_ — one derived step satisfies all five committed rows.
- Auth `AUTH-WF-001..003` are three branches of `EndToEndAuthFlow` (login / protected-request /
  logout). All three would fold to `workflow:endtoendauthflow`. The login branch alone covers the
  logout-branch obligation.
- Same structure for `QT-1..QT-4` → `query:getsettlementpreview` and `MT-1..MT-2` →
  `mapping:settlementrequesttoinput`.

**Concrete defect that passes undetected today:** suppose the δ_workflow rule had a bug that emitted a
step obligation for _only the first_ step of a workflow and silently dropped steps 2–5 (e.g. an
off-by-one over the Step Table, or a parser that stopped at the first `On Failure` row). Financial
would still PASS — one derived step matches the single `workflow:settlementworkflow` bucket and
MISSING stays 0. The gate cannot see a 5→1 cardinality regression in WF/QT/MT. That is a real
test-derivation defect (the emitted suite would under-test the workflow) that the C2 evidence gate
would bless as PASS. **This is the strongest teach-to-the-test risk in the system.** It is latent, not
hypothetical: the financial PASS depends on it.

## 3. The 16 financial "extras" — are any a mis-bridged human obligation?

I enumerated all 16. They decompose cleanly:

- 12 `transition:*` / `invalid:*` — engine-only Cartesian state coverage with no committed peer
  (the human catalogue folds these into WF tests). Legitimate over-completeness.
- 3 `contract:401/403/404` — responses of `GET /settlements/preview` the committed CO table (POST
  only) omits. Engine strictly more complete.
- 1 `mapping:settlementresulttoresponse` — a second mapping section the MT table omits.

**None is a mis-bridged human obligation.** I confirmed by checking the committed-side keys: the human
catalogues no transition/invalid keys at all, only one mapping, and only POST contracts — so every
extra has _no_ committed counterpart it could have been stolen from. The reassuring direction. **But
the method to know this is weak by construction**: an "extra" and a "miss" can never be the same
mis-bridge in financial, because the financial dialect has so few committed keys (20) that collisions
are improbable. The auth FAIL is where mis-bridging is visible and _proves the failure mode is real_:
`inv:session:i1` is a MISS while `inv:sessionlifecycle:i1` is an EXTRA — the same obligation, split
across the partition by a name convention. **The only general way to know an extra is not a disguised
miss is to demand that the bridge be a documented, total, injective map — see the invariants.**

## 4. Honesty invariants for a PASS to be valid C2 evidence

A round-trip PASS is honest evidence of C2 **iff** all of the following hold. These are the line.

- **INV-1 (injectivity / no merge of distinct obligations).** The normalization must not map two
  _distinct_ human obligations to the same key. Case-expansions of one source row are not distinct
  (allowed); distinct source rows (different steps, queries, branches) are. **Today WF/QT/MT violate
  INV-1** — five steps → one key. This is the load-bearing failure.
- **INV-2 (totality on the committed side).** Every committed row must produce a key the bridge can
  represent. A row that the parser silently skips (e.g. `cells.length < 4`, an unmatched `Type`) is
  invisible, not missing — it cannot drive a FAIL. The parsers `continue` past unmatched rows; those
  rows vanish. A PASS over a partially-parsed oracle is not a PASS.
- **INV-3 (falsifiability / the gate CAN still fail).** There must exist at least one negative control
  proving the comparator reports a deliberately-absent obligation as MISSING. Without this, MISSING=0
  is unfalsified, not verified. **This is absent today.**
- **INV-4 (no per-feature tuning toward green).** `qualified` mode, `MAKEUP_CALC_IDS = {c4}`, the
  `TYPE_PREFIX` table — each is a bridging knob. A knob added _because_ a feature was red is overfit. A
  knob added because a _dialect class_ is principled is generalization. The discriminator: the knob
  must be selected by a dialect signature in the data (`isColumnTyped`), never by feature name. The
  code currently honors this (no feature-name branching) — keep it that way and gate it.
- **INV-5 (bridge symmetry is documented and reviewable).** Every fold (engine-side and committed-side)
  must be the _same_ function applied to both sides. `MAKEUP_CALC_IDS` is engine-side only —
  `c4 → calc:makeup` — and the committed side reaches `calc:makeup` via `extractRefId ?? "makeup"`
  fallback. These are two different code paths asserted to agree. That asymmetry is exactly where a
  silent over-fold could hide; it deserves a unit test pinning both directions.

## 5. Auth: which misses STAY misses (genuine δ gaps) vs convention drift

**Test to tell them apart (the equivalence-class probe):** for each MISS key, ask _"does the engine
produce an EXTRA that is the same obligation under a different identity convention?"_ If yes →
convention drift (bridge could be widened, but only with a documented alias, never a guess). If no →
genuine δ gap (the engine emits no obligation of that class at all; widening the bridge would
manufacture a match from nothing — forbidden).

Applying it to the 30 auth misses:

| Miss class                                                             | Has equivalent EXTRA?                                      | Verdict                                                                                                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inv:session:i1/i2`, `inv:token:i1/i2/i3` (5)                          | yes — `inv:sessionlifecycle:*`, `inv:tokenlifecycle:*`     | **convention drift** (entity-name alias Session↔SessionLifecycle)                                                                                      |
| `transition:auth-state-*` (6)                                          | yes — `transition:[new]:loginsucceeded` etc.               | **convention drift** (row-id key vs from:event key)                                                                                                    |
| `invalid:auth-state-*` (5)                                             | yes — `invalid:[new]:tokenrevoked` etc.                    | **convention drift** (same)                                                                                                                            |
| `error:auth-err-001..005` (5)                                          | **no** — engine emits no `error:*` key                     | **GENUINE GAP** — auth catalogues a dedicated Error-state obligation class the δ folds into rule/contract; there is no engine obligation of this type. |
| `event:audit/session/cache/security/alerting` (5)                      | **no** — engine buckets events by event name, not consumer | **GENUINE GAP** — consumer-side event obligations are a class the δ does not emit per-consumer.                                                        |
| `contract:refresh`, `contract:standard` (2)                            | **no**                                                     | **GENUINE GAP** — `refresh` is a deferred endpoint; `standard` is a cross-cutting error-shape obligation with no δ peer.                               |
| `workflow:endtoendauthflow`, `workflow:permissionresolutionpolicy` (2) | partial                                                    | drift on the slug, but see INV-1: even bridged, the WF bucket would hide branch cardinality.                                                           |

So **of 30 misses, 16 are convention drift and 12+ are genuine δ gaps** (error-class, consumer-events,
deferred/standard contracts). The architect's framing — "the auth FAIL is _pure_ convention drift" —
is **overstated**. The error-mapping and consumer-event classes are real coverage the engine does not
produce. Bridging them away would be teaching to the test: the FAIL is partly honest and must stay
partly red until the δ actually emits those obligation classes (or the team consciously decides those
classes are out of scope and removes them from the oracle).

## 6. DEC-TDE-SEMANTIC-RIGOR-001 — recommendation

> _Per-row obligation identity, or is owning-concept-bucket bridging acceptable for PC/WF/QT/MT?_

**Verdict: SPLIT the decision — accept op-bucketing for postconditions; REJECT concept-bucketing for
WF/QT/MT as currently implemented (it violates INV-1).**

Reasoning:

- **Postconditions (op-bucket): ACCEPT.** PC rows are genuinely case-expansions of one operation, and
  the bucket distinguishes operations (auth proves 5 ops → 5 keys). No INV-1 violation. The lost
  per-case prose is not source-encoded, so demanding per-case identity would require guessing —
  correctly forbidden.
- **WF/QT/MT (concept-bucket): REJECT as the permanent answer.** Folding N distinct steps/queries/
  mappings to one slug violates injectivity and hides cardinality regressions (§2). This is the
  single largest hole in the C2 evidence. Do not generalize it further; constrain it.
- **Required resolution (the upstream authoring fix already named in GAP-TDE-POSTCONDITION-IDS-001 is
  correct but mis-prioritized as "low").** Bump it to **medium/high** and require committed WF/QT/MT
  rows to carry a surviving per-row token (`WF:settlementworkflow:step1`, `QT:getsettlementpreview:1`)
  so the bridge becomes injective. The engine already emits per-step obligations; only the _committed
  side_ and the _bridge key_ need the token. Until that lands, the L0 report must explicitly **caveat
  the financial PASS**: "WF/QT/MT verified at concept-presence granularity only; per-step cardinality
  is NOT gated." Right now the PASS reads as stronger than it is.

Do not let the decision be closed as "concept-bucket acceptable" — that ratifies the overfit.

## 7. Recommended anti-overfit guard (negative control / mutation gate)

Add a **mandatory negative-control test** to the round-trip's own test suite — the gate must prove it
can fail before any PASS is trusted (INV-3). Two layers:

1. **Injection control (cheap, run every CI).** In `roundtrip` tests, take the real committed semantic
   map, inject one synthetic obligation that the engine provably does not derive
   (`rule:__sentinel__`), and assert `semanticRoundTrip(...).pass === false` with the sentinel in
   `missing`. Symmetrically, delete one engine key the oracle requires and assert it surfaces as
   MISSING. If either assertion fails, the comparator is broken and **no feature PASS may be reported**.
   This is the single highest-value, lowest-cost guard and it directly kills the self-fulfilling risk.

2. **Cardinality / mutation control (the WF/QT/MT hole, §2).** Add a property test: for each
   concept-bucketed category, drop all-but-one of the engine's source-row obligations for a concept and
   assert the round-trip **still** flips to a meaningful failure once per-row tokens exist (post-fix),
   OR — until the authoring fix lands — assert and _document_ that it does NOT, so the limitation is
   encoded as a failing/known-gap test rather than silent. Long term, wire the emitted suite into E3
   Stryker mutation testing: a δ mutant that drops workflow steps must be killed by the round-trip; if
   it survives, the gate is overfit by exactly the amount the mutant survived.

Without guard #1 the MISSING=0 number is an unfalsified claim. With it, every PASS carries a proof
that the gate was capable of saying no.
