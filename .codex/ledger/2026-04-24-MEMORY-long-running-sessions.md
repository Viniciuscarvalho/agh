# Goal (incl. success criteria):

- Implementar suporte robusto a sessoes/tarefas long-running na AGH usando Hermes como referencia.
- Sucesso = activity duravel, progresso periodico, timeout por inatividade, cancelamento correto, visibilidade API/SSE/bridges/task runtime, testes focados e `make verify` limpo.

# Constraints/Assumptions:

- Nunca usar subagents para implementar; apenas analise.
- Nao usar comandos git destrutivos (`restore`, `checkout`, `reset`, `clean`, `rm`) sem permissao explicita.
- Plano aceito persistido em `.codex/plans/long-running-sessions.md`.
- Corrigir causa raiz; nao usar sleeps ou workarounds.
- Testes devem descobrir bugs; se revelarem comportamento incorreto, corrigir producao.

# Key decisions:

- Usar `SessionLivenessMeta` como ponto de persistencia para activity, estendido com `SessionActivityMeta`.
- Heartbeats curtos atualizam metadata; apenas progress/warning/timeout viram eventos persistidos.
- Timeout sera por inatividade, nao por duracao total.
- Eventos novos serao `runtime_progress` e `runtime_warning`.

# State:

- Implementacao backend e follow-up UI/docs concluidos.
- `make verify` passou completo apos corrigir flake de `internal/daemon` relaunch helper.

# Done:

- Lido plano aceito e referencias de skills.
- Scaneados ledgers existentes relevantes.
- Persistido plano aceito.
- Criado ledger desta sessao.
- Adicionado `SessionActivityMeta` ligado a `SessionLivenessMeta`, persistido em meta/global DB (`activity_json`) e exposto em API payloads.
- Adicionada config `[session.supervision]` e wiring daemon -> session manager.
- Corrigida reconciliacao para preservar `Liveness`.
- Adicionados eventos ACP `runtime_progress`/`runtime_warning`, payload `RuntimeActivity`, reporter ACP e supervisor inicial no fluxo de prompt.
- Ajustado recovery de task/session para preferir `activity.last_activity_at` quando existir.
- Adicionado helper E2E observe-until para prompt/session SSE e convertido E2E blocked cancel para validar `runtime_progress`.
- Exposto activity tambem em `/observe/health`.
- Corrigido seed do harness para persistir `[session]`, garantindo que mutacoes de supervision cheguem ao daemon real.
- Regenerados `openapi/agh.json`, `sdk/typescript/src/generated/contracts.ts` e `web/src/generated/agh-openapi.d.ts`.
- Verificado: testes focados, integracao daemon/acpmock/task recovery e `make verify` passaram.
- Follow-up UI/docs iniciado apos aprovacao "continue".
- Adicionado renderer web para `runtime_progress`/`runtime_warning` como notice separado do texto do agente.
- Adicionado resumo compacto de activity no header da sessao e polling do detalhe para manter activity visivel.
- Atualizadas docs de `config.toml`, lifecycle, event streaming e `agh observe health` para supervision/activity.
- Corrigido helper de relaunch para usar `ExitDrainWait` dedicado ao classificar saida do processo apos timeout de readiness, sem depender do intervalo de polling.

# Now:

- Pronto para resumo final.

# Next:

- Nenhum passo pendente.

# Open questions (UNCONFIRMED if needed):

- Nenhuma bloqueante.

# Working set (files/ids/commands):

- `.codex/plans/long-running-sessions.md`
- `.codex/ledger/2026-04-24-MEMORY-long-running-sessions.md`
- `internal/session/{manager.go,manager_prompt.go,prompt_activity.go,session.go,liveness.go,stop_cause.go,stop_reason.go}`
- `internal/acp/{types.go,client.go}`
- `internal/store/{session_liveness.go,globaldb/*}`
- `internal/api/{contract,core,httpapi}`
- `internal/transcript/{transcript.go,ui_messages.go}`
- `internal/daemon/{daemon.go,boot.go,task_runtime.go}`
- `internal/testutil/e2e/{runtime_harness.go,mock_agents.go,config_seed.go}`
- `openapi/agh.json`
- `sdk/typescript/src/generated/contracts.ts`
- `web/src/generated/agh-openapi.d.ts`
