# Analysis: hermes

## Scope

- Path explored: `.resources/hermes/`
- Topic: Applying an "agent soul" idea to AGH's harness: persistent agent self/identity/context, liveness/heartbeat, coordination across agents/networks/tasks/orchestration, and memory/context continuity.
- Files read in full vs. sampled: targeted read-only exploration of Hermes prompt/persona loading, gateway session storage, activity supervision, cron scheduler, ProcessRegistry, ACP adapter, Honcho memory provider, terminal tool registration, and tests.
- Total available files: not counted by the subagent; repository was sampled by targeted source search.

The comparison is scoped to AGH constraints: `task_runs` remains the single durable work queue; `ClaimNextRun` is the only owner of claims; the scheduler may wake or sweep but must not claim; hooks are typed call-site dispatch rather than an event bus; heartbeat/progress must avoid ACP backpressure; and all meaningful controls must be agent-manageable through CLI/HTTP/UDS surfaces.

## Overview

Hermes treats "agent soul" as a composition of separate mechanisms rather than one monolithic feature. A profile-local `SOUL.md` provides prompt-level persona and tone, loaded as the primary identity layer when present. Session continuity is handled separately through deterministic gateway session keys, SQLite-backed transcripts, resume/suspend flags, and process-aware reset protection. Cross-session memory is another separate layer, with Honcho providing profile/search/reasoning/context/conclusion tools plus asynchronous recall prefetch and liveness reporting.

For AGH, the transferable idea is not to copy Hermes' `SOUL.md` file model directly. The useful pattern is separation of concerns: durable identity/persona, per-run context, liveness/progress, memory recall, and coordination should each have explicit ownership. In AGH terms, "agent soul" should enrich the harness around `task_runs` rather than creating a second scheduler, second queue, or hidden event bus.

## Mechanisms / Patterns

- **Persona as a first-class prompt layer:** Hermes ships default soul text and allows a deployment/profile-local `SOUL.md`. `load_soul_md()` reads, scans, truncates, and returns that identity text. Prompt assembly places SOUL identity before system prompt and memory/context layers. Tests assert that SOUL identity overrides the default identity even when normal context files are skipped.
- **Persona and learned memory are deliberately separated:** The Honcho provider notes that SOUL-to-`aiPeer` sync was removed because `SOUL.md` is persona content, not identity configuration. Honcho resolves session/profile context, exposes profile/search/reasoning/context/conclude tools, asynchronously syncs turns, and performs recall prefetch with staleness and timeout controls. AGH should not collapse prompt persona, durable identity, and learned memory into one store or API.
- **Activity tracking is local, cheap, and out-of-band:** The agent stores `_last_activity_ts`, `_last_activity_desc`, `_current_tool`, and API counters. `_touch_activity()` updates them, and `get_activity_summary()` exposes a snapshot. Long non-streaming calls, streaming calls, and tool execution update activity periodically while waiting.
- **Supervision uses polling plus interruption:** Gateway execution polls `get_activity_summary()` every few seconds, emits warnings before timeout, and interrupts only when the agent is idle beyond the configured threshold. Cron jobs use the same inactivity-based timeout model and report last activity in timeout errors. This maps to AGH's ACP backpressure constraint: heartbeat/progress should be recorded through a daemon-owned, nonblocking path, not by writing more ACP messages to stdout/SSE when the adapter is already under pressure.
- **ProcessRegistry hardens lifecycle ownership:** Hermes tracks background terminal processes by process id, task id, session key, routing metadata, output buffers, detached status, notification policy, watch patterns, rate limits, and checkpoint state. It can list, poll, wait, kill, write to stdin, prune, checkpoint, and recover live host processes as detached sessions. Gateway startup recovers process checkpoints and resumes watchers after unclean shutdown.
- **Scheduler is wake-oriented but owns its own job execution lifecycle:** A file lock prevents duplicate cron ticks. A wake gate can skip LLM runs when a pre-check returns `wakeAgent: false`. Due jobs advance `next_run_at` under lock before execution, then run/save/deliver/mark the job. For AGH this is only partially transferable: wake-gate and sweep concepts fit, but the scheduler must not become a claimant because AGH's `ClaimNextRun` owns claims.
- **ACP adapter persists sessions and restores after reconnect:** The session manager maps ACP session IDs to Hermes agents, saves messages into SQLite, recreates agents from stored state, and preserves queued/interrupted prompt state. Cancellation sets a cancel event and calls `agent.interrupt()`. Prompt execution runs through an executor with copied context variables, while queued prompts and callbacks keep the JSON-RPC server responsive. The ACP entrypoint routes logging away from stdout and performs MCP discovery before the asyncio server starts, protecting stdio framing and event-loop responsiveness.

