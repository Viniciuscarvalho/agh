Goal (incl. success criteria):

- Implement tools-refac task 07: hosted MCP parity and redacted `agh__mcp_auth_status`.
- Success requires workflow memory loaded, PRD/ADR context read, code/tests implemented, `make verify` passing, tracking updates, and one local commit.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must not edit code before both caller-provided workflow memory files are available.
- Must not run destructive git commands without explicit permission.
- `agh-code-guidelines`, `agh-test-conventions`, and `agh-cleanup-failure-paths` were requested by the task file but are not installed in this session.

Key decisions:

- Blocked before implementation because the required current task memory path is missing.

State:

- Blocked before code edits.

Done:

- Loaded relevant installed skill instructions.
- Read root `AGENTS.md`, root `CLAUDE.md`, and shared workflow memory.
- Confirmed `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_07.md` is missing.

Now:

- Waiting for corrected current task memory path or permission/instruction to create the missing file.

Next:

- Once memory path is resolved, read current task memory, PRD docs, required ADRs, task dependencies, and internal Go guidance before implementation.

Open questions (UNCONFIRMED if needed):

- What current task memory file should be used for task 07? The prompt path is missing; only `memory/task_04.md` exists under the workflow memory directory.

Working set (files/ids/commands):

- Shared memory: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/MEMORY.md`
- Missing current task memory: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_07.md`
- Task file exists: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/task_07.md`
