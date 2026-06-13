---
tags: [dispatch, formalization, research, certifier-judge, safe-rl, appended-explorers]
node_type: research
is_session: false
layer: domain
nature: technical
status: complete
version: 1.0.0
last_updated: 2026-06-13
---

# research.md — dispatch 2026-06-13-certifier-judge-separation (returns coletados, verbatim)

Concat verbatim dos returns dos explorers, um header por agente (`## <id> — <angle> (round N)`),
append-only entre rounds. Este arquivo é o alvo imóvel das citações do `findings.md` (P9). Os
returns de skeptic/writer/auditor vivem em `agents/03..07-*.md` (mesmos arquivos, formato research-skill).

## 01 — Simon — repo-internal/conceptual (round 1)

> Persisted by parent: read-only agent; content verbatim below.

```
role: explorer
methodology: conceptual-internal
source: repo artifacts only
angle: repo-internal — derive whether certifier/judge split is an exhibited pattern
round: 1
```

### decision

The repo already exhibits the "prove the certifier, not the judge" split in at least three structurally-independent instances; the boundary object is the same in each: a CERTIFIED typed predicate over structured inputs that bounds the decision domain, with the ASSUMED/unproved region named explicitly and isolated at a declared border. The pattern is load-bearing, not accidental.

## MATERIAL — three instances with anchored analysis

### Instance Table

| # | Domain | CERTIFIED inner object | ASSUMED / unproved outer region | Typed residue at the boundary |
|---|---|---|---|---|
| SI1 | Permission kernel (security tower) | `decidePolicy`, `decidePolicy_sound`, `deny_precedence`, `read_confined`, taint monotonicity, egress confinement — all sorry-free Lean theorems bounded to structured canonical `StructuredArgs` input | Classifier judgment ("is this content secret?"); symlink/TOCTOU/Unicode/DNS-rebinding/URL-parse fidelity; which dispatch to *run* (the policy choice) | The path-prefix label: CERTIFIED = prefix-match; ASSUMED = content-classification oracle. Residue = `classify(content)` — the oracle the Lean cannot reach |
| SI2 | Egress bypass (negative rung ∂′) | `bash_egress_bypass` and `isEgress_bash_false`: PROVES the guard is blind to bash-routed egress — the certified inner object is the *scope of the certifier* itself, not merely its correctness | Whether the attacker picks `webFetch` vs `bash` — the optimizer's tool-choice is entirely outside the certified surface | Residue = `isEgress`'s enumeration gap. Crossing it costs all egress safety; the boundary is typed as a finite `ToolName` catalogue |
| SI3 | Dispatch agent I/O contracts (discovery) | Structured **envelope** (header, frontmatter, claim-IDs, Dissent token, anchors) — typed, checkable, rule-consuming. KILL #6 permanently bars schematizing the epistemic reasoning body | The free **corpo epistêmico** (the reasoning body): content, argument quality, whether a dispatch is *good* — entirely unstructured, uncheckable by any mechanical rule | Residue = the epistemic body itself. Crossing into "what is a good argument?" loses type. KILL #6 names this crossing explicitly as the boundary |

### SI1 — SECURITY-TOWER.md: the CERTIFIED-vs-ASSUMED ledger as the boundary

Anchor: `SECURITY-TOWER.md:132–147` (the CERTIFIED/ASSUMED table per rung).

The tower draws the line rung by rung. The inner certified object is `decidePolicy` parametric in `applies` (AgentPermissionKernel.lean:1–43): "The whole certified surface here is parametric in `applies` — it holds for any `Req → Bool`, so matcher soundness is a separate obligation, not covered by these theorems." The outer region is the matcher's honesty (Unicode, symlink, TOCTOU), not provable by the Lean kernel. The tower document (`SECURITY-TOWER.md:68–88`) names the keystone and its collapse-test in one block: "If a real attack lands on the unverified border (parser, `realpath`/symlink, Unicode/NFC case-fold, the egress/taint classifier), the verified core buys zero security for that attack."

The residue crossing the boundary: the label from policy input (a path-prefix, certified) to content classification (an oracle, not certifiable). Named explicitly at `AgentPermissionKernelTaint.lean:23–28`: "If the label must instead be decided from CONTENT, this rung collapses to the uncertifiable `classify(content)` oracle." This is the typed loss — not a soft preference, a hard type mismatch: path-prefix lists are finite enumerable; content is not.

The JUDGE is implicit here: which forbid rules to write in the policy, how to assign secret labels to prefixes, whether a dispatch is worth running — none of this is proved or provable. The certifier only says: given THIS policy and THIS structured request, here is the decision.

### SI2 — AgentPermissionKernelEgressBypass.lean: the certifier's boundary proved as a negative

