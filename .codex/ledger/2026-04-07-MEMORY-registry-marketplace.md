Goal (incl. success criteria):

- Implement task 07: marketplace-aware registry loading, provenance/hash verification, quarantine/block-on-load behavior, disabled-skill catalog filtering, required tests, and clean verification.

Constraints/Assumptions:

- Must follow task_07.md, `_techspec.md`, `_tasks.md`, and ADR-004 as source of truth.
- Must use workflow memory files under `.compozy/tasks/skills-v2/memory/`.
- Must not touch unrelated dirty worktree files (`docs/rfcs/skills-system-final.md`, task tree files except required tracking/memory updates).
- Task requires tests plus `make lint` and `make verify` before completion.

Key decisions:

- Marketplace quarantine should preserve existing block-on-load semantics for critical findings rather than retaining disabled marketplace entries.
- Disabled skill filtering belongs in `BuildCatalog()` so every catalog caller inherits the safeguard.

State:

- Verification complete; pending final commit and handoff.

Done:

- Read AGENTS.md, CLAUDE.md, workflow memory, task_07.md, `_tasks.md`, `_techspec.md`, and ADRs.
- Confirmed current gaps in `internal/skills/registry.go` and `internal/skills/catalog.go`.
- Built execution checklist and working plan.
- Implemented marketplace sidecar detection, provenance loading, load-time hash verification, mismatch logging, block-on-load quarantine, and catalog filtering.
- Added unit and integration coverage for marketplace load/reload/tamper flows.
- Ran `go test ./internal/skills/...`, `go test -cover ./internal/skills/...`, `go test -tags integration ./internal/skills/...`, `make lint`, and `make verify` successfully.

Now:

- Review/stage intended code changes only, then create the local commit.

Next:

- Final handoff summary and optional ledger cleanup after completion.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether existing integration coverage patterns in `internal/skills` are sufficient or if a new `*_integration_test.go` file is needed for task-required lifecycle checks.

Working set (files/ids/commands):

- `internal/skills/registry.go`
- `internal/skills/catalog.go`
- `internal/skills/registry_test.go`
- `internal/skills/catalog_test.go`
- `/Users/pedronauck/dev/projects/agh/.compozy/tasks/skills-v2/task_07.md`
- `/Users/pedronauck/dev/projects/agh/.compozy/tasks/skills-v2/_techspec.md`
