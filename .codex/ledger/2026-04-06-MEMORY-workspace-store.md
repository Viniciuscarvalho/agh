Goal (incl. success criteria):

- Complete task_02 by adding global DB workspace persistence, switching session rows to `workspace_id`, covering the new store behavior with table-driven tests, and passing `make verify`.

Constraints/Assumptions:

- Scope is limited to task_02 surfaces in `internal/store`, `internal/session` consumers touched by the schema rename, and task/memory tracking files.
- Greenfield rule applies: replace old `sessions.workspace` storage cleanly instead of adding compatibility shims.
- Workflow memory files and task tracking files are currently untracked and should stay out of the auto-commit unless repo policy changes.
- Unrelated git change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- Implement `workspace.WorkspaceStore` directly on `store.GlobalDB` and use a real foreign key from `sessions.workspace_id` to `workspaces.id`.
- Keep ordering deterministic in workspace list queries so tests can assert a stable result.

State:

- Task complete; verification, tracking updates, and local code-only commit are done.

Done:

- Read root `AGENTS.md`, `CLAUDE.md`, task spec, `_techspec.md`, `_tasks.md`, relevant ADRs, workflow memory, and required skill files.
- Inspected existing `internal/store`, `internal/workspace`, and `internal/session` code plus current git state and prior workspace-types ledger.
- Added `workspaces` schema/indexes, `sessions.workspace_id` FK storage, and transactional legacy migration support in `internal/store/schema.go`.
- Implemented `workspace.WorkspaceStore` on `store.GlobalDB`, including duplicate-path/name error mapping and stable workspace listing.
- Updated session/store/observe metadata surfaces to carry `WorkspaceID` where global DB persistence depends on it.
- Added focused store/observe/session tests for workspace CRUD, constraint handling, session registry persistence, migration, WAL/recovery, and helper coverage.
- Ran `go test ./internal/store -count=1`, `go test ./internal/store -cover -count=1` (`coverage: 80.5% of statements`), `go test ./internal/observe -count=1`, `go test ./internal/session -count=1`, and `make verify` successfully.
- Updated task/workflow memory artifacts and task tracking files outside the commit.
- Created local commit `5246883` (`feat: persist workspaces in global db`).

Now:

- Preparing the final handoff with fresh verification evidence.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/store/schema.go`, `internal/store/global_db.go`, `internal/store/global_db_test.go`, `internal/store/store.go`, `internal/session/session.go`, `internal/session/manager.go`, `.compozy/tasks/workspace-entity/task_02.md`, `.compozy/tasks/workspace-entity/_tasks.md`, `.compozy/tasks/workspace-entity/memory/MEMORY.md`, `.compozy/tasks/workspace-entity/memory/task_02.md`
- Commands: `git status --short`, `git diff --stat`, `go test ./internal/store -cover -count=1`, `go test ./internal/observe -count=1`, `go test ./internal/session -count=1`, `make verify`
