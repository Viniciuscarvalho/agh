Goal (incl. success criteria):

- Fix the Storybook/MSW root-cause bug in `web/` so route stories and other local-override stories preserve required default handlers.
- Success = grouped MSW handler contract in Storybook, repo-wide migration away from array-based `msw.handlers`, regression tests for the contract, and clean browser verification plus required web gates.

Constraints/Assumptions:

- Must follow `web/AGENTS.md`/`web/CLAUDE.md` skill dispatch and zero-workaround policy.
- Must preserve existing lightweight stub router stories and the real app-router story path.
- Accepted plan must remain persisted in `.codex/plans/2026-04-18-storybook-route-stories-plan.md`.
- Do not touch unrelated worktree changes like `openapi/agh.json`.

Key decisions:

- Treat `msw-storybook-addon` reset semantics as the root cause, not individual story routing/data bugs.
- Change Storybook to publish grouped default handlers by domain and introduce a helper for per-group overrides.
- Compose story-level overrides against the default handlers of the same group so a route can override one endpoint without dropping sibling endpoints like providers, status, or detail loaders.
- Migrate override-based Storybook stories repo-wide so no story continues using raw array replacement.
- Keep tests focused on the handler-composition contract rather than mock-only assertions.

State:

- Completed.

Done:

- Re-read the session ledger, persisted plan artifact, and nearby ledgers for cross-agent awareness.
- Reproduced failures with `agent-browser` and narrowed the broken route stories to:
  - `routes-app-stories-bridges--empty`
  - `routes-app-stories-knowledge--content-loading`
  - `routes-app-stories-network--empty-channels`
  - `routes-app-stories-network--loading`
- Confirmed the failure mode is unpreserved default MSW handlers, not router mismatch.
- Inspected installed `msw-storybook-addon` implementation and confirmed `applyRequestHandlers()` resets handlers and reapplies only `context.parameters.msw`.
- Confirmed current preview publishes default handlers as a flat array, which makes story-level `msw.handlers` replace the full set.
- Counted affected override usage:
  - 17 route-story files
  - 25 Storybook files overall
- Updated `.codex/plans/2026-04-18-storybook-route-stories-plan.md` to the accepted root-cause plan.
- Added `web/src/storybook/msw.ts` with grouped default handler registry, flattening utilities, and composition helpers that preserve untouched handlers inside an overridden group while replacing matching endpoints by method/path signature.
- Updated `web/.storybook/preview.ts` to publish grouped default MSW handlers and re-export the grouped and flat registries for tests.
- Migrated all local-override route stories and affected component stories to `storybookMswParameters(...)` so no story continues using raw `msw: { handlers: [...] }`.
- Updated Storybook contract tests and added `web/src/storybook/msw.test.ts` for grouped override composition coverage.
- Verified the four originally broken stories render correctly with `agent-browser` after the helper fix:
  - `routes-app-stories-bridges--empty`
  - `routes-app-stories-knowledge--content-loading`
  - `routes-app-stories-network--empty-channels`
  - `routes-app-stories-network--loading`
- Ran a full `agent-browser` sweep of all route stories from `http://localhost:6008/index.json`:
  - total checked: 82
  - failures with non-`Error` variants rendering `Not Found`: 0
- Passed required web verification gates:
  - `make web-lint`
  - `make web-typecheck`
  - `bun run --cwd web build-storybook`

Now:

- Task complete. Ready to report implementation and verification outcomes.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-18-MEMORY-storybook-route-stories.md`
- `.codex/plans/2026-04-18-storybook-route-stories-plan.md`
- `web/.storybook/preview.ts`
- `web/src/storybook/route-story.tsx`
- `web/src/storybook/web-storybook-config.test.tsx`
- `web/src/storybook/web-storybook-msw-contract.test.ts`
- `web/src/routes/_app/stories/**`
- `web/src/routes/_app/settings/stories/**`
- `web/src/systems/**/components/stories/**`
- `agent-browser`
