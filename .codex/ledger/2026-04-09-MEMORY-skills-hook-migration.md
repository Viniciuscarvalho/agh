Goal (incl. success criteria):

- Complete task 07: migrate `internal/skills` hook parsing to `internal/hooks.HookDecl`, delete old skill-owned hook dispatch/types, update fixtures/tests, pass task-required tests/coverage and `make verify`, then update tracking and commit.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Do not touch unrelated modified files in the dirty worktree.
- Task 07 scope is `internal/skills` parsing/types/tests plus affected references; daemon wiring replacement is deferred to task 09 per techspec.
- Hard cut-over only; no compatibility shims for old `on_*` events or old hook types.

Key decisions:

- Treat task 07 as a hard cut-over: legacy skill hook types and `on_*` events are removed, with descriptive replacement errors for the old event names instead of compatibility aliases.
- Keep `internal/hooks` dependency-free by removing the base-package notifier adapter once `internal/skills` imports `internal/hooks`; the session/daemon bridge now lives temporarily in `internal/daemon` until task 09 replaces notifier fanout properly.
- Normalize skill hook metadata after final source/provenance assignment so `hooks.HookDecl.Source` and `SkillSource` stay aligned with registry ordering and marketplace policy checks.

State:

- Complete. Code committed and re-verified; workflow memory and task tracking updated locally.

Done:

- Read AGENTS/CLAUDE guidance, required skill docs, workflow memory, task spec, `_techspec.md`, `_tasks.md`, ADR-002, and current workspace status.
- Captured baseline references showing old hook types/runner still exist across `internal/skills` and daemon tests.
- Deleted `internal/skills/hooks.go`, `hook_process_unix.go`, `hook_process_windows.go`, and `hooks_test.go`.
- Migrated `internal/skills.Skill.Hooks` and loader/registry cloning to `internal/hooks.HookDecl`, including strict dotted-event parsing, defaults, and legacy-event replacement errors.
- Added `internal/skills/hook_decl.go` to refresh synthesized hook metadata after source/provenance resolution.
- Updated skills fixtures/tests plus affected daemon/hooks tests to the new declaration model and dotted taxonomy.
- Removed `internal/hooks/notifier.go`, added a minimal `internal/hooks/agent_event.go` stub, and moved the temporary session hook bridge into `internal/daemon` to break the `session -> skills -> hooks -> session` import cycle.
- Verification passed: `go test ./internal/hooks ./internal/skills ./internal/daemon -count=1`, `go test -tags integration ./internal/daemon -run 'TestNotifierFanout' -count=1`, `go test -coverprofile=/tmp/internal-skills.cover ./internal/skills -count=1` (`81.3%`), and `make verify`.
- Updated task memory and shared workflow memory for task 07.
- Updated `.compozy/tasks/hooks/task_07.md` and `.compozy/tasks/hooks/_tasks.md` locally after verification; left tracking artifacts unstaged per task instructions.
- Created local code-only commit `4832b48` (`refactor: migrate skills hook declarations`).
- Re-ran `make verify` and `go test -coverprofile=/tmp/internal-skills.cover ./internal/skills -count=1` successfully on committed `HEAD`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/hooks/task_07.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/adrs/adr-002.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_07.md`
- `internal/skills/types.go`
- `internal/skills/loader.go`
- `internal/skills/registry.go`
- `internal/skills/hooks.go`
- `internal/skills/hook_process_unix.go`
- `internal/skills/hook_process_windows.go`
- `internal/skills/hooks_test.go`
- `internal/hooks/types.go`
- `internal/hooks/agent_event.go`
- `internal/daemon/notifier.go`
- `internal/daemon/boot.go`
- `.compozy/tasks/hooks/task_07.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_07.md`
- `git status --short`
- `rg -n "HookRunner|HookDecl|HookEvent|HookPayload|HookResult|cloneHookDecls|parseHookDecls|validHookEvent|type Skill struct|newSkillWithHook|on_session_created|on_session_stopped" internal/skills internal/daemon`
