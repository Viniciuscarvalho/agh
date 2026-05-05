# Goal (incl. success criteria):

- Implement the accepted plan to make `internal/vault` the canonical authority for durable AGH secrets across providers, bridges, automation, MCP, and runtime secret env bindings.
- Success requires hard-cut public naming (`secret_ref` over ambiguous/env-only fields), no plaintext durable secret persistence outside vault, contract/web/docs co-ship, and final verification with `make verify`.

# Constraints/Assumptions:

- User selected full durable-secret scope and hard-cut API renames.
- Do not move ephemeral claim/approval/OAuth transient codes/PKCE verifiers into vault.
- No destructive git commands without explicit permission.
- Use root AGENTS/CLAUDE rules, internal/web/site CLAUDE rules, and activated skills for Go, tests, schema, contracts, security, and final verification.
- Plan mode accepted plan has been persisted to `.codex/plans/2026-05-01-vault-secret-unification.md`.

# Key decisions:

- `env:NAME` remains operator-managed lookup; `vault:<namespace>/...` is AGH-managed encrypted storage.
- Durable secret public fields use `secret_ref` names.
- Public APIs return metadata/status only; plaintext only crosses internal launch/materialization boundaries.
- Dynamic redaction must be registered for every resolved secret value.

# State:

- Completed; final verification and external review passed.

# Done:

- Accepted plan produced and user requested implementation.
- Read existing provider-vault and ACP exploration from prior plan phase.
- Scanned ledgers and confirmed worktree was initially clean.
- Persisted accepted plan under `.codex/plans/2026-05-01-vault-secret-unification.md`.
- Completed repo-wide sweep for provider, bridge, automation, MCP, hook, extension, sandbox, settings, web, docs, and OpenAPI secret surfaces.
- Started vault core generalization: `env:` validation, `vault:` validation, and service/store validation now share `internal/vault`.
- Started hard-cut public rename from `vault_ref` to `secret_ref` across current source/artifacts; schema/codegen/test cleanup still in progress.
- Bridge secret bindings now use `secret_ref` in core types, schema, and daemon resolver wiring, with vault-backed resolution preferred at boot.
- Provider config/settings/API core removal of `api_key_env` is partially implemented; tests, CLI, workspace clone, web, docs, and generated artifacts still need cleanup.
- Automation webhook secret migration is partially implemented in model/config/store/manager/runtime layers; API/CLI/native tools/extensions/web/docs/tests still need cleanup.
- Stabilized the first backend migration slice after compaction:
  - provider `api_key_env` removal across backend config/settings/API call sites;
  - bridge `secret_ref` validation and daemon resolver tests with the new `vault:<namespace>/...` grammar;
  - automation webhook secret refs/write-only values through API/core, manager, runtime, and globaldb tests.
- Focused backend tests now pass: `go test ./internal/api/core ./internal/automation ./internal/daemon ./internal/store/globaldb ./internal/config ./internal/settings -count=1`.
- Completed the first MCP hard-cut pass:
  - renamed `client_secret_env` to `client_secret_ref` across backend config/settings/API/CLI/MCP auth call sites;
  - added MCP `secret_env` bindings with validation and runtime materialization;
  - vault-backed MCP OAuth access/refresh token persistence through shared `vault_secrets`;
  - focused backend tests now pass: `go test ./internal/config ./internal/mcp ./internal/mcp/auth ./internal/store/globaldb ./internal/cli ./internal/settings ./internal/api/core ./internal/daemon -count=1`.
- Completed hooks/extensions/skills/sandbox secret-env pass:
  - added `secret_env` declarations, validation, resource publication, and runtime materialization for hooks, extension subprocesses, extension MCP resources, skills, and sandbox profiles;
  - daemon/session composition now resolves secret refs through the shared provider vault and registers dynamic redaction at launch/materialization boundaries;
  - focused backend tests now pass: `go test ./internal/vault ./internal/hooks ./internal/config ./internal/session ./internal/extension ./internal/skills ./internal/settings ./internal/api/core ./internal/daemon ./internal/tools/builtin -count=1`.
