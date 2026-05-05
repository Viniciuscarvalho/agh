Goal (incl. success criteria):

- Resolve the current review batch with root-cause fixes only.
- Success means every still-applicable finding is either fixed or proven obsolete, targeted tests pass, and `make verify` passes.

Constraints/Assumptions:

- No destructive git commands.
- Must use root-cause debugging, not symptom patches.
- Must not touch unrelated work.
- Current worktree started clean.

Key decisions:

- Group findings by root cause instead of applying comment-by-comment edits.
- Treat runtime/API behavior changes separately from test-only cleanups.

State:

- Implemented and verifying fixes; targeted unit and integration suites are passing.

Done:

- Scanned ledger directory for cross-agent awareness.
- Confirmed worktree is clean.
- Ran a repo-wide grep over the reported hotspots.
- Fixed runtime/API issues: prompt bind error exposure, lifecycle cancel safety, daemon PID injection, frontmatter sentinel preservation, parser constant cleanup, workspace wrapper removal, notifier interface assertion, and dream-session stop context handling.
- Fixed test/maintenance issues: removed empty transport scaffolding files, tightened stale stop-status expectations, improved SSE test parsing, hardened helper bounds checks, removed redundant test-only interface check, updated brittle assertions/subtests/import grouping, and removed duplicate `procutil.Alive` coverage from memory tests.
- Passed targeted unit tests for touched packages.
- Passed targeted integration tests for `internal/api/httpapi`, `internal/api/udsapi`, and `internal/daemon`.

Now:

- Run the repo verification gate and address any remaining failures.

Next:

- Run `make verify`.
- Fix any verification fallout.
- Summarize outcomes and residual risks.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether some wrapper/comment/documentation findings are intentionally retained by prior refactors.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-07-MEMORY-review-issues.md`
- Review batch from CodeRabbit run `5996c634-6a84-4c31-b7cb-a9d1a00f3019`
- Commands: `git status --short`, `rg -n ... internal`, `go test ...`, `go test -tags integration ...`, `gofmt -w ...`
