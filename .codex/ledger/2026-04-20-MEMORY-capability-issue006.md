Goal (incl. success criteria):

- Resolve `.compozy/tasks/agent-capabilities/reviews-003/issue_006.md` by correctly triaging the review, updating `internal/network/manager_integration_test.go` if the issue is valid, running fresh verification, and leaving the batch ready for manual review without an automatic commit.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/agent-capabilities/reviews-003/issue_006.md`, `internal/network/manager_integration_test.go`, and this session ledger.
- Must follow `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `golang-pro`, and `testing-anti-patterns`.
- Repository worktree is dirty in unrelated files; do not touch or revert them.
- Full completion gate is `make verify` per repo instructions.

Key decisions:

- Issue `006` is valid: the integration test is self-contained and currently omits `t.Parallel()` despite package norms.
- The fix remains test-only and minimal: add `t.Parallel()` before any other test setup so scheduling is correct.

State:

- completed

Done:

- Read workspace instructions and required skill docs for the review workflow, verification gate, debugging, Go, and test guardrails.
- Scanned related `agent-capabilities` ledgers for cross-agent awareness.
- Read review round `_meta.md` and scoped `issue_006.md`.
- Inspected `internal/network/manager_integration_test.go`, `internal/network/manager_test.go`, `internal/network/tasks_integration_test.go`, `internal/network/delivery_integration_test.go`, and `internal/network/manager.go`.
- Confirmed `testManagerConfig()` uses `Port: -1` and the test allocates its own temp audit path and manager instance.
- Ran the scoped integration test once before editing: `go test ./internal/network -tags integration -run TestManagerJoinPublishesProjectedCapabilityBriefInInitialAndReconnectGreets -count=1` (pass).
- Updated `issue_006.md` triage to `valid` and patched `internal/network/manager_integration_test.go` to call `t.Parallel()`.
- Ran `gofmt -w internal/network/manager_integration_test.go`.
- Re-ran the scoped integration test after the change: `go test ./internal/network -tags integration -run TestManagerJoinPublishesProjectedCapabilityBriefInInitialAndReconnectGreets -count=1` (pass).
- Ran the full repository gate: `make verify` (pass).
- Marked `.compozy/tasks/agent-capabilities/reviews-003/issue_006.md` as resolved with verification notes.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-capability-issue006.md`
- `.compozy/tasks/agent-capabilities/reviews-003/_meta.md`
- `.compozy/tasks/agent-capabilities/reviews-003/issue_006.md`
- `internal/network/manager_integration_test.go`
- `internal/network/manager_test.go`
- `internal/network/tasks_integration_test.go`
- `internal/network/delivery_integration_test.go`
- `internal/network/manager.go`
- `go test ./internal/network -tags integration -run TestManagerJoinPublishesProjectedCapabilityBriefInInitialAndReconnectGreets -count=1`
- `make verify`
