# Implementation Layering: Governance Attenuation Scriptability

Status: `executed-l0`

## L0 - Runnable Local Proof

Question: Can the existing governance attenuation script surface run from this source checkout without path confusion?

Answer: Yes. `SWU-GAS-001` adds root resolution, a consolidated audit wrapper, and legacy-safe analyzers.

Evidence:

- `tools/lib/domainspec-paths.ts`
- `tools/governance-attenuation-audit.ts`
- `package.json` script `governance:attenuation:audit`
- Stage probe artifacts under `stages/`

## L1 - Repeatability

Deferred. Add tests or fixtures for source checkout and installed bundle layouts.

## L2 - Governance Gate

Deferred. Wire audit into CI/pre-commit only after signal ledger migration or compatibility policy is approved.

## L3 - Packaging And Rollout

Deferred. Include helper/audit tool in generated consumer bundles and update bootstrap copy list after L1 evidence exists.

## Promotion Rule

Do not promote beyond L0 while `signal-ledger-envelope` is blocking on the current ledger.
