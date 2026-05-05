Goal (incl. success criteria):

- Read-only exploration for mem-v2 task generation, focused on concrete `web/`, `packages/site/`, generated TS/OpenAPI, docs, settings, and user-facing surfaces impacted by the repaired TechSpec.
- Success means delivering: 1) grouped frontend/docs slices with concrete paths, 2) backend contract/codegen coupling, 3) dependency recommendations and QA/e2e implications.

Constraints/Assumptions:

- No product/spec/code edits; exploration only.
- Must ground conclusions in current repo paths and the approved mem-v2 TechSpec + ADRs.
- Nearby mem-v2 ledgers are awareness-only; current file contents win.

Key decisions:

- Use `cy-web-docs-impact` as the audit rubric.
- Focus on actual route files, systems modules, generated type/codegen touchpoints, runtime docs pages, and tests rather than abstract surface labels.
- Treat the current two-scope/file-based UI/docs model as the baseline delta because many surfaces hardcode `global|workspace` or describe file-only behavior.

State:

- Evidence gathered; synthesizing final grouped slices and dependency recommendations.

Done:

- Read `web/CLAUDE.md`, `packages/site/CLAUDE.md`, mem-v2 TechSpec, ADR corpus, `cy-web-docs-impact`, and trigger reference.
- Scanned related mem-v2 ledgers for cross-agent awareness.
- Mapped concrete web surfaces: knowledge route/system, memory settings route/system, session inspector memory panel, generated type dependencies, MSW/stories/tests.
- Mapped concrete site surfaces: runtime memory docs tree, CLI memory reference tree, configuration/workspaces/agents/sessions/extensions/hooks docs, runtime navigation, and docs truth tests.
- Mapped backend/codegen coupling: HTTP + UDS memory routes, contract payloads, current memory scope validation, CLI memory commands, builtin memory tools, config structs/validation, generated OpenAPI TS outputs.
- Mapped QA/e2e surfaces: HTTP/UDS memory tests, transport parity, daemon memory e2e, web route tests/stories, docs truth tests.

Now:

- Writing the final impact slices, codegen coupling notes, and dependency order for task generation.

Next:

- None after final response.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/mem-v2/_techspec.md`
- `.compozy/tasks/mem-v2/adrs/*.md`
- `.agents/skills/cy-web-docs-impact/SKILL.md`
- `web/src/routes/_app/knowledge.tsx`
- `web/src/hooks/routes/use-knowledge-page.ts`
- `web/src/systems/knowledge/**`
- `web/src/routes/_app/settings/memory.tsx`
- `web/src/hooks/routes/use-settings-memory-page.ts`
- `web/src/systems/settings/{types.ts,adapters/settings-api.ts,mocks/**}`
- `web/src/systems/session/components/session-inspector.tsx`
- `web/src/generated/agh-openapi.d.ts`
- `internal/api/{contract,httpapi,udsapi,core}/**`
- `internal/cli/memory.go`
- `internal/tools/builtin/memory.go`
- `internal/config/config.go`
- `internal/codegen/openapits/generate.go`
- `packages/site/content/runtime/{core,cli-reference}/**`
- `packages/site/lib/runtime-*.test.ts`
