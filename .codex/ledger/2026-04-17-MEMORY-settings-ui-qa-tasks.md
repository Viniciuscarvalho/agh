Goal (incl. success criteria):

- Add two final tasks under `.compozy/tasks/settings-ui/` for QA planning and QA execution of the settings feature.
- Success means `_tasks.md` includes `task_15` and `task_16`, both task files are fully enriched, and they explicitly enforce the `/qa-report` and `/qa-execution` skills while aligning E2E expectations with the repo's existing `web/e2e` Playwright pattern.

Constraints/Assumptions:

- Follow the existing `settings-ui` task-file structure and dependency style.
- User explicitly wants skill usage enforced inside the task files.
- Use `.compozy/tasks/settings-ui` as the shared `qa-output-path`, so generated QA artifacts live under `.compozy/tasks/settings-ui/qa/`.
- Do not modify unrelated worktree files.

Key decisions:

- Place the QA tasks at the end of the graph: planning after all settings surfaces (`task_10` through `task_14`), execution after the QA plan.
- Make `task_15` a `docs` task for `qa-report` artifacts and `task_16` a `test` task for `qa-execution` plus committed Playwright coverage.
- Require the repo's daemon-served browser E2E pattern (`web/e2e`, shared runtime fixtures, `make test-e2e-web`) rather than ad hoc browser checks.

State:

- Completed.

Done:

- Read the existing `settings-ui` task graph, task template, and prior `settings-ui` ledger.
- Read the local `/qa-report` and `/qa-execution` skill definitions.
- Confirmed the repo's browser E2E pattern uses `web/e2e`, `web/playwright.config.ts`, shared runtime/selector fixtures, and the `make test-e2e-web` lane.
- Confirmed local Paper settings exports exist under `docs/design/paper/settings/`.
- Added `task_15.md` as the settings QA planning task, explicitly requiring `/qa-report` with `qa-output-path=.compozy/tasks/settings-ui`.
- Added `task_16.md` as the settings QA execution task, explicitly requiring `/qa-execution`, root-cause fixes, and committed daemon-served Playwright coverage under `web/e2e/`.
- Updated `.compozy/tasks/settings-ui/_tasks.md` with tasks 15 and 16 at the end of the dependency graph.
- Ran `compozy validate-tasks --name settings-ui` successfully (`all tasks valid (16 scanned)`).
- Ran `make verify` successfully after the task-doc changes.

Now:

- No active editing.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `.compozy/tasks/settings-ui/_tasks.md`
- `.compozy/tasks/settings-ui/task_15.md`
- `.compozy/tasks/settings-ui/task_16.md`
- `.agents/skills/qa-report/SKILL.md`
- `.agents/skills/qa-execution/SKILL.md`
- `web/e2e/fixtures/{test,runtime,runtime-seed,selectors}.ts`
- `web/playwright.config.ts`
