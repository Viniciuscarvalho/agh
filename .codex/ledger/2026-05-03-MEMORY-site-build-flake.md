Goal (incl. success criteria):

- Find the root cause of the flaky `packages/site` production build failing with `You need to wrap your application inside FrameworkProvider.` and implement a structural fix that makes repeated `bun run build` executions deterministic.

Constraints/Assumptions:

- Conversation in Brazilian Portuguese; code/artifacts remain in English.
- Use `systematic-debugging`, `no-workarounds`, `context7`, `exa-web-search-free`, and `next-best-practices`.
- Do not touch unrelated dirty files in the worktree.
- Must validate against current Fumadocs/Next.js guidance before changing site architecture.

Key decisions:

- Treat the existing RootProvider move in `packages/site/app/layout.tsx` as an attempted fix, not as evidence that the root cause is understood.
- Reproduce the failure in the current dirty tree before proposing another change.
- Compare the local provider/layout structure against official Fumadocs RootProvider guidance and current Next.js 16/Turbopack issues.

State:

- Session started 2026-05-03 for the site build flake investigation.
- Root cause for the `FrameworkProvider` prerender failure is confirmed; the original failure no longer reproduces after the boundary fix.

Done:

- Read root instructions supplied in the prompt.
- Read `packages/site/CLAUDE.md` and `packages/site/AGENTS.md`.
- Scanned other ledgers for cross-agent awareness and read final-QA-related ledgers for context.
- Inspected current site structure: `app/layout.tsx`, runtime/protocol/home/blog layouts, shared layout options, and Fumadocs-dependent header/sidebar components.
- Confirmed the worktree already contains an in-progress attempt that moved `RootProvider` to the root layout and removed nested providers from runtime/protocol layouts.
- Started a fresh `cd packages/site && rm -rf .next out && bun run build` reproduction on the current state.
- Reproduced the original failure exactly: prerendering `/runtime/cli-reference/vault/get` crashed with `You need to wrap your application inside FrameworkProvider.` during `Generating static pages using 15 workers`.
- Inspected the emitted SSR chunk and verified the thrown error comes from `fumadocs-core/dist/framework/index.js` default context guards.
- Confirmed the Fumadocs docs still require `RootProvider` in the root layout, so provider placement alone is not the full explanation.
- Confirmed external Next.js 16/Turbopack evidence of duplicated server-side module/class/context instances across chunks via Exa research.
- Identified the local boundary problem: `packages/site/components/site/docs-header.tsx` and `packages/site/components/site/sidebar-compact-tree.tsx` imported `Link` / `usePathname` directly from `fumadocs-core`, while the site provider came through `fumadocs-ui/provider/next`.
- Replaced those direct `fumadocs-core` imports with `next/link` and `next/navigation` so custom site components no longer depend on `FrameworkContext`.
- Updated affected tests to match the new Next.js-native boundary and the already-moved root provider placement.
- Verified focused tests passed:
  - `cd packages/site && bunx vitest run components/site/docs-header.test.tsx lib/section-layouts.test.tsx`
- Verified no direct `fumadocs-core/framework` or `fumadocs-core/link` imports remain under `packages/site`.
- Re-ran two clean `bun run build` executions. Both progressed through:
  - `Compiled successfully`
  - `Finished TypeScript`
  - `Collecting page data using 15 workers`
  - `Generating static pages using 15 workers (1035/1035)`
- Both post-fix builds failed only on a new, separate blocker:
  - `EISDIR: illegal operation on a directory, copyfile '.next/server/app/llms.mdx/protocol.body' -> 'out/llms.mdx/protocol'`
- Ran the full repository gate successfully after the changes:
  - `make verify`
  - Result: passed through bun lint, bun typecheck, bun test, web build, Go fmt/lint/test/build, and boundaries.

Now:

- Final handoff for the FrameworkProvider investigation; the confirmed remaining `packages/site build` blocker is the `llms.mdx` static export path collision (`EISDIR`).

Next:

- Optional follow-up: investigate the `llms.mdx` static export path collision and the `contentType` route export typing failure if the goal expands from “fix the FrameworkProvider flake” to “make packages/site build fully green”.

Open questions (UNCONFIRMED if needed):

- Resolved for the original issue: provider placement was necessary but insufficient; the failing boundary was direct app-level dependency on `fumadocs-core` framework hooks/components under Turbopack.
- UNCONFIRMED: whether the remaining `llms.mdx` export failure is caused by a route/file naming collision introduced by the new LLM text surfaces or by an output-export limitation with dotted route segments.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-03-MEMORY-site-build-flake.md`
- `packages/site/app/layout.tsx`
- `packages/site/app/(home)/layout.tsx`
- `packages/site/app/blog/layout.tsx`
- `packages/site/app/runtime/layout.tsx`
- `packages/site/app/protocol/layout.tsx`
- `packages/site/components/site/docs-header.tsx`
- `packages/site/components/site/sidebar-compact-tree.tsx`
- `packages/site/components/site/docs-header.test.tsx`
- `packages/site/lib/section-layouts.test.tsx`
- `packages/site/lib/layout.shared.tsx`
- `packages/site/next.config.mjs`
- `cd packages/site && rm -rf .next out && bun run build`
- `cd packages/site && bunx vitest run components/site/docs-header.test.tsx lib/section-layouts.test.tsx`
- `cd packages/site && bun run typecheck`
- `npx ctx7@latest library next.js "Next 16 prerender error debug build paths static export"`
- `npx ctx7@latest docs /vercel/next.js "Next 16 debug build paths next build prerender errors turbopack default bundler"`
- `mcporter call 'exa.web_search_exa(query: "Fumadocs RootProvider root layout next app router official docs", numResults: 5, type: "deep")'`
- `mcporter call 'exa.web_search_exa(query: "Next.js 16 Turbopack FrameworkProvider duplicate context fumadocs usePathname prerender", numResults: 8, type: "deep")'`
