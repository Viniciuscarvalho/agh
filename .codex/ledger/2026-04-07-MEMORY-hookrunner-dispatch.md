Goal (incl. success criteria):

- Complete `skills-v2` task_05 by adding `HookRunner` subprocess dispatch in `internal/skills`, covering ordering/filtering/timeout/fail-open behavior with unit tests and test fixtures, and finishing with clean verification, workflow memory updates, task tracking updates, and one local code-only commit.

Constraints/Assumptions:

- Required context already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory files, `task_05.md`, `_techspec.md`, `_tasks.md`, and ADR-002.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify` before any completion claim or commit.
- Scope should stay centered on `internal/skills` plus task memory/tracking files; task_09 notifier integration is explicitly out of scope.
- Existing unrelated worktree changes in `docs/rfcs/skills-system-final.md` and the untracked `.compozy/tasks/skills-v2/` tree must remain untouched except for this task's required memory/tracking files.

Key decisions:

- Treat the task spec, techspec, and ADR-002 as the approved design; no extra brainstorming/plan approval loop is needed.
- Keep hook execution fail-open: all subprocess failures become `HookResult.Error` plus warn logs, never returned as blocking errors.

State:

- Complete; local code-only commit created and committed `HEAD` re-verified cleanly.

Done:

- Read repository guidance, required skill instructions, workflow memory, task spec, techspec, ADR-002, current `internal/skills` types, and `internal/skills/mcp.go`.
- Reconciled worktree state and scanned existing ledgers for cross-agent awareness.
- Added `internal/skills/hooks.go` with `HookRunner`, `HookPayload`, `HookResult`, per-hook timeout handling, JSON stdin/stdout subprocess execution, fail-open warn logging, and source-precedence plus same-source alphabetical ordering.
- Added fixture-backed unit tests in `internal/skills/hooks_test.go` and `internal/skills/testdata/hooks/driver.sh` covering matching-event execution, event filtering, payload/env propagation, stdout capture, timeout handling, non-zero exit fail-open behavior, precedence ordering, alphabetical same-source ordering, and empty-skill behavior.
- Fixed a production bug caught by tests where successful hook durations stayed `0s` because duration assignment happened in a deferred closure after the return value was copied.
- Ran `go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1` (`81.9%`), and `make verify` successfully.
- Updated workflow memory and task tracking locally without staging those files.
- Created local commit `a3c36ea` (`feat: implement skills hook runner`).
- Re-ran `make verify` on committed `HEAD` successfully.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-07-MEMORY-hookrunner-dispatch.md`
- `.compozy/tasks/skills-v2/memory/MEMORY.md`
- `.compozy/tasks/skills-v2/memory/task_05.md`
- `.compozy/tasks/skills-v2/task_05.md`
- `.compozy/tasks/skills-v2/_tasks.md`
- `internal/skills/types.go`
- `internal/skills/mcp.go`
- `internal/skills/hooks.go`
- `internal/skills/hooks_test.go`
- `internal/skills/testdata/`
