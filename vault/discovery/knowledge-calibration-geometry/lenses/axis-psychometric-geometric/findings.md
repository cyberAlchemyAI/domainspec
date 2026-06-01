---
tags: [psychometric, geometric, measurement, lens, knowledge-calibration-geometry, refinement]
node_type: findings
is_session: false
layer: architecture, application
nature: explanatory, reference
status: active
dispatch_status: lens-agent-2-of-4
lens_order: second
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Findings — Psychometric + Geometric/Measurement Rigor Lens on `knowledge-calibration-geometry/discovery.md` v0.4.0

## Instantiation

I am Lens Agent 2 of 4 in a parallel refinement pass over `vault/discovery/knowledge-calibration-geometry/discovery.md` (693 lines, v0.4.0). My axis is **Psychometric + Geometric/measurement rigor**, operated in two modes:

- **Mode A — Psychometric.** Focus on H-5, H-9, H-10, the evidence-channels model, and the "Psychometric guardrails" section (~line 416). Evaluate operational definition of `C_head`; separation of direct vs inferred evidence; construct/content/criterion/consequential validity argument structure; reliability (test-retest, internal consistency, inter-rater); fairness / measurement invariance; ECD (Evidence-Centered Design) vocabulary usage; survival under a psychometric review board. Reference Messick (construct validity, consequential aspect), Mislevy/Almond/Steinberg (ECD), Kane (argument-based validity), AERA/APA/NCME *Standards*, and *Knowing What Students Know* (cognition–observation–interpretation triad).

- **Mode B — Geometric / measurement.** Focus on H-2, H-4, H-11, "Two classes of measurement" (~line 353), "First useful product distances" (~line 390). Evaluate whether "geometry" is load-bearing or decoration; whether each `d(·,·)` satisfies metric axioms (non-negativity, identity of indiscernibles, symmetry, triangle inequality); intra-rater vs inter-rater reliability; whether H-11's metric is actually specified anywhere; what Stevens scales, IRT/Rasch, factor analysis, Jensen–Shannon divergence, edit/tree distances, and item response theory would import.

Out of scope: hypothesis-by-hypothesis coherence audit (axis 3), adversarial vs constructive framing (axis 1), and evidence-citation tightness (axis 4).

## Method

- Read the discovery in full (693 lines), with particular attention to L-5 (psychometric literature), H-2, H-4, H-5, H-9, H-10, H-11, the Working Model section (categories, measurements, evidence channels, distances, guardrails, anti-dashboard), the smoke-test/validation-ladder sections, and the open questions OQ-1, OQ-9, OQ-16–OQ-19, OQ-21.
- Compared the prose to the standards corpus the discovery itself cites: AERA/APA/NCME (2014) *Standards*; Messick (1989, 1994/1995) unified validity; Kane (2013) argument-based validation; Mislevy, Almond & Steinberg (2003) ECD; National Research Council (2001) *Knowing What Students Know*; Dang, King & Inzlicht (2020) self-report vs behavioral.
- Cross-referenced against measurement-theory canon not currently cited: Stevens (1946) on scale types; Lord & Novick (1968) on classical test theory; Embretson & Reise (2000) on IRT; Rasch (1960); Borsboom (2005) on construct realism; Cronbach & Meehl (1955) on construct validity origin; Cronbach (1951) alpha; Shrout & Fleiss (1979) ICC; Cohen (1960) kappa; McDonald (1999) omega.
- For the geometric axis: compared against metric-space axioms (Fréchet 1906), edit distances (Levenshtein, tree edit, graph edit), distributional divergences (KL, Jensen–Shannon, Wasserstein), embedding-space similarities (cosine), and ordinal/partial-order structures.
- I did not run literature fetches; this is a desk review of the prose against canonical concepts.

## Findings — Psychometric

### P1. `C_head` is never operationally defined as a construct — the central object floats between three incompatible types

- **Location.** H-1 (lines 146–156); H-9 (lines 268–292); Working Model "three primary categories" table (lines 333–337); construct-map open question OQ-18 (line 640).
- **Quoted snippets.** `"C_head — knowledge internalized by a person or group."` and `"tacit, internalized, declared, operational, and metacognitive knowledge in people or teams"`.
- **Rigor gap.** `C_head` is alternately treated as (i) a **latent continuous trait** (something with a "distance to reference," implying ratio/interval scale), (ii) a **discrete knowledge state** (a person "has" or "lacks" a rule, suggesting a diagnostic classification model / cognitive diagnostic model), and (iii) a **behavioral disposition** (inferred from repeated choices, suggesting a behavioral-frequency or propensity construct). These three formalisms have **incompatible psychometric machinery**: IRT vs cognitive diagnosis models (DINA, G-DINA, LCDM) vs behavioral propensity estimation. The discovery cannot choose downstream math until it chooses a construct type. Currently it tries to keep all three open simultaneously, which is fine for a discovery but must be flagged as a forced fork before any spec.
- **Suggested patch.** Add a subsection under H-1 titled "What kind of object is `C_head`?" naming the three candidate types (latent trait, knowledge-state vector, behavioral disposition) and stating that the choice gates the metric family. Add an open question OQ-24: "Which construct type does `C_head` instantiate, and what evidence would force one over the others?" Import the term **construct map** (per Wilson, *Constructing Measures*, 2005) as the artifact that resolves this.

