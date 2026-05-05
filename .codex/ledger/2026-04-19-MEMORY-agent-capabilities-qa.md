Goal (incl. success criteria):

- Generate task_06 QA planning artifacts under `.compozy/tasks/agent-capabilities/qa/` so task_07 can execute without redefining scope, priorities, evidence expectations, or output paths.
- Success requires: feature test plan, manual test cases for all required seams, regression suite definitions, traceability to tasks 01-05/TechSpec rules, updated workflow memory, updated task tracking, and fresh verification evidence.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `qa-report` with `qa-output-path=.compozy/tasks/agent-capabilities`, and `cy-final-verify`.
- Do not execute live QA flows in this task; planning and artifact generation only.
- Source of truth is task_06 plus `_techspec.md`, `_tasks.md`, ADRs, RFC 003, tasks 01-05, and existing capability docs.
- Worktree is dirty in unrelated files; do not touch unrelated changes.

Key decisions:

- Reuse `.compozy/tasks/agent-capabilities/qa/` as the single artifact root shared with task_07.
- Treat missing `qa/` directory as the baseline signal that task_06 is incomplete.

State:

- In progress.

Done:

- Read workspace instructions (`AGENTS.md`, `CLAUDE.md`).
- Read required skills and references for `cy-workflow-memory`, `cy-execute-task`, `qa-report`, and `cy-final-verify`.
- Read shared workflow memory, task_06 memory, `_techspec.md`, `_tasks.md`, ADRs, RFC 003, docs guide, and tasks 01-05.
- Confirmed `.compozy/tasks/agent-capabilities/qa/` is absent.
- Created `.compozy/tasks/agent-capabilities/qa/` with `test-plans/`, `test-cases/`, `issues/`, and `screenshots/`.
- Wrote `agent-capabilities-test-plan.md` and `agent-capabilities-regression.md`.
- Wrote manual cases `TC-INT-001` through `TC-INT-013` plus `TC-FUNC-014`.
- Updated task-local workflow memory with planning decisions and touched surfaces.
- Verified artifact structure with a focused QA audit command.
- Ran `make verify` successfully after the last edits.
- Updated `task_06.md` and `_tasks.md` locally to completed.

Now:

- Stage deliverable artifacts only and create the local commit.

Next:

- Report outcomes with verification evidence and note that tracking/memory files remain outside the auto-commit scope.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/agent-capabilities/task_06.md`
- `.compozy/tasks/agent-capabilities/_techspec.md`
- `.compozy/tasks/agent-capabilities/_tasks.md`
- `.compozy/tasks/agent-capabilities/adrs/adr-001.md`
- `.compozy/tasks/agent-capabilities/adrs/adr-002.md`
- `.compozy/tasks/agent-capabilities/adrs/adr-003.md`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/agents/capabilities.md`
- `.compozy/tasks/agent-capabilities/memory/MEMORY.md`
- `.compozy/tasks/agent-capabilities/memory/task_06.md`
- `.compozy/tasks/agent-capabilities/qa/test-plans/agent-capabilities-test-plan.md`
- `.compozy/tasks/agent-capabilities/qa/test-plans/agent-capabilities-regression.md`
- `.compozy/tasks/agent-capabilities/qa/test-cases/TC-INT-001.md`
- `.compozy/tasks/agent-capabilities/qa/test-cases/TC-INT-013.md`
- `.compozy/tasks/agent-capabilities/qa/test-cases/TC-FUNC-014.md`
- `git status --short`
