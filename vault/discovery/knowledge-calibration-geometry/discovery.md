---
tags: [domainspec, knowledge, calibration, alignment, drift, fidelity, gamification]
node_type: discovery
is_session: false
layer: domain, application
nature: explanatory, reference
status: draft
veracidade: medium
convicção: high
version: 0.4.0
last_updated: 2026-05-25
---

# Knowledge Calibration Geometry

> Working hypothesis: DomainSpec can be reframed as a knowledge-calibration system, not only a place where a domain is documented, but a surface that may eventually measure structural consistency inside and between the three highest-value knowledge categories we currently care about — **knowledge in people's heads, formalized knowledge, and executable system behavior**.

---

## Objective

Write down the first product-level framing for DomainSpec as a system that may measure knowledge fidelity, drift, and alignment across people, documentation, and code. The end state is not a theorem and not yet a spec; it is a durable discovery that names the current hypotheses, the primary categories, the two evidence channels for `C_head`, the two game loops, the core distance types, and the open questions that must be answered before this can harden into a metric system or feature surface.

This discovery is intentionally pre-implementation. Its next legitimate output is a product-facing spec seed or a small experiment design, not a production metric.

It also carries an explicit anti-dashboard constraint: no metric or visualization should graduate from research into product unless it shortens the path from "there is a divergence" to "we know what to do next."

---

## Context

The earlier DomainSpec framing already treats translation as the load-bearing operation: intent becomes formalization, formalization becomes implementation, implementation becomes runtime behavior, and every step can accumulate residue or drift. What changed in this discussion is the decision to treat **people** as first-class knowledge carriers inside the same picture rather than as external operators standing outside it.

That produces a stronger product frame. Instead of asking only whether documentation drifts from code, or whether the system stays aligned with its formal model, we can ask whether multiple knowledge-carrying categories remain structurally coherent:

- what a person knows about a domain,
- what the organization has formalized about that domain,
- what the executable system actually does.

This reframes DomainSpec as a knowledge-calibration surface rather than a static documentation framework. The product no longer just stores definitions. It actively measures where understanding is internally coherent, where translations between categories are faithful, and where residue accumulates.

The conversation also converged on a game-shaped operational loop. If we want to observe the knowledge in `head`, we need interaction. Some of that evidence can be collected directly through explicit elicitation, and some of it must be inferred from behavior over time. The proposed mechanism starts with bidirectional question-play:

- `system -> person` questions to probe what the person can reconstruct, distinguish, justify, and transfer;
- `person -> system` questions to probe what the formalized/documented/systemized domain can answer, justify, and recover.

This turns gamification from decoration into instrumentation. The game is not a UX layer on top of the model; it is the mechanism by which the model becomes observable.

The psychometric pressure on this framing is important but should remain early-stage. DomainSpec should not claim that it "measures knowledge" in a global sense. It should start by saying which observable responses, actions, confidence signals, and revisions count as evidence for which limited claims about a person's relation to the reference surface.

---

## Hypothesis

Current hypothesis: DomainSpec should model at least three primary knowledge categories — `head`, `spec`, and `system` — and try to measure both **intra-category consistency** and **inter-category consistency** between them. If this holds, the product's core value is the geometry of those distances: person-to-system-reference, person-to-person, and organization-level alignment/drift.

---

## Adjacent Literature Pressure

This section does **not** claim external validation of the framing. It records literature clusters that appear adjacent enough to pressure-test the current hypotheses and reduce the risk of rediscovering existing language under new names.

### L-1. Shared mental models and alignment

**Pressure on the discovery.** The idea that people and teams can be measured by overlap, alignment, and divergence of internal task models is not new. The relevant question is not whether alignment exists as a construct, but whether DomainSpec's proposed geometry across `head`, `spec`, and `system` adds a distinct operational frame.

Useful neighboring references:

- Mohammed, Ferzandi, Hamilton (2010), *Metaphor No More: A 15-Year Review of the Team Mental Model Construct*.
- Langan-Fox, Code, Langfield-Smith (2000), *Team Mental Models: Techniques, Methods, and Analytic Approaches*.
- Wildman et al. (2022), *The role of shared mental models in human-AI teams: a theoretical review* — especially relevant to the `person -> system` and human-AI collaboration side of the frame. <https://www.tandfonline.com/doi/full/10.1080/1463922X.2022.2061080>

**Current hypothesis after reading the neighborhood.** Shared-mental-model literature likely covers part of the `head <-> head` and `head <-> AI/system` alignment problem, but does not by itself give the three-category geometry proposed here.

### L-2. Requirements elicitation and tacit-to-formal capture

**Pressure on the discovery.** The hypothesis that "rule formation during user-LLM interaction may deserve its own pipeline" enters terrain already studied by requirements-elicitation and tacit-knowledge capture literature. The question is whether DomainSpec's event framing adds anything beyond ordinary elicitation.

Useful neighboring references:

