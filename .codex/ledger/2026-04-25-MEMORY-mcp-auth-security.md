Goal (incl. success criteria):

- Implement Hermes Task 05: MCP OAuth 2.1 + PKCE auth subsystem, durable token storage, redacted config/API/CLI/log output, `agh mcp auth login|status|logout`, skill/managed-extension symlink escape hardening, downstream web/site impact assessment, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow required skills: `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Follow repo task-domain skills for Go/test/security hardening: `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, and security review guidance where relevant.
- Never run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- Never log or expose access tokens, refresh tokens, client secrets, OAuth authorization codes, or generated PKCE verifiers.
- Token state must live outside plain config overlays and have explicit permission/redaction tests.
- Do not follow symlinks outside approved skill or managed extension roots.
- Automatic commit is enabled only after clean verification, self-review, memory/tracking updates, and scoped staging.

Key decisions:

- Use Task 01 `internal/store.RunMigrations` for any durable schema wiring and reuse shared retry helpers where token refresh needs cancellation-aware retry behavior.
- ADR-003 requires a real auth subsystem under `internal/mcp/auth`, not static token config.
- Keep token-bearing APIs narrow; public config/settings/CLI/status views expose redacted status only.

State:

- Task 05 implementation is complete and committed locally as `156b8e8b feat: add mcp oauth auth security`. Tracking and memory files remain untracked/unstaged by repository policy.

Done:

- Read workflow memory files for Hermes shared memory and Task 05.
- Read repository guidance (`AGENTS.md`, `CLAUDE.md`) and required skill docs.
- Read Hermes `_techspec.md`, `_tasks.md`, Task 05, ADR-001, ADR-003, Task 01 file/memory, and tools/security analysis.
- Scanned `.codex/ledger/` and read relevant Hermes and MCP/skills ledgers for cross-agent awareness.
- Added typed MCP remote transport/auth config and validation for `stdio`, `http`, `sse`, and OAuth 2.1 PKCE metadata/client settings.
- Added `internal/mcp/auth` with metadata discovery, PKCE state, authorization-code exchange, refresh, status, logout/revoke, and redacted status output.
- Added durable global DB `mcp_auth_tokens` migration/store methods plus permission enforcement tests for token persistence.
- Wired redacted MCP auth/status fields through settings/API contracts, daemon runtime status, OpenAPI, and generated web types.
- Added `agh mcp auth login|status|logout` CLI command set with loopback and manual-code login paths and redacted output tests.
- Hardened skill sidecars, skill files, skill directory hashing, and managed extension runtime dependency copying against symlink escapes outside approved roots.
- Ran focused backend tests during implementation and regenerated API/web contracts with `make codegen`.
- First `make verify` failed in web typecheck because existing settings MCP fixtures and the stdio-only editor did not account for required `transport` in generated settings entries.
- Updated web settings MCP fixtures/tests/route hook to carry `transport`, keep current editor writes explicitly `stdio`, show remote URLs as endpoints, and prevent remote entries from being edited through the stdio-only dialog.
- `bun run --cwd web typecheck:raw` passed after the web follow-up.
- Impacted web tests passed: `bun run --cwd web test:raw src/hooks/routes/use-settings-mcp-servers-page.test.tsx src/routes/_app/settings/-mcp-servers.test.tsx src/lib/settings-api-contract.test.ts src/systems/agent/types.test.ts`.
- Second `make verify` reached Go lint and failed on MCP CLI errcheck/noctx/lll/hugeParam plus one skills cyclomatic/unparam issue.
- Fixed CLI cleanup/shutdown error propagation, context-aware loopback listeners, pointer config parameters, line lengths, and split skill scan candidate handling.
- Targeted `go test ./internal/cli ./internal/skills` passed; `make lint` passed with `0 issues.`.
- Third `make verify` reached Go lint and failed on one remaining `goconst` issue in CLI boolean string rendering.
- Replaced manual boolean rendering with `strconv.FormatBool`; `go test ./internal/cli` passed and `make lint` passed again with `0 issues.`.
- Added daemon-level MCP auth status reopen coverage to verify durable status survives global DB reopen.
- Final targeted daemon test passed: `go test ./internal/daemon -run TestSettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen`.
- Final `make verify` passed: web format/type/test/build passed, Go lint reported `0 issues`, Go tests reported `DONE 5810 tests`, and package boundaries passed.
- Updated `.compozy/tasks/hermes/memory/task_05.md`, shared workflow memory, `.compozy/tasks/hermes/task_05.md`, and `.compozy/tasks/hermes/_tasks.md`.
- Self-review tightened explicit OAuth loopback redirects to localhost/loopback hosts and rewrites `:0` URLs to the bound port.
- Targeted CLI/daemon tests passed after loopback hardening: `go test ./internal/cli ./internal/daemon -run 'Test(ListenForMCPAuthCallbackRequiresLoopbackRedirect|SettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen)'`.
- Final post-hardening `make verify` passed: Go tests reported `DONE 5811 tests`, Go lint reported `0 issues`, and package boundaries passed.
- Created scoped local commit `156b8e8b feat: add mcp oauth auth security`.

Now:

- Final handoff to user.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.compozy/tasks/hermes/task_05.md`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/adrs/adr-001-hermes-hardening-tracks.md`
- `.compozy/tasks/hermes/adrs/adr-003-mcp-oauth-auth-subsystem.md`
- `.compozy/tasks/hermes/memory/MEMORY.md`
- `.compozy/tasks/hermes/memory/task_05.md`
- `.codex/ledger/2026-04-25-MEMORY-mcp-auth-security.md`
- `internal/config/provider.go`
- `internal/config/mcp_resource.go`
- `internal/config/mcpjson.go`
- `internal/config/redaction.go`
- `internal/mcp/auth/*`
- `internal/store/globaldb/global_db.go`
- `internal/store/globaldb/global_db_mcp_auth.go`
- `internal/settings/*`
- `internal/api/contract/settings.go`
- `internal/api/core/*`
- `internal/daemon/*`
- `internal/cli/mcp_auth.go`
- `internal/skills/*`
- `internal/extension/install_managed.go`
- `openapi/agh.json`
- `web/src/generated/agh-openapi.d.ts`
- `web/src/hooks/routes/use-settings-mcp-servers-page.ts`
- `web/src/routes/_app/settings/mcp-servers.tsx`
- `web/src/systems/settings/mocks/fixtures.ts`
