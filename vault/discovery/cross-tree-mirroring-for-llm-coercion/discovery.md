---
tags: [vault, ontology, folder-structure, fractal, l1-l2, llm-coercion, mirroring, cross-tree]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.1.0
last_updated: 2026-05-18
---

# Cross-Tree Mirroring for LLM Coercion — Three-Sibling Repo Structure

> A discovery extending `folder-structure-fractal/` from vault-internal layout to the cross-tree L₁↔L₂ case. Proposes three top-level repo siblings (`/research`, `/domain_knowledge`, `/implementation`) with a mirrored `apps/X/features/Y/` grammar shared by L₁ and L₂, and two distinct operations (promotion: residue→L₁; compilation: L₁→L₂). Warrant: the originating DomainSpec question is "can I force LLMs to write the right code?" — and a computable spec-lookup path is a precondition. Adversarial review forced material narrowing: T0' demoted from gate to deferred validation, "coercion" demoted to "navigational signal + validator enforcement," scope narrowed to `/domainspec` + maestro-trama-shaped repos.

---

## Objective

Decide the top-level shape of a DomainSpec repo such that:

1. An LLM agent editing any code path can mechanically compute the path of its governing spec, and vice versa.
2. Work-in-progress that has not yet earned an `(app, feature)` identity has a legitimate home (it is not forced into fake structure).
3. The distinction between *promoting residue into structure* and *compiling structure into code* is explicit and enforceable.

Scope: this discovery addresses cross-tree organization of `/domain_knowledge` ↔ `/implementation`, where the prior `folder-structure-fractal/` discovery addressed vault-internal layout. Both are needed; neither subsumes the other.

---

## 1. Business Context

### Why now

DomainSpec's originating question is engineering, not mathematical: **can I force LLMs to write the right code?** The functor formalism (Δ : L₁ → L₂, fractality, residue measurement) came afterward as the apparatus to make "right" *checkable* and "force" *mechanical*. Today's repos make neither cheap. maestro-trama is a worked example: an agent editing `apps/labeling-platform/features/extraction/SPEC.md` has no deterministic way to locate the L₁ spec it must be faithful to — last week's patch to that file invented `../../../../docs/features/...` (a path that does not exist; actual path is `docs/proposals/.../features/...`), and **50+ broken cross-links of the same pattern exist across `apps/labeling-platform/features/{extraction,dashboard,label-curation}/`** (lens 03 §2).

The failure is not aesthetic. It is the *same agent failure mode the framework exists to prevent*, performed on the framework's own substrate.

### What's broken

- **Asymmetric trees.** maestro-trama has four `docs/proposals/X/` with no `apps/X/` counterpart and four `apps/X/` with no `docs/proposals/X/` counterpart (lens 03 §1). The mapping is undefined.
- **Name collisions create drift.** `extraction/` exists at both `docs/proposals/ad-creative-dna/features/extraction/SPEC.md` and `apps/labeling-platform/features/extraction/SPEC.md`. Both were created in a single commit (2026-05-16 `ba48ca2`) with no arbitration. Content has begun to diverge (lens 03 §7).
- **Residue has no home.** Pre-structural work (exploratory notes, robot-talks, sessions, partial discoveries) scatters across `/vault/`, `/domain_knowledge/backlog/`, `/business-philosopher/`, and root-level `/docs/` singletons (lens 03 §3). When you don't know where to file something, you put it somewhere and hope.
- **No promotion mechanics.** The vault names a status gradient (`draft → exploratory → active → consolidated → evergreen`) but no constitution, script, or gate defines *when* something flips (lens 01 §4). maestro-trama is purely operator-driven (lens 03 §8). Backlog items from 2026-04-22 have never graduated, with no evidence that they ever will.
- **No compilation gate.** Nothing in any repo checks whether an L₁ spec is *sufficient* for code generation before code is written. SPECs ship with open questions, missing aspect docs, unresolved dependencies — and code is written against them anyway.

### What stays the same

- The prior `folder-structure-fractal/` verdict for vault-internal layout (D-1: top-level `vault/schema/` + `vault/instance/` siblings, `layer:` validator). This discovery does not touch it.
- Frontmatter-as-source-of-truth for `node_type` (per `epistemic-chain.md` A-4).
- The 21-edge catalog and bidirectionality rule in `ontology-conventions.md`.

