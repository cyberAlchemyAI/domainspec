---
tags: [gitops, discovery, review, audit]
node_type: review
is_session: false
layer: governance
nature: procedural
status: draft
veracidade: high
conviccao: high
version: 0.1.0
last_updated: 2026-05-02
---

# Discovery Review — Round 1: GitOps Adoption

**Reviewer date:** 2026-05-02
**Target:** `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/DISCOVERY.md`
**Inputs cross-checked:**
- Discovery format spec: `/Users/victorboscaro/domainspec/.claude/skills/custom/discovery-writing.md`
- Synthesis: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/research/SYNTHESIS.md`
- Repo assessment: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/research/repo-assessment.md`
- Authority Map: `/Users/victorboscaro/domainspec/AUTHORITY-MAP.md`
- Drift & Convergence: `/Users/victorboscaro/domainspec/DRIFT-CONVERGENCE.md`
- Governance Attenuation: `/Users/victorboscaro/domainspec/GOVERNANCE-ATTENUATION.md`
- CHANGELOG (latest: v2.0.2): `/Users/victorboscaro/domainspec/CHANGELOG.md`

---

## Verdict

**APPROVED-WITH-MINOR-FIXES**

The discovery is strong: it is grounded in concrete file paths, faithfully transcribes all five SYNTHESIS §3 load-bearing facts, adopts the recommended phasing without papering over divergences, surfaces every divergence from SYNTHESIS §2 honestly, and lands every Open Question with a recommendation. The two-tier reconciliation model is internally consistent with the proposed phasing, and the bot-PR pattern correctly identifies the nine LLM-judgment agents per the repo-assessment classification. The Objective is too long and breaches the ≤3-sentences quality gate as written (it contains four sentences); a small number of authority-map and governance-attenuation tensions need an explicit acknowledgement rather than reframing. None of these are reasons to reject — they are mechanical fixes, and the substance is sound enough that I would not ask for a second full review after they land.

---

## Blocking issues (must fix to approve)

### B1. Objective exceeds the 3-sentence cap

- **Location:** §Objective.
- **Quote:** Begins "Adopt GitOps as DomainSpec's operating model by wiring..." and ends "...no off-the-shelf tool solves them as of May 2026."
- **Problem:** The discovery-writing.md quality gate is unambiguous: "Quality gate: If you cannot write this in 3 sentences, the scope is unresolved." The current Objective contains **four** sentences (sentence 1 ends "...does not exist today, establishing... so `git push main` actually deploys."; sentence 2 is "The end state is..."; sentence 3 is "The harder spec-as-CRD-with-LLM-reconciler problems... as of May 2026."). It also smuggles a small amount of motivation ("...so `git push main` actually deploys") which the spec routes to Business Context.
- **Fix:** Compress to exactly three sentences. The synthesis already supplies a cleaner three-sentence version (SYNTHESIS §6 "Suggested objective"); use it or a near-paraphrase. Push the "every governance claim is enforced by..." framing down into §1 Why now, where it already partially appears.

### B2. False-claim correction action mixes drift correction with discovery scope in a way that creates an authority conflict

- **Location:** §1 What stays the same, last bullet ("Existing root governance docs stay authoritative as written.") combined with §10 Q10 ("unchecked immediately as part of the discovery commit").
- **Quote:** "The only edits to these files in scope are the **drift-correction edits** (e.g., un-checking `ADLC-ALIGNMENT.md` G4 until it actually ships)." and "Recommended default: unchecked immediately as part of the discovery commit, with a comment pointing to this discovery."
- **Problem:** Per `AUTHORITY-MAP.md`, `ADLC-ALIGNMENT.md` is the canonical single-file source for "ADLC gap closure and implementation alignment." The discovery proposes editing it as part of the discovery commit itself, before any reviewer has accepted the discovery's framing of what is shipped vs. not. That is a direct edit to a top-tier authority artifact by a non-canonical actor (the discovery), and `TUNING-LOOP.md:73` plus `TUNING-LOOP.md:426` would also need the same treatment for symmetry — but those are not enumerated in the "drift-correction edits" parenthetical. Either all three drift-correction edits (`ADLC-ALIGNMENT.md` G4 row, `TUNING-LOOP.md:73`, `TUNING-LOOP.md:426`) are in scope and named explicitly, or none are.
- **Fix:** Make Q10's recommendation **conditional on discovery approval** rather than "as part of the discovery commit," and expand the "drift-correction edits" enumeration in §1 What stays to name all three exact line targets. The right semantics: the drift-correction PR lands as the *first* commit of Phase 1, not as a side-effect of the discovery being merged.

