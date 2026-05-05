Goal (incl. success criteria):

- Execute task 08 end-to-end QA for session provider override.
- Prove create/resume behavior through backend, storage, API, CLI, and browser flows.
- Store fresh evidence under `.compozy/tasks/session-driver-override/qa/`.
- Fix any root-cause regressions found, add narrow regression coverage, rerun impacted lanes, and finish with clean `make verify` and `make codegen-check`.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `qa-execution`, and `cy-final-verify`.
- Must read and update workflow memory files before edits and before completion.
- Must use task 07 QA artifacts as the execution matrix seed.
- Must not touch unrelated git changes or use destructive git commands.
- If QA reveals a bug, activate `systematic-debugging` and `no-workarounds` before changing code/tests.
- E2E browser-visible coverage is required for the create dialog and resume failure UX.

Key decisions:

- Use `.compozy/tasks/session-driver-override/qa/` as the sole artifact root.
- Treat smoke/P0 cases from task 07 as the initial stop/go gate before broader execution.
- Reuse one removed-provider persisted session across backend and web evidence where practical.

State:

- Completed.

Done:

- Read workflow memory, task 08 spec, tech spec, `_tasks.md`, ADR-002/003/004/005, and task 07 QA artifacts.
- Read required skill instructions for `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, and `qa-execution`.
- Reconciled workspace state and noted existing unrelated task 07/shared memory modifications in `git status`.
- Ran `make deps` successfully.
- Ran baseline `make verify` successfully; web lint/typecheck/test/build and Go verify/build/boundary checks all exited cleanly.
- Executed targeted provider-override coverage across session/runtime, global DB migration/repair, API core, HTTP, UDS, CLI, Host API, Vitest, and Playwright browser flows.
- Added durable regression coverage in `internal/cli/cli_integration_test.go` and `web/e2e/session-provider-override.spec.ts`.
- Fixed `BUG-001` by introducing `aghconfig.ErrProviderUnavailable`, mapping it to HTTP/UDS 400s, and adding targeted config/core/transport regressions.
- Captured browser evidence under `.compozy/tasks/session-driver-override/qa/screenshots/` and wrote `.compozy/tasks/session-driver-override/qa/verification-report.md` plus `BUG-001.md` and `BUG-002.md`.
- Fixed `BUG-002` by hardening `internal/procutil/process_group_unix.go` against stale `EPERM` after process-group exit and added `internal/procutil/process_group_unix_test.go`.
- Reran `make codegen-check` and a fresh `make verify`; both passed cleanly.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/session-driver-override/task_08.md`
- `.compozy/tasks/session-driver-override/_techspec.md`
- `.compozy/tasks/session-driver-override/_tasks.md`
- `.compozy/tasks/session-driver-override/adrs/adr-002.md`
- `.compozy/tasks/session-driver-override/adrs/adr-003.md`
- `.compozy/tasks/session-driver-override/adrs/adr-004.md`
- `.compozy/tasks/session-driver-override/adrs/adr-005.md`
- `.compozy/tasks/session-driver-override/memory/MEMORY.md`
- `.compozy/tasks/session-driver-override/memory/task_08.md`
- `.compozy/tasks/session-driver-override/qa/test-plans/session-provider-override-test-plan.md`
- `.compozy/tasks/session-driver-override/qa/test-plans/session-provider-override-regression.md`
- `.compozy/tasks/session-driver-override/qa/verification-report.md`
- `.compozy/tasks/session-driver-override/qa/issues/BUG-001.md`
- `.compozy/tasks/session-driver-override/qa/issues/BUG-002.md`
- `web/e2e/session-provider-override.spec.ts`
- `internal/procutil/process_group_unix.go`
- `internal/procutil/process_group_unix_test.go`
- Commands: `git status --short`, `python3 .agents/skills/qa-execution/scripts/discover-project-contract.py --root .`, `go test`, `bun run vitest run ...`, `bunx playwright test e2e/session-provider-override.spec.ts`, `make codegen-check`, `make verify`
