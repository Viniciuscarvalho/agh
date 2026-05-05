Goal (incl. success criteria):

- Implement tools-registry Task 07: executable extension-host tool runtime protocol plus TypeScript SDK authoring.
- Success requires `tool.provider`, `provide_tools`, `tools/call`, runtime/manifest reconciliation, registry dispatch through subprocess manager, TypeScript `extension.tool(...)`, create-extension template coverage, required unit/integration tests, clean `make verify`, tracking updates, and one local commit if clean.

Constraints/Assumptions:

- Use workflow memory files under `.compozy/tasks/tools-registry/memory/`; keep task-local facts in `task_07.md`.
- Follow root/internal AGH guidance, local AGH Go/test skill files, required workflow skills, no destructive git commands, and no web search for local code.
- Approved Task 07 spec, `_techspec.md`, ADR-001, ADR-008, and ADR-009 are the design authority; do not reopen design scope.
- Do not run third-party extension handlers in-process or add a parallel TypeScript runtime.
- Existing dirty state before edits includes `_tasks.md`, task_03-06 tracking files, and untracked `.compozy/tasks/tools-registry/memory/`.

Key decisions:

- Reuse existing extension subprocess JSON-RPC lifecycle and TypeScript `Extension.handle(...)` pattern.
- Manifest descriptors remain authoritative; runtime descriptors are proof only and must fail closed on mismatch.
- Descriptor-only extension-host tools must remain non-callable until runtime reconciliation proves handler/schema/risk parity.

State:

- Task 07 implementation, focused validation, full verification, self-review, task tracking updates, local code-only commit, and post-commit verification are complete.

Done:

- Read workflow memory shared file and `task_07.md`.
- Read root/internal AGH guidance, relevant local skills, Task 07, `_tasks.md`, `_techspec.md` sections, ADR-001, ADR-008, ADR-009, and relevant prior tool-registry ledgers.
- Captured baseline: no `provide_tools`/`tools/call` protocol constants, no manager-side extension tool invoker implementation, and no TypeScript `extension.tool(...)` API.
- Focused baseline tests passed: `go test ./internal/subprocess -run TestValidateInitializeResponseRejectsInvalidContracts -count=1`, `go test ./internal/extension -run 'TestReconcileManifestToolRuntimeReportsAvailabilityReasons|TestManifestToolResourcesRemainColdUntilRuntimeHandleExists' -count=1`, and `bun test sdk/typescript/src/extension.test.ts sdk/create-extension/src/index.test.ts`.
- Added protocol constants/service coverage, manager `ProvideTools`/`CallTool`, extension-host provider, daemon registry wiring, TypeScript `extension.tool(...)`, schema digesting, typed tool execution errors, and create-extension `tool-provider` template.
- Added focused Go and TypeScript tests, including real subprocess coverage for `provide_tools`, `tools/call`, mismatch reasons, handler errors, cancellation, and SDK stdio integration.
- Focused validation passed: `go test ./internal/extension -run 'TestExtensionToolProvider' -count=1`, `go test ./internal/tools -count=1`, `go test ./internal/extension ./internal/subprocess ./internal/daemon -count=1`, `make codegen-check`, `bun test sdk/typescript/src/extension.test.ts sdk/typescript/src/integration.test.ts sdk/create-extension/src/index.test.ts`, TypeScript SDK/create-extension typechecks, and `git diff --check`.
- Full `make verify` first failed Go lint on `cloneManifestToolDescriptor` copying a large manifest descriptor by value; fixed the helper to accept a pointer and reran the focused provider test successfully.
- Full `make verify` then passed pre-commit, but self-review found the tool-provider scaffold TOML manifest used an inline schema incompatible with `json.RawMessage`; changed the template to `extension.json` and reran create-extension focused tests/typecheck successfully.
- Final pre-commit `make verify` passed after the template correction: frontend format/lint/typecheck/tests/build, Go lint `0 issues`, Go tests `DONE 6746 tests`, and package boundaries respected.
- Updated `.compozy/tasks/tools-registry/task_07.md` and `_tasks.md` to completed after verification and self-review.
- Created local code-only commit `f88f47b9 feat: add extension tool runtime sdk`.
- Post-commit `make verify` passed: frontend format/lint/typecheck/tests/build, Go lint `0 issues`, Go tests `DONE 6746 tests`, and package boundaries respected.
- Updated shared workflow memory with durable Task 07 handoffs.

Now:

- Final status check and response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/MEMORY.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/memory/task_07.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/task_07.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry/_tasks.md`
- `/Users/pedronauck/Dev/compozy/agh/internal/extension`
- `/Users/pedronauck/Dev/compozy/agh/internal/subprocess`
- `/Users/pedronauck/Dev/compozy/agh/internal/tools`
- `/Users/pedronauck/Dev/compozy/agh/sdk/typescript`
- `/Users/pedronauck/Dev/compozy/agh/sdk/create-extension`
- New code files include `internal/extension/tool_provider.go`, `internal/extension/tool_runtime.go`, `sdk/typescript/src/schema-digest.ts`, and `sdk/create-extension/templates/tool-provider/`.