### B3. The Objective claims phase deferral but does not name the end-state success criterion for Phase 1 alone

- **Location:** §Objective vs. §9 Phase 1.
- **Quote:** Objective says "every governance claim DomainSpec makes about itself is enforced by a pull-based, continuously-reconciling agent." Phase 1 says it closes "structural part of **G4**, **G11**, **G13**, **G14**, **G15**, **G16**."
- **Problem:** "Every governance claim is enforced" is a Phase 4 end state, not a Phase 1 deliverable, but the Objective frames it as the discovery's end state without naming what counts as "done" for the units that ship first. A reviewer cannot tell from the Objective which phase satisfies it. This matters because the discovery itself defers the LLM-reconciler work — so the Objective and the deferral are in tension.
- **Fix:** In the rewritten 3-sentence Objective, separate "end state of Phase 1" (CI substrate live, deterministic gates required, drift-correction landed) from "end state of v1" (Phases 1–3 shipped) from "v2 deferral" (Phase 4 LLM reconciler). One sentence each is enough.

### B4. The "verifier-as-admission" claim is overstated relative to today's PASS/FLAG/BLOCK semantics

- **Location:** §2.4 Verifier as admission gate.
- **Quote:** "Today `domainspec-verifier` runs as the Stage-10 finale of an interactive pipeline run. The new abstraction: promote PASS / FLAG / BLOCK from a finale verdict to a **required CI check** that runs at every artifact-mutation boundary, mapping cleanly onto the K8s `Allow` / `Warn` / `Deny` admission semantics."
- **Problem:** Per `AUTHORITY-MAP.md`, `domainspec-verifier` is not the canonical authority for any artifact category — it is a **deterministic decision agent** whose verdict is currently advisory (per repo-assessment §Agents → Controller Classification: "decision rules are explicit"). The discovery says "FLAG is non-blocking but tracked," which is fine. But it then says BLOCK "fails the required check and disables merge" — promoting an agent verdict to merge-gate authority is a *governance change*, not a wiring change. `GOVERNANCE-ATTENUATION.md` §System 3 (Control) explicitly notes that L6 enforcement is currently "manual trigger only" and recommends "making L6 continuous" — which is exactly what the discovery proposes — but does not authorize the verifier alone to block merges. The synthesis (§1, fact 3) calls verifier-as-admission "low-risk, high-leverage" but does not address the authority delegation question.
- **Fix:** Add one paragraph to §2.4 that names the authority delegation explicitly: "Promoting BLOCK to merge-gate is a governance change. It is consistent with `GOVERNANCE-ATTENUATION.md` §System 3 (continuous L6 enforcement) but requires an explicit edit to `CONSTITUTION.md` or equivalent to declare that `domainspec-verifier`'s BLOCK verdict is binding on `main`. That edit is in scope for Phase 1." This converts a hidden authority change into a named one. Without this, Phase 1 is a CI wiring exercise that silently ratifies a governance escalation.

### B5. The bot-PR pattern's handling of the 9 LLM-judgment agents is incomplete

