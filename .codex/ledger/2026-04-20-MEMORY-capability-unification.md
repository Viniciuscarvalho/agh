Goal (incl. success criteria):

- Decompose `.compozy/tasks/unified-capabilities/_techspec.md` into executable tasks, including one dedicated task for `web/`, one dedicated task for `packages/site`, and the two final QA tasks for `qa-report` and `qa-execution`.
- Success means: grounded codebase-informed task boundaries, explicit user approval of the breakdown, generated `_tasks.md` plus enriched `task_NN.md` files, and successful `compozy tasks validate --name unified-capabilities`.

Constraints/Assumptions:

- Must follow repository instructions from `AGENTS.md` and `CLAUDE.md`, including the session ledger requirement and avoiding destructive git commands.
- Must use the `cy-create-tasks` workflow: load templates, gather codebase context, present the breakdown for approval before writing, then validate generated tasks.
- `.compozy/config.toml` is absent, so allowed task `type` values fall back to built-in defaults: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.
- User preference: continue in PT-BR.
- User preference: when presenting options, always mark the recommended choice with `(recomendado)`.
- User explicitly wants the last two tasks to be `qa-report` and `qa-execution`, plus a specific task for `web/` and another for `packages/site`.

Key decisions:

- Use `.compozy/tasks/unified-capabilities/_techspec.md` as the source of truth; there is no `_prd.md`.
- Keep task boundaries aligned with real code ownership seams:
  - config/session model
  - network wire model
  - network routing/lifecycle behavior
  - API/discovery surface
  - repo docs
  - web app
  - packages/site docs
  - qa-report
  - qa-execution
- Use the existing `.compozy/tasks/agent-capabilities/` task set as the formatting and QA-structure reference.

State:

- in_progress

Done:

- Read the current `capability-unification` ledger and scanned related `agent-capabilities` / network RFC ledgers.
- Read `.compozy/tasks/unified-capabilities/_techspec.md` and ADRs 001-003.
- Read `cy-create-tasks` task template and frontmatter schema.
- Read the existing `.compozy/tasks/agent-capabilities/_tasks.md` and representative task files, including the final `qa-report` / `qa-execution` tasks.
- Confirmed `.compozy/config.toml` is absent, so default task types apply.
- Read web-specific instructions in `web/AGENTS.md` and `web/CLAUDE.md`.
- Mapped likely implementation surfaces:
  - backend/runtime/network: `internal/config`, `internal/session`, `internal/network`, `internal/api`
  - repo docs: `docs/rfcs/003_agh-network-v0.md`, `docs/agents/capabilities.md`
  - web app: `web/src/routes/_app/network.tsx`, `web/src/systems/network/**`, `web/src/hooks/routes/use-network-page.ts`
  - site docs: `packages/site/content/protocol/**`, `packages/site/content/runtime/core/agents/capabilities.mdx`, `packages/site/content/protocol/meta.json`
- Created the new task directory and saved the approved TechSpec and ADRs there during the prior phase.
- Spawned codebase exploration subagents for:
  - backend/runtime/network task slicing
  - web/site surface analysis

Now:

- Present the proposed task breakdown for approval before generating task files.

Next:

- If approved, write `_tasks.md` and `task_NN.md` files under `.compozy/tasks/unified-capabilities/`.
- Run `compozy tasks validate --name unified-capabilities` and fix any validation issues.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: exact count of implementation tasks before the final two QA tasks. Current recommendation is 7 implementation tasks + 2 QA tasks.
- UNCONFIRMED: whether unresolved `requirements` should be allowed as remote references or rejected during local validation. The TechSpec leaves this for implementation-time resolution.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-capability-unification.md`
- `.compozy/tasks/unified-capabilities/_techspec.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-001.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-002.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-003.md`
- `.agents/skills/cy-create-tasks/references/task-template.md`
- `.agents/skills/cy-create-tasks/references/task-context-schema.md`
- `.compozy/tasks/agent-capabilities/_tasks.md`
- `.compozy/tasks/agent-capabilities/task_01.md`
- `.compozy/tasks/agent-capabilities/task_06.md`
- `.compozy/tasks/agent-capabilities/task_07.md`
- `web/AGENTS.md`
- `web/src/routes/_app/network.tsx`
- `web/src/systems/network/**`
- `packages/site/content/protocol/message-kinds.mdx`
- `packages/site/content/protocol/capability-discovery.mdx`
- `packages/site/content/protocol/recipes.mdx`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/agents/capabilities.md`
