# Peer Review Incorporation - Round 2

## Source

- Review prompt: `.compozy/tasks/orch-improvs/qa/peer-review-prompt-round2.md`
- Review result: `.compozy/tasks/orch-improvs/qa/peer-review-result-round2-extracted.json`
- Review summary: `.compozy/tasks/orch-improvs/qa/peer-review-summary-round2.md`

## User Decision

Incorporate all blockers `B-001` through `B-007`.

Incorporate nits `N-001`, `N-002`, `N-003`, `N-004`, `N-006`, `N-007`, `N-008`, `N-009`, and `N-010`.

Leave `N-005` optional/deferred.

Additional user decision for `B-004`:

> `internal/notifications` is a durable cursor primitive only.
> It does not own task authority, hook dispatch, queue semantics, or event fan-out policy.
> The first concrete MVP consumer is bridge-delivered terminal task notifications owned by `internal/bridges`.

## Incorporated Findings

### B-001 - Task-level terminal mutation against active runs

Updated the TechSpec and ADRs to make `POST /api/tasks/:id/complete` and `POST /api/tasks/:id/fail` operator-only task-level endpoints. They reject any active non-terminal token-fenced run with a protected-active-run conflict and do not stop the session, write terminal state, insert a synthetic run, or mutate `current_run_id`.

### B-002 - Synthetic terminal run concurrency

Added a synthetic terminal concurrency contract requiring `BEGIN IMMEDIATE`, a no-active-run guard, task-status compare-and-set, attempt allocation inside the transaction, and idempotent reads for later concurrent terminal requests.

### B-003 - Spawn circuit breaker claim filtering

Added the `ClaimNextRun` filter/index/transaction design. The claim query joins `tasks`, excludes blocked/circuit-open tasks, uses an explicit index strategy, opens the circuit inside `IncrementSpawnFailure`, and resets breaker state durably in `AttachRunSession` after a successful task session attach.

### B-004 - Notification primitive with a concrete MVP consumer

Kept `internal/notifications` in MVP as a durable cursor primitive only and added the first concrete consumer in `internal/bridges`: a task terminal bridge notifier.

Added:

- `bridge_task_subscriptions` as the bridge-owned target table.
- Cursor identity `consumer_id = "bridge_task_subscription:<subscription_id>"`, `stream_name = "task_events"`, and `subject_id = <task_id>`.
- A durable replay flow that reads `task_events` by `event_seq`, filters terminal task events, reloads current task state, delivers through `bridges/deliver`, and advances the cursor only after confirmed success.
- The rule that hook or `EventObserver` wake-up is only a nudge; replay authority remains durable `task_events.event_seq`.
- The rule that this notifier is one-shot terminal delivery and must not use prompt/session `DeliveryBroker` as its primary consumer path.
- The terminal notification envelope with deterministic `delivery_id`, `event_type = "final"`, `final = true`, and numeric `seq = task_events.event_seq`.
- MVP API surface: `POST /api/tasks/:id/notifications/bridges`, `GET /api/tasks/:id/notifications/bridges`, and `DELETE /api/tasks/:id/notifications/bridges/:subscription_id`.

### B-005 - Spawn failure observer/reset call sites

Specified that `internal/session.Manager` classifies task-session spawn failures, calls `task.Service.IncrementSpawnFailure` after classification, and resets counters through `AttachRunSession` only after successful task session attach. Claim alone no longer resets the breaker.

### B-006 - Public `MaintainCurrentRunID` misuse surface

Removed the public projection-maintenance interface from the TechSpec. The projection helper shape is documented only as an internal unexported helper inside `internal/task`, and boundary tests must fail if scheduler, coordinator, API, bridge, notification, extension, or web-facing code imports or calls it directly.

### B-007 - Task-level endpoint authorization

Added explicit operator-only authorization language and transport parity expectations for task-level complete/fail endpoints. Session actors must use `/api/agent/tasks/:run_id/complete|fail`, which resolves the active lease through session-bound lookup.

## Incorporated Nits

### N-001 - `OrchestrationManager` is logical decomposition

Clarified that `OrchestrationManager` is a logical decomposition of the existing `task.Manager` / `task.Service` implementation, not a second service struct, second queue authority, or second daemon composition-root dependency.

### N-002 - Idempotent replay needs `last_delivery_id`

Added `last_delivery_id` to `notification_cursors`, `Cursor`, and observability fields. `Advance` may accept idempotent replay only when both `last_sequence` and `delivery_id` match the last confirmed cursor state.

### N-003 - Scheduler events are observe events only

Clarified that `scheduler.*` signals are `internal/observe` typed events and this TechSpec does not introduce a scheduler hook taxonomy.

### N-004 - HTTP/UDS parity matrix

Added an explicit HTTP/UDS parity matrix for task-level terminal endpoints, bridge notification subscription endpoints, run-level terminal endpoints, agent terminal endpoints, agent context, and dashboard health.

### N-006 - Loader-side `requires_active_task_claim`

Added an implementation dependency requiring bundled skill loader support for `metadata.agh.always_load.requires_active_task_claim` if it does not already exist.

### N-007 - Max watchdog duration

Pinned the maximum configured runtime watchdog duration to `24h` and required config validation to reject larger values.

### N-008 - Full max-runtime managed-stop/race test

Added integration coverage for the sequence: request stop, grace expiry, force stop, terminal write, projection clear, plus a race where the worker sends `CompleteRunLease` after stop request but before terminal write.

### N-009 - `Last-Event-ID` precedence

Specified that `Last-Event-ID` takes precedence over `?after_sequence` on SSE reconnect, while first-open uses `?after_sequence` seeded from `latest_event_seq`.

### N-010 - Delete/replace targets

Expanded delete/replace targets for active task-level force-close behavior, exported current-run projection maintenance APIs, bridge-specific cursor side-state, and terminal task notification paths that try to use prompt/session `DeliveryBroker`.

## Deferred

- `N-005` remains optional/deferred. The TechSpec keeps example CLI task-level terminal names, but no extra mandatory rename work was added for this nit.

## Files Updated

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/adrs/adr-001-orchestration-hardening-extends-existing-autonomy.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-003-shared-durable-notification-cursors.md`
- `.compozy/tasks/orch-improvs/adrs/adr-004-minimal-task-orchestration-config.md`
- `.compozy/tasks/orch-improvs/adrs/adr-005-current-run-id-denormalized-projection.md`
- `.compozy/tasks/orch-improvs/adrs/adr-006-bundled-orchestration-skills-are-instructional.md`

## Validation

- Verified TechSpec and ADR fenced code blocks are balanced.
- Verified round 2 markers are present for active-run rejection, synthetic terminal concurrency, spawn-circuit claim filtering, bridge terminal notifications, `last_delivery_id`, HTTP/UDS parity matrix, scheduler observe-only events, `requires_active_task_claim`, `24h` watchdog validation, `Last-Event-ID` precedence, and delete/replace targets.
- Did not run `make verify`; this is still a spec-review workflow decision point, not an implementation completion point.
