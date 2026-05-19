---
tags: [lean-code-validator, interfaces, eval, cli]
node_type: spec
is_session: false
layer: [application]
nature: reference
profile: paper-baseline
status: draft
version: 0.1.0
last_updated: 2026-05-14
---

# Interfaces: lean-code-validator

---

## LeanEvalInterface

**Exposes:** [gradeFor](operations.md#gradefor), [CodegenReadinessReport](domain.md#codegenreadinessreport)

The primary deployment surface. A caller imports the grader and runs `#eval gradeFor spec` in any Lean file. Output is the `Repr`-rendered [CodegenReadinessReport](domain.md#codegenreadinessreport) printed to the Lean infoview or stdout.

```lean
import LeanCodeValidator
#eval gradeFor zagrMarketplaceSpec
```

The CLI surface is not a separate interface — `lake env lean --run examples/ZagrMarketplace.lean` drives `#eval` via the standard Lean runner. `CliInterface` collapses into this interface (A3 resolution).

**Constraints:**
- No JSON output in v3 (D8 default: `#eval` only; JSON deferred to v4).
- Output format: Lean `Repr` instance on [CodegenReadinessReport](domain.md#codegenreadinessreport). Human-readable; not machine-parseable.
- Performance SLA: `#eval` must complete within a reasonable bound on the largest in-repo spec (P5 cycle-check is the candidate slow predicate — open question in PROJECT-OVERVIEW).
