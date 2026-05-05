Goal (incl. success criteria):

- Complete task 06 by splitting persistence into `internal/store/sessiondb` and `internal/store/globaldb`, leaving `internal/store` as shared types, validation, and narrow interfaces/helpers.
- Success criteria: runtime consumers use the new package ownership, no transitional bridges remain, real SQLite tests cover the split, and both `make verify` and `make test-integration` pass.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, task 06 spec, `_techspec.md`, `_tasks.md`, ADR-001, ADR-003, ADR-004, and workflow memory files.
- Must use `cy-workflow-memory` before editing and before completion, and `cy-final-verify` before any completion claim or commit.
- Auto-commit is enabled only after clean verification, self-review, memory updates, and tracking updates.
- Keep scope tight to task 06; record follow-up instead of expanding scope.

Key decisions:

- Use `internal/store/sessiondb` for per-session SQLite ownership and `internal/store/globaldb` for global SQLite ownership, with no compatibility layer left behind at phase end.

State:

- Implementation, verification, and task closeout are complete; final step is local commit creation.

Done:

- Read AGENTS/CLAUDE guidance, task 06 spec, `_techspec.md`, `_tasks.md`, workflow memory, and ADR-001/003/004.
- Scanned cross-agent ledgers relevant to the refac-v2 and API reroot work.
- Confirmed `internal/store` is still monolithic and runtime consumers currently open `store.OpenSessionDB` / `store.OpenGlobalDB`.
- Moved session persistence into `internal/store/sessiondb` and global persistence into `internal/store/globaldb`.
- Narrowed `internal/store` to shared types, validation, metadata, SQL helpers, schema execution, and SQLite helper utilities.
- Updated runtime consumers and tests to import the new persistence packages directly.
- Added focused helper/lifecycle coverage tests so the touched persistence packages meet the task's `>=80%` coverage target.
- Verified final tree with fresh `make verify`, `make test-integration`, and direct package coverage runs.

Now:

- Update tracking files and create the required local commit.

Next:

- Hand off the completed task state with the verification evidence and commit hash.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-07-MEMORY-store-persistence-split.md`
- `.compozy/tasks/refac-v2/task_06.md`
- `.compozy/tasks/refac-v2/_techspec.md`
- `.compozy/tasks/refac-v2/_tasks.md`
- `.compozy/tasks/refac-v2/adrs/adr-001.md`
- `.compozy/tasks/refac-v2/adrs/adr-003.md`
- `.compozy/tasks/refac-v2/adrs/adr-004.md`
- `.compozy/tasks/refac-v2/memory/MEMORY.md`
- `.compozy/tasks/refac-v2/memory/task_06.md`
- `make verify`
- `make test-integration`
- `go test -cover ./internal/store ./internal/store/sessiondb ./internal/store/globaldb ./internal/session ./internal/observe ./internal/daemon ./internal/cli ./internal/workspace -count=1`
