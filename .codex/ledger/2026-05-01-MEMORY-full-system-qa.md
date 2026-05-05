Goal (incl. success criteria):

- Execute a new behavior-first, user-perspective QA pass across AGH CLI, daemon/API, Web UI, memory, tools, extensions, tasks/orchestration, and network collaboration using real provider-backed agents where reachable.
- Success requires fresh QA artifacts for this session, confirmed bug reports for any failures, root-cause fixes with regression coverage when feasible, and final verification evidence for the current repo state.

Constraints/Assumptions:

- Must use `systematic-debugging` and `no-workarounds` for failures.
- Must treat prior `.compozy/tasks/hermes/qa/` evidence as historical input only, not proof for this session's broader live-system objective.
- Must avoid destructive git commands without explicit user permission.
- Worktree contains unrelated `packages/site` edits; do not touch unless they become a direct blocker.
- Real provider-backed validation is required where credentials/prerequisites are reachable; blocked boundaries must be documented exactly, not replaced with mocks.

Key decisions:

- Start from the repo's existing Hermes and tools-refac QA corpus to avoid repeating already-covered hardening scenarios.
- Create a separate live-system QA artifact set for this session instead of mutating prior Hermes artifacts.
- Prioritize uncovered flows: real agent execution, tool registry usage, extension install/use, memory behavior in live flows, task/orchestration paths, and multi-agent/network collaboration from a user/operator perspective.

State:

- Session started 2026-05-01 with active thread goal covering full-system QA and bug-finding/fixing.
- No prior session ledger existed for this exact task slug.
- Existing relevant evidence: `.compozy/tasks/hermes/qa/verification-report.md` (2026-04-25 PASS), plus tools-refac ledgers for automation, hooks, extension lifecycle, autonomy, and release-grade QA.
- Fresh isolated QA lab created for this run:
  - `SCENARIO_SLUG=full-system-qa-20260501-044507-188023`
  - `WORKSPACE_PATH=/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab`
  - `QA_OUTPUT_PATH=/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts`
  - `BOOTSTRAP_MANIFEST=/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts/qa/bootstrap-manifest.json`
  - `BOOTSTRAP_ENV=/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts/qa/bootstrap.env`
  - `AGH_HOME=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-9ef76eb73c6c/runtime`
  - `AGH_HTTP_PORT=57669`
  - `AGH_UDS_PATH=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-9ef76eb73c6c/runtime/aghd.sock`
  - `AGH_WEB_API_PROXY_TARGET=http://127.0.0.1:57669`
  - `PROVIDER_HOME=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-9ef76eb73c6c/provider`
  - `PROVIDER_CODEX_HOME=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-9ef76eb73c6c/provider/.codex`
  - `BROWSER_MODE=browser-use`, `REUSED_LAB=false`

Done:

- Read root instructions supplied in the workspace prompt and current environment context.
- Read required skills: `systematic-debugging`, `no-workarounds`, `agh-qa-bootstrap`, `qa-report`, `qa-execution`, `real-scenario-qa`, and `compozy`.
- Read `internal/CLAUDE.md` and `web/CLAUDE.md`.
- Scanned existing `.codex/ledger/` files and read relevant QA/tool/automation/extension/autonomy ledgers for cross-agent awareness.
- Reviewed `.compozy/tasks/hermes/_tasks.md`, test plans, test cases, and `qa/verification-report.md` to map prior coverage and known fixed regressions.
- Confirmed the current objective exceeds Hermes scope because it demands fresh live-user, real-agent, orchestration, extension, and collaboration validation.
- Bootstrapped fresh isolated QA lab and verified manifest contract fields.
- Attempted Claude Code scenario-idea request via `compozy exec --ide claude --model opus --reasoning-effort xhigh` under isolated `PROVIDER_HOME`/`PROVIDER_CODEX_HOME`; it failed with `ACP error -32000: Authentication required`.
- Ran `compozy exec --ide codex --model gpt-5.4 --reasoning-effort high` under isolated provider env; it returned scenario ideas in `qa/logs/compozy-codex-scenario-ideas.log`.
- Created lab workspace skeleton directories for company, QA, knowledge, extensions, hooks, skills, artifacts, and reviews.
- Authored fresh QA artifacts:
  - `qa/behavioral-scenario-charter.md`
  - `qa/test-plans/full-system-qa-test-plan.md`
  - `qa/test-cases/TC-SCEN-001.md` through `TC-SCEN-006.md`
