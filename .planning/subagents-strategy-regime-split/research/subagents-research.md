---
tags: [subagents, dispatch-artifact, subagents-research, regime-split]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: subagents-strategy-regime-split
implements: [R5, R15, R23 of subagents-strategy-constitution.md]
---

# Subagents-Research — `subagents-strategy-regime-split`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [subagents-strategy-constitution.md](../../../vault/constitution/subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

The prior session (`vault/sessions/2026-05-03-0140-subagents-strategy-discovery-target-divergence.md`) surfaced that the subagents-strategy stack hardcodes `vault/discovery/` as the only legal discovery sink — directly conflicting with R15 ("vault is for codified discipline") when the dispatch is application-level. The two-regime resolution (`knowledge` → vault, `application` → near-spec) was designed but not wired. The user has now asked to land it via the lifecycle: research → findings → discovery → (plan) → implementation. The user has also queued a verification subagent for after implementation.

## Goal

Produce a research+findings pair rigorous enough to become the discovery node that defines the two-regime model: classification rule, frontmatter schema change, path conventions, edit surface across constitution/skill/writer-agent. Implementation file edits come AFTER step 7, not in this dispatch.

---

## Dispatch metadata (R18)

- **Mode:** task-fan-out
- **Children:** C1 (regime-classification), C2 (ontology-impact), C3 (edit-surface-map)
- **Sequencing:** parallel set (single-message dispatch)
- **Recursion budget:** depth 2 / breadth 5 / total 10. Used: 3 of 10.
- **All children:** model=sonnet, no recursion permitted

---

## Agent 1 — regime-classification: rule, signals, decider, application-path convention

I have enough evidence. Let me synthesize the findings.

---

## 1. Classification rule

A discovery belongs to the **knowledge regime** (`vault/discovery/<topic>-definitions/<slug>.md`) if and only if its load-bearing claims are **about the vault's own discipline** — its ontology, schema, edges, agent/skill protocols, premises, constitutions, or any rule that other vault nodes will derive from. Otherwise it belongs to the **application regime** (lives next to the feature it concerns), because its claims are about a specific feature's design space and have no authority outside that feature folder. Put differently: ask "does the artifact need a `derives-from` / `governed-by` / `codified-as` edge into another vault node?" — if yes, it is knowledge; if its only outgoing references are to a feature's `SPEC.md` / `STORIES.md` / `DECISIONS.md`, it is application.

**Worked examples:**

- *"How should the edge catalog evolve when we add a new node_type?"* → **knowledge**. Amends `vault/ontology-conventions.md` Appendix C; needs `governed-by` → ontology constitution; future discoveries derive from it. Lands in `vault/discovery/vault-edges/`.
- *"Which payment-eligibility filters do we need for the v1 remessa pipeline?"* → **application**. Concerns `docs/features/payment-processing/SPEC.md` and the `_categorical/` artifacts only; no vault node would derive from it. Lands in `docs/features/payment-processing/discovery/<slug>.md`.
- *"Should the knowledge-graph-visualization feature use Cytoscape or D3?"* → **application**. The decision lives or dies with the feature; the vault has no rule that depends on the choice. Lands in `docs/features/knowledge-graph-visualization/discovery/<slug>.md`.

## 2. Signals & heuristics

The strategist examines the user's prompt and any cited paths for these concrete repo signals:

**Knowledge signals (→ vault/discovery/):**
- Mentions a path under `vault/` (`vault/ontology-conventions.md`, `vault/constitution/...`, `vault/premise/...`, `vault/discovery/...`, `vault/templates/...`).
- Uses ontology vocabulary: `node_type`, `layer`, `nature`, `edge`, `frontmatter`, `derives-from`, `codified-as`, `orthogonality`, `epistemic chain`.
- Names an agent/skill protocol artifact: `.claude/agents/...`, `.claude/skills/...`, the lifecycle steps (R3, R5, R6b, R15, R24), `subagents-strategy`, `robot-talks`, `close-session`.
- Frames the question as a *rule*, *schema amendment*, *convention*, or *discipline*.
- Output would be referenced by future dispatches as authoritative — the "law" reading.

