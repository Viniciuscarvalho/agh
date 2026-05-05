Goal (incl. success criteria):

- Produce a concise operator guide for release QA covering AGH network plus tasks/subtasks coordination only.
- Include CLI/API/web surfaces, dependent task/run creation, agent coordination via channels, and stress scenarios grounded in real AGH sessions.
- Cite concrete repo file paths and example commands.

Constraints/Assumptions:

- Do not change product code.
- Focus strictly on network and tasks/subtasks coordination; exclude unrelated AGH areas unless needed for operator context.
- Use repository docs and source as the authority.

Key decisions:

- Use the repo QA plan in `docs/ideas/qa-e2e/README.md` as the top-level operator baseline.
- Cross-check operator flows against CLI, API contract/handlers, session manager, network runtime, and web systems code.

State:

- Completed source inspection and verification; final operator guide pending delivery.

Done:

- Read root instructions and scanned existing ledger files for cross-agent awareness.
- Activated documentation-writer guidance for concise user-goal-oriented output.
- Inspected CLI surfaces for `network` and `task` commands, including run lifecycle subcommands.
- Inspected HTTP and UDS route registration plus API spec coverage for network and task endpoints.
- Inspected task domain types/manager behavior for children, dependencies, status reconciliation, approvals, and run lifecycle.
- Inspected network runtime behavior for message kinds, interaction lifecycle, and task ingress with channel validation.
- Inspected web routes, adapters, and hooks for network/tasks, including the current web limitation around child/dependency creation.
- Inspected QA docs and E2E/integration coverage for real-session network/task scenarios.
- Ran `make verify` successfully after escalating because Mage cache writes outside the workspace; final result passed with tests/build/boundary checks clean.

Now:

- Writing the final concise release-QA operator guide.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `AGENTS.md`
- `CLAUDE.md`
- `docs/ideas/qa-e2e/README.md`
- `internal/api/httpapi/routes.go`
- `internal/api/udsapi/routes.go`
- `internal/api/spec/spec.go`
- `internal/api/contract/tasks.go`
- `internal/api/contract/contract.go`
- `internal/cli/*`
- `internal/task/*`
- `internal/network/*`
- `web/src/systems/network/*`
- `web/src/systems/tasks/*`
- `web/src/routes/_app/tasks.tsx`
- `web/src/routes/_app/tasks.$id.tsx`
- `web/src/routes/_app/network.tsx`
- `web/e2e/tasks.spec.ts`
- `web/e2e/network.spec.ts`
- `internal/network/tasks_integration_test.go`
- `internal/daemon/daemon_network_collaboration_integration_test.go`
- `internal/task/manager_integration_test.go`
- `internal/store/globaldb/global_db_task_graph_audit_integration_test.go`
- `make verify`
