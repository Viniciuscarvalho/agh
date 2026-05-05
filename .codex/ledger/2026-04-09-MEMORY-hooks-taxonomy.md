Goal (incl. success criteria):

- Implement task_01 by creating the dependency-free `internal/hooks` base package with the 27-event taxonomy, sync-eligibility classification, core enums/structs, event payload/patch models, and unit tests with >=80% package coverage.

Constraints/Assumptions:

- Follow `/Users/pedronauck/dev/projects/agh/AGENTS.md` and `CLAUDE.md`.
- Do not import other `internal/` packages from `internal/hooks` in this task; use stdlib-only data models.
- Workflow memory files must be read before code edits and updated before completion.
- Automatic commit is enabled, but tracking-only files should stay out of the automatic commit unless explicitly required.

Key decisions:

- Treat the task file, techspec, and ADRs as the source of truth; no blocking contradictions found.
- Keep payload models decoupled from `internal/session` and `internal/acp` by storing the relevant fields directly instead of importing those packages.
- Validation will live on the hook types needed by this task, especially `RegisteredHook`.

State:

- In progress.

Done:

- Read root instructions, task spec, `_tasks.md`, `_techspec.md`, ADR-002, ADR-003, ADR-005, ADR-010, ADR-012, and ADR-013.
- Read workflow memory files and relevant existing hook/session/ACP types.
- Captured pre-change baseline: `internal/hooks` was missing and `go test ./internal/hooks` failed with `directory not found`.

Now:

- Implementing the new `internal/hooks` package and its tests.

Next:

- Add `events.go`, `types.go`, `payloads.go`, `doc.go`, and unit tests.
- Run focused tests and `make verify`, then self-review.
- Update workflow memory and task tracking, then create one local commit.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.compozy/tasks/hooks/task_01.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/adrs/adr-002.md`
- `.compozy/tasks/hooks/adrs/adr-003.md`
- `.compozy/tasks/hooks/adrs/adr-005.md`
- `.compozy/tasks/hooks/adrs/adr-010.md`
- `.compozy/tasks/hooks/adrs/adr-012.md`
- `.compozy/tasks/hooks/adrs/adr-013.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_01.md`
- `go test ./internal/hooks`
