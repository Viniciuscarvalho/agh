---
status: pending
title: Real-Scenario QA Execution
type: test
complexity: critical
dependencies:
  - task_16
---

# Task 17: Real-Scenario QA Execution

## Overview

Execute the final real-scenario QA pass for Agent Authored Context using the artifacts from task_16. This task proves the implemented Soul, Heartbeat, session health, CLI/API/UDS, extensibility, SDK, web contract, and docs behavior through isolated runtime scenarios and repository gates.

<critical>
- ALWAYS READ `_techspec.md`, `_techspec_soul.md`, `_techspec_heartbeat.md`, all ADRs, task_16 QA artifacts, and current changed files before execution.
- ACTIVATE `qa-execution` with `qa-output-path=.compozy/tasks/agent-soul` before live verification or evidence capture.
- ACTIVATE `agh-qa-bootstrap`, `real-scenario-qa`, and `agh-worktree-isolation` for isolated runtime verification.
- IF QA FINDS A BUG, ACTIVATE `systematic-debugging` AND `no-workarounds` BEFORE CHANGING CODE OR TESTS.
- FOLLOW THE PROJECT QA CONTRACT: use real CLI, HTTP, UDS, daemon, extension, SDK, docs, and repository gates as final proof.
- NO WORKAROUNDS: do not weaken tests, skip failing surfaces, or substitute mock-only confidence for runtime behavior.
</critical>

<requirements>
- MUST activate `qa-execution` with `qa-output-path=.compozy/tasks/agent-soul`.
- MUST consume `.compozy/tasks/agent-soul/qa/test-plans/` and `.compozy/tasks/agent-soul/qa/test-cases/` from task_16.
- MUST create or reuse only a valid same-session QA bootstrap manifest; new independent QA passes need a fresh isolated lab.
- MUST use unique `AGH_HOME`, daemon ports, provider home, and tmux-bridge socket paths.
- MUST execute real CLI, HTTP, UDS, daemon/session, scheduler wake, Host API, tools/resources, SDK, web contract, and docs flows according to the QA plan.
- MUST run `make verify` after the final fix set and run narrower failing gates after every root-cause fix.
- MUST run `make test-e2e-runtime` for runtime/CLI/API/UDS behavior; run `make test-e2e-web` only if a UI-bearing change is introduced by implementation.
- MUST capture final evidence in `.compozy/tasks/agent-soul/qa/verification-report.md` with logs, issue files, and a QA bootstrap block.
</requirements>

## Subtasks
- [ ] 17.1 Activate QA skills and create a fresh isolated QA bootstrap manifest.
- [ ] 17.2 Establish baseline health with repository gates and task_16 regression suite.
- [ ] 17.3 Execute real Soul authoring, session snapshot, prompt context, and task provenance flows.
- [ ] 17.4 Execute real Heartbeat authoring, session health, wake scheduler, coalescing, and audit flows.
- [ ] 17.5 Execute CLI/HTTP/UDS parity, Host API/hooks/tools/resources, SDK, web contract, and docs flows.
- [ ] 17.6 Fix root-cause bugs, add regression coverage, rerun impacted scenarios, and publish final evidence.

## Implementation Details

Use the QA plan as the execution matrix, not as a suggestion. Every failure should produce either a root-cause fix with durable regression coverage or a clearly documented non-issue with evidence.

### Relevant Files
- `.agents/skills/qa-execution/SKILL.md` - required execution workflow.
- `.agents/skills/agh-qa-bootstrap/SKILL.md` - isolated QA lab workflow.
- `.agents/skills/real-scenario-qa/SKILL.md` - realistic runtime verification workflow.
- `.agents/skills/agh-worktree-isolation/SKILL.md` - unique runtime home/ports/socket requirements.
- `.compozy/tasks/agent-soul/qa/test-plans/` - task_16 execution plan and regression suite.
- `.compozy/tasks/agent-soul/qa/test-cases/` - task_16 manual test cases.
- `Makefile` - repository verification and E2E gates.
- `internal/`, `web/`, `packages/site/`, `sdk/typescript/` - possible root-cause fix locations.

### Dependent Files
- `.compozy/tasks/agent-soul/qa/verification-report.md` - final QA evidence report.
- `.compozy/tasks/agent-soul/qa/issues/BUG-*.md` - structured bug reports for discovered failures.
- `.compozy/tasks/agent-soul/qa/logs/` - command, daemon, API, UDS, extension, SDK, docs, and gate logs.
- `.compozy/tasks/agent-soul/qa/screenshots/` - browser evidence only if UI/docs visual evidence is required.
- `internal/**/*_test.go`, `web/src/**/*test*`, `packages/site/**/*test*`, `sdk/typescript/**/*test*` - regression destinations for bugs discovered during QA.

