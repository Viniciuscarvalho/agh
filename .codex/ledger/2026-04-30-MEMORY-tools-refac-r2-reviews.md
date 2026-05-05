Goal (incl. success criteria):

- Resolve CodeRabbit batched reviews for PRD `tools-refac`, PR 85, round 002, issues 001-009.
- Success: all scoped issue files triaged and resolved, valid issues fixed with tests as needed, `make verify` passes before and after exactly one local commit, no push.

Constraints/Assumptions:

- Scope is limited to the user-listed issue files and code files unless a fix demonstrably requires a minimal extra file.
- Do not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Do not edit issue files outside this batch.
- Never run destructive git commands without explicit permission.
- Go work follows root/internal AGENTS guidance, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, `systematic-debugging`, and `no-workarounds`.
- `cy-fix-reviews` is the workflow source of truth; `cy-final-verify` requires fresh `make verify` evidence before completion or commit.

Key decisions:

- Use `.codex/ledger/2026-04-30-MEMORY-tools-refac-r2-reviews.md` as this session ledger.
- Treat existing `tools-refac` ledgers as read-only cross-agent context.

State:

- Code fixes are implemented; focused verification is next.

Done:

- Loaded `cy-fix-reviews`, `cy-final-verify`, Go/debug/test skills, AGH root/internal instructions, and AGH local Go/test skills.
- Scanned existing ledgers for cross-agent awareness, including prior PR 85/round 001 remediation context.
- Read all scoped issue files 001-009 completely.
- Confirmed no `_meta.md` exists in `.compozy/tasks/tools-refac/reviews-002`; the nine issue files are the round context available.
- Triaged issues 001, 003, 004, 005, 006, 007, 008, and 009 as valid.
- Triaged issue 002 as invalid/resolved because `internal/api/core/tools_test.go` is in-memory handler coverage, not heavyweight integration coverage.
- Added boundary comments for the tool projection/error helpers, renamed subtests, added invoke payload assertions, sanitized hosted-MCP backend errors, wrapped the raw network token case in a subtest, tightened UDS projection assertions, and sanitized CLI redaction assertion messages.

Now:

- Run focused tests and convention checks.

Next:

- Implement valid fixes in severity order, run focused checks, then full `make verify`.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/tools-refac/reviews-002`
- Issues: `issue_001.md` through `issue_009.md`
- Code files: `internal/api/core/tools.go`, `internal/api/core/tools_test.go`, `internal/api/udsapi/hosted_mcp.go`, `internal/api/udsapi/network_test.go`, `internal/api/udsapi/udsapi_integration_test.go`, `internal/cli/cli_integration_test.go`
