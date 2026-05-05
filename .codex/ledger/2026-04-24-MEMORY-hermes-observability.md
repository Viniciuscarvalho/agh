Goal (incl. success criteria):

- Implement Hermes Task 02: config-driven observability retention sweep and typed health payload base.
- Success requires retention controlled by `observability.retention_days`, deterministic/injected time, explicit lifecycle-owned sweep invocation, no hidden goroutine, typed API health fields, tests for cutoff/no-op/API conversion/config edge cases, web/site impact assessment, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Do not run destructive git commands.
- Do not hand-edit dependencies; use repo patterns and existing packages.
- Keep scope to Task 02; record follow-ups instead of expanding silently.
- Keep tracking/memory files out of automatic commit unless repository policy requires staging them.

Key decisions:

- `observability.retention_days = 0` will mean keep history/no-op; negative values stay invalid.
- Retention deletion will be store-owned in `globaldb` and invoked through an explicit observer retention runtime started/stopped by daemon lifecycle.
- Scope retention to global observability rows (`event_summaries`, `permission_log`, `token_stats`) by timestamp/update cutoff; do not delete session catalog rows or per-session event DBs in this task.
- Health additions will stay typed under `internal/api/contract` with retention and persistence subpayloads while retaining existing top-level DB size fields.

State:

- Completed; implementation, verification, memory/tracking updates, and scoped local commit are done.

Done:

- Read required PRD execution and memory skills.
- Read root repository guidance and workflow memory files.
- Scanned `.codex/ledger/` and read relevant Hermes cross-task ledgers.
- Read Hermes `_techspec.md`, `_tasks.md`, all ADRs, Task 01 outputs, and relevant analysis docs.
- Captured baseline: `retention_days` exists in config/settings/docs but no sweep method or lifecycle call path exists.
- Added global DB retention sweep for `event_summaries`, `token_stats`, and `permission_log`.
- Added observer retention runtime with injected clock, explicit `StartRetention`/`ShutdownRetention`, and typed retention health.
- Wired daemon lifecycle to start/stop observer retention from `observability.retention_days`.
- Extended observe/API/CLI health payloads with typed persistence and retention fields.
- Added focused backend tests for sweep cutoff/no-op retention/config validation/API conversion/handler shape.
- Targeted backend test pass: `go test ./internal/store/globaldb ./internal/observe ./internal/api/core ./internal/config ./internal/cli ./internal/daemon`.
- Ran `make codegen`; updated `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`.
- Updated web daemon health fixtures/type tests and targeted Vitest coverage; `bun run --cwd web typecheck:raw` and targeted daemon/home-page tests pass.
- Updated operator docs for `retention_days = 0` and observe health persistence/retention JSON fields.
- Fresh `make verify` passed after an unrelated `internal/session` timing failure passed on isolated/package reruns and the full gate passed on rerun.
- Updated workflow memory for Task 02 and shared Hermes durable context.
- Marked Task 02 and the master Hermes task entry completed after verification and self-review.
- Created local commit `5a71dea2 feat: add observability retention health`.

Now:

- Prepare final report.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/hermes/task_02.md`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/adrs/adr-001-hermes-hardening-tracks.md`
- `.compozy/tasks/hermes/memory/MEMORY.md`
- `.compozy/tasks/hermes/memory/task_02.md`
- `internal/store/globaldb/global_db_observe.go`
- `internal/observe/`
- `internal/api/contract/contract.go`
- `internal/api/core/conversions.go`
- `internal/config/config.go`
- `internal/daemon/`
- `openapi/agh.json`
- `web/src/generated/agh-openapi.d.ts`
- `web/src/systems/daemon/*`
- `web/src/hooks/routes/use-home-page.test.tsx`
- `packages/site/content/runtime/core/configuration/config-toml.mdx`
- `packages/site/content/runtime/cli-reference/observe/health.mdx`
- `go test ./internal/store/globaldb ./internal/observe ./internal/api/core ./internal/config ./internal/cli ./internal/daemon`
- `make codegen`
- `make codegen-check`
- `bun run --cwd web typecheck:raw`
- `bun run --cwd web test:raw src/systems/daemon/types.test.ts src/systems/daemon/adapters/daemon-api.test.ts src/systems/daemon/hooks/use-daemon-health.test.ts src/hooks/routes/use-home-page.test.tsx`
- `make verify`
- `git commit -m "feat: add observability retention health"`
