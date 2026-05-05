Goal (incl. success criteria):

- Complete e2e `task_09` by adding a browser E2E scenario that proves a real operator can go from workspace onboarding to a working session lifecycle in the daemon-served SPA: workspace onboarding or selection, session creation, prompt submission, streaming visibility, approval handling, stop/resume, and reload hydration.
- Success requires: shared browser runtime seeding on top of task_08, minimal selector/surface stabilization only where necessary, unit and browser integration coverage for the new helpers/flow, clean workflow-memory and tracking updates, `make verify`, `make web-lint`, `make web-typecheck`, relevant web tests, and one local commit after verification.

Constraints/Assumptions:

- Must follow root `AGENTS.md` / `CLAUDE.md`, `web/AGENTS.md` / `web/CLAUDE.md`, workflow-memory instructions, `task_09.md`, `.compozy/tasks/e2e/_techspec.md`, `.compozy/tasks/e2e/_tasks.md`, and ADR-002/004/005.
- Required skills reviewed before code changes: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `vitest`, `react`, `testing-anti-patterns`, `tanstack-router-best-practices`.
- Keep scope tight to the browser session lifecycle journey; do not expand into network, automation, or bridge browser flows.
- Current worktree already has an unrelated modification in `.compozy/tasks/e2e/_meta.md`; do not touch it.

Key decisions:

- Reuse the shared Playwright harness from task_08 and extend it with configurable runtime seeding instead of spinning up route-specific daemons inside the new spec.
- Seed browser runtime agents by writing fixture-backed `AGENT.md` files into the isolated browser runtime home before daemon startup, mirroring the existing ACP mock registration path at the browser harness layer.
- Keep browser assertions on visible shell/session surfaces; add one route-state artifact snapshot to diagnose streaming/hydration failures without turning Playwright into a daemon-truth suite.
- Add stable onboarding selectors only where current shipped UI lacks a durable automation surface; prefer existing `data-testid` hooks everywhere else.
- Preserve the real shipped session lifecycle semantics in the browser path: fix the mock ACP capability drift and AI SDK finish-chunk contract instead of weakening the Playwright proof or bypassing resume.

State:

- Completed; code commit created and post-commit verification passed.

Done:

- Read required repository instructions, workflow memory, task spec, `_techspec.md`, `_tasks.md`, ADR-002/004/005, and task-adjacent ledgers for the shared E2E/browser harness.
- Reconciled workspace state and confirmed the only pre-existing tracked diff is `.compozy/tasks/e2e/_meta.md`.
- Captured the pre-change gap: `web/e2e/` only has the task_08 smoke harness, `createBrowserRuntime(...)` launches an empty daemon with no mock-agent/session seeding, there is no `web/e2e/session-onboarding.spec.ts`, and onboarding buttons do not yet expose stable test IDs for browser automation.
- Inspected the shipped shell/session surfaces: onboarding shell already exposes `workspace-onboarding`; sidebar new-session buttons, chat header, composer, permission prompt, and chat view already expose usable `data-testid`s.
- Added seeded browser runtime helpers (`runtime-seed.ts`, selector/artifact helpers, onboarding hook) plus the end-to-end `web/e2e/session-onboarding.spec.ts` operator journey.
- Added focused unit coverage for runtime seeding, selector stability, and browser route-state artifact capture.
- Traced the browser resume 500 to ACP mock capability drift (`loadSession: false`) even though the driver already implemented `session/load`, then fixed the mock capability advertisement and added regression coverage.
- Traced the browser streaming validation failure to HTTP prompt finish chunks emitting `stopReason`; fixed the browser-facing API contract to emit AI SDK-compatible `finishReason` values and added regression coverage.
- Fixed the browser runtime workspace resolve helper to post `{ path: rootDir }` and added a unit test for the request contract.
- Fresh verification passed: `make web-lint`, `make web-typecheck`, `make web-test`, `cd web && bun run test:e2e -- e2e/session-onboarding.spec.ts`, `make verify`, and `git diff --check`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-16-MEMORY-browser-session-lifecycle.md`
- `.compozy/tasks/e2e/memory/{MEMORY.md,task_09.md}`
- `web/e2e/fixtures/{runtime.ts,runtime-helpers.ts,runtime-seed.ts,artifacts.ts,browser-artifact-session.ts,test.ts}`
- `web/e2e/{session-onboarding.spec.ts,fixtures/selectors.ts}`
- `web/src/{routes/_app.tsx,routes/_app/session.$id.tsx,systems/workspace/components/workspace-setup.tsx}`
- `internal/testutil/acpmock/{driver/dist/index.js,driver_test.go,testdata/*.json}`
- `internal/api/httpapi/{prompt.go,handlers_test.go}`
- `git status --short`
- `make web-lint`
- `make web-typecheck`
- `make web-test`
- `cd web && bun run test:e2e -- e2e/session-onboarding.spec.ts`
- `make verify`
- `git commit -m "test: add browser session lifecycle flow"`
