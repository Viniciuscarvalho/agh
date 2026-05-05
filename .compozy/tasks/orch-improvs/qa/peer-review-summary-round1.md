# Peer Review Summary - Round 1

## Verdict

Readiness: `NEEDS_REWORK`

The review agrees with the ADR direction, but flags that the TechSpec body is still not concrete enough for task generation. The main gaps are missing Go signatures, missing numbered authority/transition sequences, and under-specified API/runtime binding rules for cursor advancement, max-runtime recovery, skill injection, task context, and SSE cursor seeding.

## Blockers

- `B-001` - `Implementation Design / Core Interfaces`: Add concrete Go signatures for new task service methods, cursor companion types, scheduler health/recovery, coordinator skill injection, situation context bundle assembly, and new request/response payloads.
- `B-002` - `CursorStore` and delivery invariants: Specify transactional consistency for delivery confirmation plus cursor advancement, server-side monotonic checks, typed errors, and reset-only lowering.
- `B-003` - `tasks.current_run_id`: Enumerate every set/clear transition and state that `task.Service` is the only writer inside the same store transaction as the run transition.
- `B-004` - Synthetic terminal runs: Decide whether Hermes-style zero-duration synthetic terminal runs are in MVP; if yes, specify trigger, fields, owner, attempt semantics, and contract surface; if no, remove test references.
- `B-005` - Spawn failure breaker policy: Define incrementing error classes, reset behavior, breaker-open transition or filter, owning method, scheduler/task-service actor split, and emitted event.
- `B-006` - Max-runtime recovery authority: Add a precise actor sequence from scheduler observation to task-service-owned managed stop and `FailRunLease(reason='timed_out')`; explicitly forbid scheduler terminal-state writes.
- `B-007` - Deterministic `agh-orchestrator` injection: Specify loader interface, coordinator runtime call site, skill body source, prompt assembly order, and no-duplicate-guidance invariant.
- `B-008` - `/api/agent/context` task binding: Specify that `TaskContextBundle` resolves through session-bound active lease lookup, define no-claim behavior, and define operator explicit `task_id` handling if allowed.
- `B-009` - Cursor-seeded SSE contract field: Name the field, such as `latest_event_seq`, define type and source from `task_events.event_seq`, apply to event-bearing read/list payloads, and co-ship contract/codegen tests.

## Nits

- `N-001` - Reconcile ADR dates with the actual authoring date.
- `N-002` - Convert "scheduler never claims work" into a concrete boundary/import or interface-shape test.
- `N-003` - Map canonical observability events to typed `internal/observe` exposure paths and coverage-matrix tests.
- `N-004` - Paste bundled skill frontmatter for `agh-task-worker` and `agh-orchestrator`, including AGH metadata, version, and load triggers.
- `N-005` - Document config duration-to-DB-seconds conversion for `max_runtime_seconds` and validation rules.
- `N-006` - Specify notification cursor PK, indexes, uniqueness, and key-shape rationale.
- `N-007` - Enumerate generated contract artifacts: `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`; reference `make codegen-check`.
- `N-008` - Choose whether `agh-task-worker` loads on every worker session or only sessions with active task claims.
- `N-009` - Map new transitions to hook taxonomy entries and dispatch call sites; restate hooks never tail event tables.
- `N-010` - Make Web/Docs impact exhaustive enough for task generation, including specific `web/src/systems/tasks` files and `packages/site/docs/runtime/*.mdx` pages.

## Likely Affected Files

- `.compozy/tasks/orch-improvs/_techspec.md`
- `.compozy/tasks/orch-improvs/adrs/adr-001-orchestration-hardening-extends-existing-autonomy.md`
- `.compozy/tasks/orch-improvs/adrs/adr-002-queryable-orchestration-state.md`
- `.compozy/tasks/orch-improvs/adrs/adr-003-shared-durable-notification-cursors.md`
- `.compozy/tasks/orch-improvs/adrs/adr-004-minimal-task-orchestration-config.md`
- `.compozy/tasks/orch-improvs/adrs/adr-005-current-run-id-denormalized-projection.md`
- `.compozy/tasks/orch-improvs/adrs/adr-006-bundled-orchestration-skills-are-instructional.md`

## Round Artifacts

- Prompt: `.compozy/tasks/orch-improvs/qa/peer-review-prompt-round1.md`
- Raw Compozy event stream: `.compozy/tasks/orch-improvs/qa/peer-review-result-round1.json`
- Extracted review JSON: `.compozy/tasks/orch-improvs/qa/peer-review-result-round1-extracted.json`
- Stderr: `.compozy/tasks/orch-improvs/qa/peer-review-result-round1.err`

Note: stderr contains a non-fatal extension discovery warning for `.compozy/extensions/cy-qa-workflow/extension.toml` with unknown hook event `plan.pre_resolve_task_runtime`; `compozy exec` exited successfully and the review JSON was extracted from stdout.
