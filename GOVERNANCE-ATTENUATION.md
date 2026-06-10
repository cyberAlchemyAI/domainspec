# Governance Attenuation in Recursive Meta-Systems

> Why adding more governance layers reduces the fidelity of existing layers — and what to do instead.

---

## The Problem

DomainSpec operates as a 7-layer recursive reinforcement system (L0–L7 across business and operational tracks). Each layer governs the layer below it, and the tuning loop (signals → reflection → improvement) creates a cross-cutting feedback mechanism.

The core tension: **as governance layers accumulate, each individual layer's enforcement fidelity decreases**. The system reaches a point where adding layer N+1 does not add value because the enforcement interface — the LLM's instruction-following capacity — is saturated.

Empirical evidence: 23 signals across ~10 sessions, from a project with 40+ commits. Signal emission rate is approximately 30–40% of expected. Governance observations are being systematically dropped.

---

## The 7 Layers and Their Enforcement Reality

DomainSpec's dual meta-models (business + operational) define these layers:

| Layer                   | What It Governs                            | Enforcement Mechanism       | Fidelity                |
| ----------------------- | ------------------------------------------ | --------------------------- | ----------------------- |
| **L0 — Domain Reality** | The actual business                        | None (territory, not map)   | N/A                     |
| **L1 — Ontology**       | 25 types, 29 edges, SPEC.md                | Manual + template structure | Medium                  |
| **L2 — Software**       | Generated code                             | Tests derived from specs    | High                    |
| **L3 — Governance**     | Rules in ARCHITECTURE.md, TAXONOMY.md      | Agent instructions (prose)  | Low                     |
| **L4 — Epistemic**      | Axioms ("docs before code")                | **Not formalized**          | None                    |
| **L5 — Navigation**     | File-based grep, context heuristics        | Pattern matching            | Fragile                 |
| **L6 — Enforcement**    | Alignment/layering audits, PASS/FLAG/BLOCK | **Manual trigger only**     | Medium (when triggered) |
| **L7 — Orchestration**  | 14 agents, 25+ skills, pipeline            | Skill instructions (prose)  | Variable                |

The signal system (TUNING-LOOP.md) adds a cross-cutting observation layer alongside L6–L7, but it is an _observation instrument_ for the meta-system, not a governance layer itself.

---

## Three Root Causes of Signal Loss

### 1. The Epilogue Problem (Context Exhaustion)

Signal emission is Step 10 — the last action in the pipeline. By the time an LLM reaches the end of a complex session, its effective attention over early-session events has degraded significantly.

This maps to the **serial position effect** (Murdock, 1962): items in the middle of a long context are recalled worst. Signals are observations _about_ the journey, but the observer reconstructs that journey at the point of maximum cognitive fatigue.

Kahneman's **peak-end rule** compounds this: the LLM remembers peak difficulty and final steps, but forgets routine governance violations from step 3.

### 2. The Observer-Executor Conflation

The same agent that _does_ the work is asked to _observe_ itself doing the work. This violates a foundational principle from cybernetics.

**Conant-Ashby's Good Regulator Theorem** (1970): every good regulator of a system must be a model of that system. The executor _is_ the system — it cannot simultaneously be its own model with high fidelity.

In control theory terms: asking a PID controller to also be its own oscilloscope. It works partially, but it cannot detect its own blind spots. The `governance-gap` signal type is the most important one, and by definition, the agent cannot reliably identify what it didn't know it should have caught.

### 3. The Instruction Dilution Problem (Channel Capacity)

Agents receive instructions from 5+ sources simultaneously: agent `.md`, skill `.md`, `instructions.md`, `copilot-instructions.md`, and the emit-signals epilogue. Each source competes for attention in a fixed-capacity channel.

**Shannon's noisy channel theorem** applies: as governance layers increase, each individual instruction's effective signal-to-noise ratio decreases. The channel capacity of the instruction-following interface is finite, and governance instructions have already saturated it.

---

## Theoretical Limits: Why 7 Layers May Be Fundamental

### Miller's Law (1956)

The number of objects an average human can hold in working memory is 7 ± 2. This is not about humans specifically — it describes information processing in bounded-capacity systems. LLMs exhibit analogous capacity limits. Seven governance dimensions may already be at the cognitive boundary of what a single-session agent can maintain.

### Ashby's Law of Requisite Variety (1956)

