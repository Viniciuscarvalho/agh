# Analysis: claude-code

## Scope

- Path explored: `.resources/claude-code/`
- Topic: Applying an "agent soul" idea to AGH's harness: persistent agent self/identity/context, liveness/heartbeat, coordination across agents/networks/tasks/orchestration, and memory/context continuity.
- Files read in full vs. sampled: targeted read-only exploration of agent definitions, agent memory, memory taxonomy, session memory, AutoDream consolidation, team memory sync, agent run/resume, session storage/transcripts, task progress, bridge heartbeat/liveness, hooks, skills/plugins, coordinator mode, and in-process teammate tasks.
- Total available files: not counted by the subagent; repository was sampled by targeted source search.

The analysis uses AGH constraints as comparison criteria: `task_runs` remains the single durable work queue, `ClaimNextRun` owns claims, scheduler wake/sweep must not claim, hooks are typed call-site dispatch rather than an event bus, heartbeat/progress must avoid ACP backpressure, and CLI/HTTP/UDS agent-manageable surfaces are required.

## Overview

Claude Code's "agent soul" equivalent is not a single subsystem. It is a layered identity and continuity model composed from agent definitions, scoped persistent memory, session memory, sidechain transcripts, task progress state, hook call-sites, remote bridge heartbeats, and coordinator/team task identity.

The most transferable architectural idea is separation of concerns: durable work/task identity, model-context memory, progress/liveness, and hook dispatch are separate planes. Agent definitions act as identity capsules with tools, skills, hooks, model, effort, permissions, memory scopes, background behavior, and isolation. Runtime continuity then comes from transcripts plus sidecar metadata, while liveness/progress is tracked out-of-band from the model transcript.

Claude Code also has a mature memory stack: typed long-term memory, session-local markdown memory, agent-specific memory scopes, team memory sync, and AutoDream consolidation. These are aggressively scoped and guarded against stale or irrelevant context.

## Mechanisms / Patterns

- **Agent definition as identity capsule:** Agent JSON/markdown definitions include `agentType`, prompt, tools, disallowed tools, skills, MCP servers, hooks, color, model, effort, permission mode, max turns, background mode, initial prompt, memory scopes, and isolation. This makes who the agent is explicit and loadable before execution.
- **Scoped persistent agent memory:** Agent memory supports `user`, `project`, and `local` scopes with deterministic paths and prompt injection. The system appends a "Persistent Agent Memory" section explaining scope and asking the agent to read/write memory intentionally.
- **Memory taxonomy with exclusions:** Long-term memory is typed as user, feedback, project, or reference memory, and explicitly excludes code architecture notes, git history, one-off fixes, current task details, and CLAUDE.md-style project documentation. This prevents "agent soul" from becoming a junk drawer.
- **Session memory as current-state continuity:** Session memory maintains a markdown file about the current conversation using a background forked subagent, without interrupting the main flow. Its template captures current state, spec, files/functions, workflow, errors, docs, learnings, key results, and worklog.
- **AutoDream consolidation:** AutoDream runs as background memory consolidation after stop hooks when time/session gates and a lock allow it. It uses a forked agent with memory tools, skips transcript pollution, watches progress, and can roll back lock metadata on failure.
- **Relevant-memory selection before prompt loading:** Claude Code scans memory headers and asks a side query to select up to five relevant memories, avoiding indiscriminate context loading.
- **Sidechain transcripts for agent continuity:** Subagent messages are written to separate transcript files, stamped with agent/session metadata, and recoverable for background continuation.
- **Progress is ephemeral and not chained into model context:** Transcript logic excludes progress from the message chain and treats bash, powershell, MCP, and sleep progress as ephemeral UI state. Local agent tasks keep capped recent activity and token/tool counts separately.
- **Heartbeat separate from work polling:** The remote bridge has explicit heartbeat intervals, poll intervals, reclaim thresholds, and keepalive settings. At capacity, it can heartbeat active work without polling for new work, preventing tight loops and lease loss.
- **Typed call-site hooks:** Hooks are configured by event type and matcher, then executed at concrete call sites such as PreToolUse, PostToolUse, TaskCreated, TaskCompleted, SubagentStart, and Stop. This matches AGH's typed call-site model better than a generic event bus.
- **Async hook wakeups are explicit:** Hook schemas include async hooks and `asyncRewake`, where a background hook can wake the model on a specific exit code. This is useful but risky in AGH because it can become hidden work scheduling.
- **Coordinator and teammates preserve worker identity:** Coordinator mode exposes worker tools, scratchpad context, and guidance to continue existing workers when their context matters. In-process teammates carry explicit identity fields: agent id, agent name, team name, color, plan-mode requirement, and parent session id.
- **Team memory sync is shared but guarded:** Team memory sync is repo-scoped, server-backed, delta/upsert-oriented, and intentionally does not propagate deletions. It scans team memory writes for secrets before sync.
- **Skills/plugins contribute lifecycle and hooks:** Skills can define hooks in frontmatter and are loaded with canonical realpath identity to deduplicate overlapping directories. Skill hooks are registered session-scoped and can be one-shot.