## Relevant Code Paths

- `.resources/hermes/hermes_cli/default_soul.py:1-10` - default persona text used when no profile-local `SOUL.md` overrides it.
- `.resources/hermes/docker/SOUL.md:1-15` - deployment-facing soul/persona file documenting that it is loaded fresh into each message.
- `.resources/hermes/agent/prompt_builder.py:1028-1054` - `load_soul_md()` reads, validates, scans, truncates, and returns profile-local soul content.
- `.resources/hermes/agent/prompt_builder.py:1144-1182` - prompt context loading gives SOUL its own path and priority separate from normal context files.
- `.resources/hermes/tests/run_agent/test_run_agent.py:860-883` - tests SOUL identity override behavior.
- `.resources/hermes/run_agent.py:1218-1260` - agent activity fields capture last activity timestamp, description, current tool, and API call count.
- `.resources/hermes/run_agent.py:4523-4565` - `_touch_activity()` and `get_activity_summary()` expose liveness state to supervisors.
- `.resources/hermes/run_agent.py:4810-4844` - prompt assembly includes SOUL identity, system prompt, memory snapshot, skills, context files, date/time, and platform hint.
- `.resources/hermes/run_agent.py:6368-6424` - non-streaming API calls update activity while waiting and detect stale network waits.
- `.resources/hermes/run_agent.py:7288-7352` - streaming calls update activity while waiting for chunks, including stale stream recovery.
- `.resources/hermes/run_agent.py:9456-9682` - concurrent tool execution updates activity, registers interruptible worker threads, and polls long tool batches.
- `.resources/hermes/run_agent.py:9786-10064` - sequential tool execution updates current tool/activity and wires memory/tool-provider execution.
- `.resources/hermes/gateway/run.py:12912-13122` - gateway agent execution uses activity-aware inactivity timeout, warnings, interruption, and diagnostic final responses.
- `.resources/hermes/cron/scheduler.py:1059-1145` - cron execution applies the same activity-aware timeout model to scheduled jobs.
- `.resources/hermes/cron/scheduler.py:1262-1368` - cron tick locking, due-job selection, next-run advancement, execution, delivery, and run marking.
- `.resources/hermes/tools/process_registry.py:1-30` - ProcessRegistry purpose: background process tracking, status, wait, kill, checkpoint, and session reset protection.
- `.resources/hermes/tools/process_registry.py:88-134` - `ProcessSession` records command, task ID, session key, PID, routing metadata, notification config, watch patterns, and output state.
- `.resources/hermes/tools/process_registry.py:260-382` - watch-pattern and global notification rate limiting prevent alert storms.
- `.resources/hermes/tools/process_registry.py:1187-1342` - process pruning, checkpoint writing, crash recovery, and watcher resumption.
- `.resources/hermes/tools/terminal_tool.py:1885-1998` - background terminal process creation registers session/routing metadata and notification/watch behavior.
- `.resources/hermes/gateway/session.py:573-650` - deterministic gateway session keys for DM/group/thread/user isolation.
- `.resources/hermes/gateway/session.py:662-806` - SQLite-backed session store with active-process protection for reset/expiry decisions.
- `.resources/hermes/gateway/session.py:861-930` - `get_or_create()` preserves resume-pending sessions or creates fresh entries after reset.
- `.resources/hermes/gateway/session.py:982-1084` - resume-pending and prune logic preserves suspended or process-active sessions.
- `.resources/hermes/plugins/memory/honcho/__init__.py:191-234` - Honcho provider state includes session key, prefetch/sync threads, recall mode, caches, cadence, and liveness state.
- `.resources/hermes/plugins/memory/honcho/__init__.py:551-847` - recall prefetch, staleness checks, first-turn synchronous fallback, liveness snapshots, and timeout detection.
- `.resources/hermes/acp_adapter/session.py:171-242` - ACP session state tracks agent, history, cancellation, running status, queued prompts, and interrupted prompt.
- `.resources/hermes/acp_adapter/server.py:568-580` - ACP cancel path maps protocol cancellation to `agent.interrupt()`.
- `.resources/hermes/acp_adapter/server.py:646-906` - ACP prompt handling binds context, emits callbacks, runs agent work in an executor, saves session, and drains queued prompts.
- `.resources/hermes/acp_adapter/entry.py:64-124` - ACP entrypoint keeps logging off stdout and initializes discovery before server start.

## Transferable Patterns

