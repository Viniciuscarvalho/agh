Goal (incl. success criteria):

- Implement Hermes Task 01: durable SQLite migration runner for global/session DBs and shared context-aware retry/backoff foundations.
- Success requires ordered/idempotent migrations, `schema_migrations` in both DB families, tests for fresh/repeated/failure cases, retry tests for cancellation/attempts/jitter, web/packages-site impact assessment, clean verification, tracking updates, and one local commit.

Constraints/Assumptions:

- Follow `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Do not run destructive git commands.
- Do not hand-edit `go.mod`; use `go get` only if required.
- Keep scope to Task 01; record follow-ups instead of expanding silently.
- Existing unrelated worktree changes in docs/design and packages/site must remain untouched unless task analysis proves a required follow-up.
- Keep tracking/memory files out of automatic commit unless repository policy requires them staged.

Key decisions:

- Use `internal/store.RunMigrations` with ordered `store.Migration` records, checksums, per-migration transactions, and `schema_migrations`.
- Global and session DBs each own a single v1 create-schema migration list near their schema statements.
- Keep the existing global DB pre-run normalization in `migrateGlobalSchema` before recording/applying v1; existing tests cover those already-present alpha fixtures, and the new runner records the canonical schema state after normalization.
- Add `internal/retry` as the shared context-aware jittered backoff primitive; migrate `internal/bridgesdk.RetryDo` delay/wait behavior onto it without changing bridge classification semantics.
- Web/packages-site impact: no required code or docs change found because Task 01 adds internal SQLite table state and Go-only retry primitives without API/OpenAPI/typed-client/settings payload changes.

State:

- Implementation, verification, tracking updates, and scoped local commit are complete.

Done:

- Read repository guidance (`AGENTS.md`, `CLAUDE.md`), Hermes `_techspec.md`, `_tasks.md`, Task 01, all Hermes ADRs, and workflow memory files.
- Activated/read required skills and Go/testing skills.
- Captured worktree baseline; unrelated site/design changes already exist.
- Added migration runner, retry package, DB wiring, and focused tests.
- Ran targeted package tests successfully.
- Analyzed `web/` and `packages/site`; no required follow-up code/docs changes.
- Brought affected backend package coverage to >=80% with focused tests.
- Fresh `make verify` completed successfully on 2026-04-24 20:16 -03: web lint/typecheck/tests/build, Go lint/test/build, and package-boundary checks completed; Go test phase reported 5,773 tests.
- Updated Task 01 tracking and master task status to completed.
- Created local commit `211f24fb feat: add store migrations and retry foundations`.

Now:

- Prepare final report.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/hermes/task_01.md`
- `.compozy/tasks/hermes/_techspec.md`
- `.compozy/tasks/hermes/_tasks.md`
- `.compozy/tasks/hermes/memory/MEMORY.md`
- `.compozy/tasks/hermes/memory/task_01.md`
- `internal/store/`
- `internal/store/globaldb/`
- `internal/store/sessiondb/`
- `internal/retry/`
- `internal/bridgesdk/errors.go`
- `go test ./internal/store ./internal/store/globaldb ./internal/store/sessiondb ./internal/retry ./internal/bridgesdk`
- `go test -cover ./internal/store ./internal/store/globaldb ./internal/store/sessiondb ./internal/retry ./internal/bridgesdk`
- `make verify`
- post-commit `go test -cover ./internal/store ./internal/store/globaldb ./internal/store/sessiondb ./internal/retry ./internal/bridgesdk`
