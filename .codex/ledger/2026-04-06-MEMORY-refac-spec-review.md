Goal (incl. success criteria):

- Audit `.compozy/tasks/refac/` for incorrect or stale specifications, align the task files with the current AGH codebase and supporting analysis docs, and leave the task set structurally valid and internally consistent.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/refac/` documents unless a supporting read from the codebase or skill references is needed to verify a claim.
- Must not touch unrelated worktree changes or use destructive git commands.
- `.compozy/config.toml` is absent, so task `type` values should rely on Compozy defaults unless another config source is found.
- Review should prefer correcting false specifics over preserving aggressive but inaccurate refactor prescriptions.

Key decisions:

- Use `cy-create-tasks` as the task-file structure baseline and validate specs against the actual repository tree and line counts.
- Use current codebase state, not only the analysis docs, as the authority for paths, package boundaries, and already-completed refactors.
- Treat missing or outdated concrete claims (file names, line counts, package assumptions, API differences) as spec bugs that should be edited.

State:

- Completed.

Done:

- Read root instructions, task-file skill guidance, and all existing ledgers for cross-agent awareness.
- Read `.compozy/tasks/refac/_techspec.md`, `_tasks.md`, `20260406-summary.md`, and `task_01.md` through `task_04.md` (task_01 still needs a focused reread because the first pass was truncated in tool output).
- Confirmed `.compozy/config.toml` is missing.
- Identified likely drift areas: line counts, package/file split assumptions, and handler layout expectations.
- Verified current repository facts for the refac scope: oversized file counts, `udsapi`/`httpapi` layouts, duplicated helper locations, missing `ApprovePermission` in `udsapi.SessionManager`, and the real `atomicWriteFile` durability difference (`memory/store.go` is the variant missing `Sync`).
- Corrected `.compozy/tasks/refac/_techspec.md` to remove contradictory package assumptions, include `apitest`, fix Phase 2 split targets/counts, and loosen the over-specific `fileSnapshot` placement decision.
- Corrected `.compozy/tasks/refac/_tasks.md` complexity ratings and dependency table formatting.
- Corrected `task_01.md` through `task_04.md` to fix stale counts, wrong helper references, misleading package-placement constraints, and over-prescriptive implementation wording.
- Corrected high-level analysis docs where the actionable specs depended on stale counts or split lists: `20260406-summary.md`, `20260406-api-layer.md`, `20260406-storage-observe-memory.md`, and `20260406-skills-workspace.md`.
- Ran `compozy validate-tasks --name refac` successfully (`all tasks valid (4 scanned)`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: deeper per-package analysis prose may still describe the original analysis snapshot rather than an exact current-tree measurement, but the master task list, techspec, summary, and all task files are now internally consistent and validated.

Working set (files/ids/commands):

- Files: `.compozy/tasks/refac/*`, `.codex/ledger/2026-04-06-MEMORY-refac-spec-review.md`
- Commands: `find`, `rg`, `wc -l`, `sed`, `compozy validate-tasks --name refac`, `git diff --stat -- .compozy/tasks/refac ...`.