- Model "agent soul" as several explicit harness-owned domains rather than one blob of prompt text: durable agent identity/persona, run/session context, liveness/progress, memory recall, and coordination state.
- Snapshot identity into runs without letting identity become the queue. Agent identity can live in a durable agent/profile table or config-backed registry, with `task_runs` storing the identity version or resolved identity reference used for auditability.
- Keep `ClaimNextRun` as the single claim transition. Scheduler code may wake agents, enqueue eligible work, or sweep stale claims, but it must not replicate Hermes cron behavior by owning execution advancement as a separate lifecycle.
- Make activity durable and nonblocking. AGH can maintain run-scoped fields such as `last_heartbeat_at`, `last_activity_desc`, `current_phase`, `current_tool`, and `progress_summary`, updated by the daemon or harness through a rate-limited path.
- Treat ProcessRegistry as child-resource ownership, not queue ownership. AGH could track subprocesses, tool workers, network agents, and detached tasks as resources keyed by `run_id`, `agent_id`, and session identity, with checkpoint/recover behavior and reset protection.
- Define stable identity keys for agent, provider, network, task, and run context so memory continuity is reproducible across reconnects and restarts. The key should not be an incidental UI session ID.
- Isolate protocol framing from long-running model/tool work. The ACP adapter can expose state, but liveness should not depend on emitting ACP progress messages.
- Expose the "soul" lifecycle through agent-manageable surfaces: CLI/HTTP/UDS operations to inspect resolved identity/persona, update or pin persona where allowed, inspect liveness and progress for active runs, interrupt/pause/resume a run, inspect memory-health status, request memory refresh, and view claim ownership.

## Risks / Mismatches

- Hermes has multiple local lifecycle managers: cron scheduler, gateway session store, process registry, ACP session manager, and memory provider threads. AGH should not import this shape wholesale because `task_runs` is explicitly the single durable work queue.
- Hermes cron owns job timing and execution advancement, including moving `next_run_at` before execution. In AGH, the scheduler may wake or sweep, but `ClaimNextRun` must own claims.
- Hermes' `SOUL.md` is mutable profile-local prompt text loaded at runtime. AGH likely needs stronger reproducibility across networks, tasks, and orchestration. If persona changes between wake and execution, AGH needs identity versioning or run snapshotting so audit trails are stable.
- Hermes activity summaries are in-process fields. AGH has daemon-managed ACP subprocesses and potentially networked agents; in-memory liveness alone is insufficient after daemon restart, adapter restart, or remote handoff.
- Hermes watchers can inject synthetic internal messages or send notifications when background processes complete. AGH should avoid turning heartbeat/progress into recursive work creation or ACP stream pressure. Completion notifications should be typed run events or explicit continuation requests, not implicit new claims.
- Honcho memory is external-provider-backed and largely best-effort, with async prefetch and sync threads. If AGH's "agent soul" depends on memory health, it must report degraded memory explicitly and avoid blocking `ClaimNextRun` or run execution on optional recall.
- Hermes has hook-like calls such as `post_llm_call` and `on_session_end`. AGH's hooks are typed call-site dispatch, not an event bus. Any transferred hook pattern should stay as explicit typed extension points.

## Open Questions

- The exact AGH schema and `ClaimNextRun` implementation were outside this subagent's read-only scope, so precise liveness fields, indexes, and stale-claim transitions need local AGH design confirmation.
- It is unclear whether AGH wants agent identity/persona stored in `config.toml`, a runtime database table, an extension/capability registry, or a combination.
- It is unclear how AGH's current ACP adapter surfaces progress, cancellation, and interrupts. Hermes supports keeping heartbeat/progress out of ACP backpressure, but concrete CLI/HTTP/UDS/API shapes require AGH source inspection.
- It is unclear whether "agent soul" should include self-modifying memory writes by default or only read-only contextual recall. Hermes separates persona, profile memory, and background review/sync, which suggests AGH should make write permissions explicit.
- Files that might require interpretation by external tools were not parsed with external tooling under this read-only contract; source files were inspected as text.

## Evidence

