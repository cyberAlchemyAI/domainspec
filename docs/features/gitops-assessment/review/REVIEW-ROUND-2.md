---
tags: [gitops, discovery, review, audit, round-2]
node_type: review
is_session: false
layer: governance
nature: procedural
status: draft
veracidade: high
conviccao: high
version: 0.2.0
last_updated: 2026-05-02
---

# Discovery Review — Round 2: GitOps Adoption

**Reviewer date:** 2026-05-02
**Target:** `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/DISCOVERY.md` (v0.2.0)
**Inputs cross-checked:**
- Round-1 review: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/review/REVIEW-ROUND-1.md`
- Writer's changelog: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/review/DISCOVERY-CHANGELOG-ROUND-2.md`
- DomainSpec CHANGELOG (latest: v2.0.2): `/Users/victorboscaro/domainspec/CHANGELOG.md`

---

## Verdict

**APPROVED**

All five blocking fixes (B1–B5) have actually landed in the document at the locations the changelog claims, and the prose in each case satisfies the substantive intent of the round-1 finding (not just the surface language). All six non-blocking improvements (N1–N6) are present. The Objective is now precisely three sentences with motivation removed, the drift-correction edits are enumerated by exact target and timed to the first commit of Phase 1 (not the discovery commit), the verifier-as-merge-gate authority delegation is named explicitly with a `CONSTITUTION.md` edit pulled into Phase 1 scope, and the bot-PR pattern correctly splits the nine LLM-judgment agents into 5 regen-eligible + 4 interactive-only, with the Mermaid diagram updated to match. Citations are intact, no Mermaid diagram is broken, no format gate has regressed, and faithfulness to SYNTHESIS §3 / §2 is preserved. The discovery is ready for the spec-writing wave.

---

## B1–B5 verification

### B1 — Objective compressed to 3 sentences, motivation stripped

**PASS.**

Proof from §Objective (lines 16–18):

> Phase 1 end state: a `.github/workflows/` substrate exists, the five deterministic agents and nine `tools/` validators run as required CI checks on every PR, the drift-correction commit (named in §1) has landed, and `domainspec-verifier`'s BLOCK verdict is a binding merge-gate per an explicit governance edit. v1 end state (Phases 1–3 shipped): the intent-vs-compiled discipline is enforced via `docs/.compiled/manifest.json`, secrets live in SOPS, and a minimal Compose-on-VPS reconciler converges `main` to running containers via systemd + `git pull` + `docker compose up -d`. v2 (Phase 4) defers the spec-as-CRD-with-LLM-reconciler problem — semantic-hash idempotency and obligation-diff blast-radius scoping — to dedicated R&D.

Sentence count: exactly 3 (one per phase boundary, period-terminated at "...governance edit.", "...up -d.", "...R&D."). The "git push main actually deploys" motivational phrase has been removed from the Objective and now appears only in §7 Runtime Reconciler ("This is also the layer where the false `INFRA-SETUP.md:484` claim becomes true — `git push main` actually deploys when this loop runs."), which is the correct home for it. B3's "separate Phase 1 / v1 / v2 end states across the three sentences" requirement is satisfied by construction in the same paragraph.

### B2 — Drift-correction edits enumerated, timing fixed

**PASS.**

Proof from §1 What stays, the "Existing root governance docs" bullet (line 54):

> The only edits to these files in scope are the **drift-correction edits**, enumerated exhaustively as: (1) the `ADLC-ALIGNMENT.md` G4 row (uncheck until the workflow ships), (2) `TUNING-LOOP.md:73` (the line listing `.github/workflows/domainspec-tuning.yml` as deployed), and (3) `TUNING-LOOP.md:426` (the line repeating the same false claim). These three edits land as the **first commit of Phase 1, after this discovery is approved** — not as part of the discovery commit itself.

All three target lines are named exactly as the round-1 review demanded. Authority preservation is also stated: "Authority for editing these files remains with their canonical owners per `AUTHORITY-MAP.md`."

§10 Q10 (line 267) matches the new timing:

> **Recommended default: the drift-correction PR is the *first commit of Phase 1*, opened immediately after this discovery is approved.** That PR enumerates and edits all three target lines explicitly: (1) the `ADLC-ALIGNMENT.md` G4 row (uncheck), (2) `TUNING-LOOP.md:73` (correct the false claim), and (3) `TUNING-LOOP.md:426` (correct the duplicate false claim). Authority for editing those files stays with their canonical owners per `AUTHORITY-MAP.md` — the PR is reviewed by the same humans who own the docs.

