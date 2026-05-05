## Goal (incl. success criteria):

- Complete `task_06.md` by adding durable ACP/session liveness evidence, stronger subprocess supervision, and honest boot/reconcile classification in the current AGH runtime surfaces.
- Success requires ACP fault coverage, recovery classification for crashed/orphaned/stalled work, explicit Windows fallback semantics, updated task/workflow memory, and a clean `make verify`.

## Constraints/Assumptions:

- Do not use destructive git commands; unrelated dirty files must remain untouched.
- Task docs reference stale `internal/core/...` paths; implementation must map those requirements onto the actual AGH packages.
- Workflow memory under `../_worktrees/daemon-improvs/.compozy/tasks/daemon-improvs/memory/` must be read before edits and updated as decisions/learnings change.
- Auto-commit is allowed only after clean verification, self-review, and task tracking updates.

## Key decisions:

- Treat `internal/session.Manager` as the ACP liveness ownership seam analogous to the TechSpec's AgentLivenessMonitor.
- Persist session-level supervision evidence through `store.SessionMeta` and the global `sessions` index, and use `task.Run.Metadata` for task-run recovery evidence instead of inventing a parallel run-state store.
- Keep scope within existing daemon/session/task ownership boundaries; no executor ownership redesign.

## State:

- Completed after clean verification.

## Done:

- Read `AGENTS.md`, `CLAUDE.md`, task docs, TechSpec, ADRs, and workflow memory.
- Mapped stale task-doc paths onto the real repo surfaces: `internal/session`, `internal/subprocess`, `internal/observe`, `internal/task`, `internal/store`, and `internal/testutil/acpmock`.
- Persisted session liveness metadata (`subprocess_pid`, `subprocess_started_at`, `last_update_at`, `stall_state`, `stall_reason`) through `store.SessionMeta` and the global `sessions` index.
- Wired session/observer/task recovery paths to refresh liveness during ACP activity, clear ownership on exit, and classify interrupted work via `session.ClassifyInactiveMetaForRecovery`.
- Added explicit Windows forced-exit fallbacks and kept Unix process-group supervision semantics compile-safe across `internal/subprocess`, `internal/hooks`, and `internal/acp`.
- Expanded ACP/runtime coverage for crash, malformed frame, disconnect, blocked cancel, and recovery classification paths, including the harness readiness race fix in `createFixtureBackedSession`.
- Cleared repo-gate issues uncovered by `make verify`: Go lint cleanups, `web/.storybook/preview.ts` API drift, and existing frontend complexity/typecheck blockers required for a green gate.
- Verified with targeted ACP integration tests, focused Go tests, Windows cross-builds, and a clean `make verify`.

## Now:

- Close-out only.

## Next:

- No pending implementation work for this task.

## Open questions (UNCONFIRMED if needed):

- None.

## Working set (files/ids/commands):

- Files: `internal/session/*`, `internal/acp/{client.go,handlers.go,types.go,process_tree_windows.go}`, `internal/subprocess/*`, `internal/hooks/executor_subprocess_windows.go`, `internal/observe/{observer.go,reconcile.go}`, `internal/store/{types.go,session_liveness.go}`, `internal/store/globaldb/*`, `internal/task/{manager.go,types.go}`, `internal/daemon/{task_runtime.go,daemon_acpmock_faults_integration_test.go,daemon_acpmock_helpers_integration_test.go}`, `internal/transcript/ui_messages.go`, `web/.storybook/preview.ts`.
- Workflow memory: `../_worktrees/daemon-improvs/.compozy/tasks/daemon-improvs/memory/{MEMORY.md,task_06.md}`.
- Verification commands: `go test ./internal/store/globaldb ./internal/transcript ./internal/observe ./internal/session`, `go test -tags integration ./internal/daemon -run 'TestDaemonE2EACPmock(CrashMidStreamProjectsRuntimeFailure|InvalidFrameProjectsRuntimeFailure|PermissionDisconnectProjectsRuntimeFailure|BlockedCancelStopsPromptWithoutOrphaning)' -count=1`, `GOOS=windows GOARCH=amd64 go build ./internal/subprocess ./internal/hooks ./internal/acp`, `make verify`.
