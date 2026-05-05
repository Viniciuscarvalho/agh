Goal (incl. success criteria):

- Implement the accepted progressive-disclosure fix for skills so metadata loads eagerly, skill bodies load lazily on explicit read, backend/API/CLI/web all use the same model, targeted tests pass, and `make verify` passes.

Constraints/Assumptions:

- Must preserve unrelated user changes in the dirty worktree, including in `internal/api/core/*` and `internal/skills/*`.
- Must follow `systematic-debugging`, `no-workarounds`, `golang-pro`, and `testing-anti-patterns`.
- Workspace-specific enable/disable behavior already has local edits and must be preserved.
- Plan persistence is required under `.codex/plans/`.

Key decisions:

- `skills.Skill` becomes metadata-only; body content is no longer stored on the in-memory registry object.
- Content reads will be explicit and routed through the registry for both API and CLI.
- Web detail view will fetch content only on `View full content` click, not on selection.

State:

- Completed.

Done:

- Investigated root cause from `.compozy/tasks/extensability/analysis.md`.
- Confirmed prompt catalog is already metadata-only; eager loading problem is in the skill model/registry/API/UI contracts.
- Captured current dirty-worktree diffs in overlapping files to avoid overwriting user changes.
- Persisted accepted implementation plan under `.codex/plans/`.
- Refactored `internal/skills` so `Skill` is metadata-only, file parsing no longer stores body on the struct, and `Registry.LoadContent(ctx, skill)` performs explicit lazy loads for filesystem and bundled skills.
- Updated API contract/core/transports so list/detail endpoints are metadata-only and `GET /api/skills/:name/content` returns the body explicitly in both HTTP and UDS paths.
- Updated CLI `agh skill view` and marketplace install verification to load content explicitly instead of depending on preloaded `skill.Content`.
- Updated the web skill system to split metadata and content queries, fetch full content only on explicit click, render loading/error/empty/full-content states, and support retry after failed content fetch.
- Fixed mutation cache invalidation so enable/disable refreshes list, detail, and content query caches for the affected skill/workspace.
- Verified targeted Go packages with `go test ./internal/skills ./internal/skills/bundled ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/cli -count=1`.
- Verified targeted web suites with `bunx vitest run web/src/systems/skill/types.test.ts web/src/systems/skill/adapters/skill-api.test.ts web/src/systems/skill/hooks/use-skills.test.tsx web/src/systems/skill/hooks/use-skill-actions.test.tsx web/src/routes/_app/-skills.test.tsx`.
- Passed `make web-lint`, `make web-typecheck`, and `make verify`.
- Updated `.compozy/tasks/extensability/analysis.md` to mark P6/progressive disclosure as implemented on 2026-04-09.

Now:

- Final state recorded; ready to hand off.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/skills/{types,loader,registry}.go`, `internal/api/{contract,core,httpapi,udsapi}`, `internal/cli/skill.go`, `web/src/systems/skill/*`, `web/src/routes/_app/{skills,-skills.test.tsx}`.
- Commands: `rg`, `sed`, `git diff -- <paths>`, targeted `go test`, targeted `bunx vitest run`, `make web-lint`, `make web-typecheck`, `make verify`.
