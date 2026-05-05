Goal (incl. success criteria):

- Generate and integrate a replacement image for the `packages/site` landing page Memory section.
- Success = the Memory section no longer uses the off-style image; replacement matches AGH warm-dark operator visual language and existing page proportions.

Constraints/Assumptions:

- Use the `imagegen` skill with built-in `image_gen` by default.
- Follow `packages/site/CLAUDE.md`, root AGENTS.md, and `DESIGN.md`.
- No destructive git commands.
- Project asset must be saved inside the workspace; do not leave final image only under `$CODEX_HOME`.
- Conversation in BR-PT; code/artifacts in English.

Key decisions:

- Treat the asset as a project-bound generated bitmap, likely `infographic-diagram`/site illustration.
- Use AGH dark-only palette: canvas `#141312`, surfaces `#1E1C1B`/`#181716`, divider `#3C3A39`, accent `#E8572A`, sparse semantic status colors only.
- Prefer replacing only the targeted Memory image reference unless code inspection shows a better local pattern.

State:

- Completed, with full `make verify` blocked by an unrelated current worktree test failure.

Done:

- Scanned `.codex/ledger/` for cross-agent awareness.
- Read `imagegen` skill, `packages/site/CLAUDE.md`, `DESIGN.md`, and relevant landing/bento ledgers.
- Read `agh-design`, `design-taste-frontend`, and `minimalist-ui` skill guidance; project AGH design tokens override generic font/palette conflicts.
- Located the landing Memory image in `packages/site/components/landing/memory-dream-section.tsx`; current off-style asset was `1536x1024` at `/images/runtime/memory-overview-storyboard-v1.png`.
- Generated a new built-in `image_gen` 3:2 dark AGH memory diagram and saved it to `packages/site/public/images/runtime/memory-dream-landing-v1.png`.
- Updated the Memory section image `src`/`alt` and adjusted the landing test expectation.
- `cd packages/site && bun run typecheck` passed.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx` passed: 27 tests.
- `cd packages/site && bun run build` passed.
- `make verify` was attempted twice; latest run passed format/oxlint/typecheck and failed during root `bun run test` because `packages/site/lib/source.test.ts` imports `./source`, causing Vitest/Rolldown to parse `/content/runtime/cli-reference/task/run/start.mdx?collection=runtime` as JS. This file/change is outside this image replacement.

Now:

- Final response.

Next:

- None unless user wants the unrelated root test failure fixed.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-01-MEMORY-memory-section-image.md`
- `/Users/pedronauck/.codex/skills/.system/imagegen/SKILL.md`
- `packages/site/CLAUDE.md`
- `DESIGN.md`
- `packages/site/components/landing/memory-dream-section.tsx`
- `packages/site/components/landing/__tests__/landing.test.tsx`
- `packages/site/public/images/runtime/memory-dream-landing-v1.png`
- `/Users/pedronauck/.codex/generated_images/019de489-9b02-7333-8b88-e406b7805fe5/ig_027d71b995a9f7770169f4e0434e3c819aa9b8ebd0c8774c82.png`
