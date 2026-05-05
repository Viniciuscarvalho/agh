Goal (incl. success criteria):

- Implement Hermes Task 03: ACP/session lifecycle failure classification, durable redacted diagnostics, API/SSE/CLI visibility, downstream agent probes, crash bundles, web/site impact assessment, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, `deadlock-finder-and-fixer`, `systematic-debugging`, and `no-workarounds`.
- Do not run destructive git commands.
- Do not hand-edit dependencies; use repository patterns and `go get` only if needed.
- Keep scope to Task 03 and record follow-ups instead of expanding silently.
- Crash evidence must be bounded and redacted before persistence or exposure.
- Build on Task 02 typed health payloads (`health.persistence` and `health.retention`) instead of adding unrelated top-level health fields.

Key decisions:

- Store owns the canonical typed failure model; session/acp/API/CLI/web surfaces project from that model instead of comparing strings.
- Failure kinds will distinguish startup, handshake, load-session, protocol, prompt, cancellation, permission, process-exit, transport, timeout, and unknown failures.
- Crash bundles will be written under the AGH home directory as bounded, redacted JSON and session metadata will store the crash bundle path.
- Startup failures after session metadata is opened must leave a stopped session meta record instead of deleting the session directory, so CLI/API read paths can report the failure.
- Observe health will extend Task 02 typed health with lifecycle failure/probe sections rather than new ad hoc top-level fields.

State:

- Task 03 implementation, downstream follow-up, full verification, tracking updates, self-review, and scoped local commit are complete.

Done:

- Read required workflow memory files for Hermes shared memory and Task 03 memory.
- Read required skills and repository guidance.
- Read Hermes `_techspec.md`, `_tasks.md`, Task 03, all ADRs, Task 02 outputs/memory, and relevant ACP lifecycle analysis.
- Scanned `.codex/ledger/` and read relevant Hermes Task 01/02/TechSpec ledgers.
- Added canonical `store.FailureKind` / `SessionFailure`, redaction helpers, persistence columns, metadata propagation, API/SSE/CLI DTOs, transcript propagation, ACP error classification, downstream probe primitives, observe health extensions, and redacted crash bundle generation.
- Updated focused backend tests for ACP classification/probes, session startup failure persistence, global DB schema/scans, API conversions, and contract JSON.
- Added observe/API health coverage for lifecycle failures and probes; corrected probe result command redaction.
- Regenerated OpenAPI/web/TypeScript SDK contracts and updated web session/daemon fixtures/types for `failure`, `failures`, and `agent_probes`.
- Updated site lifecycle, event streaming, and observe health docs for failure kinds, crash bundles, SSE payloads, and probe health.
- Targeted checks passed: focused Go tests, `make codegen-check`, `bun run --cwd web typecheck:raw`, and impacted web Vitest files.
- Full `make verify` first rerun failed in `internal/session TestPromptActivitySupervisorTimeoutCancelsThenStopsSession`; corrected runtime timeout handling so `timeout_cancel_grace` remains only the cooperative-cancel grace and forced session stop uses a separate bounded operation deadline.
- Targeted regression checks now pass: `go test ./internal/session -run TestPromptActivitySupervisorTimeoutCancelsThenStopsSession -count=20 -race` and `go test ./internal/session -run TestPromptActivity -count=1 -race`.
- Fresh full `make verify` passed after all code changes; output included `0 issues.`, `DONE 5790 tests in 28.108s`, and `OK: all package boundaries respected`.
- Updated workflow memory and task tracking for Task 03 completion.
- Created commit `b01f4963 feat: harden acp session lifecycle`.
- Post-commit full `make verify` passed; output included `Found 0 warnings and 0 errors`, `0 issues.`, `DONE 5790 tests in 5.640s`, and `OK: all package boundaries respected`.

Now:

- Prepare final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None requiring user input yet.

Working set (files/ids/commands):

- `.compozy/tasks/hermes/task_03.md`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/adrs/`
- `.compozy/tasks/hermes/memory/MEMORY.md`
- `.compozy/tasks/hermes/memory/task_03.md`
- `.codex/ledger/2026-04-24-MEMORY-hermes-lifecycle-hardening.md`
- Code surfaces: `internal/store/*`, `internal/store/globaldb/*`, `internal/session/*`, `internal/acp/*`, `internal/diagnostics/*`, `internal/observe/*`, `internal/api/contract/contract.go`, `internal/api/core/*`, `internal/cli/*`, `internal/daemon/*`, `internal/transcript/*`.
- Downstream surfaces: `openapi/agh.json`, `web/src/generated/agh-openapi.d.ts`, `sdk/typescript/src/generated/contracts.ts`, `web/src/systems/session/types.ts`, `web/src/systems/daemon/*`, `web/src/hooks/routes/use-home-page.test.tsx`, `packages/site/content/runtime/core/sessions/{lifecycle,events}.mdx`, `packages/site/content/runtime/cli-reference/observe/health.mdx`.