### P2. Validity types are used as a checklist, not as an argument structure (Kane is cited but not applied)

- **Location.** L-5 (lines 110–124); H-10 (lines 294–307); "Psychometric guardrails" (lines 416–451).
- **Quoted snippet.** `"Before DomainSpec exposes any score about a person, team, or group's knowledge, it should state: the construct being estimated, the evidence used, the inference being made, the intended use of the score, the uses explicitly not supported, known threats to validity and fairness."`
- **Rigor gap.** Kane's framework is not a checklist — it requires an explicit **interpretation/use argument (IUA)** that chains scoring → generalization → extrapolation → implication, with each link's warrants stated and backed by evidence. The discovery names the destination ("validity argument should exist") but never sketches the inferential chain. Messick's **consequential validity** (the social consequences of score use) is also implicit in the "Prohibited uses" list but never named.
- **Suggested patch.** Replace the bullet list in H-10 with a four-bridge Kane scaffold: (1) **Scoring inference** — from observed response to score; (2) **Generalization inference** — from observed score to universe of similar tasks (reliability lives here); (3) **Extrapolation inference** — from test universe to real-domain behavior; (4) **Implication inference** — from real-domain behavior to decisions/uses. Each link gets warrants and threats. Add a sidebar naming Messick's six aspects: content, substantive, structural, generalizability, external, consequential.

### P3. ECD (Evidence-Centered Design) vocabulary is borrowed loosely and missing its load-bearing terms

- **Location.** L-5 mentions Mislevy/Almond/Steinberg (line 120); the "Candidate evidence-design matrix" (lines 379–388).
- **Quoted snippet.** Matrix columns: `"C_head component"`, `"Task / elicitation"`, `"Observable"`, `"Intended inference"`, `"Threats"`, `"Confidence"`.
- **Rigor gap.** ECD has a precise vocabulary: **Student Model** (what is being measured), **Evidence Model** (how observations are scored and combined — split into *evaluation rules* and *measurement model*), **Task Model** (the situations that produce observations), **Assembly Model** (how tasks are composed), **Presentation Model**. The discovery's matrix is roughly an Evidence Model fragment but conflates the Student Model column (`C_head component`) with the Task Model column (`Task / elicitation`) and never separates evaluation rules from the measurement model. Without that separation, the matrix cannot be implemented — you cannot say how a vector of observables aggregates into a score.
- **Suggested patch.** Re-architect the matrix as four columns aligned to ECD: **Student Model variable** (which `C_head` sub-construct), **Task Model class** (what situation), **Evidence Model — evaluation rule** (how to score one observation), **Evidence Model — measurement model** (how observations combine; e.g., IRT 2PL, sum score, Bayes net). Cite Mislevy, Steinberg, Almond (2003) *Focus Article: On the Structure of Educational Assessments* by name.

### P4. Reliability is entirely absent — no internal consistency, test-retest, inter-rater, or generalizability framing

- **Location.** Searched throughout. The word "reliability" appears once in H-10 only as a checklist item (line 305) and once in the smoke-test pass criteria. Never operationalized.
- **Rigor gap.** A score with unknown reliability cannot have valid inferences — reliability is the upper bound on validity (Spearman correction for attenuation). The discovery proposes scoring people but does not name **test-retest** (stability over time, critical because `C_head` is expected to change — confounded with learning), **internal consistency** (Cronbach α / McDonald ω, for multi-item probes), **inter-rater agreement** (Cohen κ / Fleiss κ / ICC, critical because LLM-graded open responses will need rater agreement), or **generalizability theory** (Cronbach et al. 1972) which is the right framework when error sources are heterogeneous (raters, tasks, occasions, domains all contribute variance).
- **Suggested patch.** Add a subsection "Reliability — sources of measurement error" under "Psychometric guardrails." Distinguish (a) **occasion variance** (test-retest), (b) **task/item variance** (parallel forms / internal consistency), (c) **rater variance** (especially for LLM-as-judge), (d) **domain-subarea variance**. Recommend **G-theory** as the natural frame since multiple facets will be crossed. Specifically: every LLM-scored item needs an inter-rater design (human vs LLM, or LLM run 1 vs run 2 at temperature > 0).

### P5. The self-report vs behavioral distinction (Dang et al. 2020) is cited but the implication is softened

