---
tags: [subagents, dispatch-artifact, interviewer, entropy-reduction, active-inference, bayesian-experimental-design]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-28
name: interviewer-entropy-reduction-research
---

# Subagents-Research — `2026-05-28-interviewer-entropy-reduction-1`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Dispatch metadata

- **dispatch_id:** `2026-05-28-interviewer-entropy-reduction-1`
- **spec path:** `vault/snapshots/dispatches/2026-05-28-interviewer-entropy-reduction-1-spec.yaml`
- **spec_hash:** `1c83ade5d0019c54047e24db8953ede18bb6c59f1417510ab2898e556b85a50d`
- **corpus_hash_at_emit:** `58af094d89ce121cade1dac1459e32f63481967e2bcda7ae8ff046e2d12eccbf`
- **mode:** task-fan-out (`flat-fanout`)
- **agents:** `L1-A1-vault-theorem` (Explore), `L1-A2-external-literature` (general-purpose)
- **tension axis:** corpus (vault interno vs literatura externa) × methodology (mapeamento normativo vs revisão empírica)

---

## Context

> Where the need for this dispatch arose: the situation, the upstream artifact or conversation, the question that surfaced. Required by R23.

Usuário avaliou `/Users/victorboscaro/domainspec/.claude/agents/domainspec-interviewer.agent.md` e considera que está OK, mas não suficientemente intencional ao perguntar. Quer cada pergunta escolhida para reduzir entropia do domínio (maximizar information gain sobre o espaço de hipóteses do projeto). Heurísticas atuais ("focused questions", "discriminating questions") não têm critério formal. Próximo passo após esta research: escrever uma discovery propondo o redesign do interviewer com fundamento teórico + literatura.

## Goal

> What this dispatch is trying to achieve. Stated concretely enough that Coverage (R21) can be evaluated against it. Required by R23.

Produzir base teórica (vault interno) + base de literatura (externa) que subsidie a discovery de redesign do `domainspec-interviewer` como agente intencional de redução de entropia sobre o espaço de hipóteses do domínio.

---

## Agent 1 — L1-A1-vault-theorem (Explore, corpus: internal vault)

