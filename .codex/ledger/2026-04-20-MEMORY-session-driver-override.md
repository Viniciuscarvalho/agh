Goal (incl. success criteria):

- Decompose the approved TechSpec for AGH sessions supporting a per-session ACP provider override into independently implementable task files under `.compozy/tasks/session-driver-override/`.
- Success means the task breakdown covers backend, transport, persistence, and `web/` work with explicit dependencies, approved by the user, then saved as `_tasks.md` plus enriched `task_NN.md` files that pass `compozy validate-tasks`.

Constraints/Assumptions:

- User explicitly requested `cy-create-tasks`; do not implement production code in this turn.
- Do not write `_tasks.md` or `task_NN.md` until the proposed breakdown is presented and approved.
- Delegated sub-agents are not allowed unless explicitly requested by the user, so codebase exploration is local.
- No `_prd.md` for this feature has been found yet; current input is the user's problem statement and codebase exploration.
- Existing AGH architecture matters: `internal/session.Manager` currently owns one injected `AgentDriver`, session create API only carries `agent_name`, and config/provider resolution happens through `internal/config`.
- `.compozy/config.toml` is absent in this workspace, so task `type` values must use the built-in defaults: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.

Key decisions:

- Use task slug `session-driver-override` unless the user gives a different feature name.
- Frame the problem as a session-level override layered on top of existing agent/provider resolution, not as a replacement for agent defaults.
- User approved provider/runtime-level override semantics: the session may choose a different provider/runtime, while the selected `agent_name` remains the source of prompt, tools, permissions, and other agent-local defaults.
- User approved durable resume semantics: the chosen provider/runtime override should be persisted in session state and reused on resume, even if the agent default changes later.
- User approved explicit web create-session UX: the SPA should open a session-creation dialog for new sessions instead of relying on the current quick-create-only path.
- User approved strict error policy: if a requested or persisted provider/runtime override is unavailable, `create` or `resume` should fail explicitly with no silent fallback to the agent default.
- Treat resume semantics, persisted metadata, API contract changes, CLI parity, and web create-session UX as first-class design concerns.

State:

- Completed. Task decomposition was written to disk in the approved format and validated successfully with `compozy validate-tasks --name session-driver-override`.

Done:

