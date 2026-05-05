Goal (incl. success criteria):

- Fix the `packages/site` landing-page `CodeBlock` rendering bug where the block appears with two different background layers.
- Success means the duplicate background is removed at the source, the intended visual matches the design, and relevant verification passes.

Constraints/Assumptions:

- User explicitly requested `agent-browser` for browser-side reproduction and verification.
- Must follow `systematic-debugging` and `no-workarounds`: identify root cause before editing, no symptom patching.
- Avoid touching unrelated files in the dirty worktree.
- Current target is `packages/site`, not `web/`.

Key decisions:

- Investigate the actual rendered DOM/CSS before changing `CodeBlock`.
- Treat the extra background as likely caused by inherited/global styling until proven otherwise.

State:

- in_progress

Done:

- Read root workspace instructions and relevant skill instructions.
- Scanned existing ledgers for related site/frontend context.
- Located the component at `packages/site/components/landing/primitives/code-block.tsx`.
- Read `packages/site/app/global.css` and confirmed docs-only inline-code overrides exist.

Now:

- Start the site locally and reproduce the visual issue with `agent-browser`.
- Inspect the code block DOM/CSS to identify which element paints the second background.

Next:

- Apply a minimal root-cause fix.
- Run targeted verification and browser re-check.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the extra background is coming from Fumadocs preset CSS, Tailwind prose defaults, or element structure (`pre`/`code`/inner `div`s).

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-site-code-block.md`
- `packages/site/components/landing/primitives/code-block.tsx`
- `packages/site/components/landing/install-section.tsx`
- `packages/site/app/global.css`
- `agent-browser`
