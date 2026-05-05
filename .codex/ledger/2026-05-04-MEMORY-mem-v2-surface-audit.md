Goal (incl. success criteria):

- Read-only audit of `.compozy/tasks/mem-v2/_techspec.md` for Web/Docs Impact and Extensibility / Agent Manageability / Config Lifecycle completeness using `cy-web-docs-impact` expectations.
- Success means returning: 1) missing or incomplete downstream impact items with file:line refs, 2) whether the spec is task-generation ready on these surfaces, 3) concrete task buckets needed to cover them.

Constraints/Assumptions:

- No edits to product/spec/code files; review only.
- Must anchor conclusions to local repo evidence and actual surface paths.
- Focus is downstream surfaces: CLI verbs, HTTP/UDS, native tools, `web/` systems, `packages/site`, codegen, hooks/extensions/providers/config.

Key decisions:

- Use `cy-web-docs-impact` as the governing audit rubric.
- Compare spec path claims against actual repo structure before calling items complete.
- Treat nearby mem-v2 ledgers as awareness only; independently verify the current TechSpec and repo layout.

State:

- Evidence gathered; final audit being synthesized.

Done:

- Loaded `cy-web-docs-impact` plus `internal/CLAUDE.md`, `web/CLAUDE.md`, and `packages/site/CLAUDE.md`.
- Read current mem-v2 TechSpec sections for API surfaces, Web/Docs Impact, Impact Analysis, and sequencing.
- Mapped actual repo surfaces for web knowledge/settings systems, API route registration, site runtime/api/cli docs, and config tool-surface keys.
- Read nearby mem-v2 ledgers for cross-agent awareness.
- Confirmed key surface gaps: wrong `packages/site/content/docs/*` targets vs actual `content/runtime/*`; web impact reduced to `web/src/routes/memory/*` while actual memory UI lives under `knowledge` + `settings`; transport/config/extensibility coverage omits several concrete files.

Now:

- Writing final findings, readiness verdict, and task buckets.

Next:

- None after final response.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/mem-v2/_techspec.md`
- `.agents/skills/cy-web-docs-impact/SKILL.md`
- `.agents/skills/cy-web-docs-impact/references/audit-triggers.md`
- `web/src/routes/_app/knowledge.tsx`
- `web/src/routes/_app/settings/memory.tsx`
- `web/src/systems/knowledge/**`
- `web/src/systems/settings/**`
- `packages/site/content/runtime/**`
- `internal/api/httpapi/routes.go`
- `internal/api/udsapi/routes.go`
- `internal/config/tool_surface.go`
