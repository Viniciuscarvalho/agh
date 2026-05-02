# Analysis: openclaw

## Scope

- Path explored: `.resources/openclaw/`
- Topic: Applying an "agent soul" idea to AGH's harness: persistent agent self/identity/context, liveness/heartbeat, coordination across agents/networks/tasks/orchestration, and memory/context continuity.
- Files read in full vs. sampled: targeted read-only review of gateway config docs, channel/session routing docs, heartbeat docs, session path/transcript code, heartbeat runner/wake code, task registry code, plugin hook code, and gateway protocol schemas.
- Total available files: not counted by the subagent; repository was sampled by targeted source search.

The analysis maps observed OpenClaw patterns against AGH constraints: `task_runs` remains the single durable work queue; `ClaimNextRun` owns claims; scheduler may wake/sweep but must not claim; hooks are typed call-site dispatch rather than an event bus; heartbeat/progress must avoid ACP backpressure; and agent-manageable CLI/HTTP/UDS surfaces are required.

## Overview

OpenClaw's closest analogue to an "agent soul" is not one subsystem. It is a composition of per-agent configuration, per-agent workspace/bootstrap files, persistent session keys, JSONL transcripts, optional memory plugins, typed prompt hooks, and heartbeat turns.

The persistent self is modeled as a named agent definition with a stable `id`, runtime configuration, workspace paths, identity fields, tools, skills, and subagents. OpenClaw bootstraps explicit self/context files into each agent workspace: `AGENTS.md`, `SOUL.md`, `TOOLS.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, and `BOOTSTRAP.md` unless `skipBootstrap` disables that behavior. Per-agent overrides include stable identity, runtime mode, workspace, skills, theme/avatar/emoji, mention patterns, tools, and subagents.

The session model gives each agent a durable "brain" boundary. `AgentId` selects an isolated workspace and session store, while `SessionKey` selects the context/concurrency bucket. Session stores default to `~/.openclaw/agents/<agentId>/sessions/sessions.json`, and JSONL transcripts sit beside that store. Code mirrors this with per-agent session directories and transcript paths.

Heartbeat is implemented as a scheduled agent turn, not as a background task record. OpenClaw explicitly says heartbeat runs do not create task records; task records are for detached work such as ACP runs, subagents, and isolated cron jobs. The runner avoids colliding with active turns by checking command/session lane queue size and skipping with `requests-in-flight`, leaving retry responsibility to the wake layer.

For AGH, the main transfer is architectural rather than literal: OpenClaw's "soul" is useful as a durable identity/context layer around the harness, but AGH should not copy OpenClaw's separate task registry semantics if `task_runs` must remain the single durable work queue and `ClaimNextRun` must be the only claim authority.

## Mechanisms / Patterns

- **Persistent agent identity and bootstrap context:** OpenClaw defines agents under `agents.list`, with defaults and per-agent overrides. Agent definitions carry stable IDs, workspaces, runtime configuration, model/provider, identity metadata, tools, skills, and subagent controls. Bootstrap files provide a file-backed self and operating context, including `SOUL.md`, `IDENTITY.md`, `USER.md`, and `HEARTBEAT.md`. The useful pattern is a two-layer identity model: structured fields for routing/configuration, plus rendered human-readable context files for agent cognition.
- **Per-agent session isolation:** OpenClaw routes every inbound conversation to exactly one agent by bindings, then uses that agent's workspace and session store. Session keys are canonicalized as `agent:<agentId>:...`, with variants for groups, channels, threads, cron, subagents, and ACP sessions. Identity and memory continuity get a concrete routing primitive: agent identity picks the durable scope, session key picks the conversational lane.
- **JSONL transcript continuity:** OpenClaw stores session metadata in `sessions.json` and transcripts as JSONL files. Transcript creation writes a session header with version, id, timestamp, and cwd. Runtime append logic resolves or persists the transcript file, ensures the header, opens the session manager, appends messages, and emits transcript updates. For AGH, the transferable idea is an appendable, inspectable continuity record with stable session identity, branch/fork support, and a recoverable pointer from metadata to transcript/event history.
- **Heartbeat as liveness plus reflective maintenance:** OpenClaw heartbeat supports cadence, active hours, target delivery, light context, isolated sessions, and `HEARTBEAT.md` task blocks. Heartbeat prompts can run in the main session or in an isolated context to reduce history/token load. Main/session lane busy states cause a skip and retry instead of interrupting active streaming work.
- **Wake coalescing and retry:** OpenClaw has a small heartbeat wake coordinator that coalesces wake requests by target, assigns priority, delays briefly, and retries when the runner reports `requests-in-flight`. Background task completion can queue a system event and request a heartbeat wake for the owner session. This maps well to AGH's "scheduler may wake/sweep but not claim" rule.
- **Typed hooks at prompt/call-site boundaries:** OpenClaw's hook catalog includes typed agent-turn hooks such as `before_model_resolve`, `agent_turn_prepare`, `before_prompt_build`, `before_agent_reply`, `before_agent_finalize`, `agent_end`, and `heartbeat_prompt_contribution`. Heartbeat prompt contributions run only for heartbeat turns and return prepend/append context. This aligns with AGH's typed call-site hook model.
- **Task and orchestration records:** OpenClaw task records include runtime, requester/owner session keys, child session key, agent id, run id, status, delivery status, timestamps, progress summary, and terminal summary. It persists them in a SQLite `task_runs` table under `state/tasks/runs.sqlite`. It also has task-flow records for multi-step orchestration with revision, current step, blocked task, and serialized state/wait JSON. The concept of owner/session/progress/terminal summary is transferable; the separate task registry is a mismatch for AGH.
- **Agent-manageable surfaces:** OpenClaw exposes protocol methods for health, status, presence, system events, last heartbeat, setting heartbeats, agents CRUD, agent files, agent identity, sessions, chat, wake, cron, skills, and tools. This reinforces that AGH's soul capability cannot be only an internal Go API or UI affordance.

## Relevant Code Paths

- `.resources/openclaw/docs/gateway/config-agents.md:16-75` - default workspace, skills inheritance/replacement, bootstrap files, and context injection controls.
- `.resources/openclaw/docs/gateway/config-agents.md:911-986` - per-agent override shape: stable ID, runtime, workspace, skills, identity, tools, group routing, and subagents.
- `.resources/openclaw/docs/channels/channel-routing.md:20-48` - `AgentId` as isolated workspace/session store and `SessionKey` as context/concurrency bucket.
- `.resources/openclaw/docs/channels/channel-routing.md:104-135` - named agents, bindings, session stores, JSONL transcript location, templated store paths, and safe disk discovery.
- `.resources/openclaw/src/config/sessions/paths.ts:1-37` - per-agent sessions directory and default session store resolution.
- `.resources/openclaw/src/config/sessions/paths.ts:240-317` - transcript and store path resolution, including topic transcripts and `{agentId}` templating.
- `.resources/openclaw/src/config/sessions/transcript.ts:28-47` - session JSONL header.
- `.resources/openclaw/src/config/sessions/transcript.ts:236-292` - session file references, headers, message append, and transcript updates.
- `.resources/openclaw/src/config/sessions/types.ts:140-164` - session-level heartbeat state, isolated heartbeat base key, plugin extensions, one-shot prompt injections, session file, parent key, and fork marker.
- `.resources/openclaw/src/sessions/session-key-utils.ts:24-97` - canonicalizes and classifies agent, cron, subagent, and ACP session keys.
- `.resources/openclaw/docs/gateway/heartbeat.md:16-17` - heartbeat is not a background task record.
- `.resources/openclaw/docs/gateway/heartbeat.md:23-83` - heartbeat cadence, active hours, targets, light context, and configuration.
- `.resources/openclaw/docs/gateway/heartbeat.md:227-303` - light/isolated heartbeat context, busy-lane skip behavior, and system-event wake behavior.
- `.resources/openclaw/docs/gateway/heartbeat.md:391-418` - `HEARTBEAT.md` due-task parsing and durable per-session task state.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:551-724` - heartbeat prompt building from system events, cron/exec events, due tasks, default prompts, and `HEARTBEAT.md`.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:727-822` - enabled/active-hours/queue checks and isolated heartbeat session creation.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:935-994` - heartbeat task state update, metadata handoff to the agent, and alert delivery control.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:1061-1298` - heartbeat reply execution, empty/OK/duplicate suppression, timestamps, event consumption, and outbound delivery.
- `.resources/openclaw/src/infra/heartbeat-wake.ts:42-207` - wake coalescing, priority, busy retries, and wake errors.
- `.resources/openclaw/docs/plugins/hooks.md:60-102` - typed agent/message/session hooks.
- `.resources/openclaw/docs/plugins/hooks.md:181-198` - heartbeat-only prompt contribution hooks.
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt.prompt-helpers.ts:28-48` - typed prompt hook runner methods.
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt.prompt-helpers.ts:96-210` - one-shot injections and heartbeat prompt contributions at prompt build time.
- `.resources/openclaw/src/plugins/hooks.ts:1264-1382` - typed hook runner methods including `runHeartbeatPromptContribution`.
- `.resources/openclaw/src/tasks/task-registry.types.ts:3-80` - task runtime/status and durable task record fields.
- `.resources/openclaw/src/tasks/task-registry.paths.ts:24-30` - task registry SQLite path.
- `.resources/openclaw/src/tasks/task-registry.store.sqlite.ts:220-304` - task store table operations.
- `.resources/openclaw/src/tasks/task-registry.ts:1068-1217` - system events and heartbeat wakes around task progress, blocked state, terminal updates, and delivery fallback.
- `.resources/openclaw/src/tasks/task-registry.ts:1472-1806` - task record creation, status/progress update by run id, and finalization.
- `.resources/openclaw/src/tasks/task-flow-registry.types.ts:12-42` - multi-step task flow state.
- `.resources/openclaw/docs/gateway/protocol.md:313-438` - agent-manageable protocol methods for identity, sessions, wake, heartbeat, cron, skills, tools, and nodes.
- `.resources/openclaw/src/gateway/server-methods-list.ts:90-183` - concrete gateway methods/events.
- `.resources/openclaw/src/gateway/protocol/schema/agent.ts:131-213` - agent invocation, identity, wait, and wake schemas.
- `.resources/openclaw/docs/reference/memory-config.md:12-55` - memory enablement/targeting gates.
- `.resources/openclaw/docs/channels/discord.md:250-259` - stable shared context vs long-term memory notes.

## Transferable Patterns

- Make "soul" a first-class harness context, not just prompt text. AGH can define a durable agent self record with stable id, display identity, workspace/context policy, heartbeat policy, memory policy, and capability/tool affordances, then render that into harness context at typed prompt construction points.
- Use session identity as the boundary for continuity. OpenClaw's `AgentId` plus `SessionKey` split helps avoid conflating who the agent is with what it is currently doing.
- Treat heartbeat as wakeable durable work or out-of-band liveness, never as an unsolicited stream write. If AGH needs a model-driven heartbeat turn, the scheduler should enqueue/wake a normal `task_runs` item and let `ClaimNextRun` own the claim; otherwise liveness should be stored and surfaced out-of-band.
- Keep scheduler behavior separate from claim behavior. OpenClaw's wake coordinator is useful as a coalescing/retry layer, but AGH should map that layer only to wake/sweep/enqueue decisions.
- Add typed context-contribution hooks, not event-bus hooks. OpenClaw's `heartbeat_prompt_contribution` is valuable because it is scoped to a known call site and run kind.
- Record progress and terminal summaries as durable, queryable fields inside AGH's existing `task_runs` model rather than a parallel registry.
- Expose the soul through agent-operable surfaces: inspect/update identity, inspect rendered context, update heartbeat policy, wake heartbeat, list liveness, inspect memory continuity, and manage per-agent context files or records.
- Keep memory explicit and opt-in. AGH should avoid making "soul" an unbounded automatic memory dump; it should distinguish identity, current working context, durable memories, and retrieved context.

## Risks / Mismatches

- OpenClaw's task registry is not directly compatible with AGH's `task_runs` constraint. Any heartbeat, orchestration, or background self-maintenance work that executes must flow through AGH's existing `task_runs` and `ClaimNextRun`.
- OpenClaw heartbeat directly invokes an agent turn. In AGH, direct invocation from the scheduler would violate the supplied constraint if it bypasses `ClaimNextRun`.
- Heartbeat can inflate context or create backpressure if copied naively. AGH should treat heartbeat/progress as control-plane state unless model reasoning is required, and should not push heartbeat traffic into ACP channels already streaming model output.
- File-backed soul is flexible but under-typed. AGH likely needs typed storage and validation with optional rendered files/views because agent-manageable CLI/HTTP/UDS surfaces are required.
- OpenClaw hook names are transferable only as call-site patterns. Any "soul changed", "heartbeat due", or "memory updated" mechanism should not become a generic event stream.
- OpenClaw channel-routing assumptions may not map to AGH Network. Session continuity is transferable; chat delivery routing is only partially transferable.
- OpenClaw's `HEARTBEAT.md` due-task parser is convenient but may become a hidden scheduler. In AGH, due heartbeat tasks must compile into regular `task_runs` entries or remain advisory prompt context.

## Open Questions

- Which AGH storage layer should own the canonical agent soul: an existing config model, a new SQLite table, capability metadata, workspace files, or a combination of typed storage plus rendered context files?
- Should AGH heartbeat be only liveness metadata, a normal claimable `task_runs` item, or both depending on whether model execution is required?
- What is the minimal CLI/HTTP/UDS surface for agent-manageable soul support: identity get/set, context render, context file edit, heartbeat policy get/set, wake, last heartbeat, progress summary, memory inspect, and session continuity?
- How should AGH prevent soul context from becoming unbounded prompt bloat: explicit context budgets, summaries, memory retrieval gates, compaction hooks, or per-run context policies?
- Should AGH support file-backed context artifacts analogous to `SOUL.md`, `IDENTITY.md`, and `HEARTBEAT.md`, or should files be generated views over typed records?
- How should cross-agent/network coordination represent ownership: by agent id, run id, session key, network node id, capability id, or a separate coordination identity?
- OpenClaw protocol and schema docs appear hand-authored/generated in places, but no validation/codegen commands were run under the read-only contract. Some protocol details may require confirmation against runtime behavior.

## Evidence

- `.resources/openclaw/docs/gateway/config-agents.md:16-75`
- `.resources/openclaw/docs/gateway/config-agents.md:911-986`
- `.resources/openclaw/docs/channels/broadcast-groups.md:182-191`
- `.resources/openclaw/docs/channels/channel-routing.md:20-48`
- `.resources/openclaw/docs/channels/channel-routing.md:69-135`
- `.resources/openclaw/docs/pi.md:290-318`
- `.resources/openclaw/src/config/sessions/paths.ts:1-37`
- `.resources/openclaw/src/config/sessions/paths.ts:240-317`
- `.resources/openclaw/src/config/sessions/transcript.ts:28-47`
- `.resources/openclaw/src/config/sessions/transcript.ts:236-292`
- `.resources/openclaw/src/config/sessions/types.ts:140-164`
- `.resources/openclaw/src/sessions/session-key-utils.ts:24-97`
- `.resources/openclaw/docs/gateway/heartbeat.md:16-17`
- `.resources/openclaw/docs/gateway/heartbeat.md:23-83`
- `.resources/openclaw/docs/gateway/heartbeat.md:227-303`
- `.resources/openclaw/docs/gateway/heartbeat.md:391-418`
- `.resources/openclaw/docs/gateway/heartbeat.md:440-476`
- `.resources/openclaw/src/auto-reply/heartbeat.ts:12-18`
- `.resources/openclaw/src/auto-reply/heartbeat.ts:189-267`
- `.resources/openclaw/src/auto-reply/heartbeat-filter.ts:37-99`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:183-216`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:246-417`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:551-724`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:727-822`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:854-994`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:1061-1298`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:1316-1567`
- `.resources/openclaw/src/infra/heartbeat-wake.ts:13-58`
- `.resources/openclaw/src/infra/heartbeat-wake.ts:89-266`
- `.resources/openclaw/docs/plugins/hooks.md:60-102`
- `.resources/openclaw/docs/plugins/hooks.md:181-198`
- `.resources/openclaw/docs/plugins/hooks.md:330-340`
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt.prompt-helpers.ts:28-48`
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt.prompt-helpers.ts:96-210`
- `.resources/openclaw/src/plugins/hooks.ts:1264-1382`
- `.resources/openclaw/src/agents/harness/lifecycle-hook-helpers.ts:16-82`
- `.resources/openclaw/src/tasks/task-registry.types.ts:3-80`
- `.resources/openclaw/src/tasks/task-registry.paths.ts:24-30`
- `.resources/openclaw/src/tasks/task-registry.store.sqlite.ts:220-304`
- `.resources/openclaw/src/tasks/task-registry.store.sqlite.ts:370-390`
- `.resources/openclaw/src/tasks/task-registry.ts:54-60`
- `.resources/openclaw/src/tasks/task-registry.ts:937-969`
- `.resources/openclaw/src/tasks/task-registry.ts:1068-1309`
- `.resources/openclaw/src/tasks/task-registry.ts:1472-1806`
- `.resources/openclaw/src/tasks/task-registry.ts:1940-1969`
- `.resources/openclaw/src/tasks/task-flow-registry.types.ts:12-42`
- `.resources/openclaw/src/tasks/task-executor.ts:46-180`
- `.resources/openclaw/src/tasks/task-registry.maintenance.ts:33-41`
- `.resources/openclaw/src/tasks/task-registry.maintenance.ts:145-156`
- `.resources/openclaw/src/tasks/task-registry.audit.ts:139-178`
- `.resources/openclaw/docs/gateway/protocol.md:258-303`
- `.resources/openclaw/docs/gateway/protocol.md:313-438`
- `.resources/openclaw/docs/gateway/protocol.md:451-453`
- `.resources/openclaw/src/gateway/server-methods-list.ts:90-183`
- `.resources/openclaw/src/gateway/protocol/schema/agent.ts:131-213`
- `.resources/openclaw/docs/reference/memory-config.md:12-55`
- `.resources/openclaw/docs/channels/discord.md:250-259`
- `.resources/openclaw/src/plugins/memory-state.ts:67-80`
- `.resources/openclaw/src/plugins/memory-state.ts:97-110`
- `.resources/openclaw/src/plugins/memory-state.ts:128-178`

