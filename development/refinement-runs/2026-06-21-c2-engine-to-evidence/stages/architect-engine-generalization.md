---
node_type: refinement-stage
role: Engine Generalization Architect
created: 2026-06-21
panel: tensioned-refine (adversary = Falsification Skeptic)
status: proposal (NON-EXECUTED — no engine code mutated)
targets:
  - BLK-TDE-AUTH-CONVENTION-001
  - GATE-TDE-CORPUS-GENERALIZATION-001
sources:
  - tools/test-derivation-engine/src/roundtrip/index.ts
  - tools/test-derivation-engine/src/rules/index.ts
  - tools/test-derivation-engine/src/grammar/index.ts
  - tools/test-derivation-engine/src/ir/types.ts
  - development/deterministic-test-derivation-engine/L0-ROUNDTRIP-REPORT.md
  - validation/poker-team/docs/features/{financial-settlement,auth-access-control}/
---

# Engine Generalization — Semantic-ID Bridging Across Oracle Dialects

## 0. Framing & the one fact that reframes the whole problem

The blocker (BLK-TDE-AUTH-CONVENTION-001) reads as "make auth round-trip." The
corpus tells a different and more important story. I classified every committed
TEST-SPEC.md in the poker-team corpus by dialect signature:

| Dialect        | Features                                                                                | Count |
| -------------- | --------------------------------------------------------------------------------------- | ----- |
| `column-typed` | auth-access-control, player-makeup, player-management, player-progression, player-stats | **5** |
| `rv-ct`        | financial-settlement, player-onboarding                                                 | **2** |
| (no TEST-SPEC) | domainspec-coverage, ecosystem-api-expansion                                            | 2     |

**The dialect the engine PASSES (`rv-ct`) is the corpus MINORITY. The dialect it
FAILS (`column-typed`) is the corpus MAJORITY.** So this is not "patch the auth
edge case." Auth is the representative of the dominant convention. Any bridging
that only fixes auth-by-name is overfitting; the right unit of work is "make the
`column-typed` dialect round-trip as a class," validated on auth FIRST and then on
the four sibling column-typed features that the engine has never been scored
against. That reframing is the spine of the corpus strategy in §4.

## 1. X-ray: how the two dialects differ (the hidden structure)

Both TEST-SPECs are derived from the SAME seven aspect docs and the engine parses
both with **0 violations / 108 raw auth obligations** — the δ rules are not the
problem. The mismatch is entirely in the _oracle's authoring convention_ and how
the round-trip recovers a comparable identity token from it.

| Axis              | `rv-ct` (financial-settlement)                         | `column-typed` (auth + 4 siblings)                                    | Bridges today?           |
| ----------------- | ------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------ |
| Table shape       | One table per category (Rule/Calc/PC/WF/…)             | One flat table, `Type` column carries the category                    | yes (detected)           |
| Row id scheme     | `RV-1`, `CT-3`, `PC-2` (category-prefixed, sequential) | `AUTH-RULE-001` (`<FEAT>-<CAT>-<NNN>`)                                | yes (regex)              |
| Rule/calc/inv id  | **globally unique** R1..R5, I1..I2                     | **restarts per operation/entity**: `Login R1`, `Token I1`             | partial (qualified mode) |
| Id recovery       | embedded in prose cell (`R3:`, `I1:`)                  | parsed from `Obligation` cell leading concept + `\b[RCPI]\d\b`        | yes                      |
| Entity naming     | n/a (single state machine)                             | oracle says `Session I1`; states.md heading is **`SessionLifecycle`** | **NO — drift**           |
| Transition keying | (folded into Workflow rows; engine extras)             | keyed by **row id**, Obligation names _states_ not from/event pair    | **NO — drift**           |
| Error category    | none                                                   | dedicated **`Error state`** class (`AUTH-ERR-*`), no δ peer           | **NO — no peer**         |
| Event bucketing   | by event name (1 EV row per event)                     | split **producer** rows + **consumer** rows ("Audit subsystem")       | **partial**              |
| Contract keying   | one status per `CO-n` row                              | many statuses enumerated in one assertion cell (`200/401/403`)        | yes (multi-emit)         |

The four NO/partial rows are exactly the 30 auth misses. None is a δ defect; each
is an **identity-recovery** mismatch. The current `roundtrip/index.ts` already
generalizes the first three axes honestly (dialect auto-detect, `<FEAT>-<CAT>-<NNN>`
regex, opt-in `qualified` mode). The remaining four are the design surface.

### The general rule that subsumes both dialects

There is one structural invariant under all the surface variation:

