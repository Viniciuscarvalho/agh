Goal (incl. success criteria):

- Implement task 02 for session resilience: deterministic stop classification in `internal/session`, explicit stop-cause propagation for user stop, process exit, and daemon shutdown, plus tests and clean verification.
- Success requires classified `StopReason` in `meta.json`, `SessionInfo`, and `session_stopped` event payloads for the task-defined stop scenarios.

Constraints/Assumptions:

- Must follow task 02, `_techspec.md`, `_tasks.md`, and ADR-001 as source of truth.
- Scope stays in session/daemon stop lifecycle plus required tests; data-layer propagation to global DB/API is task 03.
- Worktree already contains unrelated tracking edits; do not touch unrelated files.
- `make verify` must pass before completion; auto-commit is enabled only after clean verification, self-review, memory/tracking updates.

Key decisions:

- Keep `Manager.Stop()` as the user-facing path and add a cause-aware manager method for non-user callers instead of pushing stop cause through context inference.
- Have `handleProcessExit()` set a cause only when no explicit stop cause is already present, so shutdown/user-requested stops are not overwritten by watcher races.
- Classify once in `finalizeStopped()` before recording the `session_stopped` event, then persist stop fields to meta.

State:

- Final verification passed; pending task-scoped staging and local commit.

Done:

- Read AGENTS/CLAUDE guidance, task docs, tech spec, ADR-001, workflow memory, and relevant code/test surfaces.
- Reconciled the current worktree and identified the pre-change gap: no stop classification, no explicit cause propagation, no shutdown-specific stop path.
- Implemented explicit stop-cause propagation and deterministic stop classification across session and daemon lifecycle code.
- Added unit and integration coverage for user stop, crash, shutdown, and event payload persistence.
- Verified with `go test ./internal/session ./internal/daemon`, `go test -tags integration ./internal/session ./internal/daemon -run 'TestManagerIntegrationStopFinalizesWrappedACPProcess|TestManagerIntegrationKillProcessPersistsAgentCrashedStopReason|TestShutdownPersistsShutdownStopReason'`, `go test ./internal/session -cover`, and `make verify`.

Now:

- Stage only task-relevant files, create the local commit, and report completion with verification evidence.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `internal/session/manager_lifecycle.go`
- `internal/session/session.go`
- `internal/session/stop_cause.go`
- `internal/daemon/daemon.go`
- `internal/session/*test.go`
- `internal/daemon/*test.go`