- Méndez et al. (2020), *Data-Driven Requirements Elicitation: A Systematic Literature Review*. <https://link.springer.com/article/10.1007/s42979-020-00416-4>
- Méndez et al. (2025), *What Is the Process? A Metamodel of the Requirements Elicitation Process Derived from a Systematic Literature Review*. <https://www.mdpi.com/2227-9717/13/1/20/html>
- Reviews of tacit knowledge elicitation emphasizing ambiguity, stakeholder divergence, and hybrid elicitation techniques. <https://periodicos.ufsc.br/index.php/ijkem/article/view/83301>

**Current hypothesis after reading the neighborhood.** The literature strengthens the idea that formalization-creation is a distinct process from retrieval, but does not yet settle whether DomainSpec should model it as an event taxonomy, a review pipeline, or both.

### L-3. Tacit/explicit knowledge conversion

**Pressure on the discovery.** The hypothesis that `C_spec` is broad, layered, and partly created through interaction is close to the tacit/explicit conversion literature, especially the SECI family. The risk here is not contradiction but unacknowledged overlap.

Useful neighboring references:

- Nonaka and Takeuchi's SECI model as the classic tacit/explicit conversion frame.
- Systematic reviews discussing externalization and organizational knowledge creation in digital settings. <https://pmc.ncbi.nlm.nih.gov/articles/PMC8667007/>
- Adjacent SECI operationalization discussions in information-systems contexts. <https://pmc.ncbi.nlm.nih.gov/articles/PMC6914727/>

**Current hypothesis after reading the neighborhood.** This literature likely supports the broad intuition that knowledge moves from tacit to explicit through interaction, but DomainSpec may still be distinct if it turns that transition into observable, typed, reviewable product events rather than a general organizational-learning narrative.

### L-4. Human-AI collaboration and co-formation of structured knowledge

**Pressure on the discovery.** The discovery implicitly treats the LLM not only as a retriever but sometimes as a collaborator in the formation of formalized knowledge. Human-AI collaboration literature may help distinguish what part of that is already known and what remains product-distinctive here.

Useful neighboring references:

- Human-AI shared mental models review above.
- Work on human-AI guidelines and leaky abstractions as collaboration constraints. <https://hci.stanford.edu/publications/2022/leaky.pdf>

**Current hypothesis after reading the neighborhood.** Existing human-AI collaboration literature likely supports the importance of aligned mental models, but the move from "shared understanding" to "promotion of co-created rules into a governed formalization pipeline" still appears like an open product design hypothesis rather than a settled borrowed construct.

### L-5. Psychometrics, validity, and assessment design

**Pressure on the discovery.** Once DomainSpec asks questions and computes distances involving people, it enters psychometric territory. The relevant lesson is not "turn the product into a standardized test." The lesson is that every score is an inference from evidence, and each inference needs a stated construct, validity argument, reliability story, and fairness boundary.

Useful neighboring references:

- AERA, APA, NCME (2014), *Standards for Educational and Psychological Testing* - especially the treatment of validity, reliability, fairness, score interpretation, and intended use. <https://ncme.org/resources-publications/books/testing-standards>
- National Research Council (2001), *Knowing What Students Know* - useful for the cognition / observation / interpretation triad. <https://www.nationalacademies.org/read/10019/chapter/4>
- Messick (1994/1995), unified validity and consequences of assessment use. <https://www.ets.org/research/policy_research_reports/publications/report/1994/hxpp.html>
- Kane (2012), argument-based validation: specify the interpretation/use argument before claiming a score is valid. <https://journals.sagepub.com/doi/abs/10.1177/0265532211417210>
- Mislevy, Almond, and Steinberg's evidence-centered design tradition: claims, evidence, and tasks must be connected deliberately. <https://pmc.ncbi.nlm.nih.gov/articles/PMC6498139/>
- Differential item functioning / measurement invariance work, useful for detecting when probes behave differently across roles, language backgrounds, seniority levels, or domain subgroups. <https://nces.ed.gov/nationsreportcard/tdw/analysis/scaling_checks_dif.aspx>
- Dang, King, and Inzlicht (2020), on why self-report and behavioral measures can be weakly correlated - relevant to treating direct and inferred evidence as different channels rather than assuming one simply validates the other. <https://pmc.ncbi.nlm.nih.gov/articles/PMC7977810/>

**Current hypothesis after reading the neighborhood.** Psychometrics should become the guardrail layer for this discovery. It can help DomainSpec distinguish direct elicitation from inferred behavioral evidence, define what each score is allowed to mean, and prevent premature ranking of people before construct validity, evidence rules, and fairness checks exist.

---

## High-Level Summary of Hypotheses

