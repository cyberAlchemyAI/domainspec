---
description: How to declare bidirectional relationships in ## Connections blocks — pick the right edge in under 30 seconds. Bidirectionality applies between vault nodes; outgoing edges into `.claude/skills/*` and `.claude/agents/*` are forward-only by design.
---

# Edges Cheatsheet

## Objective

Pick the correct edge name (forward + inverse) when wiring a vault document into the graph via its `## Connections` block, declare both sides, and stop here for the cheat — go to Appendix C of `vault/ontology-conventions.md` for full cardinality, node-type constraints, and rationale. **Carve-out:** when the target is a `.claude/skills/*` or `.claude/agents/*` file, only the forward edge is written — those files are not vault graph nodes, carry no `## Connections` block, and require no inverse (see "Exception" section below).

## MANDATORY — every relationship is bidirectional between vault nodes

Every edge **between vault nodes** is declared on **both** endpoints. The source document writes the forward edge in its `## Connections` block; the target document writes the inverse in its own `## Connections` block. Both lines are explicit Markdown — there is no SQL-layer inference of the missing side. The forward/inverse name pair is **fixed by the catalog below** — authors do not coin inverses ad hoc. `contradicts` is the only symmetric edge: both sides use the same name `contradicts`.

**Formal carve-out (skills/agents).** Vault → `.claude/skills/*` and vault → `.claude/agents/*` edges are **legal-by-design forward-only**. The target file carries no `## Connections` block and no inverse is required or expected. These files are operational artifacts (skill prompts, agent definitions), not vault graph nodes. The audit script must NOT flag these as asymmetric. See the dedicated "Exception" section below for the formal statement.

If a relationship does not fit any catalog edge, do not invent one — propose it through a discovery in `vault/discovery/`.

## Exception — forward-only edges into skill and agent files

Vault documents MAY declare forward edges (e.g., `cites`, `operationalized-by`, `proposes-edit`) into `.claude/skills/*.md` and `.claude/agents/*.md` files. These edges are **legal-by-design and forward-only**:

- The source vault document writes the forward edge in its `## Connections` block as usual.
- The target skill/agent file does NOT carry a `## Connections` block.
- No inverse row is written or expected on the target.
- The audit script must NOT flag these forward-only edges as asymmetric or missing-inverse.

**Why:** skill files and agent files are operational artifacts that govern runtime behavior. They are not vault graph nodes — they have no `node_type`, no `veracidade`, no `convicção`, and they are not part of the epistemic chain. Treating them as graph nodes would force them to carry vault frontmatter and to participate in bidirectionality, which conflates governance artifacts with knowledge artifacts.

**Scope.** This carve-out is limited to `.claude/skills/**` and `.claude/agents/**`. Other non-vault paths (e.g., `.planning/**`, `.github/**`, sibling repos) remain a separate question — see OQ-C in `vault/discovery/curator-pipeline-integration/discovery.md`.

## Connections block format

Place this block near the bottom of the document. One row per outgoing edge.

```markdown
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `path/to/other.md` | `derives-from` | one-sentence reason this edge exists |
```

## Edge picker

### Universal (any node_type → any node_type)

| Forward | Inverse | When to use |
|---------|---------|-------------|
| `derives-from` | `derives` | A draws its intellectual or evidential basis from B. The chain backbone — research from strategy, discovery from research, premise from discovery, etc. |
| `cites` | `cited-by` | A cites B as supporting a load-bearing claim. Removing the citation weakens the argument. (Replaces deprecated `references` and `contextualizes`.) |
| `contradicts` | `contradicts` | A logically conflicts with B. Symmetric — both sides use the same name. Must be resolved before either document promotes. |
| `supersedes` | `superseded-by` | A wholesale replaces B. B becomes historical. Same `node_type` on both sides. |

### Document-specific (between non-session documents)

| Forward | Inverse | When to use |
|---------|---------|-------------|
| `codified-as` | `codifies` | A premise/axiom/discovery is rendered as an enforceable rule by a constitution B. Chain-mandated. |
| `operationalized-by` | `operationalizes` | A constitution/discovery is executed as runnable behavior by a skill B. Chain-mandated. |
| `implements` | `implemented-by` | An implementation-plan A executes the decisions recorded in discovery B. |
| `validates` | `validated-by` | An audit/test/research A provides evidence about premise/axiom/spec B. Mechanism by which B's `veracidade` increases. |
| `refines` | `refined-by` | A makes B more specific without replacing it. Distinct from `supersedes` (replacement) and `derives-from` (origin). |
| `governed-by` | `governs` | A's behavior is bound by the rules of constitution/discovery B. |
| `subclass-of` | `superclass-of` | A is a more specific kind of B. Tree, not DAG — multiple inheritance forbidden. |
| `part-of` | `has-part` | A is a structural component of B (conceptual or spec). |
| `alternative-to` | `has-alternative` | A was considered as a competing path before B's decision was made (Alternatives sections of discoveries). |

