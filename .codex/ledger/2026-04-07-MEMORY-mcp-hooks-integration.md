Goal (incl. success criteria):

- Complete `skills-v2` task_09 by wiring skill-driven MCP resolution and lifecycle hook dispatch into daemon boot and session management, with task-required tests, clean verification, workflow memory/task tracking updates, and one local commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, workflow memory requirements, and required skills `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Scope is limited to task_09 integration points in `internal/daemon`, `internal/session`, and supporting tests/tracking files.
- `make verify` is the blocking completion gate; task-specific tests must also cover MCP merge/injection, notifier ordering, hook workspace resolution, fail-open behavior, and marketplace consent blocking.
- Task spec and techspec are the source of truth; no silent scope expansion.

Key decisions:

- Treat the approved task/techspec/ADRs as the design authority; no additional design loop is needed before implementation.

State:

- Complete; verification, memory/tracking updates, and code-only commit remain/are in close-out.

Done:

- Read repository guidance, workflow memory, task_09, `_techspec.md`, `_tasks.md`, ADR-001, ADR-002, and adjacent ledgers for task_04/task_05/task_07.
- Confirmed the pre-change gap: `Manager.Create()`/`Resume()` only forward `resolved.MCPServers`, and `notifierFanout` lacks a post-notifier hook phase.
- Added session-local `SkillRegistry` and `MCPResolver` interfaces/options, wired them through `daemon.SessionManagerDeps`, and merged skill-declared MCP servers into session start options for both create and resume.
- Constructed `skills.NewMCPResolver(cfg.Skills, logger)` and `skills.NewHookRunner(logger)` in daemon boot when skills are enabled, and passed them into the session manager and notifier fanout.
- Reworked `internal/daemon/notifier.go` so built-in notifiers run first, daemon-native post-stop callbacks run next, and a dedicated `skillsHookDispatcher` resolves the workspace and dispatches `HookRunner` hooks last.
- Added session tests covering skill MCP merge precedence, resume-time MCP injection, and marketplace consent blocking.
- Added daemon unit/integration tests covering notifier ordering, workspace resolution for hook lookup/payloads, create/stop hook subprocess execution, hook failure fail-open behavior, and boot-time dependency injection.
- Ran `go test ./internal/session ./internal/daemon -count=1`, `go test -tags integration ./internal/daemon -count=1`, `go test ./internal/session ./internal/daemon -cover -count=1` (`82.5%` session, `82.9%` daemon), `make verify`, and `git diff --check` successfully.
- Updated workflow memory and task tracking locally for task_09 completion.

Now:

- Preparing the final code-only commit and handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/session/manager.go`, `internal/session/manager_lifecycle.go`, `internal/session/interfaces.go`, `internal/daemon/boot.go`, `internal/daemon/daemon.go`, `internal/daemon/notifier.go`, `internal/session/manager_test.go`, `internal/daemon/daemon_test.go`, workflow memory/task tracking files.
- Commands: `sed -n`, `rg -n`, later targeted `go test` and `make verify`.