1. **Three primary categories may be enough to start** — `C_head`, `C_spec`, `C_system` are the current best candidates for the first product framing. More categories may emerge later, but starting with them keeps the model testable.
2. **Intra-category and inter-category consistency may need to stay separate** — many product confusions may disappear once "is this category coherent in itself?" is separated from "does this category preserve another one faithfully?"
3. **The game loops may be instrumentation, not garnish** — bidirectional questioning is the first plausible way to observe `C_head` and to expose drift between `C_head`, `C_spec`, and `C_system`.
4. **"Truth" should probably be replaced by a reference surface** — the reference surface should be framed as the best currently-auditable system of record, not absolute truth. Divergence from it may be error, but may also be uncaptured operational knowledge.
5. **"FF" should remain the long-horizon formal ambition, not the day-1 UI label** — the product can immediately work with operational terms like fidelity, drift, residue, and alignment while the stricter categorical definition is still being built.
6. **Organizational knowledge is probably distinct from individual knowledge** — "high knowledge / low alignment" and "low knowledge / high alignment" appear meaningfully different and should not collapse into one score.
7. **`Spec` is likely a broad category, not one artifact type** — ontology, discovery, plan, rules, and other formalizations likely belong inside `C_spec` as subcategories rather than as competing top-level categories.
8. **Rule formation during LLM interaction may deserve its own event pipeline** — one likely event type is "definition/formalization of a subsystem or subcategory is being created," which could become a dedicated observation and review surface inside the `C_spec` pipeline.
9. **`C_head` has both direct and inferred evidence channels** — explicit questions are the easiest first probe, but long-term calibration needs behavioral, metacognitive, and revision evidence too.
10. **Psychometrics is a validity discipline, not a product promise** — early scores should be framed as limited evidence for limited claims, not as direct measurements of a person's knowledge in general.
11. **Metrics must be action-bearing** — a distance is product-relevant only if it localizes a divergence, exposes evidence, suggests a correction direction, or triggers a review workflow.

---

## Working Hypotheses

### H-1. The first three knowledge categories are `head`, `spec`, and `system`

**Hypothesis.** Treat the following as the first product-level categories:

- **`C_head`** — knowledge internalized by a person or group.
- **`C_spec`** — knowledge formalized in docs, ontology, structured artifacts, and explicit rules.
- **`C_system`** — executable behavior, schemas, code, runtime constraints, and observable system outputs.

**Rationale.** These are the three places where the same domain meaning most often diverges in practice. They are also the minimum set that lets DomainSpec talk about personal knowledge, documentation drift, and implementation drift in one frame without premature ontology bloat.

**Status.** Current best framing; needs testing against concrete product flows.

### H-2. Intra-category consistency and inter-category consistency are different measurements

**Hypothesis.** The model should explicitly distinguish:

- **intra-category consistency** — coherence inside a category itself;
- **inter-category consistency** — fidelity of translation between categories.

**Rationale.** A category can be internally coherent and still badly translated into another one. Likewise, a category can be internally fractured, in which case every translation from it is contaminated at the source. The product must not collapse these into a single score.

Examples:

- A spec can be internally consistent but drift from operational reality.
- Code can be internally consistent and still implement the wrong spec.
- A team can disagree internally while each member remains locally consistent.

**Status.** Structurally compelling; still needs operational definitions.

### H-3. The first operational observation mechanism is bidirectional question-play

**Hypothesis.** The product's first observation loop should be game-shaped and bidirectional:

- **`system -> person`** to probe what the person knows;
- **`person -> system`** to probe what the formalized/systemized domain can answer.

**Rationale.** Parts of `C_head` can be directly elicited, but the whole category is not exhausted by direct answers. Question-play is the first practical way to surface distinctions, reconstructions, exceptions, analogies, and justifications. The reverse loop is equally important because it measures the answerability and recoverability of `C_spec` and `C_system`.

**Status.** Strong candidate for MVP mechanism, not yet validated.

### H-4. The product measures geometry, not just correctness

**Hypothesis.** The core frame should be distance/topology rather than quiz accuracy.

Load-bearing distance types:

- **person -> system reference**
- **person A -> person B**
- **group -> internal alignment**
- **group -> system reference**
- **spec -> system**

**Rationale.** A single "did you get it right?" score is too weak. Two people can both diverge from the system reference in different directions; a team can be highly aligned around a poor model; an expert can diverge from the reference because the reference is stale. Geometry preserves this information.

**Status.** Strong framing hypothesis; still missing a first concrete metric.

### H-5. "System true" must be framed as a reference surface, not absolute truth

**Hypothesis.** Replace metaphysical truth-language with operational language such as:

- canonical reference,
- best auditable model,
- current system of record,
- reference surface.

**Rationale.** If a person diverges from the reference, that divergence may be error or may be evidence that the reference has drifted from lived reality. The product must preserve that ambiguity rather than encode the reference as always-right by definition.

**Status.** Immediate language discipline; should be kept unless falsified by later work.

### H-6. Individual knowledge and organizational alignment are separate product objects

**Hypothesis.** The product should support both:

- **individual fidelity** — how a person relates to the reference surface;
- **collective alignment** — how a group relates internally and externally.

**Rationale.** Organizations fail in both directions:

- high expertise / low alignment,
- low expertise / high alignment.

If the product collapses both into a single score, it loses the main organizational insight.

**Status.** High-confidence distinction; still needs aggregation design.

### H-7. `Spec` is a broad category with subcategories inside it

