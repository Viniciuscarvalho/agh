Goal (incl. success criteria):

- Complete unified-capabilities task 03 so `internal/network` preserves former recipe transfer behavior under `kind:"capability"` without keeping recipe as a runtime concept.
- Success means: router/delivery/lifecycle/audit behavior is capability-first, required unit/integration coverage exists for broadcast, directed, mixed-flow, and terminal capability interaction behavior, `internal/network` coverage stays >=80%, `make verify` passes, workflow/task tracking is updated, and one local commit is created.

Constraints/Assumptions:

- Follow required skills: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `cy-final-verify`.
- Do not touch unrelated worktree changes in `.compozy/tasks/unified-capabilities/_tasks.md`, `task_02.md`, or other files outside task 03 scope.
- No destructive git commands.
- Treat `.compozy/tasks/unified-capabilities/_techspec.md` and ADR-001 / ADR-003 as source of truth.

Key decisions:

- Use the current branch state as baseline instead of assuming task 03 is wholly unimplemented; verify gaps against code and tests first.
- Keep scope tight to missing explicit regression evidence and task tracking if the runtime behavior is already capability-first.

State:

- Blocked on unrelated repo-wide verify failure outside task 03 scope.

Done:

- Read repo instructions (`AGENTS.md`, `CLAUDE.md`) and required skill docs.
- Read unified-capabilities task 03, `_techspec.md`, `_tasks.md`, ADR-001, ADR-003, and workflow memory files.
- Confirmed shared workflow memory: task 02 already removed `recipe` as a supported network artifact kind and legacy recipe envelopes are hard-rejected.
- Scanned relevant `internal/network` code and tests.
- Captured baseline evidence:
  - `go test ./internal/network/...` passes.
  - `go test -tags integration ./internal/network/...` passes.
  - `go test -cover ./internal/network` reports 81.7%.
  - `go test -cover -tags integration ./internal/network` reports 82.1%.
- Confirmed runtime code already has no remaining `recipe` references outside legacy-rejection tests; likely remaining gap is explicit end-to-end coverage and task tracking staleness.
- Implemented sender-side lifecycle bookkeeping in `internal/network/router.go` so outbound interaction envelopes preflight local state and sync local interaction state after publish.
- Added task-03 regression coverage:
  - `internal/network/router_test.go`: outbound directed capability lifecycle tracking and post-terminal send rejection.
  - `internal/network/router_integration_test.go`: broadcast capability transfer plus multi-router directed capability lifecycle, mixed `direct` + `capability` flow, and terminal closure.
  - `internal/network/audit_test.go`: capability audit entries remain labeled as `kind="capability"` and do not leak into say-only timeline storage.
- Re-ran task-scoped verification:
  - `go test ./internal/network/...` PASS
  - `go test -tags integration ./internal/network/...` PASS
  - `go test -cover ./internal/network` PASS, 81.9%
  - `go test -cover -tags integration ./internal/network` PASS, 82.3%

Now:

- Wait for user direction on the unrelated `make verify` blocker or permission to fix it.

Next:

- If authorized, remove the unused `Section` import in `web/src/systems/tasks/components/tasks-multi-agent-panel.tsx`, rerun `make verify`, then update tracking and commit.
- Otherwise, hand off task 03 as code-complete but not repo-verified due to the unrelated web lint error.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the user wants me to fix the unrelated web lint error blocking `make verify`.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-capability-semantics.md`
- `.compozy/tasks/unified-capabilities/{task_03.md,_tasks.md,memory/MEMORY.md,memory/task_03.md}`
- `internal/network/{router_test.go,router_integration_test.go,audit_test.go,lifecycle_test.go}`
- `web/src/systems/tasks/components/tasks-multi-agent-panel.tsx`
- `go test ./internal/network/...`
- `go test -tags integration ./internal/network/...`
- `go test -cover ./internal/network`
- `go test -cover -tags integration ./internal/network`
- `make verify`