---

## 2. Core Concepts

### C-1. Three top-level siblings: `/research`, `/domain_knowledge`, `/implementation`

The repo gains three mandatory top-level siblings:

- **`/research`** — residue holding pen. Pre-structural work that has not yet earned an `(app, feature)` identity. Sessions, exploratory notes, robot-talks, lenses-in-progress, ideas without a home. Filed by whatever organization makes sense locally (chronological, topical, free-form). **Sibling, not peer** — there is no Δ_research; this is not a third layer.
- **`/domain_knowledge`** — L₁. Structured under `apps/X/features/Y/{...}` grammar. Specs, discoveries, domain models, invariants. Every artifact has a known `(app, feature)` identity.
- **`/implementation`** — L₂. Mirrored under the *same* `apps/X/features/Y/{...}` grammar. Code, tests, ops, configs. Every artifact has a known `(app, feature)` identity and a structurally-locatable L₁ counterpart.

The two structured siblings (`/domain_knowledge`, `/implementation`) share their feature-grammar so any path on one side maps mechanically to the other. The unstructured sibling (`/research`) sits beside them because forcing pre-structural work into `apps/X/features/Y/` would *invent* the identity rather than earn it — a coercion failure that corrupts the residue.

### C-2. `/research` is theorem-anchored as residue holding pen, not a third layer

The theorem admits only two horizontal layers (`reflection-tower.md:281–300`; lens 02 §8). The L₁ side enlarges *vertically* across reflection-tower levels via free extension (`L₁ⁿ⁺¹ := L₁ⁿ ⊕ Carrier(μₙ)`); the framework does not admit a third horizontal layer with its own functor. `/research` therefore is **not** a peer layer; there is no Δ_research compiling research into knowledge. It is the holding pen where residue lives until it earns entry into L₁ — and "earns entry" is exactly the free-extension move the theorem already names.

This is also why a research-shaped artifact does not "compile" into a knowledge-shaped artifact. It *promotes* (changes identity in place), which is a distinct operation from compilation (lens 02 §5).

### C-3. Mirrored grammar in L₁ and L₂ admits 1-to-many ownership

The default mapping is `domain_knowledge/apps/X/features/Y/` ↔ `implementation/apps/X/features/Y/` — exact-name mirror. But adversarial A1 (lens 04) showed multi-app features break the unique-path assumption: maestro-trama's `extraction/` is genuinely owned by `ad-creative-dna` (L₁ proposal) and `labeling-platform` (L₂ app) at once.

The discovery concedes this: **L₁ specs are primary**; L₂ instances may be 1-to-many. When a feature is implemented by more than one app, the L₁ spec at `domain_knowledge/apps/<spec-name>/features/Y/` declares the implementing apps via an `IMPLEMENTED-BY.md` manifest at the feature root. Each `implementation/apps/<app-name>/features/Y/` carries a reciprocal `IMPLEMENTS.md` pointing back to the spec. The mirror is still computable — it just routes through the manifest when 1-to-1 fails.

### C-4. Promotion (residue → L₁): identity-earned + manual greenlight

Promotion moves an artifact from `/research` into `/domain_knowledge/apps/X/features/Y/` as a single operation. The conditions are binary:

1. **Necessary:** the artifact has an earned `(app, feature)` identity — author can name them without invention.
2. **Sufficient (triggering):** manual greenlight (operator-confirmed).

Optional observational signals (stability, citation pull, confidence threshold) are *not* gates. They surface candidates for greenlight but do not authorize promotion alone. This collapses adversarial A7's "underdefined signals" attack: signals are signals, not gates.

Partial identity (knows the app, not the feature, or vice versa) is filed under `domain_knowledge/apps/X/features/_unknown/` — the `_unknown/` slot is part of the grammar. Promotion to a real feature path is a frontmatter edit + `git mv` when the feature identity earns itself.

Demotion (L₁ → `/research`) is awkward but real: an L₁ artifact that gets falsified moves back to `/research/_demoted/<original-path>/` with provenance preserved. Open question — see OQ-3.

