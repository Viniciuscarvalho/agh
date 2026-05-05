Goal (incl. success criteria):

- Monitor workflow `.compozy/tasks/agent-soul`; only after every task is complete, create one local commit `feat: agents soul`, open a PR from the current branch, and start `cy reviews watch` for that PR.

Constraints/Assumptions:

- Do not run destructive git commands.
- Do not commit or open a PR while the workflow is still incomplete or while final QA evidence is missing.
- `CODEX_HOME` is empty in this shell; automation memory is being persisted under `/Users/pedronauck/.codex/automations/turn-on-reviews-watch/memory.md`.

Key decisions:

- Treat Task 17 as incomplete until the workflow has final completion evidence, not just partial QA artifacts.
- Do not run `git add . && git commit -m "feat: agents soul"`, PR creation, or `compozy reviews watch` during this run.
- `compozy reviews watch` should use the workflow slug plus `--provider coderabbit --pr <number>`; background mode is default, and `--auto-push --until-clean` are available when the PR exists.

State:

- Monitoring / waiting.

Done:

- Read workflow task artifacts and workflow memory for `agent-soul`.
- Confirmed `_tasks.md` still lists Task 16 and Task 17 as pending, while `task_16.md` is `completed` and `task_17.md` is still `pending`.
- Confirmed QA artifacts exist for Task 17, including issue files and scenario evidence.
- Confirmed no `qa/verification-report.md` or final `make verify` evidence exists yet.
- Confirmed daemon status shows `active_runs: 1`.
- Confirmed latest run artifacts under `~/.compozy/runs/tasks-agent-soul-653749-20260502-050254-000000000/` have no `result.json` and still show live session/event output.
- Inspected `~/dev/compozy/looper` CLI/docs for `compozy reviews watch` usage and required flags.

Now:

- Hold until the active `agent-soul` run finishes cleanly.

Next:

- Re-check the latest `tasks-agent-soul-*` run for `result.json` or terminal completion events.
- Re-check `task_17.md`, `_tasks.md`, and QA output for final `make verify` evidence.
- If complete, create the requested commit, open a PR from branch `vault`, capture the PR number, and start `~/dev/compozy/looper/bin/compozy reviews watch agent-soul --provider coderabbit --pr <number>`.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the currently active daemon run will update `task_17.md` / `_tasks.md` automatically when it finishes.
- UNCONFIRMED: which exact PR creation command/tool should be used in this environment once the workflow is complete.

Working set (files/ids/commands):

- `.compozy/tasks/agent-soul/_tasks.md`
- `.compozy/tasks/agent-soul/task_16.md`
- `.compozy/tasks/agent-soul/task_17.md`
- `.compozy/tasks/agent-soul/memory/task_17.md`
- `.compozy/tasks/agent-soul/qa/`
- `~/.compozy/runs/tasks-agent-soul-653749-20260502-050254-000000000/`
- `~/dev/compozy/looper/internal/cli/reviews_exec_daemon.go`
- `~/dev/compozy/looper/skills/compozy/references/config-reference.md`
