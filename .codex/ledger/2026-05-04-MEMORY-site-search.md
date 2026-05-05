Goal (incl. success criteria):

- Restore Fumadocs search in `packages/site` so the search trigger works from both the home shell and docs shell, with runtime search served by Next.js and results spanning Runtime docs, AGH Network docs, blog posts, and changelog entries.
- Success means `/api/search?query=...` returns live results, the default Fumadocs search dialog works on `/` and docs routes, static-export-only assumptions are removed, and focused `packages/site` verification passes.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md` plus `packages/site/CLAUDE.md`.
- Use `fumadocs`, `systematic-debugging`, `no-workarounds`, `next-best-practices`, `context7`, and `exa-web-search-free`.
- Do not touch unrelated dirty files under `internal/`; another agent is working elsewhere in the repo.
- User explicitly wants the site off static export and onto standard Next.js runtime output.
- Blog indexing depth is limited to title + description + excerpt + TOC headings.
- Changelog indexing is limited to summary plus structured release bullet lists.

Key decisions:

- Treat the broken search as a server/client contract bug, not a missing-header bug.
- Keep the existing `HomeHeader` / `DocsHeader` search trigger slots; they already render in the current repo state.
- Remove `output: "export"` and the deterministic static-export build id from `packages/site/next.config.mjs`.
- Keep Fumadocs on its default fetch client and make that explicit in `RootProvider` against `/api/search`.
- Build a single merged advanced search index from runtime docs, protocol docs, posts, and releases.

State:

- Completed.

Done:

- Read root instructions plus `packages/site/CLAUDE.md`.
- Scanned other ledgers for cross-agent awareness.
- Reproduced the bug and confirmed the trigger exists on both `/` and `/runtime` while search still fails.
- Identified root cause: `RootProvider` defaults to fetch search, but `app/api/search/route.ts` exports `staticGET` because the site is configured with `output: "export"`.
- Confirmed with external Fumadocs docs that `staticGET` requires the client to use `type: "static"` and that the default client is `type: "fetch"`.
- Confirmed with Next.js docs that `output: "export"` is the static-export mode driving the current route compromise.
- Drafted the accepted implementation plan and prepared the affected file set.
- Persisted the accepted plan under `.codex/plans/2026-05-04-site-search.md`.
- Removed static-export-only search wiring from `packages/site/next.config.mjs` and deleted the obsolete deterministic static build-id helper.
- Made `RootProvider` explicitly use the default Fumadocs fetch client against `/api/search`.
- Added `packages/site/lib/public-search-index.ts` to build one merged advanced search index for runtime docs, protocol docs, blog posts, and changelog releases.
- Switched `packages/site/app/api/search/route.ts` to live `GET` search results from `createSearchAPI("advanced", ...)`.
- Updated site tests for the live query route, explicit provider config, and non-static Next.js config assumptions.
- Focused verification passed:
  - `cd packages/site && bun run typecheck`
  - `cd packages/site && bun run test -- app/global.test.ts lib/public-search-index.test.ts lib/static-export-determinism.test.ts components/site/home-header.test.tsx components/site/docs-header.test.tsx`
  - `cd packages/site && bun run test`
  - `cd packages/site && bun run build`
- Monorepo gate attempt:
  - `make verify` failed immediately in `codegen-check` with `openapi/agh.json: generated file is stale; run codegen`
  - This is outside the `packages/site` search change and matches the concurrent unrelated work already present under `internal/`.
- Dev smoke verification passed:
  - `curl -s 'http://localhost:3000/api/search/?query=workspace'`
  - `curl -s 'http://localhost:3000/api/search/?query=workplace'`
  - `curl -s http://localhost:3000/ | rg -o 'data-search-full=|data-search='`
  - `curl -s http://localhost:3000/runtime/ | rg -o 'data-search-full=|data-search='`

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-04-MEMORY-site-search.md`
- `.codex/plans/2026-05-04-site-search.md`
- `packages/site/next.config.mjs`
- `packages/site/app/layout.tsx`
- `packages/site/app/api/search/route.ts`
- `packages/site/lib/blog.ts`
- `packages/site/lib/public-search-index.test.ts`
- `packages/site/lib/static-export-determinism.test.ts`
- External refs: Fumadocs built-in search/static export docs, Next.js static export docs
