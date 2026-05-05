Goal (incl. success criteria):

- Complete e2e `task_02` by adding a test-only `internal/testutil/acpmock/` package plus driver fixtures that let the real daemon launch one or more deterministic mock ACP agents through normal config/provider resolution, while supporting runtime scenario primitives (permissions, tool calls, inbound network turns, bridge content, environment expectations), unit/integration coverage, task tracking updates, and a clean `make verify`.

Constraints/Assumptions:

- Must follow repository `AGENTS.md`/`CLAUDE.md`, workflow-memory instructions, `task_02.md`, `_techspec.md`, `_tasks.md`, and ADR-001/ADR-004.
- Required skills loaded: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`; `brainstorming` reviewed but skipped because the PRD/techspec already define the approved design.
- Keep scope tight to task_02 and avoid disturbing unrelated tracking/memory files already present in the worktree.
- Current worktree already contains user/task-tracking changes in `.compozy/tasks/e2e/{task_01.md,_tasks.md}` and untracked `.compozy/tasks/e2e/_meta.md` plus workflow memory files.

Key decisions:

- Reuse the subprocess-backed runtime harness from task_01 and register fixture-backed mock agents before daemon boot instead of inventing a second daemon startup path.
- Keep the ACP mock layer narrow: deterministic ACP session behavior and diagnostics live in `internal/testutil/acpmock`, while config resolution, daemon boot, permission approval, and runtime assertions stay on real product surfaces.
- Cover daemon-launch compatibility and multi-agent isolation through tagged daemon integration tests, and cover network-origin environment expectations at the direct ACP/client seam after the daemon terminal path returned `signal: killed` for that scenario.

State:

- Completed.

Done:

- Read required skill files, repository guidance, workflow memory, task spec, `_tasks.md`, `_techspec.md`, ADR-001, ADR-004, and the related `2026-04-16-MEMORY-e2e-harness.md`.
- Added `internal/testutil/acpmock/` with multi-agent fixture parsing/validation, diagnostics parsing, temporary `AGENT.md` registration, deterministic Node ACP driver, and fixture testdata/goldens.
- Extended `internal/testutil/e2e/` with pre-boot mock-agent registration, permission-approval HTTP helpers, SSE callbacks, and artifact capture for mock-agent diagnostics.
- Added daemon integration coverage for fixture-backed launch compatibility, multi-agent isolation, and tool/permission event surfacing, plus ACP-level coverage for network-origin environment execution expectations.
- Updated workflow memory and task tracking for task_02 completion, leaving tracking/memory edits intentionally unstaged.
- Created the scoped local commit `f3c553ac` (`test: add fixture-backed ACP mock agents`).
- Re-ran `make verify` on `HEAD` after the commit; it passed cleanly.

Now:

- None.

Next:

- Optionally delete this ledger after handoff.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `.compozy/tasks/e2e/{task_02.md,_tasks.md}`, `.compozy/tasks/e2e/memory/{MEMORY.md,task_02.md}`, `internal/testutil/acpmock/*`, `internal/testutil/e2e/{runtime_harness.go,mock_agents.go,mock_agents_test.go}`, `internal/daemon/daemon_mock_agents_integration_test.go`.
- Commands: `make verify`, `go test ./internal/testutil/acpmock -cover -count=1`, `go test -tags integration ./internal/daemon -run 'TestDaemonE2E(FixtureBackedMockAgentLaunchesThroughNormalAgentDefinition|MockAgentsRemainIsolated|ToolPermissionFixtureEventsSurface)' -count=1`, `git diff --check`, `git commit -m "test: add fixture-backed ACP mock agents"`.
