Goal (incl. success criteria):

- Implement tools-refac Task 10: add agent-callable MCP auth status built-in using the existing redacted auth status model; align hosted MCP projection and approval parity; keep login/logout management-only; add required unit/integration coverage; run required verification; update task tracking; create one local commit after clean verification.

Constraints/Assumptions:

- Must use cy-workflow-memory, cy-execute-task, and cy-final-verify.
- Backend Go work requires AGH Go guidelines; tests require AGH test conventions and testing anti-pattern guidance.
- Must read workflow memory, PRD docs, ADR-002, ADR-004, AGENTS/CLAUDE guidance, and internal/CLAUDE before code edits.
- Do not run destructive git commands.
- Conversation in BR-PT; artifacts/code/docs in English.

Key decisions:

- Reuse existing `internal/mcp/auth` redacted status model through `tools.MCPAuthStatusProvider`.
- Keep MCP login/logout management-only; the tool path must not start browser auth, logout, or token-refresh side effects by default.
- Hosted MCP must remain session projection + `Registry.Call` dispatch with daemon-mediated approval semantics.

State:

- Task 10 implementation, tracking updates, local commit, and post-commit verification are complete.

Done:

- Created session ledger.
- Read workflow memory, PRD TechSpec sections, ADR-002, ADR-004, supporting ADRs, internal Go guidance, and required skill guidance.
- Captured pre-change signal: no `ToolIDMCPAuth`, `ToolsetIDMCPAuth`, or `agh__mcp_auth_status` implementation currently exists under `internal/tools`, `internal/daemon`, or `internal/mcp`.
- Mapped existing primitives: `mcp.CallExecutor` already implements `tools.MCPAuthStatusProvider`; hosted MCP already calls `registry.List`/`registry.Call` with session scope and no `ApprovalToken`; registry approval bridge mediates approval-required calls.
- Added `agh__mcp_auth_status` IDs/descriptors/toolset and daemon native handler over `tools.MCPAuthStatusProvider`.
- Wired daemon native dependencies so the MCP executor created during registry boot is reused as the status provider.
- Added focused unit/integration coverage for redacted auth status payloads, management-only repair paths, provider unavailable/error handling, hosted MCP projection parity, and hosted approval bridge dispatch.
- Fixed result redaction so public diagnostic field `token_present` remains a boolean while actual token/secret material is still redacted.
- Focused tests passed:
  - `go test ./internal/tools ./internal/tools/builtin ./internal/mcp ./internal/daemon -count=1`
  - `go test ./internal/cli -run 'TestToolCommandPreservesMCPAuthSurface|TestToolRenderingAndValidationHelpers' -count=1`
  - `go test ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi -run 'Test.*(Tool|Hosted|SettingsMCP)' -count=1`
- Coverage evidence: `internal/tools` 80.8%, `internal/tools/builtin` 93.3%, `internal/mcp` 80.7%; `internal/daemon` remains package-wide 73.8% while the new `native_mcp_auth_tools.go` handler functions are 87.5%/100%/100%.
- Pre-commit `make verify` passed after all code/test edits: `0 issues`, `DONE 7094 tests`, and package boundaries OK.
- Self-review found no unrelated API/web/docs drift; task tracking now marks Task 10 completed in `.compozy/tasks/tools-refac/task_10.md` and `_tasks.md`.
- Created local code/test commit `5fa9f805 feat: add mcp auth status tool`.
- Post-commit `make verify` passed: lint `0 issues`, Vitest `257` files / `1838` tests, Go `DONE 7094 tests`, and package boundaries OK.

Now:

- Final handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- Task: .compozy/tasks/tools-refac/task_10.md
- Master tasks: .compozy/tasks/tools-refac/\_tasks.md
- Workflow memory: .compozy/tasks/tools-refac/memory/MEMORY.md and task_10.md
- Pre-change signal: `rg -n "ToolIDMCPAuth|ToolsetIDMCPAuth|agh__mcp_auth_status" internal/tools internal/daemon internal/mcp -g '*.go'`
- Changed code/test files: internal/tools/builtin_ids.go, internal/tools/builtin/{descriptors.go,toolsets.go,mcp_auth.go,builtin_test.go}, internal/tools/{result_limit.go,dispatch_test.go}, internal/daemon/{native_tools.go,native_mcp_auth_tools.go,native_mcp_auth_tools_test.go,native_tools_test.go}, internal/mcp/hosted_test.go.