- **Location:** §6 Bot-PR Pipeline (`domainspec-bot`), final paragraph.
- **Quote:** "The nine LLM-judgment agents per `repo-assessment §Agents → Controller Classification`: `domainspec-orchestrator`, `domainspec-interviewer`, `domainspec-planner`, `domainspec-spec-writer`, `domainspec-implementer`, `domainspec-task-executor`, `domainspec-ui-architect`, `domainspec-infra-architect` (one-time), `mars-researcher`."
- **Problem:** Three of these nine — `domainspec-orchestrator`, `domainspec-interviewer`, `mars-researcher` — are explicitly *interactive routing or human-driven research agents* per repo-assessment, not artifact-generating reconcilers. The bot-PR pattern is a poor fit for them (the orchestrator routes natural-language requests; the interviewer talks to humans; mars-researcher does external research). The Mermaid diagram in §6 lists nine agents to "regen" but only a subset actually produce regen-able artifacts. This dilutes the pattern's clarity.
- **Fix:** Split the nine into two sub-groups in §6: (a) **regen-eligible LLM-judgment agents** (`spec-writer`, `implementer`, `task-executor`, `ui-architect`, `infra-architect`) — these ride the bot-PR path; (b) **interactive-only LLM-judgment agents** (`orchestrator`, `interviewer`, `planner`, `mars-researcher`) — these stay interactive and the bot-PR pattern does not apply. Update the §6 Mermaid diagram's "Run nine LLM-judgment agents" node to "Run regen-eligible LLM-judgment agents (5)" or similar.

---

## Non-blocking improvements

### N1. §3 Repo Topology Change conflates two different "stays in `docs/`" claims

- **Location:** §3 "Stays in `docs/`" paragraph.
- **Problem:** The bullet list under "New on disk" includes `docs/.compiled/manifest.json` and `docs/signals/` as **new on disk**, but the prose then says "Stays in `docs/`: all hand-authored intent." A reader has to parse twice to realize two new *machine* subdirectories also live under `docs/` (`docs/.compiled/` and `docs/signals/`) alongside hand-authored content — which slightly contradicts the §2.1 promise to "live under a recognizable derived-tree."
- **Fix:** Add one sentence to §3 noting that `docs/.compiled/` and `docs/signals/` are derived subtrees under `docs/`, distinct from `docs/features/*` hand-authored content. Justify the placement (or migrate them to `generated/` for consistency).

### N2. Q5's "grandfathered, not extended" rule is good policy but lacks a sunset trigger

- **Location:** §10 Q5.
- **Quote:** "Per-feature `_categorical/` is preserved for the existing payment-processing artifacts (zero migration cost) but new derived buckets land in `generated/features/<feature>/...`. ... The `_categorical/` precedent is grandfathered, not extended."
- **Problem:** Without a sunset condition, the grandfathered exception becomes permanent drift between two derived-tree conventions.
- **Fix:** Add "Migrate `payment-processing/_categorical/` to `generated/features/payment-processing/categorical/` once a regenerator script exists in `tools/` (Phase 2 scope per §9)."

### N3. §8 Secrets does not name the rotation playbook owner

- **Location:** §8 Secrets, last sentence.
- **Quote:** "SOPS+age is sufficient until rotation requirements appear."
- **Problem:** SYNTHESIS §6 explicitly defers external secrets vault "until rotation requirement appears." The discovery accepts this verbatim but does not say *who notices* the rotation requirement. This is a future drift surface.
- **Fix:** One line: "Rotation-requirement detection is the responsibility of `domainspec-reflect` consuming `agent-cost` / `governance-gap` signals; no rotation tooling is built until that signal fires."

### N4. The 30-line systemd footprint claim is unverified

- **Location:** §7 Runtime Reconciler, last paragraph.
- **Quote:** "Total on-disk footprint: ~30 lines of systemd + a `Pulumi.yaml` for cloud resources."
- **Problem:** The number "~30" comes from synthesis §3 fact 4 / §5 Q2 rationale and is repeated unmodified. It is a plausible estimate, not a verified count. For a discovery, "approximately" is fine, but readers may take it as a hard contract.
- **Fix:** Soften to "roughly 30 lines" or remove the count and say "minimal systemd config."

