Goal (incl. success criteria):

- Decompose `settings-ui` into detailed, independently implementable task files under `.compozy/tasks/settings-ui/`, using the approved TechSpec and ADRs as the source of truth because `_prd.md` is absent.
- Success means: derive a clean execution sequence with explicit dependencies, get user approval on the breakdown, then generate `_tasks.md` and enriched `task_XX.md` files that pass `compozy validate-tasks --name settings-ui`.

Constraints/Assumptions:

- Follow `cy-create-tasks` workflow: load task types, read `_techspec.md` and ADRs, explore the codebase, present the task breakdown for approval, and only then write task files.
- `_prd.md` does not exist in `.compozy/tasks/settings-ui/`; task decomposition relies on the TechSpec, ADRs, and local code exploration.
- `.compozy/config.toml` is absent, so task `type` values fall back to the built-in defaults: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.
- Do not touch unrelated worktree changes.
- User wants communication in Portuguese.
- When presenting options or a preferred path, explicitly mark the recommendation with `(recomendado)`.

Key decisions:

- Keep the task graph aligned to the revised TechSpec and ADRs, not the older analysis docs.
- Decompose by true dependency layers: config persistence -> settings orchestration -> contracts/transports -> restart runtime -> web shell/system -> section pages.
- Avoid mega-tasks by grouping related settings pages into coherent UI slices instead of one task per screen.
- Keep tests embedded in each implementation task; do not create testing-only tasks.
- Treat sidebar entry and settings shell as part of the same frontend dependency chain to avoid dead navigation.

State:

- Completed.

Done:

- Completed the full TechSpec and ADR review/revision cycle for `settings-ui`, including the restart-helper decision, MCP target semantics, HTTP security posture, and runtime-apply matrix.
- Confirmed `.compozy/tasks/settings-ui/` now contains `_techspec.md` plus `adrs/`, but still no `_prd.md`.
- Read the `cy-create-tasks` skill, task template, and task context schema.
- Confirmed `.compozy/config.toml` is absent, so task types fall back to the built-in defaults.
- Explored current backend boundaries across `internal/config`, `internal/api/{contract,core,httpapi,udsapi,spec}`, `internal/daemon`, and `internal/cli/daemon.go`.
- Explored current frontend boundaries across `web/src/components/app-sidebar.tsx`, `web/src/routes/_app/*`, `web/src/hooks/routes/use-automation-page.ts`, and the existing route test layout.
- Spawned backend/frontend explorers for task-oriented boundary mapping and collected both results.
- Confirmed the backend natural order is config persistence -> settings service -> contracts/transports -> restart runtime.
- Confirmed the frontend natural order is sidebar entry -> settings route shell -> `web/src/systems/settings` -> shared route hook -> section page clusters.
- Wrote `.compozy/tasks/settings-ui/_tasks.md` plus `task_01.md` through `task_14.md` with full template sections, dependencies, deliverables, and tests.
- Ran `compozy validate-tasks --name settings-ui` and it passed with `all tasks valid (14 scanned)`.
- Ran `git diff --check -- .compozy/tasks/settings-ui .codex/ledger/2026-04-17-MEMORY-settings-ui-techspec.md` and it passed.
- Ran `make verify` and it passed cleanly, including web checks, Go test suite, and package-boundary verification.

Now:

- No active editing. Task files were generated and validated successfully.

Next:

- Natural follow-up is to execute the generated tasks in dependency order, starting from `task_01` (recomendado).

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Task docs: `.compozy/tasks/settings-ui/_techspec.md`, `.compozy/tasks/settings-ui/_tasks.md`, `.compozy/tasks/settings-ui/task_{01..14}.md`, `.compozy/tasks/settings-ui/adrs/adr-{001,002,003,004}.md`
- Session ledger: `.codex/ledger/2026-04-17-MEMORY-settings-ui-techspec.md`
- Workflow refs: `.agents/skills/cy-create-tasks/SKILL.md`, `.agents/skills/cy-create-tasks/references/{task-template,task-context-schema}.md`
- Validation commands: `compozy validate-tasks --name settings-ui`, `git diff --check -- .compozy/tasks/settings-ui .codex/ledger/2026-04-17-MEMORY-settings-ui-techspec.md`
- Explorer agents: backend and frontend explorers were used for task-boundary discovery and then closed
