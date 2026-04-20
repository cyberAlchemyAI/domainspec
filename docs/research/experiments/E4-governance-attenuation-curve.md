# E4: Governance Attenuation Curve

**Status:** not started
**Paper Claim:** C3 — fidelity decreases with layer count
**Paper Section:** §6.3–6.4 (Channel Capacity, Bounds)
**Priority:** P0 | **Effort:** High

---

**Claim:** Per-rule compliance rate decreases as total governance instruction count increases, bounded by channel capacity.

## Protocol

1. Create 5 instruction-set variants with increasing governance density:
   - **V1 (minimal):** Agent definition only, no governance rules (baseline)
   - **V2 (light):** Agent + 3 core rules (document-first, type-safety, derivation)
   - **V3 (moderate):** Agent + 6 axiom-level rules
   - **V4 (heavy):** Agent + 11 constitution rules + 6 axioms
   - **V5 (overloaded):** V4 + 10 additional procedural instructions (signal emission, formatting, naming conventions, etc.)
2. For each variant, run 10 pipeline sessions on the same feature (`financial-settlement`).
3. For each session, score compliance on every rule present (binary: followed / not followed).
4. Compute per-rule compliance rate = (times followed) / (times applicable).
5. Plot: x-axis = total rule count, y-axis = average per-rule compliance rate.

## Data Collected

| Column                    | Type    | Description                      |
| ------------------------- | ------- | -------------------------------- |
| `variant`                 | V1–V5   | Instruction set                  |
| `rule_count`              | int     | Total rules in instruction set   |
| `session_id`              | string  |                                  |
| `rule_id`                 | string  | Individual rule being measured   |
| `compliant`               | boolean | Was this rule followed?          |
| `evidence`                | string  | How compliance was determined    |
| `session_total_rules`     | int     | Rules applicable in this session |
| `session_compliant_rules` | int     | Rules actually followed          |

## Success Criteria

- Average per-rule compliance for V1 > V2 > V3 > V4 > V5 (monotonic decrease).
- The curve shape matches the Shannon capacity model: gradual decline through V3, then steeper decline in V4–V5.
- Identify the inflection point k\* where adding rules starts hurting more than helping.

## Analysis

- Fit the data to: $C(k) = B \cdot \log_2(1 + S/(N_0 + \alpha k))$ where k = rule count.
- Extract fitted parameters B, S, N₀, α.
- Compare fitted k\* against the theoretical prediction of 6–7 from Miller/Ashby.