**Application signals (→ docs/features/.../discovery/):**
- Mentions a folder under `docs/features/<feature>/` or files like `SPEC.md`, `STORIES.md`, `TASKS.md`, `DECISIONS.md`, `TEST-SPEC.md`, `_categorical/`, `capabilities/`, `domain.md`.
- Mentions `.planning/<workspace>/` (e.g. `.planning/research/curator-pipeline-wiring/`) — that tree is application work-context.
- References a user story, a UAT criterion, a phase plan, an implementation wave, a specific business rule (eligibility filter, payment state, remessa).
- Output's "challenge response" is "update the feature spec," not "amend the constitution."

**Tie-breaker:** if the discovery would *amend a canonical vault file* (per `node_type: discovery` Location note — schema-evolution gate), it is knowledge regardless of where the conversation started. Conversely, if amending the vault is incidental rather than the point, the artifact is application and should `cites` the vault node, not live in it.

## 3. Who decides — hybrid, strategist-proposes / user-confirms-in-step-2

Pick **hybrid, integrated into the existing R6a gate at lifecycle step 2 — not a new gate at step 7.**

Justification: deferring classification to step 7 is too late — by then the strategist has already suggested working folders (R15) and the children have run, so a regime mismatch means rewriting the proposal post-hoc. The signals listed above are visible in the user's opening prompt, so the strategist can classify upfront with the same evidence quality the user has. The user's existing R6a confirmation (which already covers working-folder choice) absorbs the regime call at zero extra friction.

**Concrete rule:**

1. In lifecycle step 1, the strategist's chat proposal MUST declare a **regime line**: `regime: knowledge` or `regime: application`, with a one-sentence justification citing the strongest signal (e.g., *"application — prompt anchors on `docs/features/payment-processing/SPEC.md`, no vault rule is amended"*).
2. The proposal MUST also name the **target discovery path** that step 7 would write to *if* promotion is confirmed — not as a commitment to promote, but so the user sees the regime decision concretely.
3. The user's step-2 confirmation covers regime + path together. Revising the regime is a normal proposal revision, not a separate gate.
4. Step 7 stays a pure yes/no on promotion — it does not re-litigate regime. If the user wants to change regime at step 7, the strategist treats that as a path revision and re-confirms before dispatching `subagents-discovery-writer`.

This keeps R6 a two-gate system (not three), keeps the strategist's classification load-bearing and visible (no silent guessing), and lets the user override cheaply in chat. It also matches the existing pattern in `SKILL.md` lines 86–87, which already has the strategist suggesting candidate paths — the regime is just a label on top of that suggestion.

## 4. Path convention for application regime

**Pick: `docs/features/<feature>/discovery/<slug>.md`.**

Justification grounded in repo evidence:

- `docs/features/` is the established home for per-feature work (`payment-processing/`, `knowledge-graph-visualization/`, `gitops-assessment/`, `domainspec-gsd-integration/`). The frontmatter ontology already reserves `layer: application` for this scope (ontology-conventions.md Appendix B layer table).
- Existing feature folders mix flat artifact files (`SPEC.md`, `STORIES.md`, `DECISIONS.md`) with named sub-folders (`_categorical/`, `capabilities/`). A `discovery/` sibling folder slots in cleanly without colliding with any current name and matches the vault's own `vault/discovery/<topic>-definitions/` precedent (one folder per investigation theme).
- It keeps the discovery in the feature's blast radius: when the feature is archived, refactored, or moved, the discovery moves with it. Vault knowledge-regime discoveries should not be coupled to a feature's lifecycle, and application discoveries should not survive a feature's deletion — the path encodes that lifetime.
- **Rejected alternative** `<working_folder>/discovery/<slug>.md`: `<working_folder>` is already the home for `research/subagents-research.md` + `subagents-findings.md` (R15). Putting the *promoted* discovery in the same tree blurs work-in-progress with promoted artifact — the whole reason R15 keeps research out of vault. Promotion must move the artifact to a stable, feature-anchored home, not leave it in scratch space.
- **Rejected alternative** `.planning/<workspace>/discovery/<slug>.md`: `.planning/` is short-lived workspace state (currently holds `research/curator-pipeline-wiring/`, `edges-hygiene/`); not durable enough for promoted discoveries.

**Example paths** for plausible application discoveries:

- `docs/features/payment-processing/discovery/eligibility-filter-taxonomy.md` — taxonomy of filter classes for the remessa pipeline.
- `docs/features/knowledge-graph-visualization/discovery/cytoscape-vs-d3-tradeoffs.md` — rendering library decision space for the KG visualizer.
- `docs/features/gitops-assessment/discovery/branch-protection-baseline.md` — baseline branch-protection rules to recommend per repo.

