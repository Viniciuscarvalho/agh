# Peer Review Incorporation - Round 1

## Decision

Initial decision: the user selected option A, incorporate all blockers from round 1.

Follow-up decision: the user selected option C and asked Codex to incorporate the relevant nits. Codex incorporated all 10 nits because each one improves execution clarity, transport parity, test specificity, or future-work traceability without changing the approved architecture.

Manual follow-up after incorporation: the user challenged the read-only extension posture and approved expanding v1 to full managed soul authoring. Codex updated the TechSpec from read-only extension observability to a managed authoring plane with CLI/HTTP/UDS/Host API write/delete/history/rollback, CAS, revision history, rollback, and explicit no-bypass invariants.

## Incorporated Items

- B-001: Added `Claim-Time Soul Provenance` semantics. `ClaimNextRun` copies already-loaded session soul provenance and performs no `SOUL.md` resolution, parsing, validation, digest computation, path traversal, or filesystem I/O.
- B-002: Defined missing load-bearing types and contracts: `ResolvedSoul`, `SoulDiagnostic`, `SoulSnapshot`, `ParseSoul`, `AssembleAgentSoulBlock`, `AgentSoulSectionPayload`, `AgentSoulPayload`, `AgentSoulValidateRequest`, and `SessionSoulRefreshRequest`.
- B-003: Bound schema work to `agh.db`, `internal/store/globaldb/global_db.go`, `globalSchemaMigrations`, version 12 `add_agent_soul_snapshots`, with inline DDL and required fresh/reopen/WAL tests.
- B-004: Added a failure-mode matrix defining missing, malformed, forbidden, oversized, path-escape, and parser-I/O behavior across validate, inspect, session creation, `ClaimNextRun`, and refresh.
- B-005: Added explicit UDS endpoint parity with route/method/request/response names and transport-parity testing requirements.
- B-006: Added `Refresh Lifetime` semantics for request-context validation, detached bounded durable mutation, session-scoped refresh/claim locking, and `409` behavior.
- N-001: Added explicit named tests for parser rejection, reserved sections, truncation, snapshot dedupe, context projection, inspect read model, transport parity, spawn soul behavior, observability redaction, and config disablement.
- N-002: Cited existing `AgentSpawnRequest` and `session.SpawnOpts` fields for `spawn_role` and `prompt_overlay`.
- N-003: Clarified that `task_runs.metadata_json` maps to Go field `task.Run.Metadata json.RawMessage`.
- N-004: Added observability redaction requirements and existing `internal/logger` / `internal/observe` surfaces.
- N-005: Added rationale for `max_body_bytes` and `context_projection_bytes`, anchored to bounded prompt-injection evidence.
- N-006: Added Web/Docs Impact subitems to each implementation step.
- N-007: Named Host API method `agents/soul/get` and hook payload fields `SoulSnapshotID`, `SoulDigest`, and `ParentSoulDigest`.
- N-008: Added `--json` and `--workspace` requirements for all soul CLI verbs.
- N-009: Anchored deferred heartbeat work to future slug `agent-heartbeat`.
- N-010: Added `parent_soul_digest` as spawned-session lineage/provenance metadata.
- Manual-001: Replaced read-only extension posture with full managed authoring v1.
- Manual-002: Added `agent_soul_revisions`, authoring DTOs, mutation endpoints, Host API write/delete/history/rollback actions, CAS invariants, authoring tests, and ADR-006.

## Deferred Items

- None from round 1. All blockers and all nits were incorporated.

## Files Changed

- `.compozy/tasks/agent-soul/_techspec_soul.md`
- `.compozy/tasks/agent-soul/adrs/adr-001.md`
- `.compozy/tasks/agent-soul/adrs/adr-002.md`
- `.compozy/tasks/agent-soul/adrs/adr-003.md`
- `.compozy/tasks/agent-soul/adrs/adr-004.md`
- `.compozy/tasks/agent-soul/adrs/adr-005.md`
- `.compozy/tasks/agent-soul/adrs/adr-006.md`
- `.compozy/tasks/agent-soul/qa/peer-review-incorporation-round1.md`

## Files Not Changed

- No round 1 ADR files remain intentionally unchanged after nit incorporation.
