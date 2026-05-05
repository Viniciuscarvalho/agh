Goal (incl. success criteria):

- Validate `.compozy/tasks/autonomous` with a production-like AGH startup scenario using real daemon, CLI, channels, tasks, automations, hooks, extensions, and browser flows.
- If a real issue is found, record a scenario issue, fix the production root cause, add regression coverage, rerun the live scenario, and finish with `make verify`.

Constraints/Assumptions:

- Follow repo AGENTS/CLAUDE rules: no destructive git commands; final blocking gate is `make verify`; do not touch unrelated dirty worktree files.
- Skills in use for this run: `real-scenario-qa`, `browser-use:browser`, `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`, `agh-test-conventions`, `agh-cleanup-failure-paths`.
- User explicitly requested real testing with no mock/stub/fake final proof and asked for issue write-up plus immediate remediation.
- Browser validation must use the Browser plugin runtime (`iab`) through `mcp__node_repl__js`.

Key decisions:

- Use a dedicated live workspace at `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab` with isolated `AGH_HOME`.
- Treat scenario-discovered failures as production bugs; fix root causes in repo code and add regression coverage before continuing the scenario.
- Keep issue artifacts in `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab/qa-artifacts/qa/issues/`.

State:

- In progress. A second real-scenario QA round is running against the same isolated startup workspace with focus on more complex autonomy edge cases beyond the first remediation pass. The primary new defect from this round has been reproduced, fixed in production code, and replayed live; repo-wide verification is the remaining gate.

Done:

- Read current-session ledger requirements and scanned available session ledger context.
- Read `real-scenario-qa` guidance and fully read the Browser skill for this turn before any browser action.
- Built and ran the live startup scenario in `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab`.
- Found and fixed automation teardown false-failure bug:
  - repo files changed: `internal/automation/dispatch.go`, `internal/automation/dispatch_test.go`, `internal/automation/dispatch_stop_timeout_test.go`
  - changed automation stop timeout from `2s` to `10s`
  - added focused regression coverage proving completed runs stay completed while session teardown finishes
  - verified with `go test ./internal/automation -count=1 -race`
- Rebuilt daemon binary with `go build -o ./bin/agh ./cmd/agh`.
- Restarted isolated daemon and re-ran automation job successfully:
  - daemon PID `82462`
  - HTTP `127.0.0.1:2234`
  - socket `/Users/pedronauck/dev/ai/agh-compozy-tasks-autonomous-lab/.agh-home-live/daemon.sock`
  - rerun `job-5d7527aee8287165` -> `run-1288ecb79e1b15f6` status `completed`
- Confirmed new live bug: cross-channel wake/claim leakage
  - marketing session `sess-1b0be805794ed823` got finance wake and claimed finance run `run-32d37b3450582169`
  - finance session `sess-b1357936f3dd6558` got development wake
  - likely root causes identified in scheduler eligibility filtering and agent task claim criteria propagation
- Recorded issue artifacts:
  - `qa-artifacts/qa/issues/BUG-009-automation-stop-timeout-falsely-fails-completed-runs.md`
  - `qa-artifacts/qa/issues/BUG-010-cross-channel-wake-and-claim-leakage.md`
- Fixed cross-channel wake/claim leakage in production code:
  - `internal/scheduler/types.go`
  - `internal/scheduler/scheduler.go`
  - `internal/daemon/scheduler_runtime.go`
  - `internal/api/core/agent_tasks.go`
- Added regression coverage:
  - `internal/scheduler/scheduler_channel_test.go`
  - `internal/api/udsapi/agent_tasks_test.go`
- Targeted regression packages passed:
  - `go test ./internal/scheduler ./internal/api/udsapi ./internal/daemon ./internal/automation -count=1 -race`
- Rebuilt daemon and replayed the real startup scenario:
  - restarted isolated daemon as PID `16055`
  - resumed `development`, `marketing`, and two `finance` sessions
  - queued `QA-CH-DEV-002` -> `run-ee6cda2259e59fb2`
  - queued `QA-CH-FIN-002` -> `run-ffc9a27bd57cce48`
  - frontend session `sess-191d1242b45c427f` was woken only for the development run and claimed it
  - finance session `sess-b1357936f3dd6558` was woken only for the finance run and claimed it
  - marketing session `sess-1b0be805794ed823` received no wrong-channel synthetic wake
- Proved live claim fencing directly:
  - created `QA-CH-FIN-003` -> `run-53f449c652f22d1d`
  - marketing session `sess-1b0be805794ed823` returned `{ "claimed": false }`
  - second finance session `sess-84f35e63751e5fb7` claimed the same run successfully
- Browser validation completed with Browser `iab`:
  - opened `http://127.0.0.1:2234/`
  - navigated to `/tasks`
  - verified `QA-CH-FIN-003` rendered as `running` with `channel: finance`
- Final repo gate passed:
  - `make verify`
- Disproved the earlier coordinator-disabled hypothesis:
  - global home config shows `autonomy.coordinator.enabled = false`
  - workspace override at `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab/.agh/config.toml` sets `enabled = true`
  - coordinator auto-spawns in this workspace are expected behavior, not a bug
