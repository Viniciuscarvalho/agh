Goal (incl. success criteria):

- Implement the accepted web workspace navigation hard-cut so the sidebar order is `Network`, `Tasks`, `Bridges`, `Jobs`, `Triggers`, `Knowledge`, `Skills`, `Jobs` and `Triggers` become first-level routes, `/automation` is removed entirely, dependent settings/storybook/tests are updated, and web verification passes.

Constraints/Assumptions:

- Must follow root and `web/` instructions, including no destructive git commands and passing `make web-lint` plus `make web-typecheck` before completion; `make verify` is the repo-wide blocking gate.
- User-selected hard-cut: no redirect or compatibility route for `/automation`.
- `Network` remains singular in both label and URL; no `/networks` rename.
- Backend automation API and `@/systems/automation` domain stay intact; this is a route/navigation refactor.
- Unrelated worktree change in `.github/workflows/ci.yml` must remain untouched.

Key decisions:

- Reuse the existing automation system components and split the route layer at the current `use-automation-page` seam rather than duplicating UI.
- Replace the tabbed automation route with a shared kind-parameterized page hook used by `/jobs` and `/triggers`.
- Update all linked surfaces in the same pass so the app has no dangling `/automation` references after the cut.

State:

- Completed.

Done:

- Read current repo instructions, `web/` instructions, relevant prior ledgers, and the accepted plan.
- Confirmed current root cause: `/automation` is a route-level aggregator that couples jobs and triggers through tab state and a mixed query/view-model.
- Identified dependent surfaces that reference `/automation`: sidebar, route tree tests, settings deep links, storybook route stories, storybook router stubs, and automation route integration tests.
- Persisted the accepted plan artifact for this task.
- Reordered the workspace sidebar to `Network`, `Tasks`, `Bridges`, `Jobs`, `Triggers`, `Knowledge`, `Skills` and removed the operational `Automation` entry.
- Removed the operational `/automation` route and replaced it with first-level `/jobs` and `/triggers` routes.
- Split the route layer into independent jobs/triggers pages backed by a shared automation operations page shell and kind-specific page hooks.
- Updated settings automation operational links to point at `/jobs` and `/triggers`.
- Replaced storybook stub routing and route stories that depended on `/automation`.
- Replaced the old automation route integration test with direct jobs/triggers route integration coverage.
- Regenerated `web/src/routeTree.gen.ts` through the build pipeline.
- Verification passed:
  - `bun run --cwd web build:raw`
  - `bun run --cwd web test:raw src/routes/_app/-jobs-triggers.integration.test.tsx src/components/app-sidebar.test.tsx src/routes/_app/settings/-automation.test.tsx src/storybook/web-storybook-config.test.tsx src/routes/-settings-route-tree.test.ts`
  - `make web-test`
  - `make web-lint`
  - `make web-typecheck`
  - `make verify`

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `web/src/components/app-sidebar.tsx`, `web/src/components/app-sidebar.test.tsx`, `web/src/hooks/routes/use-automation-page.ts`, `web/src/systems/automation/components/automation-operations-page.tsx`, `web/src/routes/_app/jobs.tsx`, `web/src/routes/_app/triggers.tsx`, `web/src/routes/_app/-jobs-triggers.integration.test.tsx`, `web/src/routes/_app/settings/automation.tsx`, `web/.storybook/preview.ts`, `web/src/routeTree.gen.ts`.
- Commands: `bun run --cwd web build:raw`, `make web-test`, `make web-lint`, `make web-typecheck`, `make verify`, `git status --short`, `git diff --stat`.
