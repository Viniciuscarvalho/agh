## Goal (incl. success criteria):

- Complete remaining `.compozy/tasks/storybook-stories` work: task_05 through task_11.
- Success requires typed MSW mocks for all systems, Storybook stories for remaining system components, SKILL doc alignment, and green verification (`make web-lint`, `make web-typecheck`, both Storybook builds, plus task-relevant tests).

## Constraints/Assumptions:

- Must follow repo `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`.
- Must use root-cause fixes only; no workarounds, suppressions, or unsafe casts.
- Do not touch unrelated user changes; current worktree shows only untracked `.compozy/tasks/storybook-stories/`.
- Existing workflow memory says tasks 01–04 are already complete and verified.
- Treat the techspec/task docs as the approved design for implementation continuity.

## Key decisions:

- Focus only on pending tasks 05–11; do not rework finished dual-Storybook/bootstrap tasks unless verification exposes a root-cause issue.
- Use real adapter paths/types as the source of truth for mocks and stories, even if task wording drifts from current code.

## State:

- Completed.

## Done:

- Read required instruction files and skill docs: `no-workarounds`, `storybook-stories`, `react`, `tailwindcss`, `vercel-react-best-practices`, `app-renderer-systems`, `tanstack-query-best-practices`, `tanstack-router-best-practices`, `vitest`, `testing-anti-patterns`.
- Read `_techspec.md`, `_tasks.md`, task_05, task_06, workflow memory, and another agent ledger.
- Confirmed tasks 01–04 are already implemented in the repo.
- Added typed MSW mock triples for all nine systems and composed them in `web/.storybook/preview.ts`.
- Hardened Storybook preview with placeholder routes for linked app surfaces (`/session/$id`, `/automation`, `/bridges`, `/network`, `/knowledge`, `/skills`).
- Added Storybook config/MSW contract tests under `web/src/storybook/`.
- Authored task_06 small-system story modules for agent, daemon, knowledge, workspace, and skill components.
- Authored the remaining task_07, task_08, task_09, and task_10 story modules plus the extra session tool fixtures they depend on.
- Updated `.agents/skills/storybook-stories/SKILL.md` to reflect `@agh/ui`, the dual-Storybook split, the autodocs policy, and the rollout references.
- Fixed a real accessibility defect in `web/src/systems/session/components/message-composer.tsx` after the sampled addon-a11y pass surfaced a critical `button-name` violation.
- Fresh verification is green: `make web-lint`, `make web-typecheck`, `bun run --cwd web build-storybook`, `bun run --cwd packages/ui build-storybook`, the sampled addon-a11y pass, `bunx vitest run src/systems/session/components/message-composer.test.tsx`, and `make verify`.

## Now:

- Final reporting only.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- None.

## Working set (files/ids/commands):

- `.compozy/tasks/storybook-stories/_techspec.md`
- `.compozy/tasks/storybook-stories/_tasks.md`
- `.compozy/tasks/storybook-stories/task_05.md`
- `.compozy/tasks/storybook-stories/task_06.md`
- `.compozy/tasks/storybook-stories/task_07.md`
- `.compozy/tasks/storybook-stories/task_08.md`
- `.compozy/tasks/storybook-stories/task_09.md`
- `.compozy/tasks/storybook-stories/task_10.md`
- `.compozy/tasks/storybook-stories/memory/MEMORY.md`
- `web/.storybook/preview.ts`
- `web/src/storybook/*`
- `web/src/systems/*/mocks/*`
- `web/src/systems/*/components/stories/*`
- `.agents/skills/storybook-stories/SKILL.md`