## Targeted Soul Exposure Addendum

Follow-up read-only subagent research focused specifically on `SOUL.md` exposure found that OpenClaw treats `SOUL.md` as high-salience workspace Markdown prompt context, not as runtime state. The file is seeded into the agent workspace with other bootstrap files, loaded through bounded/root-guarded bootstrap-file handling, converted into prompt context, and rendered under project context. When `SOUL.md` is present, the system prompt adds explicit guidance to embody it.

OpenClaw's useful split is `SOUL.md` for persona text, `IDENTITY.md` for a narrow structured display projection, and `HEARTBEAT.md` for dynamic operational heartbeat guidance. `IDENTITY.md` can be parsed into `name`, `emoji`, `theme`, and `avatar` values used outside the prompt. `HEARTBEAT.md` is treated as dynamic context and can be excluded from normal runs when heartbeat guidance is disabled; due-task state is stored separately from persona files.

Transfer to AGH: `SOUL.md` should be prompt/persona context with strict scope, while any structured projection should remain narrow and explicit. AGH should expose diagnostics for file inclusion/truncation and keep runtime wake/task/liveness context in `/agent/context`, not in `SOUL.md`.

Additional evidence:

- `.resources/openclaw/src/agents/workspace.ts:L19-L25`
- `.resources/openclaw/src/agents/workspace.ts:L467-L527`
- `.resources/openclaw/src/agents/bootstrap-files.ts:L194-L288`
- `.resources/openclaw/src/agents/system-prompt.ts:L96-L126`
- `.resources/openclaw/src/agents/system-prompt.ts:L950-L1006`
- `.resources/openclaw/src/agents/identity-file.ts:L47-L89`
- `.resources/openclaw/src/commands/agents.commands.identity.ts:L140-L149`
- `.resources/openclaw/src/auto-reply/heartbeat.ts:L188-L283`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:L610-L629`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:L935-L963`
