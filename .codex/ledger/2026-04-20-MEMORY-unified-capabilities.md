Goal (incl. success criteria):

- Create the approved `cy-create-tasks` breakdown for `.compozy/tasks/unified-capabilities/`.
- Success means `_tasks.md` plus `task_01.md` through `task_10.md` exist, are enriched, and `compozy tasks validate --name unified-capabilities` exits 0.

Constraints/Assumptions:

- User approved the 10-task breakdown exactly as proposed.
- Must include dedicated tasks for `web/`, `packages/site`, `qa-report`, and `qa-execution`.
- No `_prd.md` exists; tasks must derive requirements from `_techspec.md` and ADRs.
- Use PT-BR in user-facing messages.

Key decisions:

- Reuse the approved dependency graph:
  - `01 -> 02 -> 03 -> 04`
  - `04 -> 05`
  - `04 -> 06`
  - `05 -> 07`
  - `05 -> 08`
  - `01..08 -> 09 -> 10`
- Mirror the task-file style already used under `.compozy/tasks/agent-capabilities/`.
- QA tasks use `qa-output-path=.compozy/tasks/unified-capabilities`.

State:

- Completed

Done:

- Read `cy-create-tasks`, `qa-report`, and `qa-execution` skills.
- Confirmed `.compozy/config.toml` is absent, so default task types apply.
- Inspected existing task templates and `agent-capabilities` task files for structure.
- Mapped real backend, web, and `packages/site` files for enrichment.
- Wrote `.compozy/tasks/unified-capabilities/_tasks.md`.
- Wrote `.compozy/tasks/unified-capabilities/task_01.md` through `task_10.md`.
- Validated the workflow successfully with `compozy validate-tasks --name unified-capabilities`.

Now:

- No active implementation work.

Next:

- Next workflow step is `compozy sync --name unified-capabilities` or starting execution from the generated tasks.

Open questions (UNCONFIRMED if needed):

- None blocking. TechSpec still carries one semantic open item about unresolved `requirements`, but task creation can proceed.

Working set (files/ids/commands):

- `.compozy/tasks/unified-capabilities/_techspec.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-001.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-002.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-003.md`
- `.compozy/tasks/agent-capabilities/_tasks.md`
- `.compozy/tasks/agent-capabilities/task_01.md`
- `.compozy/tasks/agent-capabilities/task_06.md`
- `.compozy/tasks/agent-capabilities/task_07.md`
- `compozy validate-tasks --name unified-capabilities`
