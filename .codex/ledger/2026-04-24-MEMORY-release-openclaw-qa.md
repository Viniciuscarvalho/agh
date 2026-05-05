Goal (incl. success criteria):

- Compare AGH with `.resources/openclaw` for production-grade Agent OS readiness, apply critical gaps, and validate release readiness end-to-end.
- Success requires fresh verification evidence, network feature validation, and QA artifacts under `.codex/release-qa/qa/`.

Constraints/Assumptions:

- Must not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- Must not touch unrelated git changes.
- `make verify` is the blocking completion gate.
- Tests must expose real bugs; do not weaken tests to make failures pass.
- Need use relevant skills: qa-report, qa-execution, browser-use for browser flows, Go/debug/test/final-verify skills for code changes.

Key decisions:

- QA output path: `.codex/release-qa`.
- Compare local OpenClaw reference using local search only; web search is not needed for project code.

State:

- Comparison, production hardening, live validation, nightly bridge route fix, restart helper fix, deterministic Teams integration wait fix, final verification gates, QA report, and final status/diff checks completed.

Done:

- Scanned existing ledger filenames for cross-agent awareness.
- Loaded initial Go/debug/no-workarounds skill guidance.
- Read QA templates/checklists, Makefile, CI/release workflows, network docs, and relevant prior network/release ledgers.
- Created release QA plan, regression suite, and P0/P1 test cases under `.codex/release-qa/qa/`.
- Identified OpenClaw production pattern: delivery failures/backpressure are durable/observable; AGH queue overflow currently drops old inbound network messages with log-only visibility.
- Added failing regression test `TestManagerAuditsBusyQueueOverflowAsRejected`; it failed before fix with rejected audit count 0.
- Implemented queue overflow drop hook so dropped inbound messages are recorded via manager rejected audit/status with reason `queue_overflow`.
- `go test ./internal/network -run TestManagerAuditsBusyQueueOverflowAsRejected -count=1` passed after fix.
- `go test ./internal/network -count=1` passed.
- `make verify` passed after fix: web format/lint/typecheck/test/build, Go lint/race tests/build, and package boundaries.
- First `make test-integration` run surfaced transient `internal/extension TestTeamsProviderLaunchNegotiatesBridgeRuntime` missing managed state.
- Targeted retry for that extension integration passed; full `go test -race -tags integration ./internal/extension -count=1` passed.
- Full `make test-integration` rerun passed: 6187 tests, 3 skipped; Daytona tests skipped due missing `DAYTONA_API_KEY`.
- Full `make test-e2e` passed, including web Playwright network flow: 15 specs passed.
- Direct `codex exec` live LLM smoke passed with exact token `AGH-OPENCLAW-LLM-SMOKE-OK` despite local Codex config warnings.
- First live AGH/Codex ACP smoke exposed LLM token-copy fragility on a long token; retry with short token proved AGH prompt streaming (`prompt_text=OK`).
- Live AGH network smoke with `agh` on PATH and temp workspace ledger passed: two Codex ACP sessions joined `release`, direct message was audited sent/received, receiver replied direct back to sender, daemon stopped cleanly.
- `make test-e2e-nightly` passed runtime/nightly Go lanes and daemon-served web suite; Daytona tests skipped due missing `DAYTONA_API_KEY`; nightly web failed on bridge detail panel not surfacing the created route session id.
- Fixed bridge detail route rows to render `session <id>` under the agent name and added a component regression test.
- `bun run --cwd web test:raw src/systems/bridges/components/bridge-detail-panel.test.tsx` passed: 7 tests.
- `bun run --cwd web test:e2e:nightly` passed: 1 Playwright nightly test.
- Full `make test-e2e-nightly` rerun passed: runtime Go suites, daemon nightly, web daemon-served 15 specs, web nightly 1 spec; Daytona credentialed tests skipped due missing `DAYTONA_API_KEY`.
- Final `make verify` initially failed on `internal/daemon TestRunRelaunchHelperWrapperUsesDefaultLauncherAndPersistsFailure`; root cause was readiness timeout masking an already-exited replacement process.
- Fixed `internal/daemon/restart.go` to give process-exit evidence priority at ready-timeout boundary.
- `go test -race ./internal/daemon -run TestRunRelaunchHelperWrapperUsesDefaultLauncherAndPersistsFailure -count=10` passed.
- `go test -race ./internal/daemon -count=1` passed.
- Final `make verify` passed after restart helper lint signature fix: web lint/typecheck/unit/build, Go lint/race tests/build, package boundaries.
- Fresh `make test-integration` after all fixes failed again on `internal/extension TestTeamsProviderLaunchNegotiatesBridgeRuntime` with `missing_managed_state` for `brg-teams-b`; this repeated an earlier transient and is being treated as deterministic release blocker.
- Fixed `internal/extension TestTeamsProviderLaunchNegotiatesBridgeRuntime` to wait for both managed Teams instances (`brg-teams-a`, `brg-teams-b`) to report last state `ready`, rather than only waiting for two total state records.
- `go test -race -tags integration ./internal/extension -run TestTeamsProviderLaunchNegotiatesBridgeRuntime -count=10 -v` passed after the deterministic wait fix.
- `go test -race -tags integration ./internal/extension -count=1` passed after the Teams fix.
- Final `make test-integration` passed: 6187 tests, 3 skipped due missing `DAYTONA_API_KEY`.
- Final `make verify` passed after all code/test changes: web format/lint/typecheck/unit/build, Go lint/race tests/build, and package boundaries.
- Final `make test-e2e` passed after all fixes, including daemon e2e lanes and 15 daemon-served Playwright specs.
- Final `make test-e2e-nightly` passed after all fixes: runtime/daemon e2e lanes, daemon-served Playwright 15 specs, nightly Playwright combined flow 1 spec; Daytona credentialed tests skipped due missing `DAYTONA_API_KEY`.
- Wrote final verification report at `.codex/release-qa/qa/verification-report.md`.
- Final `git diff --check` passed with no whitespace/patch errors.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- Credentialed Daytona lane is blocked unless `DAYTONA_API_KEY` exists.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-24-MEMORY-release-openclaw-qa.md`
- QA output: `.codex/release-qa/qa/verification-report.md`, `.codex/release-qa/qa/test-plans/`, `.codex/release-qa/qa/test-cases/`
- Changed: `internal/network/delivery.go`, `internal/network/manager.go`, `internal/network/manager_test.go`, `internal/daemon/restart.go`, `internal/extension/teams_provider_integration_test.go`, `web/src/systems/bridges/components/bridge-detail-panel.tsx`, `web/src/systems/bridges/components/bridge-detail-panel.test.tsx`
- Verification: `make verify` passed after all current changes.
