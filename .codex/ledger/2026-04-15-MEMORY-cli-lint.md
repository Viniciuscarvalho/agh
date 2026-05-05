Goal (incl. success criteria):

- Fix all current lint errors under `internal/cli` with root-cause changes only, no suppressions, and report cleaned categories plus any remaining scope gaps.

Constraints/Assumptions:

- Scope is limited to `internal/cli`.
- The worktree is already dirty in many `internal/cli` files from parallel agents; do not revert or overwrite unrelated edits.
- Verification for this scoped handoff is targeted lint/testing in `internal/cli`; repo-wide verification belongs to the parent lint effort.

Key decisions:

- Use the current `internal/cli` tree as baseline and layer minimal structural fixes on top.
- Treat each lint finding as a code smell to remove at source, especially in shared test helpers.
- Prefer extracting helpers/splitting logic over suppressions or cosmetic rewrites.

State:

- In progress.

Done:

- Read root instructions and required skills: `no-workarounds`, `systematic-debugging`, `golang-pro`, `testing-anti-patterns`.
- Scanned existing ledgers for cross-agent awareness, including the parent `fix-lint` ledger and prior `internal/cli` ledgers.
- Confirmed `internal/cli` currently has many in-flight modifications from parallel work.
- Captured the current `golangci-lint run ./internal/cli/...` failure set before edits.
- Reworked shared CLI foundations:
  - `clientFromDeps` now returns only `(DaemonClient, error)` and call sites were mechanically updated.
  - `spawnDetached` now accepts `context.Context`; detached exec path now uses `exec.CommandContext`.
  - `runtimeContext` is being shifted to pointer flow in daemon/marketplace/skill workspace helpers to remove `hugeParam`.
- Added/fixed targeted helpers and refactors for lint root causes:
  - `mustMarkFlagHidden`
  - response-body drain helper in `client.go`
  - shared task-create request builder
  - bridge-create payload builder
  - workspace/task detail rendering helpers
  - automation trigger request builders
- Ran `gofmt -w internal/cli/*.go`.
- Ran `go test ./internal/cli -count=1` and captured current compile blockers.

Now:

- Fix the compile breakages introduced by the signature changes (`daemon_exec_test.go`, `memory_test.go`, `skill_test.go`) and finish pointer/signature propagation in tests.

Next:

- Rerun `go test ./internal/cli -count=1`.
- Rerun `golangci-lint run ./internal/cli/...`.
- Address the remaining funlen/goconst/gocritic/revive issues still left after the compile pass.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: Exact residual lint set after the current compile blockers are removed.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-cli-lint.md`
- `internal/cli/*`
- `golangci-lint run ./internal/cli/...`
- `go test ./internal/cli -count=1`
