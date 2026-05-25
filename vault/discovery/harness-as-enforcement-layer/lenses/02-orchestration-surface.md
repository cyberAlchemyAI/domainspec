---
lens: orchestration-surface
date: 2026-05-25
dispatched_by: self
addresses: Shows that the product-facing use of "Harness" is not a separate meaning but the same execution role viewed from the human side: the orchestration surface that materializes agent work.
sources:
  - /Users/victorboscaro/domainspec/implementation/app-frontend/docs/features/discovery/app-release-discovery.md
  - /Users/victorboscaro/domainspec/README.md
verification: [local-files-read]
---

The app-release discovery pushes the term "Harness" up to the product surface. There the thesis is explicit: Harness should feel like the orchestration surface for building an application with agents, not like a thin wrapper over prompts. Chat is the control surface, but not the whole product; every meaningful output should materialize elsewhere in the interface as graph state, workflows, tasks, decisions, and metrics.

Conceptually, that is not a different definition from the Claude-side one. It is the same role seen from above. On the Claude side, the harness loads agents and enforces hooks. On the app side, the harness receives user intent, dispatches the right internal work, and materializes outputs across multiple governed surfaces. In both cases the core function is mediation between intent and structured execution.

The root `README.md` fits this reading because DomainSpec is presented as a staged orchestration pipeline with explicit inputs and outputs at each step. The orchestrator is the user-facing entrypoint, but the pipeline only becomes real when some runtime can expose those routes, invoke the relevant agents or skills, and keep the outputs attached to the correct artifact surfaces. That runtime-and-surface role is exactly what the app-release discovery wants Harness to embody.

So the product meaning of Harness should not be treated as branding drift. It is a legitimate extension of the same concept: the harness is the surface through which the system's governed orchestration becomes visible, inspectable, and steerable by a human.
