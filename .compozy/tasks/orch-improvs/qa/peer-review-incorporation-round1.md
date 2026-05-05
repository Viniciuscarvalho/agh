# Peer Review Incorporation - Round 1

## User Decision

Selected incorporation option: `B` - selected blockers/nits.

The user accepted the recommended selection:

- Incorporated: `B-001`, `B-002`, `B-003`, `B-004`, `B-005`, `B-006`, `B-007`, `B-008`, `B-009`, `N-002`, `N-003`, `N-004`, `N-005`, `N-006`, `N-007`, `N-008`, `N-009`, `N-010`
- Deferred: `N-001`

`N-001` was deferred because it only reconciles ADR authoring dates and does not affect taskability, runtime authority, API contract clarity, or implementation safety.

## Incorporated Changes

- Added concrete Go contract signatures for task orchestration service methods, summary payloads, spawn-failure accounting, max-runtime requests, current-run projection mutation, notification cursors, task context bundle assembly, scheduler recovery sink, and deterministic coordinator skill injection.
- Added cursor advancement invariants for monotonic updates, typed non-monotonic rejection, reset-only lowering, and confirmed-delivery semantics.
- Added `tasks.current_run_id` transition invariants for claim, start, attach, complete, fail, release, recovery, synthetic terminal runs, and task closure.
- Declared synthetic zero-duration terminal runs in MVP scope and specified trigger, fields, attempt semantics, owner, and token-safety behavior.
- Specified spawn-failure breaker policy, including typed reasons, reset condition, blocked transition, `ClaimNextRun` filtering, and task-service ownership.
- Added max-runtime recovery actor sequence: scheduler observes, task service requests managed stop, session/process stop escalates, and task service writes terminal failure.
- Specified deterministic `agh-orchestrator` injection through `internal/daemon/coordinator_runtime`, bundled-skill loader, prompt assembly order, and no-duplicate-guidance invariant.
- Specified `/api/agent/context` task bundle binding through session-bound active lease lookup, no-claim behavior, cross-session rejection, and optional operator task lookup.
- Named the SSE seed field `latest_event_seq`, defined its type/source, required event-bearing read/list exposure, and tied it to `after_sequence`.
- Converted scheduler "never claims" testing into boundary/import/interface tests.
- Mapped canonical observability events to `internal/observe`, structured logs, dashboard/timeline surfaces where applicable, and coverage-matrix expectations.
- Added bundled skill frontmatter for `agh-task-worker` and `agh-orchestrator`, including `metadata.agh.always_load`, `metadata.agh.instructional_only`, version, and related skills.
- Documented config duration-string to integer-seconds conversion for `default_max_runtime` and validation rules.
- Specified notification cursor table name, primary key, index, and independent-consumer rationale.
- Enumerated generated contract artifacts: `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`, plus `make codegen-check`.
- Chose `agh-task-worker` load trigger: worker sessions with an active task claim or task-tool loop; not global operator sessions.
- Mapped new transitions to hook/observe dispatch owners and restated that hooks never tail event tables as authority.
- Expanded Web/Docs impact with concrete `web/src/systems/tasks` files and `packages/site/content/runtime/**` pages.

## Files Changed

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/adrs/adr-001-orchestration-hardening-extends-existing-autonomy.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-003-shared-durable-notification-cursors.md`
- `.compozy/tasks/orch-improvs/adrs/adr-004-minimal-task-orchestration-config.md`
- `.compozy/tasks/orch-improvs/adrs/adr-005-current-run-id-denormalized-projection.md`
- `.compozy/tasks/orch-improvs/adrs/adr-006-bundled-orchestration-skills-are-instructional.md`
- `.compozy/tasks/orch-improvs/qa/peer-review-incorporation-round1.md`

## Deferred Items

- `N-001`: ADR date reconciliation. Deferred as low-value metadata cleanup; revisit only if the project wants ADR dates to match the ledger creation date instead of the environment's current date.

## Verification

- Checked TechSpec code fence balance.
- Checked ADR code fence balance.
- Checked expected markers for final-shape sections, Go signatures, cursor invariants, `latest_event_seq`, context binding, contract artifacts, skill load metadata, notification cursor index, and implementation/test sections.
