# Code Tag Example Pack

This pack provides compact examples for all canonical relationship edges.

## File Map

- Backend edges (15): [backend.md](backend.md)
- Intra-UI edges (8): [ui.md](ui.md)
- Cross-layer edges (6): [cross-layer.md](cross-layer.md)

## Context Optimization for Agents

Use only the smallest file needed for the implementation task:

- Backend use-case/domain work: load `backend.md` only.
- UI component/page/hook work: load `ui.md` only.
- API binding and integration work: load `cross-layer.md` only.

This avoids injecting the full relationship corpus when a narrower example slice is sufficient.
