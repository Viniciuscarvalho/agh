# Analysis: goclaw

## Scope

- Path explored: `.resources/goclaw/`
- Topic: Applying an "agent soul" idea to AGH's harness: persistent agent self/identity/context, liveness/heartbeat, coordination across agents/networks/tasks/orchestration, and memory/context continuity.
- Files read in full vs. sampled: targeted read-only exploration of agent identity conventions, DB-backed context files, self-evolution docs, heartbeat subsystem, heartbeat tools/config storage, team task orchestration, memory/knowledge vault, typed hooks, tool capabilities, scheduler/cron code, router busy checks, and message bus.
- Total available files: not counted by the subagent; repository was sampled by targeted source search.

AGH constraints cross-referenced: `task_runs` is the single durable work queue; `ClaimNextRun` owns claims; scheduler may wake/sweep but must not claim; hooks are typed call-site dispatch, not a general event bus; heartbeat/progress must avoid ACP backpressure; and agent-manageable CLI/HTTP/UDS surfaces are required.

## Overview

GoClaw implements an "agent soul" mostly as a durable composition of:

- Agent identity rows with a stable distinction between UUID and human/router-facing `agent_key`.
- DB-backed context files such as `SOUL.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, `CAPABILITIES.md`, and memory files.
- Prompt assembly that injects identity, persona, runtime, team, memory, and availability sections into each agent loop.
- A heartbeat subsystem that lets an agent periodically run a checklist, log status, suppress "OK" output, and publish only relevant user-facing results.
- Team/task orchestration with atomic task claiming, locks, progress heartbeats, stale recovery, dependency unblocking, and metadata propagation.
- Typed lifecycle hooks fired from concrete pipeline call-sites.
- Episodic memory and vault-backed retrieval to rehydrate context across sessions.

The useful AGH transfer is architectural, not literal. GoClaw's strongest patterns are durable identity/context files, out-of-band heartbeat logs, lease renewal, typed lifecycle hook dispatch, and compact memory injection. Its biggest mismatch is queue topology: GoClaw has separate team tasks, cron claims, heartbeat tables, a message bus, and scheduler/consumer patterns. AGH should not copy those as separate durable work queues because `task_runs` must remain the only durable work queue and `ClaimNextRun` must remain the only claim path.

## Mechanisms / Patterns

- **Durable agent identity split:** GoClaw distinguishes database/public identity from prompt/path/router identity. UUID is used for DB, public APIs, and tracing, while `agent_key` is used for prompts, paths, UI slugs, and router/session keys. Docs call out trap zones where fields named `AgentID` may actually carry `agent_key` semantics, and note that the same `agent_key` can exist in multiple tenants.
- **DB-backed context files as the agent's soul surface:** GoClaw stores agent and user context files in database tables, then intercepts file reads/writes so agents experience them like local files. Important files include `SOUL.md`, `IDENTITY.md`, `AGENTS.md`, `USER.md`, `USER_PREDEFINED.md`, `BOOTSTRAP.md`, `HEARTBEAT.md`, and `CAPABILITIES.md`. The interceptor applies different routing rules for open vs predefined agents, per-user vs agent-level files, shared identity files, and self-evolution.
- **Constrained self-evolution:** Predefined agents can modify selected durable identity/capability files under configuration gates. The strongest pattern is the separation between immutable core identity and narrowly mutable learning/soul surfaces, with explicit security constraints.
- **Heartbeat as application-level liveness, not transport keepalive:** A ticker polls due agent heartbeats, supports non-blocking wake signals, checks active-hours windows, skips when the agent queue is busy, reads `HEARTBEAT.md`, runs the agent with light context and optional isolated session, logs the result, updates next-run state, and optionally publishes output. `HEARTBEAT_OK` suppresses routine responses.
- **Agent-manageable heartbeat configuration:** GoClaw exposes a `heartbeat` tool with actions such as configuration, inspection, logs, and wake-like behavior. It checks permissions before mutation, supports owner/system contexts, and stores `HEARTBEAT.md` through the same context-file machinery.
- **Store-first heartbeat state and logs:** GoClaw persists heartbeat configuration and run logs separately from transient execution. It stores interval, provider/model overrides, isolated-session/light-context flags, active hours, delivery targets, next/last run state, counters, and logs.
- **Team task orchestration with leases, renewal, progress, and recovery:** GoClaw's team tasks are a separate task board with lead/member roles, dependencies, blockers, atomic claiming, locks, `lock_expires_at`, progress updates that renew the lock, stale recovery, and automatic dependent-task unblocking. Dispatch preserves origin user/channel/session/task metadata.
- **Memory continuity through compaction, episodic summaries, and vault search:** The loop pipeline can auto-inject episodic memory into the system prompt. The episodic store keeps tenant/agent/user/session-scoped summaries, and a vault system adds document-level search and unified retrieval.
- **Typed hook dispatch from concrete call-sites:** GoClaw defines lifecycle events, handler types, scope rules, blocking vs non-blocking behavior, timeouts, audit rows, and fail-closed behavior. The pipeline fires hooks from concrete call sites such as session start, user prompt submit, pre-tool-use, post-tool-use, and finalization.
- **Capability metadata and agent-driven skill management:** GoClaw classifies tools with capability metadata such as read-only, mutating, async, or MCP-bridged. It also exposes `skill_manage` for agent-driven skill lifecycle under ownership and guard checks.

## Relevant Code Paths

- `.resources/goclaw/docs/agent-identity-conventions.md:1-48` - UUID vs `agent_key` convention.
- `.resources/goclaw/docs/agent-identity-conventions.md:49-83` - trap zones for identity naming.
- `.resources/goclaw/docs/agent-identity-conventions.md:173-180` - tenant-scoped key uniqueness.
- `.resources/goclaw/internal/store/agent_store.go:43-86` - durable agent fields including tenant, key, owner, provider/model, workspace, type, status, tool/sandbox/subagent/memory configuration, and evolution flags.
- `.resources/goclaw/internal/store/agent_store.go:626-690` - agent/user context file structures and store methods.
- `.resources/goclaw/migrations/000001_init_schema.up.sql:87-106` - agent and user context-file tables.
- `.resources/goclaw/internal/store/pg/agents_context.go:21-70` - context-file reads.
- `.resources/goclaw/internal/store/pg/agents_context.go:74-123` - context-file writes.
- `.resources/goclaw/internal/tools/context_file_interceptor.go:18-40` - protected and special context files, including `SOUL.md`, `IDENTITY.md`, `HEARTBEAT.md`, and `CAPABILITIES.md`.
- `.resources/goclaw/internal/tools/context_file_interceptor.go:107-169` - context-file read routing by agent type, user scope, and shared identity restrictions.
- `.resources/goclaw/internal/tools/context_file_interceptor.go:189-293` - context-file writes and self-evolution gates.
- `.resources/goclaw/internal/tools/context_file_interceptor.go:296-379` - prompt assembly context-file loading.
- `.resources/goclaw/internal/agent/systemprompt_sections.go:131-154` - stable and dynamic context files for prompt caching.
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:1-10` - self-evolution overview.
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:63-112` - self-evolution surfaces.
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:115-137` - security constraints.
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:168-197` - skill/capability evolution.
- `.resources/goclaw/docs/22-heartbeat-system.md:1-9` - heartbeat system overview.
- `.resources/goclaw/docs/22-heartbeat-system.md:13-56` - heartbeat configuration and behavior.
- `.resources/goclaw/docs/22-heartbeat-system.md:61-79` - active-hours and scheduling.
- `.resources/goclaw/docs/22-heartbeat-system.md:101-115` - light context and isolated sessions.
- `.resources/goclaw/docs/22-heartbeat-system.md:132-162` - response delivery.
- `.resources/goclaw/docs/22-heartbeat-system.md:181-210` - `HEARTBEAT_OK` suppression.
- `.resources/goclaw/docs/22-heartbeat-system.md:214-260` - heartbeat tool/manageability.
- `.resources/goclaw/internal/heartbeat/ticker.go:24-40` - ticker dependencies and intervals.
- `.resources/goclaw/internal/heartbeat/ticker.go:100-146` - non-blocking wake and due-heartbeat polling.
- `.resources/goclaw/internal/heartbeat/ticker.go:158-230` - resolve agent/tenant, active hours, busy queues, `HEARTBEAT.md`, and prompt.
- `.resources/goclaw/internal/heartbeat/ticker.go:270-331` - agent loop invocation with `Stream:false`, light context, isolated session support, retries, suppression, and publishing.
- `.resources/goclaw/internal/heartbeat/ticker.go:334-394` - logs, state, counters, cleanup, and event emission.
- `.resources/goclaw/internal/store/heartbeat_store.go:11-124` - heartbeat config, run log, stagger helper, and store interface.
- `.resources/goclaw/internal/store/pg/heartbeat.go:15-31` - due cache/store implementation.
- `.resources/goclaw/internal/store/pg/heartbeat.go:72-175` - heartbeat persistence.
- `.resources/goclaw/migrations/000022_agent_heartbeats.up.sql:1-68` - heartbeat config, logs, and permission tables.
- `.resources/goclaw/internal/tools/heartbeat.go:42-120` - agent-facing heartbeat actions and parameters.
- `.resources/goclaw/internal/tools/heartbeat.go:265-333` - mutation permissions and `HEARTBEAT.md` writes.
- `.resources/goclaw/docs/11-agent-teams.md:1-8` - team task overview.
- `.resources/goclaw/docs/11-agent-teams.md:75-118` - task roles and dependencies.
- `.resources/goclaw/docs/11-agent-teams.md:123-227` - task lifecycle and locks.
- `.resources/goclaw/docs/11-agent-teams.md:342-421` - coordination metadata and dispatch.
- `.resources/goclaw/docs/11-agent-teams.md:483-542` - progress and stale recovery.
- `.resources/goclaw/docs/11-agent-teams.md:546-660` - dependency unblocking.
- `.resources/goclaw/internal/store/pg/teams_tasks_lifecycle.go:14-92` - atomic task claim and lock.
- `.resources/goclaw/internal/store/pg/teams_tasks_progress.go:18-71` - progress update and lock renewal.
- `.resources/goclaw/internal/store/pg/teams_tasks_progress.go:82-217` - stale task recovery and orphan fixes.
- `.resources/goclaw/internal/tools/team_tool_dispatch.go:95-240` - member dispatch preserving origin metadata.
- `.resources/goclaw/internal/tools/team_tool_dispatch.go:340-423` - unblocked dependent dispatch with restored trace context.
- `.resources/goclaw/internal/tools/team_metadata_keys.go:5-63` - origin metadata keys.
- `.resources/goclaw/docs/01-agent-loop.md:485-553` - compaction and memory flush.
- `.resources/goclaw/internal/agent/loop_pipeline_adapter.go:84-96` - episodic memory auto-injection.
- `.resources/goclaw/internal/memory/auto_injector_impl.go:26-103` - memory search and prompt section.
- `.resources/goclaw/docs/24-knowledge-vault.md:1-20` - knowledge vault overview.
- `.resources/goclaw/docs/24-knowledge-vault.md:41-100` - vault search/retrieval.
- `.resources/goclaw/docs/24-knowledge-vault.md:187-218` - unified retrieval.
- `.resources/goclaw/migrations/000037_v3_memory_evolution.up.sql:4-32` - episodic memory schema.
- `.resources/goclaw/migrations/000038_vault_tables.up.sql:1-54` - vault tables.
- `.resources/goclaw/docs/agent-hooks.md:1-46` - typed hook system overview.
- `.resources/goclaw/docs/agent-hooks.md:104-131` - blocking vs async hooks and scope rules.
- `.resources/goclaw/docs/agent-hooks.md:144-162` - audit/failure behavior.
- `.resources/goclaw/internal/hooks/types.go:17-48` - typed lifecycle hook events.
- `.resources/goclaw/internal/hooks/dispatcher.go:153-260` - blocking hook chains with mutation/block semantics.
- `.resources/goclaw/internal/pipeline/context_stage.go:38-65` - session-start and user-prompt hooks from context stage.
- `.resources/goclaw/internal/pipeline/tool_stage.go:49-96` - pre-tool and post-tool hooks at tool execution call sites.
- `.resources/goclaw/internal/pipeline/finalize_stage.go:158-170` - finalization hooks.
- `.resources/goclaw/internal/tools/capability.go:5-56` - tool capability metadata.
- `.resources/goclaw/internal/tools/skill_manage.go:21-160` - agent-driven skill lifecycle.
- `.resources/goclaw/internal/store/pg/cron_scheduler.go:180-210` - scheduler-side claim mismatch.
- `.resources/goclaw/internal/store/pg/cron_scheduler.go:352-386` - scheduler-side claim mismatch.
- `.resources/goclaw/internal/store/pg/cron_exec.go:28-52` - cron execution mismatch.

## Transferable Patterns

- Model "agent soul" as durable identity plus context artifacts. AGH can adopt a persistent agent self made of immutable identity, mutable self-reflection/context, capabilities, user-scoped context, and memory summaries.
- Keep `task_runs` as the single durable work queue. Transfer heartbeat, team, and cron behavior into `task_runs` or side tables that do not become queues: heartbeat due detection may enqueue/wake a `task_runs` item, scheduler may scan/wake/sweep stale leases, scheduler must not claim, and `ClaimNextRun` remains the only durable claim operation.
- Use lease/renew/progress semantics on `task_runs`. GoClaw's task locks and progress heartbeats map cleanly to AGH if implemented on `task_runs` claim state rather than a separate table.
- Make heartbeat/progress store-first and ACP-independent. Active run liveness should write heartbeat/progress directly to storage/control-plane APIs, not through ACP stdio. Idle agent self-checks can enqueue normal `task_runs` items.
- Reuse typed hook dispatch, not a bus. Potential AGH call sites: before run enqueue, after run enqueue, before `ClaimNextRun` selection, after claim granted, before harness spawn, after ACP initialize, before prompt assembly, after soul injection, on heartbeat/progress update, before completion persistence, after completion/failure persistence, and on stale-claim sweep.
- Inject compact durable context into harness startup: immutable identity, current task context, parent/network context, relevant memory summaries, and agent-managed soul notes, with exact injected bundle or digest stored for replay/debugging.
- Preserve origin metadata across orchestration inside `task_runs`: parent/root run, originating user/session, originating agent, network id, orchestration role, dependency/blocker ids, trace id, reply/continuation target, and source surface.
- Expose agent-manageable surfaces for soul, heartbeat, progress, and memory: identity/soul get/list/set, context file get/list/set/delete, heartbeat config get/set/test/logs, run progress report, run lease renew, memory search/read/write/compact, orchestration child-run create/list/depend/block/unblock, and audit/event list for soul/context mutations.
- Split mutable soul from immutable identity. Immutable identity is daemon/runtime controlled; mutable soul is agent-editable only through audited public APIs; capability declarations are editable only through validated extension/config flows; task memory is run scoped and promoted only through explicit consolidation.

## Risks / Mismatches

- Separate queues would violate AGH's work-queue invariant. GoClaw's team tasks and heartbeat schedules are separate durable coordination structures; copying that shape into AGH conflicts with `task_runs`.
- Scheduler-side claiming is incompatible with AGH. GoClaw cron scheduler claims due jobs by mutating job state before execution. AGH's scheduler may wake or sweep, but `ClaimNextRun` must remain the owner of claims.
- Full agent-loop heartbeat can create ACP pressure in AGH. Active-run heartbeat should be daemon/control-plane state, not ACP stream traffic.
- In-memory busy checks are weaker than durable claims. AGH should not rely on in-memory session maps for durable liveness; it should use durable `task_runs` claim/lease state.
- String-convention heartbeat suppression is brittle. AGH should prefer structured status/progress results for daemon logic and only use textual conventions for agent-facing prompt guidance.
- Agent-editable soul can mutate identity unless permissions are narrow. Mutable `soul` content must not silently change security identity, provider configuration, network permissions, or extension capabilities.
- Hook bus drift risk. GoClaw has a message bus alongside typed hooks; AGH should avoid routing lifecycle semantics through a generic bus.
- Per-process caches need careful invalidation if multiple daemons, restart recovery, or UDS/HTTP/CLI updates can modify soul/heartbeat state.

## Open Questions

- Should AGH's "agent soul" be file-backed, table-backed, or hybrid?
- Is heartbeat scoped to an agent, an active `task_run`, or both?
- Which exact harness lifecycle hook points are required?
- How much mutable self-editing should agents have?
- How should AGH preserve continuity across networks and orchestration?
- What is the bounded context budget for harness injection?
- If a file requires interpretation by another tool, which tool should own it? No such file blocked this read-only pass.

## Evidence

- `.resources/goclaw/docs/agent-identity-conventions.md:1-18`
- `.resources/goclaw/docs/agent-identity-conventions.md:22-48`
- `.resources/goclaw/docs/agent-identity-conventions.md:49-83`
- `.resources/goclaw/docs/agent-identity-conventions.md:173-180`
- `.resources/goclaw/docs/agent-identity-conventions.md:238-240`
- `.resources/goclaw/docs/01-agent-loop.md:304-333`
- `.resources/goclaw/docs/01-agent-loop.md:485-553`
- `.resources/goclaw/docs/01-agent-loop.md:603-609`
- `.resources/goclaw/internal/store/agent_store.go:29-33`
- `.resources/goclaw/internal/store/agent_store.go:43-86`
- `.resources/goclaw/internal/store/agent_store.go:626-690`
- `.resources/goclaw/migrations/000001_init_schema.up.sql:87-106`
- `.resources/goclaw/internal/store/pg/agents_context.go:21-70`
- `.resources/goclaw/internal/store/pg/agents_context.go:74-123`
- `.resources/goclaw/internal/tools/context_file_interceptor.go:18-40`
- `.resources/goclaw/internal/tools/context_file_interceptor.go:74-83`
- `.resources/goclaw/internal/tools/context_file_interceptor.go:107-169`
- `.resources/goclaw/internal/tools/context_file_interceptor.go:189-293`
- `.resources/goclaw/internal/tools/context_file_interceptor.go:296-379`
- `.resources/goclaw/internal/agent/prompt_config_types.go:5-49`
- `.resources/goclaw/internal/agent/prompt_config_types.go:79-113`
- `.resources/goclaw/internal/agent/systemprompt_sections.go:131-154`
- `.resources/goclaw/internal/agent/user_identity_resolver.go:40-88`
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:1-10`
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:63-112`
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:115-137`
- `.resources/goclaw/docs/21-agent-evolution-and-skill-management.md:168-197`
- `.resources/goclaw/internal/tools/skill_manage.go:21-29`
- `.resources/goclaw/internal/tools/skill_manage.go:35-52`
- `.resources/goclaw/internal/tools/skill_manage.go:61-99`
- `.resources/goclaw/internal/tools/skill_manage.go:115-160`
- `.resources/goclaw/internal/tools/capability.go:5-56`
- `.resources/goclaw/docs/22-heartbeat-system.md:1-9`
- `.resources/goclaw/docs/22-heartbeat-system.md:13-56`
- `.resources/goclaw/docs/22-heartbeat-system.md:61-79`
- `.resources/goclaw/docs/22-heartbeat-system.md:101-115`
- `.resources/goclaw/docs/22-heartbeat-system.md:132-162`
- `.resources/goclaw/docs/22-heartbeat-system.md:181-210`
- `.resources/goclaw/docs/22-heartbeat-system.md:214-260`
- `.resources/goclaw/internal/heartbeat/interfaces.go:22-25`
- `.resources/goclaw/internal/heartbeat/ticker.go:24-40`
- `.resources/goclaw/internal/heartbeat/ticker.go:54-72`
- `.resources/goclaw/internal/heartbeat/ticker.go:100-146`
- `.resources/goclaw/internal/heartbeat/ticker.go:158-230`
- `.resources/goclaw/internal/heartbeat/ticker.go:270-331`
- `.resources/goclaw/internal/heartbeat/ticker.go:334-394`
- `.resources/goclaw/internal/heartbeat/ticker.go:417-458`
- `.resources/goclaw/internal/store/heartbeat_store.go:11-38`
- `.resources/goclaw/internal/store/heartbeat_store.go:50-65`
- `.resources/goclaw/internal/store/heartbeat_store.go:67-87`
- `.resources/goclaw/internal/store/heartbeat_store.go:107-124`
- `.resources/goclaw/internal/store/pg/heartbeat.go:15-31`
- `.resources/goclaw/internal/store/pg/heartbeat.go:72-175`
- `.resources/goclaw/internal/store/pg/heartbeat.go:186-200`
- `.resources/goclaw/migrations/000022_agent_heartbeats.up.sql:1-68`
- `.resources/goclaw/internal/tools/heartbeat.go:17-23`
- `.resources/goclaw/internal/tools/heartbeat.go:42-90`
- `.resources/goclaw/internal/tools/heartbeat.go:92-120`
- `.resources/goclaw/internal/tools/heartbeat.go:265-333`
- `.resources/goclaw/docs/11-agent-teams.md:1-8`
- `.resources/goclaw/docs/11-agent-teams.md:36-42`
- `.resources/goclaw/docs/11-agent-teams.md:61-71`
- `.resources/goclaw/docs/11-agent-teams.md:75-118`
- `.resources/goclaw/docs/11-agent-teams.md:123-227`
- `.resources/goclaw/docs/11-agent-teams.md:342-421`
- `.resources/goclaw/docs/11-agent-teams.md:483-542`
- `.resources/goclaw/docs/11-agent-teams.md:546-660`
- `.resources/goclaw/migrations/000003_agent_teams.up.sql:5-45`
- `.resources/goclaw/migrations/000018_team_tasks_workspace_followup.up.sql:60-81`
- `.resources/goclaw/internal/store/team_store.go:39-57`
- `.resources/goclaw/internal/store/team_store.go:93-130`
- `.resources/goclaw/internal/store/team_store.go:240-245`
- `.resources/goclaw/internal/store/team_store.go:274-281`
- `.resources/goclaw/internal/store/pg/teams_tasks.go:19-22`
- `.resources/goclaw/internal/store/pg/teams_tasks_lifecycle.go:14-92`
- `.resources/goclaw/internal/store/pg/teams_tasks_lifecycle.go:198-212`
- `.resources/goclaw/internal/store/pg/teams_tasks_progress.go:18-71`
- `.resources/goclaw/internal/store/pg/teams_tasks_progress.go:82-217`
- `.resources/goclaw/internal/tools/team_tasks_lifecycle.go:12-34`
- `.resources/goclaw/internal/tools/team_tasks_lifecycle.go:51-113`
- `.resources/goclaw/internal/tools/team_tasks_create.go:18-52`
- `.resources/goclaw/internal/tools/team_tasks_create.go:120-230`
- `.resources/goclaw/internal/tools/team_tasks_create.go:250-320`
- `.resources/goclaw/internal/tools/team_tool_dispatch.go:35-47`
- `.resources/goclaw/internal/tools/team_tool_dispatch.go:53-80`
- `.resources/goclaw/internal/tools/team_tool_dispatch.go:95-240`
- `.resources/goclaw/internal/tools/team_tool_dispatch.go:340-423`
- `.resources/goclaw/internal/tools/team_metadata_keys.go:5-63`
- `.resources/goclaw/docs/24-knowledge-vault.md:1-20`
- `.resources/goclaw/docs/24-knowledge-vault.md:41-100`
- `.resources/goclaw/docs/24-knowledge-vault.md:187-218`
- `.resources/goclaw/migrations/000037_v3_memory_evolution.up.sql:4-32`
- `.resources/goclaw/migrations/000038_vault_tables.up.sql:1-54`
- `.resources/goclaw/internal/agent/loop_pipeline_adapter.go:84-96`
- `.resources/goclaw/internal/agent/loop_pipeline_adapter.go:266-286`
- `.resources/goclaw/internal/memory/auto_injector.go:8-38`
- `.resources/goclaw/internal/memory/auto_injector_impl.go:26-103`
- `.resources/goclaw/docs/agent-hooks.md:1-46`
- `.resources/goclaw/docs/agent-hooks.md:104-131`
- `.resources/goclaw/docs/agent-hooks.md:144-162`
- `.resources/goclaw/docs/agent-hooks.md:188-193`
- `.resources/goclaw/internal/hooks/types.go:17-48`
- `.resources/goclaw/internal/hooks/types.go:65-77`
- `.resources/goclaw/internal/hooks/types.go:94-111`
- `.resources/goclaw/internal/hooks/types.go:137-183`
- `.resources/goclaw/internal/hooks/types.go:203-220`
- `.resources/goclaw/internal/hooks/dispatcher.go:24-47`
- `.resources/goclaw/internal/hooks/dispatcher.go:153-260`
- `.resources/goclaw/internal/hooks/dispatcher.go:356-400`
- `.resources/goclaw/internal/hooks/dispatcher.go:429-454`
- `.resources/goclaw/internal/pipeline/context_stage.go:38-65`
- `.resources/goclaw/internal/pipeline/tool_stage.go:49-96`
- `.resources/goclaw/internal/pipeline/tool_stage.go:141-153`
- `.resources/goclaw/internal/pipeline/finalize_stage.go:158-170`
- `.resources/goclaw/internal/pipeline/deps.go:118-127`
- `.resources/goclaw/internal/bus/bus.go:10-75`
- `.resources/goclaw/internal/bus/bus.go:117-137`
- `.resources/goclaw/internal/bus/types.go:19-46`
- `.resources/goclaw/internal/bus/types.go:62-107`
- `.resources/goclaw/internal/bus/types.go:148-190`
- `.resources/goclaw/internal/scheduler/scheduler.go:20-29`
- `.resources/goclaw/internal/scheduler/scheduler.go:59-85`
- `.resources/goclaw/internal/scheduler/scheduler.go:115-159`
- `.resources/goclaw/internal/agent/router.go:288-327`
- `.resources/goclaw/internal/agent/router.go:416-433`
- `.resources/goclaw/internal/agent/router.go:457-497`
- `.resources/goclaw/docs/08-scheduling-cron.md:1-11`
- `.resources/goclaw/docs/08-scheduling-cron.md:14-79`
- `.resources/goclaw/docs/08-scheduling-cron.md:108-174`
- `.resources/goclaw/internal/store/pg/cron_scheduler.go:180-210`
- `.resources/goclaw/internal/store/pg/cron_scheduler.go:352-386`
- `.resources/goclaw/internal/store/pg/cron_exec.go:28-52`
