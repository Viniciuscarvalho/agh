Goal (incl. success criteria):

- Implement ext-architecture task_01 by creating `internal/tools/` with the minimal `Tool` struct, `ToolSource` enum, and `ToolProvider` interface.
- Success means: the new package compiles, unit tests cover JSON behavior and enum validation, task/workflow tracking is updated correctly, `make verify` passes, and one local commit is created.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`; no destructive git commands and no touching unrelated worktree changes.
- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Source of truth is `.compozy/tasks/ext-architecture/task_01.md`, `_techspec.md`, `_tasks.md`, ADR-005, and the existing hook payload/types under `internal/hooks/`.
- Keep scope tight to the minimal `internal/tools` foundation plus required tests and tracking files.

Key decisions:

- Canonical `Tool` JSON follows `_techspec.md` / `_protocol.md` (`name`, `description`, `input_schema`, `read_only`, `source`).
- Hook compatibility will be handled without importing `internal/hooks` into `internal/tools`; decode behavior may accept hook-compatible field aliases where required.

State:

- Complete.

Done:

- Read required skill docs, workflow memory files, task spec, `_tasks.md`, `_techspec.md`, ADR-005, and relevant hook files.
- Confirmed baseline gap: `internal/tools/` does not exist yet.
- Reconciled the apparent doc tension: protocol examples use canonical tool JSON with `name`, while the task also requires compatibility with hook `ToolCallRef` semantics.
- Captured existing unrelated worktree changes under `.compozy/tasks/ext-architecture/`; they will be left untouched except for required tracking/memory files.
- Added `internal/tools/tool.go` with the minimal package, `ToolSource` enum, canonical `Tool` JSON shape, hook-compatible `tool_name` decode support, and `ToolProvider`.
- Added `internal/tools/tool_test.go` covering canonical marshaling, hook-compatible unmarshaling, conflicting aliases, enum JSON/validation, and compile-time `ToolProvider` verification.
- Recorded workflow memory and task tracking updates locally without staging them for commit.
- Verified `go test ./internal/tools -coverprofile=/tmp/internal-tools.cover.out -covermode=count` at 96.8% coverage.
- Verified `make verify` successfully before commit and again after the commit hook ran.
- Created local commit `e9e4f9f` (`feat: add minimal tool foundation`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-tool-foundation.md`
- `.compozy/tasks/ext-architecture/task_01.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/adrs/adr-005.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_01.md`
- `internal/hooks/payloads.go`
- `internal/hooks/types.go`
- Commands: `rg`, `sed`, `git status`, `go test`, `make verify`