### N5. §5 table mixes "drift check only" and "the *write* version runs in Phase 4" without flagging the implied authority shift

- **Location:** §5, `domainspec-registry-sync` row.
- **Problem:** The phrasing "the *write* version runs in Phase 4 bot-PR mode" implies that `domainspec-registry-sync` will *write* to `docs/registry.md` in Phase 4 — which is a write to a single-file canonical artifact per `AUTHORITY-MAP.md`. The bot-PR pattern saves this from being a direct overwrite, but the table cell does not say so.
- **Fix:** Append "(via paired bot-PR per §6, never direct push)" to the cell.

### N6. The discovery does not surface the `implementation/app-frontend/` authority ambiguity as a future risk for Phase 3 deploy

- **Location:** §1 What stays.
- **Quote:** "The `implementation/app-frontend/` 845-file Node.js subtree. Authority chain is unclear (repo-assessment §Brownfield item 6); not in this discovery's scope. Reconciler will not deploy it."
- **Problem:** This is correctly out of scope for *what* gets deployed, but Phase 3 stands up `infra/docker-compose.yml` on a VPS — and the docker-compose target needs *some* container to deploy. The discovery does not name what Phase 3's compose file actually orchestrates. If the answer is "not the frontend," then the answer should be named (e.g., "the OTel collector + Prometheus + Caddy stack from `INFRA-SETUP.md`, no application containers in v1").
- **Fix:** One sentence in §7 or §9 Phase 3 naming what the compose file actually deploys.

---

## Format compliance checklist

(Per `discovery-writing.md` "Quality Checks Before Finishing.")

| Gate | Status | Evidence |
|---|---|---|
| **Objective written before any other section** | PASS | §Objective is the first content section after the H1. |
| **Objective ≤ 3 sentences** | **FAIL** | Four sentences as written. See Blocking B1. |
| **Objective contains no motivation** | PARTIAL FAIL | The phrase "so `git push main` actually deploys" is motivational. See Blocking B1. |
| **Every "What's broken" item has a specific file location** | PASS | All 12 bullets carry file paths and frequently line numbers (e.g., `TUNING-LOOP.md:73`, `INFRA-SETUP.md:484`, `.githooks/pre-commit`). Exemplary. |
| **"What stays" is non-empty and credible** | PASS | Nine bullets covering Kubernetes, canary, LLM-as-reconciler, obligation-diff, external secrets vault, multi-agent merge, rollback semantics, root governance docs, and the frontend subtree. Each names a concrete asset. |
| **Open questions include recommendations, not just questions** | PASS | All 10 questions (Q1–Q10) carry "Recommended default:" + "Rationale:" structure. |
| **No implementation steps disguised as design decisions** | PASS (with caveats) | §5 is a wiring table, which is appropriate for a discovery describing what wires to what. §9 phasing is one-line-per-phase, not a step list. The bot-PR Mermaid in §6 describes flow, not steps. None of these cross the "task list" line. |
| **Anchored to existing vocabulary** | PASS | Uses `AUTHORITY-MAP.md`, `ADLC-ALIGNMENT.md`, `TUNING-LOOP.md`, `GOVERNANCE-ATTENUATION.md`, ADLC G-numbers, signal types, PASS/FLAG/BLOCK, all consistently with the source documents. |

**Overall format verdict:** PASS on all gates except the Objective length and motivation-leak (B1). One mechanical fix.

---

## Faithfulness audit

For each of SYNTHESIS §3's five load-bearing facts:

### Fact 1 — `.github/workflows/` does not exist; documentation falsely claims it does

- **Status:** REFLECTED.
- **Where:** §1 Why now (verbatim citation of `TUNING-LOOP.md` line 426 and `ADLC-ALIGNMENT.md` G4); §1 What's broken bullets 1, 6; §4 (workflow #3 "tuning.yml" comment "**This is the workflow `TUNING-LOOP.md:73` and `ADLC-ALIGNMENT.md` G4 already claim ships** — the false claim is corrected by making the claim true"); §10 Q10.
- **Quality:** Strong. The "make the claim true" framing is sharper than synthesis.