A controller must have at least as much variety (possible states) as the system it controls. Governance layers (L3–L7) must collectively model the variety of L0–L2. But each governance layer also _adds_ variety to the total system, requiring governance of the governance — the recursive trap.

For a system with ~25 concept types and ~29 edge types:

$$\log_2(54) \approx 6$$

Six governance dimensions are theoretically sufficient. At 7, returns are already diminishing.

### Gödel's Incompleteness (applied informally)

No sufficiently complex formal system can prove all true statements about itself. The meta-system cannot fully observe itself. There will always be governance gaps that the system is structurally incapable of detecting from within. This is not a bug — it is a theorem.

### Meadows' Leverage Points (1999)

In system dynamics, the highest-leverage interventions are changes to the _paradigm_ and _goals_ of a system, not additions to its rules. Adding more enforcement layers (L6 work) is a low-leverage intervention. Changing the _structure_ of observation is high-leverage.

---

## Structural Interventions

Instead of adding layer 8, these change the _geometry_ of the existing layers.

### 1. Split Observer from Executor (Dual-Agent Protocol)

**References:** Mixture of Experts (Shazeer et al., 2017), Constitutional AI (Bai et al., 2022)

Instead of asking one agent to both execute and observe, run a lightweight _shadow agent_ that receives the same context but has a single responsibility: emit signals.

The executor produces artifacts. The observer reads the session's output and produces only signals. This mirrors Constitutional AI's approach where one model generates and another evaluates.

**Implementation:**

After any `domainspec-implement` or `domainspec-spec-writer` session, dispatch a read-only `domainspec-signal-observer` agent that:

1. Reads the session's git diff
2. Reads the feature's SPEC.md
3. Reads SIGNAL-SCHEMA.md
4. Produces signals with _zero other responsibilities_

This eliminates causes #1 (context exhaustion) and #2 (observer-executor conflation). The observer has full attention budget for observation.

```
┌──────────────────────────────────────────────┐
│             SESSION (executor)               │
│  plan → spec → stories → tests → implement  │
│                                    │         │
│                              git commit      │
└──────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────┐
│          POST-SESSION (observer)             │
│  read diff + read SPEC + read SCHEMA         │
│  → emit signals (single responsibility)      │
│  → append to pipeline-signals.jsonl          │
└──────────────────────────────────────────────┘
```

### 2. Structural Signal Detection (Computation + Session Telemetry)

**References:** Static analysis, Domain-Code-Mapping orphan detection (Boscaro, 2026)

The largest signal types — `alignment-gap`, `spec-gap`, `governance-gap` — can be partially _computed_ instead of relying on LLM self-report. Deterministic detectors shift detection from L7 (unreliable LLM observation) to L6 (deterministic enforcement).

But not all signals are artifact-only. Some high-value observations are session-behavior signals (for example: the agent added or corrected tests without explicit user request). Those cannot be recovered reliably from final state alone and require explicit session observation.

So the target is a **hybrid detector**:

- Artifact-level gaps -> deterministic computation
- Behavior-level events -> observer pass over session telemetry

| Signal           | Computable Proxy                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `alignment-gap`  | Diff SPEC concept table rows vs. `export` symbols in feature's `domain/` directory. Missing export = gap.                 |
| `spec-gap`       | Count `TODO` / `FIXME` / assumption comments in generated code. Each one = a `spec-gap` signal.                           |
| `governance-gap` | Check that the session's git diff only touches files in the feature's directory. Cross-feature writes = `governance-gap`. |
| `rework`         | Count git commits that modify the same file more than once per session (overwrite pattern).                               |

