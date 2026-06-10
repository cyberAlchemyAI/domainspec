# DomainSpec → Arcanum Integration Research

Status: **candidate research** (route output, not an approved migration)
Dispatch: `domainspec-into-arcanum-research-20260610`
Grounded in: `implementation/domainspec/development/COMMERCIALIZATION-SYNTHESIS.md` (v0.2.0)
Generated: 2026-06-10

> Synthesis artifact (`s05`) of a governed Arcanum research route. It records what crosses
> into public arcanum and what stays private, **grounded in the open-core commercial
> boundary**. **No content has been moved.** Any lift is gated behind explicit user approval
> (`g03`), moat protection (`g05`), and submodule-first discipline.

## The governing rule (from COMMERCIALIZATION-SYNTHESIS)

**Open-core, the right way around: give away the wedge, sell the trust.**

The public/private split is **not** "runtime vs. methodology" — that was a first
approximation. The real boundary is the open-core line:

- **FREE WEDGE → public `arcanum`** (drives adoption, do NOT sell). §2.
- **PAID MOAT → private `implementation/domainspec`** (board-level WTP). §3.
- **RUNTIME → private** (product/infra, never was a candidate).

The moat is _governed, legible, immutable, auditor-acceptable attestation_ over how
AI-driven work was produced and reviewed. The owner's original instinct — sell the
validators, give away the rest — is **inverted**: validators are the commodity wedge; the
engine + governance + attestation + vertical are the moat.

### Critical correction to the prior (pre-grounding) pass

The earlier draft recommended lifting **Lean residue / reflective-unit / faithful-not-full
concepts into public `arcanum/framework` and `arcanum/definitions`.** Grounded in
COMMERCIALIZATION-SYNTHESIS §3 and §9, **Lean is "the formal-proof half" of the paid
attestation moat.** Lifting the Lean attestation machinery into public arcanum would erode
the moat. → This is now a **`g05` moat-protection block**, escalated to `decision-gate`, not
an auto-lift. (Detail in Part B.)

---

## Part A — `implementation/domainspec` against the open-core boundary

### FREE WEDGE → crosses to public arcanum (per §2)

| Wedge asset (COMMERCIALIZATION §2)                                      | Source in domainspec                                                  | Recomposition target                                         | Note                                                                                  |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Arcanum sigils, Necronomicon                                            | `.claude/.agents/.codex` skill trees; `tools/arcanum`                 | `arcanum/arcana/`, `arcanum/spells/`                         | Already extracted — **reconcile, don't re-lift** (see residue).                       |
| Validators / audits                                                     | `tools/validate-*.ts`, alignment audit                                | `arcanum/formulae/`                                          | Explicitly the _commodity_ wedge — public.                                            |
| Spec→test derivation, code-tag **extraction**                           | DS pipeline tooling (extraction only)                                 | `arcanum/framework/` (method)                                | The _method_ is wedge; the runtime engine stays (R1).                                 |
| Taxonomy / relationships                                                | `TAXONOMY.md` (25), `RELATIONSHIPS.md` (26)                           | `arcanum/definitions/`                                       | Domain-agnostic; cleanest lift, confirmed wedge.                                      |
| Intent tools                                                            | interrogation, decision-gate, definitions-governance, alignment audit | `arcanum/arcana/` (sigils exist)                             | §2 / run 4 — wedge.                                                                   |
| Craft ledger _schema_ (type/lane system, blocker-refinement discipline) | Craft ledger structure                                                | `arcanum/framework/` or `arcanum/definitions/`               | §2: "structurally open-core, right way around." **Schema only** — automation is moat. |
| Generic governance templates, vault conventions                         | generic vault constitutions, `ontology-conventions.md`                | `arcanum/arcana/ontology-vault/`, `constitution-governance/` | Generic instances only.                                                               |

### PAID MOAT → stays private in domainspec (per §3) — **do NOT lift (`g05`)**

| Moat asset                                                                                                 | Why it stays private                                                                         |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **CyberAlchemy** governance engine (promotion DAG + KPI taxonomy)                                          | Lead paid asset, proofed by Golden Quill (§3).                                               |
| **Craft deferred automation** (role-delegation, scoring, generated index, hosted reflection, **metering**) | The paid meter — bill on governed-run throughput (§3, R2).                                   |
| **Enforcement runtime** (gate/chokepoint + isolation + ledger-driven `input` step)                         | The "muscle" that meters governed runs (§4).                                                 |
| **Vendor-neutral cryptographic attestation product**                                                       | The single sharpest paid wedge; what SOC 2 / ITGC / SOX auditors require (§3, §4a).          |
| **Lean formal-proof half**                                                                                 | "Lean = the formal-proof half" of attestation (§3, §9).                                      |
| **Golden Quill / Tilth** sovereign vertical                                                                | The one place "sell the attested artifact" works; **excluded even from the pitch** (§7, §8). |

