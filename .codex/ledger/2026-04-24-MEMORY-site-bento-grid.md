Goal (incl. success criteria):

- Add a new sell-proposition bento section to `packages/site` that matches the provided reference image and uses existing bento illustration PNGs.
- Success: production code integrated in the site, design tokens respected, responsive layout, verified with project checks where feasible.

Constraints/Assumptions:

- Follow repo AGENTS/CLAUDE instructions: no destructive git commands; do not touch unrelated user changes.
- `make verify` is required before completion unless blocked.
- Use `imagegen` skill only where raster assets are appropriate; deterministic bento UI should be code-native.
- Site/design work must follow AGH dark mode, warm orange accent, flat depth, no emoji.

Key decisions:

- User chose to add a new section, preserving the existing `FeaturesSection`.
- Insert `BentoSection` after `FeaturesSection` and before `SupportedAgents`.
- Use existing assets under `packages/site/public/images/bento-illustrations/*-v2.png`; no image generation or new dependencies.
- Main propositions: Runtime, Network, Bridges, Memory, and Trace.

State:

- Refactor complete; verification passed.

Done:

- Read explicit imagegen skill instructions.
- Read AGH/design/minimalist/frontend/brainstorming skill summaries.
- Scanned ledger directory for cross-agent awareness.
- Read `DESIGN.md`, design-system README/tokens, current landing components, docs positioning pages, package scripts, and landing tests.
- Persisted accepted plan to `.codex/plans/2026-04-24-site-bento-section.md`.
- Added `BentoSection`, exported it, inserted it after `FeaturesSection`, and added landing tests for copy/assets.
- `cd packages/site && bun run test` passed: 7 files, 33 tests.
- `cd packages/site && bun run typecheck` passed.
- `cd packages/site && bun run build` passed.
- Visual check on existing `http://localhost:3000/#runtime-map`: desktop bento renders, mobile collapses to one column, images load, and anchor respects sticky header via `scroll-mt-24`.
- Final `make verify` passed before the visual correction request: 5743 tests and package boundaries OK.
- User rejected the result as visually incorrect against `docs/design/generated/bento_grid.png`.
- Root cause identified: implementation added an external section header and treated illustrations as full-bleed card backgrounds instead of reproducing the reference as a single five-tile bento canvas.
- Refactored `BentoSection` away from `BentoTile`/`BENTO_TILES`/generic `BentoCard`; it now has explicit `RuntimeCard`, `NetworkCard`, `BridgesCard`, `MemoryCard`, and `TraceCard` components.
- Focused landing test passed after refactor: `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx`.
- `cd packages/site && bun run typecheck` passed after refactor.
- Browser Use reload on `http://localhost:3000/#runtime-map` found all five bento cards rendered once.
- `cd packages/site && bun run test` passed: 7 files, 33 tests.
- `cd packages/site && bun run build` passed.
- Final `make verify` passed after refactor: format/lint/test/build plus 5743 Go tests and package boundaries OK.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-24-MEMORY-site-bento-grid.md`
- `.codex/plans/2026-04-24-site-bento-section.md`
- `packages/site/components/landing/bento-section.tsx`
- `packages/site/components/landing/index.ts`
- `packages/site/app/(home)/page.tsx`
- `packages/site/components/landing/__tests__/landing.test.tsx`
