---
description: How and when to use the semantic-index MCP tools to query domain concepts and embeddings
---

# Semantic Index Skill

> Source: `internal_tools/semantic_index/` — spec at `domains/spec.yaml`, embeddings in Postgres (`pgvector`).

The semantic index is the agent-facing view of the project's business ontology. It answers **"what concepts exist and what do they mean"** — GitNexus answers **"how does execution flow."** Use them together.

---

## Tools

Registered in `.mcp.json` as `semantic-index`. Three tools:

| Tool | Returns | Cost |
|------|---------|------|
| `list_domains()` | All domains + concept counts | spec-only, free |
| `domain_context(domain)` | Every tagged concept in a domain, grouped by type, with edges | spec-only, free |
| `semantic_query(question, top_k=10)` | Vector-similarity results across all embeddings | needs Gemini + Postgres |

---

## When to Use

### `list_domains()`
- You don't know which domain owns a concept
- Call this **first** before `domain_context` if unsure

### `domain_context(domain)`
- **Before editing** any file under `domains/<domain>/` — loads the domain's concepts, edges, and file locations
- Understanding what a domain contains without grepping
- Checking which operations emit which events/states (edges)

### `semantic_query(question, top_k=10, types=None)`
- Business question where you don't know the domain ("what rule governs contract validation?")
- Keyword search would miss the target (paraphrased, renamed, or conceptually distant)
- Debugging: finding the concept behind an error message by meaning, not by string match

---

## Filtering by type

`semantic_query` accepts an optional `types` list to restrict results to specific taxonomy categories. When the question shape implies a concept category, pass it — you save tokens and cut noise.

| Question shape                                 | Likely `types`             |
|------------------------------------------------|----------------------------|
| "how does X validate / gate / enforce"         | `["rule"]`                 |
| "what is X / what does X contain"              | `["entity", "value-object"]` |
| "how do I create / update / delete X"          | `["operation"]`            |
| "where do we list / fetch / count X"           | `["query"]`                |
| "what flow orchestrates X"                     | `["workflow"]`             |
| "what computes / aggregates X"                 | `["calculation"]`          |
| "what HTTP endpoint / port exposes X"          | `["interface"]`            |

**Two-shot fallback**: when in doubt, query unfiltered first. If the top results are cluttered with the wrong category, re-query with `types=[...]`. Self-correcting — cheaper than guessing wrong.

**Note**: `types` also filters out dictionary terms (which have no type), so the results are code anchors only. Use unfiltered when you want conceptual definitions.

---

## When NOT to Use

- ❌ Finding callers / execution flow → use `gitnexus_query` / `gitnexus_context`
- ❌ Locating a known symbol by name → use `Grep`
- ❌ Reading a specific file → use `Read`
- ❌ Questions about infrastructure plumbing (not tagged `@biz`/`@sys`) → the index won't have it

---

## Pairing with GitNexus

| Question shape | Tool |
|---|---|
| "What concepts exist in X?" | `semantic-index` |
| "What does this function call?" | `gitnexus` |
| "What rule matches this description?" | `semantic-index` (`semantic_query`) |
| "What breaks if I change this function?" | `gitnexus` (`impact`) |

Start with `semantic-index` to locate the concept, then `gitnexus` to trace how it flows.

---

## Prerequisites

- `.env` or `.env.local` at project root with `GEMINI_API_KEY` and `POSTGRES_*` vars (auto-loaded by the server)
- Postgres running with embeddings populated (`python -m internal_tools.semantic_index.application.cli ontology pipeline` regenerates)
