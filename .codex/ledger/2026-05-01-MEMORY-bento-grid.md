Goal (incl. success criteria):

- Recalculate `packages/site/components/landing/bento-section.tsx` so the desktop bento grid has 2 equal-width cards on the top row and 3 equal-width cards on the bottom row.
- Success: grid uses a larger column count with correct spans, bottom-row cards are taller, mobile stacking and AGH design rules are preserved, and relevant verification passes or blockers are reported.

Constraints/Assumptions:

- Follow workspace rules: no destructive git commands; do not touch unrelated user changes.
- Existing worktree is dirty, including the target file; preserve current content except the requested grid layout change.
- Site UI work must follow `packages/site/CLAUDE.md`, `DESIGN.md`, `agh-design`, `design-taste-frontend`, and `minimalist-ui`.
- `make verify` is required before completion unless blocked.

Key decisions:

- Use a 6-column desktop grid: top cards span 3 columns each; bottom cards span 2 columns each.
- Flatten the previous nested lower-right grid so all five bento cards participate in the same desktop grid.
- Increase desktop grid aspect to `1536/1320` and use two equal rows so the bottom-row cards gain height without changing widths.

State:

- In progress.

Done:

- Scanned `.codex/ledger/` for cross-agent awareness and read relevant prior site/bento ledgers.
- Read `packages/site/CLAUDE.md`, `DESIGN.md`, `docs/design/design-system/README.md`, required UI/design skills, package scripts, current `bento-section.tsx`, and `git status --short`.
- Patched `BentoSection` to use a 6-column desktop grid and flattened the lower row so all five cards share one grid.
- Added desktop spans: Runtime/Network `lg:col-span-3`, Bridges/Memory/Extensibility `lg:col-span-2`.
- `cd packages/site && bun run typecheck` passed.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx` passed: 27 tests.
- `cd packages/site && bun run build` passed.
- User requested only increasing bottom card height.
- Updated `BentoSection` grid from `lg:aspect-[1536/1180] lg:grid-rows-[1.12fr_0.88fr]` to `lg:aspect-[1536/1320] lg:grid-rows-2`.
- The in-flight `make verify` attempt failed in unrelated Go test `internal/daemon TestSettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen`: got MCP auth status `"expired"`, wanted `"authenticated"`.
- Re-ran focused site checks after the height change: `cd packages/site && bun run typecheck` passed.
- Re-ran focused landing test after the height change: `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx` passed: 27 tests.
- Re-ran site production build after the height change: `cd packages/site && bun run build` passed.

Now:

- Final response.

Next:

- None unless user wants visual tuning.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-01-MEMORY-bento-grid.md`
- `packages/site/components/landing/bento-section.tsx`
