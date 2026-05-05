## Goal (incl. success criteria):

- Bootstrap dual Storybook infrastructure for `packages/ui` and `web` per `.compozy/tasks/storybook-stories/task_01.md`.
- Success requires: new `packages/ui/.storybook` config and scripts, web MSW + QueryClient + router decorator wiring, generated `web/public/mockServiceWorker.js`, required tests/validation passing, workflow memory/task tracking updated, and one local commit after clean verification.

## Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read and follow repo `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`, task docs, techspec, ADR-001, ADR-002.
- Do not modify `packages/ui/src/` source files.
- JS dependencies must be added via `bun add`, not hand-edited.
- Must avoid destructive git commands; worktree currently shows untracked `.compozy/tasks/storybook-stories/`.

## Key decisions:

- Serve `web/public` through `web/.storybook/main.ts` `staticDirs` so Storybook can load the generated MSW worker.
- Keep `packages/ui` Storybook isolated to `@agh/ui/tokens.css` plus a local preview stylesheet; no web runtime providers or styles.
- Use `@tailwindcss/vite` in `packages/ui/.storybook/main.ts` and `web/vitest.config.ts` so Tailwind v4 preview CSS imports compile in both Storybook and test runs.
- Keep Storybook bootstrap unit coverage in the existing web Vitest harness and use a Playwright smoke test for the live MSW registration path.

## State:

- Completed. Implementation is committed and all required verification commands are green on `HEAD`.

## Done:

- Read required skill files, workflow memory files, task docs, `_techspec.md`, `_tasks.md`, ADR-001, ADR-002.
- Read repo and web instruction files.
- Added `packages/ui` Storybook 10 config, scripts, and addons with a dedicated `preview.ts` importing `@agh/ui/tokens.css`.
- Extended web Storybook with MSW initialization/loading, story-scoped TanStack Query, and a memory-history router decorator while preserving the theme decorator.
- Added `msw` and `msw-storybook-addon` to the web workspace and generated `web/public/mockServiceWorker.js`.
- Added Storybook unit tests plus a Playwright bootstrap spec and ran `packages/ui` and `web` Storybook build/start validations.
- Ran `make web-lint`, `make web-typecheck`, `make web-test`, and `make verify` successfully.
- Created local commit `6d64755` (`feat: bootstrap dual storybook infrastructure`).

## Now:

- Prepare the final handoff with verification evidence and note the non-committed tracking artifacts.

## Next:

- Wait for the next task or follow-up.

## Open questions (UNCONFIRMED if needed):

- None.

## Working set (files/ids/commands):

- `.compozy/tasks/storybook-stories/task_01.md`
- `.compozy/tasks/storybook-stories/_techspec.md`
- `.compozy/tasks/storybook-stories/_tasks.md`
- `.compozy/tasks/storybook-stories/adrs/adr-001.md`
- `.compozy/tasks/storybook-stories/adrs/adr-002.md`
- `.compozy/tasks/storybook-stories/memory/MEMORY.md`
- `.compozy/tasks/storybook-stories/memory/task_01.md`
- `.compozy/tasks/storybook-stories/_tasks.md`
- `web/.storybook/main.ts`
- `web/.storybook/preview.ts`
- `web/package.json`
- `web/public/mockServiceWorker.js`
- `web/src/storybook/web-storybook-config.test.tsx`
- `web/src/storybook/packages-ui-storybook-config.test.ts`
- `web/e2e/storybook-bootstrap.spec.ts`
- `web/vitest.config.ts`
- `web/src/test-setup.ts`
- `packages/ui/.storybook/main.ts`
- `packages/ui/.storybook/preview.ts`
- `packages/ui/.storybook/preview.css`
- `packages/ui/package.json`
