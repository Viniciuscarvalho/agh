Goal (incl. success criteria):

- Perform a read-only audit of the current branch against `.compozy/tasks/tools-refac/_techspec.md` and ADRs 001-006, focusing only on built-in tools, hosted MCP exposure, prompt sections, and skill guidance.
- Success means the report clearly separates: what already exists; what the spec wrongly implies is absent; what proposed toolsets/capabilities conflict with current branch architecture or naming; and concrete file/line references.

Constraints/Assumptions:

- No file edits other than this audit ledger.
- Do not use destructive git commands.
- Stay scoped to built-in tools, hosted MCP, prompt sections, and bundled skill guidance.
- Current branch code is authoritative over stale task/ledger memories.

Key decisions:

- Treat `internal/tools/builtin/*`, `internal/daemon/prompt_sections.go`, `internal/daemon/hosted_mcp.go`, `internal/daemon/tool_approval_bridge.go`, and `internal/skills/bundled/skills/agh-agent-setup/SKILL.md` as primary evidence.
- Use line-numbered references from the spec/ADRs and current code/tests for the final audit.

State:

- Evidence collection in progress; ready to write final audit.

Done:

- Read `internal/CLAUDE.md`.
- Scanned `.codex/ledger/*-MEMORY-*.md` for cross-agent awareness and loaded the current `tools-refac` ledger plus adjacent ledgers for tool/hosted-MCP context.
- Read `.compozy/tasks/tools-refac/_techspec.md` and ADR-001 through ADR-006.
- Inspected current built-in tool registry code in `internal/tools/builtin/*` and `internal/tools/*` support types.
- Inspected prompt section wiring in `internal/daemon/prompt_sections.go`, `internal/daemon/harness_context.go`, `internal/daemon/composed_assembler.go`, and `internal/daemon/boot.go`.
- Inspected hosted MCP wiring in `internal/daemon/hosted_mcp.go`, `internal/mcp/hosted.go`, and related tests.
- Inspected tool approval bridge in `internal/daemon/tool_approval_bridge.go` and `internal/daemon/tool_approval_bridge_test.go`.
- Inspected skill guidance in `internal/skills/bundled/skills/agh-agent-setup/SKILL.md` plus bundled skill tests.

Now:

- Synthesize findings and concrete discrepancies with file/line references.

Next:

- Deliver the read-only audit summary to the user.

Open questions (UNCONFIRMED if needed):

- Whether the user wants a follow-up diff against the older `tools-registry` task artifacts as a second pass. Not required for the current request.

Working set (files/ids/commands):

- `.compozy/tasks/tools-refac/_techspec.md`
- `.compozy/tasks/tools-refac/adrs/adr-001-agent-tool-surface.md`
- `.compozy/tasks/tools-refac/adrs/adr-002-dynamic-tool-policy-and-projections.md`
- `.compozy/tasks/tools-refac/adrs/adr-003-identity-bound-autonomy-tools.md`
- `.compozy/tasks/tools-refac/adrs/adr-004-mcp-auth-status-tool.md`
- `.compozy/tasks/tools-refac/adrs/adr-005-session-bound-autonomy-surface.md`
- `.compozy/tasks/tools-refac/adrs/adr-006-agent-manageable-mutation-default.md`
- `internal/tools/builtin/builtin_test.go`
- `internal/tools/builtin/catalog.go`
- `internal/tools/builtin/descriptors.go`
- `internal/tools/builtin/network.go`
- `internal/tools/builtin/skills.go`
- `internal/tools/builtin/tasks.go`
- `internal/tools/builtin/toolsets.go`
- `internal/daemon/prompt_sections.go`
- `internal/daemon/hosted_mcp.go`
- `internal/daemon/tool_approval_bridge.go`
- `internal/daemon/native_tools.go`
- `internal/daemon/harness_context.go`
- `internal/skills/bundled/skills/agh-agent-setup/SKILL.md`
- `internal/mcp/hosted.go`
- `internal/mcp/hosted_test.go`
