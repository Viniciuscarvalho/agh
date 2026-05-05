Goal (incl. success criteria):

- Implement accepted plan for AGH extension bundle agents as activation-owned preset resources.
- Success: bundle profiles can package self-contained agent folders with optional read-only SOUL.md/HEARTBEAT.md; activation materializes and cleans owned agent/sidecar resources; API/CLI/docs/codegen/tests are updated; `make verify` passes.

Constraints/Assumptions:

- Conversation in BR-PT; code/docs/artifacts in English.
- No destructive git commands.
- Use root-cause/no-workaround discipline; no folder-copy projection for bundle agents.
- Accepted plan persisted under `.codex/plans/2026-05-03-extension-bundle-agents.md`.
- Bundle sidecars are read-only defaults.
- No SQLite schema migration expected unless exploration proves existing resources store cannot support new resource kinds.

Key decisions:

- Bundle profile agents use `[[profiles.agents]] path = "agents/<folder>"`.
- Static extension `resources.agents` remain always-on; profile agents are activation-scoped.
- Sidecars use declarative resource-backed snapshots, not writable file copies.

State:

- Implementation and continuation verification complete; preparing final report.

Done:

- Loaded relevant plan-mode findings from prior context.
- Read current workspace status; worktree was clean.
- Read required skills for no-workarounds, Go runtime, tests, contract/codegen.
- Persisted accepted plan.
- Added canonical `config.CloneAgentDef`.
- Added `agent.soul` and `agent.heartbeat` resource specs and preserved sidecar body bytes.
- Started hard-cut bundle loader changes: `LoadBundleSpecs` now carries context, `[[profiles.agents]]` loads agent folders and validates optional sidecars.
- Wired activation resource materialization/store paths for `agent`, `agent.soul`, and `agent.heartbeat`.
- Added package-owned artifact resolution for session Soul snapshots and Heartbeat status policies.
- Added API read-only guards for package-owned SOUL.md/HEARTBEAT.md mutation paths.
- Added bundle activation validation for bundled agent conflicts and automation agent references.
- Added bundle agent fields to contract/core payloads and mapped agent conflict/reference errors to HTTP status.
- Added `agh bundle` CLI commands over UDS for catalog, preview, activate, list, get, update, deactivate, and network settings.
- Added focused tests for bundle agent loading, projection/store inventory, API payloads, CLI commands, and resource store wiring.
- Focused `go test ./internal/extension ./internal/bundles ./internal/api/core ./internal/cli -count=1` passed.
- Added runtime tests proving package-owned sidecars bind by agent resource provenance and Heartbeat policies resolve from resources.
- Added API tests proving package-owned SOUL.md/HEARTBEAT.md mutations return conflict before authoring services run.
- Focused `go test ./internal/daemon ./internal/api/core -count=1` passed.
- Added bundle routes to OpenAPI spec, regenerated `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`.
- `make codegen-check` passed after adding `/api/bundles/*` operations.
- Focused `go test ./internal/extension ./internal/bundles ./internal/api/core ./internal/api/spec ./internal/cli ./internal/daemon ./internal/session ./internal/heartbeat ./internal/soul -count=1` passed.
- Created `qa-report` artifacts for extension bundle agents under `.compozy/tasks/final-qa/qa/`.
- Dependency readiness commands `make deps` and `bun install --frozen-lockfile` passed.
- First `make verify` failed in site tests because generated bundle docs were not registered in CLI/API navigation.
- Added `bundle` to CLI reference meta and `bundles` to API navigation sections; failing site tests now pass.
- Second `make verify` reached Go lint and exposed long/helper-dead-code issues.
- Refactored bundle inventory/materialization/projector-store wiring, removed dead helpers, and `make lint` now passes.
- Focused post-refactor tests passed for bundles, daemon, API core, CLI, and session.
- Final `make verify` passed: Bun lint/typecheck/test, web build, Go lint/test/build, and boundaries.
- `make site-build` passed and generated the bundle API reference page.
- Post-gate focused bundle/runtime/API/CLI tests passed again.
- QA execution report written to `.compozy/tasks/final-qa/qa/verification-report.md`; no bugs filed.
- Final `cy-final-verify` run of `make verify` passed again at 2026-05-03 00:04:49 -03 after initial QA artifacts were present.
- Reproduced reviewer blockers: bundle resource integration tests failed on missing typed stores; bundle benchmark failed on missing workspace resolver.
- Fixed `internal/bundles/resource_integration_test.go` to wire agent/soul/heartbeat typed stores/codecs and assert owned fan-out.
- Fixed `internal/bundles/perf_bench_test.go` with a workspace resolver and updated operation count to 6 resources per activation.
- Added CLI coverage for `bundle preview`, `bundle list`, `bundle get`, and `bundle deactivate`.
- Added service coverage for `ErrAgentConflict`, unresolved job/trigger agent references, and cross-activation agent-name overlap.
- Focused blocker verification passed:
  - `go test -tags integration -run TestBundleResourceIntegration ./internal/bundles/...`
  - `go test -bench=BenchmarkServiceBuildLargeCatalog -benchtime=1x ./internal/bundles/...`
  - `go test ./internal/cli ./internal/bundles -count=1`
