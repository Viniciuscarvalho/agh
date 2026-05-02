# Heartbeat TechSpec Peer Review - Round 2 Incorporation

## Decision

User selected option A: incorporate all blockers and all relevant nits from round 2.

## Incorporated Blockers

- `B-001`: Locked Heartbeat to global DB migration v13, made `session_health` a standalone table, added canonical DDL, FKs, indexes, and lifecycle rules.
- `B-002`: Added request/response DTOs for managed authoring, status, history, wake, and CAS. Standardized CAS on body field `expected_digest`; HTTP `If-Match` headers are rejected.
- `B-003`: Added Go interface signatures and payload structs for resolver, authoring, snapshot store, session health, scheduler gate, wake service, and synthetic prompt metadata.
- `B-004`: Removed explicit refresh as an MVP operation. Wake decisions evaluate the latest valid snapshot at wake-decision time.
- `B-005`: Added session-scoped prompt-gate serialization and deterministic `session_prompt_active_race` behavior.
- `B-006`: Added row lifecycle, retention, FK, cleanup, rollback, and restart behavior for snapshots, revisions, wake state/events, and session health.
- `B-007`: Added fresh DB/reopen-after-restart schema tests, race/coalescing tests, zero file-I/O task lease tests, wake-table writer boundary tests, `make codegen-check`, `make cli-docs`, and focused `-race` verification.
- `B-008`: Defined digest construction and active-hours / quiet-window resolution semantics, including timezone, DST, clamping, diagnostics, and wake-time evaluation.

## Incorporated Nits

- `N-001`: Added references to L-003, L-005, and L-008.
- `N-002`: Added explicit `Delete Targets`.
- `N-003`: Added ADR-005 boundary closure to the Executive Summary.
- `N-004`: Bounded `session.health.update.after` to state/health/eligibility transitions with cadence coalescing.
- `N-005`: Made Web/Docs impact binary: generated web types and contract tests only in MVP; no user-facing UI.
- `N-006`: Made wake `last_reason` a closed deterministic enum.
- `N-007`: Added `agent_heartbeat_wake.evaluate_duration` histogram.
- `N-008`: Added synthetic prompt text stating wake grants no claim token and agents must call `agh task next`.

## Deferred Items

None from round 2.

## Files Changed

- `.compozy/tasks/agent-soul/_techspec_heartbeat.md`
- `.compozy/tasks/agent-soul/adrs/adr-008.md`
- `.compozy/tasks/agent-soul/adrs/adr-009.md`
- `.compozy/tasks/agent-soul/adrs/adr-010.md`
- `.compozy/tasks/agent-soul/adrs/adr-011.md`
- `.compozy/tasks/agent-soul/qa/peer-review-incorporation-round2.md`

## Validation

- `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/agent-soul/_techspec_heartbeat.md` passed.
- `rg` coverage confirmed migration v13, standalone `session_health`, DTO/CAS, core interfaces, no-refresh model, prompt-gate race handling, lifecycle/retention, tests, Web/Docs impact, metrics, and lesson references.
- ASCII check across changed Heartbeat spec/ADR/incorporation files found no non-ASCII bytes.
- `make verify` passed after incorporation.
