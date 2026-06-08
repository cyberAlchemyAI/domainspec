# Stage Receipt — Named-Product Researcher (Tandem / Symphony / Paperclip)

- agentId a5aa6e143a2d1dc9a · verdict: **pass** · external pass 2026-06-08, disambiguated.

|            | Tandem                                         | Symphony                                       | Paperclip                                               |
| ---------- | ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| What       | Governed agent runtime / authority layer       | Agent-orchestration **spec** + Elixir ref impl | Agent **control plane** / management platform           |
| Repo       | frumu-ai/tandem                                | openai/symphony                                | paperclipai/paperclip                                   |
| License    | open-core; **governance engine BUSL-1.1**      | Apache-2.0                                     | **MIT**                                                 |
| Isolation  | path scoping (not kernel)                      | "Docker or local" per task                     | logical (worktrees); native sandbox = **proposal #248** |
| Gate/block | **Yes** (approval gates, per-step tool policy) | Weak (PR/CI only; `--ask-for-approval never`)  | **Yes** (board approval, execution policies)            |
| Meter      | tool-ledger events                             | no                                             | **Yes** — token/cost w/ **hard-stop auto-pause**        |
| Audit      | streams; signed receipts **planned**           | "proof of work" (CI/PR)                        | immutable audit log, tool-call tracing                  |
| Maturity   | early (107★, v0.5.x)                           | engineering preview ("trusted env only")       | mature-ish (69.6k★)                                     |
| Fit        | **Medium–Strong** (control-plane pattern)      | **Weak** (layer above, not runtime)            | **Medium** (control plane; isolation unshipped)         |

## Key findings

- **None is a hardened code-execution sandbox out of the box** — all three are orchestration/governance layers; real isolation is consistently delegated to **E2B / Daytona / Fly.io Sprites / Cloudflare / Modal** (Firecracker microVMs / containers).
- **Tandem** = closest _architectural_ analogue to "enforcement chokepoint" (runtime owns tools/approvals/audit; model only proposes) — but no hard isolation, attestation unshipped, and the load-bearing governance engine is **BUSL-1.1** (lock-in risk).
- **Paperclip** = best _shipped_ enforcement primitives under a clean **MIT** license (approval gates, durable audit, hard-stop budget metering) — but native isolation is an unmerged proposal.
- **Symphony** = an orchestration **spec**, deliberately "trusted environments only," gate only at PR boundary — a layer _above_ Craft, not Craft's runtime.
- Likely strongest real stack: a Paperclip/Tandem-style control plane **fronting** an E2B/Firecracker microVM sandbox for actual execution.

Confidence: Paperclip/Symphony very high; Tandem high. Roadmap items (Tandem signed receipts, Paperclip microVM) flagged as not-yet-shipped.