§9 Phase 1 (line 216) also reflects the new ordering: "First commit: the drift-correction PR enumerated in §1 (edits to `ADLC-ALIGNMENT.md` G4, `TUNING-LOOP.md:73`, `TUNING-LOOP.md:426`)." Three independent locations now agree on enumeration and timing.

### B3 — Phase 1 / v1 / v2 end states separated in Objective

**PASS.**

Proof: see B1 above. The rewritten three-sentence Objective uses one sentence per phase boundary exactly as the round-1 review prescribed: sentence 1 = Phase 1 end state, sentence 2 = v1 end state (Phases 1–3 shipped), sentence 3 = v2 (Phase 4) deferral. No Phase 4 capability leaks into the v1 framing — the v2 sentence is explicit that the LLM-reconciler problem is deferred.

### B4 — Verifier-as-merge-gate authority delegation named explicitly

**PASS.**

Proof from §2.4 (line 95), a new paragraph appended after the original prose:

> **Authority delegation (named explicitly).** Promoting BLOCK to merge-gate is a governance change, not a CI wiring change. Per `AUTHORITY-MAP.md`, `domainspec-verifier` is a deterministic decision agent whose verdict is currently advisory; merge-gate authority over `main` is not granted by CI configuration alone. This change is consistent with `GOVERNANCE-ATTENUATION.md` §System 3 (continuous L6 enforcement) but requires an explicit edit to `CONSTITUTION.md` (or the equivalent governance doc) declaring that CI may enforce `domainspec-verifier`'s BLOCK verdict as a binding merge-gate. **That governance edit is in scope for Phase 1**, alongside the workflow files themselves. Without it, Phase 1 is a CI wiring exercise that silently ratifies an authority escalation.

§9 Phase 1 (line 216) corroborates the scope claim: "Land the governance edit to `CONSTITUTION.md` (or the equivalent) declaring that CI may enforce `domainspec-verifier`'s BLOCK verdict as a binding merge-gate (per §2.4)." The §Objective also names this work in sentence 1 ("`domainspec-verifier`'s BLOCK verdict is a binding merge-gate per an explicit governance edit"). Three locations now agree.

### B5 — LLM-judgment agents split into regen-eligible (5) + interactive-only (4)

**PASS.**

Proof from §6 (lines 180–183):

> The nine LLM-judgment agents per `repo-assessment §Agents → Controller Classification` split into two sub-groups for the bot-PR pattern:
> - **Regen-eligible (5)** — these produce committable artifacts and ride the bot-PR path: `domainspec-spec-writer`, `domainspec-implementer`, `domainspec-task-executor`, `domainspec-ui-architect`, `domainspec-infra-architect` (one-time). The bot operates on these.
> - **Interactive-only (4)** — these do NOT produce regen artifacts and are excluded from the bot-PR pattern: `domainspec-orchestrator` (interactive routing), `domainspec-interviewer` (human-driven discovery), `domainspec-planner` (discussion-style decomposition), `mars-researcher` (external research). They stay interactive in Phase 4 as in Phase 1.