- Removed the old `globaldb` automation webhook secret helper API and stale `ErrTriggerWebhookSecretNotFound` plumbing; tests now exercise vault-backed `PutSecret`/`ResolveRef` directly and assert the legacy plaintext table is absent.
- Focused store/automation tests now pass: `go test ./internal/automation ./internal/store/globaldb -count=1`.
- Regenerated OpenAPI/web/SDK contracts with `make codegen`; `make codegen-check` passes.
- Updated web provider and automation UI/tests:
  - provider settings no longer use `api_key_env`/`api_key_env_present`;
  - provider editor preserves and edits additional credential slots and can submit write-only vault values per slot;
  - automation trigger form uses `webhook_secret_ref` + write-only `webhook_secret_value`.
- Updated current site docs and active `.compozy/tasks` text artifacts away from `api_key_env`, `client_secret_env`, and `webhook_secret_env`.
- Focused checks now pass:
  - `go test ./internal/vault ./internal/hooks ./internal/config ./internal/session ./internal/extension ./internal/skills ./internal/settings ./internal/api/contract ./internal/api/spec ./internal/api/core ./internal/automation ./internal/daemon ./internal/mcp ./internal/mcp/auth ./internal/store/globaldb ./internal/tools/builtin -count=1`;
  - `make bun-typecheck`;
  - `make bun-test`;
  - `make bun-lint`.
- Full `make verify` passed codegen-check, Bun lint/typecheck/tests, and web build, then failed at Go lint.
- Fixed the Go lint root causes:
  - compacted `HookDecl` below the heavy-copy threshold by changing priority storage to checked `int32` and reordering fields;
  - extracted automation/extension validation helpers for funlen/gocyclo;
  - removed stale unused/unparam paths and long-line/error-punctuation findings.
- `make lint` now passes with 0 issues.
- Full `make verify` regenerated contracts and passed through lint/build phases, then failed during race-enabled `make test` on:
  - CLI sandbox fixtures still using secret-like `API_TOKEN` in literal `env`;
  - e2e agent-def fixtures still using `TOKEN` in MCP literal `env`;
  - extensiontest harness opening stale real `~/.agh/agh.db` instead of an isolated home;
  - network busy-queue overflow audit count regression/flakiness.
- Fixed the failed test roots:
  - CLI/testutil fixtures now use `secret_env` with vault refs for secret-like env keys;
  - `config set` now supports sandbox `secret_env` paths as redacted mutations;
  - extensiontest helper utilities inject an isolated temp `HomePaths` into `observe.New`;
  - network overflow test now feeds ordered inbound envelopes directly to avoid transport-order nondeterminism.
- Focused race tests now pass for `internal/cli`, `internal/testutil/e2e`, `internal/extensiontest`, and `internal/network`.
- Full `make verify` now passes, including codegen-check, Bun lint/typecheck/test, web build, Go fmt/lint/test/build, and boundaries.
- Required `compozy exec --ide claude --model opus --reasoning-effort xhigh` review returned `not-ready`.
- Review blockers/high-priority gaps to fix:
  - workspace clone drops MCP `SecretEnv`, `Auth`, `URL`, and `Transport`;
  - bridge and MCP surfaces lack public write-only secret-value paths for `vault:` refs;
  - bridge env resolver and CLI MCP secret resolver miss dynamic redaction; default env-only bridge resolver should be removed;
  - trigger responses omit `webhook_secret_ref`; workspace hook clone aliases `SecretEnv`;
  - provider secret writes validate only namespace, not provider-specific refs.
