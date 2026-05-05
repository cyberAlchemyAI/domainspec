---
tags: [domainspec, methodology, vault, validation]
node_type: research
is_session: false
layer: domain, application
nature: explanatory, technical
status: exploratory
version: 0.1.0
last_updated: 2026-05-05
template_for: domainspec-subagents-research.md
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `domainspec-axioms-and-premises-validation`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [../../../constitution/domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location; user override acknowledged for this knowledge-scope dispatch — vault is the staging ground because the topic *is* vault discipline), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

The user authored two new vault docs: `vault/axiom/domainspec-axioms.md` (v0.5.0, 4 non-negotiable methodology axioms with math appendices A.1–A.4, brownfield boundary condition, and Curry–Howard analogy) and `vault/premise/domainspec-premises.md` (v0.1.0, 11 active premises after a `@biz`/CLI strip, with P-DS-2 and P-DS-3 explicitly demoted from axiom status on a 2026-05-05 audit). Before these docs become load-bearing for the rest of the methodology, the user wanted an independent fan-out validation. Earlier triage proposed 5 angles; the user selected three: A — operationalization audit (does each cited agent/skill actually do what the doc claims), B — empirical state audit (are the factual repo-state claims true), D — math/formalism review against Claude's training (no toy verification). The user explicitly excluded `@biz` and CLI-tool claims from validation scope; those have been stripped from the source docs.

## Goal

Produce a per-claim verdict across operationalization fidelity, empirical repo-state, and math soundness, so the user can decide which AX-DS-* / P-DS-* statements stand, which need edits, and which should be further demoted or removed. No source-doc mutation in this run — findings recommend, user approves, separate edit pass.

---

## Agent 1 — Operationalization audit: do cited agents/skills actually do what the docs claim

agentId: a3960a96983df50dc

Now I have all the information I need. Let me compile the verdict table.

---

## Summary

**Total claims checked: 23** (across 4 axiom operationalization bullets and 12 premise mechanism references, with some agents cited in multiple places).

**Per verdict:**
- `confirmed`: 13
- `claim-overstates-agent`: 4
- `agent-missing`: 0
- `agent-says-something-different`: 6

---

## Verdict Table

