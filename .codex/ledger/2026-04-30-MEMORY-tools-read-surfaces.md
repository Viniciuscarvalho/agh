Goal (incl. success criteria):

- Implement tools-refac Task 03: add read-only coordination/session/workspace built-in tools, tests, tracking updates, and one local commit after clean verification.

Constraints/Assumptions:

- Must obey AGH destructive git restrictions; no restore/checkout/reset/clean/rm.
- Must use cy-workflow-memory, cy-execute-task, cy-final-verify, Go/test skills.
- Must read workflow memory and PRD/ADR sources before code edits.
- Completion requires make verify passing after final changes and post-commit verification per repo policy.

Key decisions:

- Keep new tools read-only and route through existing domain services/converters instead of adding parallel read models.
- `agh__session_describe` is a composite read-only payload over status/events/history; workspace `info` is the registered record and `describe` is the resolved detail projection.

State:

- Implementation, focused tests, full verification, task tracking updates, local commit, and post-commit verification are complete.

Done:

- Loaded cy-workflow-memory, cy-execute-task, cy-final-verify, golang-pro, testing-anti-patterns, agh-code-guidelines, and agh-test-conventions.
- Read root/internal AGENTS/CLAUDE guidance and workflow memory files.
- Read `_techspec.md`, ADR-001, ADR-002, task_03.md, and `_tasks.md`.
- Captured baseline: built-in catalog test passes, but Task 03 IDs/toolsets are absent.
- Added coordination/session/workspace read IDs, descriptors, toolsets, daemon-native handlers, and tests.
- Focused validation passed: `go test ./internal/tools/builtin ./internal/daemon ./internal/api/core -count=1`, `git diff --check`, and built-in package coverage 91.7%.
- Full `make verify` initially failed on stale OpenAPI output; `make codegen` refreshed generated files.
- Second `make verify` reached Go lint, then failed on `bootToolRegistry` funlen and three pre-existing long lines in `internal/api/testutil/apitest.go`.
- Applied minimal lint repairs and confirmed `go test ./internal/daemon ./internal/api/testutil -run 'TestDaemonNativeTools|TestToolRoutesStayHTTPAndUDSBehaviorallyAligned|^$' -count=1` plus `golangci-lint run ./internal/daemon ./internal/api/testutil` pass.
- Full `make verify` passed after repairs.
- Task tracking updated in `.compozy/tasks/tools-refac/task_03.md` and `_tasks.md`.
- Self-review split `workspace_describe` availability from lighter workspace reads because it also needs the session manager; focused regression test passed.
- Final `make verify` after the self-review fix passed with 7038 Go tests and package boundary checks.
- Scoped staged tree excludes unrelated dirty worktree changes; staged-tree focused verification passed from a temporary archive with `go test ./internal/tools/builtin ./internal/daemon ./internal/api/core -count=1`.
- Created local commit `d5316f5b feat: add coordination session workspace read tools`.
- Post-commit `make verify` passed with 7038 Go tests and package boundary checks.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Repo: /Users/pedronauck/Dev/compozy/agh
- Workflow memory: .compozy/tasks/tools-refac/memory/MEMORY.md, task_03.md
- Task files: .compozy/tasks/tools-refac/task_03.md, \_tasks.md
