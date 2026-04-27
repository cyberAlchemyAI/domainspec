---
name: domainspec-interview-scope
description: 'Interview a greenfield or brownfield project to discover domain scope, inspect what is already implemented, and produce DomainSpec-ready project overview, definitions, project decisions, hypotheses, and experiment candidates.'
argument-hint: '[greenfield|brownfield|auto] [project-or-feature-scope]'
agent: domainspec-interviewer
allowed-tools: Read, Write, Glob, Grep, AskQuestions
---

<objective>
Turn a vague business idea or an already-started codebase into a usable DomainSpec discovery baseline.

This skill is for the phase before detailed specification or implementation planning. It helps operators clarify what domain they are actually working in, what the repository already implements, what assumptions remain untested, and which hypotheses or experiments should guide the next decision.
</objective>

<when-to-use>
Use this skill when:
- a founder, product owner, or operator has a business idea but needs structured discovery
- a project already exists and the team needs a brownfield domain audit before adopting DomainSpec
- the team needs a first-pass project overview, glossary, initial definitions, and hypothesis list
- the team wants to test strategic moves such as pricing, positioning, onboarding, retention, or workflow changes
</when-to-use>

<inputs>
Potential sources of evidence:
- `README*`
- `docs/**`
- `research/**`
- existing source code and tests
- operator answers gathered during the interview

Primary DomainSpec references:
- `domainspec/CHANGELOG.md`
- `domainspec/ARCHITECTURE.md`
- `domainspec/TAXONOMY.md`
- `domainspec/RELATIONSHIPS.md`
- `domainspec/templates/project-overview.md`
- `domainspec/templates/initial-definitions.md`
- `domainspec/templates/project-decisions.md`
- `domainspec/templates/hypotheses.md`
- `domainspec/templates/experiment-candidates.md`
</inputs>

<process>
1. Read the DomainSpec references first.
2. Detect mode.
   - `greenfield`: little or no implementation exists.
   - `brownfield`: implementation or documentation already exists.
   - `auto`: inspect the repository and choose.
3. Build a cheap evidence baseline.
   - For brownfield, inspect docs and code before asking avoidable questions.
   - For greenfield, capture user, problem, value, revenue logic, constraints, and major risks.
4. Run the interview.
   - Ask focused questions about actors, goals, workflows, decisions, policies, integrations, metrics, and failure modes.
   - Distinguish between stated intent and observed implementation.
5. Draft five core artifacts.
   - `docs/PROJECT-OVERVIEW.md` from `domainspec/templates/project-overview.md`
   - `docs/INITIAL-DEFINITIONS.md` from `domainspec/templates/initial-definitions.md`
   - `docs/PROJECT-DECISIONS.md` from `domainspec/templates/project-decisions.md`
   - `docs/HYPOTHESES.md` from `domainspec/templates/hypotheses.md`
   - `docs/EXPERIMENT-CANDIDATES.md` from `domainspec/templates/experiment-candidates.md`
6. Enforce brownfield scope gates when mode is `brownfield` or `auto` resolved to brownfield.
   - Gate A: each in-scope context has at least one observed evidence source.
   - Gate B: in-scope and out-of-scope boundaries are explicitly documented.
   - Gate C: blocker-level decisions are recorded in `docs/PROJECT-DECISIONS.md` with selected option or explicit blocked status.
   - If any gate fails, return `blocked on scope gate` and stop.
7. Add counter-positioning.
   - For each central proposition, include a plausible alternative explanation, downside, or invalidation condition.
8. Finish with a readiness verdict.
   - `ready for specification`
   - `needs more discovery`
   - `blocked on scope gate`
   - `blocked on business decisions`
</process>

<quality-bar>
- Outputs must separate `observed`, `stated`, and `hypothesized` content.
- Brownfield findings must cite repository evidence where possible.
- `docs/PROJECT-DECISIONS.md` must include selected options or blocked status for blocker-level decisions.
- Hypotheses must be falsifiable.
- Experiment candidates must define signal, expected effect, and disconfirming outcome.
- Avoid implementation plans unless the discovery baseline is stable enough.
</quality-bar>

<examples>
- `/domainspec-interview-scope greenfield habit-coaching app for freelancers`
- `/domainspec-interview-scope brownfield pricing strategy for existing SaaS repo`
- `/domainspec-interview-scope auto onboarding funnel and retention risks`
</examples>