Goal (incl. success criteria):

- Complete hooks task_10 by wiring typed hook dispatch into session create/resume/stop, prompt/input, event recording, and agent lifecycle paths, with focused tests plus clean `make verify`.
- Success means: required hook points fire at the right lifecycle boundaries, sync barriers can deny/patch where specified, existing session cleanup/error handling remains intact, task memory/tracking are updated, and one local commit is created after verification.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `.compozy/tasks/hooks/task_10.md`, `_techspec.md`, `_tasks.md`, ADR-006, and workflow memory files as source of truth.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify`.
- The approved task/techspec/ADR set already satisfies the design intent for `brainstorming`; do not reopen design scope unless a real contradiction appears.
- Keep scope tight to task_10. Future `turn.*`, `message.*`, `tool.*`, and `permission.*` runtime wiring beyond task-required integration coverage stays out of scope.
- Existing unrelated worktree changes must not be reverted or overwritten.

Key decisions:

- Keep `internal/session` decoupled from the concrete `internal/hooks.Hooks` type by adding a narrow session-owned hook-dispatch interface and adapting the real runtime in `internal/daemon`.
- Reuse existing notifier behavior for observer fan-out, but move the new pre/post dispatch barriers into the manager paths that need them instead of overloading `Notifier`.

State:

- Complete.

Done:

- Read the required skill docs, workflow memory, task spec, `_techspec.md`, `_tasks.md`, ADR-006, and related hook/session ledgers.
- Captured the baseline signal: `internal/session` still only knows `Notifier`, `startupPrompt` only assembles, `recordEvent` persists directly, and `internal/hooks.OnAgentEvent` remains a no-op for the richer task_10 agent lifecycle events.
- Built the execution checklist covering the required lifecycle, input/prompt, event, agent, testing, verification, and tracking steps.
- Added the session-owned `HookDispatcher` seam, wired session lifecycle/input/prompt/event/agent dispatch paths, and bridged the concrete runtime from `internal/daemon`.
- Added task-focused session/hooks/daemon tests, including full lifecycle integration coverage and the permission escalation regression.
- Fixed the real permission invariant bug by classifying ACP `reject-once` / `reject-always` as denied states.
- Re-ran task verification with passing unit, integration, coverage, and `make verify` results.
- Updated workflow memory and task tracking for task_10.

Now:

- Final handoff only.

Next:

- Create the local commit, then delete this ledger if no follow-up remains.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-09-MEMORY-session-hook-dispatch.md`
- `.compozy/tasks/hooks/task_10.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/adrs/adr-006.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_10.md`
- `internal/session/manager.go`
- `internal/session/manager_lifecycle.go`
- `internal/session/manager_helpers.go`
- `internal/session/manager_prompt.go`
- `internal/session/interfaces.go`
- `internal/daemon/hooks_bridge.go`
- `internal/daemon/boot.go`
