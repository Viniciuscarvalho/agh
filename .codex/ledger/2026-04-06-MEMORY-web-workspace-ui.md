Goal (incl. success criteria):

- Complete workspace-entity task_13 by making the React SPA workspace-aware: add workspace queries, update session payload handling to `workspace_id`/`workspace_path`, add workspace selection for session creation, filter/group sessions by workspace in the sidebar, update tests, pass web verification plus `make verify`, then update tracking and create one local code-only commit.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, `web/CLAUDE.md`, workflow memory, `task_13.md`, `_tasks.md`, `_techspec.md`, ADR-001..004, tracking checklist, and related workspace ledgers.
- Scope stays inside `web/` unless a backend contract mismatch blocks implementation; the backend contract from task_10 is treated as source of truth.
- The `.compozy/tasks/workspace-entity/` tree is untracked and should remain out of the code commit unless repository policy changes.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- Treat the PRD + TechSpec as the approved design for this run and skip a separate brainstorming approval round.
- Add a dedicated `web/src/systems/workspace/` system instead of overloading the session system, following the app-renderer-systems dependency flow.
- Use a workspace filter/selector in the shell as the single source for session creation scope; minimal UX will surface the active workspace and show workspace badges on session rows.
- Match the new HTTP contract directly: session payloads expose `workspace_id` and `workspace_path`, create-session requests send either `workspace` or `workspace_path`, and workspace registry data comes from `/api/workspaces`.

State:

- Task complete. Code changes are committed and the post-commit verification gate passed.

Done:

- Read repository instructions, required skill docs, workflow memory, PRD docs, ADRs, and related ledgers.
- Confirmed the backend/frontend contract gap: current web code still uses `workspace` path-only payloads and has no workspace system or selector UI.
- Inspected current session system, sidebar shell, tests, and HTTP API workspace/session payloads.
- Built the execution checklist and captured the pre-change signal from the current codebase.
- Added `web/src/systems/workspace/` with Zod payload schemas, list/resolve adapters, TanStack Query hooks, query keys/options, barrel exports, and Vitest coverage.
- Updated session schemas/adapters/query keys/hooks to require `workspace_id` and `workspace_path`, accept `workspace_path` on create, and support workspace-filtered session list queries.
- Wired the app shell/sidebar to select a registered workspace, filter sessions by the selected workspace ID, disable agent new-session actions when no workspace is available, and show workspace metadata on session rows.
- Updated the session route/header to resolve and display workspace names from the workspace registry alongside the stable `workspace_id`.
- Added or refreshed Vitest coverage for the new workspace system, session hooks/adapters/schemas, sidebar flow, session header/item, route integration, and agent sidebar disable state.
- Ran `make web-typecheck`, `make web-test`, `make web-lint`, `make verify`, and a fresh post-commit `make verify` successfully.
- Updated workflow memory/task tracking and created the local code-only commit `db08303` (`feat: add workspace-aware web sessions`).

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `web/src/components/app-sidebar.tsx`, `web/src/components/app-sidebar.test.tsx`, `web/src/routes/_app/session.$id.tsx`, `web/src/routes/_app/-session.$id.test.tsx`, `web/src/systems/session/**`, `web/src/systems/agent/components/agent-sidebar-group.{ts,tsx}`, new `web/src/systems/workspace/**`, workflow memory/task tracking files.
- Commands: `rg -n 'workspace|workspace_id|workspace_path' web/src internal/httpapi`, `make web-lint`, `make web-typecheck`, `make web-test`, `make verify`, `git status --short`, `git diff --stat -- web/src`, `git commit -m "feat: add workspace-aware web sessions"`.
