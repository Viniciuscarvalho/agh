Goal (incl. success criteria):

- Complete workspace-entity task_05 by making workspace config loading explicit to `root_dir`, removing `os.Getwd()` fallback from `internal/config`, sharing ordered workspace/additional/global agent discovery helpers with the resolver, adding required tests, and passing targeted validation plus `make verify`.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory, task_05, `_techspec.md`, `_tasks.md`, ADR-003, related ledgers, and required skills (`cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`).
- Scope should stay centered on `internal/config` with minimal `internal/workspace` integration updates and tests needed for this task.
- The workspace-entity PRD directory is currently untracked; workflow memory and task tracking updates should stay out of the eventual code commit.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- `config.Load()` will treat workspace overlays as explicit-only: no implicit `os.Getwd()` workspace root, and no workspace `.env` / `.agh/config.toml` lookup when no root is supplied.
- Shared agent discovery order will live in `internal/config` so resolver and tests use the same `root_dir -> additional_dirs -> global` precedence.
- Additional dirs continue to affect agents/skills discovery only; they must not add extra config overlay layers.

State:

- Verification complete; workflow memory/task tracking updates and local code-only commit still pending.

Done:

- Loaded required task docs, workflow memory, root instructions, skill instructions, related ledgers, and current worktree state.
- Captured baseline mismatch: `internal/config/config.go` still falls back to `os.Getwd()`, and resolver resource ordering is internal to `internal/workspace/resolver.go`.
- Built the execution checklist covering explicit root semantics, shared discovery helpers, tests, verification, and tracking.
- Refactored `internal/config/config.go` so workspace overlays are explicit-only, `resolveWorkspaceRoot()` no longer derives roots from `os.Getwd()`, and workspace `.env` loading is skipped when no root is supplied.
- Added exported discovery helpers in `internal/config/agent.go` for ordered `root -> additional -> global` traversal and agent merge precedence, then switched `internal/workspace/resolver.go` to consume them for resource scanning.
- Added config-package tests covering no-CWD workspace fallback, explicit root-only config loading, discovery-root ordering, and agent precedence.
- Ran `go test ./internal/config -count=1`, `go test ./internal/workspace -count=1`, `go test ./internal/config -cover -count=1` (`81.4%`), `go test ./internal/workspace -cover -count=1` (`80.1%`), and `make verify` successfully.

Now:

- Update task tracking, review staged scope, and create the local code-only commit.

Next:

- Deliver the final handoff after the commit.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/config/config.go`, `internal/config/agent.go`, `internal/config/config_test.go`, `internal/config/agent_test.go`, `internal/workspace/resolver.go`, `internal/workspace/resolver_test.go`, workflow memory/task tracking files.
- Commands: `git status --short`, `rg -n 'resolveWorkspaceRoot|Getwd|WithWorkspaceRoot|Load\\(' internal/config internal/workspace`, `go test ./internal/config ...`, `go test ./internal/workspace ...`, `make verify`.
