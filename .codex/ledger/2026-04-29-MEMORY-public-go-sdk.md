Goal (incl. success criteria):

- Implement tools-registry Task 08: public Go extension SDK for out-of-process extension-host tools.
- Success requires `sdk/go` public APIs, subprocess JSON-RPC runtime for `initialize`/`provide_tools`/`tools/call`, Host API client primitives, digest parity with daemon/TypeScript fixtures, Go create-extension template, external-package conformance tests, >=80% SDK coverage, clean `make verify`, tracking updates, and one local commit after verification/self-review.

Constraints/Assumptions:

- Use workflow memory files under `.compozy/tasks/tools-registry/memory/`; keep task-local facts in `task_08.md`.
- Follow root/internal AGH guidance, local AGH Go/test guidance, required workflow skills, and no destructive git commands.
- Approved Task 08 spec, `_techspec.md`, ADR-001, ADR-008, ADR-009, and Task 07 runtime protocol are the design authority.
- `sdk/go` must not import `internal/*`; public SDK code must build as an external consumer.
- Do not confuse daemon first-party `native_go` providers with third-party Go extension tools; Go SDK handlers run in an extension subprocess.

Key decisions:

- UNCONFIRMED until code exploration: mirror Task 07 TypeScript SDK wire shapes and daemon protocol constants rather than inventing new method names.
- Keep create-extension support scoped to a Go tool-provider template; site docs remain Task 14.

State:

- Implementation and focused validation in progress.

Done:

- Read required workflow memory shared file and task memory.
- Read root/internal AGH guidance, local AGH Go/test guidance, required workflow skills, Task 08, `_tasks.md`, relevant `_techspec.md` sections, ADR-001, ADR-008, ADR-009, and Task 06/07 ledgers.
- Captured baseline: `go test ./sdk/go` fails with `no Go files`; no `go-tool-provider` create-extension template exists; existing internal extension subprocess test passes against pre-Go-SDK helper runtime.
- Added public `sdk/go` package with wire types, JSON-RPC stdio transport, RPC errors, schema digest helpers, Host API client, function-based/generic `Tool` registration, tool result helpers, and extension runtime dispatch for `initialize`, `provide_tools`, and `tools/call`.
- Added external-package SDK tests covering validation failures, digest fixture parity, Host API sensitive-param rejection, stdio runtime behavior, tool-call redaction, public external consumer build, and no daemon `internal/*` imports.
- Added `go-tool-provider` create-extension template and scaffold test that builds the generated Go extension against the local repo replacement.
- Added daemon-side registry integration tests that compile a Go SDK extension subprocess, dispatch a read-only tool through `Registry.Call`, and verify mutating tool approval gating.
- Focused validation passed: `go test ./sdk/go -cover -count=1` (81.3%), `go test ./internal/extension -run 'TestExtensionToolProvider(GoSDKSubprocessIntegration|SubprocessIntegration)' -count=1`, `bun test sdk/create-extension/src/index.test.ts`, `bun run --cwd sdk/create-extension typecheck`, `go test ./internal/extension ./internal/subprocess ./internal/tools ./sdk/go -count=1`, and `git diff --check`.
- Local AGH test-convention helper path from project skill docs (`scripts/check-test-conventions.py`) is absent in this repo, so that optional heuristic check could not be run.
- First full `make verify` failed at `make lint`; fixed new-code lint findings for ready-callback error handling, internal session pointer passing, long lines, and context-aware subprocess commands in tests.
- Post-fix focused validation passed: `go test ./sdk/go -cover -count=1` (81.2%), `go test ./internal/extension -run 'TestExtensionToolProvider(GoSDKSubprocessIntegration|SubprocessIntegration)' -count=1`, and `make lint`.
- Full `make verify` passed, then self-review tightened duplicate explicit tool ID rejection; focused SDK validation passed at 81.5% coverage and full `make verify` passed again with 6801 tests and package-boundary checks passing.
- Updated `task_08.md` and the Task 08 row in `_tasks.md` to completed.
- Created local code-only commit `58ad2dba` (`feat: add public Go extension SDK`).
- Post-commit `make verify` passed with 6801 tests and package-boundary checks passing.
- Post-commit `go test ./sdk/go -cover -count=1` passed with 82.4% statement coverage.
- Promoted durable Task 08 handoff into shared workflow memory.

Now:

- Final status check and handoff response.

Next:

- None for Task 08.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/MEMORY.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/task_08.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/task_08.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/_tasks.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/_techspec.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/adrs/adr-001-extension-tool-execution-boundary.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/adrs/adr-008-manifest-authoritative-extension-tool-descriptors.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/adrs/adr-009-public-go-extension-tool-sdk.md`
- `/Users/pedronauck/Dev/compozy/agh/sdk/go`
- `/Users/pedronauck/Dev/compozy/agh/sdk/create-extension`
