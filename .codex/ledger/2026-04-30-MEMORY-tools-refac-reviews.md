Goal (incl. success criteria):

- Resolve CodeRabbit batched reviews for PRD `tools-refac`, PR 85, round 001, issues 001-020.
- Success: all scoped issue files triaged and resolved, valid issues fixed with tests as needed, `make verify` passes, exactly one local commit created, no push.

Constraints/Assumptions:

- Scope is limited to the user-listed issue files and code files unless a fix demonstrably requires a minimal extra file.
- Do not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Do not edit issue files outside this batch.
- Never run destructive git commands without explicit permission.
- Go work follows `internal/CLAUDE.md`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, `systematic-debugging`, and `no-workarounds`.
- `cy-final-verify` requires fresh full verification evidence before completion or commit.

Key decisions:

- Use `cy-fix-reviews` as the source-of-truth workflow.
- Use `.codex/ledger/2026-04-30-MEMORY-tools-refac-reviews.md` as this session ledger.

State:

- Batch completed and committed locally.

Done:

- Read `cy-fix-reviews`, `cy-final-verify`, `internal/CLAUDE.md`, and required Go/test/bugfix skill summaries.
- Scanned existing ledgers list for cross-agent awareness; relevant prior `tools-*` ledgers exist and will be treated read-only.
- Read all scoped issue files 001-020 completely.
- Confirmed no `_meta.md` exists in `.compozy/tasks/tools-refac/reviews-001`; issue files are present and issues 021-026 are out of scope.
- Inspected affected code ranges for bootstrap env, ACP/API/HTTP/UDS/CLI tools and tests.
- Triaged issues 001-020: 19 valid, 1 invalid (`issue_007`).
- Implemented portable QA bootstrap env, tool scope propagation, safe tool error messages, HTTP privileged guards, hosted-MCP pre-SSE validation, peer-checked hosted-MCP release, CLI SSE/invoke redaction, stricter token field matching, and test/schema updates.
- Ran focused tests: `go test ./internal/api/core ./internal/api/httpapi ./internal/api/spec ./internal/cli ./internal/mcp ./internal/acp -count=1` passed after fixes.
- Ran `go test ./internal/api/udsapi -count=1` and `go test -tags integration ./internal/api/udsapi -run TestUDSToolResourceCRUDRoundTripTriggersProjection -count=1`; both passed.
- Ran `.agents/skills/agh-test-conventions/scripts/check-test-conventions.py` against touched test files via loop; it failed on pre-existing violations in `internal/acp/client_test.go` outside this batch.
- First `make verify` failed in `internal/daemon` parity test because the HTTP test harness bypassed the real server constructor and left `boundHost` empty after tool invoke routes gained the loopback mutation guard.
- Fixed `internal/daemon/tools_transport_parity_test.go` to construct HTTP routes through `httpapi.New` with loopback host and the existing fake registry; focused parity test now passes.
- Reran full `make verify`; it passed with exit code 0 and ended with `OK: all package boundaries respected`.
- Created local commit `4efddbfb fix: resolve tools-refac review batch`.
- Ran post-commit `make verify`; it passed with exit code 0 and ended with `OK: all package boundaries respected`.

Now:

- Completed.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/tools-refac/reviews-001`
- Issues: `issue_001.md` through `issue_020.md`
- Code files: user-listed 14 files under `.compozy/tasks/tools-refac/qa`, `internal/acp`, `internal/api`, and `internal/cli`.
- Minimal extra file likely needed: `internal/mcp/hosted.go` to add peer-checked bind release for issue 013; will document in triage if used.
