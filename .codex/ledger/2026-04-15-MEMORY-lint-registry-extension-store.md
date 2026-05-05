Goal (incl. success criteria):

- Fix the current Go lint failures in `internal/extension` and `internal/extensiontest` with root-cause changes only and no suppressions.
- Success means segmented lint for this scope is clean, any strictly-required signature follow-ons outside ownership still compile, and the outcome is reported as changed files + cleaned categories + remaining gaps.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`, plus the named `no-workarounds` skill and project-mandated `systematic-debugging` + `golang-pro`.
- Do not revert or overwrite unrelated worktree changes from other agents; accommodate parallel edits.
- Prioritize `errcheck`, `revive`, `funlen`, and `noctx`, while clearing the full scoped issue set if feasible.
- Do not touch files outside ownership unless strictly required by the exact remaining issue set.
- Repo completion requires `make verify`, but this worker is only responsible for the assigned folder set and should validate with segmented commands it can prove locally.

Key decisions:

- Use segmented `golangci-lint` on the owned package paths to isolate the real failure set in this scope.
- Treat lint failures as bug signals; inspect the surrounding code before editing instead of applying suppressions or compiler/linter evasions.

State:

- Completed.

Done:

- Read root instructions and relevant skill guidance (`no-workarounds`, `systematic-debugging`, `golang-pro`).
- Scanned other ledgers for cross-agent awareness, especially `fix-lint`, `extension-registry`, `extension-bundles`, and `store-persistence-split`.
- Confirmed there are many pre-existing modifications under the owned folders from parallel work.
- Ran segmented lint for `internal/registry`, `internal/extension`, and `internal/store` and captured the active issue set.
- Received new closed ownership from the user: `internal/extension/**`, `internal/extensiontest/**`, and `internal/bundles/**` only.
- Read `/tmp/agh-go-lint-full-2026-04-15-pass4.txt` and filtered the active issue set for the owned scope.
- Confirmed the owned scope already has many concurrent edits from other workers, so changes must be adapted in place.
- Refactored `internal/extensiontest/bridge_adapter_harness.go` so `buildHarnessRuntime` is under the `funlen` limit and the workspace precondition is explicit enough to satisfy staticcheck.
- Confirmed the last live scoped lint failure was `gocritic/hugeParam` on `internal/extension/host_api_test.go` caused by `taskpkg.SessionExecutor.StartTaskSession` taking `taskpkg.StartTaskSession` by value.
- Fixed that root cause by switching `taskpkg.SessionExecutor.StartTaskSession` and its implementations/callers to `*StartTaskSession`, then revalidated the impacted packages.
- Verified `golangci-lint` for `./internal/extension/... ./internal/extensiontest/...` returns `0 issues`.
- Verified compile coverage for the required follow-on edits with:
  - `go test -run TestDoesNotExist ./internal/task ./internal/daemon ./internal/extension`
  - `go test -run TestDoesNotExist -tags integration ./internal/api/httpapi ./internal/api/udsapi ./internal/cli ./internal/task ./internal/observe`

Now:

- Prepare the final report with the scoped lint result and the exact files changed.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-lint-registry-extension-store.md`
- `/tmp/agh-go-lint-full-2026-04-15-pass10.txt`
- `internal/extension/*`
- `internal/extensiontest/*`
- `internal/task/*`
- `internal/daemon/task_runtime*`
- `internal/api/{httpapi,udsapi}/*integration_test.go`
- `internal/cli/cli_integration_test.go`
- `internal/observe/tasks_integration_test.go`
- `go run github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.11.4 run --allow-parallel-runners ./internal/extension/... ./internal/extensiontest/...`
