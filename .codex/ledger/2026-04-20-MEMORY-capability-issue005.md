Goal (incl. success criteria):

- Resolve `.compozy/tasks/agent-capabilities/reviews-003/issue_005.md` by fixing malformed `agh.capability_ids` handling in `internal/network/capability_catalog.go`, adding regression coverage, updating the scoped issue file correctly, and leaving the batch ready for manual review with fresh verification evidence.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/agent-capabilities/reviews-003/issue_005.md`, `internal/network/capability_catalog.go`, and test files needed to validate the fix.
- Must follow `cy-fix-reviews` and `cy-final-verify`; no provider-specific resolution commands or automatic commits.
- Repository worktree is dirty in unrelated files; do not touch or revert them.
- Full completion gate is `make verify` per repo instructions.

Key decisions:

- Issue `005` is valid: malformed or explicitly empty `agh.capability_ids` currently collapse into the same nil state as an absent filter, so rich whois discovery can return the full capability catalog instead of failing closed.
- Preserve absent-vs-explicit filter semantics by keeping `nil` for "filter missing" and using a non-nil empty slice for malformed or explicit-empty filters.
- Keep the fix localized to `internal/network/capability_catalog.go`; validate it with focused tests in `internal/network/capability_catalog_test.go`.

State:

- completed

Done:

- Read workspace instructions and required skill docs: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `golang-pro`, and `testing-anti-patterns`.
- Scanned related ledgers for `agent-capabilities` cross-agent awareness.
- Read review round `_meta.md` and scoped `issue_005.md`.
- Inspected `internal/network/capability_catalog.go`, its call sites, and existing rich whois tests.
- Confirmed the root cause spans both request parsing and projection semantics.
- Updated `.compozy/tasks/agent-capabilities/reviews-003/issue_005.md` through triage and resolution.
- Patched `internal/network/capability_catalog.go` so absent filters stay `nil`, malformed or explicit-empty filters become an explicit empty slice, and explicit empty filters project to an empty catalog instead of the full catalog.
- Added focused regression coverage in `internal/network/capability_catalog_test.go`.
- Ran `gofmt` on touched Go files.
- Verified with `go test ./internal/network -count=1` and `make verify`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-capability-issue005.md`
- `.compozy/tasks/agent-capabilities/reviews-003/_meta.md`
- `.compozy/tasks/agent-capabilities/reviews-003/issue_005.md`
- `internal/network/capability_catalog.go`
- `internal/network/capability_catalog_test.go`
- `go test ./internal/network -count=1`
- `make verify`