### Session-specific (source must be `is_session: true`)

| Forward | Inverse | When to use |
|---------|---------|-------------|
| `continues-from` | `continued-by` | Session A is a temporal continuation of session B; same investigation across two sittings. |
| `creates` | `created-by` | Session A produced document B as a NEW file. Use only when the file did not exist before this session. (Replaces deprecated `provenance-for`.) |
| `modifies` | `modified-by` | Session A changed B's content. Use this for any edit to a pre-existing file, including adding new sections — file creation is `creates`, not `modifies`. |
| `revisits` | `revisited-by` | Session A reconsidered the questions/decisions in B without necessarily refuting them. |
| `refutes` | `refuted-by` | Session A actively argues against B. Stronger than `contradicts` because intentional. |
| `opens-question` | `question-opened-by` | Session A surfaces a new open question recorded in discovery B's `## Open Questions`. |
| `closes-question` | `question-closed-by` | Session A resolves an open question previously recorded in discovery B. |
| `consumes` | `consumed-by` | Session A read or used B as input without deriving new claims from it. Distinct from `derives-from` (which carries lineage). |

> Session-specific edges are only valid when the source document has `is_session: true`. Document-specific edges have node-type constraints — see Appendix C for the exact source/target matrix.

## Examples

### Example 1 — A discovery deriving from research, citing a constitution

> Note: the bidirectionality rule shown in this example applies between vault nodes. Edges into `.claude/skills/*` and `.claude/agents/*` are forward-only by design — see the "Exception" section above.

In `vault/discovery/domainspec-vault-edges/discovery.md`:

```markdown
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-vault-edges/research/findings.md` | `derives-from` | Catalog and rationale come from the F1/F2 dispatch findings. |
| `vault/ontology-conventions.md` | `cites` | Section 8 bidirectionality rule is load-bearing for this discovery. |
```

In `vault/discovery/domainspec-vault-edges/research/findings.md` (target side):

```markdown
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-vault-edges/discovery.md` | `derives` | This findings file is the basis the parent discovery derives from. |
```

In `vault/ontology-conventions.md` (target side):

```markdown
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-vault-edges/discovery.md` | `cited-by` | The domainspec-vault-edges discovery cites Section 8 as load-bearing. |
```

### Example 2 — A session creating a document and contradicting a premise

In `vault/sessions/2026-05-02-1820-vault-foundations.md` (`is_session: true`):

```markdown
## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-vault-edges/findings.md` | `creates` | This session produced the findings file as output. |
| `vault/premise/old-edge-policy.md` | `contradicts` | Session results conflict with the prior premise about edge inference. |
```

In `vault/premise/old-edge-policy.md` (target side, symmetric for `contradicts`):

```markdown
| `vault/sessions/2026-05-02-1820-vault-foundations.md` | `contradicts` | The session's findings logically conflict with this premise. |
| `vault/discovery/domainspec-vault-edges/findings.md` | `created-by` | The session that produced findings.md also surfaced this conflict. |
```

## Deprecated edges — do NOT use

| Old edge | Use instead |
|----------|-------------|
| `references`, `contextualizes` | `cites` |
| `produces` / `produced-by` | `derives-from` / `derives` |
| `provenance-for` | `creates` |
| `resolves` | `closes-question` (sessions) or `supersedes` (documents) |
| `questions` | `opens-question` |
| `depends-on` | `derives-from` |
| `exemplifies`, `instance-of`, `instantiates` | (deferred — do not use until admitted) |
| `updates`, `deprecates` | use `version:` / `status:` frontmatter, not edges |
| `grounds`, `grounded-by` | (none — write the forward edge from the catalog above) |

## See also

- `vault/ontology-conventions.md` — Section 8 (bidirectionality rule with skills/agents carve-out) and **Appendix C** (full 21-edge catalog with cardinality and node-type constraints).
- `.claude/skills/custom/frontmatter.md` — frontmatter cheatsheet (every doc starts with `## Objective`).
- `.claude/skills/custom/frontmatter-semantics.md` — definitions of every frontmatter tag.