**Frontmatter implication:** application-regime discoveries carry `layer: application` (or `domain` if the feature is purely business-logic-scoped) and the same `node_type: discovery` they would in vault. The Location note already added to `node_type: discovery` in `ontology-conventions.md` Appendix B explicitly anticipates this — application-regime discoveries are the case it was carved out for.

**Constitution edits implied (for child C3, not me):** R15 must be widened from "vault is the only promotion target" to "knowledge-regime discoveries promote to `vault/discovery/`; application-regime discoveries promote to `docs/features/<feature>/discovery/`." `subagents-discovery-writer.agent.md` line 22 and 32 (which currently refuse non-`vault/discovery/` targets) must accept the application path pattern under the same R6b confirmation gate.

---

## Agent 2 — ontology-impact: edge catalog, bidirectionality, frontmatter cascade, curator implications

I have all the evidence I need. Returning findings inline per R5.

---

# C2 Findings — Ontology Cost of the Two-Regime Discovery Split

## 1. Edge-catalog audit

**Verdict:** The catalog is **silent on regime, but path-coupled in two specific edges and one structural assumption.** It does not explicitly forbid cross-regime edges, but several clauses assume vault-only endpoints.

**Cited evidence:**

- **`vault/ontology-conventions.md` Appendix C, line 548**: `operationalized-by` is constrained to `target node_type: skill`. Skills already live OUTSIDE `vault/` (under `.claude/skills/`), so the catalog **already permits one cross-tree endpoint** — but as the curator's own context note flags (line 42 of `vault-metadata-curator.agent.md`), "Skill files under `.claude/skills/custom/*.md` are NOT vault documents and currently carry no `node_type`. They cannot legally be edge endpoints under the catalog." This is OQ-1 — same structural shape as the regime question, **unresolved**.
- **`vault/ontology-conventions.md` line 452** (the `discovery` row in Appendix B): the constitution **already explicitly anticipates** dual-location discoveries: *"discoveries may live in `vault/discovery/` (vault-internal — schema, ontology, agents) OR in application/feature folders (work-context — feature design, refactor scoping). A discovery in either location may amend a canonical vault file…"* So the regime split is partially pre-authorized at the `node_type` definition level. But this clause does not propagate down into the edge catalog or frontmatter schema.
- **`edges.md` line 15**: *"If a relationship does not fit any catalog edge, do not invent one — propose it through a discovery in `vault/discovery/`."* Phrasing assumes the catalog-extension venue lives inside `vault/discovery/`. Acceptable — proposing an edge IS a knowledge-regime act.
- **`edges.md` Authoring rules (line 593, ontology-conventions)** "Both sides must declare." — silent on regime; structurally regime-agnostic.

**Edges that legitimately cross the regime boundary (knowledge ↔ application):**

| Edge | Direction | Why it must cross |
|---|---|---|
| `governed-by` / `governs` | application-discovery → vault-constitution | A near-spec discovery is bound by a vault constitution. **Frequent.** |
| `cites` / `cited-by` | application-discovery → vault-anything | Application discoveries cite vault concepts. **Very frequent.** |
| `derives-from` / `derives` | application-discovery → vault-discovery/premise | App discovery builds on a knowledge-regime decision. **Frequent.** |
| `refines` / `refined-by` | application-discovery → vault-discovery | App discovery specializes a knowledge-regime decision. **Possible.** |
| `implements` / `implemented-by` | application-implementation-plan → application-discovery | Both endpoints near-spec — does NOT cross. |
| `codified-as` / `codifies` | (knowledge-regime only) | A vault premise codified as a vault constitution. Should NOT cross. |
| `contradicts` | symmetric | Could legitimately cross (an app discovery contradicting a vault premise should be loud). |

**Judgment (not citation):** The catalog **structurally allows** every cross-regime edge above — none of the catalog rows have a `path-must-be-under-vault/` constraint. The implicit assumption is in the **bidirectionality enforcement** (Section 8) and the **curator** (next sections), not in the edges themselves.

---

## 2. Bidirectionality posture

**Tension:** Section 8 (`vault/ontology-conventions.md` line 290) mandates *"Edges must be declared on both endpoints."* If an application-regime discovery (outside `vault/`) declares `governed-by` → `vault/constitution/X.md`, then **the inverse `governs` row must appear inside the vault file**. This means **vault files acquire references to transient near-spec files** they do not own.

