---
status: pending
title: QA Plan and Test Coverage
type: test
complexity: high
dependencies:
  - task_15
---

# Task 16: QA Plan and Test Coverage

## Overview

Generate the reusable QA planning artifacts for the Agent Authored Context feature before live execution begins. This task translates the Soul plus Heartbeat specs into traceable test plans, manual test cases, regression suites, and evidence locations for task_17.

<critical>
- ALWAYS READ `_techspec.md`, `_techspec_soul.md`, `_techspec_heartbeat.md`, every ADR, tasks 01-15, and changed docs before planning coverage.
- ACTIVATE `qa-report` with `qa-output-path=.compozy/tasks/agent-soul` before writing or revising QA artifacts.
- KEEP THE SAME `qa-output-path` FOR `qa-execution`; all planning and execution artifacts must live under `.compozy/tasks/agent-soul/qa/`.
- FOCUS ON WHAT MUST BE PROVEN: Soul authoring, Heartbeat policy, session health, wake behavior, API/UDS/CLI parity, extensibility, config, web contracts, and docs.
- DO NOT EXECUTE LIVE FLOWS IN THIS TASK; this is planning, prioritization, traceability, and artifact generation only.
- NO WORKAROUNDS: every P0/P1 case must prove a TechSpec invariant or ADR boundary, not generic smoke behavior.
</critical>

<requirements>
- MUST activate `qa-report` and use `qa-output-path=.compozy/tasks/agent-soul`.
- MUST generate a feature-level QA plan under `.compozy/tasks/agent-soul/qa/test-plans/`.
- MUST generate manual test cases for backend resolver/storage/services, session runtime, scheduler wake, CLI, HTTP, UDS, Host API, hooks, tools/resources, SDK, web generated consumers, and site docs.
- MUST create at least one regression-suite document with smoke, targeted, full, and release-blocking lanes for task_17.
- MUST define artifact paths for issues, logs, screenshots if applicable, daemon traces, command outputs, and verification reports.
- MUST map every P0/P1 case to a task, TechSpec section, ADR, or competitor-derived risk.
- MUST explicitly include negative cases for forbidden behavior: no `agh session heartbeat`, no task queue, no task lease renewal, no network greet mutation, no UI editor, and no direct extension file writes.
</requirements>

## Subtasks
- [ ] 16.1 Activate `qa-report` with `qa-output-path=.compozy/tasks/agent-soul`.
- [ ] 16.2 Write the feature-level QA plan with scope, risk matrix, environments, and entry/exit criteria.
- [ ] 16.3 Generate manual test cases across backend, runtime, CLI, API, UDS, extension, SDK, web contracts, and docs.
- [ ] 16.4 Build regression suites with P0/P1 ordering and explicit task_17 command/evidence requirements.
- [ ] 16.5 Add traceability from every P0/P1 case to tasks 01-15, TechSpecs, ADRs, or analysis files.
- [ ] 16.6 Validate artifact layout and record the execution handoff for task_17.

## Implementation Details

The QA plan should be behavior-first and evidence-driven. It must not merely list unit tests; it should define operator and agent journeys that prove the implemented surfaces work together under realistic isolated runtime conditions.

### Relevant Files
- `.agents/skills/qa-report/SKILL.md` - required QA planning workflow.
- `.compozy/tasks/agent-soul/_techspec.md` - aggregate scope and sequencing.
- `.compozy/tasks/agent-soul/_techspec_soul.md` - Soul behavior and invariants.
- `.compozy/tasks/agent-soul/_techspec_heartbeat.md` - Heartbeat/session health behavior and invariants.
- `.compozy/tasks/agent-soul/adrs/` - accepted architecture decisions.
- `.compozy/tasks/agent-soul/task_01.md` through `.compozy/tasks/agent-soul/task_15.md` - implementation task scope.
- `packages/site/` - docs validation scope.
- `web/` and `sdk/typescript/` - generated consumer and SDK validation scope.

### Dependent Files
- `.compozy/tasks/agent-soul/qa/test-plans/agent-authored-context-test-plan.md` - feature-level QA plan.
- `.compozy/tasks/agent-soul/qa/test-plans/agent-authored-context-regression.md` - regression suite consumed by task_17.
- `.compozy/tasks/agent-soul/qa/test-cases/TC-*.md` - manual test cases with priority and expected results.
- `.compozy/tasks/agent-soul/qa/issues/BUG-*.md` - issue path for concrete discrepancies found during planning.
- `.compozy/tasks/agent-soul/qa/logs/` - reserved command/daemon evidence path for task_17.
- `.compozy/tasks/agent-soul/qa/screenshots/` - reserved only if browser/docs evidence is needed.
- `.compozy/tasks/agent-soul/task_17.md` - execution task that consumes this artifact set.

