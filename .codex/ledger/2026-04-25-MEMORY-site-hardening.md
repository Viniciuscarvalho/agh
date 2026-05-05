Goal (incl. success criteria):

- Implement the accepted `packages/site` hardening plan for quality, performance, security, SEO, and verification.
- Success: package-local verification passes, bundle/asset budgets exist, static export remains supported, canonical domain is `https://agh.network`, and unrelated dirty files are not overwritten.

Constraints/Assumptions:

- Follow workspace rules: no destructive git commands; do not touch unrelated user changes.
- Preserve current user-owned site edits in protocol/runtime layouts, `components/site/docs-header.tsx`, `components/site/home-header.tsx`, and modified runtime storyboard image unless directly required and reviewed.
- Static export remains the deployment target.
- AGH design system: dark mode only, warm orange accent, flat depth, no emoji.

Key decisions:

- Use `next-best-practices`, `systematic-debugging`, `no-workarounds`, `agh-design`, `design-taste-frontend`, and `minimalist-ui`.
- Persist accepted plan to `.codex/plans/2026-04-25-site-hardening.md`.
- Use `https://agh.network` as canonical metadata base.

State:

- In progress.

Done:

- Scanned ledger directory and read recent site/runtime ledgers for cross-agent awareness.
- Read required skills and AGH design-system references.
- Captured current dirty worktree state; unrelated Go and site changes are present.
- Created this session ledger and persisted the accepted plan.

Now:

- Inspect package code and implement site hardening in focused layers.

Next:

- Refactor layout/providers, add metadata/security/error surfaces, image/asset budgets, tests, and verification scripts.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/plans/2026-04-25-site-hardening.md`
- `.codex/ledger/2026-04-25-MEMORY-site-hardening.md`
- `packages/site/`
