Goal (incl. success criteria):

- Resolve `.compozy/tasks/agent-capabilities/reviews-003/issue_001.md` by fixing the scoped weakness in `internal/api/core/network_test.go`, updating the issue file status/triage correctly, and leaving the batch ready for manual review with fresh verification evidence.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/agent-capabilities/reviews-003/issue_001.md`, `internal/api/core/network_test.go`, and this session ledger.
- Must follow `cy-fix-reviews` and `cy-final-verify`; no provider-specific resolution commands or automatic commits.
- Repository worktree is dirty in unrelated files; do not touch or revert them.
- Full completion gate is `make verify` per repo instructions.

Key decisions:

- Issue 001 is valid: the current subtests only assert status codes, so they would not detect an unrelated 400/404 branch.
- Use existing `contract.ErrorPayload` decoding patterns already present in `internal/api/core/network_test.go`.
- Assert stable substrings from the real handler paths:
  - not-found path should contain `network channel not found`
  - invalid limit path should contain `invalid integer "abc"`

State:

- in_progress

Done:

- Read workspace instructions and the required skill docs for `cy-fix-reviews`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Scanned relevant prior ledgers for `agent-capabilities` cross-agent awareness.
- Read review round `_meta.md` and scoped `issue_001.md`.
- Inspected `internal/api/core/network_test.go`, `internal/api/core/network_details.go`, `internal/api/core/errors.go`, and `internal/api/core/parsers.go`.
- Confirmed the review comment matches current code and the fix is test-only.

Now:

- Update `issue_001.md` to `valid` with concrete root-cause reasoning.
- Patch `internal/api/core/network_test.go` to add `t.Parallel()` and explicit error payload assertions.

Next:

- Run focused package tests, then `make verify`.
- If verification passes, mark the issue file `resolved` with the verification result.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-agent-capabilities-r3.md`
- `.compozy/tasks/agent-capabilities/reviews-003/_meta.md`
- `.compozy/tasks/agent-capabilities/reviews-003/issue_001.md`
- `internal/api/core/network_test.go`
- `internal/api/core/network_details.go`
- `internal/api/core/errors.go`
- `internal/api/core/parsers.go`
- `go test ./internal/api/core -count=1`
- `make verify`
