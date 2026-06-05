---
lens: repo-prior-art
date: 2026-06-05
dispatched_by: subagent (lens-03)
addresses: What dispatch topologies this repo already encodes, and the gap between the specified topology and lived practice.
sources:
  - vault/constitution/domainspec-subagents-strategy-constitution.md
  - vault/constitution/research-constitution.md
  - vault/constitution/robot-talks-constitution.md
  - vault/discovery/anti-bias-vector-composition/principle.md
  - vault/discovery/anti-bias-vector-composition/validator-check.md
  - vault/discovery/subagents-strategy-refinement/ (dir listing)
  - domainspec-theorem/research/audits/*/dispatch.yaml (15 files repo-wide)
  - domainspec-theorem/theorem/agents-research/ (ad-hoc channel)
verification: [local-files-read]
---

# Lens 03 — Repo Prior-Art: Topologies Encoded vs. Topologies Lived

This lens does cartography. It catalogs the dispatch topologies this repo already
specifies, then maps the gap between the spec and what actually landed on disk. The
anti-bias *principle* — tension, not diversity — is **already owned** by this repo at
`vault/discovery/anti-bias-vector-composition/principle.md` ("micro vectors must be
deliberately *tensioned* against each other, not merely *non-overlapping*"; §"Distinction
from diversity"). This lens cites that as prior art; it does not re-derive it. The
contribution here is the *taxonomy + drift map*.

## A. Taxonomy of encoded topologies

The repo encodes topology at two grain sizes: **top-level mode** (whole dispatch) and
**per-layer mode** (R30 composability).

1. **`single`** — one agent, one question. Base R19. Calibration job: none beyond
   lookup; the validator is even *skipped* for it (R26 trivial-dispatch carve-out).
2. **`task-fan-out`** — N agents, partitioned concerns, parallel. Base R19. Job:
   coverage. Note: partition ≠ tension; this shape passes the partition check and can
   still fail the tension check (validator-check.md §"Relationship to the existing
   validator").
3. **`robot-talks`** — N agents, *same* question, declared perspectives, tensions
   desired (base R19/R20; binds `robot-talks-constitution.md`). Job: tension discovery —
   "Synthesis Is Tension Discovery, Not Aggregation" (robot-talks PM-3).
4. **`adversarial-audit`** — research-constitution's canonical high-stakes shape: a
   layer of all-`skeptic`s under *different gates* (precedent-kill / non-vacuity /
   definitional-soundness), R26 "explicitly endorsed". Job: calibrated demotion. This is
   the only shape whose tension is structural-by-construction.
5. **`pipeline` / per-layer composition** — heterogeneous per-layer modes, linear
   (base R30; research R24 names the layer modes `single | task-fan-out | nested-waves |
   zig-zag | robot-talks`). Job: stage separation (investigate→evaluate→synthesize).
6. **`parent-synthesis`** — the `model: "parent"` synthesize layer (base R25): single
   agent, no tensioning by construction (anti-bias principle.md §"Does not apply").
7. **`meta-dispatch`** — `dispatch_kind: meta` for framework-design work with no feature
   folder (base R15/R25).
8. **The four roles as a tension lattice** (research R4–R8): explorer/skeptic/writer/
   auditor are *epistemic functions*, and R30 forces `agent_name` uniqueness so a
   skeptic and auditor can never collapse into one voice.

The load-bearing calibration device across all of these is **R29/R10 pairwise tension**
plus the validator's **Item 10 false-consensus red flag**: "If a subject layer of size
N ≥ 3 returns *zero* dissent records and the N findings all reach the same conclusion,
fire the false-consensus red flag... Treat it as a failure to apply the principle, not
as success" (validator-check.md §Post-dispatch). The repo *already knows* that count and
diversity are not calibration; tension is. That is exactly the discovery's central claim,
stated as prior art.

## B. The drift: specified vs. lived (verified counts)

I counted on disk. Where my counts differ from the brief's estimates, the verified
numbers are below.

**Drift 1 — Governance coverage is thin: 15 governed dispatches, ~68 audit folders.**
`find ... -name dispatch.yaml` returns **15** repo-wide (11 under `research/audits/`,
3 under `research-ai/`, 1 under `research-emergence/`). But `research/audits/` holds
**68** folders. So the spec engine governs roughly one in five audit-shaped artifacts;
the majority are ungoverned hand-written audits.

**Drift 2 — LEDGER produced in 4 of 15 governed dispatches.** Only **4** `LEDGER.md`
exist repo-wide (arcanum-claim-evidence-governance-axis, rg-repo-fit-scout,
tower-residue-open-gaps, project-ct-mapping). **11 of 15** dispatch folders have a
`dispatch.yaml` but *no* `LEDGER.md` — yet every one of those 11 has a populated
`agents/*.md` provenance layer (4–12 files each). Layer-1 provenance survives; the
Layer-2 synthesis (research R16), which is where dissent is "captured verbatim", is
skipped in ~73% of governed dispatches. This is the precise lived form of the failure
Item 10 warns about: the dissent-capture surface is the one most often dropped.

**Drift 3 — Parameter-name drift on the corpus key.** Of 15 dispatch.yaml: **9** use
`corpus:`, **4** use `corpus_root:`, and **2** (rg-repo-fit-scout,
import-scouting/directed-audit-complement) declare *neither*. Three spellings for one
required field — the validator (R26) is plainly not gating field names in practice.
Same story on the loop budget: **`max_loops`** (research R20) and **`loop_cap`** (base
R25) both appear; and the mode enum carries `parallel` (×2) and `zig-zag` (×1) — neither
is in base R19's enum, though `zig-zag` is in research R24's. The vocabularies of the two
inherited constitutions are bleeding together in lived specs.

**Drift 4 — Promotion usually left draft.** Of 18 `discovery.md` files, **7** carry
`status: draft` (3 explicitly annotated "NOT promoted — user-gated"). The committed
Layer-3 public finding (research R17) is the gated terminus, and it is left un-flipped
about 40% of the time. The promotion gate (R6b) is being respected in the conservative
direction — nothing auto-promotes — but the published-corpus payoff frequently never
lands.

**Drift 5 — An entire ad-hoc channel outside governance.** `theorem/agents-research/`
holds **32 folders** (e.g. `attacking-m2-conjecture`, `mackey-respin-council-2026-05-27`,
`vacuity-sweep-and-open-threads-2026-06-05`) with **zero** `dispatch.yaml`, **zero**
`LEDGER.md`, and no validate/review pass. Folder names like `*-council-*` and
`robot-talks`-flavored work strongly imply multi-agent dispatches ran here — but
entirely outside R26 validation and R29 tension-naming. This is the largest live
false-consensus surface in the repo: multi-agent work with no validator to fire Item 10.

## C. Tension I carry (against Lens 02's ideal)

Lens 02 argues forced confrontation calibrates. The repo *agrees on paper* — the
adversarial-audit shape (A.4) and Item 10 exist precisely to force it. My counter-load:
in the realized topologies the tensioning specified on paper is **frequently not
exercised**. Seven of fifteen governed dispatches *do* name a tension/disagreement
string in their dispatch.yaml (grep `tension|disagree|pairwise|false-consensus`), but
naming a tension axis in the spec is not the same as *realizing* a disagreement in the
returns — and the surface that would prove realization (the LEDGER's verbatim dissent
capture, plus Item 11's tension-realization log) is exactly the surface dropped in 11 of
15 cases. The validator's Item 10 is not a celebration of consensus; it is a *failure
trigger*. The repo built the trigger and then, in the dominant lived path
(ungoverned audits + the 32-folder ad-hoc channel), runs without the validator that
would pull it. Forced confrontation calibrates only when something forces it; here the
forcing function is specified but unexercised at scale.

## Boundary

This cartography establishes that the topologies exist (A) and that lived practice drifts
from spec along five verified axes (B). It does **not** establish the discovery's central
claim. Three things it cannot do: (1) it cannot show that tension *causes* calibration —
that needs Lens 01's formalism (the bias-cancellation / ensemble-error argument), not a
file census; (2) it cannot show count/diversity are *orthogonal* to calibration — that is
a comparative claim, not a presence claim; (3) it cannot certify the drift is novel or
unaddressed in the literature — that needs Lens 04's precedent check. Drift counts are a
snapshot at 2026-06-05 and will move as dispatches accrue. What this lens proves is
narrower and load-bearing: the repo *already owns* the tension-not-diversity doctrine,
and its own lived topologies repeatedly fail to exercise it.
