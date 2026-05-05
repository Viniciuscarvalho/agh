Goal (incl. success criteria):

- Remediate CodeRabbit review batch `.compozy/tasks/e2e/reviews-003` for PR `27`, round `003`, covering issues `001` through `016`.
- Success means: every scoped issue file is fully read, triaged, and closed with concrete reasoning; every valid issue is fixed with regression coverage; `make verify` passes after the last code change; exactly one local commit is created; no out-of-scope review files are touched.

Constraints/Assumptions:

- Must follow repo `AGENTS.md` / `CLAUDE.md`, the batch execution contract, and the required `cy-fix-reviews` / `cy-final-verify` skills.
- Must read every listed issue file completely before editing code.
- Must not call provider scripts, `gh` mutations, or any external review-resolution command.
- Keep code changes constrained to the listed scope; document any unavoidable out-of-scope test touch.
- Automatic commit is allowed only after fresh clean verification.

Key decisions:

- Treat style-only `Should...`/`t.Run` suggestions as invalid unless the repo actually requires them in the affected file; the current repo guidance does not impose that as a universal rule.
- Treat the UDS JSON string match, MCP validation specificity, prompt-network metadata truncation, and acpmock lifecycle/build/env-race findings as valid because they correspond to real correctness or determinism gaps.
- Treat the daemon diagnostics-capture and command-wiring build-tag suggestions as invalid because the current assertions already verify product behavior, and the wiring tests are intentionally part of the default unit lane.
- Treat the acpmock fixed-delivery-delay finding as invalid after verification showed the ACP Go SDK processes inbound frames concurrently, making the local 5ms pause necessary to preserve stable observable ordering until transport-layer ordered handling exists.

State:

- Completed: scoped review files are closed, the batch commit was created, and post-commit repository verification passed cleanly.

Done:

- Loaded the required `cy-fix-reviews` and `cy-final-verify` skills plus Go/debugging/testing skills required by repo instructions.
- Read review metadata from `.compozy/tasks/e2e/reviews-003/_meta.md`.
- Scanned related prior ledgers for transport parity, bridge extension, runtime sandbox, nightly E2E, lane wiring, and acpmock context.
- Read all 16 scoped issue files completely before any code edit.
- Inspected the cited code paths in every scoped source file and identified the likely valid/invalid split for triage.
- Updated every scoped issue file out of `pending`, including closing the invalid findings with concrete reasoning.
- Implemented the valid fixes:
  - JSON-decoded UDS session-event type matching.
  - Specific tool and MCP validation assertions in daemon tests.
  - Explicit multi-metadata rejection for `PromptNetwork` plus regression coverage.
  - Prompt-scoped async driver-control cancellation, timeout-bound driver builds, serialized driver-binary caching, and env-race fixes in `acpmock`.
- Added focused regression coverage in `internal/session/manager_test.go`, `internal/testutil/acpmock/driver_test.go`, and `internal/testutil/acpmock/fixture_test.go`.
- Verified focused packages successfully:
  - `go test ./internal/session -run 'Test(PromptWithOptsTracksTurnSourceAndClearsAfterPrompt|PromptNetworkRejectsMultipleMetadataValues)$' -count=1`
  - `go test ./internal/daemon -run 'Test(ToolMCPSourceSyncerHandlesNilReceiverAndTriggerFailures|ToolMCPSourceSyncerSyncPropagatesProviderFailure|ToolMCPSourceSyncerReplacesCanonicalSnapshot|NewToolMCPPublisherFallsBackToNoopWithoutResourceRuntime|NewToolMCPPublisherBuildsSyncerWhenResourceRuntimeIsReady|NewToolMCPPublisherReturnsCodecResolutionErrors|ValidateAndEncodeToolAndMCPServer)$' -count=1`
  - `go test ./internal/testutil/acpmock -count=1`
  - `go test -tags integration ./internal/api/udsapi -run 'TestUDSTransport' -count=1`
- Ran `make verify` successfully after the final code and issue-file updates.
- Created the required local commit: `bc63668e` (`test: fix e2e review batch`).
- Re-ran `make verify` on `HEAD` after the commit hook formatting and it passed cleanly:
  - web checks passed with `87` Vitest files / `704` tests.
  - Go verification completed with `DONE 4567 tests in 5.201s`.
  - package-boundary enforcement reported `OK: all package boundaries respected`.
- Checked the worktree after the final verification; the only remaining path is untracked review metadata: `.compozy/tasks/e2e/reviews-003/_meta.md`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-e2e-review-r3.md`
- `.compozy/tasks/e2e/reviews-003/_meta.md`
- `.compozy/tasks/e2e/reviews-003/issue_001.md` through `issue_016.md`
- `internal/acp/client_test.go`
- `internal/api/udsapi/transport_parity_integration_test.go`
- `internal/daemon/daemon_bridge_extension_integration_test.go`
- `internal/daemon/daemon_environment_sandbox_integration_test.go`
- `internal/daemon/daemon_nightly_combined_integration_test.go`
- `internal/daemon/tool_mcp_resources_test.go`
- `internal/e2elane/command_wiring_test.go`
- `internal/session/manager_prompt.go`
- `internal/testutil/acpmock/cmd/acpmock-driver/main.go`
- `internal/testutil/acpmock/driver_binary.go`
- `internal/testutil/acpmock/driver_test.go`
- `internal/testutil/acpmock/fixture_test.go`
- `git status --short`
- `git rev-parse --short=8 HEAD`
- `make verify`
