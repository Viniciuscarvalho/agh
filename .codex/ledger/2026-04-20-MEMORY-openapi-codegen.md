Goal (incl. success criteria):

- Execute daemon-web-ui task 02 in the current `agh` repo by adding the checked-in browser contract artifact `openapi/compozy-daemon.json`, deterministic codegen/check support for `web/src/generated/compozy-openapi.d.ts`, shared typed client/helpers, tests, verification, and task tracking updates.
- Success means: root/web codegen commands generate and drift-check the new daemon types deterministically; later daemon-web tasks can import the typed client/helpers without hand-written REST types; verification evidence is fresh; workflow memory/task tracking are updated.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md`, plus `web/AGENTS.md` / `web/CLAUDE.md` for files under `web/`.
- Do not touch unrelated dirty worktree changes already present on branch `unify-capability`.
- Source-of-truth task docs live under `../_worktrees/daemon-web-ui/.compozy/tasks/daemon-web-ui/`; current repo state already has an AGH-wide OpenAPI contract (`openapi/agh.json`) and web app imports from `agh-openapi`.
- Because the daemon-web endpoints from the techspec do not exist in this repo yet, replacing the existing AGH client would break unrelated surfaces; task 02 therefore needs an additive contract/codegen path.
- Completion requires task-specific validation plus `make web-lint`, `make web-typecheck`, and full `make verify`.

Key decisions:

- Implement a parallel `compozy-daemon` contract/codegen surface instead of replacing the existing `agh` contract.
- Keep the existing AGH codegen path intact and extend the root codegen/check flow to also generate/check daemon-web types from the checked-in JSON artifact.
- Extend `web/src/lib/api-client.ts` / `api-contract.ts` with daemon-web exports while preserving current AGH exports for the existing app.

State:

- completed

Done:

- Read repo guidance (`AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`), required skills, workflow memory, task spec, techspec, ADRs, and relevant prior ledgers.
- Inspected the current OpenAPI/codegen pipeline in `cmd/agh-codegen`, `magefile.go`, `Makefile`, `package.json`, `web/package.json`, `turbo.json`, `web/src/lib/api-client.ts`, and `web/src/lib/api-contract.ts`.
- Captured the pre-change signal: the repo currently ships only `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`; no `compozy-daemon` artifact/types/client surface exists.
- Added `openapi/compozy-daemon.json`, generated `web/src/generated/compozy-openapi.d.ts`, and extended the shared web client/contract helpers with additive daemon-web exports.
- Added reusable `internal/codegen/openapits` generation/check helpers, widened the root `mage Codegen` / `CodegenCheck` flow to cover both browser contracts, and updated Turbo invalidation inputs for the new spec/generator package.
- Added focused coverage for `cmd/agh-codegen`, `internal/codegen/openapits`, `internal/e2elane`, and `web/src/lib/api-client.ts`, including drift-check and script-wiring assertions.
- Fresh verification passed: targeted Go coverage met the >=80% requirement (`openapits` 80.0%, `e2elane` 91.7%, `cmd/agh-codegen` 80.4%), targeted Vitest coverage for `web/src/lib/api-client.ts` reached 100%, `bun run codegen-check` passed, and `make verify` passed cleanly after all changes.

Now:

- None.

Next:

- Update external task tracking files and create the local commit for task-owned changes only.
- Run task-specific validation and full verification, then update tracking files.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether later daemon-web handler tasks will migrate the new contract into a Go-generated source or keep the checked-in JSON artifact authoritative until those endpoints exist.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-openapi-codegen.md`
- `openapi/compozy-daemon.json`
- `magefile.go`
- `magefile_test.go`
- `package.json`
- `web/package.json`
- `turbo.json`
- `web/src/generated/compozy-openapi.d.ts`
- `web/src/lib/api-client.ts`
- `web/src/lib/api-contract.ts`
- `web/src/lib/*.test.ts`
- `cmd/agh-codegen/main_test.go`
- `../_worktrees/daemon-web-ui/.compozy/tasks/daemon-web-ui/memory/{MEMORY.md,task_02.md}`
