# @domainspec/test-derivation-engine

Deterministic test-derivation engine. Compiles a feature's **canonical Markdown feature docs** into **byte-stable test obligations** — with **no LLM and no network** in the derivation path, so determinism holds _by construction_ (paper claim C2).

> Replaces the LLM-backed `domainspec-generate-tests` / `domainspec-test-designer` derivation. See the design baseline in
> [`../../development/deterministic-test-derivation-engine/`](../../development/deterministic-test-derivation-engine/)
> (SPEC, ARCHITECTURE, GLOSSARY, WORK-PACK) and the refinement evidence in
> [`../../development/refinement-runs/2026-06-12-test-derivation-c2-cluster/`](../../development/refinement-runs/2026-06-12-test-derivation-c2-cluster/).

## Pipeline

```
parse (docs → G) → derive (δ: pure) → obligation_key (sha1) → emit_spec / emit_tests
```

- `src/grammar/` — strict-grammar parser → typed concept graph `G` (SWU-ENG-001)
- `src/ir/` — `G` types (Node/Edge/Obligation), deterministic serialization
- `src/rules/` — pure δ rule functions with **exact** cardinalities (SWU-ENG-003)
- `src/keys/` — `obligation_key = sha1(source_anchor | rule_type | canonical_params)` ✅ implemented
- `src/emit/` — `emit_spec` (TEST-SPEC.md) and `emit_tests` (runnable vitest)
- `src/roundtrip/` — L0 falsification gate: engine set ⊇ committed ⇒ PASS

## Status

**L0 skeleton (SWU-ENG-000).** Pipeline wired; `obligation_key` + round-trip comparison implemented and tested. Parser and δ rules are typed stubs — next units: SWU-ENG-001 (parser), SWU-ENG-003 (δ rules), SWU-ENG-005 (round-trip against `financial-settlement`).

## Develop

```bash
# from this folder (deps resolved via the workspace toolchain / pnpm dlx tsx)
pnpm install        # or: pnpm dlx tsx, matching repo convention
pnpm run typecheck  # tsc --noEmit
pnpm run test       # vitest run
```
