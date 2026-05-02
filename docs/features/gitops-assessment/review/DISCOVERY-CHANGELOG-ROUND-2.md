---
tags: [gitops, discovery, review, changelog]
node_type: changelog
is_session: false
layer: governance
nature: procedural
status: draft
veracidade: high
conviccao: high
version: 0.2.0
last_updated: 2026-05-02
---

# Discovery Round 2 — Change Log

Target: `/Users/victorboscaro/domainspec/docs/features/gitops-assessment/DISCOVERY.md` (now v0.2.0).

## Blocking fixes (B1–B5)

- **B1 — Objective compressed to 3 sentences, motivation stripped.** Rewrote §Objective. Removed "git push main actually deploys" motivation (now lives only in §1 Why now).
- **B2 — Drift-correction edits enumerated, timing fixed.** §1 What stays last bullet now names all three targets explicitly (`ADLC-ALIGNMENT.md` G4 row, `TUNING-LOOP.md:73`, `TUNING-LOOP.md:426`) and states the edits land as the *first commit of Phase 1, after discovery approval*, not as part of the discovery commit. Authority for those files stays with their canonical owners. §10 Q10 reframed to match.
- **B3 — Phase 1 / v1 / v2 end states separated.** §Objective now uses one sentence per phase boundary (Phase 1 / v1 / v2). No Phase 4 leakage into the v1 framing.
- **B4 — Verifier-as-merge-gate authority delegation named.** §2.4 gains a new "Authority delegation (named explicitly)" paragraph. §9 Phase 1 bullet now lists the `CONSTITUTION.md`-or-equivalent governance edit as in-scope work alongside the workflow files.
- **B5 — LLM-judgment agents split into regen-eligible (5) and interactive-only (4).** §6 Mermaid `Regen` node updated to "regen-eligible LLM-judgment agents 5: spec-writer, implementer, task-executor, ui-architect, infra-architect". §6 final paragraph now lists the two sub-groups; interactive-only set is `orchestrator`, `interviewer`, `planner` (verified discussion-style per `copilot/agents/domainspec-planner.agent.md`), and `mars-researcher`.

## Non-blocking improvements (N1–N6)

- **N1 — `docs/.compiled/` location justified.** §3 gains a paragraph explaining why `docs/.compiled/` and `docs/signals/` live under `docs/` (manifest-adjacent-to-intent; cross-doc references already cite `docs/signals/`).
- **N2 — `_categorical/` sunset trigger added.** §10 Q5 now states the migration trigger: regenerator script lands in `tools/` (Phase 2), then `_categorical/` is retired.
- **N3 — Secret rotation owner named.** §8 last sentence assigns rotation-requirement detection to `domainspec-reflect` consuming `agent-cost` / `governance-gap` signals.
- **N4 — "~30 lines" claim qualified.** §7 now says "minimal systemd config (estimated at roughly 30 lines, not yet measured)". §10 Q2 and §9 Phase 3 prose softened to match.
- **N5 — Registry-sync write annotation added.** §5 table cell for `domainspec-registry-sync` now ends "(via paired bot-PR per §6, never direct push to `main`)".
- **N6 — Phase 3 compose-target named.** §9 Phase 3 bullet now states the compose file orchestrates the OTel collector + Prometheus + Caddy stack from `INFRA-SETUP.md`; no application containers in v1.

## Frontmatter

`version` bumped 0.1.0 → 0.2.0. `last_updated` retained at 2026-05-02 per instruction.
