Goal (incl. success criteria):

- Implement `.compozy/tasks/autonomous/task_04.md`: bounded situation surface providers for `/agent/context` and session prompt seams, with deterministic rendering, truncation metadata, provenance, tests, verification, tracking updates, and one local code commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`/`CLAUDE.md`: no destructive git commands, no web search for local code, `make verify` before completion/commit.
- Required skills loaded: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Workflow memory files under `.compozy/tasks/autonomous/memory` are mandatory context and must be updated before finish.
- Existing worktree has pre-existing `.compozy` edits and untracked memory files; do not revert or stage unrelated changes.

Key decisions:

- Implement testable context assembly/rendering in `internal/situation`, with daemon-only wiring into startup prompt sections and live prompt augmenters.
- Reuse `session.StartupPromptContext` for startup identity because it already includes `SessionID`.

State:

- completed

Done:

- Loaded required skills.
- Read root `AGENTS.md`/`CLAUDE.md`, shared workflow memory, current task memory, and relevant prior ledgers for Tasks 01-03.
- Read Task 04, `_tasks.md`, `_techspec.md`, ADRs 001-012, and key session/daemon/task/network/contract seams.
- Updated task-local workflow memory with the implementation shape.
- Implemented `internal/situation` context assembly/rendering, daemon startup/live prompt wiring, and targeted unit/integration coverage.
- Verified targeted commands:
  - `go test ./internal/situation -cover` => 81.2% statements.
  - `go test ./internal/situation ./internal/session ./internal/daemon` => pass.
  - `go test -tags integration ./internal/daemon -run 'TestHarnessContextIntegrationStartupAndPromptShareResolverPolicy|TestHarnessContextIntegrationStartupOmitsNetworkSectionForNonChannelSession|TestPromptInputCompositeIntegrationPreservesStoredMessagesAcrossUserAndNetworkTurns'` => pass.
- Verified full gate:
  - `make verify` => pass; output included `0 issues.`, `DONE 6041 tests in 35.055s`, and `OK: all package boundaries respected`.
- Verified final pre-commit gate:
  - `make verify` => pass; output included frontend `Found 0 warnings and 0 errors.`, Go lint `0 issues.`, `DONE 6041 tests in 5.489s`, and `OK: all package boundaries respected`.
- Created local commit `5d87b3ed feat: add situation surface providers`.

Now:

- Task complete; code commit created. Workflow/tracking files remain unstaged with other `.compozy` PRD edits.

Next:

- Report final outcome.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/autonomous/task_04.md`
- `.compozy/tasks/autonomous/_techspec.md`
- `.compozy/tasks/autonomous/_tasks.md`
- `.compozy/tasks/autonomous/memory/MEMORY.md`
- `.compozy/tasks/autonomous/memory/task_04.md`
- `internal/situation/*`
- `internal/daemon/*`
- `internal/session/manager_start.go`
- `internal/session/prompt_overlay.go`
