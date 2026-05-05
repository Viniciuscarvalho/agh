Goal (incl. success criteria):

- Corrigir a implementação de CI/release desta branch de `agh` para ficar coerente com os padrões usados em `~/Dev/compozy/looper`, `~/Dev/compozy/pr-release` e `~/Dev/compozy/compozy`.
- Sucesso: fechar os gaps identificados, sem workarounds, e deixar `make verify` verde.

Constraints/Assumptions:

- Worktree está sujo; não tocar em mudanças alheias.
- Revisão e implementação são somente locais; não usar web para código do projeto.
- Usuário explicitou que não quer teste de regressão para config/workflow.

Key decisions:

- Corrigir a causa raiz nos workflows/configs em vez de adicionar workarounds no pipeline.
- Não adicionar suíte de regressão para config/workflow, por instrução explícita do usuário.

State:

- Concluído no working tree.

Done:

- Li instruções do workspace/projeto relevantes.
- Confirmei worktree sujo com novos arquivos de CI/release em `.github/`, `.goreleaser.yml`, `cliff.toml`, `.release-notes/`, `RELEASE_NOTES.md`.
- Comparei `ci.yml`, `release.yml`, `setup-*`, `.goreleaser.yml` e `cliff.toml` com `looper`, `pr-release` e `compozy`.
- Confirmei que o `pr-release` dry-run sempre valida GoReleaser com `--release-header-tmpl=.goreleaser.release-header.md.tmpl` e `--release-footer-tmpl=.goreleaser.release-footer.md.tmpl`.
- Confirmei que `agh` não possui esses templates, não possui testes de configuração de release, e que `.goreleaser.yml` referencia `README.md` e `LICENSE*` inexistentes no root.
- Confirmei que `ci.yml` não cobre várias mudanças que impactam o web workspace / pipeline (`package.json`, `bun.lock`, `packages/**`, `.github/**`, `.goreleaser.yml`, `cliff.toml`, etc.).
- Confirmei que `.github/versions.yml` não é referenciado por nenhum workflow/script.
- Li `magefile.go` e confirmei que `make verify` executa o web build/test a partir do workspace real (lockfile/root package no root) antes do pipeline Go.
- Apliquei correções de causa raiz:
  - `setup-bun` agora usa `.bun-version`, `bun.lock` na raiz, cache alinhado ao workspace e `bun install --frozen-lockfile` na raiz.
  - `ci.yml` agora observa inputs reais de workspace e release.
  - `release.yml` agora usa templates de release, valida artefatos em vez de criar `RELEASE_NOTES.md` vazio, e remove setup Docker não utilizado.
  - `.goreleaser.yml` deixou de referenciar arquivos inexistentes.
- Removi `.github/versions.yml` para eliminar fonte de verdade falsa.
- Adicionei templates `.goreleaser.release-*.md.tmpl`.
- Removi a suíte `test/release_config_test.go` depois do feedback explícito do usuário contra teste de regressão de config.
- Reproduzi e investiguei a falha anterior de `go build ./cmd/agh` com `web/dist` durante o gate; não houve reprodução isolada após os ajustes.
- Rodei `go test ./internal/testutil/e2e -count=50 -run TestBuildAGHBinaryProducesReusableExecutable`, `go test ./internal/testutil/e2e -count=10`, `go test ./...` e `make verify`; todos passaram.
- Rodei uma revisão externa com subagent e corrigi os findings confirmados:
  - `release.yml` agora usa `startsWith` exato para commits de release.
  - O job de release cria apenas a tag local; não faz `git push` antes do GoReleaser.
  - `.goreleaser.yml` agora define `release.target_commitish: "{{ .Commit }}"` e `replace_existing_artifacts: true` para reruns.
  - `release.yml` agora exige `RELEASE_NOTES.md` não-vazio, e o placeholder vazio foi removido do branch.
- Rodei `make verify` novamente após essas correções; passou por completo.
- Segunda revisão externa do subagent não encontrou bug novo de lógica; só observou que os arquivos de CI/release ainda estão não rastreados no working tree atual, então precisam ser commitados para existir no checkout limpo do GitHub Actions.

Now:

- Nenhum trabalho em andamento.

Next:

- Opcional: preparar commit/PR com os arquivos de CI/release desta branch para que existam no checkout limpo do GitHub Actions.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: se a intenção era reproduzir integralmente o processo dos repositórios de referência ou apenas adaptar o núcleo.
- UNCONFIRMED: se há scripts externos/segredos organizacionais não versionados necessários para o fluxo final.

Working set (files/ids/commands):

- `.github/`
- `.goreleaser.yml`
- `cliff.toml`
- `.release-notes/`
- `.release-notes/.gitkeep`
- `Makefile`
- `package.json`
- `web/package.json`
- `git status --short`
- `sed -n` / `rg --files`
- `go test ./...`
- `make verify`
