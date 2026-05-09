# UI Prototyping Studio Inventory

This folder stores feature-local, reference-only snapshots of external assets used by the UI Prototyping Studio specification process.

## Structure

- `voltagent-design-md/`
  - `design-md/` (copied from VoltAgent)
  - `PROVENANCE.md`
- `skills-references/`
  - `open-design/` (copied Open Design contracts and skills)
  - `open-design/INVENTORY.md`
  - `open-design/PROVENANCE.md`

## Imported Assets

### VoltAgent design-md assets

- Source repository URL: https://github.com/VoltAgent/awesome-design-md
- Source path: `design-md`
- Retrieval date (UTC): `2026-05-07T20:02:41Z`
- Source commit: `da068674dbe2f7073059d0c38c0ac60aa83c1660`
- Imported scope: full `design-md` folder with top-level folder names preserved (`70` brand folders).

### Open Design skills references

- Source repository URL: https://github.com/nexu-io/open-design
- Source paths imported (relative to repo root):
  - `docs/skills-protocol.md`
  - `docs/modes.md`
  - `craft/*.md`
  - Full folder snapshots for:
    - `skills/web-prototype/`
    - `skills/web-prototype-taste-editorial/`
    - `skills/web-prototype-taste-brutalist/`
    - `skills/web-prototype-taste-soft/`
    - `skills/critique/`
    - `skills/tweaks/`
    - `skills/wireframe-sketch/`
    - `skills/design-brief/`
    - `skills/dashboard/`
    - `skills/docs-page/`
    - `skills/mobile-app/`
    - `skills/saas-landing/`
    - `skills/live-dashboard/`
    - `skills/live-artifact/`
- Retrieval date (UTC): `2026-05-07T21:49:26Z`
- Source commit: `2bb029cb5870f73cbe1aa357b4cc3dd7190bdd15`
- Imported file count: `58`.

## Update Guidance

1. Re-clone the upstream repositories and record exact commit SHAs.
2. Replace imported snapshots in this inventory with the refreshed source files.
3. Update both provenance files and this index with new retrieval metadata.
4. Re-run markdown link checks for changed markdown files.

## Usage Boundary

Assets in this inventory are reference-only.
They do not create runtime, build-time, or package dependency requirements for this feature.