**Hypothesis.** `C_spec` should be treated as a broad category rather than a single artifact type.

Candidate subcategories inside `C_spec`:

- ontology / concept definitions,
- discoveries,
- plans,
- rules,
- structured specs,
- other approved formalizations.

**Rationale.** Documentation is not one thing. Treating ontology, discovery, plan, and rule surfaces as if they were interchangeable would flatten important differences. But treating each of them as a top-level category too early would likely create unnecessary ontology sprawl. A broad `C_spec` with internal subcategories preserves both unity and differentiation.

**Status.** Newly added hypothesis; needs a rule for when a subcategory should become first-class.

### H-8. Rule formation during LLM interaction may be an event-worthy pipeline step

**Hypothesis.** When a user and the LLM are co-creating a new definition, rule, or formalization, the system may need to recognize that moment explicitly and route it through its own pipeline.

Candidate event:

- **`formalization-created`** — the interaction produced a candidate definition or formalization of a subsystem, concept, rule, or subcategory.

Possible downstream implications:

- mark the event as review-worthy,
- attach it to the relevant `C_spec` subcategory,
- compare it against existing formalizations,
- ask stabilizing questions before promotion,
- log it as a drift-sensitive mutation in the reference surface.

**Rationale.** The act of forming a rule is not the same as merely retrieving one. If DomainSpec is serious about calibration, it should distinguish "the system answered from existing knowledge" from "the system and user are creating new formalized knowledge right now."

**Status.** Newly added hypothesis; needs event taxonomy, pipeline design, and promotion criteria.

### H-9. `C_head` should be observed through both direct and inferred channels

**Hypothesis.** DomainSpec should treat knowledge in `C_head` as partially observable through direct elicitation and partially inferable from behavior.

Direct evidence channels include:

- explicit answers to domain questions,
- definitions in the person's own words,
- explanations of rules and exceptions,
- confidence ratings,
- judgments about ambiguity or disagreement,
- self-reported uncertainty and missing context.

Inferred evidence channels include:

- repeated choices across scenarios,
- corrections made during work,
- questions the person asks the system,
- how the person resolves conflicts between spec and runtime behavior,
- how quickly and stably the person transfers a rule to a new case,
- whether later actions match earlier stated beliefs.

**Rationale.** Direct elicitation is the natural MVP because it is legible, reviewable, and easier to validate. But declared knowledge is not the whole of operational knowledge. A person may explain poorly and act well, explain fluently and act wrongly, or know a local exception that the reference surface has not captured. The product should be designed from the start to combine declared, behavioral, and metacognitive evidence rather than trapping itself in a quiz-shaped measurement model.

**Status.** Newly added hypothesis; high conceptual fit, not yet operationalized.

### H-10. Psychometric validity should govern any score about `C_head`

**Hypothesis.** Before DomainSpec exposes any score about a person, team, or group's knowledge, it should state:

- the construct being estimated,
- the evidence used,
- the inference being made,
- the intended use of the score,
- the uses explicitly not supported,
- known threats to validity and fairness.

**Rationale.** The product can ask direct questions, collect behavior, and infer patterns, but those observations do not automatically justify a strong claim like "this person knows the domain." Psychometrics supplies the discipline for moving from observations to claims: evidence-centered design, construct maps, item difficulty, reliability, measurement invariance, and validity arguments. This is especially important if scores could affect trust, status, hiring, onboarding, access, or performance judgments.

**Status.** Guardrail hypothesis; should constrain metric design before implementation.

### H-11. A useful metric must shorten the path from divergence to action

**Hypothesis.** DomainSpec should reject any metric, chart, or score that only says "alignment is high/low" without localizing the divergence, showing the evidence, and supporting a next decision.

For a metric to graduate from research into product, it should answer at least most of the following:

- Which specific concept, rule, flow, decision, contract, or exception is diverging?
- Which categories are involved: `C_head`, `C_spec`, `C_system`, or a subcategory?
- What evidence supports the signal?
- How confident is the system in the reading?
- What is the likely correction direction: update understanding, update spec, update system, or mark the reference as stale?
- Who is the natural owner of the next action?
- What happens after the action to confirm whether calibration improved?

**Rationale.** The biggest product failure mode is a beautiful dashboard that diagnoses nothing. A global "calibration score" may feel useful, but if it does not produce a local decision, it will become vanity analytics. The product should behave more like a calibration workbench than a passive dashboard: it should show a divergence, point to evidence, preserve uncertainty, and offer action paths.

**Status.** Newly added anti-dashboard constraint; should gate all future product surfaces.

---

## Working Model

### The three primary categories

| Category | What it holds | Typical observation surface |
|----------|---------------|-----------------------------|
| `C_head` | tacit, internalized, declared, operational, and metacognitive knowledge in people or teams | direct answers, explanations, confidence, decisions, corrections, patterns of action |
| `C_spec` | formalized domain knowledge | docs, ontology entries, discoveries, plans, rules, structured artifacts |
| `C_system` | executable domain behavior | code, schema, runtime responses, system outputs, telemetry |

