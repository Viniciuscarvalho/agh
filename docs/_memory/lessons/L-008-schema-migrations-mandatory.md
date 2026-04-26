# L-008 — Schema migrations are required even on fresh DBs

**Class:** Persistence
**Date discovered:** 2026-04-25 (Hermes BUG-002, Critical)
**Evidence sources:** Hermes BUG-002 + multiple Hermes/autonomy review issues

## Context

The Hermes track widened the `memory_operation_log` table to add `scope`, `workspace_root`, `filename` columns. The change worked on fresh installs because `internal/memory/catalog.go` boots through `storepkg.EnsureSchema`, which created the new shape. But existing databases kept the old five-column table — `EnsureSchema` skipped existing tables — and `agh memory write` failed on upgrade with `no such column: scope`.

CodeRabbit flagged it as Critical. The fix: schema migration v6 added through the deterministic migrations runner.

## Root cause

`EnsureSchema`-style boot reconciliation has a fundamental gap: it creates tables that don't exist but does not mutate tables that do. Any column/index/constraint addition needs a real migration; a migration is required _even when fresh installs already work_, because upgrade is a first-class scenario in alpha.

A second contributor: AGH had two schema paths — the global DB used a real migrations registry, while the catalog DB used `EnsureSchema`. Drift between these paths produced the bug.

## Rule

> Any change to a SQLite column, index, or constraint MUST add a versioned migration in the migrations registry. `EnsureSchema`-style boot reconciliation is forbidden for column changes. Test fresh-DB AND reopen-after-restart paths.

## Operationalization

- **One schema migration primitive shared by all SQLite databases** (`agh.db`, `events.db`, catalog DBs, automation scheduler state, memory operation log).
- **Numbered migrations** are recorded in `schema_migrations`. Idempotent. Wrapped in transactions.
- **Test the upgrade path:** every schema change must include a `Test*FreshDB` test AND a `Test*ReopenAfterRestart` test.
- **`SQLite recovery code paths must rename or remove `-wal`and`-shm`companions, not only the`.db` file.** (Cross-cutting hygiene: see refac-v2 issue 001 Critical WAL recovery bug.)
- **Schema-version bump** lives in the migrations registry — do not encode it in code constants.

## Allowed exception

In greenfield alpha, a hard-cut rename + table rewrite without compat migration is allowed when:

1. The change is documented in the techspec's "Delete Targets" section.
2. All callers of the old shape are deleted in the same change.
3. Per-developer wipe of local SQLite is acceptable cost.

## Anti-pattern

- `CREATE TABLE IF NOT EXISTS new_columns ...` then expecting the table to grow.
- Schema-version constants in Go code that don't match the migrations registry.
- Tests that only cover fresh-DB.

## Source

- `.codex/ledger/2026-04-25-MEMORY-hermes-qa-execution.md` (BUG-002)
- `.compozy/tasks/hermes/reviews-001/issue_020.md` (Critical)
- `.compozy/tasks/refac-v2/reviews-001/issue_001.md` (WAL/SHM Critical)
- `.compozy/tasks/autonomous/memory/task_07.md` (claim/lease schema v7)
- `../analysis/analysis_global_runs.md` lesson L1, `../analysis/analysis_local_runs.md` lesson LL-2