- **Location.** L-5 (line 122); H-9 "Direct evidence channels" vs "Inferred evidence channels" (lines 272–289); "Two evidence channels for `C_head`" table (lines 360–367).
- **Quoted snippet.** `"The first practical product loop should probably begin with direct elicitation because it is easier to review and explain."`
- **Rigor gap.** Dang/King/Inzlicht's finding is stronger than the discovery represents: self-report and behavioral measures of the same labeled construct correlate weakly (r often < .3) **because they index different constructs**, not because one is noise around the other. The discovery says they are "different channels" but then suggests starting with direct elicitation as the MVP — which risks anchoring the product's construct definition to whatever direct elicitation captures (declarative knowledge), then later treating behavioral evidence as "validating" or "drifting from" it. That gets the validity argument backwards. The honest position is: declared knowledge and operational knowledge are **two distinct constructs**, not two measurements of one thing.
- **Suggested patch.** Reframe H-9 to say `C_head` is **at least two constructs** (declared `C_head_dec`, operational `C_head_op`), with **metacognitive `C_head_meta`** and **tacit `C_head_tac`** as candidate further splits. Each gets its own validity argument. Disagreement between channels is then a feature (low convergent validity = different constructs), not noise.

### P6. Fairness / measurement invariance is named once and never structured

- **Location.** L-5 mentions DIF (line 121); H-10 names "fairness boundary" (line 305); Guardrails: `"test whether probes behave differently across roles or groups"` (line 426).
- **Rigor gap.** Measurement invariance is a precise statistical procedure (Vandenberg & Lance 2000; Meredith 1993): **configural** (same factor structure), **metric** (same factor loadings), **scalar** (same intercepts), **strict** (same residuals). Without scalar invariance you cannot compare scores across groups. The discovery proposes comparing people, teams, and the org against a reference surface, but never specifies which groups invariance must hold across (role, seniority, language, domain subarea, time-on-platform). Without this, comparisons are uninterpretable.
- **Suggested patch.** Add explicit invariance-target groups under "Psychometric guardrails": role, seniority, native language, domain familiarity, exposure duration. Name the four invariance levels. Require **configural + metric** before any cross-group comparison appears in product, **scalar** before any cross-group ranking. Add **DIF** (Differential Item Functioning, Holland & Wainer 1993) as the item-level check.

### P7. The "construct map" open question (OQ-18) has the right name but no method

- **Location.** OQ-18: `"What is the first construct map for DomainSpec knowledge? Candidate levels include vocabulary, relation, invariant, application, exception, debugging, extension, and critique."` (line 640)
- **Rigor gap.** A construct map (Wilson 2005, *Constructing Measures*) is an **ordered** continuum of qualitatively distinct levels of the construct, with **item exemplars at each level** and a **scoring rubric that maps responses to levels**. The discovery lists candidate levels but does not (a) commit to their ordering, (b) require that items target specific levels, (c) propose a scoring rubric, or (d) name the validation procedure (Wright maps from Rasch analysis). Without these, "construct map" is just a taxonomy.
- **Suggested patch.** Promote OQ-18 to a working hypothesis H-12: "Knowledge probes will be designed against an ordered construct map with N levels, validated by Rasch analysis producing a Wright map." Import the term **Wright map** explicitly. Reference Wilson 2005 and the BEAR Assessment System.

### P8. Confidence/metacognition is treated as a signal but not as a separate calibration construct

- **Location.** H-9 lists "confidence ratings" (line 277) and "metacognitive knowledge" (line 413); guardrails mention `"detect possible mismatch between confidence and observed performance"` (line 439).
- **Rigor gap.** Confidence calibration is itself a measurement problem with a 50-year literature (Lichtenstein, Fischhoff, Phillips 1982; Brier 1950; Murphy 1973 resolution/reliability decomposition). The discovery treats confidence as one more probe but does not name **Brier score**, **expected calibration error (ECE)**, **reliability diagrams**, or **resolution vs calibration decomposition**. Crucially, "calibration" is being used in two senses in the discovery: (1) the product's overall goal (knowledge calibration across categories) and (2) the psychometric sense (confidence matching accuracy). These will collide.
- **Suggested patch.** Add a sub-paragraph under H-9 distinguishing **confidence calibration** (metacognitive accuracy, scored by Brier/ECE) from the product-level "calibration" of knowledge-to-reference. Import: Brier score, ECE, reliability diagram, resolution. Add OQ-25: "Should `confidence calibration` and `knowledge calibration` share a name in the UI, or will users conflate them?"

### P9. The validation ladder (smoke test → 20–40 participants) underspecifies sample size, power, and effect-size targets

