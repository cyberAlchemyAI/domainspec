---
stage: interrogation
lens: domainspec-llm-replacement
mode: refine-design-review
verdict: flag
owner: interrogation
created: 2026-06-21
---

# Stage receipt — DomainSpec placement / LLM-replacement reviewer

Target: `LIFECYCLE-ARCHITECTURE.md` §3 (DomainSpec model) + §5 (project & tasks), cross-checked vs the live `domainspec-generate-tests` skill / `domainspec-test-designer` agent.

## Findings

- **D1 (BLOCKER): "replaces the LLM" is OVERCLAIMED — it is a backend-domain partial replacement.** The LLM test agent also produces the **UI/E2E Playwright** suite, scaffolding, and the story→test mapping. The deterministic engine derives **backend domain obligations only**. The architecture must state the post-swap pipeline is **engine(backend-domain) + LLM(UI/E2E + scaffolding)**, not engine-only. As written, §3 implies a full replacement the engine cannot deliver.
- **D2 (major): the migration is not actionable — no contract diff.** The LLM TEST-SPEC output shape (story map, `--scaffold`, count summary, exit codes) ≠ the engine's emit shape. The LLM-replacement task needs a **contract-diff sub-task** that classifies each output row as engine-owned (backend-domain) vs LLM-owned (UI/E2E/scaffold) so migration only diffs the backend slice.
- **D3 (minor): "self-derivable fixpoint" (§3) is aspirational.** The engine has never derived its own TEST-SPEC (no `TEST-SPEC.md` under `docs/features/test-derivation-engine/`). "can derive" ≠ "has derived" — mark it planned, or actually run `derive` on the feature to make the claim real.
- **D4 (minor): §3 present-tense "replaces" conflicts with §5 "planned task."** The swap is future work; align the tense.

Verdict: **flag** — the LLM-replacement framing is the most overstated part of the doc; it must be re-scoped to the backend-domain slice with an explicit coexistence model.
