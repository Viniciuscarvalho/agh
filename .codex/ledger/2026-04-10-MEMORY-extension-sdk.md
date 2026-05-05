Goal (incl. success criteria):

- Complete ext-architecture task_10 by implementing the TypeScript extension SDK package, test harness, scaffolding CLI, coverage, task/workflow tracking updates, and one local commit after clean verification.
- Success means: `sdk/typescript/` exists as a buildable workspace package, exports `Extension`, `StdioTransport`, `HostAPI`, `@agh/extension-sdk/testing`, and `@agh/create-extension`; explicit unit/integration tests pass at >=80% coverage; SDK build works; scaffolded template works; `make verify` passes; tracking files are updated correctly.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md`, required task skills (`cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`), and avoid destructive git commands or unrelated worktree edits.
- Source of truth is `.compozy/tasks/ext-architecture/task_10.md`, `_techspec.md`, `_protocol.md`, `_examples.md`, `_tasks.md`, ADR-001, ADR-004, and the provided workflow memory files.
- Keep scope tight to task 10; use follow-up notes instead of silently expanding scope.
- Existing unrelated modifications under `.compozy/tasks/ext-architecture/` and `docs/ideas/anp/*` must remain untouched except required workflow/task tracking files.

Key decisions:

- UNCONFIRMED: prefer a native TypeScript build pipeline using local workspace tooling and `tsc`-based dual ESM/CJS output unless repo constraints require an additional build dependency.
- The approved design is already captured by the PRD/techspec/examples, so no separate brainstorming approval loop is needed for this run.

State:

- Completed; implementation, verification, workflow memory, task tracking, and the required local commit are finished.

Done:

- Read required skill docs for `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, plus relevant TypeScript/Vitest guidance.
- Read root and web guidance files, shared workflow memory, and task-local workflow memory.
- Read task_10, `_tasks.md`, ADR-001, ADR-004, and the relevant `_techspec.md`, `_protocol.md`, `_examples.md` sections for the SDK.
- Scanned related ledgers for protocol, manifest, capability, and Host API prior work.
- Captured baseline gap: `sdk/typescript/` does not exist and task 10 remains pending.
- Added workspace packages `sdk/typescript` and `sdk/create-extension`, wired them into root workspaces and Vitest projects, and implemented the SDK runtime, typed Host API client, testing harness, and scaffolding templates.
- Added Vitest unit coverage and a real subprocess integration test for the SDK.
- Verified `npm run coverage --workspace @agh/extension-sdk`, `npm run build --workspace @agh/extension-sdk`, `npm run test --workspace @agh/create-extension`, `npm run build --workspace @agh/create-extension`, scaffolded a sample extension with the CLI and built it successfully, and passed `make verify`.
- Updated task-local/shared workflow memory plus task tracking for task 10.
- Created local commit `69a5dd5` (`feat: add extension typescript sdk`) containing only the implementation/workspace files; tracking and workflow-memory files remain local-only per task workflow rules.

Now:

- Task is complete; prepare the final evidence-backed handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-extension-sdk.md`
- `.compozy/tasks/ext-architecture/task_10.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_protocol.md`
- `.compozy/tasks/ext-architecture/_examples.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_10.md`
- `package.json`
- `vitest.config.ts`
- `sdk/typescript/package.json`
- `sdk/typescript/src/*`
- `sdk/typescript/scripts/postbuild.mjs`
- `sdk/typescript/vitest.config.ts`
- `sdk/create-extension/package.json`
- `sdk/create-extension/src/*`
- `sdk/create-extension/templates/*`
- `sdk/create-extension/vitest.config.ts`
- `internal/extension/host_api.go`
- `internal/extension/manifest.go`
- `internal/tools/tool.go`
- `internal/subprocess/transport.go`
- `internal/subprocess/handshake.go`
- `internal/hooks/events.go`
- `internal/hooks/types.go`
- `internal/hooks/payloads.go`
- Commands: `rg`, `sed`, `git status`, `npm run coverage --workspace @agh/extension-sdk`, `npm run build --workspace @agh/extension-sdk`, `npm run test --workspace @agh/create-extension`, `npm run build --workspace @agh/create-extension`, scaffold smoke test via `node sdk/create-extension/dist/index.js ...`, `make verify`