- `make test-integration` exposed a real SOUL resolution regression for global/additional agents outside the workspace root; fixed session SOUL source-root selection and added coverage for global-home SOUL resolution.
- Focused SOUL regression verification passed:
  - `go test -run 'TestManagerSoulSessionSnapshots/Should resolve global agent soul from home root' ./internal/session -count=1`
  - `go test -tags integration -run TestManagerIntegrationCreateAndResumeWithWorkspaceResolver ./internal/session -count=1 -v`
  - `go test -tags integration ./internal/api/udsapi ./internal/api/httpapi ./internal/daemon ./internal/testutil/e2e -run 'TestUDSFullRoundTripWithRealSessionManager|TestHTTPFullRoundTripWithRealSessionManager|TestDaemonE2EFixtureBackedMockAgentLaunchesThroughNormalAgentDefinition|TestStartRuntimeHarnessCapturesTranscriptAndEventsArtifacts' -count=1`
- Fixed additional full integration blockers:
  - refined vault secret-like env validation so non-credential URL/path/file env names are allowed while token/key/secret names remain rejected;
  - increased subprocess hook capture limit to preserve large JSON patches from reference extensions;
  - wired real vault secret store in HTTP automation integration harness;
  - fixed automation webhook signature expectation to use the configured test secret resolver;
  - fixed HTTP transport provider override TOML generation for credential slots;
  - added heartbeat `--if-match` CLI alias and regenerated CLI docs;
  - aligned network/daemon integration tests with non-local-echo channel behavior;
  - corrected hook matcher fields by event family (`tool_id` for `tool.pre_call`, `tool_name` for permission hooks);
  - updated observe integration assertions for cancel plus boot-recovery force-stop calls.
- `make test-integration` passed: 8,349 tests, 3 Daytona credential-gated skips, 0 failures, 182.011s.
- `go test -bench=BenchmarkServiceBuildLargeCatalog -benchtime=1x ./internal/bundles/...` passed with one large-catalog run and the new six-resource fan-out.
- `make cli-docs` passed and regenerated runtime CLI reference pages.
- `make codegen-check` passed after generated contract/docs updates.
- Recreated QA report artifacts under `.compozy/tasks/final-qa/qa/`.
- Final `make verify` passed after all code/docs/QA updates and after the QA report/ledger refresh: Bun lint/typecheck/test, web build, Go lint with 0 issues, Go race tests with 7,784 tests, build, and package boundaries passed.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/plans/2026-05-03-extension-bundle-agents.md`
- `.codex/ledger/2026-05-03-MEMORY-extension-bundle-agents.md`
- `internal/config/agent_clone.go`
- `internal/extension/bundle.go`
- `internal/bundles/service.go`
- `internal/bundles/resource_projection.go`
- `internal/bundles/resource_store.go`
- `internal/daemon/agent_skill_resources.go`
- `internal/daemon/authored_context_runtime.go`
- `internal/api/core/authored_context.go`
- `internal/api/contract/bundles.go`
- `internal/cli/bundle.go`
- `internal/session/soul.go`
- `internal/soul/resource.go`
- `internal/heartbeat/resource.go`
