Goal (incl. success criteria):

- Implement Task 14: workspace-scoped coordinator bootstrap and restricted orchestration for executable task runs.
- Success requires coordinator config precedence, run-bound channel requirement, singleton bootstrap, restricted permissions, crash/stop recovery, tests, make verify, tracking updates, and one local commit after clean verification.

Constraints/Assumptions:

- Must not run destructive git commands without explicit user permission.
- Must use workflow memory files under `.compozy/tasks/autonomous/memory/`.
- Must use `cy-execute-task` workflow and `cy-final-verify` before completion/commit.
- Coordinator is a managed session, not an in-process AI loop.
- Coordinator auto-spawns only for workspace-scoped executable work with a stable `coordination_channel_id`; global-scope runs do not auto-spawn in MVP.
- Scheduler remains mechanical and must not claim work.

Key decisions:

- Implement coordinator bootstrap in daemon/runtime boundaries while using existing task enqueue hooks, session lineage, safe spawn, task APIs, channel APIs, and situation context surfaces.
- Keep task ownership through task APIs; use run channels only for operational conversation.
- Treat current dirty PRD/tracking/workflow files as pre-existing unless explicitly edited for this task.

State:

- Implementation complete and committed as `c359fd4f feat: add coordinator bootstrap runtime`.
- Required repo docs, PRD, ADR-004/005/006/009/010/011/012, workflow memory, and relevant prior task ledgers have been read.

Done:

- Loaded required skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, plus Go/testing/debugging skills required by AGENTS.
- Confirmed Tasks 01-13 provide config, situation, agent task/channel, execution boundary, scheduler, lineage, and safe spawn foundations.
- Added `internal/coordinator` decision/policy/prompt helpers.
- Added daemon coordinator runtime wired to `task.run.enqueued`, boot recovery, lifecycle stop recovery, coordinator hooks, workspace singleton checks, and managed coordinator session creation.
- Added hook observer fanout for task-run enqueue events.
- Added unit and integration coverage for config precedence, enqueue-only bootstrap, singleton concurrency, missing-channel/global-scope skips, restricted policy, hook denial, manual coexistence, and restart recovery.
- Fixed self-review issue where real hook-level pre-spawn denies returned an error and should still be recorded as denied rather than failed.
- Final verification passed after implementation and again after commit:
  - `go test ./internal/coordinator -cover` -> 86.7%.
  - `go test ./internal/coordinator ./internal/daemon`.
  - `go test -tags integration ./internal/daemon -run 'TestCoordinator'`.
  - `make verify` -> exit 0, 6,280 tests, package boundaries OK.
- Task tracking and workflow memory were updated but intentionally left out of the automatic code commit.

Now:

- Ready for final handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None blocking.

Working set (files/ids/commands):

- Code/test surfaces: `internal/coordinator/*`, `internal/daemon/coordinator_runtime*.go`, `internal/daemon/boot.go`, `internal/daemon/hooks_bridge.go`, `internal/daemon/coordinator_config_test.go`.
- Workflow memory: `.compozy/tasks/autonomous/memory/MEMORY.md`, `.compozy/tasks/autonomous/memory/task_14.md`.
- Tracking files to update: `.compozy/tasks/autonomous/task_14.md`, `.compozy/tasks/autonomous/_tasks.md`.
- Remaining dirty files are PRD/tracking/memory artifacts that were not staged for the automatic code commit.
