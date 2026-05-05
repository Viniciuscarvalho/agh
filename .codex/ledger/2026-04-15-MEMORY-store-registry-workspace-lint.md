Goal (incl. success criteria):

- Fix all current Go lint failures under `internal/store/**`, `internal/registry/**`, and `internal/workspace/**` with root-cause changes only and no suppressions.
- Success means segmented `golangci-lint` for this exact scope is clean, or a concrete blocker is identified and documented.

Constraints/Assumptions:

- Scope started closed to `internal/store/**`, `internal/registry/**`, and `internal/workspace/**`, then expanded specifically for repo-wide call-site renames needed to finish the last naming findings.
- Other agents are editing elsewhere; do not revert or overwrite unrelated changes.
- Use the current worktree state as baseline and adapt to in-flight edits already present in these folders.

Key decisions:

- Work from the live scoped lint run instead of the earlier repo snapshot.
- Treat lint findings as structural issues to remove at source: transaction cleanup, query building, API shape, SQL readability, and exported naming.
- Rename the remaining exported interfaces for real instead of leaving aliases behind: `registry.RegistrySource -> registry.Source`, `workspace.WorkspaceStore -> workspace.Store`, and `workspace.WorkspaceResolver -> workspace.RuntimeResolver`.

State:

- Completed for the assigned scope and expanded naming cleanup.

Done:

- Read root instructions and relevant skill guidance (`no-workarounds`, `systematic-debugging`, `golang-pro`).
- Read peer ledgers for cross-agent awareness.
- Ran scoped lint for `./internal/store/... ./internal/registry/... ./internal/workspace/...` and reduced the failure set from 71 issues to 0.
- Fixed rollback/cleanup errcheck issues by propagating rollback and deferred cleanup failures instead of discarding them.
- Reworked GitHub registry client/request tests after the request-path refactor and removed dead return plumbing.
- Refactored workspace clone helpers to avoid heavy parameter copies.
- Broke long SQL/schema/query lines across store/globaldb and sessiondb files to clear all remaining `lll`/`golines` findings in scope.
- Cleared remaining `revive` unused-parameter issues and the `gocritic` sloppy reassignment finding.
- Completed the repo-wide call-site renames for the final naming cleanup and removed temporary compatibility aliases once verification proved they were no longer needed.
- Verified `golangci-lint run ./internal/store/... ./internal/registry/... ./internal/workspace/...` now reports `0 issues.`
- Verified the rename call-sites compile with `go test ./internal/registry/... ./internal/workspace/... ./internal/session/... ./internal/observe/... ./internal/memory/... ./internal/daemon/... ./internal/automation/... ./internal/bundles/... ./internal/extension/... ./internal/cli/... -run TestDoesNotExist -count=1`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-store-registry-workspace-lint.md`
- `golangci-lint run ./internal/store/... ./internal/registry/... ./internal/workspace/...`
- `go test ./internal/registry/... ./internal/workspace/... ./internal/session/... ./internal/observe/... ./internal/memory/... ./internal/daemon/... ./internal/automation/... ./internal/bundles/... ./internal/extension/... ./internal/cli/... -run TestDoesNotExist -count=1`
- `internal/store/globaldb/*`
- `internal/store/sessiondb/session_db.go`
- `internal/registry/*`
- `internal/workspace/*`
- Repo-wide call sites under `internal/{cli,session,observe,memory,daemon,automation,bundles,extension}`
