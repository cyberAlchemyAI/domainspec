# Stage Receipt — Compliance Researcher (forcing function / WTP / incumbents)

- agentId a02b12f28e9cd6fa3 · verdict: **pass** · external pass 2026-06-08.

## Verdict: **EMERGING — leaning NO for a standalone paid product.**

## Forcing function

| Framework                                    | Enforced?                                                                                                  | Touches AI-CODE audit?                                                                                                                                                                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EU AI Act Art. 12 logging                    | ENFORCED (law), high-risk AI **systems** only; high-risk obligations 2 Aug 2026 (poss. deferred ~Dec 2027) | **NO** — using AI to write ordinary code is minimal/limited risk                                                                                                                                                                    |
| NIST AI RMF / ISO 42001                      | Voluntary (ISO increasingly a procurement gate)                                                            | No / org-level only                                                                                                                                                                                                                 |
| **SOC 2 / ITGC / SOX AS 2201** (FY≥Dec 2026) | **Contractually enforced** in 2025–26 audits                                                               | **YES — the closest real signal**: auditors now sample AI-generated code changes, require generation→review→approval→deploy records, AI tool inventory, prompt/output logs, SBOM, and **immutable tamper-evident append-only logs** |

## WTP + incumbents

- Gartner: AI-governance platform spend **$492M (2026) → >$1B (2030)**, buyers = regulated industries; Credo AI $30–150k/yr. **BUT this budget governs models in production (MLOps), not the dev workflow** — adjacent, not on-target.
- **Incumbents already ship the governance ledger as a feature:** GitHub AI Controls (agent audit logs, policy states, provenance, SIEM streaming), Jira audit trails, Microsoft's **free** Agent Governance Toolkit. Commoditization is active → supports "feature, not category."

## The one defensible wedge

No regulation names AI-code audit; incumbents commoditize single-vendor logging. The only place evidence supports board-level WTP: **cross-tool, vendor-neutral, cryptographically immutable, auditor-acceptable attestation spanning heterogeneous agents/IDEs/SCMs** — exactly what SOC 2 auditors describe (tamper-evident, testable-in-audit) and what single-vendor GitHub-only logs don't satisfy for mixed shops.

Confidence: regulatory facts high; market/incumbent reads medium-high (some inference flagged). Sources: artificialintelligenceact.eu, NIST, ISO, Baker Tilly, Gartner, GitHub/Microsoft docs.