> **Every oracle row names a (category, owning-concept, optional-local-id) triple,
> and the engine derives obligations carrying the SAME triple from the source docs.
> A round-trip is the agreement of these triples — NOT of the oracle's surface
> tokens.** The categories are a closed vocabulary (rule/calc/inv/post/contract/
> event/transition/query/mapping/workflow). The owning-concept is always a name
> the SOURCE docs already declare (an operation, a state-machine entity, an event,
> a query, a mapping). The only place dialects diverge is _which surface token
> carries the concept name_ and _whether the concept name matches the source
> heading exactly_.

So the bridge should not be "per-dialect parsers with per-axis special cases." It
should be **one normalizer that maps each side's surface tokens onto the shared
triple, with a small declared, per-feature DIALECT DESCRIPTOR supplying the few
facts that cannot be inferred from structure alone** (see §3).

## 2. What is already general vs. what is overfit risk (honest audit of current code)

GENUINELY general (keep):

- `parseCommittedSpec2` detects dialect from table SHAPE (`Test ID`+`Type` header),
  not feature name. Structural, correct.
- `<FEAT>-<CAT>-<NNN>` regex and the `TYPE_PREFIX` table map category vocabulary by
  pattern, not by feature. Correct.
- `qualified` mode is selected by dialect, not by `if feature == auth`. Correct in
  spirit. But see the flag below.

OVERFIT / smell (these are where the Skeptic should press, and I agree):

- `MAKEUP_CALC_IDS = new Set(["c4"])` in `engineSemanticId` is a **hard-coded
  financial-settlement constant baked into the generic normalizer.** This is a
  literal teach-to-the-test artifact: `c4` means nothing outside one feature. It
  must move into the per-feature descriptor (§3) as a declared `calc_alias`, or be
  derived from the "bare function call / prose → needs_formal" signal the δ already
  computes (the makeup calc IS the needs_formal calc; bridge by that property, not
  by the literal id `c4`).
- `qualified: true` is wired 1:1 to `dialect === "column-typed"`. That HAPPENS to
  be right for the whole corpus (all 5 column-typed features restart ids per op),
  but the causal rule is "ids restart per operation," not "table is column-typed."
  They are correlated in this corpus; conflating them is a latent overfit. Keep the
  default driven by an explicit `id_scope: per-operation | global` descriptor field
  that DEFAULTS from dialect but can be overridden — so a future global-id
  column-typed spec doesn't silently misalign.

## 3. The general bridging mechanism — a declared Dialect Descriptor

Replace the implicit, partly-hardcoded conventions with a small **per-feature
dialect descriptor** that the engine reads, with every field defaulting from
structure so the common case needs zero authoring. The descriptor is parsed FROM
the feature (frontmatter of TEST-SPEC.md or a sibling `oracle.dialect.yml`), never
compiled into the engine as feature-name branches.

```yaml
# oracle.dialect.yml  (all fields optional; shown values are the DEFAULTS)
dialect: auto # auto-detect by table shape; column-typed | rv-ct
id_scope: auto # auto = (column-typed -> per-operation, rv-ct -> global)
concept_aliases: # source-heading <-> oracle-concept name reconciliation
  # only needed when the oracle's owning-concept token != the source doc heading
  Session: SessionLifecycle # states.md heading is *Lifecycle; oracle drops it
  Token: TokenLifecycle
transition_identity:
  from-event # how to read a transition row's identity:
  #   from-event  : recover (from,event) — default, matches the engine key
  #   by-states   : Obligation cell names states only -> bridge to owning entity
  #                 bucket `transition:<entity>` on BOTH sides (concept-level, like PC)
event_bucket:
  by-event # by-event (default) | by-producer-consumer
  # by-producer-consumer: producer rows bridge to event name; consumer rows bridge
  #   to `event:<name>:consumer` which the engine ALSO emits (it already keys events
  #   by (event x consumer)). So this is recovery, not invention.
error_category:
  fold # fold = AUTH-ERR-* rows are coverage-equivalent to the
  #   rule/contract obligations of the same operation; bridge `error:<op>` to the
  #   union of that op's rule+contract obligations existing -> covered, not a new δ.
calc_aliases: {} # e.g. makeup policy calc -> {makeup: needs_formal-by-property}
```

How each of the four drift axes resolves WITHOUT per-feature `if`:

