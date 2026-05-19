# Project Decisions — lean-code-validator (v3)

## Objective

This document records resolved and unresolved multi-option decisions for v3, with status, owner, and rationale. It is the project-level authority for blockers — no feature pipeline (`domainspec-pipeline lean-code-validator`) should run while any decision here is `blocked`. Each decision lists the option chosen (or pending), the alternatives considered, and what the choice commits us to downstream.

## Conventions

- **Status**: `decided` (resolved, locked unless reopened with reason) | `pending` (open, with proposed default) | `blocked` (no default, ships nothing until resolved)
- **Owner**: who can change the decision
- **Default**: what v3 ships if not actively decided otherwise

---

## Resolved

### D1 — Tool framing: grader, not gate

- **Status**: decided
- **Owner**: operator (Victor)
- **Decision**: v3 is a **grader** that always runs to completion and emits a `CodegenReadinessReport`. It does not reject specs.
- **Alternatives considered**: binary pass/fail certificate (`Prop`-valued); numeric 0–100 score.
- **Rationale**: gating before the obligation table is calibrated would block real specs on unconfirmed rules. Grading converts overspecification risk into a calibration signal (dismissal frequency drives v4 softening).
- **Commits us to**: per-predicate `pass | warn | fail` grades; `Finding` records carrying concrete witnesses + recommendations; no `Prop`-valued certificate.

### D2 — Authority direction

- **Status**: decided
- **Owner**: methodology owner (`domainspec-core` maintainer)
- **Decision**: `domainspec-core` defines vocabulary → v3 implements/checks. Where parser σ disagrees with canonical σ, **canonical wins**.
- **Alternatives considered**: parser-defined σ (status quo); negotiated σ (parser and canonical agree case-by-case).
- **Rationale**: single source of truth; prevents v3 from baking unreviewed schema decisions into a "verified" tool.
- **Commits us to**: lifting σ-triples from paper Tables 3 & 4; flagging parser/canonical mismatches as parser bugs to fix in `audit_richness.py`.

### D3 — No Mathlib

- **Status**: decided
- **Owner**: tool maintainer
- **Decision**: v3 stays self-contained Lean 4. No `import Mathlib`.
- **Alternatives considered**: pull in `Mathlib.CategoryTheory` for the categorical M6-graph work eventually; pull in `Mathlib.Data` utilities only.
- **Rationale**: parity with v2; keeps build fast and dependency-free; categorical work is explicitly out of scope (Claim B Wall).
- **Commits us to**: implementing `Decidable` instances by hand where needed; no `Quiver`, `Functor`, `KanExtension` machinery; cycle-detection written from scratch.

### D4 — Vocabulary scope: lift the full canonical 25/29

- **Status**: decided
- **Owner**: tool maintainer
- **Decision**: v3 encodes the full vocabulary from `domainspec-core` — 25 metas, 29 edges across R_B, R_U, R_X, R_CF — even though only R_B is exercised by current in-repo specs.
- **Alternatives considered**: ship only R_B (12 edges) and grow incrementally; ship everything except R_U; ship the canonical 26 (no Saga).
- **Rationale**: cheaper to encode the whole table once than to gate it behind future migrations; profile-aware membership keeps unused vocabulary inert.
- **Commits us to**: `Sigma.lean` carrying all 29 edge declarations; `Profiles.lean` membership predicates for both profiles; warnings (not failures) when unsigned R_U edges are used.

### D5 — Profile declaration mechanism: frontmatter

- **Status**: decided (with upstream caveat)
- **Owner**: tool maintainer; upstream alignment owed to `domainspec-core` methodology owner
- **Decision**: an L1 spec declares its profile via top-of-file frontmatter `profile: paper-baseline` (or `composition-extension`). Default if absent: `paper-baseline`.
- **Alternatives considered**: CLI flag at parse time; folder convention (`examples/baseline/`, `examples/composition/`); embedded in SPEC.md `## Profile` section.
- **Rationale**: per-spec, locality of reference; survives moving the spec; doesn't require parser CLI changes.
- **Commits us to**: a parser change to read frontmatter `profile` and emit it as a field on the generated Lean `Spec`. Caveat: this convention is not yet documented in `domainspec-core` — needs upstream PR.

### D6 — R_CF version: canonical 3 only

- **Status**: decided
- **Owner**: tool maintainer
- **Decision**: v3's `compositionExtension` profile ships the canonical 3 R_CF edges (`produces-for`, `triggers-cross`, `enforces-cross`) only. The 2 empirical extras from E9 (`references`-as-CF, `orchestrates`-as-CF) are NOT in any v3 profile.
- **Alternatives considered**: ship 5 (paper-canonical + E9-empirical); ship 5 behind a third `composition-extension-experimental` profile.
- **Rationale**: E9 extras have not been ratified back into DEFINITIONS.md DS-D2; v3 is a verified tool and should not anticipate ratification.
- **Commits us to**: a spec using `references`-as-CF gets a `WARN` ("uses E9-experimental edge type, not canonical"). Reopen if/when DEFINITIONS.md updates.

### D7 — v2 backward compatibility: freeze, don't dual-format

