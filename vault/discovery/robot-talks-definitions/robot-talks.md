---
tags: [vault, robot-talks, dispatch, discussion, multi-agent]
node_type: discovery
is_session: false
layer: ontology
scope: ontology
domain: dispatch, governance
nature: explanatory
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-02
---

# Discovery — Robot-Talks Definitions

> Consolidates the rules of `robot-talks` mode into the canonical discovery layer of the vault. Robot-talks is a dispatch mode within `domainspec-subagents-strategy` in which N participants (subagents plus the main thread) take turns producing perspectives on a topic, with tensions surfaced explicitly rather than synthesized away. This discovery sits one layer above `vault/premise/robot-talks-premises.md` and is codified by `vault/constitution/robot-talks-constitution.md`.

---

## Objective

**Question answered:** What is `robot-talks` as a first-class concept in the vault, what decisions govern its use, and how does it fit into the epistemic chain (`research → discovery → premise → axiom`) and the dispatch ontology defined by `domainspec-subagents-strategy`?

**Who this is for:** Any contributor (human or agent) who invokes, authors, or audits a robot-talks artifact. It is also the reference point for anyone reading a `node_type: discussion` artifact produced under `mode: robot-talks` and trying to verify that the artifact follows the rules.

**How to read it:** Read the Definitions / Glossary first — every term used downstream is defined there once. Then read Context to understand why this discovery exists. Body sections record the decisions taken and alternatives considered. Open Questions list issues this discovery does not close.

---

## Index

