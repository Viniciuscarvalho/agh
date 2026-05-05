Goal (incl. success criteria):

- Complete e2e task_08 by adding a reusable Playwright harness under `web/e2e/` that runs against daemon-served embedded web assets, captures browser diagnostics in the shared artifact model, adds local web scripts/config, and passes required validation before tracking updates and commit.

Constraints/Assumptions:

- Must follow root instructions, `web/AGENTS.md`, `web/CLAUDE.md`, workflow memory requirements, task_08, `_techspec.md`, `_tasks.md`, and ADR-002/005.
- Required skills loaded/reviewed: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `vitest`, `react`, `testing-anti-patterns`; `brainstorming` reviewed but the approved PRD/techspec/ADR set is already the design authority for this implementation task.
- Keep scope tight to harness/fixture setup; route-specific operator journeys belong to later browser tasks.
- Existing task tracking and memory files are already modified or untracked in the worktree; do not disturb unrelated files.

Key decisions:

- Keep the browser harness primarily inside `web/e2e/` and launch the real daemon directly from Node/Playwright instead of introducing a second long-lived Go-side control helper.
- Reuse task_01’s browser artifact contract by mirroring the stable artifact names and manifest schema in TypeScript for browser traces, screenshots, console logs, and network logs.
- Support both launched and attached runtime modes via environment-based runtime resolution, while explicitly validating that the served HTML is daemon-hosted embedded output rather than a Vite dev surface.

State:

- Completed.

Done:

- Read repository instructions, required skill files, workflow memory, task spec, techspec, `_tasks.md`, and ADR-001 through ADR-005.
- Confirmed task_01 already added browser artifact kinds to `internal/testutil/e2e`.
- Captured the pre-change signal: no `web/e2e/`, no `web/playwright.config.ts`, no `test:e2e` script, and no `@playwright/test` dependency.
- Added `web/playwright.config.ts`, shared browser fixtures under `web/e2e/`, daemon launch/attach helpers, and stable browser artifact capture for traces, screenshots, console logs, and network logs.
- Added focused unit coverage for artifact/runtime helpers and Playwright smoke coverage for onboarding-shell reachability plus forced-failure diagnostics.
- Updated task-local and shared workflow memory for the browser lane, and updated task tracking for task_08 completion without staging tracking-only files.
- Ran fresh validation on the final tree: `make verify`, `cd web && bun run test:e2e`, `cd web && bunx vitest run --coverage --coverage.include=e2e/fixtures/artifacts.ts --coverage.include=e2e/fixtures/runtime-helpers.ts e2e/fixtures/artifacts.test.ts e2e/fixtures/runtime.test.ts`.
- Created the scoped local commit `da0c8d7e test: add daemon-served playwright e2e harness`.

Now:

- None.

Next:

- Optionally delete this ledger after handoff.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `web/package.json`, `web/vitest.config.ts`, `web/tsconfig.json`, `web/playwright.config.ts`, `web/e2e/**/*`, `.compozy/tasks/e2e/memory/{MEMORY.md,task_08.md}`, `.compozy/tasks/e2e/{task_08.md,_tasks.md}`.
- Commands: `bun add -d @playwright/test`, `cd web && bun run lint`, `cd web && bun run typecheck`, `cd web && bun run test`, `cd web && bun run test:e2e`, `make verify`.
