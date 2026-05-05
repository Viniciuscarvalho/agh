Goal (incl. success criteria):

- Implement Task 07 metadata-only session health for normal AGH sessions with closed states/reasons, restart recovery, read models, tests, tracking updates, verification, and one local commit.

Constraints/Assumptions:

- Follow PRD task files under `.compozy/tasks/agent-soul`; use workflow memory before code edits.
- No destructive git commands.
- Backend task: read `internal/CLAUDE.md`; activate required Go/testing/final verification skills.
- `make verify` is required before completion and before/after commit.

Key decisions:

- Health remains metadata-only and session-owned: no prompt injection, no task lease renewal, no task runs, no ACP heavy events, no network greet updates.
- Use existing v13 `session_health` global DB store from Task 06; add session runtime primitive around it instead of adding schema.
- Wake ineligibility needs closed deterministic reasons in code, including prompt-active, not-attachable, stale, dead, unknown, and hung/degraded cases.

State:

- Task implementation, self-review fixes, tracking updates, local commit, and post-commit verification are complete.

Done:

- Created session ledger after finding no existing `.codex/ledger/*-MEMORY-*.md` files.
- Read required workflow memory, execution/final-verification skills, Go/test skills, root/internal guidance, PRD task/docs, ADR-007/009/010, and current session/store code.
- Baseline: `rg` found no SessionHealth primitive in `internal/session`; targeted `go test ./internal/session -run TestManagerSessionHealth -count=1` had no tests to run.
- Added closed session-health ineligibility reasons and validation in `internal/heartbeat`.
- Added `internal/session/health.go` with `HealthStore`, metadata-only presence/activity persistence, read models, stale marking, restart recovery, and deterministic wake eligibility reasons.
- Wired session health persistence into create/stop/prompt activity flows and daemon boot recovery.
- Added focused tests for idle -> prompting -> idle transitions, idle presence side-effect isolation, deterministic ineligibility reasons, restart stale/dead recovery, no task-lease coupling, and closed reason validation.
- Validation passed: focused Go tests, focused `-race`, focused `golangci-lint`, AGH test conventions, coverage `internal/session` 80.0219% and `internal/heartbeat` 80.1567%, and `make verify` with `DONE 7596 tests` plus package boundaries OK.
- Updated task_07 tracking, `_tasks.md`, task workflow memory, and shared workflow memory.
- Self-review follow-up fixed `internal/hooks.asyncPool.Close` so async hook drain timeout is actually bounded when a hook ignores context cancellation; added focused regression coverage. Revalidated `internal/session` coverage at 80.0349% and `internal/heartbeat` coverage at 80.1567%.
- Self-review follow-up restricted stale marking to idle non-prompt rows so a long active prompt is not made stale from an old idle `last_presence_at`; added manager/store regression coverage.
- Fresh pre-commit validation passed after all self-review fixes: focused tests, affected package tests, affected `-race`, focused `golangci-lint`, AGH test-shape helpers, coverage `internal/session` 80.0568% and `internal/heartbeat` 80.1567%, and `make verify` with `DONE 7600 tests` plus package boundaries OK.
- Created local commit `ea7d7bf8 feat: add metadata-only session health` with code/test files only.
- Post-commit `make verify` passed with `DONE 7600 tests in 12.530s` and package boundaries OK.

Now:

- Ready to report completion.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-02-MEMORY-session-health.md`
- `.compozy/tasks/agent-soul/memory/MEMORY.md`
- `.compozy/tasks/agent-soul/memory/task_07.md`
- `internal/heartbeat/persistence.go`
- `internal/heartbeat/persistence_test.go`
- `internal/session/health.go`
- `internal/session/health_test.go`
- `internal/session/manager.go`
- `internal/session/manager_helpers.go`
- `internal/session/manager_lifecycle.go`
- `internal/session/manager_prompt.go`
- `internal/session/prompt_activity.go`
- `internal/store/globaldb/global_db_heartbeat.go`
- `internal/store/globaldb/session_health_stale_test.go`
- `internal/daemon/daemon.go`
- `internal/daemon/boot.go`
- `internal/daemon/soul_runtime.go`
- `internal/hooks/pool.go`
- `internal/hooks/pool_close_test.go`
