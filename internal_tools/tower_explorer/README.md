# tower_explorer

Reflection-tower structural gate for vault-style knowledge graphs.

This tool is **Gate 0** for the reflection-tower side of the project. It is
orthogonal to `categorical_tooling_guard`, which is Gate 1 for flat L1→L2
compilation fidelity.

## Why This Exists

`categorical_tooling_guard` asks:

> Is this single DomainSpec spec rich enough to compile without obvious L1
> residue hazards?

`tower_explorer` asks a different question:

> Do the meta-documents that govern the system preserve their promotion origin
> as they move across tower/meta layers?

That distinction matters. The reflection tower is about auditing the audit:
whether governance, premise, constitution, discovery, and spec nodes carry
enough provenance to explain which rung introduced a rule or edge.

## Current Scope

M1 implements the first Tower Explorer check:

| Check | Name | Status |
|---|---|---|
| T-1 | Origin certificate | implemented |
| T-2 | Reflects-iso report | not implemented |
| T-3 | K/Q direction report | not implemented |
| T-4 | Obstruction witness renderer | not implemented |

T-1 scans a vault root, parses markdown frontmatter and `## Connections`
tables, detects cross-layer edges, and reports whether those edges carry an
`origin_rung` annotation.

An edge is treated as cross-layer when the source and resolved target have
different `layer` frontmatter values.

## Origin Annotation

For now, an edge carries origin information when its `## Connections` row
contains either:

- `origin_rung: <value>`
- `origin-rung: <value>`

Example:

```markdown
| [../premise/system-premises.md](../premise/system-premises.md) | `derives-from` | origin_rung: L4; governance premise for this rule |
```

## Usage

Analyze a vault root:

```bash
tower-explorer analyse-vault vault
```

Run the T-1 origin certificate:

```bash
tower-explorer certify-origin vault
```

Emit JSON:

```bash
tower-explorer certify-origin vault --json
```

## Exit Codes

| Exit code | Meaning |
|---:|---|
| `0` | `pass`, or `flag` without `--fail-on-flag` |
| `1` | `flag` with `--fail-on-flag` |
| `2` | `block` |

## Tests

```bash
./.venv/bin/pytest -q internal_tools/tower_explorer/tests/test_explorer.py
```

## Current Limits

- The parser supports common markdown links and wiki links, but it is not a
  full Obsidian parser.
- T-1 only checks explicit `origin_rung` annotations on cross-layer edges and currently treats missing annotations as a forward-only `flag` for the legacy corpus.
- T-2/T-3/T-4 still need implementation. Their Lean backing lives in the
  reflection-tower formalization, but the Python renderer/checker layer is not
  built yet.

