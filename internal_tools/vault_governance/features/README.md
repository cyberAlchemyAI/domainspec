---
tags: [vault_governance, subsystem, readme]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# vault_governance — Features

> **Discovery pending.** This subsystem was created on 2026-05-18 by the D-5
> relocation (see `vault/discovery/two-layer-platform-architecture/discovery.md`
> §D-5 and the kernel SPEC OQ-C) — bundling the three governance-shaped modules
> previously misplaced in `vault_ctl/` (`amendments`, `governance`) and the
> kernel-side concrete validators originally in `vault_common/governance.py`.
>
> No dedicated discovery has been written for `vault_governance` yet. The
> rationale for the bundle is in the relocation audit at
> `/tmp/d5-relocation-audit.md` (now superseded by this README); the
> per-capability rules continue to live in their source constitutions:
>
> - `vault/constitution/schema-amendment-discipline-constitution.md` — R2
> - `vault/constitution/governs-runtime-witness-constitution.md` — R4
>
> When this subsystem is large enough to warrant a SPEC the discovery should
> be written first, then promoted into `features/spec/SPEC.md` per the
> standard DomainSpec convention.

## Modules

- `amendments.py` — Typer subapp for the schema-amendment discipline log.
- `governance.py` — Typer subapp reporting `governs`-edge runtime-witness coverage.
- `_kernel_amendments.py` — `AmendmentFrontmatter` Pydantic schema, moved
  from `vault_common/amendments.py` (subsystem-private; consumed by `amendments.py`).
- `_kernel_validators.py` — the three concrete validators
  (`has_required_discovery_sections`, `frontmatter_has_schema_version`,
  `constitution_declares_witness`) originally in `vault_common/governance.py`.
  These register with the kernel `vault_common.governance.REGISTRY` on import.
