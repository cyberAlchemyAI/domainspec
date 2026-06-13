## 02 — Ashby — external-literature/formal (round 1)

> Persisted by parent: read-only agent; content verbatim below.

**decision:** The thesis "prove the inner certifier, leave the outer judge unproved" recurs across at least five independent literature threads (shielding, CBF-QP filter, ModelPlex/Fulton-Platzer, runtime enforcement/security automata, predictive safety filter). The threads use different formal machineries; the specific meta-claim — that *the proof of the certifier is the precondition that licenses leaving the outer policy soft* — is implicit and distributed across them, not stated as a single named theorem.

## Literature threads exhibiting the split

- **AS1 — Shield = proved automaton, RL policy = unverified.** Alshiekh, Bloem et al., "Safe Reinforcement Learning via Shielding," AAAI 2018. The shield is a verified LTL-synthesis product; the RL policy is not verified. Closed-loop satisfies the temporal spec for *any* RL policy. https://ojs.aaai.org/index.php/AAAI/article/view/11797
- **AS2 — CBF-QP filter = proved certifier, any Lipschitz controller = unverified.** Ames, Xu, Grizzle, Tabuada, IEEE TAC 62(8), 2017. Thm 4: if h is a CBF, *any locally Lipschitz controller* satisfying the CBF condition renders C forward invariant. Strongest purely formal single-theorem version. (bibbase record)
- **AS3 — ModelPlex = proved monitor, CPS controller = unverified.** Mitsch & Platzer, FMSD 49(1-2), 2016. Monitor synthesised correct-by-construction from a dL proof; running controller not verified. https://dl.acm.org/doi/10.1007/s10703-016-0241-z
- **AS4 — Fulton & Platzer = proved ModelPlex monitor licenses any RL agent.** AAAI 2018 / TACAS 2019. "AI and ML can be understood as unverified implementations whose compliance ... can be ensured using ModelPlex." Closest literature statement to the repo thesis. https://arxiv.org/abs/1902.05632
- **AS5 — Schneider security automata.** "Enforceable Security Policies," ACM TISSEC 3(1), 2000. Defines properties exactly enforceable by a halt-on-violation automaton; program runs unverified. https://www.cs.cornell.edu/fbs/publications/EnfSecPols.pdf
- **AS6 — Altman CMDPs = hard feasible-set vs optimised objective.** *Constrained MDPs*, 1999. Optimisation within the feasible set; separation is mathematical but not "prove the certifier."
- **AS7 — Wabersich & Zeilinger predictive safety filter.** Automatica 2021. "turns a constrained dynamical system into an unconstrained safe system to which *any RL algorithm* can be applied out-of-the-box." Cleanest single-paper match. https://arxiv.org/abs/1812.05506
- **AS8 — Hsu, Hu, Fisac, "The Safety Filter: A Unified View," 2024.** Unifies CBFs, HJ reachability, predictive filters under a shared modular "safety filter" abstraction. https://arxiv.org/abs/2309.05837
- **AS9 — Ramadge-Wonham supervisory control, 1987.** Supervisor synthesised (proved); plant unverified. Structural antecedent.
- **AS10 — Mechanism vs policy separation.** Lampson-Sturgis 1976; Saltzer-Reed-Clark end-to-end 1984. Design heuristic, not a formal safety theorem.
- **AS11 — Falcone runtime enforcement.** "You Should Better Enforce than Verify," RV 2010. Extends Schneider to edit automata; boundary still the safety-property class.

## Related agentic / formal references

- **M1 — PEA (Policy-Execution-Authorization), arXiv:2604.23646.** Closest agentic framing; proves Authorization enforcement holds for ALL Policy outputs incl. adversarial. Differs: PEA assumes policy adversarial; the repo thesis *licenses* it. Difference: theorems about non-bypassability, not feasibility.
- **M2 — Prajna & Jadbabaie barrier certificates, 2004.** Antecedent to CBF.
- **M4 — Repo AgentPermissionKernel.lean.** Instantiates AS1/AS3 at the access-control layer: kernel proved sound, agent requests unconstrained. A correct-by-design instantiation of the pattern.
- **M5 — Incompleteness of AI safety verification, arXiv:2604.04876 (2026).** Under P ≠ coNP, no exact certifier can be simultaneously integrity-preserving, non-abstaining, and polynomial-budgeted — a trilemma on certifier expressiveness. Relevant to the gap between "prove the certifier" and "certifier is decidable."

## Pattern + framework gap (summary)

The "prove the certifier, leave the policy unproved" pattern recurs across ≥5 threads; the specific meta-claim "proof of the certifier is the precondition that licenses the soft judge" is **never stated as a single named theorem** — it is the informal gloss unifying them. Wabersich-Zeilinger is the closest single-paper instantiation; Ames et al. the strongest single formal theorem. The repo's kernel is a correct-by-design instantiation at the access-control layer. What no thread supplies: a *unified, named* formal principle stating the certifier proof is the necessary+sufficient precondition to license an unverified optimizer, across all instantiations.

**Dissent:** The convergence is shallow. Shielding (LTL synthesis), CBF (Lyapunov invariants), ModelPlex (dL monitors), predictive safety filters (MPC horizon feasibility) use **completely different formal machineries**; the claim they are all "instances of prove-the-certifier" is an informal synthesis, NOT a proof of equivalence. Because the certifier mechanisms are formally **incommensurable**, the unifying principle is genuinely **open** at the level of a single formal framework — there is no demonstrated cross-domain object, only a recurring shape.
