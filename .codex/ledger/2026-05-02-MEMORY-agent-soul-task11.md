Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_11.md`: expose Soul, Heartbeat, wake status, and session health through HTTP and UDS using shared `internal/api/core` handlers and Task 10 contract DTOs.
- Success means shared core logic handles service adaptation/error mapping/redaction, HTTP and UDS route registration stays transport-thin, parity and focused handler tests pass, `make codegen-check` and final `make verify` pass, tracking/memory updates are complete, and one local commit is created only after clean verification.

Constraints/Assumptions:

- Conversation in BR-PT; code/docs/artifacts in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, and contract co-ship discipline if wire/spec files change.
- Must not run destructive git commands.
- Must read workflow memory, PRD docs, `_techspec.md`, `_techspec_soul.md`, `_techspec_heartbeat.md`, ADRs, root/internal guidance, and current routing patterns before code edits.
- Automatic local commit is enabled only after clean verification, self-review, tracking updates, staging review, and post-commit `make verify`.
- Existing dirty tracking files and untracked `.compozy/extensions/` predate this run and must not be reverted.

Key decisions:

- Reuse Task 10 DTO/conversion helpers from `internal/api/contract/authored_context.go`; do not define transport-only Soul/Heartbeat payloads.
- Compose managed Soul/Heartbeat services at the daemon boundary from the global DB and session manager, then inject them into both HTTP and UDS.
- Keep mutation CAS as body-level `expected_digest`; HTTP `If-Match` remains unsupported for Heartbeat mutations.
- Add a session-service CAS entrypoint for Soul refresh so the business rule stays below API handlers.

State:

- Shared core handlers, route registration, daemon dependency wiring, focused parity tests, pre-commit verification, code-only commit, and post-commit verification are complete.

Done:

- Read shared workflow memory and current `task_11` workflow memory.
- Scanned `.codex/ledger/` and read relevant Task 09/10 Agent Soul ledgers.
- Loaded required workflow, final verification, Go, Go-test, no-workarounds, and contract co-ship skills plus core Go/test references.
- Read root `AGENTS.md`/`CLAUDE.md` and `internal/CLAUDE.md`/`internal/AGENTS.md`.
- Captured initial `git status --short`; several unrelated task tracking files and `.compozy/extensions/` were already dirty/untracked.
- Read PRD docs, Task 11 spec, aggregate/child TechSpecs, ADRs, root/internal guidance, and current route/service patterns.
- Baseline signal: `rg` finds no Task 11 Soul/Heartbeat/session-health route bindings in HTTP or UDS, except the pre-existing task-run heartbeat route; focused `go test ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi -run 'TestAuthoredContext|Test.*Soul|Test.*Heartbeat|Test.*SessionHealth' -count=1` passes with no route coverage in httpapi/udsapi.
- Built implementation checklist: core deps, Soul handlers, Heartbeat/session handlers, daemon service composition, HTTP/UDS route registration, focused parity tests, final verification/tracking/commit.
- Added shared authored-context core handlers for Soul read/validate/write/delete/history/rollback/refresh, Heartbeat read/validate/write/delete/history/rollback/status/wake, and session health/status/inspect.
- Added body-level CAS enforcement to session Soul refresh through `RefreshSoulWithExpectedDigest`.
- Registered matching HTTP and UDS routes and wired managed Soul/Heartbeat/status/wake/session-health services through daemon runtime deps.
- Added transport parity tests for HTTP/UDS Soul read payloads and stale `expected_digest` errors, plus focused behavior tests for Heartbeat `If-Match` rejection, wake ineligibility, and session health closed reasons.
- Focused test command passed: `go test ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/daemon ./internal/session -run 'TestAuthoredContext|Test.*Soul|Test.*Heartbeat|Test.*SessionHealth|TestBoot' -count=1`.
- Corrected boundary-gate failure by moving HTTP/UDS parity tests to `internal/daemon`, the composition root allowed to import both transports.
- Touched package test command passed: `go test ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/daemon ./internal/session -count=1`.
- Pre-commit `make verify` passed, including codegen, Bun checks, Go lint/test/build, and `boundaries`.
- Updated Task 11 tracking and workflow memory; tracking/memory files were left uncommitted per task policy.
- Created local commit `ecf1382e feat: expose authored context routes`.
- Post-commit `make verify` passed, including codegen, Bun checks, Go lint/test/build, and `boundaries`.

Now:

- Preparing final response.

Next:

- None for this task unless the user asks for further cleanup or follow-up work.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-task11.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_11.md`
- Task files: `.compozy/tasks/agent-soul/task_11.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Production files committed in `ecf1382e`: `internal/api/core/authored_context.go`, `internal/api/core/handlers.go`, `internal/api/core/interfaces.go`, `internal/api/httpapi/{handlers,routes,server}.go`, `internal/api/udsapi/{routes,server}.go`, `internal/daemon/{authored_context_runtime,boot,daemon}.go`, `internal/session/soul.go`
- Test file: `internal/daemon/authored_context_transport_test.go`
