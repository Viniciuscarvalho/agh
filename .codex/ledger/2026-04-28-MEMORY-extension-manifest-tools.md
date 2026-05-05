Goal (incl. success criteria):

- Implement `.compozy/tasks/tools-registry/task_06.md`: extension manifest tool metadata and reconciliation prep.
- Success requires manifest-authoritative tool metadata/validation, cold non-executable publication, schema digest fixtures/tests, deterministic availability reason codes, disabled/unhealthy lifecycle coverage, >=80% affected coverage, clean `make verify`, tracking updates, and one local commit after clean verification/self-review.

Constraints/Assumptions:

- Use workflow memory files under `.compozy/tasks/tools-registry/memory/` and keep task-local notes in `task_06.md`.
- Follow root/internal AGH guidance, local AGH Go/test skills, required workflow skills, and no destructive git commands.
- Task 06 is manifest-side only; do not invoke extension handlers or revive descriptor-only executable behavior.
- Keep tracking/workflow memory out of the automatic commit unless repository policy requires staging them.

Key decisions:

- Treat `_techspec.md`, `_tasks.md`, `task_06.md`, ADR-001, ADR-008, and ADR-009 as the source of truth.
- Preserve canonical extension tool IDs as `ext__<extension_name>__<tool_key>` unless an explicit manifest `id` is valid and still inside the extension namespace.
- Cold extension tool resources must be operator-visible but non-callable until later runtime reconciliation proves handler/schema/risk parity.

State:

- Task 06 implementation, focused tests, self-review, task tracking updates, code-only local commit, and post-commit full verification are complete.

Done:

- Loaded required task skills: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`; loaded `no-workarounds`, `systematic-debugging`, and local AGH Go/test guidance.
- Read root/internal AGH guidance.
- Read shared workflow memory and task_06 workflow memory.
- Read relevant prior tools-registry ledgers for Tasks 01-05.
- Read `task_06.md`, `_tasks.md`, ADR-001, ADR-008, ADR-009, and relevant `_techspec.md` sections for extension runtime contract, data models, extension manifests, tests, and safety invariants.
- Captured pre-change focused tests passing for `internal/extension` and `internal/tools`.
- Partially extended manifest tool fields, cold resource conversion, runtime digest proof metadata, and `reserved_namespace` reason code.
- Completed manifest validation for backend metadata, handler binding, reserved namespace, schema objects, risk flags, toolsets, and duplicate IDs.
- Added runtime reconciliation helper with deterministic availability reasons for disabled, inactive, unhealthy, missing capability, missing runtime descriptor, missing handler, and mismatch states.
- Changed daemon tool/MCP sync so extension tool resources publish cold metadata for installed extensions while extension MCP servers remain gated by enabled+registered state.
- Added daemon/TypeScript SDK/Go SDK schema digest fixture files and daemon tests proving canonical bytes/digests plus byte-identical shared fixtures.
- Added tests for manifest metadata, cold non-callable registry projection, runtime reconciliation, lifecycle publication, and schema digest/runtime descriptor validation.
- Focused tests passed: `go test ./internal/extension -coverprofile=/tmp/agh-task06-extension.cover -count=1` (80.6%), `go test ./internal/tools -coverprofile=/tmp/agh-task06-tools.cover -count=1` (82.1%), `go test ./internal/daemon -count=1`, and targeted daemon integration test.
- `make verify` passed pre-commit after lint fixes: Go lint `0 issues`, frontend tests 1832 passed, Go tests 6729 passed, package boundaries respected.
- Updated `.compozy/tasks/tools-registry/task_06.md` and `_tasks.md` to completed after verification and self-review.
- Created local code-only commit `132648c6 feat: add extension tool manifest reconciliation`.
- `make verify` passed post-commit: oxlint `Found 0 warnings and 0 errors`, golangci-lint `0 issues.`, Go tests `DONE 6729 tests`, and package boundaries respected.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/MEMORY.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/task_06.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/task_06.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/_tasks.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/_techspec.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/adrs/adr-001-extension-tool-execution-boundary.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/adrs/adr-008-manifest-authoritative-extension-tool-descriptors.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/adrs/adr-009-public-go-extension-tool-sdk.md`
- `/Users/pedronauck/Dev/compozy/agh/internal/extension/manifest.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/extension/resource_publication.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/tools/reason.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/tools/tool.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/tools/schema_digest.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/extension/tool_reconciliation.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/daemon/tool_mcp_resources.go`
- `/Users/pedronauck/Dev/compozy/agh/internal/extension/testdata/digest/cases.json`
- `/Users/pedronauck/Dev/compozy/agh/sdk/typescript/test-fixtures/digest/cases.json`
- `/Users/pedronauck/Dev/compozy/agh/sdk/go/test-fixtures/digest/cases.json`
