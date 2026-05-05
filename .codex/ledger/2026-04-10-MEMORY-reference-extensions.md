Goal (incl. success criteria):

- Complete ext-architecture task_11 by adding two working reference extensions (`sdk/examples/secret-guard` in Go and `sdk/examples/prompt-enhancer` in TypeScript), plus end-to-end integration coverage that installs them into a real AGH daemon and verifies handshake, hook dispatch, Host API behavior, restart recovery, shutdown, and required tracking/workflow updates.
- Success means: both example directories build from their documented instructions; the daemon-backed integration test proves the extensions load, hooks apply observable effects, limited Host API grants are denied, crash recovery restarts the runtime, shutdown is graceful, and the required verification commands pass before tracking/commit.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md`, task-required skills (`cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`), and the ext-architecture PRD docs as source of truth.
- Keep scope tight to task 11; only touch required workflow/task tracking files beyond implementation/test files.
- Existing modified task/doc files in the worktree are unrelated and must not be reverted or rewritten except the current task’s required tracking/memory files.
- `brainstorming` was reviewed because the repo skill table flags creative work, but this run already has an approved PRD/techspec and explicit execution workflow, so no extra design-approval loop is needed.

Key decisions:

- The reference extensions will support two execution paths from one codebase: persistent `serve` mode for the L3 JSON-RPC runtime/handshake, and one-shot hook mode for current hook declarations that still use the subprocess hook executor.
- The real-daemon integration test will drive AGH over its UDS API and a real ACP helper agent so prompt hooks are exercised through session creation/prompting instead of mocked hook dispatch.
- Capability-denied Host API behavior will be proven through the TypeScript example by granting only read access while the extension intentionally attempts `sessions/create` and records the typed denial.
- Restart-recovery evidence will come from the Go example runtime by making its persistent process crash once under test-controlled env and verifying the manager restarts it with a new active process.

State:

- In progress.

Done:

- Read repo instructions, required skill docs, shared workflow memory, task_11, `_tasks.md`, `_techspec.md`, `_examples.md`, `_protocol.md`, and ADRs 001/003/004/005.
- Read related ledgers for task 07/08/10 and extension protocol/runtime context.
- Confirmed baseline gaps: `sdk/examples/` is absent; no task-11-specific installed-extension integration coverage exists in `internal/extension/`; no reference extensions currently validate the daemon-backed extension pipeline.
- Confirmed the current runtime model: extension manager owns persistent subprocess handshake/Host API wiring, while manifest hook resources still dispatch through the existing one-shot subprocess hook executor.
- Confirmed daemon integration can be driven externally via `daemon.Run` + UDS API, with a custom ACP helper agent defined in a temp `AGENT.md`.

Now:

- Implement the two example packages and the daemon-backed integration test harness.

Next:

- Add the Go reference extension with hook mode + persistent runtime mode.
- Add the TypeScript reference extension using `@agh/extension-sdk`, including hook mode and Host API capability-denial markers.
- Add the integration test and supporting helpers, then run targeted verification.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether task tracking files should remain outside the final commit like task_10 did, or whether this repo wants them staged for task_11. Re-check caller instructions and current repo practice before committing.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-reference-extensions.md`
- `.compozy/tasks/ext-architecture/task_11.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_examples.md`
- `.compozy/tasks/ext-architecture/_protocol.md`
- `.compozy/tasks/ext-architecture/adrs/adr-001.md`
- `.compozy/tasks/ext-architecture/adrs/adr-003.md`
- `.compozy/tasks/ext-architecture/adrs/adr-004.md`
- `.compozy/tasks/ext-architecture/adrs/adr-005.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_11.md`
- `internal/extension/*`
- `internal/daemon/*`
- `internal/session/manager_stop_integration_test.go`
- `sdk/typescript/src/*`
- Commands: `rg`, `sed`, `git status`, `find`
