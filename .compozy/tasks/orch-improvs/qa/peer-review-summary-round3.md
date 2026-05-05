# Peer Review Summary - Round 3

## Verdict

`NEEDS_REWORK`

## Counts

- Blockers: 6
- Nits: 10

## Summary

Opus found the aggregate split, ADR posture, authority invariants, profile typing, and post-terminal review-gate model sound. The review still blocks task generation because the round-3 additions leave six load-bearing gaps that would force implementers to invent schema, binding, transaction, wake, or policy-enforcement behavior.

## Blockers

### B-001 - Continuation-run schema has no typed home

The review-gate spec requires continuation metadata (`parent_run_id`, `review_id`, `review_round`, `continuation_reason`, `missing_work`, `next_round_guidance`) but no child spec adds typed `task_runs` columns or a side table for it. This conflicts with ADR-002/ADR-009 and the no-operational-state-in-JSON rule.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/_techspec_orchestration.md`
- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-009-review-verdicts-and-continuation-guidance-are-typed-task-state.md`

### B-002 - Reviewer session binding is under-specified

The spec says `submit_run_review` is available only to reviewer sessions bound to a review request, but it does not define a schema, session-start contract, or lookup primitive comparable to session-bound lease lookup.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/adrs/adr-007-review-gate-post-terminal-continuation-loop.md`
- `.compozy/tasks/orch-improvs/adrs/adr-009-review-verdicts-and-continuation-guidance-are-typed-task-state.md`

### B-003 - Coordinator review wake mechanism is not explicit

The review lifecycle says the coordinator observes `task.run_review_requested`, but it does not specify the typed hook/call-site dispatch mechanism. Opus flagged this because implementers could tail `task_events` or `task_run_reviews`, which the architecture rules forbid.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/adrs/adr-001-orchestration-hardening-extends-existing-autonomy.md`
- `.compozy/tasks/orch-improvs/adrs/adr-008-review-routing-uses-channels-without-channel-authority.md`

### B-004 - `RecordRunReview` and continuation enqueue atomicity is undefined

Rejected verdict persistence and continuation-run enqueue must be one transaction or have explicit compensating idempotency. The current spec covers verdict replay but not the combined verdict+continuation side effect.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/_techspec_orchestration.md`
- `.compozy/tasks/orch-improvs/adrs/adr-007-review-gate-post-terminal-continuation-loop.md`
- `.compozy/tasks/orch-improvs/adrs/adr-009-review-verdicts-and-continuation-guidance-are-typed-task-state.md`

### B-005 - `ParticipantPolicy` has no pinned enforcement surface

The specs say `ParticipantPolicy` constrains coordination but is non-authoritative. They do not name which runtime call sites consume `Allowed*` / `Preferred*` fields or what deterministic error happens when routing violates policy.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/_techspec_orchestration.md`
- `.compozy/tasks/orch-improvs/adrs/adr-010-task-execution-profiles-are-typed-overlays.md`

### B-006 - Review-request transaction boundary is ambiguous

The review lifecycle allows review-request creation either in the same terminal-run transaction or a follow-up idempotent transaction. Opus flagged this as a coin-flip that changes recovery, hooks, and tests.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/adrs/adr-007-review-gate-post-terminal-continuation-loop.md`

## Nits

- N-001: Restate `requires_review_request` bundled-skill loader support in review-gate implementation steps.
- N-002: Decouple `SchedulerHealthSample.NotificationLag` from notification cursor ownership, or document the narrow reader interface.
- N-003: Specify profile-vs-run-field precedence for continuation runs.
- N-004: Make `delivery_id` required for `submit_run_review` idempotency.
- N-005: Enumerate `allow_original_worker = false` routing validation against the reviewed run's original worker identity.
- N-006: Add a mapping table for profile scalar fields vs `task_profile_*` side-table rows by role.
- N-007: Sync aggregate hook surface matrix with child review events, including `task.run_review_routed`.
- N-008: Add tests for multi-round `parent_review_id` lineage and monotonic `tasks.review_round`.
- N-009: Add `internal/api/contract` to review-gate boundaries and aggregate ownership surfaces.
- N-010: Define bridge terminal notifier behavior when replayed terminal event and current task-state recheck disagree.

## Artifacts

- Prompt: `.compozy/tasks/orch-improvs/qa/peer-review-prompt-round3.md`
- Raw Compozy event stream: `.compozy/tasks/orch-improvs/qa/peer-review-result-round3.json`
- Extracted strict JSON: `.compozy/tasks/orch-improvs/qa/peer-review-result-round3-extracted.json`
- Stderr: `.compozy/tasks/orch-improvs/qa/peer-review-result-round3.err`

## Validation

- All three TechSpecs pass the required marker check.
- Extracted strict JSON parses with readiness `NEEDS_REWORK`, 6 blockers, and 10 nits.
- Code fences are balanced across the TechSpecs and this summary.
- `make verify` completed successfully after retry.
