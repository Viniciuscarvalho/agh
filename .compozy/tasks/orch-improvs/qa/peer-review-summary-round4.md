# Peer Review Summary - Round 4

## Verdict

`NEEDS_REWORK`

## Counts

- Blockers: 2
- Nits: 6

## Summary

Opus found that round 3 closed the six prior load-bearing gaps: continuation columns, reviewer-session binding, `ReviewRouter` wake, `RecordRunReview` atomicity, `ParticipantPolicy` enforcement, and the follow-up request transaction.

The spec still blocks task generation because two new contradictions surfaced: migration ownership/FK ordering for `task_runs` continuation columns, and bridge terminal notifier fail-closed behavior conflicting with the review-rejected continuation happy path.

## Blockers

### B-001 - `task_runs` continuation-column migration ownership conflicts

The orchestration child and review-gate child both claim ownership of the `task_runs` review trigger / continuation columns. The orchestration child says they belong in the task-run migration family, while the aggregate step 9 says review-gate migrations include continuation columns.

This creates an FK ordering hazard because `task_runs.review_id` references `task_run_reviews(review_id)`, but `task_run_reviews` is created by the review-gate migration. Implementers would have to invent ordering, drop the FK, or duplicate migrations.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/_techspec_orchestration.md`
- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-009-review-verdicts-and-continuation-guidance-are-typed-task-state.md`

Recommended direction: make the review-gate migration create `task_run_reviews` and the `task_runs` review trigger / continuation columns plus FKs in one numbered migration. Remove those columns from orchestration child ownership, keeping only a cross-reference there.

### B-002 - Bridge terminal notifier fail-closed rule contradicts review continuations

The bridge terminal notifier still filters run-level terminal events and then rechecks whether the task is terminal. Under review gate, a run can be terminal while the task is still in review or queued for continuation. The round-3 fail-closed rule would classify that valid state as `notification.terminal_state_mismatch`, stall the cursor, and prevent the documented happy path from reaching final bridge notification after review approval.

Likely affected files:

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/_techspec_orchestration.md`
- `.compozy/tasks/orch-improvs/_techspec_review_gate.md`
- `.compozy/tasks/orch-improvs/adrs/adr-003-shared-durable-notification-cursors.md`
- `.compozy/tasks/orch-improvs/adrs/adr-007-review-gate-post-terminal-continuation-loop.md`

Recommended direction: split the notifier recheck into three states:

1. Terminal event and current task terminal state agree: deliver and advance cursor.
2. Run terminal event but task is non-terminal because review/continuation is still active: skip without delivery and without cursor advance, no mismatch event.
3. Replayed terminal event contradicts a terminal current task state: fail closed with `notification.terminal_state_mismatch`.

## Nits

- N-001: `ReviewProfile` and `ReviewerSelector` duplicate scalar fields without a clear effective-selector precedence rule.
- N-002: `review_required` is set for recovery, but the spec does not say when it is cleared after review-request creation.
- N-003: Reviewer retry attempts need a clear row model: new row per attempt vs. updating the same row.
- N-004: Original-worker exclusion needs named source columns on `task_runs` for terminalizing session/agent/peer metadata.
- N-005: `operator/debug contexts with permission` for `submit_run_review` is too vague and could become a binding bypass.
- N-006: Idempotent `(run_id, review_round)` review-request creation lacks a SQL-level uniqueness invariant.

## Artifacts

- Prompt: `.compozy/tasks/orch-improvs/qa/peer-review-prompt-round4.md`
- Raw Compozy event stream: `.compozy/tasks/orch-improvs/qa/peer-review-result-round4.json`
- Extracted strict JSON: `.compozy/tasks/orch-improvs/qa/peer-review-result-round4-extracted.json`
- Stderr: `.compozy/tasks/orch-improvs/qa/peer-review-result-round4.err`

## Validation

- Extracted strict JSON parses successfully with `python3 -m json.tool`.
- Round 4 prompt and summary code fences are balanced.
- Round 4 stderr is empty.
- `_techspec.md`, `_techspec_orchestration.md`, and `_techspec_review_gate.md` still contain the required TechSpec quality markers.
- Initial `make verify` failed once because `@agh/extension-sdk` integration test `src/integration.test.ts` timed out at 30s.
- Rerun `make verify` completed successfully.