- `.resources/hermes/hermes_cli/default_soul.py:1-10`
- `.resources/hermes/docker/SOUL.md:1-15`
- `.resources/hermes/agent/prompt_builder.py:1028-1054`
- `.resources/hermes/agent/prompt_builder.py:1144-1182`
- `.resources/hermes/tests/run_agent/test_run_agent.py:860-883`
- `.resources/hermes/run_agent.py:1218-1260`
- `.resources/hermes/run_agent.py:1688-1748`
- `.resources/hermes/run_agent.py:4307-4388`
- `.resources/hermes/run_agent.py:4523-4565`
- `.resources/hermes/run_agent.py:4810-4844`
- `.resources/hermes/run_agent.py:6368-6424`
- `.resources/hermes/run_agent.py:7288-7352`
- `.resources/hermes/run_agent.py:9456-9682`
- `.resources/hermes/run_agent.py:9786-10064`
- `.resources/hermes/run_agent.py:13709-13823`
- `.resources/hermes/gateway/run.py:908-930`
- `.resources/hermes/gateway/run.py:2632-2876`
- `.resources/hermes/gateway/run.py:4568-4610`
- `.resources/hermes/gateway/run.py:10697-10855`
- `.resources/hermes/gateway/run.py:12912-13122`
- `.resources/hermes/gateway/run.py:13482-13497`
- `.resources/hermes/gateway/run.py:13760-13805`
- `.resources/hermes/cron/scheduler.py:1-9`
- `.resources/hermes/cron/scheduler.py:629-646`
- `.resources/hermes/cron/scheduler.py:800-850`
- `.resources/hermes/cron/scheduler.py:1059-1145`
- `.resources/hermes/cron/scheduler.py:1218-1250`
- `.resources/hermes/cron/scheduler.py:1262-1368`
- `.resources/hermes/cron/scheduler.py:1390-1416`
- `.resources/hermes/tools/process_registry.py:1-30`
- `.resources/hermes/tools/process_registry.py:53-75`
- `.resources/hermes/tools/process_registry.py:88-134`
- `.resources/hermes/tools/process_registry.py:260-382`
- `.resources/hermes/tools/process_registry.py:1040-1072`
- `.resources/hermes/tools/process_registry.py:1128-1185`
- `.resources/hermes/tools/process_registry.py:1187-1342`
- `.resources/hermes/tools/process_registry.py:1340-1425`
- `.resources/hermes/tools/terminal_tool.py:1885-1998`
- `.resources/hermes/gateway/session.py:162-190`
- `.resources/hermes/gateway/session.py:231-414`
- `.resources/hermes/gateway/session.py:573-650`
- `.resources/hermes/gateway/session.py:662-806`
- `.resources/hermes/gateway/session.py:861-930`
- `.resources/hermes/gateway/session.py:982-1084`
- `.resources/hermes/gateway/session.py:1244-1298`
- `.resources/hermes/plugins/memory/honcho/__init__.py:1-14`
- `.resources/hermes/plugins/memory/honcho/__init__.py:36-184`
- `.resources/hermes/plugins/memory/honcho/__init__.py:191-234`
- `.resources/hermes/plugins/memory/honcho/__init__.py:275-393`
- `.resources/hermes/plugins/memory/honcho/__init__.py:551-847`
- `.resources/hermes/plugins/memory/honcho/__init__.py:1063-1328`
- `.resources/hermes/acp_adapter/session.py:1-6`
- `.resources/hermes/acp_adapter/session.py:171-242`
- `.resources/hermes/acp_adapter/session.py:388-554`
- `.resources/hermes/acp_adapter/server.py:1-82`
- `.resources/hermes/acp_adapter/server.py:568-580`
- `.resources/hermes/acp_adapter/server.py:646-906`
- `.resources/hermes/acp_adapter/entry.py:64-124`

## Targeted Soul Exposure Addendum

Follow-up read-only subagent research focused specifically on `SOUL.md` exposure found that Hermes treats `SOUL.md` as a profile-scoped plain-text persona baseline. It is loaded from `HERMES_HOME/SOUL.md`, scanned for prompt-injection indicators, truncated if needed, and inserted as the first part of the system prompt. Hermes does not parse it into typed runtime identity fields.

Hermes snapshots the resolved system prompt into the session database. Ordinary continuations reuse that stored prompt, so `SOUL.md` changes do not automatically affect an existing session; a fresh session or compression/rebuild boundary can pick up new content. Structured runtime context exists elsewhere as gateway/session metadata rendered ephemerally and exposed through context variables. Process liveness, background processes, memory recall, transcripts, and session search remain separate from the persona file.

Transfer to AGH: `SOUL.md` should be resolved at a defined lifecycle boundary and that resolved version should be auditable. Hermes argues for either session-start or run-start snapshotting rather than unannounced mid-run reloads. AGH should improve on Hermes by adding strict frontmatter validation and an agent-manageable structured read model for the resolved soul, while still keeping task/session/liveness data outside the file.

Additional evidence:

- `.resources/hermes/agent/prompt_builder.py:31-72`
- `.resources/hermes/agent/prompt_builder.py:1016-1053`
- `.resources/hermes/run_agent.py:4806-4958`
- `.resources/hermes/run_agent.py:10488-10536`
- `.resources/hermes/run_agent.py:8980-9080`
- `.resources/hermes/gateway/session.py:159-249`
- `.resources/hermes/gateway/run.py:12099-12306`
- `.resources/hermes/tools/memory_tool.py:515-539`
- `.resources/hermes/tools/process_registry.py:88-133`
- `.resources/hermes/plugins/memory/honcho/__init__.py:275-327`
