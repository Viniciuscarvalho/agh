Goal (incl. success criteria):

- Implement accepted plan for `agh hooks` end-to-end: complete shared query/types, add missing hook filters, expose hook endpoints on both HTTP and UDS transports, add `DaemonClient` hook methods, implement CLI `hooks list|info|events|runs`, cover with tests, and finish with `make verify`.

Constraints/Assumptions:

- Follow `/Users/pedronauck/Dev/projects/agh/AGENTS.md` and `CLAUDE.md`.
- User explicitly requested `systematic-debugging`, `no-workarounds`, and `golang-pro`; root cause and shared transport gaps must be fixed directly, not patched around.
- Do not touch unrelated dirty files already present in the worktree.
- Accepted plan persisted under `.codex/plans/2026-04-09-hooks-cli-endpoints.md`.
- `hooks sources` is removed from scope.
- `hooks info <name>` must return all matching resolved hooks, not fail on duplicate names.

Key decisions:

- Fix the root cause in the shared API surface by moving hook transport logic into `internal/api/core` and registering the same routes on UDS.
- Keep exactly three client methods for hooks and derive `info` from catalog data in the CLI.
- Keep API `since` parsing as absolute RFC3339/RFC3339Nano timestamps; only the CLI accepts relative durations and converts them before the request.
- Add `ExecutorKind` to catalog payloads so `hooks info` can remain a composition over catalog data without a separate endpoint.

State:

- Completed.

Done:

- Read root instructions, relevant ledgers, current hooks/httpapi/udsapi/cli/client code, and the accepted plan.
- Confirmed the real gap: hooks handlers exist only in `httpapi`, filters are partial, `QueryHookEvents` is unfiltered, `store.HookRunQuery` cannot filter outcome, `DaemonClient` has no hook methods, `internal/cli/hooks.go` does not exist, and UDS routes omit `/api/hooks/*`.
- Confirmed user decisions: `hooks sources` removed, `hooks info` returns all matches.
- Added shared hook query DTOs and `ExecutorKind` to the catalog contract in `internal/api/contract/contract.go`.
- Extended hook domain/store/query behavior for catalog event/source/mode filters, event family/sync-only filtering, hook run outcome filtering, and executor kind exposure.
- Moved hook transport parsing/payload/handler logic into `internal/api/core`, removed the HTTP-only hook handler file, and registered `/api/hooks/catalog`, `/api/hooks/runs`, and `/api/hooks/events` on UDS too.
- Added `DaemonClient.HookCatalog`, `DaemonClient.HookRuns`, and `DaemonClient.HookEvents` plus query builders and contract aliases in `internal/cli/client.go`.
- Added `internal/cli/hooks.go` implementing `agh hooks list`, `info`, `events`, and `runs`, with human/json/toon output; aligned `hooks info` toon output to start with a `hooks[n]{...}` summary array.
- Added/updated regression coverage across `internal/hooks`, `internal/store/sessiondb`, `internal/api/httpapi`, `internal/api/udsapi`, `internal/cli`, `internal/observe`, and `internal/daemon`.
- Root-cause fix discovered by tests: `ParseHookRunsQuery` now calls `store.HookRunQuery.Validate()`, so invalid `last` values like `-1` fail fast with `400` instead of leaking through to observers.
- Repository-wide verification passed with `make verify` (`0 issues`, `DONE 1411 tests in 8.442s`, `OK: all package boundaries respected`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/plans/2026-04-09-hooks-cli-endpoints.md`
- `.codex/ledger/2026-04-09-MEMORY-hooks-cli-endpoints.md`
- `internal/api/contract/contract.go`
- `internal/api/core/handlers.go`
- `internal/api/core/parsers.go`
- `internal/api/core/payloads.go`
- `internal/api/httpapi/hooks_test.go`
- `internal/api/httpapi/hooks_integration_test.go`
- `internal/api/udsapi/routes.go`
- `internal/api/udsapi/handlers_test.go`
- `internal/cli/client.go`
- `internal/cli/client_test.go`
- `internal/cli/hooks.go`
- `internal/cli/hooks_test.go`
- `internal/api/core/interfaces.go`
- `internal/hooks/*`
- `internal/observe/*`
- `internal/store/types.go`
- `internal/store/sessiondb/*`
- `internal/cli/root.go`
- `internal/daemon/daemon_test.go`
- Commands:
  - `go test ./internal/hooks ./internal/store/sessiondb ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/cli ./internal/observe`
  - `go test -tags integration ./internal/api/httpapi`
  - `go test ./internal/daemon`
  - `make verify`
