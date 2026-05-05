Goal (incl. success criteria):

- Implement the accepted web-shell/workspace plan end-to-end: add the daemon contract needed for one-click global workspace setup, centralize active workspace state, make the add-workspace flow real, add first-run onboarding, and align `knowledge`/`skills` shell styling with the Paper reference.
- Success means the workspace setup flow works from both first-run onboarding and the sidebar `+` button, `knowledge`/`skills` honor the selected workspace, the shell styling drift is corrected, relevant tests pass, and `make verify` is green.

Constraints/Assumptions:

- Must follow root `AGENTS.md` and `CLAUDE.md`, including no destructive git commands and `make verify` before completion.
- User explicitly requested `interface-design`, `no-workarounds`, and `systematic-debugging`; fix root causes instead of patching symptoms.
- Accepted plan must be persisted under `.codex/plans/` and this ledger must be kept current for compaction resilience.
- Worktree was clean before edits started.
- Default assumption: UI copy stays in English, and "global workspace" means the OS user home directory, not `~/.agh`.

Key decisions:

- Expose the OS user home directory through daemon status so the onboarding CTA can complete in one click without manual path entry.
- Centralize active workspace selection in the web workspace system instead of keeping route-local `workspaces[0]` fallbacks.
- Reuse one workspace setup component for both onboarding and sidebar-triggered registration.
- Standardize the route chrome through shared shell primitives instead of duplicating ad hoc styling in `knowledge` and `skills`.

State:

- Completed.

Done:

- Read current repo instructions, prior workspace-web ledger, and the accepted plan context.
- Confirmed root causes from code inspection:
  - `knowledge` and `skills` hardcode the first workspace instead of using the selected workspace.
  - The sidebar add-workspace button is a dead control with no handler.
  - The inner list rails for `knowledge` and `skills` use the same surface tone as the global sidebar.
  - The route toggle pills are hand-coded and stylistically drifted from the Paper design.
  - The first-run no-workspace experience is not implemented.
- Persisted the accepted plan artifact for this task.
- Extended daemon status end-to-end with `daemon.user_home_dir`, updated backend handler tests, regenerated OpenAPI artifacts, and wired the web daemon status adapter/hook.
- Added shared workspace state via `useActiveWorkspace` + Zustand store and migrated `_app`, `knowledge`, and `skills` off route-local `workspaces[0]` fallback logic.
- Implemented reusable workspace setup UI for both first-run onboarding and the sidebar add-workspace dialog, including one-click global workspace registration and client-side absolute-path validation for manual registration.
- Fixed shell styling drift: outer sidebar right border, distinct inner rail surface for `knowledge`/`skills`, and compact shared pill buttons with dark active foreground.
- Repaired route tests to target the new active-workspace contract and added coverage for onboarding, add-workspace behavior, daemon status parsing, and workspace setup flows.
- Verification passed:
  - `make web-lint`
  - `make web-typecheck`
  - `bun run --cwd web test:raw` -> 55 files, 501 tests passed
  - `make verify` -> passed
- Follow-up regression fix after user screenshot review:
  - Identified root cause in onboarding layout: the setup options were rendered as a 2-column grid inside the onboarding page's constrained right rail, collapsing both cards.
  - Changed onboarding options to a single constrained vertical rail and tightened the outer onboarding grid column sizing.
  - Added a regression test that asserts the onboarding options rail stays stacked instead of returning to a 2-column layout.
  - Re-ran verification:
    - `bun run --cwd web test:raw src/systems/workspace/components/workspace-setup.test.tsx`
    - `bun run --cwd web typecheck:raw`
    - `make verify` -> passed on clean rerun
- Follow-up polish fix after user screenshot review:
  - Identified workspace avatar highlight clipping in the icon rail: active avatars used an outer `ring`, which could be visually cut in the narrow rail.
  - Replaced the outer ring with a reserved in-box `border-2 border-transparent` base plus active accent border in the sidebar avatar button styling.
  - Updated the sidebar test to assert accent border styling instead of ring styling.
  - Re-ran verification:
    - `bun run --cwd web test:raw src/components/app-sidebar.test.tsx`
    - `bun run --cwd web typecheck:raw`
    - `make verify` -> passed

Now:

- Final state captured in ledger; ready to hand off with onboarding regression fixed.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/plans/2026-04-10-web-shell-workspace-onboarding.md`
- `.codex/ledger/2026-04-10-MEMORY-web-shell-workspaces.md`
- `internal/api/contract/contract.go`
- `internal/api/core/handlers.go`
- `internal/api/core/more_coverage_test.go`
- `internal/api/httpapi/handlers_test.go`
- `openapi/agh.json`
- `web/src/routes/_app.tsx`
- `web/src/routes/-_app.test.tsx`
- `web/src/routes/_app/knowledge.tsx`
- `web/src/routes/_app/-knowledge.test.tsx`
- `web/src/routes/_app/skills.tsx`
- `web/src/routes/_app/-skills.test.tsx`
- `web/src/components/app-sidebar.tsx`
- `web/src/components/app-sidebar.test.tsx`
- `web/src/components/design-system/pill-button.tsx`
- `web/src/systems/workspace/**`
- `web/src/systems/workspace/components/workspace-setup.tsx`
- `web/src/systems/workspace/components/workspace-setup.test.tsx`
- `web/src/systems/daemon/**`
- `web/src/systems/knowledge/components/knowledge-list-panel.tsx`
- `web/src/systems/skill/components/skill-list-panel.tsx`
- `web/src/systems/skill/components/marketplace-view.tsx`
- `web/src/styles.css`
- Commands: `rg`, `sed`, `git status --short`, `make web-lint`, `make web-typecheck`, `bun run --cwd web test:raw`, `make verify`
