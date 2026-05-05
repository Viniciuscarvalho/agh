Goal (incl. success criteria):

- Implement accepted MCP loading expansion: top-level `mcp_servers` in global/workspace `config.toml`, automatic `mcp.json` loading from `~/.agh/`, workspace `.agh/`, agent directories, and skill directories, with approved precedence and `make verify` passing.

Constraints/Assumptions:

- Must follow root `AGENTS.md` and `CLAUDE.md`, including no destructive git commands, root-cause fixes only, `make verify` as completion gate, and tests that protect correctness rather than chase green status.
- Use `golang-pro`, `testing-anti-patterns`, and `no-workarounds` guidance for this implementation.
- Accepted behavior:
  - top-level `config.mcp_servers` is a baseline before provider-level MCP servers
  - same-scope inline + `mcp.json` coexist and merge
  - if the same MCP server name exists in both same-scope sources, `mcp.json` wins and replaces that server object
  - `mcp.json` accepts both `mcpServers` and `mcp_servers`

Key decisions:

- Prefer one shared MCP JSON parser/normalizer instead of separate ad hoc decoding in config/agent/skills.
- Reuse existing `MCPServer` as the canonical runtime representation and existing merge helpers where possible.
- Extend existing cache invalidation paths to snapshot `mcp.json` sidecars rather than relying on content reload side effects.

State:

- Verification complete; ready for handoff.

Done:

- Reviewed current MCP config/agent/skill/session/workspace implementation seams and adjacent ledgers.
- Confirmed clean worktree before edits.
- Captured accepted product decisions for same-scope merge, source precedence, JSON shape, and runtime ordering.
- Persisted the accepted plan at `.codex/plans/2026-04-10-mcp-sidecars.md`.
- Added shared `mcp.json` parsing/normalization in `internal/config/mcpjson.go`, including support for `mcpServers` and `mcp_servers`.
- Added top-level `Config.MCPServers`, config overlay support for root-level `mcp_servers`, and global/workspace `mcp.json` loading.
- Added same-scope MCP override semantics via `OverrideMCPServers`, keeping existing cross-scope field-merge behavior via `MergeMCPServers`.
- Updated agent loading so `LoadAgentDefFile` auto-loads `<agentDir>/mcp.json`.
- Updated skill loading so filesystem and bundled skill loaders auto-load `<skillDir>/mcp.json`.
- Updated workspace and skills cache/snapshot invalidation to include MCP sidecars, including the workspace skill registry cache path.
- Updated runtime resolution so top-level config MCP servers are applied before provider-level MCP servers.
- Added tests for JSON parsing, config merge behavior, agent sidecars, skill sidecars, workspace skill sidecar cache invalidation, and session/runtime merge order.
- Updated README and the bundled `agh-agent-setup` skill docs to describe top-level `mcp_servers` and `mcp.json`.
- Ran `go test ./internal/config ./internal/skills ./internal/workspace ./internal/session -count=1`, `go test ./internal/extension -run TestHostAPIHandlerSessionsListReturnsAuthorizedSessions -count=5`, `make verify`, and `git diff --check` successfully.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- Untracked `.compozy/tasks/automation/` appeared during verification and was left untouched because it is outside the requested scope.

Working set (files/ids/commands):

- Files: `.codex/plans/2026-04-10-mcp-sidecars.md`, `internal/config/*`, `internal/skills/*`, `internal/workspace/*`, `internal/session/*`, `README.md`, `openapi/agh.json`
- Commands: `rg -n`, `sed -n`, `git status --short`, `go test ...`, `make verify`
