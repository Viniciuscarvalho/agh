Goal (incl. success criteria):

- Complete hooks task_06 by implementing the `internal/hooks` `Hooks` struct, typed dispatchers for the full taxonomy, atomic registry rebuild/swap, `session.Notifier` integration, and tests with clean verification.

Constraints/Assumptions:

- Follow `/Users/pedronauck/dev/projects/agh/AGENTS.md` and `CLAUDE.md`; no destructive git commands and no workaround-style fixes.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify` before any completion claim or commit.
- `brainstorming` is satisfied by the already-approved hooks PRD, techspec, and ADRs; do not reopen design unless a contradiction appears.
- Existing worktree changes in hooks task tracking files predate this run and must not be reverted or overwritten beyond the required task_06 updates.

Key decisions:

- Build `Hooks` around four declaration-provider seams plus one executor resolver so task_06 stays decoupled from the future task_07/task_08 loaders while still satisfying the “read all 4 sources” requirement.
- Treat snapshot equality as semantic equality over normalized/sorted hook metadata rather than executor pointer identity so `Rebuild()` can skip unchanged swaps deterministically.
- Keep `OnSessionCreated`/`OnSessionStopped` as the concrete notifier bridge for task_06 and make `OnAgentEvent` a safe best-effort bridge over the currently available ACP event surface without inventing task_10 behavior.

State:

- Complete; implementation, verification, memory, tracking updates, and local commits are done. Final handoff remains.

Done:

- Read root instructions, workflow memory, task_06, `_techspec.md`, `_tasks.md`, ADR-004/005/009/013, related ledgers, and the current `internal/hooks`, `internal/session`, `internal/daemon`, and `internal/acp` code.
- Captured pre-change signal: `internal/hooks` has no `Hooks` type, no `NewHooks`, no `Rebuild`, no typed dispatch functions, and no `session.Notifier` implementation.
- Added `internal/hooks/hooks.go` with the `Hooks` core, functional options, source-specific declaration providers, executor resolver integration, semantic snapshot fingerprinting, `Rebuild`, `Version`, and `Close`.
- Added `internal/hooks/dispatch.go` with the generic typed-dispatch wrapper, all 27 exported dispatch functions, family-specific patch applicators, and async hook submission via the worker pool.
- Added `internal/hooks/notifier.go` with `session.Notifier` implementation and compile-time interface check.
- Added unit and integration coverage in `internal/hooks/hooks_test.go` and `internal/hooks/dispatch_integration_test.go`.
- Updated workflow memory and task tracking for task_06.
- Verification completed successfully with:
  - `go test ./internal/hooks -count=1`
  - `go test -race -cover ./internal/hooks -count=1` (`85.2%`)
  - `go test -tags integration ./internal/hooks -count=1`
  - `make verify`
- Re-ran the full task verification gate in the final handoff turn with the same passing results.
- Created local commit `b2b3a01 feat: implement hooks dispatcher core`.
- Corrected an unrelated staged-file bleed from pre-existing review-doc deletions with follow-up commit `2bd9796 docs: restore review docs`.

Now:

- Preparing the final handoff with fresh verification evidence.

Next:

- Delete this session ledger after the handoff if no further follow-up is needed.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: the exact `OnAgentEvent` mapping beyond the currently-observable session notifier surface is intentionally limited until task_10 lands; keep the implementation conservative and test what is actually guaranteed now.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-09-MEMORY-hooks-struct.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_06.md`
- `.compozy/tasks/hooks/task_06.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/adrs/adr-004.md`
- `.compozy/tasks/hooks/adrs/adr-005.md`
- `.compozy/tasks/hooks/adrs/adr-009.md`
- `.compozy/tasks/hooks/adrs/adr-013.md`
- `internal/hooks/*`
- `internal/session/interfaces.go`
- `internal/session/manager_helpers.go`
- `internal/session/manager_prompt.go`
- `internal/session/manager_lifecycle.go`
- `internal/daemon/notifier.go`
- `internal/acp/types.go`
