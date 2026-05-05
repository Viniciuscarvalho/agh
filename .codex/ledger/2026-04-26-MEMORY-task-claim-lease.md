Goal (incl. success criteria):

- Implement Task 08: transactional `ClaimNextRun(criteria)`, claim token generation/hash verification, fenced heartbeat/release/complete/fail operations, expired lease recovery, hooks, tests, tracking updates, and one local commit after clean verification.

Constraints/Assumptions:

- Must not run destructive git commands without explicit permission.
- Must use cy-workflow-memory before edits and before finishing.
- Must use cy-execute-task workflow and cy-final-verify before completion/commit.
- Must read AGENTS.md, CLAUDE.md, PRD docs, `_techspec.md`, `_tasks.md`, ADR-003, ADR-004, ADR-009, ADR-010, and ADR-012 before changing claim behavior.
- `ClaimNextRun(criteria)` is the only authoritative next-work primitive.
- Every post-claim ownership mutation must be fenced by the current raw claim token.
- One active task-run lease per session in MVP unless TechSpec says otherwise.
- `make verify` is the blocking completion gate.

Key decisions:

- Keep `ClaimNextRun(criteria)` as the new autonomous next-work primitive and preserve existing `ClaimRun(runID)` for current explicit/operator call sites unless later requirements remove it.
- New claim/lease writes must persist only `claim_token_hash`; the existing `claim_token` column remains but new code should not store raw tokens there.
- Add token-fenced variants for heartbeat, release, complete, and fail; existing unfenced operator methods remain until their surfaces are migrated.
- Use deterministic clocks/durations for lease tests; no sleep-based lease assertions.

State:

- Task 08 implementation, tracking/memory updates, local code commit, and post-commit verification are complete.

Done:

- Scanned `.codex/ledger/` and found existing Task 07 claim-lease ledger.
- Read required skill docs for cy-workflow-memory, cy-execute-task, cy-final-verify, golang-pro, testing-anti-patterns, and no-workarounds.
- Updated this ledger from Task 07 completion state to Task 08 working state.
- Read workflow memory files, root AGENTS/CLAUDE guidance, Task 08, `_tasks.md`, `_techspec.md`, ADR-003/004/009/010/012, and Task 07 memory.
- Captured pre-change signal: no `ClaimNextRun`, `ClaimCriteria`, heartbeat, release, or task lease mutation API exists under `internal/task`/`internal/store/globaldb`.
- Updated Task 08 workflow memory with objective, decisions, and touched surfaces.
- Added claim/lease contracts, token helpers, manager/store methods, hook bridge methods, boot expired-lease recovery call, and focused unit/store tests.
- Fixed zero-capability claim SQL ordering (`ORDER BY 0` is invalid in SQLite) and token-fencing error ordering for recovered leases.
- Verification so far: `go test ./internal/task ./internal/store/globaldb ./internal/hooks ./internal/daemon ./internal/api/core`; `go test -cover ./internal/task ./internal/store/globaldb`; `go test -race ./internal/store/globaldb -run TestGlobalDBClaimNextRunConcurrentSingleWinner`.
- Full `make verify` attempt reached race-enabled Go tests and failed in `internal/extension TestManagerDisablesExtensionAfterConsecutiveFailures`; root cause was registry-visible disable preceding in-memory hook unregister.
- Fixed `internal/extension.Manager.disableExtension` to unregister runtime resources before persisting disable state, then verified with `go test ./internal/extension -run TestManagerDisablesExtensionAfterConsecutiveFailures -count=10` and `go test ./internal/task ./internal/store/globaldb ./internal/extension`.
- Full `make verify` rerun passed: frontend format/lint/typecheck/tests/build, golangci-lint with 0 issues, race-enabled Go tests, build, and package-boundary checks.
- Updated Task 08 checkboxes/status, master task row, task workflow memory, and shared workflow memory after verification.
- Created local commit `915ca3ad` (`feat: add task run claim leasing`) with only code/test/generated files staged.
- Post-commit `make verify` passed against `915ca3ad`: frontend checks/build, golangci-lint 0 issues, race-enabled Go tests, build, and package-boundary checks.

Now:

- Final response.

Next:

- Report completion with verification evidence and commit hash.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-26-MEMORY-task-claim-lease.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/autonomous/memory/MEMORY.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/autonomous/memory/task_08.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/autonomous/task_08.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/autonomous/_techspec.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/autonomous/_tasks.md`
- `internal/task/lease.go`
- `internal/task/lease_manager.go`
- `internal/task/lease_hooks.go`
- `internal/store/globaldb/global_db_task_claim.go`
