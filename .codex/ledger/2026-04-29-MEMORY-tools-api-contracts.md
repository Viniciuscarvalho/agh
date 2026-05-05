Goal (incl. success criteria):

- Implement `.compozy/tasks/tools-registry/task_11.md`: public Tool Registry API DTOs, shared core handlers, HTTP/UDS routes, OpenAPI/codegen artifacts, generated web TypeScript contracts, parity tests, and tracking updates.
- Success requires executable native/extension/MCP invocation through the existing registry, operator vs session projection behavior, structured redacted errors, `make codegen`/`make codegen-check`, web type/test gates, full `make verify`, and one local commit after clean verification.

Constraints/Assumptions:

- Must use workflow memory at `.compozy/tasks/tools-registry/memory/MEMORY.md` and `task_11.md`.
- Must follow `cy-execute-task`, `cy-workflow-memory`, `cy-final-verify`, `agh-code-guidelines`, `agh-test-conventions`, and `agh-contract-codegen-coship`.
- No destructive git commands without explicit user permission.
- Existing dirty task/spec/memory artifacts are treated as user/other-agent changes unless this task explicitly updates task_11 tracking or current memory.
- API must not expose descriptor-only invocation; all calls must enter the existing `internal/tools.RuntimeRegistry.Call` path.
- OpenAPI and `web/src/generated/agh-openapi.d.ts` must be regenerated together with source contract changes.

Key decisions:

- Use TechSpec API Endpoints/Data Models/Agent Manageability/Implementation Steps 13-14 and ADR-006/007/010 as source of truth.
- Implement shared handler behavior in `internal/api/core`; HTTP and UDS should only register transport routes.
- Expose handlers through registry abstractions (`ToolRegistry`, `ToolsetRegistry`, `ToolApprovalIssuer`) and keep backend execution inside `internal/tools.RuntimeRegistry.Call`.
- Implement local approval tokens in daemon memory; operator HTTP/UDS approval-required invokes require a matching token, while hosted MCP keeps using the ACP approval bridge.

State:

- Task complete. Local commit `fd953726` was created and post-commit `make verify` passed.

Done:

- Loaded required workflow memory files and required skills.
- Read root/internal/web AGENTS/CLAUDE guidance and AGH local Go/test/contract skill references.
- Read task_11, `_tasks.md`, `_techspec.md` relevant sections, ADR-006, ADR-007, ADR-010, and prior relevant ledgers.
- Confirmed pre-existing dirty worktree mostly contains tools-registry task artifacts and untracked workflow memory/QA files.
- Added public tool/toolset/approval/error DTOs, core handlers, HTTP/UDS routes, toolset projection methods, approval token store, daemon injection, and OpenAPI registry entries.
- Focused compile pass passed for `./internal/tools ./internal/api/contract ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/daemon`.
- Added focused DTO, approval-token, core handler, HTTP/UDS parity, and OpenAPI contract tests.
- Fixed expired approval-token classification to report `approval_token_expired` before pruning active records.
- Focused package test now passes: `go test ./internal/tools ./internal/api/contract ./internal/api/spec ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/daemon -count=1`.
- Regenerated OpenAPI and web TypeScript contracts with `make codegen`.
- Verified generated drift and web contracts with `make codegen-check`, `make bun-typecheck`, and `make bun-test` (257 files / 1838 tests).
- Fixed lint issues in tool DTO conversion, approval bridge size, parity tests, and line wrapping.
- Moved HTTP/UDS parity tests into `internal/daemon` after package boundaries rejected a direct `internal/api/httpapi` test import of `internal/api/udsapi`.
- Full `make verify` passed after final tracking updates: codegen/typecheck/format/oxlint, Vitest, web build, `golangci-lint` 0 issues, Go tests 6900 tests, boundaries OK, build OK.
- Updated `.compozy/tasks/tools-registry/task_11.md`, `_tasks.md`, and task-local workflow memory with completion and verification evidence.
- Created local commit `fd953726` (`feat: add tool registry contracts`) with scoped implementation/generated artifacts only.
- Post-commit `make verify` passed: codegen-check/typecheck/format/oxlint, Vitest 257 files / 1838 tests, web build, `golangci-lint` 0 issues, Go tests 6900 tests, boundaries OK, build OK.
- Promoted durable task_11 handoff context into shared workflow memory.

Now:

- Report completion.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- Repo: `/Users/pedronauck/Dev/compozy/agh`.
- Task files: `.compozy/tasks/tools-registry/task_11.md`, `_tasks.md`, workflow memory files.
- Expected code surfaces: `internal/api/contract`, `internal/api/core`, `internal/api/httpapi`, `internal/api/udsapi`, `openapi/agh.json`, `web/src/generated/agh-openapi.d.ts`.
- Focused compile command: `go test ./internal/tools ./internal/api/contract ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/daemon -count=1` passed after route-count expectations were updated.
