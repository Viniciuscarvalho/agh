Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_13.md`: add extension Host API actions/grants, hook payloads, tools/resources, TypeScript SDK helpers, and tests for Soul, Heartbeat, session health, and wake audit/status without bypassing managed authoring or runtime authority boundaries.
- Success means the new extensibility surfaces route through Task 08-11 managed services/contracts, exact grants deny unauthorized access deterministically, no direct `SOUL.md`/`HEARTBEAT.md` writes or wake/task claim bypasses are exposed, required focused tests and `make verify` pass, tracking/memory updates are complete, and one local commit is created only after clean verification.

Constraints/Assumptions:

- Conversation in BR-PT; code/docs/artifacts in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, Go/code/test skills, `agh-contract-codegen-coship` for generated/contract surfaces, and `typescript-advanced` for SDK helpers.
- Must not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- Must read workflow memory, root/internal guidance, aggregate/child TechSpecs, ADRs, and current extension/tool/resource architecture before code edits.
- `make verify` is required before completion and before/after any automatic commit.
- Pre-existing dirty/untracked tracking files and `.compozy/extensions/` were present before this task; do not revert or stage unrelated changes.

Key decisions:

- Route Host API implementations through the same managed Soul/Heartbeat/session-health/wake services used by Task 11, with local Host API adapters only for JSON-RPC decoding/error mapping and workspace target resolution.
- Body-level `expected_digest` remains the only CAS contract for Soul/Heartbeat mutation surfaces.
- Host API write/delete/rollback/wake/status/health grants must be exact action grants, separate from read/history/validate grants.
- Keep Soul out of canonical tool/resource desired-state in MVP because `_techspec_soul.md` explicitly forbids a Soul tool registry entry, MCP tool, or `internal/resources` kind. Heartbeat/session health may expose read/status tooling only if it stays on managed services and does not claim tasks.
- Hook work must add Soul snapshot/digest provenance to common session/task/spawn contexts and add typed Heartbeat wake/session-health payloads without raw prompt or secret data.

State:

- Task implementation is committed locally and post-commit verification is green. Only tracking/memory/unrelated pre-existing `.compozy` changes remain uncommitted.

Done:

- Loaded required workflow-memory, PRD execution, final-verification, Go, contract, Go-test, testing, and TypeScript skills plus key references.
- Read shared workflow memory and current `task_13.md` workflow memory.
- Read root `AGENTS.md`/`CLAUDE.md`, `internal/AGENTS.md`/`internal/CLAUDE.md`, `_tasks.md`, task 13, aggregate TechSpec, Soul TechSpec, Heartbeat TechSpec, and ADR-001 through ADR-011.
- Scanned related ledgers for Task 07/08/10/11/12 handoffs.
- Captured pre-existing `git status --short`; many task tracking files and `.compozy/extensions/` are already dirty/untracked.
- Inspected extension protocol/contract/implementation, grant checker, daemon extension wiring, authored-context core handlers, hook taxonomy/payloads, session hook context builders, and TypeScript Host API helper.
- Added Host API protocol/constants/specs/grants/handlers for Soul read/validate/write/delete/history/rollback, session Soul refresh, Heartbeat read/validate/write/delete/history/rollback/status/wake, session health, and session status.
- Wired daemon extension/API/native tool dependencies to managed Soul, Heartbeat, session-health, wake, and wake-audit services.
- Added hook context provenance for Soul snapshot/digest on session/task/spawn contexts plus typed authored-context observation events and dispatch for Soul snapshots/mutations, Heartbeat policy/wake, and session-health transitions.
- Added managed built-in tools/toolset for session health, Heartbeat status, and advisory Heartbeat wake; Soul remains out of tools/resources by TechSpec.
- Updated generated contracts/OpenAPI/web types, TypeScript Host API helpers/tests, and Go SDK Host API constants.
- Focused validation passed:
  - `go test ./internal/hooks ./internal/extension/contract ./internal/extension/protocol ./internal/extension ./internal/session ./internal/daemon ./internal/tools/builtin ./sdk/go -count=1`
  - `bun test sdk/typescript/src/host-api.test.ts sdk/typescript/src/authored-context-contracts.test.ts`
  - `bun run --cwd sdk/typescript typecheck`
  - `make codegen-check`
- Fixed `make lint` findings caused by authored-context hook additions pushing `SandboxPreparePayload` over gocritic's `hugeParam` threshold. Kept the public JSON shape stable by moving Soul session provenance into an embedded optional `SessionSoulContext` and passing large Soul/Heartbeat hook helper inputs by pointer.
- Re-ran `make codegen` after the embedded context change; `make codegen-check` is now green again.
- `make verify` passed end-to-end after implementation and lint/codegen corrections:
  - Bun lint/typecheck/test/build passed; Bun test reported 264 files and 1874 tests.
  - Go fmt/lint/test/build/boundaries passed; Go test reported 7706 tests and package boundaries OK.
- Updated `.compozy/tasks/agent-soul/task_13.md` status/checklists and the Task 13 row in `_tasks.md` after clean verification.
- Created local commit `a7ff03bb` (`feat: add authored context extension surfaces`) with only Task 13 code/test/generated files staged.
- Post-commit `make verify` passed:
  - Bun lint found 0 warnings/0 errors; Bun tests reported 264 files and 1874 tests.
  - Web build completed; Go lint reported 0 issues.
  - Go tests reported 7706 tests; package boundaries reported OK.

Now:

- Prepare final response with verification evidence and residual worktree note.

Next:

- None for Task 13 in this session.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-task13.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_13.md`
- Task files: `.compozy/tasks/agent-soul/task_13.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Primary code surfaces: `internal/extension/protocol/host_api.go`, `internal/extension/contract/{host_api.go,sdk.go}`, `internal/extension/host_api*.go`, `internal/extension/capability.go`, `internal/daemon/{authored_context_runtime.go,daemon.go,boot.go,hooks_bridge.go,native_tools.go}`, `internal/hooks/{events.go,introspection.go,payloads.go,dispatch.go,matcher.go}`, `internal/session/{health.go,hooks.go,manager*.go,spawn.go}`, `internal/task/{manager.go,lease_manager.go}`, `internal/tools/builtin*`, `sdk/typescript/src/host-api.ts`, `sdk/go/host_api.go`, generated contracts/OpenAPI/web types.
