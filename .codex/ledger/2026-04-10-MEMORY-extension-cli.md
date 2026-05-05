Goal (incl. success criteria):

- Complete ext-architecture task_09 by adding `agh extension {list, install, enable, disable, status}` with human/json/toon output, daemon-online and offline registry behavior, required unit/integration tests, tracking updates, and one local commit after clean verification.
- Success means: CLI command tree exists and is registered, install validates manifest/checksum and persists installs, online mode uses UDS transport with runtime reload, offline mode works directly against the registry, required tests pass at >=80% package coverage, and `make verify` passes.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md`, task_09, `_techspec.md`, `_tasks.md`, ADR-005, and workflow memory as source of truth.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`; brainstorming is satisfied by reconciling against the already-approved PRD/techspec instead of creating a separate design artifact.
- Existing worktree changes under `.compozy/tasks/ext-architecture/task_01.md` through `task_08.md`, `_tasks.md`, `docs/ideas/anp/*`, and workflow memory files are unrelated and must not be reverted.

Key decisions:

- The codebase has no extension transport surface yet, so this task requires a minimal supporting seam for UDS client/server extension endpoints in addition to the CLI tree itself.
- Offline CLI operations should open the global DB directly and use `extension.Registry`; online operations should go through the daemon so runtime state can be reloaded without restarting the process manually.

State:

- Complete.

Done:

- Read root instructions, required skill docs, ext-architecture workflow memory, task_09, `_techspec.md`, `_tasks.md`, `_examples.md` section 8, ADR-005, and relevant ledgers from task_05 and task_08.
- Reconciled the baseline gap: `internal/cli/extension.go` does not exist, `internal/cli/root.go` does not register an extension tree, and the daemon UDS/API/client surfaces currently have no extension endpoints.
- Added shared extension contract payloads plus UDS extension handlers/routes/client methods so daemon-online CLI flows can install, list, enable, disable, and inspect extensions.
- Implemented `internal/cli/extension.go` and registered the new `agh extension` command tree with human/json/toon formatting plus daemon-online and daemon-offline execution paths.
- Added daemon-side extension service wiring, a shared `DescribeExtension(...)` projector, and a public `extension.Manager.Reload()` seam so registry mutations can refresh runtime state and hook declarations.
- Added unit and integration coverage across CLI, UDS, and daemon seams, then fixed two real verification regressions: a helper-less daemon fixture that failed reload startup and parallel CLI format subtests that locked the shared temp SQLite DB.
- Verified `go test ./internal/daemon ./internal/cli ./internal/api/udsapi ./internal/extension -count=1`, `go test -tags integration ./internal/cli -run TestExtensionCommandRoundTripIntegration -count=1`, `go test ./internal/cli -coverprofile=/tmp/cli-ext.cover.out -covermode=count -count=1` (`coverage: 80.0% of statements`), `make verify`, committed `d2f35a2` (`feat: add extension cli commands`), and re-ran `make verify` on `HEAD` successfully after the commit hook formatting step.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-extension-cli.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_09.md`
- `.compozy/tasks/ext-architecture/task_09.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/_examples.md`
- `.compozy/tasks/ext-architecture/adrs/adr-005.md`
- `internal/cli/root.go`
- `internal/cli/client.go`
- `internal/api/udsapi/*`
- `internal/api/httpapi/*` (only if shared route parity is needed)
- `internal/api/contract/contract.go`
- `internal/extension/registry.go`
- `internal/extension/manager.go`
- `internal/daemon/boot.go`
- Commands: `rg`, `sed`, `git status`, `go test`, `make verify`
- Commit: `git commit -m "feat: add extension cli commands"`
