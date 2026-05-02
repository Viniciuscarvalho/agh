# Hermes Heartbeat Analysis

## Scope

- Path explored: `.resources/hermes/`
- Topic: liveness, activity timeout, scheduler tick/wake, durable run heartbeat, and agent/operator manageability patterns relevant to AGH Heartbeat TechSpec.
- Read-only exploration: no files were edited, created, or deleted.

## Overview

Hermes does not provide a direct `HEARTBEAT.md` wake-policy artifact equivalent. Its relevant heartbeat design lives in runtime activity tracking, gateway/cron inactivity supervision, scheduler tick/wake behavior, and SQLite-backed Kanban task-run heartbeat.

The strongest transferable lesson is separation: cheap activity/liveness signals are distinct from user-visible progress, durable run heartbeat belongs to the run/task state machine, and scheduler/tick logic should not bypass claim ownership.

## Mechanisms / Patterns

- **Agent-local activity clock:** active API/tool/delegation operations update in-memory activity fields consumed by inactivity monitors.
- **Inactivity timeout over wall-clock timeout:** monitors interrupt only after no activity for a configured threshold.
- **Provider stale detection is separate:** provider stream staleness does not equal worker heartbeat.
- **Tool subprocess activity callbacks:** long-running tools update activity without writing into the model stream.
- **Delegation heartbeat:** parent receives activity touches from child work with stale-child checks.
- **Scheduler tick/wake loop:** cron tick finds due jobs and runs them, but this model must not be copied directly into AGH.
- **Durable Kanban heartbeat:** `task_runs` carries claim, PID, runtime cap, `last_heartbeat_at`, and outcome.
- **Agent-manageable surfaces:** cron and Kanban heartbeat are available through CLI and model-facing tools.
- **Progress is decoupled and throttled:** progress delivery uses side channels rather than blocking core execution.

## Relevant Code Paths

- `.resources/hermes/run_agent.py:1248-1255` - initializes agent activity fields.
- `.resources/hermes/run_agent.py:4518-4568` - activity touch and summary APIs.
- `.resources/hermes/run_agent.py:6364-6428` - non-streaming stale-call timeout and activity touch.
- `.resources/hermes/run_agent.py:6678-6768` - streaming chunks reset stale timers and touch activity.
- `.resources/hermes/run_agent.py:7271-7350` - streaming heartbeat while waiting for chunks.
- `.resources/hermes/run_agent.py:9436-9685` - concurrent tool execution activity callbacks.
- `.resources/hermes/gateway/run.py:12937-13102` - gateway inactivity timeout monitor.
- `.resources/hermes/cron/scheduler.py:1059-1145` - cron inactivity timeout monitor.
- `.resources/hermes/cron/scheduler.py:1258-1416` - scheduler tick and due-job sweep.
- `.resources/hermes/hermes_cli/kanban_db.py:305-330` - `task_runs` schema with heartbeat columns.
- `.resources/hermes/hermes_cli/kanban_db.py:1183-1300` - claim and claim heartbeat extension.
- `.resources/hermes/hermes_cli/kanban_db.py:1666-1702` - worker heartbeat event and `last_heartbeat_at` update.
- `.resources/hermes/tools/kanban_tools.py:216-237` - model-facing heartbeat operation.
- `.resources/hermes/hermes_cli/kanban.py:574-580` - CLI heartbeat surface.
- `.resources/hermes/gateway/run.py:11708-11920` - queued/throttled progress delivery.

## Transferable Patterns

- Keep active prompt activity metadata-only and decoupled from ACP/user-visible progress.
- Persist durable run heartbeat on `task_runs`, not in side JSON files.
- Keep claim heartbeat owned by the claimer.
- Use diagnostic activity context for timeout and health reporting.
- Expose heartbeat/health status through CLI and model/agent-operable surfaces.
- Do not copy Hermes cron JSON/tick execution as an AGH work queue.

## Risks / Mismatches

- Hermes has no authored `HEARTBEAT.md`; its durable heartbeat design maps to task-run lease heartbeat, not wake policy.
- Hermes cron directly executes due jobs; AGH scheduler must remain sweep/wake only.
- In-memory activity is insufficient for AGH's cross-surface session health needs.
- Generic string hooks in Hermes conflict with AGH's typed call-site hook rule.
- PID liveness is host-local and cannot be the only health source.

## Open Questions

- Which active prompt activity fields should AGH expose in `session.health`?
- Should AGH add `last_presence_at` separately from `last_activity_at`?
- Should session health include provider/tool phase diagnostics, or keep that as optional detail in `inspect` only?

## Evidence

- `.resources/hermes/run_agent.py:1248-1255`
- `.resources/hermes/run_agent.py:4518-4568`
- `.resources/hermes/run_agent.py:6364-6428`
- `.resources/hermes/run_agent.py:6678-6768`
- `.resources/hermes/run_agent.py:7271-7350`
- `.resources/hermes/run_agent.py:9436-9685`
- `.resources/hermes/gateway/run.py:12937-13102`
- `.resources/hermes/cron/scheduler.py:1059-1145`
- `.resources/hermes/cron/scheduler.py:1258-1416`
- `.resources/hermes/hermes_cli/kanban_db.py:305-330`
- `.resources/hermes/hermes_cli/kanban_db.py:1183-1300`
- `.resources/hermes/hermes_cli/kanban_db.py:1666-1702`
- `.resources/hermes/tools/kanban_tools.py:216-237`
- `.resources/hermes/hermes_cli/kanban.py:574-580`
- `.resources/hermes/gateway/run.py:11708-11920`