```
# L1-A1-vault-theorem return

## Relevant vault nodes (path + 1-line)

- `vault/axiom/domainspec-axioms.md` — **AX-DS-4: Decision space is preserved with the decision** — stores rejected alternatives and reasoning; entropy gain through explicit question-asking (`EVPI` formalism).
- `vault/axiom/domainspec-axioms.md` § A.4 — Mathematical foundation: `EVPI(re-decide at t' | (A_t, D_t, R_t))  <  EVPI(re-decide at t' | D_t)`; unregistered unknowns reduce perceived entropy below reality.
- `vault/axiom/ontology-axioms.md` § AX-ONT-1 — **Minimize retrieval entropy**: every label/rule reduces `H(D | Q)` multiplicatively via orthogonal partitioning; foundational to vault classification.
- `vault/axiom/ontology-axioms.md` § AX-ONT-5 — **Explicit questions increase system information**: registering unknowns transforms unknown-unknowns into known-unknowns, making `H_perceived → H_real`; referenced by Lindley (1956, EVPI) and Jaynes (1957, max-entropy principle).
- `vault/axiom/ontology-axioms.md` § AX-ONT-4 — **Implicit knowledge is lost knowledge**: what is not explicitly encoded has `H = 0` in the channel; companion to AX-ONT-5.
- `vault/discovery/knowledge-calibration-geometry/discovery.md` — **H-3: Bidirectional question-play is the first operational observation mechanism**; `system → person` probes `C_head`, `person → system` tests answerability; game-shaped, not decoration.
- `vault/discovery/knowledge-calibration-geometry/discovery.md` § OQ-9 — **Which question types are structural?** Distinction, reconstruction, exception, analogy, justification, prediction likely contribute differently; no unified weighting rule exists.
- `vault/discovery/knowledge-calibration-geometry/discovery.md` § OQ-17 — **Combining evidence types**: declared, operational, metacognitive, and tacit evidence may disagree; disagreement itself is product-relevant but unformalized.
- `vault/discovery/knowledge-calibration-geometry/discovery.md` § H-9 — **Two evidence channels for `C_head`**: direct elicitation (declares knowledge) and inferred behavioral evidence (applies/revises knowledge); each channel has distinct validity threats and confidence profiles.
- `vault/discovery/questions-game/README.md` — **Parent discovery framing**: establishes substrate (`C_head`/`C_spec`/`C_system` frame, probe taxonomy, evidence schema); each use-case (individual-fidelity, abstraction-level, learning-velocity, alignment, answerability) has distinct game format.
- `vault/discovery/adaptive-formalization-curve/README.md` — **Uncertainty-investment curve**: inflection point (when cost of non-formalizing > cost of formalizing) is governance principle for schema creation; operates across discovery/formalization lifecycle.
- `vault/discovery/formal-definitions-layer/discovery.md` — **Reference surface fragmentation**: ~90 definition surfaces across vault/domain/code, no canonical reconciliation rule; calibration (H-8 of knowledge-calibration-geometry) depends on stable reference.
- `vault/.claude/skills/domainspec-interview-kits/SKILL.md` — **High-discrimination questions**: objective explicitly states "generate high-discrimination questions from evidence"; mode system applies different formation strategies (grill, readiness, audit-gap, robot-talks).
- `vault/.claude/skills/domainspec-interview-kits/MODE-REGISTRY.md` — **Mode-specific formation**: `grill-with-docs` generates "discriminating decision questions from contract mismatches"; `robot-talks-grill-synthesis` runs "perspective tensions first, then ask one highest-value grill question"; no formal criterion for which question to ask next.
- `vault/constitution/research-constitution.md` — **Anti-bias vector composition (R9–R11)**: four canonical roles (explorer, skeptic, writer, auditor) deliberately tensioned around shared macro-goal; guards against monoculture in research dispatch; cites Hong & Page (2004) on diversity trumping ability under shared anchor.
- `vault/.claude/agents/domainspec-interviewer.agent.md` § execution step 6 — **Current interviewer doctrine**: "Prefer discriminating questions: 'What changes if this fails?' is better than 'Tell me more.'" — no formalism, only intuition.

---

## What the DomainSpec framework ALREADY assumes about entropy reduction in interview

1. **Explicit questions are epistemic infrastructure** — AX-ONT-5 asserts that registering a question transforms `H_perceived < H_real` into calibrated uncertainty. The interviewer inherits this: asking questions in-context is not luxury but necessary for the system to even *know* what it doesn't know. (`vault/axiom/ontology-axioms.md` AX-ONT-5)

2. **Decision-space preservation is non-negotiable** — AX-DS-4 commits DomainSpec to storing not only chosen alternatives but also rejected branches and reasoning. By proxy, the interviewer's job is partly to *surface* the decision space before closure, making implicit options explicit. EVPI formalism shows that unregistered branches increase the cost of future re-decision. (`vault/axiom/domainspec-axioms.md` AX-DS-4)

3. **Discrimination between evidence types is load-bearing** — Knowledge-calibration-geometry H-9 separates declared knowledge (what people say) from operational knowledge (what they apply) and both from metacognitive knowledge (what they know about their uncertainty). The interviewer is implicitly using this frame when asking follow-ups to "I don't know" — the person may not declare knowledge but may demonstrate competence. (`vault/discovery/knowledge-calibration-geometry/discovery.md` H-9)

4. **Game structure is the observation mechanism** — The framework does not treat questions as incidental to discovery. H-3 of knowledge-calibration-geometry asserts that bidirectional question-play (`system → person` and `person → system`) is the *only* practical way to observe `C_head` and test answerability of `C_spec`/`C_system`. Questioning is infrastructure, not interrogation. (`vault/discovery/knowledge-calibration-geometry/discovery.md` H-3, questions-game/README.md)

5. **Multiple question types serve different functions, but no weighting rule exists** — The framework names seven structural question types (definition, distinction, exception, justification, transfer, prediction, analogy implied) in OQ-9 of knowledge-calibration-geometry but explicitly leaves unresolved whether they contribute equally to inference or should be weighted differently by consequence. Current interviewer practice is silent on this. (`vault/discovery/knowledge-calibration-geometry/discovery.md` OQ-9)

---

## Notable gaps / open questions in the vault on this topic

- **No formal criterion for question selection exists** — The interviewer cites intuition ("prefer discriminating questions"), and the mode registry names the *intent* (grill = interrogation, audit-gap = contradiction-finding) but neither specifies a decision rule for *which question to ask next* given evidence seen so far. This is the core entropy-reduction gap.

- **"Discrimination" is named but not formalized** — The MODE-REGISTRY calls for "discriminating decision questions," and the interviewer agent prefers them, but no information-theoretic definition (e.g., mutual information with decision outcome, reduction in conditional entropy of hypothesis space) exists. Discrimination is currently a virtue described in English only.

- **Reference-surface fragmentation breaks calibration** — The formal-definitions-layer discovery documents ~90 definition surfaces across vault/domain/code with no canonical reconciliation. Knowledge-calibration-geometry H-8 asserts that calibration needs a stable reference surface. The interviewer operates in this fragmentation without guidance on which surface is the authority when they conflict.

- **No formalization of evidence combination rules** — OQ-17 of knowledge-calibration-geometry asks how declared, operational, metacognitive, and tacit evidence should be combined when they disagree. The interviewer observes these channels implicitly (e.g., when asking "but could you do it?" after "I don't know the definition") but has no formal rule for weighting or resolving conflicts.

- **No adaptive question-sequencing strategy** — The knowledge-calibration-geometry and questions-game discoveries establish that different use-cases require different game formats, but they do not specify an adaptive strategy for question sequencing *within* a single use-case. The interviewer currently operates one-question-at-a-time with no lookahead about what evidence would be most valuable next.

- **The multi-perspective tension mechanism (Robot-Talks) is not formalized** — The research constitution (R9–R11) introduces "anti-bias vector composition" with four roles deliberately tensioned to avoid monoculture, citing Hong & Page (2004). But how the four perspectives translate into a *single* discriminating question is not specified. Tension-to-question reduction is currently a manual craft step.

- **Construct validity for person-level inference is deferred** — Knowledge-calibration-geometry H-10 asserts that any score about a person's knowledge needs a psychometric validity argument (construct definition, evidence, inference warrant, intended use, fairness checks). But the interviewer produces no explicit scores — only questions and decision artifacts. The gap is whether interview outputs (answers, patterns, meta-answers) even *support* later scoring without foundational validity work.

---

## Honesty notes

- `domainspec-theorem` does **not** exist as a vault node. The term appears only in references to the sibling repo `domainspec-theorem` (which exists outside this vault). No internal theorem axiom or discovery is filed.

- **Interviewer-entropy-reduction** is a newly created discovery folder (2026-05-28) with only a `research/` subdirectory; no discovery.md file exists yet. The parent strategist created this dispatch *precisely because* the entropy-reduction assumption is not yet formal.

- The **axioms AX-DS-4 and AX-ONT-5 are the closest the vault gets** to formalizing entropy-reduction intent. They are referenced in the brief but are both about *preserving* information (decision spaces, explicit questions), not about *selecting* questions to maximize information gain. The move from "preserve unknowns" to "ask the question that maximizes information gain" is not yet a vault commitment.

- **AX-DS-2 (one vocabulary) is orthogonal but load-bearing** — It ensures that terminology itself doesn't drift and that naming is a natural transformation across spec/code. This preserves "operator-term semantics," which is a form of entropy preservation, but is not itself an entropy-reduction strategy for interviewing.

- The current interviewer agent (`domainspec-interviewer.agent.md`) is descriptive and operational, not normative. It lists heuristics ("Prefer discriminating questions") but has no formal anchor. This is acknowledged in the parent context: they want the interviewer to be "intentional enough when forming questions" with an entropy-reduction criterion, which it currently lacks.
```

