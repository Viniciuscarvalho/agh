Goal (incl. success criteria):

- Complete Hermes task 10 by creating QA planning artifacts under `.compozy/tasks/hermes/qa/` for tasks 01-09.
- Success requires a feature QA plan, manual test cases, regression suite, artifact layout, traceability for every P0/P1 case, task memory/tracking updates, clean verification, self-review, and one local commit.

Constraints/Assumptions:

- Required skills loaded: `cy-workflow-memory`, `cy-execute-task`, `qa-report`, `cy-final-verify`.
- Workflow memory read before edits: `.compozy/tasks/hermes/memory/MEMORY.md` and `task_10.md`.
- Do not execute live QA flows in this task; produce planning artifacts only.
- Do not touch unrelated existing dirty `packages/site` changes.
- Do not run destructive git commands.

Key decisions:

- Use `qa-output-path=.compozy/tasks/hermes`, so all QA artifacts live under `.compozy/tasks/hermes/qa/`.

State:

- Completed.

Done:

- Loaded required skills and QA report templates.
- Read root guidance, web guidance, workflow memory, Hermes TechSpec, ADRs 001-005, tasks 01-11, and task 10's extra coverage notes.
- Confirmed no existing QA artifacts under `.compozy/tasks/hermes/qa/`.
- Created QA artifact directories under `.compozy/tasks/hermes/qa/`.
- Wrote `hermes-hardening-test-plan.md` and `hermes-hardening-regression.md`.
- Added manual test cases for Hermes P0/P1 backend, CLI, API/SSE, web, and site-docs coverage.
- Artifact validation passed: 15 `TC-*.md` files; every case has traceability, `TechSpec:`, `Task`, and `**Expected:**` results.
- Initial `make verify` passed after QA artifact generation: web lint/typecheck/test/build, Go lint `0 issues`, Go tests `DONE 5851 tests in 15.822s`, and package boundaries OK.
- Updated task_10 and `_tasks.md` tracking after verification/self-review.
- Promoted durable task_11 handoff to shared workflow memory: keep `qa-output-path=.compozy/tasks/hermes` and write execution report under the same QA root.
- Final `make verify` passed after tracking/memory updates: web oxlint `Found 0 warnings and 0 errors`, Go lint `0 issues`, Go tests `DONE 5851 tests in 5.984s`, package boundaries OK.
- Committed QA artifacts in `92adb526 test: add hermes hardening qa artifacts`.
- Post-commit `make verify` passed: web oxlint `Found 0 warnings and 0 errors`, Go lint `0 issues`, Go tests `DONE 5851 tests in 6.086s`, package boundaries OK.

Now:

- Task complete.

Next:

- Task 11 can execute the QA plan using `.compozy/tasks/hermes/qa/` without path changes.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-25-MEMORY-hermes-qa-plan.md`
- Workflow memory: `.compozy/tasks/hermes/memory/MEMORY.md`, `.compozy/tasks/hermes/memory/task_10.md`
- Planned QA root: `.compozy/tasks/hermes/qa/`
- QA artifacts: `.compozy/tasks/hermes/qa/test-plans/`, `.compozy/tasks/hermes/qa/test-cases/`, reserved `issues/`, `screenshots/`, `logs/`.
