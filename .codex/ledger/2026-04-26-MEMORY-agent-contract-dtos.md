Goal (incl. success criteria):

- Execute `.compozy/tasks/autonomous/task_02.md`: add autonomy agent-facing DTOs, OpenAPI schema/operation parity, generated web contracts, and contract safety tests, then verify and create one local code commit.

Constraints/Assumptions:

- Follow AGENTS/CLAUDE: no destructive git commands, `make verify` gate before completion, no web search for local code, keep manual/autonomous surfaces on shared contracts.
- Required skills loaded: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, plus Go/test/TypeScript/no-workaround guidance.
- Workflow memory paths are authoritative for this PRD task; update task memory before finishing.
- Raw `claim_token` may appear only in synchronous claim response DTOs; read/list/detail/SSE/web/channel DTOs expose no raw token.
- Existing worktree has pre-existing dirty autonomy PRD/task changes and untracked memory files; do not revert or stage unrelated changes.

Key decisions:

- Added OpenAPI-only `/api/agent/*` operations without HTTP/UDS route wiring, matching Task 02's "contracts before behavior" boundary.
- Existing task/session read models get optional safe fields (`claim_token_hash`, lease timestamps, `coordination_channel_id`, lineage) while raw `claim_token` is confined to command inputs and the synchronous agent claim response.

State:

- completed

Done:

- Read required workflow memory, Task 02, `_tasks.md`, `_techspec.md`, ADR-001, ADR-002, ADR-003, ADR-006, ADR-011, ADR-012, root/web guidance, and relevant prior ledgers.
- Confirmed Task 01 handoff: coordinator config resolver boundary exists; no OpenAPI/web changes were needed in task 01.
- Added contract DTOs/helpers/tests for agent context, coordination channels, task claim/lease commands, spawn/lineage, coordinator config, and raw claim-token safety.
- Added OpenAPI operation/schema registration and tests for agent endpoints.
- Targeted tests passed: `go test ./internal/api/contract ./internal/api/core ./internal/api/spec`.
- Ran `make codegen`, `make codegen-check`, `make web-typecheck`, `make web-test`, focused coverage checks, and full `make verify`.
- Updated workflow memory with final evidence and Task 02 handoff context.
- Updated Task 02 tracking files and created local code commit `f7d9ecfb feat: add agent contract dtos`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/autonomous/task_02.md`
- `.compozy/tasks/autonomous/_tasks.md`
- `.compozy/tasks/autonomous/_techspec.md`
- `.compozy/tasks/autonomous/adrs/adr-002.md`
- `.compozy/tasks/autonomous/adrs/adr-003.md`
- `.compozy/tasks/autonomous/adrs/adr-006.md`
- `.compozy/tasks/autonomous/adrs/adr-011.md`
- `.compozy/tasks/autonomous/adrs/adr-012.md`
- `.compozy/tasks/autonomous/memory/MEMORY.md`
- `.compozy/tasks/autonomous/memory/task_02.md`
- `internal/api/contract/agents.go`
- `internal/api/contract/agents_test.go`
- `internal/api/core/agent_contracts.go`
- `internal/api/core/agent_contracts_test.go`
- `internal/api/spec/spec.go`
- `internal/api/spec/spec_test.go`
- `openapi/agh.json`
- `sdk/typescript/src/generated/contracts.ts`
- `web/src/generated/agh-openapi.d.ts`
- `web/src/systems/session/mocks/fixtures.ts`
- `web/src/systems/session/types.ts`
- `web/src/systems/tasks/mocks/fixtures.ts`
- `web/src/systems/tasks/types.ts`
