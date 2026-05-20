---
tags: [briefing, infra, gitops, telemetry, product]
node_type: conceptual
is_session: false
layer: architecture
nature: explanatory
status: draft
version: 0.2.0
last_updated: 2026-05-19
---

# TOBANOV — What we need to build, and why

Briefing for a SWE who is new to this repo. No theory. Just: what is DomainSpec, how it runs, what already works, what hurts today, what we probably need to build next, and what shape this could take as a real product.

---

## What DomainSpec is, in one paragraph

DomainSpec is a **meta-framework for spec-driven development with LLM agents**. It is not a runtime, not a library you import at compile time. It is a folder of (a) markdown templates, (b) agent prompts, and (c) skills (callable workflows). You drop it into a project as a **git submodule**. The project then writes feature specs in a fixed vocabulary; the agents generate tests, code, OTel instrumentation, and deploy artifacts from those specs.

The bet is: if specs are machine-readable enough, the gap between "what the product is supposed to do" and "what the code actually does" collapses, and an LLM can keep them in sync.

---

## How it actually runs (before you read further)

- **Substrate:** the framework is 95% **markdown + YAML frontmatter**. The rest is small bash/TS/Python helpers (`internal_tools/`, scripts under `.claude/`).
- **Host:** today, all agents and skills run inside **Claude Code** (Anthropic's CLI/IDE harness). A "skill" is a markdown file under `.claude/skills/<name>/SKILL.md` that the harness loads when invoked as `/skill-name`. An "agent" is a markdown file under `.claude/agents/<name>.md` with a charter and tool surface.
- **Boundary:** the framework owns `templates/`, `.claude/agents/`, `.claude/skills/`, `internal_tools/`, `vault/`. A consumer repo owns `docs/features/`, `docs/registry.md`, `docs/glossary.md`, `docs/vault/`. The submodule sits at `domainspec/` inside the consumer.
- **Invocation, end to end:** consumer SWE types `/domainspec-pipeline <feature-name>` in Claude Code → the skill calls a chain of agents (interviewer → planner → spec-writer → test-designer → implementer → verifier) → each agent reads/writes markdown in `docs/features/<feature>/` → registry sync at the end → optional infra/deploy/observability stages.
- **What this means for you:** there is no `npm install`, no build, no daemon. If you want to see the system work, open `house_project` in Claude Code and run `/domainspec-help`. There is no test suite that exercises the framework end-to-end — quality is asserted by agents reading each other's markdown.

That last sentence is the single most important thing about this codebase. Everything below follows from it.

---

## What already works (so you don't reinvent it)

| Area | What's there | Where |
|---|---|---|
| Spec authoring | Templates for SPEC, operations, states, events, workflows, observability, SLOs | [templates/](templates/) |
| Agent fleet | ~45 agents — interviewer, planner, implementer, verifier, OTel instrumenter, infra architect, etc. | [.claude/agents/](.claude/agents/) |
| Skills (workflows) | `domainspec-init`, `domainspec-pipeline`, `domainspec-sync-registry`, `domainspec-infra-architecture`, … | [.claude/skills/](.claude/skills/) |
| Registry/glossary derivation | SPEC concept tables → `docs/registry.md` + `docs/glossary.md` (manual trigger) | [.claude/skills/domainspec-sync-registry/](.claude/skills/domainspec-sync-registry/) |
| OTel derivation rules | "If your spec has X, your metrics must include Y" — O1–O14 (general) + O15–O16 (finance-pillar specific) | [OBSERVABILITY.md](OBSERVABILITY.md) |
| Infra presets | Dev / Single VPS / Split VPS / HA on DO + Pulumi/TS + Caddy + Prometheus | [.claude/skills/domainspec-infra-architecture/](.claude/skills/domainspec-infra-architecture/) |
| Signal log | Every agent session appends JSONL signals (gaps, rework, proposals) | [templates/SIGNAL-SCHEMA.md](templates/SIGNAL-SCHEMA.md), [.claude/skills/domainspec-emit-signals/](.claude/skills/domainspec-emit-signals/) |
| Pattern detector | Async job reads the signal log, computes metrics, proposes tuning | [.claude/skills/domainspec-reflect/](.claude/skills/domainspec-reflect/) |

---

## The four problems we need to solve, ranked

### Problem 1 — We have no versioning story

**What hurts today.** The framework has a `CHANGELOG.md` (v2.1.0) but **no git tags** (`git tag` returns empty). Consumers pin to a commit hash via submodule. `house_project` is pinned at `6401bda`. There is no compatibility matrix saying "consumer schema vN works with framework vM." Breaking changes to taxonomy, template field names, or agent contracts land silently. A consumer's pipeline can break the next time they run `git submodule update` and we have no story for them other than "read the changelog."

**What we need to build.**
1. Tag framework releases (`git tag v2.1.0 && git push --tags`). Trivial, do this week.
2. A compatibility manifest at the framework root. Concretely:
   ```yaml
   # domainspec.manifest.yaml
   framework_version: 2.1.0
   schemas:
     template: 3
     signal: 2
     registry: 1
   min_consumer_state: 2
   breaking_changes:
     - "template.observability.attributes renamed from `dims` (v3)"
   ```
3. A `domainspec-doctor` skill that reads the consumer's `.domainspec/state.yaml`, diffs against the manifest, and prints a migration plan. Output shape:
   ```
   framework: v2.1.0   consumer: v1.4.0 (pinned at 6401bda)
   registry schema: v1 ok
   template schema: v2 → v3 migration needed
     - rename `dims` → `attributes` in 4 files: docs/features/*/observability.md
   ```
4. A deprecation policy in `CONTRIBUTING.md`: one minor version of warning before a template field is removed; deprecations listed in `manifest.yaml`.

**Why this is #1.** Every other improvement is undeployable to consumers until they can upgrade safely. Right now upgrading is "pray nothing broke."

---

### Problem 2 — There is no reconciliation loop (no real GitOps)

**What hurts today.** "GitOps" in this repo today means "you, the human, run `domainspec-sync-registry` when you remember to." There is no declarative artifact saying *what a consumer is supposed to have*, and no detector that compares actual to desired and warns on drift. Concretely:

- A consumer adds a concept to `SPEC.md` but forgets to re-run sync → `registry.md` is stale → downstream agents (test generator, verifier) operate on the wrong concept set.
- A consumer's `observability.md` lists six metrics; the implemented code emits four. Nothing flags it until someone manually runs the OTel verifier.
- A consumer is six framework versions behind on templates. No one knows.

**What we need to build.**
1. A **desired-state file per consumer**, e.g.:
   ```yaml
   # .domainspec/state.yaml
   framework_version: 2.1.0
   features:
     - name: house-budget
       active: true
       infra_preset: single-vps
   skills_enabled: [pipeline, sync-registry, infra-architecture, reflect]
   skills_disabled: [otel-instrumenter]   # opt-out per consumer
   ```
2. A **drift detector** runnable as `domainspec drift` (CLI) or as a GitHub Action. Output shape:
   ```json
   {
     "framework_drift": {"declared": "2.1.0", "actual": "1.4.0"},
     "registry_drift": ["concept `RemittanceFile` in SPEC, missing in registry"],
     "observability_drift": [{"feature": "house-budget", "declared": 6, "emitted": 4}]
   }
   ```
3. **Pre-commit hooks** (installed by `domainspec init`) that block obvious sins: committing a SPEC change without re-syncing the registry; committing infra-architecture changes without regenerating `prometheus.yml`.
4. A clear escalation path: drift → warning → CI failure. Today everything is a warning, which means nothing is.

**Why this is #2.** Without it, the framework's promise ("specs and code stay in sync") is aspirational. The whole pitch leaks here.

---

### Problem 3 — The infra story only covers one shape of project

**What hurts today.** The infra-architect agent is hard-coded to **DigitalOcean + Pulumi/TS + Caddy + Docker Compose**. It has four presets (Dev → HA) graduated along that single axis. But our actual live production stack on at least one project is **GCP + Cloud Run + Terraform** (see [.claude/skills/custom/infrastructure-guide.md](.claude/skills/custom/infrastructure-guide.md)). If a brownfield project on GCP runs `domainspec-infra-architecture`, the output is wrong — different IaC, different runtime, different networking model.

Also hand-waved within the supported path:
- "Preset" graduation rules are prose, not a decision policy. Nothing validates that the chosen preset matches the project's actual scale.
- Multi-environment (`staging` vs `production`) is named in the template but the mechanism for per-env config, secrets, and promotion gates is not specified.
- Health checks are mandatory but undefined — endpoint, response code, retry policy.
- Local dev parity with prod is undefined — Compose locally, Compose on a VPS is close, but secrets injection and DNS behavior differ.
- Observability auto-generation assumes the spec is complete; if the spec is empty, you get an empty `prometheus.yml` with no warning.

**What we need to build.**
1. Split the infra-architect into **runtime-target plugins** with a common interface:
   ```
   .claude/skills/domainspec-infra-architecture/
     backends/
       do-pulumi/      ← current implementation, refactored
       gcp-terraform/  ← new
       aws-cdk/        ← stub
       compose-bare/   ← for local-only
     interface.md      ← inputs: state.yaml, observability.md; outputs: IaC dir, prometheus.yml, deploy.yml
   ```
2. Preset selection as a real decision tree backed by signals from `state.yaml` (traffic estimate, team size, compliance requirements) — not a vibes table.
3. A multi-env contract `environments.yaml`:
   ```yaml
   environments:
     production: {secrets_source: pulumi, promotion_gate: manual_approval, branch: main}
     staging:    {secrets_source: pulumi, promotion_gate: ci_green,        branch: staging}
   ```
4. A "spec completeness gate" before generating deploy artifacts — if `observability.md` is empty, the generator refuses; doesn't silently produce empty config.

**Why this is #3.** Until this is fixed, DomainSpec can only be adopted by greenfield projects that match its narrow path. That is most of our growth ceiling.

---

### Problem 4 — Telemetry is a three-loop design with only the first loop closed

**What hurts today.** The telemetry design has three loops:

1. **Spec → OTel instrumentation in code.** Wired conceptually; the instrumenter agent reads `observability.md` and inserts instruments. **Works, but** the instrumenter infers code locations from naming conventions — it's brittle.
2. **Agent session → signal log.** Every agent emits a structured signal at end-of-session into a JSONL log. **Schema and append work.** What does *not*: agents do not read recent signals at the start of a session to adjust behavior. The loop is observation-only.
3. **Signal log → tuning proposals → framework changes.** `domainspec-reflect` reads the log, computes metrics, detects patterns (TH1–TH8 thresholds), proposes changes to skills/templates. **Detection works.** Mutation does not — proposals are written as markdown for a human to apply by hand.

**What we need to build.**
1. **Live signal consumption.** Agent preamble queries `pipeline-signals.jsonl` for similar recent tasks. Example envelope it would read:
   ```json
   {"type": "rework", "step": "implementer", "feature": "house-budget",
    "severity": "MEDIUM", "data": {"retries": 3, "cause": "ambiguous spec"}}
   ```
   If rework rate for `implementer` over the last 20 runs >30%, the implementer agent starts by asking clarifying questions.
2. **Auto-apply low-risk tuning proposals.** Threshold tweaks, template wording fixes, and prompt edits below a `risk_score` bar land as PRs against the framework, with a human reviewer; not hand-edited markdown.
3. **Coverage gate on the first loop.** A feature whose `observability.md` declares N metrics but whose code emits M < N should **block** the verify step. Today it warns.
4. **Cardinality budget.** Nothing in the OTel pipeline today caps cardinality. A spec with one bad attribute (e.g., `user_id` as a label) can blow up Prometheus. Add a per-metric cardinality declaration in the template.
5. **Signal log retention.** It grows forever — no rotation, no archival, no "historical" cutoff. Add a rolling window + an archived parquet for reflect to query.

**Why this is #4.** This is the "framework learns from its own use" promise. Without closing loops 2 and 3, every consumer rediscovers the same gaps independently and we cannot tell.

---

## Build order (dependency graph, not estimates)

```
P1 (versioning)  ──┬──> P2 (drift detector)  ──> P4 (live signals + auto-tune)
                   │
                   └──> P3 (infra backends)
```

Rationale, not timing:

- **P1 first.** Until releases are tagged and a manifest exists, nothing else has a stable surface to detect drift against. This is mostly mechanical work but blocking.
- **P2 follows P1.** The drift detector needs the manifest as its "desired" side. With P1 done, the detector is the smallest interesting CLI you can ship.
- **P3 is independent** — runtime-backend plugins can be developed in parallel by anyone who knows GCP/AWS. Don't sequence it behind P1/P2 unless headcount forces it.
- **P4 follows P2.** Live signal consumption is most useful once drift signals exist and are trustworthy. Doing P4 before P2 means agents adjust on noisy data.

Assumptions baked in: a single SWE picks this up; Claude Code remains the harness; no consumer demands a non-supported infra backend before P3 lands. If any of those breaks, the order changes.

---

## What DomainSpec could be as a product

Today DomainSpec is **internal tooling distributed by git submodule** — useful for the people who built it, friction-heavy for anyone else. To be a product, it has to answer four questions that today it does not.

**Who is the user?** Most plausible: a tech lead at a 5–50-person team who feels the pain of spec-vs-code drift and is already using an LLM agent (Claude Code, Cursor, Aider) in the loop. Not solo hackers (the overhead is too high) and not large orgs (they will build their own). The wedge is "you already write design docs that go stale; this makes them not go stale."

**What does the product surface look like, minimally?**

1. **A CLI binary** — `domainspec` installed via `pipx` or `npm i -g`. Subcommands: `init`, `doctor`, `drift`, `sync`, `pipeline`. The current skills become CLI verbs; the CLI just shells out to the LLM harness (Claude Code, or a `--harness=anthropic-api` mode that talks to the API directly).
2. **Versioned templates as a package**, not as a submodule. `domainspec init` pulls `templates/` from a tagged release; consumer never carries the framework code in their repo.
3. **A control plane (optional, paid tier).** A hosted dashboard that aggregates `pipeline-signals.jsonl` across multiple repos and shows tuning proposals across an org. This is also where the auto-tune PR bot lives. The open-source CLI works without it.
4. **LLM-agnostic by design.** No baked-in provider. The harness layer is a plugin: `--harness=claude-code` (default), `--harness=anthropic-api`, `--harness=openai`, `--harness=local-llama`. This is non-negotiable for adoption.

**Where is the moat?** Not in the templates (anyone can copy them). Not in the agents (prompts leak). The moat is **the signal-and-tuning loop running across many repos**. The more projects emit signals, the better the framework's own tuning gets, the better the templates become. That requires a hosted control plane and willingness to share signals (opt-in, anonymized).

**What is the MVP that proves "is this a product?"**

1. CLI binary with `init`, `doctor`, `drift` — i.e. P1 + P2 from the problem list, packaged.
2. Templates installed by version, not by submodule.
3. Three example consumer repos, public, that show the full loop on a real domain (one finance, one consumer SaaS, one internal tools).
4. A landing page with a 90-second demo: write a spec → run pipeline → watch tests + code + OTel land → make a spec change → watch drift detector flag the divergence.

**What probably kills it as a product if not addressed.**

- **Anthropic dependence.** Today's harness is Claude Code; if pricing or API access shifts, the product cracks. The plugin-harness work above is the insurance.
- **Manual-by-design feel.** Devs expect tools to do, not propose. The reflect loop today proposes markdown for humans to act on. As a product, this is too passive — auto-PR or it doesn't count.
- **No clear ICP.** "Anyone who writes specs" is not a buyer. Narrow first: probably small fintech / regulated teams where spec/code drift is a compliance issue, not just an annoyance.
- **The vault/theory layer leaking out.** DomainSpec is part of a larger theory project. The product should not expose that. Theory stays in `vault/`; the product surface stays at templates, signals, drift, deploy.

**Honest summary for a friend.** DomainSpec is one good idea (machine-readable specs as the unit of truth, with LLM agents enforcing the spec↔code edge) wrapped in a workflow that today only the authors can run. The path to "product" is mostly **packaging discipline + a thin control plane + harness portability** — not new ideas. The four problems ranked above are also the four things that have to be true for it to be installable by anyone other than us.

---

## Pointers to verify any of this yourself

- **Infra** — declared model: [.claude/skills/domainspec-infra-architecture/](.claude/skills/domainspec-infra-architecture/) (preset detection); reality check on prod: [.claude/skills/custom/infrastructure-guide.md](.claude/skills/custom/infrastructure-guide.md) (the GCP+Terraform stack)
- **Versioning** — what version we say we're on: [CHANGELOG.md](CHANGELOG.md); what version git says: `git tag` (empty)
- **Composition** — how a consumer gets bootstrapped: [.claude/skills/domainspec-init/](.claude/skills/domainspec-init/); how registry sync works: [.claude/skills/domainspec-sync-registry/](.claude/skills/domainspec-sync-registry/)
- **Telemetry** — derivation rules: [OBSERVABILITY.md](OBSERVABILITY.md); signal envelope: [templates/SIGNAL-SCHEMA.md](templates/SIGNAL-SCHEMA.md); pattern detector: [.claude/skills/domainspec-reflect/](.claude/skills/domainspec-reflect/)
- **Consumer in the wild** — `~/house_project`; confirm submodule pin with `git -C ~/house_project submodule status`
- **See it run** — open a consumer repo in Claude Code and try `/domainspec-help`, then `/domainspec-pipeline <feature>`
