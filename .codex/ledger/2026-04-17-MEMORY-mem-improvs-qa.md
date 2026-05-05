Goal (incl. success criteria):

- Generate `qa-report` planning artifacts for the memory improvements that were just implemented, using `.compozy/tasks/mem-improvs/qa/` as the output root.
- Success means a test plan, regression suite, and traceable manual test cases exist for the new memory catalog/search/reindex/recall behavior and its key regressions.

Constraints/Assumptions:

- User asked for `qa-report`, not live execution; do not run verification gates as part of this task.
- The requested path `.compozy/tasks/mem-improvs` did not exist; use it as the QA artifact root and derive implementation context from the real work in `.codex/plans/2026-04-17-memory-standard-upgrade.md`, `.codex/ledger/2026-04-17-MEMORY-memory-standard-upgrade.md`, and the current git diff.
- Do not touch unrelated worktree changes.
- Figma validation is not applicable unless a memory UI surface appears; none was found in the changed scope.

Key decisions:

- Treat `.compozy/tasks/mem-improvs` as a new QA artifact container rather than rewriting archived task directories.
- Base the QA scope on the actual implemented Phase 1 memory standard upgrade: derived SQLite catalog, prompt-index synthesis, public search/reindex surfaces, bounded prompt recall, and memory health/observability additions.
- Focus on backend, CLI, HTTP/UDS, and session-prompt integration; web/Figma flows are out of scope for this planning pass.

State:

- Completed.

Done:

- Read workspace instructions and the provided `qa-report` skill.
- Scanned `.codex/ledger/` and `.codex/plans/` for related memory-upgrade context.
- Confirmed the user-mentioned path `.compozy/tasks/mem-improvs` was absent.
- Located the real implementation context in the current git diff and the persisted plan/ledger for `memory-standard-upgrade`.
- Created the QA output directories under `.compozy/tasks/mem-improvs/qa/`.
- Inspected key changed files and tests covering search, reindex, prompt recall, health stats, and observe summaries.
- Wrote the memory QA test plan at `.compozy/tasks/mem-improvs/qa/test-plans/memory-standard-upgrade-test-plan.md`.
- Wrote the regression suite at `.compozy/tasks/mem-improvs/qa/test-plans/memory-standard-upgrade-regression.md`.
- Wrote 14 traceable manual test cases covering smoke, functional, integration, regression, security, and performance flows.
- Ran a completeness check confirming all generated test cases include expected outcomes and that the planned artifact set exists on disk.

Now:

- None.

Next:

- Hand off the generated QA artifact paths to the user.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-mem-improvs-qa.md`
- `.codex/ledger/2026-04-17-MEMORY-memory-standard-upgrade.md`
- `.codex/plans/2026-04-17-memory-standard-upgrade.md`
- `.compozy/tasks/mem-improvs/qa/`
- `.compozy/tasks/mem-improvs/qa/test-plans/memory-standard-upgrade-test-plan.md`
- `.compozy/tasks/mem-improvs/qa/test-plans/memory-standard-upgrade-regression.md`
- `.compozy/tasks/mem-improvs/qa/test-cases/*.md`
- `git status --short`
- `git diff --stat`
- `internal/memory/catalog.go`
- `internal/memory/recall.go`
- `internal/memory/store.go`
- `internal/api/core/memory.go`
- `internal/cli/memory.go`
- `internal/session/manager_prompt.go`
- `internal/store/globaldb/global_db_observe.go`
- `internal/memory/store_test.go`
- `internal/api/httpapi/memory_test.go`
- `internal/api/udsapi/memory_test.go`
- `internal/cli/memory_test.go`
- `internal/session/manager_test.go`
