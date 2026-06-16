---
tags: [vault, discovery, claude-md, memory, boundary, information-density, enforcement, cross-repo, ax-ont]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, technical
status: draft
version: 0.1.0
last_updated: 2026-06-16
---

# The Agent-Context Boundary Rule — Authoring the Best CLAUDE.md + MEMORY.md

## Objective

Define a portable, cross-repo **rule** for authoring and maintaining the agent-context boundary (`CLAUDE.md` plus the `MEMORY.md` index it points at) so that it stays a faithful, dense encoding of an unbounded repo. The rule is split into two layers by enforceability: a mechanically-enforced **faithfulness floor** (a validator) and a best-effort **judgment ceiling** (an authoring discipline). The end state is one shared contract that every consumer repo's boundary is checked against, instead of per-repo prose that silently rots.

---

## 1. Business Context

### Why now

Two existing artifacts collide the moment you try to turn "the best CLAUDE.md" into a rule, and the collision has never been resolved into an authoring contract:

- The **I7 boundary bridges** (`memory-as-mass-energy.md`, `memory-as-conformal-boundary.md` in the `domainspec-lean-formalization` repo) establish that `CLAUDE.md` + `MEMORY.md` is the *boundary* `∂B` on which an unbounded bulk is encoded so a single conversation reconstructs it — the point of maximum information density, where a corrupted boundary entry produces a *bulk reconstruction that contradicts the actual bulk*, silently and downstream.
- The **harness-as-enforcement-layer** discovery establishes that routing in `CLAUDE.md` is *best-effort*; only hooks are enforced by the harness regardless of agent intent.

Put together: a rule written as `CLAUDE.md` prose cannot enforce itself — it is the very "corrupted boundary, best-effort" failure both documents name. The rule therefore has to be expressed partly as a mechanical check. No such check exists today, in any repo.

### What's broken

- **The framework's own boundary already carries broken edges — verified.** `CLAUDE.md` Route 2 points at `docs/vault/agent-navigation.md`, which does not exist (the real file is `vault/agent-navigation.md`). `.claude/skills/custom/discovery-writing.md` (Navigation section) points at `docs/vault/dictionary-business.md` and `docs/vault/dictionary-sys.md`, neither of which exists at that path or at `vault/`. These are exactly the I7-predicted failure mode (broken dependency edges, not missing content), sitting in the most reflexive object in the system.
- **No validator on the boundary.** `CLAUDE.md` and the agent `MEMORY.md` are not covered by any existence/shape check. The `PreToolUse` frontmatter hook (`.claude/README.md`) governs *vault* `.md` writes; it does not parse `CLAUDE.md` routes or `MEMORY.md` pointers. A route can name a dead file and nothing flags it.
- **The authoring discipline is implicit.** The qualities that make a boundary good — density over length, encoding the load-bearing dependency edge, keeping the boundary to invariants (not transient state), the two-stage selection rule — live only in the I7 bridges as prose in a *different repo*. AX-ONT-4 says implicit knowledge is lost knowledge; this discipline is currently lost to every consumer repo.
- **The rule is re-invented per repo.** `domainspec/CLAUDE.md`, `domainspec-lean-formalization/CLAUDE.md`, and Arcanum's generated `CLAUDE.md` (`tools/bootstrap_arcanum.sh`) each carry their own routing prose with no shared contract. The same authoring knowledge is paid for N times and drifts N ways.

### What stays the same

- **The AX-ONT axioms** (`vault/axiom/ontology-axioms.md`). The rule *derives from* AX-ONT-1/3/4/6/7; it does not revise them. This is not new doctrine.
- **The existing frontmatter-injection hook** for vault `.md` files. Untouched; the new validator is a sibling, not a replacement.
- **The Route-by-Objective content of each `CLAUDE.md`.** The rule governs the boundary's *faithfulness and shape*, not which routes a given repo chooses to declare.
- **The harness-as-enforcement verdict.** The rule accepts "prose is best-effort" as a constraint and builds on it; it does not try to make prose enforceable.
- **The MEMORY.md design** as an index of pointer lines. The rule formalizes that design; it does not propose a new memory format.

---

## 2. Core Concepts

### C-1 — The agent-context boundary `∂B` (the rule's subject)

