Goal (incl. success criteria):

- Complete `refac-v2` task_03 by removing duplicate shared daemon DTOs from `internal/cli/client.go`, switching CLI consumers to `internal/api/contract`, preserving daemon API JSON compatibility, updating required tests, and finishing with clean verification plus task tracking updates.

Constraints/Assumptions:

- Required context read: root `AGENTS.md`, `CLAUDE.md`, shared/task workflow memory, `task_03.md`, `_tasks.md`, `_techspec.md`, ADR-002, required skill docs, and peer ledgers for task_02 continuity.
- Scope stays within `internal/cli` and the smallest supporting test changes needed to prove contract parity; no package re-rooting in this task.
- Worktree already has unrelated `.compozy/tasks/refac-v2/` changes from earlier tasks; do not disturb them beyond the task_03 memory/tracking files required for this run.
- Tracking and workflow memory updates should happen before completion claims and should stay out of the code commit unless repository policy requires otherwise.

Key decisions:

- Use `internal/api/contract` as the canonical source for shared CLI request/response DTOs, following ADR-002 and task_02.
- Keep `HealthStatus`, `IdentityRecord`, and `MemoryHeaderRecord` local because they are CLI-local or domain-local rather than shared daemon contract DTOs.
- Prefer type aliases for shared contract DTOs so downstream CLI command code and tests can stay stable while removing duplicate ownership from `client.go`.

State:

- Complete. Code-only commit created and post-commit verification passed.

Done:

- Read repository guidance, required skills, workflow memory, task spec, techspec, ADR-002, and related ledgers.
- Confirmed the pre-change signal: `internal/cli/client.go` still defines duplicate shared daemon DTOs already present in `internal/api/contract`.
- Replaced shared CLI DTO definitions in `internal/cli/client.go` with aliases to `internal/api/contract`, keeping only CLI-local aggregate/view types in the package.
- Added parity tests proving the CLI DTO names now resolve to the shared contract types and that session, memory, observe, and daemon JSON handling remains stable.
- Ran `go test ./internal/cli -count=1`, `go test ./internal/cli -cover -count=1` (`80.0%` coverage), `go test -tags integration ./internal/cli -count=1`, `make test-integration`, and `make verify` successfully.
- Created local commit `2262436` (`refactor: share cli daemon contract types`) and re-ran `make verify` successfully on committed `HEAD`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `internal/cli/client.go`, `internal/cli/helpers_test.go`, `internal/cli/*_test.go`, `.compozy/tasks/refac-v2/memory/{MEMORY.md,task_03.md}`, `.compozy/tasks/refac-v2/{task_03.md,_tasks.md}`.
- Commands: `rg -n 'type .*Record|contract\\.' internal/cli internal/api/contract`, targeted `go test`/coverage commands, `go test -tags integration ./internal/cli -count=1`, `make verify`, `git status --short`.
