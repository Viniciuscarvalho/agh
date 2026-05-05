Goal (incl. success criteria):

- Remediate the `secaudit` CodeRabbit review batch for PR 90 round 002 in `/Users/pedronauck/Dev/compozy/agh2`. Success means all 6 scoped issue files are triaged and closed correctly, valid findings are fixed with regression coverage, `make verify` passes, and exactly one local commit is created.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/secaudit/reviews-002/issue_001.md` through `issue_006.md` and the code/test edits required to resolve valid findings in the user-listed files.
- Do not run destructive git commands or provider-specific review-resolution commands.
- Use `cy-fix-reviews` as the workflow source of truth and `cy-final-verify` before any completion claim or commit.
- Conversation in Brazilian Portuguese; code/artifacts stay in English.

Key decisions:

- Work in `agh2` because the batch scope and review artifacts point there.
- Treat the older `2026-05-03-MEMORY-secaudit.md` ledger as completed round-001 context only.
- All 6 review items are valid against the current code; fix them within the scoped files only.

State:

- Completed; all scoped issues are resolved, the remediation commit exists, and post-commit verification passed.

Done:

- Loaded root/internal/site instructions and the required skills.
- Read all 6 scoped round-002 issue files.
- Read the existing `secaudit`, `security-discovery`, and `security-review` ledgers for cross-agent context.
- Inspected the cited code paths in `extensions/bridges/teams/provider.go`, `extensions/bridges/teams/provider_test.go`, `internal/network/router.go`, `internal/network/validate.go`, and `packages/site/public/install.sh`.
- Confirmed each of the 6 findings is valid on the current branch.
- Updated all 6 issue files with triage decisions.
- Tightened Teams credentialed URL validation, added explicit test-only loopback opt-in for local auth mocks, and strengthened redirect assertions.
- Clamped replay dedupe deadlines to a strictly future second and added regression coverage for the boundary case.
- Extended raw-secret detection into JSON keys and allowed whitespace-only strings through validation, with targeted tests.
- Tightened the installer’s `latest` tag validation to match the cosign provenance tag class and updated the public install contract test.
- Focused verification passed: `go test ./extensions/bridges/teams ./internal/network -count=1 -race`, `bunx vitest run packages/site/lib/public-install-contract.test.ts`, `sh -n packages/site/public/install.sh`.
- Full verification passed: `make verify` with `DONE 7771 tests in 73.486s` and `OK: all package boundaries respected`.
- Created the remediation commit: `83eb68b9` (`fix: remediate secaudit review batch (#90)`).
- Post-commit verification passed: `make verify` with `DONE 7771 tests in 10.918s` and `OK: all package boundaries respected`.

Now:

- No active work remaining in this batch.

Next:

- Report completion evidence to the user.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-03-MEMORY-secaudit-r2.md`
- Review files: `.compozy/tasks/secaudit/reviews-002/issue_001.md` … `issue_006.md`
- Scoped code files: `extensions/bridges/teams/provider.go`, `extensions/bridges/teams/provider_test.go`, `internal/network/router.go`, `internal/network/validate.go`, `packages/site/public/install.sh`
- Candidate supporting tests: `internal/network/router_test.go`, `internal/network/validate_test.go`, `packages/site/lib/public-install-contract.test.ts`
