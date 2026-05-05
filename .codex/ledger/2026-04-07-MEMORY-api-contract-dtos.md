Goal (incl. success criteria):

- Implement task_02 by creating internal/api/contract, moving shared daemon DTOs out of internal/apicore, preserving JSON/API compatibility, and finishing with verified tests plus tracking updates.

Constraints/Assumptions:

- Must follow task_02, \_techspec.md, ADR-001, ADR-002, AGENTS.md, and CLAUDE.md.
- Must update workflow memory before completion and run make verify before any completion claim or commit.
- Transport-specific HTTP/SSE prompt payloads stay outside api/contract.

Key decisions:

- Shared daemon DTOs now live in `internal/api/contract`; `internal/apicore` retains only transport helpers such as SSE envelopes, flush writers, and observe cursors.
- HTTP AI SDK prompt-stream payloads remain local to `internal/httpapi/prompt.go` and are explicitly tested as transport-local.

State:

- completed

Done:

- Loaded AGENTS.md, CLAUDE.md, task_02, \_tasks.md, \_techspec.md, shared workflow memory, and current task memory.
- Read ADR-001 and ADR-002 plus relevant peer ledgers for cross-task context.
- Created `internal/api/contract` and migrated shared daemon DTOs out of `internal/apicore/payloads.go`.
- Updated `apicore`, `httpapi`, and `udsapi` to consume the new contract package without changing route-level JSON shapes.
- Added contract/parity tests, including an HTTP prompt test that proves transport-only payloads stay outside the shared contract.
- Ran targeted unit tests, coverage checks, API integration checks, `make test-integration`, and `make verify` successfully.

Now:

- Update workflow/task tracking, review the final diff, and create the local code-only commit.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- .compozy/tasks/refac-v2/task_02.md
- .compozy/tasks/refac-v2/\_techspec.md
- .compozy/tasks/refac-v2/memory/MEMORY.md
- .compozy/tasks/refac-v2/memory/task_02.md
- internal/api/contract/contract.go
- internal/apicore/{conversions.go,handlers.go,memory.go,workspaces.go,errors.go,payloads.go}
- internal/httpapi/{shared.go,prompt_contract_test.go}
- internal/udsapi/shared.go
