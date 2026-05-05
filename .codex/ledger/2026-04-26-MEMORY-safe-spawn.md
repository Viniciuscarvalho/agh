Goal (incl. success criteria):

- Execute `.compozy/tasks/autonomous/task_13.md`: add safe agent spawn API/CLI and daemon reaper with permission narrowing, TTL/depth/child caps, parent-stop/orphan cleanup, active lease release, hooks, tests, verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow root AGENTS/CLAUDE guidance: no destructive git commands without explicit permission; `make verify` is the completion gate; keep scope tight; do not commit `ai-docs/`.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`; also using Go/concurrency/testing/no-workaround guidance.
- Workflow memory paths under `.compozy/tasks/autonomous/memory` are authoritative and must be updated before finishing.
- Automatic commit is enabled only after clean verification, self-review, memory/tracking updates, and staging only relevant implementation/tracking files.
- Existing `.compozy/tasks/autonomous/*` edits and memory directory were present before this task; treat unrelated changes as user/other-agent work and do not revert.

Key decisions:

- Use Task 12 typed lineage fields (`session.CreateOpts.Lineage`, `store.SessionLineage`, globaldb lineage filters) as the durable spawn source of truth.
- Safety checks must be code-enforced after hook patches: mandatory TTL, max depth, max children per parent, workspace bounds, coordinator-from-coordinator denial, and child permission subset validation.
- Reaper must release active task-run leases through task service APIs before stopping children.

State:

- completed; local code/test commit created

Done:

- Read available skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `deadlock-finder-and-fixer`, `testing-anti-patterns`, and `no-workarounds`.
- Read workflow memory files, root AGENTS/CLAUDE guidance, Task 13, `_tasks.md`, `_techspec.md`, all autonomy ADRs, and requested `.resources` references.
- Read relevant prior ledgers for Task 03 hooks, Task 08 claim leases, and Task 12 session lineage.
- Captured pre-change signal: contract/spec contain `/api/agent/spawn` DTO/path scaffolding, but implementation is missing (`SpawnOpts`, UDS route, CLI command, daemon/session spawn path, reaper).
- Added focused coverage for permission subset validation, spawn lineage/caps/hooks, structural session lease release, reaper reason classification/lease release order, strict spawn handler decode, and `agh spawn` request mapping.
- Implemented safe spawn in session manager, UDS/API/CLI surfaces, daemon-owned reaper, structural active lease release, and spawn hook dispatch.
- Fixed lint fallout and hardened existing async hook test cleanup after a focused package run exposed a cleanup hang on assertion failure.
- Verification passed:
  - `go test ./internal/session -run TestMessageDeltaAsyncHooksDoNotBlockPromptStreaming -count=20`
  - `go test ./internal/session ./internal/task ./internal/daemon ./internal/api/core ./internal/api/udsapi ./internal/cli -count=1`
  - `make verify` (Go lint `0 issues.`, `DONE 6257 tests in 62.040s`, package boundaries OK)
  - `go test -cover ./internal/session ./internal/task ./internal/daemon ./internal/api/core ./internal/api/udsapi ./internal/cli -count=1`
- Updated Task 13 tracking, master tasks row, task-local workflow memory, and shared workflow memory.
- Created local commit `b28cc047` (`feat: add safe spawn API and reaper`) with code/test files only; tracking/memory files remain unstaged.

Now:

- Final handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/autonomous/task_13.md`
- `.compozy/tasks/autonomous/_techspec.md`
- `.compozy/tasks/autonomous/_tasks.md`
- `.compozy/tasks/autonomous/adrs/*.md`
- `.compozy/tasks/autonomous/memory/MEMORY.md`
- `.compozy/tasks/autonomous/memory/task_13.md`
- `internal/session`
- `internal/task`
- `internal/daemon`
- `internal/api/core`
- `internal/api/udsapi`
- `internal/cli`
- Commit: `b28cc047 feat: add safe spawn API and reaper`