- **Location.** Lines 506–562.
- **Quoted snippets.** `"20-40 participants or sessions in one closed domain"`; `"the calibration signals improve prediction or intervention relative to baselines"`.
- **Rigor gap.** No effect-size target, no power analysis, no pre-registration discipline, no decision-theoretic stopping rule. "Beats baseline" can mean ΔR² of 0.001 if N is large enough. 20–40 participants is underpowered for most psychometric questions (IRT calibration typically wants ≥200; G-theory variance components want ≥30 per facet level; even simple reliability needs N ~50 for stable α SE). The discovery is honest about being a smoke test, but the pass criteria language ("performs better than baselines") will produce false positives.
- **Suggested patch.** Specify (a) target effect size (e.g., "calibration signal must explain ≥10% additional variance beyond raw accuracy baseline, with 80% power to detect"), (b) pre-registration of analysis plan, (c) minimum reliability floor (ω ≥ .7) before any inferential analysis, (d) explicit acknowledgment that 20–40 is exploratory and IRT calibration requires later N ≥ 200. Import: **a priori power analysis**, **pre-registration**, **minimum detectable effect**.

### P10. "Prohibited uses" list is good consequential-validity practice but lacks an enforcement mechanism

- **Location.** Lines 443–451.
- **Rigor gap.** Messick's consequential validity is satisfied not by *listing* prohibited uses but by demonstrating that the score's design *resists* those uses (or that misuse is detectable and correctable). For example, if scores can be exported as CSV or surfaced in dashboards, a "do not use for hiring" line in the docs is necessary but insufficient. The honest psychometric move is to **engineer the score so prohibited uses are technically hard** (e.g., do not produce a single scalar; require workflow context to retrieve; deliberately add interval-scale noise that prevents fine-grained ranking).
- **Suggested patch.** Add a guardrail subsection "Misuse resistance by design" — list mechanisms: no single-scalar export, score-bearing surfaces require workflow context, audit log on every cross-person comparison, deliberate uncertainty bands. Acknowledge this is the *consequential aspect of construct validity* per Messick (1989).

### P11. Cognition–Observation–Interpretation triad from KWSK is cited but not used as a design discipline

