# Research B — GitOps for Agentic / Spec-Driven Systems

> **Scope.** Researcher A handles ArgoCD/Flux foundations. This document focuses on the *edge*: applying GitOps when the "compiler" between Git state and produced artifacts is a non-deterministic LLM, when the source of truth is a markdown spec pack, and when the verifier itself is an agent.
>
> **Author:** Researcher B
> **Date:** 2026-05-02
> **Target system:** [DomainSpec](../../../README.md) — a 7-layer recursive spec-first framework where 24 meta-types and 26 typed relationships in `docs/features/*` are compiled, by agents, into tests, code, observability, and infra.

---

## Summary

The classical GitOps loop assumes a **deterministic compiler**: the same `kubectl apply` of the same manifest yields the same cluster state. DomainSpec breaks this assumption at every stage — `domainspec-pipeline` is an LLM-driven derivation from `SPEC.md` + aspect docs into tests, code, OTel instrumentation, Pulumi infra, and PASS/FLAG/BLOCK verdicts. The "compiler" can produce semantically equivalent but byte-different outputs across runs, can hallucinate, and can silently regress on a previously-passing spec. The GitOps literature only began to grapple with this around 2024 and remains thin in 2026; what exists is mostly LLMOps prompt-versioning patterns retrofitted onto Git workflows, plus a handful of "compile-on-PR" precedents from dbt, OpenAPI codegen, and DSPy.

The good news: **the problem decomposes into known sub-problems with known solutions, just not yet integrated**. Prompt versioning + golden datasets (Braintrust, Confident AI, LangSmith) handle the LLM-as-compiler problem at the prompt layer. Bot-PR patterns from Renovate/Dependabot/Atlantis show how to propose machine-generated artifacts via PR rather than direct commit. dbt's "Slim CI" with `state:modified` shows how to compile only what changed and gate on artifact diff. Crossplane Compositions and Kratix Promises show how to model "platform as code" with declarative facades over imperative orchestration. Kyverno and OPA Gatekeeper give the admission-controller pattern that maps cleanly onto DomainSpec's `domainspec-verifier`.

The integration work — fusing these into a single coherent GitOps loop where markdown specs are the desired state, an LLM is the reconciler, and a verifier-as-admission-controller blocks bad merges — has *not been productized*. There is no off-the-shelf "ArgoCD for spec-driven AI systems" as of May 2026. DomainSpec is genuinely on the frontier here. The closest analogs are (a) DSPy's "compile to artifact + checksum" pattern at the prompt-engineering layer, (b) Kratix's GitOps-by-default pattern at the platform layer, and (c) the entire dbt CI ecosystem at the data layer.

The strategic implication: DomainSpec should treat its own pipeline as the reconciler in a two-tree GitOps loop (`docs/` = intent, `src/` + `tests/` + `infra/` = compiled), use a bot-PR pattern to propose regenerated artifacts on every spec change, gate merges on a verifier-as-admission-controller, and adopt a canary pattern for spec rollouts when the blast radius is high (a single `operations.md` edit can re-derive 100+ tests). Prior art is strongest at the prompt layer and weakest at the spec-as-CRD-with-LLM-reconciler layer — DomainSpec will likely have to invent there.

---

## LLM-as-compiler: handling non-determinism in a GitOps loop

**Confidence: MEDIUM-HIGH** (problem and prompt-layer solutions are well-documented; system-level integration into GitOps is sparse.)

The core property GitOps assumes — "given Git state X, the system converges to runtime state Y, deterministically" — is **structurally violated** by LLM compilation. Three orthogonal sources of non-determinism are now well-characterized:

