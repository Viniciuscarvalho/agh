Goal (incl. success criteria):

- Fix PR 48 CI failure from GitHub Actions job 72187097750 and confirm the relevant workflow passes locally with `act`.
- Success means the lint failure is resolved, `make verify` passes locally, and the CI workflow is exercised with `act` without errors.

Constraints/Assumptions:

- Do not touch unrelated files or use destructive git commands.
- Root cause must be fixed; no lint suppression or workaround.
- Full verification evidence is required before claiming completion.

Key decisions:

- Use `gh run view --log-failed` as the primary source for the failing CI job log.
- Treat the `goconst` failure in `internal/observe/tasks.go` as the immediate root cause to reproduce and fix locally.
- Treat the Linux `act` regressions as real follow-on failures to fix before closing the task, not as `act` noise.
- Scope reconcile timeouts to projector `Build/Apply` work so projector contexts reliably observe the configured deadline.
- Make stop-time process cleanup wait for descendant process-group exit before reporting completion.

State:

- Completed.

Done:

- Loaded required debugging/anti-workaround/verification skills.
- Confirmed clean worktree before edits.
- Retrieved failed Actions log for job 72187097750.
- Identified failure: `golangci-lint` `goconst` on `internal/observe/tasks.go:831` for duplicated `"warn"` literal.
- Inspected surrounding code and confirmed additional duplicated `"ok"`/`"warn"` status literals in the same file.
- Fixed `internal/observe/tasks.go` by reusing shared task health status constants.
- Confirmed local macOS `make verify` passed after the lint fix.
- Reproduced additional Linux/race failures with `act` in `internal/session`, `internal/resources`, `internal/acp`, and `internal/hooks`.
- Fixed `internal/session` finalization waiting so `StopWithCause` waits on in-flight watcher-owned finalization even after the session is removed from the active map.
- Fixed `internal/resources` reconcile timeout propagation so projector `Build/Apply` contexts receive the configured deadline instead of spending it inside raw-store reads.
- Centralized Unix process-group signaling/waiting through `internal/procutil/process_group_unix.go` and wired descendant cleanup waits into managed subprocess, ACP terminal, and hook timeout paths.
- Verified locally:
  - `go test ./internal/session ./internal/resources ./internal/acp ./internal/hooks`
  - Linux container race repros:
    - `go test -race ./internal/session -run 'TestStopWithCauseLifecycle/ShouldWaitForPostStopDispatchWhenWatcherFinalizesFirst' -count=30`
    - `go test -race ./internal/resources -run TestReconcileDriverPropagatesTimeoutToProjectorContexts -count=20`
    - `go test -race ./internal/acp -run 'TestStopTerminatesWrappedProcessTree|TestTerminalKillTerminatesWrappedProcessTree' -count=20`
    - `go test -race ./internal/hooks -run TestSubprocessExecutorExecuteKillsDescendantProcessesOnTimeout -count=20`
  - `make verify`
  - `act workflow_dispatch -W .github/workflows/ci.yml -j verify --container-architecture linux/amd64 -P ubuntu-latest=catthehacker/ubuntu:runner-latest --env PATH=/opt/acttoolcache/node/24.14.1/x64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin`
- Confirmed the full `verify` workflow succeeds under `act`, including the previously flaky Linux packages:
  - `internal/acp`
  - `internal/automation`
  - `internal/hooks`
  - `internal/session`
  - `internal/subprocess`

Now:

- Task implementation and verification are complete.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- File: `internal/observe/tasks.go`
- Files:
  - `internal/session/manager.go`
  - `internal/resources/reconcile.go`
  - `internal/procutil/process_group_unix.go`
  - `internal/subprocess/process.go`
  - `internal/subprocess/signals_unix.go`
  - `internal/acp/client.go`
  - `internal/acp/handlers.go`
  - `internal/acp/process_tree_unix.go`
  - `internal/hooks/executor_subprocess.go`
  - `internal/hooks/executor_subprocess_unix.go`
- Workflow: `.github/workflows/ci.yml`
- CI run: `24683608218`
- Job: `72187097750`
- Commands:
  - `gh run view 24683608218 --job 72187097750 --log-failed`
  - `make verify`
  - `act workflow_dispatch -W .github/workflows/ci.yml -j verify --container-architecture linux/amd64 -P ubuntu-latest=catthehacker/ubuntu:runner-latest --env PATH=/opt/acttoolcache/node/24.14.1/x64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin`
  - Log: `/tmp/agh-act-verify.log`
