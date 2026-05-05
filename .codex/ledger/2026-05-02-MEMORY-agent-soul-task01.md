Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_01.md`: backend foundation for optional `SOUL.md` authored identity context.
- Success means `[agents.soul]` config defaults/validation/overlay tests exist; resolver parses/validates/digests/projects `SOUL.md`; diagnostics are closed and redacted; required tests and verification pass; no session/task/heartbeat/network behavior changes.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code/docs in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read workflow memory, PRD specs, ADR-001..ADR-011, root/Go guidance before code edits.
- Do not run destructive git commands.
- Automatic local commit is enabled only after clean verification, self-review, memory/tracking updates.

Key decisions:

- Use `_techspec_soul.md` as the field-level source of truth for Soul defaults when it conflicts with the aggregate spec. This sets `agents.soul.context_projection_bytes = 2048` for task_01 even though the aggregate config summary mentions `4096`.
- Keep resolver code in a new `internal/soul` package unless source exploration exposes a stronger existing package fit.

State:

- Task 01 implementation is complete, committed, and post-commit verified. Tracking/memory files remain uncommitted by design.

Done:

- Read shared workflow memory and `task_01` workflow memory.
- Read relevant historical `agent-soul` ledger.
- Loaded required workflow, Go, test, and no-workarounds skills.
- Read root/internal guidance, aggregate and child TechSpecs, ADR-001 through ADR-011, task list, task_01, and relevant competitor analyses/examples.
- Captured pre-change baseline: no `internal/soul` package and no existing `agents.soul`/`SOUL.md` implementation references.
- Reconciled current dirty worktree: `internal/config` has `[agents.soul]` config edits; `internal/soul` has resolver/parser/tests already present.
- Built execution checklist from `cy-execute-task` covering config, parser, validation, digest/projection/read model, diagnostics, missing/disabled cases, runtime non-mutation, coverage, and final verification.
- Fixed resolver path normalization so workspace-relative `SourcePath` values are interpreted under `WorkspaceRoot` and still checked for escape.
- Added config mutation allowlist entries for `agents.soul.enabled`, `agents.soul.max_body_bytes`, and `agents.soul.context_projection_bytes`.
- Focused tests pass after lint fixes: `go test ./internal/config ./internal/soul ./internal/frontmatter -count=1`; `go test -race ./internal/config ./internal/soul ./internal/frontmatter -count=1`; `internal/soul` coverage is 84.3%.
- `make lint` passes after fixing gocritic findings in `internal/soul`.
- Self-review found and fixed invalid diagnostic state propagation so invalid present content now returns `Present=true`, `Active=false`, `ReadModel.Valid=false`, and `ReadModel.Active=false`.
- Final focused tests after the self-review correction pass: `go test ./internal/config ./internal/soul ./internal/frontmatter -count=1`; `go test -race ./internal/config ./internal/soul ./internal/frontmatter -count=1`; `internal/soul` coverage is 84.6%.
- Final pre-commit `make verify` passes with `DONE 7396 tests` and `OK: all package boundaries respected`.
- Created local commit `cd68c9ca feat: add soul resolver foundation` with only `internal/config` and `internal/soul` files.
- Post-commit `make verify` passes with `DONE 7396 tests` and `OK: all package boundaries respected`.

Now:

- Final response.

Next:

- None for this task.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `.compozy/tasks/agent-soul/memory/MEMORY.md`
- `.compozy/tasks/agent-soul/memory/task_01.md`
- `.codex/ledger/2026-05-02-MEMORY-agent-soul-task01.md`
- Pre-existing unrelated changes: `.compozy/tasks/agent-soul/_tasks.md`, `task_16.md`, `task_17.md`, `.compozy/extensions/`, `.compozy/tasks/agent-soul/memory/*`.
- Intended commit scope: `internal/config/config.go`, `internal/config/config_test.go`, `internal/config/merge.go`, `internal/config/tool_surface.go`, `internal/config/tool_surface_test.go`, `internal/soul/soul.go`, `internal/soul/soul_test.go`.
- Commit: `cd68c9ca feat: add soul resolver foundation`.
