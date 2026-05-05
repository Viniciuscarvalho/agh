Goal (incl. success criteria):

- Implement task_10: task creation records intent only; publish/start/approval enqueue exactly one executable run, bind workspace coordinated runs to one stable coordination channel, emit audit/hooks, preserve manual flows, add required tests, update task tracking, run verification, and create one local commit if clean.

Constraints/Assumptions:

- Must obey repo AGENTS/CLAUDE: no destructive git commands, `make verify` required before completion, no web search for local code, Go/testing skills active.
- Required skills used: cy-workflow-memory, cy-execute-task, cy-final-verify; backend/test skills used: golang-pro and testing-anti-patterns.
- Workflow memory paths read: `.compozy/tasks/autonomous/memory/MEMORY.md` and `task_10.md`.
- Existing worktree had many `.compozy/tasks/autonomous/*` modifications and untracked memory/ADR files before implementation; do not revert or stage unrelated tracking/docs changes.
- Automatic commit is enabled, but tracking-only files should stay out of the commit unless repo policy requires otherwise.

Key decisions:

- Enqueue boundary should reuse existing task service/store primitives from tasks 07-09 rather than adding a parallel queue or user-facing orchestration flag.
- Add a shared task execution boundary for publish/start/approval; do not make task creation heavy.
- Add origin fields to task-run hook context because task_10 requires actor/origin metadata at enqueue/start boundaries.

State:

- Implementation, verification, task tracking updates, and one local code commit are complete.

Done:

- Read workflow memory, root AGENTS/CLAUDE, `_techspec.md`, `_tasks.md`, task_10.md, and ADRs 001-012.
- Scanned existing ledger names and relevant ledger content search; cross-task context comes primarily from workflow memory and task_09/task_08 prior work.
- Captured pre-change signal: no `Service.StartTask` or `/api/tasks/:id/start`; publish/approve only return task records; queued workspace runs only get `coordination_channel_id` when a network channel is already supplied.
- Added task execution request/action/result types and shared publish/start/approval boundary that derives idempotency keys and delegates to `EnqueueRun`.
- Added workspace queued-run coordination channel create-or-resolve in `globaldb` so runs without explicit channels get stable derived local channels.
- Added origin metadata to task-run hook context.
- Added API/UDS/CLI surface updates, including `POST /api/tasks/:id/start`.
- Regenerated OpenAPI/SDK/web contract artifacts and updated the web task API adapter for the new execution request/response shape.
- Fixed final lint fallout from `make verify`: task-package execution type stutter, CLI huge param, and repeated agent identity fallback error string.
- Full `make verify` passed after final changes: oxlint 0 warnings/errors, golangci-lint 0 issues, Go runner `DONE 6193 tests`, package boundaries respected.
- Fresh task-specific integration slice passed across `internal/task`, `internal/api/httpapi`, `internal/api/udsapi`, and `internal/cli`.
- Fresh coverage target evidence: `go test ./internal/task -cover -count=1` reported 80.2% statements.
- Created local commit `c615111b feat: add task execution boundary` with only code/tests/generated implementation artifacts staged.

Now:

- Prepare final response with verification report and remaining working-tree note.

Next:

- None for this task unless the user wants tracking docs committed separately.

Open questions (UNCONFIRMED if needed):

- None blocking.

Working set (files/ids/commands):

- `.compozy/tasks/autonomous/memory/task_10.md`, `.codex/ledger/2026-04-26-MEMORY-task-10-execution-boundary.md`
- `internal/task/{types.go,interfaces.go,manager.go,manager_test.go}`
- `internal/store/globaldb/global_db_task_aux.go`
- `internal/hooks/payloads.go`
- `internal/api/{contract,core,httpapi,udsapi}` task surfaces
- `internal/cli/{client.go,task.go}`
- Commit: `c615111b`
