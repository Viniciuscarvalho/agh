Goal (incl. success criteria):

- Fix all current `make lint` errors in the assigned Go scope: `internal/daemon`, `internal/session`, `internal/task`, `internal/network`, `internal/acp`, `internal/hooks`, `internal/bridgesdk`, `internal/memory`, `internal/config`, `internal/subprocess`, `internal/observe`, `internal/automation`, `internal/bridges`, `internal/extensiontest`, `internal/codegen`, and `sdk/examples/secret-guard`.
- Success means folder-scoped lint passes for these packages with root-cause fixes only, no suppressions, and no disruption to unrelated in-flight edits.

Constraints/Assumptions:

- Root-cause fixes only; no lint suppressions, no type/lifecycle hacks, no error swallowing.
- Worktree is already dirty across many files, including some in my scope; do not revert or overwrite unrelated agent changes.
- Prioritize real hotspots from `revive`, `gocyclo`, `gocritic`, `errcheck`, and `gosec`.
- Run targeted lint in my scope instead of repo-wide lint during remediation.

Key decisions:

- Use `golangci-lint` directly against the assigned package list to avoid unrelated failures.
- Inspect current file state before editing because other agents are changing nearby files concurrently.
- Treat each lint finding as a design signal; refactor or tighten APIs instead of suppressing the warning.

State:

- In progress.

Done:

- Read root AGENTS/CLAUDE instructions from prompt context.
- Read `no-workarounds`, `golang-pro`, and `systematic-debugging` skills.
- Read the shared `fix-lint` ledger and a sibling worker ledger for cross-agent awareness.
- Confirmed the worktree already contains extensive unrelated edits.
- Ran targeted `golangci-lint` across the assigned package list.
- Fixed one blocking ACP SDK typecheck regression in `internal/acp/handlers_test.go` (`Cancelled` vs old `Canceled` field name).
- Applied a first remediation pass across ACP, bridge SDK, daemon helpers, hooks helpers, network router, query cleanup paths, subprocess transport, and the `sdk/examples/secret-guard` example.
- Re-ran targeted lint and reduced the scope from 270 issues to 214 issues.
- Cleared `errcheck`, `noctx`, and `misspell` in the owned scope.
- Resumed under the narrowed closed ownership and aligned with concurrent user changes in `internal/config/agent.go`, `internal/automation/types.go`, `internal/automation/dispatch.go`, `internal/automation/manager.go`, and the pointer-based workspace contracts in `internal/session`, `internal/daemon`, and `internal/memory`.
- Replaced `internal/bridges/registry_test.go`'s dependency on `internal/store/globaldb` with a local in-memory registry store so out-of-scope `globaldb` breakage no longer blocks linting in the owned scope.
- Cleared `typecheck`, `unparam`, `unconvert`, `ineffassign`, and `golines` in the owned scope.
- Reduced the targeted scope from 195 issues after the typecheck unblock to 138 issues.

Now:

- Structural cleanup is the remaining work: exported-name `revive`, `gosec`, `gocyclo`, `funlen`, `hugeParam`, and the large `internal/daemon/hooks_bridge.go` hotspot.

Next:

- Tackle pointer-based heavy-parameter refactors where local interfaces already moved that direction.
- Decide whether to keep compatibility aliases or do full rename passes for exported stutter types; those are the clearest blockers under closed ownership.
- Re-run targeted lint for the assigned scope and report remaining gaps and blockers.

Open questions (UNCONFIRMED if needed):

- Current targeted lint snapshot: 138 issues total in scope.
- Breakdown: `funlen` 16, `gochecknoinits` 1, `gocritic` 33, `gocyclo` 19, `gosec` 19, `lll` 22, `revive` 28.
- Concrete blocker class: exported-name `revive` findings in `internal/acp`, `internal/automation`, `internal/memory`, `internal/network`, `internal/session`, and `internal/task` require full callsite renames or compatibility aliases. The aliases are currently needed for cross-package typecheck and are explicitly preserved by the user in `internal/automation`.
- Another blocker class is security/complexity debt that now needs real refactors, not mechanical cleanup.
- Concurrent edits remain possible in shared files under the owned scope; re-read before each patch batch.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-core-lint-assigned.md`
- `go run github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.11.4 run --fix --allow-parallel-runners <assigned packages>`
- `internal/daemon`
- `internal/session`
- `internal/task`
- `internal/network`
- `internal/acp`
- `internal/hooks`
- `internal/bridgesdk`
- `internal/memory`
- `internal/config`
- `internal/subprocess`
- `internal/observe`
- `internal/automation`
- `internal/bridges`
- `internal/extensiontest`
- `internal/codegen`
- `sdk/examples/secret-guard`
