Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_02.md`: durable storage for resolved Soul snapshots and managed authoring revisions.
- Success means global DB migration v12 creates Soul snapshot/revision tables and session provenance columns; store methods cover insert/read/list/history/rollback lookup; tests cover fresh DB, reopen, constraints, cascade, failed migration behavior, resolver persistence, and Heartbeat v13 reservation; `make verify` passes before completion/commit.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code/docs in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read workflow memory, PRD specs, ADR-001..ADR-011, root/internal guidance before code edits.
- Do not run destructive git commands.
- Automatic local commit is enabled only after clean verification, self-review, memory/tracking updates.
- Keep tracking-only `.compozy/tasks/*` and memory files out of the automatic commit unless repository requirements force staging.

Key decisions:

- Treat `_techspec_soul.md` as the normative field-level DDL for task 02.
- Preserve the exact v12 side-table shape for `agent_soul_snapshots`, `agent_soul_revisions`, and `sessions` Soul provenance columns.
- Persist non-index-authority read-model details, compact projection, config provenance, validation state, and redacted diagnostics inside the snapshot `profile_json` envelope while keeping deterministic lookup fields as typed columns.
- Keep Heartbeat migration v13 reserved for task_06; task 02 must not add Heartbeat tables.

State:

- Soul v12 implementation is complete, locally committed as `538955da feat: persist soul snapshots`, and post-commit verified.

Done:

- Read workflow memory and relevant adjacent ledgers.
- Confirmed task 01 resolver foundation exists and was committed as `cd68c9ca`.
- Loaded required workflow, migration, Go, and test guidance before edits.
- Captured baseline: no existing Soul storage symbols, no migration v12/v13 symbols under `internal/store` or `internal/soul`.
- Added `internal/soul` persistence types for snapshots, authoring revisions, config provenance, and resolver-to-snapshot JSON envelopes.
- Added global DB migration v12 `add_agent_soul_snapshots` with `agent_soul_snapshots`, `agent_soul_revisions`, and session Soul provenance columns.
- Added global DB store methods for snapshot upsert/get/find/list, revision append/get/list/rollback lookup, and session Soul provenance updates.
- Added focused tests for fresh DB schema, migration rollback, resolver persistence, idempotent snapshot reuse, constraints, cascade, revision history, rollback lookup, and reopen/session provenance.
- Focused tests pass: `go test ./internal/soul ./internal/store/globaldb -count=1`.
- AGH test convention script passes for new `global_db_soul_test.go` and touched `global_db_session_test.go`; legacy `global_db_test.go` still fails whole-file convention heuristics from pre-existing tests.
- Focused race tests pass: `go test -race ./internal/soul ./internal/store/globaldb -count=1`.
- Coverage evidence: `internal/soul` 85.4%; `internal/store/globaldb` 77.9% whole-package because of unrelated older package surfaces.
- `make lint` passes with 0 issues.
- Pre-commit `make verify` passed at 2026-05-02 02:52:19 -03 with `DONE 7440 tests` and `OK: all package boundaries respected`.
- Updated task_02 status/checklists, `_tasks.md`, task memory, and shared workflow memory.
- Re-ran fresh pre-commit `make verify` after staging; it passed with `DONE 7440 tests`, `0 issues`, and `OK: all package boundaries respected`.
- Staged only implementation/test files under `internal/soul`, `internal/store/globaldb`, and `internal/store/types.go`.
- Created local commit `538955da feat: persist soul snapshots`.
- Post-commit `make verify` passed with `DONE 7440 tests`, `0 issues`, and `OK: all package boundaries respected`.

Now:

- Final response.

Next:

- None for this task.

Open questions (UNCONFIRMED if needed):

- None blocking. The task text names a few fields not present as columns in `_techspec_soul.md`; decision is to follow the exact DDL and store those non-query-authority fields in the JSON envelope.

Working set (files/ids/commands):

- `.compozy/tasks/agent-soul/memory/MEMORY.md`
- `.compozy/tasks/agent-soul/memory/task_02.md`
- `.compozy/tasks/agent-soul/_techspec.md`
- `.compozy/tasks/agent-soul/_techspec_soul.md`
- `.compozy/tasks/agent-soul/_techspec_heartbeat.md`
- `.compozy/tasks/agent-soul/task_02.md`
- `internal/soul/`
- `internal/store/globaldb/`
- `internal/store/types.go`
