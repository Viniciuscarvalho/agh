Goal (incl. success criteria):

- Complete workspace-entity task_11 by mirroring the HTTP workspace CRUD/resolve routes and updated session create/list contract in `internal/udsapi`, updating CLI transport types if needed, adding required UDS tests, reaching at least 80% coverage for `internal/udsapi`, and finishing with clean `make verify`.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory files, `task_11.md`, `_techspec.md`, `_tasks.md`, ADR-001..004, required skill docs, and existing workspace-related ledgers.
- Scope should stay centered on `internal/udsapi` with the smallest supporting changes needed in `internal/cli` and tests to keep contract parity with `internal/httpapi`.
- The `.compozy/tasks/workspace-entity/` tree is currently untracked; workflow memory and task tracking updates should stay out of the eventual code commit.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- Reuse the HTTP workspace/session helper logic where possible instead of re-deriving validation or status mapping inside UDS.
- Mirror the HTTP contract exactly for session payloads: request uses `workspace` for registered refs and `workspace_path` for explicit paths, while responses expose `workspace_id` and `workspace_path`.
- Skip the `brainstorming` skill because this run is implementing an already-approved PRD/techspec task with explicit deliverables and validation gates.
- Fix the full-pipeline regression at the composition root rather than weakening tests: `internal/daemon` must pass `deps.WorkspaceService` into the default `udsapi.New(...)` factory so real boot paths stay aligned with the stricter UDS constructor.

State:

- Verification complete; workflow memory/tracking updates and the local code-only commit are still pending.

Done:

- Read repository instructions, task docs, workflow memory, ADRs, relevant skill docs, and prior workspace ledgers.
- Reconciled worktree state and confirmed unrelated changes remain outside task scope.
- Captured the pre-change gap: `internal/udsapi` has no workspace service wiring or `/api/workspaces` routes, `POST /api/sessions` still treats `workspace` as a filesystem path, `GET /api/sessions` has no workspace filter, and current UDS tests still assert the legacy `Workspace: "/workspace"` shape.
- Added `internal/apisupport/session_workspace.go` to centralize session/workspace transport validation and status mapping shared by HTTP and UDS.
- Mirrored HTTP workspace CRUD/resolve routes into `internal/udsapi`, updated session create/list payloads to the workspace-ref/workspace-path contract, and required a workspace service in the UDS server constructor.
- Updated CLI session transport structs/rendering to consume `workspace_id` and `workspace_path`, and refreshed UDS/CLI tests plus the UDS integration stream helper.
- Diagnosed the initial `make verify` failure to a real daemon wiring regression (`udsapi: workspace resolver is required`), fixed `internal/daemon/daemon.go` to inject `udsapi.WithWorkspaceResolver(deps.WorkspaceService)`, and added a daemon regression assertion for the UDS workspace service.
- Ran `go test ./internal/udsapi ./internal/cli -count=1`, `go test ./internal/daemon -count=1`, `go test ./internal/udsapi -cover -count=1` (`coverage: 80.7% of statements`), `go test -tags integration ./internal/udsapi -count=1`, and a fresh `make verify` successfully.

Now:

- Update workflow memory and task tracking, then create the local code-only commit.

Next:

- Deliver the final handoff after the commit.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/apisupport/session_workspace.go`, `internal/httpapi/{stream.go,workspaces.go}`, `internal/udsapi/{server.go,routes.go,handlers.go,workspaces.go,helpers_test.go,handlers_test.go,handlers_error_test.go,server_test.go,udsapi_integration_test.go}`, `internal/cli/{client.go,session.go}` plus touched tests, `internal/daemon/{daemon.go,daemon_test.go}`, workflow memory/task tracking files.
- Commands: `go test ./internal/udsapi ./internal/cli -count=1`, `go test ./internal/daemon -count=1`, `go test ./internal/udsapi -cover -count=1`, `go test -tags integration ./internal/udsapi -count=1`, `make verify`, `git status --short`.