The subject is exactly two files and their relation: `CLAUDE.md` (loaded at position 0 of every conversation) plus the `MEMORY.md` index it points at. Everything else — skills, vault, code, sessions — is the *bulk* `B`. The rule never governs the bulk; it governs only whether the boundary faithfully and densely addresses it. This scoping is what makes the rule portable: every repo has the same boundary object even when its bulk differs entirely.

### C-2 — The enforceability split (the load-bearing decision)

The rule is a **pair**, not a document:

- **Layer A — enforced floor (validator).** The mechanically-checkable subset of "good boundary." Runs as a hook / CI gate. This is the only part that survives without human discipline.
- **Layer B — judgment ceiling (authoring discipline).** The semantic qualities no script can check. Lives as an authoring skill + a review gate (optionally an LLM-judge).

Splitting here is forced by the Why-now collision: anything in Layer A is real enforcement; anything in Layer B is best-effort and must be honestly labelled as such.

### C-3 — The faithfulness floor (Layer A invariants)

Each invariant is the operationalization of an axiom against `∂B`:

| Invariant | Axiom | Check |
|---|---|---|
| Every `MEMORY.md` pointer resolves (path/anchor/ID exists) | AX-ONT-4 (implicit = lost) | resolve each link; fail on dead targets — the I7 failure mode #1 |
| Every `CLAUDE.md` route names files that exist | AX-ONT-4 | parse route targets; fail on MISS |
| Boundary budget respected (line/token cap) | AX-ONT-1 + Bekenstein | count; the boundary is area, not volume |
| Each `MEMORY.md` index line is a pointer (carries a link) | AX-ONT-6 (navigable density) | parse; flag prose-only lines |
| One fact per memory file; frontmatter present | AX-ONT-3 (unique info) | reuse existing frontmatter check; flag multi-fact files |
| No transient/dated state at the boundary | I7 "stable boundary" | regex for ephemeral markers |

### C-4 — The judgment ceiling (Layer B discipline)

Not script-checkable; encoded as an authoring checklist and a review gate:

- **Density over length.** A boundary line is a metric coefficient; decorative lines flatten the geometry. Prefer pointer lines.
- **Encode the load-bearing dependency edge.** "Write the edges that, if cut, make the bulk unrecoverable" — not "write everything." A flat list is a wrong boundary; derivation order (even terse) is a right one.
- **Invariant, not transient.** The boundary encodes axioms, voice commitments, irrevocable decisions; transient state goes to the bulk.
- **Two-stage selection.** ⟨context → ontology `O*` → leverage point `p*`⟩ — `CLAUDE.md` is the *index over boundaries*, and the selection rule decides which to project. Without it the boundary is unreadable.

### C-5 — Axiom derivation, not new doctrine

The rule is a *profile* of existing axioms applied to `∂B`. AX-ONT-1 (minimize retrieval entropy) is what the boundary optimizes; AX-ONT-3 (unique node) is why redundant lines waste capacity; AX-ONT-4 (implicit = lost) is why edges must be explicit and resolvable; AX-ONT-6 (navigable density) is the pointer-shape rule; AX-ONT-7 (topology is engineerable) is the meta-license. Recording these derivations is what lets the rule be challenged at the axiom level rather than as ad-hoc style.

### C-6 — Portability contract

The rule is one contract with two shipped components — a validator (Layer A) and an authoring skill (Layer B) — plus a per-repo instance (`CLAUDE.md` + `MEMORY.md`). Each consumer repo runs the same validator against its own boundary. The *distribution mechanism* (copy / submodule / generated) is unresolved and is downstream of the cross-repo canonicalization protocol (see OQ-2); this discovery does not claim to resolve it.

### C-7 — The honesty bound (what the rule does NOT promise)

Borrowed verbatim from the bridges' own "where the analogy breaks": `CLAUDE.md` has **no horizon** — its capacity is context budget + human curation, not an area-entropy law; the compression is *engineered*, not forced by geometry. The boundary is human-curated and can be wrong in ways a physical boundary cannot. Reconstruction is *addressability*, not equivalence. Therefore the rule does not "guarantee the best CLAUDE.md." It (a) enforces the faithfulness floor mechanically and (b) makes the judgment discipline explicit and reviewable. Overselling it reintroduces exactly the rot it targets.

---

## 3. Layer A — validator specification (sketch)

