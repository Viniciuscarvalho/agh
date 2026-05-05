Goal (incl. success criteria):

- Complete `.compozy/tasks/session-driver-override/task_03.md` by adding provider persistence to the global session index, implementing one-time legacy blank-provider repair before resume/reconcile, adding required tests, updating workflow/task memory, and finishing with a clean `make verify`.
- Success requires `sessions.provider` to exist and round-trip through global DB migrations and query helpers, repaired legacy sessions to persist concrete provider state exactly once, explicit failure when repair cannot resolve agent/provider, and verification evidence from targeted tests plus `make verify`.

Constraints/Assumptions:

- Must follow `/Users/pedronauck/Dev/compozy/agh/{AGENTS.md,CLAUDE.md}`, the user-provided workspace policy, `.compozy/tasks/session-driver-override/{_techspec.md,_tasks.md,task_02.md,task_03.md}`, ADR-003, ADR-005, and workflow memory files.
- Required skills in use for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, and `cy-final-verify`; `brainstorming` was reviewed, and the accepted techspec/task docs serve as the approved design baseline for this implementation task.
- Existing unrelated changes in `.compozy/tasks/session-driver-override/{_tasks.md,task_01.md,task_02.md}` and the untracked workflow memory directory must be preserved.
- Keep scope tight to task_03; later API/CLI/web provider exposure belongs to task_04+.

Key decisions:

- The implementation surface is the AGH repo at `/Users/pedronauck/Dev/compozy/agh`, not the initial daemon-web-ui worktree.
- Treat the techspec + ADRs as the approved design baseline and proceed with execution without reopening design discovery.

State:

- Completed; committed tree verified cleanly.

Done:

- Read the root workspace instructions and discovered the initial cwd did not contain the task files.
- Reconciled the task to the AGH repo, then read AGH `AGENTS.md` and `CLAUDE.md`.
- Read required skill docs: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, and `brainstorming`.
- Read workflow memory files `memory/MEMORY.md` and `memory/task_03.md`.
- Read task docs `_techspec.md`, `_tasks.md`, `task_02.md`, `task_03.md`, ADR-003, and ADR-005.
- Scanned relevant prior ledgers:
- `.codex/ledger/2026-04-20-MEMORY-session-driver-override.md`
- `.codex/ledger/2026-04-21-MEMORY-session-provider-persistence.md`
- `.codex/ledger/2026-04-10-MEMORY-session-resume-repair.md`
- Confirmed AGH worktree already has unrelated task-tracking changes that must not be reverted.
- Added provider persistence to the global `sessions` schema and migration paths, including copy-style rebuild support.
- Updated global register/list/scan/reconcile flows to round-trip `provider`.
- Added reusable legacy blank-provider repair logic in `internal/session` and invoked it from observer reconcile before indexing.
- Added targeted unit/integration coverage for migration idempotence, copy-style provider preservation, reconcile repair, explicit repair failure, and deterministic resume after repair.
- Added an extra reconcile test covering duplicate-ID and zero-timestamp branches to raise `internal/store/globaldb` coverage to the task threshold.
- Fixed a repo-gate `internal/extension` cleanup race by making the host API test harness stop whichever session manager is active after `useSessionsWithoutObserver()` swaps managers.
- Fresh focused verification passed:
- `go test ./internal/store/globaldb ./internal/session ./internal/observe -count=1`
- `go test -tags integration ./internal/session -run 'TestManagerIntegrationProviderPersistsAcrossCreateStatusListAndResume|TestManagerIntegrationLegacyProviderRepairPersistsAndResumeStaysDeterministic' -count=1`
- `go test -cover ./internal/store/globaldb ./internal/session`
- Coverage:
- `internal/store/globaldb`: `80.0%`
- `internal/session`: `80.8%`
- Fresh full verification passed before commit:
- `make verify`
- Created local code-only commit `66d69ba1` (`feat: migrate session provider into global index`).
- Re-ran `make verify` on the committed tree and it passed cleanly (`DONE 5582 tests in 5.025s`, `OK: all package boundaries respected`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-21-MEMORY-session-provider-migration.md`
- `.compozy/tasks/session-driver-override/{_techspec.md,_tasks.md,task_02.md,task_03.md,adrs/adr-003.md,adrs/adr-005.md}`
- `.compozy/tasks/session-driver-override/memory/{MEMORY.md,task_03.md}`
- Commands:
- `git status --short`
- `git log -1 --oneline`
- `sed -n`
- `rg -n`
- `go test ./internal/store/globaldb ./internal/session ./internal/observe -count=1`
- `go test -tags integration ./internal/session -run 'TestManagerIntegrationProviderPersistsAcrossCreateStatusListAndResume|TestManagerIntegrationLegacyProviderRepairPersistsAndResumeStaysDeterministic' -count=1`
- `go test -cover ./internal/store/globaldb ./internal/session`
- `make verify`
