# Paperclip Heartbeat Analysis

## Scope

- Path explored: `.resources/paperclip/`
- Topic: `HEARTBEAT.md`, heartbeat protocol, wakeup queue/coalescing, heartbeat runs, runtime state, task-scoped sessions, liveness classification, watchdog/recovery, and CLI/API/plugin surfaces.
- Read-only exploration: no files were edited, created, or deleted.

## Overview

Paperclip treats heartbeats as short execution windows coordinated by a control plane. A wakeup starts an adapter, passes prompt/context, captures logs/status/cost/session state, and updates live surfaces. Its `HEARTBEAT.md` is adapter-specific instruction content, not the control-plane protocol.

Paperclip's implementation uses two durable concepts: `agent_wakeup_requests` as queue/audit and `heartbeat_runs` as execution records. This is useful evidence for coalescing, liveness, task-scoped sessions, and recovery, but copying the dual queue would conflict with AGH's `task_runs` single durable queue and `ClaimNextRun` exclusivity.

## Mechanisms / Patterns

- **Adapter-level `HEARTBEAT.md`:** checklist instructions for identity lookup, wake context inspection, checkout, delegation, and attribution.
- **Heartbeat protocol as API discipline:** agents fetch identity/assignments, checkout work, include run IDs, and leave durable evidence.
- **Two-table wake/run model:** wake requests are separate from durable run records.
- **Coalescing and deferral:** issue/task-scoped wakes merge or defer when an execution path is active.
- **Lazy claim:** queued runs transition to running through a claim gate.
- **Task-scoped sessions:** sessions are scoped by agent/adapter/task key, including timer heartbeat fallback.
- **Runtime state rollup:** per-agent state stores last run status/error and token/cost totals.
- **Liveness classification:** status/output/durable evidence derive classifications such as completed, plan-only, empty response, blocked, and needs follow-up.
- **Watchdog/recovery:** orphaned or silent runs are reaped, resumed, or escalated.
- **Manageability surfaces:** HTTP, CLI, MCP, and plugin APIs expose wake/run/session/watchdog operations.

## Relevant Code Paths

- `.resources/paperclip/server/src/onboarding-assets/ceo/HEARTBEAT.md:1-85` - concrete heartbeat checklist.
- `.resources/paperclip/doc/SPEC.md:68-113` - SOUL/HEARTBEAT files are adapter-specific configuration.
- `.resources/paperclip/docs/guides/agent-developer/heartbeat-protocol.md:10-128` - agent-facing heartbeat procedure.
- `.resources/paperclip/packages/db/src/schema/agent_wakeup_requests.ts:5-40` - wakeup queue/audit table.
- `.resources/paperclip/packages/db/src/schema/heartbeat_runs.ts:6-82` - durable heartbeat run record.
- `.resources/paperclip/packages/db/src/schema/agent_task_sessions.ts:6-39` - task-scoped session persistence.
- `.resources/paperclip/packages/db/src/schema/agent_runtime_state.ts:5-27` - per-agent runtime rollup state.
- `.resources/paperclip/server/src/services/heartbeat.ts:3967-4099` - queued-run claim and gates.
- `.resources/paperclip/server/src/services/heartbeat.ts:6594-7282` - wakeup enqueue, coalescing, deferral, queued run creation.
- `.resources/paperclip/server/src/services/heartbeat.ts:7775-7807` - timer scheduler enqueue loop.
- `.resources/paperclip/server/src/services/run-liveness.ts:292-347` - liveness classifier.
- `.resources/paperclip/server/src/services/recovery/run-liveness-continuations.ts:7-188` - bounded continuation policy.
- `.resources/paperclip/server/src/routes/agents.ts:2694-3045` - wake/run/log/events/watchdog endpoints.
- `.resources/paperclip/cli/src/commands/heartbeat-run.ts:85-103` - CLI wake command.
- `.resources/paperclip/packages/mcp-server/src/tools.ts:224-608` - MCP tools over REST.

## Transferable Patterns

- Add wake coalescing and typed wake status, but not as a second queue.
- Expose runtime health and wake/run status through CLI, HTTP, UDS, and extension surfaces.
- Persist enough audit to debug wake eligibility, coalescing, and skipped wakes.
- Treat textual liveness classifications as advisory; core health should come from typed state.
- Use task-scoped session continuity ideas for future AGH task execution, but not for `HEARTBEAT.md` MVP auto-spawn.
- Escalate unsafe recovery as explicit agent-manageable work instead of silently guessing.

## Risks / Mismatches

- Paperclip's `agent_wakeup_requests` + `heartbeat_runs` dual durable model conflicts with AGH's single `task_runs` queue rule.
- Paperclip can start execution from enqueue paths; AGH scheduler must not claim or execute work.
- Mutating active-run context is risky for ACP sessions; AGH should coalesce wake intent for later turns.
- Output silence is not a sufficient liveness source for AGH because ACP streams can backpressure.
- Paperclip's issue-centric recovery does not map directly to AGH.
- MCP escape hatches are not enough for AGH lifecycle manageability; AGH needs typed UDS/HTTP/CLI/Host API operations.

## Open Questions

- Should AGH's wake audit table store skipped/coalesced reasons as append-only events, current state rows, or both?
- Which liveness states belong in core `session.health` versus future UI/watchdog classifications?
- Should manual wake return event IDs for follow-up inspection?

## Evidence

- `.resources/paperclip/server/src/onboarding-assets/ceo/HEARTBEAT.md:1-85`
- `.resources/paperclip/doc/SPEC.md:68-113`
- `.resources/paperclip/docs/guides/agent-developer/heartbeat-protocol.md:10-128`
- `.resources/paperclip/packages/db/src/schema/agent_wakeup_requests.ts:5-40`
- `.resources/paperclip/packages/db/src/schema/heartbeat_runs.ts:6-82`
- `.resources/paperclip/packages/db/src/schema/agent_task_sessions.ts:6-39`
- `.resources/paperclip/packages/db/src/schema/agent_runtime_state.ts:5-27`
- `.resources/paperclip/server/src/services/heartbeat.ts:3967-4099`
- `.resources/paperclip/server/src/services/heartbeat.ts:6594-7282`
- `.resources/paperclip/server/src/services/heartbeat.ts:7775-7807`
- `.resources/paperclip/server/src/services/run-liveness.ts:292-347`
- `.resources/paperclip/server/src/services/recovery/run-liveness-continuations.ts:7-188`
- `.resources/paperclip/server/src/routes/agents.ts:2694-3045`
- `.resources/paperclip/cli/src/commands/heartbeat-run.ts:85-103`
- `.resources/paperclip/packages/mcp-server/src/tools.ts:224-608`
