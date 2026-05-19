---
tags: [lean-code-validator, mappings, parser, lean-emitter]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Mappings: lean-code-validator

> Both mappings are implemented in `scripts/audit_richness.py` — external to the Lean codebase. They define the seam between L1 markdown specs and the Lean grader.

---

## MarkdownToSpec

**Maps:** L1 markdown spec file → typed-graph JSON

Parses a DomainSpec L1 markdown spec and extracts:
- Declared concepts with their meta-type classification.
- Typed edges with provenance (`declared`, `contextInferred`, `sigmaFallback`).
- Unresolved concept references (names that appear in markdown but cannot be resolved to declared concepts).
- Profile frontmatter (`profile: paper-baseline` or `profile: composition-extension`).
- Structural counts per concept.

**Current limitations (v2 parser, to be extended in v3 Step 2):**
- Extracts 12 R_B edge types only; R_U, R_X, and R_CF edges are missing.
- Provenance and structural counts are extracted but dropped at output — v3 adds them to the emitter.
- No frontmatter profile parsing yet.

**v3 additions (four one-line changes to the emitter):**
1. Emit `profile` field from frontmatter; default `paper-baseline` if absent.
2. Emit `edgeProvenance` per edge.
3. Emit `unresolvedRefs` list.
4. Emit `conceptCount` per spec.

**Authority:** `scripts/audit_richness.py`. Any documented behavior that disagrees with code is a doc bug.

---

## SpecToLean

**Maps:** typed-graph JSON → Lean [Spec](domain.md#spec) instantiation (`.lean` file)

Serializes the parsed typed-graph JSON as a Lean `structure` literal that can be `import`ed or `#eval`'d directly. The emitted `.lean` file contains one top-level `def specName : Spec := { ... }` declaration.

**Emits:** a file like `examples/ZagrMarketplace.lean` containing `def zagrMarketplaceSpec : Spec := { profile := paperBaseline, conceptSpace := ..., edges := [...], unresolvedRefs := [...], conceptCount := N }`.

**Constraint:** the emitted Lean file must type-check with no `sorry` placeholders for P2-valid edges. Edges that fail σ-typing get a marked `sorry`-placeholder proof, which Lean surfaces as a warning — this is the v3 P2 signal.

**Authority:** `scripts/audit_richness.py` (same file as [MarkdownToSpec](#markdowntospec); the parse and emit steps are a single pipeline).