- **Status**: decided
- **Owner**: tool maintainer
- **Decision**: v2's `examples/ZagrMarketplace.lean` moves to `examples/_v2/ZagrMarketplace.lean` and stays compilable. v3 regenerates fresh against the new format. No dual-format support.
- **Alternatives considered**: support both v2 and v3 schemas in `Sigma.lean` via a versioning union; deprecate v2 entirely.
- **Rationale**: dual-format doubles the surface; freeze-and-link gives a clean diff target without ongoing maintenance cost.
- **Commits us to**: a one-time copy of v2 files into `_v2/`; updating any external doc that references `examples/ZagrMarketplace.lean`.

---

## Pending

### D8 — Output surface: Lean `#eval` only, or also JSON?

- **Status**: pending
- **Owner**: operator
- **Default if not decided**: Lean `#eval` only. JSON output deferred to v4.
- **Options**:
  - **A**: Lean `#eval` only — print structured report via `Repr` instance. Simplest.
  - **B**: Lean `#eval` + JSON emission — adds a `toJson : CodegenReadinessReport → String` and a small CLI wrapper. Required if v3 is to be consumed by `domainspec-readiness-gate` or any non-Lean tool.
  - **C**: Markdown report emission — a third surface mainly for human-readable PR comments.
- **Trigger to decide**: any concrete consumer beyond a human reading `#eval` output.
- **Risk if deferred**: if the readiness-gate integration becomes urgent, v4 has to backfill JSON — small one-time cost, not a blocker.

### D9 — Integration with `domainspec-readiness-gate`

- **Status**: pending
- **Owner**: methodology owner + operator
- **Default if not decided**: standalone v3, no integration.
- **Options**:
  - **A**: Standalone — v3 is run manually or in a per-feature CI job; no coupling to `domainspec-readiness-gate`.
  - **B**: Integrated — `domainspec-readiness-gate` calls v3 as a `--codegen-check` sub-stage and folds its grade into the overall verdict.
- **Trigger to decide**: feedback from at least one team using v3 standalone for a quarter.
- **Risk if deferred**: low. Integration is additive.

### D10 — Per-finding suppression in v3?

- **Status**: pending
- **Owner**: tool maintainer
- **Default if not decided**: NO suppression in v3. All `WARN`s and `FAIL`s show on every run.
- **Options**:
  - **A**: No suppression — author has to re-read all warnings every run; calibration signal is strong (dismissal-by-ignoring).
  - **B**: Frontmatter suppression keys per finding ID — `# codegen-readiness-suppress: P3.Operation.AcceptInvitation`. Cleaner UX, but adds parser surface.
- **Trigger to decide**: persistent author complaints about noise after first 3 specs grade through v3.
- **Risk if deferred**: low. Adds in v4 with no schema migration.

### D11 — `isCodegenDependency` partition

- **Status**: pending
- **Owner**: tool maintainer (with optional spec-author input)
- **Default if not decided**: ship our proposed partition with explicit comments per edge type. Misclassifications produce `WARN` cycles.
- **Proposed partition** (v3 default, consistent with `spec/queries.md`):
  - **Codegen dependency** (target type must be emitted before source type): `performs`, `produces`, `enforces`, `calculates`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits` (R_B, all except `transitions`); `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors` (all R_X)
  - **Not codegen dependency**: `transitions` (R_B — runtime state change, no compile-time type import); all 8 R_U edges (intra-UI-layer composition, no cross-layer import)
  - **Profile-gated**: R_CF edges (`produces-for`, `triggers-cross`, `enforces-cross`) are codegen dependencies only in `compositionExtension`; absent from `paperBaseline`.
- **Trigger to decide**: any P5 `WARN` cycle that the spec author considers legitimate.

### D12 — Grade for unsigned R_U edges (A7 in INITIAL-DEFINITIONS)

- **Status**: pending
- **Owner**: tool maintainer
- **Default if not decided**: `WARN`. Rationale: the gap is upstream (`domainspec-core` paper §4.2), not the spec author's fault.
- **Options**:
  - **A**: `WARN` — surfaces the gap without blaming the spec.
  - **B**: `FAIL` — pressure-tests the upstream gap by making R_U specs grade `fail` until the paper is extended.
- **Trigger to decide**: when the first real UI spec lands in `examples/`.

---

## Blocked

(None at present.)

---

## Cross-cutting policies

These are not single decisions but standing rules.

- **Source of truth for vocabulary**: `domainspec-core/research/projects/domainspec/definitions/DEFINITIONS.md` + `papers/domainspec-paper.md` Tables 3 & 4. Any v3-internal disagreement is a v3 bug.
- **Source of truth for parser behavior**: `scripts/audit_richness.py`. Any documented behavior that disagrees with code is a doc bug.
- **Migration strictness**: strict. v3 does not accept v2-format Lean files. v2 examples live frozen in `_v2/`.
- **Verification baseline command** (per `domainspec-start` Step 4 requirement): `lake env lean --run internal_tools/lean-code-validator/examples/ZagrMarketplace.lean` should print a `CodegenReadinessReport` once Step 1 of the build sequence ships.
