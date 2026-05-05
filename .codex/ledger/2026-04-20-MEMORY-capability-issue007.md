Goal (incl. success criteria):

- Resolve `.compozy/tasks/agent-capabilities/reviews-003/issue_007.md` by correctly triaging the review, updating `internal/network/router_integration_test.go` if the issue is valid, running fresh verification, and leaving the batch ready for manual review without an automatic commit.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/agent-capabilities/reviews-003/issue_007.md`, `internal/network/router_integration_test.go`, and this session ledger.
- Must follow `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `golang-pro`, and `testing-anti-patterns`.
- Repository worktree is dirty in unrelated files; do not touch or revert them.
- Full completion gate is `make verify` per repo instructions.

Key decisions:

- Issue `007` is valid: the router integration tests in scope each allocate their own transport, peer registries, channels, and cleanup, and `testNetworkConfig()` uses `Port: -1`, so they are independent and should opt into `t.Parallel()` like the surrounding network test suite.
- The fix remains test-only and minimal: add `t.Parallel()` at the start of each top-level scoped integration test before any setup work begins.

State:

- completed

Done:

- Read workspace instructions and required skill docs for the review workflow, verification gate, debugging, Go, and test guardrails.
- Scanned related `agent-capabilities` ledgers for cross-agent awareness.
- Read review round `_meta.md` and scoped `issue_007.md`.
- Inspected `internal/network/router_integration_test.go`, `internal/network/transport_test.go`, and `internal/network/tasks_integration_test.go`.
- Confirmed the integration harness uses dynamic transport ports and per-test registries/transports, with no shared mutable package state in the scoped file.
- Updated `.compozy/tasks/agent-capabilities/reviews-003/issue_007.md` through triage and resolution.
- Patched `internal/network/router_integration_test.go` to call `t.Parallel()` in each scoped top-level integration test.
- Ran `gofmt -w internal/network/router_integration_test.go`.
- Verified the scoped integration tests with `go test ./internal/network -tags integration -run 'Test(RoutersDiscoverEachOtherAndExchangeDirectAndBroadcastMessages|HeartbeatExpiryAndFreshGreetRecovery|DirectedWhoisRichDiscoveryDeliversPeerCardAndCapabilityCatalog|DirectedWhoisRichDiscoveryFilteringRefreshesRemotePresence)$' -count=1`.
- Ran `make verify` successfully.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-capability-issue007.md`
- `.compozy/tasks/agent-capabilities/reviews-003/_meta.md`
- `.compozy/tasks/agent-capabilities/reviews-003/issue_007.md`
- `internal/network/router_integration_test.go`
- `internal/network/transport_test.go`
- `internal/network/tasks_integration_test.go`
- `go test ./internal/network -tags integration -run 'Test(RoutersDiscoverEachOtherAndExchangeDirectAndBroadcastMessages|HeartbeatExpiryAndFreshGreetRecovery|DirectedWhoisRichDiscoveryDeliversPeerCardAndCapabilityCatalog|DirectedWhoisRichDiscoveryFilteringRefreshesRemotePresence)$' -count=1`
- `make verify`
