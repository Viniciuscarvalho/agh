Goal (incl. success criteria):

- Read-only exploration for native ACP auth implementation impact on web/settings provider UI and generated type usage.
- Return exact files/tests needing changes for provider auth fields auth_mode, env_policy, home_policy, auth_status_command, auth_login_command, and auth_status row on provider items.
  Constraints/Assumptions:
- Do not edit product/source/test files.
- Conversation in Brazilian Portuguese; artifacts/code paths in English.
- Must inspect web/CLAUDE.md for web-related work.
  Key decisions:
- Focus on web/settings provider UI and generated OpenAPI type usage only.
  State:
- Completed.
  Done:
- Loaded web/CLAUDE.md.
- Scanned related settings/provider ledgers for context.
- Inspected settings provider route, route hook, provider card/grid, settings API adapter, generated OpenAPI type usage, fixtures, handlers, stories, and relevant tests.
  Now:
- Summarize exact files and suggested assertions.
  Next:
- None.
  Open questions (UNCONFIRMED if needed):
- None.
  Working set (files/ids/commands):
- .codex/ledger/2026-05-03-MEMORY-acp-auth-web.md
- web/src/generated/agh-openapi.d.ts
- web/src/lib/settings-api-contract.test.ts
- web/src/systems/settings/types.ts
- web/src/hooks/routes/use-settings-providers-page.ts
- web/src/routes/\_app/settings/providers.tsx
- web/src/systems/settings/components/provider-card.tsx
- web/src/systems/settings/components/providers-grid.tsx
- web/src/systems/settings/mocks/fixtures.ts
- web/src/systems/settings/mocks/handlers.ts
- web/src/systems/settings/adapters/settings-api.test.ts
- web/src/hooks/routes/use-settings-providers-page.test.tsx
- web/src/routes/\_app/settings/-providers.test.tsx
- web/src/routes/\_app/settings/stories/-providers.stories.tsx
