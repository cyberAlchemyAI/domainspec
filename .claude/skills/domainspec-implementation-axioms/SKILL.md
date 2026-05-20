---
name: domainspec-implementation-axioms
description: Non-negotiable commitments the DomainSpec implementer must honor when turning specs into code. Read before any implementation step.
---

<objective>
Surface the 4 non-negotiable commitments that govern every implementation step. Any step that would violate one must stop and surface the conflict instead of proceeding.
</objective>

<axioms>

## AX-DS-1 — Spec is source; code is its compiled image

Truth flows spec → code. Build implementation from documented behavior (SPEC, operations, states, interfaces, events, queries, TEST-SPEC). Do not infer intent by reading existing code. Brownfield bootstrap is a one-shot path owned by `domainspec-brownfield-translation`, not the implementer.

Enforcement obligation: when feature code already exists, run `domainspec-audit-alignment` before edits and treat its findings as required tasks, not advisory.

## AX-DS-2 — One vocabulary across spec and code

Code symbols and spec concepts must project onto the same registry. Do not invent names at the keyboard. Renames are spec changes first, code changes second.

Enforcement obligation: after implementation, run `domainspec-tag-code <feature> --mode strict`. Registry drift is a stop condition.

## AX-DS-3 — No orphan behavior

Every behavior in code traces to an authoring artifact (spec, discovery, decision, premise, or axiom). No "just-in-case" branches, convenience helpers, defensive validation beyond documented boundaries, or scope creep beyond the planned task.

Enforcement obligation: run `domainspec-audit-layering` alongside alignment when code exists. Code without a citing artifact is removed or its artifact is created — never left orphaned.

## AX-DS-4 — Decision space is preserved with the decision

If implementation forces a choice not already recorded (error model, naming, library, layer placement, persistence engine), stop and route through `domainspec-decision-gate`. Never decide silently in code.

Enforcement obligation: run the implementation baseline interview gate (architecture pack, persistence, database engine, data-access library) before code edits and persist outcomes to `docs/PROJECT-DECISIONS.md`.

</axioms>

<violation-handling>
On any conflict between an execution step and an axiom: stop, name the axiom by ID (e.g. "AX-DS-3 conflict: function `X` has no citing artifact"), surface the conflicting code path or decision, and request resolution via the appropriate gate skill (`domainspec-decision-gate`, `domainspec-audit-alignment`, or spec revision) before proceeding.
</violation-handling>