1. **Entity-name drift (`Session` vs `SessionLifecycle`).** The engine keys
   invariants/transitions by the states.md `## <heading>`. The oracle drops the
   `Lifecycle` suffix. Resolution: a `concept_aliases` map applied symmetrically at
   normalization. _Why this is real, not overfit:_ the alias is a declared FACT
   about this feature's naming, authored once, audited by a human; it is the exact
   opposite of the engine silently guessing `Session ≈ SessionLifecycle` (which
   R-004 forbids). The general rule "reconcile owning-concept tokens via a declared
   alias table" applies to any feature; auth just happens to need two entries.
   _Cheaper alternative I prefer:_ derive the alias structurally — match the oracle
   concept as a PREFIX of a source heading (`Session` ⊑ `SessionLifecycle`) and
   require the match to be UNIQUE; ambiguous prefixes fall back to the declared
   alias or surface as an honest miss. Prefix-uniqueness is a real structural rule,
   not a per-feature constant, and it auto-covers the four sibling features if they
   share the `<Entity>Lifecycle` convention (player-management states almost
   certainly do — to be verified in §4, NOT assumed).

2. **Transition keyed by row-id / by-states.** When the Obligation cell names
   states (not a from/event pair), set `transition_identity: by-states` and bridge
   BOTH sides to the concept bucket `transition:<entity>` / `invalid:<entity>` —
   identical to the postcondition op-bucket bridge already accepted (DEC-TDE-
   SEMANTIC-RIGOR-001 territory). _Why real:_ it is the SAME concept-bucket
   granularity already blessed for PC/WF/QT/MT; extending it to transitions is
   consistency, not a new leniency invented for auth. _Honest cost:_ it lowers
   transition rigor from `from:event` to `entity`. Flagged in §6 — this is the
   single most defensible-but-debatable move and the Skeptic should focus here.

3. **Error-state category.** `AUTH-ERR-*` rows assert "operation X's rule/contract
   violations map to documented error codes." The engine already derives every one
   of those rule + contract obligations. `error_category: fold` bridges `error:<op>`
   to the EXISTENCE of that op's rule/contract coverage. _Why real:_ it does not
   fabricate a δ; it asserts the error class is covered IFF the underlying
   rule/contract obligations are present — a derivable predicate, not a guess. _Flag:_
   if a future feature has an error row with NO underlying rule/contract obligation,
   `fold` MUST surface it as a miss, not absorb it. The bridge must be coverage-
   conditional, never unconditional.

4. **Producer/consumer event split.** The engine already keys events by
   `(event × consumer)` (see `deriveEvents`). The oracle's consumer rows ("Audit
   subsystem consumption") map to `event:<name>:consumer`. _Why real:_ the engine
   genuinely emits per-consumer obligations from events.md `### Consumed By` tables;
   we are recovering an identity the engine ALREADY produces, the strongest kind of
   bridge. Producer rows bridge to `event:<name>`. No invention.

The descriptor is the generalization: the engine ships ZERO feature names. Each
feature declares only the handful of facts structure cannot infer, and the common
feature declares nothing.

## 4. Corpus-generalization strategy (the answer to GATE-TDE-CORPUS-GENERALIZATION-001)

**N = 5 features**, all `column-typed`, plus the 2 `rv-ct` regression anchors = a
7-feature scored corpus (the 2 no-TEST-SPEC features are out of scope — nothing to
round-trip against). Rationale: the column-typed dialect is the corpus majority, so
"deterministic derivation generalizes" is only credible once the engine round-trips
the dialect as a CLASS, not once it passes one column-typed feature.

Order (each step is falsifiable before the next):

1. **financial-settlement + player-onboarding** (`rv-ct`) — already/likely PASS.
   Lock them as REGRESSION ANCHORS first. If any descriptor change breaks an anchor,
   the change is wrong. (player-onboarding has never been scored — verify it passes
   under the existing rv-ct path BEFORE touching anything.)
2. **auth-access-control** — the MVP target (§5). Drives the descriptor design.
3. **player-makeup, player-management** — the next two column-typed features. These
   are the real generalization test: if the auth descriptor's mechanisms (prefix-
   alias, by-states transitions, error-fold, consumer events) carry over with only
   NEW declared facts and NO new engine code, the generalization is genuine. If they
   need new engine branches, it was overfit to auth and I was wrong.
4. **player-progression, player-stats** — confirm at corpus scale.

**Exact definition of a round-trip PASS per feature** (this is the gate contract,
and the honesty firewall):

- `missing == 0` at the normalized-semantic-id level, OR every residual miss is
  listed in that feature's `documented_irreducible` set with a one-line source-
  grounded reason (e.g. "oracle catalogues a row with no source-doc origin").
- The `documented_irreducible` set is CAPPED and AUDITED: a PASS with a non-empty
  irreducible set is a "PASS-with-residue," reported separately from a clean PASS.
  A feature whose irreducible set grows to absorb misses is treated as a FAIL of the
  generalization, not a PASS. (This is the explicit anti-teach-to-the-test clause.)
