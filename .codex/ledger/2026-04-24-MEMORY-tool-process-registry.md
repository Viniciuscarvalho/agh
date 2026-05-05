Goal (incl. success criteria):

- Implement Hermes Task 06: shared `internal/toolruntime` process registry with durable checkpoint-on-write records, PID/start-time boot reconciliation, scoped interrupts, integration with subprocess owners, tests, impact assessment, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow root AGENTS/CLAUDE rules: no destructive git commands, `make verify` before completion, no web search for local code, no hand-edited dependencies, no legacy compatibility shims.
- Required skills loaded: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, `no-workarounds`, `systematic-debugging`.
- Workflow memory files read: Hermes shared `MEMORY.md` and task-local `task_06.md`.

Key decisions:

- Registry must live in a shared runtime package, not `session.Manager` or `environment.ToolHost`.
- Recovered processes must never be signaled by PID alone; ownership and process start-time evidence are required.

State:

- Implementation, docs impact, task tracking, workflow memory updates, final verification, and local commit are complete.

Done:

- Read root AGENTS/CLAUDE guidance, Hermes shared/task workflow memory, Task 06 spec, `_tasks.md`, `_techspec.md`, ADR-001, ADR-004, Task 01 spec/memory, and workspace status.
- Added `internal/toolruntime` registry/interrupt package, global DB `tool_processes` persistence, PID/start-time reconciliation, process-group helpers, and integrations across ACP, environment providers, hooks, extensions, subprocess helpers, sessions, and daemon boot.
- Added focused tests for registry lifecycle/safety, global DB persistence, ACP terminal tracking/scoped interrupt, hook subprocess tracking, extension launch config propagation, and session cancel scoped interrupt routing.
- Updated `packages/site` runtime operations docs, corrected the new `tool_processes` inspection query, and updated Task 10 QA scope for process registry restart/stale PID coverage.
- Marked Task 06 completed in task tracking and updated task/shared Hermes workflow memory.
- Final `make verify` passed after all implementation/docs edits: web format/lint/typecheck/tests/build, Go lint, 5820 Go tests, and package boundary checks.
- Created local commit `0f3e1893 feat: add tool process registry`.

Now:

- Final response.

Next:

- No Task 06 implementation work remains in this turn.

Open questions (UNCONFIRMED if needed):

- None blocking.

Working set (files/ids/commands):

- Task files: `.compozy/tasks/hermes/task_06.md`, `_tasks.md`, `_techspec.md`, `adrs/adr-001...`, `adrs/adr-004...`, memory files.
- Targeted verification passed: `go test ./internal/toolruntime ./internal/procutil ./internal/subprocess ./internal/acp ./internal/hooks ./internal/extension ./internal/environment/local ./internal/environment/daytona ./internal/session ./internal/daemon ./internal/store/globaldb`.
- Final verification passed: `make verify`.
- Commit: `0f3e1893 feat: add tool process registry`.
