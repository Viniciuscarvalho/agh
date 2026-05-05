Goal (incl. success criteria):

- Apply the accepted `extgaps` review fixes on this branch: persist bundle spec hash, warn on drift, serialize bundle reconcile, stop swallowing rollback failures, document rollback semantics, add critical bundle tests, and refactor bridge reconciliation behind a bridge-owned syncer.
- Success: the runtime changes are implemented end-to-end, targeted tests cover the risky paths, a refactoring report is written, and `make verify` passes.

Constraints/Assumptions:

- No destructive git commands; do not touch unrelated worktree changes.
- Use `no-workarounds`, `systematic-debugging`, `testing-anti-patterns`, `golang-pro`, and `refactoring-analysis`.
- Fix root causes revealed by tests; do not weaken tests to fit broken behavior.
- Use local project inspection only; no web search for repo facts.

Key decisions:

- Persist `spec_content_hash` on bundle activations instead of adding full bundle versioning.
- Treat bundle reconciliation as a serialized critical section guarded by a service-wide mutex.
- Make rollback semantics explicit: compensation restores activation records only, not all downstream side effects.
- Move bridge managed-resource diff/apply logic into `internal/bridges` via `BridgeManagedSyncer`, mirroring `AutomationSyncer`.
- Keep the bridge delivery test strict, but synchronize it on the actual broker signal (`LastError` after `handleSendFailure`) rather than an impossible metric.

State:

- In progress, at final verification.

Done:

- Read workspace instructions, required skills, and relevant ledgers for cross-agent awareness.
- Added `SpecContentHash string` to `internal/bundles/model/Activation`.
- Persisted `spec_content_hash` in global DB schema, CRUD, scan, and migration paths:
  - `internal/store/globaldb/global_db.go`
  - `internal/store/globaldb/global_db_bundles.go`
  - `internal/store/globaldb/migrate_workspace.go`
- Updated bundle request resolution to compute and store an activation-specific bundle/profile content hash.
- Added bundle drift warning on reconcile when persisted and live spec hashes differ.
- Added service-wide operation serialization for `Activate`, `UpdateActivation`, `Deactivate`, and `Reconcile`.
- Stopped swallowing rollback failures and joined/logged reconciliation + rollback errors.
- Documented rollback scope in the reconcile path comment.
- Extracted bridge managed reconciliation into `internal/bridges/managed_sync.go` and injected it into bundles via `BridgeManagedSyncer`.
- Wired the new bridge syncer in `internal/daemon/boot.go`.
- Fixed an uncovered production bug: deactivate previously skipped automation cleanup when desired jobs/triggers became empty; reconcile now still calls automation syncer so managed automations are removed.
- Added tests:
  - `internal/bundles/service_test.go`
    - deactivate cleanup
    - reconcile-failure rollback visibility
    - rollback failure propagation
    - workspace-scoped activation
    - spec hash assertion on activation materialization
  - `internal/store/globaldb/global_db_bundles_test.go`
  - `internal/bridges/managed_sync_test.go`
- Updated dependent tests for new schema/behavior:
  - `internal/bridges/registry_test.go`
  - `internal/bridges/delivery_projection_test.go`
  - `internal/extension/registry_bundles_test.go`
- Wrote refactoring report: `docs/_refacs/20260414-bundle-runtime-reconcile.md`.
- Verified:
  - `go vet ./...`
  - `go test ./internal/bundles ./internal/bridges ./internal/store/globaldb ./internal/extension ./internal/daemon`
  - `go test ./internal/bundles ./internal/bridges ./internal/store/globaldb ./internal/extension ./internal/daemon -race`
  - `go test ./internal/bundles ./internal/store/globaldb -cover` -> bundles `66.6%`, globaldb `78.4%`
- Root-caused and fixed a flaky bridge test sync point:
  - `TestBrokerSetTransportFlushesQueuedResume` was waiting on `DeliveryFailuresTotal > 0`, but transport-unavailable retries only populate `LastError`; that condition was impossible on this path.
  - The test now waits for `LastError != ""`, which corresponds to `handleSendFailure` having executed and the resume being queued.

Now:

- Waiting for the final `make verify` run to complete.

Next:

- If `make verify` passes, summarize the shipped changes, verification evidence, and residual risk (coverage still below the stated 80% threshold for `internal/bundles` and slightly below it for `internal/store/globaldb`).
- If it fails, inspect the failing stage and fix the root cause before closing.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-14-MEMORY-extgaps-review.md`
- `internal/bundles/model/model.go`
- `internal/bundles/service.go`
- `internal/bundles/service_test.go`
- `internal/bridges/managed_sync.go`
- `internal/bridges/managed_sync_test.go`
- `internal/bridges/delivery_projection_test.go`
- `internal/store/globaldb/global_db.go`
- `internal/store/globaldb/global_db_bundles.go`
- `internal/store/globaldb/global_db_bundles_test.go`
- `internal/store/globaldb/migrate_workspace.go`
- `internal/daemon/boot.go`
- `docs/_refacs/20260414-bundle-runtime-reconcile.md`
- `go vet ./...`
- `go test ./internal/bundles ./internal/bridges ./internal/store/globaldb ./internal/extension ./internal/daemon -race`
- `make verify`