### Internal structure inside `C_spec`

Current subcategory candidates:

| Subcategory | What it means |
|-------------|---------------|
| `Spec.ontology` | concept definitions, typed relations, formal vocabulary |
| `Spec.discovery` | exploratory knowledge that is not yet stabilized as durable operating truth |
| `Spec.plan` | intended action structure, sequencing, and commitments |
| `Spec.rules` | explicit constraints, invariants, and policy-like statements |
| `Spec.specification` | feature or subsystem descriptions that unify behavior, concepts, and constraints |

This discovery does **not** claim these are the final subcategories. It claims only that `C_spec` is broad enough that one flat bucket is likely too coarse.

### Two classes of measurement

| Measurement | Question |
|-------------|----------|
| **Intra-category** | Is this category coherent in itself? |
| **Inter-category** | Does this category preserve another one faithfully? |

### Two evidence channels for `C_head`

| Channel | What it captures | Product risk |
|---------|------------------|--------------|
| **Direct elicitation** | what a person can state, define, explain, justify, distinguish, or report with confidence | can overvalue verbal fluency, test-taking skill, or willingness to answer |
| **Inferred behavioral evidence** | what a person repeatedly does, chooses, corrects, asks, transfers, or revises in context | can overinterpret noisy actions without enough evidence or context |

The first practical product loop should probably begin with direct elicitation because it is easier to review and explain. The long-term product value comes from combining direct elicitation with inferred behavioral evidence, while keeping the uncertainty of each inference visible.

Useful axes for later metric design:

| Axis | Why it matters |
|------|----------------|
| **direct <-> inferred** | separates explicit answerability from behavioral evidence |
| **declarative <-> procedural** | separates "can explain" from "can apply" |
| **controlled <-> situated** | separates clean probes from real-context behavior |
| **point-in-time <-> longitudinal** | separates snapshot knowledge from learning, drift, and stability |
| **confidence high <-> confidence low** | supports metacognitive calibration rather than only correctness |

Candidate evidence-design matrix:

| Field | Question |
|-------|----------|
| `C_head` component | What part of knowledge is being probed? |
| Task / elicitation | What interaction produces the signal? |
| Observable | What exactly is recorded? |
| Intended inference | What claim is this evidence allowed to support? |
| Threats | What else could explain the signal? |
| Confidence | How strong is the warrant after this observation? |

### First useful product distances

| Distance | Product meaning |
|----------|-----------------|
| `d(head_i, reference)` | how far a person is from the current auditable model |
| `d(head_i, head_j)` | how far two people are from each other |
| `d(spec, system)` | documentation drift |
| `d(group, reference)` | organizational drift from the current model |
| `alignment(group)` | internal coherence of organizational understanding |

### Why the game matters

The game is how the product gets evidence:

- `system -> person` directly elicits declared, explanatory, and metacognitive parts of `C_head`
- `person -> system` reveals answerability of `C_spec` and `C_system`
- repeated interaction over time supports inferred evidence about operational knowledge
- comparing direct and inferred evidence reveals residue and drift

This creates a future distinction between:

- **declared knowledge** - what the person can say;
- **operational knowledge** - what the person can apply;
- **metacognitive knowledge** - what the person knows about their own uncertainty;
- **latent/tacit knowledge** - patterns visible mainly through repeated use.

### Psychometric guardrails for future scoring

Any user-facing score should be treated as a claim with a limited warrant, not as a direct readout of the mind.

Candidate guardrails:

- define the construct before designing probes;
- separate knowledge, alignment, confidence, speed, coverage, and learning velocity;
- attach each score to a stated intended use;
- record unsupported uses explicitly;
- test whether probes behave differently across roles or groups;
- distinguish "person was wrong" from "reference surface was stale" and "probe was ambiguous";
- check for construct-irrelevant variance such as language fluency, interface familiarity, recent exposure, anxiety, typing speed, or metric gaming;
- check for construct underrepresentation, especially if the product only asks definitions and never probes application, exception handling, transfer, or critique;
- compare new metrics against simple baselines such as raw accuracy, self-rated confidence, time on task, and number of revisions;
- report uncertainty or confidence level rather than only a point estimate;
- avoid interpersonal ranking until validity, reliability, and fairness evidence exist.

Allowed uses before strong validation:

- diagnose calibration gaps in a specific task or domain;
- adapt feedback, examples, difficulty, or scaffolding;
- compare a person's own trajectory over time within the same context;
- detect possible mismatch between confidence and observed performance;
- generate review questions about `C_spec` or `C_system`;
- support research hypotheses with explicit uncertainty.

Prohibited uses:

- ranking people;
- hiring, promotion, firing, compensation, access, credit, insurance, or governance decisions;
- psychological, clinical, personality, intelligence, seniority, or potential diagnosis;
- use outside the validated domain, task, population, or time window;
- hidden profiling without consent;
- single-score summaries without decomposition, evidence, and uncertainty;
- interpreting disagreement between self-report and behavior as bad faith.