**Three options, with judgment:**

**Option A — Strict bidirectionality (status quo rule).** The vault file gets the inverse row. Cost: vault gets noisy with rows pointing at app-folder paths that may move/disappear; vault discipline ("vault is for codified discipline") is diluted because vault now tracks ephemeral consumers.

**Option B — Asymmetric exception for app→vault edges.** App-regime side declares the forward edge; vault side does NOT mirror it. Cost: breaks the Section 8 "no SQL-layer inference" promise — readers of the vault file no longer see who depends on it locally. Plus: this is exactly the asymmetry Section 8 was created to eliminate.

**Option C — "Reverse index" file inside vault.** Vault concepts get a single `## Inbound from application regime` index file (e.g., `vault/_inbound/<concept>.md`) that lists application-side derivers. The canonical concept file stays clean; the index file holds the inverse rows. Cost: introduces a third file per cross-regime relationship; SQL-layer-style materialization that Section 8 explicitly rejected.

**Cleanest rule (judgment):** **Option A, with one constraint** — vault files only mirror inverses for app-regime edges whose source has `status: consolidated` or higher. Drafts and exploratory app-discoveries do NOT pollute vault files; only stabilized application work earns the mirror row. This preserves the bidirectionality discipline AND the "vault is for codified discipline" stance.

This **introduces a new rule** that Section 8 currently does not have, so it must land in the constitution alongside the regime field.

---

## 3. Frontmatter cascade

**Concrete schema delta:**

### New field: `regime`

```yaml
regime: knowledge | application
```

- **Allowed values:** `knowledge`, `application`. Explicit two-value enum. NOT multi-value (a single document is in exactly one regime — if it would span, it should split).
- **Required for:** `node_type: discovery` only. Absent for all other node types — they are intrinsically knowledge-regime (axiom, premise, constitution) or live in execution territory (implementation-plan, spec) that the regime split doesn't address.
- **Default:** none — explicit declaration required for discoveries. This forces the strategist/author to make the choice consciously rather than inheriting silently from path.
- **Inferable from path?** Yes (vault/ → knowledge, anywhere else → application), but **the field is the source of truth**, not the path. Path is a convention; regime is a claim.

### Files that need updates

1. **`.claude/skills/custom/frontmatter.md`** — add `regime` row to schema block (line 11–24) and a new `### regime` field section. Note required-for-discovery scope.
2. **`.claude/skills/custom/frontmatter-semantics.md`** — add `## regime — Discovery placement regime` section between `nature` and `status`. Define both values.
3. **`vault/ontology-conventions.md`**:
   - Update the schema block (line 53–66) to include `regime`.
   - Update the `discovery` row in Appendix B (line 452) — currently mentions dual-location but no field carrying it; promote that sentence into a field reference.
   - Add a Section between 7 and 8 (or extend Section 2) defining the regime axis.
4. **`.claude/skills/custom/discovery-writing.md`** — line 14–17 currently delegates to `frontmatter.md` for the template; add a quality-gate item to "Quality Checks" (line 73–79): *"`regime` declared (knowledge or application)."*

### Other field interactions

- **`node_type: discovery` does NOT need a regime-dependent variant.** Both regimes produce the same kind of artifact (problem-space + decision); the regime captures placement & ownership, not role. Splitting `node_type` would violate the orthogonality discipline (Section 9) — `regime` and `node_type` carry independent information.
- **`layer` does not subsume `regime`.** A `layer: ontology` discovery is almost certainly knowledge-regime, and a `layer: application` discovery is almost certainly application-regime — but the correlation isn't tight enough to elide the field. Counter-example: a discovery about *how the application's spec format should evolve* is `layer: ontology` but lives near application code (application-regime). The fields stay independent.
- **`tags` are insufficient.** Tags are unenforced free-text per `frontmatter-semantics.md` line 16; regime is a structural field that needs validation.

---

## 4. Curator-mode implications

**Current scope (curator agent line 39):** *"Any markdown file under `vault/`."* Application-regime discoveries live OUTSIDE `vault/`, so they are **invisible to the curator today.**

**Two possible postures:**

**Posture A — Curator scans both regimes.** Extend curator's target set to include configured application-regime roots (`.planning/`, feature folders, near-spec paths). Cost: curator must accept a configurable scan-root list (currently hardcoded `vault/`); audit reports cross-cut both regimes; the report folder `vault/_audits/` becomes a single source of truth for both regimes.

