# Goal (incl. success criteria):

- Resumir como OpenClaw e OpenFang tratam channel adapters usando a knowledge base local/QMD.
- Sucesso = findings curtos e concretos em português cobrindo: adapter model/registration, session/chat routing, streaming, auth/credentials, queue/concurrency, media/message adaptation e lições para revisar `.compozy/tasks/channel-adapters/_techspec.md`.

# Constraints/Assumptions:

- Pesquisa documental somente leitura sobre produto/spec; sem editar código ou techspec.
- Usar QMD/local KB como fonte primária.
- Busca vetorial do QMD está indisponível neste ambiente (`sqlite-vec` ausente); usar `qmd ls/search/get` e `rg`.

# Key decisions:

- Ler coleções `openclaw` e `openfang` diretamente via `qmd get`.
- Tratar OpenClaw e OpenFang wiki docs como fontes principais; usar docs do próprio AGH apenas para cruzar implicações com o techspec alvo.
- Reportar ausências como “não documentado/encontrado na KB”, não inferir além do que a documentação sustenta.

# State:

- in_progress

# Done:

- Lidos ledgers correlatos: `2026-04-08-MEMORY-ai-harness-research.md`, `2026-04-10-MEMORY-channel-adapters-review.md`, `2026-04-10-MEMORY-harness-doc-research.md`.
- Confirmado `qmd status` com coleções `openclaw`, `openfang`, `agh-compozy`, `agh-docs`.
- Confirmado problema do `qmd query` vetorial (`no such module: vec0`); pesquisa continuou via `qmd search/get`.
- Lidos docs OpenClaw:
  - `qmd://openclaw/wiki/concepts/channel-adapter-matrix.md`
  - `qmd://openclaw/wiki/concepts/sessions-dms-and-memory.md`
  - `qmd://openclaw/wiki/concepts/model-providers-and-authentication.md`
  - `qmd://openclaw/wiki/concepts/extensions-and-native-apps.md`
  - `qmd://openclaw/wiki/concepts/permissions-approvals-and-pairing.md`
  - `qmd://openclaw/wiki/concepts/agent-execution-pipeline.md`
- Lidos docs OpenFang:
  - `qmd://openfang/wiki/concepts/channel-adapter-architecture.md`
  - `qmd://openfang/wiki/concepts/credential-vault-internals.md`
  - `qmd://openfang/wiki/concepts/storage-and-persistence-layer.md`
  - `qmd://openfang/wiki/concepts/security-architecture.md`
  - `qmd://openfang/wiki/concepts/autonomous-agent-runtime.md`
  - `qmd://openfang/raw/articles/deepwiki-openfang-8-3-contributing-channels.md`
- Inspecionado `.compozy/tasks/channel-adapters/_techspec.md` para mapear claims e ADRs.

# Now:

- Consolidar comparação OpenClaw vs OpenFang por eixo.
- Extrair lições objetivas para revisão do techspec de AGH.

# Next:

- Entregar resposta final curta com referências de paths/coleções e notas sobre pontos não documentados.

# Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: OpenFang KB não mostrou política explícita de fila serial por chat; pode existir no código, mas não foi encontrada na documentação consultada.
- UNCONFIRMED: OpenClaw KB não mostrou interface/registro de fila por adapter; a KB documenta queue policy por sessão na pipeline e `enqueue or route directly` no fluxo de canais, mas não detalha implementação de fila no artigo de channels.

# Working set (files/ids/commands):

- `.compozy/tasks/channel-adapters/_techspec.md`
- `qmd://openclaw/wiki/concepts/channel-adapter-matrix.md`
- `qmd://openclaw/wiki/concepts/sessions-dms-and-memory.md`
- `qmd://openclaw/wiki/concepts/extensions-and-native-apps.md`
- `qmd://openclaw/wiki/concepts/permissions-approvals-and-pairing.md`
- `qmd://openclaw/wiki/concepts/agent-execution-pipeline.md`
- `qmd://openfang/wiki/concepts/channel-adapter-architecture.md`
- `qmd://openfang/wiki/concepts/credential-vault-internals.md`
- `qmd://openfang/wiki/concepts/storage-and-persistence-layer.md`
- `qmd://openfang/wiki/concepts/security-architecture.md`
- `qmd://openfang/wiki/concepts/autonomous-agent-runtime.md`
- `qmd://openfang/raw/articles/deepwiki-openfang-8-3-contributing-channels.md`
- Commands: `qmd status`, `qmd ls`, `qmd search`, `qmd get`, `rg`, `sed`, `nl -ba`