Anchor: `AgentPermissionKernelEgressBypass.lean:54–118`.

This is the clearest formal instance. The certified object is `egressGuard` over `webFetch` requests on a tainted session. The unproved outer region is the tool-selection: which tool the agent (or attacker) routes the request through. `bash_egress_bypass` at line 98–102 is a typed Lean proof that the certifier has a hard scope limit: `isEgress_bash_false` (line 54–57) proves `isEgress` returns `false` for ALL bash requests regardless of content, command, or host.

The contrast theorem `webfetch_still_denied` at line 116–117 makes the split explicit: identical tainted session, identical intent, two tools — one certified, one not. The residue crossing the tool-catalogue boundary is total: no security property carries over.

The typed residue here is specifically `ToolName`-indexed: `{.webFetch} ↦ certified deny`; `{.bash, ...} ↦ outer region, uncheckable`. The catalogue is the boundary object.

### SI3 — discovery.md: envelope/body split as the third instance

Anchor: `discovery.md:56–58` (Core Concepts), `discovery.md:107` (§4.1 boundary naming), `discovery.md:148–150` (KILL #6).

The dispatch I/O contract architecture exhibits exactly the split in a non-security domain. The certified inner object is the **envelope**: header-of-frontiera, frontmatter, claim-IDs, Dissent token, anchors — typed, rule-consuming, mechanically checkable. The rule "a field enters the envelope iff a named check reads it" (`discovery.md:82–83`, the E3 R5 criterion) is itself the certifier's boundary condition. The outer region is the **corpo epistêmico** (epistemic body): the reasoning, argument quality, whether an explorer's finding is *good* — KILL #6 (`discovery.md:148–150`) permanently bars typing this: "Schema JSON/tipado do corpo epistêmico — KILL unânime."

The residue at the boundary is the epistemic quality of reasoning: uncapturable by type. Crossing from envelope to body loses checkability entirely; the gain is freedom of argument. KILL #6 names this as a typed negative: not "we haven't done it yet" but "it cannot be done without destroying the property that makes the envelope valuable."

The three-way vocabulary at `discovery.md:56–58` names the boundary precisely: **envelope** / **linha estruturada de corpo** (structured body line, sanctioned iff a named check reads it) / **schema do corpo** (KILL). The middle category is the membrane — it is inside the body but typed only at the token level (Dissent, claim-IDs), never at the reasoning level.

### Cross-instance pattern assessment

All three instances share:

1. A **finite, typed, decidable predicate** on structured inputs — the certifier. In SI1/SI2: Lean theorem over `StructuredArgs`. In SI3: envelope checks over typed tokens.
2. An **explicitly named and isolated** outer region — not silently ignored but banner-labelled as ASSUMED or KILLed.
3. A **typed residue** at the boundary that names what is lost: content-classification oracle (SI1), tool-catalogue gap (SI2), epistemic quality of reasoning (SI3).
4. The pattern that **trying to prove the outer region is a category error** is stated or implied each time: SI1 names it as "irreducible precondition for a pure string matcher"; SI2 proves it as a Lean negative; SI3 banks it as KILL #6.

The boundary object across all three is the same abstract shape: a decidable predicate over a finite structured type (path-prefix list, ToolName enum, typed token), with the unproved region being an oracle over an infinite or semantically-grounded domain (content, intent, quality). The residue is what the oracle would need to compute — and the key move in each case is to refuse to try.

**Dissent:** The external-literature explorer will likely arrive top-down at a general two-layer certification theory (e.g., from abstract interpretation, type-theoretic effect systems, or resource-theoretic certificates) and will want to name the boundary with a category-theoretic object. My derivation is bottom-up from three specific repo artifacts. The methodological gap is real: I can show the pattern recurs and name its local shape, but I cannot rule out that what I'm calling "the same boundary object" in SI1/SI2/SI3 are three distinct things that merely look similar from inside the repo. A top-down theory could either confirm they are one object or dissect them. I have no basis from repo artifacts alone to force the unification — that is the external explorer's bet, not mine.


## 02 — Ashby — external-literature/formal (round 1)

> Persisted by parent: read-only agent; content verbatim below.

**decision:** The thesis "prove the inner certifier, leave the outer judge unproved" is established across at least five independent literature threads (shielding, CBF-QP filter, ModelPlex/Fulton-Platzer, runtime enforcement/security automata, predictive safety filter), but NO single paper names this as a unified framing principle. The specific meta-claim — that *the proof of the certifier is the precondition that licenses leaving the outer policy soft* — is implicit and distributed, not a named theorem.

## Literature (AS1–AS11)

- **AS1 — Shield = proved automaton, RL policy = unverified.** Alshiekh, Bloem et al., "Safe Reinforcement Learning via Shielding," AAAI 2018. The shield is a verified LTL-synthesis product; the RL policy is not verified. Closed-loop satisfies the temporal spec for *any* RL policy. https://ojs.aaai.org/index.php/AAAI/article/view/11797
- **AS2 — CBF-QP filter = proved certifier, any Lipschitz controller = unverified.** Ames, Xu, Grizzle, Tabuada, IEEE TAC 62(8), 2017. Thm 4: if h is a CBF, *any locally Lipschitz controller* satisfying the CBF condition renders C forward invariant. Strongest purely formal single-theorem version. (bibbase record)
- **AS3 — ModelPlex = proved monitor, CPS controller = unverified.** Mitsch & Platzer, FMSD 49(1-2), 2016. Monitor synthesised correct-by-construction from a dL proof; running controller not verified. https://dl.acm.org/doi/10.1007/s10703-016-0241-z
- **AS4 — Fulton & Platzer = proved ModelPlex monitor licenses any RL agent.** AAAI 2018 / TACAS 2019. "AI and ML can be understood as unverified implementations whose compliance ... can be ensured using ModelPlex." Closest published statement to the repo thesis. https://arxiv.org/abs/1902.05632
- **AS5 — Schneider security automata.** "Enforceable Security Policies," ACM TISSEC 3(1), 2000. Defines properties exactly enforceable by a halt-on-violation automaton; program runs unverified. https://www.cs.cornell.edu/fbs/publications/EnfSecPols.pdf
- **AS6 — Altman CMDPs = hard feasible-set vs optimised objective.** *Constrained MDPs*, 1999. Optimisation within the feasible set; separation is mathematical but not "prove the certifier."
- **AS7 — Wabersich & Zeilinger predictive safety filter.** Automatica 2021. "turns a constrained dynamical system into an unconstrained safe system to which *any RL algorithm* can be applied out-of-the-box." Cleanest single-paper match. https://arxiv.org/abs/1812.05506
- **AS8 — Hsu, Hu, Fisac, "The Safety Filter: A Unified View," 2024.** Unifies CBFs, HJ reachability, predictive filters under a shared modular "safety filter" abstraction. https://arxiv.org/abs/2309.05837
- **AS9 — Ramadge-Wonham supervisory control, 1987.** Supervisor synthesised (proved); plant unverified. Structural antecedent.
- **AS10 — Mechanism vs policy separation.** Lampson-Sturgis 1976; Saltzer-Reed-Clark end-to-end 1984. Design heuristic, not a formal safety theorem.
- **AS11 — Falcone runtime enforcement.** "You Should Better Enforce than Verify," RV 2010. Extends Schneider to edit automata; boundary still the safety-property class.

## MATERIAL

- **M1 — PEA (Policy-Execution-Authorization), arXiv:2604.23646.** Closest agentic framing; proves Authorization enforcement holds for ALL Policy outputs incl. adversarial. Differs: PEA assumes policy adversarial; the repo thesis *licenses* it. Gap: theorems about non-bypassability, not feasibility.
- **M2 — Prajna & Jadbabaie barrier certificates, 2004.** Antecedent to CBF.
- **M4 — Repo AgentPermissionKernel.lean.** Instantiates AS1/AS3 at the access-control layer: kernel proved sound, agent requests unconstrained. A correct-by-design instantiation, not an original meta-principle.
- **M5 — Incompleteness of AI safety verification, arXiv:2604.04876 (2026).** Under P ≠ coNP, no exact certifier can be simultaneously integrity-preserving, non-abstaining, and polynomial-budgeted — a trilemma on certifier expressiveness. Material for the gap between "prove the certifier" and "certifier is decidable."

## Established pieces + gap (summary)

The "prove the certifier, leave the policy unproved" pattern is established across ≥5 threads; the specific meta-claim "proof of the certifier is the precondition that licenses the soft judge" is **never a named theorem** — it is the informal gloss unifying them. There is no "Certified-Feasible-Set Theorem." Wabersich-Zeilinger is the closest single-paper instantiation; Ames et al. the strongest single formal theorem. The repo's kernel is a correct-by-design instantiation at the access-control layer. The gap the literature does NOT close: a *unified, named* formal principle stating the certifier proof is the necessary+sufficient precondition to license an unverified optimizer, across all instantiations.

**Dissent:** The convergence to "one pattern" is shallow. Shielding (LTL synthesis), CBF (Lyapunov invariants), ModelPlex (dL monitors), predictive safety filters (MPC horizon feasibility) use **completely different formal machineries**; the claim they are all "instances of prove-the-certifier" is an informal synthesis, NOT a proof of equivalence. The certifier mechanisms are formally **incommensurable**, so the unifying principle is genuinely **open** at the level of a unified formal framework.