**Posture B — Parallel discipline (separate curator or separate mode).** Knowledge-regime curator stays vault-only. Application-regime curator (or a new mode) operates over near-spec roots with a **looser ruleset** (no required `## Connections` block on transient docs, regime-aware bidirectionality per option C in Section 2). Cost: rule duplication, two agents to maintain.

**Judgment:** Posture A with a regime-aware ruleset is cleaner. The curator already loads canonical skills at runtime — skills can encode regime-conditional rules (e.g., "knowledge-regime discoveries MUST have `## Connections`; application-regime discoveries SHOULD"). One agent, regime-aware behavior.

### Specific changes the curator needs

1. **Target enumeration (line 67):** scan vault/ AND configured application-regime roots. Read regime roots from a config file (e.g., `.claude/curator-config.yml`) — not hardcoded.
2. **Frontmatter validation:** when `node_type: discovery`, require `regime` field. BLOCK if missing.
3. **Bidirectionality check (line 70–72):** when checking inverse-row presence, apply the Section-2 rule above — only require vault-side mirror for `status: consolidated+` application-regime sources. For drafts, downgrade the missing-inverse finding from `WARN` to informational.
4. **Cross-regime edge legality:** add a check that `codified-as`/`codifies` does NOT cross regimes (it stays knowledge-internal). Add as a `BLOCK` in Mode 2.
5. **Mode 3 self-check (line 95):** the regression detector needs to know that a fix on an application-regime file may legitimately add a row to a vault file (the mirror). The existing "edited-file set ∪ endpoint set" logic already covers this — **no structural change needed**, but the self-check report must surface cross-regime edits explicitly (so a human reviewer can confirm the vault wasn't polluted by a transient app-side fix).
6. **Audit report (line 75):** add a new section grouping `## Cross-regime edges` separately from intra-regime, so reviewers can scan the boundary traffic at a glance.

**OQ-1 still blocks cleanly.** Skill-file endpoints (the `operationalized-by` problem) and regime-aware endpoints are structurally similar but **independent**. Resolving regime does not resolve OQ-1; both deserve separate discoveries.

---

**Word count:** ~1180. **Confidence note:** Sections 1 and 3 are mostly citation. Section 2's "Option A with status-gated mirroring" and Section 4's "Posture A with regime-aware ruleset" are judgments — flagged as such inline.

---

## Agent 3 — edit-surface-map: per-file line-level inventory of changes required to land the split

Now I have enough context to compile the surface map. Let me also check ontology-conventions for any additional vault/discovery hardcoding (line 452 already seen).

The map is complete. Compiling the response:

---

# Surface Map: Two-Regime Discovery Split

| file | line range | current text (≤80 chars, `[…]` truncated) | change category | depends on |
|---|---|---|---|---|
| `vault/constitution/subagents-strategy-constitution.md` | 92 | `7. **User gates discovery promotion**; if confirmed, **discovery-writer** […]` | add-regime-branch | C1+C2 |
| `vault/constitution/subagents-strategy-constitution.md` | 112 | `` `subagents-discovery-writer` (optional, user-gated) writes the vault discov[…]`` | add-regime-branch | C1 |
| `vault/constitution/subagents-strategy-constitution.md` | 122 | `(b) Before discovery promotion (lifecycle step 6): user explicitly confirms […]` | add-regime-branch (gate must elicit regime) | C1 |
| `vault/constitution/subagents-strategy-constitution.md` | 210-220 | `### R15 — File locations: working folder, never the vault` (whole rule body) | add-application-path-convention | C2 |
| `vault/constitution/subagents-strategy-constitution.md` | 218 | `**Discovery promotion is the only mechanism by which dispatch outputs reach […]` | replace-vault-hardcode (vault is no longer the only sink) | C1+C2 |
| `vault/constitution/subagents-strategy-constitution.md` | 289 | `` `subagents-discovery-writer` (subagent) │ Path to […] │ Persists a vault disc[…]`vault/discovery/...`[…]`` | replace-vault-hardcode + add-regime-branch | C1+C2 |
| `vault/constitution/subagents-strategy-constitution.md` | 372 | `[…ontology-conventions.md…] currently lists `subagents-strategy` as a `node_type`[…]` | other (ontology drift note may need regime mention) | C2 |
| `vault/constitution/subagents-strategy-constitution.md` | 396-400 | Version History block | other (add v0.1.5 entry for regime split) | C1+C2 |
| `.claude/skills/subagents-strategy/SKILL.md` | 26 | `` - **Suggested working folder(s)** (R15): […] **Never suggest a vault path**[…] `` | add-application-path-convention | C2 |
| `.claude/skills/subagents-strategy/SKILL.md` | 78-89 | `### Step 7 — User-gate discovery promotion (R6b)` (whole step, prompt + path suggestions) | add-regime-branch | C1+C2 |
| `.claude/skills/subagents-strategy/SKILL.md` | 80-83 | `> *"Findings written to […] Promote this to a vault discovery node? […]"*` | add-regime-branch (prompt must ask regime) | C1 |
| `.claude/skills/subagents-strategy/SKILL.md` | 86 | `` - Suggest 1–3 candidate vault paths (typically `vault/discovery/<topic>-defi[…]`) `` | replace-vault-hardcode + add-application-path-convention | C2 |
| `.claude/skills/subagents-strategy/SKILL.md` | 87 | `- After user confirms the target path, dispatch `subagents-discovery-writer`[…]` | add-regime-branch (briefing must include regime) | C1 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 3 | `description: Writes a vault discovery node from a subagents-findings.md […]` | replace-vault-hardcode (description must accept both regimes) | C1+C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 11 | `` Your job: read a `subagents-findings.md` […] write a properly-formed `node_type: discovery` document at that path `` | add-regime-branch | C1+C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 19-23 | Required briefing inputs block (path, vault target path) | add-regime-field (regime input) + replace-vault-hardcode | C1+C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 22 | `` - **User-confirmed vault target path** — typically `vault/discovery/<topic>-defi[…]`. Confirm […] under `vault/discovery/`; refuse if not. `` | replace-vault-hardcode | C1+C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 27 | `` - Existing discoveries under `vault/discovery/` — for connection style […] `` | replace-vault-hardcode (also reference application discoveries) | C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 32 | `` 2. Verify the target path is under `vault/discovery/`. If not, refuse: `Target path must be under vault/discovery/.` `` | replace-vault-hardcode + add-regime-branch (validation per regime) | C1+C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 35 | `` 5. Optionally `Glob` `vault/discovery/**/*.md` to find adjacent discoveries[…] `` | replace-vault-hardcode (glob scope per regime) | C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 37 | `` - **Frontmatter**: `node_type: discovery`, `is_session: false`, appropriate `layer`[…] `` | add-regime-field (must emit `regime`) | C1+C2 |
| `.claude/agents/subagents-discovery-writer.agent.md` | 53 | `If a constraint is violated (no user confirmation, non-vault target, missing[…]` | replace-vault-hardcode (error wording per regime) | C1+C2 |
| `.claude/agents/subagents-findings-writer.agent.md` | (none) | No `vault/discovery/` hardcode; honors R15 working-folder only | other (likely no-op; verify regime is not needed in findings frontmatter) | C2 |
| `.claude/agents/subagents-research-writer.agent.md` | (none) | No `vault/discovery/` hardcode; honors R15 working-folder only | other (likely no-op) | C2 |
| `.claude/skills/custom/frontmatter.md` | 11-24 | YAML schema block (no `regime` field present) | add-regime-field | C2 |
| `.claude/skills/custom/frontmatter.md` | 39 | `` `discovery` │ Exploratory finding — enrich or supersede with a decision `` | add-regime-branch (note regime applies) | C2 |
| `.claude/skills/custom/frontmatter.md` | 26-116 | `## Fields` section (no `regime` subsection) | add-regime-field (new `### regime` subsection) | C2 |
| `.claude/skills/custom/frontmatter-semantics.md` | 23-41 | `## node_type — Document role` table (discovery row at 32) | add-regime-semantics (note discovery has regime) | C2 |
| `.claude/skills/custom/frontmatter-semantics.md` | (end of file, after line 137) | No `## regime` section | add-regime-semantics | C1+C2 |
| `.claude/skills/custom/discovery-writing.md` | 14-16 | `## Frontmatter Template […] Check `.claude/skills/custom/frontmatter.md`[…]` | add-regime-field (mention regime explicitly) | C1+C2 |
| `.claude/skills/custom/discovery-writing.md` | 30-34 | `### Objective (≤3 sentences, required first)` | other (regime may shape Objective phrasing) | C1 |
| `.claude/skills/custom/discovery-writing.md` | 38-46 | `### 1. Business Context` (Why now / What's broken / What stays) | other (application-regime-friendly framing) | C1+C2 |
| `.claude/skills/custom/discovery-writing.md` | 83-88 | `## Navigation` block (constitution + dictionary refs) | other (regime-conditional navigation) | C2 |
| `.claude/skills/custom/edges.md` | 15 | `` If a relationship does not fit any catalog edge, do not invent one — propose it through a discovery in `vault/discovery/`. `` | replace-vault-hardcode (knowledge-regime only) | C2 |
| `.claude/skills/custom/edges.md` | 73, 80, 84, 91, 101, 113, 121 | All example paths use `vault/discovery/vault-edges/...` | other (examples — keep, but note regime in legend) | C2 |
| `.claude/skills/custom/edge-catalog.md` | 20 | `` HALT — pending OQ-1 of `vault/discovery/documents-metadata-enforcement/` `` | other (cross-ref only, not a sink hardcode) | none |
| `.claude/skills/custom/subagents-findings-writing.md` | 99 | `` "Promote agreements §X.Y as a discovery in `vault/discovery/<topic>/`", or `` | replace-vault-hardcode | C1+C2 |
| `vault/ontology-conventions.md` | 56 | `` node_type: axiom │ premise │ constitution │ discovery │[…] `` | add-regime-field (note discovery requires regime) | C2 |
| `vault/ontology-conventions.md` | 61-65 | Required Frontmatter YAML block | add-regime-field | C2 |
| `vault/ontology-conventions.md` | 78-95 | `node_type` challenge-response table (discovery row at 83) | add-regime-branch (split or annotate discovery row) | C1+C2 |
| `vault/ontology-conventions.md` | 452 | `` `discovery` │ Exploratory document […] **Location**: discoveries may live in `vault/discovery/` (vault-internal […]) OR in application/feature folders[…] `` | add-application-path-convention + add-regime-field (formalize the existing prose into a `regime` field) | C1+C2 |
| `vault/ontology-conventions.md` | 459 | `` `research` │ […] See `vault/discovery/vault-foundations/epistemic-chain.md` D-2. `` | other (cross-ref only) | none |
| `vault/ontology-conventions.md` | 460 | `` `subagents-strategy` │ […] See `vault/discovery/subagents-strategy-definitions/[…]` `` | other (cross-ref only) | none |
| `vault/ontology-conventions.md` | 463 | `` `discussion` │ […] See `vault/discovery/robot-talks-definitions/examples/[…]` `` | other (cross-ref only) | none |
| `vault/ontology-conventions.md` | 467-473 | `layer` table (existing `application` value at 473 with "Not yet used" note) | other (regime ≠ layer; clarify they're orthogonal) | C2 |
| `vault/ontology-conventions.md` | 530-571 | Appendix C edge catalog (no regime gating) | add-regime-branch (some edges may be regime-scoped) | C2 |
| `vault/ontology-conventions.md` | 599-611 | Appendix D Quick Reference 7-labels table | add-regime-field (becomes 8 labels OR scoped to discovery) | C2 |
| `vault/ontology-conventions.md` | 605 | `**`node_type`** │ […] (16 values) │` | other (count update if regime impacts) | C2 |
| `vault/templates/subagents-research.md` | 1-12 | Frontmatter | other (no change — research is in working-folder, not regime-scoped) | none |
| `vault/templates/subagents-findings.md` | 1-12 | Frontmatter | other (no change unless findings record target regime per R18) | C1 |
| `vault/templates/subagents-findings.md` | 36-71 | Dispatch record (R18) per-agent table | other (consider adding regime to Dispatch record metadata) | C1 |
| `.claude/agents/vault-metadata-curator.agent.md` | 31 | `` - `.claude/skills/custom/discovery-writing.md` — only when bootstrapping or auditing files under `vault/discovery/`. `` | replace-vault-hardcode (also application discoveries) | C2 |
| `.claude/agents/vault-metadata-curator.agent.md` | 38 | `` - Any markdown file under `vault/` (`vault/discovery/`, `vault/premise/`, `vault/constitution/`, `vault/sessions/`, etc.). `` | replace-vault-hardcode (curator must also see application discoveries OR explicitly scope-out application regime) | C2 |
| `.claude/agents/vault-metadata-curator.agent.md` | 42 | `` flag it and refuse to fix mechanically — it requires resolving OQ-1 in `vault/discovery/documents-metadata-enforcement/`. `` | other (cross-ref only) | none |
| `.claude/agents/vault-metadata-curator.agent.md` | 67-68 | Audit checklist: `Frontmatter`, `Connections block`, `Each edge row` | add-regime-field (audit must check `regime` for `node_type: discovery`) | C2 |
| `.claude/agents/vault-metadata-curator.agent.md` | 73 | `` Write the report to `vault/_audits/<timestamp>-metadata-audit.md` `` | other (audit sink — independent of regime split) | none |
| `.claude/agents/vault-metadata-curator.agent.md` | 116 | `` - You do not create new edge names, new frontmatter fields, or new `node_type` values […] `` | other (regime is a new field — confirm curator MUST NOT auto-add until rolled out) | C2 |
| `.claude/agents/vault-metadata-curator.agent.md` | 123-124 | `<see-also>` block with `vault/discovery/...` references | other (cross-ref only) | none |

## Surface summary

- **Total files touched (canonical, edit required):** 12
  1. `vault/constitution/subagents-strategy-constitution.md`
  2. `.claude/skills/subagents-strategy/SKILL.md`
  3. `.claude/agents/subagents-discovery-writer.agent.md`
  4. `.claude/skills/custom/frontmatter.md`
  5. `.claude/skills/custom/frontmatter-semantics.md`
  6. `.claude/skills/custom/discovery-writing.md`
  7. `.claude/skills/custom/edges.md`
  8. `.claude/skills/custom/subagents-findings-writing.md`
  9. `vault/ontology-conventions.md`
  10. `vault/templates/subagents-findings.md` (only if Dispatch record gains a regime field — C1-dependent)
  11. `.claude/agents/vault-metadata-curator.agent.md`
  12. `vault/templates/subagents-research.md` *(verify-only, likely no edit)*

- **Files confirmed NOT touched:**
  - `.claude/agents/subagents-research-writer.agent.md` — no `vault/discovery/` hardcode; R15 working-folder discipline already regime-agnostic.
  - `.claude/agents/subagents-findings-writer.agent.md` — same.
  - `.claude/skills/custom/edge-catalog.md` — only a cross-ref to a discovery folder (line 20).

- **Total edit sites (rows in table that aren't `other-cross-ref-only`):** ~38 distinct line/range edit sites.

- **`regime` field currently absent from canonical schema** — confirmed: zero hits for the word `regime` as a frontmatter field across `.claude/` and canonical `vault/` files (the few hits found in `vault/discovery/...` are the substring "regime" inside the phrase "falsification regime" — narrative, not schema).

- **Hardcoded `vault/discovery/` references NOT covered by the standard categories — flag for human review:**
  1. `vault/ontology-conventions.md:452` — the `discovery` row already contains a **paragraph-level prose convention** ("discoveries may live in `vault/discovery/` … OR in application/feature folders") that pre-figures the regime split but does not name a field. The implementer must decide whether the new `regime` field **subsumes** this prose (preferred) or **co-exists** with it. C2 must rule.
  2. `.claude/agents/vault-metadata-curator.agent.md:38` — the curator's "targets" enumeration only lists `vault/` paths. After the split, the curator's mode-2/mode-3 walk MUST also reach application-regime discoveries (in feature folders) OR the constitution must explicitly scope the curator to knowledge-regime only. This is a coordination question between C1 (regime classifier) and C2 (curator scope).
  3. `vault/constitution/subagents-strategy-constitution.md:218` — the sentence "**Discovery promotion is the only mechanism by which dispatch outputs reach the vault**" is currently a **non-negotiable principle** by virtue of R15's strength. After the split, "the vault" is no longer the only sink — application-regime promotion writes to a feature folder. This sentence may need rewriting at a level that R15's authority can survive. C1+C2 must coordinate.
  4. `.claude/skills/custom/edges.md:15` — the catalog gate ("propose [a new edge] through a discovery in `vault/discovery/`") implicitly says only knowledge-regime discoveries can amend the edge catalog. If application-regime discoveries also gain that authority, this rule changes shape. C2 must rule.
  5. `vault/ontology-conventions.md:530-571` (Appendix C) — none of the 21 edges currently has a regime gate. C2 must rule whether any edge (e.g. `codified-as`, `operationalized-by`) is regime-scoped.