The split is 5 + 4 = 9, matches the round-1 prescription, and includes `domainspec-planner` in the interactive-only set (which is more conservative than the round-1 review's split — the round-1 review put `planner` in the regen-eligible bucket, but the changelog notes the writer verified `planner` as discussion-style per `copilot/agents/domainspec-planner.agent.md`). This is a defensible refinement and does not regress the fix.

The Mermaid diagram in §6 (line 169) is updated to match: the `Regen` node now reads `Run regen-eligible LLM-judgment agents 5: spec-writer, implementer, task-executor, ui-architect, infra-architect` instead of the original "Run nine LLM-judgment agents."

---

## N1–N6 verification

### N1 — `docs/.compiled/` location justified

**PASS.** §3 (line 116) gains a dedicated paragraph:

> **Two derived subtrees live under `docs/` alongside hand-authored content:** `docs/.compiled/` (the manifest) and `docs/signals/` (the append-only signal stream + tuning report). They are kept under `docs/` rather than `generated/` because (a) `docs/.compiled/manifest.json` is the *index of* `generated/` and belongs adjacent to the intent it indexes, and (b) `docs/signals/` is referenced verbatim by `README.md`, `TUNING-LOOP.md`, and the `domainspec-emit-signals` skill, so renaming would require a cross-doc edit larger than the consistency win. The `.compiled` dotfile prefix and the signal-stream naming distinguish them visually from `docs/features/*` hand-authored content.

Resolves the round-1 contradiction with §2.1 cleanly.

### N2 — `_categorical/` sunset trigger added

**PASS.** §10 Q5 (line 247) now ends:

> **Sunset trigger:** migrate `docs/features/payment-processing/_categorical/` to `generated/features/payment-processing/categorical/` once the missing regenerator script lands in `tools/` (Phase 2 scope per §9). After migration the `_categorical/` convention is retired.

### N3 — Secret rotation owner named

**PASS.** §8 (line 203) ends:

> **Rotation-requirement detection** is the responsibility of `domainspec-reflect` consuming `agent-cost` and `governance-gap` signals from `docs/signals/pipeline-signals.jsonl`; no rotation tooling is built until that signal fires.

Matches the round-1 prescription verbatim in semantic content.

### N4 — "~30 lines" qualified

**PASS.** §7 (line 197) now reads:

> Total on-disk footprint: a minimal systemd config (estimated at roughly 30 lines, not yet measured against a working unit) plus a `Pulumi.yaml` for cloud resources.

The hedge ("estimated… not yet measured") is explicit. §2.2 and §10 Q2 still say "minimal systemd config" / "~30 lines"-adjacent prose; §10 Q2 now says "minimal systemd config" without the hard count, which is consistent. §9 Phase 3 prose does not include the count. Acceptable.

### N5 — Registry-sync write annotation added

**PASS.** §5 table cell for `domainspec-registry-sync` (line 145) now reads:

> drift between `docs/registry.md` and SPEC concept tables fails check; the *write* version runs in Phase 4 bot-PR mode (via paired bot-PR per §6, never direct push to `main`)

The "(via paired bot-PR per §6, never direct push to `main`)" annotation is exactly what the round-1 review requested.

### N6 — Phase 3 compose-target named

**PASS.** §9 Phase 3 (line 218) now states:

> **What the compose file actually orchestrates in v1:** the OTel collector + Prometheus + Caddy stack from `INFRA-SETUP.md` (the observability and ingress substrate). No application containers ship in v1 — the `implementation/app-frontend/` subtree is explicitly out of scope per §1, and no other deployable service exists in the repo today.

This was the precise sentence the round-1 review asked for, and it cleanly closes the implicit gap about what Phase 3 actually deploys.

---

## Regression check

**PASS.**

Citations: SYNTHESIS §3 facts 1–5 are still cited at all the same anchor points (§1 Why now, §1 What's broken bullets 1/4/12, §1 What stays bullet 1, §2.2, §2.5, §6 final paragraph, §7, §10 Q1/Q2/Q4). SYNTHESIS §2 divergences 1–5 are still reflected (§2.2, §1 What stays bullets 1–2, §7, §1 What's broken bullet 9). Researcher A and B inline citations in §2.1, §2.2, §2.3, §2.4, §6, §7, §8 are all preserved. The Thinking Machines and LLM-42 citations in §1 What's broken bullet 12 are intact.

Mermaid diagrams: three diagrams in the document — §2.2 (two-tier reconciliation), §6 (bot-PR pipeline), §9 (phased delivery). All three render-valid: the §6 diagram's `Regen` node label was updated in-place without breaking the surrounding edges (`Comment --> Regen --> Hash --> Cache{Hash matches manifest?}` chain still parses as a single graph). No edges added or dropped.

Format gates: Objective is now 3 sentences (was 4) with no motivation (was 1 motivational phrase). All "What's broken" bullets retain file paths and line numbers. All Open Questions retain "Recommended default:" + "Rationale:" structure. Anchored vocabulary (`AUTHORITY-MAP.md`, ADLC G-numbers, PASS/FLAG/BLOCK, signal types) is unchanged. No new task-list-style steps were introduced.

Frontmatter: `version` correctly bumped 0.1.0 → 0.2.0; `last_updated` retained at 2026-05-02 per the changelog's intent.

Newly-introduced cross-doc consistency: the §Objective's "drift-correction commit (named in §1)" reference resolves to §1's last-bullet enumeration; §2.4's "in scope for Phase 1" promise resolves to §9 Phase 1's `CONSTITUTION.md` edit bullet; §9 Phase 1's "First commit" matches §10 Q10's "first commit of Phase 1." All three pairs of references are mutually consistent.

Nothing broke. No fix introduced a new gap.

---

## Sign-off

**Discovery approved at v0.2.0, ready for spec-writing wave.**

The discovery is substantively faithful to SYNTHESIS, respectful of `AUTHORITY-MAP.md`, format-compliant per `discovery-writing.md`, internally consistent across §Objective / §1 / §2.4 / §6 / §9 / §10, and now addresses every blocking concern raised in round 1 plus all six non-blocking improvements. The next wave (spec-writing for the GitOps adoption feature) should treat `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/DISCOVERY.md` v0.2.0 as the authoritative input.