- **Location.** L-5 mentions NRC (2001) *Knowing What Students Know* (line 117).
- **Rigor gap.** KWSK's central contribution is the **assessment triangle**: (1) **Cognition** — a model of how knowledge is structured and develops in the learner; (2) **Observation** — tasks designed to elicit evidence of that knowledge; (3) **Interpretation** — a statistical/qualitative model that turns observations into inferences. All three corners must be specified and coherent. The discovery jumps between these corners without acknowledging the triangle. H-9 is mostly an Observation discussion; H-10 is mostly an Interpretation discussion; the Cognition corner (a model of how domain knowledge is structured in a person's head — declarative vs procedural vs conditional, schema theory, expertise reversal, etc.) is barely sketched.
- **Suggested patch.** Add a "Cognition model" subsection before H-9. Even one paragraph naming the candidate cognitive frame (e.g., ACT-R declarative/procedural distinction, or Anderson's adaptive control of thought, or simply "we model domain knowledge as a graph of concepts + rules + exceptions") gives the Observation and Interpretation corners something to be coherent with.

### P12. "Person is wrong vs reference is stale vs probe is ambiguous" is the right trichotomy but it is a Bayesian inference problem

- **Location.** Guardrail: `"distinguish 'person was wrong' from 'reference surface was stale' and 'probe was ambiguous'"` (line 427).
- **Rigor gap.** This is the classical **mixture/source attribution** problem and has a Bayesian solution structure: each divergence has a prior over the three sources, and evidence updates the posterior. The discovery names the trichotomy but does not name the inference structure, the priors, or how evidence (e.g., other respondents' answers, reference surface edit history, probe rephrase tests) updates source attribution. Without this, "distinguish" is wishful.
- **Suggested patch.** Promote this to a working hypothesis. Frame divergence-source attribution as Bayesian model selection over {person, reference, probe}, with evidence including (a) cross-respondent agreement (high agreement against reference → reference stale; high disagreement → probe ambiguous; idiosyncratic divergence → person error), (b) reference edit recency, (c) probe rephrase stability. Cite the canonical reference for source attribution in measurement: linked-item analysis / DIF source decomposition.

## Findings — Geometric/measurement

### G1. "Geometry" is load-bearing rhetorically but unsupported by any defined space, basis, or metric

- **Location.** Title; H-4 (lines 186–200); "First useful product distances" (lines 390–399); OQ-7 (line 629).
- **Quoted snippet.** `"The core frame should be distance/topology rather than quiz accuracy."`
- **Rigor gap.** No space is defined: what is the carrier set of `C_head`? Is it (a) a vector in `R^n` over a fixed basis of concepts/rules, (b) a probability distribution over a discrete answer space, (c) a labeled graph (concept graph with edges = relations), (d) a string/sequence of justifications, or (e) a binary vector over a rubric? Each choice yields a different distance family and different metric properties. Without a space, "distance" is a metaphor. "Topology" is even less defined — the discovery never names open sets, neighborhoods, or continuity.
- **Suggested patch.** Add a subsection under H-4 titled "What kind of space?" listing the candidate carrier types and committing to one for the first experiment. Drop "topology" unless an actual topological structure (e.g., a metric induces it) is intended. Honest minimum: pick **distribution over rubric levels** as the v1 carrier (a categorical distribution), then Jensen–Shannon divergence is the natural distance and it satisfies the metric axioms (the square root does).

### G2. None of the five proposed distances are verified against metric axioms

- **Location.** "First useful product distances" table (lines 392–398).
- **Quoted snippets.** `d(head_i, reference)`, `d(head_i, head_j)`, `d(spec, system)`, `d(group, reference)`, `alignment(group)`.
- **Rigor gap.** The notation `d(·,·)` connotes a metric (non-negativity, identity of indiscernibles, symmetry, triangle inequality). None of the proposed distances is shown to satisfy these. In particular:
  - `d(head_i, reference)` likely violates **symmetry** (the cognitive distance from novice to expert representation is asymmetric — directionally costly to traverse; cf. Tversky 1977 on asymmetric similarity).
  - `d(spec, system)` between an artifact set and a runtime behavior set is naturally **asymmetric** (one is a specification, the other is observation — "spec covers system" and "system satisfies spec" are different).
  - `alignment(group)` is not even pairwise; it is a set/distribution property (variance, entropy, or pairwise mean).
  - Triangle inequality almost certainly fails for any cognitive-similarity measure (well-known result from Tversky).
- **Suggested patch.** Rename the table to "First useful comparisons" and label each entry with its likely class: **metric** (satisfies all four axioms), **pseudometric** (drops identity of indiscernibles), **divergence** (drops symmetry and/or triangle inequality; e.g., KL), **asymmetric similarity** (Tversky). For `alignment(group)`, replace `d(·,·)` notation with a dispersion measure: `var(group)`, `entropy(group)`, or `mean_pairwise(group)`.

### G3. `d(spec, system)` conflates two fundamentally different comparisons

- **Location.** H-4 (line 197); H-2 example `"A spec can be internally consistent but drift from operational reality"` (line 170); G-2 above.
- **Rigor gap.** "Spec drifts from system" can mean (a) **coverage**: there are system behaviors with no spec; (b) **conformance**: there are spec rules the system violates. These are dual quantities (analogous to precision vs recall, or to the two directions of subset inclusion). Collapsing them into a single `d(spec, system)` loses the actionable information — which is precisely what H-11 demands metrics preserve.
- **Suggested patch.** Replace the single entry with two: `coverage(spec → system)` ("fraction of observed system behaviors explained by some spec rule") and `conformance(system → spec)` ("fraction of spec rules the system satisfies"). Both are in [0,1]. Optionally combine via F1-style harmonic mean only as a derived score, never as the primary.

### G4. Stevens' scale types (nominal/ordinal/interval/ratio) are nowhere addressed — yet downstream math depends entirely on them

- **Location.** Throughout the metric discussion. Implicit in OQ-5 (vocabulary candidates) and OQ-8 (learning velocity vs current state).
- **Rigor gap.** The discovery talks about "scores," "distances," "improvements," and "thresholds" without ever asking whether the underlying numbers are **ordinal** (only ranking is meaningful — most knowledge constructs land here), **interval** (differences are meaningful — requires equal-spacing assumption, typically only achieved via Rasch scaling), or **ratio** (zero is meaningful — almost never true for cognitive constructs). Most proposed operations (averaging across people, computing "improvement," declaring "fidelity = 0.87") implicitly assume interval scale, which is unjustified for any of the candidate constructs.
- **Suggested patch.** Add a foundational paragraph: "Scores derived from `C_head` probes default to **ordinal** unless interval scaling is achieved through Rasch / IRT calibration. Operations that require interval (means, differences, parametric tests, distance arithmetic) must be flagged and gated by a scaling-evidence check." Cite Stevens (1946); cite Michell (1999) on the *quantitative imperative* critique to acknowledge the controversy.

### G5. H-11's "useful metric" is operationally specified for *what a metric must do* but the metric itself is never defined

- **Location.** H-11 (lines 309–325).
- **Quoted snippet.** `"DomainSpec should reject any metric, chart, or score that only says 'alignment is high/low'"`.
- **Rigor gap.** H-11 is essentially a use-validity criterion (a metric must produce action), not a definition of a metric. The discovery never gives a candidate scalar or vector. This is acceptable for a discovery, but it should be explicit that H-11 is a **gate** on metric design rather than a hypothesis about a metric.
- **Suggested patch.** Rename H-11 to "Metric admissibility gate" rather than presenting it as a metric hypothesis. Clarify that no metric is proposed yet; H-11 specifies necessary conditions for any future proposal. Add a forward pointer to the metric-validity follow-up discovery the Source Dispatch already names.

### G6. Intra-category consistency for `C_head` has no operational definition (OQ-1 acknowledges this; my finding sharpens it)

- **Location.** OQ-1 (line 622); H-2 (lines 158–173).
- **Quoted snippet.** `"Consistency inside a person cannot be reduced to 'answered similarly twice.' We need a stronger but still practical definition."`
- **Rigor gap.** OQ-1 is honest about the gap but does not enumerate candidate definitions. Candidates with formal grounding: (a) **logical consistency** over a rule set (no contradictions; computable if rules are formalized in propositional logic); (b) **test-retest stability** over a probe set (correlations of responses across two occasions; well-established psychometric quantity); (c) **internal-consistency reliability** (Cronbach α over multiple probes targeting the same construct sub-component); (d) **coherence of the underlying construct map** (no inversions on a Wright map — a respondent above level k passes all items below k); (e) **conditional consistency** (transfer: same rule applied to a novel case yields the same outcome).
- **Suggested patch.** Replace OQ-1 with a typology: intra-category consistency for `C_head` has at least five candidate operationalizations (logical, temporal, internal, hierarchical-Guttman, transferable). The product likely needs more than one. Each maps to different measurement machinery.

### G7. The intra/inter measurement split (H-2) is geometrically equivalent to a metric on a product space — should be made explicit

- **Location.** H-2 (lines 158–173); Working Model "Two classes of measurement" (lines 353–358).
- **Rigor gap.** If `C_head`, `C_spec`, `C_system` are each their own space, then the cross-category geometry lives on the **product space** `C_head × C_spec × C_system`, and "translation" between categories is a function (or relation) between spaces. The natural mathematical object is a **diagram of spaces and morphisms** — exactly the categorical/functorial framing the discovery defers as "FF" (functor / fully faithful). Making this explicit even without committing to categorical machinery would tighten the language.
- **Suggested patch.** Add a paragraph under H-2: "Intra-category consistency is a property of a single space; inter-category consistency is a property of a **morphism between spaces** — a translation map. The two require different machinery: intra needs metrics/coherence checks; inter needs comparison of structure preservation. This is what the deferred 'FF' framing eventually formalizes, but it can be acted on without categorical math via simpler tools: confusion matrices for discrete morphisms, Kendall τ for ordinal preservation, Procrustes analysis for continuous embeddings."

### G8. Inter-rater agreement is missing — critical because LLM-as-judge will be the dominant scoring mechanism

- **Location.** Not addressed. Implicit in the elicitation loop H-3 and the experiment design (lines 510–518).
- **Rigor gap.** Free-text probes (definitions, explanations, justifications) will require either human or LLM scoring. Any LLM scorer is a rater with non-zero error variance. The discovery never proposes an inter-rater design. Standard practice: dual rating with **Cohen's κ** (two raters, nominal), **weighted κ** (ordinal), **ICC** (interval, multiple raters), **Krippendorff's α** (handles missingness, multiple rater counts, multiple scale types). LLM-as-judge specifically requires multi-temperature or multi-prompt rater variance assessment.
- **Suggested patch.** Add a subsection "Rater reliability — the LLM-as-judge problem" under Psychometric guardrails. Require, for any scored open-response probe: (a) ≥2 raters (human or LLM), (b) ICC or κ reported, (c) target ≥0.7 for exploratory, ≥0.8 for any user-facing surface, (d) calibration of LLM raters against human raters on a held-out sample. Cite Krippendorff (2004) for the multi-mode case.

### G9. "Direct vs inferred" is a fine distinction but missing the *latent* axis (observed vs latent), which is the real psychometric divide

- **Location.** "Two evidence channels for `C_head`" table (lines 362–367); "Useful axes for later metric design" (lines 371–377).
- **Rigor gap.** Psychometrics' fundamental move is the **observed–latent distinction**: items (observations) are noisy indicators of an unobservable latent variable; the measurement model (CTT, IRT, factor model) is the mapping. The discovery's "direct vs inferred" axis is closer to **explicit vs implicit measurement** (Greenwald/Banaji IAT literature), which is a different distinction. Both axes are needed.
- **Suggested patch.** Add "observed ↔ latent" as a third orthogonal axis. Direct elicitation can still be observed-only (raw response) or latent (IRT-θ estimate from response); same for inferred. This is what allows behavioral signals from many short interactions to roll up into a single latent estimate per person — without it, every behavioral signal stays as raw count data.

### G10. The categorical "FF" deferral is honest but the discovery should name what is needed *before* category theory

- **Location.** A-5 (lines 605–610); OQ-11 (line 633).
- **Rigor gap.** The discovery defers categorical (functor / fully faithful) framing as too theorem-grade. Fine. But the *intermediate* layer is also unspecified — between "we have intuitive distances" and "we have a categorical theorem program" lies ordinary **measurement theory** (Krantz, Luce, Suppes, Tversky 1971, *Foundations of Measurement*). This layer gives axiomatic conditions for when ordinal/interval/ratio scales exist, when concatenation operations are admissible, and when comparisons are meaningful — without requiring categorical machinery.
- **Suggested patch.** Add a clause to OQ-11: "Before the FF/categorical bridge, DomainSpec should commit to a measurement-theoretic foundation (Krantz, Luce, Suppes, Tversky 1971) sufficient to justify the arithmetic operations it performs on scores. This is a weaker but necessary prerequisite to the categorical program."

### G11. Group-level alignment is geometrically under-specified and likely conflates two different operations

- **Location.** H-4 (`alignment(group)`); H-6 (lines 215–229); OQ-6 (line 628).
- **Rigor gap.** "Alignment" can mean (a) **internal cohesion** (low variance / low entropy of group members' positions in the space) or (b) **shared direction** (group members all biased toward the same point, possibly far from the reference). These can co-occur or trade off, and the open question OQ-6 ("how do we aggregate from person-level distances to company-level knowledge?") flags the issue but does not resolve it. Standard tools: **inter-rater agreement** (κ family for nominal/ordinal), **ICC** for continuous, **distribution-level divergence** (JS divergence between group distribution and reference distribution).
- **Suggested patch.** Decompose `alignment(group)` into two quantities: `cohesion(group)` = within-group dispersion (variance/entropy), and `bias(group, reference)` = mean distance of group from reference. The H-6 phrases "high expertise / low alignment" and "low expertise / high alignment" then naturally become four quadrants on (cohesion, bias) rather than one collapsed scalar.

### G12. The proposed distances assume comparability without a shared scale — but `C_head`, `C_spec`, `C_system` live in different ontological types

- **Location.** All cross-category distances in H-4 and the distances table.
- **Rigor gap.** `C_head` is (per H-1) declarative + procedural knowledge in a mind. `C_spec` is structured text + ontology + rules. `C_system` is executable code + runtime traces. These have no shared carrier. To compute `d(head, system)` you must project all three into a common space — typically a shared **concept/claim layer** where each category's content has been canonicalized. The discovery never names this projection layer, yet every cross-category distance requires it.
- **Suggested patch.** Add a working hypothesis H-13: "Cross-category comparison requires a **canonical claim layer** into which `C_head`, `C_spec`, `C_system` are projected. Distances are computed on the claim layer, not directly between heterogeneous sources." Candidates for the claim layer: (a) a fixed rubric of testable assertions, (b) a derived concept/relation graph, (c) the IRT-θ score on a shared item set. Without committing to one, all cross-category distances are notional.

### G13. The "longitudinal" axis is named but improvement-over-time has a known confound with learning that the discovery does not acknowledge

- **Location.** "point-in-time ↔ longitudinal" axis (line 376); OQ-8 (line 630).
- **Rigor gap.** Measuring "improvement" in a person's `C_head` over time confounds (a) true learning, (b) test-retest practice effects (familiarity with the probe format), (c) shifts in the reference surface itself (if reference updates, person-to-reference distance can shrink without person changing), (d) regression to the mean. Standard mitigations: **counterbalanced parallel forms**, **delayed retest**, **reference-version pinning** for trajectory analysis.
- **Suggested patch.** Add a paragraph under "Two evidence channels": longitudinal scoring requires (a) parallel-form item banks so the same person never sees the same probe twice within the test-retest window, (b) reference-version pinning so trajectory is measured against a fixed reference, (c) explicit modeling of practice effects via a latent growth curve with a practice term.

### G14. The smoke-test "classify each divergence by likely source" step is the *crux* and is the least specified

- **Location.** Lines 515–518.
- **Quoted snippet.** `"classify each divergence by likely source: head, spec, system, stale reference, ambiguous probe, or unresolved"`.
- **Rigor gap.** This is the **scoring inference** in Kane's framework (per P2) — the most epistemically dangerous step, where a single observation gets attributed to one of six causes. With no inter-rater design, no Bayesian source-attribution model (per P12), no calibration set, this classification will be performed by a single rater (likely an LLM) with no validation. The whole smoke test's interpretability rests on this step being trustworthy.
- **Suggested patch.** Require for the smoke test: (a) **two independent raters** classify each divergence, (b) report agreement (κ), (c) any item with rater disagreement gets a third arbitration, (d) pre-register the classification rubric, (e) publish the rubric and the agreement statistics alongside any result.

## Glossary of imported terms

| Term | One-line definition | Source |
|------|---------------------|--------|
| **Construct map** | Ordered continuum of qualitatively distinct construct levels, with item exemplars and scoring rubric per level. | Wilson, *Constructing Measures* (2005) |
| **Interpretation/Use Argument (IUA)** | Explicit inferential chain (scoring → generalization → extrapolation → implication) with warrants and threats at each link. | Kane (2013) |
| **Consequential validity** | Validity aspect concerning the social consequences of score use; misuse is a validity threat. | Messick (1989, 1995) |
| **Evidence-Centered Design (ECD)** | Assessment design framework with Student / Evidence / Task / Assembly / Presentation models. | Mislevy, Almond, Steinberg (2003) |
| **Student Model** | The latent variables (constructs) being measured. | ECD |
| **Evidence Model** | Splits into evaluation rules (score one observation) + measurement model (combine observations into scores). | ECD |
| **Task Model** | The class of situations that elicit scorable observations. | ECD |
| **Assessment triangle** | Cognition–Observation–Interpretation triad; all three corners must be coherent. | NRC (2001), *Knowing What Students Know* |
| **Generalizability theory (G-theory)** | Variance-decomposition framework for heterogeneous error sources (rater, task, occasion). | Cronbach et al. (1972) |
| **Measurement invariance** | Statistical equivalence of measurement model across groups: configural / metric / scalar / strict. | Vandenberg & Lance (2000); Meredith (1993) |
| **DIF (Differential Item Functioning)** | Item-level test of whether respondents at the same latent level answer differently across groups. | Holland & Wainer (1993) |
| **Brier score / ECE** | Scoring rules for confidence calibration: mean squared error between probability and outcome / expected calibration error. | Brier (1950); Naeini et al. (2015) |
| **Reliability diagram** | Plot of predicted probability vs observed frequency, for confidence calibration assessment. | Murphy (1973) |
| **Wright map** | Joint plot of person abilities and item difficulties on a shared logit scale, from Rasch analysis. | Wright & Stone (1979) |
| **IRT / Rasch model** | Item Response Theory: probabilistic models mapping latent ability θ to item response probabilities. | Lord & Novick (1968); Rasch (1960) |
| **Cohen's κ / Krippendorff's α / ICC** | Inter-rater agreement statistics for nominal, mixed, and continuous data respectively. | Cohen (1960); Krippendorff (2004); Shrout & Fleiss (1979) |
| **McDonald's ω** | Reliability coefficient superior to Cronbach α when tau-equivalence is violated. | McDonald (1999) |
| **Stevens' scale types** | Nominal / ordinal / interval / ratio — gates which arithmetic operations are admissible. | Stevens (1946) |
| **Foundations of measurement** | Axiomatic conditions for the existence of ordinal / interval / extensive scales. | Krantz, Luce, Suppes, Tversky (1971) |
| **Tversky asymmetric similarity** | Cognitive similarity violates symmetry and triangle inequality; not a metric. | Tversky (1977) |
| **Pseudometric / divergence / asymmetric similarity** | Weakenings of the metric axioms; honest labels for distance-like quantities that are not metrics. | metric-space theory |
| **Jensen–Shannon divergence (√JSD)** | Symmetric, bounded divergence between distributions; its square root is a true metric. | Endres & Schindelin (2003) |
| **Cognitive Diagnosis Models (DINA / G-DINA / LCDM)** | Latent-class models for discrete knowledge-state inference, as opposed to continuous IRT. | Rupp, Templin, Henson (2010) |
| **Procrustes analysis** | Optimal rotation/scaling to compare two configurations in shared embedding space. | Gower (1975) |
| **Practice effect / parallel forms / latent growth curve** | Tools for valid longitudinal measurement under repeated testing. | classical test theory |
| **Pre-registration / a priori power analysis** | Disciplines for preventing post-hoc validity inflation. | Open Science Framework conventions |

## What I did NOT cover

- **Hypothesis-by-hypothesis coherence and internal contradictions across H-1..H-11** — covered by the hypotheses-model axis (sibling lens).
- **Adversarial vs constructive framing of claims** — covered by the adversarial-constructive axis (sibling lens).
- **Evidence-citation tightness and provenance of each L-1..L-5 claim** — covered by the coherence-evidence axis (sibling lens).
- **Product/UX critique of the calibration queue, conceptual diff, drift timeline** — only commented when relevant to measurement rigor.
- **Categorical (FF / functorial) framing** — flagged as deferred per discovery's own framing; my G10 only notes the measurement-theoretic layer that should sit underneath.
- **Vault graph / connections semantics** — out of scope for measurement rigor.
- **Cost analysis** (computational, human-rating, infrastructure) of running the proposed psychometric machinery — flagged for future spec work.
- **Specific ethical/regulatory frameworks** (GDPR, EEOC, etc.) beyond the consequential-validity layer.

## Connections

- Refines: [[knowledge-calibration-geometry/discovery]] — Parent discovery v0.4.0. This lens stress-tests its psychometric and geometric/measurement rigor.
- Sibling lenses: [[axis-adversarial-constructive]], [[axis-coherence-evidence]], [[axis-hypotheses-model]].
