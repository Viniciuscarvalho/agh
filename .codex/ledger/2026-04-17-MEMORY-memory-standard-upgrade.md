Goal (incl. success criteria):

- Find the existing local research that identifies AGH memory-system deficits versus competitors, using `.compozy/`, `docs/`, `resources/*`, and `~/knowledge` via `qmd`.
- Translate confirmed deficits into concrete improvements in the AGH memory subsystem, with tests and full verification.

Constraints/Assumptions:

- User explicitly requested deep research plus concrete elevation of the memory standard, not a docs-only summary.
- Must use the `qmd`, `systematic-debugging`, `no-workarounds`, and `golang-pro` skills.
- Must use multiple exploration subagents with `gpt-5.4-mini` at `high` reasoning.
- Do not use destructive git commands or touch unrelated worktree changes.
- `make verify` must pass before completion.

Key decisions:

- Treat prior local research, ledgers, and competitor code as primary evidence; use `qmd` to recover note-based conclusions from `~/knowledge`.
- Separate the work into evidence collection, current-state inspection, gap synthesis, and root-cause-driven implementation.
- Prefer shipped code paths over aspirational docs when deciding what AGH actually lacks.

State:

- Completed. Research, implementation, codegen, and repository-wide verification all passed.

Done:

- Read root instructions and confirmed skill usage requirements.
- Scanned `.codex/ledger/` for cross-agent awareness and opened relevant prior ledgers.
- Confirmed `qmd` is installed and indexed collections include competitor and memory-related knowledge bases.
- Enumerated local files under `docs/`, `.compozy/`, `resources/`, and `internal/memory/`.
- Completed local research across docs, qmd notes, and competitor artifacts.
- Produced and got approval for the Phase 1 memory-upgrade plan.
- Identified the live integration points for memory in `internal/memory`, `internal/session`, `internal/api`, `internal/cli`, and `internal/store/globaldb`.
- Persisted the accepted plan under `.codex/plans/2026-04-17-memory-standard-upgrade.md`.
- Implemented a derived SQLite FTS5 memory catalog in the shared global DB file.
- Made `MEMORY.md` loading resilient by synthesizing prompt-safe indexes from actual memory files when the index is missing or stale.
- Added daemon/API/CLI support for memory search and explicit reindex operations.
- Added bounded per-turn recall via `session.WithPromptInputAugmenter` before ACP prompt dispatch while preserving the stored raw user message.
- Expanded memory health payloads with config and catalog stats.
- Wired memory operation log rows into global observe event summaries and added tests covering the new behavior.
- Reproduced and fixed two root causes during implementation:
  - invalid FTS5 tokenizer ordering (`unicode61 porter` -> `porter unicode61`)
  - stale workspace-root derivation that still expected `.compozy/memory` instead of `.agh/memory`
- Targeted package tests pass for `internal/memory`, `internal/session`, `internal/cli`, `internal/api/httpapi`, `internal/api/udsapi`, and `internal/store/globaldb`.
- Regenerated OpenAPI artifacts (`openapi/agh.json`, `web/src/generated/agh-openapi.d.ts`) after adding the memory API surface.
- `make verify` passed.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-memory-standard-upgrade.md`
- `.codex/plans/2026-04-17-memory-standard-upgrade.md`
- `.codex/ledger/2026-04-15-MEMORY-extensibility-comparison.md`
- `.codex/ledger/2026-04-06-MEMORY-daemon-dreams.md`
- `docs/ideas/market-pair/gap-analysis.md`
- `internal/memory/*.go`
- `internal/session/manager_prompt.go`
- `internal/session/manager_test.go`
- `internal/api/core/memory.go`
- `internal/api/httpapi/handlers_test.go`
- `internal/api/httpapi/routes.go`
- `internal/api/udsapi/handlers_test.go`
- `internal/api/udsapi/routes.go`
- `internal/cli/client.go`
- `internal/cli/client_test.go`
- `internal/cli/memory.go`
- `internal/store/globaldb/global_db.go`
- `internal/store/globaldb/global_db_observe.go`
- `internal/store/globaldb/global_db_test.go`
- `go test ./internal/memory ./internal/session ./internal/cli ./internal/api/httpapi ./internal/api/udsapi ./internal/store/globaldb -count=1`
- `internal/store/globaldb/*.go`
