# Memory Ledger

- Goal (incl. success criteria): Review `.compozy/tasks/core-tasks/_techspec.md` and ADRs `adr-001.md` through `adr-006.md` for internal coherence, AGH package-boundary compliance, duplicate-executor risk, and whether the revised design resolves the earlier review concerns.
- Constraints/Assumptions: Review only; no product-code edits. Follow workspace rules: no destructive git commands. Final response should be findings only, ordered by severity, with file/line references. No web required.
- Key decisions: Treat `internal/automation` as the key overlap risk because the live codebase already has its own `Run`/`Dispatcher`/session path. Also inspect whether the task run API surface is fully owned by the proposed `TaskManager` boundary and whether durable `TaskRun` lifecycle has a startup recovery story.
- State: In progress.
- Done: Read AGH instructions, the architectural-analysis skill, the topic ledger in `.codex/ledger/2026-04-13-MEMORY-core-tasks-techspec.md`, the current-review ledger, the tech spec, ADRs 001-006, the first review round, and relevant automation/store code for overlap confirmation.
- Now: Finalize findings and keep them strictly concrete.
- Next: Return a short severity-ordered review with only actionable findings.
- Open questions (UNCONFIRMED if needed): Whether the missing run-read method on `TaskManager` is intentionally meant to be served by `TaskView` alone is UNCONFIRMED.
- Working set (files/ids/commands): `.compozy/tasks/core-tasks/_techspec.md`, `.compozy/tasks/core-tasks/adrs/adr-001.md`..`adr-006.md`, `internal/automation/dispatch.go`, `internal/automation/types.go`, `internal/store/globaldb/global_db.go`, `.codex/ledger/2026-04-13-MEMORY-core-tasks-techspec.md`, `.codex/ledger/2026-04-13-MEMORY-current-review.md`
