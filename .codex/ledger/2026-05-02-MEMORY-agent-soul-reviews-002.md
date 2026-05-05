Goal (incl. success criteria):

- Remediate CodeRabbit batch `agent-soul` PR 88 round 002 across the 19 scoped issue files and listed code files.
- Success: every scoped issue file is triaged with concrete reasoning, all valid findings are fixed with tests, full verification passes, and exactly one local commit is created.

Constraints/Assumptions:

- Follow AGENTS.md and root instructions: no destructive git commands; do not touch unrelated files; subagents are not used for code changes.
- Required skills in force: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `agh-code-guidelines`, `agh-test-conventions`, `golang-pro`.
- Read every issue file completely before editing code; set issue frontmatter from `pending` to `valid` or `invalid` before production edits.
- Batch scope is centered on the 19 listed issue files and listed code files; if an extra test/helper file is required for a valid fix, keep it minimal and document why in triage.

Key decisions:

- Valid issues: 001, 003, 004, 006, 008, 009, 010, 011, 013, 014, 015, 016, 017, 018, 019.
- Invalid issues: 002, 005, 007, 012.
- Issue 002 and 007 are stale after the hard-cut redaction work already removed raw `webhook_secret_ref` from public trigger payloads and request DTOs.
- Issue 005 is stale because the public automation API no longer accepts `webhook_secret_ref`; adding a ref round-trip test would regress the redaction hard cut.
- Issue 012 is currently speculative: `authoredContextOperations()` is package-private and only consumed read-only by spec generation; no concrete mutation path exists today.

State:

- Completed successfully on 2026-05-02.

Done:

- Read `cy-fix-reviews`, `cy-final-verify`, `internal/CLAUDE.md`, and required Go/test/debugging skills.
- Read the existing round-001 ledger plus scanned adjacent `agent-soul` ledgers for cross-agent awareness.
- Read all 19 scoped issue files completely.
- Inspected the scoped implementation and test files to validate each review comment against current code.
- Triaged all 19 review files and marked invalid findings `resolved`: 002, 005, 007, 012.
- Implemented valid fixes across authored-context CAS handling, automation secret preservation, webhook registration validation, CLI vault/heartbeat behavior, and scoped regression tests.
- Updated every remaining valid review file to `status: resolved` with concrete resolution and verification notes.
- Ran focused package checks successfully:
  - `go test ./internal/api/core ./internal/automation ./internal/cli -count=1`
  - `go test ./internal/api/httpapi -count=1`
  - `go test ./internal/daemon -count=1`
- Ran `make verify` successfully on 2026-05-02 after fixing the `httptest.NewRequest` lint violation in `internal/api/core/authored_context_test.go`.
- Created the required single local commit: `ff650579` (`fix: resolve agent-soul review batch`).
- Reran `make verify` successfully on the committed tree; final result included `DONE 7740 tests` and `OK: all package boundaries respected`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-reviews-002.md`
- Issues: `.compozy/tasks/agent-soul/reviews-002/issue_001.md` through `issue_019.md`
- Primary code: `internal/api/core/authored_context.go`, `internal/api/core/automation.go`, `internal/automation/manager.go`, `internal/automation/trigger.go`, `internal/cli/authored_context.go`, `internal/cli/automation.go`, `internal/cli/client.go`
- Primary tests/evidence: `internal/api/core/automation_test.go`, `internal/api/core/bridges_test.go`, `internal/api/core/settings_test.go`, `internal/api/httpapi/httpapi_integration_test.go`, `internal/api/httpapi/server_test.go`, `internal/automation/trigger_test.go`, `internal/cli/command_paths_test.go`, `.compozy/tasks/agent-soul/qa/evidence/TC-SCEN-003-agent-output.txt`
- Additional touched tests required by valid fixes: `internal/api/core/authored_context_test.go`, `internal/automation/resource_test.go`, `internal/daemon/daemon_test.go`, `internal/cli/authored_context_test.go`
