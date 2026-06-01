---
name: discovery-meta-backlog
description: Meta-backlog for proposing and tracking discoveries across the vault. Distinct from per-discovery backlogs (which are scoped to one discovery's internal todo list) and from `_backlog.md` (which is scoped to the 2026-05-03 edges-hygiene dispatch).
type: meta-backlog
layer: meta
nature: index
status: active
version: 0.1.0
last_updated: 2026-05-26
---

# Discovery Meta-Backlog

Lista corrente de discoveries: propostas (não iniciadas), em progresso, e recentemente aterrissadas.

**Convenção de uso.**
- **Proposed** — alguém articulou que vale a pena, mas nenhum arquivo foi escrito.
- **In progress** — pasta existe em `vault/discovery/`, pelo menos um arquivo dentro, mas o conjunto ainda não está fechado.
- **Recently landed** — discovery completa nos últimos ~30 dias. Após esse prazo, sai daqui — a fonte canônica é a própria pasta.

Não é um lugar para o conteúdo da discovery em si. É só um índice de intent + status.

Adicionar uma entrada com formato:
```
- [<slug>](<slug>/) — <one-line description>  · proposed | in-progress | landed YYYY-MM-DD · <optional: dispatched-by>
```

---

## Proposed

(adicionar conforme necessário)

## In progress

(adicionar conforme necessário)

## Recently landed

- [anti-bias-vector-composition](anti-bias-vector-composition/) — macro-vetor compartilhado + micro-vetores tensionados; principle/literature/validator-check/examples · landed 2026-05-26 · dispatched-by `theorem-research` skill design session
- [subagents-strategy-refinement](subagents-strategy-refinement/) — umbrella discovery for 4+1 role taxonomy, per-layer mode, schema-conformant per-agent files, DSL, typed exit_reason · landed 2026-05-26 · dispatched-by research skill design session

---

## Não-confundir

- **`_backlog.md`** (este diretório) — scoped ao edges-hygiene dispatch (2026-05-03). Não adicionar discoveries gerais lá.
- **`<discovery>/backlog.md`** (em subpastas) — scoped à própria discovery (ex.: `documents-metadata-enforcement/backlog.md`). Não usar para tracking inter-discovery.
- **`_meta-backlog.md`** (este arquivo) — o índice transversal.

## Relacionado

- Vault discoveries em geral: `/Users/victorboscaro/domainspec/vault/discovery/`
- Constitution layer: `/Users/victorboscaro/domainspec/vault/constitution/`
- Snapshots: `/Users/victorboscaro/domainspec/vault/snapshots/`
