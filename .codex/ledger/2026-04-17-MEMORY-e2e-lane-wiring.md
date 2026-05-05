Goal (incl. success criteria):

- Complete `.compozy/tasks/e2e/task_13.md` by adding explicit runtime, web, combined, and nightly E2E entrypoints across `Makefile`, Mage, and package scripts, with focused regression coverage and clean verification.
- Success means the repo no longer relies on broad `test-integration` for PR-required E2E, browser E2E wiring is explicitly daemon-served, credentialed nightly coverage is isolated from default PR lanes, task/workflow memory is updated, `make verify` passes, and one local commit is created.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`, workflow-memory instructions, `.compozy/tasks/e2e/{task_13.md,_techspec.md,_tasks.md}`, and ADR-002/005.
- Required skills loaded/reviewed: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`; `brainstorming` was reviewed but the approved PRD/techspec/ADR set is already the design authority for this implementation task.
- Keep scope tight to command-surface wiring. Do not silently expand into new runtime/browser scenarios.
- Current worktree already contains unrelated task-tracking and workflow-memory edits. Do not revert or overwrite them.

Key decisions:

- Define the lane matrix in one normal Go package so Mage targets and regression tests share the same runtime/web/nightly semantics without relying on mage-only build tags.
- Keep the PR-required runtime lane focused on the E2E and transport-parity slice instead of the full `test-integration` package sweep.
- Encode the browser lane as daemon-served Playwright scripts in `web/package.json`, and keep nightly browser selectors separate from the default browser lane.

State:

- In progress.

Done:

- Read repository instructions, required skill docs, workflow memory, task spec, `_techspec.md`, `_tasks.md`, ADR-002/005, and relevant prior E2E ledgers.
- Captured the pre-change gap: `Makefile` stops at `test-integration`, Mage stops at `TestIntegration`, root `package.json` has no E2E lane scripts, and `web/package.json` only exposes a single generic Playwright entrypoint.
- Confirmed the current browser spec tree under `web/e2e/` and the existing runtime/transport E2E test names under `internal/daemon`, `internal/api/httpapi`, `internal/api/udsapi`, and `internal/environment/daytona`.

Now:

- Implement the shared lane-definition package and wire Make/Mage/package scripts to it.

Next:

- Add unit tests for lane selection plus command-level regression checks for Makefile, Mage target exposure, and package-script wiring.
- Run focused validation, `make web-lint`, `make web-typecheck`, and `make verify`.
- Update workflow memory and task tracking, then self-review and commit.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: task_12 is still marked pending in tracking, but the lane wiring can still target the whole browser spec surface so future bridge specs join automatically once landed.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-e2e-lane-wiring.md`
- `.compozy/tasks/e2e/{task_13.md,_techspec.md,_tasks.md,memory/{MEMORY.md,task_13.md}}`
- `Makefile`
- `magefile.go`
- `package.json`
- `web/package.json`
- `web/playwright.config.ts`
- `internal/api/httpapi/static.go`
- `internal/daemon/*integration_test.go`
- `internal/api/httpapi/*integration_test.go`
- `internal/api/udsapi/*integration_test.go`
- `internal/environment/daytona/*integration_test.go`
