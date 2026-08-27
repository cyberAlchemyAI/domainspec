---
tags: [client-registration, domainspec, deterministic-tests, implementation-audit]
node_type: audit
is_session: true
layer: application
nature: procedural, technical
status: draft
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-08-26
---

- [DECISION] Executar primeiro a derivação determinística e os audits obrigatórios; não inferir aceitação das versões candidatas a partir de "faça isso".
- [INSIGHT] A correção anterior usou uma other-lane manual e não produziu TEST-SPEC.engine.md, ALIGNMENT-REPORT.md ou LAYERING-ALIGNMENT-REPORT.md.
- [INSIGHT] GitNexus MCP não estava disponível, mas o CLI foi inicializado; `featureNameOf` teve impacto LOW antes da edição e `detect-changes` classificou o resultado como MEDIUM por alcançar um fluxo.
- [DECISION] Corrigir a resolução de nome de feature no Windows com `node:path.basename`; a derivação por caminho absoluto passou depois da correção.
- [INSIGHT] A derivação determinística produziu 198 obrigações e IDs estáveis: 128 `derivable-needs-harness`, 70 `needs-formal`, 0 `derivable-pure`; `check` retornou `FRESH`, sem IDs novos ou pendentes.
- [BLOCKER] O gate continua `planning_only: true` e `mutation_ready: false`; DomainSpec 0.2.2, Design 0.1.2 e Plan 0.2.2 seguem candidatos não aceitos, e as 70 regras sem `Formal` impedem alegar derivação completa.
- [INSIGHT] Os 45 testes unitários puros do slice passaram via `unittest`; o runner Django não iniciou porque o runtime tem Django 5.0.4, abaixo do requisito `>=5.2` do projeto.
