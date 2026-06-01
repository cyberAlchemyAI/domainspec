---
tags: [mcp, vault-newspaper, internal-tools, server-patterns]
node_type: findings
is_session: false
layer: architecture, application
nature: reference, technical
status: active
dispatch_status: backfilled-no-prompt-recoverable
lens_order: first
version: 0.1.0
last_updated: 2026-05-25
created_by: victorboscaro@gmail.com
---

# Findings — MCP Server Patterns for `vault_newspaper`

## Objective

Ground the discovery's MCP commitments in concrete evidence: what libraries, file structures, URI shapes, and registration paths are already proven in sibling repos and in the canonical Python MCP SDK.

## Method

Read-only investigation across `/Users/victorboscaro/domainspec/`, `/Users/victorboscaro/house_project/`, `/Users/victorboscaro/maestro-trama/`. Two WebFetch calls to `modelcontextprotocol.io` and `github.com/modelcontextprotocol/python-sdk`. No code written.

## Findings

### F1. Three production MCP servers exist in sibling repos (✓ direct file evidence)

| Server | Path | Tools | Mutation? |
|---|---|---|---|
| `vault-routing` | `house_project/internal_tools/vault_routing/mcp_server.py` | `context_menu(query, k)` | Read-only |
| `semantic-index` | `house_project/internal_tools/semantic_index/application/mcp_server.py` | `list_domains`, `domain_context`, `semantic_query` | Read-only |
| `creative-harnessing` | `maestro-trama/internal_tools/creative_harnessing/mcp_server.py` | `sync_creatives_db_from_csv`, `retrieve_similar_creatives` | Mostly read-only (one sync) |

All three follow the identical invocation pattern: `python -m internal_tools.<subsystem>.mcp_server`. **DomainSpec has zero MCP servers today** — confirms the discovery's "first MCP" framing.

### F2. Canonical library is `mcp` v1.27.0 with `FastMCP` (✓ requirements.txt + WebFetch)

- Import: `from mcp.server.fastmcp import FastMCP`
- Decorators: `@mcp.tool()` for active operations, `@mcp.resource()` for passive data
- Transport: stdio (no network); stdin/stdout JSON-RPC handled by the framework
- Sources: https://github.com/modelcontextprotocol/python-sdk, https://modelcontextprotocol.io

### F3. Registration is `.mcp.json` at repo root (✓ direct file evidence)

Pattern from `house_project/.mcp.json`:

```json
{
  "mcpServers": {
    "vault-routing": {
      "command": "./venv/bin/python",
      "args": ["-m", "internal_tools.vault_routing.mcp_server"]
    }
  }
}
```

Claude Code reads this automatically when present.

### F4. URI shape `newspaper://YYYY-MM-DD` is idiomatic (URL evidence)

MCP spec permits arbitrary `<scheme>://<path>` URIs. Canonical examples in docs: `calendar://events/2024`, `weather://forecast/{city}/{date}`. **The discovery draft's URIs are correct.** Path-style `newspaper/payloads/YYYY-MM-DD` would NOT be a valid URI.

### F5. Resource vs. Tool distinction is load-bearing (⚠ discovery conflates them)

- **Resources** (`@mcp.resource()`) — passive, application-driven retrieval. Right model for `newspaper://YYYY-MM-DD` (static daily payload).
- **Tools** (`@mcp.tool()`) — active, model-driven computation. Right model for `newspaper_articles_by_tag`, `newspaper_search`.

The discovery's §2.4 table groups both under "MCP surface" without naming the distinction. This must be made explicit in v0.2.

### F6. stdio = no auth surface (✓ confirmed)

The discovery's assertion "stdio-only; no HTTP transport, no auth surface, no remote access" is **correct**. The MCP server runs as a subprocess of the client; no network exposure. Vault credentials (if needed) load via `.env` like `semantic_index` does. No additional auth layer required.

### F7. Daily-snapshot fit (⚠ extrapolation, but defensible)

MCP is designed for live data, but nothing in the spec forbids snapshot artifacts. The `newspaper://latest` URI is the natural workaround for date-stale clients. The three existing servers all read static stores; none implements `resources/subscribe`. **No blocker, but the discovery should note that re-generation happens offline (CLI run), not inside the MCP server process.**

## Implications for the discovery

1. Adopt `FastMCP` explicitly; cite version `mcp>=1.27.0`.
2. Distinguish resources (the payloads) from tools (queries over them) in §2.4.
3. Cite the three sibling MCP servers as concrete models, not as analogies.
4. Specify `.mcp.json` as the registration path.
5. Clarify: MCP server is read-only over an already-generated payload store. Generation happens via `vault-newspaper run`, separately.

## Confidence

- F1, F2, F3, F4, F6: ✓ direct evidence (file reads + WebFetch).
- F5: ✓ spec-grounded; ⚠ discovery-side gap.
- F7: ⚠ extrapolated from spec + sibling-repo behavior; not load-bearing.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/vault-newspaper/research/research.md` | `synthesized-by` | This findings file is consolidated by the research synthesis. |