1. [Definitions / Glossary](#definitions--glossary)
2. [Context — Why This Discovery Exists](#context--why-this-discovery-exists)
3. [Robot-Talks as a Dispatch Mode](#robot-talks-as-a-dispatch-mode)
4. [The Robot-Talks Schema Chain](#the-robot-talks-schema-chain)
5. [Decisions Taken](#decisions-taken)
6. [Alternatives Considered](#alternatives-considered)
7. [Open Questions](#open-questions)
8. [Connections](#connections)

---

## Definitions / Glossary

**Robot-talks** — a dispatch mode within `domainspec-subagents-strategy` in which N participants (subagents and/or the main thread) each produce a turn on the same topic, declaring their own perspective. Tensions among turns are surfaced explicitly rather than synthesized away. The output is a multi-perspective discussion log, not an aggregated summary.

**Participant** — an actor that takes a turn in a robot-talks discussion. A participant has a stable id, a role, and a declared perspective. The main thread counts as one participant. Subagents count as additional participants.

**Turn** — one participant's contribution to the discussion. Every turn opens with `### [@participant-id, perspective]` (or equivalent), declares its stance, and cites the sources of every load-bearing claim.

**Perspective** — the declared stance from which a participant speaks (e.g., neutral state-of-play, epistemic-rigor critic, design-owner). The perspective is stated at the top of the turn and binds the rest of that turn's contributions.

**Tension** — a conflict between two findings, between a finding and a documented contract, or between mutual assumptions across layers. Tensions are *found* and surfaced, not constructed by aggregation. (P-RT-3.)

**Synthesis (in robot-talks)** — the act of identifying tensions across turns. Synthesis is *not* aggregation; an aggregated summary without explicit tensions is a summary, not a synthesis. (P-RT-3.)

**Discussion artifact** — a vault document produced by robot-talks dispatch. Its `node_type` is `discussion`. It records turns, tensions raised, and (optionally) resolutions, preserving traceability per P-RT-8.

**Dispatch mode** — a category of `domainspec-subagents-strategy` execution shape. The five operational modes are `single | task-fan-out | robot-talks | sequential | mixed`. Robot-talks is one of these, not a sibling concept of domainspec-subagents-strategy.

**Codified-as / Operationalized-by** — distinct edge types. A premise is `codified-as` a constitution (constitution applies the premise as a rule). A constitution or premise is `operationalized-by` a skill (the executable artifact). Conflating the two is a known schema error in `robot-talks-premises.md` (see OQ-1).

---

## Context — Why This Discovery Exists

### The trigger

Robot-talks has existed in the vault since 2026-04-10 as a premise file (`robot-talks-premises.md`) and a constitution (`robot-talks-constitution.md`), validated by a single proof-of-concept investigation (frontend-backend alignment). It was treated implicitly as a sibling concept to `domainspec-subagents-strategy`. The 2026-05-02 redesign of `domainspec-subagents-strategy` reframed robot-talks as one of five dispatch modes within `domainspec-subagents-strategy` (D-4 of `domainspec-subagents-strategy.md`). That reframing made three things visible:

1. **Robot-talks lacks a discovery layer.** The premise file and constitution exist, but no document above them in the epistemic chain consolidates the decisions about *what robot-talks is* and *how it relates to domainspec-subagents-strategy*. The chain `axiom → premise → constitution → skill` has a hole at the discovery level. → resolved by **D-1, D-4** (this discovery establishes the missing layer; the schema chain is named explicitly).

2. **The premise file's connections table is mislabeled.** Line 202 of `robot-talks-premises.md` lists the constitution under `operationalized-by`. The correct schema separates `codified-as` (premise → constitution) from `operationalized-by` (constitution/premise → skill). The mislabel was already flagged in `domainspec-subagents-strategy.md` D-3 and in Turn 1 §B.3 of `robots-discussing.md`. → tracked as **OQ-1** (recovery sweep pending; this discovery does not modify the premise file).

3. **`node_type: discussion` is the artifact type produced by robot-talks dispatch but was not formally admitted.** The active example artifact, `robots-discussing.md`, ships `node_type: discussion` against an `ontology-conventions.md` enum that has since been amended to admit it. The relationship between dispatch mode and artifact type was implicit. → resolved by **D-5** (discussion artifacts produced by robot-talks declare `node_type: discussion`).

### The recursion `robots-discussing.md` Turn 3.5 surfaced

Turn 3.5 of `robots-discussing.md` raised T7: the robot-talks discussion is bound to `robot-talks-premises.md` (P-RT-3 tension-not-aggregation, P-RT-8 traceability), but that premise file itself contains a known unfixed schema error (OQ-1 above). Therefore the discussion was operating under premises flagged as broken. This is a governance recursion: can a robot-talks discussion ship decisions while its governing premises are flagged broken? This discovery records the question (OQ-2) and recommends a position (yes-with-provisional-note) but does not unilaterally close it.

---

## Robot-Talks as a Dispatch Mode

Robot-talks is one of the five operational dispatch modes admitted in `domainspec-subagents-strategy.md` D-4:

| Mode | Shape | Robot-talks comparison |
|------|-------|------------------------|
| `single` | One subagent, one task | Robot-talks requires N ≥ 2 participants; does not collapse to single. |
| `task-fan-out` | N subagents, N independent tasks | Tasks are independent; robot-talks tasks share a topic and produce comparable perspectives. |
| `robot-talks` | N participants, same topic, declared perspectives, surfaced tensions | This mode. |
| `sequential` | Subagent A's output feeds subagent B | Robot-talks turns are read-after-the-fact, not piped; each turn is independent at production time. |
| `mixed` | Combination of the above within one strategy | Robot-talks may appear inside a mixed strategy. |

The shape distinction is operational: a robot-talks dispatch produces a `node_type: discussion` artifact with explicit turns, declared perspectives, and per-turn citations. A `task-fan-out` dispatch with three subagents writing on the same topic but without declared-perspective discipline is *not* a robot-talks; it is a parallel investigation that may be aggregated.

The defining discipline is P-RT-3 (synthesis is tension discovery, not aggregation): if the output collapses N perspectives into a single consensus summary, the dispatch was either mis-classified as robot-talks, or the synthesis violated the mode's rules.

---

## The Robot-Talks Schema Chain

Robot-talks fits the canonical schema chain `axiom → premise → constitution → skill`:

- **Axiom (upstream):** No standalone robot-talks axiom exists. Robot-talks inherits its foundational commitments from `domainspec-subagents-strategy` (which itself is being graduated) and from the pulsed-orchestration thesis (`tese-orquestracao-por-pulso.md`, `instantiates`).
- **Premise:** `vault/premise/robot-talks-premises.md` (P-RT-1 through P-RT-8). Working bets with explicit `veracidade` and `convicção`. POC-validated 2026-04-10.
- **Constitution:** `vault/constitution/robot-talks-constitution.md` (PM-1 through PM-8 plus R1–R7). Codifies the premises as enforceable rules. Status: active.
- **Skill:** `.claude/skills/robot-talks/SKILL.md` (slash command `/robot-talks`). Operationalizes the constitution.
- **Discovery (this file):** Sits one layer above the premise file. Records `derives-from` to the premise, `codified-as` to the constitution, and `instances` to the example discussion artifact.

The schema chain mirrors `domainspec-subagents-strategy.md` D-2/D-3 (domainspec-subagents-strategy's own chain) and is governed by `scope-and-domain-axes.md` D-14 (discoveries are the only authorized path for schema evolution).

---

## Decisions Taken

### D-1 — Robot-talks is a dispatch mode, not a sibling concept of domainspec-subagents-strategy

**Decision:** Robot-talks is one of five operational dispatch modes within `domainspec-subagents-strategy`. It is not a peer of `domainspec-subagents-strategy`; it is a value of the `mode` field defined there.

**Rationale:** Treating robot-talks as a sibling produced two ontology problems: (a) robot-talks rules duplicated domainspec-subagents-strategy rules about scope, perspective, and traceability; (b) the relationship between robot-talks and other dispatch shapes (task-fan-out, sequential, mixed) was unspecified. Naming robot-talks as a `mode` value resolves both: shared rules live in domainspec-subagents-strategy; mode-specific rules (declared perspective, tension-not-aggregation) live in `robot-talks-premises.md` and the constitution.

**Source:** `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md` D-4 (robot-talks-as-mode); session log of 2026-05-02-1711.

**Consequence:** Any constitution or skill that invokes robot-talks must do so via a domainspec-subagents-strategy that names `mode: robot-talks` in its declaration. Robot-talks-specific premises bind *additionally* to the domainspec-subagents-strategy premises; they do not replace them.

**Status:** Settled.

---

### D-2 — Each turn carries `participant id`, `declared perspective`, and per-claim source citations

**Decision:** Every turn in a robot-talks discussion opens with the participant's id and declared perspective, and every load-bearing claim within the turn is cited to its source as `[file.md:line-range]` or `[file.md §section]`.

**Rationale:** This is the operational form of P-RT-8 (fidelity increases as information rises). Without per-turn perspective declaration, downstream readers cannot distinguish a critic's stance from a state-of-play stance, and the synthesis cannot identify whether two turns disagree because of different evidence or because of different stances. Without per-claim citations, the chain `evidence → finding → tension → recommendation` breaks; the dispatch becomes opinion aggregation.

**Source:** P-RT-8 (`robot-talks-premises.md` lines 181–195); operational form demonstrated in `robots-discussing.md` (every turn opens with `### [@participant-id]` and a `**Perspective**:` line).

**Consequence:** A turn that omits its perspective declaration or that contains uncited load-bearing claims is non-conformant. The reviewer (human gate, R5) may reject the synthesis until the turn is corrected.

**Status:** Settled.

---

### D-3 — Synthesis is tension discovery, not aggregation

**Decision:** The synthesis stage of a robot-talks discussion identifies *conflicts* between turns (or between turns and documented contracts), not summaries of agreement. A synthesis without explicit, evidence-traced tensions is a summary, not a synthesis, and does not satisfy the rules of the mode.

**Rationale:** P-RT-3 is the load-bearing premise of the mode. Combining N perspectives into a consensus output destroys exactly the information robot-talks was designed to surface — the cross-layer contradictions that no single perspective can see (P-RT-1). Permitting aggregation as "synthesis" would collapse robot-talks back into a more expensive variant of `task-fan-out`.

**Source:** P-RT-3 (`robot-talks-premises.md` lines 88–104); R4 of `robot-talks-constitution.md` (synthesis must identify tensions); enforcement example in `robots-discussing.md` Turn 2 ("Tensions raised" subsection T1–T7).

**Consequence:** Every synthesis must produce at least one of: an enumerated tension, a `**RESOLVED**` mark on a prior tension, or a documented "no tensions found" note that justifies the negative finding with evidence. A synthesis that produces only a summary section is rejected at the human gate.

**Status:** Settled.

---

### D-4 — The schema chain for robot-talks is `axiom → premise → constitution → skill`; this discovery sits one layer above the premise file

**Decision:** Robot-talks follows the canonical schema chain. The premise file `vault/premise/robot-talks-premises.md` is below this discovery via a `derives-from` edge (this discovery → premise). The constitution `vault/constitution/robot-talks-constitution.md` is the `codified-as` artifact (premise → constitution). The skill at `.claude/skills/robot-talks/SKILL.md` is the `operationalized-by` artifact (constitution/premise → skill).

**Rationale:** Without an explicit discovery, the chain has a hole between the premises and the upstream framing in `domainspec-subagents-strategy.md` D-4. The schema-evolution rule (`scope-and-domain-axes.md` D-14) requires that schema decisions live in a discovery; admitting `discussion` as a `node_type` value (D-5 below) is a schema decision and therefore needs a discovery to host it. This file is that discovery.

**Source:** `domainspec-subagents-strategy.md` D-2/D-3 (canonical chain shape); `epistemic-chain.md` D-1 (the chain is the spine); `epistemic-chain.md` D-9 (discovery is canonical, sessions are provenance only); `scope-and-domain-axes.md` D-14 (schema-evolution channel).

**Consequence:** The premise file's existing `Connections` table — which currently lists the constitution as `operationalized-by` — must be corrected to `codified-as` (constitution) plus `operationalized-by` (skill). This sweep is OQ-1 below; this discovery does not perform the sweep itself.

**Status:** Settled.

---

### D-5 — Discussion artifacts produced by robot-talks dispatch declare `node_type: discussion`

**Decision:** A vault artifact produced by a robot-talks dispatch — a multi-perspective log with declared turns and surfaced tensions — declares `node_type: discussion`. This is distinct from `node_type: discovery` (consolidates decisions) and `node_type: research` (gathers evidence without committing).

**Rationale:** The challenge response is different: a discussion says "it's multi-perspective debate — close it with a discovery or escalate"; a discovery says "supersede it with a new discovery"; research says "let a discovery consolidate it." Conflating them would corrupt graph queries: asking "what decisions has the team made?" should not return open discussion logs alongside committed discoveries.

**Source:** `ontology-conventions.md` post-amendment §node_type table (`discussion` admitted as a value with the challenge response above); `robots-discussing.md` is the canonical instance (`node_type: discussion`, `mode: robot-talks`).

**Consequence:** Future robot-talks dispatches must produce artifacts with `node_type: discussion`, not `node_type: discovery` or `node_type: research`. A discussion that commits to decisions is closed by writing a separate `node_type: discovery` that consumes the discussion as `derives-from` provenance. The discussion itself stays as the multi-perspective record.

**Status:** Settled.

---

### D-6 — Robot-talks is an auditing tool, not an implementation tool

**Decision:** Robot-talks dispatch is invoked to *understand* (map tensions) a system, not to *fix* one. Implementation actions are out of scope for the dispatch and must be performed in a separate session, downstream of the human gate.

**Rationale:** P-RT-4 (localization precedes reduction). Mixing investigation and implementation in the same dispatch produces partial fixes that miss cross-layer tensions only visible after the full audit completes. The POC explicitly demonstrated this: tensions identified in synthesis (error standardization, idempotency-key, race condition) directly informed implementation, but premature implementation would have addressed only the most visible tension and required a second audit pass.

**Source:** P-RT-4 (`robot-talks-premises.md` lines 107–121); R1 of `robot-talks-constitution.md` (invocation criteria — "audit phase, not implementation").

**Consequence:** A robot-talks dispatch that produces direct code edits or implementation plans within its own turns has overflowed the mode. The orchestrator must explicitly route implementation to a separate dispatch (typically `mode: single` or `mode: sequential`) governed by its own domainspec-subagents-strategy.

**Status:** Settled.

---

### D-7 — Bounded scope is a precondition; concerns must not overlap, evidence may

**Decision:** Every robot-talks participant must have an explicitly stated scope and an explicit exclusion list. No two participants may investigate the same *concern* (question), but two participants *may* read the same *evidence* (file or contract) from different concerns.

**Rationale:** P-RT-6 + P-RT-7 together. Unbounded participant scopes produce unfocused exploration; concern overlap produces synthesis ambiguity (cannot tell whether two turns disagree about the same question or are answering different questions). Evidence overlap is necessary because tension discovery often requires two perspectives reading the same artifact differently.

**Source:** P-RT-6 (`robot-talks-premises.md` lines 147–161), P-RT-7 (`robot-talks-premises.md` lines 164–178); R2 of `robot-talks-constitution.md` (scope decomposition heuristic — "decompose along concerns, not files").

**Consequence:** The orchestrator must produce, before any participant starts, a scope table listing for each participant: concern, central question, out-of-scope. The "concern overlap test" from R2 applies: if two participants could produce contradictory answers to the *same* question, scopes overlap and must be redefined.

**Status:** Settled.

---

## Alternatives Considered

### A-1 — Treat robot-talks as a sibling concept of domainspec-subagents-strategy

**Alternative:** Keep robot-talks as a peer-level concept with its own axiom-premise-constitution-skill chain, independent of domainspec-subagents-strategy.

**Rejection reason:** Produces rule duplication. Subagents-strategy already governs scope-decomposition, capability-tier, and dispatch lifecycle; robot-talks would either re-state those rules (duplication, drift risk) or remain silent (under-specification). Treating it as a `mode` value within domainspec-subagents-strategy resolves the relationship cleanly: shared rules live upstream; mode-specific rules (declared perspective, tension-not-aggregation, evidence vs concern overlap) live in the robot-talks premise/constitution. See `domainspec-subagents-strategy.md` D-4.

---

### A-2 — Make robot-talks artifacts `node_type: discovery`

**Alternative:** Use `node_type: discovery` for the discussion log, treating each robot-talks dispatch as producing a discovery directly.

**Rejection reason:** Conflates exploration with consolidation. A discovery is a *committal* document — it locks in decisions. A robot-talks discussion is by construction multi-perspective and uncommitted: turns disagree, tensions are surfaced rather than resolved, and the human gate may close the discussion without converging on a single decision. Forcing the discussion into `discovery` would either pollute graph queries for committed decisions (every uncommitted log appears as a decision) or force premature synthesis to fit the committal shape (violating P-RT-3). The cleaner path is `node_type: discussion` for the log, with a downstream `discovery` consuming it as provenance when the user closes out the open questions. (D-5.)

---

### A-3 — Allow robot-talks synthesis to aggregate when no tensions are found

**Alternative:** Permit aggregated summaries as valid robot-talks synthesis when tension discovery yields zero tensions.

**Rejection reason:** Creates a loophole that collapses the mode. If "no tensions found" is an acceptable terminal state, the synthesizer is incentivized to declare zero tensions in any borderline case, since declaring tensions invites scrutiny while declaring none closes the dispatch quickly. P-RT-3 is the load-bearing rule of the mode; it must hold even when negative. The constitution's R4 enforces this by requiring synthesis to *identify tensions* explicitly; "no tensions found" is admissible only as a deliberately documented finding with evidence justifying the negative result.

---

### A-4 — Declare perspective once at file level rather than per turn

**Alternative:** Have each participant declare their perspective once in the file's frontmatter or top metadata, rather than at the start of each turn.

**Rejection reason:** Misses the case where one participant takes multiple turns from different stances (e.g., the main thread might author Turn 3 as design-owner and Turn 3.5 as design-owner-with-new-context). Per-turn declaration also makes the citation chain self-witnessing: a reader of any single turn can verify the stance without scrolling to a top-of-file declaration. The cost (one extra header line per turn) is negligible. (D-2.)

---

## Open Questions

### OQ-1 — Schema errors in `robot-talks-premises.md` await a recovery sweep

**Question:** The `Connections` table in `vault/premise/robot-talks-premises.md` has two known schema errors:
- **Line 202**: lists the constitution under `operationalized-by`. Per D-4 of this discovery, the correct edge is `codified-as` for the constitution and `operationalized-by` should be reserved for the skill.
- **Line 26**: contains a broken path reference `specs/ontology/possible_constitutions/...` pointing to a robot-talks-discovery file that no longer exists at that location (or never existed there).

**Why it matters:** D-2 (per-claim citations) and D-4 (schema chain) both depend on the premise file's connections table being correct. As long as the table is mislabeled, downstream artifacts citing the chain inherit the mislabel, and the precedent erodes the `codified-as` / `operationalized-by` distinction across the vault.

**Why this discovery does not fix it:** The dispatch that authored this discovery is scoped to *defining* robot-talks at the discovery layer, not to performing recovery edits on the premise file. Modifying the premise file is a separate dispatch. Per D-9 of `epistemic-chain.md` (discovery is canonical), this discovery's text is the new source of truth for the relationship; the premise file's correction is downstream cleanup.

**Status:** Open. Recovery sweep pending.

---

### OQ-2 — Can a robot-talks discussion ship decisions while its governing premises are flagged broken?

**Question:** Turn 3.5 of `robots-discussing.md` (T7) raised this: the discussion was operating under `robot-talks-premises.md`, but that premise file itself contained a known unfixed schema error (OQ-1 above). If the user rules that decisions in a robot-talks discussion ship to disk only when the governing premises were clean at the time of the discussion, the entire `robots-discussing.md` log is provisional. If the user rules the opposite, the corpus has just established the precedent that decisions can be made under flawed governance and back-applied later.

**Why it matters:** This is the governance-recursion rule. Without an explicit answer, every future robot-talks dispatch reproduces the question whenever its governing premises have a known but unfixed defect. The rule is upstream of the dispatch; the dispatch cannot answer it.

**Recommended position:** Yes, with an explicit provisional-note. A robot-talks discussion may ship decisions even when its governing premises are flagged broken, on the condition that the resulting decision document declares "governance was provisional at the time of decision" with a citation to the open premise issue. Otherwise the recursion never bottoms out — every premise has at least some open question, and a strict-clean-governance rule would block all dispatches indefinitely.

**Source:** `robots-discussing.md` Turn 3.5 §T7.

**Status:** Open. Recommendation pending user ratification.

---

### OQ-3 — Heartbeat / partial-synthesis enforcement

**Question:** R7 of `robot-talks-constitution.md` and the Timeline Guidance section specify a 30-minute heartbeat: if no participant completes within 30 minutes, force synthesis with partial findings tagged `partial_synthesis`. But there is no mechanism that detects the timeout and triggers the forced synthesis — it is currently a discipline applied by the orchestrator, not a rule enforced by the harness.

**Why it matters:** Without enforcement, a hung subagent stalls the entire dispatch indefinitely. The 30-minute number is also untested; the POC's parallel exploration phase ran 15–20 minutes per participant, well under the threshold.

**Status:** Open. Mechanism deferred until a harness-level dispatch monitor lands.

---

### OQ-4 — Cross-cutting: does robot-talks bind to its governing constitution at strategy-declaration time or at dispatch time?

**Question:** A domainspec-subagents-strategy that declares `mode: robot-talks` binds to `robot-talks-premises.md` and `robot-talks-constitution.md` (per `domainspec-subagents-strategy.md` D-4). But which version? The version current at strategy-authoring time, or the version current at dispatch time? If the constitution is amended between strategy authoring and dispatch execution, do older strategies inherit the amendment?

**Why it matters:** Affects the behavior of long-lived strategies and the auditability of executed dispatches. Without a rule, audit findings against an executed dispatch can be deflected ("but the constitution at the time was different").

**Status:** Open.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [vault/premise/robot-talks-premises.md](../../premise/robot-talks-premises.md) | `derives-from` | The 8 working premises (P-RT-1 through P-RT-8) that this discovery consolidates and explains. Premise file has known schema errors tracked as OQ-1; this discovery does not modify it. |
| [vault/constitution/robot-talks-constitution.md](../../constitution/robot-talks-constitution.md) | `codified-as` | The enforceable rule set (PM-1 through PM-8 plus R1–R7) that codifies the premises into operational discipline. |
| [.claude/skills/robot-talks/SKILL.md](../../../.claude/skills/robot-talks/SKILL.md) | `operationalized-by` | The slash-command skill `/robot-talks` that operationalizes the constitution. |
| [examples/robots-discussing.md](examples/robots-discussing.md) | `instances` | Canonical example artifact produced by robot-talks dispatch. Turn 3.5 surfaced T7 (the governance recursion captured here as OQ-2). |
| [vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md](../domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md) | `cites` | D-4 (robot-talks-as-mode) is the upstream framing this discovery extends. Robot-talks is a mode-of domainspec-subagents-strategy, not a sibling. |
| [vault/discovery/domainspec-vault-foundations/epistemic-chain.md](../domainspec-vault-foundations/epistemic-chain.md) | `cites` | D-9 (discovery is canonical, sessions are provenance only) is the precedence rule this discovery relies on when its text disagrees with the premise file or with session logs. |
| [vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md](../domainspec-vault-foundations/scope-and-domain-axes.md) | `governed-by` | D-14 (discoveries are the only authorized path for schema evolution) is the governance gate under which this discovery's D-5 (admit `node_type: discussion` for robot-talks artifacts) is admissible. |
| [vault/discovery/domainspec-vault-foundations/business-philosopher/.../tese-orquestracao-por-pulso.md](../domainspec-vault-foundations/) | `instantiates` | The pulsed-orchestration thesis that robot-talks operationalizes for investigation (P-RT-5). |
| [vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md](../domainspec-vault-edges/research/domainspec-subagents-strategy.md) | `cited-by` | The vault-edges domainspec-subagents-strategy research cites this discovery as a recent example of vault-edge usage in a `Connections` section (E1 sample source). |
