---
description: Edge legality matrix — for every catalog edge, the admitted source/target node_type pairs, cardinality, and inverse name. Authoritative lookup for "is this edge legal between these two nodes?"
---

# Edge Catalog (Legality Matrix)

## Objective

Resolve the question: for a prospective edge `(source, edge_type, target)`, is the declaration legal? Used by the domainspec-vault-metadata-curator and any audit pass that has to check or repair edges. `edges.md` answers "which edge name should I pick"; this skill answers "is this name legal here."

## How agents use this skill

For any prospective edge `(source_node, edge_type, target_node)`:

1. Look up `edge_type` in the matrix below (universal / document-specific / session-specific).
2. Confirm `source_node.node_type` is in the row's **Source `node_type`** column.
3. Confirm `target_node.node_type` is in the row's **Target `node_type`** column.
4. For session-specific edges: confirm `source_node` has `is_session: true`.
5. Check **Cardinality** for conflicts with existing edges of the same type from the same source (`1:1` edges cannot coexist).
6. **Skills/agents carve-out (bidirectionality exception):** if the target is a `.claude/skills/*.md` or `.claude/agents/*.md` file, the edge is **legal-by-design forward-only**. Accept the source-side declaration; do NOT require a `## Connections` block or inverse on the target. (See `edges.md` "Exception" section.) For other non-vault targets (e.g., `.planning/**`, `.github/**`, sibling repos), HALT pending OQ-C of `vault/discovery/curator-pipeline-integration/discovery.md`.

If any check fails, do NOT auto-fix. Surface as `NEEDS_HUMAN`. New edge types are admitted only through a discovery — never coined inline.

## Universal edges

(Both sessions and documents may originate these.)

| Forward | Inverse | Source `node_type` | Target `node_type` | Cardinality | Definition |
|---------|---------|--------------------|--------------------|-------------|------------|
| `derives-from` | `derives` | any | any | N:M | A draws intellectual or evidential basis from B. The chain backbone — research derives from strategy, discovery derives from research, premise derives from discovery, etc. |
| `cites` | `cited-by` | any | any | N:M | A cites B as supporting a load-bearing claim. Removing the cite weakens the argument. Replaces the deprecated `references` and `contextualizes`. |
| `contradicts` | `contradicts` (symmetric) | any | any | N:M | A logically conflicts with B. Must be resolved before either document promotes. The same edge name is declared on both sides. |
| `supersedes` | `superseded-by` | discovery, implementation-plan, constitution, spec | (same node_type) | 1:1 | A wholesale replaces B. B becomes historical. |

## Document-specific edges

(Sessions never originate these.)

| Forward | Inverse | Source `node_type` | Target `node_type` | Cardinality | Definition |
|---------|---------|--------------------|--------------------|-------------|------------|
| `codified-as` | `codifies` | premise, axiom, discovery | constitution | 1:N | A is rendered as an enforceable rule by B. Chain-mandated (epistemic-chain.md D-4). |
| `operationalized-by` | `operationalizes` | constitution, discovery | skill | 1:N | A is executed as runnable behavior by skill B. Chain-mandated (epistemic-chain.md D-4). |
| `implements` | `implemented-by` | implementation-plan | discovery | N:1 | A executes the decisions recorded in B. |
| `validates` | `validated-by` | audit, test, research, subagents-research | premise, axiom, spec | N:M | A provides evidence about B. Increases B's `veracidade` over time. Chain-mandated (epistemic-chain.md D-5). |
| `refines` | `refined-by` | discovery, spec | discovery, spec, constitution | N:1 | A makes B more specific without replacing it. Distinct from `supersedes` (replacement) and `derives-from` (origin). |
| `governed-by` | `governs` | discovery, implementation-plan, spec | discovery, constitution | N:1 | A's behavior is bound by the rules of B. |
| `subclass-of` | `superclass-of` | conceptual, premise (also domain-axis values) | conceptual, premise | N:1 (tree-constrained) | A is a more specific kind of B. Tree, not DAG — multiple inheritance forbidden. |
| `part-of` | `has-part` | conceptual, spec | conceptual, spec | N:1 | A is a structural component of B. |
| `alternative-to` | `has-alternative` | discovery (Alternatives section) | discovery | 1:N | A was considered as a competing path before B's decision was made. |

