# Stage Receipt — Boundary Cartographer (Design / separability)

- Role: Boundary Cartographer · agentId a0be9a6fdaa990ffb · verdict: **pass**
- Owns: layer dependency map, per-component separability, recommended cut line.

## Key findings

- **Zero code coupling between layers.** `implementation/domainspec` and `arcanum` are separate git submodules (`.gitmodules`: domainspec.git, Arcanum.git). 0 real `import`/`require` of arcanum in domainspec code; all 152 hits are `.arcanum/` runtime telemetry. ontologize/goldenquill reference domainspec/arcanum only in markdown. **The commercial split happens entirely inside `implementation/domainspec`; the other layers impose no structural constraint.**
- **The cut the owner proposed is structurally sound and partially pre-built.** The repo already split governance _mechanism_ (kernel) from _rules_ (subsystem): `internal_tools/vault_common/governance.py` ships an empty registry; `vault_governance/__init__.py` registers `_kernel_validators.py` via side-effect import. Don't import the package → `check_governance` returns `[]`. Cleanest cut in the repo.
- **Spec→test derivation has ZERO validator dependency** (`TEST-PIPELINE.md`, `domainspec-generate-tests` — 0 lean/validator hits). domainspec ships free WITHOUT validators and still fully functions.
- **Code-tag extraction (free) vs. validation (paid) is a clean file-boundary seam:** `validate-code-tags.ts` does not import `extract-code-tags.ts`; they share only type defs.
- **Lean validator is fully isolated** (own Lake project, no Python/TS import path) — the easiest piece to physically remove, premium-tier candidate.

## Cut line

- FREE core: spec authoring + spec→test pipeline; kernel mechanism (empty); code-tag extraction; reference backend modules; init/scope/glossary scaffolding.
- PAID layer: the 3 frontmatter validators + `vault_governance`; code-tag validate/composability/drift; Lean validator (premium); audit skills (alignment, layering); readiness/verify gates.

## Structural blockers

None. Only must-keep-free shared files are the mechanism shell + type defs (not "the product"). Soft risk: free engine emits artifact contracts (frontmatter schema, code-tags JSON shape, taxonomy edges) the paid layer keys off — must be published/versioned so paid stays drop-in. Versioning concern, not a coupling blocker.
