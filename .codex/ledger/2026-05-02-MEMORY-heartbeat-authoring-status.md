Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_08.md`: transport-agnostic managed `HEARTBEAT.md` authoring/status services for validate/write/delete/history/rollback/status with CAS, revision persistence, session-health composition, no wake/session/task/lease side effects, required tests, clean `make verify`, tracking updates, and one local commit.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code/docs in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read workflow memory, PRD specs, `_techspec.md`, `_techspec_heartbeat.md`, ADR-007 through ADR-011, root/internal guidance before code edits.
- Must follow `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, and no-workaround discipline.
- Do not run destructive git commands.
- Automatic local commit is enabled only after clean verification, self-review, memory/tracking updates.
- Keep tracking-only `.compozy/tasks/*`, workflow memory, and ledger files out of the code commit unless repo requirements force staging.

Key decisions:

- Added `heartbeat.AuthoringService` / `ManagedHeartbeatAuthoringService` for validate/write/delete/history/rollback and `heartbeat.StatusService` / `ManagedHeartbeatStatusService` for policy/status/session-health composition.
- Mutation CAS uses `ExpectedDigest` request fields; existing files reject blank/stale digests before validation/write/delete/rollback persistence.
- Successful write/rollback persist snapshots and append revisions; delete appends a revision and leaves immutable snapshots untouched.
- Rollback by `RevisionID` uses revision body; rollback by `TargetDigest` reconstructs canonical source from snapshot frontmatter/body before validation.
- GlobalDB Heartbeat revision scan now preserves body text so rollback does not silently trim authored source.

State:

- Implementation, focused tests, full `make verify`, self-review, memory updates, tracking updates, commit, and post-commit verification are complete.

Done:

- Created session ledger.
- Read required workflow skills, workflow memory files, adjacent task ledgers for task 05/06/07 handoff context, root/internal guidance excerpts, Go/test/no-workaround skills, and associated skill references.
- Added `internal/heartbeat/authoring.go`, `internal/heartbeat/status.go`, and `internal/heartbeat/authoring_status_test.go`.
- Updated `internal/store/globaldb/global_db_heartbeat.go` to preserve revision body text.
- Focused verification passed: `go test ./internal/heartbeat -run 'TestManagedHeartbeat' -count=1`; `go test ./internal/heartbeat ./internal/store/globaldb ./internal/session -run 'TestManagedHeartbeat|TestHeartbeat|TestGlobalDBHeartbeat|TestSessionHealth' -count=1`; `go test ./internal/heartbeat ./internal/store/globaldb -count=1`; `go test ./internal/heartbeat -cover -count=1` => 80.3%.
- Additional verification passed: `go test -race ./internal/heartbeat ./internal/store/globaldb -run 'TestManagedHeartbeat|TestGlobalDBHeartbeat' -count=1`; `make lint` => `0 issues.`; `go test ./internal/heartbeat -cover -count=1` => 80.2%; `make verify` => passed with Bun tests 262 files / 1868 tests, Go gate 7621 tests, and `OK: all package boundaries respected`.
- Self-review passed: `git diff --check -- internal/heartbeat/authoring.go internal/heartbeat/status.go internal/heartbeat/authoring_status_test.go internal/store/globaldb/global_db_heartbeat.go` produced no output.
- Updated task tracking: `.compozy/tasks/agent-soul/task_08.md` and `_tasks.md`.
- Created local commit `8902909f` (`feat: add managed heartbeat authoring services`) with code changes only.
- Post-commit verification passed: `make verify` => Bun tests 262 files / 1868 tests, Go gate 7621 tests, `OK: all package boundaries respected`.

Now:

- Prepare final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-heartbeat-authoring-status.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_08.md`
- Task files: `.compozy/tasks/agent-soul/task_08.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Production/test files: `internal/heartbeat/authoring.go`, `internal/heartbeat/status.go`, `internal/heartbeat/authoring_status_test.go`, `internal/store/globaldb/global_db_heartbeat.go`
