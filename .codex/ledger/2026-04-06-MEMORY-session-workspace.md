Goal (incl. success criteria):

- Complete workspace-entity task_04 by refactoring `internal/session` create/resume to require a workspace resolver, persist/use `WorkspaceID`, resolve startup state from `workspace.ResolvedWorkspace`, update session tests, and pass targeted validation plus `make verify`.

Constraints/Assumptions:

- Required task inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory, task_04, `_techspec.md`, `_tasks.md`, ADR-001, and prior workspace ledgers.
- Scope should stay centered on `internal/session` plus minimal dependent caller/test updates needed for compile/verification.
- The workspace-entity PRD directory remains untracked; workflow memory and tracking updates should stay out of the eventual code commit.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- `session.Manager` will resolve create inputs via `workspace.WorkspaceResolver`, using registered id/name through `Resolve` and explicit paths through `ResolveOrRegister`.
- `ResolvedWorkspace.Config` and `ResolvedWorkspace.Agents` will become the source of truth for config and agent lookup during create/resume instead of the old manager loaders.
- Session metadata will use `WorkspaceID` as the durable persisted value; any remaining workspace root path usage should be runtime-only and derived from resolver output when needed.
- `session.CreateOpts` now splits registered workspace refs (`Workspace`) from explicit filesystem paths (`WorkspacePath`) so daemon/API callers can stop relying on implicit current-directory behavior.
- Runtime `Session.Workspace` remains temporarily as a resolver-derived convenience path to avoid widening downstream contract churn inside task_04, but it is no longer persisted in `store.SessionMeta`.

State:

- Verification complete; workflow memory/task tracking updated; local code-only commit still pending.

Done:

- Read task docs, workflow memory, prior task ledgers, and required skill instructions.
- Inspected `internal/session`, `internal/store`, `internal/workspace`, `internal/config`, and dependent caller surfaces in daemon/httpapi/udsapi.
- Confirmed pre-change signal: `Create`/`Resume` still call `resolveWorkspace()`, `resolveWorkspace()` still falls back to `os.Getwd()`, and session metadata/runtime still lean on workspace paths.
- Refactored `internal/session/manager.go` to require `WithWorkspaceResolver`, resolve create/resume via `ResolvedWorkspace`, remove the `os.Getwd()` fallback, and source config/agent resolution from resolver output.
- Persisted `WorkspaceID` only in `store.SessionMeta`, updated session query/status paths to resolve workspace roots from the resolver, and adjusted dependent daemon/httpapi/udsapi callers plus tests for `WorkspacePath`.
- Updated unit/integration coverage across `internal/session`, `internal/store`, `internal/observe`, `internal/httpapi`, `internal/udsapi`, `internal/cli`, and `internal/daemon`, including a dedicated resolver-backed session integration test and coverage-only transcript test.
- Ran `go test ./internal/observe -count=1`, `go test ./internal/session -count=1`, `make verify`, `go test ./internal/session -cover -count=1` (`81.7%`), and `go test -tags integration ./internal/session -cover -count=1` (`82.1%`) successfully on the final code state.
- Updated workflow memory and task tracking artifacts outside the future code commit.

Now:

- Review final staged set and create the local code-only commit.

Next:

- Deliver final handoff after the commit.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/session/manager.go`, `internal/session/session.go`, `internal/session/query.go`, `internal/store/store.go`, `internal/observe/reconcile.go`, `internal/session/manager_test.go`, `internal/session/additional_test.go`, `internal/session/query_test.go`, `internal/session/transcript_test.go`, dependent daemon/httpapi/udsapi/cli tests.
- Commands: `go test ./internal/observe -count=1`, `go test ./internal/session -count=1`, `make verify`, `go test ./internal/session -cover -count=1`, `go test -tags integration ./internal/session -cover -count=1`, `git status --short`.
