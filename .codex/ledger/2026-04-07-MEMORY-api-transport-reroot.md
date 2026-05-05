Goal (incl. success criteria):

- Complete task 05 by re-rooting HTTP transport, UDS transport, and shared API test utilities into `internal/api/httpapi`, `internal/api/udsapi`, and `internal/api/testutil`.
- Preserve public API behavior exactly: route paths, status codes, SSE behavior, and static HTTP behavior unchanged.
- Finish with `make verify` and `make test-integration` passing, no temporary bridge packages left, and tracking/memory updated.

Constraints/Assumptions:

- Must follow task_05, `_techspec.md`, `_tasks.md`, ADR-001, and ADR-004 as source of truth.
- Must use workflow memory files before editing and before completion.
- Must keep scope tight to this task and record follow-up instead of expanding scope.
- Auto-commit is enabled, but only after clean verification, self-review, memory updates, and task tracking updates.

Key decisions:

- Use one same-phase cutover for the package move so no bridge packages remain at task completion.
- Treat the live repository state as authoritative when it differs from planning docs.

State:

- Verified; preparing commit and final handoff.

Done:

- Read AGENTS/CLAUDE guidance, task spec, techspec, `_tasks.md`, ADR-001, ADR-004, and workflow memory files.
- Confirmed the current tree still uses legacy package roots: `internal/httpapi`, `internal/udsapi`, and `internal/apitest`.
- Re-rooted HTTP and UDS transports into `internal/api/httpapi` and `internal/api/udsapi`.
- Re-rooted shared API test helpers into `internal/api/testutil` and updated test imports/package references.
- Updated daemon wiring and boundary enforcement to use the new `internal/api/*` transport paths.
- Ran focused unit and integration tests, then passed `make verify` and `make test-integration`.
- Updated workflow memory plus task 05 tracking files in the worktree.

Now:

- Stage only task-05 code changes, create the local commit, and prepare the completion report.

Next:

- Final response with verification evidence and note that tracking/memory files were intentionally left unstaged because they are tracking-only and `_tasks.md` had unrelated pre-existing edits.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.compozy/tasks/refac-v2/task_05.md`
- `.compozy/tasks/refac-v2/_techspec.md`
- `.compozy/tasks/refac-v2/_tasks.md`
- `.compozy/tasks/refac-v2/adrs/adr-001.md`
- `.compozy/tasks/refac-v2/adrs/adr-004.md`
- `.compozy/tasks/refac-v2/memory/MEMORY.md`
- `.compozy/tasks/refac-v2/memory/task_05.md`
- `.codex/ledger/2026-04-07-MEMORY-api-transport-reroot.md`
- `rg -n 'internal/(httpapi|udsapi|apitest|api/testutil|api/httpapi|api/udsapi)' .`
