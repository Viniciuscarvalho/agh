Goal (incl. success criteria):

- Complete `refac-v2` task_04 by moving shared API server logic from `internal/apicore` into `internal/api/core`, merging `internal/apisupport` into that package, preserving handler/parser/SSE behavior, removing old package boundaries, and finishing with verified tests, tracking updates, and one local commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, task_04, `_techspec.md`, `_tasks.md`, ADR-001, ADR-002, workflow memory, and required skills.
- Scope is limited to the task_04 re-root and merge; route re-rooting into `internal/api/httpapi` and `internal/api/udsapi` is out of scope for this task.
- Worktree already contains unrelated `.compozy/tasks/refac-v2/` changes from prior tasks; do not disturb them except for task_04 memory/tracking updates required by this run.
- Same-phase bridge removal is required: no temporary `apicore` or `apisupport` compatibility layer may remain at completion.

Key decisions:

- `internal/api/core` will become the single owner for shared transport-facing handlers, service interfaces, query parsing, SSE helpers, conversions, memory/workspace helpers, and status mapping.
- `internal/apisupport` helpers will be folded directly into `internal/api/core` instead of preserved via aliases or forwarders.
- Transport packages (`internal/httpapi`, `internal/udsapi`) will continue using aliases/wrappers around the shared core package so external behavior stays unchanged while package ownership moves.

State:

- completed

Done:

- Read repository guidance, required skills, workflow memory, task_04, `_tasks.md`, `_techspec.md`, ADR-001, ADR-002, and relevant peer ledgers.
- Captured the baseline that `internal/apicore` and `internal/apisupport` still exist and are imported by transports/tests.
- Built the execution checklist and identified the touched package set: `internal/api/core`, `internal/httpapi`, `internal/udsapi`, `internal/apitest`, tests, and task_04 tracking/memory files.
- Re-rooted the shared API server implementation and tests into `internal/api/core`, updated transport/test consumers to import the new package, and removed the old `internal/apicore` and `internal/apisupport` directories.
- Added direct package-level tests for the merged session/workspace helper behavior to keep the touched core package over the required coverage threshold.
- Ran targeted unit tests, coverage checks, transport integration tests, `make test-integration`, and `make verify` successfully.

Now:

- Final handoff and local cleanup only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/refac-v2/{task_04.md,_tasks.md,_techspec.md}`
- `.compozy/tasks/refac-v2/memory/{MEMORY.md,task_04.md}`
- `internal/apicore/*.go`
- `internal/apisupport/session_workspace.go`
- `internal/httpapi/{shared.go,server.go,prompt.go}`
- `internal/udsapi/{shared.go,server.go}`
- `internal/apitest/*`
- Commands: `rg -n 'internal/apicore|internal/apisupport' internal`, `go test`, `go test -cover`, `go test -tags integration`, `make verify`
