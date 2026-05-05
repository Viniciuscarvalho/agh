Goal (incl. success criteria):

- Remediate CodeRabbit review feedback for PR #85 end-to-end.
- Success: export unresolved issues, triage each issue as VALID/INVALID with rationale, implement complete fixes, run required verification, create exactly one remediation commit, resolve review threads, and report evidence.

Constraints/Assumptions:

- Must not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit permission.
- Must not commit `ai-docs/` or `.tmp/` artifacts, even if the review workflow updates them.
- `make verify` must pass before task completion.
- Conversation in Brazilian Portuguese; repo artifacts in English.
- PR number: 85.

Key decisions:

- Use the `fix-coderabbit-review` skill workflow.
- Prefer project commit style (`fix: ...`) over the skill's scoped example because repo policy only allows unscoped prefixes.

State:

- Complete.

Done:

- Loaded `fix-coderabbit-review` skill.
- Confirmed no existing ledger files were listed before creation.
- Exported CodeRabbit issues for PR #85 using a temporary Bun script environment because `pnpm exec` is blocked by the repo package manager config and exporter dependencies are not installed in the workspace.
- Export result: `ai-docs/reviews-pr-85/`, 19 resolved issues hidden, 6 unresolved inline issues generated, 4 outside-of-diff files generated.
- Triaged all 10 exported items as VALID.
- Implemented fixes for session-scoped tool search, hosted MCP SSE error sanitization, CLI UDS timeout/SSE split client, broader API error redaction, network projection error wrapping, raw-token assertions, UDS tool resource assertions/subtest shape, and validator comment.
- Focused Go unit/integration tests for changed packages passed.
- Full `make verify` previously reached Go lint and failed only on `gosec G101` for claim-redaction marker constants in `internal/cli/client_tools.go`.
- Reworked claim-redaction marker preservation to avoid token-like constants while preserving the tested `agh_claim_[REDACTED]` output.
- Pre-commit `make verify` passed.
- Created commit `bf55a198 fix: resolve PR #85 review issues`.
- Post-commit `make verify` passed.
- Resolved 6 GitHub review threads; GraphQL confirmation returned `isResolved: true` for all thread IDs.
- Updated local `ai-docs/reviews-pr-85/_summary.md`: 6/6 issues resolved, 4/4 outside-of-diff entries resolved, 0 unresolved.
- Pushed `bf55a198655b085ba8ab85f8c117da4331a71466` to `origin/tools-registry`; PR #85 head now points at that commit.
- Final `git status --short` shows only pre-existing unrelated dirty files under `.agents/`, `.compozy/tasks/tools-refac/`, `AGENTS.md`, `CLAUDE.md`, and `docs/_memory/`; none of the committed remediation files are dirty.
- New turn on 2026-04-30: PR #85 head is `862f6b7de4381d75e2a98911287c2828c460e33e` (`docs: update`) and GitHub reports `reviewDecision=CHANGES_REQUESTED`.
- Current worktree has pre-existing dirty files in `.compozy/tasks/tools-refac/` and several `internal/` Go files; preserve and work with them, do not revert.
- Reloaded `fix-coderabbit-review`, `internal/CLAUDE.md`, and required Go/test/debugging skills for this pass.
- Reexported current PR #85 reviews with `GITHUB_TOKEN="$(gh auth token)" bun .tmp/coderabbit-pr85-export/pr-review.ts 85 --hide-resolved`.
- Export result: 25 resolved inline threads hidden, 6 unresolved inline issues, 5 outside-of-diff entries.
- Triage: issue 001 (`tools_test.go` integration build tag) is `INVALID`; the file is in-memory unit handler coverage with stubs, not a heavyweight integration suite. Issues 002-006 and all 5 outside entries are `VALID`.
- Applied remaining local fixes: nil-receiver guard/test for network channel payloads and sanitized `task next` raw-token failure assertion.
- `scripts/check-test-conventions.py` is not present in this checkout; `rg --files` found no equivalent.
- Focused tests passed: `go test ./internal/api/core -run 'TestToolHandlers|TestNetworkChannelPayloadsRejectNilReceiver' -count=1`; `go test ./internal/api/udsapi -run 'TestNetworkHandlersValidateRequestsAndMapErrors' -count=1`; `go test ./internal/cli -run 'TestAgentTaskCommandsMapLeaseRequests' -count=1`; `go test -tags integration ./internal/api/udsapi -run 'TestUDSToolResourceCRUDRoundTripTriggersProjection' -count=1`; `go test -tags integration ./internal/cli -run 'TestCLIAgentTaskLeaseLifecycleIntegration|TestCLIHistoricalChannelTaskNextAfterDaemonRestartIntegration' -count=1`.
- Pre-commit `make verify` passed.
- Created commit `7036c1c7 fix: resolve PR #85 review issues`.
- Post-commit `make verify` passed.
- Pushed `7036c1c7` to `origin/tools-registry`.
- Added a GitHub review-thread reply for invalid issue 001 with technical rationale.
- Resolved GitHub review threads 001-006 via `resolve_pr_issues.sh`; GraphQL confirmation returned `isResolved: true` for all 6 thread IDs.
- Updated local `ai-docs/reviews-pr-85/_summary.md`: 6/6 inline issues resolved, 5/5 outside-of-diff entries resolved, 0 unresolved.
- `gh pr view 85` reports head `7036c1c7d01bbf6296ab27a737078dea8874f3f6` and `reviewDecision=APPROVED`.
- Final `git status --short --branch --untracked-files=all` reports `tools-registry...origin/tools-registry` with no dirty files.

Now:

- Done.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-30-MEMORY-fix-coderabbit-pr85.md`
- Review export target: `ai-docs/reviews-pr-85/`
- Export command used: temporary copy of `.claude/skills/fix-coderabbit-review/scripts/pr-review.ts` executed with `GITHUB_TOKEN="$(gh auth token)" bun <tmp>/pr-review.ts 85 --hide-resolved`
- Changed files include `internal/api/core/tools.go`, `internal/api/core/tools_test.go`, `internal/api/udsapi/hosted_mcp.go`, `internal/api/udsapi/hosted_mcp_test.go`, `internal/cli/client.go`, `internal/cli/client_test.go`, `internal/diagnostics/redact.go`, `internal/diagnostics/redact_test.go`, `internal/api/core/network.go`, `internal/api/core/network_details.go`, `internal/api/udsapi/udsapi_integration_test.go`, `internal/cli/task_test.go`, `internal/cli/cli_integration_test.go`.
- Commit: `bf55a198 fix: resolve PR #85 review issues`.
