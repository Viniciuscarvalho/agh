Goal (incl. success criteria):

- Complete e2e `task_07` by adding focused HTTP and UDS transport-parity scenarios for approval, webhook ingress, and projection reads using the shared subprocess-backed runtime harness from task_01.
- Success means: shared-harness-based transport helpers exist for the in-scope parity tests, HTTP approval/webhook ingress and UDS operator/CLI-visible parity are covered, the current UDS `POST /api/sessions/:id/approve` `501 Not Implemented` behavior is explicitly asserted, task/workflow tracking is updated, `make verify` passes, and one local commit is created.

Constraints/Assumptions:

- Must follow root `AGENTS.md` / `CLAUDE.md`, `task_07.md`, `.compozy/tasks/e2e/_techspec.md`, `.compozy/tasks/e2e/_tasks.md`, ADR-003/004/005, and the workflow-memory instructions.
- Required skills in use: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`.
- Keep scope tight to task_07: transport proofs supplement the composition-root runtime lane and must not recreate daemon-truth scenarios.
- Existing `.compozy/tasks/e2e/{task_01..task_06.md,_tasks.md}` edits and untracked workflow-memory files are pre-existing and must not be disturbed.

Key decisions:

- Add transport-focused helpers under `internal/testutil/e2e` for shared client access, narrow projection comparison, UDS approval-gap validation, and event-aware UDS prompt streaming instead of replacing every existing package-local integration runtime in this task.
- Keep approval-sensitive success coverage on HTTP only; UDS should assert the documented `501 Not Implemented` gap until the route gains real parity.
- Use the shared harness's shell-backed `CLI.RunJSON(...)` surface for CLI-visible parity checks. Importing `internal/cli` directly from helpers used by `httpapi` or `udsapi` tests creates a cycle through `internal/daemon`.
- Observe the pending permission request for the UDS `501` test through the HTTP prompt SSE stream. The fixture-backed ACP permission step blocks until it receives a real decision, so waiting on a UDS prompt timeout is not a stable assertion.

State:

- Completed. Source/test changes committed; tracking and workflow-memory artifacts intentionally remain unstaged.

Done:

- Read repository instructions, required skill docs, workflow memory, task spec, `_techspec.md`, `_tasks.md`, and ADR-001 through ADR-005.
- Scanned related 2026-04-16 E2E ledgers for harness, network, automation, bridge, and sandbox context.
- Reconciled worktree state and confirmed pre-existing tracking-file edits unrelated to this run.
- Captured the pre-change gap: `internal/api/httpapi/httpapi_integration_test.go` and `internal/api/udsapi/udsapi_integration_test.go` still rely heavily on package-local `newIntegrationRuntime` boot logic; HTTP approval/webhook tests do not use the shared harness; UDS only has indirect approval/webhook-gap coverage and no shared-harness parity assertions.
- Extended `internal/testutil/e2e` with transport-parity helpers: `PromptSessionWithEvents`, `TransportClients`, narrow webhook projection comparison, UDS approval-gap validation, and focused unit coverage.
- Added shared-harness HTTP transport parity integration tests for real approval flow and webhook ingress.
- Added shared-harness UDS transport parity integration tests for the documented approval `501` gap and HTTP/UDS/CLI projection parity on webhook-created runs.
- Verified focused packages successfully:
  - `go test -cover ./internal/testutil/e2e -count=1`
  - `go test -tags integration -cover ./internal/testutil/e2e -count=1`
  - `go test -tags integration -cover ./internal/api/httpapi -count=1`
  - `go test -tags integration -cover ./internal/api/udsapi -count=1`
- Ran `make verify` successfully after all code changes.
- Updated `.compozy/tasks/e2e/task_07.md` and `.compozy/tasks/e2e/_tasks.md` for task completion.
- Re-ran `make verify` after the tracking updates; it passed cleanly.
- Created local commit `98b35df6` (`test: add transport parity e2e`).
- Re-ran `make verify` on `HEAD` after the commit hook's formatting pass; it passed cleanly.

Now:

- Preparing the handoff summary with final verification evidence and the intentional unstaged tracking context.

Next:

- Optional ledger cleanup after handoff.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-16-MEMORY-transport-parity-e2e.md`
- `.compozy/tasks/e2e/memory/{MEMORY.md,task_07.md}`
- `.compozy/tasks/e2e/{task_07.md,_techspec.md,_tasks.md}`
- `internal/api/httpapi/transport_parity_integration_test.go`
- `internal/api/udsapi/transport_parity_integration_test.go`
- `internal/testutil/e2e/{runtime_harness.go,transport_parity.go,transport_parity_test.go}`
- `internal/api/httpapi/{helpers_integration_test.go,httpapi_integration_test.go,bridges_integration_test.go}`
- `internal/api/udsapi/{udsapi_integration_test.go,bridges_integration_test.go,routes.go,sessions.go,extensions_additional_test.go}`
- `internal/testutil/e2e/{runtime_harness.go,automation_tasks.go,mock_agents.go}`
- `git status --short`
- `rg -n "newIntegrationRuntime|StartRuntimeHarness|approve|webhook|501|Not Implemented" internal/api/httpapi internal/api/udsapi internal/testutil/e2e`
