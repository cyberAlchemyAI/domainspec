---
tags: [architecture, application]
node_type: audit
is_session: true
layer: architecture
nature: technical
status: active
created: 2026-06-01
timestamp: 2026-06-01T12:04:37-03:00
expires: 2026-07-31
conversation_id: 2026-06-01-1204-lean-code-validator-readiness
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "Establishes the production-readiness boundary of a core tool — which predicates are proven (P1/P2/P5) vs stubbed (P3/P4) — load-bearing for anyone consuming its output as ground truth."
---

# lean-code-validator readiness audit

## Summary

Auditamos se o `lean-code-validator` (grader Lean 4 de riqueza estrutural de SPEC) está pronto. A fonte viva e completa está em `domainspec/internal_tools/lean-code-validator/` (relocada do theorem repo em `801503b`): compila limpo (`lake build` 7/7, zero `sorry`) e os predicados de Camada 1 — P1, P2 (provado via Teorema 1) e P5 — funcionam end-to-end; P3 e P4 são stubs intencionais (retornam `pass`) adiados pra Camada 2 até a calibração EX1. Limpamos drift: reescrevemos o README enganoso do theorem repo como ponteiro de stub relocado e deletamos duas duplicatas v2 obsoletas (build seguiu verde). Corrigi um erro meu — o "Step 4" do parser NÃO está por fazer: `audit_richness.py --emit-lean` já emite os quatro campos v3 do `Spec`; só resta `provenance` hard-coded em `.declared`, e o seam emit→typecheck contra o v3 atual segue não-testado.

## Files touched

- internal_tools/lean-code-validator/Richness.lean (deleted — stale v2 duplicate)
- internal_tools/lean-code-validator/Sigma.lean (deleted — stale v2 duplicate)
- ../domainspec-theorem/internal_tools/lean-code-validator/README.md (modified — relocated-stub pointer)

## Connections

<!--
No legal vault-graph edge target exists for this session, so this block is intentionally empty.
- This session has `is_session: true`: any edge it declared would be forward-only by source per
  `vault/ontology-conventions.md` §8 — no inverse is written on targets.
- The audit's inputs (the `domain_knowledge/lean-code-validator/` discovery, research, findings, and
  AUDIT docs) carry NO `node_type` frontmatter, so they are not vault graph nodes. A `consumes` edge
  requires a target that is a vault node (legality matrix, edge-catalog.md); these do not qualify, and
  inventing an edge into a non-node is forbidden.
- The tool's own spec at `internal_tools/lean-code-validator/spec/SPEC.md` DOES carry `node_type: spec`,
  but it lives under `internal_tools/` (tooling), which is pre-cleared as a non-vault target to omit.
- An islanded session node is acceptable here per the bootstrap brief.
-->

| Document | Type | Description |
|----------|------|-------------|
