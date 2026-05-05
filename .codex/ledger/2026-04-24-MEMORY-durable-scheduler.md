Goal (incl. success criteria):

- Implement Hermes Task 04 Durable Automation Scheduler.
- Success requires durable scheduler cursor schema/store APIs, pre-dispatch cursor advancement, boot reconciliation/misfire policy, separate delivery-error tracking, deterministic restart/crash/missed-run tests, downstream web/site impact assessment, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow required skills: cy-workflow-memory, cy-execute-task, cy-final-verify.
- Follow repo task-domain skills: golang-pro and testing-anti-patterns; scheduler concurrency may require deadlock-finder-and-fixer guidance.
- Read workflow memory, AGENTS.md, CLAUDE.md, Hermes PRD docs, ADR-001/ADR-002, and Task 01 outputs before code edits.
- Do not run destructive git commands: git restore, git checkout, git reset, git clean, git rm.
- Keep scope to Task 04 and record follow-ups instead of expanding silently.
- Automatic commit is enabled only after clean verification, self-review, and tracking updates.

Key decisions:

- Baseline signal: `rg "automation_scheduler_state|SchedulerState|ClaimScheduled|delivery_error|fire_id"` has no hits before implementation; existing focused automation/store/API/CLI tests pass.
- Durable cursor policy will follow ADR-002: scheduler state is the source of truth, and claim/cursor advancement happens before dispatch.
- Default boot reconciliation policy will be explicit `skip_missed`: missed scheduled fires are recorded as misfires and advanced to the next future run instead of dispatching old fires.

State:

- Implementation complete, committed, and post-commit verification passing.

Done:

- Scanned `.codex/ledger/` and read relevant Hermes ledgers for techspec and Tasks 01-03.
- Loaded required PRD execution, workflow memory, and final verification skill instructions.
- Read workflow memory, repo guidance, Hermes `_techspec.md`, `_tasks.md`, Task 04, all ADRs, Task 01 file/memory, and relevant Go/testing/concurrency skill guidance.
- Reconciled dirty worktree: unrelated design/site image changes and untracked Hermes tracking files pre-exist and must be left alone.
- Captured baseline signal and focused passing tests for current automation/store/API/CLI surfaces.
- Added durable scheduler model/store/schema APIs, including `automation_scheduler_state`, scheduled run `fire_id`/`scheduled_at`, delivery-error fields, and transactional `ClaimScheduledRun`.
- Refactored scheduler loops to use durable cursor state, pre-dispatch claims, `skip_missed` boot reconciliation, context-owned goroutines, and delivery-error recording separate from cursor correctness.
- Exposed scheduler diagnostics and delivery errors through API contracts, CLI output, generated OpenAPI/web/SDK types, web automation detail/run-history UI, and site docs.
- Added deterministic tests for pre-dispatch cursor advancement, missed-run reconciliation, delivery-error separation, restart duplicate prevention, and real SQLite reopen duplicate rejection.
- Verified focused Go packages, focused web component tests, web typecheck, and `make codegen-check`.
- Fixed `make verify` lint feedback by documenting lifecycle-owned scheduler cancellation and simplifying an always-nil unregister helper.
- Removed pre-existing `time.Sleep` from the touched scheduler integration helper; `go test -tags integration ./internal/automation -run TestSchedulerIntegration -count=1` passed.
- Fresh final `make verify` passed after all changes: web lint/typecheck/tests/build, Go lint/tests/build, 5797 Go tests, and package-boundary checks.
- Updated Task 04 checkboxes/status and master Hermes task table.
- Created local commit `e8a17a4b feat: add durable automation scheduler`.
- Post-commit `make verify` passed: web lint/typecheck/tests/build, Go lint/tests/build, 5797 Go tests, and package-boundary checks.

Now:

- Prepare final response with verification evidence and note unrelated remaining worktree changes.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.compozy/tasks/hermes/task_04.md`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/adrs/`
- `.compozy/tasks/hermes/memory/MEMORY.md`
- `.compozy/tasks/hermes/memory/task_04.md`
- Planned code surfaces: `internal/automation/*`, `internal/automation/model/*`, `internal/store/globaldb/*`, `internal/api/contract/automation.go`, `internal/api/core/*`, `internal/cli/automation.go`, web generated/types/tests, site docs, Task 10 QA notes.
- Verification evidence so far: focused Go test slice, full `go test ./internal/automation`, full `go test ./internal/store/globaldb`, full `go test ./internal/api/core ./internal/api/contract ./internal/cli`, focused web Vitest component/adapter/type tests, `cd web && bun run typecheck:raw`, `make codegen-check`.