### Anti-dashboard discipline

No metric should enter the product only because it is easy to compute or visually satisfying.

Action-bearing signals should preserve:

| Signal property | Why it matters |
|-----------------|----------------|
| **local delta** | shows exactly where `C_head`, `C_spec`, and `C_system` diverge |
| **consequence severity** | distinguishes harmless mismatch from bug risk, user harm, retrabalho, or conceptual debt |
| **correction direction** | suggests whether to update understanding, spec, system, or reference surface |
| **traceable evidence** | points to answers, spec fragments, commits, runtime behavior, decisions, or review notes |
| **age and recurrence** | separates a fresh mismatch from persistent drift or repeated model failure |
| **confidence** | keeps weak signals from masquerading as established findings |

Candidate useful surfaces:

- **calibration queue** - a prioritized list of divergences with evidence, likely owner, and action choices;
- **conceptual diff** - a compact comparison of "what people believe", "what the spec says", and "what the system does";
- **tension map by domain area** - a way to find clusters of recurring divergence, not a decorative heatmap;
- **drift timeline** - when a divergence appeared, grew, was accepted, or was corrected;
- **post-calibration check** - a follow-up view showing whether the correction actually reduced the divergence.

Anti-patterns:

- global scores such as "calibration 87%" without local evidence or next action;
- heatmaps that do not explain cause, evidence, or ownership;
- ranking people before the measurement system has a validity argument;
- mixing trivial and high-consequence divergences in one undifferentiated number;
- treating `C_head`, `C_spec`, or `C_system` as automatically authoritative;
- alerts that cannot be accepted, rejected, assigned, investigated, or converted into a spec/system update.

Product-entry test for any visualization:

| Gate | Question |
|------|----------|
| Divergence | What exact divergence does this reveal? |
| Actor | Who can act on it? |
| Decision | What decision does it make easier? |
| Evidence | What observable evidence supports it? |
| Workflow | What changes because this view exists? |
| Non-vanity | Why is this not merely decorative analytics? |

### Discovery maturity note

This discovery is early relative to implementation, but not raw. It has named objects, candidate distances, observation loops, alternatives, and open questions. A future vault-wide discovery-ranking system could classify it as roughly **spec-seed-ready but not experiment-ready**:

- ready to become a product-facing spec seed;
- not ready to become a production metric;
- not ready to rank people or teams;
- not ready to drive access, hiring, performance, or governance decisions;
- ready for a small experiment design using a tiny reference surface and a handful of explicit probes.

### First experiment shape

The first experiment should be deliberately small and should test whether the geometry produces useful local divergences, not whether a polished score is possible. This is a smoke test for product value, not a validation study.

Candidate experiment:

- choose one tiny reference surface, such as one page of spec or one narrow workflow;
- write 5-7 probes spanning definition, distinction, exception, justification, transfer, and ambiguity detection;
- run the probes with 2-3 people or agents;
- compare answers against the reference and, where possible, against actual system behavior;
- classify each divergence by likely source: `head`, `spec`, `system`, stale reference, ambiguous probe, or unresolved;
- produce a calibration queue, not a score;
- decide whether each item suggests updating understanding, updating the spec, fixing the system, or revising the probe.

Promotion signal:

- the experiment reveals divergences that were not obvious from reading the spec or running tests;
- at least some divergences lead to concrete corrections or review questions;
- users can understand why an item appeared and what to do next;
- the output feels like a work queue, not a report card.

Kill signal:

- the result collapses into generic quiz scoring;
- users cannot tell what action follows from the output;
- most findings are explained by bad probes rather than real divergence;
- the reference surface is too unstable to support interpretation;
- the system creates social risk by implying person-level judgment before validity exists.

### Validation ladder after the smoke test

If the smoke test produces useful divergence items, the next stage should still avoid production scoring. It should test whether the signals beat simple baselines and support interventions.

Candidate validation stage:

- 20-40 participants or sessions in one closed domain;
- one explicit reference surface and one stable task family;
- pre-task evidence: confidence, perceived gaps, expected performance;
- during-task evidence: choices, revisions, help requests, hypothesis changes, response to feedback;
- post-task evidence: confidence update, justification, error recognition, transfer to a related task;
- outcomes: accuracy, confidence calibration, ability to identify one's own error, improvement after feedback, and transfer;
- baselines: raw accuracy, self-confidence, time on task, number of revisions, and a simple linear/logistic model when applicable.

Pass criteria:

- the calibration signals improve prediction or intervention relative to baselines;
- subcomponents remain interpretable;
- outputs produce concrete actions such as feedback, explanation, new task, spec revision, system fix, or probe rewrite;
- users understand why an item appeared and what decision it supports.

Fail criteria:

- the aggregate score performs no better than baselines;
- the explanation depends on post-hoc narrative;
- measured behavior mostly reflects interface style, prompt style, verbal fluency, or compliance theater;
- the score does not generate a useful recommendation;
- stakeholders start interpreting it as general competence, intelligence, or person value.

### Possible rule-formation event inside the loop

