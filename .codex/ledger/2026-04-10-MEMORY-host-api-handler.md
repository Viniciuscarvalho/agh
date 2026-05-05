Goal (incl. success criteria):

- Complete ext-architecture task_07 by implementing the Host API handler for extension -> AGH JSON-RPC calls, with capability enforcement, per-extension rate limiting, unit/integration tests, workflow/task tracking updates, and one local commit after clean verification.
- Success means: `internal/extension/host_api.go` exists with all 12 required methods, typed JSON-RPC errors match `_protocol.md`, tests cover success/error paths at >=80% package coverage, `make verify` passes, and task/workflow tracking is updated correctly.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`; do not touch unrelated worktree changes except required workflow/task tracking files.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify` before any completion claim or commit.
- Source of truth is `.compozy/tasks/ext-architecture/task_07.md`, `_techspec.md`, `_protocol.md`, `_tasks.md`, ADR-003/004/005, and the provided workflow memory files.
- Task 06 already prepared transport routing in `internal/extension/manager.go`; task 08 will wire real dependencies at boot, so keep scope tight to the handler and any minimal supporting seams.
- Existing unrelated modifications are present under `.compozy/tasks/ext-architecture/` and `docs/ideas/anp/*`; leave them intact.

Key decisions:

- `HostAPIHandler` returns `*subprocess.RPCError` for protocol-aligned failures (`-32001`, `-32002`, `-32601`) so subprocess transport can forward Host API failures without an extra translation layer.
- `skills/list` uses an optional workspace resolver dependency because `skills.Registry.ForWorkspace` requires a resolved workspace snapshot.
- `memory/*` adapts the markdown-backed `memory.Store` into Host API-friendly key/content records by generating and parsing persisted memory documents instead of adding a new persistence API.
- `Manager.wrapHostHandler` injects the extension name into request context and converts manager-side capability denials to typed RPC errors before the handler runs.

State:

- Completed; implementation, verification, workflow/task tracking, and the local code commit are done.

Done:

- Read required skill docs, repository instructions, workflow memory, task_07, `_techspec.md`, `_tasks.md`, `_protocol.md`, ADRs, and related ledgers for protocol/capability/manager work.
- Confirmed baseline gap: `internal/extension/host_api.go` and `internal/extension/host_api_test.go` do not exist, and no `HostAPIHandler` type exists yet.
- Inspected current dependency surfaces in `internal/extension`, `internal/session`, `internal/memory`, `internal/observe`, `internal/skills`, `internal/subprocess`, and `internal/api/core` for reuse patterns.
- Implemented `internal/extension/host_api.go` with all 12 required Host API methods, capability enforcement, rate limiting, typed errors, and service delegation.
- Updated `internal/extension/manager.go` so wrapped Host API handlers preserve extension identity and emit typed capability denials.
- Added `internal/extension/host_api_test.go` and `internal/extension/host_api_integration_test.go`; verified `go test ./internal/extension -count=1`, `go test -tags integration ./internal/extension -count=1`, `go test ./internal/extension -cover` (`80.2%`), and `make verify`.
- Created local commit `2792c5b` (`feat: add extension host api handler`) containing only the Host API code and tests.

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-host-api-handler.md`
- `.compozy/tasks/ext-architecture/task_07.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_protocol.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_07.md`
- `internal/extension/capability.go`
- `internal/extension/manager.go`
- `internal/extension/host_api.go`
- `internal/extension/host_api_test.go`
- `internal/extension/host_api_integration_test.go`
- `internal/session/*`
- `internal/memory/*`
- `internal/observe/*`
- `internal/skills/*`
- `internal/subprocess/transport.go`
- Commands: `sed`, `rg`, `git status`, `date`
