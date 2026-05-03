---
name: domainspec-audit-layering
description: Audit domain layering drift and produce deterministic migration plan tied to DomainSpec concepts.
argument-hint: "<feature-name>"
agent: domainspec-layering-auditor
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Enforce architecture layering rules from `ARCHITECTURE.md` strictly, ensuring business/domain behavior stays in domain/application layers and dependency direction remains inward.
</objective>

<context>
Inputs:
- domainspec/CHANGELOG.md
- domainspec/ARCHITECTURE.md
- docs/features/{feature}/*.md
- related source and tests
Outputs:
- docs/features/{feature}/LAYERING-ALIGNMENT-REPORT.md
- docs/features/{feature}/LAYERING-ALIGNMENT-PLAN.md
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read `domainspec/CHANGELOG.md` and `domainspec/ARCHITECTURE.md` and extract current-framework constraints.
2. Build concept-to-code map from feature docs.
3. Identify layering drift across all layers (domain, application, infrastructure, interface), not only use-case files.
4. Classify findings with strict severity:
   - BLOCK: dependency rule violations (outer->inner reversal), framework/library imports in domain files, interface/controllers owning core business logic, or application depending on concrete infrastructure adapters.
   - FLAG: unresolved structural drift that does not yet break dependency direction (for example, domain and projection/transport logic co-located in one module).
5. Enforce verdict policy:
   - PASS only when no unresolved BLOCK or FLAG findings remain.
   - If any unresolved FLAG exists, overall verdict must be FLAG.
   - Never label unresolved drift as "acceptable"; document owner/date and remediation plan until closed.
6. Emit prioritized remediation plan tied to DomainSpec concept IDs and architecture references.
</process>
