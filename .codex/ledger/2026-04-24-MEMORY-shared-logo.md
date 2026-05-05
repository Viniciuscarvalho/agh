Goal (incl. success criteria):

- Implement the accepted shared-logo plan: add a `Logo` primitive in `@agh/ui`, replace site/web/remotion logo usages, remove the site-local text logo, and pass required checks.

Constraints/Assumptions:

- Follow AGENTS.md: no destructive git commands, do not touch unrelated changes, persist accepted Plan mode plans under `.codex/plans/`.
- Existing unrelated worktree change: `.compozy/tasks/hermes/_techspec.md` must remain untouched.
- UI work follows `DESIGN.md`, `@agh/ui` token policy, and AGH dark operator brand rules.
- SVG `viewBox` values are authoritative: full logo `972x386`, lettering `543x362`, symbol `355x355`.
- No new dependencies.

Key decisions:

- Add `Logo` to `packages/ui/src/components/logo.tsx` and export from `@agh/ui`.
- Support variants `logo`, `symbol`, and `lettering` with accessible/decorative modes.
- Compose the full logo from shared symbol and lettering path groups to avoid duplicating full-logo paths.
- Remove `packages/site/components/logo.tsx` instead of keeping a shim.

State:

- Complete.

Done:

- Read relevant repo instructions, existing logo usages, package exports, design tokens, and prior brand ledger.
- Persisted accepted plan to `.codex/plans/2026-04-24-shared-logo.md`.
- Added `Logo` primitive, tests, story, public export, and README inventory entry in `packages/ui`.
- Replaced site header/layout, web sidebar rail logo, and Remotion rail icon with the shared primitive.
- Removed `packages/site/components/logo.tsx`.
- Ran targeted tests after fixing test assertions for SVG class attributes and the site project's matcher setup:
  `bun run --cwd packages/ui test -- src/components/logo.test.tsx`,
  `bun run --cwd web test:raw -- src/components/app-sidebar.test.tsx`,
  `bun run --cwd packages/site test -- components/site/home-header.test.tsx`.
- Passed `bun run --cwd packages/site typecheck`, `make web-typecheck`, `make web-lint`,
  scoped `bunx oxlint`, scoped `bunx oxfmt --check`, `git diff --check`, and `make verify`.
- `bun run --cwd packages/ui typecheck` remains blocked by pre-existing `src/components/accordion.test.tsx`
  readonly-array type error unrelated to this task; file left untouched.

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/plans/2026-04-24-shared-logo.md`
- `.codex/ledger/2026-04-24-MEMORY-shared-logo.md`
- Changed files: `packages/ui/src/components/logo.tsx`, `packages/ui/src/components/logo.test.tsx`, `packages/ui/src/components/stories/logo.stories.tsx`, `packages/ui/src/index.ts`, `packages/ui/README.md`, `packages/site/components/site/home-header.tsx`, `packages/site/components/site/home-header.test.tsx`, `packages/site/lib/layout.shared.tsx`, `packages/site/remotion/hero/components/sidebar-rail.tsx`, `web/src/components/app-sidebar.tsx`, `web/src/components/app-sidebar.test.tsx`.
