Goal (incl. success criteria):

- Complete workspace-entity task_09 by updating `internal/observe` and `internal/memory` to use `WorkspaceID` for reconciliation and dream/memory flows, resolve filesystem paths only through `workspace.Resolver` when needed, refresh tests, and pass targeted validation plus `make verify`.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory files, `task_09.md`, `_techspec.md`, `_tasks.md`, ADR-001..004, and relevant prior ledgers for tasks 04-08.
- Scope should stay centered on `internal/observe`, `internal/memory`, and the smallest dependent daemon/test call-site changes needed for compile and validation.
- The `.compozy/tasks/workspace-entity/` tree is currently untracked; workflow memory and task tracking updates should stay out of the eventual code commit unless repository policy changes.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- `observe` now carries `WorkspaceID` in its in-memory session snapshots and resolves workspace-root-dependent permission/config state through an injected workspace resolver.
- `memory.Service` now normalizes explicit dream workspace refs through the workspace resolver, ensures workspace memory directories from the resolved root, and passes the normalized workspace ID to the dream spawner.
- `daemon.RuntimeDeps` now includes the workspace resolver so the default observer factory and dream-service factory can both receive the resolver without rebuilding it elsewhere.

State:

- Completed. Code changes are committed as `ed1898d`, task/workflow memory is updated, and post-commit verification on `HEAD` passed.

Done:

- Loaded required skills, workflow memory, PRD docs, ADRs, and related task ledgers.
- Captured the pre-change gap: `observe` still tracks/resolves permission state from `SessionInfo.Workspace` paths, `memory` dream flow still exposes a generic `workspace string`, and reconcile tests do not yet cover missing `workspace_id` behavior explicitly.
- Inspected relevant code in `internal/observe`, `internal/memory`, `internal/daemon`, `internal/session`, and `internal/store`.
- Refactored `internal/observe` so permission resolution and observer snapshots are `WorkspaceID`-first, added resolver-backed config loading via `LoadForHome(...)`, and updated warning logs to carry `workspace_id`.
- Refactored `internal/memory.Service` so explicit dream runs resolve workspace refs through the workspace resolver, ensure workspace memory directories from the resolved root, and pass normalized workspace IDs to the session spawner.
- Updated daemon wiring to inject the workspace resolver into both the dream service factory and the default observer factory.
- Added observe tests for resolver-backed permission resolution and missing-`workspace_id` reconciliation behavior; added memory tests for explicit workspace normalization, resolver requirements, and workspace-memory directory setup.
- Ran `go test ./internal/observe ./internal/memory ./internal/daemon -count=1`, `go test ./internal/observe -cover -count=1` (`83.5%`), `go test ./internal/memory -cover -count=1` (`80.8%`), `go test -tags integration ./internal/observe -count=1`, and `make verify` successfully.
- Updated workflow memory and PRD tracking files outside the future code commit.
- Created local commit `ed1898d` (`feat: update observe memory workspace refs`).
- Re-ran `make verify` on committed `HEAD`; it passed with `DONE 753 tests in 0.426s` and `OK: all package boundaries respected`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/observe/observer.go`, `internal/observe/helpers_test.go`, `internal/observe/observer_test.go`, `internal/observe/reconcile_test.go`, `internal/memory/dream.go`, `internal/memory/dream_test.go`, `internal/daemon/daemon.go`.
- Commands: `go test ./internal/observe ./internal/memory ./internal/daemon -count=1`, `go test ./internal/observe -cover -count=1`, `go test ./internal/memory -cover -count=1`, `go test -tags integration ./internal/observe -count=1`, `make verify`.
