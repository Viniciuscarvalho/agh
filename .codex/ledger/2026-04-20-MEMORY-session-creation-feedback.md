Goal (incl. success criteria):

- Implement visible pending feedback when creating a new session from the web sidebar so the clicked agent shows clear progress, a temporary `starting...` row appears before route navigation completes, errors surface via toast, and the final web/repo verification passes.

Constraints/Assumptions:

- Must follow root and `web/` instructions, including no destructive git commands and passing `make web-lint` plus `make web-typecheck` before completion; `make verify` is the repo-wide blocking gate.
- Accepted implementation direction: show a per-agent spinner plus a temporary pending row in the sidebar while the create mutation and navigation are in flight.
- Only one session creation is allowed at a time.
- Existing unrelated worktree edits, especially in `web/src/components/app-sidebar.tsx` and other web files, must remain intact.

Key decisions:

- Fix the root cause in the create-session data flow instead of adding a generic banner: the mutation will expose data/cache effects, while route orchestration will own pending UX and navigation timing.
- Keep the pending feedback local to the clicked agent and serialise all session creation while one mutation is active.
- Seed the new session into query cache immediately after creation so the UI has deterministic data before background revalidation.

State:

- Completed.

Done:

- Investigated the original “missing composer” report and verified the session route renders correctly once loaded.
- Confirmed the real UX bug: clicking create session provides no visible loading state, only disabled controls.
- Traced the root cause to `useCreateSession` + `useAppLayout` + `AppSidebar`: the mutation navigates on success, while the sidebar only receives a coarse `isCreatingSession` boolean and renders no pending UI.
- Read applicable skills and repo instructions for debugging, React, styling, and test hygiene.
- Persisted the accepted implementation plan artifact for this task.
- Refactored `useCreateSession` to seed the created session into detail/list caches, avoid duplicate list entries, and trigger background invalidation without owning navigation.
- Refactored `useAppLayout` to own the full create-session lifecycle: pending state starts at click, survives until navigation settles, and clears on error with `toast.error(...)`.
- Updated the sidebar to show a spinner on the clicked agent, keep all create buttons disabled during creation, and render a temporary `starting...` row under the matching agent/workspace.
- Added focused tests for the new mutation cache behavior, app layout pending lifecycle, sidebar pending UI, and the `_app` router mock path.
- Verification passed:
  - `bunx vitest run web/src/systems/session/hooks/use-session-actions.test.tsx web/src/hooks/routes/use-app-layout.test.tsx web/src/components/app-sidebar.test.tsx web/src/routes/-_app.test.tsx`
  - `bunx tsc --noEmit -p web/tsconfig.json`
  - `make web-lint`
  - `make web-typecheck`
  - `make verify`

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Files: `web/src/systems/session/hooks/use-session-actions.ts`, `web/src/hooks/routes/use-app-layout.ts`, `web/src/components/app-sidebar.tsx`, `web/src/components/app-sidebar.test.tsx`, `web/src/systems/session/hooks/use-session-actions.test.tsx` (or equivalent), `.codex/plans/2026-04-20-session-creation-feedback.md`.
- Commands: `git status --short`, `rg -n "isCreatingSession|onNewSession|createSession" web/src`, `bunx vitest run ...`, `make web-lint`, `make web-typecheck`, `make verify`.
