Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_10.md`: shared API contract DTOs, OpenAPI/codegen registration, generated TypeScript surfaces, and contract tests for Soul, Heartbeat, session health, wake state/events, authoring, diagnostics, provenance, redaction, and CAS body shape.
- Success means DTOs are shared by future HTTP/UDS/CLI/web/SDK/ext surfaces, generated artifacts are current, required focused tests plus `make codegen`, `make codegen-check`, and final `make verify` pass, tracking/memory updates are complete, and one local commit is created only after clean verification.

Constraints/Assumptions:

- Conversation in BR-PT; code/docs/artifacts in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `agh-contract-codegen-coship`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, and `typescript-advanced`.
- Must not run destructive git commands.
- Must read workflow memory, PRD docs, `_techspec.md`, `_techspec_soul.md`, `_techspec_heartbeat.md`, every ADR, and local repo guidance before code edits.
- Route implementation belongs to task 11; this task may add only contract/schema plumbing required for codegen.
- Automatic local commit is enabled only after clean verification, self-review, memory/tracking updates, and staging review.
- Keep unrelated existing dirty task files and `.compozy/extensions/` untouched.

Key decisions:

- Treat generated OpenAPI/web/SDK outputs as part of this task because contract DTOs change.
- Body-level `expected_digest` is the canonical CAS field across all mutation DTOs.
- Split compact `/agent/context` Soul projection into `AgentSoulSectionPayload`; reserve `AgentSoulPayload` for the full dedicated Soul read model.
- Register new DTO roots with SDK TypeScript generation through `internal/extension/contract.SDKRootTypes`; Host API methods remain task 13 scope.

State:

- Complete. Implementation, tracking/memory updates, local commit, and post-commit verification are done.

Done:

- Scanned `.codex/ledger/` and read relevant Agent Soul/task04/task09 ledgers.
- Read shared workflow memory and current `task_10` workflow memory.
- Loaded required workflow, contract, Go, Go-test, TypeScript, and final-verification skills plus relevant skill references.
- Read root/backend/web guidance and recorded pre-existing dirty worktree state.
- Read task 10, `_tasks.md`, aggregate/child TechSpecs, ADR-001 through ADR-011, and OpenClaw heartbeat precedent references.
- Confirmed no task/spec/ADR conflict blocking implementation.
- Added shared contract DTOs/enums/conversion/redaction helpers for Soul, Heartbeat, session health, wake state/events, and authoring requests.
- Registered future HTTP/UDS OpenAPI operation schemas for Soul, Heartbeat, session health/status/inspect, and wake routes without handlers.
- Added generated SDK root type coverage for new API contract DTOs.
- Added focused Go tests for DTO serialization/redaction, closed enum conversion, CAS body shape, config provenance determinism, OpenAPI schema registration, and HTTP/UDS transport parity.
- Added TypeScript smoke tests for generated web OpenAPI operation types and SDK contract exports.
- Ran `make codegen` and `make codegen-check`.
- Fixed `internal/extension/host_api_test.go` test harness cleanup after `make verify` exposed an unclosed `globaldb` handle in `newHostAPITestEnv`; focused extension tests pass after the cleanup fix.
- `make verify` passed after all implementation and cleanup changes.
- Updated `.compozy/tasks/agent-soul/task_10.md` and the Task 10 row in `_tasks.md` to completed.
- Created local commit `1ad85048 feat: add agent soul contract surface`.
- Post-commit `make verify` passed: Go lint `0 issues`, Go tests `DONE 7675 tests in 13.022s`, boundaries `OK: all package boundaries respected`; only the existing Vite chunk-size warning appeared.

Now:

- Ready to report completion to the user.

Next:

- No next implementation action for Task 10.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-task10.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_10.md`
- Task files: `.compozy/tasks/agent-soul/task_10.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Contract/codegen surfaces: `internal/api/contract/`, `internal/api/spec/`, `openapi/agh.json`, `web/src/generated/agh-openapi.d.ts`, `sdk/typescript/src/generated/contracts.ts`, `internal/extension/contract/sdk.go`, `internal/codegen/sdkts/generate.go`
- Ancillary verified cleanup: `internal/extension/host_api_test.go`
- Focused evidence: `go test ./internal/api/contract -count=1`; `go test ./internal/api/spec -count=1`; `go test ./internal/api/contract ./internal/api/spec ./internal/codegen/sdkts ./internal/extension/contract -count=1`; `bunx vitest run src/lib/agent-authored-context-contract.test.ts` from `web/`; `bunx vitest run src/authored-context-contracts.test.ts` from `sdk/typescript/`; `go test -race ./internal/extension -run '^TestHostAPIHandlerSessionsEventsSupportsSinceFilter$' -count=1 -v`; `go test -race ./internal/extension -count=1 -parallel=4`
- Gate evidence: `make codegen`; `make codegen-check`; `make bun-typecheck`; `make lint`; `make bun-lint`; `make bun-test`; `make verify`
