Goal (incl. success criteria):

- Complete `.compozy/tasks/session-driver-override/task_04.md` by exposing the persisted session `provider` on every explicit create/read surface: shared contracts, HTTP/UDS handlers, CLI, extension Host API, and generated OpenAPI/TypeScript artifacts.
- Success means `provider` round-trips coherently across request/response contracts, `agh session new --provider` works, CLI status/list show the effective provider, Host API `sessions.create` accepts an optional provider override, generated files are refreshed, required targeted tests pass, `make codegen-check` passes, and `make verify` passes.

Constraints/Assumptions:

- Follow `/Users/pedronauck/dev/compozy/agh/{AGENTS.md,CLAUDE.md}` plus `/Users/pedronauck/dev/compozy/agh/web/{AGENTS.md,CLAUDE.md}` for generated web types.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `cy-final-verify`.
- `brainstorming` was reviewed and intentionally skipped because `_techspec.md` plus ADR-003/004 already provide the approved design baseline for this execution task.
- Workflow memory files at `.compozy/tasks/session-driver-override/memory/{MEMORY.md,task_04.md}` must be read before edits and updated before completion.
- Existing unrelated changes in `.compozy/tasks/session-driver-override/{_tasks.md,task_01.md,task_02.md,task_03.md}` and the untracked memory directory must be preserved.
- Keep scope tight to task_04; task_05/task_06 web behavior changes are out of scope except for generated artifact updates required by this task.

Key decisions:

- The correct implementation surface is the AGH repo at `/Users/pedronauck/dev/compozy/agh`; the initial `daemon-web-ui` cwd did not contain the task’s cited session/API files.
- Treat `session.Info.Provider` as the existing source of truth from tasks 02/03 and project it outward rather than recomputing provider state.

State:

- Completed.

Done:

- Read task docs `_techspec.md`, `_tasks.md`, `task_04.md`, `task_02.md`, and ADR-001 through ADR-005.
- Read workflow memory files `.compozy/tasks/session-driver-override/memory/{MEMORY.md,task_04.md}`.
- Read AGH repo instructions in root and `web/`.
- Scanned relevant AGH ledgers and read:
- `.codex/ledger/2026-04-20-MEMORY-session-driver-override.md`
- `.codex/ledger/2026-04-21-MEMORY-session-provider-persistence.md`
- `.codex/ledger/2026-04-21-MEMORY-session-provider-migration.md`
- Confirmed the current task gaps in code:
- `internal/api/contract/CreateSessionRequest` lacks `Provider`
- `internal/api/contract/SessionPayload` lacks `Provider`
- `internal/api/core/SessionPayloadFromInfo` does not emit `Provider`
- `internal/cli/session.go` does not expose `--provider`
- Extension Host API session-create params still need inspection/wiring for `provider`
- Generated artifacts are therefore stale for this feature
- Implemented the shared contract change:
- `internal/api/contract.CreateSessionRequest` now accepts optional `provider`
- `internal/api/contract.SessionPayload` now exposes required `provider`
- Projected `session.Info.Provider` through API and Host API payload conversions.
- Updated explicit creation/read surfaces:
- HTTP and UDS create/read handlers now forward and emit `provider`
- `agh session new` now accepts `--provider`
- CLI list/detail output now includes effective provider in human and TOON output
- Extension Host API `sessions.create` accepts optional `provider`, and session create/list/status responses now report effective provider
- Regenerated contract artifacts:
- `openapi/agh.json`
- `web/src/generated/agh-openapi.d.ts`
- `sdk/typescript/src/generated/contracts.ts`
- Added focused provider coverage across contracts, CLI, Host API, and HTTP/UDS transport parity tests.
- Fixed the only full-gate failure after the main feature landed: generated web types made `SessionPayload.provider` required, so typed web test fixtures/mocks were updated to include provider explicitly.
- Fresh verification passed:
- `go test ./internal/api/contract ./internal/api/core ./internal/api/spec ./internal/cli ./internal/extension -count=1`
- `go test -tags integration ./internal/api/httpapi ./internal/api/udsapi ./internal/extension -run 'TestHTTPTransportSessionProviderCreateReadRoundTrip|TestUDSTransportSessionProviderCreateReadMatchesHTTP|TestHostAPIIntegrationSessionLifecycleThroughHostAPI' -count=1`
- `go test -cover ./internal/api/contract ./internal/api/core ./internal/cli ./internal/extension`
- Coverage: `internal/api/contract 92.5%`, `internal/api/core 80.0%`, `internal/cli 81.2%`, `internal/extension 80.6%`
- `make codegen-check`
- `make verify`

Now:

- Update task/workflow tracking and create the local commit.

Next:

- None after commit.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-21-MEMORY-session-provider-contracts.md`
- `.compozy/tasks/session-driver-override/{_techspec.md,_tasks.md,task_02.md,task_04.md,adrs/adr-003.md,adrs/adr-004.md}`
- `.compozy/tasks/session-driver-override/memory/{MEMORY.md,task_04.md}`
- `internal/api/{contract/contract.go,core/{conversions.go,handlers.go},spec/spec.go,httpapi/transport_parity_integration_test.go,udsapi/transport_parity_integration_test.go}`
- `internal/cli/{session.go,session_test.go,cli_integration_test.go}`
- `internal/extension/{contract/host_api.go,host_api.go,host_api_test.go,host_api_integration_test.go}`
- `cmd/agh-codegen/main.go`
- `openapi/agh.json`
- `sdk/typescript/src/generated/contracts.ts`
- `web/src/generated/agh-openapi.d.ts`
- `web/src/**/*test.tsx`, `web/src/**/mocks/fixtures.ts`
- Commands: `git status --short`, `rg`, `sed`, `gofmt -w`, `go test`, `make codegen-check`, `make verify`
