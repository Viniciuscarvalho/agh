Goal (incl. success criteria):

- Complete hooks task_09 by deleting daemon notifier fanout/dispatcher wiring, composing `internal/hooks.Hooks` as the daemon/session notifier, connecting skill reloads and native callbacks, updating shutdown ordering, replacing notifier-era tests, and passing the task-required verification including `make verify`.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `.compozy/tasks/hooks/task_09.md`, `_techspec.md`, `_tasks.md`, ADR-013, and workflow memory files as source of truth.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify`.
- Scope stays tight to task_09; future richer runtime event wiring remains task_10.
- Existing unrelated worktree changes must not be reverted or overwritten.

Key decisions:

- Treat task_09 as a hard cut-over: remove daemon fanout/skill dispatcher code rather than layering compatibility around it.
- Preserve observer and dream behavior by expressing them as `Hooks`-owned native callbacks or tightly-scoped daemon-native declarations, not by keeping separate post-session callback lists.
- Skills watcher refresh should trigger both the skills registry refresh and a hooks rebuild from the daemon composition root.

State:

- Complete.

Done:

- Read root instructions, required skill docs, workflow memory, task spec, `_techspec.md`, `_tasks.md`, ADR-013, related hook ledgers, and current daemon/hooks/session/observe code.
- Captured baseline signal: `internal/daemon/boot.go` still constructs `notifierFanout`; `internal/daemon/notifier.go` still owns `skillsHookDispatcher`; shutdown currently stops watcher before sessions and has no `Hooks.Close()` step.
- Deleted `internal/daemon/notifier.go` and `internal/daemon/notifier_integration_test.go`, added `internal/daemon/hooks_bridge.go`, rewired `boot.go` to build one `Hooks` runtime plus native/config/agent/skill declaration providers, and connected watcher-triggered `Hooks.Rebuild()`.
- Updated daemon shutdown to stop sessions before closing hooks and to close hooks before servers/database teardown.
- Added daemon-native observer/dream callbacks, watcher callback support, session payload timestamp fields, and daemon wiring/hot-reload/shutdown tests.
- Verified with `go test ./internal/daemon ./internal/hooks ./internal/skills -count=1`, `go test -cover ./internal/daemon -count=1` (`80.4%`), `go test -tags integration ./internal/daemon -count=1`, and `make verify`.
- Created local code-only commit `4b3d39e` (`refactor: wire daemon hooks runtime`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-09-MEMORY-wire-hooks-daemon.md`
- `.compozy/tasks/hooks/task_09.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/adrs/adr-013.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_09.md`
- `internal/daemon/boot.go`
- `internal/daemon/daemon.go`
- `internal/daemon/hooks_bridge.go`
- `internal/daemon/*_test.go`
- `internal/hooks/*`