The game may also expose a separate class of event:

- the system is not just retrieving an answer;
- the user and the system are co-forming a new definition, rule, or formalization;
- that new formalization may need to enter `C_spec` through a reviewable pipeline.

This suggests a future distinction between:

- **knowledge retrieval events**
- **knowledge formation events**
- **knowledge promotion events**

---

## Alternatives Considered

### A-1. Treat DomainSpec as documentation only

**Position.** Keep DomainSpec as a system for formalized knowledge and drift between docs and code only.

**Why rejected.** This leaves the most valuable carrier of domain knowledge — people — outside the model. It also prevents the product from measuring the gap between tacit knowledge and formalized knowledge, which is precisely where many organizational failures originate.

### A-2. Treat the product as a generic quiz engine

**Position.** Ask questions, compute scores, and optimize for accuracy / completion / speed.

**Why rejected.** That collapses structural divergence into trivia-style correctness. The product's value is not that it quizzes people; it surfaces different classes of alignment and residue between categories.

### A-3. Use one scalar knowledge score

**Position.** Produce one overall "knowledge score" per person or team.

**Why rejected.** A single score erases distinctions between coherence, fidelity, coverage, and alignment. It would make "everyone agrees on the wrong thing" look too similar to "everyone independently knows the right thing."

### A-4. Start with many categories instead of three

**Position.** Immediately model subcategories such as `runtime`, `telemetry`, `ontology`, `tests`, `policy`, `group-head`, `individual-head`.

**Why rejected.** Probably directionally correct but prematurely complex. The first discovery should identify the smallest useful geometry. Refinements can split the initial three later.

### A-5. Encode FF as the first user-facing metric

**Position.** Present the product immediately in fully categorical language: fully faithful person, faithful doc, functorial translation, etc.

**Why rejected.** Conceptually attractive but too early as product language. The product can act on fidelity, drift, residue, and alignment before the stronger mathematical definition is stabilized.

### A-6. Build an analytics dashboard first

**Position.** Start with aggregate calibration scores, heatmaps, trend charts, and team-level dashboards.

**Why rejected.** This is the shortest path to a hollow product. Aggregates may become useful later, but only after the product can show local divergences, trace evidence, and route a correction. The first surface should be closer to a calibration queue or conceptual diff than to an executive dashboard.

---

## Open Questions

- **OQ-1 — What is the first operational definition of intra-category consistency for `C_head`?** Consistency inside a person cannot be reduced to "answered similarly twice." We need a stronger but still practical definition.
- **OQ-2 — What exactly is the boundary between `C_spec` and `C_system`?** Does structured telemetry belong inside `C_system`, or should it become a fourth category later?
- **OQ-2b — What is the first rule for calling something a category versus a subcategory?** `C_spec` is already broad enough to force this question.
- **OQ-3 — What qualifies as the reference surface for a domain?** Is it documentation-first, code-first, reviewed synthesis, or a weighted combination?
- **OQ-4 — How should the product treat disagreement with the reference surface?** When is divergence a user error, and when is it evidence that the reference has drifted?
- **OQ-5 — What is the first score vocabulary for users?** Candidates include fidelity, drift, residue, calibration, coherence, answerability, alignment. The product should not expose seven shaky labels if three would do.
- **OQ-6 — How do we aggregate from person-level distances to company-level knowledge?** We need a principled path from pairwise distances to org-level alignment without hiding minority expert clusters.
- **OQ-7 — What is the right first MVP distance?** Candidate starting points: `person -> reference`, `person -> person`, or `spec -> system`. All are useful; one likely has to come first.
- **OQ-8 — How much of the metric should reward learning velocity versus current state?** The conversation strongly suggests improvement-over-time matters, but the tradeoff with present-state fidelity is unresolved.
- **OQ-9 — Which question types are structural enough to count as evidence?** Distinction, reconstruction, exception handling, analogy, justification, and prediction likely contribute differently and should not be weighted casually.
- **OQ-10 — What is the first ethically-safe way to show interpersonal distance?** "You are far from the truth" and "you are far from your peers" are socially explosive if surfaced bluntly.
- **OQ-11 — How does this connect to the long-horizon categorical program without overclaiming?** The discovery wants the FF framing, but the product needs an operational discipline that works before theorem-grade definitions exist.
- **OQ-12 — What is the first falsification criterion for the whole frame?** A real discovery should name what evidence would show this framing is misguided or too expensive relative to simpler quiz/documentation tools.
- **OQ-13 — What event taxonomy should govern rule formation?** If "creating a definition/formalization of a subsystem or subcategory" is real, what are the neighboring events and what pipeline do they enter?
- **OQ-14 — How should newly formed rules or definitions move from interaction into `C_spec`?** Immediate write, staged candidate, human approval, or multi-step promotion?
- **OQ-15 — Which parts of this framing are actually new once adjacent literature is accounted for?** The product does not need novelty everywhere, but it does need to know which claims are borrowings, which are recombinations, and which are genuine bets.
- **OQ-16 — When is direct elicitation enough, and when does the product need inferred behavioral evidence?** A first MVP can ask direct questions, but the product needs a rule for when declared knowledge is too weak to support the intended inference.
- **OQ-17 — How should declared, operational, metacognitive, and tacit evidence be combined?** These evidence types may disagree, and disagreement itself may be product-relevant.
- **OQ-18 — What is the first construct map for DomainSpec knowledge?** Candidate levels include vocabulary, relation, invariant, application, exception, debugging, extension, and critique.
- **OQ-19 — What validity argument is required before exposing any person-level or team-level score?** The answer likely depends on whether the score is used for learning feedback, onboarding, governance, performance evaluation, or access control.
- **OQ-20 — Should discoveries themselves have a maturity/ranking model?** This discovery is intentionally early; the vault may need explicit levels such as raw spark, framed hypothesis, pressure-tested, spec-seed-ready, implementation-candidate, and validated.
- **OQ-21 — What is the minimum evidence bundle for a divergence item?** A product item may need source fragment, answer/action trace, affected category pair, confidence, severity, owner, and suggested next action.
- **OQ-22 — What action taxonomy should calibration items support?** Candidate actions include accept divergence, update `C_head` through learning, update `C_spec`, fix `C_system`, mark reference stale, rewrite probe, or defer.
- **OQ-23 — When are aggregate scores allowed?** The likely answer is only after local divergence handling works and validity evidence exists for the intended use.

