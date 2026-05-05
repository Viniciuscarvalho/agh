Goal (incl. success criteria):

- Implement Session Repair V1 for interrupted transcript terminalization.
- Success means append-only repair closes crashed/error sessions' incomplete final turns, HTTP/UDS/CLI surfaces exist with dry-run, boot auto-repair runs for crashed/error sessions, focused tests and make verify pass.

Constraints/Assumptions:

- Implement accepted plan persisted at `.codex/plans/2026-04-28-session-repair-v1.md`.
- Must not run destructive git commands.
- Use local code search only for project code.
- Conversation in Brazilian Portuguese; artifacts in English.
- Default repair mode: Boot + manual.
- No truncation/resequence/delete; repair is append-only.

Key decisions:

- Treat this as a targeted architecture/code review, not an implementation task.
- The real gap is transcript/event-store terminalization after daemon crash, not generic task process recovery.
- Event sequence gaps should be treated as diagnostics first; truncation is not justified from current code evidence.

State:

- Web/docs impact co-ship complete; verification passed.

Done:

- Listed existing ledger files for cross-agent awareness.
- Read relevant prior ledgers: session chat/resume repair, prompt stream stall, session lineage, long-running sessions.
- Read internal runtime instructions.
- Inspected boot task recovery, observer reconciliation, session metadata repair, session event DB, transcript projection, prompt event recording, and spawn reaper.
- Persisted accepted implementation plan.
- Added append-only `session.Manager.RepairSession` domain logic.
- Added HTTP/UDS/core contract wiring and CLI `agh session repair`.
- Added focused session/API/CLI/boot tests and confirmed touched Go packages pass so far.
- Ran `make codegen`, `make codegen-check`, and regenerated scoped CLI reference docs for `agh session repair`.
- Ran `$cy-web-docs-impact` audit against the implemented session repair feature.
- Added web session repair client surface (`repairSession`, `useRepairSession`, generated-type aliases, MSW fixture/handler, focused tests) without adding a visible web UI control.
- Updated conceptual site docs for crash transcript repair in session lifecycle, resume, and troubleshooting pages.
- Appended explicit Web/Docs + Extensibility/Agent Manageability/Config Lifecycle impact sections to the persisted plan.
- `bunx vitest run web/src/systems/session/adapters/session-api.test.ts web/src/systems/session/hooks/use-session-actions.test.tsx` passed with 2 files / 44 tests.
- `make verify` failed on Go lint: `funlen` in `internal/session/repair.go`, `gocyclo` in `internal/daemon/boot.go`, and `revive` stutter for session repair types.
- Renamed session package exported repair types to `RepairOpts`, `RepairResult`, `RepairIssue`, and `RepairAction`.
- Split session repair planning/event analysis helpers and daemon boot component orchestration to address lint root causes.
- `go test ./internal/session ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/cli ./internal/daemon` passed.
- `make lint` passed with `0 issues`.
- `make verify` passed: Bun lint/typecheck/test/build, Go lint, 6470 Go tests, and package boundaries all succeeded.

Now:

- Ready to report completion.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- .codex/ledger/2026-04-28-MEMORY-session-repair-gap.md
- .codex/plans/2026-04-28-session-repair-v1.md
- internal/daemon/boot.go
- internal/daemon/task_runtime.go
- internal/observe/reconcile.go
- internal/session/liveness.go
- internal/session/resume_repair.go
- internal/session/query.go
- internal/session/manager_prompt.go
- internal/session/manager_lifecycle.go
- internal/store/meta.go
- internal/store/types.go
- internal/store/sessiondb/session_db.go
- internal/transcript/transcript.go
- internal/transcript/ui_messages.go
- internal/daemon/spawn_reaper.go
- internal/session/repair.go
- internal/session/repair_test.go
- internal/api/contract/contract.go
- internal/api/contract/responses.go
- internal/api/core/handlers.go
- internal/api/core/conversions.go
- internal/api/core/interfaces.go
- internal/api/httpapi/routes.go
- internal/api/udsapi/routes.go
- internal/api/spec/spec.go
- internal/cli/client.go
- internal/cli/session.go
