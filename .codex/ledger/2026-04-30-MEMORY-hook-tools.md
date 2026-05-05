Goal (incl. success criteria):

- Execute tools-refac Task 06: hook management tool family in AGH; expose hook read/mutation tools with AGH-owned mutation only, deterministic denials, approval/policy checks, tests, tracking update, and one local commit after clean verification.
  Constraints/Assumptions:
- Must use cy-workflow-memory, cy-execute-task, cy-final-verify.
- Must follow AGH repo rules: no destructive git commands without permission; make verify required; automatic commit only after verification/self-review/tracking updates.
- Existing worktree has pre-existing modified/untracked files; do not revert unrelated work.
  Key decisions:
- No production code edit planned unless verification/self-review finds a gap; current branch already contains hook tooling from combined config/hook implementation commit `0b879ef1`.
- Use focused native behavior tests plus `internal/config` and `internal/hooks` package coverage for the hook-family coverage requirement.
  State:
- Task 06 implementation, tracking, commit, and post-commit verification are complete.
  Done:
- Read required workflow skills and workflow memory files.
- Read root AGENTS.md/CLAUDE.md and internal/CLAUDE.md.
- Activated/read relevant Go/test/no-workaround/debugging skills.
- Read `_techspec.md`, `_tasks.md`, `task_06.md`, ADR-002, and ADR-006.
- Confirmed hook descriptors, native bindings, mutation paths, immutable/secret denials, and approval tests exist.
- Captured pre-change signal: `.compozy/tasks/tools-refac/task_06.md` frontmatter and `_tasks.md` row still mark Task 06 pending.
- Added focused native-tool test coverage for hook read tools (`list/info/events/runs`) and `HookSourceSkill` immutability.
- Focused tests passed:
  - `go test ./internal/daemon ./internal/tools/builtin -run 'TestDaemonNativeTools|TestBuiltinNativeDescriptors|TestBuiltinToolsetCatalog' -count=1 -race -cover`
  - `go test ./internal/config ./internal/hooks -count=1 -race -cover`
- `make verify` passed with Go lint `0 issues`, `DONE 7041 tests`, and package boundaries respected.
- Updated `.compozy/tasks/tools-refac/task_06.md` frontmatter to `status: completed` and `_tasks.md` row 06 to `completed`.
- Created local commit `b81143e7 test: cover hook management tools` containing only `internal/daemon/native_tools_test.go`.
- Post-commit `make verify` passed with Go lint `0 issues`, `DONE 7041 tests`, and package boundaries respected.
- Updated shared workflow memory and task-local workflow memory with final evidence.
  Now:
- Final status check before response.
  Next:
- None for Task 06 in this session.
  Open questions (UNCONFIRMED if needed):
- None.
  Working set (files/ids/commands):
- Workflow memory: .compozy/tasks/tools-refac/memory/MEMORY.md and task_06.md.
- Likely files: internal/tools/builtin/hooks.go, internal/daemon/native_config_hook_tools.go, internal/daemon/native_tools_test.go, internal/hooks/\*, internal/config/hooks.go, internal/cli/hooks.go.
- Verification evidence: focused native hook tests, config/hooks package coverage, full `make verify` before commit, and full `make verify` after commit.
