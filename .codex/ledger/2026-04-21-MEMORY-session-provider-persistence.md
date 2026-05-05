Goal (incl. success criteria):

- Complete task_02 for `.compozy/tasks/session-driver-override/`: thread the effective session provider through AGH runtime and on-disk session metadata, fail invalid/unavailable providers before side effects, add required tests, update task tracking/memory, and finish with a clean `make verify`.
- Success requires `provider` to survive create -> persist -> status/query -> resume, explicit resume failure on unavailable persisted providers, required logging fields where applicable, and verification evidence from `make verify`.

Constraints/Assumptions:

- Must follow the task docs, `_techspec.md`, ADRs, task_01, and workflow memory files as source of truth.
- Must use `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, `cy-final-verify`; `brainstorming` was reviewed but its hard gate conflicts with the explicit execute-task workflow already requested for this implementation task.
- Do not use destructive git commands. Existing unrelated changes in `.compozy/tasks/session-driver-override/_tasks.md`, `task_01.md`, and the untracked memory directory must be preserved.
- Task scope stops short of task_03 global DB migration and task_04 transport/API contract exposure; keep edits tight to runtime/persistence plumbing needed now.

Key decisions:

- Use task slug `session-provider-persistence` for this session ledger.
- Treat `spec.workspace.Config.ResolveSessionAgent(...)` as the canonical runtime resolution path for both create and resume.
- Keep `store.SessionInfo.Provider` compile-safe for downstream observers without pulling the task_03 schema migration forward unless the current task strictly requires it.

State:

- Completed.

Done:

- Read repo instructions in `/Users/pedronauck/dev/compozy/agh/{AGENTS.md,CLAUDE.md}` and the user-provided workspace policies.
- Read required skill docs: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, and `brainstorming`.
- Read workflow memory files `memory/MEMORY.md` and `memory/task_02.md`.
- Read task docs: `task_02.md`, `_tasks.md`, `_techspec.md`, ADR-001..005, and `task_01.md`.
- Scanned relevant prior ledgers and read `2026-04-20-MEMORY-session-driver-override.md`.
- Confirmed pre-change gaps:
- `internal/session/manager_start.go` still resolves runtime with `spec.workspace.Config.ResolveAgent(agentDef)`, not `ResolveSessionAgent`.
- `session.CreateOpts`, `session.Session`, `session.Info`, `store.SessionMeta`, and `store.SessionInfo` do not yet carry `Provider`.
- `Session.Meta()` and `sessionInfoFromMeta()` do not round-trip provider.
- Resume validation still checks `ResolveAgent` and the load-session-missing path still logs a fallback warning.
- Implemented provider plumbing across runtime and storage:
- Added `Provider` to `session.CreateOpts`, `session.Info`, `session.Session`, `store.SessionMeta`, and `store.SessionInfo`.
- Switched create/resume runtime resolution to the session-aware helper path and validated provider selection before metadata writes and driver start.
- Threaded provider through `Session.Meta()`, session read-model assembly, observer/environment reconciliation helpers, and inactive metadata repair/validation.
- Added structured create/resume/legacy-repair logs carrying `session_id`, `agent_name`, `provider`, and `phase`.
- Added focused tests for provider override propagation, invalid-provider pre-persistence failure, legacy provider repair on read, unavailable persisted provider resume failure, and create/status/list/resume provider persistence.
- Focused verification passed:
- `go test ./internal/session ./internal/store ./internal/observe ./internal/daemon`
- `go test -tags integration ./internal/session -run TestManagerIntegrationProviderPersistsAcrossCreateStatusListAndResume`
- Coverage check passed:
- `go test -cover ./internal/session ./internal/store`
- `internal/session`: `80.8%`
- `internal/store`: `85.5%`
- Created local code-only commit `d20bfffd` with message `feat: persist provider through runtime metadata`.

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/session-driver-override/{task_02.md,_tasks.md,_techspec.md,task_01.md,adrs/*.md}`
- `.compozy/tasks/session-driver-override/memory/{MEMORY.md,task_02.md}`
- `internal/session/{manager.go,manager_start.go,manager_lifecycle.go,manager_helpers.go,manager_workspace.go,query.go,resume_repair.go,session.go,session_test.go,query_test.go,log_capture_test.go,provider_lifecycle_test.go,provider_lifecycle_integration_test.go}`
- `internal/store/{types.go,session_liveness_test.go}`
- `internal/observe/{observer.go,reconcile.go}`
- `internal/daemon/environment_reconcile.go`
- Commands used: `rg`, `sed`, `git status --short`, `go test`, `gofmt`
