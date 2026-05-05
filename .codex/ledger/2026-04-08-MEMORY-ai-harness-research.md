# Goal (incl. success criteria):

- Explorar o vault `~/dev/knowledge`, com foco em `~/dev/knowledge/ai-harness`, para identificar padrões úteis a SDKs/runtime/harness de um protocolo interoperável de rede de agentes.
- Sucesso = entregar síntese em português com recomendações acionáveis para AGH e referências de notas/artigos do vault.

# Constraints/Assumptions:

- Exploração somente leitura sobre código/projeto/vault; não editar arquivos do vault nem do projeto.
- Usar extensivamente `qmd` CLI e `obsidian` CLI.
- Não usar web.

# Key decisions:

- Foco primário no tópico `ai-harness`, com leitura auxiliar apenas de ledgers correlatos sobre agent network.

# State:

- in_progress

# Done:

- Carregadas instruções de `/Users/pedronauck/dev/knowledge/AGENTS.md` e `/Users/pedronauck/dev/knowledge/ai-harness/{AGENTS.md,CLAUDE.md}`.
- Verificada disponibilidade de `qmd` e `obsidian`.
- Lidos ledgers correlatos `agent-network-rfc` e `agora-rfc`.
- Mapeados artigos centrais com `obsidian files/backlinks/links/base:query`; nós mais centrais no tópico: `Model Context Protocol`, `The Agent Harness`, `Memory Systems for Agents`, `Agent Orchestration`, `Context Engineering`.
- Lidos com `qmd get/search` os documentos centrais e outputs comparativos do tópico:
  - `wiki/concepts/{The Agent Harness,Model Context Protocol,Agent Communication Protocols,Agent Orchestration,Memory Systems for Agents,LLMOps and Observability,Context Engineering,Open Source Agent Frameworks}.md`
  - `outputs/{briefings/State of AI Agent Harnesses 2025-2026,queries/2026-04-04 Key Open Questions,queries/2026-04-06 Skill Systems Comparison Across Six Harnesses,queries/2026-04-06 Workspace and Directory Access Across Six Harnesses}.md`
- Confirmado via `qmd` que a busca vetorial local está indisponível (`sqlite-vec` ausente); exploração continuou com `qmd search/get/multi-get` lexical.

# Now:

- Sintetizar padrões e recomendações finais para AGH com foco em SDK ergonomics, separação protocolo/runtime, capability negotiation, orchestration, observability, handoff de contexto/memória e estratégia competitiva.

# Next:

- Entregar resposta final em português com referências acionáveis.

# Open questions (UNCONFIRMED if needed):

- Nenhuma bloqueante.

# Working set (files/ids/commands):

- `.codex/ledger/2026-04-08-MEMORY-ai-harness-research.md`
- `~/dev/knowledge/ai-harness/AGENTS.md`
- `~/dev/knowledge/ai-harness/CLAUDE.md`
- `qmd status`, `qmd ls ai-harness`, `qmd search`, `qmd get`
- `obsidian files`, `obsidian backlinks`, `obsidian links`, `obsidian bases`, `obsidian base:query`