### Fact 2 — 5 of 17 agents are deterministic and CI-controller-eligible today

- **Status:** REFLECTED.
- **Where:** §1 What's broken bullet 4 (names all five with line counts); §4 `pr-validate.yml`; §5 wiring table (rows 1–5); §9 Phase 1.
- **Quality:** Strong. Line counts match repo-assessment exactly.

### Fact 3 — LLM compilation is structurally non-deterministic

- **Status:** REFLECTED.
- **Where:** §1 What's broken bullet 12 (cites Thinking Machines and LLM-42); §2.2 (idempotency at artifact layer not agent layer); §2.5 (deferred-to-Phase-4 rationale); §6 (semantic hash invention); §10 Q1, Q4.
- **Quality:** Strong. The discovery does not paper over the implication — it builds the entire phasing on it.

### Fact 4 — DomainSpec runs on single-VPS Docker Compose, not Kubernetes

- **Status:** REFLECTED.
- **Where:** §1 What stays bullet 1 (no K8s); §2.2 RuntimeTier; §7 Runtime Reconciler (verbatim Researcher A recommendation); §10 Q2.
- **Quality:** Strong. K8s tooling correctly demoted to "pattern reference" status.

### Fact 5 — No off-the-shelf "ArgoCD for spec-driven AI systems" exists

- **Status:** REFLECTED.
- **Where:** §Objective ("DomainSpec will need to write the playbook because no off-the-shelf tool solves them as of May 2026"); §2.5 (deterministic-first rationale); §6 final paragraph ("**This is the place DomainSpec writes the playbook**"); §9 Phase 4 (bold "**This is where DomainSpec writes the playbook**").
- **Quality:** Strong, possibly over-emphasized — the phrase "writes the playbook" appears three times in identical bolding. Not a problem, just a stylistic note.

### Faithfulness to SYNTHESIS §2 divergences

- **Divergence 1 (what the reconciler IS):** REFLECTED in §2.2 two-tier model, exactly as synthesis recommended.
- **Divergence 2 (ArgoCD/Flux):** REFLECTED in §1 What stays bullet 1.
- **Divergence 3 (canary):** REFLECTED in §1 What stays bullet 2 — and discovery correctly preserves the synthesis split (no runtime canary, but obligation-diff scoping is in scope per §10 Q4 and §6).
- **Divergence 4 (Konta/Komodo bus-factor):** REFLECTED in §7 ("Konta and Komodo are explicitly **not** adopted in v1") and §10 Q2.
- **Divergence 5 (`copilot/` ↔ `.github/` overlay):** REFLECTED in §1 What's broken bullet 9, §3, §4 `overlay-sync.yml`, §10 Q3.

**Faithfulness verdict:** All five SYNTHESIS §3 facts and all five SYNTHESIS §2 divergences are reflected with citations. Phasing matches SYNTHESIS §6 verbatim. No divergence from synthesis is unjustified.

---

## Authority-map alignment

| Authority concern | Discovery's stance | Verdict |
|---|---|---|
| Root governance docs (single-file authorities per AUTHORITY-MAP.md) | "stay authoritative as written" except for named drift-correction edits | OK in principle; **B2 flags an authority-flow issue** with the timing of the edits. |
| Feature packs (`docs/features/<feature>/...`) as multi-file canonical | Hand-authored intent stays in `docs/features/`; derived artifacts move to `generated/features/<feature>/` (§3) | Clean. Respects the pack-as-canonical rule. |
| `docs/registry.md` and `docs/glossary.md` (single-file shared) | Drift-check only in Phase 1; bot-PR write in Phase 4 (§5) | OK, but **N5** asks for explicit "via bot-PR" annotation in the table. |
| `copilot/` source pack and `.github/` overlay (multi-file packs per AUTHORITY-MAP.md) | Source = `copilot/`, overlay = derived from source, validated by `tools/check-overlay-sync.sh` (§3, §4) | Clean. Correctly identifies the overlay as derived without renaming the authority. |
| `domainspec-verifier` PASS/FLAG/BLOCK promoted to merge-gate (§2.4) | Treated as a wiring change | **B4 flags this as a hidden authority delegation** — the verifier becomes a merge-gate authority by CI configuration alone. |
| `ADLC-ALIGNMENT.md` G4 row edit | Q10 recommends edit "as part of the discovery commit" | **B2 flags timing** — discovery should not directly edit canonical authorities. |

