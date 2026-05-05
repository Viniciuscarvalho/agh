Goal (incl. success criteria):

- Implement first-class Vault extensibility: safe CRUD over CLI/HTTP/UDS, generated contracts, docs/site, Settings Vault UI, and session-scoped Vault UI.
- Success: no plaintext Vault read surface; `vault:sessions/<session_id>/<name>` is valid; web/docs/codegen/tests are updated.
  Constraints/Assumptions:
- Do not run destructive git commands.
- Worktree has many pre-existing edits; do not revert unrelated files.
- Accepted plan is persisted under `.codex/plans/2026-05-02-vault-extensibility.md`.
- Public Vault reads return metadata only; writes are write-only; HTTP Vault routes are loopback-guarded; UDS remains the local agent surface.
  Key decisions:
- Web scope: global Settings Vault page plus session inspector Vault panel.
- Session namespace: `vault:sessions/<session_id>/<name>`.
- Public operations: safe CRUD only; no plaintext resolve endpoint or CLI command.
  State:
- Complete.
  Done:
- Read workspace guidance, backend/web/site instructions, relevant skills, and prior Vault/extensibility ledgers.
- User accepted the proposed plan.
- Implemented Vault namespace validation for `sessions`, shared contract DTOs, core handlers, HTTP/UDS route wiring, daemon injection, CLI client methods, and `agh vault` list/get/put/delete commands.
- Added focused Go tests for Vault CLI, core handlers, and session namespace validation.
- Added OpenAPI Vault route/schema tests.
- Focused checks passed: `go test ./internal/cli -run 'TestVaultCommands|^$'`; `go test ./internal/vault ./internal/api/core ./internal/cli -run 'TestSecretRefValidationSupportsSessionNamespace|TestVaultHandlers|TestVaultCommands'`; `go test ./internal/api/spec -run 'TestVaultRoutesAndSchemas'`; `go test ./internal/vault ./internal/api/contract ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/api/spec ./internal/daemon ./internal/cli -run 'TestSecretRefValidationSupportsSessionNamespace|TestVaultHandlers|TestVaultRoutesAndSchemas|TestVaultCommands|^$'`; AGH test-shape helper passed for new/changed Vault tests.
- Regenerated OpenAPI and web generated types with `make codegen`.
- Implemented `web/src/systems/vault`, Settings -> Vault route, route tree update, and session inspector Vault panel.
- Focused web checks passed: `cd web && bun run build:raw`; `cd web && bun run test:raw src/systems/vault/adapters/vault-api.test.ts src/routes/_app/settings/-vault.test.tsx 'src/routes/_app/-agents.$name.sessions.$id.test.tsx' src/routes/_app/-settings.test.tsx src/routes/-settings-route-tree.test.ts`.
- Regenerated CLI reference with `make cli-docs`.
- Added `packages/site` Vault documentation and linked it from configuration, API reference, web UI, sessions, automation, bridges, MCP, env vars, and CLI overview.
- Site checks passed: `cd packages/site && bun run source:generate`; `cd packages/site && bun run typecheck`; `cd packages/site && bun run test`; `cd packages/site && bun run build`.
- `make codegen-check` passed.
- First `make verify` after docs failed in Bun tests because two Settings order tests missed the new `vault` section; updated expectations and focused Settings tests passed.
- Second `make verify` reached race-enabled Go tests and failed because HTTP/UDS route coverage tests did not include the 4 new Vault routes; updated expected route contracts and focused HTTP/UDS tests passed.
- Full `make verify` now passes, including codegen-check, Bun lint/typecheck/tests, web build, Go fmt/lint/race tests/build, and boundaries.
- Required peer review finished with verdict `SHIP` and no blockers. It flagged six risks around dynamic redaction ordering/cleanup, Vault upsert metadata, HTTP metadata enumeration, slash-delimited prefix matching, kind clobbering on rotation, and a dead session-panel `present=false` branch.
- Addressed peer-review risks:
  - Vault writes register dynamic redaction before storage and clean up per ref on replace/delete.
  - `vault.Service.PutSecret` returns persisted metadata and preserves existing kind metadata when rotating without a kind.
  - HTTP Vault metadata reads now use the privileged loopback guard; UDS remains the local agent surface.
  - Vault list prefix matching now matches exact refs or slash-delimited children without sibling bleed.
  - Settings Vault new-secret draft no longer defaults kind to `secret`.
  - Session Vault panel removed the impossible warning state.
- Regenerated OpenAPI and CLI docs after review fixes.
- Focused checks after review fixes passed: `go test ./internal/vault ./internal/store/globaldb ./internal/api/core ./internal/api/httpapi ./internal/api/spec ./internal/cli -run 'TestServicePutSecretReturnsPersistedMetadataAndPreservesKindOnRotation|TestSecretRefValidationSupportsSessionNamespace|TestGlobalDBVaultSecretPrefixFiltering|TestGlobalDBVaultSecretUpsert|TestVaultHandlers|TestNonLoopbackServerBlocksSettingsAndExtensionMutationsButKeepsReads|TestVaultRoutesAndSchemas|TestVaultCommands' -count=1`; `cd web && bun run test:raw src/routes/_app/settings/-vault.test.tsx 'src/routes/_app/-agents.$name.sessions.$id.test.tsx' src/systems/vault/adapters/vault-api.test.ts`; `make codegen-check`.
- First post-review `make verify` failed during Bun formatting because the peer review event stream was JSONL but named `.json`; renamed it to `.peer-reviews/20260502T040805Z-vault-extensibility/impl-review-result-round1.jsonl`.
- Docs/site checks passed after remediation: `cd packages/site && bun run source:generate`; `cd packages/site && bun run typecheck`; `cd packages/site && bun run test`; `cd packages/site && bun run build`.
- Final post-remediation `make verify` passed, including Bun lint/typecheck/test, web build, Go lint, race tests (`DONE 7343 tests`), build, and boundaries.
- Peer review summary/remediation artifacts written under `.peer-reviews/20260502T040805Z-vault-extensibility/`.
  Now:
- Finalize status; no follow-up peer review was auto-run because `cy-impl-peer-review` requires explicit user approval for additional rounds.
  Next:
- None unless user requests a second peer-review round or commit.
  Open questions (UNCONFIRMED if needed):
- None.
  Working set (files/ids/commands):
- `.codex/plans/2026-05-02-vault-extensibility.md`
- `.codex/ledger/2026-05-02-MEMORY-vault-extensibility.md`
- Expected backend files: `internal/vault`, `internal/api/contract`, `internal/api/core`, `internal/api/httpapi`, `internal/api/udsapi`, `internal/daemon`, `internal/cli`.
- Expected web/docs files: `web/src/systems/vault`, settings/session routes, `packages/site/content/runtime`.
