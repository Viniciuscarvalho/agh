Goal (incl. success criteria):

- Implement task 03 for session resilience: propagate session-level `StopReason` and `StopDetail` through global DB persistence, query mapping, API payloads, observer updates, and required tests.
- Success requires global DB storage/query support, API/session responses exposing stop fields, observer propagation, updated task/workflow memory, and clean verification with `make verify`.

Constraints/Assumptions:

- Source of truth is task 03, `.compozy/tasks/session-resilience/_techspec.md`, `.compozy/tasks/session-resilience/_tasks.md`, and ADR-001.
- Scope stays limited to task 03 surfaces; resume repair and any broader lifecycle changes remain out of scope for task 04.
- Worktree already has unrelated tracking/memory edits; do not touch unrelated files.
- Workflow memory must be read before edits and updated before tracking status/commit.

Key decisions:

- `store.SessionInfo` carries value-form stop fields for read paths, while `store.SessionStateUpdate.StopReason` is optional so stop columns only change on explicit stop updates.
- Existing current-schema databases gain `stop_reason` / `stop_detail` via `ALTER TABLE`, while legacy workspace migrations create the new columns directly in `sessions_new`.
- `contract.SessionPayload.StopReason` is documented and treated as session-level metadata, distinct from ACP event-level `AgentEventPayload.StopReason`.

State:

- Completed. The scoped code/test commit is recorded as `979b76c` and tracking artifacts remain intentionally unstaged.

Done:

- Read AGENTS/CLAUDE guidance, required skill docs, workflow memory, task 03 spec, techspec, `_tasks.md`, ADR-001, and current worktree status.
- Identified that task 02 already persists stop fields into `SessionMeta`/in-memory session state, so task 03 should focus on data-layer propagation only.
- Added stop fields to the global session schema, migration path, store types, register/update/reconcile/list scan logic, observer/reconcile writes, and session API payload conversion.
- Added store/query/API/reconcile tests plus an HTTP integration test proving stopped sessions expose `stop_reason` through SQLite and `/api/sessions` / `/api/sessions/:id`.
- Verified with targeted unit tests, targeted integration tests, coverage runs, and `make verify`.
- Created the scoped local commit `979b76c feat: propagate session stop metadata` without staging tracking-only `.compozy` artifacts.
- Re-ran the explicit task integration and coverage checks after commit: HTTP stop-reason propagation test passed, `internal/store/globaldb` 80.6%, `internal/session` 82.3%, `internal/observe` 81.6%, and combined `internal/api/core` coverage 83.3% via `-coverpkg`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/session-resilience/task_03.md`
- `.compozy/tasks/session-resilience/_techspec.md`
- `.compozy/tasks/session-resilience/adrs/adr-001.md`
- `.compozy/tasks/session-resilience/memory/MEMORY.md`
- `.compozy/tasks/session-resilience/memory/task_03.md`
- `.codex/ledger/2026-04-09-MEMORY-data-layer-propagation.md`
- `internal/store/globaldb/*.go`
- `internal/observe/*.go`
- `internal/api/contract/*.go`
- `internal/api/core/*.go`
- `internal/api/httpapi/httpapi_integration_test.go`