## Relevant Code Paths

- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:73-133` - agent definition identity fields and runtime options.
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:193-221` - agent definition loading details.
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:445-510` - agent isolation, memory, tools, skills, MCP, and hook handling.
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:541-605` - markdown/frontmatter agent definition drift risk.
- `.resources/claude-code/components/agents/agentFileUtils.ts:20-54` - agent file parsing/writing utilities.
- `.resources/claude-code/tools/AgentTool/agentMemory.ts:12-177` - persistent agent memory prompt section and scopes.
- `.resources/claude-code/tools/AgentTool/agentMemorySnapshot.ts:27-197` - agent memory snapshotting.
- `.resources/claude-code/memdir/memoryTypes.ts:1-31` - memory taxonomy.
- `.resources/claude-code/memdir/memoryTypes.ts:183-256` - memory exclusions and intended usage.
- `.resources/claude-code/memdir/memdir.ts:187-260` - memory directory loading.
- `.resources/claude-code/memdir/memdir.ts:318-407` - memory write/search behavior.
- `.resources/claude-code/memdir/findRelevantMemories.ts:18-75` - relevant memory selection.
- `.resources/claude-code/services/SessionMemory/sessionMemory.ts:1-5` - session memory service role.
- `.resources/claude-code/services/SessionMemory/sessionMemory.ts:134-233` - background session memory updates.
- `.resources/claude-code/services/SessionMemory/prompts.ts:11-80` - session memory template and prompts.
- `.resources/claude-code/services/autoDream/autoDream.ts:1-12` - AutoDream service overview.
- `.resources/claude-code/services/autoDream/autoDream.ts:118-271` - consolidation gates, forked agent, progress, and rollback handling.
- `.resources/claude-code/services/autoDream/consolidationPrompt.ts:15-64` - consolidation prompt.
- `.resources/claude-code/services/autoDream/consolidationLock.ts:25-107` - consolidation lock.
- `.resources/claude-code/services/teamMemorySync/index.ts:1-25` - team memory sync model and conflict behavior.
- `.resources/claude-code/services/teamMemorySync/index.ts:770-930` - sync deltas/upserts and delete behavior.
- `.resources/claude-code/services/teamMemorySync/watcher.ts:231-351` - file watcher sync.
- `.resources/claude-code/services/teamMemorySync/teamMemSecretGuard.ts:3-44` - secret guard.
- `.resources/claude-code/tools/AgentTool/runAgent.ts:248-329` - agent run setup.
- `.resources/claude-code/tools/AgentTool/runAgent.ts:520-743` - agent run execution and continuity.
- `.resources/claude-code/tools/AgentTool/resumeAgent.ts:42-205` - agent resume and continuation.
- `.resources/claude-code/utils/sessionStorage.ts:128-196` - ephemeral progress excluded from chained messages.
- `.resources/claude-code/utils/sessionStorage.ts:227-303` - session storage metadata.
- `.resources/claude-code/utils/sessionStorage.ts:1025-1069` - sidechain transcript writes.
- `.resources/claude-code/utils/sessionStorage.ts:1200-1261` - transcript/session metadata.
- `.resources/claude-code/utils/sessionStorage.ts:4190-4235` - background continuation metadata.
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx:23-104` - local task progress/activity state.
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx:116-262` - task progress/notifications.
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx:334-407` - task completion/progress behavior.
- `.resources/claude-code/bridge/pollConfig.ts:9-110` - heartbeat/poll/reclaim configuration.
- `.resources/claude-code/bridge/bridgeMain.ts:196-270` - remote bridge session/reclaim behavior.
- `.resources/claude-code/bridge/bridgeMain.ts:635-760` - heartbeat active work without polling for new work.
- `.resources/claude-code/bridge/sessionRunner.ts:346-430` - session runner progress/liveness behavior.
- `.resources/claude-code/schemas/hooks.ts:16-213` - hook schema and async rewake.
- `.resources/claude-code/types/hooks.ts:49-275` - hook type definitions.
- `.resources/claude-code/utils/hooks.ts:184-265` - async hook behavior.
- `.resources/claude-code/utils/hooks.ts:1952-2116` - hook execution internals.
- `.resources/claude-code/utils/hooks.ts:3418-3477` - task/subagent hook call sites.
- `.resources/claude-code/utils/hooks.ts:3732-3817` - tool hook call sites.
- `.resources/claude-code/utils/hooks.ts:3924-3952` - additional lifecycle hook call sites.
- `.resources/claude-code/query/stopHooks.ts:133-260` - stop hook and AutoDream integration.
- `.resources/claude-code/utils/hooks/hookEvents.ts:1-20` - hook event stream as observability risk.
- `.resources/claude-code/utils/hooks/hookEvents.ts:124-186` - hook events.
- `.resources/claude-code/skills/loadSkillsDir.ts:67-153` - skill loading.
- `.resources/claude-code/skills/loadSkillsDir.ts:180-207` - skill realpath identity/deduplication.
- `.resources/claude-code/skills/loadSkillsDir.ts:300-440` - skill metadata and lifecycle.
- `.resources/claude-code/utils/hooks/registerSkillHooks.ts:7-64` - skill hook registration.
- `.resources/claude-code/services/plugins/PluginInstallationManager.ts:1-120` - plugin lifecycle.
- `.resources/claude-code/coordinator/coordinatorMode.ts:80-237` - coordinator/worker identity and continuation guidance.
- `.resources/claude-code/tasks/InProcessTeammateTask/types.ts:8-101` - teammate identity fields.
- `.resources/claude-code/tasks/InProcessTeammateTask/InProcessTeammateTask.tsx:1-125` - in-process teammate behavior.

## Transferable Patterns

- Treat "agent soul" as a runtime identity and continuity envelope, not as a replacement queue. The durable work queue remains `task_runs`; the soul layer should attach identity, memory, liveness, and context continuity to agents/runs without allowing any component except `ClaimNextRun` to claim work.
- Use durable agent identity records keyed by agent/session/run, separate memory indexes/artifacts, separate progress/heartbeat rows or streams, and transcript/output artifacts with bounded summaries.
- Adopt the memory taxonomy. AGH should explicitly distinguish long-term identity memory, current-run session memory, team/shared memory, and reference memory, with hard exclusions for stale implementation notes and transient task details.
- If consolidation is real work, enqueue a `task_runs` maintenance run and claim it only through `ClaimNextRun`. If it is local post-run bookkeeping, it must not claim or start unrelated work.
- Keep heartbeat/progress completely out-of-band from ACP JSON-RPC request/response flow. Use bounded, nonblocking heartbeat/progress writes that cannot apply backpressure to ACP stdio.
- Keep hooks typed and call-site based. The transferable part is concrete dispatch at lifecycle/tool/task/subagent boundaries, not a generic event stream.
- Expose soul directly through agent-manageable surfaces: CLI/HTTP/UDS operations to inspect agent identity, memory scopes, heartbeat status, current run, task output, transcript, continuation handles, and coordination/team membership.
- For cross-agent coordination, continue an existing worker when its context matters, do not use one worker to inspect another's private context, and keep worker results as separate messages/signals mapped to durable coordination records.

## Risks / Mismatches

- Claude Code relies heavily on filesystem state, in-process AppState, sidechain JSONL transcripts, and watchers. AGH should translate these patterns into database-backed state and artifact surfaces rather than copying them directly.
- AutoDream can fork a background agent from stop-hook processing. In AGH this is risky if it bypasses `task_runs` and `ClaimNextRun`. Consolidation must either be post-run local bookkeeping or queue-owned work.
- `TaskOutputTool` can poll task state every 100ms while waiting for completion. AGH should avoid any equivalent that blocks ACP flow or adds model-stream backpressure. Output and progress should be read via separate API/UDS/SSE surfaces.
- Claude Code has both typed hooks and a hook event stream. For AGH, typed call-site dispatch transfers; event-stream behavior should remain observability-only.
- Team memory's local-wins conflict behavior and non-propagated deletes may be too weak for AGH Network coordination. AGH may need versioned records, explicit conflict states, or agent-resolvable merge tasks.
- Prompt-injected memory can hide runtime truth. AGH's "agent soul" should be inspectable and manageable by agents through CLI/HTTP/UDS, not only through prompt context.
- Agent definitions in markdown/frontmatter can drift from runtime state. AGH should avoid dual truth between config files, DB records, and network peer state.
- Heartbeat semantics must not mask dead subprocesses. AGH should tie heartbeat validity to actual ACP subprocess/session health and claim ownership.

## Open Questions

- The exact AGH schema and existing CLI/HTTP/UDS surfaces need local validation against current `task_runs`, `ClaimNextRun`, scheduler, hook, ACP, and API implementations.
- The best AGH storage boundary for "agent soul" remains open: separate agent identity tables, run metadata, memory artifact tables, or a combination. None may become a second durable work queue.
- Claude Code's hook matching and plugin precedence are broad; a deeper plugin lifecycle interpretation may be needed if AGH plans a near-equivalent plugin runtime.
- Shared/team memory conflict semantics need a product decision for AGH Network: last-writer-wins, explicit conflicts, append-only facts, CRDT-style merge, or agent-mediated reconciliation.
- `~/dev/knowledge/claude-code/` appears present, but this analysis cites only `.resources/claude-code/...` evidence as required.

## Evidence

- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:73-133`
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:193-221`
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:445-510`
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts:541-605`
- `.resources/claude-code/tools/AgentTool/agentMemory.ts:12-177`
- `.resources/claude-code/tools/AgentTool/agentMemorySnapshot.ts:27-197`
- `.resources/claude-code/components/agents/agentFileUtils.ts:20-54`
- `.resources/claude-code/memdir/memoryTypes.ts:1-31`
- `.resources/claude-code/memdir/memoryTypes.ts:183-256`
- `.resources/claude-code/memdir/memdir.ts:187-260`
- `.resources/claude-code/memdir/memdir.ts:318-407`
- `.resources/claude-code/memdir/findRelevantMemories.ts:18-75`
- `.resources/claude-code/services/SessionMemory/sessionMemory.ts:1-5`
- `.resources/claude-code/services/SessionMemory/sessionMemory.ts:134-233`
- `.resources/claude-code/services/SessionMemory/prompts.ts:11-80`
- `.resources/claude-code/services/autoDream/autoDream.ts:1-12`
- `.resources/claude-code/services/autoDream/autoDream.ts:118-271`
- `.resources/claude-code/services/autoDream/consolidationPrompt.ts:15-64`
- `.resources/claude-code/services/autoDream/consolidationLock.ts:25-107`
- `.resources/claude-code/services/teamMemorySync/index.ts:1-25`
- `.resources/claude-code/services/teamMemorySync/index.ts:770-930`
- `.resources/claude-code/services/teamMemorySync/watcher.ts:231-351`
- `.resources/claude-code/services/teamMemorySync/teamMemSecretGuard.ts:3-44`
- `.resources/claude-code/tools/AgentTool/prompt.ts:80-113`
- `.resources/claude-code/tools/AgentTool/prompt.ts:255-275`
- `.resources/claude-code/tools/AgentTool/runAgent.ts:248-329`
- `.resources/claude-code/tools/AgentTool/runAgent.ts:520-743`
- `.resources/claude-code/tools/AgentTool/AgentTool.tsx:766-991`
- `.resources/claude-code/tools/AgentTool/AgentTool.tsx:1067-1123`
- `.resources/claude-code/tools/AgentTool/resumeAgent.ts:42-205`
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx:23-104`
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx:116-262`
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx:334-407`
- `.resources/claude-code/tasks/LocalMainSessionTask.ts:360-469`
- `.resources/claude-code/utils/sessionStorage.ts:128-196`
- `.resources/claude-code/utils/sessionStorage.ts:227-303`
- `.resources/claude-code/utils/sessionStorage.ts:1025-1069`
- `.resources/claude-code/utils/sessionStorage.ts:1200-1261`
- `.resources/claude-code/utils/sessionStorage.ts:1451-1462`
- `.resources/claude-code/utils/sessionStorage.ts:4190-4235`
- `.resources/claude-code/utils/sessionRestore.ts:95-242`
- `.resources/claude-code/tools/TaskOutputTool/TaskOutputTool.tsx:117-181`
- `.resources/claude-code/bridge/pollConfig.ts:9-110`
- `.resources/claude-code/bridge/bridgeMain.ts:196-270`
- `.resources/claude-code/bridge/bridgeMain.ts:635-760`
- `.resources/claude-code/bridge/bridgeMain.ts:1452-1535`
- `.resources/claude-code/bridge/sessionRunner.ts:69-200`
- `.resources/claude-code/bridge/sessionRunner.ts:346-430`
- `.resources/claude-code/bridge/types.ts:18-170`
- `.resources/claude-code/remote/SessionsWebSocket.ts:97-170`
- `.resources/claude-code/remote/SessionsWebSocket.ts:249-318`
- `.resources/claude-code/hooks/useRemoteSession.ts:168-236`
- `.resources/claude-code/schemas/hooks.ts:16-213`
- `.resources/claude-code/types/hooks.ts:49-275`
- `.resources/claude-code/utils/hooks.ts:184-265`
- `.resources/claude-code/utils/hooks.ts:1952-2116`
- `.resources/claude-code/utils/hooks.ts:3418-3477`
- `.resources/claude-code/utils/hooks.ts:3732-3817`
- `.resources/claude-code/utils/hooks.ts:3924-3952`
- `.resources/claude-code/query/stopHooks.ts:133-260`
- `.resources/claude-code/utils/hooks/AsyncHookRegistry.ts:30-260`
- `.resources/claude-code/utils/hooks/hookEvents.ts:1-20`
- `.resources/claude-code/utils/hooks/hookEvents.ts:124-186`
- `.resources/claude-code/skills/loadSkillsDir.ts:67-153`
- `.resources/claude-code/skills/loadSkillsDir.ts:180-207`
- `.resources/claude-code/skills/loadSkillsDir.ts:300-440`
- `.resources/claude-code/utils/hooks/registerSkillHooks.ts:7-64`
- `.resources/claude-code/services/plugins/PluginInstallationManager.ts:1-120`
- `.resources/claude-code/services/plugins/PluginInstallationManager.ts:135-180`
- `.resources/claude-code/coordinator/coordinatorMode.ts:80-237`
- `.resources/claude-code/tasks/InProcessTeammateTask/types.ts:8-101`
- `.resources/claude-code/tasks/InProcessTeammateTask/InProcessTeammateTask.tsx:1-125`
