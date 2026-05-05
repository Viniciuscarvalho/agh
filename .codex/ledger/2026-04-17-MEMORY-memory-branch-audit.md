Goal (incl. success criteria):

- Verificar se a branch de melhorias de memory realmente aproxima AGH do padrão dos outros harnesses citado em `docs/ideas/market-pair` e `docs/ideas/extensability/analysis`, ou se o escopo entregue ficou majoritariamente em integração via CLI/endpoints.
- Sucesso = responder com evidências de docs + código + diff/estrutura atual.

Constraints/Assumptions:

- Usar `qmd` para busca documental, conforme pedido do usuário.
- Não alterar código de produto; apenas análise.
- Não usar web para código local.

Key decisions:

- Combinar `qmd` para descoberta com leitura direta de arquivos/doc trechos relevantes.
- Fazer comparação entre intenção declarada nos docs e superfícies implementadas no código.
- Tratar `.codex/plans/2026-04-17-memory-standard-upgrade.md` como definição explícita do escopo real entregue nesta branch.

State:

- Completo.

Done:

- Li os skills `qmd` e `architectural-analysis`.
- Listei ledgers existentes para awareness.
- Confirmei que `qmd` está instalado, mas as coleções locais do repo (`agh-compozy`, `agh-docs`) estão sem arquivos; usei `qmd` nas coleções já indexadas (`ai-memory`, `hermes`, `claude-code`, `goclaw`) e leitura direta para os docs locais.
- Li `docs/ideas/market-pair/gap-analysis.md` e `docs/ideas/extensability/analysis.md`.
- Li o plano persistido `.codex/plans/2026-04-17-memory-standard-upgrade.md`.
- Comparei o diff da branch com `origin/main` e o commit principal `fb69281f`.
- Confirmei no código que a branch adiciona:
  - catálogo derivado SQLite FTS5 (`internal/memory/catalog.go`)
  - busca lexical + reindex + stats (`internal/memory/store.go`, `internal/memory/types.go`)
  - recall limitado pré-prompt (`internal/memory/recall.go`, `internal/session/manager_prompt.go`)
  - superfícies CLI/API/UDS para `search` e `reindex` (`internal/cli/memory.go`, `internal/api/core/memory.go`, rotas HTTP/UDS)
  - observabilidade de operações de memória (`internal/store/globaldb/global_db_observe.go`)
- Quantifiquei o diff por área contra `origin/main`:
  - `internal/memory`: +1749 / -58 em 8 arquivos
  - `internal/api`: +272 / -11 em 8 arquivos
  - `internal/cli`: +390 / -0 em 5 arquivos
  - `internal/session`: +86 / -1 em 4 arquivos
  - `internal/store/globaldb`: +118 / -9 em 3 arquivos
- Confirmei que o plano da branch deixa explicitamente para depois:
  - camadas `session/working`, `durable`, `episodic`
  - vetores / graph backends
  - `team/shared`
- Escrevi `docs/ideas/memory-gaps/README.md`, consolidando:
  - estado atual do AGH
  - gaps para memória agentica de alto nível
  - ordem recomendada de evolução
  - tese central: AGH já consulta memória automaticamente, mas ainda aprende pouco de forma automática

Now:

- Nenhum trabalho ativo.

Next:

- Nenhum.

Open questions (UNCONFIRMED if needed):

- Nenhuma relevante para o veredito.

Working set (files/ids/commands):

- `.agents/skills/qmd/SKILL.md`
- `.agents/skills/architectural-analysis/SKILL.md`
- `.codex/ledger/2026-04-17-MEMORY-memory-branch-audit.md`
- `docs/ideas/market-pair/gap-analysis.md`
- `docs/ideas/extensability/analysis.md`
- `.codex/plans/2026-04-17-memory-standard-upgrade.md`
- `internal/memory/catalog.go`
- `internal/memory/store.go`
- `internal/memory/recall.go`
- `internal/session/manager_prompt.go`
- `internal/cli/memory.go`
- `internal/api/core/memory.go`
- `internal/store/globaldb/global_db_observe.go`
- `git diff --stat origin/main...HEAD -- internal/memory internal/session internal/cli internal/api internal/store`
- `docs/ideas/memory-gaps/README.md`
