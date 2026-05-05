# Goal (incl. success criteria):

- Levantar referências locais em `.resources/hermes` para enriquecer as tasks 01-10 da feature harness.
- Sucesso = lista curta, acionável e com caminhos exatos, mapeada por task, priorizando prompt/policies, events, background/reentry, delegation/runtime controls e observability/trace surfaces.

# Constraints/Assumptions:

- Pesquisa somente leitura; não alterar código-fonte do repositório.
- Responder em português e de forma compacta.
- Não usar web.

# Key decisions:

- Priorizar arquivos que mostram seam de implementação real, não apenas documentação narrativa.
- Incluir ao menos uma referência de QA/E2E se houver cobertura forte de checkpoint/resume ou runtime integration.

# State:

- Evidence gathered; ready to synthesize final references.

# Done:

- Lido `.resources/hermes/AGENTS.md` e o techspec/ADRs da harness.
- Inspecionados arquivos centrais de session/session-store, gateway runtime, hooks, process registry, delegation, logs/status e testes de integração.

# Now:

- Redigir a resposta final com 6-12 referências exatas e mapeamento por task.

# Next:

- Opcional: remover este ledger após a entrega se for desejável manter o worktree limpo.

# Open questions (UNCONFIRMED if needed):

- Nenhuma bloqueante.

# Working set (files/ids/commands):

- `.resources/hermes/gateway/session.py`
- `.resources/hermes/gateway/run.py`
- `.resources/hermes/hermes_state.py`
- `.resources/hermes/gateway/hooks.py`
- `.resources/hermes/gateway/builtin_hooks/boot_md.py`
- `.resources/hermes/tools/process_registry.py`
- `.resources/hermes/tools/delegate_tool.py`
- `.resources/hermes/gateway/status.py`
- `.resources/hermes/hermes_cli/logs.py`
- `.resources/hermes/tests/integration/test_checkpoint_resumption.py`
