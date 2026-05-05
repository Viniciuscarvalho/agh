Goal (incl. success criteria):

- Complete autonomous task_16: add runtime autonomy docs and current CLI references for agent self, coordination channels, task leases, safe spawn, coordinator config, and autonomy hooks.
- Success requires docs matching implemented MVP behavior, generated CLI docs current, site checks passing, `make verify` passing, tracking updated, and one local commit.

Constraints/Assumptions:

- Do not run destructive git commands.
- Manual operator control is first-class: task creation is intent-only; publish/start/approval enqueue execution.
- Docs must cover MVP behavior only; no post-MVP network evolution, broad memory, dashboards, eval/replay, or marketing redesign.
- Raw claim tokens appear only in synchronous claim responses and command inputs, never read/list/channel/SSE/log docs.
- Workflow memory files are required context and must be updated before completion.

Key decisions:

- Use `make cli-docs` for CLI reference generation; update Cobra examples where generated pages need accurate examples.
- Add autonomy docs under `packages/site/content/runtime/core/autonomy/` and expose through `core/meta.json`.
- Keep conceptual docs concise and operational, linked to tasks, sessions, network, config, hooks, and CLI reference pages.

State:

- Task 16 implementation, verification, tracking updates, and local commit are complete.

Done:

- Read required workflow skills and documentation-writer/golang-pro skill guidance.
- Read shared workflow memory and task_16 memory.
- Confirmed pre-change signal: no runtime autonomy docs and stale generated CLI task reference.
- Added autonomy conceptual docs under `packages/site/content/runtime/core/autonomy/`.
- Added Cobra examples for `agh me`, `agh ch`, `agh task next|heartbeat|complete|fail|release`, and `agh spawn`.
- Updated config, hooks, sessions, network, and agent-spawn docs with MVP autonomy references.
- Regenerated CLI docs with `make cli-docs`.
- Added `packages/site/lib/runtime-autonomy-docs.test.ts` for docs/CLI reference consistency.
- Verified `packages/site` source generation, typecheck, test, and build.
- Verified full `env -u FORCE_COLOR make verify` successfully.

Now:

- Prepare final response with verification evidence and commit details.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/autonomous/task_16.md`
- `.compozy/tasks/autonomous/_tasks.md`
- `.compozy/tasks/autonomous/memory/task_16.md`
- `packages/site/content/runtime/core/`
- `packages/site/content/runtime/cli-reference/`
- `internal/cli/agent_kernel.go`
- `internal/cli/task.go`
- `internal/cli/spawn.go`
- Commands completed: `make cli-docs`, `cd packages/site && bun run source:generate`, `bun run typecheck`, `bun run test`, `bun run build`, `env -u FORCE_COLOR make verify`
- Commit: `a6000932 docs: add runtime autonomy references`
- Post-commit verification: `env -u FORCE_COLOR make verify` passed after commit-hook formatting.
- Post-commit site verification: `packages/site` source generation, typecheck, test, and build passed after commit-hook formatting.
