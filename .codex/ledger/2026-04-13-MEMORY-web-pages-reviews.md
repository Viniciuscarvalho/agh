Goal (incl. success criteria):

- Resolve CodeRabbit review round `001` batch for PR `18` under `.compozy/tasks/web-pages/reviews-001`.
- Success means: every scoped issue file (`issue_021.md` through `issue_031.md`) is triaged with concrete reasoning, every valid issue has a production fix plus tests as needed, full required verification is green, and exactly one local commit is created.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, and `web/CLAUDE.md`.
- Required workflows: `cy-fix-reviews` as source of truth for remediation and `cy-final-verify` before completion/commit.
- Scoped code files are limited to the eight files listed in the batch unless a minimal extra change is absolutely required and documented.
- Update only the scoped review issue markdown files.
- Do not use destructive git commands or provider-specific resolution commands.

Key decisions:

- Load remediation/verification skill workflows first, then read every scoped issue file before editing code.
- Follow root-cause fixes only; no suppressions or workaround-style patches.

State:

- In progress.

Done:

- Loaded instructions from required skills: `cy-fix-reviews`, `cy-final-verify`.
- Loaded guardrail skills: `systematic-debugging`, `no-workarounds`, `testing-anti-patterns`.
- Read `web/AGENTS.md` and `web/CLAUDE.md`.
- Read related ledgers for cross-agent awareness: `2026-04-13-MEMORY-network-review-fix.md`, `2026-04-13-MEMORY-network-pages.md`.
- Read review round metadata from `.compozy/tasks/web-pages/reviews-001/_meta.md`.

Now:

- Load the web-specific implementation/testing skills that apply to the scoped files.
- Read every scoped issue file completely and triage them before touching code.

Next:

- Inspect the affected source/test files after triage.
- Implement fixes and verification-driven tests for valid issues.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-13-MEMORY-web-pages-reviews.md`
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
