## Goal (incl. success criteria):

- Implement deterministic E2E hardening so runtime and web lanes stop routing mock turns by rendered prompt substrings and gain explicit negative-path coverage plus truthful documentation.
- Success means prompt metadata is propagated end-to-end, acpmock fixtures move to v2 exact matching, shared daemon/driver binaries are wired into lanes, targeted negative-path coverage exists, docs are corrected, and verification commands pass.

## Constraints/Assumptions:

- Dirty worktree exists; do not revert unrelated edits.
- No real-provider lane in this task.
- Root-cause fixes only; do not weaken tests to get green.
- Repo completion gate still requires `make verify`.

## Key decisions:

- Persist accepted plan under `.codex/plans/2026-04-17-e2e-confidence-hardening.md`.
- Use structured ACP prompt metadata as the routing contract for acpmock.
- Keep rendered prompt text for agent context/artifacts only.

## State:

- Completed.

## Done:

- Read workspace instructions, relevant ledgers, and required skills.
- Captured accepted hardening plan and persisted it under `.codex/plans/`.
- Created this session ledger.
- Implemented structured ACP prompt metadata plumbing through `internal/acp`, `internal/session`, and `internal/network`.
- Upgraded `internal/testutil/acpmock` to fixture v2 exact matching with diagnostics metadata and `driver_control` fault injection.
- Added shared binary override/prebuild support for runtime and browser lanes via `AGH_TEST_DAEMON_BIN` and `AGH_TEST_ACPMOCK_DRIVER_BIN`.
- Added negative-path daemon/runtime transport coverage for crash, invalid-frame, and disconnect scenarios.
- Fixed a real session shutdown bug: `StopWithCause` / `RequestStopWithCause` now finalize already-exited ACP subprocesses without surfacing false shutdown failures.
- Corrected the task pack to reflect the shipped Go mock driver and added ADR-006 / ADR-007.
- Verified the focused harness regression fix with `go test ./internal/testutil/e2e -count=1`.
- Re-ran the shipped E2E lanes successfully: `make test-e2e-runtime`, `make test-e2e-web`, and `make test-e2e`.
- Re-ran the full repo gate successfully with `make verify`.

## Now:

- Prepare the final handoff summary.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- None.

## Working set (files/ids/commands):

- `.codex/plans/2026-04-17-e2e-confidence-hardening.md`
- `.codex/ledger/2026-04-17-MEMORY-e2e-confidence-hardening.md`
- `internal/acp`
- `internal/session`
- `internal/network`
- `internal/testutil/acpmock`
- `internal/testutil/e2e`
- `internal/e2elane`
- `magefile.go`
- `web/e2e/fixtures`
- `.compozy/tasks/e2e`
- `go test -tags integration ./internal/daemon ./internal/api/httpapi ./internal/api/udsapi -run '^(TestDaemonE2EACPmock|TestHTTPTransportPromptFailureProjectionUsesSharedRuntimeHarness|TestUDSTransportPromptFailureProjectionUsesSharedRuntimeHarness)$' -count=1`
- `go test ./internal/testutil/e2e -count=1`
- `make test-e2e-runtime`
- `make test-e2e-web`
- `make test-e2e`
- `make verify`