### RUNTIME → stays private

`backend/`, `apps/web/`, `internal_tools/`, executable `tools/*.ts`, `infra/`, `plan/`,
`docs/features/*`, generated artifacts, `.arcanum/` consumer state. `OBSERVABILITY.md` /
`TEST-PIPELINE.md` are CI-wired runtime contracts.

### Gray zone — needs `decision-gate` (grounded in commercialization)

1. **Where exactly does the Craft line fall?** §2 says the _ledger schema_ is wedge; §3 says
   the _automation/metering_ is moat. The lift must cut Craft at the schema/automation seam —
   publish the type/lane/blocker-discipline data model, keep role-delegation, scoring, hosted
   reflection, and metering private. Needs an explicit seam decision.
2. **Spec→test: method vs. engine (R1).** The derivation _method_ is wedge; the LLM-driven
   _engine_ re-anchors as the governance-data asset / formal (Lean) lever — moat-adjacent.
   Publish the method and templates; keep the engine private.
3. **`CONSTITUTION.md` / `AXIOMS.md`** — lift the generic governance-attenuation _template_;
   leave the DS-bound, CI-gate-coupled instantiation private.
4. **Five host skill trees** (`.claude/.agents/.codex/.github/copilot`) — treat as **generated
   host installs** (regenerate via `arcanum-bootstrap`), not hand-migrate. Decides
   regenerate-vs-migrate.

### Mandatory framing constraints (carry into any public arcanum doc)

- **R-IB-1 (mandatory):** never market/describe the wedge as "reduces human review." It
  **relocates** review upstream (code-diff → spec/definition) and makes it cheaper,
  unskippable, legible. Public arcanum docs must use the "relocate + legibilize" framing.
- **R-IB-2 (design constraint):** the human owns the spec/intent ground truth; gates **add**
  friction at intent-critical points. Any lifted governance sigil must preserve this.

---

## Part B — `domainspec-lean-formalization` under moat protection

The Lean **proof runtime stays** (128+ `.lean` files, scratch, experiments, Mathlib-PR
bookkeeping, spec-richness checkers). **Newly, under `g05`:** because Lean is the formal-proof
half of the paid attestation moat, the Lean _concept_ units are **no longer an auto-lift.**
They split:

**Potentially wedge (generic engineering concepts, decoupled from attestation)** — candidates
_if_ `decision-gate` confirms they do not encode the attestation/proof product:

- Residue (typed loss), two-residue independence, declared-scope stopping (C7),
  regimes-of-residue typology, reflection-tower ↔ Arcanum mapping, subset rule (claim ≤ proof).
- These are general AI-governance discipline; they reinforce the _free_ legibility story
  (R-IB-1) rather than the paid proof engine.

**Moat — stays private (`g05` block):**

- Anything that _is_ the formal-proof/attestation mechanism: the Lean verification that would
  back "auditor-acceptable, cryptographically immutable attestation," the formal half of the
  spec→test engine (R1), and the FF-threshold formalism insofar as it underpins the paid
  proof claim.

**Discipline on any wedge Lean concept that crosses:**

- Plain-language re-statement (drop category-theory machinery; the engineering claim only).
- Do not lift refuted claims as settled (`NOVEL-MAPPINGS.md` marks several refuted).
- Term-collision guard vs. arcanum's existing `DEFINITIONS.md` (`schema`/`contract`) — new IDs.

---

## Part C — Definitions parity diff (DONE)

Compared DS `TAXONOMY.md` (25 meta-concepts) + `RELATIONSHIPS.md` (29 edges) and the
normative `research/projects/domainspec/definitions/DEFINITIONS.md` (DS-D1/DS-D2) against
`arcanum/definitions/` (`DEFINITIONS.md`, `DEFINITIONS-INDEX.md`, `DEFINITION-DRIFT-AUDIT.md`).

**Headline: zero overlap, nothing stale — this is a clean first lift, not a reconciliation.**

| Question                   | Finding                                                                                                                                                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What has already crossed?  | **Nothing.** `arcanum/definitions/` holds only `DEF-ARC-CONTRACT` and `DEF-ARC-SCHEMA` — Arcanum-native route/artifact governance terms. The DS meta-type taxonomy and relationship vocabulary are **absent** from arcanum.                                                        |
| Stale copies to reconcile? | **None.** No DS taxonomy content was ever copied, so nothing has drifted. The earlier "reconcile, don't re-lift" worry does not apply to definitions.                                                                                                                              |
| Term collisions?           | **Low.** arcanum's `schema`/`contract` are not DS meta-concepts (the DS `Form` type says "schema-validated input" but does not _define_ `schema`). The real `schema` collision is with the Lean **Spivak** usage (Part B), not the taxonomy. Add a one-line boundary note on lift. |

**Two findings that change the lift plan:**

