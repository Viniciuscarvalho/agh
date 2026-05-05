Goal (incl. success criteria):

- Complete refac `task_01` by extracting `internal/procutil`, `internal/fileutil`, and `internal/testutil`, applying the listed inline deduplication fixes, updating tests/coverage, and finishing with clean task tracking plus `make verify`.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory files, `.compozy/tasks/refac/task_01.md`, `_tasks.md`, `_techspec.md`, and relevant peer ledgers.
- No `adrs/` directory exists under `.compozy/tasks/refac`, so there are no ADRs to read for this task.
- Keep scope tight to task_01; record follow-up work instead of expanding into task_02+ file splits or broader domain refactors.
- Existing worktree changes under `.compozy/tasks/refac/` and archived/deleted task trees are unrelated and must remain untouched.
- Tracking and workflow memory files should be updated as required but kept out of the automatic code commit unless repository policy forces otherwise.

Key decisions:

- Use the required skills `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`, plus `golang-pro` and `testing-anti-patterns` because this task modifies Go production code and tests.
- Treat the current repo state and the updated refac docs as source of truth, especially for `internal/skills` after the recent resolver-backed registry refactor.
- Preserve current behavior while consolidating helpers; any test failures uncovered by the refactor must be fixed in production code rather than weakening assertions.

State:

- Task complete.

Done:

- Read root repository guidance, required skill docs, workflow memory files, task spec, techspec, master task list, and peer ledgers.
- Reconciled current worktree state and identified unrelated modified/deleted task artifacts to avoid.
- Inspected the baseline helper duplication and quick-win targets across `daemon`, `cli`, `memory`, `store`, `config`, `session`, `skills`, and `udsapi`.
- Added `internal/procutil`, `internal/fileutil`, and `internal/testutil` with consumer migrations in `daemon`, `cli`, `memory`, and `store`.
- Consolidated config path resolution in `internal/config/home.go` and switched daemon/CLI consumers to the exported helpers.
- Merged session cleanup helpers, extracted `processSkill`, replaced registry `reflect.DeepEqual` with snapshot comparison, merged CLI daemon status helpers, removed the custom `max`, and fixed the UDS read-header timeout typo.
- Replaced duplicated `testContext` and string-slice helpers across the touched test suites and added focused coverage for the new utility packages plus the refactored CLI/session/skills/config flows.
- Ran targeted package tests across all modified packages and confirmed coverage targets: `procutil` `100.0%`, `fileutil` `96.6%`, `testutil` `100.0%`, and all modified packages at or above `80%` including `internal/cli` at `80.4%`.
- Updated workflow memory and refac task tracking outside the code commit.
- Created local code-only commit `2d0405e` (`refactor: extract shared utility helpers`).
- Re-ran `make verify` on committed `HEAD` successfully: `0 issues`, `DONE 853 tests`, `OK: all package boundaries respected`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `internal/{daemon,cli,memory,store,config,session,skills,udsapi}/...`, new `internal/{procutil,fileutil,testutil}/...`, `.compozy/tasks/refac/memory/{MEMORY.md,task_01.md}`, `.compozy/tasks/refac/{task_01.md,_tasks.md}`.
- Commands: `git status --short`, `rg` searches for duplicated helpers, targeted `go test` and coverage runs, `make verify`, `git diff --stat`, `git commit`.
