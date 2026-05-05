Goal (incl. success criteria):

- Add a sixth "read more" card to the home extensibility card grid, linking to the extensions docs page.

Constraints/Assumptions:

- Follow AGH dark-mode brand tokens and site design system.
- User explicitly requested design-taste-frontend and minimalist-ui; AGENTS also requires agh-design for UI work.
- Do not use destructive git commands.
- Conversation in Brazilian Portuguese; code/artifacts in English.

Key decisions:

- Use `/runtime/core/extensions` as the docs route; confirmed by `packages/site/content/runtime/core/extensions/index.mdx`.
- Keep the sixth grid item intentionally sparse: one icon well and one docs link, matching AGH card tokens without adding extra copy.

State:

- Implemented; focused verification in progress.

Done:

- Scanned ledger directory for cross-agent awareness.
- Loaded root DESIGN.md and agh-design skill summary.
- Read `packages/site/CLAUDE.md`, `packages/site/AGENTS.md`, design-system README, and relevant bento/home ledgers.
- Located `packages/site/components/landing/extensibility-section.tsx`.
- Added the sixth read-more card and updated the landing test expectation.
- First focused check found a test-only assertion issue: jest-dom matcher was not typed and visible accessible name differed from the aria label; adjusted to `getAttribute`.

Now:

- Run focused site typecheck/test/build.

Next:

- Run or report the full `make verify` gate after focused checks.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- .codex/ledger/2026-05-01-MEMORY-extensibility-read-more-card.md
- packages/site/components/landing/extensibility-section.tsx
- packages/site/components/landing/**tests**/landing.test.tsx
