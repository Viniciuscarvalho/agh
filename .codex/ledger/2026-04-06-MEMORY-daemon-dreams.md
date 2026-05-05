Goal (incl. success criteria):

- Complete workspace-entity task_06 by wiring a GlobalDB-backed workspace resolver in `internal/daemon`, injecting it into `session.Manager`, switching dream consolidation to workspace IDs/refs, updating daemon tests, and passing targeted validation plus `make verify`.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory, task_06, `_techspec.md`, `_tasks.md`, ADR-001, and prior workspace ledgers.
- Scope should stay centered on `internal/daemon` with the smallest supporting changes needed in `internal/config` or tests to wire a home-aware resolver cleanly.
- The workspace-entity PRD directory is untracked; workflow memory/task tracking updates should stay out of the eventual code commit.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- Daemon boot will construct the resolver from the already-open global registry plus daemon `HomePaths`, logger, and a config loader that honors the daemon home instead of ambient process home.
- Dream consolidation will treat workspace refs as durable IDs, using resolver lookup only when an explicit workspace ref/path needs normalization into a registered workspace.
- Recent-workspace selection will drop the old `SessionInfo.Workspace` path fallback entirely rather than preserving compatibility shims.

State:

- Task complete; workflow memory/task tracking are updated, the local code-only commit is created, and post-commit verification passed.

Done:

- Read task docs, workflow memory, root instructions, required skill docs, ADR-001, and related ledgers.
- Captured the pre-change gap from code inspection: daemon boot does not create/inject a resolver, and dream consolidation/tests still key recent workspaces from `SessionInfo.Workspace` paths.
- Built the execution checklist and identified the main affected surfaces: `internal/daemon/daemon.go`, `internal/daemon/daemon_test.go`, `internal/daemon/daemon_integration_test.go`, and resolver-aware config loading.
- Wired daemon boot to construct a GlobalDB-backed resolver, inject it into `session.Manager`, and retain it on the daemon runtime state.
- Refactored dream consolidation and session-stop fanout to work on workspace IDs/refs, resolving explicit path-like refs through the resolver before spawning dream sessions.
- Updated daemon unit/integration tests to register workspaces through the resolver and assert dream sessions receive workspace IDs instead of raw paths.
- Added `config.LoadForHome(...)` so daemon-owned resolver config loading honors daemon `HomePaths` without ambient-process leakage.
- Fixed two regressions uncovered by full verification: `.env`-driven `AGH_HOME` loading in `internal/config`, and a real `Prompt()`/`Stop()` race in `internal/session`.
- Ran `go test ./internal/daemon -count=1`, `go test -tags integration ./internal/daemon -count=1`, `go test ./internal/daemon -cover -count=1` (`80.5%`), `go test ./internal/config -run TestLoadUsesDotEnvForAGHHome -count=1`, `go test ./internal/session -run TestPromptSerializesSetupAgainstConcurrentStop -count=1`, and `make verify` successfully.
- Created local commit `3fa0601` (`feat: wire daemon workspace resolver`).
- Re-ran `make verify` successfully on the committed state.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/config/config.go`, `internal/daemon/daemon.go`, `internal/daemon/daemon_test.go`, `internal/daemon/daemon_integration_test.go`, `internal/session/manager.go`, `internal/session/session.go`, workflow memory/task tracking files.
- Commands: `git status --short`, `git diff --stat`, daemon/config/session targeted `go test` commands, `make verify`.
