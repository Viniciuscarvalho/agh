Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_09.md`: Heartbeat wake service and scheduler/manual/harness integration.
- Success means eligible idle sessions can receive synthetic reentry prompts through existing prompt paths while wake policy remains advisory: no task runs, claim tokens, lease renewal, session creation, or AGH Network greet changes.

Constraints/Assumptions:

- Conversation in BR-PT; code/artifacts/docs in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read workflow memory, PRD specs, `_techspec.md`, `_techspec_heartbeat.md`, ADR-007..ADR-011, root/internal guidance, and current scheduler/session code before code edits.
- Must follow Go/concurrency skills before production Go edits and Go test skills before test edits.
- No destructive git commands.
- Automatic local commit is enabled only after clean verification, self-review, tracking updates, and a clean pre-commit gate.
- Keep tracking-only `.compozy/tasks/*`, workflow memory, and ledger files out of the code commit unless repo requirements force staging.

Key decisions:

- Wake service will consume existing Task 05-08 primitives: `heartbeat.Resolve`, `GetLatestValidHeartbeatSnapshot`, session `Get/ListSessionHealth`, wake state/events, and `session.PromptSynthetic`.
- Wake integration must treat existing mechanical task-run scheduler wake as separate from Heartbeat policy; Heartbeat wake metadata/result/audit uses `agent_heartbeat_wake` and no task claim ownership.
- `session.PromptSynthetic` needs a busy/no-queue option for Heartbeat so prompt-gate races become auditable `session_prompt_active_race` decisions instead of queued duplicate wakes.
- Synthetic Heartbeat prompts should carry Heartbeat wake correlation fields, not task ownership credentials.

State:

- Implementation, focused validation, task tracking, workflow memory updates, commit, and post-commit verification are complete. Current worktree still has unrelated pre-existing modified task tracking files, uncommitted Task 09 tracking/memory artifacts, and untracked `.compozy/extensions/`.

Done:

- Read shared workflow memory and current `task_09` workflow memory.
- Scanned/read relevant adjacent ledgers for task 05/06/07/08 handoff context.
- Loaded `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `agh-code-guidelines`, `golang-pro`, and `deadlock-finder-and-fixer`.
- Read `agh-code-guidelines` coding-style and concurrency references.
- Read root `AGENTS.md`/`CLAUDE.md` and `internal/AGENTS.md`/`internal/CLAUDE.md`.
- Captured initial `git status --short`.
- Read task_09, `_tasks.md`, aggregate `_techspec.md`, `_techspec_heartbeat.md` sections for core interfaces/safety/testing, and ADR-007 through ADR-011.
- Inspected current `internal/heartbeat`, `internal/session`, `internal/scheduler`, `internal/daemon`, `internal/store/globaldb`, `internal/task`, and `internal/network` wake/health/synthetic/lease/greet surfaces.
- Baseline signal: no `HeartbeatWakeService`, `WakeRequest`, `ConsultHeartbeatPolicy`, or `agent_heartbeat_wake` service implementation exists; focused placeholder tests in `internal/heartbeat`, `internal/scheduler`, `internal/session`, and `internal/daemon` had no tests to run.
- Implemented `internal/heartbeat/wake.go` with `ManagedWakeService`, `Wake`, `WakeMany`, closed reason decisions, wake state/event writes, cooldown/coalescing/max-wake/quiet-window/config/session-health/prompt-gate checks, and advisory prompt text.
- Added Heartbeat synthetic metadata fields and `session.PromptSynthetic` `TurnID`/`SkipIfBusy` support.
- Integrated scheduler and harness reentry adapters through `agent_heartbeat_wake` while preserving legacy pending-task synthetic prompts when no Heartbeat policy exists.
- Added scheduler batch wake dispatch so daemon Heartbeat `WakeMany` enforces `MaxWakesPerCycle` across one cycle.
- Added wake service, session prompt, scheduler batch, daemon scheduler/harness integration, and no-ownership regression tests.
- Updated `.compozy/tasks/agent-soul/task_09.md`, `_tasks.md`, task workflow memory, and shared workflow memory.
- Verification passed: focused Go tests, race-focused tests, heartbeat coverage 80.3%, targeted golangci-lint, and full `make verify`.
- Created commit `f83ef970` (`feat: add heartbeat wake service`) for code changes only.
- Post-commit `make verify` passed, including Go tests and package boundary checks.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-task09.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_09.md`
- Task files: `.compozy/tasks/agent-soul/task_09.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Code files: `internal/heartbeat/wake.go`, `internal/heartbeat/wake_test.go`, `internal/acp/types.go`, `internal/session/synthetic_prompt.go`, `internal/session/manager_test.go`, `internal/scheduler/scheduler.go`, `internal/scheduler/types.go`, `internal/scheduler/scheduler_test.go`, `internal/daemon/scheduler_runtime.go`, `internal/daemon/harness_reentry_bridge.go`, `internal/daemon/task_runtime.go`, `internal/daemon/daemon_test.go`, `internal/daemon/heartbeat_wake_runtime_test.go`
