---
amendment_id: 2026-05-16-subagent-strategy-parametrization
date: 2026-05-16
schema_document: vault/constitution/domainspec-subagents-strategy-constitution.md
change_type: schema_version_bump
old_version: 0.1.5
new_version: 0.2.0
trigger:
  session: vault/sessions/2026-05-16-strange-loop-complete.md
  discovery: null
  falsified_premise: null
dependents:
  - .claude/skills/domainspec-subagents-strategy/SKILL.md (rewritten — parameterized 9-step lifecycle)
  - .claude/skills/nested-subagents-strategy/ (DELETED — content folded into parameterized parent)
  - CLAUDE.md Route 13 (pointer updated for parameter-driven invocation)
  - .claude/skills/domainspec-orchestrate/SKILL.md (routing entry added for fan-out intent)
  - internal_tools/vault_telemetry/events/ (sink directory created)
  - vault/snapshots/dispatches/ (standard-dispatch spec path created)
  - vault/snapshots/meta-dispatches/ (meta-dispatch spec path created)
review:
  validator_passed: true
  snapshot_tag: null
author: victorboscaro
---

# Amendment: parametrize domainspec-subagents-strategy (R25–R28)

## Why

Two skills + one third-party skill (`domainspec-subagents-strategy`, the new `nested-subagents-strategy` born 2026-05-16, and `superpowers:dispatching-parallel-agents`) covered overlapping dispatch shapes — single, flat fan-out, nested waves — with no shared parameterization. Three problems emerged this session:

1. The nested skill captured a propose-wave → evaluate-wave → synthesis pattern that deserved to be a first-class mode rather than a separate skill living outside the governance chain.
2. The umbrella skill gave dispatching agents no way to vary wave structure, model assignments, validator behavior, or telemetry. Every invocation used the same strategy.
3. The framework had no empirical signal (telemetry) to distinguish good dispatches from bad ones — violating the "telemetry as ground truth" stance in `vault/foundational-knowledges.md` L7.

Parametrization closes all three. The nested skill is deleted and its content becomes the skill's `layers ≥ 2` default behavior. The new R25–R28 rules add a content-addressed spec, validator gate, heuristic citation, and telemetry sink.

## What changed

- Constitution version `0.1.5` → `0.2.0`. R1–R24 preserved in substance (R4/R5/R6/R14 received additive clarifications; R18 gained a Dispatch-record bullet; R19 marked `mode: mixed` as RESERVED; R24 strategist row updated to mention spec emission, validator invocation, telemetry).
- Four new rules in a new §10:
  - **R25** — strategy spec is a content-addressed YAML artifact written AFTER R3 Step 2 user confirm (Step 2.5). Schema includes `dispatch_kind: standard | meta`, `loop_cap: int (default 2, max 5)`, `model` as union `<model_id> | "parent"` (only valid on synthesize-layer entries), `heuristic_row`, `bootstrap_override: {reason, scope}`. R4/R5/R6 fully reconciled (Wave-3 Constitutional-Purist closure).
  - **R26** — single-validator gate (`accept` / `reject-with-fixes` / `abstain` / `accept-with-bootstrap-override`); one retry then escalate; trivial-dispatch carve-out (skip validator when `mode:single + layers:1 + n:1 + no override`); anti-abuse paragraph (>1 override per amendment cycle is violation).
  - **R27** — heuristic_row attribution required; additive-amendment path for premise-orthogonal operational mechanics.
  - **R28** — telemetry event `subagent-strategy.dispatched` emitted at Step 3 lead-in to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`; bootstrap behavior for first-cycle dispatches; fail-open emission.
- §12 Known Open Questions added with 5 OQs (mixed-dag-schema, robot-talks-stage-a, single-use-override-enforcement, telemetry-consumer, non-claude-runtime-paths).
- Frontmatter: added `schema_version: 1`, `governs_pattern: .claude/skills/domainspec-subagents-strategy/**`, `governs_check: [strategy_spec_schema_valid]`. Drift correction: prior on-disk `version: 0.1.4` is now `0.2.0` (v0.1.5 history row already existed without a frontmatter bump).
- Skill `.claude/skills/domainspec-subagents-strategy/SKILL.md` rewritten to implement R25–R28: 9-step lifecycle (adds Step 0 = compose-in-chat, Step 0.5 = validate-in-chat, Step 2.5 = post-confirm spec persist), 6-row heuristic table with stable IDs, 9-item validator checklist, subsumption story for single / flat-fanout / nested shapes, §Known Open Questions.
- `.claude/skills/nested-subagents-strategy/` DELETED. Content folded into the parameterized parent under `layers ≥ 2` semantics.
- CLAUDE.md Route 13 updated to note parameter-driven invocation.
- `.claude/skills/domainspec-orchestrate/SKILL.md` gained a routing entry for fan-out / parallel-agent / nested-dispatch intent.

## Dependents — required action

1. **Telemetry sink** — directory created at `internal_tools/vault_telemetry/events/` with `.gitkeep`. **Follow-up:** consumer script reading the JSONL (OQ-telemetry-consumer).
2. **Spec snapshot paths** — `vault/snapshots/dispatches/` and `vault/snapshots/meta-dispatches/` created. This dispatch's own spec persisted at `vault/snapshots/meta-dispatches/2026-05-16-subagent-strategy-parametrization-wave5/spec.yaml`.
3. **Governance registry** — `governs_check: [strategy_spec_schema_valid]` references a function not yet wired into `vault_common.governance.REGISTRY`. Acknowledged TODO under R26 bootstrap-override discipline for v0.2.0 first cycle.
4. **No vault migration** — no existing vault frontmatter requires backfill. R27's `heuristic_row` is forward-looking on new dispatches.
5. **Open questions** — five OQs documented in §12 of the constitution; each requires its own follow-up amendment when resolved.

## Review status

**Validator passed.** Wave-5 V3 dogfood returned `ACCEPT-WITH-BOOTSTRAP-OVERRIDE` with three pre-commit fixes (mode label corrected from `mixed`→`sequential`; stop_conditions polish; post-commit follow-ups noted). The override is anchored to the missing telemetry consumer and missing governance registry entry — both flagged as v0.2.0 follow-ups.

This amendment dogfood-validates the new R25–R28 against the very dispatch that wrote them. The dispatch's own strategy spec is persisted at `vault/snapshots/meta-dispatches/2026-05-16-subagent-strategy-parametrization-wave5/spec.yaml`.

This entry is the third deliberate close of residue R2 under [`schema-amendment-discipline-constitution.md`](../constitution/schema-amendment-discipline-constitution.md).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../constitution/domainspec-subagents-strategy-constitution.md](../constitution/domainspec-subagents-strategy-constitution.md) | `amends` | The amendment target; v0.1.5 → v0.2.0. |
| [../constitution/schema-amendment-discipline-constitution.md](../constitution/schema-amendment-discipline-constitution.md) | `governed-by` | This amendment is an instance of the R2-closure discipline. |
| [../constitution/governs-runtime-witness-constitution.md](../constitution/governs-runtime-witness-constitution.md) | `governed-by` | New frontmatter `governs_pattern` + `governs_check` declared per this discipline. |
