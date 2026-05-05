Goal (incl. success criteria):

- Complete `.compozy/tasks/e2e/task_12.md` by adding the browser bridges operator flow on the shipped Bridges page.
- Success requires deterministic bridge-enabled browser/runtime seeding, a Playwright scenario for bridge create/edit plus secret binding, real health-stream visibility, test delivery with browser-visible downstream effects, focused unit/integration coverage, clean workflow-memory/task tracking updates, clean verification, and one local commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `web/CLAUDE.md`, workflow-memory instructions, `.compozy/tasks/e2e/{task_12.md,_techspec.md,_tasks.md}`, and ADR-002/004/005.
- Required skills in use: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`; `brainstorming` was reviewed and intentionally skipped because the approved PRD/techspec/ADR set already defines the design authority for this implementation task.
- Browser assertions must stay on shipped operator surfaces; runtime bridge/provider semantics remain owned by task_05 and supporting public daemon APIs.
- Current worktree already contains unrelated tracking edits in `.compozy/tasks/e2e/{_meta.md,_tasks.md,memory/MEMORY.md,memory/task_09.md,memory/task_10.md,memory/task_11.md,task_09.md,task_10.md,task_11.md}`. Do not revert or overwrite them.

Key decisions:

- Reuse the shared Playwright browser harness and extend `web/e2e/fixtures/{runtime-seed,selectors,browser-artifact-session}.ts` instead of inventing a bridge-specific boot path.
- Keep the operator proof centered on browser-visible bridge list/detail/test-delivery surfaces and real SSE health updates, using runtime reads only for deterministic seeding or diagnostic confirmation.
- Use an edit-based operator flow instead of create-from-empty-state: seed one real disabled Telegram bridge through public extension/bridge APIs, then exercise edit, secret binding, enablement, SSE health visibility, and test delivery through the shipped Bridges route.
- Register the bridge ingress mock agent as `general` so the daemon bootstrap default agent handles real inbound bridge routing without adding browser-harness config seams.
- Patch the copied `telegram-reference` manifest with concrete marker paths and compute the real extension checksum in the browser seed helper, so the Playwright lane reuses task_05 runtime truth without depending on extra daemon env templating.

State:

- In progress.

Done:

- Read repo instructions, required skill docs, workflow memory, task_12, `_techspec.md`, `_tasks.md`, ADR-002/004/005, `web/CLAUDE.md`, and relevant prior ledgers for task_05, task_08, task_10, and task_11.
- Reconciled workspace state and recorded the unrelated pre-existing tracking-file edits.
- Captured the pre-change gap: no `web/e2e/bridges.spec.ts`; browser runtime seed helpers, selectors, and browser route-state capture do not yet cover bridge operator surfaces.
- Inspected the shipped Bridges route, route hook, bridge dialogs, detail panel, health-stream hook, and runtime bridge helper surfaces.
- Confirmed the current Playwright ingress failure is rooted in the browser seed using `include_group: true`; task_05 runtime truth only emits peer + thread for Telegram inbound messages, so host API route validation rejected the seeded bridge ingress.

Now:

- Align the browser bridge seed routing policy with task_05 runtime truth, then rerun focused bridge tests and the Playwright scenario.

Next:

- Implement the bridge Playwright scenario and focused test coverage.
- Run web-focused verification, then `make verify`, self-review, workflow-memory updates, task tracking updates, and local commit if verification passes.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the current Bridges UI already exposes all stable test IDs needed for route-level assertions, or if a minimal stabilization patch will be required in the route/detail/list surfaces.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-browser-bridges-flow.md`
- `.compozy/tasks/e2e/{task_12.md,_techspec.md,_tasks.md,memory/{MEMORY.md,task_12.md}}`
- `web/e2e/fixtures/{runtime.ts,runtime-seed.ts,selectors.ts,browser-artifact-session.ts}`
- `web/e2e/{network.spec.ts,automation.spec.ts}`
- `web/src/routes/_app/bridges.tsx`
- `web/src/hooks/routes/use-bridges-page.ts`
- `web/src/systems/bridges/components/{bridge-create-dialog.tsx,bridge-detail-panel.tsx,bridge-test-delivery-dialog.tsx}`
- `web/src/systems/bridges/hooks/use-bridge-health-stream.ts`
- `internal/testutil/e2e/bridges_extensions.go`
