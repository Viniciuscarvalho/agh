Goal (incl. success criteria):

- Complete ext-architecture task_08 by wiring `internal/extension.Manager` into daemon boot between hooks and servers, feeding extension hook declarations into the live hooks runtime, stopping extensions before servers on shutdown, preserving existing daemon boot behavior, updating workflow/task tracking, and passing the required verification including `make verify`.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, required skills (`cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`), ext-architecture task docs, ADRs, and workflow memory as source of truth.
- Existing unrelated worktree changes under `.compozy/tasks/ext-architecture/task_01.md` through `task_07.md`, `_tasks.md`, `docs/ideas/anp/*`, and untracked workflow files must not be reverted.
- Task scope is daemon integration plus the minimal supporting seam needed to obtain the extension registry from the live global DB and to satisfy required lifecycle logging/tests.

Key decisions:

- Reuse `extension.Manager` and `extension.HostAPIHandler` directly from the daemon composition root; do not duplicate resource-loading or hook-declaration logic in `daemon/`.
- Keep extension boot non-fatal: start failures must log and continue daemon boot with hooks/servers still starting.
- Prefer a minimal raw-global-DB seam (likely an optional type assertion or narrow accessor) over widening unrelated daemon interfaces broadly.

State:

- Complete.

Done:

- Read root instructions, required skill docs, ext-architecture workflow memory, task_08, `_techspec.md`, `_tasks.md`, ADRs 001-005, and relevant prior ledgers (`wire-hooks-daemon`, `extension-registry`).
- Confirmed baseline gaps: `internal/daemon/boot.go` has no `bootExtensions()` phase; `hooks_bridge.go` has no extension declaration provider; `Daemon` has no extension manager field; shutdown currently closes hooks before servers but has no extension stop step.
- Confirmed existing worktree contains unrelated modified tracking/docs files that must be left alone.
- Wired `bootExtensions()` between hook and server boot, chained extension declarations into the hooks config provider path, rebuilt hooks after extension start attempts, and published the extension runtime onto the daemon for shutdown ordering.
- Added boot/shutdown/failure-tolerance coverage in `internal/daemon/daemon_test.go` and `internal/daemon/daemon_integration_test.go`, plus lifecycle transition logging in `internal/extension/manager.go` and a narrow `GlobalDB.DB()` seam for registry construction.
- Updated ext-architecture shared/task workflow memory plus `task_08.md` / `_tasks.md` to reflect completion.
- Fresh verification evidence after the last code change: `go test ./internal/daemon -count=1`, `go test -tags integration ./internal/daemon -count=1`, `go test -cover ./internal/daemon -count=1` (`coverage: 81.2% of statements`), and `make verify`.
- Created local code-only commit `26605e3` (`feat: integrate extension boot into daemon`) and re-ran `make verify` on `HEAD` after the commit hook formatting step; the post-commit gate passed cleanly.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-daemon-extension-boot.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_08.md`
- `.compozy/tasks/ext-architecture/task_08.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/adrs/adr-001.md`
- `.compozy/tasks/ext-architecture/adrs/adr-002.md`
- `.compozy/tasks/ext-architecture/adrs/adr-003.md`
- `.compozy/tasks/ext-architecture/adrs/adr-004.md`
- `.compozy/tasks/ext-architecture/adrs/adr-005.md`
- `internal/daemon/boot.go`
- `internal/daemon/daemon.go`
- `internal/daemon/hooks_bridge.go`
- `internal/daemon/daemon_test.go`
- `internal/daemon/daemon_integration_test.go`
- `internal/extension/manager.go`
- `internal/extension/host_api.go`
- `internal/extension/registry.go`
- `internal/store/globaldb/global_db.go`
