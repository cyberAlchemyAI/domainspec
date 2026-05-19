---
tags: [vault, lens, prior-art, l1-l2, llm-coercion, research-staging]
node_type: lens
is_session: false
layer: ontology
nature: research-synthesis
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Lens 01 — Vault Prior Art

## Mission

Sweep `/Users/victorboscaro/domainspec/vault/` for prior art relevant to a new discovery on L₁↔L₂ structural mirroring as a coercion mechanism for LLM-authored code. Specifically: prior art beyond `folder-structure-fractal/`; the OQ-4 cross-repo canonicalization hole; LLM-as-author / forcing-by-structure; how the vault encodes research-as-staging today.

## §1. Prior Art on L₁↔L₂ / Code↔Knowledge Mirroring

**Two-Layer Platform Architecture** (`vault/discovery/two-layer-platform-architecture/discovery.md`)
- Platform embodies the schema/instance distinction at infrastructure scale — kernel + thin subsystems mirror the two-layer thesis itself.
- Line 87: "The platform respects the framework's own two-layer thesis applied to itself" — explicit isomorphism claim.
- Line 52: "Shared kernel...owns the primitives every subsystem needs" — kernel as schema, subsystems as instances.

**Two-Layer Retrieval** (`vault/discovery/two-layer-retrieval/discovery.md`)
- Retrieval architecture must respect L₁ (typed edges, schema structure) and L₂ (body embeddings) simultaneously, with query-intent conditioning the composition layer.
- Lines 16–17: "Pure vector retrieval cannot in principle satisfy the vault's own identity criterion...minimum faithful architecture composes body-similarity, edge-traversal, and type/stage/verification filters."
- Lines 59–64: Two-layer composition defined; neither layer alone sufficient on structurally-demanding queries.

**Graph as Residue Attractor** (`vault/discovery/graph-as-residue-attractor/discovery.md`)
- Graded knowledge graph structure conjectured to be the attractor of two-layer residue accounting, with L₁ (schema) and L₂ (instance) as mirror layers.
- Lines 16–17: "Nodes typed by the product `{premise, axiom, constitution} × {conceptual, discovery, session}`" — explicit product structure encoding L₁×L₂.

## §2. The OQ-4 Hole — Cross-Repo Schema-Canonicalization Protocol

**Folder-Structure-Fractal Discovery** (`vault/discovery/folder-structure-fractal/discovery.md`)
- **OQ-4 (Lines 160–162):** "Cross-repo schema-canonicalization protocol...Dispatch a separate discovery before any cross-repo migration."
- **D-2 (Lines 102–106):** Blocks migration of `/house_project`, `/maestro-trama`, `/financas_pessoais`, `/football-stats-oracle` pending protocol.
- Line 46: "Cross-repo rollout is **explicitly out of scope**...blocked pending a separate schema-canonicalization protocol."

**Cross-Repo Rollout Discovery** (`vault/discovery/cross-repo-rollout/discovery.md`)
- Line 36: maestro-trama has "**no overlap** to /domainspec's `internal_tools/`" — disjoint surfaces, unresolved canonicalization.
- Line 47: "Per-repo `internal_tools/` canonicalization — disjoint surfaces are tolerated; merger is a separate decision."

**Evidence:** No discovery, constitution, or sketch of a canonicalization protocol exists. The precondition blocking maestro-trama migration is explicitly named but unresolved.

## §3. LLM-as-Author / Forcing-by-Structure

**Domainspec-Subagents-Strategy Constitution** (`vault/constitution/domainspec-subagents-strategy-constitution.md`)
- Lines 98, 547: Discovery promotion tied to path-location decision by the agent — "the strategist classifies the discovery's scope...proposes the target path; the user confirms."
- **Path as mechanic:** Target path (schema-internal vs application-internal) is NOT derived from content; it is chosen by policy and enforces future agent behavior.

**Vault-Folder-Structure Constitution** (`vault/constitution/vault-folder-structure-constitution.md`)
- Lines 77–78: "`layer: schema | instance` for files under `vault/schema/**`; `instance` for files under `vault/instance/**`. The validator rejects any node whose `layer:` does not match its path."
- **Path as coercion:** Folder location *forces* the `layer:` field; agents cannot author conflicting combinations.

**Epistemic-Chain Discovery** (`vault/discovery/domainspec-vault-foundations/epistemic-chain.md`)
- Lines 51, 66–73: Defines `node_type`, `status`, `veracidade`, `convicção` as mandatory labels determining "what epistemic role a document plays."
- Lines 69–72: Constitution and premises/axioms define mutual dependencies — one cannot be authored without the other being present in the graph.

**Evidence of structure forcing behavior:** Folder location determines allowable frontmatter values (layer validator); agent dispatch step 7 routes to different paths based on scope classification; cross-file dependencies (premise→constitution→code) are mechanically checkable.

## §4. Research-as-Staging Mechanics

**Epistemic-Chain Discovery** (lines 82–95):
- **D-1:** "The epistemic chain is defined as: research → discovery → premise → axiom, with implementation branch from discovery."
- **D-2:** "research = exploration; discovery = consolidation; they are distinct `node_type` values."
- Lines 58–59: "Research files are the *input* to a discovery...Research is exploratory; discovery is committal."

**Two-Layer Platform Architecture Research Layer** (`vault/discovery/two-layer-platform-architecture/research/research.md`)
- File exists as intermediate layer between lenses and discovery.
- Header frontmatter: `node_type: research`, `status: consolidated`, `backfilled: true`.
- Lines 1–10: Describes backfill-after-discovery pattern; research is written AFTER discovery to retrofit provenance chain.

**Status Maturity Gradient** (`vault/constitution/vault-folder-structure-constitution.md` line 80; implicit in `confidence-levels.md`):
- Status progression: `draft → exploratory → active → consolidated → evergreen`.
- Documented in `epistemic-chain.md` line 74: "The maturity lifecycle position of a document."

**Research folder structure:** 13 discoveries examined all contain `research/` subdirectories with `research.md` + optional `research-synthesis.md`. Pattern: lens files → `research.md` (cross-lens synthesis) → `discovery.md` (decision crystallization).

**No explicit promotion mechanics found.** Status transitions are described (draft→exploratory→active) but no script or constitution enumerates the gate, approval process, or mutation rules. The folder-structure-fractal discovery (lines 82–89) describes the migration cascade as a 7-step "amendment cascade" but this is instance-specific, not a general promotion operator.

## Hand-off

The vault already encodes L₁ (schema/constitution structure) and L₂ (discovery/instance content) as mechanically enforced mirror pairs via path-validators and frontmatter gates. The new discovery can cite folder-structure-fractal (path-as-classifier, path-coherence invariant §C-2), two-layer-platform-architecture (recursive application of L₁↔L₂ at infrastructure scale), and epistemic-chain (research→discovery→premise→axiom chain as proof-of-concept that structure can force knowledge maturation). The OQ-4 hole is a named gap: no canonicalization protocol exists yet, explicitly blocking cross-repo mirroring.
