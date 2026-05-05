Goal (incl. success criteria):

- Resolve CodeRabbit batched reviews for PRD `tools-refac`, PR 85, round 001, issues 021-026.
- Success: scoped issue files are fully read, triaged, implemented or rejected with concrete reasoning, resolved after verification, `make verify` passes before and after exactly one local commit, no push.

Constraints/Assumptions:

- Scope is limited to issue files 021-026 and code files listed by the user unless a minimal extra file is required and documented.
- Do not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Do not edit issue files outside this batch.
- Never run destructive git commands without explicit permission.
- Use `cy-fix-reviews` as source of truth and `cy-final-verify` before completion/commit.
- Go/test changes follow `internal/CLAUDE.md`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, `systematic-debugging`, and `no-workarounds`.

Key decisions:

- This is a separate batch from prior completed issue 001-020 work; treat `.codex/ledger/2026-04-30-MEMORY-tools-refac-reviews.md` as read-only context.

State:

- Completed and committed locally.

Done:

- Loaded required workflow and verification skills.
- Scanned ledger directory and read relevant prior `tools-refac` ledgers for cross-agent awareness.
- Loaded `internal/CLAUDE.md` and Go/test/bugfix skill summaries.
- Read all scoped issue files 021-026 completely.
- Confirmed `.compozy/tasks/tools-refac/reviews-001/_meta.md` is absent, matching prior batch context.
- Triaged all scoped issues as valid and updated issue files with concrete root-cause notes.
- Implemented scoped fixes in `internal/cli`: MCP proxy trims bind inputs, `tool invoke --approval-token`, test subtest normalization, shutdown error handling, and direct-fixture integration oracle.
- Ran AGH test-convention checker for `internal/cli/mcp_auth_test.go`, `internal/cli/task_test.go`, and `internal/cli/tool_integration_test.go`; all passed.
- Ran `go test -race ./internal/cli -count=1`; passed.
- Ran `go test -race -tags integration ./internal/cli -count=1 -run TestCLIToolCommandsMatchUDSContractsIntegration`; passed.
- Ran first full `make verify`; passed with exit code 0 and ended with `OK: all package boundaries respected`.
- Marked issue files 021-026 as `resolved` with resolution notes.
- Ran pre-commit `make verify`; passed with exit code 0 and ended with `OK: all package boundaries respected`.
- Created local commit `41ac2421 fix: resolve tools-refac review batch 021`.
- Ran post-commit `make verify`; passed with exit code 0 and ended with `OK: all package boundaries respected`.
- Confirmed `git status --short` now shows only pre-existing unrelated workspace changes; scoped batch files are committed.

Now:

- Done.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/tools-refac/reviews-001`
- Issues: `issue_021.md` through `issue_026.md`
- Code files: `internal/cli/mcp_auth_test.go`, `internal/cli/task_test.go`, `internal/cli/tool.go`, `internal/cli/tool_integration_test.go`, `internal/cli/tool_operator.go`