- Baseline gates passed:
  - `make deps` exit 0, log `qa/logs/baseline-make-deps.log`
  - `make verify` exit 0, log `qa/logs/baseline-make-verify.log`
  - `make verify` summary: Web build passed with existing chunk-size warning, golangci-lint `0 issues`, `DONE 7157 tests in 50.076s`, package boundaries OK.
- `make verify` built `bin/agh`; git status still shows unrelated pre-existing `packages/site` / `.compozy/tasks/site-copy` changes only.
- Found and fixed `BUG-001` in the QA bootstrap helper:
  - Repro: manifest emitted `AGH_HTTP_PORT=57669` / `AGH_UDS_PATH=.../aghd.sock`, but daemon started on default `http_port=2123` and `daemon.sock`.
  - Root cause: AGH does not consume `AGH_HTTP_PORT` / `AGH_UDS_PATH` env vars; it reads `http.port` and `daemon.socket` from `AGH_HOME/config.toml`.
  - Fix: `.agents/skills/agh-qa-bootstrap/scripts/bootstrap-qa-env.py` now writes a minimal runtime config matching the manifest.
  - Validation: `python3 -m py_compile ...`, fresh bootstrap validation lab started on manifest socket/port, current lab repaired and restarted on `socket=.../aghd.sock`, `http_port=57669`.
  - Bug report: `qa/issues/BUG-001-bootstrap-manifest-port-socket-not-applied.md`
- TC-SCEN-001 live Codex session created `company/planning/launch-readiness.md` and was stopped before rebuilding.
- TC-SCEN-002 tool registry checks passed: list/search/info/invoke returned real workspace/session data, and invalid input produced `tool_invalid_input` with `schema_invalid`.
- TC-SCEN-003 memory checks passed before restart and after daemon restart for `launch-facts.md`.
- TC-SCEN-004 extension lifecycle checks passed for real `sdk/examples/secret-guard`: install, API/list/status, hook catalog, disable, enable, restart persistence.
- Found and fixed `BUG-002`:
  - Repro: `secret-guard` returned `deny_reason`, hook telemetry recorded it, but `agh session prompt` surfaced only generic `hooks: event "input.pre_submit" denied`.
  - Fix: hook pipeline now copies structured `deny_reason` into `dispatchReport`; denial errors/logs include the reason when available.
  - Validation: `go test ./internal/hooks -count=1 -race`, `make build`, daemon restart, post-fix CLI output shows `Message contains a potential secret (sk-)`.
  - Bug report: `qa/issues/BUG-002-hook-denial-reason-hidden-from-cli.md`
- TC-SCEN-005/006 task + network run produced real cross-session network evidence:
  - Task `task-launch-evidence`, run `run-a51a0b67c0dc93ab`, claimer session `sess-5c467acf350f6aa1`.
  - AGH created system task session `sess-c3934f586226e652` (`task:Collect launch evidence#1`) and it sent correlated network `receipt`/`direct` replies to the claimer session.
  - Network status/inbox/API logs show two peers in `launch-room`, direct/broadcast/receipt messages delivered, and reply correlation metadata preserved.
- TC-SCEN-005 uncovered a possible task runtime lifecycle bug:
  - After the task system session started, the run remained bound to the original claimer session in persisted task state.
  - `task cancel` canceled the run and force-stopped the claimer session, but `sess-c3934f586226e652` stayed active.
