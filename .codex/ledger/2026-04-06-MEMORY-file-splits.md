Goal (incl. success criteria):

- Complete refac task_02 by splitting the seven oversized production files into the required focused files with zero behavior/API changes, preserving existing tests, and finishing with clean `make verify`.

Constraints/Assumptions:

- Required inputs read: root `AGENTS.md`, `CLAUDE.md`, workflow memory, `task_02.md`, `.compozy/tasks/refac/_techspec.md`, `.compozy/tasks/refac/_tasks.md`, required skill docs, and relevant neighboring ledgers.
- Scope is limited to file-level reorganizations in `internal/daemon`, `internal/session`, `internal/store`, `internal/workspace`, and `internal/udsapi`, plus required workflow/task tracking updates.
- Existing unrelated worktree churn in `.compozy/tasks/` archives and task docs must remain untouched unless task_02 tracking requires updates.
- No function signature, receiver type, export surface, or runtime behavior may change.

Key decisions:

- Treat this as a mechanical reorganization: move declarations into focused same-package files with minimal textual edits beyond import cleanup and file-local grouping.
- Keep the `udsapi` split aligned with current `httpapi` naming where applicable to reduce noise ahead of task_03 `apicore` extraction.

State:

- Task complete; workflow memory/task tracking are updated, the local code-only commit is created, and post-commit verification passed.

Done:

- Loaded repository instructions, required skills, workflow memory, refac task docs, and related ledgers.
- Confirmed current oversized file set and the required target file names from the task spec/techspec.
- Captured current worktree status and noted substantial unrelated `.compozy/tasks/` churn to avoid touching.
- Split `internal/store/store.go` into `store.go`, `types.go`, and `sql_helpers.go`.
- Split `internal/store/schema.go` into `schema.go`, `sqlite.go`, and `migrate_workspace.go`.
- Split `internal/store/global_db.go` into `global_db.go`, `global_db_workspace.go`, `global_db_session.go`, `global_db_observe.go`, and `global_db_permission.go`.
- Split `internal/workspace/resolver.go` into `resolver.go`, `resolver_crud.go`, `scanner.go`, `clone.go`, and `helpers.go`.
- Split `internal/session/manager.go` into `manager.go`, `manager_lifecycle.go`, `manager_prompt.go`, `manager_workspace.go`, and `manager_helpers.go`.
- Split `internal/daemon/daemon.go` into `daemon.go`, `boot.go`, `dream.go`, `orphan.go`, `boundary.go`, and `notifier.go`.
- Split `internal/udsapi/handlers.go` into `sessions.go`, `agents.go`, `observe.go`, `prompt.go`, `daemon.go`, `stream.go`, and `payloads.go`, while moving shared handler wiring into `internal/udsapi/server.go` to mirror `httpapi`.
- Fixed the only split-induced build regression (`internal/session/manager_helpers.go` missing `errors` import) and removed unused imports after the daemon split.
- Ran `go test ./internal/store -count=1`, `go test ./internal/workspace -count=1`, `go test ./internal/session -count=1`, `go test ./internal/daemon -count=1`, and `go test ./internal/udsapi -count=1` successfully after their respective package splits.
- Ran `go test ./internal/store ./internal/workspace ./internal/session ./internal/daemon ./internal/udsapi -cover -count=1` successfully with coverage `store 80.2%`, `workspace 80.3%`, `session 81.6%`, `daemon 80.5%`, and `udsapi 80.5%`.
- Ran `make verify` successfully after all changes; output ended with `DONE 853 tests in 4.645s` and `OK: all package boundaries respected`.
- Created local commit `5a582c4` (`refactor: split oversized package files`) and re-ran `make verify` successfully on the committed state; output ended with `DONE 853 tests in 0.170s` and `OK: all package boundaries respected`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `internal/daemon/daemon.go`, `internal/session/manager.go`, `internal/store/{global_db.go,schema.go,store.go}`, `internal/workspace/resolver.go`, `internal/udsapi/handlers.go`, `.compozy/tasks/refac/memory/{MEMORY.md,task_02.md}`, `.compozy/tasks/refac/{task_02.md,_tasks.md}`
- Commands: `git status --short`, `wc -l`, `sed`, `rg`
