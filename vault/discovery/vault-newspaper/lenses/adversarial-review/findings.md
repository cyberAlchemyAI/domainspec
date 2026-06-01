---
tags: [adversarial, review, vault-newspaper, discovery-audit]
node_type: findings
is_session: false
layer: architecture, application
nature: explanatory, reference
status: active
dispatch_status: backfilled-no-prompt-recoverable
lens_order: second
version: 0.1.0
last_updated: 2026-05-25
created_by: victorboscaro@gmail.com
---

# Findings — Adversarial Review of `discovery.md` v0.1.0

## Objective

Hostile review of the v0.1.0 discovery draft. Surface over-commitments, hidden assumptions, scope leaks, contradictions with project rules, counter-arguments to each Open Question, and missing concepts.

## Method

Read the full discovery + cited source documents (`PRODUCT-COMPONENTS-IDEA.md`, `DRIFT-CONVERGENCE.md`, `internal_tools/README.md`, `CLAUDE.md`, `discovery-writing.md`, `implementation/app-frontend/visualizations/newspaper/README.md`). Compared the discovery's claims to actual maestro-trama dashboard-contracts constitution. No code written.

## Findings — Major hits

### F1. "Borrowed from maestro-trama" is cargo-cult (🚨 must fix)

Discovery §2.2 names three contracts (schema/instance/honesty) and a six-field provenance tuple. Maestro-trama's actual constitution defines **R-1..R-18 across four cost tiers (C1–C4) with a five-field tuple** (`extractor_version`, `prompt_version`, `model_version`, `exemplar_set_version`, `catalog_version`). The discovery silently substitutes its own shape and then claims "Adopting their schema avoids re-litigating governance." **False on inspection.** Honest restatement: "inspired by, not adopting." Either align the tuple or justify the divergence.

### F2. "Reproducible" is the wrong word (🚨 must fix)

§2.2 line: *"Every payload is independently reproducible given the same vault snapshot and the same prompt hash. This is non-negotiable."* LLMs at T>0 are non-deterministic; even T=0 is not stable across model patches. **The correct word is "auditable."** Capturing `model_id` + `model_version` records what was used, not that the output can be re-derived.

### F3. §1 ↔ §8 contradiction on the orphan directory (🚨 must fix)

§1 "What stays the same" calls `implementation/app-frontend/visualizations/newspaper/` "frozen as reference." §8 Promotion #3 commits to **adding a pointer README inside it** — a write into the supposedly-frozen tree. Pick one: freeze means no writes, or "frozen modulo a redirect README" should be stated explicitly.

### F4. Scope leak on `agents-telemetry` events (🚨 must fix)

§1 excludes `agents-telemetry` from scope. §4 then defines three event types (`newspaper.run.started`, `newspaper.editor.token_usage`, `newspaper.run.completed`) emitted to `vault_common.events` — that IS integration design, just unlabelled. §7 says "Telemetry integration with `agents-telemetry`… separate decision." Decide in-scope or out-of-scope; cannot be both.

### F5. Missing failure-mode coverage (🚨 must add §)

The discovery does not address:
- LLM unavailable / rate-limited / 429 — what does `vault-newspaper run` do?
- Empty-vault day (0 changes since last run) — empty payload? Skip? Placeholder?
- Snapshot atomicity — `corpus_hash` is in the tuple but the discovery never defines how the snapshot is taken while the vault is being written.
- Cost / token budget — daily run × 365 has structural cost implications, especially as the vault grows.
- PII / secrets in vault content — MCP exposure has no redaction layer.
- Prompt-rewrite migration — when the prompt changes, are old payloads still semantically valid?

### F6. Frontmatter claim is half-true (🚨 corroborated by L4)

§2.5 claims session frontmatter signals are "richer than what house_project Editor consumes today." L4 lens confirmed **sessions yes (98% coverage), discoveries no (0% coverage)**. Editor reading discoveries gets nothing from these fields.

## Findings — Bare assertions

### F7. "Evolution requires a fitness signal" (§2.3)

Asserted, never argued. Plenty of evolutionary systems run on neutral drift. The sentence is doing real work justifying OQ-2 on a slogan. Either argue it or weaken the claim.

### F8. "Growth is roughly one session per day" (§1)

No trend computation; pulled from a static snapshot. Verifiable from filesystem timestamps but not currently cited.

### F9. "the newspaper IS a vault-platform operation; HTML is its rendering side-effect" (§2.1)

Bare assertion. Why isn't synthesis a feature with rendering as primary? Defensible but undefended.

## Findings — Counter-recommendations to the 10 OQs

| OQ | Recommendation | Counter (strongest attack) | Verdict |
|---|---|---|---|
| OQ-1 | `vault_newspaper` | `vault_*` family is for invariant-enforcers (vault_common, vault_ctl), not renderers. Newspaper is opinionated synthesis; `newspaper/` or `vault_digest/` would not mislead. | Worth re-deciding. |
| OQ-2 | Editor-only | Building only the Editor means you'll never validate whether the 5-agent ecosystem was load-bearing. | Counter is real but does not flip the decision; defer is still correct given zero votes. |
| OQ-3 | MCP + HTML parallel | Two surfaces, zero validation = double over-commit. Ship MCP only; humans can read JSON for v0.1. | Reasonable; consider HTML-deferred. |
| OQ-4 | Defer convergence | The exact moment to converge is *before* three projects diverge further. Convergence cost grows monotonically. | Worth re-deciding. |
| OQ-5 | Since-last-run | **Breaks the (date, corpus_hash, prompt_hash) idempotency story** — same date can produce different bodies depending on cadence. | 🚨 Idempotency bug. Must fix. |
| OQ-6 | Static snapshot | Combined with OQ-5 (since-last-run), the artifact is neither a calendar publication nor a stream — a confusing third thing. | Resolved if OQ-5 is fixed. |
| OQ-7 | CLI flag + env var fallback | Env var hides identity in provenance trail. CLI flag should be the *only* path. | Reasonable tightening. |
| OQ-8 | Freeze + delete nothing | Frozen-but-cited code rots and confuses readers. Delete `editor_agent_scaffold.py`; keep gen_*.html as archive. | Worth re-deciding. |
| OQ-9 | Rewrite skill | If 5-agent is deferred, delete skill until v0.2 instead of writing a thin placeholder. | Reasonable. |
| OQ-10 | Skip feature SPEC | Newspaper has user stories the moment it has a human reader. "Internal tool" is a label, not an excuse. | Worth re-deciding. |

## Compliance check vs project rules

- ✓ Every OQ has a recommendation (discovery-writing rule).
- ✓ No model name pinned (LLM-agnostic rule).
- ✓ Connections block uses correct columns (no Scope column).
- ⚠ Editor-in-Chief is described as "an agent role" but operationalized as a Python module — the discovery never names it as an invocable agent. Soft inconsistency; document either way.

## Verdict

**Ratify with patches, not as-is.** The core framing (vault subsystem, MCP wedge, Editor-only v0.1, defer convergence) is defensible. Required patches: F1–F6 (cargo-cult borrowing, reproducible wording, §1↔§8 contradiction, agents-telemetry scope, failure modes, frontmatter caveat) plus OQ-5 idempotency fix.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/vault-newspaper/discovery.md` | `validates` | This lens audits the discovery for over-commitments and missing concepts. |
| `vault/discovery/vault-newspaper/research/research.md` | `synthesized-by` | This findings file is consolidated by the research synthesis. |
