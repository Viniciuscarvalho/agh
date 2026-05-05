Goal (incl. success criteria):

- Complete `.compozy/tasks/e2e/task_14.md` by adding later-tier combined-flow and credentialed nightly E2E coverage on the existing runtime/browser harnesses, keeping those scenarios out of default PR-required lanes.
- Success requires focused unit/integration coverage, richer multi-domain artifacts, workflow/task tracking updates, clean verification, and one local commit after self-review.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`, workflow-memory instructions, `.compozy/tasks/e2e/{task_14.md,_techspec.md,_tasks.md}`, and ADR-002/004/005.
- Required skills in use: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`.
- Keep scope tight to task_14; do not disturb pre-existing task-tracking edits already present in `.compozy/tasks/e2e`.
- `make verify` is mandatory before any completion claim or commit.

Key decisions:

- Keep nightly daemon combined-flow tests behind the `TestDaemonNightlyE2E...` prefix and `internal/e2elane.NightlyRuntimeE2EPattern` instead of widening the default runtime selector.
- Capture multi-domain diagnostics in dedicated `combined_flow.json` and `tool_host_diagnostics.json` artifacts rather than reusing `provider_calls.json`.
- Fix the shipped Bridges UI stale-route bug in `use-bridge-health-stream` instead of adding browser reloads or timing workarounds to the nightly Playwright flow.

State:

- In progress.

Done:

- Read repository guidance, required skill files, workflow memory, task 14 spec, shared task list, and relevant prior E2E ledgers.
- Identified the current workspace already has unrelated tracking-file edits that must be preserved.
- Confirmed task_14 is the later-tier follow-up after task_13 lane wiring.
- Added nightly lane selector coverage in `internal/e2elane` so `TestDaemonNightlyE2E...` stays out of default runtime entrypoints.
- Added shared runtime harness support for `ResumeSession`, `combined_flow.json`, and separate `tool_host_diagnostics.json` capture with unit coverage.
- Added nightly daemon integration coverage for automation task resume -> network reply and bridge ingress -> environment tool -> bridge-visible delivery.
- Added a nightly Playwright bridge-to-session combined flow and fixed the Bridges route SSE/query invalidation bug it exposed.
- Verified focused runtime/browser commands and passed `make verify`.

Now:

- Update workflow memory and task tracking, then rerun `make verify` after the tracking edits and create the required local commit.

Next:

- Commit the verified task_14 changes without touching unrelated task-tracking edits.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-nightly-e2e-followup.md`
- `.compozy/tasks/e2e/{task_14.md,_techspec.md,_tasks.md,memory/{MEMORY.md,task_14.md}}`
- `internal/daemon/daemon_nightly_combined_integration_test.go`
- `internal/testutil/e2e/{artifacts.go,artifacts_test.go,runtime_harness.go,runtime_harness_helpers_test.go}`
- `internal/e2elane/{lanes.go,lanes_test.go}`
- `web/e2e/combined-flows.spec.ts`
- `web/src/systems/bridges/hooks/{use-bridge-health-stream.ts,use-bridge-health-stream.test.tsx}`
- `go test ./internal/e2elane ./internal/testutil/e2e`
- `go test -tags integration ./internal/daemon -run 'TestDaemonNightlyE2E(AutomationTaskResumesIntoNetworkChannel|BridgeIngressUsesEnvironmentToolBeforeDelivery)$'`
- `bunx playwright test web/e2e/combined-flows.spec.ts --grep @nightly`
- `make verify`