A single check over a repo's boundary, runnable as a pre-commit hook and a CI gate, `--warn-only` for local use. Inputs: the repo `CLAUDE.md`, the agent `MEMORY.md` and its memory dir. Behavior:

- Parse `MEMORY.md` index lines → resolve every link target → report all dead pointers (exit non-zero).
- Parse `CLAUDE.md` route/skill/file references → resolve → report all MISS targets.
- Count boundary size against a configured cap; warn approaching, fail past.
- Flag index lines with no pointer and memory files with absent/invalid frontmatter (delegating frontmatter shape to the existing check).
- Emit a faithfulness report (offenders + axiom each violates), not just pass/fail.

The script is deliberately small — its job is the I7 faithfulness floor, nothing semantic.

## 4. Layer B — authoring discipline (sketch)

An authoring skill the agent reads before editing `CLAUDE.md`/`MEMORY.md`, carrying the C-4 checklist and the C-7 honesty bound, plus a periodic review gate that asks the judgment questions a script cannot: is this line dense, is the load-bearing edge encoded, is this an invariant or transient, does the two-stage index still read.

## 5. Where it lives (decision-pending)

Recommended shape: a **constitution** that codifies the AX-ONT-derived rule (`codified-as`), an authoring **skill** that operationalizes it (`operationalized-by`), and a **validator hook** for Layer A. This keeps the chain axiom → constitution → skill/hook intact. The single-convention alternative is lighter but loses the codifies/operationalizes provenance. Settled in OQ-4.

---

## Open Questions

- **OQ-1 — Can density be proxied mechanically at all?** Embedding-based near-duplicate detection or compression-ratio heuristics could push *some* of Layer B into Layer A. **Recommendation:** no for v1 — treat density as judgment + optional LLM-judge review; revisit only if the judgment gate proves unreliable.
- **OQ-2 — Cross-repo distribution mechanism.** Copy, git submodule, or an Arcanum-style generated install? **Recommendation:** defer to the cross-repo-rollout canonicalization protocol (upstream and unresolved); pilot the validator + skill in `domainspec` first, generalize only after one repo proves the contract.
- **OQ-3 — Does `CLAUDE.md` need a machine-readable route manifest?** The validator must parse route targets out of prose today, which is brittle. **Recommendation:** add a fenced, machine-readable route-manifest block to `CLAUDE.md` (not full frontmatter — `CLAUDE.md` is loaded raw at position 0 and should not carry vault frontmatter), and have the validator parse that block.
- **OQ-4 — Artifact form: constitution+skill+hook, or single convention?** **Recommendation:** constitution + operationalized-by skill + validator hook (preserves the axiom→rule provenance chain). Confirm before authoring the rule artifact.
- **OQ-5 — Validate the "density matters" premise empirically first?** The I7 falsifiable prediction (two conversations, identical bulk, distinct memory diverge in inference quality ∝ `D_KL`) is testable. **Recommendation:** register it as a pre-registered *experiment* (dispatch_type: experiment), but do NOT gate the rule on it — the faithfulness floor (Layer A) pays rent regardless of whether the density geometry holds.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/axiom/ontology-axioms.md` | `cites` | AX-ONT-1/3/4/6/7 are the axioms this rule operationalizes against the boundary object. Load-bearing. |
| `vault/discovery/harness-as-enforcement-layer/README.md` | `cites` | Supplies the "CLAUDE.md routing is best-effort; only hooks enforce" verdict that forces the Layer A / Layer B split. |
| `vault/discovery/cross-repo-rollout/discovery.md` | `cites` | The cross-repo canonicalization protocol is upstream of OQ-2; this discovery does not resolve it. |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/discovery.md` | `cites` | Shares the "structure is navigational signal, enforcement is the validator" demotion; this rule applies the same demotion to the boundary object. |
| (external) `domainspec-lean-formalization/research-physics/bridges/memory-as-mass-energy.md` | `cites` | I7 bridge — boundary as point of maximum information density; density-over-length and Bekenstein floor. Cross-repo; no vault inverse. |
| (external) `domainspec-lean-formalization/research-physics/bridges/memory-as-conformal-boundary.md` | `cites` | I7 bridge — dependency edge as the load-bearing invariant; corrupted-boundary failure mode. Cross-repo; no vault inverse. |
