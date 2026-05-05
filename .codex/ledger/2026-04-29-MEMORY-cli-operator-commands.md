Goal (incl. success criteria):

- Implement Task 12 "CLI Operator Commands" from `.compozy/tasks/tools-registry/task_12.md`.
- Success: `agh tool list/search/info/invoke` and `agh toolsets list/info` operate through Task 11 UDS/HTTP contracts; JSON/text output is structured and redacted; invoke validates JSON file/stdin before requests; deterministic structured errors cover denied/unavailable/conflict/auth/approval/schema failures; tests and docs-drift guards are added; `make verify` passes before tracking/commit.

Constraints/Assumptions:

- Target repo is `/Users/pedronauck/Dev/compozy/agh`.
- Workflow memory required: shared `MEMORY.md` and task `task_12.md` under `.compozy/tasks/tools-registry/memory/`.
- Existing `agh mcp auth` remains the only MCP credential management path.
- Do not print secrets, raw hosted MCP bind nonces, approval tokens, OAuth material, or unredacted sensitive inputs.
- No destructive git commands without explicit user permission.
- Auto-commit is enabled, but only after clean verification, self-review, memory/tracking updates, and post-commit verification.

Key decisions:

- Use `cy-execute-task` as the controlling workflow because the task already has PRD/TechSpec/ADR context.
- Treat Task 11 contracts as source of truth for CLI request/response shapes; CLI must stay a thin client, not a registry implementation.

State:

- Complete. Implementation committed locally as `9a19515e feat: add tool registry cli commands`; post-commit verification passed. Tracking/memory files remain unstaged by rule.

Done:

- Loaded required skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, plus AGH-specific `agh-code-guidelines` and `agh-test-conventions`.
- Read root/internal AGENTS/CLAUDE guidance, workflow memory, Task 12, `_tasks.md`, `_techspec.md`, ADR-005, ADR-006, ADR-007, and CLI docs rules.
- Confirmed current `agh tool` is hidden and only hosts internal `tool mcp`; `agh tool list` falls through to help and `agh toolsets` is unknown.
- Confirmed Task 11 DTOs/routes already exist and expose `/api/tools`, `/api/tools/search`, `/api/tools/{id}`, `/api/tools/{id}/invoke`, `/api/toolsets`, and `/api/toolsets/{id}`.
- Added CLI client methods for tool/toolset list/search/info/invoke over existing UDS/HTTP contracts.
- Added visible `agh tool list/search/info/invoke` and `agh toolsets list/info` commands while preserving hidden internal `agh tool mcp` and authoritative `agh mcp auth`.
- Added JSON/human/toon rendering, local canonical ID validation, JSON input validation for `--input`, `--input-file`, stdin, and `--input-file -`, plus structured JSON errors for local and daemon tool failures.
- Added redaction for structured tool errors and invoke results/content/metadata so secret-like fields and diagnostics are not printed.
- Added command/client/docs-guard tests, UDS integration parity test, and daemon HTTP/UDS parity test.
- Focused checks passed:
  - `go test ./internal/cli -count=1`
  - `go test ./internal/cli -coverprofile=/tmp/agh-task12-cli.cover -count=1` => 80.4% package coverage
  - focused task/client/MCP/config helper tests after coverage additions
- Integration/parity checks passed after final code changes:
  - `go test -tags integration ./internal/cli -run TestCLIToolCommandsMatchUDSContractsIntegration -count=1`
  - `go test ./internal/daemon -run TestToolRoutesStayHTTPAndUDSBehaviorallyAligned -count=1`
- Full `make verify` passed after fixing lint feedback: format/oxlint, typecheck, Vitest 257 files / 1838 tests, web build, golangci-lint 0 issues, Go race tests 6966, boundaries OK.
- Fresh pre-commit `make verify` passed at 2026-04-29 04:04:51 -03 with exit code 0: oxlint 0 warnings/errors, Vitest passed, web build completed with existing Vite chunk-size warning, golangci-lint 0 issues, Go race tests 6966, boundaries OK.
- Created local commit `9a19515e feat: add tool registry cli commands` with scoped `internal/cli` implementation/test files only.
- Post-commit `make verify` passed at 2026-04-29 04:07:08 -03 with exit code 0: oxlint 0 warnings/errors, Vitest passed, web build completed with existing Vite chunk-size warning, golangci-lint 0 issues, Go race tests 6966, boundaries OK.
- Updated `.compozy/tasks/tools-registry/task_12.md`, `_tasks.md`, task memory, and shared workflow memory.

Now:

- Report completion evidence and note unstaged tracking/pre-existing artifacts.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Task docs: `.compozy/tasks/tools-registry/task_12.md`, `_tasks.md`, `_techspec.md`, `adrs/adr-005-*`, `adr-006-*`, `adr-007-*`.
- Code/test surfaces: `internal/cli/root.go`, `internal/cli/client.go`, `internal/cli/client_tools.go`, `internal/cli/tool.go`, `internal/cli/tool_operator.go`, `internal/cli/tool_test.go`, `internal/cli/tool_integration_test.go`, `internal/cli/client_test.go`, `internal/cli/doc_test.go`, `internal/cli/helpers_test.go`, `internal/cli/config_test.go`, `internal/cli/mcp_auth_test.go`.