| Session-Behavior Signal        | Telemetry Proxy (Observer Required)                                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rework` (execution-level)     | Detect fail->fix->retest loops in the same session from command/test output chronology, not just end-state git diff.                                                               |
| `decision` / `pattern`         | Detect unrequested test hardening (tests added or corrected outside explicit prompt scope), then classify as positive `pattern` or scope `governance-gap` based on project policy. |
| `governance-gap` (scope drift) | Compare touched file classes vs. requested scope classes from plan/prompt (for example, tests changed during docs-only scope).                                                     |

This approach moves from "asking the agent to notice" to "measuring the agent's output and behavior trace."

In practice, the observer should read a compact session telemetry bundle:

1. Ordered tool/command events
2. Incremental git diff snapshots per step
3. Test command outputs with timestamps

Without this telemetry channel, behavior-only signals are systematically undercounted.

The `@biz`/`@sys` annotations from Domain-Code-Mapping are exactly this for the ontology layer — making L1↔L2 binding _computable_ instead of _observable_. G11 (Code-to-Spec binding) should be pursued aggressively as it structurally eliminates an entire class of undetected signals.

### 3. The Logarithmic Governance Principle (Collapse Redundant Layers)

**References:** Information theory (redundancy reduction), Taleb's Via Negativa

Governance is currently spread across 6 separate documents: TAXONOMY.md, ARCHITECTURE.md, skill instructions, agent instructions, copilot-instructions.md, and the emit-signals instruction. All compete for instruction-following bandwidth.

Apply Via Negativa: _remove_ governance artifacts that haven't prevented a real incident. Track which governance rules have actually caught something via the existing `governance-gap.shouldHaveBeenCaughtBy` field. Any governance rule that has never been the `shouldHaveBeenCaughtBy` target after N pipeline runs is a candidate for removal — it is consuming channel capacity without proving value.

**Governance Pruning Protocol:**

1. After every 10 pipeline runs, list all governance rules across all instruction sources
2. Cross-reference with `shouldHaveBeenCaughtBy` signal data
3. Rules with zero references after 10 runs: mark as candidate for removal
4. Rules with zero references after 20 runs: remove unless they protect against catastrophic (irreversible) outcomes
5. Track channel capacity recovery: does removing low-value rules improve emission rate of remaining signals?

---

## Viable System Model Mapping

What DomainSpec has become is not a pipeline — it is a **viable system** in Stafford Beer's sense (Viable System Model, 1972). Beer identified exactly 5 necessary and sufficient systems for organizational viability:

| Beer's System               | Function                   | DomainSpec Equivalent                            | Status                             |
| --------------------------- | -------------------------- | ------------------------------------------------ | ---------------------------------- |
| **System 1** — Operations   | Do the work                | L2 (code) + L7 agents executing                  | Working                            |
| **System 2** — Coordination | Prevent oscillation        | Pipeline sequencing, skill dependencies          | Working                            |
| **System 3** — Control      | Resource allocation, audit | Alignment audits, test verdicts, PASS/FLAG/BLOCK | Partially working (manual trigger) |
| **System 4** — Intelligence | Adaptation to environment  | Signal accumulation + reflect skill              | Built, under-performing            |
| **System 5** — Policy       | Identity, purpose, axioms  | CONSTITUTION.md, AXIOMS.md                       | **Missing**                        |

Beer proved that exactly these 5 systems are needed — no more, no fewer. The 7 DomainSpec layers map onto Beer's 5 when redundant layers are collapsed. The missing piece is not layer 8. It is that:

- **System 3 (Control) runs on manual trigger instead of continuously** — L6 enforcement requires explicit agent invocation rather than pre-commit hooks or CI gates.
- **System 5 (Policy) does not exist yet** — CONSTITUTION.md and AXIOMS.md from the roadmap (G13, G14) are the formal policy layer that all governance rules should derive from.

The fix is not more layers. It is making L6 continuous and formalizing L4. Then the signals currently missed by LLM self-observation will be caught by structural enforcement.

---

## The Channel Capacity Equation

The theoretical ceiling is not about the number of layers. It is about channel capacity of the enforcement interface.

Every governance rule competes for the same finite attention budget:

$$C = B \cdot \log_2\left(1 + \frac{S}{N}\right)$$

Where:

- $C$ = effective governance capacity (rules reliably followed per session)
- $B$ = bandwidth (context window attention available for instructions)
- $S$ = signal strength (clarity and specificity of each rule)
- $N$ = noise (competing instructions, ambiguity, context length)

Adding governance layers increases $N$ faster than it increases $S$. The winning strategy is **fewer, sharper rules enforced structurally** — not more rules enforced by instruction.

---

## Priority Actions

| #   | Action                                                              | Eliminates                | Effort |
| --- | ------------------------------------------------------------------- | ------------------------- | ------ |
| 1   | Build `domainspec-signal-observer` agent (post-session, read-only)  | Causes #1, #2             | Medium |
| 2   | Add deterministic signal detectors to CI (diff-based gap detection) | Cause #3 partially        | Medium |
| 3   | Implement `@biz`/`@sys` code annotations (G11)                      | Structural alignment gaps | High   |
| 4   | Create CONSTITUTION.md (G13) — collapse scattered governance        | Instruction dilution      | Low    |
| 5   | Add pre-commit enforcement hooks (shift L6 left)                    | Manual trigger dependency | Medium |
| 6   | Run governance pruning protocol after 20 pipeline runs              | Channel capacity waste    | Low    |

---

## References

| Reference                                                                                                                                                    | Connection                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Beer, S. (1972). _Brain of the Firm_. Allen Lane.                                                                                                            | Viable System Model — the 5-system architecture DomainSpec is converging toward              |
| Conant, R. & Ashby, W.R. (1970). "Every Good Regulator of a System Must Be a Model of That System." _International Journal of Systems Science_, 1(2), 89–97. | Why the executor cannot observe itself — theoretical impossibility                           |
| Ashby, W.R. (1956). _An Introduction to Cybernetics_. Chapman & Hall.                                                                                        | Law of Requisite Variety — governance complexity must match but not exceed system complexity |
| Meadows, D. (1999). "Leverage Points: Places to Intervene in a System." _Sustainability Institute_.                                                          | Why changing observation structure > adding rules                                            |
| Bai, Y. et al. (2022). "Constitutional AI: Harmlessness from AI Feedback." Anthropic. arXiv:2212.08073.                                                      | Dual-model evaluation pattern — separate observer from executor                              |
| Shazeer, N. et al. (2017). "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer." arXiv:1701.06538.                              | Sparse expert routing — not all governance needs to activate on every session                |
| Kahneman, D. (2011). _Thinking, Fast and Slow_. Farrar, Straus and Giroux.                                                                                   | Peak-end rule — why epilogue-based signals miss mid-session observations                     |
| Shannon, C.E. (1948). "A Mathematical Theory of Communication." _Bell System Technical Journal_, 27(3), 379–423.                                             | Channel capacity limits on instruction-following bandwidth                                   |
| Taleb, N.N. (2012). _Antifragile: Things That Gain from Disorder_. Random House.                                                                             | Via Negativa — remove governance that hasn't proven necessary                                |
| Hofstadter, D. (1979). _Gödel, Escher, Bach: An Eternal Golden Braid_. Basic Books.                                                                          | Self-referential systems cannot fully model themselves                                       |
| Murdock, B.B. (1962). "The Serial Position Effect of Free Recall." _Journal of Experimental Psychology_, 64(5), 482–488.                                     | Serial position effect — middle-of-context items recalled worst                              |
| Miller, G.A. (1956). "The Magical Number Seven, Plus or Minus Two." _Psychological Review_, 63(2), 81–97.                                                    | Bounded capacity of information processing systems                                           |
| Boscaro, V. (2026). _Domain-Code-Mapping_. GitHub.                                                                                                           | `@biz`/`@sys` annotations making ontology↔code binding computable                            |
| West, C. (2025). "The Agentic Manifesto: Engineering in the Era of Autonomy."                                                                                | ADLC — continuous tuning as the value engine, not a cost center                              |

---

## Relationship to Existing Roadmap

This analysis reinforces and resequences items from ADLC-ALIGNMENT.md:

| Gap                                  | Original Priority | Revised Priority  | Rationale                                                                |
| ------------------------------------ | ----------------- | ----------------- | ------------------------------------------------------------------------ |
| G13 — Formal CONSTITUTION.md         | v1.8              | **Immediate**     | Collapses scattered governance → frees channel capacity                  |
| G11 — Code-to-Spec `@biz` binding    | v1.9              | **High**          | Structural signal detection > LLM observation                            |
| G4 — Automated governance (CI gates) | v1.8              | **High**          | Shift L6 from manual to continuous                                       |
| G14 — AXIOMS.md                      | v1.8              | Medium            | Beer's System 5, but Via Negativa applies — formalize only proven axioms |
| G3 — Multi-agent behavioral tracing  | v2.0              | **De-prioritize** | Adds variety without proven enforcement value yet                        |
| G15 — Meta-system health dashboard   | v1.9              | Medium            | Useful but secondary to structural fixes                                 |

The central insight: the path to better signal capture is not more observation layers — it is making existing observations structural and automatic, while pruning governance instructions that saturate the LLM's finite attention capacity.
