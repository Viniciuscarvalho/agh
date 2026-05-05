Goal (incl. success criteria):

- Implement `.compozy/tasks/tools-refac/task_05.md` by exposing automation and extension mutable lifecycle built-ins, with policy/approval/source-trust enforcement, tests, tracking updates, clean verification, and one local commit.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read shared workflow memory and current task memory before code edits.
- Caller-provided current task memory path is `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_05.md`.
- No destructive git commands without explicit user permission.
- `make verify` is required before any completion claim or commit.

Key decisions:

- Do not start implementation until the missing current task memory path is resolved.

State:

- blocked

Done:

- Read required skill instructions for `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, and `cy-final-verify`.
- Read root AGENTS/CLAUDE guidance enough to confirm missing installed skills `agh-code-guidelines` and `agh-test-conventions` are referenced by the repo but not available in the session skill list.
- Read shared workflow memory at `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/MEMORY.md`.
- Confirmed `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_05.md` is missing; only `memory/task_04.md` and `memory/MEMORY.md` exist.
- Confirmed task file `.compozy/tasks/tools-refac/task_05.md`, `_techspec.md`, `_tasks.md`, ADR-002, and ADR-006 exist.

Now:

- Stop before code edits per `cy-workflow-memory` missing-path rule.

Next:

- Ask user whether to initialize the exact missing task memory file or provide the correct current task memory path.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_05.md` should be newly created for this run.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-29-MEMORY-tools-task-05.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/MEMORY.md`
- Missing: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_05.md`
- `ls -la /Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory`
