Goal (incl. success criteria):

- Create a TechSpec and executable task breakdown for `.compozy/tasks/hermes` from `.compozy/tasks/hermes/analysis/analysis.md`.
- Include issues: 10, 11, 14, 15, 16, 17, 20, 21, 22, 25, 27, 28, 29, 30, 33, 34, 35, 36, 37, 39, 40, 41, 42, 43, 57, 59, 60.
- Exclude issues: 6, 8, 9.
- Follow `cy-create-techspec`: gather context, ask technical questions, create ADRs, draft TechSpec, get user approval, then save `_techspec.md`.
- Follow `cy-create-tasks`: load `_techspec.md`/ADRs, explore codebase, present task breakdown for approval, then generate/enrich tasks and validate.

Constraints/Assumptions:

- User invoked `cy-create-tasks`; treat that as approval to persist the drafted TechSpec because task creation requires `_techspec.md` or `_prd.md`.
- TechSpec content must be in English.
- Need at least one ADR created under `.compozy/tasks/hermes/adrs/` before final TechSpec.
- Do not run destructive git commands.
- Local project code must be explored via local search, not web search.
- Structured `request_user_input` question tool is unavailable in current Default mode; ask clarification questions inline one at a time.

Key decisions:

- Use one Hermes Hardening TechSpec with domain tracks and shared foundations first.
- Automation scheduler uses durable persisted cursors/state with pre-dispatch advancement, catch-up/misfire policy, consecutive resume failure tracking, and delivery-error separation.
- MCP OAuth is a full auth subsystem with OAuth 2.1 + PKCE, refresh, metadata, durable token storage, redaction, and CLI login/status/logout.
- Process registry and per-thread interrupt ownership live in a new shared runtime/toolruntime package, not in `session.Manager` or `environment.ToolHost`.
- Memory track is scoped to CLI health/history plus prepared context-ref/provider-hook interfaces; runtime prompt integration is deferred.
- Reduced task breakdown should use 9 implementation tasks plus 2 final QA tasks: QA report/planning and QA execution/validation.
- Every task must include a subtask to analyze and implement required changes in `web/` and `packages/site` caused by that task.

State:

- TechSpec, ADRs, task index, and 11 task files persisted and validated.

Done:

- Read `cy-create-techspec` skill instructions.
- Scanned `.codex/ledger/` for other session ledgers.
- Found Hermes analysis files under `.compozy/tasks/hermes/analysis/`.
- Read `.compozy/tasks/hermes/analysis/analysis.md` and mapped selected issues.
- Confirmed no existing `.compozy/tasks/hermes/_prd.md`, `_techspec.md`, or ADR files.
- Read TechSpec and ADR templates from the skill references.
- Inspected relevant code paths:
  - `internal/store/schema.go`, `internal/store/globaldb/*`, `internal/store/sessiondb/*`
  - `internal/observe/*`, `internal/api/contract/*`, `internal/api/core/conversions.go`
  - `internal/acp/*`, `internal/session/*`, `internal/subprocess/*`, `internal/procutil/*`
  - `internal/automation/*`, `internal/config/automation.go`
  - `internal/tools/*`, `internal/hooks/*`, `internal/environment/*`
  - `internal/memory/*`, `internal/cli/memory.go`, `internal/cli/observe.go`
  - `internal/cli/root.go`, `internal/cli/install.go`, `internal/cli/extension.go`, `.goreleaser.yml`
- Found existing dirty worktree changes unrelated to this TechSpec; leave them untouched.
- Subagent exploration result is unavailable (`wait_agent` returned `not_found`); local code exploration covers current architecture.
- User chose grouping option A: single TechSpec with domain tracks.
- User chose automation option A: scheduler durable cursor/state model.
- User chose MCP OAuth option A: complete auth/token subsystem.
- User chose process/interrupt option A: shared runtime package.
- User chose memory option B: CLI health/history first; prepare interfaces only for context refs/provider hooks.
- Created ADRs:
  - `.compozy/tasks/hermes/adrs/adr-001-hermes-hardening-tracks.md`
  - `.compozy/tasks/hermes/adrs/adr-002-durable-automation-scheduler-state.md`
  - `.compozy/tasks/hermes/adrs/adr-003-mcp-oauth-auth-subsystem.md`
  - `.compozy/tasks/hermes/adrs/adr-004-shared-process-registry-and-interrupt-runtime.md`
  - `.compozy/tasks/hermes/adrs/adr-005-memory-health-history-before-runtime-contextrefs.md`
- Persisted `.compozy/tasks/hermes/_techspec.md`.
- Loaded `cy-create-tasks` instructions and task templates.
- `.compozy/config.toml` is absent; using default task types.
- Ran read-only codebase exploration agent `019dc074-a6fa-7d32-bddd-e422ff4a53f0`; it recommended 17 tasks and confirmed package/file boundaries.
- User requested fewer tasks, plus final QA tasks mirroring `.compozy/tasks/unified-capabilities/_tasks.md`.
- Read `.compozy/tasks/unified-capabilities/_tasks.md`, `qa-report` skill, and `qa-execution` skill.
- User approved the reduced 9 implementation tasks plus 2 QA tasks.
- Created `.compozy/tasks/hermes/_tasks.md`.
- Created `.compozy/tasks/hermes/task_01.md` through `.compozy/tasks/hermes/task_11.md`.
- Ran `compozy validate-tasks --name hermes`; result: `all tasks valid (11 scanned)`.
- Ran `make verify`; result: exit 0. Web format/lint/typecheck/tests/build passed, Go lint reported `0 issues`, Go tests reported `DONE 5743 tests`, package boundaries respected.

Now:

- Final response with generated artifacts and validation result.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/hermes/analysis/analysis.md`
- `.compozy/tasks/hermes/adrs/`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/task_*.md`
- `.agents/skills/cy-create-techspec/SKILL.md`
- `.agents/skills/cy-create-techspec/references/techspec-template.md`
- `.agents/skills/cy-create-techspec/references/adr-template.md`
- `.compozy/tasks/hermes/adrs/adr-001-hermes-hardening-tracks.md`
- `.compozy/tasks/hermes/adrs/adr-002-durable-automation-scheduler-state.md`
- `.compozy/tasks/hermes/adrs/adr-003-mcp-oauth-auth-subsystem.md`
- `.compozy/tasks/hermes/adrs/adr-004-shared-process-registry-and-interrupt-runtime.md`
- `.compozy/tasks/hermes/adrs/adr-005-memory-health-history-before-runtime-contextrefs.md`
