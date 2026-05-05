Goal (incl. success criteria):

- Read-only inspection for Tool Registry TechSpec correction.
- Determine how existing AGH extensions define executable behavior in Go/TypeScript and what Tool Registry should reuse instead of descriptor-only tool backends.

Constraints/Assumptions:

- Do not edit project source or task artifacts.
- Conversation in BR-PT; code/artifact names remain in English.
- No destructive git commands.
- Use local search only for project code.

Key decisions:

- Use `architectural-analysis` skill for architecture trace.
- Treat `.codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md`, `.codex/ledger/2026-04-28-MEMORY-tools-registry-tasks.md`, and `.codex/ledger/2026-04-10-MEMORY-ext-architecture.md` as relevant prior context.

State:

- Inspection complete; preparing recommendation.

Done:

- Scanned `.codex/ledger/` for cross-agent awareness.
- Read relevant prior Tool Registry and extension ledgers.
- Confirmed `.compozy/tasks/ext-architecture` is archived at `.compozy/tasks/_archived/20260411-014454-ext-architecture`.
- Mapped current extension subprocess runtime: `internal/extension/manager.go`, `internal/subprocess`, `internal/extension/host_api.go`, and `internal/extension/protocol/host_api.go`.
- Mapped TypeScript SDK runtime: `sdk/typescript/src/extension.ts`, `host-api.ts`, `transport.ts`, generated contracts, testing harness, and create-extension templates.
- Confirmed `internal/tools.Tool` and extension `resources.tools` are currently cold metadata only.
- Confirmed existing executable extension behavior is via capabilities/service methods and Host API, not descriptor-only backends.

Now:

- Return concrete paths, interfaces/types, and recommended Tool Registry integration model.

Next:

- No further read-only inspection planned unless requested.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `internal/extension`
- `internal/subprocess`
- `internal/tools`
- `internal/daemon/tool_mcp_resources.go`
- `internal/bridgesdk`
- `sdk/typescript`
- `sdk/create-extension`
- `sdk/examples`
- `.compozy/tasks/_archived/20260411-014454-ext-architecture`
- `.compozy/tasks/tools-registry`
