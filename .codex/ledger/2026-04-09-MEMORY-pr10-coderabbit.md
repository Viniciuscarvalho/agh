Goal (incl. success criteria):

- Remediate CodeRabbit review feedback for PR #10 by validating each finding against the current code, implementing only the warranted fixes, running the repo verification gates, and completing the review-thread workflow as far as local repo policy allows.

Constraints/Assumptions:

- Follow `/Users/pedronauck/Dev/projects/agh/AGENTS.md` and `CLAUDE.md`.
- Required skills in use: `fix-coderabbit-review`, `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`.
- Do not touch unrelated files or use destructive git commands.
- `ai-docs/` is gitignored and repo policy says never commit `ai-docs/`; tracking files there may be updated locally but must not be included in any git commit.
- Final repo gate is `make verify`; the skill’s JS checks (`bun run lint`, `bun run typecheck`, `bun run test`) may also be used when relevant, but the code under review is Go-heavy.

Key decisions:

- Use the repo-compatible exporter invocation (`bunx tsx`) instead of the skill’s `pnpm exec tsx`, which fails in this repository because it is configured for Bun.
- Triage every review item technically before changing code; invalid or already-satisfied comments should be recorded as such in the local review artifacts.
- Keep fixes root-cause oriented and verified with targeted tests before running the full gate.
- Decline the `t.Parallel()` suggestions for tests that call `t.Setenv()` directly or indirectly (`internal/config/hooks_test.go`, `internal/hooks/executor_test.go`) because Go forbids parallel environment mutation and those suggestions were incorrect for this codebase.
- Decline the large DTO decoupling change in `internal/api/contract/contract.go` and the hash-based fingerprint rewrite in `internal/hooks/hooks.go` for this remediation pass because they are architectural/premature-optimization suggestions, not correctness issues proven by current code or tests.
- Revert the optional `t.Parallel()` addition on `TestHooksConcurrentRebuildAndDispatch` after it amplified an unrelated suite-level session flake under `make verify`; keep the stress test serial for suite stability.
- Mark the outside-diff exporter entry resolved only in the local `ai-docs/` export because that comment does not correspond to a resolvable inline GitHub review thread.

State:

- Complete; tracked code is committed, verification passed, GitHub review threads are resolved, and the local export reflects the outside-diff disposition.

Done:

- Read repo instructions and required skill docs.
- Checked worktree status; no pre-existing tracked modifications were present at task start.
- Confirmed only the repo-root `AGENTS.md` applies to `internal/**`; `web/AGENTS.md` is out of scope unless web files are touched.
- Confirmed GitHub auth is available.
- Confirmed `ai-docs/` is gitignored in this repo.
- Read related hook ledgers for recent implementation context.
- Attempted the skill’s export command and confirmed it fails due to repo Bun configuration.
- Installed the exporter runtime deps in `.tmp/pr-review-env` and successfully exported `ai-docs/reviews-pr-10/` with 9 unresolved threads plus 1 outside-diff entry.
- Triaged the exported unresolved findings as valid and implemented the production/test fixes across hooks, config, daemon, and UDS.
- Triaged the user-pasted nitpicks and intentionally declined the invalid `t.Parallel()` suggestions for env-mutating tests plus the non-blocking contract/fingerprint refactors.
- Added regression coverage for wrapped config validation errors, nil-context/nil-dispatcher paths, invalid matcher patterns, nil executor catalog entries, and the new sentinel errors.
- Ran targeted package tests and then `make verify` successfully.
- Committed the tracked remediation as `b4c2bb3` (`fix: resolve PR #10 review issues`).
- Resolved GitHub review threads for exported issues 1-9 via the skill workflow.
- Updated the local `ai-docs/reviews-pr-10/` export so the outside-diff item is marked resolved with an explicit note that no GitHub review thread exists for it.

Now:

- Task complete; ready to report outcome to the user.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-09-MEMORY-pr10-coderabbit.md`
- `.agents/skills/fix-coderabbit-review/SKILL.md`
- `ai-docs/reviews-pr-10/`
- `internal/api/contract/contract.go`
- `internal/api/core/parsers.go`
- `internal/api/udsapi/handlers_test.go`
- `internal/config/agent.go`
- `internal/config/config.go`
- `internal/config/hooks.go`
- `internal/config/hooks_test.go`
- `internal/config/config_test.go`
- `internal/daemon/daemon_integration_test.go`
- `internal/daemon/hooks_bridge.go`
- `internal/daemon/notifier_test.go`
- `internal/hooks/*`
- Commands:
- `GITHUB_TOKEN=$(gh auth token) NODE_PATH=/Users/pedronauck/Dev/projects/agh/.tmp/pr-review-env/node_modules /Users/pedronauck/Dev/projects/agh/.tmp/pr-review-env/node_modules/.bin/tsx .claude/skills/fix-coderabbit-review/scripts/pr-review.ts 10 --hide-resolved`
- `go test ./internal/hooks ./internal/config ./internal/api/core ./internal/api/udsapi ./internal/daemon -count=1`
- `make verify`
- `bash .claude/skills/fix-coderabbit-review/scripts/resolve_pr_issues.sh --pr-dir ai-docs/reviews-pr-10 --from 1 --to 9`
