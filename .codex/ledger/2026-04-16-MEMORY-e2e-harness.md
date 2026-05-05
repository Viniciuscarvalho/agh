Goal (incl. success criteria):

- Complete e2e task_01 by adding a shared `internal/testutil/e2e/` runtime harness that boots an isolated real daemon, seeds config/workspaces, exposes reusable HTTP/UDS/CLI-public clients, captures stable artifact manifests, migrates one existing integration-suite path, and finishes with clean verification plus task tracking updates.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, workflow memory instructions, task_01, `_techspec.md`, `_tasks.md`, and ADR-001/003/004.
- Required skills loaded: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`; `brainstorming` reviewed but the task already has approved PRD/techspec source-of-truth artifacts.
- Keep scope tight to task_01; record follow-up work instead of expanding into later ACP mock, network, browser, or CI lanes.
- Current worktree has untracked `.compozy/tasks/e2e/_meta.md` and task memory files; do not disturb unrelated changes.

Key decisions:

- The shared harness should avoid importing `internal/daemon` or `internal/cli` so `internal/api/httpapi` and `internal/api/udsapi` integration suites can import it without package cycles through `daemon -> httpapi/udsapi`.
- Boot the real daemon through an external `agh daemon start --foreground` subprocess backed by a seeded AGH home/config, then interact only through public HTTP, UDS, and CLI surfaces.
- Provide a thin CLI exec client plus raw HTTP/UDS JSON helpers instead of reusing in-process transport constructors; this preserves the real startup path and keeps the harness package cycle-safe.
- Artifact manifests should be stable and surface-oriented: versioned manifest entries keyed by artifact kind with relative paths under a per-run artifact directory.

State:

- Completed.

Done:

- Read repository instructions, required skill files, workflow memory, task spec, techspec, `_tasks.md`, and ADR-001/003/004.
- Captured the pre-change signal: duplicated runtime boot/setup exists in `internal/api/httpapi/httpapi_integration_test.go`, `internal/api/udsapi/udsapi_integration_test.go`, and daemon integration helpers.
- Inspected existing integration helpers, config/home APIs, contract payloads, and current ACP helper-process patterns in integration tests.
- Identified the package-cycle constraint that rules out an in-process harness imported by HTTP/UDS suites.
- Added `internal/testutil/e2e/` with subprocess-backed daemon boot, seeded config/workspace helpers, reusable HTTP/UDS/CLI clients, and artifact manifest/capture helpers.
- Added unit and integration coverage for harness lifecycle, seeded config invariants, artifact manifest behavior, and forced-failure artifact capture; package coverage now clears the 80% bar with integration tags.
- Migrated `TestHTTPResourceMutationRoutesRemainUnavailableWithoutOperatorAuth` in `internal/api/httpapi/httpapi_integration_test.go` onto the shared harness.
- Ran focused harness tests, focused HTTP integration coverage, and `make verify` successfully.
- Updated workflow memory plus task tracking files for task_01 completion; tracking artifacts remain intentionally unstaged.
- Created the scoped local commit `cbd19f1e test: add shared e2e runtime harness`.
- Re-ran `make verify` on `HEAD` after the commit hook's formatting pass; it passed cleanly.

Now:

- None.

Next:

- Optionally delete this ledger after handoff.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/testutil/e2e/*`, `internal/api/httpapi/httpapi_integration_test.go`, `.compozy/tasks/e2e/memory/{MEMORY.md,task_01.md}`, `.compozy/tasks/e2e/{task_01.md,_tasks.md}`.
- Commands: `go test ./internal/testutil/e2e -count=1`, `go test -tags integration ./internal/testutil/e2e -cover -count=1`, `go test -tags integration ./internal/api/httpapi -run TestHTTPResourceMutationRoutesRemainUnavailableWithoutOperatorAuth -count=1`, `make verify`, `git diff --check`.
