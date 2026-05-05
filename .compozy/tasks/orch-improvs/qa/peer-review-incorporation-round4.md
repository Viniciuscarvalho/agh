# Peer Review Incorporation - Round 4

## Decision

User selected option A: incorporate every round 4 finding.

## Incorporated Findings

- `B-001`: Pinned migration ownership for `task_runs` review trigger and continuation columns to the review-gate migration. The review-gate migration now owns `task_run_reviews`, `task_runs.review_request_id`, `task_runs.review_id`, and the related FKs in the same numbered migration. The orchestration child now cross-references those fields instead of claiming migration ownership.
- `B-002`: Reworked bridge terminal notification replay so review-gated run terminal events are deferred or superseded instead of treated as mismatches. Final bridge delivery now waits for an accepted-final terminal event such as `task.run_review_approved`.
- `N-001`: Added effective reviewer selector precedence between `ReviewPolicy.ReviewerSelector`, `TaskExecutionProfile.Review.Selector`, top-level `ReviewProfile` fields, route requests, and `ParticipantPolicy`.
- `N-002`: Added `task_runs.review_request_id` and specified that the follow-up review-request transaction clears `review_required` and writes the review id in the same transaction.
- `N-003`: Specified retry attempt row semantics: each retry inserts a new `task_run_reviews` row with incremented `attempt` after the prior attempt is terminal.
- `N-004`: Named original-worker exclusion source columns on `task_runs`, including claimed and terminalized session/agent/peer/actor fields.
- `N-005`: Removed the vague native-tool `operator/debug contexts with permission` bypass. Operator submission, when allowed, goes through explicit API/UDS/CLI verdict surfaces with server-derived operator actor authorization.
- `N-006`: Added SQL-level uniqueness for review attempts through unique `(run_id, review_round, attempt)`.

## Deferred Findings

None.

## Files Changed

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

- Specs, ADRs, and this incorporation record have balanced Markdown code fences.
- Extracted round 4 peer-review JSON parses with `python3 -m json.tool`.
- Required TechSpec quality markers are present across the aggregate, orchestration child, and review-gate child specs.
- Stale round 4 ambiguity strings are absent from normative specs and ADRs.
- Target round 4 markers are present for review-gate migration ownership, `review_request_id`, unique review attempts, selector precedence, original-worker source columns, native-tool bypass removal, bridge accepted-final delivery, and deferred/superseded review-gated terminal events.
- Full monorepo verification is run after this incorporation record update and reported in the final response.
