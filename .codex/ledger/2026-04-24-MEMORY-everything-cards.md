Goal (incl. success criteria):

- Update `packages/site` section "Everything a modern agent runtime should have." to show 6 cards using illustrations from `packages/site/public/images/everything`.
- Keep the existing section layout/header copy intact; only adjust the cards/content below.
- Update requested follow-up: all six cards must have the same width.
- Update requested follow-up: replace prior `ig_*` assets with newly-added `illustration_01.png` through `illustration_06.png` from the same folder.
- Update requested follow-up: remove the illustration container border/background so transparent PNGs remain transparent.
- Update requested follow-up: replace the left rail image in the "A daemon built for sessions, not chats." section with `packages/site/public/images/runtime/illustration_1.png`.

Constraints/Assumptions:

- Follow root/user instructions: no destructive git commands, do not touch unrelated files, no workarounds.
- Use `agh-design`, `design-taste-frontend`, `minimalist-ui`, `no-workarounds`, and `cy-final-verify` for this UI change.
- `make verify` is the global gate, but site-specific verification may be more appropriate if this is frontend-only.

Key decisions:

- Use the existing 6 assets in `packages/site/public/images/everything` and map them to Sessions, Observability, Skills, Memory, Automation, and Workspaces based on visual content.
- Keep `SectionFrame` and `SectionHeader` unchanged; refactor only the cards/list below the header.
- Do not add dependencies; use native `<img>` like the existing landing bento section.

State:

- Runtime section illustration swap completed and verified.

Done:

- Read named skill instructions from disk.
- Listed existing ledger files for cross-agent awareness.
- Read relevant 2026-04-24 site/bento ledgers for cross-agent awareness.
- Inspected `features-section.tsx`, tests, design tokens, package scripts, reference image, and all 6 `everything` assets.
- Refactored `FeaturesSection` from 8 icon cards to 6 illustrated cards while preserving `SectionFrame` and `SectionHeader`.
- Updated focused `FeaturesSection` tests for 6 cards and the six local image sources.
- `cd packages/site && bun run typecheck` passed.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx -t FeaturesSection` passed: 2 tests, 17 skipped.
- `cd packages/site && bun run build` passed.
- `make verify` passed.
- Note: `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx` failed on an existing `BentoSection` assertion for missing text `One local daemon. Every session. Every event.`; not changed because it is unrelated pre-existing work in the dirty tree.
- Removed asymmetric `lg:col-span-*` card spans and changed the feature grid to equal columns: `md:grid-cols-2 lg:grid-cols-3`.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx -t FeaturesSection` passed after equal-width patch.
- `cd packages/site && bun run typecheck` passed after equal-width patch.
- `cd packages/site && bun run build` passed after equal-width patch.
- First `make verify` after the equal-width patch failed once in unrelated `internal/session TestPromptActivitySupervisorTimeoutCancelsThenStopsSession` (`driver stop calls = 0, want 1`).
- Isolated rerun `go test -race ./internal/session -run TestPromptActivitySupervisorTimeoutCancelsThenStopsSession -count=1 -v` passed.
- Final rerun `make verify` passed: 5773 tests and package boundaries OK.
- Found newly added assets `illustration_01.png` through `illustration_06.png`, all 1480x1063 with alpha.
- Updated `FeaturesSection` image sources to new illustrations: Sessions=01, Memory=02, Skills=04, Workspaces=05, Automation=06, Observability=03.
- Changed card image fit from `object-cover` to `object-contain` to avoid cropping the transparent illustration assets.
- Updated focused `FeaturesSection` test expected image sources to the new `illustration_*.png` files.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx -t FeaturesSection` passed after illustration swap.
- `cd packages/site && bun run typecheck` passed after illustration swap.
- `cd packages/site && bun run build` passed after illustration swap.
- `make verify` failed immediately on unrelated stale generated API output: `openapi/agh.json: generated file is stale; run codegen`. Status shows unrelated API/observe/config changes in the dirty tree; no codegen run was performed to avoid touching unrelated work.
- Removed `border border-(--color-divider) bg-(--color-canvas-deep)` from the illustration wrapper in `FeaturesSection`; card border/background remains unchanged.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx -t FeaturesSection` passed after transparent-wrapper change.
- `cd packages/site && bun run typecheck` passed after transparent-wrapper change.
- `cd packages/site && bun run build` passed after transparent-wrapper change.
- `make verify` still fails immediately on unrelated stale generated API output: `openapi/agh.json: generated file is stale; run codegen`.
- Replaced the left rail micro-diagram in `RuntimeSection` with `/images/runtime/illustration_1.png` while preserving the surrounding section layout and copy.
- Removed the now-unused `RuntimeMicroDiagram` import from `runtime-section.tsx`.
- Added a focused `RuntimeSection` test asserting the runtime illustration path.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx -t RuntimeSection` passed: 3 tests passed, 17 skipped.
- `cd packages/site && bun run typecheck` passed.
- `cd packages/site && bun run build` passed.
- Latest `make verify` run completed with exit code 0; final line: `OK: all package boundaries respected`.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-24-MEMORY-everything-cards.md`
- `packages/site/components/landing/features-section.tsx`
- `packages/site/components/landing/runtime-section.tsx`
- `packages/site/components/landing/__tests__/landing.test.tsx`
- `packages/site/public/images/everything/`
- `packages/site/public/images/runtime/illustration_1.png`
- Reference image: `docs/design/generated/ig_0422c056d5581df80169ebb62a383c819a8376cc62dc36d864.png`
