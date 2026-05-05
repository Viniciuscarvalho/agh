Goal (incl. success criteria):

- Implement task_05 "Add Heartbeat Config and Policy Resolver Foundation" for `.compozy/tasks/agent-soul`.
- Success: `[agents.heartbeat]` config defaults/validation/overlay examples, optional `HEARTBEAT.md` parser/resolver, deterministic digests/provenance, redacted diagnostics, tests, task tracking, one local commit after clean verification.

Constraints/Assumptions:

- Follow repo AGENTS rules: no destructive git commands; `make verify` required before completion/commit; BR-PT conversation, English artifacts.
- Required skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`; backend Go/test skills before edits.
- Must read workflow memory, task specs, `_techspec.md`, `_techspec_soul.md`, `_techspec_heartbeat.md`, ADR-007..ADR-011, root/internal instructions before code edits.
- Scope excludes wake scheduling, session health/liveness, leases, queues, run tables, network greet behavior.

Key decisions:

- Keep task_05 scoped to config + resolver foundation only; no migration v13, session health service, wake service, scheduler/API/CLI/network changes.
- Mirror `internal/soul` resolver patterns where useful, but create a separate `internal/heartbeat` package.
- Use `_techspec_heartbeat.md`/ADR-011 defaults for `[agents.heartbeat]`.

State:

- Complete; final report pending.

Done:

- Created this session ledger.
- Read workflow memory, root/internal guidance, required skills and references, aggregate/Soul/Heartbeat TechSpecs, ADR-007..ADR-011, heartbeat analyses and reference examples.
- Captured baseline: no `internal/heartbeat` package exists; focused existing tests passed for `internal/config` and `internal/soul`.
- Added `[agents.heartbeat]` config defaults, validation, overlay merge support, tool-surface mutation paths, and config tests.
- Added isolated `internal/heartbeat` parser/resolver/digest/diagnostics package with optional missing-file behavior, strict frontmatter, active-hours preferences, config provenance, compact prompt/status data, source-path guards, and forbidden-authority rejection.
- Added `internal/heartbeat` tests for deterministic digests, active/quiet hours, config-bound cadence hints, invalid authority claims, missing files, oversized/malformed content redaction, path guards, config digest changes, and prompt projection truncation.
- Focused checks previously passed before compaction: `go test ./internal/config ./internal/heartbeat -count=1`, `go test -race ./internal/config ./internal/heartbeat -count=1`, `go test ./internal/heartbeat -cover -count=1` with 84.8% coverage, Heartbeat test convention helper, and `golangci-lint run ./internal/config ./internal/heartbeat`.
- Reran focused checks after compaction; all passed.
- Full pre-commit `make verify` passed: `DONE 7550 tests in 109.370s`; boundaries OK.
- Updated task_05 status/checklists, `_tasks.md` task 05 row, task memory, shared workflow memory, and this ledger.
- Fresh pre-commit `make verify` after tracking/memory updates passed: `DONE 7550 tests in 11.086s`; boundaries OK.
- Created local commit `40df005c feat: add heartbeat policy resolver foundation`.
- Post-commit `make verify` passed: `DONE 7550 tests in 14.052s`; boundaries OK.
- Final focused coverage recheck passed: `go test ./internal/heartbeat -cover -count=1` reported 84.8%.
- Final full-gate recheck passed: `make verify` reported `DONE 7550 tests in 12.888s`; boundaries OK.

Now:

- Confirm final worktree state and report.

Next:

- Final response.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-heartbeat-policy.md`
- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_05.md`
- Files: `internal/config/config.go`, `internal/config/merge.go`, `internal/config/tool_surface.go`, `internal/config/config_test.go`, `internal/config/tool_surface_test.go`, `internal/heartbeat/heartbeat.go`, `internal/heartbeat/heartbeat_test.go`
- Commit: `40df005c feat: add heartbeat policy resolver foundation`
