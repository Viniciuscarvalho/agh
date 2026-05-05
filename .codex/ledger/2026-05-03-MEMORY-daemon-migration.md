# Goal (incl. success criteria):

- Diagnose and fix the root cause of `agh daemon start` failing on migration 11 (`unify_secret_refs`) against an existing `~/.agh/agh.db`.
- Success requires a production-code fix plus regression coverage that upgrades the real stale schema path without asking operators to recreate the database, followed by `make verify`.

# Constraints/Assumptions:

- Use `systematic-debugging` before proposing fixes; root cause first.
- Avoid workarounds; fix the migration/validation source of truth.
- No destructive git commands without explicit user permission.
- Follow root AGENTS instructions and `internal/CLAUDE.md`.

# Key decisions:

- Inspect both code and the user’s actual local SQLite schema before editing.
- Treat existing ledgers/plans around vault secret unification as cross-agent context only.

# State:

- Investigating; migration bug fixed, startup verification exposed a second pre-existing boot blocker in resource reconciliation.

# Done:

- Read root instructions supplied in-thread, `internal/CLAUDE.md`, `systematic-debugging`, and `no-workarounds`.
- Scanned existing ledgers/plans and identified the related vault-secret-unification artifacts.
- Located the failing migration and guardrail in `internal/store/globaldb/global_db.go`.
- Confirmed the git worktree is clean before any edits.
- Inspected the real `~/.agh/agh.db` and confirmed `schema_migrations` stops at v10 while `bridge_secret_bindings` still uses the legacy `vault_ref` column.
- Added a focused regression test that reproduces the failure by reopening a v10 database whose `bridge_secret_bindings` column name is `vault_ref`; the test currently fails with the same migration 11 error as the user report.
- Patched migration 11 so it renames `bridge_secret_bindings.vault_ref` to `secret_ref` when that known legacy shape is present.
- Verified the new regression test and the full `./internal/store/globaldb` package now pass.
- Built the binary and replayed `./bin/agh daemon start` against an isolated copy of `~/.agh`; migration 11 no longer blocks startup, but boot now fails later during resource reconciliation on a persisted `agent` resource record.
- Traced the second boot blocker to legacy daemon-managed `agent` resource records that still persisted `Tools:["*"]`, which the current tool grammar now rejects.
- Switched managed agent/skill/MCP source sync to enumerate current records through `resources.RawStore` and compare canonical raw bytes, so daemon-managed sync can replace or delete invalid legacy records before typed decoding.
- Added daemon regression coverage that seeds a legacy managed agent record with `Tools:["*"]` and proves `Sync()` repairs it.
- Rebuilt the binary and replayed `./bin/agh daemon start` plus `daemon stop` against an isolated copy of `~/.agh`; startup now succeeds, schema migrations reach v13, `bridge_secret_bindings` ends with `secret_ref`, and zero legacy `agent` resource records remain with `Tools:["*"]`.

# Now:

- Run `make verify`.

# Next:

- Report the final fix and verification evidence.

# Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether any other pre-v11 bridge schema shape exists beyond `vault_ref` without `secret_ref`.
- UNCONFIRMED: whether other daemon-managed resource kinds may have analogous invalid legacy records beyond the ones now protected by raw sync listing.

# Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-03-MEMORY-daemon-migration.md`
- Context: `.codex/ledger/2026-05-01-MEMORY-vault-secret-unification.md`, `.codex/plans/2026-05-01-vault-secret-unification.md`
- Code: `internal/store/globaldb/global_db.go`, `internal/store/globaldb/global_db_bridges_test.go`
- Evidence:
  - `sqlite3 ~/.agh/agh.db '.schema bridge_secret_bindings'` shows `vault_ref TEXT NOT NULL`
  - `sqlite3 ~/.agh/agh.db 'SELECT version, name FROM schema_migrations ORDER BY version'` ends at v10
  - `go test ./internal/store/globaldb -run TestOpenGlobalDBMigratesLegacyBridgeSecretBindingsVaultRefColumn -count=1` fails with migration 11 stale-schema error
  - After the fix, `go test ./internal/store/globaldb -run TestOpenGlobalDBMigratesLegacyBridgeSecretBindingsVaultRefColumn -count=1` passes
  - `go test ./internal/store/globaldb -count=1` passes
  - `AGH_HOME=<isolated copy of ~/.agh> ./bin/agh daemon start` now fails later with `boot resource reconcile ... decode record "agent"/"daemon.sync.agent.62d7bb0cebc8eb6faf654a96"`
  - The failing resource record contains `Tools:["*"]`, while `internal/config/tool_grammar.go` rejects global wildcard tool specs.
  - Focused tests pass:
    - `go test ./internal/store/globaldb ./internal/daemon -run 'Test(OpenGlobalDBMigratesLegacyBridgeSecretBindingsVaultRefColumn|AgentSkillSourceSyncerReplacesCanonicalSnapshot|AgentSkillSourceSyncerRepairsLegacyManagedAgentRecordsBeforeDecode)$' -count=1`
  - Operational replay passes:
    - `AGH_HOME=<isolated copy of ~/.agh> ./bin/agh daemon start`
    - `AGH_HOME=<isolated copy of ~/.agh> ./bin/agh daemon stop`
    - migrated copy reports schema versions 10-13, `bridge_secret_bindings.secret_ref`, and `COUNT(*) = 0` for `agent` resource records containing `Tools:["*"]`