## Session-specific edges

(Source must have `is_session: true`. Sessions are processes; these edges encode what the session *did*.)

| Forward | Inverse | Source `node_type` | Target `node_type` | Cardinality | Definition |
|---------|---------|--------------------|--------------------|-------------|------------|
| `continues-from` | `continued-by` | session | session | 1:1 | A is a temporal continuation of B; same investigation across two sittings. |
| `creates` | `created-by` | session | any | N:M | A produced B as output. Replaces the deprecated `provenance-for`. |
| `modifies` | `modified-by` | session | any | N:M | A changed B's content (without wholesale replacement). |
| `revisits` | `revisited-by` | session | discovery, premise | N:M | A reconsidered the questions or decisions recorded in B without necessarily refuting them. |
| `refutes` | `refuted-by` | session | session, discovery, premise | N:M | A actively argues against B. Stronger than `contradicts` because it is intentional. |
| `opens-question` | `question-opened-by` | session | discovery | N:M | A surfaces a new open question recorded in B's `## Open Questions` section. |
| `closes-question` | `question-closed-by` | session | discovery | N:M | A resolves an open question previously recorded in B. |
| `consumes` | `consumed-by` | session | any | N:M | A read or used B as input without deriving new claims from it. Distinct from `derives-from` (which carries intellectual lineage). |

## Deprecated edges — do NOT use

| Old edge | Folds into | Notes |
|----------|------------|-------|
| `resolves` | `closes-question` (for sessions) or `supersedes` (for documents) | Was ambiguous about whether the relationship was structural or session-driven. |
| `references` | `cites` | Generic-mention edges collapse into `cites` with prose for nuance. |
| `contextualizes` | `cites` | Same reasoning. |
| `exemplifies` | (defer) | Was the inverse of `instance-of`, which is also deferred until first vault use. |
| `depends-on` | `derives-from` | Distinction between intellectual derivation and runtime dependency was rarely needed in practice. |
| `questions` | `opens-question` | Session-specific framing now explicit. |
| `updates` | (none — use `version:` frontmatter) | Minor version bumps are tracked in frontmatter, not as edges. |
| `deprecates` | (none — use `status: deprecated`) | Deprecation is a state of the document, not a relationship to another. |
| `produces` / `produced-by` | `derives-from` / `derives` | Per the bidirectionality rule, the canonical direction is `derives-from`. |
| `provenance-for` | `creates` | Sessions create the documents whose provenance they are. |
| `grounds`, `grounded-by` | (none) | Old SQL-layer inverses; with bidirectional Markdown, inverses are explicit and named in this catalog. |

## Authoring rules

1. **Both sides must declare (between vault nodes).** A `## Connections` block on the source declares the forward edge; the target document declares the inverse. Both forms are in this catalog. Asymmetric declarations between vault nodes are bugs. **Exception:** edges into `.claude/skills/*.md` and `.claude/agents/*.md` are **forward-only by design** — those targets are not vault graph nodes, carry no `## Connections` block, and require no inverse. Such forward-only edges are NOT bugs. (See `edges.md` "Exception" section.)
2. **Do not invent edges.** If a relationship does not fit, propose a new edge through a discovery document — do not coin one inline.
3. **`contradicts` is special.** Both sides use the same name (it is symmetric). Both must still declare.
4. **Sessions ship `## Connections` too.** Older sessions used `## Contradictions`, `## Files touched`, etc. — those are non-conformant and will be migrated.

## See also

- `.claude/skills/custom/edges.md` — author-facing picker (30-second decision); also carries the Section 8 bidirectionality rule with the skills/agents exception.
- `vault/ontology-conventions.md` — Section 8 rationale and Appendix A (mathematical foundation). **Rationale only — do NOT read for rule application; this skill is the rule.**
