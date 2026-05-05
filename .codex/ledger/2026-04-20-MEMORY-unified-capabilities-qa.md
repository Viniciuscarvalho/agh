Goal (incl. success criteria):

- Complete task_09 by generating reusable unified-capabilities QA planning artifacts under `.compozy/tasks/unified-capabilities/qa/`, with explicit backend/web/site coverage, traceability to tasks 01-08 and the TechSpec/ADRs, updated task tracking, clean verification, and one local commit.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `qa-report`, and `cy-final-verify`.
- Must read `AGENTS.md`, `CLAUDE.md`, workflow memory, `_techspec.md`, `_tasks.md`, tasks 01-08, task_10, ADRs, and rewritten docs before planning coverage.
- Do not execute the planned backend/API/web/doc flows in this task; artifacts only.
- `qa-output-path` is fixed to `.compozy/tasks/unified-capabilities`; task_10 must reuse the same path.
- Workspace is dirty with unrelated web and task-file changes; do not touch unrelated files.

Key decisions:

- Use one feature-level plan plus one consolidated regression-suite document and a focused set of manual cases instead of scattering planning across many overlapping files.
- Persist empty `qa/issues/` and `qa/screenshots/` directories with `.gitkeep` so task_10 has stable artifact paths in git.

State:

- Blocked on verification.

Done:

- Loaded repository instructions, required skill docs, workflow memory, TechSpec, `_tasks.md`, task_09, tasks 01-08, task_10, ADRs, Makefile gates, rewritten repo/site docs, and relevant backend/web contract files.
- Confirmed baseline: `task_09` is pending and `.compozy/tasks/unified-capabilities/qa/` did not exist before this run.

Now:

- Wait for direction on the unrelated `make verify` failure in `web/src/systems/session/hooks/use-session-actions.ts`.

Next:

- If the user authorizes it, fix the unrelated web type error, rerun `make verify`, then update task tracking and commit.
- Otherwise, leave task tracking unchanged and hand off the written QA artifacts as pending verification.

Open questions (UNCONFIRMED if needed):

- Should the unrelated, user-modified web type error in `web/src/systems/session/hooks/use-session-actions.ts` be fixed as part of clearing the repo gate for task_09?

Working set (files/ids/commands):

- `.compozy/tasks/unified-capabilities/_techspec.md`
- `.compozy/tasks/unified-capabilities/_tasks.md`
- `.compozy/tasks/unified-capabilities/task_0{1..10}.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-001.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-002.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-003.md`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/agents/capabilities.md`
- `packages/site/content/protocol/*`
- `packages/site/content/runtime/core/agents/*`
- `internal/api/contract/contract.go`
- `web/src/systems/network/*`
- `git status --short`
- `make verify`
- `web/src/systems/session/hooks/use-session-actions.ts`