| Doc | Claim ID | Quoted claim (line #) | Target agent/skill | File evidence | Verdict | Note |
|---|---|---|---|---|---|---|
| `domainspec-axioms.md` | AX-DS-1.op-1 | "`domainspec-alignment-auditor` flags drift when code states something the spec does not." (line 53) | `domainspec-alignment-auditor` agent | [`.claude/agents/domainspec-alignment-auditor.agent.md:19–23`](.claude/agents/domainspec-alignment-auditor.agent.md) | `confirmed` | Agent's core responsibilities include "Validate documented rules exist in implementation" and produce a "compliant / partial / missing / extra" report. Matches the claimed "flags drift" behavior. |
| `domainspec-axioms.md` | AX-DS-1.op-2 | "`domainspec-layering-auditor` flags code in the wrong layer (compiled to a target the spec did not authorize)." (line 54) | `domainspec-layering-auditor` agent | [`.claude/agents/domainspec-layering-auditor.agent.md:12–15`](.claude/agents/domainspec-layering-auditor.agent.md) | `confirmed` | Agent "detect[s] business/domain behavior implemented in application and use-case layers" — directly matches "code in the wrong layer." |
| `domainspec-axioms.md` | AX-DS-1.op-3 | "`domainspec-spec-feature` and the discovery → spec → plan → code pipeline ordering enforce direction." (line 55) | `domainspec-spec-feature` skill | [`.claude/skills/domainspec-spec-feature/SKILL.md:24–36`](.claude/skills/domainspec-spec-feature/SKILL.md) | `confirmed` | Skill has a hard discovery-existence precondition gate (step 0), halting if no discovery exists. Enforces the direction claim. |
| `domainspec-axioms.md` | AX-DS-1.op-4 | "`domainspec-brownfield-translation` operationalizes the one-shot bootstrap exception." (line 56) | `domainspec-brownfield-translation` skill | [`.claude/skills/domainspec-brownfield-translation/SKILL.md:10–13`](.claude/skills/domainspec-brownfield-translation/SKILL.md) | `claim-overstates-agent` | The skill converts existing code to DomainSpec artifacts but does **not** implement the three specific AX-DS-1 requirements named in P-DS-12: (a) surfacing the candidate set β(C) rather than collapsing it, (b) preserving rejected candidates per AX-DS-4, (c) marking the project as transitioned to steady-state so β is not re-invoked. The premise doc itself (P-DS-12, line 87) acknowledges "(a)/(b)/(c)" are unaudited. The axiom doc's claim is not falsified, but it is aspirational. |
| `domainspec-axioms.md` | AX-DS-2.op-1 | "`domainspec-sync-registry` rebuilds `docs/registry.md` and `docs/glossary.md` from feature SPEC concept tables." (line 72) | `domainspec-sync-registry` skill | [`.claude/skills/domainspec-sync-registry/SKILL.md:2–6`](.claude/skills/domainspec-sync-registry/SKILL.md) | `confirmed` | Skill objective is exactly "Align docs/registry.md and docs/glossary.md with feature-level source-of-truth concepts." Matches verbatim. |
| `domainspec-axioms.md` | AX-DS-2.op-2 | "`domainspec-alignment-auditor` flags spec/code drift on shared concepts." (line 73) | `domainspec-alignment-auditor` agent | [`.claude/agents/domainspec-alignment-auditor.agent.md:19–23`](.claude/agents/domainspec-alignment-auditor.agent.md) | `confirmed` | Agent validates documented rules exist in implementation and classifies with "compliant / partial / missing / extra." Matches. |
| `domainspec-axioms.md` | AX-DS-3.op-1 | "`domainspec-layering-auditor` flags code units lacking a citation in any aspect." (line 89) | `domainspec-layering-auditor` agent | [`.claude/agents/domainspec-layering-auditor.agent.md:12–15`](.claude/agents/domainspec-layering-auditor.agent.md) | `agent-says-something-different` | The layering auditor detects **domain behavior** misplaced in application/use-case layers — it classifies by layer origin (domain vs. use-case), not by whether a code unit has a spec citation. "Flags code units lacking a citation in any aspect" is the AX-DS-3 orphan check; the agent does not do that. That is conceptually the alignment-auditor's job. The axiom has the agent assigned to the wrong sub-claim. |
| `domainspec-axioms.md` | AX-DS-3.op-2 | "`domainspec-alignment-auditor` cross-checks each behavior against the artifact graph." (line 90) | `domainspec-alignment-auditor` agent | [`.claude/agents/domainspec-alignment-auditor.agent.md:19–23`](.claude/agents/domainspec-alignment-auditor.agent.md) | `claim-overstates-agent` | The alignment auditor works feature-by-feature from `docs/features/{feature}/*.md` and code. It does not traverse an "artifact graph" — there is no graph traversal in its execution steps. It checks code against SPEC documents, not against a graph structure. The word "artifact graph" in the claim is importing a construct (the vault graph) that the agent does not implement. |
| `domainspec-axioms.md` | AX-DS-4.op-1 | "`domainspec-decision-gate` blocks document mutation when a decision is unresolved." (line 110) | `domainspec-decision-gate` skill | [`.claude/skills/domainspec-decision-gate/SKILL.md:69–71`](.claude/skills/domainspec-decision-gate/SKILL.md) | `agent-says-something-different` | The skill's authority rule states "No SPEC, TEST-SPEC, or implementation mutation may proceed while this skill returns BLOCK" (line 71). That is narrower than "document mutation" — it blocks spec/implementation/test mutations, but specifically **does not** block discovery docs, vault node edits, or decision records themselves. More critically: the gate is only armed when the skill is explicitly invoked. There is no automatic blocking mechanism — no hook, CI gate, or pre-write guard. The axiom's phrasing ("blocks document mutation when a decision is unresolved") implies an always-on guardian; the skill is an on-demand tool that produces a BLOCK verdict only if manually called. |
| `domainspec-premises.md` | P-DS-2.op-1 | "`domainspec-l1-extractor`...claim[s] to extract real categories — typed objects and morphisms with composition — from spec documents" (lines 51–52) | `domainspec-l1-extractor` agent | [`.claude/agents/domainspec-l1-extractor.agent.md:8–14`](.claude/agents/domainspec-l1-extractor.agent.md) | `confirmed` | Agent extracts finite category (objects and morphisms) from SPEC artifacts into L1.json. Matches the description precisely. |
| `domainspec-premises.md` | P-DS-2.op-2 | "`domainspec-l2-extractor`...claim[s] to extract real categories — typed objects and morphisms with composition...from...code respectively." (lines 51–52) | `domainspec-l2-extractor` agent | [`.claude/agents/domainspec-l2-extractor.agent.md:8–14`](.claude/agents/domainspec-l2-extractor.agent.md) | `confirmed` | Agent scans compiled outputs (TypeScript, tests, infra) and emits L2.json as a coarse-grained category. Matches description. Agent explicitly states "If a feature has no generated code yet, the L₂ category is the empty category. Emit it explicitly." |
| `domainspec-premises.md` | P-DS-3.op-1 | "`domainspec-delta-extractor` reconstructs the compilation functor Δ : L₁ → L₂ and emits diagnostics (`objects_unmapped`, `morphisms_unwitnessed`, `rel_type_coverage`)..." (lines 61–63) | `domainspec-delta-extractor` agent | [`.claude/agents/domainspec-delta-extractor.agent.md:8–15`](.claude/agents/domainspec-delta-extractor.agent.md) | `confirmed` | Agent reconstructs the Δ functor from L1.json + L2.json and emits exactly those three diagnostics named in the doc (lines 52–54 of agent). Also emits `objects_orphan_l2` and `objects_dangling_anchor` — extra diagnostics not mentioned in the doc, which is fine. |
| `domainspec-premises.md` | P-DS-7.op-1 | "The `domainspec-emit-signals`...cycle bets that signals emitted at the end of agent runs accumulate into actionable patterns..." (lines 103–106) | `domainspec-emit-signals` skill | [`.claude/skills/domainspec-emit-signals/SKILL.md:6–9`](.claude/skills/domainspec-emit-signals/SKILL.md) | `confirmed` | Skill objective matches: "Ensure every DomainSpec agent session produces structured signals that feed the async reflection loop." Appends to `docs/signals/pipeline-signals.jsonl`. |
| `domainspec-premises.md` | P-DS-7.op-2 | "The...`domainspec-signal-observer`...cycle bets..." (line 103) | `domainspec-signal-observer` skill | [`.claude/skills/domainspec-signal-observer/SKILL.md:8–11`](.claude/skills/domainspec-signal-observer/SKILL.md) | `confirmed` | Skill provides "independent observation of execution sessions by reading telemetry bundles and emitting behavior-level signals." Matches the described role in the cycle. |
| `domainspec-premises.md` | P-DS-7.op-3 | "The...`domainspec-reflect` cycle bets that signals...accumulate into actionable patterns — enough to drive skill rewrites and agent prompt updates from data rather than vibes." (lines 103–106) | `domainspec-reflect` skill | [`.claude/skills/domainspec-reflect/SKILL.md:8–18`](.claude/skills/domainspec-reflect/SKILL.md) | `claim-overstates-agent` | The premise says the cycle drives "skill rewrites and agent prompt updates." The skill's authority rule (lines 136–138) states: "This skill NEVER modifies source code, spec files, or skill files directly. Proposals are recommendations — they require human approval." The skill produces a TUNING-REPORT.md and optionally GitHub Issues. It does not enact rewrites; it proposes them. The premise's "drive...updates" language overstates the skill's actual effect. |
| `domainspec-premises.md` | P-DS-8.op-1 | "Skills that dispatch parallel subagents (`domainspec-subagents-strategy`...) should be recommended by the orchestrator and confirmed by the user before fan-out, never auto-invoked." (lines 111–113) | `domainspec-subagents-strategy` skill | [`.claude/skills/domainspec-subagents-strategy/SKILL.md:18–39`](.claude/skills/domainspec-subagents-strategy/SKILL.md) | `confirmed` | Skill Step 1 is "Propose in chat" with no file writes, Step 2 is "User confirms" with explicit "Wait for explicit user response" before any dispatch. Matches the describe recommend-and-confirm policy. |
| `domainspec-premises.md` | P-DS-8.op-2 | "Skills that dispatch parallel subagents (...`robot-talks`) should be recommended by the orchestrator and confirmed by the user before fan-out, never auto-invoked." (lines 111–113) | `robot-talks` skill | [`.claude/skills/robot-talks/SKILL.md:31–39`](.claude/skills/robot-talks/SKILL.md) | `agent-says-something-different` | The `robot-talks` skill does have user confirmation in Phase 1 Step 2 ("Agents do NOT spawn until the user evaluates and approves the approach"). However, `robot-talks` is not a "fan-out skill" in the same sense as `domainspec-subagents-strategy` — it is an **auditing tool** for cross-layer tension discovery. The premise lumps it into the same recommend-don't-auto-invoke policy as the strategy skill, which is accurate for the confirmation requirement, but the framing obscures that `robot-talks` has a fundamentally different scope (cross-layer tension audit vs. general parallel research fan-out). More critically: `robot-talks` has its own session-preservation step (create a `.claude/current_conversations/...` file) that `domainspec-subagents-strategy` explicitly forbids (R4/R5 — no files persisted by the strategist). The two skills have incompatible artifact models. Grouping them under one policy claim in P-DS-8 is imprecise. |
| `domainspec-premises.md` | P-DS-9.op-1 | "The `domainspec-sync-registry` skill rebuilds `docs/registry.md` and `docs/glossary.md` from feature SPEC concept tables on every sync." (lines 122–123) | `domainspec-sync-registry` skill | [`.claude/skills/domainspec-sync-registry/SKILL.md:2–33`](.claude/skills/domainspec-sync-registry/SKILL.md) | `confirmed` | Skill's process steps 2–5 parse concept tables from feature SPECs and update registry/glossary. Matches the "from feature SPEC concept tables" claim. Note: "on every sync" means on each invocation — not a CI-triggered automatic sync. The skill has no auto-trigger wiring. |
| `domainspec-premises.md` | P-DS-12.op-1 | "`domainspec-brownfield-translation` correctly implements the AX-DS-1 boundary condition...the skill (a) surfaces the candidate set rather than silently collapsing it, (b) preserves the rejected candidates per AX-DS-4, and (c) marks the project as transitioned to steady-state..." (lines 85–88) | `domainspec-brownfield-translation` skill | [`.claude/skills/domainspec-brownfield-translation/SKILL.md:51–117`](.claude/skills/domainspec-brownfield-translation/SKILL.md) | `agent-says-something-different` | The skill document has zero language implementing (a), (b), or (c). There is no step surfacing a candidate set β(C). There is no step preserving rejected candidates as AX-DS-4 decision nodes. There is no marker written to prevent re-invocation. The premise document itself admits "Likely partial. No audit yet confirms (a)/(b)/(c)." However, the skill document is what must be audited — and it makes no attempt to implement these obligations. The skill does thorough brownfield as-is documentation, but it does not implement the boundary condition formalized in AX-DS-1 Appendix A.1. This is the most material gap found. |

---

## Notable Gaps

### Gap 1 — `domainspec-decision-gate` is on-demand, not a guardian (AX-DS-4.op-1)
The axiom states the gate "blocks document mutation when a decision is unresolved." This implies an automatic enforcement mechanism. The skill has no hook, CI integration, or `PreToolUse` guard. It must be manually invoked. A manual invocation can be skipped — so the axiom's guarantee is vacuous unless convention enforces invocation. AX-DS-4's operationalization is purely normative, not mechanically enforced.

### Gap 2 — P-DS-12 / `domainspec-brownfield-translation` three-obligation mismatch
This is the most self-undermining finding relative to the user's audit question. AX-DS-1 Appendix A.1 specifies three obligations for the brownfield bootstrap: candidate-set surfacing, rejected-candidate preservation, and steady-state transition marking. P-DS-12 names all three as open obligations. The skill definition at `.claude/skills/domainspec-brownfield-translation/SKILL.md` does not implement any of them. The methodology's own meta-doc (`domainspec-axioms.md`) cites `domainspec-brownfield-translation` as operationalizing the boundary condition — but the actual skill implements a different, useful thing (as-is documentation) without satisfying the theoretical obligation. AX-DS-1 is thereby partially unoperationalized in the very document that claims it is.

### Gap 3 — AX-DS-3.op-1 wrong agent assigned
The axiom assigns "flags code units lacking a citation in any aspect" to `domainspec-layering-auditor`. The layering auditor detects domain behavior in the wrong architectural layer (domain vs. use-case), not citation absence. Citation absence is the orphan-behavior check — that is structurally the alignment auditor's role. Both agents work from feature SPEC docs, not from a broader artifact graph. The axiom text conflates layering violations with orphan-behavior detection and assigns the wrong agent to the orphan check.

### Gap 4 — "artifact graph" language in AX-DS-3.op-2 has no implementation
The claim that `domainspec-alignment-auditor` "cross-checks each behavior against the artifact graph" imports a graph-traversal concept not present in either the agent definition or any tool in its allowed-tools list. The agent reads flat feature docs and code; it does not traverse graph edges. The vault knowledge graph (`## Connections` sections) is not consumed by any auditor agent. This claim in AX-DS-3.op-2 is aspirational.

### Gap 5 — `robot-talks` and `domainspec-subagents-strategy` have incompatible artifact models
P-DS-8 groups both under one "recommend-don't-auto-invoke" policy. The grouping is correct about user confirmation, but the two skills differ materially: `robot-talks` mandates session-file persistence in `.claude/current_conversations/` (SKILL.md line 73), while `domainspec-subagents-strategy` R4/R5 explicitly forbid file writes during proposal and collection phases. Treating them as interchangeable fan-out skills in the same premise obscures a real architectural difference that matters when the user is deciding which to invoke.

### Gap 6 — `domainspec-reflect` proposes, not enacts (P-DS-7)
The premise says the cycle drives "skill rewrites and agent prompt updates from data." The skill's authority rule explicitly prohibits modifying skill files. It produces a TUNING-REPORT.md. The closed loop described in P-DS-7 requires a human decision to turn proposals into actual changes. The premise's "drive...updates" language should say "propose updates for human approval."

---

## Agent 2 — Empirical state audit: do the factual repo-state claims hold

agentId: a37ae76cdb7801021

## Child B — Empirical Claim Verification Report

### 1. Summary

| Verdict | Count |
|---------|-------|
| confirmed | 4 |
| partial | 2 |
| false | 1 |
| unverifiable | 1 |

**Total claims checked: 8** (7 explicit + 1 additional empirical claim found in P-DS-2)

---

### 2. Per-Claim Blocks

**Claim 1 — L1 extractor output**
Source: `domainspec-premises.md`, P-DS-2 demotion footnote

> "one real output exists (`docs/features/payment-processing/_categorical/L1.json`, 21 objects, 26 morphisms, valid categorical structure), produced manually, no CI invocation, no drift detection."

**Claimed:** File exists; 21 objects, 26 morphisms; valid categorical structure (all morphism sources/targets reference a defined object); produced manually; no CI invocation; no drift detection.

**Observed:**
- `find . -name "L1.json"` → `/docs/features/payment-processing/_categorical/L1.json` — EXISTS.
- `jq '.objects | length'` → **21**. `jq '.morphisms | length'` → **26**.
- Structural validation: all 26 morphisms have `source` and `target` values that appear in the 21 defined object IDs. Invalid morphisms with dangling references: **0**.
- CI check: `.github/workflows/` directory does not exist. No GitHub Actions workflow files found. No settings.json hooks invoke any extractor. No skill or pipeline skill references the extractors in a scheduled/automated way.
- No drift detection mechanism found anywhere.

**Verdict: confirmed**. Delta: None.

**Claim 2 — L2 extractor output**
Source: `domainspec-premises.md`, P-DS-2 demotion footnote

> "schema fully defined, single output is empty (no `src/`, `tests/`, `apps/` exist in repo), not invoked by any pipeline."

**Observed:**
- `find . -name "L2.json"` → `/docs/features/payment-processing/_categorical/L2.json` — EXISTS, objects: 0, morphisms: 0.
- Directory check at repo root: `src/` → NOT FOUND. `tests/` → NOT FOUND. `apps/` → **EXISTS** (`apps/web/` with `src/`, `package.json`, `vite.config.ts`). Also `/backend/src/` exists.
- No GitHub Actions workflows exist. No pipeline invocation of `domainspec-l2-extractor` confirmed.

**Verdict: partial**. Delta: The claim "no `src/`, `tests/`, `apps/` exist in repo" is **false for `apps/`**. `/apps/web/` exists with a frontend application. `/backend/src/` exists. The L2 emptiness reason ("because these directories don't exist") is therefore incorrect — the directories exist but the extractor was never run against them. The degenerate L2 output is still accurate, and the no-pipeline-invocation claim holds.

**Claim 3 — Δ extractor output**
Source: `domainspec-premises.md`, P-DS-3 demotion footnote

> "schema complete, single output is degenerate (100% morphisms unwitnessed, all confidence levels = 'none') because L2 is empty."

**Observed:**
- `find . -name "delta.json"` → `/docs/features/payment-processing/_categorical/delta.json` — single file.
- `object_map`: 21 entries, all `confidence: "none"`.
- `morphism_map`: 26 entries, all `confidence: "none"`, all `l2: []`.
- `diagnostics.objects_unmapped`: all 21 objects listed.
- `diagnostics.morphisms_unwitnessed`: all 26 morphisms listed across all rel types.
- `diagnostics.rel_type_coverage`: all 10 rel types at `0.0`.
- Unwitnessed percentage: **26/26 = 100%**. All confidence levels = `"none"` with zero exceptions.

**Verdict: confirmed**. Delta: None.

**Claim 4 — No Tier-2 verifier agents**
Source: `domainspec-premises.md`, P-DS-3 demotion footnote

> "no injectivity, faithfulness, or M2-representability checkers"

**Observed:**
- `ls .claude/agents/` → 40 agent files; none are named `domainspec-injectivity-*`, `domainspec-faithfulness-*`, or `domainspec-m2-*`.
- `grep -i "injectivity|faithfulness|m2-representability"` across all agent files → only hits are in `domainspec-delta-extractor.agent.md`, which **describes** what downstream Tier-2 verifiers *would* consume — it does not implement them.
- `domainspec-verifier.agent.md` exists but is a feature-level implementation verifier, not a categorical structural verifier.

**Verdict: confirmed**. Delta: None.

**Claim 5 — Alignment-auditor does not consume `delta.json`**
Source: `domainspec-premises.md`, P-DS-3 demotion footnote

> "Alignment-auditor, the operational consumer, reads SPEC + code directly — does not consume `delta.json`."

**Observed:**
- Read `.claude/agents/domainspec-alignment-auditor.agent.md` fully. Inputs: `domainspec/CHANGELOG.md`, `docs/features/{feature}/*.md`, source and test files. Output: `docs/features/{feature}/ALIGNMENT-REPORT.md`.
- `grep "delta.json|_categorical|L1.json|L2.json"` → **zero hits**.
- No reference to categorical artifacts anywhere in the agent definition.

**Verdict: confirmed**. Delta: None.

**Claim 6 — Brownfield-translation skill surface / P-DS-12 open obligations**
Source: `domainspec-premises.md`, P-DS-12

> "open obligations: audit candidate-preservation, define the brownfield→steady-state transition marker, document what user action counts as ratification."

**Observed:**
- Read `.claude/skills/domainspec-brownfield-translation/SKILL.md` fully (187 lines).
- (a) Candidate set surfacing: skill builds a feature inventory with confidence labels (`observed`, `stated`, `hypothesized`) and asks targeted questions for ambiguous behavior. This is partial candidate enumeration, but it does NOT explicitly surface `β(c)` as a set of candidate specs — it outputs a single as-is spec. No multi-candidate presentation found.
- (b) Rejected-candidate preservation (AX-DS-4): No step writes rejected candidates as decision nodes or AX-DS-4 records. Step 10 produces `GOVERNANCE-GAPS.md` and `ONTOLOGY-GAPS.md` but nothing recording "we considered X and rejected it." No `node_type: decision` artifacts emitted. **Obligation is open.**
- (c) Steady-state transition marker: No step sets a "brownfield bootstrap done" flag, no frontmatter field marks `β-complete`, and no check blocks re-invocation. **Obligation is open.**

**Verdict: confirmed** (the three obligations are exactly as claimed: open and unimplemented). Delta: None.

**Claim 7 — Discovery → Spec → Plan → Code ordering**
Source: `domainspec-premises.md`, P-DS-4; `domainspec-axioms.md`, AX-DS-1 operationalization

> "the discovery → spec → plan → code pipeline ordering enforce direction" — and CLAUDE.md route 3 is cited as the encoding.

**Observed:**
- CLAUDE.md route 3: "Discovery first ... If asked to write a spec for a feature that has no discovery, **stop** and write the discovery first."
- `domainspec-spec-feature` SKILL.md, step 0: implements a "discovery-existence precondition (soft gate)" — searches for a discovery file, if MISSING issues a HALT with a recommendation block. Does NOT refuse hard; accepts `--skip-discovery` with a waiver reason.
- `domainspec-pipeline` SKILL.md: propagates `--skip-discovery` flag to all subordinate skills.
- No pre-commit hook, CI job, or settings hook enforces the ordering across all entry points.

**Verdict: partial**. Delta: The word "enforce" in the operationalization overstates what exists. The gate is a **soft halt** that accepts a one-line waiver. Better characterized as "strongly recommends and requires explicit override" rather than enforced. P-DS-4's wording ("encodes this bet") is accurate; AX-DS-1's "enforce" is the overstated formulation.

**Claim 8 — Additional empirical claim: L2 emptiness caused by missing src/tests/apps**
Source: P-DS-2 demotion footnote.

**Verdict: false**. Delta: The causal explanation is inverted. The directories exist; the extractor was never invoked against them. The L2 output is empty because no one ran the extractor, not because there is nothing to extract.

---

### 3. Surprises

**S1 — `apps/` and `backend/src/` exist and contain real application code.** The L2 extractor has actual source material available (`apps/web/src/`, `backend/src/`) that it has never been run against. This reframes P-DS-2's promotion path: it's not "wait for `src/` to appear" but "run the extractor against existing `apps/` and `backend/`."

**S2 — The `delta.json` `extraction_date` is `2026-05-01` (4 days before the audit date of 2026-05-05).** The delta was run recently. The demotion is freshly evidence-backed, not stale.

**S3 — No GitHub Actions workflows directory exists at all.** The `.github/` folder contains agents, skills, and instructions but no `.github/workflows/` directory. There is zero CI infrastructure for this repo.

**S4 — `domainspec-delta-extractor.agent.md` explicitly names Tier-2 verifiers as downstream consumers ("Tier 2 inputs ready") but no such agents exist.** The extractor was designed anticipating consumers that were never built.

---

## Agent 3 — Math/formalism review of axiom appendices A.1–A.4 against training

agentId: a85a6039de342db73

## Headline

The math layer of this document is a mixed bag. The DPI and conditional entropy claims in A.1 and A.3 are directionally correct but applied loosely — `intent` is never formally defined as a random variable, which makes the entire information-theoretic chain technically ungrounded even if the intuition is sound. A.2's category theory is the weakest section: the "natural transformation" claim is malformed (no functors are specified), and the "2-cell" remark is hand-waving at a structure that is not constructed anywhere. A.4's EVPI inequality is stated correctly in direction but the entropy formula `H(A_t | D_t) = log₂(|A_t| − 1)` contains an error. The Curry–Howard analogy in A.1 and the Hadamard citation are purely decorative. Overall, the formalism is doing real rhetorical work — it makes the document feel more rigorous than it is — but most of it is not load-bearing in the sense that removing it would not break any derivation. The honest description of this layer is: informed heuristics dressed in mathematical notation, not theorems.

---

## A.1 — AX-DS-1

**Claim: DPI chain `I(intent;S) ≥ I(intent;C) ≥ I(intent;Cₙ)`** — Verdict: `over-claim`. DPI requires `intent`, `S`, `C`, `Cₙ` to form a Markov chain in that order, but `intent` is never defined as a random variable with a probability space. The conclusion (information lost across the chain) is intuitively correct and defensible without DPI; the theorem is not doing the work the citation implies. Tighter rewording: "Compilation Φ is many-to-one by design; every lossy many-to-one map discards information about its preimages — an elementary consequence of surjectivity, no DPI invocation required."

**Claim: `H(S | C) > 0` under many-to-one Φ** — Verdict: `sound` (conditioned on accepting intent as a latent RV). When multiple S map to same C, knowing C does not uniquely determine S, so conditional entropy is positive. Elementary but not wrong.

**Claim: Brownfield formalism `β : C → 𝒫(S)`, `ratify : 𝒫(S) × user_decisions → S₀`** — Verdict: `decorative`. Notation theater. The set-valued map β formalizes "reverse-compilation produces multiple candidate intents" — but that observation requires no formalism. `ratify` is just a name for "the user picks one." Not wrong, but not load-bearing. Tighter rewording: "The brownfield bootstrap is a one-shot user-mediated disambiguation: code is ambiguous about intent, the user picks an interpretation, and that interpretation becomes S₀."

**Claim: Curry–Howard analogy ("structurally identical")** — Verdict: `over-claim` / `decorative`. Curry–Howard is a precise syntactic isomorphism between typed lambda calculi and intuitionistic proof systems, runs in BOTH directions. The analogy here ("a proof carries strictly more structural information than its compiled program form") is true for proof-erasing compilers but is not a general feature of Curry–Howard — depends on type retention. "Structurally identical" is false. Tighter rewording: "Loosely analogous to proof-erasing compilation: the spec (like a typed proof) contains more structural information than the code (like an untyped term), but unlike Curry–Howard, no formal isomorphism exists — the analogy is motivational only."

**Claim: Hadamard well-posedness (in references)** — Verdict: `decorative`. Never invoked in body text of A.1; pure name-dropping. Remove citation, or replace with: "The brownfield bootstrap is framed as an initial condition — an analogy to differential equations — but no formal PDE properties are invoked."

---

## A.2 — AX-DS-2

**Claim: Commuting diagram and three conditions (coverage, injectivity, `N_C ∘ Φ_concept = N_S`)** — Verdict: `sound` / `load-bearing-but-decorative-citation`. Three conditions are correct and clearly stated. This is the strongest formalism in the document — doing real work.

**Claim: "Naming as a natural transformation"** — Verdict: `over-claim`. A natural transformation requires two functors F, G : C → D and naturality squares. The doc names two maps and says they are "components of a natural transformation between the spec-naming functor and the code-naming functor" — but no functors are defined. What are the source categories? What are the morphisms in Σ_S, Σ_C? Without specifying functors, "natural transformation" is just a synonym for "commuting diagram," which is weaker than what the term means in category theory. Tighter rewording: "The diagram commutes — that is the load-bearing condition. Whether this rises to a natural transformation in the categorical sense depends on what morphisms are defined on Σ_S, Σ_C, and R, which the current formulation leaves unspecified."

**Claim: `H(Σ_C | Σ_S, R) = 0` from commutativity** — Verdict: `over-claim`. Commutativity gives `N_C(Φ_concept(s)) = N_S(s)` for all s ∈ Σ_S. This determines N_C on the IMAGE of Φ_concept, not on all of Σ_C unless Φ_concept is surjective onto Σ_C. The conditional entropy claim only follows under additional surjectivity assumption (which is AX-DS-3's territory). Tighter rewording: "Under the additional assumption that Φ_concept is surjective (enforced by AX-DS-3), commutativity implies H(Σ_C | Σ_S, R) = 0."

**Claim: "Registry change is a 2-cell"** — Verdict: `decorative` / `over-claim`. 2-cells require a 2-categorical structure that is nowhere constructed. The real point — registry changes require synchronized updates to both naming maps — is correct and important, but needs no categorical machinery. Tighter rewording: "A registry rename requires N_S and N_C to update together to preserve commutativity — no category theory needed to express this constraint."

---

## A.3 — AX-DS-3

**Claim: Trace map `τ : B → 𝒫(A) \ {∅}`** — Verdict: `sound`. Standard requirements-traceability formalism, correctly framed.

**Claim: `H(B | A) = 0` from trace map existence** — Verdict: `over-claim`. `H(B | A) = 0` means B is a deterministic function of A. But τ goes B → 𝒫(A), not A → B. The trace map says every behavior has artifacts, not that artifacts determine behaviors. You can have τ total while A → B is highly stochastic. The framing conflates the direction of the trace map with its inverse. Tighter rewording: "The trace map τ requires every behavior to have a non-empty preimage in A; this is a coverage condition on Φ (surjectivity onto B), not a determinism claim about A → B."

**Claim: Surjectivity vs. bijectivity distinction** — Verdict: `sound`. Doing real work — prevents misreading the axiom as requiring one-to-one correspondence.

**Claim: Gotel & Finkelstein 1994 citation** — Verdict: `load-bearing-but-decorative-citation`. Canonical traceability reference, appropriate to cite, but their "orphan/widow" framework is for requirements, not code behaviors. The τ formalism is original notation inspired by traceability literature, not taken from G&F. More honest note: "inspired by" rather than "formalizing."

---

## A.4 — AX-DS-4

**Claim: EVPI inequality** — Verdict: `sound` in direction, `over-claim` in precision. Direction correct (more known, less expected info gain). Standard textbook EVPI (Lindley 1956): `EVPI = E[maxₐ U(a, θ)] − maxₐ E[U(a, θ)]` — value of learning the true state of nature before deciding. The doc is using EVPI to mean "value of re-examining a past decision," closer to value-of-clairvoyance in sequential decision problem, not standard single-period EVPI. Lindley citation is being stretched.

**Claim: `H(A_t | D_t) = log₂(|A_t| − 1)` under uniform prior** — Verdict: `over-claim` / contains an error. Under uniform prior over A_t, entropy of uniformly distributed variable over `|A_t|` values is `log₂(|A_t|)`, not `log₂(|A_t| − 1)`. The `− 1` adjustment applies if computing entropy of rejected set R_t = A_t \ {D_t} (which has |A_t| − 1 elements). Conflates `H(R_t)` with `H(A_t | D_t)`. Off-by-one in the support set, matters because the distinction is precisely what the formula is trying to make. Tighter rewording: "Storing only D_t loses `H(R_t) = log₂(|A_t| − 1)` bits (under uniform prior over rejected alternatives) — the entropy of the unchosen set."

**Claim: "Parallel to AX-ONT-5" — `H_perceived → H_real` improving calibration** — Verdict: `decorative` / category error. Calibration in Jaynes's MaxEnt sense means subjective probability estimates aligning with true frequencies. Registering a rejected alternative records a decision, not a probability estimate. `H_perceived → H_real` is undefined. Tighter rewording: "Recording rejected alternatives converts unknown unknowns into known unknowns — a practical memory claim that needs no entropy framing."

---

## Citations Review

| Reference | Axiom | Load-bearing? | Honest alternative |
|---|---|---|---|
| Cover & Thomas (1991) Thm 2.8.1 — DPI | A.1 | No | "Information lost across many-to-one maps" — elementary, no citation needed |
| Shannon (1948) | A.1, A.3 | Partially | Cite only for `H(S\|C)` framing; remove from DPI chain |
| Howard (1969/1980) — Curry–Howard | A.1 | No | Remove or demote to footnote as "loose analogy" |
| Hadamard (1902) | A.1 | No | Remove entirely |
| Mac Lane / Goguen / Awodey | A.2 | Partially | Cite only for commuting diagram; remove natural transformation / 2-cell claims |
| Gotel & Finkelstein (1994) | A.3 | Decorative | Keep citation as "inspired by" not "formalizing" |
| Lindley (1956) | A.4 | Partial | Acceptable with note that this is informal EVPI analogy |
| Pearl (2009) — Counterfactuals | A.4 | Not invoked | Remove or actually use Pearl's do-calculus |
| Jaynes (1957) — MaxEnt | A.4 | No | Remove; replace with plain organizational-memory claim |

---

## Hardest Finding

The single most important place where math is doing rhetorical rather than load-bearing work is **A.2's natural transformation claim**. The commuting diagram in A.2 is the strongest and most honest piece of formalism in the entire document — it correctly captures the one-vocabulary invariant as an algebraic condition on finite sets, and it would be enough. But the document then pivots to "when the diagram commutes, N_S and N_C are components of a natural transformation between the spec-naming functor and the code-naming functor." This sentence is formally empty: no functors are defined, no source or target categories are given, no morphisms are specified on Σ_S, Σ_C, or R. "Natural transformation" here means nothing more than "commuting diagram," which is what the doc already has — invoking the categorical term adds zero content while lending the appearance of advanced mathematical machinery. The "2-cell" remark compounds this: it uses 2-categorical vocabulary to describe a constraint (synchronized updates) that plain English states more accurately and more usefully. This matters especially because A.2 is the axiom with the most operationalizable math — the commuting diagram genuinely guides the `domainspec-sync-registry` tool. Dressing it in category theory that is not cashed out risks obscuring the real constraint behind terminology that future maintainers may not scrutinize carefully enough to notice is empty.

---
