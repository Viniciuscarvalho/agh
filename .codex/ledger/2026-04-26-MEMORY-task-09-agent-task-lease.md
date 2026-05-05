Goal (incl. success criteria):

- Implement Task 09: agent task lease UDS API and CLI verbs for next, heartbeat, complete, fail, and release; preserve operator task flows; verify with required tests and `make verify`; update task tracking and create one local commit after clean verification.

Constraints/Assumptions:

- Must use workflow memory files under `.compozy/tasks/autonomous/memory/`.
- Must read PRD docs, `_techspec.md`, `_tasks.md`, and ADR-002/003/010/011/012 before code edits.
- Must not expose raw claim tokens except immediate claim response and command inputs.
- Must not run destructive git commands without explicit permission.
- Automatic commit is enabled only after clean verification, self-review, memory/tracking updates.

Key decisions:

- Reuse existing Task 02 contract DTOs and OpenAPI entries; avoid public contract/codegen changes unless implementation exposes a DTO gap.
- Add UDS claim-next no-work as HTTP 204 and map CLI no-work to stable JSON `{ "claimed": false }`.
- Use Task 05 caller identity for session/workspace/agent inference and Task 08 service methods for all claim/lease mutations.
- Defensively redact `agh_claim_*` raw tokens at shared API/CLI error boundaries; reject raw `claim_token` fields from lease complete/fail result metadata in task-domain validation.

State:

- Implementation, verification, self-review, tracking updates, and scoped local commit complete.

Done:

- Read required skill instructions for `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Read shared workflow memory and current task memory.
- Read root AGENTS/CLAUDE, Task 09, `_techspec.md`, `_tasks.md`, and ADR-002/003/010/011/012.
- Scanned adjacent ledgers for Task 02, Task 05, Task 06, and Task 08 handoffs.
- Confirmed contract DTOs/OpenAPI entries and Task 08 service methods already exist.
- Updated Task 09 workflow memory before code edits.
- Added agent task UDS handlers/routes and CLI verbs for next, heartbeat, complete, fail, and release.
- Added raw claim token redaction at API/CLI error boundaries and domain validation rejecting raw `claim_token` result metadata.
- Fixed workspace queued-run persistence so network-channel-bound runs also persist `coordination_channel_id`.
- Added UDS, CLI, task-domain, store, and integration tests including restart/reconnect and stale-token-after-recovery coverage.
- Ran focused tests and fresh `make verify`; all passed.
- Updated Task 09 tracking and workflow memory.
- Created local commit `bab2545f feat: add agent task lease verbs` with only code/test files staged.

Now:

- Ready to report completion.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `internal/api/core/agent_tasks.go`
- `internal/api/core/errors.go`
- `internal/api/udsapi/routes.go`
- `internal/api/udsapi/agent_tasks_test.go`
- `internal/api/udsapi/handlers_test.go`
- `internal/cli/client.go`
- `internal/cli/client_test.go`
- `internal/cli/task.go`
- `internal/cli/task_test.go`
- `internal/cli/helpers_test.go`
- `internal/cli/agent_kernel_test.go`
- `internal/cli/cli_integration_test.go`
- `internal/store/globaldb/global_db_task_aux.go`
- `internal/store/globaldb/global_db_task_claim_test.go`
- `internal/task/lease.go`
- `internal/task/validate.go`
- `internal/task/lease_test.go`
- `internal/task/validate_test.go`
- `internal/task/manager.go`
- `internal/task/manager_test.go`
- `.compozy/tasks/autonomous/task_09.md`
- `.compozy/tasks/autonomous/_tasks.md`
- `.compozy/tasks/autonomous/memory/task_09.md`
- `.compozy/tasks/autonomous/memory/MEMORY.md`
- `go test ./internal/task ./internal/store/globaldb ./internal/api/core ./internal/api/udsapi ./internal/cli -count=1`
- `go test -tags integration ./internal/cli -run TestCLIAgentTaskLeaseLifecycleIntegration -count=1`
- `make verify`
