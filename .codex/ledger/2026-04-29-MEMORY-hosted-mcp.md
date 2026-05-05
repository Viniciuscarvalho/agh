Goal (incl. success criteria):

- Implement Task 10 hosted AGH MCP session exposure and approval bridge so ACP sessions receive session-bound AGH registry tools through hosted MCP, with bind validation, projection parity, approval bridge errors, deterministic tests, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Must use workflow memory at `.compozy/tasks/tools-registry/memory/MEMORY.md` and `task_10.md`.
- Must read `_techspec.md`, ADR-002, ADR-005, ADR-010, ADR-011, `_tasks.md`, AGENTS/CLAUDE guidance before code edits.
- Must not run destructive git commands or touch unrelated worktree changes.
- Must route hosted MCP calls through `Registry.Call`; bind nonce is not bearer auth; no client-supplied approval tokens; hosted tool schemas must use raw descriptor schema bytes.
- Must run full `make verify` before completion and before/after auto-commit.

Key decisions:

- Treat the approved PRD/TechSpec/ADRs as the design approval for implementation; do not open a separate brainstorming approval cycle.
- Hosted MCP is session exposure only, not the external MCP backend from Task 09.
- Add approval mediation inside `RuntimeRegistry` via an injected bridge before provider execution, so hosted MCP calls remain on the canonical dispatch path.
- Narrow ACP `mcpServers` injection to the AGH-hosted stdio entry; remote HTTP/SSE MCP servers remain daemon-owned registry backends.

State:

- Task implementation, focused tests, coverage, full verification, tracking updates, local commit, post-commit verification, and workflow memory updates are complete.

Done:

- Read shared workflow memory and current task memory.
- Read root AGH guidance surfaced by caller and repository.
- Scanned AGH ledger directory for cross-agent awareness.
- Read required skills and AGH local Go/test/security/concurrency guidance.
- Read `_techspec.md`, `_tasks.md`, `task_10.md`, ADR-002, ADR-005, ADR-010, and ADR-011.
- Read relevant prior ledgers for Task 09 and mcp-go adoption.
- Mapped core ACP/session/tools/MCP/UDS/daemon surfaces.
- Confirmed no existing hosted `agh tool mcp` entrypoint, proxy, or projection stream exists.
- Confirmed current ACP conversion wrongly turns all config MCP servers, including HTTP/SSE remotes, into stdio entries.
- Confirmed registry dispatch has no approval bridge before provider execution.
- Added `tools.ApprovalBridge` wiring to `RuntimeRegistry` dispatch and deterministic approval error normalization for unreachable, timed out, and canceled cases.
- Added ACP/session request-permission plumbing so daemon-side code can ask the active ACP process for permission without bypassing existing handlers.
- Ran `go test ./internal/acp ./internal/session ./internal/tools`; all passed.
- Added daemon approval bridge wiring, hosted MCP lifecycle service, hidden `agh tool mcp` proxy entrypoint, UDS hosted bind/projection/call/release routes, UDS peer/binary validation, ACP hosted-only stdio injection, and acpmock MCP diagnostics.
- Added deterministic tests for bind nonce TTL/single-use/redaction, peer/binary fail-closed validation, raw schema registration, proxy list/call/projection updates, hosted-only ACP injection, acpmock start diagnostics, and approval timeout/cancel/unreachable mappings.
- Ran focused touched package suite; all passed.
- Ran `go test -coverprofile=/tmp/agh-mcp.cover ./internal/mcp`; package coverage is 81.0%.
- Fixed full-verify lint failures: checked release/projection stream errors, removed large `ToolView` value passing in approval bridge APIs, handled projection digest marshal errors, fixed Darwin cgo conversion/imports, and avoided ACP SDK `Cancelled` field access because lint auto-fix rewrites it to `Canceled`.
- Full `make verify` passed after the self-review tweak with `Found 0 warnings and 0 errors.`, `257` Vitest files / `1838` Vitest tests passing, `DONE 6880 tests in 46.208s`, and `OK: all package boundaries respected`.
- Marked Task 10 checkboxes/status complete in `.compozy/tasks/tools-registry/task_10.md` and `_tasks.md`.
- Created local commit `af576477` (`feat: expose hosted session mcp tools`) containing only Task 10 code/test files.
- Post-commit `make verify` exited 0 with `Found 0 warnings and 0 errors.`, `257` Vitest files / `1838` Vitest tests passing, `DONE 6880 tests in 10.748s`, and `OK: all package boundaries respected`.
- Updated workflow memory with final Task 10 commit and verification facts.

Now:

- Final handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- Workflow memory: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/MEMORY.md`, `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/task_10.md`.
- PRD task: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/task_10.md`.
- Repo: `/Users/pedronauck/Dev/compozy/agh`.
- Focused verification: `go test ./internal/mcp ./internal/acp ./internal/session ./internal/testutil/acpmock ./internal/testutil/acpmock/cmd/acpmock-driver ./internal/daemon ./internal/tools ./internal/api/udsapi ./internal/cli`.
- Coverage evidence: `go test -coverprofile=/tmp/agh-mcp.cover ./internal/mcp` => 81.0%.
- Commit: `af576477`.
