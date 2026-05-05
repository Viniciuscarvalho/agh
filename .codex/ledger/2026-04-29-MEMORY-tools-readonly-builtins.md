Goal (incl. success criteria):

- Implement `.compozy/tasks/tools-refac/task_03.md`: expand AGH read-only built-in tools for memory, sessions, workspace, network inspection, observe, and bridges.
- Success means descriptors, projection behavior, dispatch wiring, deterministic errors, and tests are complete; task tracking/memory are updated; `make verify` passes; one local commit is created.

Constraints/Assumptions:

- Follow `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify`.
- Project-local `agh-code-guidelines` and `agh-test-conventions` exist in `.agents/skills/`; they are not installed session skills but must be read as repo guidance before Go/test edits.
- No destructive git commands without explicit user permission.
- Worktree has pre-existing unrelated edits in root guidance/skill docs; do not touch them.
- Conversation may be BR-PT; code, docs, commits, and task artifacts remain English.

Key decisions:

- Treat the PRD/TechSpec/task files as already-approved design input, so implementation proceeds through `cy-execute-task`.

State:

- Blocked before production-code edits because the required registry foundation is absent from the current code tree.

Done:

- Read workflow skill, execute-task skill, Go/test skills, final-verify skill, root/internal guidance, workflow memory, and relevant previous ledgers.
- Reconciled initial git status: branch is ahead 1; unrelated modified guidance files exist; `.compozy/tasks/tools-refac/` is untracked and relevant to this workflow.
- Read `task_03.md`, `_tasks.md`, `_techspec.md` required sections, all `tools-refac` ADRs, competitor notes, `tools-registry/task_05.md`, and key `tools-registry` ADRs.
- Confirmed current `internal/tools` contains only the legacy metadata/resource model (`tool.go`, `resource.go`, tests) and lacks `Registry.Call`, `ToolsetID`, descriptors, provider handles, projection types, effective-policy resolver, and daemon native-provider wiring.
- Confirmed `.compozy/tasks/tools-registry/task_01.md` through `task_16.md` are still `pending` and `tools-refac/task_02.md` is marked `completed` without corresponding registry foundation code in the workspace.

Now:

- Handoff the prerequisite mismatch instead of implementing an ad hoc registry fork inside task 03.

Next:

- Reconcile the missing `tools-registry` foundation and actual task 02 implementation before retrying task 03.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-29-MEMORY-tools-readonly-builtins.md`
- `.compozy/tasks/tools-refac/memory/MEMORY.md`
- `.compozy/tasks/tools-refac/memory/task_03.md`
- `.compozy/tasks/tools-refac/task_03.md`
- `.compozy/tasks/tools-refac/_techspec.md`
- `.compozy/tasks/tools-refac/_tasks.md`
