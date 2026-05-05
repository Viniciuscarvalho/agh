Goal (incl. success criteria):

- Execute `.compozy/tasks/autonomous/task_12.md`: add durable, queryable session lineage/spawn metadata (parent/root/depth/role/TTL/budget/policy) to session creation, global catalog persistence, read DTOs, generated contracts, and tests, then verify and create one local commit.

Constraints/Assumptions:

- Follow root AGENTS/CLAUDE guidance: no destructive git commands without explicit permission; `make verify` is the completion gate; keep scope tight; no spawn API in this task.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`; also use Go/testing/no-workaround guidance for implementation and tests.
- Workflow memory paths under `.compozy/tasks/autonomous/memory` are authoritative and must be updated before finishing.
- Automatic commit is enabled only after clean verification, self-review, and tracking updates.

Key decisions:

- Manual user/dream/system sessions normalize to root lineage: no parent, `root_session_id = session_id`, `spawn_depth = 0`.
- Coordinator sessions use `session_type = coordinator`, are root sessions, and require a future TTL deadline at creation.
- Spawned child sessions use `session_type = spawned` and require parent/root/depth plus a future TTL deadline; public spawn/reaper behavior stays for Task 13.
- Parent/root/depth/role/TTL/auto-stop are typed columns; budget and permission policy are typed Go structs stored in the TechSpec-required JSON columns.

State:

- completed; local commit `0eff7b38` created and post-commit `make verify` passed

Done:

- Read shared workflow memory and current task memory.
- Read required execution/final-verify/workflow-memory skills plus Go/testing/no-workaround guidance.
- Scanned existing ledger files and read relevant prior autonomy ledgers.
- Read task, `_tasks.md`, `_techspec.md`, ADR-001 through ADR-012, and the requested `.resources` references.
- Captured baseline gap: generated lineage DTOs exist, but canonical session creation/info/global DB did not persist source-of-truth lineage metadata.
- Implemented typed session lineage/budget/policy model and validation in `internal/store`.
- Added global session catalog migration v8, typed lineage columns, JSON budget/policy mapping, restart-safe scans, and lineage filters.
- Wired session manager creation/resume/list/get flows for root, coordinator, and spawned metadata without adding spawn API/reaper behavior.
- Exposed lineage through canonical session info, API conversions, agent identity snapshots, daemon environment reconciliation, and observer payloads.
- Added unit and integration coverage for root sessions, spawned/coordinator validation, invalid lineage/policy/budget, DTO leakage, global DB restart, and filters.
- Ran focused Go/API/store/web/codegen checks and full `make verify`; all passed.
- Created local commit `0eff7b38` (`feat: add session lineage metadata`) with implementation files only.
- Ran post-commit `make verify`; exit 0.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.compozy/tasks/autonomous/task_12.md`
- `.compozy/tasks/autonomous/_techspec.md`
- `.compozy/tasks/autonomous/_tasks.md`
- `.compozy/tasks/autonomous/adrs/adr-006.md`
- `.compozy/tasks/autonomous/adrs/adr-009.md`
- `.compozy/tasks/autonomous/adrs/adr-010.md`
- `.compozy/tasks/autonomous/adrs/adr-011.md`
- `.compozy/tasks/autonomous/memory/MEMORY.md`
- `.compozy/tasks/autonomous/memory/task_12.md`
- Verification: post-commit `make verify` passed; focused `go test` package set, `go test ./internal/store -cover`, `make codegen-check`, `make web-typecheck`, and `make web-test` also passed.
- Commit: `0eff7b38 feat: add session lineage metadata`