- Found and fixed `BUG-003`:
  - Root cause: `StartRun` created the dedicated task session before persisting the new `session_id`/`running` state, and the final persistence still used the caller request context.
  - Second root cause found during live validation: `GlobalDB.UpdateTaskRun` rejected the managed `session_id` transfer from the claiming agent session to the dedicated task session with `task: session already bound`.
  - Fix: task-run start lifecycle now detaches from caller cancellation after the committed `starting` mutation, immediately persists the dedicated session binding, emits `task.run_session_bound`, and keeps final `running` persistence/events on the lifecycle context.
  - Fix: `GlobalDB.UpdateTaskRun` now allows exactly one managed start-session transfer when the current run is still `claimed`/`starting`, the current session is the claiming agent session, and the next session is the dedicated task session; later rebinding still returns `ErrSessionAlreadyBound`.
  - Regression tests passed: `go test ./internal/task -count=1 -race`; `go test ./internal/daemon -run 'TestTask|Task|AutomationTask|TaskRuntime|Scheduler|DaemonIntegration' -count=1`; `go test ./internal/store/globaldb -run 'TestGlobalDBUpdateTaskRunAllowsManagedStartSessionTransfer|TestGlobalDBUpdateTaskRunRejectsSessionRebinding|TestGlobalDBUpdateTaskRunAllowsQueuedSessionRelease' -count=1`.
  - Bug report: `qa/issues/BUG-003-task-start-run-session-binding-canceled-context.md`
- BUG-003 live validation passed after rebuilding/restarting the lab daemon:
  - task `task-bug003-binding-globaldb-024625`, run `run-100a7527f3c71b28`.
  - Claimer session `sess-3c0fce7f107fab17`, dedicated task session `sess-32d77e46b2a707ee`.
  - `BUG-003-validation2-task-get-running-corrected.json` shows `task.run_session_bound` and `task.run_started` with dedicated session binding.
  - `BUG-003-validation2-task-get-after-cancel.json` shows `task.run_force_stopped` targeted the dedicated task session; dedicated session stopped and claimer remained active until QA cleanup.
- Found and fixed `BUG-004`:
  - Repro: `agh task get "" -o json` and `agh session status "   " -o json` returned exit 0 with zero-value records.
  - Root cause: `cobra.ExactArgs(1)` accepted present-but-blank positional IDs; the client trimmed them into empty path segments that could hit collection routes and decode into wrong single-record wrappers.
  - Fix: added shared `exactNonBlankArgs(count)` and applied it to one-argument CLI commands where blank positional values are never valid, while preserving more-specific agent task run-id validation.
  - Regression tests passed: `go test ./internal/cli -run 'TestExactNonBlankArgsRejectsBlankSingleArgument|TestAgentTaskCommandsValidateBeforeAgentCalls|TestTask|TestSession' -count=1`; `go test ./internal/cli -count=1`.
  - Runtime validation passed after rebuild/restart: blank task/session commands now exit 1 with `cannot be blank`.
  - Bug report: `qa/issues/BUG-004-blank-positional-id-renders-zero-record.md`
- Browser Use fallback note:
  - Read Browser Use skill; required `node_repl/js` tool was not exposed by tool discovery, so Browser Use IAB workflow could not be initialized.
  - Used local Playwright fallback against daemon-served Web app at `http://127.0.0.1:57669`; this validates real daemon-served assets and real API, not Vite-only proxy.
- Web QA passed:
  - Artifacts: `qa/web-artifacts-pass/TC-WEB-summary.json` and screenshots `TC-WEB-001` through `TC-WEB-008`.
  - Covered home shell, task list, UI task draft creation (`task-1b2023ac85e68d33`), task detail, network workspace with 2 channels, knowledge search, hooks/extensions settings with `secret-guard`, and `agents/general`.
  - Summary recorded zero console errors and zero API 4xx/5xx responses.
- Final `make verify` attempt failed in `golangci-lint` because `exactNonBlankArgs(count int)` always received `1` (`unparam`).
- Fixed the helper shape to `exactOneNonBlankArg()` and mechanically updated one-argument CLI validators.
- Focused CLI validation passed after the lint fix: `go test ./internal/cli -count=1`.
- Final `make verify` passed after all fixes:
  - Bun lint: `Found 0 warnings and 0 errors.`
  - Bun typecheck: `Tasks: 5 successful, 5 total`
  - Bun tests: `258` files / `1849` tests passed
  - Go lint: `0 issues.`
  - Go tests: `DONE 7163 tests in 72.846s`
  - Boundaries: `OK: all package boundaries respected`
