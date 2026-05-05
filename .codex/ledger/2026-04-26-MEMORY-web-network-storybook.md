Goal (incl. success criteria):

- Add Storybook coverage for `web/` network routes and components using MSW so layouts render without real daemon data.
- Success = network route/component stories follow existing route-story/MSW patterns, grouped default handlers are preserved, and required web gates pass.

Constraints/Assumptions:

- Follow root and `web/` AGENTS/CLAUDE instructions.
- Do not touch unrelated dirty worktree changes.
- Use existing Storybook helper (`storybookMswParameters`) rather than raw `msw.handlers` arrays.
- Use design tokens and existing components; no ad-hoc visual redesign.

Key decisions:

- Add `web/src/routes/_app/stories/-network.stories.tsx` for the real app route with grouped MSW overrides.
- Add a presentational `NetworkWorkspaceShell` story file using existing network fixtures for component-level layout checks.
- Keep and tighten the existing create-channel dialog story with args/docs/JSDoc.
- Add a missing `POST /api/network/send` MSW handler so Storybook interactions stay fully mocked.

State:

- Implementation complete for web/network Storybook scope; final root verification blocked by unrelated Go lint in `internal/task/hooks_test.go`.

Done:

- Read relevant workspace instructions, web instructions, design-system summary, Storybook/MSW prior ledger, network pages prior ledger, and required skill guidance.
- Confirmed worktree has unrelated dirty files; they will be ignored.
- Inspected Storybook grouped MSW helper, route story patterns, network route, network hooks, component props, and network mock fixtures/handlers.
- Added network route stories under `web/src/routes/_app/stories/-network.stories.tsx`.
- Added `NetworkWorkspaceShell` component stories under `web/src/systems/network/components/stories/network-workspace-shell.stories.tsx`.
- Tightened `NetworkCreateChannelDialog` story docs/JSDoc/args.
- Added `POST /api/network/send` MSW handler and regression coverage.
- Updated Storybook story/fixture regression test to import the new network stories.
- Verification passed:
  - `bun run --cwd web test:raw src/systems/network/mocks/network-mocks.test.ts src/storybook/web-storybook-stories-and-fixtures.test.tsx`
  - `make web-lint`
  - `make web-typecheck`
  - `bun run --cwd web build-storybook`
- `make verify` failed in existing/unrelated Go lint: `internal/task/hooks_test.go:398 context-as-argument`.

Now:

- Awaiting user direction on whether to fix unrelated `internal/task/hooks_test.go` lint so `make verify` can pass.

Next:

- If approved, make the minimal unrelated lint fix and rerun `make verify`.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: User approval to edit unrelated `internal/task/hooks_test.go`.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-26-MEMORY-web-network-storybook.md`
- `web/.storybook/preview.ts`
- `web/src/storybook/**`
- `web/src/routes/_app/stories/**`
- `web/src/routes/_app/network.tsx`
- `web/src/systems/network/**`
- `bun run --cwd web test:raw src/systems/network/mocks/network-mocks.test.ts src/storybook/web-storybook-stories-and-fixtures.test.tsx`
- `make web-lint`
- `make web-typecheck`
- `bun run --cwd web build-storybook`
- `make verify` (failed: unrelated lint)
