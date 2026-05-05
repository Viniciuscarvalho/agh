Goal (incl. success criteria):

- Implement the accepted Storybook plan for the full `tasks` route family under `_app`, backed by real app routing plus MSW, and register `tasks` as a first-class Storybook mock group.
- Success means: `tasks` has canonical Storybook mocks, route stories exist for `/tasks`, `/tasks/$id`, `/tasks/new`, `/tasks/$id/edit`, and `/tasks/$id/runs/$runId`, related Storybook tests are updated, and verification passes.

Constraints/Assumptions:

- The worktree is already dirty; do not touch unrelated changes.
- Do not use destructive git commands.
- Keep edits scoped to Storybook, `tasks` mocks/fixtures, and directly related tests/helpers.
- Reuse the project’s grouped MSW contract and real app-router Storybook pattern.

Key decisions:

- Persist the accepted plan at `.codex/plans/2026-04-20-tasks-route-stories.md`.
- Use `web/src/systems/tasks/mocks` as the canonical Storybook mock source for `tasks`.
- Keep route stories split by route file instead of building one monolithic `-tasks.stories.tsx`.

State:

- Completed.

Done:

- Explored the existing Storybook route-story/MSW harness and current `tasks` route surface.
- Confirmed `tasks` lacks a Storybook mock group today.
- Confirmed the accepted scope is the full route family and the fixture strategy is consolidation into `systems/tasks/mocks`.
- Recorded the accepted implementation plan in `.codex/plans/2026-04-20-tasks-route-stories.md`.
- Added canonical `tasks` Storybook mocks in `web/src/systems/tasks/mocks/{fixtures.ts,handlers.ts,index.ts}`.
- Registered `tasks` in the Storybook MSW registry and preview router placeholder routes.
- Added route stories for `/tasks`, `/tasks/$id`, `/tasks/new`, `/tasks/$id/edit`, and `/tasks/$id/runs/$runId`.
- Repointed task component story/test fixtures to the canonical mocks barrel.
- Added Storybook regression coverage for the new route-story modules and updated MSW/router contract tests.
- Fixed a real regression uncovered by `make web-test`: `buildInboxFixture()` must default to an empty inbox for component stories/tests, while `taskInboxFixture` remains the populated route-story fixture.
- Verified the implementation with `make web-lint`, `make web-typecheck`, `make web-test`, `bun run --cwd web build-storybook`, and `make verify`.

Now:

- Nothing pending.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `web/.storybook/preview.ts`
- `web/src/storybook/{msw.ts,msw.test.ts,web-storybook-config.test.tsx,web-storybook-msw-contract.test.ts,web-storybook-stories-and-fixtures.test.tsx,route-story.tsx}`
- `web/src/routes/_app/stories/`
- `web/src/systems/tasks/{index.ts,types.ts,adapters/tasks-api.ts,hooks/,components/,mocks/}`
- `web/src/storybook/tasks-route-stories.test.tsx`
- `make web-lint`
- `make web-typecheck`
- `make web-test`
- `bun run --cwd web build-storybook`
- `make verify`