- Read repository instructions and relevant skill guidance.
- Scanned existing ledgers for session/ACP/provider history.
- Verified the core backend flow:
- `session.CreateOpts` currently carries `AgentName`, `Name`, `Workspace`, `WorkspacePath`, `Channel`, and `Type`.
- `prepareCreateStart()` resolves only `agent_name`, then `prepareSessionStartRuntime()` resolves the agent definition via workspace config.
- `Manager` owns a single injected runtime `driver AgentDriver`, defaulting to `NewACPDriverAdapter(acp.New())`.
- Session metadata and payloads persist/report `agent_name` and `acp_session_id`, but not any session-specific driver/provider override.
- Verified the current transport/UI flow:
- `contract.CreateSessionRequest` currently accepts `agent_name`, `name`, `workspace`, `workspace_path`, and `channel`.
- HTTP/UDS handlers pass only those fields into `session.CreateOpts`.
- CLI `agh session new` exposes `--agent`, `--workspace`, `--cwd`, `--name`, and `--channel`, but no driver/provider override.
- Web quick-create currently starts a session directly from the sidebar with only `agent_name` plus active workspace id.
- Verified config architecture:
- `internal/config.AgentDef` carries `provider`, `command`, `model`, and other agent-level fields.
- `Config.ResolveAgent()` merges agent defaults with provider config and global defaults to produce `ResolvedAgent`.
- Built-in provider registry already includes `claude`, `codex`, `gemini`, `opencode`, `copilot`, `cursor`, `kiro`, and `pi`.
- Asked the first technical clarification question about the override boundary.
- User selected option `A`: provider/runtime-level override only, not full agent replacement and not a new separate driver catalog.
- Asked the second technical clarification question about resume persistence.
- User selected option `A`: persist the chosen provider/runtime in session metadata and always resume with that same provider/runtime.
- Asked the third technical clarification question about web create-session UX.
- User selected option `B`: always open an explicit create-session dialog in the web app.
- Asked the fourth technical clarification question about unavailable override handling.
- User selected option `A`: fail explicitly on `create` or `resume` when the requested/persisted provider/runtime override is unavailable.
- Asked the fifth technical clarification question about provider-owned runtime fields.
- User selected option `A`: provider override re-resolves `provider + command + default_model`, while the agent continues to own prompt/tools/permissions and other behavior-local fields.
- Created ADR-001 through ADR-004 under `.compozy/tasks/session-driver-override/adrs/`.
- Ran `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json` against the draft and captured blocking findings around schema migration, legacy-provider repair, non-API `CreateOpts` callers, workspace-scoped provider discovery, and codegen verification.
- Added ADR-005 to document in-place global DB migration plus one-time legacy metadata repair for sessions missing provider state.
- Verified the concrete persistence and transport touchpoints that the TechSpec must cover:
- `store.SessionMeta`, `store.SessionInfo`, and `session.Info` are the canonical session persistence/read-model types that currently lack a provider field.
- `core.SessionPayloadFromInfo()` is the shared conversion path from `session.Info` into `contract.SessionPayload`.
- Saved the final TechSpec to `.compozy/tasks/session-driver-override/_techspec.md`.
- Loaded the `cy-create-tasks` templates and schema references.
- Confirmed `.compozy/config.toml` is missing, so built-in task types apply.
- Mapped the main implementation seams for decomposition:
- `internal/config` for provider-aware runtime resolution.
- `internal/session` and `internal/store` for session runtime fields and metadata persistence.
- `internal/store/globaldb` plus session repair paths for global DB migration and legacy metadata repair.
- `internal/api`, `internal/cli`, and `internal/extension/host_api.go` for explicit provider create/read surfaces and codegen.
- `internal/api/core/workspaces.go` plus automatic internal creators for workspace provider catalog and default-provider contract.
- `web/` current quick-create flow and session resume UX for the dialog + failure state task.
- Inspected `.compozy/tasks/agent-capabilities/` to mirror `_tasks.md` and `task_06.md` / `task_07.md` structure for the QA tasks.
- Wrote `.compozy/tasks/session-driver-override/_tasks.md` plus `task_01.md` through `task_08.md` in the approved breakdown.
- Added the final two tasks explicitly for `/qa-report` and `/qa-execution`, both using `qa-output-path=.compozy/tasks/session-driver-override`, with end-to-end browser coverage required in task_08.
- Ran `compozy validate-tasks --name session-driver-override` and got `all tasks valid (8 scanned)`.

Now:

- No active work in this session.

Next:

- Natural next step is execution planning or direct implementation against `task_01.md` onward.

Open questions (UNCONFIRMED if needed):

- None at the draft-revision level.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-session-driver-override.md`
- `internal/session/{manager.go,manager_lifecycle.go,manager_start.go,interfaces.go,session.go}`
- `internal/config/{agent.go,provider.go,config.go}`
- `internal/api/{contract/contract.go,core/handlers.go,core/session_workspace.go}`
- `internal/cli/session.go`
- `web/src/{hooks/routes/use-app-layout.ts,components/app-sidebar.tsx}`
- `web/src/systems/session/{types.ts,adapters/session-api.ts,hooks/use-session-actions.ts}`
- `web/src/hooks/routes/use-session-page.ts`
- `web/src/systems/network/components/network-create-channel-dialog.tsx`
- `web/src/systems/workspace/{types.ts,adapters/workspace-api.ts,hooks/use-workspaces.ts}`
- `internal/store/globaldb/{global_db.go,migrate_workspace.go,global_db_session.go}`
- `internal/automation/dispatch.go`
- `internal/extension/{host_api.go,host_api_bridges.go}`
- `internal/daemon/task_runtime.go`
- `internal/memory/consolidation/runtime.go`
- `internal/api/core/network_details.go`
- `openapi/agh.json`
- `web/src/generated/agh-openapi.d.ts`
- `.agents/skills/cy-create-tasks/references/{task-template.md,task-context-schema.md}`
- Commands: `rg -n "driver|provider|CreateSession|AgentName|ResolveAgent|WithDriver" internal web .codex/ledger`, `sed -n ...`
