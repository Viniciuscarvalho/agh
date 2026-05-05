Goal (incl. success criteria):

- Resolve CodeRabbit review round `001` batch for PR `18` under `.compozy/tasks/web-pages/reviews-001`.
- Success means: every scoped issue file (`issue_021.md` through `issue_031.md`) is triaged with concrete reasoning, every valid issue has a production fix plus tests as needed, required verification is green, and exactly one local commit is created.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, and `web/CLAUDE.md`.
- Required workflows: `cy-fix-reviews` as source of truth for remediation and `cy-final-verify` before completion/commit.
- Required skills in use for this batch: `systematic-debugging`, `no-workarounds`, `react`, `vercel-react-best-practices`, `tanstack-query-best-practices`, `app-renderer-systems`, `vitest`, `testing-anti-patterns`.
- Scoped code files are limited to the eight files listed in the batch unless a minimal extra change is absolutely required and documented.
- Update only the scoped review issue markdown files.
- Do not use destructive git commands or provider-specific resolution commands.

Key decisions:

- Read and triage all scoped issue files before editing source files.
- Fix only root causes; no suppressions, timing hacks, or test-only production changes.
- Use full web verification before any completion claim or commit.

State:

- In progress.

Done:

- Loaded instructions from required skills: `cy-fix-reviews`, `cy-final-verify`.
- Loaded applicable web/debug/testing skills listed above.
- Read `web/AGENTS.md` and `web/CLAUDE.md`.
- Read related ledgers for cross-agent awareness: `2026-04-13-MEMORY-web-pages-reviews.md`, `2026-04-13-MEMORY-network-pages.md`, `2026-04-13-MEMORY-network-review-fix.md`.
- Read review round metadata from `.compozy/tasks/web-pages/reviews-001/_meta.md`.
- Read every scoped issue file completely and triaged all eleven issues.
- Marked `issue_026` invalid because optimistic channel insertion would require synthetic server-derived data and is not mandated by current mutation semantics.

Now:

- Implement the ten valid findings in scoped files.
- Touch `web/src/routes/_app/network.tsx` and `web/src/routes/_app/-network.test.tsx` minimally because the loading/error panel issues are caused by current route wiring and require regression coverage.

Next:

- Run focused web tests/type checks.
- Mark issue files `resolved` after code and verification are complete.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-14-MEMORY-web-pages-reviews.md`
- `.compozy/tasks/web-pages/reviews-001/_meta.md`
- `.compozy/tasks/web-pages/reviews-001/issue_021.md`
- `.compozy/tasks/web-pages/reviews-001/issue_022.md`
- `.compozy/tasks/web-pages/reviews-001/issue_023.md`
- `.compozy/tasks/web-pages/reviews-001/issue_024.md`
- `.compozy/tasks/web-pages/reviews-001/issue_025.md`
- `.compozy/tasks/web-pages/reviews-001/issue_026.md`
- `.compozy/tasks/web-pages/reviews-001/issue_027.md`
- `.compozy/tasks/web-pages/reviews-001/issue_028.md`
- `.compozy/tasks/web-pages/reviews-001/issue_029.md`
- `.compozy/tasks/web-pages/reviews-001/issue_030.md`
- `.compozy/tasks/web-pages/reviews-001/issue_031.md`
- `web/src/routes/_app/network.tsx`
- `web/src/routes/_app/-network.test.tsx`
- `web/src/systems/workspace/hooks/use-workspaces.test.tsx`
