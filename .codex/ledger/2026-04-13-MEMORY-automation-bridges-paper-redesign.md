Goal (incl. success criteria):

- Implement the accepted `bridges` Paper design in `web/`, including any required backend/API work.
- Success means the web app gains a faithful `Bridges` route and sidebar entry, provider selection comes from real installed bridge adapters, bridge health exposes `last_success_at`, create/test-delivery flows work against real APIs, and verification passes.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`, and `DESIGN.md`.
- Do not touch unrelated dirty worktree changes under `web/src/systems/automation/**` and `web/src/routes/_app/automation.tsx`.
- Accepted plan must stay persisted under `.codex/plans/2026-04-13-automation-bridges-paper-redesign.md`.
- Browser cannot rely on UDS-only `/api/extensions`; provider catalog must be HTTP-visible through `bridges`.
- Do not add per-bridge retry/timeout settings in this round; only implement delivery fields with real runtime semantics.

Key decisions:

- Add a bridge-scoped HTTP provider catalog instead of exposing the generic extension manager surface to the browser.
- Extend bridge-capable extension manifests with a minimal `bridge` metadata section and require it for `bridge.adapter`.
- Extend bridge health with `last_success_at`; do not invent additional retry telemetry.
- Build the web feature as `web/src/systems/bridges` with route-level orchestration and presentational components.
- Reuse existing AGH tokens/components and keep any new shared abstractions minimal.

State:

- In progress.

Done:

- Explored Paper artboards for bridges and mapped the four target states.
- Verified existing bridge APIs, current telemetry fields, extension manager surfaces, and web architecture patterns.
- Confirmed `/api/extensions` is UDS-only and therefore unsuitable for the browser.
- Confirmed `delivery_defaults` currently only support target defaults (`mode`, `peer_id`, `thread_id`, `group_id`).
- Persisted the accepted bridges plan in `.codex/plans/2026-04-13-automation-bridges-paper-redesign.md`.
- Refreshed this ledger from the old automation-specific content to the current bridges task.
- Implemented backend bridge provider catalog and added `GET /api/bridges/providers` in HTTP and UDS.
- Extended extension manifests with required `[bridge]` metadata for `bridge.adapter` providers and updated the Telegram reference extension.
- Propagated bridge health `last_success_at` from delivery broker -> observe -> API contract -> OpenAPI/types.
- Added backend/unit route coverage for providers and last-success telemetry, then passed focused backend tests for `extension`, `bridges`, `observe`, `api/{core,httpapi,udsapi,spec}`, `daemon`, and `cli`.
- Ran `make codegen` and regenerated `web/src/generated/agh-openapi.d.ts`.

Now:

- Implement the `web/src/systems/bridges` feature, route `/bridges`, sidebar integration, and route/component tests.

Next:

- Run focused tests first, then full verification.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/plans/2026-04-13-automation-bridges-paper-redesign.md`
- `.codex/ledger/2026-04-13-MEMORY-automation-bridges-paper-redesign.md`
- `internal/extension/manifest.go`
- `internal/extension/manager.go`
- `internal/extension/describe.go`
- `internal/api/contract/bridges.go`
- `internal/api/core/bridges.go`
- `internal/api/core/conversions.go`
- `internal/api/spec/spec.go`
- `internal/api/httpapi/**`
- `internal/api/udsapi/**`
- `internal/observe/bridges.go`
- `internal/bridges/delivery_*.go`
- `web/src/routes/_app/bridges.tsx`
- `web/src/components/app-sidebar.tsx`
- `web/src/systems/bridges/**`
- `make codegen`
- `make web-lint`
- `make web-typecheck`
- `make web-test`
- `make verify`
