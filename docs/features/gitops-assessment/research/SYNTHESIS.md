# GitOps Adoption — Synthesis

**Synthesizer date:** 2026-05-02
**Inputs:**
- [A] `research-a-foundations.md` — GitOps foundations & tooling
- [B] `research-b-agentic-spec-driven.md` — agentic / spec-driven edge
- [Repo] `repo-assessment.md` — current state of `/Users/victorboscaro/domainspec`

This is a working map for the Discovery Writer. Every claim traces to one of [A], [B], or [Repo].

---

## 1. Convergent findings (where all three sources agree)

- **Spec-as-truth + derived-as-output is the right mental model for DomainSpec.** [A] frames OpenGitOps' "declarative, versioned, pulled, reconciled" loop; [B] documents the dbt/OpenAPI/DSPy "intent vs. compiled artifact" pattern as the canonical spec-driven topology; [Repo] confirms DomainSpec already names this split (AUTHORITY-MAP.md, ARCHITECTURE.md "generated from docs"). All three agree the split exists *conceptually* — disagreement is only about how strictly to enforce it. [A] [B] [Repo]
- **The reconciliation loop is the differentiator vs. plain CI.** [A] makes the litmus test explicit ("if you turn off CI, does merge → deploy still work?"); [B] maps the K8s controller-reconciler pattern onto DomainSpec's pipeline; [Repo] documents that DomainSpec has a 10-stage pipeline that is invoked manually today, not pulled and reconciled. All three converge on: this is the gap. [A] [B] [Repo]
- **Verifier-as-admission is a clean and high-confidence pattern.** [A] cites the OPA Gatekeeper / Kyverno admission model and the [Coding_Karma layered defense pattern](https://medium.com/@codingkarma/building-a-gitops-drift-detection-auto-remediation-pipeline-with-argocd-github-actions-and-f72545c63fdf); [B] explicitly maps PASS/FLAG/BLOCK onto Allow/Warn/Deny; [Repo] shows `domainspec-verifier` exists and is classified as deterministic. All three agree promoting the verifier from Stage-10 finale to a required check is low-risk, high-leverage. [A] [B] [Repo]
- **Bot-PR over direct-to-main is non-negotiable for agent-generated artifacts.** [A] mentions Renovate/Dependabot in passing; [B] makes it a first-class section with Renovate/Dependabot/Atlantis as exemplars; [Repo] confirms zero bot-PR plumbing exists today. All three agree this is required for any agent-as-controller story. [A] [B] [Repo]
- **DomainSpec is doc-rich, runtime-poor.** [A] and [B] both note the literature gap — nothing off-the-shelf wires LLM reconcilers into a Git loop with admission gating; [Repo] is blunt that "the framework is GitOps-*ready in vocabulary* and GitOps-*absent in implementation*." All three sources independently describe the same shape of gap. [A] [B] [Repo]
- **Secrets must be solved before secrets exist.** [A] makes this an explicit anti-pattern with SOPS as recommended default; [Repo] shows three secrets (`VPS_PROVIDER_TOKEN`, `CLOUDFLARE_API_TOKEN`, `PULUMI_ACCESS_TOKEN`) referenced in INFRA-SETUP.md with zero consumers — meaning the cleanup window is open *now*, before they are first used. [B] is silent (out of scope). [A] [Repo]
- **Drift detection + auto-heal is the core failure-mode mitigation.** [A] lists click-ops relapse and silent drift as the top two killers; [B] cites the same Coding_Karma three-layer defense; [Repo] shows DomainSpec already has 9 validators in `tools/` that are inert without a runner — drift detection is *coded but not wired*. [A] [B] [Repo]

---

## 2. Divergent / contested findings

- **What "the reconciler" *is* for DomainSpec.** [A] assumes a generic Compose/K8s reconciler (Konta, systemd+git-sync, or ArgoCD/Flux). [B] argues the LLM pipeline (`domainspec-pipeline`) *is* the reconciler and operator-pattern semantics must be enforced at the artifact layer, not the agent layer, because LLMs are not idempotent. **More credible: [B]** for the *spec→artifact* reconciliation (DomainSpec's distinguishing problem). **More credible: [A]** for the *artifact→runtime* reconciliation (deploying compiled code to a VPS). The Discovery should adopt a two-tier reconciliation model — they are not in conflict, they are answering different questions.
- **Whether DomainSpec needs ArgoCD/Flux at all.** [A] explicitly recommends *skipping* ArgoCD/Flux ("we're not on Kubernetes"). [B] uses K8s operator/admission patterns extensively as analogies but never insists on K8s-native tools. [Repo] shows zero K8s anywhere; the deploy target is single-VPS Docker Compose per INFRA-SETUP.md. **[A] is more credible** here because it is grounded in the actual deploy target. K8s tooling enters only as a *pattern reference*, not a runtime dependency.
- **How aggressive to be on canary/progressive delivery.** [A] says skip progressive delivery entirely until SLO + analysis exist ("canaries without analysis are theater"). [B] argues spec-change blast radius is so large (one `operations.md` edit re-derives 100+ tests) that *some* form of staged rollout is needed even at v1. **Both are partially right.** [A] is correct that runtime canary is premature; [B] is correct that *spec-level* blast-radius scoping (à la dbt `state:modified+`) is needed early because a single bad regen can cascade. The Discovery should split: no runtime canary; yes obligation-diff scoping.
- **Confidence in non-K8s reconciler ecosystem.** [A] flags MEDIUM confidence on Konta/Komodo/Portainer (small communities, single-maintainer bus-factor). [B] does not address. [Repo] is silent on the choice. **[A] is the only signal.** Treat [A]'s caveat as load-bearing — recommend the systemd + git-sync minimal pattern over Konta unless a Konta-class dependency is acceptable.
- **Whether the duplicated `copilot/` ↔ `.github/` overlay is a problem GitOps should solve first.** [Repo] flags this as MEDIUM-HIGH brownfield risk (no checksum, no sync verifier, both edited by hand). Neither [A] nor [B] has anything to say — it is a DomainSpec-specific accident. **[Repo] is the only voice; treat as load-bearing because it is a concrete drift surface that exists *today*.**

---

## 3. The five most load-bearing facts

1. **There is no `.github/workflows/` directory in the repo, never has been (zero commits), and `TUNING-LOOP.md` claims `.github/workflows/domainspec-tuning.yml` is deployed (✅ in ADLC-ALIGNMENT.md G4). [Repo §CI/CD State Today, §Brownfield item 10]** This single fact reframes the discovery: it is not "adopt GitOps" but "build the CI substrate that documentation has been claiming exists for an unknown duration." Any recommendation predicated on extending existing CI is wrong.
2. **5 of 17 agents are deterministic and could become CI controllers today** (`domainspec-verifier`, `domainspec-alignment-auditor`, `domainspec-layering-auditor`, `domainspec-otel-verifier`, `domainspec-registry-sync`). 3 more are derivable. **[Repo §Agents → Controller Classification]** This bounds Phase 1 scope: there is real material to wire up immediately without solving the LLM-reconciliation problem.
3. **LLM compilation is structurally non-deterministic** even at temperature=0, due to floating-point + dynamic batching (cited [Thinking Machines](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/), [LLM-42](https://arxiv.org/abs/2601.17768)). **[B §LLM-as-compiler]** This is the load-bearing reason DomainSpec cannot adopt classical GitOps unmodified — operator-pattern idempotency must be enforced at the *artifact* layer (semantic hash) not the *agent* layer. Any "just run the pipeline on every PR" recommendation that ignores this will produce churning regen PRs.
4. **DomainSpec runs on single-VPS Docker Compose, not Kubernetes** (per INFRA-SETUP.md "Single VPS" / "Split VPS" / "HA" presets). **[Repo §Infra/Deploy State Today, A §Non-K8s GitOps]** Eliminates the entire ArgoCD/Flux branch of the recommendation tree. The reconciler choice is between (a) Konta/Komodo (b) systemd+git-sync (c) Pulumi Automation API. [A] recommends a two-layer split: Pulumi for cloud + systemd for VPS.
5. **No off-the-shelf "ArgoCD for spec-driven AI systems" exists as of May 2026.** **[B §Summary, §Open problems]** DomainSpec is on the frontier for the *spec-as-CRD-with-LLM-reconciler* layer. This means the discovery cannot recommend "adopt tool X"; it must recommend "compose pattern Y from existing primitives" — and accept that some pieces (obligation-diff, semantic-hash idempotency, multi-agent merge) will require invention.

---

## 4. The repo's real starting position

DomainSpec today is a **HIGH-intent / LOW-runtime** codebase: 17 root governance/architecture markdown files, 17 packaged agents (1,449 LoC), 30 packaged skills (2,522 LoC), and 17 validator/observer/generator scripts in `tools/` (2,476 LoC) — all describing a GitOps-shaped system with rich signal schemas (11 signal types, 10 thresholds), explicit ADLC gap inventories (G1–G16), and a documented 10-stage pipeline. The intent layer scores **HIGH**. The compiled-artifact discipline scores **LOW**: the only existing derived bucket (`docs/features/payment-processing/_categorical/`) has no committed regenerator; the `.github/agents/` and `.github/skills/` overlays duplicate `copilot/` source with no checksum, no sync verifier, and no manifest validation against the 23,392-byte `.github/gsd-file-manifest.json`. CI/CD scores **VERY LOW**: zero `.github/workflows/` ever, the `.githooks/pre-commit` exists but `core.hooksPath` is unset (dead code), `infra/` is *planning prose* not IaC, and `INFRA-SETUP.md` line 484 promises `git push main # CI/CD deploys automatically` with nothing on disk to make that work. Reconciliation controllers, signal/feedback loop, agent-pack versioning, and documentation-vs-reality fidelity all score **LOW** (TUNING-LOOP.md claims a workflow file is deployed; the file does not exist). Brownfield risk scores **MEDIUM-HIGH** due to the duplicated overlay, an 845-file `implementation/app-frontend/` Node app with committed `node_modules/` and unclear authority, an unfinished payment-processing pack (SPEC.md trimmed below template, no TEST-SPEC, STORIES, observability, or alignment artifacts), and active churn concentrated in `plan/` rather than implementation closure. Net: adopting GitOps here is less about choosing a tool and more about wiring already-existing validators, agents, and signal definitions into a workflow/controller layer the docs assume but the disk does not contain. [Repo, all sections]

---

## 5. The three biggest open questions for the Discovery Writer

1. **Q: Do we treat the `domainspec-pipeline` itself as the reconciler, or do we keep it as an interactive tool and only wire the deterministic validators into CI?**
   **Recommended default: BOTH, in two phases.** Phase 1: wire the 5 deterministic agents + 9 `tools/` validators as required CI checks (low risk, immediate G4/G11/G13/G14/G15/G16 closure). Phase 2: introduce `domainspec-bot` that runs the full LLM pipeline on spec changes via paired PR.
   **Rationale:** [B] is honest that LLM reconcilers are not idempotent without infra-layer fixes; deterministic-first sequencing buys time to design the semantic-hash idempotency layer without blocking value delivery.

2. **Q: Single-VPS reconciler — Konta vs systemd+git-sync vs Pulumi Automation API?**
   **Recommended default: systemd + git-sync + `docker compose up -d` on every tick, with Pulumi (CLI in CI) for cloud resources (DNS, VPS provisioning).**
   **Rationale:** [A] makes the two-layer split case explicitly; ~30 lines of config; zero new dependencies; satisfies all four OpenGitOps principles; avoids Konta's bus-factor risk that [A] flags MEDIUM. Promote to Konta only if the simple loop proves insufficient.

3. **Q: How do we handle the duplicated `copilot/` ↔ `.github/` agent pack — fix it as part of GitOps adoption, or scope it out?**
   **Recommended default: IN SCOPE for v1.** Add a `tools/check-overlay-sync.sh` validator + CI check that compares `copilot/agents/*` and `copilot/skills/*` against `.github/agents/*` and `.github/skills/*` (and validates against `.github/gsd-file-manifest.json`). Block PRs on mismatch.
   **Rationale:** [Repo] flags this as MEDIUM-HIGH risk and it is the closest existing analog to the "intent vs. compiled" enforcement story. Solving it builds the muscle for harder cases (spec → derived code).

---

## 6. Recommended discovery shape

### Suggested objective (3 sentences max)

Adopt GitOps as DomainSpec's operating model so that every governance claim the framework makes about itself is enforced by a pull-based, continuously-reconciling agent rather than by a human typing IDE commands. Specifically: wire the five deterministic agents and nine validator scripts that already exist in `tools/` into required CI workflows; establish a paired bot-PR pattern for LLM-derived artifacts so agents never push to `main` directly; and stand up a minimal VPS reconciler (systemd + git-sync + `docker compose up -d`) so `git push main` actually deploys. Defer the harder spec-as-CRD-with-LLM-reconciler problem (semantic-hash idempotency, obligation-diff blast-radius scoping) to a later phase where DomainSpec writes the playbook because no off-the-shelf tool solves it as of May 2026.

### Suggested scope boundary

**IN for v1:**
- `.github/workflows/` substrate (the missing CI layer per [Repo])
- 5 deterministic agents wired as required CI checks (verifier, alignment-auditor, layering-auditor, otel-verifier, registry-sync)
- 9 `tools/` validators wired (analyze-signals, validate-*, generate-*, prune-governance)
- `core.hooksPath` configured + `gitleaks`-style secret scan as pre-commit + CI
- SOPS for secrets (per [A])
- Overlay-sync validator (`copilot/` vs `.github/`)
- VPS reconciler: systemd + git-sync + compose loop
- Pulumi (CLI in CI) for cloud resources
- `docs/signals/` directory + `pipeline-signals.jsonl` actually produced
- `docs/.compiled/manifest.json` with source-hash per derived artifact (per [B])

**OUT for v1 (defer):**
- ArgoCD / Flux (no K8s)
- Progressive delivery / canary at runtime (per [A]: theater without SLO+analysis)
- LLM-as-reconciler with full bot-PR regen on every spec change (per [B]: needs semantic-hash design first)
- Obligation-diff blast-radius computation (frontier; defer to v2)
- External secrets vault (SOPS sufficient until rotation requirement appears)
- Multi-agent merge-conflict resolution (no public prior art per [B])
- Reconciliation rollback semantics for spec changes (open problem per [B])

### Suggested phasing (3–4 phases, one line each)

1. **Phase 1 — CI substrate & deterministic gates.** Create `.github/workflows/`, wire the 5 deterministic agents + 9 validators, configure `core.hooksPath`, add `gitleaks`, fix the documentation-vs-reality drift (TUNING-LOOP.md claim).
2. **Phase 2 — Intent/compiled discipline.** Introduce `docs/.compiled/manifest.json`, mark derived files with `@source-hash`, add overlay-sync validator, adopt SOPS for secrets, ship `docs/signals/pipeline-signals.jsonl` emission.
3. **Phase 3 — VPS reconciler & deploy.** Stand up Pulumi for cloud resources, systemd + git-sync + compose loop on the VPS, prove `git push main → deploy` actually works, add the prometheus/alerts/Caddy pieces INFRA-SETUP.md promises.
4. **Phase 4 — `domainspec-bot` & spec-driven regen.** Paired bot-PR pattern, obligation-diff comments, verifier-as-admission on every regen, semantic-hash idempotency for derived artifacts. This is where DomainSpec writes the playbook.

---

## 7. Citations index

### Foundations & principles ([A])
- [OpenGitOps PRINCIPLES.md v0.1.0](https://github.com/open-gitops/documents/blob/v0.1.0/PRINCIPLES.md)
- [OpenGitOps GLOSSARY.md](https://github.com/open-gitops/documents/blob/main/GLOSSARY.md)
- [OpenGitOps 1.0 announcement](https://opengitops.dev/blog/1.0-announcement/)
- [CNCF OpenGitOps project page](https://www.cncf.io/projects/opengitops/)
- [CNCF: GitOps in 2025](https://www.cncf.io/blog/2025/06/09/gitops-in-2025-from-old-school-updates-to-the-modern-way/)

### K8s tooling (referenced as patterns, not adopted) ([A])
- [ArgoCD docs](https://argo-cd.readthedocs.io/) · [Flux docs](https://fluxcd.io/)
- [ArgoCD vs FluxCD 2026 (DEV/MechCloud)](https://dev.to/mechcloud_academy/the-gitops-standard-in-2026-a-comparative-research-analysis-of-argocd-and-fluxcd-46d8)
- [ArgoCD vs FluxCD 2026 (OneUptime)](https://oneuptime.com/blog/post/2026-02-26-argocd-vs-fluxcd-2026/view)
- [Argo Rollouts](https://argo-rollouts.readthedocs.io/) · [Flagger](https://flagger.app/)

### Repo topology ([A])
- [ArgoCD repo structure best practices (OneUptime, 2026)](https://oneuptime.com/blog/post/2026-02-26-argocd-best-practices-repository-structure/view)
- [ArgoCD multi-env structure (OneUptime)](https://oneuptime.com/blog/post/2026-02-26-argocd-git-repo-structure-multi-environment/view)
- [Codefresh app-of-apps / ApplicationSets](https://codefresh.io/blog/how-to-structure-your-argo-cd-repositories-using-application-sets/)

### Secrets ([A])
- [SOPS](https://github.com/getsops/sops)
- [Sealed Secrets](https://sealed-secrets.netlify.app/)
- [External Secrets Operator](https://external-secrets.io/)
- [Red Hat secrets-with-GitOps guide](https://www.redhat.com/en/blog/a-guide-to-secrets-management-with-gitops-and-kubernetes)
- [SOPS for GitOps (BordenCastle, 2026)](https://www.bordencastle.com/security/gitops/devops/2026/02/13/sops-secrets-management-gitops.html)

### Non-K8s reconcilers ([A], load-bearing for DomainSpec)
- [Konta (GitHub)](https://github.com/talyguryn/konta) · [Konta on Product Hunt](https://www.producthunt.com/products/konta)
- [Portainer GitOps Automation](https://www.portainer.io/gitops-automation)
- [Komodo](https://komo.do/)
- [ConOps via DEV](https://dev.to/anuraggupta/managing-docker-composes-via-gitops-conops-54be)
- [Pulumi Automation API](https://www.pulumi.com/automation/)
- [Pulumi Kubernetes Operator](https://github.com/pulumi/pulumi-kubernetes-operator)
- [Spacelift GitOps tools 2026](https://spacelift.io/blog/gitops-tools)

### Failure modes / anti-patterns ([A])
- [GitOps Anti-Patterns (OneUptime, 2026)](https://oneuptime.com/blog/post/2026-02-26-gitops-anti-patterns/view)
- [Codefresh Top 30 ArgoCD Anti-Patterns](https://codefresh.io/blog/argo-cd-anti-patterns-for-gitops/)
- [Pulumi GitOps Best Practices I Wish I Had Known Before](https://www.pulumi.com/blog/gitops-best-practices-i-wish-i-had-known-before/)
- [Configuration Drift Detection in GitOps (OneUptime, 2026)](https://oneuptime.com/blog/post/2026-02-26-configuration-drift-detection-gitops/view)

### LLM non-determinism & prompt versioning ([B])
- [Defeating Nondeterminism in LLM Inference — Thinking Machines](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- [LLM-42 (arXiv 2601.17768)](https://arxiv.org/abs/2601.17768)
- [Braintrust prompt versioning](https://www.braintrust.dev/articles/what-is-prompt-versioning)
- [Mirascope prompt versioning](https://mirascope.com/blog/prompt-versioning)
- [Maxim AI top-5 prompt versioning 2026](https://www.getmaxim.ai/articles/top-5-prompt-versioning-platforms-in-2026/)
- [Confident AI prompt mgmt 2026](https://www.confident-ai.com/knowledge-base/compare/best-ai-prompt-management-tools-with-llm-observability-2026)
- [Agenta CI/CD for prompts](https://agenta.ai/blog/cicd-for-llm-prompts)
- [Calmops LLMOps architecture 2026](https://calmops.com/architecture/llmops-architecture-managing-llm-production-2026/)
- [DSPy paper (arXiv 2310.03714)](https://arxiv.org/abs/2310.03714) · [DSPy framework](https://dspy.ai/) · [DSPy GitHub](https://github.com/stanfordnlp/dspy)

### Spec-as-code precedents ([B])
- [openapi-generator](https://github.com/OpenAPITools/openapi-generator) · [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen)
- [dbt CI docs](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) · [Datafold dbt slim-CI](https://www.datafold.com/blog/accelerating-dbt-core-ci-cd-with-github-actions-a-step-by-step-guide/)
- [Pulumi YAML blog](https://www.pulumi.com/blog/pulumi-yaml/) · [Pulumi YAML reference](https://www.pulumi.com/docs/iac/languages-sdks/yaml/)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) · [TechDocs](https://backstage.io/docs/features/techdocs/)
- [Crossplane](https://www.crossplane.io/)
- [Kratix docs](https://docs.kratix.io/main/how-kratix-complements/crossplane) · [Kratix Syntasso](https://www.syntasso.io/post/kratix-and-crossplane)

### Bot-PR pattern ([B])
- [Renovate](https://github.com/renovatebot/renovate) · [Renovate vs Dependabot 2026](https://appsecsanta.com/sca-tools/dependabot-vs-renovate)
- [Atlantis](https://github.com/runatlantis/atlantis) · [Atlantis tutorial — Spacelift](https://spacelift.io/blog/atlantis-terraform-tutorial)

### Verifier as admission ([B])
- [Admission Controllers comparison (DEV)](https://dev.to/hkhelil/admission-controllers-in-kubernetes-opa-gatekeeper-kyverno-and-azure-policy-add-on-for-aks-which-one-wins-237d)
- [Policy as Code Kyverno/OPA (OneUptime)](https://oneuptime.com/blog/post/2026-02-09-policy-as-code-kyverno-opa/view)
- [Adevinta Gatekeeper→Kyverno migration](https://adevinta.com/techblog/why-did-we-transition-from-gatekeeper-to-kyverno-for-kubernetes-policy-management/)
- [Coding_Karma drift remediation pipeline (March 2026)](https://medium.com/@codingkarma/building-a-gitops-drift-detection-auto-remediation-pipeline-with-argocd-github-actions-and-f72545c63fdf)
- [Microsoft zero-trust admission webhooks](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/zero-trust-kubernetes-enforcing-security--multi-tenancy-with-custom-admission-we/4466646)

### Agents-as-controllers ([B], LOW-MED confidence)
- [Kubernetes operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [Beyond YAML: K8s Operators (DEV)](https://dev.to/naveens16/beyond-yaml-building-kubernetes-operators-with-crds-and-the-reconciliation-loop-524d)
- [Mastra](https://mastra.ai/) · [Mastra 2026 guide](https://www.generative.inc/mastra-ai-the-complete-guide-to-the-typescript-agent-framework-2026)
- [LangGraph](https://www.langchain.com/langgraph)

### Progressive delivery for spec changes ([B], LOW confidence)
- [Dynatrace progressive delivery](https://www.dynatrace.com/news/blog/progressive-delivery-done-right/)
- [Harness Four Shades](https://www.harness.io/blog/learn-the-four-shades-of-progressive-delivery)
- [Azati AI-powered progressive delivery 2026](https://azati.ai/blog/ai-powered-progressive-delivery-feature-flags-2026/)
- [TianPan LLM gradual rollout (April 2026)](https://tianpan.co/blog/2026-04-09-llm-gradual-rollout-shadow-canary-ab-testing)
- [Duckweave 12 ML deployment patterns (Feb 2026)](https://medium.com/@duckweave/canary-calm-rollback-fast-12-ml-deployment-patterns-d893d501041f)

### DomainSpec internal references ([B], [Repo])
- [README.md](../../../README.md) · [AUTHORITY-MAP.md](../../../AUTHORITY-MAP.md)
- [DRIFT-CONVERGENCE.md](../../../DRIFT-CONVERGENCE.md) · [TUNING-LOOP.md](../../../TUNING-LOOP.md)
- [GOVERNANCE-ATTENUATION.md](../../../GOVERNANCE-ATTENUATION.md) · [TEST-PIPELINE.md](../../../TEST-PIPELINE.md)
- [OBSERVABILITY.md](../../../OBSERVABILITY.md) · [ADLC-ALIGNMENT.md](../../../ADLC-ALIGNMENT.md)
- [INFRA-SETUP.md](../../../INFRA-SETUP.md)