1. **DS already has two sources of truth for the taxonomy**, and arcanum has neither:
   - `implementation/domainspec/TAXONOMY.md` (prose + examples + templates) and
   - `research/projects/domainspec/definitions/DEFINITIONS.md` → `DS-D1` (25 types), `DS-D2`
     (29 edges) — **normative** per `AUTHORITY-MAP`.
     The lift must pick **one public canonical home** in `arcanum/definitions/` and make the
     others reference it, or it will create a _third_ source of truth. Recommend: lift the
     formal `DS-D1`/`DS-D2` vocabulary as the canonical arcanum definition, with the prose
     `TAXONOMY.md` recomposed as the explanatory/example layer pointing at it.

2. **A wedge/moat seam runs _inside_ the normative DEFINITIONS.md** — do not lift it whole:
   - **WEDGE (liftable):** `DS-D1` meta-type system, `DS-D2` typed relationships, `DS-D3`
     concept graph, `DS-D7`/`DS-D8` edge partition + signature, `DS-P1..3`, `DS-D10`
     coverage-status taxonomy. This is the domain-modeling vocabulary — the free wedge.
   - **MOAT-ADJACENT (hold for `g05`/`decision-gate`):** `DS-C3` + `DS-D9` + `DS-COR-1`
     (governance attenuation), `DS-F1` governance derivation chain, `DS-F5` channel-capacity
     model, `DS-F6` closed-loop tuning, `DS-M13` technique-specialization validity. These are
     **CyberAlchemy** material (promotion DAG + KPI taxonomy + attenuation) — the paid engine.
   - **Do NOT lift the proposed ~38-edge / 7-category extension** — `DS-D2` explicitly marks
     it _proposed, not adopted_. Canonical = the 25-type / 29-edge profile only.

## Wedge-vs-Moat Decision (`decision.wedge-vs-moat-split`)

**Resolved by rule:** free wedge → public arcanum; paid moat + runtime → private domainspec.
**Escalated to `decision-gate`** (cannot auto-resolve):

1. The Craft schema/automation seam (gray-zone 1).
2. Spec→test method/engine seam — R1 (gray-zone 2).
3. Which Lean concepts are generic-wedge vs. attestation-moat (Part B).
4. Regenerate-vs-migrate for the five host skill trees (gray-zone 4).

---

## Residue Ledger (`ledger.integration-residue`)

1. **Parity diff — DONE (see Part C).** Definitions: zero overlap, nothing stale, clean first
   lift. Two new constraints surfaced: pick one canonical home (DS has two already, arcanum
   none), and split the normative DEFINITIONS.md at the wedge/moat seam (taxonomy=wedge,
   governance-attenuation=CyberAlchemy moat). NB: the `arcana/`/`spells/` sigil parity diff is
   still open — Part C covered definitions only.
2. **Generated-vs-authored ambiguity** (biggest coupling risk) — verify `arcanum-bootstrap` /
   `copilot/install.sh` generator wiring before moving the host skill trees.
3. **Craft seam is unbuilt (R-CRAFT-1).** Every monetizable Craft surface is deferred/unbuilt,
   so the wedge/moat seam is a _design_ decision, not a code split yet.
4. **Spec→test is LLM-driven, not a deterministic compiler (R1).** The paid line re-anchors on
   the governance-data asset or the Lean lever — affects what counts as wedge.
5. **Measurement gap (R-IB-3).** No evidence these tools cut escaped intent bugs; instrument
   before any public claim. A public arcanum demo must show, not assert.
6. **CI-gate coupling** — abstract hardcoded DS validator names out of any governance content
   before it goes public.
7. **Definitions authority — confirmed (Part C).** `research/projects/domainspec/definitions/DEFINITIONS.md`
   IS the normative source (DS-D1/DS-D2). arcanum should mirror the _wedge_ subset of it as the
   public canonical home, leaving the governance-attenuation cluster private.
8. **Forcing function is emerging, not statutory (R-RT-2).** SOC 2 / ITGC / SOX (FY ≥ Dec 2026) demand drives the moat; do not overclaim it as law in public material.

---

## Recommended next actions (each gated by `g03` + `g05`)

1. **`decision-gate` on the four seams** (Craft schema/automation, spec→test method/engine,
   Lean wedge/moat, regenerate-vs-migrate) — the load-bearing decisions.
2. **Parity diff** DS `TAXONOMY.md`/`RELATIONSHIPS.md` ↔ `arcanum/definitions/`.
3. **Lift the unambiguous wedge first** — taxonomy/relationships + generic intent-tool sigils,
   with R-IB-1 "relocate, don't reduce" framing baked in.
4. **Quarantine the moat** — leave CyberAlchemy engine, Craft automation/metering, enforcement
   runtime, attestation, Golden Quill/Tilth, and the Lean formal-proof half private.
