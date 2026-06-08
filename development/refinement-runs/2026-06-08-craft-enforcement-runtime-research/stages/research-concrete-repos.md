# Stage Receipt — Concrete-Repo Researcher (sandcastle / codex-sandbox / Jenkins)

- agentId af5b88a498321708e · verdict: **pass** · external pass 2026-06-08, repos read at source.

| Option                    | Maturity                                       | Isolation                                             | Gate/Block                                                   | Metering                                            | Audit                                                     | License           | Ledger effort | Fit                                   |
| ------------------------- | ---------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------- | ----------------- | ------------- | ------------------------------------- |
| **mattpocock/sandcastle** | Mature: 5.8k★, v0.7.0, active                  | Docker/Podman + Firecracker microVM (via Vercel)      | **None native** (hooks + branch-before-merge)                | token + iteration counts                            | file logs, stream callback, session JSONL; no attestation | MIT               | M             | **Strong** (execution engine)         |
| **Z7Lab/codex-sandbox**   | Very early: 2★, 6 commits, 1wk old, no release | Docker only                                           | None (delegates to Codex CLI approvals)                      | none                                                | JSONL stdout + status file                                | MIT               | M–L           | **Weak** (reference pattern only)     |
| **Jenkins → sandcastle**  | Jenkins very mature; combo = in-house          | sandcastle sandbox + Jenkins agent boundary (2 tiers) | **Yes** — `input` step approval, RBAC, script approval, HITL | **Yes** — native build counting + sandcastle tokens | **Yes** — pipeline audit trail w/ approver identity       | Jenkins MIT-style | M             | **Strong (highest control fidelity)** |

## Key findings

- **sandcastle is the right execution engine** — real container/microVM isolation, mature, MIT, well-typed `run()` with hooks + `branchStrategy:"branch"` (commits land off-head so a gate runs before merge). But **advisory-incapable alone**: no native approve/block.
- **codex-sandbox too immature** (1 week, 6 commits, single contributor, Codex-CLI-specific; README's "production-oriented" claim contradicted by metadata). Reference only.
- **Jenkins+sandcastle is the strongest enforcement shape**: Jenkins natively supplies the exact primitives sandcastle lacks — pause-and-approve `input` step (the literal chokepoint), submitter allow-lists + recorded approver, native run counting, approval audit trail — while sandcastle supplies real sandboxed execution. Cost = Jenkins ops heaviness (plugins, hardening, agent fleet).
- Ledger fit: Craft triggers a Jenkins job via REST, the `input` step is the enforcement gate (ledger/human approves before merge-to-head), sandcastle runs inside the stage, token/iteration/commit data flows back to the ledger.

Sources: github.com/mattpocock/sandcastle, github.com/Z7Lab/codex-sandbox, jenkins.io pipeline input-step / script-approval docs.
