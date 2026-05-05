Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_06.md`: durable Heartbeat snapshots/revisions, metadata-only session health, wake state, and wake event audit storage.
- Success means migration v13 is registered after Soul v12; global DB store methods cover snapshots, revisions, session health, wake state/events, stale/restart/retention paths; tests cover fresh DB, reopen, constraints, retention, no queue semantics, and unchanged task-run/network storage; `make verify` passes before completion/commit.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code/docs in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read workflow memory, PRD specs, `_techspec.md`, `_techspec_soul.md`, `_techspec_heartbeat.md`, ADR-007 through ADR-011, root/internal guidance before code edits.
- Must follow `agh-schema-migration`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, and `testing-anti-patterns`.
- Do not run destructive git commands.
- Automatic local commit is enabled only after clean verification, self-review, memory/tracking updates.
- Keep tracking-only `.compozy/tasks/*`, workflow memory, and ledger files out of the code commit unless repo requirements force staging.

Key decisions:

- Follow `_techspec_heartbeat.md` v13 DDL and Soul storage conventions: domain persistence types in `internal/heartbeat`, migration/store methods in `internal/store/globaldb`.
- Keep session health metadata-only and independent from authored `HEARTBEAT.md`; no task-run lease/claim owner/claim token/queue columns for Heartbeat.
- Use closed enum validation for wake source/result/reason and explicit `expires_at` retention cleanup for wake events.

State:

- Implementation, focused checks, task tracking, memory updates, local code commit, and post-commit full verification are complete; final response pending.

Done:

- Created this session ledger.
- Read shared workflow memory and task_06 workflow memory.
- Scanned adjacent agent-soul/heartbeat ledgers for cross-agent awareness.
- Loaded required workflow, migration, Go, and test skill instructions.
- Read root/internal guidance, aggregate/Soul/Heartbeat TechSpecs, ADR-007 through ADR-011, task_06, `_tasks.md`, and queue/migration lessons.
- Captured baseline with focused `go test ./internal/store/globaldb -run 'TestGlobalDBSoulMigration/...|TestOpenGlobalDBRecordsSchemaMigrationAndRepeatedBootIsIdempotent' -count=1`: passes with migration count 12 and no Heartbeat tables.
- Added `internal/heartbeat` persistence types for Heartbeat snapshots, authoring revisions, session health, wake state, wake events, closed enums, validation, snapshot envelopes, and resolver-to-snapshot conversion.
- Added global DB migration v13 `add_agent_heartbeat_storage` after Soul v12.
- Added GlobalDB store methods for Heartbeat snapshots/revisions, session health stale/recovery paths, wake state/events, and wake event retention sweeping.
- Compile smoke passed: `go test ./internal/heartbeat ./internal/store/globaldb -run TestDoesNotExist -count=1`.
- Added tests for v13 migration shape/order, failed migration rollback/no success marker, resolver snapshot persistence, reopen persistence, revision history/rollback lookup, session health stale/recovery/cascade, wake state/events/closed reason constraints/retention/cascade, generated defaults, typed errors, and no queue/task-run/network column leakage.
- Focused checks pass: `go test ./internal/heartbeat ./internal/store/globaldb -count=1`, `go test -race ./internal/heartbeat ./internal/store/globaldb -count=1`, focused `golangci-lint`, and AGH test convention helper for the two new test files.
- Coverage evidence: `internal/heartbeat` 80.1%; `internal/store/globaldb/global_db_heartbeat.go` 80.0%; `migrate_heartbeat.go` 100%. Whole `internal/store/globaldb` package reports 78.1% due existing unrelated same-package surfaces.
- Full pre-tracking `make verify` passed with `DONE 7572 tests` and package boundaries OK.
- Updated `.compozy/tasks/agent-soul/task_06.md` and `_tasks.md` to completed, and updated task workflow memory.
- Fresh post-tracking `make verify` passed with `DONE 7572 tests` and package boundaries OK.
- Created local commit `8096a2fc feat: persist heartbeat storage` with only code/test files staged.
- Promoted durable task 06 handoff context into shared workflow memory.
- Post-commit `make verify` passed with `DONE 7572 tests` and package boundaries OK.

Now:

- Prepare final response.

Next:

- Report final implementation, verification, commit, and remaining uncommitted tracking/workflow-memory state.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-task06.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_06.md`
- Task files: `.compozy/tasks/agent-soul/task_06.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Implementation files: `internal/heartbeat/persistence.go`, `internal/store/globaldb/global_db.go`, `internal/store/globaldb/migrate_heartbeat.go`, `internal/store/globaldb/global_db_heartbeat.go`
- Test files: `internal/heartbeat/persistence_test.go`, `internal/store/globaldb/global_db_heartbeat_test.go`, `internal/store/globaldb/global_db_test.go`, `internal/store/globaldb/global_db_soul_test.go`
- Commit: `8096a2fc feat: persist heartbeat storage`
