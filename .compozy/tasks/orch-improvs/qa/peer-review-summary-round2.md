# Peer Review Summary - Round 2

## Verdict

Readiness: `NEEDS_REWORK`

The review says the overall architecture is sound: hardening the existing autonomy substrate, keeping `task_runs` as the single durable queue, preserving `current_run_id` as a projection, keeping skills instructional, and using durable cursors as a shared primitive all remain aligned with the project rules. The remaining blockers are narrower, but still safety-critical enough to fix before task generation.

## Blockers

- `B-001` - Task-level terminal mutation against active token-fenced runs is underspecified. The spec must choose reject-vs-force-stop behavior, actor precedence, idempotency guard, and resulting event/projection semantics.
- `B-002` - Synthetic terminal run creation lacks a concurrency guard. The spec must define transaction/CAS behavior and idempotency for concurrent task-level terminal writes.
- `B-003` - `ClaimNextRun` spawn-circuit filtering lacks SQL/index/transaction design. The spec must define the exact filter, index shape, breaker-open ordering, and reset durability.
- `B-004` - `internal/notifications` currently ships a primitive with no concrete MVP consumer. The spec must either migrate one real consumer in this TechSpec or defer the primitive.
- `B-005` - Spawn failure observer/reset call sites are underspecified. The spec must name the package that classifies failures, the synchronous calls into task service, and the exact reset point.
- `B-006` - Public `MaintainCurrentRunID` is itself a misuse seam. The spec should remove it from the public interface and keep projection writes as unexported task-service helpers.
- `B-007` - Task-level terminal endpoint authorization is underspecified. The spec must make `/api/tasks/:id/complete|fail` operator-only and prove agent/session actors cannot bypass lease semantics.

## Nits

- `N-001` - Clarify that `OrchestrationManager` is a logical decomposition of `task.Manager`/`task.Service`, not a second wired service.
- `N-002` - Define cursor idempotent replay by adding `last_delivery_id` and matching `delivery_id`.
- `N-003` - State scheduler `scheduler.*` events are `internal/observe` events only, not hook taxonomy.
- `N-004` - Enumerate HTTP/UDS parity test matrix for every new/modified endpoint.
- `N-005` - Reconsider `agh task complete-task` / `fail-task` naming or explicitly align docs/help if kept.
- `N-006` - Cite or add the loader-side implementation for `requires_active_task_claim`.
- `N-007` - Pin the maximum watchdog duration in config validation and docs.
- `N-008` - Add an end-to-end max-runtime managed-stop/race integration test.
- `N-009` - Specify precedence between `Last-Event-ID` and `?after_sequence`.
- `N-010` - Expand delete/replace targets to enumerate prompt prose, web polling, JSON parsing, and cursor side-state removals/migrations.

## Likely Affected Files

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/adrs/adr-001-orchestration-hardening-extends-existing-autonomy.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-003-shared-durable-notification-cursors.md`
- `.compozy/tasks/orch-improvs/adrs/adr-004-minimal-task-orchestration-config.md`
- `.compozy/tasks/orch-improvs/adrs/adr-005-current-run-id-denormalized-projection.md`
- `.compozy/tasks/orch-improvs/adrs/adr-006-bundled-orchestration-skills-are-instructional.md`

## Round Artifacts

- Prompt: `.compozy/tasks/orch-improvs/qa/peer-review-prompt-round2.md`
- Raw Compozy event stream: `.compozy/tasks/orch-improvs/qa/peer-review-result-round2.json`
- Extracted review JSON: `.compozy/tasks/orch-improvs/qa/peer-review-result-round2-extracted.json`
- Stderr: `.compozy/tasks/orch-improvs/qa/peer-review-result-round2.err`

Note: `peer-review-result-round2.err` is empty and `compozy exec` exited successfully.
