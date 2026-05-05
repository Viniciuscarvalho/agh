Goal (incl. success criteria):

- Analyze GoClaw's task, subtask, delegation, issue-like, team coordination, persistence, and control-surface model for use in AGH core tasks/subtasks.
- Success means the analysis file is written with concise, evidence-backed sections and concrete source paths from both the local vault and `.resources/goclaw`.

Constraints/Assumptions:

- Use local sources only; no web.
- Do not touch unrelated worktree edits.
- User requested the deliverable file at `.compozy/tasks/core-tasks/analysis/analysis_goclaw.md`.
- The writeup should distinguish transferable patterns from over-complex GoClaw specifics.

Key decisions:

- Treat GoClaw's team task board as the issue-like model; there is no separate first-class issue entity in the evidence collected.
- Focus the analysis on one lifecycle graph plus delegation/claim/dispatch/persistence/control surfaces.

State:

- Done.

Done:

- Read topic vault instructions and collected evidence from `qmd` docs plus `.resources/goclaw` code paths.
- Confirmed task model includes UUIDs, sequential task numbers, human-readable identifiers, team/chat scoping, owner assignment, comments, events, attachments, and lock metadata.
- Confirmed delegation splits across subagents, agent links, and team tasks, with managed-mode gating.
- Confirmed control surfaces include WS RPC, limited HTTP support, CLI setup/channels, and MCP bridge exposure.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- Whether AGH should keep any separate subagent/delegation primitive or collapse them into a single task/subtask model.
- How much of GoClaw's lead/member/task-board UX should be mirrored versus simplified for AGH core tasks.

Working set (files/ids/commands):

- `/Users/pedronauck/dev/knowledge/goclaw/wiki/concepts/agent-teams-and-delegation.md`
- `/Users/pedronauck/dev/knowledge/goclaw/wiki/concepts/channel-adapter-system.md`
- `/Users/pedronauck/dev/knowledge/goclaw/wiki/concepts/gateway-and-rpc-protocol.md`
- `/Users/pedronauck/dev/knowledge/goclaw/wiki/concepts/http-api-surface.md`
- `/Users/pedronauck/dev/knowledge/goclaw/wiki/concepts/security-rbac-and-crypto.md`
- `/Users/pedronauck/dev/knowledge/goclaw/wiki/concepts/web-and-desktop-ui-layer.md`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/store/team_store.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/store/pg/teams_tasks.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/store/pg/teams_tasks_lifecycle.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/store/pg/teams_tasks_activity.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/tools/team_tasks_tool.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/tools/team_tasks_lifecycle.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/tools/team_tasks_read.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/tools/team_tool_validation.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/tools/team_tool_manager.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/gateway/methods/teams_tasks.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/gateway/methods/teams_tasks_mutations.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/gateway/methods/teams_crud.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/http/team_events.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/http/agents_export_team.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/http/agents_import_team.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/gateway.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/gateway_managed.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/gateway_events.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/gateway_consumer_handlers.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/gateway_consumer_post_turn.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/gateway_lifecycle.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/channels_cmd.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/cmd/setup_cmd.go`
- `/Users/pedronauck/dev/knowledge/.resources/goclaw/internal/mcp/bridge_server.go`
