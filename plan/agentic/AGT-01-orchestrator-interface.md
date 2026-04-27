# AGT-01 - Orchestrator Interface (Prompt to Agent-Skill Pipeline)

## Objective

Implement the human-system interface where a prompt is classified and routed to the required set of agents and skills.

## Problem

Users need one stable entrypoint that transparently selects the right pipeline while preserving direct specialist command compatibility.

## Scope

- In scope:
  - Prompt classification and route selection.
  - Agent-skill set composition per intent.
  - Execution trace and rationale display.
- Out of scope:
  - Non-DomainSpec workflow routing.

## Dependencies

- [../infra/INF-01-runtime-dispatch-gateway.md](../infra/INF-01-runtime-dispatch-gateway.md)
- [../harness/HAR-03-owner-task-board.md](../harness/HAR-03-owner-task-board.md)

## Implementation Tasks

1. Define routing taxonomy and confidence model.
2. Define route output contract with selected agents and skills.
3. Add ambiguity handling and clarification flow.
4. Add execution trace panel with routing rationale.
5. Add compatibility mode for direct specialist invocation.

## Deliverables

- Routing taxonomy and policy.
- Orchestrator route contract.
- Execution trace UI model.
- Compatibility policy document.

## Done Criteria

- [ ] Each prompt resolves to a clear route or clarification request.
- [ ] Selected agent-skill set is visible to the user.
- [ ] Direct specialist commands remain callable unchanged.
