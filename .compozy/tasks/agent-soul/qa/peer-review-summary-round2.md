# Heartbeat TechSpec Peer Review - Round 2 Summary

## Scope

- Reviewed spec: `.compozy/tasks/agent-soul/_techspec_heartbeat.md`
- Review prompt: `.compozy/tasks/agent-soul/qa/peer-review-prompt-round2.md`
- Raw result: `.compozy/tasks/agent-soul/qa/peer-review-result-round2.json`
- Extracted message: `.compozy/tasks/agent-soul/qa/peer-review-message-round2.md`
- Parsed JSON: `.compozy/tasks/agent-soul/qa/peer-review-parsed-round2.json`

## Verdict

- Readiness: `NEEDS_REWORK`
- Blockers: 8
- Nits: 8
- Spec/ADR changes applied from this review: none yet

## Summary

The reviewer agrees with the core architecture: `HEARTBEAT.md` remains advisory wake policy, `task_runs` / `ClaimNextRun` stay authoritative, wake tables are not queues, managed authoring mirrors Soul, and ADR-005's deferral boundary is honored.

The review blocks approval because several implementation-critical details remain prose-only or ambiguous: schema migration shape, CAS DTOs, service interfaces, explicit refresh semantics, race serialization, table lifecycle, verification coverage, active-hours resolution, and digest construction.

## Blockers

- `B-001`: Lock the heartbeat migration number, declare `session_health` as a standalone table, paste DDL, and remove ambiguous "fields or table" wording.
- `B-002`: Define CAS DTOs and transport parity for heartbeat PUT/DELETE/rollback/status/wake operations.
- `B-003`: Paste Go interfaces for authoring, snapshot store, session health, scheduler integration, and synthetic prompt enqueue.
- `B-004`: Decide whether explicit heartbeat refresh is a managed surface or remove refresh from the flow and evaluate policy at wake time.
- `B-005`: Specify serialization between wake eligibility evaluation and synthetic prompt enqueue.
- `B-006`: Define lifecycle, retention, FK, cleanup, and restart behavior for wake state/events and session health rows.
- `B-007`: Add schema restart tests, race/coalescing tests, zero file-I/O tests for task lease paths, boundary tests for wake table writers, `make codegen-check`, and CLI docs regeneration.
- `B-008`: Define active-hours / quiet-window resolution and the heartbeat digest algorithm.

## Nits

- `N-001`: Cite load-bearing lessons L-003, L-005, and L-008.
- `N-002`: Add explicit `Delete Targets`.
- `N-003`: Explicitly close ADR-005's Heartbeat deferral boundary.
- `N-004`: Bound `session.health.update.after` hook dispatch frequency.
- `N-005`: Make Web/Docs impact a binary decision, not conditional wording.
- `N-006`: Make `last_reason` a closed enum, not free text.
- `N-007`: Add `agent_heartbeat_wake.evaluate_duration` histogram.
- `N-008`: Add synthetic prompt text stating wake grants no claim token and agents must call `agh task next`.

## Recommendation

Incorporate all blockers. The nits are small, relevant, and should also be incorporated because they strengthen SD-011 manageability, L-006 hard-cut clarity, and operational observability without changing the agreed MVP boundary.
