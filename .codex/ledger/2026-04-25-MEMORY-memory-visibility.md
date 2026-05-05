Goal (incl. success criteria):

- Implement Hermes Task 07: memory health/history visibility, typed CLI/API support, redacted bounded operation history, future context-ref/provider-hook interfaces without runtime prompt integration, tests, web/site impact assessment, tracking updates, and one local commit after clean verification.

Constraints/Assumptions:

- Follow `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- Read workflow memory, repository guidance, Hermes PRD docs, ADR-001, ADR-005, and Task 02 health outputs before editing code.
- Keep scope tight; do not integrate memory context refs into runtime prompts.
- Operation history must be bounded and redact secret/sensitive content.
- Automatic commit is enabled only after clean verification, self-review, memory/tracking updates.

Key decisions:

- Runtime prompt assembly must remain unchanged; context refs/provider hooks are interface-only in this task.
- Memory health/history should follow Task 02 typed health patterns and reuse existing memory health/log surfaces where practical.

State:

- Implementation complete; final verification passed before and after commit.

Done:

- Scanned `.codex/ledger/` and read relevant Hermes cross-task ledgers for Task 01, Task 02, Task 03, and Hermes TechSpec creation.
- Read `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify` skill instructions.
- Read shared workflow memory and current Task 07 memory.
- Read repository `AGENTS.md`/`CLAUDE.md`, `web/AGENTS.md`/`web/CLAUDE.md`, Hermes Task 07, `_techspec.md`, `_tasks.md`, all Hermes ADRs, Task 02 task/memory health outputs, and Task 10 QA dependency.
- Checked initial worktree status; unrelated existing modified/untracked site/task files are present and must not be reverted.
- Captured pre-change baseline confirming `agh memory health` did not exist.
- Added typed memory operation/history DTOs and health fields.
- Extended memory catalog operation log with structured scope/workspace/filename columns and bounded redacted summaries.
- Added memory store history query support and operation stats in health.
- Added direct API handlers/routes/spec entries for `/api/memory/health` and `/api/memory/history`.
- Added CLI client methods and `agh memory health` / `agh memory history` command implementations.
- Added initial CLI and CLI client tests.
- Added store/API/CLI/interface tests for history filters, redaction, bounds, durability, health states, and future seams.
- Ran focused Go package tests successfully for memory/API transports/CLI.
- Ran `make codegen` and `make codegen-check`; generated `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts` changed.
- Updated memory CLI/API/site docs and ran web/site type checks successfully.
- Ran final `make verify`; passed with 5830 Go tests, web tests, lint, build, and package boundary checks.
- Created commit `26f6ab1d` (`feat: add memory visibility surfaces`).
- Ran post-commit `make verify`; passed with 5830 Go tests and package boundary checks.

Now:

- Prepare final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-25-MEMORY-memory-visibility.md`
- `.compozy/tasks/hermes/memory/MEMORY.md`
- `.compozy/tasks/hermes/memory/task_07.md`
- `.compozy/tasks/hermes/task_07.md`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/adrs/adr-001-hermes-hardening-tracks.md`
- `.compozy/tasks/hermes/adrs/adr-005-memory-health-history-before-runtime-contextrefs.md`
- `internal/memory/types.go`
- `internal/memory/catalog.go`
- `internal/memory/store.go`
- `internal/api/contract/contract.go`
- `internal/api/core/memory.go`
- `internal/api/spec/spec.go`
- `internal/api/httpapi/routes.go`
- `internal/api/udsapi/routes.go`
- `internal/cli/client.go`
- `internal/cli/memory.go`
- `openapi/agh.json`
- `web/src/generated/agh-openapi.d.ts`
- `packages/site/content/runtime/cli-reference/memory/health.mdx`
- `packages/site/content/runtime/cli-reference/memory/history.mdx`
- `packages/site/content/runtime/core/memory/system.mdx`
