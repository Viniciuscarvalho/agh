Goal (incl. success criteria):

- Implement `.codex/plans/2026-05-01-new-drivers.md`: add requested ACP built-in drivers, switch built-in npm/npx driver commands to latest, refresh confirmed model defaults, update web/site surfaces, run Claude review through `compozy exec`, verify with real tests and `make verify` if feasible.

Constraints/Assumptions:

- Do not run destructive git commands.
- Worktree is dirty before this session; do not revert unrelated edits.
- Conversation in BR-PT; repo artifacts in English.
- `kimi-cli` remains separate; existing `kimi -> moonshot` behavior is preserved.
- Direct ACP CLIs with provider-managed model selection may have empty `default_model`; Pi-backed providers still require a model.

Key decisions:

- Use `@latest` for npm/npx driver packages and `pi-acp@latest`.
- Do not invent model IDs for provider-managed CLIs.
- Research refresh adjusted concrete defaults to `claude-sonnet-4-6`, `claude-opus-4-7`, `gpt-5.4`, `gemini-3.1-pro-preview`, and `qwen3.6-plus`.
- Junie, Kimi CLI, and Qoder keep empty `default_model` because no concrete runtime model ID was confirmed from primary driver docs.
- No OpenAPI/schema migration expected unless implementation exposes a contract-shape change.

State:

- Implementation complete; final audit passed.

Done:

- Read accepted plan and relevant skills/instructions.
- Confirmed plan file exists at `.codex/plans/2026-05-01-new-drivers.md`.
- Patched backend provider registry with new ACP providers, `@latest` commands, refreshed direct defaults, and preserved `kimi -> moonshot`.
- Patched install/bootstrap model handling so provider-managed direct ACP providers can omit `default_model` while Pi-backed providers still require one.
- Updated backend tests for registry, aliases, latest package guard, install/bootstrap optional models, and provider runtime defaults.
- Verified targeted backend packages with `go test ./internal/config ./internal/cli ./internal/settings ./internal/api/core ./internal/session -count=1`.
- Updated web provider/agent icon maps, settings/workspace/network/session fixtures, E2E provider seed fixtures, and related tests to use new provider IDs/latest defaults.
- Updated site provider docs, config/env docs, landing supported-agent strip, generated `agh install` CLI reference, and docs/tests for the new providers.
- Verified targeted Vitest files, `make bun-lint`, `make bun-typecheck`, `make bun-test`, `make web-build`, and `make site-build` before the final research model refresh.
- Ran Claude review through `compozy exec`; remediating stale landing count copy, unverified model defaults, and provider docs table gaps.
- Fixed Claude review findings: landing copy/tests now report 18 ACP drivers, provider docs choosing table includes pre-existing built-ins, Gemini uses official `gemini-3.1-pro-preview`, and Junie/Kimi CLI/Qoder defaults are provider-managed.
- Focused tests passed after cleanup: `go test ./internal/config ./internal/cli ./internal/session -count=1`; targeted Vitest provider/logo/landing tests; `make bun-lint`.
- First `make verify` failed in `internal/api/httpapi TestGetWorkspaceHandlerReturnsDetail` because the expected provider list was stale; fixed the test list and verified `go test ./internal/api/httpapi -count=1`.
- Rechecked Gemini official docs and restored `gemini-3.1-pro-preview`; focused `go test ./internal/config -count=1` and `make bun-lint` passed after that correction.
- Spawned read-only explorer subagents for backend and web/site requirement audits.
- Fixed subagent audit findings: non-interactive install canonicalizes aliases before default lookup, `ResolveAgent` rejects Pi-backed providers without a resolved model, `config-toml` provider table includes pre-existing ACP built-ins, and web settings/logo tests cover newly added providers.
- Final `make verify` passed: Bun lint/typecheck/test, web build, Go lint/test/build, and boundaries. Output ended with `DONE 7302 tests in 71.306s` and `OK: all package boundaries respected`.
- Final stale-string audit passed for old driver pins/models and stale 8-ACP copy; `git diff --check` passed.
- Follow-up correction applied OpenAI defaults to `gpt-5.4` (`codex`) and `openai/gpt-5.4` (`openrouter`) across backend, web fixtures, docs, tests, and plan.
- Focused checks passed for the correction: `go test ./internal/config ./internal/cli ./internal/session ./internal/api/httpapi -count=1`, targeted Vitest provider/session/network/runtime-seed tests, `make cli-docs`, `make bun-lint`, `git diff --check`, and stale `gpt-5.2-codex` scan.
- Final correction `make verify` passed: output ended with `DONE 7302 tests in 74.350s` and `OK: all package boundaries respected`.

Now:

- Summarize `gpt-5.4` correction and verification.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/plans/2026-05-01-new-drivers.md`
- `internal/config/provider.go`
- `internal/config/provider_test.go`
- `internal/cli/install.go`
- `internal/config/bootstrap.go`
- `web/`
- `packages/site/`