### Related ADRs
- [ADR-001: Optional Scoped SOUL.md Persona Artifact](adrs/adr-001.md) - Soul runtime QA.
- [ADR-003: Soul Snapshot Lifecycle](adrs/adr-003.md) - session/task provenance QA.
- [ADR-006: Managed Soul Authoring in v1](adrs/adr-006.md) - authoring QA.
- [ADR-007: HEARTBEAT.md Is Advisory Wake Policy](adrs/adr-007.md) - wake policy QA.
- [ADR-008: Heartbeat Snapshots and Wake Audit](adrs/adr-008.md) - audit QA.
- [ADR-009: Separate Session Health From HEARTBEAT.md](adrs/adr-009.md) - health QA.
- [ADR-010: Managed Heartbeat and Session Health Surfaces](adrs/adr-010.md) - manageability QA.
- [ADR-011: Config Authority for Cadence and Wake Limits](adrs/adr-011.md) - config QA.

## Extensibility / Agent Manageability / Config Lifecycle
- Extensibility: execution must prove Host API grants, hook payloads, tools/resources, SDK helpers, and no direct file-write bypass.
- Agent manageability: execution must prove CLI/HTTP/UDS parity, JSON output, CAS conflicts, deterministic errors, and status discovery.
- Config lifecycle: execution must prove defaults, overrides, disabled states, validation failures, effective digest reporting, and docs examples.

### Web/Docs Impact
- Web impact: execute web generated contract typecheck/tests; browser E2E is required only if implementation introduced visible UI.
- Docs impact: execute site docs validation, CLI reference checks, and public boundary statement review.

## Deliverables
- Final `.compozy/tasks/agent-soul/qa/verification-report.md` produced by `qa-execution`.
- QA bootstrap manifest path, lab root, runtime home, provider home, daemon base URL, and UDS/socket details recorded in the report.
- Logs and evidence for repository gates, runtime E2E, CLI/API/UDS parity, extension/SDK checks, web contracts, and docs.
- Root-cause bug fixes and durable regression tests for every valid discovered issue.
- Passing final `make verify` and required scenario gates after the last fix.

## Tests
- Unit tests:
  - [ ] Every bug found in resolver, storage, services, session health, wake policy, API, CLI, extension, SDK, web, or docs gains a narrow regression.
  - [ ] Negative cases prove no unsupported queue, lease renewal, network greet mutation, direct file-write bypass, or UI editor behavior.
  - [ ] Contract and CLI tests prove redaction, CAS, and deterministic errors.
- Integration tests:
  - [ ] Real daemon flow manages `SOUL.md`, starts a session, refreshes Soul, and records task provenance.
  - [ ] Real daemon flow manages `HEARTBEAT.md`, reports session health, wakes an eligible session, coalesces duplicates, and records audit events.
  - [ ] CLI, HTTP, and UDS return equivalent data and errors for Soul, Heartbeat, and session health flows.
  - [ ] Host API, hooks, tools/resources, and SDK helpers operate through managed services with grants.
  - [ ] Docs, generated contracts, and site build match implemented behavior.
  - [ ] `make test-e2e-runtime` and final `make verify` pass.
- Test coverage target: >=80% for changed packages and complete P0/P1 QA traceability.
- All tests must pass.

## References
- `_techspec.md` - aggregate success criteria and verification matrix.
- `_techspec_soul.md` - Soul runtime verification requirements.
- `_techspec_heartbeat.md` - Heartbeat/session health runtime verification requirements.
- `.compozy/tasks/agent-soul/qa/test-plans/agent-authored-context-test-plan.md` - execution plan from task_16.
- `.compozy/tasks/agent-soul/qa/test-plans/agent-authored-context-regression.md` - regression suite from task_16.
- `.compozy/tasks/agent-soul/analysis/analysis_agh_heartbeat.md` - local liveness architecture risks.
- `.compozy/tasks/agent-soul/analysis/analysis_openclaw_heartbeat.md` - wake/coalescing risk comparison.
- `.compozy/tasks/agent-soul/analysis/analysis_paperclip_heartbeat.md` - queue/run-table mismatch comparison.
- `.resources/openclaw/src/agents/system-prompt.ts:96-126` - Soul prompt inclusion precedent for runtime QA.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:610-725` - scheduler/coalescing precedent for runtime QA.
- `.resources/hermes/run_agent.py:7271-7350` - liveness/progress contrast for runtime QA.
- `.resources/paperclip/packages/db/src/schema/agent_wakeup_requests.ts:5-40` - queue contrast for negative runtime QA.

## Success Criteria
- All tests passing.
- Test coverage >=80% for changed packages.
- `qa-execution` produced fresh evidence under `.compozy/tasks/agent-soul/qa/`.
- The final report proves Soul, Heartbeat, session health, wake behavior, manageability, extensibility, config, web contracts, and docs through real AGH surfaces.
