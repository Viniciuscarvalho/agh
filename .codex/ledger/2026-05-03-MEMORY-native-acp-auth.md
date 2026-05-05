# Goal (incl. success criteria):

- Implement accepted native ACP provider authentication and isolation plan, with corrected Pi boundary.
- Success: direct `pi` is `native_cli` and owns `/login` auth; Pi-backed aliases (`openrouter`, `zai`, `moonshot`, `vercel-ai-gateway`, `xai`, `minimax`, `mistral`, `groq`) remain AGH-managed wrappers with required provider keys; API/web/docs reflect auth mode; tests/codegen/verify pass.

# Constraints/Assumptions:

- No destructive git commands.
- Conversation in BR-PT; artifacts/code/docs in English.
- Root config/docs/web/backend contract must co-ship.
- Default native home policy is `operator`; isolated provider home is opt-in.
- Plan accepted and persisted at `.codex/plans/2026-05-03-native-acp-auth-isolation.md`.

# Key decisions:

- Model auth explicitly with `native_cli`, `bound_secret`, and `none`.
- Model env/home isolation with `filtered|isolated` env policy and `operator|isolated` home policy.
- Native providers cannot have required credential slots unless auth mode is explicitly switched to `bound_secret`.
- Follow-up research confirms Pi owns auth via `/login` and `~/.pi/agent/auth.json`; `pi_acp` should not imply `bound_secret`.
- Root cause for Pi is twofold: builtin `pi` has an AGH `ANTHROPIC_API_KEY` slot, and all `pi_acp` sessions currently set `PI_CODING_AGENT_DIR` to a session runtime dir, which hides Pi's native auth store.

# State:

- Correcting prior overgeneralization: Pi-backed aliases must not default to Pi-owned native auth.

# Done:

- Root-cause research completed in prior Plan Mode turn.
- Accepted plan persisted.
- Added explicit provider auth/env/home policy types to backend config.
- Removed built-in API-key credential slots from native ACP providers.
- Started settings API payload/auth-status projection plumbing.
- Added isolated provider env/home runtime hooks.
- Added `agh provider auth status/login` CLI surface with shared isolated-home policy.
- Focused backend tests passed for config/session/settings/api-core/cli auth cases.
- Regenerated OpenAPI and web TypeScript contract types.
- Updated web Settings provider editor/cards/fixtures/tests for auth mode and redacted auth status.
- Updated runtime docs for native CLI auth vs bound secrets, env/home policies, and provider auth commands.
- Added lesson `docs/_memory/lessons/L-015-native-provider-auth-boundary.md`.
- Updated `internal/CLAUDE.md`, `AGENTS.md`, and `CLAUDE.md` with provider auth boundary / memory index changes.
- QA plan/test cases written under `.codex/native-acp-auth/qa/`.
- Verification passed so far: `make codegen-check`, focused Go tests, focused Vitest tests, `make bun-lint`, `make bun-typecheck`, `make bun-test`, `make lint`, `make test`, `make build`.
- Final `make verify` passed.
- CLI behavior evidence captured for native `claude` and bound-secret `openrouter`.
- QA execution report written at `.codex/native-acp-auth/qa/verification-report.md`.
- Research confirmed from Pi docs/source and `pi-acp` README/package that Pi supports terminal/native auth and `pi-acp --terminal-login`.
- Removed built-in credential slots from `pi` and Pi-backed aliases; added built-in Pi terminal login command.
- Changed auth-mode default so only explicit credential slots imply `bound_secret`; `pi_acp` no longer implies secret binding.
- Native Pi sessions no longer get a session-local `PI_CODING_AGENT_DIR`; isolated native Pi uses `$AGH_HOME/providers/<provider>/.pi/agent` for both auth commands and session launch.
- Added ACP preferred model negotiation through `session/set_model` for native Pi-backed sessions.
- Updated focused Go tests, Settings fixture, runtime docs, and native-auth lesson for Pi ownership.
- Focused verification passed: `go test ./internal/config ./internal/providerenv ./internal/session ./internal/acp ./internal/cli ./internal/settings -count=1`.
- Focused web verification passed: `bunx vitest run web/src/systems/settings/adapters/settings-api.test.ts web/src/hooks/routes/use-settings-providers-page.test.tsx web/src/routes/_app/settings/-providers.test.tsx web/src/systems/session/components/session-create-dialog.test.tsx`.
- Final `make verify` passed after removing the obsolete `envVarName` helper.
- User clarified the wrapped providers were intended to mask Pi under the hood and require the wrapped provider key; only direct `pi` should use Pi native authentication by default.
- Corrected Pi-backed built-ins back to required AGH-managed provider-key slots:
  `openrouter`, `zai`, `moonshot`, `vercel-ai-gateway`, `xai`, `minimax`, `mistral`, `groq`.
- Preserved direct `pi` as `native_cli` with `npx -y pi-acp@latest --terminal-login`.
- Updated runtime/session and CLI tests so native Pi uses provider `pi`, while wrapped providers use bound-secret runtime materialization.
- Updated Settings fixture and runtime docs to show wrapped providers as `bound_secret`.
- Focused verification passed: `go test ./internal/config ./internal/session ./internal/cli ./internal/acp -count=1`.
- Focused web verification passed: `bunx vitest run web/src/systems/settings/adapters/settings-api.test.ts web/src/hooks/routes/use-settings-providers-page.test.tsx web/src/routes/_app/settings/-providers.test.tsx web/src/systems/session/components/session-create-dialog.test.tsx`.
- Test convention helper passed for `internal/session/provider_runtime_test.go` and `internal/cli/provider_test.go`; helper still reports pre-existing broad-file violations in `internal/config/provider_test.go` and `internal/acp/client_test.go`.
- Full verification passed: `make verify` ended with `OK: all package boundaries respected`.
- Non-blocking warnings during `make verify`: Vite chunk-size warning and macOS linker `-bind_at_load is deprecated`.

# Now:

- Ready to report final corrected boundary and verification.

# Next:

- None unless user asks for follow-up.

# Open questions (UNCONFIRMED if needed):

- None. User clarified Pi-backed aliases should default to AGH-managed key injection; direct `pi` should default to Pi-owned native auth.

# Working set (files/ids/commands):

- `.codex/plans/2026-05-03-native-acp-auth-isolation.md`
- `.codex/ledger/2026-05-03-MEMORY-native-acp-auth.md`
- Expected: `internal/config`, `internal/session`, `internal/settings`, `internal/api/contract`, `internal/api/core`, `internal/cli`, `internal/providerenv`, `web/src`, `packages/site/content/runtime`, `docs/_memory`, `config.toml`
- Research targets: `.resources/pi`, official Pi docs, `pi-acp` external adapter docs.
