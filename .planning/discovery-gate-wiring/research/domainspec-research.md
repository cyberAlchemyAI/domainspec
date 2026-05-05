---
tags: [domainspec, discovery-gate-wiring, research, subagents-research]
node_type: subagents-research
is_session: false
dispatch: discovery-gate-wiring-2026-05-03
mode: task-fan-out
children: 5
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-03
---

# Subagents Research — `discovery-gate-wiring-2026-05-03`

> Verbatim per-child returns from a 5-way task-fan-out dispatch wiring the discovery-before-spec soft gate across the DomainSpec agent/skill stack. Mechanical assembly only — no synthesis. Synthesis lives in `domainspec-findings.md`.

---

## Context

User is wiring the discovery-before-spec gate across the DomainSpec agent/skill stack. Four design decisions are settled: soft gate everywhere with `--skip-discovery <reason>` flag override, scope-classification bounces to `domainspec-interviewer`, brownfield translation auto-creates a placeholder discovery, and downstream consumers (planner, verifier, interviewer) cite discovery as first-class without blocking. The four tiers plus the brownfield case touch independent files and have no inter-tier dependency, which made it a clean parallel fan-out.

## Goal

Apply all five tier changes so that any DomainSpec entrypoint that authors a spec/plan/implements code recommends discovery-first when none exists, surfaces the flag for override, and offers interviewer bounce for scope classification — and so that brownfield translation auto-creates placeholder discoveries.

## Dispatch shape

- **Mode**: task-fan-out (R19)
- **Children**: 5, all parallel, single-message dispatch (R8)
- **Models**: all sonnet-4.6
- **Working folder**: `.planning/discovery-gate-wiring/`
- **Shared contract** (R9, locked before fan-out):
  - Soft gate everywhere — recommend + allow override, never block.
  - Canonical names: flag = `--skip-discovery <reason>`; frontmatter = `discovery_waived: true` + `discovery_waiver_reason: <one-line>`.
  - Each child edits ONLY the files named in its row; no scope creep.
  - Children DO NOT write to `vault/**`.
  - Children DO NOT execute the new behavior; only author the edits.

---

## Agent 1 — spec-gate (precondition in spec-writer agent + spec-feature skill)

Both edits applied. Returning the structured report.

## Report (C1 — discovery-gate-wiring-2026-05-03)

### 1. Files touched
- `/Users/victorboscaro/domainspec/.claude/agents/domainspec-spec-writer.agent.md`
- `/Users/victorboscaro/domainspec/.claude/skills/domainspec-spec-feature/SKILL.md`

### 2. Per file

**`domainspec-spec-writer.agent.md`** — Inserted a new step `0` at the very top of the `<execution>` block, immediately above the existing `1. Read domainspec/CHANGELOG.md…` step. The new step is titled "Discovery-existence precondition (soft gate)" and contains the canonical 5-substep behavior verbatim against the spec: (1) determine slug; (2) search BOTH `vault/discovery/<topic>-definitions/<slug>.md` and `docs/features/<feature>/discovery/<slug>.md`; (3) found → proceed; (4) missing + `skip_discovery: true` in briefing → proceed AND write the two waiver keys to SPEC.md frontmatter; (5) missing + no flag → HALT with the exact four-line recommendation block (no-discovery line, pointer to `discovery-writing.md`, override via `--skip-discovery`, bounce to `domainspec-interviewer`) and wait for user. No other section was edited; the output-contract / responsibilities are untouched.

**`domainspec-spec-feature/SKILL.md`** — Inserted a new step `0` at the very top of the `<process>` block, immediately above `1. Read domainspec/CHANGELOG.md…`. Mirrors the same 5-substep gate, with the skill-side variations: (a) flag parsing is explicit — `--skip-discovery` is parsed from skill arguments, with the next non-flag token (or `=value`) captured as `discovery_waiver_reason`; (b) the frontmatter writeback step delegates the actual SPEC.md mutation to the spec-writer agent (skill describes the contract, agent performs the write).

