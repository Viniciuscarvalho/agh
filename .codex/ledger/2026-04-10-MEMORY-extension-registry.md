Goal (incl. success criteria):

- Complete ext-architecture task_05 by adding a SQLite-backed extension registry with durable install state, checksum verification, typed errors, unit/integration tests, tracking updates, and one local commit after clean verification.
- Success means: `internal/extension/registry.go` exists, global schema includes `extensions`, tests cover CRUD + checksum + JSON round-trips at >=80% package coverage, `make verify` passes, and task/workflow tracking is updated correctly.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`; do not touch unrelated worktree changes except required workflow/task tracking files.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, and the project-mandated brainstorming/design pass.
- Source of truth is `.compozy/tasks/ext-architecture/task_05.md`, `_techspec.md`, `_tasks.md`, ADR-005, and the provided workflow memory files.
- Current workspace already contains unrelated modifications under `.compozy/tasks/ext-architecture/task_01.md` through `task_04.md`, `_tasks.md`, and `docs/ideas/anp/*`; leave them intact.

Key decisions:

- Registry will remain a thin `*sql.DB` adapter under `internal/extension`; schema ownership stays in `internal/store/globaldb`.
- Checksum verification will hash the installed extension directory artifact (matching the task_09 install flow and the deterministic directory-hash pattern in `internal/skills/provenance.go`) while persisting the resolved manifest file path separately.

State:

- Verification complete; tracking and commit closeout in progress.

Done:

- Read required skill docs, workflow memory, task_05, `_techspec.md`, `_tasks.md`, ADR-005, and relevant ledgers from prior extension tasks.
- Reconciled the workspace state and confirmed the baseline gap: `internal/extension/registry.go` and the `extensions` table do not exist yet.
- Added the `extensions` table to `internal/store/globaldb/global_db.go` and extended global DB tests to assert table creation, expected columns, and idempotent reopen behavior.
- Added `internal/extension/registry.go` with typed registry errors, `ExtensionInfo`, CRUD methods, source serialization, manifest-path resolution, and deterministic directory checksum verification.
- Added unit tests for install/get/list/enable/disable/uninstall flows, duplicate handling, checksum mismatch, helper/error branches, and JSON round-trips.
- Added integration-tag tests for install/list/enable/disable/uninstall lifecycle and multi-source coexistence.
- Verified `go test ./internal/extension ./internal/store/globaldb -count=1`, `go test -tags integration ./internal/extension -count=1`, `go vet ./internal/extension ./internal/store/globaldb`, `go test ./internal/extension -coverprofile=/tmp/internal-extension-task05.cover.out -covermode=count -count=1` (`81.7%`), and `make verify`.

Now:

- Update task tracking, review staging scope, and create the local code-only commit.

Next:

- Re-run the final verification only if the commit step or staging review changes code.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-extension-registry.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_05.md`
- `.compozy/tasks/ext-architecture/task_05.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/adrs/adr-005.md`
- `internal/extension/capability.go`
- `internal/extension/registry.go`
- `internal/extension/registry_test.go`
- `internal/extension/registry_integration_test.go`
- `internal/store/globaldb/global_db.go`
- `internal/store/globaldb/global_db_test.go`
- Commands: `rg`, `sed`, `git status`, `go test`, `go vet`, `make verify`
