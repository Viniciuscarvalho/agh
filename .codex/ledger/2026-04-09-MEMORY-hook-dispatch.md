Goal (incl. success criteria):

- Implement task_11: wire `turn.start`, `turn.end`, `message.start`, `message.delta`, `message.end`, `context.pre_compact`, and `context.post_compact` into real runtime flows with tests and clean verification.

Constraints/Assumptions:

- Follow `/Users/pedronauck/dev/projects/agh/AGENTS.md` and `CLAUDE.md`.
- Use workflow memory files under `.compozy/tasks/hooks/memory/` before edits and before completion.
- Keep scope tight to task_11 and do not touch unrelated dirty files.
- `message.delta` must remain async-only and must not block token streaming.
- Full completion gate is `make verify`.

Key decisions:

- PRD and techspec are treated as the approved design baseline; no extra design approval loop is needed for this implementation task.

State:

- Complete; code is committed and post-commit verification passed.

Done:

- Read workspace instructions, required skills, workflow memory, task_11, `_tasks.md`, `_techspec.md`, and ADR-012.
- Confirmed the worktree contains unrelated modified tracking/docs files that must be left alone.
- Wired `turn.*`, `message.*`, and `context.*` dispatch through the session ACP flow and daemon bridge.
- Added/updated unit and integration tests across `internal/session` and `internal/daemon`.
- Verified with `go test ./internal/session ./internal/daemon`, `go test -tags integration ./internal/session`, `go test -cover ./internal/session` (`81.9%`), and `make verify`.
- Updated workflow memory and task tracking for task 11.
- Created local commit `04aab8f` (`feat: integrate turn message context dispatch`).
- Re-ran `go test -tags integration ./internal/session`, `go test -cover ./internal/session`, and `make verify` after the commit hook reformatted staged Go files.

Now:

- Waiting for final handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/hooks/task_11.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/adrs/adr-012.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_11.md`
- `internal/session/*`
- `internal/daemon/*`
- `go test ./internal/session ./internal/daemon`
- `go test -tags integration ./internal/session`
- `go test -cover ./internal/session`
- `make verify`