### C-5. Compilation (L₁ → L₂): T0' as aspiration, validator as gate

The theorem provides three formal admissibility conditions for Δ (T0'_C1 determinism, T0'_C2 image validity via edge-law reflexivity, T0'_C3 entropy bound via discrete Gibbs inequality — `DomainSpec.lean:123–200`, lens 02 §3). The `categorical-extraction-schema.md` operationalizes the diagnostic shape (`objects_unmapped`, `morphisms_unwitnessed`, etc. — lens 02 §6).

Adversarial A3 correctly observed that requiring full T0' (a Lean check) in every repo before compilation is infrastructure-ahead-of-content. **Concession**: T0' is the long-term aspiration, not the immediate gate. The immediate gate is a path-coherence validator (see C-6) that enforces *structural completeness* — every L₁ feature has a complete aspect set (SPEC, domain, operations, etc. per its node_type), every cross-reference resolves, every concept in the registry has an ID. Semantic infidelity is not caught by structural completeness alone (also an A3 observation); it is caught by the test-derivation step downstream, where if the test-designer cannot derive tests deterministically, the spec is underspecified and compilation is blocked.

### C-6. Cross-tree validator (generalize the `layer:` pattern)

The vault already has a path-coherence validator: `vault-folder-structure-constitution.md` defines a `layer:` frontmatter field that the validator cross-checks against the file's path (lens 01 §3). Files whose `layer:` disagrees with their path are rejected.

The same pattern generalizes to the cross-tree case. New invariants:

1. Every `implementation/apps/X/features/Y/` directory must have a counterpart `domain_knowledge/apps/X/features/Y/` (or be declared via `IMPLEMENTS.md` pointing to a multi-implemented spec).
2. Every `domain_knowledge/apps/X/features/Y/SPEC.md` must declare its `IMPLEMENTED-BY.md` (one or more `implementation/apps/Z/features/Y/`) or carry `status: spec-only` (no implementation expected yet).
3. No file outside `/research/` may sit at a path that cannot be parsed as `(layer, app, feature, aspect)`.

The validator is a pre-commit hook + CI gate. **This is the enforcement layer adversarial A4 required.** The "coercion" claim is *demoted* from "structure forces LLM correctness" to "structure is the signal, validator is the enforcement." The strong claim is reserved for a future discovery once we have measurement data — see OQ-1.

---

## 3. Decisions Taken

### D-1. Adopt three-sibling structure with mirrored L₁/L₂ grammar

- **Decision.** Ship `/research`, `/domain_knowledge/apps/X/features/Y/`, `/implementation/apps/X/features/Y/` as the top-level shape. Defer naming controversies to OQ-2.
- **Rationale.** Theorem admits exactly two horizontal layers (lens 02 §8) with residue as the dynamic complement (lens 02 §4–5); the three-sibling shape is the smallest layout that honors both. The mirrored grammar is the precondition for computable spec lookup, which is the precondition for LLM coercion.
- **Status.** Adopted as proposal verdict. Implementation cost named in D-6.

### D-2. Promotion = identity-earned + manual greenlight (binary)

- **Decision.** Promotion of a `/research` artifact into `/domain_knowledge/apps/X/features/Y/` requires (i) earned `(app, feature)` identity and (ii) operator-confirmed greenlight. Partial identity files under `_unknown/`. Other signals are observational, not gating.
- **Rationale.** Lens 01 §4 + lens 03 §8 confirmed no promotion mechanics exist anywhere; this is greenfield. Identity-earned is the only condition with structural justification (it is what makes the artifact fit the grammar); everything else is heuristic. Adversarial A7 forced the binary rule.
- **Status.** Adopted.

### D-3. Compilation = T0' deferred, structural-completeness validator enforces

- **Decision.** L₁ → L₂ compilation is gated on a structural-completeness validator (C-6) plus downstream test-derivability, not on a full T0' Lean check. T0' becomes the long-term aspiration.
- **Rationale.** Adversarial A3 — requiring Lean tooling in every repo is infrastructure-ahead-of-content. The structural validator can ship in ~200 LoC; T0' requires a theorem prover and an L1.json/L2.json/delta.json extractor that does not yet exist for non-toy projects (lens 02 §6).
- **Status.** Adopted with explicit deferral; T0' tracked in OQ-4.

### D-4. Demote "coercion" to "navigational signal + validator enforcement"

- **Decision.** The discovery's load-bearing claim is **not** "structure forces LLM correctness." It is "structure provides a computable spec lookup, enforced by a path-coherence validator; LLM coercion is the long-term hypothesis this enables." A future discovery establishes the measurement plan.
- **Rationale.** Adversarial A4 — the strong claim is rhetorical without (a) measurement or (b) enforcement. The validator delivers (b) in this discovery; (a) is deferred to OQ-1. This mirrors the prior discovery's D-3 honesty move (drop S5/Kauffman framings as load-bearing).
- **Status.** Adopted. The strong claim is recoverable — it is not abandoned, it is parked behind measurement.

### D-5. Narrow scope to `/domainspec` + maestro-trama-shaped repos

- **Decision.** This discovery's structural prescription applies to repos that have or will have `/domain_knowledge` and `/implementation` (or equivalents): `/domainspec`, `/maestro-trama`. `/house_project` (third "product-schema" layer), `/financas_pessoais` (no vault), `/football-stats-oracle` (different lens vocabulary) require separate discoveries.
- **Rationale.** Adversarial A6 — five repos are not isomorphic. The prior discovery's D-2 already blocked cross-repo rollout pending a canonicalization protocol; this discovery does **not** claim to be that protocol. It is the cross-tree prescription for the two repos where it fits.
- **Status.** Adopted. OQ-5 for the missing repos.

### D-6. maestro-trama is the pilot

- **Decision.** maestro-trama executes the migration first. Concrete cost estimate (per adversarial A5): ~40 files to relocate under the new top-level grammar, ~150 link rewrites (50 currently broken + ~100 valid links breaking under the new structure), ~8h of human decision-making on the `business-philosopher/` placement and the `extraction/` collision arbitration. Estimated total: **20–30h** vs the prior discovery's vault-only 14h baseline (≈2× — within the adversarial estimate of 2–3×).
- **Rationale.** maestro-trama already has the asymmetry pathologies the discovery diagnoses (lens 03). Fixing it is both pilot and forcing function.
- **Status.** Adopted contingent on `/domainspec` adopting the new top-level shape first (so maestro-trama follows a precedent, not pioneers blind).

---

## 4. Alternatives Considered

### A-1. Two siblings only (`/domain_knowledge`, `/implementation`); residue lives inside L₁ as `research/` subfolders

**Rejected.** This was the early-conversation position. It collapses on the case where research does not yet know its `(app, feature)` — you cannot file it inside the structured grammar without inventing the path. Inventing the path defeats the purpose. Theorem agrees: residue is the structural complement of compilation (lens 02 §4), not an internal annotation of structured content.

### A-2. Three peer layers with their own functors (`/research`, `/domain_knowledge`, `/implementation`)

**Rejected.** Mid-conversation position. Theorem refuses (lens 02 §8): only two horizontal layers admitted; vertical growth via reflection tower is the formalism's allowance for new structure. A third functor Δ_research : L_research → L_domain_knowledge has no anchor.

### A-3. Recursive fractal all the way down (the prior discovery's lens 02 maximal proposal)

**Rejected** — already rejected by the prior discovery on cost and structural-grammar-degeneracy grounds. This discovery does not reopen.

### A-4. Frontmatter-only (`layer: research|knowledge|implementation`, no folder moves)

**Rejected as primary.** Loses the navigational stratification; agent retrieval still has to read frontmatter to discriminate. **Adopted as complement** to D-1 per the validator (C-6).

### A-5. Manifest-only without folder move (`IMPLEMENTED-BY.md` cataloguing what is where, no restructure)

**Rejected.** This was the prior discovery's Option B for the same shape question. It keeps Δ implicit and unenforceable. Without the structural mirror, the LLM has no computable path to traverse, only a manifest to look up — and the manifest itself is a file that can become inconsistent. The discovery uses manifests for the multi-app case (C-3) precisely because that case breaks the structural mirror; using manifests as the *primary* mechanism would defeat the warrant.

---

## 5. Open Questions

### OQ-1. Falsification test for the LLM-coercion claim

**Status: open, blocking strong-claim recovery.** D-4 demoted "coercion" to "navigational signal + validator enforcement" precisely because we have no measurement. What measurement would suffice? Candidate: instrument N LLM-authored edits in maestro-trama (pre-migration baseline) vs post-migration; measure rate of broken cross-references, rate of spec-divergent code, rate of correct-on-first-try edits. If the structural mirror does not move these rates, the warrant is rhetorical and the discovery should be reframed as "navigation aid" with no LLM-coercion claim at all. **Recommendation:** dispatch a separate measurement discovery before any future discovery promotes the strong claim back.

### OQ-2. Naming

**Status: open, low-cost.** `/research` vs `/discovery` (matches existing `node_type: discovery` vocabulary); `/domain_knowledge` vs `/knowledge` (shorter, works for non-domain repos); `/implementation` vs `/code` vs `/apps` (apps is already the de-facto L₂ name in maestro-trama). **Recommendation:** pick at first migration commit; bikeshed in PR review, not here.

### OQ-3. Demotion mechanics (L₁ → `/research`)

**Status: open.** C-4 sketches `/research/_demoted/<original-path>/` but does not specify how inbound edges are handled. The prior discovery's OQ-3 on the same topic (premise+axiom merging) noted that promotion/demotion via `git mv` breaks inbound edges per `epistemic-chain.md` OQ-6. The same problem holds here. **Recommendation:** pin to `epistemic-chain.md` OQ-6 resolution; until then, demotion is rare enough that operator-driven edge-rewriting is acceptable.

### OQ-4. T0' operationalization

**Status: open, long-horizon.** D-3 deferred T0' to "long-term aspiration." When does it become an actual gate? Likely when an L1.json/L2.json/delta.json extractor exists for real repos (not just `domainspec-theorem/internal_tools/` toys) and when at least one DomainSpec repo has Lean infrastructure ambient. **Recommendation:** no action until both preconditions land; reopen then.

### OQ-5. Cross-repo applicability to non-pilot repos

**Status: open, blocking.** D-5 narrowed scope to `/domainspec` + maestro-trama. `/house_project`'s third "product-schema" layer, `/financas_pessoais`'s vault-less shape, `/football-stats-oracle`'s `raw/` vocabulary all require separate discoveries. Until they exist, the three-sibling structure is repo-specific, not DomainSpec-wide. The prior discovery's OQ-4 (cross-repo schema-canonicalization protocol) is upstream of this. **Recommendation:** dispatch a per-repo discovery for each before any rollout claim.

### OQ-6. `business-philosopher/` placement

**Status: open, narrow.** maestro-trama's `business-philosopher/` is essays + persona + write-style — neither residue (it has its own discipline), nor knowledge in the `(app, feature)` sense, nor code. Candidates: keep as a fourth top-level sibling with `legacy: true` marker; absorb into `/research/business-philosopher/`; promote essays individually into `/domain_knowledge/` as they earn identity. **Recommendation:** keep as fourth sibling for now; decide during pilot migration when concrete content forces the call.

### OQ-7. Generated content (LLM drafts, embeddings, data products)

**Status: open.** Not covered by the three siblings. Embeddings, derived CSVs, LLM-produced drafts are neither residue (they have a generation provenance) nor specs nor implementation code. **Recommendation:** treat as L₂ artifacts under the `(app, feature)` grammar (`implementation/apps/X/features/Y/data/` or `…/generated/`); revisit if volume forces a separate sibling.

---

## 6. Provenance and Epistemic Honesty

This discovery was produced by a four-lens dispatch over a single session (2026-05-18):

- **Lens 01** (vault prior-art sweep) — established that `folder-structure-fractal/` covers the vault-internal case and explicitly *demoted* theoretical framings (including the LLM-forcing warrant this discovery re-elevates) from load-bearing status. Confirmed OQ-4 of the prior discovery (cross-repo canonicalization protocol) is unresolved and this discovery does not claim to resolve it.
- **Lens 02** (domainspec-theorem anchors) — extracted the formal grounds: two-layer is theorem-locked, residue is dynamic, Δ is a Left Kan extension (computable), T0' obligations as compilation admissibility, promotion ≠ compilation.
- **Lens 03** (maestro-trama evidence inventory) — produced the exhaustive asymmetry table, broken-link count (50+), feature inventory, and confirmation that no promotion policy exists anywhere in the repo.
- **Lens 04** (adversarial attack) — five landing attacks (A1 multi-app, A3 T0' premature, A4 coercion rhetorical, A6 cross-repo conflation, A7 underdefined signals); two partial (A2 partial identity, A5 cost). All folded as concessions in Decisions Taken.

Per `ontology-conventions.md` §Applicability, discovery files omit top-level `veracidade` and `convicção`; per-decision confidence inline: D-1 medium-high (theorem-anchored structure); D-2 medium (binary rule is right but greenfield); D-3 high (T0' deferral is forced by infrastructure reality); D-4 high (demotion is honest and reversible); D-5 high (matches prior discovery's D-2 pattern); D-6 medium (cost estimate is rough).

The discovery deliberately does **not** make a strong LLM-coercion claim (D-4). That claim is recoverable once OQ-1's measurement lands. Until then this is a structural prescription with the *hypothesis* of coercion behind it, not a coercion *result*.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/folder-structure-fractal/discovery.md` | `derives-from` | Prior discovery on vault-internal layout. This one extends to cross-tree L₁↔L₂. Inherits D-1 unchanged (vault siblings); generalizes the `layer:` validator pattern to cross-tree (C-6). |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/lenses/01-vault-prior-art.md` | `derives-from` | Lens 01 evidence base from the vault. |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/lenses/02-theorem-anchors.md` | `derives-from` | Lens 02 formal grounds from domainspec-theorem. |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/lenses/03-maestro-trama-evidence.md` | `derives-from` | Lens 03 empirical inventory in the pilot repo. |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/lenses/04-adversarial-attack.md` | `derives-from` | Lens 04 adversarial review; concessions folded into D-1 through D-6. |
| `vault/discovery/cross-repo-rollout/discovery.md` | `cites` | Companion discovery on per-repo internal_tools surface; OQ-5 here is downstream of that line of work. |
| `vault/discovery/two-layer-platform-architecture/README.md` | `cites` | The schema/instance discipline at infrastructure scale; this discovery mirrors it at the cross-tree scale. |
| `vault/discovery/graph-as-residue-attractor/README.md` | `cites` | Residue-as-attractor framing motivates `/research` as theorem-grounded sibling. |
| `domainspec-theorem/docs/reflection-tower.md` | `cites` | Two-layer + residue formalism (C-2, lens 02 §4 and §8). |
| `domainspec-theorem/lean-formalization/DomainSpec.lean` | `cites` | T0' obligations (C-5, D-3, lens 02 §3). |
| `domainspec-theorem/docs/categorical-extraction-schema.md` | `cites` | JSON diagnostic shape for future T0' operationalization (lens 02 §6). |
| (external) `maestro-trama/docs/repo-mirroring-problem.md` | `cites` | The brief that surfaced the problem; this discovery is the formal response. |
| `vault/discovery/system-modeling-partition-architecture/discovery.md` | `derives` | The partition-architecture discovery extends this L₁↔L₂ mirror with an ownership-primary top-level axis and a promotion-vs-routing migration model; it inherits the "navigational signal, not correctness guarantee" demotion recorded here. |
| `vault/discovery/agent-context-boundary-rule/discovery.md` | `cited-by` | The agent-context boundary rule applies this discovery's "structure is navigational signal, enforcement is the validator" demotion to the CLAUDE.md + MEMORY.md boundary object. |

---

## Source dispatch

- **Source findings:** four lenses under `lenses/` (01–04), dispatched 2026-05-18 as a single session, sequential (01→02→03 parallel-spawn, 04 follow-up after 01–03 returned).
- **Dispatch type:** Wave-1 evidence-gathering (lenses 01–03 parallel) followed by Wave-2 adversarial single-lens (lens 04).
- **Promotion:** lifecycle step 7 user-gate pending. Knowledge-scope target (vault-internal to `/domainspec`).