**Net authority-map verdict:** No unresolved conflicts after B2 and B4 are addressed. The discovery is unusually disciplined about respecting pack-vs-single-file distinctions; the issues above are about *timing of authority edits* and *naming a hidden authority delegation*, not about overwriting human-owned files. The bot never touches `main` directly (§2.3 makes this explicit), which is the most important authority guarantee.

---

## Sharpness check

- **Recommendations decisive?** Yes. Every Open Question lands a "Recommended default" without hedging. Q9 (same-branch vs paired-PR) is particularly decisive given that synthesis was less prescriptive.
- **Scope boundaries truly bounded?** Yes — nine "What stays" bullets each name a concrete asset. The boundary around `implementation/app-frontend/` is clean (see N6 for one omission).
- **Anything important MISSING that synthesis flagged?** Two near-misses:
  1. SYNTHESIS §1 fact 7 (drift detection + auto-heal as core failure-mode mitigation) is *implied* in §2.4 (Coding_Karma three-layer defense) and §7 (auto-heal via `compose up -d` on every tick) but is not called out as a first-class principle. Acceptable; not blocking.
  2. SYNTHESIS §2 divergence 3's "spec-level blast-radius scoping is in scope" is reflected in §10 Q4 but only weakly in the body; obligation-diff is mentioned in §6 as Phase 4 work without explicitly noting it is the response to divergence 3. Acceptable; not blocking.
- **Sharpness verdict:** Sharp. The discovery makes hard calls and defends them.

---

## Approval condition

If this discovery is revised to address the **five blocking issues** (B1–B5), it can be approved without a second full review. The fixes are mechanical:

1. **B1**: Rewrite the Objective to exactly three sentences with no motivation. Recommended near-paraphrase of SYNTHESIS §6's suggested objective.
2. **B2**: In §1 What stays, expand the "drift-correction edits" parenthetical to enumerate `ADLC-ALIGNMENT.md` G4 row, `TUNING-LOOP.md:73`, and `TUNING-LOOP.md:426` by name. In §10 Q10, change "as part of the discovery commit" to "as the first commit of Phase 1, after this discovery is approved."
3. **B3**: In the rewritten Objective, separate Phase 1 / v1 (Phases 1–3) / v2 (Phase 4) end states across the three sentences.
4. **B4**: Add one paragraph to §2.4 naming the verifier-as-merge-gate as an authority delegation that requires an explicit `CONSTITUTION.md`-or-equivalent edit, and put that edit in Phase 1 scope.
5. **B5**: In §6, split the nine LLM-judgment agents into "regen-eligible" (5: `spec-writer`, `implementer`, `task-executor`, `ui-architect`, `infra-architect`) and "interactive-only" (4: `orchestrator`, `interviewer`, `planner`, `mars-researcher`). Update the Mermaid diagram's "Run nine LLM-judgment agents" node accordingly.

Non-blocking improvements N1–N6 are nice-to-have and should be addressed if the writer has spare cycles, but their absence will not block approval.

---

## One-line summary for the writer

The discovery is substantively correct, faithful to synthesis, and respectful of the authority map; fix the four-sentence Objective, the timing of the drift-correction edits, the unnamed verifier-merge-gate authority delegation, and the bot-PR pattern's over-broad LLM-agent set, and Round 2 approves.
