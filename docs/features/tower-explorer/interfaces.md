---
tags: [feature, tower-explorer, interfaces, cli, json]
node_type: spec
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-22
derives-from: docs/features/tower-explorer/spec.md
---

# Interfaces — Tower Explorer

<!-- CLI contract, JSON output schema, pipeline integration with guard.py. -->

---

## CLI

```
tower-explorer <vault-root> [OPTIONS]
```

### Options

| Flag | Default | Description |
|---|---|---|
| `--json` | off | Emit full JSON report to stdout instead of human-readable table |
| `--fail-on-flag` | off | Exit 1 on `structural-flag` (default: exit 0 on flag, exit 2 on block only) |
| `--render-witnesses` | off | Call guard.py and write `witness.md` files for each M6 cluster |
| `--checks T1,T2,T3,T4` | all | Run only the specified checks (comma-separated) |
| `--min-rung N` | 0 | Only analyse nodes at rung ≥ N |
| `--auto-tag` | off | Heuristically assign `anchor_direction` to untagged edges and write suggestions (does not commit) |

### Exit codes

| Code | Meaning |
|---|---|
| 0 | `structural-pass` (or `structural-flag` without `--fail-on-flag`) |
| 1 | `structural-flag` with `--fail-on-flag` |
| 2 | `structural-block` |

### Human-readable output (default)

```
Tower Explorer — vault/
  Nodes:            142
  Promotion edges:   38
  Rung map:          OK (0 unresolvable)

  T-1 Origin Certificates   PASS  (0 missing)
  T-2 Reflects-Iso          FLAG  (2 acknowledged collapses)
  T-3 K/Q Direction         FLAG  (5 untagged edges)
  T-4 Obstruction Witnesses PASS  (3 witnesses rendered)

  Verdict: STRUCTURAL-FLAG
  Run with --fail-on-flag to block CI on flags.
```

---

## JSON output schema

Emitted to stdout when `--json` is passed. Mirrors guard.py's output structure for pipeline composability.

```json
{
  "verdict": "structural-pass | structural-flag | structural-block",
  "summary": {
    "nodes": 142,
    "promotionEdges": 38,
    "missingOriginCerts": 0,
    "reflectsIsoViolations": 0,
    "acknowledgedCollapses": 2,
    "missingDirectionTags": 5,
    "mixedKQChains": 0,
    "obstructionWitnessesRendered": 3
  },
  "diagnostics": [
    {
      "code": "MISSING_DIRECTION_TAG",
      "severity": "flag",
      "edge": { "source": "vault/premise/foo.md", "target": "vault/spec/bar.md" },
      "message": "Cross-layer edge missing anchor_direction (K or Q)",
      "remediation": "Add `anchor_direction: K` or `anchor_direction: Q` to the edge frontmatter"
    }
  ],
  "rungMap": {
    "vault/axiom/residue-axiom.md": 0,
    "vault/discovery/graph-as-residue-attractor/README.md": 1,
    "vault/premise/residue-grows.md": 2
  },
  "witnesses": [
    {
      "cluster": ["ConceptA", "ConceptB"],
      "writtenTo": "docs/features/foo/witness.md",
      "rung": 3
    }
  ]
}
```

### Diagnostic codes

| Code | Severity | Description |
|---|---|---|
| `MISSING_ORIGIN_CERT` | flag | Promotion edge has no `origin_rung` field |
| `RETROACTIVE_ORIGIN` | flag | `origin_rung` claims a rung lower than the source node's current rung |
| `REFLECTS_ISO_VIOLATION` | block | Two distinct lower-layer nodes promote to the same target without a `collapses` declaration |
| `ACKNOWLEDGED_COLLAPSE` | info | A `collapses` declaration was found; logged for human review |
| `MISSING_DIRECTION_TAG` | flag | Cross-layer edge has no `anchor_direction` |
| `MIXED_KQ_CHAIN` | block | A traceability chain reverses K/Q direction without a rung boundary |
| `MISSING_RUNG` | flag | A node's rung is unresolvable (broken `derives-from` chain) |
| `CIRCULAR_DERIVATION` | block | A `derives-from` cycle was detected |
| `RUNG_SKIP` | block | A cross-layer edge skips more than one rung |
| `WITNESS_RENDERED` | info | An `ObstructionWitness` file was written |

---

## Pipeline integration

### Sequential (recommended)

```bash
# Gate 0 — structural integrity
tower-explorer vault/ --json > tower-report.json
# Gate 1 — compilation fidelity (only if Gate 0 passes or flags)
categorical-tooling-guard docs/features/my-feature/ --json > guard-report.json
```

In CI (`Makefile` or GitHub Actions):

```yaml
- name: Gate 0 — Tower Explorer
  run: tower-explorer vault/ --fail-on-flag
- name: Gate 1 — Categorical Guard
  run: categorical-tooling-guard docs/features/my-feature/
```

### With witness rendering

```bash
tower-explorer vault/ --render-witnesses
# writes witness.md alongside each flagged spec; commit or review before CI
```

### Library usage (for lean-code-validator v2 integration)

```python
from tower_explorer import analyse_vault, TowerPolicy

policy = TowerPolicy(
    fail_on_missing_cert=False,   # M1 forward-only: don't block old edges
    fail_on_reflects_iso=True,    # T-2: block uncollapsed collapses
    fail_on_mixed_kq=True,        # T-3: block direction violations
    render_witnesses=True,        # T-4: always write witness.md
)

result = analyse_vault(vault_root="vault/", policy=policy)
print(result.verdict)            # "structural-pass"
print(result.rung_map)           # {"vault/axiom/...": 0, ...}
```

---

## `witness.md` format

Written by `render_witness` to the same directory as the flagged spec.

```markdown
---
node_type: audit
derives-from: docs/features/my-feature/spec.md
m6_cluster: [ConceptA, ConceptB]
rung: 3
last_updated: 2026-05-22
---

# Obstruction Witness — ConceptA / ConceptB

Two concepts with identical meta-type `Entity` and identical outgoing edge pattern.
They are indistinguishable under the current schema; the round-trip functor collapses them.

## Refuting subgraph

\`\`\`mermaid
graph LR
    A[ConceptA] -- performs --> Op1
    B[ConceptB] -- performs --> Op1
    A -.->|missing| B
\`\`\`

## Missing disambiguation edge

Add an edge from `ConceptA` or `ConceptB` to a concept that the other does not reach,
or introduce a distinguishing attribute edge. Suggested: `ConceptA --owns--> ResourceX`.

## Tower rung

Detected at rung 3 (spec layer). Obstruction persists through every higher rung
by the persistence lemma (`ReflectionTower.tower_hasTwoObjectsNoMorphism`).
```
