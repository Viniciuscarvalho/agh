Goal (incl. success criteria):

- Remediate the `secaudit` CodeRabbit review batch for PR 90 round 001 in `/Users/pedronauck/Dev/compozy/agh2`. Success means every scoped issue file is triaged and closed correctly, valid findings are fixed with tests, `make verify` passes, and exactly one local commit is created.

Constraints/Assumptions:

- Scope is limited to the 10 issue files under `.compozy/tasks/secaudit/reviews-001/` plus the code/test changes required to resolve valid findings.
- Do not use destructive git commands or provider-specific review-resolution commands.
- Use `cy-fix-reviews` as workflow authority and `cy-final-verify` before completion/commit.
- Conversation in Brazilian Portuguese; code/artifacts in English.

Key decisions:

- Work in `agh2` because the batch scope and review artifacts point there.
- Treat previous security ledgers as cross-agent context only; verify each issue against current code before changing anything.
- Likely invalid items are pure dedup/refactor suggestions that would expand scope beyond the batch without closing a concrete regression.

State:

- Completed; all scoped review items were triaged and closed, fixes landed with regression coverage, pre- and post-commit verification passed, and one local remediation commit was created.

Done:

- Confirmed active repo and worktree state.
- Loaded root/internal/site instructions plus required skills.
- Read the two recent security ledgers for context.
- Read all 10 scoped issue files.
- Inspected current source/tests for every cited location.
- Marked issues 001/002/003/005/006/007/009/010 valid and issues 004/008 invalid; all 10 issue files are now resolved.
- Fixed Linear and Teams credentialed redirect handling with regression tests.
- Tightened the Telegram missing-secret assertion.
- Added `t.Parallel()` to the unsafe-name managed install subtests.
- Fixed replay dedupe retention for future-skewed envelopes and extended raw-secret validation into `Envelope.Proof`.
- Hardened `packages/site/public/install.sh` by restricting trusted cosign identities to release tags and resolving `latest` to a concrete release tag before asset downloads.
- Focused verification passed: `go test` on the touched Go packages, `bunx vitest run packages/site/lib/public-install-contract.test.ts`, and `sh -n packages/site/public/install.sh`.
- Full verification passed: `make verify` with `DONE 7768 tests in 86.507s` and `OK: all package boundaries respected`.
- Created the local remediation commit: `8293453b` (`fix: remediate secaudit review batch (#90)`).
- Post-commit verification passed: `make verify` with `DONE 7768 tests in 12.498s` and `OK: all package boundaries respected`.

Now:

- No active work remaining in this batch.

Next:

- Report completion details and verification evidence to the user.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-03-MEMORY-secaudit.md`
- Review files: `.compozy/tasks/secaudit/reviews-001/issue_001.md` … `issue_010.md`
- Code files: `extensions/bridges/linear/api.go`, `extensions/bridges/teams/provider.go`, `extensions/bridges/telegram/provider_test.go`, `internal/api/core/tools.go`, `internal/extension/install_managed_test.go`, `internal/network/router.go`, `internal/network/validate.go`, `internal/subprocess/process.go`, `packages/site/public/install.sh`
- Candidate supporting tests: `extensions/bridges/linear/provider_test.go`, `extensions/bridges/teams/provider_test.go`, `internal/network/router_test.go`, `internal/network/manager_test.go`, `internal/network/validate_test.go`, `packages/site/lib/public-install-contract.test.ts`