1. **Floating-point + dynamic batching non-associativity** at the inference layer. Even with `temperature=0`, GPU kernels with variable batch sizes produce different logits because reductions happen in different orders ([Thinking Machines Lab on defeating non-determinism](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)). Mitigations exist (batch-invariant operators, [LLM-42 verified speculation](https://arxiv.org/abs/2601.17768)) but are not yet defaults in hosted APIs.
2. **Prompt-driven semantic regression**: a one-line system-prompt change to fix one edge case can degrade unrelated cases ([Braintrust on prompt versioning](https://www.braintrust.dev/articles/what-is-prompt-versioning)).
3. **Model-version drift**: "the same prompt against `claude-opus-4-7` today" is not the same compiler as "the same prompt against `claude-opus-4-7` next month" — providers patch models in-place.

The 2024–2026 community response has converged on four patterns that DomainSpec should consider directly:

| Pattern | What it does | Reference |
|---|---|---|
| **Prompt versioning with linear history** | Treat each system prompt as a versioned artifact with commit SHA, rollback, and provenance. | [Braintrust](https://www.braintrust.dev/articles/what-is-prompt-versioning), [Mirascope](https://mirascope.com/blog/prompt-versioning), [Maxim AI](https://www.getmaxim.ai/articles/top-5-prompt-versioning-platforms-in-2026/) |
| **Golden datasets + eval gates on every prompt PR** | 50–200 frozen input/output pairs run as CI on every prompt commit; fails block merge. | [Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-prompt-management-tools-with-llm-observability-2026), [Agenta CI/CD for prompts](https://agenta.ai/blog/cicd-for-llm-prompts) |
| **Semantic idempotency via output hashing** | Hash semantically-meaningful structure (AST of generated code, sorted JSON of test obligations) rather than raw bytes; "same" if hash matches. | [Redis idempotency for LLMs](https://redis.io/blog/what-is-idempotency-in-redis/) |
| **Compile-and-cache** | DSPy compiles a declarative program into a concrete prompt + few-shot bundle; the *compiled artifact* is the deterministic thing committed to Git, not the program itself. | [DSPy paper](https://arxiv.org/abs/2310.03714), [DSPy framework](https://dspy.ai/) |

The DSPy pattern is particularly relevant: it explicitly separates **the declarative program** (committed, human-edited) from **the compiled artifact** (committed but never hand-edited, regenerated when program or model changes). This is the same intent/compiled split DomainSpec already has between `docs/features/*` and `src/`/`tests/` — DSPy just formalizes it for LLM pipelines and adds a checksum.

For *system-level* GitOps with LLM reconcilers, the literature is thin. [Calmops's 2026 LLMOps architecture guide](https://calmops.com/architecture/llmops-architecture-managing-llm-production-2026/) and [TianPan's gradual-rollout playbook](https://tianpan.co/blog/2026-04-09-llm-gradual-rollout-shadow-canary-ab-testing) describe canary/shadow patterns for *inference traffic*, but nobody published a canonical "LLM-as-compiler in a Git loop" blueprint.

**Implication for DomainSpec:** Pin model+prompt versions per pipeline release, hash the *semantic shape* of derived artifacts (e.g. a sorted YAML of "test obligations: [TX-01, TX-02, ...]") rather than the raw test code, and treat regeneration as idempotent at the semantic-hash level even when bytes differ. A prompt or model change should be a first-class spec change subject to the same canary process as a `SPEC.md` edit.

---

## Spec-as-code precedents (table)

**Confidence: HIGH.** These systems are mature, documented, and battle-tested in production.

DomainSpec is not the first system to declare "the spec is the source of truth, code is generated/derived." The pattern has converged independently across data, infra, API, and platform-engineering domains. Each got something right that DomainSpec should steal.

| System | What's the "spec" | What's compiled | What it got right | What it didn't solve |
|---|---|---|---|---|
| **OpenAPI + codegen** ([openapi-generator](https://github.com/OpenAPITools/openapi-generator), [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen)) | `openapi.yaml` | Server stubs, client SDKs, docs | Clean separation of contract vs. impl; deterministic codegen; ecosystem of generators per language | Spec→business-logic gap is left to humans; generated code is often committed *and* hand-edited (the worst of both worlds) |
| **dbt** ([Slim CI docs](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration), [Datafold guide](https://www.datafold.com/blog/accelerating-dbt-core-ci-cd-with-github-actions-a-step-by-step-guide/)) | `.sql` model files + `.yml` tests | `manifest.json`, materialized tables, derived test pass/fail | `state:modified+` for incremental compile-only-what-changed; manifest-as-artifact pattern; CI compares production manifest to PR manifest | No semantic verifier — passes if SQL parses and tests pass, doesn't check business meaning |
| **Pulumi YAML** ([blog](https://www.pulumi.com/blog/pulumi-yaml/), [docs](https://www.pulumi.com/docs/iac/languages-sdks/yaml/)) | YAML (or any DSL that compiles to YAML) | Cloud resources | Explicit "any DSL → canonical YAML → engine" compile chain; YAML is the contract surface, not the human input | Still imperative under the hood; drift detection but no "regenerate from higher-level intent" |
| **Backstage Software Templates + TechDocs** ([scaffolder docs](https://backstage.io/docs/features/software-templates/), [TechDocs](https://backstage.io/docs/features/techdocs/)) | Template `template.yaml` + skeleton | New repo + initial commit + docs | "Golden path" pattern: org-blessed templates encode best practices; docs-as-code lives next to code | One-shot scaffolding — no continuous reconciliation; templates don't know when they're stale |
| **Crossplane Compositions** ([crossplane.io](https://www.crossplane.io/)) | XR (Composite Resource) YAML + Composition YAML | K8s resources spanning AWS/GCP/Azure | Declarative facade over imperative provider APIs; `kubectl`-native; compositions are themselves K8s resources | K8s-only mental model; YAML-heavy; learning curve |
| **Kratix Promises** ([Kratix docs](https://docs.kratix.io/main/how-kratix-complements/crossplane), [Syntasso](https://www.syntasso.io/post/kratix-and-crossplane)) | Promise YAML + worker pipelines | Whatever the promise produces (could include Crossplane Compositions) | **GitOps out of the box**; Promises can run pre-delegation workflows (security scans, billing checks) — directly analogous to `domainspec-verifier` running before merge | New paradigm; small ecosystem; assumes K8s control plane |
| **DSPy** ([github](https://github.com/stanfordnlp/dspy), [paper](https://arxiv.org/abs/2310.03714)) | Python program declaring `Signatures` + `Modules` | Optimized prompt + few-shot examples + (optionally) finetuned weights | Treats prompts as compile output, not source; reproducibility via seed + dataset + program hash | Single-LLM-call scope; doesn't model multi-stage pipelines like DomainSpec's 10-stage flow |

The two most directly applicable to DomainSpec are **dbt** (manifest-as-artifact, slim-CI for "compile only what changed") and **Kratix Promises** (workflows-before-delegation maps onto verifier-before-merge, GitOps-native). dbt's `state:modified+` selector in particular is the closest analog to "if `operations.md` changes, re-derive only the test obligations downstream of those operations, not the entire test suite."

**Implication for DomainSpec:** Adopt dbt's manifest pattern — emit a `docs/.compiled/manifest.json` per pipeline run that lists every derived artifact with its source-spec hash. Adopt Kratix's pre-delegation workflow pattern — verifier runs *before* artifact regeneration is merged, not after. Avoid OpenAPI's mistake: **never let humans hand-edit generated code in `src/`** — that's where spec-driven systems die.

---

## Bot-PR pattern

**Confidence: HIGH.** This pattern is dominant in dependency management, mature in IaC (Atlantis), and trivially generalizable.

The bot-PR pattern: **machine-generated change is proposed as a pull request, not pushed directly to main**. The PR carries a diff a human can review, CI runs against it, and merge gates apply. This solves the "AI agent commits hallucinated code straight to main" disaster in one move.

Three reference systems set the bar:

- **[Renovate](https://github.com/renovatebot/renovate)** — opens grouped PRs for dependency updates with full changelog context; supports auto-merge for low-risk updates with passing CI; runs across GitHub, GitLab, Bitbucket, Azure DevOps. Renovate's "grouping" feature is notable: instead of 47 separate PRs, one PR per logical unit. ([Renovate vs Dependabot 2026](https://appsecsanta.com/sca-tools/dependabot-vs-renovate))
- **[Dependabot](https://github.com/dependabot/dependabot-core)** — GitHub-native, security-vulnerability-aware, simpler grouping. The dominant pattern is "Dependabot for security alerts, Renovate for everything else."
- **[Atlantis](https://github.com/runatlantis/atlantis)** — listens to PR webhooks, runs `terraform plan` automatically, posts plan as PR comment, requires explicit `atlantis apply` (or approval gate) to mutate cloud state. Production since 2017. ([Atlantis docs](https://www.runatlantis.io/), [Spacelift tutorial](https://spacelift.io/blog/atlantis-terraform-tutorial))

The shared anatomy:

1. **Trigger**: webhook on PR, push, or schedule.
2. **Compute diff**: bot determines what to change.
3. **Open / update PR**: with full context (changelogs, plan output, regenerated diff).
4. **CI gates**: tests, security scans, plan-clean checks.
5. **Merge policy**: human approval, auto-merge for low-risk, or explicit comment command.

Crucially, **the bot never owns main** — it owns its branch and proposes via PR. Direct commits are reserved for emergencies and audited.

For DomainSpec, the natural mapping is: when a `docs/features/<feature>/SPEC.md` (or aspect doc) changes on a feature branch, an `domainspec-bot` opens a paired PR (or pushes commits to the same branch with a `[regen]` prefix) regenerating tests, code stubs, observability specs, and infra deltas. Reviewer sees both intent change and compiled change in one diff. The verifier runs as required CI.

Atlantis's specific contribution is most relevant: **plan as PR comment**. DomainSpec's analog is "test obligation diff as PR comment" — the bot posts "this spec change adds 3 new test obligations (TX-105, TX-106, TX-107), removes 1 (TX-042), and modifies 2 (TX-019, TX-088)" before regenerating any code.

**Implication for DomainSpec:** Build `domainspec-bot` (a GitHub App or Action) that watches `docs/features/*` and `prompts/*` for changes, regenerates affected artifacts on a paired branch, opens/updates a PR with a structured diff comment ("derived obligations changed: ..."), and uses `domainspec-verifier` as a required check. Never let agents push directly to main.

---

## Intent vs. compiled-artifact split

**Confidence: MEDIUM.** The split is a known pattern (dbt, OpenAPI, Pulumi, DSPy all do versions of it); the *staleness check + regen-on-PR + merge gating triad* is not standardized.

The split has three legitimate topologies:

| Topology | Example | Pros | Cons |
|---|---|---|---|
| **Single repo, two trees** | `docs/` + `src/`; this is what DomainSpec does today | Atomic commits across intent + compiled; one PR shows everything | Generated noise in git history; merge conflicts in compiled tree are confusing |
| **Two repos, paired** | App repo (intent) + state repo (compiled K8s manifests) — common ArgoCD layout | Compiled tree is read-only for humans; clean audit; CD tools target state repo | Cross-repo PR coordination is painful; staleness windows; harder to bisect |
| **One repo, generated tree gitignored** | Compile in CI, ship artifact to registry/S3 | No generated noise; clean diffs | Lose Git as audit trail for derived artifacts; bisect of derived behavior impossible |

DomainSpec's current single-repo two-tree layout is the right choice for its scale and audit needs. The unsolved problems are:

**1. Staleness detection.** *"Is `src/payment/process.ts` still consistent with `docs/features/payment/operations.md`?"* dbt solves this with `manifest.json` hashes. Pulumi solves it with `pulumi preview`. ArgoCD solves it with continuous reconciliation diff. DomainSpec needs an equivalent: a `docs/.compiled/manifest.json` or per-artifact `@source-hash` annotations recording which spec hash produced which file. CI fails if any compiled file's recorded source-hash ≠ current source hash AND no regen PR is open.

**2. Regen-on-PR.** When a spec changes on branch `feature/payment-retry`, who runs the regen? Three options:
  - **Local dev runs `domainspec-pipeline`** before pushing — fast feedback but inconsistent (different model versions, different agent skill versions).
  - **CI runs regen and pushes back to the same branch** — consistent but creates the "CI commits to your branch" UX confusion.
  - **CI opens a paired PR** — cleanest separation, matches Renovate/Dependabot, but doubles PR count.

  The Atlantis precedent suggests option 2 with a clear marker (`[regen]` commit prefix, bot signature). Renovate suggests option 3.

**3. Merge gating.** Verifier runs on the *post-regen* state. If regen produces FLAG or BLOCK, merge is disabled until either spec is fixed or compiled artifacts are corrected.

The [GitOps repository structure literature](https://platform.cloudogu.com/en/blog/gitops-repository-patterns-part-3-repository-patterns/) and [Pulumi's GitOps best practices](https://www.pulumi.com/blog/gitops-best-practices-i-wish-i-had-known-before/) discuss monorepo vs polyrepo, but neither addresses the LLM-regen case specifically.

**Implication for DomainSpec:** Stay single-repo two-tree. Add a `docs/.compiled/manifest.json` that maps every file in `src/`, `tests/`, `infra/` to (spec_hash, prompt_hash, model_version). CI fails on staleness; bot opens a regen PR (or pushes to the active branch with a clear marker); verifier runs as required check on the post-regen state.

---

## Agents-as-controllers

**Confidence: LOW-MEDIUM.** Operator pattern is HIGH-confidence in K8s; **the application of the controller-reconciler pattern to non-K8s domains with markdown CRDs and LLM reconcilers is genuinely sparse in the literature.** Be skeptical of anything claiming 2026 maturity here.

The Kubernetes operator pattern is well-defined: a CRD declares desired state, a controller's `Reconcile()` loop watches, observes actual state, computes a diff, and acts to converge. ([Kubernetes operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/), [Beyond YAML guide](https://dev.to/naveens16/beyond-yaml-building-kubernetes-operators-with-crds-and-the-reconciliation-loop-524d)) The reconciler must be **idempotent** — `Reconcile(state)` called twice yields the same result.

Mapping to DomainSpec:

| K8s | DomainSpec |
|---|---|
| CRD (e.g. `Deployment`) | `SPEC.md` + aspect docs (the feature pack) |
| Custom Resource instance | A specific `docs/features/payment/` |
| Controller | `domainspec-pipeline` (the orchestrating agent) |
| `Reconcile()` loop | Run pipeline → generate tests → implement → verify |
| Actual state | `src/`, `tests/`, `infra/`, OTel traces |
| Observability of reconciliation | `docs/signals/pipeline-signals.jsonl` |

The non-K8s precedents are **thin**:
- **Backstage TechDocs** ([docs](https://backstage.io/docs/features/techdocs/)) is a docs-like-code system with build-on-push, but it's a one-way build (docs → HTML), not a reconciler.
- **Backstage Scaffolder** is one-shot code generation, not continuous reconciliation. ([Red Hat scaffolder guide](https://developers.redhat.com/articles/2025/08/12/build-your-first-software-template-backstage))
- **Kratix Promises** ([Syntasso](https://www.syntasso.io/post/kratix-and-crossplane)) is the closest thing — Promises run pipelines on every reconcile, can include arbitrary worker logic, and are GitOps-native. Kratix runs *on* K8s but treats K8s as a generic workflow engine, not a target.
- **kpt** with [Configuration GUI over GitOps](https://backstage.io/plugins/) is mentioned in Backstage docs as a WYSIWYG-over-GitOps pattern.
- **Agent frameworks**: [Mastra](https://mastra.ai/) explicitly supports "deterministic LLM workflows" where execution path is locked at build time, which is closer to a reconciler than the typical "agentic" loop. ([Mastra 2026 guide](https://www.generative.inc/mastra-ai-the-complete-guide-to-the-typescript-agent-framework-2026)) [LangGraph](https://www.langchain.com/langgraph) and DSPy provide similar deterministic-graph guarantees over LLM calls.

What does *not* yet exist (as of May 2026): a productized "watch this directory of markdown CRDs, when one changes invoke an LLM reconciler that produces idempotent compiled artifacts, with a controlled reconciliation loop and observability." DomainSpec's `domainspec-orchestrator` is closer to this than anything in the public ecosystem.

The big honesty caveat: **LLM reconcilers are not idempotent by default**. The Conant-Ashby Good Regulator constraint cited in DomainSpec's own [GOVERNANCE-ATTENUATION.md](../../../GOVERNANCE-ATTENUATION.md) applies here too — the agent that does the reconciliation cannot reliably observe its own blind spots. Operator-pattern semantics need to be enforced at the *artifact* layer (semantic hashes match) since they cannot be enforced at the *agent* layer (same prompt → same output) without infra-layer fixes (LLM-42, batch-invariant operators).

**Implication for DomainSpec:** The `domainspec-pipeline` *is* the reconciler — formalize it. Document the reconcile contract: input = spec hash; output = (compiled artifacts, semantic hash, verdict). Make idempotency a property of the *artifact comparison*, not the agent. Borrow Mastra's "deterministic workflow" pattern for the orchestration spine, leaving non-determinism only inside individual derivation steps where it's bounded by golden-dataset evals.

---

## Verifier as admission webhook

**Confidence: HIGH.** Pattern is mature in K8s policy-as-code; mapping to DomainSpec is direct.

Kubernetes admission controllers intercept API requests after auth/authz but before persistence to etcd; they can validate (block bad requests) or mutate (defaults, normalization). ([Microsoft on admission webhooks](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/zero-trust-kubernetes-enforcing-security--multi-tenancy-with-custom-admission-we/4466646)) The two dominant policy engines:

- **OPA Gatekeeper** ([dev.to comparison](https://dev.to/hkhelil/admission-controllers-in-kubernetes-opa-gatekeeper-kyverno-and-azure-policy-add-on-for-aks-which-one-wins-237d)) — uses Rego DSL, CNCF graduated, latest v3.22.0 (March 2026), now defaults to ValidatingAdmissionPolicy enforcement.
- **Kyverno** ([oneuptime guide](https://oneuptime.com/blog/post/2026-02-09-policy-as-code-kyverno-opa/view), [Adevinta migration story](https://adevinta.com/techblog/why-did-we-transition-from-gatekeeper-to-kyverno-for-kubernetes-policy-management/)) — YAML-native policies, no DSL; policies are themselves K8s resources; supports validate, mutate, generate, verifyImages.

The 2026 best practice is **hybrid**: Kyverno for the 80% YAML-expressible policies, OPA for complex Rego decisions.

The DomainSpec mapping:

| Admission webhook | DomainSpec verifier |
|---|---|
| Validating webhook (block) | `domainspec-verifier` returns BLOCK → required-check fails → merge disabled |
| Mutating webhook (mutate) | `domainspec-bot` regen normalizes spec format, fills templated fields |
| Policy resource (declarative) | DomainSpec rules in `TEST-PIPELINE.md`, `OBSERVABILITY.md`, `CONSTITUTION.md` are themselves the policies |
| FailurePolicy | PASS / FLAG / BLOCK verdict mirrors `Allow` / `Warn` / `Deny` |

The PASS / FLAG / BLOCK trichotomy DomainSpec already uses ([README §Stage 10](../../../README.md#stage-10--verify--readiness)) maps cleanly onto policy-as-code semantics. FLAG is particularly valuable — admission webhooks have a `Warn` mode, and Kyverno supports policy reports for non-blocking findings, which match DomainSpec's "ship but track" semantic.

The architectural payoff: **stop treating verification as a final pipeline stage and start treating it as a gate at every state-mutation boundary**. Spec change → verifier on the spec. Test regen → verifier on the test set. Code regen → verifier on the code. Each is an admission point.

[Coding_Karma's drift remediation pipeline (March 2026)](https://medium.com/@codingkarma/building-a-gitops-drift-detection-auto-remediation-pipeline-with-argocd-github-actions-and-f72545c63fdf) explicitly combines ArgoCD + Kyverno + GitHub Actions in this layered way: "CI catches issues at PR time but not kubectl edits; Kyverno blocks bad configs at admission; ArgoCD reverts runtime drift." The same three-layer defense maps to DomainSpec: alignment-auditor at PR time, verifier as admission, OTel `O15`/`O16` financial-integrity rules as runtime drift detection.

**Implication for DomainSpec:** Promote `domainspec-verifier` from a Stage-10 finale to a CI required check that runs on every artifact-mutation PR. Express each verification policy as a structured rule (analogous to a Kyverno policy CR) so policies themselves are versioned, diffable, and testable. PASS/FLAG/BLOCK becomes the admission verdict.

---

## Progressive delivery for spec changes

**Confidence: MEDIUM.** Canary patterns for runtime traffic are HIGH-confidence (well-established for code/models); canary patterns for *spec changes whose blast radius is N derived tests + M files of regenerated code* are LOW-confidence — DomainSpec is genuinely on the frontier.

Standard progressive delivery is well-known: roll a new code/config version to 1% → 5% → 25% → 100% with automatic rollback on metric breach. ([Dynatrace + OpenFeature guide](https://www.dynatrace.com/news/blog/progressive-delivery-done-right/), [Harness "Four Shades"](https://www.harness.io/blog/learn-the-four-shades-of-progressive-delivery), 2026 [AI-powered progressive delivery](https://azati.ai/blog/ai-powered-progressive-delivery-feature-flags-2026/)) For LLMs specifically, [TianPan's playbook](https://tianpan.co/blog/2026-04-09-llm-gradual-rollout-shadow-canary-ab-testing) and [Duckweave's 12-pattern guide](https://medium.com/@duckweave/canary-calm-rollback-fast-12-ml-deployment-patterns-d893d501041f) cover shadow-mode, canary, and A/B for inference traffic.

But DomainSpec faces a *different* blast-radius problem: **a single edit to `operations.md` re-derives 100+ test obligations, regenerates implementation code, modifies observability metrics, and changes Prometheus alerts** ([README §Stage 4](../../../README.md#stage-4--derive-tests-from-documentation)). The blast radius is at *compile time*, not runtime. There is essentially no published prior art on canarying *spec changes* in this sense.

The closest analogs:
- **dbt's `state:modified+`** limits blast radius to *only changed models and downstream*. This is the "scope the recompile" pattern. ([Datafold's slim-CI guide](https://www.datafold.com/blog/accelerating-dbt-core-ci-cd-with-github-actions-a-step-by-step-guide/))
- **Feature flags on derived behavior**: derive both old and new behavior, gate via flag, ramp traffic. Works for runtime behavior, not for "did the regenerated test suite break a previously-passing invariant."
- **Shadow mode**: run new spec's derived code in parallel, compare outputs, never serve user traffic from it. Requires a runtime that supports dual-execution.

A DomainSpec-native progressive delivery model would look like:

1. **Scope detection**: when `operations.md` changes, compute the "obligation diff" — added/removed/changed tests, files, metrics. Post as PR comment.
2. **Risk classification**: small diffs (≤5 obligations) auto-merge if verifier PASSes; medium (6–25) require human review; large (>25) require staged rollout.
3. **Staged rollout for large changes**: split into multiple PRs by aspect file (domain → operations → states → events) so each merge is bounded.
4. **Shadow regeneration**: optionally generate twice with different seeds/prompts, diff the outputs, only proceed if semantic-hash matches.
5. **Runtime canary** for the implementation: standard 1% → 100% on the actual deployed code, with OTel `O1`–`O7` (Domain Fidelity) metrics as canary signals.

**Implication for DomainSpec:** Add an "obligation diff" step to the bot-PR flow that quantifies blast radius before regeneration. Auto-merge tiny changes; require explicit "ramp" labels for large ones. For truly risky spec changes (e.g. invariant edits in `pillar: finance` features), require shadow regeneration with hash-match before merge. This is a place DomainSpec should *write the playbook*, because nobody else has.

---

## Open problems (where the literature is thin — be honest)

These are the places where DomainSpec will *not* find prior art and will have to invent. Confidence on each: **LOW**.

1. **Reconciliation idempotency for LLM-driven derivation.** Operator pattern requires `Reconcile(state) == Reconcile(Reconcile(state))`. LLMs do not provide this without additional infra (LLM-42, batch-invariant kernels, or strict caching). Workarounds via semantic hashing are pragmatic but not principled. **Open question:** what's the right invariant — bit equality, structural equality (AST), behavioral equality (same tests pass), or semantic equality (same business meaning)? Each has a different cost/correctness tradeoff. No public framework solves this end-to-end yet.

2. **Spec-change blast radius modeling.** No published model lets you statically predict, "this edit to `R7` in `operations.md` will affect tests TX-019, TX-042, TX-088; will mutate metrics M_payment_rejection_rate; will not affect infra." DomainSpec's [TEST-PIPELINE.md](../../../TEST-PIPELINE.md) derivation rules are the closest thing — they're deterministic per-row mappings — but no tool yet computes the diff incrementally at PR time.

3. **Verifier-as-LLM honesty.** [GOVERNANCE-ATTENUATION.md](../../../GOVERNANCE-ATTENUATION.md) already documents the Conant-Ashby and Gödel limits: a verifier that's an LLM cannot fully verify itself or systems containing it. Public literature on this in production systems is essentially non-existent. The mitigation is multi-verifier consensus or human-in-the-loop for high-stakes verdicts; neither is well-tooled.

4. **Cross-feature spec coupling.** When `payment.ProcessPayment` references `shared.Money`, a change to `shared.Money` should re-verify all 47 features that reference it. K8s reconciliation handles cross-resource dependencies via owner references; DomainSpec has no equivalent. No published spec-driven framework solves this cleanly.

5. **Audit trail for "why did the agent generate this?"** When a regen PR contains "this code was wrong," the post-mortem question is "which prompt + which model + which retrieved context?" Provenance tooling exists for prompts ([LangSmith](https://www.langchain.com/langsmith), [Langfuse](https://langfuse.com/)) but is not yet integrated into Git-as-source-of-truth audit flows. DomainSpec's `docs/signals/pipeline-signals.jsonl` is closer than most — extend it.

6. **Rollback semantics for spec changes.** Code rollback is `git revert`. Spec rollback should be `git revert` *plus* regenerate-from-reverted-spec — but the verifier may now pass on the regenerated artifacts even though the *underlying behavior* differs from the original (because the LLM produces different output now). There's no published practice for this.

7. **Multi-agent merge conflicts.** When two agents (or agent + human) edit the same spec on different branches, merge becomes semantic, not textual. No public prior art beyond "use a human."

---

## Sources

**LLM-as-compiler and prompt versioning:**
- [Defeating Nondeterminism in LLM Inference — Thinking Machines Lab](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- [LLM-42: Enabling Determinism in LLM Inference with Verified Speculation (arXiv 2601.17768)](https://arxiv.org/abs/2601.17768)
- [What is prompt versioning? — Braintrust](https://www.braintrust.dev/articles/what-is-prompt-versioning)
- [Five Tools to Help You Leverage Prompt Versioning — Mirascope](https://mirascope.com/blog/prompt-versioning)
- [Top 5 Prompt Versioning Platforms in 2026 — Maxim AI](https://www.getmaxim.ai/articles/top-5-prompt-versioning-platforms-in-2026/)
- [5 Best AI Prompt Management Tools with Built-In LLM Observability in 2026 — Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-prompt-management-tools-with-llm-observability-2026)
- [CI/CD for LLM Prompts — Agenta](https://agenta.ai/blog/cicd-for-llm-prompts)
- [LLMOps Architecture 2026 — Calmops](https://calmops.com/architecture/llmops-architecture-managing-llm-production-2026/)
- [What is idempotency in Redis? Cost-saving patterns for LLM apps](https://redis.io/blog/what-is-idempotency-in-redis/)
- [DSPy: Compiling Declarative Language Model Calls (arXiv 2310.03714)](https://arxiv.org/abs/2310.03714)
- [DSPy framework](https://dspy.ai/) · [DSPy GitHub](https://github.com/stanfordnlp/dspy)

**Spec-as-code precedents:**
- [openapi-generator](https://github.com/OpenAPITools/openapi-generator) · [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen)
- [dbt Continuous Integration docs](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) · [dbt CI jobs](https://docs.getdbt.com/docs/deploy/ci-jobs)
- [Accelerating dbt CI/CD with GitHub Actions — Datafold](https://www.datafold.com/blog/accelerating-dbt-core-ci-cd-with-github-actions-a-step-by-step-guide/)
- [Pulumi YAML blog](https://www.pulumi.com/blog/pulumi-yaml/) · [Pulumi YAML reference](https://www.pulumi.com/docs/iac/languages-sdks/yaml/yaml-language-reference/)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) · [TechDocs](https://backstage.io/docs/features/techdocs/) · [Build your first Software Template — Red Hat](https://developers.redhat.com/articles/2025/08/12/build-your-first-software-template-backstage)
- [Crossplane](https://www.crossplane.io/)
- [Kratix and Crossplane — official docs](https://docs.kratix.io/main/how-kratix-complements/crossplane) · [Kratix and Crossplane — Syntasso](https://www.syntasso.io/post/kratix-and-crossplane)
- [Mastra AI complete guide 2026](https://www.generative.inc/mastra-ai-the-complete-guide-to-the-typescript-agent-framework-2026) · [LangChain on agent frameworks and observability](https://blog.langchain.com/on-agent-frameworks-and-agent-observability/)

**Bot-PR pattern:**
- [Renovate GitHub](https://github.com/renovatebot/renovate) · [Renovate bot comparison](https://docs.renovatebot.com/bot-comparison/)
- [Dependabot vs Renovate 2026](https://appsecsanta.com/sca-tools/dependabot-vs-renovate)
- [Atlantis GitHub](https://github.com/runatlantis/atlantis) · [Atlantis homepage](https://www.runatlantis.io/) · [Atlantis tutorial — Spacelift](https://spacelift.io/blog/atlantis-terraform-tutorial)

**Intent vs. compiled-artifact split:**
- [GitOps Best Practices I Wish I Had Known Before — Pulumi](https://www.pulumi.com/blog/gitops-best-practices-i-wish-i-had-known-before/)
- [GitOps Repository Structures and Patterns — Cloudogu](https://platform.cloudogu.com/en/blog/gitops-repository-patterns-part-3-repository-patterns/)
- [How to set up your GitOps directory structure — Red Hat](https://developers.redhat.com/articles/2022/09/07/how-set-your-gitops-directory-structure)
- [Ways of structuring your repositories — Flux](https://fluxcd.io/flux/guides/repository-structure/)

**Agents-as-controllers:**
- [Operator pattern — Kubernetes docs](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [Beyond YAML: Building Kubernetes Operators with CRDs and the Reconciliation Loop](https://dev.to/naveens16/beyond-yaml-building-kubernetes-operators-with-crds-and-the-reconciliation-loop-524d)
- [Common recommendations — Operator SDK](https://sdk.operatorframework.io/docs/best-practices/common-recommendation/)
- [Mastra docs](https://mastra.ai/) · [LangGraph](https://www.langchain.com/langgraph)

**Verifier as admission webhook:**
- [Admission Controllers in Kubernetes: OPA GateKeeper, Kyverno, and Azure Policy](https://dev.to/hkhelil/admission-controllers-in-kubernetes-opa-gatekeeper-kyverno-and-azure-policy-add-on-for-aks-which-one-wins-237d)
- [Kubernetes Policy as Code with OPA Gatekeeper](https://medium.com/@DynamoDevOps/kubernetes-policy-as-code-with-opa-gatekeeper-31084ba217cb)
- [How to Build Policy as Code Frameworks for Kubernetes — Oneuptime](https://oneuptime.com/blog/post/2026-02-09-policy-as-code-kyverno-opa/view)
- [Why Adevinta transitioned from Gatekeeper to Kyverno](https://adevinta.com/techblog/why-did-we-transition-from-gatekeeper-to-kyverno-for-kubernetes-policy-management/)
- [Building a GitOps Drift Detection & Auto-Remediation Pipeline with ArgoCD, GitHub Actions, and Kyverno (March 2026)](https://medium.com/@codingkarma/building-a-gitops-drift-detection-auto-remediation-pipeline-with-argocd-github-actions-and-f72545c63fdf)
- [Zero-Trust Kubernetes: Custom Admission Webhooks — Microsoft](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/zero-trust-kubernetes-enforcing-security--multi-tenancy-with-custom-admission-we/4466646)

**Progressive delivery for spec changes:**
- [AI-Powered Progressive Delivery 2026 — Azati](https://azati.ai/blog/ai-powered-progressive-delivery-feature-flags-2026/)
- [Progressive delivery done right with feature flags and OpenFeature — Dynatrace](https://www.dynatrace.com/news/blog/progressive-delivery-done-right/)
- [Four Shades of Progressive Delivery — Harness](https://www.harness.io/blog/learn-the-four-shades-of-progressive-delivery)
- [Releasing AI Features Without Breaking Production: Shadow Mode, Canary, A/B Testing for LLMs (April 2026)](https://tianpan.co/blog/2026-04-09-llm-gradual-rollout-shadow-canary-ab-testing)
- [Canary Calm, Rollback Fast: 12 ML Deployment Patterns (Feb 2026)](https://medium.com/@duckweave/canary-calm-rollback-fast-12-ml-deployment-patterns-d893d501041f)
- [Canary Deployments for Securing Large Language Models](https://medium.com/@oracle_43885/canary-deployments-for-securing-large-language-models-48393fa68efc)

**DomainSpec internal references:**
- [README.md](../../../README.md) · [AUTHORITY-MAP.md](../../../AUTHORITY-MAP.md) · [DRIFT-CONVERGENCE.md](../../../DRIFT-CONVERGENCE.md) · [TUNING-LOOP.md](../../../TUNING-LOOP.md) · [GOVERNANCE-ATTENUATION.md](../../../GOVERNANCE-ATTENUATION.md) · [TEST-PIPELINE.md](../../../TEST-PIPELINE.md) · [OBSERVABILITY.md](../../../OBSERVABILITY.md)