- Wrote final QA verification report: `/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts/qa/verification-report.md`.
- Captured final daemon status: `qa/logs/final-daemon-status.json` (`pid=85523`, `active_sessions=0`, HTTP `127.0.0.1:57669`).
- Performed explicit completion audit per thread-goal continuation instructions:
  - Restated objective as deliverables.
  - Mapped each prompt requirement to concrete evidence.
  - Re-inspected artifact existence, web summary, final daemon status, Compozy logs, launch artifact, bug reports, and owned git status.
  - Audit file: `/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts/qa/completion-audit.md`.
  - Audit conclusion: objective achieved; Claude Code scenario help remains an external auth boundary already documented, with Codex Compozy scenario ideation used successfully.

Now:

- Ready to mark thread goal complete.
- Current daemon on `http://127.0.0.1:57669` is running with rebuilt binary, `pid=85523`, `active_sessions=0`, `version=c696771a-dirty`.

Next:

- Mark goal complete and report final accounting.

Open questions (UNCONFIRMED if needed):

- Which live provider credentials besides Codex are currently reachable in the isolated QA lab; Claude via Compozy is blocked by auth.
- Whether Browser Use is operational in this runtime or whether Web validation will need the documented fallback.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-01-MEMORY-full-system-qa.md`
- `.compozy/tasks/hermes/qa/verification-report.md`
- `.compozy/tasks/hermes/qa/test-plans/`
- `.compozy/tasks/hermes/qa/test-cases/`
- Relevant ledgers: `2026-04-30-MEMORY-tools-refac-qa.md`, `2026-04-30-MEMORY-extension-lifecycle-tools.md`, `2026-04-30-MEMORY-session-autonomy-tools.md`, `2026-04-30-MEMORY-automation-tools.md`, `2026-04-30-MEMORY-hook-tools.md`, `2026-04-28-MEMORY-tool-registry-extension-exec.md`
- Planned commands: `compozy exec --ide claude`, CLI/API/Web scenario commands, `make deps`, `make verify`
- Claude scenario log: `/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts/qa/logs/compozy-claude-scenario-ideas.log`
- Codex scenario log: `/Users/pedronauck/dev/qa-labs/agh-full-system-qa-20260501-044507-188023-lab/qa-artifacts/qa/logs/compozy-codex-scenario-ideas.log`
- Current daemon evidence:
  - `qa/logs/current-daemon-status.json`
  - `qa/logs/current-api-daemon-status.json`
  - `qa/logs/current-api-observe-health.json`
  - `qa/logs/BUG-002-daemon-status-after-fix.json`
- TC-SCEN-001 live session:
  - `session_id=sess-ec0ea30a12fef2f1`
  - `agent=general`, `provider=codex`, `channel=launch-room`
  - `workspace_id=ws_c593feed9a5ba27c`
  - artifact `company/planning/launch-readiness.md`
  - logs `qa/logs/TC-SCEN-001-session-new-founder.json`, `qa/logs/TC-SCEN-001-founder-prompt.json`, `qa/logs/TC-SCEN-001-session-history.json`, `qa/logs/TC-SCEN-001-session-status-after-artifact.json`, `qa/logs/TC-SCEN-001-api-session.json`
- BUG-002 changed files: `internal/hooks/dispatch.go`, `internal/hooks/pipeline.go`, `internal/hooks/telemetry.go`, `internal/hooks/hooks_test.go`
- BUG-003 changed files: `internal/task/hooks.go`, `internal/task/manager.go`, `internal/task/manager_test.go`, `internal/task/manager_integration_test.go`
- BUG-003 GlobalDB changed files: `internal/store/globaldb/global_db_task.go`, `internal/store/globaldb/global_db_task_test.go`
- BUG-004 changed files: `internal/cli/args.go`, `internal/cli/args_test.go`, and one-argument command validators across `internal/cli/*.go`.
- Web QA artifacts: `qa/web-artifacts/TC-WEB-failure.json` documents a rejected over-strict test assumption; passing evidence lives in `qa/web-artifacts-pass/TC-WEB-summary.json`.
- TC-SCEN-005/006 task/network evidence:
  - task `task-launch-evidence`, run `run-a51a0b67c0dc93ab`
  - sessions `sess-5c467acf350f6aa1`, `sess-c3934f586226e652`
  - logs `qa/logs/TC-SCEN-005-*`, `qa/logs/TC-SCEN-006-*`
