Goal (incl. success criteria):

- Refazer os artefatos de `.compozy/tasks/tools-registry/` para usar `github.com/mark3labs/mcp-go` em vez do SDK oficial, mantendo AGH como autoridade de policy/auth/manageability.
- Success means `_techspec.md`, ADRs, analysis e tasks refletem `mcp-go v0.49.0`, restauram o suporte remoto `sse` como decisão de produto, descrevem corretamente auth/schema/transport boundaries, passam os checks de spec, e ficam prontos para peer review + `make verify`.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts in English.
- User corrigiu explicitamente a direção e quer `https://github.com/mark3labs/mcp-go`, não `github.com/modelcontextprotocol/go-sdk`.
- User explicitou para usar subagents nesta rodada.
- Use primary sources for external technical claims.
- No destructive git commands.
- Existing dirty worktree in `.compozy/tasks/tools-registry/task_03.md` through `task_08.md` and `.compozy/tasks/tools-registry/memory/` is unrelated; do not touch.

Key decisions:

- Research target: `github.com/mark3labs/mcp-go` at latest module version `v0.49.0` (`go list -m -json ...@latest` resolved `Time: 2026-04-21T16:53:42Z`).
- Boundary decision: use `mcp-go` for hosted MCP server/client protocol and transports, but keep AGH-owned registry/policy/redaction/auth/state logic outside the library.
- Preserve AGH canonical `ToolID` grammar even though `mcp-go` accepts broader MCP tool names.
- Preserve existing AGH remote MCP config surface `stdio|http|sse`; the prior hard-cut of `sse` was reverted because `mcp-go` supports explicit SSE clients/servers.
- Hosted MCP uses exact descriptor schema bytes via `mcp.Tool.RawInputSchema` / `RawOutputSchema`; reflection helpers (`WithInputSchema`, `WithOutputSchema`) are forbidden there.
- Remote auth remains fully AGH-owned. MVP direction is AGH-owned header injection inside `internal/mcp` plus at most one `internal/mcp/auth.Service.Refresh`; do not let `client.NewOAuthStreamableHttpClient`, `client.NewOAuthSSEClient`, default `transport.NewOAuthHandler`, or `MemoryTokenStore` become the auth authority.
- Remote discovered schema fidelity is not described as byte-exact by default; preserve raw bytes when available from the library, otherwise store one canonical JSON encoding of the decoded schema.
- Upstream remote `notifications/tools/list_changed` remain cache-invalidation hints only in MVP; hosted AGH MCP still uses a daemon→proxy projection stream and hosted `tools/list_changed`.

State:

- Complete for this rewrite round. Research completed, artifacts rewritten toward `mcp-go`, blockers from peer review round 6 were patched, spec markers passed, and fresh `make verify` passed.

Done:

- Read project rules, `internal/CLAUDE.md`, spec playbook, standing directives, glossary, current `_techspec.md`, ADRs, tasks, and prior ledger.
- Spawned three read-only subagents for: `mcp-go` API research, artifact impact mapping, and local AGH boundary mapping.
- Confirmed from primary sources and local module code:
  - `mcp-go v0.49.0` latest
  - hosted/server APIs: `server.NewMCPServer`, `server.ServeStdio`, session tools, `tools/list_changed`
  - remote client APIs: `client.NewStdioMCPClient`, `client.NewStreamableHttpClient`, `client.NewSSEMCPClient`
  - schema APIs: `mcp.Tool.RawInputSchema`, `RawOutputSchema`
  - OAuth helper surfaces and `MemoryTokenStore` default risk
- Confirmed from local AGH code:
  - config/settings already model `stdio`, `http`, `sse`
  - ACP path remains stdio-only for hosted injection
  - `internal/mcp/auth` already owns durable remote auth lifecycle
  - `internal/daemon/tool_mcp_resources.go` currently drops `Transport`/`URL`/`Auth`
  - current internal MCP descriptor model still needs explicit `output_schema`
- Rewrote/renamed artifacts:
  - `.compozy/tasks/tools-registry/analysis/analysis_mark3labs_mcp_go.md`
  - `.compozy/tasks/tools-registry/adrs/adr-011-mark3labs-mcp-go.md`
  - updated `.compozy/tasks/tools-registry/adrs/adr-010-remote-mcp-call-through.md`
  - updated `.compozy/tasks/tools-registry/task_09.md`
  - updated `.compozy/tasks/tools-registry/task_10.md`
  - updated `.compozy/tasks/tools-registry/_techspec.md`
- Ran Claude Opus peer review round 6 against the rewritten spec. Verdict: `NEEDS_REWORK` with two blockers:
  - validation section still rejected `sse`
  - `approval_token` producer surface was unspecified
- Patched both blockers in `_techspec.md`:
  - restored validation alignment for remote transports `{stdio, http, sse}`
  - defined approval-token issuance via HTTP/UDS/CLI, with TTL, single-use semantics, and scoped invariants
- Fresh validation after the final patch set:
  - `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/tools-registry/_techspec.md` → passed
  - `git diff --check -- [touched files]` → clean
  - `make verify` → passed with `0 issues.`, `257` Vitest files / `1838` Vitest tests passing, `DONE 6801 tests in 6.141s`, and `OK: all package boundaries respected`
- Reviewed completed tasks `01` through `08` against the `mcp-go` rewrite. Conclusion: no task status rollback is needed; the library-specific deltas remain scoped to pending tasks `09` and `10`.
- Recorded two MCP-specific implementation caveats to absorb during task `09`, not as retroactive task reopeners:
  - `internal/daemon/tool_mcp_resources.go` still drops `Transport`, `URL`, and `Auth` in `cloneDaemonMCPServer`
  - `internal/tools.MCPToolDescriptor` still lacks `output_schema`, even though the revised TechSpec now expects it
- Updated `.compozy/tasks/tools-registry/task_09.md` so the task body now explicitly owns:
  - normalization of upstream MCP descriptors including `output_schema`
  - the `internal/tools.MCPToolDescriptor` contract update
  - unit/integration tests for normalized external `output_schema` preservation
- Re-ran validation after the task-body edit:
  - `git diff --check -- .compozy/tasks/tools-registry/task_09.md .codex/ledger/2026-04-28-MEMORY-tools-registry-mcp-go.md` → clean
  - `make verify` → passed with `0 issues.`, `257` Vitest files / `1838` Vitest tests passing, `DONE 6801 tests in 6.196s`, and `OK: all package boundaries respected`

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- Optional future rigor step only: rerun peer review round 7 after the blocker patches if the user wants a refreshed Opus readiness verdict. Not required for this handoff because round 6 already produced concrete blockers and both were addressed.

Working set (files/ids/commands):

- `.compozy/tasks/tools-registry/_techspec.md`
- `.compozy/tasks/tools-registry/task_09.md`
- `.compozy/tasks/tools-registry/task_10.md`
- `.compozy/tasks/tools-registry/analysis/`
- `.compozy/tasks/tools-registry/adrs/`
- `.codex/ledger/2026-04-28-MEMORY-tools-registry-mcp-go.md`
- `go list -m -json github.com/mark3labs/mcp-go@latest`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/README.md`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/mcp/tools.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/server/server.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/server/streamable_http.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/server/sse.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/client/stdio.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/client/http.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/client/sse.go`
- `/Users/pedronauck/go/pkg/mod/github.com/mark3labs/mcp-go@v0.49.0/client/transport/oauth.go`