- Fixed the first review remediation slice:
  - workspace clone now deep-copies MCP transport/url/auth/secret env, hook secret env, and sandbox secret env;
  - trigger response payloads now include `webhook_secret_ref`;
  - CLI MCP auth and daemon settings MCP auth status register dynamic redaction for resolved client secrets;
  - settings MCP PUT accepts write-only `secret_values` for stdio `secret_env` and OAuth `client_secret_ref`, validates refs against `vault:mcp/<server>/...`, and stores values through the existing vault-backed settings secret store;
  - provider secret writes now require refs under the edited provider's `vault:providers/<provider>/...` prefix;
  - bridge secret bindings now require `vault:bridges/...`, accept write-only `secret_value`, store plaintext through vault, and no longer install the env resolver by default;
  - bridge web/e2e helpers now generate `vault:bridges/<bridge>/<binding>` refs plus write-only `secret_value`.
- Added focused redaction/shape coverage:
  - CLI MCP auth secret resolution now has a diagnostics dynamic-redaction test;
  - MCP sidecar writes now preserve remote `transport`, `url`, and `auth` fields, with regression coverage;
  - bridge and MCP docs now document write-only vault-backed secret values/refs instead of plaintext examples.
- Focused tests pass after review remediation: `go test ./internal/config ./internal/settings -count=1` and `go test ./internal/api/contract ./internal/api/core ./internal/bridges ./internal/daemon ./internal/cli ./internal/workspace ./internal/store/globaldb -count=1`.
- First post-remediation `make verify` run passed Bun lint/typecheck/tests and web build, then failed at Go lint on one 121-character line in `internal/settings/collections.go`; line was wrapped without behavior change.
- Second `make verify` run passed Go lint and reached race Go tests, then failed on `internal/testutil/e2e` because the bridge artifact harness still emitted `env:AGH_TEST_TELEGRAM_TOKEN`; the fixture/server now use `vault:bridges/brg-1/bot_token` plus write-only `secret_value`.
- Focused regression now passes: `go test -race ./internal/testutil/e2e -count=1`.
- Full post-remediation `make verify` now passes, including Bun lint/typecheck/tests, web build, Go lint, race Go tests, build, and boundaries.
- Follow-up Opus review returned `ready-with-nits` with one High clone-aliasing bug and Medium consistency/validation/naming items.
- Addressed the review findings:
  - `internal/extension/manager.go` now deep-copies hook `SecretEnv`, with snapshot isolation coverage;
  - skill resource validation now rejects secret-like MCP literal `env` at resource validation time, with regression coverage;
  - MCP OAuth refs now use `vault:mcp/<server>/oauth/{client-secret,access-token,refresh-token}`;
  - `mcp_auth_tokens` columns are now `access_token_ref` / `refresh_token_ref`.
- Focused checks after review fixes pass: `go test ./internal/extension -run TestManagerCloneExtensionReturnsIsolatedSnapshot -count=1` and `go test ./internal/skills ./internal/store/globaldb ./internal/settings ./internal/config ./internal/daemon -count=1`.
- Full `make verify` passes again after review fixes, with 7313 Go tests and boundaries.
- Final follow-up Opus review returned `Readiness: ready` with no blockers, high, or medium findings.

# Now:

- Ready to report completion.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- Plan: `.codex/plans/2026-05-01-vault-secret-unification.md`
- Ledger: `.codex/ledger/2026-05-01-MEMORY-vault-secret-unification.md`
- Initial commands: `git status --short`, skill reads, `internal/CLAUDE.md`, `web/CLAUDE.md`, `packages/site/CLAUDE.md`
- Touched so far includes vault core, bridges, provider config/settings, automation model/config/store/manager/runtime, MCP config/auth/executor/store, and mechanical `secret_ref` rename across repo surfaces to be reviewed.
- Failed gate evidence: `make verify` failed at `make lint` with gocritic heavy `HookDecl` copies, funlen in CLI/extension manager, gocyclo in automation/extension validation, lll/error punctuation cleanup, staticcheck simplification, and unparam/unused cleanup.
- Latest lint evidence: `make lint` passes with 0 issues after focused package tests.
- External review prompt: `.compozy/tasks/vault-secret-unification/reviews/claude_opus_review_prompt.md`
