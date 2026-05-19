# lean-code-validator

Machine-checked structural validator for DomainSpec L1 specs. Self-contained Lean 4, no Mathlib.

Successor to `/lean-richness-proof` (v1). Current generation: **v3** (Layer 1 shipped, Layer 2 deferred).

## Standing verification command

```
lake env lean internal_tools/lean-code-validator/examples/ZagrMarketplace.lean
```

Prints a `CodegenReadinessReport`. Required to pass before any PR touching this directory.

## Layout

```
internal_tools/lean-code-validator/
├── lakefile.toml                  -- lake project, single [[lean_lib]]
├── lean-toolchain                 -- leanprover/lean4:v4.30.0-rc2
├── LeanCodeValidator.lean         -- root, re-exports submodules
├── LeanCodeValidator/
│   ├── Sigma.lean                 -- 25 Meta, 29 EdgeType, 2 Profile, sigmaValid
│   ├── Profiles.lean              -- profile membership, isCodegenDependency (D11)
│   ├── Richness.lean              -- ConceptSpace, EdgeRow+provenance, Spec, m6Witnesses
│   └── Report.lean                -- Grade, gradeP1, gradeP5, gradeFor (Layer 1)
├── examples/
│   ├── ZagrMarketplace.lean       -- v3 reference example (hand-written)
│   ├── ZagrMarketplaceGen.lean    -- emitter regeneration of zagr-marketplace
│   ├── FaultInject.lean           -- adversarial harness (P1 fail, P5 fail, R_CF ok)
│   └── _v2/                       -- frozen v2 examples (self-contained, no v3 imports)
├── PLAN.md                        -- implementation plan (Steps 0–6)
├── spec/                          -- design specs (DS-D1…D11, PROJECT-DECISIONS)
├── research/                      -- σ-signature source tables (paper Tables 3 & 4)
└── discovery/                     -- session notes during spec bring-up
```

## Concepts

**Profile** (Sigma.lean). Two values: `paperBaseline` (24 metas, 26 edge types) and `compositionExtension` (adds `Saga` + 3 R_CF edges).

**σ-signature** (Sigma.lean → `sigmaValid : Profile → EdgeType → Meta → Meta → Bool`). Sourced from paper Tables 3 (R_B) and 4 (R_X); R_U unsigned (paper §4.2); R_CF only valid in `compositionExtension` (D6).

**EdgeRow** (Richness.lean). Carries `wellTyped : sigmaValid p edge (metaOf src) (metaOf tgt) = true`. Profile-correct by construction — an ill-typed edge for the declared profile cannot be constructed. **Theorem 1** (`all_edges_well_typed`) follows by induction and is free.

**EdgeProvenance** (Richness.lean). `declared | contextInferred | sigmaFallback`. Used by P4 (Layer 2). Emitter defaults to `.declared` until the parser tracks provenance per edge.

**Spec** (Richness.lean). Telescopic record: `profile`, `conceptSpace` (with explicit `concepts : List Concept`), `edges : List (EdgeRow profile conceptSpace)`, `unresolvedRefs : List String`, `conceptCount : Nat`.

## Grading (Layer 1)

`gradeFor : Spec → CodegenReadinessReport` runs four predicate checks and aggregates via worst-component rule (fail > warn > pass).

| Predicate | Status   | What it checks |
|-----------|----------|----------------|
| P1        | **real** | schema closure — every `unresolvedRefs` entry is a fail |
| P2        | free     | σ-typing — structural via `EdgeRow.wellTyped`, no grader entry |
| P3        | stub     | per-meta obligation table — pass unconditionally (Layer 2) |
| P4        | stub     | M6 ambiguity via `provenance` — pass unconditionally (Layer 2) |
| P5        | **real** | acyclicity of the codegen-dependency subgraph (gray/black DFS, no Mathlib) |

P5 filters edges by `isCodegenDependency` (D11): R_B except `transitions`, all R_X, all R_CF; not R_U.

## Python emitter

```
python3 scripts/audit_richness.py <spec_dir> --emit-lean <out.lean> [--lean-namespace NS]
```

Emits a v3-format Lean file that imports `LeanCodeValidator.Report`, builds a `Spec` record, and ends with `#eval gradeFor spec`. Reads optional `profile:` YAML frontmatter from `SPEC.md` (defaults to `paperBaseline`). Unresolved targets are routed into `Spec.unresolvedRefs` (P1 input).

## What's deferred to Layer 2

- **P3** — per-meta obligation table. Stubbed; calibration depends on EX1 output.
- **P4** — wrap `m6Witnesses` and grade by `EdgeProvenance` (declared → fail, sigmaFallback → warn).
- **Per-edge provenance in the parser** — emitter currently emits `.declared` for every edge.

## What's deferred beyond v3

Tracked in `PLAN.md` under "Deferred":
- JSON report emission (D8)
- Per-finding suppression (D10)
- `FindingLifecycle` state machine (A5)
- `domainspec-readiness-gate` integration (D9)
- Self-application (EX3)

## What this still does not prove

- **Below the Claim B Wall** — the spec is taken as given.
- **Lan-faithful, not full** — no `Functor.Full` claim. See `/lean-richness-proof/docs/toward-categorical-spec-semantics.md` for the categorical roadmap (`Quiver Meta`, Spec-as-presheaf, the open M6-graph theorem).
- **Parser artifacts** — incidental markdown links accepted as σ-fallback edges may surface as M6 witnesses. Once P4 lands, `sigmaFallback` provenance will surface this as a WARN rather than treating it as real residue.
