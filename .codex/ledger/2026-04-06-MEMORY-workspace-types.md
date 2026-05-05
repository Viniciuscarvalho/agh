Goal (incl. success criteria):

- Implement task_01 by adding `internal/workspace/` types, sentinel errors, and `WorkspaceStore` / `WorkspaceResolver` interfaces with focused unit tests and clean verification.

Constraints/Assumptions:

- Scope is limited to types/interfaces only; no resolver behavior, SQLite logic, or filesystem scanning in this task.
- Must follow TechSpec Workspace data models and ADR-004 file layout.
- Must use workflow memory files before edits and update them before completion.
- Must run task-specific tests plus full `make verify` before any completion claim or commit.
- Do not touch unrelated git changes; `.compozy/tasks/workspace-entity/` is currently untracked.

Key decisions:

- Use `internal/workspace/workspace.go` and `internal/workspace/store.go` for this task's surface area, matching ADR-004's split where practical.
- Reuse `config.Config` and `config.AgentDef` directly in `ResolvedWorkspace` per TechSpec.

State:

- Verification complete; pending local commit and final handoff.

Done:

- Read AGENTS/CLAUDE, workflow memory, task spec, `_techspec.md`, `_tasks.md`, and ADR-004.
- Confirmed there is no existing `internal/workspace` package.
- Inspected `internal/store/global_db.go`, `internal/session/manager.go`, and relevant `internal/config` types.
- Added `internal/workspace/workspace.go` and `internal/workspace/store.go` with exported models, sentinel errors, and interfaces.
- Added `internal/workspace/workspace_test.go` covering sentinel error identity/distinctness and exported struct/zero-value stability.
- Ran `go test ./internal/workspace -cover` and `make verify` successfully.
- Updated workflow memory and task tracking files; these should remain out of the commit.

Now:

- Creating the local commit for code changes only.

Next:

- Deliver the final summary with verification evidence and the coverage caveat for this declarations-only package.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/workspace/*`, `.compozy/tasks/workspace-entity/task_01.md`, `.compozy/tasks/workspace-entity/_tasks.md`, `.compozy/tasks/workspace-entity/memory/MEMORY.md`, `.compozy/tasks/workspace-entity/memory/task_01.md`
- Commands: `go test ./internal/workspace -cover`, `make verify`, `git add internal/workspace`, `git commit`
