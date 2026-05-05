Goal (incl. success criteria):

- Implement `agh workspace` add/list/info/edit/remove and extend `agh session` with `--workspace`, `--cwd`, default CWD auto-register, and list filtering.
- Add CLI tests covering request payloads, invalid flag combinations, and client query behavior.
- Finish with clean verification (`make verify`), workflow memory updates, PRD tracking updates, and one local commit.

Constraints/Assumptions:

- Scope is limited to task 12 surfaces under `internal/cli` plus any minimal integration-test updates needed.
- UDS already exposes workspace CRUD and workspace-aware session create/list semantics from task 11; CLI must route through that client surface.
- Resolver cache invalidation is not exposed over the current UDS/http workspace service; no CLI `--force-refresh` flag should be added unless transport support appears.
- Do not touch unrelated git changes; `.compozy/tasks/workspace-entity/` is currently untracked and tracking files should stay out of the auto-commit unless explicitly required.

Key decisions:

- Treat the task spec and techspec as design-approved and implement directly without inventing extra transport/API changes.
- Keep the CLI thin: add workspace methods to `DaemonClient` and reuse existing `/api/workspaces*` endpoints instead of local filesystem logic.
- Enforce `session new` workspace input contract in Cobra before the request is sent.

State:

- Verification complete; ready to commit.

Done:

- Read repository instructions, workflow memory, task spec, techspec, ADRs, and tracking checklist.
- Confirmed missing CLI surfaces and existing UDS workspace/session contracts.
- Added `agh workspace` add/list/info/edit/remove commands and registered the workspace command tree.
- Extended session create/list CLI flows to support `--workspace`, `--cwd`, default CWD auto-register, and workspace filtering.
- Extended the UDS client with workspace request/response types and session list query support.
- Added unit and integration coverage for workspace/session CLI flows and raised `internal/cli` package coverage above 80% with additional install wizard tests.
- Updated workflow memory and PRD task tracking for task 12.

Now:

- Review commit contents and create the local commit.

Next:

- Final response with verification evidence and outcome summary.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `internal/cli/root.go`
- `internal/cli/session.go`
- `internal/cli/client.go`
- `internal/cli/session_test.go`
- `internal/cli/client_test.go`
- `internal/cli/cli_integration_test.go`
- `internal/cli/workspace.go`
- `.compozy/tasks/workspace-entity/memory/task_12.md`
- `.compozy/tasks/workspace-entity/_tasks.md`
- `.compozy/tasks/workspace-entity/task_12.md`
