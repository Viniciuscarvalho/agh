## Goal (incl. success criteria):

- Resolve `.compozy/tasks/agent-capabilities/reviews-003/issue_003.md` by making capability catalog path detection fail fast on wrong path types, adding regression coverage, updating the issue file status/triage correctly, and leaving the batch ready for manual review with fresh verification evidence.

## Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/agent-capabilities/reviews-003/issue_003.md`, `internal/config/capabilities.go`, and test files needed to validate the fix.
- Must follow `cy-fix-reviews` and `cy-final-verify`; no provider-specific resolution commands or automatic commits.
- Repository worktree is dirty in unrelated files; do not touch or revert them.
- Full completion gate is `make verify` per repo instructions.

## Key decisions:

- Issue `003` is valid: `existingCapabilityCatalogFile` and `existingCapabilityCatalogDir` currently treat wrong-type reserved paths as absent, so `LoadAgentCapabilities` silently ignores misconfigured catalogs.
- The fix should be localized to the existing helper functions so callers already fail fast through current error propagation.
- Regression coverage belongs in `internal/config/capabilities_test.go` using the public `LoadAgentCapabilities` entrypoint.

## State:

- completed

## Done:

- Read workspace instructions (`AGENTS.md`, `CLAUDE.md`).
- Read required skill docs for `cy-fix-reviews`, `cy-final-verify`, `golang-pro`, `systematic-debugging`, `no-workarounds`, and `testing-anti-patterns`.
- Scanned relevant existing ledgers for `agent-capabilities` cross-agent awareness.
- Read review round `_meta.md` and scoped `issue_003.md`.
- Inspected `internal/config/capabilities.go` and related config tests.
- Updated `.compozy/tasks/agent-capabilities/reviews-003/issue_003.md` to `valid` with root-cause triage.
- Patched `internal/config/capabilities.go` so wrong-type reserved catalog paths return descriptive errors instead of being treated as absent.
- Added regression coverage in `internal/config/capabilities_test.go` for TOML path, JSON path, and directory path type mismatches.
- Ran `gofmt` on touched Go files.
- Verified the scoped package with `go test ./internal/config -count=1`.
- Investigated an unrelated transient `internal/acp` failure from the first `make verify` run by confirming `go test ./internal/acp -race -run TestEndPromptClearsActivePromptWhileEmitterIsBackpressured -count=10` passes.
- Re-ran `make verify` successfully.
- Updated `.compozy/tasks/agent-capabilities/reviews-003/issue_003.md` to `resolved`.

## Now:

- None.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- None.

## Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-capabilities-issue003.md`
- `.compozy/tasks/agent-capabilities/reviews-003/_meta.md`
- `.compozy/tasks/agent-capabilities/reviews-003/issue_003.md`
- `internal/config/capabilities.go`
- `internal/config/capabilities_test.go`
- `go test ./internal/config -count=1`
- `make verify`
