# S06 Invoke Design

Status: `pass`  
Capability: `invoke`  
Mode: `design`

## Design: Source-Layout-Safe Governance Audit

### Context View

The DomainSpec source checkout lives under `implementation/domainspec`, while installed consumer bundles may live under `domainspec`. Existing tools were written with mixed assumptions. Operators need one audit command that finds canonical DomainSpec files from either layout.

### High-Level Structure

1. `tools/lib/domainspec-paths.ts`
   - resolves the DomainSpec root from `DOMAINSPEC_ROOT`, current working directory, `implementation/domainspec`, `domainspec`, or the script module root;
   - resolves default paths relative to that root;
   - preserves explicit relative paths when they already exist from the current working directory.
2. Existing governance scripts import the resolver for defaults.
3. `tools/governance-attenuation-audit.ts` runs the core checks and writes one report.
4. `package.json` exposes `governance:attenuation:audit`.

### Low-Level Components

| Component                 | Responsibility                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `resolveDomainSpecRoot()` | Find current source or installed bundle root.                                                       |
| `resolveDomainSpecPath()` | Resolve defaults such as `docs/signals/pipeline-signals.jsonl`, `AXIOMS.md`, and `CONSTITUTION.md`. |
| `domainSpecRelative()`    | Print stable report paths relative to DomainSpec root.                                              |
| Audit check runner        | Runs child `tsx` scripts sequentially and captures stdout/stderr/exit code.                         |
| Report builder            | Produces Markdown summary and detailed command output.                                              |

### Workflow Process

1. Operator runs `pnpm run governance:attenuation:audit`.
2. Audit resolves root and signal ledger.
3. Audit runs governance chain, signal validation, and threshold analysis.
4. Audit writes a report.
5. Exit code is nonzero when a blocking check fails.

### Decision Flow

- If chain validation fails, block.
- If signal envelope fails, block.
- If thresholds trigger, flag.
- If all checks pass, pass.

### Dependency Interface

- Requires `pnpm dlx tsx`, consistent with existing package scripts.
- Does not add dependencies.
- Does not mutate governance docs or signal ledgers.

## Receipt

```json
{
  "dispatch_id": "20260615T043712Z-governance-attenuation-scriptability",
  "step_id": "s06-invoke-design",
  "capability_ref": "invoke",
  "status": "pass",
  "artifacts": ["stages/S06-INVOKE-DESIGN.md"],
  "validation": ["six design views covered"],
  "observer_status": "not_applicable",
  "blockers": [],
  "residue": [],
  "handoff_note": "Proceed to design review."
}
```
