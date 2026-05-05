Goal (incl. success criteria):

- Implement Task 03 "Managed Soul Authoring Service" for `.compozy/tasks/agent-soul`: transport-agnostic internal service for validated, atomic, CAS-protected SOUL.md mutations with revision persistence and tests.

Constraints/Assumptions:

- Follow AGENTS.md: no destructive git commands; `make verify` before completion/commit; conversations in BR-PT, artifacts in English.
- Required skills active for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`.
- Must read workflow memory, PRD techspecs, ADR-006, `CLAUDE.md`, and `internal/CLAUDE.md` before code edits.

Key decisions:

- Implement the service inside `internal/soul` and depend on the existing resolver/parser plus the `globaldb` Soul store methods from task 02.
- Keep transport surfaces out of scope for task 03; service request models must be ready for later CLI/HTTP/UDS/Host API adapters.
- Treat current `.compozy/tasks/agent-soul/*` tracking/memory changes as pre-existing workspace state except for task_03 updates required by this run.

State:

- Managed authoring implementation is committed locally and passed full post-commit verification.

Done:

- Created session ledger and began required context loading.
- Read workflow memory, task memory, repo guidance, internal Go guidance, task_03, master task list, ADR-006, and relevant techspec sections.
- Confirmed baseline: no existing `SoulAuthoringService` or implementation under `internal/soul`; store methods for snapshots/revisions exist from task 02.
- Implemented `internal/soul/authoring.go` with validate/put/delete/history/rollback, CAS, deterministic errors, managed path checks, atomic mutation, snapshots, and revision rows.
- Added `internal/fileutil.AtomicRemoveFile` plus focused tests in `internal/fileutil/atomic_remove_test.go`.
- Added `internal/soul/authoring_test.go` covering valid writes, CAS conflicts, invalid content, delete, rollback, missing revisions, path/symlink/missing-agent rejection, DB reopen history, and active session/task-run preservation.
- Focused checks passed: `go test ./internal/soul ./internal/fileutil ./internal/store/globaldb -count=1`; `go test -race ./internal/soul ./internal/fileutil ./internal/store/globaldb -count=1`; test convention script for new/touched tests; `internal/soul` coverage 80.5%.
- Fixed `make lint` findings by renaming the exported API to package-idiomatic names (`AuthoringService`, `PutRequest`, etc.) and splitting long helpers.
- Self-review against `_techspec_soul.md` found a missing immediate pre-mutation digest recheck; added `verifyUnchangedSoul` to put/delete/rollback.
- Full pre-commit gate passed after final code change: `make verify` exit 0, including 262 Bun test files / 1868 tests, 7458 Go tests, build, lint, and boundaries.
- Updated `.compozy/tasks/agent-soul/task_03.md`, `.compozy/tasks/agent-soul/_tasks.md`, and workflow memory.
- Created local commit `e881f7de feat: add managed soul authoring` with only code/test files.
- Full post-commit gate passed: `make verify` exit 0, including boundaries.

Now:

- Task complete; final response pending.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-authoring.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_03.md`
- Task files: `.compozy/tasks/agent-soul/task_03.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Implementation files: `internal/soul/authoring.go`, `internal/soul/authoring_test.go`, `internal/fileutil/atomic.go`, `internal/fileutil/atomic_remove_test.go`
- Commit: `e881f7de feat: add managed soul authoring`
