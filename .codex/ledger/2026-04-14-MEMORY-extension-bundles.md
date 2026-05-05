Goal (incl. success criteria):

- Implement accepted extension-bundle plan so extensions can declare team/product bundles that align channels, automations, and bridges.
- Success: package catalog + activation flow exist, package-managed resources reconcile correctly, ownership/lifecycle rules are enforced, and `make verify` passes.

Constraints/Assumptions:

- No destructive git commands.
- Accepted plan persisted under `.codex/plans/2026-04-14-extension-bundles.md`.
- Package activation is explicit, not automatic.
- Ownership model is package base spec plus limited overlays.
- Optional bind may promote a bundle primary channel to effective daemon default without mutating config on disk.
- Disable/uninstall with active bundle activations must be blocked.

Key decisions:

- Add `resources.bundles` to extension manifests.
- Introduce daemon-owned bundle activation runtime instead of extension self-materialization via Host API.
- Add automation source `package`.
- Bridge presets materialize disabled/pending instances plus bindings, no autostart.

State:

- Completed.

Done:

- Explored manifest, manager, automation, network, bridge, daemon boot, and API seams.
- Persisted accepted implementation plan.
- Added `resources.bundles` support with bundle spec loading/validation and surfaced bundle summaries in extension payloads.
- Added automation source `package`, overlay handling for package-managed definitions, and exported managed-definition sync on the automation manager.
- Added bridge instance source `package`, public bridge secret-binding API routes, and persistence/migration for `bridge_instances.source`.
- Added daemon-owned bundle activation service in `internal/bundles` with persisted activations/inventory, package reconcile for automations/bridges, and computed network default-channel settings.
- Wired bundle service into daemon boot plus HTTP/UDS routes under `/api/bundles/*`.
- Blocked extension disable/uninstall when bundle activations exist.
- Added targeted tests for bundle activation flow and extension registry lifecycle guard; fixed affected route/schema/bridge tests.
- Regenerated generated API artifacts via `make codegen`.
- Fixed final staticcheck findings in bundle reconcile/test helpers.
- Passed full repository verification with `make verify`.

Now:

- Implementation complete and verified.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/plans/2026-04-14-extension-bundles.md`
- `.codex/ledger/2026-04-14-MEMORY-extension-bundles.md`
- `internal/extension/*`
- `internal/bundles/*`
- `internal/automation/*`
- `internal/bridges/*`
- `internal/daemon/*`
- `internal/api/*`
- `internal/store/globaldb/*`
- `go test ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/extension ./internal/store/globaldb ./internal/daemon`
- `make codegen`
- `make verify`
