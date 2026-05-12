# TODO - Steps 1, 2, and 3

## Scope

Execution checklist for the requested docs-first sequence:

1. Run test derivation stage.
2. Run/confirm WP-01 capability inventory stage.
3. Create a concrete prompt-ready route artifact.

## Status

- [x] Step 1 - `domainspec-generate-tests agent-execution-orchestrator`
  - Evidence: [TEST-SPEC.md](../../TEST-SPEC.md)
  - Telemetry: `aeo-tests-20260508T051600Z` (`started` + `completed`)
- [x] Step 2 - WP-01 inventory baseline
  - Evidence: [command-agent-inventory.md](command-agent-inventory.md)
  - Note: already completed before this request; confirmed and reused.
- [x] Step 3 - prompt-ready route artifact
  - Evidence: [route-artifact-prompt-pack.md](route-artifact-prompt-pack.md)
  - Telemetry: `aeo-route-artifact-20260508T051820Z` (`started` + `completed`)

## Follow-up

- [x] Added reusable inventory skill adapted from MARS inventorize pattern:
  - [.github/skills/domainspec-inventory/SKILL.md](../../../../../../../.github/skills/domainspec-inventory/SKILL.md)
  - [implementation/.github/skills/domainspec-inventory/SKILL.md](../../../../../.github/skills/domainspec-inventory/SKILL.md)
