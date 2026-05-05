Goal (incl. success criteria):

- Implement Task 09: daemon-owned MCP call-through in `internal/mcp`, preserving config/auth metadata, normalizing MCP descriptors with `output_schema`, integrating redacted auth diagnostics with registry availability, adding required tests, updating tracking, and creating one local commit after clean verification.

Constraints/Assumptions:

- Must use workflow memory files under `.compozy/tasks/tools-registry/memory/` before editing code and before finishing.
- Must use `cy-execute-task` workflow and `cy-final-verify` before any completion or commit claim.
- Must not leak MCP token records, bearer headers, OAuth codes, PKCE verifiers, refresh tokens, or client secrets outside `internal/mcp`.
- Must not use library-managed OAuth login/cache/refresh helpers as AGH auth authority.
- Must not run destructive git commands without explicit permission.
- `make verify` must pass before completion and commit.

Key decisions:

- Keep `internal/mcp/auth` as durable auth authority; token material may be read only inside `internal/mcp` for outbound headers.
- Use `mark3labs/mcp-go` v0.49.0 constructors directly per ADR-011: stdio `client.NewStdioMCPClient`, HTTP `client.NewStreamableHttpClient`, SSE `client.NewSSEMCPClient`.
- Do not use mcp-go OAuth helper constructors/stores as AGH credential authority.
- Concrete executor type is `internal/mcp.CallExecutor` to satisfy Go lint stutter rules; `NewMCPCallExecutor` still constructs it and it implements `tools.MCPCallExecutor`.
- `mcp-go@v0.49.0` requires `go 1.25.5`; the module directive bump is dependency-driven.

State:

- Task implementation, tracking updates, scoped local commit, and post-commit verification are complete.

Done:

- Read required workflow skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`.
- Read Go/test/fix/security-adjacent skills: `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, AGH `agh-code-guidelines`, `agh-test-conventions`, and `agh-cleanup-failure-paths`.
- Read shared and task workflow memory.
- Read root/internal AGH guidance and relevant prior MCP/tool-registry ledgers.
- Read Task 09 PRD docs, TechSpec, `_tasks.md`, ADR-002, ADR-005, ADR-010, ADR-011, and mcp-go local module sources.
- Captured pre-change signal: no MCP provider/client constructor usage under internal code, and `github.com/mark3labs/mcp-go` is not currently a known module dependency.
- Added `github.com/mark3labs/mcp-go@v0.49.0` via `go get` and `go mod tidy`.
- Implemented MCP server clone preservation for `Transport`, `URL`, `Auth`, command, args, and env.
- Added `tools.Canonicalize`, `tools.MCPProvider`, redacted MCP auth reason mapping, `MCPToolDescriptor.OutputSchema`, and registry call delegation.
- Added `internal/mcp.CallExecutor` using mcp-go stdio, streamable HTTP, and SSE clients; bearer injection stays inside `internal/mcp`; refresh failure returns redacted `mcp_auth_refresh_failed`.
- Wired daemon registry boot to include configured/provider/resource-catalog MCP sources.
- Added MCP provider/unit tests and mcp-go fake-server tests for HTTP, SSE, stdio, auth-required, invalid auth, refresh failure, timeout, cancellation, output schema, source redaction, and forbidden OAuth helper constructors.
- Verification so far: AGH test-shape checks pass for new MCP/daemon/tools tests; `go test ./internal/mcp ./internal/tools ./internal/daemon -count=1` passes; `go test -race ./internal/mcp ./internal/tools ./internal/daemon -count=1` passes; `go test ./internal/mcp -coverprofile=/tmp/agh-task09-mcp.cover -count=1` reports 81.8%; `make lint` reports `0 issues.`.
- Full `make verify` first failed in `sdk/create-extension` and then in `internal/extension` because generated/temp Go extension modules still declared `go 1.25.4`; those modules replace AGH with this repo, whose new `mcp-go@v0.49.0` dependency requires `go 1.25.5`.
- Targeted version-drift checks passed after fixture updates: `bun test sdk/create-extension/src/index.test.ts`, `go test ./sdk/go -run TestExternalConsumerBuildsAgainstPublicSDK -count=1`, and `go test ./internal/extension -run TestExtensionToolProviderGoSDKSubprocessIntegration -count=1`.
- Fresh full verification passed: `git diff --check && make verify` exited 0 with `Found 0 warnings and 0 errors.`, `257` Vitest files / `1838` Vitest tests passing, frontend build passing, `DONE 6843 tests in 25.037s`, and `OK: all package boundaries respected`.
- Updated Task 09 tracking checkboxes/status and `_tasks.md` row to completed; left tracking/memory artifacts unstaged.
- Created local commit `51ab3547` (`feat: add daemon mcp call-through`).
- Post-commit `make verify` exited 0 with `Found 0 warnings and 0 errors.`, `257` Vitest files / `1838` Vitest tests passing, frontend build passing, `DONE 6843 tests in 6.331s`, and `OK: all package boundaries respected`.

Now:

- Final status check and handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None blocking yet.

Working set (files/ids/commands):

- Workflow memory: `.compozy/tasks/tools-registry/memory/MEMORY.md`, `.compozy/tasks/tools-registry/memory/task_09.md`.
- Task docs: `.compozy/tasks/tools-registry/task_09.md`, `_techspec.md`, `_tasks.md`, ADR-002, ADR-005, ADR-010, ADR-011.
- Pre-change commands: `rg -n "NewStreamableHttpClient|NewSSEMCPClient|NewStdioMCPClient|NewMCPProvider|Canonicalize\\(|RawOutputSchema|output_schema" internal/mcp internal/tools internal/daemon go.mod`; `go list -m github.com/mark3labs/mcp-go`.
- Code working set: `go.mod`, `go.sum`, `internal/mcp/executor.go`, `internal/mcp/executor_test.go`, `internal/tools/mcp.go`, `internal/tools/mcp_test.go`, `internal/tools/tool.go`, `internal/daemon/native_tools.go`, `internal/daemon/tool_mcp_resources.go`, `internal/daemon/tool_mcp_resources_clone_test.go`.
