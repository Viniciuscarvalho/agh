Goal (incl. success criteria):

- Complete `.compozy/tasks/session-driver-override/task_05.md` by exposing workspace-scoped provider options on workspace detail payloads and making automatic internal session creators pass `Provider: ""` explicitly.
- Success means `WorkspaceDetailPayload` carries sorted provider options derived from the resolved workspace config, HTTP/UDS workspace detail handlers expose them consistently, automatic creators stay pinned to agent-default provider selection by explicit empty provider, required tests pass, and `make verify` passes.

Constraints/Assumptions:

- Work is in `/Users/pedronauck/dev/compozy/agh`, not the launcher worktree at `/Users/pedronauck/Dev/compozy/_worktrees/daemon-web-ui`.
- Follow `/Users/pedronauck/dev/compozy/agh/{AGENTS.md,CLAUDE.md}` plus the user-provided workflow/task instructions.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `cy-final-verify`.
- `brainstorming` was reviewed but the design is already fixed by `_techspec.md` and ADR-004, so execution should stay within that approved design.
- Existing unrelated changes in `.compozy/tasks/session-driver-override/{_tasks.md,task_01.md,task_02.md,task_03.md,task_04.md}` and the memory directory must be preserved.
- No destructive git commands without explicit user permission.

Key decisions:

- The provider catalog should be assembled from `workspace.ResolvedWorkspace.Config`, because that is the merged workspace config already used by session creation/runtime resolution.
- Provider options should be deterministic and UI-ready: one entry per visible provider name, sorted stably.
- Automatic internal creators should set `Provider: ""` explicitly rather than relying on zero-value omission.

State:

- Completed.

Done:

- Read required repo instructions, skills, workflow memory files, task docs, `_techspec.md`, `_tasks.md`, `task_02.md`, ADR-001, and ADR-004.
- Read relevant prior ledgers:
- `.codex/ledger/2026-04-20-MEMORY-session-driver-override.md`
- `.codex/ledger/2026-04-21-MEMORY-session-provider-contracts.md`
- `.codex/ledger/2026-04-21-MEMORY-session-provider-persistence.md`
- Confirmed current gaps:
- `contract.WorkspaceDetailPayload` does not expose provider options.
- `GetWorkspace` does not publish a provider catalog.
- Automatic creators in automation/task runtime/dream/network/bridge session paths omit an explicit `Provider` field.
- Implemented `contract.SessionProviderOptionPayload` and exposed `WorkspaceDetailPayload.Providers`.
- Added stable sorted provider-option assembly from the resolved workspace config in `internal/api/core/conversions.go` and wired it through workspace detail responses.
- Updated automatic internal session creators in automation, daemon task runtime, memory consolidation, network details, and host bridge session creation to pass `Provider: ""` explicitly.
- Added handler/unit/integration coverage for provider-option ordering, workspace detail payload exposure, boot recovery/runtime creator defaults, and bridge/network creator defaults.
- Regenerated `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`.
- Fixed a follow-up lint failure by removing unused shared test aliases in `internal/api/httpapi/shared_test.go` and `internal/api/udsapi/shared_test.go`.
- Verification passed:
- `make codegen-check`
- `make verify`
- Touched implementation coverage: `83.4%` (`1787/2142` statements) across the changed implementation files.

Now:

- Task implementation, verification, and tracking updates are complete.

Next:

- Create the local code commit, keeping tracking-only files out of the commit.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-21-MEMORY-workspace-provider-catalog.md`
- `.compozy/tasks/session-driver-override/{_techspec.md,_tasks.md,task_02.md,task_05.md,adrs/adr-001.md,adrs/adr-004.md}`
- `.compozy/tasks/session-driver-override/memory/{MEMORY.md,task_05.md}`
- `internal/api/{contract/contract.go,core/{conversions.go,workspaces.go,conversions_parsers_test.go,memory_workspace_test.go}}`
- `internal/{automation/dispatch.go,daemon/task_runtime.go,memory/consolidation/runtime.go,extension/host_api_bridges.go}`
- `internal/api/{httpapi/handlers_test.go,udsapi/handlers_test.go}`
- Commands: `rg`, `sed`, `git status --short`, `go test`, `make codegen-check`, `make verify`