### Related ADRs
- [ADR-001: Optional Scoped SOUL.md Persona Artifact](adrs/adr-001.md) - Soul QA boundary.
- [ADR-006: Managed Soul Authoring in v1](adrs/adr-006.md) - managed authoring QA.
- [ADR-007: HEARTBEAT.md Is Advisory Wake Policy](adrs/adr-007.md) - Heartbeat policy QA.
- [ADR-008: Heartbeat Snapshots and Wake Audit](adrs/adr-008.md) - storage/audit QA.
- [ADR-009: Separate Session Health From HEARTBEAT.md](adrs/adr-009.md) - health QA.
- [ADR-010: Managed Heartbeat and Session Health Surfaces](adrs/adr-010.md) - manageability QA.
- [ADR-011: Config Authority for Cadence and Wake Limits](adrs/adr-011.md) - config QA.

## Extensibility / Agent Manageability / Config Lifecycle
- Extensibility: QA plan must include Host API, hooks, tools/resources, SDK, bundle/registry docs, and no-bypass negative cases.
- Agent manageability: QA plan must include CLI/HTTP/UDS parity, JSON output, deterministic errors, CAS, and status discovery.
- Config lifecycle: QA plan must include defaults, overrides, validation errors, disabled states, docs, and effective digest reporting.

### Web/Docs Impact
- Web impact: QA plan must cover generated web contracts and any existing truthful status consumers; no MVP UI editor journey.
- Docs impact: QA plan must cover site docs, CLI reference, config examples, extension docs, and public boundary statements.

## Deliverables
- Feature QA plan under `.compozy/tasks/agent-soul/qa/test-plans/`.
- Regression suite for task_17 under `.compozy/tasks/agent-soul/qa/test-plans/`.
- Manual test cases under `.compozy/tasks/agent-soul/qa/test-cases/`.
- Stable QA artifact layout for logs, issues, screenshots, and verification reports.
- Traceability matrix from P0/P1 cases to tasks, TechSpecs, ADRs, and competitor-derived risks.

## Tests
- Unit tests:
  - [ ] QA plan includes objectives, scope, environments, entry/exit criteria, and risk matrix.
  - [ ] Manual test cases exist for every implementation task and every public/extensibility surface.
  - [ ] Regression suite defines smoke, targeted, full, and release-blocking lanes.
  - [ ] Every P0/P1 case names the exact task, TechSpec section, ADR, or analysis file it proves.
  - [ ] Forbidden behavior negative cases are present.
- Integration tests:
  - [ ] All QA artifacts land under `.compozy/tasks/agent-soul/qa/`.
  - [ ] Task_17 can consume the regression suite without redefining output paths.
  - [ ] Planning artifacts include backend, CLI, HTTP, UDS, extension, SDK, web contract, and docs coverage.
- Test coverage target: planning coverage for 100% of tasks 01-15 and ADR-001 through ADR-011.
- All tests must pass.

## References
- `_techspec.md` - aggregate implementation and QA requirements.
- `_techspec_soul.md` - Soul QA requirements.
- `_techspec_heartbeat.md` - Heartbeat/session health QA requirements.
- `.compozy/tasks/agent-soul/analysis/analysis_agh_heartbeat.md` - local liveness risks.
- `.compozy/tasks/agent-soul/analysis/analysis_openclaw_heartbeat.md` - wake/coalescing risks.
- `.compozy/tasks/agent-soul/analysis/analysis_hermes_heartbeat.md` - task-run heartbeat risk contrast.
- `.compozy/tasks/agent-soul/analysis/analysis_paperclip_heartbeat.md` - queue/run-table mismatch risks.
- `.resources/openclaw/src/agents/bootstrap-files.ts:194-288` - Soul authored-file precedent for QA cases.
- `.resources/openclaw/src/infra/heartbeat-wake.ts:42-208` - wake decision precedent for QA cases.
- `.resources/hermes/hermes_cli/kanban_db.py:1183-1300` - task-run lease heartbeat contrast for negative QA cases.
- `.resources/paperclip/packages/db/src/schema/heartbeat_runs.ts:6-82` - independent run table contrast for negative QA cases.

## Success Criteria
- All QA planning artifacts exist and are internally traceable.
- P0/P1 cases cover 100% of implementation tasks and accepted ADRs.
- Task_17 has an execution-ready matrix with stable artifact paths.
- The QA plan proves real behavior, not only parser-level or mock-driven confidence.
