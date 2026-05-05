Goal (incl. success criteria):

- Fix the first-load font blink on `packages/site` after Vercel deploy.
- Confirm the root cause in the site font pipeline, implement a structural fix, and verify the site no longer relies on a font-loading pattern that causes visible first-paint swapping.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md` plus `packages/site/CLAUDE.md` and `packages/site/AGENTS.md`.
- Use `systematic-debugging`, `no-workarounds`, `exa-web-search-free`, and `context7`.
- Do not touch unrelated dirty files or use destructive git commands.
- `make verify` must pass before completion.
- Conversation can be BR-PT; code and artifacts stay in English.

Key decisions:

- Treat the issue as a production font-loading bug until the built output proves otherwise.
- Trace the font flow end-to-end: design token -> `next/font` / local font declaration -> generated CSS/assets -> browser preload behavior.
- Prefer root-cause fixes in the font loading strategy over cosmetic CSS masking.
- Keep `packages/ui/src/tokens.css` font-source agnostic and let each surface own concrete font delivery.
- On `packages/site`, remove the unused local `NuixyberNext` declaration and switch the visible editorial `Playfair Display` face away from swap-based first paint.

State:

- In progress.

Done:

- Read root instructions, `packages/site/CLAUDE.md`, and `packages/site/AGENTS.md`.
- Scanned other ledger files for cross-agent awareness and read relevant site/Vercel ledgers.
- Confirmed current site font setup:
  - `Inter`, `JetBrains Mono`, `Playfair Display` via `next/font/google` in `packages/site/app/layout.tsx`
  - `NuixyberNext` via local `@font-face` in `packages/site/app/global.css`
- Confirmed `DESIGN.md` requires Inter + JetBrains Mono + Playfair Display + NuixyberNext.
- Used Context7 to confirm current `next/font` behavior: root-layout fonts are preloaded app-wide; `display` defaults to `swap`; local fonts can be moved under `next/font/local`.
- Used Exa research to confirm `swap`/preload behavior and the tradeoffs between `swap`, `block`, `fallback`, and `optional`.
- Reproduced the production asset path with `bunx next build` and inspected `.next/server/app/index.html` plus emitted font CSS.
- Confirmed the site already preloaded the Next-managed fonts; the visible blink was caused by `Playfair Display` being emitted with `font-display: swap`.
- Confirmed the site bundle also inherited `@fontsource` faces from `packages/ui/src/tokens.css`, duplicating the font pipeline for shared fonts.
- Patched the root cause:
  - `packages/site/app/layout.tsx`: switched `Playfair Display` to `display: "block"`.
  - `packages/site/app/global.css`: removed the unused site-local `NuixyberNext` `@font-face`.
  - `packages/ui/src/tokens.css`: removed concrete `fontsource` imports so shared tokens stay delivery-agnostic.
  - `web/src/styles.css`: moved the `fontsource` imports into the Vite web app, which owns them.
- Added/updated regression coverage:
  - `packages/site/app/global.test.ts`
  - `web/src/styles.test.ts`
- Focused verification passed:
  - `cd packages/site && bunx vitest run app/global.test.ts`
  - `cd web && bunx vitest run src/styles.test.ts`
  - `cd packages/site && bunx tsgo --noEmit`
- Rebuilt `packages/site` and re-inspected emitted CSS:
  - `Playfair Display` now emits `font-display:block`
  - duplicate `fontsource` traces (`jetbrains-mono-latin-500-normal`, etc.) are gone from the site bundle
- `packages/site` production build still ends on the pre-existing unrelated static export failure:
  - `EISDIR ... '.next/server/app/llms.mdx/protocol.body' -> 'out/llms.mdx/protocol'`

Now:

- Run the full repo verification gate.

Next:

- Report the final verification outcome and any unrelated residual blockers.

Open questions (UNCONFIRMED if needed):

- None on the font bug itself.
- UNCONFIRMED: whether the unrelated `packages/site` static export failure should be fixed in a separate workstream.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-04-MEMORY-site-font-flicker.md`
- `packages/site/app/layout.tsx`
- `packages/site/app/global.css`
- `packages/site/app/global.test.ts`
- `packages/ui/src/tokens.css`
- `web/src/styles.css`
- `web/src/styles.test.ts`
- `DESIGN.md`
