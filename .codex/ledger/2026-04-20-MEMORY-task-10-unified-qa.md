Goal (incl. success criteria):

- Complete unified-capabilities `task_10` by executing the task_09 QA matrix end to end, fixing any confirmed regressions with durable coverage, publishing fresh evidence under `.compozy/tasks/unified-capabilities/qa/verification-report.md`, updating task tracking, and finishing with clean `make verify` plus required web/site gates.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `qa-execution`, and `cy-final-verify`.
- Must read root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, workflow memory, `_techspec.md`, `_tasks.md`, `task_09.md`, `task_10.md`, ADR-001/002/003, and task_09 QA artifacts before live validation.
- `qa-output-path` is fixed to `.compozy/tasks/unified-capabilities`.
- Workspace is already dirty in task-tracking files and unrelated web/session files; do not revert or overwrite unrelated user changes.
- If QA finds a bug, use root-cause debugging and no-workaround discipline before editing code or tests.

Key decisions:

- Treat the task_09 test plan, regression suite, and TC IDs as the execution seed; evidence and issue files stay under the existing QA artifact root.
- Classify baseline failures first as unified-capability regressions versus external blockers before changing code.

State:

- Completed.

Done:

- Read skill instructions for `cy-workflow-memory`, `cy-execute-task`, `qa-execution`, and `cy-final-verify`.
- Read repository guidance (`AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`), shared workflow memory, task_10 workflow memory, `_techspec.md`, `_tasks.md`, `task_09.md`, `task_10.md`, ADR-001/002/003, and task_09 QA artifacts.
- Ran the QA contract discovery script and confirmed the canonical verify gate is `make verify`; web surface is present.
- Captured initial workspace status showing unrelated dirty web/session files plus untracked unified-capabilities QA artifacts and task memory files.
- Published the task_10 execution checklist from the regression suite and test-plan artifacts.
- Established the pre-flight baseline from clean sequential reruns:
  - `make verify` -> PASS
  - `make web-lint` -> PASS
  - `make web-typecheck` -> PASS
- Confirmed the earlier `make web-typecheck` failure was caused by my own parallel pre-flight execution and did not reproduce sequentially.
- Confirmed the earlier `internal/acp` failure from the first `make verify` run did not reproduce under targeted `go test -race ./internal/acp`, the direct repo gotestsum lane, or the clean sequential `make verify` rerun.
- Executed the P0/P1 QA matrix across backend/runtime, network/API, web UI, and site docs using the task_09 regression suite and case files.
- Fixed three confirmed regressions with durable coverage:
  - filtered rich `whois` responses now keep `peer_card.capabilities` aligned with filtered `capability_catalog`
  - same-daemon local-directed `receipt`/`trace` messages no longer pre-sync sender lifecycle before local receive
  - the network operator browser flow now uses a stable route key and fade-only dialog animation
- Repaired additional repo-gate blockers required for `make verify`:
  - `internal/api/httpapi/prompt.go`
  - `magefile.go`
  - `internal/api/httpapi/handlers_test.go`
  - `internal/api/udsapi/handlers_test.go`
- Wrote QA artifacts:
  - `.compozy/tasks/unified-capabilities/qa/issues/BUG-001.md`
  - `.compozy/tasks/unified-capabilities/qa/issues/BUG-002.md`
  - `.compozy/tasks/unified-capabilities/qa/issues/BUG-003.md`
  - `.compozy/tasks/unified-capabilities/qa/verification-report.md`
- Updated workflow memory and task tracking for task_10 completion.
- Fresh final verification passed on the current state:
  - `make verify`
  - `make web-lint`
  - `make web-typecheck`
  - `make web-test`
  - `make site-build`
- Created local commit `0e94c87a` (`test: complete unified capabilities qa gate`).

Now:

- None.

Next:

- Delete this ledger after handoff, if desired.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-task-10-unified-qa.md`
- `.compozy/tasks/unified-capabilities/memory/{MEMORY.md,task_10.md}`
- `.compozy/tasks/unified-capabilities/{_techspec.md,_tasks.md,task_09.md,task_10.md}`
- `.compozy/tasks/unified-capabilities/adrs/{adr-001.md,adr-002.md,adr-003.md}`
- `.compozy/tasks/unified-capabilities/qa/test-plans/{unified-capabilities-test-plan.md,unified-capabilities-regression.md}`
- `.compozy/tasks/unified-capabilities/qa/test-cases/{TC-INT-001.md,TC-INT-002.md,TC-INT-003.md,TC-INT-004.md,TC-UI-001.md,TC-REG-001.md,TC-REG-002.md}`
- `.compozy/tasks/unified-capabilities/qa/issues/{BUG-001.md,BUG-002.md,BUG-003.md}`
- `.compozy/tasks/unified-capabilities/qa/verification-report.md`
- `internal/network/{capability_catalog.go,router.go,router_test.go,manager_test.go}`
- `internal/daemon/{daemon_network_collaboration_integration_test.go,daemon_test.go}`
- `web/src/routes/{_app.tsx,-_app.test.tsx}`
- `packages/ui/src/components/{dialog.tsx,dialog.test.tsx}`
- `internal/api/httpapi/{prompt.go,handlers_test.go}`
- `internal/api/udsapi/handlers_test.go`
- `magefile.go`
- `python3 .agents/skills/qa-execution/scripts/discover-project-contract.py --root .`
- `git status --short`
- `make verify`
- `make web-lint`
- `make web-typecheck`
- `make web-test`
- `make site-build`
