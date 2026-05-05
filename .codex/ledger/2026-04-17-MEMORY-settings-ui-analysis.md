Goal (incl. success criteria):

- Explore the frontend codebase for the `settings-ui` decomposition implied by `.compozy/tasks/settings-ui/_techspec.md`.
- Success means producing a concise, task-oriented breakdown of frontend implementation slices, file clusters, dependency ordering, and coupling risks for sidebar nav, settings routes, settings hooks, `web/src/systems/settings`, section pages, and tests.

Constraints/Assumptions:

- Do not touch unrelated worktree changes.
- Use local code search for repository analysis; no web search for project code.
- Paper file `AGH` page includes 10 `AGH Settings` artboards mirrored under `docs/design/paper/settings/`.
- User asked for analysis docs, not UI implementation in this turn.

Key decisions:

- Use local code search and the approved settings tech spec as the source of truth.
- Reuse existing route and system patterns from `network`, `automation`, `skills`, `knowledge`, and `workspace` as the frontend implementation baseline.
- Treat `web/src/components/app-sidebar.tsx`, `web/src/routes/_app.tsx`, `web/src/hooks/routes/*`, and `web/src/systems/*` as the main integration surface for the settings UI work.

State:

- In progress.

Done:

- Read root instructions and scanned related ledgers for settings-ui context.
- Located `.compozy/tasks/settings-ui/_techspec.md` and the current web route / system layout.
- Mapped the current app shell, sidebar, and existing route pattern used by `automation`, `network`, `skills`, `knowledge`, and `bridges`.
- Identified the main frontend clusters likely to change for settings UI: sidebar navigation, nested `/settings/*` routes, a dedicated `web/src/systems/settings` domain, route-level hooks, section pages, and route/system tests.

Now:

- Drafting the concise task breakdown for the user.

Next:

- Optional follow-up: turn the breakdown into a full task file set under `.compozy/tasks/settings-ui/`.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the settings shell should live in `web/src/routes/_app/settings.tsx` only, or also extract a reusable shell component into `web/src/systems/settings/components/`.
- UNCONFIRMED: whether the collection-heavy screens (`providers`, `mcp-servers`, `environments`, `hooks`) should share a single page hook or split into section-specific hooks from the start.

Working set (files/ids/commands):

- Tech spec: `.compozy/tasks/settings-ui/_techspec.md`
- App shell: `web/src/routes/_app.tsx`, `web/src/components/app-sidebar.tsx`, `web/src/hooks/routes/use-app-layout.ts`
- Route patterns: `web/src/routes/_app/{automation,network,skills,knowledge,bridges}.tsx`
- Route hooks: `web/src/hooks/routes/use-{automation,network,skills,knowledge,bridges}-page.ts`
- Domain patterns: `web/src/systems/{automation,network,skill,knowledge,bridges,workspace}/*`
- Tests: `web/src/routes/_app/-*.test.tsx`, `web/src/components/app-sidebar.test.tsx`
- Commands/tools: `rg`, `find`, `sed`
