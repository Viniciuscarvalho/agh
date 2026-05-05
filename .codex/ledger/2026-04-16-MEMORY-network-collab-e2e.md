Goal (incl. success criteria):

- Implement PRD task_03: composition-root runtime network collaboration scenarios under `internal/daemon` using the shared runtime harness and mock ACP agents.
- Success means direct reply lifecycle plus whois/recipe exchange are covered end to end with public-surface assertions, focused helper/unit coverage exists, workflow/task tracking is updated, `make verify` passes, and one local commit is created.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify`.
- Must read/update `.compozy/tasks/e2e/memory/MEMORY.md` and `.compozy/tasks/e2e/memory/task_03.md`.
- Must keep scope tight to task_03; do not touch unrelated worktree changes.
- `make verify` is mandatory before any completion or commit claim.

Key decisions:

- Reuse the subprocess-backed shared runtime harness in `internal/testutil/e2e/` as the composition-root seam.
- Prefer domain-specific network assertions through HTTP/UDS/CLI payloads and captured daemon-owned artifacts instead of transcript-only checks.
- Skip `brainstorming` because the PRD/techspec/ADRs already define the design envelope for this implementation task.

State:

- Completed.

Done:

- Read repo instructions (`AGENTS.md`, `CLAUDE.md`), required skill docs, workflow memory, task_03, `_techspec.md`, `_tasks.md`, and ADR-003/004/005.
- Reconciled workspace state; found pre-existing task-tracking edits and untracked memory/meta files that are unrelated to this run and must be left intact.
- Confirmed the pre-change gap: there are no composition-root daemon E2E tests for the required direct reply and whois/recipe flows; the harness currently captures some network artifacts but lacks explicit network-enabled seeding and typed network helpers for these scenarios.
- Added explicit network enablement to the shared runtime harness, persisted the seeded `[network]` config overlay, and installed a real `agh` shim into the seeded runtime `PATH`.
- Added typed public-surface helpers plus stable network artifact capture for channel messages and decoded audit snapshots in `internal/testutil/e2e`.
- Added composition-root daemon integration scenarios for direct reply lifecycle and whois/recipe exchange, plus focused assertion/helper unit coverage and the `network_collaboration_fixture.json` mock-agent fixture.
- Updated workflow memory and task tracking for task_03 completion while keeping tracking-only files unstaged.
- Created local commit `e790c044` (`test: add network collaboration e2e scenarios`).
- Clean verification passed on `HEAD` via `make verify` on 2026-04-16 21:03:37 -0300.

Now:

- None.

Next:

- Optionally delete this ledger after handoff.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-16-MEMORY-network-collab-e2e.md`
- `.compozy/tasks/e2e/memory/MEMORY.md`
- `.compozy/tasks/e2e/memory/task_03.md`
- `.compozy/tasks/e2e/task_03.md`
- `.compozy/tasks/e2e/_tasks.md`
- `internal/daemon/daemon_network_collaboration_integration_test.go`
- `internal/daemon/network_e2e_assertions_test.go`
- `internal/testutil/acpmock/testdata/network_collaboration_fixture.json`
- `internal/testutil/e2e/runtime_harness.go`
- `internal/testutil/e2e/config_seed.go`
- `internal/testutil/e2e/config_seed_test.go`
- `internal/testutil/e2e/*_test.go`
- `make verify`
- `git status --short`
- `rg -n --hidden ...`
