---
tags: [research, vault-newspaper, mcp, frontmatter, adversarial-review]
node_type: research-synthesis
is_session: false
layer: architecture, application
nature: reference
status: active
backfilled: true
analysis-method: live-during-dispatch
version: 0.1.0
last_updated: 2026-05-25
created_by: victorboscaro@gmail.com
---

# Research Synthesis — Vault Newspaper Discovery

## Objective

Mechanical assembly of three lens findings dispatched to patch the load-bearing weaknesses of `discovery.md` v0.1.0. No new synthesis here — every claim cites a lens.

## Lenses dispatched

| Slug | Goal | Agent kind |
|---|---|---|
| `mcp-server-patterns` | Ground MCP commitments in existing sibling-repo servers + canonical SDK | Explore |
| `vault-frontmatter-coverage` | Verify the claim that vault frontmatter signals can be the Editor's input feature vector | Explore |
| `adversarial-review` | Hostile review of the discovery against project rules and evidence | general-purpose |

## Headline citations

**MCP (cf. `lenses/mcp-server-patterns/findings.md`)**

- Three production MCP servers exist in sibling repos (`vault-routing`, `semantic-index`, `creative-harnessing`) — all read-only, all stdio, all invoked as `python -m internal_tools.<subsystem>.mcp_server`. DomainSpec has zero MCP servers.
- Canonical library: `mcp>=1.27.0` with `FastMCP` high-level API.
- Registration: `.mcp.json` at repo root.
- URI shape `newspaper://YYYY-MM-DD` is idiomatic per spec.
- Resource (`@mcp.resource()`) vs. tool (`@mcp.tool()`) distinction is load-bearing — the v0.1.0 draft conflates them.

**Frontmatter (cf. `lenses/vault-frontmatter-coverage/findings.md`)**

- Sessions: 98% coverage on six of seven target fields.
- 🚨 **Discoveries: 0% coverage on all seven target fields** (n=127).
- `expected_importance` range is 4–10 (no zeros) — mildly inflated floor but reliable signal in the 7–10 band.
- `decisions_made` is 97% true → near-useless as ranking signal.
- `promoted_candidates` is 73% empty → Tier C.
- Tier A signals: `expected_importance`, `importance_rationale`, `contradictions_found`.

**Adversarial (cf. `lenses/adversarial-review/findings.md`)**

- Six must-fix items: cargo-cult borrowing from maestro-trama; "reproducible" mis-wording; §1↔§8 contradiction on orphan directory; `agents-telemetry` scope leak; missing failure-mode section; frontmatter half-true claim.
- OQ-5 (since-last-run) breaks the idempotency story.
- Worth re-deciding: OQ-1 naming, OQ-3 MCP+HTML parallel, OQ-4 convergence deferral, OQ-8 freeze policy, OQ-10 feature SPEC.

## What changes in `discovery.md` v0.2.0

1. Add §"Method" declaring lens fan-out, citing this synthesis.
2. Restate §2.2 maestro-trama borrowing as "inspired by, not adopting"; align or justify provenance tuple divergence.
3. Replace "reproducible" with "auditable" in §2.2.
4. Resolve §1↔§8 contradiction on orphan-dir freeze.
5. Move `newspaper.run.*` event design to a clearly in-scope subsection, OR remove the event commitment from v0.1.
6. Add §"Failure modes" covering LLM unavailable, empty-vault day, snapshot atomicity, cost/budget, PII, prompt-rewrite invalidation.
7. Restate §2.5 with the discoveries-have-zero-signals caveat.
8. Split §2.4 MCP table into resources vs. tools.
9. Fix OQ-5 idempotency bug.
10. Reconsider OQ-1, OQ-3, OQ-8 against the adversarial counter-arguments (record decision either way).

## Method

This synthesis cites the three findings files verbatim by location; it adds no claims of its own. Per `frontmatter.md`, this is a `research-synthesis` node with a hard 500-word body cap.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/vault-newspaper/lenses/mcp-server-patterns/findings.md` | `synthesizes` | MCP findings consolidated here. |
| `vault/discovery/vault-newspaper/lenses/vault-frontmatter-coverage/findings.md` | `synthesizes` | Frontmatter coverage findings consolidated here. |
| `vault/discovery/vault-newspaper/lenses/adversarial-review/findings.md` | `synthesizes` | Adversarial review findings consolidated here. |
| `vault/discovery/vault-newspaper/discovery.md` | `derives` | The v0.2.0 discovery patch derives from this research. |
