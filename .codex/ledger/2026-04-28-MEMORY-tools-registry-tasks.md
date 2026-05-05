Goal (incl. success criteria):

- Generate an AGH-compliant task breakdown for `.compozy/tasks/tools-registry/` from the approved TechSpec.
- Success means presenting a dependency-ordered set of implementation tasks with titles, types, complexities, descriptions, and QA tail tasks for user approval before any task files are written.

Constraints/Assumptions:

- User invoked `$cy-create-tasks` for `.compozy/tasks/tools-registry`.
- Must follow `cy-spec-preflight`, `cy-create-tasks`, `cy-web-docs-impact`, and `cy-tasks-tail-qa-pair`.
- Must stop at the interactive approval checkpoint before generating `_tasks.md` or `task_NN.md`.
- `.compozy/config.toml` is absent; use built-in task types: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.
- No `_prd.md` exists for this feature; tasks derive from `_techspec.md`, ADRs, analysis files, and codebase exploration.
- No destructive git commands. Subagents are read-only and only used for exploration.

Key decisions:

- Task slug for this session ledger: `tools-registry-tasks`.
- Use the approved TechSpec MVP steps and actual codebase surfaces to define implementation slices, not abstract spec restatements.
- Preserve the canonical QA pair at the tail: `QA Plan and Test Coverage` then `Real-Scenario QA Execution`.
- Backend tasks must carry explicit web/docs impact and extensibility/agent-manageability/config-lifecycle coverage once task files are authored.
- User requested an explicit `packages/site` documentation task after the web/operator task instead of folding all docs into a single mixed surface task.
- User rejected the current manifest-first descriptor-only extensibility pattern as insufficient. Expected model: real executable tool registration via Go functions for native/runtime-owned tools and TypeScript-backed extension handlers using the existing extension model, not only descriptor-only external backends.
- Current TechSpec now reflects the corrected model: executable `native_go`, executable `extension_host` via TypeScript/Go extension SDKs, and executable `mcp` via daemon-owned call-through.
- Existing `_tasks.md` and `task_NN.md` files are absent in `.compozy/tasks/tools-registry/`.

State:

- Task generation complete for `.compozy/tasks/tools-registry/`.

Done:

- Loaded `cy-create-tasks`, `cy-spec-preflight`, `cy-web-docs-impact`, and `cy-tasks-tail-qa-pair` skill instructions.
- Read `docs/_memory/spec-authoring-playbook.md`, `standing_directives.md`, `glossary.md`, tasks preflight checks, and tasks-phase lessons `L-002`, `L-007`, `L-009`, `L-011`.
- Read the related ledger `.codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md` for prior accepted ADR decisions and verification status.
- Confirmed `.compozy/tasks/tools-registry/` contains `_techspec.md`, ADRs, analysis, and QA artifacts, but no `_prd.md`.
- Confirmed `.compozy/config.toml` is absent, so task type defaults apply.
- Read the Tool Registry TechSpec sections, implementation steps, impact analysis, safety invariants, and test strategy.
- Read ADR-001 through ADR-007 for accepted architecture decisions.
- Mapped current codebase surfaces in `internal/tools`, `internal/mcp/auth`, `internal/api/core`, `internal/cli`, `internal/extension`, `internal/config`, `web/`, and `packages/site`.
- Loaded `internal/CLAUDE.md`, `web/CLAUDE.md`, `packages/site/CLAUDE.md`, and task-phase lessons.
- Spawned read-only explorers:
  - Faraday: `internal/tools`, API/CLI/UDS, config, hooks, task/network/skills integrations.
  - Kierkegaard: extension runtime, manifest/resources, subprocess protocol, TypeScript SDK, create-extension templates, Go SDK.
  - Euler: MCP config/auth/call-through, hosted MCP, ACP mcpServers, approval bridge, redaction, E2E/acpmock.
- Attempted a fourth web/docs explorer but hit the agent thread limit; parent will cover web/docs impact locally.
- Received all three read-only explorer results and consolidated them into a dependency-ordered task breakdown.
- User approved the decomposition.
- Wrote `_tasks.md` and `task_01.md` through `task_16.md`.
- Normalized generated task artifacts to ASCII.
- Validated task metadata with `compozy validate-tasks --name tools-registry`: `all tasks valid (16 scanned)`.
- Ran structural checks: 16 rows, 16 task files, all expected template sections present, no non-ASCII characters, `git diff --check` passed.
- Ran `make verify` successfully after final edits: Bun lint/typecheck/test/build, Go lint/test/build, and boundaries passed; final output reported 6470 Go tests and `OK: all package boundaries respected`.

Now:

- Ready for user review or execution of the generated task set.

Next:

- Optional: execute `task_01.md` via the normal task execution workflow.

Open questions (UNCONFIRMED if needed):

- None for breakdown; feature assumed to be `tools-registry`.

Working set (files/ids/commands):

- `.compozy/tasks/tools-registry/_techspec.md`
- `.compozy/tasks/tools-registry/_tasks.md`
- `.compozy/tasks/tools-registry/task_01.md`
- `.compozy/tasks/tools-registry/task_02.md`
- `.compozy/tasks/tools-registry/task_03.md`
- `.compozy/tasks/tools-registry/task_04.md`
- `.compozy/tasks/tools-registry/task_05.md`
- `.compozy/tasks/tools-registry/task_06.md`
- `.compozy/tasks/tools-registry/task_07.md`
- `.compozy/tasks/tools-registry/task_08.md`
- `.compozy/tasks/tools-registry/task_09.md`
- `.compozy/tasks/tools-registry/task_10.md`
- `.compozy/tasks/tools-registry/task_11.md`
- `.compozy/tasks/tools-registry/task_12.md`
- `.compozy/tasks/tools-registry/task_13.md`
- `.compozy/tasks/tools-registry/task_14.md`
- `.compozy/tasks/tools-registry/task_15.md`
- `.compozy/tasks/tools-registry/task_16.md`
- `.compozy/tasks/tools-registry/adrs/adr-001-extension-tool-execution-boundary.md`
- `.compozy/tasks/tools-registry/adrs/adr-002-session-tool-exposure-path.md`
- `.compozy/tasks/tools-registry/adrs/adr-003-runtime-registry-package-boundary.md`
- `.compozy/tasks/tools-registry/adrs/adr-004-mvp-native-tool-scope.md`
- `.compozy/tasks/tools-registry/adrs/adr-005-acp-approval-policy-integration.md`
- `.compozy/tasks/tools-registry/adrs/adr-006-tool-visibility-by-surface.md`
- `.compozy/tasks/tools-registry/adrs/adr-007-canonical-tool-id-format.md`
- `.compozy/tasks/tools-registry/analysis/synthesis.md`
- `internal/tools/tool.go`
- `internal/tools/resource.go`
- `internal/daemon/tool_mcp_resources.go`
- `internal/extension/resource_publication.go`
- `internal/config/mcp_resource.go`
- `internal/api/core/skills.go`
- `internal/api/contract/settings.go`
- `internal/cli/skill_commands.go`
- `internal/cli/task.go`
- `internal/cli/network.go`
- `internal/cli/mcp_auth.go`
- `internal/acp/permission.go`
- `internal/store/session_lineage.go`
