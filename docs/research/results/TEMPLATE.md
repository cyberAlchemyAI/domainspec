# Experiment Results Template

Copy this file as `EX-results.md` (e.g., `E1-results.md`) when an experiment completes.

Analysis follows the 10-step empirical pipeline from Wohlin et al. (2012):
Integrity → Descriptive Stats → Hypothesis Testing → Subgroups → Gap Taxonomy → Sensitivity → Triangulation → Validity Threats → Claim Adjudication → Synthesis.

---

## EX: [Experiment Title]

**Status:** not-started | in-progress | completed
**Date range:** YYYY-MM-DD — YYYY-MM-DD
**Operator:** [name]
**DomainSpec version:** [version]

---

### Step 1: Data Integrity

- Location: `data/EX-raw.jsonl`
- Rows: actual / expected (%)
- Schema violations: N
- Integrity: sha256 of raw file
- Protocol deviations: None / [list deviations]
- Gate: PASS / BLOCKED

### Step 2: Descriptive Statistics

| Metric | Value |
| ------ | ----- |
| ...    | ...   |

_Include per-subgroup tables, frequency distributions, and coverage rates as applicable._

### Step 3: Hypothesis Testing (Success Criteria)

| Criterion | Target | Observed | 95% CI | Effect Size | Status |
|-----------|--------|----------|--------|-------------|--------|
| SC-1      | ...    | ...      | ...    | ...         | ✅/❌  |

### Step 4: Subgroup Analysis

_Per-subgroup metrics, cross-group variance, Simpson's paradox check._

| Subgroup | Metric | Value | Passes Criterion? |
|----------|--------|-------|-------------------|

### Step 5: Gap Taxonomy

| Category | Pattern | Frequency | Severity | Remediation |
|----------|---------|-----------|----------|-------------|

### Step 6: Sensitivity Analysis

| Perturbation | Original Result | Perturbed Result | Conclusion Stable? |
|-------------|-----------------|------------------|-------------------|

### Step 7: Triangulation

| Experiment | Finding | Relation | Convergence |
|-----------|---------|----------|-------------|

### Step 8: Validity Threats

**Internal:** ...
**External:** ...
**Construct:** ...
**Conclusion:** ...

### Step 9: Claim Adjudication

| Claim | Evidence Strength | Status | Revision Needed? |
|-------|------------------|--------|-----------------|
| CX    | strong / moderate / weak / contradicted | supported / partial / insufficient / contradicted | yes / no |

### Step 10: Synthesis

- Paper action: [none | revise §N | add data to §N]
- Session learnings: [what improved the pipeline]

---

## Conclusions

1. ...

## Impact on Paper Claims

- Claim CX: [strengthened / weakened / unchanged]
- Recommended paper revision: [description]
