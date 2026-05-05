# Peer Review Incorporation - Round 3

## Source

- Review prompt: `.compozy/tasks/orch-improvs/qa/peer-review-prompt-round3.md`
- Review result: `.compozy/tasks/orch-improvs/qa/peer-review-result-round3-extracted.json`
- Review summary: `.compozy/tasks/orch-improvs/qa/peer-review-summary-round3.md`

## User Decision

Incorporate all blockers `B-001` through `B-006`.

Incorporate nits `N-001`, `N-003`, `N-004`, `N-005`, `N-007`, `N-008`, `N-009`, and `N-010`.

Defer nits `N-002` and `N-006`.

## Incorporated Blockers

### B-001 - Continuation-run schema has no typed home

Added typed review trigger and continuation-run state to `task_runs`:

- `review_required`
- `review_request_round`
- `review_policy_snapshot`
- `parent_run_id`
- `review_id`
- `review_round`
- `continuation_reason`
- `missing_work_json`
- `next_round_guidance`

The specs now require indexes for parent run lookup, unique continuation lookup by `review_id`, review-round lookup, and recovery lookup for terminal runs that require a review request. The guidance list remains bounded canonical JSON only because it is an ordered list, not a query dimension; all source, round, reason, and recovery fields are typed columns.

### B-002 - Reviewer session binding is under-specified

Added explicit reviewer-session binding semantics:

- `BindRunReviewSession`
- `LookupReviewForSession`
- `RunReviewBinding`
- unique active binding index on `reviewer_session_id`
- native tool visibility gated by active review binding
- `metadata.agh.requires_review_request` loader behavior for `agh-task-reviewer`

The native `submit_run_review` tool is now available only to sessions with an active review binding, coordinator sessions that were explicitly routed and bound as reviewer, or privileged operator/debug contexts.

### B-003 - Coordinator review wake mechanism is not explicit

Added the typed `ReviewRouter.OnRunReviewRequested` wake callback. `internal/daemon` wires it at composition root after the review request row and task event are durable. The coordinator must read persisted review state through task-service APIs before routing.

The specs now forbid tailing `task_events`, polling `task_run_reviews`, or parsing channel messages as the primary review wake mechanism. Daemon startup recovery may ask `task.Service` for still-requested reviews through a bounded recovery query.

### B-004 - `RecordRunReview` and continuation enqueue atomicity is undefined

Specified that `RecordRunReview` runs in one `BEGIN IMMEDIATE` transaction. For rejected verdicts while rounds remain, that transaction:

- persists the verdict;
- increments `tasks.review_round`;
- updates task review rollups;
- creates one continuation `task_runs` row with typed continuation columns;
- writes `task.run_review_recorded`, `task.run_review_rejected`, and `task.run_review_retry_enqueued` events.

Idempotent replay now returns the existing continuation via `task_runs.review_id = review_id` and never enqueues a duplicate.

### B-005 - `ParticipantPolicy` has no pinned enforcement surface

Pinned `ParticipantPolicy` enforcement to concrete call sites:

- task profile validation;
- coordinator routing;
- worker claim filters;
- safe-spawn and session-start grant narrowing;
- review routing;
- network/bridge membership checks as the actual permission layer.

Violations return deterministic profile/routing errors. The policy can narrow eligibility, but it cannot grant channel, peer, task, review, or terminal-state authority.

### B-006 - Review-request transaction boundary is ambiguous

Chose a follow-up review-request transaction after terminal run commit. The terminal transaction writes review trigger fields on `task_runs`; the follow-up request path is idempotent on `(run_id, review_round)`.

Crash recovery after terminal commit but before review request creation now uses `task_runs.review_required = 1` and `review_request_round` to re-run the same task-service request path.

## Incorporated Nits

### N-001 - Restate `requires_review_request` loader support

Restated bundled-skill loader support for `metadata.agh.requires_review_request` in review-gate implementation steps, native tool authorization, and ADR-006's existing loader decision.

### N-003 - Profile-vs-run-field precedence for continuation runs

Added explicit continuation-run precedence:

1. current task `TaskExecutionProfile` at continuation enqueue time;
2. copied reviewed-run native fields only when profile selectors are empty;
3. continuation columns as context/lineage only;
4. workspace defaults only after profile/run-native fields resolve to inherit or empty.

### N-004 - Make `delivery_id` required

Made `delivery_id` required for `RunReviewVerdict`, `RecordRunReview` idempotency, and the `submit_run_review` tool input schema.

### N-005 - Validate `allow_original_worker = false`

Added original-worker exclusion validation against reviewer session id, agent name, peer id, and actor identity. Routing fails closed when the original worker identity cannot be determined and self-review is not explicitly allowed.

### N-007 - Sync aggregate hook surface matrix

Added `task.run_review_routed` to the aggregate hook surface matrix.

### N-008 - Multi-round lineage and monotonic round tests

Added tests for `parent_review_id` lineage, monotonic `tasks.review_round`, and rejected-verdict replay returning the existing continuation run.

### N-009 - Add `internal/api/contract`

Added `internal/api/contract` to review-gate architectural boundaries and aggregate component ownership as the owner of OpenAPI/generated DTO shapes.

### N-010 - Bridge terminal notifier mismatch behavior

Defined fail-closed behavior when a replayed terminal event and current task-state recheck disagree:

- no delivery;
- no cursor advance;
- bounded `last_error`;
- `notification.terminal_state_mismatch` observe/log event;
- recovery through cursor `Reset` or task-service repair.

## Deferred

- `N-002`: Scheduler notification lag reader interface remains deferred.
- `N-006`: Profile scalar vs side-table mapping table remains deferred.

## Files Updated

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/_techspec_orchestration.md`
- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-003-shared-durable-notification-cursors.md`
- `.compozy/tasks/orch-improvs/adrs/adr-007-review-gate-post-terminal-continuation-loop.md`
- `.compozy/tasks/orch-improvs/adrs/adr-008-review-routing-uses-channels-without-channel-authority.md`
- `.compozy/tasks/orch-improvs/adrs/adr-009-review-verdicts-and-continuation-guidance-are-typed-task-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-010-task-execution-profiles-are-typed-overlays.md`

## Validation

- All three TechSpecs pass the required six-marker check.
- Code fences are balanced across the aggregate TechSpec, child TechSpecs, ADRs, and this incorporation record.
- Targeted marker grep found the incorporated round-3 findings: review trigger/continuation fields, reviewer-session binding, `ReviewRouter`, `BEGIN IMMEDIATE`, `task_runs.review_id` replay, `ParticipantPolicy` enforcement, `requires_review_request`, required `delivery_id`, original-worker exclusion, `task.run_review_routed`, `parent_review_id`, `internal/api/contract`, and terminal notification mismatch handling.
- `make verify` completed successfully.
