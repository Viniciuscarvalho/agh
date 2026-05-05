Goal (incl. success criteria):

- Decompose `.compozy/tasks/refac-v2/_techspec.md` into a validated set of independently implementable task files under `.compozy/tasks/refac-v2/`.
- Success criteria: derive a non-circular task graph, get user approval on the breakdown, then write `_tasks.md` and enriched `task_NN.md` files and pass `compozy validate-tasks --name refac-v2`.

Constraints/Assumptions:

- `cy-create-tasks` workflow applies.
- `.compozy/config.toml` is absent, so task `type` values must use built-in defaults.
- `_techspec.md` exists; `_prd.md` does not.
- Must present the full breakdown for approval before writing task files.
- Runtime does not permit `request_user_input`; approvals must be collected via normal user replies.
- Delegated sub-agents are not allowed unless explicitly requested by the user, so codebase exploration is local.

Key decisions:

- Use `_techspec.md` plus ADRs as the primary task source.
- Use the live repository tree, not only the analysis docs, to size and separate tasks.
- Keep tasks aligned to the TechSpec build order unless a smaller dependency cut is needed to avoid mega-tasks.

State:

- Completed.

Done:

- Read `cy-create-tasks` instructions and reference templates.
- Confirmed `.compozy/config.toml` is absent; built-in task types apply.
- Read `.compozy/tasks/refac-v2/_techspec.md`.
- Read ADRs `adr-001` through `adr-004`.
- Inspected current package/file layout for API packages, store, transcript, memory, config, and skills.
- Reviewed the older `.compozy/tasks/refac/_tasks.md` only as a sizing reference.
- Presented the proposed task graph and captured user approval.
- Wrote `.compozy/tasks/refac-v2/_tasks.md`.
- Wrote enriched `task_01.md` through `task_09.md`.
- Ran `compozy validate-tasks --name refac-v2` successfully (`all tasks valid (9 scanned)`).

Now:

- Task complete.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the user wants `refac-v2` tasks to supersede the existing `refac` task set or coexist independently. This does not block task generation.

Working set (files/ids/commands):

- `.compozy/tasks/refac-v2/_techspec.md`
- `.compozy/tasks/refac-v2/adrs/adr-001.md`
- `.compozy/tasks/refac-v2/adrs/adr-002.md`
- `.compozy/tasks/refac-v2/adrs/adr-003.md`
- `.compozy/tasks/refac-v2/adrs/adr-004.md`
- `.agents/skills/cy-create-tasks/SKILL.md`
- `.agents/skills/cy-create-tasks/references/task-template.md`
- `.agents/skills/cy-create-tasks/references/task-context-schema.md`
- `find internal -maxdepth 2 -type d | sort`
- `find internal/apicore internal/apisupport internal/httpapi internal/udsapi internal/apitest -maxdepth 2 -type f | sort`
- `find internal/store -maxdepth 2 -type f | sort`
