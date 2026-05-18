---
tags: [vault, ontology, governance, enforcement]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.0
last_updated: 2026-05-16
schema_version: 1
governs_pattern: vault/constitution/*.md
governs_check: [constitution_declares_witness]
---

# Governs Runtime Witness

> Every `governs` edge from a constitution must carry a runtime witness — either a declared validator that mechanically checks conformance, or a declared file pattern that enables coverage reporting. A constitution that declares neither is a labeling discipline, not an enforcement. This constitution closes residue **R4** named in `discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md` §C: schema invariant S12 says constitutions are the only nodes that may carry `governs` edges, but nothing in the runtime previously verified that the edge target actually conforms.

---

## Why this is a constitution

S12 makes `governs` the only edge that distinguishes a rule (L3) from a ground claim (L4). Without a runtime witness the distinction is rhetorical: anyone can attach `governs` to anything and the graph cannot refuse. R4 is the residue where the constitution-layer leaks back into labeling discipline.

The honest scope of mechanical enforcement: constitutions are prose, not executable specifications. We cannot demand every governs-claim be a theorem. We *can* demand that every constitution either (i) declares which named validators apply to its targets, or (ii) declares which file paths it claims jurisdiction over, so coverage and conformance can be reported.

## Rules

1. **Declaration requirement.** Every constitution in `vault/constitution/*.md` MUST declare at least one of:
   - `governs_check:` — a YAML list of validator names. Each name must be registered in `vault_common.governance.REGISTRY`.
   - `governs_pattern:` — a single glob (relative to the repo root) of files this constitution claims to govern.
   A constitution that declares neither is the R4 residue and `vault-ctl governance audit` will flag it.

2. **Validator registry.** Validators live as named functions in `vault_common.governance` and are registered in a process-global `REGISTRY`. A validator takes a `VaultDoc` and returns `list[str]` of human-readable violation messages (empty list = pass). Validators are pure and side-effect-free.

3. **Coverage.** When a constitution declares `governs_pattern`, `vault-ctl governance coverage` walks the vault and, for every file matching the pattern, runs every validator in that constitution's `governs_check` (if any). A file matching the pattern with no declared check is reported as "pattern-only" — coverage is positive, enforcement is not.

4. **Per-check audit.** `vault-ctl governance audit` reports each constitution as one of:
   - `enforced` — has both `governs_check` and `governs_pattern`.
   - `checked` — has `governs_check` only; applies opportunistically when something cites this constitution.
   - `pattern-only` — has `governs_pattern` only; coverage is reportable, conformance is prose.
   - `labeling-only` — has neither. This is the R4 residue.

5. **Soft closure, honestly.** This constitution does not promise that every prose rule in every constitution is mechanically enforced. It promises that every constitution is *categorized* on its mechanical-enforcement axis, and that validators which do exist are discoverable and runnable. That upgrade — from "S12 is descriptive" to "S12 is descriptive plus enforced where declared" — is the R4 closure.

6. **This constitution itself.** It declares `governs_pattern: vault/constitution/*.md` and `governs_check: [constitution_declares_witness]`. The validator checks that the target constitution declares at least one of the two fields. The fixed point is intentional: this constitution governs the governance discipline, including itself.

## What this does NOT govern

- The intellectual quality of any prose rule.
- The decision of which rules to mechanize. That is the constitution author's judgment.
- Edge-level checks (acyclicity, type-correctness). Those belong to `edge-acyclicity-constitution.md`.

## Promotion path

`exploratory` until at least three existing constitutions adopt `governs_check`/`governs_pattern`. Graduates to `active` once `vault-ctl governance audit` reports zero `labeling-only` constitutions in the corpus (or each remaining one is documented as deliberately prose-only).
