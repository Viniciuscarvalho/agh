Goal (incl. success criteria):

- Complete hooks task_02 by adding declaration normalization, family-aware matcher evaluation, deterministic ordering, and unit tests in `internal/hooks`, then verify with focused tests and `make verify`.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`; no destructive git commands and no imports from other `internal/` packages into `internal/hooks`.
- Required workflow: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `brainstorming` (satisfied by the approved PRD/techspec design), and `cy-final-verify` before any completion claim or commit.
- Existing worktree changes in task tracking files were present before this run and must not be overwritten outside the required task_02 updates.

Key decisions:

- Treat the task spec, techspec, and ADR-004/011/012 as the approved design; no contradiction found and no extra design approval loop is needed.
- Keep `internal/hooks` dependency-free by mirroring skill-source precedence with a stdlib-only hook field instead of importing `internal/skills`.
- Separate normalization into validation-only and executor-binding paths so later config/agent loaders can reuse validation without concrete executors.

State:

- In progress.

Done:

- Read root instructions, workflow memory, task_02, `_tasks.md`, `_techspec.md`, ADR-004, ADR-011, ADR-012, ADR-009, relevant prior ledgers, and current `internal/hooks` / `internal/skills` code.
- Captured pre-change signal: `internal/hooks` lacks `normalize.go`, `matcher.go`, and `ordering.go`; no normalization or ordering helpers exist yet.

Now:

- Implementing the normalization, matcher, and ordering surfaces plus supporting tests.

Next:

- Run focused `go test` coverage for `internal/hooks`, then `make verify`.
- Update workflow memory and task tracking, self-review, and commit if clean.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-09-MEMORY-hooks-resolution.md`
- `.compozy/tasks/hooks/task_02.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/adrs/adr-004.md`
- `.compozy/tasks/hooks/adrs/adr-009.md`
- `.compozy/tasks/hooks/adrs/adr-011.md`
- `.compozy/tasks/hooks/adrs/adr-012.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_02.md`
- `internal/hooks/types.go`
- `internal/hooks/events.go`
- `internal/hooks/payloads.go`
- `internal/skills/types.go`
- `internal/skills/hooks.go`
