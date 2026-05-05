Goal (incl. success criteria):

- Pesquisar a arquitetura/protocolo de extensões subprocessadas em AGH e criar `.compozy/tasks/ext-architecture/_protocol.md` como especificação formal wire-level.
- Sucesso: o novo arquivo cobre handshake, versioning, capability negotiation, error model, `execute_hook`, health/liveness, shutdown e regras operacionais sem contradizer `_techspec.md`, `_examples.md` e ADRs existentes.

Constraints/Assumptions:

- Seguir `/Users/pedronauck/Dev/projects/agh/AGENTS.md` e `CLAUDE.md`.
- O usuário pediu explicitamente uso de subagentes para pesquisa antes de escrever o arquivo.
- Escopo limitado a documentação em `.compozy/tasks/ext-architecture/`; não alterar runtime Go nesta sessão.
- Não tocar em mudanças não relacionadas no worktree.
- Preferir fatos do codebase/docs locais; usar referências externas primárias apenas para JSON-RPC/MCP onde ajudarem a fixar convenções.

Key decisions:

- `_techspec.md` permanece documento arquitetural; `_protocol.md` será o contrato normativo de transporte/mensagens/semântica.
- O protocolo deve alinhar com o runtime de hooks existente (27 eventos e payloads tipados em `internal/hooks`) para evitar inventar formas incompatíveis de `execute_hook`.
- Reaproveitar padrões de lifecycle do ACP/subprocess atual onde fizer sentido, mas sem copiar ACP literalmente.

State:

- Completo; `_protocol.md` criado, validado contra os docs locais e `make verify` aprovado.

Done:

- Li os ledgers relacionados a hooks/protocol (`hook-dispatch`, `lifecycle-hooks-spec`, `wire-hooks-daemon`, `hookrunner-dispatch`, `mcp-hooks-integration`).
- Li os trechos relevantes de `.compozy/tasks/ext-architecture/_techspec.md` e `_examples.md`.
- Confirmei que não há `AGENTS.md` mais profundo cobrindo `.compozy/tasks/ext-architecture/`.
- Inspecionei `internal/acp/client.go`, `internal/acp/process_tree_{unix,windows}.go`, `internal/hooks/events.go`, `internal/hooks/types.go`, `internal/hooks/payloads.go`, `internal/hooks/pipeline.go`, `internal/hooks/executor_subprocess.go` e `internal/hooks/telemetry.go`.
- Abri pesquisa externa primária em JSON-RPC 2.0 e MCP lifecycle/versioning/ping.
- Estruturei a pesquisa em trilhas paralelas locais porque a delegação automática para subagentes não estava estável neste runtime.
- Confirmei que o worktree já tinha mudanças locais em `.compozy/tasks/ext-architecture/`; mantive a intervenção estritamente aditiva.
- Criei `.compozy/tasks/ext-architecture/_protocol.md`.
- Formalizei no novo spec:
- transporte/stdin/stdout, framing JSON-RPC line-delimited e proibição de batch
- lifecycle de conexão, `initialize`, versioning e capability negotiation
- distinção entre core methods, Host API e capability service methods
- envelope normativo de `execute_hook` e mapeamento dos 27 eventos para payload/patch
- error model (`-32001 capability_denied`, `-32002 rate_limited`, etc.)
- health semantics com `health_check`
- shutdown RPC + escalonamento `shutdown -> SIGTERM -> SIGKILL`
- Registrei explicitamente que nomes iguais nos dois sentidos, como `memory/store`, são desambiguados pela direção do request.
- Fiz checagem final de cobertura dos gaps originais com `rg` e confirmei a existência do novo arquivo.
- Rodei `make verify` com sucesso.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- Follow-up possível fora desta sessão: alinhar `_techspec.md` e `_examples.md` com `_protocol.md` em pontos onde os exemplos ainda misturam Host API e capability service methods.

Working set (files/ids/commands):

- `.compozy/tasks/ext-architecture/_protocol.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_examples.md`
- `.compozy/tasks/ext-architecture/adrs/adr-004.md`
- `internal/acp/client.go`
- `internal/acp/process_tree_unix.go`
- `internal/acp/process_tree_windows.go`
- `internal/hooks/events.go`
- `internal/hooks/types.go`
- `internal/hooks/payloads.go`
- `internal/hooks/pipeline.go`
- `internal/hooks/executor_subprocess.go`
- Web sources: JSON-RPC 2.0 spec (`jsonrpc.org`), MCP lifecycle/versioning/ping (`modelcontextprotocol.io`)
- Commands: `rg`, `sed`, `find`, `test -f`, `make verify`
