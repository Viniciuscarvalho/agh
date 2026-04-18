# AGH Memory Standard Upgrade

## Summary

Raise AGH's memory standard without replacing Markdown as the human source of truth. The first implementation cut adds a derived SQLite FTS5 catalog, fixes memory discoverability when `MEMORY.md` is missing or stale, exposes search and reindex operations through the daemon surfaces, and introduces bounded per-turn recall before prompt dispatch.

## Phase 1 Scope

### Retrieval foundation

- Keep Markdown memory files as the source of truth.
- Add a derived SQLite FTS5 catalog hosted in the global database.
- Index, at minimum:
  - `scope`
  - `workspace_id`
  - `workspace_root`
  - `filename`
  - `type`
  - `name`
  - `description`
  - `content`
  - `content_hash`
  - `updated_at`
- Standardize the memory backend around:
  - `List`
  - `Read`
  - `Write`
  - `Delete`
  - `Search`
  - `Reindex`
  - `LoadPromptIndex`

### Discoverability and index consistency

- Every daemon write and delete must keep the file store, `MEMORY.md`, and derived catalog in sync.
- `LoadPromptIndex` must not depend blindly on `MEMORY.md`.
- If `MEMORY.md` is missing, stale, or points at missing files:
  - synthesize a prompt-safe index from valid files
  - use the synthesized index for prompt assembly
  - do not overwrite files during read-only synthesis
- Reserve explicit rebuilds for `reindex`.

### Search and per-turn recall

- Add public search and reindex surfaces:
  - `GET /api/memory/search?q=...&scope=...&workspace=...&limit=...`
  - `POST /api/memory/reindex`
  - `agh memory search <query> [--scope global|workspace] [--limit N]`
  - `agh memory reindex [--scope ...]`
- Return a unified result shape containing:
  - `filename`
  - `scope`
  - `workspace`
  - `type`
  - `name`
  - `description`
  - `score`
  - `snippet`
  - `mod_time`
- Integrate turn recall before `driver.Prompt` using the normalized turn message.
- Search both global memory and the current workspace memory.
- Bound injected recall to:
  - at most 3 results
  - at most 1500 total characters
  - include `name`, `scope`, `snippet`, and staleness notice when relevant
  - inject nothing when nothing clears the threshold
- Keep startup prompt assembly and add `agh memory search` to the exposed memory guidance.

### Operational minimum

- Expand memory health/settings exposure with:
  - `memory.enabled`
  - `memory.global_dir`
  - `dream.agent`
  - `dream.min_hours`
  - `dream.min_sessions`
  - `dream.check_interval`
  - `indexed_files`
  - `orphaned_files`
  - `last_reindex`
- Add memory observability events for:
  - `memory.write`
  - `memory.delete`
  - `memory.search`
  - `memory.reindex`
  - `memory.consolidation.started`
  - `memory.consolidation.completed`
  - `memory.consolidation.skipped`
  - `memory.consolidation.failed`

## Deferred Follow-Up

- Phase 2 will add explicit `session/working`, `durable`, and `episodic` lifecycle layers.
- Phase 3 will keep the same memory contract while adding optional vector and graph backends.
- `team/shared` stays out of the first cut until daemon actor identity is stable enough.

## Defaults and Assumptions

- Use SQLite FTS5 lexical retrieval in Phase 1.
- Treat the catalog as derived and rebuildable.
- Implement the full Phase 1 cut in this branch without mixing in Phase 2 or 3.

## Verification Targets

- Write and delete keep Markdown files, `MEMORY.md`, and the catalog consistent.
- Prompt index loading synthesizes safe output when `MEMORY.md` is missing or stale.
- Search respects ranking and workspace isolation.
- CLI and API search surfaces return the same shape.
- Turn recall injects bounded context without losing the original user message in storage.
- Health/settings expose the new memory stats.
- `make verify` passes.
