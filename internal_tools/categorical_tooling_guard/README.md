# categorical_tooling_guard

CLI/CI guard for turning `scripts/audit_richness.py` output into a small
`PASS | FLAG | BLOCK` contract.

This tool does **not** replace the L1 richness audit. It wraps the existing
audit, normalizes the result into diagnostics, and applies a conservative gate
policy that can be used by CI, pre-commit hooks, or future editor integrations.

## Relationship to the Reflection Tower

This guard is **not** the reflection-tower tool.

It is a flat L1→L2 compilation guard: it asks whether one DomainSpec feature
spec is structurally rich enough to use as a code-generation source.

Reflection-tower checks live one level up: they ask whether the system's own
governance/audit artifacts preserve their promotion origin as rules, premises,
constitutions, and discoveries move across levels. Those checks belong in
[`../tower_explorer/`](../tower_explorer/), which is Gate 0. This guard is
Gate 1.

## What It Does

Given a DomainSpec feature/spec directory containing `SPEC.md`, the guard:

1. Runs `scripts/audit_richness.py` in strict mode by default.
2. Reads the audit's typed graph, M6 clusters, parser-blind status, coverage
   ratio, structural collisions, and unwitnessed edges.
3. Emits a normalized diagnostic bundle.
4. Returns a final verdict:
   - `pass` — no blocking or review diagnostics.
   - `flag` — usable, but requires human review or follow-up.
   - `block` — unsafe to merge or use as a code-generation source.

## Default Policy

| Condition | Verdict |
|---|---|
| Audit cannot run | `block` |
| Parser-blind spec | `block` |
| Non-empty registry with zero typed edges | `block` |
| M6 clusters above threshold | `block` |
| Test faithfulness ratio below threshold | `flag` |
| Structural collision candidates | `flag` |
| Unwitnessed required edges | `flag` by default, configurable to `block` |
| Lean validator unavailable with `--lean` | `flag` |
| Lean validator unavailable with `--require-lean` | `block` |

The default M6 threshold is `0`. That means any detected M6 residue cluster
blocks unless a legacy onboarding run explicitly raises the threshold.

## Usage

Run against a spec directory:

```bash
categorical-tooling-guard docs/features/categorical-tooling-guards
```

Emit JSON:

```bash
categorical-tooling-guard docs/features/categorical-tooling-guards \
  --json
```

Check Lean validator availability as advisory:

```bash
categorical-tooling-guard docs/features/categorical-tooling-guards \
  --lean
```

Require Lean validator availability:

```bash
categorical-tooling-guard docs/features/categorical-tooling-guards \
  --require-lean
```

Make `flag` fail CI:

```bash
categorical-tooling-guard docs/features/categorical-tooling-guards \
  --fail-on-flag
```

## Exit Codes

| Exit code | Meaning |
|---:|---|
| `0` | `pass`, or `flag` without `--fail-on-flag` |
| `1` | `flag` with `--fail-on-flag` |
| `2` | `block` |

## Tests

```bash
./.venv/bin/pytest -q internal_tools/categorical_tooling_guard/tests/test_guard.py
```

## Current Limits

- Lean validation is availability-only for now. The source project under
  `internal_tools/lean-code-validator/` must be restored before Lean proof
  checks can become mandatory.
- L2 schema/code extraction is not implemented here. This guard only covers the
  L1 audit surface.
- Round-trip instance tests are not generated here. They depend on future L2
  mappings and runtime/API fixtures.