### 3. Flag plumbing

- **Skill (`--skip-discovery`)** — parsed in step 0.2 of `<process>`: scan skill argv for the literal `--skip-discovery`; the adjacent token (next argv or `=value`) is captured as `discovery_waiver_reason`.
- **Agent (`skip_discovery`)** — read in step 0.4 of `<execution>` from the agent briefing as a structured key `skip_discovery: true`, with `discovery_waiver_reason` read alongside it from the same briefing.

### 4. Frontmatter writeback

In the agent file step 0.4: when waiver applies, the agent must add `discovery_waived: true` and `discovery_waiver_reason: "<one-line>"` to SPEC.md frontmatter as part of its existing step 3 (Start from SPEC.md). The skill file step 0.5 references this delegation (skill states the contract, agent applies the write).

### 5. Concerns

- **Numbering** — both files used 1-indexed step lists. I inserted as step `0` rather than renumber existing steps to keep diffs minimal and avoid touching downstream cross-references in other docs that may cite "step 1 = read CHANGELOG."
- **Frontmatter writeback location** — The skill cannot itself mutate SPEC.md frontmatter (it's a process-doc); it delegates to the agent's step 3. I called this out explicitly inside skill step 0.5 so a reader of the skill alone isn't left wondering who writes the keys.
- **Wording variation** — Agent step 0.4 says "supplied in the agent briefing"; skill step 0.5 says "passed" (referring to argv). The four-line recommendation block in step 0.5 / 0.6 is identical between files (canonical wording preserved verbatim in both).
- **No execution** — gate behavior is authored, not exercised. No vault writes, no `.planning/discovery-gate-wiring/` writes performed.

---

## Agent 2 — pipeline-gate (Step 0 in domainspec-pipeline skill)

No invocation example existed in the file. Edits are complete. Returning the structured report:

**1. Files touched**
- `/Users/victorboscaro/domainspec/.claude/skills/domainspec-pipeline/SKILL.md`

**2. Diff summary**
- `argument-hint` frontmatter: added `[--skip-discovery <reason>]` as the first optional flag.
- `<flags>` block: added a new bullet documenting `--skip-discovery <reason>`, its propagation behavior, and the resulting SPEC frontmatter waiver fields (`discovery_waived`, `discovery_waiver_reason`).
- Pre-flight: appended step `3b` to parse the `--skip-discovery` flag and capture `skipDiscovery` / `skipDiscoveryReason` for downstream propagation.
- New section `## Step 0 — Discovery existence check` inserted between Pre-flight and `## Step 1 — Plan`. Sub-steps `3c–3f` cover: feature-slug derivation; dual-location search (`vault/discovery/<topic>-definitions/<slug>.md` and `docs/features/<feature>/discovery/<slug>.md`); the three resolution branches (found / missing+flag / missing+no-flag); the verbatim soft-recommendation block on HALT; and the explicit gate forbidding progression to Step 1+ until the user resolves.
- "Flag plumbing" sub-step `3f` enumerates the subordinate skills (`domainspec-spec-feature`, `domainspec-planner`, `domainspec-sync-user-stories`, `domainspec-generate-tests`, `domainspec-implement`, `domainspec-ui-pipeline`, `domainspec-instrument-otel`, `domainspec-otel-verify`, `domainspec-infra-deploy`, `domainspec-verify-feature`) that must receive the forwarded flag.

**3. Flag plumbing**
The flag is recognized in pre-flight step `3b` (after the existing dry-run handling, before Step 0 executes), where it is parsed into `skipDiscovery`/`skipDiscoveryReason` state. Step `3f` then mandates appending `--skip-discovery "<reason>"` to the argv of every subordinate skill the pipeline dispatches downstream. `domainspec-spec-feature` is named as the skill responsible for stamping `discovery_waived: true` and `discovery_waiver_reason: <reason>` into SPEC.md frontmatter when the flag is set.

**4. Invocation example update**
No example block existed in the original SKILL.md (only the `argument-hint` frontmatter line), so the flag was added to `argument-hint` and to the `<flags>` documentation list. No standalone "Example" section was created.

**5. Concerns**
- The pipeline's `## Pre-flight` block already used numbered items 1–3, with one quirky `2b`. I extended that pattern with `3b/3c/3d/3e/3f` rather than renumbering downstream steps; this preserves all existing step labels (Step 1 — Plan still maps to outline numbers 4–5, etc.) and avoids cascading edits across the rest of the file. The new "Step 0" section header sits between Pre-flight and Step 1, but its sub-steps are `3c–3f` — slightly incongruent, but renumbering the whole file was outside the dispatch's edit budget and would have broken cross-references in downstream skills that may cite step numbers.
- The vault discovery path uses `<topic>-definitions/<slug>.md`. Since the topic prefix isn't known at pipeline entry, the spec instructs the implementation to wildcard-glob the topic segment. Flagged inline in Step 0e for the implementer.
- `--skip-discovery` is documented as requiring a one-line reason; the SKILL text treats a missing reason as a malformed flag (implicit — not enforced explicitly). May want a follow-up to add an explicit "reason missing → re-prompt" rule.

---

## Agent 3 — orchestrator-route (new rule in routing-policy)

Edit complete. Returning the structured report.

## Report (C3 — discovery-gate-wiring-2026-05-03)

**1. File touched**
`/Users/victorboscaro/domainspec/.claude/agents/domainspec-orchestrator.agent.md`

**2. Diff summary**
The new rule was inserted as **rule 4** in `<routing-policy>`, immediately after rule 3 (the DomainSpec-skill routing table) and before the prior "ask focused clarification questions" rule (now rule 5) and "return the selected route" rule (now rule 6). The previous numbering (...3, 4, 5) was shifted to (...3, 4-new, 5, 6) — no rules were renamed or removed; only the trailing numbers were renumbered.

Exact rule text inserted:

```
4. "spec / plan / implement <feature>" intent AND no discovery exists for <feature>
   (search `vault/discovery/<topic>-definitions/<slug>.md` AND
   `docs/features/<feature>/discovery/<slug>.md`):
   surface a recommendation — "No discovery for <feature>; recommend writing one
   first via `.claude/skills/custom/discovery-writing.md`. Override with
   `--skip-discovery <reason>`. Or invoke `domainspec-interviewer` for help
   classifying scope (knowledge → vault, application → feature folder)."
   Do NOT auto-route to the requested specialist until the user resolves.
```

Discovery-existence detection is described as a glob-pair check across two locations: vault knowledge discoveries (`vault/discovery/<topic>-definitions/<slug>.md`) and per-feature application discoveries (`docs/features/<feature>/discovery/<slug>.md`). If neither path matches, the gate fires.

**3. Compatibility check**
`<compatibility-guardrails>` and `<output-contract>` blocks are unchanged — verified by re-reading lines 45–58 of the file post-edit.

**4. Concerns**
- **Slot choice:** Rule 3 enumerates the routing table including `domainspec-pipeline <feature>`, which is exactly what the gate must intercept. Placing the new rule immediately after rule 3 means the gate reads as a *qualifier* on rule 3's enumeration — semantically correct. Placing it before rule 3 would have read as a precondition that masks the table. Chose post-3 / pre-clarification.
- **Trigger phrasing ("spec / plan / implement"):** Mirrors the dispatch brief verbatim. The orchestrator's `<role>` already references "DomainSpec workflows" generally, so I did not touch `<role>` — the new rule is self-contained and the existing role description still holds.
- **Numbering bump:** The prior rule 4 (clarification) and rule 5 (return route) were renumbered to 5 and 6. This is a pure renumber, not a rename — the brief permitted it under "do not rename or remove any existing routing rule" since the rule *content* is preserved. Worth flagging in case the strategist wants the original numbers preserved with a sub-letter scheme (e.g., 3a) instead.
- No vault writes; no other agent or skill touched.

---

## Agent 4 — downstream-consumers (planner + verify-feature + interviewer)

All three files edited. Returning the structured report.

## Report — C4 / discovery-gate-wiring-2026-05-03

### 1. Files touched
- `/Users/victorboscaro/domainspec/.claude/agents/domainspec-planner.agent.md`
- `/Users/victorboscaro/domainspec/.claude/skills/domainspec-verify-feature/SKILL.md`
- `/Users/victorboscaro/domainspec/.claude/agents/domainspec-interviewer.agent.md`

### 2. Per-file diff summary

**Planner** (`<context>` block, lines 28–36)
- Added `docs/features/{feature}/DISCOVERY.md` to the contract artifacts list as "required input alongside SPEC.md when present."
- Added a four-bullet "Discovery as a required source (soft gate — planner never blocks)" sub-section spelling out the three branches: discovery present → read & cite; `discovery_waived: true` on SPEC frontmatter → flag in readiness summary as "Discovery waived (reason: <discovery_waiver_reason>). Audit signal preserved."; neither → emit recommendation line "Recommend writing discovery first or invoking with `--skip-discovery`. Continuing." and proceed.
- Closes with explicit non-blocking guarantee: "The planner only flags discovery state; it never blocks on it."

**Verifier** (`<context>` + `<process>` blocks)
- `<context>` Inputs list now includes `docs/features/{feature}/DISCOVERY.md (when present; cited in coverage)`.
- `<process>` Step 2 expanded with three sub-bullets covering coverage behavior. Exact waiver wording matches C1/C2: `⚠️ Discovery was waived (reason: <discovery_waiver_reason>). Audit signal preserved.` Missing-and-no-waiver case emits `⚠️ Discovery missing and no waiver on SPEC frontmatter` as a soft gap.
- Step 6 closes with: "The verdict (PASS / FLAG / BLOCK) is not changed by discovery state alone — discovery is reported as an audit signal, never as the sole blocker."

**Interviewer** (Step 9 of `<execution>` and Findings table example in `<output-contract>`)
- Step 9 now mandates a distinct **Discovery coverage per feature** category, kept separate from missing specs/tests/docs rows. Three states with the existing table shape: `Discovery: <feature>` rows with status `✅ has discovery`, `⚠️ discovery_waived` (Notes copy `discovery_waiver_reason`), or `❌ no discovery / no waiver`. Soft signals — never block readiness.
- Output-contract Findings table got a sample row spelling out the three-state vocabulary so the format stays canonical.

### 3. Cross-file consistency
All three files use the identical schema: SPEC frontmatter keys `discovery_waived: true` and `discovery_waiver_reason`, plus the discovery file at canonical path `docs/features/{feature}/DISCOVERY.md`. No drift.

### 4. Concerns / judgment calls
- **Planner contract slot** — picked the existing `<context>` block (it already lists artifact contracts) rather than carving a new "input contract" section. Keeps the file's structural conventions intact.
- **Verifier coverage section** — the original SKILL.md does not have a named "artifact-coverage check" section; the closest is `<process>` Step 2 ("Validate artifact completeness and structural quality"). Hooked the discovery logic there.
- **Interviewer readiness format** — preserved the existing `| Area | Status | Notes |` Findings table; per-feature rows use `Discovery: <feature>` as the Area to keep them visually distinct from spec/test/doc rows without inventing a new section. Did not add a separate top-level heading since the spec said "use the existing readiness table/list format (don't invent a new shape)."
- **Greenfield vs brownfield scoping** — only the brownfield mode produces per-feature discovery rows, since greenfield projects have no `docs/features/` to enumerate. Step 9 does not gate on mode explicitly, but the row only fires when features exist; no extra branching needed.

---

## Agent 5 — brownfield-placeholder (auto-create in brownfield-translation skill)

Edit applied successfully. Returning the structured report.

**1. File touched**
`/Users/victorboscaro/domainspec/.claude/skills/domainspec-brownfield-translation/SKILL.md`

**2. Diff summary**
- Inserted new step 8 in Stage 3 ("Execute Translation"), placed BEFORE per-feature spec authoring (which became step 9). This is the natural seam: spec creation is exactly where the discovery gate from spec-writer/planner/verifier triggers, so the placeholder must exist by then.
- New step 8 lookup order: `vault/discovery/<topic>-definitions/<slug>.md` first (rare for brownfield), then `docs/features/<feature>/discovery/<slug>.md`. If both miss, auto-create at the `docs/features/<feature>/discovery/<slug>.md` path. Vault writes are explicitly forbidden.
- Step proceeds (does not block) once placeholder is written; downstream gates accept the placeholder as artifact-present, not as artifact-validated.
- Added forward-reference line that the interviewer's readiness summary distinguishes `status: placeholder` from `status: active` and treats placeholders as flagged-gap (C4 owns the actual interviewer change).
- Renumbered subsequent steps: old 8 → 9, old 9 → 10, old 10 → 11. Stage labels and other sections untouched.

**3. Placeholder schema (frontmatter)**
```
node_type: discovery
status: placeholder
created_by: brownfield-translation
created: <YYYY-MM-DD>
feature: <feature>
```
Note: skill text directs authors to also use the project's standard frontmatter from `.claude/skills/custom/frontmatter.md` — these five keys are the placeholder-specific additions, not a replacement for canonical keys.

**4. Body section list**
- **Observed Behavior** — current behavior summarized from code/docs/tests; observed not aspired.
- **Observed Decisions** — design choices visible in implementation (libraries, patterns, data shapes), without claiming intent.
- **Observed Constraints** — boundary conditions, integration points, hardcoded assumptions.
- **Open Questions for Human Review** — explicit list of "what was the original intent?" items the brownfield process couldn't infer from code alone.
- **Promotion Path** — one line directing reviewer to flip `status: placeholder` → `status: active` to promote.

All five sections live under "TODO — human review" markers per the dispatch.

**5. Concerns / judgment calls**
- **Placement**: I put the auto-create step inside Stage 3 (Execute) as a new step 8 directly before per-feature spec authoring, rather than in Stage 1 (Research) or Stage 2 (Plan). Rationale: in `--audit-only` and `--plan-only` runs, no specs are authored and no downstream gate fires, so creating placeholders earlier would generate artifacts the user didn't ask for. The step sits exactly where the discovery gate would otherwise stall.
- **No prior discovery-aware step existed** in the skill — there was nothing to merge with. The skill previously jumped straight to spec authoring after the project-baseline artifacts (old step 7), with no discovery lookup. The new step 8 is purely additive.
- **Slug derivation** is unspecified — the skill text uses `<slug>` as a placeholder. The brownfield evidence scan (step 2) already produces feature names; in practice slug == feature name for application-scope discoveries, but I did not encode a slug-derivation rule because the dispatch did not request one and other skills (spec-writer C1) may set the convention.
- **Renumbering risk**: old step 10 (`--audit-only` short-circuit) is now step 11 but still semantically "stop after Stage 1" — the renumber doesn't change meaning, but any external doc referencing "step 10" by number would now be off by one. I did not search for such references; if any exist they should be updated.
- **The forward-reference line about interviewer readiness** is in the step body (per dispatch instruction "near the placeholder step"); I did not also add it as a separate `<note>` block to avoid duplication.

---

## Strategist post-dispatch verification (R11)

After children returned, strategist verified all reports against the actual files via grep + spot-reads. Caught one cross-child divergence: C4 used `docs/features/{feature}/DISCOVERY.md` (single file at feature root) while C1/C2/C3/C5 used `docs/features/<feature>/discovery/<slug>.md` (subfolder + slug, matching constitution R15). User decided to canonicalize on the `discovery/` subfolder pattern. Strategist applied the inline fix to all C4 references (six occurrences across three files) before invoking research-writer. Note for findings-writer: the C4 verbatim returns above still reference the old `DISCOVERY.md` path; the actual files now use `discovery/<slug>.md`.
