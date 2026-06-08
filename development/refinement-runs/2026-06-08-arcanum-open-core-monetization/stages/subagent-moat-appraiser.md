# Stage Receipt — Moat Appraiser (Distill / ranking)

- Role: Moat Appraiser · agentId ab6cf0efd5cab02df · verdict: **pass**
- Owns: moat x WTP x time-to-replicate ranking + monetization sequence.

## Ranking (composite, higher = more defensible business)

| Asset                                           | Moat | WTP | TTR | Composite | Verdict                        |
| ----------------------------------------------- | :--: | :-: | :-: | :-------: | ------------------------------ |
| CyberAlchemy (ontology axes + promotion DAG)    |  4   |  5  |  4  |  **4.3**  | LEAD MOAT                      |
| Golden Quill / Tilth (sovereign grant vertical) |  4   |  5  |  4  |  **4.3**  | MOAT (proof engine)            |
| Lean machine-checked validator                  |  5   |  3  |  5  |  **4.3**  | MOAT (credibility, not a SKU)  |
| Observability→reflection loop                   |  3   |  4  |  3  |    3.3    | Differentiator                 |
| Spec→test derivation engine                     |  3   |  4  |  2  |    3.0    | **Wedge, not the moat**        |
| Arcanum framework                               |  3   |  2  |  3  |    2.7    | Infra / enabler                |
| Necronomicon                                    |  2   |  2  |  2  |    2.0    | Feature                        |
| Sonar Loop                                      |  2   |  2  |  2  |    2.0    | Commodity-adjacent (docs-only) |
| **Audits + validators**                         |  2   |  2  |  1  |  **1.7**  | **COMMODITY — dead last**      |

## Key calls

- Audits = LLM agent `.agent.md` + ~500 LOC `vault_governance` linter. Most replicable asset in the repo; tooling-seat price, not board price.
- Spec→test "engine" is an **LLM-agent skill** (`domainspec-generate-tests` → `domainspec-test-designer`), not a deterministic compiler — "deterministic" in docs is aspirational. Caps its moat.
- Lean validator: high moat, narrow WTP → **trust collateral, not a SKU**.
- **Owner has the lead and the giveaway exactly backwards.** BSL-1.1 already names "Cyber Alchemy AI" — the owner has _already_ implicitly commercialized the asset (CyberAlchemy/GoldenQuill) they planned to give away.

## Recommended sequence

1. **Lead:** CyberAlchemy paid pilot engagement (Assessment→Design→Pilot→Handoff), proofed by Golden Quill; hold the promotion-DAG + KPI taxonomy as the high-margin paid substrate (lock-in).
2. **Free wedge:** spec→test taxonomy + Arcanum sigils + Necronomicon + audits/validators (drives spec adoption that the paid tier attaches to).
3. **Trust collateral:** publish/demo the Lean validator; don't sell per-seat.
4. **Second paid expansion:** hosted observability loop (depends on wedge adoption first).
