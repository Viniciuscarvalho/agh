Goal (incl. success criteria):

- Complete session-resilience task 04: implement resume repair in `Resume()`, add `[session.limits].timeout` config support, add required unit/integration coverage, pass `make verify`, update memory/tracking, and create one local commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `.compozy/tasks/session-resilience/task_04.md`, `_techspec.md`, `_tasks.md`, ADR-003, ADR-004, and ADR-005.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`.
- Existing unrelated worktree changes in PRD tracking/memory files and `conversa.jsonl` must not be reverted or overwritten.
- Current codebase already has real session hook dispatch infrastructure; task 04 must integrate repair behavior without regressing that later architecture.

Key decisions:

- Treat the task’s “hook seams” requirement as preserving explicit resume hook boundaries in the current hook-enabled architecture rather than removing or bypassing real hook dispatch.
- Keep resume validation infrastructure-focused per ADR-003: workspace dir, agent definition, event store file, and meta fields. Do not expand into deep event-store auditing.

State:

- Complete.

Done:

- Read AGENTS/CLAUDE guidance, workflow memory, task spec, `_techspec.md`, `_tasks.md`, ADR-001/003/004/005, and relevant prior ledgers.
- Captured baseline gap: no `classifyPreviousStop`, no `validateInfrastructure`, no `SessionLimitsConfig`, and `Resume()` currently reads meta then proceeds directly into hook/workspace/agent startup flow.
- Reviewed current session/config/hook/test surfaces to understand the existing architecture and available harnesses.
- Added `internal/session/resume_repair.go` with crash classification, aggregated infrastructure validation, persistence, and structured logging helpers.
- Wired the repair pipeline into `Resume()` before workspace resolution / ACP startup and preserved the existing resume hook boundaries.
- Added `Config.Session.Limits.Timeout` parsing, validation, and merge coverage.
- Added unit and integration coverage across `internal/session`, `internal/config`, and `internal/api/httpapi`, including full stop/resume/stop propagation checks.
- Verified with targeted unit/integration commands, package coverage (`internal/session` 81.9%, `internal/config` 82.6%), and a clean `make verify`.
- Updated workflow memory and task tracking for session-resilience task 04.
- Created local commit `8c2f532` (`feat: add resume repair pipeline`) with only task-relevant code/test files staged.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-session-resume-repair.md`
- `.compozy/tasks/session-resilience/task_04.md`
- `.compozy/tasks/session-resilience/_techspec.md`
- `.compozy/tasks/session-resilience/_tasks.md`
- `.compozy/tasks/session-resilience/adrs/adr-003.md`
- `.compozy/tasks/session-resilience/adrs/adr-004.md`
- `.compozy/tasks/session-resilience/adrs/adr-005.md`
- `.compozy/tasks/session-resilience/memory/MEMORY.md`
- `.compozy/tasks/session-resilience/memory/task_04.md`
- `internal/session/manager_lifecycle.go`
- `internal/session/manager_workspace.go`
- `internal/session/manager_hooks.go`
- `internal/session/*test.go`
- `internal/config/config.go`
- `internal/config/merge.go`
- `internal/config/*test.go`
- `internal/api/httpapi/httpapi_integration_test.go`
- `go test ./internal/session ./internal/config`
- `go test ./internal/api/httpapi`
- `go test -tags integration ./internal/session -run 'TestManagerIntegrationStopFinalizesWrappedACPProcess|TestManagerIntegrationKillProcessPersistsAgentCrashedStopReason|TestManagerIntegrationCreateAndResumeWithWorkspaceResolver|TestManagerIntegrationResumeClassifiesCrashAndActivates|TestManagerIntegrationResumeFailsWhenWorkspaceDirectoryMissing|TestManagerIntegrationResumeFailsWhenAgentRemoved|TestManagerIntegrationResumeFailsWhenEventStoreIsEmpty|TestManagerIntegrationFullStopResumeStopPersistsStopReasons'`
- `go test -tags integration ./internal/api/httpapi -run 'TestHTTPSessionStopReasonPropagatesToGlobalDBAndAPI|TestHTTPSessionCrashStopReasonPropagatesToGlobalDBAndAPI'`
- `go test ./internal/session -cover`
- `go test ./internal/config -cover`
- `make verify`
