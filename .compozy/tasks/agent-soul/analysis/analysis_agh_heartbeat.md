# AGH Heartbeat Analysis

## Scope

- Path explored: local AGH repository under `internal/`, `cmd/`, `.compozy/tasks/agent-soul/`, and `docs/_memory/`.
- Topic: how an optional `HEARTBEAT.md` wake-policy artifact can fit AGH without replacing task-run lease heartbeat, session supervision, scheduler wake/sweep, synthetic prompts, detached harness reentry, or AGH Network greet presence.
- Read-only exploration: no production code was edited during analysis.

## Overview

AGH already has multiple heartbeat-like authorities with separate ownership. `HEARTBEAT.md` must not become a new umbrella heartbeat authority. It should be specified as an optional managed agent wake-policy artifact that is subordinate to runtime primitives.

The most important architectural boundary is the distinction between four concepts:

- Task Run Lease Heartbeat: token-fenced ownership renewal for `task_runs`.
- Session Activity Heartbeat: metadata-only activity while an active prompt is in flight.
- Session Presence / Health Heartbeat: metadata-only idle session health, attachability, and wake eligibility.
- Agent `HEARTBEAT.md` Wake Policy: authored wake/reentry guidance consumed by scheduler/synthetic wake decisions.

The current runtime already has task-run lease heartbeat, session activity supervision, mechanical scheduler wake/sweep, synthetic prompts, detached harness reentry, and AGH Network greet presence. The gap is an explicit idle session health/presence primitive and an authored wake-policy artifact that consumes it.

## Mechanisms / Patterns

- **Task-run lease heartbeat is authoritative ownership state:** `HeartbeatRunLease` validates caller authority and extends an active claim; the scheduler never claims.
- **Session activity heartbeat is metadata-only:** active prompt supervision updates runtime activity, emits low-cadence `runtime_progress` / `runtime_warning`, and enforces inactivity warning/timeout.
- **Scheduler is observe/sweep/wake only:** it recovers expired leases, selects eligible sessions, and sends advisory wake prompts that instruct agents to claim before doing work.
- **Synthetic prompts are already the correct delivery lane:** daemon-owned `PromptSynthetic` carries typed metadata and serializes behind active prompts.
- **Harness reentry already models bounded daemon reentry:** detached task completion can synthesize reentry through a policy-controlled bridge.
- **Network greet heartbeat is presence-only:** it advertises peer presence and must not be promoted to session/task liveness.
- **Typed hooks are required:** new integrations must use call-site-owned hooks, not a generic heartbeat event bus.

## Relevant Code Paths

- `internal/task/lease_manager.go` - `ClaimNextRun` and `HeartbeatRunLease` service boundaries.
- `internal/store/globaldb/global_db_task_claim.go` - SQLite claim serialization, lease heartbeat verification, and expired lease recovery.
- `internal/api/core/agent_tasks.go` - agent task claim and heartbeat HTTP/UDS handlers.
- `internal/cli/task.go` - `agh task heartbeat` CLI surface.
- `internal/tools/builtin/autonomy.go` - built-in task-run heartbeat tool.
- `internal/config/config.go` - `[session.supervision]` defaults and validation.
- `internal/session/prompt_activity.go` - active prompt activity supervision.
- `internal/acp/client.go` - ACP activity reporter loop.
- `internal/scheduler/doc.go` - scheduler authority as sweep/notify/recovery.
- `internal/scheduler/scheduler.go` - wake target selection and dispatch.
- `internal/daemon/scheduler_runtime.go` - synthetic scheduler wake message that does not assign ownership.
- `internal/session/synthetic_prompt.go` - daemon-owned synthetic prompt queue.
- `internal/daemon/harness_reentry_bridge.go` - detached harness synthetic reentry path.
- `internal/network/manager.go`, `internal/network/router.go`, `internal/network/peer.go` - greet heartbeat and peer presence.
- `docs/_memory/lessons/L-003-task-runs-single-queue.md` - single durable work queue lesson.
- `docs/_memory/lessons/L-005-authoritative-primitive-exclusivity.md` - exclusive primitive authority lesson.

## Transferable Patterns

- Specify `HEARTBEAT.md` as wake policy, not as liveness, lease, scheduler, or queue.
- Add or reinforce a metadata-only `session.health` / `session.liveness` primitive before using `HEARTBEAT.md` for safe wake decisions.
- Persist `agent_heartbeat_snapshots`, `agent_heartbeat_revisions`, and lightweight wake audit/state side tables; do not store queue state in JSON metadata.
- Expose policy management through CLI, HTTP, UDS, and Host API, mirroring the managed authoring direction from Agent Soul.
- Expose session health through `agh session status`, `agh session health`, and `agh session inspect`, not `agh session heartbeat`.
- Keep `ClaimNextRun` and task-run lease heartbeat untouched.

## Risks / Mismatches

- **Vocabulary collision:** "heartbeat" already means task lease renewal, active prompt activity, and network greet presence.
- **Claim bypass risk:** scheduler or wake policy must not claim, complete, fail, release, or renew task runs.
- **Hidden workflow engine risk:** parsing runnable tasks from Markdown would create an untyped scheduler.
- **Session-liveness gap:** waking a broken idle session without explicit health/presence would be unreliable.
- **Hot-path file I/O risk:** claim/lease paths must not parse `HEARTBEAT.md`.
- **Partial surface risk:** implementing only web/internal calls would violate AGH agent-manageability rules.

## Open Questions

- Which current session metadata fields are sufficient for `session.health`, and which must be added?
- Should manual `agent heartbeat wake` fail when no healthy idle session exists, or return a typed `no_eligible_session` result with diagnostics?
- Should network greet include any sanitized heartbeat summary in v1, or remain explicitly no-impact?

## Evidence

- `internal/task/lease_manager.go`
- `internal/store/globaldb/global_db_task_claim.go`
- `internal/api/core/agent_tasks.go`
- `internal/cli/task.go`
- `internal/tools/builtin/autonomy.go`
- `internal/config/config.go`
- `internal/session/prompt_activity.go`
- `internal/acp/client.go`
- `internal/scheduler/doc.go`
- `internal/scheduler/scheduler.go`
- `internal/daemon/scheduler_runtime.go`
- `internal/session/synthetic_prompt.go`
- `internal/daemon/harness_reentry_bridge.go`
- `internal/network/manager.go`
- `internal/network/router.go`
- `internal/network/peer.go`
- `docs/_memory/lessons/L-003-task-runs-single-queue.md`
- `docs/_memory/lessons/L-005-authoritative-primitive-exclusivity.md`