---

## Next Moves

- **Write a product-facing spec seed** that turns `C_head`, `C_spec`, and `C_system` into operational objects with candidate scores and observation methods.
- **Write a first construct map for `C_head`** that separates vocabulary, relations, rules, exceptions, application, debugging, transfer, and critique.
- **Design the first direct elicitation loop** before attempting heavier inferred-behavior metrics.
- **Define how direct and inferred evidence are allowed to disagree** and what each disagreement means product-wise.
- **Define the anti-dashboard product gate** for any metric or visualization before designing UI.
- **Design the first calibration queue** as the primary output of the experiment instead of a global score.
- **Write kill criteria for the first experiment** so the team can abandon or revise the frame if it only produces decorative analytics.
- **Define the category/subcategory rule** before adding more first-class buckets.
- **Design the first bidirectional game loop** with a minimal question taxonomy and explicit evidence rules.
- **Design a first event taxonomy** that distinguishes retrieval from formation and promotion inside the interaction loop.
- **Name the first reference-surface discipline** so "system truth" never sneaks back in as an unexamined assumption.
- **Prototype org-level views** that distinguish expertise from alignment instead of collapsing them.
- **Open a follow-up discovery on score semantics** if the terminology set (`fidelity`, `drift`, `residue`, `alignment`) proves unstable under real examples.
- **Open a follow-up discovery on metric validity** before any user-facing scoring is treated as load-bearing.
- **Open a follow-up discovery on discovery maturity/ranking** so early hypotheses are not confused with implementation-ready specs.
- **Open a dedicated research node or lens set** if this discovery graduates from framing into metric design, so the literature pressure becomes a first-class provenance layer rather than inline notes.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../../../README.md` | `cites` | Root DomainSpec framing: documentation as the meaning-side of the system. This discovery extends that frame by making people first-class knowledge carriers rather than external operators. |
| `../../../DRIFT-CONVERGENCE.md` | `cites` | Drift is already a core system concern in DomainSpec; this discovery broadens the drift frame from doc/code to person/spec/system geometry. |
| `../../../TUNING-LOOP.md` | `cites` | Existing calibration language on the system side. This discovery suggests a broader cross-category calibration surface rather than a system-only tuning loop. |
| `../../../docs/README.md` | `cites` | Documentation as canonical meaning surface. This discovery keeps that role but treats it as one category among several, not as the whole domain of knowledge. |
| `../domainspec-axioms/discovery.md` | `cites` | Connects especially to the existing navigation/calibration posture in the vault-side ontology work; this discovery re-reads that posture through a product metric lens. |
| `../questions-game/README.md` | `cited-by` | The questions-game folder navigation cites this discovery as the shared substrate (probe taxonomy, evidence schema, three-category frame) that all of its child discoveries consume without redescribing. |
| `../questions-game/individual-fidelity/discovery.md` | `cited-by` | The individual-fidelity child discovery cites this parent for the `C_head`/`C_spec`/`C_system` frame, the anti-dashboard discipline (H-11), the reference-as-surface posture (H-5), and the minimum calibration-item schema seed (OQ-21). |

---

## Source Dispatch

This discovery is synthesized directly from a product-framing conversation rather than from a multi-lens dispatch. No `lenses/` folder is populated yet. If this framing survives first contact with spec work, the next honest step is to dispatch dedicated lenses on:

- metric validity,
- psychometric validity and evidence design,
- reference-surface governance,
- question-taxonomy design,
- direct-vs-inferred `C_head` evidence,
- org-level aggregation,
- discovery maturity/ranking,
- and the categorical-definition bridge to the sibling theorem program.
