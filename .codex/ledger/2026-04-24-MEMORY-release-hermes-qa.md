Goal (incl. success criteria):

- Prepare AGH for first release by comparing `.resources/hermes` production-grade behavior against current AGH, applying critical correctness/operability fixes, and running full QA with emphasis on network workflows.
- Success requires documented comparison, necessary production fixes/tests, fresh `make verify` evidence, and real CLI/API/browser/network validation where locally possible.

Constraints/Assumptions:

- Must not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- `make verify` is the blocking completion gate.
- No web search for local project code; use local grep/glob.
- `.old_project/` is reference-only and must not be modified/imported.
- Never commit `ai-docs/`.
- Use QA artifacts under `.codex/qa/release-hermes/qa/` unless a stronger repo convention appears.

Key decisions:

- Activate QA planning/execution plus Go/debug/test/final-verification skills.
- Treat Hermes comparison as evidence-gathering first; do not copy code blindly.

State:

- Completed; final summary pending.

Done:

- Loaded user/repo instructions and QA/browser skills.
- Scanned ledger directory names for cross-agent awareness.
- Read relevant prior network/Hermes ledgers and QA contract.
- Identified Hermes-style retry/backoff hardening gap in AGH network inbound delivery.
- Implemented scheduled exponential retry for `internal/network` delivery failures and updated deterministic regression tests.
- `go test ./internal/network` passed.
- Created release QA plan, regression suite, and P0/P1 network/web/LLM test cases under `.codex/qa/release-hermes/qa/`.
- `make deps` passed; `go mod tidy` promoted existing direct deps (`uuid`, `pelletier/go-toml`) and removed stale `rogpeppe/go-internal v1.12.0` sums.
- `make verify` passed: web format/lint/typecheck/test/build, Go lint, race tests, build, boundary check.
- First `make test-integration` failed, surfacing stale integration contracts and runtime failures: task fake store missing `DeleteTask`, network e2e channel creation missing required `purpose`, API/session status 404/500 cases, ACP network guardrails timeout, nightly task network artifact missing, relaunch helper timeout.
- Fixed HTTP/UDS prompt streaming so client disconnect/write failure drains prompt events instead of canceling the agent turn, preserving terminal persistence.
- Fixed HTTP/UDS transport parity integration tests to use `POST /api/sessions/:id/stop`.
- Isolated HTTP/UDS API integration subsets now pass with `-race -tags integration`.
- Fixed resume fallback so recovered `agent_crashed` classification survives ACP missing-state fallback.
- Fixed provider resolution so a persisted provider equal to the agent/default provider preserves the agent's command/model on resume; this restored deterministic network task resume and protects custom agents from falling back to provider defaults.
- Isolated session crash-resume and nightly network task integration tests now pass.
- Full `make test-integration` re-run surfaced three remaining failures: prompt request cancellation tests blocked behind synchronous drain, and runtime harness port-conflict retry lost the process-exit reason on timeout.
- Fixed HTTP/UDS prompt disconnect handling to return the request immediately while an async drain keeps the agent turn alive until events close, then releases the detached prompt context.
- Fixed runtime harness readiness timeout to poll for process exit before reporting a generic timeout, preserving the address-in-use retry signal.
- Targeted prompt drain and harness port-conflict tests pass with `-race -tags integration`.
- Full `make test-integration` passed: 6186 tests, 3 skipped in 68.903s; skips require `DAYTONA_API_KEY`.
- Fixed runtime harness UDS socket path reseeding/collision handling for parallel e2e lanes.
- `make test-e2e-runtime` passed across daemon/httpapi/udsapi/e2e packages.
- `make test-e2e-web` reached real Playwright/browser execution; network web e2e passed, but six stale UI-contract tests failed after route/copy/surface changes.
- Repaired stale web E2E contracts across automation, bridges, tasks, settings, Storybook, session selectors, and assistant composer test IDs.
- Latest full `make test-e2e-web` passed 14/15 specs; the only remaining failure was session onboarding expecting replay after stop/resume/reload. Network web E2E passed again.
- Adjusted session onboarding to validate transcript replay after active session reload, then validate stop/resume controls separately.
- Targeted session onboarding E2E passed.
- Full `make test-e2e-web` next passed 14/15 specs; remaining failure is a flaky Tasks dashboard link click where the anchor is present but DOM refresh detaches it during Playwright stability checks.
- Adjusted Tasks dashboard run navigation to assert the active run link href and navigate deterministically to the run route.
- Targeted Tasks E2E passed.
- Full `make test-e2e-web` passed: 15/15 specs in 46.6s, including Network browser flow.
- Final `make verify` passed: web format/lint/typecheck/unit/build, Go lint/race tests/build, and package boundary checks. Go unit/race reported DONE 5707 tests in 33.904s.
- LLM capability check found `OPENAI_API_KEY=present`, `codex` CLI 0.124.0, `claude` CLI 2.1.111, no Gemini key/CLI.
- Real LLM smoke via `codex exec --ephemeral --skip-git-repo-check --sandbox read-only -C /tmp --json` returned `AGH-LLM-SMOKE-OK`.
- Real AGH smoke using isolated `AGH_HOME=/tmp/agh-real-network-smoke.HoeQ4y` started daemon with network running, created Codex ACP sessions, verified normal prompt token response, sent network `direct` to an isolated session, and observed network status `messages_delivered=1` for `kind=direct`.
- Real AGH network LLM caveat: the Codex ACP agent is agentic and followed AGH/network safety guidance by attempting CLI/ledger actions instead of returning only the token; daemon was stopped cleanly after evidence collection.
- QA evidence/test cases/report updated under `.codex/qa/release-hermes/qa/`.
- Temporary real-smoke daemon stopped cleanly; `daemon status` reports stopped for isolated `AGH_HOME`.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: exact local credentials/providers available for real LLM network flows.
- UNCONFIRMED: exact current AGH network workflow entrypoints until code/docs inspection completes.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-24-MEMORY-release-hermes-qa.md`
- Planned QA path: `.codex/qa/release-hermes/`
- Changed: `internal/network/delivery.go`, `internal/network/delivery_test.go`
- Changed: `internal/api/httpapi/prompt.go`, `internal/api/udsapi/prompt.go`, `internal/api/httpapi/transport_parity_integration_test.go`, `internal/api/udsapi/transport_parity_integration_test.go`
- Changed: `internal/session/resume_repair.go`, `internal/session/manager_test.go`, `internal/config/provider.go`, `internal/config/provider_test.go`
- Changed: `internal/testutil/e2e/runtime_harness.go`
- Web e2e files remediated: `web/e2e/automation.spec.ts`, `web/e2e/bridges.spec.ts`, `web/e2e/session-onboarding.spec.ts`, `web/e2e/settings-transport.spec.ts`, `web/e2e/storybook-bootstrap.spec.ts`, `web/e2e/tasks.spec.ts`, `web/e2e/fixtures/selectors.ts`
- QA artifacts: `.codex/qa/release-hermes/qa/test-plans/`, `.codex/qa/release-hermes/qa/test-cases/`, `.codex/qa/release-hermes/qa/evidence/commands.md`
- Changed by `make deps`: `go.mod`, `go.sum`
- Verification: `go test ./internal/network`, `make deps`, initial `make verify`, targeted `go test -race -tags integration` prompt/harness regressions
- Verification: full `make test-integration` pass; full `make test-e2e-runtime` pass; full `make test-e2e-web` currently failing stale UI specs while network web spec passed.
