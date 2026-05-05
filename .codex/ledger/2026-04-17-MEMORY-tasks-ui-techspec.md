Goal (incl. success criteria):

- Preserve the completed `tasks-ui` techspec work and the ACP mock harness refactor, and ensure the full E2E suite is green and stable after removing the JS `dist/index.js` dependency.
- Success means the ACP mock uses the dedicated Go helper binary, runtime/web E2E both pass, and `make verify` passes.

Constraints/Assumptions:

- The approved `.compozy/tasks/tasks-ui/_techspec.md` and ADRs remain valid and already saved.
- Keep real subprocess behavior for ACP mock tests; remove Node/`dist` coupling, not the executable boundary itself.
- Do not edit unrelated files or use destructive git commands.
- User requested Portuguese plus root-cause fixes via `$systematic-debugging` and `$no-workarounds`.

Key decisions:

- Keep the Go helper binary under `internal/testutil/acpmock/cmd/acpmock-driver` as the test-owned executable.
- Replace scattered Node-era driver checks with a single shared helper in `internal/testutil/acpmock`.
- Keep shared daemon transcript/fixture helpers in a dedicated integration helper file.

State:

- Complete. Full E2E and verification are green.

Done:

- Saved `.compozy/tasks/tasks-ui/_techspec.md` and ADRs under `.compozy/tasks/tasks-ui/adrs/`.
- Replaced the JS ACP mock driver with the Go helper binary and removed `internal/testutil/acpmock/driver/dist/index.js`.
- Confirmed the first runtime-lane failure came from stale `ResolveNodePath` usage plus a drifted `transcriptContent(...)` helper call in daemon integration tests.
- Added `internal/daemon/daemon_acpmock_helpers_integration_test.go` to host shared `mockFixturePath`, `createFixtureBackedSession`, and `joinTranscriptContent` helpers.
- Fixed `internal/daemon/daemon_network_collaboration_integration_test.go` to use `joinTranscriptContent(...)` consistently.
- Added `internal/testutil/acpmock/driver_testutil.go` with `acpmock.RequireDriver(t)`.
- Updated daemon/httpapi/udsapi integration tests to use `acpmock.RequireDriver(t)` and removed obsolete `skipWithoutNode` helpers.
- Passed targeted integration coverage:
- `go test -tags integration ./internal/daemon ./internal/api/httpapi ./internal/api/udsapi`
- Passed full E2E twice:
- `make test-e2e`
- `make test-e2e`
- Passed full verification:
- `make verify`

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Techspec outputs: `.compozy/tasks/tasks-ui/_techspec.md`, `.compozy/tasks/tasks-ui/adrs/adr-{001,002,003,004}.md`
- ACP mock runtime helpers: `internal/testutil/acpmock/{driver_binary.go,driver_testutil.go,registration.go,diagnostics.go,driver_test.go,fixture_test.go}`, `internal/testutil/acpmock/cmd/acpmock-driver/main.go`
- Daemon/API integration tests: `internal/daemon/daemon_{acpmock_helpers,mock_agents,automation_task,bridge_extension,network_collaboration}_integration_test.go`, `internal/api/{httpapi,udsapi}/transport_parity_integration_test.go`
- Web harness files from the earlier refactor: `web/e2e/fixtures/runtime-seed.ts`, `web/e2e/fixtures/runtime-seed.test.ts`, `web/e2e/bridges.spec.ts`
- Verification commands: `go test -tags integration ./internal/daemon ./internal/api/httpapi ./internal/api/udsapi`, `make test-e2e`, `make verify`
