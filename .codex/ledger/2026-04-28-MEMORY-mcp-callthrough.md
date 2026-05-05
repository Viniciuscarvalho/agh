Goal (incl. success criteria):

- Implement Task 09: daemon-owned MCP call-through in `internal/mcp`, config/auth preservation, registry integration, redacted diagnostics, tests, tracking updates, one local commit after clean verification.

Constraints/Assumptions:

- Must use workflow memory paths under `.compozy/tasks/tools-registry/memory/`.
- Must not leak MCP token records, bearer headers, OAuth codes, PKCE verifiers, refresh tokens, or client secrets across `internal/mcp`.
- Must not run destructive git commands without explicit permission.
- Must run `make verify` before completion/commit.
- PRD/TechSpec/ADRs are the accepted design source for this implementation.

Key decisions:

- PRD/TechSpec/ADRs are the accepted design source; no new design approval loop is needed for this execution task.
- `internal/mcp` will import `internal/tools` to implement the MCP executor/provider boundary; `internal/tools` must remain MCP-package independent.
- Remote HTTP/SSE MCP servers must be omitted from ACP `McpServers` stdio projection and executed only through daemon-owned MCP adapters.

State:

- Implementation checklist built; capturing baseline signal before code edits.

Done:

- Read required workflow skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`.
- Read Go/test/no-workaround/brainstorming guidance relevant to this backend task.
- Read shared and task workflow memory.
- Read root and internal AGENTS/CLAUDE guidance for `agh`.
- Read Task 09, `_techspec.md`, `_tasks.md`, ADR-002, ADR-005, and ADR-010.
- Inspected existing config/resource/tool/auth/daemon/ACP surfaces.

Now:

- Capture pre-change signal, update workflow task memory, then edit MCP/resource/provider code.

Next:

- Fix clone preservation and ACP stdio projection; implement `internal/mcp` executor/provider.

Open questions (UNCONFIRMED if needed):

- None blocking.

Working set (files/ids/commands):

- Workflow memory: `.compozy/tasks/tools-registry/memory/MEMORY.md`, `.compozy/tasks/tools-registry/memory/task_09.md`.
- Task files: `.compozy/tasks/tools-registry/task_09.md`, `_techspec.md`, `_tasks.md`, `adrs/adr-002-session-tool-exposure-path.md`, `adrs/adr-005-acp-approval-policy-integration.md`, `adrs/adr-010-remote-mcp-call-through.md`.
- Code surfaces: `internal/mcp`, `internal/mcp/auth`, `internal/daemon/tool_mcp_resources.go`, `internal/daemon/native_tools.go`, `internal/acp/client.go`, `internal/tools`.