- `extra` is unconstrained (engine completeness is allowed to exceed the oracle).
- byte-stable across two consecutive runs (determinism, already structural).
- Counts (`derived`, `committed`, `missing`, `extra`, `irreducible`) emitted to a
  per-feature row in a CORPUS-ROUNDTRIP-REPORT.md so the gate is one glanceable table.

The GATE passes when: both rv-ct anchors clean-PASS AND >=4 of 5 column-typed
features PASS (clean or documented-residue), with the residue ledger reviewed. I
deliberately do NOT require 5/5 — demanding 5/5 invites teaching-to-the-test on the
last stubborn feature. 4/5 + an honest residue note on the fifth is stronger
evidence than a suspicious 5/5.

## 5. MVP boundary — smallest change that makes auth round-trip honestly

The MVP is NOT "all four axes." It is the smallest honest set that closes the
largest, least-debatable share of the 30 auth misses, leaving the debatable ones
surfaced:

INCLUDE (high confidence, real recovery):

- (a) Remove the `MAKEUP_CALC_IDS=["c4"]` literal; replace with the needs_formal-by-
  property bridge (calc that δ flagged needs_formal ↔ oracle's id-less calc family).
  Pure de-overfit; also makes rv-ct cleaner.
- (b) `concept_aliases` via structural prefix-uniqueness (`Session ⊑ SessionLifecycle`),
  declared-override fallback. Closes the entity-name invariant misses.
- (c) Producer/consumer event recovery (`event:<name>:consumer`) — bridges to
  obligations the engine ALREADY emits. Closes 5 consumer-event misses for free.
- (d) `error_category: fold` as a COVERAGE-CONDITIONAL bridge. Closes the 5
  AUTH-ERR misses only where underlying rule/contract obligations exist.

DEFER to post-MVP (debatable rigor trade, do NOT bundle into MVP):

- (e) `transition_identity: by-states` concept-bucketing. This lowers transition
  rigor and should be a deliberate, separately-reviewed decision (it touches
  DEC-TDE-SEMANTIC-RIGOR-001). Until then, the by-states transition misses stay
  HONESTLY in `documented_irreducible` with the reason "oracle keys transitions by
  state name; engine keys by from/event; concept-bucket bridge pending rigor
  decision." That is an honest PASS-with-residue, not a hidden fix.

MVP exit: auth reaches `missing <= (the by-states transition rows)`, all of which
are documented-irreducible, and the rv-ct anchors stay clean. That is an honest
auth round-trip and it unblocks BLK-TDE-AUTH-CONVENTION-001 with the residue named.

## 6. Honest self-flag: where I am tempted to teach-to-the-test

The Skeptic is right to assume the worst; here are the three places I would attack
my own design, ranked by danger:

1. **`error_category: fold` is the most dangerous.** "The error row is covered iff
   the op's rule/contract obligations exist" can degenerate into "always covered,
   because every op has some rule." If I tune the fold predicate until AUTH-ERR-\*
   all vanish, I have taught to the test. GUARDRAIL: the fold must require the
   SPECIFIC error codes named in the oracle row to appear in the derived obligations'
   params, not merely "some rule exists." If the engine can't see the codes, it's a
   miss. I flag that the current δ may not carry error codes in params — if so, fold
   is NOT yet honest and must stay deferred. **This is the claim most likely to be
   overfit and I am not yet certain it survives.**
2. **The `qualified`/`id_scope` coupling.** It works for all 7 features only because
   this corpus perfectly correlates "column-typed" with "per-operation ids." That is
   a sample-of-7 coincidence, not a law. I am tempted to leave the coupling implicit
   because it passes. Resisting: make `id_scope` an explicit descriptor field so the
   PASS reflects a stated rule, not a lucky correlation.
3. **The 4/5 gate threshold.** A skeptic could say I picked 4/5 precisely so I can
   declare victory while one feature fails. Counter: I require the fifth's misses to
   be source-grounded and reviewed, and a clean 5/5 is still reported as such — 4/5
   is a floor, not a ceiling. But I concede the threshold is a judgment call the
   panel should ratify, not something I can prove.

Net: items (a)(c) are genuine derivation-coverage with no overfit (they recover
identities the engine already computes). Item (b) is real if prefix-uniqueness holds
across the corpus (must be VERIFIED on player-management, not assumed). Items (d)
and (e) are where bridging could shade into teaching-to-the-test, and I have
deferred (e) and guarded (d) precisely so the gate measures derivation coverage, not
my ability to make 30 misses disappear.
