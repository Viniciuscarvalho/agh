# Vault Extensibility And Session Vault

## Summary

Promote the existing `internal/vault` service from an internal secret backing store into a complete AGH control-plane surface. The feature exposes Vault through HTTP, UDS, CLI, generated OpenAPI/types, web settings, session UI, and runtime docs while preserving the current security invariant: public reads return redacted metadata only, writes are write-only, and no API/CLI/web surface resolves plaintext secrets.

This is a hard-cut completion of the Vault pattern, not a compatibility bridge. The existing encrypted `vault_secrets` table remains sufficient; no schema migration is expected unless implementation discovers a required indexed query not covered by current `ref`/`kind` indexes.

## Key Changes

- Extend Vault grammar with a new `sessions` namespace:
  - Accept `vault:sessions/<session_id>/<name>` in `internal/vault` validation.
  - Keep the existing namespaces: `providers`, `bridges`, `automation`, `mcp`, `hooks`, `extensions`, and `sandbox`.
  - Treat session vault entries as normal Vault records filtered by prefix, not a separate storage model.
- Add shared contract types and OpenAPI operations:
  - Add `internal/api/contract/vault.go` with redacted payloads only: `ref`, `namespace`, `kind`, `present`, `created_at`, `updated_at`.
  - Add request/response DTOs for list/get/put/delete.
  - `secret_value` is accepted only in the write request and is never returned.
  - Register OpenAPI tag `vault` and regenerate `openapi/agh.json` plus `web/src/generated/agh-openapi.d.ts`.
- Add shared core handlers and mirrored transports:
  - Add `core.VaultService` to `internal/api/core/interfaces.go`.
  - Add Vault handlers under `internal/api/core`, wired through `BaseHandlers`.
  - Add the Vault service to `daemon.RuntimeDeps`, HTTP server options, UDS server options, and daemon boot wiring using the existing `state.providerVault`.
  - Register identical HTTP and UDS routes:
    - `GET /api/vault/secrets?prefix=&namespace=`
    - `GET /api/vault/secrets/metadata?ref=...`
    - `PUT /api/vault/secrets` with `{ "ref": "...", "kind": "...", "secret_value": "..." }`
    - `DELETE /api/vault/secrets?ref=...`
  - Use query/body `ref` instead of path params because Vault refs contain `:` and `/`.
- Enforce safe public behavior:
  - List/get return only metadata and `present: true`.
  - Put rejects empty refs, invalid namespaces, invalid `vault:` grammar, and empty secret values.
  - Delete returns `204` and never includes the removed value.
  - No `resolve`, `read value`, `export`, or plaintext response endpoint is added.
  - Register submitted `secret_value` with dynamic redaction at the API boundary so diagnostics/logs do not leak newly written values.
- Add CLI support over UDS:
  - Add `agh vault` with:
    - `agh vault list [--prefix <ref-prefix>] [--namespace <namespace>]`
    - `agh vault get <ref>`
    - `agh vault put <ref> --kind <kind> --value-stdin`
    - `agh vault delete <ref>`
  - `put` reads the secret only from stdin; do not add a `--value` flag because it leaks via shell history/process inspection.
  - Support `-o human|json|jsonl|toon` consistently with existing CLI commands.
  - Human output shows refs, namespace, kind, presence, and timestamps only.
- Add web Vault surfaces:
  - Add a new `web/src/systems/vault` system using generated OpenAPI types, TanStack Query, existing API client patterns, and explicit query keys/mutation invalidation.
  - Add a global Settings -> Vault route/section for all refs with namespace/prefix filtering, metadata list, write-only create/update form, and delete action.
  - Add a Session Vault tab/panel to the existing session inspector for refs under `vault:sessions/<session_id>/`.
  - Pass the session id into the inspector route so the panel can derive its prefix deterministically.
  - Include loading, empty, error, submit-pending, and delete-pending states.
  - Use AGH design tokens from `DESIGN.md`, existing `@agh/ui` primitives, and existing icon dependency patterns; no invented colors, gradients, shadows, fake metrics, or plaintext secret rendering.
- Update docs and site:
  - Add a runtime Vault documentation page under `packages/site/content/runtime/core/configuration/`.
  - Update configuration, provider, MCP, automation, bridge, session/web UI, and API reference docs to point to the new Vault surface.
  - Regenerate CLI reference with `make cli-docs`; do not hand-edit generated CLI pages.
  - Keep copy aligned with `COPY.md`: runtime truth, agent-manageable surfaces, no claims that plaintext can be read back.

## Test Plan

- Go unit and API tests:
  - Vault validation accepts `vault:sessions/<session_id>/<name>` and rejects malformed refs.
  - Core handlers list/get/put/delete correctly map validation, not-found, service-unavailable, and success cases.
  - Public responses never include `encrypted_value`, `secret_value`, or plaintext.
  - HTTP and UDS route parity is covered in `internal/api/spec`.
  - OpenAPI tests assert Vault routes, query params, required request fields, response schemas, and `vault` tag.
  - Daemon boot/runtime dependency tests prove Vault is wired into both transports.
- CLI tests:
  - `agh vault list/get/put/delete` call the expected UDS endpoints.
  - `put --value-stdin` sends `secret_value` in the request body and never prints it.
  - JSON/JSONL/toon/human output contains only redacted metadata.
  - Invalid refs and empty stdin fail with actionable errors.
- Web tests:
  - Vault adapter tests cover list/get/put/delete and API errors.
  - Query/mutation tests verify prefix filtering and cache invalidation.
  - Settings Vault UI tests cover loading, empty, error, list, write-only create/update, and delete flows.
  - Session inspector tests cover the `vault:sessions/<session_id>/` prefix and ensure secret values are not rendered after submit.
  - Route tree tests include the new settings section.
- Docs/codegen/verification:
  - Run `make codegen` after contract changes.
  - Run `make cli-docs` after CLI changes.
  - Run `make codegen-check`.
  - Run focused Go tests for `internal/vault`, `internal/api/core`, `internal/api/spec`, `internal/cli`, and daemon wiring.
  - Run `make bun-lint`, `make bun-typecheck`, `make bun-test`, and `make web-build`.
  - Run package/site source generation/typecheck/test/build as needed for docs updates.
  - Finish with full `make verify`.

## Assumptions

- The accepted product direction is: global Vault settings page plus session-scoped Vault UI.
- The accepted session ref grammar is `vault:sessions/<session_id>/<name>`.
- The accepted public operation set is safe CRUD: list/get metadata, write-only upsert, delete, and no plaintext resolve surface.
- Existing encrypted storage remains the source of truth; the session vault is a namespace convention over Vault records, not a separate table.
- Agent manageability means CLI and UDS are first-class, with HTTP/web parity and docs/codegen shipped in the same change.