---

## Agent 2 — L1-A2-external-literature (general-purpose, corpus: external papers/web)

```
# L1-A2-external-literature return

## Ranked strands (5–8)

### 1. Information-theoretic active learning / Bayesian Experimental Design (BED) — applicability: **HIGH** because it is the canonical formalization of "pick the question that maximally reduces entropy over the hypothesis space," which is exactly the user's goal.
- **Principle:** Choose the experiment (question) whose expected outcome maximally reduces uncertainty about the latent parameter (hypothesis). Lindley (1956) framed this as expected Kullback–Leibler divergence from prior to posterior, equivalent to mutual information `I(h; a | q)`.
- **Operationalization:**
  `q* = argmax_q  E_{a ~ p(a | q, h), h ~ p(h)} [ H(p(h)) − H(p(h | q, a)) ]`
  Inputs: hypothesis variable `h` (the latent domain model), candidate question set `Q`, predictive model `p(a | q, h)` (what would the operator answer if hypothesis `h` were true?), prior `p(h)`. Output: the question with maximum expected posterior entropy reduction (i.e., maximum mutual information). Standard variational/MC lower bounds (NMC, VNMC, INMIS — Foster et al. 2019; Ivanova et al. 2021) are used when the integrals are intractable.
- **Critique for open-domain interview:** All three required pieces are problematic for a domain interview. (a) `h` lives in an *open, unenumerable* hypothesis space — domain models are compositional, not drawn from a finite categorical. (b) `p(a | q, h)` requires a forward simulator of operator answers, which the LLM would have to fabricate. (c) Posteriors over natural-language hypotheses don't have a closed form; you need an LLM-as-Bayesian-updater, which is itself unreliable. MacKay (1992) explicitly warned that all these criteria *"depend on the assumption that the hypothesis space is correct, which may prove to be their main weakness"* — that warning lands hardest in our setting.
- **Key refs:** Lindley 1956 (Ann. Math. Stat.) [abstract only]; MacKay 1992 (Neural Computation 4:4) [abstract only]; Foster et al. 2019, 2020; Ivanova "BOED intro" 2022 blog; Rainforth et al. "Modern Bayesian Experimental Design" arXiv:2302.14545 (skimmed).

### 2. LLM-driven adaptive interviewing with EIG / BED rewards (2024–2025) — applicability: **HIGH** because this strand is literally other groups solving our problem, with empirically-validated approximations of strand 1.
- **Principle:** Treat the LLM as both the questioner and an approximate Bayesian updater over latent task specifications. Score candidate clarifying questions by expected information gain over a *belief distribution that the LLM itself maintains* (sampled hypotheses, not a closed-form prior).
- **Operationalization:**
  1. Sample `K` candidate hypotheses `h_1..h_K ~ q_LLM(h | context)` (e.g., K=10 candidate domain models).
  2. For each candidate question `q_j`, simulate `p(a | q_j, h_k)` by prompting the LLM as each hypothetical operator.
  3. Estimate `EIG(q_j) ≈ H(p̂(h)) − E_a [ H(p̂(h | q_j, a)) ]` where `p̂` is the empirical distribution over the K samples re-weighted by simulated answer likelihood.
  4. Pick `argmax_j EIG(q_j)`. (This is the "Uncertainty of Thoughts" / "Active Task Disambiguation" / InfoPO recipe.)
- **Critique for open-domain interview:** The Monte Carlo belief over K sampled hypotheses is only as good as the LLM's hypothesis-sampling diversity — and LLMs are mode-collapsed. If the true domain isn't in the sampled set, EIG is meaningless (it optimizes for distinguishing hypotheses the model already considered). Also, the simulated answer step assumes the LLM can role-play the operator faithfully, which is exactly the "operator vocabulary is uncertain" failure mode the user flagged.
- **Key refs:** Hu et al. "Uncertainty of Thoughts" NeurIPS 2024 (arXiv:2402.03271, skimmed); "Active Task Disambiguation with LLMs" arXiv:2502.04485 (skimmed); Andukuri et al. "Learning to Ask Informative Questions … with Preference Optimization and EIG" arXiv:2406.17453 (skimmed); LLMREI (Görer & Aydemir, RE 2025, arXiv:2507.02564) — automated requirements-elicitation chatbot, evaluates *adaptive context-dependent questioning* in 33 simulated stakeholder interviews [abstract only]; ReqElicitGym 2026 [abstract only]; "Asking the Right Question at the Right Time" arXiv:2402.06509 — finds model-uncertainty signal *does not* mirror human clarification-seeking behaviour, a key warning.

### 3. Twenty Questions / splitting-game framing — applicability: **HIGH** as the *intuition pump* and as a sanity check on strand 1, but **LOW** as a literal mechanism for open-domain interviews.
- **Principle:** Optimal questioning over a finite hypothesis distribution `π` is a Huffman-style code: each question should split posterior mass as close to 50/50 as possible; expected number of questions is bounded by `H(π) + 1` (Shannon source-coding).
- **Operationalization:**
  Decision rule: among candidate yes/no questions `q_j`, pick `argmin_j |E_a[ p(a=yes | q_j) ] − 0.5|` — i.e., the question whose predicted answer entropy is closest to 1 bit. Generalises to k-ary answers by maximising the entropy of the answer distribution `H(A | q_j)`, which (for a uniform-over-h prior) is equivalent to EIG.
- **Critique for open-domain interview:** Domain interviews don't have yes/no answers, the hypothesis space isn't finite, and the "balanced split" heuristic degenerates when answers are free text. Useful as a *teaching analogy* and as a degenerate-case check ("for the binary sub-questions, are we 50/50?"), not as the core algorithm. The Dagan/Filmus/Gabizon/Moran *Twenty (simple) Questions* line (STOC 2017, arXiv:1611.01655) shows even restricting to "simple" question classes preserves `H(π)+O(1)` optimality — relevant if we constrain our question vocabulary.
- **Key refs:** Cover & Thomas *Elements of Information Theory* ch. 5; Dagan, Filmus, Gabizon, Moran "Twenty (simple) questions" STOC 2017, arXiv:1611.01655 (skimmed).

### 4. Active inference / expected free energy (Friston) — applicability: **MEDIUM** because it generalizes EIG by *combining* epistemic and pragmatic value, which matches the interview goal: not only "reduce uncertainty" but also "reach a usable domain spec."
- **Principle:** Agents act to minimize *expected free energy* `G(π)`, which decomposes into a **pragmatic** term (expected divergence from preferred outcomes) and an **epistemic** term (expected information gain about hidden states, formally mutual information). Pure curiosity (EIG-only) is recovered when the pragmatic term is zero.
- **Operationalization:**
  `q* = argmin_q  G(q) = argmin_q  [ E[− log p(a | C)]  −  E_{h,a}[ log p(h | q, a) − log p(h) ] ]`
  where `C` encodes the operator's *preferred* interview outcomes (e.g., "domain spec reaches sufficient completeness in ≤ N turns"). The second term is exactly EIG; the first term is a "goal" prior that prevents the interviewer from chasing entropy in irrelevant corners of the hypothesis space.
- **Critique for open-domain interview:** The pragmatic term requires specifying `p(a | C)` — what answers we *want* — which is itself a domain-modelling task. In practice EFE collapses to "EIG with a hand-tuned cost penalty," and the active-inference literature has very little published on natural-language dialogue (the cited papers are mostly perception/action). It's a clean theoretical frame for saying "don't just maximize entropy reduction; trade it off against task-completion utility," which is exactly the right framing — but the operational gain over weighted-EIG-with-cost is modest.
- **Key refs:** Friston et al. "Active inference and epistemic value" *Cogn. Neurosci.* 2015 (skimmed); Friston et al. "Active inference: a process theory" *Neural Computation* 2017 (skimmed); Parr & Friston "Generalised free energy and active inference" *Biol. Cybern.* 2019 (skimmed). No strong dialogue-applied paper found in this search — flag this as a gap.

### 5. Decision-analytic interviewing / value-focused thinking (Keeney, Phillips, Howard) — applicability: **MEDIUM** as a *protocol* layer that complements, not replaces, EIG.
- **Principle:** Start interviews by eliciting *fundamental objectives* (values), not alternatives. Structure questions to surface (a) what the decision-maker cares about and (b) decision opportunities they have not yet articulated. Keeney's "wish list" and "why-is-that-important" laddering are the canonical question patterns.
- **Operationalization:** Decision rule with named inputs.
  Inputs: current set of elicited objectives `O`, current set of identified alternatives `A`.
  Routine:
    - if `|O| < threshold_o`: ask a wish-list question ("If you could have anything from this system, what would it be?").
    - else if any objective in `O` is *means-level* (instrumental): ask "Why is that important?" (laddering up to fundamental).
    - else if `|A|` low relative to `|O|`: ask "Given objective `o_i`, what alternatives can achieve it?"
  This is a *question-class scheduler*, not an EIG maximizer.
- **Critique for open-domain interview:** No probabilistic foundation — the rules are heuristics validated by decades of decision-conferencing practice but not formally entropy-reducing. They will *miss* questions that are highly diagnostic about a domain hypothesis because they prioritize value structure over hypothesis disambiguation. Best treated as a **question-class prior** that constrains the candidate set `Q` over which EIG is then maximized.
- **Key refs:** Keeney *Value-Focused Thinking* (Harvard 1992); Keeney "Value-focused thinking: identifying decision opportunities and creating alternatives" *EJOR* 1996 (skimmed); Phillips "Decision conferencing" LSE working papers; recent applied example: Krones et al. *PLOS ONE* 2024 (PMC11295223) — VFT interviews with oncologic inpatients [skimmed].

### 6. Cognitive interviewing (Willis, Loftus) — applicability: **MEDIUM** as a *question-quality* checklist, **LOW** as a question-selection criterion.
- **Principle:** Detect and repair problems in survey/interview questions through targeted probing — focusing on comprehension, recall, judgment, and response mapping. Goal is to make the *meaning* of a question unambiguous to the respondent before measuring its answer.
- **Operationalization:**
  Per question `q`, run probes from a fixed taxonomy:
    1. Comprehension probe: "What does [term] mean to you?"
    2. Paraphrase probe: "Can you say that back in your own words?"
    3. Specificity probe: "Can you give me a concrete example?"
    4. Confidence probe: "How sure are you about that?"
  Decision rule: after each operator answer, run *at least one* probe if the answer contains a term whose denotation is uncertain in our running domain glossary.
- **Critique for open-domain interview:** This is about cleaning the *signal* (reducing noise in `p(a | q, h)`), not about choosing which `q` to ask. It is *necessary* — without it, EIG estimates are garbage because the answer-channel is too noisy — but it's a noise-reduction layer, not the selection algorithm. Treat as a mandatory preprocessing/post-processing layer wrapped around the EIG question selector.
- **Key refs:** Willis, *Cognitive Interviewing: A "How To" Guide* (NCI, available via UCLA CHIME) — skimmed PDF; Tourangeau, Rips, & Rasinski *The Psychology of Survey Response* 2000 [name-only reference].

### 7. Socratic method as contradiction-seeking — applicability: **MEDIUM-LOW** as a *complementary attack pattern* when EIG plateaus.
- **Principle:** Elenchus — surface and challenge implicit assumptions to reveal contradictions, which then force the respondent to refine their belief. Not entropy-reducing in the Shannon sense; rather, it changes the hypothesis *space itself* by exposing that the operator's stated model is internally inconsistent.
- **Operationalization:**
  Decision rule: maintain a running list of operator assertions `S = {s_1, …, s_n}`. At each turn, check pairwise consistency (LLM-based entailment check). If `∃ (s_i, s_j)` such that `s_i ∧ s_j` is judged contradictory or strongly tensioned, ask a question that *forces* the operator to reconcile (e.g., "Earlier you said X; now you're describing Y. How do these fit together?"). Otherwise fall back to EIG.
- **Critique for open-domain interview:** No formal information-theoretic guarantee; works only when (a) the LLM's entailment-check is reliable and (b) the operator's earlier statements actually contain latent contradictions. In greenfield interviews early on, `|S|` is too small for this to fire. Useful as a *late-stage* mode once enough premises have been gathered. Princeton's "SocraticAI" (2024) and "Closing the Expression Gap in LLM Instructions via Socratic Questioning" (arXiv:2510.27410) show LLMs can be fine-tuned to do this — it works empirically but isn't a principled selection criterion.
- **Key refs:** Princeton NLP "SocraticAI" 2024 blog post [skimmed]; "Closing the Expression Gap … via Socratic Questioning" arXiv:2510.27410 [abstract only]; "Wisdom of the Crowd, Without the Crowd: A Socratic LLM" CSCW 2025 [abstract only].

## Cross-strand synthesis (3–5 bullets)

- **Convergent core formula:** strands 1, 2, 3 (in its 50/50 limit), and 4 (epistemic component only) all reduce to the *same* selection rule: `q* = argmax E[H(prior) − H(posterior | q, a)]`. This is the load-bearing equation. Differences are entirely about how the prior, the answer-likelihood, and the posterior are *represented* (closed-form, particle, sampled-from-LLM).
- **The hard part is not the criterion — it's the belief representation.** For an open-domain interview, the bottleneck is maintaining a usable `p(h)` over an unenumerable hypothesis space. Strand 2 (LLM-sampled particles) is the only practically tractable answer found in the literature, and it inherits the LLM's mode collapse problem.
- **Pragmatic vs epistemic trade-off is real.** Strand 4 (active inference) and strand 5 (VFT) both push back on pure entropy-maximization: a maximally-entropy-reducing question may be irrelevant to producing a usable spec. The redesign needs a cost/goal term, not just EIG.
- **Noise on the answer channel is a first-class concern.** Strand 6 (cognitive interviewing) is the only strand that takes seriously that `p(a | q, h)` is corrupted by respondent comprehension errors. Any EIG implementation that doesn't include comprehension probes is computing EIG over a noisy proxy and will mis-rank questions.
- **Question-class structure helps with the search.** Strand 5 (VFT laddering) and strand 7 (Socratic contradiction-seeking) are usefully read as *priors over the candidate question set* `Q`. Rather than letting the LLM generate arbitrary questions and EIG-scoring them, restrict `Q` to a typed taxonomy (wish-list, laddering, contradiction-probe, comprehension-probe, hypothesis-discriminating) and then EIG-rank within each class.

## What is MISSING from the literature for our use case

- **Open, growing hypothesis spaces.** All formal treatments (Lindley, MacKay, Friston) assume a *fixed* hypothesis space. Domain modelling is *compositional* — new entities and relations get added as the interview proceeds. No paper found addresses EIG over a hypothesis space that the interviewer is simultaneously *constructing*.
- **Free-text answer channels.** EIG estimators assume tractable `p(a | q, h)`. For natural-language answers this becomes an LLM call, and the calibration of LLM-as-likelihood is poorly characterized. The 2024 paper "Asking the Right Question at the Right Time" (arXiv:2402.06509) explicitly finds LLM uncertainty doesn't match human clarification-seeking — a red flag for naive EIG.
- **No "vocabulary uncertainty" treatment.** None of the strands address that the *operator's terms* themselves carry latent semantic uncertainty — e.g., "remessa" might mean three different things to three operators in the same domain. Cognitive interviewing (strand 6) is the closest, but it treats vocabulary as noise to clean, not as a separate latent variable to infer.
- **No stopping rule grounded in posterior collapse.** When is the interview *done*? Literature on BOED has stopping rules based on posterior variance falling below a threshold, but for open-domain interviews where the hypothesis space is unbounded, no analogous criterion exists.
- **Greenfield vs brownfield asymmetry.** Brownfield interviews have an extra information source (the existing code/docs) that should serve as a strong prior. None of the surveyed work models the interview as Bayesian updating *starting from a code-derived prior*.

## Honesty notes

- I have **not read full PDFs** for any of the foundational papers (Lindley 1956, MacKay 1992, Friston 2015/2017, Keeney 1992/1996). I worked from abstracts, secondary summaries, and the BibSonomy/Semantic Scholar/PMC summary pages returned by search. The formulae I gave are the standard textbook versions, not direct quotes.
- The 2024–2025 LLM papers (Uncertainty of Thoughts, Active Task Disambiguation, InfoPO, LLMREI, Learning to Ask Informative Questions, ReqElicitGym) — I have abstract-level confidence only. Some (e.g., InfoPO arXiv:2603.00656, ReqElicitGym arXiv:2602.18306) have future-dated arXiv IDs that look suspicious — I'm flagging them as "[abstract only, ID may not exist]" — strategist should verify before paste.
- The Princeton "SocraticAI" page is a blog post, not a peer-reviewed paper. Cited as a pointer, not as authority.
- I found **no strong active-inference paper applied to natural-language dialogue / interviewing**. The Friston citations are perception/action papers. If a dialogue-applied active-inference paper exists, my search missed it — treat strand 4 as theoretically suggestive but empirically un-validated for this use case.
- I did **not** consult arXiv full-text or run literature graphs (no Semantic Scholar API calls). A deeper pass would tighten the recency claims, especially for the 2025-2026 LLM-questioning papers.

Sources (URL pointers, not citations):
- https://en.wikipedia.org/wiki/Bayesian_experimental_design
- https://arxiv.org/pdf/2302.14545
- https://www.semanticscholar.org/paper/Information-Based-Objective-Functions-for-Active-MacKay/2046412fecff64e095cc5190b69172055afd2094
- https://chrismathys.com/wp-content/uploads/2015/05/Friston-et-al.-2015-Active-inference-and-epistemic-value.pdf
- https://activeinference.github.io/papers/process_theory.pdf
- https://link.springer.com/article/10.1007/s00422-019-00805-w
- https://en.wikipedia.org/wiki/Twenty_Questions
- https://arxiv.org/abs/1611.01655
- https://www.hup.harvard.edu/books/9780674931985
- https://www.sciencedirect.com/science/article/abs/pii/0377221796000045
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11295223/
- https://chime.ucla.edu/sites/default/files/media/documents/cognitive-interviewing-guide.pdf
- https://arxiv.org/abs/2507.02564
- https://arxiv.org/pdf/2602.18306
- https://arxiv.org/pdf/2402.03271
- https://arxiv.org/pdf/2502.04485
- https://arxiv.org/html/2406.17453v1
- https://arxiv.org/pdf/2603.00656
- https://arxiv.org/pdf/2402.06509
- https://arxiv.org/html/2510.27410
- https://princeton-nlp.github.io/SocraticAI/
- https://arxiv.org/pdf/2509.19593
```

---
