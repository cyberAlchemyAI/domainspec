# Stage Receipt — Market Adversary (Interrogation / adversarial + bounded research)

- Role: Market Adversary · agentId a9eb869c29b66fac2 · verdict: **pass** (research confirmed)
- Owns: adversarial test of both theses + external comparables.

## Comparables — do they sell the validators themselves?

| Company            | Validators free?          | What they actually sell                                             |
| ------------------ | ------------------------- | ------------------------------------------------------------------- |
| SonarQube          | Yes (Community)           | Scale (LOC), branch/PR governance, security engine, reporting       |
| Semgrep            | Yes (2,800+ rules)        | Engine quality (cross-file Pro), platform; premium rules as a rider |
| OPA / Styra        | Yes (engine free)         | Control plane — **Styra DAS being sunset Aug 2025**                 |
| dbt Labs           | Gives away the **engine** | Orchestration, semantic layer, governance, collaboration            |
| Snyk               | Freemium scanning         | Proprietary vuln DB + scale + auto-fix                              |
| Great Expectations | Yes (Expectations free)   | Observability, collaboration, managed scale                         |
| HashiCorp Sentinel | Partial gate              | Platform/ecosystem lock-in (free OPA substitute)                    |
| Chef InSpec        | Yes (community profiles)  | **Certified CIS/STIG content + currency SLA**                       |

**6 of 8 keep validators free** and sell scale / governance / proprietary data / observability / control plane on top. The 2 that sell rule content sell _certification + currency_, not the checker.

## Conditions where selling validators/audits works

Only when: (i) certified/regulated content with an update SLA (Chef), (ii) genuinely proprietary research/data asset (Semgrep Pro, Snyk DB), (iii) mandatory formal-proof gate in safety-critical verticals (AdaCore SPARK, TrustInSoft) — and (ii)/(iii) are **services-led, not SaaS**. Even Vanta/Drata don't sell the audit; they sell the prep platform + introduce independent auditors.

## Verdicts

- **Thesis A (sell validators+audits): NON-VIABLE as primary line.** Open spec invites substitute validators; open-core inversion (gives away the hard part, sells the cloneable part); weak value-metric; "sell audits" = capped-margin services / can't self-attest; paywalling the wedge kills the adoption funnel.
- **Selling audits/attestation specifically: CONDITIONALLY-VIABLE** only as regulated services/qualification — and that surface is better captured by Golden Quill + Lean attestation.
- **Thesis B (validators free, sell engine+governance+attestation+observability+vertical): DIRECTIONALLY CORRECT** (dbt/GX pattern), conditional on two hard requirements:
  - **R1:** prove the spec→test engine is formally deterministic, **not an LLM wrapper** — else it's as commoditized as the validators (LLM test-gen moat is eroding).
  - **R2:** productize governance to escape the consulting trap (Styra-DAS-sunset warning).

Sources: sonarsource, semgrep, styra, getdbt, snyk, greatexpectations, hashicorp, chef, vanta, trust-in-soft, adacore, arxiv 2601.09695, getmonetizely.
