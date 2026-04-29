# Agentic Product Overview

## Summary

Agentic is the orchestration intelligence of DomainSpec: it turns user intent into explicit execution paths, selected capabilities, and governed adaptation.

## Problem Scope

- Users do not know which specialized flow to run.
- Similar intents produce inconsistent execution paths.
- Skills are duplicated across projects with poor reuse.
- Agent evolution is slow or unsafe without governance checks.
- Goals change mid-execution but systems remain static.

## Core Product Capabilities

### 1) Orchestrator Interface (AGT-01)

- Classifies prompts and routes them to the right pipeline.
- Displays selected agents and skills with rationale.
- Preserves direct specialist command compatibility.

### 2) Greenfield and Brownfield Interviewers (AGT-02, AGT-03)

- Converts ambiguity into implementation-ready artifacts.
- Combines guided questioning with evidence-first mapping.
- Produces clearer domain boundaries and remediation paths.

### 3) Composition Matrix and Shared Skill Repository (AGT-04, AGT-05)

- Standardizes intent-to-capability bundles.
- Enables cross-project skill discovery and reuse.
- Reduces orchestration drift and duplicated effort.

### 4) Mutation Pipeline with Governance Gates (AGT-06)

- Proposes and evaluates controlled agent/skill mutations.
- Blocks unsafe adoption until governance checks pass.
- Preserves rollback traceability for regressions.

### 5) Dynamic Goal Amendment (AGT-07)

- Supports safe goal changes during execution.
- Re-derives impacted artifacts with controlled sequencing.
- Adds auditability for amendment rationale and effects.

## Primary Stakeholders

- Teams that need reliable AI orchestration across heterogeneous tasks.
- Product and engineering leads who need transparent routing and capability governance.
- Platform owners who need reusable agent and skill assets.

## System Role

Agentic provides coordination across context, infrastructure, governance, and Harness surfaces:

- It consumes context priorities and objective constraints.
- It executes on infrastructure runtime and telemetry contracts.
- It feeds governance with decision trace and mutation evidence.
- It enables Harness to display understandable human-facing execution flow.

If absent, DomainSpec remains documented and structured but depends on manual execution coordination.

## Success Signals

- Prompt intents map to deterministic orchestration bundles.
- Route rationale and selected capabilities are visible for each execution.
- Reuse of shared skills increases while duplication declines.
- Mutation adoption occurs only through governed pass criteria.

## Condensed Summary

Agentic routes intent, composes capabilities, and constrains adaptation through governance.