- Ran higher-risk live edge cases:
  - same-channel claim race on finance work showed single-winner claim behavior only
  - dependency chain progressed correctly from `campaign-001` into `review-001`
  - daemon restart recovered an orphaned claimed review run back to `queued` as designed
- Reproduced a new real workspace hook bug on the live startup workspace:
  - `session.post_create` config hook writes successfully to `ops/hook-events.jsonl`
  - `task.run.enqueued` config hook `workspace-task-enqueued-audit` failed on every live enqueue with `hook.dispatch.async_failed` and `exit status 2`
  - fresh reproduction after compaction:
    - created `QA-HOOK-REPRO-001` / `task-277c9b705a9715ae`
    - started run `run-4b78aa29d82dcbaa`
    - `ops/hook-events.jsonl` stayed at 21 lines while the daemon log recorded another `workspace-task-enqueued-audit` async failure
- Root-caused the hook failure:
  - workspace-scoped hook declarations inherited `cwd` only indirectly through `matcher.workspace_root`
  - `task.run.*` matcher families do not allow or use `workspace_root`
  - relative subprocess args therefore had no workspace `cwd` on `task.run.enqueued`, while `session.post_create` kept working
- Fixed the workspace hook `cwd` inheritance in production:
  - `internal/daemon/hooks_bridge.go`
  - `scopeWorkspaceHookDecls()` now stamps `WorkingDir` with the resolved workspace root when unset
- Added regression coverage:
  - `internal/daemon/notifier_test.go`
    - workspace hooks inherit workspace `WorkingDir` even for events that do not support `matcher.workspace_root`
    - explicit working directories still win
  - `internal/daemon/daemon_integration_test.go`
    - workspace `task.run.enqueued` hook with relative script path runs successfully after boot
- Focused verification passed:
  - `go test ./internal/daemon -run 'TestScopeWorkspaceHookDeclsOnlyInjectsSupportedMatcherFields|TestScopeWorkspaceHookDeclsInjectsWorkspaceWorkingDirWhenUnset' -count=1 -race`
  - `go test -tags integration ./internal/daemon -run TestBootRunsWorkspaceTaskRunHookWithRelativeScriptPath -count=1`
- Rebuilt the daemon binary and replayed the live workspace reproduction:
  - restarted isolated daemon as PID `80481`
  - created `QA-HOOK-REPRO-002` / `task-c94240966ec4def4`
  - started run `run-bc1dc63f8dfb9e04`
  - `ops/hook-events.jsonl` grew from 21 to 23 lines, including:
    - new coordinator `session.post_create`
    - `task.run.enqueued` for `run-bc1dc63f8dfb9e04`
  - new daemon log lines at `2026-04-26T16:32:06-03:00` showed `hook.dispatch.started/completed` for `task.run.enqueued` with no `hook.dispatch.async_failed`
- Browser validation replayed after the live fix:
  - reloaded `http://127.0.0.1:2234/tasks`
  - DOM snapshot shows `QA-HOOK-REPRO-002` rendered in All Tasks as `Unassigned`, `attempt 1 of 3`, matching the queued run state

Now:

- Persisting the new hook bug artifact and running the full repo verification gate after the production fix.

Next:

- Write `BUG-011` under the scenario issue directory with the fresh live reproduction and fix evidence.
- Run `make verify`.
- If the repo gate stays green, close out this QA round with the new edge-case coverage summary.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-26-MEMORY-autonomous-real-qa.md`
- Skill: `.agents/skills/real-scenario-qa/SKILL.md`
- Browser skill: `/Users/pedronauck/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/skills/browser/SKILL.md`
- Scenario workspace: `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab`
- Scenario issues dir: `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab/qa-artifacts/qa/issues`
- Automation bug evidence:
  - job `job-5d7527aee8287165`
  - failing run `run-5a707391ba6e8e56`
  - fixed rerun `run-1288ecb79e1b15f6`
- Cross-channel bug evidence:
  - marketing session `sess-1b0be805794ed823`
  - finance session `sess-b1357936f3dd6558`
  - frontend session `sess-191d1242b45c427f`
  - review session `sess-e157101e2c5a8cee`
  - finance task `task-aa966d4dcbcbe544` / run `run-32d37b3450582169`
  - landing task `task-1acda0721d515822` / run `run-29a0e4a2fa10ce3c`
- Post-fix verification runs:
  - `task-13f0160e1531e8e6` / `run-ee6cda2259e59fb2`
  - `task-57497eafe13b30de` / `run-ffc9a27bd57cce48`
  - `task-fbcdb0b72bb3ee5f` / `run-53f449c652f22d1d`
- New round evidence under review:
  - global effective config `autonomy.coordinator.enabled = false`
  - workspace override `.agh/config.toml` enables the coordinator for `ws_49d528aa1b07f4ca`
  - hook bug artifacts:
    - failing task `task-277c9b705a9715ae` / run `run-4b78aa29d82dcbaa`
    - fixed replay task `task-c94240966ec4def4` / run `run-bc1dc63f8dfb9e04`
    - issue path `/Users/pedronauck/Dev/ai/agh-compozy-tasks-autonomous-lab/qa-artifacts/qa/issues/BUG-011-workspace-task-run-hook-relative-working-dir-loss.md`
