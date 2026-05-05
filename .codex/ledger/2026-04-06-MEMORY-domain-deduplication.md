Goal (incl. success criteria):

- Complete refac task_04 by extracting the required domain-level helpers across `internal/session`, `internal/acp`, `internal/store`, `internal/skills`, `internal/workspace`, and `internal/cli`, preserving behavior, adding the required tests, updating workflow/task tracking, passing `make verify`, and creating one local code-only commit.

Constraints/Assumptions:

- Required context read: root `AGENTS.md`, `CLAUDE.md`, workflow memory files, refac `task_04.md`, `.compozy/tasks/refac/_techspec.md`, `.compozy/tasks/refac/_tasks.md`, and the report docs for core/storage/skills-workspace/config-daemon-cli.
- Scope is limited to refac task_04 surfaces plus the smallest test/helper updates needed to validate them.
- The worktree contains large unrelated `.compozy/tasks/` churn and deletions that must remain untouched unless task_04 tracking updates require specific files.
- Task tracking and workflow memory updates should happen before completion claims and should stay out of the code commit unless repository policy requires otherwise.

Key decisions:

- Use the required task skills `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`, plus `golang-pro` and `testing-anti-patterns` because this task changes Go production code and tests.
- Treat the task spec and Phase 4 items in `_techspec.md` as the source of truth; no silent expansion into adjacent refactor findings.
- Preserve existing behavior exactly; if tests reveal regressions, fix production code rather than weakening assertions.

State:

- Complete. Task tracking is updated, the local code-only commit is `5a60b8a`, and post-commit `make verify` passed on `HEAD`.

Done:

- Read repository instructions, required skill docs, workflow memory files, refac task docs, and peer ledgers.
- Confirmed there are no ADR files under `.compozy/tasks/refac/adrs/`.
- Built an execution checklist and captured the pre-change signal from live code searches: the duplicate helper families still exist for session activation, ACP permission events, store validation/ready guards, raw JSON clone helpers, file snapshots, and CLI list bundles.
- Implemented the required helper extractions across `internal/session`, `internal/acp`, `internal/store`, `internal/filesnap`, `internal/skills`, `internal/workspace`, and `internal/cli`, including the supporting tests.
- Ran task-specific verification:
  - `go test -cover ./internal/filesnap ./internal/session ./internal/acp ./internal/store ./internal/skills ./internal/workspace ./internal/cli -count=1`
  - `go test -tags integration ./internal/session ./internal/acp -count=1`
  - `make verify`
- Updated workflow memory plus refac task tracking (`task_04.md`, `_tasks.md`) after the verified pass.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `internal/session/*`, `internal/acp/*`, `internal/store/*`, `internal/skills/*`, `internal/workspace/*`, `internal/cli/*`, `.compozy/tasks/refac/memory/{MEMORY.md,task_04.md}`, `.compozy/tasks/refac/{task_04.md,_tasks.md}`.
- Commands: `rg`/`sed` inspections, targeted `go test` and coverage runs, `make verify`, `git status --short`, `git diff --stat`.
