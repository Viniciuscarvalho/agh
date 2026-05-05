Goal (incl. success criteria):

- Add consistent section borders to every section rendered by `packages/site/app/(home)/page.tsx`, matching the clear separators already present in the first three sections.
- Success: all home sections have AGH-style 1px divider separation, existing layout/content is preserved, and focused site verification is run or blockers are reported.

Constraints/Assumptions:

- Follow workspace rules: no destructive git commands; do not touch unrelated user changes.
- Worktree is already dirty, including landing files; preserve existing edits unless directly needed for section borders.
- Site UI work must follow `packages/site/CLAUDE.md`, `packages/site/AGENTS.md`, `DESIGN.md`, `agh-design`, `design-taste-frontend`, and `minimalist-ui`.
- `make verify` is the full required gate, but focused site checks may be run first for this scoped UI change.

Key decisions:

- Add bottom separators to sections after `BentoSection` instead of top separators to avoid doubling the existing `BentoSection` `border-y` boundary.
- Use the existing AGH divider token via Tailwind: `border-b border-(--color-divider)`.

State:

- Complete.

Done:

- Scanned `.codex/ledger/` for cross-agent awareness and read relevant site/bento memory.
- Read `packages/site/CLAUDE.md`, `packages/site/AGENTS.md`, `DESIGN.md`, `docs/design/design-system/README.md`, design tokens, and required UI/design skills.
- Inspected `packages/site/app/(home)/page.tsx`, section border search results, and `git status --short`.
- Patched all post-bento home sections with bottom dividers: memory, autonomy, features, extensibility, bridges, supported agents, install, comparison, final CTA.
- `cd packages/site && bun run typecheck` passed.
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx` passed: 27 tests.
- `cd packages/site && bun run build` passed.
- `make verify` failed in unrelated Go test `internal/daemon TestSettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen`: got MCP auth status `"expired"`, wanted `"authenticated"`.
- `git diff --check` on touched landing files passed.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-01-MEMORY-home-section-borders.md`
- `packages/site/app/(home)/page.tsx`
- `packages/site/components/landing/memory-dream-section.tsx`
- `packages/site/components/landing/autonomy-kernel-section.tsx`
- `packages/site/components/landing/features-section.tsx`
- `packages/site/components/landing/extensibility-section.tsx`
- `packages/site/components/landing/bridges-section.tsx`
- `packages/site/components/landing/supported-agents.tsx`
- `packages/site/components/landing/install-section.tsx`
- `packages/site/components/landing/comparison.tsx`
- `packages/site/components/landing/final-cta.tsx`
- `cd packages/site && bun run typecheck`
- `cd packages/site && bun run test -- components/landing/__tests__/landing.test.tsx`
- `cd packages/site && bun run build`
- `make verify`
- `git diff --check -- packages/site/components/landing/...`
